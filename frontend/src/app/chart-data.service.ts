import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { STOCK_PRICE_KEY } from '../shared/charttypes';
import { mean, standardDeviation } from 'simple-statistics';

import { Ratio } from '../shared/ratio-definition.type';

@Injectable({
  providedIn: 'root',
})
export class ChartDataService {
  STOCK_PRICE_URL = `${environment.apiBaseUrl}:${environment.pricePort}/${environment.priceRoute}`;
  readonly STOCK_PRICE_KEY = STOCK_PRICE_KEY;

  valueDevelopmentQuery = `
  query($SimFinId: Int!) {
    financialStatements(SimFinId: $SimFinId) {
      FiscalYear
      ReportDate
      SharesDiluted
      %DATATYPEKEYS%
      Company {
        CompanyName
      }
    }
  }`;

  industryComparisonQuery = `
    query($SimFinId: Int!) {
      company(SimFinId: $SimFinId) {
        Industry {
          Industry
          Companies {
            CompanyName
            SimFinId
            FinancialStatements {
              FiscalYear
              ReportDate
              SharesDiluted
              %DATATYPEKEYS%
              Company {
                SimFinId
              }
            }
          }
        }
      }
    }
  `;

  constructor(private apollo: Apollo, private http: HttpClient) {}

  async fetchLatestPrice(companyId: string) {
    const date = new Date();
    const toString = `${
      date.getMonth() + 1
    }-${date.getDate()}-${date.getFullYear()}`;

    date.setMilliseconds(date.getMilliseconds() - 1000 * 60 * 60 * 24 * 5);
    const fromString = `${
      date.getMonth() + 1
    }-${date.getDate()}-${date.getFullYear()}`;

    const quotes = await this.fetchStockQuotes(companyId, fromString, toString);

    const sortedQuotes = quotes
      .map((q) => {
        return {
          ...q,
          Date: new Date(q.Date),
        };
      })
      .sort((q1, q2) => q1.Date.getTime() - q2.Date.getTime());

    return sortedQuotes.pop();
  }

  async fetchStockQuotes(
    companyId: string,
    fromString: string = '01-01-2011',
    toString: string = '12-31-2021'
  ) {
    return this.http
      .get(`${this.STOCK_PRICE_URL}/${companyId}`, {
        params: {
          from: fromString,
          to: toString,
        },
      })
      .pipe(
        map((quotes: any[]) => {
          // tslint:disable-next-line:no-shadowed-variable
          const stockQuotes = quotes.map((q) => {
            return {
              ...q,
              Date: new Date(q.Date),
            };
          });

          return stockQuotes;
        })
      )
      .toPromise();
  }

  fetchFundamentalIndustryData(companyId: string, chartRatio: Ratio) {
    const dataQuery = this.getIndustryComparisonQuery(chartRatio);

    return this.apollo
      .query({
        query: dataQuery,
        variables: {
          SimFinId: companyId,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((res: any) => {
          const industryFinancialStatements =
            this.extractFinancialStatements(res);
          const  cleansedFinancialStatements = this.cleanseFinancialStatements(industryFinancialStatements, chartRatio);

          const companyValue = this.extractCompanyValue(
            companyId,
            chartRatio,
            cleansedFinancialStatements
          );

          const valueDataSeries = this.computeValueDataSeries(
            cleansedFinancialStatements,
            chartRatio
          );

          const cleansedDataSeries = this.removeDataSeriesOutliers(
            valueDataSeries,
            companyValue
          );

          const INTERVAL_COUNT = Math.ceil(
            Math.sqrt(cleansedDataSeries.length)
          );

          const minValue = cleansedDataSeries[0].value;
          const maxValue =
            cleansedDataSeries[cleansedDataSeries.length - 1].value;
          const intervalLength = (maxValue - minValue) / (INTERVAL_COUNT - 1);

          const industryDistributionSeries =
            this.computeIndustryDistributionSeries(
              minValue,
              intervalLength,
              cleansedDataSeries,
              INTERVAL_COUNT
            );

          const colorScheme = this.computeIndustryDataColorScheme(
            companyValue,
            minValue,
            intervalLength,
            INTERVAL_COUNT
          );

          return {
            data: industryDistributionSeries,
            colorScheme,
          };
        })
      )
      .toPromise();
  }

  private cleanseFinancialStatements(statements, chartRatio: Ratio) {
    if (!chartRatio.denominatorType) {
      return statements;
    }
    const cleansedStatements = statements.filter(s => s[chartRatio.denominatorType.gqlKey]);
    return cleansedStatements;
  }

  private removeDataSeriesOutliers(dataSeries, companyValue) {
    const values = dataSeries.map((d) => d.value);
    const seriesMean = mean(values);
    const seriesDeviation = standardDeviation(values);

    const lowerBoundary = seriesMean - 2 * seriesDeviation;
    const upperBoundary = seriesMean + 2 * seriesDeviation;

    const companyIsOutlier =
      companyValue < lowerBoundary || companyValue > upperBoundary;
    if (companyIsOutlier) {
      return dataSeries;
    }

    const cleansedDataSeries = [];
    for (const dataPoint of dataSeries) {
      if (
        dataPoint.value >= lowerBoundary &&
        dataPoint.value <= upperBoundary
      ) {
        cleansedDataSeries.push(dataPoint);
      }
    }

    return cleansedDataSeries;
  }

  private extractCompanyValue(companyId, chartRatio, financialStatements) {
    for (const statement of financialStatements) {
      // tslint:disable-next-line:triple-equals
      if (statement.Company.SimFinId == companyId) {
        return this.getChartDataSeries([statement], chartRatio)[0].value;
      }
    }

    return -666;
  }

  private extractFinancialStatements(res) {
    const companies = res.data['company']['Industry']['Companies'];

    const industryFinancialStatements = [];
    for (const company of companies) {
      const financialStatements = company['FinancialStatements'];

      const sortedFinancialStatements = financialStatements
        .map((f) => {
          return {
            ...f,
            timestamp: new Date(f.ReportDate).getTime(),
          };
        })
        .sort((f1, f2) => f2.timestamp - f1.timestamp);

      if (!sortedFinancialStatements.length) {
        continue;
      }

      const latestFinancialStatement = sortedFinancialStatements[0];
      industryFinancialStatements.push(latestFinancialStatement);
    }

    return industryFinancialStatements;
  }

  private computeValueDataSeries(
    industryFinancialStatements: any[],
    chartRatio: Ratio
  ) {
    const sortedIndustryFinancialStatements = industryFinancialStatements.sort(
      (i1, i2) => i2.timestamp - i1.timestamp
    );

    // filter out companies that went bancrupt multiple years ago.
    const latestReportYear = new Date(
      sortedIndustryFinancialStatements[0].timestamp
    ).getFullYear();
    const filteredIndustryFinancialStatements =
      sortedIndustryFinancialStatements.filter((s) => {
        const reportYear = new Date(s.timestamp).getFullYear();
        return reportYear >= latestReportYear - 1;
      });

    const dataSeries = this.getChartDataSeries(
      filteredIndustryFinancialStatements,
      chartRatio
    );
    const sortedDataSeries = dataSeries.sort((d1, d2) => d1.value - d2.value);
    return sortedDataSeries;
  }

  private computeIndustryDataColorScheme(
    companyValue: any,
    minValue: any,
    sectionLength: number,
    sectionCount: number
  ) {
    const colorScheme = {
      domain: [],
    };

    for (let i = 0; i < sectionCount; i++) {
      colorScheme.domain.push('rgb(173, 205, 237)');
    }

    const currentCompanyPercentile = Math.floor(
      (companyValue - minValue) / sectionLength
    );

    colorScheme.domain[currentCompanyPercentile] = 'rgb(169, 89, 99)';
    return colorScheme;
  }

  private computeIndustryDistributionSeries(
    minValue: any,
    sectionLength: number,
    sortedDataSeries: any,
    sectionCount: number
  ) {
    const industryDataSeries = [];
    for (let i = 1; i <= sectionCount; i++) {
      industryDataSeries.push({
        value: 0,
        name: `${(
          minValue +
          (i - 1) * sectionLength +
          0.5 * sectionLength
        ).toFixed(2)}`,
      });
    }

    for (const dataPoint of sortedDataSeries) {
      const percentile = Math.floor(
        (dataPoint.value - minValue) / sectionLength
      );
      industryDataSeries[percentile].value =
        industryDataSeries[percentile].value + 1;
    }
    return industryDataSeries;
  }

  fetchFundamentalItemData(companyId: string, chartRatio: Ratio) {
    const dataQuery = this.getValueDevelopmentQuery(chartRatio);

    return this.apollo
      .query({
        query: dataQuery,
        variables: {
          SimFinId: companyId,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((res: any) => {
          const financialReports = res.data['financialStatements'];
          const series = this.getChartDataSeries(financialReports, chartRatio);
          const name = this.getChartDataName(chartRatio);

          return {
            name,
            series,
          };
        })
      )
      .toPromise();
  }

  private getIndustryComparisonQuery(chartRatio: Ratio) {
    if (chartRatio.denominatorType) {
      return gql`
        ${this.industryComparisonQuery.replace(
          '%DATATYPEKEYS%',
          [
            chartRatio.numeratorType.gqlKey,
            chartRatio.denominatorType.gqlKey,
          ].join(' ')
        )}
      `;
    } else {
      return gql`
        ${this.industryComparisonQuery.replace(
          '%DATATYPEKEYS%',
          chartRatio.numeratorType.gqlKey
        )}
      `;
    }
  }

  private getValueDevelopmentQuery(chartRatio: Ratio) {
    if (chartRatio.denominatorType) {
      return gql`
        ${this.valueDevelopmentQuery.replace(
          '%DATATYPEKEYS%',
          [
            chartRatio.numeratorType.gqlKey,
            chartRatio.denominatorType.gqlKey,
          ].join(' ')
        )}
      `;
    } else {
      return gql`
        ${this.valueDevelopmentQuery.replace(
          '%DATATYPEKEYS%',
          chartRatio.numeratorType.gqlKey
        )}
      `;
    }
  }

  private getChartDataName(chartRatio: Ratio) {
    if (chartRatio.denominatorType) {
      return `${chartRatio.numeratorType.title} / ${chartRatio.denominatorType.title}`;
    } else {
      return `${chartRatio.numeratorType.title}`;
    }
  }

  private getChartDataSeries(financialReports, chartRatio: Ratio) {
    if (chartRatio.denominatorType) {
      return this.getNumeratorDenominatorDataSeries(
        financialReports,
        chartRatio.numeratorType.gqlKey,
        chartRatio.denominatorType.gqlKey
      );
    } else {
      return this.getNumeratorDataSeries(
        financialReports,
        chartRatio.numeratorType.gqlKey
      );
    }
  }

  private getNumeratorDataSeries(financialReports, numeratorGqlKey: string) {
    const series = financialReports.map((d) => {
      const numeratorData = d[numeratorGqlKey];

      const date = new Date(d.ReportDate);

      return {
        value: numeratorData,
        name: date,
      };
    });

    return series;
  }

  private getNumeratorDenominatorDataSeries(
    financialReports,
    numeratorGqlKey: string,
    denominatorGqlKey: string
  ) {
    const series = financialReports.map((d) => {
      const numeratorData = d[numeratorGqlKey];
      const denominatorData = d[denominatorGqlKey];

      const date = new Date(d.ReportDate);

      if (denominatorData === null) {
        return {
          value: null,
          name: date,
        };
      }

      return {
        value: numeratorData / denominatorData,
        name: date,
      };
    });

    const nonNullSeries = series.filter((d) => d.value !== null);

    return nonNullSeries;
  }

  async fetchMarketItemData(
    companyId: string,
    chartRatio: Ratio,
    stockQuotes = null
  ) {
    if (!stockQuotes) {
      stockQuotes = await this.fetchStockQuotes(companyId);
    }

    const name = this.getChartDataName(chartRatio);

    if (!chartRatio.denominatorType) {
      // case1: only price

      const series = stockQuotes.map((q) => {
        return {
          value: q.Price,
          name: q.Date,
        };
      });

      return new Promise((resolve, reject) => {
        resolve({
          name,
          series,
        });
      });
    }

    const fundamentalKey =
      chartRatio.numeratorType.gqlKey === this.STOCK_PRICE_KEY
        ? chartRatio.denominatorType.gqlKey
        : chartRatio.numeratorType.gqlKey;

    const dataQuery: any = gql`
      ${this.valueDevelopmentQuery.replace(
        '%DATATYPEKEYS%',
        [fundamentalKey].join(' ')
      )}
    `;

    return this.apollo
      .query({
        query: dataQuery,
        variables: {
          SimFinId: companyId,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((res: any) => {
          const financialReports = res.data['financialStatements'];

          const fundamentalSeries = financialReports
            .map((d) => {
              const data = d['SharesDiluted']
                ? d[fundamentalKey] / d['SharesDiluted']
                : null;

              const date = new Date(d.ReportDate);

              return {
                value: data,
                timestamp: date.getTime(),
              };
            })
            .filter((f) => f.value);

          const stockQuotesSeries = stockQuotes.map((s) => {
            return {
              ...s,
              timestamp: s.Date.getTime(),
            };
          });

          const sortedFundamentalSeries = fundamentalSeries.sort(
            (d1, d2) => d1.timestamp - d2.timestamp
          );
          const sortedStockQuotes = stockQuotesSeries.sort(
            (s1, s2) => s1.timestamp - s2.timestamp
          );

          const series = [];

          let quotesCounter = 0;
          for (let i = 0; i < sortedFundamentalSeries.length - 1; i++) {
            const currentFundamanetalDataPoint = sortedFundamentalSeries[i];
            const nextFundamanetalDataPoint = sortedFundamentalSeries[i + 1];

            if (
              nextFundamanetalDataPoint.timestamp <
              sortedStockQuotes[0].timestamp
            ) {
              continue;
            }

            while (true) {
              const currentQuote = stockQuotesSeries[quotesCounter];

              if (
                currentQuote.timestamp < currentFundamanetalDataPoint.timestamp
              ) {
                // ignore
                quotesCounter += 1;
                continue;
              }

              if (
                currentQuote.timestamp >
                  currentFundamanetalDataPoint.timestamp &&
                currentQuote.timestamp < nextFundamanetalDataPoint.timestamp
              ) {
                if (chartRatio.numeratorType.gqlKey === this.STOCK_PRICE_KEY) {
                  // fundamental is denominator (nenner)
                  if (currentFundamanetalDataPoint.value !== 0) {
                    const value =
                      currentQuote.Price / currentFundamanetalDataPoint.value;

                    series.push({
                      value,
                      name: currentQuote.Date,
                    });
                  }
                } else {
                  // fundamental is numerator (zaehler)
                  if (currentQuote.Price !== 0) {
                    const value =
                      currentFundamanetalDataPoint.value / currentQuote.Price;

                    series.push({
                      value,
                      name: currentQuote.Date,
                    });
                  }
                }

                quotesCounter += 1;
                continue;
              }

              if (
                currentQuote.timestamp > nextFundamanetalDataPoint.timestamp
              ) {
                break;
              }
            }
          }

          const lastFundamentalDataPoint = sortedFundamentalSeries.pop();
          for (let i = quotesCounter; i < sortedStockQuotes.length; i++) {
            const currentQuote = sortedStockQuotes[i];

            if (
              currentQuote.timestamp >
              lastFundamentalDataPoint.timestamp + 1000 * 60 * 60 * 24 * 364
            ) {
              break;
            }

            if (chartRatio.numeratorType.gqlKey === this.STOCK_PRICE_KEY) {
              // fundamental is denominator (nenner)
              if (lastFundamentalDataPoint.value !== 0) {
                const value =
                  currentQuote.Price / lastFundamentalDataPoint.value;

                series.push({
                  value,
                  name: currentQuote.Date,
                });
              }
            } else {
              // fundamental is numerator (zaehler)
              if (currentQuote.Price !== 0) {
                const value =
                  lastFundamentalDataPoint.value / currentQuote.Price;

                series.push({
                  value,
                  name: currentQuote.Date,
                });
              }
            }
          }

          return {
            name,
            series,
          };
        })
      )
      .toPromise();
  }
}

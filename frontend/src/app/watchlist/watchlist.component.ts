import { Component, OnInit } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import {
  FINANCIAL_STABILITY_CHART_TYPES,
  PROFITABILITY_CHART_TYPES,
  OPERATIONAL_EFFICIENCY_CHART_TYPES,
} from '../../shared/charttypes';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { ChartDataService } from '../chart-data.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
})
export class WatchlistComponent implements OnInit {
  readonly FINANCIAL_STABILITY_CHART_TYPES = FINANCIAL_STABILITY_CHART_TYPES;
  readonly PROFITABILITY_CHART_TYPES = PROFITABILITY_CHART_TYPES;
  readonly OPERATIONAL_EFFICIENCY_CHART_TYPES =
    OPERATIONAL_EFFICIENCY_CHART_TYPES;
  readonly TOTAL_CHART_TYPES = [
    ...FINANCIAL_STABILITY_CHART_TYPES,
    ...PROFITABILITY_CHART_TYPES,
    ...OPERATIONAL_EFFICIENCY_CHART_TYPES,
  ];

  dataQuery = `
  query($SimFinId: Int!, $FiscalYearStart: Int, $FiscalYearEnd: Int) {
    financialStatements(SimFinId: $SimFinId, FiscalYearStart: $FiscalYearStart, FiscalYearEnd: $FiscalYearEnd) {
      FiscalYear
      %DATATYPEKEYS%
      Company {
        CompanyName
      }
    }
  }`;

  @LocalStorage('watchlistProperties')
  watchlistProperties;

  @LocalStorage('watchlist')
  watchlist;

  showPropertiesModal = false;

  constructor(
    private apollo: Apollo,
    private localStorage: LocalStorageService,
    private chartDataService: ChartDataService
  ) {}

  ngOnInit(): void {
    if (!this.watchlist) {
      this.watchlist = [];
    }

    if (!this.watchlistProperties) {
      this.watchlistProperties = [];
    }

    this.initializeSelectedChartTypes();
    this.updateWatchlistTable();
  }

  onCheckboxChange() {
    this.watchlistProperties = this.TOTAL_CHART_TYPES.filter(
      (c) => c['selected']
    );
  }

  onPropertyModalClosed() {
    this.updateWatchlistTable();
  }

  private initializeSelectedChartTypes() {
    const selectedResultProperties = this.watchlistProperties.map(
      (r) => r.numeratorType.gqlKey + r.denominatorType.gqlKey
    );

    for (const chartType of this.TOTAL_CHART_TYPES) {
      const isSelected = selectedResultProperties.includes(
        chartType.numeratorType.gqlKey + chartType.denominatorType.gqlKey
      );

      if (isSelected) {
        chartType['selected'] = true;
      } else {
        chartType['selected'] = false;
      }
    }
  }

  private updateWatchlistTable() {
    for (const company of this.watchlist) {
      this.fetchFairValue(company);
      this.fetchCurrentPrice(company);
      for (const property of this.watchlistProperties) {
        this.fetchItemData(company, property);
      }
    }
  }

  private fetchCurrentPrice(company) {
    this.chartDataService
      .fetchLatestPrice(company.SimFinId)
      .then((quote) => {
        company['currentPrice'] = quote.Price;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  private fetchFairValue(company) {
    const key = 'discountedCashflowData-' + company.SimFinId;
    const discountedCashflowData = this.localStorage.retrieve(key);

    if (discountedCashflowData) {
      company['fairValue'] = discountedCashflowData.fairValue;
    }
  }

  private fetchItemData(company, ratio) {
    const dataQuery = this.getChartDataQuery(ratio);

    this.apollo
      .query({
        query: dataQuery,
        variables: {
          SimFinId: company.SimFinId,
          FiscalYearStart: 2019, // TODO: Make dynamic!
          FiscalYearEnd: 2020,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((res) => res.data['financialStatements']))
      .subscribe((financialReports) => {
        // TODO: catch if 0 results
        const latestReport = financialReports.sort(
          (f1, f2) => f2.FiscalYear - f1.FiscalYear
        )[0];

        const numeratorData = latestReport[ratio.numeratorType.gqlKey];
        const denominatorData = latestReport[ratio.denominatorType.gqlKey];

        if (denominatorData) {
          company[ratio.title] = numeratorData / denominatorData;
        } else {
          company[ratio.title] = null;
        }
      });
  }

  private getChartDataQuery(ratio) {
    if (ratio.denominatorType) {
      return gql`
        ${this.dataQuery.replace(
          '%DATATYPEKEYS%',
          [ratio.numeratorType.gqlKey, ratio.denominatorType.gqlKey].join(' ')
        )}
      `;
    } else {
      return gql`
        ${this.dataQuery.replace('%DATATYPEKEYS%', ratio.numeratorType.gqlKey)}
      `;
    }
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { LocalStorage } from 'ngx-webstorage';

import {
  FINANCIAL_STABILITY_CHART_TYPES,
  PROFITABILITY_CHART_TYPES,
  OPERATIONAL_EFFICIENCY_CHART_TYPES,
} from '../../../shared/charttypes';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
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

  @Input('filterResults') set setFilterResults(res) {
    this.filterResults = res;
    this.updateResultsTable();
  }

  filterResults = [];

  showResultPropertiesModal = false;
  selectedResultProperties = [];

  @LocalStorage('screeningResultProperties')
  resultProperties;

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    if (!this.resultProperties) {
      this.resultProperties = [];
    }

    this.initializeSelectedChartTypes();
    this.updateResultsTable();
  }

  onCheckboxChange() {
    this.resultProperties = this.TOTAL_CHART_TYPES.filter((c) => c['selected']);
  }

  onPropertyModalClosed() {
    this.updateResultsTable();
  }

  private initializeSelectedChartTypes() {
    const selectedResultProperties = this.resultProperties.map(
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

  private updateResultsTable() {
    for (const company of this.filterResults) {
      for (const property of this.resultProperties) {
        this.fetchItemData(company, property);
      }
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

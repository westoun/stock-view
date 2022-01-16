import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { v4 as uuidv4 } from 'uuid';
import {
  BALANCE_SHEET_DATA_TYPES,
  INCOME_STATEMENT_DATA_TYPES,
  CASHFLOW_STATEMENT_DATA_TYPES
} from '../../../shared/graphql-datatypes';
import { LocalStorage } from 'ngx-webstorage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss'],
})
export class CriteriaComponent implements OnInit {
  SCREENER_URL = `${environment.apiBaseUrl}:${environment.screenerPort}/${environment.screenerRoute}`;

  readonly BALANCE_SHEET_DATA_TYPES = BALANCE_SHEET_DATA_TYPES;
  readonly INCOME_STATEMENT_DATA_TYPES = INCOME_STATEMENT_DATA_TYPES;
  readonly CASHFLOW_STATEMENT_DATA_TYPES = CASHFLOW_STATEMENT_DATA_TYPES;
  readonly TOTAL_DATA_TYPES = [
    ...this.BALANCE_SHEET_DATA_TYPES,
    ...this.INCOME_STATEMENT_DATA_TYPES,
    ...this.CASHFLOW_STATEMENT_DATA_TYPES
  ];

  readonly VALUE_COMPARISON_TYPE = {
    title: 'Current Value',
  };
  readonly GROWTH_COMPARISON_TYPE = {
    title: 'Past Growth',
  };
  readonly COMPARISON_TYPES = [
    this.VALUE_COMPARISON_TYPE,
    this.GROWTH_COMPARISON_TYPE,
  ];

  readonly LESS_THAN_OPERATOR = {
    title: '<=',
  };
  readonly GREATER_THAN_OPERATOR = {
    title: '>=',
  };
  readonly COMPARISON_OPERATORS = [
    this.LESS_THAN_OPERATOR,
    this.GREATER_THAN_OPERATOR,
  ];

  readonly ABSOLUTE_COMPARISON_TARGET = {
    title: 'None',
  };
  readonly INDUSTRY_COMPARISON_TARGET = {
    title: 'the same Industry',
  };
  readonly ALL_COMPARISON_TARGET = {
    title: 'the market',
  };
  readonly COMPARISON_TARGETS = [
    this.ABSOLUTE_COMPARISON_TARGET,
    this.INDUSTRY_COMPARISON_TARGET,
    this.ALL_COMPARISON_TARGET,
  ];

  @Output() filterResultsChange = new EventEmitter<any[]>();

  @LocalStorage('screeningFilters')
  filters;

  filterResults = [];

  selectedFilter;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (!this.filters) {
      this.filters = [];
    }
  }

  onEditFilterClicked(filter) {
    this.selectedFilter = { ...filter };
  }

  onDeleteFilterClicked(filter) {
    this.filters = this.filters.filter((f) => f._filterId !== filter._filterId);
  }

  onCreateFilterClicked() {
    this.selectedFilter = {
      _filterId: uuidv4(),
      numeratorType: null,
      denominatorType: null,
      comparisonType: this.VALUE_COMPARISON_TYPE.title,
      comparisonTarget: this.ABSOLUTE_COMPARISON_TARGET.title,
      comparisonOperator: this.GREATER_THAN_OPERATOR.title,
      comparisonValue: null,
    };
  }

  onWizardFinished() {
    for (const [index, filter] of this.filters.entries()) {
      if (filter._filterId === this.selectedFilter._filterId) {
        this.filters[index] = this.selectedFilter;
        this.filters = this.filters;
        this.selectedFilter = null;
        return;
      }
    }
    this.filters.push(this.selectedFilter);
    this.filters = this.filters;
    this.selectedFilter = null;
    return;
  }

  onWizardCanceled() {
    this.selectedFilter = null;
  }

  async onApplyScreenerClicked() {
    const filters = this.httpifyFilters(this.filters);
    await this.fetchCompanies(filters);
    this.filterResultsChange.emit(this.filterResults);
  }

  private httpifyFilters(rawFilters) {
    const httpifiedFilters = [];
    for (const rawFilter of rawFilters) {
      const httpifiedFilter = this.httpifyFilter(rawFilter);
      httpifiedFilters.push(httpifiedFilter);
    }

    return httpifiedFilters;
  }

  private httpifyFilter(rawFilter) {
    const formattedFilter = {
      type: this.getFilterType(rawFilter),
      numeratorKey: this.getFilterNumeratorKey(rawFilter),
      denominatorKey: this.getFilterDenominatorKey(rawFilter),
      comparisonType: this.getFilterOperator(rawFilter),
      value: this.getFilterValue(rawFilter),
      yearEnd: null,
      yearStart: null,
      year: null,
    };

    return formattedFilter;
  }

  private getFilterNumeratorKey(rawFilter) {
    return rawFilter.numeratorType.gqlKey;
  }

  private getFilterDenominatorKey(rawFilter) {
    if (rawFilter.denominatorType) {
      return rawFilter.denominatorType.gqlKey;
    }
    return null;
  }

  private getFilterValue(rawFilter) {
    if (
      rawFilter.comparisonType === this.VALUE_COMPARISON_TYPE.title &&
      rawFilter.comparisonTarget === this.ABSOLUTE_COMPARISON_TARGET.title
    ) {
      return rawFilter.comparisonValue;
    }

    return rawFilter.comparisonValue / 100;
  }

  private getFilterOperator(rawFilter) {
    if (rawFilter.comparisonOperator === this.GREATER_THAN_OPERATOR.title) {
      return 'greaterThan';
    } else {
      return 'lessThan';
    }
  }

  private getFilterType(rawFilter) {
    if (rawFilter.comparisonType === this.GROWTH_COMPARISON_TYPE.title) {
      if (
        rawFilter.comparisonTarget === this.INDUSTRY_COMPARISON_TARGET.title
      ) {
        return 'growthVsIndustry';
      } else if (
        rawFilter.comparisonTarget === this.ALL_COMPARISON_TARGET.title
      ) {
        return 'growthVsMarket';
      } else {
        return 'growth';
      }
    } else {
      if (
        rawFilter.comparisonTarget === this.INDUSTRY_COMPARISON_TARGET.title
      ) {
        return 'vsIndustry';
      } else if (
        rawFilter.comparisonTarget === this.ALL_COMPARISON_TARGET.title
      ) {
        return 'vsMarket';
      } else {
        return 'ratioNow';
      }
    }
  }

  private fetchCompanies(filters) {
    return this.http
      .post(this.SCREENER_URL, {
        filters,
      })
      .toPromise()
      .then((companies: any[]) => {
        this.filterResults = companies;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

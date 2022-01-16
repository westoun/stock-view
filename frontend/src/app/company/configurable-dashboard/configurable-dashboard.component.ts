import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GridsterConfig,
  GridsterItem,
  GridType,
  CompactType,
  DisplayGrid,
} from 'angular-gridster2';
import { LocalStorage } from 'ngx-webstorage';
import { v4 as uuidv4 } from 'uuid';
import {
  BALANCE_SHEET_DATA_TYPES,
  INCOME_STATEMENT_DATA_TYPES,
  CASHFLOW_STATEMENT_DATA_TYPES,
  STOCK_QUOTA_DATA_TYPES,
} from '../../../shared/graphql-datatypes';
import {
  STOCK_PRICE_KEY,
  FINANCIAL_STABILITY_CHART_TYPES,
  PROFITABILITY_CHART_TYPES,
  OPERATIONAL_EFFICIENCY_CHART_TYPES,
  MARKET_RATIO_CHART_TYPES,
} from '../../../shared/charttypes';
import { ChartDataService } from 'src/app/chart-data.service';

@Component({
  selector: 'app-configurable-dashboard',
  templateUrl: './configurable-dashboard.component.html',
  styleUrls: ['./configurable-dashboard.component.scss'],
})
export class ConfigurableDashboardComponent implements OnInit {
  readonly BALANCE_SHEET_DATA_TYPES = BALANCE_SHEET_DATA_TYPES;
  readonly INCOME_STATEMENT_DATA_TYPES = INCOME_STATEMENT_DATA_TYPES;
  readonly CASHFLOW_STATEMENT_DATA_TYPES = CASHFLOW_STATEMENT_DATA_TYPES;
  readonly STOCK_QUOTA_DATA_TYPES = STOCK_QUOTA_DATA_TYPES;
  readonly TOTAL_DATA_TYPES = [
    ...this.STOCK_QUOTA_DATA_TYPES,
    ...this.BALANCE_SHEET_DATA_TYPES,
    ...this.INCOME_STATEMENT_DATA_TYPES,
    ...this.CASHFLOW_STATEMENT_DATA_TYPES
  ];

  readonly STOCK_PRICE_KEY = STOCK_PRICE_KEY;
  readonly MARKET_RATIO_TYPES = MARKET_RATIO_CHART_TYPES;
  readonly FINANCIAL_STABILITY_RATIO_TYPES = FINANCIAL_STABILITY_CHART_TYPES;
  readonly PROFITABILITY_RATIO_TYPES = PROFITABILITY_CHART_TYPES;
  readonly OPERATIONAL_EFFICIENCY_RATIO_TYPES =
    OPERATIONAL_EFFICIENCY_CHART_TYPES;

  readonly MARKET_RATIO_CONFIGURATOR_PAGE = 'MARKET_RATIO_CONFIGURATOR_PAGE';
  readonly FINANCIAL_STABILITY_CONFIGURATOR_PAGE =
    'FINANCIAL_STABILITY_CONFIGURATOR_PAGE';
  readonly PROFITABILITY_CONFIGURATOR_PAGE = 'PROFITABILITY_CONFIGURATOR_PAGE';
  readonly OPERATIONAL_EFFICIENCY_CONFIGURATOR_PAGE =
    'OPERATIONAL_EFFICIENCY_CONFIGURATOR_PAGE';
  readonly CUSTOM_CONFIGURATOR_PAGE = 'CUSTOM_CONFIGURATOR_PAGE';
  readonly CONFIGURATOR_PAGES = [
    this.FINANCIAL_STABILITY_CONFIGURATOR_PAGE,
    this.PROFITABILITY_CONFIGURATOR_PAGE,
    this.OPERATIONAL_EFFICIENCY_CONFIGURATOR_PAGE,
  ];
  readonly VALUE_DEVELOPMENT_CHART_TYPE = 'VALUE_DEVELOPMENT_CHART_TYPE';
  readonly INDUSTRY_COMPARISON_CHART_TYPE = 'INDUSTRY_COMPARISON_CHART_TYPE';

  options: GridsterConfig = {
    itemChangeCallback: this.onItemChange.bind(this),
    itemResizeCallback: this.onItemResize.bind(this),
    gridType: GridType.ScrollVertical,
    compactType: CompactType.None,
    displayGrid: DisplayGrid.OnDragAndResize,
    pushItems: true,
    draggable: {
      enabled: true,
    },
    resizable: {
      enabled: true,
    },
    minCols: 12,
    maxCols: 12,
    margin: 15,
  };

  @LocalStorage('configurableDashboardItems')
  dashboard: Array<GridsterItem>;

  dashboardDataSets = {};
  dashboardColorSchemes = {};

  currentConfiguratorPage = this.MARKET_RATIO_CONFIGURATOR_PAGE;

  selectedChartItem;
  selectedRatioType;
  selectedChartType;
  openChartConfigurator;

  customChartTitle;
  customChartNumeratorType = null;
  customChartDenominatorType = null;

  stockQuotes = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private chartDataService: ChartDataService
  ) {}

  async ngOnInit() {
    if (!this.dashboard) {
      this.dashboard = [];
    }

    try {
      this.stockQuotes = await this.chartDataService.fetchStockQuotes(
        this.getCompanyId()
      );
    } catch (err) {
      console.error(err);
    }

    for (const item of this.dashboard) {
      if (!item.data) {
        continue;
      }
      this.fetchItemData(item);
    }
  }

  onCreateChartClicked(item) {
    this.selectedChartItem = item;
    this.openChartConfigurator = true;
  }

  onItemChange(item, itemComponent) {
    // Reassignment is neccessary to trigger
    // local storage synchronization.
    this.dashboard = this.dashboard;

    // 24 + 24 stands for 24 hight of h4 and
    // 24 margin top.
    item.hight = itemComponent.height - (24 + 24);
    item.width = itemComponent.width;
  }

  onItemResize(item, itemComponent) {
    // 24 + 24 stands for 24 hight of h4 and
    // 24 margin top.
    item.hight = itemComponent.height - (24 + 24);
    item.width = itemComponent.width;
  }

  onClearDashboard() {
    this.dashboard = [];
  }

  onChangeConfiguratorPage(page) {
    this.currentConfiguratorPage = page;
  }

  onSelectRatioType(ratioType) {
    this.selectedRatioType = ratioType;
  }

  onSelectChartType(chartType) {
    this.selectedChartType = chartType;

    if (
      chartType === this.INDUSTRY_COMPARISON_CHART_TYPE &&
      this.MARKET_RATIO_TYPES.includes(this.selectedRatioType)
    ) {
      this.selectedRatioType = null;
    }
    if (
      chartType === this.INDUSTRY_COMPARISON_CHART_TYPE &&
      this.customChartNumeratorType &&
      this.customChartNumeratorType.gqlKey === this.STOCK_PRICE_KEY
    ) {
      this.customChartNumeratorType = null;
    }
    if (
      chartType === this.INDUSTRY_COMPARISON_CHART_TYPE &&
      this.customChartDenominatorType &&
      this.customChartDenominatorType.gqlKey === this.STOCK_PRICE_KEY
    ) {
      this.customChartDenominatorType = null;
    }
  }

  onAddChart() {
    // does not fire when modal is opened
    if (this.currentConfiguratorPage === this.CUSTOM_CONFIGURATOR_PAGE) {
      this.addCustomChartItem();
    } else {
      this.addDefaultChartItem();
    }
    this.updateDashboard();
  }

  private addDefaultChartItem() {
    this.selectedChartItem.title = this.selectedRatioType.title;
    this.selectedChartItem.chartType = this.selectedChartType;

    if (!this.selectedChartItem.data) {
      this.selectedChartItem.data = {};
    }

    this.selectedChartItem.data.numeratorType =
      this.selectedRatioType.numeratorType;

    this.selectedChartItem.data.denominatorType =
      this.selectedRatioType.denominatorType;
  }

  private addCustomChartItem() {
    this.selectedChartItem.title = this.customChartTitle;
    this.selectedChartItem.chartType = this.selectedChartType;

    if (!this.selectedChartItem.data) {
      this.selectedChartItem.data = {};
    }

    this.selectedChartItem.data.numeratorType = this.customChartNumeratorType;

    this.selectedChartItem.data.denominatorType =
      this.customChartDenominatorType;
  }

  private updateDashboard() {
    this.dashboard = this.dashboard;
    this.fetchItemData(this.selectedChartItem);
    this.resetConfigurator();
  }

  public resetConfigurator() {
    this.selectedChartItem = null;
    this.selectedRatioType = null;
    this.openChartConfigurator = false;
    this.customChartTitle = null;
    this.customChartNumeratorType = null;
    this.customChartDenominatorType = null;
    this.selectedChartType = this.VALUE_DEVELOPMENT_CHART_TYPE;
  }

  private fetchItemData(item) {
    if (item.chartType === this.INDUSTRY_COMPARISON_CHART_TYPE) {
      this.fetchComparisonChartData(item);

    } else {
      if (
        item.data.numeratorType.gqlKey === this.STOCK_PRICE_KEY ||
        (item.data.denominatorType &&
          item.data.denominatorType.gqlKey === this.STOCK_PRICE_KEY)
      ) {
        this.fetchMarketRatioData(item);
      } else {
        this.fetchFundamentalRatioData(item);
      }
    }
  }


  private fetchFundamentalRatioData(item: any) {
    this.chartDataService
      .fetchFundamentalItemData(this.getCompanyId(), item.data)
      .then((dataSet: any) => {
        this.dashboardDataSets[item.id] = [dataSet];
        this.resetConfigurator();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  private fetchMarketRatioData(item: any) {
    this.chartDataService
      .fetchMarketItemData(this.getCompanyId(), item.data, this.stockQuotes)
      .then((dataSet: any) => {
        this.dashboardDataSets[item.id] = [dataSet];
        this.resetConfigurator();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  private fetchComparisonChartData(item: any) {
    this.chartDataService
      .fetchFundamentalIndustryData(this.getCompanyId(), item.data)
      .then((res: { data: []; colorScheme: { domain: []; }; }) => {
        this.dashboardDataSets[item.id] = res.data;
        this.dashboardColorSchemes[item.id] = res.colorScheme;
        this.resetConfigurator();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  public removeItem(item) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
    this.dashboard = this.dashboard;
  }

  public addItem() {
    if (!this.dashboard) {
      this.dashboard = [];
    }

    this.dashboard.push({
      cols: 2,
      rows: 2,
      y: 0,
      x: 0,
      id: uuidv4(),
    });
    this.dashboard = this.dashboard;
  }

  private getCompanyId() {
    return this.route.parent.snapshot.params['companyId'];
  }
}

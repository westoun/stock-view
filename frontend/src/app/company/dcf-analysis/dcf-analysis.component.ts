import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataService } from 'src/app/chart-data.service';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dcf-analysis',
  templateUrl: './dcf-analysis.component.html',
  styleUrls: ['./dcf-analysis.component.scss'],
})
export class DcfAnalysisComponent implements OnInit {
  readonly EARNINGS_CHART_TYPE = {
    title: 'Earnings per Share',
    numeratorType: {
      gqlKey: 'NetIncome',
      title: 'Net Income',
    },
    denominatorType: {
      gqlKey: 'SharesDiluted',
      title: 'Total Shares',
    },
  };

  historicIncomeData: any;
  selectedHistoryPeriod = 20;
  discountedCashflowData: {
    eternalGrowthRate: number;
    discountRate: number;
    fairValue?: number;
    growthPeriod: number;
    predictedIncomeData: any;
  };

  displayedIncomeData: any[];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private chartDataService: ChartDataService,
    private localStorage: LocalStorageService,
    private numberPipe: DecimalPipe
  ) {}

  ngOnInit(): void {
    this.discountedCashflowData = this.retrieveLocalStorage();

    this.chartDataService
      .fetchFundamentalItemData(this.getCompanyId(), this.EARNINGS_CHART_TYPE)
      .then((dataSet: any) => {
        this.historicIncomeData = {
          ...dataSet,
          name: 'Historic Net Income',
        };

        if (!this.discountedCashflowData) {
          this.discountedCashflowData = {
            eternalGrowthRate: 3,
            discountRate: 8,
            growthPeriod: 5,
            predictedIncomeData: [],
            fairValue: null,
          };

          const latestDataPoint = dataSet.series.sort(
            (d1, d2) => d2.name.getTime() - d1.name.getTime()
          )[0];

          this.discountedCashflowData.predictedIncomeData = {
            series: [],
            name: 'Predicted Net Income',
          };
          for (let i = 1; i < 15; i++) {
            const newDate = new Date(latestDataPoint.name.getTime());
            newDate.setFullYear(newDate.getFullYear() + i);

            this.discountedCashflowData.predictedIncomeData.series.push({
              value: this.numberPipe.transform(latestDataPoint.value),
              name: newDate,
            });
          }

          this.updateLocalStorage();
        }

        this.historicIncomeData.series.push(
          this.discountedCashflowData.predictedIncomeData.series[0]
        );
        // Add first predicted data element to connect history and
        // prediction in graph.

        this.updateIncomeData();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  onHistoryPeriodClicked(years: number) {
    this.selectedHistoryPeriod = years;
    this.updateIncomeData();
  }

  onGrowthPeriodClicked(years: number) {
    this.discountedCashflowData.growthPeriod = years;
    this.updateLocalStorage();
    this.updateIncomeData();
  }

  private updateIncomeData() {
    const latestDataPoint = this.historicIncomeData.series.sort(
      (d1, d2) => d2.name.getTime() - d1.name.getTime()
    )[1]; // chose 2nd element, because first element connects
    // historic and predicted data in graph.

    const currentYear = latestDataPoint.name.getFullYear();
    const startYear = currentYear - this.selectedHistoryPeriod;
    const endYear = currentYear + this.discountedCashflowData.growthPeriod;

    this.displayedIncomeData = [
      {
        ...this.historicIncomeData,
        series: this.historicIncomeData.series.filter((d) => {
          return (
            d.name.getFullYear() >= startYear && d.name.getFullYear() <= endYear
          );
        }),
      },
      {
        ...this.discountedCashflowData.predictedIncomeData,
        series: this.discountedCashflowData.predictedIncomeData.series.filter(
          (d) => {
            return (
              d.name.getFullYear() >= startYear &&
              d.name.getFullYear() <= endYear
            );
          }
        ),
      },
    ];
  }

  onParameterChanged() {
    this.updateLocalStorage();
    this.updateIncomeData();
  }

  onComputeValueClicked() {
    this.discountedCashflowData.fairValue = this.computeNetPresentValue();
  }

  private computeNetPresentValue() {
    let growthPeriodValue = 0;
    for (let i = 0; i < this.discountedCashflowData.growthPeriod; i++) {
      growthPeriodValue +=
        this.discountedCashflowData.predictedIncomeData.series[i].value /
        Math.pow(1 + this.discountedCashflowData.discountRate / 100, i + 1);
    }

    if (
      this.discountedCashflowData.eternalGrowthRate ===
      this.discountedCashflowData.discountRate
    ) {
      console.error('Division by 0 due to same discount and grwoth rate!');
    }

    const terminalValue =
      (this.discountedCashflowData.predictedIncomeData.series[
        this.discountedCashflowData.growthPeriod - 1
      ].value  *
        (1 + this.discountedCashflowData.eternalGrowthRate / 100)) /
      (this.discountedCashflowData.discountRate / 100 -
        this.discountedCashflowData.eternalGrowthRate / 100);

    return growthPeriodValue + terminalValue;
  }

  private getCompanyId() {
    return this.route.parent.snapshot.params['companyId'];
  }

  private updateLocalStorage(): void {
    const key = 'discountedCashflowData-' + this.getCompanyId();
    this.localStorage.store(key, this.discountedCashflowData);
  }

  private retrieveLocalStorage(): any {
    const key = 'discountedCashflowData-' + this.getCompanyId();
    const discountedCashflowData = this.localStorage.retrieve(key);

    if (!discountedCashflowData) {
      return null;
    }

    // format dates as Date-objects
    discountedCashflowData.predictedIncomeData = {
      ...discountedCashflowData.predictedIncomeData,
      series: discountedCashflowData.predictedIncomeData.series.map((d) => {
        return {
          ...d,
          name: new Date(d.name),
        };
      }),
    };

    return discountedCashflowData;
  }
}

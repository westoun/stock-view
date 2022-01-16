import { Apollo, gql } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-company-overview',
  templateUrl: './company-overview.component.html',
  styleUrls: ['./company-overview.component.scss'],
})
export class CompanyOverviewComponent implements OnInit {
  dataQuery = gql`
    query ($SimFinId: Int!) {
      financialStatements(SimFinId: $SimFinId) {
        FiscalYear
        ReportDate
        SharesBasic
        SharesDiluted

        Revenue
        NetIncome

        NetCashfromOperatingActivities
        ChangeinFixedAssetsIntangibles
        DividendsPaid

        TotalEquity
        TotalAssets
      }
    }
  `;

  revenueIncomeData = null;
  revenueMarginData = null;
  freeCashflowData = null;
  epsDividendsData = null;
  assetTurnoverData = null;
  returnOnEquityData = null;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData(): void {
    this.apollo
      .query({
        query: this.dataQuery,
        variables: {
          SimFinId: this.getCompanyId(),
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((res) => res.data['financialStatements']))
      .subscribe((financialReports: any) => {
        this.parseDataToGraphData(financialReports);
      });
  }

  private parseDataToGraphData(financialReports) {
    this.revenueIncomeData =
      this.parseIncomeStatementsToRevenueData(financialReports);
    this.revenueMarginData =
      this.parseIncomeStatementsToRevenueMarginData(financialReports);
    this.freeCashflowData =
      this.parseCashflowStatementsToFreeCashflowData(financialReports);

    this.epsDividendsData = this.parseDataToEpsData(financialReports);

    this.assetTurnoverData =
      this.parseDataToAssetTurnoverData(financialReports);

    this.returnOnEquityData = this.parseDataToRoeData(financialReports);
  }

  private parseDataToAssetTurnoverData(financialReports) {
    const assetTurnoverSeries = financialReports.map((d) => {
      const revenue = d.Revenue;
      const totalAssets = d.TotalAssets;
      const date = new Date(d.ReportDate);

      if (!totalAssets) {
        return {
          value: null,
          name: date,
        };
      }

      return {
        value: revenue / totalAssets,
        name: date,
      };
    });

    return [
      {
        name: 'Asset Turnover',
        series: assetTurnoverSeries,
      },
    ];
  }

  private parseDataToRoeData(financialReports) {
    const roeSeries = financialReports.map((d) => {
      const netIncome = d.NetIncome;
      const totalEquity = d.TotalEquity;
      const date = new Date(d.ReportDate);

      if (!totalEquity) {
        return {
          value: null,
          name: date,
        };
      }

      return {
        value: netIncome / totalEquity,
        name: date,
      };
    });

    return [
      {
        name: 'Return on Equity',
        series: roeSeries,
      },
    ];
  }

  private parseDataToEpsData(financialReports) {
    const epsSeries = financialReports.map((d) => {
      const netIncome = d.NetIncome;
      const sharesBasic = d.SharesBasic;
      const date = new Date(d.ReportDate);

      if (!sharesBasic) {
        return {
          value: null,
          name: date,
        };
      }

      return {
        value: netIncome / sharesBasic,
        name: date,
      };
    });
    const dpsSeries = financialReports.map((d) => {
      const dividendsPaid = Math.abs(d.DividendsPaid);
      const sharesBasic = d.SharesBasic;
      const date = new Date(d.ReportDate);

      if (!sharesBasic) {
        return {
          value: null,
          name: date,
        };
      }

      return {
        value: dividendsPaid / sharesBasic,
        name: date,
      };
    });

    return [
      {
        name: 'Earnings per Share',
        series: epsSeries,
      },
      {
        name: 'Dividends per Share',
        series: dpsSeries,
      },
    ];
  }

  private parseCashflowStatementsToFreeCashflowData(financialReports) {
    const fcfSeries = financialReports.map((d) => {
      const date = new Date(d.ReportDate);

      return {
        value:
          d.NetCashfromOperatingActivities + d.ChangeinFixedAssetsIntangibles,
        name: date,
      };
    });
    return [
      {
        name: 'Free Cashflow',
        series: fcfSeries,
      },
    ];
  }

  private parseIncomeStatementsToRevenueMarginData(financialReports) {
    const revenueMarginSeries = financialReports.map((d) => {
      const netIncome = d.NetIncome;
      const revenue = d.Revenue;
      const date = new Date(d.ReportDate);

      if (!revenue) {
        return {
          value: null,
          name: date,
        };
      }

      return {
        value: netIncome / revenue,
        name: date,
      };
    });
    return [
      {
        name: 'Revenue Margin',
        series: revenueMarginSeries,
      },
    ];
  }

  private parseIncomeStatementsToRevenueData(financialReports) {
    const revenueSeries = financialReports.map((d) => {
      const date = new Date(d.ReportDate);

      return {
        value: d.Revenue,
        name: date,
      };
    });
    const incomeSeries = financialReports.map((d) => {
      const date = new Date(d.ReportDate);

      return {
        value: d.NetIncome,
        name: date,
      };
    });

    return [
      {
        name: 'Revenue',
        series: revenueSeries,
      },
      {
        name: 'Net Income',
        series: incomeSeries,
      },
    ];
  }

  private getCompanyId() {
    return this.route.parent.snapshot.params['companyId'];
  }
}

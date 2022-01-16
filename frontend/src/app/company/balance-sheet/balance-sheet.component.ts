import { Apollo, gql } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss'],
})
export class BalanceSheetComponent implements OnInit {
  balanceDataQuery = gql`
    query ($SimFinId: Int!, $FiscalYearStart: Int, $FiscalYearEnd: Int) {
      balanceSheets(
        SimFinId: $SimFinId
        FiscalYearStart: $FiscalYearStart
        FiscalYearEnd: $FiscalYearEnd
      ) {
        FiscalYear
        ReportDate

        TotalAssets
        TotalCurrentAssets
        CashCashEquivalentsShortTermInvestments
        AccountsNotesReceivable
        Inventories

        TotalNoncurrentAssets
        PropertyPlantEquipmentNet
        LongTermInvestmentsReceivables
        OtherLongTermAssets

        TotalLiabilitiesEquity
        TotalLiabilities
        TotalCurrentLiabilities
        PayablesAccruals
        ShortTermDebt

        TotalNoncurrentLiabilities
        LongTermDebt

        TotalEquity
        ShareCapitalAdditionalPaidInCapital
        TreasuryStock
        RetainedEarnings

        SharesBasic
        SharesDiluted
      }
    }
  `;

  rawDetailedDataQuery = `
  query($SimFinId: Int!) {
    balanceSheets(
      SimFinId: $SimFinId
    ) {
      FiscalYear
      ReportDate
      %GQLKEY%
      Company {
        CompanyName
      }
    }
  }
  `;

  years = [];
  keys = [
    {
      gqlKey: 'TotalAssets',
      title: 'Total Assets',
    },
    {
      gqlKey: 'TotalCurrentAssets',
      title: 'Current Assets',
    },
    {
      gqlKey: 'TotalNoncurrentAssets',
      title: 'Noncurrent Assets',
    },
    {
      gqlKey: 'TotalLiabilities',
      title: 'Total Liabilities',
    },
    {
      gqlKey: 'TotalCurrentLiabilities',
      title: 'Current Liabilities',
    },
    {
      gqlKey: 'TotalNoncurrentLiabilities',
      title: 'Noncurrent Liabilities',
    },
    {
      gqlKey: 'TotalEquity',
      title: 'Total Equity',
    },
  ];
  financialDataPoints = {};

  modalDataType = '';
  modalData = null;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.fetchBalanceData();
  }

  public onDataTypeClick(title, gqlKey) {
    this.modalDataType = title;
    this.fetchDetailedData(gqlKey);
  }

  private fetchDetailedData(gqlKey) {
    const detailedDataQuery = gql`
      ${this.rawDetailedDataQuery.replace('%GQLKEY%', gqlKey)}
    `;
    this.apollo
      .query({
        query: detailedDataQuery,
        variables: {
          SimFinId: this.getCompanyId(),
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((res) => res.data['balanceSheets']))
      .subscribe((balanceSheets) => {
        const name = balanceSheets[0].Company.CompanyName;
        // ngx-charts naming
        const series = balanceSheets.map((d) => {
          const date = new Date(d.ReportDate);

          return {
            value: Math.abs(d[gqlKey]),
            name: date,
          };
        });
        this.modalData = [
          {
            name,
            series,
          },
        ];
      });
  }

  private fetchBalanceData() {
    this.apollo
      .query({
        query: this.balanceDataQuery,
        variables: {
          SimFinId: this.getCompanyId(),
          FiscalYearStart: this.getCurrentYear() - 6,
          FiscalYearEnd: this.getCurrentYear(),
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((res) => res.data['balanceSheets']))
      .subscribe((balanceSheets) => {
        const sortedDataPoints = balanceSheets.sort(
          (a, b) => b.FiscalYear - a.FiscalYear
        );

        this.years = sortedDataPoints.map((d) => d.FiscalYear);

        for (const key of this.keys) {
          this.financialDataPoints[key['gqlKey']] = [];
        }

        for (const dataPoint of sortedDataPoints) {
          for (const key of this.keys) {
            this.financialDataPoints[key['gqlKey']].push(
              dataPoint[key['gqlKey']]
            );
          }
        }
      });
  }

  private getCurrentYear() {
    const date = new Date();
    return date.getFullYear();
  }

  private getCompanyId() {
    return this.route.parent.snapshot.params['companyId'];
  }
}

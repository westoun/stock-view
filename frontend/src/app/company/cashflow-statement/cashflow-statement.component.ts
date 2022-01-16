import { Apollo, gql } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cashflow-statement',
  templateUrl: './cashflow-statement.component.html',
  styleUrls: ['./cashflow-statement.component.scss']
})
export class CashflowStatementComponent implements OnInit {
  cashflowDataQuery = gql`
  query($SimFinId: Int!, $FiscalYearStart: Int, $FiscalYearEnd: Int) {
    cashflowStatements(
      SimFinId: $SimFinId
      FiscalYearStart: $FiscalYearStart
      FiscalYearEnd: $FiscalYearEnd
    ) {
      FiscalYear

      NetCashfromOperatingActivities
      NetIncomeStartingLine
      DepreciationAmortization
      NonCashItems
      ChangeinWorkingCapital
      ChangeinAccountsReceivable
      ChangeinInventories
      ChangeinAccountsPayable
      ChangeinOther

      NetCashfromInvestingActivities
      ChangeinFixedAssetsIntangibles
      NetChangeinLongTermInvestment
      NetCashfromAcquisitionsDivestitures


      NetCashfromFinancingActivities
      DividendsPaid
      CashfromRepaymentofDebt
      NetCashfromFinancingActivities
      NetChangeinCash

      SharesBasic
      SharesDiluted
    }
  }
`;

rawDetailedDataQuery = `
query($SimFinId: Int!) {
  cashflowStatements(
    SimFinId: $SimFinId
  ) {
    FiscalYear
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
    gqlKey: 'NetCashfromOperatingActivities',
    title: 'Operating Cashflow',
  },
  {
    gqlKey: 'NetCashfromInvestingActivities',
    title: 'Investing Cashflow',
  },
  {
    gqlKey: 'NetCashfromFinancingActivities',
    title: 'Financing Cashflow',
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
  this.fetchCashflowData();
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
    .pipe(map((res) => res.data['cashflowStatements']))
    .subscribe((cashflowStatements) => {
      const name = cashflowStatements[0].Company.CompanyName;
      // ngx-charts naming

      const series = cashflowStatements.map((d) => {
        const fiscalYear = new Date();
        fiscalYear.setFullYear(d.FiscalYear);

        return {
          value: Math.abs(d[gqlKey]),
          name: fiscalYear,
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

private fetchCashflowData() {
  this.apollo
    .query({
      query: this.cashflowDataQuery,
      variables: {
        SimFinId: this.getCompanyId(),
        FiscalYearStart: this.getCurrentYear() - 6,
        FiscalYearEnd: this.getCurrentYear(),
      },
      fetchPolicy: 'no-cache',
    })
    .pipe(map((res) => res.data['cashflowStatements']))
    .subscribe((cashflowStatements) => {
      const sortedDataPoints = cashflowStatements.sort(
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

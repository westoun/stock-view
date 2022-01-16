import { Apollo, gql } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-income-statement',
  templateUrl: './income-statement.component.html',
  styleUrls: ['./income-statement.component.scss'],
})
export class IncomeStatementComponent implements OnInit {
  incomeDataQuery = gql`
    query($SimFinId: Int!, $FiscalYearStart: Int, $FiscalYearEnd: Int) {
      incomeStatements(
        SimFinId: $SimFinId
        FiscalYearStart: $FiscalYearStart
        FiscalYearEnd: $FiscalYearEnd
      ) {
        FiscalYear
        Revenue
        CostofRevenue
        GrossProfit

        OperatingExpenses
        SellingGeneralAdministrative
        ResearchDevelopment
        DepreciationAmortization

        OperatingIncomeLoss

        NonOperatingIncomeLoss
        InterestExpenseNet
        PretaxIncomeLossAdj
        AbnormalGainsLosses

        PretaxIncomeLoss

        IncomeTaxExpenseBenefitNet
        IncomeLossfromContinuingOperations
        NetExtraordinaryGainsLosses

        NetIncome

        NetIncomeCommon

        SharesBasic
        SharesDiluted
      }
    }
  `;

  rawDetailedDataQuery = `
  query($SimFinId: Int!) {
    incomeStatements(
      SimFinId: $SimFinId
    ) {
      FiscalYear
      %GQLKEY%
      %GQLDIVIDEBYKEY%
      Company {
        CompanyName
      }
    }
  }
  `;

  years = [];
  keys = [
    {
      gqlKey: 'Revenue',
      title: 'Revenue',
      divideByGqlKey: null,
    },
    {
      gqlKey: 'CostofRevenue',
      title: 'Cost of Revenue',
      divideByGqlKey: 'Revenue',
    },
    {
      gqlKey: 'GrossProfit',
      title: 'Gross Profit',
      divideByGqlKey: 'Revenue',
    },
    {
      gqlKey: 'OperatingExpenses',
      title: 'Operating Expenses',
      divideByGqlKey: 'Revenue',
    },
    {
      gqlKey: 'OperatingIncomeLoss',
      title: 'Operating Income',
      divideByGqlKey: 'Revenue',
    },
    {
      gqlKey: 'NonOperatingIncomeLoss',
      title: 'Non Operating Income',
      divideByGqlKey: 'Revenue',
    },
    {
      gqlKey: 'PretaxIncomeLoss',
      title: 'Pretax Income',
      divideByGqlKey: 'Revenue',
    },
    {
      gqlKey: 'IncomeTaxExpenseBenefitNet',
      title: 'Tax Expense',
      divideByGqlKey: 'Revenue',
    },
    {
      gqlKey: 'NetIncome',
      title: 'Net Income',
      divideByGqlKey: null,
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
    this.fetchIncomeData();
  }

  public onDataTypeClick(key) {
    this.setModalDataType(key);
    this.fetchDetailedData(key);
  }

  private setModalDataType(key) {
    if (key.divideByGqlKey) {
      const divideByGqlKey = this.keys.filter(
        (k) => k.gqlKey === key.divideByGqlKey
      )[0];
      this.modalDataType = `${key.title} / ${divideByGqlKey.title}`;
    } else {
      this.modalDataType = key.title;
    }
  }

  private fetchDetailedData(key) {
    if (key.divideByGqlKey) {
      var detailedDataQuery = gql`
        ${this.rawDetailedDataQuery
          .replace('%GQLKEY%', key.gqlKey)
          .replace('%GQLDIVIDEBYKEY%', key.divideByGqlKey)}
      `;
    } else {
      var detailedDataQuery = gql`
        ${this.rawDetailedDataQuery
          .replace('%GQLKEY%', key.gqlKey)
          .replace('%GQLDIVIDEBYKEY%', '')}
      `;
    }

    this.apollo
      .query({
        query: detailedDataQuery,
        variables: {
          SimFinId: this.getCompanyId(),
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((res) => res.data['incomeStatements']))
      .subscribe((incomeStatements) => {
        const name = incomeStatements[0].Company.CompanyName;

        const series = incomeStatements.map((d) => {
          const fiscalYear = new Date();
          fiscalYear.setFullYear(d.FiscalYear);

          if (key.divideByGqlKey) {
            return {
              value: Math.abs(d[key.gqlKey] / d[key.divideByGqlKey]),
              name: fiscalYear,
            };
          }
          return {
            value: Math.abs(d[key.gqlKey]),
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

  private fetchIncomeData() {
    this.apollo
      .query({
        query: this.incomeDataQuery,
        variables: {
          SimFinId: this.getCompanyId(),
          FiscalYearStart: this.getCurrentYear() - 6,
          FiscalYearEnd: this.getCurrentYear(),
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((res) => res.data['incomeStatements']))
      .subscribe((incomeStatements) => {
        const sortedDataPoints = incomeStatements.sort(
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

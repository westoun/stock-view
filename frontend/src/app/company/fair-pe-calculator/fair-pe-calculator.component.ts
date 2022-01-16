import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';

@Component({
  selector: 'app-fair-pe-calculator',
  templateUrl: './fair-pe-calculator.component.html',
  styleUrls: ['./fair-pe-calculator.component.scss'],
})
export class FairPeCalculatorComponent implements OnInit {
  dataQuery = gql`
    query ($SimFinId: Int!, $FiscalYearStart: Int, $FiscalYearEnd: Int) {
      financialStatements(
        SimFinId: $SimFinId
        FiscalYearStart: $FiscalYearStart
        FiscalYearEnd: $FiscalYearEnd
      ) {
        FiscalYear
        NetIncome
        SharesBasic
        SharesDiluted
        TotalEquity
      }
    }
  `;

  MARKET_TYPES = [
    'Perfect Competition',
    'Strong Competition',
    'Few Competitors',
    'Oligopoly',
    'Monopoly',
  ];

  fairPEInput = {
    financialStability: 0,
    marketType: '',
    marketDegree: 0,
    netIncome: null,
    equity: null,
    returnOnEquity: null,
    growth: null,
    baseValue: 7,
    individualAdjustments: 0,
  };

  fairPE;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    public router: Router,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    const storedPEInput = this.retrieveLocalStorage();

    if (storedPEInput) {
      this.fairPEInput = storedPEInput;
    }

    if (!this.fairPEInput.growth || !this.fairPEInput.returnOnEquity) {
      this.fetchData();
    }
  }

  onInputChange(): void {
    this.updateLocalStorage();
  }

  onNetIncomeInputChange(): void {
    this.fairPEInput.returnOnEquity = (
      this.fairPEInput.netIncome / this.fairPEInput.equity
    ).toFixed(2);
    this.updateLocalStorage();
  }

  onEquityInputChange(): void {
    this.fairPEInput.returnOnEquity = (
      this.fairPEInput.netIncome / this.fairPEInput.equity
    ).toFixed(2);
    this.updateLocalStorage();
  }

  onComputeClicked(): void {
    this.fairPE = this.computeFairPE();
  }

  private updateLocalStorage(): void {
    const key = 'fairPEInput-' + this.getCompanyId();
    this.localStorage.store(key, this.fairPEInput);
  }

  private retrieveLocalStorage(): any {
    const key = 'fairPEInput-' + this.getCompanyId();
    return this.localStorage.retrieve(key);
  }

  private fetchData(): void {
    this.apollo
      .query({
        query: this.dataQuery,
        variables: {
          SimFinId: this.getCompanyId(),
          FiscalYearStart: this.getCurrentYear() - 6,
          FiscalYearEnd: this.getCurrentYear(),
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((res) => res.data['financialStatements']))
      .subscribe((financialReports) => {
        const sortedDataPoints = financialReports.sort(
          (a, b) => b.FiscalYear - a.FiscalYear
        );

        const firstDataPoint = sortedDataPoints[0];
        const lastDataPoint = sortedDataPoints.slice(-1)[0];

        this.fairPEInput.netIncome = firstDataPoint['NetIncome'];
        this.fairPEInput.equity = firstDataPoint['TotalEquity'];
        this.fairPEInput.returnOnEquity = (
          this.fairPEInput.netIncome / this.fairPEInput.equity
        ).toFixed(2);

        const epsN =
          firstDataPoint['NetIncome'] / firstDataPoint['SharesDiluted'];
        const eps0 =
          lastDataPoint['NetIncome'] / lastDataPoint['SharesDiluted'];
        const nYears = sortedDataPoints.length - 1;

        this.fairPEInput.growth = this.computeGrowth(
          eps0,
          epsN,
          nYears
        ).toFixed(2);
      });
  }

  private computeFairPE(): number {
    const financialStabilityPoints = this.getFinancialStabilityPoints();
    const marketPositionPoints = this.getMarketPositionPoints();
    const profitabilityPoints = this.getProfitabilityPoints();
    const futureGrowthPoints = this.getFutureGrowthPoints();
    const fairPE =
      this.fairPEInput.baseValue +
      financialStabilityPoints +
      marketPositionPoints * profitabilityPoints +
      futureGrowthPoints +
      this.fairPEInput.individualAdjustments;

    return fairPE;
  }

  private getFutureGrowthPoints(): number {
    const futureGrowth = this.fairPEInput.growth * 100;

    if (futureGrowth < 0) {
      return -1000; // KO Kriteria
    } else if (futureGrowth < 3) {
      return 0.5;
    } else if (futureGrowth < 5) {
      return 1;
    } else if (futureGrowth < 7) {
      return 2;
    } else if (futureGrowth < 10) {
      return 3;
    } else if (futureGrowth < 15) {
      return 4;
    } else if (futureGrowth < 20) {
      return 5;
    } else if (futureGrowth < 25) {
      return 6;
    } else {
      return 6;
    }
  }

  private getProfitabilityPoints(): number {
    const roe = this.fairPEInput.returnOnEquity * 100;

    if (roe < 0) {
      return 0; // Think about returning negative value
    } else if (roe < 5) {
      return 0.3;
    } else if (roe < 7) {
      return 0.5;
    } else if (roe < 10) {
      return 0.7;
    } else if (roe < 12) {
      return 0.9;
    } else if (roe < 15) {
      return 1.1;
    } else if (roe < 18) {
      return 1.3;
    } else if (roe < 21) {
      return 1.5;
    } else if (roe < 25) {
      return 1.7;
    } else if (roe < 27) {
      return 2;
    } else if (roe < 30) {
      return 2.3;
    } else {
      return 2.5;
    }
  }

  private getFinancialStabilityPoints(): number {
    return this.fairPEInput.financialStability / 50;
  }

  private getMarketPositionPoints(): number {
    switch (this.fairPEInput.marketType) {
      case this.MARKET_TYPES[0]:
        return 0 + (this.fairPEInput.marketDegree / 100) * 0.5;
      case this.MARKET_TYPES[1]:
        return 0.5 + this.fairPEInput.marketDegree / 100;
      case this.MARKET_TYPES[2]:
        return 1.5 + (this.fairPEInput.marketDegree / 100) * 0.5;
      case this.MARKET_TYPES[3]:
        return 2 + (this.fairPEInput.marketDegree / 100) * 0.5;
      case this.MARKET_TYPES[4]:
        return 2.5 + (this.fairPEInput.marketDegree / 100) * 0.5;
      default:
        console.error('Unknown market type introduced!');
        return -1000;
    }
  }

  private computeGrowth(eps0, epsN, nYears): number {
    return Math.pow(epsN / eps0, 1 / nYears) - 1;
  }

  private getCurrentYear(): number {
    const date = new Date();
    return date.getFullYear();
  }

  private getCompanyId(): number {
    return this.route.parent.snapshot.params['companyId'];
  }
}

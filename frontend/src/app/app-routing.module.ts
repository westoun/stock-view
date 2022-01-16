import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './companies/companies.component';
import { CompanySearchComponent } from './companies/company-search/company-search.component';
import { BalanceSheetComponent } from './company/balance-sheet/balance-sheet.component';
import { CashflowStatementComponent } from './company/cashflow-statement/cashflow-statement.component';
import { CompanyOverviewComponent } from './company/company-overview/company-overview.component';
import { CompanyComponent } from './company/company.component';
import { ConfigurableDashboardComponent } from './company/configurable-dashboard/configurable-dashboard.component';
import { DcfAnalysisComponent } from './company/dcf-analysis/dcf-analysis.component';
import { FairPeCalculatorComponent } from './company/fair-pe-calculator/fair-pe-calculator.component';
import { IncomeStatementComponent } from './company/income-statement/income-statement.component';
import { ScreenerComponent } from './screener/screener.component';
import { WatchlistComponent } from './watchlist/watchlist.component';

const routes: Routes = [
  {
    path: 'screener',
    component: ScreenerComponent,
  },
  {
    path: 'watchlist',
    component: WatchlistComponent,
  },
  {
    path: 'companies',
    component: CompaniesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'search'
      },
      {
        path: 'search',
        component: CompanySearchComponent
      },
    ]
  },
  {
    path: 'companies/:companyId',
    component: CompanyComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      // {
      //   path: 'overview',
      //   component: CompanyOverviewComponent
      // },
      {
        path: 'dashboard',
        component: ConfigurableDashboardComponent
      },
      {
        path: 'income-statement',
        component: IncomeStatementComponent
      },
      {
        path: 'balance-sheet',
        component: BalanceSheetComponent
      },
      {
        path: 'valuation',
        component: DcfAnalysisComponent
      },
      {
        path: 'cashflow-statement',
        component: CashflowStatementComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: '/companies',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/companies'
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

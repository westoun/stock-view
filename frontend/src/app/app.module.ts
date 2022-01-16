import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CompanyComponent } from './company/company.component';
import { IncomeStatementComponent } from './company/income-statement/income-statement.component';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyOverviewComponent } from './company/company-overview/company-overview.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CompanySearchComponent } from './companies/company-search/company-search.component';
import { FormsModule } from '@angular/forms';
import { BalanceSheetComponent } from './company/balance-sheet/balance-sheet.component';
import { CashflowStatementComponent } from './company/cashflow-statement/cashflow-statement.component';
import { ConfigurableDashboardComponent } from './company/configurable-dashboard/configurable-dashboard.component';
import { GridsterModule } from 'angular-gridster2';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { FairPeCalculatorComponent } from './company/fair-pe-calculator/fair-pe-calculator.component';
import { ScreenerComponent } from './screener/screener.component';
import { CriteriaComponent } from './screener/criteria/criteria.component';
import { ResultsComponent } from './screener/results/results.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { DcfAnalysisComponent } from './company/dcf-analysis/dcf-analysis.component';
import {DecimalPipe} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    CompanyComponent,
    IncomeStatementComponent,
    CompaniesComponent,
    CompanyOverviewComponent,
    CompanySearchComponent,
    BalanceSheetComponent,
    CashflowStatementComponent,
    ConfigurableDashboardComponent,
    FairPeCalculatorComponent,
    ScreenerComponent,
    CriteriaComponent,
    ResultsComponent,
    WatchlistComponent,
    DcfAnalysisComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    ClarityModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    FormsModule,
    GridsterModule,
    NgxWebstorageModule.forRoot(),
  ],
  providers: [
    DecimalPipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

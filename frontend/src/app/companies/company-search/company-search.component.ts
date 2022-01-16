import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { LocalStorage } from 'ngx-webstorage';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.scss'],
})
export class CompanySearchComponent implements OnInit {
  searchString = '';

  companySearchQuery = gql`
    query ($SearchString: String) {
      companies(SearchString: $SearchString) {
        CompanyName
        Ticker
        SimFinId
      }
    }
  `;

  companies = [];

  @LocalStorage('recentlySearchedCompanies')
  recentlySearchedCompanies;

  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit(): void {
    if (!this.recentlySearchedCompanies) {
      this.recentlySearchedCompanies = [];
    }
  }

  onUpdateSearch() {
    this.fetchCompanies(this.searchString);
  }

  onNavigate(company) {
    this.updateRecentlySearched(company);
    this.navigateTo(company);
  }

  private updateRecentlySearched(company) {
    if (this.recentlySearchedCompanies.length > 4) {
      this.recentlySearchedCompanies.pop();
    }

    this.recentlySearchedCompanies.unshift(company);
    this.recentlySearchedCompanies = this.recentlySearchedCompanies;
  }

  private navigateTo(company) {
    this.router.navigateByUrl('companies/' + company.SimFinId);
  }

  private fetchCompanies(searchString) {
    this.apollo
      .query({
        query: this.companySearchQuery,
        variables: {
          SearchString: searchString,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((res) => res.data['companies']))
      .subscribe((companies) => {
        this.companies = companies;
      });
  }
}

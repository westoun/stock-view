import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit {
  company;

  companyQuery = gql`
    query ($SimFinId: Int!) {
      company(SimFinId: $SimFinId) {
        CompanyName
        Ticker
        SimFinId
      }
    }
  `;

  isInWatchlist = false;

  @LocalStorage('watchlist')
  watchlist;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    public router: Router,
  ) {}

  ngOnInit() {
    if (!this.watchlist) {
      this.watchlist = [];
    }

    this.route.params.subscribe(async (val) => {
      await this.fetchCompany();
      this.checkWatchlist();
    });
  }

  onToggleWatchlist() {
    if (this.isInWatchlist) {
      this.watchlist = this.watchlist.filter(
        (company) => company.SimFinId !== this.company.SimFinId
      );
    } else {
      this.watchlist = [...this.watchlist, this.company];
    }

    this.isInWatchlist = !this.isInWatchlist;
  }

  private checkWatchlist() {
    const watchlistIds = this.watchlist.map((company) => company.SimFinId);

    if (watchlistIds.includes(this.company.SimFinId)) {
      this.isInWatchlist = true;
    }
  }

  private fetchCompany() {
    return this.apollo
      .query({
        query: this.companyQuery,
        variables: {
          SimFinId: this.getCompanyId(),
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((res) => res.data['company']))
      .toPromise()
      .then((company) => {
        this.company = company;
      });
  }

  private getCompanyId() {
    return this.route.snapshot.params['companyId'];
  }
}

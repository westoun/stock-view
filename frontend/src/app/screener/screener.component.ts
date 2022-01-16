import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-screener',
  templateUrl: './screener.component.html',
  styleUrls: ['./screener.component.scss'],
})
export class ScreenerComponent implements OnInit {
  filterResults;

  constructor() {}

  onFilterResultsChange(results) {
    this.filterResults = results;
  }

  ngOnInit(): void {}
}

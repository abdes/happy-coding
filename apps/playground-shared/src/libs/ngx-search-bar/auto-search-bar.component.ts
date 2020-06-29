// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-search-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  Component,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';

import { MatAutocomplete } from '@angular/material/autocomplete';

import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, BehaviorSubject, throwError, Subject } from 'rxjs';
import { debounceTime, takeUntil, map, take, catchError } from 'rxjs/operators';

import { HighlightStyleConfig } from '@npcz/ngx-highlight';
import { SearchBarComponent } from '@npcz/ngx-search-bar';

@Component({
  selector: 'hcpg-auto-search-bar',
  templateUrl: './auto-search-bar.component.html',
  styles: [],
})
export class AutoSearchBarComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatAutocomplete) private _autocomplete: MatAutocomplete;
  @ViewChild(SearchBarComponent) private _searchBar: SearchBarComponent;

  // Automatic unsubscription when the component is destroyed
  // We don't want an emitted value, just the fact of emitting is enough
  private _ngUnsubscribe$ = new Subject<never>();

  private _searchSuggestions = new BehaviorSubject<string[]>([]);
  searchSuggestions: Observable<
    string[]
  > = this._searchSuggestions.asObservable();

  categories = [
    'All products',
    'Health',
    'Computers & Accessories',
    'Electronics',
    'Home & Kitchen',
  ];
  highlightStyle: HighlightStyleConfig = {
    hover: 'shadow',
    focus: 'outline',
  };

  isLoading = false;

  constructor(private _http: HttpClient, private _cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this._searchBar.autoComplete = this._autocomplete;
    this._cd.detectChanges();

    this._searchBar.changes
      .pipe(
        debounceTime(300),
        map((value) => {
          if (!value || !value.query || value.query.length == 0) {
            // Reset the search suggestions
            this._searchSuggestions.next([]);
          } else {
            this._loadSearchSuggestion(value);
          }
        }),
        takeUntil(this._ngUnsubscribe$)
      )
      .subscribe();

    this._searchBar.search
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((value) => {
        console.debug('submit: ', value);
        // Reset the search suggestions
        this._searchSuggestions.next([]);
      });
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }

  private _loadSearchSuggestion(searchOptions): void {
    const params = new HttpParams();
    params.set('output', 'firefox');
    params.set('q', searchOptions.query);

    console.debug('loading search suggestions: ', searchOptions);
    this.isLoading = true;
    this._http
      .get(
        '/complete/search?output=firefox&q=' +
          encodeURI(searchOptions.query) +
          '&hl=en',
        {
          params: params,
        }
      )
      .pipe(
        map((res) => res[1]),
        take(1),
        catchError(() => {
          this._searchSuggestions.next([]);
          this.isLoading = false;
          return throwError('Failed to get search suggestions.');
        })
      )
      .subscribe((suggestions) => {
        this._searchSuggestions.next(suggestions);
        this.isLoading = false;
      });
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}

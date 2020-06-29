# @npcz/ngx-search-bar

An angular material custom component that implements a search bar. The bar has
the usual input field, a search button and can optionally have the following
additional features:

- automatic highlighting on hover, focus or both, with the highlight style
  being configurable (background, shadow or outline)
- a clear button that shows only when the search input is not empty and can be
  clicked to clear the input field
- a select component that can be used to chose a search category to restrict
  the data source used for search results
- ability to connect the search field to an angular material autocomplete
  component provided by the host of the search bar

## Installation

```sh
npm install @npcz/ngx-search-bar --save
```

or

```sh
yarn add @npcz/ngx-search-bar
```

## Basic Usage

### 1. Import the `SearchBarModule`

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SearchBarModule } from '@npcz/ngx-search-bar';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SearchBarModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### 2. Add the configuration properties to the component

Specify the highlighting style you want to be applied by defining a variable in
the component file of type `HighlightStyleConfig`

```ts
type HighlighStyle = 'shadow' | 'outline' | 'background' | 'none';
type HighlightStyleConfig = {
  hover?: HighlighStyle;
  focus?: HighlighStyle;
};
```

```ts
import { Component } from '@angular/core';
import { HighlightStyleConfig } from '@npcz/ngx-highlight';

@Component({
  selector: 'exmp-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly highlightStyle: HighlightStyleConfig = {
    hover: 'background',
    focus: 'outline',
  };

  // categories can be provided through a Service or any other suitable source
  // in a real application
  readonly categories = [
    'All products',
    'Health',
    'Computers & Accessories',
    'Electronics',
    'Home & Kitchen',
  ];
}
```

### 3. Include a hc-search-bar component in the template

```html
<hc-search-bar
  [highlightStyle]="highlightStyle"
  [categoryList]="categories"
  category="All Products"
  clearButton="true"
>
</hc-search-bar>
```

### 4. Include the theming support styles in your app

ngx-search-bar uses SASS styling and provides mixins that can be integrated into
and angular material application theme. Simply follow the instructions for
[Angular Material Theming](https://material.angular.io/guide/theming). The theme
file is located in `node_modules/@npcz/ngx-search-bar/src/styles`.

## Adding search suggestions with autocomplete

The component has zero dependencies on services or providers from the
application to implement search related functions. Instead it expects the host
component to configure it following parent->child communication model with Input
properties. All child->parent communication uses Observables.

Here is an example of a host component providing the autocomplete implementation
to the search bar and using its observables:

```html
<hc-search-bar
  [highlightStyle]="highlightStyle"
  [categoryList]="categories"
  category="All Products"
  clearButton="true"
>
</hc-search-bar>
<!-- 
  The autocomplete template is provided by the host to completely decouple
  the search bar from the search implementation.
-->
<mat-autocomplete #auto="matAutocomplete" autoActiveFirstOption="true">
  <mat-option *ngIf="isLoading" class="is-loading"
    ><mat-spinner diameter="40"></mat-spinner
  ></mat-option>
  <ng-container *ngIf="!isLoading">
    <mat-option
      *ngFor="let suggestion of searchSuggestions | async"
      [value]="suggestion"
    >
      <span>{{ suggestion }}</span>
    </mat-option>
  </ng-container>
</mat-autocomplete>
```

```ts
export class GlobalSearchBarComponent implements AfterViewInit, OnDestroy {
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

  isLoading = false;

  constructor(private _http: HttpClient, private _cd: ChangeDetectorRef) {
  }

  // Hook into the search bar event observables after the view is initialized
  // and the @ViewChild bindings become valid
  ngAfterViewInit(): void {
    this._searchBar.autoComplete = this._autocomplete;
    this._cd.detectChanges();

    // Get involved everytime a change to the selected category or to the
    // search input field occurs.
    // => load search suggestions here
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

    // Know when the search needs to be done (user clicked the search button or
    // hit the 'Enter' key)
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

  // Implementation of the search suggestions.
  // Example using goolge search suggestions rest API
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

```

## Properties

| Property         | Type                   | Default                                     | Description                                                                                                                                                                                                                          |
| ---------------- | ---------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `placeholder`    | `string`               | none                                        | Placeholder text for the search input field                                                                                                                                                                                          |
| `clearButton`    | `boolean`              | `false`                                     | Adds a 'clear input' button when true                                                                                                                                                                                                |
| `disabled`       | `boolean`              | `false`                                     | Makes the search bar '[disabled](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled)'                                                                                                                             |
| `highlightStyle` | `HighlightStyleConfig` | `{ hover: 'background', focus: 'outline' }` | Specifies whether and how the search bar style will change when it is hovered or focused                                                                                                                                             |
| `categoryList`   | `string[]`             | `undefined`                                 | When set to a valid value, this will add a category selection control and a menu with the values in the list to the search bar                                                                                                       |
| `category`       | `string`               | `undefined`                                 | The currently selected category from the categoryList                                                                                                                                                                                |
| `autoComplete`   | `MatAutoComplete`      | `undefined`                                 | The angular material autocomplete component to be used by the search bar for search suggestions. If undefined, no search suggestions functionality will be provided. See example for how to add search suggestions to the search bar |

## Events

| Event     | Type              | Description                                                                                                                                                   |
| --------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `changes` | `SearchQueryData` | Triggered any time the category or the search input field value changes. Event details will contain the category (optional) and the search input field values |
| `search`  | `SearchQueryData` | Triggered when a search must be initiated. Event details will contain the category (optional) and the search query                                            |

## Methods

| Method      | Description                                                                            |
| ----------- | -------------------------------------------------------------------------------------- |
| `clear()`   | Clear the search input field                                                           |
| `enable()`  | Enable/activate the search bar                                                         |
| `disable()` | Disable/deactivate the search bar                                                      |
| `focus()`   | Set focus the search bar, which will automatically set focus to the search input field |

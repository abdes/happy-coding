// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-search-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MatButton } from '@angular/material/button';
import { MatAutocomplete } from '@angular/material/autocomplete';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HighlightStyleConfig } from '@npcz/ngx-highlight';

export type SearchQueryData = {
  category?: string;
  query: string;
};

@Component({
  selector: 'hc-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @ViewChild('search__input') private _searchInput: ElementRef;
  @ViewChild('search__submit') private _submitButton: MatButton;

  @Input() placeholder: string;
  @Input() clearButton: boolean;
  @Input() categoryList: string[];
  @Input() category: string;
  @Input() disabled: boolean;
  @Input() highlightStyle: HighlightStyleConfig = {
    hover: 'background',
    focus: 'outline',
  };

  private _autoComplete: MatAutocomplete;
  get autoComplete(): MatAutocomplete {
    return this._autoComplete;
  }
  @Input() set autoComplete(value: MatAutocomplete) {
    this._autoComplete = value;
    this._setupAutoCompleteSelectionHandler();
  }

  @Output() search = new EventEmitter<SearchQueryData>();
  @Output() changes = new EventEmitter<SearchQueryData>();

  searchQuery = '';

  // Public because of use in the template, but not intended to be used outside
  // of this component
  _searchForm = this._fb.group({
    searchInput: null,
  });

  // Automatic unsubscription when the component is destroyed
  // We don't want an emitted value, just the fact of emitting is enough
  private _ngUnsubscribe$ = new Subject<never>();

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this._searchForm
      .get('searchInput')
      .valueChanges.pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((value) => {
        this.searchQuery = value;
        console.debug(`emit changes: ${this.category} / ${this.searchQuery}`);
        this.changes.emit({
          category: this.category,
          query: this.searchQuery,
        });
      });
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }

  clear(): void {
    this._searchForm.get('searchInput').setValue('');
    this._setFocusToSearchInput();
  }

  enable(): void {
    this.disabled = false;
  }

  disable(): void {
    this.clear();
    this.disabled = true;
  }

  focus(): void {
    this._setFocusToSearchInput();
  }

  _onCategorySelected(value: string): void {
    this.category = value;
    console.debug(`emit changes: ${this.category} / ${this.searchQuery}`);
    this.changes.emit({
      category: this.category,
      query: this.searchQuery,
    });
  }

  _onCategoryMenuClosed(): void {
    this._setFocusToSearchInput();
  }

  _onSubmit(): void {
    console.debug(`submit: ${this.category} / ${this.searchQuery}`);
    this.search.emit({
      category: this.category,
      query: this.searchQuery,
    });
    this._searchInput.nativeElement.blur();
  }

  private _setupAutoCompleteSelectionHandler() {
    this._autoComplete.optionSelected
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe(() => {
        // Trigger a form submit by clicking the submit button
        this._submitButton._elementRef.nativeElement.click();
      });
  }

  private _setFocusToSearchInput() {
    this._searchInput.nativeElement.focus();
    // Move the cursor to the end of the text input value so that the user is
    // ready to type
    this._moveCursorToEnd();
  }

  private _moveCursorToEnd() {
    const el = this._searchInput.nativeElement;
    if (typeof el.selectionStart == 'number') {
      el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != 'undefined') {
      const range = el.createTextRange();
      range.collapse(false);
      range.select();
    }
  }
}

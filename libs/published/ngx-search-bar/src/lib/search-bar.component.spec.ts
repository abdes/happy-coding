// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-search-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { SearchBarComponent } from './search-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EllipsisModule } from 'ngx-ellipsis';
import { HighlightModule } from '@npcz/ngx-highlight';

describe('SearchBarComponent', () => {
  let spectator: Spectator<SearchBarComponent>;
  const createComponent = createComponentFactory({
    component: SearchBarComponent,
    imports: [
      // Angular
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      // Material
      MatIconModule,
      MatButtonModule,
      MatInputModule,
      MatMenuModule,
      MatAutocompleteModule,
      // Other external dependencies
      FlexLayoutModule,
      EllipsisModule, // Categhory name shortening
      HighlightModule, // highlight on hover/focus
    ],
  });

  describe('defaults', () => {
    beforeEach(() => {
      spectator = createComponent();
    });

    it('should not have category features', () => {
      expect(spectator.component).not.toHaveDescendant(
        '.search-category__button'
      );
    });

    it('should not have a placeholder for search input', () => {
      expect(spectator.query('.search__input')).not.toHaveAttribute(
        'placeholder'
      );
    });

    it('should not show a clear button for the input field', () => {
      spectator.component._searchForm.get('searchInput').setValue('hello');
      expect(spectator.query('button.search__clear')).toBeNull();
    });

    it('should have a search button, the only one of type submit', () => {
      const allSubmitButtons = spectator.queryAll('button[type=submit]');
      expect(allSubmitButtons.length).toEqual(1);
      expect(allSubmitButtons[0]).toHaveClass('search__submit');
    });

    it('should have default highlight style', () => {
      expect(spectator.component.highlightStyle).toEqual({
        hover: 'background',
        focus: 'outline',
      });
    });
  });

  describe('search input field', () => {
    it('should show the placeholder when empty', () => {
      spectator = createComponent({
        props: { placeholder: '__placeholder__' },
      });

      expect(
        spectator.component._searchForm.get('searchInput').value
      ).toBeNull();
      expect(spectator.query('.search__input')).toHaveAttribute(
        'placeholder',
        '__placeholder__'
      );
    });

    it('should have the same value than searchQuery', () => {
      spectator = createComponent();
      const inputField = spectator.component._searchForm.get('searchInput');
      // Empty at start
      expect(inputField.value).toBeNull();
      expect(spectator.component.searchQuery).toEqual('');

      // With value
      inputField.setValue('hello');
      spectator.detectChanges();
      expect(spectator.component.searchQuery).toEqual('hello');

      // After value changes
      inputField.setValue('bye');
      spectator.detectChanges();
      expect(spectator.component.searchQuery).toEqual('bye');
    });
  });

  describe('clear button enabled', () => {
    beforeEach(() => {
      spectator = createComponent({
        props: {
          clearButton: true,
        },
      });
      expect(spectator.component.clearButton).toBeTruthy();
    });

    it('should show button when input is not empty and remove it when it becomes empty', () => {
      spectator.component._searchForm.get('searchInput').setValue('a');
      spectator.detectChanges();

      expect(spectator.component.searchQuery).toBeTruthy();
      let clearButton = spectator.query('button.search__clear');
      expect(clearButton).not.toBeNull();
      expect(clearButton).toHaveAttribute('type', 'button');

      spectator.component._searchForm.get('searchInput').setValue('');
      spectator.detectChanges();
      clearButton = spectator.query('button.search__clear');
      expect(clearButton).toBeNull();
    });

    it('should clear input field when clicked', () => {
      spectator.component._searchForm.get('searchInput').setValue('a');
      spectator.detectChanges();

      spectator.click('button.search__clear');
      spectator.detectChanges();
      expect(spectator.component._searchForm.get('searchInput').value).toEqual(
        ''
      );
      expect(spectator.component.searchQuery).toEqual('');
      expect(spectator.query('button.search__clear')).toBeNull();
    });
  });

  describe('search button', () => {
    let searchButton: Element;
    beforeEach(() => {
      spectator = createComponent();
      spectator.component._onSubmit = jest.fn();
      searchButton = spectator.query('button.search__submit');
    });
    it('should call _onSubmit() when clicked', () => {
      spectator.click(searchButton);
      expect(spectator.component._onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('search category', () => {
    it('should not show category button if no category list', () => {
      spectator = createComponent({ props: { category: 'test' } });
      expect(spectator.query('.search-category__button')).toBeNull();
    });
    it('should not show category button if category list is empty', () => {
      spectator = createComponent({ props: { categoryList: [] } });
      expect(spectator.query('.search-category__button')).toBeNull();
    });
    it('should not show category button if category list is null', () => {
      spectator = createComponent({ props: { categoryList: null } });
      expect(spectator.query('.search-category__button')).toBeNull();
    });
    it('should show category button if category list is is not empty', () => {
      spectator = createComponent({
        props: { categoryList: ['cat-1', 'cat-2', 'cat-3'] },
      });
      expect(spectator.query('.search-category__button')).not.toBeNull();
    });
    it('should set category to first in list if no category is provided', () => {
      spectator = createComponent({
        props: { categoryList: ['cat-1', 'cat-2', 'cat-3'] },
      });
      expect(spectator.component.category).toEqual('cat-1');
    });

    describe('button', () => {
      let button: Element;
      beforeEach(() => {
        spectator = createComponent({
          props: { categoryList: ['cat-1', 'cat-2', 'cat-3'] },
        });
        button = spectator.query('button.search-category__button');
        expect(button).toBeTruthy();
      });

      it('should start with the menu not shown', () => {
        const menu = spectator.query('.mat-menu-panel', { root: true });
        expect(menu).not.toBeTruthy();
      });

      it('should open the menu when clicked', () => {
        spectator.click(button);
        spectator.detectChanges();

        const menu = spectator.query('.mat-menu-panel', { root: true });
        expect(menu).toBeTruthy();
      });
    });

    describe('menu', () => {
      it('should call _onCategorySelected when a menu button is clicked', () => {
        spectator = createComponent({
          props: { categoryList: ['cat-1', 'cat-2', 'cat-3'] },
        });
        spectator.component._onCategorySelected = jest.fn();
        spectator.component._onCategoryMenuClosed = jest.fn();
        spectator.click(spectator.query('button.search-category__button'));
        spectator.detectChanges();

        const menu = spectator.query('.mat-menu-panel', { root: true });
        expect(menu).toBeTruthy();

        const menuItems = menu.querySelectorAll('.mat-menu-item');
        expect(menuItems).toBeTruthy();
        expect(menuItems.length).toEqual(3);

        spectator.click(menuItems[1]);
        spectator.detectChanges();
        expect(spectator.component._onCategorySelected).toBeCalledWith('cat-2');
      });

      it('should set focus to the input field when menu is closed', () => {
        spectator = createComponent({
          props: { categoryList: ['cat-1', 'cat-2', 'cat-3'] },
        });
        spectator.click(spectator.query('button.search-category__button'));
        spectator.detectChanges();

        spectator.component._onCategoryMenuClosed();
        spectator.detectChanges();

        const input = spectator.query('.search__input');
        expect(input).toBeFocused();
      });

      it('should move cursor to end of input field when menu is closed', () => {
        spectator = createComponent({
          props: { categoryList: ['cat-1', 'cat-2', 'cat-3'] },
        });
        spectator.component._searchForm.get('searchInput').setValue('hello');
        const input: HTMLInputElement = spectator.query('.search__input');
        spectator.detectChanges();
        expect(input.selectionStart).toEqual(0);

        spectator.click(spectator.query('button.search-category__button'));
        spectator.detectChanges();
        spectator.component._onCategoryMenuClosed();
        spectator.detectChanges();

        expect(input.selectionStart).toEqual(input.value.length);
      });
    });
  });

  describe('changes event', () => {
    it('should emit on category change', () => {
      spectator = createComponent({
        props: { category: 'cat-1', categoryList: ['cat-1', 'cat-2', 'cat-3'] },
      });

      spectator.component.searchQuery = 'hello';

      spectator.component.changes.emit = jest.fn();

      // No event if category does not change
      spectator.component._onCategorySelected('cat-1');
      expect(spectator.component.changes.emit).not.toBeCalled();

      // Event if category really changes
      spectator.component._onCategorySelected('cat-2');
      expect(spectator.component.changes.emit).toBeCalledWith({
        category: 'cat-2',
        query: 'hello',
      });
    });

    it('should emit on search query change', () => {
      spectator = createComponent();
      const input = spectator.component._searchForm.get('searchInput');

      spectator.component.changes.emit = jest.fn();

      input.setValue('hello');
      spectator.detectChanges();
      expect(spectator.component.changes.emit).toBeCalledWith({
        category: undefined,
        query: 'hello',
      });

      // No event if search query does not change
      spectator.component.searchQuery = 'hello';
      input.setValue('hello');
      spectator.detectChanges();
      expect(spectator.component.changes.emit).toBeCalledTimes(1);
    });
  });

  describe('on submit', () => {
    it('should emit the event', () => {
      spectator = createComponent();
      spectator.component.searchQuery = 'q';
      spectator.component.category = 'c';

      spectator.component.search.emit = jest.fn();

      spectator.component._onSubmit();
      expect(spectator.component.search.emit).toBeCalledWith({
        category: 'c',
        query: 'q',
      });
    });

    it('should blur the search input field', () => {
      spectator = createComponent({
        props: { categoryList: ['cat-1', 'cat-2', 'cat-3'] },
      });

      const input: HTMLInputElement = spectator.query('.search__input');
      input.blur = jest.fn();

      spectator.component._onSubmit();
      spectator.detectChanges();

      expect(input.blur).toHaveBeenCalled();
    });
  });

  describe('enable/disable', () => {
    it('should disable all interactive elements when disabled', () => {
      spectator = createComponent({
        props: { categoryList: ['cat-1', 'cat-2', 'cat-3'], clearButton: true },
      });

      spectator.component._searchForm.get('searchInput').setValue('hello');

      spectator.component.disable();
      spectator.detectChanges();
      expect(spectator.component.disabled).toBeTruthy();
      expect(spectator.query('.search-category__button')).toBeDisabled();
      expect(
        spectator.component._searchForm.get('searchInput').disabled
      ).toBeTruthy();
      expect(spectator.query('.search__clear')).toBeDisabled();
      expect(spectator.query('.search__submit')).toBeDisabled();
    });

    it('should enable all interactive elements when enabled', () => {
      spectator = createComponent({
        props: {
          categoryList: ['cat-1', 'cat-2', 'cat-3'],
          clearButton: true,
          disabled: true,
        },
      });

      spectator.component._searchForm.get('searchInput').setValue('hello');
      spectator.detectChanges();
      expect(spectator.component.disabled).toBeTruthy();
      expect(spectator.query('.search-category__button')).toBeDisabled();
      expect(
        spectator.component._searchForm.get('searchInput').disabled
      ).toBeTruthy();
      expect(spectator.query('.search__clear')).toBeDisabled();
      expect(spectator.query('.search__submit')).toBeDisabled();

      spectator.component.enable();
      spectator.detectChanges();
      expect(spectator.component.disabled).toBeFalsy();
      expect(spectator.query('.search-category__button')).not.toBeDisabled();
      expect(
        spectator.component._searchForm.get('searchInput').disabled
      ).toBeFalsy();
      expect(spectator.query('.search__clear')).not.toBeDisabled();
      expect(spectator.query('.search__submit')).not.toBeDisabled();
    });
  });

  describe('focus', () => {
    it('set focus to the search input when focused', () => {
      spectator = createComponent();

      spectator.component.focus();
      spectator.detectChanges();
      const input = spectator.query('.search__input');
      expect(input).toBeFocused();
    });
  });
});

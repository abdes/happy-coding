// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-search-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { sandboxOf } from 'angular-playground';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { FlexLayoutModule } from '@angular/flex-layout';
import { EllipsisModule } from 'ngx-ellipsis';

import { HighlightModule } from '@npcz/ngx-highlight';
import { SearchBarComponent } from '@npcz/ngx-search-bar';

const sandboxConfig = {
  imports: [
    // Angular
    CommonModule,
    BrowserAnimationsModule,
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
  providers: [],
  declarations: [SearchBarComponent],
  exports: [SearchBarComponent],
  label: 'ngx-search-bar',
};

export default sandboxOf(SearchBarComponent, sandboxConfig)
  .add('default', {
    template: '<hc-search-bar>Hello</hc-search-bar>',
  })
  .add('all features - no autocomplete', {
    template: `
    <hc-search-bar
      placeholder="Search products"
      clearButton=true
      [categoryList]="categories">
    </hc-search-bar>
    `,
    context: {
      categories: ['All Products', 'Home & Kitchen', 'Toys', 'Books'],
    },
  });

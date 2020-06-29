// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-search-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { sandboxOf } from 'angular-playground';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SearchBarModule } from '@npcz/ngx-search-bar';

import { AutoSearchBarComponent } from './auto-search-bar.component';

const sandboxConfig = {
  imports: [
    CommonModule,
    SearchBarModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    HttpClientModule,
  ],
  declarations: [AutoSearchBarComponent],
  exports: [AutoSearchBarComponent],
  label: 'Search Bar with autocomplete',
};

export default sandboxOf(AutoSearchBarComponent, sandboxConfig).add(
  'google search suggestions',
  {
    template: '<hcpg-auto-search-bar></hcpg-auto-search-bar>',
  }
);

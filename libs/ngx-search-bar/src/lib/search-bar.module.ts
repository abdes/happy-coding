// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-search-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { NgModule } from '@angular/core';
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
import { SearchBarComponent } from './search-bar.component';

@NgModule({
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
  declarations: [SearchBarComponent],
  exports: [SearchBarComponent],
})
export class SearchBarModule {}

// Copyright (c) 2019-2020 The Authors.
// This file is part of @npcz/ngx-search-bar.
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

  it('should create', () => {
    spectator = createComponent();

    // TODO: make useful tests
    expect(spectator.component).toBeTruthy();
  });
});

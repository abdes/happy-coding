// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-search-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { async, TestBed } from '@angular/core/testing';
import { SearchBarModule } from './search-bar.module';

describe('NgxSearchBarModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SearchBarModule],
    }).compileComponents();
  }));

  // This module has nothing special to test
  it('should have a module definition', () => {
    expect(SearchBarModule).toBeDefined();
  });
});

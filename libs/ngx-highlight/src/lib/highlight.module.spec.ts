// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-highlight
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { async, TestBed } from '@angular/core/testing';
import { HighlightModule } from './highlight.module';

describe('NgxHighlightModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HighlightModule],
    }).compileComponents();
  }));

  // This module has nothing special to test
  it('should have a module definition', () => {
    expect(HighlightModule).toBeDefined();
  });
});

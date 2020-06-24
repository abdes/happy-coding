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

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(HighlightModule).toBeDefined();
  });
});

// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-highlight
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Component, OnInit, ViewChild } from '@angular/core';

import {
  HighlightStyle,
  HighlightStyleConfig,
  HighlightDirective,
} from '../lib/public-api';

@Component({
  selector: 'hc-pg-highlight-sandbox',
  templateUrl: './highlight-sandbox.component.html',
  styleUrls: ['./highlight-sandbox.component.scss'],
})
export class HighlightSandboxComponent implements OnInit {
  @ViewChild(HighlightDirective) highlight: HighlightDirective;

  JSON = JSON;

  withHover = true;
  hoverStyle: HighlightStyle = 'background';
  withFocus = true;
  focusStyle: HighlightStyle = 'outline';

  withDebounceTime = true;
  debounceTime = 500;

  readonly styles: HighlightStyle[] = [
    'background',
    'shadow',
    'outline',
    'none',
  ];

  configText: string;

  highlightStyle: HighlightStyleConfig = {
    hover: this.hoverStyle,
    focus: this.focusStyle,
    debounceTime: this.debounceTime,
  };

  ngOnInit(): void {
    this.updateStyle();
  }

  updateStyle(): void {
    this.highlightStyle = {};
    if (this.withDebounceTime) {
      this.highlightStyle = {
        ...this.highlightStyle,
        debounceTime: this.debounceTime,
      };
    }
    if (this.withHover) {
      this.highlightStyle = {
        ...this.highlightStyle,
        hover: this.hoverStyle,
      };
    }
    if (this.withFocus) {
      this.highlightStyle = {
        ...this.highlightStyle,
        focus: this.focusStyle,
      };
    }
    this.highlight.highlightStyle = this.highlightStyle;
  }
}

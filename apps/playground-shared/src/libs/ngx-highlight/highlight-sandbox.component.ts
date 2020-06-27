// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-highlight
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Component, ViewChild, AfterViewInit } from '@angular/core';

import {
  HighlightStyle,
  HighlightStyleConfig,
  HighlightDirective,
} from '@npcz/ngx-highlight';

@Component({
  selector: 'hcpg-highlight-sandbox',
  templateUrl: './highlight-sandbox.component.html',
  styleUrls: ['./highlight-sandbox.component.scss'],
})
export class HighlightSandboxComponent implements AfterViewInit {
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
  };

  ngAfterViewInit(): void {
    this.updateStyle();
  }

  updateStyle(): void {
    if (this.withDebounceTime) {
      this.highlight.hcHighlightDebounce = this.debounceTime;
    }
    this.highlightStyle = {};
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

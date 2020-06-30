// Copyright (c) 2019-2020 The Authors
// This file is part of https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Component } from '@angular/core';
import { HighlightStyleConfig } from '@npcz/ngx-highlight';

@Component({
  selector: 'exmp-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // TODO: Implement dark/light theme switching
  isDarkTheme = false;

  readonly highlightStyle: HighlightStyleConfig = {
    hover: 'background',
    focus: 'outline',
  };

  readonly categories = [
    'All products',
    'Health',
    'Computers & Accessories',
    'Electronics',
    'Home & Kitchen',
  ];
}

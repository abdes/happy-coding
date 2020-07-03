// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hc-header-logo',
  templateUrl: './header-logo.component.html',
  styleUrls: ['./header-logo.component.scss'],
})
export class HeaderLogoComponent {
  @Input() svgIcon: string;
  @Input() withLink: boolean;
  @Output() linkClicked: EventEmitter<boolean> = new EventEmitter();

  onLogoClicked(): void {
    console.debug('logo clicked');
  }
}

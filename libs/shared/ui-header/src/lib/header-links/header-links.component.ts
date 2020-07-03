// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HeaderLinkInterface } from './header-link.interface';

@Component({
  selector: 'hc-header-links',
  templateUrl: './header-links.component.html',
  styleUrls: ['./header-links.component.scss'],
})
export class HeaderLinksComponent {
  @Input() links: HeaderLinkInterface[];
  @Output() linkClicked: EventEmitter<boolean> = new EventEmitter();

  onLinkClicked(route: string): void {
    console.debug('link clicked: ', route);
  }
}

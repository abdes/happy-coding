// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hc-header-cart',
  templateUrl: './header-cart.component.html',
  styleUrls: ['./header-cart.component.scss'],
})
export class HeaderCartComponent {
  @Output() linkClicked: EventEmitter<boolean> = new EventEmitter();

  onCartClicked(): void {
    console.debug('cart clicked');
  }
}

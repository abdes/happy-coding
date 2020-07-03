// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Component, Input } from '@angular/core';

@Component({
  selector: 'hc-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss'],
})
export class HeaderUserComponent {
  @Input() userName: string;
  @Input() isAuthenticated: boolean;

  onSignInLinkClicked(event: Event): void {
    event.preventDefault();
    console.debug('signin link clicked');
  }
}

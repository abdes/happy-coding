// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-nav-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';

import { NavLinkComponent } from './nav-link';
import {
  NavBarOverflowHideComponent,
  NavBarOverflowMenuComponent,
  NavBarOverflowScrollComponent,
} from './nav-bar';

@NgModule({
  imports: [CommonModule, MatRippleModule, MatMenuModule],
  declarations: [
    NavLinkComponent,
    NavBarOverflowHideComponent,
    NavBarOverflowMenuComponent,
    NavBarOverflowScrollComponent,
  ],
  exports: [
    NavLinkComponent,
    NavBarOverflowHideComponent,
    NavBarOverflowMenuComponent,
    NavBarOverflowScrollComponent,
  ],
})
export class NavBarModule {}

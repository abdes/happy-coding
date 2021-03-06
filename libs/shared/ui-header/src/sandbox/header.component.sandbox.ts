// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { sandboxOf } from 'angular-playground';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';

import { FlexLayoutModule } from '@angular/flex-layout';
import { SearchBarModule } from '@npcz/ngx-search-bar';

import { HeaderComponent } from '../lib/header/header.component';
import { HeaderLinksComponent } from '../lib/header-links/header-links.component';
import { HeaderLogoComponent } from '../lib/header-logo/header-logo.component';
import { HeaderRegionComponent } from '../lib/header-region/header-region.component';
import { HeaderUserComponent } from '../lib/header-user/header-user.component';
import { HeaderCartComponent } from '../lib/header-cart/header-cart.component';

import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';

const sandboxConfig = {
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    MatSelectModule,
    MatBadgeModule,
    SearchBarModule,
    HttpClientModule,
  ],
  providers: [provideMockStore({})],
  declarations: [
    HeaderComponent,
    HeaderLinksComponent,
    HeaderLogoComponent,
    HeaderRegionComponent,
    HeaderUserComponent,
    HeaderCartComponent,
  ],
  exports: [HeaderComponent],
  label: 'ui-header',
};

export default sandboxOf(HeaderComponent, sandboxConfig).add('default', {
  template: '<hc-header>Hello</hc-header>',
});

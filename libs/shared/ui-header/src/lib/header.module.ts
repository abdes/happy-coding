// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { FlexLayoutModule } from '@angular/flex-layout';
import { SearchBarModule } from '@npcz/ngx-search-bar';

import { HeaderComponent } from './header/header.component';
import { HeaderLinksComponent } from './header-links/header-links.component';
import { HeaderLogoComponent } from './header-logo/header-logo.component';
import { HeaderRegionComponent } from './header-region/header-region.component';
import { HeaderUserComponent } from './header-user/header-user.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatRippleModule,
    MatSelectModule,
    SearchBarModule,
  ],
  declarations: [
    HeaderComponent,
    HeaderLinksComponent,
    HeaderLogoComponent,
    HeaderRegionComponent,
    HeaderUserComponent,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}

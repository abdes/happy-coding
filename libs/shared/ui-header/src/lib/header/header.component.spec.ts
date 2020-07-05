// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { HeaderComponent } from './header.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SearchBarModule } from '@npcz/ngx-search-bar';
import { HeaderLinksComponent } from '../header-links/header-links.component';
import { HeaderLogoComponent } from '../header-logo/header-logo.component';
import { HeaderRegionComponent } from '../header-region/header-region.component';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { HttpClientModule } from '@angular/common/http';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  const createComponent = createComponentFactory({
    component: HeaderComponent,
    imports: [
      CommonModule,
      HttpClientModule,
      FlexLayoutModule,
      MatButtonModule,
      MatFormFieldModule,
      MatIconModule,
      MatMenuModule,
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
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});

// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { sandboxOf } from 'angular-playground';

import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';

import { HeaderComponent } from '../lib/header/header.component';
import { provideMockStore } from '@ngrx/store/testing';

const sandboxConfig = {
  imports: [CommonModule, MatToolbarModule],
  providers: [provideMockStore({})],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  label: 'ui-header',
};

export default sandboxOf(HeaderComponent, sandboxConfig).add('default', {
  template: '<hc-header>Hello</hc-header>',
});

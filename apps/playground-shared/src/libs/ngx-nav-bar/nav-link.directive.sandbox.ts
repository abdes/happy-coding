// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-search-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { sandboxOf } from 'angular-playground';

import { CommonModule } from '@angular/common';
import {
  BrowserAnimationsModule,
  ANIMATION_MODULE_TYPE,
} from '@angular/platform-browser/animations';

import { NavLinkComponent } from '@npcz/ngx-nav-bar';
import { MatRippleModule } from '@angular/material/core';

const sandboxConfig = {
  imports: [
    // Angular
    CommonModule,
    BrowserAnimationsModule,
    // Material
    MatRippleModule,
    // Other external dependencies
  ],
  declarations: [NavLinkComponent],
  label: 'ngx-nav-bar',
};

export default sandboxOf(NavLinkComponent, sandboxConfig)
  .add('default', {
    template:
      '<a href="1" (click)="$event.preventDefault();" hc-nav-link>one</a>',
  })
  .add('disabled', {
    template:
      '<a href="1" (click)="$event.preventDefault();" hc-nav-link disabled>one</a>',
  })
  .add('disableRipple', {
    template:
      '<a href="1" (click)="$event.preventDefault();" hc-nav-link disableRipple>one</a>',
  })
  .add('active', {
    template:
      '<a href="1" (click)="$event.preventDefault();" hc-nav-link active>one</a>',
  })
  .add('noop-animations', {
    template:
      '<a href="1" (click)="$event.preventDefault();" hc-nav-link active>one</a>',
    providers: [
      {
        provide: ANIMATION_MODULE_TYPE,
        useValue: 'NoopAnimations',
      },
    ],
  });

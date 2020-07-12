// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-search-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { sandboxOf } from 'angular-playground';

import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';

import {
  NavBarOverflowHideComponent,
  NavBarOverflowMenuComponent,
  NavBarOverflowScrollComponent,
  NavLinkComponent,
  NavLink,
} from '@npcz/ngx-nav-bar';

const sandboxConfig = {
  imports: [
    // Material
    MatRippleModule,
    MatMenuModule,
  ],
  declarations: [
    NavLinkComponent,
    NavBarOverflowHideComponent,
    NavBarOverflowMenuComponent,
    NavBarOverflowScrollComponent,
  ],
  label: 'ngx-nav-bar',
};

const TEST_LINKS: NavLink[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
  (index) => {
    return { label: `Location ${index}`, target: index.toString() };
  }
);

const RTL_TEST_LINKS: NavLink[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
  (index) => {
    return { label: `الموقع ${index}`, target: index.toString() };
  }
);

export default sandboxOf(NavBarOverflowHideComponent, sandboxConfig)
  .add('disable ripple', {
    template: `
  <hc-nav-bar disableRipple [links]="links" hc-nav-overflow="hide"></hc-nav-bar>
  `,
    context: { links: TEST_LINKS },
  })
  .add('overflow hide', {
    template: `
  <hc-nav-bar [links]="links" hc-nav-overflow="hide"></hc-nav-bar>
  `,
    context: { links: TEST_LINKS },
  })
  .add('overflow hide - RTL', {
    template: `
  <hc-nav-bar dir="rtl" [links]="links" hc-nav-overflow="hide"></hc-nav-bar>
  `,
    context: { links: RTL_TEST_LINKS },
  })
  .add('overflow menu', {
    template:
      '<hc-nav-bar [links]="links" hc-nav-overflow="menu"></hc-nav-bar>',
    context: { links: TEST_LINKS },
  })
  .add('overflow menu - RTL', {
    template:
      '<hc-nav-bar dir="rtl" [links]="links" hc-nav-overflow="menu"></hc-nav-bar>',
    context: { links: RTL_TEST_LINKS },
  })
  .add('overflow scroll', {
    template:
      '<hc-nav-bar [links]="links" hc-nav-overflow="scroll"></hc-nav-bar>',
    context: { links: TEST_LINKS },
  })
  .add('overflow scroll - RTL', {
    template:
      '<hc-nav-bar dir="rtl" [links]="links" hc-nav-overflow="scroll"></hc-nav-bar>',
    context: { links: RTL_TEST_LINKS },
  });

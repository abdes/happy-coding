// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-nav-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  Component,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  NgZone,
  ViewChildren,
  Optional,
} from '@angular/core';
import type { QueryList } from '@angular/core';

import { ViewportRuler } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';

import { NavLinkComponent } from '../../nav-link';
import { _NavBarOverflowScrollBaseDirective } from './nav-bar-overflow-scroll-base.directive';
import { _NavRippleStateService } from '../../nav-ripple-state.service';
import { Directionality } from '@angular/cdk/bidi';

@Component({
  selector: 'hc-nav-bar[hc-nav-overflow="scroll"]',
  templateUrl: 'nav-bar-overflow-scroll.component.html',
  styleUrls: ['nav-bar-overflow-scroll.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [_NavRippleStateService],
})
export class NavBarOverflowScrollComponent extends _NavBarOverflowScrollBaseDirective {
  @ViewChildren(NavLinkComponent) _items: QueryList<NavLinkComponent>;
  @ViewChild('navList', { static: true }) _navList: ElementRef;
  @ViewChild('leftScroller', { static: true }) _leftScroller: ElementRef;
  @ViewChild('rightScroller', { static: true }) _rightScroller: ElementRef;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    changeDetectorRef: ChangeDetectorRef,
    rippleState: _NavRippleStateService,
    viewportRuler: ViewportRuler,
    @Optional() dir: Directionality,
    ngZone: NgZone,
    platform: Platform
  ) {
    super(
      elementRef,
      changeDetectorRef,
      rippleState,
      viewportRuler,
      dir,
      ngZone,
      platform
    );
  }
}

// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-nav-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  Component,
  ViewEncapsulation,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  ViewChildren,
  Optional,
} from '@angular/core';
import type { QueryList } from '@angular/core';

import { ViewportRuler } from '@angular/cdk/scrolling';

import { NavLinkComponent } from '../../nav-link';
import { _OverflowingNavBarDirective } from '../overflowing-nav-bar.directive';
import { _NavRippleStateService } from '../../nav-ripple-state.service';
import { Directionality } from '@angular/cdk/bidi';

@Component({
  selector: 'hc-nav-bar[hc-nav-overflow="hide"]',
  templateUrl: 'nav-bar-overflow-hide.component.html',
  styleUrls: ['nav-bar-overflow-hide.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [_NavRippleStateService],
})
export class NavBarOverflowHideComponent extends _OverflowingNavBarDirective {
  @ViewChildren(NavLinkComponent) _items: QueryList<NavLinkComponent>;
  @ViewChild('navList', { static: true }) _navList: ElementRef;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    changeDetectorRef: ChangeDetectorRef,
    rippleState: _NavRippleStateService,
    viewportRuler: ViewportRuler,
    @Optional() dir: Directionality
  ) {
    super(elementRef, changeDetectorRef, rippleState, viewportRuler, dir);
  }
  /**
   * Updates the view according to the overflow management strategy being used.
   * @internal
   */
  protected _updateViewOverflow(): void {
    super._updateViewOverflow();

    // If the currently selected item is now overflowing, move it to the head
    // of the list
    if (
      this.selectedIndex !== undefined &&
      this._items.toArray()[this.selectedIndex].overflow
    ) {
      this._links.splice(0, 0, this._links.splice(this.selectedIndex, 1)[0]);
      this._changeDetectorRef.detectChanges();
      this.selectedIndex = 0;
    }
  }
  /**
   * Handle focus events for the navigation list to activate the last known
   * focused navigation link in sync with the `FocusKeyManager`.
   */
  _onFocus(): void {
    this._keyManager.setActiveItem(this.focusIndex);
  }
}

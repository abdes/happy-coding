// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-nav-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  Component,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  ViewChildren,
  Optional,
} from '@angular/core';
import type { QueryList } from '@angular/core';

import { ViewportRuler } from '@angular/cdk/overlay';

import { NavLinkComponent } from '../../nav-link';
import { _OverflowingNavBarDirective } from '../overflowing-nav-bar.directive';
import { _NavRippleStateService } from '../../nav-ripple-state.service';
import { Directionality } from '@angular/cdk/bidi';

@Component({
  selector: 'hc-nav-bar[hc-nav-overflow="menu"]',
  templateUrl: 'nav-bar-overflow-menu.component.html',
  styleUrls: ['nav-bar-overflow-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [_NavRippleStateService],
})
export class NavBarOverflowMenuComponent extends _OverflowingNavBarDirective {
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
   * Determines if an index is valid.
   *
   * This function can and should be overloaded if additional criteria need to
   * be true for the index to be valid.
   *
   * @param index The link index to ba validated.
   * @see focusIndex
   * @internal
   */
  protected _isValidIndex(index: number): boolean {
    const item = this._items ? this._items.toArray()[index] : null;
    return !!item && !item.disabled && !item.overflow;
  }

  _onMenuLinkClicked(linkIndex: number): void {
    // Move the clicked item to the front of the links list and activate it
    this._links.splice(0, 0, this._links.splice(linkIndex, 1)[0]);
    this._changeDetectorRef.detectChanges();
    this.selectedIndex = 0;
  }

  /**
   * Handle focus events for the navigation list to activate the last known
   * focused navigation link in sync with the `FocusKeyManager`.
   */
  _onFocus(): void {
    this._keyManager.setActiveItem(this.focusIndex);
  }
}

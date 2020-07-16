// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-nav-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  Directive,
  ChangeDetectorRef,
  ElementRef,
  Optional,
} from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { ViewportRuler } from '@angular/cdk/scrolling';

import { NavLink } from '../nav-link.interface';
import { _NavBarBaseDirective } from './nav-bar-base.directive';
import { _NavRippleStateService } from '../nav-ripple-state.service';

@Directive()
export abstract class _OverflowingNavBarDirective extends _NavBarBaseDirective {
  /**
   * The index of the first overflowing item or `undefined` when there is no
   * overflow.
   * @internal
   */
  _overflowStartingIndex = -1;

  /**
   * Constructor.
   *
   * @param elementRef
   * @param changeDetectorRef
   * @param rippleState
   * @param viewportRuler
   * @param dir
   */
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
   * Check if at least one of the links is overflowing out of the visible
   * bounds of the navigation list.
   * @internal
   */
  _hasOverflowLinks(): boolean {
    return this._items && !!this._items.find((item) => item.overflow === true);
  }

  /**
   * Get only those links that are overflowing.
   * @internal
   */
  _getOverflowLinks(): NavLink[] {
    if (this._items) {
      const itemsArray = this._items.toArray();
      return this._links.filter((value, index) => itemsArray[index].overflow);
    } else {
      return [];
    }
  }

  /**
   * Updates the view according to the overflow management strategy being used.
   * @internal
   */
  protected _updateViewOverflow(): void {
    // The visible width of the navigation list
    const navListVisibleWidth = this._navList.nativeElement.offsetWidth;

    // Go over all nav links and mark the ones that are not fully contained
    // within the visible bounds of the nav list as overflowing
    this._overflowStartingIndex = undefined;
    for (const [index, item] of this._items.toArray().entries()) {
      let itemAfterPos: number;
      if (this._getLayoutDirection() == 'ltr') {
        itemAfterPos = item.offsetLeft + item.offsetWidth;
      } else {
        itemAfterPos =
          this._navList.nativeElement.offsetWidth - item.offsetLeft;
      }
      item.overflow = itemAfterPos > navListVisibleWidth;
      if (item.overflow) {
        // Track the index of the first overflowing item
        if (!this._overflowStartingIndex) {
          this._overflowStartingIndex = index;
        }
        // Reset the focus index to 0 if the currently focused item overflows
        if (index == this.focusIndex) {
          this.focusIndex = 0;
        }
      }
    }
  }

  /**
   * Do things when focus is set on the nav link at the given index.
   *
   * @param linkIndex Index of the link to be focused.
   * @see focusIndex
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onNavLinkFocus(linkIndex: number): void {
    // Nothing special
  }
}

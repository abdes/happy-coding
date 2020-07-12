// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-nav-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  Directive,
  HostBinding,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  AfterViewInit,
  Input,
  Optional,
} from '@angular/core';
import type { QueryList } from '@angular/core';

import { coerceBooleanProperty, coerceArray } from '@angular/cdk/coercion';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { END, ENTER, HOME, SPACE, hasModifierKey } from '@angular/cdk/keycodes';

import { Subject, merge, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NavLink } from '../nav-link.interface';
import { NavLinkComponent } from '../nav-link/nav-link.component';
import { _NavRippleStateService } from '../nav-ripple-state.service';

@Directive()
export abstract class _NavBarBaseDirective implements AfterViewInit, OnDestroy {
  @HostBinding('class') get classes(): string {
    return ['hc-nav-bar', 'hc-nav-bar--' + this._getLayoutDirection()].join(
      ' '
    );
  }

  private _disableRipple = false;
  get disableRipple(): boolean {
    return this._disableRipple;
  }
  @Input() set disableRipple(value: boolean) {
    this._rippleState.disabled = this._disableRipple = coerceBooleanProperty(
      value
    );
  }

  _links: NavLink[];
  @Input() set links(values: NavLink[]) {
    this._links = coerceArray(values);
    this.selectedIndex = undefined;
    // Do it in the next cycle to avoid changing the link component after it
    // has been checked
    Promise.resolve().then(() => {
      this._updateViewOverflow();
      this._changeDetectorRef.markForCheck();
    });
  }

  abstract _items: QueryList<NavLinkComponent>;
  abstract _navList: ElementRef<HTMLElement>;

  protected _ngUnsubscribe$ = new Subject<never>();

  /** Used to manage focus between the nav links. */
  protected _keyManager: FocusKeyManager<NavLinkComponent>;

  /** The index of the active tab. */
  get selectedIndex(): number {
    return this._selectedIndex;
  }
  set selectedIndex(value: number | undefined) {
    this._selectedIndex = value;

    if (this._keyManager) {
      if (this._isValidIndex(value)) {
        this._keyManager.setActiveItem(value);
      } else {
        this._keyManager.setActiveItem(0);
      }
    }

    // Always navigate even if it's the same item being selected again
    if (this._selectedIndex !== undefined) {
      this._navigateLink(this._links[this._selectedIndex]);
    }
  }
  private _selectedIndex = undefined;

  /** Tracks which element has focus; used for keyboard navigation. */
  get focusIndex(): number {
    return this._keyManager ? this._keyManager.activeItemIndex : 0;
  }

  /** When the focus index is set, we manually set focus to the correct link. */
  set focusIndex(value: number) {
    if (
      !this._isValidIndex(value) ||
      this.focusIndex === value ||
      !this._keyManager
    ) {
      return;
    }

    this._keyManager.setActiveItem(value);
  }

  constructor(
    protected _elementRef: ElementRef<HTMLElement>,
    protected _changeDetectorRef: ChangeDetectorRef,
    private _rippleState: _NavRippleStateService,
    private _viewportRuler: ViewportRuler,
    @Optional() private _dir: Directionality
  ) {}

  ngAfterViewInit(): void {
    const dirChange = this._dir ? this._dir.change : of(null);
    const resize = this._viewportRuler.change(150);
    const realign = () => {
      this._updateViewOverflow();
    };

    merge(dirChange, resize, this._items.changes)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe(() => {
        // We need to defer this to give the browser some time to recalculate
        // the element dimensions.
        Promise.resolve().then(realign);
        this._keyManager.withHorizontalOrientation(this._getLayoutDirection());
      });

    this._keyManager = new FocusKeyManager<NavLinkComponent>(
      this._items
    ).withHorizontalOrientation(this._getLayoutDirection());
    // .withWrap();

    this._keyManager.skipPredicate((item: NavLinkComponent) => item.overflow);
    this._keyManager.updateActiveItem(0);

    // If there is a change in the focus key manager we need to emit the `indexFocused`
    // event in order to provide a public event that notifies about focus changes. Also we realign
    // the tabs container by scrolling the new focused tab into the visible section.
    this._keyManager.change
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((newFocusIndex) => {
        // TODO: add public event when focus changes
        // this.indexFocused.emit(newFocusIndex);
        this._onNavLinkFocus(newFocusIndex);
      });
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }

  /**
   * Handles keyboard events on the navigation list.
   *
   * @param event The event describing this keyboard interaction.
   * @internal
   */
  _handleKeydown(event: KeyboardEvent): void {
    // We don't handle any key bindings with a modifier key.
    if (hasModifierKey(event)) {
      return;
    }

    switch (event.keyCode) {
      case HOME:
        this._keyManager.setFirstItemActive();
        event.preventDefault();
        break;
      case END:
        this._keyManager.setLastItemActive();
        event.preventDefault();
        break;
      case ENTER:
      case SPACE:
        this.selectedIndex = this.focusIndex;
        // TODO: item selection public event
        // this.selectFocusedIndex.emit(this.focusIndex);
        break;
      default:
        this._keyManager.onKeydown(event);
    }
  }

  /**
   * Called when the user has selected an item via the keyboard or clicked a
   * navigation link.
   *
   * @see selectedIndex
   * @internal
   */
  _navigateLink(link: NavLink): void {
    console.debug(`navigate to: ${link.target}`);
  }

  /**
   * The layout direction of the containing app.
   * @internal
   */
  protected _getLayoutDirection(): Direction {
    return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
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
    return !!item && !item.disabled;
  }

  /**
   * Do things when focus is set on the nav link at the given index.
   *
   * This function is only called with a valid index. It is currently called
   * only when the {@link _keyManager | FocusKeyManager} is responding to key
   * presses within the nav list or when the {@link focusIndex} property has
   * been changed and the index was validated.
   *
   * When this function is called, the item has already been focused, therefore
   * there is no need to focus it here.
   *
   * This function can and should be overloaded if additional behavior needs to
   * be implemented when a navigation link is focused.
   *
   * @param linkIndex Index of the link to be focused.
   * @see focusIndex
   * @internal
   */
  protected abstract _onNavLinkFocus(linkIndex: number): void;

  /**
   * Updates the view according to the overflow management strategy being used.
   * @internal
   */
  protected abstract _updateViewOverflow(): void;
}

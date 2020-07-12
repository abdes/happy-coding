// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-nav-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  Directive,
  ChangeDetectorRef,
  ElementRef,
  NgZone,
  AfterViewInit,
  OnDestroy,
  AfterContentChecked,
  Optional,
} from '@angular/core';

import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  normalizePassiveListenerOptions,
  Platform,
} from '@angular/cdk/platform';

import { fromEvent, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { _NavBarBaseDirective } from '../nav-bar-base.directive';
import { _NavRippleStateService } from '../../nav-ripple-state.service';
import { Directionality } from '@angular/cdk/bidi';

/** Config used to bind passive event listeners */
const passiveEventListenerOptions = normalizePassiveListenerOptions({
  passive: true,
}) as EventListenerOptions;

/**
 * The directions that scrolling can go in when the navigation links exceed the
 * available view width.
 *
 * 'after' will scroll the list towards the end and 'before' will scroll towards
 * the beginning.
 */
export type ScrollDirection = 'after' | 'before';

/**
 * The distance in pixels that will be overshot when scrolling a navigation link
 * into view. This ensures some space is created around the focused link.
 */
const EXAGGERATED_OVERSCROLL = 60;

/**
 * Amount of milliseconds to wait before starting to scroll the navigation list
 * automatically.
 * Set a little conservatively in order to handle fake events dispatched on
 * touch devices.
 */
const HEADER_SCROLL_DELAY = 650;

/**
 * Interval in milliseconds at which to scroll the navigation links while the
 * user is continuously holding the scroll buttons.
 */
const HEADER_SCROLL_INTERVAL = 100;

declare type ScrollingState = {
  maxScrollDistance: number;
  distance: number;
};

@Directive()
export abstract class _NavBarOverflowScrollBaseDirective
  extends _NavBarBaseDirective
  implements AfterViewInit, OnDestroy, AfterContentChecked {
  abstract _rightScroller: ElementRef<HTMLElement>;
  abstract _leftScroller: ElementRef<HTMLElement>;

  /**
   * Indicates whether the arrow to scroll the navigation list in the 'before'
   * direction should be visible.
   */
  _showScrollBefore = true;

  /**
   * Indicates whether the arrow to scroll the navigation list in the 'after'
   * direction should be visible.
   */
  _showScrollAfter = true;

  /**
   * The distance in pixels that the navigation list should be translated
   * along the X-axis.
   *
   * **DO NOT set directly** unless when triggering the transformation of the
   * navigation list such as inside the {@link _scrollTo | _scrollTo function}.
   * @see scrollDistance
   */
  private _scrollDistance = 0;
  /**
   * Whether the scroll distance has changed and should be applied after the
   * view is checked.
   */
  private _scrollDistanceChanged: boolean;

  /**
   * The distance in pixels that the navigation list should be translated
   * along the X-axis.
   */
  private get scrollDistance(): number {
    return this._scrollDistance;
  }
  private set scrollDistance(value: number) {
    this._scrollTo(value);
  }

  /** Stream that will stop the automated scrolling. */
  private _stopScrolling = new Subject<void>();

  /**
   * Constructor.
   *
   * @param elementRef
   * @param changeDetectorRef
   * @param rippleState
   * @param viewportRuler
   * @param dir
   * @param ngZone
   * @param _platform
   */
  constructor(
    elementRef: ElementRef<HTMLElement>,
    changeDetectorRef: ChangeDetectorRef,
    rippleState: _NavRippleStateService,
    viewportRuler: ViewportRuler,
    @Optional() dir: Directionality,
    ngZone: NgZone,
    private _platform: Platform
  ) {
    super(elementRef, changeDetectorRef, rippleState, viewportRuler, dir);

    // Bind the `mouseleave` event on the outside since it doesn't change
    // anything in the view.
    ngZone.runOutsideAngular(() => {
      fromEvent(elementRef.nativeElement, 'mouseleave')
        .pipe(takeUntil(this._ngUnsubscribe$))
        .subscribe(() => {
          this._stopInterval();
        });
    });
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    // We need to handle these events manually, because we want to bind passive
    // event listeners. By marking a touch or wheel listener as passive, the
    // handler is promising it won't call preventDefault to disable scrolling.
    // This frees the browser up to respond to scrolling immediately without
    // waiting for JavaScript, thus ensuring a reliably smooth scrolling
    // experience for the user.

    let target = this._leftScroller.nativeElement;
    fromEvent(target, 'touchstart', passiveEventListenerOptions)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe(() => {
        this._onScrollPress('before');
      });

    target = this._rightScroller.nativeElement;
    fromEvent(target, 'touchstart', passiveEventListenerOptions)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe(() => {
        this._onScrollPress('after');
      });
  }

  ngAfterContentChecked(): void {
    // If the scroll distance has been changed (link selected, focused, scroll
    // controls activated), then translate the header to reflect this.
    if (this._scrollDistanceChanged) {
      this._scrollDistanceChanged = false;
      this._updateScrollPosition();
      this._updateScrollControlsVisibility();
      this._changeDetectorRef.markForCheck();
    }
  }

  ngOnDestroy(): void {
    // Stop any ongoing automatic scrolling.
    this._stopScrolling.complete();

    // Call the base class.
    super.ngOnDestroy();
  }

  /**
   * Updates the view when things (view size, items, focus, etc.) change.
   *
   * @internal
   */
  protected _updateViewOverflow(): void {
    // Adjust position of the nav list if we are resizing the viewport and
    // space is available to the expandable side of the nav list
    const navListContainerWidth = this._elementRef.nativeElement.offsetWidth;
    const navListVisibleWidth =
      this._navList.nativeElement.offsetWidth - this.scrollDistance;
    const scrollAmount = navListContainerWidth - navListVisibleWidth;
    if (scrollAmount > 0) {
      this._scrollTo(this.scrollDistance + scrollAmount);
    }

    this._updateScrollControlsVisibility();
  }

  private _updateScrollControlsVisibility(): void {
    // Check if the pagination arrows should be activated.
    this._showScrollBefore = this.scrollDistance > 0;
    this._showScrollAfter = this.scrollDistance < this._getMaxScrollDistance();
  }

  /**
   * Determines what is the maximum length in pixels that can be set for the
   * scroll distance.
   *
   * This is equal to the difference in width between the navigation list
   * and the list container's view.
   *
   * @internal
   */
  private _getMaxScrollDistance(): number {
    const lengthOfNavList = this._navList.nativeElement.scrollWidth;
    const viewLength = this._elementRef.nativeElement.offsetWidth;
    return lengthOfNavList - viewLength || 0;
  }

  /**
   * Do things when focus is set on the nav link at the given index.
   *
   * This function overloads the base class implementation to automatically
   * scroll the navigation list to bring the focused link into view if it is not
   * already.
   *
   * @param linkIndex Index of the link to be focused.
   * @internal
   */
  _onNavLinkFocus(linkIndex: number): void {
    this._scrollToLink(linkIndex);
  }

  /**
   * Stops the currently-running scroller interval.
   *
   * Call when touch ends on the scroll buttons, when the scrolling completes or
   * when it reaches the maximum distance. Also call to avoid overlapping
   * intervals when triggering a new scrolling operation.
   * @internal
   */
  _stopInterval(): void {
    this._stopScrolling.next();
  }

  /**
   * Handles click events on the scroll arrows.
   * @internal
   */
  _onScrollClick(direction: ScrollDirection): void {
    this._stopInterval();
    this._scroll(direction);
  }

  /**
   * Handles the user pressing down on one of the scroll buttons.
   *
   * This handler reacts to a continuous touch on touch devices or a left mouse
   * button press and hold. It starts continuously scrolling the header after a
   * certain amount of time. The scrolling ends when the press/touch ends or
   * when the mouse leaves the navigation bar area (c.f. the `mouseleave` event
   * handler setup in the {@link constructor}).
   *
   * @param direction In which direction the navigation list should be scrolled.
   * @internal
   */
  _onScrollPress(direction: ScrollDirection, mouseEvent?: MouseEvent): void {
    // Don't start auto scrolling for right mouse button clicks. Note that we shouldn't have to
    // null check the `button`, but we do it so we don't break tests that use fake events.
    if (mouseEvent && mouseEvent.button != null && mouseEvent.button !== 0) {
      return;
    }

    // Avoid overlapping timers.
    this._stopInterval();

    // Start a timer after the delay and keep firing based on the interval.
    timer(HEADER_SCROLL_DELAY, HEADER_SCROLL_INTERVAL)
      // Keep the timer going until something tells it to stop.
      .pipe(takeUntil(this._stopScrolling))
      .subscribe(() => {
        const { maxScrollDistance, distance } = this._scroll(direction);

        // Stop the timer if we've reached the start or the end.
        if (distance === 0 || distance >= maxScrollDistance) {
          this._stopInterval();
        }
      });
  }

  /**
   * Handle focus events for the navigation list to activate the last known
   * focused navigation link in sync with the `FocusKeyManager`.
   *
   * When the link is focused again, the navigation list is also scrolled to
   * bring it into view.
   */
  _onFocus(): void {
    this._scrollToLink(this.focusIndex);
    this._keyManager.setActiveItem(this.focusIndex);
  }

  /**
   * Performs the CSS transformation on the navigation list that will cause it
   * to scroll.
   * @internal
   */
  private _updateScrollPosition(): void {
    const scrollDistance = this.scrollDistance;
    const platform = this._platform;
    const translateX =
      this._getLayoutDirection() === 'ltr' ? -scrollDistance : scrollDistance;

    // We round the `transform` here, because transforms with sub-pixel precision cause some
    // browsers to blur the content of the element.
    this._navList.nativeElement.style.transform = `translateX(${Math.round(
      translateX
    )}px)`;

    // Setting the `transform` on IE will change the scroll offset of the parent, causing the
    // position to be thrown off in some cases. We have to reset it ourselves to ensure that
    // it doesn't get thrown off. Note that we scope it only to IE and Edge, because messing
    // with the scroll position throws off Chrome 71+ in RTL mode (see #14689).
    if (platform && (platform.TRIDENT || platform.EDGE)) {
      this._elementRef.nativeElement.scrollLeft = 0;
    }
  }

  /**
   * Moves the navigation list in the specified direction.
   *
   * The distance to scroll is computed to be a third of the width of the list
   * view.
   *
   * @param direction In which direction to move the navigation list, 'before'
   * or 'after' (towards the beginning of the list or the end of the list,
   * respectively)
   * @internal
   */
  private _scroll(direction: ScrollDirection): ScrollingState {
    // Move the scroll distance one-third the length of the tab list's viewport.
    const viewLength = this._elementRef.nativeElement.offsetWidth;
    const scrollAmount = ((direction == 'before' ? -1 : 1) * viewLength) / 3;
    return this._scrollTo(this._scrollDistance + scrollAmount);
  }

  /**
   * Scroll the navigation list in one or the other direction to make it reach
   * the specified position.
   *
   * @param position Position indicating the {@link scrolldistance} value at
   * which the navigation list should be after it has been moved.
   * @returns Information on the scroll distance and the maximum after the
   * navigation list moves.
   * @internal
   */
  private _scrollTo(position: number): ScrollingState {
    const maxScrollDistance = this._getMaxScrollDistance();
    this._scrollDistance = Math.max(0, Math.min(maxScrollDistance, position));

    // Mark that the scroll distance has changed so that after the view is checked, the CSS
    // transformation can move the header.
    this._scrollDistanceChanged = true;

    return { maxScrollDistance, distance: this._scrollDistance };
  }

  /**
   * Scroll the navigation list to bring the link at the specified index into
   * view.
   *
   * If the link is already visible, no scrolling will be done. In the other
   * hand, if the link is currently outside of the view window, the list is
   * scrolled until the link comes into view. The list is over-scrolled by
   * an mount equal to {@link EXAGGERATED_OVERSCROLL} so that some space is
   * surrounding the link.
   *
   * @param linkIndex Index of the navigation link to bring into view.
   * @see focusIndex
   * @internal
   */
  private _scrollToLink(linkIndex: number): void {
    const selectedLabel = this._items ? this._items.toArray()[linkIndex] : null;
    if (!selectedLabel) {
      return;
    }

    // The view length is the visible width of the navigation list container.
    const viewLength = this._elementRef.nativeElement.offsetWidth;
    const { offsetLeft, offsetWidth } = selectedLabel.elementRef.nativeElement;
    let labelBeforePos: number, labelAfterPos: number;
    if (this._getLayoutDirection() == 'ltr') {
      labelBeforePos = offsetLeft;
      labelAfterPos = labelBeforePos + offsetWidth;
    } else {
      labelAfterPos = this._navList.nativeElement.offsetWidth - offsetLeft;
      labelBeforePos = labelAfterPos - offsetWidth;
    }
    const beforeVisiblePos = this.scrollDistance;
    const afterVisiblePos = this.scrollDistance + viewLength;

    if (labelBeforePos < beforeVisiblePos) {
      // Scroll header to move label to the before direction
      this.scrollDistance -=
        beforeVisiblePos - labelBeforePos + EXAGGERATED_OVERSCROLL;
    } else if (labelAfterPos > afterVisiblePos) {
      // Scroll header to move label to the after direction
      this.scrollDistance +=
        labelAfterPos - afterVisiblePos + EXAGGERATED_OVERSCROLL;
    }
  }
}

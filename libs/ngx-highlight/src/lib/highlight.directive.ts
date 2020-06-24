// Copyright (c) 2019-2020 The Authors.
// This file is part of @npcz/ngx-highlight.
//
// SPDX-License-Identifier: BSD-3-Clause

import * as _ from 'lodash';

import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

type HighlighStyle = 'shadow' | 'outline' | 'background' | 'none';
export type HighlightStyleConfig = {
  hover?: HighlighStyle;
  focus?: HighlighStyle;
  debounceTime?: number;
};

@Directive({
  selector: '[hcHighlight]',
})
export class HighlightDirective implements OnInit, OnChanges, OnDestroy {
  @Input('hcHighlight') highlightStyle: HighlightStyleConfig;

  // Automatic unsubscription when the component is destroyed
  private _ngUnsubscribe$: Subject<boolean> = new Subject();
  private _style: HighlightStyleConfig = {
    hover: 'none',
    focus: 'none',
    debounceTime: 50,
  };

  private _hovered$ = new BehaviorSubject<boolean>(false);
  private _isHovered: boolean;

  private _focused$ = new BehaviorSubject<boolean>(false);
  private _isFocused: boolean;

  constructor(private _renderer: Renderer2, private _el: ElementRef) {}

  ngOnInit(): void {
    this._updateStyleConfig();

    this._hovered$
      .pipe(
        debounceTime(this._style.debounceTime),
        takeUntil(this._ngUnsubscribe$)
      )
      .subscribe((status) => {
        if (this._isHovered != status) {
          this._isHovered = status;
          // Do not apply the hover effect if the element is focused
          if (this._isHovered && !this._isFocused) this._applyEffect('hover');
          else this._removeEffect('hover');
        }
      });

    this._focused$
      .pipe(
        debounceTime(this._style.debounceTime),
        takeUntil(this._ngUnsubscribe$)
      )
      .subscribe((status) => {
        if (this._isFocused != status) {
          this._isFocused = status;
          if (this._isFocused) {
            this._applyEffect('focus');
            // If the element is hovered, then remove the hover effect
            if (this._isHovered) this._removeEffect('hover');
          } else {
            this._removeEffect('focus');
            // If the element is hovered, then apply the hover effect
            if (this._isHovered) this._applyEffect('hover');
          }
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['highlightStyle']) {
      this._updateStyleConfig();
    }
  }

  ngOnDestroy(): void {
    // The emitted value is not important and not to be used, but is here
    // simply because it does not make sense to call next() with no value...
    this._ngUnsubscribe$.next(true);
    // Security measure to avoid memory leaks, as calling complete on
    // the source stream will remove the references to all the subscribed
    // observers, allowing the garbage collector to eventually dispose any
    // non unsubscribed Subscription instance.
    this._ngUnsubscribe$.complete();
  }

  private _updateStyleConfig() {
    if (this.highlightStyle) _.assign(this._style, this.highlightStyle);
    if (this._style.debounceTime < 0) this._style.debounceTime = 0;
  }

  @HostListener('mouseenter') onMouseEnter(): void {
    this._hovered$.next(true);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this._hovered$.next(false);
  }

  @HostListener('focusin') onFocusIn(): void {
    this._focused$.next(true);
  }

  @HostListener('focusout') onFocusOut(): void {
    this._focused$.next(false);
  }

  private _applyEffect(effect: 'hover' | 'focus') {
    switch (this._style[effect]) {
      case 'shadow':
        this._renderer.addClass(this._el.nativeElement, `hc-${effect}-shadow`);
        break;
      case 'outline':
        this._renderer.addClass(this._el.nativeElement, `hc-${effect}-outline`);
        break;
      case 'background':
        this._renderer.addClass(
          this._el.nativeElement,
          `hc-${effect}-background`
        );
        break;
      // Default is 'none'
      default:
    }
  }

  private _removeEffect(effect: 'hover' | 'focus') {
    switch (this._style[effect]) {
      case 'shadow':
        this._renderer.removeClass(
          this._el.nativeElement,
          `hc-${effect}-shadow`
        );
        break;
      case 'outline':
        this._renderer.removeClass(
          this._el.nativeElement,
          `hc-${effect}-outline`
        );
        break;
      case 'background':
        this._renderer.removeClass(
          this._el.nativeElement,
          `hc-${effect}-background`
        );
        break;
      // Default is 'none'
      default:
    }
  }
}

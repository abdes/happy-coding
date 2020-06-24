// Copyright (c) 2019-2020 The Authors.
// This file is part of @npcz/ngx-highlight.
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject, Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export type HighlightStyle = 'shadow' | 'outline' | 'background' | 'none';
export type HighlightStyleConfig = {
  hover?: HighlightStyle;
  focus?: HighlightStyle;
  debounceTime?: number;
};

@Directive({
  selector: '[hcHighlight]',
})
export class HighlightDirective implements OnDestroy {
  get highlightStyle(): HighlightStyleConfig {
    return this._style;
  }
  @Input('hcHighlight') set highlightStyle(value: HighlightStyleConfig) {
    this._updateStyleConfig(value);
  }

  readonly DEFAULT_CONFIG: Readonly<HighlightStyleConfig> = {
    hover: 'none',
    focus: 'none',
    debounceTime: 50,
  };

  // Automatic unsubscription when the component is destroyed
  private _style: HighlightStyleConfig = { ...this.DEFAULT_CONFIG };

  private _hovered$ = new BehaviorSubject<boolean>(false);
  private _isHovered = false;
  private _focused$ = new BehaviorSubject<boolean>(false);
  private _isFocused = false;

  private _subscriptions: { hover: Subscription; focus: Subscription } = {
    hover: undefined,
    focus: undefined,
  };

  constructor(private _renderer: Renderer2, private _el: ElementRef) {}

  ngOnDestroy(): void {
    this._stopFocusSubscription();
    this._startHoverSubscription();
  }

  @HostListener('mouseenter') onMouseEnter(): void {
    this._hovered$?.next(true);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this._hovered$?.next(false);
  }

  @HostListener('focusin') onFocusIn(): void {
    this._focused$?.next(true);
  }

  @HostListener('focusout') onFocusOut(): void {
    this._focused$?.next(false);
  }

  private _updateStyleConfig(value: HighlightStyleConfig) {
    // Merge the provided config with the default config
    value && (this._style = { ...this.DEFAULT_CONFIG, ...value });
    if (this._style.debounceTime < 0) this._style.debounceTime = 0;

    // Start observing if we're not already doing that
    if (this._style.hover != 'none' && !this._subscriptions.hover) {
      this._startHoverSubscription();
    }
    if (this._style.hover == 'none' && this._subscriptions.hover) {
      this._stopHoverSubscription();
    }

    // Start observing if we're not already doing that
    if (this._style.focus != 'none' && !this._subscriptions.focus) {
      this._startFocusSubscription();
    }
    if (this._style.focus == 'none' && this._subscriptions.focus) {
      this._stopFocusSubscription();
    }

    if (this._style.focus != 'none') {
      this._startFocusSubscription();
    }
  }

  private _startHoverSubscription() {
    this._subscriptions.hover = this._hovered$
      .pipe(debounceTime(this._style.debounceTime))
      .subscribe((status) => {
        this._isHovered = status;
        // Do not apply the hover effect if the element is focused
        if (this._isHovered && !this._isFocused) this._applyEffect('hover');
        else this._removeEffect('hover');
      });
    this._hovered$.next(this._isHovered);
  }

  private _stopHoverSubscription() {
    this._subscriptions.hover?.unsubscribe();
    this._subscriptions.hover = undefined;
  }

  private _startFocusSubscription() {
    this._subscriptions.focus = this._focused$
      .pipe(debounceTime(this._style.debounceTime))
      .subscribe((status) => {
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
      });

    this._focused$.next(this._isFocused);
  }

  private _stopFocusSubscription() {
    this._subscriptions.focus?.unsubscribe();
    this._subscriptions.focus = undefined;
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

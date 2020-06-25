// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-highlight
// https://github.com/abdes/happy-coding
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
import { BehaviorSubject, Subscription } from 'rxjs';
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
    this._stopHoverSubscription();
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

  private _updateStyleConfig(value: HighlightStyleConfig) {
    // Always stop the subscriptions on any change to re-evaluate the component
    // highlight classes using the new config when they are restarted again
    this._stopHoverSubscription();
    this._stopFocusSubscription();

    // Adjust debounceTime if it is negative
    let adjustedDebounceTime = this.DEFAULT_CONFIG.debounceTime;
    if (value?.debounceTime) {
      adjustedDebounceTime = value.debounceTime > 0 ? value.debounceTime : 0;
    }

    // Merge the provided config with the default config
    let newStyle: HighlightStyleConfig = {
      ...this.DEFAULT_CONFIG,
    };
    value &&
      (newStyle = {
        ...newStyle,
        ...value,
      });
    newStyle.debounceTime = adjustedDebounceTime;

    // Remove the old effects if the new ones are different,
    // they will be applied again with the new config as appropriate
    if (newStyle.hover != this._style.hover) this._removeEffect('hover');
    if (newStyle.focus != this._style.focus) this._removeEffect('focus');

    // Switch the style config to the new one and restart the subscriptions as
    // appropriate
    this._style = newStyle;

    // Hover
    if (this._style.hover != 'none') {
      this._startHoverSubscription();
    } else {
      // otherwise, just reset the current hover state
      this._isHovered = false;
    }

    // Focus
    if (this._style.focus != 'none') {
      this._startFocusSubscription();
    } else {
      // otherwise, just reset the current focus state
      this._isFocused = false;
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
    const style = this._style[effect];
    console.assert(style != 'none');
    this._renderer.addClass(this._el.nativeElement, `hc-${effect}-${style}`);
  }

  private _removeEffect(effect: 'hover' | 'focus') {
    const style = this._style[effect];
    if (style != 'none') {
      this._renderer.removeClass(
        this._el.nativeElement,
        `hc-${effect}-${style}`
      );
    }
  }
}

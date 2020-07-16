// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-nav-bar
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  ElementRef,
  Input,
  Optional,
  Inject,
  NgZone,
  Component,
  ViewEncapsulation,
  HostBinding,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { FocusMonitor, FocusableOption } from '@angular/cdk/a11y';

import {
  MAT_RIPPLE_GLOBAL_OPTIONS,
  RippleGlobalOptions,
  RippleRenderer,
  CanDisableRippleCtor,
  CanDisableCtor,
  mixinDisableRipple,
  mixinDisabled,
  CanDisable,
  CanDisableRipple,
  RippleTarget,
  RippleConfig,
} from '@angular/material/core';

import { _NavRippleStateService } from '../nav-ripple-state.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;
/** @docs-private */
export interface CanOverflow {
  /** Whether the component is in its parent's overflow. */
  overflow: boolean;
}

/** @docs-private */
export type CanOverflowCtor = Constructor<CanOverflow>;

/** Mixin to augment a directive with a `overflow` property. */
// eslint-disable-next-line @typescript-eslint/ban-types
export function mixinOverflow<T extends Constructor<{}>>(
  base: T
): CanOverflowCtor & T {
  return class extends base {
    private _overflow = false;

    get overflow() {
      return this._overflow;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set overflow(value: any) {
      this._overflow = coerceBooleanProperty(value);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
    }
  };
}

/** @docs-private */
export interface CanActivate {
  /** Whether the component is active. */
  active: boolean;
}

/** @docs-private */
export type CanActivateCtor = Constructor<CanActivate>;

/** Mixin to augment a directive with a `active` property. */
// eslint-disable-next-line @typescript-eslint/ban-types
export function mixinActive<T extends Constructor<{}>>(
  base: T
): CanActivateCtor & T {
  return class extends base {
    private _active = false;

    get active() {
      return this._active;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set active(value: any) {
      this._active = coerceBooleanProperty(value);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
    }
  };
}

// Boilerplate for applying mixins to MatTabLink.
class NavLinkMixinBase {
  constructor(public _elementRef: ElementRef) {}
}
const _NavLinkMixinBase: CanDisableRippleCtor &
  CanDisableCtor &
  CanOverflowCtor &
  CanActivateCtor &
  typeof NavLinkMixinBase = mixinDisableRipple(
  mixinDisabled(mixinOverflow(mixinActive(NavLinkMixinBase)))
);

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'a[hc-nav-link]',
  templateUrl: 'nav-link.component.html',
  styleUrls: ['nav-link.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavLinkComponent extends _NavLinkMixinBase
  implements
    CanDisable,
    CanDisableRipple,
    CanOverflow,
    CanActivate,
    RippleTarget,
    FocusableOption,
    AfterViewInit,
    OnDestroy {
  @Input() disabled: boolean;
  @Input() disableRipple: boolean;
  @Input() overflow: boolean;
  @Input() active: boolean;

  // @HostBinding('attr.tabindex') get tabindex(): number {
  //   return this._link.overflow ? 500 : 0;
  // }
  @HostBinding('class') get classes(): string {
    return [
      'hc-nav-link',
      this.disabled ? 'hc-nav--disabled' : '',
      this.overflow ? 'hc-nav--overflow' : '',
      this.active ? 'hc-nav--active' : '',
    ].join(' ');
  }

  /** Reference to the RippleRenderer for the nav-link. */
  private _navLinkRipple: RippleRenderer;

  rippleConfig: RippleConfig & RippleGlobalOptions;

  /**
   * Whether ripples are disabled on interaction.
   * @docs-private
   */
  get rippleDisabled(): boolean {
    return (
      this.disabled ||
      this.disableRipple ||
      this._parentRippleState?.disabled ||
      !!this.rippleConfig.disabled
    );
  }

  constructor(
    public elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    @Optional() private _parentRippleState: _NavRippleStateService,
    ngZone: NgZone,
    platform: Platform,
    @Optional()
    @Inject(MAT_RIPPLE_GLOBAL_OPTIONS)
    globalRippleOptions: RippleGlobalOptions | null,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode: string
  ) {
    super(elementRef);

    this.rippleConfig = globalRippleOptions || {};
    this.rippleConfig.centered = true;

    if (animationMode === 'NoopAnimations') {
      this.rippleConfig.animation = { enterDuration: 0, exitDuration: 0 };
    }

    this._navLinkRipple = new RippleRenderer(
      this,
      ngZone,
      elementRef,
      platform
    );
    this._navLinkRipple.setupTriggerEvents(elementRef.nativeElement);
  }

  get offsetLeft(): number {
    return this.elementRef.nativeElement.offsetLeft;
  }

  get offsetWidth(): number {
    return this.elementRef.nativeElement.offsetWidth;
  }

  focus(): void {
    this.elementRef.nativeElement.focus({ preventScroll: true });
  }

  ngAfterViewInit(): void {
    this._focusMonitor.monitor(this.elementRef);
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this.elementRef);
    this._navLinkRipple._removeTriggerEvents();
  }
}

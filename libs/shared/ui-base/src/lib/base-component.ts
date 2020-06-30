// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { OnDestroy } from '@angular/core';

// libs
import { Subject } from 'rxjs';

/**
 * Helper class to be used as the base for all components.
 *
 * This base component implementation enforces the following best practices
 * for the implementation of angular components:
 *
 * - Provide a subject {@linkcode BaseComponent.ngUnsubscribe$ | ngUnsubscribe$}
 *   for automatic unsubscription when the component is destroyed.
 *
 * - Provide a subject {@linkcode BaseComponent.destroy$ | destroy$} to run
 *   cleanup code when the component is destroyed.
 */
export abstract class BaseComponent implements OnDestroy {
  private _destroy$: Subject<boolean>;
  private _ngUnsubscribe$: Subject<boolean>;

  /**
   * This subject can be used to put cleanup code that runs when the
   * component is destroyed. It avoid the need to implement ngOnDestroy()  in
   * the component and allows to keep cleanup code as close to where the
   * resources are being created or initialized for use.
   *
   * ```typescript
   * // Allocate some resources or resource utilizing tasks that require
   * // cleanup on destruction
   *
   * // then register a hook to clean them up on component destruction
   * destroy$.subscribe(() => {
   *   // Do the cleanup
   * });
   * ```
   */
  protected get destroy$(): Subject<boolean> {
    if (!this._destroy$) {
      // Perf optimization:
      // since this is likely used as base component everywhere
      // only construct a Subject instance if actually used
      this._destroy$ = new Subject();
    }
    return this._destroy$;
  }

  /**
   * The best practice way of unsubscribing from Observable.subscribe() calls
   * is to use `takeUntil()` in the pipe before your “subscribe” and it is
   * implemented in this base component.
   *
   * So if a component that uses a `subscribe()` call lasting for its entire
   * lifetime of, it simply needs to extend from this base component and do
   * something like the following:
   *
   * ```typescript
   * this._store$
   *   .select(fromLayoutStore.selectIsDarkTheme)
   *   .pipe(
   *     map(value => {
   *       this.isDarkTheme = value;
   *     }),
   *     takeUntil(this.ngUnsubscribe$)
   *   )
   *   .subscribe();
   * ```
   * **NOTE:** If you have many pipe operators, make sure that takeUntil is the
   * last one.
   */
  protected get ngUnsubscribe$(): Subject<boolean> {
    if (!this._ngUnsubscribe$) {
      // Perf optimization:
      // since this is likely used as base component everywhere
      // only construct a Subject instance if actually used
      this._ngUnsubscribe$ = new Subject();
    }
    return this._ngUnsubscribe$;
  }

  /**
   * Implements the angular OnDestroy lifecycle hook to emit values on the
   * rxjs Observables subscriptions subject and the cleanup subject and
   * completes both of them.
   */
  ngOnDestroy(): void {
    if (this._ngUnsubscribe$) {
      // The emitted value is not important and not to be used, but is here
      // simply because it does not make sense to call next() with no value...
      this.ngUnsubscribe$.next(true);
      // Security measure in order avoid memory leaks, as calling complete on
      // the source stream will remove the references to all the subscribed
      // observers, allowing the garbage collector to eventually dispose any
      // non unsubscribed Subscription instance.
      this.ngUnsubscribe$.complete();
    }
    if (this._destroy$) {
      this._destroy$.next(true);
      this._destroy$.complete();
    }
  }
}

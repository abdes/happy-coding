// Copyright (c) 2019-2020 The Authors.
// This file is part of TagLand Maestro.
//
// SPDX-License-Identifier: BSD-3-Clause

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'hcpg-playground-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styles: [],
})
export class ThemeSwitcherComponent implements OnInit, OnDestroy {
  private _darkThemeEnabledSubject = new BehaviorSubject<boolean>(false);
  private _darkThemeEnabled = this._darkThemeEnabledSubject.asObservable();

  themeSwitcherLabel: string;
  themeSwitcherValue: boolean;

  private ngUnsubscribe$ = new Subject();

  public constructor(
    private _cd: ChangeDetectorRef,
    private _overlayContainer: OverlayContainer
  ) {}

  ngOnInit(): void {
    // Initialize the app theme
    this._darkThemeEnabled
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => {
        // Update label
        this.themeSwitcherValue = value;
        this.themeSwitcherLabel = value ? 'Make it light' : 'Make it dark';
        this._overlayContainer
          .getContainerElement()
          .classList.toggle('dark-theme', value);
        // Update document body
        document.querySelector('body').classList.toggle('dark-theme', value);
        // trigger change detection (detector injected in constructor)
        this._cd.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  onThemeToggleClick(): void {
    this._darkThemeEnabledSubject.next(!this.themeSwitcherValue);
  }
}

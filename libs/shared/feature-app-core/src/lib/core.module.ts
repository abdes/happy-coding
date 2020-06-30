// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
  Provider,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { RouterStoreModule } from '@workspace/data-router-store';

import { throwIfAlreadyLoaded } from '@workspace/util-angular';

import { CORE_PROVIDERS } from './services';

@NgModule({
  imports: [
    // The root application module, AppModule, of almost every browser
    // application should import BrowserModule from @angular/platform-browser.
    // https://angular.io/guide/ngmodule-faq#should-i-import-browsermodule-or-commonmodule
    BrowserModule,
    BrowserAnimationsModule,

    // Initialize the ngrx root store
    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
        },
      }
    ),
    EffectsModule.forRoot([]),

    // The router store module is used in every app developed on this framework
    RouterStoreModule,
  ],
})
export class CoreModule {
  static forRoot(
    configuredProviders: Array<Provider>
  ): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...CORE_PROVIDERS, ...configuredProviders],
    };
  }

  constructor(
    // This module should only be loaded one time in the AppModule
    @Optional() @SkipSelf() private _parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(_parentModule, 'CoreModule');
  }
}

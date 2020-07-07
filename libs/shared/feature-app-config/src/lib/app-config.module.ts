// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_INITIALIZER } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppConfigService } from './services/app-config.service';
import { throwIfAlreadyLoaded } from '@workspace/util-angular';
import {
  loadConfig,
  AppConfigLoaderOptions,
  APP_CONFIG_LOADER_OPTIONS_TOKEN,
} from './app-config-loader';

/**
 * Loads application configuration data and provides it through the
 * AppConfigService.
 *
 * This module can only be loaded once from the AppModule. It provides an
 * `APP_INITIALIZER` factory that loads configuration data and makes it
 * available through the AppConfigService. The location of the config data and
 * other options (`ConfigLoaderOptions`) can be specified when calling this
 * module's `forRoot()` static function.
 */
@NgModule({
  imports: [CommonModule, HttpClientModule],
})
export class AppConfigModule {
  static forRoot(
    options?: AppConfigLoaderOptions
  ): ModuleWithProviders<AppConfigModule> {
    return {
      ngModule: AppConfigModule,
      providers: [
        // In AOT compilation mode, angular does not allow function calls in
        // decorators. In order to pass the optional OPTIONS argument into the
        // config loader factory, we provide it as an injectable so that we
        // can inject it into it.
        {
          provide: APP_CONFIG_LOADER_OPTIONS_TOKEN,
          useValue: options,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: loadConfig,
          deps: [HttpClient, AppConfigService, APP_CONFIG_LOADER_OPTIONS_TOKEN],
          multi: true,
        },

        // NOTE: We don't have to explicitly provide the AppConfigService here
        // since it will automatically be picked-up using the "providedIn"
        // Injectable() meta-data.
      ],
    };
  }

  constructor(
    // This module should only be loaded one time in the AppModule
    @Optional() @SkipSelf() private _parentModule: AppConfigModule
  ) {
    throwIfAlreadyLoaded(_parentModule, 'AppConfigModule');
  }
}

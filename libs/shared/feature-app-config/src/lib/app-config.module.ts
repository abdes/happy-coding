// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import * as _ from 'lodash';

import {
  NgModule,
  ModuleWithProviders,
  InjectionToken,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_INITIALIZER } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppConfigService } from './services/app-config.service';
import { map, catchError, take } from 'rxjs/operators';
import { of, ObservableInput } from 'rxjs';
import { throwIfAlreadyLoaded } from '@workspace/util-angular';

// Injection token that makes the options available to the config loader
// factory function.
// --
// NOTE: This value has to be exported otherwise the AoT compiler won't see it.
export const APP_CONFIG_LOADER_OPTIONS_TOKEN = new InjectionToken<
  ConfigLoaderOptions
>('AppConfigModule forRoot() options');

/**
 * Options to help the config loader factory function locate app config data.
 */
export interface ConfigLoaderOptions {
  path?: string;
}

const DEFAULT_CONFIG_LOADER_OPTIONS: ConfigLoaderOptions = {
  path: '/assets/data/app-config.json',
};

/**
 * Configuration data loader.
 *
 * Function that returns a function that returns a Promise<boolean>. The
 * promise function loads the configuration information and stores it in
 * the config service for use by the application.
 *
 * Once your configuration has been loaded, resolve the promise using
 * resolve(true) to make angular wait for this to finish loading before
 * moving on.
 */
function loadConfig(
  http: HttpClient,
  configService: AppConfigService,
  options: ConfigLoaderOptions
): () => Promise<boolean> {
  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      // Apply default options
      if (!options) options = {};
      const defaults = _.partialRight(_.assign, function (a, b) {
        return typeof a == 'undefined' ? b : a;
      });
      defaults(options, DEFAULT_CONFIG_LOADER_OPTIONS);

      // Fetch the config data
      http
        .get('/assets/data/app-config.json')
        .pipe(
          map((data) => {
            configService.config = data;
            resolve(true);
          }),
          take(1),
          catchError(
            (err: {
              status: number;
            }): ObservableInput<Record<string, unknown>> => {
              if (err.status !== 404) {
                resolve(false);
              }
              // TODO: set any generic defaults here
              configService.config = {};
              resolve(true);
              return of({});
            }
          )
        )
        .subscribe();
    });
  };
}

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
    options?: ConfigLoaderOptions
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
          deps: [HttpClient, AppConfigService],
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

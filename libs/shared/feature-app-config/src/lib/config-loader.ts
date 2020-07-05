// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import * as _ from 'lodash';

import { InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './services/app-config.service';
import { map, catchError, take } from 'rxjs/operators';
import { of, ObservableInput } from 'rxjs';

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
export function loadConfig(
  http: HttpClient,
  configService: AppConfigService,
  options: ConfigLoaderOptions
): () => Promise<boolean> {
  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      // Apply default options
      if (!options) options = {};
      _.defaults(options, DEFAULT_CONFIG_LOADER_OPTIONS);

      // Fetch the config data
      http
        .get(options.path)
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
              } else {
                // TODO: set any generic defaults here
                configService.config = {};
                resolve(true);
              }
              return of({});
            }
          )
        )
        .subscribe();
    });
  };
}

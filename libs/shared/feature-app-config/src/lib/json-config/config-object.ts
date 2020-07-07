// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import * as _ from 'lodash';
import { JsonPointer } from 'json-ptr';

import { ConfigOptions, DEFAULT_OPTIONS } from './config-options';
import { ConfigLoader } from './config-loader.interface';
import { ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ConfigStatus } from './config-status';

export class ConfigObject {
  private _loader: ConfigLoader;
  private _continueOnError: boolean;

  private _externals = new Map<string, ConfigObject>();
  private _path: string;
  private _loadingCompleteSubject = new ReplaySubject<boolean>();
  private _loadingComplete = this._loadingCompleteSubject.asObservable();
  private _data: Record<string, unknown>;

  static isReference(value: unknown): boolean {
    return (
      value &&
      typeof value === 'object' &&
      '$ref' in value &&
      typeof value['$ref'] === 'string'
    );
  }

  static resolve(target: ConfigObject, pointer: string): unknown {
    const result = JsonPointer.get(target._data, pointer);
    return ConfigObject.isReference(result)
      ? target._resolveReference(result as { $ref: string })
      : result;
  }

  constructor(options: ConfigOptions, path: string) {
    _.defaults(options, DEFAULT_OPTIONS);
    this._loader = options.loader;
    this._continueOnError = options.continueOnError;

    this._path = path;
  }

  async load(allExternals: Map<string, ConfigObject>): Promise<ConfigStatus> {
    // Bootstrap the loading process by loading the initial configuration
    // object and then recursively loading externals
    return this._loadData()
      .then(() => {
        // Not being able to load the initial config data is a fatal error
        if (!this._data)
          throw new Error(
            `Failed to load initial configuration data from "${this._path}"`
          );
      })
      .then(() => this._loadExternals([], allExternals))
      .then((status) => {
        const flattened: string[] = [].concat(...status);
        // split warnings from errors
        const warnings: string[] = [];
        const errors: string[] = [];
        for (const item of flattened) {
          if (item.startsWith('WARN: ')) warnings.push(item.substr(6));
          if (item.startsWith('ERR: ')) errors.push(item.substr(5));
        }
        const success = errors.length === 0;
        return { success, errors, warnings };
      })
      .catch((error: Error) => {
        return { success: false, errors: [error.message], warnings: [] };
      });
  }

  get(pointer: string): unknown {
    return ConfigObject.resolve(this, pointer);
  }

  has(pointer: string): boolean {
    return JsonPointer.has(this._data, pointer);
  }

  private _resolveReference(ref: { $ref: string }): unknown {
    // Split the reference around the '#' if any
    const [targetName, pointer] = ref.$ref.split('#', 2);
    if (targetName == '') {
      return ConfigObject.resolve(this, pointer);
    } else {
      const target = this._externals.get(targetName);
      return target ? ConfigObject.resolve(target, pointer) : null;
    }
  }

  private async _loadExternals(
    parents: string[],
    allExternals: Map<string, ConfigObject>
  ): Promise<string[]> {
    if (!this._data.$externals) {
      // we have no references -> bailout quickly
      return [];
    }

    if (!Array.isArray(this._data.$externals)) {
      throw new Error(
        'Invalid external attribute in json config ($externals must be an array).'
      );
    }

    parents.push(this._path);

    const promises = [];
    for (const external of this._data.$externals) {
      // Check circular refs
      if (parents.indexOf(external.path) !== -1) {
        // found circular ref
        promises.push(
          `WARN: found circular dependency from ${this._path} to ${external.path}`
        );
        // The config must have been loaded already
        // Just add it to this object's refs table for resolution of pointers
        // if needed later
        this._externals.set(external.name, allExternals.get(external.path));
        continue;
      }

      // Check if already loaded
      let extConfig = allExternals.get(external.path);
      if (!extConfig) {
        extConfig = new ConfigObject(
          { continueOnError: this._continueOnError, loader: this._loader },
          external.path
        );
        allExternals.set(external.path, extConfig);

        promises.push(
          extConfig._loadData().then(() => {
            if (extConfig._data) {
              extConfig._loadingCompleteSubject.next(true);
              return extConfig
                ._loadExternals(parents, allExternals)
                .then((status) => [].concat(...status));
            } else if (extConfig._continueOnError) {
              // Not a fatal error, but we will record it in the promise result
              return [
                `ERR: Failed to load external config "${extConfig._path}" requested by "${this._path}"`,
              ];
            } else {
              // Fatal
              throw new Error(
                `Failed to load external config "${extConfig._path}" requested by "${this._path}"`
              );
            }
          })
        );
      } else if (!extConfig._data) {
        // This is either an external being loaded or an external that failed
        // to load. We will know that by checking the loadingComplete observable
        //(with a replay subject), which will tell us exactly when or if the
        // config is loaded.
        promises.push(
          extConfig._loadingComplete
            .pipe(
              map(() =>
                // When loading is complete, we check if the config data is valid
                // and if not, we report this error specifically for this
                // dependent config
                extConfig._data
                  ? []
                  : [
                      `ERR: Failed to load external config "${extConfig._path}" requested by "${this._path}"`,
                    ]
              ),
              take(1)
            )
            .toPromise()
        );
      }
      this._externals.set(external.name, extConfig);
    }
    return Promise.all(promises);
  }

  private async _loadData(): Promise<void> {
    return this._loader.read(this._path).then((data) => {
      this._data = data;
      this._loadingCompleteSubject.next(true);
    });
  }
}

// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import * as _ from 'lodash';
import { JsonPointer } from 'json-ptr';

import { Options, DEFAULT_OPTIONS } from './options';
import { ConfigLoader } from './config-loader.interface';

export class ConfigObject {
  private _loader: ConfigLoader;
  private _continueOnError: boolean;

  private _externals = new Map<string, ConfigObject>();
  private _path: string;
  private _rawData: Record<string, unknown>;

  static isReference(value: unknown): boolean {
    return (
      value &&
      typeof value === 'object' &&
      '$ref' in value &&
      typeof value['$ref'] === 'string'
    );
  }

  static resolve(target: ConfigObject, pointer: string): unknown {
    const result = JsonPointer.get(target._rawData, pointer);
    return ConfigObject.isReference(result)
      ? target._resolveReference(result as { $ref: string })
      : result;
  }

  constructor(options: Options, path: string) {
    _.defaults(options, DEFAULT_OPTIONS);
    this._loader = options.loader;
    this._continueOnError = options.continueOnError;

    this._path = path;
  }

  async load(allExternals: Map<string, ConfigObject>): Promise<boolean> {
    this._rawData = await this._loadData();
    await this._loadExternals([], allExternals);
    return Promise.resolve(true);
  }

  get(pointer: string): unknown {
    return ConfigObject.resolve(this, pointer);
  }

  has(pointer: string): boolean {
    return JsonPointer.has(this._rawData, pointer);
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

  private _loadExternals(
    parents: string[],
    allExternals: Map<string, ConfigObject>
  ): Promise<boolean> | Promise<boolean[]> {
    if (this._rawData.$externals == null) {
      // we have no references -> bailout quickly
      return Promise.resolve(true);
    }

    if (!Array.isArray(this._rawData.$externals)) {
      throw new Error('Invalid imports attribute in raw json');
    }

    parents.push(this._path);

    const promises = [];
    for (const external of this._rawData.$externals) {
      // Check circular refs
      if (parents.indexOf(external.path) !== -1) {
        // found circular ref
        console.warn(
          `found circular dependency from ${this._path} to ${external.path}`
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
          extConfig._loadData().then((rawData) => {
            if (rawData || this._continueOnError) {
              extConfig._rawData = rawData;
              extConfig._loadExternals(parents, allExternals);
            } else
              throw new Error(
                `Error while loading reference: ${extConfig._path}`
              );
          })
        );
      }

      this._externals.set(external.name, extConfig);
    }
    return Promise.all(promises);
  }

  private async _loadData(): Promise<Record<string, unknown>> {
    return this._loader.read(this._path);
  }
}

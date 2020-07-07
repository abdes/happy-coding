// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { ConfigOptions } from './config-options';
import { ConfigObject } from './config-object';
import { ConfigStatus } from './config-status';

export class ConfigParser {
  private _root: ConfigObject;
  private _externals: Map<string, ConfigObject>;

  constructor(options: ConfigOptions, path: string) {
    this._root = new ConfigObject(options, path);
  }

  async load(): Promise<ConfigStatus> {
    this._externals = new Map<string, ConfigObject>();
    this._externals.set(this._root.path, this._root);
    return this._root.load(this._externals);
  }

  get(pointer: string): unknown {
    return this._root.get(pointer);
  }

  has(pointer: string): boolean {
    return this._root.has(pointer);
  }
}

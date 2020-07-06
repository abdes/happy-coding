// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Options } from './options';
import { ConfigObject } from './config-object';

export class ConfigParser {
  private _root: ConfigObject;
  private _externals = new Map<string, ConfigObject>();

  constructor(options: Options, path: string) {
    this._root = new ConfigObject(options, path);
    this._externals.set(path, this._root);
  }

  async load(): Promise<boolean> {
    return this._root.load(this._externals);
  }

  get(pointer: string): unknown {
    return this._root.get(pointer);
  }

  has(pointer: string): boolean {
    return this._root.has(pointer);
  }
}

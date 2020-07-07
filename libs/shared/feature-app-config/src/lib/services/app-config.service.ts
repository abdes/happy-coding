// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Injectable } from '@angular/core';
import { ConfigParser } from '../json-config';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  config: ConfigParser;

  get<T>(pointer: string): T {
    return this.config.get(pointer) as T;
  }

  has(pointer: string): boolean {
    return this.config.has(pointer);
  }
}

// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { ConfigLoader } from './config-loader.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class AngularHttpConfigLoader implements ConfigLoader {
  private _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  async read(path: string): Promise<Record<string, unknown>> {
    return (this._http.get(path) as Observable<
      Record<string, unknown>
    >).toPromise();
  }
}

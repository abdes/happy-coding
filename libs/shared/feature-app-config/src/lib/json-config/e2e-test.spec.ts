// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { ConfigLoader } from './config-loader.interface';
import { ConfigParser } from './config-parser';

class MockLoader implements ConfigLoader {
  data = new Map<string, Record<string, unknown>>([
    [
      '/main.json',
      {
        $externals: [
          {
            name: '1',
            path: '/1.json',
          },
          {
            name: '2',
            path: '/2.json',
          },
        ],
        config: {
          simple: 'main-simple',
          localRef: { $ref: '#/config/simple' },
          externalRef: { $ref: '1#/config/simple' },
          externalRefToRef: { $ref: '1#/config/localRef' },
          externalRefToExternalRef: { $ref: '1#/config/externalRef' },
        },
      },
    ],
    [
      '/1.json',
      {
        $externals: [
          {
            name: '1',
            path: '/3.json',
          },
        ],
        config: {
          simple: '1-simple',
          localRef: { $ref: '#/config/simple' },
          externalRef: { $ref: '1#/config/simple' },
        },
      },
    ],
    [
      '/2.json',
      {
        $externals: [
          {
            name: '1',
            path: '/3.json',
          },
          {
            name: '2',
            path: '/__does-not-exist__.json',
          },
        ],
      },
    ],
    [
      '/3.json',
      {
        $externals: [
          {
            name: '4',
            path: '/4.json',
          },
        ],
        config: {
          simple: '3-simple',
        },
      },
    ],
    [
      '/4.json',
      {
        $externals: [
          {
            name: '1',
            path: '/1.json',
          },
          {
            name: '2',
            path: '/__does-not-exist__.json',
          },
        ],
      },
    ],
  ]);
  read(path: string): Promise<Record<string, unknown>> {
    return Promise.resolve(this.data.get(path));
  }
}

describe('Config parser e2e test', () => {
  const loader = new MockLoader();

  it('should resolve externals and reports errors/warnings', async () => {
    const parser = new ConfigParser(
      { loader: loader, continueOnError: true },
      '/main.json'
    );
    const result = await parser.load();
    expect(result.success).toBeFalsy();
    expect(result.errors.length).toEqual(2);
    expect(result.warnings.length).toEqual(1);

    expect(parser.get('/config/simple')).toEqual('main-simple');
    expect(parser.get('#/config/simple')).toEqual('main-simple');
    expect(parser.get('/config/localRef')).toEqual('main-simple');
    expect(parser.get('/config/externalRef')).toEqual('1-simple');
    expect(parser.get('/config/externalRefToExternalRef')).toEqual('3-simple');
  });
});

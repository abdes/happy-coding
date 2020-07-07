// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

jest.mock('./app-config-loader');
const configLoader = require('./app-config-loader');

import { TestBed, fakeAsync } from '@angular/core/testing';

import { AppConfigModule } from './app-config.module';
import { APP_CONFIG_LOADER_OPTIONS_TOKEN } from './app-config-loader';
import { ApplicationInitStatus } from '@angular/core';

describe('AppConfigModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppConfigModule],
    });
  });

  it('should not provide APP_CONFIG_LOADER_OPTIONS_TOKEN', () => {
    expect(() => TestBed.inject(APP_CONFIG_LOADER_OPTIONS_TOKEN)).toThrowError(
      /No provider for/
    );
  });
});

describe('AppConfigModule.forRoot()', () => {
  beforeEach(() => {
    configLoader.loadConfig.mockImplementation(() => () =>
      Promise.resolve(true)
    );

    TestBed.configureTestingModule({
      imports: [AppConfigModule.forRoot({ path: '__path__' })],
    });
  });

  it('should provide APP_CONFIG_LOADER_OPTIONS_TOKEN using passed options', () => {
    const options = TestBed.inject(APP_CONFIG_LOADER_OPTIONS_TOKEN);
    expect(options.path).toEqual('__path__');
  });

  it('should provide an APP_INITIALIZER for angular', fakeAsync(() => {
    // until https://github.com/angular/angular/issues/24218 is fixed
    TestBed.inject(ApplicationInitStatus);

    expect(configLoader.loadConfig).toHaveBeenCalled();
  }));
});

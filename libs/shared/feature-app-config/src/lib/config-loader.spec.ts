// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { TestBed, inject } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './services';
import { loadConfig } from './app-config-loader';

describe('config-loader loadConfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
  });

  afterEach(inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      httpMock.verify();
    }
  ));

  it('should fetch config from path in options', inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      // We call the service
      const http = TestBed.inject(HttpClient);
      const configService = TestBed.inject(AppConfigService);

      loadConfig(http, configService, { path: '/config/data.json' })().then(
        (result) => {
          expect(result).toBeTruthy();
          expect(configService.config).toBeTruthy();
          expect(configService.get('/item')).toEqual('value');
        }
      );

      // We set the expectations for the HttpClient mock
      const req = httpMock.expectOne('/config/data.json');
      expect(req.request.method).toEqual('GET');
      // Then we set the fake data to be returned by the mock
      req.flush({ item: 'value' });
    }
  ));

  it('should resolve to false if any error occurs', inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      // We call the service
      const http = TestBed.inject(HttpClient);
      const configService = TestBed.inject(AppConfigService);

      loadConfig(http, configService, null)().then((result) => {
        expect(result).toBeFalsy();
        expect(configService.config).toBeDefined();
      });

      // We set the expectations for the HttpClient mock
      const req = httpMock.expectOne('/assets/data/app-config.json');
      expect(req.request.method).toEqual('GET');
      // Then we set the fake data to be returned by the mock
      req.error(new ErrorEvent('Invalid request parameters'));
    }
  ));
});

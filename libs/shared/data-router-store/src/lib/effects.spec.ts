// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';

import { RouterStoreEffects } from './effects';
import { provideMockStore } from '@ngrx/store/testing';
import { Title } from '@angular/platform-browser';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { RouterTestingModule } from '@angular/router/testing';

describe('NgRx Router Store: unit tests', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: Observable<any>;
  let effects: RouterStoreEffects;

  describe('module', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([])],
        providers: [
          RouterStoreEffects,
          provideMockActions(() => actions$),
          provideMockStore(),
        ],
      });

      effects = TestBed.inject<RouterStoreEffects>(RouterStoreEffects);
    });

    it('should be created', () => {
      expect(effects).toBeTruthy();
    });
  });

  describe('updateTitleEffect$', () => {
    const mockTitleService = {
      setTitle: jest.fn(),
    };
    const titleServiceSpy = jest.spyOn(mockTitleService, 'setTitle');

    const payload = {
      routerState: {
        data: {
          title: jest.fn(() => 'title'),
        },
      },
    };
    const routerPathSpy = jest.spyOn(payload.routerState.data, 'title');

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([])],
        providers: [
          RouterStoreEffects,
          {
            provide: Title,
            useValue: mockTitleService,
          },
          provideMockActions(() => actions$),
          provideMockStore(),
        ],
      });

      effects = TestBed.inject<RouterStoreEffects>(RouterStoreEffects);
      actions$ = of({
        type: ROUTER_NAVIGATED,
        payload: payload,
      });
    });

    it('should provide applicationName to the title function', () => {
      effects.updateTitleEffect$.subscribe();

      expect(routerPathSpy).toBeCalledWith(
        expect.objectContaining({ applicationName: expect.any(String) })
      );
    });

    it('should dynamically update title on ROUTER_NAVIGATED', () => {
      effects.updateTitleEffect$.subscribe();

      expect(titleServiceSpy).toBeCalledWith('title');
    });
  });
});

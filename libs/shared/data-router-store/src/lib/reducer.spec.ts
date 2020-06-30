// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import * as fromRouterStore from './reducer';
import { MergedRoute } from './reducer';
import { Params, RouterStateSnapshot } from '@angular/router';
import { routerReducer } from '@ngrx/router-store';
import { Action } from '@ngrx/store';

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

interface MockActiveStateSnapshot {
  params?: Params;
  queryParams?: Params;
  data?: Params;
  readonly firstChild: MockActiveStateSnapshot | null;
}

interface MockRouterStateSnapshot {
  url: string;
  root: MockActiveStateSnapshot;
}

function mockChildren(object: unknown, finder) {
  Object.defineProperty(object, 'children', {
    value: [],
    enumerable: true,
  });
  Object.defineProperty(object['children'], 'find', {
    value: finder,
  });
}

function findPrimary(): MockActiveStateSnapshot {
  const primary = {
    params: {
      primary1: 'val1',
      primary2: 'val2',
    },
    firstChild: null,
  };
  mockChildren(primary, findNoPrimary);
  return primary;
}

function findNoPrimary(): MockActiveStateSnapshot {
  return null;
}

describe('NgRx Router Store Custom Serializer: unit tests', () => {
  let serializer: fromRouterStore.MergedRouterStateSerializer;

  beforeEach(() => {
    serializer = new fromRouterStore.MergedRouterStateSerializer();
  });

  describe('serialize', () => {
    it('should return only URL', () => {
      // Set up the testing data
      const expected: MergedRoute = {
        url: 'this-is-url',
        queryParams: {},
        params: {},
        data: {},
      };
      const input: MockRouterStateSnapshot = {
        url: 'this-is-url',
        root: {
          queryParams: {},
          firstChild: {
            firstChild: null,
            params: {},
          },
        },
      };

      mockChildren(input.root, findNoPrimary);
      mockChildren(input.root.firstChild, findNoPrimary);

      // Run the test logic
      expect(serializer.serialize(input as RouterStateSnapshot)).toEqual(
        expected
      );
    });

    it('should return route, query params and data', () => {
      // Set up the testing data
      const expected: MergedRoute = {
        url: 'this-is-url',
        queryParams: {
          param1: 'val1',
          param2: 'val2',
        },
        params: {
          param1: 'val1',
          param2: 'val2',
        },
        data: {
          param1: 'val1',
        },
      };
      const input: MockRouterStateSnapshot = {
        url: 'this-is-url',
        root: {
          queryParams: {
            param1: 'val1',
            param2: 'val2',
          },
          firstChild: {
            firstChild: {
              data: {
                param1: 'val1',
              },
              firstChild: {
                firstChild: null,
                params: {
                  param1: 'val1',
                  param2: 'val2',
                },
              },
            },
          },
        },
      };
      mockChildren(input.root, findNoPrimary);
      mockChildren(input.root.firstChild, findNoPrimary);
      mockChildren(input.root.firstChild.firstChild, findNoPrimary);
      mockChildren(input.root.firstChild.firstChild.firstChild, findNoPrimary);

      // Run the test logic
      expect(serializer.serialize(input as RouterStateSnapshot)).toEqual(
        expected
      );
    });

    it('should use primary outlet if found in children', () => {
      // Set up the testing data
      const expected: MergedRoute = {
        url: 'this-is-url',
        queryParams: {
          param1: 'val1',
          param2: 'val2',
        },
        params: {
          primary1: 'val1',
          primary2: 'val2',
        },
        data: {
          param1: 'val1',
        },
      };
      const input: MockRouterStateSnapshot = {
        url: 'this-is-url',
        root: {
          queryParams: {
            param1: 'val1',
            param2: 'val2',
          },
          firstChild: {
            firstChild: {
              data: {
                param1: 'val1',
              },
              firstChild: null,
            },
          },
        },
      };
      mockChildren(input.root, findNoPrimary);
      mockChildren(input.root.firstChild, findNoPrimary);
      mockChildren(input.root.firstChild.firstChild, findPrimary);

      // Run the test logic
      expect(serializer.serialize(input as RouterStateSnapshot)).toEqual(
        expected
      );
    });
  });
});

describe('NgRx Router Store Reducer Actions: unit tests', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'NOOP' } as Action;
      const initialState = { state: { url: '' }, navigationId: 0 };
      const result = routerReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});

// -----------------------------------------------------------------------------
// Selectors
// -----------------------------------------------------------------------------

describe('NgRx Router Store Reducer Selectors: unit tests', () => {
  let state;

  beforeEach(() => {
    state = {
      [fromRouterStore.ROUTER_STORE_FEATURE_KEY]: {
        sate: {
          url: '',
          params: {
            p: 'value',
          },
          queryParams: {
            q: 'value',
          },
          data: {
            d: 'value',
          },
        },
        navigationId: 1,
      },
    };
  });

  describe('selectRouterState', () => {
    it('should select the feature state', () => {
      const result = fromRouterStore.selectRouterState(state);
      expect(result).toEqual(state[fromRouterStore.ROUTER_STORE_FEATURE_KEY]);
    });
  });

  describe('getMergedRoute', () => {
    it('should select the mergedRoute', () => {
      const result = fromRouterStore.getMergedRoute(state);
      expect(result).toEqual(
        state[fromRouterStore.ROUTER_STORE_FEATURE_KEY].state
      );
    });
  });
});

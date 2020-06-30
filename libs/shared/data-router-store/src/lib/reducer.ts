// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  ActivatedRouteSnapshot,
  Data,
  Params,
  RouterStateSnapshot,
} from '@angular/router';
import { RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Injectable } from '@angular/core';

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

export const ROUTER_STORE_FEATURE_KEY = 'router';

export type MergedRoute = Readonly<{
  url: string;
  params?: Params;
  queryParams?: Params;
  data?: Data;
}>;

export type State = Readonly<RouterReducerState<MergedRoute>>;

/*
 During each navigation cycle, a RouterNavigationAction is dispatched with a
 snapshot of the state in its payload, the RouterStateSnapshot. The
 RouterStateSnapshot is a large complex structure, containing many pieces of
 information about the current state and what's rendered by the router. This
 can cause performance issues when used with the Store Devtools.

 In most cases, we only need a piece of information from the
 RouterStateSnapshot. In order to pare down the RouterStateSnapshot provided
 during navigation, we provide a custom serializer for the snapshot to only
 return what we need to be added to the payload and store.

 The custom serializer should implement the abstract class
 RouterStateSerializer and return a snapshot which should have an interface
 extending BaseRouterStoreState.

 If the app has multiple router-outlet(s), we need to modify
 MergedRouterStateSerializer / MergeRoute to capture and provide the route
 info for each outlet. We may change params, data etc to be Map<name,?> so
 you could reduce them in store per named router-outlet, and default/main.
 */
@Injectable()
export class MergedRouterStateSerializer
  implements RouterStateSerializer<MergedRoute> {
  serialize(routerState: RouterStateSnapshot): MergedRoute {
    return {
      url: routerState.url,
      params: mergeRouteParams(routerState.root, (r) => r.params),
      queryParams: mergeRouteParams(routerState.root, (r) => r.queryParams),
      data: mergeRouteData(routerState.root),
    };
  }
}

function mergeRouteParams(
  route: ActivatedRouteSnapshot,
  getter: (r: ActivatedRouteSnapshot) => Params
): Params {
  if (!route) {
    return {};
  }
  const currentParams = getter(route);
  const primaryChild =
    route.children.find((c) => c.outlet === 'primary') || route.firstChild;
  return { ...currentParams, ...mergeRouteParams(primaryChild, getter) };
}

function mergeRouteData(route: ActivatedRouteSnapshot): Data {
  if (!route) {
    return {};
  }

  const currentData = route.data;
  const primaryChild =
    route.children.find((c) => c.outlet === 'primary') || route.firstChild;
  return { ...currentData, ...mergeRouteData(primaryChild) };
}

// -----------------------------------------------------------------------------
// Selectors
// -----------------------------------------------------------------------------

export const selectRouterState = createFeatureSelector<State>(
  ROUTER_STORE_FEATURE_KEY
);
export const getMergedRoute = createSelector(
  selectRouterState,
  (reducerState) => reducerState.state
);

// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Injectable, Inject, Optional } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigationAction } from '@ngrx/router-store';
import { HC_APPLICATION_NAME_TOKEN } from '@workspace/util-angular';
import { Title } from '@angular/platform-browser';
import * as fromRouterStore from './reducer';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as fromRouterActions from './actions';

@Injectable()
export class RouterStoreEffects {
  /**
   * Update title every time the route changes, populating the context (ctx)
   * and getting the actual title by invoking the function in the route path
   * data.
   *
   * A path that needs to change the title will provide a data property similar
   * to the one in the example below:
   *
   *  path: 'workspace/locations',
   *  component: LocationsExplorerWorkspaceComponent
   *  data: {
   *    // A dynamic title that shows the application name and the workspace
   *    title(ctx) {
   *    return ctx.applicationName + ' - Locations';
   *    }
   *  },
   *
   */
  updateTitleEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        map((action: RouterNavigationAction<fromRouterStore.MergedRoute>) => {
          if (action.payload.routerState.data.title) {
            const ctx = {
              applicationName: this._applicationName
                ? this._applicationName
                : '',
            };
            this.titleService.setTitle(
              action.payload.routerState.data.title(ctx)
            );
          }
        })
      ),
    { dispatch: false }
  );

  gotoHomeEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromRouterActions.goToHome),
        map(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private titleService: Title,
    private store$: Store<fromRouterStore.State>,
    private router: Router,
    @Optional()
    @Inject(HC_APPLICATION_NAME_TOKEN)
    private _applicationName: string
  ) {}
}

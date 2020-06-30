// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { NgModule, Optional, Self } from '@angular/core';
import {
  routerReducer,
  RouterStateSerializer,
  StoreRouterConnectingModule,
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { MergedRouterStateSerializer } from './reducer';
import { Router } from '@angular/router';
import { RouterStoreEffects } from './effects';
import { EffectsModule } from '@ngrx/effects';

export const routerStateConfig = {
  stateKey: 'router', // state-slice name for routing state
};

/*
 To make the router state (MergedRoute) a part of our centralized NgRx store
 state['router'], we will write a module that can simply be included in our
 root store module
 */

@NgModule({
  imports: [
    StoreModule.forFeature(routerStateConfig.stateKey, routerReducer),
    StoreRouterConnectingModule.forRoot(routerStateConfig),
    EffectsModule.forFeature([RouterStoreEffects]),
  ],
  providers: [
    {
      provide: RouterStateSerializer,
      useClass: MergedRouterStateSerializer,
    },
    RouterStoreEffects,
  ],
})
export class RouterStoreModule {
  constructor(@Self() @Optional() router: Router) {
    if (!router) {
      console.error(
        'RouterStoreModule must be imported in the same same level as RouterModule'
      );
    }
  }
}

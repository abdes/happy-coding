// Copyright (c) 2019-2020 The Authors
// This file is part of https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';

import { CoreModule } from '@workspace/feature-app-core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { HighlightModule } from '@npcz/ngx-highlight';
import { SearchBarModule } from '@npcz/ngx-search-bar';
import {
  HC_PRODUCTION_TOKEN,
  HC_APPLICATION_NAME_TOKEN,
} from '@workspace/util-angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule.forRoot([]),
    // ngrx store dev tools will only be loaded if not in production
    // the @ngrx/store-devtools will hence be a dev dependency
    !environment.production
      ? StoreDevtoolsModule.instrument({
          maxAge: 25,
        })
      : [],

    MatToolbarModule,
    HighlightModule,
    SearchBarModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          component: AppComponent,
          data: {
            // A dynamic title that shows the application name
            title(ctx) {
              return ctx.applicationName + ' (Home)';
            },
          },
        },
        { path: '**', redirectTo: '/' },
      ],
      {
        //initialNavigation: 'enabled',
        // The onSameUrlNavigation property defines what the router should do if
        // it receives a navigation request to the current URL. By default, the
        // router will ignore this navigation. However, this prevents features
        // such as a “refresh” button. Use this option to configure the behavior
        // when navigating to the current URL. Default is ‘ignore’.
        onSameUrlNavigation: 'reload',
      }
    ),
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/',
    },
    {
      provide: HC_PRODUCTION_TOKEN,
      useValue: environment.production,
    },
    {
      provide: HC_APPLICATION_NAME_TOKEN,
      useValue: 'Example',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// Copyright (c) 2019-2020 The Authors
// This file is part of https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppModule } from './app/app.module';
import { PlaygroundModule } from 'angular-playground';
import { PlaygroundHelpersModule } from './app/helpers/playground-helpers.module';

PlaygroundModule.configure({
  overlay: false,
  modules: [BrowserAnimationsModule],
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

// Double bootstrap to also bootstrap the playground helpers module
platformBrowserDynamic().bootstrapModule(PlaygroundHelpersModule);

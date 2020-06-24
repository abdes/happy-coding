// Copyright (c) 2019-2020 The Authors
// This file is part of https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PlaygroundModule } from 'angular-playground';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, PlaygroundModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

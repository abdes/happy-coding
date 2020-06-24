// Copyright (c) 2019-2020 The Authors
// This file is part of https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeSwitcherComponent } from './theme-switcher.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [ThemeSwitcherComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    RouterTestingModule.withRoutes([]),
  ],
  exports: [ThemeSwitcherComponent],
  bootstrap: [ThemeSwitcherComponent],
})
export class PlaygroundHelpersModule {}

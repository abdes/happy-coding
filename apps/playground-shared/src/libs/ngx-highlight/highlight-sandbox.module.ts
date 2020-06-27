// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-highlight
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { FlexLayoutModule } from '@angular/flex-layout';

import { HighlightModule } from '@npcz/ngx-highlight';

import { HighlightSandboxComponent } from './highlight-sandbox.component';

@NgModule({
  declarations: [HighlightSandboxComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCardModule,
    MatInputModule,
    FlexLayoutModule,
    HighlightModule,
  ],
})
export class HighlightSandboxModule {}

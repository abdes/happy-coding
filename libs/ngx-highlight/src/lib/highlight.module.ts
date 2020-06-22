// Copyright (c) 2019-2020 The Authors.
// This file is part of ngx-highlight.
//
// SPDX-License-Identifier: BSD-3-Clause

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from './highlight.directive';

@NgModule({
  declarations: [HighlightDirective],
  imports: [CommonModule],
  exports: [HighlightDirective],
})
export class HighlightModule {}

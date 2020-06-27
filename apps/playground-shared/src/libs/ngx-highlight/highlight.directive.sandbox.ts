// Copyright (c) 2019-2020 The Authors
// This file is part of @npcz/ngx-highlight
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';

import { HighlightModule } from '@npcz/ngx-highlight';

import { sandboxOf } from 'angular-playground';
import { HighlightSandboxComponent } from './highlight-sandbox.component';

const sandboxConfig = {
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCardModule,
    MatInputModule,
    FlexLayoutModule,
    HighlightModule,
  ],
  providers: [],
  declarations: [HighlightSandboxComponent],
  exports: [HighlightSandboxComponent],
  label: 'ngx-highlight',
};

export default sandboxOf(HighlightSandboxComponent, sandboxConfig).add(
  'default',
  {
    template: '<hcpg-highlight-sandbox>Hello</hcpg-highlight-sandbox>',
  }
);

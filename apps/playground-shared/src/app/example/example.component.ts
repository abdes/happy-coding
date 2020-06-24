// Copyright (c) 2019-2020 The Authors
// This file is part of https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Component } from '@angular/core';

@Component({
  selector: 'hcpg-playground-example',
  templateUrl: './example.component.html',
  styles: [
    `
      .example__container {
        padding: 1rem;
      }
    `,
  ],
})
export class ExampleComponent {
  message = '';

  onClicked(): void {
    this.message = 'Button clicked!';
  }
}

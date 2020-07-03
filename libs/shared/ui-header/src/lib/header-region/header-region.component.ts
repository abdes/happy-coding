// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Component, Input } from '@angular/core';
import { RegionInterface } from './region.interface';

@Component({
  selector: 'hc-header-region',
  templateUrl: './header-region.component.html',
  styleUrls: ['./header-region.component.scss'],
})
export class HeaderRegionComponent {
  @Input() regions: RegionInterface[];
  @Input() shipToRegion: RegionInterface;
  @Input() language: string;

  onChangeLanguage(): void {
    console.debug('change language clicked');
  }

  onRegionChanged(): void {
    console.debug('region changed: ', this.shipToRegion);
  }
}

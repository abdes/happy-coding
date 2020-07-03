// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RegionInterface } from './region.interface';
import { LanguageInterface } from './language.interface';

@Component({
  selector: 'hc-header-region',
  templateUrl: './header-region.component.html',
  styleUrls: ['./header-region.component.scss'],
})
export class HeaderRegionComponent {
  @Input() regions: RegionInterface[];
  @Input() shipToRegion: RegionInterface;
  @Input() language: LanguageInterface;
  @Input() supportedLanguages: LanguageInterface[];
  @Output() languageChange = new EventEmitter<string>();
  @Output() shipToRegionChange = new EventEmitter<string>();

  onLanguageSelected(languageCode: string): void {
    this.language = this.supportedLanguages.find(
      (element) => element.languageCode == languageCode
    );
    this.languageChange.emit(languageCode);
  }

  onRegionChanged(): void {
    this.shipToRegionChange.emit(this.shipToRegion.countryCode);
  }
}

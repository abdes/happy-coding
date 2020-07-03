// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import * as countryCodes from 'country-codes-list';
import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { RegionInterface } from '../header-region/region.interface';
import { HeaderLinkInterface } from '../header-links/header-link.interface';
import { LanguageInterface } from '../header-region/language.interface';

@Component({
  selector: 'hc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  iconLiteral: SafeHtml;

  regions: RegionInterface[] = countryCodes.customArray(
    {
      countryCode: '{countryCode}',
      displayName: '{countryNameEn}',
      languageCode: 'officialLanguageCode',
    },
    { sortBy: 'displayName' }
  );

  supportedLanguageCodes = ['en', 'fr', 'ar'];
  activeLanguageCode = 'en';

  supportedLanguages: LanguageInterface[] = _.uniqWith(
    countryCodes.customArray(
      {
        languageCode: '{officialLanguageCode}',
        displayName: '{officialLanguageNameLocal}',
      },
      {
        sortBy: 'languageCode',
        filter: (countryData) =>
          this.supportedLanguageCodes.includes(
            countryData.officialLanguageCode
          ),
      }
    ),
    _.isEqual
  );
  activeLanguage = this.supportedLanguages.find(
    (element) => element.languageCode == this.activeLanguageCode
  );

  links: HeaderLinkInterface[] = [
    { label: 'Daily Deals', route: '/todaydeals' },
    { label: 'Customer Service', route: '/help' },
  ];

  constructor(
    private _sanitizer: DomSanitizer,
    private _iconRegistry: MatIconRegistry
  ) {}
  ngOnInit(): void {
    this.iconLiteral = this._sanitizer.bypassSecurityTrustHtml(
      `
      <svg viewBox='0 0 175 57' xmlns='http://www.w3.org/2000/svg'>
        <path d='M60,2l12,12l-12,12l-12-12zM88,2l12,12l-12,12l-12-12zM116,2l12,12l-12,12l-12-12zM18,16l12,12l-12,12l-12-12zM46,16l12,12l-12,12l-12-12zM74,16l12,12l-12,12l-12-12zM102,16l12,12l-12,12l-12-12zM130,16l12,12l-12,12l-12-12zM158,16l12,12l-12,12l-12-12zM60,30l12,12l-12,12l-12-12zM88,30l12,12l-12,12l-12-12zM116,30l12,12l-12,12l-12-12z' fill='#bdbdc5'/>
        <path stroke='#000' stroke-width='0.5' d='M7,27h26l13,13l14-14l14,14l28-28l14,14l14-14l15,15h26v3h-27l-14-14l-14,14l-14-14l-28,28l-14-14l-14,14l-14-14h-25z' fill='#ffd652'/>
        <path d='M3,26h5v5h-5zM168,26h5v5h-5z'/>
      </svg>
      `
    );
    console.debug(this.iconLiteral);

    this._iconRegistry.addSvgIconLiteralInNamespace(
      'shoped',
      'logo',
      this.iconLiteral,
      {}
    );

    console.debug(this._iconRegistry.getNamedSvgIcon('logo', 'shoped'));

    console.debug(this.supportedLanguages);
  }

  onMenuButtonClicked(): void {
    console.debug('menu button clicked');
  }

  onLanguageChanged(languageCode: string): void {
    console.debug('New language selected: ', languageCode);
  }

  onShipToRegionChanged(countryCode: string): void {
    console.debug('New ship-to region selected: ', countryCode);
  }
}

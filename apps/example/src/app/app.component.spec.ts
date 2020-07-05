// Copyright (c) 2019-2020 The Authors
// This file is part of https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HighlightModule } from '@npcz/ngx-highlight';
import { SearchBarModule } from '@npcz/ngx-search-bar';
import { AppConfigService } from '@workspace/feature-app-config';

class MockAppConfigService {
  config = {
    greeting: 'Welcome to example!',
  };
}

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [MatToolbarModule, HighlightModule, SearchBarModule],
    providers: [
      {
        provide: AppConfigService,
        useClass: MockAppConfigService,
      },
    ],
  });

  it('should create the app', () => {
    spectator = createComponent();
    expect(spectator.component).toBeTruthy();
  });

  it('should render welcome message', () => {
    spectator = createComponent();
    expect(spectator.query('.header__greeting')).toHaveText(
      'Welcome to example!'
    );
  });
});

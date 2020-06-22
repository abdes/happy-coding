// Copyright (c) 2019-2020 The Authors.
// This file is part of ngx-highlight.
//
// SPDX-License-Identifier: BSD-3-Clause

import { createHostFactory, SpectatorWithHost } from '@ngneat/spectator/jest';

import { HighlightDirective } from './highlight.directive';
import { fakeAsync } from '@angular/core/testing';

describe('HighlightDirective ', () => {
  let host: SpectatorWithHost<HighlightDirective>;
  const createHost = createHostFactory({
    component: HighlightDirective,
    template: '<div [hcHighlight]="style">Testing HighlightDirective</div>',
  });

  it('should change the background color', fakeAsync(() => {
    host = createHost(undefined, {
      hostProps: { style: { hover: 'background', focus: 'outline' } },
    });

    host.dispatchMouseEvent(host.element, 'mouseenter');
    host.tick(100);
    expect(host.element).toHaveClass('hc-hover-background');

    host.dispatchMouseEvent(host.element, 'mouseleave');
    host.tick(100);
    expect(host.element).not.toHaveClass('hc-hover-background');
  }));
});

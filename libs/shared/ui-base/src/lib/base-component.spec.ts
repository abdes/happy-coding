// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { BaseComponent } from './base-component';
import { OnInit, Component } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

describe('BaseComponent', () => {
  // Create an rxjs Observable for testing
  const obs = new Subject<boolean>();
  // The subscription will be kept here
  let sub: Subscription;
  // Create a spy function for the cleanup code
  const cleanupSpy = jest.fn();

  @Component({
    selector: 'hc-test-component',
    template: '<div></div>',
    styles: [],
  })
  class TestComponent extends BaseComponent implements OnInit {
    ngOnInit(): void {
      // Subscribe to the observable
      sub = obs.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
      // Register some cleanup code to be run at component destruction
      this.destroy$.subscribe(() => cleanupSpy());
    }
  }

  let spectator: Spectator<TestComponent>;
  const createComponent = createComponentFactory(TestComponent);

  beforeEach(() => {
    spectator = createComponent();
    expect(spectator.component).toBeTruthy();
    expect(sub).toBeTruthy();
  });

  it('should trigger unsubscribe from all hooked subscription at destruction', () => {
    // Spy on unsbscribe()
    const unsubscribeSpy = jest.spyOn(sub, 'unsubscribe');
    // Explicitly call the component ngOnDestroy() and test
    spectator.component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should execute cleanup code on destruction', () => {
    // Explicitly call the component ngOnDestroy() and test
    spectator.component.ngOnDestroy();
    expect(cleanupSpy).toBeCalled();
  });
});

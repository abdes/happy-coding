// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { InjectionToken } from '@angular/core';

/**
 * Various InjectionTokens shared across all platforms and apps.
 * Always prefix with 'HC_' and suffix with '_TOKEN' for clarity and
 * consistency.
 */

export const HC_PRODUCTION_TOKEN = new InjectionToken<boolean>(
  'HC_PRODUCTION_TOKEN'
);

export const HC_APPLICATION_NAME_TOKEN = new InjectionToken<string>(
  'HC_APPLICATION_NAME_TOKEN'
);

// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { ConfigLoader } from './config-loader.interface';

export interface ConfigOptions {
  loader: ConfigLoader;
  continueOnError?: boolean;
}

export const DEFAULT_OPTIONS: Partial<ConfigOptions> = {
  continueOnError: true,
};

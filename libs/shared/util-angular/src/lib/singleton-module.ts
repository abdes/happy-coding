// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

/**
 * Helper function, called from constructors of modules that need to be loaded
 * only once, to throw an error.
 *
 * Some NgModules and their services should be loaded only once by the root
 * AppModule. Importing the module a second time by lazy loading a module could
 * produce errant behavior that may be difficult to detect and diagnose.
 *
 * To prevent this issue, write a constructor that attempts to inject the module
 * or service from the root app injector. If the injection succeeds, the class
 * has been loaded a second time. By default, for such cases we chose to throw
 * an error, In some special cases there maybe applicableother remedial actions
 * that can be take instead of calling this function.
 *
 * Here is a custom constructor for an NgModule using this technique:
 * ```typescript
 * constructor (@Optional() @SkipSelf() parentModule?: OnlyOnceModule) {
 *   throwIfAlreadyLoaded(parentModule, 'OnlyOnceModule');
 * }
 * ```
 *
 * The `Optional` decorator indicates that we do not require that injection to
 * succeed (actually we don't even expect it to).
 *
 * The `SkipSelf` decorator tells angular to look for a provider upwards in the
 * injection hierarchy, skipping the current module, as we are looking of this
 * module has been already loaded somewhere else.
 *
 * @param parentModule the injected (if any) instance of the NgModule which
 * constructor is calling this function (see example above).
 * @param moduleName the module name (for debugging purpose only).
 */
export function throwIfAlreadyLoaded(
  parentModule: unknown,
  moduleName: string
): void {
  if (parentModule) {
    throw new Error(
      `${moduleName} has already been loaded. Import ${moduleName} in the AppModule only.`
    );
  }
}

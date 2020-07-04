// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SPDX-License-Identifier: BSD-3-Clause

import { strings } from '@angular-devkit/core';

import {
  Rule,
  SchematicsException,
  Tree,
  applyTemplates,
  chain,
  mergeWith,
  move,
  noop,
  url,
  apply,
  SchematicContext,
} from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { Schema as CommandOptions } from './schema';

async function makeDefaultPath(host, options: CommandOptions) {
  const workspace = await getWorkspace(host);
  const project = workspace.projects.get(options.project as string);
  if (!project) {
    throw new SchematicsException('Specified project does not exist.');
  } else {
    const root = project.sourceRoot
      ? `/${project.sourceRoot}/`
      : `/${project.root}/src/`;
    options.path = `${root}assets`;
  }
}

export default function (options: CommandOptions): Rule {
  return async (host: Tree, context: SchematicContext) => {
    const countries = await import('svg-country-flags/countries.json');

    if (options.list) {
      context.logger.info(
        `There are ${Object.keys(countries).length} country flags available.\n`
      );
      for (const countryCode in countries) {
        context.logger.info(`${countryCode}: ${countries[countryCode]}`);
      }
      context.logger.info(
        '\nUse --countries with comma-separated list of country codes to include in the icon set.'
      );
      context.logger.info('Use --all to include all availabel countries.\n');
      return noop();
    }

    if (options.countries) {
      // We split every packages by commas to allow people to pass in multiple and make it an array.
      options.countries = options.countries.reduce((acc, curr) => {
        return acc.concat(curr.split(','));
      }, [] as string[]);
    }

    const countriesToInclude =
      options.countries && options.countries.length > 0
        ? options.countries
        : options.all
        ? Object.keys(countries).map((code) => code.toLowerCase())
        : [];

    if (countriesToInclude.length == 0) {
      throw new SchematicsException(
        'You must provide a comma-separated list of country codes.' +
          ' Use --list to see what country codes are available.'
      );
    }

    context.logger.info(
      `Countries to include in the icon set: ${
        options.all ? 'all' : JSON.stringify(countriesToInclude)
      }`
    );

    if (options.path === undefined) {
      await makeDefaultPath(host, options);
    }

    // Make the array of icons
    const icons = [];
    for (const country of countriesToInclude) {
      const path = `/node_modules/svg-country-flags/svg/${country}.svg`;
      const file = host.read(path).toString();
      icons.push(file.replace(/^<svg\s+/, `<svg id="${country}" `));
    }
    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...options,
        icons,
      }),
      move(options.path),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}

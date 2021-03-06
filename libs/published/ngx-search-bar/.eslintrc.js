const _ = require('lodash');
const workspaceConfig = require('../../../.eslintrc');

/**
 * We are using the .JS version of an ESLint config file here so that we can
 * add lots of comments to better explain and document the setup.
 */
module.exports = _.merge({}, workspaceConfig, {
  rules: {
    // ORIGINAL tslint.json -> "directive-selector": [true, "attribute", "app", "camelCase"],
    '@angular-eslint/directive-selector': [
      'error',
      { type: 'attribute', prefix: 'hc', style: 'camelCase' },
    ],

    // ORIGINAL tslint.json -> "component-selector": [true, "element", "app", "kebab-case"],
    '@angular-eslint/component-selector': [
      'error',
      { type: 'element', prefix: 'hc', style: 'kebab-case' },
    ],
  },
  parserOptions: {
    project: [
      'libs/published/ngx-search-bar/tsconfig.lib.json',
      'libs/published/ngx-search-bar/tsconfig.spec.json',
    ],
  },
});

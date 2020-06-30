const _ = require('lodash');
const workspaceConfig = require('../../../.eslintrc');

/**
 * We are using the .JS version of an ESLint config file here so that we can
 * add lots of comments to better explain and document the setup.
 */
module.exports = _.merge({}, workspaceConfig, {
  rules: {
    '@angular-eslint/directive-selector': [
      'error',
      { type: 'attribute', prefix: 'hc', style: 'camelCase' },
    ],

    '@angular-eslint/component-selector': [
      'error',
      { type: 'element', prefix: 'hc', style: 'kebab-case' },
    ],
  },
  parserOptions: {
    project: [
      'libs/shared/feature-app-core/tsconfig.lib.json',
      'libs/shared/feature-app-core/tsconfig.spec.json',
    ],
  },
});

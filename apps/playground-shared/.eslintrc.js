const _ = require('lodash');
const workspaceConfig = require('../../.eslintrc');

/**
 * We are using the .JS version of an ESLint config file here so that we can
 * add lots of comments to better explain and document the setup.
 */
module.exports = _.merge({}, workspaceConfig, {
  rules: {
    // ORIGINAL tslint.json -> "directive-selector": [true, "attribute", "app", "camelCase"],
    '@angular-eslint/directive-selector': [
      'error',
      { type: 'attribute', prefix: 'hcpg', style: 'camelCase' },
    ],

    // ORIGINAL tslint.json -> "component-selector": [true, "element", "app", "kebab-case"],
    '@angular-eslint/component-selector': [
      'error',
      { type: 'element', prefix: 'hcpg', style: 'kebab-case' },
    ],
  },
  parserOptions: {
    project: [
      'apps/playground-shared/tsconfig.app.json',
      'apps/playground-shared/tsconfig.spec.json',
    ],
  },
});

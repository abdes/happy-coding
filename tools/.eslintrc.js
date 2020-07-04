const _ = require('lodash');
const workspaceConfig = require('../.eslintrc');

/**
 * We are using the .JS version of an ESLint config file here so that we can
 * add lots of comments to better explain and document the setup.
 */
module.exports = _.merge({}, workspaceConfig, {
  parserOptions: {
    project: ['tools/tsconfig.tools.json'],
  },
});

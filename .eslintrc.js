/**
 * We are using the .JS version of an ESLint config file here so that we can
 * add lots of comments to better explain and document the setup.
 */
module.exports = {
  /**
   * See packages/eslint-plugin/src/configs/README.md
   * for what this recommended config contains.
   */
  ignorePatterns: ['**/*.js'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:@angular-eslint/recommended',
  ],
  plugins: ['@typescript-eslint', '@nrwl/eslint-plugin-nx'],
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

    // NX dependency rules
    '@nrwl/nx/enforce-module-boundaries': [
      'error',
      {
        allow: [],
        depConstraints: [
          {
            sourceTag: 'scope:shared',
            onlyDependOnLibsWithTags: ['scope:shared'],
          },
          // We allow publishable projects to depend on other publishable
          // projects, knowing that in reality all imports will be done as if
          // they were coming from node_modules.
          {
            sourceTag: 'scope:published',
            onlyDependOnLibsWithTags: ['scope:published'],
          },
          {
            sourceTag: 'scope:web',
            onlyDependOnLibsWithTags: ['scope:shared', 'scope:web'],
          },
          {
            sourceTag: 'scope:electron',
            onlyDependOnLibsWithTags: ['scope:shared', 'scope:electron'],
          },
          {
            sourceTag: 'scope:app-example',
            onlyDependOnLibsWithTags: ['scope:shared', 'scope:app-example'],
          },
          {
            sourceTag: 'scope:app-example-web',
            onlyDependOnLibsWithTags: [
              'scope:shared',
              'scope:app-example',
              'scope:app-example-web',
            ],
          },
          {
            sourceTag: 'type:data',
            onlyDependOnLibsWithTags: ['type:data', 'type:util'],
          },
          {
            sourceTag: 'type:ui',
            onlyDependOnLibsWithTags: ['type:ui', 'type:util'],
          },
          {
            sourceTag: 'type:util',
            onlyDependOnLibsWithTags: ['type:util'],
          },
        ],
      },
    ],
  },
  overrides: [
    /**
     * This extra piece of configuration is only necessary if you make use of inline
     * templates within Component metadata, e.g.:
     *
     * @Component({
     *  template: `<h1>Hello, World!</h1>`
     * })
     * ...
     *
     * It is not necessary if you only use .html files for templates.
     */
    {
      files: ['*.component.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      plugins: ['@angular-eslint/template'],
      processor: '@angular-eslint/template/extract-inline-html',
    },
  ],
};

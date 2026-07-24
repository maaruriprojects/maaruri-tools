// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      // Standalone-only workspace: no NgModule opt-outs.
      '@angular-eslint/prefer-standalone': 'error',
      // Signal-based inputs/outputs/queries instead of the legacy decorators.
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-signal-model': 'error',
      '@angular-eslint/prefer-output-emitter-ref': 'error',
      '@angular-eslint/no-uncalled-signals': 'error',
      '@angular-eslint/computed-must-return': 'error',
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/prefer-service-decorator': 'error',
      // All logging goes through LoggingService (core/logging) so a remote
      // sink can be added in one file later, not at every call site.
      'no-console': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
  {
    // The only files allowed to call console.* directly: the logging
    // service itself, and two entry points that run outside Angular's
    // injector (so LoggingService isn't available yet) — the bootstrap
    // failure handler in main.ts and the Express server startup log in
    // server.ts.
    files: ['src/app/core/logging/logging.service.ts', 'src/main.ts', 'src/server.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  // Must stay last: turns off ESLint stylistic rules that would fight Prettier's formatting.
  eslintConfigPrettier,
]);

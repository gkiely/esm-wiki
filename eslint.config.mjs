import tseslint from 'typescript-eslint';

// https://typescript-eslint.io/packages/typescript-eslint/#advanced-usage
export default tseslint.config({
  files: ['src/**/*.ts', 'src/**/*.tsx'],
  plugins: {
    '@typescript-eslint': tseslint.plugin,
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
      warnOnUnsupportedTypeScriptVersion: false,
    },
  },
  // These rules are not covered by biome
  // https://github.com/biomejs/biome/issues/3187
  rules: {
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  },
});

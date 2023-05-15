/* eslint-disable no-undef */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'unused-imports', 'simple-import-sort'],
  rules: {
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
    'linebreak-style': ['off', 'unix'],
    'jsx-quotes': ['error', 'prefer-single'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    '@typescript-eslint/no-unused-vars': 'error',
    'unused-imports/no-unused-imports': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error'
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}

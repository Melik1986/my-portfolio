import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = dirname(currentFilename);

const compat = new FlatCompat({
  baseDirectory: currentDirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'max-lines-per-function': ['error', { max: 30, skipBlankLines: true, skipComments: true }],
      'max-depth': ['error', 3],
      'max-params': ['error', 2],
      'id-length': ['error', { min: 2, exceptions: ['x', 'y'] }],
      camelcase: 'off',
      'func-names': ['error', 'always'],
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'react/function-component-definition': ['error', { namedComponents: 'function-declaration' }],
      'react/jsx-pascal-case': ['error', { allowAllCaps: false, ignore: [] }],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE'], leadingUnderscore: 'allow' },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        { selector: 'typeLike', format: ['PascalCase'] },
      ],
    },
  },
];

export default eslintConfig;

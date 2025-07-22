import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'max-lines-per-function': ['error', { max: 20, skipBlankLines: true, skipComments: true }],
      'max-depth': ['error', 3],
      'max-params': ['error', 2],
      'id-length': ['error', { min: 2 }],
      camelcase: ['error', { properties: 'always' }],
      'func-names': ['error', 'always'],
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'react/function-component-definition': ['error', { namedComponents: 'function-declaration' }],
      'react/jsx-pascal-case': ['error', { allowAllCaps: false, ignore: [] }],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE'], leadingUnderscore: 'allow' },
        { selector: 'function', format: ['camelCase'] },
        { selector: 'typeLike', format: ['PascalCase'] },
      ],
    },
  },
];

export default eslintConfig;

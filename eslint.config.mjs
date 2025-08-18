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
      'max-lines-per-function': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
      'max-depth': ['warn', 4],
      'max-params': ['warn', 4],
      'id-length': ['warn', { min: 1, exceptions: ['x', 'y', 'i', 'e', 'z'] }],
      camelcase: 'off',
      'func-names': ['warn', 'always'],
      'func-style': ['warn', 'declaration', { allowArrowFunctions: true }],
      'react/function-component-definition': ['warn', { namedComponents: 'function-declaration' }],
      'react/jsx-pascal-case': ['error', { allowAllCaps: false, ignore: [] }],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        { selector: 'typeLike', format: ['PascalCase'] },
      ],
    },
  },
  {
    files: ['tests/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'max-lines-per-function': 'off',
      'func-names': 'off',
    },
  },
];

export default eslintConfig;

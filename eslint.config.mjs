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
      // Основное правило: максимум 50 строк для компонентов, хуков и бизнес-логики
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],

      // Более строгие ограничения для глубины и параметров
      'max-depth': ['warn', 4],
      'max-params': ['warn', 4],

      // Правила именования
      'id-length': ['warn', { min: 1, exceptions: ['x', 'y', 'i', 'e', 'z'] }],
      camelcase: 'off',
      'func-names': ['warn', 'always'],
      'func-style': ['warn', 'declaration', { allowArrowFunctions: true }],

      // React правила
      'react/function-component-definition': ['warn', { namedComponents: 'function-declaration' }],
      'react/jsx-pascal-case': ['error', { allowAllCaps: false, ignore: [] }],

      // TypeScript правила именования
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
  // Переопределение правил для тестов и скриптов
  {
    files: [
      '**/*.test.{js,ts,tsx}',
      '**/*.spec.{js,ts,tsx}',
      '**/tests/**/*.{js,ts,tsx}',
      '**/scripts/**/*.{js,ts}',
    ],
    rules: {
      'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],
    },
  },
  // Переопределение для отдельных файлов, где может потребоваться больше строк
  {
    files: [
      '**/utils/**/*.{js,ts,tsx}',
      '**/helpers/**/*.{js,ts,tsx}',
      '**/services/**/*.{js,ts,tsx}',
    ],
    rules: {
      'max-lines-per-function': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
    },
  },
];

export default eslintConfig;

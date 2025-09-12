import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupPluginRules } from '@eslint/compat';
import securityPlugin from 'eslint-plugin-security';

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = dirname(currentFilename);

const compat = new FlatCompat({
  baseDirectory: currentDirname,
});

const eslintConfig = [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/blob-report/**',
      '**/test-results/**',
      '**/.vercel/**',
      '**/next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // Security: подключаем плагин в flat-конфиге и ограничиваем областью src
  {
    files: ['src/**/*.{js,ts,tsx}'],
    plugins: { security: fixupPluginRules(securityPlugin) },
    rules: {
      // Отключаем шумное правило для FE-кода
      'security/detect-object-injection': 'off',
      // Базовые проверки
      'security/detect-new-buffer': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-unsafe-regex': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-pseudoRandomBytes': 'warn',
      'security/detect-possible-timing-attacks': 'warn',
      // Node-специфичные — пусть будут предупреждения (вдруг появятся server-only файлы)
      'security/detect-child-process': 'warn',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-no-csrf-before-method-override': 'warn',
    },
  },
  {
    rules: {
      // Основное правило: максимум 50 строк для компонентов, хуков и бизнес-логики
      'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],

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
      'src/modules/AnimatedCardSection/utils/cardDeckAnimation.ts',
      'src/app/layout.tsx',
      'src/modules/AiContentSection/AiContentSection.tsx',
      'src/modules/AiContentSection/component/VerticalMarquee/VerticalMarquee.tsx',
      'src/modules/AiVideoContentSection/AiVideoContentSection.tsx',
    ],
    rules: {
      'max-lines-per-function': ['off'],
    },
  },
];

export default eslintConfig;

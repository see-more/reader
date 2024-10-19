import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettierConfig from 'eslint-config-prettier';
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.es2025 } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: [
      'node_modules',
      'babel.config.js',
      'tailwind.config.js',
      'scripts/reset-project.js',
    ],
  },
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-require-imports': [
        'error',
        {
          allow: ['@/assets/images/*', '@/assets/fonts/*'],
        },
      ],
      'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
    },
  },
  prettierConfig,
];

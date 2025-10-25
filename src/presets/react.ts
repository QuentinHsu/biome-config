import { indexConfig } from '../source/index.ts';
import type { BiomeConfig } from '../types.ts';
import { mergeConfigs } from '../utils/merge.ts';

const reactOverlay: BiomeConfig = {
  files: {
    includes: ['!**/.storybook'],
  },
  javascript: {
    jsxRuntime: 'reactClassic',
  },
  linter: {
    rules: {
      style: {
        useFragmentSyntax: 'error',
      },
    },
  },
  overrides: [
    {
      includes: ['**/__tests__/**', '**/*.{test,spec}.{ts,tsx,js,jsx}'],
      linter: {
        rules: {
          correctness: {
            noUnusedVariables: 'off',
          },
        },
      },
    },
  ],
};

export const reactConfig = mergeConfigs(indexConfig, reactOverlay);

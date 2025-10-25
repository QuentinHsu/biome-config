import type { BiomeConfig } from '../types.ts';
import { mergeConfigs } from '../utils/merge.ts';
import { reactConfig } from './react.ts';

const nextOverlay: BiomeConfig = {
  files: {
    includes: ['!**/.next', '!**/.vercel', '!**/out'],
  },
  javascript: {
    jsxRuntime: 'transparent',
  },
  linter: {
    rules: {
      correctness: {
        useExhaustiveDependencies: {
          level: 'error',
          options: {
            reportUnnecessaryDependencies: true,
          },
        },
      },
    },
  },
};

export const nextConfig = mergeConfigs(reactConfig, nextOverlay);

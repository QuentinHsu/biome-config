import { indexConfig } from '../source/index.ts';
import type { BiomeConfig } from '../types.ts';
import { mergeConfigs } from '../utils/merge.ts';

const vueOverlay: BiomeConfig = {
  files: {
    includes: ['!**/.vitepress', '!**/.output'],
  },
  javascript: {
    parser: {
      jsxEverywhere: false,
    },
  },
  html: {
    formatter: {
      indentScriptAndStyle: true,
      selfCloseVoidElements: 'always',
    },
  },
  overrides: [
    {
      includes: ['**/*.vue'],
      formatter: {
        lineWidth: 120,
      },
      javascript: {
        formatter: {
          quoteStyle: 'single',
        },
      },
    },
  ],
};

export const vueConfig = mergeConfigs(indexConfig, vueOverlay);

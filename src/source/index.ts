import { BIOME_SCHEMA_URL } from '../constants/biome.ts';
import type { BiomeConfig } from '../types.ts';

export const indexConfig: BiomeConfig = {
  $schema: BIOME_SCHEMA_URL,
  assist: {
    actions: {
      source: {
        organizeImports: {
          level: 'on',
          options: {
            groups: [[':NODE:', ':BUN:', ':PACKAGE_WITH_PROTOCOL:', ':PACKAGE:'], ':BLANK_LINE:', ':ALIAS:', ':BLANK_LINE:', ':PATH:'],
          },
        },
        useSortedAttributes: {
          level: 'on',
          options: {
            sortOrder: 'natural',
          },
        },
        useSortedKeys: 'on',
      },
    },
  },
  files: {
    ignoreUnknown: true,
    includes: ['**', '!**/build', '!**/dist', '!**/.next'],
  },
  formatter: {
    enabled: true,
    formatWithErrors: true,
    indentStyle: 'space',
    lineWidth: 140,
  },
  javascript: {
    formatter: {
      arrowParentheses: 'asNeeded',
      jsxQuoteStyle: 'single',
      quoteStyle: 'single',
      trailingCommas: 'all',
    },
  },
  linter: {
    enabled: true,
    rules: {
      complexity: {
        noUselessStringConcat: 'error',
        noUselessUndefinedInitialization: 'error',
        noVoid: 'error',
        useDateNow: 'error',
      },
      correctness: {
        noConstantMathMinMaxClamp: 'error',
        noUndeclaredVariables: 'error',
        noUnusedFunctionParameters: 'error',
        noUnusedImports: 'error',
        noUnusedPrivateClassMembers: 'error',
        noUnusedVariables: 'error',
        useExhaustiveDependencies: {
          level: 'error',
          options: {
            reportUnnecessaryDependencies: false,
          },
        },
      },
      nursery: {
        useSortedClasses: {
          fix: 'safe',
          level: 'error',
          options: {
            functions: ['clsx', 'cn'],
          },
        },
      },
      recommended: true,
      style: {
        noParameterProperties: 'error',
        noYodaExpression: 'error',
        useArrayLiterals: 'error',
        useConsistentBuiltinInstantiation: 'error',
        useFragmentSyntax: 'error',
        useImportType: {
          fix: 'safe',
          level: 'error',
          options: {
            style: 'separatedType',
          },
        },
        useSelfClosingElements: {
          fix: 'safe',
          level: 'error',
          options: {},
        },
        useShorthandAssign: 'error',
      },
      suspicious: {
        noEvolvingTypes: 'error',
        useAwait: 'error',
      },
    },
  },
  overrides: [
    {
      includes: ['**/*.jsx', '**/*.tsx'],
      linter: {
        rules: {
          style: {
            noParameterAssign: 'error',
          },
        },
      },
    },
    {
      includes: ['**/*.ts', '**/*.tsx'],
      linter: {
        rules: {
          correctness: {
            noUnusedVariables: 'off',
          },
        },
      },
    },
  ],
  root: true,
  vcs: {
    clientKind: 'git',
    defaultBranch: 'main',
    enabled: true,
    useIgnoreFile: true,
  },
};

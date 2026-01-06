import type { BiomeConfig } from '../types.ts';
import { mergeConfigs } from '../utils/merge.ts';
import { vueConfig } from './vue.ts';

const nuxtOverlay: BiomeConfig = {
  css: {
    parser: {
      cssModules: true,
      tailwindDirectives: true,
    },
  },
  files: {
    includes: ['!**/.nuxt', '!**/.nitro', '!**/.output'],
  },
  javascript: {
    globals: [
      'defineNuxtConfig',
      'defineAppConfig',
      'defineNuxtPlugin',
      'defineNuxtRouteMiddleware',
      'defineNuxtServerPlugin',
      'defineNitroPlugin',
      'defineEventHandler',
      'defineLazyEventHandler',
      'definePayloadPlugin',
      'defineRouteRules',
      'definePageMeta',
      'useRuntimeConfig',
      'useNuxtApp',
      'useAsyncData',
      'useLazyAsyncData',
      'useFetch',
      'useLazyFetch',
      'useState',
      'useCookie',
      'useHead',
      'useSeoMeta',
      'useError',
      'clearError',
      'showError',
      'navigateTo',
      'abortNavigation',
      'refreshNuxtData',
      'onNuxtReady',
      'useRouter',
      'useRoute',
      'useRequestEvent',
      'useRequestHeaders',
      // Vue Composition API
      'computed',
      'ref',
      'watch',
      'onMounted',
      'onUnmounted',
      // Component helpers
      'defineProps',
      'defineEmits',
      // Additional composables
      'useColorMode',
      'useUserSession',
      '$fetch',
      // Server utils
      'readBody',
      'getQuery',
      'readFormData',
      'createError',
      'getRequestURL',
      'getUserSession',
      'getHeader',
      'getRouterParam',
      'defineOAuthGitHubEventHandler',
      'sendRedirect',
      'setHeader',
      'setUserSession',
      'clearUserSession',
    ],
  },
  overrides: [
    {
      includes: ['**/*.ts'],
      linter: {
        rules: {
          correctness: {
            noUndeclaredVariables: 'error',
          },
        },
      },
    },
  ],
};

export const nuxtConfig = mergeConfigs(vueConfig, nuxtOverlay);

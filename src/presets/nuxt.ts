import type { BiomeConfig } from '../types.ts';
import { mergeConfigs } from '../utils/merge.ts';
import { vueConfig } from './vue.ts';

const nuxtOverlay: BiomeConfig = {
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

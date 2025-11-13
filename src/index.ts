import { nextConfig } from './presets/next.ts';
import { nuxtConfig } from './presets/nuxt.ts';
import { reactConfig } from './presets/react.ts';
import { vueConfig } from './presets/vue.ts';
import { indexConfig } from './source/index.ts';

export { BIOME_SCHEMA_URL } from './constants/biome.ts';
export { indexConfig, reactConfig, nextConfig, vueConfig, nuxtConfig };

export const allPresets = Object.freeze({
  index: indexConfig,
  next: nextConfig,
  nuxt: nuxtConfig,
  react: reactConfig,
  vue: vueConfig,
});

export type { BiomeConfig } from './types.ts';

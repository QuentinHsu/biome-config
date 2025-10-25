import { defineConfig } from '@rslib/core';

export default defineConfig({
  output: {
    target: 'node',
  },
  lib: [
    {
      format: 'esm',
      source: {
        entry: {
          index: './src/index.ts',
          build: './src/build.ts',
        },
        tsconfigPath: './tsconfig.json',
      },
      output: {
        distPath: {
          root: './dist',
        },
        filename: {
          js: '[name].mjs',
        },
      },
      dts: {
        distPath: './dist/types',
      },
    },
  ],
});

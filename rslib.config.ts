import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      dts: {
        distPath: './dist/types',
      },
      format: 'esm',
      output: {
        distPath: {
          root: './dist',
        },
        filename: {
          js: '[name].mjs',
        },
      },
      source: {
        entry: {
          build: './src/build.ts',
          index: './src/index.ts',
        },
        tsconfigPath: './tsconfig.json',
      },
    },
  ],
  output: {
    target: 'node',
  },
});

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { allPresets } from './index.ts';

const currentDir = dirname(fileURLToPath(import.meta.url));
const outputDir = currentDir;

const serialize = (config: unknown): string => `${JSON.stringify(config, null, 2)}\n`;

async function ensureDir(path: string) {
  await mkdir(path, { recursive: true });
}

async function buildJsonPresets() {
  await ensureDir(outputDir);

  const tasks: Promise<string>[] = Object.entries(allPresets).map(async ([name, config]) => {
    const filePath = join(outputDir, `${name}.jsonc`);
    const data = serialize(config);
    await writeFile(filePath, data, 'utf8');
    return filePath;
  });

  const writtenFiles = await Promise.all(tasks);
  return writtenFiles;
}

(async () => {
  try {
    const files = await buildJsonPresets();
    // eslint-disable-next-line no-console
    console.log(`Generated presets: ${files.join(', ')}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to generate Biome presets', error);
    process.exitCode = 1;
  }
})();

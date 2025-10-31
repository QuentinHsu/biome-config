import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const outputDir = join(currentDir, '../dist');

const serialize = (config: unknown): string => `${JSON.stringify(config, null, 2)}\n`;

async function ensureDir(path: string) {
  await mkdir(path, { recursive: true });
}

async function buildJsonPresets() {
  try {
    // 使用时间戳绕过模块缓存
    const importPath = join(currentDir, '../src/index.ts');
    const importUrl = `${importPath}?t=${Date.now()}`;
    const { allPresets } = await import(importUrl);

    await ensureDir(outputDir);

    const tasks: Promise<string>[] = Object.entries(allPresets).map(async ([name, config]) => {
      const filePath = join(outputDir, `${name}.jsonc`);
      const data = serialize(config);
      await writeFile(filePath, data, 'utf8');
      return filePath;
    });

    const writtenFiles = await Promise.all(tasks);
    const timestamp = new Date().toLocaleTimeString();
    // eslint-disable-next-line no-console
    console.log(`[${timestamp}] ✓ Generated presets: ${writtenFiles.map(f => f.split('/').pop()).join(', ')}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to generate Biome presets:', error);
    throw error;
  }
}

buildJsonPresets().catch(error => {
  // eslint-disable-next-line no-console
  console.error('Build error:', error);
  process.exit(1);
});

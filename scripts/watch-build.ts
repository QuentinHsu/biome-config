import { watch } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const srcDir = join(currentDir, '../src');
const outputDir = join(currentDir, '../dist');

const serialize = (config: unknown): string => `${JSON.stringify(config, null, 2)}\n`;

async function ensureDir(path: string) {
  await mkdir(path, { recursive: true });
}

async function buildJsonPresets() {
  try {
    // 动态导入模块，避免缓存
    const globalThisRecord = globalThis as Record<string, unknown>;
    delete globalThisRecord.allPresetsCache;
    const { allPresets } = await import('../src/index.ts');

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
  }
}

async function watchSrc() {
  // 初始构建
  await buildJsonPresets();

  // eslint-disable-next-line no-console
  console.log('👀 Watching for changes...\n');

  let timeout: NodeJS.Timeout;

  watch(srcDir, { recursive: true }, (_eventType, _filename) => {
    // 防抖：避免快速变化触发多次构建
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      buildJsonPresets();
    }, 100);
  });
}

watchSrc().catch(error => {
  // eslint-disable-next-line no-console
  console.error('Watch error:', error);
  process.exit(1);
});

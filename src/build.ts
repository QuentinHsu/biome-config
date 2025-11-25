import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';

import { allPresets } from './index.ts';

const currentDir = dirname(fileURLToPath(import.meta.url));
const outputDir = currentDir;

const serialize = (config: unknown): string => `${JSON.stringify(config, null, 2)}\n`;

async function ensureDir(path: string) {
  await mkdir(path, { recursive: true });
}

async function buildJsonPresets() {
  await ensureDir(outputDir);
  const startTime = performance.now();
  console.log(
    pc.blue(`
██████╗ ██╗ ██████╗ ███╗   ███╗███████╗     ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ 
██╔══██╗██║██╔═══██╗████╗ ████║██╔════╝    ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ 
██████╔╝██║██║   ██║██╔████╔██║█████╗      ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
██╔══██╗██║██║   ██║██║╚██╔╝██║██╔══╝      ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
██████╔╝██║╚██████╔╝██║ ╚═╝ ██║███████╗    ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
╚═════╝ ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝ 
`),
  );
  console.log(`${pc.magenta('config')}  ${Object.keys(allPresets).length} presets loaded`);
  console.log(`${pc.cyan('info')}    build started...`);

  const tasks = Object.entries(allPresets).map(async ([name, config]) => {
    const fileName = `${name}.jsonc`;
    const filePath = join(outputDir, fileName);
    const data = serialize(config);
    await writeFile(filePath, data, 'utf8');
    const size = Buffer.byteLength(data, 'utf8');
    return { fileName, size };
  });

  const results = await Promise.all(tasks);
  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);

  console.log(`${pc.green('ready')}   built in ${duration} ms`);

  return results;
}

(async () => {
  try {
    const files = await buildJsonPresets();

    console.log('');
    const PADDING = 25;
    console.log(`${pc.gray('File'.padEnd(PADDING))} ${pc.gray('Size')}`);

    let totalSize = 0;
    for (const file of files) {
      const sizeKB = (file.size / 1024).toFixed(1);
      totalSize += file.size;
      const filePath = `dist/${file.fileName}`;
      const paddedPath = filePath.padEnd(PADDING);

      console.log(`${pc.cyan(paddedPath)} ${pc.bold(sizeKB + ' kB')}`);
    }

    console.log('');
    const totalKB = (totalSize / 1024).toFixed(1);
    console.log(`${pc.magenta('Total:'.padEnd(PADDING))} ${totalKB} kB`);
    console.log('');
  } catch (error) {
    console.error('Failed to generate Biome presets', error);
    process.exitCode = 1;
  }
})();

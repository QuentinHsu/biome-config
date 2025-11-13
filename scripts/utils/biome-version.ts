import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '../../');
const PACKAGE_JSON_PATH = resolve(PROJECT_ROOT, 'package.json');
const BIOME_TS_PATH = resolve(PROJECT_ROOT, 'src/constants/biome.ts');

/**
 * Get the @biomejs/biome version from package.json
 */
export async function getBiomejsVersion(): Promise<string> {
  const packageJson = JSON.parse(await readFile(PACKAGE_JSON_PATH, 'utf-8'));
  const biomejsVersion = packageJson.devDependencies['@biomejs/biome'];

  if (!biomejsVersion) {
    throw new Error('Failed to find @biomejs/biome version in package.json');
  }

  return biomejsVersion;
}

/**
 * Update the biome.ts constants file with the current version
 * @returns An object containing the version and schema URL
 */
export async function updateBiomeConstantsFile(): Promise<{ version: string; schemaUrl: string }> {
  const biomejsVersion = await getBiomejsVersion();
  const schemaUrl = `https://biomejs.dev/schemas/${biomejsVersion}/schema.json`;

  const content = `// This URL version is dynamically resolved from package.json during the build
// To update, modify the @biomejs/biome version in package.json
export const BIOME_SCHEMA_URL = '${schemaUrl}' as const;\n`;

  await writeFile(BIOME_TS_PATH, content, 'utf-8');
  return { schemaUrl, version: biomejsVersion };
}

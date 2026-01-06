import { nextConfig } from '../src/presets/next.ts';
import { nuxtConfig } from '../src/presets/nuxt.ts';
import { reactConfig } from '../src/presets/react.ts';
import { vueConfig } from '../src/presets/vue.ts';
import { indexConfig } from '../src/source/index.ts';

interface ValidationResult {
  config: string;
  status: 'valid' | 'invalid';
  errors: string[];
}

const configs = [
  { config: indexConfig, name: 'indexConfig' },
  { config: reactConfig, name: 'reactConfig' },
  { config: nextConfig, name: 'nextConfig' },
  { config: vueConfig, name: 'vueConfig' },
  { config: nuxtConfig, name: 'nuxtConfig' },
];

function validateConfig(name: string, config: any): ValidationResult {
  const errors: string[] = [];

  // 检查基本结构
  const requiredTopLevelKeys = ['$schema', 'assist', 'files', 'formatter', 'linter'];
  for (const key of requiredTopLevelKeys) {
    if (key === '$schema' && !config.$schema) {
      errors.push(`Missing $schema`);
    }
  }

  // 检查 linter 规则
  if (config.linter?.rules) {
    const rules = config.linter.rules;
    const validCategories = ['complexity', 'correctness', 'nursery', 'recommended', 'style', 'suspicious'];

    for (const category in rules) {
      if (category === 'recommended') continue; // boolean value is ok
      if (!validCategories.includes(category)) {
        errors.push(`Unknown rule category: ${category}`);
      }
    }
  }

  // 检查 javascript 配置
  if (config.javascript) {
    const validJsKeys = ['formatter', 'parser', 'globals', 'jsxRuntime'];
    for (const key in config.javascript) {
      if (!validJsKeys.includes(key)) {
        errors.push(`Unknown javascript config: ${key}`);
      }
    }
  }

  // 检查 formatter 配置
  if (config.formatter) {
    const validFormatterKeys = ['enabled', 'formatWithErrors', 'indentStyle', 'lineWidth', 'ignoreComments', 'attributePosition'];
    for (const key in config.formatter) {
      if (!validFormatterKeys.includes(key)) {
        errors.push(`Unknown formatter config: ${key}`);
      }
    }
  }

  // 检查 files 配置
  if (config.files) {
    const validFilesKeys = ['includes', 'ignoreUnknown'];
    for (const key in config.files) {
      if (!validFilesKeys.includes(key)) {
        errors.push(`Unknown files config: ${key}`);
      }
    }
  }

  return {
    config: name,
    errors,
    status: errors.length === 0 ? 'valid' : 'invalid',
  };
}

console.log('🔍 Validating Biome Configuration Properties\n');

const results: ValidationResult[] = configs.map(({ name, config }) => validateConfig(name, config));

let validCount = 0;
for (const result of results) {
  if (result.status === 'valid') {
    console.log(`✓ ${result.config} - Valid`);
    validCount++;
  } else {
    console.log(`✗ ${result.config} - Invalid`);
    for (const error of result.errors) {
      console.log(`  - ${error}`);
    }
  }
}

console.log(`\n📊 Summary: ${validCount}/${results.length} configurations valid`);

if (validCount !== results.length) {
  process.exitCode = 1;
}

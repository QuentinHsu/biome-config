#!/usr/bin/env tsx
/**
 * Generate CHANGELOG.md by analyzing git changes with AI
 * Usage: tsx scripts/generate-changelog.ts [from-tag] [to-tag]
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface ChangelogEntry {
  version: string;
  date: string;
  features: string[];
  fixes: string[];
  changes: string[];
}

function getLatestTag(): string | null {
  try {
    return execSync('git describe --tags --abbrev=0', {
      encoding: 'utf-8',
    }).trim();
  } catch {
    return null;
  }
}

function getGitDiff(fromRef: string, toRef: string): string {
  try {
    return execSync(`git diff ${fromRef}..${toRef}`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch (error) {
    console.error('Failed to get git diff:', error);
    return '';
  }
}

function getCommitMessages(fromRef: string, toRef: string): string {
  try {
    return execSync(`git log ${fromRef}..${toRef} --pretty=format:"%s"`, {
      encoding: 'utf-8',
    });
  } catch (error) {
    console.error('Failed to get commit messages:', error);
    return '';
  }
}

function analyzeChangesWithAI(commits: string): { features: string[]; fixes: string[]; changes: string[] } {
  // 简化方案: 基于 commit message 的关键词自动分类
  const commitLines = commits.split('\n').filter(line => line.trim());
  const features: string[] = [];
  const fixes: string[] = [];
  const changes: string[] = [];

  for (const commit of commitLines) {
    const lower = commit.toLowerCase();
    if (lower.includes('feat') || lower.includes('add') || lower.includes('new')) {
      features.push(commit);
    } else if (lower.includes('fix') || lower.includes('bug') || lower.includes('patch')) {
      fixes.push(commit);
    } else if (commit.trim()) {
      changes.push(commit);
    }
  }

  return { features, fixes, changes };
}

function formatChangelogEntry(entry: ChangelogEntry): string {
  let content = `## [${entry.version}] - ${entry.date}\n\n`;

  if (entry.features.length > 0) {
    content += '### Features\n\n';
    for (const feature of entry.features) {
      content += `- ${feature}\n`;
    }
    content += '\n';
  }

  if (entry.fixes.length > 0) {
    content += '### Bug Fixes\n\n';
    for (const fix of entry.fixes) {
      content += `- ${fix}\n`;
    }
    content += '\n';
  }

  if (entry.changes.length > 0) {
    content += '### Changes\n\n';
    for (const change of entry.changes) {
      content += `- ${change}\n`;
    }
    content += '\n';
  }

  return content;
}

function updateChangelog(entry: ChangelogEntry, changelogPath: string) {
  let existingContent = '';
  try {
    existingContent = readFileSync(changelogPath, 'utf-8');
  } catch {
    existingContent = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';
  }

  // 检查该版本是否已存在
  const versionHeader = `## [${entry.version}]`;
  if (existingContent.includes(versionHeader)) {
    console.log(`⚠️  Version ${entry.version} already exists in CHANGELOG.md`);
    console.log('Replacing existing entry...');

    // 删除现有的版本条目
    const lines = existingContent.split('\n');
    const startIndex = lines.findIndex(line => line.startsWith(versionHeader));

    if (startIndex !== -1) {
      // 找到下一个版本标题或文件结尾
      let endIndex = lines.findIndex((line, idx) => idx > startIndex && (line.startsWith('## [') || line.startsWith('## v')));

      if (endIndex === -1) {
        endIndex = lines.length;
      }

      // 删除旧条目
      lines.splice(startIndex, endIndex - startIndex);
      existingContent = lines.join('\n');
    }
  }

  const newEntry = formatChangelogEntry(entry);
  const lines = existingContent.split('\n');
  const headerEndIndex = lines.findIndex(line => line.startsWith('## [') || line.startsWith('## v'));

  let updatedContent: string;
  if (headerEndIndex === -1) {
    // 没有现有版本，追加到末尾
    updatedContent = existingContent + '\n' + newEntry;
  } else {
    // 在第一个版本之前插入
    lines.splice(headerEndIndex, 0, newEntry);
    updatedContent = lines.join('\n');
  }

  writeFileSync(changelogPath, updatedContent, 'utf-8');
  console.log(`✓ CHANGELOG.md updated successfully`);
}

function main() {
  const args = process.argv.slice(2);
  const latestTag = getLatestTag();

  // 如果没有 tag,使用最近 5 个 commits
  const fromRef = args[0] || latestTag || '';
  const toRef = args[1] || 'HEAD';

  let commits: string;

  if (fromRef) {
    console.log(`Analyzing changes from ${fromRef} to ${toRef}...`);
    commits = getCommitMessages(fromRef, toRef);
  } else {
    console.log('No tags found. Analyzing last 5 commits...');
    try {
      commits = execSync('git log -5 --pretty=format:"%s"', {
        encoding: 'utf-8',
      });
    } catch (error) {
      console.error('Failed to get commit messages:', error);
      return;
    }
  }

  if (!commits.trim()) {
    console.log('No commits found.');
    return;
  }

  const analysis = analyzeChangesWithAI(commits);

  // 获取当前版本和日期
  const packageJsonPath = resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const version = packageJson.version;
  const date = new Date().toISOString().split('T')[0];

  const entry: ChangelogEntry = {
    version,
    date,
    features: analysis.features,
    fixes: analysis.fixes,
    changes: analysis.changes,
  };

  const changelogPath = resolve(process.cwd(), 'CHANGELOG.md');
  updateChangelog(entry, changelogPath);

  console.log('\n=== Generated Entry Preview ===');
  console.log(formatChangelogEntry(entry));
}

main();

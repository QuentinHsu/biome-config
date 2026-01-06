import { execFile } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const scriptDir = new URL('.', import.meta.url);
const projectRoot = new URL('../', scriptDir);
const projectRootPath = fileURLToPath(projectRoot);
const packageJsonPath = new URL('../package.json', scriptDir);

interface PackageJson {
  version: string;
}

type ReleaseChoice = 'patch' | 'minor' | 'major' | 'custom';

const releaseLabels: { [key in ReleaseChoice]: string } = {
  custom: 'Custom version (provide the exact semver string)',
  major: 'Major version (breaking changes)',
  minor: 'Minor version (new features, backwards compatible)',
  patch: 'Patch version (bug fixes)',
};

const semverRegex = /^\d+\.\d+\.\d+(?:[-+][\w.]+)?$/;

async function readCurrentVersion(): Promise<string> {
  const contents = await readFile(packageJsonPath, 'utf8');
  const { version } = JSON.parse(contents) as PackageJson;
  return version;
}

async function updateVersionInPackageJson(newVersion: string) {
  const contents = await readFile(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(contents) as PackageJson;
  packageJson.version = newVersion;
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
}

function bumpVersion(current: string, kind: ReleaseChoice): string {
  const base = current.split('-')[0];
  const segments = base.split('.').map(Number);
  if (segments.length !== 3 || segments.some(Number.isNaN)) {
    throw new Error(`Encountered an unsupported version format: ${current}`);
  }

  const [major, minor, patch] = segments;
  switch (kind) {
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'major':
      return `${major + 1}.0.0`;
    default:
      throw new Error('Invalid bump kind requested');
  }
}

async function ensureCleanWorkingTree(rootPath: string) {
  const { stdout: status } = await execFileAsync('git', ['status', '--porcelain'], {
    cwd: rootPath,
  });
  if (status.trim()) {
    throw new Error('Your working tree has uncommitted changes. Commit or stash them before tagging.');
  }
}

async function commitAndTag(version: string) {
  await execFileAsync('git', ['add', 'package.json', 'pnpm-lock.yaml'], { cwd: projectRootPath });
  await execFileAsync('git', ['commit', '-m', `chore: bump version to ${version}`], { cwd: projectRootPath });
  await execFileAsync('git', ['tag', '--no-sign', `v${version}`], { cwd: projectRootPath });
}

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    await ensureCleanWorkingTree(projectRootPath);

    const currentVersion = await readCurrentVersion();
    console.log(`当前版本: ${currentVersion}`);

    console.log('\n选择版本类型:');
    (['patch', 'minor', 'major', 'custom'] as ReleaseChoice[]).forEach((choice, index) => {
      console.log(`  ${index + 1}. ${releaseLabels[choice]}`);
    });

    const selected = (await rl.question('请输入选项编号（默认 1）: ')).trim() || '1';
    const mapped = (['patch', 'minor', 'major', 'custom'] as ReleaseChoice[])[Number(selected) - 1] ?? 'patch';

    let targetVersion: string;

    if (mapped === 'custom') {
      const custom = (await rl.question('输入目标版本号（例如 1.2.3）: ')).trim();
      if (!semverRegex.test(custom)) {
        throw new Error('版本号必须符合 semver，例如 1.2.3');
      }
      targetVersion = custom;
    } else {
      targetVersion = bumpVersion(currentVersion, mapped);
    }

    console.log(`\n将创建的标签: v${targetVersion}`);
    const confirm = (await rl.question('确认要更新版本并创建标签吗？(y/N): ')).trim().toLowerCase();
    if (confirm !== 'y' && confirm !== 'yes') {
      console.log('操作已取消。');
      return;
    }

    await updateVersionInPackageJson(targetVersion);
    await commitAndTag(targetVersion);
    console.log('\n✅ 版本更新完成。请运行 git push origin main && git push origin v' + targetVersion);
  } finally {
    rl.close();
  }
}

main().catch(error => {
  // eslint-disable-next-line no-console
  console.error('交互式打 tag 失败:', error);
  process.exit(1);
});

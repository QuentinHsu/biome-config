#!/bin/bash

# 本地测试版本发布流程
# 用法: ./scripts/test-release.sh <version>

set -e

VERSION=${1:-"0.1.1"}

echo "=========================================="
echo "Testing Release Flow for v$VERSION"
echo "=========================================="
echo ""

# 1. 模拟提取版本号
echo "Step 1: Extract version from tag"
echo "Version: $VERSION"
echo ""

# 2. 更新 package.json 版本
echo "Step 2: Update package.json version"
npm version $VERSION --no-git-tag-version
echo "✓ package.json updated"
echo ""

# 3. 生成 CHANGELOG
echo "Step 3: Generate CHANGELOG"
pnpm run generate:changelog
echo ""

# 4. 展示 CHANGELOG 内容
echo "Step 4: Extract changelog entry"
echo "----------------------------------------"
# 提取从当前版本开始到下一个版本标题或文件结尾的内容
CHANGELOG_ENTRY=$(awk "/## \[$VERSION\]/,/^## \[/{if(/^## \[$VERSION\]/) found=1; if(found && /^## \[/ && !/## \[$VERSION\]/) exit; if(found) print}" CHANGELOG.md)
echo "$CHANGELOG_ENTRY"
echo "----------------------------------------"
echo ""

# 5. 模拟 PR 内容
echo "Step 5: Simulated PR Content"
echo "=========================================="
cat << EOF
Title: Release v$VERSION

Body:
## Release v$VERSION

This PR updates the package version and changelog for the new release.

### Changelog

$CHANGELOG_ENTRY

---

To publish this release to npm, review the changes and comment /release on this PR.
EOF
echo "=========================================="
echo ""

# 6. 构建检查
echo "Step 6: Build package (dry-run)"
pnpm build
echo "✓ Build successful"
echo ""

echo "=========================================="
echo "✓ All steps completed successfully!"
echo "=========================================="
echo ""
echo "Changes made (not committed):"
git status --short
echo ""
echo "To reset changes: git checkout package.json CHANGELOG.md"
echo "To commit changes: git add -A && git commit -m 'chore: bump version to $VERSION'"

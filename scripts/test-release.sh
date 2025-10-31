#!/bin/bash

# 本地测试版本发布流程
# 用法: ./scripts/test-release.sh <version>

set -e

VERSION=${1:-"0.1.1"}

echo "=========================================="
echo "Testing Release Flow for v$VERSION"
echo "=========================================="
echo ""

# 1. 更新 package.json 版本
echo "Step 1: Update package.json version"
npm version $VERSION --no-git-tag-version
echo "✓ package.json updated to v$VERSION"
echo ""

# 2. 构建检查
echo "Step 2: Build package"
pnpm build
echo "✓ Build successful"
echo ""

# 3. 模拟发布检查
echo "Step 3: Publish check (dry-run)"
npm publish --dry-run --access public
echo "✓ Publish check passed"
echo ""

echo "=========================================="
echo "✓ All steps completed successfully!"
echo "=========================================="
echo ""
echo "Next steps to release:"
echo "  1. Commit the version change: git add package.json && git commit -m 'chore: bump version to $VERSION'"
echo "  2. Push to main: git push origin main"
echo "  3. Create and push tag: git tag v$VERSION && git push origin v$VERSION"
echo "  4. GitHub Actions will automatically:"
echo "     - Build the package"
echo "     - Generate changelog and create GitHub Release"
echo "     - Publish to npm"
echo ""
echo "To reset changes: git checkout package.json"
echo ""
echo "Current changes:"
git status --short


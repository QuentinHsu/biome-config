# Publishing Guide

## Quick Release

This project uses an automated release workflow with npm Trusted Publishers (OIDC).

**First-time setup**: Configure npm Trusted Publisher (see [Prerequisites](#prerequisites) and [Setup Trusted Publisher](#setup-trusted-publisher) below)

**To release a new version**:
1. Update version in `package.json`
2. Commit the changes
3. Create and push a tag: `git tag v0.2.0 && git push origin v0.2.0`
4. The workflow will automatically:
   - Build the package
   - Generate changelog and create GitHub Release
   - Publish to npm

That's it! ✨

**Local testing**:
```bash
pnpm test:release 0.2.0
```

---

## Publishing to npm

This project uses [npm Trusted Publishers](https://docs.npmjs.com/trusted-publishers) with OpenID Connect (OIDC) for secure, token-free publishing.

This document explains how to publish `@quentinhsu/biome-config` to npm using Trusted Publishers.

## Prerequisites

Before you can publish this package using Trusted Publishers:

1. **GitHub repository must be public**: The repository needs to be accessible to the public
2. **npm package must be public**: The package on npmjs.com should be set to public access
3. **npm CLI version 11.5.1 or later**: Required for OIDC support
   ```bash
   npm install -g npm@latest
   ```
4. **npm account with package ownership**: You must own or be a maintainer of the package on npmjs.com

## Setup Trusted Publisher

### Step 1: Register on npmjs.com

1. Navigate to your package settings on [npmjs.com](https://www.npmjs.com/)
   - Go to your package page (e.g., `https://www.npmjs.com/package/@quentinhsu/biome-config`)
   - Click on the "Settings" tab

2. Find the "Trusted Publisher" section and click the GitHub Actions button

3. Configure the following fields:
   - **Organization or user**: `QuentinHsu`
   - **Repository**: `biome-config`
   - **Workflow filename**: `release.yml`
   - **Environment name**: (Leave empty, or specify if using GitHub environments for approval)

4. Click "Create" to register the trusted publisher

### Step 2: Verify Workflow Configuration

The workflow file (`.github/workflows/release.yml`) is already configured with:

- `id-token: write` permission for OIDC token generation
- Trigger on `v*` tags
- Dependencies installation, build, and publish steps
- Automatic changelog generation using `changelogithub`

No additional configuration needed! ✅

## Publishing a Release

### Simple One-Step Release

When you push a version tag, the workflow automatically:

1. ✅ Checks out the repository
2. ✅ Installs dependencies
3. ✅ Builds the package
4. ✅ Generates GitHub Release with changelog from commits
5. ✅ Publishes to npm via OIDC (no tokens needed!)

### Steps to Release

```bash
# 1. Update version in package.json
npm version patch  # or minor, major
# This creates version 0.2.1 and commits the change

# 2. Push the commit and tag
git push origin main
git push origin v0.2.1
```

Or manually:

```bash
# 1. Update package.json version manually to 0.2.0
# 2. Commit the change
git add package.json
git commit -m "chore: bump version to 0.2.0"

# 3. Create and push tag
git tag v0.2.0
git push origin main
git push origin v0.2.0
```

### Monitor the Release

- **GitHub Actions**: Check the workflow progress in the Actions tab
- **GitHub Release**: Automatically created with changelog
- **npm Package**: Published at `https://www.npmjs.com/package/@quentinhsu/biome-config`

## How Trusted Publishing Works

### Security Benefits

- **Short-lived tokens**: Each publish generates a unique, short-lived OIDC token
- **Scoped credentials**: Tokens are specific to your workflow and cannot be extracted or reused
- **No manual token management**: No need to store or rotate npm tokens
- **Automatic provenance**: npm automatically generates cryptographic proof of where your package was built

### Token Flow

1. GitHub Actions detects OIDC environment during workflow execution
2. Requests an OIDC token from GitHub's OIDC provider
3. Exchanges the OIDC token with npm for an authentication token
4. Uses the temporary token to publish the package
5. Token automatically expires after the workflow completes

## Maximum Security: Restrict Token Access

After setting up Trusted Publishers, we recommend restricting traditional token-based publishing:

1. Go to your package Settings on npmjs.com
2. Navigate to **Publishing access**
3. Select **"Require two-factor authentication and disallow tokens"**
4. Save changes

This ensures **only** your GitHub Actions workflow can publish the package, completely eliminating token-based authentication risks.

## Troubleshooting

### "Unable to authenticate" error

- **Check workflow filename**: Verify the filename matches exactly (including `.yml` extension and case-sensitivity)
- **Verify configuration**: Confirm the trusted publisher settings on npmjs.com match your repository details
- **Check permissions**: Ensure `id-token: write` is set in the workflow
- **Use GitHub-hosted runners**: Self-hosted runners are not currently supported

### Package not found

- Ensure the package exists on npmjs.com
- Verify you have publishing access to the package
- Check that the package is not private if publishing publicly

### Version already exists

- npm doesn't allow republishing the same version
- Increment the version in `package.json` before tagging
- Use semantic versioning: `v0.2.0`, `v0.2.1`, `v1.0.0`, etc.

## Manual Publishing (Legacy)

If you need to publish manually without Trusted Publishers:

```bash
# Login to npm (creates a token)
npm login

# Build the package
pnpm build

# Publish
pnpm publish --access public
```

However, **Trusted Publishers is strongly recommended** for better security and automated workflows.

## References

- [npm Trusted Publishers Documentation](https://docs.npmjs.com/trusted-publishers)
- [npm Provenance Documentation](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub OIDC Documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [OpenSSF Trusted Publishers Specification](https://repos.openssf.org/trusted-publishers-for-all-package-repositories)

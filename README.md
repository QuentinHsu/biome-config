# @quentinhsu/biome-config

[![npm version](https://img.shields.io/npm/v/@quentinhsu/biome-config?style=flat-square)](https://www.npmjs.com/package/@quentinhsu/biome-config)
[![npm downloads](https://img.shields.io/npm/dm/@quentinhsu/biome-config?style=flat-square)](https://www.npmjs.com/package/@quentinhsu/biome-config)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-green?style=flat-square)](https://nodejs.org/)
[![license](https://img.shields.io/npm/l/@quentinhsu/biome-config?style=flat-square)](LICENSE)

A modular Biome configuration preset collection built with Rslib. Includes a comprehensive base configuration with framework-specific overlays (React, Next.js, Vue, Nuxt), ultimately generating `biome.jsonc` files in the `dist/` directory that can be directly extended in projects.

## Development

```bash
pnpm install
pnpm build
```

The build process first compiles TypeScript modules to `dist/` via Rslib, then executes `dist/build.mjs` to output each preset as a JSONC file.

## Available Presets

| Preset | Description | Export |
| --- | --- | --- |
| `.` (index) | Base configuration with recommended rules | `"extends": ["@quentinhsu/biome-config"]` |
| `./react` | React-specific rules and overrides | `"extends": ["@quentinhsu/biome-config/react"]` |
| `./next` | Next.js-specific rules and file exclusions | `"extends": ["@quentinhsu/biome-config/next"]` |
| `./vue` | Vue-specific rules and configuration | `"extends": ["@quentinhsu/biome-config/vue"]` |
| `./nuxt` | Nuxt-specific rules and configuration | `"extends": ["@quentinhsu/biome-config/nuxt"]` |

Each preset inherits from and extends the base configuration with framework-specific file patterns, globals, and linter rules.

## Usage

### Installation

Install this package in your project:

```bash
pnpm add -D @quentinhsu/biome-config
```

### Basic Setup

Create or update your `biome.json` (or `biome.jsonc`) file to use the base configuration:

```json
{
  "extends": ["@quentinhsu/biome-config"]
}
```

### Framework-Specific Configuration

#### React Projects

```json
{
  "extends": ["@quentinhsu/biome-config/react"]
}
```

The React preset includes:
- Fragment syntax enforcement
- JSX quote style configuration
- Test file rule overrides
- Storybook exclusion

#### Next.js Projects

```json
{
  "extends": ["@quentinhsu/biome-config/next"]
}
```

The Next.js preset extends React rules with Next.js-specific patterns.

#### Vue Projects

```json
{
  "extends": ["@quentinhsu/biome-config/vue"]
}
```

#### Nuxt Projects

```json
{
  "extends": ["@quentinhsu/biome-config/nuxt"]
}
```

### Customization

You can override or extend any preset rules in your own `biome.json`:

```json
{
  "extends": ["@quentinhsu/biome-config/react"],
  "linter": {
    "rules": {
      "style": {
        "useFragmentSyntax": "warn"
      }
    }
  },
  "formatter": {
    "lineWidth": 120
  }
}
```

### Base Configuration Features

The base configuration includes:

- **Formatter**: Space indentation, 140-character line width
- **Linter**: Recommended rules with strict complexity and correctness checks
- **JavaScript**: Single quotes, no arrow parentheses, trailing commas
- **Imports**: Organized by node modules, packages, aliases, and relative paths
- **VCS**: Git integration with `.gitignore` support
- **Files**: Ignores common output directories (`build`, `dist`, `.next`)

### Running Biome

Once configured, you can use Biome commands:

```bash
# Format files
pnpm biome format . --write

# Lint files
pnpm biome lint . --write

# Check formatting and linting
pnpm biome check .

# Fix lint issues automatically
pnpm biome lint . --fix
```




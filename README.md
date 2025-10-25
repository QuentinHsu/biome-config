# @example/biome-configs

使用 Rslib 构建的一组可复用 Biome 配置预设。将通用规则拆分成基础层和框架特定层，最终在 `dist/` 根目录生成可直接在项目中 `extends` 的 `biome.jsonc` 文件。

## 开发流程

```bash
pnpm install
pnpm build
```

构建流程会先通过 Rslib 将 TypeScript 模块编译到 `dist/`，随后执行 `dist/build.mjs` 将各个预设输出为 JSONC 文件。

## 可用预设

| 预设 | 说明 | 引用方式 |
| --- | --- | --- |
| `base` | 通用基础规则 | `"extends": ["@example/biome-configs/base"]` |
| `react` | React 项目额外约束 | `"extends": ["@example/biome-configs/react"]` |
| `next` | Next.js 项目扩展 | `"extends": ["@example/biome-configs/next"]` |
| `vue` | Vue 项目扩展 | `"extends": ["@example/biome-configs/vue"]` |
| `nuxt` | Nuxt.js 项目扩展 | `"extends": ["@example/biome-configs/nuxt"]` |

`react`/`next`、`vue`/`nuxt` 均在基础规则上叠加只在特定框架中才需要的文件排除、全局变量以及额外的 linter 选项。

## 发布到 npm

1. 构建产物：`pnpm build`
2. 确认 `dist/` 内文件结构：`pnpm pack --dry-run`
3. 去掉 `package.json` 中的 `private` 字段，更新版本号
4. 发布：`pnpm publish --access public`

发布后，在其它项目内即可通过 `extends` 语法共享这些预设。

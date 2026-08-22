---
title: "Vite 8 and Rolldown: One Pipeline Replaces the Two-Bundler Split"
date: 2026-08-22
category: tech
type: deep-dive
tags: [vite, rolldown, oxc, frontend, build-tools, typescript]
lang: en
tldr: "Vite 8 replaces the esbuild-for-development and Rollup-for-production split with Rolldown. Speed is the visible result; consistent bundler semantics across development and production are the deeper change."
description: "How Vite 8's Rolldown architecture works, what to verify during migration, and what the unified pipeline means for frontend teams and coding agents."
series:
  name: "AI 時代的技術選擇"
  order: 21
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-vite-8-rolldown)

[Vite 8](https://vite.dev/blog/announcing-vite8) is Vite's largest internal change since 2.0. Dependency optimization, TypeScript/JSX transforms, and production builds no longer split their work between esbuild and Rollup. They converge on the Rust-based [Rolldown](https://rolldown.rs/) and the Oxc toolchain. Vite reports up to a 10–30x advantage over Rollup in its benchmarks, but the architectural win matters more than one benchmark: development and production no longer stitch together two bundler semantics.

## Why Vite originally needed two engines

Vite's original decision was pragmatic. The development server needed speed, so esbuild handled dependency pre-bundling and syntax transforms. Production needed mature chunking, tree-shaking, and a plugin ecosystem, so Rollup handled the build.

The cost was two paths for the same source. Code could work in development and fail during a production build because module resolution, CommonJS interop, or plugin hooks behaved differently. Vite accumulated adapter logic, while plugin authors had to remember which hooks only ran during builds. These failures are especially expensive for coding agents because a terminal error often provides only indirect evidence about the missing runtime context.

Rolldown does not discard the Rollup API. It preserves the Vite and Rollup plugin model while replacing the implementation with native code. Vite 8 can therefore use one core for dependency optimization and production bundling, while Oxc supplies parsing, transforms, and minification.

## What the unified pipeline changes

First, failures can surface earlier. Shared resolution rules reduce the gap between development and build behavior, giving both people and agents feedback closer to CI reality. Second, the configuration surface contracts. Vite 8 translates some legacy `esbuild` and `rollupOptions` settings automatically, but new projects should use their Rolldown equivalents rather than treating the compatibility layer as permanent API.

Third, Vite is becoming an integrated toolchain rather than only a development server. The Vite 8 React plugin uses Oxc for React Refresh by default and no longer requires Babel. Experimental full bundle mode builds on the same bundler. This does not eliminate every Babel use case; it removes a general-purpose compiler from the default path.

```ts
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { forwardConsole: true },
});
```

`resolve.tsconfigPaths` has a small resolution cost and is therefore opt-in. `server.forwardConsole` sends browser console output to the terminal. That is valuable for CLI coding agents because client runtime failures become visible without a person opening DevTools.

## Do not upgrade by changing only the version

For large applications, Vite recommends a two-step migration: alias `vite` to `rolldown-vite` on Vite 7 to isolate Rolldown compatibility, then move to Vite 8 after plugins, SSR, and output are verified. Smaller projects can upgrade directly, but should still check the Node.js floor, remove deprecated `optimizeDeps.esbuildOptions` where possible, and audit custom Rollup plugins for undocumented behavior.

```json
{
  "devDependencies": {
    "vite": "npm:rolldown-vite@7.2.2"
  }
}
```

The intermediate step improves attribution: a changed result comes from the bundler switch rather than another Vite 8 breaking change. Verification must include production builds, SSR, dynamic imports, chunk names, and plugin output—not only a running dev server.

## Vite, Rspack, or Rolldown directly?

A system with substantial webpack loader and plugin investments should not migrate solely for speed; Rspack is often the shorter compatibility path. Use Rolldown directly when you need control over a bundling pipeline but not Vite's development server and framework integration. For ordinary React, Vue, Svelte, or Astro applications, Vite remains the right entry point because framework plugins, HMR, SSR, and the Environment API define its product boundary.

Vite 8 is most useful to teams that treat builds as verifiable contracts. Preserve bundle snapshots, critical-page smoke tests, and performance baselines before upgrading. That evidence tells you whether the native toolchain delivered a project-level benefit rather than merely reproducing an attractive vendor benchmark.

## References

- [Vite 8.0 is out](https://vite.dev/blog/announcing-vite8)
- [Vite 8 migration guide](https://vite.dev/guide/migration.html)
- [Rolldown documentation](https://rolldown.rs/)

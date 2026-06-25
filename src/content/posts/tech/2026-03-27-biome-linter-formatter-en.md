---
title: "Biome: Replacing ESLint + Prettier with Rust"
date: 2026-03-27
type: guide
category: tech
tags: [biome, linter, formatter, rust, dx]
lang: en
tldr: "Biome does the work of ESLint + Prettier in a single tool, running 10–20x faster with far less configuration. DaoDao uses it across an entire monorepo — lint and format in one pass."
description: "Biome is a JavaScript/TypeScript linter and formatter written in Rust, designed to replace the ESLint + Prettier combo. This post covers its speed advantages, monorepo benefits, configuration approach, and current limitations. DaoDao's monorepo relies on it to unify linting and formatting across all packages."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-biome-linter-formatter)

The frontend toolchain has a longstanding problem: ESLint handles linting, Prettier handles formatting — two tools, two configs, two plugin ecosystems, and occasional conflicts between them. In a monorepo, running each across three separate apps compounds the problem. More time, more friction.

Biome solves both with a single tool. And it's significantly faster.

## What Is Biome

Biome is a linter and formatter for JavaScript, TypeScript, JSX, and TSX written in Rust. It's the successor to Rome Tools, and its stated goal is to be "one tool to replace ESLint + Prettier."

This isn't a wrapper around those existing tools — it's a ground-up rewrite. The parser, linter, and formatter are all Rust-native, which is why it's fast.

## The Speed Gap

DaoDao's writeup notes that Biome is **10–20x faster** than the ESLint + Prettier combination.

That's not hyperbole. Rust's memory model and parallel processing let Biome scan large file trees without the GC pressure that Node.js-based tools face. ESLint might take 8–10 seconds across 100 files; Biome can finish in under a second.

The effect is amplified in a monorepo. What used to mean running ESLint separately against `apps/website`, `apps/product`, and `apps/mobile` becomes a single `biome check` from the repo root.

## Installation and Configuration

```bash
pnpm add -D @biomejs/biome
pnpm biome init
```

The generated `biome.json`:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "warn"
      },
      "style": {
        "useConst": "error",
        "noUnusedTemplateLiteral": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "trailingCommas": "es5"
    }
  },
  "files": {
    "ignore": ["node_modules", ".next", "dist", "build"]
  }
}
```

**Common commands**

```bash
# Check (lint + format check)
pnpm biome check .

# Auto-fix
pnpm biome check --write .

# Format only
pnpm biome format --write .

# Lint only
pnpm biome lint .
```

## Monorepo Configuration

One of Biome's strengths in a monorepo is the ability to place a single `biome.json` at the root, shared across all workspaces. If a specific app needs to override certain rules, it can define its own `biome.json` that extends the root config:

```json
// apps/mobile/biome.json
{
  "extends": ["../../biome.json"],
  "linter": {
    "rules": {
      "suspicious": {
        "noConsoleLog": "off"
      }
    }
  }
}
```

In DaoDao's Turborepo pipeline, the `lint` task simply runs `biome check` — one command to cover the entire monorepo, no per-app configuration needed.

## Biome vs. ESLint + Prettier

| | Biome | ESLint + Prettier |
|---|---|---|
| Speed | 10–20x faster | Baseline |
| Configuration | Single `biome.json` | `eslint.config.js` + `.prettierrc` + potential conflicts |
| Plugin ecosystem | Growing, but not ESLint's breadth | Extremely rich |
| IDE integration | Official VS Code extension | Mature |
| Type-aware linting | Partial (experimental) | Full TypeScript support |

## Current Limitations

Biome isn't a perfect fit for every project. A few areas worth evaluating:

**Plugin ecosystem gaps**: ESLint has thousands of plugins. Biome's rule set is growing steadily but doesn't have full coverage yet. If your project depends on specific ESLint plugins — `eslint-plugin-security`, `eslint-plugin-testing-library`, etc. — Biome may not have equivalent rules.

**Type-aware linting**: ESLint's TypeScript rules can perform type-aware analysis (e.g., `no-floating-promises`). Biome's support for this is still experimental.

**Rule granularity**: Some ESLint rules offer finer-grained configuration options than their Biome counterparts. If you have highly specific lint requirements, you may need to make tradeoffs.

For most projects — especially teams that value development speed and lean configuration — these limitations aren't blockers. DaoDao is the clearest example: their requirements mapped well to what Biome provides, and the speed gains were well worth the switch.

## Migrating from ESLint + Prettier

```bash
# Biome provides migration tooling
pnpm biome migrate eslint --write
pnpm biome migrate prettier --write
```

The migration tools read your existing `.eslintrc` and `.prettierrc` and convert them into `biome.json`. The conversion isn't 100% complete, but it handles the bulk of the manual work.

## Decision Summary

**Choose Biome when:**
- Starting a new project with no dependency on specialized ESLint plugins
- Working in a monorepo and want a unified toolchain with lower maintenance overhead
- Lint speed matters — CI time needs to come down

**Stick with ESLint when:**
- An existing project has extensive custom ESLint rules
- You need type-aware linting (`@typescript-eslint` advanced rules)
- You depend on ecosystem-specific plugins (accessibility, security, testing)

## References

- [Biome Official Docs — JavaScript/TypeScript Linter and Formatter Configuration Guide](https://biomejs.dev/)
- [Biome GitHub — Rust-native ESLint + Prettier Alternative](https://github.com/biomejs/biome)
- [Biome Migration Guide — Moving from ESLint + Prettier to Biome](https://biomejs.dev/guides/migrate-eslint-prettier/)
- [DaoDao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — Real-world case study of Biome adoption in DaoDao's monorepo with speed benchmarks

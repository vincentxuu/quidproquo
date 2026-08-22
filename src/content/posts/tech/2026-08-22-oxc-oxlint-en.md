---
title: "Oxc and Oxlint: Speed Comes From Reconnecting Parsing, Types, and Rules"
date: 2026-08-22
category: tech
type: deep-dive
tags: [oxc, oxlint, eslint, typescript, linting, rust]
lang: en
tldr: "Oxlint has grown from a fast ESLint companion into a standalone linter with type-aware rules and JavaScript plugins. Migration depends on rule, framework-file, and plugin compatibility—not only a 50–100x benchmark."
description: "The Oxc compiler stack, Oxlint's type-aware architecture, a staged ESLint migration, and the cases where ESLint should remain."
series:
  name: "AI 時代的技術選擇"
  order: 23
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-oxc-oxlint)

[Oxc](https://oxc.rs/) is not a single linter. It is a Rust implementation of JavaScript and TypeScript compiler primitives: a parser, AST, resolver, transformer, minifier, and semantic analysis. [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) is the linter built on that foundation. Its published benchmark places it 50–100 times ahead of ESLint, but the real selection question is whether it can carry the rule contract your repository currently expresses through ESLint.

## Oxc is infrastructure; Oxlint is the product entry point

Most application teams do not manipulate Oxc's AST directly. They use the `oxlint` CLI, configuration, and editor integration. Tools such as Vite and Rolldown can reuse Oxc parsing and transforms instead of maintaining separate JavaScript frontends.

The value of shared compiler infrastructure goes beyond parsing once. Resolution, scope analysis, control flow, and types can travel through a coherent pipeline instead of being reconstructed inside each JavaScript plugin. This is why Oxlint has moved from “run fast rules first, then let ESLint finish” toward a standalone linter.

## Correctness comes before style by default

Oxlint enables high-signal correctness rules by default, catching code that is clearly wrong, suspicious, or useless. Teams opt into pedantic, style, and restriction categories. Built-in rules cover ESLint core and common TypeScript, React, Import, Jest, Vitest, Unicorn, and jsx-a11y plugins.

```json
{
  "plugins": ["typescript", "react", "import"],
  "categories": {
    "correctness": "error",
    "suspicious": "warn"
  },
  "rules": {
    "typescript/no-floating-promises": "error"
  }
}
```

This default supports incremental adoption: put high-confidence defects in fast CI before migrating every style preference. If the actual need is formatting, evaluate Oxfmt or Prettier. Linters and formatters enforce different contracts.

## How type-aware linting connects to TypeScript 7

Ordinary Oxlint rules execute in Rust. Type-dependent rules use `oxlint-tsgolint`, which creates programs with the Go implementation of TypeScript 7 and returns diagnostics to Oxlint. The current documentation reports support for 59 of 61 typescript-eslint type-aware rules. Install the additional package and enable `--type-aware`; the experimental `--type-check` can also include compiler diagnostics in the same command.

```bash
pnpm add -D oxlint oxlint-tsgolint
pnpm exec oxlint --type-aware
```

The mode has explicit costs. It resolves `tsconfig` files and dependency graphs, so it cannot match syntax-only lint speed. Monorepos may need dependent packages built first so their `.d.ts` files exist. It also requires TypeScript 7, which can force migration away from old compiler options. Do not apply syntax-only benchmark multipliers to type-aware CI.

## ESLint plugin compatibility is broad, not complete

Besides native plugins, Oxlint can load ESLint v9-compatible JavaScript plugins. The feature remains alpha. Most traversal, scope, fix, and selector APIs are implemented, but custom parsers, special file formats, and JavaScript plugins that require type information still have gaps. Vue, Svelte, and Astro support currently focuses on their `<script>` blocks; that does not make every template rule equivalent to a native framework plugin.

The safest migration is staged. Convert configuration with `@oxlint/migrate`, let Oxlint run rules it covers, and use `eslint-plugin-oxlint` to disable duplicates in ESLint. Keep remaining plugins in ESLint until coverage and behavior have been verified.

## When to switch—and when to stay

Oxlint has a clear payoff in large monorepos where linting is a CI bottleneck and most rules come from mainstream plugins. New projects can also start with correctness-first rules without a large ESLint dependency tree. Repositories that rely on custom parsers, processors, framework-template rules, or obscure plugins have good reasons to keep ESLint.

The AI-era criterion is feedback latency. `oxlint path/to/file.ts` is fast enough for an agent's post-edit loop. Yet if rule semantics or autofixes diverge from the repository contract, speed only accelerates the wrong outcome. Run it in shadow mode first and compare diagnostics, false positives, omissions, and fix diffs before handing it the quality gate.

## References

- [Oxlint overview](https://oxc.rs/docs/guide/usage/linter.html)
- [Oxlint type-aware linting](https://oxc.rs/docs/guide/usage/linter/type-aware.html)
- [Oxlint built-in plugins](https://oxc.rs/docs/guide/usage/linter/plugins.html)
- [Oxlint JavaScript plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins.html)

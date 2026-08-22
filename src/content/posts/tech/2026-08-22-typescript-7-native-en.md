---
title: "TypeScript 7: A Native Go Rewrite Makes Type Checking Fast, but Migration Goes Beyond tsc"
date: 2026-08-22
category: tech
type: deep-dive
tags: [typescript, typescript-7, compiler, go, type-safety, developer-tools]
lang: en
tldr: "TypeScript 7 rewrites the compiler and language service in Go. The order-of-magnitude gains come from native execution and shared-memory parallelism, while old APIs and compiler options define the migration cost."
description: "TypeScript 7's native compiler architecture, performance and compatibility boundaries, and a dual-run migration strategy from TypeScript 6."
series:
  name: "AI 時代的技術選擇"
  order: 24
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-typescript-7-native)

[TypeScript 7](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) is not a native addon for a few hot paths. The compiler, project system, and language service have been reimplemented in Go. The TypeScript team reports improvements around an order of magnitude; Slack's published example reduced CI type checking from roughly 7.5 minutes to 1.25 minutes. Those numbers cannot be copied to every repository, but they show that this release addresses an architectural bottleneck rather than a minor optimization.

## Why leave self-hosted TypeScript?

Through TypeScript 6, the compiler was written in TypeScript, compiled to JavaScript, and executed by Node.js. Self-hosting was productive for the language team and made compiler APIs directly available to npm tools. At monorepo scale, however, parsing, binding, checking, project loading, and editor queries encounter JavaScript runtime and single-thread limitations.

The Go implementation can use shared memory and parallel work without serializing compiler data between workers. Faster command-line checks are only one side of the result. Project loading, references, rename, and first-error reporting in the language service share the new foundation. Official telemetry reports over 80% fewer failed language-server commands and over 60% fewer crashes than TypeScript 6.

## Type semantics continue; tooling APIs may not

The rewrite aims to preserve the TypeScript language and type-checking behavior, not compatibility with every JavaScript compiler API. TypeScript 7.0 has no programmatic API at all; the team expects 7.1 to introduce a new API. Applications that only call `tsc` often have a direct migration. Tools that import `typescript`, provide language-service plugins, use custom transformers, manipulate ASTs, or wrap builds carry more risk.

This also leaves embedded-language workflows for Vue, Svelte, Astro, MDX, and Angular templates largely dependent on TypeScript 6 at the 7.0 release. A successful command-line compiler upgrade does not prove that framework language tooling is ready; validate the two paths separately.

TypeScript 7 also removes compiler options deprecated in TypeScript 6. Projects that remain on legacy module resolution, depend on old `baseUrl` behavior, or target obsolete output need to follow migration diagnostics first. Do not suppress every difference with `skipLibCheck`; that also hides real declaration incompatibilities.

```bash
pnpm add -D typescript@^7
pnpm exec tsc --noEmit
```

The stable release is in the standard `typescript` package. The old `@typescript/native-preview` package is no longer the installation path for new projects. If a tool remains incompatible, npm aliases can temporarily keep TypeScript 6 for that tool while TypeScript 7 performs the primary check.

## Dual-run migration finds semantic differences, not only speed

First, preserve a clean TypeScript 6 baseline: diagnostics, emitted files, declarations, and elapsed time. Next, run TypeScript 7 on the same commit and compare diagnostics that appeared or disappeared. Only then measure cold runs, warm runs, CI, and editor project loading so cache and machine differences do not masquerade as compiler gains.

For libraries, `.d.ts` diffs matter more than JavaScript output. For monorepos, project references and incremental builds are the primary path. Applications still need a bundler run after `--noEmit`, because TypeScript does not validate every runtime module-resolution behavior.

```json
{
  "devDependencies": {
    "@typescript/native": "npm:typescript@^7.0.0",
    "typescript": "npm:@typescript/typescript6@^6.0.0"
  }
}
```

Coexistence is a transition, not a permanent architecture. It can give editors, CI, framework plugins, and developers different compilers. Without explicit command names and a removal deadline, type errors become difficult to reproduce.

## Relationship to Oxc, SWC, and bundlers

TypeScript 7 remains the authoritative TypeScript semantic implementation for type checking, declaration emission, and editor intelligence. Oxc, SWC, esbuild, and Rolldown can remove type syntax, transform JSX, bundle, and minify quickly, but generally do not perform complete type checking. They are complementary: the bundler creates artifacts while `tsc --noEmit` enforces the type contract.

Oxlint's type-aware mode directly uses typescript-go, showing how the compiler can become infrastructure for other tools. As more consumers share it, upgrades must account for each consumer's supported TypeScript version rather than only the repository's `typescript` dependency.

## What changes in the AI era

Types have always protected human developers. For coding agents, diagnostics are also an immediate, structured, self-correctable feedback channel. Moving a large repository's type check from minutes toward seconds lets it leave the end-of-PR gate and enter the post-edit inner loop. The agent can repair a defect before its working context drifts.

Speed cannot replace type quality. A codebase full of `any`, assertions, or `@ts-ignore` merely lets a faster compiler approve a hollowed-out contract sooner. TypeScript 7 pays off when the repository also controls those escape hatches, preserves declarations and runtime tests, and exposes one reproducible type-check command to local development and CI.

## References

- [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- [A 10x Faster TypeScript](https://devblogs.microsoft.com/typescript/typescript-native-port/)
- [TypeScript 7 migration guide](https://github.com/microsoft/typescript-go/blob/main/_packages/typescript-go/MIGRATION.md)

---
title: "Vitest: Share Vite Configuration Without Mistaking Component Tests for E2E"
date: 2026-08-22
category: tech
type: deep-dive
tags: [vitest, vite, testing, typescript, browser-testing, frontend]
lang: en
tldr: "Vitest's advantage is not merely a familiar Jest-style API. Tests share Vite transforms, aliases, and plugins with the application; Browser Mode adds real-browser confidence but does not replace full E2E testing."
description: "Vitest's Vite-native design, mocking and coverage, the boundary of Browser Mode, and how to choose between Vitest, Jest, and Playwright."
series:
  name: "AI 時代的技術選擇"
  order: 22
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-vitest-testing-framework)

[Vitest](https://vitest.dev/guide/) is a JavaScript and TypeScript test framework built on Vite. It offers familiar `describe`, `test`, `expect`, and mocking APIs, but resembling Jest is not the core value. Tests read `vite.config.*` by default and reuse aliases, transforms, and framework plugins. The test runner interprets source code much like the application does, removing a parallel configuration surface.

## Vite-native testing addresses configuration drift

Frontend tests often waste time because a runner does not understand the application's module aliases, CSS modules, JSX transforms, or virtual modules. Teams recreate the bundler world in Jest configuration, then let the two configurations diverge during upgrades.

Vitest brings Vite's module graph and transform pipeline into testing. Watch mode reruns tests affected by a change, while projects can separate Node, simulated DOM, and Browser Mode suites. This matters for coding agents: fast and deterministic red/green feedback often constrains a change more effectively than another paragraph of instructions.

```ts
import { describe, expect, test } from "vitest";
import { total } from "./price";

describe("total", () => {
  test("adds tax after subtotal", () => {
    expect(total(100, 0.05)).toBe(105);
  });
});
```

CI should use `vitest run` rather than interactive watch mode. Coverage supports V8 and Istanbul providers. Choose based on instrumentation compatibility and reporting needs, and do not treat a coverage percentage as evidence of behavioral correctness.

## Mocking is convenient—and an easy way to test a fake system

Vitest supports function, timer, module, and global mocks. Its Jest-like API makes migration approachable, but ESM module mocks are hoisted and factory timing differs from ordinary function calls. A test that mocks the database, network, clock, router, and framework runtime may prove only that its mocks agree.

A more reliable split keeps pure logic in Node tests, browser-dependent interactions in Browser Mode or a minimal DOM simulation, and cross-page flows in Playwright. Mock only genuinely uncontrollable boundaries and preserve at least one integration path without the mock.

## Browser Mode is component testing, not an E2E replacement

[Vitest Browser Mode](https://vitest.dev/guide/browser/) runs tests in real browsers through a Playwright or WebdriverIO provider. It catches false positives caused by incomplete jsdom or happy-dom simulations, including differences in focus, native events, and browser APIs. Tests still use the Vitest runner, mocking, and coverage, making the mode a good fit for components and browser-dependent modules.

The documentation explicitly says Browser Mode is not a drop-in replacement for a standalone E2E runner. Browser startup costs more, and the unit under test is still usually a component or module. Authentication, navigation, backend integration, multiple tabs, and production deployments belong in Playwright, Cypress, or WebdriverIO end-to-end tests.

## Dividing work among Jest, node:test, and Playwright

A backend with a large Jest suite, custom transformers, and established snapshot workflows may be cheaper to leave in place. A pure Node library that needs only basic assertions and mocks can reduce dependencies with `node:test`. A Vite application or alias-heavy monorepo usually gets the lowest-friction default from Vitest. Playwright validates browser user journeys and is complementary rather than a direct competitor.

An actionable testing pyramid is: many domain rules in Vitest's Node environment, critical components in Browser Mode, and a small number of revenue or authorization paths in Playwright E2E. Give each layer an explicit failure class to catch; otherwise you can end up with three slow suites and no production confidence.

## The AI-era criterion

Vitest helps agents in two ways. Its adoption and Jest-compatible vocabulary make usable examples common, while `vitest run path/to/file` creates a cheap local verification loop. Agents are also prone to over-mocking, snapshot overuse, and tests coupled to the implementation they just produced.

Do not choose Vitest merely because an agent can write it. Check whether the repository exposes a stable command, test names describe behavior, failures locate the defect, and Browser Mode/E2E boundaries are explicit. The framework supplies a loop; the test contract determines whether that loop converges.

## References

- [Vitest getting started](https://vitest.dev/guide/)
- [Vitest 4 announcement](https://vitest.dev/blog/vitest-4)
- [Why Browser Mode](https://vitest.dev/guide/browser/why)

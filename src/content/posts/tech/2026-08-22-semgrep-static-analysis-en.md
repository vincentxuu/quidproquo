---
title: "Semgrep: Encoding Security Policy as Readable, Tested Static Analysis"
date: 2026-08-22
category: tech
type: deep-dive
tags: [semgrep, sast, appsec, static-analysis, security]
lang: en
tldr: "Semgrep lets teams express SAST policy with source-like patterns and taint rules; rule quality depends on positive and negative tests, framework modeling, and exception lifecycle."
description: "Semgrep pattern rules, metavariables, taint mode, SAST, SCA, secrets, diff-aware CI, custom rules, nosemgrep, and rollout."
series:
  name: "AI 時代的技術選擇"
  order: 113
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-semgrep-static-analysis)

[Semgrep](https://semgrep.dev/docs/) makes static-analysis rules resemble target-language source. Simple patterns ban dangerous APIs, missing arguments, or organization-specific usage. Metavariables and semantic matching tolerate naming and some syntax differences. Taint mode describes untrusted sources flowing through propagators to dangerous sinks, optionally through sanitizers.

```yaml
rules:
  - id: no-shell-user-input
    languages: [javascript]
    message: User input reaches shell execution
    severity: ERROR
    mode: taint
    pattern-sources:
      - pattern: req.$ANY
    pattern-sinks:
      - pattern: exec($CMD, ...)
```

## Rules are code and need tests and review

Give every custom rule positive fixtures that must match and negative fixtures that must not, pin the engine version, and run `semgrep --test` in CI. Update models when framework wrappers, sanitizers, ORM helpers, and internal abstractions change. A copied incident snippet alone usually produces a brittle pattern.

Semgrep CE runs community and custom rules locally or in CI. The commercial platform combines Code, Supply Chain, and Secrets, with interprocedural analysis, reachability, triage, and data handling varying by edition and configuration. Benchmark the actual engines against project languages, frameworks, and known vulnerabilities rather than extrapolating from the product name.

## Diff-aware gates and full scans serve different cadences

PR scans make new findings immediately ownable. Default-branch and scheduled full scans uncover old code after framework models or rulesets improve. Begin blocking with high-signal rules. Require justification, owner, and expiry for `nosemgrep` and platform ignores or exceptions become permanent blind spots.

Revoke and rotate exposed secrets immediately; rewriting Git history only reduces later exposure. Confirm dependency reachability and fixes for SCA, and trace sources, sinks, and exploit preconditions for SAST. Semgrep quickly automates incident lessons and coding policy. CodeQL supports deeper semantic queries, Snyk provides broader governance, and gitleaks specializes in secrets and history. Deduplicate overlapping tools and name an authoritative source for each finding class.

## References

- [Semgrep documentation](https://semgrep.dev/docs/)
- [Writing Semgrep rules](https://semgrep.dev/docs/writing-rules/overview)
- [Taint mode](https://semgrep.dev/docs/writing-rules/data-flow/taint-mode/overview)
- [Testing rules](https://semgrep.dev/docs/writing-rules/testing-rules)
- [Semgrep CI](https://semgrep.dev/docs/semgrep-ci/overview)
- [Sample CI configurations](https://semgrep.dev/docs/semgrep-ci/sample-ci-configs)

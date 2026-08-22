---
title: "CodeQL: Extracting a Codebase into a Database and Querying Data Flow"
date: 2026-08-22
category: tech
type: deep-dive
tags: [codeql, sast, github, static-analysis, security]
lang: en
tldr: "CodeQL builds a code database with language extractors, then queries syntax, types, calls, control flow, and data flow; its depth depends on models and carries extraction and query-maintenance costs."
description: "CodeQL databases, extractors, query suites, path queries, taint tracking, custom packs, SARIF, GitHub code scanning, and CI boundaries."
series:
  name: "AI 時代的技術選擇"
  order: 114
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-codeql-semantic-code-analysis)

[CodeQL](https://codeql.github.com/docs/) treats source code as queryable data. Language extractors build a database of syntax, types, calls, control flow, and data-flow facts during source extraction or compilation. QL queries then find vulnerabilities, correctness bugs, and organization-specific patterns. Results can be emitted as SARIF for GitHub code scanning.

## Database quality bounds what queries can see

Compiled languages usually need the correct build command, generated source, flags, and dependencies. Autobuild is convenient but can extract only part of a monorepo or custom build. Dynamic-language scans still need correct roots and generated or vendored exclusions. Monitor extraction logs, file counts, and language coverage rather than trusting a green workflow alone.

The built-in `default` suite favors precision; `security-extended` broadens coverage and may add findings. Query metadata defines IDs, kinds, severity, and precision, while path queries display source-to-sink flow. Normal data flow tracks preserved values; taint tracking models transformations that remain influenced by untrusted data. Global analysis is deeper and costlier and depends on precise source, sink, and framework models.

## Custom queries are maintained security code

Custom queries encode internal frameworks, incidents, and prohibited credential flows. Package them in versioned CodeQL packs with tests, help, owners, and changelogs. Library changes can alter data-flow models, so benchmark known vulnerable and clean fixtures for precision and recall. An ad-hoc threat-hunting query is not automatically a continuous gate.

GitHub default and advanced setup, the CLI, and external CI have different operations. CLI pipelines create databases, analyze them into SARIF, and upload results. Pin CLI and query-pack versions, restrict Actions permissions and upload tokens, and distinguish PR findings from default-branch full analysis. Availability and licensing differ for public repositories and GitHub Code Security plans.

CodeQL fits deep semantic and data-flow analysis on supported languages and security research. Semgrep is easier for syntax and policy rules; Snyk spans SCA, containers, and IaC; zizmor specializes in GitHub Actions. No scanner proves safety: connect findings to exploitability, tests, fixes, and regression queries.

## References

- [CodeQL documentation](https://codeql.github.com/docs/)
- [CodeQL CLI](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-cli)
- [CodeQL queries](https://docs.github.com/en/code-security/reference/code-scanning/codeql/codeql-queries)
- [About CodeQL queries](https://codeql.github.com/docs/writing-codeql-queries/about-codeql-queries/)
- [Data flow analysis](https://codeql.github.com/docs/writing-codeql-queries/about-data-flow-analysis/)
- [Custom CodeQL queries](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/custom-queries)

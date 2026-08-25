---
title: "Promptfoo Red Team: Turning Prompt Injection, Tool Misuse, and Data Leaks into Regression Tests"
date: 2026-08-22
category: tech
type: deep-dive
tags: [promptfoo, red-team, ai-security, prompt-injection, evaluation]
lang: en
tldr: "Promptfoo plugins generate risk probes, strategies transform attacks, targets execute the system, and graders judge outcomes; useful red teams exercise the full agent application rather than only a foundation model."
description: "Promptfoo red-team plugins, strategies, targets, graders, agent, RAG and MCP testing, remote generation, CI baselines, false positives, and secure data handling."
series:
  name: "Technology Choices in the AI Era"
  order: 120
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-promptfoo-ai-red-teaming)

[Promptfoo red teaming](https://www.promptfoo.dev/docs/red-team/quickstart/) divides generative-AI attack testing into plugins that define weaknesses, strategies that package and refine payloads, targets that execute models or applications, and graders that judge policy violations. This article focuses on security; the existing general Promptfoo evaluation article covers broader prompt and model comparison.

## Plugins should match real attack surfaces

A foundation model alone does not have BOLA, SQL injection, or SSRF. Those risks appear when applications add identities, retrieval, databases, browsers, MCP, and tools. Map data and tool trust boundaries before selecting injection, cross-session leakage, excessive agency, RAG poisoning, tool poisoning, SSRF, and BOLA plugins. Enabling everything creates inference cost and untriageable noise.

Strategies range from base64 and jailbreak templates to iterative attacker models, multi-turn coercion, and indirect web injection. Dynamic and multi-turn attacks are stronger but nondeterministic, expensive, and rate-limited. Pin configuration and model versions, set seeds where supported, cap attempts and tokens, and preserve transcripts, tool calls, and grader evidence.

## Targets must include authorization and side effects

Testing only a system prompt misses retrieval ACLs, argument validation, tenant isolation, and sandbox egress. Use staging with synthetic identities and data, mock or reversible tools, and minimal credentials. Red-team suites must never trigger real sends, deletes, or payments. Coding-agent tests should inspect protected-file hashes, filesystem diffs, commands, network activity, and verifier evidence.

Attack generation and grading providers are separate from targets. Some community plugins may use remote generation. Determine whether system prompts, policies, transcripts, or customer data leave the environment, configure a private provider, or disable remote generation. A locally running scanner does not imply every inference is local.

## Pass rate is not a security score

LLM graders have false positives and negatives; calibrate against human-labeled cases. Turn each confirmed exploit into a deterministic regression. Run a cheap, high-signal subset on PRs, dynamic and multi-turn attacks nightly, and human attacks before releases. Gate known critical regressions rather than every small random pass-rate change.

Promptfoo discovers attack paths, Model Armor filters runtime content, and sandboxing plus authorization cap impact. After a fix, identify whether the control belongs in prompts, retrieval, tool schemas, permissions, confirmation, network policy, or output filters, then replay the original attack.

## References

- [Promptfoo red-team quickstart](https://www.promptfoo.dev/docs/red-team/quickstart/)
- [Red-team architecture](https://www.promptfoo.dev/docs/red-team/architecture/)
- [Red-team configuration](https://www.promptfoo.dev/docs/red-team/configuration/)
- [Plugins](https://www.promptfoo.dev/docs/red-team/plugins/)
- [Strategies](https://www.promptfoo.dev/docs/red-team/strategies/)
- [Agent and RAG red-team guides](https://www.promptfoo.dev/docs/red-team/guides/)
- [Coding-agent plugins](https://www.promptfoo.dev/docs/red-team/plugins/coding-agent/)

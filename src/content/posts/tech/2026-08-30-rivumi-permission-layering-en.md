---
title: "Rivumi permission layering: how dangerous commands become allow, ask, or deny"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, permissions, command-policy, security]
lang: en
tldr: "Rivumi applies a non-bypassable critical floor, evaluates user, organization, and project denies before any allows, and keeps execute operations policy-gated even in dangerous mode. This decides authority; it is not an OS sandbox."
description: "Explain Rivumi permission source merging, critical and suspicious command classification, session approvals, and dangerous-mode boundaries."
series:
  name: "Rivumi Architecture Notes"
  order: 9
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-rivumi-permission-layering)

The [tool-executor article](/posts/tech/2026-08-23-rivumi-tool-isolation-en) covered mechanical path, argv, environment, and timeout limits. This is one coding-agent security boundary; permission policy answers a different question: who authorizes a schema-valid operation?

## Denies win across all sources

Rivumi merges permission sources in a fixed order:

```text
critical command floor
user deny → organization deny → project deny
user allow → organization allow → project allow
otherwise follow approval mode
```

A project allow does not override a user deny. All deny rules are evaluated before all allow rules; source ordering primarily preserves diagnostic provenance. Rules can target a tool, a prefix under a tool, or an exact value, and malformed rules are rejected.

## Execute requests receive command classification

`classify_command_policy()` denies blank commands, denies critical patterns, asks for suspicious patterns, and denies suspicious commands paired with an excessive timeout. Other commands may proceed. The critical floor runs before reused session grants or an interactive prompt.

This is a bounded lexical classifier, not a complete shell parser. It handles known high-risk shapes but cannot prove arbitrary shell composition safe. Native `run_check` also has a separate exact-argv allowlist.

## Approvals have explicit lifetime

An approval request represents exactly one tool call or command. Decisions are allow once, allow for session, deny, or cancel. Session grants remain scoped to the current session, and an interrupted approval is abandoned and fails closed. Headless execution must resolve policy without pretending an interactive user approved it.

Dangerous mode auto-allows read and modify effects only. Execute still passes through classification, rules, and approval mode; dangerous root execution is refused without a sandbox. The result is an authority decision, not filesystem, process, or network containment. That enforcement belongs to the [local OS sandbox layer](/posts/tech/2026-08-30-rivumi-local-os-sandbox-en).

---

## References

- [Permission policy source](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/permissions.py)
- [Approval contracts](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/approvals.py)
- [Permission tests](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_permissions.py)
- [Approval tests](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_approvals.py)

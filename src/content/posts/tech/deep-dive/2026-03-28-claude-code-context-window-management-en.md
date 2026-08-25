---
title: "Claude Code Context Window Management: Understanding AI's Memory Limits"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, context-window, optimization, token, dx]
lang: en
tldr: "Each Claude Code feature consumes context differently: the root CLAUDE.md is present on every request (nested ones load on demand), Skills load only their descriptions, MCP only loads tool names, and Sub-agents are fully isolated. Understanding these differences is key to managing your context window and preventing erratic AI behavior."
description: "A guide to Claude Code's context window management: when each feature loads and how much context it costs, the auto-compaction mechanism, symptoms and remedies when context fills up, and optimization strategies for CLAUDE.md, Skills, MCP, Sub-agents, and Hooks."
draft: false
series:
  name: "Claude Code Automation Guide"
  order: 23
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management)

<!-- TODO: Content pending -->
<!-- Reference: https://code.claude.com/docs/en/context-window.md -->
<!-- Reference: https://code.claude.com/docs/en/features-overview.md -->

## Planned Outline

### What Is a Context Window
- The total amount of information Claude can "see" in a single request
- Token limits: the ceiling for all input + output combined
- Why understanding context management matters

### Context Costs by Feature

| Feature | When Loaded | What's Loaded | Context Cost |
|---------|-------------|---------------|--------------|
| CLAUDE.md | Session start | Full content of root and ancestor files | Present on every request; nested CLAUDE.md files load only when Claude reads files in that directory |
| Skills | Session start + invocation | Description (start) → full content (invocation) | Low (description always present) |
| MCP servers | Session start | Tool names only (full schemas stay deferred and load via tool search when needed) | Low, until a tool is used |
| Sub-agents | On launch | Fresh context | Fully isolated from main conversation |
| Hooks | On trigger | Nothing (external execution) | Zero (unverified: not stated in official docs; hook stdout injected into context still costs tokens) |

### CLAUDE.md Context Strategy
- Keep it under 200 lines (official recommendation; the hard limit is 4 MiB, beyond which the file is skipped)
- Move reference material to Skills
- Split rules using `.claude/rules/`
- Path-scoped rules in `.claude/rules/` load only when Claude reads files matching the pattern, not on every tool use

### Skills Context Optimization
- `disable-model-invocation: true`: hidden until manually invoked (unverified: the official skills docs say frontmatter controls who invokes a skill but do not list this field name)
- Precise descriptions help Claude delegate correctly
- Avoid overlapping descriptions across multiple skills

### Sub-agents to Protect Context
- Offload high-output operations to sub-agents
- Running tests, fetching docs, processing logs → let sub-agents handle it, return only a summary
- Agent Teams go further: each teammate has a fully independent context

### Auto-compaction Mechanism
- Automatically triggers compression as context nears its limit (unverified: the 95% threshold and `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` were not found in official docs)
- Sub-agents also support auto-compaction

### Symptoms of a Full Context
- Claude forgets earlier instructions
- Skills fail to trigger correctly
- Degraded response quality
- Remedies: start a new session, use sub-agents, trim CLAUDE.md

## Changelog

- 2026-08-22: Verified outline claims against official docs — CLAUDE.md limit corrected to 4 MiB, added on-demand loading of nested CLAUDE.md and path-scoped rules, noted deferred MCP schemas; unverified claims marked as such

## References

- [Manage costs effectively](https://code.claude.com/docs/en/costs) — official guidance to keep CLAUDE.md under 200 lines and move specialized instructions into skills

- [Explore the Context Window](https://docs.anthropic.com/en/docs/claude-code/context-window) — Anthropic's official interactive context simulator, visually showing token consumption per feature across a session
- [Claude Code Best Practices — Manage Context Aggressively](https://docs.anthropic.com/en/docs/claude-code/best-practices#manage-context-aggressively) — Official context management best practices, including `/compact`, `/clear`, and subagent usage strategies
- [Store Instructions and Memories](https://docs.anthropic.com/en/docs/claude-code/memory) — Tips on trimming CLAUDE.md and the auto-memory mechanism to reduce context footprint at session start
- [Claude API — Token Billing](https://docs.anthropic.com/en/docs/about-claude/models/overview) — Context window sizes and billing details for Claude models
- [Extend Claude Code](https://docs.anthropic.com/en/docs/claude-code/extend-claude-code) — Comparison of context costs for Skills vs MCP vs Hooks, with a decision guide
- [Claude Code Subagents](https://docs.anthropic.com/en/docs/claude-code/sub-agents) — How subagents work and how their isolated context windows protect the main conversation
- [Claude Code Common Workflows — Use Subagents for Investigation](https://docs.anthropic.com/en/docs/claude-code/common-workflows#use-subagents-for-investigation) — Official examples of using subagents for codebase exploration without polluting the main context

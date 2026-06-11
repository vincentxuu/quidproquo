---
title: "Claude Octopus: The Consensus Plugin That Hooks 8 Models Into Claude Code Simultaneously"
date: 2026-04-14
type: guide
category: ai
tags: [claude-code, plugin, octopus, multi-model, consensus, orchestration, dark-factory]
lang: en
tldr: "Claude Octopus is a Claude Code plugin that simultaneously calls Codex, Gemini, Copilot, Qwen, Ollama, Perplexity, OpenRouter, and Claude to review the same code, using a 75% consensus threshold to catch single-model blind spots. It ships with 32 personas, 48 /octo:* slash commands, 51 skills, and a Dark Factory fully autonomous spec-to-code pipeline."
description: "A deep dive into the claude-octopus plugin for Claude Code: multi-model consensus architecture, Double Diamond four-phase workflow, 32 personas, Dark Factory autonomous mode, and how it compares to single-model workflows."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-14-claude-octopus-plugin-intro)

Every single model has blind spots — anyone who has used agentic coding agrees. Claude Octopus is a Claude Code plugin by `nyldn`, and the core idea is straightforward: **hook up to 8 models on the same task simultaneously, have them cross-review each other, and block anything they disagree on**. This article covers its architecture, commands, persona system, and how it differs from other Claude Code enhancement layers (such as oh-my-claudecode).

## Positioning: Not Another Agent, but a Consensus Gate Layer

Octopus is a plugin inside Claude Code — not a fork and not a wrapper. It only occupies the `/octo:*` namespace and the natural language prefix `octo`, leaving all other Claude Code behavior untouched. This design matters — you can install it to try it out, and if you don't like it, a single command cleanly uninstalls everything with no leftover configuration.

The problem it solves isn't "automatically write more code," but rather "before you ship, let 7 other models roast it first." Octopus treats the **consensus gate** as its first principle: by default, 75% of providers must agree before work can pass the gate; otherwise the entire pipeline stops for human review.

## Eight Tentacles: Multi-Provider Collaboration

Eight provider types are supported by default, each with a different role:

| Provider | Role | Authentication | Cost |
|---|---|---|---|
| Claude | Orchestration, synthesis | Built into Claude Code | Per Claude subscription |
| Codex (OpenAI) | Implementation, deep code pattern analysis | `codex login` or `OPENAI_API_KEY` | OAuth free or per-token |
| Gemini (Google) | Ecosystem breadth, security review | Google OAuth or `GEMINI_API_KEY` | OAuth free or per-token |
| Copilot (GitHub) | Zero-cost research legwork | Uses existing GitHub subscription | Free |
| Qwen (Alibaba) | Research tier | Qwen OAuth | 1,000–2,000 free calls per day |
| Ollama | Local, offline, privacy-sensitive tasks | Local installation | Free |
| Perplexity | Live web search, CVE lookups | API key | Per API usage |
| OpenRouter | 100+ model routing | API key | Per model |

The key point is that **it runs with zero providers too** — with only Claude available, Octopus degrades to a single-model harness with personas and slash commands. Each additional provider is auto-detected and enabled without manual pipeline configuration.

## Double Diamond: Four Phases

Octopus brings the UK Design Council's Double Diamond methodology directly to coding agents, split into four phases:

| Phase | Command | What It Does |
|---|---|---|
| Discover | `/octo:discover` | Multi-AI research, explore the problem space |
| Define | `/octo:define` | Use consensus to clarify requirements, write specs |
| Develop | `/octo:develop` | Begin implementation with quality gates |
| Deliver | `/octo:deliver` | Adversarial review + go/no-go scoring |

You can call any phase individually, or run `/octo:embrace` to execute the entire pipeline end to end. Compared to "just toss a prompt at Claude and have it write code," the key difference is that **the definition phase lets multiple models argue first** — get the spec right before moving to develop, eliminating 80% of "built the wrong thing because we misunderstood requirements."

## Eight Primary Commands (Core Tentacles)

```bash
/octo:embrace       # Full lifecycle: research → define → develop → deliver
/octo:factory       # Autonomous spec-to-software (Dark Factory)
/octo:debate        # 4-AI structured debate + consensus
/octo:research      # 3-provider multi-source synthesis
/octo:design        # UI/UX design (with BM25 retrieval)
/octo:tdd           # Red-green-refactor discipline
/octo:security      # OWASP vulnerability scan + remediation
/octo:prd           # AI-optimized product requirements document
```

Together with extended commands like `review / debug / extract / docs / schedule / parallel / sentinel / optimize / brainstorm / doctor / quick`, the plugin offers **48 slash commands** in total. For the lazy, there's a smart router:

```bash
/octo:auto <description>
```

It parses your natural language intent and selects the appropriate workflow automatically.

## 32 Personas: Context-Aware Agents

Octopus comes with 32 pre-defined specialized roles, automatically applied based on the request:

- **Software Engineering (11)**: backend-architect, frontend-architect, fullstack-engineer, devops-engineer, security-auditor, performance-optimizer, testing-strategist, database-specialist, api-designer, integration-engineer, systems-engineer
- **Specialized Development (6)**: mobile-engineer, ml-engineer, data-engineer, blockchain-engineer, iot-engineer, game-developer
- **Documentation / Communication (5)**: technical-writer, product-manager, business-analyst, ux-writer, content-strategist
- **Research / Strategy (3)**: researcher, strategist, analyst
- **Business / Compliance (3)**: compliance-officer, financial-analyst, legal-advisor
- **Creative / Design (4)**: ui-ux-designer, graphic-designer, creative-director, brand-strategist

A request like "review this API" might simultaneously trigger `api-designer` + `security-auditor` + `performance-optimizer`, each persona using a different provider to produce a review, with the final results converging at the consensus gate.

## Dark Factory: Give It a Spec and Walk Away

Dark Factory is the most aggressive mode — feed it a spec, and Octopus fully autonomously runs through Discover, Define, Develop, and Deliver without asking a human:

```bash
/octo:factory "build a CLI that converts CSV to JSON"
```

There are three autonomy levels:

- **Supervised**: Every phase requires human approval
- **Semi-autonomous**: Human intervention only on failure
- **Autonomous**: Runs to completion before reporting back

Combined with git worktree for workstream isolation, multiple parallel tasks can run in separate branches, with automatic merging and conflict resolution at the end.

## Reaction Engine: Auto-Responding to Lifecycle Events

This is what I consider the most "team-aware" design. The Reaction Engine monitors CI, review, and PR state changes and responds automatically:

| Event | Action | Max Retries | Escalation |
|---|---|---|---|
| CI failure | Collect logs, send to agent inbox | 3 | Escalate to human after 30 min |
| Changes requested | Collect review comments, send to inbox | 2 | Escalate to human after 60 min |
| Agent stuck | Escalate to human | — | After 15 min |
| PR approved + CI green | Notify ready-to-merge | — | — |

Configuration lives in `.octo/reactions.conf` and can be customized per project. The philosophy is clear: **let the agent handle mechanical fix-retry loops, and only bother humans when it's genuinely stuck**.

## Installation

Claude Code (recommended):

```bash
/plugin marketplace add https://github.com/nyldn/claude-octopus.git
/plugin install octo@nyldn-plugins
/octo:setup
```

To uninstall cleanly:

```bash
claude plugin uninstall octo
# Or with scope
claude plugin uninstall octo --scope project
```

It also supports Codex CLI, Cursor (via MCP server), and OpenCode. For Cursor, add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "claude-octopus": {
      "command": "npx",
      "args": ["tsx", "${userHome}/.cursor/claude-octopus/mcp-server/src/index.ts"],
      "env": {
        "OCTO_CLAW_ENABLED": "true",
        "OPENAI_API_KEY": "${env:OPENAI_API_KEY}",
        "GEMINI_API_KEY": "${env:GEMINI_API_KEY}"
      }
    }
  }
}
```

## Comparison with Other Claude Code Enhancement Layers

| Aspect | Claude Octopus | oh-my-claudecode | Vanilla Claude Code |
|---|---|---|---|
| Core abstraction | Consensus gate + multi-provider | Multi-agent collaboration + magic keywords | Single agent CLI |
| Providers | Up to 8 (incl. Copilot, Qwen, Ollama) | Claude + Codex + Gemini | Claude only |
| Main selling point | Consensus catches blind spots, Dark Factory full automation | Cross-model token savings, auto rate-limit recovery | Simple, direct |
| Personas | 32 | 19 | None |
| Installation impact | Plugin namespace isolation | Enhancement layer | — |

In short: **Octopus cares about quality control, OMC cares about collaboration efficiency, and vanilla Claude Code cares about controllability**. If your pain point is "the model's output looks correct but blows up in production," Octopus's consensus gate is the most direct solution.

## When to Use It

- **Security-sensitive PRs**: `/octo:security` lets Gemini + Perplexity check CVEs while the security-auditor persona runs the OWASP checklist
- **New features with undefined requirements**: `/octo:embrace` starts from discover, letting multiple providers argue out the spec before anyone writes code
- **High-volume repetitive scaffolding**: `/octo:factory` in semi-autonomous mode — hand over a spec, come back to see the results
- **Hard to schedule multi-person reviews**: Reaction Engine + multi-provider review effectively gives you a built-in async review team

When it's not a good fit:

- **Simple one-shot small changes**: Consensus overhead isn't worth it — just use Claude Code directly
- **Fully offline**: Unless you're only using the Ollama provider, the consensus value is diminished
- **Extremely budget-sensitive**: Among the eight providers, Perplexity and OpenRouter charge per usage, and Codex/Gemini OAuth quotas have limits

## Overall

Claude Octopus turns "multi-model consensus" from a research topic into a Claude Code plugin you can install with a single command. 32 personas + 48 slash commands + 51 skills is not a small footprint, but the `/octo:*` namespace isolation makes it easier to install and remove than you'd expect. The most valuable design isn't the number of commands — it's **making the consensus threshold (75%) and reaction automation (CI/review closed loops) the defaults** — two things vanilla Claude Code currently doesn't have built in.

If you want to upgrade Claude Code from "single model writing code" to "multi-model cross-review with delivery gates," Octopus is currently the most complete turnkey solution.

## References

- [nyldn/claude-octopus — GitHub Repository](https://github.com/nyldn/claude-octopus)
- [claude-octopus README](https://github.com/nyldn/claude-octopus/blob/main/README.md)
- [Plugin Architecture — docs/PLUGIN-ARCHITECTURE.md](https://github.com/nyldn/claude-octopus/blob/main/docs/PLUGIN-ARCHITECTURE.md)
- [CHANGELOG](https://github.com/nyldn/claude-octopus/blob/main/CHANGELOG.md)
- [Claude Octopus Documentation (Mintlify)](https://nyldn-claude-octopus-64.mintlify.app/)
- [Claude Plugin Hub — octo](https://www.claudepluginhub.com/plugins/nyldn-claude-octopus)
- [aitmpl.com — Claude Octopus Plugin](https://www.aitmpl.com/plugins/claude-octopus)

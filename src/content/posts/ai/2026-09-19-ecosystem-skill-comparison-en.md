---
title: "【Ecosystem】How the Community Builds Deep Research Skills"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, open-source, ecosystem, comparison, hyperresearch, jamoeight]
lang: en
tldr: "10+ community deep-research skills represent 10+ philosophies of 'how to do research.' From hyperresearch's persistent vault to jamoeight v2's Co-Scientist 6-agent, from adversarial verification to benchmark alignment. This article puts them all on one table."
description: "A comprehensive comparison of 10+ community open-source deep-research skills: hyperresearch, hashbulla, jamoeight v2, Silence-view, Socialpranker. Analyzes common patterns (multi-agent, adversarial verification, persistent vault) and differentiated designs."
draft: false
series:
  name: "Deep Research 前沿"
  order: 14
---

> 🌏 [中文版](/posts/ai/2026-09-19-ecosystem-skill-comparison)

The previous article covered the project's own skill. This one covers **the community**.

From late 2025 to early 2026, the community flooded with 10+ deep-research skills. They represent not one solution, but 10+ philosophies of "how to do research."

## Community Landscape

### By Core Design

| Category | Representative | Core Idea |
|---|---|---|
| **Persistent Knowledge** | hyperresearch | SQLite index, knowledge accumulates across tasks |
| **Enterprise-grade** | hashbulla | NATO Admiralty grading, CRAG grounding |
| **SOTA Paper Implementation** | jamoeight v2 | Co-Scientist, AlphaEvolve, BrowseConf |
| **Adversarial Verification** | tolmachevmaxim | Optimist/Pessimist/Fact-Checker three agents |
| **Scaled** | kaynquang | 13 specialized agents |
| **Academic-focused** | Silence-view | STORM-inspired, citation chasing |
| **Platform-agnostic** | ramit-mitra | skills.sh compatible, 30+ platforms |
| **Universal Adapter** | Bhllcoder1 | 15 runtime adapters |
| **Data-driven** | Socialpranker | 75 report blocks, 280+ stat sources |
| **Engineer-oriented** | robertnowell | 6-phase, source quality gates |
| **Human-in-loop** | Weizhena | Human-in-the-loop, OpenCode/Codex |

### Detailed Comparison

#### hyperresearch (jordan-gibbs)

- **Core**: 16-step pipeline + persistent vault + MCP server + 16 agents
- **Unique**: "Patch, don't regenerate"—research knowledge accumulates to SQLite
- **Advantage**: Cross-task knowledge reuse
- **Cost**: Complex architecture, high maintenance

#### jamoeight/claude-code-deep-research-v2

- **Core**: Co-Scientist 6-agent + AlphaEvolve + BrowseConf + BATS
- **Unique**: v1→v2 upgraded with novel hypothesis generation and evaluator-driven search
- **Data**: +10.3pp on deep-research benchmarks
- **Advantage**: Latest SOTA paper implementation
- **Cost**: Depends on Claude Code ecosystem

#### hashbulla/deep-research

- **Core**: 7-phase + NATO Admiralty 2×6 grading + CRAG grounding loop
- **Unique**: Enterprise-grade grading system
- **Advantage**: Structured evaluation framework
- **Cost**: Heavy framework

#### tolmachevmaxim/deep-research-skill

- **Core**: 3 agents (Optimist/Pessimist/Fact-Checker)
- **Unique**: Adversarial verification—not self-verifying, but three roles debating
- **Advantage**: Concise and effective, file-based state
- **Cost**: Depends on model quality

## Common Architecture Patterns

Across all skills, these are **nearly universal**:

| Common Pattern | Description | Why Nearly Universal |
|---|---|---|
| **Multi-agent parallel research** | 2-13 agents researching simultaneously | Coverage breadth + speed |
| **Source credibility scoring** | Tier grading / 6 dimensions / NATO Admiralty | Filtering low-quality sources |
| **Adversarial verification** | Pessimist/Fact-Checker/Red-team | Preventing over-optimism |
| **Triangulation** | 3+ independent sources | Ensuring factual accuracy |
| **File-based intermediate state** | Crash recovery | Not losing progress on long tasks |
| **Multi-tier depth modes** | quick/standard/deep/ultradeep | Adapting to different needs |
| **Progressive Disclosure** | SKILL.md + references/ | Maintainability |

## Comparison with Project Skill

| Dimension | Project Skill | External Skills |
|---|---|---|
| **Tool Boundary** | Strictly Groundlane | Mostly Tavily/Exa/Brave/Serper |
| **Output Goal** | `.research/` → post skill publishing | Direct report output |
| **Academic Quality** | Has A/B/C/D grading | Some have (hashbulla, Silence-view) |
| **Adversarial Verification** | ❌ | ✅ Nearly all have it |
| **Persistent Knowledge** | ❌ | ✅ hyperresearch has it |
| **Benchmark Alignment** | ❌ | jamoeight v2 has BrowseConf |
| **Cross-platform** | ❌ Agent-environment only | ✅ skills.sh / Multi-runtime |

## Designs Worth Learning

1. **hyperresearch's persistent vault**—knowledge accumulates across tasks instead of starting from scratch each time
2. **tolmachevmaxim's three-agent adversarial**—simple but effective
3. **Socialpranker's 75 blocks**—breaking reports into manageable chunks
4. **robertnowell's source quality gates**—filtering low-quality sources before research starts

## Trends to Be Wary Of

1. **Skill explosion**—10+ skills represent methodology fragmentation
2. **Platform dependency**—most skills are tied to Claude Code or Codex
3. **Benchmark gaming**—some skills optimize for benchmark scores, not real research quality
4. **Complexity creep**—16 agents, 10 phases may be over-engineering

## References

- [hyperresearch (jordan-gibbs)](https://github.com/jordan-gibbs/hyperresearch) — 16-step pipeline + persistent vault.
- [jamoeight/claude-code-deep-research-v2](https://github.com/jamoeight/claude-code-deep-research-v2) — Co-Scientist + AlphaEvolve.
- [tolmachevmaxim/deep-research-skill](https://github.com/tolmachevmaxim/deep-research-skill) — Three-agent adversarial verification.
- [Socialpranker/deepdive](https://github.com/Socialpranker/deepdive) — 75 blocks methodology.
- [deep-research skill definition](/.agents/skills/deep-research/SKILL.md) — Project skill definition.
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — Previous article: three-phase landscape classification.

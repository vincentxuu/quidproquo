---
title: "【Project】How We Build the Deep Research Skill"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, skill, groundlane, project, architecture]
lang: en
tldr: "This is the project's own deep research skill design, fully disclosed. Core choices: only Groundlane MCP for web tools, strict source-quality grading (A/B/C/D), research hands off to post skill for publishing. Not the most powerful, but the best fit for us."
description: "A complete breakdown of the project's deep-research skill: Groundlane MCP tool boundaries, 7-step workflow, source-quality A/B/C/D grading, integration with post skill for publishing, and design trade-offs."
draft: false
series:
  name: "Deep Research 前沿"
  order: 13
---

> 🌏 [中文版](/posts/ai/2026-09-19-project-skill-deep-research)

The previous 12 articles covered other people's research. This one covers **ours**.

The project's `deep-research` skill has been iterated since March 2026. This article tears it open: design philosophy, architectural choices, tool boundaries, and why.

## Core Design Philosophy

### Tool Boundary: Strictly Groundlane Only

This is the most distinctive design choice in the project skill:

> **All public web research uses only Groundlane MCP** (`web_search` / `web_fetch` / `web_extract`). No Tavily, Exa, Firecrawl, Jina, or Linkup.

Why?

1. **Control**: Groundlane is a self-maintained MCP server—we control providers, rate-limiting, and authorization
2. **Consistency**: All research goes through the same pipeline, behavior is predictable
3. **Cost**: Self-hosted provider keys, no per-tool fees
4. **Auditable**: All requests through a single entry point, easy to debug

Groundlane itself:
- Author: vincentxuu
- Type: Vendor-neutral remote MCP server
- Providers: Tavily, Exa, Parallel, Browserbase, Brave, Firecrawl, SerpApi, Linkup, Serper, You.com
- Deployment: Cloudflare Workers + Containers

### Output Goal: Research Note → Post Publishing

Not all research gets published. The project skill distinguishes:

| Output | Storage | Purpose |
|---|---|---|
| Research note | `.research/<YYYY-MM-DD>-<slug>.md` | Working backup, not version-controlled |
| Published article | `src/content/posts/<category>/` | Final article |

Flow: deep-research → research note → post skill → bilingual article

This means the research phase doesn't pollute version control—only confirmed-to-publish articles go in.

## The 7-Step Workflow

```
0. Multi-case research (if topic is a series/comparison)
1. Decompose research sub-questions
2. Gather (≥2 sources per sub-question)
3. Catalog reading completeness
4. Cross-verify
5. Extract structure
6. Produce research note
7. Hand off (to post skill for publishing)
```

### Key Discipline

1. **Decompose before searching**—wrong questions are more expensive than wrong answers
2. **Bring full text of primary sources**—not just query results (queries return snippets)
3. **Cross-table only shows "what sources said"**—inference is labeled separately
4. **Numbers with conditions**—effect sizes without control conditions are unusable
5. **List conflicting facts**—don't pick sides

## Source Quality Grading

### General Source Tiers

| Tier | Definition | Examples |
|---|---|---|
| **A — Official Primary** | Published by creator/maintainer | Official docs, release notes, GitHub README |
| **B — First-hand Author** | Author's informal publications | Author's X/Mastodon, personal blog, talks |
| **C — High-quality Secondary** | Third-party with independent verification | HN top threads,知名 blog with testing |
| **D — Low-quality Secondary** | No independent verification | Medium reprints, SEO blogs, AI summary sites |

### Academic Paper Quality

**Hard indicators**: Conference tier (NeurIPS/ICLR/ACL), citation count, institutional prestige
**Soft indicators**: Real benchmarks run, reproducibility, cited by later work, survey's taxonomic insight

### Paper Quality Tiers

- **Tier A**: Tier-1 conference accepted, >200 citations with open-source code,知名 AI lab with experimental data
- **Tier B**: Tier-2 conference, >100 citations,知名 institutions
- **Tier C**: arXiv preprint, <50 citations

## Companion Skill Ecosystem

| Skill | Role |
|---|---|
| `deep-research` | Core research workflow |
| `research-selection` | Multi-case selection (population → coverage matrix → bias) |
| `post` | Publish after research (bilingual) |
| `post-review` | Pre-publishing self-review |
| `post-verify` | Fact-layer verification |
| `series-curriculum-design` | Series planning |

This ecosystem forms a pipeline: **research → selection → publishing → review → verification**.

## Design Trade-off Reflections

### Why No Adversarial Verification?

External skills (jamoeight v2, tolmachevmaxim) almost all have adversarial verification (Optimist/Pessimist/Fact-Checker). We don't.

Reasons:
- Adversarial verification needs multiple models, increasing cost
- Cross-verification (≥2 independent sources) is sufficient in most cases
- Adversarial verification suits "controversial claims" but deep research is more about "synthesis tasks"

### Why No Persistent Knowledge Base?

External skills (hyperresearch) have SQLite-indexed persistent research knowledge. We don't—each session is independent.

Reasons:
- Persistence requires storage management, increasing complexity
- Most project research is one-off tasks, no cross-task retrieval needed
- If needed later, `.research/` directory provides basic search

### Why Bind to Groundlane?

This is the most controversial design. External skills widely use Tavily, Exa, Serper etc.

Reasons covered above (control, consistency, cost, auditability). But the cost: if Groundlane breaks, the entire pipeline stalls.

## Improvement Directions

1. **Adversarial verification module**: Add Pessimist/Fact-Checker agents
2. **Persistent knowledge base**: `.research/source-registry.jsonl` for cross-task indexing
3. **MCP expansion**: Beyond Groundlane, add GitHub, arXiv, Hugging Face dedicated tools
4. **Automation**: Semi-automated from research note to post

## References

- [deep-research skill definition](/.agents/skills/deep-research/SKILL.md) — Project skill definition.
- [Groundlane GitHub](https://github.com/vincentxuu/groundlane) — Groundlane MCP server.
- [series-curriculum-design skill](/.agents/skills/series-curriculum-design/SKILL.md) — Series planning framework.
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — Previous article: three-phase landscape classification.

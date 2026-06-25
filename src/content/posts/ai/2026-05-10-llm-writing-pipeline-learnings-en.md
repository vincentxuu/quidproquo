---
title: "How Others Use LLMs to Write: Trade-off Notes from Karpathy's LLM-wiki to Multi-Agent Pipelines"
date: 2026-05-10
type: deep-dive
category: ai
tags: [llm-writing, content-pipeline, claude-code, agent-skills, llm-wiki, geo, multi-agent, harness-engineering]
lang: en
tldr: "A survey of 11 public LLM writing pipelines, distilled into three dominant patterns: multi-agent (researcher -> writer -> critic), Karpathy LLM-wiki (raw + wiki + LLM writes, humans don't), and quality guardrails (technical verifier + never fabricate + brief gate). The Princeton GEO paper (KDD 2024) quantifies the impact: inline citations +28%, adding statistics +33%, quoting source text +41%, keyword stuffing -9%."
description: "A review of 11 LLM writing pipelines including Karpathy's LLM-wiki, Paul Iusztin's Nova, Dheeraj Sharma's technical verifier, and xnor.ca's discipline, cross-referenced with quantitative findings from the Princeton GEO paper (arxiv 2311.09735)."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-10-llm-writing-pipeline-learnings)

Turning "research a new tool and write a guide" into a pipeline is nothing new, but implementation varies wildly. This time I studied 11 public LLM writing pipelines -- from Karpathy's personal wiki, Paul Iusztin's Nova, Dheeraj Sharma's technical verifier, to rzlt.io's 8-step commercial workflow. Three dominant design patterns emerge clearly, each backed by quantitative evidence.

## Pattern One: Multi-Agent (Researcher -> Writer -> Critic)

The most common design. From CrewAI, Google ADK, and Amazon Strands to quidproquo's own RAG chat graph, they all share this structure. Google calls it **Generator and Critic (editorial desk mode)** in their [Developer's guide to multi-agent patterns in ADK](https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/):

> One agent acts as the Generator, producing a draft, while a second agent acts as the Critic, reviewing it against specific, hard-coded criteria or logical checks.

Paul Iusztin developed this into two independent agents in [How I Automated 91% of My Business with AI Agents](https://www.decodingai.com/p/how-i-automated-91-percent-of-my-business): **Nova** (deep research) + **Brown** (writing workflow). Nova's design is worth borrowing:

- Users provide 5-10 "golden source seeds" first (instead of letting the agent search from scratch)
- Three rounds of gap analysis (Iusztin explicitly states "Three rounds hits the cost-versus-coverage sweet spot")
- Two-stage filtering: fetch full text for the top 5, keep only summaries for the rest, scored across four dimensions (trust / authority / relevance / quality)

quidproquo's RAG chat (the `planner -> research -> normalize -> writer -> critic -> related` graph in progress.txt) already follows this pattern, but **only on the reader side**. The writing side is currently manual and single-threaded (human approval before each step) -- this is intentional discipline. Automated generator-critic loops tend to drift in creative contexts; xnor.ca's lessons learned explain why.

## Pattern Two: Karpathy LLM-wiki

[Andrej Karpathy's gist from April 2026](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) has spawned over 100 derivative implementations. VentureBeat calls it the [autonomous archive pattern](https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an). The core has three layers:

```
┌──────────────────────────────────┐
│ CLAUDE.md / Rules                │  <- Teaches the LLM how to maintain it
├──────────────────────────────────┤
│ Layer 2: wiki/  (LLM owns)       │  <- LLM writes, humans read
│  ├── Entity pages                │
│  ├── Concept pages               │
│  └── index.md / log.md           │
├──────────────────────────────────┤
│ Layer 1: raw/  (Immutable)       │  <- Humans deposit, LLM reads only
│  ├── PDFs / Articles             │
│  └── Transcripts / Notes         │
└──────────────────────────────────┘
```

Karpathy's own description: "You rarely ever write or edit the wiki manually; it's the domain of the LLM." This is the core difference from RAG -- RAG assembles answers from scratch on every query, while LLM-wiki front-loads the effort at the ingest stage and subsequent queries simply read the already-structured wiki.

[Ditto's internal implementation](https://www.ditto.com/blog/llm-wiki-for-ditto) codified it into three fixed operations:

| Operation | What it does |
|---|---|
| `ingest` | Read sources, extract entities and facts, create/update wiki pages, write log |
| `query` | Search wiki, generate cited answers, optionally backfill useful results |
| `lint` | Health check: find contradictions, orphan pages, stale claims, missing links |

Paul Iusztin extended this into three Claude Code skills in [LLM Knowledge Base I Built on My Second Brain](https://www.decodingai.com/p/llm-knowledge-base-obsidian-readwise-notebooklm): `/research_create`, `/research_search`, `/research_distill`. The last one is particularly interesting -- **it extracts only the sources actually used from memory into a portable `research.md` appendix**, roughly 15-20 out of 62 sources. Research collects a lot; actual writing uses very little. This distill step prevents the references section from becoming noise.

For quidproquo, the `.research/` directory already exists (the deep-research skill from the previous post uses exactly this structure), but it hasn't been wiki-fied yet. At a one-person writing scale, it's not enough to justify the overhead. I'll observe for 12-24 months before deciding.

## Pattern Three: Quality Guardrails

This is the most valuable pattern to learn from. Three independent sources converge on the same principle: **reviewers never auto-fix; generators never fabricate**.

[Dheeraj Sharma's Technical Verifier Claude subagent](https://genaiunplugged.substack.com/p/claude-code-subagent-technical-content-verification) targets the biggest vulnerability in LLM writing -- outdated version numbers, APIs, and pricing. His design philosophy:

> The agent reports issues but NEVER auto-fixes. Is this a critical error or a minor nitpick? Should you rewrite the section or add a disclaimer? That's your call, not the agent's.

A real example it caught: "GPT-4 costs 10x more" was outdated -- OpenAI had already retired the "GPT-4" model name by then; the current models are GPT-5.2 / GPT-4.1, with input pricing on par with Claude Sonnet at $3.00/M tokens. **Humans reading through wouldn't catch the issue because the sentence structure was perfectly fine; only cross-referencing against official docs reveals the facts are stale**. What would take 30+ minutes of manual line-by-line verification, he turned into a 90-second agent.

[xnor.ca's Round 2 writing log](https://xnor.ca/posts/2026-02-09-writing-with-claude/) reveals the problem from the other end. After a 12-hour first run with Claude writing blog posts, two disasters surfaced:

1. **Fabricated facts**: Claude invented JTS debugging steps ("reconnecting segments by proximity, merging nearby endpoints") -- the actual git history contained none of these. "The default behavior was to fill narrative gaps with plausible-sounding details instead of saying 'I don't have this information.'"
2. **Algorithm logic backwards**: When describing Z-axis optimization logic, it got the direction wrong; even after reviewing the source code, it was still incorrect. The author had to fix it manually.

His Round 2 established a discipline written directly into the instructions: **Never fabricate. If facts are missing, flag the gap.** "Say 'I don't have information about what was tried here' rather than inventing debugging attempts." This must be hardcoded into the system prompt or skill -- you cannot rely on the LLM's self-discipline.

[Kaz Sato on the Google Cloud blog](https://medium.com/google-cloud/supercharge-tech-writing-with-claude-code-subagents-and-agent-skills-44eb43e5a9b7) extended this discipline to a source-code-aware reviewer: his `adk-reviewer` reads the google-adk Python SDK source code directly and catches discrepancies between the article and the actual implementation -- 31 missed issues, including deprecated parameters and misunderstood design intent.

The third layer of defense is the **brief gate** emphasized in [rzlt.io's 8-step pipeline](https://www.rzlt.io/blog/claude-code-automating-long-form-content-creation): "If the brief is weak, the article will be weak. This separation matters." Instead of writing the article first, you write the brief (meta title / meta description / target keywords / heading structure / FAQ schema); the brief must pass before writing begins. Max Mitcham's [60-day blog agent post](https://maxmitcham.substack.com/p/how-i-rank-1-in-claude-chatgpt-and) follows the same design: "When I say 'let's write a blog about X', the agent doesn't just start writing. It interviews me. ... If my answers are thin, it pushes back."

## GEO: Writing Style Itself Affects Visibility

Writing good content is only step one -- whether ChatGPT / Claude / Perplexity cites it is step two. Princeton + Georgia Tech + Allen AI + IIT Delhi published the [GEO paper at KDD 2024](https://arxiv.org/abs/2311.09735) (arxiv 2311.09735), testing 9 writing techniques across 10,000 queries on the GEO-bench. The conclusions are concrete:

| Writing Technique | Position-Adjusted Word Count Improvement |
|---|---|
| Quotation Addition (directly quoting authoritative source text) | **+41%** |
| Statistics Addition (using specific numbers) | **+33%** (measured +37% on Perplexity) |
| Fluency Optimization (concise and smooth) | **+29%** |
| Cite Sources (inline attribution) | **+28%** |
| Easy-to-Understand (simplified language) | +14% |
| Authoritative (authoritative tone) | +12% |
| Unique Words / Technical Terms | +6% / +18% |
| **Keyword Stuffing** | **-9% (penalty)** |

The paper also ran a [real-world comparison on Perplexity.ai](https://arxiv.org/html/2311.09735v3): "demonstrate visibility improvements up to 37%," consistent with the lab results.

Particularly noteworthy: **websites ranked 5th in SERP saw visibility increase by +115.1% after adding Cite Sources** -- this has the greatest impact on non-homepage personal blogs like quidproquo. The keyword density traditionally emphasized in SEO is directly penalized in GEO.

Practical takeaway: use articles like the [Anthropic Skills guide](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) as a baseline writing style -- quote source documentation, provide specific version numbers, maintain clear structure, and prioritize fluency.

## quidproquo's Trade-offs: What to Adopt and What to Skip

Cross-referencing these findings, quidproquo's existing skill system (post / post-update / post-translate / post-review / post-verify / deep-research / tag-audit / deploy-preflight) already covers most patterns. The specific trade-offs:

**Adopted (already implemented or being reinforced)**:

- ✅ **Multi-agent pipeline**: RAG chat side already implemented (planner -> research -> writer -> critic); writing side maintains manual review-at-each-step
- ✅ **Never fabricate / never auto-fix**: Explicitly hardcoded in post-review and post-verify SKILL.md files
- ✅ **GEO rules**: Written into `writing-guide.md`; post-review skill checks for compliance
- ✅ **Technical verifier**: post-verify skill performs fact-layer cross-checks on versions / APIs / pricing

**Not adopting for now**:

- ❌ **Fully automated publish pipeline** (Khaled Zaky's Lambda -> GitHub commit -> deploy) -- quidproquo uses Cloudflare Workers + Astro SSR + personal writing; the existing `git commit + pnpm deploy` workflow is already lightweight, adding another layer is unnecessary
- ❌ **Monthly SEO audit + auto-refresh** (rzlt.io's GSC MCP feed -> refresh every 3 months) -- not enough scale, manual post-update is sufficient
- ❌ **Full LLM-wiki applied to `.research/`** -- potentially over-engineering for a solo writer, will observe for 12-24 months first

**Selectively adopting (will decide based on usage)**:

- 🟡 **Brief gate (rzlt.io / Max Mitcham pattern)**: Valuable for deep-dive guides, but burdensome for quick notes. Will observe deep-research skill usage first; when enough material naturally accumulates, it becomes a `post-brief` skill
- 🟡 **Voice profile extraction**: Khaled Zaky extracts a voice profile from 20 posts; quidproquo already has 100+ posts available. Worth doing but doesn't need to run on every post -- a one-time `pnpm voice:extract` script is more appropriate
- 🟡 **Research distill pattern**: Scan `## References` before publishing and trim sources not actually cited -- can be folded into `post-review`, doesn't need a separate skill

## The Big Picture

After reviewing 11 public pipelines, the most practical takeaways for a "personal writing site" aren't the flashiest multi-agent choreography, but three disciplines:

1. **Reviewers never auto-fix, generators never fabricate** -- this sets the floor for LLM writing quality
2. **Separate the brief from the writing** -- if the brief is weak, reject it; don't write first and fix later
3. **Encode GEO rules into your style guide and apply automatically** -- add statistics, quote source text, don't stuff keywords; the quantitative evidence is all in the Princeton paper

Everything else -- multi-agent frameworks, automated publishing, monthly refreshes -- is a matter of scale. Get the three disciplines above right first, then observe real-world usage to identify the actual bottleneck.

For quidproquo's own skill family, the next step is to actually run `post-verify` on two or three posts, check whether the cross-check report matches manual verification results, and then decide whether to hardcode more GEO rules into post-review's mandatory checks (currently advisory only).

## References

- [GEO: Generative Engine Optimization (arxiv 2311.09735, KDD 2024)](https://arxiv.org/abs/2311.09735) -- Aggarwal, Murahari, Rajpurohit, Kalyan, Narasimhan, Deshpande
- [Princeton listing](https://collaborate.princeton.edu/en/publications/geo-generative-engine-optimization/)
- [Performance Department: GEO paper plain-English breakdown](https://performancedepartment.nl/en/blog/geo-paper-generative-engine-optimization)
- [Andrej Karpathy's LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [VentureBeat: Karpathy LLM Knowledge Base architecture breakdown](https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an)
- [Ditto: Building an LLM Wiki](https://www.ditto.com/blog/llm-wiki-for-ditto)
- [Paul Iusztin: How I Automated 91% of My Business with AI Agents (Nova + Brown)](https://www.decodingai.com/p/how-i-automated-91-percent-of-my-business)
- [Paul Iusztin: The LLM Knowledge Base I Built on My Second Brain (research_create / search / distill)](https://www.decodingai.com/p/llm-knowledge-base-obsidian-readwise-notebooklm)
- [Dheeraj Sharma: Technical Verifier Claude Subagent](https://genaiunplugged.substack.com/p/claude-code-subagent-technical-content-verification)
- [xnor.ca: Writing Blog Posts with Claude Code Round 2 (never fabricate)](https://xnor.ca/posts/2026-02-09-writing-with-claude/)
- [Kaz Sato (Google Cloud): Tech writing with subagents and agent skills](https://medium.com/google-cloud/supercharge-tech-writing-with-claude-code-subagents-and-agent-skills-44eb43e5a9b7)
- [rzlt.io: Claude Code 8-step long-form content pipeline](https://www.rzlt.io/blog/claude-code-automating-long-form-content-creation)
- [Max Mitcham: 60-day blog agent with Hermes + OpenClaw](https://maxmitcham.substack.com/p/how-i-rank-1-in-claude-chatgpt-and)
- [Khaled Zaky: AI agent that writes/revises/publishes via email trigger](https://khaledzaky.com/blog/i-built-an-ai-agent-that-writes-for-my-blog/)
- [Google Developers: Multi-agent patterns in ADK](https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/)
- Related posts on this site:
  - [Claude Skills: Packaging Expertise into Folders](/posts/ai/2026-05-08-anthropic-claude-skills-guide)
  - [LLM Knowledge Management: From Karpathy's llm-wiki to the Open-Source Ecosystem](/posts/ai/2026-04-23-llm-knowledge-management-landscape)
  - [Skill vs Subagent: Comparing Two Agent Collaboration Modes in Claude Code](/posts/ai/2026-03-30-skill-vs-subagent-comparison)

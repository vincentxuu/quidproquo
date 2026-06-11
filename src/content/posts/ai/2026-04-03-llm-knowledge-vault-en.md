---
title: "Three Modes of LLM Knowledge Bases: Knowledge Vault, Experience Vault, and Blog"
date: 2026-04-03
type: guide
category: ai
tags: [llm-knowledge-base, obsidian, knowledge-management, fine-tuning, rag, claude-code, karpathy]
lang: en
tldr: "Andrej Karpathy proposed a framework for compiling personal knowledge wikis with LLMs — collect raw data, have the LLM compile it into .md wiki pages, run Q&A against the wiki, and file outputs back. This post compares three practical approaches: Karpathy's knowledge vault model, the community's experience vault model, and quidproquo's blog model."
description: "An in-depth analysis of Andrej Karpathy's LLM Knowledge Bases framework, contrasted with community extensions (session continuity, voice transcription, cross-AI sync, fine-tuning, knowledge decay) and the quidproquo.cc blog architecture, exploring productization directions for LLM-driven knowledge management."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-03-llm-knowledge-vault)

Andrej Karpathy recently shared his approach to building a personal knowledge base with LLMs on X, sparking widespread discussion. His core thesis: instead of spending tokens manipulating code, spend them manipulating knowledge. This post summarizes his framework, community extensions, and the different path quidproquo.cc has taken in the same direction.

## Karpathy's Framework: LLM as Knowledge Compiler

Karpathy's approach breaks down into five stages:

**Data Ingest → Compile → Q&A → Output → Linting**

1. **Data Collection**: Place articles, papers, repos, datasets, and images into a `raw/` directory; use Obsidian Web Clipper to capture web pages and download associated images locally
2. **LLM Compilation**: The LLM incrementally compiles `raw/` into a `.md` wiki — writing summaries, building backlinks, categorizing into concept articles, and cross-linking
3. **Q&A Queries**: Once the wiki reaches a certain scale (~100 articles, ~400K words), query the wiki directly; the LLM self-maintains indices and summaries without needing additional RAG
4. **Output Filing**: Output formats include markdown, Marp slides, and matplotlib charts; query results are filed back into the wiki for continuous knowledge accumulation
5. **Linting Health Checks**: The LLM periodically scans the wiki, identifies inconsistencies, fills gaps, and suggests new article topics

The frontend uses Obsidian to browse all content. The key principle: **humans almost never manually edit the wiki — the wiki is the LLM's domain.**

He concluded his thread by saying:

> I think there is room here for an incredible new product instead of a hacky collection of scripts.

## Community Extensions: From Knowledge Compilation to Continuous Evolution

Others have proposed more complete architectures building on Karpathy's foundation, adding five dimensions he didn't address.

### Session Continuity: Persistence Across Conversations

Using Claude Code's `PreCompact` / `PostCompact` hooks to automatically save state before context compression and restore it afterward. This solves the problem of "losing track of what I was doing when the conversation gets too long."

Karpathy doesn't need this because his knowledge lives in files, not dependent on the context window. But for people who use AI as a working partner, session continuity is a fundamental requirement. Open-source solutions like Continuous-Claude-v3, ContextVault, and claude-session-continuity-mcp already exist.

### Voice Transcription: Signals That Text Can't Capture

Beyond articles and code, incorporate voice conversations into the knowledge base. Using Typeless to record 28,000+ voice transcriptions, then Gemini Pro for intent classification. The finding: 97% of keyword-classified "praise" was misclassified — because text-based sentiment analysis lacks prosodic information: intonation, pauses, and speaking rate carry intent signals that text cannot capture.

### Cross-AI Tool Sync: What One AI Learns, All AIs Know

The biggest pain point of using Claude Code, Codex, and Gemini CLI simultaneously is that knowledge doesn't transfer between them. A bridge module was built to automatically extract high-confidence knowledge into each tool's instruction files for synchronization.

This need has been validated by the community — open-source solutions include claude_code_bridge (multi-AI real-time collaboration), skillshare (one-click skill sync across all CLI tools), and gemini-context-bridge (automatic CLAUDE.md → GEMINI.md conversion).

### Fine-Tuning: Karpathy Said "Want to Explore in the Future" — Others Are Already Doing It

Karpathy mentioned "synthetic data + finetuning" as a future direction at the end of his thread. The community has already run 16 generations of fine-tuning on Qwen3-14B using Unsloth + Google Colab, with each generation costing less than $1. Unsloth supports running on free Colab T4 GPUs, claiming 2x speed and 70% VRAM savings. The key design is having the system automatically track whether training materials are sufficient, triggering training only when enough has accumulated.

### Confidence Decay: Knowledge Needs a Decay Mechanism

Wikis grow bloated over time. Adding confidence decay — knowledge unused for 90 days is automatically downweighted, and knowledge unused for six months is marked as outdated. But "lessons learned the hard way" (major mistakes) never decay.

This corresponds to the Ebbinghaus forgetting curve in cognitive science and has AI memory system implementations — Mnemex implements human-like forgetting curves with temporal memory, ZenBrain proposes a 7-layer memory architecture including FSRS spaced repetition and Bayesian confidence propagation.

## Comparing the Three Models

All three approaches share the goal of "managing knowledge with LLMs," but they've made different trade-offs:

| Dimension | Karpathy (Knowledge Vault) | Community Extension (Experience Vault) | quidproquo.cc (Blog Model) |
|-----------|---------------------------|---------------------------------------|---------------------------|
| Core Philosophy | Spend tokens on knowledge operations | Let AI continuously evolve with each conversation | LLM-compiled public knowledge system |
| Where Knowledge Lives | Local `.md` wiki directory | Obsidian vault + AI memory | Astro `.md` + Cloudflare D1 |
| Data Sources | Articles, papers, repos, images | Same + voice transcriptions (Typeless) | Conversations, external document scraping |
| Compilation Flow | LLM incrementally compiles wiki | Auto-scan and archive at session end | `/post` skill converts conversations to structured articles |
| Indexing Method | LLM self-maintains index, no RAG needed | Not specifically described | Cloudflare Vectorize semantic indexing |
| Frontend Browsing | Obsidian + Marp slides | Obsidian | Astro SSG public website |
| External Data Handling | Obsidian Web Clipper | Not specifically described | Browser Rendering API → chunking → D1 |
| Quality Maintenance | LLM health checks | Vault Governance (orphan notes, stale content) | OpenSpec workflow lifecycle |
| Time Dimension | No decay | Confidence decay (90-day downweight) | No decay |
| Session Continuity | Not needed (knowledge in files) | PreCompact/PostCompact hooks | Claude Code hooks |
| Error Learning | No automatic mechanism | Error counter, 3 strikes upgrades to rule | No automatic mechanism |
| Cross-Tool Sync | Single LLM | Bridge module syncs multiple tools | Single toolchain |
| Fine-Tuning | Wants to do it in the future | Already ran 16 generations (Unsloth + Qwen3) | RAG-first, fine-tuning in research phase |
| Output Format | Markdown, slides, charts, web UI | Not emphasized | Blog articles |
| Openness | Private | Private | Public |
| Infrastructure | Local filesystem | Local + CLI hooks | Cloudflare Workers + D1 + Vectorize + KV |
| Human's Role | Consumer — doesn't touch the wiki | Curator — sets rules for the system to execute | Curator — reviews and publishes publicly |
| Maturity | Self-described as hacky scripts | Has architecture but not productized | Productized architecture (migrations, rate limiting) |

The shared philosophy across all three: **knowledge is the LLM's domain; humans ask questions and curate, they don't write content manually.**

The difference lies in positioning — Karpathy serves personal research, the community model pursues AI's continuous learning capability, and quidproquo turns output into a public, indexed, infrastructure-backed blog.

## Where's the Product Opportunity

Karpathy put it bluntly: "There is room here for an incredible new product instead of hacky scripts."

Each of the three current approaches has limitations:

- **Karpathy's model** requires manually managing the `raw/` directory and triggering compilation; the barrier is engineering ability
- **The community experience vault model** relies on hooks + bridge + fine-tuning with high integration costs and no unified interface between components
- **The quidproquo blog model** has productized architecture (schema migrations, rate limiting, audit logging) but is positioned as a blog rather than a general-purpose knowledge base

What's missing is a product that integrates all three: auto-collection → LLM compilation → semantic indexing → cross-tool sync → decay governance → multi-format output, without requiring users to know CLI or write hooks.

Open-source projects like ContextVault, Mnemex, and Continuous-Claude-v3 each solve a piece of the puzzle, but no one has built the complete product Karpathy described. This may be one of the most important AI tool directions to watch in 2026 — not making AI write more code, but making AI manage your knowledge.

## Appendix: Three-Layer Architecture in the Gist and Community Extension Proposals

Karpathy described his architecture in more detail in a [GitHub Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) than in his tweets. He breaks the system into three layers:

1. **Raw Sources** — immutable original files (articles, papers, datasets)
2. **The Wiki** — LLM-generated markdown containing summaries, entity pages, concept pages, and cross-references
3. **The Schema** — configuration files defining wiki conventions and workflows (`CLAUDE.md` or `AGENTS.md`)

The wiki itself is just a git repo of markdown files, getting version history, branching, and collaboration for free. Two key special files are `index.md` (a categorized directory helping the LLM navigate efficiently) and `log.md` (an append-only chronological log using consistent prefixes for parseability).

The discussion thread below the Gist also spawned several advanced proposals worth noting:

- **Provenance tracking** — hashing and freshness verification for sources, ensuring knowledge traceability
- **Ontology system** — building typed entities and relations, upgrading the wiki from flat files to a structured knowledge graph
- **Decision records** — recording why knowledge evolved, not just the current state
- **Multi-LLM strategy** — using different LLMs for different security levels of sensitive institutional content
- **Graph database** — replacing pure markdown with a graph database for cleaner knowledge organization
- **Reflection layer** — a meta-cognitive layer that lets the system analyze its own wiki structure

These proposals echo the "community experience vault model" observations in this post: the community is pushing Karpathy's original framework toward a more complete knowledge management system.

## References

- [Karpathy — LLM Knowledge Bases Tweet](https://x.com/karpathy/status/2039805659525644595)
- [Karpathy — LLM Knowledge Bases Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [Karpathy — 2025 LLM Year in Review](https://karpathy.bearblog.dev/year-in-review-2025/)
- [Typeless — AI Voice Dictation](https://www.typeless.com/)
- [Unsloth — Qwen3 Fine-tuning](https://unsloth.ai/docs/models/qwen3-how-to-run-and-fine-tune)
- [Unsloth GitHub](https://github.com/unslothai/unsloth)
- [claude_code_bridge — Multi-AI Collaboration](https://github.com/bfly123/claude_code_bridge)
- [skillshare — Sync Skills Across AI CLI Tools](https://github.com/runkids/skillshare)
- [ContextVault — External Memory for AI Assistants](https://ctx-vault.com/)
- [Mnemex — Temporal Memory System](https://github.com/fastmcp-me/mnemex)
- [Continuous-Claude-v3 — Context Management](https://github.com/parcadei/Continuous-Claude-v3)
- [ZenBrain — 7-Layer Memory Architecture](https://www.tdcommons.org/dpubs_series/9683/)
- [Claude Code Hooks Official Documentation](https://code.claude.com/docs/en/hooks)
- [awesome-agent-skills — Cross-Tool Agent Skills](https://github.com/VoltAgent/awesome-agent-skills)

---
title: "Knowledge Management with LLMs: From Karpathy's llm-wiki to the Open-Source Ecosystem"
date: 2026-04-23
category: ai
tags: [llm-wiki, knowledge-management, karpathy, obsidian, cloudflare, second-brain]
lang: en
tldr: "Karpathy proposed the llm-wiki pattern in 2026, having LLMs proactively maintain a markdown wiki instead of running RAG from scratch every time. Over 100 open-source implementations now exist, ranging from local CLI tools to serverless Telegram bots."
description: "An overview of Karpathy's llm-wiki pattern and the 100+ derivative projects from the open-source community, categorized by automation level and deployment approach."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-23-llm-knowledge-management-landscape)

In April 2026, Andrej Karpathy shared a workflow shift on X: he was no longer just using LLMs to generate code -- he was using them to build and maintain a personal knowledge base. He called this approach **llm-wiki**, and the original gist surpassed 5,000 stars within days.

This article covers the core concepts of llm-wiki and the ecosystem that the open-source community has built around it. If you're interested in the Karpathy framework itself and its three practice modes (knowledge base / experience vault / blog), check out [[llm-knowledge-vault]] first.

## The Problem: RAG's Fundamental Limitation

Most people use LLMs to process documents through RAG (Retrieval-Augmented Generation): dump files in, and every time a question is asked the model retrieves relevant chunks from a vector store and assembles an answer.

There's a fundamental problem with this: **knowledge doesn't accumulate**. Every time you ask a question, the model rediscovers the same things from scratch. When a question requires synthesizing information across five documents, the model has to re-find, re-understand, and re-stitch everything together. No memory, no accumulation.

A more practical issue: things you've saved into Obsidian or Notion -- three months later you only vaguely remember "I saw something about this somewhere," but you can't find it or articulate the key points.

## The Core Idea Behind llm-wiki

Karpathy's solution isn't better RAG -- it's a completely different direction:

> Have the LLM distill raw materials into a structured wiki upfront, rather than reprocessing raw data on every query.

The concrete approach:
1. Raw materials (articles, video transcripts, PDFs) go into `raw/`
2. An LLM agent reads the raw materials, extracts knowledge, and writes interlinked markdown wiki pages into `wiki/`
3. Subsequent queries read from the pre-organized wiki, not the raw materials

The wiki continuously updates as new data comes in. Knowledge is **cumulative**, not rebuilt from scratch each time.

The key difference from RAG lies in one critical detail: RAG processes at query time, while llm-wiki distills at ingestion time. The former rediscovers every time; the latter lets knowledge settle and compound.

## The Current Open-Source Ecosystem

The `llm-wiki` topic on GitHub currently has **102 public repos**. Here's a breakdown by characteristics.

### Direct Implementations of the Karpathy Pattern

**[lucasastorian/llmwiki](https://github.com/lucasastorian/llmwiki)** (623 stars)  
The most complete web UI implementation. Upload documents, connect to Claude via MCP, and automatically write to the wiki. Backend uses Supabase, with a full web interface -- no command-line knowledge required.

**[Astro-Han/karpathy-llm-wiki](https://github.com/Astro-Han/karpathy-llm-wiki)** (589 stars)  
Agent Skills compatible, supporting Claude Code, Cursor, and Codex. Citation-centric -- every wiki page traces back to its sources, with a built-in lint system to ensure knowledge base health.

**[swarmclawai/swarmvault](https://github.com/swarmclawai/swarmvault)** (260 stars)  
Local-first, with added knowledge graph and hybrid search (keyword + embeddings). Also supports running as an MCP server for Claude Code / Codex / OpenCode.

**[SamurAIGPT/llm-wiki-agent](https://github.com/SamurAIGPT/llm-wiki-agent)** (2.2k stars)  
The most starred implementation to date. Drop in sources, and Claude/Codex/Gemini automatically builds an interlinked wiki. No API key needed (runs under a Claude Code subscription).

### Fully Local, Zero Data Leaving Your Machine

**[kytmanov/obsidian-llm-wiki-local](https://github.com/kytmanov/obsidian-llm-wiki-local)** (289 stars)  
Completely local, running models through Ollama. Drop in markdown notes and the AI extracts concepts, automatically creating interlinked pages in Obsidian. Data never leaves your machine.

**[Pratiyush/llm-wiki](https://github.com/Pratiyush/llm-wiki)** (148 stars)  
Automatically extracts knowledge from Claude Code / Codex / Cursor / Gemini session histories, and can also generate a static site for easy browsing.

### Serverless + Mobile

**[walle45611/LLM-Wiki-Worker](https://github.com/walle45611/LLM-Wiki-Worker)**  
The most unique combination in this batch: Cloudflare Worker + Queue for handling webhook timeouts, GitHub as the knowledge base backend, Obsidian for local dual-track editing, and Telegram as the query interface. The entire system runs at near-zero cost (CF Workers free tier).

The architectural core uses Queues to work around serverless limitations -- Telegram webhooks time out after 30 seconds, but knowledge queries often take longer, so tasks enter a queue for background processing before replying.

### Broader LLM Knowledge Management

Beyond the llm-wiki pattern, there are several mature projects taking different approaches:

**[khoj-ai/khoj](https://github.com/khoj-ai/khoj)**  
Currently the closest to a "complete product" among open-source options. Self-hostable, supporting PDF/Notion/Org-mode, compatible with local LLMs (llama, qwen, mistral) or cloud models (GPT, Claude, Gemini), with built-in web search, deep research, and scheduled automation. The difference from llm-wiki is that it's a full platform rather than a pure wiki pattern.

**[rmusser01/tldw_server](https://github.com/rmusser01/tldw_server)** (1.3k stars)  
An open-source NotebookLM alternative. Multi-modal summarization of YouTube / PDF / web pages, stored as a personal research database. More oriented toward "summary archiving" than "knowledge restructuring."

**[memex-lab/memex](https://github.com/memex-lab/memex)**  
A Flutter app accepting text/photo/voice input, with multi-agent automatic organization, fully local-first. Positioned more as a life logger, not limited to technical content.

## Key Trade-offs Across Solutions

```
Automation Level
  High │ llm-wiki-agent  LLM-Wiki-Worker  khoj
       │ swarmvault       memex
       │
  Low  │ obsidian-ava    silverbullet
       └──────────────────────────────── Deployment Complexity
          Low (local)              High (serverless)
```

A few key questions for choosing:

**Does your data need to stay on your machine?**  
If yes, go with `obsidian-llm-wiki-local` (Ollama) or `memex`. If not, you have many more options.

**Do you have a specific query interface requirement?**  
Want to query from your phone anytime -> Telegram bot (LLM-Wiki-Worker); desktop only -> Claude Code plugin style; want a web UI -> llmwiki or khoj.

**Do you want a full platform or a pure wiki pattern?**  
khoj has the most features but also the highest complexity. llm-wiki-agent is the lightest -- just drop sources and get an auto-generated wiki, no extra features.

## Overall Takeaway

The problem llm-wiki solves is very real: you accumulate vast amounts of things you've read and watched, but when you need them you can't find them or connect the dots. The core insight of this pattern is -- rather than having AI re-understand raw materials on every query, let AI distill knowledge into a queryable form upfront.

This ecosystem is still in its early stages, with most projects rapidly developed by individuals or small teams over the past few months. The overall direction is sound, but stability and long-term maintainability remain to be seen. Keep an eye on `khoj` (most mature) and `llm-wiki-agent` (most pure), then pick a variant based on your deployment preferences.

---

## References

- [Karpathy llm-wiki original gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [lucasastorian/llmwiki](https://github.com/lucasastorian/llmwiki)
- [Astro-Han/karpathy-llm-wiki](https://github.com/Astro-Han/karpathy-llm-wiki)
- [SamurAIGPT/llm-wiki-agent](https://github.com/SamurAIGPT/llm-wiki-agent)
- [swarmclawai/swarmvault](https://github.com/swarmclawai/swarmvault)
- [kytmanov/obsidian-llm-wiki-local](https://github.com/kytmanov/obsidian-llm-wiki-local)
- [walle45611/LLM-Wiki-Worker](https://github.com/walle45611/LLM-Wiki-Worker)
- [khoj-ai/khoj](https://github.com/khoj-ai/khoj)
- [rmusser01/tldw_server](https://github.com/rmusser01/tldw_server)
- [GitHub llm-wiki topic](https://github.com/topics/llm-wiki)
- [GitHub personal-knowledge-management topic](https://github.com/topics/personal-knowledge-management)

---
title: "How to Use the Awesome AI Agents List: 305 Projects, 24 Categories, and a Selection Routine"
date: 2026-10-24
category: ai
type: guide
tags: [ai-agent, open-source, awesome-list, agent-memory, mcp, agent-framework]
lang: en
tldr: "awesome-ai-agents is an index of 305 agent projects, not something you install. It ships JSON data files, so one jq command can filter candidates by category and stars before you check maintenance yourself."
description: "A guided tour of the awesome-ai-agents list on GitHub: what it collects, how the categories work, how to filter the data file with jq, and which claims in a widely shared summary do not match the list itself."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-24-awesome-ai-agents-list-guide)

[awesome-ai-agents](https://github.com/slavakurilyak/awesome-ai-agents) is an index of agent projects maintained by Slava Kurilyak. It currently lists 305 projects across 24 categories that have entries, ships the data as JSON and YAML, and the repo is MIT-licensed. A recent post summarized it as "memory, browsers, and agent loops are already built." This guide explains what the list actually is, how to pull candidates from its data file with `jq`, and where that summary diverges from the list.

## What it is

It is an index, not a framework, and there is nothing to install. Each project gets a card: a description, GitHub stars, star growth over the last 9 days, its categories, and for some projects capabilities and interfaces fields.

The inclusion rule is stated at the top of the README: a public repository on GitHub, GitLab.com, or Codeberg, with no license requirement. Hosted products without their own repo are not listed.

Four things in the repo are worth knowing:

- **README**: category browsing, star growth rankings, the top 10 by total stars, then every project card.
- **`awesome-agents.json` / `awesome-agents.yaml`**: the same project data in two formats, with `agents` and `categories` at the top level.
- **`awesome-categories.yaml`**: the category definitions, 36 in total.
- **`github-stars-history.json`**: star history records.

## Who it is for

It suits people who already know what their agent is missing: memory, browser control, evaluation and tracing. You want to see the candidates and how big each area is. You need to read GitHub repos and use a command line; the example below uses `jq`.

It is not for learning concepts. The list gives one or two sentences per project and does not explain how they work or rank them. For memory basics, start with the site's [Agent Memory Engineering series intro](/posts/ai/2026-09-19-agent-memory-engineering-series-intro).

## Content map

The README categories are split by what a thing *is*, not by the problem you are solving. This table starts from the need instead:

| The gap you want to fill | List category (projects) | Examples in the list |
|---|---|---|
| Ready-made agents, coding agents | AI Agents (103) | Aider, AutoGPT, Cline |
| Frameworks to build your own agent | Development Frameworks (89) | LangGraph, crewAI, Google ADK, Cognee |
| Memory across conversations | Long-Term Memory (25) | mem0, MemGPT, Zep, Screenpipe |
| Operating or scraping the web | Web Browsing Frameworks (7) | browser-use, Stagehand, Steel Browser, Firecrawl |
| Evaluation and tracing | Evaluation (13), Observability (14) | Opik, Langfuse, Arize Phoenix |
| Connecting external tools | MCP Servers (21), Tool Calling (24) | Serena, Context7, Playwright MCP |
| Safety guardrails | Safety Guardrails (27) | NeMo Guardrails |
| Writing prompts as programs | Flow Engineering (5) | DSPy |

A project can sit in several categories, so the per-category counts add up to more than the project total. The remaining categories hold one or two projects each; Phone Calling, Bitcoin, and Prompt Engineering have one apiece.

### The eight projects the summary mentions

Categories and descriptions below come from the list itself; stars are the list's 2026-10-04 snapshot:

| Project | List category | The list's description | Stars |
|---|---|---|---|
| [DSPy](https://github.com/stanfordnlp/dspy) | Flow Engineering | Compiles declarative language-model calls into self-improving pipelines, optimizing prompts and weights | 38,491 |
| [Cognee](https://github.com/topoteretes/cognee) | Development Frameworks | Processes data into knowledge graphs and data models, with data ingestion and similarity search | 31,338 |
| [Serena](https://github.com/oraios/serena) | MCP Servers | Coding-agent toolkit exposed as an MCP server, with semantic code retrieval and editing via language servers | 29,972 |
| [Stagehand](https://github.com/browserbase/stagehand) | Web Browsing Frameworks | Adds natural-language act, extract, and observe APIs to Playwright | 25,530 |
| [Opik](https://github.com/comet-ml/opik) | Evaluation Frameworks | Tracing, evaluation, prompt management, and production monitoring for LLMs and agents | 22,364 |
| [Screenpipe](https://github.com/screenpipe/screenpipe) | AI Agents, Long-Term Memory, Local Inference, Personal Assistants | Captures screen and audio locally and serves searchable work history to agents over MCP | 21,806 |
| [Google ADK](https://github.com/google/adk-python) | Development Frameworks | Open-source kit for building, evaluating, and deploying multi-agent systems | 21,701 |
| [Steel Browser](https://github.com/steel-dev/steel-browser) | Web Browsing Frameworks | Open-source browser API and sandbox providing managed browser sessions | 7,733 |

## A concrete example: picking a browser tool from the data file

Say your agent needs to operate web pages and you want to know what the list offers. Every project in the data file has a `categories` array and `sources[0].stars`, so:

```bash
curl -sSLO https://raw.githubusercontent.com/slavakurilyak/awesome-ai-agents/main/awesome-agents.json

jq -r '.agents[]
  | select(.categories | index("Web Browsing Frameworks"))
  | [(.sources[0].stars // 0), .project] | @tsv' awesome-agents.json | sort -rn
```

Output (2026-10-04 snapshot):

```text
188355	Firecrawl
117092	browser-use
84721	Crawl4AI
37797	Playwright MCP
25530	Stagehand
23132	Skyvern
7733	Steel Browser
```

This one category spans several layers. Firecrawl turns websites into Markdown and structured data, which is scraping. browser-use and Stagehand let an agent operate a page. Steel Browser provides the browser environment itself. The top entry and the bottom entry do not solve the same problem, so star count is the wrong way to choose. Decide which layer you are missing first, then compare within that layer.

For a closer look at that infrastructure, read the [Browserbase browser infrastructure overview](/posts/ai/2026-08-22-browserbase-browser-infrastructure) and the [AI web scraping tools landscape](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape).

## Limits

- **Stars are a snapshot, not quality.** Stars measure attention. The list gives descriptions, stars, and repo status, with no quality or security assessment. Being listed is not an endorsement.
- **Category granularity is uneven.** AI Agents has over a hundred projects; Prompt Engineering has one. A project appearing in several categories reflects how it was submitted.
- **Not every entry has repo stars.** MemGPT and Zep, for example, link to product sites, so the data file has no star count for them and they sort last.
- **The README is long.** All project cards live on one page; the JSON is faster to query than scrolling.

### How the summary compares with the list

| Claim in the summary | What the list shows |
|---|---|
| 36 categories | 36 is the number defined in `awesome-categories.yaml`; 24 currently have projects |
| Cognee handles long-term memory | The list files it under Development Frameworks, not among the 25 in Long-Term Memory; its description is about building knowledge graphs |
| Screenpipe records computer activity as agent context | Matches; it appears in four categories |
| What DSPy, Serena, Stagehand, Steel Browser, Opik, and Google ADK do | Consistent with the descriptions above |
| Memory, browsers, and agent loops are "already done" | The list only shows that someone built it and published a repo; it does not mean production-ready, so check maintenance yourself |

For memory, the Long-Term Memory category is the more accurate starting point, paired with the site's [open-source agent memory framework comparison](/posts/ai/2026-09-19-open-source-agent-memory-framework-selection) and the [Mem0 overview](/posts/ai/2026-08-22-mem0-agent-memory).

## How to use it

1. **Write the gap in one sentence.** For example, "my agent must log in and pull tables." Map it to one or two categories instead of reading the README top to bottom.
2. **List candidates with jq.** Swap the category name in the example above; the output is sorted by stars.
3. **Open the top three repos and check three things.** License, date of the latest commit, and whether open issues get replies. Each record also has a `repository_status` field (all eight projects above are `active`, and two entries in the whole list are `archived`), which works as a first filter.
4. **Compare within one layer.** Confirm the candidates solve the same level of problem before comparing features.
5. **For frameworks, continue with a selection guide.** If you are choosing from Development Frameworks, read the site's [agent framework selection guide](/posts/ai/2026-08-22-agent-framework-selection-guide) next.

## References

- [slavakurilyak/awesome-ai-agents](https://github.com/slavakurilyak/awesome-ai-agents) (README)
- [awesome-agents.json](https://raw.githubusercontent.com/slavakurilyak/awesome-ai-agents/main/awesome-agents.json) (project data; source of the stars and categories in this article)
- [awesome-categories.yaml](https://raw.githubusercontent.com/slavakurilyak/awesome-ai-agents/main/awesome-categories.yaml) (the 36 category definitions)
- [Agent Memory Engineering series intro](/posts/ai/2026-09-19-agent-memory-engineering-series-intro) (in Chinese)
- [Open-source agent memory framework comparison](/posts/ai/2026-09-19-open-source-agent-memory-framework-selection) (in Chinese)
- [Mem0 overview](/posts/ai/2026-08-22-mem0-agent-memory) (in Chinese)
- [Agent framework selection guide](/posts/ai/2026-08-22-agent-framework-selection-guide) (in Chinese)
- [Browserbase browser infrastructure](/posts/ai/2026-08-22-browserbase-browser-infrastructure) (in Chinese)
- [AI web scraping tools landscape](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape) (in Chinese)

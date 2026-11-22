---
title: "GPT Researcher In-Depth: Critic Loop, Source Allowlisting, and Maintenance Status"
date: 2026-11-22
category: ai
type: deep-dive
tags: [gpt-researcher, deep-research, multi-agent, critic-loop, source-quality]
lang: en
tldr: "GPT Researcher strengthens data source quality through multi-agent critic loops and source URL allowlisting, with draft_revision_count and max_draft_revisions mechanisms to prevent infinite loops."
description: "In-depth analysis of GPT Researcher's LangGraph multi-agent architecture, Reviewer/Reviser critic loop, source URL allowlisting, and maintenance status, with architectural comparisons to STORM, Open Deep Research, and Local Deep Research."
draft: false
series:
  name: "Deep Research 前沿"
  order: 16
---

Previous articles covered the open-source tools landscape (order 11) and commercial product landscape (order 12). This article dives deep into a single project: **GPT Researcher**'s multi-agent architecture, critic loop design, source verification mechanisms, and maintenance status compared to other open-source projects.

---

## 1. Multi-Agent Architecture and Division of Labor

GPT Researcher's architecture is built on LangGraph with a multi-agent collaboration model featuring seven specialized roles:

- **Planner Agent**: Decomposes tasks into sub-questions and generates research outlines
- **Research Agents**: Execute multiple search and data collection tasks in parallel
- **Editor**: Plans report outline and structure
- **Reviewer**: Audits research drafts for accuracy and completeness
- **Reviser**: Revises based on critique feedback
- **Writer**: Integrates all research findings to compose the final report
- **Publisher**: Formats the report and exports to PDF, Markdown, or Word

These agents operate as sub-graphs, each parallel research task having independent state to avoid main-graph contention.

## 2. Critic Loop Design

GPT Researcher implements a deterministic critic loop:

1. **Review Step**: Reviewer checks draft accuracy, completeness, and citation accuracy against predefined `guidelines`
2. **Critique Feedback**: Reviewer returns specific revision suggestions or confirms draft sufficiency
3. **Reviser Step**: Revises based on critique feedback and updates `draft_revision_count`
4. **Retry Mechanism**: If `max_draft_revisions` (default 3) is reached, forcibly accepts with warning flag
5. **Cross-Validation**: Cross-references key facts with sources in validation tables

PR #1885 (merged into #1909) added `draft_revision_count` and `max_draft_revisions` to prevent infinite loops. After reaching the limit, the draft is forcibly accepted to ensure the research pipeline doesn't stall.

## 3. Source Verification and Allowlisting Mechanisms

GPT Researcher implements three key mechanisms in `writer.py` and `reviewer.py`:

1. **Source URL allowlisting**: All cited URLs must appear in the current research's `search_results`; otherwise flagged as hallucinated sources
2. **Source Registration and Read Status**: All sources are logged in `sources.jsonl` with `read_status` annotations (read, partial, blocked, etc.)
3. **Source Quality Grading**: Sources are classified into four tiers: primary, high-quality secondary, abstract citation, and content farm

These mechanisms ensure research report data sources are verifiable, traceable, and of higher overall quality.

## 4. Architecture Comparison with Other Open-Source Projects

| Dimension | GPT Researcher | STORM | Open Deep Research | Local Deep Research |
|---|---|---|---|---|
| **Coordination** | Pipeline (fixed order) | Dialogue simulation | Supervisor-Worker dynamic | Linear local loop |
| **Plan & Search** | Separate (plan then search) | Fused (simultaneous in dialogue) | Separate but can append dynamically | Separate |
| **Memory** | VectorStore / RAG | Dialogue history + info list | State object (TypingDict) | Encrypted SQLCipher |
| **Citation Design** | Inline citation + source URL allowlisting | Outline-first, weak source binding | Abstract-stage citation | Strategy-dependent |
| **Maintenance** | Active (v3.7.0, 2026-09-26) | Frozen (2025-09-30) | Active | Active |

GPT Researcher's design philosophy emphasizes "collect broadly, extract precisely," suitable for enterprise-level deep research and internal data analysis. STORM is readable but unsuitable as a production dependency (frozen repository). Local Deep Research is the only one emphasizing "never leaves your machine," suitable for confidential data.

## 5. Maintenance Status and Cost Structure

| Project | Latest Version | Maintenance | Cost per Report |
|---|---|---|---|
| GPT Researcher | v3.7.0 (2026-09-26) | Active (Apache-2.0) | $0.20–$2.00 (model tokens + search API) |
| Open Deep Research | — | Archived (2026-08-21) | N/A |
| STORM | — | Frozen (no commits after 2025-09-30) | N/A |
| Local Deep Research | Active | Active | $0.20–$2.00 (local models primarily) |

Tavily deep search costs $0.032–$2.00 per query, compared to vendor pricing (e.g., OpenAI Deep Research monthly limits).

## 6. Conclusion

GPT Researcher's multi-agent critic loop and source URL allowlisting mechanisms enhance data source quality and research verifiability through multi-source data integration and strict source verification. Compared to STORM's frozen state and Open Deep Research's archived status, GPT Researcher is one of the most actively maintained projects in the open-source ecosystem.

---

## References

- [GPT Researcher GitHub Repository](https://github.com/assafelovic/gpt-researcher)
- [GPT Researcher Documentation](https://docs.gptr.dev)
- [GPT Researcher PR #1885](https://github.com/assafelovic/gpt-researcher/pull/1885)
- [STORM](https://arxiv.org/abs/2410.01208) — Stanford, expert dialogue-based outline.
- [Open Deep Research](https://github.com/langchain-ai/open_deep_research) — Archived by LangChain (2026-08-21).
- [Local Deep Research](https://github.com/LearningCircuit/local-deep-research) — Fully local deployment.
- [digitalapplied.com: Four Open-Source Deep Research Agents, Tested Honestly](https://www.digitalapplied.com/blog/open-source-deep-research-agents-2026-guide)
- [menuagentic.com: GPT Researcher vs Local Deep Research vs STORM vs DeerFlow](https://menuagentic.com/blogs/gpt-researcher-vs-local-deep-research-vs-storm-vs-deerflow/)
- [llms.blog: Autonomous Deep Research Agent Architectures in Production](https://www.llms.blog/posts/autonomous-deep-research-agent-architectures-in-production-comparing-stanford-storm-gpt-researcher-langchain-open-deep-research-and-hugging-face-smolagents)
- [zenn.dev: AI Research Agent Design Patterns Comparison](https://zenn.dev/acompany/articles/c7c9df1244ad05)
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — Previous article: Three-stage landscape taxonomy.
- [open-source-tools-overview](/posts/ai/2026-09-19-open-source-tools-overview) — Order 11: Open-source tools landscape.
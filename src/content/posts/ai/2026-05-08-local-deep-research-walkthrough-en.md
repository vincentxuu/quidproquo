---
title: "Local Deep Research Walkthrough: A Privacy-First Deep Research Agent"
date: 2026-05-08
category: ai
tags: [rag, agent, langgraph, deep-research, local-llm, langchain]
lang: en
tldr: "Local Deep Research is a privacy-first deep research agent built on LangChain + LangGraph, integrating 20+ search engines and 30+ research strategies. Its flagship langgraph_agent_strategy takes the LLM-autonomous tool-calling approach, offering a fundamentally different paradigm from fixed-pipeline RAG graphs."
description: "A walkthrough of LearningCircuit/local-deep-research: positioning, architecture, directory map, 30+ research strategies, and how it differs from typical RAG systems."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-08-local-deep-research-walkthrough)

I was recently building a RAG system and wanted an open-source reference that was more complete than GPT-Researcher without requiring data to be sent to OpenAI. `LearningCircuit/local-deep-research` (hereafter LDR) is one of the few projects that simultaneously achieves "fully local," "multi-source verification," and "a rich enough strategy pool." This post covers its positioning, architecture, and the parts most worth borrowing.

## What Problem It Solves

LDR aims to deliver research quality comparable to ChatGPT Deep Research or Perplexity without leaking data or paying API fees -- multi-step search, multi-source verification, and citation-backed reports.

Its four core selling points:

- **Privacy**: AES-256 encryption via SQLCipher, per-user isolated databases, no built-in telemetry
- **Local LLM**: Direct integration with Ollama / LM Studio / llama.cpp, supporting Llama3, Mistral, Gemma, DeepSeek, Qwen, etc.; cloud LLMs also supported (OpenAI, Anthropic, Gemini, OpenRouter)
- **Multi-source**: 20+ search engines, including academic (arXiv, PubMed, Semantic Scholar, Google Scholar), general (Wikipedia, SearXNG, GitHub, Wayback Machine), paid (Tavily, Brave), and local files / LangChain Retriever
- **Measurable**: Achieves roughly 95% accuracy on the SimpleQA benchmark with GPT-4.1-mini; the community maintains cross-model comparison datasets on Hugging Face

The differentiation from mainstream deep research tools is clear: compared to Perplexity / OpenAI Deep Research, it runs fully local with no API fees and data never leaves your machine; compared to GPT-Researcher, its strategy pool is far richer (30+ vs. a handful), plus it adds journal quality scoring and encrypted knowledge base accumulation.

## Three Interfaces

LDR is not just a CLI tool -- it provides three interfaces simultaneously:

| Interface | Usage | Directory |
|---|---|---|
| Web UI | `docker compose up` → `localhost:5000`, with WebSocket live progress | `src/local_deep_research/web/` |
| Python / HTTP API | `quick_query(user, pass, "...")`, `POST /api/start_research` | `src/local_deep_research/api/` |
| MCP Server | Connects to Claude Desktop / Claude Code | `src/local_deep_research/mcp/` |

This design is worth highlighting: by completely decoupling the research engine from the interface layer, the same core can simultaneously serve a web app, API clients, and MCP-aware IDEs.

## Core Directory Map

`src/local_deep_research/` can be roughly divided into five groups:

```
advanced_search_system/   ← The brain of the entire research pipeline
  strategies/             ← 30+ research strategies (most worth reading)
  questions/              ← Question decomposition / rephrasing
  candidates/ candidate_exploration/
  constraints/ constraint_checking/
  evidence/ findings/ filters/ knowledge/ answer_decoding/

web_search_engines/       ← Search engine adapters
llm/                      ← Provider abstraction layer
embeddings/               ← FAISS vector indexing
document_loaders/         ← Local file loading

database/  storage/       ← SQLCipher encrypted storage
research_library/         ← Personal knowledge base accumulation
followup_research/        ← Follow-up and subsequent research

domain_classifier/        ← Academic vs. general domain routing
journal_quality/          ← 212K+ journal reputation / predatory journal detection
citation_handlers/        ← Citation numbering / formatting
exporters/  report_generator.py

api/  web/  mcp/          ← Three interfaces
```

The most worth borrowing is `journal_quality/` -- it ships with 210K+ journal entries and reputation scores, capable of automatically flagging predatory journals. If your research agent needs to quality-rank external data sources, this dataset alone is valuable.

## 30+ Research Strategies

`advanced_search_system/strategies/` is the part of the entire repo most deserving of a close read. The 30+ strategy files can be roughly grouped into four categories:

**Iterative Refinement**

- `iterative_reasoning_strategy.py`: Think while searching -- each round decides the next step based on previous results
- `iterative_refinement_strategy.py`: Feed results back in for re-querying, converging toward the answer
- `focused_iteration_strategy.py`: Deep-dive into a specific subtopic

**Parallel**

- `parallel_search_strategy.py`: Multiple queries in parallel
- `concurrent_dual_confidence_strategy.py`: Two paths run simultaneously, cross-validating confidence
- `parallel_constrained_strategy.py`: Parallel search under constraints

**Decomposition**

- `adaptive_decomposition_strategy.py` / `recursive_decomposition_strategy.py`: Break big questions into sub-questions
- `modular_strategy.py` / `llm_driven_modular_strategy.py`: Modular composition

**Evidence / Source-Based**

- `source_based_strategy.py`, `evidence_based_strategy.py` (including v2)
- `smart_query_strategy.py`, `news_strategy.py`
- **`langgraph_agent_strategy.py`** -- the flagship strategy

Just from the filenames alone, you can sense that this repo treats "research methods" as first-class entities. Each one is an independently swappable strategy class inheriting from the same `BaseSearchStrategy`.

## Flagship Strategy: langgraph_agent_strategy

The key difference between this strategy and the other "fixed pipeline" strategies is that it hands full control to the LLM for autonomous tool-calling.

| Aspect | LangGraph Agent | Other Strategies |
|---|---|---|
| Decision-making | LLM autonomously decides when to search, deep-dive, or synthesize | Predefined step sequences |
| Iteration | 50+ tool calls | 1-5 |
| Parallelism | Built-in sub-agents (`ThreadPoolExecutor` with max 4 workers, 30 min timeout per subtopic) | Single-threaded sequential |
| Architecture | Uses `create_agent()` + `agent.stream()` for message streaming, no explicit StateGraph | Some have explicit state |

Several key design choices worth borrowing:

- **`SearchResultsCollector`**: A thread-safe global citation accumulator -- when sub-agents query in parallel using the same collector, citation numbers stay consistent
- **Tool factory**: `_make_web_search_tool()`, `_make_specialized_search_tool()` (one each for PubMed, arXiv), and `_make_research_subtopic_tool()` expose "delegate to a sub-agent" as a tool available to the main agent
- **No explicit StateGraph**: State is managed entirely through LangChain message passing -- each round produces an `AIMessage` (with `tool_calls`) or an observation, ultimately converging to `final_content`

This design represents a fundamentally different path from the typical RAG graph's "planner -> research -> normalize -> writer -> critic" fixed pipeline: fixed pipelines are easier to debug, observe, and verify; autonomous agents are more adaptive and can go deeper, but come at the cost of 50+ iterations.

## Overall Architecture

```
                        ┌──── Web UI (Flask + WebSocket) ────┐
                        │                                     │
   User ── 3 entries ───┼──── Python / HTTP API ─────────────┼── advanced_search_system
                        │                                     │   ├── strategies/ (30+)
                        └──── MCP Server (Claude Desktop) ────┘   ├── questions/
                                                                  ├── evidence/
                                                                  └── findings/
                                                                       │
                                ┌──────────────┬──────────────┬───────┴─────┐
                                ▼              ▼              ▼             ▼
                          web_search_     llm/         embeddings/   document_loaders/
                          engines/      (Ollama,        (FAISS)      (local files)
                          (20+ adapter) OpenAI, ...)
                                │              │              │             │
                                └──────────────┴──────┬───────┴─────────────┘
                                                      ▼
                                          database/ + storage/
                                          (SQLCipher encrypted / per-user DB)
                                                      ▼
                                          citation_handlers/ →  report_generator.py
                                          journal_quality/        exporters/
```

## Overall Assessment

LDR is suited for three types of people: engineers building local research agents, research teams that need extensive A/B testing of research workflows, and anyone in scenarios where data must never leave the machine.

The most worth stealing:

1. **The multi-strategy architecture in strategies/** -- treating "research methods" as first-class entities, inheriting from a common base class for easy swapping
2. **`SearchResultsCollector`** -- a cross-node shared citation accumulator that solves citation numbering consistency for parallel agents
3. **The `research_subtopic` tool pattern** -- exposing "delegate to a sub-agent" as a tool, cleaner than hand-writing fan-out logic
4. **The `journal_quality/` dataset** -- 210K+ journal reputation scores, valuable in its own right

Compared to a typical RAG graph: fixed pipelines remain the right choice for most production scenarios (observable, testable, cheap), but when you encounter scenarios that "require deep exploration, can't predict the number of steps in advance, and need dynamic tool composition," LDR's langgraph_agent mode is an excellent reference.

## References

- [LearningCircuit/local-deep-research (GitHub)](https://github.com/LearningCircuit/local-deep-research)
- [LDR Strategies Directory](https://github.com/LearningCircuit/local-deep-research/tree/main/src/local_deep_research/advanced_search_system/strategies)
- [LDR Benchmarks (Hugging Face dataset)](https://huggingface.co/datasets/local-deep-research/ldr-benchmarks)
- [LangChain](https://www.langchain.com/)
- [LangGraph](https://langchain-ai.github.io/langgraph/)
- [Ollama](https://ollama.com/)
- [SQLCipher](https://www.zetetic.net/sqlcipher/)
- [FAISS (Facebook AI Similarity Search)](https://github.com/facebookresearch/faiss)
- [GPT-Researcher (for comparison)](https://github.com/assafelovic/gpt-researcher)

---
title: "Local Deep Research 導讀：本地優先的深度研究 Agent"
date: 2026-05-08
category: ai
tags: [rag, agent, langgraph, deep-research, local-llm, langchain]
lang: zh-TW
tldr: "Local Deep Research 是個本地優先、隱私導向的深度研究 Agent，用 LangChain + LangGraph 串起 20+ 搜尋引擎和 30+ 種研究策略，旗艦的 langgraph_agent_strategy 走 LLM 自主 tool-calling 路線，跟固定流程的 RAG graph 是兩種思路。"
description: "導讀 LearningCircuit/local-deep-research：定位、架構、目錄地圖、30+ 種研究策略，以及跟一般 RAG 的差異。"
draft: false
---

最近在做 RAG 系統，想找一個比 GPT-Researcher 更完整、又不需要把資料送到 OpenAI 的開源實作參考。`LearningCircuit/local-deep-research`（以下稱 LDR）是少數同時做到「完全本地」「多源驗證」「策略池夠豐富」的專案。這篇整理一次它的定位、架構、以及最值得抄的部分。

## 它解決什麼問題

LDR 的目標是讓使用者在不外洩資料、不付 API 費的前提下，做到接近 ChatGPT Deep Research 或 Perplexity 的研究品質——多步搜尋、多源驗證、產出帶引用的報告。

它的四個核心賣點：

- **隱私**：用 SQLCipher 做 AES-256 加密、每用戶一個獨立資料庫，沒有內建遙測
- **本地 LLM**：直接接 Ollama / LM Studio / llama.cpp，跑 Llama3、Mistral、Gemma、DeepSeek、Qwen 都行；雲端 LLM 也支援（OpenAI、Anthropic、Gemini、OpenRouter）
- **多源**：20+ 搜尋引擎，包含學術（arXiv、PubMed、Semantic Scholar、Google Scholar）、通用（Wikipedia、SearXNG、GitHub、Wayback Machine）、付費（Tavily、Brave）以及本地檔案 / LangChain Retriever
- **可量測**：在 SimpleQA benchmark 上用 GPT-4.1-mini 達到約 95% 準確度，社群還有跨模型比較的 dataset 在 Hugging Face 維護

跟主流 Deep Research 工具的差異很清楚：相對 Perplexity / OpenAI Deep Research，它可以全本地、無 API 費、資料不出機器；相對 GPT-Researcher，它的策略池更豐富（30+ 種 vs 少數幾種），還多了期刊品質評分和加密知識庫累積。

## 三種使用面貌

LDR 不只是一個 CLI 工具，它同時提供三種介面：

| 面貌 | 用法 | 對應目錄 |
|---|---|---|
| Web UI | `docker compose up` → `localhost:5000`，含 WebSocket 即時進度 | `src/local_deep_research/web/` |
| Python / HTTP API | `quick_query(user, pass, "...")`、`POST /api/start_research` | `src/local_deep_research/api/` |
| MCP Server | 接到 Claude Desktop / Claude Code | `src/local_deep_research/mcp/` |

這個設計值得一提：把研究引擎和介面層完全切開，所以同一套核心可以同時餵給網頁、API client、和 MCP-aware 的 IDE。

## 核心目錄地圖

`src/local_deep_research/` 下大概可以分成五群：

```
advanced_search_system/   ← 整套研究流程的大腦
  strategies/             ← 30+ 種研究策略（最值得讀）
  questions/              ← 問題拆解 / 重述
  candidates/ candidate_exploration/
  constraints/ constraint_checking/
  evidence/ findings/ filters/ knowledge/ answer_decoding/

web_search_engines/       ← 各家搜尋引擎 adapter
llm/                      ← Provider 抽象層
embeddings/               ← FAISS 向量索引
document_loaders/         ← 本地檔案載入

database/  storage/       ← SQLCipher 加密儲存
research_library/         ← 個人知識庫累積
followup_research/        ← 追問與後續研究

domain_classifier/        ← 學術 vs 一般領域路由
journal_quality/          ← 212K+ 期刊聲譽 / 掠奪性期刊偵測
citation_handlers/        ← 引用編號 / 格式
exporters/  report_generator.py

api/  web/  mcp/          ← 三種介面
```

最值得抄的是 `journal_quality/`——它內建 21 萬筆以上的期刊索引和聲譽評分，可以自動標記掠奪性期刊。如果你的研究 Agent 需要對外部資料源做品質排序，這個資料集本身就有價值。

## 30+ 種研究策略

`advanced_search_system/strategies/` 是整個 repo 最該細讀的部分。30+ 個策略檔案大致可以分四群：

**迭代精煉類**

- `iterative_reasoning_strategy.py`：邊想邊搜，每輪根據前一輪結果決定下一步
- `iterative_refinement_strategy.py`：把結果回灌再查，逼近答案
- `focused_iteration_strategy.py`：聚焦深挖某個子主題

**平行類**

- `parallel_search_strategy.py`：多查詢並行
- `concurrent_dual_confidence_strategy.py`：兩條路徑同時跑、互相校驗信心
- `parallel_constrained_strategy.py`：受限條件下的並行搜尋

**分解類**

- `adaptive_decomposition_strategy.py` / `recursive_decomposition_strategy.py`：把大問題拆成子問題
- `modular_strategy.py` / `llm_driven_modular_strategy.py`：模組化組合

**證據／來源類**

- `source_based_strategy.py`、`evidence_based_strategy.py`（含 v2）
- `smart_query_strategy.py`、`news_strategy.py`
- **`langgraph_agent_strategy.py`** ← 旗艦策略

光看檔名就能感受到這個 repo 對「研究方法」是當成一級實體在設計的，每一種都是獨立可替換的策略類別，繼承同一個 `BaseSearchStrategy`。

## 旗艦策略：langgraph_agent_strategy

這支策略跟其他「固定管道」策略最大的差別是——它把控制權完全交給 LLM 自主 tool-calling。

| 面向 | LangGraph Agent | 其他策略 |
|---|---|---|
| 決策 | LLM 自決何時搜尋、深掘、綜合 | 預定義步驟流程 |
| 迭代 | 50+ 次 tool call | 1-5 次 |
| 並行 | 內建子 agent（`ThreadPoolExecutor` 最多 4 workers，每子主題 30 min timeout） | 單線程循序 |
| 形態 | 用 `create_agent()` + `agent.stream()` 跑訊息流，沒有顯式 StateGraph | 有的有顯式狀態 |

幾個關鍵設計值得抄：

- **`SearchResultsCollector`**：thread-safe 的全局引用累積器，子 agent 並行查詢時用同一個 collector，最後引用編號才不會打架
- **工具工廠**：`_make_web_search_tool()`、`_make_specialized_search_tool()`（PubMed、arXiv 各一支）、`_make_research_subtopic_tool()` 把「委派給子 agent」當成一個 tool 暴露給主 agent
- **無顯式 StateGraph**：完全靠 LangChain message passing 管狀態，每輪產生 `AIMessage`（含 `tool_calls`）或 observation，最後收斂到 `final_content`

這個設計跟一般 RAG graph 的「planner → research → normalize → writer → critic」固定流程是兩條路：固定流程好除錯、好觀測、好驗證；自主 agent 適應性高、能跑深、但要付出 50+ 次迭代的成本。

## 整體架構

```
                        ┌──── Web UI (Flask + WebSocket) ────┐
                        │                                     │
   User ───── 三種入口 ──┼──── Python / HTTP API ─────────────┼── advanced_search_system
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
                                          (SQLCipher 加密 / per-user DB)
                                                      ▼
                                          citation_handlers/ →  report_generator.py
                                          journal_quality/        exporters/
```

## 整體來說

LDR 適合三類人：想做本地研究 Agent 的工程師、需要對研究流程做大量 A/B 的研究團隊、以及任何在意資料不能離開機器的場景。

它最值得偷的東西是：

1. **strategies/ 的多策略架構**——把「研究方法」當一級實體設計，繼承同一個基類後可隨意替換
2. **`SearchResultsCollector`**——跨 node 共享的引用累積器，解決並行 agent 的引用編號一致性
3. **`research_subtopic` 工具模式**——把「委派給子 agent」當成 tool 暴露，比手寫 fan-out 乾淨
4. **`journal_quality/` 資料集**——21 萬筆期刊聲譽評分，本身就值錢

對照一般 RAG graph：固定流程仍然是大多數產品場景的對的選擇（可觀測、可測試、便宜），但如果遇到「需要深入挖掘、無法事先預知幾步、需要動態組合工具」的場景，LDR 的 langgraph_agent 模式是個很好的 reference。

## 參考資料

- [LearningCircuit/local-deep-research（GitHub）](https://github.com/LearningCircuit/local-deep-research)
- [LDR Strategies 目錄](https://github.com/LearningCircuit/local-deep-research/tree/main/src/local_deep_research/advanced_search_system/strategies)
- [LDR Benchmarks（Hugging Face dataset）](https://huggingface.co/datasets/local-deep-research/ldr-benchmarks)
- [LangChain](https://www.langchain.com/)
- [LangGraph](https://langchain-ai.github.io/langgraph/)
- [Ollama](https://ollama.com/)
- [SQLCipher](https://www.zetetic.net/sqlcipher/)
- [FAISS（Facebook AI Similarity Search）](https://github.com/facebookresearch/faiss)
- [GPT-Researcher（對照組）](https://github.com/assafelovic/gpt-researcher)

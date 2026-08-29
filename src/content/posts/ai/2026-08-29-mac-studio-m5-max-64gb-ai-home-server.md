---
title: "Mac Studio M5 Max 記憶體怎麼選：AI Home Server 架構、分層模型與 Router AI"
date: 2026-08-29
category: ai
type: deep-dive
tags: [mac-studio, local-llm, ai-home-server, architecture, mcp, claude, llm-router]
lang: zh-TW
tldr: "目標不是用 Local LLM 取代 Claude，是建一台 24/7 AI Home Server。Local 35B 當本地大腦和 offline fallback，Claude Haiku 和 Sonnet 各管一層，64GB 足以支撐整套架構。"
description: "從 AI Home Server 的分層模型架構反推 Mac Studio M5 Max 記憶體需求，分析 Local LLM、Claude Haiku、Claude Sonnet 如何分工，以及為什麼 64GB 就夠。"
draft: false
glossary:
  - term: "Router AI"
    definition: "負責判斷每個請求該交給哪個模型處理的路由層，通常由規則引擎加上小型分類模型組成。"
    definition_en: "A routing layer that decides which model handles each request, typically combining rule-based logic with a small classifier model."
---

> 🌏 [English version](/en/posts/ai/2026-08-29-mac-studio-m5-max-64gb-ai-home-server-en)

[Mac Studio M5 Max](https://www.apple.com/mac-studio/specs/) 到底要買 64GB 還是 128GB？糾結了很久，最後選了 64GB。不是因為省錢，而是畫完架構圖之後，發現我真正想建的東西不需要 128GB。這篇記錄決策過程，以及那張讓我做決定的 AI Home Server 架構。

## 64GB 還是 128GB？

新款 Mac Studio M5 Max [台灣售價 NT$84,900 起](https://mrmad.com.tw/apple-mac-studio-2026-specs-price)，18 核心 CPU、最高 40 核心 GPU、614GB/s 記憶體頻寬。40 核心 GPU 版本可選 48GB、64GB 或 128GB 統一記憶體。

64GB 升到 128GB 的價差大約 NT$56,000，比一台入門 Mac mini 還貴。

如果目標是跑更大的 Local LLM，128GB 確實有意義——能裝下 70B 模型的 Q4 量化版，甚至兩個 35B 並行。但真正該問的是：我需要在本地跑 70B 嗎？

## 不是 Local LLM 工作站，是 AI Home Server

重新想了一下真正想要的東西：不是一台用 Local LLM 取代 [Claude](https://claude.com/pricing) 的電腦，而是一台 24/7 運作的 Personal AI Home Server。

差別在哪？Local LLM 工作站追求「本地能跑多大的模型」，AI Home Server 追求「能整合多少工具、自動處理多少事」。前者是算力導向，後者是整合導向。

現實的一面：再怎麼砸錢，就算買了 NT$199,900 起的 [M5 Ultra 頂規 512GB 版本](https://www.apple.com/mac-studio/specs/)，本地的推理能力也追不上月費 $200 美元的 [Claude Max 20x 方案](https://claude.com/pricing)。Claude Opus 的複雜推理、長程規劃和 Agent 能力，短期內不是任何本地模型能取代的。

所以問題不是「怎麼在本地跑最大的模型」，而是「怎麼分配本地和雲端的工作」。

## 分層模型架構

三層模型各自負責不同等級的工作。

### Local LLM（7B–35B）：本地大腦

本地模型的角色不是主力推理引擎，是三件事：

1. **Router / Classifier**：判斷意圖、分類任務難度、決定轉給哪個模型
2. **輕量任務處理**：簡單問答、格式轉換、資料擷取
3. **Offline fallback**：斷網時的備援

以 [Qwen3.5 35B-A3B](https://github.com/QwenLM/Qwen3.5) 為例，Q4 量化下[只需約 21GB 統一記憶體](https://willitrunai.com/blog/qwen-3-5-35b-a3b-vram-requirements)，MoE 架構每次推理只啟動 3B 活躍參數，在 Apple Silicon 上能跑到 60+ tok/s。用 [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide) 或 [MLX](https://github.com/ml-explore/mlx) 部署，啟動快、記憶體佔用可控。

### Claude Haiku：快速處理層

[Claude Haiku 4.5](https://claude.com/pricing) 的 API 價格 $1/$5 per MTok，速度快、延遲低，適合的工作：

- 摘要、分類、翻譯
- 中等複雜度的對話
- 大量重複性任務（批次處理再打五折）

成本在 Local LLM 的「零」和 Sonnet 之間——Home Server 裡大部分日常任務不需要更強的模型。

### Claude Sonnet：複雜推理層

需要複雜推理、長程規劃或多步驟 Agent 時，交給 [Claude Sonnet 4.6](https://claude.com/pricing)（$3/$15 per MTok）：

- 多步驟 Agent 工作流
- 程式生成與分析
- Critic / Evaluator / Planner 任務

最耗 token 的工作才走這層。

### Router AI 怎麼分流

Router AI 是這套架構的核心開關。它不是一個獨立的大模型，而是規則引擎加上小型分類模型的組合：

1. **規則判斷**：特定指令直接路由（「開燈」→ [Home Assistant](https://www.home-assistant.io/)，不需要 LLM）
2. **小模型分類**：用 7B 模型判斷任務難度和類型
3. **難度評估**：簡單任務留在本地，中等任務交 Haiku，複雜任務升級 Sonnet

每一層只處理它最擅長的工作，成本和延遲都最優。

## AI Home Server 全架構

整套架構長這樣：

![AI Home Server 架構圖](/images/posts/2026-08-29/ai-home-server-architecture.jpg)

### 入口層

多個入口同時運作：

- **Telegram / LINE Bot**：最常用的對話介面
- **Web UI**：管理控制台和進階操作
- **Warashi**：自己開發的 [Live2D](https://www.live2d.com/) 語音 AI 入口
- **語音輸入（STT）**：透過 [Whisper](https://github.com/openai/whisper) 轉文字

所有入口都經過 AI Gateway 統一管理驗證、權限、限流和 Session。

### MCP / Tool Layer

透過 [MCP（Model Context Protocol）](/posts/ai/2026-03-22-mcp-model-context-protocol) 串接各種工具：

| 工具 | 用途 |
|------|------|
| [Home Assistant](https://www.home-assistant.io/) | 智慧家庭控制 |
| Apple Calendar / Notes | 行事曆與備忘錄 |
| [Linear](https://linear.app/) | 專案管理 |
| [Obsidian](https://obsidian.md/) | 知識庫（本地） |
| [Notion](https://www.notion.so/) | 知識庫（雲端） |
| Web / API | 網路搜尋與資料擷取 |
| [ComfyUI](https://github.com/comfyanonymous/ComfyUI) | 圖像生成 |
| Music AI | 作曲（ACE-Step / Stable Audio） |

### Memory Layer

參考 [Agent Memory 架構](/posts/ai/2026-03-19-agent-memory-systems)，分三層：

- **Episodic**：對話紀錄和事件 log
- **Semantic**：知識圖譜和向量搜尋（[Qdrant](https://qdrant.tech/)）
- **Working**：當前 Session 的短期記憶

### 基礎設施

全部跑在 Mac Studio 上的 [Docker](https://www.docker.com/) 容器裡：

| 服務 | 角色 |
|------|------|
| [PostgreSQL](https://www.postgresql.org/) | 關聯式資料 |
| [Redis](https://redis.io/) | 快取與佇列 |
| [Qdrant](https://qdrant.tech/) | 向量資料庫 |
| [Whisper](https://github.com/openai/whisper) | 語音辨識 |
| TTS | 語音合成 |
| Scheduler / Monitoring / Backup | 排程、監控、備份 |

### 開發工作流

開發端獨立運作，不佔 Home Server 的 24/7 資源：[Claude Code](https://claude.ai/code) 和 Codex 跑在雲端，共用 MCP 工具和 Git 專案管理。

## 64GB 記憶體夠嗎？

攤開來算：

| 項目 | 預估用量 |
|------|------|
| macOS + 常駐服務 | ~8 GB |
| Docker 容器（PostgreSQL + Redis + Qdrant + 其他） | ~6 GB |
| Local LLM（35B Q4_K_M） | ~21 GB |
| Whisper + TTS | ~3 GB |
| **總計** | **~38 GB** |
| **剩餘 headroom** | **~26 GB** |

26GB 的 headroom 足以應付 KV cache、突發的記憶體需求、或臨時載入第二個小模型做 A/B 測試。

128GB 能讓我同時跑兩個 35B 或一個 70B 密集模型，但那是「玩具需求」——這套架構用不到那麼大的本地模型。

## 整體來說

這個決定的核心邏輯：先畫架構，再選硬體。

64GB 能撐起一台整合智慧家庭、蘋果生態系、專案管理工具和多層 AI 的 24/7 Home Server。128GB 多出的空間可以跑更大的 Local LLM，但那不是目標——要的是整合，不是算力。

與其把 NT$56,000 花在不可升級、只會折舊的 RAM，兩年後直接換下一代更划算。到時候 64GB 可能是入門配置，而本地能跑的模型又強一個世代。

## 參考資料

- [Mac Studio — Technical Specifications（Apple）](https://www.apple.com/mac-studio/specs/)
- [Plans & Pricing — Claude by Anthropic](https://claude.com/pricing)
- [蘋果 2026 Mac Studio 登場！7 規格亮點、台灣售價與適合誰入手一次看（瘋先生）](https://mrmad.com.tw/apple-mac-studio-2026-specs-price)
- [Qwen3.5-35B-A3B VRAM Requirements — Will It Run AI](https://willitrunai.com/blog/qwen-3-5-35b-a3b-vram-requirements)
- [MCP（Model Context Protocol）：AI Agent 工具呼叫的標準化協定（站內）](/posts/ai/2026-03-22-mcp-model-context-protocol)
- [Agent Memory 系統：從 RAG 到 Read-Write 記憶的演化（站內）](/posts/ai/2026-03-19-agent-memory-systems)

---
title: "Agent CLI 訂閱方案全比較：打造可自由切換的多模型使用模式"
date: 2026-04-02
category: ai
tags: [agent-cli, multi-model-routing, claude-code, cursor, codex, kiro, gemini-cli, opencode, llm-router, cost-optimization]
lang: zh-TW
tldr: "比較 2026 年六大 Agent CLI 訂閱方案（Claude Code、Cursor CLI、Codex、Kiro、Gemini CLI、OpenCode），並研究多模型路由模式——簡單任務給便宜模型、複雜任務給強模型，實測可省 40-85% 成本。"
description: "完整比較六大終端原生 Agent CLI 的訂閱方案與定價策略，並深入研究 Multi-Model Routing 模式的開源實作與架構設計。"
draft: false
---

2026 年，AI coding agent 已經從「輔助工具」變成「開發主力」。本文聚焦於**有終端 CLI agent 的工具**——可以直接在 terminal 裡跑的 coding agent。

這篇文章做兩件事：

1. **橫向比較**六大 Agent CLI 的訂閱方案
2. **深入研究** Multi-Model Routing 模式——讓簡單任務自動用便宜模型、複雜任務才動用旗艦模型

## 六大 Agent CLI 訂閱方案總覽

| 工具 | 入門價 | 重度使用 | 模型策略 | 最適合 |
|------|--------|---------|---------|--------|
| **[Claude Code](/posts/ai/2026-04-02-agent-cli-claude-code/)** | $20/mo | $100-200/mo | Opus/Sonnet/Haiku 手動切換 | 深度推理、複雜任務 |
| **[Cursor CLI](/posts/ai/2026-04-02-agent-cli-cursor/)** | 免費 / $20/mo | $60-200/mo | Auto + 多供應商 | IDE ↔ CLI 無縫切換 |
| **[OpenAI Codex CLI](/posts/ai/2026-04-02-agent-cli-openai-codex/)** | 免費 / $20/mo | $200/mo | GPT-5.4 + mini 自動路由 | OpenAI 生態系 |
| **[Kiro CLI](/posts/ai/2026-04-02-agent-cli-kiro/)** | 免費 (50 credits) | $200/mo | Auto 模式自動切換 | AWS 生態系 |
| **[Gemini CLI](/posts/ai/2026-04-02-agent-cli-gemini-cli/)** | 免費 (1000 req/day) | $20-42/mo | Gemini 2.5 Pro, 1M context | 免費重度使用 |
| **[OpenCode](/posts/ai/2026-04-02-agent-cli-opencode/)** | 免費 (開源) | 按 API 計費 | 75+ 模型供應商自由切換 | 模型自由、vendor 獨立 |

## 各工具定位與特色

### 商業訂閱制

**[Claude Code](/posts/ai/2026-04-02-agent-cli-claude-code/)** — Anthropic 的終端 agent，推理深度業界最強。Pro $20/mo（Sonnet 為主），Max $100-200/mo 解鎖 Opus 並吃到飽。有開發者 8 個月用了 100 億 tokens，月費 $100，同樣用量走 API 要 $15,000。Subagent 架構可指定 Haiku 處理簡單任務。

**[Cursor CLI](/posts/ai/2026-04-02-agent-cli-cursor/)** — 將 Cursor IDE 的 Agent 帶入終端。Interactive TUI + headless 模式，支援 Plan/Ask/Agent 三種模式。獨家 **Cloud Handoff**：CLI 對話推上雲端繼續跑，手機或網頁接回。Pro $20/mo，Ultra $200/mo。Background Agents 可平行 8 個任務。

**[OpenAI Codex CLI](/posts/ai/2026-04-02-agent-cli-openai-codex/)** — 綁定 ChatGPT 訂閱，Plus $20/mo、Pro $200/mo。亮點是 **內建模型路由**：GPT-5.4 做規劃，GPT-5.4 mini 做子任務（只消耗 30% 配額）。CLI 支援 Plan 模式（用訂閱額度）與 API Key 模式（按 token 計費）雙軌。

**[Kiro CLI](/posts/ai/2026-04-02-agent-cli-kiro/)** — AWS 出品，實作 Agent Client Protocol (ACP)。免費 50 credits，Pro $20/mo 起。Auto 模式自動混合 Sonnet/Opus 等模型。Spec-Driven 開發流程是獨特賣點，Agent Hooks 實現本地自動化。

### 免費 / 開源

**[Gemini CLI](/posts/ai/2026-04-02-agent-cli-gemini-cli/)** — Google 開源，免費額度業界最慷慨：60 req/min、1,000 req/day，含 Gemini 2.5 Pro 和 1M token context window。Google 分析內部開發者使用量後，免費額度設為最高使用量的兩倍，意味著大多數人根本不需要付費。

**[OpenCode](/posts/ai/2026-04-02-agent-cli-opencode/)** — 開源 Go 語言 CLI，95K+ GitHub stars。支援 75+ 模型供應商（含本地 Ollama），可用 GitHub Copilot 或 ChatGPT Plus 帳號認證。完全免費，只付你選的模型 API 費用。

## 價格帶分析

### 免費：能走多遠？

| 工具 | 免費額度 | 可用模型 | 限制 |
|------|---------|---------|------|
| Gemini CLI | 1,000 req/day | Gemini 2.5 Pro | 最慷慨，多數人夠用 |
| OpenCode | 無限（開源） | 75+ 供應商 | 需自備 API key |
| Kiro CLI | 50 credits（永久） | Auto 模式 | 額度用完就沒了 |
| Codex CLI | 有限免費額度（ChatGPT Free） | GPT-5.4 mini | 需 ChatGPT 帳號，用量受限 |
| Cursor CLI | 免費方案（Hobby） | Auto 模式（有限） | 每月 2,000 completions |

### $20/月：主流級

Claude Code Pro、Cursor Pro、Codex Plus、Kiro Pro 都在這個價位。Claude Code 用 Sonnet，Cursor 用 Auto mode，Codex 用 GPT-5.2，Kiro 用 Auto 模式。實際可用量差異大。

### $100-200/月：重度使用

| 方案 | 價格 | 相對 Pro 的用量 |
|------|------|---------------|
| Cursor Pro+ | $60 | 3x |
| Claude Code Max 5x | $100 | 5x + Opus |
| Claude Code Max 20x | $200 | 20x + Opus |
| Cursor Ultra | $200 | 20x |
| Codex Pro | $200 | 6-7x |
| Kiro Power | $200 | 最高額度 |

Claude Code Max 方案的亮點是**吃到飽定價**，重度使用者的最佳選擇。

## Multi-Model Routing：核心概念

### 為什麼需要模型路由？

不是每個任務都需要 Opus。實際上：

- **~70% 的任務**：簡單查詢、格式化、改 typo → Haiku 就夠
- **~15-20% 的任務**：日常開發、code review → Sonnet 最佳
- **~10-15% 的任務**：架構設計、多檔重構、複雜 debug → 需要 Opus

盲目全用旗艦模型，等於 70% 的花費是浪費。

### 三層模型架構

實務證明，**三層**是最佳平衡點（超過三層增加複雜度但無顯著收益）：

```
┌─────────────────────────────────────────┐
│  Tier 3: Deep / 深度模式                │
│  Opus 4.6 / GPT-5.4                     │
│  架構決策、多檔重構、新問題解決          │
│  ~$15-30 / M tokens                     │
├─────────────────────────────────────────┤
│  Tier 2: Standard / 標準模式            │
│  Sonnet 4.6 / DeepSeek R1              │
│  日常開發、研究、內容生成               │
│  ~$3-8 / M tokens                       │
├─────────────────────────────────────────┤
│  Tier 1: Quick / 快速模式              │
│  Haiku / Gemini Flash-Lite / DeepSeek V3│
│  心跳、快速查詢、分類                   │
│  ~$0.5-1 / M tokens                     │
└─────────────────────────────────────────┘
```

### 路由判斷維度

主流路由器使用的評估維度：

1. **Token 數量**：長 prompt 通常代表複雜任務
2. **程式碼存在**：有程式碼的任務通常更需要推理能力
3. **推理標記**：出現 "why", "analyze", "design", "architect" 等關鍵字
4. **技術術語密度**：高密度暗示專業任務
5. **上下文長度**：需要理解大量上下文的任務需要更強模型
6. **輸出品質敏感度**：面向使用者的輸出需要更高品質

### 路由策略

**Budget Ladder（預算階梯）**：

```
1. 先用 Tier 1 嘗試
2. 驗證輸出品質
3. 品質不足 → 升級到 Tier 2 重試
4. 仍不足 → 升級到 Tier 3
```

適合：資料擷取、標記、短回覆等可驗證品質的任務。

**Classifier Routing（分類器路由）**：

```
1. 分類器分析請求複雜度（< 1ms）
2. 直接路由到對應 tier
3. 無需重試
```

適合：即時回應需求高的場景。

### 成本節省實例

| 使用者類型 | 無路由月費 | 有路由月費 | 節省 |
|-----------|-----------|-----------|------|
| 輕度使用 | $200 | $70 | 65% |
| 中度使用 | $500 | $150 | 70% |
| 重度使用 | $943 | $347 | 63% |

## 各家 CLI 的路由機制

### 已內建自動路由

- **[OpenAI Codex CLI](/posts/ai/2026-04-02-agent-cli-openai-codex/)**：GPT-5.4 做規劃與判斷，GPT-5.4 mini 處理子任務（只消耗 30% 配額）
- **[Kiro CLI](/posts/ai/2026-04-02-agent-cli-kiro/)**：Auto 模式結合大小模型，自動意圖識別與快取優化

### 支援手動切換

- **[Claude Code](/posts/ai/2026-04-02-agent-cli-claude-code/)**：可在 Opus / Sonnet / Haiku 間切換，搭配 subagent 架構
- **[Cursor CLI](/posts/ai/2026-04-02-agent-cli-cursor/)**：Auto mode 自動選模型，也可手動指定 Anthropic/OpenAI/Gemini
- **[Gemini CLI](/posts/ai/2026-04-02-agent-cli-gemini-cli/)**：可選擇不同 Gemini 模型，免費方案由系統自動分配

### 完全自由選擇

- **[OpenCode](/posts/ai/2026-04-02-agent-cli-opencode/)**：75+ 供應商，session 中途切換模型不丟上下文，搭配第三方路由器最靈活

## 開源路由工具

詳細介紹請見 **[Multi-Model Routing 開源工具與實作](/posts/ai/2026-04-02-multi-model-routing-opensource-tools/)**，這裡列出重點：

| 工具 | 特色 | GitHub |
|------|------|--------|
| **ruflo** | Claude 專用編排平台，CLI 內建任務分析 | [ruvnet/ruflo](https://github.com/ruvnet/ruflo) |
| **iblai-openclaw-router** | 14 維度加權評分器，< 1ms 決策 | [iblai/iblai-openclaw-router](https://github.com/iblai/iblai-openclaw-router) |
| **freerouter** | 自架路由器，支援手動覆蓋 `/max` | [openfreerouter/freerouter](https://github.com/openfreerouter/freerouter) |
| **agent-router** | 多 agent 智能路由，含負載均衡 | [dabit3/agent-router](https://github.com/dabit3/agent-router) |
| **llm-router** | NVIDIA 官方藍圖，意圖分析 | [NVIDIA-AI-Blueprints/llm-router](https://github.com/NVIDIA-AI-Blueprints/llm-router) |

## 設計你自己的多模型切換系統

如果要自建，建議的架構：

```
User Request
    │
    ▼
┌──────────────┐
│  Classifier  │  ← 14 維度評分（< 1ms）
│  (Haiku)     │
└──────┬───────┘
       │
   ┌───┴───┐
   ▼       ▼        ▼
┌──────┐ ┌──────┐ ┌──────┐
│Quick │ │ Std  │ │ Deep │
│Haiku │ │Sonnet│ │ Opus │
└──────┘ └──────┘ └──────┘
```

### 關鍵設計原則

1. **自動 + 手動覆蓋**：自動判斷為主，但允許 `/max`、`/quick` 等指令強制指定
2. **三層就夠**：Simple → Medium → Complex，超過三層徒增複雜度
3. **分類器要用最便宜的模型**：分類本身不該花太多成本
4. **監控與調整**：追蹤每層的使用比例，持續調整分類閾值

## 結論

2026 年的 Agent CLI 市場已經成熟到「不缺選擇，缺的是策略」。

**零成本起步**：Gemini CLI（1,000 req/day 免費）或 OpenCode（開源 + 自選 API）是最佳入門。

**專業使用**：Claude Code Max（$100/mo 吃到飽 + Opus）或 Codex Pro（$200/mo + 內建路由）。

**最大靈活性**：OpenCode + 第三方路由器（freerouter / ruflo），75+ 模型隨意切換。

不管哪種方案，核心原則不變：**把對的模型，用在對的任務上。**

---

## 系列文章

- [Claude Code 完整方案分析](/posts/ai/2026-04-02-agent-cli-claude-code/)
- [Cursor CLI 完整方案分析](/posts/ai/2026-04-02-agent-cli-cursor/)
- [OpenAI Codex CLI 完整方案分析](/posts/ai/2026-04-02-agent-cli-openai-codex/)
- [Kiro CLI (AWS) 完整方案分析](/posts/ai/2026-04-02-agent-cli-kiro/)
- [Gemini CLI 完整方案分析](/posts/ai/2026-04-02-agent-cli-gemini-cli/)
- [OpenCode 完整方案分析](/posts/ai/2026-04-02-agent-cli-opencode/)
- [Multi-Model Routing 開源工具與實作](/posts/ai/2026-04-02-multi-model-routing-opensource-tools/)

## 參考資料

- [AI Coding Agents 2026: Pricing & Features Compared | Lushbinary](https://www.lushbinary.com/blog/ai-coding-agents-comparison-cursor-windsurf-claude-copilot-kiro-2026/)
- [AI Coding Tools Pricing Comparison 2026 | NxCode](https://www.nxcode.io/resources/news/ai-coding-tools-pricing-comparison-2026)
- [Best AI Coding CLI Tools in 2026: 7 Terminal Agents Compared | Awesome Agents](https://awesomeagents.ai/tools/best-ai-coding-cli-tools-2026/)
- [Top 5 CLI Coding Agents in 2026 | DEV Community](https://dev.to/lightningdev123/top-5-cli-coding-agents-in-2026-3pia)
- [The 2026 Guide to Coding CLI Tools: 15 AI Agents Compared | Tembo](https://www.tembo.io/blog/coding-cli-tools-comparison)
- [awesome-cli-coding-agents | GitHub](https://github.com/bradAGI/awesome-cli-coding-agents)
- [The Multi-Model Routing Pattern: Cut AI Agent Costs by 78% | DEV Community](https://dev.to/askpatrick/the-multi-model-routing-pattern-how-to-cut-ai-agent-costs-by-78-1631)
- [Intelligent LLM Routing in Enterprise AI | Requesty](https://www.requesty.ai/blog/intelligent-llm-routing-in-enterprise-ai-uptime-cost-efficiency-and-model)

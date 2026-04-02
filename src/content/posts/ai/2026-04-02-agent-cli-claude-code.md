---
title: "Claude Code 完整方案分析：終端 Agent 的深度推理之王"
date: 2026-04-02
category: ai
tags: [agent-cli, claude-code, pricing, opus, sonnet, haiku, subagent, anthropic]
lang: zh-TW
tldr: "Claude Code 從 $20/mo Pro 到 $200/mo Max 20x，Opus 4.6 推理深度業界最強，Max 方案吃到飽定價讓重度使用者省下 90%+ 的 API 費用。"
description: "深入分析 Claude Code 2026 年的訂閱方案、API 定價、Subagent 架構、模型選擇策略、成本優化技巧與適用場景。"
draft: false
---

Claude Code 是 Anthropic 推出的終端機原生 AI coding agent。和其他工具不同的地方在於：它同時提供**吃到飽訂閱**和**按量 API**兩種定價路線，而且背後跑的 Opus 4.6 在深度推理場景幾乎沒有對手。

這篇拆解 Claude Code 的訂閱方案、API token 定價、模型選擇策略、Subagent 架構，以及在不同使用強度下的成本比較。

## 訂閱方案總覽

Claude Code 目前提供四種訂閱層級，Max 方案是重點——它是**固定月費、不限 token** 的吃到飽模式。

| 方案 | 月費 | 模型存取 | 用量額度 | 備註 |
|------|------|----------|----------|------|
| **Pro** | $20/mo | Sonnet（預設） | ~45 msg / 5hr | 基本方案，適合輕度使用 |
| **Max 5x** | $100/mo | Opus + Sonnet | 5x Pro 用量 | 解鎖 Opus，吃到飽 |
| **Max 20x** | $200/mo | Opus + Sonnet | 20x Pro 用量 | 重度使用者首選 |
| **Teams** | $25/seat/mo（月繳）<br>$20/seat/mo（年繳） | Sonnet + 團隊管理 | 團隊共享額度 | 企業需求 |

Max 方案的核心價值在於**固定費率**。有開發者實測紀錄：8 個月用了 Max 5x（$100/mo），累計消耗超過 **10B tokens**。同樣的量走 API 計價，費用超過 **$15,000**。換句話說，Max 讓他省下了 **95%** 的費用。

對於每天長時間使用 Claude Code 的開發者來說，Max 方案的 ROI 極高。Pro 方案則適合偶爾用來問問題或做小型修改的場景。

## API Token 定價

如果你選擇走 API 路線（自備 key），或需要在 CI/CD 中程式化呼叫 Claude，以下是目前的定價結構：

### 基礎定價

| 模型 | Input / M tokens | Output / M tokens | 說明 |
|------|-------------------|---------------------|------|
| **Opus 4.6** | $5 | $25 | 最強推理，複雜架構任務 |
| **Opus 4.6（fast mode）** | $30 | $150 | 低延遲版本，6x 價格 |
| **Sonnet 4.6** | $3 | $15 | 日常主力 |
| **Sonnet 4.6（long context >200K）** | $6 | $22.50 | 超長上下文加價 |
| **Haiku 4.5** | $1 | $5 | 輕量任務、Subagent |

### 成本折扣機制

| 機制 | 折扣幅度 | 說明 |
|------|----------|------|
| **Prompt Caching** | **90% off**（0.1x 原價） | 重複 prompt 前綴快取，效果顯著 |
| **Batch API** | **50% off** | 非即時批次處理，適合大規模任務 |

Prompt caching 是最容易被忽略的省錢手段。如果你的 system prompt 或 CLAUDE.md 內容固定不變，快取命中後 input token 只收原價的十分之一。在 Claude Code 的使用模式下，這幾乎是自動生效的。

## 模型選擇策略

Claude Code 讓你在同一個 session 裡切換模型。關鍵不是選「最好的」，而是選**最適合當下任務的**。

### 三層模型分工

| 層級 | 模型 | 適用場景 | 佔比 |
|------|------|----------|------|
| **深度推理** | Opus 4.6 | 複雜架構設計、跨系統重構、難 debug | ~10-15% |
| **日常主力** | Sonnet 4.6 | 一般開發、code review、測試撰寫 | ~80% |
| **輕量派遣** | Haiku 4.5 | Subagent 搜尋、格式轉換、簡單查詢 | ~5-10% |

Opus 4.6 在 SWE-bench 拿下 **80.9%** 的成績，是目前公開基準中推理能力最強的模型。但它的 token 成本也最高，所以只在真正需要深度思考的場景使用。

Sonnet 4.6 處理 80% 以上的日常工作綽綽有餘。它在速度和品質之間取得了很好的平衡，是 Claude Code 的預設選擇。

值得一提的是 **Sonnet 5（代號 Fennec）**，2026 年 2 月發布，SWE-bench 達到 **82.1%**，並引入了 **Dev Team 多代理模式**——可以同時派遣多個 agent 平行處理不同子任務。這是 Sonnet 系列首次在基準測試上超越前代 Opus。

## Subagent 架構

Claude Code 的 subagent 架構是控制成本和上下文長度的關鍵設計。

### 運作原理

主 session 遇到繁瑣但明確的任務時，可以**派遣子代理**去執行。子代理在獨立的上下文中完成工作，只把**摘要結果**回傳給主 session。

這帶來三個好處：

1. **主上下文保持精簡**——不會因為搜尋、讀檔等 verbose 操作撐爆 context window
2. **成本更低**——子代理可以指定用 Haiku 模型（`model:haiku`）
3. **平行處理**——多個子代理可以同時執行不同任務

### 典型用法

```
主 Session（Sonnet/Opus）
  ├── Subagent 1（Haiku）→ 搜尋 codebase 中所有 API endpoint
  ├── Subagent 2（Haiku）→ 列出所有測試檔案的覆蓋率
  └── Subagent 3（Haiku）→ 檢查 dependency 版本
  
  ← 三份摘要回傳主 session
  → 主 session 基於摘要做架構決策
```

對於大型 monorepo，這種模式特別有效。讓主 session 專注在高價值推理，把搜集資訊的苦工交給便宜的 subagent。

## 成本優化：Max vs API 比較

以下用實際場景比較兩種定價模式的差異：

| 使用強度 | 月估 token 消耗 | API 費用（Sonnet） | Max 方案費用 | 節省比例 |
|----------|-----------------|---------------------|-------------|----------|
| 輕度（偶爾用） | ~50M tokens | ~$150 | $20（Pro） | 87% |
| 中度（每天用） | ~500M tokens | ~$1,500 | $100（Max 5x） | 93% |
| 重度（整天用） | ~2B tokens | ~$6,000 | $200（Max 20x） | 97% |
| 極端（8 個月 10B） | ~1.25B/mo | ~$1,875/mo | $100（Max 5x） | 95% |

結論很明確：**只要你每天認真在用 Claude Code，Max 方案幾乎一定比 API 便宜**。API 定價只在低用量或需要程式化呼叫的場景才合理。

### 額外省錢技巧

- **善用 Prompt Caching**：固定的 CLAUDE.md 和 system prompt 會自動快取，省 90% input 費用
- **Batch API 處理非即時任務**：程式碼掃描、大量檔案格式化等不急的工作用 batch 跑，省 50%
- **正確分配模型**：不要用 Opus 做 Haiku 就能搞定的事
- **控制 context 長度**：善用 subagent 避免主 session 上下文膨脹

## Claude Code 的獨特優勢

和其他 Agent CLI 相比，Claude Code 有幾個明顯的差異化優勢：

1. **終端機原生**——不需要 IDE，SSH 到遠端伺服器也能直接用。對 terminal-first 的開發者來說，這是最自然的工作流程。

2. **深度推理能力**——Opus 4.6 的 80.9% SWE-bench 是公開模型中最高的。在需要理解複雜系統、追蹤多層 call stack 的場景中，這個差距很明顯。

3. **吃到飽定價**——Max 方案讓你不用擔心 token 用量，可以放心讓 agent 多探索、多嘗試。這改變了使用心態：你不再猶豫要不要讓它多讀幾個檔案。

4. **持久記憶（Max 限定）**——跨 session 的記憶系統讓 Claude Code 記住你的偏好、專案慣例、過去的決策。用越久越好用。

## 適用場景

Claude Code 特別適合以下工作模式：

- **複雜 debug**：追蹤跨多個檔案的 bug，需要深度推理和大量 context
- **架構設計**：新功能的系統設計、API 設計、資料模型設計
- **多檔案重構**：大規模 rename、pattern 遷移、框架升級
- **Terminal-first 開發者**：習慣在終端機裡完成所有事情的人

如果你的工作主要是在 IDE 裡做小範圍的 inline 修改，Cursor 或 Copilot 可能更順手。但如果你需要一個能理解整個 codebase 並執行多步驟任務的代理，Claude Code 是目前最強的選擇。

## 系列文章

這篇是 Agent CLI 系列的一部分。關於多模型路由和訂閱方案的跨工具比較，請參考：

**→ [Agent CLI 訂閱方案與多模型路由策略](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing/)**

## 參考資料

- [Plans & Pricing | Claude by Anthropic](https://claude.com/pricing)
- [Claude Code Pricing Guide 2026 | LaoZhang AI](https://blog.laozhang.ai/en/posts/claude-code-pricing-guide)
- [Claude Code Pricing in 2026: Every Plan Explained | SSD Nodes](https://www.ssdnodes.com/blog/claude-code-pricing-in-2026-every-plan-explained-pro-max-api-teams/)
- [Claude Code Pricing Guide: Which Plan Saves You Money | ksred](https://www.ksred.com/claude-code-pricing-guide-which-plan-actually-saves-you-money/)
- [Claude AI 2026: Complete Guide | NxCode](https://www.nxcode.io/resources/news/claude-ai-complete-guide-models-pricing-features-2026)

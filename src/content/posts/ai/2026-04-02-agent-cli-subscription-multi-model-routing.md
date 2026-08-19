---
title: "Agent CLI 訂閱方案全比較：打造可自由切換的多模型使用模式"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, multi-model-routing, claude-code, cursor, codex, kiro, gemini-cli, opencode, llm-router, cost-optimization]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 20
tldr: "比較六大 Agent CLI 的訂閱方案（Claude Code、Cursor CLI、Codex、Kiro、Antigravity/Gemini CLI、OpenCode），並研究多模型路由模式——簡單任務給便宜模型、複雜任務給強模型。各家計費在 2026 上半年幾乎全部改過一輪，這一版是 8/18 重新查證的結果。"
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
| **[Claude Code](/posts/ai/2026-04-02-agent-cli-claude-code)** | $20/mo | $100-200/mo | Opus / Sonnet / Haiku 三層手動切換 | 深度推理、複雜任務 |
| **[Cursor CLI](/posts/ai/2026-04-02-agent-cli-cursor)** | 免費 / $20/mo | $60-200/mo | 自家模型池 + 第三方模型池 | IDE ↔ CLI 無縫切換 |
| **[OpenAI Codex CLI](/posts/ai/2026-04-02-agent-cli-openai-codex)** | $8（Go）/ $20/mo | $100-200/mo | GPT-5.6 Sol / Terra / Luna 三檔 | OpenAI 生態系 |
| **[Kiro CLI](/posts/ai/2026-04-02-agent-cli-kiro)** | 免費（50 credits） | $100-200/mo | Auto 模式自動混合 | AWS 生態系 |
| **[Antigravity CLI](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)** | 依 Google AI 方案 | 依方案 | Gemini 系列 | Google 生態系 |
| **[OpenCode](/posts/ai/2026-04-02-agent-cli-opencode)** | 免費（開源） | 按 API 計費 | 75+ 模型供應商自由切換 | 模型自由、vendor 獨立 |

> **⚠️ 這一格的價格半衰期大約一季。** 2026 上半年這六家幾乎全部改過計費：Codex 從每則訊息改成按 token 計 credit 並多了 $100 的 Pro 5x、Cursor 拆成兩個額度池、Kiro 多了 Pro Max 一層、Gemini CLI 的個人免費方案直接消失。下面的數字是 2026/8/18 查證的，決策前請以各家官方頁為準。

## 各工具定位與特色

### 商業訂閱制

**[Claude Code](/posts/ai/2026-04-02-agent-cli-claude-code)** — Anthropic 的終端 agent，推理深度是強項。Pro $20/mo、Max 5x $100/mo、Max 20x $200/mo。額度以 5 小時滾動視窗加週上限計算，且網頁／桌面／手機／終端機**共用同一個池子**；用完可開 usage credits 以 API 費率續跑，不會硬停。Subagent 架構可指定便宜模型處理苦工。

**[Cursor CLI](/posts/ai/2026-04-02-agent-cli-cursor)** — 將 Cursor IDE 的 Agent 帶入終端。Interactive TUI + headless 模式，支援 Plan/Ask/Agent 三種模式。獨家 **Cloud Handoff**：CLI 對話推上雲端繼續跑，手機或網頁接回。Pro $20、Pro+ $60、Ultra $200。計費關鍵是**兩個獨立額度池**：自家模型（Grok 4.6/4.5、Composer 2.5）額度充裕，第三方模型按 API 價計費，方案分別內含 $20 / $70 / $400。

**[OpenAI Codex CLI](/posts/ai/2026-04-02-agent-cli-openai-codex)** — 綁定 ChatGPT 訂閱：Go $8、Plus $20、Pro 5x $100、Pro 20x $200。2026/4/2 起計費改為**按 token 計 credit**。模型是 GPT-5.6 的 Sol / Terra / Luna 三檔，用 Power 設定挑；**GPT-5.4 與 5.4 mini 於 2026/8/31 在 ChatGPT 登入模式下退場**。CLI 支援 Plan 模式（吃訂閱額度）與 API Key 模式（按 token 計費）雙軌。

**[Kiro CLI](/posts/ai/2026-04-02-agent-cli-kiro)** — AWS 出品，實作 Agent Client Protocol (ACP)。Free 50 credits、Pro $20/1,000、Pro+ $40/2,000、Pro Max $100/5,000、Power $200/10,000，加購一律 $0.04/credit。Auto 模式自動混合模型，同一任務改走單一 frontier 模型要 1.3 倍 credit。Spec-Driven 開發流程是獨特賣點。

### 免費 / 開源

**[Antigravity CLI](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)** — Google 的終端 agent。**注意：前身 Gemini CLI 那個「每天 1,000 次免費」的方案已於 2026/6/18 對個人帳號終止**，Gemini CLI 只剩企業授權與付費 API key 兩條路。Antigravity CLI 以 Go 重寫、不再開源，主打非同步背景工作流。

**[OpenCode](/posts/ai/2026-04-02-agent-cli-opencode)** — 開源 **TypeScript** CLI，MIT 授權，~198K GitHub stars。支援 75+ 模型供應商（含本地 Ollama），可用 GitHub Copilot 或 ChatGPT 帳號認證。工具完全免費，只付你選的模型費用；另有官方策展的 Zen gateway 可選。

## 價格帶分析

### 免費：能走多遠？

| 工具 | 免費額度 | 限制 |
|------|---------|------|
| OpenCode | 無限（開源） | 需自備 API key 或用既有 Copilot / ChatGPT 帳號 |
| Kiro CLI | 50 credits（永久） | 分數計費所以比帳面耐用，但用完就沒了 |
| Codex CLI | ChatGPT Free 的有限額度 | 夠試不夠做事，實用門檻是 Go 方案 $8 |
| Cursor CLI | Hobby 方案 | 有限的 Agent 請求，可用 Composer |
| Antigravity / Gemini CLI | ❌ | **個人免費方案已於 2026/6/18 終止** |

免費這一格在 2026 上半年明顯縮水——最慷慨的那個選項直接消失了。現在真正「零成本可持續」的只剩 OpenCode 這種自備 key 的開源路線。

### $20/月：主流級

Claude Code Pro、Cursor Pro、Codex Plus、Kiro Pro 都在這個價位，但買到的東西差很多：Claude Code 給的是共用池的 5 小時視窗額度，Cursor 給的是充裕的自家模型額度加 $20 的第三方額度，Codex 給的是 1x 基準的 credit，Kiro 給的是 1,000 credits。**同價不同物，要看你的工作是不是落在它便宜的那一格。**

### $100-200/月：重度使用

| 方案 | 價格 | 內容 |
|------|------|------|
| Cursor Pro+ | $60 | 內含 $70 第三方模型額度 |
| Claude Code Max 5x | $100 | 5x Pro 額度 |
| Codex Pro 5x | $100 | 5x Plus，以寫程式為主的層級 |
| Kiro Pro Max | $100 | 5,000 credits |
| Claude Code Max 20x | $200 | 20x Pro 額度 |
| Cursor Ultra | $200 | 內含 $400 第三方模型額度 |
| Codex Pro 20x | $200 | 20x Plus + 完整 Pro 套組 |
| Kiro Power | $200 | 10,000 credits |

$100 這一層在 2026 上半年變擁擠了——Codex 和 Kiro 都新增了這個價位，過去只有 Claude Code Max 5x 站在這裡。如果你的用量卡在 Pro 不夠、$200 太多，現在選擇比半年前多。

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
│  各家旗艦（Opus 級 / Sol 級）           │
│  架構決策、多檔重構、新問題解決          │
│  ~$15-30 / M tokens（output）           │
├─────────────────────────────────────────┤
│  Tier 2: Standard / 標準模式            │
│  各家中階（Sonnet 級 / Terra 級）       │
│  日常開發、研究、內容生成               │
│  ~$3-15 / M tokens（output）            │
├─────────────────────────────────────────┤
│  Tier 1: Quick / 快速模式              │
│  各家輕量（Haiku 級 / Luna 級 / Flash） │
│  心跳、快速查詢、分類                   │
│  ~$0.5-5 / M tokens（output）           │
└─────────────────────────────────────────┘
```

（這裡刻意只寫層級不寫型號：型號每季換一輪，層級結構不會。）

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

### 成本節省的量級

各家路由工具宣稱的節省幅度落在 **40-85%**，實際數字高度取決於你的任務分布——如果你的工作本來就集中在複雜任務，路由能省的有限。

要注意這類數字多半是拿「全部走旗艦模型」當基準算出來的，而那本來就不是理性的用法。**比較誠實的問法不是「路由能省幾成」，而是「我有多少比例的任務其實不需要旗艦模型」**——先量這個，再決定值不值得為路由增加系統複雜度。

## 各家 CLI 的路由機制

### 已內建自動路由

- **[Kiro CLI](/posts/ai/2026-04-02-agent-cli-kiro)**：Auto 模式結合 frontier 與專用模型，自動意圖識別與快取優化；官方數字是同一任務改走單一 frontier 模型要 1.3 倍 credit
- **[Cursor CLI](/posts/ai/2026-04-02-agent-cli-cursor)**：Auto 模式自動選模型；**Cursor Router** 正在推出（先 Teams / Enterprise，個人方案晚幾個月）

> 原本這裡列的「Codex：GPT-5.4 規劃 + mini 執行、mini 只吃 30% 額度」已經不是現況——Codex 現在是讓你用 Power 設定在 GPT-5.6 三檔之間挑，不是固定的大小模型分工。

### 支援手動切換

- **[Claude Code](/posts/ai/2026-04-02-agent-cli-claude-code)**：可在 Opus / Sonnet / Haiku 間切換，搭配 subagent 架構
- **[OpenAI Codex CLI](/posts/ai/2026-04-02-agent-cli-openai-codex)**：用 Power 設定在 GPT-5.6 Sol / Terra / Luna 之間挑，或走 Advanced 指定型號與 reasoning effort
- **[Cursor CLI](/posts/ai/2026-04-02-agent-cli-cursor)**：可手動指定各家 frontier model，但要注意扣的是第三方模型那個池子

### 完全自由選擇

- **[OpenCode](/posts/ai/2026-04-02-agent-cli-opencode)**：75+ 供應商，session 中途切換模型不丟上下文，搭配第三方路由器最靈活

## 開源路由工具

詳細介紹請見 **[Multi-Model Routing 開源工具與實作](/posts/ai/2026-04-02-multi-model-routing-opensource-tools)**，這裡列出重點：

| 工具 | 特色 | GitHub |
|------|------|--------|
| **ruflo** | Claude 專用編排平台，CLI 內建任務分析 | [ruvnet/ruflo](https://github.com/ruvnet/ruflo) |
| **claw-router** | 14 維度加權評分器，< 1ms 決策（原 `iblai-openclaw-router`，已改名） | [iblai/claw-router](https://github.com/iblai/claw-router) |
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

**零成本起步**：OpenCode（開源 + 自選 API）現在幾乎是唯一選項——Gemini CLI 那個 1,000 req/day 的免費方案已在 2026/6 終止。

**專業使用**：Claude Code Max 5x（$100）或 Codex Pro 5x（$100）——$100 這一層在 2026 上半年多了選擇。

**最大靈活性**：OpenCode + 第三方路由器（freerouter / ruflo），75+ 模型隨意切換。

不管哪種方案，核心原則不變：**把對的模型，用在對的任務上。**

---

## 參考資料

- [Plans & Pricing | Claude by Anthropic](https://claude.com/pricing)
- [Pricing – Codex | OpenAI Developers](https://developers.openai.com/codex/pricing)
- [Codex rate card | OpenAI Help Center](https://help.openai.com/en/articles/20001106-codex-rate-card)
- [Cursor · Pricing](https://cursor.com/pricing)
- [Models & Pricing | Cursor Docs](https://cursor.com/docs/models-and-pricing)
- [Pricing - Kiro](https://kiro.dev/pricing/)
- [Google Developers Blog：Transitioning Gemini CLI to Antigravity CLI](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [OpenCode | GitHub](https://github.com/anomalyco/opencode)

## 更新紀錄

- 2026-08-18：六家的計費在 2026 上半年幾乎全部改過，整篇對照官方頁重算。①**Gemini CLI 個人免費方案已於 6/18 終止**，該格改為 Antigravity CLI，並在免費方案分析中標明這一格已消失；②Codex 補上 Go $8 與 Pro 5x $100、計費改為按 token 計 credit、模型換成 GPT-5.6 三檔，**移除已非現況的「GPT-5.4 + mini 只吃 30% 額度」路由描述**；③Cursor 改為兩個額度池（自家模型／第三方 $20-$400），補上推出中的 Cursor Router；④Kiro 補上 Pro Max $100 並修正 Power 額度（15,000 → 10,000）；⑤Claude Code 的「吃到飽」改為 5 小時視窗 + 週上限 + usage credits 的實際機制；⑥三層架構圖移除寫死型號；⑦修正改名的 `iblai/claw-router`；⑧「成本節省實例」那張精確到個位數的表沒有可查證來源，改為量級描述與一個更實際的判斷問法

---
title: "LLM 知識庫的三種模式：研究者、進化者、部落格"
date: 2026-04-03
category: ai
tags: [llm-knowledge-base, obsidian, knowledge-management, fine-tuning, rag, claude-code, karpathy]
lang: zh-TW
tldr: "Andrej Karpathy 提出用 LLM 編譯個人知識 wiki 的框架——收集原始資料、LLM 編譯成 .md wiki、對 wiki 做 Q&A、輸出歸檔回 wiki。本文比較三種實踐路線：Karpathy 的研究者模式、社群的持續進化模式、以及 quidproquo 的部落格模式。"
description: "深入分析 Andrej Karpathy 的 LLM Knowledge Bases 框架，對照社群延伸實踐（session continuity、語音轉錄、跨 AI 同步、微調、知識衰減）與 quidproquo.cc 的部落格架構，探討 LLM 驅動知識管理的產品化方向。"
draft: false
---

Andrej Karpathy 最近在 X 上分享了他用 LLM 建個人知識庫的做法，引起廣泛討論。他的核心觀點是：與其把 token 花在操作程式碼，不如花在操作知識。這篇整理他的框架、社群的延伸實踐，以及 quidproquo.cc 在同一方向上走出的不同路線。

## Karpathy 的框架：LLM 作為知識編譯器

Karpathy 的做法可以拆成五個階段：

**Data Ingest → Compile → Q&A → Output → Linting**

1. **資料收集**：把文章、論文、repo、資料集、圖片放進 `raw/` 目錄，用 Obsidian Web Clipper 擷取網頁並下載相關圖片到本地
2. **LLM 編譯**：LLM 增量把 `raw/` 編譯成一個 `.md` wiki——寫摘要、建 backlinks、分類成概念文章、互相連結
3. **Q&A 查詢**：wiki 長到一定規模（~100 篇文章、~400K 字）後，直接對 wiki 提問，LLM 自動維護 index 和摘要，不需要額外的 RAG
4. **輸出歸檔**：輸出格式包括 markdown、Marp slides、matplotlib 圖表，查詢結果 filing 回 wiki，知識持續累積
5. **Linting 健檢**：LLM 定期掃描 wiki，找不一致的資料、補缺漏、建議新文章主題

前端用 Obsidian 瀏覽所有內容。關鍵原則是：**人幾乎不手動編輯 wiki，wiki 是 LLM 的領域。**

他在推文最後說：

> I think there is room here for an incredible new product instead of a hacky collection of scripts.

## 社群延伸：從知識編譯到持續進化

有人在 Karpathy 的基礎上提出了更完整的架構，加入了五個 Karpathy 沒有觸及的維度。

### Session Continuity：跨對話的連續性

用 Claude Code 的 `PreCompact` / `PostCompact` hooks 在 context 壓縮前自動存檔狀態、壓縮後自動恢復。解決的是「對話太長就忘記剛才在做什麼」的問題。

Karpathy 不需要這個，因為他的知識存在檔案裡，不依賴 context window。但對於把 AI 當工作夥伴用的人來說，session 連續性是基本需求。目前已有 Continuous-Claude-v3、ContextVault、claude-session-continuity-mcp 等開源方案。

### 語音轉錄：文字捕捉不到的信號

除了文章和程式碼，把語音對話也納入知識庫。用 Typeless 錄下 28,000+ 筆語音轉錄，再用 Gemini Pro 做意圖分類。發現用關鍵字分類的「稱讚」有 97% 是誤判——因為文字 sentiment analysis 缺乏韻律學資訊：語調、停頓、語速攜帶了文字無法捕捉的意圖信號。

### 跨 AI 工具同步：一個 AI 學到的，所有 AI 都知道

同時用 Claude Code、Codex、Gemini CLI 的最大痛點是知識不互通。寫了一個 bridge 模組，自動把高 confidence 的知識萃取成各工具的指令檔同步。

這個需求已經被社群驗證——目前有 claude_code_bridge（多 AI 即時協作）、skillshare（一鍵同步 skills 到所有 CLI 工具）、gemini-context-bridge（CLAUDE.md → GEMINI.md 自動轉換）等開源方案。

### 微調：Karpathy 說「未來想探索」，有人已經在做

Karpathy 在推文最後提到「synthetic data + finetuning」作為未來方向。社群已經用 Unsloth + Google Colab 基於 Qwen3-14B 跑了 16 代微調，每代花不到 $1。Unsloth 支援在免費 Colab T4 GPU 上運行，宣稱 2x 速度、70% VRAM 節省。關鍵設計是讓系統自動追蹤訓練材料是否足夠，累積夠了才觸發訓練。

### Confidence Decay：知識要有衰減機制

wiki 會越長越肥。加入 confidence decay——90 天沒被用到的知識自動降權，半年沒用的標記過時。但「血的教訓」（犯過的重大錯誤）永遠不衰減。

這對應認知科學中的 Ebbinghaus 遺忘曲線，也有 AI 記憶系統的實作——Mnemex 實現了類人遺忘曲線的時序記憶，ZenBrain 提出 7 層記憶架構，包含 FSRS 間隔重複和 Bayesian confidence propagation。

## 三種模式的對照

同樣是「用 LLM 管理知識」，三條路線走出了不同的取捨：

| 面向 | Karpathy（研究者模式） | 社群延伸（進化模式） | quidproquo.cc（部落格模式） |
|------|----------------------|-------------------|--------------------------|
| 核心理念 | 把 token 花在操作知識 | 讓 AI 每輪對話都持續進化 | LLM 編譯公開知識系統 |
| 知識存在哪 | 本地 `.md` wiki 目錄 | Obsidian vault + AI 記憶 | Astro `.md` + Cloudflare D1 |
| 資料來源 | 文章、論文、repo、圖片 | 同上 + 語音轉錄（Typeless） | 對話、外部文件爬取 |
| 編譯流程 | LLM 增量編譯 wiki | Session 結束時自動掃描歸檔 | `/post` skill 把對話轉成結構化文章 |
| 索引方式 | LLM 自維護 index，不需 RAG | 未特別說明 | Cloudflare Vectorize 語義索引 |
| 前端瀏覽 | Obsidian + Marp slides | Obsidian | Astro SSG 公開網站 |
| 外部資料處理 | Obsidian Web Clipper | 未特別說明 | Browser Rendering API → 分塊 → D1 |
| 品質維護 | LLM health checks | Vault Governance（孤立筆記、過時內容） | OpenSpec workflow 生命週期 |
| 時間維度 | ❌ 無衰減 | ✅ Confidence decay（90 天降權） | ❌ 無衰減 |
| Session 連續性 | ❌ 不需要（知識在檔案裡） | ✅ PreCompact/PostCompact hooks | ✅ Claude Code hooks |
| 錯誤學習 | ❌ 無自動機制 | ✅ 錯誤計數器，3 次升級為規則 | ❌ 無自動機制 |
| 跨工具同步 | ❌ 單一 LLM | ✅ Bridge 模組同步多工具 | ❌ 單一工具鏈 |
| 微調 | 未來想做 | 已跑 16 代（Unsloth + Qwen3） | RAG 優先，微調在研究階段 |
| 輸出格式 | Markdown、slides、圖表、web UI | 未強調 | Blog 文章 |
| 開放程度 | 🔒 私人 | 🔒 私人 | 🌐 公開 |
| 基礎設施 | 本地檔案系統 | 本地 + CLI hooks | Cloudflare Workers + D1 + Vectorize + KV |
| 人的角色 | 消費者——不碰 wiki | 策展者——設定規則讓系統執行 | 策展者——審閱後公開發布 |
| 成熟度 | 自稱 hacky scripts | 有架構但未產品化 | 產品化架構（migrations、rate limiting） |

三者的共同哲學：**知識是 LLM 的領域，人負責提問和策展，不手動寫內容。**

差異在定位——Karpathy 服務於個人研究，社群模式追求 AI 的持續學習能力，quidproquo 把產出變成公開的、有索引的、有基礎設施支撐的公開部落格。

## 產品化的空間在哪

Karpathy 說得直白：「這裡有空間做一個 incredible new product，而不只是 hacky scripts。」

目前的三條路線各有侷限：

- **Karpathy 模式**需要手動管理 `raw/` 目錄和觸發編譯，門檻在工程能力
- **社群進化模式**靠 hooks + bridge + 微調，整合成本高，各元件之間缺乏統一介面
- **quidproquo 部落格模式**有產品化架構（schema migrations、rate limiting、audit logging），但定位在部落格而非通用知識庫

缺的是一個把這三者整合的產品：自動收集 → LLM 編譯 → 語義索引 → 跨工具同步 → 衰減治理 → 多格式輸出，而且不需要使用者懂 CLI 或寫 hooks。

ContextVault、Mnemex、Continuous-Claude-v3 等開源專案各自解決了一角，但還沒有人做出 Karpathy 口中的那個完整產品。這或許是 2026 年最值得關注的 AI 工具方向之一——不是讓 AI 寫更多程式碼，而是讓 AI 管理你的知識。

## 參考資料

- [Karpathy — LLM Knowledge Bases 推文](https://x.com/karpathy/status/2039805659525644595)
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
- [Claude Code Hooks 官方文件](https://code.claude.com/docs/en/hooks)
- [awesome-agent-skills — Cross-Tool Agent Skills](https://github.com/VoltAgent/awesome-agent-skills)

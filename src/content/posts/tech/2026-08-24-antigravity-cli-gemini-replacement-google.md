---
title: "Antigravity CLI：Google 用閉源 Go binary 取代十萬星開源 Gemini CLI"
date: 2026-08-24
category: tech
type: deep-dive
tags: [antigravity-cli, coding-agent, cli, google, ai-tools, harness-engineering, gemini]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 27
tldr: "2026 年 5 月 Google I/O 宣布 Antigravity CLI（agy），用閉源 Go binary 取代 Apache 2.0 的 Gemini CLI。技術上升級——多 agent 編排、原生沙箱、毫秒啟動——但免費額度砍 98%、開源轉閉源、28 天過渡期，社群反應強烈。"
description: "Antigravity CLI 取代 Gemini CLI 的技術架構分析：Go 重寫、多 agent 編排、原生沙箱，以及開源轉閉源爭議與免費額度大幅縮減的影響。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google-en)

Gemini CLI 是 Google 在 2025 年推出的開源 coding agent，Apache 2.0 授權，累積超過 100,000 顆星和 6,000+ 條合併的社群 PR。2026 年 5 月 19 日，Google I/O 宣布它的替代品：[Antigravity CLI](https://antigravity.google)（binary 名稱 `agy`），一顆閉源的 Go binary。

6 月 18 日，Gemini CLI 對免費版、Pro 和 Ultra 使用者停止服務。從公告到關閉，28 天。

## 從 Gemini CLI 到 Antigravity CLI

時間線：

- **2026-05-19**：Google I/O 2026 發布 Antigravity 2.0 平台，agy 是其中的終端元件
- **2026-05-20**：官方部落格文章標題：「An important update: Transitioning Gemini CLI to Antigravity CLI」
- **2026-06-18**：Gemini CLI 對免費 / Pro / Ultra 使用者停止回應請求
- **例外**：Gemini Code Assist Standard/Enterprise 授權和付費 Gemini API key 繼續運作

Antigravity CLI 不是 Gemini CLI 的漸進升級。它是完全重寫——從 TypeScript/Node.js 換成 Go，從開源換成閉源，從社群共建換成 Google 單方面控制。

## 技術架構

### Go 取代 TypeScript

Gemini CLI 用 Node.js，啟動時間和記憶體都受限於 V8 runtime。Antigravity CLI 編譯成單一 Go binary，啟動時間在毫秒級，記憶體佔用個位數 MB。

這個選擇的代價是社群參與。TypeScript 的 Gemini CLI 有 6,000+ 條社群 PR；Go binary 沒有公開原始碼，不接受外部貢獻。

### 多 agent 編排

agy 內建非同步子 agent 編排器。主對話不會被背景任務阻塞——文件查詢、建置、驗證可以由子 agent 平行處理。

這跟 [dsh](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel) 的 plugin 式子代理和 [OMP 2](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness) 的 typed tool registry 是不同的路線。dsh 讓你換掉 agent loop 的每一層；OMP 2 把所有工具編進一顆 binary；agy 把多 agent 做成平台內建能力，使用者不需要自己設定。

### 原生沙箱

agy 用作業系統原生的沙箱機制隔離執行，啟動零額外開銷。相比之下，大多數 coding agent 的沙箱依賴 Docker 或 VM，啟動成本在秒級。

### 模型支援

預設模型是 Gemini 3.5 Flash。付費方案另外支援 Gemini 3.1 Pro、Claude Sonnet 4.6、Claude Opus 4.6，以及 GPT-OSS 120B。一個 Google 的 CLI 工具支援 Anthropic 和 OpenAI 的模型——這在 Gemini CLI 時代是不存在的。

## 121 個指令

agy 有 121 個指令（子命令、flag、slash 命令、plugin、快捷鍵、設定）。保留了 Gemini CLI 的核心概念——Agent Skills、Hooks、Subagents、MCP servers——並把 Extensions 改名為 Plugins。

從 Gemini CLI 遷移有專用指令：

```bash
agy plugin import gemini
```

這會把舊的 Gemini CLI extension 轉成 Antigravity plugin 格式。不過首發時並非所有 Gemini CLI 功能都有對應——部分整合模式缺失，MCP 設定有一個欄位會靜默失敗。

## 定價與額度

| 方案 | 月費 | 每日請求數 | 模型 |
|---|---|---|---|
| Free | $0 | ~20 | Gemini Flash |
| Pro | ~$20 | 較多（5 小時重置週期） | 多模型 |
| Ultra | $100 | 更多 | 所有模型 |
| Ultra Max | $200 | 最高 | 所有模型 |
| Credits | 每個 $0.01 | 超額時使用 | 依方案 |

Gemini CLI 免費版的每日請求數大約是 1,000。Antigravity CLI 砍到 ~20，降幅 98%。社群回報大約 6-7 個 prompt 就會碰到限制。

## 開源轉閉源

這是 Antigravity CLI 最大的爭議。

Gemini CLI 是 Apache 2.0，有活躍的社群。contributor Andrea Alberti 在政策轉向當天剛合併了一個 27-commit 的 PR，公開質問社群貢獻者是否在「為企業 codebase 做無償勞動」。

[google-antigravity/antigravity-cli](https://github.com/google-antigravity/antigravity-cli) 這個 GitHub repo 存在，但只有文件和 issue tracker，不含原始碼。

The New Stack 的報導標題：「Google pushes Pro, Ultra, and free users from open-source Gemini CLI to closed-source Antigravity CLI」。

技術上，Go 重寫和多 agent 編排確實是進步。但授權和定價的改變蓋過了技術面的討論。

## 跟其他 Coding Agent 的對照

| | Antigravity CLI | Claude Code | Pi v2 | dsh |
|---|---|---|---|---|
| 語言 | Go | TypeScript | TypeScript | TypeScript |
| 開源 | 閉源 | 閉源 | MIT | MIT |
| 多 agent | 內建編排器 | 單 session | 單 session | Cordis plugin |
| 沙箱 | 原生 OS | Docker | 無 | 無 |
| 免費額度 | ~20/天 | 無免費版 | 無限（自帶 API key） | 無限（自帶 API key） |
| 模型 | 多模型 | Claude 限定 | 自選 | 自選 |

agy 的定位是 Google 生態系的入口——如果你的工作流程已經在 Google Cloud 上，agy 的整合會是最順的。但如果你要開源、可控、不受額度限制的工具，[Pi v2](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable) 或 [Opencode 2](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent) 是完全不同方向的選擇。

## 整體來說

Antigravity CLI 在技術上是 Gemini CLI 的全面升級——Go binary 更快更輕、多 agent 編排是真正的功能跳躍、原生沙箱解決了啟動成本。

但它的推出方式損害了信任。100,000 星的開源專案、6,000 條社群 PR、28 天過渡期、98% 的額度刪減——這些數字說的不是技術問題，是關係問題。

在 [H2 2026 的 harness 大戰](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape)裡，agy 代表的是一種路線：**平台廠商把 coding agent 收進自己的閉源生態系**。Google 不是唯一這樣做的——Meta 的 [Muse Code](/posts/tech/2026-08-24-muse-code-meta-coding-agent) 也是閉源。問題是這條路線能不能留住已經習慣開源工具的開發者。

## 參考資料

- [Antigravity CLI 官方網站](https://antigravity.google)
- [google-antigravity/antigravity-cli（GitHub）](https://github.com/google-antigravity/antigravity-cli)
- [Google I/O 2026 Keynote](https://io.google/2026/)
- 站內：[OMP 2：從 Pi fork 到全 Rust 重寫](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness)
- 站內：[Pi v2：AgentHarness API 升穩](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable)
- 站內：[Opencode 2：Bun 換 Node、Tauri 換 Electron](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent)
- 站內：[DeepSeek Harness（dsh）：Everything is a Plugin](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel)
- 站內：[2026 下半年 Harness 大戰](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape)

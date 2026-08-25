---
title: "Grok Build：xAI 的 Rust Coding Agent，開源之前先把你的 repo 傳上去了"
date: 2026-08-24
category: tech
type: deep-dive
tags: [grok-build, coding-agent, cli, xai, rust, ai-tools, harness-engineering, privacy]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 29
tldr: "Grok Build 是 xAI 用 Rust 寫的 coding agent，845K 行程式碼、8 個平行子 agent、Arena Mode。2026 年 5 月 beta、7 月開源（Apache 2.0）——但開源的直接原因是隱私事件：它靜默把整個 repo（含 SSH key、.env）上傳到 Google Cloud Storage，27,800 倍的流量比。資料外洩的程式碼至今還在 binary 裡，只靠 server-side flag 關閉。"
description: "xAI Grok Build 的 Rust 架構、Arena Mode、8 個平行子 agent，以及導致開源的隱私事件：靜默上傳整個 repo 的技術細節、社群反應與信任問題。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-24-grok-build-xai-privacy-incident-en)

2026 年 5 月 14 日，xAI（SpaceXAI）發布 [Grok Build](https://github.com/xai-org/grok-build) beta，限 SuperGrok Heavy 訂閱者（$299/月）。5 月 25 日擴大到所有 SuperGrok 和 X Premium+ 使用者。

7 月 15 日，Apache 2.0 開源。

開源的時間點不是巧合。三天前，安全研究員 Cereblab 公開了 wire-level 網路擷取，證明 Grok Build 在使用者不知情的情況下把整個 repo 上傳到 Google Cloud Storage。

## 隱私事件

### 發現

2026 年 7 月 12 日，Cereblab 發表研究報告，附上完整的網路流量擷取。

### 上傳了什麼

**整個 Git repository**，包含：
- 完整的 commit history
- `.env` 檔案（API key、資料庫密碼）
- SSH key
- Webhook secrets
- 甚至已經被刪除但還在 Git history 裡的憑證

在一個 12 GB 的測試 repo 上，Grok Build 上傳了 **5.10 GiB** 的資料（全部 HTTP 200），而同一個 session 裡模型對話只用了 **192 KB**。上傳流量是對話流量的 **27,800 倍**。

### 隱私開關沒有作用

Grok Build 的設定裡有一個 "Improve the model" 開關。關閉它不會阻止上傳。

### 修復

7 月 13 日左右，xAI 透過 **server-side 設定變更**停止上傳。不需要客戶端更新。

問題是：安全研究者確認，**資料外洩的程式碼仍然在開源的 binary 裡**，只是被 server-side flag 關閉。xAI 可以在不更新客戶端的情況下重新啟用上傳。

### xAI 的回應

- 聲稱 ZDR（zero data retention）一直被遵守
- Andrew Milich（專案負責人）引用他的隱私背景（Skiff，E2EE 應用程式）
- Musk 承諾刪除所有已上傳的資料
- 承認在 early beta 期間，非 ZDR 使用者的資料保留是預設開啟的
- 7 月 15 日開源，框架為「讓開發者可以自己審核工具的行為」

## 技術架構

撇開隱私事件不談，Grok Build 在技術上有幾個值得分析的選擇。

### Rust，845K 行

Grok Build 是一個 Cargo workspace，主要 binary crate 是 `xai-grok-pager-bin`。845,000 行 Rust 程式碼（GitHub 語言統計 51M+ bytes）。

為什麼這麼大？因為它是從 SpaceXAI 內部 monorepo 定期同步出來的提取物，不是從頭為開源寫的。這意味著：

- 程式碼量大不代表架構複雜度高——部分是 monorepo 的附帶產物
- **不接受外部貢獻**——README 明確寫著「periodically synced from SpaceXAI monorepo」，社群只能 fork，不能上游

這跟 [OMP 2](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness) 的 Rust 選擇是不同的。OMP 2 的 ~41 個 crate 是從頭設計的模組化架構；Grok Build 的 845K 行是企業 monorepo 的切片。

### 8 個平行子 agent

Grok Build 支援最多 8 個並行子 agent，每個在自己的 git worktree 裡執行。工作流程分三階段：plan → search → build。

### Arena Mode

Arena Mode 是 Grok Build 的獨特功能：產生**競爭的 agent 輸出**，並排顯示，附帶 context 使用量追蹤器。一個專門的裁判 session 對結果排名。

這個設計假設是：一次呼叫可能不夠好，讓多個 agent 競爭再挑最好的。代價是 token 消耗——Arena Mode 至少用掉兩倍的推論成本。

### 全螢幕 TUI

Grok Build 的 TUI 是全螢幕的，支援滑鼠互動，有類似瀏覽器的分頁（edit/files/plans/search）。相比之下，大多數 coding agent CLI 是基於行的 REPL 介面。

### 模型支援

- 預設：`grok-build-0.1`（專用 coding 模型，256K context）
- 複雜推理：Grok 4.3（2M context）
- 最新預設（8 月 12 日起）：Grok 4.6（500K context）
- 支援透過 OpenRouter 路由到任意模型，session 內 `/model` 切換

## 安裝

```bash
# macOS / Linux
curl -fsSL https://x.ai/cli/install.sh | bash

# 從原始碼建置
git clone https://github.com/xai-org/grok-build
cargo build -p xai-grok-pager-bin --release
```

首次啟動需要瀏覽器認證。

## 目前狀態

Public beta。約 24,500 顆星（開源後 20 小時內衝到 12,100）。Apache 2.0 但不接受外部 PR。

## 跟其他 Coding Agent 的對照

| | Grok Build | OMP 2 | Claude Code | dsh |
|---|---|---|---|---|
| 語言 | Rust (845K LOC) | Rust (~41 crates) | TypeScript | TypeScript |
| 開源 | Apache 2.0（唯讀） | MIT | 閉源 | MIT |
| 平行 agent | 8 個 + Arena Mode | 不明 | 單 session | Cordis plugin |
| 隱私事件 | 有（repo 上傳） | 無 | 無 | 無 |
| Rust 架構 | Monorepo 提取 | 從頭設計 | N/A | N/A |
| 外部貢獻 | 不接受 | 接受 | N/A | 接受 |

## 整體來說

Grok Build 有幾個技術上的亮點——Arena Mode 是獨特的品質保證機制、8 個平行子 agent 是目前最大的並行度、全螢幕 TUI 的互動性比行式 REPL 好。

但隱私事件是一個無法迴避的問題。不是因為 bug 被修了就結束了——資料外洩的程式碼**還在 binary 裡**，只靠 server-side flag 關閉。這意味著你在使用 Grok Build 時，信任的不是程式碼，是 xAI 的政策決定。

開源通常是信任的基礎。但 Grok Build 的開源有兩個限制：不接受外部貢獻（所以社群無法修改行為），以及開源的動機是回應隱私事件（所以開源本身是危機公關的一環）。

在 [H2 2026 的 harness 大戰](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape)裡，Grok Build 的隱私事件是一個對所有 coding agent 的警告：**使用者把整個 codebase 的存取權交給 agent，agent 必須值得這份信任**。

## 參考資料

- [xai-org/grok-build（GitHub）](https://github.com/xai-org/grok-build)
- [Cereblab 隱私研究報告](https://cereblab.com/research/grok-build-privacy)
- [Simon Willison 的分析](https://simonwillison.net/)
- 站內：[OMP 2：從 Pi fork 到全 Rust 重寫](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness)
- 站內：[DeepSeek Harness（dsh）：Everything is a Plugin](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel)
- 站內：[2026 下半年 Harness 大戰](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape)

---
title: "Muse Code：Meta 的第一個 Coding Agent，用訓練權換八折定價"
date: 2026-08-24
category: tech
type: deep-dive
tags: [muse-code, coding-agent, cli, meta, ai-tools, harness-engineering, llm-pricing]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 28
tldr: "2026 年 8 月 Meta Superintelligence Labs 發布 Muse Code beta。閉源靜態 binary、Muse Spark 1.2 模型、平行子 agent + worktree 隔離。最大爭議是定價：標準版 $1.25/$4.25 per M tokens，Contributor 版 $0.10/$0.20——便宜 20 倍，但你的程式碼進 Meta 的訓練管線。"
description: "Meta Muse Code 的技術架構：Muse Spark 1.2 模型、persistent sub-agent、worktree 隔離、event log crash recovery，以及 Contributor 定價的訓練權爭議。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-24-muse-code-meta-coding-agent-en)

2026 年 8 月 5 日，Meta Superintelligence Labs 發布 [Muse Code](https://musecodes.io) early beta——Meta 的第一個終端原生 coding agent。領導這個團隊的是 Alexandr Wang（Meta 的 Chief AI Officer，前 Scale AI 創辦人）。

Muse Code 在技術上有幾個有趣的設計選擇。但它最被討論的不是技術，是定價模型：你可以用標準價格，或者讓 Meta 拿你的程式碼去訓練，換取 20 倍的折扣。

## 技術架構

### 靜態 binary

Muse Code 發布為單一靜態連結 binary（名稱 `muse`），不依賴 Node.js、Python 或 Homebrew。實作語言未公開。

```bash
curl -fsSL https://dev.meta.ai/install.sh | bash
```

安裝到 `~/.local/bin/muse`，內建自動更新（每小時檢查一次，`MUSE_NO_AUTO_UPDATE=1` 停用）。支援 macOS 和 Linux（x86_64 / arm64），Windows 需要 WSL2。

### Append-only event log

Muse Code 把每個 session 的操作記錄為 append-only event log。這讓它能做 crash recovery 和 session 恢復：

```bash
muse resume
```

程式崩潰或手動中斷後，session 可以從上次的狀態接續。這跟 [OMP 2](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness) 的 content-addressed blob storage + append-only transcripts 和 [Pi v2](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable) 的 lane-based durable session 是同一個方向——[session 持久化](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape)正在變成所有 harness 的共同演化方向。

### Persistent sub-agent + worktree 隔離

Muse Code 的子 agent 是 persistent 的——它們在同一個 session 內跨任務存活，不需要每次重建。寫入檔案的子 agent 在獨立的 git worktree 裡執行，使用者的工作目錄不會被動到。

這個設計選擇值得注意：大多數 coding agent 的子 agent 是用完即棄的。persistent sub-agent 意味著子 agent 可以累積 context，但也意味著更複雜的生命週期管理。

## 模型：Muse Spark 1.2

Muse Spark 1.2 是 Meta 專門為 coding 訓練的閉源模型，特點是**模型和 harness 一起訓練**——模型行為和 agent 目標作為一個單元最佳化，不是先訓模型再套 agent loop。

參數量未公開。社群在 OpenRouter 上觀察到的吞吐量（~150-180 tok/s）暗示它可能沒有最前沿的模型那麼大。

Meta 另外釋出了 [Muse Glimmer 30B](https://huggingface.co/meta-llama)（29.6B dense，從 Spark 蒸餾而來，Apache 2.0，131K context），但這不是 Muse Code 預設使用的模型。

### Benchmark（Meta 自行公布，未經獨立驗證）

| Benchmark | Muse Spark 1.2 | Opus 5 (Claude Code) | GPT-5.6 Terra (Codex) |
|---|---|---|---|
| Terminal-Bench 2.1 | 82.9% | **86.7%** | 81.8% |
| DeepSWE 1.1 | 59.3% | **65.0%** | 64.8% |
| Meta Internal | 70.6% | **79.4%** | 65.4% |

Meta 在所有公開 benchmark 上承認落後 Opus 5。Muse Code 的差異化不在品質，在價格。

## 定價：訓練權換折扣

| 方案 | Input | Cached Input | Output |
|---|---|---|---|
| **Standard** | $1.25/M tokens | $0.15/M | $4.25/M |
| **Contributor** | $0.10/M tokens | $0.002/M | $0.20/M |

Contributor 方案便宜最多 20 倍，但**明確授權 Meta 拿你的 prompt 和 completion 去訓練**。

這是 Muse Code 最大的爭議。對個人開發者寫開源專案來說，Contributor 定價非常有吸引力。但對企業使用者來說，程式碼進入 Meta 的訓練管線是直接的合規風險。Contributor 方案內沒有細粒度的 opt-out——你要嘛全開，要嘛付標準價。

這個定價模型在 coding agent 領域是獨一無二的。Claude Code、[Antigravity CLI](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google) 和其他商業工具的定價跟訓練資料權利是分開的。Muse Code 把它們綁在一起。

## 風險

**Beta 就是 beta。** 社群回報品質問題——重構後留下死碼、restructuring 過於淺層。

**Benchmark 未獨立驗證。** 上面那張表是 Meta 自己的評估結果，不在官方排行榜上。比較對象選了 GPT-5.6 Terra 而不是更高階的模型。

**閉源 binary + 自動更新。** 你無法審核 `muse` binary 的行為，而且它預設每小時自動更新。在 [Grok Build 的隱私事件](/posts/tech/2026-08-24-grok-build-xai-privacy-incident)之後，閉源 coding agent 的信任成本更高了。

**Muse Spark 1.2 權重未開源。** Zuckerberg 在 8 月 10 日宣布計畫開源，但截至目前只有蒸餾版 Glimmer 30B 是 Apache 2.0。

## 跟其他 Coding Agent 的對照

| | Muse Code | Claude Code | Antigravity CLI | dsh |
|---|---|---|---|---|
| 開源 | 閉源 | 閉源 | 閉源 | MIT |
| 模型 | Muse Spark 1.2 | Claude | 多模型 | 自選 |
| 子 agent | Persistent + worktree | 單 session | 內建編排器 | Cordis plugin |
| 定價特色 | 訓練權換折扣 | 訂閱制 | 額度制 | 自帶 API key |
| Session 持久化 | Event log + resume | 有 | 不明 | Plugin 可換 |

## 整體來說

Muse Code 的技術架構有值得關注的選擇——persistent sub-agent、event log crash recovery、模型與 harness 共同訓練。這些在其他 agent 上不常見。

但它面臨兩個核心問題：品質還在追趕（Meta 自己的 benchmark 落後 Claude Code 4-9 分），以及定價模型的信任成本。Contributor 方案的 20 倍折扣很誘人，但「用程式碼換折扣」這個交易在企業場景裡很難通過合規審查。

在 [H2 2026 的 harness 大戰](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape)裡，Muse Code 代表的是模型廠商直接進場做 agent 的趨勢——不是提供 API 讓別人做 harness，而是連 harness 一起做。Google 的 [Antigravity CLI](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google)、xAI 的 [Grok Build](/posts/tech/2026-08-24-grok-build-xai-privacy-incident) 都是同一個方向。

## 參考資料

- [Muse Code 官方網站](https://musecodes.io)
- [Muse Code 文件](https://dev.meta.ai/docs/muse-code/)
- [Muse Glimmer 30B（Hugging Face）](https://huggingface.co/meta-llama)
- 站內：[OMP 2：從 Pi fork 到全 Rust 重寫](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness)
- 站內：[Pi v2：AgentHarness API 升穩](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable)
- 站內：[DeepSeek Harness（dsh）：Everything is a Plugin](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel)
- 站內：[2026 下半年 Harness 大戰](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape)

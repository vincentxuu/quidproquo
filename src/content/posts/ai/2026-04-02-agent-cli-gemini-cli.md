---
title: "Google 終端 Agent 方案分析：Gemini CLI 收攤，Antigravity CLI 接手"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, gemini-cli, google, pricing, terminal-agent, antigravity]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 7
tldr: "Gemini CLI 已於 2026/06/18 對個人帳號停止服務，接手的是 Antigravity CLI（Go 重寫、共用 Antigravity 2.0 的 server-side harness）。Gemini CLI 本身沒死，但只剩兩條路徑：Gemini Code Assist Standard/Enterprise 授權，以及付費 API key。"
description: "Google 終端 agent 的現況：Antigravity CLI 的定位與方案、Gemini CLI 殘存的企業與 API key 路徑、從 Gemini CLI 遷移的實際步驟，以及這次轉換留下的教訓。"
draft: false
---

如果你是照著 2026 上半年的文章來選 Google 的終端 agent，那份資訊已經不能用了。Gemini CLI 那套「每天 1,000 次請求、含 Gemini 2.5 Pro 和 1M context、登入 Google 帳號就能用」的免費方案，**已於 2026 年 6 月 18 日對所有個人帳號停止服務**。

這篇講現在的狀況：Google 在終端這一格擺的是什麼、還剩哪些路徑能用、以及該怎麼遷移。

## 現在的產品是 Antigravity CLI

Google 在 2026 年 5 月 19 日宣布把終端體驗從 Gemini CLI 轉向 **Antigravity CLI**，理由是把力氣集中在單一的 agent-first 開發平台 Google Antigravity 上，而不是同時維護兩套 CLI 與 IDE 擴充。

Antigravity CLI 的幾個實際差異：

| 面向 | 內容 |
|------|------|
| **實作語言** | Go 重寫（Gemini CLI 是 TypeScript） |
| **架構** | 與 Antigravity 2.0 桌面版共用同一套 server-side harness |
| **非同步工作流** | 支援背景長時間任務，這是官方主推的差異點 |
| **保留的能力** | Agent Skills、Hooks、Subagents，Extensions 改名為 Antigravity plugins |
| **開放程度** | 不像 Gemini CLI 那樣是 Apache-2.0 開源專案——這是社群反彈最大的一點 |

官方明講**不會有 1:1 的功能對等**。轉換當下 Gemini CLI 的部分能力沒有跟過去，社群在公告串下的抱怨主要集中在兩件事：用量額度縮水（有人回報幾個請求就吃到週配額），以及替代品不再開源。

安裝：

```bash
# macOS / Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Windows PowerShell
irm https://antigravity.google/cli/install.ps1 | iex
```

## Gemini CLI 還剩什麼

Gemini CLI 這個專案沒有被關掉，repo 仍以 Apache-2.0 授權維護，Google 也說會繼續跟上新模型、修 bug 與安全問題——但**服務對象只剩企業**。

| 路徑 | 是否還能用 | 說明 |
|------|-----------|------|
| Google 帳號免費層（Gemini Code Assist for Individuals） | ❌ 2026/06/18 起停止服務 | 個人免費方案，已終止 |
| Google AI Pro / Ultra 訂閱 | ❌ 同日停止服務 | 改由 Antigravity CLI 支援 |
| Gemini Code Assist Standard / Enterprise 授權 | ✅ 不受影響 | 組織透過授權或 Google Cloud 使用 |
| 付費 Gemini / Gemini Enterprise Agent Platform API key | ✅ 不受影響 | 按 token 計費 |
| Gemini Code Assist for GitHub | ❌ 個人版已終止 | 6/18 起停止新安裝，7/17 完全關閉；企業版不受影響 |

換句話說：**個人開發者已經沒有免費路徑**，要嘛轉 Antigravity CLI，要嘛自備付費 API key 繼續跑 Gemini CLI。

## 從 Gemini CLI 遷移

Antigravity CLI 安裝時會自動偵測本機的 Gemini CLI 目錄並帶過設定：

- **Skills**——自訂與已安裝的 skills 自動匯入
- **MCP Servers**——所有已設定的 MCP server 一併遷移
- **Agents**——既有的 agent profile 與設定保留
- **專案記憶**——完整相容既有的 `gemini.md`

Extensions 需要一道手動轉換：

```bash
agy plugin import gemini
```

MCP 設定的位置與欄位有變：設定檔從 `settings.json` 移到 `mcp_config.json`，遠端 server 的欄位名稱由 `url` 改成 `serverUrl`。

## 這次轉換留下的兩個教訓

**免費額度不是護城河，是行銷預算。** Gemini CLI 的免費層是這個賽道有史以來最激進的設計——Google 分析內部開發者用量後，把上限設在最重度使用者的兩倍，等於宣告「大多數人永遠碰不到付費牆」。它撐了大約一年。用免費額度當選型的主要理由，等於把工具鏈押在對方的行銷決策上。

**開源不等於不會被抽走。** Gemini CLI 是 Apache-2.0，repo 現在也還在，但這救不了個人使用者——因為值錢的不是那份程式碼，是後面那個免費的推論服務。授權管的是原始碼，管不到誰能打那個 endpoint。

## 適用場景

- **既有 Gemini Code Assist 企業授權的團隊**——Gemini CLI 仍是受支援的路徑，不必急著動
- **已經在 Antigravity 生態的開發者**——Antigravity CLI 是官方主線，非同步背景任務是目前的主要賣點
- **只想要免費終端 agent 的個人開發者**——Google 這條路已經關了，看本系列其他選項

如果你要的是深度推理，Claude Code 仍然是更好的選擇；如果要的是不綁供應商，OpenCode 的多供應商架構更適合。

## 參考資料

- [Google Developers Blog：Transitioning Gemini CLI to Antigravity CLI（官方公告）](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [Gemini CLI Discussion #28017：正式停止服務公告（2026/06/18）](https://github.com/google-gemini/gemini-cli/discussions/28017)
- [Gemini CLI Discussion #27274：轉換公告與社群討論](https://github.com/google-gemini/gemini-cli/discussions/27274)
- [Google Antigravity Blog：Introducing Google Antigravity CLI](https://antigravity.google/blog/introducing-google-antigravity-cli)
- [Gemini CLI | GitHub](https://github.com/google-gemini/gemini-cli)
- [The Register：Bye-bye, Gemini CLI; Google nudges devs toward Antigravity](https://www.theregister.com/ai-ml/2026/05/20/bye-bye-gemini-cli-google-nudges-devs-toward-antigravity/5243605)

## 更新紀錄

- 2026-08-18：停服已成事實，全文改寫。移除已失效的免費額度、認證方式與付費方案各表，改為 Antigravity CLI 的定位與方案、Gemini CLI 殘存路徑對照表、遷移步驟，並補上這次轉換的兩個教訓。標題與 tldr 一併調整
- 2026-05-21：補充 Gemini CLI 停用公告（2026/06/18）與 Antigravity CLI 遷移段落；更新 tldr、tags、參考資料

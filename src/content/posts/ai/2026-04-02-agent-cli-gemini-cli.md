---
title: "Google 終端 Agent 方案分析：個人免費那條路已經沒了"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, gemini-cli, google, pricing, terminal-agent, antigravity]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 8
tldr: "Google 這條線的付費路徑對照：個人免費層與 Google AI Pro / Ultra 的 Gemini CLI 存取已於 2026/6/18 終止，個人只剩 Antigravity CLI 或自備付費 API key；企業授權與 Google Cloud 不受影響。零成本起步的選項已經換人。"
description: "Gemini CLI 停服的實際影響範圍、Google 終端 agent 現在還能走的付費路徑，以及跟本系列其他工具的方案對照。"
draft: false
---

如果你要在 Google 這條線上選終端 agent，2026 上半年的資訊幾乎全部作廢了。這篇只做一件事：**把還能走的付費路徑攤開來對照**。

產品本身的介紹交還另外兩篇——[Gemini CLI 是什麼、它那套免費額度的始末](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)，以及[接班人 Antigravity CLI 的安裝、認證與功能](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent)。

## 先確認你走哪條路

| 你的身分 | 現在該用什麼 |
|---|---|
| 個人、想免費 | **沒有這條路了**。Gemini CLI 個人免費層與 Google AI Pro / Ultra 都在 2026/6/18 停止服務 |
| 個人、願意付費 | Antigravity CLI（吃 Google AI 方案），或自備付費 API key 繼續跑 Gemini CLI |
| 組織有 Gemini Code Assist Standard / Enterprise | Gemini CLI 仍完全受支援，不必搬 |
| 走 Google Cloud / Gemini Enterprise Agent Platform | 兩者都可，按 token 計費 |

**個人開發者已經沒有免費路徑**，這是這一格最重要的改變。

## 停服的實際範圍

2026 年 5 月 19 日公告、6 月 18 日執行：

| 受影響 | 內容 |
|---|---|
| Gemini CLI 個人免費層 | 停止服務 |
| Google AI Pro / Ultra 訂閱的 Gemini CLI 存取 | 停止服務，改由 Antigravity CLI 承接 |
| Gemini Code Assist IDE 擴充 | 同步停止（它本來就是 Gemini CLI 的另一個外殼） |
| Gemini Code Assist for GitHub 個人版 | 6/18 停止新安裝，7/17 完全關閉 |
| **不受影響** | Gemini Code Assist Standard / Enterprise 授權、Google Cloud 存取、付費 API key |

repo 仍以 Apache 2.0 維護，Google 承諾繼續跟上新模型與安全修補——服務對象只剩企業。

## 跟本系列其他方案比

Google 這條線現在的定位很尷尬，值得跟其他家對照著看：

| | 免費入門 | 個人付費 | 綁既有訂閱 |
|---|---|---|---|
| **Google（Antigravity CLI）** | ❌ 已終止 | 依 Google AI 方案 | Google 帳號生態 |
| Claude Code | ❌ | $20 / $100 / $200 | — |
| Codex | 有限 | $8 / $20 / $100 / $200 | ChatGPT 訂閱 |
| Copilot CLI | ✅ Free 方案含 | $10 / $39 / $100 | GitHub Copilot 授權 |
| OpenCode | ✅ 開源自備 key | 依模型計費 | Copilot / ChatGPT 帳號 |
| Amp | ❌ 已停新註冊 | $20 / $200 | ChatGPT、X Premium+ |

Google 曾經是這張表裡免費那一欄唯一的強項，現在那格空了。要零成本起步，答案已經換成 OpenCode 這類自備 key 的開源路線，或 Copilot CLI 的 Free 方案。

## 這個案子留下的判斷準則

免費額度、開源授權，都不是選型時可以當保證的東西——[Gemini CLI 那篇](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)把這兩個教訓寫得比較完整。放在選型的脈絡下，能收斂成一句：

**評估一個工具時，要分清楚你依賴的是「程式碼」還是「別人的服務」。** 前者授權保得住，後者保不住——Gemini CLI 的 repo 到今天都還在，但那對 6/18 之後的個人使用者沒有任何幫助。

## 參考資料

- [Google Developers Blog：Transitioning Gemini CLI to Antigravity CLI（官方公告）](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [Gemini CLI Discussion #28017：正式停止服務公告（2026/06/18）](https://github.com/google-gemini/gemini-cli/discussions/28017)
- [Gemini CLI Discussion #27274：轉換公告與社群討論](https://github.com/google-gemini/gemini-cli/discussions/27274)
- [Google Antigravity Blog：Introducing Google Antigravity CLI](https://antigravity.google/blog/introducing-google-antigravity-cli)
- [The Register：Bye-bye, Gemini CLI; Google nudges devs toward Antigravity](https://www.theregister.com/ai-ml/2026/05/20/bye-bye-gemini-cli-google-nudges-devs-toward-antigravity/5243605)

## 更新紀錄

- 2026-08-19：**整合 Google 這一格的三篇，去掉重複**。本文原本同時講 Antigravity CLI 的功能與遷移步驟，與站內既有的 [Antigravity CLI 專文](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent)、以及改回 Gemini CLI 主題的 [Gemini CLI 專文](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent) 重疊。本文收斂為方案與付費路徑對照，產品介紹與遷移步驟交還那兩篇
- 2026-08-18：停服已成事實，全文改寫
- 2026-05-21：補充停用公告與遷移段落

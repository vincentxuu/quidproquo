---
title: "Gemini CLI：曾經最慷慨的免費終端 Agent，現在只剩企業路徑"
date: 2026-03-31
type: project
category: tech
tags: [gemini, google, ai-tools, cli, coding-agent, open-source, antigravity]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 6
tldr: "Gemini CLI 是 Google 開源的終端機 AI agent（Apache 2.0，~106.6k stars），曾提供每分鐘 60 次、每天 1,000 次的免費額度含 1M context。個人方案已於 2026/6/18 停止服務，接替者是 Antigravity CLI。專案本身沒關閉，repo 仍在維護，但只服務 Gemini Code Assist Standard/Enterprise 授權與付費 API key。"
description: "Gemini CLI 的設計、免費額度為何曾是業界最激進的一步、2026/6/18 個人方案停服的始末，以及現在還剩下哪些可用路徑。"
draft: false
---

🌏 [English version](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent-en)

Gemini CLI 是 Google 開源的終端機 AI agent，採 ReAct（Reason and Act）迴圈，結合內建工具與 MCP server 完成任務。它一度是這個賽道免費額度最誇張的選項——**然後在 2026 年 6 月 18 日對所有個人帳號停止服務**。

這篇講它是什麼、那套免費策略為什麼值得記住、以及今天誰還能用它。

## 現況：對個人來說，它就是收掉了

先講最容易誤解的一句話：**Gemini CLI 沒有被關閉，但如果你是個人使用者，它對你等同收掉了。**

這兩件事必須分開講，因為它們的答案相反：

- **軟體**還活著。repo 未封存、Apache 2.0，2026-08-19 仍在出 nightly build，前一天還有 commit 進來。
- **個人能用的服務**沒了。「用 Google 帳號登入」這個選項**已經被移除**，不是額度歸零而是路徑消失。

所以下面這張表要看的是「你屬於哪一欄」，不是「這個產品死了沒」：

| 路徑 | 是否還能用 |
|---|---|
| Google 帳號免費層（Gemini Code Assist for Individuals） | ❌ 2026/06/18 起停止服務 |
| Google AI Pro / Ultra 訂閱 | ❌ 同日停止 |
| Gemini Code Assist Standard / Enterprise 授權 | ✅ 不受影響 |
| 透過 Google Cloud 存取 | ✅ 不受影響 |
| 付費 Gemini / Gemini Enterprise Agent Platform API key | ✅ 不受影響 |
| Gemini Code Assist for GitHub（個人版） | ❌ 6/18 起停止新安裝，7/17 完全關閉 |

官方在停服後另外發了一份 deprecation 說明，FAQ 直接回答了這題：**「我有 Gemini Code Assist Standard 或 Enterprise 訂閱，會受影響嗎？不會，用 Standard/Enterprise 訂閱存取 IDE 擴充與 Gemini CLI 維持不變。」** 企業端也確實還在收到新功能——Gemini Code Assist 的 release notes 在 2026-08-10 還為 Standard/Enterprise 推出 Release Channels。

所以「Gemini CLI 收了嗎」這個問題沒有單一答案，取決於你問的是誰：

| 你問的是 | 答案 |
|---|---|
| 個人開發者還能用嗎 | **不能。** Login with Google 已移除，沒有替代的個人入口 |
| 這個開源專案還活著嗎 | **活著。** 每日 nightly，未封存 |
| 企業付費客戶還能用嗎 | **能，且官方明說維持不變**，還在收新功能 |

個人開發者要在終端機用 Google 的 agent，現在的答案是 **Antigravity CLI**。

**→ [Antigravity CLI：Google 用一套 agent harness 收編 Gemini CLI 的終端機介面](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent)**

## 安裝

```bash
# 不安裝直接用
npx @google/gemini-cli

# 全域安裝
npm install -g @google/gemini-cli
```

用 Node 寫的（這點在接班人身上被改掉了——Antigravity CLI 用 Go 重寫）。開源授權 Apache 2.0。

## 那套免費額度

這是 Gemini CLI 最值得記住的部分。只要一個 Google 帳號：

| 項目 | 額度 |
|---|---|
| 每分鐘請求 | 60 次 |
| 每日請求 | 1,000 次 |
| Context window | 1M tokens |

不需要信用卡、不需要 API key。而且拿到的不是閹割版——包含當時最強的 Pro 模型、最大的 context window、全部核心功能。

Google 怎麼定出這個數字：他們分析內部開發者的實際用量，找出**消耗最高的那批人**，再把免費上限設成那個數字的**兩倍**。意思很直白——連 Google 自己最重度的工程師都用不完，那絕大多數外部開發者永遠碰不到付費牆。

它撐了大約一年。

## 核心功能

| 功能 | 說明 |
|---|---|
| Google Search grounding | 內建搜尋，回答有即時資料支撐，不需額外設定或付費 |
| 1M token context | 大型 monorepo 可以一次載入大量程式碼 |
| 檔案操作與 shell | 標準的 agent 工具組 |
| MCP 支援 | 透過 Model Context Protocol 接自訂工具 |
| GEMINI.md | 專案層級的指示檔 |
| Skills / Hooks / Subagents | 後期補上，這幾項都遷移到了 Antigravity CLI |

其中 Search grounding 是它相對其他終端 agent 最特別的一項：agent 可以直接查即時網路資訊，而且算在免費額度裡。

## 與 Gemini Code Assist 的關係

| | Gemini CLI | Gemini Code Assist |
|---|---|---|
| 介面 | 終端機 | VS Code 擴充套件 |
| 底層 | 獨立 CLI | 由 Gemini CLI 驅動 |

VS Code 裡的 Gemini Code Assist agent mode 實際上是 Gemini CLI 功能的子集，兩者共享核心。這也是為什麼 6/18 那次停服會同時掃到 IDE 擴充與 GitHub 版本——它們是同一個東西的不同外殼。

## 這個案子留下的兩件事

**免費額度不是護城河，是行銷預算。** 用免費額度當選型的主要理由，等於把工具鏈押在對方的行銷決策上。這個賽道上最激進的一次免費投放，壽命大約一年。

**開源不等於不會被抽走。** Gemini CLI 是 Apache 2.0，repo 現在也還在，但這救不了個人使用者——值錢的不是那份程式碼，是後面那個免費的推論服務。授權管的是原始碼，管不到誰能打那個 endpoint。

## 適用場景

- **持有 Gemini Code Assist 企業授權的團隊**：仍是受支援的路徑，不必急著搬
- **有付費 Gemini API key 的人**：可以繼續跑，模型可用性跟著 key 走
- **想研究 agent 實作的人**：Apache 2.0 而且還在維護，是可讀的參考實作
- **個人開發者想找免費終端 agent**：這條路已經關了，而且沒有付費就能買回來的個人方案——要用 Google 的終端 agent 就是走 Antigravity CLI

## 參考資料

- [Gemini CLI GitHub：google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
- [Google Developers Blog：Transitioning Gemini CLI to Antigravity CLI（官方公告）](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [Gemini CLI Discussion #28017：正式停止服務公告（2026/06/18）](https://github.com/google-gemini/gemini-cli/discussions/28017)
- [Google 官方公告：Gemini CLI 開源終端機 AI agent 發布](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-cli-open-source-ai-agent/)
- [Google for Developers：Gemini Code Assist 消費者帳號 deprecation 說明與 FAQ](https://developers.google.com/gemini-code-assist/docs/deprecations/code-assist-individuals)
- [Gemini Code Assist FAQ（企業訂閱不受影響的官方答覆）](https://developers.google.com/gemini-code-assist/resources/faqs)
- [Gemini Code Assist release notes（企業端仍在出新功能）](https://docs.cloud.google.com/gemini/docs/codeassist/release-notes)
- [Gemini CLI Hands-on Codelab](https://codelabs.developers.google.com/gemini-cli-hands-on)

## 更新紀錄

- 2026-08-19（二次修訂）：被問「不是收掉了嗎」後重新查證並調整框架。原文說它「仍是可用產品」容易誤導個人讀者——實際上**個人入口（Login with Google）已被移除**，只有企業訂閱不受影響。新增「軟體活著 vs 個人服務沒了」的拆分、官方 deprecation FAQ 與 release notes 兩個更硬的來源，以及 repo 仍在出每日 nightly 的佐證
- 2026-08-19：**改回以 Gemini CLI 為主題**。前一版把本文改寫成 Antigravity CLI 介紹，與站內既有的〈[Antigravity CLI：Google 用一套 agent harness 收編 Gemini CLI 的終端機介面](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent)〉重複；接班人的介紹交還那篇，本文專注在 Gemini CLI 本身：它的免費額度設計、停服後殘存的企業路徑，以及這個案子留下的兩個教訓
- 2026-08-18：停服已成事實，改寫內容並修正安裝指令網址
- 2026-05-21：補充 Gemini CLI 停用公告（2026/06/18）與遷移指引

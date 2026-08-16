---
title: "CS146S Week 8：把 agent 丟到雲端跑之後，瓶頸從等待變成審查"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - ai-agent
  - agentic-coding
  - multi-agent
  - orchestration
  - developer-experience
lang: zh-TW
type: deep-dive
series:
  name: "CS146S：AI 原生開發十週"
  order: 9
tldr: "背景 agent 把「你盯著它跑」換成「它自己跑完開 PR」。三家的做法收斂到同一組零件：隔離環境、外部觸發（issue、Slack、Linear）、產出是 PR。真正的新問題是你變成瓶頸——五個 agent 同時跑完，五份 diff 排隊等你讀，而它們互相不知道彼此存在。"
description: "拆解 Stanford CS146S Fall 2026 第八週「Background Agents」：非同步雲端 agent 的共同架構、issue-to-PR 流程與觸發器、平行 agent 群的管理成本，以及什麼任務適合丟到背景跑。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-16-cs146s-background-agents-en)

這是 [CS146S 系列](/posts/ai/2026-08-16-cs146s-course-map)的第九篇，對應 Fall 2026 的第八週。

課程主題三條：非同步、雲端代跑的 agent；管理成群平行執行的 agent；issue-to-PR 流程與觸發器（Slack、Linear、GitHub）。講題是「Background agents: launching tasks asynchronously」，客座還沒公布。

這一週在 Fall 2025 不存在。去年這時候，agent 是一個你打開終端機、看著它跑的東西。

**揭露一下：這篇文章本身就是背景 agent 寫的**——在一個臨時的雲端容器裡、在一個獨立分支上跑，跑完把結果推回去。下面講的成本與限制不是推測。

## 共同的零件

不同家的產品名字不一樣，架構收斂得相當一致：

| 零件 | 做什麼 |
|---|---|
| 隔離環境 | 每個任務一個乾淨容器或 VM，通常還有自己的 git worktree |
| 觸發器 | GitHub issue、`@` 提及、Slack 訊息、Linear 工單、排程 |
| 環境設定 | 一份宣告：怎麼裝相依、怎麼跑測試、有哪些環境變數 |
| 產出 | 一個 PR，而不是一段對話 |
| 回饋通道 | PR 上的留言與 CI 結果會回到 agent 身上，讓它繼續改 |

[Claude Code 的 GitHub Actions 整合](https://code.claude.com/docs/en/github-actions)的官方描述就是這個形狀：「Run Claude Code in GitHub Actions workflows to respond to @claude mentions, automate tasks, and turn issues into pull requests」，並分成 interactive（等人觸發）與 automation（照設定跑）兩種模式。[Codex cloud](https://learn.chatgpt.com/docs/cloud) 的一句話定位是「Delegate work to Codex in isolated cloud environments」。

**「產出是 PR」這件事比它看起來重要。** 它把 agent 的輸出強制塞進一個已經存在幾十年的審查機制裡：diff、CI、review、合併。你不需要為 agent 發明新的驗收流程，這也是為什麼 [Week 5 的 codebase 就緒度](/posts/ai/2026-08-16-cs146s-agent-ready-codebase)在這裡會直接變成產能上限——CI 跑不動的 repo，背景 agent 交出來的 PR 沒人能驗。

## 適合丟到背景的任務長什麼樣

不是所有任務都該非同步。判準有三條，要同時成立：

1. **驗收標準寫得出來**——「測試會綠」「這個 lint 規則不再噴」「這個 API 回傳新欄位」。無法先寫下驗收標準的任務，agent 跑完你也不知道它對不對
2. **上下文可以一次交代完**——需要中途問你三個問題的任務，非同步只會讓每一輪等更久
3. **失敗的代價低**——產出是 PR，不是 deploy

照這三條篩下來，實際跑得順的多半是：相依套件升級、機械式重構（改名、換 API）、把 lint 規則從 warn 調成 error 並修完、補測試、把一份規格翻成骨架程式碼、跨檔案的一致性修正。

跑不順的則是：需求本身模糊、要跟人來回對齊、牽涉到只有你知道的商業背景。這類任務丟到背景，你收到的是一份看起來很完整、方向錯了的 PR——**而且它比一段錯誤的對話更難丟掉**，因為它看起來像是完成品。

## 真正的新問題：你變成瓶頸

同時開五個背景 agent 很容易。五份 diff 同時等你讀，就不容易了。

幾個實際會遇到的問題：

**互相不知道對方存在。** 五個 agent 各自從同一個 base 分出去，兩個改到同一個檔案，合併時才發現。這不是 bug，是設計——每個任務隔離的代價就是彼此看不到。

**審查成本是線性的，產出速度不是。** agent 產出可以水平擴張，人的審查頻寬不行。這也是為什麼 [Week 6 的 AI code review](/posts/ai/2026-08-16-cs146s-agentic-code-review) 會被排在這一週前面——沒有一層自動審查，背景 agent 的產能就只是把塞車地點從「寫」移到「讀」。

**沉默的失敗。** 同步跑的時候，agent 走偏你三十秒內就看到了。非同步的話，它可能花二十分鐘走進死路，你收到的是一份繞了一大圈的 diff。有些 harness 會在中途發通知，但「什麼情況該打斷」目前沒有好答案。

**成本不透明。** 五個平行 agent 各自燒 token，帳單是一筆總數。要分攤到任務層級需要額外的儀表——這是 [Week 9 的 gateway](/posts/ai/2026-08-16-cs146s-ai-native-team) 要解的題。

## 實務上會用到的幾條規矩

- **一個 agent 一個 PR，PR 要小。** 大 PR 在人類流程裡就已經是反模式了，agent 產的大 PR 更糟——你沒有作者可以問
- **環境設定要寫進 repo。** 這就是 `AGENTS.md` 與 setup script 的用途（見 [Week 4](/posts/ai/2026-08-16-cs146s-agent-customization)）。背景 agent 沒有你的 shell history，也沒有你腦裡那三個未寫下的步驟
- **權限最小化。** 背景 agent 沒有人盯著，[Week 7 的 lethal trifecta](/posts/ai/2026-08-16-cs146s-agent-security) 在這裡最危險：它讀 issue（不可信內容）、有 repo 權限（私密資料）、能開 PR 與呼叫 API（對外通道），三項預設全開
- **驗收標準寫在觸發的那則 issue 裡**，不要寫在你腦子裡

## 這一週的位置

把十週連起來看，Week 8 是一個轉折點：前七週在教你怎麼跟一個 agent 工作，從這一週開始教的是怎麼管一群 agent。課程接著就走進 [Week 9 的團隊化](/posts/ai/2026-08-16-cs146s-ai-native-team)與 [Week 10 的 software factory](/posts/ai/2026-08-16-cs146s-software-factory)。

順序是有道理的：一個人管三個背景 agent 是工具問題，一個組織管三百個是基礎設施問題。

## 會過期的東西

- 各家背景 agent 的功能與定價變動極快，本文只寫共同架構，不做產品比較
- Fall 2026 這週的客座與教材尚未公布
- 「一個 agent 一個 PR」這類慣例還很年輕，一年後可能會有更好的答案

## 參考資料

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 8 主題
- [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions) — issue-to-PR 與兩種觸發模式的官方文件
- [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web) — 雲端 session、環境與網路政策設定
- [Codex cloud](https://learn.chatgpt.com/docs/cloud) — OpenAI 的隔離雲端任務環境
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic Engineering，sub-agent 的 context 隔離代價
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory，回饋迴圈品質決定 agent 能自主跑多久

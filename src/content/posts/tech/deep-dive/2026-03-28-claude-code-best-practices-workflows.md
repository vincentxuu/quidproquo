---
title: "Claude Code 實戰工作流：探索、規劃、實作到 commit 的官方最佳實踐"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, best-practices, workflows, tips, productivity]
lang: zh-TW
tldr: "Claude Code 官方最佳實踐的主軸只有一條：管好 context window。本文按探索、plan mode、實作、驗證、commit 的循環整理 prompt 技巧、/clear 與 rewind 的使用時機，以及官方點名的五種失敗模式。"
description: "以工作循環為主軸整理 Claude Code 官方最佳實踐：探索 codebase、plan mode 規劃、可自動驗證的實作、subagent review、平行 session 與 commit 收尾，附 prompt 技巧與常見失敗模式。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 5
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-best-practices-workflows-en)

這是「Claude Code 深入介紹」系列的第五篇。[入口篇](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)拆解了 agentic loop 的機制，[.claude 目錄導覽](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory)講了設定檔住哪；這篇講你怎麼**操作**這個 loop——素材來自官方 best practices、common workflows 與 prompt library 三份文件，按一輪完整的工作循環重排：探索、規劃、實作、驗證、收尾。想看這套循環跑在真專案上的樣子，可以搭配[先前那篇 OpenSpec 到部署的實戰記錄](/posts/tech/deep-dive/2026-03-27-ai-driven-dev-workflow-openspec-to-deploy)。

## 一切建議的起點：context window

[官方 best practices](https://code.claude.com/docs/en/best-practices) 開宗明義：多數最佳實踐源自同一個限制——context window 填得很快，而且效能隨著填滿而下降。它裝著整個對話：每則訊息、Claude 讀過的每個檔案、每段指令輸出，一次 debug 或探索就可能吃掉上萬 tokens。

所以後面每個技巧本質上都在做同一件事：讓有限的 context 只裝跟當前任務有關的東西。

## 先探索，別急著叫它寫程式

接手新 codebase，先問廣再問窄：「give me an overview of this codebase」，接著鑽架構模式、關鍵資料模型、認證怎麼處理。也可以用行為搜尋代替檔名搜尋：「where do we validate uploaded file types？」；刪東西之前先問「what would break if I deleted X？」

大範圍調查交給 subagent。「use subagents to investigate how our auth system handles token refresh」——它在自己的 context window 裡讀幾十個檔案，只回傳摘要，主對話保持乾淨留給實作。這是 context 管理最有力的一招。

## Plan mode：把想清楚和動手分開

按 `Shift+Tab` 切到 plan mode（或起 session 時加 `claude --permission-mode plan`），Claude 只讀檔、提計畫，不動 source files。官方推薦的四階段就架在這上面：**explore** 讀懂現場、**plan** 產出實作計畫（按 `Ctrl+G` 可以直接在編輯器裡改計畫）、**implement** 核對計畫動工、**commit** 帶描述訊息提交開 PR。

但 plan mode 有成本。官方明講：一句話描述得完的 diff（改錯字、加一行 log）就直接做；跨多個檔案、你對做法沒把握、或不熟那段程式時，規劃才值得。

## 實作：給它一道跑得出 pass/fail 的檢查

這是 best practices 裡我認為最重要的一條。沒有可跑的檢查，「看起來做完了」是唯一訊號，你就變成驗證迴圈本身——每個錯誤都在等你發現。有了測試、build exit code、linter 或螢幕截圖比對，loop 自己會關閉：做完、跑檢查、讀結果、修到過為止。

prompt 要把檢查寫進去。兩個官方範式：

```text
write tests for the password reset flow first,
then implement it until they pass
```

```text
here is a build error. fix the root cause
and verify the build succeeds
```

前者就是 TDD 變體——測試定義了「完成」長什麼樣，Claude 迭代到測試全綠。後者要求 root cause 加驗證，防止只把錯誤訊息壓掉的表面修補。

## 驗證與修正：你是 loop 的一部分

任何時候 `Esc` 打斷正在跑的動作，context 保留、馬上轉向；按兩次 `Esc`（或 `/rewind`）開 rewind menu，回復之前的對話、程式狀態或兩者。checkpoint 不是 git 的替代品，bash 指令造成的變更不在涵蓋範圍——但拿來「試一條危險的路，不行就 rewind 換一條」非常省事。

更強的一道保險是 adversarial review：開一個 fresh subagent，只看 diff 和你的標準，不知道產出它的推理過程。「Use a subagent to review the rate limiter diff against PLAN.md. Report gaps, not style preferences.」內建的 [`/code-review`](https://code.claude.com/docs/en/best-practices) 也做同樣的事。一個提醒：叫 reviewer 找缺口，它一定找得到——明講只報影響正確性或需求的，其餘當選配。

## /clear 的時機，以及收尾

同一個問題糾正超過兩次，代表 context 已被失敗嘗試塞滿——`/clear` 重開，把學到的寫成一個更好的初始 prompt。官方說得很直白：乾淨 session 加好 prompt，幾乎總是勝過累積一堆修正的長 session。不相干的任務之間也 `/clear`。

收尾這一段：請它「commit with a descriptive message and open a PR」。任務跨天用 `--continue`／`--resume` 接續，session 用 `/rename` 取名管理。要平行推進，`claude --worktree feature-auth` 在獨立 checkout 起隔離 session，第二個終端機換名字再開一個；大量遷移交給 [`/batch`](https://code.claude.com/docs/en/common-workflows)，它會拆成最多 30 個 subagent，各自在 worktree 工作、各開一個 PR。

## 官方點名的五種失敗模式

best practices 結尾列的清單，每一種都對應前面某個解法：

| 失敗模式 | 解法 |
|---|---|
| Kitchen sink session：一個 session 塞不相干任務 | 任務之間 `/clear` |
| 反覆糾正，越修越歪 | 兩次失敗後 `/clear`，重寫更好的 prompt |
| CLAUDE.md 過長，重要規則被淹沒 | 無情修剪，Claude 本來就會的就刪 |
| Trust-then-verify gap：看起來對就 ship | 一律提供測試、腳本或截圖驗證 |
| 無邊界探索，讀上百個檔案填滿 context | 限縮範圍，或交給 subagent |

## 學到的事

這些模式不是鐵律。官方文件的最後一節就叫「Develop your intuition」：有時候該讓 context 累積（深陷一個複雜問題時歷史很有價值）、該跳過規劃（探索型任務）、甚至該故意給模糊 prompt 看它怎麼解讀。可行的練法是每次 Claude 表現特別好或特別糟時，倒推回自己當時做了什麼——prompt 結構、給了什麼 context、在哪個模式。幾輪下來長出的判斷力，比任何指南都準。

## 參考資料

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — 官方最佳實踐：context 管理、可驗證任務、plan mode 工作流、平行擴展與失敗模式
- [Common workflows](https://code.claude.com/docs/en/common-workflows) — 官方日常配方：codebase 探索、除錯、測試、PR、worktree 平行 session 與 script 整合
- [Prompt library](https://code.claude.com/docs/en/prompt-library) — 官方可複製 prompt 清單，依任務與角色分類，附「why this works」說明

## 更新紀錄

- 2026-08-26：骨架展開為正文，依 2026-08 官方文件（best-practices／common-workflows／prompt-library 新網域版）重寫。

---
title: "Claude Code Checkpointing 深入介紹：snapshot 機制、rewind 選單與追蹤邊界"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, checkpointing, rewind, undo, safety]
lang: zh-TW
tldr: "Checkpointing 不是 git commit：Claude Code 在每個 user prompt 前自動存檔案 snapshot，一個 session 保留最近 100 個、30 天清除。本文拆解 /rewind 選單的五個選項、bash 與 subagent 等追蹤邊界，以及它跟 git 的分工。"
description: "深入介紹 Claude Code 的 Checkpointing：snapshot 觸發時機與保留策略、/rewind 選單操作、bash／subagent／symlink 的追蹤限制，以及 checkpoint 與 git、permission modes 的安全分工。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 4
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-checkpointing-guide-en)

這是「[Claude Code 深入介紹](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)」系列第 4 篇。入口篇把 Claude Code 的安全設計分成兩道防線：checkpoints 讓你收回檔案變更，permission modes 控制它不問你就能做多少。這篇展開第一道：snapshot 怎麼存、rewind 怎麼按、哪些東西它其實救不回來。

## 它解決什麼問題

agentic loop 的代價是失控風險：模型可能連續幾十步在改你的檔案，中途沒有人逐一把關。傳統的保險做法是叫它先 git commit——但讓 AI 自動 commit 會把歷史塞滿垃圾，遇到不是 git repo 的目錄更是直接沒輒。

Claude Code 的答案是把還原點做進工具本身：官方文件講得很直接，「Before Claude edits a file, it snapshots the current contents.」（Claude 改檔案前，會先把目前的內容存成 snapshot。）不需要你設定、不碰 git 歷史、離開 git 也能用。改壞了，兩下鍵盤回到前一個狀態。

## Snapshot 怎麼運作

機制有三條規則，全部出自官方 [Checkpointing 文件](https://code.claude.com/docs/en/checkpointing)：

**觸發時機**：每一個 user prompt 都建立一個新的 checkpoint。追蹤對象是 Claude 用內建檔案編輯工具做的直接修改——不是整個工作目錄的備份。

**保留策略**：一個 session 內保留最近 100 個 checkpoint 的快照；整個 checkpoint 資料隨 session 一起保存，30 天後依照 `~/.claude` 目錄的清理規則刪除，期限可以用 `cleanupPeriodDays` 設定調整。

**跟著對話走**：因為 checkpoint 是跟對話綁在一起存的，你用 `--resume` 回到舊 session 之後，`/rewind` 一樣可用。

## Rewind：兩下 Esc 與五個選項

打開 rewind 選單有兩個方式：輸入 `/rewind`，或在輸入框**空的**時候連按兩下 `Esc`。注意輸入框裡有字的時候，雙擊 `Esc` 是清空文字而不是開選單——清掉的文字會進輸入歷史，按上方向鍵找得回來。

選單主要列出這個 session 你送過的 prompt；新版 Claude Code 還有一個 `/clear` 後的例外：在離開程式或 resume 其他 session 之前，rewind menu 可能保留上一個 session 的入口，讓你回到清掉前的對話。選定一個時間點之後，有五個動作可以選：

| 選項 | 做什麼 |
|------|--------|
| Restore code and conversation | 程式碼和對話一起退回那個時間點 |
| Restore conversation | 只退對話，現在的程式碼不動 |
| Restore code | 只退檔案變更，對話留著 |
| Summarize from here | 把這個點之後的對話壓成摘要，騰出 context |
| Summarize up to here | 把這個點之前的對話壓成摘要，之後的訊息原封不動 |

（選單裡還有一個 Never mind，作用是取消不做。）兩個 restore code 選項只在選中的 checkpoint 之後真的有被追蹤的檔案變更時才會出現；如果那個點之後 Claude 沒改過任何檔案，選單只剩對話相關的選項。

兩個 Summarize 選項值得特別看一眼：它們不動磁碟上的任何檔案，只壓縮對話本身，效果類似一次可以指定範圍的 `/compact`——例如一場漫長的 debug 之後，把中段全部收進摘要，保留最初的指令和最新的進度。選定 summarize 還可以先打字補充指示，引導摘要的重點。

指令方面不用背新東西：`/undo` 和 `/checkpoint` 都是 `/rewind` 的別名，行為完全相同。

## 邊界：這些東西 rewind 不回來

Checkpointing 的能力範圍畫得很清楚，四條邊界都要記住：

**Bash 造成的變更不追蹤。** Claude 跑 `rm file.txt`、`mv`、`cp` 這類 shell 指令動到的檔案，rewind 救不回來。只有透過檔案編輯工具的直接修改才在快照範圍內。

**Subagent 的編輯通常不 restore。** 一般 subagent 在自己的流程裡改檔案，這些編輯不會進你 session 的 checkpoint，要退只能靠 git。少數例外：以 `context: fork` 前景執行的 forked skill（設 `background: false`），它的編輯發生在你自己的 turn 裡，rewind 可以正常涵蓋。

**Symlink 和 hard link 直接跳過。** 還原時遇到這類路徑會跳過不改，然後顯示「Restored the code, but skipped N files」警告。dotfile manager 用 symlink 掛進專案的設定檔、pnpm hard-link 進來的檔案都屬於這類。想知道到底跳過了哪些，先用 `/debug` 打開除錯日誌再還原，日誌會逐一列出。

**Session 外的修改和遠端操作不在範圍內。** 你自己在編輯器裡手改的檔案、其他同時跑的 session 的編輯，通常不被捕捉；資料庫、API、部署這些遠端系統的操作，從頭到尾就不是檔案 snapshot 能覆蓋的。

## 跟 Git 的分工，不是替代品

官方文件把話說死了：checkpoint 是 session 層級的快速回復工具，commit、branch、長期歷史請繼續用 git。

實務上的分工是這樣：探索性的修改——「試試方案 A，不行就換」——靠 rewind，乾淨而且不污染歷史；一旦某個方向確定要走，立刻 git commit 固化，因為 checkpoint 有 30 天期限、100 個上限，而且換台電腦就不在了。把 checkpoint 當成 git 的延伸或替代，遲早會踩到上面那些邊界。

## 搭配 Permission Modes：放手前的最後防線

回頭看兩道防線的分工就會發現，checkpoint 蓋不住的恰好是最危險的部分：bash 指令的副作用和遠端操作。這些靠的是第二道防線——permission modes（`Shift+Tab` 切換），決定 Claude 不問你就能跑什麼。

所以正確的心態不是「有 checkpoint 就可以亂開權限」，而是反過來：權限放得越寬，越要清楚 checkpoint 的邊界在哪。如果你考慮的是 `--dangerously-skip-permissions` 這種全面放手的模式，建議先讀[先前那篇 bypass permissions 的風險分析](/posts/tech/2026-03-16-claude-code-dangerously-skip-permissions)——在那種模式下，checkpoint 是你最後一道能收回檔案變更的防線，而它對 bash 和遠端操作無能為力，剩下的風險要靠 sandbox 和環境隔離兜住。

一句話總結：checkpoint 讓「改壞檔案」變得便宜，permission modes 讓危險動作根本不發生，git 負責留下永久的歷史。三層各管一段，不要期待任何一層獨撐全局。

## 參考資料

- [Checkpointing — Claude Code Docs](https://code.claude.com/docs/en/checkpointing) — snapshot 觸發時機、100 個／30 天保留策略、rewind 選單五選項、bash／subagent／symlink 各項限制的官方說明
- [How Claude Code works — Claude Code Docs](https://code.claude.com/docs/en/how-claude-code-works) — checkpoints 與 permission modes 兩道安全防線、遠端操作無法 checkpoint 的定位說明
- [Commands — Claude Code Docs](https://code.claude.com/docs/en/commands) — `/rewind` 指令定義與 `/checkpoint`、`/undo` 別名的完整指令清單

## 更新紀錄

- 2026-08-26：依最新官方文件全文重寫，修正舊稿「checkpoint 就是 git commit」「搭配 git worktree」等錯誤認知，改以 snapshot 機制與 rewind 選單為主軸。

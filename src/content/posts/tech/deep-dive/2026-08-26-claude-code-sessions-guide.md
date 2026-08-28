---
title: "Claude Code sessions 怎麼管理：--continue、--resume、/branch 與 JSONL 檔"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, sessions, resume, cli]
lang: zh-TW
tldr: "Claude Code 把每個 session 逐行寫進 ~/.claude/projects/ 底下的 JSONL 檔，預設保留 30 天。本文拆解 --continue 與 --resume 的差異、session 命名規則、/branch 分岔語意，以及 transcript 匯出與清理的設定。"
description: "Claude Code session 完整整理：resume 與 fork 各自做什麼、session picker 快捷鍵、跨 worktree 與跨專案的查找規則、transcript 匯出給腳本用的介面。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 3
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-sessions-guide-en)

[系列入口篇](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)只花了一節講 session：「存在 `~/.claude/projects/`，resume 是同一個 ID 繼續附加，fork 是複製歷史」。這篇把整條生命週期展開——存到哪、怎麼回來、怎麼分岔、怎麼清理。桌面版、網頁版和 VS Code extension 各自維護自己的 session 歷史，這篇只講 CLI。

## 存到哪：projects 目錄底下的 JSONL

對話過程中，每一則訊息、每一次工具呼叫和結果都逐行寫進純文字 JSONL：

```
~/.claude/projects/<project>/<session-id>.jsonl
```

`<project>` 是工作目錄路徑把非英數字元換成 `-` 的結果。官方文件也提醒了直接解析的風險：JSONL entry 是 Claude Code 內部格式，版本之間可能變動；要拿 session 資料做自動化，用下面會提到的匯出介面，不要自己 parse 這個檔。

不想留紀錄也有對應開關：環境變數 `CLAUDE_CODE_SKIP_PROMPT_HISTORY` 可以全面抑制寫入，非互動的一次性執行則用 `claude -p --no-session-persistence`。

## 怎麼回來：--continue 和 --resume 差在哪

離開後想接著聊，常用入口有這幾個：

| 入口 | 行為 |
|------|------|
| `claude --continue` | 直接接上目前目錄最近的一個互動 session |
| `claude --resume` | 打開互動式 session picker |
| `claude --resume <name>` | 用名字直接接回某個 session |
| `claude --resume <session-id>` | 用 ID 接回，可以在任何目錄執行 |
| `claude --from-pr <number>` | 從 GitHub PR 找出建立它的 session |
| session 內 `/resume` | 從目前 session 打開 resume picker |

關鍵語意差異是：resume 不是「載入副本再說」，而是在同一個 session ID 底下繼續附加新訊息，同一份 transcript 會繼續長。恢復時帶回的不只是對話，模型和 agent（含 system prompt、工具限制）也會跟著回來。permission mode 則要看恢復路徑：直接用終端機命令接 session 時可以還原已保存的模式；從 picker 或 session 內 `/resume` 回來時不會還原 permission mode。`bypassPermissions` 不會被還原，`plan` 也只在部分非互動或 VS Code 路徑保留。啟動時的旗標也不是全部都跟著走：`--mcp-config`、`--settings`、`--plugin-dir` 這類要在 resume 時重傳一次；寫在 settings.json 裡的設定則不用。

Pro／Max 方案還有一個省 token 的設計：恢復一個閒置超過一小時、又超過 100,000 tokens 的 session 時，Claude Code 會先問你要不要**從摘要恢復**——立刻壓縮歷史，之後每次請求只送摘要而不是全文，代價是摘要沒留下的細節就此離開 context。

## Picker 與命名：讓 session 找得回來

`claude --resume` 或 session 內的 `/resume` 會打開 picker。幾個值得記的快捷鍵：

- `Space` 預覽內容，`Ctrl+R` 改名
- `Ctrl+B` 只看當前 git branch 的 session
- `Ctrl+W` 放大到整個 repo 的所有 worktrees
- `Ctrl+A` 放大到本機所有專案
- 搜尋欄可以直接貼 GitHub、GitHub Enterprise、GitLab 或 Bitbucket 的 PR/MR URL，找出建立那個 PR/MR 的 session

命名有三條路：起 session 時 `claude -n auth-refactor`、session 中 `/rename`、picker 裡按 `Ctrl+R`。沒命名的 session 也不是沒名字——Claude Code 會用小型快速模型依你的第一個 prompt 生成標題，這個標題可以當 resume handle 用。要注意的是另一種預設顯示名稱（像 `my-app-3f`）：它只在執行中的清單裡辨識用，餵給 `claude --resume` 是找不到 session 的。

## 分岔：/branch 與 --fork-session

試不同做法但不想弄丟原本的路徑，就是 fork 的場景。`--fork-session` 和 `/branch` 都會把歷史複製到新的 session ID，原 session 不會被改動。

session 內跑 `/branch try-streaming-approach`，確認訊息會印出兩個 session ID——你現在所在的新分支，和保留下來的原始 session，之後用 `/resume` 就能回去。命令列則是 `claude --continue --fork-session` 這種組合。細節有一處容易踩：同 process 內 `/branch` 會繼承「本次 session 允許」的授權，但 `--fork-session` 開出新 process 後授權要重新批准。

反過來的坑也要知道：同一個 session 在兩個終端機 resume 卻不 fork，兩邊的訊息會交錯寫進**同一份** transcript。

## 跨 worktree 與跨專案

session 綁的是目錄，所以平行工作的正解是 git worktrees——每個 branch 一個目錄，各自的 session 互不干擾。picker 預設只列當前 worktree，用前面說的 `Ctrl+W`／`Ctrl+A` 擴大範圍。

用 ID resume 的查找順序值得一記：先找目前目錄和它的 worktrees，找不到就搜尋本機上所有其他專案——但只有在**恰好一個**專案持有這個 ID 時才會解析成功，避免手動複製過的副本被任意挑一份回來。另外 `/cd` 換工作目錄會把 session 搬進新目錄的儲存區，之後就在新目錄的 picker 出現。

## 匯出與清理

給人看的：`/export` 可以把對話複製到剪貼簿或存成純文字檔，工具輸出會渲染成可讀格式。

給程式吃的有三種介面，照觸發方式選：一次性執行用 `claude -p --output-format json` 拿結構化結果和 session ID；要追問既有 session 用 `claude -p --resume <session-id>`；要反應事件就讀 hooks 收到的 `transcript_path` 欄位，例如掛一個 `SessionEnd` hook 在 session 結束時封存 transcript。

清理方面，transcript 的保留期限由 settings.json 的 `cleanupPeriodDays` 控制，預設 30 天。日常的 context 管理是另一件事：`/clear` 開新的乾淨 context 但會保存前一個對話，`/compact` 把歷史換成摘要，`/context` 看目前什麼在吃空間。

## 學到的事

整套 session 機制可以收斂成一句話：**transcript 是 resume、fork 和 checkpoint rewind 的真相來源。** `--continue` 在同一個 ID 後面附加，`/branch` 複製到新 ID，checkpoint rewind（見[Checkpointing 篇](/posts/tech/deep-dive/2026-03-28-claude-code-checkpointing-guide)）沿著 session 的檢查點回到先前狀態。auto memory 是另一層：它另外存成專案 memory 檔，不是 transcript 本身。搞懂這個分工，平行開多個 session、跨 worktree 工作、把對話接進腳本，就不會把 session 歷史、context 摘要和長期 memory 混成一件事。

## 參考資料

- [Manage sessions — Claude Code Docs](https://code.claude.com/docs/en/sessions) — resume 旗標、session picker 快捷鍵、命名規則、transcript 存放與保留設定的官方說明
- [How Claude Code works — Claude Code Docs](https://code.claude.com/docs/en/how-claude-code-works) — resume 與 fork 的 session ID 語意、worktree 平行工作的章節
- [Memory — Claude Code Docs](https://code.claude.com/docs/en/memory) — auto memory 與 transcript 分開保存的官方說明

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方文件撰寫。

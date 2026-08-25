---
title: "Python coding agent 實戰 M11：為什麼 exec 迴圈做不出 Claude Code 的對話體驗"
date: 2026-08-22
category: ai
tags: [coding-agent, python, tui, claude-code, codex, agent-sdk]
lang: zh-TW
tldr: "要做出 Claude Code 或 Codex 的 TUI，關鍵不是滿版配色，而是長生命期 session、typed transcript 與 tool-boundary approval。"
description: "從一次性 CLI 子程序改成 Codex app-server 與 Claude Agent SDK 長生命期 session，並以 Python 建立可持久、可審計的 coding-agent 對話。"
draft: false
glossary:
  - term: "typed transcript"
    definition: "以明確事件型別與關聯 ID 表示文字、工具、結果、diff 與核准，而非直接印出供應商原始 log。"
  - term: "tool boundary"
    definition: "模型真正準備讀檔、改檔或執行命令的邊界；PCA 在此處套用 policy 與使用者核准。"
---

## TL;DR

要做出 Claude Code 或 Codex 的 TUI，關鍵不是滿版配色，而是長生命期 session、typed transcript 與 tool-boundary approval。

## 情境

我的 Python coding agent 已經能跑模型、改隔離 clone、驗證 patch，也能用 Claude Code 與 Codex 的本機訂閱登入。可是把它做成全螢幕 TUI 後，體驗仍然很怪：問一句 `hi`，畫面先印兩次 system，再印重複回答；下一句看似接續，底層其實又啟動一個新的 `codex exec` 或 `claude -p`。

更根本的問題是 UI 要我先選 `Ask` 或 `Agent`。這是 harness 實作細節，不是使用者真正想做的決定。使用者只想繼續說話；等模型真的要 Edit、Write 或 Bash 時，再決定是否允許。

## 問題

一次性 subprocess 很容易包裝，卻缺少 coding agent TUI 最重要的三件事：

1. 同一個 native session 的多輪狀態；
2. 可即時更新且能關聯 tool use/result/diff 的事件；
3. 在副作用發生前暫停並回覆 permission 的雙向控制。

原本把所有東西塞進 `RichLog`，也讓 protocol 直接變成 UI。`system → message → result` 被當成三段文字；tool requested、started、completed 變成三列 Activity。這不是 Claude Code 的訊息架構。

## 嘗試過程

我直接讀本機的 Claude Code source，而不是只看截圖。它的 user prompt 是一條有底色的內容列，沒有 `You`；assistant 是小圓點加 Markdown，沒有 `Assistant`；同一個 tool 透過 `tool_use_id` 把執行、進度、結果與 diff 放在一起。permission 也不是跳離上下文的中央對話框，而是 transcript 下方當前唯一的互動面。

所以只調 CSS 沒用。必須先改資料流。

## 解法

我建立共用的 `ConversationRuntimeSession`：

```python
class ConversationRuntimeSession(Protocol):
    async def start(self) -> None: ...
    async def send_turn(self, text: str) -> str: ...
    def events(self) -> AsyncIterator[ConversationRuntimeEvent]: ...
    async def respond_approval(self, request_id, decision) -> None: ...
    async def interrupt(self, turn_id: str) -> None: ...
    async def aclose(self) -> None: ...
```

Codex adapter 啟動一個 `codex app-server`，同一 thread 接受多個 turn；Claude adapter 透過官方 Agent SDK 的長生命期 `query()` session，並用 Node sidecar 把 control request 收斂成 PCA 自己的 strict JSONL。供應商的 thread、session、tool ID 都留在 adapter 內，不寫入 conversation store。

兩邊共用一個持續存在的 disposable Git workspace。它只 clone committed `HEAD`、隔離 `.git` metadata、移除 origin、停用 hook，再對 source repo 做完整前後 invariant。模型可以在 clone 裡讀與改；每次 turn 結束，PCA 都重新計算 bounded patch。Claude SDK 沒附完整 diff 時，也由 PCA 自己重算，不相信缺漏的 provider event。

UI 則改成 typed projection：文字 delta 合併成同一個 assistant block；tool row 用 action ID 原地更新；diff 掛在 edit 下；permission dock 在底部。`Details` 只保留診斷資料，不再把每個 protocol frame 重複倒進主要 transcript。

## 為什麼會這樣

「聊天」與「代理」不是兩種 session。它們是同一個 session 在不同 turn 中使用不同能力。真正需要 policy 的不是 prompt 看起來像不像任務，而是模型即將觸發的 effect：Read、Modify 或 Execute。

這也是為什麼 intent classifier 不適合拿來決定安全模式。一句「幫我看看這段」可能只回答，也可能讀檔；一句「修掉它」最後也可能判斷不需修改。把 permission 放在 tool boundary，語意更精準，安全規則也比較能測。

## 學到的事

做 coding agent TUI 時，先設計 session protocol 與 transcript reducer，再畫畫面。一次性 exec 可以完成任務，卻無法自然地長成 Claude Code。

---

## 參考資料

- [Claude Agent SDK overview](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Codex app-server](https://developers.openai.com/codex/app-server/)
- [Claude Code overview](https://docs.anthropic.com/en/docs/claude-code/overview)

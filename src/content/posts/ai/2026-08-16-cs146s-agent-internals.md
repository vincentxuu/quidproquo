---
title: "CS146S Week 1：coding agent 的內部構造，其實是一個 while 迴圈"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - ai-agent
  - agentic-coding
  - tool-use
  - claude-code
  - llm
lang: zh-TW
type: deep-dive
series:
  name: "CS146S：AI 原生開發十週"
  order: 2
tldr: "CS146S 第一週的講題是「用 200 行寫出 Claude Code」加上「解剖 production agent 的 system prompt」。agent loop 本身確實只有十幾行——Thorsten Ball 用 Go 寫的完整版不到 400 行、四個工具。難的從來不是迴圈，是迴圈外面那一圈：工具契約、權限、錯誤回復。"
description: "拆解 Stanford CS146S Fall 2026 第一週「The Internals of Coding Agents」：agent loop 的最小實作、read/write/edit/bash 四件工具組、production coding agent 的 system prompt 結構，以及手刻版與可用版之間差了什麼。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-16-cs146s-agent-internals-en)

這是 [CS146S 系列](/posts/ai/2026-08-16-cs146s-course-map)的第二篇，對應 Fall 2026 的第一週。

課程網站列出的兩堂課是「Course intro + build Claude Code in 200 lines」與「How state-of-the-art coding agents are designed: deep dive into the system prompts that define the agent」，主題三條：LLM 到底是什麼、agent loop 在底下長什麼樣、核心工具組（read、write、edit、bash）怎麼把任務跑完。

值得注意的是這門課去年不是這樣開場的。Fall 2025 的第一週叫「Introduction to Coding LLMs and AI Development」，兩堂課分別是「how an LLM is made」跟「Power prompting for LLMs」。一年之間，開場從「模型是怎麼做出來的」換成「agent 是怎麼組起來的」。

## agent loop 有多小

Anthropic 在 [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) 裡引用了 Simon Willison 的定義，並說「we've gravitated towards a simple definition for agents: **LLMs autonomously using tools in a loop**」。

這句話幾乎可以直接翻成程式碼：

```
messages = [user_request]

while True:
    response = model(messages, tools=TOOLS)
    messages.append(response)

    if not response.tool_calls:
        break                      # 模型不想再用工具了，收工

    for call in response.tool_calls:
        result = TOOLS[call.name](**call.args)
        messages.append(tool_result(call.id, result))
```

沒有規劃器、沒有狀態機、沒有 orchestrator。模型決定要不要呼叫工具，執行環境把結果貼回對話，再問一次。

課程說 200 行。可以拿來對照的公開實作是 Amp 團隊 Thorsten Ball 的 [How to Build an Agent](https://ampcode.com/how-to-build-an-agent)，副標寫得很清楚：「Building a fully functional, code-editing agent in less than 400 lines.」那是 Go，含終端機互動、JSON schema 產生與三個工具（`read_file`、`list_files`、`edit_file`）。Python 版壓到 200 行內是合理的，因為 SDK 幫你省掉大半 boilerplate。

**重點不是行數，是「這東西沒有魔法」這件事本身**。多數人對 coding agent 的直覺是它內部有某種規劃機制；實際上規劃是模型在 context 裡做的，程式碼那一層只負責把工具接上去、把結果送回去。

## 四件工具組為什麼夠用

課程列的核心工具是 read、write、edit、bash。這組合看起來寒酸，但它剛好對應一個工程師在終端機前的全部動作：看檔案、改檔案、跑東西。

`bash` 是其中最關鍵的一個，因為它是**逃生口**：測試怎麼跑、依賴怎麼裝、grep 怎麼下，都不需要各別做成工具。Anthropic 描述 Claude Code 的做法時提到，模型可以「write targeted queries, store results, and leverage Bash commands like head and tail to analyze large volumes of data without ever loading the full data objects into context」——資料處理發生在執行環境裡，不是在 context 裡。

代價也在同一句話裡：一個能跑任意 shell 指令的工具，等於把整台機器交出去。這就是為什麼真正能用的 agent 一定要有沙箱與權限層，也是為什麼 [Week 7 整週在講安全](/posts/ai/2026-08-16-cs146s-agent-security)。

工具定義本身也是設計題。Anthropic 在 [Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) 之後的 context 工程文裡下了一條很好用的判準：

> One of the most common failure modes we see is bloated tool sets that cover too much functionality or lead to ambiguous decision points about which tool to use. If a human engineer can't definitively say which tool should be used in a given situation, an AI agent can't be expected to do better.

「人類工程師講不清楚該用哪個，就別指望 agent 講得清楚」——這條在你自己寫 MCP server 的時候特別值得貼在螢幕上。

## system prompt 是 agent 的真正規格書

課程第二堂的講題是「deep dive into the system prompts that define the agent」。用 define 這個動詞是準確的：同一個模型、同一組工具，換掉 system prompt 就是另一個 agent。

production coding agent 的 system prompt 通常在處理這幾件事：

- **身分與範圍**：這是什麼工具、允許做什麼、明確不做什麼
- **工具使用規則**：什麼時候該用哪個工具、平行呼叫的規則、什麼情況要先問人
- **輸出格式**：終端機是純文字環境，回覆長度與格式要被壓住
- **環境事實**：作業系統、工作目錄、是不是 git repo、今天日期
- **專案層 context**：`CLAUDE.md` / `AGENTS.md` 這類檔案的內容會被塞進來

Anthropic 對 system prompt 的建議是找到「right altitude」——他們把兩種失敗模式擺在兩端：一端是「hardcoding complex, brittle logic in their prompts to elicit exact agentic behavior」，另一端是「vague, high-level guidance that fails to give the LLM concrete signals」。中間那個高度才是目標。

想看真的長什麼樣，Fall 2025 的第四週指定過一篇第三方逆向分析 [Peeking Under the Hood of Claude Code](https://medium.com/@outsightai/peeking-under-the-hood-of-claude-code-70f5a94a9a62)。它不是官方文件，讀的時候要當成觀察筆記而不是規格書；但作為「production agent 的 prompt 到底有多長、在管什麼」的參照，它比任何二手描述都具體。

## 手刻版跟能用版差在哪

200 行的 agent 跑得起來，但你不會拿它做事。差距大致在這幾層：

| 缺的東西 | 沒有它會怎樣 |
|---|---|
| 權限與沙箱 | 一句 `rm -rf` 就結束了 |
| context 壓縮 | 幾十輪工具呼叫後撞到 context 上限，直接失憶 |
| 錯誤回復 | 工具丟例外就整個停住，不會換路 |
| 任務追蹤 | 長任務中途忘記還有哪幾件沒做 |
| 檔案編輯的原子性 | 字串取代匹配到兩處，改壞不知道 |
| 成本控制 | 每輪都把完整歷史重送一次 |

其中 context 壓縮與任務追蹤這兩件，正好是 [Week 2 context 工程](/posts/ai/2026-08-16-cs146s-context-engineering)的內容——Anthropic 把它們叫做 compaction 與 structured note-taking。

換句話說，第一週教你 agent 的骨架，之後九週都在教骨架外面那一圈。這個安排本身就是課程的論點：**模型與迴圈已經不是瓶頸了**。

## 自己動手的最小路線

Fall 2026 的作業還沒公布，但 Fall 2025 的 [作業 repo](https://github.com/mihail911/modern-software-dev-assignments) 是公開的，`week2` 就是「Building a coding agent from scratch」。想自己走一次，順序大概是：

1. 用官方 SDK 接一次 tool use，先只做 `read_file`
2. 加 `list_files`，看模型會不會自己先探路再讀檔
3. 加 `edit_file`（字串取代版本就好），試著讓它改一個真的 bug
4. 加 `bash`，跑測試，觀察它失敗後怎麼回應
5. 把你的 system prompt 從三行加到三十行，量測行為差多少

第 5 步是最有價值的一步，也是最多人跳過的一步。

## 會過期的東西

- Fall 2026 的作業與投影片尚未公布，本文的作業路線是依 Fall 2025 repo 推的
- 「200 行」是課程講題的說法，實際程式碼還沒公開
- Claude Code 的 system prompt 分析文是第三方逆向，版本會漂

## 參考資料

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 1 的主題與講題
- [How to Build an Agent](https://ampcode.com/how-to-build-an-agent) — Thorsten Ball，用 Go 在 400 行內寫出可編輯程式碼的 agent
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic Engineering，2025-09-29
- [Writing tools for AI agents – with AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents) — Anthropic Engineering，工具定義的設計原則
- [Peeking Under the Hood of Claude Code](https://medium.com/@outsightai/peeking-under-the-hood-of-claude-code-70f5a94a9a62) — 第三方逆向分析，Fall 2025 Week 4 指定讀物
- [modern-software-dev-assignments](https://github.com/mihail911/modern-software-dev-assignments) — Fall 2025 作業 repo，`week2` 是手刻 agent

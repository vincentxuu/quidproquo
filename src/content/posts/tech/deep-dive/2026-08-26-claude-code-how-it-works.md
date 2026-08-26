---
title: "Claude Code 怎麼運作：agentic loop、內建工具與兩道安全防線"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, agentic-loop, ai-agent, anthropic]
lang: zh-TW
tldr: "Claude Code 的核心是一個 agentic loop：蒐集 context、採取行動、驗證結果，循環直到任務完成。本文拆解它的五大類內建工具、模型與 harness 的分工，以及 checkpoints 和 permission modes 兩道安全防線，作為整個系列的閱讀地圖。"
description: "Claude Code 系列入口篇：拆解 agentic loop 三階段、內建工具分類、Claude 能存取什麼，以及 checkpoints 與權限模式的安全設計。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 1
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en)

這是「Claude Code 深入介紹」系列的入口篇。如果你還在猶豫要不要用它、想先比較各家 coding agent，先看[先前那篇 Agent CLI 選型指南](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent)；這篇假設你已經決定要用，想搞懂它**底下到底在跑什麼**——因為後續每個進階功能（hooks、MCP、多代理、自動化）都建立在同一套機制上。

## 一個會動手的語言模型

先講清楚它跟網頁版聊天機器人的差別。一般的 chatbot 只能回文字：你貼程式碼給它、它回你建議，中間所有搬運都是你在做。Claude Code 不一樣——官方文件的說法是，它是環繞 Claude 模型的一層 **agentic harness**：

> Claude Code serves as the agentic harness around Claude: it provides the tools, context management, and execution environment that turn a language model into a capable coding agent.

harness 這層做了三件事：提供工具、管理 context、維持執行環境。所以當你在終端機輸入「修掉掛掉的測試」，它不是回你一段「你可以試試看」，而是真的去跑測試、讀錯誤訊息、翻原始碼、改檔案、再跑一次測試確認。

## Agentic loop：三個階段的循環

每次你交給 Claude Code 一個任務，它在跑的是一個三階段的循環：

```
你的 prompt ──► 蒐集 context ──► 採取行動 ──► 驗證結果
                    ▲                              │
                    └────────── 未完成，再來一圈 ◄──┘
```

- **蒐集 context**：搜尋檔案、讀程式碼、看 git 狀態，搞懂現場。
- **採取行動**：編輯檔案、執行指令、呼叫外部服務。
- **驗證結果**：跑測試、看 type error、重新讀改過的檔案確認沒改壞。

三個階段不是固定流程。問一個 codebase 的問題可能只走第一階段；修 bug 會三個階段反覆繞；大重構的重心會落在驗證。每一步做什麼，是模型根據上一步學到的東西決定的——這就是「agentic」的意思：不是照劇本走，是邊走邊修正。

你也在這個 loop 裡。任何時候按 `Esc` 可以立刻打斷，正在跑的工具會被取消；不打斷也行，直接打字送出修正，Claude 會在目前這個動作完成後先讀你的話再決定下一步。官方文件把這件事講得很白：「You're part of this loop too.」

## 模型負責想，工具負責動

loop 由兩個零件驅動。

**模型**負責推理。Sonnet 處理大部分 coding 任務就夠，複雜的架構決策可以切到 Opus，session 中用 `/model` 切換，或起 session 時用 `claude --model <name>`。官方文件裡寫「Claude chooses」「Claude decides」的地方，指的都是模型在做判斷。

**工具**才是讓它 agentic 的關鍵。沒有工具，Claude 只能產生文字；有了工具，每一個動作的結果都會餵回 loop，變成下一步判斷的依據。內建工具分成五大類：

| 類別 | 能做什麼 |
|------|----------|
| 檔案操作 | 讀檔、改 code、建新檔、搬移重組 |
| 搜尋 | 用 pattern 找檔案、用 regex 搜內容、探索 codebase |
| 執行 | 跑 shell 指令、起 server、跑測試、操作 git |
| 網路 | 搜尋網頁、抓文件、查錯誤訊息 |
| Code intelligence | 改完檔案後看 type error、跳定義、找引用（需 code intelligence plugin） |

完整工具清單（含每個工具要不要權限核可）在官方 [Tools reference](https://code.claude.com/docs/en/tools-reference)。值得一提的是工具名稱不只是名字：permission rules、subagent 的工具清單、hook 的 matcher，寫的都是同一組字串，之後系列講到那些功能時會一直回來用到。

## 它看得到你什麼東西

在某個目錄跑 `claude`，它拿到的存取範圍比多數人直覺的大：

- **你的專案**：工作目錄與子目錄的所有檔案；目錄之外的檔案要經你同意。
- **你的終端機**：你能從命令列跑的，它都能跑——build 工具、git、套件管理器、系統工具。
- **git 狀態**：目前分支、未 commit 的變更、最近的歷史。
- **CLAUDE.md**：你寫的專案指示，每個 session 開頭載入。
- **auto memory**：Claude 自己累積的筆記（偏好、build 指令、踩過的坑），每個 session 開頭載入 MEMORY.md 的前 200 行或 25KB。
- **你設定的擴充**：MCP servers、skills、subagents、Chrome 整合。

正因為它看得到整個專案，「修掉認證 bug」這種跨檔案的任務才做得動：搜相關檔案、讀多個檔案理解脈絡、協調修改、跑測試驗證。只看得到當前檔案的 inline 補全助手，結構上就做不到這件事。

## 兩道安全防線

放手讓 agent 改 code 之前，先知道怎麼收回控制權。

**第一道：checkpoints。** Claude 改檔案前會先 snapshot 原始內容，出事按兩下 `Esc` 就能 rewind 回之前的狀態，或直接叫 Claude undo。checkpoint 跟 git 完全分開，resume 對話後仍然可用。限制也要記住：它只涵蓋檔案變更——bash 指令造成的副作用、資料庫和 API 這類遠端操作，都不在 checkpoint 範圍內，那些靠的是第二道防線。

**第二道：permission modes。** 按 `Shift+Tab` 循環切換，決定 Claude 不問你就能做多少：

| 模式 | 行為 |
|------|------|
| Auto | 背景的分類器審查大多數動作，攔下有風險的；Pro／Max／Team 方案的互動 session 預設值 |
| Manual | 改檔案、跑 shell 都先問 |
| Accept edits | 自動接受檔案編輯與常見檔案指令，其他指令仍會問 |
| Plan | 只探索和提計畫，不動 source files |

信任的指令也可以寫進 `.claude/settings.json` 白名單（例如 `npm test`），設定可以從組織層一路收斂到個人偏好——這是之後 B 叢集的主題。

## Session 存在哪

對話過程逐則寫進 `~/.claude/projects/` 下的純文字 JSONL 檔，rewind、resume、fork 都是靠它。每個新 session 都是乾淨的 context window，不帶前一個 session 的對話；要延續用 `--continue`／`--resume`（同一個 session ID 繼續附加），要分岔用 `--fork-session` 或 `/branch`（複製歷史到新的 session ID，原 session 不動）。細節留給 A3。

## 這個系列的地圖

之後每一篇都在講上面某個零件的深水區：

- **核心運作**：[.claude 目錄完全導覽](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory)、[Sessions 管理](/posts/tech/deep-dive/2026-08-26-claude-code-sessions-guide)、[Checkpointing](/posts/tech/deep-dive/2026-03-28-claude-code-checkpointing-guide)、[實戰工作流](/posts/tech/deep-dive/2026-03-28-claude-code-best-practices-workflows)
- **設定與權限**：settings.json 大全、Permissions 與 auto mode、CLAUDE.md 與 Memory 體系
- **Context 管理**：context window、prompt caching
- **擴充機制**：[Hooks](/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide)、[Skills 設計](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide)、MCP、Sub-agents、Plugins
- **自動化**：headless 與 Agent SDK、GitHub Actions、Channels、[排程自動化](/posts/tech/deep-dive/2026-05-09-claude-code-scheduled-tasks-guide)
- **多代理**：多代理全景、Agent Teams、Agent View、Dynamic Workflows
- **安全與營運**：sandboxing、成本管理、troubleshooting 三篇

## 學到的事

Claude Code 的所有功能都可以還原成一句話：**模型在一個 harness 提供的工具集上跑 loop，你透過 checkpoints 和 permissions 控制 loop 的邊界。** hooks 是在 loop 的特定時點插你的腳本，MCP 是往工具集加新工具，subagents 是開新的 context window 分擔工作。搞懂 loop 和工具這層底座，後面每一篇都只是往上疊。

## 參考資料

- [How Claude Code works — Claude Code Docs](https://code.claude.com/docs/en/how-claude-code-works) — agentic loop 三階段、harness 定位、存取範圍、checkpoints 與 permission modes 的官方說明
- [Tools reference — Claude Code Docs](https://code.claude.com/docs/en/tools-reference) — 內建工具完整清單、權限需求欄位、auto mode 預設行為
- [Explore the .claude directory — Claude Code Docs](https://code.claude.com/docs/en/claude-directory) — auto memory 載入規則與 session 資料存放位置
- [Claude Code docs index（llms.txt）](https://code.claude.com/docs/llms.txt) — 官方完整文件索引，本系列各篇主題的盤點基礎

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方文件撰寫（auto mode 已是 Pro/Max/Team 預設權限模式）。

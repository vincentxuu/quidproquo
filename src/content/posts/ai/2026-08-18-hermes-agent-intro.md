---
title: "Hermes Agent 導讀：Nous Research 的自我改進 agent，以及它跟 OpenClaw 的真實關係"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, nous-research, ai-agent, self-improving, gateway, openclaw]
lang: zh-TW
series:
  name: "Hermes Agent 文件導讀"
  order: 1
tldr: "Hermes Agent 是 Nous Research 的 MIT 授權 agent 框架，賣點是內建學習迴路（自動生技能、記憶提醒、FTS5 跨 session 檢索）。它提供 `hermes claw migrate` 從 OpenClaw 搬家，但 OpenClaw 並沒有被取代，兩邊仍各自在走。這篇是系列導讀，先講清楚它是什麼、跟誰不同、哪些情況不該選它。"
description: "Hermes Agent 系列導讀：架構全貌、自我改進迴路的實際機制、七種終端後端與多平台 Gateway 的定位，以及跟 OpenClaw、Claude Code、LangGraph 的分界線。"
draft: false
---

Hermes Agent 是 [Nous Research](https://nousresearch.com/) 開源（MIT）的 AI agent 框架。官方的一句話定位是「唯一內建學習迴路的 agent」：

> It's the only agent with a built-in learning loop — it creates skills from experience, improves them during use, nudges itself to persist knowledge, searches its own past conversations, and builds a deepening model of who you are across sessions.
> ——[hermes-agent README](https://github.com/NousResearch/hermes-agent)

這句話是整個專案的骨架，也是它跟其他 agent 框架最容易講清楚的差別。其餘的東西——多平台、多供應商、多後端——別家補得上，學習迴路是它押注的地方。

這篇是系列導讀。系列的目標不是把官方文件抄一遍（官方文件站有完整的 [docs](https://hermes-agent.nousresearch.com/docs/)，而且改得比任何文章快），而是把**選型取捨與會踩到的雷**留下來。

## 它的形狀

```
入口
  CLI / TUI  ·  Gateway（Telegram/Discord/Slack/WhatsApp/Signal/Email）
  Desktop App  ·  Web Dashboard  ·  ACP（VS Code/Zed/JetBrains）
  API Server（OpenAI 相容）  ·  Python library  ·  Batch runner
        ↓
AIAgent（run_agent.py）
  prompt 組裝  ·  provider 解析（3 種 API mode）·  工具派送
  context 壓縮與 prompt caching
        ↓
狀態                          工具後端
SQLite + FTS5（session）      終端 7 種 · 瀏覽器 5 種 · web 4 種 · MCP
MEMORY.md / USER.md           檔案、視覺、TTS…
```

一個細節先講：官方 README 說「40+ tools」，開發者文件的架構頁說「70+ tools, 28 toolsets」，同一份文件站裡兩個數字。這類數字在這個專案的半衰期很短，本系列一律不把它當論據——要精確數字請看 [Built-in Tools Reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)。

程式碼組成也不再是「純 Python 專案」：GitHub 語言統計目前是 Python 約 76%、TypeScript 約 20%，後者是 Desktop App、TUI 前端與 Web Dashboard 帶進來的。

## 學習迴路實際上是四個獨立機制

「自我改進」聽起來像一個東西，實際是四個可以各自關掉的機制，理解這點才知道哪個環節出問題：

| 機制 | 做什麼 | 你能控制的地方 |
|---|---|---|
| 技能自動生成 | 複雜任務結束後把過程抽象成 skill，之後可重用 | `skills.write_approval` 可要求寫入前先問你 |
| 記憶策展 | 定期提醒 agent 整理 `MEMORY.md` / `USER.md` | `write_approval`、背景審查通知可關 |
| Session 檢索 | SQLite FTS5 全文檢索 + LLM 摘要，跨 session 回溯 | 摘要用的是 auxiliary model，可另外指定便宜模型 |
| 使用者建模 | Honcho 式辯證使用者輪廓 | **已經不是內建**，改成 memory provider plugin，要另外裝 |

最後一列是這半年最容易踩的變更：舊文章（包含本文的初版）都寫「內建 Honcho 辯證輪廓」，現在官方文件明講它是 `plugins/memory/honcho/`，不裝就沒有。同層還有 OpenViking、Mem0、Hindsight、RetainDB、ByteRover、Supermemory 等可選後端。

技能格式相容 [agentskills.io](https://agentskills.io) 開放標準，這意味著 skill 可以跨框架搬——這點對「要不要押注在單一框架」的判斷很重要。

## 三個常被混為一談的層

新手最常見的困惑是把三件事當成同一件：

1. **你在哪裡打字**（CLI／TUI／Telegram／Desktop／IDE）
2. **指令在哪裡執行**（local／docker／ssh／modal／daytona／vercel_sandbox／singularity 七種終端後端）
3. **模型在哪裡推論**（Nous Portal／OpenRouter／Anthropic／自架 Ollama／vLLM…）

這三層完全正交。你可以在 Telegram 打字、指令跑在 Modal 的雲端沙箱、模型走自架 vLLM。反過來說，出問題時要先問「是哪一層壞了」——官方 FAQ 的除錯順序（`hermes doctor` → `hermes model` → `hermes setup` → `hermes sessions list` → `hermes gateway status`）本質上就是逐層排除。

系列裡[終端後端那篇](/posts/ai/2026-08-18-hermes-agent-terminal-backends)專講第 2 層，[模型供應商那篇](/posts/ai/2026-08-18-hermes-agent-providers)專講第 3 層。

## 跟 OpenClaw 的關係：是遷移路徑，不是繼承

本文初版寫「Hermes 是 OpenClaw 的正式繼承者」，這是錯的，這次翻新一併修掉。

事實是：Hermes 提供 `hermes claw migrate`，`hermes setup` 也會自動偵測 `~/.openclaw` 並問你要不要搬；能搬 SOUL.md、MEMORY.md／USER.md、自建技能、指令白名單、平台設定與白名單內的 API key。但 OpenClaw 本身仍在獨立開發，兩者是不同團隊的不同專案。官方 README 的社群連結裡甚至有一個 [HermesClaw](https://github.com/AaronWong1999/hermesclaw) 橋接器，用途是「讓 Hermes Agent 與 OpenClaw 跑在同一個微信帳號上」——如果 OpenClaw 已被取代，這個東西沒有存在理由。

遷移細節與「哪些東西搬不過去」放在[遷移那篇](/posts/ai/2026-08-18-hermes-agent-openclaw-migration)。想先看 OpenClaw 本身，站內有[OpenClaw 文件導讀系列](/posts/ai/2026-03-28-openclaw-overview)。

## 跟 Claude Code / LangGraph 的分界

| 面向 | Hermes Agent | Claude Code | LangGraph |
|---|---|---|---|
| 定位 | 個人 AI 營運系統 | 終端／IDE 的編碼 agent | 建 agent 的函式庫 |
| 常駐形態 | Gateway 常駐，訊息進來才動 | 你開才有 | 你自己部署 |
| 模型 | 20+ 供應商，可 fallback／輪替金鑰 | Anthropic 模型（含 Bedrock／Vertex） | 自己接 |
| 執行環境 | 7 種終端後端，含 serverless | 本機 | 自己部署 |
| 技能 | 自動生成 + Hub 共享 | 有（人寫） | 無 |
| 學習迴路 | 內建 | 無 | 自己做 |

比較表要小心讀。Claude Code 的「無學習迴路」不是缺陷而是取捨——它把記憶交給人維護的檔案，可預測性換掉了自動累積。Hermes 的自動生成技能與記憶策展，代價是**你的 agent 會自己改自己的行為**，這在需要可重現性的場景是負債不是資產（所以才有 `write_approval` 這種開關）。

## 什麼情況不要選它

- **只想在程式裡呼叫 LLM**：這是一套系統不是 SDK，雖然它也能[當 Python library 用](https://hermes-agent.nousresearch.com/docs/)，但你會付一堆用不到的複雜度。
- **要團隊共用的企業部署**：整體設計仍以個人／單一擁有者為中心，權限模型是「誰能私訊這個 bot」等級。
- **需要嚴格可重現的流程**：自動改寫技能與記憶會讓「同樣輸入同樣輸出」變難。要用就先把寫入審批打開。
- **不想維運**：它會常駐、會排程、會自己動。這代表你多了一個要顧的服務。

## 本系列的其他篇

| # | 主題 |
|---|---|
| 1 | 導讀（本篇） |
| 2 | [安裝與升級](/posts/ai/2026-08-18-hermes-agent-install)：原生 Windows、Termux、Nix 與回滾 |
| 3 | [模型供應商](/posts/ai/2026-08-18-hermes-agent-providers)：OAuth 訂閱、routing、fallback、金鑰池 |
| 4 | [Nous Tool Gateway](/posts/ai/2026-08-18-hermes-agent-tool-gateway)：用一份訂閱換掉四個帳號 |
| 5 | [七種終端後端](/posts/ai/2026-08-18-hermes-agent-terminal-backends)：隔離級別與狀態同步陷阱 |
| 6 | [記憶與技能](/posts/ai/2026-08-18-hermes-agent-memory-skills)：寫入審批、安全掃描、Skills Hub |
| 7 | [工具、MCP、plugin](/posts/ai/2026-08-18-hermes-agent-tools-plugins)：toolset 與 `execute_code` |
| 8 | [Gateway 與排程](/posts/ai/2026-08-18-hermes-agent-gateway-cron)：多平台與 cron 投遞 |
| 9 | [安全模型](/posts/ai/2026-08-18-hermes-agent-security)：審批、deny 規則、prompt injection |
| 10 | [從 OpenClaw 遷移](/posts/ai/2026-08-18-hermes-agent-openclaw-migration)：搬得動與搬不動的 |

## 前身與修正

本篇的前身是 2026-04-05 發佈的〈Hermes Agent：Nous Research 的自我改進 AI 代理〉，舊網址 `/posts/ai/2026-04-05-hermes-agent-intro` 已 301 轉向到這裡。這次對照上游 README 與官方文件站全面翻新，並改寫成十篇系列的導讀，修掉四個會誤導的說法：終端後端 6 種→7 種（新增 Vercel Sandbox）、Honcho 使用者輪廓已從內建改為 memory provider plugin、「Python 93%」已不成立（現為 Python ~76% / TypeScript ~20%）、以及「Hermes 是 OpenClaw 的正式繼承者」——正確說法是它提供遷移路徑，OpenClaw 仍在獨立發展。逐項指令清單改為交還官方文件。

## 參考資料

- [Hermes Agent GitHub](https://github.com/NousResearch/hermes-agent)
- [Hermes Agent 官方文件站](https://hermes-agent.nousresearch.com/docs/)
- [Nous Research](https://nousresearch.com/)
- [Nous Portal](https://portal.nousresearch.com/)
- [agentskills.io — 技能開放標準](https://agentskills.io)
- [Honcho — 使用者輪廓系統](https://github.com/plastic-labs/honcho)
- [HermesClaw — 社群微信橋接器](https://github.com/AaronWong1999/hermesclaw)
- [Atropos — Nous 的 RL 環境](https://github.com/NousResearch/Atropos)

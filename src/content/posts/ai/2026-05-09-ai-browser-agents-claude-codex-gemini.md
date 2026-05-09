---
title: "Claude、Codex、Gemini 都進瀏覽器了：三家 AI Agent 在 Chrome 的路線比較"
date: 2026-05-09
category: ai
tags: [ai-agent, chrome-extension, claude, codex, chatgpt-atlas, gemini, browser-agent]
lang: zh-TW
tldr: "Anthropic 做擴充、OpenAI 蓋自己的瀏覽器、Google 直接焊進 Chrome——三家走的是三條完全不同的路線。整理現況、差異與選擇指南。"
description: "Claude for Chrome、ChatGPT Atlas + Codex extension、Gemini in Chrome 三家 AI 瀏覽器 agent 的路線比較與選擇建議。"
draft: false
---

2026 年初到 5 月，三家主要 AI 廠商都把 agent 帶進瀏覽器了——但走的路線完全不同。Anthropic 做 Chrome 擴充功能，OpenAI 蓋了自己的瀏覽器 Atlas 並補一個 Codex 擴充功能，Google 直接把 Gemini 焊進 Chrome 本體。這篇整理三家的現況、定位差異，以及目前該怎麼選。

## Claude for Chrome

Anthropic 走的是「擴充功能」路線。2025-08 以 research preview 形式只開放給 1,000 個測試者，到 2026 進入 beta，現在所有付費方案都能用。

設計哲學是 **「meet users where they already are」**：不要求換瀏覽器、不爭奪預設搜尋引擎，以 side panel 形式坐在 Chrome 旁邊。看見的內容跟你一樣，可以點擊、填表、跨 tab 操作、執行多步驟工作流。Claude Code 的 Chrome integration（beta）也在同一條線上，給開發者用。

權限模型偏保守：敏感站點預設要逐站授權。這是有原因的——LayerX 在 2026 揭露了名為 **ClaudeBleed** 的漏洞，任何 Chrome 擴充功能（即使沒有特殊權限）都能注入指令劫持 Claude 的擴充。Anthropic 在 **2026-05-06** 推出 v1.0.70，補上敏感操作的二次確認流程。

適合：想留在 Chrome、不想換生態系、已經是 Claude 付費用戶的人。
不適合：想要 agent 直接接管整個瀏覽工作流的重度使用者——Anthropic 故意把它限制在 side panel。

## ChatGPT Atlas + Codex Chrome Extension

OpenAI 同時下兩盤棋。

**ChatGPT Atlas** 是 OpenAI 自己蓋的 Chromium-based 瀏覽器，內建 ChatGPT sidebar 與 **Agent Mode**（Plus / Pro / Business preview）。Agent Mode 比早期版本快，能直接在分頁內研究、訂行程、自動化任務。目前只有 macOS，Windows / iOS / Android 規劃中。

**Codex Chrome Extension** 是 **2026-05-07** 才剛發的另一條路線，定位完全不同：給開發者用，讓 Codex 利用「你已經登入的瀏覽器 session」操作 LinkedIn、Salesforce、Gmail、公司內部工具。它跨 tab 抓 context、用 DevTools，但刻意不接管整個瀏覽器。EU 與 UK 暫不開放。

兩條線目前並存，但 OpenAI 在 **2026-03** 已宣布要把 Atlas + ChatGPT 桌面版 + Codex 合併成單一 desktop app——這個分裂只是過渡期。

設計哲學：**控制整個瀏覽 surface**。Atlas 不是 extension，是瀏覽器；agent 能做的事比寄生在別人瀏覽器裡多得多。代價是要使用者切換瀏覽器。

適合：願意換瀏覽器、想要最深 agent 整合、或需要用 signed-in session 操作 SaaS 工具的開發者。
不適合：歐洲使用者（Codex extension 暫不開放）、不想離開 Chrome 的人。

## Gemini in Chrome

Google 是唯一不需要安裝任何東西的——**Gemini 已經內建在 Chrome 裡**。

2026-01-28 起在美國 Windows / macOS / Chromebook Plus 推出基於 Gemini 3 的新側邊欄，2026-04 擴展到 APAC。重點是 **Auto Browse**：agentic 多步操作（比價、訂房、填表、訂閱管理），目前對 Google AI Pro / Ultra 訂戶 preview 開放。

設計哲學是 **first-party 整合**：Gemini 不是寄生在 Chrome 上，是 Chrome 的一部分。這帶來幾個別人做不到的事：跨 Google Apps 的深度整合（Gmail / Drive / Calendar）、不需要授權步驟（Chrome 既有權限直接繼承）、未來的 Personal Intelligence。

代價是綁在 Google 生態裡。重度使用 Gmail / Drive / Calendar 的人，這是最順的選項；不想把更多東西交給 Google 的人，這也是最難拒絕的——因為 Chrome 一升級它就在那。

適合：Google 重度用戶、AI Pro / Ultra 訂戶、想要零摩擦體驗的人。
不適合：跨平台 / 跨生態工作的人。

## 三家比較

| 廠商 | 形式 | 模型／價位門檻 | 區域限制 | 安裝成本 |
|---|---|---|---|---|
| Anthropic | Chrome extension（beta） | 任一付費方案 | — | 安裝擴充 |
| OpenAI | Atlas 瀏覽器 + Codex extension | Plus/Pro/Business（Atlas）；Codex 訂戶 | EU/UK 無 Codex | 換瀏覽器 or 裝擴充 |
| Google | Chrome 內建 + side panel | AI Pro/Ultra（Auto Browse） | 美國先行，APAC 已開放 | 無 |

## 整體來說

三家路線其實對應三種對「agent 該住在哪裡」的答案：

- **Anthropic**：寄生在使用者既有的瀏覽器，謹慎、漸進、安全模型優先。
- **OpenAI**：自己蓋瀏覽器，agent 為主、瀏覽為輔；同時用 extension 補開發者場景。
- **Google**：用既有的 Chrome 通路把 AI 直接送到所有人桌面。

選哪個的決策點：

1. **已經付費哪一家？** 三家都有付費門檻，先看現有訂閱。
2. **願不願意換瀏覽器？** 願意 → Atlas 體驗最完整；不願意 → Claude extension 或 Gemini in Chrome。
3. **要做什麼任務？** 開發者場景、要 signed-in session → Codex extension；個人助理、研究 / 訂行程 → Atlas Agent Mode 或 Gemini Auto Browse；混在工作流中、保留主導權 → Claude for Chrome。

短期看，Atlas + Codex 合併後 OpenAI 會有最完整的 agent stack；Gemini 會吃下 Chrome 既有的渠道優勢；Claude 維持「最謹慎、最可信」的定位。一年內三條路線會繼續分化，不會收斂。

## 參考資料

- [Piloting Claude in Chrome – Anthropic](https://www.anthropic.com/news/claude-for-chrome)
- [Claude for Chrome](https://claude.com/claude-for-chrome)
- [Use Claude Code with Chrome (beta)](https://code.claude.com/docs/en/chrome)
- [ClaudeBleed flaw / v1.0.70 fix – LayerX](https://layerxsecurity.com/blog/a-flaw-in-claudes-browser-extension-allows-any-extension-to-hijack-it/)
- [Introducing ChatGPT Atlas – OpenAI](https://openai.com/index/introducing-chatgpt-atlas/)
- [ChatGPT Atlas Release Notes](https://help.openai.com/en/articles/12591856-chatgpt-atlas-release-notes)
- [Codex Chrome extension – OpenAI Developers](https://developers.openai.com/codex/app/chrome-extension)
- [OpenAI's Codex Now Works in Chrome – MacRumors](https://www.macrumors.com/2026/05/07/openai-codex-chrome-extension/)
- [OpenAI Codex Chrome extension – MarkTechPost](https://www.marktechpost.com/2026/05/08/openai-adds-chrome-extension-to-codex-letting-its-ai-agent-access-linkedin-salesforce-gmail-and-internal-tools-via-signed-in-sessions/)
- [Putting Gemini to work in Chrome – Google Blog](https://blog.google/products-and-platforms/products/chrome/gemini-3-auto-browse/)
- [Chrome + Gemini agentic features – TechCrunch](https://techcrunch.com/2026/01/28/chrome-takes-on-ai-browsers-with-tighter-gemini-integration-agentic-features-for-autonomous-tasks/)
- [Gemini in Chrome – Google](https://gemini.google/overview/gemini-in-chrome/)

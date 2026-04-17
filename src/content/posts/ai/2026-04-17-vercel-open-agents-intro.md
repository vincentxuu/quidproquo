---
title: "Vercel Open Agents：把 coding agent 從你的筆電搬到雲端"
date: 2026-04-17
category: ai
tags: [coding-agent, vercel, open-source, agent-infrastructure, sandbox]
lang: zh-TW
tldr: "Vercel Labs 開源的 coding agent 參考實作。三層架構分離 web UI、agent workflow、sandbox VM，設計給想自建 Claude Code / Cursor Background Agent 的團隊當起手。"
description: "Open Agents 的架構設計、與現成 coding agent 的取捨、實際成本結構,以及適合什麼樣的團隊 fork 來用。"
draft: false
---

Claude Code 跟 Cursor Background Agent 這類產品紅起來之後,很多團隊的問題不是「要不要導入 coding agent」,而是「現成的 agent 在我們 monorepo 跑起來很痛苦」。Vercel Labs 最近開源的 **Open Agents** 直接給了一個 reference 實作,讓團隊可以 fork 下來改成符合自己 workflow 的版本。這篇介紹它的架構、技術棧、以及實際跑起來的成本考量。

## 為什麼要有 Open Agents

Vercel CEO Guillermo Rauch 講得很直接:**「現成的 coding agents 無法處理大型 monorepo,也不懂你公司的知識、整合與 workflow」**。這是個真實痛點。Claude Code 丟到 50 萬行的 codebase 裡,光是讓它知道要去哪個 package、用哪個 lint config、跑哪個測試指令,就要塞一堆 CLAUDE.md,而且效果有限。

Open Agents 不是要跟 Claude Code 或 Cursor 競爭,而是提供一個**可 fork、可改**的參考實作,讓團隊拿去接自己的 CI、自己的 code review 流程、自己的 deployment pipeline。repo 本身不是 SaaS,是一個能跑的 Next.js app。

## 三層架構

Open Agents 的核心設計是三層分離:

```
┌─────────────────────────────────────────┐
│  Web UI (Next.js)                        │
│  - 認證、sessions、聊天串流              │
│  - 分享連結、voice input (ElevenLabs)    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Agent Workflow (Vercel Workflow SDK)    │
│  - durable 多步驟執行                    │
│  - 串流、取消、snapshot/resume           │
└──────────────┬──────────────────────────┘
               │ tools (file, shell, git)
┌──────────────▼──────────────────────────┐
│  Sandbox VM (Vercel Sandbox)             │
│  - 隔離的 filesystem / shell / git       │
│  - 每個 session 獨立                     │
└─────────────────────────────────────────┘
```

關鍵設計決策:**agent 跑在 VM 外部**,透過工具介面與 sandbox 互動,而不是在 VM 內執行。這個設計跟 Claude Code 的「直接在 user 機器跑」完全相反,好處是 agent 掛掉不會毀掉 sandbox 狀態、可以 snapshot 後切斷再恢復、同一個 agent 可以操作多個 sandbox。

## 技術棧

整個 repo 99.3% 是 TypeScript:

- **Next.js** — Web app,server component + streaming
- **Vercel Workflow SDK** — 編排 durable workflow,這是 Open Agents 能「掛掉後恢復」的關鍵
- **Vercel Sandbox** — 執行環境,給 agent 一個隔離的 Linux VM
- **PostgreSQL** — session、訊息、agent state 持久化
- **Upstash Redis / Vercel KV**(可選)— 快取
- **ElevenLabs**(可選)— 語音輸入轉文字
- **GitHub OAuth**(可選)— clone repo、開 PR

Bun 是本地開發的 runtime,部署在 Vercel。

## 跟 Claude Code / Cursor Background Agent 的取捨

不是每個團隊都該 fork Open Agents。直接用 Claude Code / Cursor 適合:

- 個人或小團隊,不需要自訂 agent 行為
- 不想維運 PostgreSQL、Sandbox、LLM API key 這些東西
- 專案規模還撐得住現成 agent 的 context

Fork Open Agents 適合:

- 大型 monorepo,需要針對 codebase 客製 tool / context strategy
- 有內部文件、內部 API、企業知識需要注入 agent
- 想把 agent 接進既有的 CI / review / deployment pipeline
- 想控制 agent 使用哪個模型、怎麼計費、資料留在自家

## 實際成本

Open Agents 本身是開源免費,但「跑起來」要錢:

| 服務 | 成本 |
|---|---|
| Vercel Hosting | Hobby 免費(個人非商用) |
| PostgreSQL (Neon / Vercel Postgres) | 免費 tier 約 0.5GB |
| Vercel Sandbox | 按使用計費 |
| LLM API (Claude / GPT) | **主要成本**,一個 session 約 $0.1 – $1+ |
| ElevenLabs voice | 每月 10K 字元免費 |

最大的錢坑是 **LLM API**。一個複雜的 coding session 吃掉幾十萬 tokens 很正常,Sonnet 級別的模型一個月重度使用破百鎂不意外。想壓成本可以考慮替換成 Groq / Gemini 的免費 tier,但產出品質會明顯差一截。

## 限制跟需要注意的地方

- **不是 plug-and-play**:這是 reference app,不是產品。fork 下來要花時間改。
- **綁 Vercel 基礎設施**:Vercel Workflow SDK 跟 Vercel Sandbox 是核心依賴,想搬到 AWS / GCP 要自己重寫這兩層。
- **沒有內建 eval**:agent 品質怎麼評估、怎麼 regression test,repo 不管。
- **Skills 生態系**:Vercel 同步推出了 `vercel-labs/skills`,是給 agent 擴充能力的開放 registry,可以搭配使用。

## 整體來說

Open Agents 是 Vercel 下的一步大棋 — 不只提供 agent 產品(Vercel Agent),還把底層參考實作開源出來,讓整個生態系往他們的基礎設施(Workflow SDK、Sandbox)靠攏。

對團隊來說,這個 repo 最大的價值不是「免費的 Claude Code 替代品」,而是**讓你看清楚一個 production-grade coding agent 該長什麼樣**:session 管理、durable execution、sandbox 隔離、streaming UI — 這些東西自己從零刻出來要幾個月,Open Agents 給你一個能跑的起點。

適合已經想清楚「我們需要自建 agent,而且有人可以維運」的團隊。如果只是想試試 coding agent 好不好用,先用 Claude Code 就好。

## 參考資料

- [vercel-labs/open-agents — GitHub](https://github.com/vercel-labs/open-agents)
- [Agentic Infrastructure — Vercel Blog](https://vercel.com/blog/agentic-infrastructure)
- [Open Agents — Vercel Template](https://vercel.com/templates/next.js/open-agents)
- [AGENTS.md — 架構技術文件](https://github.com/vercel-labs/open-agents/blob/main/AGENTS.md)
- [Introducing Skills — Vercel Changelog](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem)
- [vercel-labs/skills — GitHub](https://github.com/vercel-labs/skills)
- [Vercel launches Open Agents — Tessl.io](https://tessl.io/blog/vercel-open-sources-open-agents-to-help-companies-build-their-own-ai-coding-agents/)
- [Vercel Introduces Skills.sh — InfoQ](https://www.infoq.com/news/2026/02/vercel-agent-skills/)

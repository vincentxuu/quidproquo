---
title: "AI Agent GitHub Digest — 2026-08-22"
date: 2026-08-22
category: daily
tags: [ai-agent, github, open-source, daily, agent-framework, mcp-server, productivity-tool]
lang: zh-TW
description: "今天成長最快的兩個專案往相反方向跑——genoffice 把 agent 塞進 Office 文件格式，nanobot 把 agent 包成人人能自架的個人助理；框架端 pydantic-ai 則丟出一個底層 SDK 相容性的 breaking change"
tldr: "HKUDS/nanobot 靠 v0.3.0「The Agency Release」7 個月衝上 4.7 萬星，主打個人自架 agent runtime；genspark-ai/genoffice 用開源桌面應用做 AI 辦公套件，三週破 3,400 星；NVIDIA 發表 labs-OO-Agents（NOOA），把 agent 狀態收進單一 Python class；MCP server repo-context-mcp 幫 coding agent 讀 repo 不用整包塞進 prompt。框架端 Mastra 1.60.0 補上 durable execution 與 Cloudflare Sandbox；pydantic-ai v2.33.0 因 anthropic SDK 升級 httpx2 而有 breaking change。"
series:
  name: "AI Agent GitHub Digest"
  order: 7
---

## 今日亮點

今天成長最快的兩個 trending 專案，方向剛好相反——genspark-ai/genoffice 把 AI agent 塞進最傳統的 Office 文件格式，HKUDS/nanobot 則把 agent runtime 包成人人能自架的個人助理；中間還夾著 NVIDIA 一個把 agent 狀態收進單一 class 的學術框架，和一個專治「agent 讀不懂你的 repo」的 MCP server。框架端則有個提醒——pydantic-ai v2.33.0 因為上游 anthropic SDK 換底層 HTTP client 而丟出 breaking change，agent 框架的穩定性有一半得看上游 SDK 賞不賞臉。

## Trending Repos

### HKUDS/nanobot ⭐ 47,258

[GitHub](https://github.com/HKUDS/nanobot)　·　Python　·　MIT

- **是什麼**：超輕量、自架的個人 AI agent 框架，內建 WebUI、長期記憶、原生 MCP 整合、多 agent 協作與排程自動化，包一個 OpenAI 相容 API。
- **為什麼值得看**：近期的 v0.3.0「The Agency Release」把 nanobot 從「跑得動的工作台」升級成「能協調 subagent、切模型、把授權工作做完」的 agent runtime——新增顯式 `/goal` 指令避免隱性長跑、inline subagent 諮詢，還補了鏈式指令白名單繞過防護、SSRF 校驗與 MCP URL 憑證遮罩等安全強化。7 個月從 0 衝到 4.7 萬星，是這波「個人 agent runtime」熱潮裡漲最快的專案之一。
- **技術棧**：Python + WebUI，OpenAI 相容 API，原生 MCP 整合，支援 OpenCode、Kimi Coding、Grok 等多家 model provider。
- **上手難度**：低——`nanobot webui` 一行指令就有導引式初始設定。

---

### genspark-ai/genoffice ⭐ 3,455

[GitHub](https://github.com/genspark-ai/genoffice)　·　TypeScript　·　Apache-2.0

- **是什麼**：開源、跨平台（macOS / Windows / Linux）的 AI 辦公套件，內建 AI agent 編輯 Word（.docx）、Excel（.xlsx）、PowerPoint（.pptx）、PDF 和 Markdown。
- **為什麼值得看**：市面上多數「AI 辦公室」是雲端 SaaS（Notion AI、Google Workspace AI），genoffice 反過來做本機桌面應用，相容原生 Office 檔案格式，把 AI agent 直接接進試算表計算引擎和文件編輯器，而不是外面包一層聊天視窗。三週內破 3,400 星，成長速度顯示「本機 Office 替代品 + AI」這個組合有真實需求。
- **技術棧**：Electron 桌面殼 + TypeScript 核心引擎，Rust 處理試算表計算，Tiptap/ProseMirror 做文件編輯，Univer 做試算表 UI，PDFium 處理 PDF。
- **上手難度**：中——npm 裝依賴即可跑開發環境，但要碰 Rust 試算表模組得另外裝 Rust 工具鏈。

---

### NVIDIA-NeMo/labs-OO-Agents ⭐ 1,842

[GitHub](https://github.com/NVIDIA-NeMo/labs-OO-Agents)　·　Python　·　Other（NVIDIA 授權）

- **是什麼**：NVIDIA 團隊發表的「物件導向 AI agent」框架（論文簡稱 NOOA），把 prompt、工具、callback、workflow 這些原本分散的抽象，收進單一 Python class 統一表達。
- **為什麼值得看**：多數 agent 框架把狀態、能力、prompt 拆成好幾層抽象，NOOA 主張用一個 class 講完 agent 的狀態和型別化介面，重構、版本控管都更直覺。附帶的論文列出 SWE-bench Verified 和 Terminal-Bench 2.0 的評測結果，不是純空想架構。
- **技術棧**：純 Python，model-agnostic，支援 MCP、sandbox 執行、progressive disclosure 文件揭露。
- **上手難度**：中——概念單一，但要理解「agent as a class」的設計哲學才能上手；官方提供 notebook tutorial 做漸進式教學。

---

### nduc99911/repo-context-mcp ⭐ 101

[GitHub](https://github.com/nduc99911/repo-context-mcp)　·　TypeScript　·　MIT

- **是什麼**：一個 MCP server，幫 coding agent（Claude Code、Codex、Cursor、Cline）理解 repo 結構，不用把整個 monorepo 塞進 prompt。
- **為什麼值得看**：解決一個具體、每天在發生的問題——agent 常浪費 token 亂逛 `node_modules`、找不到入口點，或貼一堆不相關檔案進 context。這個 server 提供三個聚焦工具：`repo_map`（輕量目錄樹）、`search_code`（帶行號的字串搜尋）、`pack_context`（token 預算控制的 markdown context 包），還附一個 GitHub Action 可以在每次 PR 自動打包 context。
- **技術棧**：TypeScript，遵循 `.gitignore` 規則，CLI + MCP server 雙介面。
- **上手難度**：低——支援任何講 MCP 的 client，CLI 也能單獨用。

## Notable Releases

### Mastra @mastra/core 1.60.0

[Release Notes](https://github.com/mastra-ai/mastra/releases)

- **重要變更**：Agents API 新增 durable execution，不用額外部署就能跑長流程；新增 Cloudflare Sandbox provider 跑遠端工作區；MCP 協定升級支援 2026-07-28 stateless 版本；LocalSandbox 新增檔案系統持久化 checkpoint，加快熱啟動；RAG 支援可持久化的知識圖譜快照，降低重啟成本。
- **Breaking Changes**：官方 changelog 明寫本次無。但前一版 v1.59.0 已把 `CostGuardProcessor` 改名為 `TokenCostControl`，還在用舊名的人要留意。
- **對你的影響**：如果你在用 Mastra 跑長流程 agent，durable execution 讓你不用自己維護 retry / resume 邏輯；部署在 Cloudflare 上的人可以直接用新 Sandbox provider，省下自架執行環境的工。

---

### pydantic-ai v2.33.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.33.0)

- **重要變更**：Anthropic client 底層改用 `httpx2`——因為 `anthropic` SDK 從 1.0.0 開始整個建構在 `httpx2` 上，砍掉對舊版 `httpx` 的支援，pydantic-ai 跟著升級以支援 `anthropic>=1.0.0`。
- **Breaking Changes**：有。若你自己傳 `http_client` 給 `AnthropicProvider`，必須換成 `httpx2.AsyncClient`，舊版 `httpx` client 在 1.x SDK 建構階段就會被拒絕。
- **對你的影響**：升級 pydantic-ai 前先確認你的 `anthropic` 套件版本——要嘛跟著升到 `anthropic>=1.0.0` 並換掉自訂 `http_client`，要嘛暫時把 `anthropic` 釘在 `<1` 版本讓現有程式碼撐著別動。

## 今日收穫

原本以為 agent 產品化的下一步是繼續往終端機、IDE 裡卷；但今天漲最快的兩個專案——genoffice 把 agent 塞進最傳統的 Office 文件格式、nanobot 把 agent runtime 包成人人能自架的個人助理——說明市場其實在往兩個相反方向同時擴張：往「熟悉的辦公場景」和「個人自主可控」延伸。而 pydantic-ai 這個純底層相容性的 breaking change 提醒我們，agent 框架的穩定性一半是自己的架構，一半得看 anthropic、openai 這類底層 SDK 的版本管理有沒有跟上——生態越蓬勃，這種上游耦合的風險反而越明顯。

## 參考資料

- [HKUDS/nanobot](https://github.com/HKUDS/nanobot)
- [nanobot v0.3.0 Release Notes](https://github.com/HKUDS/nanobot/releases/tag/v0.3.0)
- [genspark-ai/genoffice](https://github.com/genspark-ai/genoffice)
- [NVIDIA-NeMo/labs-OO-Agents](https://github.com/NVIDIA-NeMo/labs-OO-Agents)
- [NOOA Paper (arXiv)](https://arxiv.org/abs/2607.20709)
- [nduc99911/repo-context-mcp](https://github.com/nduc99911/repo-context-mcp)
- [Mastra @mastra/core 1.60.0 Release Notes](https://github.com/mastra-ai/mastra/releases)
- [pydantic-ai v2.33.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.33.0)

---
title: "AI Agent GitHub Digest — 2026-10-30"
date: 2026-10-30
category: daily
tags: [ai-agent, github, open-source, daily, agent-memory, agent-governance, multi-agent]
lang: zh-TW
description: "claude-mem 衝破 10 萬星的同一天，GitHub trending 冒出教育 agent、遊戲工作室樣板，還有一個讓任何 repo 一行指令生出自己 harness 的工具"
tldr: "**thedotmack/claude-mem**（⭐ 104,523，今日 +459）正式衝破 10 萬星，同時補上 Codex subagent 的記憶時間軸；**HKUDS/DeepTutor**（⭐ 49,631，今日 +1,926）把個人化家教做成會自己維護知識庫的多代理系統；**Donchitos/Claude-Code-Game-Studios**（⭐ 28,954，今日 +538）把 Claude Code 包成 49 個 agent 的遊戲工作室樣板；**ruvnet/metaharness**（⭐ 729）讓任何 repo 一行指令生出自己品牌的 agent harness，內建治理政策與審批閘門。release 這邊 Mastra 1.80.0 開放終端使用者各自綁 OAuth 連線（含 4 項 breaking change），crewAI v1.15.33 補上技能搜尋與 flow 參數傳遞。"
series:
  name: "AI Agent GitHub Digest"
  order: 76
---

> 🌏 [English version](/posts/daily/2026-10-30-ai-agent-github-digest-en)

## 今日亮點

昨天 Agno v3.1.11 才把 Claude Code／Codex 接成 Team 的正式成員，今天 Agno v3.1.12 緊接著補上「Native Approvals」——這些外部 coding agent 自己發出的權限請求，現在會直接浮上 AgentOS 的審批介面（詳見[昨天的深入介紹](/posts/daily/2026-10-29-framework-agno-v3.1.11)）。同一天，Mastra 1.80.0 開放終端使用者各自綁定自己的 OAuth 連線、metaharness 把「治理政策＋審批閘門＋可驗證簽章」直接當成生成 agent harness 時的預設配置——三個不同層級（runtime 權限、服務連線、harness 生成）在同一天都往「先把關卡裝好，再放手讓 agent 做更多事」收斂。trending 這邊則是 agent 應用場域持續擴散：claude-mem 衝破 10 萬星示範「記憶」已是基礎設施等級的剛需，DeepTutor 把它用在教育垂直領域，Claude-Code-Game-Studios 則是把整個遊戲工作室的分工結構搬進 Claude Code。

## Trending Repos

### thedotmack/claude-mem ⭐ 104,523 (+459)

[GitHub](https://github.com/thedotmack/claude-mem)　·　TypeScript　·　Apache-2.0

- **是什麼**：讓 Claude Code、OpenClaw、Codex、Gemini、Hermes、Copilot、OpenCode 等多種 coding agent 跨 session 保留記憶的 hook 層工具——每次 session 結束，用 AI 把工具操作壓縮成摘要存起來，下次開新 session 時自動把相關記憶注入回去。
- **為什麼值得看**：這個 repo 本站 8 月底寫過一次（當時 9.2 萬星），兩個月後正式衝破 10 萬星，star 增速沒有明顯趨緩，顯示「跨 session 記憶」這個痛點遠比想像中普遍。更值得注意的是最新一輪 release 把記憶時間軸延伸到了 Codex 的 subagent——新的 `SubagentStart` hook 讓新開的 subagent 一開始就拿到跟主 session 一樣的記憶脈絡，但從父 session fork 出來、本來就會繼承歷史的 subagent 會被跳過，避免重複注入。
- **tech stack**：hook 式整合各家 CLI 的 lifecycle 事件（SessionStart／UserPromptSubmit／PreToolUse／PostToolUse／Stop／SessionEnd／SubagentStart）+ Node.js worker 做壓縮與檢索
- **上手難度**：低——`npx claude-mem install` 一行裝進 Claude Code，其他 CLI 有對應安裝旗標或外掛市集版本

---

### HKUDS/DeepTutor ⭐ 49,631 (+1,926)

[GitHub](https://github.com/HKUDS/DeepTutor)　·　Python　·　Apache-2.0

- **是什麼**：香港大學資料科學實驗室做的「終身個人化家教」系統——把書、影片、PDF、GitHub repo 都收進可持續同步的知識庫，再用多代理架構幫你讀書、出題、生筆記、追蹤學習進度。
- **為什麼值得看**：多數教育類 AI 工具停在「問答機器人」層級，DeepTutor 把一整套學習工作流都 agent 化：沉浸式閱讀時逐頁引用來源、依掌握程度分級的 Mastery Path 會依表現動態調整，連知識庫都能跟 MarginNote、IMA 等既有閱讀 app 雙向同步而不是另起一個孤島。release 節奏極快（過去兩個月發了近 20 個版本），功能迭代速度本身就說明團隊在持續根據真實使用回饋調整。
- **tech stack**：Python 後端 + 第一方 LightRAG 做知識檢索 + 多 provider 模型路由（含本地模型）+ 瀏覽器前端閱讀器
- **上手難度**：中——自架需要設定至少一個模型供應商金鑰，官方也提供託管版可直接試用

---

### Donchitos/Claude-Code-Game-Studios ⭐ 28,954 (+538)

[GitHub](https://github.com/Donchitos/Claude-Code-Game-Studios)　·　Shell　·　MIT

- **是什麼**：把 Claude Code 包裝成一整間遊戲開發工作室的樣板——49 個分工明確的 AI agent（企劃、程式、美術、QA 等角色）配 72 個工作流技能，模仿真實遊戲工作室的組織層級互相協作。
- **為什麼值得看**：跟近期一堆「單一技能包」不同，這個專案示範的是把整套開發團隊的職能分工直接編碼成 agent 角色與技能的組合，而不是靠一個全能 agent 自己判斷該扮演什麼角色。對比同天的 claude-mem（記憶層）、DeepTutor（教育應用），這個 repo 代表的是另一條路線：把既有產業的組織結構原封不動搬進 agent 協作框架裡。GitHub 把它標成模板 repo（`is_template: true`），方便直接 fork 成自己專案的起點。
- **tech stack**：Shell 腳本編排 + Claude Code plugin／skill 機制定義 49 個 agent 角色與 72 個技能
- **上手難度**：中——需要先熟悉 Claude Code 的 skill／subagent 機制，角色與技能數量多，上手前建議先讀過官方文件的協作流程說明

---

### ruvnet/metaharness ⭐ 729

[GitHub](https://github.com/ruvnet/metaharness)　·　TypeScript　·　MIT

- **是什麼**：「harness 的 harness」——給任何 GitHub repo 或空白專案生成一套專屬品牌的 agent harness：自己的 `npx` CLI、本地 MCP server、限定在該專案的記憶命名空間、治理政策，以及簽章驗證的發布流程，可以直接接進 Claude Code、Codex、pi.dev、Hermes、OpenClaw 等多種 host。
- **為什麼值得看**：目前大多數「幫你的 agent 加能力」的工具解決的是單一面向（記憶、技能、審查），metaharness 想解決的是更上層的問題——每個嚴肅的 repo 都該有一個量身打造、而不是通用的 agent，但從零手刻一個 harness 的門檻太高。它把生成出來的東西定位成「你自己的產品」（your name, your branding），而不是繼續依賴某個共用框架；內建的治理政策與見證簽章（witness-signed provenance）也呼應了今天 Agno／Mastra release 裡同時出現的審批與連線範圍收斂趨勢。星數還不大，屬於早期階段，但剛好趕上 GitHub Universe 2026 發布時機，值得留意後續成長。
- **tech stack**：TypeScript CLI + 可發佈的 npm 套件產出 + MCP server 腳手架 + 瀏覽器端 Studio（zero-upload，資料不離開本機）
- **上手難度**：中——`npx metaharness` 在瀏覽器跑完整流程最快，但要真正客製治理政策與記憶命名空間，需要讀過 USERGUIDE 跟 ARCHITECTURE 文件

## Notable Releases

### Mastra @mastra/core 1.80.0

[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.80.0)

- **重要變更**：`@mastra/connect` 新增終端使用者（per-resource）層級的 OAuth 連線，`tools({ resourceId })` 加 `userConnectRoutes()`，讓每個使用者用自己的帳號授權，並強制一個使用者的連線不能被另一個使用者的 agent 拿去用；新增 `request_connection` 工具，agent 缺少某個整合時能直接丟出結構化的「連線請求」卡片給聊天介面渲染；新增 span 聚合 API（ClickHouse／Postgres／DuckDB 皆支援），一次查出 agent 跑次數、延遲、錯誤率、token、成本等分組統計；串流錯誤分類統一化，provider 的狀態碼／requestId／model id 等資訊現在會跟著串流一起送到前端。
- **Breaking Changes**：有，四項——`queryTraceThreads()` 回傳的 thread 資料不再帶 `model`／`provider` 欄位，且 `page.limit` 上限收緊到 100（預設 25）；`@mastra/connect` 的 connect-session 建立 API 回傳欄位從 `connectUrl` 改成 `launchUrl`；`@mastra/code-sdk` 不再預設註冊內建 subagent，要用舊行為得自己傳 `subagents: [...builtinSubagents]`；`@mastra/playground-ui` 的 `TracesExplorer` 排序 API 改成單一 `{ field, direction }` 物件。
- **對你的影響**：如果你的應用有多個終端使用者各自要連自己的第三方帳號（而不是整個 app 共用一組服務帳號），這版的 per-resource 連線值得優先升級；如果你的程式碼呼叫過 `queryTraceThreads()`、`@mastra/connect` 的 session 建立 API、或 `TracesExplorer` 排序 API，升級前要照著上面四項改寫，否則會直接壞掉。

---

### crewAI v1.15.33

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.33)

- **重要變更**：新增 `crewai skill search` 指令列出組織內可用的技能；`crewai run --inputs` 可以把參數直接傳給 Python flow；`deploy create --zip` 加上印出這次部署的 zip 是從哪個 commit 建的；修了一批 bug：LiteLLM 的工具呼叫／結構化輸出現在會正確回報 token 用量、還原了部分舊版相容的 import 路徑、讓較舊的 `crewai-core` 也能跑 JSON crew runner、`crewai chat` 可以載入 JSON crew、`crewai update` 改成只印升級指令而不是直接改寫 uv 專案設定。
- **Breaking Changes**：無明說，多數是修復既有行為不一致的 bug fix。
- **對你的影響**：如果你用 `crewai update` 管理依賴版本，要注意這版改成只給建議指令、不會再自動幫你改 `pyproject.toml`；其餘多是修復性更新，正常升級不需要額外調整程式碼。

## 今日收穫

原本以為「治理政策＋審批閘門」只會出現在企業導向的大框架裡，是得先有一定規模才負擔得起的基礎設施；但 metaharness 把這些東西直接當成「幫任何 repo 生一個專屬 agent」時的預設配置，而不是事後加裝的選配——這代表治理層已經從「大公司才做得起的事後補強」，變成「生成 agent 當下就該內建」的標準配置,門檻正在快速往下降到個人專案也能一行指令擁有。

## 參考資料

- [thedotmack/claude-mem — GitHub repo](https://github.com/thedotmack/claude-mem)
- [claude-mem Releases（Codex subagent 記憶時間軸）](https://github.com/thedotmack/claude-mem/releases)
- [HKUDS/DeepTutor — GitHub repo](https://github.com/HKUDS/DeepTutor)
- [Donchitos/Claude-Code-Game-Studios — GitHub repo](https://github.com/Donchitos/Claude-Code-Game-Studios)
- [ruvnet/metaharness — GitHub repo](https://github.com/ruvnet/metaharness)
- [Mastra @mastra/core@1.80.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.80.0)
- [crewAI v1.15.33 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.33)
- [Agno v3.1.11 深入介紹（Harness Agents）](/posts/daily/2026-10-29-framework-agno-v3.1.11)
- [GitHub Trending (daily snapshot, 2026-10-30)](https://github.com/trending?since=daily) — 今日 trending 榜單原始來源，含各 repo 當日星數與增量

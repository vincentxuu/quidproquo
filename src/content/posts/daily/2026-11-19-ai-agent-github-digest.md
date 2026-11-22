---
title: "AI Agent GitHub Digest — 2026-11-19"
date: 2026-11-19
category: daily
tags: [ai-agent, github, open-source, daily, security, agent-skills, pydantic-ai, mastra]
lang: zh-TW
description: "Pydantic AI 和 CrewAI 同一天都在修依賴鏈捅出的安全洞；Mastra 跟進 LoopForge 推出自己的 issue-to-PR Factory"
tldr: "Pydantic AI v2.70.0 修了兩個高風險 ReDoS 漏洞，CrewAI 1.15.42 補上 soupsieve 的 CVE；Claude Code 紅隊技能包 Claude-BugHunter 單日破千星，Google 把 Agent Skills 接上自家設計工具 Stitch，Mastra 也推出自己的 issue 進、PR 出的 Factory 範本。"
series:
  name: "AI Agent GitHub Digest"
  order: 96
---

> :globe: [English version](/posts/daily/2026-11-19-ai-agent-github-digest-en)

## 今日亮點

今天的主線是「安全補強追上框架擴張的速度」——Pydantic AI 一次修了兩個藏在正規表達式裡的 ReDoS 高風險漏洞，CrewAI 同一天也把第三方套件 soupsieve 的版本下限拉高修掉一個 CVE；工具鏈這邊，Mastra 跟進昨天介紹過的 Tencent LoopForge，推出自己的「issue 進、PR 出」Factory 範本，Google 也把 Agent Skills 開放標準接到自家設計工具 Stitch 上——「skill 當外掛單位」正在變成每條產品線的標準配件。

## Trending Repos

### elementalsouls/Claude-BugHunter ★ 11,028 (+1,005)

[GitHub](https://github.com/elementalsouls/Claude-BugHunter)　·　Python　·　MIT

- **是什麼**：給 Claude Code 用的紅隊／抓漏技能包，83 個 skill、15 個 slash command，內容整理自 681 份已公開的 HackerOne 報告，涵蓋 24 類漏洞，外加企業身分系統（M365/Entra、Okta、vCenter）的攻擊鏈範本。
- **為什麼值得看**：裝上之後 Claude Code 不是單純回答安全問題，而是照「偵查→分類漏洞→驗證→寫報告」四層技能依描述自動接棒，還內建 Burp MCP 整合跟交付稿模板——把一個資安研究員的工作習慣打包成可重複安裝的技能包，不是一次性 prompt。單日 +1,005 顆星，是今天漲最快的 Agent 相關專案之一。
- **Tech Stack**：Claude Code Skills + 83 個 skill 檔 + Burp MCP + cbh CLI（pipx 安裝）
- **上手難度**：低——`/plugin install claude-bughunter@elementalsouls` 一行裝完，所有技能依描述自動觸發，不用手動呼叫

---

### google-labs-code/stitch-skills ★ 10,350

[GitHub](https://github.com/google-labs-code/stitch-skills)　·　TypeScript　·　Apache-2.0

- **是什麼**：Google Labs 官方做的 Agent Skills 庫，專門配 Stitch（Google 的 AI UI 設計工具）的 MCP server 用，照 Agent Skills 開放標準寫成，Codex、Antigravity、Gemini CLI、Claude Code、Cursor 都能裝。
- **為什麼值得看**：這不是社群拼出來的外掛，是 Google 自己把「設計」「建置」「工具」三種技能拆成三個套件（stitch-design／stitch-build／stitch-utilities），讓 coding agent 能呼叫 Stitch 的 MCP server 做介面設計——算是大廠把「skill 市集」模式用在自家產品線的具體案例，連續兩天被自動化的 trending 追蹤機器人標記。
- **Tech Stack**：Agent Skills 開放標準 + Stitch MCP server + `npx plugins`/`npx skills` CLI
- **上手難度**：中——要先完成 Stitch MCP server 的設定，再用 `npx plugins add google-labs-code/stitch-skills` 裝進對應 coding agent

---

### ysunyang4/Nexus ★ 405

[GitHub](https://github.com/ysunyang4/Nexus)　·　TypeScript　·　AGPL-3.0

- **是什麼**：一個本機 MCP 控制面，讓 ChatGPT、DeepSeek 這類「網頁版」AI 助手透過瀏覽器外掛連到你的電腦，執行檔案讀寫、終端機指令、Git 操作等上百種工具，範圍跟權限自己設。
- **為什麼值得看**：市面上的 MCP client 多半只服務裝在本機的 coding agent（Claude Code、Cursor），Nexus 反過來解決「我只想用網頁版 ChatGPT，但想讓它動我電腦」的落差——用 write-ahead log 記每次工具呼叫，斷線重連不會重複執行，`.env`、`.pem`、`id_rsa` 這類敏感檔案預設遮罩不給碰。開發者在 LINUX DO 社群自己發文公開這個專案，5 天內從 0 長到 405 顆星。
- **Tech Stack**：Tauri 2 桌面應用 + Fastify MCP server（Streamable HTTP）+ SQLite WAL + 瀏覽器外掛
- **上手難度**：中——要先裝桌面端的 Nexus，再裝瀏覽器外掛，才能把網頁 AI 的輸出接回本機工具

---

### mastra-ai/softwarefactory-template ★ 64（今日上線）

[GitHub](https://github.com/mastra-ai/softwarefactory-template)　·　TypeScript　·　未標授權

- **是什麼**：Mastra 今天在 Show HN 公開的「Factory」範本——接上你的 GitHub repo，把 issue 轉成計畫、實作、送出 PR 讓人審，整套跑在你自己起的 Factory Server 上，也能接 Linear、Jira、Slack。
- **為什麼值得看**：跟昨天介紹過的 Tencent LoopForge 是同一種「issue 進、PR 出、人在中間審」模式，但 Mastra 把它包成認證、儲存、沙箱都能單獨替換的範本，不綁死單一供應商——而且 Factory 本身就是拿 Mastra 自己的框架搭出來的，是一個「吃自己狗糧」的公開案例。
- **Tech Stack**：Mastra 框架 + PostgreSQL/pgvector + Docker sandbox，認證／儲存／沙箱皆可替換供應商
- **上手難度**：中——`npm create factory` 建好專案後，還要自己設定 GitHub App 權限和模型供應商金鑰，才能跑完第一個 issue

## Notable Releases

### Pydantic AI v2.70.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.70.0)

- **重要變更**：修了兩個高風險 ReDoS 漏洞——`strip_ansi` 清除跳脫字元的正規表達式（[GHSA-m4cr-m4qc-9hh3](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-m4cr-m4qc-9hh3)）和內建 `jwt` 密鑰遮罩規則（[GHSA-5m5q-5qj4-gx9h](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5m5q-5qj4-gx9h)），都已在 `pydantic-ai-harness` 0.70.0 修好；另外新增 `StreamGuardrail`（串流輸出先過濾再給呼叫者看）、`PruneToolResults`，並把 `service_tier` 轉傳給 xAI。
- **Breaking Changes**：沒有函式簽名層的硬斷裂，但官方把這次定調成「Compatibility Notes」，列了 14 項行為變化，包含 Groq 的輸出格式判斷、Anthropic 重試邏輯等。
- **對你的影響**：如果你的 pipeline 對模型回應做過 `strip_ansi`，或用內建 `redact_secrets`／`secret_data()` 的 `jwt` 規則處理使用者可控的大段文字，在升級到 `pydantic-ai-harness` 0.70.0 之前，這兩個 regex 都可能被幾百 KB 的惡意輸入卡住事件迴圈十幾秒到幾分鐘，建議直接升級而不是先評估風險。

---

### CrewAI 1.15.42

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.42)

- **重要變更**：把 ChromaDB 從必裝依賴改成選用 extra，Knowledge 功能預設改接本機 Qdrant，不再綁死 Chroma；同時把第三方套件 soupsieve 的版本下限拉到 4.0，修掉 [CVE-2026-126190](https://github.com/advisories/GHSA-mmhr-3c5m-f64f)。
- **Breaking Changes**：如果你的程式碼假設 Knowledge 一定用 ChromaDB（例如直接操作底層 Chroma client），升級後預設後端已經換成 Qdrant，需要照文件明確指定要用的 vector store。
- **對你的影響**：單純透過 CrewAI 的 Knowledge API 使用不會壞，但如果部署流程是靠裝 crewAI 順便把 ChromaDB 一起拉進來給別的用途用，現在要自己明確加上 extra 才會裝到。

## 今日收穫

原本以為 agent 框架的版本更新大多是加功能，但今天 Pydantic AI 和 CrewAI 同一天的更新都是在修「拉進來的依賴」捅出的安全洞——一個是自己寫的 regex 有 ReDoS，一個是第三方套件 soupsieve 本身有 CVE。框架自己的程式碼沒出錯，風險是從它們背的那條 transitive dependency 鏈冒出來的。這提醒我：評估一個 agent 框架的風險面，不能只看它自己的 commit log，還要跟著看它拉進來的那一串套件。

## 參考資料

- [elementalsouls/Claude-BugHunter - GitHub](https://github.com/elementalsouls/Claude-BugHunter)
- [AI Open Source Trends 2026-11-18 - kouweizhu/agents-radar#1006](https://github.com/kouweizhu/agents-radar/issues/1006)
- [google-labs-code/stitch-skills - GitHub](https://github.com/google-labs-code/stitch-skills)
- [ysunyang4/Nexus - GitHub](https://github.com/ysunyang4/Nexus)
- [mastra-ai/softwarefactory-template - GitHub](https://github.com/mastra-ai/softwarefactory-template)
- [Show HN: Mastra Factory](https://news.ycombinator.com/item?id=50548660)
- [Pydantic AI v2.70.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.70.0)
- [CrewAI 1.15.42 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.42)

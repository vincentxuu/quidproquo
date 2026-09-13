---
title: "AI Agent GitHub Digest — 2026-09-13"
date: 2026-09-13
category: daily
tags: [ai-agent, github, open-source, daily, mcp, developer-tools, agent-security]
lang: zh-TW
description: "worktrunk 解決多 agent 平行工作、CloddsBot 用 x402 讓 agent 互相付錢、pentagi 讓 agent 自己找漏洞——今天的 GitHub trending 在往「agent 自己辦事」的方向走"
tldr: "max-sixty/worktrunk 把 git worktree 管理做得像切換分支一樣簡單，專為平行跑多個 coding agent 設計；melgarafael/DeskcommCRM 用 MCP 把整個 CRM 開放給 AI agent 操作，鎖定 WhatsApp 銷售場景；alsk1992/CloddsBot 內建 x402 協定讓 agent 互相付 USDC，同時也把 200 倍槓桿交易包進同一個聊天介面；vxcontrol/pentagi 用全自動 agent 在 Docker 沙箱裡跑滲透測試；DSPy 3.4.0 Beta 1 把 LM 執行層換成內建引擎，取代 3.3 版的實驗性型別"
series:
  name: "AI Agent GitHub Digest"
  order: 29
---

## 今日亮點

今天 trending 上的專案有個共同方向：agent 不再只是「幫你寫程式」，而是開始處理需要自主決策的真實事務——worktrunk 解決的是同時管理多個 agent 平行工作的基礎設施問題，DeskcommCRM 讓 agent 直接經營客戶關係，CloddsBot 用 x402 協定讓 agent 之間可以互相付錢辦事不用人核准每一筆，pentagi 則讓 agent 自己規劃並執行滲透測試。自主性的邊界，正從「寫程式」往「花錢」「動手」推進。

## Trending Repos

### max-sixty/worktrunk ⭐ 7,140 (+137)

[GitHub](https://github.com/max-sixty/worktrunk)　·　Rust　·　MIT OR Apache-2.0

- **是什麼**：CLI 工具，把 git worktree 管理做得像切換分支一樣簡單，讓你能同時開好幾個 coding agent 平行工作，不互相踩到彼此的變更。
- **為什麼值得看**：原生 git 開一個新 worktree，光是打分支名字就要打三次（`git worktree add -b feat ../repo.feat && cd ../repo.feat`），worktrunk 把它縮成一行 `wt switch -c feat`，還內建 LLM 自動寫 commit message、一鍵 squash/rebase/merge、以及在多個 worktree 間共用 build cache（APFS/btrfs/XFS 上不必重建 `node_modules`）。當「同時跑 5-10 個 Claude Code / Codex agent」變成日常工作方式，這類基礎設施補的正是 git 原生沒解決的體驗落差。
- **tech stack**：Rust + git worktree + shell hook 系統
- **上手難度**：低——`brew install worktrunk && wt config shell install` 一行裝完就能用

---

### melgarafael/DeskcommCRM ⭐ 1,707 (+505)

[GitHub](https://github.com/melgarafael/DeskcommCRM)　·　TypeScript　·　MIT

- **是什麼**：巴西團隊做的開源「AI 銷售作業系統」——自架 CRM，原生用 AI agent 在 WhatsApp 上接待、篩選、成交客戶，比照 Kommo、Octadesk、Intercom。
- **為什麼值得看**：不是把 chatbot 貼在 CRM 外面充當客服，而是把整個 CRM 用內部 MCP server 開放出來，讓 agent 真的「操作」它——移動客戶在銷售漏斗的階段、判斷該不該轉真人、依對話結果自己提出改進建議（人工把關才會生效）。多租戶架構讓同一套核心服務電商、診所、房仲、線上課程，只是換一套詞彙（lead 在這裡叫「客戶」，在那裡叫「病患」）。一天漲 505 星，說明「AI native 垂直 SaaS」在拉美中小企業市場的需求是真的。
- **tech stack**：Next.js 16 + Supabase（Postgres + pgvector）+ WAHA（WhatsApp）+ Vercel AI SDK v7
- **上手難度**：中——提供一鍵 VPS 安裝腳本，但要準備網域、Supabase 帳號和一組 AI provider 金鑰

---

### alsk1992/CloddsBot ⭐ 2,411 (+377)

[GitHub](https://github.com/alsk1992/CloddsBot)　·　TypeScript　·　MIT

- **是什麼**：開源 AI 交易終端，一個 agent 同時操作 1000+ 個市場——預測市場（Polymarket、Kalshi）、加密貨幣現貨、最高 200 倍槓桿的永續合約、Solana 代幣發行，全部用聊天下指令。
- **為什麼值得看**：真正的看點不是交易策略，是它把 x402 協定內建進來做「agent 對 agent」的 USDC 微支付——agent 可以自己付錢買運算資源、買別的 agent 寫好的交易策略、甚至自己發代幣籌資，不需要人類批准每一筆交易。這是「agent commerce（agent 經濟）」從概念變成可以跑的程式碼的具體案例。但反面也要說清楚：它把 200 倍槓桿的真錢交易包進同一個聊天介面，風控引擎（VaR/CVaR、斷路器）做得再完整，自動化槓桿交易本身的風險不會因為 UI 好用就消失。
- **tech stack**：Claude（Anthropic）+ TypeScript + LanceDB（語意記憶）+ x402 協定
- **上手難度**：高——牽涉真實資金、私鑰管理和多個交易所 API 金鑰，上線前務必先讀完風控與安全文件

---

### vxcontrol/pentagi ⭐ 23,286 (+193)

[GitHub](https://github.com/vxcontrol/pentagi)　·　Go　·　自訂授權（含 EULA）

- **是什麼**：全自動的滲透測試 AI agent 系統，agent 自己規劃並執行完整的滲透測試流程，定位是給資安研究員和已取得授權的滲透測試團隊用的工具。
- **為什麼值得看**：所有操作都在隔離的 Docker sandbox 裡執行，內建 20 多套專業資安工具（nmap、metasploit、sqlmap），有長期記憶會保留過去成功的測試路徑供之後參考，也可以選配 Graphiti（Neo4j）知識圖譜做語意關聯。跟「一鍵攻擊腳本」不同，它強調的是可觀測性——每一步 agent 決策都能被監督與追蹤，這是它敢把「Fully Autonomous」放進專案名稱的底氣。
- **tech stack**：Go + Docker sandbox + 多 LLM provider（Anthropic、OpenAI、DeepSeek 等）+ Langfuse 可觀測性
- **上手難度**：中——`docker compose up` 起完整服務，但務必先確認測試對象已取得授權再上線使用

## Notable Releases

### DSPy 3.4.0 Beta 1

[Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.0b1)

- **重要變更**：LM 執行層換成 DSPy 內建的 `lm15` 引擎（`engine="auto"` 時優先走原生執行，不支援的路徑才退回 LiteLLM）；自訂 LM 後端改成實作 `complete(Request) -> Response` 介面，不用再繼承 `BaseLM`；ReActV2 支援 async 執行；新增本地 CPython 直譯器跑可信任程式碼；GEPA 支援自訂 Flex 程式碼提案。
- **Breaking Changes**：3.3 版引入的實驗性 LM 型別在這版被取代——官方說法是「3.4 是 LM 轉換版，3.5 是遷移死線」，如果你自訂過 LM、直接傳過 OpenAI 格式訊息給 LM、或用 `n` 參數要多個答案，升級前要先看相容性文件。
- **對你的影響**：這還是 beta（`pip install --upgrade "dspy==3.4.0b1"`，不會被 `pip install dspy` 抓到），不急著升級的話可以先觀望；如果本來就在用自訂 LM 或依賴串流，建議先在測試環境跑一輪 native 與 LiteLLM 兩種 engine 的行為差異再決定。

## 今日收穫

原本以為 agent 的「自主性」故事還停留在「自己寫程式、自己跑測試」，今天這幾個專案讓我調整了想法——worktrunk 解決的是「多個 agent 同時工作」的基礎設施問題，這是規模化的前提；但真正的分水嶺其實是 CloddsBot 的 x402 支付：當 agent 可以自己付錢辦事、不需要人類批准每一筆交易，它就從「工具」變成了「有預算的行為者」。這一步一旦邁出去，接下來要問的問題就不是「agent 能不能做」，而是「要給它多少花錢的權限」。

## 參考資料

- [max-sixty/worktrunk — GitHub](https://github.com/max-sixty/worktrunk)
- [melgarafael/DeskcommCRM — GitHub](https://github.com/melgarafael/DeskcommCRM)
- [alsk1992/CloddsBot — GitHub](https://github.com/alsk1992/CloddsBot)
- [vxcontrol/pentagi — GitHub](https://github.com/vxcontrol/pentagi)
- [GitHub Trending（daily，2026-09-13 擷取）](https://github.com/trending?since=daily)
- [DSPy 3.4.0 Beta 1 Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.0b1)

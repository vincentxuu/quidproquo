---
title: "AI Agent GitHub Digest — 2026-11-24"
date: 2026-11-24
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, mcp, security]
lang: zh-TW
description: "Claude-BugHunter、superpowers 靠「把專業包成 skill」衝上榜；dbx 選的是另一條路——把 AI 和 MCP 直接做進工具本體；paper-orchestra 五天漲了 3.2 倍，垂直任務又一次跑贏通用框架"
tldr: "elementalsouls/Claude-BugHunter 今天單日漲 1,716 顆星，是整個 trending 榜最快；obra/superpowers 總星數破 32 萬，走「技能包」路線；t8y2/dbx 不靠外部 agent，自己把 AI 助理和 MCP server 做進資料庫工具；google-research/paper-orchestra 五天內星數漲 3.2 倍。今日沒有符合門檻的重要框架更新。"
series:
  name: "AI Agent GitHub Digest"
  order: 101
---

> :globe: [English version](/posts/daily/2026-11-24-ai-agent-github-digest-en)

## 今日亮點

把今天的「Agent 技能化」潮流拆開看，會看到一條分岔正式成形：Claude-BugHunter 和 superpowers 這兩個新進榜的大熱門，走的都是「把專業打包成 skill 塞進既有 agent」——一個教 Claude Code 做滲透測試和抓蟲，一個教它用什麼方法論寫軟體；但 dbx 走的是另一條路，直接把 AI SQL 助理和 MCP server 做進資料庫管理工具本體，不靠外部 agent 掛載。同時，五天前才報過的 paper-orchestra——垂直聚焦在「寫論文」這單一任務——總星數從 1,889 漲到 6,024，漲了 3.2 倍，通用框架退燒、單一垂直任務加速的模式又多了一個獨立案例。

## Trending Repos

### elementalsouls/Claude-BugHunter ★18,447 (+1,716/日)

[GitHub](https://github.com/elementalsouls/Claude-BugHunter)　·　Python　·　MIT + CC BY 4.0

- **是什麼**：一包 83 個 Claude Code skill + 15 個 slash command，把漏洞挖掘和外部紅隊測試的流程整個封裝進去——方法論、681 份已揭露 HackerOne 報告整理出的攻擊模式、企業身分／基礎設施攻擊鏈，以及提交報告前的七問檢核，全部按主題自動觸發，不用手動叫技能名字。
- **為什麼值得看**：市面上「給 agent 裝技能」大多停在通用寫程式輔助，這包直接把一個資安研究者的實戰手冊（含 VRT 對應、OOS 爭議回覆模板）整個變成技能，今天單日漲了 1,716 顆星，是整個 trending 榜今天漲最快的 repo，說明「把稀有專業知識包裝成 skill」這個做法的天花板比想像中高。
- **Tech Stack**：Claude Code Skills 系統 + Burp Suite MCP 整合 + `cbh` CLI（pipx 安裝）
- **上手難度**：低——`/plugin marketplace add` 一行裝完，HackerOne API 金鑰可留空，公開工具照樣能用

---

### obra/superpowers ★324,432 (+788/日)

[GitHub](https://github.com/obra/superpowers)　·　Shell　·　MIT

- **是什麼**：把一整套軟體工程方法論（紅綠 TDD、YAGNI、DRY、先把需求談清楚再動手、agent 互相審查彼此的工作成果）打包成一組會自動觸發的技能，讓 coding agent 不只是「有技能」，而是「照一套紀律做事」。
- **為什麼值得看**：已經支援 Claude Code、Antigravity、Codex、Cursor、Gemini CLI 等十幾種 agent harness，代表它賭的不是某一家工具，是「軟體工程紀律」這件事本身可以跟 agent 解耦、單獨發行；總星數破 32 萬，今天還在穩定漲 788 顆，顯示這套方法論不是曇花一現的噱頭。
- **Tech Stack**：Agent Skills 開放格式 + 各 harness 自己的 plugin／marketplace 機制
- **上手難度**：低——依 harness 各自一行安裝指令，跨 harness 要分別裝一次

---

### t8y2/dbx ★31,188 (+34/日)

[GitHub](https://github.com/t8y2/dbx)　·　Rust　·　Apache-2.0

- **是什麼**：一個 25MB 的跨平台資料庫管理工具，支援 100 多種資料庫（MySQL、PostgreSQL、MongoDB、ClickHouse……），內建 AI SQL 助理，另外還獨立發行一個 Rust 寫的 MCP server，讓 Claude Code、Cursor 等 agent 可以直接用 DBX 裡設定好的連線查資料庫。
- **為什麼值得看**：跟前兩個「技能包」不同，dbx 不是等別人的 agent 來裝它的技能，是自己把 AI 能力做成工具的一部分——MCP server 還分唯讀、可寫、高風險寫入三級權限，顯示資料庫這麼敏感的場景，廠商已經在認真處理「agent 可以碰到什麼程度」這個權限問題，不是隨便開一個全權限介面。
- **Tech Stack**：Rust + Tauri 2 桌面殼 + 獨立 MCP server 套件（`@dbx-app/mcp-server`）
- **上手難度**：中——桌面版開箱即用，但要接 agent 得另外裝 MCP server 並設定連線允許清單

---

### google-research/paper-orchestra ★6,024 (+234/日)

[GitHub](https://github.com/google-research/paper-orchestra)　·　Python　·　Apache-2.0

- **是什麼**：Google Research 做的多 agent 框架，專門把「寫一篇能投稿的學術論文」拆給分工的 agent 做——文獻回顧、大綱、各小節寫作、修訂、畫圖，最後吐出 LaTeX manuscript。
- **為什麼值得看**：五天前（11/18）我們第一次報這個 repo 時總星數才 1,889，今天已經來到 6,024，漲了 3.2 倍，而且沒有任何重大新聞或新功能發布撐場——純粹是「垂直到一個具體任務」這件事本身在吸引人。對照這幾天看到的通用技能包（CLI-Anything、last30days-skill）漲幅反而在收斂，這是同一個模式的第二個獨立案例：通用框架的新鮮感消退得比垂直工具快。
- **Tech Stack**：Python + LaTeX 自動化 + Semantic Scholar API，模型可選 Gemini／OpenAI
- **上手難度**：中——需要自備 LaTeX 模板和一組 raw materials，不是開箱即跑

## Notable Releases

今日無重要框架更新。檢查的 13 個框架（LangGraph、CrewAI、MCP 規格、Mastra、Pydantic AI、Agno、Claude Code、Composio、smolagents、LlamaIndex、DSPy、Haystack、browser-use）過去 48 小時內都沒有新的 release——最近的是 browser-use 1.0.8（11/22，patch，已在前一篇文章報過）和 LangGraph 1.2.24（11/20）。Mastra 今天在 Y Combinator 的 Launch YC 頁面上架，介紹它的 TypeScript agent 框架，但這是上架曝光而非版本更新，套件本身仍是 11/18 發的 1.40.1，所以不計入這裡。

## 今日收穫

一開始以為「把專業包成 skill」和「工具自己內建 agent」是兩條服務不同情境的平行路線。但把 dbx 的權限分級設計拿來跟 Claude-BugHunter、superpowers 的「依主題自動觸發」放在一起看，發現兩邊其實在回答同一個問題——怎麼讓 agent 只在該出手的時候出手，又不用每次手動喊技能名字。一邊靠觸發器判斷情境，一邊靠工具內部的權限分級限制動作範圍，路線不同但目標一致。

## 參考資料

- [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter)
- [obra/superpowers](https://github.com/obra/superpowers)
- [t8y2/dbx](https://github.com/t8y2/dbx)
- [google-research/paper-orchestra](https://github.com/google-research/paper-orchestra)
- [paper-orchestra 11/18 報導（★1,889 當時的星數）](/posts/daily/2026-11-18-ai-agent-github-digest)
- [GitHub Trending（2026-11-23 擷取）](https://github.com/trending?since=daily)
- [LangGraph 1.2.24 Release Notes](https://github.com/langchain-ai/langgraph/releases/tag/1.2.24)
- [browser-use 1.0.8 Release Notes](https://github.com/browser-use/browser-use/releases/tag/1.0.8)
- [Launch YC: Mastra](https://ycombinator.com/launches/Muk-mastra-the-open-source-javascript-framework-for-building-agents)
- [Mastra npm package（最新版 1.40.1）](https://www.npmjs.com/package/mastra)

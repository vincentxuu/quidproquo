---
title: "AI Agent GitHub Digest — 2026-10-03"
date: 2026-10-03
category: daily
tags: [ai-agent, github, open-source, daily, mcp, agent-tooling, context-engineering]
lang: zh-TW
description: "今天的 GitHub Trending 被一群『幫 agent 少吃資源』的工具佔滿——省 token、把工具輸出關進沙盒、預建程式碼知識圖"
tldr: "caveman（10.9 萬★，GitHub Trending 日榜第 2）用『洞人語』砍 agent 輸出 token；context-mode（2.5 萬★，第 10）把工具原始輸出關進沙盒只留精簡結果；codegraph（7.3 萬★，第 13）預建程式碼知識圖讓 agent 不用每次重新探索檔案；openrig（4,170★，第 15）用 YAML 把多個 coding agent 組成持久化團隊；draw.io 官方 MCP server 讓 AI 能直接在畫布生成流程圖。Pydantic AI v2.53.0 修了併發限流的高風險資安漏洞；Agno v3.1.1 給 Knowledge page sync 加上即時進度與可取消。"
series:
  name: "AI Agent GitHub Digest"
  order: 49
---

> 🌏 [English version](/en/posts/daily/2026-10-03-ai-agent-github-digest-en)

## 今日亮點

今天 GitHub Trending 日榜前段被一群「幫 agent 少吃資源」的工具佔滿——caveman 用近乎玩笑的「洞人語」輸出省 token，context-mode 把工具呼叫的原始資料關進沙盒只留精簡結果，codegraph 乾脆把程式碼結構預先建成知識圖，讓 agent 不用每次都重新探索檔案關聯。跟過去一年「給 agent 更多能力」的敘事相反，今天這批項目比的是怎麼讓 agent 少燒 token、少犯錯；openrig 則示範了另一個方向——把多個 coding agent 綁成一個持久化團隊來跑。

## Trending Repos

### caveman ⭐ 108,980（GitHub Trending 日榜第 2）

[GitHub](https://github.com/JuliusBrussee/caveman)　·　Go　·　Apache-2.0

- **是什麼**：一個用「山頂洞人語」改寫 coding agent 輸出的技巧 + proxy 工具，號稱能把 token 用量砍 65%。
- **為什麼值得看**：本質是利用簡短、低資訊密度句式對 tokenizer 更省的特性，用一個小 proxy 攔截 agent 輸出再重寫成極簡句型。即便包裝成玩笑式項目（topics 裡還真的標了 `meme`），今天站上 GitHub Trending 日榜第 2、累積近 11 萬顆星，說明「agent 跑越久 token 帳單越貴」這個痛點是真的，大家也真的會為一個搞笑包裝的解法捧場。
- **tech stack**：Go CLI + LLM 輸出重寫 proxy
- **上手難度**：低——照文件跑一個 CLI proxy 即可，但要接受「洞人語」風格輸出對人類可讀性的犧牲。

---

### context-mode ⭐ 24,974（GitHub Trending 日榜第 10）

[GitHub](https://github.com/mksglu/context-mode)　·　TypeScript　·　License: Other（非標準授權，使用前建議先確認條款內容）

- **是什麼**：一個 MCP server，把工具呼叫回傳的原始資料關進「沙盒」，只把分析後的精簡結果放進對話的 context window。
- **為什麼值得看**：作者給的數字是把一次 Playwright snapshot 從 56 KB 壓到幾 KB——邏輯是「讓 LLM 寫程式去處理資料，而不是把資料整包讀進 context」，跟 caveman 從另一個角度打同一個問題（token／context 爆掉）。支援 17 種 agent 平台透過 MCP + hooks 接入，是目前這類 context 優化工具裡接入面最廣的之一。
- **tech stack**：TypeScript + MCP server + SQLite（session 持久化）+ FTS5 全文索引
- **上手難度**：中——概念不難，但要理解它怎麼介入每個工具呼叫的資料流，才能判斷哪些場景適合丟進沙盒。

---

### codegraph ⭐ 72,902（GitHub Trending 日榜第 13）

[GitHub](https://github.com/colbymchenry/codegraph)　·　Rust 核心（GitHub 語言統計顯示 C，應是打包進去的執行環境）　·　MIT

- **是什麼**：幫 coding agent 預先索引好程式碼知識圖譜的工具，程式碼變動時自動同步，讓 agent 不用每次都重新探索檔案關聯。
- **為什麼值得看**：多數 agent 現在靠反覆 Grep／Read 去拼出程式碼結構，這類探索本身就燒掉不少 token 跟 tool call。codegraph 把這件事挪到背景、建成一份隨 commit 自動更新的索引，agent 查詢時直接拿「哪支函式呼叫了誰」而不用自己翻檔案，號稱全部跑在本機、不上傳程式碼。
- **tech stack**：Rust 核心 + 各 agent 專屬 MCP 整合
- **上手難度**：中——裝 CLI、跑安裝器接上 agent、再對每個專案跑一次初始化，三個步驟缺一不可才真正用得上。

---

### openrig ⭐ 4,170（GitHub Trending 日榜第 15）

[GitHub](https://github.com/mvschwarz/openrig)　·　TypeScript　·　Apache-2.0

- **是什麼**：用 YAML 定義「agent 團隊」的框架，把 Claude Code、Codex 等 coding agent 綁進同一個持久化的多 agent 系統，由一個 lead agent 協調其他 specialist。
- **為什麼值得看**：市面上多半的多 agent 框架假設你從零寫 agent 邏輯，openrig 反過來包裝你已經在用的 coding agent harness，讓它們以「團隊」形式共用 context 跟工作分配，而不是各自開一個終端機視窗各做各的。這跟作者自稱的「AI civilization experiments」野心相符：不是做新 agent，是做 agent 的組織結構。
- **tech stack**：TypeScript + tmux（跑多個 agent session）+ YAML 配置
- **上手難度**：中——需要 Node.js 22/24 跟 tmux，官方也明確提醒安裝時會寫入 provider hooks 跟 workspace trust 設定，動手前建議先讀過它會改動什麼。

---

### drawio-mcp ⭐ 5,561

[GitHub](https://github.com/jgraph/drawio-mcp)　·　JavaScript　·　Apache-2.0

- **是什麼**：draw.io 官方推出的 MCP server，讓 AI assistant 能直接在 draw.io 畫布裡生成、開啟流程圖。
- **為什麼值得看**：多數「畫圖 agent」工具只能生成靜態圖片或純文字描述，drawio-mcp 提供四種整合方式，其中 MCP App Server 能把互動式的 draw.io 畫布直接嵌進對話介面（不用另開分頁），對需要邊聊邊畫架構圖、流程圖的場景是個官方直接可用的選項，不用等社群兜一個不穩定的替代品。
- **tech stack**：JavaScript + MCP App 協定（iframe 嵌入）+ MCP Tool Server（npm 套件）
- **上手難度**：低——官方託管版（mcp.draw.io）不用安裝，加一個 remote MCP server 設定就能用。

## Notable Releases

### Pydantic AI v2.53.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.53.0)

- **重要變更**：修了一個 High severity 資安漏洞（[GHSA-6fqq-452j-qhrp](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-6fqq-452j-qhrp)）——用 `ConcurrencyLimitedModel` 或 `limit_model_concurrency` 做併發限流時，一個 streaming request 如果提早退出（消費者停止迭代、丟例外、或被取消）、或用 `stream_text()` 的預設 debounce 消費完，可能不釋放它佔用的併發額度，重複發生會讓共用同一個 limiter 的所有請求被卡住。
- **Breaking Changes**：修復同時改了 limiter 的共用規則——一個 model wrapper 如果跟發起請求的 agent 或外層 model wrapper 共用同一個 limiter，現在會丟 `UserError`；`ConcurrencyLimiter.acquire()` 改成每次呼叫都真的佔一個 slot（即使在同一個 task 上）；自訂的 `AbstractConcurrencyLimiter` 也要跟著允許從別的 task release。
- **對你的影響**：用 `ConcurrencyLimitedModel` 或 `limit_model_concurrency` 做過併發限流的人該盡快升級到 2.53.0——agent 層的 `max_concurrency` 跟非 streaming 請求不受影響，但凡是「共用 limiter + streaming」的組合都該檢查。

---

### Agno v3.1.1

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.1)

- **重要變更**：Knowledge 的 page sync 新增即時進度跟可取消——`stream_sync_pages()` / `astream_sync_pages()` 會持續吐出 `PageSyncProgress`，結束時給一份 `SyncReport`；workflow 的 function step 現在能在輸出最終結果前先 yield `StepProgress`，AgentOS 直接把這個進度事件丟到既有的 REST/SSE 路由上；取消同步現在真的會中斷工作，不會像之前一樣硬跑到底才停。另外修了大型文件庫（例如 3,913 頁的 docs.agno.com）同步時偶發的連線重置問題，以及 Mintlify 風格網站分頁探索不完整的 bug。
- **Breaking Changes**：無明顯 breaking change，屬於功能擴充與穩定性修復。
- **對你的影響**：如果你用 Agno 的 Knowledge 對大型文件站做 page sync，升級後能即時看到同步進度並中途取消，加上重試退避修正，之前偶發的連線重置問題應該會少很多。

## 今日收穫

原本以為 agent 生態裡「省 token」的焦點都在模型端——更小的模型、更省的 prompt caching，但今天 trending 榜上這批工具提醒我，省 token 的另一條路是在 agent harness 這一層動手：不管是 caveman 式的輸出風格改寫，還是 context-mode 的沙盒化工具輸出，核心邏輯都是「別讓資料真的進 context，而不是進去後再想辦法壓縮」。

## 參考資料

- [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)
- [mksglu/context-mode](https://github.com/mksglu/context-mode)
- [colbymchenry/codegraph](https://github.com/colbymchenry/codegraph)
- [mvschwarz/openrig](https://github.com/mvschwarz/openrig)
- [jgraph/drawio-mcp](https://github.com/jgraph/drawio-mcp)
- [GitHub Trending（daily）](https://github.com/trending?since=daily)
- [Pydantic AI v2.53.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.53.0)
- [Pydantic AI 併發限流資安公告 GHSA-6fqq-452j-qhrp](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-6fqq-452j-qhrp)
- [Agno v3.1.1 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.1)

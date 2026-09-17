---
title: "AI Agent GitHub Digest — 2026-09-18"
date: 2026-09-18
category: daily
tags: [ai-agent, github, open-source, daily, agent-framework, mcp, developer-tools]
lang: zh-TW
description: "Nous Research 開源一個會自己長技能的 agent，同時一票新 repo 在補「agent 失控」的坑——context 塞爆、資安漏洞、品質失守——pydantic-ai 這次一口氣修了四個洞"
tldr: "NousResearch/hermes-agent 主打閉環學習——自己從經驗生技能、自己改進技能、跨對話記得你是誰；mksglu/context-mode 用 MCP + hooks 把工具輸出砍 98%，衝上 Hacker News 第一名；shinthink/blitzstrike 把偵察、靜態分析、live 驗證包成一支 MCP 滲透測試工具；pliablepixels/gap-trap 幫 vibe coding 裝 CI 閘門；Pydantic AI v2.44.0 一次修四個安全漏洞，CrewAI 1.15.22 加了跨模型路由的 `llm_overlay`"
series:
  name: "AI Agent GitHub Digest"
  order: 34
---

## 今日亮點

今天的 trending 分成兩端：一端是 Nous Research 開源的 hermes-agent，一個主打「自己會長技能、自己會改進技能」的通用 agent；另一端是一整群專門補「agent 失控」的開發工具（developer tools）——context 被工具輸出塞爆、品質在 vibe coding 裡悄悄流失、MCP 又是新的資安攻擊面。而 Notable Releases 這邊也呼應了資安這條線：Pydantic AI 這次一口氣修了四個安全漏洞，全部經 `web_fetch_tool` 或 telemetry 埋點觸發。

## Trending Repos

### NousResearch/hermes-agent ⭐ 246,468

[GitHub](https://github.com/NousResearch/hermes-agent)　·　Python　·　MIT

- **是什麼**：Nous Research 開源的「自我進化」agent——CLI／TUI 都有，主打一個閉環學習機制：從實際任務裡自動生成技能、技能在使用中自己變強、用 FTS5 搜自己過去的對話、對使用者建立跨 session 的持續模型。
- **為什麼值得看**：多數 agent 框架把「記憶」做成外掛的向量資料庫，hermes-agent 把「學習」直接寫進主迴圈——完成複雜任務後自動生成技能，相容 agentskills.io 開放標準，等於把「越用越懂你」當成核心賣點而不是附加功能。執行環境也做成可插拔資產：本機、Docker、SSH、Modal、Daytona、Vercel Sandbox 七種後端，Modal／Daytona 這兩個 serverless 選項閒置時幾乎不收費，代表 agent 可以住在雲端隨時待命，而不是綁死在你的筆電上。
- **tech stack**：Python + 多終端後端（local／Docker／SSH／Singularity／Modal／Daytona／Vercel Sandbox）+ Telegram／Discord／Slack／WhatsApp／Signal 多平台閘道
- **上手難度**：低——`curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash` 一行裝完，換模型只要 `hermes model` 不用改程式碼。

---

### mksglu/context-mode ⭐ 23,362

[GitHub](https://github.com/mksglu/context-mode)　·　TypeScript　·　ELv2

- **是什麼**：給 coding agent 用的 context window 優化層，透過 MCP 協定層 + hooks 把工具輸出關進沙盒、跨 session 保留記憶、在 17 種平台上強制路由，官方數字是工具輸出砍掉 98%。
- **為什麼值得看**：它抓住一個很具體的痛點——一次 Playwright snapshot 就吃掉 56KB context，20 個 GitHub issue 吃 59KB，30 分鐘後 40% 的 context window 就沒了，而且 agent 一旦 compact 對話就會忘記自己在改哪些檔案。context-mode 的做法是在 MCP 協定層攔截，原始資料留在沙盒子行程裡不進 context window，這條路線上過 Hacker News 第一名，說明「context 管理」正在變成獨立於「模型能力」之外的一門顯學。
- **tech stack**：TypeScript + MCP 協定層攔截 + preToolUse／postToolUse hooks（依平台，強制程度不同）
- **上手難度**：低到中——npm 安裝當 MCP server 就能跑，但不同 harness（Claude Code／Codex／Zed／Kiro）的 hook 強制程度不一，Zed 等平台只能靠 AGENTS.md 弱約束，覆蓋率約六成。

---

### shinthink/blitzstrike ⭐ 634

[GitHub](https://github.com/shinthink/blitzstrike)　·　TypeScript　·　MIT

- **是什麼**：一支通用 MCP 滲透測試工具，把「偵察→分析→驗證」的標準滲透測試方法論拆成三層 server 端工具：BLITZ 掃攻擊面、EAGLE-EYE 追 source-to-sink 的資料流、STRIKE 在回報前先做 live 驗證。
- **為什麼值得看**：它處理的是自動化資安掃描最常見的兩個失敗模式——表面比對造成的誤判，以及「掃到就回報」而沒有實際驗證。核心設計原則是「掃到的東西只是假設，live 測試過才是結論」，一個 `run_engagement` call 就能從 Claude Code、Cursor、Gemini 等任何 MCP client 觸發整套流程，適合已取得授權的滲透測試或紅隊演練場景。
- **tech stack**：TypeScript／Bun + MCP TypeScript SDK，`bun build --compile` 編成單一執行檔
- **上手難度**：低——`npx blitzstrike install` 會自動偵測並註冊到你裝的每一個 agent CLI。

---

### pliablepixels/gap-trap ⭐ 164

[GitHub](https://github.com/pliablepixels/gap-trap)　·　Shell　·　MIT

- **是什麼**：一個 Claude／Codex skill，讀懂你的 repo 之後自動寫出符合這個 codebase 的規則，並幫每條規則裝上 CI 閘門，讓 agent 沒辦法繞過。
- **為什麼值得看**：它點名的失敗模式很具體——agent 寫出已經存在的 helper、抄捷徑跨越層邊界、寫出「斷言程式碼有跑」而非「斷言邏輯對」的測試、規則在 instructions 檔裡放一週後被忘記。gap-trap 的解法不是再寫一份文字規則，而是裝四種機制：contracts（每個模組的唯一正確做法）、proven-red（新測試必須先在舊程式碼上跑到失敗，證明測試真的有效）、ratchets（已知問題數量只能降不能升）、playbooks（踩過的坑寫下來，不用每個 session 重新學）。
- **tech stack**：語言無關——Node／Python repo 用原生測試套件掛閘門，其餘語言（Go／Rust／Java／Ruby／.NET／PHP／Swift／C++）用只依賴 git／grep／awk 的 shell 版本
- **上手難度**：中——`npx skills add pliablepixels/gap-trap` 裝完會自動產生規則，但作者明確提醒要逐條審過再信任，這一步不能跳。

## Notable Releases

### Pydantic AI v2.44.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.44.0)

- **重要變更**：一次修四個安全漏洞，全部經 `web_fetch_tool` 或 OpenTelemetry 埋點觸發——(1) IPv6 zone identifier 可繞過 cloud-metadata／私網 IP 封鎖清單（中危）；(2) `web_fetch` 在 HTML 轉換與 charset 解碼階段跑超線性時間，單一惡意頁面能讓整個 process 裡所有 agent 卡住（中危，DoS）；(3) 網域封鎖清單用「原始拼寫」而非「解析器實際比對」的形式比對，換個拼法就能繞過封鎖（低危）；(4) 設定 `include_content=False` 想關掉內容紀錄時，span 仍然夾帶例外訊息、錯誤狀態、instructions 與輸出樣板（低危，資料外洩）。
- **Breaking Changes**：無 API 破壞性變更；修補版本分兩條線，v2 系列補在 2.44.0，v1 系列補在 1.107.6。
- **對你的影響**：只要你的 agent 有用到 `web_fetch_tool` 或開了 OpenTelemetry instrumentation，都建議直接升級——DoS 那個漏洞預設路徑就會踩到，`include_content=False` 那個更是「你以為關掉了但其實沒關乾淨」，兩個都值得優先處理。

---

### CrewAI 1.15.22

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.22)

- **重要變更**：新增 `llm_overlay` context variable，可以動態把不同 agent role 路由到不同模型；CrewAI Platform 整合更深——deployment 失敗原因會被記錄下來、平台工具接進 JSON crew wizard、新增應用目錄；OpenRouter 加入為可用的 embedding provider。
- **Breaking Changes**：無。
- **對你的影響**：`llm_overlay` 對想把次要 agent 路由到便宜模型、只讓主 agent 用貴模型的人很直接省成本；用 CrewAI Platform 部署的話，這次補的「失敗原因記錄」能直接省掉排查時間。

## 今日收穫

原本以為「給 agent 記憶」這條賽道比的是誰的向量檢索更聰明，但 hermes-agent 提醒了一件事：執行環境本身也可以是一種可插拔資產——七種終端後端、serverless 閒置零成本，代表 agent 不再綁在你的筆電上，而是像一個可以隨時搬家的服務常駐雲端。同一天 Pydantic AI 修的四個洞也點出另一個常被忽略的攻擊面：agent 本身的模型很少是弱點，它拿去讀網頁的那個 `web_fetch` 工具才是。

## 參考資料

- [NousResearch/hermes-agent — GitHub](https://github.com/NousResearch/hermes-agent)
- [hermes-agent README（自我進化學習迴圈、七種終端後端）](https://raw.githubusercontent.com/NousResearch/hermes-agent/main/README.md)
- [mksglu/context-mode — GitHub](https://github.com/mksglu/context-mode)
- [context-mode README（MCP 協定層攔截、98% 輸出縮減）](https://raw.githubusercontent.com/mksglu/context-mode/main/README.md)
- [shinthink/blitzstrike — GitHub](https://github.com/shinthink/blitzstrike)
- [pliablepixels/gap-trap — GitHub](https://github.com/pliablepixels/gap-trap)
- [Pydantic AI v2.44.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.44.0)
- [CrewAI 1.15.22 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.22)
- [GitHub Trending（Daily，2026-09-18 擷取）](https://github.com/trending?since=daily)

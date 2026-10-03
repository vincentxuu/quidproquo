---
title: "AI Agent GitHub Digest — 2026-10-04"
date: 2026-10-04
category: daily
tags: [ai-agent, github, open-source, daily, coding-agent, browser-agent, mcp]
lang: zh-TW
description: "今天竄紅的新 repo 有志一同在做同一件事——盯著你的 agent：coucou 盯著終端機裡的 coding agent，dots 讓 agent 自己盯著瀏覽器不被擋，AIHOT 則讓你把『盯著 AI 圈動態』這件事整套開源出來自己架站"
tldr: "AIHOT（5,360★）把『自己找熱點、自己寫日報』的網站骨架直接開源，跟我們自己在跑的 quidproquo/daily 根本同一種物種；coucou（3,180★）是一隻活在 macOS Notch／螢幕頂端的小精靈，同時盯著 Claude Code、Codex、Cursor、Gemini CLI 等多個 coding agent 有沒有卡住；dots（2,572★）是一個自帶瀏覽器、號稱不會被反爬機制擋下的開源 web agent。Pydantic AI v2.54.0 一口氣帶來多項相容性變更，含 JsonSchemaTransformer 處理 draft-7 schema、FallbackModel 下的 ImageGeneration 修復；Claude Code v2.1.288 補了一個資安性質的修復——bypassPermissions 模式下跑 `bash -c` 內的危險 `rm` 指令，現在也會跳出確認。"
series:
  name: "AI Agent GitHub Digest"
  order: 50
---

> 🌏 [English version](/en/posts/daily/2026-10-04-ai-agent-github-digest-en)

## 今日亮點

今天竄紅的幾個新 repo 有志一同在做同一件事——盯著你的 agent：coucou 盯著終端機裡的 coding agent 有沒有卡住，dots 讓 agent 自己盯著瀏覽器、想辦法不被反爬機制擋下，AIHOT 則乾脆把「盯著整個 AI 圈動態、自己寫日報」這件事包成一套可以直接架站的開源框架——跟我們自己在跑的這個 daily 系列,其實是同一種物種。

## Trending Repos

### AIHOT ⭐ 5,360

[GitHub](https://github.com/KKKKhazix/AIHOT)　·　TypeScript　·　MIT

- **是什麼**：一個開源的「自己找熱點、自己寫日報」網站框架——把信源清單和精選標準換成自己的，就是一個客製化的產業動態站。
- **為什麼值得看**：市面上大多數新聞聚合工具只做「抓取 + 列表」，AIHOT 把「篩選標準」也當成可替換的設定，等於把一整套內容策展 pipeline（RSS 信源、LLM 精選、自動發文）打包成模板。對任何想做自己領域日報（不管是 AI、金融還是特定技術社群）的人來說，省掉的是從零搭 pipeline 的工程時間，不是省掉「决定要追蹤什麼」的判斷。
- **Tech stack**：TypeScript + RSS 信源整合 + LLM 篩選 + MCP
- **上手難度**：中——框架本身現成，但要跑出一個有觀點的日報站，信源清單和精選標準還是得自己想清楚。

---

### coucou ⭐ 3,180

[GitHub](https://github.com/Louis-CFM/coucou)　·　Swift　·　MIT

- **是什麼**：一隻住在 macOS Notch（或 Windows／Linux 螢幕頂端）的小圖示，即時顯示 Claude Code、Codex、Cursor、Gemini CLI、Antigravity 等多個 coding agent 目前的狀態。
- **為什麼值得看**：現在常見的工作模式是同時開好幾個終端機跑不同的 coding agent，但沒人想一直切視窗確認「哪一個卡住在等你確認權限」。coucou 把這件事收斂成一個常駐的狀態燈，解決的不是 agent 能力問題，而是「多 agent 並行時人要怎麼不漏接」的操作體驗問題——這類工具過去一週內才剛出現，說明多開 agent 已經是夠多人的日常才值得做一個專門產品。
- **Tech stack**：Swift + SwiftUI（macOS Notch API；Windows/Linux 另有對應實作）
- **上手難度**：低——裝一個 menubar app，接上你本來就在用的 coding agent 即可，不需要改動 agent 本身的設定。

---

### dots ⭐ 2,572

[GitHub](https://github.com/feder-cr/dots)　·　Python　·　MIT

- **是什麼**：一個開源的瀏覽器 AI agent，賣點是自帶一顆「不容易被反爬蟲機制偵測」的瀏覽器。
- **為什麼值得看**：browser-use 這類瀏覽器 agent 框架已經很成熟，但實務上最大的痛點往往不是「agent 會不會操作網頁」，而是「網站直接把你判定成機器人擋在外面」。dots 把重點放在反偵測瀏覽器本身，而不是 agent 的決策邏輯，是對同一個問題（瀏覽器自動化）換了一個切入角度——跟官方工具或企業級方案相比，這是給個人開發者的開源替代品。
- **Tech stack**：Python + Playwright + 反偵測瀏覽器設定 + MCP
- **上手難度**：中——瀏覽器 agent 常見的坑（CAPTCHA、登入態維護）dots 處理了一部分，但仍需要自己摸清楚它能繞過哪些偵測、不能繞過哪些。

## Notable Releases

### Pydantic AI v2.54.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.54.0)

- **重要變更**：`JsonSchemaTransformer`、`TestModel` 和 Mistral 的 streamed output 現在能處理 draft-7 的 list-form `items`，`TestModel` 也接受 boolean subschema 並把 `prefixItems` 限制在 `maxItems` 內；修了 `FallbackModel` 底下 `ImageGeneration` 失效的問題；一個 agent 現在會拒絕在已經綁定一個 durable execution engine 後又綁第二個；`wrap_*` hook 改成包住完整的 stage 生命週期；Temporal model activity 的錯誤會以原始型別重新拋出，不再被吞成通用錯誤。
- **Breaking Changes**：上述相容性變更多半屬於「原本會悄悄放行或吞掉錯誤的行為，現在改成明確拒絕或拋出」，官方把它們列在 Compatibility Notes 而非功能新增，使用 `FallbackModel`、Temporal 整合或自訂 `wrap_*` hook 的人建議先看過完整變更清單再升級。
- **對你的影響**：如果你的 pipeline 有用到 draft-7 schema、Temporal 執行引擎或多層 model wrapper，升級前值得先掃一遍 Compatibility Notes，這次的「修復」有一部分會改變既有程式碼的行為。

---

### Claude Code v2.1.288

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.288)

- **重要變更**：修了一個資安性質的漏洞——`bash -c` 或 `sh -c` 腳本裡的危險 `rm`（例如對 `/` 或家目錄下手）之前在 bypassPermissions 模式或有 shell allow rule 時會直接跑掉不問，現在一律會跳出確認；新增 `--max-findings <n>|all` 讓 `/code-review` 可以調整回報的 finding 數量；雲端 session 現在內建 `gh api`，不需要再自己裝 GitHub CLI；修了多個 `--resume` 情境下遺失檔案或上下文的 bug。
- **Breaking Changes**：無明顯破壞性變更，多為安全修復與既有流程的穩定性強化。
- **對你的影響**：如果你在 bypassPermissions 模式或設了 shell allow rule 下讓 Claude Code 跑過批次腳本，這次的 `rm` 防護修復值得注意——代表先前版本在特定條件下，危險刪除指令可能沒有跳出確認就執行。

## 今日收穫

原本以為要做一個像我們自己在跑的 AI 日報站，需要客製一整套「信源管理＋篩選規則＋排版發文」的 pipeline，但 AIHOT 今天證明這套骨架已經可以直接開源複用——差異只在你餵的信源清單和精選標準夠不夠有觀點，工程本身早就不是門檻了。

## 參考資料

- [KKKKhazix/AIHOT](https://github.com/KKKKhazix/AIHOT)
- [Louis-CFM/coucou](https://github.com/Louis-CFM/coucou)
- [feder-cr/dots](https://github.com/feder-cr/dots)
- [GitHub Trending（daily）](https://github.com/trending?since=daily)
- [Pydantic AI v2.54.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.54.0)
- [Claude Code v2.1.288 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.288)

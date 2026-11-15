---
title: "AI Agent GitHub Digest — 2026-11-16"
date: 2026-11-16
category: daily
tags: [ai-agent, github, open-source, daily, mcp, multi-agent]
lang: zh-TW
description: "三個竄升的新工具都不是在讓 agent 更聰明,而是在幫它裝審查層、裝置控制層、跨 agent 記憶層"
tldr: "Plannotator(多 agent 審查工作區)24 小時漲 860 星、callstack/agent-device(裝置控制 MCP server)、kody(跨 agent 記憶雲,授權非標準開源)同週竄升；Agno v3.2.0 和 pydantic-ai v2.68.0 也各帶一組相容性變更"
series:
  name: "AI Agent GitHub Digest"
  order: 93
---

> 🌏 [English version](/posts/daily/2026-11-16-ai-agent-github-digest-en)

## 今日亮點

今天竄升的三個 repo 沒有一個在講「agent 更會想」：Plannotator 補的是人工審查的介面，agent-device 補的是真機／模擬器的操控層，kody 補的是跨 agent 都能用的記憶和憑證。agent 本身的推理能力好像已經夠用，現在缺的是把它接到「人看得到、碰得到真機、記得住」這三件事上的基礎設施。

## Trending Repos

### backnotprop/plannotator ⭐ 11,728 (+860/24h)

[GitHub](https://github.com/backnotprop/plannotator)　·　TypeScript　·　Apache-2.0

- **是什麼**：本機跑的瀏覽器審查介面，站在人和多個 coding agent（Claude Code、Codex、Copilot CLI、Gemini CLI、OpenCode、Kiro、Droid、Amp 等）中間，agent 提出計畫、HTML 原型或改完程式碼時，畫面自動跳出來讓你標註、留言，一鍵把回饋送回給 agent。
- **為什麼值得看**：先前「review agent 的輸出」大多是看 terminal 裡滾動的文字，或切到 IDE 裡一行行看 diff，Plannotator 把這一步獨立成一個專門介面，還支援 Git、GitButler、Jujutsu、Perforce 等版本控制系統的 diff 審查。11 月 15 日單日漲 860 顆星,代表這個「審查層」的需求是真的有人在等。
- **tech stack**：TypeScript 前端 + 本機 CLI／hook，透過 plugin 接進各家 agent CLI。
- **上手難度**：中——要替每個 coding agent 裝對應的 plugin／hook 才能把回饋送出去，不是裝完就會動。

---

### callstack/agent-device ⭐ 5,403

[GitHub](https://github.com/callstack/agent-device)　·　TypeScript　·　MIT

- **是什麼**：給 coding agent 用的裝置操控層——CLI、內建 MCP server、Node.js API 三種介面都能讓 agent 操作 iOS／Android／HarmonyOS 模擬器與實機、tvOS／Android TV、web、macOS、Linux 上的 app。
- **為什麼值得看**：agent 改完程式碼常常只能靠截圖或自己讀 log 猜有沒有改對，agent-device 讓 agent 讀 token 省的 accessibility snapshot、用 ref／selector 直接操作畫面，而不是整張截圖餵給模型推理。Expensify、Shopify 都在用它驗證自己 app 的改動，不是 demo 階段的玩具。
- **tech stack**：Node.js（需 22.12+，web 自動化需 24+）+ MCP server + 多平台裝置驅動。
- **上手難度**：低——`npm install -g agent-device@latest` 後跑 `agent-device doctor` 檢查環境就能用。

---

### kody-hq/kody ⭐ 961

[GitHub](https://github.com/kody-hq/kody)　·　TypeScript　·　授權：Other（GitHub 判定為 NOASSERTION，非標準開源授權）

- **是什麼**：建在 Cloudflare Workers + MCP 上的「agent 雲」，存放 agent 的記憶、憑證、程式碼和自動化流程，主打可以帶著這些狀態在不同 MCP host（文件裡寫 ChatGPT 是主要目標）之間搬動。
- **為什麼值得看**：多數 agent 記憶方案綁死單一框架或單一 host，kody 刻意走「精簡 MCP 介面 + search／execute」而不是堆一堆靜態工具,目標是記憶和憑證能跟著人換 agent、換 host 時一起搬過去。但要注意它的授權欄位是 GitHub 判定的「Other／NOASSERTION」，不是 MIT 或 Apache 2.0 那種標準開源授權，商業場景拿來用之前要自己去讀 repo 裡實際的授權條款。
- **tech stack**：Cloudflare Workers + D1 + KV + Durable Objects，Nx monorepo。
- **上手難度**：中——`npm install && npm run dev` 能本機跑，但要先決定好資料放在誰的 Cloudflare 帳號下。

## Notable Releases

### Agno v3.2.0

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.2.0)

- **重要變更**：Super Agent 不再透過 manager members 轉發，改成自己直接做事、只留 Platform Builder 當成員；A2A 升級到官方 a2a-sdk 1.x 正式版；Slack 介面整個換成 Slack Bolt SDK。
- **Breaking Changes**：`OSManager.tool_call_limit` 預設從 8 改成 24、`num_history_runs` 預設從 7 改成 5；A2A 的 `/v1/message:*`、`/v1/tasks:*` 路由直接移除，改用各元件自己的 A2A endpoint；Slack 只有啟動該次 run 的人能 Approve／Deny，除非被列進 `approvers=`。
- **對你的影響**：如果你同時維護 Agno server 和 client，A2A 和 Slack 這兩塊要一起升級，不能只升一邊；舊的 A2A v0.3 client 走相容層還能動，但直接 import 被移除的 helper 會噴錯。

---

### pydantic-ai v2.68.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.68.0)

- **重要變更**：新增 `OutputTokenLimitExceeded`，回應被 `max_tokens` 截斷時 `ModelFallback` 會自動換下一個 model 重試；新增 `RequestInput`，可以在一次 run 執行中途跳出來要人核可或回答問題。
- **Breaking Changes**：user／tool content 裡長得像「應用程式框架」的文字，現在會被原樣標註說明而不是直接 escape——官方把這條標成相容性注意事項，代表輸出格式有變。
- **對你的影響**：如果你的 pipeline 依賴 `ModelFallback` 在截斷時的行為，或是在解析 user／tool content 裡的特殊文字，升級後要重新檢查這兩塊的輸出是否還符合原本的假設。

## 今日收穫

之前以為「agent 生態還在比誰的推理能力強」，但今天這三個竄升的 repo 讓我覺得重心已經在往旁邊移——沒有一個在講模型本身，全部在補「人怎麼看懂 agent 做了什麼」「agent 怎麼碰到真的裝置」「agent 的記憶怎麼不要卡死在一家工具裡」。kody 的授權欄位也是個提醒：竄升快的 repo 不代表授權乾淨，商業場景拿來用之前還是得自己翻一次授權條款。

## 參考資料

- [backnotprop/plannotator](https://github.com/backnotprop/plannotator)
- [Plannotator Gains 860 Stars in 24 Hours, Surges on GitHub Trending](https://blockchain.news/news/plannotator-github-trending-surge)
- [callstack/agent-device](https://github.com/callstack/agent-device)
- [kody-hq/kody](https://github.com/kody-hq/kody)
- [Agno v3.2.0 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.2.0)
- [pydantic-ai v2.68.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.68.0)

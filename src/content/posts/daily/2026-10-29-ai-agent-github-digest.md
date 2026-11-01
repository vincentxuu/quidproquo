---
title: "AI Agent GitHub Digest — 2026-10-29"
date: 2026-10-29
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, multi-agent, security]
lang: zh-TW
description: "今天 GitHub trending 幾乎被教 coding agent『不要長得像 AI 做的』技能包佔滿，而 crewAI 悄悄補了三個資安漏洞"
tldr: "**obra/superpowers**（⭐ 307,258，今日 +1,096）、**Nutlope/hallmark**（⭐ 40,442，今日 +2,109）同天衝上 GitHub trending，兩個都在教 coding agent「不要做出一眼就看出是 AI 做的東西」；**nightly-labs/openbot**（⭐ 3,097）用桌面 app 管一堆 agent，**expo/skills** 讓官方也下場發自己的技能包。release 這邊 pydantic-ai v2.63.0 丟出一批相容性變更，crewAI v1.15.31 修了 deserialization／SQL injection／path traversal 三個資安漏洞。"
series:
  name: "AI Agent GitHub Digest"
  order: 75
---

> 🌏 [English version](/posts/daily/2026-10-29-ai-agent-github-digest-en)

## 今日亮點

今天 GitHub trending 前幾名幾乎被「教 agent 品味」的技能包佔滿——obra/superpowers、Nutlope/hallmark、pbakaus/impeccable 同一天衝榜，三個都在處理同一件事：coding agent 寫出來的東西，一眼就看得出是 AI 做的。同時 nightly-labs/openbot 想解決「人要怎麼同時管得動一堆 agent」，連 Expo 官方都下場發自己的技能包。框架那邊，pydantic-ai 跟 crewAI 都丟出版本更新，一個動到既有程式行為，一個補了資安洞。

## Trending Repos

### obra/superpowers ⭐ 307,258 (+1,096)

[GitHub](https://github.com/obra/superpowers)　·　Shell　·　MIT

- **是什麼**：給 coding agent 用的完整軟體開發方法論，用一套會自動觸發的「composable skills」串起從挖需求、拆規格、寫實作計畫到 subagent 分工執行、互相檢查的全流程，支援 Claude Code、Cursor、Codex、Gemini CLI 等十幾種 harness。
- **為什麼值得看**：多數 agent skill 解決的是單一任務（寫測試、查文件），superpowers 想接管的是整個開發流程本身——agent 看到你在做東西，不會馬上動手寫程式，而是先逼你把需求講清楚、簽過規格，再按 TDD／YAGNI／DRY 原則排實作計畫，最後才放手讓 subagent 連續跑好幾小時不偏離計畫。已經上了 Anthropic 官方 plugin marketplace，還提供企業版付費支援，說明「流程本身」已經是可以被打包銷售的產品。
- **tech stack**：Markdown skill 定義 + 各 coding agent 的 plugin／marketplace 機制（Claude Code、Antigravity、Codex、Cursor、Devin、Gemini CLI 等）
- **上手難度**：低——`/plugin install superpowers@claude-plugins-official` 一行裝完，skill 會自動觸發不用手動呼叫

---

### Nutlope/hallmark ⭐ 40,442 (+2,109)

[GitHub](https://github.com/Nutlope/hallmark)　·　CSS　·　MIT

- **是什麼**：給 Claude Code、Codex、Cursor、OpenCode 用的設計技能，專門對付「一看就是 AI 生成」的網頁——標題上方那行小字、每個標題都追蹤大寫字母、headline 裡剛好一個字變色、只有照片沒有內容的英雄區——用真實瀏覽器把頁面跑過 50 種材質主題，再過一輪 lint 抓這些 AI 特徵，最後讓一個「沒看過上下文」的審查 agent 挑毛病。
- **為什麼值得看**：跟同天衝榜的 pbakaus/impeccable（⭐ 92,240，今日 +1,471，走「設計詞彙＋審查用語」路線）比，hallmark 選的是更具體的做法——50 個材質主題各自綁真實截圖、755 張有授權照片、而且分三層關卡（Floor 絕對擋、Reflex 預設擋但可記錄理由覆寫、Finish 只是細節提醒不擋）。由 Together AI 做出來，一天漲 2,109 星，說明「讓 agent 的審美有個底線」正在變成剛性需求而不是錦上添花。
- **tech stack**：Claude/Codex/Cursor skill（SKILL.md + 參考檔）+ Node.js 腳本（`theme.mjs`、`sloplint.mjs`）做主題抽籤跟瀏覽器渲染檢查
- **上手難度**：低——裝進 agent 後打 `/hallmark` 開始建頁，`/hallmark audit <path>` 可以只做稽核不動手改

---

### nightly-labs/openbot ⭐ 3,097 (+1,053)

[GitHub](https://github.com/nightly-labs/openbot)　·　TypeScript　·　PolyForm Noncommercial 1.0.0

- **是什麼**：本地優先的桌面工作台，讓 Codex、Claude Code、Grok CLI、Gemini、Cursor CLI、Cline 等多個 agent 各自擁有獨立工作區跟對話，彼此之間可以傳訊息、丟檔案、共用一個內嵌瀏覽器，手機也能開著跟進度。
- **為什麼值得看**：跟上週介紹過的桌面多 agent 管理工具（Orca、Cindy）站在同一個賽道，但 openbot 把「agent 之間直接溝通」做得更明顯——FIFO 訊息佇列、agent-to-agent 的訊息／回覆／檔案轉移、共用頻道聊天室還能指派任務擁有者。目前還是 development preview，agent 預設跑在 `danger-full-access` 且不逐步確認動作，等於把安全邊界全部交給使用者自己把關，這點要特別注意。
- **tech stack**：Electron 桌面框架 + ACP（Agent Client Protocol）接各家 CLI agent + Cloudflare Workers／D1 做帳號系統
- **上手難度**：中——各平台都有打包好的安裝檔，但要先裝好至少一個 coding agent CLI（Codex／Claude Code／Grok／Cursor／Cline），且目前的全權限模式不適合拿來跑不信任的任務

---

### expo/skills ⭐ 3,482 (+212)

[GitHub](https://github.com/expo/skills)　·　Shell　·　MIT

- **是什麼**：Expo 官方親自發的一批 AI agent skill，涵蓋 Expo Router、Reanimated 動畫、原生 UI、設計系統、資料擷取、DOM 元件、SDK 升級等常見 Expo／React Native 任務，Claude Code／Codex 用官方 plugin marketplace 裝，其他 agent 用 `skills CLI`。
- **為什麼值得看**：目前大多數 agent skill 都是社群或第三方做的，expo/skills 是官方框架團隊自己下場維護技能包的早期例子——skill 描述由 Expo 團隊保證跟文件同步，agent 不用再靠過時的訓練記憶猜 Expo API。免費的 framework skill 跟要收費的 EAS 服務 skill 分組清楚標示，也算一種「開源框架維護者怎麼在 agent 時代收費」的示範。
- **tech stack**：SKILL.md + Expo／EAS CLI 包裝 + `skills.sh` 通用安裝協定
- **上手難度**：低——`npx skills@latest add expo/skills --skill '*'` 一行裝全部，或用官方 plugin marketplace 裝進 Claude Code／Codex

## Notable Releases

### pydantic-ai v2.63.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.63.0)

- **重要變更**：`CodeMode` 預設把 `dynamic_catalog` 打開，之後揭露新工具時是「附加」而不是整個重寫快取的 prompt；Harness 的 `LLMReminder` 預設間隔改成每 10 次請求才提醒一次，不再每次都生成；deferred 的 `CombinedCapability` 現在整組當一個 capability 載入，成員仍保留全域排序；Gemini Live 重連時的 replay 參數改成只能用關鍵字傳。
- **Breaking Changes**：有——上面列的幾條都是會動到既有行為的相容性變更，不是單純新增功能。
- **對你的影響**：如果你的 agent 有自訂 `CodeMode` 工具揭露邏輯、調過 Harness 提醒頻率、或用了 `CombinedCapability` 做延遲載入，升級前先讀一遍這版的 Compatibility Notes 清單，確認沒有依賴舊行為。

---

### crewAI v1.15.31

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/v1.15.31)

- **重要變更**：新增 conversational flow 的 context compaction；修了 `output_file` 透過 template 插值造成的路徑穿越（path traversal）、反序列化漏洞、SQL injection 三個資安問題；`AgentExecutor` 從 experimental 升級為正式功能。
- **Breaking Changes**：無明說，但資安修補可能讓原本「剛好能用」的 `output_file` 路徑寫法失效。
- **對你的影響**：如果你在生產環境跑 crewAI，尤其是 `output_file` 或任何輸出路徑有拼接使用者輸入的用法，這版修的是實際可被利用的資安漏洞，建議儘快升級而不是排進下個 sprint。

## 今日收穫

原本以為 agent skill 大多是「功能擴充」——多一個工具、多一條流程，但看了 superpowers、hallmark 跟 impeccable 同天衝榜才發現，最近這波 skill 真正在做的是「品味治理」：不是讓 agent 多會做一件事，而是在 agent 已經會做的事情上面，裝一層「不准看起來像 AI 做的」檢查關卡。這代表 agent 輸出品質的戰場已經從「能不能做出來」往「做出來像不像人做的」挪動，而這件事現在被打包成可以一行指令裝進任何 coding agent 的獨立產品。

## 參考資料

- [obra/superpowers](https://github.com/obra/superpowers) — GitHub repo
- [Nutlope/hallmark](https://github.com/Nutlope/hallmark) — GitHub repo
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — GitHub repo（今日亮點提及，交叉比較用）
- [nightly-labs/openbot](https://github.com/nightly-labs/openbot) — GitHub repo
- [expo/skills](https://github.com/expo/skills) — GitHub repo
- [pydantic-ai v2.63.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.63.0)
- [crewAI v1.15.31 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/v1.15.31)
- [GitHub Trending (daily snapshot, 2026-10-29)](https://github.com/trending?since=daily) — 今日 trending 榜單原始來源，含各 repo 當日星數與增量

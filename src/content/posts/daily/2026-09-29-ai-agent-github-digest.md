---
title: "AI Agent GitHub Digest — 2026-09-29"
date: 2026-09-29
category: daily
tags: [ai-agent, github, open-source, daily, coding-agent, developer-tools, observability]
lang: zh-TW
description: "今天五個上升的 repo 沒有一個在做新的 agent 框架，全部圍著 Claude Code、Codex 這類既有 coding agent 補位——選模型、找程式碼、部署、看紀錄"
tldr: "Z.ai 的 ZCode（7k★）把桌面殼、瀏覽器介面和 Agent CLI 包進同一個 coding agent 工作台；magpie（1.6k★）在選單列一鍵切換 Claude Code / Codex / Gemini CLI 底層接的模型；jevgrep（1.3k★）用語意搜尋幫 coding agent 先找檔案，省掉部分來回 grep 的 token；golive-skill 和 agent-console 分別補上部署自動化與 session 可觀測性。Claude Code 今天發布 v2.1.284，新增 Sonnet 5.5 預設模型與多項終端機修復。"
series:
  name: "AI Agent GitHub Digest"
  order: 45
---

> 🌏 [English version](/en/posts/daily/2026-09-29-ai-agent-github-digest-en)

## 今日亮點

今天上升的五個 repo，沒有一個在重新發明 agent 框架本身，全部圍著 Claude Code、Codex 這類已經存在的 coding agent 補位——模型怎麼選（magpie）、程式碼怎麼找得更省（jevgrep）、上線怎麼自動化（golive-skill）、跑了什麼要怎麼看得到（agent-console），連 Z.ai 自己的 ZCode 也是同一套邏輯的另一種實作。Coding agent 的核心迴圈開始穩定下來，現在大家在搶的是它周邊那一圈。

## Trending Repos

### ZCode ⭐ 7,031（上線 8 天）

[GitHub](https://github.com/zai-org/ZCode)　·　TypeScript　·　Apache-2.0

- **是什麼**：Z.ai（GLM 模型背後的公司）自己出的 coding agent 工作台，桌面 app、瀏覽器介面和終端 Agent CLI 共用同一套 runtime，全部放在同一個 monorepo。
- **為什麼值得看**：跟多數第三方接 GLM 的做法不同，這次是模型供應商自己做殼——不用再透過 Claude Code 或 Codex 轉接，Z.ai 直接把 UI、CLI、桌面版整合成一套產品，等於在複製 Anthropic 對 Claude Code 的打法。
- **tech stack**：Electron 桌面殼 + pnpm workspace + 內建 Agent CLI／runtime（`apps/zcode-cli`）
- **上手難度**：中——`pnpm bootstrap` 能一鍵裝好本地開發環境，但完整跑桌面版需要指定版本的 Node 24 與 pnpm，遠端（SSH/WSL）功能還得另外準備資源。

---

### magpie ⭐ 1,571（上線 5 天）

[GitHub](https://github.com/yetone/magpie)　·　Go　·　MIT

- **是什麼**：常駐選單列的小工具，列出機器上每個 coding agent（Claude Code、Codex、Gemini CLI、OpenCode…）目前設定的模型，點一下就能換，不用手動改各家的 config 檔。
- **為什麼值得看**：它自己跑一個本機 gateway，把 OpenAI Chat／Responses 和 Anthropic Messages 三種協定互相轉譯，所有 agent 都指向同一個 endpoint，再由 magpie 決定實際打到哪個供應商——你在 Claude Code 或 Codex 登入的訂閱額度，其他 agent 也能透過這個 gateway 借用，不用重複貼 API key。
- **tech stack**：Go + Wails（系統內建 webview）+ 本機 gateway（相容 OpenAI Chat/Responses 與 Anthropic Messages API）
- **上手難度**：低——單一執行檔，macOS／Linux／Windows 都有，桌面版不到 15MB，純終端版 7MB。

---

### jevgrep ⭐ 1,284（上線 3 天）

[GitHub](https://github.com/dzhng/jevgrep)　·　TypeScript　·　MIT

- **是什麼**：給 coding agent 用的語意搜尋 CLI，先用一句話問「這段邏輯在哪」，`jg` 就回傳相關檔案、可疑線索和原始碼片段，讓 agent 少走幾輪 grep。
- **為什麼值得看**：作者自己的十題 SWE-bench 對照顯示，接了 jevgrep 之後能用更低成本做完和沒接時一樣多題（8/10 對 8/10），省下的主要是 agent 自己邊找邊猜檔案位置的來回 token。安裝後還會自動生成一份 Agent Skill，讓 Claude Code、Codex 等工具知道何時該呼叫它。
- **tech stack**：Node.js CLI + Jev（Vercel AI Gateway 上的檔案相關性判斷模型）
- **上手難度**：低——`npm install -g @dzhng/jevgrep` 加上 `jg skill` 裝好技能說明，需要 Vercel AI Gateway、TypeSafe、OpenRouter 或 OpenCode Zen 其中一組金鑰。

---

### golive-skill ⭐ 1,042（上線 5 天）

[GitHub](https://github.com/mikehasa/golive-skill)　·　TypeScript　·　MIT

- **是什麼**：一個 Agent Skill + 零依賴 Node CLI，幫 agent 蓋好的產品接上真正的 hosting、資料庫、網域、email、金流——用你自己的帳號，不經過任何第三方後台。
- **為什麼值得看**：Coding agent 把 app 生出來只是第一步，接帳號、開資料庫、設 DNS 這些瑣事才是多數人卡住的地方。GoLive 的作法是「偵測 → 規劃 → 你核准 → 執行 → 驗證」，每一步寫入都需要明確核准（DNS 改動要 `--confirm-dns`，正式環境要 `--confirm-live`），失敗就停在原地等你決定，不會自己硬著頭皮往下衝。目前仍是早期 alpha（0.1.0-alpha.5），只涵蓋 Vercel／Netlify、Supabase／Neon、Porkbun／GoDaddy、Resend、Stripe 幾條路徑。
- **tech stack**：零依賴 Node CLI + Agent Skill（`SKILL.md`）+ 各家 Provider API（Vercel、Supabase、Stripe 等）
- **上手難度**：中——CLI 本身零依賴好裝，但要串好幾個第三方帳號的 API 金鑰，且仍是 alpha，套用前建議先看它自己的 TRUST／RECOVERY 文件。

---

### agent-console ⭐ 624（上線 8 天）

[GitHub](https://github.com/LockedinLabs-AI/agent-console)　·　JavaScript　·　MIT

- **是什麼**：本機優先的 coding agent 可觀測性工具，讀取 Claude Code 和 Codex 自己留在本機的 session 紀錄，整理成 token、快取、模型和估計花費的儀表板，可以再串連多台機器成一個團隊視圖。
- **為什麼值得看**：不用額外裝 SDK 或接遙測，直接讀 agent 自己寫在磁碟上的 transcript，預設不上傳任何資料。對想知道「這個月 Claude Code 到底燒了多少 token」但不想把資料交給雲端服務的團隊，是個直接能用的答案；也支援選擇性接 Claude Code 的 OpenTelemetry 輸出和 Prometheus `/metrics`。
- **tech stack**：Node.js + 本機 transcript 解析 + 選用 OpenTelemetry／Prometheus 整合
- **上手難度**：低——單機看自己的 session 資料不需要額外設定，要接團隊 hub 或 Grafana 儀表板才需要多花時間。

## Notable Releases

### Claude Code v2.1.284

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.284)

- **重要變更**：新增 Claude Sonnet 5.5（`claude-sonnet-5-5`）成為 Anthropic API 上的預設 Sonnet 模型（1M context，$2/$10 每 Mtok，快取讀取 $0.20/Mtok）；auto mode 詢問工作目錄外讀取權限時新增「這次先問一下、之後再問一次」的中間選項；`/usage` 和狀態列開始顯示 gateway 花費上限的實際金額；`/mcp reconnect all` 可以一次重連所有連線失敗的 MCP server；修掉一批串流錯誤（如殘留的「JSON Parse error」訊息）、compact 後仍超長會再 compact 一次、以及多個終端機渲染上的小 bug。
- **Breaking Changes**：無（本次未見標示為 breaking 的變更）
- **對你的影響**：如果你在用 Claude apps gateway 管控多人用量，可以直接在 `/usage` 看到花了多少錢而不用自己換算；一般互動使用者則是串流穩定性和幾個終端機顯示問題被修掉，升級後應該更少遇到卡在錯誤訊息或畫面錯位的情況。

## 今日收穫

之前預設「coding agent 生態的重心在框架本身」——誰的 orchestration 做得更聰明、誰的 context 管理更好。但今天五個上升的 repo 沒有一個在碰這塊，全部在幫已經存在的 Claude Code / Codex 補周邊：選模型、找檔案、部署、看紀錄。這比較像是一個訊號——當 coding agent 的核心迴圈（讀、寫、跑、驗證）已經夠穩，開發者精力自然會往外溢到「用起來還缺什麼」，而不是繼續重造迴圈本身。

## 參考資料

- [zai-org/ZCode](https://github.com/zai-org/ZCode)
- [yetone/magpie](https://github.com/yetone/magpie)
- [dzhng/jevgrep](https://github.com/dzhng/jevgrep)
- [mikehasa/golive-skill](https://github.com/mikehasa/golive-skill)
- [LockedinLabs-AI/agent-console](https://github.com/LockedinLabs-AI/agent-console)
- [Claude Code v2.1.284 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.284)

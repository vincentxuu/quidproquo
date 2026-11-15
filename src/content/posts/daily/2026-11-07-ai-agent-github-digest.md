---
title: "AI Agent GitHub Digest — 2026-11-07"
date: 2026-11-07
category: daily
tags: [ai-agent, github, open-source, daily, mcp, computer-use]
lang: zh-TW
description: "NVIDIA 幫 agent 補了一層「該不該相信這個數字」的語意層，Vercel 把操作電腦那套 accessibility tree 手法搬到瀏覽器，另一個新專案把它搬進一支真實 iPhone"
tldr: "NVIDIA/auto-ontology（約 5.5k 星）用 MCP 把企業資料的語意層交給 agent 查詢與驗證；vercel-labs/agent-browser（約 42k 星）把 agent-desktop 那套用 accessibility tree 取代截圖的手法搬到瀏覽器上；JosssphZhou/poki 上線一天衝到 257 星，讓 agent 直接操作一支真實 iPhone。Claude Code v2.1.319 把 MCP 工具呼叫丟到背景跑，同時把 auto mode 的部分判斷交給伺服端。"
series:
  name: "AI Agent GitHub Digest"
  order: 84
---

> 🌏 [English version](/posts/daily/2026-11-07-ai-agent-github-digest-en)

## 今日亮點

過去幾次 digest 看過 agent 怎麼學會操作電腦（[11/2](/posts/daily/2026-11-02-ai-agent-github-digest)、[11/5](/posts/daily/2026-11-05-ai-agent-github-digest) 都報過 agent-desktop），今天是這條線往兩端延伸：agent-browser 把同一套「讀 accessibility tree、不靠截圖猜座標」的手法搬回瀏覽器，poki 則把它搬進一支真實的 iPhone。同時 NVIDIA 的 auto-ontology 在補另一塊問題——agent 查到一個數字，要怎麼知道這個數字是對的。

## Trending Repos

### NVIDIA/auto-ontology ⭐ 約 5.5k（上線首日 +2k）

[GitHub](https://github.com/NVIDIA/auto-ontology)　·　Python　·　Apache-2.0

- **是什麼**：從企業既有的 metadata 自動生成語意層（ontology），讓 agent 透過 MCP、CLI 或 API 查詢資料代表什麼意思、能不能用、來源是哪裡，並把生成的查詢拿去跟經過認證的定義做比對。
- **為什麼值得看**：agent 查資料庫最怕的不是查不到，而是查到一個看起來合理但欄位意思錯的數字。這個專案把「資料的語意」和「查詢結果的正確性」分開處理——先建語意層、再驗證生成的 SQL 有沒有對應到認證過的定義，並附上 provenance（這個答案是怎麼來的）。目前不接受外部貢獻，等於 NVIDIA 自己維護這條語意層。
- **tech stack**：Python + Postgres（語意目錄與資料共存）+ Better Auth（RBAC）+ NVIDIA NIM / Nemotron（文字轉 SQL）+ Helm / Docker Compose 部署
- **上手難度**：中——需要接上現有資料庫跟 NIM endpoint，單機試用簡單，但要發揮「驗證」的價值得先把企業既有的定義餵進去

---

### vercel-labs/agent-browser ⭐ 約 42k（本週 +487）

[GitHub](https://github.com/vercel-labs/agent-browser)　·　Rust　·　Apache-2.0

- **是什麼**：給 agent 用的瀏覽器自動化 CLI，用 `snapshot` 把頁面讀成帶 ref 編號的無障礙樹（accessibility tree）文字，agent 對 ref 下指令、再重新 snapshot 確認結果，一次一個 shell 指令。
- **為什麼值得看**：這是 agent-desktop 的姊妹專案，同一個作者團隊先把這套手法用在瀏覽器上。跟純靠截圖讓模型猜座標比，ref 在同一個 snapshot 內是穩定的，點擊失敗會直接回報原因（元素被蓋住、被disable），而不是回報「成功」卻什麼都沒發生。也支援接上已開的 Chrome（`--cdp`）或 Browserbase／Browserless 等雲端瀏覽器。
- **tech stack**：Rust CLI + Chrome DevTools Protocol，常駐背景 daemon 控制瀏覽器，也可用 `agent-browser mcp` 開 MCP server
- **上手難度**：低——`npm install -g agent-browser` 後跑 `agent-browser install` 裝一次 Chrome for Testing 就能用

---

### JosssphZhou/poki ⭐ 257+（上線首日）

[GitHub](https://github.com/JosssphZhou/poki)　·　Rust + TypeScript　·　AGPL-3.0

- **是什麼**：本地 MCP server 加 agent，讓 AI 直接操作一支真實的 iPhone——不是模擬器，不需要 jailbreak，也不用額外硬體，靠 idevice／idb 橋接到裝置。
- **為什麼值得看**：前兩個 repo 都在讓 agent 操作電腦畫面，poki 把同一個方向延伸到手機這塊目前幾乎沒人碰的領域。11/5 剛建立就在第一天拿下 257 星，支援 Claude Code、Codex 等 MCP client 直接連，也能透過 iMessage／Telegram 下指令，等於把手機變成 agent 的另一個執行環境。
- **tech stack**：Rust 原生橋接層 + idevice/idb + Node.js MCP SDK + ffmpeg（處理畫面串流）
- **上手難度**：高——限 macOS 15+，需要完整 Xcode、Rust、Node 24+ 跟一支實體 iPhone，純軟體模擬做不到

## Notable Releases

### Claude Code v2.1.319

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.319)

- **重要變更**：MCP 工具呼叫若被 MCP server 當成 task 執行，Claude Code 現在會直接丟到背景跑、完成後再回報結果，不再卡住當前回合；新增 `permissions.denyInsteadOfPrompting` 設定，讓本來要跳權限提示的工具呼叫直接被拒絕、對話照常往下走。
- **Breaking Changes**：關掉 telemetry 或 feature flag（包含走 LLM gateway 的情況）時，auto mode 原本會問使用者或直接拒絕的呼叫，現在預設改成呼叫伺服端做判斷，而且沒有退回本地分類器的 fallback；要維持舊行為需要自己設定 `CLAUDE_CODE_AUTO_MODE_SERVER=0`。
- **對你的影響**：如果你在跑 Claude Code 時關了 telemetry 或 feature flag（例如走企業自架的 gateway），升級後 auto mode 的判斷會多一次對伺服端的呼叫；不想要這個行為就要主動設環境變數，不是預設關閉。

今天 CrewAI 1.15.36 只多了一個實驗性的「對話式 Agent session」功能和幾個小 bug fix，還沒到重要更新的門檻；Pydantic AI v2.66.0 的安全性修補[已經在 11/5 的框架更新 digest 報過](/posts/daily/2026-11-05-framework-pydantic-ai-v2.66.0)，這裡不重複。

## 今日收穫

之前覺得「agent 操作電腦」和「agent 查資料庫要可信」是兩條不相關的技術線，一條是執行層、一條是資料層。但把今天三個 repo 放在一起看，會發現它們其實在補同一個缺口的兩端：auto-ontology 讓 agent 知道「這個數字能不能信」，agent-browser／poki 讓 agent 知道「這個畫面上的東西能不能點」——執行層和資料層分別在解決同一句話：agent 看到的東西，是真的，還是它以為的。

## 參考資料

- [NVIDIA/auto-ontology — GitHub repo](https://github.com/NVIDIA/auto-ontology)
- [NVIDIA Releases Auto Ontology — MarkTechPost](https://www.marktechpost.com/2026/11/01/nvidia-auto-ontology-open-source-semantic-layer-ai-agents/)
- [GitHub Trending November 2026 — CoddyKit（auto-ontology 星數與單日漲幅）](https://www.coddykit.com/pages/blog-detail?id=5130021&slug=github-trending-november-2026-from-a-147k-star-spec-driven-toolkit-to-a-2-78-tri)
- [vercel-labs/agent-browser — GitHub repo](https://github.com/vercel-labs/agent-browser)
- [vercel-labs/agent-browser — Star History](https://www.star-history.com/vercel-labs/agent-browser/)
- [JosssphZhou/poki — GitHub repo](https://github.com/JosssphZhou/poki)
- [Daily new repos (2026-11-06): Rerun, poki — poki 首日星數](https://github.com/yash-nandvana/ai-tools/pull/7)
- [Claude Code v2.1.319 — Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.319)
- [CrewAI 1.15.36 — Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.36)

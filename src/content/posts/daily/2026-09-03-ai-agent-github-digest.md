---
title: "AI Agent GitHub Digest — 2026-09-03"
date: 2026-09-03
category: daily
tags: [ai-agent, github, open-source, daily, personal-agent, agent-skills, agent-security, document-parsing]
lang: zh-TW
description: "個人 agent 開始留下可追溯的軌跡——Hermes Agent 自己學技能、Atlas 把每個 commit 綁回是哪個 agent session 改的，AG2 則用不靠 LLM 的規則中介層擋 prompt injection"
tldr: "NousResearch/hermes-agent 靠自我學習迴圈記住怎麼用你的工具、跨平台記得你是誰，239,994 星持續衝榜；pacifio/atlas 讓多個 coding agent 共用一套「看得到是誰改的」版本控制，一天漲 895 星；blader/humanizer 用 35 種模式把 AI 味洗掉但不竄改事實。文件處理端 firecrawl/pdf-inspector 用 Rust 在 50ms 內判斷 PDF 要不要 OCR；superlinked/sie 把 agent 會用到的所有模型收進一個自架推理叢集。框架端 AG2 v1.0.3 全面遷移 MCP 2.0（breaking change），並加入不靠 LLM 判斷的 TealTigerMiddleware 做 prompt injection 防護。"
series:
  name: "AI Agent GitHub Digest"
  order: 19
---

> 🌏 [English version](/en/posts/daily/2026-09-03-ai-agent-github-digest-en)

## 今日亮點

今天上榜的專案剛好都在幫 agent 留下「痕跡」或抹掉痕跡——Hermes Agent 用自我學習迴圈記住自己做過什麼，Atlas 把每個 commit 綁回是哪個 agent session、什麼 prompt 生出來的，Humanizer 則反過來把 agent 寫出的 AI 味洗掉。同時 AG2 補上一個不靠 LLM 判斷的 prompt injection 防護層，跟昨天 NVIDIA SkillSpector 的資安主題算是接力。

## Trending Repos

### NousResearch/hermes-agent ⭐ 239,994 (+529)

[GitHub](https://github.com/NousResearch/hermes-agent)　·　Python　·　MIT

- **是什麼**：Nous Research 出的個人 agent，內建自我學習迴圈——用完會自己萃取技能、修記憶、跨 session 記住使用者。
- **為什麼值得看**：跟一般「無狀態」coding agent 不同，它主動維護長期記憶與技能庫（相容 agentskills.io 標準），還能跨 Telegram、Discord、Slack、WhatsApp、Signal、CLI 用同一個 gateway 呼叫；可以丟到 5 美元 VPS 或 serverless 環境跑，閒置時幾乎零成本。
- **Tech Stack**：Python + FTS5 session search + agentskills.io 標準 + 多終端後端（Docker / SSH / Modal / Daytona / Vercel Sandbox）
- **上手難度**：低——一行安裝腳本就能跑；要接多個聊天平台則得各自申請 API/token，屬中等偏低。

---

### pacifio/atlas ⭐ 2,767 (+895)

[GitHub](https://github.com/pacifio/atlas)　·　Rust　·　MIT

- **是什麼**：幫多個 coding agent（Claude Code、Codex、自家 agent、ACP registry 上的其他 agent）共用同一份「版本控制」，每個 commit 都能回溯到是哪個 session、什麼 prompt、什麼 tool call 產生的。
- **為什麼值得看**：一般 git 只知道「誰改的」，不知道「哪個 agent 用什麼推理改的」；多 agent 平行開發時這種可追溯性特別關鍵，還支援共享記憶，讓切換 agent 不用重新給 context。今天單日漲了 895 星，是這批候選裡漲最快的。
- **Tech Stack**：Rust + ACP（Agent Client Protocol）+ MCP client
- **上手難度**：中——需要自己跑 client/server，且要串接多個 agent CLI。

---

### blader/humanizer ⭐ 40,149 (+366)

[GitHub](https://github.com/blader/humanizer)　·　Python　·　MIT

- **是什麼**：一個 Claude Code / Codex / Cursor 都能用的 Agent Skill，依照 Wikipedia「Signs of AI writing」整理出的 35 種模式，把 AI 寫的文字改到讀起來像人寫的。
- **為什麼值得看**：跟純粹「洗掉 AI 味道」的工具不同，它明確標榜不捏造事實——數字、引語、日期都得從原文或使用者提供,改寫前還會秀出第一版草稿和「哪裡還很像 AI」的檢討清單。同一天另一個類似專案 Nanako0129/sepia（1,525 星）也在做「去 AI 味」skill，這類 skill 正變成一個小的子類別。
- **Tech Stack**：純 Markdown skill（agent-skills 標準）
- **上手難度**：低——放進 skill 目錄就能用 `/humanizer` 呼叫。

---

### firecrawl/pdf-inspector ⭐ 18,388 (+589)

[GitHub](https://github.com/firecrawl/pdf-inspector)　·　Rust　·　MIT

- **是什麼**：Firecrawl 開源的 Rust PDF 函式庫，先判斷 PDF 是純文字還是掃描檔，文字檔直接轉乾淨的 Markdown，掃描檔才選擇性丟去 OCR。
- **為什麼值得看**：官方測試裡約 54% 的 PDF 其實不需要 OCR，這個函式庫能在 10-50ms 內判斷完，直接省下等 OCR 服務的時間與費用；文字擷取還會保留座標，多欄版面、財報表格都有處理，適合接進 RAG 前的文件前處理管線。
- **Tech Stack**：Rust 核心 + Python / Node.js / WASM binding + PP-OCRv6 Small（選用 OCR）
- **上手難度**：低——pip、npm、cargo 三個生態都能直接裝。

---

### superlinked/sie ⭐ 3,008 (+61)

[GitHub](https://github.com/superlinked/sie)　·　Python / Rust　·　Apache-2.0

- **是什麼**：Superlinked 開源的自架推理伺服器，把 agent 會用到的各種模型（embedding、rerank、結構化輸出、內容安全、agent loop 本身）都收進同一個叢集，用一個 OpenAI 相容 API 呼叫。
- **為什麼值得看**：原本每種模型任務都要分開架設 model server，SIE 用同一套系統做 on-demand loading 加 LRU eviction，還內建 Kubernetes / Helm 部署設定，直接接 LangChain、LlamaIndex、CrewAI 等框架。
- **Tech Stack**：Python + Rust + Kubernetes / Helm + KEDA autoscaling
- **上手難度**：中——自架推理叢集需要 K8s 經驗，本地開發可用 mise 工具鏈跑起來。

## Notable Releases

### AG2 v1.0.3

[Release Notes](https://github.com/ag2ai/ag2/releases/tag/v1.0.3)

- **重要變更**：全面遷移到 MCP 2.0（client 和 server 都是）；新增 `TealTigerMiddleware`，用純 regex/glob 規則（不靠 LLM）在每次工具呼叫前擋 prompt injection；ACP host 現在能回應被託管 agent 的 human-input 請求；human-input 失敗會直接回報而不是卡住整個流程。
- **Breaking Changes**：`mcp` 依賴版本鎖定為 `>=2.0.0,<3`——如果你自己 pin `mcp` 版本，或依賴的套件把 `mcp` 鎖在 2.0 以下，升級前要先處理這個相依關係。
- **對你的影響**：用 AG2 的話升級前先檢查 `mcp` 版本相依是否會撞版；想要不靠 LLM 判斷、純規則式的 prompt injection 防護，可以直接掛 `TealTigerMiddleware`。

## 今日收穫

之前以為 agent 的「記憶」主要是存放對話紀錄和技能庫，但 Atlas 把這個概念延伸到 commit 層級——原來「這行程式碼是哪個 agent session、用什麼 prompt 生出來的」本身也該是一種可查詢的記憶，而不只是 git blame 那種「誰按下 commit」的表層資訊。

## 參考資料

- [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)
- [pacifio/atlas](https://github.com/pacifio/atlas)
- [blader/humanizer](https://github.com/blader/humanizer)
- [Nanako0129/sepia](https://github.com/Nanako0129/sepia)
- [firecrawl/pdf-inspector](https://github.com/firecrawl/pdf-inspector)
- [superlinked/sie](https://github.com/superlinked/sie)
- [AG2 v1.0.3 Release Notes](https://github.com/ag2ai/ag2/releases/tag/v1.0.3)
- [GitHub Trending（daily）](https://github.com/trending?since=daily)
- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)

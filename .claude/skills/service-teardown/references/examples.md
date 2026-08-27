# 兩個範例：一機制一檔（Genspark）與逐輪單檔（Claude Code on the web）

本檔是兩批原始筆記的摘要，讓 skill 不依賴外部路徑。原檔（若還在）：
`~/Work/ai-slide/doc/genspark-*.md`（2026-06-12～07-08）與
`.research/2026-08-27-claude-code-web-new-session-walkthrough.md`（2026-08-27）。

---

## 範例 A：Genspark AI Slides —— 一機制一檔型（10 檔）

背景：MaiAgent 要做 AI Slides，用 Playwright 登入自己的 Genspark 帳號實測；MaiAgent 側直接讀
`maiagent-admin-vue`／`maiagent-django` 原始碼對照。每檔開頭固定三行：分析日期、來源（攔截 network／DOM 檢查／讀原始碼）、對照對象。

| 檔 | 回答的問題 | 層 | 方法 | 代表發現 |
|---|---|---|---|---|
| `genspark-ai-slides-research.md`（主檔，27 節） | 整個產品從輸入到匯出怎麼跑 | L1–L4 | network＋HAR＋官方 blog＋YouTube＋公開 session | 不是獨立 app，是通用 agent runtime 上的 `type: slides_agent_git` workflow；統一 `POST /api/agent/ask_proxy` SSE；git 做版控；33 條 message flow；token 消耗 |
| `genspark-slides-ui-analysis.md` | 畫面怎麼切、資料怎麼流 | L1 | snapshot＋ASCII 佈局圖 | 左 chat 右 slides panel；縮圖／預覽／Code toggle；直接推導 MaiAgent 的 SlidePanel 定位 |
| `genspark-slides-vs-edit-slides.md` | `/agents`／`/slides`／`/edit_slides` 三個入口差在哪 | L1＋L3 | URL 參數與 API 呼叫差異表 | 同一 project 三種檢視模式；`/edit_slides` 多載編輯器資源與 save API |
| `genspark-edit-slides-rendering.md` | WYSIWYG 怎麼做的 | L4 | 切 iframe 讀 DOM | iframe 1280×720 原尺寸＋外層 `transform: scale()`；`designMode="on"`＋`contentEditable`；注入 ContextMenuManager；sandbox／CSP |
| `genspark-ai-edit-features.md` | AI Edit 三模式差在哪 | L2＋L3 | 攔 request body | 三模式共用同一 API，差在前端注入的 system prompt 與互動模式；Fix Layout 實測、另兩個標「推測」 |
| `genspark-export-download-mechanism.md` | 匯出 PDF／PPTX／Google Slides 怎麼跑 | L3 | SSE 進度事件逐筆對照 | Export（後端渲染＋blob）與 Download（短碼＋token）兩階段；heartbeat；OAuth 分支 |
| `genspark-save-point-mechanism.md` | Save Point 是什麼 | L4 | `with_version_history=true` 回應 | 每個 Save Point = git commit；lazy loading；描述自動生成 |
| `genspark-vs-maiagent-slides-comparison.md` | 我們差在哪 | L6 | 逐項對照表（渲染／編輯／儲存／版控／匯出／AI） | 核心架構相似（iframe＋designMode），差在版控、匯出、AI 工具鏈成熟度；列「待補齊」 |
| `maiagent-vs-genspark-ai-edit.md` | 為什麼我們的 AI 編輯體感差 | L6 | 由兩個真實 bug 觸發的體檢 | 一句話結論「我們做了快、便宜、human-in-the-loop 的文字編輯器；對方做了慢、貴、會自我修正的視覺 agent」；Phase 0 止血→Phase 3；附「不要照抄」 |
| `slide-template-inventory.md` | 模板有哪些、留哪些 | inventory | Skill Market glob | 183 個模板分類表，供人工標 ✅❌❓ |

值得學的做法：
- 主檔末尾有「**待深入研究項目（需要條件）**」與「**已完成項目總覽（章節｜項目｜方法）**」兩張表——後者等於每個發現的證據來源。
- 關鍵字命中要判讀語境：HAR 裡的 `handoff`／`delegate` 逐一查，結論是「沒有 structured handoff 欄位證據」，而不是「有 handoff」。
- 對照文由**真實 bug** 觸發，改善路線先修已確認的 bug、再重用現成工具，最後才談架構收斂。

---

## 範例 B：Claude Code on the web —— 逐輪單檔型（1 檔、6 輪、436 行）

背景：為 deep-dive 專文（order 38）補實測。Playwright 登入自己的 Max 帳號，測試 repo 用低風險的
`maiagent-api-examples`，指令唯讀；每輪一個新 session，測完 Archive；原始事件落在 `.playwright-mcp/events-*.json`（未追蹤）。

| 輪 | 層 | 做了什麼 | 代表發現 |
|---|---|---|---|
| 1 | L1＋L2 | 首頁控制項表、送出後狀態、頂部工具、與 Routines 對照 | 預設 Opus 5／Auto／High；Archive 沒確認框；記下 base-ui portal 等自動化備註 |
| 2 | L3＋L4 | `browser_network_requests` 錄整段；事件 JSON 落檔 | **SSE 不是 WS**，一條 `sessions/watch` 長連線；Routine = `triggers` 資源；Archive 是 `end_session` 事件；header `ccr` = Claude Code Remote；UI 事件與 Agent SDK stream-json **同構** |
| 3 | L5 | 中斷、改檔＋commit＋push＋開 PR、續聊刪分支 | Stop = `control_request/interrupt`；PR 走內建 github MCP 不是 `gh`；憑證**能 push 不能刪分支**（殘留一條分支） |
| 4 | L5 | `always_ask` 實況、Plan mode 權限協定、工具失敗、`/compact` | auto 下 `always_ask` 不問；`can_use_tool` ⇄ `control_response`；工具失敗≠回合失敗；compact 前後 token |
| 5 | L5 | 建雲端環境、setup script `exit 1`、Trusted 下 curl | setup 失敗擋整個 session 且 `cost 0`；Trusted 對非套件源回 403；「可注入／不可注入」表 |
| 6 | L5＋L7 | 三種 Mode 對照；沙箱唯讀盤點 | UI「Accept edits」底層送 `default`；平台預設 Stop hook 會催 commit；Firecracker microVM、MITM 代理、憑證是 `proxy-inject` 佔位；worker 完整命令列 |
| — | 沒拿到的 | 要求 cat 系統提示／代理設定被沙箱 Claude 拒絕 | 記錄拒絕原文；可用 setup script 繞但**未執行** |

值得學的做法：
- 每輪開頭三行：測試 session id（遮罩）、是否已 Archive、原始檔路徑。
- 「官方文件說頁面薄」的假設被實測推翻後，直接改寫專文結論——文件先讀、實測定案。
- 同一物件兩個 ID（`session_X`／`cse_X`）、UI 標籤與參數不一致、env 版本與實際不一致——這類「對不上」的地方都單獨記，不硬解釋。
- 遇到 Playwright MCP 被別的 session 佔用時，改走 `playwright-second-browser` 自起第二個瀏覽器繼續錄。

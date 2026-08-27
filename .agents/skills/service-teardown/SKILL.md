---
name: service-teardown
description: 用自己的帳號實際操作一個第三方軟體服務（SaaS／Web app／agent 產品），逐層拆解它怎麼運作——UI 控制項、使用流程、網路 API 時序、事件與資料結構、失敗與權限邊界、（可及時）執行環境——每一輪存原始擷取、標明實測／推測，最後對照自家產品產出改善路線。用於「研究一下 X 怎麼做的」「拆解 X」「X 背後是怎麼跑的」「跟我們的 Y 比一比」「實測 X 的流程」。純看文件不動手的研究改用 deep-research；分析自家 codebase 用 codebase-analysis。
---

# service-teardown skill

把「學會一個別人的軟體服務」變成可重複的流程：**動手走 → 錄下來 → 分層記 → 標證據等級 → 對照自家 → 列出沒拿到的**。

樣本摘要在 `references/examples.md`：Genspark AI Slides（一機制一檔，10 檔）與 Claude Code on the web（逐輪單檔，6 輪）。動手前先看一遍，知道成品長什麼樣。

## 何時用

| 情境 | 用 | 不用 |
|---|---|---|
| 「Genspark 的 AI Edit 是怎麼做的？」 | ✅ | |
| 「claude.ai/code 開一個 session 背後打了哪些 API？」 | ✅ | |
| 「拿 X 跟我們的 Y 對照，列改善路線」 | ✅（第 6 層） | |
| 「LangGraph 1.x 有哪些變化？」 | | ❌ 讀文件即可 → deep-research |
| 「我們的 slide 編輯器程式碼怎麼跑的？」 | | ❌ → codebase-analysis |
| 沒有可登入的帳號、或服務 ToS 明文禁止自動化探測 | | ❌ 退回 deep-research，只用公開文件與 demo |

## 硬規則（先讀）

1. **只用自己的帳號、只做低風險動作**：預設唯讀（列目錄、看設定、開對話框後取消）；要寫入就用專用測試 repo／專案，做完清掉。
2. **每一輪都存原始擷取**：`.playwright-mcp/<service>-<round>-*.json`（network、events、HAR、DOM snapshot），未追蹤但要在筆記裡指名路徑。筆記是從原始檔整理出來的，不是憑印象寫的。
3. **遮罩再落筆**：session id、token、org uuid、email、connector uuid 一律 `<org>`／`<id>`／`…` 取代；不把憑證寫進任何檔案。
4. **證據分三級並標出來**：`實測`（自己看到的 request／event／DOM）、`推測`（從結構或 codebase 字串反推，寫「推測」二字）、`官方文件`（附連結）。推測不可寫成肯定句。
5. **服務拒絕就停**：對方的模型／UI 拒絕給系統提示、代理設定、內部檔案時，記錄拒絕原文與理由，列入「沒拿到的」，**不繞路**（例如不用 setup script 繞過模型把關）。
6. **收尾清乾淨並列殘留**：Archive／刪除測試 session、關 PR、刪測試檔；刪不掉的（如遠端分支）寫進「殘留清單」等人工處理。
7. 字串搜尋（`handoff`、`delegate`…）命中要逐一判讀語境，不能拿關鍵字命中數當結論——見 progress.txt 的稽核教訓。

## 執行步驟

### 0. 定題與定界（10 分鐘）

寫下三件事再開瀏覽器：
- **要回答的問題**（1–3 個）：例「session 事件是 WS 還是 SSE？」「AI Edit 三個模式差在哪？」
- **測試素材**：哪個帳號、哪個低風險 repo／專案、要送什麼唯讀指令。
- **對照目標**：這次要不要接第 6 層（自家產品／同服務的另一功能）。沒有就明說「本輪不對照」。

### 1. 六層逐層拆（每層要記什麼 → `references/layer-checklist.md`）

| 層 | 問的問題 | 主要工具 |
|---|---|---|
| L1 UI | 有哪些控制項、預設值、點開看到什麼、URL 路由 | Playwright snapshot／screenshot |
| L2 流程 | 從輸入到結果的時間線、工具鏈順序、狀態文字怎麼變 | 逐步 snapshot ＋ 計時 |
| L3 網路 | 傳輸方式、端點時序表、request／response 結構、headers 身分、ID 對應 | `browser_network_requests`、HAR |
| L4 事件／資料 | 事件流每筆型別與欄位、資料物件結構、儲存與版控 | 事件 JSON、內容 API |
| L5 邊界 | 中斷、工具失敗、權限請求、失敗注入、憑證能做／不能做 | 有意觸發＋錄事件 |
| L6 對照 | 與同服務其他入口、與自家產品的逐項對照 → 改善路線 | codebase-analysis、agent-ux-review |
| （L7 內部） | 只在對方允許在其環境跑指令時：版本、工具清單、hooks、env、網路代理 | 在對方 sandbox 下唯讀盤點 |

不必每次七層全做；**一輪只挖一到兩層**，做完就寫，下一輪再往下。輪次建議與安全的失敗注入清單 → `references/round-playbook.md`。

### 2. 每輪的固定收尾

1. 把該輪的原始擷取路徑、測試 session id（遮罩後）、是否已 Archive 寫進筆記開頭。
2. 更新兩張表：**已完成項目總覽**（章節｜項目｜方法）與 **待深入項目**（項目｜需要條件｜說明）。
3. 更新「自動化備註」：這個服務的 selector 陷阱、會攔點擊的 banner、抓不到的元件——下一輪省時間。
4. 更新「沒拿到的」與「殘留清單」。

### 3. 輸出

筆記模板 → `references/note-template.md`。兩種組織方式擇一：
- **單服務逐輪**（Claude Code web 型）：一個檔 `.research/YYYY-MM-DD-<service>-<scope>-walkthrough.md`，章節依輪次遞增。
- **一機制一檔**（Genspark 型）：`<service>-<mechanism>.md` 多檔＋一份 `<service>-vs-<ours>-<topic>.md` 對照，適合要分頭餵給不同開發任務時。

### 4. 停止條件

「待深入項目」表裡只剩**需要你沒有的條件**（付費方案、多帳號、對方授權）的項目，且定題時的問題都有實測級答案。

## 跟其他 skill 的關係

- `deep-research`：先讀官方文件、blog、demo 建立假設；本 skill 用實測去證實或推翻（例：官方說「頁面薄」，實測推翻）。
- `codebase-analysis`：L6 對照自家時讀 maiagent-* 原始碼。
- `playwright-second-browser`：Playwright MCP 被別的 session 佔用（`Browser is already in use`）時，複製登入 profile 自起第二個 Chrome 繼續錄；其腳本模板的 `page.on('response')` 也比 MCP 更適合整段錄 API body。
- `agent-ux-review`：L6 對照可直接套五則心法找 agent 化缺口。
- `post`：筆記成熟後轉 deep-dive 專文（Claude Code on the web 專文即由此而來）。
- `research-selection`：要拆「多家服務」時先跑母群／覆蓋矩陣，再對每家跑本 skill。

## 詳細參考

- `references/layer-checklist.md`：七層各要抓什麼、表格模板、常見發現型態。
- `references/round-playbook.md`：輪次順序、安全的失敗注入、清理清單。
- `references/note-template.md`：筆記骨架（含已完成／待深入／沒拿到／殘留四張表）。
- `references/browser-automation-notes.md`：Playwright MCP 抓網路與事件的手法、遮罩流程、通用 selector 陷阱。
- `references/examples.md`：兩個完整範例的逐檔／逐輪摘要與「值得學的做法」。

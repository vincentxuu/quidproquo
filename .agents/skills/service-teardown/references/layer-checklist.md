# 七層檢查表：每層要抓什麼、用什麼表記

每層列「必抓」「常見發現型態」「表格模板」。範例取自 Genspark AI Slides 與 claude.ai/code 兩批筆記。

## L1 UI 層

必抓：
- 每個入口頁的控制項、**預設值**、點開後的選項（含快捷鍵、副標說明文字原文）。
- URL 路由表：路徑｜用途｜進入方式｜必要參數。
- 同一功能的多種檢視模式（例：`/agents` vs `/slides` vs `/edit_slides`）。
- 對話框欄位與欄位旁的警語原文（例「visible to anyone using this environment — don't add secrets」）。

模板：
```
| 控制項 | 預設 | 點開看到 |
|---|---|---|
```
```
| 路徑 | 用途 | 進入方式 |
|---|---|---|
```

常見發現：預設值透露產品重心（預設模型、預設權限模式）；「不存在的路由」（如 `/code/environments` 404）也要記。

## L2 流程層

必抓：
- 時間線 `T+0s / T+3s / …`：使用者動作 → 頁面導向 → 工具呼叫順序 → 狀態文字 → 完成訊號。
- 工具鏈順序（例：Skill Market → List Directory → ask_user_questions → Write File → Check layout → Presentation）。
- 自動產生的東西：標題、分支名、建議追問 chip。
- 花了多久、花了多少（若 UI／事件有 cost／token）。

模板：
```
T+0s   使用者…
       ↓ 頁面…
T+3s   Agent 開始…
```

常見發現：「不是獨立應用而是通用 runtime 上的一種 workflow type」這類定位結論，多半在這層看出來。

## L3 網路層

必抓：
- **傳輸方式**：SSE／WebSocket／輪詢；長連線有幾條、握手時的「正常 400」要註明。
- **端點時序表**（依頁面載入→送出→進行中→收尾分段）。
- request body 重點欄位、response 結構（貼節錄，遮罩 id）。
- **請求標頭裡的身分與內部代號**（`anthropic-client-feature: ccr`、`product=slides_agent_git`）。
- 同一物件的多個 ID 及對應規則（`session_X` vs `cse_X`）。
- 遙測、靜態資源、目錄類端點另列一節，不混進主流程。

模板：
```
| 順序 | 端點 | 用途／body 重點 |
|---|---|---|
```

常見發現：某個 UI 動作其實不是獨立端點而是一個事件（Archive = `end_session` 事件）；「Routine 就是 triggers 資源」這種命名對應。

## L4 事件／資料層

必抓：
- 事件流逐筆型別與關鍵欄位（`system/init`、`assistant`、`result`、`post_turn_summary`…），標明哪些 UI 元素由哪個事件驅動。
- 核心資料物件的完整 JSON 節錄（trigger 物件、slide_data、manifest）。
- 儲存與版控：底層是 git／blob／DB？commit 對應什麼？lazy loading？
- 與已知協定的同構關係（例：Web UI 事件 = Agent SDK stream-json 原樣轉發）。

常見發現：「A 與 B 同構」是最有價值的結論之一——代表可以用已知工具重現對方行為。

## L5 邊界層

必抓：
- **中斷**：按 Stop 後的事件序列、錯誤文案。
- **工具失敗 vs 回合失敗**：兩層如何分別標記。
- **權限**：哪些模式會彈請求、協定長什麼樣、`always_ask` 實際是否問。
- **失敗注入**：哪些步驟可人工觸發失敗、怎麼觸發、失敗時燒不燒額度、錯誤如何呈現。
- **憑證邊界**：能做／不能做清單（能 push 不能刪分支）。
- **容量／壓縮**：context 閾值、compact 前後 token。

模板：
```
| 步驟 | 可否人工觸發失敗 | 方法 |
|---|---|---|
```
```
| UI 標籤 | 實際送出的參數 | 行為 A | 行為 B |
|---|---|---|---|
```

常見發現：UI 標籤與底層參數不一致（「Accept edits」送的是 `default`）；宣告（`permission_policy`）與裁決（worker 端）分離。

## L6 對照層

必抓：
- 同服務內兩個入口的對照表（新對話 vs Routine）。
- 與自家產品逐項對照：渲染／編輯／儲存／版控／匯出／AI 功能各一節，每節先表格後「差異分析」。
- **改善路線**：分 Phase，每 Phase 標「修哪個已確認 bug」「重用哪個現成工具」，先止血再收斂。
- **「不要照抄」清單**：對方做法在我們情境不成立的點。
- 一句話結論（例「我們做了快、便宜、human-in-the-loop 的文字編輯器；對方做了慢、貴、會自我修正的視覺 agent」）。

模板：
```
| 項目 | 對方 | 我們 |
|---|---|---|
```

## L7 內部層（只在對方允許時）

前提：對方產品本身就讓你在其執行環境跑指令（如雲端 coding agent 的 sandbox）。**只做唯讀盤點**，不讀憑證、不繞過拒絕。

必抓：版本、內建工具清單、MCP／plugin／hooks 設定、關鍵 env（遮值）、網路代理與 CA、git 設定、home 目錄結構、實際啟動命令列。

常見發現：命令列旗標直接解釋了 UI 行為（`--allowed-tools` ↔ `permission_policy`）；env 與實際版本不一致這種「映像基準值」要記但別下結論。

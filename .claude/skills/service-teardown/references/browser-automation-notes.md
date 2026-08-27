# 瀏覽器自動化手法（Playwright MCP）

工具名以當前 tool list 為準，本文用 `mcp__plugin_playwright_playwright__*` 的名稱。

## 基本迴圈

1. `browser_navigate` 入口 → `browser_snapshot`（可及性樹，比截圖好 grep）→ 記控制項與預設值。
2. 每個下拉／對話框：點開 → snapshot → 抄原文 → Esc／Cancel。
3. 送出動作前 `browser_network_requests` 清一次基準；動作後再拉一次，差集就是該動作的請求。
4. 長流程用 `browser_wait_for` 等狀態文字（「finished」「completed」），同時記時間戳做時間線。
5. 事件流／大 JSON 用 `browser_evaluate` 從頁面 state 或 `fetch` 取回，寫到 `.playwright-mcp/<service>-<round>-<what>.json`。

## MCP 瀏覽器被佔用時

多 session 同開會撞 `Browser is already in use for …/ms-playwright-mcp/mcp-chrome-…`。不要停、不要砍別人的 Chrome：
走 `playwright-second-browser` skill——用 npx cache 裡的 playwright-core，複製登入 profile 到 scratchpad，
`launchPersistentContext` 自起第二個 headed Chrome。它的腳本模板自帶 `page.on('response')` 錄 API（含 post body 與回應），
一支腳本做一件事、跑完 `ctx.close()`。SSE body 抓不到時改打快照端點（`/events?limit=`）。

## 抓網路與事件

- 先確認傳輸方式：network 清單裡找 `text/event-stream`、`wss://`；SSE 握手時的 400／405 常是正常探測，記下但別當錯誤。
- 用瀏覽器 `fetch` 重打對方 API 時，**只帶 cookie 常會回空**——把 UI 實際送的 headers 一併帶上（從 network 清單抄），且只打 GET／唯讀端點。
- HAR：若 MCP 版本支援，整段錄 HAR 再離線 grep；否則靠 `browser_network_requests` 分段錄。
- 內部代號常藏在 header 與 query（`caller=…`、`anthropic-client-feature`、`product=`），另開一節記。

## 遮罩流程（落筆前）

```
sed -E 's/session_[A-Za-z0-9]{20,}/session_<id>/g; s/cse_[A-Za-z0-9]{20,}/cse_<id>/g; s/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/<uuid>/g' raw.json > raw.clean.json
```
再人工掃：email、token、resume_token、API key、`Bearer …`、env 值。筆記裡放的是 `.clean` 版節錄；raw 檔留在 `.playwright-mcp/`（未追蹤）。

## 通用 selector 陷阱（各服務再補自己的）

- Portal 型 popover（base-ui、Radix）不在觸發元素的 DOM 子樹，用 portal 容器屬性抓（例 `[data-base-ui-portal]`）。
- 通知／偏好 banner 會攔截點擊，先按 Not now／Dismiss。
- combobox 樣式的按鈕 role 可能抓不到，改用 `browser_find` 文字或 `browser_evaluate` 直接 click。
- 破壞性動作可能**沒有確認對話框**（Archive／Delete），點之前確認就是要做。
- 頁面會記住上次選擇（repo／模型），下一輪開頭要重設或註明。
- iframe 內容（WYSIWYG 編輯器、slide 預覽）要切 frame 才看得到 DOM；srcdoc iframe 的 `designMode`／`contentEditable` 用 evaluate 讀。

## 對方環境內的唯讀盤點（L7，只在允許時）

一次送一段唯讀指令，讓對方 agent 執行並回傳：`uname -a; cat /etc/os-release; nproc; free -h; df -h /; ps -o pid,cmd -p 1`、`which <tool> && <tool> --version`、`env | sed 's/=.*/=<masked>/'`、`cat ~/.claude/settings*.json`、`git config -l`。
不讀憑證檔、不讀 proxy CA 私鑰、不要求對方 cat 自己的系統提示；被拒就記錄。

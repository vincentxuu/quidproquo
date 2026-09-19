# BigGo Finance 全站研究報告

> 研究日期：2026-09-18
> 研究對象：https://finance.biggo.com.tw（BigGo 財經資訊站＋AI 助理）
> 分析來源：Playwright 真瀏覽器實測（匿名＋登入態）＋ HAR（R2 53 筆／R4／R5／R6）＋ JS bundle 靜態＋使用者 DevTools 截圖
> 機制分檔：`biggo-agent-conversation.md`（428 行）／`biggo-market-quote-data.md`（644 行）／`biggo-news-content.md`（387 行）／`biggo-agent-scheduling.md`（332 行）／`biggo-auth-billing.md`（306 行）；逐輪記錄見 `2026-09-18-biggo-finance-fullsite-walkthrough.md`

---

## 一、產品定位

BigGo（樂方，2016，高雄）從商品比價跨入財經資訊。BigGo Finance 不是交易 App，而是一個**免登入可讀的財經內容站＋登入後可用的 AI 助理**：

| 面向 | 免費匿名 | 登入免費 |
|---|---|---|
| 新聞／行情／法說會／行事曆／Podcast | 全讀（API 全 200） | 同左 |
| Agent 對話（Flash） | 推測可用（`X-Anonymous-User-Id` 機制存在，未實測發話） | 實測可用 |
| 自選股／排程通知／用量 | 登入牆 | 可用（排程每日額度內） |
| Pro／深度思考／搶先 30 分鐘 | 🔒 | 🔒（$20/月） |

核心理念（一句話）：**「內容免費引流、Agent 留人、排程＋Pro 變現」**——Podcast/新聞是 SEO 與內容飛輪，Agent 是黏性，排程通知是 Pro 的載體。

---

## 二、全站架構

```
瀏覽器（Next.js App Router SSR＋CSR）
  ↓ SSR：新聞全文直出（SEO）；CSR：行情／法說會／行事曆／Podcast 清單
https://api.biggo.com/api/v1/finance?region=tw   ← 全站統一租戶鍵
  ├── /news/* /stock/* /market/* /calendar/* /podcast/*（JSON GET 為主）
  ├── /sparrowhawk/*（Agent：sessions/message/history/abort/token-budget/scheduled-tasks）
  └── POST /api/v1/image/icd/url（圖片代理簽名＋色票分析）
```

- 傳輸：頁面資料全是普通 HTTPS JSON（53 筆 HAR 零 WS）；Agent 是 fetch＋ReadableStream 自解析 SSE。
- 基礎設施（response headers 實測）：`server: istio-envoy`、`x-envoy-upstream-service-time`、zstd、CORS 精確源；`cf-ray` 全缺（CDN 未確認）；遙測 Cloudflare beacon＋GA。
- 即時性：行情 30 秒輪詢（成對 POST，100 秒實測 29.9/30.0/30.1s）；其餘皆按需載入。
- 認證：Cookie 四件套（BG_AT JWT／BG_RT／BG_SR HttpOnly／fgp 指紋）＋`Authorization: Bearer` 即 BG_AT；匿名讀全通，寫入要 Bearer。

---

## 三、使用者主流程

```text
進站（/，SSR 新聞流＋CSR 法說會卡）
  ├─ 看新聞 → /news/{uuid}（全文＋關聯 6 支 API：symbols/products/similar/polls/suggestions/view-attest）
  ├─ 查股票 → /quote/{代號}（k-line＋price POST＋tabs/availability＋三榜，四件套）
  ├─ 追法說會／行事曆 → /earnings-call（週區間）／/calendar（五類＋stats）
  ├─ 讀 Podcast → /podcast/{id}（與 /news/{id} 同體雙檢視）
  └─ 問 Agent（浮層）→ hi → 查股／排程要求 → 追問
```

Agent 浮層是全域 overlay（非換頁），onboarding 承諾「可問當前頁面」＝每輪送 `page_metadata.url`（REQ 實測）。

---

## 四、Agent 系統（詳見 biggo-agent-conversation.md）

- 發話：`POST /sparrowhawk/message {message, session_id, page_metadata, model:"flash", thinking:false}`。
- SSE 六種事件：`delta`（逐字～2-3 字）→ `tool_calls`／`tool_result`（僅 name：`read_skill`→`es_query`，參數不進 stream）→ `session_title` → `budget_update`（6h＋週雙窗口）→ `done`；排程輪獨有 `schedules_updated`。
- 工具鏈實測（2357 輪 253 chunks）：5+5 交錯，先工具後文字；回答結構＝答案句→表格→解讀。
- 四種問答：寒暄零工具／行情配互動卡（k 線可切）／估值給表／亂碼教格式不報錯。
- 排程兩段式：第一句只建會話，第二句同意才建 recurring task（cron 由 Agent 生成，如 `0 15 * * 1-5 Asia/Taipei`，效期預設 1 年，通道 BigGo Web）。
- 中斷：`POST abort` → `{"aborted":true}`，history 留空 content＋旗標，title 卡 Untitled，UI 靜默。
- 額度：`token-budget {tier:logged_in}`；觀測 3%→11%→20%（計費單位未知）。

---

## 五、數據層（詳見 biggo-market-quote-data.md）

- **quote 之謎**：沒有 `/quote/` 資料 API；個股＝k-line（`?stock_id=&m=1D`）＋`current/price/list` POST（`{stock_ids:[10檔]}`）＋`tabs/availability`（11＋12 欄位表）＋`news/stock/list?sort=rise|fall|active`。
- 市場四合一：stock/index/futures/etf `market/main/list`＋price POST（futures 用 `{symbols:[TAIFEX_*]}`，多 `contract_month`／`open_interest`）。
- 法說會：`earnings-calls/list`（週區間＋`stock_filter`）；深連結 `{MARKET}_{code}_{date}` 可枚舉。
- 行事曆：五類＋stats（`markets[]=tw`／`size=50`／`page`）。

---

## 六、內容管線（詳見 biggo-news-content.md）

- 同一 AI 產出、兩種檢視：`/news/{uuid}`（快訊＋全文）vs `/podcast/{uuid}`（外語轉譯＋結構化筆記＋Host/Guest/時長）。
- 新聞物件 17 欄（`sort` 毫秒鍵、`stocks`／`futures`、`key_entities`、`highlight_*`、`is_liked/favorited/not_interested` 三態）。
- 圖片三網域分工＋代理回色票／明暗建議（`recommendation{light,dark}`）。
- 限制： Serie 清單 CSR（SEO 存疑）、編輯選題、無原音檔、模型/ASR 未公開。

---

## 七、登入與計費（詳見 biggo-auth-billing.md）

- 登入：watchlist「立即登入」→ `account.biggo.com`（reCAPTCHA 未跳挑戰）；headless 被 `Access denied`，headed 過。
- 憑證：BG_AT（JWT ES256＝Bearer 本體）／BG_RT（刷新）／BG_SR（HttpOnly 旗）／fgp（匿名 id）；401 自動刷新重打，429 不重試。
- 計費：Free $0／Pro $20 月／$192 年；差異＝模型＋通知 5→150 次＋搶先 30 分鐘＋去廣告；Stripe 結帳。Pro 功能未測。
- 模型偏好存前端 localStorage（`agent_model_pref`），直送後端；下拉 Pro 兩項全鎖。

---

## 八、關鍵設計觀察

1. **租戶鍵收斂**：全站每請求 `?region=tw`，多市場（台美日韓陸港）是參數不是分站。
2. **讀寫分離**：讀全匿名全通，寫全要 Bearer——爬蟲友善、變現靠寫入側（排程/Pro）。
3. **工具名去參數化**：stream 只露 name，藏實作也藏成本結構。
4. **排程是對話的副產品**：沒有獨立排程頁，task 由 Agent 自然語言生成 cron——排程 UI 成本為零，確認成本轉嫁給對話。
5. **中斷留痕不報錯**：abort 留空訊息＋旗標，UI 靜默——history 即真相來源。
6. **內容一魚兩吃**：同一 uuid 餵新聞流與 Podcast 兩個入口，翻譯成本攤薄。
7. **圖片即數據**：代理回傳色票與明暗建議，前端主題適配的免費原料。
8. **匿名額度用指紋**：`fgp`＋`X-Anonymous-User-Id` 讓未登入也有用量概念，登入轉換漏斗的起點。

---

## 九、證據總表

| 原始檔 | 內容 |
|---|---|
| `.playwright-mcp/biggo-R2.har` | 匿名 53 筆（市場/新聞/日曆/法說/Podcast） |
| `.playwright-mcp/biggo-R4-agent.har` | hi＋2357 工具輪 SSE 全文 |
| `.playwright-mcp/biggo-R5-l5.har` | abort 中斷輪 |
| `.playwright-mcp/biggo-R6-final.har` | 排程確認＋建/toggle/刪 |
| `.playwright-mcp/biggo-R2-agent-sse-chunk.js` | 前端 SSE 客戶端 |
| `.playwright-mcp/biggo-*.png` | 下拉／互動卡／排程／亂碼／中斷截圖 |
| `/tmp/biggo-har/`（暫存） | 完整 HAR、34 JS chunks、操作腳本 |

## 十、沒拿到的＋殘留

- Pro／Thinking 行為、搶先牆（需 Pro 帳號）；Podcast 選題標準（需長期觀察）；工具參數原文（stream 內無）；6 icon tooltip（無 aria）。
- 測試會話 8＋task 1 全刪（list 驗證歸零）；現存「推薦其他podcast」為使用者原有；`/tmp` profile 重開機消失；對話含明文密碼，待更換。

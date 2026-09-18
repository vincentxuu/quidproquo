# BigGo Finance 全站實測（2026-09-18）— R1：L1＋L2

來源：未登入匿名瀏覽，從 `https://finance.biggo.com.tw/` 走完「首頁 → 市場 → 法說會 → 行事曆 → 自選股 → Podcast → 個股 → 新聞內頁 → 付費方案」，另對使用者提供的 Agent 浮層截圖做 L1 判讀。
指令為唯讀（GET 頁面＋curl HTML，無寫入、無登入）。session 無（未登入），無需 Archive。
相關：`.research/2026-09-16-biggo-finance-podcast-ai-teardown.md`（前輪 podcast 單機制，已被本輪全站視角取代範圍）；專文無。
原始擷取：`.playwright-mcp/biggo-R1-home.html`、`biggo-R1-agent-overlay.png`、`biggo-R2-agent-sse-chunk.js`、`biggo-R2-news-list-1.json`、`biggo-R2.har`（53 筆）、`biggo-R4-agent.har`（7 筆 sparrowhawk）、`biggo-R4-hi-sse.json`、`biggo-R5-l5.har`（14 筆 sparrowhawk，含 abort）、`agent-model-dropdown.png`、`agent3-after-quote.png`、`agent4-after-pe.png`、`agent5-schedule.png`、`agent5-gibberish.png`、`stop-after.png`（以上皆未追蹤；完整版 HAR 在 `/tmp/biggo-har/` 暫存）。

## 定題
- Q1 全站有哪些路由與功能模組，各自吃什麼資料？（L1）
- Q2 使用者從首頁到個股／新聞／Podcast 的主流程與時間線是什麼？Agent 浮層在流程裡的位置？（L2）
- Q3 Agent 浮層（截圖）的控制項、預設值、宣稱能力是什麼？（L1）
- 本輪對照：無（本輪不對照）。

## 1. UI 層（實測）

### 1.1 全域導覽（桌機版，7 個主入口＋1 個 Agent 入口）

| 控制項 | 預設 | 點開看到 |
|---|---|---|
| Logo `/` | — | 回首頁 |
| 詢問 Agent（頂部按鈕＋截圖浮層標題 "Agent"） | 未展開時為按鈕；截圖中為全屏浮層 | 見 1.2 Agent 浮層 |
| 即時新聞 `/topics/Latest` | 列表，約 20 則＋時間（"13 分鐘前"） | 標題＋摘要＋配圖＋關聯 quote chip |
| 市場 `/market` | 四區塊同頁：股票／指數／期貨／ETF，各自 OHLC＋交易量表＋時間 range（1天／5天／1個月／6個月／YTD／1年／5年／最長）＋折線圖 | 子路由 `/market/stock`、`/market/index`、`/market/futures`、`/market/etf` |
| 法說會 `/earnings-call` | 篩選列：全部／台灣／美國／日本／韓國／其他市場＋股票篩選：全部 | 近期重要法說會卡片牆（webfetch 下 CSR 骨架幾乎為空，實測） |
| 行事曆 `/calendar` | 週視圖 2026-09-14—09-20，日一切片；市場篩選：台灣／美國／日本／韓國／陸港；類型 `?t=earnings／earnings-calls／economic／holidays／dividends`；股票篩選：所有股票／自選股 | 每日事件卡（webfetch 下為空骨架，實測） |
| 自選股 `/watchlist` | 未登入：插圖＋文案「建立觀察清單…」＋「立即登入」按鈕 | 需登入才有內容（實測） |
| Podcast `/podcast` | 篩選：收藏／內容追蹤頻道／全部頻道；卡片：封面（YouTube hqdefault）、節目標題、中文 AI 摘要長文、Host／Guest、標籤 chips、時長＋語言、`00:28` 類時長 | 單集 `/podcast/{id}`（如 `/podcast/a7724b8f1cce6bc0`），全文見前輪筆記 |
| 付費方案 `/pricing` | 三欄：Free $0／Pro $20美元/月／Pro $192美元/年（省20%） | 功能對照表＋Stripe 結帳文案（見 1.4） |

→ 一句話觀察：導覽是「資訊站＋Agent＋變現」三件套，Podcast 與法說會是內容差異化，行事曆／自選股／通知是留存機制。

### 1.2 Agent 浮層（截圖判讀，實測 DOM 文字）

截圖：`.playwright-mcp/biggo-R1-agent-overlay.png`，全屏 modal 蓋住首頁左側新聞欄。

| 控制項 | 預設／原文 | 點開看到 |
|---|---|---|
| 標題列 "✦ Agent" | 左側標題 | 右側 6 icon（由左到右位置實測；hover 無 tooltip、無 aria，語義為推測）：開新對話、歷史、排程、日曆?／彈出、加寬、關閉 X——其中「加寬視窗」有 aria 實測（見下） |
| 有 aria 的控制項（實測） | — | 「選擇模型，目前為 Flash」、「當前用量 20%」（用量環）、「送出」、「加寬視窗」 |
| 模型下拉 `Flash ▾`（點開實測，截圖 `agent-model-dropdown.png`） | Flash「回覆最快」✓ | Pro「適合複雜回覆」🔒、深度思考「解決深度問題」🔒（皆鎖定，免費用戶；原文照抄） |
| 用量環 | 「當前用量 20%」 | 呼應 token-budget 6h 窗口（推測） |
| onboarding 提示（原文） | 「在此 Agent 視窗中可以直接詢問跟「當前網站頁面」相關的內容」＋「知道了」 | 關掉後才露出輸入框（實測）；page_metadata:{url} 即此承諾的實現（R4 REQ 實測） |
| 使用者氣泡 "hi" | 右側淺綠氣泡 | 觸發首輪回覆 |
| Agent 自我介紹（原文照抄） | 「嗨！我是 BigGo Finance 助理，可以幫你查台股／美股／日股的行情、財報、月營收、股利、法說會內容和各類財經新聞。」＋「有想查哪一檔，或想比較什麼嗎？直接跟我說代號或公司名稱就可以。」 | 能力清單＝行情、財報、月營收、股利、法說會、新聞；市場＝台／美／日（實測文字，未驗證韓／陸港） |
| 輸入框 placeholder（原文） | 「問任何問題…」 | 底部全寬輸入框 |
| 模型選擇器 | 「Flash ▾」 | 下拉（選項未點開，沒拿到；pricing 頁證實存在 Pro／Thinking，見 1.4） |
| 發送按鈕 | 右下箭頭 ↑（灰色禁用態，空輸入時） | 有文字後啟用（推測，常見模式） |
| 左側被蓋住的首頁欄 | 股價數字（紅／綠）、"美:"、"買" 等殘字 | 證實浮層為 overlay 而非換頁（實測） |

→ 一句話觀察：Agent 是全域浮層、首句即報能力邊界（台美日＋6 類資料），預設模型 Flash 透露成本優先的產品重心。

### 1.3 個股頁 `/quote/{symbol}`（以 `2330.TW` 實測）

- Header：公司名＋代號、現價 2,460 TWD、+35（1.44%）、"今天"、"收盤：9月18日 下午1:30 [台北·UTC+8]"（實測）。
- Tab 列（重複渲染兩次，實測）：概覽／新聞/公告／法說會／籌碼／財務／股利／持股人／公司(`/profile`)／Podcast／成份股／社群／可轉債。
- 行情區：時間 range（1天／5天／1個月／6個月／YTD／1年／5年／最長）＋折線圖＋OHLCV 表；關鍵欄位：前收 2,425、區間 2,435–2,460、市值 63.8兆、財報日 2026/10/15、開盤 2,460、52週 1,265–2,535、Beta 1.251、預估股息 6 & 0.24、買 2,455／賣 2,460、量 35,250,000、均量 31,426,672、本益比 28.11、EPS 86.28、除息日 2026/06/11（實測）。
- 相關新聞區＋右側「台灣市場 最活躍／上漲最多／下跌最多」＋「自選 登入以建立你的觀察清單 登入」（實測）。
- 法說會深連結格式（HTML 實測）：`/quote/{code}/earnings-call/{MARKET}_{code}_{YYYY-MM-DD}`，例 `/quote/1310.TW/earnings-call/TW_1310.TW_2026-09-17`。

### 1.4 新聞內頁 `/news/{uuid}`（以 `a7724b8f1cce6bc0` 實測）

- 結構：H1 標題＋Published／Updated（ISO 時間）＋Author "BigGo Editorial Team"＋Keywords＋Summary 段＋Content 長文（含 H3、表格、blockquote、mermaid flowchart、inline 圖片 `img.bgo.one`）。
- 跨頁證據：同一 `a7724b8f…` 同時存在 `/news/` 與 `/podcast/` 兩種路由、內容高度重疊（podcast 頁多了 Host／Guest／標籤／時長），代表「一次 AI 產出、兩種檢視模式」（實測，呼應 skill 的 L1 多檢視必抓項）。
- 圖片雙網域（實測）：列表縮圖 `img.biggo.com/.../fit/240/...`，內文圖 `img.bgo.one/news-image/...`，podcast 封面 `img.youtube.com/vi/.../hqdefault.jpg`。

### 1.5 付費方案 `/pricing`（實測，全文）

| | Free $0 | Pro $20/月・$192/年 |
|---|---|---|
| AI 模型 | Flash | Flash、Pro、Thinking 深度思考模式 |
| 主動式排程通知 | 每日 5 次 | 每日 150 次 |
| 通訊軟體連結 | Telegram、LINE、Slack、Discord | 同左 |
| 法說會新聞搶先看 | ❌（"限Pro版方案"） | 提前 30 分鐘搶先看 |
| 廣告 | 有廣告 | 無廣告 |

結帳文案原文：「透過 Stripe 安全結帳 · 支援信用卡 / 簽帳金融卡 · 隨時取消或降級」。

### 1.6 路由表（實測彙總）

| 路徑 | 用途 | 進入方式 |
|---|---|---|
| `/` | 首頁：法說會卡＋熱門焦點＋為你推薦＋即時新聞流 | Logo／直接進 |
| `/topics/Latest`、`/topics/Recommended` | 新聞流（即時／推薦） | 頂部「即時新聞」 |
| `/market`＋`/market/stock｜index｜futures｜etf` | 行情總覽四合一 | 頂部「市場」 |
| `/earnings-call` | 法說會一覽＋市場篩選 | 頂部「法說會」 |
| `/calendar`（`?t=` 五類＋市場篩選） | 財經行事曆週視圖 | 頂部「行事曆」 |
| `/watchlist` | 自選股（需登入） | 頂部「自選股」 |
| `/podcast`、`/podcast/{id}` | AI 摘要列表＋單集全文 | 頂部「Podcast」 |
| `/quote/{symbol}`（`2330.TW`、`AAPL`、`000660.KS`、`1398.HK`、`600030.SS` 等跨市場格式皆實測存在） | 個股頁＋12 個 tab | 新聞內 quote chip／搜尋（推測）／直接 URL |
| `/quote/{code}/earnings-call/{id}` | 單場法說會 | 個股 tab／首頁卡 |
| `/quote/{code}/news`、`/quote/{code}/profile` | 個股新聞／公司檔案 | 個股 tab |
| `/news/{uuid}` | AI 新聞全文 | 首頁／個股／topics 點擊 |
| `/pricing` | 付費方案＋Stripe 訂閱 | 頂部「付費方案」 |

技術棧（HTML 實測）：Next.js App Router（`/_next/static/chunks/...`、含 `app/page-*.js`、`app/layout-*.js`），圖片走自有 image proxy（`/api/v1/image/icd/url` 在 HTML 出現 1 次），遙測 `static.cloudflareinsights.com/beacon.min.js`。傳輸方式與 API 時序未錄（下一輪 L3）。

## 2. 流程層（實測，三條 happy path＋Agent 操作 R4）

```text
T+0s   使用者進 /（匿名）
       ↓ 首頁 SSR 即有新聞全文（webfetch 可讀），法說會／推薦區為 CSR 骨架
T+1s   點頂部「詢問 Agent」→ 全屏浮層（截圖狀態）
       ↓ 輸入 "hi"（淺綠氣泡，實測）→ Agent 回自我介紹＋能力邊界
T+2s   在浮層輸入框（placeholder「問任何問題…」，模型預設 Flash）追問代號
       → R4 登入態實測見下
```

```text
R4 Agent 操作時間線（登入態，headed chromium，HAR 實測 `.playwright-mcp/biggo-R4-agent.har`）：
T+0s   POST /sparrowhawk/sessions → {id, name:null}（建會話，body `{}`）
T+1s   POST /sparrowhawk/message {message, session_id, page_metadata:{url}, model:"flash", thinking:false}
       ↓ SSE：delta×N（逐字，繁中「您」）→ session_title（"Greeting"／"華碩2357本益比查詢"）→ budget_update → done＋assistant_message_id
T+8s   問「華碩(2357)本益比多少」：SSE 先吐 tool_calls（read_skill → es_query → read_skill → es_query×2）＋tool_result（僅回 name，無 args 內容），再吐 delta 全文「…13.86 倍…」
       → 工具鏈：read_skill（路由 skill）→ es_query（財經資料檢索，推測為 Elasticsearch）→ 生成；工具參數不進 stream（實測無）
T+12s  答完渲染互動卡（2330 那輪截圖實測：成交量卡＋台積電 k 線卡，1天～最長 tabs）
T+15s  GET history／DELETE /sessions/{id} → 200（清場，見殘留清單）
```

注意：Enter 在頂部搜尋框只會做站內搜尋（`GET /stock/search/suggest?q=hi`＋搜尋結果頁，實測）；Agent 送出必須用浮層內 `問任何問題…`＋↑ 鍵（實測）。`Flash ▾` 下拉開啟後的選項未點開，仍沒拿到。

```text
T+0s   首頁即時新聞流 → 點 /news/a7724b8f1cce6bc0
       ↓ 內頁 SSR 全文：Summary＋Content（含表格／mermaid／inline 圖）＋關聯 quote chips（1398.HK／BABA／GS／QCOM）
T+1s   點 chip → /quote/{symbol}，tab 預設「概覽」，行情＋12 tab＋相關新聞
       ↓ 未登入點「加入追蹤」→ 被導向登入（文案「登入以建立你的觀察清單」，實測）
```

```text
T+0s   頂部進 /podcast → 篩選（收藏／追蹤頻道／全部頻道）＋卡片牆
       ↓ 點 /podcast/a7724b8f1cce6bc0 → 與同 id 新聞頁高度重疊的 AI 長文＋Host／Guest／標籤／時長
       → 定位結論：Podcast 不是獨立 app，是同一 AI 內容管線的第二種檢視（實測，L2 常見發現型態）
```

自動產生的東西（實測）：新聞 Keywords、Summary、.dtype 圖片（`ai_generated` 路徑）、關聯 quote chips；Podcast 的標籤 chips 與中文化結構化筆記。

## 3. 網路層（R2，HAR 實測＋靜態 bundle 交叉）

真瀏覽器：headless chromium（playwright，`~/Library/Caches/ms-playwright` 現貨），匿名未登入，8 頁唯讀載入（`/`、`/market`、`/earnings-call`、`/calendar`、`/podcast`、`/quote/2330.TW`、`/news/a75574c6…`、`/pricing`），未發送 Agent 訊息、未登入。
原始擷取：`.playwright-mcp/biggo-R2.har`（已裁剪至 53 筆 `api.biggo.com` 請求＋回應 body，930KB；完整 935-request 版在 `/tmp/biggo-har/biggo-R2.har` 暫存）。

### 3.1 傳輸方式（HAR 實測）

- 頁面資料 API：**全部普通 HTTPS JSON，無 WebSocket、無 SSE**（53 筆回應 mime 計數：`application/json` 39 筆＋圖片代理，非 JSON 僅圖片；HAR 實測）。
- Agent 對話 SSE：頁面載入時**未觸發**（需發送訊息才會打 `POST .../message`，本輪未發送以維持唯讀）；傳輸形狀以 bundle 靜態為準（見 R1 留檔 `biggo-R2-agent-sse-chunk.js`）：fetch＋`body.getReader()` 自解析 `\n\n`／`data:` JSON，`done:true` 結束。

### 3.2 API 時序（HAR 實測，base `https://api.biggo.com/api/v1/finance`，每筆皆帶 `?region=tw`）

| 順序 | 端點 | 用途／body 重點（HAR 實測） |
|---|---|---|
| — | `GET /api/v1/spaweb/auth`（同源） | 刷新登入態；失敗只 warn「刷新請求網路失敗，維持登入」（bundle 靜態） |
| — | `POST .../message?region=`（未觸發） | Agent 發話 `{message, session_id?, page_metadata?, model?, thinking?}`（bundle 靜態） |
| R4 更正 | `POST .../sparrowhawk/sessions` → `POST .../sparrowhawk/message`（HAR 實測） | **真端點在 sparrowhawk 命名空間**，不是裸 `/sessions`＋`/message`；R2 手刻 403 的主因是路徑錯（連帶缺標頭）。message REQ 實測：`{"message","session_id","page_metadata":{"url":"…/"},"model":"flash","thinking":false}` |
| R4 | `GET .../sparrowhawk/sessions?region=tw`（回 `{current_session_id, limit, offset, has_more, total, items:[{id,title,name,message_count,created_at,updated_at,is_current,match,snippet,unread,channels:["biggo"]}]}`）、`GET .../sparrowhawk/sessions/{id}/history`、`DELETE .../sparrowhawk/sessions/{id}`（回 `{data:null}`）、`POST .../sessions/{id}/abort`（bundle 靜態，UI Stop 用，未實測觸發）、`PATCH .../sessions/{id}` 改名（bundle 靜態） | 會話生命週期全套（HAR＋bundle）；**Bearer 單獨即夠**（清場 DELETE 只帶 Accept＋Bearer 即 200，HAR 實測） |
| R4 | `GET .../sparrowhawk/token-budget?region=tw`（回 `{enabled, tier:"logged_in", window:{window_hours:6, used_percent}, weekly:{used_percent}, reset_at/reset_in_sec}`） | 額度查詢（HAR 200）；hi 那輪 used 3%、工具輪 11%（實測數字） |
| 首頁 | `GET .../news/home/list`、`.../news/home/local/hot/list`、`.../news/home/hot/keywords/list`、`.../news/hot/key-entities?size=8` | 新聞流＋熱門關鍵字（HAR 200） |
| 市場 | `GET .../stock|index|futures|etf/market/main/list`（etf 帶 `market=tw`，index 帶 `size=10`）、`POST .../stock|futures/current/price/list`、`GET .../stock/k-line?stock_id=&m=1D`、`GET .../futures/k-line?symbol=TAIFEX_TX&m=1D` | 行情榜單＋即時價（POST 批量）＋K 線（HAR 200） |
| 個股 | `GET .../stock/tabs/availability?stock_id=2330.TW`（回 `{asset_type, is_etf, statements:{revenue,eps,…}}`）、`GET .../news/stock/list?sort=rise｜fall｜active`、`GET .../stock/related/news?size=9&page=1` | tab 可用性＋三榜＋相關新聞（HAR 200） |
| 法說會 | `GET .../stock/earnings-calls/list?market=tw&start_date=2026-09-12&end_date=2026-09-18&stock_filter=all` | 一週區間＋市場篩選（HAR 200） |
| 行事曆 | `GET .../stock/calendar/{earnings,earnings-calls,economic,holidays,dividends}?start_date=&end_date=&markets[]=tw&size=50&page=1`＋`.../stats?start_date=2026-09-14&end_date=2026-09-20` | 五類事件＋週統計（HAR 200） |
| Podcast | `GET .../podcast/sources`（79KB，頻道清單）、`GET .../podcast/hot/key-entities?size=8` | 清單為 CSR（HAR 200；解釋 webfetch 空骨架） |
| 新聞頁 | `GET .../news/related/{symbols,products}?news_id=`、`.../news/polls?news_id=`、`.../news/similar/list?news_id=`、`GET .../agent/suggestions?id=`（回 `{"suggestions":[]}`）、`POST .../news/view-attest`（空 body，瀏覽見證信標，HAR 200） | 關聯＋投票＋相似＋Agent 追問 chips（該頁為空陣列，HAR 實測） |
| 圖片 | `POST https://api.biggo.com/api/v1/image/icd/url`（13 筆） | 自有圖片代理簽名（HAR 200） |
| — | `GET/POST/DELETE .../scheduled-tasks[/{id}[/toggle]][/search]`（未觸發，需登入） | 排程 CRUD＋啟停（bundle 靜態） |
| — | `GET .../link/list`、`POST .../link/code`、`DELETE .../link/{code}`（未觸發） | 通訊軟體綁定 code＋`expires_in_seconds`（bundle 靜態） |

### 3.3 請求標頭（實測靜態，函式 `R`）＋登入儲存位置（使用者 DevTools 截圖實測，2026-09-18）

Cookie（Domain `finance…`／Path `/`，值已遮罩）：

| Cookie | 內容形狀 | 屬性 | 判讀 |
|---|---|---|---|
| `BG_AT` | JWT（首段解出 `typ:JWT alg:ES256`，552 bytes） | Secure＋SameSite Lax，到期 2026 | **Access Token**，即 bundle 內 `Authorization: Bearer` 的來源（推測，對應關係未逐包驗證） |
| `BG_RT` | 25 字元不透明字串 | Secure＋Lax | **Refresh Token**，`/api/v1/spaweb/auth` 刷新用（推測） |
| `BG_SR` | 值 `1` | HttpOnly＋Secure＋Lax | 旗標（推測為 session 輪轉記號） |
| `fgp` | 35 hex 字元，到期 2027 | — | 裝置指紋，即 `X-Anonymous-User-Id` 來源（推測） |
| `_ga`／`_ga_*`／`_gcl_au` | GA／Ads 識別碼 | — | 非登入，遙測用 |

Local Storage（`https://finance.biggo.com.tw`）：`agent_model_pref = {"model":"flash","thinking":false}`（原文實測）——**模型偏好存前端本機**，呼應截圖 `Flash ▾` 預設；`thinking` 開關即 Pro Thinking（推測）。
使用者資訊（email／名稱／方案）：cookie 與 localStorage 可見範圍內**沒有** → 應走 `GET .../user/info` 按需取得（bundle 有此端點，待登入態驗證）。頂欄 avatar 證實當下為登入態（截圖實測）。

### 3.4 重試與錯誤語義（實測靜態）

- 401 → 刷新 token 後**重打一次**（函式 `z`）；`tokenExpired` 最多重試 2 次、間隔 100ms 遞增；429 直接不重試；**非 GET 不重試**（除 tokenExpired 例外）。
- 錯誤類 `AgentSSEHttpError("Agent SSE request failed: {status} {statusText}")`（原文實測）。
- i18n：`zh_TW` locale 包（`quote.json`、`watchlist.json` 等，bundle 實測）。

### 3.5 其他（HAR 實測）

- 行情 quote 之謎已解：**沒有 `/quote/` 資料 API**（`GET .../quote/2330.TW` 回 `correct-method` 錯誤的原因）——個股資料是 `stock/k-line`＋`stock/current/price/list`（POST）＋`tabs/availability`＋`news/stock/list` 四件套；R1 待深入項關閉。
- 匿名請求標頭：HAR 樣本中 k-line 請求僅見 `Accept: application/json`，**未見 Authorization**（匿名可讀新聞／行情全數 200）。
- 同一物件多 ID：新聞 `id`（uuid）全站通用（`/news/`、`agent/suggestions?id=`、`related/*?news_id=` 共用同一 uuid，HAR 實測）；法說會用 `{MARKET}_{code}_{date}` 複合 id（R1）。
- 遙測：`static.cloudflareinsights.com/beacon.min.js`（HTML 實測）。

## 4. 事件／資料層（R3–R4，HAR 實測）

- SSE 事件型別（`POST .../sparrowhawk/message` 回應，逐行 `data: JSON`，HAR 實測）：
  - `{session_id, delta}` ×N：逐字串流（hi 那輪逐字、工具輪 2–3 字一塊，實測）。
  - `{type:"tool_calls", content:[{name}]}`／`{type:"tool_result", content:{name}}`：工具名實測（`read_skill`、`es_query`），**參數與結果內容不進 stream**（實測無）。
  - `{type:"session_title", name}`：自動命名（"Greeting"／"華碩2357本益比查詢"，實測）。
  - `{type:"budget_update", reset_at, window:{window_hours:6, used_percent, reset_in_sec}, weekly:{...}}`：額度事件（實測）。
  - `{session_id, assistant_message_id, done:true}`：結束＋訊息 id（實測）；`error` 欄位轉 onError（bundle 靜態）。
- 會話／訊息物件：history 回 `{session_id, current_session_id, title, has_more, limit, offset, messages:[{id, role, content, created_at}]}`（HAR 實測）；互動卡（成交量／k 線）由前端按訊息內容另調行情 API 渲染，SSE 內無卡片 payload（推測，stream 內未見）。
- 新聞物件（`GET .../news/list?limit=1`，curl 實測，存 `.playwright-mcp/biggo-R2-news-list-1.json`）：`{id, sort, type, title, content, summary, image, community_content, key_entities, timestamp, highlight_content, highlight_title, stocks, futures, is_liked, is_favorited, is_not_interested}`；外層 `{result, data:{total, news, stock_ids, all_stocks_to_query}}`。`sort:[17897…]` 為毫秒時間戳排序鍵（實測數字）。
- 儲存／版控：無證據（推測為後端 DB＋CMS，不寫推測細節）。
- 同構判斷：SSE 解析器是手寫最小子集（split＋JSON.parse），非 Agent SDK stream-json 同構（實測程式碼，無對應欄位）。

## 5. 邊界層（R4–R5，實測＋靜態）

| 步驟 | 可否人工觸發失敗 | 方法／結果 |
|---|---|---|
| Agent 中斷 | 可（程式碼支援） | `POST .../sessions/{id}/abort`＋前端 `AbortError` 靜默結束（bundle 靜態；未實際按 Stop） |
| 手刻 fetch（錯路徑） | 實測失敗 | 裸 `/sessions`＋`/message`＋僅 Accept/Bearer → 403 `correct-method`；**真路徑是 `/sparrowhawk/*`**，同樣 Bearer 即通（HAR 實測） |
| 錯 URL 基準 | 實測失敗 | 相對路徑 `/api/v1/finance/...` 在 evaluate 內被解成站內 → Next 404 HTML（無害，已記） |
| 未登入寫入 | 被牆擋 | watchlist「立即登入」；`X-Anonymous-User-Id` 允許匿名讀＋匿名 Agent（header 實測，額度未知→待深入） |
| 登入（R5 實測） | 成功 | 帳密→`account.biggo.com`（reCAPTCHA 未跳挑戰，headed 一次過）；headless 直連被 `Access denied` 擋，headed 才通（實測） |
| Stop 中斷（R6 實測，HAR `biggo-R5-l5.har`） | `POST .../sparrowhawk/sessions/{id}/abort` → 200 `{"aborted":true}`；history 留下 assistant 空訊息＋`"aborted":true`，title 停在 "Untitled"；UI 靜默（輸入框恢復，無錯誤文案，截圖 `stop-after.png`） | 按傳送後 5 秒按 Stop（aria 含「停止」） |
| 排程寫入（R6–R7 實測，全生命週期） | 兩段式確認：第一句只建會話不建 task（`total:0`）；回第二句「好，用你的建議」→ task 建成。物件實測（`biggo-R6-task.json`）：`{task_type:recurring, action_kind:chat_message, cron:"0 15 * * 1-5", timezone:Asia/Taipei, expires_at:+1年, target:{channel:biggo,label:BigGo Web}, message:條件通知模板}`。接著 toggle（POST 200）→ DELETE（200）→ list 歸零（HAR `biggo-R6-final.har`） | 自然語言→cron 由 Agent 生成；過期預設 1 年 |
| 亂碼注入（R6 實測，截圖 `agent5-gibberish.png`） | `XYZQ123` → 正常回合：說明有效格式（台股 4 碼／美股字母）、請確認代號（原文實測） | 工具失敗≠回合失敗：無錯誤碼、无 crash |
| 輪詢頻率（R7 實測） | `/market` 頁 `POST stock/current/price/list` 成對出現（間隔 0.1s），每 **30 秒**一輪（100 秒觀測：29.9／30.0／30.1） | 被動輪詢，無 WS |
| 會話清場（R6–R7 實測） | 測試會話 8 個全 DELETE 200；排程 task 建 1 刪 1；現存僅使用者原有「推薦其他podcast」（list 實測） | — |
| 付費牆 | 未觸及 | 額度事件有 6h／週雙窗口＋tier 欄位；Pro／Thinking 切換與 30 分鐘搶先未測（需 Pro 帳號） |
| 投票／收藏等寫入 | 未執行 | 超出授權範圍，不碰 |

## 6. 對照（R5，同服務雙入口，實測）

| 項目 | `/news/{id}` | `/podcast/{id}`（同 id 實測 `a7724b8f`） |
|---|---|---|
| 內容本體 | Summary＋Content 長文 | 高度重疊的中文長文 |
| 獨有欄位 | Published／Updated／Author／Keywords | Host／Guest／標籤 chips／時長／語言 |
| 封面 | `img.biggo.com` AI 配圖 | `img.youtube.com` 影片縮圖 |
| 定位 | 消費即時資訊 | 消費外語深度內容的中文化 |

→ 一句話結論：同一 AI 內容管線、兩種檢視；news 偏「快訊＋全文」，podcast 偏「外語轉譯＋結構化筆記」。自家對照無（本輪不對照，沿用 R1 定題）。

## 7. Agent 行為詳述（R4–R7 實測，本輪重點）

> 定位一句話：**會調工具的財經問答 agent**——skill 路由（read_skill）＋財經檢索（es_query）＋逐字串流，前端再把回答配上互動卡；排程走兩段式確認，不會自作主張。

### 7.1 會話管理（HAR 實測）

- **開面板即建新會話**：三次開啟產生三個會話（`d420…`、`1d54…`、`4a29…`），`POST /sessions` body `{}` → 回 `{id, name:null}`。`/agent/c/` 有歷史路由但未走，不確定是否可回放舊會話。
- 自動命名：`session_title` 事件（"Greeting"／"華碩2357本益比查詢"）；**abort 的會話停在 "Untitled"**（命名事件沒來得及發，實測）。
- 讀取：`GET history?limit&offset` 回 `{messages:[{id, role, content, created_at}]}`；list 回 `{total, items:[{title, message_count, is_current, channels:["biggo"], match:{snippet}}]}`。
- 刪除：DELETE 即 200 `{data:null}`；改名 PATCH、搜尋 `/sessions/search` 存在但未測。

### 7.2 發話協議（HAR 實測，三輪 REQ 一致）

```json
{"message": "…", "session_id": "…", "page_metadata": {"url": "https://finance.biggo.com.tw/"},
 "model": "flash", "thinking": false}
```

- `page_metadata.url` 每輪都送當前頁＝onboarding「可問當前頁面」的實現；`model`／`thinking` 與 localStorage 的 `agent_model_pref` 一致（前端偏好直送後端，實測）。

### 7.3 生成行為：先工具、後文字（HAR 實測，2357 那輪 253 chunks）

| 階段 | 事件 | 內容 |
|---|---|---|
| 工具 | `tool_calls` ×5＋`tool_result` ×5，交錯 | 序列實測：`read_skill`→`es_query`→（回）→`read_skill`→（回）→`es_query`×2→（回×2）；**只有 name，無參數無結果** |
| 命名 | `session_title` ×1 | 以問句自動命名 |
| 本文 | `delta` ×240 | 2–3 字一塊（hi 那輪是逐字；與長度有關，推測） |
| 額度 | `budget_update` ×1 | 6h 窗口＋週窗口＋百分比 |
| 收尾 | `done`＋`assistant_message_id` ×1 | 無 `done` 即未完成（abort 輪無此事件，實測） |

回答本體（delta 合併，2357 實測，全文）：粗體答案句「**華碩 (2357) 本益比：13.86 倍**（2026/09/17，當日收盤 948.0 元）」＋ 5 日 markdown 表（收盤／本益比／股價淨值比／殖利率）＋ 一句解讀（「近一週…主要反映股價由 928 漲到 948」）。結構＝**答案先行→表格→解讀**，日期皆為交易日（含 09/14 週日收盤「—」但仍有估值欄，實測）。

### 7.4 四種問答實錄（行為差異）

| 問法 | 行為（實測） |
|---|---|
| `hi`（寒暄） | **不調工具**（stream 全是 delta＋title＋budget＋done）；固定自我介紹，繁中敬語「您」；title 取 "Greeting" |
| `台積電(2330)現在多少錢`（行情） | 調工具（未錄 body，截圖實測輸出）：文字（成交量、收盤時間）＋**互動卡**（台積電 k 線卡，1天～最長 tabs 可切）；卡片 payload 不在 SSE 內，前端另調行情 API（推測） |
| `華碩(2357)本益比多少`（估值） | 5+5 工具呼叫後給表格＋解讀（§7.3）；title 取問句 |
| `XYZQ123現在多少錢`（亂碼） | **正常回合、零工具**（推測，截圖實測輸出）：不報錯，教有效格式（台股 4 碼數字如 2330、美股字母如 NVDA）＋請確認代號；工具失敗≠回合失敗的具體例證 |
| `跌破2400通知我`（排程） | **不直接建 task**：先回確認（頻率＋通道，「要一起處理嗎」）；第二句同意才建成 recurring task（cron 由 Agent 生成，見 §5）；task 的 message 是條件模板（跌破／未跌破雙分支文案，實測） |

### 7.5 額度與中斷（HAR 實測）

- 每輪 SSE 必帶 `budget_update`；`GET token-budget` 回 `{tier:"logged_in", window:{window_hours:6}, weekly}`；hi 輪 3% → 工具輪 11% → 後期用量環 20%（實測數字；是否按 token 或次數計費未知）。
- Stop：`POST abort` → `{"aborted":true}`；stream 直接斷（HAR 內該 message 無 body）；history 留空 content＋`aborted:true`；UI 無錯誤文案，輸入框恢復可送（截圖實測）。

## 自動化備註
- webfetch 只能拿到 SSR 文字；`/earnings-call`、`/calendar`、`/market` 圖表區、`為你推薦` 在 webfetch 下幾乎為空骨架 → L3 起必須上真瀏覽器（Playwright MCP 或 second-browser），不能只靠 webfetch。
- 法說會深連結含市場前綴（`TW_1310.TW_2026-09-17`），爬蟲可用此規則枚舉。
- 圖片三網域（`img.biggo.com`／`img.bgo.one`／`img.youtube.com`），寫爬蟲時分開處理。

## 已完成項目總覽
| 章節 | 項目 | 方法 |
|---|---|---|
| 1.1 | 全域 7＋1 導覽與各頁預設值 | webfetch 六頁＋HTML href 清單 |
| 1.2 | Agent 浮層控制項＋自我介紹原文＋Flash 預設 | 截圖判讀 |
| 1.3 | 個股頁 12 tab＋行情欄位＋法說會 URL 規則 | webfetch `/quote/2330.TW`＋HTML grep |
| 1.4 | 新聞／Podcast 同 id 雙檢視＋圖片三網域 | webfetch `/news/`＋`/podcast` 對讀 |
| 1.5 | 付費三方案＋Stripe 文案 | webfetch `/pricing` 全文 |
| 1.6 | 路由表＋Next.js 技術棧 | curl HTML＋href／chunks 清單 |
| 2 | 三條 happy path 時間線＋管線定位結論 | 綜合上述實測 |
| 3 | sparrowhawk 真端點＋REQ 形狀＋會話 CRUD＋token-budget（Bearer 即通） | headless/headed HAR |
| 4 | SSE 五種事件＋history 形狀＋工具名（參數不進 stream） | HAR body |
| 5 | 登入＋Stop 中斷＋排程全生命週期＋亂碼注入＋30s 輪詢＋全清場 | headed HAR＋截圖 |
| 6 | news／podcast 同 id 雙檢視對照 | `/news/a7724b8f`＋`/podcast/a7724b8f` 對讀 |
| 1.2 | 模型下拉三選項＋aria 控制項＋帳號選單 | 下拉截圖＋aria 實測 |

## 待深入項目（需要條件）
| 項目 | 需要條件 | 說明 |
|---|---|---|
| Pro／Thinking 切換行為、法說會 30 分鐘搶先牆 | Pro 帳號 | 免費用戶下拉全鎖定，只能看到不能用 |
| 排程 task 建成後的 toggle／觸發／通知到達 | 無（本輪已做完） | 建→toggle 關→刪全通；觸發需等到 15:00，未等 |
| Podcast 選題標準與更新頻率 | 長期觀察或官方說法 | 前輪已列，延續 |

## 沒拿到的
- 頂部 6 icon 的 tooltip／aria（hover、DOM `[role=tooltip]` 皆無；僅「加寬視窗」有 aria；語義維持推測）。
- 工具參數與檢索結果原文（stream 內只有 name；history 只有最終文字）。

## 殘留清單
- 測試會話 8 個＋排程 task 1 個全數刪除（DELETE／toggle 皆 200，list 驗證歸零）；現存「推薦其他podcast」為使用者原有，未動。
- 本機 `/tmp/biggo-har/profile` 含登入態 profile（未追蹤，`/tmp` 重開機消失）；帳密暫存檔已刪；對話內出現過明文密碼，建議更換。
- 測試期間觸發的 `news/view-attest`（站方自有瀏覽信標）與用量計數（6h 窗口 3%→20%），無需也無法清理。

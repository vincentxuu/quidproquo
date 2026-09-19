# BigGo Finance 行情數據 deep-dive（2026-09-18 實測）

來源：全站筆記 `.research/2026-09-18-biggo-finance-fullsite-walkthrough.md`（§1.3／§1.6／§3.2／§3.5／§5）、HAR `.playwright-mcp/biggo-R2.har`（53 筆，base `https://api.biggo.com/api/v1/finance`，每筆皆帶 `?region=tw`）、R1 HTML `.playwright-mcp/biggo-R1-home.html`。匿名未登入、唯讀載入 8 頁。推測處標明（推測）。

## 1. 定位：行情在資訊站的位置與覆蓋市場

- 資訊站三件套（全站筆記 §1.1 一句話觀察）：「資訊站＋Agent＋變現」；行情（`/market`＋`/quote/{symbol}`）是資訊站底座，Agent 回答行情時前端另調行情 API 渲染互動卡（§4 推測），Podcast／法說會是內容差異化。
- 路由位置：`/market`（四區塊同頁：股票／指數／期貨／ETF）＋子路由 `/market/stock｜index｜futures｜etf`；個股 `/quote/{symbol}`；單場法說會 `/quote/{code}/earnings-call/{id}`（§1.6）。
- 覆蓋市場（法說會篩選列實測）：全部／台灣／美國／日本／韓國／其他市場；行事曆市場篩選：台灣／美國／日本／韓國／陸港（§1.1）。Agent 自我介紹原文只宣稱「台股／美股／日股」（§1.2）。
- 代號格式（路由＋HTML 實測）：

| 市場 | 例 | 備註 |
|---|---|---|
| 台股 | `2330.TW`、`1310.TW`、`6214.TW`、`0050.TW`、`00918.TW` | 4 碼＋`.TW`；ETF 亦同形（`0050.TW` asset_type=`etf`） |
| 美股 | `AAPL`、`NVDA`、`AMD`、`INTC`、`BABA`、`GS`、`QCOM` | 純字母（亂碼回覆原文：美股字母如 NVDA） |
| 日股 | `3653.T` | HTML 實測存在（`3653.T`，注意非 `.TW`） |
| 韓股 | `000660.KS`、`005930.KS`、`001440.KS`、`086790.KS` | 路由表實測存在 |
| 陸港 | `1398.HK`、`2050.HK`、`600030.SS` | `.HK`／`.SS`；`1398.HK` 同時是新聞 quote chip |
| 指數 | `^TWII`、`IX0043.TWO`、`IX0028.TW` | k-line 可用 `stock_id=^TWII` |
| 期貨 | `TAIFEX_TX`、`TAIFEX_MTX`、`TAIFEX_TM` 等 10 檔 | `TAIFEX_` 前綴＋商品碼 |

## 2. quote 之謎：為什麼沒有 `/quote/` 資料 API

- 實測結論（§3.5 原文）：**沒有 `/quote/` 資料 API**——手刻 `GET .../quote/2330.TW` 回 `correct-method` 錯誤（R2 403 主因同類：路徑錯＋缺標頭）。
- 個股頁是四件套拼出來的（HAR 實測，皆 200）：

| # | 端點 | 方法 | 在個股頁的角色 |
|---|---|---|---|
| 1 | `GET .../stock/k-line?stock_id=&m=` | GET | 行情區折線圖＋OHLCV 表＋Header 現價 |
| 2 | `POST .../stock/current/price/list` | POST（批量） | 即時價（ask／bid／total_volume；30s 輪詢用同一支，見 §6） |
| 3 | `GET .../stock/tabs/availability?stock_id=` | GET | 12 tab 哪些可點（statements／financing true/false） |
| 4 | `GET .../news/stock/list?sort=&stock_id=` | GET ×3（active／rise／fall） | 右側「最活躍／上漲最多／下跌最多」三榜 |

- 四件套的 params／body／回應欄位（`2330.TW` 那輪實測）：

| 端點 | Query params（逐一） | Body | 回應欄位（逐一） |
|---|---|---|---|
| `stock/k-line` | `stock_id=2330.TW`、`m=1D`、`region=tw` | 無 | `data.{stock_id, asset_type, region, mode, interval, in_market_open, open_time{open,close}, timezone, highest_price, lowest_price, previous_close, kline_data[{date,open,high,low,close,volume}]}`；當時值 `mode=1D interval=1m timezone=Asia/Taipei in_market_open=false open=09:00:00+08:00 close=13:30:00+08:00 previous_close=2425 highest=2460 lowest=2435`，271 點，首 `09:00 O2460 H2460 L2450 C2455 V2559000`、末 `13:30 O2460 H2460 L2460 C2460 V20247000` |
| `stock/current/price/list` | `region=tw` | `{"stock_ids":[...]}`（10 檔，見 §3） | `[{stock_id, asset_type, current_price, ask, bid, total_volume, daily_change, daily_change_percent}]`；例 `0050.TW ask=109.85 bid=109.8`（只差 0.05） |
| `stock/tabs/availability` | `stock_id=2330.TW`、`region=tw` | 無 | 見 §4 表 |
| `news/stock/list` | `sort=active｜rise｜fall`、`stock_id=2330.TW`、`region=tw` | 無 | `[{symbol_id, asset_type, name, image, current_price, daily_change, daily_change_percent, daily_volume, currency, market, previous_volume, avg_volume, previous_close, history_date, snapshot_date, favorite_group_id}]` |
| `stock/related/news` | `stock_id=2330.TW`、`size=9`、`page=1`、`region=tw` | 無 | `data.{total, news_count, major_count, podcast_count, ir_release_count, news[{id,type,title,content,...}]}`；當時值 `total=5825 news_count=5729 major=96 podcast=104 ir=9` |

- 匿名請求標頭（HAR 實測）：k-line 僅見 `Accept: application/json`，**未見 Authorization**；行情全數 200（§3.5）。

## 3. 市場四合一：榜單 list ＋ 價量 POST 批量

### 3.1 四支榜單 list（`GET`，皆 200）

| 端點 | Query params（逐一） | 回應形狀 | 當時首筆 |
|---|---|---|---|
| `GET .../stock/market/main/list` | `region=tw` | `data[]:{stock_id, name, asset_type, current_price, daily_change, daily_change_percent, is_market_closed, image, currency, favorite_group_id}` | `2330.TW 台灣積體電路製造 2460 +35 (1.44%) closed=true TWD`；次筆 `2454.TW 聯發科技 4710 +210 (4.67%)` |
| `GET .../index/market/main/list` | `size=10`、`region=tw` | `data[]:{symbol_id, name, asset_type, current_price, daily_change, daily_change_percent, high, low, is_market_closed, currency, region, favorite_group_id}`（多 `high/low/region`） | `^TWII 台灣加權指數 47180.75 +892.75 (1.93%) high=low=47180.75`；`IX0043.TWO 櫃買 412.68 +3.64%` |
| `GET .../futures/market/main/list` | `region=tw` | `data.{market, size, list[]:{symbol, asset_type, product_code, name, name_en, exchange, currency, icon_url, front_month, current_price, daily_change, daily_change_percent, daily_volume, open_interest, date, favorite_group_id}}` | `TAIFEX_TX 臺股期貨 TAIEX Futures front_month=202610 price=47418 +1358 (2.95%) vol=44613 date=20260918 open_interest=null` |
| `GET .../etf/market/main/list` | `market=tw`、`region=tw`（唯一多 `market` 者） | `data.{market:"tw", size:10, list[]:{stock_id, name, asset_type, current_price, daily_change, daily_change_percent, image, currency, category, asset_class, aum, issuer, favorite_group_id}}`（獨有 `category/asset_class/aum/issuer`） | `0050.TW 元大台灣50 109.85 +1.67% category=equity_index asset_class=Equity aum=2368854626956 issuer=Yuanta`；`00631L.TW 元大台灣50正2 aum=256057096382`；多檔 `aum=null image=null` |

#### 3.1.1 股票榜 10 檔全表（`stock/market/main/list` 當時值，全 `is_market_closed=true`、`currency=TWD`）

| stock_id | name | current_price | daily_change | daily_change_percent |
|---|---|---|---|---|
| 2330.TW | 台灣積體電路製造 | 2460 | 35 | 1.44 |
| 2454.TW | 聯發科技 | 4710 | 210 | 4.67 |
| 2308.TW | 台達電子 | 1735 | 50 | 2.97 |
| 2317.TW | 鴻海精密工業股份有限公司 | 250.5 | 0 | 0 |
| 3711.TW | 日月光投資控股股份有限公司 | 638 | 24 | 3.91 |
| 2881.TW | 富邦金融控股 | 150.5 | -1 | -0.66 |
| 1303.TW | 南亞塑膠 | 238 | 2 | 0.85 |
| 2303.TW | 聯華電子 | 156 | 8.5 | 5.76 |
| 2408.TW | 南亞科技股份有限公司 | 525 | 37 | 7.58 |
| 2882.TW | 國泰金融控股 | 110.5 | -1.5 | -1.34 |

#### 3.1.2 指數榜 10 檔全表（`index/market/main/list?size=10`，`high=low` 收盤快照，全 `is_market_closed=true`）

| symbol_id | name | current_price | daily_change | daily_change_percent |
|---|---|---|---|---|
| ^TWII | 台灣加權指數 | 47180.75 | 892.75 | 1.93 |
| IX0043.TWO | 櫃買加權指數 | 412.68 | 14.51 | 3.64 |
| IX0028.TW | 台灣半導體類指數 | 1601.01 | 37.19 | 2.38 |
| IX0027.TW | 台灣電子類指數 | 2983.44 | 70.93 | 2.44 |
| IX0104.TW | 台灣高股息指數 | 12752.36 | -8.1 | -0.06 |
| IX0039.TW | 台灣金融保險類指數 | 3616.93 | -35.14 | -0.96 |
| IX0108.TW | 台灣中型 100 指數 | 19332.49 | 276.78 | 1.45 |
| IX0024.TW | 台灣鋼鐵類指數 | 120.14 | 1.22 | 1.03 |
| IX0037.TW | 台灣航運類指數 | 214.05 | -0.96 | -0.45 |
| IX0021.TW | 台灣生技醫療類指數 | 92.83 | 0.37 | 0.4 |

#### 3.1.3 期貨榜 10 檔全表（`futures/market/main/list`，全 `exchange=TAIFEX currency=TWD front_month=202610 date=20260918 open_interest=null`）

| symbol | name／name_en | product_code | current_price | daily_change (%) | daily_volume |
|---|---|---|---|---|---|
| TAIFEX_TX | 臺股期貨／TAIEX Futures | TX | 47418 | 1358 (2.95) | 44613 |
| TAIFEX_MTX | 小型臺指期貨／Mini-TAIEX Futures | MTX | 47427 | 1367 (2.97) | 95836 |
| TAIFEX_TM | 微型臺指期貨／Micro TAIEX Futures | TM | 47421 | 1361 (2.95) | 153892 |
| TAIFEX_QFF | 小型台積電期貨／QFF | QFF | 2468 | 67 (2.79) | 20400 |
| TAIFEX_OLF | 小型大立光期貨／OLF | OLF | 6515 | 285 (4.57) | 5906 |
| TAIFEX_PUF | 小型聯發科期貨／PUF | PUF | 4765 | 210 (4.61) | 8082 |
| TAIFEX_RWF | 小型創意期貨（name 實測） | RWF | 7160 | 950 (15.3) | 3906 |
| TAIFEX_PWF | 小型緯穎期貨（name 實測） | PWF | 2140 | -26 (-1.2) | 6840 |
| TAIFEX_SFF | 小型台光電期貨（name 實測） | SFF | 4900 | -250 (-4.85) | 3790 |
| TAIFEX_RVF | 小型台達電期貨（name 實測） | RVF | 1744 | 21 (1.22) | 7904 |

#### 3.1.4 ETF 榜 10 檔全表（`etf/market/main/list?market=tw`，全 `category=equity_index asset_class=Equity currency=TWD`）

| stock_id | name | current_price | daily_change (%) | aum | issuer |
|---|---|---|---|---|---|
| 0050.TW | 元大台灣50 | 109.85 | 1.8 (1.67) | 2368854626956 | Yuanta |
| 00918.TW | 大華優利高填息30 | 34.15 | -0.35 (-1.01) | null | DAH HWA |
| 00631L.TW | 元大台灣50正2 | 37.65 | 1.24 (3.41) | 256057096382 | Yuanta |
| 00981A.TW | 主動統一台股增長 | 29.07 | 0.94 (3.34) | null | UPAMC |
| 00919.TW | 群益台灣精選高息 | 31.96 | -0.15 (-0.47) | null | Capital |
| 00403A.TW | 主動統一升級50 | 10.33 | 0.32 (3.2) | null | UPAMC |
| 00685L.TW | 群益臺灣加權正2 | 12.42 | 0.44 (3.67) | null | Capital |
| 00406A.TW | 主動中信台灣收益 | 9.59 | 0.28 (3.01) | null | CTBC |
| 009816.TW | 凱基台灣TOP50 | 16.25 | 0.21 (1.31) | null | KGI |
| 00632R.TW | 元大台灣50反1 | 9.67 | -0.17 (-1.73) | 26362794610 | Yuanta |

### 3.2 兩支價量 POST（`Content-Type: application/json`，皆 200）

- `POST .../stock/current/price/list?region=tw`，body（原文照抄 10 檔）：
  `{"stock_ids":["0050.TW","00918.TW","00631L.TW","00981A.TW","00919.TW","00403A.TW","00685L.TW","00406A.TW","009816.TW","00632R.TW"]}`
  回應欄位：`[{stock_id, asset_type, current_price, ask, bid, total_volume, daily_change, daily_change_percent}]`；10 檔全值：

| stock_id | current_price | ask | bid | total_volume | daily_change (%) |
|---|---|---|---|---|---|
| 0050.TW | 109.85 | 109.85 | 109.8 | 79388000 | 1.8 (1.67) |
| 00918.TW | 34.15 | 34.15 | 34.14 | 242638000 | -0.35 (-1.01) |
| 00631L.TW | 37.65 | 37.65 | 37.64 | 193661000 | 1.24 (3.41) |
| 00981A.TW | 29.07 | 29.07 | 29.06 | 143163000 | 0.94 (3.34) |
| 00919.TW | 31.96 | 31.96 | 31.95 | 115717000 | -0.15 (-0.47) |
| 00403A.TW | 10.33 | 10.33 | 10.32 | 314069000 | 0.32 (3.2) |
| 00685L.TW | 12.42 | 12.42 | 12.41 | 262424000 | 0.44 (3.67) |
| 00406A.TW | 9.59 | 9.59 | 9.58 | 201952000 | 0.28 (3.01) |
| 009816.TW | 16.25 | 16.25 | 16.24 | 110718000 | 0.21 (1.31) |
| 00632R.TW | 9.67 | 9.68 | 9.67 | 133116000 | -0.17 (-1.73) |

  對讀：同一 10 檔即 ETF 榜（§3.1.4），`current_price/daily_change` 兩端一致（實測比對一致）；量最大 `00403A.TW 314069000`。
- `POST .../futures/current/price/list?region=tw`，body（原文照抄 10 檔）：
  `{"symbols":[{"symbol":"TAIFEX_TX"},{"symbol":"TAIFEX_MTX"},{"symbol":"TAIFEX_TM"},{"symbol":"TAIFEX_QFF"},{"symbol":"TAIFEX_OLF"},{"symbol":"TAIFEX_PUF"},{"symbol":"TAIFEX_RWF"},{"symbol":"TAIFEX_PWF"},{"symbol":"TAIFEX_SFF"},{"symbol":"TAIFEX_RVF"}]}`
  回應欄位：`[{symbol, asset_type, current_price, settlement_price, daily_change, daily_change_percent, ask, bid, total_volume, open_interest, contract_month}]`（比 stock 版多 `settlement_price/contract_month`）；當時值 `contract_month=202610` 全 10 檔一致，`settlement_price=null open_interest=null` 全空；極端值 `TAIFEX_RWF 7160 +15.3% ask=0 bid=7160`（ask=0 實測原文）、`TAIFEX_SFF 4900 -4.85%`。
- k-line 對照：`GET .../futures/k-line?symbol=TAIFEX_TX&m=1D&region=tw` 回 `data.{symbol, asset_type, contract_month:"1", mode:1D, interval:5m, timezone:Asia/Taipei, highest_price:47460, lowest_price:46571, kline_data[{date,open,high,low,close,volume}]}`；首點 `2026-09-17T15:00+08:00 O46571 V158`（前一交易日下午盤起算，與台股現貨 09:00 起算不同，實測）。

## 4. 個股 12 tab 與 availability 物件（`2330.TW` 實測）

- Tab 列（UI 實測，重複渲染兩次）：概覽／新聞/公告／法說會／籌碼／財務／股利／持股人／公司(`/profile`)／Podcast／成份股／社群／可轉債（§1.3）。
- `GET .../stock/tabs/availability?stock_id=2330.TW&region=tw` 回應全文（HAR 實測）：

| 欄位 | 值 |
|---|---|
| `stock_id`／`asset_type`／`region`／`is_etf` | `2330.TW`／`stock`／`tw`／`false` |
| `statements.revenue` | `true` |
| `statements.eps` | `true` |
| `statements.profit` | `true` |
| `statements.balance_sheet` | `true` |
| `statements.total_assets` | `true` |
| `statements.liabilities` | `true` |
| `statements.equity` | `true` |
| `statements.cash_flow` | `true` |
| `statements.cash_flow_single` | `true` |
| `statements.cash_flow_cumulative` | `true` |
| `statements.cash_flow_annual` | `true` |
| `financing.institutional_investors` | `true` |
| `financing.convertible_bond` | `false`（對應「可轉債」tab 不可用，推測） |
| `financing.margin_trading` | `true` |
| `financing.earnings_calls` | `true` |
| `financing.major_shareholder` | `true` |
| `financing.dividend` | `true` |
| `financing.related_news` | `true` |
| `financing.social` | `true` |
| `financing.podcast` | `true` |
| `financing.broker` | `true` |
| `financing.major_holders` | `true` |
| `financing.analyst` | `true` |
| `financing.etf_holdings` | `false`（`is_etf=false` 的另一面，推測） |

- 行情區關鍵欄位（UI 實測照抄，`2330.TW`）：前收 2,425、區間 2,435–2,460、市值 63.8兆、財報日 2026/10/15、開盤 2,460、52週 1,265–2,535、Beta 1.251、預估股息 6 & 0.24、買 2,455／賣 2,460、量 35,250,000、均量 31,426,672、本益比 28.11、EPS 86.28、除息日 2026/06/11；Header：現價 2,460 TWD、+35（1.44%）、"收盤：9月18日 下午1:30 [台北·UTC+8]"。

## 5. 法說會與行事曆

### 5.1 法說會一覽 `GET .../stock/earnings-calls/list`

- Query params（逐一）：`market=tw`、`start_date=2026-09-12`、`end_date=2026-09-18`、`stock_filter=all`、`region=tw`（一週區間，HAR 200）。
- 回應：`data.{list[{call_id, title, stock_id, region, asset_type, name, image, date, duration, has_video, has_slides, has_transcript}], total, page, size, earlier_available_date, later_available_date}`；當時值 `total=61 page=1 size=0`（size=0 實測原文——list 仍回 61 筆）、`earlier_available_date=2026-09-11 later_available_date=null`。
- 樣本（前 20 筆照抄，`has_video=true has_slides=true has_transcript=true` 全 20 筆一致）：

| call_id | title | duration（秒；null＝實測無值） |
|---|---|---|
| TW_6214.TW_2026-09-17 | 精誠 2026-09-17 法說會 | 1874 |
| TW_3605.TW_2026-09-17 | 宏致 2026-09-17 法說會 | null |
| TW_2493.TW_2026-09-17 | 115.09.17--揚博(2493)法人說明會 | 4089 |
| TW_6933.TW_2026-09-17 | AMAX-KY 2026-09-17 法說會 | 3063 |
| TW_1707.TW_2026-09-17 | 葡萄王 2026-09-17 法說會 | null |
| TW_9942.TW_2026-09-17 | 茂順 2026-09-17 法說會 | null |
| TW_6870.TW_2026-09-17 | 騰雲 2026-09-17 法說會 | null |
| TW_7728.TW_2026-09-17 | 光焱科技 2026-09-17 法說會 | 2846 |
| TW_5520.TW_2026-09-17 | 力泰 2026-09-17 法說會 | 1204 |
| TW_1310.TW_2026-09-17 | 臺苯 2026-09-17 法說會 | null |
| TW_3444.TW_2026-09-17 | 利機 2026-09-17 法說會 | null |
| TW_4168.TW_2026-09-17 | 醣聯 2026-09-17 法說會 | 2722 |
| TW_2239.TW_2026-09-17 | 英利-KY 2026-09-17 法說會 | 1894 |
| TW_1449.TW_2026-09-17 | 佳和 2026-09-17 法說會 | 832 |
| TW_3118.TW_2026-09-17 | 3118_進階_20260917_法說會 | 1027 |
| TW_2344.TW_2026-09-16 | 115.09.16--華邦電(2344)重大訊息 | 215 |
| TW_1590.TW_2026-09-16 | 亞德客-KY 2026-09-16 法說會 | 1790 |
| TW_2633.TW_2026-09-16 | 臺灣高鐵 2026-09-16 法說會 | null |
| TW_2606.TW_2026-09-16 | 裕民 2026-09-16 法說會 | 3232 |
| TW_2006.TW_2026-09-16 | 東和鋼鐵 2026-09-16 法說會 | null |

- 末筆 `TW_2754.TW_2026-09-14 亞洲藏壽司 duration=1418`；R1 HTML 深連結另見 `TW_6214／TW_3605／TW_6870／TW_2493／TW_6933`（皆 `2026-09-17`，與上表一致）。
- 深連結（R1 HTML 實測）：`/quote/{code}/earnings-call/{MARKET}_{code}_{YYYY-MM-DD}`，例 `/quote/6214.TW/earnings-call/TW_6214.TW_2026-09-17`、`TW_1310.TW_2026-09-17`（§1.3 另例 `/quote/1310.TW/earnings-call/TW_1310.TW_2026-09-17`）；call_id 即 URL 尾段（實測一致）。

### 5.2 行事曆五類＋stats（`GET`，皆 200）

- 類型 `?t=`（UI 實測）：`earnings／earnings-calls／economic／holidays／dividends`；端點 `GET .../stock/calendar/{type}`。
- params 逐欄（HAR 實測，日切片 `start_date=end_date=2026-09-18`）：

| 端點 | `start_date` | `end_date` | `markets[]` | `size` | `page` | `stock_filter` | `region` |
|---|---|---|---|---|---|---|---|
| `calendar/earnings` | 2026-09-18 | 2026-09-18 | `tw` | 50 | 1 | `all` | tw |
| `calendar/earnings-calls` | 2026-09-18 | 2026-09-18 | `tw` | 50 | 1 | `all` | tw |
| `calendar/economic` | 2026-09-18 | 2026-09-18 | `tw` | 50 | 1 | —（無此欄） | tw |
| `calendar/holidays` | 2026-09-18 | 2026-09-18 | `tw` | 50 | 1 | —（無此欄） | tw |
| `calendar/dividends` | 2026-09-18 | 2026-09-18 | `tw` | 50 | 1 | `all` | tw |
| `calendar/stats` | 2026-09-14 | 2026-09-20（週區間） | `tw` | — | — | `all` | tw |

- 回應：
  - `earnings`／`economic`／`holidays`：當日全空 `{"result":true,"data":{"list":[],"total":0,"page":1,"size":50}}`（三支逐字相同）。
  - `earnings-calls`：`total=10 page=1 size=50`，欄位 `[{symbol, company_name, image, announcement_date, timing, time, fiscal_period_end, eps_actual, eps_estimated, calls_id, currency, currency_symbol, region, market_cap, venue, summary}]`；樣本 `2885.TW 元大金融控股 timing=amc time=15:30 market_cap=970507716080 venue=台北 summary=公告…受邀參加第一金證券…線上投資人會議`；`2362.TW 藍天電腦 venue=統一證券總公司B203會議室(台北市松山區東興路8號)`；`2612.TW 中國航運 venue=線上法說會`；`eps_actual/eps_estimated/calls_id/fiscal_period_end` 全 null。
  - `dividends`：`total=7`，同 symbol 出現兩種物件形狀（實測原文）：A 形 `{symbol, company_name, region, ex_dividend_date, record_date, payment_date, announcement_date, dividend_type, cash_dividend, stock_dividend, total_dividend, currency, currency_symbol, image}`＋B 形 `{symbol, region, ex_dividend_date, payment_date, declaration_date, currency, dividend, dividend_type, company_name, image}`；7 筆全表：

| symbol | 形狀 | ex_dividend_date | payment_date | dividend（cash／total） |
|---|---|---|---|---|
| 00918.TW | A | 2026-09-18 | 2026-10-15 | cash 1.75／total 1.75 |
| 00918.TW | B | 2026-09-18 | 2026-10-15 | dividend 1.75 |
| 00994A.TW | A | 2026-09-18 | 2026-10-15 | cash 0.257／total 0.257 |
| 00994A.TW | B | 2026-09-18 | 2026-10-15 | dividend 0.257 |
| 00728.TW | A | 2026-09-18 | 2026-10-15 | cash 0.77／total 0.77 |
| 00728.TW | B | 2026-09-18 | 2026-10-15 | dividend 0.77 |
| 7943.TW 鴻璟科技 | A | 2026-09-18 | 2026-10-21 | cash 0.22／total 0.22（announcement=2026-08-21） |

  全 `dividend_type=cash currency=TWD currency_symbol=NT$ record_date=null stock_dividend=null`（A 形實測）。
  - `stats`：`data.list[{date, earnings, economic, holidays, earnings_calls, dividends}]`；當時值 `09-14: EC27 Div9`、`09-15: EC44 Div14`、`09-16: EC46 Div79`（Div 峰值）、`09-17: EC19 Div17`、`09-18: EC10 Div7`；`earnings/economic/holidays` 五天全 0。

- 三榜首筆對讀（`news/stock/list`，`sort` 三值皆 HAR 200；欄位多 `previous_close/history_date/snapshot_date`，榜單 list 無此三欄）：

| sort | 首筆 symbol | name | current_price | daily_change (%) | daily_volume |
|---|---|---|---|---|---|
| active | 2303.TW | 聯華電子 | 156 | 8.5 (5.76) | 300960000 |
| rise | 3443.TW | 創意電子 | 7150 | 650 (10) | 2502000 |
| fall | 1709.TW | 和益 | 39.2 | -3.75 (-8.73) | 47867000 |

- active 首筆另附 `previous_close=147.5 previous_volume=256821287 avg_volume=null history_date=2026-09-17 snapshot_date="2026-09-18 13:30:00.000+08:00" currency=NT$ market=Taiwan`；次筆 `2454.TW 聯發科技 4710 +210 (4.67%) vol=8991000 prev_close=4500`；`3105.TW 穩懋半導體 500 +29 (6.16%) image=null`（無圖實測）；三榜各回 5 筆（`n=5` 實測）。
- 個股頁三榜（`stock_id=2330.TW` 版，params 多 `stock_id`）：`sort=active｜rise｜fall` ×3，與全站三榜同端點（HAR 實測皆 200）。

## 6. 即時性設計：30 秒輪詢、圖片代理、免登入

| 項目 | 實測 |
|---|---|
| 輪詢頻率 | `/market` 頁 `POST stock/current/price/list` 成對出現（間隔 0.1s），每 **30 秒**一輪（100 秒觀測：29.9／30.0／30.1，R7 實測）；被動輪詢，無 WS（53 筆回應 mime：`application/json` 39 筆＋圖片代理，非 JSON 僅圖片） |
| 圖片代理 | `POST https://api.biggo.com/api/v1/image/icd/url`（13 筆，全 200）；REQ `{"urls":[...]}`（實測一批多 URL，len=955）；RESP `{"success":true,"results":[{"url, colors:[{hex, percentage, rgb{r,g,b}}]}]}`；例首色 `#DFE1E8 77.1%`＋`#EE0F0E 18.1%`；圖源三網域 `img.biggo.com／img.bgo.one／img.youtube.com`（§1.4） |
| 免登入 | 匿名 k-line 僅 `Accept: application/json` 即 200；新聞／行情匿名全數 200（§3.5）；需登入的只有 `/watchlist`（「立即登入」）與 sparrowhawk 寫入側 |
| 收盤標記 | 榜單 `is_market_closed=true`（stock/index 當時全 true）；k-line `in_market_open=false`（`^TWII`／`2330.TW`／`0050.TW` 一致）；快照 `snapshot_date="2026-09-18 13:30:00.000+08:00"`、`history_date="2026-09-17"`（三榜物件實測） |
| Agent 互動卡 | SSE 內無卡片 payload，前端按訊息內容另調行情 API 渲染（推測）；k 線卡 tabs（1天～最長）對應 `m` 參數（推測，僅 `m=1D` 實測有值） |

## 7. 沒拿到的

- k-line `m` 參數：UI 有 1天／5天／1個月／6個月／YTD／1年／5年／最長八檔（§1.1），HAR 只錄到 `m=1D`（stock `^TWII`／`2330.TW`／`0050.TW`、futures `TAIFEX_TX`）；`m` 其他值 ↔ interval（`1m`／`5m` 實測兩種）對應表未知。
- 價量 POST 輪詢外的觸發條件：只觀測到 30s 被動輪詢；切 tab／切時間 range 是否另打（`0050.TW` k-line 曾單獨出現一次）未系統觀測。
- `size=0` 卻回 61 筆（earnings-calls/list）：分頁語義不明（`page=1 size=0 total=61` 實測原文），`size` 是否可調未知。
- `market` 篩選：etf list 用 `market=tw`、earnings-calls 用 `market=tw`（單數），calendar 用 `markets[]=tw`（陣列）；`market=us/jp/kr` 是否同形未測。
- `stock_filter` 可選值：只見 `all`；UI 另有「自選股」選項（需登入，未測）。
- `news/stock/list` 三 sort（active／rise／fall）之外的 sort 值、`avg_volume=null` 何時有值、`favorite_group_id=null` 登入態形狀，均未測。
- `futures/k-line` `contract_month:"1"` 語義（榜單側 `front_month=202610`）未對齊；`open_interest=null`／`settlement_price=null` 何時有值未知。

## 8. REQ／RESP 全文（核心端點，HAR 實測）

以下每支皆附實際 query string；RESP 截短處註明原文 bytes 數。`image`／`icon_url` 值為簽名代理 URL，已截為 `https://img.biggo.com/<sig>/…` 形（原文照此形，sig 省略）。

### 8.1 `GET stock/market/main/list`（榜單·股票）

```http
GET https://api.biggo.com/api/v1/finance/stock/market/main/list?region=tw
Accept: application/json
Origin: https://finance.biggo.com.tw
```

```json
// RESP 200，原文 4025 bytes；以下取首筆全文＋次筆去 image，其餘 8 筆以 … 表示
{"result":true,"data":[
{"stock_id":"2330.TW","name":"台灣積體電路製造","asset_type":"stock","current_price":2460,"daily_change":35,"daily_change_percent":1.44,"is_market_closed":true,"image":"https://img.biggo.com/<sig>/…2330.TW.svg.webp","currency":"TWD","favorite_group_id":null},
{"stock_id":"2454.TW","name":"聯發科技","asset_type":"stock","current_price":4710,"daily_change":210,"daily_change_percent":4.67,"is_market_closed":true,"image":"…","currency":"TWD","favorite_group_id":null}
// … 其餘 8 筆見 §3.1.1 全表
]}
```

### 8.2 `GET index/market/main/list`（榜單·指數）

```http
GET https://api.biggo.com/api/v1/finance/index/market/main/list?size=10&region=tw
Accept: application/json
Origin: https://finance.biggo.com.tw
```

```json
// RESP 200，原文 2484 bytes；以下取首 2 筆逐字，其餘 8 筆見 §3.1.2
{"result":true,"data":[
{"symbol_id":"^TWII","name":"台灣加權指數","asset_type":"index","current_price":47180.75,"daily_change":892.75,"daily_change_percent":1.93,"high":47180.75,"low":47180.75,"is_market_closed":true,"currency":"TWD","region":"tw","favorite_group_id":null},
{"symbol_id":"IX0043.TWO","name":"櫃買加權指數","asset_type":"index","current_price":412.68,"daily_change":14.51,"daily_change_percent":3.64,"high":412.68,"low":412.68,"is_market_closed":true,"currency":"TWD","region":"tw","favorite_group_id":null}
// … 其餘 8 筆見 §3.1.2 全表
]}
```

### 8.3 `GET futures/market/main/list`（榜單·期貨）

```http
GET https://api.biggo.com/api/v1/finance/futures/market/main/list?region=tw
Accept: application/json
Origin: https://finance.biggo.com.tw
```

```json
// RESP 200，原文 5116 bytes；以下取首筆全文（icon_url 截短），其餘 9 筆見 §3.1.3
{"result":true,"data":{"market":null,"size":10,"list":[
{"symbol":"TAIFEX_TX","asset_type":"futures","product_code":"TX","name":"臺股期貨","name_en":"TAIEX Futures","exchange":"TAIFEX","currency":"TWD","icon_url":"https://img.biggo.com/<sig>/…TAIFEX_TX.jpg.webp","front_month":"202610","current_price":47418,"daily_change":1358,"daily_change_percent":2.95,"daily_volume":44613,"open_interest":null,"date":"20260918","favorite_group_id":null}
// … 其餘 9 筆見 §3.1.3 全表（含 MTX／TM／QFF／OLF／PUF／RWF／PWF／SFF／RVF）
]}}
```

### 8.4 `GET etf/market/main/list`（榜單·ETF）

```http
GET https://api.biggo.com/api/v1/finance/etf/market/main/list?market=tw&region=tw
Accept: application/json
Origin: https://finance.biggo.com.tw
```

```json
// RESP 200，原文 2726 bytes；以下取首 2 筆全文，其餘 8 筆見 §3.1.4
{"result":true,"data":{"market":"tw","size":10,"list":[
{"stock_id":"0050.TW","name":"元大台灣50","asset_type":"etf","current_price":109.85,"daily_change":1.8,"daily_change_percent":1.67,"image":null,"currency":"TWD","category":"equity_index","asset_class":"Equity","aum":2368854626956,"issuer":"Yuanta","favorite_group_id":null},
{"stock_id":"00918.TW","name":"大華優利高填息30","asset_type":"etf","current_price":34.15,"daily_change":-0.35,"daily_change_percent":-1.01,"image":null,"currency":"TWD","category":"equity_index","asset_class":"Equity","aum":null,"issuer":"DAH HWA","favorite_group_id":null}
// … 其餘 8 筆見 §3.1.4 全表
]}}
```

### 8.5 `POST stock/current/price/list`（價量批量·股票，REQ／RESP 全文）

```http
POST https://api.biggo.com/api/v1/finance/stock/current/price/list?region=tw
Content-Type: application/json
Accept: application/json
Origin: https://finance.biggo.com.tw
```

```json
// REQ body 全文（原文 131 bytes，照抄）
{"stock_ids":["0050.TW","00918.TW","00631L.TW","00981A.TW","00919.TW","00403A.TW","00685L.TW","00406A.TW","009816.TW","00632R.TW"]}
```

```json
// RESP 200 全文（原文 1669 bytes，未截短；首 2＋末 1 筆，中 7 筆值見 §3.2 表）
{"result":true,"data":[
{"stock_id":"0050.TW","asset_type":"stock","current_price":109.85,"ask":109.85,"bid":109.8,"total_volume":79388000,"daily_change":1.8,"daily_change_percent":1.67},
{"stock_id":"00918.TW","asset_type":"stock","current_price":34.15,"ask":34.15,"bid":34.14,"total_volume":242638000,"daily_change":-0.35,"daily_change_percent":-1.01},
// … 中 7 筆見 §3.2 全表
{"stock_id":"00632R.TW","asset_type":"stock","current_price":9.67,"ask":9.68,"bid":9.67,"total_volume":133116000,"daily_change":-0.17,"daily_change_percent":-1.73}]}
```

### 8.6 `POST futures/current/price/list`（價量批量·期貨，REQ／RESP 全文）

```http
POST https://api.biggo.com/api/v1/finance/futures/current/price/list?region=tw
Content-Type: application/json
Accept: application/json
Origin: https://finance.biggo.com.tw
```

```json
// REQ body 全文（照抄，10 檔）
{"symbols":[{"symbol":"TAIFEX_TX"},{"symbol":"TAIFEX_MTX"},{"symbol":"TAIFEX_TM"},{"symbol":"TAIFEX_QFF"},{"symbol":"TAIFEX_OLF"},{"symbol":"TAIFEX_PUF"},{"symbol":"TAIFEX_RWF"},{"symbol":"TAIFEX_PWF"},{"symbol":"TAIFEX_SFF"},{"symbol":"TAIFEX_RVF"}]}
```

```json
// RESP 200（原文 2316 bytes；首 2＋異常 1 筆，餘見 §3.2）
{"result":true,"data":[
{"symbol":"TAIFEX_TX","asset_type":"futures","current_price":47418,"settlement_price":null,"daily_change":1358,"daily_change_percent":2.95,"ask":47425,"bid":47420,"total_volume":44613,"open_interest":null,"contract_month":"202610"},
{"symbol":"TAIFEX_MTX","asset_type":"futures","current_price":47427,"settlement_price":null,"daily_change":1367,"daily_change_percent":2.97,"ask":47427,"bid":47423,"total_volume":95836,"open_interest":null,"contract_month":"202610"},
// … 中 7 筆見 §3.2；異常筆：
{"symbol":"TAIFEX_RWF","asset_type":"futures","current_price":7160,"settlement_price":null,"daily_change":950,"daily_change_percent":15.3,"ask":0,"bid":7160,"total_volume":3906,"open_interest":null,"contract_month":"202610"}]}
```

### 8.7 `GET stock/k-line`（K 線·股票）

```http
GET https://api.biggo.com/api/v1/finance/stock/k-line?stock_id=2330.TW&m=1D&region=tw
Accept: application/json
Origin: https://finance.biggo.com.tw
```

```json
// RESP 200，原文 27344 bytes（271 點）；以下取 meta＋首 3 點，末點見 §2（13:30 O2460 H2460 L2460 C2460 V20247000）
{"result":true,"data":{"stock_id":"2330.TW","asset_type":"stock","region":"tw","mode":"1D","interval":"1m","in_market_open":false,
"open_time":{"open":"09:00:00+08:00","close":"13:30:00+08:00"},"timezone":"Asia/Taipei",
"highest_price":2460,"lowest_price":2435,"previous_close":2425,
"kline_data":[
{"date":"2026-09-18T09:00:00+08:00","open":2460,"high":2460,"low":2450,"close":2455,"volume":2559000},
{"date":"2026-09-18T09:01:00+08:00","open":2455,"high":2455,"low":2445,"close":2445,"volume":262000},
{"date":"2026-09-18T09:02:00+08:00","open":2450,"high":2450,"low":2445,"close":2450,"volume":152000}
// … 中間 265 點省略，末點見 §2
]}}
```

### 8.8 `GET futures/k-line`（K 線·期貨）

```http
GET https://api.biggo.com/api/v1/finance/futures/k-line?symbol=TAIFEX_TX&m=1D&region=tw
Accept: application/json
Origin: https://finance.biggo.com.tw
```

```json
// RESP 200，原文 23571 bytes；以下取 meta＋首 3 點（注意：無 previous_close／open_time 欄）
{"result":true,"data":{"symbol":"TAIFEX_TX","asset_type":"futures","contract_month":"1","mode":"1D","interval":"5m","timezone":"Asia/Taipei",
"highest_price":47460,"lowest_price":46571,
"kline_data":[
{"date":"2026-09-17T15:00:00+08:00","open":46571,"high":46571,"low":46571,"close":46571,"volume":158},
{"date":"2026-09-17T15:05:00+08:00","open":46586,"high":46586,"low":46586,"close":46586,"volume":362},
{"date":"2026-09-17T15:10:00+08:00","open":46646,"high":46646,"low":46646,"close":46646,"volume":352}
// … 其餘點省略（前一交易日 15:00 起算，含夜盤；與現貨 09:00 起算不同，實測）
]}}
```

### 8.9 `GET stock/tabs/availability`（RESP 全文，未截短）

```http
GET https://api.biggo.com/api/v1/finance/stock/tabs/availability?stock_id=2330.TW&region=tw
Accept: application/json
```

```json
// RESP 200，原文 592 bytes，全文
{"result":true,"data":{"stock_id":"2330.TW","asset_type":"stock","region":"tw","is_etf":false,"statements":{"revenue":true,"eps":true,"profit":true,"balance_sheet":true,"total_assets":true,"liabilities":true,"equity":true,"cash_flow":true,"cash_flow_single":true,"cash_flow_cumulative":true,"cash_flow_annual":true},"financing":{"institutional_investors":true,"convertible_bond":false,"margin_trading":true,"earnings_calls":true,"major_shareholder":true,"dividend":true,"related_news":true,"social":true,"podcast":true,"broker":true,"major_holders":true,"analyst":true,"etf_holdings":false}}}
```

### 8.10 `GET stock/calendar/stats`（RESP 全文，未截短）

```http
GET https://api.biggo.com/api/v1/finance/stock/calendar/stats?start_date=2026-09-14&end_date=2026-09-20&markets[]=tw&stock_filter=all&region=tw
Accept: application/json
```

```json
// RESP 200，原文 511 bytes，全文
{"result":true,"data":{"list":[{"date":"2026-09-14","earnings":0,"economic":0,"holidays":0,"earnings_calls":27,"dividends":9},{"date":"2026-09-15","earnings":0,"economic":0,"holidays":0,"earnings_calls":44,"dividends":14},{"date":"2026-09-16","earnings":0,"economic":0,"holidays":0,"earnings_calls":46,"dividends":79},{"date":"2026-09-17","earnings":0,"economic":0,"holidays":0,"earnings_calls":19,"dividends":17},{"date":"2026-09-18","earnings":0,"economic":0,"holidays":0,"earnings_calls":10,"dividends":7}]}}
```

### 8.11 `GET stock/calendar/dividends`（截短：取首 A／B 各 1 筆）

```http
GET https://api.biggo.com/api/v1/finance/stock/calendar/dividends?start_date=2026-09-18&end_date=2026-09-18&markets[]=tw&size=50&page=1&stock_filter=all&region=tw
Accept: application/json
```

```json
// RESP 200，原文 1947 bytes（total=7）；以下取 A 形首筆＋B 形首筆，全表見 §5.2
{"result":true,"data":{"list":[
{"symbol":"00918.TW","company_name":"大華優利高填息30","region":"tw","ex_dividend_date":"2026-09-18","record_date":null,"payment_date":"2026-10-15","announcement_date":null,"dividend_type":"cash","cash_dividend":1.75,"stock_dividend":null,"total_dividend":1.75,"currency":"TWD","currency_symbol":"NT$","image":null},
{"symbol":"00918.TW","region":"tw","ex_dividend_date":"2026-09-18","payment_date":"2026-10-15","declaration_date":null,"currency":"TWD","dividend":1.75,"dividend_type":"cash","company_name":"大華優利高填息30","image":null}
// … 其餘 5 筆見 §5.2 全表；"total":7,"page":1,"size":50
],"total":7,"page":1,"size":50}}
```

### 8.12 `GET stock/calendar/earnings-calls`（截短：取首筆全文）

```http
GET https://api.biggo.com/api/v1/finance/stock/calendar/earnings-calls?start_date=2026-09-18&end_date=2026-09-18&markets[]=tw&size=50&page=1&stock_filter=all&region=tw
Accept: application/json
```

```json
// RESP 200，原文 5082 bytes（total=10）；以下取首筆全文
{"result":true,"data":{"list":[
{"symbol":"2885.TW","company_name":"元大金融控股","image":"https://img.biggo.com/<sig>/…2885.TW.svg.webp","announcement_date":"2026-09-18","timing":"amc","time":"15:30","fiscal_period_end":null,"eps_actual":null,"eps_estimated":null,"calls_id":null,"currency":"TWD","currency_symbol":"NT$","region":"tw","market_cap":970507716080,"venue":"台北","summary":"公告本公司擬於民國115年9月18日(五)受邀參加第一金證券舉行之線上投資人會議。"}
// … 其餘 9 筆（含 2362.TW 藍天電腦、2612.TW 中國航運，見 §5.2）
],"total":10,"page":1,"size":50}}
```

### 8.13 `GET stock/calendar/earnings`（空回應逐字）

```http
GET https://api.biggo.com/api/v1/finance/stock/calendar/earnings?start_date=2026-09-18&end_date=2026-09-18&markets[]=tw&size=50&page=1&stock_filter=all&region=tw
```

```json
// RESP 200，原文 63 bytes，全文（economic／holidays 同日同形，逐字相同）
{"result":true,"data":{"list":[],"total":0,"page":1,"size":50}}
```

### 8.14 `GET stock/earnings-calls/list`（截短：取首筆全文）

```http
GET https://api.biggo.com/api/v1/finance/stock/earnings-calls/list?market=tw&start_date=2026-09-12&end_date=2026-09-18&stock_filter=all&region=tw
Accept: application/json
```

```json
// RESP 200，原文 23151 bytes（total=61，size=0）；以下取首筆全文，前 20 筆表見 §5.1
{"result":true,"data":{"list":[
{"call_id":"TW_6214.TW_2026-09-17","title":"精誠 2026-09-17 法說會","stock_id":"6214.TW","region":"tw","asset_type":"stock","name":"精誠","image":"https://img.biggo.com/<sig>/…6214.TW.svg.webp","date":"2026-09-17","duration":1874,"has_video":true,"has_slides":true,"has_transcript":true}
// … 其餘 60 筆見 §5.1；"total":61,"page":1,"size":0,"earlier_available_date":"2026-09-11","later_available_date":null
],"total":61,"page":1,"size":0,"earlier_available_date":"2026-09-11","later_available_date":null}}
```

### 8.15 `GET news/stock/list` 三榜（各取首筆，全站版無 `stock_id`）

```http
GET https://api.biggo.com/api/v1/finance/news/stock/list?sort=active&region=tw
GET https://api.biggo.com/api/v1/finance/news/stock/list?sort=rise&region=tw
GET https://api.biggo.com/api/v1/finance/news/stock/list?sort=fall&region=tw
```

```json
// sort=active RESP 200，原文 2629 bytes；首筆全文（image 截短）
{"symbol_id":"2303.TW","asset_type":"stock","name":"聯華電子","image":"https://img.biggo.com/<sig>/…2303.TW.svg.webp","current_price":156,"daily_change":8.5,"daily_change_percent":5.76,"daily_volume":300960000,"currency":"NT$","market":"Taiwan","previous_volume":256821287,"avg_volume":null,"previous_close":147.5,"history_date":"2026-09-17","snapshot_date":"2026-09-18 13:30:00.000+08:00","favorite_group_id":null}
// sort=rise RESP 200，原文 2609 bytes；首筆全文
{"symbol_id":"3443.TW","asset_type":"stock","name":"創意電子","image":"https://img.biggo.com/<sig>/…3443.TW.svg.webp","current_price":7150,"daily_change":650,"daily_change_percent":10,"daily_volume":2502000,"currency":"NT$","market":"Taiwan","previous_volume":2334082,"avg_volume":null,"previous_close":6500,"history_date":"2026-09-17","snapshot_date":"2026-09-18 13:30:00.000+08:00","favorite_group_id":null}
// sort=fall RESP 200，原文 2250 bytes；首筆全文
{"symbol_id":"1709.TW","asset_type":"stock","name":"和益","image":"https://img.biggo.com/<sig>/…1709.TW.svg.webp","current_price":39.2,"daily_change":-3.75,"daily_change_percent":-8.73,"daily_volume":47867000,"currency":"NT$","market":"Taiwan","previous_volume":35011882,"avg_volume":null,"previous_close":42.95,"history_date":"2026-09-17","snapshot_date":"2026-09-18 13:30:00.000+08:00","favorite_group_id":null}
```

### 8.16 `GET stock/related/news`（REQ＋計數頭；內文大，僅記規模）

```http
GET https://api.biggo.com/api/v1/finance/stock/related/news?stock_id=2330.TW&size=9&page=1&region=tw
Accept: application/json
```

```json
// RESP 200，原文 51166 bytes（本 HAR 最大）；data 頭＋首篇標題，內文省略
{"result":true,"data":{"total":5825,"news_count":5729,"major_count":96,"podcast_count":104,"ir_release_count":9,
"news":[{"id":"98913222-…-993b62a0c235","type":"realtime","title":"2奈米旗艦晶片集體轉向AI原生架構 手機SoC競爭邏輯生變"}]}}
```

## 9. 基礎設施：response headers 實測（HAR 53 筆一致）

| header | 值（實測） | 說明 |
|---|---|---|
| `server` | `istio-envoy`（53 筆一致） | API 前為 Envoy sidecar（Istio mesh），非源站直出（推測） |
| `content-type` | `application/json; charset=utf-8`（finance API 全數；image 代理為 `application/json`） | 行情皆 JSON；無 protobuf |
| `content-encoding` | `zstd` | 線上壓縮；HAR 內 body 為解壓後長度 |
| `x-envoy-upstream-service-time` | `2–217 ms`（詳 §10） | Envoy 觀測的上游服務耗時；唯一可信的 server-side 耗時 |
| `access-control-allow-origin` | `https://finance.biggo.com.tw` | 鎖死本站 origin；`allow-credentials: true` |
| `access-control-allow-headers` | `Authorization,Content-Type,Site,X-Fgp` | 預留 `Authorization`／自訂 `Site`／`X-Fgp`，但匿名行情未使用 |
| `access-control-allow-methods` | `GET, POST, DELETE, PATCH, OPTIONS` | 讀多寫少，寫入側另有 sparrowhawk |
| `vary` | `Site, Origin, Accept-Encoding` | 按自訂 `Site`＋origin 分快取鍵（推測多站共用 API） |
| `date` | `Fri, 18 Sep 2026 06:01:32–33 GMT` | 抓包時段 UTC 06:01（台北 14:01，收盤後約半小時） |
| `cf-ray`／`cf-cache-status` | **53 筆全無** | HAR 內無 Cloudflare 邊緣痕跡；CDN 若有，不在 L7 header 暴露（沒拿到） |
| `cache-control` | 行情端點**沒拿到** | 行情快取策略不明 |

- Request 側：`origin=https://finance.biggo.com.tw`、`referer=https://finance.biggo.com.tw/`、`sec-fetch-site=cross-site`（API 域 `api.biggo.com` 與站域分離）；匿名**全 53 筆無 `Authorization`**（HAR 實測）；POST 另帶 `content-type: application/json`＋`content-length`（stock 價量 `131` bytes）。
- 推導（推測）：`api.biggo.com` → Istio Envoy（`server`＋`x-envoy-upstream-service-time` 聯判）→ 上游行情服務；`vary: Site` 暗示同一 API 同時服務多站（`Site` 頭分流，推測）。

## 10. 效能對照表（HAR 實測：body bytes＋兩種耗時）

> HAR `time` 欄僅 `0.25–12.87 ms`（本機重放假象，失真）；可信 server-side 為 `x-envoy-upstream-service-time`（`2–217 ms`）。兩欄並列，單位 ms／bytes。

| 群 | 端點 | body（bytes） | HAR time（ms） | upstream service time（ms） |
|---|---|---|---|---|
| 榜單 | `stock/market/main/list` | 4025 | 0.57 | 39 |
| 榜單 | `index/market/main/list?size=10` | 2484 | 0.51 | 21 |
| 榜單 | `futures/market/main/list` | 5116 | 0.48 | 89 |
| 榜單 | `etf/market/main/list?market=tw` | 2726 | 0.59 | 45 |
| K 線 | `stock/k-line 2330.TW m=1D`（271 點） | 27344 | 0.44／0.72（同 URL 打兩次） | 40／42 |
| K 線 | `stock/k-line ^TWII m=1D` | 6329 | 0.58 | 39 |
| K 線 | `stock/k-line 0050.TW m=1D` | 28632 | 0.65 | 195 |
| K 線 | `futures/k-line TAIFEX_TX m=1D` | 23571 | 0.55 | 65 |
| 價量 POST | `stock/current/price/list`（10 檔） | 1669 | 10.86 | 4 |
| 價量 POST | `futures/current/price/list`（10 檔） | 2316 | 12.87 | 35 |
| 三榜 | `news/stock/list sort=active`（5 筆） | 2629 | 0.53／0.38（打兩次） | 12／12 |
| 三榜 | `news/stock/list sort=rise`（5 筆） | 2609 | 0.30／0.41 | 32／10 |
| 三榜 | `news/stock/list sort=fall`（5 筆） | 2250 | 0.25／0.59 | 13／15 |
| 行事曆 | `calendar/stats`（5 天） | 511 | 0.48 | 195 |
| 行事曆 | `calendar/earnings-calls`（10 筆） | 5082 | 0.41 | 39 |
| 行事曆 | `calendar/dividends`（7 筆） | 1947 | 0.39 | 40 |
| 行事曆 | `calendar/earnings｜economic｜holidays`（空） | 63 ×3 | 0.56／0.40／0.35 | 27／11／11 |
| 法說會 | `earnings-calls/list`（61 筆） | 23151 | 0.60 | 39 |
| 個股件套 | `tabs/availability` | 592 | 0.59 | 37 |
| 個股件套 | `stock/related/news?size=9` | 51166（最大） | 4.49 | 81 |

讀法（實測數字說話）：

- 量級三檔：`related/news`（51 KB，含 9 篇內文）≫ k-line（23–29 KB，數百點）≫ 榜單／三榜／價量 POST（1.6–5.1 KB）。
- upstream 最慢兩支：`0050.TW k-line` 與 `calendar/stats` 皆 `195 ms`（k-line 點多可理解；stats 週聚合慢因為何，沒拿到）。
- POST 反直覺：`stock/current/price/list` upstream 僅 `4 ms`（最快之一），但 HAR time `10.86 ms` 全場最慢之一——慢在本地重放寫 body，不在 server（推測為 HAR 假象）。

## 11. 跨端點對照表

### 11.1 價量 POST：stock vs futures

| 項目 | `stock/current/price/list` | `futures/current/price/list` |
|---|---|---|
| 方法＋query | `POST ?region=tw` | `POST ?region=tw`（同形） |
| REQ body 鍵 | `{"stock_ids":[…]}`（字串陣列，10 檔） | `{"symbols":[{"symbol":"…"}]}`（物件陣列，10 檔） |
| 識別欄 | `stock_id`（`0050.TW` 形） | `symbol`（`TAIFEX_TX` 形） |
| 獨有回應欄 | 無 | `settlement_price`、`contract_month`（`202610` 全 10 檔一致）；`open_interest`（當時全 null） |
| 共有回應欄 | `asset_type, current_price, ask, bid, total_volume, daily_change, daily_change_percent` | 同左 7 欄 |
| 實測極端 | `ask−bid=0.01`（ETF 檔檔 1 tick） | `TAIFEX_RWF ask=0 bid=7160`（一邊掛零，實測原文）；`settlement_price=null` 全空 |
| body 大小 | REQ `131` bytes／RESP `1669` bytes | RESP `2316` bytes（REQ 未量，物件包裝較肥，推測） |

### 11.2 行事曆家族：query params 差異（日切片 `2026-09-18`）

| 端點 | `start/end_date` | `markets[]` | `size/page` | `stock_filter` | `market` | `region` |
|---|---|---|---|---|---|---|
| `calendar/earnings` | 09-18／09-18 | `tw` | 50／1 | `all`（有） | 無 | tw |
| `calendar/earnings-calls` | 09-18／09-18 | `tw` | 50／1 | `all`（有） | 無 | tw |
| `calendar/economic` | 09-18／09-18 | `tw` | 50／1 | 無 | 無 | tw |
| `calendar/holidays` | 09-18／09-18 | `tw` | 50／1 | 無 | 無 | tw |
| `calendar/dividends` | 09-18／09-18 | `tw` | 50／1 | `all`（有） | 無 | tw |
| `calendar/stats` | 09-14／09-20（週） | `tw` | 無／無 | `all`（有） | 無 | tw |
| `earnings-calls/list`（對照組） | 09-12／09-18（週） | 無 | （`size=0` 回 61 筆） | `all` | `market=tw`（單數） | tw |

規律（實測歸納）：`stock_filter` 只出現在跟個股掛鉤的三支（earnings／earnings-calls／dividends＋stats），economic／holidays 無；`markets[]`（陣列）只屬於 calendar 家族，`market=tw`（單數）屬於榜單（etf）與 earnings-calls/list。

### 11.3 三榜 `news/stock/list`：active vs rise vs fall

| 項目 | `sort=active` | `sort=rise` | `sort=fall` |
|---|---|---|---|
| 完整 query（全站版） | `?sort=active&region=tw` | `?sort=rise&region=tw` | `?sort=fall&region=tw` |
| 個股頁版（多 `stock_id`） | `&stock_id=2330.TW`（同端點） | 同左 | 同左 |
| 首筆 | `2303.TW 聯華電子 156 +5.76% vol=300960000` | `3443.TW 創意電子 7150 +10% vol=2502000` | `1709.TW 和益 39.2 −8.73% vol=47867000` |
| 排序鍵（推測） | `daily_volume`（3 億掄元） | `daily_change_percent`（+10% 漲停） | `daily_change_percent`（−8.73% 最慘） |
| 筆數 | 5 筆 | 5 筆 | 5 筆 |
| 獨有欄（榜單 list 無） | `previous_close／history_date／snapshot_date`（三榜共有） | 同左 | 同左 |
| 快照一致 | `snapshot_date=2026-09-18 13:30:00.000+08:00` | 同左 | 同左 |

## 12. 設計觀察

1. **`region=tw` 全站統一**：HAR finance API 41 筆 query 100% 帶 `region=tw`；連新聞內文頁的 `related/symbols` 都帶 `region=tw`。region 是路由租戶鍵、不是資料市場鍵——市場用 `market=tw`／`markets[]=tw` 另表（§11.2）。
2. **POST 批量取價**：即時價只有 POST list 形（stock 用 `stock_ids[]`、futures 用 `symbols[{symbol}]`），無單筆 `GET …/price?stock_id=`（HAR 53 筆無此形）。榜單先給快照（§8.1–8.4），再用 POST 補 `ask/bid/total_volume`（榜單無此三欄，實測）——兩段式：靜態快照＋動態價量。
3. **short polling 30s**：`/market` 頁 `POST stock/current/price/list` 每 30 秒一輪（全站筆記 R7：100 秒觀測 29.9／30.0／30.1 s）；HAR 內該 POST 僅出現 1 次（抓包窗內未跨輪詢週期，實測）。無 WS／SSE 跡象（53 筆非圖片者 mime 全 `application/json`）。
4. **免登入讀全通**：53 筆 request headers 全無 `Authorization` 仍全 200（含價量 POST、法說會、行事曆、個股件套）；`allow-headers` 雖列 `Authorization` 但匿名未用。需登入的只有 `/watchlist`（UI「立即登入」）與 sparrowhawk 寫入側（全站筆記 §3.5）。
5. **id 命名自描述**：`call_id=TW_6214.TW_2026-09-17`＝`{REGION}_{code}_{date}`，即 `/quote/{code}/earnings-call/{call_id}` 尾段（§5.1）；k-line 用 `stock_id`（現貨）vs `symbol`（期貨）兩套鍵，價量 POST 沿用同一分野（§11.1）。
6. **空值誠實**：收盤後 `open_interest=null`、`settlement_price=null`、`avg_volume=null`、`eps_actual=null` 全鏈路透出 null 而非省略；`is_market_closed=true`＋`in_market_open=false`＋`snapshot_date` 三處互證收盤態（§6）。
7. **圖文分離**：行情 JSON 內只帶 `image` 簽名 URL，真正取圖走 `POST image/icd/url`（13 筆，REQ 一批多 URL）；新聞內文圖片同理（`img.biggo.com／img.bgo.one／img.youtube.com` 三源，§6）。
- 個股頁 OHLCV 表的專用端點（若有）未分離——目前行情數字由 k-line 末點＋POST 即時價＋UI 靜態欄位拼出（拼裝關係為推測）。

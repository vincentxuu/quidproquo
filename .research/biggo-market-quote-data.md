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
- 個股頁 OHLCV 表的專用端點（若有）未分離——目前行情數字由 k-line 末點＋POST 即時價＋UI 靜態欄位拼出（拼裝關係為推測）。

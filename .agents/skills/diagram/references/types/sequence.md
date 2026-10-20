# 循序圖（Sequence）

**適合：** 幾個參與者之間按時間先後來回傳訊息：請求與回應、協定交握、API 呼叫鏈、token 過期後的刷新重試、事故時各服務之間發生了什麼。

**不適合：** 只想說明元件怎麼連（用 `architecture.md`）；重點是「誰負責哪一步、在哪裡交接」而不是訊息本身（用 `swimlane.md`）；只有兩個參與者一來一回（一句話說完）。

## 版面

- 參與者是一排框，放在最上方，由左到右照「誰先發起」排：發起者放最左邊，最常被呼叫的放中間。參與者 3–4 個，最多 5 個。
- **生命線**：每個參與者框的下緣中點往下拉一條垂直的 `dg-rule`，一直拉到最後一則訊息下方 24–40。生命線用細實線，不要用 `dg-line--dashed`，虛線留給回應訊息，兩者才分得開。
- **時間由上往下**：訊息是兩條生命線之間的水平箭頭，每則訊息往下一格，間距 40–48（放得下上方的標籤）。
- **啟動條**：參與者正在處理請求的那段時間，在生命線上蓋一條寬 8 的 `dg-box`（`rx="2"`），從收到呼叫的上方 12 畫到送出回應的下方 12。發起者一直在等，可以不畫。
- 生命線間距 160–224，至少放得下最長的訊息標籤。3–4 條用 640 寬，真的要 5 條才放寬到 720。不要為了手機硬擠到 480：≤ 480 的圖在手機上會縮到 0.7 倍以下，訊息標籤會小於 9px，640 寬改成框內左右捲動反而讀得清楚。
- accent 只給「這張圖最想讓讀者看到的那則訊息」，通常是最後成功的回應。

## 訊息

| 種類 | 寫法 | 用在 |
|---|---|---|
| 呼叫 | `dg-line` 實線＋`#arrow` | 發出請求、等回應 |
| 回應 | `dg-line dg-line--dashed`＋`#arrow` | 回覆前一個呼叫，一律虛線 |
| 失敗回應 | `dg-line dg-line--warn dg-line--dashed`＋`#arrow-warn` | 401、逾時、錯誤 |
| 主要成功回應 | `dg-line dg-line--accent dg-line--dashed`＋`#arrow-accent` | 全圖 1 則 |
| 自己呼叫自己 | 從啟動條右緣出發的 ⊐ 形路徑 | 本地驗證、快取查詢 |

- **箭頭永遠水平。** 往上的訊息等於時間倒流；兩條生命線之間的訊息不准斜。
- 箭頭的起點貼著發送端的生命線或啟動條邊緣，終點停在接收端啟動條外 4（沒有啟動條就停在生命線外 4）。
- **標籤放在箭頭上方**，y = 線的 y − 12，`dg-edge`，水平置中在**發送端那一側的區段**。跨過中間生命線的長訊息，標籤放在不跨線的那一段，不要壓在中間那條生命線上。
- 標籤寫「傳什麼」：`GET /orders`、`401`、`新 access token`。技術內容加 `dg-mono`。
- 訊息穿過中間的生命線是循序圖的正常寫法，不用畫跨線半圓；但不能穿過啟動條。會穿過時，把訊息往下挪到那段啟動條結束之後。
- 自己呼叫自己：`M (cx+4) y H (cx+32) Q (cx+40) y (cx+40) (y+8) V (y+16) Q (cx+40) (y+24) (cx+32) (y+24) H (cx+8)`，標籤放在迴圈右邊 12、垂直置中，`text-anchor="start"`。

## 分支

流程有分支（token 有效／過期、重試）時，用一個 `dg-zone` 框住**只有參與這段分支的生命線**，左右各超出生命線 16 以上，框的左上角放 `dg-tag`（`ALT`、`OPT`、`LOOP`），下一行放 `dg-small` 的條件（`[token 過期]`）。`ALT` 的兩段之間用一條 `dg-rule` 隔開。

- 一張圖最多一個分支框，不要巢狀。兩段都要畫完整時，拆成兩張圖：主線一張、例外路徑一張。
- 只走一條路徑的話（像下方範例，讀者只需要看懂過期那條），不必畫框，直接畫那條路徑，在 `desc` 或正文交代前提。

## 逐步播放

循序圖是最適合逐步播放的圖型：每則訊息一步，`data-step` 標在訊息的 `<g>` 上（線＋標籤一組）；啟動條標成它涵蓋的所有步驟（`data-step="1 2 3"`）。步驟上限 8，超過就拆圖。參與者框和生命線不標，一直顯示。

## 範例

````markdown
```diagram
title: access token 過期時的刷新與重試
desc: 瀏覽器帶 token 呼叫 API 收到 401，向 Auth 服務用 refresh token 換到新 token 後重試，最後拿到資料。
step: 瀏覽器帶 access token 呼叫 API
step: API 驗證 token，發現已過期
step: API 回 401
step: 瀏覽器用 refresh token 向 Auth 服務換新
step: Auth 服務發回新的 access token
step: 瀏覽器帶新 token 重試
step: API 回 200 和訂單資料
---
<svg viewBox="0 0 640 456">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="440"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="440"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="440"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H312" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="208" y="108" text-anchor="middle" dominant-baseline="central">GET /orders</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M324 148H352Q360 148 360 156V164Q360 172 352 172H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="372" y="160" dominant-baseline="central">token 已過期</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M316 216H100" marker-end="url(#arrow-warn)"/>
    <text class="dg-edge dg-mono dg-text--warn" x="208" y="204" text-anchor="middle" dominant-baseline="central">401</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M96 264H536" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="208" y="252" text-anchor="middle" dominant-baseline="central">POST /refresh</text>
  </g>
  <g data-step="5">
    <path class="dg-line dg-line--dashed" d="M540 304H100" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="292" text-anchor="middle" dominant-baseline="central">新 access token</text>
  </g>
  <g data-step="6">
    <path class="dg-line" d="M96 352H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="340" text-anchor="middle" dominant-baseline="central">帶新 token 重試</text>
  </g>
  <g data-step="7">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M316 400H100" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge" x="208" y="388" text-anchor="middle" dominant-baseline="central">200 訂單資料</text>
  </g>

  <rect class="dg-box" x="316" y="108" width="8" height="120" rx="2" data-step="1 2 3"/>
  <rect class="dg-box" x="540" y="252" width="8" height="64" rx="2" data-step="4 5"/>
  <rect class="dg-box" x="316" y="340" width="8" height="72" rx="2" data-step="6 7"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">瀏覽器</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">API</text>
  <rect class="dg-box" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">Auth 服務</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 訊息箭頭往上或斜著畫 | 時間是由上往下流的，往上等於倒帶 |
| 回應用實線 | 呼叫和回應分不開，讀者看不出哪則在等哪則 |
| 生命線也用虛線 | 和回應訊息撞線型，整張圖都是虛線 |
| 標籤壓在中間那條生命線上 | 標籤被線切斷；挪到不跨線的那一段 |
| 啟動條畫了沒收 | 看不出那個參與者什麼時候處理完 |
| 用泳道畫訊息往返 | 泳道講「誰做哪一步」，訊息往返要用生命線 |
| if／else 畫成兩串漂浮的箭頭、沒有分支框 | 讀者分不出哪些訊息只在某個條件下發生 |
| 分支框裡再套分支框 | 拆成主線一張、例外路徑一張 |
| 兩條分支的成功回應都標 accent | accent 只給一則訊息 |
| 超過 5 個參與者或 8 則訊息 | 拆成總覽和細節兩張 |

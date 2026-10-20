# 桑基圖（Sankey）

**適合：** 一個數量跨幾個階段**分流又匯流**，讀者要看「量往哪裡去、哪一股最大」：請求從各入口分到快取／小模型／大模型，最後成功或失敗；預算從各部門流到各供應商；token 花在哪些步驟。這是唯一一種**帶子的粗細就是資料**的圖。

**不適合：**

- 只有一路往下流失、沒有分岔或匯流 → 漏斗（`pyramid.md`）。
- 量的大小不重要、只是步驟順序 → 流程圖（`flowchart.md`）或架構圖。
- 有回頭路、循環 → 狀態機或循環圖；桑基只能由左往右。
- 超過 3 個階段、8 個節點或 12 條帶子 → 拆成兩張（總覽一張、細節一張），或用表格列出各段數字。
- 讀者要的是精確數字 → 表格；桑基給的是比例感。

## 版面

- **剛好 3 欄**，由左到右；欄頭用 `dg-tag`（「入口」「路由」「結果」）置中在欄的上方。
- **節點是直立的細長條**：寬 12，`<rect class="dg-bar dg-c-ink">`，高度＝經過這個節點的數量 × k。
- 同一欄節點之間留空隙；中間欄的空隙要夠放標籤（約 40）。
- 標籤：名稱 `dg-label`、數量 `dg-sub` 寫在名稱下一行。左欄放在條的左邊（`text-anchor="end"`），右欄放在條的右邊（`start`），中間欄放在條**上方的空隙裡**、置中，不要貼著上一個節點。
- 不需要圖例：標籤直接寫在節點旁，焦點帶的意思寫在 caption。

## 曲線是允許的例外

連線規則第 1 條（只用水平、垂直線）**不適用於桑基的帶子**，和循環圖的弧線一樣是明文例外：帶子是面積編碼，不是連線。也因此：

- **不加箭頭**，方向由欄的左右順序表達。
- 每條帶子是一個封閉的 `<path class="dg-flow">`：上緣從來源條的右邊畫三次貝茲曲線到目標條的左邊，往下接到帶子下緣，再用同樣的曲線反向回來。
- **兩個控制點都放在兩欄正中間的 x**，y 分別等於起點和終點的 y，帶子才會水平地離開、水平地接上節點：

  ```svg
  <!-- 來源條右緣 xs、目標條左緣 xt、mx =（xs + xt）÷ 2
       來源段 s0–s1、目標段 t0–t1 -->
  <path class="dg-flow dg-c-muted" d="M xs s0 C mx s0 mx t0 xt t0 V t1 C mx t1 mx s1 xs s1 Z"/>
  ```

  把第二個控制點放在目標的 x（`C mx s0 xt t1 xt t1`）會讓帶子斜斜地插進節點，看起來像沒接上。

## 數值換算成帶寬

```text
帶寬（以及節點高度）= 數量 × k，全圖只有一個 k
```

- 範例：k = 0.24，所以每 50 次請求＝12 單位，1,000 次＝240。
- **自己能選數字時，選剛好落在 4 的倍數的量**（k = 0.24 時取 50 的倍數），畫出來的面積就等於印出來的數字。真實資料對不上格線時，誤差不超過一個 4 的級距，並在 caption 寫明 k。
- **每一欄加總要相等**（進多少、出多少）；每個節點流出的帶子寬度加總要等於節點高度。對不起來就是資料漏了，或圖畫錯了。
- 帶寬小於 4 的流向合併成一條「其他」，不要畫成看不見的細線。
- 同一個節點上的帶子依序排開、不重疊：流出的帶子照目標的上下順序排，流入的帶子照來源的上下順序排。
- 調整同一欄的節點順序，讓交叉最少；兩條帶子交叉不只一次，就是節點順序錯了。
- 數值必須來自文章引用的來源；示意圖在 caption 寫「示意資料」。

## 顏色

- 一般帶子全部 `dg-flow dg-c-muted`（淡灰），**正文要講的那一股**用 `dg-c-accent`，最後才畫，疊在最上面。一條路徑跨兩段時，兩段都標 accent 也只算一個焦點。
- 不要每條帶子一個顏色：讀者會開始找顏色的意義，而不是看粗細。
- 繪製順序：欄頭 → 一般帶子 → 焦點帶子 → 節點條 → 標籤。

## 範例

````markdown
```diagram
title: 1,000 次請求流向哪裡
desc: 網頁 600 次、API 400 次請求分到快取 300、大模型 250、小模型 450；最後 800 次成功、200 次失敗，失敗裡有 150 次來自小模型。
caption: 示意資料。帶寬與節點高度＝請求數 × 0.24（每 50 次＝12 單位）；綠色帶是小模型的失敗，占全部失敗的四分之三。
---
<svg viewBox="0 0 640 456">
  <text class="dg-tag" x="126" y="28" text-anchor="middle" dominant-baseline="central">入口</text>
  <text class="dg-tag" x="320" y="28" text-anchor="middle" dominant-baseline="central">路由</text>
  <text class="dg-tag" x="514" y="28" text-anchor="middle" dominant-baseline="central">結果</text>
  <path class="dg-flow dg-c-muted" d="M132 112C223 112 223 92 314 92V140C223 140 223 160 132 160Z"/>
  <path class="dg-flow dg-c-muted" d="M132 160C223 160 223 216 314 216V240C223 240 223 184 132 184Z"/>
  <path class="dg-flow dg-c-muted" d="M132 184C223 184 223 328 314 328V400C223 400 223 256 132 256Z"/>
  <path class="dg-flow dg-c-muted" d="M132 280C223 280 223 140 314 140V164C223 164 223 304 132 304Z"/>
  <path class="dg-flow dg-c-muted" d="M132 304C223 304 223 240 314 240V276C223 276 223 340 132 340Z"/>
  <path class="dg-flow dg-c-muted" d="M132 340C223 340 223 400 314 400V436C223 436 223 376 132 376Z"/>
  <path class="dg-flow dg-c-muted" d="M326 92C417 92 417 108 508 108V180C417 180 417 164 326 164Z"/>
  <path class="dg-flow dg-c-muted" d="M326 216C417 216 417 180 508 180V228C417 228 417 264 326 264Z"/>
  <path class="dg-flow dg-c-muted" d="M326 264C417 264 417 332 508 332V344C417 344 417 276 326 276Z"/>
  <path class="dg-flow dg-c-muted" d="M326 328C417 328 417 228 508 228V300C417 300 417 400 326 400Z"/>
  <path class="dg-flow dg-c-accent" d="M326 400C417 400 417 344 508 344V380C417 380 417 436 326 436Z"/>
  <rect class="dg-bar dg-c-ink" x="120" y="112" width="12" height="144"/>
  <rect class="dg-bar dg-c-ink" x="120" y="280" width="12" height="96"/>
  <rect class="dg-bar dg-c-ink" x="314" y="92" width="12" height="72"/>
  <rect class="dg-bar dg-c-ink" x="314" y="216" width="12" height="60"/>
  <rect class="dg-bar dg-c-ink" x="314" y="328" width="12" height="108"/>
  <rect class="dg-bar dg-c-ink" x="508" y="108" width="12" height="192"/>
  <rect class="dg-bar dg-c-ink" x="508" y="332" width="12" height="48"/>
  <text class="dg-label" x="112" y="174" text-anchor="end" dominant-baseline="central">網頁</text>
  <text class="dg-sub" x="112" y="194" text-anchor="end" dominant-baseline="central">600 次</text>
  <text class="dg-label" x="112" y="318" text-anchor="end" dominant-baseline="central">API</text>
  <text class="dg-sub" x="112" y="338" text-anchor="end" dominant-baseline="central">400 次</text>
  <text class="dg-label" x="320" y="60" text-anchor="middle" dominant-baseline="central">快取命中</text>
  <text class="dg-sub" x="320" y="80" text-anchor="middle" dominant-baseline="central">300 次</text>
  <text class="dg-label" x="320" y="184" text-anchor="middle" dominant-baseline="central">大模型</text>
  <text class="dg-sub" x="320" y="204" text-anchor="middle" dominant-baseline="central">250 次</text>
  <text class="dg-label" x="320" y="296" text-anchor="middle" dominant-baseline="central">小模型</text>
  <text class="dg-sub" x="320" y="316" text-anchor="middle" dominant-baseline="central">450 次</text>
  <text class="dg-label" x="528" y="194" dominant-baseline="central">成功</text>
  <text class="dg-sub" x="528" y="214" dominant-baseline="central">800 次</text>
  <text class="dg-label dg-text--accent" x="528" y="346" dominant-baseline="central">失敗</text>
  <text class="dg-sub" x="528" y="366" dominant-baseline="central">200 次</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 帶子斜斜地插進節點 | 控制點放錯；兩個控制點都要在兩欄中間的 x |
| 帶子加箭頭 | 帶子是面積不是連線，箭頭只是雜訊 |
| 每一欄的加總不一樣 | 讀者會以為資料漏了；進出要平衡 |
| 節點高度和印出的數字對不上 | 這種圖的前提就是粗細等於數量 |
| 每條帶子一個顏色 | 搶走粗細的訊號；灰色加一條焦點 |
| 帶子交叉好幾次 | 重排同一欄的節點順序 |
| 細到看不見的帶子 | 合併成「其他」 |
| 中間欄標籤貼著上一個節點 | 看起來屬於上面那個；置中在空隙裡 |
| 標籤底下墊白色方塊遮帶子 | 像在圖上打洞；把標籤放在空隙裡 |
| 一路流失、沒有分岔的資料畫成桑基 | 那是漏斗 |
| 超過 3 欄 | 拆成兩張 |

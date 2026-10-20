# 折線圖（Line）

**適合：** 數值沿著時間或一個有順序的索引連續變化，讀者要看的是「方向和變化速度」：每週部署次數、每月活躍使用者、每個版本的延遲。同一張圖可以放 2–3 條線比較走勢。

另外四種變體也寫在這份檔案裡：**斜率圖**（只有兩個時間點）、**bump 圖**（名次變化）、**ridgeline**（幾組分佈的形狀）、**streamgraph**（總量和組成一起變）。

**不適合：**

- 類別之間沒有順序（各模型、各團隊同一時間的比較）→ 長條圖（`bar.md`）。
- 只有兩個時間點 → 斜率圖（本檔下方）或 dumbbell（`bar.md`）。
- 只有 2–3 個資料點 → 一句話；讀者要查精確數值 → 普通 Markdown 表格。
- 資料點超過 12 個、系列超過 3 條、要縮放或滑鼠查值 → `dataviz` skill（互動、大量資料）。手算幾十個座標既慢又容易錯。
- 兩個變數在不同單位上的關係 → 散點圖（`dataviz`）。

## 版面

- viewBox 寬 640。繪圖區左邊留約 72 給刻度數字，**右邊留約 120 給線尾的系列名**，下方留約 40 給橫軸刻度。
- **4–12 個資料點**，橫軸等距。點太少寫成一句話，太多就合併成較粗的時間單位（日 → 週）。
- **3–5 條 `dg-grid` 橫格線**，刻度數字 `dg-small` 靠右放在繪圖區左邊外 8；基線用 `dg-axis`。單位寫一次，放在縱軸刻度上方。
- 橫軸刻度（W1、W2…）`dg-small` 置中放在基線下方 20；刻度太密就隔一個標一個。
- **系列名直接標在線尾**（最後一個點右邊 12，`dg-text--series`），不放圖例。兩條線的終點太近（y 差小於 20）時，名字往上下錯開一點，但點的位置不能動。
- 折線用 `<polyline class="dg-plot-line">` 或 `<path>`，**只用直線段連接資料點**；不要畫平滑曲線，曲線會在兩點之間生出沒量過的高峰低谷。
- 資料點的圓點（`dg-point`，`r="4"`）**只畫在焦點系列上**；其他系列只有線。
- 需要強調「累積量」時，可以在焦點線下方加一塊 `dg-plot-area`，從線一路封到基線；其他系列不加面積。

## 顏色

- 焦點系列一條：`dg-c-accent`、`dg-plot-line`（粗 2），有資料點，線尾名稱用 `dg-label`。
- 其他系列依序 `dg-c-s1`、`dg-c-s2`…，用 `dg-plot-line dg-plot-line--thin`，線尾名稱用 `dg-sub`。顏色 class 放在包住線和名稱的 `<g>` 上，兩者自動同色。
- 最多 3 條線（`dataviz` 才處理更多）；超過就拆成小圖，或把非焦點系列合併成一條 `dg-c-muted`「其他」。

## 數值換算成座標（必做）

```text
基線 y0 = 300、繪圖區頂 60、網域 0–20（次）
k = (300 − 60) ÷ 20 = 12
點的 y = 300 − 值 × 12
點的 x = 起點 x + 第 i 個點 × 間距（範例：80 + 60i）
```

- **x 跟時間成正比。** 中間缺一期，就留空位、斷開線（分成兩段 polyline），不要把前後兩點直接連起來假裝連續。
- **縱軸預設從 0 起。** 只有在「絕對大小不重要、重點是波動」時（例如延遲在 180–220 ms 之間起伏）才可以截掉，而且 caption 要寫明網域、刻度要標出起點數字。
- 每個座標都從原始數字算出來；數字要有出處（官方報告、公開 dashboard、自己的量測方法寫在正文）。教學用的假資料在 caption 寫「示意」。

## 範例

````markdown
```diagram
title: 三個團隊八週來的每週部署次數
desc: 平台組的每週部署次數從 4 次穩定爬升到 17 次；App 組在 6 到 9 次之間持平，資料組維持在 3 到 6 次。
caption: 示意資料。換算：y = 300 − 次數 × 12，x = 80 + 60 × (週數 − 1)，縱軸從 0 起。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">每週部署次數</text>
  <line class="dg-grid" x1="72" y1="60" x2="508" y2="60"/>
  <line class="dg-grid" x1="72" y1="120" x2="508" y2="120"/>
  <line class="dg-grid" x1="72" y1="180" x2="508" y2="180"/>
  <line class="dg-grid" x1="72" y1="240" x2="508" y2="240"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">20</text>
  <text class="dg-small" x="64" y="120" text-anchor="end" dominant-baseline="central">15</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">10</text>
  <text class="dg-small" x="64" y="240" text-anchor="end" dominant-baseline="central">5</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>
  <line class="dg-axis" x1="72" y1="300" x2="508" y2="300"/>

  <g class="dg-c-s2">
    <polyline class="dg-plot-line dg-plot-line--thin" points="80,264 140,264 200,252 260,264 320,240 380,252 440,240 500,228"/>
    <text class="dg-sub dg-text--series" x="512" y="232" dominant-baseline="central">資料組 6</text>
  </g>
  <g class="dg-c-s1">
    <polyline class="dg-plot-line dg-plot-line--thin" points="80,228 140,216 200,228 260,204 320,216 380,192 440,204 500,192"/>
    <text class="dg-sub dg-text--series" x="512" y="192" dominant-baseline="central">App 組 9</text>
  </g>
  <g class="dg-c-accent">
    <polyline class="dg-plot-line" points="80,252 140,240 200,216 260,204 320,180 380,144 440,120 500,96"/>
    <circle class="dg-point" cx="80" cy="252" r="4"/>
    <circle class="dg-point" cx="140" cy="240" r="4"/>
    <circle class="dg-point" cx="200" cy="216" r="4"/>
    <circle class="dg-point" cx="260" cy="204" r="4"/>
    <circle class="dg-point" cx="320" cy="180" r="4"/>
    <circle class="dg-point" cx="380" cy="144" r="4"/>
    <circle class="dg-point" cx="440" cy="120" r="4"/>
    <circle class="dg-point" cx="500" cy="96" r="4"/>
    <text class="dg-label dg-text--series" x="512" y="96" dominant-baseline="central">平台組 17</text>
  </g>

  <text class="dg-small" x="80" y="320" text-anchor="middle" dominant-baseline="central">W1</text>
  <text class="dg-small" x="140" y="320" text-anchor="middle" dominant-baseline="central">W2</text>
  <text class="dg-small" x="200" y="320" text-anchor="middle" dominant-baseline="central">W3</text>
  <text class="dg-small" x="260" y="320" text-anchor="middle" dominant-baseline="central">W4</text>
  <text class="dg-small" x="320" y="320" text-anchor="middle" dominant-baseline="central">W5</text>
  <text class="dg-small" x="380" y="320" text-anchor="middle" dominant-baseline="central">W6</text>
  <text class="dg-small" x="440" y="320" text-anchor="middle" dominant-baseline="central">W7</text>
  <text class="dg-small" x="500" y="320" text-anchor="middle" dominant-baseline="central">W8</text>
</svg>
```
````

## 變體

四種變體都還是 ```` ```diagram ```` 區塊、同一套 class；版面差在下面幾點。換算方式照上面，比例尺一樣寫進 caption。

### 斜率圖（slopegraph）

**用在：** 剛好兩個時間點（今年 vs 去年、改版前 vs 後），4–8 個系列，讀者要看「誰漲誰跌、漲多快、名次有沒有交換」。三個時間點以上就回到一般折線圖或 bump 圖。

- 兩條垂直 `dg-axis` 當左右兩個狀態，相距約 300（比繪圖區高度窄，斜率差異才看得出來），狀態名稱 `dg-label` 放在軸下方。
- 每個系列一條直線，兩端都有 `dg-point`（`r="3"`，焦點 `r="4"`）。**不畫格線**：兩端都標數值，軸本身就是比例尺。
- 左端：名稱和數值靠右放在左軸外側；右端：數值和名稱靠左放在右軸外側。兩端名稱太擠是因為數值本來就接近，**不要移動點來騰位置**（那會改掉資料），改成只標一端名稱，或合併兩條。
- 兩根軸**同一個比例尺、同一個起點**，否則每條線的角度都是假的。網域不必從 0 起，但要寫在 caption。
- 焦點系列 `dg-c-accent`＋`dg-plot-line`，其他系列 `dg-c-muted`＋`dg-plot-line--thin`：兩端都有名字，不需要用色相區分系列。
- 直線只連接兩個端點，不代表中間怎麼走；正文不要從線上讀中間值。

```svg
<!-- 一個系列：去年 320 ms → 今年 410 ms；y = 380 − (ms − 100) × 0.8 -->
<g class="dg-c-accent">
  <line class="dg-plot-line" x1="200" y1="204" x2="500" y2="132"/>
  <circle class="dg-point" cx="200" cy="204" r="4"/>
  <circle class="dg-point" cx="500" cy="132" r="4"/>
  <text class="dg-label dg-text--series" x="188" y="204" text-anchor="end" dominant-baseline="central">搜尋 API 320</text>
  <text class="dg-label dg-text--series" x="512" y="132" dominant-baseline="central">410</text>
</g>
```

### Bump 圖（名次）

**用在：** 3–6 個時間點的**名次**變化，重點是位置不是大小（各套件每季下載量排名）。數值翻倍但名次不變會畫成一條水平線，如果這件事重要，改用一般折線圖。

- 每個時間點一條垂直 `dg-grid`；名次是固定列距：`y = 頂 + 列距 × (名次 − 1)`，例如 `y = 80 + 44 × (名次 − 1)`。名次是序數，**每個頂點都剛好落在列上**。
- 相鄰時間點之間用直線段，每個頂點都有 `dg-point`。
- 系列名和名次（`#1`、`#2`）標在第一個和最後一個時間點外側，`#` 讓讀者不會把名次讀成數量。
- 焦點系列 `dg-c-accent`，其他 `dg-c-muted`；最多 8 個系列。
- 某期掉出榜外就斷開線，不要畫到底部假裝它是最後一名。

### Ridgeline

**用在：** 3–8 組**分佈**的形狀比較（各服務的延遲分佈、各版本的建置時間分佈），讀者要看「哪一組雙峰、哪一組拖了長尾」。

- 每組一條基線（`dg-rule`），等距往下排（例如列距 52）；組名 `dg-label` 靠右放在基線左側外。
- 每組分佈是一個 `<path class="dg-plot-area">`：沿著共同的 x 刻度（分箱）走直線段，頭尾都回到自己的基線，再用 `Z` 封起來。**不要平滑**。
- 峰可以侵入上一列（這是 ridgeline 的特色），但不能高到蓋住上上一列；調高度時所有組用**同一個振幅比例**。
- 高度代表比例不是總量：每組先除以自己的總數再乘振幅，caption 要寫這件事和分箱寬度。
- 焦點組 `dg-c-accent`，其他組 `dg-c-muted`；畫的順序由上而下，下面的組會蓋住上面組的尾巴。

```svg
<!-- 一組：基線 y = 200，分箱間距 30，振幅 1 個百分點 = 2 單位 -->
<line class="dg-rule" x1="200" y1="200" x2="560" y2="200"/>
<path class="dg-plot-area dg-c-accent" d="M200 200 L230 192 L260 160 L290 120 L320 150 L350 176 L380 188 L410 196 L440 200 Z"/>
<text class="dg-label dg-text--series dg-c-accent" x="188" y="200" text-anchor="end" dominant-baseline="central">搜尋服務</text>
```

### Streamgraph

**用在：** 很多期（8 期以上）、2–5 個組成項目，讀者要看「總量和組成一起起伏」的大形狀（各管線每週的建置分鐘數）。讀者拿到的是形狀，不是精確數字；要數字就用堆疊長條或表格。

- 每一期的堆疊以一條水平中線上下對稱（中線以上、以下各一半總量），所有項目、所有期都用同一個比例尺。
- 每個項目是一塊 `dg-plot-area`，上緣與下緣都經過每一期的真實累計值；項目順序整張圖固定，最大的放最中間。
- 不畫縱軸刻度和格線；圖例寫每個項目的總量（`dg-swatch` + 名稱 + 總數），總數要等於各期加總。
- 某期是 0 就讓那一帶收成 0，不要補值或跳過。
- **手算成本很高**（每一期每一層都要算上下兩個 y）。超過 12 期或 4 層，交給 `dataviz`。

## 反模式

| 反模式 | 問題 |
|---|---|
| 平滑曲線連接取樣資料 | 在兩點之間生出沒量過的峰谷 |
| 超過 3 條線、每條都有圓點 | 糊成一團；只有焦點系列畫點，多的拆圖或交給 `dataviz` |
| 底部圖例、線尾不標名字 | 讀者得來回對照顏色；直接標在線尾 |
| 截掉縱軸卻沒寫網域 | 小波動被放大成劇烈變化 |
| x 間距不跟時間成比例、缺期直接連起來 | 假裝資料連續，速度也失真 |
| 斜率圖兩根軸用不同比例尺 | 每條線的角度都是假的 |
| 為了排標籤移動資料點 | 把版面問題變成錯誤的數字 |
| Ridgeline 每組各自縮放 | 組與組之間的形狀不能比 |
| 數值沒有出處、caption 沒寫換算 | 讀者無法核對 |

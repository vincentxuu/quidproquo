# 極座標圖（Polar，放射棒棒糖）

**適合：** **一個**數量在 4–8 個**會循環**的類別上的大小，而且順時針的順序本身有意義：一天各時段的請求量、一週七天的部署次數、一年各月的流量、羅盤方位。圓形讓「頭尾相接」看得出來（23 點之後接 0 點），這是長條圖（`bar.md`）做不到的。

**不適合：**

- 類別沒有循環順序（模型名稱、團隊、功能）→ 長條圖或表格。沒有循環卻畫成圓，只是讓長度更難比。
- 要比精確數值、或兩個值很接近 → 長條圖：直線上比長度，比放射狀比長度準。
- 多個系列（例如這週和上週）→ 改成兩條折線或分組長條；要比的是幾個對象在幾個面向的分數 → 雷達圖（`radar.md`）。
- 超過 8 個時段 → 折線圖（`line.md`）。
- 定性的輪盤（人格類型、能力輪）→ 不是數量，不要畫成看起來像數量的圖。

## 版面

- 圖本身接近正方形，**收進 440 寬**，手機上不用左右捲：中心約 (220, 196)，半徑 R = 120，四周留約 70 放類別名稱。440 寬的圖最小字 12.5，所以不用 `dg-small`、`dg-tag`。
- 刻度：5 個同心圓（20%、40%…100% 的 R），內圈 `dg-grid`，最外圈 `dg-rule`；每個類別一條從中心到外圈的淡輻條（`dg-grid`）。
- 刻度數字只標一組，放在第一、第二條輻條**中間**的角度上（那裡沒有數值線經過），直接壓在各圈上，用自帶描邊遮罩的 `dg-edge` 置中，最後才畫。最內圈離短的數值線太近時可以不標。
- **第一個類別在正上方（12 點鐘方向）**，順時針排列，保持原本的順序；不要依數值排序，那會毀掉循環的意義。
- 類別名稱（`dg-label`）和數值（`dg-sub`）放在外圈再往外約 20 的位置，兩行一組；靠近正上、正下的用 `text-anchor="middle"`，右半邊 `start`，左半邊 `end`。名稱一律橫寫，不沿圓周旋轉。
- 單位寫在 title、desc 或 caption 裡，不要在每個數值後面重複。

## 數值換算成座標

第 i 個類別（從 0 開始、共 N 個），數值 v、刻度上限 M、中心 (cx, cy)、半徑 R：

```text
角度 = −90° + 360° × i ÷ N
r = R × v ÷ M
x = cx + r × cos(角度)
y = cy + r × sin(角度)
```

- **長度和數值成正比**，刻度一定從 0 開始，中心就是 0。不要留中空的甜甜圈洞，那會讓長度不再和數值成正比。
- 每個值畫一條從中心到 (x, y) 的線（`dg-plot-line`）加一個端點圓（`dg-point`）。端點圓大小固定，不代表數值。
- **不要畫扇形或填色楔形**：扇形面積隨半徑平方成長，數值兩倍的扇形看起來是四倍。這就是本圖用「棒棒糖」而不用玫瑰圖（Nightingale rose）的原因。
- 數值為 0 的類別不畫線也不畫點，但保留輻條，數值寫「0」；缺資料不能當 0，要在 caption 說明。
- 數值必須來自文章引用的來源；示意圖在 caption 寫「示意資料」。

## 顏色

- 一般類別 `dg-c-muted`（灰線、r = 4 的點），焦點類別（全圖一個，正文在講的那個）`dg-c-accent`（r = 5 的點），名稱加 `dg-text--accent`。焦點最後畫。
- 灰階列印也要讀得懂：資料靠長度和數字，accent 只負責指出重點。

## 範例

````markdown
```diagram
title: 一天中 12–15 時的請求最多
desc: 依三小時分段的請求量，以尖峰為 100；12–15 時最高，15–21 時維持在 75 以上，凌晨 3–6 時最低只有 18，曲線在午夜前後相接。
caption: 示意資料。單位：占當日尖峰的百分比；線長＝數值 ÷ 100 × 半徑 120，順時針從 0 時開始。
---
<svg viewBox="0 0 440 388">
  <circle class="dg-grid" cx="220" cy="196" r="24"/>
  <circle class="dg-grid" cx="220" cy="196" r="48"/>
  <circle class="dg-grid" cx="220" cy="196" r="72"/>
  <circle class="dg-grid" cx="220" cy="196" r="96"/>
  <circle class="dg-rule" cx="220" cy="196" r="120"/>
  <line class="dg-grid" x1="220" y1="196" x2="220" y2="76"/>
  <line class="dg-grid" x1="220" y1="196" x2="304.9" y2="111.1"/>
  <line class="dg-grid" x1="220" y1="196" x2="340" y2="196"/>
  <line class="dg-grid" x1="220" y1="196" x2="304.9" y2="280.9"/>
  <line class="dg-grid" x1="220" y1="196" x2="220" y2="316"/>
  <line class="dg-grid" x1="220" y1="196" x2="135.1" y2="280.9"/>
  <line class="dg-grid" x1="220" y1="196" x2="100" y2="196"/>
  <line class="dg-grid" x1="220" y1="196" x2="135.1" y2="111.1"/>
  <line class="dg-plot-line dg-c-muted" x1="220" y1="196" x2="220" y2="157.6"/>
  <circle class="dg-point dg-c-muted" cx="220" cy="157.6" r="4"/>
  <line class="dg-plot-line dg-c-muted" x1="220" y1="196" x2="235.3" y2="180.7"/>
  <circle class="dg-point dg-c-muted" cx="235.3" cy="180.7" r="4"/>
  <line class="dg-plot-line dg-c-muted" x1="220" y1="196" x2="248.8" y2="196"/>
  <circle class="dg-point dg-c-muted" cx="248.8" cy="196" r="4"/>
  <line class="dg-plot-line dg-c-muted" x1="220" y1="196" x2="269.2" y2="245.2"/>
  <circle class="dg-point dg-c-muted" cx="269.2" cy="245.2" r="4"/>
  <line class="dg-plot-line dg-c-muted" x1="220" y1="196" x2="150.4" y2="265.6"/>
  <circle class="dg-point dg-c-muted" cx="150.4" cy="265.6" r="4"/>
  <line class="dg-plot-line dg-c-muted" x1="220" y1="196" x2="128.8" y2="196"/>
  <circle class="dg-point dg-c-muted" cx="128.8" cy="196" r="4"/>
  <line class="dg-plot-line dg-c-muted" x1="220" y1="196" x2="181.8" y2="157.8"/>
  <circle class="dg-point dg-c-muted" cx="181.8" cy="157.8" r="4"/>
  <line class="dg-plot-line dg-c-accent" x1="220" y1="196" x2="220" y2="316"/>
  <circle class="dg-point dg-c-accent" cx="220" cy="316" r="5"/>
  <text class="dg-edge" x="238.4" y="151.7" text-anchor="middle" dominant-baseline="central">40</text>
  <text class="dg-edge" x="247.6" y="129.5" text-anchor="middle" dominant-baseline="central">60</text>
  <text class="dg-edge" x="256.7" y="107.3" text-anchor="middle" dominant-baseline="central">80</text>
  <text class="dg-edge" x="265.9" y="85.1" text-anchor="middle" dominant-baseline="central">100</text>
  <text class="dg-label" x="220" y="36" text-anchor="middle" dominant-baseline="central">00–03</text>
  <text class="dg-sub" x="220" y="56" text-anchor="middle" dominant-baseline="central">32</text>
  <text class="dg-label" x="319" y="87" text-anchor="start" dominant-baseline="central">03–06</text>
  <text class="dg-sub" x="319" y="107" text-anchor="start" dominant-baseline="central">18</text>
  <text class="dg-label" x="360" y="186" text-anchor="start" dominant-baseline="central">06–09</text>
  <text class="dg-sub" x="360" y="206" text-anchor="start" dominant-baseline="central">24</text>
  <text class="dg-label" x="319" y="285" text-anchor="start" dominant-baseline="central">09–12</text>
  <text class="dg-sub" x="319" y="305" text-anchor="start" dominant-baseline="central">58</text>
  <text class="dg-label dg-text--accent" x="220" y="336" text-anchor="middle" dominant-baseline="central">12–15</text>
  <text class="dg-sub" x="220" y="356" text-anchor="middle" dominant-baseline="central">100</text>
  <text class="dg-label" x="121" y="285" text-anchor="end" dominant-baseline="central">15–18</text>
  <text class="dg-sub" x="121" y="305" text-anchor="end" dominant-baseline="central">82</text>
  <text class="dg-label" x="80" y="186" text-anchor="end" dominant-baseline="central">18–21</text>
  <text class="dg-sub" x="80" y="206" text-anchor="end" dominant-baseline="central">76</text>
  <text class="dg-label" x="121" y="87" text-anchor="end" dominant-baseline="central">21–24</text>
  <text class="dg-sub" x="121" y="107" text-anchor="end" dominant-baseline="central">45</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 畫成填色扇形或玫瑰圖 | 面積隨半徑平方放大，大的看起來誇張好幾倍 |
| 中心留一個洞 | 線長不再和數值成正比 |
| 刻度不從 0 開始 | 放大差距 |
| 依數值大小重排類別 | 循環順序就是這張圖存在的理由 |
| 類別沒有循環順序 | 用長條圖，比長度更準 |
| 疊兩個以上的系列 | 線會交錯糊在一起；改折線或分組長條 |
| 類別名稱沿圓周旋轉 | 讀不了；一律橫寫 |
| 缺資料當 0 畫 | 讀者會以為真的是 0 |
| 每個數值後面都寫單位 | 雜亂；單位寫一次就好 |

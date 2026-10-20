# 長條圖（Bar）

**適合：** 幾個類別之間的數量比較，每個類別一個數值，讀者要看的是「誰比較多、多多少」：各模型的回應延遲、各團隊的每週部署次數、各方案的月費。變體 dumbbell（啞鈴圖）用在每個類別剛好有**兩個值**、而重點是兩者的差距：改版前後、目標與實際、兩個族群。

**不適合：**

- 數值隨時間連續變化、重點是趨勢 → 折線圖（`line.md`）。
- 起點總額經過幾筆增減接到終點總額 → 瀑布圖（`waterfall.md`）。
- 只有兩三個數字 → 一句話；讀者要逐格查精確數值（價格表、規格表）→ 普通 Markdown 表格。
- 類別超過 8 個、資料要互動篩選、或是幾百筆原始資料 → `dataviz` skill（互動、大量資料）。
- 數值是定性評等（好／普通／差）→ 比較矩陣（`matrix.md`）。

## 版面

- **預設直條**，類別放橫軸、數值放縱軸。類別名稱長（超過 5 個中文字）或類別多於 6 個時改成**橫條**：類別名稱放左側一欄，橫條往右長，名字不用轉角度。
- viewBox 寬 640。繪圖區左邊留約 72 給刻度數字，下方留約 40 給類別名稱，上方留約 40 給單位和最高那根的數值。
- **4–8 根長條。** 長條寬度 ≥ 間距的一半（範例：間距 108、條寬 64），條與條之間的空白不要比條還寬。
- **縱軸不畫軸線，只畫格線**：2–5 條 `dg-grid` 橫線（範例只留 2、4 兩條，避免穿過數值標籤），刻度數字用 `dg-small` 靠右對齊放在繪圖區左邊外 8。基線（數值 0）用 `dg-axis` 實線，一路畫過所有長條。
- **單位只寫一次**：放在縱軸刻度上方，例如「延遲（秒）」；刻度數字本身只寫數字。
- **數值直接標在長條上方** 10（`dg-sub`），焦點那根用 `dg-label dg-text--accent`。每根都標值時，格線可以只留兩三條。
- 類別名稱放在基線下方 20，以長條中心置中。焦點那根的名稱加 `dg-text--accent`。
- 長條不畫圓角（`rx` 不寫或寫 `2`），不加外框、陰影、立體。

## 顏色

- 同一個系列的長條**同一個顏色**：非焦點長條包在 `<g class="dg-c-muted">` 裡、用 `dg-bar dg-bar--soft`；正文要讀者注意的那一根用 `dg-bar dg-c-accent`。全圖只有一根 accent。
- 分組長條（每個類別兩根並排）：主要系列 `dg-c-accent`、對照系列 `dg-c-s1`，最多兩組；直接在第一組旁邊標系列名（`dg-text--series`），不要另放圖例。
- 堆疊長條：焦點那一段用 `dg-c-accent`，其他段依序 `dg-c-s1`、`dg-c-s2`…，最多 4 段，每根頂端寫總數。
- 負值往基線下方長，用 `dg-c-warn` 並在數值前加「−」；不要只靠紅色表達負號。

## 數值換算成座標（必做）

資料要先手算成 SVG 座標再畫，**算式寫在 caption 或 `desc` 讓讀者能核對**：

```text
基線 y0 = 300、繪圖區頂 y = 60，網域 0–4 秒
k = (300 − 60) ÷ 4 = 60（每秒 60 單位）
長條頂 y = y0 − 數值 × k，高 = 數值 × k
例：2.9 秒 → 高 174，y = 126
```

- **縱軸一定從 0 開始。** 長條的長度就是數值，把基線截掉（從 0.5 秒起畫）會讓 0.8 和 1.2 看起來差三倍。網域上限取一個包住最大值的整數。
- 不要為了好看把長條高度「調一下」；換算後的小數照填（可以四捨五入到 0.1）。
- **數字一定有出處**：文章正文或參考資料要寫明這組數值從哪來（論文表格、官方 benchmark、自己量測的方法）。教學示意用的假資料要在 caption 寫「示意」。

## Dumbbell 變體

每列一個類別，同一條橫向數值軸上兩個點，中間一條細線相連。只能有兩個系列。

```svg
<!-- 一列：改版前 34%、改版後 71%；x = 200 + 值 × 4 -->
<line class="dg-axis" x1="336" y1="96" x2="484" y2="96"/>
<circle class="dg-point dg-point--hollow dg-c-muted" cx="336" cy="96" r="6"/>
<circle class="dg-point dg-c-accent" cx="484" cy="96" r="6"/>
<text class="dg-sub" x="324" y="96" text-anchor="end" dominant-baseline="central">34%</text>
<text class="dg-sub dg-text--accent" x="496" y="96" dominant-baseline="central">71%</text>
<text class="dg-label" x="184" y="96" text-anchor="end" dominant-baseline="central">結帳轉換率</text>
```

- **兩端都用填法區分，不只靠顏色**：參考端空心（`dg-point--hollow dg-c-muted`），焦點端實心 `dg-c-accent`。這裡 accent 標的是「系列」，每列都會出現，不要再另外挑一列加強。
- 連線先畫、點後畫，點才會蓋住線頭。連線只代表「差距」，不代表中間的變化路徑，正文不要寫成「一路上升」。
- 數值標在兩點**外側**（左點靠左、右點靠右），不要夾在中間。
- 列的排序方式寫在 caption（依改版後數值、依變化量…），不要隨意排。
- 數值軸同樣要誠實：資料都是正值就從 0 起算；兩端用同一個比例尺、同一個單位。缺一端的列要在 caption 說明，不能自己補值。

## 範例

````markdown
```diagram
title: 五個模型的平均回應延遲
desc: 模型 C 平均 2.9 秒，比最快的模型 A（0.8 秒）慢三倍以上，但仍比模型 E（3.6 秒）快。
caption: 示意資料，非實測。換算：基線 y = 300，每秒 60 單位（y = 300 − 秒數 × 60），縱軸從 0 起。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">延遲（秒）</text>
  <line class="dg-grid" x1="72" y1="60" x2="612" y2="60"/>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">4</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">2</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="94" y="252" width="64" height="48"/>
    <rect class="dg-bar dg-bar--soft" x="202" y="216" width="64" height="84"/>
    <rect class="dg-bar dg-bar--soft" x="418" y="168" width="64" height="132"/>
    <rect class="dg-bar dg-bar--soft" x="526" y="84" width="64" height="216"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="310" y="126" width="64" height="174"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="126" y="240" text-anchor="middle" dominant-baseline="central">0.8</text>
  <text class="dg-sub" x="234" y="204" text-anchor="middle" dominant-baseline="central">1.4</text>
  <text class="dg-label dg-text--accent" x="342" y="112" text-anchor="middle" dominant-baseline="central">2.9</text>
  <text class="dg-sub" x="450" y="156" text-anchor="middle" dominant-baseline="central">2.2</text>
  <text class="dg-sub" x="558" y="72" text-anchor="middle" dominant-baseline="central">3.6</text>

  <text class="dg-sub" x="126" y="320" text-anchor="middle" dominant-baseline="central">模型 A</text>
  <text class="dg-sub" x="234" y="320" text-anchor="middle" dominant-baseline="central">模型 B</text>
  <text class="dg-label dg-text--accent" x="342" y="320" text-anchor="middle" dominant-baseline="central">模型 C</text>
  <text class="dg-sub" x="450" y="320" text-anchor="middle" dominant-baseline="central">模型 D</text>
  <text class="dg-sub" x="558" y="320" text-anchor="middle" dominant-baseline="central">模型 E</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 縱軸不從 0 開始 | 長條長度不再等於數值，小差距被放大成好幾倍 |
| 每根長條不同顏色 | 顏色沒有編碼任何東西，讀者會去找不存在的圖例 |
| 兩根以上 accent | 沒有決定要讀者看哪一根 |
| 類別名稱斜放或直寫 | 讀不了；名稱長就改橫條 |
| 底部放圖例、長條旁不標值 | 讀者得來回對照；直接標系列名和數值 |
| 3D、陰影、圓角長條 | 立體透視讓長度失真，裝飾搶走數值 |
| 超過 8 根長條 | 擠在一起；分組合併、拆圖，或交給 `dataviz` |
| 數值沒有出處、caption 沒寫換算 | 讀者無法核對，圖變成沒有根據的主張 |
| dumbbell 兩端只用顏色區分 | 色弱和黑白列印分不出哪端是哪端；要空心／實心 |

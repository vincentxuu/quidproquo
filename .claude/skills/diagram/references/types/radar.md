# 雷達圖（Radar）

**適合：** 3–5 個對象，在 3–5 個**可量化、同一把尺**的面向上的分數，讀者要比的是「形狀」：誰全面、誰偏科、誰在哪一軸特別突出。例如三種檢索架構在準確度、速度、成本效率等面向的評測分數（都已正規化到 0–5）。

**不適合：**

- 分數是定性判斷（做得好／部分／做不到）→ 比較矩陣（`matrix.md`）。雷達圖的每個頂點都是一個量出來的數字。
- 讀者要逐項讀出精確分數 → 表格。雷達圖給的是輪廓，讀不準單點數值。
- 只有 1–2 個對象 → 長條圖（`bar.md`）或兩欄表格更清楚。
- 超過 5 個面向或 5 個對象 → 拆圖或改表格，多邊形會糊成一團。
- 各面向單位不同又沒有正規化（一個 0–100、一個 0–1）→ 先正規化到同一個 0–N，否則形狀沒有意義。
- 面向之間的順序或相鄰關係沒有意義，但多邊形面積會讓讀者覺得「面積大＝比較好」。若讀者會這樣誤讀、而正文要的是逐面向比較 → 用分組長條圖。

## 版面

- viewBox 640；中心約 (320, 196)，半徑 R = 128，四周留足標籤空間，圖例放在最下方的面向名稱下面。
- 面向 3–5 個，平均分布在正多邊形上，**第一軸朝正上方**、順時針排列。
- 刻度環：每一級一個同心多邊形，內圈 `dg-grid`，最外圈 `dg-rule`；從中心到各頂點畫 `dg-rule` 輻條，不加箭頭。
- 刻度數字（1–5）**只標在第一軸**，放在軸左邊 12（`text-anchor="end"`）。用 `dg-edge`（自帶描邊遮罩）並在多邊形之後才畫，數字才不會被半透明面蓋住。每一軸都標會很亂。
- 面向名稱用 `dg-label`，放在最外圈再往外約 0.8 級的位置：上下兩端 `text-anchor="middle"`，右半邊 `start`，左半邊 `end`。名稱橫著寫，不沿軸旋轉。
- 系列不多（≤ 3）但多邊形會重疊，直接標註很難放，所以雷達圖通常用底部圖例：`dg-swatch`（16 × 8）＋系列名，間隔約 140。

## 數值換算成座標

第 i 軸（從 0 開始、共 N 軸），分數 v、滿分 S、中心 (cx, cy)、半徑 R：

```text
角度 = −90° + 360° × i ÷ N
x = cx + (v ÷ S) × R × cos(角度)
y = cy + (v ÷ S) × R × sin(角度)
```

- 一個系列的 N 個頂點寫成一個 `<polygon points="x0,y0 x1,y1 …">`，座標取到小數一位即可。
- **刻度從 0 開始**，不要把內圈設成 3 來放大差距；差距看起來小，就是真的小。
- 正規化方法（例如「延遲越低分數越高，最快的給 5」）寫在 caption；所有面向都要寫成「越外圈越好」。
- 數值必須來自文章引用的來源；示意圖在 caption 寫「示意資料」。

## 顏色與焦點

- 每個系列一個 `<polygon class="dg-plot-area dg-c-…">`（20% 填色＋描邊）。焦點系列（全圖一個）用 `dg-c-accent`，其餘依序 `dg-c-s1`、`dg-c-s2`…
- **頂點圓點只畫在焦點系列上**（`dg-point dg-c-accent`，r = 4）。每個系列都加點會變成一串珠簾。
- 繪製順序：刻度環 → 輻條 → 面向名稱 → 非焦點系列 → 焦點系列 → 焦點頂點 → 刻度數字 → 圖例。
- 圖例的焦點系列名稱加 `dg-text--accent`。

## 範例

````markdown
```diagram
title: 混合檢索在五個面向都不墊底
desc: 純向量檢索、重排序管線、混合檢索在準確度、回應速度、成本效率、可解釋性、維運簡單五個面向的 0–5 分；重排序管線準確度最高但其他面向偏弱，混合檢索各面向都在 3 分以上。
caption: 示意資料。各面向已正規化為 0–5，越外圈越好；頂點座標＝中心 + 分數 ÷ 5 × 半徑 128。
---
<svg viewBox="0 0 640 392">
  <polygon class="dg-grid" points="320,170.4 344.3,188.1 335,216.7 305,216.7 295.7,188.1"/>
  <polygon class="dg-grid" points="320,144.8 368.7,180.2 350.1,237.4 289.9,237.4 271.3,180.2"/>
  <polygon class="dg-grid" points="320,119.2 393,172.3 365.1,258.1 274.9,258.1 247,172.3"/>
  <polygon class="dg-grid" points="320,93.6 417.4,164.4 380.2,278.8 259.8,278.8 222.6,164.4"/>
  <polygon class="dg-rule" points="320,68 441.7,156.4 395.2,299.6 244.8,299.6 198.3,156.4"/>
  <line class="dg-rule" x1="320" y1="196" x2="320" y2="68"/>
  <line class="dg-rule" x1="320" y1="196" x2="441.7" y2="156.4"/>
  <line class="dg-rule" x1="320" y1="196" x2="395.2" y2="299.6"/>
  <line class="dg-rule" x1="320" y1="196" x2="244.8" y2="299.6"/>
  <line class="dg-rule" x1="320" y1="196" x2="198.3" y2="156.4"/>
  <text class="dg-label" x="320" y="45.5" text-anchor="middle" dominant-baseline="central">準確度</text>
  <text class="dg-label" x="461.2" y="150.1" text-anchor="start" dominant-baseline="central">回應速度</text>
  <text class="dg-label" x="407.3" y="316.1" text-anchor="start" dominant-baseline="central">成本效率</text>
  <text class="dg-label" x="232.7" y="316.1" text-anchor="end" dominant-baseline="central">可解釋性</text>
  <text class="dg-label" x="178.8" y="150.1" text-anchor="end" dominant-baseline="central">維運簡單</text>
  <polygon class="dg-plot-area dg-c-s1" points="320,119.2 417.4,164.4 380.2,278.8 289.9,237.4 222.6,164.4"/>
  <polygon class="dg-plot-area dg-c-s2" points="320,68 368.7,180.2 350.1,237.4 274.9,258.1 271.3,180.2"/>
  <polygon class="dg-plot-area dg-c-accent" points="320,93.6 393,172.3 380.2,278.8 259.8,278.8 247,172.3"/>
  <circle class="dg-point dg-c-accent" cx="320" cy="93.6" r="4"/>
  <circle class="dg-point dg-c-accent" cx="393" cy="172.3" r="4"/>
  <circle class="dg-point dg-c-accent" cx="380.2" cy="278.8" r="4"/>
  <circle class="dg-point dg-c-accent" cx="259.8" cy="278.8" r="4"/>
  <circle class="dg-point dg-c-accent" cx="247" cy="172.3" r="4"/>
  <text class="dg-edge" x="308" y="170.4" text-anchor="end" dominant-baseline="central">1</text>
  <text class="dg-edge" x="308" y="144.8" text-anchor="end" dominant-baseline="central">2</text>
  <text class="dg-edge" x="308" y="119.2" text-anchor="end" dominant-baseline="central">3</text>
  <text class="dg-edge" x="308" y="93.6" text-anchor="end" dominant-baseline="central">4</text>
  <text class="dg-edge" x="308" y="68" text-anchor="end" dominant-baseline="central">5</text>
  <line class="dg-rule" x1="20" y1="344" x2="620" y2="344"/>
  <text class="dg-tag" x="20" y="368" dominant-baseline="central">圖例</text>
  <rect class="dg-swatch dg-c-accent" x="84" y="364" width="16" height="8"/>
  <text class="dg-small dg-text--accent" x="108" y="368" dominant-baseline="central">混合檢索</text>
  <rect class="dg-swatch dg-c-s2" x="224" y="364" width="16" height="8"/>
  <text class="dg-small" x="248" y="368" dominant-baseline="central">重排序管線</text>
  <rect class="dg-swatch dg-c-s1" x="364" y="364" width="16" height="8"/>
  <text class="dg-small" x="388" y="368" dominant-baseline="central">純向量檢索</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 面向單位不同又沒正規化 | 形狀沒有意義；先換成同一個 0–N |
| 內圈不是 0 | 放大差距，讀者會誤判 |
| 有的軸越外越好、有的軸越外越差 | 讀者會讀反；面向一律寫成正向 |
| 每個系列都畫頂點圓點 | 變成珠簾；只畫焦點系列 |
| 超過 5 個系列 | 多邊形糊在一起；拆圖或改表格 |
| 只有兩個系列 | 長條圖或表格更清楚 |
| 定性評分畫成雷達圖 | 那是比較矩陣 |
| 每一軸都標刻度數字 | 雜亂；只標第一軸 |
| 面向名稱沿軸旋轉 | 讀不了；一律橫寫 |
| 彩虹配色 | 一個 accent 加 s1、s2，夠用就好 |

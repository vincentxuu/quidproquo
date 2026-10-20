# 瀑布圖（Waterfall）

**適合：** 一個起點總額經過幾筆有正有負的增減，接到一個終點總額，讀者要看的是「中間每一筆貢獻多少、加起來怎麼對得上」：今年預算比去年多出來的錢花在哪、人數從年初到年底的增減、營收到淨利一路扣掉什麼。

**不適合：**

- 只有兩個端點、重點是差距 → 長條圖的 dumbbell 變體（`bar.md`）。dumbbell 只說兩個值和距離；瀑布圖說的是一串必須加總得起來的步驟。
- 各類別互相獨立、不會累加 → 長條圖（`bar.md`）。
- 一個量分流又合流 → 桑基圖；一路流失的轉換漏斗 → 金字塔／漏斗（`pyramid.md`）。
- 增減項目超過 6 筆，或讀者要逐筆查精確金額 → 普通 Markdown 表格；資料量大或要互動 → `dataviz` skill。

## 版面

- **只畫直條**，由左到右照敘事順序：起點總額 → 各筆增減 → （選配一個小計）→ 終點總額。橫向的瀑布圖看起來會像甘特圖。
- **3–8 根**，含頭尾總額，小計最多一個。增減項目太多就把尾巴合併成一筆「其他」（在 caption 說明包含什麼），或拆成兩張圖。
- 等寬、等間距，條寬 ≥ 間距的一半（範例：6 根、間距 88、條寬 56）。
- **總額落地，增減懸空。** 起點、小計、終點從基線長到數值；每一筆增減只畫「前一個累計值」到「後一個累計值」之間那一段：增加從舊累計往上長，減少從舊累計往下掉。
- **銜接線**：相鄰兩根之間用一條 `dg-axis` 橫線，畫在兩者共有的累計值高度，從前一根右緣接到後一根左緣。沒有銜接線，讀者就看不出這些懸空的條是同一筆錢在走。
- **每根都標數值**：總額與增加標在條的上方 10，減少標在條的**下方** 12（上方是銜接線進來的位置）。增減一律寫正負號（`+30`、`−12`），不能只靠位置讓讀者猜方向。
- 每根都有數值，所以**不畫格線、不畫刻度**，只留一條 `dg-axis` 基線；比例尺寫在 caption。
- 類別名稱放在基線下方 20，以條的中心置中。

## 顏色與正負

- **正負不能只靠紅綠分。** 增加用實心 `dg-bar dg-c-s1`，減少用變淡的 `dg-bar dg-bar--soft dg-c-warn`，深淺加上數值的正負號一起表達方向，色弱讀者和黑白列印也看得出來。
- **總額用最穩的顏色**：`dg-bar dg-c-muted`，讀者先看到頭尾兩個錨點，再沿著中間走。
- **焦點最多一筆**：正文要討論的那一筆改用 `dg-bar dg-c-accent`（取代它原本的正負顏色），數值和類別名稱加 `dg-text--accent`。正負號和位置仍然說明它的方向。
- 用到兩種以上的正負樣式時放底部圖例（總額／增加／減少）；色塊用 `dg-swatch` 加對應的 `dg-c-*`。

## 數值換算成座標（必做）

```text
基線 y0 = 260、網域 0–180（萬元），k = 1.2（每萬元 1.2 單位）
累計值 v 的高度：y(v) = y0 − v × k
總額：y = y(總額)，高 = 總額 × k
增減：頂 = y(較大的累計值)，高 = |增減| × k
```

- **一定要對得上帳**：起點 + 所有增減 = 小計 = 終點，一分不差。畫之前先在旁邊把累計值逐筆算出來；對不上的瀑布圖不是「大約正確」，是錯的。
- 縱軸從 0 起（總額是從基線長出來的長條，截掉基線會放大每一筆增減）。
- 每一根的頂端與底端，都要剛好落在前後兩個累計值換算出來的高度；不要為了讓小的那筆看得到就把它拉長。
- 增減為 0 的項目不畫空條，在正文或 caption 交代。
- 所有項目同一個單位。數字要有出處（財報、公開預算書、自己的量測方法寫在正文）；教學用的假資料在 caption 寫「示意」。

## 範例

````markdown
```diagram
title: 今年預算怎麼從 120 萬變成 136 萬
desc: 去年預算 120 萬，人力加 30 萬、雲端費用加 18 萬，授權省下 12 萬、外包減少 20 萬，今年預算 136 萬。
caption: 示意資料。換算：y = 260 − 萬元 × 1.2，縱軸從 0 起；120 + 30 + 18 − 12 − 20 = 136。
---
<svg viewBox="0 0 640 360">
  <line class="dg-axis" x1="140" y1="116" x2="172" y2="116"/>
  <line class="dg-axis" x1="228" y1="80" x2="260" y2="80"/>
  <line class="dg-axis" x1="316" y1="58.4" x2="348" y2="58.4"/>
  <line class="dg-axis" x1="404" y1="72.8" x2="436" y2="72.8"/>
  <line class="dg-axis" x1="492" y1="96.8" x2="524" y2="96.8"/>

  <rect class="dg-bar dg-c-muted" x="84" y="116" width="56" height="144"/>
  <rect class="dg-bar dg-c-s1" x="172" y="80" width="56" height="36"/>
  <rect class="dg-bar dg-c-accent" x="260" y="58.4" width="56" height="21.6"/>
  <rect class="dg-bar dg-bar--soft dg-c-warn" x="348" y="58.4" width="56" height="14.4"/>
  <rect class="dg-bar dg-bar--soft dg-c-warn" x="436" y="72.8" width="56" height="24"/>
  <rect class="dg-bar dg-c-muted" x="524" y="96.8" width="56" height="163.2"/>
  <line class="dg-axis" x1="64" y1="260" x2="600" y2="260"/>

  <text class="dg-sub" x="112" y="104" text-anchor="middle" dominant-baseline="central">120</text>
  <text class="dg-sub" x="200" y="68" text-anchor="middle" dominant-baseline="central">+30</text>
  <text class="dg-label dg-text--accent" x="288" y="44" text-anchor="middle" dominant-baseline="central">+18</text>
  <text class="dg-sub" x="376" y="86" text-anchor="middle" dominant-baseline="central">−12</text>
  <text class="dg-sub" x="464" y="110" text-anchor="middle" dominant-baseline="central">−20</text>
  <text class="dg-sub" x="552" y="84" text-anchor="middle" dominant-baseline="central">136</text>

  <text class="dg-sub" x="112" y="280" text-anchor="middle" dominant-baseline="central">去年預算</text>
  <text class="dg-sub" x="200" y="280" text-anchor="middle" dominant-baseline="central">人力</text>
  <text class="dg-label dg-text--accent" x="288" y="280" text-anchor="middle" dominant-baseline="central">雲端</text>
  <text class="dg-sub" x="376" y="280" text-anchor="middle" dominant-baseline="central">授權</text>
  <text class="dg-sub" x="464" y="280" text-anchor="middle" dominant-baseline="central">外包</text>
  <text class="dg-sub" x="552" y="280" text-anchor="middle" dominant-baseline="central">今年預算</text>

  <line class="dg-rule" x1="20" y1="308" x2="620" y2="308"/>
  <text class="dg-tag" x="20" y="332" dominant-baseline="central">圖例</text>
  <rect class="dg-swatch dg-c-muted" x="76" y="324" width="16" height="16" rx="2"/>
  <text class="dg-small" x="100" y="332" dominant-baseline="central">總額</text>
  <rect class="dg-swatch dg-c-s1" x="164" y="324" width="16" height="16" rx="2"/>
  <text class="dg-small" x="188" y="332" dominant-baseline="central">增加</text>
  <rect class="dg-bar dg-bar--soft dg-c-warn" x="252" y="324" width="16" height="16" rx="2"/>
  <text class="dg-small" x="276" y="332" dominant-baseline="central">減少</text>
  <rect class="dg-swatch dg-c-accent" x="340" y="324" width="16" height="16" rx="2"/>
  <text class="dg-small" x="364" y="332" dominant-baseline="central">本段重點</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 懸空的條之間沒有銜接線 | 看起來只是高低不一的條，讀不出是同一筆錢在累計 |
| 正負只靠紅綠分 | 色弱讀者和黑白列印分不出方向；要深淺＋正負號 |
| 起點＋增減≠終點 | 帳對不上，整張圖都不能信 |
| 縱軸不從 0 起 | 每一筆增減都被放大 |
| 為了看得到把小的增減拉長 | 憑空多出不存在的錢 |
| 小計超過一個 | 一張圖講了兩段累計，拆成兩張 |
| 中途換單位（萬元混百分比） | 加總沒有意義 |
| 增減數值不寫正負號 | 讀者得從位置倒推方向 |

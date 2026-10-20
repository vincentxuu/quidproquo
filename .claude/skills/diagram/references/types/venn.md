# 韋恩圖（Venn）

**適合：** 兩三個概念或領域的交集：「A 和 B 重疊在哪」「三個條件同時成立的是哪一塊」。讀者要看的是重疊那一塊叫什麼。

**不適合：** 四個以上的集合（區塊多到標不完，改用比較矩陣 `matrix.md`）；集合之間其實沒有重疊、只是並列（用條列）；一個集合完全包在另一個裡面（用巢狀圖 `nested.md`）。

## 版面

- **兩個或三個圓。** 三個圓排成正三角形（一個在上、兩個在下），兩個圓左右並排。
- 圓用 `dg-area`：半透明底色，重疊的地方自然變深，讀者不用看標籤也知道哪裡是交集。
- 大小相當的集合用同一個半徑；真的差很多才用不同半徑，不要為了好看假裝一樣大。
- 圓心距離約等於半徑，三圓交集才夠大、放得下標籤。半徑 128、圓心距 128 的三個圓剛好塞進 448 寬：手機上直接縮到螢幕寬、不用左右捲，`dg-sub` 也還讀得到（寬到 480 就會太小）。
- 圓心、半徑落在 4 的倍數。

## 標籤

- **每一個區塊都要標**，標籤放在**區塊裡面**，不壓在圓周上。
  - 集合名稱用 `dg-label`，放在該圓「只屬於自己」的那一瓣，靠外側。
  - 兩兩交集用 `dg-sub`，放在兩圓重疊、第三圓之外的那一小塊。這塊通常很窄，標籤控制在 4 個中文字左右。
  - 全部交集用 `dg-label`，可以加一行 `dg-sub` 說明。
- 放之前用標籤外框的四角和中點檢查：每一點都要落在該區塊的圓內（離圓周至少 4），也都要在其他圓外。手算麻煩就寫個小腳本，比肉眼可靠。
- 區塊太小放不下時，標籤移到圖外的空白處，用一條短的 `dg-line` 指回區塊。

## 焦點

- accent 只給**一個**交集：通常是全部交集（甜蜜點）。
- 做法是在三個圓之後，疊一個 `dg-area dg-area--accent` 的路徑，形狀就是交集本身：三段圓弧接起來。先算出兩兩圓周的交點（取落在第三個圓裡的那個），再用 `A r r 0 0 1` 從一個交點畫到下一個，每段用的是「兩個端點共同所在」的那個圓。
- 交集標籤加 `dg-text--accent`。

## 範例

````markdown
```diagram
title: AI 工程師站在三種能力的交集
desc: 產品感、軟體工程、機器學習三個圓兩兩重疊，三者都具備的中心區塊才是 AI 工程師。
caption: 示意：說明的是一種常見的能力框架，不是職缺統計。
---
<svg viewBox="0 0 448 428">
  <circle class="dg-area" cx="224" cy="156" r="128"/>
  <circle class="dg-area" cx="160" cy="268" r="128"/>
  <circle class="dg-area" cx="288" cy="268" r="128"/>
  <path class="dg-area dg-area--accent" d="M224 157A128 128 0 0 1 288 267A128 128 0 0 1 160 267A128 128 0 0 1 224 157Z"/>

  <text class="dg-label" x="224" y="80" text-anchor="middle" dominant-baseline="central">產品感</text>
  <text class="dg-label" x="104" y="328" text-anchor="middle" dominant-baseline="central">軟體工程</text>
  <text class="dg-label" x="344" y="328" text-anchor="middle" dominant-baseline="central">機器學習</text>

  <text class="dg-sub" x="140" y="200" text-anchor="middle" dominant-baseline="central">產品工程</text>
  <text class="dg-sub" x="308" y="200" text-anchor="middle" dominant-baseline="central">AI 原型</text>
  <text class="dg-sub" x="224" y="332" text-anchor="middle" dominant-baseline="central">MLOps</text>

  <text class="dg-label dg-text--accent" x="224" y="224" text-anchor="middle" dominant-baseline="central">AI 工程師</text>
  <text class="dg-sub" x="224" y="246" text-anchor="middle" dominant-baseline="central">三者都有</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 有區塊沒標 | 讀者分不出哪一塊是哪幾個集合的交集 |
| 標籤壓在圓周上 | 線把字切開，也看不出標籤屬於哪一邊 |
| 四個以上的圓 | 區塊多到標不完；改用比較矩陣 |
| 圓沒有重疊 | 重疊才是這張圖的重點 |
| 大小明顯不同的集合畫成一樣大 | 誤導讀者 |
| 多個交集都標 accent | 焦點消失 |
| 每個圓填不同的實色 | 重疊處的顏色混不出來，交集反而看不清 |

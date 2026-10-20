# Wardley map（價值鏈 × 演化）

**適合：** 把一個產品的價值鏈攤開，標出每個元件演化到哪個階段，讓讀者看出「哪些該自建、哪些該外購、哪些正在往商品化移動」。這是策略圖，不是架構圖：它不講元件在執行期怎麼連，只講每個元件在「起源 → 客製 → 產品 → 商品化」這條演化線上站在哪裡。

**不適合：**

- 兩個獨立維度、各自可以打分數的定位（影響力 × 成本）→ 象限圖（`quadrant.md`）。Wardley map 的兩個軸都不是分數：縱軸是「離使用者多近」的順序，橫軸是四個定性的演化階段，元件之間還有依賴線。沒有依賴關係、只是在兩個維度上擺點，就用象限圖。
- 請求怎麼流、元件怎麼呼叫 → 架構圖（`architecture.md`）。
- 一層疊一層的技術堆疊 → 分層圖（`layers.md`）。分層圖也有「上面靠下面」，但沒有演化軸，也不講自建或外購。

老實說：部落格很少需要這種圖。它的價值在「自建還是外購」的決策討論；如果正文只是介紹一個產品用了哪些元件，用架構圖或條列。畫之前先確認正文真的在論證某個元件的演化階段（而且有依據），圖上每個點的位置都是一個主張。

## 版面

- **縱軸：價值鏈。** 最上面是使用者直接看得到的需求，越往下越看不到（基礎設施）。縱軸是順序，**不標數字刻度**。軸兩端用水平的短字標示（上「使用者看得到」、下「看不到」），不要把字轉成直的。
- **橫軸：演化。** 四個階段等寬，用三條 `dg-grid` 細虛線分開：起源（Genesis）、客製（Custom）、產品（Product）、商品化（Commodity）。階段名稱放在橫軸下方，`dg-sub`。橫軸是四個定性區間，不是 0–10 的分數，元件放進某個區間就好，不要假裝精確到「6.5」。
- 座標軸用 `dg-axis`，縱軸箭頭朝上、橫軸箭頭朝右。
- **元件：** `r=6` 的空心點（`dg-point dg-point--hollow dg-c-ink`），名稱 `dg-label` 放在點的旁邊，預設在正上方 16；上方有依賴線經過時，改放下方或左右，名稱要放在**沒有線的那一側**。少用副標。
- **依賴線：** 從元件拉一條細的直線（`dg-line`）到它依賴的下層元件，**不加箭頭**，線本身就代表「上面靠下面」。這是本站唯一允許斜線的連線：元件的位置就是資料，為了走直角線而挪動元件會畫錯位置。圖裡其他的線（演化箭頭、圖例）仍然只能水平或垂直。
- **演化箭頭：** 正在移動的元件，從點的右緣拉一條往右的水平虛線箭頭（`dg-line dg-line--accent dg-line--dashed`＋`#arrow-accent`），指向下一個階段。演化只會往右，往左的箭頭是自相矛盾。箭頭上不寫「商品化中」：方向和圖例已經說了；只有要補充箭頭表達不了的東西（時程、驅動力）才加標籤。
- **焦點：** accent 的兩個名額給「正在移動的元件的點」和「它的演化箭頭」；或兩個移動中的元件各一個點，那就不再有其他 accent。
- **圖例：** 底部一整條，說明空心點、依賴線、演化箭頭。
- 640 寬放得下 9 個元件；依賴線上限 12 條，演化箭頭最多 2 條。

## 範例

````markdown
```diagram
title: 一個 AI 客服產品的價值鏈
desc: 客服對話靠 agent 流程，agent 流程再靠評估、知識庫與 LLM API；agent 流程正從客製往產品移動，底層的雲端運算已經商品化。
caption: 示意用的假想產品；各元件的階段因團隊和時間而異，畫自己的圖時每個位置都要有依據。
---
<svg viewBox="0 0 640 448">
  <line class="dg-grid" x1="230" y1="40" x2="230" y2="340"/>
  <line class="dg-grid" x1="360" y1="40" x2="360" y2="340"/>
  <line class="dg-grid" x1="490" y1="40" x2="490" y2="340"/>
  <path class="dg-axis" d="M100 340V36" marker-end="url(#arrow)"/>
  <path class="dg-axis" d="M100 340H624" marker-end="url(#arrow)"/>
  <text class="dg-sub" x="88" y="48" text-anchor="end" dominant-baseline="central">使用者</text>
  <text class="dg-sub" x="88" y="66" text-anchor="end" dominant-baseline="central">看得到</text>
  <text class="dg-sub" x="88" y="330" text-anchor="end" dominant-baseline="central">看不到</text>
  <text class="dg-sub" x="165" y="360" text-anchor="middle" dominant-baseline="central">起源 Genesis</text>
  <text class="dg-sub" x="295" y="360" text-anchor="middle" dominant-baseline="central">客製 Custom</text>
  <text class="dg-sub" x="425" y="360" text-anchor="middle" dominant-baseline="central">產品 Product</text>
  <text class="dg-sub" x="555" y="360" text-anchor="middle" dominant-baseline="central">商品化 Commodity</text>

  <line class="dg-line" x1="300" y1="148" x2="420" y2="72"/>
  <line class="dg-line" x1="300" y1="148" x2="160" y2="212"/>
  <line class="dg-line" x1="300" y1="148" x2="290" y2="256"/>
  <line class="dg-line" x1="300" y1="148" x2="470" y2="204"/>
  <line class="dg-line" x1="290" y1="256" x2="410" y2="292"/>
  <line class="dg-line" x1="470" y1="204" x2="560" y2="300"/>
  <line class="dg-line" x1="410" y1="292" x2="560" y2="300"/>
  <path class="dg-line dg-line--accent dg-line--dashed" d="M310 148H380" marker-end="url(#arrow-accent)"/>

  <circle class="dg-point dg-point--hollow dg-c-ink" cx="420" cy="72" r="6"/>
  <text class="dg-label" x="420" y="54" text-anchor="middle" dominant-baseline="central">客服對話</text>
  <circle class="dg-point dg-c-accent" cx="300" cy="148" r="6"/>
  <text class="dg-label" x="294" y="128" text-anchor="end" dominant-baseline="central">客服 agent 流程</text>
  <circle class="dg-point dg-point--hollow dg-c-ink" cx="160" cy="212" r="6"/>
  <text class="dg-label" x="160" y="232" text-anchor="middle" dominant-baseline="central">評估與監控</text>
  <circle class="dg-point dg-point--hollow dg-c-ink" cx="290" cy="256" r="6"/>
  <text class="dg-label" x="278" y="262" text-anchor="end" dominant-baseline="central">公司知識庫</text>
  <circle class="dg-point dg-point--hollow dg-c-ink" cx="470" cy="204" r="6"/>
  <text class="dg-label" x="476" y="186" dominant-baseline="central">LLM API</text>
  <circle class="dg-point dg-point--hollow dg-c-ink" cx="410" cy="292" r="6"/>
  <text class="dg-label" x="410" y="312" text-anchor="middle" dominant-baseline="central">向量資料庫</text>
  <circle class="dg-point dg-point--hollow dg-c-ink" cx="560" cy="300" r="6"/>
  <text class="dg-label" x="560" y="320" text-anchor="middle" dominant-baseline="central">雲端運算</text>

  <line class="dg-rule" x1="20" y1="392" x2="620" y2="392"/>
  <text class="dg-tag" x="20" y="420" dominant-baseline="central">圖例</text>
  <circle class="dg-point dg-point--hollow dg-c-ink" cx="84" cy="420" r="6"/>
  <text class="dg-small" x="98" y="420" dominant-baseline="central">元件</text>
  <line class="dg-line" x1="156" y1="420" x2="188" y2="420"/>
  <text class="dg-small" x="196" y="420" dominant-baseline="central">依賴（上面靠下面）</text>
  <circle class="dg-point dg-c-accent" cx="336" cy="420" r="6"/>
  <path class="dg-line dg-line--accent dg-line--dashed" d="M346 420H384" marker-end="url(#arrow-accent)"/>
  <text class="dg-small" x="396" y="420" dominant-baseline="central">正在往右演化</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 把橫軸當成分數，元件放在「6.5」 | 演化是四個定性階段，假精確會誤導讀者 |
| 縱軸標數字刻度 | 「離使用者多近」是順序，不是量 |
| 沒有任何依賴線的元件 | 不在價值鏈上；刪掉或接上 |
| 往左的演化箭頭 | 演化只往商品化走；往左是畫錯，不是設計 |
| 超過兩條演化箭頭 | 圖變成沒人能據以行動的預測；只標正文在講的那一兩個 |
| 畫成架構圖：加請求方向、通訊協定 | Wardley map 回答「該自建還是外購」，不是「流量怎麼走」 |
| 元件位置沒有依據 | 每個點都是一個主張；查不到依據就不要畫進去，或在圖說講明是假想例子 |
| 軸的文字轉成直的 | 讀不了；用兩端的水平短字 |

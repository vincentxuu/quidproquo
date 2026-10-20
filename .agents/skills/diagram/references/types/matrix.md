# 比較矩陣（Matrix）

**適合：** 3–5 個選項在 3–6 個面向上的比較，而且讀者要看的是「整體的形狀」：誰在哪一欄全滿、哪一欄大家都做不好、兩個選項的強弱剛好互補。格子裡放的是**等級**（做得好／部分／做不到），用符號或填色表達，一眼掃過就看得出規律。

**不適合（改用普通 Markdown 表格）：**

- 格子裡要放**文字或精確數值**（價格、版本、延遲毫秒數、「支援 Python 和 Go」）→ 表格。數字畫成點點會丟失資訊，文字塞進 SVG 又不能搜尋、複製、選取。
- 讀者會**逐格查找**、不會整體掃視（規格對照、API 參數清單）→ 表格。
- 選項超過 5 個或面向超過 6 個 → 表格；圖會擠到手機上要左右捲。
- 只有兩個選項、兩三個面向 → 一句話或兩欄表格。
- 選項要依兩個連續維度定位 → 象限圖（`quadrant.md`）。
- 真正的數量資料（熱力圖、分數分佈）→ `dataviz` skill。

判斷方式：把格子裡的內容念出來，如果念的是「實心、半滿、空心」這種三級評價，畫圖；如果念的是一句話或一個數字，用表格。

## 版面

- **列是選項、欄是面向。** 選項名稱放左側一欄（`dg-label`＋一行 `dg-sub` 說明做法），面向放上方一列（`dg-label`，置中）。欄寬一致，格子中心對齊。
- 表頭下方和列與列之間用 `dg-rule` 細線分隔；不畫格子外框，不畫直線分欄。
- **焦點用整欄或整列的底色**：正文要強調的那個面向（或那個選項），用 `dg-band--accent` 鋪滿整欄或整列，表頭文字加 `dg-text--accent`。全圖只標一欄或一列。
- 圖例放底部一整條，列出每個等級符號代表的意思。
- 寬度：viewBox 640，左側選項欄約 180，其餘平均分給面向欄（每欄 ≥ 96，表頭文字要放得下）。

## 編碼規則

- **等級最多三級**：`●` 做得好、`◐` 部分做到或看實作、`○` 做不到或要另外補。四級以上讀者記不住，改用表格寫字。
- **方向一致：實心永遠代表「好」。** 面向名稱要寫成正向（「實作簡單」而不是「實作成本」、「撐得住長對話」而不是「長度限制」），不然有的欄實心是好、有的欄實心是壞，讀者會讀反。
- 符號寫法：

  ```svg
  <!-- ● 實心 -->
  <circle class="dg-dot" cx="252" cy="96" r="9"/>
  <!-- ○ 空心 -->
  <circle class="dg-dot dg-dot--hollow" cx="252" cy="96" r="9"/>
  <!-- ◐ 半滿：先畫空心圓，再疊左半邊實心半圓（不需要 clipPath） -->
  <circle class="dg-dot dg-dot--hollow" cx="252" cy="96" r="9"/>
  <path class="dg-dot" d="M252 87A9 9 0 0 0 252 105Z"/>
  ```

- 想用填色表達等級（熱力圖式）時，每格畫一個 `dg-band`（一般）、`dg-band--accent`（好）、`dg-band--warn`（風險）的方塊，格子裡仍要放一個短字或符號，不能只靠顏色。
- 評等是定性判斷，`caption` 寫明「定性比較，實際表現取決於實作」；評等依據要在正文寫出來，不要讓圖偷渡沒有根據的分數。

## 範例

````markdown
```diagram
title: 三種 agent 記憶做法的取捨
desc: 完整對話歷史實作最簡單但不能跨 session；滾動摘要各方面都只做到一部分；向量檢索記憶能跨 session、撐得住長對話，但實作最麻煩。
caption: 定性比較，實際表現取決於實作細節。
---
<svg viewBox="0 0 640 328">
  <rect class="dg-band dg-band--accent" x="408" y="16" width="104" height="240" rx="6"/>

  <text class="dg-label" x="252" y="40" text-anchor="middle" dominant-baseline="central">實作簡單</text>
  <text class="dg-label" x="356" y="40" text-anchor="middle" dominant-baseline="central">可解釋</text>
  <text class="dg-label dg-text--accent" x="460" y="40" text-anchor="middle" dominant-baseline="central">跨 session</text>
  <text class="dg-label" x="564" y="40" text-anchor="middle" dominant-baseline="central">不怕長對話</text>
  <line class="dg-rule" x1="20" y1="64" x2="616" y2="64"/>
  <line class="dg-rule" x1="20" y1="128" x2="616" y2="128"/>
  <line class="dg-rule" x1="20" y1="192" x2="616" y2="192"/>

  <text class="dg-label" x="32" y="86" dominant-baseline="central">完整對話歷史</text>
  <text class="dg-sub" x="32" y="108" dominant-baseline="central">整段塞進 context</text>
  <circle class="dg-dot" cx="252" cy="96" r="9"/>
  <circle class="dg-dot" cx="356" cy="96" r="9"/>
  <circle class="dg-dot dg-dot--hollow" cx="460" cy="96" r="9"/>
  <circle class="dg-dot dg-dot--hollow" cx="564" cy="96" r="9"/>

  <text class="dg-label" x="32" y="150" dominant-baseline="central">滾動摘要</text>
  <text class="dg-sub" x="32" y="172" dominant-baseline="central">定期壓縮成一段摘要</text>
  <circle class="dg-dot dg-dot--hollow" cx="252" cy="160" r="9"/><path class="dg-dot" d="M252 151A9 9 0 0 0 252 169Z"/>
  <circle class="dg-dot dg-dot--hollow" cx="356" cy="160" r="9"/><path class="dg-dot" d="M356 151A9 9 0 0 0 356 169Z"/>
  <circle class="dg-dot dg-dot--hollow" cx="460" cy="160" r="9"/><path class="dg-dot" d="M460 151A9 9 0 0 0 460 169Z"/>
  <circle class="dg-dot" cx="564" cy="160" r="9"/>

  <text class="dg-label" x="32" y="214" dominant-baseline="central">向量檢索記憶</text>
  <text class="dg-sub" x="32" y="236" dominant-baseline="central">存外部、用時再檢索</text>
  <circle class="dg-dot dg-dot--hollow" cx="252" cy="224" r="9"/>
  <circle class="dg-dot dg-dot--hollow" cx="356" cy="224" r="9"/><path class="dg-dot" d="M356 215A9 9 0 0 0 356 233Z"/>
  <circle class="dg-dot" cx="460" cy="224" r="9"/>
  <circle class="dg-dot" cx="564" cy="224" r="9"/>

  <line class="dg-rule" x1="20" y1="280" x2="620" y2="280"/>
  <text class="dg-tag" x="20" y="304" dominant-baseline="central">圖例</text>
  <circle class="dg-dot" cx="84" cy="304" r="7"/>
  <text class="dg-small" x="98" y="304" dominant-baseline="central">做得好</text>
  <circle class="dg-dot dg-dot--hollow" cx="184" cy="304" r="7"/><path class="dg-dot" d="M184 297A7 7 0 0 0 184 311Z"/>
  <text class="dg-small" x="198" y="304" dominant-baseline="central">部分做到</text>
  <circle class="dg-dot dg-dot--hollow" cx="296" cy="304" r="7"/>
  <text class="dg-small" x="310" y="304" dominant-baseline="central">做不到／要另外補</text>
  <rect class="dg-band dg-band--accent" x="452" y="296" width="16" height="16" rx="3"/>
  <text class="dg-small" x="476" y="304" dominant-baseline="central">本段重點</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 格子裡塞句子或數字 | 該用 Markdown 表格；SVG 裡的字不能搜尋、複製，手機也讀不清 |
| 有的欄實心是好、有的欄實心是壞 | 讀者會讀反；面向名稱一律寫成正向 |
| 四、五級評分或星等 | 符號差異太細，讀者要回頭對圖例；最多三級 |
| 只靠顏色分等級 | 色弱讀者和黑白列印分不出來；要有符號或字 |
| 每一欄都上底色 | 沒有焦點；只強調正文在講的那一欄或那一列 |
| 加上格線外框、粗分隔線 | 線比內容搶眼；只留列間細線 |
| 憑感覺打分、正文沒交代依據 | 圖變成沒有來源的主張 |

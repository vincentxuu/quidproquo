# 象限圖（Quadrant）

**適合：** 用兩個獨立的維度替一組選項定位，例如優先順序（影響力 × 實作成本）、產品定位（觸及 × 使用頻率）、風險評估（發生機率 × 衝擊）。讀者要看的是「每個點落在哪一格」。

**不適合：** 兩個維度其實是同一件事（成本高通常就是工期長，畫出來會擠成一條斜線）；只有 2–3 個選項（一句話說完）；有真實數值要比較（改用 `dataviz` 的散點圖，座標要誠實）。

## 版面

- 座標軸用 L 形：縱軸在左、橫軸在下，原點在左下，兩條軸都用 `dg-axis` 加 `marker-end="url(#arrow)"` 指向「高」的那一端。
- 軸名稱放在兩端，寫成「影響力 高」「影響力 低」這種形式，用 `dg-small`；**不要放在軸的中點**，也不要壓在軸線上。縱軸的標籤橫著寫、放在軸的左側（`text-anchor="end"`），所以左邊要留約 80 的邊界。
- 四個象限用兩條 `dg-rule` 在中間切開，不要替四格填四種底色：位置本身就是訊號，顏色只會變成噪音。
- 象限名稱用 `dg-tag` 放在各格的外側角落（左格靠左、右格靠右；上格靠上、下格靠下），離分隔線和軸至少 16。
- 名稱要能直接指導行動（「先做」「先別做」），不要只寫「第一象限」。

## 項目（點與標籤）

- 每個項目是一個 `dg-dot`（`r="5"`）加一個 `dg-sub` 標籤，標籤放在點的右邊，間距 10–12，`dominant-baseline="central"` 讓字和點對齊。
- 點不要放在分隔線上：落在線上等於沒有回答它屬於哪一格。
- 估字寬確認標籤不會跨過中線或超出圖框：12.5 的中文字每字約 12.5 寬。快撞到時把標籤改放在點的左邊（`text-anchor="end"`）。
- 同一格裡的點錯開高度至少 32，標籤才不會疊在一起。
- 項目上限約 8 個；更多就分群，或拆成兩張圖。
- accent 只給**一個**項目：讀者看完要記得的那個（通常是「先做」那格裡最值得做的）。它的點可以大一點（`r="7"`），標籤用 `dg-label`。

## 範例

````markdown
```diagram
title: 功能優先順序：影響力 × 實作成本
desc: 七個候選功能依影響力和實作成本分到四格，修正註冊流程錯誤影響大、成本低，排在最前面。
caption: 示意：項目位置是舉例，不是實際評估結果。
---
<svg viewBox="0 0 640 456">
  <line class="dg-rule" x1="352" y1="40" x2="352" y2="420"/>
  <line class="dg-rule" x1="88" y1="230" x2="616" y2="230"/>

  <path class="dg-axis" d="M88 420V36" marker-end="url(#arrow)"/>
  <path class="dg-axis" d="M88 420H620" marker-end="url(#arrow)"/>

  <text class="dg-small" x="76" y="48" text-anchor="end" dominant-baseline="central">影響力 高</text>
  <text class="dg-small" x="76" y="408" text-anchor="end" dominant-baseline="central">影響力 低</text>
  <text class="dg-small" x="96" y="440" dominant-baseline="central">實作成本 低</text>
  <text class="dg-small" x="616" y="440" text-anchor="end" dominant-baseline="central">實作成本 高</text>

  <text class="dg-tag dg-text--accent" x="104" y="60" dominant-baseline="central">先做</text>
  <text class="dg-tag" x="600" y="60" text-anchor="end" dominant-baseline="central">規劃投入</text>
  <text class="dg-tag" x="104" y="400" dominant-baseline="central">順手做</text>
  <text class="dg-tag" x="600" y="400" text-anchor="end" dominant-baseline="central">先別做</text>

  <circle class="dg-dot dg-dot--accent" cx="156" cy="112" r="7"/>
  <text class="dg-label dg-text--accent" x="172" y="112" dominant-baseline="central">修正註冊流程錯誤</text>
  <circle class="dg-dot" cx="232" cy="176" r="5"/>
  <text class="dg-sub" x="244" y="176" dominant-baseline="central">加入搜尋建議</text>

  <circle class="dg-dot" cx="404" cy="104" r="5"/>
  <text class="dg-sub" x="416" y="104" dominant-baseline="central">重寫推薦系統</text>
  <circle class="dg-dot" cx="472" cy="168" r="5"/>
  <text class="dg-sub" x="484" y="168" dominant-baseline="central">多語系支援</text>

  <circle class="dg-dot" cx="148" cy="288" r="5"/>
  <text class="dg-sub" x="160" y="288" dominant-baseline="central">調整按鈕文案</text>
  <circle class="dg-dot" cx="236" cy="344" r="5"/>
  <text class="dg-sub" x="248" y="344" dominant-baseline="central">更新頁尾連結</text>

  <circle class="dg-dot" cx="440" cy="316" r="5"/>
  <text class="dg-sub" x="452" y="316" dominant-baseline="central">自建影片轉檔</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 四個象限填四種顏色 | 顏色搶走位置的訊號，讀者先看到色塊而不是點 |
| 點落在分隔線上 | 看不出屬於哪一格 |
| 少了軸名稱，或只寫「高／低」 | 讀者不知道在比什麼 |
| 軸名稱放在中點或壓在軸線上 | 和分隔線、點標籤搶位置 |
| 縱軸標籤轉 90 度直寫 | 讀不了；橫著寫、放在軸的左側 |
| 每個點都標 accent | 沒有決定哪個才是要先做的 |
| 用象限圖畫有真實數值的資料 | 座標變成假精確；改用散點圖 |

## 四格都要有內容

象限圖的價值在於四格互相對照。文章只討論其中一格時，先查這個框架的原始出處把其他三格補齊（名稱＋一句用途），出處加進文章參考資料；查不到才退回只標座標，並在 caption 說明。規則見 `../../SKILL.md` 的「內容」檢查項。

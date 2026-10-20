# 熱力圖（Heatmap）

**適合：** 一張交叉表（列 × 欄），每一格是一個數值，讀者要一眼看出「哪個組合特別突出」：哪個題型在哪一版模型退步、哪個服務在哪一週錯誤率飆高、分類器的混淆矩陣哪一格最大。格子的深淺讓規律浮出來，格子裡的數字讓讀者能核對。

**不適合：**

- 格子裡是定性等級（做得好／部分／做不到）→ 比較矩陣（`matrix.md`）。熱力圖的每一格都是量出來的數字。
- 讀者會逐格查數字、不會整體掃視 → 普通 Markdown 表格。
- 只有一列或一欄 → 長條圖（`bar.md`）或表格；看不出交叉，就沒有理由用熱力圖。
- 列 × 欄超過 7 × 7 → 拆圖或改表格，手機上格子會小到放不下數字。
- 要看的是隨時間的趨勢線 → 折線圖（`line.md`）。

## 版面

- viewBox 640。左側約 160 放列名（`dg-label`，`text-anchor="end"`，x = 160），上方約 64 放欄名（`dg-label`，置中）。
- 格子等寬等高，格間距 4，`rx="2"`。640 寬可放 5 欄 × 84 寬；列高 48。列 3–7、欄 3–6。
- 不畫格線、外框，格子之間的間距就是分隔。
- 圖例放底部：每個深淺等級一個 16×16 色塊加數值範圍，再加焦點格的樣式說明。

## 顏色與數值

- **一條色階，只有一個色相。** 用 `dg-heat-0`～`dg-heat-5`（同一個綠色由淡到深），數值越大越深。不要用紅黃綠或藍白紅：多色相會被讀成「好壞」或「正負」，只有資料本身有正負、而且 0 有意義時才適合，這組 class 不提供。
- **分箱寫清楚。** 先決定 3–4 個區間（例如「低於 8%」「8–14%」「15% 以上」），每個區間一個等級，區間寫進圖例。分箱方式（等距或依分位數）寫在 caption。
- **每一格都要寫數字**（`dg-label` 置中）。只靠深淺，色弱讀者、黑白列印、和兩個相鄰等級都分不出來；數字才是資料，顏色只是幫忙掃視。
- **要寫數字的格子只用 `dg-heat-0`～`dg-heat-3`。** `dg-heat-4`、`dg-heat-5` 在深色模式下底色太亮，墨色字讀不到；這兩級只留給不放字的小格子（例如日曆式的活動格，數值另外寫在正文或表格）。
- **焦點格只有一個**：正文在講的那一格（不一定是最大值），疊一個同尺寸的 `<rect class="dg-line dg-line--accent">` 外框，對應的欄名或列名可以加 `dg-text--accent`。不要把焦點格塗成另一個顏色，那會讓它脫離色階。
- `dg-heat-0` 是「0 或沒有資料」。沒有資料的格子寫「—」並在 caption 說明，不要當成 0。

## 數值換算

熱力圖的位置是類別、不是量尺，所以沒有座標換算；要換算的是**數值 → 等級**：

```text
等級 = 第幾個區間（區間邊界寫在圖例）
```

數值來自文章引用的來源；每一列、每一欄都要畫出來，因為刪掉不好看的列，讀者看不出來。真的有排除，寫在 caption。

## 範例

````markdown
```diagram
title: 工具呼叫在 v4 退步
desc: 四種題型在五個模型版本的錯誤率；大多數格子逐版下降，只有工具呼叫在 v4 從 7% 跳到 21%，v5 又回到 8%。
caption: 示意資料。錯誤率分三級：低於 8%、8–14%、15% 以上；格內數字為實際值。
---
<svg viewBox="0 0 640 344">
  <text class="dg-label" x="218" y="40" text-anchor="middle" dominant-baseline="central">v1</text>
  <text class="dg-label" x="306" y="40" text-anchor="middle" dominant-baseline="central">v2</text>
  <text class="dg-label" x="394" y="40" text-anchor="middle" dominant-baseline="central">v3</text>
  <text class="dg-label dg-text--accent" x="482" y="40" text-anchor="middle" dominant-baseline="central">v4</text>
  <text class="dg-label" x="570" y="40" text-anchor="middle" dominant-baseline="central">v5</text>
  <text class="dg-label" x="160" y="88" text-anchor="end" dominant-baseline="central">數學推理</text>
  <rect class="dg-heat-2" x="176" y="64" width="84" height="48" rx="2"/>
  <text class="dg-label" x="218" y="88" text-anchor="middle" dominant-baseline="central">12%</text>
  <rect class="dg-heat-2" x="264" y="64" width="84" height="48" rx="2"/>
  <text class="dg-label" x="306" y="88" text-anchor="middle" dominant-baseline="central">10%</text>
  <rect class="dg-heat-2" x="352" y="64" width="84" height="48" rx="2"/>
  <text class="dg-label" x="394" y="88" text-anchor="middle" dominant-baseline="central">9%</text>
  <rect class="dg-heat-2" x="440" y="64" width="84" height="48" rx="2"/>
  <text class="dg-label" x="482" y="88" text-anchor="middle" dominant-baseline="central">8%</text>
  <rect class="dg-heat-1" x="528" y="64" width="84" height="48" rx="2"/>
  <text class="dg-label" x="570" y="88" text-anchor="middle" dominant-baseline="central">7%</text>
  <text class="dg-label" x="160" y="140" text-anchor="end" dominant-baseline="central">程式生成</text>
  <rect class="dg-heat-3" x="176" y="116" width="84" height="48" rx="2"/>
  <text class="dg-label" x="218" y="140" text-anchor="middle" dominant-baseline="central">15%</text>
  <rect class="dg-heat-2" x="264" y="116" width="84" height="48" rx="2"/>
  <text class="dg-label" x="306" y="140" text-anchor="middle" dominant-baseline="central">13%</text>
  <rect class="dg-heat-2" x="352" y="116" width="84" height="48" rx="2"/>
  <text class="dg-label" x="394" y="140" text-anchor="middle" dominant-baseline="central">11%</text>
  <rect class="dg-heat-2" x="440" y="116" width="84" height="48" rx="2"/>
  <text class="dg-label" x="482" y="140" text-anchor="middle" dominant-baseline="central">10%</text>
  <rect class="dg-heat-2" x="528" y="116" width="84" height="48" rx="2"/>
  <text class="dg-label" x="570" y="140" text-anchor="middle" dominant-baseline="central">9%</text>
  <text class="dg-label" x="160" y="192" text-anchor="end" dominant-baseline="central">長文摘要</text>
  <rect class="dg-heat-1" x="176" y="168" width="84" height="48" rx="2"/>
  <text class="dg-label" x="218" y="192" text-anchor="middle" dominant-baseline="central">6%</text>
  <rect class="dg-heat-1" x="264" y="168" width="84" height="48" rx="2"/>
  <text class="dg-label" x="306" y="192" text-anchor="middle" dominant-baseline="central">6%</text>
  <rect class="dg-heat-1" x="352" y="168" width="84" height="48" rx="2"/>
  <text class="dg-label" x="394" y="192" text-anchor="middle" dominant-baseline="central">5%</text>
  <rect class="dg-heat-1" x="440" y="168" width="84" height="48" rx="2"/>
  <text class="dg-label" x="482" y="192" text-anchor="middle" dominant-baseline="central">5%</text>
  <rect class="dg-heat-1" x="528" y="168" width="84" height="48" rx="2"/>
  <text class="dg-label" x="570" y="192" text-anchor="middle" dominant-baseline="central">4%</text>
  <text class="dg-label" x="160" y="244" text-anchor="end" dominant-baseline="central">工具呼叫</text>
  <rect class="dg-heat-2" x="176" y="220" width="84" height="48" rx="2"/>
  <text class="dg-label" x="218" y="244" text-anchor="middle" dominant-baseline="central">9%</text>
  <rect class="dg-heat-2" x="264" y="220" width="84" height="48" rx="2"/>
  <text class="dg-label" x="306" y="244" text-anchor="middle" dominant-baseline="central">8%</text>
  <rect class="dg-heat-1" x="352" y="220" width="84" height="48" rx="2"/>
  <text class="dg-label" x="394" y="244" text-anchor="middle" dominant-baseline="central">7%</text>
  <rect class="dg-heat-3" x="440" y="220" width="84" height="48" rx="2"/>
  <text class="dg-label" x="482" y="244" text-anchor="middle" dominant-baseline="central">21%</text>
  <rect class="dg-heat-2" x="528" y="220" width="84" height="48" rx="2"/>
  <text class="dg-label" x="570" y="244" text-anchor="middle" dominant-baseline="central">8%</text>
  <rect class="dg-line dg-line--accent" x="440" y="220" width="84" height="48" rx="2"/>
  <line class="dg-rule" x1="20" y1="296" x2="620" y2="296"/>
  <text class="dg-tag" x="20" y="320" dominant-baseline="central">圖例</text>
  <rect class="dg-heat-1" x="84" y="312" width="16" height="16" rx="2"/>
  <text class="dg-small" x="108" y="320" dominant-baseline="central">低於 8%</text>
  <rect class="dg-heat-2" x="204" y="312" width="16" height="16" rx="2"/>
  <text class="dg-small" x="228" y="320" dominant-baseline="central">8–14%</text>
  <rect class="dg-heat-3" x="324" y="312" width="16" height="16" rx="2"/>
  <text class="dg-small" x="348" y="320" dominant-baseline="central">15% 以上</text>
  <rect class="dg-line dg-line--accent" x="444" y="312" width="16" height="16" rx="2"/>
  <text class="dg-small" x="468" y="320" dominant-baseline="central">退步的那一格</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 格子裡沒有數字、只有顏色 | 色弱讀者和黑白列印讀不到，相鄰等級也分不出來 |
| 每一列或每一欄一個顏色 | 色相表達的是「哪一組」，不是「多少」；數量只能用深淺 |
| 紅黃綠、藍白紅色階 | 讀者會讀成好壞或正負；資料沒有正負就用單一色相 |
| 用連續漸層圖例 | 讀者沒辦法對回數字；分箱、每級寫範圍 |
| 焦點格塗成另一個顏色 | 它脫離色階、讀者會以為是另一種資料；用外框標出 |
| 兩三格都標焦點 | 沒有決定正文在講哪一格 |
| 悄悄刪掉某列或某欄 | 讀者以為那一列沒有問題；全部畫出，排除要說明 |
| 文字格用 `dg-heat-4`／`5` | 深色模式下字看不到 |
| 定性評分畫成熱力圖 | 那是比較矩陣；熱力圖的深淺代表數量 |

## 深色格子上的數字

`dg-heat-4`、`dg-heat-5` 上的數字用 `dg-text--on-heat`（深綠字，淺色與深色模式都讀得到）；焦點格疊一個 `dg-outline--accent` 外框，不要靠底色區分。見 `../style.md` 的「小零件」。

# 魚骨圖（Fishbone／Ishikawa）

**適合：** 結構化的根因分析。一個觀察到的結果（症狀、事故、指標下降），把可能的原因依類別分組，每個類別底下再掛幾個子原因。事後檢討（post-mortem）的標準圖：讀者要看的是「查過哪些方向、最後確認是哪一個」，不只是結論。

**不適合：**

- 一連串依序發生的失誤（A 壞了導致 B、B 又導致 C）→ 時間軸（`timeline.md`）或循序圖（`sequence.md`）。魚骨圖是**一個結果**的多個原因，不是事件經過。
- 原因有好幾層、一路往下拆（原因的原因的原因）→ 樹狀圖（`tree.md`）。魚骨圖只到兩層：類別、子原因。
- 要比較幾個原因的可能性、影響程度、修復成本 → 比較矩陣（`matrix.md`）或象限圖（`quadrant.md`）。
- 要講症狀出現後怎麼一步步排查 → 流程圖（`flowchart.md`）。
- 只有一兩個原因 → 一句話。

## 版面

- **主骨（spine）：** 一條水平線 `dg-line dg-line--strong`，從左邊一路延伸到右端的**結果框**。結果框是觀察到的症狀，用 `dg-box--warn`（它就是那個「壞掉」的東西），寫成名詞短語：「RAG 回答品質下降」「結帳 p99 延遲升高」，不要寫成解法。主骨不加箭頭：結果框放在右端，方向已經清楚，而且箭頭 marker 是灰的，和深色主骨不同色。
- **大骨（類別）：** 從主骨斜向左上、左下伸出，**上下成對**，共用同一個接點；每對間隔 176。大骨末端接一個類別框（`dg-box`，高 28，`dg-label`），框的下緣（上方大骨）或上緣（下方大骨）剛好是大骨的終點。
- **小骨（子原因）：** 從大骨上的固定位置往左拉一條 24 長的**水平**短線，子原因文字 `dg-sub` 接在短線左端再往左 6（`text-anchor="end"`），和短線同一個 y。每根大骨 1–3 個子原因。
- **焦點：** 確認的根因那一根大骨用 `dg-line--accent`，它的類別框用 `dg-box--accent`，兩者算一個 accent。結果框已經是 `dg-box--warn`，不另外用 accent。全圖只能有一個根因被標出來。
- 類別從實際調查來，不要套 6M（人、機、料、法、測、環）範本再把空格補滿。沒有子原因的類別不要畫。

### 斜線例外

**大骨保留斜線，這是本站「只用直角線」（`primitives.md` 規則 1）的第二個例外**（第一個是循環圖的環，見 `loop.md`）。理由：斜向往右收的大骨就是讀者認出「這是魚骨圖」的形狀，也表達「所有原因匯向同一個結果」；改成直角版會變成一把梳子，讀起來像樹狀圖或時間軸的刻度，失去圖型本身的意思。例外只限：

- **大骨本身**：全部同一個角度（約 60°，下方的數字），互相平行，不轉彎。
- 小骨、指向結果框的線、任何註記線，一律照六條連線規則走水平／垂直線。

### 座標（640 寬）

主骨在 y = CY，結果框左緣在 x = 488。第 k 對大骨（k = 0, 1）的接點 x = 440 − 176k；每根大骨的位移是 dx = −64、dy = ∓112（上方減、下方加），角度約 60°。小骨放在大骨長度的 1/4 和 5/8 處，座標剛好落在 4 的倍數：

| 位置 | 上方大骨 | 下方大骨 |
|---|---|---|
| 1/4 處 | (接點 − 16, CY − 28) | (接點 − 16, CY + 28) |
| 5/8 處 | (接點 − 40, CY − 70) | (接點 − 40, CY + 70) |

子原因文字最長約 10 個中文字（125）：太長會碰到左邊那對大骨。640 寬最多兩對（4 個類別）；第三對的類別框會超出左緣。要 5–6 個類別就用 800 寬（接點 x 依序是 600、424、248，結果框左緣 648），或依子系統拆成兩張圖。

## 範例

````markdown
```diagram
title: RAG 回答品質下降的原因
desc: 查過資料、檢索、提示、模型四個方向，確認根因在檢索：換了 embedding 模型卻沒有重建索引。
caption: 綠色是確認的根因；其他是調查過、已排除或次要的原因。
---
<svg viewBox="0 0 640 344">
  <path class="dg-line dg-line--strong" d="M20 180H488"/>

  <path class="dg-line dg-line--accent" d="M440 180L376 68"/>
  <path class="dg-line" d="M440 180L376 292"/>
  <path class="dg-line" d="M264 180L200 68"/>
  <path class="dg-line" d="M264 180L200 292"/>

  <path class="dg-line" d="M424 152H400"/>
  <path class="dg-line" d="M400 110H376"/>
  <path class="dg-line" d="M424 208H400"/>
  <path class="dg-line" d="M400 250H376"/>
  <path class="dg-line" d="M248 152H224"/>
  <path class="dg-line" d="M224 110H200"/>
  <path class="dg-line" d="M248 208H224"/>
  <path class="dg-line" d="M224 250H200"/>

  <rect class="dg-box dg-box--accent" x="332" y="40" width="88" height="28" rx="6"/>
  <text class="dg-label" x="376" y="54" text-anchor="middle" dominant-baseline="central">檢索</text>
  <rect class="dg-box" x="332" y="292" width="88" height="28" rx="6"/>
  <text class="dg-label" x="376" y="306" text-anchor="middle" dominant-baseline="central">資料</text>
  <rect class="dg-box" x="156" y="40" width="88" height="28" rx="6"/>
  <text class="dg-label" x="200" y="54" text-anchor="middle" dominant-baseline="central">提示</text>
  <rect class="dg-box" x="156" y="292" width="88" height="28" rx="6"/>
  <text class="dg-label" x="200" y="306" text-anchor="middle" dominant-baseline="central">模型</text>

  <rect class="dg-box dg-box--warn" x="488" y="140" width="132" height="80" rx="6"/>
  <text class="dg-label" x="554" y="168" text-anchor="middle" dominant-baseline="central">RAG 回答</text>
  <text class="dg-label" x="554" y="192" text-anchor="middle" dominant-baseline="central">品質下降</text>

  <text class="dg-sub" x="394" y="152" text-anchor="end" dominant-baseline="central">換模型沒重建索引</text>
  <text class="dg-sub" x="370" y="110" text-anchor="end" dominant-baseline="central">top-k 設太小</text>
  <text class="dg-sub" x="394" y="208" text-anchor="end" dominant-baseline="central">文件內容過期</text>
  <text class="dg-sub" x="370" y="250" text-anchor="end" dominant-baseline="central">切塊切斷上下文</text>
  <text class="dg-sub" x="218" y="152" text-anchor="end" dominant-baseline="central">context 被截斷</text>
  <text class="dg-sub" x="194" y="110" text-anchor="end" dominant-baseline="central">提示詞改版</text>
  <text class="dg-sub" x="218" y="208" text-anchor="end" dominant-baseline="central">供應商悄悄換版</text>
  <text class="dg-sub" x="194" y="250" text-anchor="end" dominant-baseline="central">取樣溫度調高</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 子原因只是把類別名重講一次（「資料」底下寫「資料問題」） | 多一個節點、沒有多一點資訊 |
| 沒有子原因的大骨 | 空類別是待辦，不是發現；刪掉或等查到東西再畫 |
| 兩根大骨都標 accent | 「這就是答案」的訊號被稀釋；兩個都確認就拆成兩張圖，或合併成一個原因 |
| 用魚骨圖畫一串依序發生的失誤 | 那是時間軸或循序圖；魚骨圖是一個結果的多個原因 |
| 套 6M 範本、留著空類別 | 類別要從實際調查來，不是等人填的表格 |
| 結果框寫成解法（「加 p99 告警」） | 結果框寫觀察到的症狀或指標，解法放正文 |
| 大骨角度各不相同、或小骨也畫成斜的 | 斜線例外只給大骨，而且要彼此平行；其他線照直角規則 |
| 子原因寫成一整句 | 會撞到左邊那對大骨；壓在 10 個字內，細節寫正文 |

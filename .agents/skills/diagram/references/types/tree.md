# 樹狀圖（Tree）

**適合：** 上下層的父子關係——模組拆解、分類法、組織圖、相依樹、檔案目錄、一個問題拆成幾個子問題。每個節點只有一個父節點，讀者要看的是「誰底下有什麼」。

**不適合：** 節點之間有橫向連線或多個父節點（那是相依圖，用架構圖或 mermaid）；講的是做事的順序（用流程圖）；只有兩層、每層三四項（用巢狀條列）；重點是「誰在誰的範圍裡」而不是「誰拆成誰」（用 `nested.md`）。

## 版面

- 根節點在最上面，子節點往下展開；層級很深但每層很窄時，可以改成根在左、往右展開。整張圖維持同一個方向。
- 同一層的節點對齊在同一列，高度一致；父節點水平置中在自己的子節點上方。
- 不同子樹之間的間距要比同一子樹內兄弟節點的間距大（例如 32 對 12），讀者才看得出分組。
- 深度最多 4 層（根＋3 層），每層最多 5 個節點，總數照 `primitives.md` 上限 9 個。超過就拆：一張總覽到第二層，另一張展開其中一棵子樹。
- 節點寬度最多兩種：上層一種、葉節點一種。根節點可以大一點，用大小表達層級。
- accent 只給一個：根節點，**或**正文在討論的那個關鍵葉節點，不要兩個都標。
- 葉節點不必另外換樣式，位置在最底下已經說明它是葉節點。

## 連線

- **只用直角線，禁止斜線。** 父節點從下緣中點往下一小段，接到一條水平「匯流線」，再從匯流線分別往下接到每個子節點的上緣中點。
- 匯流線的兩端用半徑 8 的圓角轉進子節點；正下方的子節點直接用直線接，不需要轉角。
- 樹的連線不加箭頭、不加標籤：父子關係由上下位置表達。需要說明「怎麼拆」的時候，把說明寫在子節點副標，不要寫在線上。
- 不跳層：父節點不能直接連到孫節點，中間那層省略的話整棵子樹都要省略。

## 可追溯的模組拆解

拆解圖要讓讀者（或稽核、規格文件）能直接指到某一塊時，在節點左上角加一個 `dg-tag` 編號（`A`、`A.1`、`A.2`），正文用同一個編號引用。名稱寫名詞（「付款驗證」），不要寫動作（「驗證付款」）；是動作的話它屬於流程圖。每一塊的輸入、輸出、限制寫在正文或表格，不要塞進圖裡。

## 範例

````markdown
```diagram
title: Transformer 的元件拆解
desc: 原始 Transformer 分成 Encoder 與 Decoder 兩疊；Encoder 每層有自注意力與前饋網路，Decoder 每層多一個讀取 Encoder 輸出的交叉注意力。
caption: 簡化示意：省略輸入嵌入、位置編碼、殘差連接與 LayerNorm。
---
<svg viewBox="0 0 640 296">
  <path class="dg-line" d="M290 84V106"/>
  <path class="dg-line" d="M130 128V114Q130 106 138 106H442Q450 106 450 114V128"/>
  <path class="dg-line" d="M130 184V208"/>
  <path class="dg-line" d="M70 232V216Q70 208 78 208H182Q190 208 190 216V232"/>
  <path class="dg-line" d="M450 184V232"/>
  <path class="dg-line" d="M330 232V216Q330 208 338 208H562Q570 208 570 216V232"/>

  <rect class="dg-box" x="188" y="20" width="204" height="64" rx="6"/>
  <text class="dg-label" x="290" y="43" text-anchor="middle" dominant-baseline="central">Transformer</text>
  <text class="dg-sub" x="290" y="64" text-anchor="middle" dominant-baseline="central">編碼器–解碼器架構</text>

  <rect class="dg-box" x="50" y="128" width="160" height="56" rx="6"/>
  <text class="dg-label" x="130" y="147" text-anchor="middle" dominant-baseline="central">Encoder</text>
  <text class="dg-sub" x="130" y="168" text-anchor="middle" dominant-baseline="central">×N 層，讀懂輸入</text>

  <rect class="dg-box" x="370" y="128" width="160" height="56" rx="6"/>
  <text class="dg-label" x="450" y="147" text-anchor="middle" dominant-baseline="central">Decoder</text>
  <text class="dg-sub" x="450" y="168" text-anchor="middle" dominant-baseline="central">×N 層，逐字產生輸出</text>

  <rect class="dg-box" x="16" y="232" width="108" height="48" rx="6"/>
  <text class="dg-label" x="70" y="256" text-anchor="middle" dominant-baseline="central">自注意力</text>
  <rect class="dg-box" x="136" y="232" width="108" height="48" rx="6"/>
  <text class="dg-label" x="190" y="256" text-anchor="middle" dominant-baseline="central">前饋網路</text>

  <rect class="dg-box" x="276" y="232" width="108" height="48" rx="6"/>
  <text class="dg-label" x="330" y="256" text-anchor="middle" dominant-baseline="central">遮罩注意力</text>
  <rect class="dg-box dg-box--accent" x="396" y="232" width="108" height="48" rx="6"/>
  <text class="dg-label" x="450" y="256" text-anchor="middle" dominant-baseline="central">交叉注意力</text>
  <rect class="dg-box" x="516" y="232" width="108" height="48" rx="6"/>
  <text class="dg-label" x="570" y="256" text-anchor="middle" dominant-baseline="central">前饋網路</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 斜線從父節點拉到每個子節點 | 違反規則 1，子節點一多就變成放射狀亂線 |
| 一張圖 5 層以上 | 底層字縮到讀不了；拆成總覽＋子樹細節 |
| 每個節點寬度都不一樣 | 看起來像沒排過；最多兩種寬度 |
| 跳層連線（父直接連孫） | 讀者會以為中間那層不存在 |
| 根節點和葉節點都標 accent | 焦點分散，讀者不知道該看哪裡 |
| 兄弟節點之間又畫橫向線 | 那已經不是樹，改用架構圖或 mermaid |
| 節點名稱寫成動作（「驗證付款」） | 那是流程的步驟，拆解圖要寫名詞 |

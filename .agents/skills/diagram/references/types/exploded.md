# 爆炸等軸測圖（Exploded axonometric）

**適合：** 一個實體物件用平行投影畫出來，零件沿著一個軸拉開、各自標名字。拆機（手機裡面有什麼）、開箱（盒蓋、產品、內襯、盒子）、組裝順序。讀者要看的是「這東西由哪幾塊組成、誰疊在誰上面、誰跟誰在同一層」。

**不適合：**

- 有順序的抽象層級，每層配一句說明 → 分層圖（`layers.md`）。分層圖是一列列扁平的文字帶；爆炸圖是**一個東西的零件**。圖裡沒有任何東西有「面積」和「厚度」的意義，就用分層圖。軟體堆疊（應用、框架、模型 API）幾乎都屬於這一類。
- 元件之間怎麼連 → 架構圖（`architecture.md`）。爆炸圖沒有箭頭，沿軸的位置就是唯一的關係。
- 誰包住誰、沒有上下順序 → 巢狀圖（`nested.md`）。
- 一層樓或一塊場地的平面配置 → 等軸測平面圖（`axonometric-plan.md`）；平面圖只有一塊底板，什麼都不拉開。

老實說：部落格很少需要這種圖。只有正文真的在講實體拆解、開箱或組裝，而且讀者看到零件的相對大小和位置會多懂一點時才畫；否則一張照片或一個條列就夠了。

## 投影

用 2:1 的等軸測（dimetric）投影，地面的兩條軸斜 26.565°。模型單位都取 4 的倍數，每條邊都會落在整數像素上。模型的 x 往右下、y 往左下、z 往上，所有點都用同一個函式換算，**不要手放座標**：

```python
def iso(x, y, z, ox, oy):
    """模型座標 → SVG 座標；(ox, oy) 是模型原點 (0, 0, 0) 在圖上的位置。"""
    return ox + x - y, oy + (x + y) / 2 - z
```

先寫一支小腳本（放在暫存目錄，不進 repo）算出每個面的點，再把結果貼進 ```` ```diagram ```` 區塊。

- **每個零件是一個長方體**，看得到三個面：頂面 `dg-face dg-face--top`、左前面（y 最大的那面）`dg-face--left`、右前面（x 最大的那面）`dg-face--right`。光從左上來，所以左面比右面亮。**一定要有明暗**：只有框線的方塊會像 Necker cube 一樣前後翻來翻去。
- 每個面都是不透明的，後面的零件不會透出來。不要用半透明讓某個零件「退後」。
- 頂面上的細節（螢幕範圍、晶片、凹槽）畫成頂面高度上的扁平多邊形，用 `dg-face--left` 或 `dg-face--right` 讓它比頂面深一點。細節最多兩層（零件本身＋頂面上的嵌件），離邊至少 4 個單位。
- 不用陰影、漸層、發光，也不用 CSS `transform` 或 3D 來擺幾何。

**連線規則的例外：** 投影出來的斜邊（面的輪廓）本來就是斜的，不受 `primitives.md`「只用水平、垂直線」的限制。圖裡真正的「線」——標籤的引線、任何指向零件的箭頭——仍然只能水平或垂直。

## 版面

- **零件：** 2–5 個，由下往上列。底下那個零件留在 z = 0。
- **拉開的軸：** 預設是垂直往上。零件只往上移，不旋轉、不側移，一張圖只沿一個軸拉開。
- **同一層：** 組好時並排的零件，拉開時一起抬起來，不要硬拆成兩層。手機的電池和主機板並排在機殼裡，所以它們是同一層。
- **間距：** 每兩層之間的間距一樣，`gap = max(0.5 × 最大頂面高度, 3 × 最厚實心零件的厚度)`，取 4 的倍數；頂面高度是 `(寬 + 深) / 2`。兩組標籤擠在一起（名稱加副標約 32 高，引線相距不到 56）或引線會穿過零件時，以 4 為單位加大間距。不要為了塞進畫面而縮小間距，要砍零件。
- **繪製順序：** 先畫最下層。同一層裡，越後面（x + y 越小）的先畫。追蹤線（下一點）比所有零件都先畫，讓零件蓋住它。
- **追蹤線：** 從最下層零件的最左、最右兩點，各畫一條垂直的 `dg-grid` 虛線到最上層零件的底面，讓讀者看出零件原本疊在一起的位置。
- **標籤：** 每個零件一個標籤，全部排在物件右邊同一欄，左對齊：名稱 `dg-label`（一兩個詞），下面一行 `dg-sub` 寫技術細節。名稱在引線上方約 9，副標在下方約 11。
- **引線：** 從零件最右邊那個點（厚度的一半高）放一個 r=2.5 的 `dg-dot`，往右拉一條水平 `dg-rule` 到標籤欄左邊 12。引線不轉彎、不交叉、不穿過零件；同一層後面那個零件的最右點最靠右，前面那個零件的引線會從它下面經過，要確認有留縫。
- **焦點：** 最多一個零件用 `dg-face--accent`，它的圓點、引線（`dg-line dg-line--accent`）和副標（`dg-text--accent`）跟著變綠，名稱維持墨色。其他零件不要淡化。
- 不放圖例，也不用編號對照表：標籤就寫在它指的零件旁邊。
- 物件加標籤欄整體置中，640 寬放得下 3 層、4–5 個零件。

## 範例

````markdown
```diagram
title: 一支手機拆開來的三層
desc: 手機由下往上是背殼、並排的電池與主機板、螢幕模組；電池和主機板組裝時並排，所以拉開時同一層抬起。
caption: 簡化示意：省略相機模組、喇叭與排線；各廠的內部配置不同。
---
<svg viewBox="0 0 640 384">
  <line class="dg-grid" x1="80" y1="312" x2="80" y2="112"/>
  <line class="dg-grid" x1="320" y1="272" x2="320" y2="72"/>
  <!-- L0 背殼 -->
  <polygon class="dg-face dg-face--left" points="80,320 160,360 160,352 80,312"/>
  <polygon class="dg-face dg-face--right" points="320,280 160,360 160,352 320,272"/>
  <polygon class="dg-face dg-face--top" points="240,232 320,272 160,352 80,312"/>
  <polygon class="dg-face dg-face--left" points="240,238 308,272 160,346 92,312"/>
  <g>
    <line class="dg-rule" x1="326" y1="276" x2="396" y2="276"/>
    <circle class="dg-dot" cx="320" cy="276" r="2.5"/>
    <text class="dg-label" x="408" y="267" dominant-baseline="central">背殼</text>
    <text class="dg-sub" x="408" y="287" dominant-baseline="central">中框・天線・按鍵</text>
  </g>
  <!-- L1 電池（後）＋主機板（前），同一層一起抬起 -->
  <polygon class="dg-face dg-face--left" points="164,178 236,214 236,206 164,170"/>
  <polygon class="dg-face dg-face--right" points="312,176 236,214 236,206 312,168"/>
  <polygon class="dg-face dg-face--top" points="240,132 312,168 236,206 164,170"/>
  <polygon class="dg-face dg-face--left" points="240,140 296,168 236,198 180,170"/>
  <polygon class="dg-face dg-face--left dg-face--accent" points="88,216 160,252 160,248 88,212"/>
  <polygon class="dg-face dg-face--right dg-face--accent" points="224,220 160,252 160,248 224,216"/>
  <polygon class="dg-face dg-face--top dg-face--accent" points="152,180 224,216 160,248 88,212"/>
  <polygon class="dg-face dg-face--right" points="152,192 176,204 152,216 128,204"/>
  <polygon class="dg-face dg-face--right" points="184,208 200,216 184,224 168,216"/>
  <g>
    <line class="dg-rule" x1="318" y1="172" x2="396" y2="172"/>
    <circle class="dg-dot" cx="312" cy="172" r="2.5"/>
    <text class="dg-label" x="408" y="163" dominant-baseline="central">電池</text>
    <text class="dg-sub" x="408" y="183" dominant-baseline="central">鋰離子電芯</text>
  </g>
  <g>
    <line class="dg-line dg-line--accent" x1="230" y1="218" x2="396" y2="218"/>
    <circle class="dg-dot dg-dot--accent" cx="224" cy="218" r="2.5"/>
    <text class="dg-label" x="408" y="209" dominant-baseline="central">主機板</text>
    <text class="dg-sub dg-text--accent" x="408" y="229" dominant-baseline="central">處理器・記憶體・基頻</text>
  </g>
  <!-- L2 螢幕 -->
  <polygon class="dg-face dg-face--left" points="80,112 160,152 160,146 80,106"/>
  <polygon class="dg-face dg-face--right" points="320,72 160,152 160,146 320,66"/>
  <polygon class="dg-face dg-face--top" points="240,26 320,66 160,146 80,106"/>
  <polygon class="dg-face dg-face--right" points="240,32 308,66 160,140 92,106"/>
  <g>
    <line class="dg-rule" x1="326" y1="69" x2="396" y2="69"/>
    <circle class="dg-dot" cx="320" cy="69" r="2.5"/>
    <text class="dg-label" x="408" y="60" dominant-baseline="central">螢幕模組</text>
    <text class="dg-sub" x="408" y="80" dominant-baseline="central">面板＋觸控層＋玻璃</text>
  </g>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 手放座標、或用 `transform` 代替算出來的幾何 | 面和面接不起來，換個間距就全部重算 |
| 只有框線、沒有明暗的方塊 | 讀者分不出哪面朝前，圖會前後翻 |
| 零件旋轉、側移，或同時沿兩個軸拉開 | 讀者看不出原本怎麼疊 |
| 間距不一樣，或為了塞進畫面縮小間距 | 看起來像有意義的距離；該做的是砍零件 |
| 標籤貼在零件上、跟著面斜放，或分成左右兩欄 | 斜字難讀，兩欄讓視線來回跳 |
| 編號加底下的對照表 | 讀者要來回查；標籤直接寫在旁邊 |
| 兩個以上零件標 accent，或把其他零件調淡 | 焦點分散；淡化的零件會透出後面的邊 |
| 拿來畫軟體堆疊或一串概念 | 沒有實體零件的東西用分層圖，爆炸圖只會多出假的厚度 |

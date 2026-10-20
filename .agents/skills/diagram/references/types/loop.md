# 循環圖（Loop）

**適合：** 會繞回起點、而且每轉一圈都累積一點東西的循環——飛輪、回饋迴路、營運循環（觀察 → 決策 → 執行 → 衡量 → 再觀察）。讀者要同時看到兩件事：工作沿著環往前走，以及每一圈都把成果寫回中間那個共用的累積狀態。

**不適合：** 走完就結束、或會岔向不同結果的路線（用 `flowchart.md`，把真正的終點畫出來）；只是排成圓形、最後一步其實不會回到第一步的流程（那是假循環，同樣用流程圖）；狀態之間依條件切換（用 `state.md`）。

## 版面

- **站點 4–6 個**，沿一個圓等角度排列，第 0 站在正上方，順時針前進。超過 6 個，手機上站點和標籤會擠在一起，拆成總覽循環＋細節圖。
- **中心放一個累積狀態（hub）**：資料集、記憶、評測集、知識庫這類「每一圈都變大」的東西，用 `dg-box dg-box--store`，比站點略小或等大。hub 不是第 N+1 個步驟，只寫一個名稱加一行副標。只能有一個 hub；兩個 hub 是兩張圖。
- 中心沒有累積任何東西時，hub 可以拿掉，只畫環；但先問自己這個「循環」是不是真的會變強，不會的話它可能只是一份步驟清單。
- 4 個站點時放在上、右、下、左四個正方位，讓中心的連線剛好是水平或垂直；5–6 個站點時，連線會變成斜的放射線（見下方「連線」）。
- 環的寬度（2R＋站點寬）盡量讓 viewBox 壓在 440 內：元件把寬度 ≤ 440 的圖整張縮進手機螢幕，再寬就會設最小寬度、改成框內左右捲動，讀者看不到整圈（範例 R=152、站點寬 120、viewBox 440）。
- 站點節點 `dg-box`，名稱＋副標。accent 最多給一個站點：讀者該注意的那個關卡（例如「模型改善」或「人工審核」）。

## 連線

**環用圓弧，這是本站「只用直角線」（`primitives.md` 規則 1）唯一的例外。** 原因：循環圖的重點就是「繞回起點」，用直角線繞一圈會變成圓角矩形，看起來和流程圖的回頭線一模一樣；同一個圓上的弧，讀者一眼就讀成「一直轉下去」。例外只限以下兩種線：

- **環上的箭頭：** 每一段都是同一個圓（圓心 C、半徑 R）上的弧，一律 `A R R 0 0 1`（順時針、小弧）。起點是弧線離開來源站點框的交點，終點是弧線進入下一站點框的交點再往回退 3（讓箭頭尖端停在框線外）。最後一站一定接回第 0 站。不要混用弧線和直角線——混了環就不像一個圓。
- **中心的放射線：** 站點和 hub 之間的直線，沿著圓心方向，用 `dg-line dg-line--dashed`，和實線的環區分「工作往前走」與「寫回／讀出累積狀態」。方向照實畫：寫回指向 hub，從累積狀態取用就從 hub 指出來。不要每個站點都拉放射線，只畫真的讀寫累積狀態的那幾站。

弧線端點算法（框寬 w、高 h、中心 (px, py)）：對框的四條邊分別求和圓的交點——垂直邊 x = xe 時 y = cy ± √(R² − (xe − cx)²)，水平邊 y = ye 時 x = cx ± √(R² − (ye − cy)²)，只留落在邊上的那兩點；順時針方向在站點角度之後的那點是出口，之前的那點是入口。用一小段 script 算，四捨五入到小數一位即可（弧的端點不受「4 的倍數」限制）。

- 環上的弧通常不需要標籤：站點名稱已經說明每一步。放射線可以標一兩個字（`寫入`、`訓練`），放在線的一側、離線 6–10。
- 環不能穿過 hub；R 不夠大就加大，不要讓工作流穿過累積狀態。
- 逐步播放很適合循環圖：每一步亮起「到下一站的弧＋下一站」，最後一步亮起回到第 0 站的那段弧，讓讀者看到「又回到起點」。

## 範例

````markdown
```diagram
title: 資料飛輪
desc: 使用者使用產品時留下互動資料，資料累積成資料集，用來訓練與評測、改善模型，更好的產品再吸引更多使用者，每一圈的資料集都比上一圈大。
caption: 簡化示意：實際上資料要先經過篩選、標註與隱私處理才能拿來訓練。
step: 使用者使用產品
step: 使用過程留下互動資料，寫進資料集
step: 用累積的資料訓練、評測，改善模型
step: 模型變好，產品跟著變好
step: 更好的產品吸引更多使用者，下一圈從更大的資料集開始
---
<svg viewBox="0 0 440 392">
  <path class="dg-line" d="M280 56.3A152 152 0 0 1 368.8 165.1" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M369.4 224A152 152 0 0 1 282.7 334.4" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M160 335.7A152 152 0 0 1 71.2 226.9" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M70.6 168A152 152 0 0 1 157.3 57.6" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--dashed" d="M312 196H276" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--dashed" d="M220 224V316" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="1 5">
    <rect class="dg-box" x="160" y="16" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">使用者</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">更多人使用</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="312" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">互動資料</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">點擊・回饋</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="160" y="320" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">模型改善</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">訓練・評測</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="8" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="68" y="187" text-anchor="middle" dominant-baseline="central">更好的產品</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">回答更準</text>
  </g>

  <rect class="dg-box dg-box--store" x="168" y="168" width="104" height="56" rx="6"/>
  <text class="dg-label" x="220" y="187" text-anchor="middle" dominant-baseline="central">資料集</text>
  <text class="dg-sub" x="220" y="207" text-anchor="middle" dominant-baseline="central">每圈都變大</text>

  <text class="dg-edge" x="292" y="182" text-anchor="middle" dominant-baseline="central" data-step="2">寫入</text>
  <text class="dg-edge" x="230" y="270" text-anchor="start" dominant-baseline="central" data-step="3">訓練</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 最後一步其實不會回到第一步 | 那是排成圓形的流程圖；改用流程圖，畫出真正的終點 |
| 環用直角線繞成圓角矩形 | 看起來像流程圖的回頭線，「一直轉下去」的感覺消失 |
| 弧線和直角線混用 | 環不再像同一個圓 |
| 放射線畫成實線 | 和環上的工作流分不出來；寫回／讀出累積狀態一律虛線 |
| 兩個 hub | 兩個累積狀態就是兩個系統，拆成兩張圖 |
| 環穿過 hub | 工作流和累積狀態混在一起；加大半徑 |
| 站點間距不等 | 讀不出「固定節奏的一圈」；照 360° ÷ N 等分 |
| 多個站點標 accent | 看不出哪個關卡最重要；最多一個 |
| 超過 6 個站點 | 手機上擠成一團；拆成總覽＋細節 |

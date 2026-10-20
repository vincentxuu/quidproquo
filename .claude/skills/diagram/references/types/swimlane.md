# 泳道圖（Swimlane）

**適合：** 跨角色、跨團隊的流程：每一步由誰負責、工作在哪裡從一方交到另一方。例如發文流程、事故處理分工、人和 agent 協作、和外部廠商的交接。

**不適合：** 只有一個角色在做事（用 `flowchart.md`）；重點是參與者之間來回傳的訊息與回應（用 `sequence.md`）；只想列出誰負責什麼、沒有先後（用表格）。

## 版面

- 一個角色一條泳道，最多 5 條。文章內嵌建議用**直的泳道**（欄），流程由上往下：640 寬放得下 4 條，每條 152；手機上也比橫的泳道好讀。角色超過 4 個，或步驟多但角色少（2–3 個角色、6 步以上），改用橫的泳道，流程由左到右，角色名放在左側 96–112 寬的欄位。
- 泳道標題放在泳道最上方，`dg-label` 水平置中，下方一條 `dg-rule` 隔開標題和內容。
- 泳道之間用垂直的 `dg-rule` 分隔（從標題列頂端拉到最底），最外側兩邊不畫。不要用 `dg-band` 交錯鋪底色：交接線的標籤（`dg-edge`）自帶底色描邊，壓在帶狀底色上會露出一塊方形色塊。
- 步驟框放在**負責那一步的角色**的泳道裡，在泳道內水平置中，寬度比泳道窄 32（兩側各留 16）。
- 時間往下走：每一步一列，列距 80（框高 56＋間距 24）。同一列只放一個步驟；兩個角色同時在做的事才放同一列。
- 不必每條泳道步驟數一樣多。只出現一次的角色也值得一條泳道，交接才看得出來。
- accent 給 1–2 個：最關鍵的那個步驟（閘門、核准），或耦合最重、最容易卡住的那次交接。

## 交接線

**跨泳道的線就是交接，是這張圖的重點。** 同一條泳道內的線只是接續。

- 交接一律從步驟框的**側邊**出發、水平走到目標泳道的中線、轉一次彎往下，從目標框的**上緣**進入（`primitives.md` 的直角轉折寫法）。不要從下緣出發再橫走，會貼著框線。
- 水平段經過的泳道在那一列要是空的；會穿過別人的步驟框，就把目標往下挪一列。
- 標籤寫「交出去的東西」：`交稿`、`退回意見`、`git push`，放在水平段上方 12，整個標籤落在同一條泳道裡，不要跨在泳道分隔線上。
- 往回交接（退件、重做）用一般的線，不要特別標紅；只有失敗路徑才用 `dg-line--warn`。
- 往回的線最多一條。來回好幾次的流程，畫成「一次往返＋正文說明會重複」，或改用流程圖畫迴圈。

## 範例

````markdown
```diagram
title: 一篇文章從草稿到上線
desc: 作者交稿給審稿 agent，依退回意見修稿後 push，CI 跑完 verify 才交給部署上線。
caption: 簡化示意：省略 CI 失敗退回作者的路徑。
---
<svg viewBox="0 0 640 488">
  <line class="dg-rule" x1="16" y1="56" x2="624" y2="56"/>
  <line class="dg-rule" x1="168" y1="24" x2="168" y2="472"/>
  <line class="dg-rule" x1="320" y1="24" x2="320" y2="472"/>
  <line class="dg-rule" x1="472" y1="24" x2="472" y2="472"/>

  <text class="dg-label" x="92" y="40" text-anchor="middle" dominant-baseline="central">作者</text>
  <text class="dg-label" x="244" y="40" text-anchor="middle" dominant-baseline="central">審稿 agent</text>
  <text class="dg-label" x="396" y="40" text-anchor="middle" dominant-baseline="central">CI</text>
  <text class="dg-label" x="548" y="40" text-anchor="middle" dominant-baseline="central">部署</text>

  <path class="dg-line" d="M152 100H236Q244 100 244 108V148" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M184 180H100Q92 180 92 188V228" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M152 260H388Q396 260 396 268V308" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M456 340H540Q548 340 548 348V388" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="32" y="72" width="120" height="56" rx="6"/>
  <text class="dg-label" x="92" y="91" text-anchor="middle" dominant-baseline="central">寫草稿</text>
  <text class="dg-sub dg-mono" x="92" y="111" text-anchor="middle" dominant-baseline="central">posts/*.md</text>

  <rect class="dg-box" x="184" y="152" width="120" height="56" rx="6"/>
  <text class="dg-label" x="244" y="171" text-anchor="middle" dominant-baseline="central">審稿</text>
  <text class="dg-sub" x="244" y="191" text-anchor="middle" dominant-baseline="central">列出問題清單</text>

  <rect class="dg-box" x="32" y="232" width="120" height="56" rx="6"/>
  <text class="dg-label" x="92" y="251" text-anchor="middle" dominant-baseline="central">修稿</text>
  <text class="dg-sub" x="92" y="271" text-anchor="middle" dominant-baseline="central">逐條處理意見</text>

  <rect class="dg-box dg-box--accent" x="336" y="312" width="120" height="56" rx="6"/>
  <text class="dg-label" x="396" y="331" text-anchor="middle" dominant-baseline="central">品質閘門</text>
  <text class="dg-sub dg-mono" x="396" y="351" text-anchor="middle" dominant-baseline="central">pnpm verify</text>

  <rect class="dg-box" x="488" y="392" width="120" height="56" rx="6"/>
  <text class="dg-label" x="548" y="411" text-anchor="middle" dominant-baseline="central">上線</text>
  <text class="dg-sub" x="548" y="431" text-anchor="middle" dominant-baseline="central">build＋deploy</text>

  <text class="dg-edge" x="194" y="88" text-anchor="middle" dominant-baseline="central">交稿</text>
  <text class="dg-edge" x="136" y="168" text-anchor="middle" dominant-baseline="central">退回意見</text>
  <text class="dg-edge dg-mono" x="272" y="248" text-anchor="middle" dominant-baseline="central">git push</text>
  <text class="dg-edge" x="498" y="328" text-anchor="middle" dominant-baseline="central">全綠</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 泳道沒有標題 | 讀者不知道每條泳道是誰，整張圖失去意義 |
| 一個步驟框跨在兩條泳道上 | 等於沒指定負責人；選一個主要負責的角色 |
| 線在泳道之間來回蛇行 | 重排步驟順序，讓流程大致單向；真的要往回，最多一條 |
| 每次交接都標 accent | 交接本來就是重點，accent 只給最關鍵的那一次 |
| 交接線從框的下緣出發再橫走 | 線貼著框線，看起來像從角落長出來；從側邊出發 |
| 用泳道畫請求／回應 | 訊息往返用循序圖的生命線 |
| 超過 5 條泳道或 9 個步驟 | 拆成總覽和其中一段的細節兩張 |

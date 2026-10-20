# 時間軸（Timeline）

**適合：** 事件發生在什麼時間點、彼此隔多久：事故經過、版本發佈史、專案里程碑、路線圖。讀者要看的是「先後」和「間隔」。

**不適合：** 事件之間有分支或條件（用 `flowchart.md`）；重點是誰在什麼時候對誰發訊息（用 `sequence.md`）；有起訖時間、互相重疊的多項工作（那是甘特圖，用 `gantt.md`）；只有兩三個日期（一句話說完）。

## 版面

- 一條水平主軸橫過圖的中段，`dg-axis`。主軸兩端各留 48 以上，第一個和最後一個事件的標籤才不會被切掉。
- **刻度**：在固定間隔（每 5 分鐘、每月、每季）畫一小段往下 6 的垂直 `dg-axis`，刻度文字放在主軸下方 20，`dg-small`，水平置中。刻度文字越短越好（`5`、`10`、`Q3`），單位只寫一次，放在主軸右端外側 8（範例的「分」）；不要讓讀者猜單位，也不要每個刻度都重複單位、把刻度撐寬。
- **事件**：主軸上的點，`dg-dot` 半徑 4；主要里程碑用 `dg-dot--accent` 半徑 6。點畫在主軸之後，蓋住主軸。
- **事件標籤上下交錯**：相鄰的事件一個放主軸上方、一個放下方，用一條 `dg-rule` 垂直細線從點連到標籤。標籤是名稱（`dg-label`）＋一行說明（`dg-sub`），以事件的 x 為中心水平置中。
- 下方的標籤要比刻度文字再低一層（下緣離主軸 48 以上），引線不能穿過刻度文字；排版時先確認每條往下的引線和最近的刻度至少隔 16。
- 一段持續的狀態（影響期間、凍結期、beta 期）用 `dg-band` 畫一條帶子，放在所有標籤下方，跟主軸同一個比例尺；帶子裡的文字用 `dg-small`。
- accent 給 1–2 個轉折點：例如「回滾」和「恢復」，不是每個事件都標。

## 比例尺要誠實

- **x 座標跟時間成正比。** 先定比例（範例：1 分鐘 = 17），事件的 x = 起點 + 時間 × 比例，算出來是多少就畫在那裡，不要為了好看平均分配。間隔不均本身就是資訊：讀者會看到「定位花了 5 分鐘，回滾後又等了 9 分鐘才恢復」。
- 中間有一大段什麼都沒發生時，可以把主軸斷開：不要畫慣用的兩條短斜線（規則 1 禁斜線），改成主軸留 16 的空隙，空隙下方加 `dg-small` 註明「略過 2 週」。空隙兩側各自維持同一個比例尺。
- 事件數超過 8 個，或兩個事件靠太近（x 差小於 48）上下交錯也放不下時，拆成兩張圖或合併成一個事件。

## 逐步播放

時間軸可以逐步播放：每個事件一步，`data-step` 標在事件的 `<g>` 上（點＋引線＋標籤一組）。主軸、刻度、帶狀區段不標，一直顯示。只有讀者需要「跟著時間走一遍」時才加，純粹的版本列表不需要。

## 範例

````markdown
```diagram
title: 一次上版事故的處理經過
desc: 錯誤率告警後 3 分鐘值班確認、8 分鐘找到原因、12 分鐘回滾，21 分鐘時錯誤率回到基線。
caption: 通用示意，時間以告警觸發為 T+0。
step: T+0 錯誤率超過門檻，告警觸發
step: T+3 分 值班工程師確認，開事故頻道
step: T+8 分 找到原因：上一版的設定錯誤
step: T+12 分 回滾到上一版
step: T+21 分 錯誤率回到基線
---
<svg viewBox="0 0 640 276">
  <path class="dg-axis" d="M40 124H600"/>
  <path class="dg-axis" d="M64 124V130M149 124V130M234 124V130M319 124V130M404 124V130M489 124V130M574 124V130"/>
  <text class="dg-small" x="64" y="144" text-anchor="middle" dominant-baseline="central">0</text>
  <text class="dg-small" x="149" y="144" text-anchor="middle" dominant-baseline="central">5</text>
  <text class="dg-small" x="234" y="144" text-anchor="middle" dominant-baseline="central">10</text>
  <text class="dg-small" x="319" y="144" text-anchor="middle" dominant-baseline="central">15</text>
  <text class="dg-small" x="404" y="144" text-anchor="middle" dominant-baseline="central">20</text>
  <text class="dg-small" x="489" y="144" text-anchor="middle" dominant-baseline="central">25</text>
  <text class="dg-small" x="574" y="144" text-anchor="middle" dominant-baseline="central">30</text>
  <text class="dg-small" x="608" y="124" dominant-baseline="central">分</text>

  <rect class="dg-band dg-band--warn" x="64" y="236" width="357" height="24"/>
  <text class="dg-small dg-text--warn" x="242" y="248" text-anchor="middle" dominant-baseline="central">使用者受影響 21 分鐘</text>

  <g data-step="1">
    <line class="dg-rule" x1="64" y1="76" x2="64" y2="118"/>
    <circle class="dg-dot" cx="64" cy="124" r="4"/>
    <text class="dg-label" x="64" y="40" text-anchor="middle" dominant-baseline="central">告警觸發</text>
    <text class="dg-sub" x="64" y="62" text-anchor="middle" dominant-baseline="central">錯誤率 &gt; 5%</text>
  </g>
  <g data-step="2">
    <line class="dg-rule" x1="115" y1="130" x2="115" y2="172"/>
    <circle class="dg-dot" cx="115" cy="124" r="4"/>
    <text class="dg-label" x="115" y="186" text-anchor="middle" dominant-baseline="central">值班確認</text>
    <text class="dg-sub" x="115" y="208" text-anchor="middle" dominant-baseline="central">開事故頻道</text>
  </g>
  <g data-step="3">
    <line class="dg-rule" x1="200" y1="76" x2="200" y2="118"/>
    <circle class="dg-dot" cx="200" cy="124" r="4"/>
    <text class="dg-label" x="200" y="40" text-anchor="middle" dominant-baseline="central">找到原因</text>
    <text class="dg-sub" x="200" y="62" text-anchor="middle" dominant-baseline="central">上一版設定錯</text>
  </g>
  <g data-step="4">
    <line class="dg-rule" x1="268" y1="130" x2="268" y2="172"/>
    <circle class="dg-dot dg-dot--accent" cx="268" cy="124" r="6"/>
    <text class="dg-label" x="268" y="186" text-anchor="middle" dominant-baseline="central">回滾</text>
    <text class="dg-sub" x="268" y="208" text-anchor="middle" dominant-baseline="central">回到上一版</text>
  </g>
  <g data-step="5">
    <line class="dg-rule" x1="421" y1="76" x2="421" y2="118"/>
    <circle class="dg-dot dg-dot--accent" cx="421" cy="124" r="6"/>
    <text class="dg-label" x="421" y="40" text-anchor="middle" dominant-baseline="central">指標恢復</text>
    <text class="dg-sub" x="421" y="62" text-anchor="middle" dominant-baseline="central">錯誤率回到基線</text>
  </g>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 間隔不同的事件畫成等距 | 比例尺說謊，讀者會誤判哪段拖最久 |
| 沒有刻度或單位 | 讀者不知道一格是一分鐘還是一個月 |
| 標籤全擠在主軸同一側 | 相鄰標籤疊在一起；上下交錯 |
| 往下的引線穿過刻度文字 | 刻度被切斷；把事件標籤再往下放一層或挪刻度 |
| 每個事件都標 accent | 看不出轉折點在哪 |
| 用斜線把標籤拉到遠處 | 違反只用直角線；標籤放在事件正上方或正下方 |
| 拿時間軸畫有起訖、互相重疊的工作 | 那是甘特圖（`gantt.md`），時間軸只放時間點和少數區段 |

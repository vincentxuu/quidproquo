# 狀態機（State Machine）

**適合：** 一個東西有固定幾種狀態、在什麼事件或條件下從一個狀態切到另一個——訂單狀態、登入狀態、連線生命週期、背景任務佇列、表單精靈。重點是「有哪些狀態」和「什麼觸發切換」。

**不適合：** 參與者之間按時間來回傳訊息，包括一次請求的來回（用 `sequence.md`）；一次性的判斷邏輯、走完就結束（用 `flowchart.md`）；狀態只有兩個、一句話講得完（寫一句話）。

## 版面

- 主要的那條成功路徑排成一列（左 → 右），讀者一眼看到「正常會怎麼走」。
- 主列下方放第二列：等待、重試、恢復這類**中斷狀態**；終止狀態（成功、失敗、取消）對齊在最右一欄。不要把中斷狀態塞進主列，主列只放前進的步驟。
- 狀態用 `<rect class="dg-box" rx="6">`，名稱用 `dg-label`；工程讀者會在程式裡看到的狀態值（`running`、`failed`）放副標，用 `dg-sub dg-mono`。
- 起點用實心點 `dg-dot`（r=6）。有明確結束時，終點用空心點 `dg-dot--hollow`（r=8）疊一個 `dg-dot`（r=5）；終止狀態本身已經是有名字的框時，可以省略終點符號。
- accent 給讀者該注意的那一個狀態（通常是主要的工作狀態或成功）；失敗狀態用 `dg-box--warn`。取消和失敗同時存在時要畫成兩個框，不要只用顏色區分。

## 轉換

- **每條轉換都要有標籤**，寫成「事件，條件」：`出錯，未達上限`。狀態機的重點就是「什麼觸發切換」，沒標籤的轉換等於沒畫。標籤 ≤ 8 個中文字，放不下就把條件移到正文。
- 只用直角線（`primitives.md` 規則 1）。回到前一個狀態的線走到主列下方或上方繞回，不要畫成曲線弧。
- 一個狀態往下分出兩條線時，照規則 4 把接點分開（例：寬 128 的框，接在 1/3 和 2/3 處）。
- 「任何狀態都可能逾時 → 失敗」這種全域轉換，不要從每個狀態各拉一條線；在 `caption` 或圖下方註記一句 `任一狀態逾時 → 失敗`。
- 轉換數超過狀態數 × 2，通常代表其實是兩個狀態機，拆開畫。
- 逐步播放可以選用：沿著一次任務的生命週期走（排隊 → 執行 → 成功，再補失敗和重試的路線）。

## 範例

````markdown
```diagram
title: 背景任務的生命週期
desc: 任務從排隊進入執行，完成就成功；出錯時若還沒達重試上限就進入等待重試、退避後回到排隊，用完次數則標記為失敗。
caption: 簡化示意：省略取消與執行逾時。
step: 任務建立後進入排隊
step: worker 領取後開始執行
step: 執行完成，任務成功
step: 出錯但還能重試：先等待退避，時間到再回到排隊
step: 出錯且重試次數用完：任務失敗
---
<svg viewBox="0 0 608 264">
  <path class="dg-line" d="M30 64H60" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M168 64H252" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--accent" d="M384 64H468" marker-end="url(#arrow-accent)" data-step="3"/>
  <path class="dg-line" d="M300 92V204Q300 212 292 212H172" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M116 184V96" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--warn" d="M340 92V204Q340 212 348 212H468" marker-end="url(#arrow-warn)" data-step="5"/>

  <circle class="dg-dot" cx="24" cy="64" r="6" data-step="1"/>

  <g data-step="1 4">
    <rect class="dg-box" x="64" y="36" width="104" height="56" rx="6"/>
    <text class="dg-label" x="116" y="55" text-anchor="middle" dominant-baseline="central">排隊</text>
    <text class="dg-sub dg-mono" x="116" y="75" text-anchor="middle" dominant-baseline="central">queued</text>
  </g>

  <g data-step="2">
    <rect class="dg-box dg-box--accent" x="256" y="36" width="128" height="56" rx="6"/>
    <text class="dg-label" x="320" y="55" text-anchor="middle" dominant-baseline="central">執行中</text>
    <text class="dg-sub dg-mono" x="320" y="75" text-anchor="middle" dominant-baseline="central">running</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="472" y="36" width="112" height="56" rx="6"/>
    <text class="dg-label" x="528" y="55" text-anchor="middle" dominant-baseline="central">成功</text>
    <text class="dg-sub dg-mono" x="528" y="75" text-anchor="middle" dominant-baseline="central">succeeded</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="64" y="184" width="104" height="56" rx="6"/>
    <text class="dg-label" x="116" y="203" text-anchor="middle" dominant-baseline="central">等待重試</text>
    <text class="dg-sub dg-mono" x="116" y="223" text-anchor="middle" dominant-baseline="central">retrying</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--warn" x="472" y="184" width="112" height="56" rx="6"/>
    <text class="dg-label" x="528" y="203" text-anchor="middle" dominant-baseline="central">失敗</text>
    <text class="dg-sub dg-mono" x="528" y="223" text-anchor="middle" dominant-baseline="central">failed</text>
  </g>

  <text class="dg-edge" x="210" y="50" text-anchor="middle" dominant-baseline="central" data-step="2">worker 領取</text>
  <text class="dg-edge" x="426" y="50" text-anchor="middle" dominant-baseline="central" data-step="3">完成</text>
  <text class="dg-edge" x="232" y="198" text-anchor="middle" dominant-baseline="central" data-step="4">出錯，未達上限</text>
  <text class="dg-edge" x="126" y="140" text-anchor="start" dominant-baseline="central" data-step="4">退避到期</text>
  <text class="dg-edge dg-text--warn" x="408" y="198" text-anchor="middle" dominant-baseline="central" data-step="5">出錯，次數用完</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 轉換沒有標籤 | 狀態機的重點就是「什麼觸發切換」 |
| 從每個狀態各拉一條「逾時 → 失敗」 | 線爆量；改成一句全域註記 |
| 等待、重試狀態放在主列上 | 讀者分不出哪條是正常前進、哪條是中斷 |
| 取消和失敗合成一個框、只靠顏色區分 | 兩種結局的處理方式不同，要分開畫 |
| 用狀態機畫兩個服務之間的請求來回 | 那是循序圖 |
| 轉換數超過狀態數 × 2 | 多半是兩個狀態機疊在一起，拆開 |
| 回頭線畫成大弧線 | 本站只用直角線；繞到主列外側走 |

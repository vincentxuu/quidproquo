# 流程圖（Flowchart）

**適合：** 有分支的判斷邏輯——演算法、錯誤處理、「要不要做 X？」的決策、客服分流、使用者導引路線。讀者要看的是「在哪個判斷點、因為什麼條件、走向哪裡」。

**不適合：** 沒有分支、一路直走的步驟（用編號清單，或架構圖加逐步播放）；參與者之間來回傳訊息（用 `sequence.md`）；一個東西在幾個狀態之間切換（用 `state.md`）；會繞回起點、每圈累積東西的循環（用 `loop.md`）。

## 版面

- 主流向由上往下。主路徑（讀者最常走、或最重要的那條）排成一直欄，岔出去的分支往右（或往左）放到第二欄。
- **形狀表達種類，不靠顏色：**
  - 動作／步驟：`<rect class="dg-box" rx="6">`
  - 判斷：菱形 `<path class="dg-box" d="M cx top L right cy L cx bottom L left cy Z"/>`，一個菱形最多 3 個出口
  - 起點：`dg-dot`（r=6），或極少數情況用 `dg-box--solid`
  - 分支會合點：小實心點 `dg-dot`（r=4），所有進來的線先接到點，再從點出去一條
- 菱形比矩形寬：至少 192×88，裡面放一行判斷（`dg-label`，以問號結尾）＋一行判斷依據（`dg-sub`）。菱形越往上下兩端越窄，文字只能放在中間那條帶狀，寬度要用「中心寬 ×（1 − 離中心距離 ÷ 半高）」估。
- 結果節點才上色：成功結果 `dg-box--accent`，錯誤結果 `dg-box--warn`。判斷和一般步驟維持 `dg-box`。
- accent 給 1–2 個：最常走的成功結果，或全圖最關鍵的那個判斷——不要每個判斷都上色。

## 分支與回頭線

- **每個判斷的每個出口都要有標籤**（是／否、命中／未命中）。同一張圖裡同一個方向盡量代表同一個答案；做不到時，標籤就是唯一依據，一定要寫。
- 兩個分支走到同一個結果時，從結果框的上緣和下緣（或同一邊照 `primitives.md` 規則 4 分開的接點）進入，不要兩條線疊成一條。
- 回頭線（重試、重新輸入、回到上一步）用 `dg-line dg-line--warn dg-line--dashed` 配 `#arrow-warn`，繞到主欄外側走，接回目標框的側邊，不要從主欄中間穿過。一張圖最多一條回頭線；兩條以上通常代表其實是狀態機。
- 逐步播放適合流程圖：每一步對應一個判斷點加上它的出口，讓讀者一次只追一個條件。

## 範例

````markdown
```diagram
title: API 請求失敗時要不要重試
desc: 請求失敗後先判斷錯誤能不能重試，再看重試次數是否用完；可以重試就退避等待後重送，否則回報錯誤。
caption: 簡化示意：實際要不要重試還要看請求是否冪等。
step: 送出請求
step: 回應成功就直接回傳結果
step: 失敗時先判斷這種錯誤能不能重試，不能就回報錯誤
step: 可以重試，再看次數是否已達上限，用完就回報錯誤
step: 還有次數就退避等待，再回到起點重送
---
<svg viewBox="0 0 640 504">
  <path class="dg-line" d="M280 34V56" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M280 108V140" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--accent" d="M376 188H428" marker-end="url(#arrow-accent)" data-step="2"/>
  <path class="dg-line" d="M280 232V264" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line dg-line--warn" d="M376 312H496Q504 312 504 320V344" marker-end="url(#arrow-warn)" data-step="3"/>
  <path class="dg-line" d="M280 356V388" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--warn" d="M376 436H496Q504 436 504 428V404" marker-end="url(#arrow-warn)" data-step="4"/>
  <path class="dg-line" d="M184 436H140" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M80 404V92Q80 84 88 84H212" marker-end="url(#arrow-warn)" data-step="5"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="216" y="60" width="128" height="48" rx="6"/>
    <text class="dg-label" x="280" y="84" text-anchor="middle" dominant-baseline="central">送出請求</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M280 144L376 188L280 232L184 188Z"/>
    <text class="dg-label" x="280" y="178" text-anchor="middle" dominant-baseline="central">回應成功？</text>
    <text class="dg-sub" x="280" y="200" text-anchor="middle" dominant-baseline="central">2xx</text>
  </g>

  <g data-step="2">
    <rect class="dg-box dg-box--accent" x="432" y="164" width="144" height="48" rx="6"/>
    <text class="dg-label" x="504" y="188" text-anchor="middle" dominant-baseline="central">回傳結果</text>
  </g>

  <g data-step="3">
    <path class="dg-box" d="M280 268L376 312L280 356L184 312Z"/>
    <text class="dg-label" x="280" y="302" text-anchor="middle" dominant-baseline="central">可以重試？</text>
    <text class="dg-sub" x="280" y="324" text-anchor="middle" dominant-baseline="central">429・5xx・逾時</text>
  </g>

  <g data-step="3 4">
    <rect class="dg-box dg-box--warn" x="432" y="348" width="144" height="52" rx="6"/>
    <text class="dg-label" x="504" y="374" text-anchor="middle" dominant-baseline="central">回報錯誤</text>
  </g>

  <g data-step="4">
    <path class="dg-box" d="M280 392L376 436L280 480L184 436Z"/>
    <text class="dg-label" x="280" y="426" text-anchor="middle" dominant-baseline="central">還有次數？</text>
    <text class="dg-sub" x="280" y="448" text-anchor="middle" dominant-baseline="central">未達上限</text>
  </g>

  <g data-step="5">
    <rect class="dg-box" x="24" y="408" width="112" height="56" rx="6"/>
    <text class="dg-label" x="80" y="425" text-anchor="middle" dominant-baseline="central">退避等待</text>
    <text class="dg-sub" x="80" y="448" text-anchor="middle" dominant-baseline="central">1s、2s、4s…</text>
  </g>

  <text class="dg-edge" x="402" y="176" text-anchor="middle" dominant-baseline="central" data-step="2">是</text>
  <text class="dg-edge" x="290" y="248" text-anchor="start" dominant-baseline="central" data-step="3">否</text>
  <text class="dg-edge dg-text--warn" x="436" y="300" text-anchor="middle" dominant-baseline="central" data-step="3">否</text>
  <text class="dg-edge" x="290" y="372" text-anchor="start" dominant-baseline="central" data-step="4">是</text>
  <text class="dg-edge dg-text--warn" x="436" y="424" text-anchor="middle" dominant-baseline="central" data-step="4">否</text>
  <text class="dg-edge" x="162" y="424" text-anchor="middle" dominant-baseline="central" data-step="5">是</text>
  <text class="dg-edge dg-text--warn" x="90" y="248" text-anchor="start" dominant-baseline="central" data-step="5">重送</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 用顏色區分「判斷」和「步驟」 | 形狀已經在做這件事；顏色留給結果和焦點 |
| 一個菱形有 4 個以上出口 | 拆成兩層判斷 |
| 分支沒有標籤 | 讀者只能猜哪條是「是」 |
| 每個判斷都標 accent | 看不出哪個判斷最關鍵 |
| 回頭線從主欄中間穿回去 | 和主路徑疊在一起，追不到；繞到外側 |
| 一路直走、沒有任何分支 | 那是步驟清單，不是流程圖 |
| 菱形塞兩三行字 | 菱形上下端很窄，字會壓到框線；判斷句縮成一行，細節放正文 |

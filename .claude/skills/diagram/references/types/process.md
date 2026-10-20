# 流程（Process）

**適合：** 多個角色依序接力的作業流程，而且讀者除了「誰做哪一步」，還要看到**每次交接傳過去的是什麼資料**、每一步用什麼工具。例如報帳簽核、資料清理管線的人工關卡、跨部門的上線檢核、客服工單轉給工程團隊。讀者要看的是：哪一份文件或資料在哪一步產生、交給了誰、在哪一關可能被退回。

**不適合：**

- 只在乎誰負責哪一步、在哪裡交接，交接的內容不重要（用 `swimlane.md`，比較簡單）。
- 參與者之間的請求與回應、一來一回的訊息（用 `sequence.md`）。
- 有好幾個判斷分支、每條路走向不同結果（用 `flowchart.md`）。
- 顧客看得到和看不到的工作怎麼對應（用 `service-blueprint.md`）。
- 只有一個角色在做事（用 `flowchart.md` 或編號清單）。
- 系統元件之間的資料怎麼流動、沒有人的角色（用 `architecture.md`）。

## 版面

- **角色是橫的泳道**，由上而下照第一次出場的順序排，最多 5 條；左側 84 寬放角色名稱（`dg-label`，`text-anchor="end"`），右邊一條垂直 `dg-rule` 隔開。泳道之間用橫的 `dg-rule` 分隔，不鋪帶狀底色（交接線上的標籤自帶底色描邊，壓在帶子上會露出方塊）。
- **步驟是欄**，左 → 右照時間先後，每欄 132；一步一欄，同一欄只放一個動作。
- 640 寬放 4 欄、4 條泳道剛好（泳道高 88）。步驟超過 4 個，改用 800 寬，或拆成兩張。
- **動作框**放在負責角色的泳道、該步驟的欄：`dg-box`，寬 108、高 56，名稱 `dg-label`（動詞開頭：「核對入帳」），第二行 `dg-sub` 寫用的工具或系統（「會計系統」）。
- **資料卡**是這個圖型和泳道圖不同的地方：每次交接傳過去的文件或資料畫成一張小卡，`dg-box dg-box--store`、`rx="2"`、高 32，`dg-sub` 寫資料名稱（「付款批次檔」）。資料卡放在**交出方的泳道、下一步的欄**，所以整張圖排成階梯：動作 →（橫）→ 資料卡 →（往下）→ 下一個動作。
- 資料卡的名稱用讀者認得的業務名詞（報帳單、核准紀錄），不要寫檔案格式或欄位清單；格式細節放正文。

## 連線

- 動作 → 資料卡：從動作框右側出發，水平進入資料卡左側。
- 資料卡 → 下一個動作：從資料卡下緣出發，垂直往下進入下一個動作框的上緣。兩段都很短、都是直線，不需要轉彎。
- 資料卡本身就是交接的標籤，這兩段線**不另外加標籤**。
- 退回（退件、補件）最多一條，用 `dg-line dg-line--dashed`，從退件那一步的左側出發、水平往左、轉一次彎往上，從原本那一步的下緣進入；標籤寫退回的原因，放在水平段上方 12。退回不是失敗，不用紅色。
- 角色之間來回超過一次，就改畫成泳道圖加正文說明，或拆圖。

## 逐步播放

流程的順序本身就是重點，適合逐步播放：每一步一個 `data-step`，把動作框、它送出的那段線和資料卡標在同一步，把「資料卡 → 下一個動作」那段線標在下一步。退回線標在退件那一步。泳道線和角色名稱不標，一直顯示。

## 焦點

accent 給 1 個：最關鍵的那一關（會退件的檢核點，或最常卡住的交接），`dg-box--accent`。資料卡一律 `dg-box--store`，不要挑一張資料卡標 accent。

## 範例

````markdown
```diagram
title: 員工報帳從提交到匯款
desc: 員工提交報帳單和收據，主管核准後把核准紀錄交給財務；財務核對入帳時對不上就退回員工補件，核對完成才產生付款批次檔交給出納匯款。
caption: 通用示意，各公司的簽核關卡與系統名稱不同。
step: 員工在報帳系統提交報帳單和收據
step: 主管在簽核 App 核准，產生核准紀錄
step: 財務在會計系統核對入帳，對不上就退件，核對完成產生付款批次檔
step: 出納依付款批次檔從網路銀行匯款
---
<svg viewBox="0 0 640 392">
  <line class="dg-rule" x1="16" y1="112" x2="624" y2="112"/>
  <line class="dg-rule" x1="16" y1="200" x2="624" y2="200"/>
  <line class="dg-rule" x1="16" y1="288" x2="624" y2="288"/>
  <line class="dg-rule" x1="84" y1="24" x2="84" y2="376"/>
  <text class="dg-label" x="72" y="68" text-anchor="end" dominant-baseline="central">員工</text>
  <text class="dg-label" x="72" y="156" text-anchor="end" dominant-baseline="central">主管</text>
  <text class="dg-label" x="72" y="244" text-anchor="end" dominant-baseline="central">財務</text>
  <text class="dg-label" x="72" y="332" text-anchor="end" dominant-baseline="central">出納</text>

  <path class="dg-line dg-line--dashed" data-step="3" d="M364 244H162Q154 244 154 236V100" marker-end="url(#arrow)"/>
  <path class="dg-line" data-step="1" d="M208 68H232" marker-end="url(#arrow)"/>
  <path class="dg-line" data-step="2" d="M286 84V124" marker-end="url(#arrow)"/>
  <path class="dg-line" data-step="2" d="M340 156H364" marker-end="url(#arrow)"/>
  <path class="dg-line" data-step="3" d="M418 172V212" marker-end="url(#arrow)"/>
  <path class="dg-line" data-step="3" d="M472 244H496" marker-end="url(#arrow)"/>
  <path class="dg-line" data-step="4" d="M550 260V300" marker-end="url(#arrow)"/>

  <g data-step="1">
    <rect class="dg-box" x="100" y="40" width="108" height="56" rx="6"/>
    <text class="dg-label" x="154" y="59" text-anchor="middle" dominant-baseline="central">提交報帳</text>
    <text class="dg-sub" x="154" y="79" text-anchor="middle" dominant-baseline="central">報帳系統</text>
  </g>
  <g data-step="1">
    <rect class="dg-box dg-box--store" x="236" y="52" width="100" height="32" rx="2"/>
    <text class="dg-sub" x="286" y="68" text-anchor="middle" dominant-baseline="central">報帳單＋收據</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="232" y="128" width="108" height="56" rx="6"/>
    <text class="dg-label" x="286" y="147" text-anchor="middle" dominant-baseline="central">主管核准</text>
    <text class="dg-sub" x="286" y="167" text-anchor="middle" dominant-baseline="central">簽核 App</text>
  </g>
  <g data-step="2">
    <rect class="dg-box dg-box--store" x="368" y="140" width="100" height="32" rx="2"/>
    <text class="dg-sub" x="418" y="156" text-anchor="middle" dominant-baseline="central">核准紀錄</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="364" y="216" width="108" height="56" rx="6"/>
    <text class="dg-label" x="418" y="235" text-anchor="middle" dominant-baseline="central">核對入帳</text>
    <text class="dg-sub" x="418" y="255" text-anchor="middle" dominant-baseline="central">會計系統</text>
  </g>
  <g data-step="3">
    <rect class="dg-box dg-box--store" x="500" y="228" width="100" height="32" rx="2"/>
    <text class="dg-sub" x="550" y="244" text-anchor="middle" dominant-baseline="central">付款批次檔</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="496" y="304" width="108" height="56" rx="6"/>
    <text class="dg-label" x="550" y="323" text-anchor="middle" dominant-baseline="central">匯款</text>
    <text class="dg-sub" x="550" y="343" text-anchor="middle" dominant-baseline="central">網路銀行</text>
  </g>

  <text class="dg-edge" data-step="3" x="258" y="232" text-anchor="middle" dominant-baseline="central">對不上就退件</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 沒有資料卡，只有動作和箭頭 | 那就是泳道圖；交接內容不重要時直接用 `swimlane.md` |
| 資料寫在線的標籤上 | 標籤擠在短線段旁，讀者分不出是動作還是資料；畫成資料卡 |
| 資料卡寫檔案格式或欄位清單 | 讀者要的是「交出去的是什麼」，格式細節放正文 |
| 同一欄放兩個角色的動作 | 讀者以為兩件事同時發生；真的同時才放同一欄 |
| 退回線超過一條，或用紅色 | 來回多次改用泳道圖加正文；退件不是失敗，用一般虛線 |
| 每一關都標 accent | 只標最關鍵的那一關 |
| 超過 5 條泳道或 6 個步驟 | 拆成總覽和其中一段的細節兩張 |

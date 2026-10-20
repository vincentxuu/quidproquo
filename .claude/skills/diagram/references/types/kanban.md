# 看板（Kanban）

**適合：** 某一刻的工作快照：各個狀態裡有多少項、上限是多少、哪一欄超載、哪張卡卡住。讀者要看的是「瓶頸在哪一欄」，例如審查欄堆了超過上限的卡，或有一張卡在等外部回覆。

**不適合：**

- 工作怎麼從一個人交到另一個人手上（用 `swimlane.md`；連交接的資料一起畫，用 `process.md`）。
- 一個東西有哪些狀態、什麼條件下切換（用 `state.md`；看板只數每個狀態裡有幾張卡，不畫切換條件）。
- 產品的完整故事和第一版範圍（用 `story-map.md`，欄是使用順序，不是狀態）。
- 要看每個狀態的數量隨時間怎麼變（累積流量圖之類的趨勢，用 `dataviz`）。
- 只有一兩欄、或每欄都沒有上限（一句話或表格說完）。

## 版面

- **一個狀態一欄**，左 → 右照工作流動的方向，最多 5 欄。640 寬放 4 欄，每欄 140、間距 16；欄底用 `dg-band`（`rx="6"`），欄與欄之間不畫框線。
- **欄頂**：狀態名稱 `dg-label` 靠左；右側一個 WIP 標籤，`dg-box`、`rx="2"`（方角，**不要做成膠囊**），裡面 `dg-sub` 寫「目前張數/上限」（`3/3`）。流程中間的欄一定要寫上限；最前面的待辦和最後的完成欄沒有上限，只寫張數。下方一條 `dg-rule` 隔開欄頂和卡片。
- **卡片**：`dg-box`，寬比欄窄 16（兩側各 8），高 52，卡距 10。標題 `dg-label`，第二行 `dg-sub` 寫編號（`dg-mono`）或狀況說明。
- **每欄最多 4 張卡**。超過就畫前兩三張，最後一格只寫一行 `dg-sub`「還有 6 張」，不畫框；完成欄也一樣，不要讓它無限長。
- **不畫任何連線。** 看板是狀態普查，不是流程；需要箭頭的那張圖是泳道圖或流程。

## 卡片狀態

每張卡只會是下面其中一種：

| 狀態 | class | 第二行 |
|---|---|---|
| 一般 | `dg-box` | 編號（`dg-sub dg-mono`） |
| 卡住 | `dg-box dg-box--warn` | 卡在哪裡（`dg-sub dg-text--warn`） |
| 等外部 | `dg-box dg-box--ghost` | 在等什麼 |
| 完成 | `dg-box dg-box--store` | 編號 |

## 超過上限的欄

張數大於上限時，那一欄的 WIP 標籤改成 `dg-box dg-box--warn`、文字加 `dg-text--warn`。超載的欄和卡住的卡都屬於風險，一律用 warn，不用 accent；全圖的 warn 只給這兩種東西，其他欄維持原樣，讀者才看得出瓶頸只有一處。看板通常不需要 accent，也不需要圖例：卡片第二行已經寫了它卡在哪或在等什麼。

## 複雜度上限

最多 5 欄、每欄 4 張、全圖 12 張卡（「還有 N 張」不算）。卡片之間沒有連線，所以不受 `primitives.md`「節點 9 個」的限制。

## 範例

````markdown
```diagram
title: 這週的開發看板
desc: 審查中有 4 張卡、超過上限 2 張，其中付款重試卡在安全審查；開發中剛好滿載，金流串接在等廠商金鑰。
caption: 通用示意，張數與上限為假設值。
---
<svg viewBox="0 0 640 340">
  <rect class="dg-band" x="16" y="20" width="140" height="304" rx="6"/>
  <rect class="dg-band" x="172" y="20" width="140" height="304" rx="6"/>
  <rect class="dg-band" x="328" y="20" width="140" height="304" rx="6"/>
  <rect class="dg-band" x="484" y="20" width="140" height="304" rx="6"/>
  <line class="dg-rule" x1="24" y1="60" x2="148" y2="60"/>
  <line class="dg-rule" x1="180" y1="60" x2="304" y2="60"/>
  <line class="dg-rule" x1="336" y1="60" x2="460" y2="60"/>
  <line class="dg-rule" x1="492" y1="60" x2="616" y2="60"/>

  <text class="dg-label" x="28" y="40" dominant-baseline="central">待辦</text>
  <rect class="dg-box" x="100" y="28" width="44" height="24" rx="2"/>
  <text class="dg-sub" x="122" y="40" text-anchor="middle" dominant-baseline="central">8</text>
  <rect class="dg-box" x="24" y="72" width="124" height="52" rx="6"/>
  <text class="dg-label" x="86" y="89" text-anchor="middle" dominant-baseline="central">匯出 CSV</text>
  <text class="dg-sub dg-mono" x="86" y="109" text-anchor="middle" dominant-baseline="central">#241</text>
  <rect class="dg-box" x="24" y="134" width="124" height="52" rx="6"/>
  <text class="dg-label" x="86" y="151" text-anchor="middle" dominant-baseline="central">批次刪除</text>
  <text class="dg-sub dg-mono" x="86" y="171" text-anchor="middle" dominant-baseline="central">#238</text>
  <text class="dg-sub" x="86" y="222" text-anchor="middle" dominant-baseline="central">還有 6 張</text>

  <text class="dg-label" x="184" y="40" dominant-baseline="central">開發中</text>
  <rect class="dg-box" x="256" y="28" width="44" height="24" rx="2"/>
  <text class="dg-sub" x="278" y="40" text-anchor="middle" dominant-baseline="central">3/3</text>
  <rect class="dg-box" x="180" y="72" width="124" height="52" rx="6"/>
  <text class="dg-label" x="242" y="89" text-anchor="middle" dominant-baseline="central">登入改版</text>
  <text class="dg-sub dg-mono" x="242" y="109" text-anchor="middle" dominant-baseline="central">#219</text>
  <rect class="dg-box" x="180" y="134" width="124" height="52" rx="6"/>
  <text class="dg-label" x="242" y="151" text-anchor="middle" dominant-baseline="central">通知設定</text>
  <text class="dg-sub dg-mono" x="242" y="171" text-anchor="middle" dominant-baseline="central">#226</text>
  <rect class="dg-box dg-box--ghost" x="180" y="196" width="124" height="52" rx="6"/>
  <text class="dg-label" x="242" y="213" text-anchor="middle" dominant-baseline="central">金流串接</text>
  <text class="dg-sub" x="242" y="233" text-anchor="middle" dominant-baseline="central">等廠商金鑰</text>

  <text class="dg-label" x="340" y="40" dominant-baseline="central">審查中</text>
  <rect class="dg-box dg-box--warn" x="412" y="28" width="44" height="24" rx="2"/>
  <text class="dg-sub dg-text--warn" x="434" y="40" text-anchor="middle" dominant-baseline="central">4/2</text>
  <rect class="dg-box" x="336" y="72" width="124" height="52" rx="6"/>
  <text class="dg-label" x="398" y="89" text-anchor="middle" dominant-baseline="central">搜尋分頁</text>
  <text class="dg-sub dg-mono" x="398" y="109" text-anchor="middle" dominant-baseline="central">#212</text>
  <rect class="dg-box" x="336" y="134" width="124" height="52" rx="6"/>
  <text class="dg-label" x="398" y="151" text-anchor="middle" dominant-baseline="central">API 限流</text>
  <text class="dg-sub dg-mono" x="398" y="171" text-anchor="middle" dominant-baseline="central">#215</text>
  <rect class="dg-box dg-box--warn" x="336" y="196" width="124" height="52" rx="6"/>
  <text class="dg-label" x="398" y="213" text-anchor="middle" dominant-baseline="central">付款重試</text>
  <text class="dg-sub dg-text--warn" x="398" y="233" text-anchor="middle" dominant-baseline="central">卡在安全審查</text>
  <rect class="dg-box" x="336" y="258" width="124" height="52" rx="6"/>
  <text class="dg-label" x="398" y="275" text-anchor="middle" dominant-baseline="central">匯出報表</text>
  <text class="dg-sub dg-mono" x="398" y="295" text-anchor="middle" dominant-baseline="central">#221</text>

  <text class="dg-label" x="496" y="40" dominant-baseline="central">完成</text>
  <rect class="dg-box" x="568" y="28" width="44" height="24" rx="2"/>
  <text class="dg-sub" x="590" y="40" text-anchor="middle" dominant-baseline="central">12</text>
  <rect class="dg-box dg-box--store" x="492" y="72" width="124" height="52" rx="6"/>
  <text class="dg-label" x="554" y="89" text-anchor="middle" dominant-baseline="central">深色模式</text>
  <text class="dg-sub dg-mono" x="554" y="109" text-anchor="middle" dominant-baseline="central">#203</text>
  <text class="dg-sub" x="554" y="160" text-anchor="middle" dominant-baseline="central">還有 11 張</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 卡片之間畫箭頭 | 看板是狀態普查；要看流動，改用泳道圖或流程 |
| 流程中間的欄沒有上限 | 上限是這張圖的一半意義，沒寫就看不出哪一欄超載 |
| 一欄超過 4 張卡 | 收成「還有 N 張」，不要讓欄撐到圖外 |
| 完成欄無限變長 | 變成第二個待辦清單；只留最近一兩張，其餘寫張數 |
| 每張卡住的卡都標紅 | 一兩張是訊號，一整欄紅色就是噪音 |
| 一個人一張卡 | 那是組織圖換了看板的外皮 |
| WIP 標籤做成膠囊形 | 讀起來像狀態徽章；用方角的 `rx="2"` |

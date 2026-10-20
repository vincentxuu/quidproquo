# 使用者旅程圖（Journey）

**適合：** 一個人走過一段體驗的幾個階段時，每一段在做什麼、在哪裡做、**感受如何**。例如新使用者的第一週、從看到廣告到第一次付款、申辦一項服務。讀者要看的是心情曲線在哪一段掉下去，以及掉下去的原因。

**不適合：**

- 說不出每一段的感受，或每段感受都差不多：那只是步驟，用 `flowchart.md`、時間軸 `timeline.md`，或編號清單。
- 重點是「顧客看得到的」和「後台在做的」怎麼對應（用 `service-blueprint.md`，它沒有心情曲線，有可見線）。
- 重點是好幾個角色之間誰把工作交給誰（用 `swimlane.md`；要連交接的資料一起畫，用 `process.md`）。
- 重點是事件發生的時間點和間隔（用 `timeline.md`；旅程的階段等寬，不按時間比例）。
- 系統內部流程、沒有人在裡面（沒有人就沒有感受，用架構圖或流程圖）。

## 版面

- **一張圖一個人物。** 兩條心情曲線疊在一起，兩條都讀不出來；兩種人物就畫兩張。
- **階段是等寬的欄**，左 → 右照體驗順序，最多 6 欄（640 寬放 5 欄，每欄 112）。階段名稱放在欄頂，`dg-label` 置中，下方一條 `dg-rule` 隔開。
- 左側留 64 寬的欄位放列名與心情等級，文字 `dg-sub`、`text-anchor="end"`，**一律水平書寫**，不要直排。
- 由上而下三塊：
  1. **心情帶**（這張圖的重點）：120 高左右，畫 3 條 `dg-grid` 參考線標出「滿意／普通／挫折」。心情只分 5 個有名字的等級（滿意、偏好、普通、偏差、挫折）；只有這三條參考線寫標籤，「偏好」「偏差」落在兩條線正中間，不另外畫線。**不要用 0–100 的分數**，感受是序位，不是連續量。
  2. **行動列**：這一段使用者做了什麼，一行 `dg-sub`，在欄內置中。
  3. **接觸點列**：發生在哪個介面（App、Email、客服電話…），`dg-sub`。可以再加一列（負責單位或指標），最多 3 列內容。
- 各列之間用橫跨全寬的 `dg-rule` 分隔。

## 心情曲線

- 每個階段一個點：`<circle class="dg-point dg-c-muted" r="5">`，x 是欄的中心，y 是那個等級的參考線。
- 點和點之間用 `dg-plot-line` 直線連起來。**心情曲線是資料線，不是連線**，連線規則 1（只准直角）不適用；但只有這條曲線可以斜，圖裡其他線照常走直角（旅程圖通常沒有其他線）。
- **低谷那一點和進入它的那一段**用 `dg-c-accent`，其他都是 `dg-c-muted`。先畫灰色的線，再畫綠色那段，最後畫點。
- 不要用表情符號當點：不同平台長得不一樣，縮小後也讀不出來。

## 痛點標記

- 在低谷那一欄的行動下方放一個小標籤：`dg-box dg-box--warn`（`rx="2"`，高 24），裡面 `dg-sub dg-text--warn` 寫出卡住的原因（≤ 6 個中文字）。
- 最多 2 個，而且只放在低谷。每一欄都貼痛點，就沒有一個是重點。

## 焦點

accent 只給低谷（點＋進入它的那一段，算一個）。痛點用 warn，不另外占 accent。不需要圖例：低谷靠位置和顏色就看得出來，痛點標籤自己寫了原因。

## 範例

````markdown
```diagram
title: 新使用者用記帳 App 的第一週
desc: 下載和註冊都還順利，匯入銀行資料時因為格式不支援、只能手動輸入而跌到谷底，設定預算後回升，看到第一份月報時最滿意。
caption: 通用示意，心情等級為假設的訪談結果。
---
<svg viewBox="0 0 640 336">
  <line class="dg-rule" x1="16" y1="60" x2="632" y2="60"/>
  <line class="dg-grid" x1="72" y1="88" x2="632" y2="88"/>
  <line class="dg-grid" x1="72" y1="136" x2="632" y2="136"/>
  <line class="dg-grid" x1="72" y1="184" x2="632" y2="184"/>
  <line class="dg-rule" x1="16" y1="208" x2="632" y2="208"/>
  <line class="dg-rule" x1="16" y1="280" x2="632" y2="280"/>

  <text class="dg-label" x="128" y="40" text-anchor="middle" dominant-baseline="central">下載</text>
  <text class="dg-label" x="240" y="40" text-anchor="middle" dominant-baseline="central">註冊</text>
  <text class="dg-label" x="352" y="40" text-anchor="middle" dominant-baseline="central">匯入資料</text>
  <text class="dg-label" x="464" y="40" text-anchor="middle" dominant-baseline="central">設定預算</text>
  <text class="dg-label" x="576" y="40" text-anchor="middle" dominant-baseline="central">看月報</text>

  <text class="dg-sub" x="56" y="88" text-anchor="end" dominant-baseline="central">滿意</text>
  <text class="dg-sub" x="56" y="136" text-anchor="end" dominant-baseline="central">普通</text>
  <text class="dg-sub" x="56" y="184" text-anchor="end" dominant-baseline="central">挫折</text>

  <polyline class="dg-plot-line dg-c-muted" points="128,112 240,136"/>
  <polyline class="dg-plot-line dg-c-muted" points="352,184 464,136 576,88"/>
  <polyline class="dg-plot-line dg-c-accent" points="240,136 352,184"/>
  <circle class="dg-point dg-c-muted" cx="128" cy="112" r="5"/>
  <circle class="dg-point dg-c-muted" cx="240" cy="136" r="5"/>
  <circle class="dg-point dg-c-accent" cx="352" cy="184" r="6"/>
  <circle class="dg-point dg-c-muted" cx="464" cy="136" r="5"/>
  <circle class="dg-point dg-c-muted" cx="576" cy="88" r="5"/>

  <text class="dg-sub" x="56" y="228" text-anchor="end" dominant-baseline="central">行動</text>
  <text class="dg-sub" x="128" y="228" text-anchor="middle" dominant-baseline="central">看評價後安裝</text>
  <text class="dg-sub" x="240" y="228" text-anchor="middle" dominant-baseline="central">用信箱註冊</text>
  <text class="dg-sub" x="352" y="228" text-anchor="middle" dominant-baseline="central">上傳銀行對帳單</text>
  <text class="dg-sub" x="464" y="228" text-anchor="middle" dominant-baseline="central">設每月上限</text>
  <text class="dg-sub" x="576" y="228" text-anchor="middle" dominant-baseline="central">點開月報推播</text>

  <rect class="dg-box dg-box--warn" x="300" y="244" width="104" height="24" rx="2"/>
  <text class="dg-sub dg-text--warn" x="352" y="256" text-anchor="middle" dominant-baseline="central">只能手動輸入</text>

  <text class="dg-sub" x="56" y="308" text-anchor="end" dominant-baseline="central">接觸點</text>
  <text class="dg-sub" x="128" y="308" text-anchor="middle" dominant-baseline="central">App 商店</text>
  <text class="dg-sub" x="240" y="308" text-anchor="middle" dominant-baseline="central">註冊頁</text>
  <text class="dg-sub" x="352" y="308" text-anchor="middle" dominant-baseline="central">匯入精靈</text>
  <text class="dg-sub" x="464" y="308" text-anchor="middle" dominant-baseline="central">預算設定頁</text>
  <text class="dg-sub" x="576" y="308" text-anchor="middle" dominant-baseline="central">推播通知</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 沒有心情曲線 | 只剩步驟和接觸點，那是流程，改用流程圖或時間軸 |
| 心情軸用 0–100 分數 | 感受是序位，畫成分數會讓人以為有量測數據 |
| 用表情符號當心情點 | 跨平台長相不一，縮小後讀不出來 |
| 一張圖兩個人物、兩條曲線 | 兩條都讀不出來；一個人物一張 |
| 每一欄都貼痛點 | 沒有一個是重點；痛點只放在低谷，最多 2 個 |
| 列名直排在左側 | 讀不了；一律水平寫在左側欄位 |
| 超過 6 個階段 | 拆成兩段旅程（例如「開始使用」和「持續使用」） |
| 畫系統內部流程 | 沒有人就沒有感受；用架構圖或流程圖 |

# 服務藍圖（Service Blueprint）

**適合：** 一項服務在幾個階段裡，顧客做了什麼、看得到什麼、看不到的後台又在做什麼。重點是**可見線**：線上方是顧客和前台，線下方是後台和支援系統，全部對齊在同一組階段欄上。適合講「顧客只看到『處理中』，其實是卡在後台的人工驗貨排隊」這類問題：讀者要看的是某個階段，顧客那一格看起來很簡單，同一欄的後台卻在排隊、等人或出錯。

**不適合：**

- 只有一個人的感受變化，沒有前後台之分（用 `journey.md`，它有心情曲線；藍圖沒有）。
- 重點是工作從誰交到誰手上、箭頭本身就是論點（用 `swimlane.md`）；交接時傳的資料也要畫出來（用 `process.md`）。
- 一個東西有幾種狀態、什麼條件下切換（用 `state.md`）。
- 現在有哪些工作卡在哪個狀態（用 `kanban.md`，它的欄是狀態，不是敘事階段）。
- 層與層是抽象依賴、沒有階段欄（用 `layers.md`）。

## 版面

- **階段是欄，層是列。** 階段左 → 右照服務順序，4–6 欄；640 寬放 4 欄，每欄 132（格子寬 120、間距 12）。階段名稱放在最上方，`dg-label` 置中。
- 左側留 96 寬放層名，`dg-sub`、`text-anchor="end"`、水平書寫。
- 由上而下的層：
  1. 實體證據（選配）：顧客實際拿到、看到的東西（收據、包裹、Email）
  2. **顧客行為**（必要）
  3. 互動線：細的 `dg-rule`
  4. **前台**（必要）：顧客看得到的人或介面
  5. **可見線**：`dg-line dg-line--strong`，全圖最重的一條橫線，左側用 `dg-label` 寫「可見線」（比層名重一級）
  6. **後台**（必要）：顧客看不到的人或系統動作
  7. 內部互動線：細的 `dg-rule`
  8. 支援系統（選配）：後台依賴的系統或外部服務
- **一格一個動作**，在欄內置中，一行字；需要的話第二行用 `dg-sub` 寫系統名或等待時間。必要層的格子不能空著：那一欄真的沒事，就畫格子並寫「—」。
- 顧客和前台用 `dg-box`；後台和支援用 `dg-box--store`，灰底讓線下方一眼讀成「看不到的工作」。
- **不畫箭頭。** 階段的左右順序就是時間順序，等待時間寫在格子裡；要畫箭頭表達交接，那張圖是泳道圖。

## 焦點

accent 最多一格：這張圖要讓讀者看見的那個等待、失敗或交接，通常在可見線上或下方，用 `dg-box--accent`。其他格子都是普查，不加強調。不需要圖例：層名和可見線的標籤已經說明了樣式。

## 範例

````markdown
```diagram
title: 網購退貨：顧客看不到的那一段
desc: 顧客只在前台看到「處理中」，同一個階段的後台其實是包裹在倉庫排隊等人工驗貨，驗完財務才會送出退刷。
caption: 通用示意，省略實體證據層；排隊天數為假設值。
---
<svg viewBox="0 0 640 348">
  <line class="dg-rule" x1="96" y1="120" x2="624" y2="120"/>
  <line class="dg-rule" x1="96" y1="280" x2="624" y2="280"/>
  <line class="dg-line dg-line--strong" x1="96" y1="200" x2="624" y2="200"/>

  <text class="dg-label" x="164" y="36" text-anchor="middle" dominant-baseline="central">申請退貨</text>
  <text class="dg-label" x="296" y="36" text-anchor="middle" dominant-baseline="central">寄回商品</text>
  <text class="dg-label" x="428" y="36" text-anchor="middle" dominant-baseline="central">等待處理</text>
  <text class="dg-label" x="560" y="36" text-anchor="middle" dominant-baseline="central">收到退款</text>

  <text class="dg-sub" x="88" y="84" text-anchor="end" dominant-baseline="central">顧客</text>
  <text class="dg-sub" x="88" y="156" text-anchor="end" dominant-baseline="central">前台</text>
  <text class="dg-label" x="88" y="200" text-anchor="end" dominant-baseline="central">可見線</text>
  <text class="dg-sub" x="88" y="244" text-anchor="end" dominant-baseline="central">後台</text>
  <text class="dg-sub" x="88" y="312" text-anchor="end" dominant-baseline="central">支援系統</text>

  <rect class="dg-box" x="104" y="60" width="120" height="48" rx="6"/>
  <text class="dg-label" x="164" y="84" text-anchor="middle" dominant-baseline="central">填退貨表單</text>
  <rect class="dg-box" x="236" y="60" width="120" height="48" rx="6"/>
  <text class="dg-label" x="296" y="84" text-anchor="middle" dominant-baseline="central">到超商寄件</text>
  <rect class="dg-box" x="368" y="60" width="120" height="48" rx="6"/>
  <text class="dg-label" x="428" y="84" text-anchor="middle" dominant-baseline="central">查詢進度</text>
  <rect class="dg-box" x="500" y="60" width="120" height="48" rx="6"/>
  <text class="dg-label" x="560" y="84" text-anchor="middle" dominant-baseline="central">確認入帳</text>

  <rect class="dg-box" x="104" y="132" width="120" height="48" rx="6"/>
  <text class="dg-label" x="164" y="156" text-anchor="middle" dominant-baseline="central">顯示寄件碼</text>
  <rect class="dg-box" x="236" y="132" width="120" height="48" rx="6"/>
  <text class="dg-label" x="296" y="156" text-anchor="middle" dominant-baseline="central">店員收件</text>
  <rect class="dg-box" x="368" y="132" width="120" height="48" rx="6"/>
  <text class="dg-label" x="428" y="156" text-anchor="middle" dominant-baseline="central">顯示處理中</text>
  <rect class="dg-box" x="500" y="132" width="120" height="48" rx="6"/>
  <text class="dg-label" x="560" y="156" text-anchor="middle" dominant-baseline="central">寄退款通知</text>

  <rect class="dg-box dg-box--store" x="104" y="220" width="120" height="48" rx="6"/>
  <text class="dg-label" x="164" y="244" text-anchor="middle" dominant-baseline="central">建立退貨單</text>
  <rect class="dg-box dg-box--store" x="236" y="220" width="120" height="48" rx="6"/>
  <text class="dg-label" x="296" y="244" text-anchor="middle" dominant-baseline="central">物流送回倉庫</text>
  <rect class="dg-box dg-box--accent" x="368" y="220" width="120" height="48" rx="6"/>
  <text class="dg-label" x="428" y="235" text-anchor="middle" dominant-baseline="central">人工驗貨</text>
  <text class="dg-sub" x="428" y="255" text-anchor="middle" dominant-baseline="central">排隊 3–5 天</text>
  <rect class="dg-box dg-box--store" x="500" y="220" width="120" height="48" rx="6"/>
  <text class="dg-label" x="560" y="244" text-anchor="middle" dominant-baseline="central">財務送出退刷</text>

  <rect class="dg-box dg-box--store" x="104" y="292" width="120" height="40" rx="6"/>
  <text class="dg-sub" x="164" y="312" text-anchor="middle" dominant-baseline="central">訂單系統</text>
  <rect class="dg-box dg-box--store" x="236" y="292" width="120" height="40" rx="6"/>
  <text class="dg-sub" x="296" y="312" text-anchor="middle" dominant-baseline="central">物流 API</text>
  <rect class="dg-box dg-box--store" x="368" y="292" width="120" height="40" rx="6"/>
  <text class="dg-sub" x="428" y="312" text-anchor="middle" dominant-baseline="central">倉儲系統</text>
  <rect class="dg-box dg-box--store" x="500" y="292" width="120" height="40" rx="6"/>
  <text class="dg-sub" x="560" y="312" text-anchor="middle" dominant-baseline="central">金流服務</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 沒有可見線，或畫在錯的位置 | 少了這條線就只是一張分列的表格；它一定在前台和後台之間 |
| 可見線和其他分隔線一樣細 | 讀者找不到全圖最重要的那條線 |
| 加上心情曲線 | 那是旅程圖，拆成兩張 |
| 箭頭穿過各層 | 那是泳道圖；藍圖靠欄的左右順序表達先後 |
| 每個出問題的格子都標 accent | 焦點只給一格，其餘是普查 |
| 必要層留空格 | 讀者分不出是「沒事」還是「忘了畫」；沒事就寫「—」 |
| 層名直排在左側 | 讀不了；一律水平寫在左側欄位 |
| 超過 6 個階段，或格子裡超過兩行字 | 拆圖，或把細節移到正文 |

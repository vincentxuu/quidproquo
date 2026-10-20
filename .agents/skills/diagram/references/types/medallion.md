# 分級資料層（Medallion）

**適合：** 同一份資料分成幾個「品質等級」存放，讀者要一眼看出每一層**放什麼、品質到哪、誰能讀、資料怎麼升級到下一層**。最常見的是 bronze／silver／gold 三層（原始 → 清理 → 彙總），這套命名因 Databricks 推廣而普及，但概念不綁特定產品；有些團隊會多一層去識別化或冷封存。

**不適合：**

- 一般部落格文章很少需要這種圖。只是要說「資料先存原始、再清理、再彙總」，一句話或三列表格就夠了；只有文章真的在講**每一層的存取政策或品質承諾**時才畫。
- 層與層是抽象層級、上層呼叫下層（技術堆疊、協定分層）→ 分層圖（`layers.md`）。分級資料層是**左右並排的同一份資料的不同版本**，不是上下依賴。
- 重點是資料經過哪些轉換步驟、在哪裡分岔或合併 → 資料流圖（`data-flow.md`）或流程圖（`flowchart.md`）。分級資料層只畫「層」，不畫每個轉換工作。
- 重點是平台由哪些元件組成、對外接了誰 → 資料平台整合圖（`dp-integration.md`）或架構圖（`architecture.md`）。
- 要列出每個角色在每一層能做什麼 → 權限矩陣（`dp-security-matrix.md`）。

## 版面

- **每一層是一張直立的卡片，由左到右排**，品質越往右越高。3–4 層最好讀，最多 5 層（640 寬放 3 層，4–5 層用 800 寬）。卡片同寬同高、頂端對齊，間距一致。
- 卡片內由上到下固定順序，每張卡片同一個欄位落在同一個 y：
  1. `dg-tag` 慣用名稱（`BRONZE`、`SILVER`、`GOLD`），距上緣 24。
  2. `dg-heading` 中文層名（原始層、清理層、彙總層）。
  3. `dg-sub` 一句話說這層的用途。
  4. 一條 `dg-rule` 分隔線。
  5. 2–4 個欄位，每個欄位是 `dg-tag` 欄名＋下一行 `dg-sub` 欄值。常用欄位：品質、誰能讀、誰寫入、格式、保留多久、例子。**每張卡片的欄位名稱和順序要一樣**，讀者才能橫著比。
- **一定要有「例子」欄**：寫同一筆資料在這一層長什麼樣（「每晚匯入的訂單 CSV」→「一筆訂單一列」→「各區每日營收」）。沒有例子，圖就只剩抽象名詞。
- 欄值超過一行就縮短，不要換行塞兩行；卡片寬 184 時欄值約 11 個中文字以內。
- 樣式：一般層用 `dg-box`；冷封存、只保留不查詢的層用 `dg-box dg-box--ghost`（虛線），**只有封存層可以用虛線**；焦點層用 `dg-box dg-box--accent`，它的 `dg-tag` 加 `dg-text--accent`。

## 升級連線

- 資料只往右升級，**一律從卡片上緣出、繞到上方、從下一張卡片上緣進**：先垂直往上、水平往右、再垂直往下，轉角半徑 8。卡片之間的縫太窄，放不下標籤，所以不走縫。
- 出發點和進入點分開：從卡片中心 +24 出發、在下一張卡片中心 −24 進入，兩條線才不會共用同一個接點（`primitives.md` 規則 4）。
- 水平段放在卡片上緣上方 32，標籤放在水平段上方、兩張卡片之間的中點，寫轉換動作（「清理、去重」「彙總」），4–6 個字。
- 進入焦點層的那條線用 `dg-line--accent`＋`#arrow-accent`，標籤加 `dg-text--accent`；進入封存層的線用 `dg-line--dashed`。
- 不畫回流箭頭。資料從 gold 寫回 bronze 這種流程不是分級資料層要講的事，改用資料流圖。

## 焦點

- accent 只給**一層**：下游真正查詢的那一層（通常是 gold），或正文在討論存取政策的那一層。加上進入它的那條線，全圖剛好兩個 accent。
- 不要用顏色區分 bronze／silver／gold（銅、銀、金色）：那是名稱的比喻，不是資訊；而且三種顏色會蓋掉唯一的焦點。

## 範例

````markdown
```diagram
title: 訂單資料的三層存放
desc: 訂單資料先原樣存進原始層，清理去重後進清理層，再依業務指標彙總成彙總層；越往右品質越高、能讀的人越多。
caption: 簡化示意：各層的欄位與存取對象依團隊而異。
---
<svg viewBox="0 0 640 348">
  <path class="dg-line" d="M136 72V48Q136 40 144 40H288Q296 40 296 48V68" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M344 72V48Q344 40 352 40H496Q504 40 504 48V68" marker-end="url(#arrow-accent)"/>

  <rect class="dg-box" x="20" y="72" width="184" height="256" rx="6"/>
  <text class="dg-tag" x="36" y="96" dominant-baseline="central">BRONZE</text>
  <text class="dg-heading" x="36" y="120" dominant-baseline="central">原始層</text>
  <text class="dg-sub" x="36" y="142" dominant-baseline="central">來源資料原樣落地</text>
  <line class="dg-rule" x1="36" y1="160" x2="188" y2="160"/>
  <text class="dg-tag" x="36" y="184" dominant-baseline="central">品質</text>
  <text class="dg-sub" x="36" y="204" dominant-baseline="central">含重複、格式不一</text>
  <text class="dg-tag" x="36" y="236" dominant-baseline="central">誰能讀</text>
  <text class="dg-sub" x="36" y="256" dominant-baseline="central">資料工程師</text>
  <text class="dg-tag" x="36" y="288" dominant-baseline="central">例子</text>
  <text class="dg-sub" x="36" y="308" dominant-baseline="central">每晚匯入的訂單 CSV</text>

  <rect class="dg-box" x="228" y="72" width="184" height="256" rx="6"/>
  <text class="dg-tag" x="244" y="96" dominant-baseline="central">SILVER</text>
  <text class="dg-heading" x="244" y="120" dominant-baseline="central">清理層</text>
  <text class="dg-sub" x="244" y="142" dominant-baseline="central">清理過、可互相關聯</text>
  <line class="dg-rule" x1="244" y1="160" x2="396" y2="160"/>
  <text class="dg-tag" x="244" y="184" dominant-baseline="central">品質</text>
  <text class="dg-sub" x="244" y="204" dominant-baseline="central">去重、型別一致</text>
  <text class="dg-tag" x="244" y="236" dominant-baseline="central">誰能讀</text>
  <text class="dg-sub" x="244" y="256" dominant-baseline="central">工程師、分析師</text>
  <text class="dg-tag" x="244" y="288" dominant-baseline="central">例子</text>
  <text class="dg-sub" x="244" y="308" dominant-baseline="central">一筆訂單一列</text>

  <rect class="dg-box dg-box--accent" x="436" y="72" width="184" height="256" rx="6"/>
  <text class="dg-tag dg-text--accent" x="452" y="96" dominant-baseline="central">GOLD</text>
  <text class="dg-heading" x="452" y="120" dominant-baseline="central">彙總層</text>
  <text class="dg-sub" x="452" y="142" dominant-baseline="central">依業務問題彙總</text>
  <line class="dg-rule" x1="452" y1="160" x2="604" y2="160"/>
  <text class="dg-tag" x="452" y="184" dominant-baseline="central">品質</text>
  <text class="dg-sub" x="452" y="204" dominant-baseline="central">指標定義固定</text>
  <text class="dg-tag" x="452" y="236" dominant-baseline="central">誰能讀</text>
  <text class="dg-sub" x="452" y="256" dominant-baseline="central">報表使用者</text>
  <text class="dg-tag" x="452" y="288" dominant-baseline="central">例子</text>
  <text class="dg-sub" x="452" y="308" dominant-baseline="central">各區每日營收</text>

  <text class="dg-edge" x="216" y="26" text-anchor="middle" dominant-baseline="central">清理、去重</text>
  <text class="dg-edge dg-text--accent" x="424" y="26" text-anchor="middle" dominant-baseline="central">彙總</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 用銅、銀、金三種顏色上色 | 名稱的比喻不是資訊，還會蓋掉唯一的焦點 |
| 兩層以上標 accent | 看不出哪一層才是下游真正查詢的地方 |
| 一般層用虛線框 | 虛線保留給封存層，讀者會以為這層不能查 |
| 升級線斜著連，或擠在卡片之間的縫裡 | 違反連線規則，標籤也放不下；一律從上方繞 |
| 畫回流箭頭（gold 寫回 bronze） | 分級資料層只講單向升級；有回流改用資料流圖 |
| 每張卡片欄位不同、順序不同 | 讀者沒辦法橫著比較各層 |
| 沒有「例子」欄 | 只剩「原始」「清理」「彙總」幾個抽象名詞，圖沒有比一句話多說什麼 |
| 卡片裡畫每個 ETL 工作 | 層的圖變成流程圖；轉換步驟另畫一張資料流圖 |

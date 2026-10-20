# ER 圖／資料模型（Entity-Relationship）

**適合：** 概念或邏輯層的資料模型：系統裡有哪些「東西」（實體）、每個東西有哪些重要欄位、彼此之間是一對一、一對多還是多對多。API 的資源關係、領域模型、還沒決定資料庫之前的討論，都用這種圖。重點是**實體和基數**。

**不適合：**

- 重點是實際的資料表、SQL 型別、約束、索引，或「刪掉一列時會發生什麼事」→ 資料庫 schema（`db-schema.md`）。判斷方式：在講「文章**是什麼**、跟誰有關」用 ER；在講「`comments.post_id` 是什麼型別、刪文章時留言怎麼辦」用 schema。
- 類別有方法、繼承、介面實作，重點是程式的物件結構 → UML class（`uml-class.md`）。沒有方法也沒有繼承的類別圖，其實就是 ER。
- 只是比較幾個資料模型方案的優缺點 → 比較矩陣（`matrix.md`）或表格。
- 實體超過 6 個、關聯線開始交錯 → 拆成幾張子領域的圖，或用 mermaid 的 `erDiagram` 畫總覽（所有節點同色）。
- 只有兩個實體、一條關聯 → 一句話（「一篇文章有多則留言」）。

## 版面

- **每個實體是一個兩段式的框：** 上段是實體名稱（`dg-label`，置中），下面一條 `dg-rule` 細線，下段一行一個欄位（`dg-sub`，靠左，離框左緣 12）。表頭高約 36，欄位行距 20。框高跟著欄位數走，不要為了整齊把每個框補到一樣高。
- **欄位只列講故事需要的：** 識別欄位加 `#` 前綴（`# 網址代稱`）。概念模型不列外鍵欄位，那條關聯線本身就是外鍵；邏輯模型要列的話，外鍵加 `→` 前綴（`→ 作者`）。每個實體最多 5 個欄位，其他的省略並在 `caption` 說明。
- **欄位名稱用讀者的語言：** 概念模型寫中文（標題、發佈時間）；邏輯模型要寫實際識別字時用 `dg-sub dg-mono`（`slug`、`published_at`）。同一張圖不要混用兩種。
- **把關聯最多的實體放中間**，其他實體圍著它排，讓大部分關聯線都是一條直線，不用轉彎。
- accent 給模型的核心實體（聚合根）一個，用 `dg-box--accent`。

## 關聯與基數

- **關聯線是框到框，不是欄位到欄位。** 線接在框邊的中段；欄位對欄位的接法是 schema 的特徵（見 `db-schema.md`）。
- **ER 的線不加箭頭。** 關聯沒有方向，方向由兩端的基數表達。
- **基數用文字標在兩端**：`1`、`N`、`0..1`、`1..N`，多對多寫 `N` 和 `M`。用 `dg-edge`，放在離框邊 8–12、離線 6–10 的位置；水平線的基數放在線上方，垂直線的放在線的右側。**同一條線的兩端用同一套寫法**，不要一端寫 `N`、另一端寫 `0..*`。
- 不用鳥爪符號（crow's foot）：鳥爪是三條斜的短線，本站沒有對應的 marker，硬畫會違反「只用直角線」，而且一般讀者讀 `1`／`N` 比讀鳥爪快。
- 關係動詞（撰寫、收到、分類）選填，放在線的另一側（基數在上就放下方），只在看框名猜不出關係時才標。
- 多對多在 ER 裡直接畫成一條 `N`—`M` 的線；中間表（`post_tags`）是實體化的細節，要畫中間表就是在畫 schema 了。

## 範例

````markdown
```diagram
title: 部落格的資料模型
desc: 文章是核心實體：一位作者寫多篇文章，一篇文章收到多則留言，文章和標籤是多對多。
caption: 概念模型：# 為識別欄位，外鍵由關聯線表示，省略其他欄位。
---
<svg viewBox="0 0 640 392">
  <path class="dg-line" d="M164 106H236"/>
  <path class="dg-line" d="M404 106H476"/>
  <path class="dg-line" d="M320 160V256"/>

  <rect class="dg-box" x="20" y="60" width="144" height="92" rx="6"/>
  <text class="dg-label" x="92" y="78" text-anchor="middle" dominant-baseline="central">作者</text>
  <line class="dg-rule" x1="20" y1="96" x2="164" y2="96"/>
  <text class="dg-sub" x="32" y="116" dominant-baseline="central"># 帳號</text>
  <text class="dg-sub" x="32" y="136" dominant-baseline="central">顯示名稱</text>

  <rect class="dg-box dg-box--accent" x="236" y="48" width="168" height="112" rx="6"/>
  <text class="dg-label" x="320" y="66" text-anchor="middle" dominant-baseline="central">文章</text>
  <line class="dg-rule" x1="236" y1="84" x2="404" y2="84"/>
  <text class="dg-sub" x="248" y="104" dominant-baseline="central"># 網址代稱</text>
  <text class="dg-sub" x="248" y="124" dominant-baseline="central">標題</text>
  <text class="dg-sub" x="248" y="144" dominant-baseline="central">發佈時間</text>

  <rect class="dg-box" x="476" y="60" width="144" height="92" rx="6"/>
  <text class="dg-label" x="548" y="78" text-anchor="middle" dominant-baseline="central">標籤</text>
  <line class="dg-rule" x1="476" y1="96" x2="620" y2="96"/>
  <text class="dg-sub" x="488" y="116" dominant-baseline="central"># 名稱</text>
  <text class="dg-sub" x="488" y="136" dominant-baseline="central">說明</text>

  <rect class="dg-box" x="236" y="256" width="168" height="112" rx="6"/>
  <text class="dg-label" x="320" y="274" text-anchor="middle" dominant-baseline="central">留言</text>
  <line class="dg-rule" x1="236" y1="292" x2="404" y2="292"/>
  <text class="dg-sub" x="248" y="312" dominant-baseline="central"># 編號</text>
  <text class="dg-sub" x="248" y="332" dominant-baseline="central">內容</text>
  <text class="dg-sub" x="248" y="352" dominant-baseline="central">留言時間</text>

  <text class="dg-edge" x="174" y="92" dominant-baseline="central">1</text>
  <text class="dg-edge" x="226" y="92" text-anchor="end" dominant-baseline="central">N</text>
  <text class="dg-edge" x="200" y="122" text-anchor="middle" dominant-baseline="central">撰寫</text>
  <text class="dg-edge" x="414" y="92" dominant-baseline="central">N</text>
  <text class="dg-edge" x="466" y="92" text-anchor="end" dominant-baseline="central">M</text>
  <text class="dg-edge" x="440" y="122" text-anchor="middle" dominant-baseline="central">分類</text>
  <text class="dg-edge" x="330" y="174" dominant-baseline="central">1</text>
  <text class="dg-edge" x="330" y="242" dominant-baseline="central">N</text>
  <text class="dg-edge" x="330" y="208" dominant-baseline="central">收到</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 每個外鍵都畫一條線、幾十個實體擠一張 | 變成一團線；依子領域拆圖 |
| 同一條關聯兩端用不同寫法（`1` 對 `0..*`） | 讀者要停下來換算；整張圖用同一套 |
| 線上加箭頭 | ER 的關聯沒有方向，箭頭會被讀成資料流或呼叫 |
| 把每個欄位都列出來 | 圖變成資料字典；只列講故事需要的，其他寫在 caption |
| 每個框補到一樣高 | 假的整齊，還浪費版面；框高跟著欄位數走 |
| 寫上 SQL 型別、索引、中間表 | 那是 schema 的層級；要講這些就改畫 `db-schema.md` |
| 實體名稱混用中文和資料表名（`文章` 和 `comments`） | 概念層和實體層混在一起，讀者分不清在看哪一層 |

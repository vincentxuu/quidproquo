# 資料庫 schema（Database Schema）

**適合：** 實體層的 schema：真的資料表、真的 SQL 型別、約束（PK、FK、UQ）、索引，以及**從一個欄位連到另一個欄位**的外鍵。把 DDL 畫成看得懂的樣子：寫 migration、審查一個真實的資料庫、或是重點在「欄位型別」「刪掉一列時會連帶發生什麼事」的時候。

**不適合：**

- 在討論「文章是什麼、跟誰有關」的領域模型 → ER 圖（`er.md`）。ER 的關聯線是框接框、標基數；schema 的外鍵是**欄位接欄位**、標參照動作。這是 schema 存在的理由，畫不出欄位對欄位的差別，就該用 ER。
- 只是列出一張表有哪些欄位、讀者會逐欄查型別 → Markdown 表格或直接貼 DDL，可以搜尋、複製。
- 比較幾種資料庫或幾種 schema 設計的取捨 → 比較矩陣（`matrix.md`）。
- 物件的方法與繼承 → UML class（`uml-class.md`）。
- 超過 5 張表或 6 條外鍵 → 只畫正文在講的那個子系統，`caption` 寫明省略了什麼；要總覽就用 mermaid 的 `erDiagram`。

## 版面

### 資料表框

- **表頭：** 表名用 `dg-label dg-mono`（`comments`），表頭高 32，下面一條 `dg-rule` 分隔。非預設 schema 寫成 `schema.table`。
- **欄位列：** 固定行高 24，外鍵才能準確接在某一列的中心。每列三段：
  - 欄位名 `dg-sub dg-mono`，靠左，離框左緣 12；
  - 約束小標（只標 `PK`、`FK`、`UQ`）：`dg-box` 小框 `rx="2"`，寬 28、高 16，裡面 `dg-tag`，所有表的小標對齊在同一個 x；
  - SQL 型別 `dg-small dg-mono`，靠右，離框右緣 12（`uuid`、`text`、`timestamptz`、`numeric(12,2)`）。
- **欄位太多：** 每張表最多畫 8 列，其餘寫成最後一行 `dg-sub`：「+ 6 個欄位」。不要默默截掉。
- **索引區（選填）：** 欄位下面再一條 `dg-rule`，左上 `dg-tag` 寫 `INDEXES`，下面一行一個索引名（`dg-sub dg-mono`）。只列跟正文有關的索引。
- 非預設 schema 的表用 `dg-zone` 框起來，左上角 `dg-tag` 寫 schema 名。
- 表與表之間的水平間距至少 160：外鍵要在中間轉彎，還要放得下標籤。
- 本型的約束小標用 `dg-tag`（11.5），所以 viewBox 寬度要 > 440；640 寬放三張表剛好。

### 外鍵：這個圖型的定義規則

- **從來源欄位那一列的垂直中心出發，接到被參照欄位那一列的垂直中心。** 用直角轉折（`primitives.md` 的寫法），箭頭指向被參照的表（子表 → 父表）。
- 兩條外鍵接在同一張表的**不同列**，固定行高 24 已經讓接點隔開；兩條外鍵接在**同一列**（例如兩張子表都參照同一個 `id`），就在那一列中心上下各偏 8，兩個接點仍在該列 24 的範圍內、彼此相隔 16。
- **每條外鍵都標參照動作**：`CASCADE`、`SET NULL`、`RESTRICT`，用 `dg-edge dg-mono`。標籤上限 14 個字元，所以只寫動作本身，`ON DELETE` 寫在 `caption`；如果同一張圖有 `ON UPDATE`，就改寫成 `DEL CASCADE`／`UPD CASCADE`，並在 caption 說明縮寫。

### 焦點

accent 的兩個名額：(1) 那條**會連帶刪除**的外鍵（`dg-line--accent` 加 `#arrow-accent`，它的標籤加 `dg-text--accent`，線加標籤算一個）；(2) 被連帶刪除的那張表，只把**表頭**換成 `dg-band--accent`，不是整個框。表頭底色畫在框之後、往內縮 1，四角用半徑 5 的弧，才不會蓋掉框線。

沒有破壞性外鍵的 schema 就不標 accent，不要隨便挑一張表升格。

## 範例

````markdown
```diagram
title: 留言表的兩條外鍵
desc: 刪除文章時，它的留言會一併刪除；刪除使用者時，留言保留，只把作者欄位設成 NULL。
caption: 連線標籤是 ON DELETE 的參照動作；省略其他資料表與欄位。
---
<svg viewBox="0 0 640 360">
  <path class="dg-line dg-line--accent" d="M404 168H320Q312 168 312 160V92Q312 84 304 84H240" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M404 192H344Q336 192 336 200V268Q336 276 328 276H240" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="20" y="40" width="216" height="128" rx="6"/>
  <text class="dg-label dg-mono" x="32" y="56" dominant-baseline="central">posts</text>
  <line class="dg-rule" x1="20" y1="72" x2="236" y2="72"/>
  <text class="dg-sub dg-mono" x="32" y="84" dominant-baseline="central">id</text>
  <rect class="dg-box" x="132" y="76" width="28" height="16" rx="2"/>
  <text class="dg-tag" x="146" y="84" text-anchor="middle" dominant-baseline="central">PK</text>
  <text class="dg-small dg-mono" x="224" y="84" text-anchor="end" dominant-baseline="central">uuid</text>
  <text class="dg-sub dg-mono" x="32" y="108" dominant-baseline="central">slug</text>
  <rect class="dg-box" x="132" y="100" width="28" height="16" rx="2"/>
  <text class="dg-tag" x="146" y="108" text-anchor="middle" dominant-baseline="central">UQ</text>
  <text class="dg-small dg-mono" x="224" y="108" text-anchor="end" dominant-baseline="central">text</text>
  <text class="dg-sub dg-mono" x="32" y="132" dominant-baseline="central">title</text>
  <text class="dg-small dg-mono" x="224" y="132" text-anchor="end" dominant-baseline="central">text</text>
  <text class="dg-sub dg-mono" x="32" y="156" dominant-baseline="central">published_at</text>
  <text class="dg-small dg-mono" x="224" y="156" text-anchor="end" dominant-baseline="central">timestamptz</text>

  <rect class="dg-box" x="20" y="232" width="216" height="104" rx="6"/>
  <text class="dg-label dg-mono" x="32" y="248" dominant-baseline="central">users</text>
  <line class="dg-rule" x1="20" y1="264" x2="236" y2="264"/>
  <text class="dg-sub dg-mono" x="32" y="276" dominant-baseline="central">id</text>
  <rect class="dg-box" x="132" y="268" width="28" height="16" rx="2"/>
  <text class="dg-tag" x="146" y="276" text-anchor="middle" dominant-baseline="central">PK</text>
  <text class="dg-small dg-mono" x="224" y="276" text-anchor="end" dominant-baseline="central">uuid</text>
  <text class="dg-sub dg-mono" x="32" y="300" dominant-baseline="central">name</text>
  <text class="dg-small dg-mono" x="224" y="300" text-anchor="end" dominant-baseline="central">text</text>
  <text class="dg-sub dg-mono" x="32" y="324" dominant-baseline="central">email</text>
  <rect class="dg-box" x="132" y="316" width="28" height="16" rx="2"/>
  <text class="dg-tag" x="146" y="324" text-anchor="middle" dominant-baseline="central">UQ</text>
  <text class="dg-small dg-mono" x="224" y="324" text-anchor="end" dominant-baseline="central">text</text>

  <rect class="dg-box" x="404" y="100" width="216" height="204" rx="6"/>
  <path class="dg-band dg-band--accent" d="M405 132V106A5 5 0 0 1 410 101H614A5 5 0 0 1 619 106V132Z"/>
  <text class="dg-label dg-mono dg-text--accent" x="416" y="116" dominant-baseline="central">comments</text>
  <line class="dg-rule" x1="404" y1="132" x2="620" y2="132"/>
  <text class="dg-sub dg-mono" x="416" y="144" dominant-baseline="central">id</text>
  <rect class="dg-box" x="508" y="136" width="28" height="16" rx="2"/>
  <text class="dg-tag" x="522" y="144" text-anchor="middle" dominant-baseline="central">PK</text>
  <text class="dg-small dg-mono" x="608" y="144" text-anchor="end" dominant-baseline="central">uuid</text>
  <text class="dg-sub dg-mono" x="416" y="168" dominant-baseline="central">post_id</text>
  <rect class="dg-box" x="508" y="160" width="28" height="16" rx="2"/>
  <text class="dg-tag" x="522" y="168" text-anchor="middle" dominant-baseline="central">FK</text>
  <text class="dg-small dg-mono" x="608" y="168" text-anchor="end" dominant-baseline="central">uuid</text>
  <text class="dg-sub dg-mono" x="416" y="192" dominant-baseline="central">author_id</text>
  <rect class="dg-box" x="508" y="184" width="28" height="16" rx="2"/>
  <text class="dg-tag" x="522" y="192" text-anchor="middle" dominant-baseline="central">FK</text>
  <text class="dg-small dg-mono" x="608" y="192" text-anchor="end" dominant-baseline="central">uuid</text>
  <text class="dg-sub dg-mono" x="416" y="216" dominant-baseline="central">body</text>
  <text class="dg-small dg-mono" x="608" y="216" text-anchor="end" dominant-baseline="central">text</text>
  <text class="dg-sub dg-mono" x="416" y="240" dominant-baseline="central">created_at</text>
  <text class="dg-small dg-mono" x="608" y="240" text-anchor="end" dominant-baseline="central">timestamptz</text>
  <line class="dg-rule" x1="404" y1="252" x2="620" y2="252"/>
  <text class="dg-tag" x="416" y="268" dominant-baseline="central">INDEXES</text>
  <text class="dg-sub dg-mono" x="416" y="288" dominant-baseline="central">idx_comments_post_id</text>

  <text class="dg-edge dg-mono dg-text--accent" x="272" y="72" text-anchor="middle" dominant-baseline="central">CASCADE</text>
  <text class="dg-edge dg-mono" x="284" y="264" text-anchor="middle" dominant-baseline="central">SET NULL</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 每張表每個欄位都畫 | 圖變成 `\d+` 的輸出；schema 圖是在講一個子系統，不是傾印整個資料庫 |
| 外鍵線接框、不接欄位 | 那是 ER；要嘛接到欄位列，要嘛改畫 `er.md` |
| 沒寫 SQL 型別 | 型別是這種圖一半的內容 |
| 外鍵沒標參照動作 | 審 schema 的人最想看的就是刪除時會發生什麼 |
| 每一列都掛 `NN`、`DEFAULT` 小標 | 小標變成噪音；只標 PK、FK、UQ 和正文在講的約束 |
| 索引區列出所有索引 | 只列跟正文有關的那一兩個 |
| 同一張圖混用概念名稱（文章）和資料表名（`posts`） | 讀者分不清在看哪一層 |
| 整張表塗成 accent | 焦點是「被連帶刪除」，只標表頭和那條外鍵 |

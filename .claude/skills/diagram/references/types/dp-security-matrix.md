# 資料平台權限矩陣（Data Platform Security Matrix）

**適合：** 一個資料平台裡，**每個角色對每個元件或資料層能做什麼**。列是元件（各資料層、排程、存取政策……），欄是角色（管理員、工程師、分析師、業務使用者……），格子是權限等級。讀者要能一眼看出「誰能碰原始資料」「業務使用者到底能看到哪裡」，也能用它對照實際設定做稽核。

**不適合：**

- 一般部落格文章很少需要這種圖。只有在文章真的在講某個平台的存取設計時才畫；兩三個角色、兩三條規則，用一句話或 Markdown 表格就說完了。
- 讀者會逐格查找、不會整體掃視，或格子裡要寫具體的權限名稱與條件（`SELECT` 加某個欄位遮罩、只限某個 IP）→ Markdown 表格。SVG 裡的字不能搜尋、複製。
- 比較的是幾個**選項**在幾個**面向**上的優劣（●◐○）→ 比較矩陣（`matrix.md`）。權限矩陣的格子是權限等級，不是好壞評價：「無」不是缺點，常常正是設計重點。
- 格子是連續的數量（存取次數、查詢量）→ 熱力圖（`heatmap.md`）。
- 重點是誰跟誰連、走什麼協定 → 資料平台整合圖（`dp-integration.md`）；重點是權限**怎麼申請、怎麼核准** → 流程圖或循序圖。矩陣只畫結果，不畫授權流程。

## 版面

- **列是元件、欄是角色。** 元件名稱放左側一欄（`dg-label`＋一行 `dg-sub` 說明），角色放上方一列（`dg-label` 置中＋一行 `dg-sub` 寫這個角色在做什麼）。表頭下方一條 `dg-rule`。
- 每格是一個圓角方塊（寬 96、高 48、`rx="6"`），格與格之間留 8 的縫，不畫外框和分欄線。
- 元件依資料流方向或敏感程度排序（原始層在上、彙總層在下，管理類元件放最後），不要照字母排。
- 欄最多 5 個角色、列最多 7 個元件，640 寬放得下；再多就拆成兩張（人員角色一張、服務帳號一張，或依領域拆）。
- 沒有連線。矩陣的資訊全在格子裡，不要加箭頭。

## 權限等級

- **固定四級，用字寫在格子裡**：`管理`、`讀寫`、`唯讀`、`無`。底色只是輔助：`dg-heat-3`、`dg-heat-2`、`dg-heat-1`、`dg-heat-0` 依序對應，權限越大越深。**一定要寫字，不能只靠顏色**，色弱讀者和黑白列印才分得出來。
- 「無」的字用 `dg-sub`（灰），其他等級用 `dg-label`。
- 不要用 `dg-heat-4`、`dg-heat-5`：顏色太深，格子裡的字會讀不清楚，而且四級已經用完了。
- 「無」的意思是**沒有權限**。還不確定的格子不要填「無」，也不要留空格；在正文說明哪些還沒決定，或先不畫那一列。
- 權限名稱要整張圖一致：同一個意思不要一下寫「唯讀」、一下寫「SELECT」、一下寫「檢視」。
- 等級只有「有／沒有」兩級時，矩陣就太重了，改成條列。

## 焦點

- 全圖最多**一格**焦點：正文要讀者記住的那條存取規則（例如「業務使用者只能讀彙總層」）。這格改用 `dg-box dg-box--accent`，等級字加 `dg-text--accent`，下面一行 `dg-sub dg-text--accent` 寫為什麼重要（≤ 6 個字）。
- 不要整列或整欄上色：權限矩陣的重點通常是一個交叉點，不是整個角色。
- 圖例通常不需要：格子裡已經寫了等級，焦點格也自帶說明。只有用了文字分不出來的樣式時才加。

## 範例

````markdown
```diagram
title: 分析資料平台的角色權限
desc: 平台管理員管理所有元件；資料工程師能讀寫各資料層和排程；分析師只能讀清理層和彙總層；業務使用者只能讀彙總層。
caption: 示意用的權限設計，實際分法依組織的資料治理規則而定。
---
<svg viewBox="0 0 640 380">
  <text class="dg-tag" x="32" y="46" dominant-baseline="central">資料層與元件</text>
  <text class="dg-label" x="256" y="36" text-anchor="middle" dominant-baseline="central">平台管理員</text>
  <text class="dg-sub" x="256" y="58" text-anchor="middle" dominant-baseline="central">維運平台</text>
  <text class="dg-label" x="360" y="36" text-anchor="middle" dominant-baseline="central">資料工程師</text>
  <text class="dg-sub" x="360" y="58" text-anchor="middle" dominant-baseline="central">建管線</text>
  <text class="dg-label" x="464" y="36" text-anchor="middle" dominant-baseline="central">資料分析師</text>
  <text class="dg-sub" x="464" y="58" text-anchor="middle" dominant-baseline="central">做分析</text>
  <text class="dg-label" x="568" y="36" text-anchor="middle" dominant-baseline="central">業務使用者</text>
  <text class="dg-sub" x="568" y="58" text-anchor="middle" dominant-baseline="central">看報表</text>
  <line class="dg-rule" x1="20" y1="80" x2="620" y2="80"/>

  <text class="dg-label" x="32" y="107" dominant-baseline="central">原始層</text>
  <text class="dg-sub" x="32" y="126" dominant-baseline="central">來源原樣</text>
  <rect class="dg-heat-3" x="208" y="92" width="96" height="48" rx="6"/>
  <text class="dg-label" x="256" y="116" text-anchor="middle" dominant-baseline="central">管理</text>
  <rect class="dg-heat-2" x="312" y="92" width="96" height="48" rx="6"/>
  <text class="dg-label" x="360" y="116" text-anchor="middle" dominant-baseline="central">讀寫</text>
  <rect class="dg-heat-0" x="416" y="92" width="96" height="48" rx="6"/>
  <text class="dg-sub" x="464" y="116" text-anchor="middle" dominant-baseline="central">無</text>
  <rect class="dg-heat-0" x="520" y="92" width="96" height="48" rx="6"/>
  <text class="dg-sub" x="568" y="116" text-anchor="middle" dominant-baseline="central">無</text>

  <text class="dg-label" x="32" y="163" dominant-baseline="central">清理層</text>
  <text class="dg-sub" x="32" y="182" dominant-baseline="central">清理過的明細</text>
  <rect class="dg-heat-3" x="208" y="148" width="96" height="48" rx="6"/>
  <text class="dg-label" x="256" y="172" text-anchor="middle" dominant-baseline="central">管理</text>
  <rect class="dg-heat-2" x="312" y="148" width="96" height="48" rx="6"/>
  <text class="dg-label" x="360" y="172" text-anchor="middle" dominant-baseline="central">讀寫</text>
  <rect class="dg-heat-1" x="416" y="148" width="96" height="48" rx="6"/>
  <text class="dg-label" x="464" y="172" text-anchor="middle" dominant-baseline="central">唯讀</text>
  <rect class="dg-heat-0" x="520" y="148" width="96" height="48" rx="6"/>
  <text class="dg-sub" x="568" y="172" text-anchor="middle" dominant-baseline="central">無</text>

  <text class="dg-label" x="32" y="219" dominant-baseline="central">彙總層</text>
  <text class="dg-sub" x="32" y="238" dominant-baseline="central">業務指標</text>
  <rect class="dg-heat-3" x="208" y="204" width="96" height="48" rx="6"/>
  <text class="dg-label" x="256" y="228" text-anchor="middle" dominant-baseline="central">管理</text>
  <rect class="dg-heat-2" x="312" y="204" width="96" height="48" rx="6"/>
  <text class="dg-label" x="360" y="228" text-anchor="middle" dominant-baseline="central">讀寫</text>
  <rect class="dg-heat-1" x="416" y="204" width="96" height="48" rx="6"/>
  <text class="dg-label" x="464" y="228" text-anchor="middle" dominant-baseline="central">唯讀</text>
  <rect class="dg-box dg-box--accent" x="520" y="204" width="96" height="48" rx="6"/>
  <text class="dg-label dg-text--accent" x="568" y="219" text-anchor="middle" dominant-baseline="central">唯讀</text>
  <text class="dg-sub dg-text--accent" x="568" y="238" text-anchor="middle" dominant-baseline="central">只開這一層</text>

  <text class="dg-label" x="32" y="275" dominant-baseline="central">匯入排程</text>
  <text class="dg-sub" x="32" y="294" dominant-baseline="central">ETL 工作</text>
  <rect class="dg-heat-3" x="208" y="260" width="96" height="48" rx="6"/>
  <text class="dg-label" x="256" y="284" text-anchor="middle" dominant-baseline="central">管理</text>
  <rect class="dg-heat-2" x="312" y="260" width="96" height="48" rx="6"/>
  <text class="dg-label" x="360" y="284" text-anchor="middle" dominant-baseline="central">讀寫</text>
  <rect class="dg-heat-0" x="416" y="260" width="96" height="48" rx="6"/>
  <text class="dg-sub" x="464" y="284" text-anchor="middle" dominant-baseline="central">無</text>
  <rect class="dg-heat-0" x="520" y="260" width="96" height="48" rx="6"/>
  <text class="dg-sub" x="568" y="284" text-anchor="middle" dominant-baseline="central">無</text>

  <text class="dg-label" x="32" y="331" dominant-baseline="central">存取政策</text>
  <text class="dg-sub" x="32" y="350" dominant-baseline="central">角色與授權</text>
  <rect class="dg-heat-3" x="208" y="316" width="96" height="48" rx="6"/>
  <text class="dg-label" x="256" y="340" text-anchor="middle" dominant-baseline="central">管理</text>
  <rect class="dg-heat-1" x="312" y="316" width="96" height="48" rx="6"/>
  <text class="dg-label" x="360" y="340" text-anchor="middle" dominant-baseline="central">唯讀</text>
  <rect class="dg-heat-0" x="416" y="316" width="96" height="48" rx="6"/>
  <text class="dg-sub" x="464" y="340" text-anchor="middle" dominant-baseline="central">無</text>
  <rect class="dg-heat-0" x="520" y="316" width="96" height="48" rx="6"/>
  <text class="dg-sub" x="568" y="340" text-anchor="middle" dominant-baseline="central">無</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 格子只有顏色、沒有字 | 色弱讀者和黑白列印分不出等級 |
| 權限等級超過四級，或同一級有好幾種寫法 | 讀者要回頭對照，掃不出規律 |
| 兩格以上標焦點，或整列、整欄上色 | 看不出哪一條才是正文要講的規則 |
| 用「無」代表「還沒決定」 | 「無」是明確的設計，混在一起會讓稽核讀錯 |
| 格子之間畫箭頭 | 矩陣不講流向；要講授權流程改用流程圖或循序圖 |
| 格子裡塞具體權限語法和條件 | 該用 Markdown 表格，才能搜尋、複製 |
| 角色超過 5 個或元件超過 7 個 | 手機上要捲很久；拆成兩張 |

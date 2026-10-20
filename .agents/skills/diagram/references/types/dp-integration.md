# 資料平台整合圖（Data Platform Integration）

**適合：** 一個資料平台的整合拓撲——左邊有哪些**來源**接進來、中間的**平台核心**由哪幾個元件組成、右邊有哪些**使用端**接出去，以及每一條接線用什麼方式（CDC、檔案、API、SQL）。讀者要回答的是「這個平台對外有幾個接口、各走什麼協定」。一張快照，沒有時間軸、沒有階段。

**不適合：**

- 一般部落格文章很少需要這種圖。只有在文章真的在講「某個資料平台怎麼跟外部系統對接」時才畫；講一般的服務架構用架構圖（`architecture.md`）就好。
- 元件之間沒有明確的「來源 → 核心 → 使用端」三段，或重點是部署邊界、雲端服務怎麼互連 → 架構圖。
- 重點是資料在平台裡經過哪些轉換、品質怎麼升級 → 分級資料層（`medallion.md`）或資料流圖（`data-flow.md`）。
- 重點是誰能讀寫什麼 → 權限矩陣（`dp-security-matrix.md`）。整合圖畫「誰跟誰連」，權限矩陣畫「誰能做什麼」，兩張分開。
- 有時間順序的請求往返 → 循序圖（`sequence.md`）。

## 版面

- **三欄由左到右：來源 → 平台 → 使用端。** 來源和使用端各是一欄同寬、同高的 `dg-box`，列與列對齊；平台用 `dg-zone` 框起來，左上角放 `dg-tag`「資料平台」，三欄的欄名（`dg-tag`）放在同一個 y。
- 平台內放 2–3 個核心元件（匯入、儲存、查詢引擎……），由左到右照資料方向排。只接一條線進出的小元件，合併進鄰近的大元件，用副標寫出來。
- 平台元件可以做成跨越多列的高框，讓每個來源都能水平直線接進來，不用轉彎。
- **跨整個平台的服務**（身分驗證、權限、稽核、監控）放在平台框**下方**，做成和平台框同寬的一列，用一條往上的虛線接到平台框的下緣、標「驗證」之類的字。**不要把它接到某一個元件**，那會讓讀者以為只有那個元件受管；也不要畫在平台框裡面，它是從外面管整個平台。
- 外部的 SaaS、合作夥伴可以用 `dg-box--link`，但來源欄只要全部是外部系統，就全部用同一個樣式，不必每個都標藍。
- 節點守住 9 個上限：來源 3、平台 2–3、使用端 3、跨平台服務 1。來源或使用端超過 4 個時，把同類的合併（「4 個業務資料庫」寫在副標），或拆成兩張圖（一張資料面、一張身分與監控面）。

## 連線

- 每條跨越平台邊界的線**都標協定或接法**（`CDC`、`SFTP`、`REST`、`SQL`），用 `dg-mono` 疊在 `dg-edge` 上。這是整合圖和架構圖最大的差別：讀者要的就是「每個接口走什麼」。平台內部的線不標，位置已經說明。
- 來源的線從右側出、進平台元件的左側；平台的線從右側出、進使用端的左側。標籤放在平台框和來源（或使用端）之間的空隙，不要壓到平台框的虛線。
- 同一個元件接出多條線時照規則 4 分開接點；來源和使用端的列對齊平台元件時，直接用水平線，不要為了「看起來有在連」而轉彎。
- 一般資料線用 `dg-line`；平台直接查詢外部來源、不複製資料（聯邦查詢）時用 `dg-line--link dg-line--dashed`；跨平台服務那條用 `dg-line--dashed`。
- 不要畫一條「所有來源 → 平台」的總線，那等於什麼都沒說。

## 焦點

- accent 給 1–2 個平台元件：把一堆工具變成「平台」的那個核心，通常是共用儲存或查詢引擎。來源、使用端、跨平台服務都不用 accent。
- 不要每個工具一個顏色。

## 範例

````markdown
```diagram
title: 分析資料平台的整合拓撲
desc: 交易資料庫、合作夥伴檔案和 SaaS 服務經匯入元件進到資料湖倉，BI 報表、分析筆記本和內部服務再從湖倉取數；身分與權限服務管整個平台。
caption: 簡化示意：實際接法依來源系統而定，例如有些資料庫改用每日匯出而不是 CDC。
---
<svg viewBox="0 0 640 440">
  <rect class="dg-zone" x="200" y="24" width="256" height="308" rx="8"/>
  <text class="dg-tag" x="80" y="46" text-anchor="middle" dominant-baseline="central">來源</text>
  <text class="dg-tag" x="216" y="46" dominant-baseline="central">資料平台</text>
  <text class="dg-tag" x="568" y="46" text-anchor="middle" dominant-baseline="central">使用端</text>

  <path class="dg-line" d="M140 108H212" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M140 188H212" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M140 268H212" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M308 188H344" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 108H512" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 188H512" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 268H512" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M328 372V336" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--link" x="20" y="80" width="120" height="56" rx="6"/>
  <text class="dg-label" x="80" y="100" text-anchor="middle" dominant-baseline="central">交易資料庫</text>
  <text class="dg-sub" x="80" y="120" text-anchor="middle" dominant-baseline="central">訂單、會員</text>
  <rect class="dg-box dg-box--link" x="20" y="160" width="120" height="56" rx="6"/>
  <text class="dg-label" x="80" y="180" text-anchor="middle" dominant-baseline="central">合作夥伴檔案</text>
  <text class="dg-sub" x="80" y="200" text-anchor="middle" dominant-baseline="central">每日 CSV</text>
  <rect class="dg-box dg-box--link" x="20" y="240" width="120" height="56" rx="6"/>
  <text class="dg-label" x="80" y="260" text-anchor="middle" dominant-baseline="central">SaaS 服務</text>
  <text class="dg-sub" x="80" y="280" text-anchor="middle" dominant-baseline="central">CRM、金流</text>

  <rect class="dg-box" x="216" y="72" width="92" height="232" rx="6"/>
  <text class="dg-label" x="262" y="178" text-anchor="middle" dominant-baseline="central">匯入</text>
  <text class="dg-sub" x="262" y="200" text-anchor="middle" dominant-baseline="central">批次・串流</text>
  <rect class="dg-box dg-box--accent" x="348" y="72" width="92" height="232" rx="6"/>
  <text class="dg-label" x="394" y="178" text-anchor="middle" dominant-baseline="central">資料湖倉</text>
  <text class="dg-sub" x="394" y="200" text-anchor="middle" dominant-baseline="central">儲存＋查詢</text>

  <rect class="dg-box" x="516" y="80" width="104" height="56" rx="6"/>
  <text class="dg-label" x="568" y="100" text-anchor="middle" dominant-baseline="central">BI 報表</text>
  <text class="dg-sub" x="568" y="120" text-anchor="middle" dominant-baseline="central">儀表板</text>
  <rect class="dg-box" x="516" y="160" width="104" height="56" rx="6"/>
  <text class="dg-label" x="568" y="180" text-anchor="middle" dominant-baseline="central">分析筆記本</text>
  <text class="dg-sub" x="568" y="200" text-anchor="middle" dominant-baseline="central">探索、建模</text>
  <rect class="dg-box" x="516" y="240" width="104" height="56" rx="6"/>
  <text class="dg-label" x="568" y="260" text-anchor="middle" dominant-baseline="central">內部服務</text>
  <text class="dg-sub" x="568" y="280" text-anchor="middle" dominant-baseline="central">用 API 取數</text>

  <rect class="dg-box dg-box--store" x="200" y="376" width="256" height="48" rx="6"/>
  <text class="dg-label" x="328" y="390" text-anchor="middle" dominant-baseline="central">身分與權限</text>
  <text class="dg-sub" x="328" y="410" text-anchor="middle" dominant-baseline="central">單一登入、角色、稽核紀錄</text>

  <text class="dg-edge dg-mono" x="170" y="96" text-anchor="middle" dominant-baseline="central">CDC</text>
  <text class="dg-edge dg-mono" x="170" y="176" text-anchor="middle" dominant-baseline="central">SFTP</text>
  <text class="dg-edge dg-mono" x="170" y="256" text-anchor="middle" dominant-baseline="central">REST</text>
  <text class="dg-edge dg-mono" x="486" y="96" text-anchor="middle" dominant-baseline="central">SQL</text>
  <text class="dg-edge dg-mono" x="486" y="176" text-anchor="middle" dominant-baseline="central">SQL</text>
  <text class="dg-edge dg-mono" x="486" y="256" text-anchor="middle" dominant-baseline="central">REST</text>
  <text class="dg-edge" x="338" y="354" dominant-baseline="central">驗證</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 三個以上不同的來源收成一個「資料來源」框 | 整合圖要講的就是有幾個接口，收起來就該改畫架構圖 |
| 一條總線從「來源」接到「平台」 | 讀者看不出每個接口走什麼協定 |
| 跨越平台邊界的線沒標協定 | 這是整合圖的主要資訊；平台內部的線才可以不標 |
| 身分服務只接到某一個元件 | 讀者會以為只有那個元件受管；接到平台框下緣 |
| 身分服務畫在平台框裡面 | 它是從外面管整個平台，畫在裡面會誤導信任範圍 |
| 每個工具一個顏色 | 層級被色塊蓋掉；只有 1–2 個核心元件用 accent |
| 上方加階段箭頭（擷取 → 處理 → 發布） | 整合圖沒有時間軸；要講階段改用資料流圖或流程圖 |
| 節點超過 9 個還硬塞 | 合併同類來源，或拆成資料面、身分面兩張 |

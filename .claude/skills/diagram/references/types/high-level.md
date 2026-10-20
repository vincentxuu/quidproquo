# High-level 資料堆疊總覽（High-level data stack）

**適合：** 一整套資料平台的端到端總覽：資料來源 → 擷取 → 儲存 → 轉換 → 呈現，跑在一個容器叢集（Kubernetes、ECS、Nomad）上，外加排程、身分權限、監控這些橫跨全部元件的東西。讀者要看的是「每個階段用什麼、資料從哪進來、哪些東西是全平台共用的」。

**不適合：**

- 元件之間的呼叫細節、通訊協定、部署邊界 → 架構圖（`architecture.md`）。high-level 圖是架構圖的一種固定版型：上方多一條階段標題列，元件照階段排成欄，橫跨全平台的東西排在底部。平台不是「一條資料管線」、沒有清楚的階段時，用一般架構圖。
- 一層疊一層的抽象層級（應用 → 框架 → 模型 API → 硬體）→ 分層圖（`layers.md`）。分層圖是上下依賴；high-level 圖是左右的資料流，再加上直的共通層。
- 舊系統各自為政的現況 → IT 現況圖（`it-state.md`）。high-level 圖畫的是規劃好的平台，通常是 IT 現況圖的「之後」。
- 只想列出用了哪些工具 → 條列或表格。

老實說：部落格很少需要這種圖。它是資料團隊對內說明平台全貌用的；部落格裡只有在寫「我們的資料平台怎麼搭起來」這類案例文時才派得上用場。元件少於 5 個時，一般架構圖就夠了。

## 版面

- **階段標題列：** 最上面一排箭頭形（chevron）的階段名稱，由左到右 4–6 個，等寬。用 `<polygon class="dg-box">` 畫，`dg-box` 和 `dg-box--store` 交替，名稱 `dg-sub` 置中。形狀：第一個左邊平、右邊尖；中間的左邊凹、右邊尖；最後一個左邊凹、右邊平；尖和凹都是 12。這一排就是全圖的欄位圖例，**不能省**。
- **欄對齊：** 每個元件的中心線對齊它所屬階段的中心線。元件跑出自己的欄，標題列就失去意義。
- **來源：** 第一欄放外部資料來源，用 `dg-box--link`，在叢集外面。
- **叢集邊界：** 其他階段的元件包在一個 `dg-zone` 裡，左上角 `dg-tag` 寫叢集名稱。叢集的左緣對齊第二個階段的左緣。
- **排程列：** 排程器（Airflow 這類）是叢集內最上面一條全寬的 `dg-box`，往下用虛線（`dg-line dg-line--dashed`）連到它觸發的元件，從排程列下緣出發、進入元件上緣。其中一條加「觸發」標籤，其他不用。
- **元件：** 叢集內一排，每個階段 1 個為主，最多 2 個（同欄上下疊）。名稱 `dg-label`，副標 `dg-sub` 寫用途或代表工具。
- **資料流：** 元件之間用實線，從右緣出、進下一個元件的左緣。元件間距窄時不加標籤；需要標的話把元件間距拉到 48 以上再加。
- **共通列：** 身分權限、監控、備份這類橫跨全部元件的東西，排在叢集下方，每列一條全寬的 `dg-box--store`，最多 2–3 列。**共通列不接任何線**：它作用在全部元件上，接到某一個會讓讀者誤會範圍。上游版本會在右側再加一排直的階段標題對應這些列；640 寬放不下，直接在列裡寫名稱就好。
- **焦點：** 只給一個元件 accent，通常是資料最後都匯集的那個儲存（資料湖、資料倉儲）。焦點元件可以比其他元件高一點。
- 一個來源最多分給 3 個元件；更多就先匯到一個擷取元件再分出去。
- 節點上限照 `primitives.md`：來源、元件、排程列、共通列加起來不超過 9 個。超過就拆成「總覽」和「某一階段的細節」兩張。

## 範例

````markdown
```diagram
title: 一個資料平台的總覽
desc: 營運資料庫與 SaaS API 的資料經擷取進入資料湖，再轉換成儀表板；擷取與轉換由排程器觸發，身分權限和監控橫跨整個平台。
caption: 簡化示意：轉換結果實際上會寫回資料湖再給儀表板讀，這裡畫成一條直線。
---
<svg viewBox="0 0 640 408">
  <polygon class="dg-box" points="16,12 124,12 136,28 124,44 16,44"/>
  <text class="dg-sub" x="70" y="28" text-anchor="middle" dominant-baseline="central">資料來源</text>
  <polygon class="dg-box dg-box--store" points="136,12 244,12 256,28 244,44 136,44 148,28"/>
  <text class="dg-sub" x="196" y="28" text-anchor="middle" dominant-baseline="central">擷取</text>
  <polygon class="dg-box" points="256,12 364,12 376,28 364,44 256,44 268,28"/>
  <text class="dg-sub" x="316" y="28" text-anchor="middle" dominant-baseline="central">儲存</text>
  <polygon class="dg-box dg-box--store" points="376,12 484,12 496,28 484,44 376,44 388,28"/>
  <text class="dg-sub" x="436" y="28" text-anchor="middle" dominant-baseline="central">轉換</text>
  <polygon class="dg-box" points="496,12 624,12 624,44 496,44 508,28"/>
  <text class="dg-sub" x="560" y="28" text-anchor="middle" dominant-baseline="central">呈現</text>

  <rect class="dg-zone" x="136" y="56" width="488" height="240" rx="8"/>
  <text class="dg-tag" x="152" y="76" dominant-baseline="central">容器叢集（KUBERNETES）</text>

  <path class="dg-line dg-line--link" d="M112 196H148" marker-end="url(#arrow-link)"/>
  <path class="dg-line dg-line--link" d="M112 260H116Q124 260 124 252V220Q124 212 132 212H148" marker-end="url(#arrow-link)"/>
  <path class="dg-line dg-line--dashed" d="M196 128V172" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M436 128V172" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M240 204H264" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M364 204H388" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 204H512" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--link" x="20" y="168" width="92" height="56" rx="6"/>
  <text class="dg-label" x="66" y="186" text-anchor="middle" dominant-baseline="central">營運 DB</text>
  <text class="dg-sub" x="66" y="208" text-anchor="middle" dominant-baseline="central">訂單・會員</text>
  <rect class="dg-box dg-box--link" x="20" y="232" width="92" height="56" rx="6"/>
  <text class="dg-label" x="66" y="250" text-anchor="middle" dominant-baseline="central">SaaS API</text>
  <text class="dg-sub" x="66" y="272" text-anchor="middle" dominant-baseline="central">金流・廣告</text>

  <rect class="dg-box" x="152" y="92" width="456" height="36" rx="6"/>
  <text class="dg-label" x="168" y="110" dominant-baseline="central">排程器</text>
  <text class="dg-sub" x="232" y="110" dominant-baseline="central">Airflow 這類工具，依時間觸發擷取與轉換</text>

  <rect class="dg-box" x="152" y="176" width="88" height="56" rx="6"/>
  <text class="dg-label" x="196" y="194" text-anchor="middle" dominant-baseline="central">擷取</text>
  <text class="dg-sub" x="196" y="216" text-anchor="middle" dominant-baseline="central">批次＋串流</text>
  <rect class="dg-box dg-box--accent" x="268" y="168" width="96" height="72" rx="6"/>
  <text class="dg-label" x="316" y="194" text-anchor="middle" dominant-baseline="central">資料湖</text>
  <text class="dg-sub" x="316" y="216" text-anchor="middle" dominant-baseline="central">物件儲存</text>
  <rect class="dg-box" x="392" y="176" width="88" height="56" rx="6"/>
  <text class="dg-label" x="436" y="194" text-anchor="middle" dominant-baseline="central">轉換</text>
  <text class="dg-sub" x="436" y="216" text-anchor="middle" dominant-baseline="central">SQL 模型</text>
  <rect class="dg-box" x="516" y="176" width="88" height="56" rx="6"/>
  <text class="dg-label" x="560" y="194" text-anchor="middle" dominant-baseline="central">儀表板</text>
  <text class="dg-sub" x="560" y="216" text-anchor="middle" dominant-baseline="central">BI 報表</text>

  <rect class="dg-box dg-box--store" x="16" y="312" width="608" height="36" rx="6"/>
  <text class="dg-label" x="32" y="330" dominant-baseline="central">身分與權限</text>
  <text class="dg-sub" x="128" y="330" dominant-baseline="central">單一登入，所有元件共用同一套角色</text>
  <rect class="dg-box dg-box--store" x="16" y="356" width="608" height="36" rx="6"/>
  <text class="dg-label" x="32" y="374" dominant-baseline="central">監控</text>
  <text class="dg-sub" x="128" y="374" dominant-baseline="central">日誌、指標、告警</text>

  <text class="dg-edge" x="206" y="152" dominant-baseline="central">觸發</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 省略階段標題列 | 讀者看不出每一欄代表什麼階段 |
| 元件沒對齊它的階段欄 | 標題列和元件對不起來，整張圖的分欄就失效 |
| 兩個以上元件標 accent | 平台的重心是資料匯集的那一個；多標就沒有重心 |
| 外部來源畫在叢集裡面 | 讀者會以為來源也歸平台管 |
| 共通列拉線接到某個元件 | 共通列作用在全部元件上，接一條線反而縮小了範圍 |
| 排程的觸發線畫成實線 | 和資料流混在一起；觸發一律虛線 |
| 一個來源直接分給 4 個以上元件 | 線會擠成一團；先匯到一個擷取元件 |
| 每條線都標資料格式 | 元件間距只有 24，標籤會壓到框；真的要標就拉開間距 |

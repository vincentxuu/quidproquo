# IT 現況圖（IT current-state）

**適合：** 現代化提案的「改之前」：把舊系統依階段或部門攤開（接單 → 出貨 → 報表，或業務／營運／管理），標出痛點、每一次交接用的是什麼（CSV、Excel、Email、手動複製），以及還沒有平台之前各自為政的工具。讀者要看的是「現在的摩擦在哪裡」：沒有版本控制、靠人搬檔案、單點故障、各系統各自一套帳號。

**不適合：**

- 系統元件怎麼連、部署在哪 → 架構圖（`architecture.md`）。架構圖畫的是一個設計過的系統；IT 現況圖畫的是長出來的現況，重點是交接的媒介和痛點，不是通訊協定。現況其實已經很整齊、沒有人工交接時，就用架構圖。
- 改動前後的結構差在哪 → 前後對照（`before-after.md`）。IT 現況圖只畫「前」；文章同時要講「後」、而且兩邊結構差不多大時，用前後對照把兩張並排。現況複雜到一張圖就塞滿時，先用這張畫現況，再另外畫一張目標架構。
- 跨角色的流程、誰在哪一步交接 → 泳道圖（`swimlane.md`）。泳道圖有時間順序；IT 現況圖是一張快照，沒有先後。

老實說：部落格很少需要這種圖。它最常出現在顧問提案和內部簡報；部落格裡通常只有在寫「我們怎麼把一團舊系統整理起來」的案例文時才用得上，而且只畫一張。

## 版面

- **分區：** 2–4 個 `dg-zone`，依階段或部門分。選一個方向貫徹全圖：分區由上往下疊（每區一列，元件在區內左右排），或由左往右排（每區一欄，元件在區內上下排）。640 寬的圖用**上下疊**比較好放：區與區之間的空隙放得下交接標籤，標籤不會壓到分區的框線。
- 分區名稱用 `dg-tag` 放在區內左上角；框的上緣到第一個元件至少留 28。
- **元件：** 每區 1–3 個，全圖最多 9 個（含底部的共通列）。名稱 `dg-label`，副標 `dg-sub` 寫「為什麼痛」或技術細節（「每人一份、互相覆蓋」「地端主機」）。同一欄的元件左右對齊，交接線才能直直往下。
- **痛點：** 最多 2 個元件用 `dg-box--warn`，就是正文要講、提案要解決的那兩個。不要每個不順的地方都標紅，標得越多讀者越不知道先看哪裡。其他元件用 `dg-box`，資料庫或儲存用 `dg-box--store`。
- **外部單位：** 公司外的系統或單位（會計師、政府平台、客戶）用 `dg-box--link`。
- **交接線：** 照 `primitives.md` 的六條連線規則，只用直角線，r = 8 的圓角轉折。**每條交接線都要標媒介**（Email、CSV、Excel、列印、手動輸入），這是這種圖和架構圖最不一樣的地方：媒介本身就是重點，所以這裡不適用「只標猜不到的線」。標籤 ≤ 8 個中文字，放在區與區之間的空隙或線段旁邊，不要壓到分區框線。
- **共通列：** 橫跨所有分區的問題（各系統各自一套帳號、沒有統一備份），在分區下方加一條全寬的 `dg-box--store` 列，左邊 `dg-tag` 寫「共通」。共通列不接任何線：它影響全部元件，接到其中一個反而會讓讀者以為只影響那一個。最多 2 列。
- accent 通常不用：這張圖的焦點是痛點（warn）。如果文章要特別指出「新平台會先接手的那一個」，可以給它一個 accent，但痛點加 accent 合計仍以 2 為限。
- 圖例放底部，只列真的用到的樣式（通常是痛點和外部單位）。

## 範例

````markdown
```diagram
title: 接單到月報：導入新系統前的現況
desc: 業務、營運、管理三個部門各用各的工具，訂單從官網表單一路靠 Email、手動輸入、CSV 匯出傳到月報，再印給主管、寄給會計師；業務名單和月報 Excel 是兩個主要痛點。
caption: 假想的中小企業；每條線都是人工交接，標籤是交接用的媒介。
---
<svg viewBox="0 0 640 584">
  <rect class="dg-zone" x="12" y="16" width="616" height="104" rx="8"/>
  <text class="dg-tag" x="28" y="32" dominant-baseline="central">業務・接單</text>
  <rect class="dg-zone" x="12" y="176" width="616" height="104" rx="8"/>
  <text class="dg-tag" x="28" y="192" dominant-baseline="central">營運・出貨</text>
  <rect class="dg-zone" x="12" y="336" width="616" height="104" rx="8"/>
  <text class="dg-tag" x="28" y="352" dominant-baseline="central">管理・報表</text>

  <path class="dg-line" d="M184 76H236" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M316 104V204" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M392 236H444" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M292 264V364" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M524 264V300Q524 308 516 308H348Q340 308 340 316V364" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--link" d="M392 396H444" marker-end="url(#arrow-link)"/>
  <path class="dg-line" d="M240 396H188" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="32" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="108" y="66" text-anchor="middle" dominant-baseline="central">官網詢價表單</text>
  <text class="dg-sub" x="108" y="88" text-anchor="middle" dominant-baseline="central">寄到業務共用信箱</text>

  <rect class="dg-box dg-box--warn" x="240" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="316" y="66" text-anchor="middle" dominant-baseline="central">業務名單 Excel</text>
  <text class="dg-sub" x="316" y="88" text-anchor="middle" dominant-baseline="central">每人一份、互相覆蓋</text>

  <rect class="dg-box dg-box--store" x="240" y="208" width="152" height="56" rx="6"/>
  <text class="dg-label" x="316" y="226" text-anchor="middle" dominant-baseline="central">舊版 ERP</text>
  <text class="dg-sub" x="316" y="248" text-anchor="middle" dominant-baseline="central">地端主機、一人維護</text>

  <rect class="dg-box" x="448" y="208" width="152" height="56" rx="6"/>
  <text class="dg-label" x="524" y="226" text-anchor="middle" dominant-baseline="central">倉庫出貨單</text>
  <text class="dg-sub" x="524" y="248" text-anchor="middle" dominant-baseline="central">列印出來手寫勾選</text>

  <rect class="dg-box dg-box--warn" x="240" y="368" width="152" height="56" rx="6"/>
  <text class="dg-label" x="316" y="386" text-anchor="middle" dominant-baseline="central">月報 Excel</text>
  <text class="dg-sub" x="316" y="408" text-anchor="middle" dominant-baseline="central">每月手動彙整</text>

  <rect class="dg-box" x="32" y="368" width="152" height="56" rx="6"/>
  <text class="dg-label" x="108" y="386" text-anchor="middle" dominant-baseline="central">主管會議</text>
  <text class="dg-sub" x="108" y="408" text-anchor="middle" dominant-baseline="central">看印出來的報表</text>

  <rect class="dg-box dg-box--link" x="448" y="368" width="152" height="56" rx="6"/>
  <text class="dg-label" x="524" y="386" text-anchor="middle" dominant-baseline="central">會計師事務所</text>
  <text class="dg-sub" x="524" y="408" text-anchor="middle" dominant-baseline="central">外部單位</text>

  <rect class="dg-box dg-box--store" x="12" y="460" width="616" height="44" rx="6"/>
  <text class="dg-tag" x="28" y="482" dominant-baseline="central">共通</text>
  <text class="dg-label" x="76" y="482" dominant-baseline="central">帳號</text>
  <text class="dg-sub" x="124" y="482" dominant-baseline="central">每套系統各自建帳號，人員異動要逐一處理</text>

  <text class="dg-edge" x="210" y="64" text-anchor="middle" dominant-baseline="central">Email</text>
  <text class="dg-edge" x="326" y="148" dominant-baseline="central">手動輸入</text>
  <text class="dg-edge" x="418" y="224" text-anchor="middle" dominant-baseline="central">列印</text>
  <text class="dg-edge" x="282" y="304" text-anchor="end" dominant-baseline="central">CSV 匯出</text>
  <text class="dg-edge" x="432" y="296" text-anchor="middle" dominant-baseline="central">Email</text>
  <text class="dg-edge" x="214" y="384" text-anchor="middle" dominant-baseline="central">列印</text>
  <text class="dg-edge dg-text--link" x="418" y="384" text-anchor="middle" dominant-baseline="central">Email</text>

  <line class="dg-rule" x1="20" y1="528" x2="620" y2="528"/>
  <text class="dg-tag" x="20" y="556" dominant-baseline="central">圖例</text>
  <rect class="dg-box dg-box--warn" x="72" y="548" width="16" height="16" rx="3"/>
  <text class="dg-small" x="96" y="556" dominant-baseline="central">主要痛點</text>
  <rect class="dg-box dg-box--store" x="196" y="548" width="16" height="16" rx="3"/>
  <text class="dg-small" x="220" y="556" dominant-baseline="central">系統與資料</text>
  <rect class="dg-box dg-box--link" x="332" y="548" width="16" height="16" rx="3"/>
  <text class="dg-small" x="356" y="556" dominant-baseline="central">外部單位</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 每個不順的地方都標紅 | 讀者不知道先看哪裡；痛點最多 2 個 |
| 交接線不寫媒介 | 這張圖的重點就是「靠 Email、Excel 搬資料」，不寫就變成普通架構圖 |
| 斜線、或箭頭停在框裡面 | 違反連線規則；箭頭停在框外 2–4 |
| 共通列拉線接到某一個元件 | 共通列影響全部元件，接到一個會讓讀者誤會範圍 |
| 分區有的橫排、有的直排 | 讀者要一直換閱讀方向；全圖選一個方向 |
| 超過 9 個元件或一區超過 3 個 | 拆成兩張：例如「接單端的痛點」和「報表端的痛點」 |
| 把目標架構也塞進同一張 | 現況和目標混在一起，看不出差別；目標另畫一張，或改用前後對照 |

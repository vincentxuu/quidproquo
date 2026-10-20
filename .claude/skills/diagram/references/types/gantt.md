# 甘特圖（Gantt）

**適合：** 一組有起訖時間的任務排在同一條時間軸上，讀者要看的是「哪些工作同時進行、哪一段拖住整個時程、里程碑落在哪」：專案計畫、產品路線圖、遷移的分階段排程、課程週次安排。

**不適合：**

- 只有瞬間發生的事件、沒有持續時間 → 時間軸（`timeline.md`）。
- 重點是誰把工作交給誰、跨角色交接 → 泳道圖（`swimlane.md`）。
- 任務之間的相依關係才是重點（A 做完才能做 B、C）→ 流程圖（`flowchart.md`）或 mermaid。
- 任務超過 10 個，或讀者要查精確日期 → 普通 Markdown 表格（任務｜開始｜結束｜負責人）；要拖拉、即時更新 → 專案管理工具或 `dataviz` skill。
- 只有兩三個階段、彼此不重疊 → 一句話或條列。

## 版面

- viewBox 寬 640。左側約 160 放任務名稱，右側 440 是時間區（範例：10 週、每週 44）。
- **時間軸在上方**：週次或月份 `dg-small` 置中放在每格中心，下方一條 `dg-rule` 分隔。每格邊界畫一條淡淡的 `dg-grid` 直線，讓讀者對得到週次。
- **每個任務一列**，列距 32、長條高 18、置中。任務名稱 `dg-sub` 放在左欄，靠左對齊。
- **階段分組**：同一階段的任務包在一塊 `dg-band` 裡（橫跨名稱欄和時間區），階段名稱用 `dg-tag` 放在帶子左上角，帶子之間留 8。最多 3–4 個階段。
- 長條**不寫日期**：日期由上方的時間軸表達，條上或條旁再寫一次只會擠。需要精確日期就附表格。
- **里程碑**是一個菱形（`<path class="dg-point dg-c-ink" d="M x y-8 L x+8 y L x y+8 L x-8 y Z"/>`），畫在它發生的那一刻，不是一根長條。
- **今天線**（選配）：一條垂直 `dg-line dg-line--dashed` 從時間軸畫到最後一列，「今天」`dg-small` 放在最下方，不要放在上方和週次標籤搶位置。今天線先畫、長條後畫，讓長條蓋住虛線。
- 不畫任務之間的相依箭頭；真的需要，代表這張圖其實是流程圖。

## 顏色

- 一般任務：`<g class="dg-c-s1">` 包住，`dg-bar`。全部同色，階段已經由位置和帶子表達，不要每個階段一個顏色。
- **焦點最多一個任務**：要徑上卡住整體時程的那一項，或正文在講的那一項，用 `dg-bar dg-c-accent`，任務名稱用 `dg-label dg-text--accent`。
- 已完成／未開始要區分時，未開始的改 `dg-bar--soft`，並在 caption 說明（不要只靠深淺讓讀者猜）。

## 時間換算成座標（必做）

```text
時間區起點 x0 = 176、每週 44 單位
任務 x = x0 + (開始週 − 1) × 44
任務寬 = 持續週數 × 44
例：第 5 週開始、做 4 週 → x = 352，寬 = 176
```

- **x 跟時間成正比**，不要為了塞名字把短任務拉長。
- 時間單位整張圖一致（週就全用週）；一格太細就合併成較粗的單位。
- 排程要有依據：正文寫出這份計畫的來源（專案文件、公開路線圖、課程大綱）。教學用的假排程在 caption 寫「示意」。

## 範例

````markdown
```diagram
title: 資料庫遷移專案的十週排程
desc: 規劃兩週、開發四週、上線三週；資料遷移從第 5 週做到第 8 週，是決定第 10 週能否上線的要徑。
caption: 示意排程。換算：x = 176 + (開始週 − 1) × 44，寬 = 週數 × 44。
---
<svg viewBox="0 0 640 432">
  <rect class="dg-band" x="16" y="64" width="608" height="96" rx="6"/>
  <rect class="dg-band" x="16" y="168" width="608" height="128" rx="6"/>
  <rect class="dg-band" x="16" y="304" width="608" height="96" rx="6"/>

  <line class="dg-grid" x1="220" y1="56" x2="220" y2="400"/>
  <line class="dg-grid" x1="264" y1="56" x2="264" y2="400"/>
  <line class="dg-grid" x1="308" y1="56" x2="308" y2="400"/>
  <line class="dg-grid" x1="352" y1="56" x2="352" y2="400"/>
  <line class="dg-grid" x1="396" y1="56" x2="396" y2="400"/>
  <line class="dg-grid" x1="440" y1="56" x2="440" y2="400"/>
  <line class="dg-grid" x1="484" y1="56" x2="484" y2="400"/>
  <line class="dg-grid" x1="528" y1="56" x2="528" y2="400"/>
  <line class="dg-grid" x1="572" y1="56" x2="572" y2="400"/>

  <text class="dg-small" x="198" y="40" text-anchor="middle" dominant-baseline="central">W1</text>
  <text class="dg-small" x="242" y="40" text-anchor="middle" dominant-baseline="central">W2</text>
  <text class="dg-small" x="286" y="40" text-anchor="middle" dominant-baseline="central">W3</text>
  <text class="dg-small" x="330" y="40" text-anchor="middle" dominant-baseline="central">W4</text>
  <text class="dg-small" x="374" y="40" text-anchor="middle" dominant-baseline="central">W5</text>
  <text class="dg-small" x="418" y="40" text-anchor="middle" dominant-baseline="central">W6</text>
  <text class="dg-small" x="462" y="40" text-anchor="middle" dominant-baseline="central">W7</text>
  <text class="dg-small" x="506" y="40" text-anchor="middle" dominant-baseline="central">W8</text>
  <text class="dg-small" x="550" y="40" text-anchor="middle" dominant-baseline="central">W9</text>
  <text class="dg-small" x="594" y="40" text-anchor="middle" dominant-baseline="central">W10</text>
  <line class="dg-rule" x1="16" y1="56" x2="624" y2="56"/>
  <line class="dg-line dg-line--dashed" x1="418" y1="56" x2="418" y2="400"/>

  <text class="dg-tag" x="32" y="80" dominant-baseline="central">規劃</text>
  <text class="dg-sub" x="32" y="108" dominant-baseline="central">需求訪談</text>
  <text class="dg-sub" x="32" y="140" dominant-baseline="central">規格定稿</text>
  <text class="dg-tag" x="32" y="184" dominant-baseline="central">開發</text>
  <text class="dg-sub" x="32" y="212" dominant-baseline="central">新版 API</text>
  <text class="dg-sub" x="32" y="244" dominant-baseline="central">前端頁面</text>
  <text class="dg-label dg-text--accent" x="32" y="276" dominant-baseline="central">資料遷移</text>
  <text class="dg-tag" x="32" y="320" dominant-baseline="central">上線</text>
  <text class="dg-sub" x="32" y="348" dominant-baseline="central">壓力測試</text>
  <text class="dg-sub" x="32" y="380" dominant-baseline="central">正式切換</text>

  <g class="dg-c-s1">
    <rect class="dg-bar" x="176" y="99" width="88" height="18"/>
    <rect class="dg-bar" x="220" y="131" width="88" height="18"/>
    <rect class="dg-bar" x="264" y="203" width="176" height="18"/>
    <rect class="dg-bar" x="308" y="235" width="176" height="18"/>
    <rect class="dg-bar" x="484" y="339" width="88" height="18"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="352" y="267" width="176" height="18"/>
  <path class="dg-point dg-c-ink" d="M572 372 L580 380 L572 388 L564 380 Z"/>

  <text class="dg-small" x="418" y="416" text-anchor="middle" dominant-baseline="central">今天</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 每個階段、每個任務一種顏色 | 顏色沒編碼任何東西；位置和分組帶子已經說了階段 |
| 長條上寫起訖日期 | 和時間軸重複，條短時還會溢出 |
| 任務超過 10 個 | 擠成一面牆；拆成階段總覽＋細節，或改用表格 |
| 畫滿相依箭頭 | 箭頭穿過長條，變成難讀的流程圖 |
| 里程碑畫成一根短長條 | 讀者會以為它有持續時間；用菱形 |
| 為了放名字把任務拉長 | x 不再跟時間成比例，時程失真 |
| 沒有焦點任務 | 讀者看不出哪一段卡住整體時程 |
| 排程沒有來源 | 圖看起來像承諾，實際只是猜測 |

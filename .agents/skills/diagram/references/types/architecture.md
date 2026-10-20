# 架構圖（Architecture）

**適合：** 系統總覽、元件之間怎麼連、部署在哪個邊界裡。一張快照，不講時間順序（要講順序用 `sequence.md` 或逐步播放）。

**不適合：** 只是列出用了哪些技術（用條列）；元件少於 3 個（一句話說完）。

## 版面

- 主要流向選一個：左 → 右，或上 → 下，整張圖維持同一個方向。
- 依層級或信任邊界分組：使用者端 → 服務 → 資料。同一層的節點對齊在同一欄或同一列。
- 用 `dg-zone` 框出部署邊界或信任邊界，左上角放 `dg-tag` 標籤；框的上緣到第一個節點至少留 28，標籤才放得下。平行的邊界最多 3 個，更多就改用泳道圖。
- accent 給 1–2 個：最關鍵的整合點或主要的資料儲存。
- 儲存類節點用 `dg-box--store`，外部服務用 `dg-box--link`，選配元件用 `dg-box--ghost`。

## 連線

- 同步呼叫用實線，回應、非同步、排程用虛線（`dg-line--dashed`）。
- 從一個框分出多條線時，照「同一邊多條線要分開接」把接點平均分開（`primitives.md` 規則 4）。
- 目的地明顯在上方或下方時，從側邊出發、轉一次彎、從目的地的上緣或下緣進入；不要從上緣出發走水平線（會貼著框線，看起來像從角落長出來）。
- 標籤只標「看位置猜不到」的關係，例如通訊協定（HTTPS）、資料內容（embedding）。每條線都標會變成噪音。

## 範例

````markdown
```diagram
title: quidproquo 的執行架構
desc: 讀者的請求進入 Cloudflare 上的 Astro Worker，再由 Worker 讀寫 D1、Vectorize 與 Workers AI。
caption: 簡化示意：省略 KV session 與 Pagefind 靜態搜尋。
---
<svg viewBox="0 0 640 452">
  <rect class="dg-zone" x="192" y="40" width="428" height="340" rx="8"/>
  <text class="dg-tag" x="208" y="62" dominant-baseline="central">CLOUDFLARE</text>

  <path class="dg-line dg-line--link" d="M140 212H206" marker-end="url(#arrow-link)"/>
  <path class="dg-line" d="M368 196H396Q404 196 404 188V116Q404 108 412 108H434" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M368 212H434" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M368 228H396Q404 228 404 236V308Q404 316 412 316H434" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="20" y="180" width="120" height="64" rx="6"/>
  <text class="dg-label" x="80" y="212" text-anchor="middle" dominant-baseline="central">讀者瀏覽器</text>

  <rect class="dg-box dg-box--accent" x="212" y="176" width="156" height="72" rx="6"/>
  <text class="dg-label" x="290" y="202" text-anchor="middle" dominant-baseline="central">Astro Worker</text>
  <text class="dg-sub" x="290" y="224" text-anchor="middle" dominant-baseline="central">SSR・API・排程</text>

  <rect class="dg-box dg-box--store" x="440" y="80" width="160" height="56" rx="6"/>
  <text class="dg-label" x="520" y="100" text-anchor="middle" dominant-baseline="central">D1</text>
  <text class="dg-sub" x="520" y="120" text-anchor="middle" dominant-baseline="central">文章與留言（SQLite）</text>

  <rect class="dg-box dg-box--store" x="440" y="184" width="160" height="56" rx="6"/>
  <text class="dg-label" x="520" y="204" text-anchor="middle" dominant-baseline="central">Vectorize</text>
  <text class="dg-sub" x="520" y="224" text-anchor="middle" dominant-baseline="central">文章 embedding</text>

  <rect class="dg-box" x="440" y="288" width="160" height="56" rx="6"/>
  <text class="dg-label" x="520" y="308" text-anchor="middle" dominant-baseline="central">Workers AI</text>
  <text class="dg-sub" x="520" y="328" text-anchor="middle" dominant-baseline="central">產生 embedding 與回答</text>

  <text class="dg-edge" x="166" y="198" text-anchor="middle" dominant-baseline="central">HTTPS</text>

  <line class="dg-rule" x1="20" y1="404" x2="620" y2="404"/>
  <text class="dg-tag" x="20" y="428" dominant-baseline="central">圖例</text>
  <rect class="dg-box dg-box--accent" x="72" y="420" width="16" height="16" rx="3"/>
  <text class="dg-small" x="96" y="428" dominant-baseline="central">核心服務</text>
  <rect class="dg-box dg-box--store" x="196" y="420" width="16" height="16" rx="3"/>
  <text class="dg-small" x="220" y="428" dominant-baseline="central">資料儲存</text>
  <rect class="dg-zone" x="320" y="420" width="16" height="16" rx="3"/>
  <text class="dg-small" x="344" y="428" dominant-baseline="central">部署邊界</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 每個節點同樣大小、同樣樣式 | 看不出哪個是重點 |
| 線斜著連 | 違反規則 1，畫面變亂 |
| 每條線都有標籤 | 真正重要的標籤被淹沒 |
| 把技術品牌 logo 當節點 | 讀者要的是「它在系統裡做什麼」，副標寫用途 |
| 超過 9 個節點 | 拆成總覽圖＋其中一塊的細節圖 |

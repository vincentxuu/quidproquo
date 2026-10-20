# 金字塔／漏斗（Pyramid／Funnel）

**適合：**
- **金字塔（尖端朝上）**：有排序的層級，越往上越少、越稀有或越昂貴。例如測試金字塔、需求層次、內容的投入層級。
- **漏斗（尖端朝下）**：一路流失的轉換，每一層都是上一層剩下的。例如註冊轉換、招募流程、檢索後一路篩選的候選文件。

**不適合：** 各層沒有大小或先後關係（用條列或分層圖 `layers.md`）；只是上下層的父子關係（用樹狀圖 `tree.md`）；要精確比較數值（用 `dataviz` 的長條圖）。

## 先選方向

- 金字塔：底部最寬、最基礎；尖端最窄、最少。
- 漏斗：頂端最寬（進來的全部）；底部最窄（最後留下的）。
- 一張圖只選一個方向，不要混用。

## 版面

- 3–6 層。每層是一個 4 個頂點的 `<polygon>`（金字塔頂端可以是三角形），套 `dg-box`；不要每層換一種顏色。
- 每層同高（約 96–104），層與層之間留 4 的縫，比共用邊線乾淨。
- 寬度從底到頂（漏斗是從頂到底）**線性**遞減，兩側斜邊要是同一個斜率：先定好底寬和高度，各層的左右 x 用同一個比例算出來。
- 每層裡面放兩行字：名稱用 `dg-label`、說明用 `dg-sub`，水平置中。最窄那一層要先估字寬：中文 15 字級每字 15 寬，左右各留 16 以上，放不下就縮短名稱（範例把「端對端測試」縮成「端對端」）。
- 側邊註記（選填）用 `dg-small`，放在該層斜邊外側 16 處、和該層名稱同高。漏斗的流失率（`−40%`）就放這裡。
- 方向感可以用一條 `dg-axis` 箭頭放在左側，只在箭頭的尖端旁邊寫一句短標籤，**橫著寫**，不要轉 90 度。
- accent 只給**一層**：文章論點所在的那層。價值金字塔通常是尖端，漏斗通常是最後的轉換層或卡住的那一層；測試金字塔要講的是「大部分測試放在底層」，所以給底層。

## 改成漏斗

範例是金字塔。要畫漏斗時：

- 把多邊形上下翻過來：最寬的在上，往下逐層變窄，最後一層是倒梯形（不要收成尖點，留得下文字）。
- 寬度要**誠實**：和數量成比例。數量差太多、最後一層窄到放不下字時，名稱和數字移到右側註記，梯形本身照比例畫。
- 每層的數字用 `dg-big`，放在名稱上方；名稱改成 `dg-sub`。流失率寫在兩層之間的右側，`dg-small`。
- 數字沒有來源就不要放；只是說明概念時，數字寫成整數並在 `caption` 註明「示意」。

## 範例

````markdown
```diagram
title: 測試金字塔
desc: 單元測試數量最多、跑得最快，整合測試次之，端對端測試最少也最慢；大部分測試應該放在底層。
caption: 示意：層的寬度表示數量的多寡，不是實際比例。
---
<svg viewBox="0 0 640 364">
  <path class="dg-axis" d="M40 344V56" marker-end="url(#arrow)"/>
  <text class="dg-small" x="52" y="56" dominant-baseline="central">越往上越慢、越貴</text>

  <polygon class="dg-box" points="320,32 392,132 248,132"/>
  <polygon class="dg-box" points="240,136 400,136 476,236 164,236"/>
  <polygon class="dg-box dg-box--accent" points="160,240 480,240 560,344 80,344"/>

  <text class="dg-label" x="320" y="98" text-anchor="middle" dominant-baseline="central">端對端</text>
  <text class="dg-sub" x="320" y="118" text-anchor="middle" dominant-baseline="central">模擬使用者操作</text>

  <text class="dg-label" x="320" y="176" text-anchor="middle" dominant-baseline="central">整合測試</text>
  <text class="dg-sub" x="320" y="198" text-anchor="middle" dominant-baseline="central">模組之間接起來測</text>

  <text class="dg-label dg-text--accent" x="320" y="280" text-anchor="middle" dominant-baseline="central">單元測試</text>
  <text class="dg-sub" x="320" y="304" text-anchor="middle" dominant-baseline="central">一個函式、一個類別</text>

  <text class="dg-small" x="388" y="98" dominant-baseline="central">少量</text>
  <text class="dg-small" x="456" y="176" dominant-baseline="central">適量</text>
  <text class="dg-small" x="536" y="280" dominant-baseline="central">大量</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 7 層以上 | 每層薄到放不下字；合併相近的層，或拆成兩張 |
| 沒有大小或先後關係的東西畫成金字塔 | 形狀暗示了不存在的排序 |
| 漏斗各層等寬遞減，但數字差很多 | 寬度說謊；寬度要和數量成比例 |
| 每層一種顏色 | 搶走「寬窄」這個訊號 |
| accent 給了不是論點所在的層 | 讀者記住錯的重點 |
| 一張圖同時有正金字塔和倒漏斗 | 方向互相抵銷 |
| 側邊標籤轉 90 度直寫 | 讀不了；橫著寫、放在箭頭尖端旁 |

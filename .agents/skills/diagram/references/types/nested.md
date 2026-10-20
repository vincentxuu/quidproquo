# 巢狀圖（Nested）

**適合：** 一層包一層的範圍——權限邊界、信任區、網路隔離、設定的套用範圍、爆炸半徑。外層比較廣、內層比較具體，讀者要看的是「這個東西在哪幾層範圍裡面、每一層管什麼」。

**不適合：** 層與層之間是「上面依賴下面」而不是「外面包住裡面」（用 `layers.md`）；要講「誰拆成誰」的父子關係（用 `tree.md`）；範圍之間有部分重疊（用韋恩圖）；只有兩層（一句話說完）。

## 版面

- 3–5 層圓角框（`rx="8"`），最內層最多 6 層，再多資訊會往中間擠到看不見。
- **內距固定。** 每一層左右各縮 20、上方縮 36（留給標籤）、下方縮 20，整張圖用同一組數字。內距不一致看起來像沒對齊，不像刻意設計。
- 標籤放在每一層的左上角：`dg-tag` 英文大寫範圍名稱（`VPC`、`PROJECT`），距框左緣 16、距上緣 18。右上角可以放一行 `dg-small`，用幾個字說這層管什麼（「計費、組織政策」）。
- 最外層用 `dg-zone`（虛線、無填色），表示「最寬的邊界」；中間各層用 `dg-box dg-box--store`（灰底）和 `dg-box`（卡片底）交替，相鄰兩層底色不同，框線才分得開；最內層的焦點用 `dg-box dg-box--accent`。外層淡、內層實，讀者的眼睛自然往中間走。
- accent 只給最內層，或正文在討論的那一層，只標一層。
- 框裡只放屬於這個層級結構的東西。想在同一層並排放兩個兄弟範圍（例如公開與私有子網路）時，兩個框用同樣的內距並排，標籤規則不變；要放和範圍無關的元件，改畫架構圖。

## 連線

- 巢狀圖原則上不畫線：包含關係由框的位置表達。
- 真的要表達「流量從外面進到最內層」時，最多畫一條從圖外進入的線，垂直穿過各層上緣，標籤放在最外層之外。

## 範例

````markdown
```diagram
title: 一個雲端服務被幾層範圍包住
desc: 推論服務放在私有子網路裡，子網路屬於 VPC，VPC 屬於專案，專案屬於雲端帳號；每一層各管一種設定。
caption: 通用示意：各家雲端的層級名稱與切法不同（例如 AWS 沒有 project 這一層），概念相同。
---
<svg viewBox="0 0 640 336">
  <rect class="dg-zone" x="20" y="20" width="600" height="296" rx="8"/>
  <text class="dg-tag" x="36" y="38" dominant-baseline="central">CLOUD ACCOUNT</text>
  <text class="dg-small" x="604" y="38" text-anchor="end" dominant-baseline="central">帳單、組織政策</text>

  <rect class="dg-box dg-box--store" x="40" y="56" width="560" height="240" rx="8"/>
  <text class="dg-tag" x="56" y="74" dominant-baseline="central">PROJECT</text>
  <text class="dg-small" x="584" y="74" text-anchor="end" dominant-baseline="central">IAM 權限、配額</text>

  <rect class="dg-box" x="60" y="92" width="520" height="184" rx="8"/>
  <text class="dg-tag" x="76" y="110" dominant-baseline="central">VPC</text>
  <text class="dg-small" x="564" y="110" text-anchor="end" dominant-baseline="central">IP 範圍、防火牆規則</text>

  <rect class="dg-box dg-box--store" x="80" y="128" width="480" height="128" rx="8"/>
  <text class="dg-tag" x="96" y="146" dominant-baseline="central">PRIVATE SUBNET</text>
  <text class="dg-small" x="544" y="146" text-anchor="end" dominant-baseline="central">無公開 IP、路由表</text>

  <rect class="dg-box dg-box--accent" x="100" y="164" width="440" height="72" rx="6"/>
  <text class="dg-label" x="320" y="190" text-anchor="middle" dominant-baseline="central">推論服務</text>
  <text class="dg-sub" x="320" y="212" text-anchor="middle" dominant-baseline="central">只接受 VPC 內部流量</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 超過 6 層 | 最內層擠成一條線，資訊看不見 |
| 每層內距不同 | 看起來是畫歪了，不是刻意的層級 |
| 每一層都標 accent 或都用同一種樣式 | 層級塌掉，讀者找不到焦點 |
| 標籤放在框正中間 | 撞到內層的框；一律左上角 |
| 框裡塞跟範圍無關的元件 | 混了兩種圖；改畫架構圖，或另外畫一張 |
| 用巢狀表達依賴或順序 | 「包住」不等於「依賴」；有上下依賴用分層圖 |

---
title: "Stanford CS109 Lecture 9｜Normal Distribution：標準化、Φ 與 continuity correction"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 10
tldr: "標準化把不同尺度的 Normal 變數轉成 Z；Φ、線性轉換與 continuity correction 再把區間與大型 binomial 變成可計算的機率。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 9：Normal、Z-score、Phi、線性轉換、binomial approximation 與 continuity correction。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-09-normal-distribution-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 10 篇，對應 **Summer 2026 Lecture 9: The Normal Distribution**，日期為 7 月 6 日，講者是 Chris Gregg。本文依 Summer [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture09-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture09-AnswerKey.pdf)、[LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture09-LLMPrompts.pdf)及跨 offering 共用的 Spring-dated 官方讀本 [Normal](https://probabilitycoders.stanford.edu/spr26/normal) 與 [binomial approximation](https://probabilitycoders.stanford.edu/spr26/binomial_approx) 章節整理。Canvas 錄影未公開，因此不重建課堂口述。

原始 worksheet 共兩頁：P1–P3 在第一頁，P4–P7 與 challenge 在第二頁，題號完整。P5 與 challenge 屬 problem set，公開 answer key 刻意隱藏解答；本文會明確區分官方刊出的答案與依公開題目自行推導的部分。

## P1：用 Exponential 複習銜接

Server 下一次 request 的等待時間是 `T~Exp(0.5)` 小時，因此

```text
P(T<2) = 1-e^(-0.5×2) = 1-e^-1 ≈ 0.632
E[T] = 1/0.5 = 2 hours
```

已等三小時仍沒有 request，再兩小時仍未到的機率由 memorylessness 得到：

```text
P(T>5 | T>3) = P(T>2) = e^-1 ≈ 0.368
```

這題結束上一講的等待時間模型，接著轉向能描述量測誤差、自然變異與許多小效果總和的 Normal distribution。

## P2：Normal 的參數與標準化

令考試分數 `X~N(70,16)`。CS109 記號的第二個參數是 variance `σ²=16`，所以 mean 是 `70`，standard deviation 是 `σ=4`。許多程式庫要求傳入 `σ` 而非 `σ²`，這是 worksheet 特別提醒的介面陷阱。

原始分數 74 的 z-score 是

```text
z = (74-70)/4 = 1
Z = (X-μ)/σ ~ N(0,1)
```

`z=1` 表示分數位於平均值上一個 standard deviation。令 `Φ(z)=P(Z≤z)` 為 standard-normal CDF，便有 `P(X<74)=Φ(1)≈0.841`。標準化不是近似，而是 Normal 的精確線性轉換。

## P3：Φ 的對稱性與區間

Standard normal 以零為中心對稱，因此

```text
Φ(-a) = 1-Φ(a)
```

一個 standard deviation 內的機率為

```text
P(-1≤Z≤1) = Φ(1)-Φ(-1)
           = 2Φ(1)-1
           ≈ 0.683
```

這是 68–95–99.7 rule 的第一段。右尾則用 complement：已知 `Φ(1.31)=0.9049`，所以 `P(Z>1.31)=1-0.9049=0.0951`。常見錯誤是把 CDF 當右尾；先畫出事件位於曲線哪一側，再決定用 `Φ`、`1-Φ` 或兩個 CDF 相減。

## P4：Submarine panel 的雙側規格

Panel 厚度 `X~N(500,36)` microns，因此 `σ=6`。規格要求落在 490 到 510，兩端的 z-score 為

```text
z490 = (490-500)/6 ≈ -1.667
z510 = (510-500)/6 ≈  1.667
```

區間機率是

```text
P(490≤X≤510)
= Φ(1.667)-Φ(-1.667)
= 2Φ(1.667)-1
≈ 0.904
```

約 90.4% 的 panels 符合規格。這題把 P2 的標準化與 P3 的對稱性合在一起：上下界分別轉成 z，再以右端 CDF 減左端 CDF。

## P5：Website Analytics 的右尾

每週訪客數 `X~N(2200,52900)`，因此 `σ=√52900=230`。題目問超過 2,000 人：

```text
P(X>2000)
= 1-Φ((2000-2200)/230)
= Φ(200/230)
≈ 0.808
```

門檻低於平均值，所以答案應大於一半；這是代入前就能做的方向檢查。P5 是 pset3 題，公開 answer key 不刊解答；`0.808` 是依公開題目與 standard-normal CDF 自行計算。

## P6：用 Normal 近似大型 Binomial

新網站設計測試一百萬名 users。在「設計無效果」假設下，每人改善機率為 `0.5`，所以 `X~Bin(10⁶,0.5)`。近似 Normal 的參數是

```text
μ = np = 500,000
σ² = np(1-p) = 250,000
σ = 500
```

CEO 在 `X≥501,000` 時背書。離散整數 501,000 在連續曲線中對應從 500,999.5 開始，因此 continuity correction 給出

```text
P(X≥501,000)
≈ 1-Φ((500,999.5-500,000)/500)
= 1-Φ(1.999)
≈ 0.0228
```

即使設計沒有真實效果，仍約有 2.3% 機率因抽樣波動達到背書門檻。這裡 `p=0.5` 且 `np(1-p)=250,000` 遠大於十，屬大型 `n`、moderate `p` 的 Normal regime。Poisson approximation 比較適合大型 `n`、極小 `p` 的稀有事件。

## P7：continuity correction 到底修什麼

公平硬幣擲一百次，heads 數 `X~Bin(100,0.5)`，近似為 `N(50,25)`。離散的 `X=55` 是一根寬度一的 bar，在連續模型中應保留整根 bar：

```text
P(X=55) ≈ P(54.5<Y<55.5)
        = Φ((55.5-50)/5)-Φ((54.5-50)/5)
```

而 `X≤60` 包含 60 的整根 bar，所以右邊界移到 60.5：

```text
P(X≤60) ≈ Φ((60.5-50)/5) = Φ(2.1)
```

記憶 `±0.5` 不如先畫整數 bar：`≤k` 取到 `k+0.5`，`≥k` 從 `k-0.5` 開始，`=k` 則包住 `[k-0.5,k+0.5]`。

## Challenge：independent Normals 的線性組合

令獨立的 `X~N(1,2)`、`Y~N(1,2)`，且 `W=2X+Y`。Normal 的線性組合仍是 Normal；mean 依係數線性相加，variance 必須平方係數：

```text
E[W] = 2E[X]+E[Y] = 3
Var(W) = 2²Var(X)+Var(Y) = 4×2+2 = 10
W ~ N(3,10)
```

因此

```text
P(W<5) = Φ((5-3)/√10) ≈ Φ(0.632) ≈ 0.736
```

獨立性讓 covariance 項為零；若 `X`、`Y` 不獨立，variance 還需加入 `2ab Cov(X,Y)`。Challenge 屬 pset4，公開 key 同樣不刊解答，以上是依題目直接推導。

## 如何使用 LLM Learning Guide

官方 guide 的六個 concept 是 Normal 參數、標準化與 `Φ`、對稱與區間、線性轉換與 sums、binomial 的 Normal approximation、continuity correction。測驗時先分清 variance/SD，再畫事件方向，最後才查 `Φ`。做近似時另寫一行選擇 Normal 而非 Poisson 的理由，並畫出離散 bar 的半格修正。

## 材料邊界

- 本文覆蓋兩頁 worksheet 的 P1–P7、optional challenge 與 LLM guide 六個 concept；題號沒有跨頁缺漏。
- P5 與 challenge 是 problem-set 題，官方公開 answer key 刻意省略解答；本文只依公開題目自行推導。
- Canvas 錄影未公開，不推測其中額外例子或講者說法。
- Worksheet 與 guide 各兩頁，採短材料例外，以逐題完整為準；維持 `draft: true` 等待獨立審稿。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 9: The Normal Distribution](https://web.stanford.edu/class/cs109/lectures/9-Gaussian)
- [Lecture 9 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture09-Worksheet.pdf)
- [Lecture 9 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture09-AnswerKey.pdf)
- [Lecture 9 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture09-LLMPrompts.pdf)
- [Probability for Computer Science: Normal](https://probabilitycoders.stanford.edu/spr26/normal)
- [Probability for Computer Science: Normal approximation to Binomial](https://probabilitycoders.stanford.edu/spr26/binomial_approx)

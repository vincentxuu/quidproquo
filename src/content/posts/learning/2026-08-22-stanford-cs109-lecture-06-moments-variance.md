---
title: "Stanford CS109 Lecture 6｜Moments：期望值、LOTUS 與線性性"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 7
tldr: "期望值把分布壓成加權平均；LOTUS 處理變換後的值，linearity 則讓隨機變數的和即使不獨立也能直接計算。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 6：期望值、LOTUS、線性變換與期望值的線性性。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-06-moments-variance-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 7 篇，對應 **Summer 2026 Lecture 6: Moments (Expectation)**，官方日期是 6 月 30 日，講者 Chris Gregg。Summer agenda 依[官方 schedule](https://web.stanford.edu/class/cs109/schedule.html)、[worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture06-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture06-AnswerKey.pdf)與 [LLM learning guide](https://web.stanford.edu/class/cs109/worksheets/Lecture06-LLMPrompts.pdf)確定；`/spr26` [課程讀本](https://probabilitycoders.stanford.edu/spr26)是跨 offering 共用的 Spring-dated 概念參考，不是 Summer 講次證據。Canvas 錄影未公開，因此不重建課堂口述。

## 從分布到一個可運算的摘要

前一講建立 PMF，這一講問下一步：知道每個值的機率後，怎麼用一個數字描述長期中心？離散隨機變數的期望值是

```text
E[X] = Σx x P(X=x)
```

它是依機率加權的平均，不必是 X 真能取到的值。公平六面骰的期望是 3.5，骰子永遠不會顯示 3.5；這個數字描述大量重複擲骰後的每次平均。

## Problem 1：先把 Binomial PMF 接回來

五題四選一全部亂猜，X~Bin(5,0.25)：

```text
P(X=k) = C(5,k)(0.25)^k(0.75)^(5-k)
```

恰答對兩題代入 k=2。至少答對一題則算補事件 `1-P(X=0)=1-(0.75)^5`。這題不只是複習；它提醒後面 `E[Bin(n,p)]=np` 的 X 是「成功次數」，不是完成第一次成功所需的試驗數。

## Problem 2：四個經典離散隨機變數

- 單次廣告是否點擊是 `Bern(0.01)`：只做一次試驗，結果為 0 或 1。
- 每次配對成功率 0.2，直到第一次成功所需人數是 `Geo(0.2)`。
- 每球命中率 0.53，直到第三次命中所需出手數是 negative binomial，成功目標 r=3、單次成功率 p=0.53。
- 二十次公平擲幣的正面數是 `Bin(20,0.5)`。

辨認順序是：先看 X 計數的是成功次數還是等待時間，再看停止條件。Binomial 固定試驗次數；geometric 與 negative binomial 固定要等到第幾次成功。

## Problem 3：抽「班級」和抽「學生」不是同一個平均

公平骰的 PMF 直接給 `E[X]=(1+2+3+4+5+6)/6=3.5`。接著 worksheet 刻意安排三個大小為 5、10、150 的班級。

若先等機率挑一個班，平均班級大小是 `(5+10+150)/3=55`。若從 165 位學生中等機率挑一人，小班只提供 5 個被抽中的機會，大班提供 150 個；此時 X 的機率依班級人數加權，期望是 `(5²+10²+150²)/165`，約 137.1。

兩個問題的「隨機抽取單位」不同。學生經驗到的平均班級較大，不是算術矛盾，而是 size-biased sampling：大班學生更容易出現在以學生為單位的樣本。

## Problem 4：linearity 與 LOTUS 做不同工作

骰到 X 點，獎金 W=2X-1。linearity 直接給 `E[W]=2E[X]-1=6`，不用重新列 W 的 PMF。更一般地，`E[aX+b]=aE[X]+b`。

LOTUS（Law of the Unconscious Statistician）處理非線性函數：

```text
E[g(X)] = Σx g(x)P(X=x)
```

對公平骰，`E[X²]=(1²+2²+…+6²)/6=91/6`；但 `(E[X])²=12.25`。兩者不相等，因為先平方再平均與先平均再平方不是同一個運算。這個對比替下一講的 variance 鋪路，但不把 variance 誤列成本講 agenda。

## Problem 5：公式背後的等待直覺

經典期望是 `E[Bern(p)]=p`、`E[Bin(n,p)]=np`、`E[Geo(p)]=1/p`。Shaq 500 次出手、命中率 0.53，期望命中 265 球；提高十個百分點後，期望多 50 球。兩式都用 `np`，不必把 501 個 PMF 項目加完。

成功率 0.2 的 geometric 等待時間期望是 5。`1/p` 的直覺是長期每五次約出現一次成功；它不是保證第五次一定成功，也不是說 geometric 有上限。

## Problem 6：Daycare 的收入與分段成本

六名嬰兒各以 5/6 機率獨立出席，所以 `X~Bin(6,5/6)`。五或六人出席的機率是 `P(X=5)+P(X=6)`。每位收 50 美元時，收入 R=50X，故

```text
E[R] = 50E[X] = 50 × 6 × 5/6 = 250
```

人事成本不是單一線性函數：X≤4 時 200 美元，X≥5 時 400 美元。因此期望成本按兩個互斥區間加權：`200P(X≤4)+400P(X≥5)`。這正好對比 linearity 容易處理的收入與需要 LOTUS／分段事件處理的成本。

## Problem 7：linearity 不要求 independence

洗牌後令 Xi 表示第 i 張牌是否剛好在排序後的正確位置。每個 Xi 都是成功率 1/52 的 Bernoulli；這些指示變數彼此並不獨立，因為一張牌的位置會限制其他牌的位置。

但期望值仍可直接相加：

```text
E[X] = E[Σ Xi] = Σ E[Xi] = 52 × 1/52 = 1
```

所以隨機排列平均有一張牌 fixed point。這是本講最重要的工具性結論：計算聯合機率時相依性很麻煩，但計算總和的期望時，linearity 無條件成立。

Challenge 用同一招證明 binomial 期望。把成功總數寫成 n 個 Bernoulli indicator 的和，每個期望是 p，於是總期望是 np；完全不需要展開 binomial PMF。

## 材料缺口

- 本文完整覆蓋 worksheet 的七題與 optional challenge；短材料依實際 agenda 收束，不加入未在 artifacts 中出現的課堂例子。
- 公開錄影只在 Canvas，本文沒有使用；投影片存取狀態不取代 worksheet 證據。

## 參考資料

- [CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 6 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture06-Worksheet.pdf)
- [Lecture 6 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture06-AnswerKey.pdf)
- [Lecture 6 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture06-LLMPrompts.pdf)
- [Probability for Computer Science](https://probabilitycoders.stanford.edu/spr26)

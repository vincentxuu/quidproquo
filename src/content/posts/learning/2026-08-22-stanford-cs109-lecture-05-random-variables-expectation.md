---
title: "Stanford CS109 Lecture 5｜Random Variables and Expectation：隨機變數是把結果映成數字；期望值是加權平均，不保證會真的出現。"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 6
tldr: "隨機變數是把結果映成數字；期望值是加權平均，不保證會真的出現。"
description: "逐講導讀 Stanford CS109 Summer 2026 Lecture 5：隨機變數、PMF 與期望值，並標示官方公開材料與缺口。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-05-random-variables-expectation-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 6 篇，對應 **Stanford CS109, Summer 2026, Lecture 5**（Jun 29），官方 schedule 題目是 **Random Variables and Expectation**，講者為 Chris Gregg。本文以[官方 schedule](https://web.stanford.edu/class/cs109/schedule.html)、[講次頁](https://web.stanford.edu/class/cs109/lectures/5-Binomial)、[課堂習題](https://web.stanford.edu/class/cs109/worksheets/Lecture05-Worksheet.pdf)、[解答](https://web.stanford.edu/class/cs109/worksheets/Lecture05-AnswerKey.pdf)與 [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture05-LLMPrompts.pdf)確定 Summer agenda；講次頁與 `/spr26` [讀本](https://probabilitycoders.stanford.edu/spr26)只作為跨 offering 共用的 Spring-dated 概念參考。

本講材料完整度為 **L3**：Summer schedule 與題目 artifacts 確定 agenda，Spring-dated 共用頁面只補概念；Canvas 錄影未使用。

## Worksheet agenda：從 counting 走到 binomial PMF

第一題用十二人委員會複習 combination。四人委員會總數是 C(12,4)；恰兩位 senior 是 C(5,2)C(7,2)；全是 junior 是 C(7,4)。這些計數會直接變成 binomial PMF 裡的組合係數，但不放回抽樣本身不是 binomial。

三次公平硬幣把八個序列映成 Y=正面數。Y 的值只有 0、1、2、3，PMF 分別由對應序列數除以八得到；四個值相加必須為一。隨機變數壓縮了原始結果：HTH 與 THH 是不同 outcome，卻映到同一個 Y=2。

地震題給 P(X=k)=c/2^k。合法 PMF 的總和是 1，而從 k=1 起的幾何級數也等於 1，所以 c=1。接著 P(X=3)=1/8，P(X≤2)=1/2+1/4。這題要練的不是地震模型是否寫實，而是先做 normalization 再問事件機率。

辨認 binomial 要逐項檢查：固定 n 次試驗、每次只有 success/failure、成功率 p 固定、試驗獨立。獨立 bit 與廣告曝光符合；不放回抽五張牌的紅心數不符合，因為每抽一張都改變下一張成功率。恰三個 1 的機率由 C(8,3) 選成功位置，再乘 0.5³0.5⁵。

七台 server 各自以 0.8 存活，X~Bin(7,0.8)。失效事件 X<2 只含 X=0 與 X=1，正常機率用 1 減掉這兩項。這比直接加 X=2 到 7 短，也降低漏項機會。

觀眾題中只有二十位 expert 進入 X，因此 X~Bin(20,0.7)，不是把兩百人全放進 n。恰十四票與至少十八票都從同一 PMF 取不同集合。Best-of-7 題若假定七場全打，勝系列是 X≥4；不能只選四個勝場後把其餘寫成 anything，因為不同選定四場的事件會在五勝、六勝、七勝結果上重疊。

Galton board 把每層向右視為 Bernoulli trial，五層後桶位就是向右次數。C(5,k)/2⁵ 的對稱來自 C(5,k)=C(5,5-k)，中央桶較高則來自能通往中央的路徑較多。

## Binomial 式子的每一塊

C(n,k) 選出成功出現在哪 k 次；p^k 是那些成功同時發生；(1-p)^(n-k) 是其餘失敗；相乘得到一種成功位置集合的機率，再由組合係數加總所有互斥位置集合。只背整式，最容易漏掉的正是四個建模條件。
## 材料缺口

- Spring-dated 共用 Binomial 頁可核對 PMF 與建模條件，但不能證明 Summer 課堂流程。
- 課程錄影限 Canvas，未使用。
- 本文不使用搜尋摘要或未存取的 Canvas 內容，也不推測課堂口述例子。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 5: Random Variables and Expectation](https://web.stanford.edu/class/cs109/lectures/5-Binomial)
- [Probability for Computer Science course reader](https://probabilitycoders.stanford.edu/spr26)
- [Lecture 5 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture05-Worksheet.pdf)
- [Lecture 5 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture05-AnswerKey.pdf)
- [Lecture 5 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture05-LLMPrompts.pdf)

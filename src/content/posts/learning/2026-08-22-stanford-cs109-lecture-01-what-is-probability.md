---
title: "Stanford CS109 Lecture 1｜What is Probability?：先把隨機問題列成結果集合，再談事件的機率。"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 2
tldr: "先把隨機問題列成結果集合，再談事件的機率。"
description: "逐講導讀 Stanford CS109 Summer 2026 Lecture 1：樣本空間、事件與三條公理，並標示官方公開材料與缺口。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-01-what-is-probability-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 2 篇，對應 **Stanford CS109, Summer 2026, Lecture 1**（Jun 22），官方 schedule 題目是 **What is Probability?**，講者為 Chris Gregg。本文以[官方 schedule](https://web.stanford.edu/class/cs109/schedule.html)、[講次頁](https://web.stanford.edu/class/cs109/lectures/1-Welcome)、[課堂習題](https://web.stanford.edu/class/cs109/worksheets/Lecture01-Worksheet.pdf)、[解答](https://web.stanford.edu/class/cs109/worksheets/Lecture01-AnswerKey.pdf)與 [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture01-LLMPrompts.pdf)確定 Summer agenda；講次頁與 `/spr26` [讀本](https://probabilitycoders.stanford.edu/spr26)只作為跨 offering 共用的 Spring-dated 概念參考。

本講材料完整度為 **L3**：Summer schedule 與題目 artifacts 確定 agenda，Spring-dated 共用頁面只補概念；Canvas 錄影未使用。

## Worksheet agenda：從列結果到公理

第一題用三次擲硬幣固定「事件是樣本空間的子集合」。八個序列是等可能的原子結果；「至少兩次正面」包含 HHH、HHT、HTH、THH，「第一次反面」包含 THH、THT、TTH、TTT。兩事件交集是 THH，因此不是互斥。這個小題同時要求三個動作：完整列出樣本空間、把自然語言翻成集合、用交集判斷互斥，而不是看兩句話聽起來是否衝突。

第二題刻意設下「點數和」陷阱。兩顆可區分骰子的基本結果是 36 個有序對；和為 7 有六個，和為 2 只有一個。把 2 到 12 當成十一個結果會錯，因為那些和並不等可能。這也是等可能公式的使用條件：只有在原子結果等可能時，才能用有利結果數除以總結果數。

第三題把公理落在撲克牌。紅心有 13 張，Ace 有 4 張，但紅心 Ace 同時屬於兩個事件，所以聯集不能直接相加；要扣掉被算兩次的交集。Ace 與 J/Q/K 則互斥，可以直接相加。這讓第三條公理的限制變得具體：可加性首先保證互斥事件相加；一般事件的聯集公式要另外處理重疊。

第四題用十二格轉盤比較直接數聯集與補事件。倍數 3 和不大於 4 在結果 3 重疊；「不是 7」則直接用 1 減掉 1/12。補事件不是小技巧，而是把難數的大片集合換成容易數的小集合。

第五題區分機率的長期頻率詮釋與公理限制。365 天裡 219 個晴天給的是資料上的估計，不是下一天的保證。機率 1.2 違反非負與上界；兩個事件的機率相加超過 1 卻不必然違法，因為它們可能重疊。若 P(E)=0.4，補事件精確等於 0.6，不是某個可變的上限。

## 六個 LLM guide 概念如何使用

官方 guide 依序要求 sample space、event、equally likely outcomes、long-run frequency、axioms、complement。正確用法是先自己作答，再請模型檢查遺漏的原子結果或不等可能陷阱。尤其骰子點數和那題，應要求模型指出「哪一層結果才等可能」，而不是只索取分數。
## 材料缺口

- Spring-dated 共用 welcome 頁可核對樣本空間與公理用語，但不能證明 Summer 課堂流程。
- 課程錄影限 Canvas，未使用。
- 本文不使用搜尋摘要或未存取的 Canvas 內容，也不推測課堂口述例子。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 1: What is Probability?](https://web.stanford.edu/class/cs109/lectures/1-Welcome)
- [Probability for Computer Science course reader](https://probabilitycoders.stanford.edu/spr26)
- [Lecture 1 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture01-Worksheet.pdf)
- [Lecture 1 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture01-AnswerKey.pdf)
- [Lecture 1 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture01-LLMPrompts.pdf)

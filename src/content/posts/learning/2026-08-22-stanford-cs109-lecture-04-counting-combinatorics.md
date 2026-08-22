---
title: "Stanford CS109 Lecture 4｜Counting and Combinatorics：先判斷順序是否重要、元素能否重複，公式才不會套錯。"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 5
tldr: "先判斷順序是否重要、元素能否重複，公式才不會套錯。"
description: "逐講導讀 Stanford CS109 Summer 2026 Lecture 4：乘法原理、排列、組合與重複計數，並標示官方公開材料與缺口。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-04-counting-combinatorics-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 5 篇，對應 **Stanford CS109, Summer 2026, Lecture 4**（Jun 25），官方 schedule 題目是 **Counting and Combinatorics**，講者為 Chris Gregg。本文以[官方 schedule](https://web.stanford.edu/class/cs109/schedule.html)、[講次頁](https://web.stanford.edu/class/cs109/lectures/4-Counting)、[課堂習題](https://web.stanford.edu/class/cs109/worksheets/Lecture04-Worksheet.pdf)、[解答](https://web.stanford.edu/class/cs109/worksheets/Lecture04-AnswerKey.pdf)與 [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture04-LLMPrompts.pdf)確定 Summer agenda；講次頁與 `/spr26` [讀本](https://probabilitycoders.stanford.edu/spr26)只作為跨 offering 共用的 Spring-dated 概念參考。

本講材料完整度為 **L3**：Summer schedule 與題目 artifacts 確定 agenda，Spring-dated 共用頁面只補概念；Canvas 錄影未使用。

## Worksheet agenda：先問順序與重複，再選公式

三元件服務題先複習獨立與補事件：全數正常是 0.95³，至少一個故障是 1-0.95³。這也預告 counting 的基本策略——直接數困難時，改數補集合。

四位解鎖碼允許重複時是 10⁴；不重複時是 10·9·8·7。已知六個不同數字但不知道順序，排列數是 6!。product rule 的重點不是一直乘，而是把建構結果拆成依序選擇，並在每一步更新剩餘選項。

Fantasy draft 題同時有類別限制與排名。恰好兩位 goalkeeper：先選並排列兩位守門員所在的人選，再選其餘四位非守門員，最後處理六人的排名；等價計數法必須得到同一答案。若六位中四位 forward，再從六位等可能選三位 starter，全是 forward 的機率是 C(4,3)/C(6,3)。draft 有順序，starter committee 沒順序，正是本講要抓的切換。

BANANA 的六個字母含 A 三個、N 兩個，因此是 6!/(3!2!)；MISSISSIPPI 則依 I、S、P 的重複數除掉各群內交換。分母不是神祕修正，而是每個可見字串在全 distinct 排列裡被重複生成的次數。

五張牌手牌、十人選三人、長度十且恰有三個 1 的 bit string 都是 combination：只需選位置或成員，不在意列出的順序。Flush 的有利手牌是四個花色乘每個花色選五張；four of a kind 先選 rank，再選第五張非該四張的牌。分母都用 C(52,5)，因為基本結果是等可能手牌而非發牌序列。

十次硬幣的樣本空間是 2¹⁰。恰四次正面只需選四個正面位置，機率是 C(10,4)/2¹⁰；至少八次正面要把 k=8、9、10 三個互斥計數相加。恰兩張 Ace 的 challenge 同樣分兩步：從四張 Ace 選二，再從 48 張非 Ace 選三。

## 一張決策表

若結果按步驟建立，用 product rule；若使用全部物件且順序重要，用 permutation；若只選子集且順序不重要，用 combination；若有重複物件，除掉群內交換；求機率前最後確認分母中的基本結果是否等可能。
## 材料缺口

- Spring-dated 共用 counting 頁可核對 product rule 與 combination 記號，但不能證明 Summer 課堂流程。
- 課程錄影限 Canvas，未使用。
- 本文不使用搜尋摘要或未存取的 Canvas 內容，也不推測課堂口述例子。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 4: Counting and Combinatorics](https://web.stanford.edu/class/cs109/lectures/4-Counting)
- [Probability for Computer Science course reader](https://probabilitycoders.stanford.edu/spr26)
- [Lecture 4 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture04-Worksheet.pdf)
- [Lecture 4 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture04-AnswerKey.pdf)
- [Lecture 4 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture04-LLMPrompts.pdf)

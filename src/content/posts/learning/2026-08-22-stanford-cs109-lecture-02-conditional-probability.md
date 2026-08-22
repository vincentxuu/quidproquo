---
title: "Stanford CS109 Lecture 2｜Conditional Probability：條件不是裝飾，而是把樣本空間縮到已知資訊仍允許的部分。"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 3
tldr: "條件不是裝飾，而是把樣本空間縮到已知資訊仍允許的部分。"
description: "逐講導讀 Stanford CS109 Summer 2026 Lecture 2：條件機率、乘法法則與全機率公式，並標示官方公開材料與缺口。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-02-conditional-probability-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 3 篇，對應 **Stanford CS109, Summer 2026, Lecture 2**（Jun 23），官方 schedule 題目是 **Conditional Probability**，講者為 Chris Gregg。本文以[官方 schedule](https://web.stanford.edu/class/cs109/schedule.html)、[講次頁](https://web.stanford.edu/class/cs109/lectures/2-ConditioningAndBayes)、[課堂習題](https://web.stanford.edu/class/cs109/worksheets/Lecture02-Worksheet.pdf)、[解答](https://web.stanford.edu/class/cs109/worksheets/Lecture02-AnswerKey.pdf)與 [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture02-LLMPrompts.pdf)確定 Summer agenda；講次頁與 `/spr26` [讀本](https://probabilitycoders.stanford.edu/spr26)只作為跨 offering 共用的 Spring-dated 概念參考。

本講材料完整度為 **L3**：Summer schedule 與題目 artifacts 確定 agenda，Spring-dated 共用頁面只補概念；Canvas 錄影未使用。

## Worksheet agenda：條件、chain rule、全機率與 Bayes

第一題先用單顆骰子複習集合運算：偶數與大於 3 的交集不是空集合，聯集要避免重複計數，補事件可直接處理「不是 6」。這段複習的目的，是讓條件機率分子 P(E∩F) 有清楚的集合意義。

第二題比較三個問題。無條件下，兩骰和為 8 有五個有序對；已知第一顆是 5 時，條件樣本空間只剩六個結果，其中只有第二顆為 3 成功；已知至少一顆是 5 時，條件集合有十一個結果，成功的有 (5,3) 與 (3,5)。兩個條件都提到 5，答案卻不同，因為被保留下來的樣本空間不同。

第三題用不放回抽牌呈現 chain rule。兩張都是 Ace 的機率是 4/52 乘 3/51；King 後接 Queen 是 4/52 乘 4/51；前三張都是紅心則繼續乘 13/52、12/51、11/50。每抽一張，後一項的分母與有利張數都要依已知結果更新。這正是相依，不是公式麻煩。

第四、五題是一棵 spam probability tree。先驗 P(spam)=0.3，likelihood P(free|spam)=0.6；ham 分支是 0.7 與 0.1。全機率公式把兩條通往 free 的路徑相加，得到 P(free)=0.25。Bayes 再取 spam-and-free 的 0.18 除以 0.25，得到 posterior 0.72。prior、likelihood、evidence、posterior 各有不同角色，不能只記分子分母的位置。

第六題用疾病盛行率展示 base-rate effect。一千人中約十人有病，其中約 9.8 人陽性；990 位健康者中約 49.5 人偽陽性。於是陽性者大多仍來自龐大的健康族群。敏感度高不等於 positive predictive value 高，後者必須把盛行率放進分母。

## 一棵樹如何統一四條公式

沿樹枝相乘是 chain rule；通往同一葉標籤的互斥路徑相加是 total probability；觀察葉標籤後反問來自哪條上游分支，就是 Bayes。把公式畫回樹上，比背四個孤立等式穩定。
## 材料缺口

- Spring-dated 共用 conditioning 頁可核對公式與 Bayes 用語，但不能證明 Summer 課堂流程。
- 課程錄影限 Canvas，未使用。
- 本文不使用搜尋摘要或未存取的 Canvas 內容，也不推測課堂口述例子。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 2: Conditional Probability](https://web.stanford.edu/class/cs109/lectures/2-ConditioningAndBayes)
- [Probability for Computer Science course reader](https://probabilitycoders.stanford.edu/spr26)
- [Lecture 2 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture02-Worksheet.pdf)
- [Lecture 2 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture02-AnswerKey.pdf)
- [Lecture 2 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture02-LLMPrompts.pdf)

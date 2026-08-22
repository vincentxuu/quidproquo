---
title: "Stanford CS109 Lecture 3｜Bayes Theorem：Bayes 定理把容易建模的生成方向，翻成真正想問的推論方向。"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 4
tldr: "Bayes 定理把容易建模的生成方向，翻成真正想問的推論方向。"
description: "逐講導讀 Stanford CS109 Summer 2026 Lecture 3：反轉條件、先驗與證據，並標示官方公開材料與缺口。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-03-bayes-theorem-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 4 篇，對應 **Stanford CS109, Summer 2026, Lecture 3**（Jun 24），官方 schedule 題目是 **Bayes Theorem**，講者為 Chris Gregg。本文以[官方 schedule](https://web.stanford.edu/class/cs109/schedule.html)、[講次頁](https://web.stanford.edu/class/cs109/lectures/3-Independence)、[課堂習題](https://web.stanford.edu/class/cs109/worksheets/Lecture03-Worksheet.pdf)、[解答](https://web.stanford.edu/class/cs109/worksheets/Lecture03-AnswerKey.pdf)與 [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture03-LLMPrompts.pdf)確定 Summer agenda；講次頁與 `/spr26` [讀本](https://probabilitycoders.stanford.edu/spr26)只作為跨 offering 共用的 Spring-dated 概念參考。

本講材料完整度為 **L3**：Summer schedule 與題目 artifacts 確定 agenda，Spring-dated 共用頁面只補概念；Canvas 錄影未使用。

## Worksheet agenda：這一講其實是 independence

Schedule 把 Lecture 3 寫成 Bayes Theorem，但當期 worksheet 與 navbar 都把核心放在 independence 與 inclusion-exclusion。這個來源落差不能抹平：本文以 worksheet 的實際 agenda 為準，同時把它接在前一講 Bayes 之後。

兩事件 inclusion-exclusion 先處理重疊。課程中修 CS 的比例 0.60、修 math 的比例 0.40、兩者皆修 0.25，所以聯集是 0.75，兩者皆非是 0.25。直接相加會把雙修者算兩次。三集合時還要先扣三個兩兩交集，再把被扣太多的三重交集加回。

Cloud City 題目把 independence 變成可從資料檢查的假設。先用 history 中 True 的比例估計 P(rain tomorrow)，再只挑「今天晴天」的相鄰日，估計 P(rain tomorrow|sunny today)。兩者接近只能說資料與獨立模型相容，不能證明天氣在因果上獨立；還要考慮季節性與時間趨勢。

排會議題用補事件避免八個時段的大聯集。每人每格 busy 機率 0.7，所以同一格兩人皆 free 是 0.3²；沒有任何共同空檔是 (1-0.09)^8，至少一格則取補數。這步仰賴跨人、跨時段獨立，少任何一項都不能直接乘。

半小時錯位的印度／英國題不能把兩個候選會議視為獨立，因為它們共享 A 與 D。可行事件是 ACD 或 ABD；應提取共同條件，再對 B 或 C 的聯集做 inclusion-exclusion。這題把 AND、OR、independence 與 shared component 放進同一張圖。

## Independent、mutually exclusive 完全不同

互斥表示不能同時發生，交集機率為零；獨立表示知道一件事不改變另一件事的機率。兩個正機率事件若互斥，知道 E 發生後 F 的機率降為零，反而極度相依。可靠度問題中，元件獨立是模型假設；series system 要全部成功，parallel system 則通常用「全部失敗」的補事件。
## 材料缺口

- Spring-dated 共用 independence 頁可協助解釋 schedule／worksheet 題名落差，但不是 Summer-specific 證據。
- 課程錄影限 Canvas，未使用。
- 本文不使用搜尋摘要或未存取的 Canvas 內容，也不推測課堂口述例子。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 3: Bayes Theorem](https://web.stanford.edu/class/cs109/lectures/3-Independence)
- [Probability for Computer Science course reader](https://probabilitycoders.stanford.edu/spr26)
- [Lecture 3 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture03-Worksheet.pdf)
- [Lecture 3 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture03-AnswerKey.pdf)
- [Lecture 3 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture03-LLMPrompts.pdf)

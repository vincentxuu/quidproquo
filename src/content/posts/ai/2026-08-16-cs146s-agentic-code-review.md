---
title: "CS146S Week 6：Google 為了讓 AI review 有用，先刪掉 17 條規則"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - code-review
  - agentic-coding
  - ai-agent
  - developer-experience
  - code-quality
lang: zh-TW
type: deep-dive
series:
  name: "CS146S：AI 原生開發十週"
  order: 7
tldr: "Google 的 AutoCommenter 部署到數萬名工程師身上，論文寫出了整條調校過程：把 17 條「技術上正確但沒價值」的規則停掉，有用率從 54% 升到 66%，目標訂在 80% 才准進下一階段。最後的留言解決率約 40%。AI code review 的瓶頸從來不是抓不到，是抓太多。"
description: "拆解 Stanford CS146S Fall 2026 第六週「Agentic Code Review」：從 Google AutoCommenter 論文的實測數字看 AI code review 的訊噪比問題、它涵蓋與涵蓋不到的範圍，以及怎麼把它放進團隊的 PR 流程。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-16-cs146s-agentic-code-review-en)

這是 [CS146S 系列](/posts/ai/2026-08-16-cs146s-course-map)的第七篇，對應 Fall 2026 的第六週。

課程主題三條：AI review 擅長抓什麼、漏掉什麼；review 的架構與自訂規則；怎麼把 AI review 放進團隊的 PR 流程。客座是 Cognition 的 Silas Alberti——他 Fall 2025 也來過，那次講的是 AI IDE，這次題目換成 code review。

這個位移本身有意思。一年前值得請人來講的是「怎麼寫」，現在是「誰來檢查」。

## 唯一一份有規模的公開數據

市面上關於 AI code review 的比較數字很多，但幾乎全部來自工具供應商或聯盟行銷網站，方法論不可重現。真正可以拿來討論的公開資料是 Google 那篇 [AI-Assisted Assessment of Coding Practices in Modern Code Review](https://arxiv.org/abs/2405.13565)（AIware '24，Fall 2025 Week 7 的指定讀物）——他們把一個叫 AutoCommenter 的 LLM 系統部署到「tens of thousands of developers」身上，然後把整條路的坑寫出來。

以下數字全部出自那篇論文。

**留言頻率是被刻意壓下來的。** 系統先過濾掉落在未變更行上的留言，把「有變更的檔案裡會產生留言」的比例降到 1.3%；後來改用 beam search（n=4）才「tripled the posting frequency to 3.9%」。同時多樣性也變好了：最常出現的十條規則從佔全部留言的 80% 降到 41%。

**然後他們刪規則。** 這是整篇最值得抄的一段：

> First, the rater study identified 17 non-actionable URLs, whose suppression increased the historical useful ratio from 54% to 66% on developer feedback, and from 60% to 74% on rater feedback.

再多停掉 5 條之後才達到「our target useful ratio of 80% for the next stage of deployment」。也就是說——**他們把「有用率 80%」訂成能不能繼續推廣的門檻，而達標的手段是關掉功能，不是增加功能。**

論文對這件事的解釋很清楚：

> Correct but low-value comments: A missing period at the end of a sentence in a code comment is often allowed by human reviewers. While technically correct, asking the author to go back to their IDE and fix the issue may provide net negative value.

**技術上正確，但淨值為負。** 這句話應該貼在每個想導入 AI review 的團隊牆上。

**最後的成績也很誠實。** 他們用 6,000 組快照比對估算，留言解決率約 40%。系統涵蓋 330 條規則，「covers 68% of historical human comments with a best practice URL」——涵蓋了人類 reviewer 常引用的最佳實踐的三分之二，而且「Many of these are out of scope for traditional static analyses」。

部署節奏也值得注意：2023 年 7 月先做 A/B，只給一半的工程師；確認沒有負面效應，10 月才全面上線。

## 從這些數字能推出什麼

**一、瓶頸是訊噪比，不是能力。** 讓模型多抓一點很容易，讓它閉嘴很難。一個 60% 有用率的 reviewer，人類會在兩週內學會直接跳過它——而那之後它抓到的真 bug 也一起被跳過了。

**二、規則集要能停用。** Google 能修好，是因為他們有辦法定位到「哪 17 條規則在製造噪音」並個別關掉。如果你的 AI reviewer 是一個沒有規則概念的黑箱，你就只有「全開」或「全關」兩個選項。

**三、AI review 是靜態分析的補集，不是替代品。** 68% 那個數字說的是它涵蓋了人類常提但**傳統靜態分析做不到**的部分。linter 抓得到的東西不該交給模型抓——那是 [Week 5 的確定性驗證迴圈](/posts/ai/2026-08-16-cs146s-agent-ready-codebase)該做的事，又快又便宜又不會漂。

## AI review 抓不到的那一類

課程主題明寫「what AI review catches well, and what it misses」。目前公開材料裡比較站得住腳的分界是：

| 抓得好 | 抓不好 |
|---|---|
| 風格與慣例偏離 | 跨檔案的架構退化 |
| 明顯的空值／邊界錯誤 | 業務邏輯錯（code 對，需求不對） |
| 缺測試、缺文件 | 競態條件與並行問題 |
| 單檔內的可讀性 | 「這個抽象三個月後會爛掉」 |

只讀 diff 的工具跟索引整個 codebase 的工具差別也在這條線上——前者看不到這個改動對系統其他部分的連鎖影響。

要提醒的是，網路上流傳的各家「bug catch rate」對比（某某 82%、某某 44% 之類）幾乎都出自工具比較網站或聯盟行銷內容，**沒有公開的測試集與可重現方法**，本文不引用。要選工具的話，用自己 repo 最近 20 個 PR 跑一次比看任何排行榜都準。

## 放進 PR 流程的三條規矩

**一、寫 code 的那個 instance 不准 review 它自己的 code。** 這條在 [Week 2 的 RePPIT](/posts/ai/2026-08-16-cs146s-context-engineering) 出現過，值得再抄一次：模型會為自己的初始實作辯護，「like proofreading your own writing and reading what you meant to type」。換模型家族，或至少把 context 完全清掉。

**二、分級，不要只丟一坨留言。** RePPIT 的 Test 步驟把發現分成 must-fix / should-fix / nice-to-have。這個分級是抵抗 Google 那個「correct but low-value」問題的最低成本做法——不刪留言，但讓人知道哪些可以不看。

**三、AI review 通過不等於可以合併。** 綠勾勾最大的風險不是它漏掉的 bug，是它讓人類 reviewer 放鬆。Google 那套系統跑了兩年多，留言解決率也只有 40% 上下。

## 會過期的東西

- AutoCommenter 的數字是 2023–2024 年的部署，模型已經換過好幾代；那些數字說明的是**問題結構**，不是今天的絕對水準
- Fall 2026 這週的教材與作業尚未公布
- 各家 AI review 工具的能力邊界變動很快，表格裡的分界要定期重驗

## 參考資料

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 6 主題與客座
- [AI-Assisted Assessment of Coding Practices in Modern Code Review](https://arxiv.org/abs/2405.13565) — Vijayvergiya et al.，AIware '24，Google AutoCommenter 的部署與評估
- [RePPIT: A Framework to Ship Production Code 2-3X Faster](https://mlops.community/blog/reppit-a-framework-to-ship-production-code-2-3x-faster) — Mihail Eric，review 分級與「不准自審」規則
- [How to Review Code Effectively](https://github.blog/developer-skills/github/how-to-review-code-effectively-a-github-staff-engineers-philosophy/) — GitHub Blog，Fall 2025 Week 7 指定讀物
- [Code Reviews: Just Do It](https://blog.codinghorror.com/code-reviews-just-do-it/) — Coding Horror，Fall 2025 Week 7 指定讀物
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory，確定性檢查與模型判斷的分界

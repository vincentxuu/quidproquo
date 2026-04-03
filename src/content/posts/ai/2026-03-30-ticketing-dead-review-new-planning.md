---
title: "Ticketing 已死，Review 才是新的 Planning"
date: 2026-03-30
category: ai
tags: [code-review, software-engineering, ai-agents, adr, developer-workflow, ticketing]
lang: zh-TW
tldr: "當 AI agent 能在幾分鐘內把 intent 變成 PR，軟體工程的瓶頸就從「規劃該做什麼」翻轉成「評估做出來的東西對不對」。Ticketing 時代的產物（sprint、story point、backlog grooming）正在壓縮歸零，取而代之的核心實踐是 review。"
description: "導讀 Fayssal El Mofatiche 的 Ticketing Is Dead 文章。當 AI coding agent 把實作成本壓到趨近於零，軟體工程的價值鏈從 planning 翻轉到 review，ADR 取代 ticket 成為核心 artifact。"
draft: false
---

Fayssal El Mofatiche 在 2026 年 3 月發了一篇 [Ticketing Is Dead. Review Might Be the New Planning.](https://fayssalelmofatiche.substack.com/p/ticketing-is-dead-review-might-be)，論點很直接：過去二十年軟體工程建立在一個隱含假設上——**困難的部分在寫 code 之前**。而 AI coding agent 正在讓這個假設失效。

---

## 核心論點：瓶頸翻轉了

舊模型：

```
Intent → Ticket → Assign → Decompose → Implement → Review → Ship
```

新模型：

```
Intent → Agent implements → Review → Ship
```

中間消失的那一大段——planning、estimation、task decomposition、sprint ceremonies、assignment——全都是因為「實作很貴」才存在的。當 AI agent 能在幾分鐘內跨多個檔案實作功能、寫測試、開 PR，這整層協調成本就壓縮到趨近於零。

而膨脹的是另一端：review、evaluation、architectural judgment、integration testing、outcome validation。

> 我們不再花大部分時間搞清楚「該做什麼」和「誰來做」。我們花時間評估「做出來的東西對不對、連不連貫、跟系統合不合」。

這不是微調，是**價值鏈的翻轉**。

---

## 什麼死了、什麼活了

**死掉的：**

- **Story points 和估時** — 實作只要幾分鐘，estimation 變成 overhead
- **Sprint planning 儀式** — cadence 是為人類的實作速度設計的
- **Ticket 管理作為一種專業** — intent 和 code 之間的協調層正在消失
- **Backlog grooming** — 每個 item 要花好幾天時才需要 infinite backlog，現在直接試就好

**存活且膨脹的：**

- **Architectural judgment** — 還是需要有人知道系統該長什麼樣
- **Code review 和 evaluation** — 品質閘門從 planning 移到 review
- **Intent clarity** — garbage in, garbage out，agent 即時執行時更是如此
- **Integration 和系統思維** — 單一功能便宜了，連貫的系統不會

**變形的：**

- PM 從「規劃工作」變成「評估產出」
- Senior engineer 從「設計方案」變成「判斷方案」
- Standup 從「你在做什麼」變成「agent 產出了什麼，對不對」

---

## ADR 取代 Ticket 成為核心 Artifact

文章裡最有意思的論點之一：**Architectural Decision Records（ADR）可能是 review 時代的核心文件。**

Jira ticket 說的是 _what_ to build，ADR 說的是 _why we build it this way_。

Ticket 在實作完成後就變成死重。ADR 持續存在且複利累積——實作時有用、review 時有用、下一個碰到同一邊界的功能有用、六個月後 onboarding 有用。

更關鍵的是，agent 能讀 ADR。Reviewer 能拿 ADR 來驗證 agent 的產出：agent 有沒有尊重我們文件記錄的約束？有沒有遵循我們選擇的 pattern？有沒有違反我們明確考慮過的 trade-off？

> 如果 ticket 是 planning 時代的 artifact，ADR 可能是 review 時代的 artifact。

---

## Context 要跟著 Agent 走進 Repo

AI coding agent 活在 repo 裡——讀檔案、寫 code、開 branch、開 PR。但我們還是把它們的任務 context（what 和 why）放在完全不同的系統裡——SaaS board、ticket database、一個 API call 之外。

人類需要 dashboard、拖拉板、notification email。Agent 不需要。Agent 需要 context **在它已經所在的地方**：repository。

`CLAUDE.md`、`TASKS.md`、`/docs/decisions/` 裡的 ADR——這些都是任務 context 正在遷移進 repo 的早期訊號。

> 工具跟著人類走進了瀏覽器。現在它們需要跟著 agent 走進 repo。

---

## 對工程師職涯的意涵

這裡有個反直覺的翻轉：

過去幾年大家一直在問「AI 會不會取代開發者？」但實際發生的事幾乎是相反的。

在舊模型裡，開發者越來越被商品化——ticket taker、spec implementer。PM 把需求寫得越好，開發者的判斷力就越不重要。Agile 讓開發者更可替換，而不是更不可替換。

現在被商品化的部分——implementation——交給了 agent。留下的是一直被低估的部分：architectural judgment、system understanding、看著能跑的 code 說「這是錯的」的能力。

> AI 不是在取代開發者。它是在移除那些本來就不算工程的東西。

---

## Bainbridge 悖論的陰影

文章最後提到一個關鍵風險，呼應作者之前寫過的 [Bainbridge 悖論](https://fayssalelmofatiche.substack.com/p/ai-jobs-and-the-40-year-old-paper)：自動化不會消除對專業能力的需求，但會消除培養專業能力的機會。

如果工程師不再規劃、分解、估時，他們就失去了建立系統理解力的練習。肌肉會萎縮。

但有一個更樂觀的讀法：如果省下來的時間投入 review——深入的、架構層級的、批判性的 review——工程師可能會發展出比舊的 planning 儀式更好的判斷力。

> Planning 一直有部分是表演。Review 如果做得好，不是。

關鍵問題是：團隊會不會做這個投資？還是讓 review 變成跟舊時代「LGTM」文化一樣的形式？

如果 review 變成橡皮圖章，Bainbridge 悖論贏。如果 review 成為學習和品質的主要場域，我們會走向更好的方向。

---

## 整體來說

這篇文章的價值在於把一個很多人模糊感覺到的趨勢說得很清楚：**AI coding agent 不只是讓寫 code 變快，它翻轉了整條軟體工程的價值鏈。**

以前最值錢的能力是 planning。以後最值錢的能力是 judgment。

以前的核心 artifact 是 ticket。以後的核心 artifact 可能是 ADR。

以前的核心流程是 sprint planning。以後的核心流程是 code review。

最後一句話值得記住：

> 把 review 當核心工程實踐的團隊，會做出能用的東西。其他人會 ship 得很快，然後永遠在 debug。

---

## 原文連結

- [Ticketing Is Dead. Review Might Be the New Planning. — Fayssal El Mofatiche](https://fayssalelmofatiche.substack.com/p/ticketing-is-dead-review-might-be)
- [AI, Jobs, and the 40-Year-Old Paper We Forgot to Read — Fayssal El Mofatiche](https://fayssalelmofatiche.substack.com/p/ai-jobs-and-the-40-year-old-paper)（文中提到的 Bainbridge 悖論延伸閱讀）

## 參考資料

- [Ticketing Is Dead. Review Might Be the New Planning.](https://fayssalelmofatiche.substack.com/p/ticketing-is-dead-review-might-be) — Fayssal El Mofatiche 原文，軟體工程價值鏈翻轉的核心論述
- [AI, Jobs, and the 40-Year-Old Paper We Forgot to Read](https://fayssalelmofatiche.substack.com/p/ai-jobs-and-the-40-year-old-paper) — Bainbridge 悖論延伸閱讀：自動化消除練習機會的長期風險
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic agent 設計哲學，coding agent 作為軟體工程工具的定位
- [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — AI agent 跨 session 完成複雜任務的實戰，review 角色的具體案例
- [Architecture Decision Records (ADRs) — GitHub ADR Organization](https://adr.github.io/) — ADR 官方說明，文中提到的「review 時代核心 artifact」
- [Claude Code Overview](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) — Claude Code 官方文件，AI coding agent 作為 repo-native 工具的代表
- [A Survey on Large Language Model based Autonomous Agents](https://arxiv.org/abs/2308.11432) — arXiv 論文，AI agent 在軟體工程中的能力與局限的學術綜述

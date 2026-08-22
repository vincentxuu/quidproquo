---
title: "CS224N 第 15 講：沒有公開投影片時，如何讀 Agentic Interpretability"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, interpretability, human-centered-ai, ai-agent, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 16
tldr: "第 15 講由 Been Kim 客座談 interpretability，但 Winter 2026 官網沒有公開投影片或 agenda；本文不虛構講授內容，只用官方五篇閱讀建立概念發現、agentic investigation 與新詞彙三條閱讀路線。"
description: "CS224N Winter 2026 Lecture 15 的材料缺口紀錄與官方閱讀導圖：agentic interpretability、人本 AI、concept discovery 與 neologism learning。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-interpretability-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)確認第 15 個正規單元在 2026 年 2 月 24 日由 Been Kim 客座主講，官方題名只有 **Guest Lecture: Interpretability**。這一講和前十四講不同：課程頁沒有公開 Winter 2026 投影片，也沒有列 agenda，只列五篇 suggested readings。

因此這篇不能忠實重建「講了什麼」。以下是官方閱讀清單能支持的閱讀導圖，目的在保存系列位置與材料邊界，不把論文內容冒充課堂內容。

## 路線一：從解釋答案改成能持續調查的 agent

官方首先列出 [*Because we have LLMs, we Can and Should Pursue Agentic Interpretability*](https://arxiv.org/abs/2506.12152)。這條路把 interpretability 從單次視覺化或 feature attribution，推向能提出假設、設計 probe、呼叫分析工具並累積證據的調查流程。

Agentic 不等於可信。調查 agent 的每一步仍需要可追蹤輸入、工具輸出、反例與停止條件；若只讓模型自己解釋自己，再由同一模型評分，容易形成封閉的自我確認。

## 路線二：從模型內部轉向人的概念

[*The Pareto Frontier of Human-Centered AI*](https://medium.com/@beenkim/the-pareto-frontier-of-human-centered-ai-54f90ba5872c) 與 [AlphaZero concept discovery 論文](https://www.pnas.org/doi/10.1073/pnas.2406675122)把焦點放在人與模型如何交換概念。後者研究從模型中發現概念，再把它們傳遞給人；問題不只是某個 neuron 是否啟動，而是找到的概念能否被人理解、使用，並改善後續判斷。

這帶出多目標取捨：預測效能、人的理解、介入成本與可行動性未必同時最大。解釋若精準但沒有人能用，或很直覺卻沒有 fidelity，都不能只用「可解釋」三字概括。

## 路線三：現有詞彙可能不夠

[*We Can't Understand AI Using our Existing Vocabulary*](https://arxiv.org/abs/2502.07586) 與 [*Neologism Learning for Controllability and Self-Verbalization*](https://arxiv.org/abs/2510.08506)探索一個更激進的問題：模型內部可能存在現成人類詞彙無法命名的規律。Concept bottleneck 若只允許既有標籤，可能把未知結構硬塞進熟悉分類。

Neologism learning 嘗試學習新概念 token，讓模型能引用、控制或自我表述那些模式。驗證不能只看新詞聽起來合理；要測它是否穩定對應可重現行為、能跨例子泛化，且介入後產生預期變化。

## 本講可確認與不可確認的範圍

可確認的是日期、講者、題名與五篇官方閱讀。不可確認的是講者實際 agenda、採用哪些投影片、論文涵蓋比例、現場案例與結論。官網 HTML 裡出現一條被註解掉的舊學期 slide link，並非 Winter 2026 公開材料，本文沒有使用。若官方之後補上投影片，這篇才應升級成逐段 lecture review。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Because we have LLMs, we Can and Should Pursue Agentic Interpretability](https://arxiv.org/abs/2506.12152)
- [The Pareto Frontier of Human-Centered AI](https://medium.com/@beenkim/the-pareto-frontier-of-human-centered-ai-54f90ba5872c)
- [Bridging the human–AI knowledge gap through concept discovery and transfer in AlphaZero](https://www.pnas.org/doi/10.1073/pnas.2406675122)
- [We Can't Understand AI Using our Existing Vocabulary](https://arxiv.org/abs/2502.07586)
- [Neologism Learning for Controllability and Self-Verbalization](https://arxiv.org/abs/2510.08506)

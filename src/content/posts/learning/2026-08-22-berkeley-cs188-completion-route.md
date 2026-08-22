---
title: "CS188 結業路線：把 28 講與 P0–P5 變成作品集"
date: 2026-08-22
category: learning
tags: [berkeley, cs188, artificial-intelligence, portfolio, learning-path]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS188 Spring 2026"
  order: 7
tldr: "Lecture 26–28 用核監測、AI safety 與課程回顧收尾；校外結業不該只算 autograder 分數，而要為 P1–P5 各留下模型假設、測試證據與失敗分析。"
description: "Berkeley CS188 Spring 2026 的結業與作品集路線：整合 P0–P5 六個 projects、應用講題、AI safety 與自學驗收。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs188-completion-route-en)

[CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/)最後三講分別處理 AI for Global Nuclear Monitoring、AI Safety 與 Further Thoughts。它們不是突然插入的新聞單元，而是在問：前面學到的 search、decision、uncertainty 與 learning，放進真實制度後還缺什麼？

## 校外結業的標準

沒有 Berkeley 成績單時，可以用一份可稽核的作品集取代模糊的「修完」。P1–P5 每個 project 留下四樣東西：問題模型、核心演算法、測試證據、一個失敗案例。P0 只負責確認環境，不必硬包成作品。

依[官方課程政策](https://inst.eecs.berkeley.edu/~cs188/sp26/policies/)，公開作品時不要上傳 solution 或可直接提交答案。較好的呈現方式是寫設計筆記、畫 state／belief／update 流程、展示自己新增的非評分測試，再連回[官方 project 規格](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/)。這既能證明理解，也不破壞課程作業。

## 五個專案各自要證明什麼

- **P1 Search**：能解釋 state representation 與 heuristic 為何正確。
- **P2 Multi-Agent**：能說清楚 minimax 和 expectimax 對 ghost 的假設。
- **P3 RL**：能區分已知模型的 planning 與從經驗 learning。
- **P4 Ghostbusters**：能畫出 observation update 與 time update 的差異。
- **P5 ML**：能用 loss curve 與失敗案例說明模型，而非只報 accuracy。

## 最後一次重跑

關掉舊輸出，從乾淨環境依序重跑 local autograder；每份 project 選一個曾經失敗的 case，寫下原因與修正。接著挑最後三講的一個應用，列出它的 objective、可觀察資訊、行動、風險與無法由單一分數表示的利害關係人。這一步把課程中的 agent model 接回真實世界。

完成後再選下一門課：偏數學型 ML 可接 CS189，偏深度 RL 可接 CS285，偏 NLP 可先補入門 NLP 再讀 CS288。CS188 的角色不是涵蓋所有 AI，而是提供一套可重複使用的問題表示語言。

系列導航：[上一篇：決策與機器學習](/posts/learning/2026-08-22-berkeley-cs188-machine-learning)｜[回到課程總覽](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview)

## 參考資料

- [CS188 Spring 2026 course calendar](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [CS188 Spring 2026 projects](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/)
- [CS188 Spring 2026 policies](https://inst.eecs.berkeley.edu/~cs188/sp26/policies/)
- [Berkeley AI／ML 課程導讀](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)

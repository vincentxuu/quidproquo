---
title: "CMU AI 核心改制：15-281＋10-315 到 07-280＋07-380，不只是換課號"
date: 2026-08-22
category: learning
tags: [cmu, artificial-intelligence, machine-learning, course-guide]
lang: zh-TW
type: deep-dive
tldr: "CMU 在 2026 年把原本分開的廣義 AI 與 SCS 機器學習入口，重新整合成 07-280 → 07-380；這是內容與先修路線的重切，不是兩門課逐一改名。"
description: "以 CMU 官方 FAQ、BSAI 課程要求與四門課的公開內容，整理 AI 核心改制的時程、內容分配、先修與過渡規則。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-cmu-ai-core-redesign-en)

CMU 的人工智慧本科核心在 2026 年換了一套骨架。舊路線把 **15-281 Artificial Intelligence** 與 **10-315 Introduction to Machine Learning for SCS** 分開。新路線則是 **07-280 Artificial Intelligence and Machine Learning I → 07-380 Artificial Intelligence and Machine Learning II**。官方 FAQ 直接說明舊兩門將退休，但這不代表把舊課號一對一換成新課號。

這篇只比較官方已公布的課程定位、主題、先修與替代規則。07-380 在 Fall 2026 首開，因此不評論它實際授課品質、作業難度或工作量。

## 改制時程：首開與過渡班同時存在

[07-280 官方頁](https://www.cs.cmu.edu/~07280/)記載 Spring 2026 首次開課，[07-380](https://www.cs.cmu.edu/~07380/)則於 Fall 2026 首開。舊課沒有在某一天同時消失：[15-281 Spring 2026](https://www.cs.cmu.edu/~15281/)仍保留 permission-only 班次，讓已完成舊 10-315、仍需舊配對的學生完成過渡。

因此，「15-281 已退休」應理解成它退出常規入口，而不是 Spring 2026 完全沒有 15-281。對校外讀者而言，舊課站仍有價值；對規劃 CMU 現行學位的學生而言，新序列才是主線。

## 不是一對一改名，而是重新混合再切分

舊版的責任邊界很清楚：15-281 涵蓋搜尋、博弈、CSP、MDP、強化學習、Bayes nets 與 HMM 等廣義 AI；10-315 是提供給 SCS 學生的機器學習入口。

新 [07-280 課綱](https://www.cs.cmu.edu/~07280/)把搜尋、監督式學習、神經網路、CNN、語言模型、Transformer 與強化學習放進同一門基礎課。課程再以 AlexNet、GPT-2 與 AlphaZero 類型的系統實作串起內容。

07-380 的官方規格再往後安排 ML theory、game theory、probabilistic graphical models、planning、distributed deep learning、generative AI、RLHF、vision transformers、diffusion 與 VAE。它尚未完成首輪授課；現在能確定的是公布的範圍，而不是每個主題最後佔多少週。

| 主題 | 舊核心位置 | 新核心已公布的位置 |
|---|---|---|
| 搜尋、對抗搜尋、CSP | 15-281 | 07-280 |
| 監督式 ML 與最佳化 | 10-315 | 07-280 |
| CNN、語言模型、Transformer | 分散於 ML／後續課 | 07-280 建立共同入口 |
| MDP、RL、樹搜尋 | 15-281 | 07-280 |
| Bayes nets、HMM／PGM | 15-281 已含 Bayes nets 與 HMM | 07-380 公布 PGM 範圍 |
| 進階 ML theory、生成模型 | 不屬於 15-281＋10-315 的共同核心 | 07-380 公布範圍 |

這張表只描述課綱中的位置，不表示新舊講次或作業可以逐項對換。

## 先修也跟著新責任邊界改變

07-280 要求程式設計、線性代數與 concepts／離散數學，並搭配微積分與機率條件。07-380 再以 07-280、Calculus II 與指定機率背景為基礎。這反映新第一門同時要承擔 AI 與 ML 地基；但「反映」不等於官方解釋了設計動機，本文只陳述課程列出的能力要求。

另一方面，[07-280 FAQ 的 10-301 比較表](https://www.cs.cmu.edu/~07280/#faq)明確區分兩條路：07-280 含非 ML 的 AI 技術；10-301 專注 ML，因此能多走一些 ML 主題。10-301 並未因新核心出現而退休。

## 替代規則不是雙向等價

最容易踩坑的是把「都算 ML 入門」誤讀成「可自由互抵」。官方表格指出：

- 07-280 與 10-301 都可滿足若干後續 10-xxx 課程的 introductory ML prerequisite。
- 07-280 能直接滿足 07-380 的先修與 AI major 的核心要求。
- 10-301 不會自動取得這兩項資格；已修 10-301、因此不能再修 07-280 的學生，要聯絡 BSAI 個別討論替代路徑。

所以替代是非對稱的。選課前可做的動作很具體：把你要接的下一門課寫下來，再查它接受的是「intro ML」還是明確的「07-280」。不要只比較課名。

## 校外自學：最新制度與最好用教材是兩個問題

新課最能代表 CMU 現在如何組織 AI／ML；舊課 archive 卻可能更穩定。[15-281 Spring 2026](https://www.cs.cmu.edu/~15281/)保留講義、recitation 與 Pacman 類 programming assignments；07-280 Spring 2026 的教材也能讀，但官網已切換到 Fall 2026，歷史網址的穩定性較弱。07-380 目前只有課程規格，不能稱為完整公開課。

今晚若要開始，先依目的選入口：想跟現行 BSAI 骨架走，讀 07-280；想做傳統搜尋與規劃專案，可用 15-281 archive；只想建立專門 ML 地基，則讀持續開課的 10-301。制度版本與教材可用性要分開標。

## 參考資料

- [CMU 07-280 AI & ML I](https://www.cs.cmu.edu/~07280/)
- [CMU 07-380 AI & ML II](https://www.cs.cmu.edu/~07380/)
- [CMU 15-281 Artificial Intelligence — Spring 2026](https://www.cs.cmu.edu/~15281/)
- [CMU BSAI Curriculum](https://www.cs.cmu.edu/bs-in-artificial-intelligence/curriculum)
- [CMU MLD Introductory ML Classes](https://ml.cmu.edu/academics/ml-intro-classes)

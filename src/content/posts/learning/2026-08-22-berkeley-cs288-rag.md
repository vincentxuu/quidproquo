---
title: "Berkeley CS288（四）：Retrieval、RAG 與進階架構如何變成一個系統"
date: 2026-08-22
category: learning
tags: [berkeley, cs288, rag, retrieval, llm, evaluation]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "13–14 組教材把模型接到外部知識；A3 要學生自行蒐集資料、標註 QA、建索引、做 ablation，並在 CPU 與延遲限制下交付 RAG。"
description: "導讀 CS288 Retrieval and RAG、Advanced Architectures 與 Assignment 3 的端到端系統設計。"
draft: false
series: { name: "Berkeley CS288 Spring 2026", order: 4 }
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs288-rag-en)

[13–14 組教材](https://cal-cs288.github.io/sp26/)把焦點從模型內部移到系統邊界：知識從哪裡來、如何切分與索引，以及檢索結果如何交給 generator。架構選擇還會改變計算與品質。這段最好的讀法不是背 RAG 元件圖，而是跟著 Assignment 3 做 failure decomposition。

## RAG 的四個可分離決定

先分 corpus、retrieval unit、retriever、generator。Corpus 決定知識範圍與時間點，chunking 決定可被找回的證據粒度。Sparse、dense 或 hybrid retrieval 負責產生候選，generator 才把問題與 evidence 轉成答案。四者混在一次比較裡，分數變化就無法歸因。

## A3 刻意不給 starter code

[Assignment 3](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment3.pdf) 要學生回答 Berkeley EECS 網站上的短答案問題。團隊需自行爬取與清理網站，並建立至少一組驗證資料。接著檢查標註一致性、建立 retrieval corpus，再以 Exact Match、token F1 與 retrieval recall 做 ablation。

正式環境另有限制：無 GPU、4GB RAM、embedding model 大小限制、固定套件與執行入口，並要求低延遲。這使「最強模型」不一定是可交付系統。校外重做時可自訂較小題庫，但應保留時間戳、來源 URL、retrieval recall 與端到端 metric，否則無法知道錯在檢索還是生成。

## 公開度與安全邊界

作業 PDF 公開，hidden dev/test、正式 wrapper 與 Gradescope 不公開；官方也禁止散布 solutions。Impact & Social Implications 在課表中有位置，目前卻沒有對應的匿名 slides。因此本文只提出實作時要記錄的 crawl 範圍、個資、更新週期與引用來源，不把這些當成未公開課堂的內容摘要。

今晚可先抓取十個公開 EECS 頁面，人工寫十題短答案 QA，再用 BM25 做 baseline。逐題保存 top-k evidence，最後人工標記 retrieval miss 或 generation miss。

## 參考資料

- [CS288 Retrieval and RAG schedule entry](https://cal-cs288.github.io/sp26/)
- [Assignment 3 specification](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment3.pdf)
- [Assignments index](https://cal-cs288.github.io/sp26/assignments/)

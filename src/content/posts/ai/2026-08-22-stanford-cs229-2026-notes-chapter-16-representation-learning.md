---
title: "表徵學習：對比學習、語意檢索與 RAG"
date: 2026-08-22
type: deep-dive
category: ai
tags: [cs229, representation-learning, retrieval, rag]
lang: zh-TW
tldr: "第 16 章把表徵學習連到實際系統：對比目標塑造向量空間，語意檢索在其中找鄰居，RAG 再把取回內容交給生成模型。"
description: "導讀 CS229 2026 主講義第 16 章：對比學習如何形成表徵，以及表徵如何支撐語意檢索與 RAG。"
draft: false
series:
  name: "Stanford CS229 導讀"
  order: 17
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-16-representation-learning-en)

本文導讀 [CS229 2026 主講義](https://cs229.stanford.edu/main_notes.pdf)第 16 章（印刷頁 196–201）。這是 2026 notes 的逐章導讀，不是某學期錄影重建；本文保留核心目標、評估與系統連鎖，不宣稱重現每段證明。

## 表徵為什麼能重用

監督式預訓練可先學分類器，再丟掉最後一層，把倒數第二層當成 \(\phi(x)\)。這等於期待早期網路學到跨任務可用的結構，而最後一層只負責原任務的決策。

沒有標籤時，對比學習從同一筆資料製造兩個增強版本，視為正樣本；其他資料的版本則形成負樣本。以查詢表徵 \(q\)、正樣本 \(k^+\) 與負樣本 \(k_j\) 為例，softmax 型損失可寫成

\[
-\log\frac{\exp(q^\top k^+/\tau)}{\exp(q^\top k^+/\tau)+\sum_j\exp(q^\top k_j/\tau)}.
\]

溫度 \(\tau\) 控制分數差異的尖銳程度。訓練會拉近正樣本、推遠負樣本，但真正學到什麼，取決於資料增強定義了哪些不變性。

## 從向量到語意檢索

文件與查詢先編碼成向量。若已正規化，內積就是餘弦相似度。文件向量可預先計算；暴力搜尋每次仍需比較全部 \(N\) 筆、成本約為 \(O(Nm)\)，其中 \(m\) 是向量維度。近似最近鄰索引則以部分召回率換取速度與記憶體效率，例如圖索引、量化或倒排分區。

Recall@\(k\) 只問相關文件有沒有進前 \(k\) 名；NDCG 還會獎勵較好的排序：

\[
\mathrm{DCG}@k=\sum_{j=1}^{k}\frac{\mathrm{rel}_j}{\log_2(j+1)},\qquad
\mathrm{NDCG}@k=\frac{\mathrm{DCG}@k}{\mathrm{IDCG}@k}.
\]

因此離線評估必須配合產品需求：只要找到一筆證據，與要求多筆高相關證據排在前面，是不同任務。

## RAG 是檢索後的條件生成

RAG 先取回 \(\hat R(q)\) 中的前 \(k\) 筆內容，再生成

\[
y\sim p_\psi\bigl(y\mid q,\hat R(q)\bigr).
\]

它的操作優勢是知識可隨語料庫更新，不必每次都改模型權重；生成也能被提供的來源約束。但這不是正確性保證：漏檢的證據不會自己出現，錯誤片段仍可能被模型流暢地誤用。

## 假設與失效點

- 不合適的資料增強會教出錯誤不變性。
- 隨機負樣本可能其實語意相近，造成 false negative。
- ANN 的延遲、記憶體與召回率需要一起調整。
- RAG 的上限同時受切塊、embedding、索引、排序與生成器限制。
- NDCG 等指標需要可信的相關性標註，否則數字只是量到標註偏差。

## 與相鄰章節的銜接

第 15 章說明如何適應已訓練的基礎模型；本章解釋可重用表徵與檢索層。下一章的大型語言模型既可產生這些 embedding，也能成為 RAG 的生成器。

## 練習

設計一個有 100 筆查詢的小型檢索評估集。分別定義 Recall@5 與 NDCG@5，並列出三組實驗：更換 embedding、調整 ANN 搜尋深度、加入 reranker。寫下每組實驗預期改善的環節與可能增加的成本。

## 參考資料

- [CS229 Lecture Notes 第 16 章：表徵學習、語意檢索與 RAG（2026-08-18）](https://cs229.stanford.edu/main_notes.pdf#page=197)
- [Stanford CS229 官方課程頁](https://cs229.stanford.edu/)

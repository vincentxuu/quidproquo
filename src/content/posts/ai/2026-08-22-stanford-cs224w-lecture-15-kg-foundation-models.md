---
title: "Stanford CS224W 第 15 講：Foundation Models for Knowledge Graphs：新實體、新關係與雙重等變性"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 16
tldr: "依 Fall 2025 官方投影片整理第 15 講，涵蓋 transductive KG embedding 的邊界、entity-inductive link prediction、relation graph，並標明公開材料邊界。"
description: "Stanford CS224W Fall 2025 第 15 講完整 agenda 與自學筆記，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-15-kg-foundation-models-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 15 講**，官方日期 2025-11-13。本文依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/15-KGFoundationModels.pdf)整理；講者以投影片署名為準。

## 材料與缺口

公開材料包含官方投影片與 schedule 的 optional readings。Canvas 錄影、現場 Q&A、板書與 Ed 討論不公開，本文不推測；2021 公開影片不作為 2025 講次證據。

## 本講完整 agenda

### 1. transductive KG embedding 的邊界

傳統 KG embedding 為每個 entity 與 relation 配一組參數，所以只能處理訓練時已存在的 vocabulary。換一張圖、加入新 entity，甚至出現新 relation type，都可能需要重新訓練。

### 2. entity-inductive link prediction

entity-inductive 方法不用 entity ID lookup，而是從局部子圖、relation pattern 或文字特徵建立表示。這能泛化到新節點，但若 relation embedding 仍是 lookup table，就不能處理新關係。

### 3. relation graph

relation graph 把原本 KG 的 relation type 也當成節點，並用它們在三元組中共同出現的角色建立邊。模型因而能從關係之間的結構產生 relation representation。

### 4. double equivariance

double equivariance 要求模型同時對 entity permutation 與 relation permutation 保持一致。這個設計避免把特定 ID 當語意，讓同一推理規則可搬到重新命名或全新的圖。

### 5. ULTRA、InGram 與 zero-shot reasoning

ULTRA 與 InGram 展示用 relation-level structure 支援未見 entity／relation 的方向。檢查 foundation claim 時要分開報 transductive、entity-inductive、relation-inductive 與 fully inductive setting。

## KG foundation model agenda

### Transductive ceiling

Classic KG embeddings allocate parameters to every entity and relation. Test triples usually reuse training vocabulary, so good filtered MRR does not show generalization to new IDs. Adding a new entity/relation lacks lookup vectors.

### Entity-inductive

Entity-inductive models derive representation from local relational structure or attributes, not permanent ID. They can score new entities connected by seen relation types. Split must hold out entities entirely; leaving their other edges in training is leakage.

### Relation-inductive

New relation type has no learned matrix/vector. Relation-inductive model must derive relation representation from support triples, textual description or relation-level structure. Holding out only triples but keeping relation seen is not relation-inductive.

### Fully inductive

Fully inductive setting may present new entities and new relations in a new graph. Model must transfer reasoning rules independent of both vocabularies. Candidate construction and support graph availability must be specified.

### Relation graph

Build a graph whose nodes are relation types, connecting relations by how they co-occur around head/tail roles. Message passing over this relation graph derives relation representations from structural role, enabling unseen relation reasoning when support pattern exists.

### Double equivariance

Entity permutation and relation permutation should consistently permute outputs, not change semantics. Double equivariance prevents model relying on arbitrary IDs. Unit tests rename all entity/relation IDs and compare aligned scores.

### ULTRA-style reasoning

Conditional message passing can start from query relation representation and propagate over entity graph, combining relation-level and entity-level structure. It performs reasoning per query rather than static entity lookup, affecting inference cost.

### InGram

InGram derives entity and relation embeddings through relation graph and graph structure, targeting unseen entities/relations. Support density matters: a new relation with too few triples may have insufficient structural signal. Report performance by support count.

### Negative transfer

A universal rule may not fit all KGs; relation patterns and data quality differ. Foundation evaluation spans multiple graphs and reports per-graph variance, not only pooled average. Text features or ontology metadata, if used, must be declared.

### 驗收

Create four splits: transductive, entity-inductive, relation-inductive, fully inductive. Rename IDs to test equivariance, vary support triples, and compare lookup, entity-inductive and relation-graph methods under fixed budget. Report MRR/Hits plus per-query latency and failure by unseen relation pattern.

## 實作、評估與驗收

### Split construction

Entity-inductive split要讓test entities及其相關target triples不進training；relation-inductive同理hold out relation vocabulary。Fully inductive還需新graph。Support triples若提供，必須與query triples分開並明定數量。

### Relation graph roles

Relation co-occurrence可按head-head、head-tail、tail-head、tail-tail角色建edges。若全部合併，inverse與composition pattern可能混淆。Relation graph construction、direction與normalization是model input的一部分。

### Query conditioning

Foundation KG model可依query relation初始化message，再在entity graph傳播。每個query可能需一次propagation，與預先存entity embeddings成本不同。報per-query latency、cache策略與batching。

### Support sparsity

新relation只有一兩個support triples時，relation graph訊號很弱。按support count分桶，區分zero-shot、few-shot與dense-support。Pooled MRR可能被support多的relations主導。

### ID invariance

將entity與relation IDs全做random bijection，重建所有triples與candidates，aligned scores應一致。若不一致，模型或preprocessing依賴ID order、hash或frequency leakage，違反double-equivariance目標。

### 驗收

四種 split 各自比較 lookup、entity-inductive、relation-graph 模型；固定 candidate、filter 與 budget。報 per graph、per relation pattern、support count、latency 與 memory。Foundation claim 只限真正 unseen vocabulary 的結果。

## 自學檢查點

所有 inductive 結果都需附 vocabulary overlap audit，證明 held-out IDs 真正未進 training artifacts。

先寫出 prediction unit、資料可用時間、negative set 與 metric，再跑模型。圖上的資料洩漏常沿另一種 relation 或未來邊發生，只看程式是否執行成功抓不到。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 15 official slides](https://web.stanford.edu/class/cs224w/slides/15-KGFoundationModels.pdf)

---
title: "Stanford CS224W 第 13 講：Advanced Architectures in RDL：RelGNN 與 Relational Graph Transformer"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 14
tldr: "依 Fall 2025 官方投影片整理第 13 講，涵蓋 RDL 的多關係瓶頸、RelGNN composite message passing、relation-specific aggregation，並標明公開材料邊界。"
description: "Stanford CS224W Fall 2025 第 13 講完整 agenda 與自學筆記，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-13-advanced-rdl-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 13 講**，官方日期 2025-11-06。本文依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/13-Advanced_topics_RDL.pdf)整理；講者以投影片署名為準。

## 材料與缺口

公開材料包含官方投影片與 schedule 的 optional readings。Canvas 錄影、現場 Q&A、板書與 Ed 討論不公開，本文不推測；2021 公開影片不作為 2025 講次證據。

## 本講完整 agenda

### 1. RDL 的多關係瓶頸

資料庫圖同時有多種 entity、relation、欄位型別與時間戳。單一 homogeneous operator 會把不同語意混在一起；每種 relation 完全獨立又會讓參數與稀疏度爆開。

### 2. RelGNN composite message passing

RelGNN 的 composite message passing 把多個可重用操作組合起來，分別處理 relation 內聚合與 relation 間合併。重點是共享足夠參數，同時保留關係差異。

### 3. relation-specific aggregation

relation-specific aggregation 要處理鄰居數量極不平衡：某些 entity 只有一條邊，另一些有成千上萬筆交易。正規化與 sampling policy 因此是模型語義的一部分。

### 4. Relational Graph Transformer

Relational Graph Transformer 以 typed attention 建模 source、relation 與 target 的互動，也可加入時間與欄位編碼。global attention 並非必要；在 sampled relational neighborhood 內做 attention 更符合可擴展需求。

### 5. 效率、採樣與 ablation

比較架構時固定資料切分、sampler、hidden size 與預算，分別移除 relation type、時間編碼與 attention。否則無法判斷提升來自架構或額外計算。

## 進階 RDL 架構 agenda

### 多關係瓶頸

Database graphs may have many relations, highly uneven degrees, mixed features and timestamps. One homogeneous operator erases semantics; one full matrix per relation explodes parameters and undertrains rare relations. Advanced RDL searches for structured sharing.近似

### Composite message passing

RelGNN separates operations inside each relation from composition across relations. Each relation aggregates its neighbors, then a second operator combines relation summaries for the target. This makes normalization and sharing explicit rather than concatenating all edges.

### Relation aggregation

Across-relation sum treats frequency differently from mean/attention. A relation with thousands of transactions can dominate unless normalized; normalizing each relation first gives rare relation an independent channel. Choice should reflect whether counts themselves carry signal.

### Parameter sharing

Basis matrices, relation embeddings or shared MLPs with relation conditioning reduce parameters. Strong sharing helps rare relations and transfer, but may merge distinct semantics. Report parameter count and per-relation performance, not only overall metric.

### Relational Graph Transformer

RGT uses typed query/key/value and relation-dependent attention/message. It can integrate node type, edge type and time. Attention normally runs within sampled neighborhoods for scalability, not all database rows globally. Mask and softmax grouping must be documented.

### Column encoding

Relational rows contain numeric, categorical, text and missing values. Column-aware encoders preserve which field produced a value; flattening all values to one vector may confuse identical codes across columns. Normalization statistics must be training/time safe.

### Temporal encoding

Relative time between edge and prediction point can enter message or attention. Negative/future intervals must be masked. Recent events may be more predictive, but exponential decay or buckets are design choices requiring ablation.

### Sampling interaction

Model and sampler interact: attention cannot recover a neighbor never sampled. Relation-specific fanout, recency and importance sampling change evidence. Fair architecture comparison fixes sampler, or separately reports sampler-model interaction grid.

### Efficiency

Composite operations add kernels; transformer attention adds memory; heterogeneous batching adds type dictionaries. Report preprocessing, sampler time, GPU utilization, peak memory and inference latency per seed, alongside task metric.

### 驗收

Compare relational MLP, R-GCN-style baseline, RelGNN and RGT under same split/sampler/budget. Ablate types, time, column encoding and attention one at a time. Report macro per relation and new/rare entity results; inspect attention only as diagnostic, not causal proof.

## 實作、評估與驗收

### 多關係瓶頸

關聯式資料庫同時包含多種 relation、極不平均的 degree、混合欄位與時間戳。單一 homogeneous operator 會抹平語意；每種 relation 一個完整矩陣又會讓參數爆增、稀有 relation 學不到，因此架構核心是有結構的參數共享。

### Composite message passing

RelGNN 將 relation 內 aggregation 與跨 relation composition 分開。先為每個 relation 建摘要，再由第二個 operator 合併到 target。這使正規化與共享位置可被明確 ablation，而不是把所有 edges 串在一起。

### 欄位與時間

不同 columns 需 type/column-aware encoder，missing value也要顯式mask。Relative time 可進message或attention；sampler先排除future edges。只在最後加timestamp feature無法修正已抽到未來資料的leakage。

### Sampler interaction

Attention 無法找回未被 sampler 取到的 neighbor。比較 RelGNN 與 RGT 時固定 relation fanout、recency policy與seed；若要共同調整，就做 sampler×model grid，不能把更昂貴 sampling 的收益全算給 architecture。

### 成本

Composite kernels、typed attention與heterogeneous batching各有overhead。報 preprocessing、sampling time、GPU memory、throughput、per-seed latency與metric。若複雜架構只在相同epochs但三倍時間下改善，結論需包含compute差異。

### 驗收

以相同split/sampler/budget比較relational MLP、R-GCN、RelGNN、RGT，逐一移除relation type、time與column encoding。報macro-per-relation、rare entity與cold-start；attention weights只作diagnostic，不作因果解釋。

## 自學檢查點

最後保存每個 relation 的 message norm、sample count 與 gradient norm，檢查熱門 relation 是否壓過其他類型、rare relation 是否完全沒有更新。若 attention 或 composite layer 改善，只在控制 relation frequency 後仍成立，才歸因架構。

先寫出 prediction unit、資料可用時間、negative set 與 metric，再跑模型。圖上的資料洩漏常沿另一種 relation 或未來邊發生，只看程式是否執行成功抓不到。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 13 official slides](https://web.stanford.edu/class/cs224w/slides/13-Advanced_topics_RDL.pdf)

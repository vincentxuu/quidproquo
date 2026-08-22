---
title: "Stanford CS224W 第 3 講：Graph Neural Networks：message passing 的第一個完整模型"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 4
tldr: "依 Fall 2025 官方投影片逐段整理第 3 講，涵蓋 從固定 embedding 到深度編碼器、message passing 框架、聚合與更新，並標出自學者拿不到的課堂材料。"
description: "Stanford CS224W Fall 2025 第 3 講完整 agenda 與自學筆記，只採用當期官方投影片，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-03-graph-neural-networks-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 3 講**，官方日期 2025-09-30。本篇依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/03-GNN1.pdf)重建內容；講者依投影片署名為 Jure Leskovec 與課程團隊。

## 材料與缺口

公開材料包含 03-GNN1.pdf 與 schedule 上的閱讀清單。Canvas 錄影、現場 Q&A、板書補充與 Ed 討論不公開，因此本文不推測那些內容；2021 YouTube 錄影也不作為 2025 講次證據。

## 本講完整 agenda

### 1. 從固定 embedding 到深度編碼器

前一講為每個節點直接學一個向量，遇到訓練時沒看過的節點就沒有參數可查。GNN 改成學一個共享函數，根據節點特徵與鄰居產生表示，因此可以做 inductive inference。

### 2. message passing 框架

一層 message passing 有兩步：先把鄰居訊息以 permutation-invariant 函數聚合，再與節點自己的狀態合併更新。堆疊 K 層後，表示最多接收 K-hop 鄰域訊息。

### 3. 聚合與更新

GCN 使用正規化鄰接關係混合鄰居；GraphSAGE 把鄰居聚合器與中心節點表示分開，再串接或組合。兩者差異提醒我們：正規化、self-loop 與聚合器都屬模型定義。

### 4. GCN 與 GraphSAGE

節點任務直接讀節點表示；邊任務組合兩端表示；圖任務再以 sum、mean 或其他 readout 聚合整張圖。readout 也必須不依賴節點排列。

### 5. 節點、邊與圖級輸出

動手時用三個節點手算一層更新，檢查張量形狀與正規化係數，再擴到框架。這比直接跑大型資料集更快抓到漏加 self-loop 或方向弄反。

## 投影片逐段拆解

### 從 node lookup 走向共享函數

GNN 的輸入是節點初始特徵 x_v 與圖結構，輸出 h_v^(K)。第 k 層為每個節點收集上一層鄰居表示，先 aggregate，再與自己的表示 combine。所有節點共享同一組權重，因此參數量不隨節點數增加，也能對訓練時沒看過但有特徵與鄰域的新節點做 inference。這是與 node2vec lookup embedding 最關鍵的差別。

### Computational graph 不是原圖本身

為目標節點展開 K 層後得到 K-hop computational graph。第一層鄰居的訊息還要依賴它們的鄰居，所以 fanout 會近似指數成長。兩層模型不只是「看兩跳」：第一跳節點先把第二跳聚合成自己的狀態，再傳回中心。畫出 computational graph 能發現重複節點、方向與 sampling，也能說明為何 full-batch 與 neighbor sampling 的計算成本不同。

### Aggregation 必須是集合函數

鄰居沒有固定順序，aggregate 應對 permutation invariant。Mean 產生平均鄰居，sum 同時保留數量，max 擷取各維最強訊號；不同集合可能被 mean 或 max 映成同一結果。Combine 階段決定中心節點自己的訊息是否保留。漏掉 self feature 的模型可能讓具有相同鄰居但自身屬性不同的節點變得相同。

### GCN 的正規化

GCN 常先加 self-loops，再以 degree 對稱正規化 adjacency。直覺是每個節點把 transformation 後的表示分給鄰居，同時避免高 degree 節點的數值尺度壓過其他節點。實作最常見的錯是資料已含 self-loop，layer 又加一次；或 directed graph 被預設對稱化。手算四節點 path 的 normalized coefficient，可以在訓練前抓到這些錯。

### GraphSAGE 的 inductive recipe

GraphSAGE 先對 sampled neighborhood 做 mean、pooling 或 LSTM aggregator，再把鄰居摘要與中心表示串接、經線性層與非線性，有時再做 L2 normalization。它學的是 aggregation function，不是每個節點 ID。Sampling 讓固定大小 mini-batch 成為可能，但每次只看到鄰域估計；fanout 太小會漏訊號，太大則讓記憶體快速增加。

### Supervised 與 unsupervised objective

有 node labels 時，可在有標籤節點的 output 上做 cross-entropy；沒有足夠 labels 時，投影片也給 graph-based unsupervised loss：相近節點是正例，遠端或 sampled nodes 是負例。Encoder 相同不代表表示相同，因為 supervision 定義了要保留什麼。做 node classification 時，validation/test labels 不應進 loss，但其 feature 與 edge 是否可見取決於 transductive 或 inductive protocol，必須明寫。

### Link 與 graph prediction 怎麼接

Edge-level decoder 可 concat、Hadamard product、distance 或 inner product 組合兩端 embedding。Graph-level task 則先對全部 node embeddings 做 global sum/mean/max 或更複雜 readout。Readout 必須 permutation invariant。Batch 多張圖時要用 graph membership index 分開聚合，否則不同圖的節點會被加在一起，這是程式仍能執行但語意完全錯的 bug。

### Receptive field 與 depth

K 層最多整合 K-hop 訊息，但「資訊可達」不等於「模型可用」。層數增加會帶來 over-smoothing、over-squashing 與最佳化問題；本講先建立 locality，後續理論課再處理表達上限。選 depth 應根據任務所需路徑長度做 hypothesis，例如兩跳共同鄰居任務先試兩層，而不是從十層開始。

### 最小手算與框架核對

取三節點 chain，初始 scalar feature 分別為 1、0、2。先手算加 self-loop 的 mean aggregation，再套一個共享 scalar weight。接著交換節點編號，確認 output 跟著交換；加入一個孤立節點，確認 self-loop 使它仍保留自己的特徵。最後才用 PyG 重現。若結果不同，逐項核對 edge index 是否雙向、是否加 self-loop、aggregate 是 add 或 mean、矩陣乘法順序。

## 完整 GNN 實驗審查

### 1. 令 node-state matrix 的第一維固定對應節點，sparse adjacency 與 dense feature 相乘時，edge index 的 source/target convention 決定 incoming 或 outgoing propagation

令 node-state matrix 的第一維固定對應節點，sparse adjacency 與 dense feature 相乘時，edge index 的 source/target convention 決定 incoming 或 outgoing propagation。先標 tensor shapes，再寫公式，能抓出 broadcasting 與矩陣順序造成的靜默錯誤。

### 2. Isolated node 的空鄰域可能產生零 message

Isolated node 的空鄰域可能產生零 message。Self-loop 或 combine 中保留 center state，才能讓它使用自己的 feature。資料報告應列 isolated 比例並單獨評估；否則平均 metric 可能掩蓋一整群完全沒有結構訊息的節點。

### 3. Neighbor averaging 常隱含 homophily，但真實邊可能連接不同類別

Neighbor averaging 常隱含 homophily，但真實邊可能連接不同類別。Heterophily 下直接 mean 會沖淡有用 signal，edge direction、relation type、center feature 與較淺層表示更重要。失敗不代表圖無訊號，也可能是 aggregation bias 不合。

### 4. 小圖可 full-batch；大圖以 seed nodes 逐層 sample

小圖可 full-batch；大圖以 seed nodes 逐層 sample。Sampling 讓 gradient 有 variance，train 與 inference fanout 不同也會造成落差。比較實驗須固定 sampler、fanout、replacement、batch size 與 full-neighborhood evaluation policy。

### 5. 錯誤分析按 degree、isolation、label frequency、neighborhood homophily 分桶，並追蹤不同節點 embedding cosine similarity 隨深度的變化

錯誤分析按 degree、isolation、label frequency、neighborhood homophily 分桶，並追蹤不同節點 embedding cosine similarity 隨深度的變化。低 degree 差可能是訊息少，高 degree 差可能是 sampling 或 compression，全面變相似則指向 over-smoothing。

### 6. 兩節點若在每層收到相同 multiset，標準 GNN 就會產生相同表示

兩節點若在每層收到相同 multiset，標準 GNN 就會產生相同表示。這是後續 WL、GIN、identity-aware、position-aware 方法的接口：先精確指出 aggregation 丟了什麼，再談增加表達能力。

### 最終驗收題

準備三個 counterexample。第一個是交換 node IDs，輸出應同步 permutation；第二個是同 feature 但不同 degree 的節點，sum 與 mean aggregation 應呈現不同可區分性；第三個是加入 test edge 後才會連通的兩群節點，training adjacency 絕不能包含那條 edge。對每個例子保存 layer-by-layer h_v，而不是只看 final logits。若錯誤在第一層已發生，調 prediction head 沒用；若 node states 正確但 logits 錯，再查 loss、label mapping 與 mask。這套驗收把 invariance、expressivity 與 leakage 分成可定位的三類。

## 這講接到哪裡

本講的交付物是一份 layer trace：對同一張 tiny graph 列出初始 feature、每層 neighbor multiset、aggregate、center combine 與 final prediction。再列出框架設定中的 self-loop、flow direction、aggregation name 與 normalization。只要手算和程式在某層第一次分歧，就停在那層修正；不要用更多 epochs 掩蓋語意錯誤。這份 trace 也是後續判斷 WL 表達限制與 over-smoothing 的基準證據。

第 3 講建立的概念會在後續講次繼續組合。閱讀時保留自己的小圖、符號表與 baseline；每遇到新模型，就問它改了資料、訊息、聚合、更新、目標函數或評估中的哪一項。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 3 official slides](https://web.stanford.edu/class/cs224w/slides/03-GNN1.pdf)

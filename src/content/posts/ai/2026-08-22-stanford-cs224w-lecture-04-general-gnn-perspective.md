---
title: "Stanford CS224W 第 4 講：A General Perspective on GNNs：把模型拆成可設計的元件"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 5
tldr: "依 Fall 2025 官方投影片逐段整理第 4 講，涵蓋 GNN 設計空間、訊息、聚合與更新、GraphSAGE，並標出自學者拿不到的課堂材料。"
description: "Stanford CS224W Fall 2025 第 4 講完整 agenda 與自學筆記，只採用當期官方投影片，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-04-general-gnn-perspective-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 4 講**，官方日期 2025-10-02。本篇依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/04-GNN2.pdf)重建內容；講者依投影片署名為 Jure Leskovec 與課程團隊。

## 材料與缺口

公開材料包含 04-GNN2.pdf 與 schedule 上的閱讀清單。Canvas 錄影、現場 Q&A、板書補充與 Ed 討論不公開，因此本文不推測那些內容；2021 YouTube 錄影也不作為 2025 講次證據。

## 本講完整 agenda

### 1. GNN 設計空間

這講不再把 GNN 當單一公式，而是拆成 message、aggregation、update、layer connectivity 與 readout。拆開後才能精確比較模型，也能知道改一個元件到底改了什麼。

### 2. 訊息、聚合與更新

聚合必須對鄰居排列不敏感；sum、mean、max 保留的資訊不同。更新階段可以串接中心與鄰居訊息，也可以加 residual connection、normalization 與非線性。

### 3. GraphSAGE

GraphSAGE 的鄰居採樣讓 mini-batch 訓練不必展開整張圖；代價是每次只看到鄰域的估計。採樣大小因此同時影響計算成本與訊息品質。

### 4. Graph Attention Networks

GAT 用 learned attention 為鄰居加權，但權重仍在局部鄰域內正規化。attention 並不自動解決長距離資訊或過深網路的問題。

### 5. 採樣、深度與效率

實驗時建立元件表：聚合器、層數、hidden dimension、normalization、dropout、採樣策略與 readout。一次只改一個軸，否則結果無法歸因。

## 投影片逐段拆解

### 用 design space 取代模型名稱清單

投影片把一層 GNN 拆成 message、aggregation、combine/update，再把整個 network 拆成 pre-process、stack of layers、skip connection、post-process 與 prediction head。這個分解讓 GCN、GraphSAGE、GAT 不再是三個孤立公式，而是 design space 中不同選項。比較模型時應列出每一軸，避免把 hidden dimension、normalization 與 training budget 的差異誤認為 aggregator 的效果。

### Message 的資訊來源

最簡單 message 只傳鄰居 h_u，也可以同時使用 sender、receiver、edge feature 與 relation type。若 edge 表示時間、距離或鍵型，忽略 edge feature 等於刪除任務可能需要的訊號。Message function 可是 linear transformation 或 MLP；參數共享範圍決定模型是否能跨節點與圖泛化。Directed graph 還要決定 incoming、outgoing 是否用不同函數。

### Aggregation 與 expressivity

Sum、mean、max 都不依賴鄰居順序，但保留的統計不同。Sum 能區分重複數量，mean 把不同大小但相同比例的 multiset 映成同值，max 只留每維極值。Attention 是 learned weighted sum，權重在鄰域內正規化；它能選擇鄰居，卻不自動成為 injective set function。第六講的 WL/GIN 理論正是從這裡追問「哪些不同鄰域會被映成同一向量」。

### Update、residual 與 normalization

Aggregate 後要與中心狀態合併，可以相加、串接或送進 recurrent update。Residual/skip connection 為舊表示提供短路，幫助深層最佳化，也讓模型保留不同 hop 的訊號。BatchNorm、LayerNorm 與 graph normalization 的統計單位不同；小圖 batch 或 degree 分布偏斜時，選擇會影響結果。Normalization 應列入實驗設定，不是被框架預設藏起來。

### GAT 的 attention 計算

GAT 先線性轉換節點表示，再為 edge (u,v) 計算未正規化 attention score，對 v 的鄰居做 softmax，最後加權聚合。Multi-head attention 可 concat 或 average 多組結果。Mask 只在現有 edge 上算，因此仍是 local message passing，不等於 transformer 的 global all-pairs attention。看 attention weight 也不能直接當因果 explanation；它只描述該 layer 在當前輸入的權重。

### GraphSAGE sampling 的兩面

逐層固定 fanout 使一批 seed nodes 的計算量可控。例如兩層各取 10 個鄰居，理想上每個 seed 展開約 100 個第二跳樣本，而不是整張圖。實際會有重複節點與不同 degree。Sampling 帶來 stochastic estimate，訓練與 inference 若使用不同 fanout 可能產生落差。報告結果時應附 sampler、fanout、replacement 與 directed policy。

### Layer connectivity 是模型的一部分

Stacked layers 可以 plain、residual、dense/Jumping Knowledge 等方式連接。只讀最後一層等於只保留最深 receptive field 的結果；concat 多層可讓 prediction head 選擇局部或較遠資訊，代價是維度與記憶體增加。對 heterophilous graph，過度混合鄰居可能傷害預測，保留較淺表示尤其重要。

### GraphGym 的實驗觀

GraphGym 把 layer type、depth、width、activation、normalization、dropout、optimizer 與 training schedule 寫進設定，目標是系統性探索 design space。好的 sweep 不是把所有組合丟進搜尋，而是先固定資料與 budget，建立單一軸 ablation。每次 sweep 要保存 config、seed、best epoch 與完整 validation curve，避免只挑最好 run。

### 可重現的 component table

為一個 node classification baseline 建表：message 是否含 edge feature；aggregate=mean；combine=concat；兩層；residual=off；normalization=LayerNorm；dropout=0.5；fanout 固定；readout 不適用。下一個實驗只把 aggregate 換成 attention，其他完全相同。若提升不穩定，就看多個 seed 與 validation variance，而不是立刻宣稱 GAT 優於 GraphSAGE。這就是本講「general perspective」真正能帶走的工作方法。

## Design-space 審查細節

### 1. Pre-process MLP 投影 raw feature，post-process MLP 則在 message passing 後增加 node-wise capacity

Pre-process MLP 投影 raw feature，post-process MLP 則在 message passing 後增加 node-wise capacity。若只加深 post-process 就提升，不能宣稱圖傳播變強。Ablation 要分開「每節點獨立計算」與「沿 edge 計算」。

### 2. Edge feature 可進 message、attention score 或兩者

Edge feature 可進 message、attention score 或兩者。距離若只進 score 會改權重，若進 message 則成為傳遞內容，兩種設計不等價。Directed graph 還要標明 incoming/outgoing 是否共享參數。

### 3. Feature dropout、attention dropout、edge dropout、layer dropout 改的是不同物件

Feature dropout、attention dropout、edge dropout、layer dropout 改的是不同物件。只報 dropout=0.5 不可重現。Edge dropout 對 low-degree node 可能直接刪掉唯一證據，因此應按 degree 做敏感度分析。

### 4. 公平比較可以固定 parameter count、training time 或 peak memory，但三者通常無法同時一致

公平比較可以固定 parameter count、training time 或 peak memory，但三者通常無法同時一致。先選主要 budget，再報其餘成本。讓 attention model 訓練更久、搜尋更多設定，結果不再是 architecture-only comparison。

### 5. 圖實驗有 split、sampling、initialization、dropout 多種隨機性

圖實驗有 split、sampling、initialization、dropout 多種隨機性。區分 split seed 與 model seed，固定 split 跑多個 seeds，報 mean 與 variation；若同時更換 split，就明說評估包含資料切分 variance。

### 6. 閱讀 config 時翻成六句：初始資訊、沿哪些 edge、message 含什麼、如何 aggregate、中心狀態是否保留、在哪個單位計 loss

閱讀 config 時翻成六句：初始資訊、沿哪些 edge、message 含什麼、如何 aggregate、中心狀態是否保留、在哪個單位計 loss。寫不出這六句，代表仍不了解 framework defaults。

### 最終驗收題

做一個 2×2 component grid：mean 對 attention、plain 對 residual，其他 hidden dimension、layers、sampler、optimizer、epochs 與 seed 全固定。先報四格 parameter count、time 與 peak memory，再報 validation distribution。若 attention 只在 plain connection 有效，結論是 interaction effect，不能寫成 attention 普遍更好。接著把 edge features 關閉，確認提升是否依賴 attention 讀到的 edge signal。最後用相同 config 重新跑 node permutation test。這個小 grid 比無限制 hyperparameter search 更能回答 design component 的因果問題。

## 這講接到哪裡

本講的交付物是一張 component matrix，每列是一個 run，每欄只放一個可解釋設計軸。除了 metric，必須留下 parameter count、training time、memory、seed 與 validation curve。任何結論都改寫成「在固定哪些條件下，替換哪個元件，觀察到什麼差異」，而不是「某模型最好」。這種句型迫使實驗保留比較條件，也讓下一個人能直接重跑，而不必猜 class name 背後的預設。

第 4 講建立的概念會在後續講次繼續組合。閱讀時保留自己的小圖、符號表與 baseline；每遇到新模型，就問它改了資料、訊息、聚合、更新、目標函數或評估中的哪一項。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 4 official slides](https://web.stanford.edu/class/cs224w/slides/04-GNN2.pdf)

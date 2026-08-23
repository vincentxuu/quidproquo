---
title: "Stanford CS224W 第 8 講：Graph Transformers：attention 如何接上圖結構"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 9
tldr: "依 Fall 2025 官方投影片整理第 8 講，涵蓋 self-attention 與 message passing、圖上 attention 的範圍、位置與結構編碼，並標出無法公開取得的課堂材料。"
description: "Stanford CS224W Fall 2025 第 8 講完整 agenda 與自學筆記，只採用當期官方投影片，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-08-graph-transformers-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 8 講**，官方日期 2025-10-16。本文依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/08-graph-transformer1.pdf)整理；講者依投影片署名為 Jure Leskovec、Charilaos Kanatsoulis 與課程團隊。

## 材料與缺口

公開材料包含投影片與 schedule 列出的 optional readings。Canvas 錄影、現場 Q&A、板書及 Ed 討論不公開，因此本文不推測；2021 公開影片也不當成 2025 講次內容。

## 本講完整 agenda

### 1. self-attention 與 message passing

Transformer 原本把輸入視為 token 集合；圖卻沒有天然序列順序。Graph Transformer 的核心因此不只是套 attention，而是決定哪些節點可互看，以及用什麼訊號表達拓撲。

### 2. 圖上 attention 的範圍

把 attention mask 限制在鄰接邊上，就得到一種 learned aggregation 的 message passing；開放全域 attention 則能直接傳長距離訊息，但成本與忽略局部結構的風險都上升。

### 3. 位置與結構編碼

位置編碼補回節點在圖中的結構資訊。候選包括最短路徑距離、degree、random-walk statistics 與 spectral features；每一種都保留不同不變性。

### 4. Laplacian eigenvectors

Laplacian eigenvectors 提供全域座標，但 eigenvector 的正負號不唯一，重複 eigenvalue 下基底也不唯一。模型若直接把座標當普通特徵，可能對等價表示敏感。

### 5. local-global hybrid

實務設計常混合 local message passing 與 global attention。評估時要分別做無位置編碼、只 local、只 global 與 hybrid 的 ablation，否則無法知道提升來自哪裡。

## Graph Transformer agenda 深入拆解

### 為何普通 Transformer 不夠

把每個 node 當 token 丟進 vanilla Transformer，self-attention 對 token permutation 等變，但沒有 graph topology；模型只看到 feature set。Graph Transformer 必須決定 topology 進入 attention mask、attention bias、value/message、positional encoding 的哪一處。不同注入方式保留不同圖歸納偏置，不能只用一個名稱概括。

### Attention 等價於 message passing

若每個 node 只對 adjacency neighborhood 做 attention，query/key 產生 learned edge weights，value 是 neighbor message，softmax 後加權聚合；這仍是一層 local message passing。它與 GAT 同屬 neighborhood attention。允許 all-pairs attention 才有一層全域 receptive field，但 O(n²) 成本限制大型圖。

### Local 與 global

Local attention 尊重 sparse topology、成本近似 edge 數，但多跳資訊仍需深層；global attention 直接連遠端，卻可能讓模型忽略 edge semantics，且 memory 隨 node pair 增長。Hybrid architecture 同時跑 local GNN 與 global attention，再合併兩路。Ablation 必須拆 local-only、global-only、hybrid 與相同 compute baseline。

### Structural encoding

Degree encoding 提供局部角色；shortest-path distance 可成 pairwise attention bias；edge type/path feature 可告訴 attention 兩 node 如何連接；random-walk statistics 提供多尺度 return probability。這些不是互換的 positional encoding：有的屬 node feature，有的屬 pair bias，有的依全圖計算。

### Laplacian positional encoding

Graph Laplacian eigenvectors提供連續全域座標，低頻 vectors 描述大尺度結構。取前 k 個 eigenvectors 作 node feature 能打破部分對稱，但 eigenvector sign 可翻轉；重複 eigenvalue 的 basis 還可任意旋轉。模型若把 raw coordinates 當固定真值，就可能對同一圖的等價 eigendecomposition 給不同結果。

### Sign 與 basis invariance

SignNet 類思路對 v 與 -v 做對稱處理，basis-invariant 方法則處理 eigenspace 內旋轉。訓練時隨機 sign flip 是簡單 augmentation，但不能完整解決 repeated eigenvalue basis ambiguity。驗收要對同一圖人工翻 sign 或旋轉 degenerate basis，檢查 graph/node output 是否保持預期不變。

### Graphormer 類 bias

Graph transformer 可把 shortest-path distance、centrality 與 edge-path encoding 加進 attention score，使全域 attention 仍知道圖距離與路徑。Bias 的 bucket size、unreachable pair 與 directed distance 都要定義。若先在完整 temporal graph 計 shortest path，仍可能透過未來 edge 洩漏。

### Token 與 virtual node

加入 graph token 或 virtual node，讓它與所有 nodes 互動，可作 graph-level readout 或全域訊息樞紐。它用 O(n) star connections 提供短路，但所有資訊經固定維度 token 也可能形成 bottleneck。要比較 global token、sum pooling 與 full attention，而非預設 token 一定較強。

### Scaling

全域 attention 的 n² memory 使 sampling、sparse attention、cluster/block attention 成為必要。Subgraph mini-batch 會截斷全域 positional statistics；precompute encoding 又可能昂貴。報告 graph size、node pairs、memory、latency 與 preprocessing time，避免只報 accuracy。

### 驗收 protocol

用 path、cycle、兩個遠距相連 communities 三組圖測試。比較 local GNN、global attention without PE、Laplacian PE、shortest-path bias 與 hybrid。對每組做 permutation、eigenvector sign、held-out-edge leakage tests；固定 parameter/time budget，確認改善究竟來自全域連接、位置資訊或更多計算。

## 實作與證據邊界

### Attention bias 與 mask

Mask 決定哪些 pairs 完全不可見，bias 只改可見 pair 的 score。Shortest-path cutoff mask 會硬刪遠端；distance bias 則仍允許互動。兩者在 disconnected graphs 的處理不同，需定義 infinity bucket 或 separate component token。

### Edge path encoding

兩節點間最短路徑可能不唯一。若只取一條 path 的 edge types，結果依 tie-breaking；聚合所有 shortest paths 成本又高。實作需說 path selection 與 directed edge orientation，否則相同模型名稱可能得到不同輸入。

### Precomputation split

Laplacian eigenvectors、shortest paths 與 random-walk statistics 若在完整 graph precompute，link/temporal task可能看見 held-out structure。正確做法依 protocol 在 training graph 或每個 snapshot 計算，並把 preprocessing cost 和 cache size納入報告。

### Numerical stability

Repeated eigenvalues 在近似數值下不一定被精確辨認，跨 graph batching 也有不同 k 與 disconnected components。需要 padding/mask、eigenvalue ordering 與 tolerance policy。Sign augmentation 每 epoch 改 coordinates 時要與 caching 配合。

### 驗收輸出

除了 task metric，保存 attention sparsity、distance bucket performance、不同 graph size latency、PE ablation 與 sign-flip invariance。若全域 attention 只在小圖有效但大圖 OOM，結論必須包含可部署範圍。

### 最終 transformer 驗收

建立同 feature 的 path、cycle、disconnected components 與兩個遠距 communities。依序跑 no-PE global attention、adjacency-masked attention、shortest-path bias、Laplacian PE、local-global hybrid。每個模型做 node permutation；spectral model 再做 sign flip/basis rotation；link task 在移除 held-out edge 後重算所有 PE。保存 accuracy、memory、precompute time、latency 對 graph size 曲線。若方法只在用完整圖 precompute 時提升，視為 leakage；若只在小圖可跑，結論限定小圖而非宣稱 scalable。

## 自學檢查點

最後審查 batching：不同大小 graph padding 後，attention mask 必須同時遮 padding nodes 與不允許的 pairs；graph token 不能跨 batch graphs 互看；Laplacian vectors 的 padding 也不能被當成真座標。用兩張互不相干的小圖單獨推論，再放進同一 batch，輸出應一致。若 batch 後改變，通常是 mask、normalization 或 positional padding 錯，而不是模型隨機性。這項 invariance test 對所有 graph transformer implementation 都應成為固定單元測試。

拿一張最小圖或一組最小三元組，寫出輸入、模型保留的不變性、輸出與評估方式。若兩個例子理應不同卻在每一步都相同，就找到這個 encoder 的表達缺口。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 8 official slides](https://web.stanford.edu/class/cs224w/slides/08-graph-transformer1.pdf)

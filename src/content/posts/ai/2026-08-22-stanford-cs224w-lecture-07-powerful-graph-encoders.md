---
title: "Stanford CS224W 第 7 講：Designing Powerful Graph Encoders：結構辨識與位置辨識"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 8
tldr: "依 Fall 2025 官方投影片整理第 7 講，涵蓋 完美 GNN 的思想實驗、標準 GNN 的三層失敗、identity-aware encoding，並標出無法公開取得的課堂材料。"
description: "Stanford CS224W Fall 2025 第 7 講完整 agenda 與自學筆記，只採用當期官方投影片，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-07-powerful-graph-encoders-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 7 講**，官方日期 2025-10-14。本文依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/07-theory2.pdf)整理；講者依投影片署名為 Jure Leskovec、Charilaos Kanatsoulis 與課程團隊。

## 材料與缺口

公開材料包含投影片與 schedule 列出的 optional readings。Canvas 錄影、現場 Q&A、板書及 Ed 討論不公開，因此本文不推測；2021 公開影片也不當成 2025 講次內容。

## 本講完整 agenda

### 1. 完美 GNN 的思想實驗

投影片先提出「完美 GNN」：同構鄰域應有相同表示，不同鄰域應有不同表示。這個定義很快暴露兩種需求其實衝突——有些任務要結構不變性，有些任務要知道絕對或相對位置。

### 2. 標準 GNN 的三層失敗

標準 GNN 可能在 node、edge、graph 三個尺度遇到相同 computational graph，因而分不出原始輸入。對稱性不是訓練不夠久，而是輸入與 aggregation 留下的資訊相同。

### 3. identity-aware encoding

identity-aware 方法在為目標節點計算時標記其身分，讓訊息知道「相對於誰」傳遞。它可以辨認標準匿名 message passing 看不到的 cycle 與局部結構。

### 4. substructure counting

另一條路是顯式加入 motif、walk 或子圖計數，使 encoder 接收更高階結構訊號。代價是前處理、計算量與選擇哪些 substructure 的歸納偏置。

### 5. position-aware encoding

position-aware 方法用 anchor 或距離描述節點在整張圖的位置。選 encoder 前先問任務需要 structural role、community proximity 還是相對位置；三者不是同一種相似。

## 強大 encoder 的兩條路

### 完美 GNN 的矛盾

投影片先假設 perfect GNN：相同 neighborhood structure 得相同 embedding，不同 structure 得不同 embedding。但 position-aware task 可能希望結構相同、位置不同的節點得到不同表示。這揭露兩種目標：structural equivalence 要忽略絕對位置，position awareness 則要知道節點相對於 anchor 或整張圖的位置。模型沒有單一普遍正確的不變性。

### Node-level failure

標準 GNN 以匿名 neighborhood aggregation 建 computational graph。兩個 target nodes 若展開後每層 tree 相同，即使原圖中的 cycle membership 不同，也可能得到相同 embedding。Identity-aware 方法在每次以 target 為中心計算時標記它，使 message 能區分「這個出發點」與普通節點，進而辨認匿名 aggregation 看不到的封閉 walk。

### Edge-level failure

Edge task 常把兩端 node embeddings 組合。若兩條 edge 的端點各自具有相同 rooted neighborhoods，decoder 就看不到兩端在原圖中共享哪些結構或兩條 edge 間的高階關係。以 edge 為 target 建 enclosing subgraph、標記 endpoints，能讓 encoder 直接處理 pair-specific context，而非只拼兩個獨立 node vectors。

### Graph-level failure

Regular 或高度對稱圖可能讓所有 nodes 在每層收到相同 multiset，global pooling 後不同圖也相同。加入 substructure counts、higher-order tuples、random/unique identifiers 或 spectral information 都可能打破部分對稱，但同時改變 invariance、成本與泛化假設。應說清楚模型靠哪種額外訊號超越匿名一維 message passing。

### Identity-aware encoding

ID-GNN 類方法不是把永久 node ID 當 feature，而是對目前 target 注入 identity indicator，再共享參數做 conditional encoding。這保留跨圖泛化的可能，也讓不同 target 使用不同 computational context。代價是可能需為多個 targets 重算，訓練與 inference 成本比一次產生全圖 embedding 高。

### Substructure-aware GNN

另一條路是顯式計數或編碼 cycles、motifs、walks、rooted subgraphs。這些 feature 能補標準 GNN 看不到的 pattern。選哪些 substructures 是 inductive bias：triangle 對社群可能重要，特定 ring 對分子可能重要。全部枚舉會爆炸，因此需在表達力、計算與 domain prior 間取捨。

### Position-aware task

道路網格中結構相同的 intersections 可能因距離醫院或市中心不同而有不同目標。Position-aware GNN 以 anchor sets、shortest-path distance 或 relative positional encoding 描述位置。Anchor selection 影響解析度與成本；若 anchors 使用 test labels 或未來資訊，就會洩漏。位置 feature 需僅依 prediction time 可見的 graph 建立。

### 結構與位置的選擇

Community detection 偏好 proximity，role classification 偏好 structural equivalence，routing 或 location-specific prediction 偏好 position。先做 symmetry test：找兩個模型理應視為相同的節點與一對理應不同的節點。若無法寫出這兩對，就尚未決定所需 invariance，也無法公平選 encoder。

### Spectral 視角

投影片以 adjacency matrix 與 eigenbasis 連接 GIN/GraphSAGE 更新，說明 message passing 可視為 graph signal filtering。對稱結構會反映在 spectrum 與 eigenspaces；spectral feature 能帶全域訊號，但 eigenvector sign、重根 basis 與跨圖對齊都有 ambiguity。後續 graph transformer 會更完整處理 positional encoding 的不變性。

### 驗收 protocol

建立 cycle length、grid position、enclosing-subgraph 三組 synthetic tasks，分別測匿名 GNN、identity-aware、substructure-aware、position-aware encoder。固定 depth、width、budget，報 accuracy 與每 target inference cost。若方法只在加入 target label-like feature 後改善，先排除 leakage；若成本隨 target 數線性增加，也要列入結論。

## 實作與證據邊界

### Target conditioning

Identity-aware computation 對每個 target 改 input marking，所以同一 node 在不同 target query 中可有不同 state。Caching 全圖 embedding 的做法不再直接適用。工程上可 batch 多個 target markings 或只抽 enclosing subgraphs；成本報告需包含每 query 重算範圍。

### Pair labeling

Link prediction enclosing-subgraph 方法常以距離兩端點的 pair labels 標 nodes，使 encoder 知道相對位置。建立 labels 時必須先移除被預測 edge，否則最短距離直接暴露答案。這是 pair-aware encoder 最重要的 leakage test。

### Counting task

要測 triangle 或 cycle counting，dataset 需控制 degree 與 size，避免模型以簡單 proxy 猜答案。生成 degree-matched positive/negative graphs，再看 substructure-aware 方法是否仍優於匿名 GNN。否則所謂 counting 能力可能只是讀到 degree distribution。

### Anchor stability

Position-aware encoding 對 anchor choice 敏感。Random anchors 應多 seed，learned anchors 要只用 training objective，fixed landmarks 則需可套到新圖。若每張圖 node identity 不共享，絕對 anchor ID 不能跨圖泛化，需用 structural anchor selection。

### 失敗分類

若 structural task 失敗，先判斷是 standard GNN symmetry、depth 不足、feature 缺失或 optimization；若 position task 失敗，再查 anchor coverage 與 distance truncation。把所有問題統稱 expressivity，會導致選錯修正方法。

### 最終 encoder 驗收

為每個 task 寫 invariance contract：node permutation 是否應等變、automorphism 下哪些 nodes 應相同、target identity 是否允許、跨圖是否共享 anchor。接著用三組 matched pairs 分別只改 cycle、target position、endpoint relation。Standard、identity-aware、substructure-aware、position-aware methods 在相同 compute 下比較，並報 preprocessing 與 per-query latency。最後移除新增 structural/positional feature 做 ablation；若效能保持，複雜 encoder 沒有實際使用該訊號。若效能崩落，才能說明改進依賴哪個資訊來源。

## 自學檢查點

最終還要測 generalization boundary：在較小 cycles 或較短距離訓練，於更大 graph、未見 cycle length 與不同 anchor density 測試。Target-conditioned encoder 可能記住 training size pattern，substructure counter 可能超出預設 radius，position encoder 可能因 distance clipping 全部落入同一 bucket。逐項報 in-range 與 out-of-range，而不是只給混合平均。這個測試能區分「打破 training graphs 的對稱」與「學到可外推的結構規則」。

拿一張最小圖或一組最小三元組，寫出輸入、模型保留的不變性、輸出與評估方式。若兩個例子理應不同卻在每一步都相同，就找到這個 encoder 的表達缺口。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 7 official slides](https://web.stanford.edu/class/cs224w/slides/07-theory2.pdf)

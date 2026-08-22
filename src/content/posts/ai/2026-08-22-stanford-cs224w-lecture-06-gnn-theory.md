---
title: "Stanford CS224W 第 6 講：Theory of GNNs：WL test、GIN 與表達能力的上限"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 7
tldr: "依 Fall 2025 官方投影片整理第 6 講，涵蓋 什麼叫可區分、Weisfeiler–Lehman test、message passing 的上界，並標出無法公開取得的課堂材料。"
description: "Stanford CS224W Fall 2025 第 6 講完整 agenda 與自學筆記，只採用當期官方投影片，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-06-gnn-theory-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 6 講**，官方日期 2025-10-09。本文依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/06-theory.pdf)整理；講者依投影片署名為 Jure Leskovec、Charilaos Kanatsoulis 與課程團隊。

## 材料與缺口

公開材料包含投影片與 schedule 列出的 optional readings。Canvas 錄影、現場 Q&A、板書及 Ed 討論不公開，因此本文不推測；2021 公開影片也不當成 2025 講次內容。

## 本講完整 agenda

### 1. 什麼叫可區分

理論問題不是「模型能不能擬合」，而是兩個不同的局部結構會不會必然得到同一表示。若模型把它們壓成同一向量，任何後續 prediction head 都救不回差異。

### 2. Weisfeiler–Lehman test

一維 WL test 反覆把節點目前的顏色與鄰居顏色 multiset 做 hash。若某輪的顏色分布不同，就能判定兩張圖不同；但相同不代表同構。

### 3. message passing 的上界

標準 message-passing GNN 的區分能力不超過一維 WL。聚合器若不是 injective，甚至會比 WL 更弱：mean 會遺失重複次數，max 會遺失大部分頻率資訊。

### 4. GIN 與 injective aggregation

GIN 用 sum aggregation 加 MLP，目標是在有界 multiset 上近似 injective mapping。它說明模型結構如何貼近理論上界，但沒有宣稱能解決 WL 本身分不出的圖。

### 5. over-smoothing 與深度限制

增加層數擴大 receptive field，也可能讓節點表示越來越相似。實驗時應同時追蹤 validation metric 與不同節點 embedding 的距離，而不是把 deeper 當作必然更強。

## 理論 agenda 深入拆解

### 區分能力的問題設定

對 node encoder 而言，expressivity 問的是不同 rooted neighborhoods 是否會被映成不同表示；對 graph encoder，則問不同圖經 node encoding 與 readout 後是否可區分。這不是「參數夠不夠多」而已。若 aggregation 在第一層已把兩個 multiset 壓成同值，後面的 MLP 再深也只接到相同輸入，無法恢復被刪掉的 multiplicity 或結構。

### Graph isomorphism 與 WL

兩張圖若只差 node permutation 就是 isomorphic，graph classifier 應給相同結果。直接窮舉 n! permutations 不可行，WL color refinement 提供有效但不完備的測試：初始化 node colors，反覆把自身顏色與鄰居顏色 multiset 編碼成新顏色；若某輪 color histogram 不同，就可證明兩圖不同。Histogram 相同則只是 WL 未分出，不是同構證明。

### WL 與 message passing 對齊

一層 message passing 也把 center state 與 neighbor multiset 映成新 state，所以標準 GNN 的資訊流可與一維 WL 對齊。只要初始 feature 相同、每輪收到的 multiset 相同，shared update 就會產生相同 embedding。這給出 upper bound：一般 neighborhood aggregation 不會比一維 WL 更會區分；若 aggregator 不是 injective，還可能更弱。

### Mean 與 max 丟失什麼

Mean 無法區分元素比例相同但大小不同的 multiset，例如一個鄰居與兩個完全相同鄰居；max 則只保留每維最大值，重複次數與非最大元素都消失。Sum 在有界 multiset 與適當 mapping 下較有機會保留 multiplicity，但 sum 本身也不是萬能，仍需可表達的 transform 把不同元素映到足以分離的空間。

### GIN update

GIN 把 neighbor states 做 sum，再與乘上 1+epsilon 的 center state 相加，最後交給 MLP。Epsilon 可固定或學習，用來控制中心與鄰居的可區分性。設計目標是讓 aggregation/update 近似 injective multiset function，達到一維 WL 的區分能力上限。它沒有宣稱解決 WL 分不出的 regular graphs 或其他反例。

### Graph readout

Node-level expressivity 不自動等於 graph-level expressivity。Readout 若用 mean，兩張不同大小但 node-state distribution 相同的圖可能坍縮；sum 更能保留數量。GIN 的 graph representation 常結合不同 layers 的 node summaries，因為每層對應不同 hop scale。Readout、layer selection 與 node encoder 一起決定最終 graph distinction。

### Over-smoothing

多層 propagation 反覆混合鄰居，node states 可能越來越接近，最後只剩圖的低頻訊號。這是 optimization/representation dynamics，與 WL expressivity 上限相關但不相同：架構理論上可區分，不代表訓練後一定保留差異。可追蹤 pairwise cosine similarity、class separation 與 depth ablation，不能只看 training loss。

### Over-squashing

遠方 exponentially growing 的資訊被壓進固定維度 vector，會造成 over-squashing。即使 K 層讓訊息理論上可達，狹窄 graph bottleneck 仍讓梯度與資訊難傳。增加 width、rewiring、global attention 或 positional signal 是不同方向；在採用前應先用 task dependency distance 與 graph curvature/bottleneck 直覺定位問題。

### 理論反例怎麼用

反例不是只放在證明裡。建立兩個 WL 無法分辨或 mean aggregator 會坍縮的 tiny graphs，初始化相同 features，逐層印出 embeddings。若 library model 意外分出，先查是否加入 node IDs、random features、positional encodings 或不同 normalization；那些額外資訊已改變理論設定。

### 驗收 protocol

交付一張 expressivity audit：初始 feature 假設、aggregator 是否 injective、center state 如何保留、depth、readout、理論上限與一個 counterexample。再以相同 parameter budget 比 mean、max、sum+MLP，報多 seed 與 graph size generalization。結論限定在測試分布，不把「達到 WL 上限」寫成「能識別所有圖」。

## 實作與證據邊界

### 初始 feature 假設

WL/GNN 比較一定要寫初始 colors/features。所有節點同常數時只靠結構；若加入 degree、node ID 或 random feature，原本對稱可能已被外部訊號打破。比較論文或實驗時，encoder architecture 相同但 initial encoding 不同，就不是同一 expressivity setting。

### Local 與 global distinction

K-layer GNN 只見 K-hop neighborhood，因此即使 WL 最終能分辨兩圖，有限 K 也可能來不及。理論 statement 常假設 refinement 迭代到穩定；實際模型受 depth 限制。報告 counterexample 時要分清是 local receptive-field limit、aggregator collision，還是 WL 本身的 global failure。

### Optimization 不等於 existence

Injective MLP 的存在性證明不保證 SGD 在有限資料與精度下找到它。Hidden dimension、activation、normalization 與 finite precision 可能讓不同 sums 接近或相同。Empirical expressivity 應用 controlled counting task 測試，並將 training failure 與 architecture impossibility 分開。

### Complexity

GIN 的 sum+MLP 與一般 sparse message passing 成本近似隨 edges 線性，但更高階 k-WL/tuple GNN 會在 node tuples 上計算，成本快速增加。表達力提升不是免費；若 graph 很大，substructure sampling 或 positional feature 可能是較務實替代。

### 結論句界線

正確說法是「在特定初始 feature 與 injective aggregation/readout 假設下，GIN 可達一維 WL 的區分力」。不能縮寫成「GIN 能判斷 graph isomorphism」或「sum 永遠最好」。前者超過定理，後者忽略尺度、degree 與 optimization。

### 最終理論驗收

建立四種 controlled pairs：mean 會坍縮但 sum 可分的 multiset、有限 depth 看不到差異的 long path、WL 可分但訓練失敗的 graphs、以及一維 WL 本身分不出的 regular graphs。對每對保存初始 colors、每輪 WL colors、每層 GNN embeddings 與 graph readout。這四組把 aggregator collision、receptive field、optimization 與 theorem ceiling 分離。再跑 width/depth/seed ablation，避免把一次沒學到誤寫成不可能。交稿時每個結論附假設：初始 feature、precision、readout 與 graph family；只要假設變了，結論就需重驗。

## 自學檢查點

最後再做一個 precision check：將 hand-crafted features 設為容易 collision 的整數，分別以 float32、float64 跑相同 sum+MLP，記錄接近但不相同的 neighborhoods 是否在 normalization 後難以區分。這不是推翻 WL 理論，而是提醒理論中的精確 injectivity 與實際有限精度/有限寬度有距離。若任務仰賴精確 counting，需把 count range、numeric precision 與 out-of-distribution graph size 納入測試。最終報告同時列「理論可區分」與「本次訓練成功區分」，不把兩者合併成一句。

拿一張最小圖或一組最小三元組，寫出輸入、模型保留的不變性、輸出與評估方式。若兩個例子理應不同卻在每一步都相同，就找到這個 encoder 的表達缺口。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 6 official slides](https://web.stanford.edu/class/cs224w/slides/06-theory.pdf)

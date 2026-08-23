---
title: "Stanford CS224W 第 2 講：Node Embeddings：從隨機漫步到 node2vec"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 3
tldr: "依 Fall 2025 官方投影片逐段整理第 2 講，涵蓋 編碼器—解碼器觀點、鄰近度與目標函數、隨機漫步，並標出自學者拿不到的課堂材料。"
description: "Stanford CS224W Fall 2025 第 2 講完整 agenda 與自學筆記，只採用當期官方投影片，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-02-node-embeddings-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 2 講**，官方日期 2025-09-25。本篇依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/02-nodeemb.pdf)重建內容；講者依投影片署名為 Jure Leskovec 與課程團隊。

## 材料與缺口

公開材料包含 02-nodeemb.pdf 與 schedule 上的閱讀清單。Canvas 錄影、現場 Q&A、板書補充與 Ed 討論不公開，因此本文不推測那些內容；2021 YouTube 錄影也不作為 2025 講次證據。

## 本講完整 agenda

### 1. 編碼器—解碼器觀點

Node embedding 把每個節點映到低維向量，並要求圖上相近的節點在向量空間也相近。核心不是降維本身，而是先定義「相近」。

### 2. 鄰近度與目標函數

編碼器為節點產生向量，解碼器用內積等函數重建節點相似度。目標函數把觀察到的鄰近節點拉近，也必須用負樣本避免所有向量坍縮到同一點。

### 3. 隨機漫步

DeepWalk 用截短隨機漫步產生類似句子的節點序列，再套用 skip-gram。它學到的是漫步共現，而不是只有一跳鄰居。

### 4. DeepWalk 與 node2vec

node2vec 以 return parameter 與 in-out parameter 調整下一步，讓漫步在偏 BFS 與偏 DFS 的探索間移動；這對結構角色與社群鄰近是不同的歸納偏置。

### 5. 負採樣與矩陣分解觀點

實作前先固定相似度定義、walk 長度、每節點 walk 數與負樣本策略，再用 link prediction 或下游分類驗證。不要只看二維視覺化判斷 embedding 好壞。

## 投影片逐段拆解

### 把 unsupervised learning 寫成一個明確目標

投影片的 encoder–decoder 框架從節點 u 出發，encoder 產生 z_u，decoder 以 z_u 與 z_v 的內積估計相似度。真正困難的是 similarity function：一跳相鄰、共享鄰居、隨機漫步共現與相同結構角色都會產生不同 embedding。若目標定義為「短 random walk 常遇到」，向量保留的是高階 proximity；它不保證兩個同為樞紐但位於不同社群的節點接近。

### Softmax objective 為什麼昂貴

給定 source node u，模型希望 context node v 的機率與 exp(z_u·z_v) 成正比，分母要對所有節點求和。大型圖上每一筆 pair 都掃過全部 V 不可行。Negative sampling 把完整 normalization 改成辨識 observed pair 與 sampled non-pair：拉高正例內積，壓低少量負例。負樣本分布不是實作細節；按 degree 抽樣與均勻抽樣會讓模型看到不同難度與頻率的反例。

### Random walk 是 proximity 的取樣器

短 random walk 同時保留局部連接與多跳可達性。從每個節點啟動多條固定長度 walk，再以窗口產生 source–context pairs，資料形狀就像 word2vec 的句子。Walk length 太短只看到局部，太長會接近 stationary distribution；window 太大則把遠距節點也視為 context。這三個超參數應與圖的 mixing behavior 一起理解，而不是照預設值抄。

### DeepWalk 的完整 pipeline

DeepWalk 先取樣 uniform random walks，再用 skip-gram 學節點向量。訓練資料不是 graph edges 本身，而是 walk window 產生的共現 pair；同一條邊可能多次出現，高 degree 節點也可能更常被採到。完成後 embedding 可餵給 logistic regression 做 node classification，或以內積做 link prediction。這是一個 two-stage pipeline，評估 classifier 時要固定 embedding 與 split，避免把 downstream tuning 誤算成 embedding 改善。

### node2vec 的 p 與 q

node2vec 的二階 walk 會記住上一個節點 t。候選下一節點 x 的權重依 x 與 t 的距離為 0、1、2 而變：return parameter p 控制立刻折返，in–out parameter q 控制向外探索。較 BFS 的 walk 留在局部社群，較 DFS 的 walk 探索可能具有相似角色的遠端節點。p、q 沒有普遍最佳值；任務若依 homophily，局部探索常合理，若依 structural equivalence，向外探索可能更合適。

### 從 skip-gram 看見矩陣分解

官方 reading 列出 Network Embedding as Matrix Factorization，因為 random-walk co-occurrence objective 可連到某種經平移的 PMI matrix factorization。這個觀點說明 embedding 不是神祕黑盒：walk policy 決定隱含矩陣的統計，window 與 negative distribution 改變被分解的量。它也提供 baseline——直接建立 proximity matrix 做 truncated SVD，能檢查神經訓練是否真的帶來價值。

### Transductive 限制

DeepWalk 與 node2vec 通常為訓練圖中每個 node ID 學一列參數。加入新節點後沒有 embedding，除非重新跑 walk 與訓練或另做映射。這是 transductive 方法的核心邊界，也是下一講 GNN 要解的問題：把 lookup table 換成可套到新節點的共享 neighborhood encoder。若資料會持續長新節點，這個維運成本必須在模型選型時就算進去。

### 評估不能只看 t-SNE

二維投影會扭曲距離，而且調整 seed 與 perplexity 就能改圖形。Node embedding 應在明確下游任務評估：node classification 固定標籤預算，link prediction 建立不洩漏的 held-out edges，clustering 報外部 label metric 時要說清楚 label 沒參與訓練。至少比較 random vector、degree features、spectral embedding 與 matrix factorization，才能知道 random-walk objective 的貢獻。

### 手算練習

在 triangle 接一條兩節點 tail 的圖上，從三角形內節點與 tail endpoint 各走十條短 walk。列出共現次數，再分別想像高 return probability 與高 outward probability。前者會重複局部邊，後者更容易跨過 articulation point。這個練習不用訓練模型，就能預測哪些節點會被拉近，也能抓出 directed graph 上把入邊、出邊弄反的錯誤。

## 公式與實驗審查

### 1. Directed graph 上，source–context pair 的方向會改語意

Directed graph 上，source–context pair 的方向會改語意。若程式自動把 edge 補成雙向，walk 已在另一張圖上執行；inner-product decoder 又是對稱的，不能表達所有非對稱 relation。這說明一般 proximity embedding 與後續 knowledge-graph relation embedding 的任務不同。

### 2. Random walk 的 stationary distribution 通常偏向 high-degree nodes，熱門節點更常成為 context

Random walk 的 stationary distribution 通常偏向 high-degree nodes，熱門節點更常成為 context。應按 degree bucket 報 downstream metric，並記錄起點與 negative distribution。只看全體平均會讓大量熱門節點掩蓋長尾表示品質。

### 3. Link prediction 必須先移除 test positive edges，再只在 training graph 上跑 walks

Link prediction 必須先移除 test positive edges，再只在 training graph 上跑 walks。若先用完整圖產生 embedding、最後才遮 label，test edge 已改變共現統計，構成結構洩漏。Negative edges 也要固定 candidate universe 與 sampling seed。

### 4. 重現 node2vec 至少需要 dimension、walk length、walks per node、window、p、q、negative count/distribution、epochs、optimizer、seed，以及 directed/weighted 設定與 isolated-node handling

重現 node2vec 至少需要 dimension、walk length、walks per node、window、p、q、negative count/distribution、epochs、optimizer、seed，以及 directed/weighted 設定與 isolated-node handling。這些共同定義訓練資料，只寫模型名稱遠遠不夠。

### 5. Node2vec 的強項是不需 node feature、固定圖上簡單有效；代價是 transductive、每個 node ID 都有參數、objective 與下游 supervision 分離

Node2vec 的強項是不需 node feature、固定圖上簡單有效；代價是 transductive、每個 node ID 都有參數、objective 與下游 supervision 分離。GNN 保留鄰域決定表示的想法，卻學共享 function，能處理新節點並端到端對齊任務。

### 最終驗收題

建立兩套 synthetic graph：第一套是兩個 dense communities 以少量橋接邊相連，第二套是多個彼此分離但形狀相同的 star。Community task 應偏好保留 local proximity 的 walk；structural-role task 則需要跨社群看到相似 hub/leaf pattern。對每套圖 sweep p、q，固定其他設定，畫出同類與異類 pair 的 cosine distribution，而不是只看單點 t-SNE。再加入五個新節點，確認 lookup embedding 無法直接產生向量，並記錄重新訓練成本。這個驗收同時測試 node2vec 的 BFS/DFS bias、評估方法與 transductive 限制。

## 這講接到哪裡

本講的交付物是一張 embedding protocol card：similarity 定義、walk transition、context window、negative distribution、decoder、downstream split 與 inductive boundary。另保存一個 walk pair 頻率表，抽查高 degree 與低 degree 節點各十個。若 pair frequency 與預期不符，先修 sampling；若 sampling 正確但下游失敗，再檢查 objective 與 decoder。這樣能避免把資料產生錯誤誤診為 optimizer 問題。

第 2 講建立的概念會在後續講次繼續組合。閱讀時保留自己的小圖、符號表與 baseline；每遇到新模型，就問它改了資料、訊息、聚合、更新、目標函數或評估中的哪一項。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 2 official slides](https://web.stanford.edu/class/cs224w/slides/02-nodeemb.pdf)

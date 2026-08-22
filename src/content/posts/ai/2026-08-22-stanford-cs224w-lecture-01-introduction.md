---
title: "Stanford CS224W 第 1 講：Introduction：為什麼關係資料需要圖機器學習"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 2
tldr: "依 Fall 2025 官方投影片逐段整理第 1 講，涵蓋 課程地圖與工具、圖資料的共同語言、傳統特徵與表示學習，並標出自學者拿不到的課堂材料。"
description: "Stanford CS224W Fall 2025 第 1 講完整 agenda 與自學筆記，只採用當期官方投影片，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-01-introduction-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 1 講**，官方日期 2025-09-23。本篇依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/01-intro.pdf)重建內容；講者依投影片署名為 Jure Leskovec 與課程團隊。

## 材料與缺口

公開材料包含 01-intro.pdf 與 schedule 上的閱讀清單。Canvas 錄影、現場 Q&A、板書補充與 Ed 討論不公開，因此本文不推測那些內容；2021 YouTube 錄影也不作為 2025 講次證據。

## 本講完整 agenda

### 1. 課程地圖與工具

投影片先把全課攤開：node embedding、GNN、graph transformer、知識圖譜、圖生成、RDL 與 GNN+LLM。重點不是背名詞，而是看見同一個問題：資料點之間的關係本身就是訊號。

### 2. 圖資料的共同語言

圖由節點與邊組成，可以是有向或無向、加權或無權，也可能帶節點與邊特徵。社群、分子、引用網路與關聯式資料庫表面不同，都能轉成這套語言。

### 3. 傳統特徵與表示學習

傳統流程先設計 degree、clustering coefficient 等特徵，再交給分類器；表示學習則讓模型從鄰域與結構學出向量。這個轉向是後面十九講的主軸。

### 4. 節點、邊與整張圖的任務

任務尺度決定輸出：節點分類、連結預測、圖分類各自需要不同 readout。先把預測單位寫清楚，再談模型，能避免把資料切分與評估做錯。

### 5. 本講的學習路線

自學時先挑一張小圖，為每個節點寫 degree、鄰居集合與一個預測目標。這個最小例子會成為後續檢查 embedding 與 message passing 的基準。

## 投影片逐段拆解

### 圖不是一種資料格式，而是一種建模選擇

投影片用 social、information、technological、biological networks 串起課程：節點可以是人、網頁、蛋白質或藥物，邊可以是互動、超連結或物理作用。關鍵不是「任何資料都能畫成圖」，而是關係是否影響預測。如果把邊打亂後結果幾乎不變，圖模型未必有必要；如果一個節點的標籤與鄰居、路徑或群體結構有關，圖才提供表格沒有的訊號。第一個動作是寫一句 graph construction contract：節點代表什麼、邊何時存在、方向與權重代表什麼、哪些屬性在 prediction time 已知。

### 四種圖與四種錯法

有向圖的入邊與出邊語意不同；無向圖才可把 adjacency 視為對稱。加權圖的權重可能是次數、距離或信任度，三者不能用同一正規化解讀。多重圖允許兩個節點間有多種關係，硬壓成一條邊會丟失 relation type。動態圖則要求每條邊與特徵帶時間，否則未來互動會洩漏到過去樣本。投影片把圖表示成 adjacency matrix 與 edge list；前者便於線性代數，後者適合稀疏儲存。真實大型圖通常不應配置完整的 n×n dense matrix。

### 任務尺度決定 label 與 split

Node-level task 的單位是節點，例如預測蛋白質功能；edge-level task 的單位是節點對，例如推薦或 link prediction；graph-level task 的單位是整張圖，例如分子性質。這三者不只換 prediction head。節點任務可能做 transductive mask，link prediction 要避免 validation/test edge 留在 training adjacency，graph classification 則應按圖分割。投影片也提到 community detection 與 clustering，這類沒有逐筆標籤的任務需要不同目標。先決定 prediction unit，再建立 split，是整門課反覆出現的資料紀律。

### 傳統圖特徵仍是必要 baseline

Degree 描述局部連接量，clustering coefficient 描述鄰居彼此連接程度，PageRank 類方法描述全域重要性，motif 與 graphlet 描述小型結構。表示學習沒有讓這些概念失效；它把「該計算哪個特徵」改成由 objective 與 architecture 學習。可靠實驗仍應拿簡單特徵加線性模型或樹模型當 baseline。如果 GNN 只打敗空模型、沒有打敗 degree baseline，結論應是資料主要靠局部連接量，而不是模型理解了複雜關係。

### Encoder、decoder 與 objective

全課可以用三個方塊讀：encoder 把節點或圖映成向量，decoder 把向量轉成相似度或預測，objective 決定哪些結果算好。Node embedding 的 encoder 可能是 lookup table；GNN 的 encoder 是共享 neighborhood function；graph transformer 則加入 attention 與 positional encoding。Decoder 可以是 inner product、MLP 或 task-specific head。兩個模型即使 encoder 相同，只要 negative sampling 或 loss 不同，學到的幾何就可能不同，因此不能只報 architecture 名稱。

### 為什麼 permutation invariance 是硬需求

同一張圖可任意重新編號節點。Graph-level output 不應因編號改變，node-level output 則應跟著 permutation 等變地重新排列。這是圖模型與序列模型最基本的差異。把 adjacency rows 直接當固定順序 token 而沒有處理 permutation，模型可能記住編號。後續 aggregation 採 sum、mean、max，以及 graph readout 必須對集合順序不敏感，都是從這個要求推導出來。

### 工具在課程中的位置

官方投影片列 PyTorch Geometric、GraphGym、SNAP.PY 與 NetworkX。NetworkX 適合小圖檢查與傳統演算法；PyG 把 sparse edge index、message passing layer、dataset 與 mini-batch 包成深度學習介面；GraphGym 用設定檔探索 GNN design space。工具不是證據。動手前應先用三節點圖手算預期輸出，再讓 library 執行；若結果不同，先檢查 self-loop、edge direction、normalization 與 batching，而不是立刻調 learning rate。

### 一個可重複的最小實驗

建立四節點 path graph，令每個節點只有常數特徵。任務一是預測 degree，任務二是區分端點與中間點，任務三是預測整張圖是否連通。先用 degree rule 完成前兩項，再用一層 neighborhood aggregation；最後任意重排節點編號，確認 node output 同步重排且 graph output 不變。這個實驗把 task scale、local structure、permutation 與 readout 放在同一個可檢查案例裡，後續每講都能重用。

## 案例與完整建模審查

### 1. 社群網路：預測使用者採用行為時，追蹤邊有方向，互動邊有時間與次數

社群網路：預測使用者採用行為時，追蹤邊有方向，互動邊有時間與次數。若壓成無向二元邊，就同時丟失三種資訊。以 prediction time 切圖，只使用當時存在的互動；先比較使用者屬性與 degree baseline，再加入鄰居行為，才測得到關係的增量價值。

### 2. 分子圖：atom 是節點、bond 是 typed edge，任務通常是 graph-level property

分子圖：atom 是節點、bond 是 typed edge，任務通常是 graph-level property。節點排列沒有化學意義，readout 必須 invariant；任意新增邊又可能違反 valence。隨機拆分相近 scaffold 會讓 test 偏容易，因此 graph construction、invariance 與 distribution shift 必須一起設計。

### 3. 知識圖譜：person—born_in—city 這類 edge 有 relation type 與方向，未記錄 triple 也不必然是假

知識圖譜：person—born_in—city 這類 edge 有 relation type 與方向，未記錄 triple 也不必然是假。把所有 relation 混成一種 homogeneous edge 會刪掉語意。後續 TransE、R-GCN 與 KG foundation model 都建立在 typed、directed、incomplete observation 之上。

### 4. 依賴鏈：node embedding 建 geometry，GNN 換成共享 encoder，design-space 課拆模型元件，augmentation 補資料與訓練，theory 說明上限，transformer 與 heterogeneous graph 處理全域和類型，RDL、LLM、agent、generation 再延伸任務

依賴鏈：node embedding 建 geometry，GNN 換成共享 encoder，design-space 課拆模型元件，augmentation 補資料與訓練，theory 說明上限，transformer 與 heterogeneous graph 處理全域和類型，RDL、LLM、agent、generation 再延伸任務。十九講是一條 pipeline，不是平行名詞。

### 5. 證據界線：slide 能證明公式、圖例與 agenda，不能還原現場問答或 Canvas demo

證據界線：slide 能證明公式、圖例與 agenda，不能還原現場問答或 Canvas demo。本文設計的四節點實驗是依投影片概念做的推導，不宣稱是講者現場範例。每次新增解釋都應能指出它在 encoder、decoder、objective 或 evaluation 的位置。

### 最終驗收題

在選模型前完成一張 model card：資料中的 graph 是觀察到的真實關係，還是為了計算人工建立；edge 缺失代表沒有關係，還是尚未觀察；預測是 transductive 還是要泛化到新節點與新圖；metric 對應 node、edge 或 graph 哪個單位；baseline 是否包含不使用 edge 的模型。接著做 edge ablation：保留所有 node features，但隨機重排或移除 edge，再用相同 budget 訓練。若原圖沒有穩定優勢，先檢查 graph construction 與 split，而不是換更複雜 GNN。最後做 permutation test，重新編號節點後確認輸出等變或不變。這三個檢查分別回答「邊有沒有用」「資料有沒有洩漏」「模型是否真的把輸入當圖」。

## 這講接到哪裡

完成本講後，應能交付一份不超過一頁的 graph problem specification：畫出一個正例與一個反例，列出 node/edge schema、feature availability、prediction unit、split boundary、baseline 與 metric。再用一句話說明為何普通表格模型看不到那個關係訊號。若這句話無法成立，就先保留非圖 baseline，不要因課程名稱而預設 GNN 必勝。這份 specification 會成為後續十九講所有模型比較不變的契約。

第 1 講建立的概念會在後續講次繼續組合。閱讀時保留自己的小圖、符號表與 baseline；每遇到新模型，就問它改了資料、訊息、聚合、更新、目標函數或評估中的哪一項。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 1 official slides](https://web.stanford.edu/class/cs224w/slides/01-intro.pdf)

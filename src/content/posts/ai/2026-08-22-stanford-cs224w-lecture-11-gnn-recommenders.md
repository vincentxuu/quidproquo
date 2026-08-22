---
title: "Stanford CS224W 第 11 講：GNNs for Recommender Systems：從協同過濾到 LightGCN"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 12
tldr: "依 Fall 2025 官方投影片整理第 11 講，涵蓋 推薦系統的圖表示、matrix factorization baseline、NGCF 的訊息傳遞，並標明公開材料邊界。"
description: "Stanford CS224W Fall 2025 第 11 講完整 agenda 與自學筆記，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-11-gnn-recommenders-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 11 講**，官方日期 2025-10-28。本文依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/11-recsys.pdf)整理；講者以投影片署名為準。

## 材料與缺口

公開材料包含官方投影片與 schedule 的 optional readings。Canvas 錄影、現場 Q&A、板書與 Ed 討論不公開，本文不推測；2021 公開影片不作為 2025 講次證據。

## 本講完整 agenda

### 1. 推薦系統的圖表示

推薦資料天然形成 user–item 二分圖：互動是邊，評分、點擊或購買可成為 edge signal。任務通常是為使用者排序尚未互動的 item，而不是單純分類一條邊。

### 2. matrix factorization baseline

matrix factorization 為 user 與 item 各學一個向量，以內積預測偏好。它是必要 baseline，因為許多圖推薦模型最後仍以相同 scoring function 排名。

### 3. NGCF 的訊息傳遞

NGCF 沿互動邊傳遞 user 與 item embedding，讓高階協同訊號進入表示。每多一層就多一跳，但也增加 transformation、非線性與訓練成本。

### 4. LightGCN 的簡化

LightGCN 移除 feature transformation 與 activation，只保留正規化鄰域聚合，再合併各層 embedding。這個簡化指出推薦圖上的關鍵可能是 neighborhood propagation，而非一般 GNN 的所有元件。

### 5. 大規模採樣與 ranking evaluation

大圖需採樣鄰居或 mini-batch edge，訓練常用 pairwise ranking loss。評估必須固定候選集合、negative sampling 與資料時間切分，否則 Recall@K、NDCG 等數字不能公平比較。

## 推薦圖完整 agenda

### 二分圖建模

User-item interaction 構成 bipartite graph，只有跨 type edges。Implicit feedback 的 click/purchase 代表觀察到偏好，不代表未互動 item 是負例；explicit ratings 則帶 edge value。先定義 observation window、candidate items 與 ranking time，否則同一 user 的未來互動會洩漏。

### Matrix factorization

MF 為 user u 與 item i 學向量，以內積預測 affinity。它等價於只用零跳 ID embeddings 的 baseline，能處理 collaborative signal，但無法直接利用多跳 graph propagation。Bias terms、regularization 與 negative sampling 對結果影響很大，GNN 比較時需保持 scoring/loss 一致。

### BPR objective

Implicit recommendation 常用 Bayesian Personalized Ranking：對同一 user 的 observed item i 與 sampled item j，希望 score(u,i)>score(u,j)。Loss 學的是 pairwise ordering，negative sampler 決定題目難度。熱門 item sampling、uniform sampling 與 exposure-aware sampling 不等價。

### NGCF propagation

NGCF 在 user-item edges 上交換 embeddings，加入 linear transforms、nonlinearity 與 element-wise interaction，使高階 collaborative connectivity 進表示。Layer 1 看直接互動，layer 2 可連到相似 users/items。堆疊過深會混合噪音與增加成本，需 depth ablation。

### LightGCN simplification

LightGCN 移除 feature transformation 與 activation，只保留 normalized neighborhood aggregation，最後加權合併各 layers embeddings。它的判斷是 collaborative filtering 中 ID embedding propagation 是核心，通用 GNN 的非線性不一定有益。簡化也降低參數與 overfitting。

### Normalization

二分圖 degree 很不平均，popular items 與 heavy users 會支配 message。Symmetric normalization 依兩端 degree 縮放 edge contribution。改用 mean 或未正規化 sum 會改 popularity bias；應按 user activity 與 item popularity 分桶評估。

### Layer combination

只取最後一層可能 over-smooth；LightGCN 合併 layer 0 到 K，讓原始 ID preference 與不同 hop collaborative signal共存。Layer weights 可固定平均或學習。公平實驗需報是否包含 layer0，因為它就是 MF-like direct embedding。

### Large-scale sampling

Web-scale graph 不能 full-batch。Neighbor sampling、random-walk sampling 或 graph partition 會改模型看到的 interactions。Training sampler 與 ranking candidate sampler 要分開記錄；前者近似 propagation，後者定義 loss/evaluation。

### Evaluation

Recall@K 衡量 relevant items 進 top K，NDCG@K 對排名位置加權。Sampled evaluation 只對少量 negatives 排名，通常比 all-item ranking 容易，兩者不可直接比較。Temporal split 比 random interaction split更接近上線推薦。

### 冷啟動與驗收

Pure ID LightGCN 遇到新 user/item 沒 embedding。加入 side features 才可能 inductive，但已是不同模型。驗收比較 popularity、MF、NGCF、LightGCN；固定 embeddings size、BPR sampler、candidate universe、time split與budget，並報 warm/cold、popular/long-tail buckets。

## 實作、評估與驗收

### Exposure bias

未互動 item 可能只是使用者沒看過。若 training negatives 從全 catalog 均勻抽，模型多半只學會排除冷門無關 item；真實首頁 candidates 已經過召回，比較困難。離線 protocol 應說是否模擬 exposure，至少以 popularity-matched negatives 做敏感度。

### Edge weight

觀看、加入購物車、購買可用不同 relation，或壓成 weighted edge。後者假設行為只差強度，前者讓模型學不同 transformation。若購買後必然有觀看，多 relation 又有階層相關，split 必須一起移除同一事件鏈的未來行為。

### Serving

離線 LightGCN 可預先計算 user/item embeddings，線上以內積做 ANN retrieval；新互動後多久刷新決定 stale graph。若每次 query 重跑多 hop propagation，latency 不同。報告 training metric 之外，也要寫 embedding refresh、index build 與 online scoring 成本。

### Diversity

純 relevance ranking 可能集中 popular items。Coverage、novelty、diversity與business constraints不在單一 Recall@K 裡。本文不替 deck 加產品目標，但實驗結論需限定「預測 held-out interactions」，不能擴張成整體推薦品質。

### Leakage tests

同一 user 的 duplicate interactions、session內相鄰事件、item metadata更新都可能跨 split。以 timestamp排序，將 validation/test interaction之後資料全部移除；再確認 user/item degree features只從training window計算。

### Acceptance

手算三users四items的二分圖，一層LightGCN normalized messages與BPR pair。再把一條test edge移除重算embedding，確認其不存在。程式輸出需與手算一致，才進大型dataset。

## 自學檢查點

最終報告須同時列 all-item 與 sampled ranking；若只能跑 sampled protocol，就固定 negatives 並明說候選數。另列 layer0-only、各單層與合併層結果，證明高階 propagation 是否真的增加訊號。若最佳模型其實只靠 layer0，LightGCN 退化成 matrix factorization，結論就應回到 simpler baseline，而不是保留不必要的 graph computation。

再建立 popularity stress test：training 刻意讓少數 items 很熱門，test 同時含熱門與長尾正例。比較 MF、LightGCN 在不同 negative samplers 下的 Recall/NDCG，並觀察 embedding norm 是否與 degree 高度相關。接著將所有 user-item edges 依時間後移一格，確認 pipeline 不會讀到未來。Serving audit 則用固定一千 candidates 測 inner-product latency、index freshness 與新 item fallback。最後保存一個 user 的完整 ranking trace：observed history、sampled neighborhood、layer embeddings、candidate scores與filtered items，使離線分數能被逐步追查。

Graph recommendation 的結論還要限定 interaction semantics。預測 click 不等於滿意度，預測 purchase 不等於長期價值；官方 deck 的模型比較回答的是 collaborative ranking，不應被擴寫成產品成效。若加入內容、價格或業務規則，需另列 feature availability 與 intervention bias。這個界線避免把離線 link prediction 誤當因果推薦。

先寫出 prediction unit、資料可用時間、negative set 與 metric，再跑模型。圖上的資料洩漏常沿另一種 relation 或未來邊發生，只看程式是否執行成功抓不到。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 11 official slides](https://web.stanford.edu/class/cs224w/slides/11-recsys.pdf)

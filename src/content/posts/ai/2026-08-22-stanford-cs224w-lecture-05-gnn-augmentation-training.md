---
title: "Stanford CS224W 第 5 講：GNN Augmentation and Training：資料、任務與模型怎麼一起設計"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 6
tldr: "依 Fall 2025 官方投影片逐段整理第 5 講，涵蓋 圖資料 augmentation、特徵與結構 augmentation、supervision 與 loss，並標出自學者拿不到的課堂材料。"
description: "Stanford CS224W Fall 2025 第 5 講完整 agenda 與自學筆記，只採用當期官方投影片，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-05-gnn-augmentation-training-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 5 講**，官方日期 2025-10-07。本篇依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/05-GNN3.pdf)重建內容；講者依投影片署名為 Jure Leskovec 與課程團隊。

## 材料與缺口

公開材料包含 05-GNN3.pdf 與 schedule 上的閱讀清單。Canvas 錄影、現場 Q&A、板書補充與 Ed 討論不公開，因此本文不推測那些內容；2021 YouTube 錄影也不作為 2025 講次證據。

## 本講完整 agenda

### 1. 圖資料 augmentation

GNN 的輸入不只是一個固定 adjacency matrix。可以補節點特徵、加入 virtual node、抽樣子圖，或擾動邊與屬性；每種 augmentation 都把一個假設寫進資料。

### 2. 特徵與結構 augmentation

特徵缺失時可用常數、degree 或可學 embedding；結構增強則可能增加長距離通道。這些做法不是免費提升：若改掉任務真正依賴的邊，augmentation 就會製造錯誤 supervision。

### 3. supervision 與 loss

訓練目標要對齊預測尺度。節點分類只在有標籤節點上計 loss，連結預測需要負邊，圖分類則需要把節點表示 pool 成圖表示。

### 4. 圖分類與 pooling

pooling 可以是全域 sum/mean，也可以學階層式群集。DiffPool 的想法是同時學節點表示與 soft assignment，但會帶來額外參數與計算成本。

### 5. 訓練 pipeline 與常見失敗

可靠 pipeline 要分開 train/validation/test，避免先在全圖計算會洩漏標籤的特徵。先建立不做 augmentation 的 baseline，再逐一加入變更並記錄隨機種子。

## 投影片逐段拆解

### Augmentation 先回答缺的是什麼

圖模型可能缺 node feature、edge feature、long-range connection、label signal 或適合的 graph-level representation。不同缺口對應不同 augmentation。把 degree 當 feature 是補結構摘要；加入 virtual node 是建立全域通道；edge dropping 是 regularization；subgraph sampling 是計算策略。它們不能混稱成同一招，因為每一項都改變不同假設與失敗模式。

### Feature augmentation

沒有 node feature 時，可以用常數向量、degree one-hot、Laplacian/spectral feature、random-walk statistics 或 learnable node embedding。常數特徵迫使模型只靠結構，但對對稱節點可能完全相同；node ID embedding 可打破對稱，卻失去 inductive 能力。Feature normalization 也要只用 training data 的統計。若先在全圖標準化含時間的欄位，validation/test 未來資訊可能已洩漏。

### Structural augmentation

加 self-loop 讓節點保留自身訊息；加 reverse edge 讓 directed relation 能雙向傳遞，但反向邊應有獨立 relation type；加 virtual node 可在少數層內連接全圖；edge rewiring 可縮短長距離。每一種都改 graph topology。對 link prediction，不能把 held-out positive edge 以 augmentation 名義放回 input；對分子圖，也不能任意加不符合化學規則的邊。

### Data augmentation 與 invariance

隨機 drop edge、mask feature、sample subgraph 可以產生不同 view，支援 regularization 或 contrastive learning。但 augmentation 必須保留 label semantics。若 graph label 依賴某個稀有 motif，edge dropping 剛好破壞 motif 就產生錯標 view。合理做法是先寫 invariance hypothesis：「刪除少量社交互動不改使用者類別」；若寫不出來，就不應把變換當成免費資料。

### Prediction head 與 supervision

Node task 在節點表示後接 node head；edge task 需組合兩端與可能的 edge feature；graph task 要 readout。Loss 也依任務改變：multi-class 用 cross-entropy，multi-label 常用 binary cross-entropy，link ranking 可能用 pairwise loss。Class imbalance 時只報 accuracy 會掩蓋少數類；應依任務選 AUROC、average precision、MRR 或 Hits@K，並先在 validation set 定 threshold。

### Graph-level pooling

Global sum 保留圖大小訊號，mean 消除大小尺度，max 留最強 feature；三者都沒有顯式學群集。Hierarchical pooling 試圖把 node 聚成較粗 graph，再繼續 message passing。選 pooling 不是結尾小事：如果 label 取決於子結構是否存在，max 或 attention 可能合理；如果取決於計數，sum 更自然。先用三種簡單 readout 建 baseline，再測複雜 pooling。

### DiffPool 的兩個輸出

DiffPool 在每一層同時學 node embedding matrix Z 與 soft assignment matrix S，下一層 feature 近似 S^T Z，adjacency 近似 S^T A S。Assignment 讓節點軟分配到 cluster，因而可學階層。代價是 dense assignment 與額外 objective，cluster 數也要預先設定。檢查時不只看 task metric，也要看 assignment 是否全部坍縮到一個 cluster，以及 link-prediction/entropy regularization 的影響。

### Training pipeline 的正確順序

先依任務切 train/validation/test，再只用 training partition 決定 normalization、negative sampling pool 與 augmentation statistics；接著建立不做 augmentation 的 baseline；最後一次加入一項變換。Early stopping 只看 validation，不可重複窺看 test 選模型。所有 run 保存 random seed、split ID、best epoch、metric 與 wall-clock。圖資料 split 本身的 variance 可能大於模型差異，因此只報一個 seed 不足。

### Neighbor sampling 與 mini-batch

大圖無法每步 full-batch 時，以 seed nodes/edges 建 mini-batch，再逐層取樣鄰居。Sampler 決定模型看到的 graph distribution：uniform neighbor sampling 可能忽略少數重要邊，按時間取樣才能符合線上預測。Batch 中同一節點可能被多個 seed 重用，框架會 relabel local IDs；若 edge label 與 local mapping 沒同步，程式可跑但 supervision 對錯節點。

### Debug checklist

第一，做 tiny graph overfit：十幾個樣本應能把 training loss 壓低，否則先查 pipeline。第二，做 label permutation：打亂標籤後 validation 不應仍然很高，否則有洩漏。第三，關閉所有 augmentation 與 dropout 建 deterministic baseline。第四，逐一開啟 feature mask、edge drop、pooling 或 sampler並記錄差異。第五，對每個 augmentation 畫一個被變換的實例，確認 label 仍合理。這套檢查比直接擴大 sweep 更能定位錯誤。

## 訓練與 augmentation 交叉審查

### 1. 每項 transformation 要標 fit、apply、randomness 發生在哪個 phase

每項 transformation 要標 fit、apply、randomness 發生在哪個 phase。Random edge drop 通常只在 train；degree bin 與 deterministic encoding 在 test 必須一致。Test-time 忘了關閉 stochastic drop 會增加 variance，ID embedding 則無法套到新節點。

### 2. Degree、shortest path、spectral feature 看似無監督，仍可能洩漏 held-out edges

Degree、shortest path、spectral feature 看似無監督，仍可能洩漏 held-out edges。Temporal task 更要按 prediction time 建 snapshot feature。沒有直接用 label 不代表安全，因為 graph structure 本身可能就是答案。

### 3. Negative sampling 也是 augmentation

Negative sampling 也是 augmentation。Uniform negatives 可能太容易，hard negatives 更接近候選卻可能包含未記錄真邊。固定 candidate universe、排除規則、正負比例與 seed；test negatives 不應每次重抽。

### 4. Early stopping 與 hyperparameter selection 只能看 validation

Early stopping 與 hyperparameter selection 只能看 validation。多次試驗後挑 test 最好的 run，test 已經變成 validation。先凍結 protocol 再一次性報 test；若重新設計，誠實標為 exploratory。

### 5. DiffPool assignment 是 soft、seed-dependent，cluster index 沒固定語意

DiffPool assignment 是 soft、seed-dependent，cluster index 沒固定語意。視覺化可診斷 collapse，不能單憑圖形宣稱發現真實社群或生物模組；這類主張需要外部 annotation 與 metric。

### 6. 最終實驗表每列保存 graph version、split hash、feature/structural augmentation、sampler、encoder、pooling、loss、optimizer、seed、validation、test、memory、time 與 failure note

最終實驗表每列保存 graph version、split hash、feature/structural augmentation、sampler、encoder、pooling、loss、optimizer、seed、validation、test、memory、time 與 failure note。失敗 run 也保留，避免 selection bias。

## 這講接到哪裡

第 5 講建立的概念會在後續講次繼續組合。閱讀時保留自己的小圖、符號表與 baseline；每遇到新模型，就問它改了資料、訊息、聚合、更新、目標函數或評估中的哪一項。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 5 official slides](https://web.stanford.edu/class/cs224w/slides/05-GNN3.pdf)

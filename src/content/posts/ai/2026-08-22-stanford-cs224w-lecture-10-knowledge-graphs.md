---
title: "Stanford CS224W 第 10 講：Knowledge Graphs：TransE、ComplEx 與 RotatE 的關係建模"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 11
tldr: "依 Fall 2025 官方投影片整理第 10 講，涵蓋 知識圖譜與 completion、三元組 scoring、TransE 與關係模式，並標出無法公開取得的課堂材料。"
description: "Stanford CS224W Fall 2025 第 10 講完整 agenda 與自學筆記，只採用當期官方投影片，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-10-knowledge-graphs-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 10 講**，官方日期 2025-10-23。本文依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/10-kg.pdf)整理；講者依投影片署名為 Jure Leskovec、Charilaos Kanatsoulis 與課程團隊。

## 材料與缺口

公開材料包含投影片與 schedule 列出的 optional readings。Canvas 錄影、現場 Q&A、板書及 Ed 討論不公開，因此本文不推測；2021 公開影片也不當成 2025 講次內容。

## 本講完整 agenda

### 1. 知識圖譜與 completion

知識圖譜把事實寫成 `(head, relation, tail)` 三元組。Knowledge graph completion 的任務是為缺少的 head、relation 或 tail 排名，而不是把沒有記錄的三元組一律當成錯誤。

### 2. 三元組 scoring

embedding 模型為實體與關係學向量，再以 scoring function 衡量三元組相容性。訓練把觀察到的正例分數推高，並用擾動 head 或 tail 產生負例。

### 3. TransE 與關係模式

TransE 把關係視為平移，要求 head 加 relation 接近 tail。幾何直觀清楚，但對一對多、對稱或組合關係有表達限制。

### 4. DistMult、ComplEx、RotatE

DistMult 使用雙線性乘積，天然對 head/tail 對稱；ComplEx 以複數表示突破這個限制；RotatE 把 relation 寫成複數平面的旋轉，可表達對稱、反對稱、反關係與組合等模式。

### 5. negative sampling 與 filtered evaluation

評估常報 mean reciprocal rank 與 Hits@K，並使用 filtered setting 排除其他已知真三元組。實作時先確認負採樣沒有把已知事實標成負例，再比較模型。

## Knowledge graph agenda 深入拆解

### Open-world triple data

KG 以 head、relation、tail 表示觀察到的事實。未出現 triple 可能是假，也可能只是資料庫不完整，因此 training negatives 是 sampled corruptions，不是真實負標籤。模型學的是在特定 candidate universe 中把 observed facts 排前，而不是判定世界上所有未記錄敘述為假。

### Scoring framework

Entity embeddings e_h、e_t 與 relation parameters r 經 scoring function f(h,r,t) 產生相容度。Training 可用 margin ranking、logistic/softmax loss，把 positive score 與 corrupted triples 分開。不同 score 的幾何決定能表達的 relation patterns，不能只比較 embedding dimension。

### TransE

TransE 希望 e_h + r 接近 e_t，以 L1/L2 distance 給分。Inverse relation 可用相反 translation，composition 可由向量相加表現；但 symmetric relation 若 h+r≈t 且 t+r≈h，會強迫 r 接近零與 entity 靠近。一對多也可能把多個 tails 拉到相似位置，降低區分。

### DistMult

DistMult 以三個 vectors 的逐維乘積求和，相當於 diagonal bilinear form。因乘法對 h/t 對稱，f(h,r,t)=f(t,r,h)，所以適合 symmetric pattern，無法表達一般 antisymmetric relation。這是由公式直接推出的限制，不是資料或 optimizer 能修好。

### ComplEx

ComplEx 把 entity/relation 放到 complex space，score 取 head、relation、conjugated tail 乘積的實部。Conjugation 打破 head/tail 對稱，使 antisymmetric pattern 可表達。實作可拆成 real/imaginary parts；比較 DistMult 時要對齊實際 parameter count，而不只對齊標示 dimension。

### RotatE

RotatE 在 complex plane 以 unit-modulus relation 做 element-wise rotation，使 tail 接近 head 旋轉後的位置。Identity/symmetry、inverse 與 composition 可對應 rotation 的代數。它仍是 embedding model，對新 entity/relation 沒有參數；第十五講才處理 fully inductive KG reasoning。

### Negative sampling

Corrupt head 或 tail 時，若 sampled triple 已在 train/validation/test known facts 中，應過濾，否則把真事實當負例。Uniform negatives 常太簡單，self-adversarial weighting 會強調模型目前打高分的 negatives。Sampler 改變 optimization target，必須與 model 一起報。

### Filtered evaluation

對 query (h,r,?) 排所有 candidate entities，計 correct tail 的 rank。若其他 candidates 也是 known true tails，filtered protocol 將它們移除再排名。MRR 是 reciprocal rank 平均，Hits@K 是正解進前 K 的比例。要說明 head/tail prediction 是否平均、tie 如何處理、candidate 是否全實體。

### Data leakage 與 inverse edges

Random triple split 可能讓 test relation 的 inverse triple 留在 train，模型只需背反向邊。若 benchmark 自帶 inverse relations，應檢查 construction。Entity-disjoint 或 time split 更能測新 entity/未來 facts，但難度不同。不能把不同 split 的 MRR 直接比較。

### 驗收 protocol

用 symmetric、antisymmetric、inverse、composition、一對多五組 synthetic relations，固定 dimension/budget 比 TransE、DistMult、ComplEx、RotatE。先從公式預測誰能表達，再看 training 是否符合；另檢查 raw vs filtered rank、known-fact filtering 與 per-relation metric。若結果違反理論，優先查資料生成、score sign 與 evaluation code。

## 實作與證據邊界

### Entity normalization

TransE/RotatE 訓練常對 entity embeddings 或 relation modulus 加 constraint，避免單純放大 norms 改 score。不同模型 constraint 不同；比較時若一方使用 projection、另一方沒有 regularization，optimization stability 會影響結果。需記錄 norm、margin 與 score direction。

### Type constraints

若 KG 有 entity types，corrupt tail 時可只從合法 type 抽樣。這產生較合理也更難的 negatives，但 metric 不再等同全 entity ranking。報告 candidate filtering，否則 Hits@K 不能與 unconstrained setting 直接比。

### One-to-many analysis

按 relation 的平均 heads-per-tail、tails-per-head 分成 1-1、1-N、N-1、N-N，分桶比較。TransE 的幾何限制會在多值 relation 更明顯；整體 MRR 可能被大量簡單 1-1 relations 拉高。

### Calibration

Ranking score 不是機率，不同 query 的尺度也可能不同。若系統要以 threshold 自動接受 facts，需要另做 calibration 與 precision-recall validation，不能拿 MRR 直接設定門檻。Open-world 下 false-positive review 更需要明確候選與人工驗證。

### Inductive boundary

所有這些 classic embedding 為 entity/relation vocabulary 學參數，benchmark test 通常仍在 seen vocabulary 內做 missing-link ranking。遇到新 entity 或新 relation 的 zero-shot claim 需不同 split 與 encoder；不能以 transductive filtered MRR 支持 foundation-model 泛化。

### 最終 KG 驗收

建立五種 synthetic relations 並從公式預測：DistMult 對 antisymmetric 應失敗，TransE 對複雜一對多受限，ComplEx 與 RotatE 各自能表達特定 pattern。固定實體數、dimension、parameter budget 與 negative sampler，檢查 empirical result 是否符合。Evaluation 同時輸出 raw/filtered MRR、Hits@K、head/tail ranks、per-relation buckets，並驗證 known true triples 全被 filter。最後加入 unseen entities/relations，確認 classic lookup models 無法直接處理；這一步明確劃出第十五講 foundation model 的新問題。

## 自學檢查點

驗收紀錄必須能由另一個人手算重現，不只留下程式輸出的總分。

最後做 evaluator unit test：手工建立一個 query，包含正解、另一個 known true answer、兩個 false candidates 與一個同分 candidate。逐步算 raw rank、filtered rank、reciprocal rank 與 Hits@K，明定 optimistic、pessimistic 或 average tie policy。再與程式輸出逐項比對。KG 實驗常因 filter dictionary 漏掉 validation/test facts或 score direction顛倒而產生漂亮但錯誤的 MRR；五個 entity 的手算案例能在大規模訓練前抓到。

拿一張最小圖或一組最小三元組，寫出輸入、模型保留的不變性、輸出與評估方式。若兩個例子理應不同卻在每一步都相同，就找到這個 encoder 的表達缺口。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 10 official slides](https://web.stanford.edu/class/cs224w/slides/10-kg.pdf)

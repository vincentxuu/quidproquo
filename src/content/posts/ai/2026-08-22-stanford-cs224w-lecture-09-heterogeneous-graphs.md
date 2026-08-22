---
title: "Stanford CS224W 第 9 講：Heterogenous Graphs：讓節點與關係類型進入 message passing"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 10
tldr: "依 Fall 2025 官方投影片整理第 9 講，涵蓋 異質圖 schema、relation-specific messages、R-GCN，並標出無法公開取得的課堂材料。"
description: "Stanford CS224W Fall 2025 第 9 講完整 agenda 與自學筆記，只採用當期官方投影片，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-09-heterogeneous-graphs-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 9 講**，官方日期 2025-10-21。本文依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/09-hetero.pdf)整理；講者依投影片署名為 Jure Leskovec、Charilaos Kanatsoulis 與課程團隊。

## 材料與缺口

公開材料包含投影片與 schedule 列出的 optional readings。Canvas 錄影、現場 Q&A、板書及 Ed 討論不公開，因此本文不推測；2021 公開影片也不當成 2025 講次內容。

## 本講完整 agenda

### 1. 異質圖 schema

異質圖包含多種節點或邊類型，例如作者—論文—會議。若把所有關係壓成同一 adjacency，模型就分不出「作者寫論文」與「論文刊於會議」。

### 2. relation-specific messages

message passing 必須把 source type、relation type 與 target type 納入計算。每種 typed edge 可以有自己的 transformation，再由目標節點聚合不同 relation 的訊息。

### 3. R-GCN

R-GCN 為 relation 配置權重矩陣，並以 basis 或 block decomposition 控制參數量。它適合多關係圖，但 relation 數量很大時仍需仔細共享。

### 4. Heterogeneous Graph Transformer

HGT 把 node type 與 edge type 帶進 attention、message 與 update，讓不同 meta-relation 有不同投影。這比把 type 當單一 one-hot 特徵更直接地改變傳播規則。

### 5. 參數共享與可擴展性

建模前先寫 schema：節點類型、邊方向、反向邊、可用特徵與預測目標。切分時按時間或目標關係處理，避免同一實體的未來資訊沿其他 relation 洩漏。

## 異質圖完整建模 agenda

### Schema 是第一個模型

Heterogeneous graph 先定 node types、edge/relation types、方向與 attributes。作者—寫作—論文、論文—發表於—會議是不同 meta-relations。若把所有 nodes 放進同一 feature matrix，還需處理不同 type 的欄位空間；若把 relation 壓成一種 adjacency，語意已在進模型前消失。

### Canonical edge type

一條 typed edge 可寫成 source type、relation、target type 三元組。同名 relation 若 source/target type 不同，是否共享參數要明定。加入 reverse edge 能讓訊息反向流動，但 reverse relation 應獨立命名，否則模型會把 writes 與 written_by 當同一語意。Self-loop 也可依 node type 使用不同 transform。

### R-GCN update

R-GCN 對每種 relation r 使用 transformation W_r，把 relation-specific neighbor messages 正規化後相加，再加 self transformation。它保留 relation type，但 relation 多時每種一個完整 matrix 會增加參數並讓 rare relations 學不到。Normalization 可按 relation-specific degree，與先混全部 edge 再除總 degree 不同。

### Basis decomposition

以少量 basis matrices 線性組合出每個 W_r，使 relations 共享統計；block-diagonal decomposition 則限制不同 feature groups 的互動。Basis 數越少共享越強、參數越省，但可能欠擬合 relation-specific pattern。應按 relation frequency 報 metric，檢查熱門 relation 的平均是否掩蓋 rare relation。

### HGT typed attention

HGT 為不同 node types 做 query/key/value projections，並讓 relation 影響 attention 與 message。每個 meta-relation 因此有自己的相容性，但可共享底層結構。Multi-head attention 在 typed neighborhood 中正規化；實作要說 softmax 是按 relation 分開還是合在 target 的全部 incoming edges。

### 時間與相對時間

資料庫、交易與事件圖常帶 timestamp。Message 可加入 edge time encoding，sampling 必須只取 prediction time 之前的 neighbors。若只在最後 feature 加時間，但 sampler 已抽到未來 edge，洩漏仍存在。對同一 entity 建時間排序的 neighborhood，比隨機取最近/全部 edge 更符合線上推論。

### Feature alignment

不同 node types 可能有文字、數值、類別或完全無 feature。可各自用 type-specific encoder 投影到共同 hidden space；無特徵類型可用常數、structural feature 或 learnable type embedding。Permanent entity-ID embedding 會限制新 entity 泛化，應與 inductive requirement 一起選。

### Heterogeneous sampling

以 seed target 為中心按 relation 設 fanout，否則高頻 relation 會填滿 batch，rare relation 幾乎看不到。Sampler 要保留 edge type、direction、timestamp 與 local ID mapping。Training 與 inference 若 relation fanout 不同，需報告 distribution shift。

### Split 與 leakage

預測某 relation 時，該 target edge 必須從 input graph 移除；它的 reverse edge 也要移除。若 label 可從另一張表的 future status 直接讀出，也需按時間切斷。Random edge split 在同 entity 間共享大量歷史，可能比 cold-start entity split 容易；兩種 setting 回答不同問題。

### 驗收 protocol

畫一張 schema diagram，列每個 canonical edge type 的 count、degree、time range、feature availability。比較 homogeneous collapse、R-GCN、HGT 與 type-feature-only baseline；固定 sampler/budget，按 node type 與 relation frequency 分桶。另做 relation permutation 與 reverse-edge leakage test，證明模型真的使用正確 typed semantics。

## 實作與證據邊界

### Parameter explosion

若有 R relations、hidden dimension d，每 relation 一個 d×d matrix 的參數隨 R d² 增長。Rare relations 又只有少量 edges。Basis sharing、relation embedding 生成 weights、或 meta-relation grouping 是不同解法；比較時報每 relation sample count 與共享方式。

### Type-specific normalization

不同 node types 的 degree distribution 可差數個數量級。把所有 incoming edges 一起 softmax，熱門 relation 可能壓過稀有 relation；先在 relation 內 aggregate 再跨 relation combine 則給每類更獨立通道。選擇會改模型對 frequency 的敏感度。

### Cold start

新 entity 若有 type 與 attributes，shared type encoder 可產生表示；若只有 ID embedding 就無法。新 relation 更難，因 relation-specific matrix 沒參數。第十五講的 relation graph 與 double equivariance正是為 relation-inductive setting 準備。

### Metric breakdown

整體 accuracy/MRR 應拆 head type、relation type、degree、frequency、seen/unseen entities。Micro average 偏熱門 edges，macro per relation 更能看到 long tail。兩者都報，並保留每 type 的候選集合定義。

### Schema versioning

資料庫 schema 會加表、改 relation 或移除欄位。Model artifact 應保存 schema hash、type vocabulary 與 feature encoder version。遇到新 type 時，是拒絕、映到 unknown，或 zero-shot 產生參數，需要在 deployment contract 先定義。

### 最終 schema 驗收

交付 canonical edge-type 表與 schema diagram，逐 relation 列 train/validation/test counts、degree、time range、reverse mapping 與合法 candidate types。做三個 leakage tests：移除 target edge 同時移除 reverse edge；把 prediction time 後的 edges 全切掉；確認 label 欄位沒有從另一 node type 直接傳入。再比較 type-agnostic、type-feature-only、R-GCN、HGT，固定 relation-aware sampler 與 budget。報 micro、macro-per-relation、cold-start entity 與 rare-relation metrics，避免熱門 relation 統治結論。

## 自學檢查點

最後建立 schema perturbation test：重新命名 type IDs、改變 dictionary insertion order，但保持語意與 edges 不變，輸出應只按 mapping 對齊而不改；刪除某個 optional node type 時，模型應有明確拒絕或 fallback，而非 silent zero-fill。再加入 training 未見但 schema 已知的低頻 relation，檢查 basis-shared model 與 full relation matrix 的差異。這些測試把「異質圖可以跑」提升成「schema 變動時行為可預測」。

拿一張最小圖或一組最小三元組，寫出輸入、模型保留的不變性、輸出與評估方式。若兩個例子理應不同卻在每一步都相同，就找到這個 encoder 的表達缺口。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 9 official slides](https://web.stanford.edu/class/cs224w/slides/09-hetero.pdf)

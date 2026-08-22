---
title: "Stanford CS224W 第 12 講：Relational Deep Learning：把資料庫直接變成預測圖"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 13
tldr: "依 Fall 2025 官方投影片整理第 12 講，涵蓋 表格 pipeline 的限制、關聯式資料庫轉圖、temporal entity graph，並標明公開材料邊界。"
description: "Stanford CS224W Fall 2025 第 12 講完整 agenda 與自學筆記，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-12-relational-deep-learning-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 12 講**，官方日期 2025-10-30。本文依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/12-RDL.pdf)整理；講者以投影片署名為準。

## 材料與缺口

公開材料包含官方投影片與 schedule 的 optional readings。Canvas 錄影、現場 Q&A、板書與 Ed 討論不公開，本文不推測；2021 公開影片不作為 2025 講次證據。

## 本講完整 agenda

### 1. 表格 pipeline 的限制

傳統做法先以 SQL joins 與人工 feature engineering 把多張表壓成單一 training table。問題不是 SQL 做不到，而是每個新任務都要重寫資料管線，關係結構也容易在聚合時流失。

### 2. 關聯式資料庫轉圖

RDL 把 primary key 對應成 entity node、foreign key 對應成 edge，欄位成為 node 或 edge feature。這讓同一張 heterogeneous graph 能支援多個預測任務。

### 3. temporal entity graph

真實資料庫帶時間。建立樣本時只能使用 prediction time 以前的邊與屬性；否則未來交易、狀態更新或標籤會沿圖結構洩漏。

### 4. RelBench 的 task abstraction

RelBench 把資料庫、task table、時間切分、metric 與 loader 包成共同介面。它的價值在於讓 relational deep learning 的比較基於一致資料處理，而非各自手寫不可比 pipeline。

### 5. GNN training pipeline

模型端通常以 seed entities 為中心做多表鄰居採樣，再用 heterogeneous GNN 產生表示與 task head。第一個 baseline 應是簡單 tabular model，確認 GNN 的提升真的來自關係。

## RDL 完整 agenda

### 傳統 feature pipeline

多表資料通常以 SQL joins、window aggregation 與人工 features 產生一張 task table。每個新 target/time window 都要重做 pipeline，且聚合會壓掉個別 entity 關係。RDL 不是否定 SQL，而是把 recurring relational computation交給 shared graph model。

### Database-to-graph mapping

Primary-key rows 成 entity nodes，foreign keys 成 directed typed edges，columns 成 node/edge attributes。Association table 可成 edge 或獨立 transaction node，取決於它是否有重要 attributes/identity。這個 mapping 是模型假設，需保存 schema version。

### Task table

每個 prediction example 由 seed entity、prediction time、label 組成。Graph sampler 只能取 time cutoff 以前資訊。Task table 將同一 database 上多種 node-level prediction統一：customer churn、item demand、transaction fraud只是 seed type、time與label不同。

### Temporal graph

Row 與 edge 可有 timestamp，feature 也可能隨時間更新。使用最新值時必須是 as-of prediction time，而非資料庫目前值。Temporal leakage 常沿 status column、future transaction或post-outcome relation進入，不能只靠 random split 防止。

### RelBench abstraction

RelBench 提供 database、tasks、splits、metrics與 loaders，使不同 model 在相同 temporal protocol比較。Benchmark 的價值包含資料處理 contract，而不只 dataset。使用時仍需讀每個 task 的 entity、label horizon與metric。

### Baseline

Simple baseline 可把 seed row attributes 餵給 MLP/GBDT，再加人工一跳 aggregates。若 GNN 沒打敗它，關係 propagation 未證明價值。另一 baseline 是 homogeneous collapse，用來測 relation types 是否必要。

### Neighborhood sampling

以 seed entity與prediction time取樣多 relation neighbors，每 relation fanout可不同。交易表 degree很大，uniform sampling可能漏recent/rare evidence；time-aware recent sampling又有不同bias。Sampler是model protocol的一部分。

### Heterogeneous encoder

每 node type先用type-specific feature encoder投影，再沿typed edges message passing，最後只讀seed type embedding接task head。Category、text、numeric與timestamp需各自處理missing values與normalization。

### Effort comparison

投影片用大量手工 pipeline code 與較短的 RDL pipeline 對照，重點是重複使用：同一個 database graph 與 loader 可服務多個 tasks。不能把 line count 直接等同 model quality；仍需比較 accuracy、runtime、maintenance 與 leakage risk。

### 驗收

交付 schema diagram、task table contract、time cutoff test 與 feature lineage。做 label permutation、future-edge removal、seed-only baseline、relation ablation。固定 snapshot、sampler 與 budget，報告 per-time、degree、entity type 與 cold-start 結果。

## 實作、評估與驗收

### Association table choice

Order-items table若只有兩個foreign keys可成typed edge；若含quantity、price、timestamp或後續被其他表refer，就更適合作transaction node。兩種mapping產生不同hop length與message semantics，應以task所需attributes決定，不是固定規則。

### Entity resolution

同一現實entity可能在多表有不同keys，錯誤join會分裂或合併nodes。RDL不會自動修資料品質。Schema audit要記primary-key uniqueness、foreign-key integrity、missing references與deduplication policy。

### Label lineage

Churn label可能由未來一段時間無交易定義，prediction horizon內的absence本身不能進feature。Fraud label可能在chargeback後才出現。每個label需列definition window、availability time與backfill behavior。

### Snapshot reproducibility

Database持續更新，僅保存query code不足以重現。保存snapshot/version、extraction timestamp、schema hash與task table hash；若因隱私不能保存raw data，至少保存row counts與checksums。

### Multi-task reuse

同一database graph可供多tasks，但不同prediction times與label horizons意味sampler不能共用一份含未來的static graph。共享的是mapping與loader abstraction，不是無條件共享所有materialized neighborhoods。

### Acceptance

取三張小表手工映成typed temporal graph，對兩個seed/prediction times列可見neighbors。SQL baseline與graph sampler都只能使用同一cutoff。若兩者example count或feature不同，先修data contract再比模型。

## 自學檢查點

部署前還要做 online/offline feature parity：任取十個歷史 prediction times，用當時資料 snapshot 重跑 loader，與離線 training example逐欄比較。欄位缺失、timezone、late-arriving rows與slowly changing dimension都可能造成training-serving skew。Graph sampler也要比較node/edge counts與relation distribution。若歷史重播無法重建相同 input，模型metric再高也無法可靠上線。

RDL 的最終交付不是單一checkpoint，而是 database schema、task contract、temporal sampler、feature encoders、model與evaluation一起版本化。任何一項更新都要重跑leakage與snapshot tests，這才是「減少每個任務手工pipeline」而非把複雜度藏進不可追蹤loader。

再做 cross-task reuse audit：在同一 database 上建立兩個 prediction tasks，確認共用的是 schema mapping、feature encoders與time-aware loader，而不是把第一個task的labels或future cutoff帶到第二個task。每個task保存seed entity、prediction time、horizon、label availability與metric。若materialized neighborhood共用，cache key必須包含cutoff與task-relevant filters。這能實際驗證RDL所說的可復用性，而不是只以程式行數判斷。

最後執行 temporal counterfactual test：複製同一 seed example，只刪除 prediction time 後新增的rows/edges，model input與prediction應完全不變；再刪除cutoff前一筆重要交易，input才應改變。若第一步已變，代表future leakage；若第二步不變，代表sampler或feature lineage漏掉預期關係。把這兩個案例放進data unit tests，比事後檢查高metric更可靠。

先寫出 prediction unit、資料可用時間、negative set 與 metric，再跑模型。圖上的資料洩漏常沿另一種 relation 或未來邊發生，只看程式是否執行成功抓不到。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 12 official slides](https://web.stanford.edu/class/cs224w/slides/12-RDL.pdf)

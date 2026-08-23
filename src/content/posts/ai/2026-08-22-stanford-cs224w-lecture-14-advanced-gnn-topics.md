---
title: "Stanford CS224W 第 14 講：Advanced Topics in GNNs：圖上 in-context learning 與不確定性"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 15
tldr: "依 Fall 2025 官方投影片整理第 14 講，涵蓋 relational foundation model 的目標、zero-shot relational transfer、PRODIGY 的 prompt graph，並標明公開材料邊界。"
description: "Stanford CS224W Fall 2025 第 14 講完整 agenda 與自學筆記，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-14-advanced-gnn-topics-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 14 講**，官方日期 2025-11-11。本文依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[當講投影片](https://web.stanford.edu/class/cs224w/slides/14-advanced_gnns.pdf)整理；講者以投影片署名為準。

## 材料與缺口

公開材料包含官方投影片與 schedule 的 optional readings。Canvas 錄影、現場 Q&A、板書與 Ed 討論不公開，本文不推測；2021 公開影片不作為 2025 講次證據。

## 本講完整 agenda

### 1. relational foundation model 的目標

這講把問題從「為一張圖訓練模型」推到「同一模型能否跨資料集、schema 與任務使用」。難點是不同關聯式資料沒有共享 token vocabulary，節點與欄位語意也不一致。

### 2. zero-shot relational transfer

Relational Transformer 試圖用通用架構吸收表格與關係，不為每個 schema 手工設計模型。zero-shot 是否成立必須用未見資料庫與未見任務驗證，不能只看同資料集 test split。

### 3. PRODIGY 的 prompt graph

PRODIGY 把 demonstration 與 query 組成 prompt graph，讓圖模型做 in-context learning。prompt 的連接方式本身就是輸入設計，決定模型能看到哪些標記例子與關係。

### 4. conformal prediction on graphs

點預測不會告訴使用者何時不可靠。Conformalized GNN 以 calibration residual 建立 prediction set 或 interval，目標是在指定假設下控制 coverage，而不是讓每筆預測都正確。

### 5. coverage、效率與限制

圖資料的相依性可能破壞一般 exchangeability 假設，foundation model 也可能遇到 schema shift。實驗需同時報 accuracy、coverage、set size、推論成本與未見 schema 表現。

## Foundation、prompt與uncertainty agenda

### 跨資料庫目標

A foundation model for relational data should transfer across databases, schemas and tasks, not only one graph split. Unlike text, table/edge type names and feature spaces differ, so shared vocabulary is weak. Evaluation must include unseen databases or schemas.

### Relational Transformer

A general relational transformer aims to encode tables and relations with reusable components. Schema tokens, column encodings and relation paths provide context. Zero-shot claim requires freezing model and applying to unseen setup; fine-tuning each database is transfer learning, not zero-shot.

### Task specification

Different tasks need target entity, label space, horizon and examples. In-context setup packages demonstrations with query rather than updating weights. Prompt construction determines accessible evidence and can leak labels if examples connect improperly.

### PRODIGY prompt graph

PRODIGY represents demonstrations and query as a prompt graph, letting message passing condition predictions on labeled examples. Node/edge construction, demo selection and query links are part of prompt. Random demo order should not matter if graph semantics same.

### In-context evaluation

Separate seen-task/unseen-instance, unseen-task/same-domain and unseen-domain settings. Compare zero-shot, few-shot prompt, fine-tuned and task-specific baselines. Keep number of demonstrations and retrieval budget fixed.

### Uncertainty need

Accuracy gives average correctness but not when individual prediction is unreliable. For high-cost graph decisions, output prediction set/interval or abstain. Softmax confidence is often miscalibrated, especially under node dependence and shift.

### Conformal prediction

Conformal methods use calibration scores and a quantile to form sets with target marginal coverage under assumptions. Set size measures usefulness: trivially returning all labels covers but says little. Calibration split must be separate from training/test.

### Graph dependence

Nodes are not iid; edges create dependence, and random node split may violate exchangeability intuition. Conformalized GNN methods adapt calibration or assumptions to graph setting. Claims must state coverage type—marginal, group, node-conditional is not automatic.

### Shift

Schema, time, degree and community shift can break transfer and calibration. Report coverage/accuracy by groups and periods, plus set size. Recalibration may be needed without retraining encoder; that is operationally different from zero-shot.

### 驗收

For prompt models, permute demos, remove prompt edges and vary demo count. For uncertainty, check empirical coverage against target, set size, subgroup gaps and calibration cost. Report accuracy and coverage together; never claim a model is safe solely because average coverage passes.

## 實作、評估與驗收

### 設定區分

Seen-task/unseen-instance、unseen-task/same-domain、unseen-database是不同泛化。Zero-shot不得更新weights；few-shot prompt只提供demonstrations；fine-tuning會改parameters。報告若混在一起，foundation claim無法判讀。

### Prompt leakage

Demonstration與query組成prompt graph時，不能讓query label edge或由label衍生的node feature進圖。Demo selection若以test answer相似度挑選也會洩漏。保存prompt construction code與每例trace。

### Permutation

Prompt graph沒有天然demo順序。重新排列demonstrations或重新編號nodes，aligned prediction應不變。若改變，代表serialization、positional ID或batch mapping偷偷引入順序。

### Coverage audit

Conformal prediction先在calibration set取nonconformity scores，再選quantile。Test只用一次。報empirical coverage與average set size，也按degree、time、community、label frequency分組；marginal通過不代表每組通過。

### Abstention cost

Set過大或頻繁abstain雖可提高coverage，卻降低可用性。應畫coverage–set-size或risk–coverage curve，讓使用者選operating point；不能只報一個coverage數字稱可靠。

### 驗收

Prompt模型做demo permutation、edge removal、demo count與unseen schema測試；uncertainty模型做calibration size、shift、subgroup與set-size測試。Accuracy、coverage、latency與token/graph cost一起報。

## 自學檢查點

最後把foundation與uncertainty兩條線分開驗收：transfer表只看未見task/schema的accuracy與成本；calibration表只看coverage、set size與shift。模型可transfer但不calibrated，也可calibrated但accuracy低，不能合成一個模糊的「可靠」。

先寫出 prediction unit、資料可用時間、negative set 與 metric，再跑模型。圖上的資料洩漏常沿另一種 relation 或未來邊發生，只看程式是否執行成功抓不到。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 14 official slides](https://web.stanford.edu/class/cs224w/slides/14-advanced_gnns.pdf)

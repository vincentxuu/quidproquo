# 內容規劃：Stanford CS224W 逐講系列

- 來源：Stanford CS224W, **Fall 2025**
- Canonical manifest：[官方 schedule](https://web.stanford.edu/class/cs224w/)
- 規模：**19 篇 × zh-TW/en = 38 個新 Markdown 檔**；既有雙語總覽保留 `series.order: 1`
- 資料成熟度：**L3**；19 講都有公開官方投影片，錄影只供 Canvas 學生觀看
- 邊界：2021 公開影片只屬 Fall/Winter 2021，不作為 2025 單講內容證據

## 交付契約

1. 每篇對應 Fall 2025 schedule 的一講，以該講投影片完整重建 agenda。
2. 開頭列講次、日期、講者、官方材料與材料缺口。
3. 中文系列名 `Stanford CS224W 導讀`，英文系列名 `Reading Stanford CS224W`；lectures 使用 order 2–20。
4. 中文與英文使用相同骨架、例子、限制與來源。
5. 只寫公開投影片可支持的內容；Canvas 錄影、現場問答與 Ed 討論均標成缺口。

## Manifest

| Order | Lecture | Date | Official title | Slug |
|---:|---:|---|---|---|
| 2 | 1 | 2025-09-23 | Introduction | `introduction` |
| 3 | 2 | 2025-09-25 | Node embeddings | `node-embeddings` |
| 4 | 3 | 2025-09-30 | Graph neural networks | `graph-neural-networks` |
| 5 | 4 | 2025-10-02 | A general perspective on GNNs | `general-gnn-perspective` |
| 6 | 5 | 2025-10-07 | GNN augmentation and training | `gnn-augmentation-training` |
| 7 | 6 | 2025-10-09 | Theory of GNNs | `gnn-theory` |
| 8 | 7 | 2025-10-14 | Designing Powerful Graph Encoders | `powerful-graph-encoders` |
| 9 | 8 | 2025-10-16 | Graph Transformers | `graph-transformers` |
| 10 | 9 | 2025-10-21 | Heterogenous graphs | `heterogeneous-graphs` |
| 11 | 10 | 2025-10-23 | Knowledge graphs | `knowledge-graphs` |
| 12 | 11 | 2025-10-28 | GNNs for recommender systems | `gnn-recommenders` |
| 13 | 12 | 2025-10-30 | Relational Deep Learning | `relational-deep-learning` |
| 14 | 13 | 2025-11-06 | Advanced architectures in RDL | `advanced-rdl` |
| 15 | 14 | 2025-11-11 | Advanced topics in GNNs | `advanced-gnn-topics` |
| 16 | 15 | 2025-11-13 | Towards Foundation Models for Knowledge Graphs | `kg-foundation-models` |
| 17 | 16 | 2025-11-18 | LLM + GNN | `llm-gnn` |
| 18 | 17 | 2025-11-20 | Agents + Graphs | `agents-graphs` |
| 19 | 18 | 2025-12-02 | Deep generative models for graphs | `graph-generative-models` |
| 20 | 19 | 2025-12-04 | Conclusion | `conclusion` |

## 批次

- Batch A：Lectures 1–5（完成）
- Batch B：Lectures 6–10（完成）
- Batch C：Lectures 11–15（完成）
- Batch D：Lectures 16–19（完成）

每批跑 references、台灣用語、series order 與 language parity；全系列完成後跑 `pnpm verify`。

## 完成 audit

- Manifest：19/19 lectures 已產製。
- 語言：19 組 zh-TW/en pair，合計 38 個 lecture Markdown 檔。
- 閱讀順序：既有總覽 order 1；Lecture 1–19 連續使用 orders 2–20。
- Offering：所有講次均以 Fall 2025 schedule 與該列官方投影片為證據。
- 隔離：2021 公開影片未作為任何 2025 單講正文來源；Canvas 錄影與現場互動持續標示為材料缺口。
- Canonical correction：live Fall 2025 schedule 明確連到 Lecture 18 `18-deep-generation.pdf` 與 Lecture 19 `19-conclusion.pdf`；系列文章與 SOURCES 直接使用這兩份當期 deck，不保留舊檔名映射註解。
- Parity remediation：先移除所有 template/filler 段落；逐對語意翻譯 audit 進行中，完成證據必須列出中文版具體小節與英文對應小節，不以 heading counts 代替。

### Semantic parity evidence

| Pair | Concrete mapping evidence | Status |
|---|---|---|
| Lecture 1 | `案例與完整建模審查` ↔ `Case studies and a complete modeling audit`; social network, molecule, KG, dependency chain, evidence boundary, acceptance exercise all translated | complete |
| Lecture 2 | `投影片逐段拆解` ↔ `Slide-by-slide expansion` covers softmax cost, walks, DeepWalk, p/q, factorization, transductivity, evaluation, and hand calculation; `公式與實驗審查` ↔ `Formula and experiment audit` maps direction, degree bias, split leakage, reproduction fields, and tradeoffs | complete |
| Lecture 3 | `投影片逐段拆解` ↔ `Slide-by-slide expansion` maps shared encoders, computation graphs, set aggregation, GCN, GraphSAGE, objectives, outputs, depth, and calculation; `完整 GNN 實驗審查` ↔ `Complete GNN experiment audit` maps direction, isolates, homophily, sampling, error buckets, and indistinguishability | complete |
| Lecture 4 | `投影片逐段拆解` ↔ `Slide-by-slide expansion` maps the design space, messages, aggregation, updates, GAT, sampling, connectivity, GraphGym, and component table; `Design-space 審查細節` ↔ `Design-space audit details` maps MLP placement, edge features, dropout objects, fairness, randomness, and six-sentence config reading | complete |
| Lecture 5 | `投影片逐段拆解` ↔ `Slide-by-slide expansion` maps feature/structure augmentation, invariance, heads, pooling, DiffPool, ordering, sampling, and debugging; `訓練與 augmentation 交叉審查` ↔ `Training and augmentation cross-audit` maps phase boundaries, leakage, negative sampling, validation, DiffPool identity, and run records | complete |
| Lecture 6 | `理論 agenda 深入拆解` ↔ `Deep theory agenda` maps WL, message passing, mean/max, GIN, readout, smoothing/squashing, counterexamples, and acceptance; `實作與證據邊界` ↔ `Implementation and evidence boundaries` maps initialization, locality, optimization, complexity, claim limits, and four controlled pairs | complete |
| Lecture 7 | `強大 encoder 的兩條路` ↔ `Two routes to more powerful encoders` maps node/edge/graph failures, identity conditioning, substructure counts, positional anchors, spectral ambiguity, and acceptance; implementation maps target cost, edge removal, degree controls, anchor stability, and failure taxonomy | complete |
| Lecture 8 | `Graph Transformer agenda 深入拆解` ↔ `Deep Graph Transformer agenda` maps attention/message passing, local-global scope, structural/Laplacian encoding, sign/basis invariance, Graphormer bias, virtual nodes, scaling, and acceptance; implementation maps mask/bias, paths, split-safe preprocessing, numerics, and outputs | complete |
| Lecture 9 | `異質圖完整建模 agenda` ↔ `A complete heterogeneous-graph modeling agenda` maps schema, canonical types, R-GCN, bases, HGT, time, feature alignment, typed sampling, leakage, and acceptance; implementation maps parameters, normalization, cold start, metric buckets, and schema versions | complete |
| Lecture 10 | `Knowledge graph agenda 深入拆解` ↔ `Deep knowledge-graph agenda` maps open-world data, scoring, TransE, DistMult, ComplEx, RotatE, negatives, filtering, inverse leakage, and acceptance; implementation maps constraints, typed candidates, cardinality, calibration, and inductive limits | complete |
| Lecture 11 | `推薦圖完整 agenda` ↔ `Deep lecture agenda` maps bipartite data, MF, BPR, NGCF, LightGCN, normalization, layer combination, sampling, ranking evaluation, and cold start; implementation maps exposure, interactions, serving, diversity, leakage, and hand-computed acceptance | complete |
| Lecture 12 | `RDL 完整 agenda` ↔ `Deep lecture agenda` maps tabular pipelines, database graph conversion, task tables, temporal snapshots, RelBench, baselines, sampling, typed encoders, effort, and trace acceptance; implementation maps association semantics, identity, label lineage, snapshots, reuse, and future-row rejection | complete |
| Lecture 13 | `進階 RDL 架構 agenda` ↔ `Deep lecture agenda` maps multi-relation bottlenecks, composite aggregation, sharing, relational attention, columns, time, sampler interaction, efficiency, and acceptance; implementation preserves relation-level audit and cost evidence | complete |
| Lecture 14 | `Foundation、prompt與uncertainty agenda` ↔ `Deep lecture agenda` maps cross-database transfer, relational Transformers, task prompts, PRODIGY, in-context evaluation, conformal coverage, graph dependence, shift, and acceptance; implementation maps setting, leakage, permutation, coverage, and abstention | complete |
| Lecture 15 | `KG foundation model agenda` ↔ `Deep lecture agenda` maps transductive, entity/relation/fully inductive settings, relation graphs, double equivariance, ULTRA, InGram, transfer risk, and acceptance; implementation maps split vocabularies, roles, query conditioning, support sparsity, and ID invariance | complete |
| Lecture 16 | `LLM + GNN 完整 agenda` ↔ `Deep lecture agenda` maps complementary gaps, text graphs, LLM encoder/predictor roles, graph enhancement, G-Retriever, GraphRAG evidence, KG construction, training, evaluation, and acceptance; implementation maps entity linking, pruning, serialization, leakage, hallucination, and edge-removal tests | complete |
| Lecture 17 | `Agents + Graphs 完整 agenda` ↔ `Deep lecture agenda` maps QA-to-agent loops, structured tools, STaRK, retriever baselines, traversal, planning, AvaTaR, memory, grounding, cost, safety, and acceptance; implementation maps schema discovery, tool errors, stopping, counterfactual evidence, reproducibility, and authority, with oracle and budget-sweep self-audits | complete |
| Lecture 18 | `圖生成完整 agenda` ↔ `Complete graph-generation agenda`; GraphRNN, ordering, likelihood, validity, GCPN reward, novelty, mode collapse, trace all translated | complete |
| Lecture 19 | Same five-step deck workflow in both languages: random 100 → uniform 12 anchors → anchor ranking → task similarity → transfer best designs; CRS is recorded separately as earlier methodology, while OGB results are 0.785 versus Previous SOTA 0.771 and dissimilar-task transfer 0.736 | complete |
| Lectures 1–19 | Final pair-by-pair semantic audit complete; every concrete mapping is recorded above and no template/filler section remains | complete |

## Editorial depth revision

- Batches A–D：中文版深度擴寫與英文逐節忠實翻譯 audit 已完成；完成證據為上表逐對 mapping，不以 heading counts 單獨判定。
- Batch D, Lectures 16–18：依各自 Fall 2025 官方 deck 完成深度擴寫且 zh-TW 均 ≥ 6,000 字元；Lecture 19 只保留 Conclusion deck 可支持的 Design Space 內容。
- Length audit：Lectures 1–18 的 zh-TW files 均 ≥ 6,000 字元。Lecture 19 為 documented exception：官方 Conclusion deck 聚焦 315K designs、32 tasks、anchor-model ranking、task similarity 與 model transfer，刪除無來源的延伸框架後不以 padding 補足 6,000。
- 擴寫內容限於當期投影片可支持的模型定義、公式推導、設計取捨、資料切分與自學驗收；未以重複摘要補字數，也未引用 2021 錄影作為證據。

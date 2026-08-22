---
title: "Stanford CS224W 第 16 講：LLM + GNN：讓語言模型讀圖，也讓圖模型讀文字"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 17
tldr: "依 Fall 2025 官方投影片整理第 16 講，涵蓋 LLM 與 GNN 的互補缺口、text-attributed graphs、LLM as predictor or encoder，並標明公開材料邊界。"
description: "Stanford CS224W Fall 2025 第 16 講完整 agenda 與自學筆記，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-16-llm-gnn-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 16 講**，官方日期 2025-11-18。本文依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[該列官方投影片](https://web.stanford.edu/class/cs224w/slides/Lecture16.pdf)整理；講者以投影片署名為準。

## 材料與缺口

公開材料包含官方投影片與 schedule 的 optional readings。Canvas 錄影、現場 Q&A、板書與 Ed 討論不公開，本文不推測；2021 公開影片不作為 2025 講次證據。投影片檔名若與講次數字不同，本文仍以 Fall 2025 schedule 的列次對應為準。

## 本講完整 agenda

### 1. LLM 與 GNN 的互補缺口

LLM 擅長文字與世界知識，卻不天然保證多跳圖推理；GNN 能沿邊聚合，卻常缺少文字語意與開放詞彙。這講不是把兩者相加，而是分清楚哪個模組負責理解文字、哪個負責結構。

### 2. text-attributed graphs

text-attributed graph 的節點或邊帶文字。可以先用 language model 產生 feature 再交給 GNN，也可以把鄰域序列化進 prompt；前者保留圖歸納偏置，後者受 context length 與序列化順序影響。

### 3. LLM as predictor or encoder

LLM 可直接預測 graph task、產生 node embedding，或提供 pseudo-label 與 explanation。每種角色有不同成本；用 API 生成全圖 embedding 與只處理 query neighborhood 的預算差很多。

### 4. graph retrieval for LLMs

反方向是先從圖檢索與問題相關的 subgraph，再把結構與文字交給 LLM。檢索錯了，生成模型無法靠流暢文字補回缺失事實，因此 retrieval recall 要獨立評估。

### 5. G-Retriever 與 GraphRAG pipeline

G-Retriever 把 query、圖檢索、subgraph pruning 與生成串起來。自學實作時分開記錄 retrieval metric、答案 metric 與 token cost，才能知道改善來自圖檢索還是生成器。

## LLM + GNN 完整 agenda

### 互補問題

LLM 擅長文字語意與開放詞彙，但把 graph 序列化後不保證保留拓撲與多跳關係；GNN 有明確 neighborhood bias，卻不懂 raw text。整合前先決定 bottleneck 是 text understanding、graph reasoning、retrieval還是generation，否則同時換多個模組無法歸因。

### Text-attributed graph

Node/edge附title、description、document或relation text。第一條路以language model encode text成features，再由GNN propagation；text encoder可frozen或fine-tuned。Feature cache、model version與token truncation需保存，否則圖模型相同也無法重現。

### LLM as encoder

LLM embedding可為無feature的新節點提供語意，也能把異質文字投影到共同space。成本按所有nodes文本量成長；資料更新需重算。比較bag-of-words、小型encoder、frozen LLM、fine-tuned LLM，才能知道大模型帶來多少增量。

### LLM as predictor

將node/edge/subgraph序列化成prompt，直接要求LLM分類或回答。Serialization order、node aliases、edge direction與截斷都會影響輸入。Node permutation後語意應一致；若答案改變，prompt format引入非圖順序bias。

### GNN enhanced by LLM

LLM可產生pseudo-label、explanation或feature，GNN再利用graph consistency傳播。Pseudo-label errors也會沿edges擴散，需記confidence/filter policy並比較不使用pseudo-label baseline。若test text送入LLM產label-like feature，可能構成leakage。

### LLM enhanced by graph

Graph可作structured memory/retrieval source。先將query對齊entities，檢索candidate nodes/paths/subgraph，再把證據序列化給LLM。Entity linking、retrieval、pruning與generation各自有metric；只看final answer會把錯誤來源混在一起。

### G-Retriever pipeline

G-Retriever將query-conditioned graph retrieval、subgraph pruning、graph encoding與LLM generation串聯。Retriever要在token budget內保留足夠evidence；pruning過強會漏答案，過弱會塞滿context。報retrieval recall、subgraph size、tokens與answer quality。

### GraphRAG evidence

Graph-based RAG與普通vector RAG差別在能沿relation組合evidence，但relation extraction/graph construction本身會有錯。對每個answer保存retrieved nodes/edges、原文provenance與generation citation，不能讓LLM補寫不存在的edge。

### KG construction

LLM也可從text抽entities/relations建立KG。Extraction precision/recall、ontology/schema consistency、entity resolution與temporal validity要分開評估。將抽取結果再用於QA會形成兩階段error propagation，不能以QA分數代替KG品質。

### Training

可frozen LLM只訓GNN/projector、joint fine-tune、instruction tune或adapter。每種memory與data requirement不同。若比較只給joint model更多tokens/parameters，需報compute。Graph batch與text batch對齊也要避免同一document跨split。

### Evaluation

分三層：component metrics（linking/retrieval）、task metrics（classification/QA）、system metrics（latency/tokens/memory）。再做text-only、graph-only、retrieval-only與combined ablation。若combined沒有超越最好單模組，整合複雜度未證明。

### 驗收

建立一個答案需兩hop且文本語意必要的小KG。先手工列gold subgraph，再跑entity linker/retriever/pruner/generator。移除關鍵edge應使answer失敗；重排node IDs不應改結果；加入無關高相似文本測retrieval robustness。保存完整trace。

## 實作、失敗模式與驗收

### Entity linking

Natural-language mention要對齊graph entity，需處理alias、同名、new entity與no-match。報linking top-k recall與abstention；若gold entity沒進候選，後續GNN/LLM不可能補救。不可用test answer反查entity。

### Subgraph pruning

從candidate展開neighbors後可能爆量。Pruner可按query relevance、path constraint或budget選nodes/edges。Gold evidence survival與compression ratio一起報；只報較少tokens會鼓勵刪掉答案。

### Serialization

Subgraph轉text時保存node IDs/aliases、relation direction、attributes與provenance。固定排序只為reproducibility，node permutation test確認模型不依賴任意順序。過長path截斷需報失去哪些evidence。

### Fine-tuning leakage

Instruction/QA data若由同一graph triples生成，train/test questions可能文字不同但facts相同。Split應按entities、relations、time或connected components依claim決定。Document chunk重複也需deduplicate。

### Hallucination audit

將回答句拆claims，逐句對retrieved graph/text驗證supported/contradicted/absent。Answer accuracy之外報citation precision與unsupported claim rate。拒答也是合法輸出，特別是retrieval evidence不足。

### Acceptance

建立 component table：linker、retriever、pruner、graph encoder、LLM，各列 input、output、metric、cache 與 version。依序替換一項並保存 trace。若只換 LLM 時同時改 prompt 與 retrieval budget，結果就無法歸因。

## 自學檢查點

重現報告同時保留graph snapshot hash與retrieved evidence IDs。

所有外部模型呼叫需保存model/version與prompt template；否則同一graph trace日後也不能重現。對cache命中與未命中分開報成本。

最終做四格 evidence ablation：保留文字刪圖、保留圖刪文字、保留retrieved subgraph但打亂relation、保留relation但替換node text。這四格分別測language prior、structure、relation semantics與attribute semantics。每格固定LLM、prompt與token budget，報retrieval recall、answer accuracy、unsupported claims與latency。若combined只比text-only多一點卻成本翻倍，結論應是增量有限；若打亂relation仍不降，系統可能根本沒使用graph結構。另以unanswerable queries測abstention，確保沒有evidence時不靠世界知識硬答。

把 pipeline 拆成 graph construction、retrieval 或 sampling、encoder、prediction head 與 evaluation。每次只替換一個部件，保留成本與失敗 trace，才知道改動是否真的有效。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 16 official slides](https://web.stanford.edu/class/cs224w/slides/Lecture16.pdf)

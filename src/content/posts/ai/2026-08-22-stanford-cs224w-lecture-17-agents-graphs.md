---
title: "Stanford CS224W 第 17 講：Agents + Graphs：讓 agent 在結構化世界中檢索、規劃與行動"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 18
tldr: "依 Fall 2025 官方投影片整理第 17 講，涵蓋 從 graph QA 到 agent、STaRK 的多模態檢索、工具使用與 traversal，並標明公開材料邊界。"
description: "Stanford CS224W Fall 2025 第 17 講完整 agenda 與自學筆記，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-17-agents-graphs-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 17 講**，官方日期 2025-11-20。本文依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[該列官方投影片](https://web.stanford.edu/class/cs224w/slides/2025-cs224w-lecture.pdf)整理；講者以投影片署名為準。

## 材料與缺口

公開材料包含官方投影片與 schedule 的 optional readings。Canvas 錄影、現場 Q&A、板書與 Ed 討論不公開，本文不推測；2021 公開影片不作為 2025 講次證據。投影片檔名若與講次數字不同，本文仍以 Fall 2025 schedule 的列次對應為準。

## 本講完整 agenda

### 1. 從 graph QA 到 agent

圖問答通常假設一次檢索後直接預測；agent 則能根據中間觀察重寫 query、走訪鄰居、呼叫工具並停止。多一步自主性也多一步失敗與成本來源。

### 2. STaRK 的多模態檢索

STaRK 把文字、關係與結構放進同一 retrieval benchmark，query 的答案可能需要語意與多跳證據。單看向量相似度會漏掉關係限制，單看圖距離又不懂自然語言條件。

### 3. 工具使用與 traversal

agent 可把 neighbor lookup、attribute filter、reranking 或外部搜尋當工具。每次 traversal 都應留下輸入、輸出與選擇理由，否則最後答案錯時無法分辨是檢索、規劃或生成錯誤。

### 4. AvaTaR 的 adaptive planning

AvaTaR 類方法依回饋調整 traversal：先找候選，再用觀察更新下一步，而不是固定跑完預先寫好的路徑。這適合 schema 不熟悉的圖，但可能產生迴圈與過量工具呼叫。

### 5. 評估成功率、成本與可追蹤性

評估不能只看 final Hit@K 或答案正確率；還要報步數、工具成本、停止條件、證據鏈與失敗類型。設定最大步數並保存 trace，是第一個可執行的安全界線。

## Agents + Graphs 完整 agenda

### 從QA到agent

單次graph QA通常固定retrieval後回答；agent可根據observation重寫query、選tool、走訪neighbors、回溯與停止。自主迴圈把固定pipeline變成policy，也增加loop、tool error、成本與不可重現來源。

### Structured environment

Graph為agent提供state/action space：current entities與evidence是state，可沿edge、filter attribute、search text或invoke external API。Tool schema必須明定inputs/outputs/errors，否則LLM可能產生不存在relation或非法query。

### STaRK task

STaRK類benchmark要求依natural-language query在semi-structured graph中retrieval，答案同時依text attributes與multi-hop relation。Pure vector similarity忽略關係限制，pure graph distance不懂語意，因此可測hybrid retrieval的真正需求。

### Retriever baseline

先比較BM25/text embedding、graph heuristic、GNN retrieval與LLM reranking。固定candidate universe與Hit@K。若agent從一個更強candidate set起跑，就不能把提升全歸planning；initial retrieval quality需單獨報。

### Traversal

Agent每步可選entity/relation並取得neighbors。High-degree node會造成action explosion，需要top-k、relation filter或summary。Pruning可能刪掉gold path，故保存每步candidate list與chosen action，計gold survival rate。

### Planning

Plan可先產完整subgoals再執行，或interleave reasoning/action。前者便於審查但遇到未知schema較脆弱；後者可適應observation但容易loop。最大步數、visited set與stop criteria是必要guardrails。

### AvaTaR

AvaTaR式adaptive traversal依retrieval feedback更新下一步，重點是未知或多樣schema下不固定一條path。評估要區分planner選錯relation、retriever漏entity、tool失敗與generator誤讀evidence。

### Memory

Agent可保存short-term trace、retrieved evidence與long-term schema knowledge。Memory若跨test examples保存answer-related資訊會污染evaluation。明定episode boundary、cache key與是否允許learning from previous tasks。

### Grounding

Final answer應附graph evidence path與source attributes。Evidence存在不代表支持答案，需要驗證relation direction與time。若agent引用自行生成但graph不存在的edge，視為hallucination而非合理推論。

### Cost

每step包含LLM tokens、graph query、reranking與latency。Success rate提升若靠十倍tool calls，部署取捨不同。報平均/percentile steps、tokens、wall time、timeouts與loop rate，不只答案accuracy。

### Safety

Write tools可改graph或外部state時，authority與read/write separation更重要。本講公開材料主要談retrieval/agent能力；自學實驗先限制read-only tools、max steps與sandbox，不擴張成未授權操作。

### 驗收

設計三題：一步lookup、多跳constraint、含誘餌high-similarity node。固定initial retriever，比fixed pipeline與adaptive agent。保存action trace、gold path survival、final evidence與cost；重跑不同node IDs與tool result order測穩定性。

## 實作、失敗模式與驗收

### Schema discovery

未知graph schema時，agent可能先查node/edge types與sample attributes。Schema tool輸出也需budget，且不可暴露hidden labels。比較提供完整schema、局部schema與無schema三種setting，不能混用。

### Tool errors

Graph query可能timeout、empty、permission denied或malformed。Agent policy應區分retry、reformulate與stop，並限制retries。Evaluation注入controlled failures，測是否loop或捏造成功結果。

### Stopping

正確停止需 evidence sufficient，而非token將盡。可訓/提示agent輸出answer、abstain或continue。報premature stop、unnecessary extra steps與budget exhaustion，讓success/cost tradeoff可見。

### Counterfactual evidence

移除gold edge或改一個constraint，answer應改；加入無關高similaritynodes不應改。這比只看trace漂亮更能驗證agent真的依graph evidence，而非language prior猜答案。

### Reproducibility

LLM sampling、tool result order與graph updates會造成variance。固定model version、temperature、seed、tool snapshot，並跑多次報success distribution。只挑成功trace會嚴重selection bias。

### Authority

Read-only traversal與write action分開tool namespace。若課堂方法只需retrieval，self-study不授予graph mutation。任何write需preview、target validation與人工approval；能力評估不能自動擴張操作權。

## 自學檢查點

最後以oracle experiments建立上限：oracle retriever提供gold entities但保留agent planner，可測planning/reading；oracle planner直接提供gold path但保留generator，可測回答；兩者都oracle則測format/evaluation。Actual與三個oracle差距指出投資方向。若oracle retriever已使success大幅升高，先修retrieval；若gold path下仍答錯，增加更多traversal只會浪費成本。這個分解也避免把LLM更換帶來的提升錯算成graph agent策略。

建立agent trajectory evaluator，將每一步標成valid action、useful evidence、redundant、error recovery或hallucinated tool use。Final answer正確但靠錯誤evidence猜中，不能算fully grounded success；答案錯但gold path已retrieved，問題在reader/generator而非planner。報task success、grounded success與oracle-reader success三個層次，才能定位改進。

再做budget sweep：max steps從1、3、5到10，固定其他設定，畫success、groundedness、tokens與latency。若更多steps只增加loop不增success，就應收緊stop；若gold path survival持續上升但answer不升，應改reader。這比只選一個最佳step budget更能說明agent行為。

最後做tool-order permutation與empty-result injection。Agent不應因neighbors返回順序改答案，遇空結果應reformulate或abstain而非虛構edge。每個retry有上限，trace保存error code與下一action，讓resilience可被重播。

把 pipeline 拆成 graph construction、retrieval 或 sampling、encoder、prediction head 與 evaluation。每次只替換一個部件，保留成本與失敗 trace，才知道改動是否真的有效。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 17 official slides](https://web.stanford.edu/class/cs224w/slides/2025-cs224w-lecture.pdf)

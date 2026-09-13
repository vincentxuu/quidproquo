---
title: "Stanford CS329Z 導讀 Week 2：先分清 workflow 和 agent，再手刻第一個 RAG"
date: 2026-09-10
updated: 2026-09-12
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, rag, compound-ai-systems]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 3
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 21
tldr: "Week 2 兩堂課一前一後：週一用 Anthropic 的 taxonomy 學會什麼時候不該用 agent，週三用 RAG 論文做出第一個複合系統。五個 workflow pattern 是選型工具，RAG 是參數記憶加非參數記憶的配方，兩篇合起來就是 HW1 Part A 的施工圖。"
description: "帶讀 Stanford CS329Z Week 2 兩篇主讀物：Anthropic Building Effective Agents 的 workflow/agent 分類與五個 pattern，Lewis 等人 RAG 論文的檢索加生成配方，以及它們如何拼成 HW1 Part A。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en)

Week 2 的兩堂課是刻意排成先後手的。週一主讀物是 Anthropic 的 [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)：先想清楚什麼值得做成 agent，免得一開工就過度工程。週三主讀物是 Lewis 等人的 [RAG 論文](https://arxiv.org/abs/2005.11401)：第一個複合系統的完整配方，當天 hands-on 從零刻一條管線。兩篇合起來，[HW1 Part A](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents) 的施工圖就齊了。

## 先分清：workflow 不是 agent

Anthropic 的第一刀切在定義上。Workflow 是 LLM 和工具照**預先寫好的路徑**走；agent 則是 LLM 自己決定流程和工具怎麼用。名字都叫 agentic systems，選型邏輯完全不同。任務切得開、用固定路徑就夠穩，選 workflow。步驟數預測不了、要模型臨場判斷，agent 才划算。而且多數應用其實連這兩者都不需要——單次 LLM 呼叫加檢索和範例通常就夠了。這段話是整篇的煞車皮，後面每個 pattern 都要回來對它。

## 五個 pattern：選型工具箱

基礎件是 augmented LLM：會自己寫搜尋 query、選工具、決定記什麼的模型，能力要為你的場景裁、介面要好寫。往上五個 pattern 按複雜度排：

**串接（prompt chaining）**：上一步輸出餵下一步，中間可加程式檢查點。任務切得乾淨時用，拿延遲換準確。

**分流（routing）**：先分類再送專門流程。不同輸入值得不同 prompt 時用；分類錯會全盤錯是前提。

**並行（parallelization）**：切成獨立子任務同時跑（sectioning），或同一任務跑多次投票（voting）。要速度或要信心時用；複雜任務每個考量點獨立一通呼叫，效果通常比較好。

**orchestrator-workers**：中央 LLM 臨場拆任務、發包、彙整。和並行差在子任務不是預先定好的。適合拆法隨輸入變的任務，例如多檔案改 code。

**評審-優化（evaluator-optimizer）**：一通生成、一通批改，迴圈打磨。評分標準清楚、且來回改真的會變好時用，例如文學翻譯。

**Agent** 留到最後：環境回饋驅動的工具迴圈，配檢查點和步數上限。開放式問題、步驟數不可預測、且你信得過模型判斷時用。成本高、錯誤會複利，沙盒加護欄是基本配備。

## 框架建議：先直接調 API

Anthropic 的框架觀很硬：框架只是把調模型、定義工具、串呼叫變簡單，但多一層抽象就多一層除錯黑箱，還會誘惑你加不需要的複雜度。先直接用 LLM API，同樣的 pattern 幾行程式就寫得出來；真要用框架，先搞懂底層在幹嘛。附錄二把這句話做到工具定義上。工具格式要好寫：diff 比整檔重寫難寫，JSON 轉義比 markdown 累。給模型留思考 token，寫給 junior engineer 看得懂的 docstring。SWE-bench 實作裡，他們花在調工具上的時間比調總 prompt 還多。相對路徑害模型在換目錄後出錯，改成強制絕對路徑就好了。這就是 ACI（agent-computer interface）：花在 HCI 上的心力，工具介面也值得一份。

## 延伸閱讀：context 是預算，不是水桶

Anthropic 的 [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) 把設計單位從 prompt 擴到整個推論狀態。每一輪塞進模型的不只系統指令，還有工具定義、外部資料、訊息歷史與工具結果。目標不是把視窗填滿，而是留下最少、訊號最強、足以引出正確行為的 token。靜態內容要精簡：工具邊界不要重疊，回傳不要肥大，few-shot 範例寧可少而典型。

動態內容則按需取回。先留路徑、查詢或 URL 等輕量索引，等下一個決策真的需要時才讀全文。長任務另有三種手段：compaction 壓縮過長軌跡、結構化筆記把重要狀態寫到視窗外、subagent 把深入探索隔離後只回傳結論。代價也不同：壓太兇會丟掉後來才變重要的細節，自主檢索則會增加延遲，也可能追錯線索。這是第一方實務指南，不是提供效果量的 benchmark；適合拿來做檢查表，不適合承諾用了就會漲幾分。

對本週 RAG 練習，重點是別停在「抓 top-k 全貼上去」。固定檢索器後，分別改 top-k、chunk 長度、工具回傳格式與 history pruning，同時量答案品質、token 與延遲。另一版可以先只給來源索引，再讓 agent 按需讀段落，看看 progressive disclosure 是否真的省下成本。

## RAG：第一個複合系統的配方

[上一週](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)說系統時代來了，這週直接給配方。RAG 論文的問題意識很準。大模型把知識存在參數裡，下游微調成績好看，但**拿知識出來用的能力**不行。出處交代和知識更新更是無解。解法是參數記憶加非參數記憶：seq2seq 模型（[BART](https://arxiv.org/abs/1910.13461)）配 Wikipedia 稠密向量索引，用神經檢索器（[DPR](https://arxiv.org/abs/2004.04906)）去查。

兩種做法：RAG-Sequence 整段生成盯著同一批檢索段落，RAG-Token 每個 token 可以換段落看。 Jeopardy 生成任務最能看出差別：答案常由兩段不相干事實拼成，Token 版可以前半看一份文件、後半換一份。

訓練方式值得單獨記：檢索器和生成器一起練，不需要標好的檢索答案也能學；文件編碼器凍結，只調 query 編碼器和生成器。檢索器是 DPR 雙編碼器：文件和問題各過一個 BERT，相似度用內積，top-K 用 MIPS 近似搜尋。生成器是 BART-large，輸入和檢索段落直接串接餵進去。

實驗的廣度是這篇被選進課表的真正原因：同一套架構打四種任務。開放域問答拿下當時最佳，而且是生成式答案打贏抽取式前輩。檢索段落裡沒有原文答案也能生對，NQ 這種情況正確率還有一成一，抽取式是零分。抽象問答（MS-MARCO）贏 BART 兩個多 BLEU。Jeopardy 出題請人類盲測，RAG 比 BART 更貼事實的比例是四成二對百分之七。FEVER 查核看检索命中：top 1 就是黃金證據的比例七成。放到 top 10，九成 cover 得到。

消融實驗回答 HW1 一定會問的問題。檢索器凍結不練，每個任務都掉分。把稠密檢索換成 BM25，只有 FEVER 這種實體密集任務 BM25 反而贏。詞語重疊在專有名詞戰場仍有優勢。檢索文件數訓練用五到十篇，測試時 Sequence 版越多越好，Token 版十篇封頂。

知識更新更直接：換索引檔就行。作者拿新舊兩版 Wikipedia 建索引考世界領袖，年份配對答對約七成。年份錯配就只剩一成上下。不用重訓模型——Week 1「動態」理由的機制版。相關工作定位一次說清：REALM 和 ORQA 只做抽取式問答，RAG 是第一個把混合記憶做成通用生成配方的。

對課程的意義：RAG 是最便宜的複合系統範本。 Week 1 的三個設計問題（控制邏輯、資源分配、端到端優化）第一次有了可以動手的具體形狀。

## 延伸閱讀：ColBERT 把細粒度比對留到最後

[ColBERT](https://arxiv.org/abs/2004.12832) 卡在兩種檢索器中間。Bi-encoder 把 query 與 passage 各壓成一個向量，方便離線建索引，卻丟掉細粒度對應。Cross-encoder 把每一組 query–passage 一起送進 BERT，保留完整互動，但每個候選都得重跑模型。ColBERT 分開編碼兩邊，卻保留每個 token 的 contextualized vector。打分時，每個 query token 去找文件 token 中最高的相似度，再把這些 MaxSim 分數加總。

文件 token 可以預先計算，所以同一套機制既能 rerank，也能配向量索引做全庫檢索。論文在 MS MARCO 的設定下，rerank 得到 34.9 MRR@10、延遲 61 ms；同表引用的 BERT-base 是 34.7 與 10,700 ms。

端到端搜尋 880 萬段落時，ColBERT 得到 36.0 MRR@10、96.8 Recall@1000 與 458 ms。這些是 2020 年論文在特定資料、硬體與實作下的結果，不是今天部署時的延遲保證。一篇文件要存多個 token vector，索引空間也明顯變重。

它跟 RAG 的接點不是「換上去答案一定更準」，因為論文量的是 passage ranking，不是生成答案。真正的練習是把 retriever 當成可替換零件。在同一組 query 上比較 BM25、single-vector dense retrieval 與 ColBERT，先量 Recall@k 或 MRR。再把相同數量的段落餵給 generator，確認檢索排名改善有沒有一路傳到最終答案。

## 怎麼做：把上週的 RAG 拿來改

**怎麼做**：拿 Week 1 手刻的兩段式 RAG，用本週五 pattern 挑一個改寫。最順手的是 evaluator-optimizer：加第二通 LLM 呼叫，檢查第一通的輸出有沒有貼著檢索段落。這正是 compound AI 原文舉的例子。量三件事：準確有沒有漲、延遲貴多少、什麼例子修好、什麼例子修壞。結論寫成一句選型理由：這個任務值得多付一通呼叫嗎？這就是 Anthropic 要你每次加複雜度之前回答的問題。

## 它在課程裡的位置

Week 2 是 HW1 Part A 的開工週：週三 hands-on 的 RAG 就是作業的底座。Week 3 的 tool use（[MCP](https://modelcontextprotocol.io/) 在那週進場）把工具接進來，Week 4 的 ReAct 把迴圈的形狀定下來，Part A 的三塊拼圖就齊了。讀 Anthropic 那篇時記住它的煞車皮：每加一個 pattern，先證明簡單版不夠。

## 本週 Course Material 對照

- 週一 9/28 LLMs for Builders：主讀物 Anthropic Building Effective Agents、延伸閱讀 [Rajasekaran 等人 Effective Context Engineering for AI Agents（Anthropic, 2025）](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)，本文均已導讀。
- 週三 9/30 RAG：主讀物 Lewis 等人 RAG、延伸閱讀 [Khattab 等人 ColBERT](https://arxiv.org/abs/2004.12832)，本文均已導讀。
- 課表原文：[CS329Z 官網 Week 2](https://cs329z.stanford.edu/)

## 更新紀錄

- 2026-09-12：補上 Effective Context Engineering 與 ColBERT 兩篇延伸閱讀的實質導讀。

## 參考資料

- 站內：[Stanford CS329Z 導讀 Week 1：別再只調模型了](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)、[Stanford CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Anthropic, Building Effective Agents (2024)](https://www.anthropic.com/engineering/building-effective-agents)、[Anthropic, Effective Context Engineering for AI Agents (2025)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)、[Lewis et al., Retrieval-Augmented Generation, NeurIPS 2020](https://arxiv.org/abs/2005.11401)、[Khattab & Zaharia, ColBERT, SIGIR 2020](https://arxiv.org/abs/2004.12832)
- 工具：[litellm 文件](https://docs.litellm.ai/)、[MCP 規範](https://modelcontextprotocol.io/)

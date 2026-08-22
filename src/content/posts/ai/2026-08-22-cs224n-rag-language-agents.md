---
title: "CS224N 第 10 講：RAG 與 Language Agents 的六個元件"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, rag, ai-agent, tool-use, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 11
tldr: "第 10 講從問答與 RAG 進入 language agents，再拆成推理規劃、記憶、工具、資料與評估；agent 不是單一模型，而是模型與外部狀態之間可被逐步檢查的迴圈。"
description: "逐段讀 CS224N Winter 2026 Lecture 10：QA/RAG、language agents、planning、memory、tools 與 evaluation。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-rag-language-agents-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把第 10 講排在 2026 年 2 月 5 日，但未列講者；本文因此只歸因於 course staff。[官方投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture10-rag-agents.pdf)題為 **RAG and Language Agents**。agenda 先用 adapters 收尾，再依序講問答與 RAG、language agents、推理與規劃、記憶、工具使用、agent data 與評估。

## RAG 把知識來源移到模型外

只靠參數回答，模型的知識受訓練時間與容量限制，也很難指出具體依據。[RAG](https://arxiv.org/abs/2005.11401) 先根據問題檢索文件，再把結果放進生成上下文。典型流程包含索引、retriever、context construction 與 generator。

錯誤可能出現在每一層：文件庫沒有答案、切塊破壞語意、retriever 排錯、context 太長稀釋證據，或 generator 忽略已取回內容。因此評估不能只看最終答案；至少要分開檢查 retrieval recall 與回答是否受證據支持。

## Agent 是模型與環境的迴圈

Language agent 不只一次產生文字。它讀取觀察、維持狀態、選擇動作、呼叫工具，再把工具結果放回下一步。[ReAct](https://arxiv.org/abs/2210.03629) 將 reasoning trace 與 action 交錯，是投影片用來連接推理與行動的代表架構。

這個觀點避免把 agent 當成一個神祕的新模型。模型可能相同，差異在 action space、工具 schema、狀態管理、停止條件與錯誤處理。

## 推理、規劃與記憶

規劃把長目標拆成步驟，並根據新觀察修正。一次寫完整計畫容易在前提改變後繼續走錯；逐步規劃較能反應環境，卻增加模型呼叫與累積錯誤。

記憶可分成目前 trajectory 的短期狀態，以及跨任務取回的長期資料。把所有歷史原封不動塞回 prompt 不是穩健記憶：它增加成本、混入過時資訊，也讓敏感資料更難控管。有效記憶需要寫入準則、檢索與刪除策略。

## 工具使用、資料與評估

[Toolformer](https://arxiv.org/abs/2302.04761)代表讓模型學習何時呼叫工具的一條路；工具把文字意圖轉成 API 或環境動作，可靠性取決於參數 schema、權限邊界、結果驗證與失敗恢復。具有外部副作用的動作還需要 approval，而不是只靠 prompt 要模型小心。

Agent data 不只有最終答案，也包含 observation、thought/action、tool result 與 outcome 的 trajectory。評估可以量任務成功、步數、工具錯誤、成本、延遲與安全違規。只看成功率會把「偶然成功但繞遠路」和穩定方法混在一起。

## 從 closed-book QA 到 retrieval-augmented QA

Closed-book model 只依參數回答；open-book system 可讀外部 corpus。RAG 將 retrieval 與 generation 串起來，但答案品質上限先受 corpus 限制。若來源沒有事實，再好的 retriever 也取不到；若來源彼此衝突，generator 必須處理 provenance 與時間。

Indexing 前決定 document unit。Chunk 太短，證據被切斷；太長，embedding 混合多主題且 context 浪費。Overlap 保留跨界內容，也增加 duplicate retrieval。應以 query-answer evidence span 分布選 chunk，而不是固定套通用數字。

Metadata 包含 title、section、date、authority、permissions。Retrieval filtering 應在取回前執行權限，不可先把敏感內容放進 prompt 再要求模型忽略。

## Retriever 的 sparse、dense 與 reranking

Sparse retrieval 如 BM25 依 token match，對專有名詞、錯誤碼與 exact phrase 很強；dense retriever 把 query/document 映到向量，能找語意相近但用詞不同內容。Hybrid 合併兩種排名，避免把選擇寫成二元宗教。

Dense training 需要 positive 與 negatives。Easy random negatives 訊號弱；hard negatives 和 query 很像但不含答案，能教細緻 boundary，也可能含 false negative。要人工抽查。

Bi-encoder 可預先 index，速度快；cross-encoder 同時讀 query-document，較精確但昂貴，常用 rerank top-k。Pipeline 評估分 candidate recall 與 reranker precision，才知道瓶頸在哪層。

## Context construction 與 grounded generation

取回文件後要排序、去重、截斷並附來源。Prompt 明確分隔 instruction、question、evidence，避免文件裡的文字被當 system instruction。這是 prompt injection 的基本 trust-boundary 問題。

Generator 應被要求引用 evidence ID，但 citation presence 不等於 citation correctness。驗證器要檢查 cited span 是否存在、是否支持 claim。Answerability classifier 可在證據不足時 abstain；拒答也要評估 precision/recall，避免一律保守。

Context 太多會有 lost-in-the-middle 與互相矛盾。Top-k 不是越大越好。畫 performance 對 context tokens/cost 曲線，並測證據位置變化。

## RAG 的分層 evaluation

Retrieval：Recall@k、MRR、nDCG，前提是有 relevance judgments。Generation：answer correctness、faithfulness、citation precision。End-to-end：task success、latency、token cost、abstention quality。

建立四格 error taxonomy：沒有 gold document、gold 未取回、取回但 generator 忽略、generator 使用證據仍推錯。只看 final accuracy 會把四類混在一起，修錯元件。

Evaluation set 要避免 corpus/version leakage，並含 unanswerable、conflicting、freshness 與 permission cases。LLM judge 可輔助，但必須有 human audit，尤其 faithfulness 需要逐 claim 對證據。

## Agent loop 的狀態機

把 agent 寫成 state transition：state 含 goal、observations、memory、budget；policy 產生 action；environment/tool 回 observation；termination 判斷完成、失敗或需人類。這比「LLM 自主做事」可測得多。

Action schema 要有限且 typed。Model 輸出先 validate，再執行。Unknown tool、缺參數、型別錯誤應回可恢復 observation，不是讓 runtime crash。Side-effect action 使用 idempotency key 與 approval。

Termination 防止 loop。設定 max steps、time/token/cost budget、no-progress detection。若連續相同 action 或 observation，agent 應改策略、求助或停止，不是無限重試。

## Reasoning 與 planning 的可觀察介面

Plan-and-execute 先產計畫再逐步做；ReAct 交錯 observation、reasoning、action；search-based method 保留多候選 trajectory。選擇取決於環境可預測性與成本。

長 chain-of-thought 不等於好 plan。可驗證的是 action rationale、precondition、expected observation 與 replanning condition。對使用者不需暴露私有 reasoning，可以輸出簡短 decision record 與工具證據。

Planning benchmark 要有 environment feedback。只評文字計畫像不像，不代表執行時能處理 tool failure 或 state change。

## Memory 的 write、retrieve、forget

短期 scratchpad 保存當前 task；episodic memory 保存過去 trajectory；semantic memory 保存整理後 facts/preferences。三者混成聊天全文，會造成 stale、privacy 與 retrieval noise。

Write policy 決定什麼值得存：經驗是否可重用、來源可信、是否敏感、expiry。Retrieve policy 依 task、recency、similarity 與 authority 排序。Forget policy 支援 TTL、使用者刪除與錯誤修正。

Memory poisoning 是長期風險：惡意工具結果或錯誤推論被存下，未來反覆取回。記憶需要 provenance、confidence 與隔離 untrusted observation，不能因模型自己寫入就當事實。

## Tool use 的權限與恢復

Tool description 影響選擇，schema 影響 argument。先以 read-only lookup 工具驗證 loop，再加入 write。Least privilege 為每次任務授權，而不是讓 agent 永久持有所有 token。

執行結果需結構化：success/error、data、retryable、side-effect ID。Timeout、rate limit、partial success 要有不同策略。重試 write 前先查 transaction 狀態，避免重複寄信或扣款。

Prompt injection 從 web/document 進來時，它是 data，不是 instruction。Tool layer 應依 policy 決定權限，不讓 retrieved text 提升 authority。

## Agent data 與 trajectory learning

Final answer 只告訴結果；trajectory 顯示 observation 與 action。訓練資料可以來自 human demonstrations、成功 rollouts、search、self-improvement 或 failure correction。Filtering 若只留成功，模型看不到 recovery；若只依 reward，可能保留 exploit。

Trajectory 要 version environment/tool，否則舊 action 在新 API 無法重放。保存外部結果 snapshot 或 mock，建立 deterministic replay tests。

Credit assignment 是難點：成功可能只有一個關鍵 retrieval，其他十步多餘。Step-level verifier 或 counterfactual ablation 能找重要 action，比把同一 final reward 平均分所有步好。

## Agent evaluation suite

至少四層：component（tool selection/arguments、retrieval）、trajectory（steps、recovery、redundancy）、outcome（success/quality）、operations（latency、cost、安全事件）。

加入 perturbation：tool timeout、schema change、ambiguous observation、malicious document、permission denial。穩健 agent 應恢復或安全停止，而不是只有理想環境高成功率。

每個 task 多跑 seeds，因 sampling 與外部環境造成 variation。報成功率外，也報 median/p95 steps、cost、human interventions。把「需要人類確認」記為設計行為，不一定是失敗。

## 一個最小可驗證 agent 實作

選無副作用任務：從三份本地文件回答並引用。建立 `search(query)`、`open(doc_id)` 兩工具，有限狀態與最多五步。先用 scripted policy 建 baseline，再換模型 policy。

測試集含可回答、不可回答、兩來源衝突、惡意 instruction 文件。Assertions 檢查 citation、不得超步數、不得把文件 instruction 當 tool command。這個小系統已涵蓋 retrieval、planning、memory state、tool use 與 evaluation，且不需要 production authority。

## 材料缺口

Winter 2026 錄影不公開。本文涵蓋 adapter recap 與六個正式 agenda 主題，不還原講者現場 demo 或口頭案例；對 agent 安全邊界的說明是從架構需求推導的實務檢查，不冒充投影片實驗結論。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 10：RAG and Language Agents 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture10-rag-agents.pdf)
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)
- [ReAct](https://arxiv.org/abs/2210.03629)
- [Toolformer](https://arxiv.org/abs/2302.04761)

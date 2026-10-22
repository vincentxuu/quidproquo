# 抽取紀錄：Akkiraju et al. (2024) FACTS About Building Retrieval Augmented Generation-based Chatbots（NVIDIA）

read_status=full（arXiv v1 PDF 全文 pdftotext；Figure 4 為圖片，另以 pdftoppm 轉 PNG 目視讀完）

## 書目

- Rama Akkiraju, Anbang Xu, Deepak Bora 等 37 位作者，NVIDIA。arXiv:2407.07858 v1（2024-07-10），cs.LG。8 頁（含參考文獻）。
- 讀取方式與全文檔（scratchpad/fulltext/）：curl https://arxiv.org/pdf/2407.07858（1,165,789 bytes）→ pdftotext -layout → o11-facts-akkiraju2024.txt（365 行、47,690 bytes），已讀 1–365 全部。Figure 4（RAG 控制點表）文字未被抽出，用 o11raw/factsp5-5.png（第 5 頁 200 dpi）目視讀。
- 先前 sources.jsonl 記為 HTML 全文已讀，但沒有抽取紀錄；本紀錄補上。

## 性質

- 經驗報告（practitioner experience report），不是對照實驗。唯一的量化結果是 Figure 3：NVHelp 約 245 題上的模型準確度與延遲比較（圖，非表）。

## 研究對象

- 三個內部聊天機器人（Table 1；行 54–62、118–138）：
  - NVInfo Bot：企業內部知識，約 5 億份文件、>7 TB，SharePoint/Google Drive/Slack/Confluence/ServiceNow/Jira，有存取控制，Early Access Testing。
  - NVHelp Bot：IT 支援與 HR 福利，約 2K 份多模態文件，Production。
  - Scout Bot：財報，約 4K 份多模態文件，Production，用 Ragas 評估。

## 可引用結果（行號為 o11-facts-akkiraju2024.txt）

1. FACTS 五面向（摘要，行 31–37）：content freshness (F)、architectures (A)、cost economics of LLMs (C)、testing (T)、security (S)。15 個 RAG 控制點（Figure 4，RAG-C1 Data Ingestion 到 RAG-C15 RAG Monitoring）。
2. 影響最大的環節（行 140–146）："metadata enrichment, chunking, query rephrasal and query re-ranking stages of RAG pipeline have the most impact on the quality of Chatbot responses. LLM response generation quality is highly dependent on retrieval relevancy."
3. 混合檢索（行 161–166）："Vector databases are not so good at handling matching entities (e.g., people names, places, company names etc.)."
4. 測試（§6，行 262–289）：
   - "Testing generative AI solutions can be a lengthy process due to the need for human response validation."
   - LLM 當評審的警告："it is advisable to use caution when using LLMs as human proxy, as using LLMs as judges can lead to self-fulfilling prophecy type of scenarios reinforcing their inherent biases in evaluations as well."
   - "Build Representative Ground Truth Datasets: It is crucial to construct comprehensive ground truth datasets that reflect full spectrum of targeted solution strengths."
   - "Automated tools should be used where feasible to supplement but not replace human oversight."
   - "Prompt Change Testing: ... full regression testing is needed with each prompt alteration."
   - "Plan for Long Test Cycles"
5. 除錯要分層（行 191–200，RAGOps）："When answer quality is poor, a thorough error analysis is required to determine whether the issue lies in retrieval relevancy or LLM response generation." 需要知道哪些 chunk 被存、查詢怎麼被改寫、哪些 chunk 被取回、怎麼排序。
6. Figure 4 中與題庫相關的條目：RAG-C9 Retrieval 的 Challenges 寫 "Relevant document retrieved but not the relevant chunk"；RAG-C6 Chunking 的 Challenges 寫 "Arbitrary token-level splits impact retrieval quality"。
7. Figure 3 的評估規模（行 172–174）："about 245 queries from NVHelp bot domain"。

## 沒寫的事

- 沒說 ground truth 題庫怎麼建、要幾題、題目從哪來、有沒有不可回答題。245 題只是一次模型比較用的題數，不是建議值。
- 沒有失敗率或錯誤分類統計。
- 正文提到 RAG-Op[num]（RAGOps 流程的控制點），Figure 4 只列 RAG-C1–C15，沒有 RAG-Op 條目。

## 與摘要或常見轉述不一致處

- 摘要說 "empirical results ... on the accuracy-latency tradeoffs between large LLMs vs small LLMs"；全文只有一張圖（Figure 3，約 245 題），沒有數字表、沒有統計檢定。
- 常被引為「NVIDIA 建了 3 個 bot 的實證研究」；實際是經驗分享，結論都是作者的觀察。

## 限制

- 作者偏好自家工具（NeMo Guardrails、TensorRT-LLM、NVBot 平台）。
- 三個 bot 都是內部，資料不公開，無法重現。

## 對 order 11 的用法

- 支持「題庫要有代表性、人工驗證不能被 LLM 評審取代、每次改 prompt 要整套重跑」。
- 支持自我檢查的「檢索沒排進前幾名」與「切塊失去上下文」：Figure 4 的 "Relevant document retrieved but not the relevant chunk"、"Arbitrary token-level splits impact retrieval quality"。

## 行號與表格修正（2026-10-22，依 _spotcheck-batch8）
- 引文正確，但行號偏移：§6 實為行 252–270（原記 262–289）；140–146 → 125–130；161–166 → 154–155；172–174 → 156；31–37 → 40。

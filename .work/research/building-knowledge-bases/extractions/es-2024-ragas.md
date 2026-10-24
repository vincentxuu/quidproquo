# 抽取紀錄：Es, James, Espinosa-Anke & Schockaert (2024) Ragas: Automated Evaluation of Retrieval Augmented Generation

read_status=full（arXiv v2 PDF 全文 pdftotext；正文、參考文獻、附錄 A 的 Table 2–4 全部讀完）

## 書目

- Shahul Es、Jithin James（Exploding Gradients）、Luis Espinosa-Anke（CardiffNLP；AMPLYFI）、Steven Schockaert（CardiffNLP, Cardiff University）。
- EACL 2024 System Demonstrations，pp. 150–158，St. Julian's, Malta（ACL Anthology 2024.eacl-demo.16，2026-10-22 curl 查得頁碼）。arXiv:2309.15217（v1 2023-09；讀 v2，2025-04-28）。
- 讀取：curl https://arxiv.org/pdf/2309.15217（231,984 bytes）→ pdftotext → scratchpad/fulltext/o19-es2024-ragas.txt（685 行、31,838 bytes），已讀 1–685 全部。

## 性質

- 工具／方法論文（demo track），有一個小型驗證：50 題 WikiEval。不是大規模實證。

## 研究設計

- 三個「不需要人工標準答案」（reference-free）的面向（行 175–193）：Faithfulness（回答的陳述能否由 context 推得）、Answer Relevance（回答有沒有回應問題）、Context Relevance（context 是否只含回答所需資訊）。
- 全部用 gpt-3.5-turbo-16k 當評審（行 196–199）；Answer Relevance 另用 text-embedding-ada-002 算相似度（行 252）。
- WikiEval（行 306–336）：挑 50 個 2022 年後事件的 Wikipedia 頁（刻意在模型訓練截止後，腳注 5，行 334–336），由 ChatGPT 依導言段出題、作答。兩位標註者標三個面向，faithfulness 與 context relevance 一致約 95%，answer relevance 約 90%（行 341–348）。
- 人工 faithfulness 標註的對照組是「ChatGPT 不給 context 直接作答」的答案（行 349–355）——也就是拿「靠參數知識答」當作不忠實的一方。

## 可引用結果

1. 與人工成對判斷的一致率（Table 1，行 369–401）：Ragas faithfulness 0.95、answer relevance 0.78、context relevance 0.70；直接請 ChatGPT 打 0–10 分（GPT Score）0.72／0.52／0.63；請 ChatGPT 二選一（GPT Ranking）0.54／0.40／0.52。
2. 作者自評最難的是 context relevance："ChatGPT often struggles with the task of selecting the sentences from the context that are crucial, especially for longer contexts."（行 447–451）
3. 動機（行 175–177）："When building a RAG system, we usually do not have access to human-annotated datasets or reference answers."

## 可引用原句

- 為什麼要分開評（摘要，行 23–27）："the ability of the retrieval system to identify relevant and focused context passages, the ability of the LLM to exploit such passages in a faithful way, or the quality of the generation itself."
- Faithfulness 定義（行 179–182）："the answer should be grounded in the given context ... to ensure that the retrieved context can act as a justification for the generated answer."

## 沒寫的事

- 論文只有三個指標；沒有 context precision／context recall（那是之後 ragas 函式庫加的，需 reference）。站內 rag-evaluation-frameworks 第 54–94 行把四個指標寫成 RAGAS「核心指標」，概念上屬於函式庫，不屬於這篇論文。
- 沒有傳統檢索指標（Recall@k、MRR）；"context relevance" 是 LLM 判斷 context 裡多少句子有用，不是「該找的文件有沒有找到」。
- 沒量評審本身的偏誤、重跑變異、非英文表現；judge 只用一個模型。
- 50 題、單一來源（Wikipedia 導言段），題目與答案都由 ChatGPT 生成。

## 對 order 19 的用法

- 支持「把檢索與回答分開看」的框架：三個面向分別對應檢索（context relevance）與生成（faithfulness、answer relevance）。
- 支持自我檢查的機制：faithfulness 的設計就是抓「回答沒用 context」；人工標註甚至把無 context 作答當成不忠實的一方。正確率高但 faithfulness 低 = 回答來自模型自身。
- 不能拿 0.95 說「自動評估可靠」：50 題、英文、同一模型出題作答評審。

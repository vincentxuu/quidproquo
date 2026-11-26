# 抽取紀錄：Microsoft Azure Architecture Center — LLM end-to-end evaluation phase ＋ Information retrieval phase（Evaluate your search results 一節）

read_status=full（evaluation phase 全頁）；IR phase 讀「Evaluate your search results」與 reranking、開頭段，中段搜尋技術（行 56–395、420–517）只看標題（與 order 19 無關）

## 書目

- Microsoft Learn / Azure Architecture Center，「Design and develop a RAG solution」系列。meta author=claytonsiemens77、ms.author=pnp。
- Large language model end-to-end evaluation：https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-llm-evaluation-phase （ms.date 2025-10-10；頁尾 Last updated 2025-11-21）。Contributors：Raouf Aliouat、Rob Bagby、Paul Butler、Prabal Deb、Soubhi Hadri、Ritesh Modi、Ryan Pfalz、Mahdi Setayesh、Randy Thurman。
- Information retrieval：https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-information-retrieval （GitHub 原始檔 ms.date 06/22/2026）。
- 全文檔（scratchpad/fulltext/）：
  - o19-azure-rag-eval-phase.md：curl HTML → 取 `<main>` → pandoc，640 行、26,281 bytes；1–640 全讀。表格被 pandoc 轉成 [TABLE]（行 197），改讀 GitHub 原始檔補上。
  - o19-azure-rag-eval-phase.github.md：raw.githubusercontent.com MicrosoftDocs/architecture-center 原始 Markdown，293 行、26,621 bytes；讀表格行 82–85 與檔頭。
  - o19-azure-rag-ir-phase.github.md：639 行、46,046 bytes；讀 1–56、396–420、518–639。

## 性質

- 廠商官方架構指引，作者主張，無實證數據。

## 可引用內容（行號：E＝eval phase 渲染版，I＝IR phase GitHub 版）

1. 檢索評估放在 IR phase 結尾，答案評估另一篇（I 612–627；E 46–55）。檢索指標：Precision@K、Recall@K、MRR；"You should test positive and negative examples ... For the negative examples, where your data shouldn't be able to address the queries, you want the metrics to be as close to 0 as possible."（I 625）
2. 答案層五個指標：groundedness（faithfulness）、completeness、utilization、relevance、correctness（E 85–93）。
3. 非決定性（E 95–101）："Consider using a target range instead of a single target when you evaluate language model use."
4. Groundedness 定義（E 103–109）："It validates that the response isn't using information other than what exists in the context."
5. Correctness 用評審模型時："ideally a different language model than the one used to generate the result."（E 248–252）
6. 組合判讀（E 350–391）：groundedness 0.9＋correctness 0.4 → 用了 context 但結論錯；utilization 0.9＋completeness 0.3 → 找回的對但不完整；groundedness、utilization 高＋similarity 低 → 轉述差。頁面沒列「correctness 高、groundedness 低」這一格。
7. 不是一次性工作（E 415–421）："Your collection of documents changes over time. The questions that your customers ask change over time ... You should revisit this process again and again. Maintaining documentation of past evaluations is critical."
8. 紀錄超參數與結果、自動保存（E 394–408）："performing multiple evaluations ... might involve hundreds of evaluation runs and thousands of results. You should automate the persistence of parameters and results."
9. 安全評估（E 423–533）：內容安全、智財、間接 prompt injection、個資；"Continuous monitoring is required: Regular audits of document repositories and retrieval patterns."（E 531–533）
10. Completeness × utilization 表（GitHub 版行 82–85）：低 completeness＋高 utilization → 擴 chunk、加 top-k、查為何相關 chunk 沒回來。

## 沒寫的事

- 沒有上線後監控或使用者回饋的具體流程（只有「反覆重做」與「持續稽核」兩句）；監控要另找來源（本系列用 DoorDash）。
- 沒有樣本量建議、沒有人工校準評審的方法。
- 沒有 "correctness 高、groundedness 低" 的判讀；order 19 的自我檢查要靠 Joren 2025、Roychowdhury 2024 支撐，不能說 Azure 講過。

## 對 order 19 的用法

- 「分開評檢索與回答」的一手官方依據：檢索指標與答案指標分兩篇。
- 「答不了的題也要評」：IR phase 的 negative examples（應接近 0）。
- 「評審換一個模型」：E 248–252，可與 CALM 的 self-enhancement 數字並用。
- 「題庫要定期更新」：E 415–421。

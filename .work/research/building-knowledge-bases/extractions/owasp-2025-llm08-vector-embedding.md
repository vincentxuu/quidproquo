# 抽取紀錄：OWASP Top 10 for LLM Applications 2025 — LLM08:2025 Vector and Embedding Weaknesses

read_status=full（curl 取 HTML → 取 <main> → pandoc 轉 Markdown，從標題讀到 Reference Links）

## 書目

- OWASP GenAI Security Project，Top 10 for LLM Applications 2025 第 8 項。
- 正確頁面：https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/ （頁內 JSON-LD datePublished 2024-04-10、dateModified 2025-04-28）。
- GitHub 原始檔：https://github.com/OWASP/www-project-top-10-for-large-language-model-applications/blob/main/2_0_vulns/LLM08_VectorAndEmbeddingWeaknesses.md （頁內錨點連結指向此檔）。
- 網址核對：sources.jsonl 原列 https://genai.owasp.org/llmrisk/llm08-excessive-agency/ 。這個 slug 是 2023 版（v1.1）LLM08 Excessive Agency 的舊網址；2026-10-22 curl 實測它會轉址到上面的 LLM08:2025 頁（最終 URL 為 llm082025-vector-and-embedding-weaknesses）。內容沒讀錯，但網址名稱會誤導讀者（2025 版 Excessive Agency 已改為 LLM06），文章應改用 canonical 網址。
- 全文檔（scratchpad/fulltext/）：o12-owasp-llm08.md（514 行、35,090 bytes；正文在行 37–220，其後是全站 Top 10 側欄），已讀 1–514；原始 HTML o12raw/owasp-llm08.html（364,718 bytes）、o12raw/owasp-old.html（舊網址轉址後內容）。
- 下文「行」為 o12-owasp-llm08.md 行號。

## 性質

- 社群安全風險清單（專家共識文件），不是實證研究；沒有數據。可當「業界安全清單把這列為風險」的出處，不能當「發生率多高」的證據。

## 可引用內容（原文）

1. 定義（行 41–45 附近）："Weaknesses in how vectors and embeddings are generated, stored, or retrieved can be exploited by malicious actions (intentional or unintentional) to inject harmful content, manipulate model outputs, or access sensitive information."
2. 風險 2：跨情境洩漏與聯合知識衝突（行 73–79）："In multi-tenant environments where multiple classes of users or applications share the same vector database, there's a risk of context leakage between users or queries. Data federation knowledge conflict errors can occur when data from multiple sources contradict each other (Ref #2). This can also happen when an LLM can't supersede old knowledge that it has learned while training, with the new data from Retrieval Augmentation."
   - Ref #2 是 Astute RAG（arXiv:2410.07176）。
3. 風險 1：未授權存取（行 63–69 附近）："Inadequate or misaligned access controls can lead to unauthorized access to embeddings containing sensitive information." 另提版權素材與資料使用政策。
4. 風險 4：資料毒化（行 93–99）："Data poisoning can occur intentionally by malicious actors (Ref #5, #6, #7) or unintentionally. Poisoned data can originate from insiders, prompts, data seeding, or unverified data providers, leading to manipulated model outputs."
5. 防範 2：資料驗證與來源認證（行 131–137）："Implement robust data validation pipelines for knowledge sources. Regularly audit and validate the integrity of the knowledge base for hidden codes and data poisoning. Accept data only from trusted and verified sources."
6. 防範 3：合併資料時檢查與分類（行 141–147）："When combining data from different sources, thoroughly review the combined dataset. Tag and classify data within the knowledge base to control access levels and prevent data mismatch errors."
7. 防範 1：權限（行 121–127）："Implement fine-grained access controls and permission-aware vector and embedding stores. Ensure strict logical and access partitioning of datasets in the vector database..."
8. 情境 1：履歷白字指令（行 169–175）——屬 order 14 範圍。
9. 情境 2：不同權限的資料混在同一向量庫（行 179–185）："embeddings from one group might be inadvertently retrieved in response to queries from another group's LLM, potentially leaking sensitive business information."——屬 order 17 範圍，order 12 只需在盤點表記「存取限制」。

## 沒寫的事

- 「知識衝突」只有一句定義，沒有講怎麼決定哪個來源贏、沒有講版本或日期。
- 沒有發生頻率或案例數字。
- 「unintentionally」的資料毒化沒有展開；把過時或錯誤文件收進來算不算毒化，原文沒定義（本紀錄推論：可類比，但文章要寫成類比，不能說 OWASP 這樣分類）。

## 與範圍卡說法的核對

- 範圍卡「OWASP 的跨來源知識衝突」：**正確**，原文用語是 "Data federation knowledge conflict errors can occur when data from multiple sources contradict each other"，列在風險 2 的標題 "Cross-Context Information Leaks and Federation Knowledge Conflict" 下。
- 對應的防範措施是第 3 條「合併資料時要檢查合併後的資料集，並對資料加標籤分類」，可直接接盤點表的「分類／版本」欄。

## 對 order 12 的用法

- 跨來源衝突：引原文定義＋防範 3，作為盤點時要比對同主題多來源的理由。
- 資料毒化：只引「可能來自內部人員或未驗證的資料提供者」與「只收可信、已驗證來源」，作為盤點表「來源可信度／owner」欄的理由；藏指令的細節留給 order 14。
- 權限混用：只引一句，指向 order 17。

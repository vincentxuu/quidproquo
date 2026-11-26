# 抽取紀錄：Microsoft Azure Architecture Center — RAG chunk enrichment phase

read_status=full（curl 取 HTML → 取 <main> → pandoc，從標題讀到頁尾 Last updated）

## 書目

- Microsoft Learn / Azure Architecture Center，"RAG chunk enrichment phase"，RAG 設計系列的一篇（系列導言另見 azure-rag-preparation-phase.md、azure-rag-chunking-phase.md）。
- URL：https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-enrichment-phase
- 頁尾 "Last updated on 2026-06-18"（行 395）。讀取日 2026-10-22。
- 全文檔：scratchpad/fulltext/o15-azure-rag-enrichment.md（401 行，25,266 bytes；正文行 93–305，其餘是頁面框架）。已讀 1–401 全部。
- 目錄完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/

## 文件性質

- 廠商架構指南，不是實驗。沒有任何數字證明哪個欄位有效；只列「常見欄位、用途、產生工具」。
- 範圍聲明（行 135）：只談向量式 RAG；graph-based、agentic、TAG 不在範圍內。

## 可引用內容（照原文）

1. 兩件事都是「擴充 chunk 的 schema」（行 127）："enrich each chunk by cleaning it and augmenting it with metadata … Adding metadata enables you to support searches of the chunks that go beyond semantic searches. Both cleaning and augmenting involve extending the schema for the chunk."
2. **清理後另存一欄、回傳原文**（行 161，Note）："To return the original, uncleaned chunk as the query result, add an extra field to store the cleaned and vectorized data."
3. 欄位用途表（圖說，行 193）：每欄標了型別、用途、查詢方式——Chunk（String, **Return**, Full Text）、CleanedChunk（Vector, **Search**, Vector）、Title（String, Search/Return, Full Text）、Summary（Search/Return, Full Text/Vector）、Keywords（Collection of Strings, **Search/Filter**, Full Text）、Questions（Vector, Search, Vector）。
   - 也就是說 Azure 的分法是「回傳（給人看／引用）」「參與搜尋」「過濾」三種用途，不是「過濾、排序、引用」。
4. metadata 和 embedding 存在同一列（行 185）："The extra metadata fields are all stored in the same row as your embeddings and can be used in the search solution either as filters or as part of a search."
5. 要哪些欄位依領域與查詢型態而定（行 199）："The metadata columns that you need to add depend on your problem domain, including the type of data you have and the types of queries you want to support."
6. 常見欄位清單（行 203–223）：ID（可用 hash，處理時判斷 chunk 是否已存在）、Title（**由語言模型產生**的短摘要式標題）、Summary、Rephrasing、Keywords、Tags（含 MIME type 這類分類器）、Entities、Cleaned chunk text、Questions that the chunk can answer、Source（"Returning the source allows the querier to cite the original source."）、Language（"can be useful as a filter in queries"）。
7. **精確比對的例子**（行 211）："'Review for product X for year 2009' is semantically like 'Review for product X for 2010' and 'Review for product Y for 2009.' In this case, it's more effective to match on keywords for the product and year." Azure 把它歸在 Keywords 欄（工具：語言模型、RAKE、KeyBERT），不是結構化的「型號」「年份」欄。
8. 多語（行 181）："Prefer localizing at the document level and reprocessing each language separately. Avoid storing unvalidated translations."
9. 清理要測（行 173、177）：停用詞、Unicode 移除都附 "You need to test"——"not" 被當停用詞會改變語意。
10. Content Understanding（行 225–275）：一次呼叫產出多個 metadata 欄位，方法分 generate／classify／extract；extract 只支援文件。每個值附 0–1 的 confidence score 和 source grounding，"decide whether a value can be trusted for automated processing or requires human review"（行 275）——等於承認自動產生的 metadata 要有信心門檻與人工複核。
11. 成本（行 288）：每種 enrichment 要估「單價 × 預估 chunk 數」，再配合測試結果決定。

## 沒寫的事

- 清單裡**沒有日期、版本、適用範圍、權限、owner** 欄位。日期與版本是處理過時的前提，但本頁沒提；要另引 OpenAI／Bedrock 的日期過濾範例與 microsoft-copilot-content-lifecycle.md（effective date、review date、current/archived/superseded）。
- Title 指 LLM 產生的標題，不是原文的標題路徑（breadcrumb）。標題路徑要另引 santos-2026、anthropic-2024-contextual-retrieval、yousuf-2026 的 section 欄。
- 沒有任何效果數字。

## 對 order 15 的用法

- 「清理後另存一欄、回傳原文」直接掛行 161。
- 「metadata 的用途」建議照 Azure 圖改成：過濾、參與搜尋、回傳給人看（引用來源）。
- 「精確比對要靠欄位」可掛行 211 的產品＋年份例子，但要說明 Azure 用的是 keywords 欄；結構化欄位＋過濾的寫法要配 OpenAI／Bedrock／Pinecone 的運算子。

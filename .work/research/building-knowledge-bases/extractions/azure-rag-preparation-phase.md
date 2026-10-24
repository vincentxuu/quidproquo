# 抽取紀錄：Microsoft Azure Architecture Center — RAG preparation phase ＋ Design and develop a RAG solution（系列總覽）

read_status=full（兩頁 curl 取 HTML → 取 <main> → pandoc 轉 Markdown，從標題讀到頁尾 Last updated）

## 書目

- Microsoft Learn / Azure Architecture Center，RAG 設計系列。主要作者欄（總覽頁）：Harsha Vardhan Annapureddy、Prabal Deb、Anish Ganguli、Chad Kittel、Clayton Siemens、Junwen Wu；meta author=claytonsiemens77、ms.author=pnp。
- RAG preparation phase：https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-preparation-phase （meta ms.date 2025-10-10；頁尾 Last updated on 2025-11-21）
- Design and develop a RAG solution（總覽）：https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide （meta ms.date 2025-12-17；頁尾 Last updated on 2026-06-30）
- 全文檔（scratchpad/fulltext/）：
  - o11-azure-prep.md：473 行、29,342 bytes（含 HTML 殘留標記；正文在行 93–367），已讀 1–473 全部。
  - o11-azure-overview.md：347 行、19,217 bytes；已用過濾標記後的版本讀完正文（標題到 Last updated）。
  - 原始 HTML：o11raw/azure-prep.html（70,291 bytes）、o11raw/azure-overview.html（59,201 bytes）。
- 下文行號標「P」為 o11-azure-prep.md。

## 性質

- 廠商官方架構指引（規範性建議），不是實證研究；沒有數據、沒有對照實驗。適合當「業界標準流程長什麼樣」的一手出處，不能當「這樣做比較好」的證據。

## 可引用內容（原文）

1. 準備階段要平行做（P 行 127）："you gather documents and multimedia content, analyze the content, and gather sample questions that are pertinent to the domain. You do these steps in parallel because they're interrelated. For example, content analysis helps you determine which test documents, media files, and test queries you should gather. The questions that you ask must be answerable by content in the documents and multimedia, and the content must answer the relevant questions."
   - 注意：這裡說「題目必須能被內容回答」，但同頁後段（P 行 345–351）又要求收「文件答不了的題」。兩句的意思是：主體題庫要可回答，另外刻意收一批不可回答題。
2. 題庫的格式（P 行 309–315，"Gather test query output"）：
   - "Query: The question, which represents a legitimate user's potential prompt."
   - "Context: A collection of the actual text in the documents that address the query. For each bit of context, you should include the page and the actual text."
   - "Answer: A valid response to the query. The response can be content that's directly from the documents, or it might be rephrased from one or more pieces of context."
   - 用途（P 行 305）："By having both the sample queries and the parts of the sample content that address those queries, you can evaluate every stage of the RAG solution while you experiment with different strategies and approaches."
3. 不可回答題（P 行 345–351，"Unaddressed queries"）："It's important to gather queries that the documents don't address and the queries that they do address. When you test your solution, and especially when you test the language model, you need to determine how the solution should respond to queries that it doesn't have sufficient context to answer." 建議的回應方式兩種：說不知道；說不知道並給可能找到資訊的連結。
4. 合成題（P 行 317–343）：SME 常列不出完整題目，可從代表性文件生成合成題。步驟：(1) 切塊——"Don't use the chunking strategy for your overall solution. Use this one-off step"；(2) 每塊生題，"you usually start by generating two queries for each chunk"，附範例 prompt（要求需推理、跨段整合的題目）；(3) 驗證——"A SME should review and validate the output."
5. 真實題優先（P 行 293、361）："Choose real content over synthetic content."；"Determine whether there's a system that contains real customer questions that you can use. For example, ... customer questions from your help desk, FAQs, or ticketing system."
6. 品質閘門與維護（P 行 363–365）："The customer or SME for the use case should act as a quality gate ..."；"Review the body of questions and answers periodically to ensure that they continue to accurately reflect the source documents."
7. 代表性（P 行 151–153、283、299）："You don't want to overrepresent or underrepresent a specific content classification in your experimentation."；"You should have at least two pieces of content for each variation and format."
8. 總覽頁的階段清單：準備 → 切塊 → 豐富化 → 嵌入 → 檢索 → LLM 端到端評估；準備階段一句話摘要："Gather information and test queries and generate synthetic queries and queries that your media files don't cover."；"You should evaluate each step independently for optimization, but remember that the end result is what your customers experience."

## 沒寫的事

- 沒給題庫要幾題。只有「每個內容變體與格式至少兩份測試內容」（內容，不是題目數）與「每塊先生兩題」（合成題生成密度）。範圍卡若要寫「20 題」，出處不能掛 Azure。
- 沒給不可回答題的比例或分類。
- 沒提合成題與真實題分布不同的風險（只說優先真實、合成要像真的、SME 要驗）。

## 與常見轉述不一致處

- 常被轉述成「題庫＝問題＋答案」。原文是三欄：Query、Context（含頁碼與原文）、Answer；出處段落是必要欄位。
- 「題庫和內容分析平行做」：原文確實是 "in parallel"（P 行 127、305），範圍卡說法正確。

## 對 order 11 的用法

- 題庫三欄格式、平行做、含不可回答題、合成題要 SME 驗、真實題優先、定期回頭核對——全部可直接掛這個出處。
- 「20 題」只能當本文自訂的起步量，要另找出處或明說是作者建議。

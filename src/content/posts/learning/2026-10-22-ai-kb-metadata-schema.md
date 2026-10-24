---
title: "結構與 metadata：除了內文，每份文件還要記哪些欄位"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, metadata, filtering, retrieval]
lang: zh-TW
tldr: "metadata 有三種用途：回傳給人引用、參與搜尋、檢索前過濾；型號、年份、地區這種精確條件要放在欄位裡，一項研究把公司和年份寫在每段前面，前五名找到正確段落的比例從 33% 升到 55%。過濾用的欄位從來源系統取值、用固定選項、日期存成數字，不要讓 LLM 自由產生。"
description: "知識庫怎麼建 order 15：metadata 的三種用途、為什麼精確條件要靠欄位、常用欄位清單、欄位怎麼存（日期、固定選項、多值、檔案層或段落層）、清理後另存一欄、讓 LLM 產生 metadata 的風險，以及同一段文字有無標題路徑與日期的差別。"
series:
  name: "知識庫怎麼建"
  order: 15
---

> 🌏 [English version](/posts/learning/2026-10-22-ai-kb-metadata-schema-en)

公司在台北和新加坡各有一份〈請假規定〉，內容大同小異，只有特休天數不同。台北的同事問 AI「到職滿一年有幾天特休」，AI 引了新加坡那份。兩份文件都沒錯，切出來的段落也長得幾乎一樣，檢索沒有理由偏好哪一份。缺的是一個欄位：這份規定適用哪個地區。

這篇是「知識庫怎麼建」AI 段的第五篇。[order 13](/posts/learning/2026-10-22-ai-kb-parsing-cleaning) 把文件轉成了文字，這篇談除了內文之外，每份文件和每一段還要記哪些欄位。誰能查到哪份文件，也就是權限欄位怎麼強制，留給 order 17。讀完你能替自己的語料定一份 metadata schema。

## metadata 的三種用途

Azure 的 RAG 指南把每一段的欄位依用途分成三種（[Azure: RAG enrichment phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-enrichment-phase)）：

- **回傳**：跟著結果一起交出去，讓模型和讀者知道出處，例如來源網址、文件標題。
- **參與搜尋**：被拿去跟問題比對，例如摘要、關鍵字。
- **過濾**：在搜尋之前先篩掉不符合的，例如語言、地區。

同一個欄位可以有不止一種用途。Amazon Bedrock 的知識庫有一個開關，把這件事講得很清楚。關掉時，metadata 只用來過濾，不影響語意搜尋。打開時，metadata 會在建向量之前接到每一段的前面，問題裡提到這些值就會加分；但回傳的原文裡不會出現這些 metadata（[Amazon Bedrock: S3 connector](https://docs.aws.amazon.com/bedrock/latest/userguide/s3-data-source-connector.html)）。

**過濾發生在搜尋之前。** OpenAI 的檢索指南說，屬性過濾是在語意搜尋之前，先把範圍縮到符合條件的檔案（[OpenAI: Retrieval](https://developers.openai.com/api/docs/guides/retrieval)）。開頭那個例子，加上「地區＝台北」的過濾，新加坡那份根本不會進入候選。

## 精確的條件要靠欄位

語意搜尋擅長找「意思相近」的內容，不擅長分辨「型號不同」「年份不同」。Azure 的指南舉過一個例子：「產品 X 的 2009 年評論」，在語意上跟「產品 X 的 2010 年評論」和「產品 Y 的 2009 年評論」都很像，這種時候比對產品和年份的關鍵字更有效。

Yousuf 等人 2026 年用美國上市公司年報做實驗，把公司名稱、年份這類文件層級的資訊寫在每一段的前面，前五名裡找到正確段落的比例，從 33% 升到 55%（[Yousuf et al. 2026](https://arxiv.org/abs/2601.11863)）。他們也發現，影響最大的是公司和年份，章節標題只有小幅幫助。

**文件的結構也是 metadata。** [order 13](/posts/learning/2026-10-22-ai-kb-parsing-cleaning) 提過，在一項研究裡，改成依標題階層切塊、並在每段附上標題路徑（例如「第 3 章 > 3.2 申請程序」），表格題的答對率大幅提升；兩件事是一起改的。LinkedIn 2024 年把客服工單依原本的欄位（摘要、問題描述、優先級、重現步驟）拆成圖上的節點，工單之間再依相關連結連起來，而不是切成固定長度的段落。整套系統的檢索表現和上線後的解決時間都有改善（[Xu et al. 2024](https://arxiv.org/abs/2404.17723)）；不過那是整套系統的結果，沒有拆開量欄位結構本身的貢獻。

## 常用欄位

沒有一份來源列出所有欄位；下面是我從幾份官方指南合起來的清單。Azure 列了 ID、標題、摘要、關鍵字、來源、語言；Microsoft 對 Copilot 的內容建議加了負責人、生效日期、地區、文件類型、複查日期，以及「現行／已封存／已被取代」的狀態（[Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/copilot/employee-self-service/optimization-sharepoint)）；OpenAI 和 Bedrock 的範例都有日期。

| 欄位 | 用途 | 例子 |
|---|---|---|
| 文件 ID | 更新、刪除時找到同一份 | `hr-leave-policy-tw` |
| 來源 | 回傳，讓答案能引用 | 原檔網址或路徑 |
| 標題路徑 | 參與搜尋、回傳 | 請假規定 > 3. 申請與核准 |
| 文件類型 | 過濾 | 政策、操作指南、FAQ |
| 適用範圍 | 過濾 | 地區：台北；對象：正職 |
| 生效日期 | 過濾、排序 | 2025-01-01 |
| 版本與狀態 | 過濾 | 2025 版；現行 |
| 語言 | 過濾 | zh-TW |
| 負責人 | 維護（order 9） | 人資 |
| 權限標籤 | 過濾（order 17） | 全員、限人資 |

order 12 盤點表裡的負責人、版本狀態，到這裡就變成欄位。日期和版本狀態也是 order 18 處理過時文件的前提：沒有這兩欄，就沒辦法「只查現行版」。

## 欄位怎麼存

存的方式決定了能不能用來過濾。幾個廠商文件都有的共同點：

- **日期存成數字。** Bedrock 和 Pinecone 的「大於、小於」比較都只接受數字（[Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-test-config.html)、[Pinecone: Filter by metadata](https://docs.pinecone.io/guides/search/filter-by-metadata)），OpenAI 的日期範例也用 Unix 時間戳。存成「2025年1月1日」這種字串，就只能精確比對，做不了「2024 年以後」。
- **值用固定選項。** 「台北」「臺北」「Taipei」會被當成三個不同的值。適用範圍、文件類型、狀態這些欄位，先定好允許的值。
- **可以多值。** 一份規定同時適用台北和台中，Pinecone 這類系統允許欄位存成清單。
- **掛在檔案還是段落上。** OpenAI 的屬性掛在檔案上，每個檔案最多 16 個；Pinecone 掛在每一筆紀錄，也就是每一段上。如果一份檔案裡不同章節適用不同範圍，在只能掛在檔案上的系統，就得把它拆成幾個檔案。

**清理過的文字另存一欄。** Azure 的指南建議，如果你為了搜尋把文字清理過（去掉符號、統一大小寫），要另外存一欄清理後的版本給搜尋用，回傳時給原文。Bedrock 的做法也一樣：metadata 會影響比對，但不會出現在回傳的原文裡。讀者看到的、模型引用的，應該是原文。

## 讓 LLM 產生 metadata，要小心

手動標 metadata 很花時間，所以很多工具讓 LLM 自動產生：從內文抽出關鍵字、從問題抽出過濾條件。研究看到幾個問題：

- **值會跑出允許的清單。** Poliakov 和 Shvai 2026 年讓 GPT-3.5 從問題裡抽出來源名稱當過濾條件，提示裡給了 49 個允許的來源，它卻寫出 128 種，其中 79 種不在清單上（[Poliakov & Shvai 2026](https://arxiv.org/abs/2607.03929)）。過濾條件指向知識庫裡沒有的來源，那個來源的文件就一份也撈不到。
- **日期條件常常抽不出來。** 同一團隊 2024 年的研究裡，有兩成多的題目跟時間有關，但只有一成多的題目抽出了日期條件（[Poliakov & Shvai 2024](https://arxiv.org/abs/2406.13213)）。
- **過濾太積極會傷召回。** Dadopoulos 等人 2025 年用財報問答測試，讓 LLM 先挑檔案、再改寫查詢，找回正確內容的比例反而下降；用 metadata 擴充段落，答案裡沒有根據的內容還變多了（[Dadopoulos et al. 2025](https://arxiv.org/abs/2510.24402)）；不過同一研究裡，把 metadata 接到段落前面再建向量，最終答案的品質在每一組比較都比較好。這份測試只有 150 題。
- **讓檢索變好，不代表它是對的。** Terrenzi 和 Ayvaz 2026 年讓 LLM 改寫開放資料集的描述，檢索分數最好，但改寫內容裡只有約一半的主張有原始資料支持（[Terrenzi & Ayvaz 2026](https://arxiv.org/abs/2607.05970)）。

所以我的原則是：**用來過濾的欄位，從來源系統取值，不讓 LLM 自由產生。** 地區、生效日期、負責人、狀態，人資系統、文件庫本來就有。LLM 可以幫忙產生摘要、關鍵字這類參與搜尋的欄位，但要抽檢。Azure 的 Content Understanding 也是這樣設計：每個自動產生的值附上信心分數，讓你決定哪些可以直接用、哪些要人工檢查。

## 例子：同一段文字，有沒有 metadata

只有內文的一段：

> 到職滿一年者，給予特休 7 日；滿兩年者，給予 10 日。

假設台北這份去年也改過版，2023 版還留在知識庫裡。加上 metadata 的同一段如下；「適用」「生效」這幾行同時存成過濾欄位，也接在段落前面參與比對：

> 文件：請假規定 > 2. 假別 > 特休
> 適用：台北辦公室，正職員工
> 生效：2025-01-01（現行版）
>
> 到職滿一年者，給予特休 7 日；滿兩年者，給予 10 日。

台北的同事問「到職滿一年有幾天特休」時：

- **只有內文**：台北和新加坡的兩段都會被找到，分數差不多；模型可能引錯，也可能把兩個數字混在一起。
- **加上 metadata**：用「適用＝台北」過濾，新加坡那段不會進入候選；用「狀態＝現行」過濾，2023 版也不會。回答時附上「請假規定 > 2. 假別 > 特休」，讀者知道去哪裡核對。

站內的 [Contextual Retrieval](/posts/ai/2026-03-12-contextual-retrieval) 談了另一種做法：讓 LLM 替每一段寫一句上下文說明；[Hierarchical Chunking](/posts/ai/2026-09-03-hierarchical-chunking-auto-merge) 談了怎麼保留上下層結構。

## 研究的限制

Yousuf 用的是美國上市公司年報、120 題；LinkedIn 是單一公司的客服工單，題數沒有公開；Poliakov 和 Dadopoulos 分別是新聞多跳問答與財報問答。這些都不是一般企業的內部文件。Azure、OpenAI、Bedrock、Pinecone 是官方說明，欄位上限和運算子會隨版本改變。「過濾欄位從來源系統取值」是我依這些研究推出的原則，沒有研究直接比較過。

## 今晚可以做的事

1. **列出你的知識庫最常被問錯的三種情況。** 引錯地區、引到舊版、引錯產品？每一種，對應一個該有的欄位。
2. **用上面的表格，替語料定一份欄位清單。** 每個欄位寫下用途：回傳、參與搜尋，還是過濾。
3. **替過濾用的欄位定好允許的值。** 地區有哪幾個、狀態有哪幾種；日期一律存成數字。
4. **找出每個欄位的值從哪裡來。** 能從來源系統直接拿的，就不要讓 LLM 猜。

## 自我檢查

**問：** 「適用範圍」為什麼要單獨成欄，寫在內文裡不行嗎？

**判準：** 寫在內文裡，它只能參與語意比對，而台北版和新加坡版的內文幾乎一樣，比對分不出來。單獨成欄，才能在檢索前用「適用＝台北」把不相關的版本過濾掉。前提是兩件事：欄位的值要用固定選項，不然「台北」「臺北」會漏掉；在只能把欄位掛在檔案上的系統，一份檔案裡適用範圍不同的章節，要拆成不同檔案。

## 參考資料

- [Microsoft Azure Architecture Center, RAG enrichment phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-enrichment-phase)
- [Amazon Bedrock User Guide, Connect to Amazon S3 for your knowledge base](https://docs.aws.amazon.com/bedrock/latest/userguide/s3-data-source-connector.html)
- [Amazon Bedrock User Guide, Configure and customize queries and response generation](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-test-config.html)
- [OpenAI, Retrieval guide](https://developers.openai.com/api/docs/guides/retrieval)
- [Pinecone, Filter by metadata](https://docs.pinecone.io/guides/search/filter-by-metadata)
- [Microsoft Learn, Optimizing SharePoint content for Employee Self-Service agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/employee-self-service/optimization-sharepoint)
- [Yousuf et al. 2026, Utilizing Metadata for Better Retrieval-Augmented Generation (arXiv)](https://arxiv.org/abs/2601.11863)
- [Xu et al. 2024, Retrieval-Augmented Generation with Knowledge Graphs for Customer Service Question Answering (SIGIR 2024)](https://arxiv.org/abs/2404.17723)
- [Poliakov & Shvai 2024, Multi-Meta-RAG: Improving RAG for Multi-Hop Queries using Database Filtering with LLM-Extracted Metadata (arXiv)](https://arxiv.org/abs/2406.13213)
- [Poliakov & Shvai 2026, Probe, Don't Prompt: A Hidden-State Probe for Metadata Filtering in Multi-Meta-RAG (arXiv)](https://arxiv.org/abs/2607.03929)
- [Dadopoulos et al. 2025, Metadata-Driven Retrieval-Augmented Generation for Financial Question Answering (arXiv)](https://arxiv.org/abs/2510.24402)
- [Terrenzi & Ayvaz 2026, Faithful or Findable? Evaluating LLM-Generated Metadata for RDF Dataset Search (arXiv)](https://arxiv.org/abs/2607.05970)
- 站內：[Contextual Retrieval：幫每個 Chunk 加上「這段在說什麼」](/posts/ai/2026-03-12-contextual-retrieval)
- 站內：[Hierarchical Chunking + Auto-Merge：小 chunk 搜得準，大 chunk 讀得懂](/posts/ai/2026-09-03-hierarchical-chunking-auto-merge)

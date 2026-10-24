---
title: "更新與刪除：文件改了、刪了，AI 知識庫怎麼跟上"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, indexing, freshness, deletion]
lang: zh-TW
tldr: "文件改了或刪了，索引不會自己跟上。比較穩的增量同步是：用內容雜湊判斷哪些文件變了，只重做變了的；刪除要清到每一個存放處，包括全文索引和向量庫。很多工具預設不處理刪除，刪除和更新也可能要過一段時間才生效。為什麼要刪乾淨：一篇預印本把一份過時文件放進上下文，兩個小模型原本答對的醫學題有三到四成被翻錯；要求模型「照文件回答」時，比例升到三分之二到四分之三。"
description: "知識庫怎麼建 order 18：全量重建與增量同步的取捨、用雜湊判斷變更、只改 metadata 時能不能不重算向量、刪除要清哪幾處、預設不偵測刪除的工具、最終一致與同步延遲、過時文件對答案的影響，以及本站 Ask AI 的增量索引流程。"
series:
  name: "知識庫怎麼建"
  order: 18
---

> 🌏 [English version](/posts/learning/2026-10-22-ai-kb-updates-deletion-en)

人資在 9 月撤下了舊的〈遠端工作辦法〉，換上新版。10 月有同事問 AI「一週可以遠端幾天」，AI 答「三天」，那是舊版的規定。新版寫的是兩天，也在知識庫裡；但舊版的段落還留在向量庫，沒有人清。

這篇是「知識庫怎麼建」AI 段的第八篇。[order 12](/posts/learning/2026-10-22-ai-kb-source-inventory) 談了收的時候只收現行版，[order 15](/posts/learning/2026-10-22-ai-kb-metadata-schema) 留了生效日期和狀態欄位，這篇談收進來之後，文件改了、刪了，索引怎麼跟上。特定雲服務的設定步驟不在這篇範圍。讀完你能設計一個增量同步流程，並列出刪除時要清哪幾處。

## 為什麼舊版一定要清掉

order 12 提過，上下文裡多一段過時資料，模型的表現就明顯變差。Ahmed 等人 2026 年的預印本把這件事量得更細（[Ahmed et al. 2026](https://arxiv.org/abs/2609.31342)）：他們把一份過時文件直接放進上下文，兩個 7B 和 8B 的開源模型，原本不給文件也答對的醫學題，分別有 30% 和 37% 被翻錯。如果再加上「請照文件回答」的指示，比例升到三分之二到四分之三。軟體類的題目被翻錯的比例低一些。

另一個發現更值得注意：把舊文件換成新文件時，模型幾乎都照新的答。所以問題不是模型不用檢索，而是舊文件還留在那裡、被撈到了。他們也發現，把「哪天起失效」明確寫在文件裡，大一點的模型幾乎都能判斷出這份已經過時。這呼應 order 15：生效日期和狀態要有欄位。

## 全量重建，還是增量同步

**全量重建**是每次把所有文件重新切塊、重算向量、重建索引。簡單、不會漏，但文件一多就慢又貴。

**增量同步**只處理變了的文件：新增的加進去、改了的重做、刪掉的移除。快，但要能正確判斷「什麼變了」，也要記得處理刪除。

常見的判斷方式是**內容雜湊**：把文件內容（有時加上 metadata）算成一串雜湊值，跟上次記下的比，不同就代表改了。LangChain 的索引工具就是這樣做，雜湊值同時當作向量的 ID，內容沒變就跳過（[LangChain: Indexing API](https://github.com/langchain-ai/langchain/blob/v0.3/docs/docs/how_to/indexing.ipynb)）。不過不是每家都用雜湊：Azure AI Search 讀 Blob 儲存時，是靠檔案的修改時間判斷（[Azure: Change and delete detection](https://learn.microsoft.com/en-us/azure/search/search-howto-index-changed-deleted-blobs)）；Amazon Bedrock 的知識庫只說同步會處理新增、修改、刪除的文件，沒有公開怎麼判斷（[Amazon Bedrock: Sync your data](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-data-source-sync-ingest.html)）。

**只改 metadata，不一定要重算向量。** 重算向量是最貴的一步。Pinecone 可以只更新 metadata、不送向量（[Pinecone: Update data](https://docs.pinecone.io/guides/manage-data/update-data)）；Bedrock 在只改了 metadata 檔、內容沒變、內容不是 CSV、也沒用自訂 Lambda 的情況下，不會呼叫 embedding 模型。如果你的 metadata 有接在段落前面參與比對（order 15），那改 metadata 就得重算。

**增量也不是永遠比全量好。** Xiao 等人 2024 年的預印本發現，常用的向量索引 HNSW 在反覆刪除、插入幾千輪之後，有 3% 到 4% 的資料點再也搜不到，調查詢參數也補不回來（[Xiao et al. 2024](https://arxiv.org/abs/2407.07871)）。這是在影像向量的標準測試集上量的，不是問答系統；但它提醒，長期只做增量的索引，偶爾還是要全量重建一次。

## 刪除最容易漏

**很多工具預設不處理刪除。**

- Azure AI Search 的文件寫得很清楚：變更可以自動偵測，刪除不行；刪除偵測如果沒在第一次執行前設好，之前刪掉的文件會一直留在索引裡。切塊之後一份檔案對應多筆索引資料時，這個機制還不適用，要自己呼叫刪除。
- LangChain 的索引工具有幾種清理模式，日常用的增量模式不會刪掉已經不存在的來源，只有完整模式會。
- order 17 提過，Microsoft 365 Copilot 連接器的增量爬取也不處理刪除。

**刪除要清到每一個存放處。** 一份文件收進知識庫後，通常不只存在一個地方：向量庫、全文索引、文件清單、快取，有時還有不同語言或不同切法的副本。刪除時，每一個都要清。

**刪除不是馬上生效。** Pinecone 的文件說，更新和刪除都是最終一致，要過一下才會反映在查詢結果；Bedrock 說同步完成之後，還要幾分鐘才查得到。order 14 提過的 ConfusedPilot 研究也量到，檔案刪除之後，Microsoft 365 Copilot 還會繼續引用它幾十秒到幾分鐘。

## 同步失敗要看得到

增量同步會失敗：某個檔案解析不了、某批向量寫入逾時、連接器權限不足。order 12 提過，有的連接器權限不足時一個檔案都不匯，也不報錯。所以同步流程要留下紀錄：這次處理了幾份、成功幾份、失敗幾份、哪幾份。Bedrock 的同步工作就有失敗文件數這類統計；Google 的 RAG Engine 可以把每個檔案的結果寫到指定的地方（[Google Cloud: RAG Engine data ingestion](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/use-data-ingestion)）。

監控時至少看三件事：來源有幾份、索引有幾份、最後一次成功同步是什麼時候。三個數字對不上，就是該查的時候。

## 例子：本站 Ask AI 的增量索引流程

這個網站的 Ask AI 功能，用的就是一套增量同步（站內有[完整說明](/posts/ai/2026-08-30-ask-ai-indexing-pipeline)）。簡化後的流程：

1. **算雜湊。** 每篇文章的標題、分類、描述、標籤、正文，算成一個 `source_hash`。
2. **比清單。** 跟資料庫裡記的清單比：新的加進去、雜湊不同的重做、資料庫有但 repo 裡沒有的刪掉。
3. **防呆。** repo 裡的文章清單如果是空的，拒絕同步，避免一次把索引刪光。
4. **刪除清五處。** 一篇文章刪掉時，要清四張資料表（兩個全文索引、段落表、文章表），再透過一個刪除佇列，清掉向量庫裡的向量。
5. **向量庫非同步追上。** 先清完刪除佇列，才寫入新的向量；寫入成功後才記下「這段已經更新」。失敗的留著，下一批重試。

這套流程也有可改進的地方：目前只改了標籤或描述，整篇的向量也會全部重算，比只改 metadata 的做法貴；而且在向量重算完成之前，同一個段落 ID 的新舊版本會短暫並存。

## 研究的限制

Ahmed 等人是預印本，數字來自醫學題和兩個小模型、每個模型約 50 題，過時文件是直接放進上下文，不是跟新文件一起競爭檢索。Xiao 等人也是預印本，用的是影像向量資料集。LangChain 的說明是 v0.3 版的文件。各家工具的同步行為會隨版本改變，Bedrock 和 Pinecone 都沒有公開延遲的具體數字。

## 今晚可以做的事

1. **查你的同步方式會不會處理刪除。** 是預設就刪，還是要另外設定、另外跑完整同步？
2. **列出一份文件會存在哪幾處。** 向量庫、全文索引、清單、快取，刪除時每一處都要清。
3. **做一次刪除測試。** 在來源刪掉一份測試文件，跑同步，再問一題只有那份文件答得出來的問題，看 AI 還會不會引用它。
4. **加一個同步監控。** 來源份數、索引份數、最後一次成功同步的時間，放在看得到的地方。

## 自我檢查

**問：** 來源刪了一份文件，向量庫裡還在，會發生什麼？

**判準：** AI 會繼續找到它、引用它，答出已經撤下的內容，而且看起來跟其他答案一樣可信。如果新版也在，兩版會一起被撈到，模型可能混著答或答錯；如果只有舊版，模型會很有把握地答出過時的內容。所以刪除要傳播到每一個存放處，並用一題測試確認它真的不見了。

## 參考資料

- [Ahmed, Galke Poech & Röttger 2026, Stale-Document Poisoning: When Outdated Retrieval Overrides Correct Model Answers (arXiv)](https://arxiv.org/abs/2609.31342)
- [LangChain v0.3 docs, How to use the LangChain indexing API](https://github.com/langchain-ai/langchain/blob/v0.3/docs/docs/how_to/indexing.ipynb)
- [Azure AI Search, Change and delete detection using indexers for Azure Storage](https://learn.microsoft.com/en-us/azure/search/search-howto-index-changed-deleted-blobs)
- [Amazon Bedrock User Guide, Sync your data with your Amazon Bedrock knowledge base](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-data-source-sync-ingest.html)
- [Google Cloud, Use data ingestion with RAG Engine](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/use-data-ingestion)
- [Pinecone, Update data](https://docs.pinecone.io/guides/manage-data/update-data)
- [Pinecone, Delete data](https://docs.pinecone.io/guides/manage-data/delete-data)
- [Xiao, Zhan, Xi, Hou & Liao 2024, Enhancing HNSW Index for Real-Time Updates: Addressing Unreachable Points and Performance Degradation (arXiv)](https://arxiv.org/abs/2407.07871)
- [RoyChowdhury et al. 2024, ConfusedPilot: Confused Deputy Risks in RAG-based LLMs (arXiv)](https://arxiv.org/abs/2408.04870)
- 站內：[Ask AI 的文章怎麼進知識庫：Chunk、D1 FTS5 與 Vectorize](/posts/ai/2026-08-30-ask-ai-indexing-pipeline)

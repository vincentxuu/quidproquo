---
title: "盤點來源：哪些文件該進 AI 知識庫，信哪個版本"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, data-inventory, versioning, retrieval]
lang: zh-TW
tldr: "共用硬碟整包匯進去，是 AI 知識庫最常見的開頭，也是最常見的錯。舊版和現行版一起被撈到時，模型會混在一起答：一項研究裡，現行資料明明有被撈到，旁邊只多一段過時資料，總分就降了兩成多。先做一張來源盤點表，記下每個來源的負責人、更新頻率、存取限制和處理方式；第一批只收一個工作流程、治理良好的來源；同一份文件只收現行版，舊版要收就標版本與失效日期。匯入之後核對檔案數，因為有的連接器權限不足時一個檔案都不匯，也不報錯。"
description: "知識庫怎麼建 order 12：為什麼不能全部匯進去、舊版和重複文件對答案的影響、來源盤點表的欄位、第一批收錄範圍怎麼定、多版本怎麼處理，以及連接器的靜默失敗。"
series:
  name: "知識庫怎麼建"
  order: 12
---

> 🌏 [English version](/posts/learning/2026-10-22-ai-kb-source-inventory-en)

人資的共用資料夾裡有三份〈差旅辦法〉：「差旅辦法_2023.docx」「差旅辦法_2025_定稿.docx」，還有一份「差旅辦法_2025_定稿(1).docx」，內容跟定稿只差一個數字。團隊把整個資料夾匯進 AI 知識庫，有人問「國內出差住宿上限多少」，AI 回了兩個數字，說「依版本而定」。

這篇是「知識庫怎麼建」AI 段的第二篇。[order 11](/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first) 先寫好了測試題，這篇決定哪些文件要收進來、同一份文件有好幾版時信哪一版。檔案怎麼轉成文字留給 order 13，誰能查到哪份文件留給 order 17。讀完你能填出一張來源盤點表，並決定第一批收錄範圍。

## 為什麼不能整包匯進去

**舊版比沒有更糟。** Ouyang 等人 2025 年做了一個專門測過時資料的基準（[Ouyang et al. 2025](https://aclanthology.org/2025.acl-long.301/)）。他們發現，就算現行的資料已經被撈到，上下文裡只要多一段過時的資料，Llama 70B 的總分就降了兩成多；多放六段無關的干擾段落，分數卻幾乎沒變。更糟的是只撈到舊資料、沒撈到新資料的時候，模型會很有把握地答錯，比什麼都沒撈到還危險。作者的說法是，過時資料是在主動誤導模型，不只是雜訊。

**靠檢索分不出新舊。** 同一篇研究也測了搜尋端：不考慮時間時，舊資料被排進前五名的機率跟新資料差不多；加上時間衰減，舊資料還是有將近一半的機會進前五名，新資料的命中率反而掉了。資料治理廠商 Deasy Labs（Collibra 旗下）的白皮書這樣解釋：內容幾乎一樣的兩份文件，在向量空間裡也幾乎在同一個位置，檢索模型沒有理由偏好其中一份，所以兩份都會被撈到（[Deasy Labs 2025](https://www.deasylabs.com/resources/Detecting_the_Latest_Document_Version.pdf)）。

**多版本混在一起，版本題就答不好。** Huwiler 等人 2025 年用一份混了多個版本的技術文件出題，一般 RAG 在需要指定版本的題目只答對 55%，問「有哪些版本」的題目只答對 35%（[Huwiler et al. 2025](https://arxiv.org/abs/2510.08109)）。錯誤裡最大的一類，是不同版本的段落同時被撈出來、互相矛盾。

**完全相同的副本倒不是大問題。** Ross 等人 2026 年把同一份文件的完全相同副本直接放進模型的上下文，放一到五份，答案的正確率大致不變（[Ross et al. 2026](https://arxiv.org/abs/2608.13956)）。所以要清副本，理由有兩個。第一，副本會佔掉檢索的名額，擠掉其他需要的段落（這篇沒有測這點）。第二，很多「副本」其實不一樣，像開頭只差一個數字的「定稿(1)」，那才會讓模型答錯。

OWASP 2025 年的 LLM 應用十大風險也把這件事列進去：資料來自多個來源、彼此矛盾時，會造成知識衝突的錯誤；建議合併多個來源前要審查，並替資料加上標籤與分類（[OWASP LLM08:2025](https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/)）。

## 來源盤點表

所以第一件事不是匯入，是盤點。Soni 2026 年的實務文章建議，每個來源記下負責人、多久變一次、有沒有敏感欄位、存取規則，以及一個處理方式；而處理方式是最重要的一欄（[Soni 2026](https://dzone.com/articles/ai-retrieval-with-existing-data)）。Microsoft 對 Copilot 的內容建議也要求文件標上負責人、生效日期與複查日期（[Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/copilot/employee-self-service/optimization-sharepoint)）。

把兩者合起來，我會用這些欄位：

| 欄位 | 要回答的問題 |
|---|---|
| 來源系統 | 在哪裡？共用硬碟、wiki、客服系統、資料庫 |
| 格式與量 | Word、PDF、網頁、表格？大約幾份、多大 |
| 負責人 | 內容對不對，誰說了算（照 order 9，寫角色） |
| 更新頻率 | 多久變一次？每週、每季、隨時 |
| 存取限制 | 誰能看？有沒有個資或機密（order 14、17 會用到） |
| 版本狀態 | 有沒有多個版本？哪一份是現行版 |
| 處理方式 | 收進索引、即時查詢、只當篩選條件，或排除 |

**處理方式有四種。** Soni 的經驗法則是：穩定、大家都能看的內容收進索引；常常變動或敏感的資料，回答時即時去查；有些來源只拿來當篩選條件；剩下的排除。例如客服文章收進索引，歷史工單即時查，帳務資料不進索引、需要時才即時查。Microsoft 的 AI agent 資料架構指南也建議，替每個資料領域決定是用搜尋、用 API，還是兩者都用（[Microsoft CAF](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai-agents/data-architecture-plan)）。

## 第一批收什麼

不要一開始就收全公司。Soni 的建議是先選一個工作流程：沒有明確負責人的全公司搜尋，你連結果對不對都判斷不了。Microsoft 也建議先拿治理良好、風險低的網站試行，確認每個網站都有負責人，再擴大。

order 11 的測試題在這裡派上用場：把每一題的出處列出來，這些出處所在的來源，就是第一批要收的範圍。找不到出處的題目，代表還有來源沒列進盤點表。

填「格式與量」那欄時，每個來源隨手打開五到十份，看看內容分成哪幾類，例如規章、表單、會議紀錄、過期公告。order 13 抽檢解析時，就從這幾類各挑兩份。

## 同一份文件有好幾版時

我的規則是：

- **只收現行版。** Microsoft 的建議是封存或刪除重複和過時的內容，確保已發布的文件庫裡只有一份權威版本，並用 metadata 標記「現行」「已封存」「已被取代」。
- **舊版要收，就標版本和失效日期。** 例如合約糾紛要查當時適用的版本。舊版要明確標出「2025 年 1 月 1 日起失效，已被 2025 版取代」，而且預設不出現在一般查詢裡。order 15 會談 metadata 怎麼設計，order 18 會談舊版怎麼處理。
- **不要指望檢索自己分新舊。** 上面的研究已經看到，靠語意相似或時間衰減都分不乾淨。
- **檔名裡的「定稿」「最新」「(1)」不能當版本依據。** 判斷哪一份是現行版，要看文件自己寫的生效日期，其次才是系統的修改時間（Deasy Labs 的版本判斷也是這個順序）。

## 連接器會安靜地失敗

很多 AI 知識庫產品用「連接器」直接從 Google Drive、SharePoint 這類系統匯入文件。這裡有一個容易漏掉的地方。Google 的 RAG Engine 文件寫道，從 Google Drive 匯入時，服務帳號必須有正確的權限，否則「no files are imported and no error message displays」：一個檔案都不會匯入，也不會顯示錯誤訊息（[Google Cloud: RAG Engine data ingestion](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/use-data-ingestion)）。

同一頁也寫了它怎麼判斷重複：同樣的路徑、檔名，而且內容雜湊一樣，才會跳過。換句話說，放在兩個資料夾的同一份文件、改了檔名的副本、只差一個數字的舊版，都會各自被收進去（這是我依它的規則推論的）。平台的去重不等於版本管理。

所以盤點表要多記兩件事：連接器用哪個帳號讀、那個帳號有沒有權限；以及每個來源應該有幾份檔案。匯入之後，比對實際匯入的數量。Google 的 RAG Engine 也可以把每個檔案匯入成功或失敗的結果寫到一個地方，方便事後核對。站內〈[從來源到索引：私有語料的同步與增量更新管線](/posts/ai/2026-08-22-private-corpus-sync)〉有更多同步與增量更新的細節。

## 例子：一間公司的來源盤點表

| 來源系統 | 格式與量 | 負責人 | 更新頻率 | 存取限制 | 版本狀態 | 處理方式 |
|---|---|---|---|---|---|---|
| 人資共用資料夾 | Word、PDF，約 300 份 | 人資 | 每季 | 全員可看；薪資相關除外 | 多版本並存，檔名不可靠 | 只收現行版；舊版標失效日期、不進一般查詢 |
| 團隊 wiki | 網頁，約 1,200 頁 | 各頁負責人 | 隨時 | 部分空間限部門 | 單一版本 | 收進索引；限制空間先排除 |
| 客服系統的歷史工單 | 文字，數萬筆 | 客服主管 | 即時 | 含客戶個資 | — | 不收；需要時即時查，並遮蔽個資 |
| 產品規格 PDF | PDF，約 50 份 | 產品經理 | 每次發版 | 內部 | 每版一份 | 只收現行版；上一版若客服要查舊客戶，標版本號與停用日期、不進一般查詢 |
| 財務報表 | 試算表 | 財務 | 每月 | 限財務 | — | 排除 |
| 組織架構表 | 試算表，1 份 | 人資 | 每月 | 全員 | 單一版本 | 不收內文；部門、職稱只當篩選條件 |
| 已離職同事的個人資料夾 | 混雜 | 無 | 不再更新 | 不明 | 不明 | 排除；有用的內容先找新負責人認領 |

如果 order 11 的測試題多數出自人資和 wiki，第一批就只收前兩列，產品規格等測試題補上了再收。

## 研究的限制

Ouyang 用的是英文維基百科的歷史版本；Huwiler 和 Ross 都還是預印本，Huwiler 是作者自建的 100 題技術文件測驗，Ross 用的是虛構資料的短答題，都不是企業文件。直接比較「留著舊版」和「只收現行版」的量化資料，我只找到 Deasy Labs 一份，那是廠商用自家工具做的評估，舊版也是刻意造出來的近似副本。Soni 和 Microsoft 的盤點建議是實務經驗，沒有附成效數據；OWASP 的清單是社群共識。

## 今晚可以做的事

1. **把 order 11 測試題的出處列成一欄。** 數一數它們分布在幾個系統。
2. **替這些系統各填一列盤點表。** 七個欄位都填，特別是負責人和處理方式。
3. **在最常被問的來源裡找重複和多版本。** 搜檔名裡的「定稿」「最新」「(1)」「v2」，決定哪一份是現行版。
4. **如果已經接了連接器，核對一次檔案數。** 來源有幾份、索引裡有幾份；對不上，先查連接器帳號的權限。

## 自我檢查

**問：** 同一份規章有 2023 年和 2025 年兩版，兩份都收嗎？

**判準：** 只收現行版。2023 版跟 2025 版放在一起，檢索會把兩份都撈出來，模型可能混著答，或者引到舊的規定；靠檢索自己分新舊並不可靠。如果有理由要查舊版，例如處理 2024 年發生的爭議，就收進來，但明確標上版本與失效日期、標成「已被取代」，並讓它預設不出現在一般查詢裡。

## 參考資料

- [Ouyang et al. 2025, HoH: A Dynamic Benchmark for Evaluating the Impact of Outdated Information on Retrieval-Augmented Generation (ACL 2025)](https://aclanthology.org/2025.acl-long.301/)
- [Deasy Labs 2025, Detecting the Latest Document Version Counters Context Decay and Raises RAG Accuracy by 46%](https://www.deasylabs.com/resources/Detecting_the_Latest_Document_Version.pdf)
- [Huwiler, Stockinger & Fürst 2025, VersionRAG: Version-Aware Retrieval-Augmented Generation for Evolving Documents (arXiv)](https://arxiv.org/abs/2510.08109)
- [Ross, Koopman, van der Vegt & Zuccon 2026, How retriever redundancy and diversity impact RAG effectiveness (arXiv)](https://arxiv.org/abs/2608.13956)
- [OWASP Top 10 for LLM Applications 2025, LLM08: Vector and Embedding Weaknesses](https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/)
- [Soni 2026, Connect Existing Data to AI Retrieval (DZone)](https://dzone.com/articles/ai-retrieval-with-existing-data)
- [Microsoft Learn, Optimizing SharePoint content for Employee Self-Service agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/employee-self-service/optimization-sharepoint)
- [Microsoft Cloud Adoption Framework, Data architecture for AI agents](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai-agents/data-architecture-plan)
- [Google Cloud, Use data ingestion with RAG Engine](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/use-data-ingestion)
- 站內：[從來源到索引：私有語料的同步與增量更新管線](/posts/ai/2026-08-22-private-corpus-sync)

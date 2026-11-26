# 步驟零研究：子題 A（摘要的資訊型寫法與評估）＋子題 B（反證）

研究日期：2026-10-28。全文存檔（未交付，僅供複查）：`/private/tmp/claude-501/-Users-vincent-Work/515cc966-24cd-44b8-969c-8b3266511466/scratchpad/txt/`（arXiv HTML 轉文字、PDF 經 pdftotext）。

## 讀取程度標記與方法說明

- ✅ 讀過正文：整份全文已下載落地，並逐節讀過本紀錄引用的段落（摘要、結果、限制）。長論文以 python 逐關鍵字抽段讀，不是逐字通讀全篇，因此凡是「全文在手、只讀相關節」的一律標 🟡 並寫出讀了哪幾節；✅ 只用在短文（網頁文章、規範條文）確實整篇讀完的情況。
- 🟡 部分：寫明讀了哪些節。
- 🔎 只看搜尋片段：不可引，僅作線索。

---

## 一、來源表

| # | 來源 | 年份 | 證據類型 | 讀取程度 | 管道 |
|---|---|---|---|---|---|
| A1 | ANSI/NISO Z39.14-1997 (R2009) Guidelines for Abstracts（Oregon DOT 存放的 PDF；R2015 為再確認版，NISO 頁面摘要文字相同）https://www.oregon.gov/ODOT/Programs/ResearchDocuments/Abstract-Guidelines.pdf | 1997/R2009/R2015 | 標準（指南） | 🟡 §1–7 全讀＋附錄 II 範例 A–D、III；未讀附錄 I、IV–VI 全部範例 | Exa 搜尋→curl PDF→pdftotext |
| A2 | ISO 214:1976 Documentation — Abstracts for publications and documentation，預覽頁 https://cdn.standards.iteh.ai/samples/4084/f2e65ec6fab64cacb54e456ba424f28d/ISO-214-1976.pdf（ISO 頁面：2026 年再確認，仍有效） | 1976 | 標準 | 🟡 預覽頁 §0、§1、§2（定義含註 1–3）、§5.1；其餘為付費內容 | Exa 搜尋片段＝預覽全文 |
| A3 | Borko & Bernier,《Abstracting Concepts and Methods》Academic Press 1975 | 1975 | 專書 | 🔎 只讀到轉述（The Indexer 1997 比較文、CRL 1976 書評） | Exa；archive.org 有掃描本 `abstractingconce0000bork` 但 `access-restricted-item: true`（需借閱登入），fulltext inside API 回傳非 JSON |
| A4 | Hartley 2004, "Current findings from research on structured abstracts", JMLA, https://pmc.ncbi.nlm.nih.gov/articles/PMC442180/ | 2004 | 文獻回顧（作者整理實證） | 🟡 Results 條列與逐條討論段（經 Exa 搜尋擷取的長段落） | Exa |
| A5 | Hartley, Sydes & Blurton 1996, J Inf Sci 22(5)；Hartley & Benjamin 1998（cogprints 存檔） | 1996/1998 | 實證 | 🟡 1996 只讀摘要；1998 讀 Results/Discussion 節 | Exa |
| A6 | Hartley & Betts 2007 JASIST, doi:10.1002/asi.20718 | 2007 | 實證 | 🟡 只讀摘要 | Exa |
| A7 | Tombros & Sanderson 1998 SIGIR, "Advantages of Query Biased Summaries in IR" http://ciir.cs.umass.edu/pubfiles/ir-130.pdf | 1998 | 實證（使用者實驗） | 🟡 全文在手；讀 §1、§4 結果、§5 結論 | Tavily→curl PDF |
| A8 | Mani 2001, "Summarization Evaluation: An Overview"（NTCIR-2）https://research.nii.ac.jp/ntcir/workshop/OnlineProceedings2/sum-mani.pdf | 2001 | 回顧 | 🟡 informativeness、Q&A、reading comprehension、SUMMAC 段 | Tavily→curl PDF |
| A9 | AR 25-50 Preparing and Managing Correspondence（2013-05-17 版 PDF，https://corpslakes.erdc.dren.mil/employees/pdfs/AR25-50.pdf） | 2013 | 規範 | 🟡 §1-36、§1-37、§2 memorandum body 段全讀 | Exa→curl→pdftotext |
| A9b | AR 25-50（2020-10-10 版）FlipHTML5 第 15 頁 https://fliphtml5.com/kbhsd/jrux/AR_25-50_Preparing_and_Managing_Correspondence_2020/15/ | 2020 | 規範 | 🟡 只讀 §1-38、§1-39（該頁全文） | Exa 片段即整頁；armypubs.army.mil 直連回傳 HTML 擋下 |
| A10 | NN/g, Amy Schade, "Inverted Pyramid: Writing for Comprehension" https://www.nngroup.com/articles/inverted-pyramid/ | 2018 | 業界指南（作者主張） | ✅ 全文 | Exa fetch |
| A11 | NN/g, Jakob Nielsen, "How Little Do Users Read?" https://www.nngroup.com/articles/how-little-do-users-read/ | 2008 | 作者對他人日誌資料的再分析 | ✅ 全文 | Exa fetch |
| A12 | NN/g, Kara Pernice, "F-Shaped Pattern of Reading on the Web" https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/ | 2017（2026-08 複審） | 業界眼動研究摘要 | ✅ 全文 | Exa fetch |
| A13 | Zhang et al., "Benchmarking LLMs for News Summarization", TACL 2024, arXiv 2301.13848 | 2024 | 實證 | 🟡 全文在手；摘要、§1、coverage/density 段；未找到獨立 Limitations 節 | curl arXiv HTML |
| A14 | Kim et al., FABLES, arXiv 2404.01261（COLM 2024） | 2024 | 實證 | 🟡 全文在手；摘要、§2 結果、§5 全節（含 Table 6）| curl arXiv HTML |
| A15 | Liu et al., "Lost in the Middle", TACL 2024, arXiv 2307.03172 | 2023/2024 | 實證 | 🟡 摘要、§1、§2.3、Table 1 | curl arXiv HTML |
| A16 | Ravaut et al., "On Context Utilization in Summarization with LLMs", ACL 2024, arXiv 2310.10570v6 | 2024 | 實證 | 🟡 摘要、§1、§3.1（RQ1）、Limitations | curl arXiv HTML |
| A17 | Wan et al., "On Positional Bias of Faithfulness for Long-form Summarization", NAACL 2025 https://aclanthology.org/2025.naacl-long.442.pdf | 2025 | 實證 | 🟡 摘要、§5.2、§7（Exa 擷取段） | Exa |
| A18 | Cao et al., "Characterizing Multimodal Long-form Summarization: Financial Reports", COLM 2024, https://openreview.net/pdf?id=hDoN0CAy5e | 2024 | 實證 | 🟡 摘要、§1、§2 Table 1（前 8000 字） | Exa fetch（curl 被 OpenReview 擋成 HTML） |
| A19 | Belém et al., "From Single to Multi: How LLMs Hallucinate in MDS", arXiv 2410.13961 | 2024 | 實證 | 🔎→🟡 摘要＋Table 1 定義＋結果段（Exa 擷取） | Exa |
| A20 | Lyu & Ke, "Not too long do read: Evaluating LLM-generated extreme scientific summaries"（BiomedTLDR）arXiv 2512.23206v1 | 2025 | 實證 | 🟡 全文在手；摘要、§1、修辭結構分析段、Limitations、附錄 C.3 | curl arXiv HTML |
| A21 | Wang et al., FacetEval, PMC11451640 | 2025 | 實證 | 🔎 只看搜尋片段 | Exa |
| A22 | ASIC 摘要試驗（Ars Technica 報導） https://arstechnica.com/ai/2024/09/australian-government-trial-finds-ai-is-much-worse-than-humans-at-summarizing/ | 2024 | 政府小型試驗（新聞轉述） | 🔎 只看搜尋片段 | Exa |
| A23 | Wang et al. 2020, QAGS, arXiv 2004.04228 | 2020 | 方法＋實證 | 🟡 摘要、§5.3、§7 Limitations | curl arXiv HTML |
| A24 | Scialom et al. 2021, QuestEval, arXiv 2103.12693 | 2021 | 方法＋實證 | 🟡 摘要、§1、§4.2 Recall/Query Weighting | curl arXiv HTML |
| A25 | Louis & Nenkova 2011, "Text Specificity and Impact on Quality of News Summaries" https://aclanthology.org/W11-1605.pdf | 2011 | 實證 | 🟡 摘要、§4、§5.2–5.3（Exa 擷取長段） | Exa |
| A26 | Ryba et al. 2021 Frontiers in Psychology（可讀性寫法實驗） | 2021 | 實證 | 🔎 搜尋片段（含結果數字，不引為主證） | Exa |
| A27 | Inductively vs Deductively Structured Product Descriptions, JBTC 2020, doi:10.1177/1050651920932192 | 2020 | 實證 | 🔎 只讀摘要 | Exa |
| B1 | Liang et al., "GPT detectors are biased against non-native English writers", Patterns 2023, arXiv 2304.02819 | 2023 | 實證 | 🟡 全文在手；摘要、Results 全節、Discussion 限制段 | curl arXiv HTML |
| B2 | Dugan et al., RAID, ACL 2024, arXiv 2405.07940v2 | 2024 | 實證（benchmark） | 🟡 摘要、§5.2、Finding 1、Table 4、Limitations | curl arXiv HTML |
| B3 | Russell, Karpinska & Iyyer, "People who frequently use ChatGPT for writing tasks are accurate and robust detectors", ACL 2025, arXiv 2501.15654 | 2025 | 實證 | 🟡 全文在手；摘要、§1、§2 實驗 1 結果、Table 1–3、Limitations | curl arXiv HTML |
| B4 | Emi & Spero, Pangram Text 技術報告 arXiv 2402.14873 | 2024 | 廠商自評 | 🟡 摘要、§1、§3.5 ESL | curl arXiv HTML |
| B5 | Jabarian & Imas, "Artificial Writing and Automated Detection", NBER w34223 / BFI WP 2025-116 | 2025 | 獨立實證（工作論文） | 🟡 摘要＋引言（Exa 擷取 PDF 前段） | Exa |
| B6 | Yakura et al., arXiv 2409.01754v4（2026-07-16 版） | 2024–2026 | 實證 | 🟡 全文在手；摘要、主要結果、Discussion 限制段、Methods 部分 | curl arXiv HTML |
| B7 | Geng & Trotta, "Is ChatGPT Transforming Academics' Writing Style?", arXiv 2404.08627v2 | 2024 | 實證 | 🟡 摘要、§1、§5.2、§6 | curl arXiv HTML |
| B8 | Kobak et al., "Delving into LLM-assisted writing in biomedical publications through excess vocabulary", Science Advances 2025；讀 arXiv 2406.07016v5（2025-07-03） | 2025 | 實證 | 🟡 摘要、§2.1–2.3、§3 Interpretation and limitations 全段 | curl arXiv HTML |
| B9 | Heritage & Greatbatch 1986, "Generating Applause", AJS 92(1) | 1986 | 實證（全樣本語料） | 🟡 摘要＋Bull 2016（JSPP）轉述數字＋academia.edu 片段（表 9–10 段） | Exa；原文 JSTOR/UChicago 付費 |
| B10 | Bull 2016, "Claps and claptrap", J Social and Political Psychology https://doi.org/10.5964/jspp.v4i1.436 | 2016 | 回顧 | 🟡 Claptraps 節 | Exa |
| B11 | 誤指案例：Sokol, THE 2023；USA Today 2023（UC Davis Quarterman）；Rolling Stone 2023（Stivers）；SMH 2024（UNSW Vyas）；Bloomberg 2024（Olmsted＋Businessweek 測試）；ABC AU 2025（ACU）；ABC7 2025（Adelphi Newby） | 2023–2025 | 新聞／個案 | 🔎 搜尋片段（Sokol、Bloomberg、SMH、Rolling Stone 片段較長） | Exa |
| B12 | em dash 辯護：Didau 2025-05-21 Substack；Combs 2025-05-05 Medium；Jaiswal 2026-01-11 Medium；Duckett LinkedIn 2025-05-16 | 2025–2026 | 評論／自述 | 🔎 搜尋片段 | Exa |
| B13 | Jiang et al. 2024 ETS, Computers & Education 105070；GPTZero 2023 部落格；Chaka 2024 JALT | 2023–2024 | 實證／廠商回應 | 🔎（Jiang 只讀到題名與 Pangram 部落格轉述；Chaka 讀到摘要） | Exa |

---

## 二、子題 A 發現

### A-1 indicative vs informative 的定義原文

**ANSI/NISO Z39.14-1997 (R2009) §6**（指南）
- "Abstracts are generally described as either informative or indicative, reflecting the mode or perspective in which they are written. In the informative mode, the original document is condensed, reflecting its tone and content. An abstract written in the indicative mode describes rather than paraphrases the original document and its contents. … Both types of abstracts should present as much as possible of the essential information contained in the text."
- §6.1："Informative abstracts are generally used for documents pertaining to experimental investigations, inquiries, or surveys. These abstracts state the purpose, methodology, results, and conclusions … a results-oriented arrangement, in which the most important results and conclusions are placed first, may be useful to some audiences."
- §6.2："Indicative abstracts are best used for less-structured documents, such as editorials, essays, opinions or descriptions; or for lengthy documents, such as books, conference proceedings, directories … Indicative abstracts are usually written for documents that do not contain information relating to methodology or results."
- §7.4（對本系列最直接）："In the first sentence of an abstract, avoid naming the type of document (e.g., 'This article evaluates,' 'This essay examines,' or 'This study presents') when this information may be inferred from the title…"
- §7："An abstract must be intelligible to a reader without reference to the document it represents … Be concise, fulfill content requirements, but do not be cryptic or obscure."
- §6.3.3："Describe results as concisely and informatively as possible."
- 附錄 II 範例 B（Leira 1994）是教科書級指示型：「Numerical results are presented for a specific example. … the relevance of the so-called expected extreme hypersurfaces is illustrated」——只說「有結果」，不說結果是什麼。
- §3 定義也把 summary 與 abstract 分開："Summary – A brief restatement within a document (usually at the end) of its salient findings and conclusions intended to complete the orientation of a reader who has studied the preceding text."

**ISO 214:1976 §2**（標準）
- "An abstract should be as informative as is permitted by the type and style of the document; that is, it should present as much as possible of the quantitative and/or qualitative information contained in the document."
- "some discursive or lengthy texts, such as broad overviews, review papers, and entire monographs, may permit the preparation of an abstract that is only an indicative or descriptive guide to the type of document, the principal subjects covered, and the way the facts are treated."
- 註 3（重要）："More-indicative abstracts or even annotations are less expensive to prepare, and may sometimes be all that stringencies in publication economics will permit. However, governing factors such as economics should not be confused with true standards for the quality of abstracts."

→ 兩份標準都把「資訊型」當預設、把「指示型」當受文類或成本所迫的退讓；ISO 明講指示型比較便宜。這對「指示型摘要」一篇是可引的立論基礎。

**Borko & Bernier 1975**：只找到轉述。The Indexer 1997 比較文轉述 LIS 文獻共識：「An indicative abstract may contain information about the purpose, scope, and methodology … but not about the results obtained, conclusions, or recommendations. Because of its general contents, the indicative abstract cannot act as a good substitute for the original document」，引用 ANSI 1979、Cleveland、Cremmins、Lancaster、Rowley，不是 Borko & Bernier 原句。另轉述 Borko & Bernier 把 abstract 定義為不含詮釋或批評。→ 書本原句 ✉️／館藏借閱才能關閉。

### A-1b 有沒有「兩種摘要對讀者效果」的實證

- **直接比較 indicative vs informative 對讀者決策／理解的受控實驗：未找到。** 試過的查詢：Exa「experiment readers compared informative versus indicative abstracts comprehension or relevance judgments」、Tavily「study comparing indicative and informative summaries effect on user relevance judgments accuracy」。命中的是相鄰研究（下列）。結論：⚪（就公開可搜尋文獻而言），但需註明舊 LIS 文獻（1960–80 年代）可能有紙本研究未數位化。
- **Hartley 2004 回顧（結構式 vs 傳統摘要）**：作者條列——結構式摘要「contain more information (studies 1–11), but not always so (study 12); are easier to read (studies 2, 3, 13); are easier to search (studies 3, 14), although some authors have questioned this (studies 15–17)」。作者自己點出的限制："If researchers create structured abstracts from traditional ones, then it is likely that they will increase the amount of information"；用 MEDLINE 真實摘要的研究「have not shown an advantage for search speed (studies 15, 17)」；回憶效果在「equated for length and readability」後消失；結構式摘要平均長 21%（獨立發表的三項比較為 40%、30%、29%）。→ 「資訊量多」與「長度多」混在一起，不能直接當成「資訊型勝過指示型」的證據。
- **Hartley, Sydes & Blurton 1996**（摘要）：52 人電子資料庫找答案、56 人紙本搜尋，兩項都「significantly faster and made fewer errors with structured abstracts」，但有「unexplainable practice effects」與「asymmetrical transfer effects」。
- **Hartley & Benjamin 1998**（cogprints）：30 對同作者傳統／結構式摘要，結構式「significantly more readable, significantly longer, and significantly more informative」；資訊增量主要在 Participants（40%）、Background（37%）、Aims（33%）、Conclusions（33%），Results 只增 7%。
- **反向證據——Tombros & Sanderson 1998**：比較「query-biased 摘要」與「標題＋前幾句的靜態摘要」。query-biased 組召回高 15.84 個百分點、每題多看 13% 文件（22.62 vs 20）、需翻全文比例 1.32% vs 23.7%。作者結論把效果歸因於指示性："This effect of the summaries is attributed mainly to their indicative nature, and especially to the fact that they adequately indicate the context within which potentially ambiguous query terms are used"。→ **在「要不要點開」的篩選任務裡，指示型有其正當用途**；作者也在 §1 寫"The minimal function that any useful summary should provide is being indicative of the source's content"。這是反證，寫文章時要界定通病是「該給結論時只給指示」，不是指示型本身有錯。
- **SUMMAC（Mani 2001 轉述）**：relevance assessment 任務，51 名受試者、16 個系統：摘要在 10%（generic）／17%（topic-related）壓縮率下讓判斷時間減少 40%–50%，「with no statistically significant degradation in accuracy」。Q&A 任務：資訊性用「摘要能否回答 obligatory 問題」衡量，「informativeness ratio of accuracy to compression of about 1.5」。
- 相鄰：Rath, Resnick & Savage 1961 Science（🔎）：用標題與摘要判斷相關性「no significant difference」。

### A-2 BLUF 與 inverted pyramid

**AR 25-50（2013 版 §1-36b，pdftotext 原文）**："Army writing will be concise, organized, and to the point. Two essential requirements include putting the main point at the beginning of the correspondence (bottom line up front) and using the active voice"。§1-36a："Effective Army writing is understood by the reader in a single rapid reading"。§1-37a："focus first on the main point"。Memorandum 本文（§2 body）："(b) Begin the memorandum with a short, clear purpose sentence. (c) Put the recommendation, conclusion, or most important information (the main point) next. (Some writing combines the purpose and the main point.)"
**2020 版 §1-38b**（FlipHTML5 頁面）："Two essential requirements include putting the main point at the beginning of the correspondence (bottom line up front) and using the active voice"；2020 版刪了「will be concise, organized, and to the point」那句，改併入 1-38a "clear, concise, and well-organized in accordance with PL 111–274"。
→ 注意：BLUF 是**規範**，AR 25-50 本身不附實證。§2 的順序是「目的句→主要結論」，即「目的」可以先於結論，這點和「拿鉤子當重點」有關：規範允許一句目的，但第二句必須是結論。

**NN/g inverted pyramid（Schade 2018，非 Nielsen／Moran）**：「Start content with the most important piece of information so readers can get the main point, regardless of how much they read.」文中五項好處（improve comprehension 等）**沒有引用任何研究**，屬作者主張。

**NN/g「How Little Do Users Read?」（Nielsen 2008）**：資料來自 Weinreich et al. 2008 ACM TWeb，25 名使用者、清理後 45,237 個頁面瀏覽的**瀏覽器日誌**，不是眼動。公式：固定約 25 秒＋每 100 字多 4.4 秒；以 250 wpm 推算「users will read 18% of it」（新增文字）、「on average, users will have time to read 28% of the words if they devote all of their time to reading. More realistically, users will read about 20%」。作者自列限制："users had above-average intelligence, with several being university employees"；"This wasn't an eyetracking study, so we don't know precisely how users allocated their time"。→ 20–28% 是**上限推算**，不是測到的閱讀量。
**F-pattern（Pernice 2017）**：眼動熱圖例子是 45 人、47 人；F 型只在三條件同時成立時出現（無格式長文、使用者求效率、不夠投入）；作者強調「Scanning on the web does not always take the shape of an F」，並列 layer-cake、spotted、commitment 等模式。建議第一條："Include the most important points in the first two paragraphs on the page."
**相鄰實證（🔎）**：Inductive vs deductive 產品描述實驗（JBTC 2020）——西方讀者對兩種結構的可讀性與說服力評分「equally high」，中國讀者偏好歸納式；回憶與閱讀時間未受影響。→ BLUF 的優勢可能有文化與任務條件，不宜寫成普世定律。

### A-3 LLM 摘要的實證缺陷（2024 後）

1. **Zhang et al. TACL 2024（新聞）**：Instruct Davinci 摘要 coverage 0.92、density 12.1；自由撰稿人 0.81、2.07（§「coverage and density」段："These measures show that the summaries generated by Instruct Davinci are highly extractive whereas the summaries written by the freelance writers are much more abstractive"）。整體品質「judged to be on par with human written summaries」，但個別評審有穩定偏好。→ **這是反證**：至少在新聞短文，LLM 摘要的問題是「抄得多」而非「空泛指示」。
2. **FABLES（Kim et al. 2024，書籍）**：3,158 條 claim、26 本書。忠實率 Claude-3-Opus 90%、GPT-4/GPT-4-Turbo 78%、GPT-3.5-Turbo 72%、Mixtral 70%（Table 2）。Table 6（標註者評語，非逐條 claim）**Vague/Generic**：Claude-3-Opus 0.0%、GPT-4-Turbo 23.1%、GPT-4 3.9%、GPT-3.5-Turbo 38.5%、Mixtral 38.5%；**Omissions** 52.0／80.8／65.4／84.6／65.4%。原文："The least faithful models, GPT-3.5-Turbo and Mixtral, also both have a tendency to generate overly generic statements (38.5%)." 結尾偏重："at least 20% of the generated summaries exhibit an overemphasis on the book's ending" (Claude-3-Opus) vs 7.7% (GPT-4-Turbo)。標註者評語："The most difficult part for me was how general some of the sentences were … 'The book grapples with the scars of colonialism.'" → 空泛與模型強弱相關，強模型幾乎為零。
3. **Lost in the Middle（Liu et al.）**：多文件 QA，相關段落放中間時 GPT-3.5-Turbo 表現低於 closed-book 56.1%（Table 1；oracle 88.3%）。屬 QA 非摘要。
4. **Ravaut et al. ACL 2024**：6 LLM × 10 資料集。「LLMs show a significantly stronger lead bias on all datasets: bigrams from LLMs summaries are much more likely to be found in the first 20% words of the source」；KS 檢定 p<0.001，在 55 組中 51 組顯著（§3.1、附錄 D）。作者限制：只測開源模型、未含 Claude；顯著性以 ROUGE-1 近似。
5. **Wan et al. NAACL 2025**：長文摘要忠實度呈 U 形，「LLMs faithfully summarize the beginning and end of documents but neglect middle content」；prompt 指定位置可部分緩解，增量摘要則換成近因偏差。
6. **Cao et al. COLM 2024（財報）**：「small models like GPT-3.5 tend to include generic texts without mentioning any specific numbers」；Table 1 摘要平均數字個數：Claude 2.0 11.09、GPT-4 5.81、GPT-3.5 0.46；萃取句 30–40%，來源偏報告開頭（GPT-4 洗牌後仍偏開頭，Claude 洗牌後消失）。
7. **Belém et al. 2024（多文件）**：人工評 700+ insights，主要錯誤是 instruction inconsistency 與 **pedantic**——定義："Insights that, while correct, add no new information. These include paraphrasing the subtopic, contextual statements (e.g., opening remarks, takeaway), as well as insights that are overly generic"。→ 這是目前最接近「指示型／空話」的 LLM 實證分類。
8. **BiomedTLDR（Lyu & Ke 2025，arXiv 2512.23206）——反證**："across all summary types, words are predominantly drawn from the Results sections of the original abstracts, with Objective contributing the least, indicating a shared preference for reporting findings over restating research goals"；開頭新詞多為 meta-discourse（"study," "demonstrates," "shows"），**人類 TLDR 同樣如此**（例："Human: This study provides in vivo evidence that postmitotic cells can develop…"）。整體結論：LLM「more extractive rather than abstractive」。作者限制：資料來源是 annotated bibliographies，不是完美 TLDR 代理。
9. **ASIC 試驗（🔎，新聞轉述）**：AI 摘要 7/15 分 vs 人類 12.2/15；官員："the summaries were quite generic"。樣本 5 份文件，不可當主證。

**直接研究「LLM 摘要描述文章談什麼而不給結論」：未找到專題研究**。試過關鍵字：indicative summary LLM（Tavily advanced）、"LLM-generated summaries vague generic describe topic rather than findings, summary specificity evaluation 2024"（Exa）、"LLM summaries of scientific papers omit quantitative results numbers specificity"（Exa）、meta-description、vague summary LLM。最接近的實證是 FABLES 的 Vague/Generic、Belém 的 pedantic、Cao 的「generic texts without numbers」，三者都顯示**弱模型**才明顯；BiomedTLDR 與 Zhang 則指向相反方向（偏抽取、偏結果）。→ 子問題結為 ⚪（無直接研究），附相鄰證據。

### A-4 怎麼量「資訊量」

- **QAGS（Wang et al. 2020）**：從摘要出題、分別用摘要與原文回答，答案一致＝忠實。CNN/DM 上相關係數「nearly twice the correlation of the next best automatic metric (BLEU-1)」。作者限制（§7）："QAGS does not measure other desirable properties of generated text, including fluency, readability, or factual recall"；"extractive summarization models may obtain nearly perfect QAGS scores"。→ **QAGS 量 precision（有沒有亂講），不量資訊量**；空泛但正確的摘要會拿高分。
- **QuestEval（Scialom et al. 2021）**：加上 recall——從**原文**出題，看摘要能否回答，並以 query weighter 加權重要問題。§4.2："While a summary should contain only factual information (precision), it should also contain the most important information from its source text (recall)"；answerability 只看能否回答、不管答得對不對。→ 「能否只看摘要回答問題」的標準做法就是 QuestEval recall 端與 SUMMAC Q&A。
- **SUMMAC Q&A 與 reading comprehension（Mani 2001）**："if reading a summary allows a human to answer questions as accurately as he would reading the source, the summary is highly informative"。
- **Specificity（Louis & Nenkova 2011）——反證**：人寫 abstract 平均 specificity 62%、原文 65%、人工 extract 72%、系統摘要 74%；「too much specificity could adversely affect the quality of content in the summary」；DUC 2005 general 摘要的 specificity 與內容分數相關 −0.03（p=0.53），specific 摘要 0.18（p=0.004）。結論："general sentences are useful content for summaries"。→ 「越具體越好」不成立，好摘要是一般句＋具體支撐的混合。
- **Pyramid**（Nenkova et al.）被 Louis & Nenkova 用作內容分數；本次未另讀原文（🔎）。

---

## 三、子題 B 發現（反證）

### B-1 偵測器誤判

- **Liang et al. 2023**：7 個偵測器、91 篇 TOEFL（中國論壇）vs 88 篇美國八年級作文。TOEFL 平均偽陽性 61.22%（Patterns 版寫 61.3%）；18/91（19.78%）被全部 7 個判 AI；89/91（97.80%）至少被一個判 AI。用 ChatGPT 豐富詞彙後偽陽性降到 11.77%；反過來把八年級作文改成「as if written by a non-native speaker」，偽陽性 5.19%→56.65%。作者限制原文："the sample sizes employed in this research are relatively small"；"most of the detectors assessed in this study utilize GPT-2 as their underlying backbone"。
- **反駁／後續**：Pangram 技術報告（廠商自評）TOEFL 偽陽性 0%（自承「Due to the composition of our training set」，TOEFL 被排除在訓練外）、ICNALE 5,600 篇 0.09%；GPTZero 2023 部落格稱重跑後 1/91（🔎，廠商）；Jiang et al. 2024 ETS（🔎，經 Pangram 部落格轉述：約 2,000 篇 GRE 樣本、自訓偵測器未見偏差）；Chaka 2024（30 個偵測器、40 篇作文，未見 L1/L2 偏差，但「the bulk of … free-to use AI detectors, are not fit for purpose」）。→ 偏差主要屬於 perplexity 型、舊版偵測器；不宜寫成「所有偵測器都歧視非母語者」。
- **RAID（Dugan et al. 2024）**：600 萬+ 生成文本。預設閾值下開源偵測器偽陽性「dangerously high」——Table 4：GLTR 在 0.5 閾值 99.3%、LLMDet 96.0%、FastDetectGPT 23.2%；商用（GPTZero 0.00%、Originality 0.25%、Winston 0.55%、ZeroGPT 1.42%）「none having an FPR above 1.7%」。作者限制：缺多語。
- **Russell et al. ACL 2025**：常用 LLM 寫作的 5 位「專家」多數決 300 篇只錯 1 篇（TPR 99.3%、FPR 0）；**非專家 TPR 56.7%、FPR 51.7%（Table 1；正文寫 52.5%，兩處不一致）≈ 亂猜**。原文："nonexperts attribute any text written in a neutral tone to AI, resulting in many false positives"；"nonexperts take the inclusion of any 'fancy' or otherwise low-frequency word types as signs of AI-generated text"。專家線索頻率（Table 3）：Vocabulary 53.1%、Sentence Structure 35.9%（含 "it's not just this, it's this" 與三項列舉）、Grammar & Punctuation 24.8%、Originality 23.7%、Quotes 22.3%、Clarity 19.5%。**對 em dash 的關鍵反證**：Grammar & Punctuation 類定義是 "AI-generated text is usually grammatically perfect (also avoiding dashes and ellipses)"，專家把「dashes, brackets … intermixed」當作**人類**特徵（2024–25 年 GPT-4o/Claude 3.5/o1 樣本）。作者限制："limited to articles in American English"；未查核事實。
- **Jabarian & Imas 2025（NBER w34223，獨立）**：1,992 篇、6 類文體、4 個前沿模型；Pangram「near-zero FNR and FPR」、唯一能在 FPR ≤ 0.005 的嚴格門檻下維持準確；GPTZero、OriginalityAI 次之，對 <50 字短文與 humanizer 脆弱。→ 對本系列的含意：**統計分類器可以很準，但它們不是靠人眼看的那幾個「特徵」判斷**；人用表面特徵（em dash、三項列舉）判斷時，非專家等於亂猜。
- **Bloomberg Businessweek 2024（🔎）**：GPTZero、Copyleaks 對 2022 年夏天（ChatGPT 前）Texas A&M 500 篇申請文書偽陽性 1–2%。

### B-2 人類語言被 LLM 影響而趨同

- **Yakura et al. arXiv 2409.01754v4**（2026-07 版，結果比 2024 v1 擴充）：737,083 小時、824,634 集 podcast，篩成即興口語後做 synthetic control。delve 在 Science & Technology 類「rose … to 44% above its synthetic-control counterfactual over months 13–18 post-release」；GPT-score 前 1% 的 36 個詞中 28 個上升（13 個可信）、8 個下降（2 個可信），前 1% 峰值中位數比對照高 50%。**2024 年中後 delve 回落，部分類別低於基線**，作者連結到 GPT-4o 免費開放與「growing public awareness of delve as a signature of LLM language」。預註冊實驗 N=496：短暫對話後受試者採用聊天機器人的詞。作者限制原文："The corpus is English-only and is limited to a self-selected, public-facing population of podcast hosts"；"we cannot rule out residual interference in our synthetic control"；實驗樣本是 Prolific 母語者、單次測試。作者另提：「Words such as delve may come to be stereotypically associated with lower skill or with uncritical AI use」。
- **Geng & Trotta arXiv 2404.08627v2**：100 萬篇 arXiv 摘要（2018-05 至 2024-01），以 GPT-3.5「revise the following sentences」為基準，cs 類 LLM 風格密度約 35%；math 很小；astro、cond-mat 10–20%。"is" "are" 在 2023 年下降超過 10%。作者自述："that the abstract of a paper shows what we call the 'ChatGPT style' … does not necessarily mean that the authors directly utilized LLM … their writing habits were influenced by the LLM style – not a remote possibility"；指標是相對值，更精確的 prompt 可能讓 impact > 1。
- **Kobak et al. Sci Adv 2025（arXiv v5）**：1,500 萬+ PubMed 摘要（2010–2024）；2024 年超額詞 454 個（2021 年 Covid 高峰 190 個；以詞元計 343 vs 180）；379 個超額風格詞中 66% 動詞、14% 形容詞；下界「at least 13.5% of 2024 abstracts were processed with LLMs」，子語料最高 >40%，計算領域 20%。作者限制（Interpretation and limitations 節）："our approach cannot distinguish word frequency increase due to direct LLM usage from word frequency increase due to people adopting LLM-preferred words and borrowing them for their own writing … we hypothesize that this effect is much smaller and much slower"；並指出母語者可能更會刪掉風格詞，使下界在不同國家間不可比。
- **含意**：人類開始用 LLM 偏好詞（Yakura），而 LLM 詞彙本身也在換（delve 退燒）；以固定詞表判斷「AI 寫的」會同時誤傷被影響的人類並漏掉新模型。

### B-3 過度矯正／獵巫

**誤指個案（🔎 新聞，具名可追）**
- Sokol, THE 2023-07-10：學生 "Emily" 被 Turnitin 判 64% AI、給 0 分；法醫語言學家 Andrea Nini 報告指相似性「178 times more likely if Emily had written the essay herself」，指控撤銷。
- USA Today 2023-04-12：UC Davis William Quarterman，GPTZero 判定，後獲澄清。
- Rolling Stone 2023-06-06：UC Davis Louise Stivers，Turnitin，靠 Google Docs 版本紀錄自清，但需向法學院自報。
- SMH 2024-05-13：UNSW Rushi Vyas（非母語、ADHD／自閉），Turnitin，兩週後澄清；Deakin 的 Phill Dawson："my concern is that false positive cases do get proven"。
- Bloomberg 2024-10-18：Central Methodist University 的 Moira Olmsted。
- ABC AU 2025-10-09：Australian Catholic University 多名學生被誤指（「84 per cent」）。
- ABC7 2025-10-10：Adelphi University Orion Newby（語言處理障礙）提告。
- Jaiswal, Medium 2026-01-11：HackerNoon 用 Pangram 退稿，作者稱同一稿件先後被判 AI 與人類（自述，未查證）。

**em dash 辯護（具名作者＋年份，🔎）**
- Nate Combs, Medium "The Em Dash and the AI Algorithm", 2025-05-05："I've always used em dashes — liberally, zealously."
- Dianne Duckett, LinkedIn, 2025-05-16："I use em dashes in my copy—a lot."；預言之後「the *absence* of em dashes will be the giveaway」。
- Joe Emery, LinkedIn, 2025-08-26：2015 年作品就有 em dash。
- 反方 David Didau, Substack "Dash it all! Why the em dash can't be trusted", 2025-05-21：認為鍵盤打 em dash 不易，「we know you're bullshitting」，建議「if in doubt, take it out」——**可作為過度矯正的範本**（勸人為避嫌刪標點）。
- 最強的實證反證不是這些文章，而是 Russell et al. 2025：專家把 dash 當人類訊號。

**「AI 風格」在人類修辭傳統的來源**
- **Heritage & Greatbatch 1986（AJS）**：1981 年英國三黨大會全部 476 篇電視轉播演講；七種修辭格式關聯「nearly 70%」（Bull 2016 轉述為 68%）的集體掌聲；**contrast 33.2%、list（三項列舉）12.6%**，合計近半。修辭格式成功率約 21.8%，在一面倒辯論中升到 34.5%；「the rhetorical formats are normally three times more effective than miscellaneous statements in eliciting applause」（academia.edu 片段）。原文付費，數字經 Bull 2016 二手轉述 → 🟡。
- **Atkinson 1984《Our Masters' Voices》**（經 Bull 2016 轉述）：contrast「by far the most frequently used device for inviting applause」；三項列舉源自日常對話的列舉習慣（Jefferson 1990）。Bull 2016 例：Blair 1996 "education, education and education"；Blair 1997 "health care based on need not wealth"（negative parallelism 句型）。
- 廣告文案中「not X but Y」「rule of three」的學術來源：本次**未找到具量化的研究**（試過：Exa 對 Heritage & Greatbatch 的搜尋順帶；未另搜廣告語料）。→ 缺口，見下。

---

## 四、反證整理（寫文章時的護欄）

1. **指示型不是錯，是用錯場合。** 標準（NISO §6.2、ISO §2）明列指示型適用於社論、書、長篇回顧；Tombros & Sanderson 1998 的篩選任務中，指示性正是摘要有用的原因。通病應界定為「讀者要的是結論、文本有結論，卻只給指示」。
2. **LLM 摘要的主流實證問題不是空泛，而是抽取、偏開頭／結尾、遺漏。** Zhang（coverage 0.92）、Ravaut（前 20% 偏誤）、Wan（U 形）、BiomedTLDR（偏抽取、取材以 Results 為主）。空泛（FABLES Vague/Generic、Cao 無數字、Belém pedantic）集中在弱模型；強模型在 FABLES 是 0%。若主張「LLM 偏好指示型摘要」，目前沒有直接研究支持。
3. **人類也寫「This study…」開頭。** BiomedTLDR 的人類 TLDR 與 LLM 同樣以 meta-discourse 開場；差別在後半句有沒有結果。NISO §7.4 早在 1997 年就叫人別這樣寫，代表這是人類舊習。
4. **具體不等於好。** Louis & Nenkova 2011：系統摘要過度具體反而內容分數低；一般句是必要的。過度矯正（每句塞數字）也是病。
5. **BLUF／inverted pyramid 的證據比名聲薄。** AR 25-50 是規範沒附研究；NN/g inverted pyramid 文是主張；20–28% 是日誌推算的上限；F 型只在特定條件出現；歸納 vs 演繹的實驗顯示讀者回憶不受影響且有文化差異。
6. **表面特徵偵測不可靠，且會誤傷。** 非專家 FPR ≈ 52%（Russell）；perplexity 型偵測器對非母語者 61% 偽陽性（Liang，舊偵測器）；em dash 在 2024–25 年專家眼中反而是人類訊號；多起具名誤指案例。
7. **人類正在吸收 LLM 用詞（Yakura、Kobak 自承的混淆），而 LLM 的招牌詞會隨模型與公眾意識退燒（delve 2024 年中後回落）。** 詞表式判斷同時誤傷與漏判。
8. **對比與三項列舉是有實證的人類修辭利器**（Heritage & Greatbatch：近半集體掌聲）。通病文章應攻擊「無內容的對比／列舉」，不是句式本身。

---

## 五、缺口結案

| 缺口 | 結案狀態 | 細節 |
|---|---|---|
| Borko & Bernier 原書原句 | ✉️／館藏 | Exa 只找到轉述（The Indexer 1997、CRL 1976 書評、ERIC ED125555 書目）；archive.org `abstractingconce0000bork` 為 access-restricted 借閱本，`fulltext/inside.php` 回傳非 JSON（需登入）。要原句需借閱或圖書館。 |
| ISO 214 全文（§3 之後） | ✉️（付費） | 只有 iTeh／ANSI 預覽頁；ISO 售價 CHF 44。定義段已在預覽頁內，足以引用。 |
| indicative vs informative 讀者受控實驗 | ⚪ | Exa、Tavily 各一輪（見 A-1b）；僅找到結構式摘要（Hartley）、query-biased vs lead（Tombros）、titles vs abstracts（Rath 1961）等相鄰研究。 |
| 「LLM 摘要描述主題而不給結論」直接研究 | ⚪ | 關鍵字：indicative summary LLM、vague summary LLM、summary specificity、meta-description、LLM summaries omit quantitative results（Exa、Tavily）。只有相鄰證據（FABLES、Belém、Cao、BiomedTLDR）。 |
| Heritage & Greatbatch 原文表格 | 🟡→✉️／付費 | AJS 付費；數字來自 Bull 2016（開放取用）轉述與 academia.edu 片段。 |
| 廣告文案中 rule of three／not-X-but-Y 的量化研究 | 未關閉（未充分搜尋） | 本輪只搜到政治演講研究；建議下一輪查 "tricolon advertising slogans corpus"、"antithesis advertising headlines study"。 |
| Jiang et al. 2024 ETS 原文數字 | 🔎 | ScienceDirect 頁經 Exa fetch 只回作者與參考文獻；數字僅有 Pangram 部落格（廠商）轉述，不可引。可試 ETS Research Report 或 arXiv 版。 |
| Kobak Science Advances 正式版頁碼 | 🟡 | 讀的是 arXiv v5（2025-07-03），數字與摘要一致；正式版未比對頁碼。 |
| 2024 後反證搜尋 | 已做 | 偵測器偏差（replication）、BLUF 實證、LLM 摘要具體度均各加一輪；Yakura v4 本身含 2024–2026 回落資料。 |

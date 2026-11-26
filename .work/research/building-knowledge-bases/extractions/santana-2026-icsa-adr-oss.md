# 抽取紀錄：Santana et al. 2026, Architecture Decision Records: Adoption, Impact, and Developer Engagement in Open-Source Software（ICSA 2026）

read_status=abstract（全文讀不到；取得兩個版本的摘要：會議議程頁版與 Semantic Scholar／IEEE 版。不引用摘要以外的內容）

角色：order 8 的反證之一（ADR 跟專案品質只有小相關、多數 ADR 一開就是 accepted）。

## 書目

- 作者：Enio Garcia de Santana (Jr.)、Gustavo Bittencourt Figueiredo、Maycon Leone Maciel Peixoto、Frederico Araújo Durão、Cássio Vinicius Serafim Prazeres、Ivan do Carmo Machado（UFBA）、Paulo Anselmo da Mota Silveira Neto（UFRPE）、Eduardo Santana de Almeida（UFBA）
- 刊物：23rd IEEE International Conference on Software Architecture (ICSA 2026), Amsterdam, 2026-06-22–26, pp. 335–345；DOI 10.1109/ICSA66085.2026.00040；IEEE Xplore arnumber 11613073。2026-06-26 發表。
- 讀到的頁面：
  - 會議頁 https://conf.researchr.org/details/icsa-2026/icsa-2026-papers/34/...（摘要 A）
  - Semantic Scholar API（paperId dac906a048bc225ff5f19ee600b3966b502e3f26）回傳的 abstract（摘要 B，較新，含方法工具與 "at most, modest" 一句）
- 無全文檔。

## 性質

- 實證（MSR，量化相關分析）。資料集是 Buchgeher 2023 的 921 repo（見 buchgeher-2023-adr-github-msr.md）。

## 摘要層級可引用內容

1. 資料與方法（摘要 B）
   - 「Using a dataset of 921 GitHub repositories and 5800 ADRs from earlier ADR studies」
   - 兩個面向：repository-centric（ADR 長度、更新頻率、lifecycle status 對專案品質與活動指標）、developer-centric（誰寫 ADR、core vs peripheral developers、ADR 參與跟生產力與維護活動的關係）。
   - 「Data extraction and analysis combine PyDriller for repository metadata and SonarQube for quality metrics.」
2. 效果小（摘要 B）
   - 「ADR-related variables exhibit predominantly small correlations with code quality and productivity metrics, suggesting that ADR adoption is associated with, at most, modest observable effects at scale.」
   - 摘要 A 的版本："their predominantly small correlations with project quality metrics such as code smells and issue resolution time"。
3. 跳過討論（兩版皆有）
   - 摘要 A：「of a total of 5,800 ADRs, approximately 3,674 (about 63%) were opened directly with a status of "accepted" or equivalent, thereby bypassing the deliberative context that ADRs are intended to capture.」
   - 摘要 B：「about 63% of ADRs are opened directly with a status of "accepted" or equivalent」

## 沒寫的事（就摘要而言）

- 相關係數的實際數值、樣本切法、哪些指標、是否控制專案規模——摘要都沒有。
- 「opened directly as accepted」是怎麼判定的（第一個 commit 的 status 欄位？）——不知道。
- core 與 peripheral 開發者差在哪——摘要只說有比較，沒給結果。

## 與常見轉述不一致處

- 先前 sources.jsonl 記這篇是「921 repo 大規模研究」——資料集不是作者新蒐集的，是 Buchgeher 2023 的資料集（摘要 A："from earlier ADR studies"）。
- 5,800 份 ADR 這個數字跟 Buchgeher 的 6,362 檔、"over 5000" 都不同；可能是清理或可取得性差異（Su et al. 2026 也提到 921 中只 clone 得到 882 個），但摘要沒說明。
- 「63% 直接 accepted」作者解讀為「跳過審議」；也可能是團隊在別處（會議、PR、Slack）討論完才寫 ADR——Keeling & Runde、Osl 都報告過這種做法（Buchgeher 2023 行 140、142 轉述）。所以這個數字能說「ADR 檔案裡看不到討論過程」，不能直接說「沒有討論」。這是我的推論，作者摘要沒提。
- 「ADR 沒用」：摘要說相關「小」，不是零；而且是相關不是因果。

## 限制

- 只有摘要；所有數字未經全文核對。寫進文章時只能用摘要句，標「摘要」。
- 資料集截至 2020 年，跟 Buchgeher 同樣只看公開 GitHub。

## 讀取紀錄（每個管道與失敗原因）

- computer.org CSDL 頁（先前 session）：無內文。
- Semantic Scholar 網頁（先前 session）：429。本次改打 Semantic Scholar Graph API：200，取得 abstract；openAccessPdf status "CLOSED"。
- OpenAlex `works/doi:10.1109/ICSA66085.2026.00040`：is_oa False、oa_status closed、any_repository_has_fulltext False。
- Crossref：只給 xplorestaging.ieee.org 的 similarity-checking PDF 連結；curl 回 HTTP 418。
- IEEE Xplore `stamp.jsp?arnumber=11613073`：curl 回 HTTP 418。
- arXiv API（abs:"decision records" 依日期排序 60 筆；全文搜尋 "architecture decision records"）：無此篇。
- Exa search（兩次，含 "pdf preprint"、"researchgate OR replication package"）：只找到 DOI、會議頁、dblp、researchr、LinkedIn 宣傳文，無全文。
- Tavily search（advanced，含葡文關鍵字 dissertação UFBA）：只找到會議頁、Google Scholar 作者頁（列有此篇但無 PDF 連結）、ResearchGate（指向別篇）。
- ResearchGate 搜尋頁 curl：HTTP 403（未再用 Playwright，因為搜尋結果裡沒有這篇的 RG 頁面可開）。
- 結論：IEEE 付費牆、無預印本、無作者自存版。替代：資料面用 Buchgeher 2023 全文；「ADR 內容缺選項／缺理由」面用 Miccio 2026 全文（同資料集）。

# 抽取紀錄抽查：第九批（17 份）

- 抽查日期：2026-10-22
- 抽查者：獨立抽查員（沒參與寫作與精讀）
- 範圍：order 12 的 9 份（google-vertex-rag-engine-ingestion、owasp-2025-llm08-vector-embedding、huwiler-2025-versionrag、xie-2024-knowledge-conflicts、ouyang-2025-hoh-outdated-info、ross-2026-redundancy-diversity、deasy-2025-latest-version-detection、microsoft-copilot-content-lifecycle、dzone-2026-source-inventory），以及 order 13 的 8 份（santos-2026-pdf-to-rag-ready、zhang-2025-ohrbench、sun-2026-induocrbench、ouyang-2025-omnidocbench、docling-docs-and-reports、azure-rag-chunking-phase、faysse-2025-colpali、most-2025-lost-in-ocr）。
- 除了任務書指定的 faysse-2025-colpali 附錄補讀（任務 C，另見第 16 節附註）以外，沒有改動任何抽取紀錄或文章。

## 抽樣方法

- 沿用第八批的方法。腳本：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/spot9/sample.py`（由 spot8/sample.py 複製，只把 `SECS` 換成這 17 份，每份都用預設的「可引用」「主張」「原句」節）。
- 候選行、排除條件、每份檔案前 `random.seed(17)` 後 `random.sample(候選, 3)`，都和第八批相同。各份候選數：vertex 7、owasp 10、huwiler 11、xie 11、hoh 9、ross 5、deasy 12、microsoft 9、dzone 6、santos 12、ohrbench 11、induocr 12、omnidocbench 8、docling 14、azure 10、colpali 5、most 7。
- colpali 抽樣用的是任務 C 改檔前的版本（read_status=partial、32 行）；抽中的三行在改後版本行號不變。
- 核對方式：`grep -n`／`sed -n` 回 `scratchpad/fulltext/o12-*`、`o13-*` 找原處，數字逐個對到原句或原表。HoH 全文檔被 `file` 判成 data（含控制字元），要用 `grep -a` 才搜得到。
- **dzone 沒有存全文檔**（紀錄寫 curl 403、改用 Exa 取全文、未另存檔）。任務書寫「不需上網」，這次沒有重抓，所以 dzone 的 3 項無法回查。
- 下列差異只是文字層的不同，不算不一致：彎直引號、Markdown 強調、PDF 斷行與斷字、雙欄混排。

## 讀取紀錄總核對（`wc -l` / `wc -c`）

| 全文檔 | 紀錄行數 | 實際 `wc -l` | 紀錄 bytes | 實際 `wc -c` | 已讀區段 | 缺口 |
|---|---|---|---|---|---|---|
| o12-vertex-ingestion.md | 470 | 470 | 17,524 | 17,524 | L1–470 | 無 |
| o12-owasp-llm08.md | 514 | 514 | 35,090 | 35,090 | L1–514（正文 37–220） | 無 |
| o12-versionrag.txt | 1,362 | 1,362 | 104,841 | 104,841 | L1–1362 | 無 |
| o12-xie2024.txt | 1,567 | 1,567 | 109,425 | 109,425 | 正文 1–739、附錄 930–1567；740–929 參考文獻掃讀 | 無實質缺口 |
| o12-hoh.txt | 1,609 | 1,609 | 139,864 | 139,864 | 1–598 全讀；599–789 參考文獻掃讀；790–1609 附錄以 grep 掃讀 | 附錄 820 行只掃讀，紀錄自述；仍標 full |
| o12-ross2026.txt | 602 | 602 | 69,204 | 69,204 | L1–602 | 無 |
| o12-deasy.txt | 177 | 177 | 10,830 | 10,830 | L1–177 | 圖表為圖片，只讀圖說（紀錄自述） |
| o12-ms-ess.md／o12-ms-caf-data.md | 436／289 | 相符 | 24,419／20,010 | 相符 | 全部 | 無 |
| dzone | 無全文檔 | — | — | — | 紀錄寫 Exa 全文讀到參考文獻 | 無法用 wc 核對 |

- order 12 有全文檔的 9 個檔，紀錄寫的行數與 bytes 全部和 `wc` 一致。order 13 的 11 個檔見下方 order 13 的總核對表，也全部一致。
- 「不一致處」節：huwiler（3 條）、xie（有）、santos、ohrbench、induocr、omnidocbench、docling、azure 都有；hoh、ross、deasy、microsoft、dzone、vertex、owasp、colpali、most 沒有獨立的「不一致」節（vertex、owasp 有「與範圍卡說法的核對」，ross 有「反證／限制」，most 有「沒寫的事／內部不一致」，功能相近）。

---

## 1. google-vertex-rag-engine-ingestion.md

全文檔：`fulltext/o12-vertex-ingestion.md`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L21 | 去重規則（行 65–73）："If the same file is imported multiple times with no changes, the file is skipped since it already exists."；三條件；`response.skipped_rag_files_count` | 第 65 行小標 "Data deduplication"；第 67 行原句與計數欄位；第 71–73 行三條件 | 逐字相符，行號也對。 |
| 2 | L22 | 版本判斷（行 103–105）："The system automatically checks your file's path, filename, and `version_id`. …" "If a file with the same filename and path has a content update, the file is reindexed." | 第 103 行、第 105 行（Cloud Storage／Drive 匯入步驟 2 底下） | 逐字相符。 |
| 3 | L23 | 查失敗（行 75–93）：`import_result_sink` 選填，設成 Cloud Storage 或 BigQuery，"the successful and failed file results are written to the sink"，每行含 operation ID、時間、檔名、狀態、file ID | 第 75 行小標；第 85、87、89、91 行 | 相符。「每行含 operation ID…」原文只寫在 Cloud Storage 那一條（第 91 行），BigQuery 是表格；不影響引用。 |

- 附帶核對：靜默失敗原句 "Otherwise, no files are imported and no error message displays."（紀錄 L19 寫行 51）在第 51 行，逐字相符。

判定：**通過**。

## 2. owasp-2025-llm08-vector-embedding.md

全文檔：`fulltext/o12-owasp-llm08.md`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L24 | 風險 4 資料毒化（行 93–99）："Data poisoning can occur intentionally by malicious actors (Ref #5, #6, #7) or unintentionally. …" | 第 93 行小標、第 99 行原句 | 逐字相符。 |
| 2 | L26 | 防範 3（行 141–147）："When combining data from different sources, thoroughly review the combined dataset. Tag and classify data …" | 第 141 行小標 "3. Data review for combination & classification"；第 147 行原句 | 逐字相符。 |
| 3 | L28 | 情境 1 履歷白字指令（行 169–175），屬 order 14 | 第 165 行小標 "Scenario #1: Data Poisoning"；第 171 行情境全文 | 相符，區段起點早 4 行內，不影響。 |

- 附帶核對：order 12 正文用的「知識衝突」在第 73 行小標 "Cross-Context Information Leaks and Federation Knowledge Conflict"、第 79 行 "Data federation knowledge conflict errors can occur when data from multiple sources contradict each other"。相符。

判定：**通過**。

## 3. huwiler-2025-versionrag.md

全文檔：`fulltext/o12-versionrag.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L27 | 失敗例子（D.1.1，行 1054–1060）：v23.11.0 "1_2 - Release candidate" 與 v22.14.0 "1_0 - Early development"；"This conflicting information prevents correct answer generation." | 第 1055–1061 行 | 逐字相符。 |
| 2 | L29 | 查詢分類正確率：DeepSeek-R1 70B 92%、GPT-4o Mini 91%、Llama 3 8B 76%（行 1204–1210） | 第 1204–1210 行（E.5） | 相符。 |
| 3 | L34 | 討論（行 447–458）："The 32-point accuracy gap … cannot be bridged by simply retrieving more context or using larger models—it stems from the inability to distinguish between version-valid and version-invalid information." | 第 445–455 行（右欄） | 逐字相符。 |

- 附帶核對：Table 7 的 55.0%／35.0%（指定版本內容題、版本清單題，DeepSeek-R1 70B 的 Naive RAG）在第 377、395 行正文也出現（"Naive RAG drops to 55%"、"compared to 35% for Naive"）。正確。

判定：**通過**。

## 4. xie-2024-knowledge-conflicts.md

全文檔：`fulltext/o12-xie2024.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L25 | 無關證據（Table 7，行 569–611）：只給無關段落時 Llama2-7B 92.4%–94.3% 給無關答案；ChatGPT 多半回答不確定 72.0%–83.5% | Table 7 第 569–583 行（Irr-Ans. 92.4／93.4／94.3；Uncertain 72.0／81.8／83.5）；討論到第 611 行 | 相符。 |
| 2 | L27 | 證據被切碎（A.2，行 1032–1044）：StrategyQA，ChatGPT 在 38.2% 例子改選另一邊完整證據 | 第 1032–1042 行 | 相符。 |
| 3 | L32 | "LLMs follow the herd and choose the side with more evidence." "The higher the proportion of evidence supporting a particular answer, the more likely LLMs will return that answer."（行 553、588–590） | 第 553 行；第 589–590 行 | 逐字相符。 |

判定：**通過**。

## 5. ouyang-2025-hoh-outdated-info.md

全文檔：`fulltext/o12-hoh.txt`（要用 `grep -a`）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L28 | 時效意識（Table 6、Figure 4，行 537–589）：Llama-70B 只有 AO 時有害輸出比只有 AC 多 11%；"merely identifying information as outdated does not guarantee the model will avoid using it harmfully." | 第 582–585 行（左欄） | 逐字相符，區段涵蓋。 |
| 2 | L32 | 引言（行 76–85 區段）："the pervasive presence of outdated information in knowledge bases ... This scenario is commonplace … cached and redistributed." | **第 48–60 行**（右欄）。第 76–85 行是貢獻列表 | 引文逐字相符；**行號錯**。 |
| 3 | L33 | "This stark contrast suggests that outdated information actively misleads models rather than merely adding noise to the generation process."（行 408–411） | 第 407–411 行（右欄） | 逐字相符，行號也對。 |

- 依任務書附帶核對：
  - 24%：第 459–464 行 "when introducing just one outdated passage (Table 5:Score↓), … overall scores decrease by more than 24%." 原文有這句。**但紀錄第 2 點的換算 "89.12 → 72.95（Table 5 Score↓ n=0）" 不是這個 24%**：89.12 是 Table 4 的 {R×1, D×1}、72.95 是 Table 5 的 {R×1, O×1}，兩組段落數不同，差 16.17 分、相對降 18.1%。和 24% 對得上的是同樣 n 的配對：Table 4 n=1 89.12 → Table 5 n=1 67.00（相對降 24.8%）、n=2 88.74 → 66.22（25.4%）、n=3 88.17 → 65.05（26.2%）。完美率 93.24 → 81.13（−12.1 點，原文 "over 10%"）也是同 n 配對。
  - 時間衰減「近一半」：Table 2 第 419–426 行，Gauss 衰減後 top-5 R 0.7023、O 0.4950；正文第 466–471 行 "there remains a nearly 50% probability of retrieving outdated information in the top 5 results … R's hit rate dropping by approximately 17%"。正確。
  - 「干擾 6 段總分降不到 2%」：Table 4 n=1 89.12 → n=6 87.98。正確。

判定：**有小錯**。正確值：引言原句在第 48–60 行（紀錄寫 76–85）；24% 的換算應是同 n 配對（例：89.12 → 67.00，n=1），不是 89.12 → 72.95（那是 18%）。

## 6. ross-2026-redundancy-diversity.md

全文檔：`fulltext/o12-ross2026.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L22 | 不同來源（行 342–356）：k=5 比基準高 0.240（1B）、0.173（3B）、0.152（8B）、0.112（12B）；比重複副本高 0.074–0.247 | 第 341–354 行（右欄 4.2，數字在 349、352–353 行附近） | 相符。原文另有「比改寫版高 0.083–0.205」。 |
| 2 | L27 | 結論（行 534–538）："Supplying duplicate copies or LLM-generated paraphrases of an answer-bearing document fails to meaningfully improve answer correctness over a single-document baseline." | 第 534–537 行（左欄） | 逐字相符。 |
| 3 | L28 | 相關研究（行 71–81）：CUE-R、GroupQA、Schuster et al. "suggesting LLMs count token frequency rather than independent corroboration." | 第 71–80 行（右欄） | 逐字相符；紀錄已註明三篇未讀原文。 |

- 附帶核對：Finding 1（第 395–403 行、右欄 332 行）"no generator differs significantly from its single-source baseline at any k, with two exceptions: the 1B generator gains 0.034–0.037 at k=2–3 … and the 3B generator falls 0.033 below baseline at k=5." 紀錄第 1 點相符。另外，引言第 44 行作者自己列出重複 "may also crowd out complementary evidence" 這個可能性，但實驗是直接把文件放進上下文、不經檢索，沒有測。

判定：**通過**。

## 7. deasy-2025-latest-version-detection.md

全文檔：`fulltext/o12-deasy.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L29 | 表格列「現行版排第一 22.9% → 48.9%」 | 第 83 行（Results 表）；第 99–100 行正文 | 相符。 |
| 2 | L32 | 原始語料中舊版在第 1 名 25.7%、前 3 名 58.6%、前 20 名 85.6% | 第 65–66 行（圖說） | 相符。 |
| 3 | L34 | 正確事實已在上下文：36.2% → 50.9% | 第 105–107 行 | 相符。 |

- 附帶核對：舊版是 "300 outdated near-duplicates, each a copy of a real document with a few facts deliberately backdated"（第 47–48 行）、"synthetically backdated"（第 172 行），是程式化造出的近似副本；作者署名 "By the Deasy Labs team at Collibra"（第 12 行）。「判定現行版先看文件自己寫的生效日期，其次系統時間戳，再其次版本號」在第 129–131 行。

判定：**通過**。

## 8. microsoft-copilot-content-lifecycle.md

全文檔：`fulltext/o12-ms-ess.md`（A）、`o12-ms-caf-data.md`（B）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L28 | "Validate that only approved connectors are active and scoped correctly" | A 第 165 行 | 逐字相符。 |
| 2 | L31 | 「記錄檢索決策」："Start by listing each major data domain …"；Product FAQs、Order tracking 例；"Include governance details in the same record. …" | B 第 179–185 行 | 逐字相符。 |
| 3 | L32 | "Because agents synthesize information rather than create it, their accuracy depends entirely on the quality and accessibility of underlying sources." | B 第 127 行 | 逐字相符。 |

- 附帶核對（order 12 正文用到）：試行 "Start with a pilot by limiting Copilot Studio to well-governed, low-risk sites before scaling."（A 157）、"Confirm each site has an assigned site owner."（A 159）、owner／effective date（A 179）、owner／review date（A 183）、"Archive or delete duplicated or outdated content … "current," "archived," or "superseded" status."（A 198）。都相符。

判定：**通過**。

## 9. dzone-2026-source-inventory.md

全文：沒有本機全文檔

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L19 | "As a rule, index stable, widely readable content and fetch live anything that changes often." | — | 無法回查。 |
| 2 | L29 | Step 1："Do not start with a broad, company-wide search that has no clear owner, since you cannot tell whether a result is correct." | — | 無法回查。 |
| 3 | L30 | Step 4："so an update replaces the old chunk instead of creating a copy"；"When a record is deleted or its access is removed, delete its chunks too." | — | 無法回查。 |

- 任務書限定不上網，這次沒有像第八批 kulkarni 那樣用 Exa 重抓。三項都是英文原句，紀錄內部前後一致（範例表與 Step 2、Step 6 的寫法互相對得上），沒有看到矛盾，但這不算核對。
- 結構缺項：沒有存全文檔，也沒有「不一致處」節。

判定：**無法核對**（建議補抓全文存成 `fulltext/o12-dzone.md` 後再抽一次；order 12 正文 L35、L49、L53 三處都靠它）。

---
## 讀取紀錄總核對（order 13 部分，`wc -l` / `wc -c`）

| 全文檔 | 紀錄行數 | 實際 `wc -l` | 紀錄 bytes | 實際 `wc -c` | 已讀區段 | 缺口 |
|---|---|---|---|---|---|---|
| o13-santos2026.txt | 1,606 | 1,606 | 147,866 | 147,866 | L1–1606 | 無 |
| o13-ohrbench.txt | 1,318 | 1,318 | 128,728 | 128,728 | L1–1318（Fig. S3–S12 只有圖說可讀） | 無實質缺口 |
| o13-induocrbench.txt | 663 | 663 | 57,396 | 57,396 | L1–663 | 無 |
| o13-omnidocbench.txt | 2,127 | 2,127 | 211,529 | 211,529 | 正文 1–716、補充 717–1000；1000–2127 只讀圖說與 S24、S29 兩例 | 1000–2127 是模型輸出對照圖的並排文字，紀錄已自述；仍標 full |
| o13-docling-docs.md | 1,187 | 1,187 | 69,054 | 69,054 | 全部 | 無 |
| o13-docling-techreport.txt | 878 | 878 | 132,541 | 132,541 | 正文 1–324；325–878 附錄只讀圖說 | 附錄是示意圖，紀錄已自述 |
| o13-docling-aaai2025.txt | 497 | 497 | 57,088 | 57,088 | 全讀 | 無 |
| o13-azure-rag-chunking.md | 628 | 628 | 48,197 | 48,197 | 正文 91–624 | 無（1–90 與 625–628 是頁首導覽與頁尾） |
| o13-azure-rag-preparation.md | 469 | 469 | 29,239 | 29,239 | 全讀 | 無 |
| o13-colpali.txt | 1,454 | 1,454 | 93,290 | 93,290 | 抽樣時：正文 1–682；附錄 683–1454 只看標題 | 抽樣時 read_status=partial。抽查進行中，紀錄檔已被改成 full 並加「附錄補讀」節（檔案時間 20:52，旁有 `.bak-20261022`），本節抽樣用的是改前的版本行號 |
| o13-most2025-lost-in-ocr.txt | 643 | 643 | 78,747 | 78,747 | 1–230 以 Exa 搜尋回傳段落讀；230–643 讀 pdftotext 檔 | 1–230 沒在本機檔逐段讀，無法用行號回查讀取過程（內容同文） |

- order 13 的 11 個全文檔，紀錄寫的行數與 bytes 全部和 `wc` 一致。

---

## 10. santos-2026-pdf-to-rag-ready.md

全文檔：`fulltext/o13-santos2026.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L28 | 清洗轉換（行 775–805）：單加 HTML、LaTeX、字型或 LLM 重建階層各自 < 1 個百分點；HTML＋LaTeX＋字型重建疊加掉到 81.5，是 MinerU 最差 | 第 775–784 行（83.0、83.9、83.0、84.0）；第 790 行 "differences of less than 1 percentage point"；第 794–795 行 "81.5 ± 0.7%, the lowest among all MinerU configurations" | 相符。 |
| 2 | L30 | 非英文字元（行 140–145、1181–1190）：「ç」常被辨識錯，caça → caca；MinerU VLM 版把 promoção 讀成 promoçao 等；VLM 版 36 份中 12 份當掉（行 853–857） | 第 140–145 行；第 1182–1186 行；第 854–855 行 "processed only 24 of the 36 documents … crashed on the remaining 12" | 行號與數字相符。**措辭略過頭**：原文第 1184–1186 行是假設句 "queries about "promoção" … might not match chunks where the word was incorrectly extracted as "promoçao", or "promocão", or even "promocao""，作者觀察到的是「ç 被 MinerU VLM 誤認」，promoçao 等是舉例可能的錯法，不是實測紀錄。 |
| 3 | L32 | 結論句（行 244–246）"enriching the metadata and, especially, applying hierarchy-aware chunking turned out to matter more than which conversion tool or framework was used."；4.2 節標題（行 1058） | 第 244–246 行；第 1058 行 | 逐字相符，行號也對。 |

- 依任務書附帶核對：
  - 84.7 → 91.2：Table 4 第 690 行（config 16，84.7 ± 1.8）、第 693 行（config 19，91.2 ± 1.0）；第 809–813 行 "yields a 6.5-percentage-point improvement … the largest single-factor gain"。正確。
  - 66.6 → 99.8：Table 6 第 880 行；第 894–896 行 "33-percentage-point gain … (66.6% → 99.8%) far exceeds … (0.8 to 1.3 pp)"。正確。
  - 50 題／9 題：第 507 行 "50 questions with expected answers was manually constructed"；第 861–862 行 "table-dependent questions (9 questions)"，另 6 題階層、12 題 SAP、23 題直述。正確。
  - PDFLoader 最高：第 764–766 行 "Comparing the three automated frameworks using recursive splitting at K = 200 … PDFLoader … achieved the highest accuracy, followed by Docling … and MinerU Pipeline"；三組差異皆顯著（p < 10⁻⁶）。**只在「三者都用遞迴切、K=200、無轉換」時成立**；全部 21 組裡最高是 Docling＋圖片描述 94.1（config 20）。另 Table 6 階層題 PDFLoader 99.7 也是該列最高（紀錄第 50 行已指出）。

判定：**通過**（第 2 項 promoçao 是作者舉例，不是實測，寫文章時別寫成觀察結果）。

## 11. zhang-2025-ohrbench.md

全文檔：`fulltext/o13-ohrbench.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L27 | 格式雜訊主要傷表格、公式、圖表題：檢索最多掉 12.7%（BGE-M3）、生成 9.1%（Llama3.1-8B）；大模型只掉 7%（行 440–449） | 第 440–449 行（右欄）"The maximum performance losses reach 12.7% for BGE-M3 and 9.1% for Llama3.1-8B … only a 7% performance reduction on multimodal questions" | 逐字相符，行號也對。 |
| 2 | L29 | 閱讀順序：VLM 與端到端 OCR 合併段落很差，F1 只有 8.8；pipeline 式接近標準答案（行 388–398） | 第 388–396 行（右欄）"struggle with merging paragraphs correctly, reflected in F1-score of just 8.8 in overall evaluation. In contrast, pipeline-based OCR … achieves performance close to ground truth" | 相符。原文接著寫 "However, GT itself performs poorly"（第 396 行），紀錄沒帶到，不影響。 |
| 3 | L31 | Sim2Real（行 944–953）：隨機 100 題改寫後分數下降，OCR 間排序不變 | 第 946–953 行："randomly pick 100 Q&As and manually rewrite … 27.2/23.2(GT), 20.7/18.0(MinerU), 12.8/12.9(GOT), and 23.1/20.0(Qwen2.5-VL) … the conclusions about different OCR solutions still hold" | 相符。GOT 是 12.8 → 12.9，沒有下降，「分數下降」是多數情形。 |

- 依任務書附帶核對：
  - 14%：第 399–401 行 "Even the best solutions experience a 14% (5 F1-score) drop in the overall stage evaluation"；引言第 135 行 "a performance gap of 14% at least"。Table 2 第 368、378 行：GT 36.1、最好的 Qwen2.5-VL-72B 31.1，5.0/36.1 = 13.9%。正確，是相對降幅。
  - MinerU vs Marker：Table 2 第 372–373 行，編輯距離 MinerU 0.24 < Marker 0.28，但檢索 ALL 50.1 < 56.6、生成 ALL 36.7 > 35.9、端到端 ALL 30.0 > 29.5。第 408–411 行原句 "while MinerU and Qwen2.5-VL-72B exhibit lower edit distances compared to Marker, they do not consistently achieve better performance across all metrics"。紀錄第 24 行寫「檢索 50.1 < Marker 56.6」正確；寫文章要留意端到端 MinerU 其實略高，原文說的是「不一致」，不是「MinerU 較差」。

判定：**通過**。

## 12. sun-2026-induocrbench.md

全文檔：`fulltext/o13-induocrbench.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L26 | 版面幾何（行 283–308）：UltraWide 28.1／49.1、UltraLong 23.6／42.6；跨頁表格 40.7／63.8，LLM 補回 23.1 點仍低於版面完整類 | 第 283–296 行（左欄）"UltraWide at 28.1% OCR and 49.1% RAG, UltraLong at 23.6% and 42.6%. CrosspageTbl at 40.7% OCR and 63.8% RAG … exceeding OCR by 23.1 points yet remains below layout intact categories such as ComplexBG at 88.7% RAG" | 相符。 |
| 2 | L28 | 失敗位置三型（行 316–332）：UltraWide −21.81／−20.16；VisualStyle −10.56／−41.19；多欄 −19.57／−31.95；跨頁表格 −11.10／−22.03 | 第 318–333 行（右欄 3.6 節） | 八個數字都相符。 |
| 3 | L30 | GPT-5 看影像（行 340–350）：73.54% vs 52.92%；標準答案檢索下 53.97% vs 89.76%；例外 VisualStyle 40.32 → 51.58，仍差 7.75 | 第 340–351 行（右欄） | 逐字相符。 |

- 依任務書附帶核對：82.9／52.8 在第 272–273 行 "82.9% OCR accuracy yet only 52.8% RAG accuracy (30.1% discrepancy)"。同一篇內有不一致：Figure 3 圖說（第 330–332 行）寫 "82.9% OCR accuracy yields only 53.0% RAG accuracy"，第 292–293 行寫 "The 30.2 point gap in VisualStyle"。紀錄第 47 行已指出並建議用 52.8／30.1。

判定：**通過**。

## 13. ouyang-2025-omnidocbench.md

全文檔：`fulltext/o13-omnidocbench.txt`（紀錄約定：未標者為全文檔行號，「補充行 n」= 第 713+n 行）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L24 | 多欄與複雜版面（Table 5，行 417–428；行 483–489）"Across all models, we observe a clear drop in accuracy on multi-column and complex layouts."；補充材料（行 117–125）InternVL2、MinerU "incorrectly merges multiple columns"；Qwen2-VL 與 InternVL2 在投影片、財報合併多欄（行 48–51） | Table 5 第 417–428 行；原句第 486–488 行（右欄）；InternVL2／MinerU 在第 832–838 行（右欄）；Qwen2-VL／InternVL2 在第 761–764 行（右欄） | 內容逐字相符。**行號標法錯**：「行 117–125」「行 48–51」是補充行號（713+117 = 830、713+48 = 761），沒有加「補充行」字樣，照紀錄自己的約定會被讀成全文檔第 117、48 行（那裡是正文引言）。 |
| 2 | L33 | 頁首頁尾被忽略（行 400–414；補充行 168–176）"(1) Headers, footers, page numbers, and page footnotes, which are handled inconsistently by different models."；"Some algorithm (e.g., GPT-OCR, Qwen2-VL) tends to remove headers and footers, while others (e.g., GPT4o) prefers to retain them"（Figure S3） | 第 408–414 行（右欄）；補充行 168–176 = 第 881–889 行（右欄） | 逐字相符，行號也對。 |
| 3 | L34 | Figure S29 彩色背景：Marker 把選項順序打亂成「( B. 氧气 C. 二氧化碳 A. 氮气 D . 稀有气体」，漏掉第 3 題（"Missing option 3"） | 第 1977–1996 行；第 1988–1989 行、第 1993 行 | 相符。第 3 題（"3、空气中能使澄清石灰水变浑浊的气体是"）在 Marker 欄整題消失，原圖標註寫 "Missing option 3"。 |

判定：**有小錯**。正確值：第 1 項的「行 117–125」應為「補充行 117–125（全文檔 830–838）」，「行 48–51」應為「補充行 48–51（全文檔 761–764）」。

## 14. docling-docs-and-reports.md

全文檔：`fulltext/o13-docling-docs.md`（另有 techreport、aaai2025 兩檔，本次抽中的 3 項都在 docs 檔）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L22 | 表格合併儲存格（docs 行 322–334）：JSON、HTML、DocTags 保留；Markdown "Flattened. Markdown tables have no span syntax …"；LaTeX 攤平；官方建議 "prefer export_to_html() or export_to_dict() over export_to_markdown()" | 第 320–334 行（表格在 326–333，建議在 334） | 逐字相符。表格還有 Doclang（保留）與 WebVTT（不適用）兩列，紀錄沒列，不影響。 |
| 2 | L26 | 標題階層預設壓平（docs 行 993–995）："Every heading therefore arrives at level 1 … hierarchical chunking"；修復功能 "disabled by default, because a wrong level is worse than a missing one" | 第 993 行、第 995 行 | 逐字相符。第二句原文後面還有 "for pipelines already tuned around flat headings"，紀錄截在 "missing one"，把「對已經按扁平標題調好的管線而言」這個限定截掉了。引用時要補回。 |
| 3 | L28 | 掃描檔沒有字型資訊（"Scanned pages and OCR"）："OCR produces no font metadata, so weight and slant are unavailable on scanned documents" | 第 1095 行小標、第 1097 行 | 逐字相符。 |

判定：**通過**（第 2 項引文截掉限定語，引用時補回）。

## 15. azure-rag-chunking-phase.md

全文檔：`fulltext/o13-azure-rag-chunking.md`（紀錄的「C 行」）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L39 | 載入階段前處理（C 行 208–216）："you might want to remove watermarks, headers, and footers." 清單：移除或標註、LLM 圖片描述、圖片另存、重排表格、依標題建結構 | 第 208 行（原句）；第 210–216 行（清單前四項：Remove or annotate／Replace image references／Download or copy images／Reformat tables） | 相符。「依標題建立文件結構」在第 216 行之後，區段終點略短，不影響。 |
| 2 | L43 | "Start by combining your loading and chunking logic. Separate them when your solution requires it."（C 行 238–240） | 第 238 行 | 逐字相符。 |
| 3 | L48 | "Document layout analysis libraries and services combine optical character recognition (OCR) …"；工具 Document Intelligence、Donut、Layout Parser；"You still have to write code that interacts with the model."（C 行 379–381） | 第 379 行；第 381 行；工具在第 391 行 | 逐字相符。工具列在第 391 行，超出紀錄標的 379–381。 |

判定：**通過**。

## 16. faysse-2025-colpali.md

全文檔：`fulltext/o13-colpali.txt`。抽樣依改前版本（read_status=partial 時的 32 行版）；抽中的三項在改後版本是第 16、18、19 行，內容沒變。

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L16 | 文字管線預設把圖表丟掉（行 257–260）"in our simplest Unstructured configuration (text-only), only textual elements are kept and figures, images, and tables are considered noisy information and are filtered out."；純文字版圖表類任務無分數（Table 2「-」） | 第 258–260 行；Table 2 第 396–398 行（ArxivQ、InfoQ、TabF、Avg. 都是 "-"） | 逐字相符。 |
| 2 | L18 | 引言（行 47–57）"the primary performance bottleneck … stems not from embedding model performance but from the prior data ingestion pipeline … optimizing the ingestion pipeline yields much better performance …"；「highlighting the visual information bottleneck」（行 277–278） | 第 48–50 行、第 56–57 行；第 277–278 行 | 逐字相符，行號也對。 |
| 3 | L19 | 只用 DocMatix 訓練只掉 2.2，仍領先最接近基線 12 分以上（行 615–626） | 第 619–624 行 "the performance drop is minor (−2.2 nDCG@5), still outperforming the closest baseline method by over 12 points" | 相符。 |

- 附帶核對 Table 2（第 394–414 行）：Unstructured＋OCR BGE-M3 平均 66.1、＋Captioning BGE-M3 67.0、ColPali 81.3；TabF 70.8 vs 83.9；InfoQ 60.1–71.9 vs 81.8。都相符。

判定：**通過**（讀取完整度另見總核對表：抽樣時是 partial，抽查期間已被改成 full）。

## 17. most-2025-lost-in-ocr.md

全文檔：`fulltext/o13-most2025-lost-in-ocr.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L22 | 答題（Table 3，行 450–488）：OCR 管線每個指標、每級劣化都較高（總 ROUGE-L 0.2355 vs 0.1903） | 第 450–488 行（左欄 Table 3；OCR-Based = Llama 3.2 90B） | 相符。四級 × 四指標 OCR 欄全部較高。 |
| 2 | L23 | 反方向：ViDoRe DocVQA 上 ColQwen2 NDCG@5 0.6027 vs 兩種 OCR 0.3373（Table 5，行 536–548）；查詢短、ColQwen2 在 ViDoRe 上微調過；兩種 OCR 分數完全相同，"on such clean PDFs OCR quality is no longer the bottleneck"（行 549–562、531–533） | Table 5 第 536–544 行；解釋第 549–562 行；引句第 529–531 行（右欄） | 數字與引句相符。引句區段實際是 529–531，差 2 行。 |
| 3 | L24 | 成本（Table 4，行 450–462）：VLM 記憶體 1.38 GB／千份 vs OCR 9.5 GB；OCR 每份 6 秒 | 第 454–462 行（右欄 Table 4） | 相符。Table 4 另有檢索延遲 VLM 0.04252 s vs OCR 0.0311 s，作者結論說 OCR 在查詢時較快。 |

- 依任務書附帶核對「方向」：
  - 劣化文件（DocDeg）上 OCR 較好：Table 1 第 410–422 行，總 MRR ColQwen2 0.2471、Nougat OCR 0.2858、Llama OCR 0.4852。但 **Level 0 的 Nougat OCR（0.2327）低於 ColQwen2（0.2971）**，所以「每一級都贏」只對 Llama OCR 成立（紀錄第 19 行寫的是 Llama OCR，正確）。
  - 結論第 532–535 行：「without task-specific fine-tuning, OCR-based approaches offer improved retrieval and generation performance in all evaluated settings」。
  - 唯一反方向是 ViDoRe（ColQwen2 有用 ViDoRe 的題目–頁面配對微調）。文章若寫「VLM 直接讀頁面不一定比較好」方向正確；不能寫成「OCR 永遠較好」。

判定：**通過**。

---

- 第 16 節附註（任務 C）：抽查完成後，依任務書補讀了 `o13-colpali.txt` 第 683–1454 行（附錄 A–F），在紀錄末尾加「附錄補讀」一節，read_status 改成 full；`sources.jsonl` 第 163 行 read_status 由 partial 改成 read。改前備份：`faysse-2025-colpali.md.bak-20261022`、`sources.jsonl.bak-20261022-colpali`，`diff` 只差這一行。附錄沒有和紀錄或文章矛盾的內容。

---

## 摘要

| # | 紀錄 | 3 項抽樣 | wc 行數／bytes | 區段涵蓋 | 判定 |
|---|---|---|---|---|---|
| 1 | google-vertex-rag-engine-ingestion | 3/3 | 一致 | 完整 | 通過 |
| 2 | owasp-2025-llm08-vector-embedding | 3/3 | 一致 | 完整 | 通過 |
| 3 | huwiler-2025-versionrag | 3/3 | 一致 | 完整 | 通過 |
| 4 | xie-2024-knowledge-conflicts | 3/3 | 一致 | 參考文獻掃讀 | 通過 |
| 5 | ouyang-2025-hoh-outdated-info | 3/3 引文相符 | 一致 | 附錄掃讀 | 有小錯：引言行號；24% 的換算配對 |
| 6 | ross-2026-redundancy-diversity | 3/3 | 一致 | 完整 | 通過 |
| 7 | deasy-2025-latest-version-detection | 3/3 | 一致 | 完整（圖只讀圖說） | 通過 |
| 8 | microsoft-copilot-content-lifecycle | 3/3 | 一致（兩檔） | 完整 | 通過 |
| 9 | dzone-2026-source-inventory | 0/3 可回查 | 無全文檔 | 無法核對 | 無法核對 |
| 10 | santos-2026-pdf-to-rag-ready | 3/3 | 一致 | 完整 | 通過（promoçao 是作者舉例） |
| 11 | zhang-2025-ohrbench | 3/3 | 一致 | 完整 | 通過 |
| 12 | sun-2026-induocrbench | 3/3 | 一致 | 完整 | 通過 |
| 13 | ouyang-2025-omnidocbench | 3/3 內容相符 | 一致 | 圖例段只讀圖說與兩例 | 有小錯：補充行號沒標「補充行」 |
| 14 | docling-docs-and-reports | 3/3 | 一致（三檔） | 技術報告附錄只讀圖說 | 通過（引文截掉限定語） |
| 15 | azure-rag-chunking-phase | 3/3 | 一致（兩檔） | 正文完整 | 通過 |
| 16 | faysse-2025-colpali | 3/3 | 一致 | 抽樣時 partial；任務 C 補讀後 full | 通過 |
| 17 | most-2025-lost-in-ocr | 3/3 | 一致 | 1–230 經 Exa 讀 | 通過 |

- 通過 14 份，有小錯 2 份（hoh、omnidocbench），無法核對 1 份（dzone），不通過 0 份。
- 可回查的 48 項：數字、原句全部和原文相符；錯的是 2 份的行號標法，以及 hoh 的一個換算。
- 有全文檔的 20 個檔，紀錄寫的行數與 bytes 全部和 `wc` 一致。
- 錯誤與正確值：
  1. hoh：引言原句在**第 48–60 行**（紀錄寫 76–85）。第 2 點把 24% 換算成「89.12 → 72.95」不對，這組是 {R×1, D×1} 對 {R×1, O×1}，只降 18.1%；和原文 24% 對得上的是同 n 配對，例如 **89.12 → 67.00（n=1，相對降 24.8%）**。
  2. omnidocbench：L24 的「行 117–125」應為**補充行 117–125（全文檔 830–838）**，「行 48–51」應為**補充行 48–51（全文檔 761–764）**。
- 流程問題（不算紀錄錯誤）：
  - dzone 沒有存全文檔，後來的人無法用 wc 與行號回查；order 12 正文三處靠它。建議補抓存檔。
  - hoh 全文檔含控制字元，`grep` 要加 `-a`。
- 寫文章要留意、但紀錄沒錯的地方：
  - Santos 的 caça → caca 出自引言的舉例（第 140–145 行 "may be recoded"），promoçao 是假設句；實測只有「ç 常被多種工具認錯」與 MinerU VLM 當掉 12 份。
  - Santos 的「PDFLoader 最高」只在三種自動工具都用遞迴切、K=200、無轉換時成立（第 764–766 行），不是四種。
  - InduOCRBench 的題目多數由 LLM 生成，但 VisualStyle（82.9／52.8 那一類）是人工題（紀錄第 40 行）。跨頁表格「LLM 補回 23.1 點」，是部分可救，不是救不回來。
  - Ross 的實驗不經檢索，直接把副本放進上下文；「副本擠掉其他段落」是作者在引言提到的可能性，沒有測。
  - Deasy 的舊版是程式造出的回溯副本（"synthetically backdated"），不是人手做的。

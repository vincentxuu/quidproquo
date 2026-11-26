# 抽取紀錄抽查：第十一批（15 份）

- 抽查日期：2026-10-22
- 抽查者：獨立抽查員（沒參與寫作與精讀）
- 範圍：order 16 的 7 份（qu-2025-semantic-chunking-cost、bennani-2026-chunking-strategies、hsu-2025-dat-hybrid-drcd、hsu-2025-kap-ocr-hybrid、xiao-2024-cpack-cmteb、mongodb-voyage-migrate-embedding-model、chroma-2024-evaluating-chunking），以及 order 17 的 8 份（azure-search-document-level-access、microsoft-copilot-secure-govern-blueprint、microsoft-copilot-connectors-crawl-permissions、amazon-q-business-principal-store、bhatt-2025-participant-aware-access-control、amanbayev-2026-filtered-anns、pinecone-multitenancy、pgvector-readme-filtering）。
- 沒有改動任何抽取紀錄或文章。

## 抽樣方法

- 沿用第八到十批的方法。腳本：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/spot11/sample.py`（由 spot10/sample.py 複製，只把 `SECS` 換成這 15 份，每份都用預設的「可引用」「主張」「原句」節）。
- 候選行、排除條件、每份檔案前 `random.seed(17)` 後 `random.sample(候選, 3)`，都和前幾批相同。各份候選數：qu 8、bennani 7、dat 6、kap 8、cpack 9、mongodb 6、chroma 5、azure 11、blueprint 8、connectors 11、amazon-q 8、bhatt 12、amanbayev 9、pinecone 8、pgvector 7。
- 核對方式：`sed -n`／`grep -n` 回 `scratchpad/fulltext/o16-*`、`o17-*` 找原處，數字逐個對到原句或原表。Azure 的四種做法對照表在 Markdown 檔裡是 `[TABLE]`，改從 `o17raw/azdlac.html` 去標籤後讀。
- 全部 15 份都有存全文檔，不需要補抓，這次沒有上網。
- 下列差異只是文字層的不同，不算不一致：彎直引號、Markdown 強調、PDF 斷行與斷字、雙欄混排、引文前後截短但不改意思。

## 讀取紀錄總核對（`wc -l` / `wc -c`）

| 全文檔 | 紀錄行數 | 實際 `wc -l` | 紀錄 bytes | 實際 `wc -c` | 紀錄寫的已讀區段 |
|---|---|---|---|---|---|
| o16-qu2025-naacl.txt | 856 | 856 | 76,201 | 76,201 | 1–856 |
| o16-qu2025.txt（arXiv v1） | 684 | 684 | 64,974 | 64,974 | 1–684 |
| o16-bennani2026.txt | 207 | 207 | 21,988 | 21,988 | 1–207 |
| o16-dat2025.txt | 715 | 715 | 42,096 | 42,096 | 1–715 |
| o16-kap2025.txt | 354 | 354 | 42,278 | 42,278 | 1–354 |
| o16-cpack2024.txt | 651 | 651 | 83,868 | 83,868 | 1–530 正文；530–651 參考文獻 |
| o16-mongodb-migrate-embedding.txt | 141 | 141 | 8,750 | 8,750 | 1–141 |
| o16-chroma2024.txt | 979 | 979 | 86,327 | 86,327 | 1–979 |
| o17-azsec.md | 172 | 172 | 10,913 | 10,913 | 1–172 |
| o17-azdlac.md | 141 | 141 | 22,198 | 22,198 | 1–141＋表格另讀 |
| o17-m365gov.md | 63 | 63 | 4,337 | 4,337 | 全部 |
| o17-m365-blueprint-pdf.txt | 405 | 405 | 31,193 | 31,193 | 1–405 |
| o17-m365config.md | 123 | 123 | 11,198 | 11,198 | 全部 |
| o17-graphitems.md | 127 | 127 | 10,837 | 10,837 | 全部 |
| o17-connfaq.md | 127 | 127 | 11,362 | 11,362 | 全部 |
| o17-conndeploy.md | 269 | 269 | 21,101 | 21,101 | 全部 |
| o17-connindexed.md | 105 | 105 | 12,470 | 12,470 | 全部 |
| o17-rm503570.md | 67 | 67 | （未記） | 1,765 | 全部 |
| o17raw/rm-official.json | — | — | 1,013 | 1,013 | 全部 |
| o17-qprincipal.md | 40 | 40 | 7,479 | 7,479 | 1–40 |
| o17-bhatt2025.txt | 822 | 822 | 65,204 | 65,204 | 1–822 |
| o17-fann2026.txt | 1,971 | 1,971 | 158,456 | 158,456 | 全部（fann-numbered.txt 1,619 行，相符） |
| o17-pinecone-design-multitenancy.md | 378 | 378 | 12,867 | 12,867 | 正文行全讀，範例掃過 |
| o17-pinecone-implement-multitenancy.md | 808 | 808 | 26,517 | 26,517 | 正文行全讀，範例掃過 |
| o17-pgvector-readme.md | 1,361 | 1,361 | 42,305 | 42,305 | 1–945 全讀；946–1361 掃過 |

- 25 個檔案，紀錄寫的行數與 bytes 全部和 `wc` 一致（rm503570.md 紀錄只寫行數）。原始檔 azsec.html 58,271、qprincipal.html 24,486、bhatt.pdf 528,859、fann.pdf 1,210,493、blueprint.pdf 1,374,053 bytes 也都相符。
- 讀取缺口：C-Pack 參考文獻只確認沒有附錄；pgvector 946 行以後（型別表、安裝筆記）掃過；Pinecone 兩頁的多語言範例掃過。三處紀錄自己寫明，都不是文章用到的段落。

---

## 1. qu-2025-semantic-chunking-cost.md

全文檔：`fulltext/o16-qu2025-naacl.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L31 | 表 3 BERTScore 三種切法幾乎相同（TechQA 都是 0.68）；"difficult to draw any definitive conclusions" | 第 182–193 行 | 相符。原句前半是 "Semantic Chunkers performed slightly better … but the differences are minimal"。 |
| 2 | L35 | E.4 breakpoint 切出單句塊、拆開第 5、6 句；clustering 把位置遠的第 16 句併進來；"semantic similarity alone is not a reliable measure …" | 第 619–630 行 | 逐字相符。 |
| 3 | L36 | E.5 換 bge-large、mpnet 後方向不變；"Recommendation: Just use fixed-size chunking in practice."（行 674–675、750–752） | 第 634–675、744–752 行 | 相符。E.5.1 原文另寫 breakpoint 在拼接資料上 "a clear edge"，與正文第 2 點一致。 |

判定：**通過**。

## 2. bennani-2026-chunking-strategies.md

全文檔：`fulltext/o16-bennani2026.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L26 | F3：sentence（O=0、S=300）BERTScore 0.5k–2.5k 穩定，10k 相對降 ∼4–5%；落點依模型而異 | 左欄第 138–140 行接右欄第 116–122 行 | 相符。 |
| 2 | L27 | F4：BERTScore 在 ∼500 最高、EM 在 ∼2.5k 最高；None Ratio 0.5k 約 30% → 10k 約 11%；塊越大 NONE 越多 | 右欄第 129–140 行 | 相符（"rose with larger 𝑆"）。 |
| 3 | L28 | 表 1 預設值：Overlap 0%、Sentence、S 150–300、C（QA）∼2.5k、C（摘要）∼500、C > 5k 考慮 Semantic | 第 144–152 行 | 逐列相符。 |

判定：**通過**。補充給審稿用：F1 原文是「adding 10–20% overlap」、檢索器是 SPLADE、語料是 NQ 的英文維基百科（第 58–59 行），1.25× 是 r = 0.2 時的公式值。

## 3. hsu-2025-dat-hybrid-drcd.md

全文檔：`fulltext/o16-dat2025.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L26 | 表 5 DRCD 子集 P@1：Dense 0.1838、BM25 0.5555、Fixed 0.6507、DAT（GPT-4o）0.7150 | 第 454–462 行 | 相符。 |
| 2 | L27 | 全資料 DRCD P@1 +3.3 點（GPT-4o 0.8440）；子集 +6.4 點 | 表 3 第 414–422 行；第 392–397、479–480 行 | 相符。0.8440 − 0.8113 = 3.27 點；原文寫 "˜3.3%"，指百分點。 |
| 3 | L28 | 很多題 α 怎麼調都一樣（原句）；DRCD 3,000 題中 1,523 題屬於子集 | 第 320–324 行；表 1 第 333 行 | 逐字相符。 |

判定：**通過**。補充：全資料 P@1 為 Dense（text-embedding-3-large，第 356 行）0.5743、BM25 0.7630、Fixed Hybrid（α = 0.6）0.8113，即文章的 57／76／81。指標是「正確段落排第一」的檢索 P@1，不是答案正確率。

## 4. hsu-2025-kap-ocr-hybrid.md

全文檔：`fulltext/o16-kap2025.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L26 | KAP 完整：BM25 51.16±0.21、Dense 53.65±2.24、Hybrid 59.73±1.10（P@1） | 表 3–5 第 256、268、283 行 | 相符；基線 41.51／32.10／38.98 也對得上。 |
| 2 | L31 | OCR 錯誤：「0」→「O」、「1」→「l」；表格結構消失 | 第 85–89 行（右欄） | 相符。 |
| 3 | L32 | 繁中 BM25 原句 "particularly in Traditional Chinese, where word order …" | 第 31–36 行（右欄） | 逐字相符。 |

判定：**通過**。資料是玉山銀行競賽資料的財報類（第 160–170 行），作者與 DAT 同屬政治大學。

## 5. xiao-2024-cpack-cmteb.md

全文檔：`fulltext/o16-cpack2024.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L30 | "The biggest improvements are on the retrieval task followed by STS, pair classification, and re-ranking." | 第 377–380 行（右欄） | 逐字相符。 |
| 2 | L31 | 表 3：BGE-pretrain 檢索 63.90 → BGE-finetune 71.53；表 4 批次 256 → 19,200，檢索 57.25 → 63.90 | 第 414–422、430–436 行 | 數字相符。用語小差：原文 BGE-pretrain 是用 C-MTP（unlabeled）做一般對比微調後的 intermediate checkpoint，「pre-train」另指 RetroMAE；紀錄寫「弱監督預訓練」意思沒錯。 |
| 3 | L32 | 腳註 1 "This situation has been substantially improved since our work." | 第 126 行 | 逐字相符。 |

判定：**通過**。表 3 另有 OpenAI-Ada-002 檢索 52.00（第 417 行），對到文章的「52 對 71.5」。

## 6. mongodb-voyage-migrate-embedding-model.md

全文檔：`fulltext/o16-mongodb-migrate-embedding.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L16 | voyage-4 系列相容但仍建議重算（原句） | 第 43 行 | 逐字相符。 |
| 2 | L17 | "evaluate its retrieval quality on a representative sample of your own data …" | 第 45 行 | 逐字相符。 |
| 3 | L18 | 自動嵌入改 model 會重建索引並另計費（原句）；重建期間舊索引仍可查 | 第 60 行 | 逐字相符。 |

判定：**通過**。文章 L29「即使維度相同也要重算」對到第 4–5 行。

## 7. chroma-2024-evaluating-chunking.md

全文檔：`fulltext/o16-chroma2024.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L21 | OpenAI 800/400「slightly below-average recall and the lowest scores across all other metrics」；假設是 TokenTextSplitter | 第 335 行 | 逐字相符。 |
| 2 | L23 | MiniLM：TokenText 250/125 recall 82.4、250/0 為 77.1；Recursive 250/125 vs 250/0 為 78.7 vs 78.5 | 表格第 345–354 行；第 356 行 | 相符。 |
| 3 | L24 | LLM 91.9、Cluster 91.3，高於所有固定切法（最高 89.5）；Kamradt 預設 83.6 最低 | 主表第 318–331 行；第 337–339 行 | 相符。 |

判定：**通過**。補充：主表（text-embedding-3-large）裡，同大小時不重疊的召回反而略高（Recursive 400：89.5 對 88.1；TokenText 400：89.2 對 88.6）。overlap 提高召回只出現在 MiniLM＋TokenText。

## 8. azure-search-document-level-access.md

全文檔：`fulltext/o17-azsec.md`（A）、`o17-azdlac.md`（B）、`o17raw/azdlac.html`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L26 | retrievable=false 不是安全機制（原句） | A 第 77 行 | 逐字相符。 |
| 2 | L28 | 四種做法：Security filters（字串比對，GA）；POSIX-like ACL／RBAC（preview）；Purview 標籤（preview）；SharePoint ACL（preview） | B 第 28 行；表格在 HTML | 名稱與 preview 標記相符。表格沒有寫「GA」，只寫 security filters "isn't bound to an API so you can use any version or package"；「GA」是紀錄的推論，可接受。 |
| 3 | L30 | 權限變更要同步才生效（原句）；SharePoint 唯一權限增量、繼承變更要明確 refresh | B 第 104 行 | 逐字相符。 |

判定：**通過（附註）**。審稿用補充：「沒有投射就不會被過濾」那句（B 第 96 行）講的是知識來源的機密標籤；ACL 欄位在切塊時的寫法是「從 field mappings 改到 index projections」（B 第 77、81 行），原文沒有說不改就不會被過濾。

## 9. microsoft-copilot-secure-govern-blueprint.md

全文檔：`fulltext/o17-m365-blueprint-pdf.txt`（P）、`o17-m365config.md`（C）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L26 | 三種後果原句 | P 第 67–79 行 | 相符（投影片排版，三句分散在第 76–78 行）。 |
| 2 | L31 | "Validate through Microsoft Purview Auditing and reports …" | C 第 58 行 | 逐字相符。 |
| 3 | L32 | 授權門檻；E5 Optimized 與 E3 Foundational 兩版 | C 第 34–39 行；P 第 302、351 行 | 相符。 |

判定：**通過**。

## 10. microsoft-copilot-connectors-crawl-permissions.md

全文檔：`fulltext/o17-connfaq.md`（F）、`o17-conndeploy.md`（D）、`o17-connindexed.md`（I）、`o17raw/rm-official.json`（R）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L32 | 完整爬取 "Reflects any deletions …" "Updates the permissions." | F 第 74–75 行 | 逐字相符。 |
| 2 | L34 | D 的增量／完整爬取四句原文 | D 第 103–105、219–229 行 | 逐字相符。 |
| 3 | L36 | 「所有人可見」蓋過來源權限（原句）；Only users with access／Everyone 二選一 | I 第 29、82 行；D 第 55–61 行 | 相符。 |

判定：**通過**。審稿用補充：「最多 24 小時」只在 I 第 85 行，F（FAQ）沒有；R 的 status 是 "Launched"、releasePhase "General Availability"、GA "July CY2026"。

## 11. amazon-q-business-principal-store.md

全文檔：`fulltext/o17-qprincipal.md`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L22 | 主控台要 re-sync 才抓得到 ACL 與成員變更（原句） | 第 26 行 | 逐字相符。 |
| 2 | L27 | 改 User Store 是特權操作（三句原文） | 第 14–16 行 | 逐字相符。 |
| 3 | L28 | 2024-12-17 起 email 不分大小寫、subaddress 視為同一人 | 第 7 行 | 相符。 |

判定：**通過**。

## 12. bhatt-2025-participant-aware-access-control.md

全文檔：`fulltext/o17-bhatt2025.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L24 | 三類防禦都是機率性；輸出過濾 "lack awareness of downstream recipients' access permissions"；"$7M" → "Meeting on May 7th" | 第 455–488 行（引句在第 473–476 行） | 相符。 |
| 2 | L26 | 微調規則原句；biclique；O(\|D\|² log \|E\|) | 第 222–224 行；第 814–817 行 | 相符。 |
| 3 | L28 | 動態 ACL、ACL 本身可能錯（原句） | 第 543–546 行 | 逐字相符。 |

判定：**通過**。審稿用補充：原文舉的多人情境是回覆郵件、多人收件、共同編輯工具（第 497–506 行），沒有提群組聊天或會議；全文沒有提 Slack。

## 13. amanbayev-2026-filtered-anns.md

全文檔：`fulltext/o17-fann2026.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L30 | σg ≲ 5% 考慮 IVFFlat、≳ 20% 用 HNSW（原句） | 第 1469–1472 行 | 逐字相符。 |
| 2 | L31 | FAISS bitset "negligible overhead (< 1 ms …)"；HNSW QPS 對選擇性不敏感 | 第 1076–1079、1063–1066 行 | 相符。 |
| 3 | L32 | GLS 低（ρq < −0.3）召回較低；"while σg determines the average system behavior …" | 第 1300–1303 行 | 逐字相符。 |

判定：**通過**。Milvus 例外（第 1313–1326 行：過濾比例超過 93% 改暴力搜尋，"guaranteeing 100% recall"）與查詢型式「純量屬性 ≥ 門檻」（第 923 行）另外核對過，相符。

## 14. pinecone-multitenancy.md

全文檔：`fulltext/o17-pinecone-implement-multitenancy.md`（I）、`o17-pinecone-design-multitenancy.md`（D）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L23 | 成本：1 RU／1 GB；100 租戶各 1 GB 查一個 1 RU，過濾 100 GB 要 100 RU（原句） | I 第 43 行；D 第 21 行 | 逐字相符。 |
| 2 | L27 | 用最少群組；"only 2 group identifiers" | D 第 183、362 行 | 逐字相符。 |
| 3 | L29 | 替代方案警告："When tenant isolation isn't a strict requirement"；post-filter client-side | I 第 794–804 行 | 相符。 |

判定：**通過**。

## 15. pgvector-readme-filtering.md

全文檔：`fulltext/o17-pgvector-readme.md`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L21 | 先建一般索引 "can provide fast, exact nearest neighbor search in many cases"；"Exact indexes work well for conditions that match a low percentage of rows …" | 第 432、444 行 | 逐字相符。 |
| 2 | L22 | 多租戶共用近似索引影響召回與速度；用 list partitioning 或分表 | 第 470–472 行 | 逐字相符。 |
| 3 | L24 | 0.8.0 起 iterative scan；`hnsw.max_scan_tuples` 預設 20,000；strict／relaxed | 第 480–495、522–527 行 | 相符（20,000 在第 524 行）。 |

判定：**通過**。文章用的「10% → 4 筆」在第 450 行（ef_search 預設 40）。

---

## 摘要

| # | 紀錄 | 3 項抽樣 | wc 行數／bytes | 區段涵蓋 | 判定 |
|---|---|---|---|---|---|
| 1 | qu-2025-semantic-chunking-cost | 3/3 | 一致（兩檔） | 完整 | 通過 |
| 2 | bennani-2026-chunking-strategies | 3/3 | 一致 | 完整 | 通過 |
| 3 | hsu-2025-dat-hybrid-drcd | 3/3 | 一致 | 完整 | 通過 |
| 4 | hsu-2025-kap-ocr-hybrid | 3/3 | 一致 | 完整 | 通過 |
| 5 | xiao-2024-cpack-cmteb | 3/3 | 一致 | 參考文獻掃讀 | 通過（「預訓練」用語小差） |
| 6 | mongodb-voyage-migrate-embedding-model | 3/3 | 一致 | 完整 | 通過 |
| 7 | chroma-2024-evaluating-chunking | 3/3 | 一致 | 完整 | 通過 |
| 8 | azure-search-document-level-access | 3/3 | 一致（兩檔＋HTML） | 完整 | 通過（「GA」是推論） |
| 9 | microsoft-copilot-secure-govern-blueprint | 3/3 | 一致（三檔） | 完整 | 通過 |
| 10 | microsoft-copilot-connectors-crawl-permissions | 3/3 | 一致（五檔＋JSON） | 完整 | 通過 |
| 11 | amazon-q-business-principal-store | 3/3 | 一致 | 完整 | 通過 |
| 12 | bhatt-2025-participant-aware-access-control | 3/3 | 一致 | 完整 | 通過 |
| 13 | amanbayev-2026-filtered-anns | 3/3 | 一致 | 完整 | 通過 |
| 14 | pinecone-multitenancy | 3/3 | 一致（兩檔） | 範例掃過 | 通過 |
| 15 | pgvector-readme-filtering | 3/3 | 一致 | 946 行後掃過 | 通過 |

- 45 項抽樣：數字與原句全部和原文相符，沒有不通過的紀錄，也沒有要更正的數字。
- 25 個全文檔與 JSON，紀錄寫的行數與 bytes 全部和 `wc` 一致。
- 只有兩處用語小差，都不影響數字：
  1. azure：「Security filters（GA）」原表沒寫 GA，只是沒標 preview。
  2. cpack：「BGE-pretrain＝弱監督預訓練」，原文稱 C-MTP（unlabeled）一般微調後的 intermediate checkpoint。
- 寫文章要留意、但紀錄沒錯的地方（審稿報告會用到）：
  - DAT 的 57／76／81 是檢索 P@1（正確段落排第一），不是答案正確率；混合是固定 α = 0.6。
  - Chroma 主設定（text-embedding-3-large）下不重疊的召回略高；overlap 只在 MiniLM＋TokenText 明顯有幫助。
  - Qu 的 E.2 只說 embedding 影響顯著（stella 比 bge 平均高 7.44%），沒有和換切法的差距比大小。
  - Azure「沒投射就不會被過濾」是機密標籤那句；ACL 那句只說改用 index projections。
  - Copilot 連接器「24 小時」在 indexed-content 頁，不在 FAQ；路線圖 503570 已標 Launched／GA 2026 年 7 月。
  - Bhatt 的多人例子是郵件與共同編輯，沒有群組聊天、會議，也沒有提 Slack；「已部署」指 Copilot Tuning 的微調資料選擇。

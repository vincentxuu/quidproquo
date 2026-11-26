# 抽取紀錄抽查：第八批（13 份）

- 抽查日期：2026-10-22
- 抽查者：獨立抽查員（沒參與寫作與精讀）
- 範圍：order 11 的 8 份（azure-rag-preparation-phase、akkiraju-2024-facts、kucia-2026-synthetic-vs-authentic、peng-2024-uaeval4rag、thakur-2025-trec-rag-support、kulkarni-savelieva-2024-golden-dataset、anthropic-2024-contextual-retrieval 只抽「2026-10-22 order 11 補核對」節、barnett-2024-seven-failure-points），以及 order 1、2 補讀的 5 份（forte-basb-overview、zettelkasten-collectors-fallacy、gtd-weekly-review-checklist、bergman-2013-jasist-folder-vs-tag 只抽「2026-10-22 補讀」節、whittaker-hirschberg-2001-paper-archives 只抽「正式版補讀」節）。
- 只讀檔，沒有改動任何抽取紀錄或文章。

## 抽樣方法

- 沿用第七批的方法。腳本：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/spot8/sample.py`（由 spot7/sample.py 複製，只改檔名清單與節名）。
- 候選範圍：
  - 預設是標題含「可引用」「主張」「原句」的 `##` 節。
  - anthropic、bergman、whittaker 依任務書只取補讀那一節（各自的 `##` 節，含底下的 `###`）。
  - gtd 沒有「可引用」節，取「清單全文」節。
  - barnett 全檔沒有 `##` 節，整檔當候選。
- 候選行、排除條件、`random.seed(17)` 後 `random.sample(候選, 3)`，都和第七批相同。
- 核對方式：用 `grep -n`、`sed -n` 回全文檔找原處，數字逐個對到原句或原表。Peng 的表格欄位另用 `pdftotext -layout` 重轉 `o11raw/peng.pdf`（輸出在 `scratchpad/spot8/peng/`）確認欄位對應。
- **兩份沒有存全文檔**：barnett（紀錄寫 exa 取 HTML）與 kulkarni（紀錄寫「未存成 scratchpad 檔」）。為了能核對，抽查時另外取得：
  - barnett：`curl https://arxiv.org/pdf/2401.05856v1`（200，570,647 bytes）→ `pdftotext -layout` → `scratchpad/spot8/dl/barnett.txt`（326 行、43,455 bytes）。
  - kulkarni：curl 會被 Medium 擋（`o11raw/msgolden.html` 是 Cloudflare 擋頁），改用 Exa `web_fetch_exa`（maxCharacters 60000）取回全文，從標題讀到 "No responses yet"。沒有落檔。
- 下列差異只是文字層的不同，不算不一致：彎直引號、Markdown 強調、PDF 斷行與斷字、雙欄混排。

## 讀取紀錄總核對（`wc -l` / `wc -c`）

| 全文檔 | 紀錄行數 | 實際 `wc -l` | 紀錄 bytes | 實際 `wc -c` | 已讀區段 | 缺口 |
|---|---|---|---|---|---|---|
| o11-azure-prep.md | 473 | 473 | 29,342 | 29,342 | 紀錄寫「已讀 1–474 全部」 | 檔案只有 473 行，L474 不存在 |
| o11-azure-overview.md | 347 | 347 | 19,217 | 19,217 | 過濾標記後讀完正文 | 無 |
| o11-facts-akkiraju2024.txt | 365 | 365 | 47,690 | 47,690 | L1–365 | 無（但行號引用不準，見第 2 節） |
| o11-kucia2026.txt／o11-kucia2026-raw.txt | 451／911 | 相符 | 60,626／38,555 | 相符 | layout L1–230；raw L440–790＋參考文獻 4 筆 | 無實質缺口。layout L231–451 與 raw L1–439 沒讀，但內容互相重疊：layout L1–230 到 §4.2 與 Figure 1（layout 260 是 Figure 1 圖說），raw L440 起是 Figure 1 數據、§4.2 後半到 §5、§6（raw 714 "Discussion and Limitations"、783 "References"） |
| o11-peng2024-uaeval4rag.txt／.para.txt | 2,513／734 段 | 2,513／734 行 | 77,684／77,686 | 相符 | 段落版 bytes 0–45,500；附錄只看標題與 Table 11 | 附錄 B 的 Table 17／18 沒讀（見第 4 節，影響一個轉述） |
| o11-thakur2025-trec-rag-support.txt／o11-thakur2025.para.txt | 2,159／— | 2,159／520 行 | 58,610／58,612 | 相符 | 段落版「1–398 段」 | 無。段落版一段一行，第 398 行是 Acknowledgments，399 起是參考文獻與附錄表 |
| o11-anthropic-contextual-retrieval.txt | 194 | 194 | 16,036 | 16,036 | L1–60（補核對只需要這段） | 無。原始 HTML `o11raw/anthropic.html` 240,989 bytes，也相符 |
| barnett | 無全文檔 | — | — | — | 紀錄寫 HTML 全文一次讀完 | 無法用 wc 核對；抽查改用 v1 PDF |
| kulkarni | 無全文檔 | — | — | — | 紀錄寫 Exa 全文 | 無法用 wc 核對；抽查重抓 Exa 全文 |
| fix-forte-basb-overview.raw.txt | 587 | 587 | 33,811 | 33,811 | L1–587 | 無 |
| fix-collectors-fallacy.raw.txt | 99 | 99 | 8,902 | 8,902 | L1–99 | 無 |
| fix-gtd-weekly-review-checklist.txt | 52 | 52 | 1,995 | 1,995 | L1–52 | 無 |
| fix-bergman-2013-jasist-preprint.txt | 1,374 | 1,374 | 95,057 | 95,057 | L1–1374 依節列出 | 無 |
| fix-whittaker-hirschberg-2001-tochi.txt | 1,061 | 1,061 | 73,206 | 73,206 | L1–540、L540–1061 | 無 |

- 有全文檔的 11 個檔，紀錄寫的行數與 bytes 全部和 `wc` 一致。
- azure 的已讀區段終點寫成 474，比檔案多一行（和第七批 lulla 同型）。
- 「與摘要／範圍卡／常見轉述不一致處」節：
  - 有這一節：azure（1 條以上）、akkiraju、kucia（3 條）、peng（2 條）、thakur（1 條）、bergman、whittaker。
  - barnett、anthropic 寫成單行「與摘要不一致：…」。
  - kulkarni 沒有這一節。
  - forte、zettelkasten、gtd 沒有這一節，但有「核對系列正文」表，功能相近。

---

## 1. azure-rag-preparation-phase.md

全文檔：`fulltext/o11-azure-prep.md`（紀錄的「P 行」）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L28 | 用途（P 行 305）："By having both the sample queries and the parts of the sample content that address those queries, you can evaluate every stage of the RAG solution …" | 第 305 行 | 逐字相符，行號也對。 |
| 2 | L30 | 合成題（P 行 317–343）：切塊 "Don't use the chunking strategy for your overall solution. Use this one-off step"；"you usually start by generating two queries for each chunk"；"A SME should review and validate the output." | 第 317 行小標 "Create synthetic queries"；第 321、323、343 行 | 三句都逐字相符，區段也對。 |
| 3 | L32 | 品質閘門與維護（P 行 363–365） | 第 363、365 行 | 逐字相符。 |

判定：**有小錯**。抽中的 3 項都對。正確值：已讀區段是 L1–473（紀錄寫 1–474）。

## 2. akkiraju-2024-facts.md

全文檔：`fulltext/o11-facts-akkiraju2024.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L29 | "it is advisable to use caution when using LLMs as human proxy, as using LLMs as judges can lead to self-fulfilling prophecy type of scenarios reinforcing their inherent biases in evaluations as well." | 第 255–258 行（左欄） | 逐字相符。 |
| 2 | L31 | "Automated tools should be used where feasible to supplement but not replace human oversight." | 第 263–264 行（右欄，"Automate Evaluations" 條） | 逐字相符。 |
| 3 | L33 | "Plan for Long Test Cycles" | 第 253 行（右欄，6.1 Learnings 第一條） | 相符。 |

- 行號問題：紀錄把這三句歸在「§6，行 262–289」，但 §6 "TESTING RAG-BASED CHATBOTS (T)" 實際在第 252 行開始，到第 270 行 "7 SECURING" 之前結束。引文都在 252–264。
- 同一紀錄其他行號也偏了：
  - "most impact" 寫 140–146，實際在 125–130。
  - "Vector databases are not so good" 寫 161–166，實際在 154–155。
  - "245 queries" 寫 172–174，實際在 156。
  - FACTS 五面向寫行 31–37，實際在 40。
  - 偏差 1 到 15 行不等，看起來是用另一次 pdftotext 輸出的行號。引文內容都對。

判定：**有小錯**。正確值：§6 是第 252–270 行；L29 那句在 255–258，L31 在 263–264，L33 在 253。

## 3. kucia-2026-synthetic-vs-authentic.md

全文檔：`fulltext/o11-kucia2026.txt`（L）、`o11-kucia2026-raw.txt`（R）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L31 | Qdrant hybrid：0.896 → 0.527（ΔHit@5 = −0.369，95% CI −0.44 到 −0.29），2.70 s | Table 3：R 691（0.896）、R 692 附近（0.527）、R 700（−0.369 [−0.44, −0.29]）、R 702（2.70）；layout L313–315 | 相符。0.896 與 0.527 是 Hit@5 那一欄。 |
| 2 | L33 | "within the same backend, hybrid retrieval scores 0.527 on authentic queries against 0.545 for dense alone, at 1.7× the latency (2.70 s versus 1.57 s per query), and 8× that of the fastest configuration." | R 590–593；layout L287–288 | 逐字相符。2.70/1.57 = 1.72，2.70/0.33 = 8.2，紀錄的解讀正確。 |
| 3 | L40 | "Our results are not an argument against synthetic evaluation."（§5） | R 716，§5 "Discussion and Limitations"（R 714） | 逐字相符。 |

- 依任務書附帶核對的數字：
  - 29–37 個百分點：R 579 "dropping 29–37 percentage points in Hit@5 across all configurations"。0.820→0.527、0.849→0.545、0.896→0.527，分別是 29.3、30.4、36.9。正確。
  - 2.3 倍：R 363 "15.7 words compared to 6.8"，15.7/6.8 = 2.31。正確。
  - 近一半：R 601 "49% of authentic queries (157 of 322)"。正確。
  - 50–100 題：R 729 "(2) Collect 50–100 authentic queries"。正確。
- 寫文章要留意：Table 3 的真實題是能對應到頁面的 165 題，不是全部 322 題（R 610 前後的 Table 3 標題 "authentic (165 questions)"）。紀錄第 2 點已寫「有來源者 165 題」。

判定：**通過**。

## 4. peng-2024-uaeval4rag.md

全文檔：`fulltext/o11-peng2024-uaeval4rag.para.txt`；欄位對照用 `scratchpad/spot8/peng/layout.txt`（`pdftotext -layout` 重轉）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L20 | Table 1：三位作者標 150 組，一致度 0.76、0.83；三個 LLM 對作者標註的「準確度 82.0–84.4%、76.7–76.9%（F1 81.3–86.0%）」 | 段落版第 151 行（150 組、0.76、0.83）；layout 第 318–320 行（Table 1） | **欄位標錯**。Table 1 有四欄：Ans./Unans./Clar. 的 Accuracy、F1，Acc./Unacc. 的 Accuracy、F1。各欄依序是 82.0–84.4%、76.7–76.9%、81.3–84.0%、83.1–86.0%。所以 76.7–76.9% 是第一組標籤的 **F1**，不是準確度；第二組標籤的準確度是 81.3–84.0%，F1 是 83.1–86.0%。 |
| 2 | L22 | "no single configuration consistently achieves optimal joint scores, as the top three combinations in both datasets do not overlap." | 段落版第 305 行；layout 第 432–436 行 | 逐字相符。 |
| 3 | L23 | Table 3（prompt）：TriviaQA 可接受率 53.2% → 84.3%，正確率 88.0% → 88.4%；#2 可接受率 83.0%、正確率 74.8%；MuSiQue #2 正確率 49.0% → 16.0% | layout 第 398–403 行（Table 3 在圖說上方） | 六個數字都相符。 |

- 抽樣以外、會影響文章的發現：紀錄第 3 點（L21）寫「OpenAI 嵌入＋純向量、無 reranker、無改寫的組合，可回答題正確率最高（88.4%），不可回答題的可接受率卻最低（49.0%）」。
  - Table 2（layout 第 374 行）確實是 88.4%／49.0%，原文第 366–371 行也說這組 "yield the lowest acceptance rate"。
  - 但 Table 2 只列作者挑出的 9 組。附錄 Table 17（TriviaQA 全部 27 組，`spot8/peng/all.txt` 第 1099 行前）裡，可接受率比 49.0% 低的還有 4 組：48.2%、47.5%、48.7%、43.0%。
  - 正確率 88.4% 也和另外兩組並列（BGE＋Ensemble＋Cohere＋HyDE、Cohere＋Vector＋Cohere＋Multi-Step）。
  - 「最低」只在 Table 2 的 9 組裡成立。紀錄寫的讀取區段沒有涵蓋 Table 17，所以沒看到。

判定：**有小錯**。正確值：Table 1 是 Ans./Unans./Clar. 準確度 82.0–84.4%、F1 76.7–76.9%；Acc./Unacc. 準確度 81.3–84.0%、F1 83.1–86.0%。另外，「可接受率最低」應限定為「Table 2 列出的組合中最低」。

## 5. thakur-2025-trec-rag-support.md

全文檔：`fulltext/o11-thakur2025.para.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L20 | run-level Kendall τ 0.792–0.892；所有題目×系統只有 0.47–0.671 | 第 157、187、209、221 行（四組 τ：run-level 0.884、0.792、0.822、0.892；all topics/runs 0.47、0.611、0.671、0.539） | 範圍都相符。 |
| 2 | L22 | 獨立人員與 GPT-4o 的 κ 0.29／0.27，與 NIST 人員 −0.03／0.07；Llama-3.1 與 GPT-4o 0.60／0.46 | 第 361 行；Figure 4 數字在第 335–341 行 | 相符。 |
| 3 | L23 | GPT-4o 的錯誤型態（police vs security specialists、沒看句尾而偏向全部支持、主題相近給部分支持）；人沒仔細讀段落、靠記憶 | 第 387 行 | 四點都相符。 |

- 依任務書附帶核對：56% 在第 265 行 "For 56% (13.7% + 11.9% + 30.4%)…on 22 topics"；72.1% 也在第 265 行 "rise to 72.1% (15.9% + 18.7% + 37.5%) on 14 topics"；結論第 395 行寫 56%／72%。
- 寫文章要留意：56% 與 72% 是兩批不同的題目（22 題、14 題），不是同一批題目前後比較。不過作者自己在第 265 行寫了 "human judges are more likely to agree with the GPT-4o judge unless it is an obvious mistake"，所以「看過標籤會被帶著走」的解讀有原文支撐。

判定：**通過**。

## 6. kulkarni-savelieva-2024-golden-dataset.md

全文：Exa 重抓（沒有本機全文檔）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L18 | "in a recent three-week project for prototyping RAG it took between eight and 10 days … 10 question-answer samples in two cases …, and about two weeks for approximately 90 QA pairs …" | Introduction › Problem 第一段 | 逐字相符。 |
| 2 | L21 | 保留出處位置 "This allows you to automatically calculate a retrieval success metric (e.g., topN retrieval rate) … distinguish between issues when 1) … 2) … 3) …" | Creating a "silver" dataset 第二組步驟第 4 點 | 逐字相符。原文寫的是 "context location data (e.g., source document ID)"，不是整段原文。 |
| 3 | L22 | "One may argue … same concern is applicable to a human-generated benchmark."；88 題人工題庫；"it is not scientifically rigorous to extrapolate this result" | Results 節末兩段 | 逐字相符。 |

- 附帶核對：100 題中 66 題通過、7 題有保留、27 題不合格；"Usually about 100 QA samples is considered a reasonable number"；"We recommend generating about 100 questions"。都相符。
- 結構缺項：沒有存全文檔，也沒有「與摘要或常見轉述不一致處」節。內容無誤。

判定：**通過**（缺全文檔與「不一致處」節，見總核對表）。

## 7. anthropic-2024-contextual-retrieval.md（只抽「2026-10-22 order 11 補核對」節）

全文檔：`fulltext/o11-anthropic-contextual-retrieval.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L16 | 小節標題（行 44）、"Sometimes the simplest solution is the best. If your knowledge base is smaller than 200,000 tokens (about 500 pages of material) … no need for RAG or similar methods."（行 45） | 第 44、45 行 | 逐字相符，行號也對。 |
| 2 | L17 | "reducing latency by > 2x and costs by up to 90%"；"However, as your knowledge base grows, you'll need a more scalable solution."（行 46–50） | 第 48 行、第 51 行 | 兩句都逐字相符。"However…" 在第 51 行，紀錄的區段 46–50 少一行，不影響引用。 |
| 3 | L18 | 範圍卡「知識庫小於約 20 萬 token 時可以先不做 RAG」與原文一致；要附「約 500 頁」與「2024 年 Claude 的 context 長度」兩個限定 | 第 45 行 | 第一個限定有原文。第二個是紀錄者的推論：原文沒有說 200K 是 Claude 的 context 長度。這屬於寫作提醒，不算錯。 |

- 附帶核對：第 24–27 行 "Published / Sep 19, 2024 / Team / Engineering"。相符。

判定：**通過**（第 2 項區段終點應是 51）。

## 8. barnett-2024-seven-failure-points.md

全文：抽查另抓的 arXiv v1 PDF（`scratchpad/spot8/dl/barnett.txt`）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L6 | FP1 Missing Content 原句 "when asking a question that cannot be answered from the available documents … the system could be fooled into giving a response."；FP2–FP7 的中文簡稱 | 第 197–230 行（§5） | FP1 原句相符。FP2–FP7 簡稱都對得上小標。FP3 "Not in Context - Consolidation strategy Limitations" 原文是 "Documents with the answer were retrieved from the database but did not make it into the context for generating an answer. This occurs when many documents are returned from the database and a consolidation process takes place to retrieve the answer."（第 209–214 行）。紀錄寫的「沒進 context」正確。 |
| 2 | L11 | §1 與 §7 寫 15,000 documents；§4.3 與 Table 1 寫 4017 份 | 第 65 行（§1 "15,000 documents and 1000 question"）、第 276 行（Conclusion "15,000"）；第 166 行（"We downloaded 4017 open access documents"）、第 180 行（Table 1 "4017"） | 四處都相符。 |
| 3 | L12 | 讀取紀錄：HTML 全文一次取回（約 3.3 萬字元），讀到 References 結束 | — | 沒有存檔，無法核對字數。PDF 轉文字是 43,455 bytes，量級相容。 |

- 附帶核對：摘要兩個結論（第 29–30 行）、Table 2 "Adding meta-data improves retrieval"（第 245 行）、"RAG systems require continuous calibration"（第 250 行）。都相符。

判定：**通過**（缺全文檔，見總核對表）。

## 9. forte-basb-overview.md

全文檔：`fulltext/fix-forte-basb-overview.raw.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L33 | 「Consider this folder a "time capsule" … it separates what was saved prior to today's date from what you'll save from this point on.」（242） | 第 242 行（省略號處是 "that preserves everything you had going on until this precise moment. Now,"） | 逐字相符。 |
| 2 | L37 | 「With some practice, this decision will only take you a few seconds.」（261） | 第 261 行 | 逐字相符。 |
| 3 | L40 | 「I prefer to do this "filing" in one batch about once a week. … process 10-20 items in just a few minutes.」 | 第 263 行 | 逐字相符。 |

判定：**通過**。

## 10. zettelkasten-collectors-fallacy.md

全文檔：`fulltext/fix-collectors-fallacy.raw.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L22 | 成癮機制（26、32、34）：按影印鍵立即得到紙張回饋，像 Skinner 制約鴿子；「we get rid of the fear of losing access to the information」（34） | 第 26 行 "we condition ourselves like Skinner conditioned doves"；第 32 行；第 34 行 | 相符（原文寫 doves）。 |
| 2 | L24 | 「Shorter cycles of research, reading, and knowledge assimilation are better than long ones.」（58–60） | 第 58 行；第 60 行是同主題的結語 | 逐字相符。 |
| 3 | L27 | 「To get started, do research for one hour and no second more. Process the collected material until the stack is empty.」（66） | 第 66 行 | 逐字相符。 |

判定：**通過**。

## 11. gtd-weekly-review-checklist.md

全文檔：`fulltext/fix-gtd-weekly-review-checklist.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L26 | 5. Review Previous Calendar Data（21–22） | 第 21–22 行 | 相符。 |
| 2 | L28 | 7. Review Waiting For List（27–28） | 第 27–28 行 | 相符。 |
| 3 | L30 | 9. Review Any Relevant Checklists —「Use as a trigger for any new actions.」（35–36） | 第 35–36 行 | 逐字相符。 |

- 附帶核對：三段標題（6、17、39 行）、共 11 項、順序都和紀錄一致。

判定：**通過**。

## 12. bergman-2013-jasist-folder-vs-tag.md（只抽「2026-10-22 補讀」節）

全文檔：`fulltext/fix-bergman-2013-jasist-preprint.txt`；姊妹篇 `bergman2013-asist-attitudes.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L102 | Gmail tag-labeling：姊妹篇 36%／64%；接受稿 Results 33%（SD 41%）／64%（SD 42%），t(59)=2.97（491–495）；Discussion 67%／33%（860–861） | 接受稿第 493–495 行；第 860–861 行；姊妹篇第 97 行附近 "only 36% … compared to 64%" | 三處數字都相符，紀錄指出的內部不一致是真的。 |
| 2 | L105 | Table 5（597–606）：53%、16%、27%、3%、0.1%；Discussion 寫「打開 label」12%（866–867） | 第 598–606 行；第 866–867 行 | 相符。 |
| 3 | L121 | 線索（未讀）：Gradovitch et al. 2012 "Tags vs. folders in Gmail – Preliminary findings"（Chais 2012，希伯來文，pp. 63–69） | — | 在接受稿與姊妹篇的全文檔裡都找不到這筆書目（`grep -i "chais\|preliminary"` 無命中），紀錄也沒寫線索從哪裡來。紀錄已標「未讀」，不是引用，所以不算錯。 |

判定：**通過**（第 3 項的出處沒交代，建議補一句線索來源）。

## 13. whittaker-hirschberg-2001-paper-archives.md（只抽「正式版補讀」節）

全文檔：`fulltext/fix-whittaker-hirschberg-2001-tochi.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L144 | F3（T 564–566）"pilers accessed a greater percentage of documents (t(48) = 2.13, p < 0.04)."；替代解釋（T 618–621）"Filers have more data … very similar." | 第 564–566 行；第 618–621 行 | 兩句逐字相符，行號也對。 |
| 2 | L151 | Table II "# reference boxes discarded" 5.8／11.9／6.1（T 682） | 第 682 行 | 相符。 |
| 3 | L154 | "While filers seem to find it easier to access information" 與 F3 方向相反（p.164，T 724–725） | 第 724–725 行 | 逐字相符。 |

判定：**通過**。

---

## 摘要

| # | 紀錄 | 3 項抽樣 | wc 行數／bytes | 區段涵蓋 | 不一致欄 | 判定 |
|---|---|---|---|---|---|---|
| 1 | azure-rag-preparation-phase | 3/3 | 一致 | 終點寫 474 | 有 | 有小錯：已讀區段應為 L1–473 |
| 2 | akkiraju-2024-facts | 3/3 引文相符 | 一致 | 完整 | 有 | 有小錯：行號偏 1–15 行；§6 是 252–270 |
| 3 | kucia-2026-synthetic-vs-authentic | 3/3；29–37、2.3、1.7、49% 另核 | 一致 | 兩檔互補，無實質缺口 | 3 條 | 通過 |
| 4 | peng-2024-uaeval4rag | 2/3 | 一致 | 附錄 Table 17 未讀 | 2 條 | 有小錯：Table 1 欄位標錯；「最低 49%」只在 Table 2 成立 |
| 5 | thakur-2025-trec-rag-support | 3/3；56%／72% 另核 | 一致 | 完整 | 1 條 | 通過 |
| 6 | kulkarni-savelieva-2024-golden-dataset | 3/3（Exa 重抓） | 無全文檔 | 無法核對 | 沒有這一節 | 通過 |
| 7 | anthropic-2024-contextual-retrieval（補核對節） | 3/3 | 一致 | 需要的段落已讀 | 單行 | 通過 |
| 8 | barnett-2024-seven-failure-points | 3/3（另抓 PDF） | 無全文檔 | 無法核對 | 單行 | 通過 |
| 9 | forte-basb-overview | 3/3 | 一致 | 完整 | 用核對表代替 | 通過 |
| 10 | zettelkasten-collectors-fallacy | 3/3 | 一致 | 完整 | 用核對表代替 | 通過 |
| 11 | gtd-weekly-review-checklist | 3/3 | 一致 | 完整 | 用核對表代替 | 通過 |
| 12 | bergman-2013-jasist-folder-vs-tag（補讀節） | 3/3 | 一致 | 完整 | 有 | 通過 |
| 13 | whittaker-hirschberg-2001-paper-archives（正式版節） | 3/3 | 一致 | 完整 | 有 | 通過 |

- 通過 10 份，有小錯 3 份（azure、akkiraju、peng），不通過 0 份。
- 抽中的 39 項：38 項的數字、原句都和原文相符；peng 的 Table 1 欄位標錯 1 項。akkiraju 3 項的引文都對，只有行號不準。
- 錯誤與正確值：
  1. azure：已讀區段 L1–474 → **L1–473**。
  2. akkiraju：§6 的行號 262–289 → **252–270**。其他行號也偏了，例如 140–146 → 125–130、161–166 → 154–155、172–174 → 156、31–37 → 40。
  3. peng：Table 1 → **Ans./Unans./Clar. 準確度 82.0–84.4%、F1 76.7–76.9%；Acc./Unacc. 準確度 81.3–84.0%、F1 83.1–86.0%**。另外，第 3 點的「可接受率最低（49.0%）」只在 Table 2 的 9 組裡成立；附錄 Table 17 的 27 組裡有 4 組更低（最低 43.0%），88.4% 的正確率也和另兩組並列。
- 流程問題（不算紀錄錯誤）：
  - barnett 與 kulkarni 沒有存全文檔，後來的人無法用 wc 與行號回查。建議把這次抓的 `scratchpad/spot8/dl/barnett.txt` 搬進 `fulltext/`，並補存一份 kulkarni 的全文。
  - kulkarni 缺「不一致處」節。
- 寫文章要留意、但紀錄沒錯的地方：
  - Kucia 的 Hit@5 落差是用能對應頁面的 165 題算的。
  - Thakur 的 56% 和 72% 是兩批不同的題目。
  - Anthropic 的「200K 是 2024 年 Claude 的 context 長度」是推論，原文沒寫。

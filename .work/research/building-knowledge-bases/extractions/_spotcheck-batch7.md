# 抽取紀錄抽查：第七批（11 份）

- 抽查日期：2026-10-22
- 抽查者：獨立抽查員（沒參與精讀）
- 範圍：nng-search-log-analysis、nng-internal-search-7-ways、cleverley-burnett-2019-enterprise-search-satisfaction、cleverley-2023-covid-enterprise-search、huurdeman-2018-oria-zero-result、llmstxt-spec、agentsmd-site、chatlatanagulchai-2025-agent-readmes、gloaguen-2026-evaluating-agentsmd、lulla-2026-agentsmd-efficiency、ahrefs-2026-llmstxt-study。任務書說「10 份」，實際列了 11 份，11 份檔名都存在，全部抽查。
- 只讀檔，沒有改動任何抽取紀錄。

## 抽樣方法

- 沿用第六批的方法與腳本，只換檔名清單。腳本：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/spot7/sample.py`（由 spot6/sample.py 複製）。
- 候選範圍：標題含「可引用」「主張」「原句」的 `##` 節。11 份都有「可引用內容」或「可引用結果」節（lulla 的節名是「可引用結果（Table 1，L187–212）」），不需要改取其他節。
- 候選行、排除條件、`random.seed(17)` 後 `random.sample(候選, 3)`，都和第六批相同。
- 核對方式：
  - 用 `grep -n`、`sed -n`、`awk` 回到全文找原處。數字逐個對到原句或原表，並確認分母與條件。
  - gloaguen 依任務書另外核對 v3 的成功率、成本 +20%／+23%、"at most 19%"，並用 Table 2 重算成本比例；v1／v2 摘要用 curl 重抓 export.arxiv.org abs 頁核對。
  - chatlatanagulchai 依任務書另外核對 2,303 與 92%。
  - 下列差異只是文字層的不同，不算不一致：彎直引號、Markdown 強調、PDF 斷行與斷字、雙欄混排。

## 讀取紀錄總核對（`wc -l` / `wc -c`）

| 全文檔 | 紀錄行數 | 實際 `wc -l` | 紀錄 bytes | 實際 `wc -c` | 已讀區段 | 缺口 |
|---|---|---|---|---|---|---|
| o10-nng-slog.txt | 318 | 318 | 19,398 | 19,398 | L1–218 正文；L220–318 掃過 | 無（L219 是空行） |
| o10-nng-internal-search.txt | 190 | 190 | 13,898 | 13,898 | L1–111；L111 起是課程連結 | 無 |
| o10-cleverley-burnett-2019-es-satisfaction.txt | 1,018 | 1,018 | 109,821 | 109,821 | L1–708 正文；L710 起參考文獻掃過 | 無（L710 是 "References"） |
| o10-cleverley-covid-pmc.txt | 427 | 427 | 57,323 | 57,323 | L1–360；之後參考文獻 | 無（L362 是 "References"） |
| o10-huurdeman-2018-oria.txt | 193 | 193 | 53,281 | 53,281 | L1–134；L136 起參考文獻 | 無（L136 是 "## References"） |
| o10-llmstxt.txt／o10-llmstxt-changes.txt | 157／11 | 全部相符 | 12,089／2,109 | 全部相符 | 兩檔整檔 | 無 |
| o10-agentsmd.txt | 270 | 270 | 6,595 | 6,595 | L1–270 | 無 |
| o10-agent-readmes-2511.12884.txt | 2,225 | 2,225 | 164,297 | 164,297 | L1–1847 正文；參考文獻 L1854–2143 查了三筆；附錄 L2144–2225 掃過 | 無（L1848–1853 是致謝，L1855 是 "REFERENCES"） |
| o10-gloaguen-agentsmd-v3.txt | 1,548 | 1,548 | 94,247 | 94,247 | L1–1548 | 無 |
| o10-lulla-2026-agentsmd-efficiency.txt | 327 | 327 | 39,280 | 39,280 | 紀錄寫 L1–L328 | 檔案只有 327 行，L328 不存在（見第 10 節） |
| o10-ahrefs-llmstxt-study.txt | 867 | 867 | 36,705 | 36,705 | L101–501 | 無。L1–100 是網站導覽，L101 是標題；L503 起是作者介紹與推薦文章 |

- 11 份紀錄、12 個全文檔，寫的行數與 bytes 全部和 `wc` 一致。
- 11 份都有列讀取區段，區段都首尾相接。唯一的問題是 lulla 的區段終點寫成 L328，比檔案多一行。
- 「與摘要／範圍卡／常見轉述不一致處」節：列點數依序是 nng-search-log-analysis 3、nng-internal-search-7-ways 1、cleverley-burnett 3、cleverley-2023 1、huurdeman 1、llmstxt-spec 3、agentsmd-site 1、chatlatanagulchai 3、gloaguen 5、lulla 2。
  - ahrefs-2026-llmstxt-study 沒有這一節。它的節依序是書目、性質、可引用結果、沒寫的事、對 order 10 的用法、限制。

---

## 1. nng-search-log-analysis.md

全文檔：`fulltext/o10-nng-slog.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L31 | (4) L106：最長查詢，常是整句，能幫忙理解前段那些單字查詢的意思 | 第 106 行 "Get the list of longest queries. These search terms are often full-sentence searches that can help illuminate some of the one-word terms used in the top queries." | 相符，行號也對。 |
| 2 | L36 | 4 常拼錯的詞與結果很差的詞（L154）— 同義詞＋best bet | 第 154 行是小標 "Terms people misspell frequently and others with very poor results"；第 156 行 "Tune the search engine and bring up appropriate best bets" | 相符。對策在第 156 行，紀錄只標了小標行，不算錯。 |
| 3 | L39 | 7 很多數字查詢（L184–190）；L190 "If you see people searching with phone numbers on an intranet, it could be time to implement a people search." | 第 184 行小標 "Many frequent terms are numbers"；第 190 行 | 逐字相符，行號也對。 |

- 附帶核對：文末推薦書 Rosenfeld, *Search Analytics*（2011）在第 216 行，紀錄寫的對。

判定：**通過**。

## 2. nng-internal-search-7-ways.md

全文檔：`fulltext/o10-nng-internal-search.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L19 | 搜尋建議要人工整理（L53）："an unedited list of common queries from the search logs will not be helpful ... Instead, suggest curated query terms that retrieve useful results." | 第 53 行（省略號處是 "Remember, user queries may be misleading, inappropriate, or contain terms that have no results."） | 逐字相符。 |
| 2 | L20 | 內網最高報酬（L59）：員工姓名建議、"zero-click" 聯絡資訊 | 第 59 行 "one of the most impactful guidelines that has huge ROI is implementing employee suggestions for search"、"Presenting employee contact info as a “zero-click” result" | 相符。 |
| 3 | L21 | 同義詞（L67）："your users likely don't know the carefully crafted lingo … map to existing terminology" | 第 67 行 | 逐字相符（原句後面還有 "that returns appropriate results"，紀錄截在 terminology）。 |

判定：**通過**。

## 3. cleverley-burnett-2019-enterprise-search-satisfaction.md

全文檔：`fulltext/o10-cleverley-burnett-2019-es-satisfaction.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L24 | 詞彙落差例子（L479–484）："I can't find information on flu shots"；改搜 "influenza vaccination" 就找到；歸為資訊因素："the organization needs to embed its domain information into the tool." | 第 479 行（使用者回饋原句）；第 481–484 行 | 逐字相符，分類也對（"This was classed as an information factor"）。 |
| 2 | L26 | 標題（L558，ESM_1）："If you want search to work properly … The Title text has the highest weight (in the ranking score model), some web pages don't have title filled in ... Make site templates require titles." | 第 558 行（長段落）。省略號處是 "so search does not promote web as well as it should." | 逐字相符。 |
| 3 | L30 | 「換 Google 就好」的循環（L289–292、L588）："fixes that fail"；因果圖第一個迴圈；回饋原句 "Employ Google"（L439） | 第 291 行 "repeated cycles of ‘fixes that fail’ changing their Enterprise Search technology"；第 588 行 "Firstly, where dissatisfaction with search may be used to justify the deployment of another Enterprise Search technology."；第 439 行 "Employ Google" | 三處都相符，行號也對。 |

判定：**通過**。

## 4. cleverley-2023-covid-enterprise-search.md

全文檔：`fulltext/o10-cleverley-covid-pmc.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L19 | 組織沒看紀錄（L264、L308）：IT 確認疫情期間沒用過搜尋紀錄；"search logs were not monitored by the organisation (not unusual in the enterprise [32]). This resulted in its inability to 'know' …" | 第 264 行 "It was confirmed in June 2020 by the IT group … that the search log data have not been used by the organisation during the COVID-19 pandemic."；第 308 行 | 逐字相符。 |
| 2 | L20 | 同義詞（L266、L310）：9 種寫法；'corona' 系列 CTR 高於 'covid' 系列；"the vocabulary problem"；"This supports the assertion that use of synonyms may improve results and CTR." | 第 266 行列出 9 種（Coronovirus、corona virus、covid、coronavirus、corona、covid-19、covid19、covix-19、covid 19）；第 310 行 | 數量、例子、原句都相符。 |
| 3 | L21 | 舊內容排在前面（L298）："none were promoted as the 'key ones' and the search engine often returned older results ranked higher than the latest information." | 第 298 行 | 逐字相符。 |

判定：**通過**。

## 5. huurdeman-2018-oria-zero-result.md

全文檔：`fulltext/o10-huurdeman-2018-oria.txt`（行號以段落為單位，紀錄已說明）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L23 | 真的沒有這個資源 10%——"perhaps being the only 'true' zero result searches" | 第 92 行 "In 10% of the cases, a resource is not available at all in Oria … thus perhaps being the only "true" zero result searches." | 數字與原句相符。 |
| 2 | L25 | 欄位或語法錯 2% | 第 92 行 "users searched in the wrong field … or incorrectly used the query syntax (2%)" | 相符。 |
| 3 | L27 | 熱門查詢前 50 名：20% 找不到（第一頁 10 筆內沒有）、22% 判斷不出（L84）；失敗的平均 650 萬筆、成功的約 3.8 萬筆（L86） | 第 84 行（success 定義為前 10 筆；58%／20%／22%）；第 86 行 "for the 10 unsuccessful queries … 6.5 million, while for the 29 successful queries … 38,486" | 數字、分母（50 筆；失敗 10 筆、成功 29 筆）都相符。 |

- 附帶觀察（不算錯）：零結果原因七類合計 22+20+12+10+6+2+20 = 92%，不是 100%。原文第 92 行列出的也只有這幾個百分比，紀錄照實轉錄；剩下 8% 可能在 Figure 4 裡，全文檔只有圖說。寫文章時不要說這七類「加起來是全部」。

判定：**通過**。

## 6. llmstxt-spec.md

全文檔：`fulltext/o10-llmstxt.txt`、`fulltext/o10-llmstxt-changes.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L24 | markdown 版（L33）：page.html.md 或 page.md；L35：rel="alternate" type="text/markdown" 與 rel="describedby"（v2 新增） | 第 33、35 行；Changes 第 7 行說 link relations 是 v2 新增，第 9 行說 page.md 寫法是 v2 才允許 | 相符，「v2 新增」也有 Changes 頁支持。 |
| 2 | L26 | 用途不限軟體（L43）："a business outlining its structure and policies" | 第 43 行 | 逐字相符。 |
| 3 | L29 | 採用程度自述（L23）："thousands of sites publish … and Chrome's Lighthouse audits sites for one"；OpenAI、Anthropic、Gemini；Changes L5 "coding agents use them reliably." | 第 23 行（原句後面還有 "as part of its agentic browsing checks"）；Changes 第 5 行 | 逐字相符，行號也對。 |

判定：**通過**。

## 7. agentsmd-site.md

全文檔：`fulltext/o10-agentsmd.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L19 | 與 README 分工（L16–18）："build steps, tests, and conventions that might clutter a README or aren't relevant to human contributors." | 第 16 行（README 給人看）、第 18 行 | 逐字相符。 |
| 2 | L20 | 建議內容（L206–216）：五項熱門段落，再加 commit／PR 規範、安全陷阱、大型資料集、部署步驟——"anything you'd tell a new teammate belongs here too." | 第 208–212 行（Project overview、Build and test commands、Code style guidelines、Testing instructions、Security considerations）；第 216 行 | 項目與原句都相符。 |
| 3 | L21 | 巢狀（L220）：最近的優先；"the main OpenAI repo has 88 AGENTS.md files." | 第 220 行（原文是 "at time of writing the main OpenAI repo has 88 AGENTS.md files"） | 相符。 |

- 附帶核對：「60k」在第 4 行，Agentic AI Foundation／Linux Foundation 在第 228 行，紀錄寫的對。

判定：**通過**。

## 8. chatlatanagulchai-2025-agent-readmes.md

全文檔：`fulltext/o10-agent-readmes-2511.12884.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L24 | 結構（L535–552）：一個 H1、H2 中位數 6–7、H3 9–12；H5 只出現在 9 份，沒有 H6 | 第 537–552 行：H1 中位數 1.0；H2 "median 6 to 7"；H3 Copilot 12.0、Claude Code 11.0、Codex 9.0；"H5 headers appear in only 9 files, and H6 headers are nonexistent" | 數字都相符。 |
| 2 | L26 | 更新間隔中位數（L708–710）：Copilot 68.0、Claude Code 23.8、Codex 22.3 小時 | 第 708–710 行 | 三個數字都相符。 |
| 3 | L28 | 內容 16 類（Table 3 L841–870；332 份人工標，一致率 80.3%，L809–812）與 16 個百分比 | Table 3 在第 841–870 行；第 800、802 行 "target sample of 332 files"；第 809–811 行 "2,227 label assignments, with 438 disagreements … agreement rate of 80.3%" | 16 個百分比逐一對過全部相符（59.0、24.1、26.8、68.1、70.8、63.0、75.9、38.9、18.4、65.1、5.4、44.6、25.3、14.5、14.8、8.7）。332 與 80.3% 也對。 |

- 任務書指定核對：
  - **2,303**：第 23 行（摘要）"2,303 agent context files from 1,925 repositories"；第 97、1812、1825 行重複出現。第 265–267 行 Table 1 是 922＋694＋687 = 2,303。第 227 行 "8,370 repositories"。全部相符。
  - **92%**：第 702–703 行 "Some form of substantive instruction edit (adding, fixing, or deleting directives) appears in 92% of the sampled commits, while purely non-functional maintenance is the only label in just 8%." 分母是人工抽的 100 個 post-adoption commit（第 701 行）。紀錄寫「92% 是實質改指令，只有 8% 純格式維護」，數字與分母都對。「純格式維護」是 "purely non-functional maintenance" 的轉譯，意思接近，不算錯。
- 附帶核對：多次修改比例 67.0%／59.8%／59.4%（第 669–671 行）、ρ = 0.19（p = 0.05）（第 489 行）、L832 文字 "half of the files contain system overview" 與表格 59.0% 不一致（第 832 行、Table 3），紀錄寫的都對。

判定：**通過**。

## 9. gloaguen-2026-evaluating-agentsmd.md

全文檔：`fulltext/o10-gloaguen-agentsmd-v3.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L25 | 概覽沒用（L413–433）：用第一次碰到 PR 修改檔前的步數衡量，沒有明顯減少；GPT-5.1 mini 反而變多；LLM 檔概覽比例 Sonnet 100%、GPT-5.2 99%、Qwen 95% | 第 413 行小標；第 422–423 行百分比；第 424–433 行指標與 GPT-5.1 mini 原因 | 相符。原文還寫 GPT-5.1 mini 只有 36% 有概覽（第 424 行），紀錄沒列；「LLM 產生的檔幾乎都有概覽」只對三個模型成立。屬簡化，不算錯。 |
| 2 | L27 | 推理 token：LLM 檔使 GPT-5.2 +22%（SWE-bench）、Dev 檔 +20%（L498–505）；"these additional instructions make the task harder"（L499） | 第 499 行 "We hypothesize that these additional instructions make the task harder."；第 503–506 行 22%、20%；更多測試在第 443–447 行與第 961–964 行 | 數字、原句、行號都相符。 |
| 3 | L31 | 沒有其他文件時（L1002–1029）：刪掉所有 .md、範例與 docs/ 後，LLM 檔平均提升 2.7%，且勝過開發者檔；"[31]" 那句原文 | 第 1002–1029 行；"improve performance by 2.7% on average, but also outperform developer-written ones across settings" | 數字與原句都相符。原文另寫這個實驗 "excluding CLAUDE CODE for cost reasons"，紀錄沒寫。屬省略，不算錯，但寫文章時要說只有三個 agent。 |

- 任務書指定核對 v3 數字（第 347–368 行，§4.2）：
  - 成功率：LLM 檔 "reduced by 0.5% and 2% on average on SWE-BENCH and CTXBENCH"，"5 out of 8 settings" 下降，p = 0.87、0.37（第 349–360 行；Table 3）。開發者檔 "+2.4% on average (p = 21%)"，"significantly outperforming LLM-generated ones (p = 3.8%)"，"improve performance for all agents but CLAUDE CODE"（第 364–366 行）。紀錄全部相符。
  - **成本 +20%、+23%**：第 361–362 行 "a significant (p-value < 0.001%) cost increase of 20% and 23% on average, respectively"；步數 +2.45、+3.92。相符。用 Table 2（第 320–332 行）重算 LLM 對 None：SWE-bench 四模型 +16.2%、+34.4%、+22.2%、+8.3%，平均 20.3%；CTXBENCH +15.7%、+50.0%、+11.1%、+15.4%，平均 23.0%。和原文一致。
  - **"at most 19%"**：第 368 行 "on average by 3.34 steps and at most 19%, respectively"。相符。紀錄自算的 Dev 對 None（CTXBENCH）：1.30/1.15 = +13.0%、0.54/0.38 = +42.1%、0.19/0.18 = +5.6%、0.15/0.13 = +15.4%，平均 19.0%。紀錄的 +13%／+42%／+6%／+15% 與「平均約 19%」都對。
  - 補充：GPT-5.2 單一模型是 +42%，所以 "at most 19%" 只能理解成四模型平均，不是每個模型都不超過 19%。紀錄 L24 已寫出各模型數字，沒有誤導。
  - Table 5（第 933–942 行）把 CTXBENCH 誤標為 "PLAN-BENCH"；Sonnet-4.5 None 73.2%、LLM 65.2%、Dev 70.3%。紀錄寫的都對。
  - 摘要第 33 行 "increasing inference cost by over 20% on average"、第 87 行 "increases costs by over 20%"；正文第 368 行 Dev 是 "at most 19%"。紀錄說摘要與正文不一致，是對的。
  - v1／v2 摘要：重抓 export.arxiv.org，v1 是 "context files tend to reduce task success rates compared to providing no repository context, while also increasing inference cost by over 20%."，v2 是 "does not generally improve task success rates, while increasing inference cost by over 20% on average."。紀錄說 v1 寫「降低」、v2 起改成「沒有普遍提升」，相符。

判定：**通過**。

## 10. lulla-2026-agentsmd-efficiency.md

全文檔：`fulltext/o10-lulla-2026-agentsmd-efficiency.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L20 | 輸出 token：平均 5,744.81 → 4,591.46（−20.08%）；中位數 2,925 → 2,440（−16.58%）；顯著 | 第 203–204 行（Table 1，"Output Tokens∗" 有星號，表注 Wilcoxon p < 0.05） | 六個數字都相符。 |
| 2 | L22 | L228–232："AGENTS.md primarily reduces token usage in a small number of very high-cost runs" | 第 228–232 行（右欄混排） | 逐字相符，行號也對。 |
| 3 | L23 | 正確性只抽 50 個 PR，確認 "non-empty, non-trivial code changes"（L180–218）；"this sanity check does not constitute a full correctness evaluation" | 第 180–185 行 "we randomly sampled 50 PR tasks … non-empty, non-trivial code changes"；第 215 行 | 數字與兩句原文都相符。 |

- 附帶核對：輸入 token 中位數 116,609 → 120,587（+3.41%）、總 token 中位數 223,707 → 226,582（+1.29%），表格 Δ% 欄印成 −3.41%、−1.29%（表示增加）。紀錄寫「反而 +3.41%」「+1.29%」，方向正確。
- 抽樣以外發現的問題：讀取紀錄寫「全文 7 頁 L1–L328」，但全文檔只有 327 行（`wc -l` = 327，書目那行也寫 327 行）。

判定：**有小錯**。正確值：已讀區段是 L1–L327。

## 11. ahrefs-2026-llmstxt-study.md

全文檔：`fulltext/o10-ahrefs-llmstxt-study.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L20 | 誰在讀（L235–301；表 L253–279）：96% 機器人；SEO 稽核 21.7%；四類 AI 合計 19.5%（agents 10.5%、訓練 5.3%、助理 2.5%、檢索 1.1%）；研究、GEO、掃描器約 12%；Lighthouse 約千分之一（L291） | 第 237 行 96%；第 256–278 行表格；第 297 行 19.5%；第 301 行 "An industry auditing it (12.1%)"（GEO 5.8＋掃描器 3.6＋研究 2.7 = 12.1）；第 291 行 "It made just 22 requests—roughly 1 in 1,000" | 所有百分比都相符，加總也對。 |
| 2 | L21 | Claude-Code 是除 statespace-indexer 與 GPTBot 外最常抓的 AI 使用者代理（L350） | 第 350 行 "Aside from statespace-indexer and GPTBot, Claude-Code (Anthropic's coding agent), out-fetched every AI retrieval bot, every AI assistant, and every AI training crawler." | 大致相符。原文只說 Claude-Code 勝過檢索、助理、訓練三類的每個機器人，沒說它勝過 AI agents 類裡除 statespace-indexer 以外的所有代理（例如 IbouBot）。紀錄寫成「最常抓的 AI 使用者代理」稍微擴大，屬簡化，不算錯。 |
| 3 | L22 | AI 不會主動找（L420–428）：對不存在的 llms.txt 的請求，AI 機器人占 0；"AI tools fetch llms.txt when a link, an index, or a user instruction tells them it exists." | 第 418 行小標 "Zero AI bots “go looking” for llms.txt files that don't exist"；第 422 行 "the AI bot share of those 404s was zero"；第 428 行 | 逐字相符，行號也對。 |

- 結構上的缺項：這份紀錄沒有「與摘要或常見轉述不一致處」節。內容上，L13 已寫明廠商研究、樣本偏 SEO 客戶、採用率是上限，標題「97% … Never Get Read」與內文「只量請求」的落差也寫在 L24。所以不影響引用，但格式和其他 10 份不一致。

判定：**通過**（缺「不一致處」節，見總核對表）。

---

## 摘要

| # | 紀錄 | 3 項抽樣 | wc 行數／bytes | 區段涵蓋 | 不一致欄 | 判定 |
|---|---|---|---|---|---|---|
| 1 | nng-search-log-analysis | 3/3 | 一致 | 完整 | 3 條 | 通過 |
| 2 | nng-internal-search-7-ways | 3/3 | 一致 | 完整 | 1 條 | 通過 |
| 3 | cleverley-burnett-2019-enterprise-search-satisfaction | 3/3 | 一致 | 完整 | 3 條 | 通過 |
| 4 | cleverley-2023-covid-enterprise-search | 3/3 | 一致 | 完整 | 1 條 | 通過 |
| 5 | huurdeman-2018-oria-zero-result | 3/3 | 一致 | 完整 | 1 條 | 通過 |
| 6 | llmstxt-spec | 3/3 | 一致（2 檔） | 完整 | 3 條 | 通過 |
| 7 | agentsmd-site | 3/3 | 一致 | 完整 | 1 條 | 通過 |
| 8 | chatlatanagulchai-2025-agent-readmes | 3/3；2,303 與 92% 另核 | 一致 | 完整 | 3 條 | 通過 |
| 9 | gloaguen-2026-evaluating-agentsmd | 3/3；v3 成功率、+20%／+23%、"at most 19%" 另核 | 一致 | 完整 | 5 條 | 通過 |
| 10 | lulla-2026-agentsmd-efficiency | 3/3 | 一致 | 區段終點寫成 L328 | 2 條 | 有小錯：檔案只有 327 行，已讀區段應為 L1–L327 |
| 11 | ahrefs-2026-llmstxt-study | 3/3 | 一致 | 完整 | 沒有這一節 | 通過 |

- 通過 10 份，有小錯 1 份（lulla），不通過 0 份。
- 抽中的 33 項，數字、分母、原句、行號全部和原文相符。lulla 的小錯是抽樣以外發現的讀取區段描述錯誤，不影響任何引文。
- 任務書指定的數字都核對過，全部正確：
  - gloaguen v3：LLM 檔成功率 −0.5%／−2%、開發者檔 +2.4%（p = 0.21）、成本 +20%／+23%（第 361–362 行）、"at most 19%"（第 368 行）。用 Table 2 重算也一致。
  - chatlatanagulchai：2,303 份 = 922＋694＋687，來自 1,925 個 repo；92% 的分母是 100 個抽樣 commit。
- 不算錯、但寫文章時要留意的簡化：
  - huurdeman 的零結果七類加起來是 92%，不是 100%。
  - gloaguen 的「LLM 檔幾乎都有概覽」漏了 GPT-5.1 mini 只有 36%；「刪掉所有文件」實驗沒有跑 Claude Code。
  - gloaguen 的 "at most 19%" 是四模型平均，GPT-5.2 單一模型是 +42%。
  - ahrefs 的 Claude-Code 排名，原文只說它勝過檢索、助理、訓練三類，沒說它勝過 agents 類的其他代理。
- 建議：
  - lulla 的讀取紀錄把 L1–L328 改成 L1–L327。
  - ahrefs 補一節「與摘要或常見轉述不一致處」，至少寫出標題的 "Never Get Read" 量的其實是「零請求」。

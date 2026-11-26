# 抽取紀錄抽查：第六批（16 份）

- 抽查日期：2026-10-22
- 抽查者：獨立抽查員（沒參與精讀）
- 範圍：nygard-2011-adr、google-docguide、adr-github-madr、santana-2026-icsa-adr-oss、buchgeher-2023-adr-github-msr、nogueira-2026-adr-template-experiment、miccio-2026-adr-content-mining、gao-2025-readme-install-template、writethedocs-docs-as-code、notion-verified-pages、kcs-v6-reuse-is-review、gitlab-dri-handbook-first、tan-2024-outdated-code-references、torkki-2024-documentation-debt-action-research、silva-2023-ericsson-documentation-debt、counterevidence-verification-ritual。檔名都和任務書一致。
- 只讀檔，沒有改動任何抽取紀錄。

## 抽樣方法

- 沿用第五批的方法與腳本，只換檔名清單。腳本：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/spot6/sample.py`（由 spot5/sample.py 複製）。
- 候選範圍：
  - 標題含「可引用」「主張」「原句」的 `##` 節，以及它底下的 `###` 子節。14 份適用（santana 的節名是「摘要層級可引用內容」，也算）。
  - notion-verified-pages 沒有這幾節，改取「Notion：功能怎麼運作」「Notion：官方建議怎麼用」「Confluence 對照」「Confluence 留言串」四節。
  - counterevidence-verification-ritual 沒有這幾節，改取 A、B、C 三個來源節。
- 候選行、排除條件、`random.seed(17)` 後 `random.sample(候選, 3)`，都和第五批相同。
- 核對方式：
  - 用 `grep -n`、`sed -n` 回到全文找原處。數字逐個對到原句或原表，並確認分母與條件。
  - santana 沒有全文檔（read_status=abstract）。改成重抓兩版摘要來核對：摘要 B 用 Semantic Scholar Graph API（DOI 查詢，HTTP 200）；摘要 A 用 firecrawl search 取得的 conf.researchr.org 會議頁內文。
  - 下列差異只是文字層的不同，不算不一致：彎直引號、Markdown 強調、PDF 斷行與斷字。

## 讀取紀錄總核對（`wc -l` / `wc -c`）

| 全文檔 | 紀錄行數 | 實際 `wc -l` | 紀錄 bytes | 實際 `wc -c` | 已讀區段 | 缺口 |
|---|---|---|---|---|---|---|
| o8-nygard.txt | 204 | 204 | 8,750 | 8,750 | 1–204 | 無 |
| o8-gdoc-bp／phil／readme／style.txt | 88／51／44／638 | 全部相符 | 5,881／2,599／1,934／23,867 | 全部相符 | 前三檔整檔；style 1–140 逐行，140–638 去空行後讀 | 無 |
| o8-adr-home／adr-templates／madr.txt | 33／68／228 | 全部相符 | 3,607／2,994／12,939 | 全部相符 | 各檔整檔 | 無 |
| o8-madr-adr-template-minimal／bare-minimal.md | 23／16 | 全部相符 | 1,029／179 | 全部相符 | 整檔 | 無 |
| （santana，無全文檔） | — | — | — | — | 只有兩版摘要 | 全文讀不到，紀錄已列出 10 個管道與失敗原因 |
| o8-buchgeher-2023.txt | 380 | 380 | 71,393 | 71,393 | 109–333 | 1–108 是 IEEE 網站外框，334–380 是頁尾，沒有缺口。但紀錄說檔內有參考文獻，實際沒有（見第 5 節） |
| o8-adr-templates-2026.txt | 1,132 | 1,132 | 62,098 | 62,098 | 1–450、450–1132 | 無 |
| o8-adr-textmining-2026.txt | 909 | 909 | 50,939 | 50,939 | 1–909 | 無 |
| o8-gao-2025-readme-install.txt | 4,439 | 4,439 | 148,495 | 148,495 | 1–832 逐段、832–3156 略讀、3157–4142 逐段、參考文獻掃過 | §IV 的逐項例子是略讀，紀錄已說明 |
| o9-wtd.txt | 99 | 99 | 3,941 | 3,941 | 1–99 | 無 |
| o9-notion／notion-guide／cf-verified-ann／cf-status／cf-owner.txt | 261／227／340／103／83 | 全部相符 | 6,868／9,451／14,363／3,717／2,519 | 全部相符 | 只寫「全文」，沒列區段 | 無法逐段核對。Guide 的折疊段另從 HTML 抽出，紀錄已說明 |
| o9-kcs041／kcs030／kcs-t11／kcs-p4／kcs-t41／t42／t43／t52／t55.txt | 243／235／202／194／216／241／184／333／192 | 全部相符 | 11,188／8,951／8,617／5,918／9,197／14,240／5,471／26,450／7,703 | 全部相符 | 只寫「9 頁正文全讀」，正文約從行 130 起 | 無法逐段核對 |
| gl-handbook_about_handbook-usage_.txt／o9-glusage.txt／o9-gldri.txt | 333／337／89 | 全部相符 | 30,343／30,410／7,087 | 全部相符 | DRI 頁全文；Usage 頁在 gitlab-handbook-structure.md 讀過，這次重讀相關行 | 沒列區段。Usage 頁的全讀已在第五批核過 |
| o9-tan2024-emse.md／o9-tan2024.txt | 549／1,081 | 全部相符 | 58,231／58,102 | 全部相符 | 只寫「兩版逐段比對」 | 沒列區段 |
| o9-torkki.txt | 1,075 | 1,075 | 84,769 | 84,769 | 只寫「全文；參考文獻略讀」 | 沒列區段 |
| o9-silva.txt | 1,121 | 1,121 | 57,774 | 57,774 | 只寫「逐段讀」 | 沒列區段 |
| o9-cf-verified-ann.txt／o9-codeorg-pr71072.md／o9-hovh.txt | 340／99／242 | 全部相符 | 14,363／6,156／11,937 | 全部相符 | 只寫「三個來源皆全文讀」 | 沒列區段。hovh 的行號是 `awk 'NF'` 去空行後的行號，紀錄已說明，抽查照這個算法也對得上 |

- 15 份有全文檔的紀錄，寫的行數與 bytes 全部和 `wc` 一致（共 41 個檔）。
- 有逐段列出讀取區段的 9 份（nygard、google、madr、buchgeher、nogueira、miccio、gao、wtd，以及 santana 的管道清單），區段都首尾相接。
- 另外 7 份（notion、kcs、gitlab-dri、tan、torkki、silva、counterevidence）只寫「全文讀」，沒列行號區段，所以無法核對有沒有缺口。抽查的 21 項都在全文檔裡找得到，沒有發現漏讀的跡象。
- 「與摘要／常見轉述不一致處」節：15 份都不是空的。列點數依序是 nygard 4、google 3、madr 3、santana 4、buchgeher 5、nogueira 4、miccio 3、gao 3、wtd 2、notion 3、kcs 4、gitlab-dri 4、tan 4、torkki 2、silva 2。
  - counterevidence-verification-ritual 是彙整檔，沒有這一節。它改成在每個來源底下寫「限制」，最後一節是「綜合判斷」。

---

## 1. nygard-2011-adr.md

全文檔：`fulltext/o8-nygard.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L31 | 「If a decision is reversed, we will keep the old one around, but mark it as superseded. (It's still relevant …)」（紀錄標行 47） | 第 47 行 | 逐字相符，行號也對。 |
| 2 | L34 | Context：技術、政治、社會、專案在地；"value-neutral. It is simply describing facts."（行 53） | 第 53 行 | 逐字相符。 |
| 3 | L39 | 「The whole document should be one or two pages long. We will write each ADR as if it is a conversation with a future developer.」（行 61） | 第 61 行 | 逐字相符。 |

- 附帶核對：書目寫「本文在行 9–91」、「CC0（行 93–94）」，都和原檔一致。

判定：**通過**。

## 2. google-docguide.md

全文檔：`fulltext/o8-gdoc-bp.txt`、`fulltext/o8-gdoc-style.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L37 | 4. 不重複（bp 行 84–86） | bp 第 84 行是小標 "Duplication is Evil"，第 86 行是 "Do not write your own guide to a common Google technology or process. Link to it instead." | 相符，行號範圍也對。 |
| 2 | L46 | 8. 文件版面骨架（style 行 94–120 "Document layout"） | style 第 94 行是 "Document layout"。第 98–110 行是骨架，第 112–120 行是逐項說明（第 114 行 "revision history generally suffices"，第 116 行 "complete newbie"） | 相符，行號也對。 |
| 3 | L50 | "Set lower standards for each CL, so that more such CLs can happen."（style 行 66）；"When reasonable, LGTM immediately"（行 70）；避免 "You should also…" | style 第 66、70、72 行 | 逐字相符。 |

判定：**通過**。

## 3. adr-github-madr.md

全文檔：`fulltext/o8-madr.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L35 | MADR 4.0.0 結構（madr 行 133–212，完整開發版） | 第 131 行 "The current development version renders as follows:"，模板從第 133 行到第 212 行 | 相符。 |
| 2 | L37 | 各章節順序與 optional 標記；Chosen option 句型；Confirmation 的 "although we classify this element as optional, it is included in many ADRs"（行 182）；More Information 含何時重新檢視（行 212） | 第 150–212 行。Decision Drivers、Consequences、Confirmation、Pros and Cons、More Information 前面都有 "This is an optional element"。第 170 行是 Chosen option 句型。第 182 行有 ArchUnit 與那句原文。第 212 行有 "if/when it should be re-visited" | 都相符。 |
| 3 | L45 | 「Large projects may accumulate hundreds of decision records … MADR does not enforce any repository or directory organization structure.」；子目錄分類後編號只在類別內唯一（行 125） | 第 110 行、第 125 行 | 逐字相符，行號也對。 |

判定：**通過**。

## 4. santana-2026-icsa-adr-oss.md

全文檔：無（read_status=abstract）。這次重抓兩版摘要來核對。

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L27 | 摘要 B：「ADR-related variables exhibit predominantly small correlations with code quality and productivity metrics, suggesting that ADR adoption is associated with, at most, modest observable effects at scale.」 | Semantic Scholar Graph API 回傳的 abstract | 逐字相符。 |
| 2 | L28 | 摘要 A："their predominantly small correlations with project quality metrics such as code smells and issue resolution time" | conf.researchr.org 會議頁的 Abstract | 逐字相符。 |
| 3 | L30 | 摘要 A：「of a total of 5,800 ADRs, approximately 3,674 (about 63%) were opened directly with a status of "accepted" or equivalent, thereby bypassing …」 | 同上 | 數字與原句都相符。3,674/5,800 = 63.3%，和 "about 63%" 一致。 |

- 附帶核對：摘要 A 確實沒有 "5800 ADRs" 出現在資料集那一句（只寫 "921 GitHub repositories from earlier ADR studies"），摘要 B 才有。紀錄說兩版不同，是對的。

判定：**通過**。

## 5. buchgeher-2023-adr-github-msr.md

全文檔：`fulltext/o8-buchgeher-2023.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L29 | 「It is likely that in these repositories capturing ADD using ADRs has been tried out, but has not been adopted systematically over time.」（行 264） | 第 264 行 | 逐字相符。 |
| 2 | L42 | 「this template is used as default template by the ADR Tools」（行 277） | 第 277 行（原文 "_ADR Tools_" 是 Markdown 斜體） | 相符。 |
| 3 | L43 | 有 repo 因 MADR 太冗長而自訂模板（行 278）；「complex ADR templates with many sections (e.g., ... Tyree and Akerman) play no role」（行 279） | 第 278 行 "the MADR template was criticized for its verbosity"、第 279 行 | 都相符。 |

- 抽樣以外發現的問題：
  - 書目寫「本文在行 109–316，之後是參考文獻」，讀取紀錄寫「含 Section I–VII 與參考文獻」。
  - 實際上，第 317–332 行是 IEEE 網站的頁籤與推薦文章，第 333–334 行寫 "References / References is not available for this document."，之後到第 380 行是網站頁尾。
  - 也就是全文檔裡沒有參考文獻清單。這不影響任何引文與數字，但描述不對。

判定：**有小錯**。正確值：第 317–380 行是 IEEE 網站外框。第 334 行寫 "References is not available for this document."，所以全文檔沒有參考文獻清單。

## 6. nogueira-2026-adr-template-experiment.md

全文檔：`fulltext/o8-adr-templates-2026.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L30 | 中位數 Overall：Nygard 約 0.8、MADR 約 0.7（行 798–799） | 第 798–799 行 "higher median Overall Score (approximately 0.8) compared to MADR (approximately 0.7)" | 相符。 |
| 2 | L33 | Finding 2：Nygard「straight-to-the-point structure promotes documentation objectivity and clarity」（行 855–856） | 第 855–856 行 | 逐字相符。 |
| 3 | L35 | Finding 4：大型專案或對主管報告選 MADR，小專案選 Nygard（行 850–853） | 第 850–853 行（Finding 4 方框：large-scale／small-scale）；「對主管報告」出自第 894–896 行 P18 "high-stakes presentations to leadership" | 內容相符。Finding 4 方框裡只寫 "audience profile"，「主管」這個例子在 §4.2.3 內文，行號只標了方框。這是合併轉述，不算錯。 |

判定：**通過**。

## 7. miccio-2026-adr-content-mining.md

全文檔：`fulltext/o8-adr-textmining-2026.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L30 | 摘要：「alternatives, decisions drivers, and some quality concerns remain under-documented」（行 20–21） | 第 20–21 行 | 逐字相符（原文就寫 "decisions drivers"）。 |
| 2 | L32 | 「ADRs from open-source repositories should not necessarily be treated as exemplary documentation artifacts. Teams adopting ADR practices may unintentionally inherit … rationale and trade-offs」（行 786–788） | 第 786–788 行 | 逐字相符。 |
| 3 | L35 | 時間壓力、輕量習慣、或「理由已在 code review／issue 裡」——「Although these explanations remain hypothetical」（行 798） | 第 795–798 行 | 三個原因和原句都相符。 |

判定：**通過**。

## 8. gao-2025-readme-install-template.md

全文檔：`fulltext/o8-gao-2025-readme-install.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L34 | 十個面向中 8 個 p<0.05。增幅最大：structure +0.80（d=0.82）、understandability +0.53（d=0.62）、conciseness +0.53（d=0.60）（行 3567–3569、3640–3649） | 增幅在第 3567–3569 行；d 值在第 3640–3649 行附近的 Fig. 11（Structure p=0.0001 d=0.82、Understandability p=0.0003 d=0.62、Conciseness p=0.0047 d=0.60）；"eight out of ten dimensions … p-value below 0.05" 在第 3575–3576 行 | 數字都相符。「8/10」那句在第 3575–3576 行，不在這行列出的行號裡，但在小節標的範圍 3564–3587 之內。不算錯。 |
| 2 | L36 | Krippendorff's α = 0.34（行 3559） | 第 3558–3559 行 "reached 0.34 for Krippendorff's alpha" | 相符。 |
| 3 | L39 | 「Some sections that are important for us ... are missing」（行 3787–3790）；pyvespa "some also are not correct/ helpful"、"do a human review before creating a PR"（行 3778–3780） | 第 3787–3790 行（3dcitydb/importer-exporter）、第 3777–3780 行（vespa-engine/pyvespa） | 逐字相符，行號也對。 |

判定：**通過**。

## 9. writethedocs-docs-as-code.md

全文檔：`fulltext/o9-wtd.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L23 | "Writers integrate better with development teams" | 第 23 行 | 逐字相符。 |
| 2 | L24 | "Developers will often write a first draft of documentation" | 第 25 行 | 逐字相符。紀錄這兩點沒標行號，小節標的是「行 21–27」，這行在範圍內。 |
| 3 | L25 | 合併閘門（行 27）："You can block merging of new features if they don't include documentation, which incentivizes developers to write about features while they are fresh" | 第 27 行 | 逐字相符，行號也對。 |

- 附帶核對：作者行在第 3–5 行；最晚的演講是 2022 NA，在第 79–81 行。紀錄寫的都對。

判定：**通過**。

## 10. notion-verified-pages.md

全文檔：`fulltext/o9-notion-guide.txt`、`fulltext/o9-cf-verified-ann.txt`、`fulltext/o9-cf-owner.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L42 | 週期依內容變動速度（行 155）："review campaign assets monthly as products change, while brand guidelines may only need a quarterly check." | Guide 第 155 行 | 逐字相符。 |
| 2 | L49 | Verified 是內容狀態的一種（公告行 23）："We leveraged the already existing content status functionality to implement content verification." | 公告第 23 行 | 逐字相符。 |
| 3 | L52 | owner 轉移（owner 頁行 13–15、37、49）：建立者預設是 owner；可轉給「point person」；新 owner 要有 space 存取與編輯權；space／product admin 也能轉；沒有群組 owner | owner 頁第 13、15、37、49 行；全頁 83 行都沒有 group 或 team owner | 四點都相符。 |

判定：**通過**（讀取區段沒列，見總核對表）。

## 11. kcs-v6-reuse-is-review.md

全文檔：`fulltext/o9-kcs-t41.txt`、`fulltext/o9-kcs-t43.txt`、`fulltext/o9-kcs-t52.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L47 | 結語（t41 行 165–167）："The best people to create and review knowledge are the people who use it everyday." / "Reuse is review reinforces this concept." | t41 第 165、167 行 | 逐字相符。 |
| 2 | L54 | 誰能改什麼靠授權等級（t43 行 133）："Not everybody gets to do everything." License 依能力取得 | t43 第 133 行。同一行後面寫 "Knowledge workers who show an understanding of … earn the right to do more in the system." | 相符。 |
| 3 | L60 | WIP 可刪（t52 行 154、200）：問題未解決且工單關閉、文章沒價值時 "it should be deleted" | t52 第 154 行 "If the request is no longer being worked and there is nothing of value in the article, then it should be deleted"；第 200 行 "the WIP should either be deleted …" | 相符。 |

判定：**通過**（讀取區段沒列，見總核對表）。

## 12. gitlab-dri-handbook-first.md

全文檔：`fulltext/gl-handbook_about_handbook-usage_.txt`（Usage）、`fulltext/o9-gldri.txt`（DRI）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L38 | 每個部門都有責任（行 202）："It is each department and team member's responsibility to ensure the handbooks ... stay current." | Usage 第 202 行（省略號處是 "(public handbook, and internal handbook)"） | 逐字相符。 |
| 2 | L45 | CODEOWNERS（Usage 行 94）；CMO staff、CMO、CEO 各自核准什麼（行 96） | Usage 第 94 行、第 96 行 | 相符。原文第 96 行寫的是 "Chief of Staff to the CEO/CEO approves any merge request that has cross-company impact"，紀錄只寫 CEO，漏了 Chief of Staff。屬簡化，不算錯。 |
| 3 | L48 | DRI 頁行 33："DRIs are most often assigned at the task-level. For example, … the Product Manager is the DRI for the prioritization and the Engineering Manager is the DRI for delivery." | DRI 第 33 行 | 逐字相符。 |

判定：**通過**（讀取區段沒列，見總核對表）。

## 13. tan-2024-outdated-code-references.md

全文檔：`fulltext/o9-tan2024.txt`（A）、`fulltext/o9-tan2024-emse.md`（E）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L33 | google 分析 1,907 個：29.7%（567/1,907）專案、30.6%（925/3,018）文件、7.1%（4,176/58,805）引用曾經過時 | A 第 581–582 行；E 第 353 行也印 1907 與 7.1% | 6 個數字、3 個分母都相符。 |
| 2 | L46 | 「默默過時」（A 行 67–70）："Unlike source code, software documentation gets outdated 'silently', i.e., there are no crashes or error messages …" | A 第 68–70 行 | 逐字相符（原文是彎引號）。 |
| 3 | L47 | 摘要："developers are unaware of when their source code modifications render the documentation obsolete." | A 第 25–26 行（摘要）；E 第 21 行 | 逐字相符。 |

判定：**通過**（讀取區段沒列，見總核對表）。

## 14. torkki-2024-documentation-debt-action-research.md

全文檔：`fulltext/o9-torkki.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L26 | owner 的實際工作是催（行 576–577）："owners sometimes had to remind contributors of the documentation tasks" | 第 576–577 行 | 逐字相符。 |
| 2 | L29 | 「夠好」無法事先定（行 758–759、770–783）：開發主管 "It is easy to say when documentation is lacking but much harder to determine when it is actually ready."；存取權限模型文件 "did not support this work at all" | 第 757–759 行（說話者是 "the development lead"）；第 772–779 行（"the most experienced developer"、"did not support this work at all" 在第 779 行） | 原句、說話者、例子都相符。 |
| 3 | L31 | 時間壓力讓量勝過質（行 799–803）："This resulted in giving precedence to documentation volume over quality or significance." | 第 799–800 行 | 逐字相符。 |

判定：**通過**（讀取區段沒列，見總核對表）。

## 15. silva-2023-ericsson-documentation-debt.md

全文檔：`fulltext/o9-silva.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L28 | 根因（行 616–633）：命令由開發者手動執行後轉給文件團隊，"mistakes ... can propagate unnoticed"；"the lack of automated documentation testing makes the information outdated very quickly, since detecting documentation discrepancies is a manual process." | 第 616–630 行（design criterion 1 "Robust information source"） | 逐字相符（省略號處是 "(wrong assumptions on environment setup, typos)"）。 |
| 2 | L32 | 摘要："In practice, documentation debt can easily go undetected since a large share of resources and focus is dedicated to deliver high-quality software." | 第 43–45 行附近（摘要） | 相符。 |
| 3 | L33 | 摘要："both based on defining a single and robust information source for documentation." | 第 50 行（摘要） | 相符。 |

判定：**通過**（讀取區段沒列，見總核對表）。

## 16. counterevidence-verification-ritual.md

全文檔：`fulltext/o9-codeorg-pr71072.md`、`fulltext/o9-hovh.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L26 | B 的性質：2026 年 542 個人類作者已合併 PR；Claude Code 用 GraphQL 抓資料、Python 腳本分類 checklist；section 填寫率是讀「a broad sample」估的（行 91–95） | 第 9 行（542 merged PRs by human authors in 2026）；第 89–95 行（第 91 行 GraphQL、第 93 行 Python script、第 95 行 "a broad sample"） | 相符。另外，第 91 行寫的抓取總數是 798，排除自動化帳號後才是 542，紀錄寫 542 是對的。 |
| 2 | L31 | 和 order 9 的關係：軟性閘門被大規模跳過；不是文件專屬的檢查；是不擋合併的清單 | 第 13 行：checklist 內容是 "test coverage, privacy documentation, and security review"；第 15–18 行：PR 都已合併，但勾選率只有 0.6% | 這行是紀錄自己的推論，原文支持得住，「不是文件專屬」也和第 13 行一致。 |
| 3 | L39 | C 的 Table I（行 99–120；行 149–157）：httpd 14,768 vs 5,417；GIMP 22,317 vs 21,467；GTK 50,147 vs 17,720；原句 "documentation updates were not continuously linked to code churns over time, even when new features were introduced to the codebase." | 用 `awk 'NF'` 去空行後的第 99–120 行（Table I：Code 欄 14,768／22,317／50,147，Mix 欄 5,417／21,467／17,720）；第 149–156 行 | 6 個數字都在對的欄位，原句也逐字相符。行號照紀錄說的去空行算法算，對得上。 |

判定：**通過**（讀取區段沒列，也沒有「不一致處」節，因為它是彙整檔，見總核對表）。

---

## 摘要

| # | 紀錄 | 3 項抽樣 | wc 行數／bytes | 區段涵蓋 | 不一致欄 | 判定 |
|---|---|---|---|---|---|---|
| 1 | nygard-2011-adr | 3/3 | 一致 | 完整 | 4 條 | 通過 |
| 2 | google-docguide | 3/3 | 一致（4 檔） | 完整 | 3 條 | 通過 |
| 3 | adr-github-madr | 3/3 | 一致（5 檔） | 完整 | 3 條 | 通過 |
| 4 | santana-2026-icsa-adr-oss | 3/3（對兩版摘要） | 無全文檔 | 只有摘要，管道已列 | 4 條 | 通過 |
| 5 | buchgeher-2023-adr-github-msr | 3/3 | 一致 | 正文完整 | 5 條 | 有小錯：說檔內有參考文獻，實際沒有（第 334 行 "References is not available for this document."；第 317–380 行是網站外框） |
| 6 | nogueira-2026-adr-template-experiment | 3/3 | 一致 | 完整 | 4 條 | 通過 |
| 7 | miccio-2026-adr-content-mining | 3/3 | 一致 | 完整 | 3 條 | 通過 |
| 8 | gao-2025-readme-install-template | 3/3 | 一致 | §IV 略讀（已說明） | 3 條 | 通過 |
| 9 | writethedocs-docs-as-code | 3/3 | 一致 | 完整 | 2 條 | 通過 |
| 10 | notion-verified-pages | 3/3 | 一致（5 檔） | 沒列區段 | 3 條 | 通過 |
| 11 | kcs-v6-reuse-is-review | 3/3 | 一致（9 檔） | 沒列區段 | 4 條 | 通過 |
| 12 | gitlab-dri-handbook-first | 3/3 | 一致（3 檔） | 沒列區段 | 4 條 | 通過 |
| 13 | tan-2024-outdated-code-references | 3/3 | 一致（2 檔） | 沒列區段 | 4 條 | 通過 |
| 14 | torkki-2024-documentation-debt-action-research | 3/3 | 一致 | 沒列區段 | 2 條 | 通過 |
| 15 | silva-2023-ericsson-documentation-debt | 3/3 | 一致 | 沒列區段 | 2 條 | 通過 |
| 16 | counterevidence-verification-ritual | 3/3 | 一致（3 檔） | 沒列區段 | 彙整檔，沒有這一節 | 通過 |

- 通過 15 份，有小錯 1 份（buchgeher），不通過 0 份。
- 抽中的 48 項，數字、分母、原句、行號全部和原文相符。buchgeher 的小錯是抽樣以外發現的全文檔描述錯誤，不影響任何引文。
- 兩處不算錯、但寫文章時要留意的簡化：
  - nogueira 的 Finding 4 把方框結論和 §4.2.3 的「對主管報告」例子合在一起寫，行號只標了方框（第 850–853 行）；例子在第 894–896 行。
  - gitlab-dri 的 L45 把 "Chief of Staff to the CEO/CEO" 簡化成 CEO。
- 建議：
  - buchgeher 的書目與讀取紀錄改成「第 317–380 行是 IEEE 網站外框，抓到的頁面沒有參考文獻清單」。
  - notion、kcs、gitlab-dri、tan、torkki、silva、counterevidence 這 7 份補上逐段讀取區段，下一輪才核得了缺口。

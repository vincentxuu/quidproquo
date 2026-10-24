# 抽取紀錄：Aghajani et al. 2020, Software Documentation: The Practitioners' Perspective

read_status=full（共同作者 Csaba Nagy 個人頁的 preprint PDF，12 頁，頁首含 ICSE '20 版權頁與 DOI；未與 ACM DL 正式版逐字比對）

## 書目

- 作者：Emad Aghajani, Csaba Nagy, Mario Linares-Vásquez, Laura Moreno, Gabriele Bavota, Michele Lanza, David C. Shepherd
- 年份／刊物：2020，ICSE '20（42nd International Conference on Software Engineering），Seoul（線上舉行）
- DOI：https://doi.org/10.1145/3377811.3380405
- 實際讀的檔案：https://csnagy.github.io/research/pdfs/2020/Aghajani2020-preprint.pdf
- 全文文字檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/aghajani-2020.txt
- 複製套件：https://github.com/USI-INF-Software/Conf-ReplicationPackage-ICSE2020（未開啟）

## 研究設計、樣本、比較、量了什麼

- 兩份問卷（Qualtrics，各約 15 分鐘，匿名），驗證 2019 年 162 類分類法在實務者眼中哪些重要（§1、§3）。
  - RQ1："What documentation issues are relevant to practitioners?"
  - RQ2："What types of documentation are perceived as useful by practitioners in the context of specific software engineering tasks?"
- Survey-I：把 162 類壓成 51 個問題（What 22、How 12、Process/Tool 17）；分三部分，每部分勾「major issues」→ 選最多兩個最常遇到的 → 隨機挑一個問細節（影響讀者還是作者、頻率、解法、情境）。
- Survey-II：14 種文件類型 × 15 種任務（來自 SWEBOK v3），隨機給兩種文件類型，各選最多三個最有用的任務並解釋。
- 樣本（§3.2）：ABB（自動化技術跨國公司）125 人＋線上論壇 21 人 = 146；Survey-I 78、Survey-II 68。ABB 先試發 160 人得 21 份，再寄 1,500 人＋Yammer 公告得 104 份。回收率估 9.5%（假設 1,660 人都收到）。
- Table 2：Developer 55、Architect/Technical Engineer 26、Technical Lead 19、Tester 11、Others 35；經驗 >10 年者 88 人（60%）。
- 分析：RQ1 描述統計（% 勾為重要；最常遇到的以四分位呈現，因每人最多勾兩個）；101 筆解法答案由兩位作者 open coding。RQ2 熱圖。
- 量了什麼：「認為重要」的百分比（自陳），不是實際發生率；沒有嚴重度的量表。

## 可引用結果（Figure 2，§4）

1. 內容類幾乎全被認為重要；最高的是「新功能沒有文件」
   - Up-to-dateness：Missing documentation for a new feature/component 69%、Outdated/Obsolete references 64%、Code-documentation inconsistency 59%、Outdated installation instructions 54%、Missing documentation for a new release 53%、Outdated example 51%；Outdated screenshot 29%、Outdated translation 19%。
   - 原文："the lack of documentation for a new feature/component was not only the one considered important by most participants (69% of them) but also the most recurring issue in this subcategory. Practitioners tend to resort to external sources of information to understand the new feature, or to contact the appropriate parties (i.e., the team who developed the feature)"
   - Completeness：Installation, deployment, & release 68%、Missing user documentation 65%、Developer guidelines 60%、Missing code comments 28%。
   - Correctness：Faulty tutorial 65%、Inappropriate installation instructions 63%、Erroneous code examples 59%、Wrong code comments 49%、Wrong translation 21%。（注意：正文說 inappropriate installation instructions 與 faulty tutorial 都是 "65%"，但 Figure 2 印 63%，見下方不一致處）

2. How 類只有清晰度與可尋性過六成
   - Clarity 88%（全問卷最高）、Accessibility/findability 65%、Content is not useful in practice 59%、Superfluous content 55%、Information organization 49%、Conciseness 49%、Clone/Duplicate content 46%、Format/presentation 33%。
   - 原文："documentation clarity is the issue perceived as most important by practitioners (88% of them)"
   - 原文（Summing up）："only 2 out of 12 (17%) documentation issues from our taxonomy [2] are perceived as important by at least 60% of surveyed practitioners (i.e., clarity and accessibility/findability)."
   - 解法：寫的時候想著實際讀者；"documentation should be tested by someone with little domain knowledge"。

3. 流程類：唯一過半的是「沒時間寫」（§4 Process/Tool Related）——最貼「誰來寫」
   - Lack of time to write documentation 65%、Reporting issues found in documentation 44%、Organization of documentation files 40%、Traceability 35%、Supporting external contributors 10%。
   - 原文："Lack of time to write documentation is the only issue in this category that was indicated as important by the majority (65%) of participants. Also, it is a frequently encountered issue."
   - 原文：解法 "(i) explicitly allocating time/effort/resources to documentation in the project planning; and (ii) starting documentation activities in the early stage of the software lifecycle"
   - 受訪者引述："The documentation team comes into picture only at the last moment before the release"；"Projects were built without providing documentation; as time passes aspects of the project are forgotten which makes revisiting the project when updates or modifications need to be made more difficult"；"when estimating time to complete a project, it is important to make sure that documentation is counted in"
   - 原文："issues in this category mostly affect documentation writers, while both writers and readers are affected by most of the issues in the other categories."

4. 預算與流程是反覆出現的解法
   - 原文："Increasing the budget dedicated to documentation was a recurring solution often mentioned by participants. This suggests that software documentation does not receive the attention it deserves when planning and allocating software resources."
   - 完整性問題的解法："include these documentation types as mandatory items in the release checklist and allocate project budget and a dedicated team to fundamental documentation items."
   - 六類解法（Fig. 2 圖例）：S1 Improve process practices、S2 Documentation testing、S3 Fix the issue、S4 Improve project management practices、S5 Allocate budget、S6 Improve the documentation structure。

5. 分類法裡大多數問題實務者不在乎
   - What："7 out of 23 (30%) documentation issues from our taxonomy [2] are perceived as important by the majority (≥60%)"；"nine issues (39%) are considered relevant by less than 40% practitioners"。
   - Process/Tool："the majority of issues in our taxonomy [2] are not considered important. The notable exception is represented by the lack of time to write documentation."
   - 結論："only a small subset of the 162 documentation issues reported in our taxonomy are deemed important by practitioners."

6. 註解要少才跟得上（反直覺的一筆）
   - Missing code comments 只有 28% 認為重要，作者說 "unexpected"。
   - 原文："One practitioner highlighted that a solution for up-to-dateness issues is to limit code comments to the minimum needed, so it is simpler to co-evolve them with code"

7. RQ2：不同任務要不同文件（§5）
   - Code Comment：所有人都認為對 Debugging 有用；80% Program Comprehension；40% Refactoring；其他任務幾乎沒人選。
   - Contribution Guideline：64% Testing/QA、45% Programming、45% Architecture Design。原文："Contribution Guideline is an often neglected document that does not seem to have a negative effect when it is missing but, as shown by our survey, can positively influence a wide range of tasks when it is well written."
   - User Manual：多數任務至少五分之一受訪者認為有用。
   - 原文（Summing up）："practitioners perceive different documentation types as useful for different tasks. Also ... even within the same documentation type, different information items might be useful for different tasks."

## 作者限制（§6）

- 建構效度：51 個問題、14 種文件、15 個任務的挑選可能不具代表性；以「Other」欄緩解。
- 內部效度：回收率 9.5%；自願參加者可能對文件更有興趣（"biased view"）；疲勞偏誤以 pilot（4 位開發者＋4 位博士生）緩解。
- 外部效度："limited to participants mostly from a single multinational company"（ABB 佔 125／146）、樣本只有 146；作者說來自 20 國 4 洲。
- RQ2 白點部分因為某些任務回答太少；每人每種文件最多選三個任務，平均選 2.6 個，API Reference 可能因此被低估。

## 與摘要或常見轉述不一致處

- 「實務者認為最嚴重的是過時」：不精確。單項最高是 Clarity 88%（How 類），其次是 Missing documentation for a new feature 69%、Installation/deployment/release 68%。過時類（Outdated references 64%）不是第一。
- 百分比是「勾選為 major issue 的比例」，題目是勾選框，不是嚴重度評分，也不是發生率。
- 樣本 86%（125／146）來自 ABB 一家公司；摘要只寫 "146 practitioners"，沒說集中在單一企業。轉述成「實務者普遍」要附這個條件。
- 數字不一致（原文自己）：§3.2 說 What 類壓成 22 個問題，§4 Summing up 卻寫 "7 out of 23 (30%)"。正文說 inappropriate installation instructions「和 faulty tutorial 一樣 65%」，Figure 2 印 63%。引用以 Figure 2 為準並註明。
- Survey-I 78 人、Survey-II 68 人；不是 146 人都回答了每一題。
- 本文 §3.2 回頭描述 2019 分類時給了 What 55%、How 29%、Process 9%、Tool 15% 的 artifact 佔比。我驗算：485／878≈55%、255／878≈29%、81／878≈9%、134／878≈15%，分母是 878（含 49 份偽陽性），不是 2019 的有效數 824（用 824 會是 59%／31%／10%／16%）。另外這個「What 55%」與 2019 原文「Completeness 佔 What 類 55%」（268／485）數字碰巧相同、意義不同，轉述時容易混。
- 這是軟體開發文件（API、註解、安裝、release），不是企業知識庫或營運手冊；ABB 是工業軟體公司。

## 讀取紀錄

- 全文檔：fulltext/aghajani-2020.txt，986 行，124,213 bytes；PDF 12 頁。
- 依序讀過：1–330（摘要、§1、Table 1、§2、§3.1、Figure 1、§3.2 前半）→ 330–659（Table 2、§3.3、§4 What 前半、Figure 2 全部、§4 What 後半、How、Process/Tool、§5 開頭）→ 660–986（§5 其餘、Figure 3、§6、§7、致謝、References）。涵蓋 1–986。雙欄並排，逐欄對讀；Figure 3 熱圖的格子顏色 pdftotext 無法讀出，只引用正文寫出的百分比。
- 管道：
  1. `curl` https://emadpres.github.io/pdfs/icse2020.pdf（猜的路徑）→ 回 HTML 404 頁（失敗）。
  2. Exa search 找到候選 → `curl` https://www.inf.usi.ch/lanza/PUBS/P/Agha2020a.pdf → 回 HTML（失敗，疑似重導向頁）。
  3. `curl` https://csnagy.github.io/research/pdfs/2020/Aghajani2020-preprint.pdf → 200 PDF 12 頁 → `pdftotext -layout`（成功）。

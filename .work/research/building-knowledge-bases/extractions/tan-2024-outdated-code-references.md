# 抽取紀錄：Tan, Wagner & Treude (2024) Detecting outdated code element references in software repository documentation

read_status=full（期刊正式版全文＋arXiv v1 全文，兩版逐段比對關鍵數字）

## 書目

- Wen Siang Tan（University of Adelaide）、Markus Wagner（投稿時 Adelaide，正式版改 Monash）、Christoph Treude（University of Melbourne；正式版作者欄同）
- Empirical Software Engineering 29, Article 5（2024）。Accepted 2023-09-25，online 2023-11-21。Open access。DOI: https://doi.org/10.1007/s10664-023-10397-6（Crossref 查得：vol 29、article-number 5）
- 預印本：arXiv:2212.01479 v1（2022-12-02，arXiv 只有 v1）
- 讀取方式與全文檔（scratchpad/fulltext/）：
  - 正式版：Springer 頁面 curl 拿到的是 3 KB 的 HTML（PDF 端點被擋）；改用 Exa web_fetch 抓 https://link.springer.com/article/10.1007/s10664-023-10397-6 全文 → o9-tan2024-emse.md（549 行，58,231 bytes）
  - arXiv v1：curl https://arxiv.org/pdf/2212.01479（825,945 bytes PDF）→ pdftotext -layout → o9-tan2024.txt（1,081 行，58,102 bytes）
  - 目錄完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 下文行號標「E」為正式版檔、「A」為 arXiv 檔。

## 研究設計

- 實證、大規模倉庫探勘（repository mining）＋少量介入（向 15 個專案開 issue）。
- 資料集（E 行 51；A 行 173 起）：GitHub 星數前 1,000 名（top1000，2022-06-20 抓名單）＋ Google 組織下全部 2,279 個專案（google）。合計 3,279，即「over 3,000」。
- 文件範圍：只有 README 與 GitHub wiki 頁（A 行 155–170 附近，3.1 節）。
- 「過時」的操作定義（A 行 290–300；Table 3.1）：文件最後更新時，該程式元素（變數、函式、類別名、反引號內文字）在原始碼中至少出現一次；之後原始碼裡所有實例被刪光，文件裡卻還留著。用正規表達式抽取、全字大小寫完全比對。
- 標註信度（A 行 225–229）：三位作者各標同 50 個樣本，free-marginal kappa 0.92。
- RQ1 現況；RQ2 歷史；RQ3 怎麼修；RQ4 開 issue 後的回應。

## 可引用結果（數字照原文）

1. RQ1 現況（E 行 241；A 行 549–556）：
   - top1000：3.9%（7,910/201,852）程式元素引用目前過時；19.2%（1,880/9,784）文件含至少一個過時引用；28.9%（265/918）專案含至少一份過時文件。
   - google：2.7%（1,283/48,078）引用、9.7%（287/2,947）文件、5.4%（101/1,879）專案。
   - 目前過時的引用平均已過時 4.7 年（top1000）、4.2 年（google）。
2. RQ2 歷史（E 行 269；A 行 576–585）：
   - top1000 分析了 800 個專案的完整歷史：82.3%（658/800）專案、40.7%（2,878/7,071）文件、12.3%（23,588/191,849）引用曾經過時。
   - google 分析 1,907 個：29.7%（567/1,907）專案、30.6%（925/3,018）文件、7.1%（4,176/58,805）引用曾經過時。
   - 修好後再次過時：1.3%（top1000）、0.4%（google）的引用。
3. 存活時間（E 行 277 圖說）：在「最後有被修好」的過時引用中，一個月後仍未修的比例約 55%（top1000）、45%（google）。
4. RQ3 怎麼修（E 行 299；A 行 667–675）：
   - top1000：73.6%（17,368/23,588）曾過時的引用後來被解決；其中 47.6% 是程式碼改回來（元素重新出現）、39.1% 是更新文件、13.3% 是刪掉整份文件。
   - google：55.5% 被解決；50.2% 改程式碼、43.3% 更新文件、6.5% 刪文件。
   - 作者在討論承認「改程式碼」這類有一部分是大量刪除又還原檔案造成的假象（A 行 796–800；E 第 7 節）。
5. RQ4 開 issue（E 行 311；A 行 696–699）：挑 15 個近一年仍活躍的 google 專案回報 19 處；4 個專案正面回應、4 個說是誤報、7 個未回；19 處中 5 處被修。
6. 動機例子（A 行 88–125）：google/glog 的 wiki 文件引用了 2018-06-01 被改名的 `DGFLAGS_NAMESPACE`；回報後維護者的處理方式是刪掉那份文件。
7. 引用的背景數字（A 行 60–66）："up-to-dateness problems" 占文件內容問題 39%（Aghajani et al. 2019）；Open Source Survey 2017：93% 受訪者遇過不完整或過時文件、60% 貢獻者很少或從不貢獻文件（A 行 853–855）。

## 可引用原句

- 「默默過時」（A 行 67–70）："Unlike source code, software documentation gets outdated 'silently', i.e., there are no crashes or error messages to indicate that documentation is no longer up-to-date."
- 作者推測的成因（摘要）："developers are unaware of when their source code modifications render the documentation obsolete."
- 外部效度（E 行 375）："we cannot claim that the findings can be generalised to other GitHub repositories that are not in the datasets considered, i.e. the top 1,000 most popular GitHub repositories and those owned by Google."
- 結論（A 行 954–957）："the majority of the most popular projects on GitHub contained at least one outdated reference to a code element at some point during their history and these outdated references usually survived in the documentation for years before they were fixed."

## 沒寫的事

- 只偵測一種過時：程式元素「被刪光」。改了行為但名稱還在、外部服務變了、流程變了，都偵測不到（E 行 365；A 行 822–828）。所以數字是過時的下限，不是全貌。
- 沒量過時造成的實際損失（誤導了多少人、浪費多少時間）。
- 沒比較「有規定 PR 要附文件」與「沒規定」的專案差異；不能拿來證明或否定 docs-as-code 閘門的效果。
- 沒研究內部 wiki、Confluence 或非程式文件。

## 與摘要或常見轉述不一致處

1. 摘要說 "we analysed over 3,000 GitHub projects and found that most projects contain at least one outdated code element reference at some point in their history." 但「曾經過時」的歷史分析只做了 800 + 1,907 = 2,707 個專案，其中 top1000 是 82.3%、google 只有 29.7%；兩組合計 1,225/2,707 ≈ 45%（本紀錄自行加總，原文沒有合計數）。「多數」只在 top1000 成立；結論段的措辭是「the majority of the most popular projects」，比摘要準確。
   - series plan 的寫法「3,000 多個 GitHub 專案多數曾有文件引用已不存在的程式碼」應改成：「GitHub 最熱門的 1,000 個專案中，八成曾在 README 或 wiki 留下指向已刪除程式碼的引用；Google 自家 2,000 多個專案則約三成」。
2. 「現在有過時文件」與「曾經過時」常被混用：現在是 28.9%／5.4%，曾經是 82.3%／29.7%。
3. 「過時的文件通常會被刪掉」：刪文件是最少用的修法（13.3%／6.5%）。
4. ICSME 2023 的工具論文（同作者，GitHub Action 版）摘要寫「more than a quarter of the 1000 most popular projects」——指的是現況 28.9%，不是歷史 82.3%。

## 限制

- 兩個資料集都不是隨機樣本：熱門專案＋Google 專案；作者自己說不能外推（E 行 375）。
- 正規表達式＋完全比對，作者說會低估（A 行 900–903："this may underestimate the number of actually outdated code element references"），也有誤報（change log、註解中的元素；RQ4 的 4/15 專案回報誤報）。
- 部分專案因分析超時被排除（A 行 508–520；E 行 269）。
- 只看 main branch（E 行 365 之後的 8.1 段）。

## 對 order 9 的用法

- 支持「過時是常態、而且是默默發生」；也支持 docs-as-code 的動機（README 本來就和程式在同一 repo，仍會過時，所以光放在一起不夠，要有檢查）。
- 不能用來證明「驗證到期」或「owner」有效——研究沒碰這些。

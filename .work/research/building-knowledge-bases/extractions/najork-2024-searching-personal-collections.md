# Bendersky, Metzler, Najork & Wang 2024 — Searching Personal Collections

read_status=fulltext（arXiv 版）

## 書目

- **作者順序**：Michael Bendersky, Donald Metzler, Marc Najork, Xuanhui Wang（Google DeepMind）。第一作者是 Bendersky，**不是 Najork**。引用時應寫「Bendersky et al.」；若沿用「Najork et al.」是錯的。
- 正式出處：Chapter 14 in Omar Alonso & Ricardo Baeza-Yates (eds.), *Information Retrieval: Advanced Topics and Techniques*, ACM Press, 2025。DOI 10.1145/3674127.3674142。原文頁腳把編者寫成「Omar Alonzo」，應為筆誤。
- 預印本：arXiv:2412.12330v1 [cs.IR], 16 Dec 2024。
- 讀的檔案：https://arxiv.org/pdf/2412.12330v1 → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/najork.txt`（另存了 HTML 版 najork.html，沒有用來閱讀）。

## 研究設計

- 性質：書章綜述，**沒有原創實證**。內容分 17 節：14.1 Organizing Digital Assets、14.2 Labeling、14.3 Automatic Classification、14.4 Spam、14.5 Threading、14.6 Known-item Retrieval、14.7 Refinding Using Search、14.8 Episodic Memory、14.9 Test Collections、14.10 Crafted Rankers、14.11 Associative Browsing、14.12 Learning to Rank、14.13 Desktop Search、14.14 File Recommendation、14.15 Cloud Infrastructure、14.16 Human Digital Memory、14.17 Future Directions。
- 下方列出的人數與數字都是**本章轉述的原研究**，不是本章自己量的。

## 可引用結果（本章的論點，以及它轉述的研究）

1. **個人收藏的核心任務是「找回已知項目」**。見章首列點與 14.7 開頭。
   - 「Users are typically aware of most, if not all, of the items that exist in the collection. Thus, the typical retrieval task is refinding known items, as opposed to finding as-of-yet unknown documents that satisfy an information need.」
   - 「Users "own" the assets, and may spend effort on organizing them, in order to aid future refinding. Organization strategies include foldering ..., tagging ... and annotating」
   - 「personal search tends to be optimized for recall—specifically, to ensure that when a user is searching for a known asset, that asset is among the retrieved assets.」
   - 14.7：「the dominant search task for personal collections is known-item search」
2. **不歸檔的人記得比較多**。見 14.1，轉述 Elsweiler et al. 2008 與 2011。
   - 原文：「Two later studies by Elsweiler et al. [2008, 2011] examined the impact of the filing strategies on how much users remember about individual messages. Somewhat surprisingly, they found that non-filers remember more details about their messages than spring cleaners do, who in turn remember more than frequent filers do.」
   - 引用的書目，照本章 Bibliography 原文：
     - D. Elsweiler, M. Baillie, and I. Ruthven. 2008. Exploring memory in email refinding. ACM Transactions on Information Systems, 26(4): 21:1–21:36. DOI: 10.1145/1402256.1402260.
     - D. Elsweiler, M. Baillie, and I. Ruthven. 2011. What makes re-finding information difficult? a study of email re-finding. In Proceedings of the 33rd European Conference on IR Research, LNCS 6611, pp. 568–579. DOI: 10.1007/978-3-642-20161-5_57.
3. **勤於歸檔不保證找得回**。見 14.1，轉述 Lansdale 1988 與 Malone 1983。
   - 「Contrary to first expectations, diligent filing of information does not always enable successful retrieval because hierarchical classification systems tend to have overlapping and thus somewhat ambiguous categories, making it difficult to locate the folder when attempting to locate a file. As a result, workers may feel that there is an insufficient return on investment to filing new information, and thus simply add to unstructured piles.」
   - 書目：M. W. Lansdale. 1988. The psychology of personal information management. Applied Ergonomics 19(1): 55–66；T. W. Malone. 1983. ACM TOIS 1(1): 99–112。
4. **「春季大掃除」型歸檔效果最差**。見 14.1，轉述 Whittaker & Sidner 1996，20 位 Lotus Notes 使用者。
   - 「Many users found filing emails to be a cognitively challenging task, since creating folders and adding emails to folders requires users to anticipate future information needs.」
   - 「Importantly, the study found that "spring cleaning" is an ineffective strategy for information management, with over half of the folders of spring cleaners being failed folders.」
   - 書目：S. Whittaker and C. Sidner. 1996. Email overload. CHI '96, pp. 276–283. DOI 10.1145/238386.238530。
5. **不靠資料夾、隨手搜尋的找法佔大多數，而且成功率較高**。見 14.7，轉述 Whittaker et al. 2011。
   - 「The authors found that opportunistic search behaviors that do not rely on foldering and tagging dominated refinding activities. They also found that refinding sessions that involved search and those that leveraged conversation threading were more successful than sessions that did not.」
   - 書目：S. Whittaker, T. Matthews, J. Cerruti, H. Badenes, J. Tang. 2011. Am I wasting my time organizing email? A study of email refinding. CHI 2011, pp. 3449–3458. DOI 10.1145/1978942.1979457。
6. **email 找回任務的比例**。見 14.7，轉述 Elsweiler & Ruthven 2007，36 人記錄 3 週。
   - 「For email searches, they found that the majority are lookup tasks, and lookup and item tasks combined account for about 95% of all tasks. For web search, about 53% were observed to be item tasks, and lookup and item tasks accounted for about 86% of all web search tasks.」
7. **大規模 log 再次確認個人搜尋以找回為主**。見 14.7，轉述 Ai et al. 2017：Outlook，約 200 萬筆查詢、71.1 萬名使用者、一週，另問卷 324 人。
   - 「The study confirmed that users' search tasks were overwhelmingly refinding of known items.」
8. **記得內容，記不得檔名與位置**。見 14.6，轉述 Allen 1989，44 人。
   - 「users are much more likely to recall the contents of an asset than its formal descriptors—its name, filing location, or the like.」
9. **時間排序和相關度排序的爭議**。見 14.10。
   - 「Dumais et al. [2003] found that users of the SIS system preferred chronological ordering ... On the other hand, Mackenzie et al. [2019] found that when presenting results in chronological order, the rate of unsuccessful searches was correlated to the age of the target item, arguing that there is still a need for relevance-based ranking.」
10. **早期研究已經過時**。見 14.1。
    - 「It is worth remembering that the above studies, conducted more than 25 years ago, examined the behaviors of the first generation of personal computer users. Clearly there is a feedback loop between users and systems」
11. **Barreau & Nardi 1995 的綜合結論**。見 14.1。
    - 「users prefered filing strategies that leverage spatio-visual cues ...; users avoided elaborate filing schemes; users distinguished between ephemeral, working, and archived files; and finally, users accumulated relatively few archival files.」
12. **Boardman & Sasse 2004：參與研究本身就改變了行為**。見 14.1。
    - 「participation in the study caused introspection, resulting in two of the eight participants changing their filing behavior, both starting to separate working files from archival files.」
13. **Google Drive Quick Access**。見 14.14，轉述 Tata et al. 2017。
    - 「users spend 50% less time locating the file they wish to open」，以及相對「k most-recently-used」基準的推薦準確度提升 18.5%（僅限高度活躍使用者）。

## 作者自己列的限制

- 14.1 指出早期 PIM 研究「conducted more than 25 years ago」，研究的是第一代 PC 使用者，而且使用者與系統會互相影響。
- 14.9 指出個人檢索的公開測試集稀少，而且有倫理問題（例如 Enron 語料）。
- 14.7 指出大規模研究因隱私限制難以進行。
- 本章沒有說明文獻是怎麼挑選的，**不是系統性回顧**。

## 與摘要或常見轉述不一致的地方

- **作者順序**：第一作者是 Bendersky。「Najork et al.」是錯的引用寫法。
- **「不歸檔者記得更多」的原研究，我用二手方式查核過**：沒有讀 Elsweiler 2008 全文，只讀了 Exa 搜尋傳回的全文段落，取自 dl.acm.org PDF 的 Table VI、Table VII、§4.6、§5、§7。查到的事實如下：
  1. **樣本極小**：歸檔策略比較只用了大學部與研究人員兩組，共 **14 人**（no-filers 4、frequent filers 5、spring-cleaners 5，見 Table VI 的「Number in group」）。研究生組因為「almost the entire group employed a no-filing strategy」被排除。
  2. 描述統計的順序確實是 no-filers > spring-cleaners > frequent filers（§4.6 原文：「On average, the no-filers remembered more than the spring-cleaners and the spring-cleaners remembered more than the filers.」）。**但 logistic 迴歸**只發現 frequent filers 較記不得「when sent」（p=0.01）與「reason sent」（p=0.02），而且「the models show no difference in the recollections of the participants with no-filing and spring-cleaning strategies」。所以 Najork 寫的完整三級排序，只有描述統計支持，推論統計不支持。
  3. **原作者明確警告不能推到「不歸檔比較好」**（§7）：「However, just because a person remembers more by applying a particular filing strategy, it does not necessarily follow that this is the most effective strategy to use. It is possible that the participants who employed a frequent filing strategy are required to remember less in order to refind because of the quality of their organizations.」Najork 的轉述沒有提到這句。
  4. 量的是「記得多少屬性」（記憶問卷），**不是找回成功率**。原作者說找回表現留待後續文章。
  5. Elsweiler 2011 ECIR 沒有查核，不知道它是否重複這個結論。寫進文章前要讀那篇全文。
- **Nardi 的年份**：本章寫「Nardi et al. [1994]」，書目為「Technical Report # 118, Apple Computer Inc.」。正式發表是 EWHCI '95，詳見 nardi 抽取紀錄。本章轉述 Nardi 時沒有提「no evidence that users are having serious trouble finding files」，而且寫成封存資訊靠位置、屬性搜尋與全文搜尋組合找回；原文則說 Find 與文字搜尋是最後手段，用的時候受試者會說「desperate」。
- **SIS 的轉述**：「preferred ... ranked by date」原文是行為資料（較常切到 Date 排序），不是問卷問的偏好；而且預設 Rank 組的差異不顯著。本章寫「47 days」，與原文 8/1–9/16 一致。
- **Boardman & Sasse 的人數**：本章先寫「31 participants」，後面又寫「two of the eight participants」，前後不一致。原研究應是 31 人訪談、其中 8 人做縱貫追蹤，但本章沒有交代。若要引用，需查證原文。
- **Barreau 1995**：本章寫「surveyed seven managers」，沒有查證原文。

## 對本系列的定位：支持或反駁「要整理才找得到」到什麼程度

- 本章的整體立場：個人收藏以「找回」為核心；整理（資料夾、標籤、註記）是使用者為了找回而付出的成本。章中多項轉述（Lansdale、Whittaker & Sidner、Whittaker 2011、Elsweiler）都指向**精細的事前歸檔報酬不高，搜尋與對話串更有效**。
- 但證據等級不同：
  - Whittaker 2011（345 人、85,000 次以上找回動作，依 Exa 搜尋看到的摘要）是行為層面的比較，最有力，需另外精讀。
  - Elsweiler 2008 只有 14 人，量的是記憶不是找回，原作者自己反對推論到「不歸檔比較好」，只能當旁證。
  - Lansdale 1988 是觀點文章。
- 可以寫進 order 0／1 的安全說法：「多項研究發現精細事前歸檔的報酬有限，而且搜尋與對話串在 email 找回中更常用、成功率更高」。不能寫「研究證明不整理記得更多所以更好」。

## 讀取紀錄

- 全文檔：najork.txt，1,245 行，103,550 字元。PDF 共 32 頁。
- 依序讀過：第 1–320 行（章首到 14.5 Threading），第 321–640 行（14.5 續到 14.12 前半），第 641–940 行（14.12 續、14.13–14.17、Bibliography A–C），第 941–1245 行（Bibliography C–Z 與作者簡介）。合計涵蓋第 1–1245 行全文。
- 管道：curl 從 arxiv.org 下載 PDF 與 HTML 都成功，pdftotext -layout 轉文字。Elsweiler 2008 的二手查核用 Exa web_search_exa，回傳的是 dl.acm.org PDF 的全文段落，**不算精讀**。

# Dumais et al. 2003 — Stuff I've Seen: A System for Personal Information Retrieval and Re-Use

read_status=fulltext

## 書目

- 作者：Susan Dumais, Edward Cutrell, JJ Cadiz, Gavin Jancke, Raman Sarin, Daniel C. Robbins（Microsoft Research）
- 原始發表：SIGIR '03, July 28 – August 1, 2003, Toronto, pp. 72–79。DOI 10.1145/860435.860451（ACM 頁面確認）。
- 讀的版本：SIGIR Forum 49(2), December 2015, pp. 28–35 重刊版（SIGIR 2014 Test of Time Award），DOI 10.1145/2888422.2888425。這是原文的影印式重刊：頁面保留原始頁碼 72–79 與「SIGIR'03 ... Copyright 2003 ACM」字樣，正文與 2003 版相同。
- 檔案：https://sigir.org/files/forum/2015D/p028.pdf → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/sis.txt`
- 另有 MSR 版 PDF：https://www.microsoft.com/en-us/research/wp-content/uploads/2003/01/siscore-sigir2003-final.pdf（沒有下載，只在搜尋結果看到摘要與開頭，和讀的版本相同）

## 研究設計

- 系統：SIS 在本機建一個統一索引，涵蓋 email、網頁快取、檔案、媒體、行事曆，介面用時間、作者、縮圖、預覽等脈絡線索幫助找回。
- 部署：Microsoft 內部，**234 人**，2002-08-01 到 2002-09-16，原文稱「six week period」；Najork 2024 寫成 47 天，兩者一致。SIS 專案組成員不列入分析。
- 受試者背景：「consulting, legal, product support, administration, sales, and software development ... individual contributors, managers, and executives」。作者也承認「our users are arguably more computer savvy than the typical web user」。
- 資料：(1) 使用紀錄 log，超過 8,200 筆查詢；只記互動，不記內容；(2) 安裝前後兩份問卷，相隔約一個月，**兩份都回的只有 45 人**；(3) 隨機分派介面版本：Top 與 Side 版面、預設依 Date 或 Rank 排序。
- 比較對象：沒有不用 SIS 的對照組。前後比較是同一批人在安裝前後的自評；介面實驗是 SIS 版本之間的比較。
- **沒有比較「有整理的人」和「不整理的人」誰找得比較好**。問卷只是記錄受試者屬於哪種歸檔類型。

## 可引用結果

1. **安裝後自評找資料比較容易**。見 Questionnaire Data 節與 Figure 5。
   - 「Users' ratings of ease of finding were higher after SIS than before (F(1,43)=45.34, p<<0.001).」
   - 各類型 t 檢定：files t(43)=2.39，email t(44)=6.64，web t(44)=4.35，皆 p<0.01。
   - 「With SIS, people found it equally easy to find all three kinds of information」
   - 注意：這是 n≈45 的 Likert 自評，不是客觀找回成功率。
2. **改用 SIS 後，少用各應用程式自己的搜尋**。見 Questionnaire Data 節。
   - 「Users estimated that they searched less frequently using native applications after installing SIS (F(1,43)=12.09, p<0.001)」
   - files t(44)=2.22, p<0.03；email t(44)=4.77, p<0.01；web 不顯著，t(44)=1.49, p<0.15。
3. **歸檔類型分布**。見 Questionnaire Data 節，用的是 Whittaker & Sidner 的分類。
   - 「Of the respondents, 39% were Frequent Filers (clean their inbox daily), 52% were Spring Cleaners (clean their inbox periodically), and 9% were No Filers (no use of folders).」
   - 緊接著是作者的**主張**，不是實證：「Good search over personal content decreases the need for maintaining complex file and mail hierarchies, and we will explore changes in filing and search behaviors in a longitudinal study of SIS users.」
4. **使用者對「有搜尋就少整理」的同意度只是中等**。見 Table 4，1 到 5 分 Likert。
   - 「I would likely put less effort into maintaining a detailed set of folders for my files if I could depend on SIS to find what I am looking for.」**3.45**
   - 對照：「SIS-like search service should be an essential functionality in any computer.」4.55；「I typically find things very easily with SIS」3.89。
5. **時間和人名是主要線索；依日期排序勝過依相關度排序**。見 Query Characteristics 節、Rank vs. Date Sort 節、Table 3。
   - 「25% of the queries involved people's names suggesting that people are a powerful memory cue for personal content.」
   - 「Regardless of which sort order people started with, they issued more queries in which they sorted the results by Date (F(1,231)=22.8, p<<0.001).」但只有預設 Date 組顯著，t(110)=4.90；預設 Rank 組不顯著，t(121)=1.15, p=0.26。
   - Table 3：Date 排序 5,037 次，Rank 排序 2,038 次，總計 8,254 次。
   - 「The fact that users frequently switch to sorting by Date suggests that Date is a more useful attribute than Rank for finding personal items.」
6. **查詢很短，常用篩選器**。見 Query Characteristics 節。
   - 「Queries were short, averaging 1.59 words.」
   - 「Forty eight percent of the queries involved a filter」
   - 「Only 7.5% of the queries involved explicit Boolean operators」
7. **開啟的項目以近期為主，但有長尾**。見 Opening Items 節、Figure 3、Figure 4。
   - 「Email was by far the most common type opened (76%), followed by web pages (14%) and files (10%).」
   - 「Overall, 6.6% of the items opened were first seen that day, 21.9% within the last week, 45.9% within the last month, and 89.4% during the last year. ... the distribution has a long tail with items up to eight years old being opened.」
   - 冪律擬合：log(Frequency) = -0.68*log(DaysSinceItemModified) + 2.02，r²=.62。
8. **使用者留言提到「歸檔也會歸錯」**。見 User Comments 節。這是質性證據，沒有計數。
   - 「Even people who regularly file email and documents, often misfile information, or create new folders with slightly different names. SIS searches make it easier to find these items which become buried in folder-based access.」
   - 「SIS was often quite useful when they could only remember one or two vague things about an item」
9. **使用量**。見 Log Data 節。
   - 「They issued an average of 4.4 queries per day ... Users took advantage of the system on 84% of the work days they had it installed.」

## 作者自己列的限制

- 沒有開檔不代表搜尋失敗：「The failure to open items after a search is difficult to interpret. It could mean that the search was a failure, or that the search results were used in other ways.」
- 隱私限制：「For privacy reasons, we did not log any information about what content was indexed, or the content of search results.」因此無法判斷找到的是否就是使用者要的那個項目。
- 使用者較懂電腦：「our users are arguably more computer savvy than the typical web user」。
- log 有問題：有 4 位的起始版面、1 位的起始排序無法判定。
- 系統效能：「Queries sometimes take longer than we would like」。
- 「整理需求變少」被列為**未來的縱貫研究**，本篇沒有做。

## 與摘要或常見轉述不一致的地方

- **「不整理靠搜尋也找得回」不是這篇證明的**。原因有四：
  1. 樣本中 91% 有歸檔（39% 天天歸、52% 定期大掃除），No Filers 只有 9%（45 位回覆者中約 4 人），而且沒有拿不同歸檔類型的找回表現做比較。
  2. 「搜尋減少整理需求」是作者在討論段的主張，明說要留待縱貫研究。
  3. 受試者自己對「有 SIS 就少花力氣維護資料夾」的同意度只有 3.45 分（滿分 5）。
  4. 有效性證據都是自評（n=45）與使用紀錄，沒有客觀的找回成功率，也沒有不用 SIS 的對照組。
  比較準確的說法是：在有歸檔習慣的受試者身上，加上一個統一的全文搜尋後，自評找資料變容易了，而且搜尋還能撈回歸錯資料夾的項目。
- **摘要寫「more than 230 employees」**：log 分析是 234 人，但前後問卷只有 45 人回答，而且「Users find information more easily」這個結論來自這 45 人。
- **表號錯誤**：正文寫「Table 3 shows the total number of queries issued using the Top or Side view」，但版面的表標題是「Table 2」。排序的表才是 Table 3。引用版面數據時要用 Table 2。
- **Najork 2024 轉述**「participants preferred search results to be ranked by date rather than by relevance」：原文是行為資料，即使用者較常切到 Date 排序，不是問卷問的偏好；而且預設 Rank 組的差異不顯著。Najork 寫「SIS used ... a BM25-based ranker」，原文是「Okapi's probabilistic ranking algorithm」，兩者一致。

## 對本系列的定位

- order 0「finding」：這篇是「全文搜尋加時間與人名線索可以撐起找回」的代表研究，也是「找回以 re-finding 為主」的例證（引言引用 58–81% 的網頁瀏覽是重訪）。
- 當反證用時要降級：它支持「搜尋能補整理的漏洞（歸錯、埋太深）」，**不支持**「不必整理」。後者的實證比較應該引 Whittaker et al. 2011 CHI「Am I wasting my time organizing email?」（345 人、85,000 次以上的找回動作）。那篇我只看過摘要，尚未精讀。

## 讀取紀錄

- 全文檔：sis.txt，529 行，52,592 字元。PDF 共 8 頁，即 SIGIR Forum pp. 28–35。
- 依序讀過：第 1–270 行（摘要、引言、Related Work、架構、UI、評估方法、log、查詢特性、開檔、介面實驗開頭），第 271–530 行（Top/Side 與 Table 2、Date/Rank 與 Table 3、問卷與 Figure 5、歸檔類型、Table 4、使用者留言、總結、參考文獻 1–32）。合計涵蓋第 1–529 行全文。
- 管道：curl 從 sigir.org 下載成功，pdftotext -layout 轉文字。DOI 用 Exa 搜尋 ACM 頁面確認。

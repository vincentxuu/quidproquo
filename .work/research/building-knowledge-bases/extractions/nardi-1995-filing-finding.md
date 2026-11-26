# Nardi, Anderson & Erickson — Filing and Finding Computer Files

read_status=fulltext（作者自存草稿版，非正式出版排版）

## 書目

- 作者：Bonnie Nardi, Ken Anderson, Thomas Erickson（Apple Computer, Advanced Technology Group）
- **正式發表**：Proceedings of the East-West Conference on Human-Computer Interaction (EWHCI '95), Moscow, Russia, July 4–8, 1995, Vol. I, pp. 162–179。
  - 依據一：Nardi 本人著作頁 https://artifex.org/~bonnie/publications.htm 原文「Nardi, B., Anderson, K. and Erickson, T. (1995). Filing and finding computer files. Proceedings East-West Conference on Human Computer Interaction. Moscow, Russia. July 4–8. Pp. 162–179.」
  - 依據二：A.P. Ershov 紀念圖書館館藏卡 https://lib.iis.nsk.su/node/172349：「Human-Computer Interaction: Proc./The 5th Intern. Conf., EWHCI 95., 1995.-Vol. I.-P.162-179」
  - 依據三：Erickson 著作頁 https://tomeri.org/publications.html 列為「Proceedings of the East-West HCI Conference. July, 1995.」
- **較早的技術報告版**：Apple Technical Report #118。Barreau & Nardi 1995（SIGCHI Bulletin 27(3)）與 Najork 等 2024 標為 1994；Rutishauser & Fritz 2026 標為 1995；OAC 的 Apple 檔案目錄標為 undated。
- **ResearchGate／CiteSeerX 上的「2010」是錯的**：PDF metadata 的 CreationDate 是 2010-04-01（Erickson 用 Mac OS X 10.5.8 重新輸出），不是發表年份。
- 草稿頁註原文：「Note: This is a draft of this paper. I believe that it is very close to the final version, but if you need to quote the paper or quibble with fine points, you had best search out the final version, which I don't have. —TDE, 3/98」
- 內文最新的參考文獻是 Blomberg et al.「(Forthcoming, 1994.)」與 Kidd 1994，因此寫作時間約在 1994 年。
- 讀的檔案：http://tomeri.org/Finding&FilingComputerFiles.pdf（與 artifex.org 版逐 byte 相同，`cmp` 確認）→ `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/nardi.txt`
- 引用建議：寫「Nardi, Anderson & Erickson (1995), EWHCI '95」，並註明讀的是作者自存草稿。逐字引文應標「草稿版」，因為作者自己提醒細節可能和正式版不同；EWHCI 正式版沒有讀到。

## 研究設計

- 方法：在受試者辦公室做半結構訪談並錄影，內容包括：(1) 問他們整理與尋找檔案時有什麼問題、用什麼方法；(2) 請他們導覽自己的電腦；(3) 研究者挑一個導覽時看到的檔案，請受試者現場找出來並觀察過程。
- 受試者：**15 位 Macintosh 使用者**，職務包括經理、美術設計、程式設計師、行政助理、圖書館員。「Most of the users we interviewed are Apple employees」。硬碟容量 80 MB 到 1500 MB，檔案數 2,400 到 31,000 個。
- 比較對象：沒有對照組。作者把結果拿來和 Cole 1982 的紙本研究、Dumais & Jones 1985 與 Jones & Dumais 1986 的實驗室研究對照。
- 量了什麼：都是質性描述與自述，沒有任何計時、成功率或統計。

## 可引用結果

1. **找檔沒有嚴重困難（自述）**。見 Abstract 與 FINDING INFORMATION 節。
   - 「We found no evidence that users are having serious trouble finding files on their personal computers.」
   - 「The study participants reported that they had no difficulty in finding files.」
   - 自述和觀察一致：「The verbal descriptions of how they would find a file and the way they actually tried to find the file matched closely.」
   - 注意：現場找檔任務只要求找**一個**檔，而且是研究者剛在導覽中看到的檔案（新近、位置已知）。文中沒有報告成功率或花了多少時間。
2. **主要靠位置找，搜尋是最後手段**。見 FINDING INFORMATION 的四步驟與 Location 節。
   - 四步驟依序是：1. look in a particular location，2. look in a different location，3. use the Find command，4. use a text search program。原文：「Often only step 1 was needed.」
   - 「Location seems to be of paramount importance in finding files. Often the file was in the first place the user looked.」
   - 「No one routinely finds files using Find.」
3. **文字搜尋讓使用者覺得挫折，但仍比紙本好**。見 Text search 節。
   - 「The use of terms such as "desperate," "frustrated," "frantic" expressed the feeling of being thwarted by the computer when searching for a file.」
   - 「Text searching was not satisfying to our users because it was slow, it produced too many wrong hits, and it was difficult to decide on the exact text string needed to bring up a document.」
   - 「these same users almost universally agreed that searching by text on the computer was better than any search method they used for paper documents.」
4. **三種資訊類型：ephemeral／working／archived**。見 FILING INFORMATION 節與 Table 1。
   - 「we did find a universal pattern of information handling. This pattern is characterized by three types of information: ephemeral, archived, and working.」
   - Table 1 的保存期限：ephemeral 是「minutes to days」，working 是「days to weeks to months」，archived 是「months or years」。
5. **短期資訊不歸檔，留在眼前當提醒**。見 Ephemeral Information 節。對 order 1 的「收件匣」很有用。
   - 「A common solution is to keep ephemeral information on the desktop or in a folder "loosely" filled with other folders on the top level. In essence, the information need not be filed at all. Keeping it visible allows it to easily grab the user's attention and thus function as a reminder.」
   - 「Users who are 'forced' to file ephemeral information in non-visible places often forget about, or fail to use it.」
   - 「In our study, every person had a method of handling To Do items.」
6. **精細歸檔不划算**。見 Archived Information 節。對 order 0／1 的「維護成本」很有用。
   - 「In general, people reach a point of diminishing returns with respect to organizing information. Every user in our study discussed how they had started elaborate filing schemes at one time or another but had failed to follow through with them. It just wasn't worth it.」
7. **歸檔時會刪減**。見 Archived Information 節。
   - 「All of our users pared down the information they had after a project was over, removing files they felt would no longer be important in understanding the project. Many would have been glad to keep everything; however, they also realized that they would never actually go back to some of it.」
   - 「what was thrown out was rarely something they couldn't recapture or come close to recreating.」
   - 「The selection step was often the most difficult.」
8. **結構是做事時自然長出來的，而且每個人有自己重複使用的模板**。見 Working Information 節與 Archived 節。
   - 「spatial location plays the primary organizational role while the information is being used a lot, with categorization emerging as the work nears completion.」
   - 「All users organized most or all of their files by project.」
9. **封存資訊最難找**。見 Location 節。
   - 「Archived information was most difficult to find. General memory loss was part of the problem; memory fades over time for files which are infrequently accessed.」
   - 但：「Nevertheless, if a file wasn't in the first area the user looked, it was generally in the second area.」
10. **研究者和一般人不一樣**。見 CONCLUSION 節。
    - 「Researchers take it for granted that users want better ways to organize and retrieve files. We hope we have shown that ordinary users are relatively happy with their computer-based filing systems. The reason that researchers see the world differently is that they have so much more archived personal material than everyone else.」
    - 「ordinary users either archive formally in databases or sparsely in personal systems.」
11. **作者預言 ephemeral 資訊會變多、只能靠搜尋**。見 CONCLUSION 節。
    - 「The increasing integration of communications technologies into computing system could result in a large increase in the amount of ephemeral information available to the ordinary user. And it's difficult to see how user's could cope with their current filing and finding practices. There seems to be no alternative to text-based search in this case」

## 作者自己列的限制

- 樣本偏差：「Most of the users we interviewed are Apple employees ... This is a strong bias and normally we would argue against such a skewed sample. ... it is clearly unwarranted to take members of such a technically acculturated environment as representative of most users」。作者的理由是他們代表「the boundary of the leading edge」。
- 位置是否真的有幫助：「While we haven't the data to answer this question」。
- 草稿本身的限制，見上方頁註（TDE, 3/98）。

## 與摘要或常見轉述不一致的地方

- **年份**：常見的「2010」或「1994」都不對。正式發表是 EWHCI '95（1995）；1994 是 Apple TR #118 的年份；2010 只是 PDF 重新輸出的日期。
- **「找檔案沒困難」不等於「不用整理」**：這些受試者其實**都有整理**。他們全部依專案建資料夾，每人有固定重複的資料夾模板，專案結束時刻意封存、刪減，並放到專門的封存位置。作者把「找得到」歸功於這套整理：「These personal, ritualized ways of organizing information provided the groundwork for later attempts to find the information.」以及「Each user tended to have organizational structures that he or she repeated, making organizing a little less difficult and finding much easier.」所以這篇反駁的是「需要**精細**分類系統」，不是「需要整理」。它支持的是：輕量、依專案、做事時自然長出結構，加上定期封存刪減。
- **「沒困難」是自述，而且不包括封存資訊**：作者自己說封存資訊最難找；用到文字搜尋時受試者會說「desperate」「frantic」。所以「沒有嚴重困難」主要是在說 working 資訊。
- **樣本與規模已經過時**：15 人、大多是 Apple 員工、1994 年、最多 31,000 個檔案，而且大部分資訊有其他系統（資料庫）在管。作者自己預言 ephemeral 資訊暴增後現行做法會撐不住，所以這篇不能直接拿來推論今天的收藏量級。
- **Najork 等 2024 的轉述**說使用者找封存資訊時「relied on a combination of location-based retrieval ..., attribute search and full-text search」。原文的 Table 1 確實寫「categorically and spatially (and using search tools)」，但正文說 Find 與文字搜尋是最後手段、會讓人挫折。Najork 的轉述也沒有提到「no evidence of serious trouble」這個核心結論。

## 對本系列的定位

- order 0：可以當「找回不一定需要精細整理」的反證，但必須同時寫出它其實有依專案整理加上封存刪減，也要寫出 15 人、Apple 員工、1994 年的限制。
- order 1：ephemeral 資訊「留在眼前、不歸檔」與「封存時刪減、丟掉的多半能再取得」可以直接支持「收件匣／延後分類」與「什麼值得收」；「It just wasn't worth it.」支持「精細分類系統維護不划算」。

## 讀取紀錄

- 全文檔：nardi.txt，408 行，41,800 字元（`wc -lc`）。PDF 共 8 頁。
- 依序讀過：第 1–210 行（標題到 The Find Command），第 211–409 行（Find 續、Views、Is Location Really Helpful、Cultural Issues、Conclusion、Table 1、References 1–11）。合計涵蓋第 1–408 行全文。
- 管道：curl 從 tomeri.org 與 artifex.org 都成功下載，pdftotext -layout 轉文字。出處查證用 Exa 搜尋，找到上列三個著作頁與館藏頁。

# Boardman & Sasse 2004 — "Stuff Goes into the Computer and Doesn't Come Out": A Cross-tool Study of Personal Information Management

read_status=read（全文 PDF，CHI 2004 正式版排版，8 頁）

## 書目

- 作者：Richard Boardman（Dept. of Electrical and Electronic Engineering, Imperial College London）、M. Angela Sasse（Dept. of Computer Science, University College London）
- 刊物：CHI 2004, April 24–29, 2004, Vienna, Austria。Proceedings of the SIGCHI Conference on Human Factors in Computing Systems, pp. 583–590（頁碼由 Crossref 查到）。
- DOI：10.1145/985692.985766（Crossref API 回傳的標題與本文相符）
- URL：https://discovery.ucl.ac.uk/13438/1/chi2004.pdf（UCL Discovery 機構典藏）
- 讀的檔案：`curl -L -A "Mozilla/5.0"` 下載 PDF（8 頁），`pdftotext -layout` → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/boardman.txt`

## 研究設計

- **Phase 1**：31 人的半結構訪談，請受試者導覽自己主要工作電腦上的檔案、email、書籤三種收藏，訪談按 Barreau 的四個子活動（acquisition、organization、maintenance、retrieval）安排。事先請受試者「不要先整理」。截下桌面與資料夾結構，分析資料夾命名概念與跨工具重疊。
- **Phase 2**：其中 8 人參加縱貫追蹤，平均 286 天（最短 218、最長 309）。用工具擷取資料夾結構快照（含各資料夾項目數，不記檔名）：前三個月每兩週一次，五個月後再一次。另寫重大事件日記，結束時訪談；同時請他們試用作者的原型 WorkspaceMirror（WM）。
- 受試者：都有五年以上電腦經驗；Windows 25、MacOS 4、Linux 2；女 8、男 23；平均 35 歲（21–60）。29 人來自作者任職的大學；研究人員 14、學生 14、IT 支援 1，另 2 位是朋友（IT 經理 1、無業 1）。沒有酬勞。Phase 2 刻意找同事參加，以降低隱私顧慮。地點：倫敦（Imperial College、UCL）。
- 比較對象：跨工具比較（檔案 vs email vs 書籤），沒有實驗對照組。
- 量了什麼：資料夾數、深度、未歸檔項目數與比例（Table 1）；各工具的策略分類（Tables 2–4）；跨工具剖面（Tables 5–6）；Phase 2 的收藏成長率（Table 7）；質性主題。

## 可引用結果

1. **標題那句話來自一位受試者**。見 Results – Phase 1 → Organization。
   - 「One participant (P24) succinctly summed up the ongoing challenge of PIM, and the need to organize: "stuff goes into the computer and doesn't come out – it just builds up".」
2. **三種收藏的整理程度差很多：email 未歸檔四成，檔案只有 3%**。見 Table 1（n=31，最後一列 n=8）。
   - 資料夾數平均：檔案 60.4、email 32.3、書籤 17.4。平均深度：2.3、1.4、1.1。
   - 未歸檔項目平均（放在根目錄或桌面）：66、828、44。
   - 未歸檔佔收藏比例（只有 Phase 2 的 8 人）：檔案 3%、email 41.6%、書籤 38.8%。
   - 「Participants organized files most extensively, with deeper folder hierarchies, and fewer unfiled items compared to the other collections」
3. **取得方式不同：email 是「不受控」的**。見 Acquisition and Keeping。
   - 「Participants stressed how the nature of acquisition varied between the tools - from manual in files and bookmarks, to uncontrolled in email: (P11: "everything just gets stuffed into the inbox").」
   - 檔案收藏被珍視：「(P29: "Some of them I'll need again, some of the things I'm quite proud of ... why should I throw it away? It doesn't cost me anything")」
4. **收了不再用：書籤一直存、很少用；email 的引述說「90% 再也不讀」**。見 Retrieval。
   - 「Nevertheless, participants continued to save bookmarks, even though many were never used.」
   - 「We observed similar behaviour in email, in particular the acquisition and filing of messages from mailing lists, which were never read: (P29: "of the emails you do save, 90% you never read again").」
   - 「Similar "irrational" behaviour has been observed in paper archives, e.g. keeping personal copies of documents that are publicly available on the web [15].」（[15] = Whittaker & Hirschberg 2001）
   - **注意：「90%」是單一受試者 P29 的口頭說法，不是測量值。**
   - 寧可重新搜尋也不找書籤：「(P28: "If something is really exciting then I bookmark it ... when I come back to it, I just use Google")」
5. **維護很少做，多半是人生轉折時才大整理**。見 Maintenance。
   - 「Participants reported devoting little time to maintaining the three collections beyond occasional spring-cleans. Old items were rarely archived out of collections.」
   - 「Most participants reported that extensive maintenance only occurred during major life change stages such as starting a new job. Four participants reported restarting bookmark collections afresh in preference to tidying them. Our findings add to previous evidence that maintenance is of low priority [3].」
6. **找不到很少發生；發生時的三個原因**。見 Retrieval 末段。
   - 「in all three collections, failure to find items appeared to happen only occasionally: (P29: "If it exists then I'll find it. The only cases I don't is when I deleted it because I thought I didn't need it again").」
   - 「Three main reasons were cited for failure to find: (1) deleting items by mistake, (2) clutter, and (3) misfiling.」
   - 偏好瀏覽勝過搜尋：「Participants reported a strong preference for browsing over search in all three tools.」搜尋「was still seen as a last resort by most participants」。
   - 舊資料仍有價值：「although older items may be accessed erratically, they can be highly valued by people」——作者說這和「archived information is not useful」的既有說法不一致。
7. **未歸檔項目被當成提醒**。見 Bookmark Management Strategies。
   - 「They filed a subset of bookmarks on creation, leaving others unfiled, often as reminders, until they were spring-cleaned or simply abandoned」
   - email 的 E2/E3 使用者把多數信留在收件匣；P28 在 Phase 2 開了「submit here」資料夾：「that is the first time that I archived stuff to remind me ... it was paper-based before」。
8. **既有的「filer／no-filer」二分不合用，多數人混用策略**。見 Email／Bookmark Management Strategies 與 Discussion。
   - email：31 人中 E1 frequent filers 8、E2 extensive filers 14、E3 partial filers 7、E4 no-filers 2（Table 3）。21 人收件匣超過 75 封（平均 1,137）。
   - 「they exaggerate the extremes – portraying users as either messy or tidy, filers or no-filers.」
   - 跨工具剖面（Table 6）：CT1 三種工具都積極整理 8 人（26%）、CT2 只整理檔案和 email 14 人（45%）、CT3 只整理檔案 7 人（23%）、CT4 都不整理 2 人（6%）。
9. **收藏只增不減**。見 Phase 2 → Growth of Collections 與 Table 7（n=8）。
   - 檔案：每天平均新增 5.92 項、0.35 個資料夾；整個 Phase 2 項目增加 1,764（+164.6%）、資料夾增加 100（+98.6%）。「File collections increased in size for all eight participants」
   - email（只有 4 位不封存的人）：每天 5.28 項，Phase 2 增加 1,551（+75.6%）。另兩位把平均 3,600 封移出收藏，淨變化為負。
   - 書籤：每天 0.20 項，Phase 2 增加 60.5（+41.8%）。
10. **策略很少改；改變的動力來自「反思」，不是工具**。見 Changes in PIM Strategy 與 Discussion「PIM as an ongoing background activity」。
    - 8 人中 6 人是「non-changers」：「existing strategies were seen to be satisfactory or not worth changing.」P31：「Although the system I use at the moment is broken, I know how it works. To take on board a new system, I'd basically have to deal with 2 systems for a while」
    - 訪談本身就讓人動手整理：「Twelve performed ad-hoc tidying during the interviews, e.g. deleting files they had forgotten about.」
    - 「the supporting nature of PIM means that users rarely devote time to planning and executing changes in strategy. Users may benefit from increased reflection with respect to PIM」
    - 「Against our expectations, the two participants who made the most significant strategy changes did not consider WM to be a major contributory factor.」
11. **願意整理與否取決於主觀價值與擁有感**。見 Discussion → Multiple PIM strategies。
    - 「The perceived value of information influences the selection of PIM strategies. Users feel a strong sense of ownership over files, which they have often invested significant time in authoring, and are therefore willing to take the time to organize.」
    - 「Users perceive that file organization is more worthwhile since the cost of filing is offset by predicted benefits at retrieval time.」
12. **「archived」這個詞有誤導性**。見 Refining the conceptual basis of PIM。
    - 「the term "archived" is misleading, since most users do not archive explicitly.」作者改提 active／dormant／not useful／un-assessed（有用程度），以及 mine／others（擁有權）。

## 作者自己列的限制

- 作者沒有獨立的 limitations 節。文中提到的：
  - Phase 2 的 email 資料：「Due to technical difficulties we were only able to collect email data for six participants」，Table 7 只納入其中 4 位沒有封存的人。
  - 訪談本身改變了受試者行為（「The study had an immediate influence on the behaviour of most participants」），Phase 2 的兩位「changers」都說研究帶來的反思是改變的主因。
  - 招募靠熟人建立信任（「We believe that this openness was due to participants' prior familiarity and trust in the researchers」）。
- 作者沒說但讀者該知道的：樣本以學界研究人員與學生為主（28/31）、男多女少；Phase 2 只有 8 人。所有比例都是小樣本描述統計，沒有做顯著性檢定。

## 與摘要或常見轉述不一致的地方

- **「90% 的 email 存了就不再讀」常被當成研究發現轉述，其實是受試者 P29 的一句口頭估計**，研究沒有量這個數字。
- 標題那句話也是 P24 的引述，不是作者的結論。
- Table 1 的「未歸檔比例」（3%／41.6%／38.8%）只來自 Phase 2 的 8 人，不是 31 人；表內有標「[n=8] Phase 2 participants」，轉述時容易漏掉。
- 「找不到很少發生」來自受試者自述（「Participants indicated that mostly they "just knew" where to find required information」），沒有實測找回任務。
- 摘要說「our longitudinal data … suggests how the supporting nature of PIM discourages reflection by users on their strategies」，和內文一致。摘要沒提任何數字，所以沒有數字衝突。

## 讀取紀錄

- 全文檔：511 行（`wc -l`）、59,300 字元（`wc -c`）；原始 PDF 8 頁。
- 用 Read 依序讀：第 1–260 行（標題、摘要、Introduction、Previous Research、Study Objectives and Method、Participants、Results Phase 1 到 Analysis of Folder Structures、Tables 1–4）→ 第 261–512 行（Maintenance、Retrieval、Cross-tool Profiling、Tables 5–7、Strategy Changes、Phase 2、Discussion and Conclusions、參考文獻）。兩段合計涵蓋第 1–512 行，就是全文。
- 解析限制：`-layout` 保留雙欄，左右欄在同一行並排，閱讀時已依欄位分開對照；表格數字用 Table 欄位逐格核對。

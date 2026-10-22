# Alford & Mendes 2009 — 學術研究流程中的連結類型與方向性

read_status=read（ACM 出版版全文 10 頁，p. 99–108，從標題讀到參考文獻最後一條）

## 書目

- Alford, M. L., & Mendes, E. (2009). Scholarly research process: Investigating the effects of link type and directionality. In *HT '09: Proceedings of the 20th ACM Conference on Hypertext and Hypermedia* (pp. 99–108). Torino, Italy. ACM. DOI 10.1145/1557914.1557934。
- 單位：University of Auckland, Computer Science Department。
- 確切標題與出處：Exa 搜尋確認（ACM DL、researchr、DBLP、Aarhus Pure 皆一致）。
- 讀的版本：**ACM DL 出版版 PDF**（10 頁，頁碼 99–108）。`curl` 對 `dl.acm.org/doi/pdf/...` 回 403（Cloudflare 挑戰頁）；改用 Playwright 開 ACM 書目頁後，在頁面內 `fetch('/doi/pdf/10.1145/1557914.1557934')` 取得 HTTP 200、application/pdf、775,244 bytes → `pdftotext -layout` → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/alford-mendes2009.txt`（652 行，72,255 bytes）。Fig. 1（問卷結果圖）、Fig. 3–4（介面截圖）只有圖說無內容。

## 設計

兩個研究：

1. **前導問卷**（§5）：37 份回覆，紐西蘭學者（Auckland 大學資工碩博士生、Manukau 理工學院電機電腦系教員、HortResearch 少數研究員），自選樣本、匿名線上問卷。對 24 項學術搜尋／瀏覽任務評「有用程度」1–5 分。量的是**主觀覺得有用**，不是實際使用。
2. **正式實驗**（§6）：
   - 2 × 2 受試者間：連結類型（untyped vs typed）× 方向性（uni-directional vs bi-directional），四個系統 v1.1／v1.2／v2.1／v2.2（Table 2）。
   - 受試者 **31 人**（研究生與教員，研究經驗 1–13 年，多數 < 5 年，男性居多），隨機分派到四系統，作者稱有平衡各組經驗。每組約 7–8 人。與問卷受試者不同人。
   - 系統：Java＋SWT 桌面程式，資料是從 CiteSeer 抽出的 .bib 書目資料。四個系統都有「上一頁」backtracking。
   - **操弄的實際內容**（Table 3）：
     - 「bi-directional」系統（v1.2、v2.2）多了：瀏覽**引用這篇的文章**（citations leading to an article）、依關鍵字瀏覽經典文章、評估一篇文章在領域中的影響。也就是在引用圖上提供**反向（被引）連結**及由此衍生的書目計量功能。
     - 「typed」系統（v2.1、v2.2）多了：書目耦合（coupling）相似文章、找作者的共同作者、評估作者影響（v2.2 另有共被引相似）。作者說這是「author-centric features enabled through a typed link representation」。
     - **介面也不同**：untyped 系統是雙欄介面，typed 系統是三欄介面（為了作者相關功能）。
   - 任務：分兩類——「調查一個領域」與「審閱／評估一篇文章或一位作者」，依問卷結果挑選。問卷列出任務，**受試者自己記錄每題花的時間與答案的信心**。
   - 依變項：任務完成時間、使用者信心。分析：two-way ANOVA（GraphPad Prism 4.0c）。

## 可引用結果

1. **前導問卷**（§5.2）：平均 > 4 的只有三項——依標題搜文章（4.189）、依關鍵字搜文章（4.108）、從一篇文章的參考文獻往下找（4.279）。「瀏覽引用這篇的文章」3.811；找共同作者 2.838；評估作者影響 2.943。
2. **H1 typed links**（§6.3）：完成時間 p = 0.0058；信心 p = 0.0152。作者結論：「typed links provide significantly faster completion time, and greater user confidence than untyped links.」
3. **H2 bi-directional links**（§6.3）：
   - 完成時間 **p = 0.7978（不顯著）**；信心 p = 0.0278。
   - 原句：「the null hypothesis was not rejected with regards to task completion time; however it was rejected with regards to user confidence. Results supported the alternative hypothesis of greater confidence due to using bi-directional links.」
   - §6.3 末段：「Modelling scholarly research systems using bi-directional links resulted in no increase in performance, in fact for tasks relating to initial investigation of a field, it appears as if unidirectional links result in better performance; however, particularly with regards to the initial investigation of a field, bi- directional links did provide a significant improvement in confidence of users performing scholarly tasks.」
4. **H3 交互作用**：完成時間 p = 0.5804；信心 p = 0.6706。無交互作用。
5. **結論**（§7）：「We have shown empirically that scholars will benefit both in confidence and performance of scholarly research tasks when using systems that incorporate author-centric features enabled through a typed link representation.」「the confidence of users will improve when performing tasks related to investigation into a field, or tasks related to review and evaluation of articles, if they use systems that make use of bibliometric features enabled through a bi-directional link representation.」

## 作者列的限制

- 樣本小：「The limited size of the sample has an impact on this factor, with the small numbers in each group affecting the study's reliability.」（§6.4.2）；「the small sample size of each of the four groups affects the overall bias and reliability of the study」（§6.4.3）。
- 多數受試者經驗 < 5 年，可能有偏誤；以平衡各組經驗處理（§6.4.1）。
- 任務選擇可能有偏誤，但依問卷結果挑選（§6.4.1）。
- **功能多的系統可能被偏好**：「It is acknowledged that a bias towards the systems containing more features may exist」（§6.2）。
- 問卷樣本非隨機、自選（§5.3.1）。
- 未來工作：擴大樣本與變異（§6.4.3）。

## 與摘要或常見轉述不一致處

1. **摘要說「both typed and bi-directional links had significant effect on users' performance and confidence」，但雙向連結對表現（完成時間）p = 0.7978，不顯著**；作者在 §6.3 甚至寫單向連結在「調查領域」任務上看起來表現較好。雙向連結只提升了**自評信心**。`_order3-saturation.md` 照摘要轉述的「both ... performance and confidence」要修正。
2. **「雙向連結」被操弄的是功能組合，不是純粹的連結方向**。bi-directional 系統多了「看被引文章」「經典文章」「文章影響」等功能；typed 系統多了作者相關功能，並換成三欄介面。功能數、介面版面與連結屬性完全混在一起，作者也承認可能偏好功能多的系統。所以結果只能讀成「多給被引瀏覽等書目功能，使用者較有信心」，不能讀成「連結雙向本身」的效果。
3. **完全沒有報告平均數、標準差、F 值、自由度或效應量**，只有 p 值；也沒有區分任務類型的統計檢定，但結論卻對「調查領域」「審閱評估」任務分別下判斷。
4. **時間與信心都是受試者自己記錄**（「participants also recorded the time spent on each task, and their confidence in their answer」），沒有記錄答案正確率；「performance」只等於自報時間。
5. 統計詮釋錯誤：作者寫「A p value < 0.05 means that there is at least a 95% chance that the difference ... is not due to random chance」，這是對 p 值的常見誤解。H3 被描述成「typed＋bi-directional 系統 vs 控制系統」的比較，卻又當作交互作用檢定，兩者不是同一件事。
6. 相較標題「scholarly writing」，實驗只涵蓋文獻調查（survey phase）的搜尋與瀏覽任務，沒有寫作。

## 與本系列的距離（order 3〈怎麼連〉用）

- 受試者是在**別人建好的書目資料庫**（CiteSeer 書目資料）中找文章、找作者，不是自己建筆記、自己決定連結。「雙向連結」是系統自動從引用關係算出的被引清單，最接近 Obsidian 的「反向連結面板自動列出誰連到這裡」，但對象是論文引用圖，不是個人筆記。
- 31 人、單次、無正確率；結果只到「信心」層次。
- 能支持的最強說法：**在書目資料庫裡提供「被引用」反向瀏覽等功能，使用者自評信心較高，但完成任務沒有比較快。** 這是目前找到唯一直接操弄「雙向連結」的對照實驗，證據強度很弱。
- 不能支持：「雙向連結提升效率／表現」；也不能用於「連結多增加認知負荷」的爭論（本研究沒量負荷，也沒操弄連結數量）。

## 讀取紀錄

- 2026-10-22。Exa 搜尋確認標題與出處（HT '09, pp. 99–108）。
- 取得全文嘗試：Semantic Scholar API（openAccessPdf: CLOSED，無 PDF）；OpenAlex（is_oa: false, any_repository_has_fulltext: false）；Unpaywall（未用真實 email，回 422，未重試）；`curl` ACM PDF（403 Cloudflare 挑戰頁）；Exa web_fetch PDF 網址（CRAWL_LIVECRAWL_TIMEOUT；書目頁可讀，只有摘要與參考文獻）；Tavily extract advanced（回空結果）；Groundlane web_fetch（UPSTREAM_ERROR, browser-challenge 無法通過）；Jina read_url（HTTP 402 餘額不足）；Linkup fetch（連線失敗或逾時）；**Playwright 開書目頁後在頁面內 fetch PDF：成功**。
- 依序讀：L1–340（摘要、§1 引言、§2 相關研究、§3 學術流程、§4 方法與假設、§5 問卷前半）、L340–653（§5 問卷結果與效度、§6 正式實驗設計、結果、效度威脅、§7 結論、致謝、參考文獻）。
- 未讀：作者附的四系統介面 PDF（`http://www.cs.auckland.ac.nz/~emilia/hypertext/4hypertexts.pdf`，未嘗試）。

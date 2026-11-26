# Bruce, Jones & Dumais 2004 — Information behaviour that keeps found things found

read_status=read（全文 HTML，期刊正式版）

## 書目

- 作者：Harry Bruce, William Jones（The Information School, University of Washington）、Susan Dumais（Microsoft Research）。作者順序在頁面上是 Bruce, Jones, Dumais。
- 刊物：Information Research, Vol. 10 No. 1, October 2004, paper 207。頁尾「Last updated: 14 August, 2004」。
- URL：https://informationr.net/ir/10-1/paper207.html（開放取用，沒有 DOI）
- 讀的檔案：`curl -L -A "Mozilla/5.0"` 下載 HTML（91,944 bytes），用 python 去標籤轉成純文字 → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/kftf.txt`
- 確認是 Jones／Bruce／Dumais 的 KFTF（Keeping Found Things Found）研究。本文是三段研究的整合報告：keeping study、re-finding study，加上 2004 年 1 月的線上問卷。keeping study 較早的版本是 Jones, Dumais & Bruce 2002（ASIST '02），re-finding 是 Jones, Bruce & Dumais 2003（INTERACT 2003）。

## 研究設計

- **Keeping study**：24 人（6 researchers、9 information specialists 含館員、9 managers），在工作場所觀察約一小時。受試者事先列出三個「Web 密集、空檔時想做」的工作任務，挑一個做 30 分鐘並放聲思考，全程從肩後錄影；事後回顧訪談，問他們在其他情境用的 keeping 方法，以及各方法的成本與效益。managers 抽不出一小時，而且說自己很少做半小時的 Web 任務，所以改成不到半小時的電話或面對面訪談。
- **Re-finding study**：上一階段中有 12 人參加。第一次見面時從受試者的 History List 抽出最近去過的網站，請他們評估未來 12 個月再訪的機率；評到 75% 以上的網站，請他們描述上次在那裡做什麼、平常在那裡做什麼，用這些描述做提示（cue）。三到六個月後第二次見面，給提示，請他們用任何方法盡快回到那個網站。每人測 14 個網站，涵蓋從每天去到一年一兩次的頻率，排除首頁。
- **Survey**：2004 年 1 月在 KFTF 網站放一個月，214 人回覆。60.75% 在 40–59 歲，65.89% 女性；職業：librarian 49.53%、researcher 19.63%、manager 9.81%、student 4.67%。
- 比較對象：沒有實驗操弄。re-finding 依存取頻率（low／medium／high）分組比較；問卷依職業分組比較。
- 量了什麼：keeping 方法清單與功能（質性評分）；re-finding 的客觀成功率、主觀成功率、所需時間、嘗試方法數；問卷的方法使用率、每週使用頻率、選擇理由。

## 可引用結果

1. **keeping 被定義成訊號偵測問題**。見 Introduction 下的「Keeping (leaving) and re-finding information」小節（全文檔第 40 行）。
   - 「This choice can be seen as an instance of a signal detection task (Jones, 2004), that is, whenever an individual locates or encounters an information source or channel, s/he faces an essential choice, whether consciously exercised or not—should steps be taken to keep the information for later access and use? Should this information be included in my personal information collection?」
   - 三個選項：「to keep the information, to leave the information where it is (it is useful but I can find it when I need it) or to ignore the information (it is not useful and it is not likely to be useful at any time in the future.」
   - **注意：本文沒有展開「漏收 vs 多收」**。全文只有這一句提到 signal detection，沒有寫 false positive／false negative、miss／false alarm，也沒有比較兩種錯誤的成本。這個框架的出處是括號裡的 Jones 2004（"Finders, keepers? The present and future perfect in support of personal information management", First Monday 9(3)）。要引「漏收 vs 多收」這組對比，得去讀 Jones 2004，不能掛在本文名下。
2. **「留在原地」（leaving）也算個人收藏的一部分**。同一小節。
   - 「It is very important to note that the personal information collection also includes information sources and channels that have been left.」
   - 「Information that is kept and information that is left belong equally to the conceptual space that we refer to as the personal information collection.」
   - 「The ultimate test of keeping and leaving, therefore, is observed in the success or failure of re-finding.」
3. **觀察到 10 種 keeping 方法和 3 種 leaving 方法**。見 The keeping study → Results。
   - keeping：寄信給自己、寄給別人、列印、存成檔案、URL 貼進文件、加到個人網站、書籤、紙上記 URL、放到連結工具列、Outlook 便箋或行事曆項目。
   - leaving：「do nothing and count on entering the URL from memory」、「do nothing, and search for (find again) the desired Web information later on」、「do nothing and reach the Web information later from a known point of access such as a Web portal」。
   - 有人會同時用好幾種：「a number of participants indicated that they sometimes used more than one keeping method if they wanted to insure that Web information would stay found.」
4. **十種功能裡包含「提醒」和「容易維護」，而且沒有一種方法全包**。見 keeping study Results 與 Table 1。
   - 功能清單裡有：「reminding: the user is reminded about the information by the keeping method」、「ease of maintenance: the user will need to maintain and update his or her personal information collection; does the keeping method support or facilitate maintenance processes?」
   - 「It also reveals that none of the methods observed manages to provide all of the desired functions.」
   - Table 1 的高／中／低評分是研究團隊自己給的，作者說：「The reliability of these ratings may be somewhat contentious」。
5. **延遲三到六個月後，回到網站的成功率很高**。見 The re-finding study → Results 與 Table 2。
   - Table 2 客觀成功率：low 頻率 90%、medium 98%、high 100%；主觀成功率三組都是 100%；平均時間 1:42、1:07、0:47；嘗試方法數 1.2、1.2、1.0。
   - Table 2 標題有條件：「Re-finding performance when cue is effective at reinstating the Website and the task」——只算提示有成功喚起網站與任務的試次。
   - 「In 93% of the trials, participants successfully returned to the site using the first method they selected.」
   - 第一次就成功的方法：直接輸入 URL 42%、書籤 18%、搜尋引擎 18%、從別的網站連過去 16%。
   - 「It is important to note that three of these methods, accounting for 76% of the successful first-attempts at re-finding the Website in the trial, require no explicit keeping method.」
   - 「participants used three or more methods to re-find the cued Website in only 6% of the recall trials.」
6. **問卷：每人常用 5 到 7 種方法；「什麼都不做」排第二**。見 Survey 節、Tables 3–6 與 Conclusion。
   - Table 4：用過的方法平均 7.16 種（中位數 7），每週至少用一次的方法平均 4.87 種（中位數 5）。
   - Table 3（中位數，1=一天好幾次 … 6=從不）：書籤 3（每週兩次以上）；「do nothing … search again」與「do nothing … enter the URL directly」都是 4（約每週一次）。
   - Table 6：書籤每週至少用一次的比例，librarians 83.96%、researchers 64.29%、managers 95.24%、students 70%、others 80.00%。
   - 「The most common, regularly used method for keeping information was to make a Bookmark or Favourite but the second most common method was to do nothing」
   - 「at least two of the methods regularly used require no keeping behaviour. For students, three of the five top-ranked keeping actions fall into this category.」
7. **選擇理由裡，「提醒」是寄信給自己和列印的動機之一**。見 Table 7 與附錄 Tables 8、10。
   - 寄信給自己：number of access points 83 則、reminding 25 則、ease of integration 17 則。
   - 列印：portability 34、communication 22、ease of integration 21、persistence 19、reminding 12。
   - 列印的提醒理由舉例：「If I don't have time to read it and it's really important to me.」「As a reminder to reread the material.」
8. **判斷「以後用不到」時會失誤**。見附錄 Table 14（Do nothing but search），「No intention to revisit the site」類 10 則。
   - 「If I don't think I'll need it again, so I don't bookmark it - of course, the following week, I always want it!」
   - 這是本文最接近「漏收」的實證材料，不過只是問卷的開放式回答，沒有量化。
9. **搜尋引擎讓人不再存書籤**。見 Table 14「Powerful search engine (e.g. Google)」類 24 則。
   - 「Since the advent of Google, I rarely, if ever, add any links to my Favourites.」

## 作者自己列的限制

- 本文沒有獨立的 limitations 節。散見的保留：
  - Table 1：「Table 1 should be regarded primarily as an illustration of the functional approach. It is not intended to be complete」，以及「The reliability of these ratings may be somewhat contentious」。
  - managers 的觀察程序改成簡短訪談，因為「a half-hour Web task would be somewhat contrived」。
- 作者沒提但讀者應該知道的：問卷樣本近半是館員、六成五是女性，透過 KFTF 網站招募，屬自選樣本；re-finding 只有 12 人，而且只測受試者自評「再訪機率 ≥75%」的網站，Table 2 又只算提示有效的試次。所以高成功率是「預期會回去的網站、提示有效」條件下的結果。

## 與摘要或常見轉述不一致的地方

- **「keeping 是訊號偵測問題：漏收 vs 多收」不在本文裡**。本文只用一句話引述 Jones 2004 的訊號偵測說法，沒有討論兩類錯誤或成本取捨。轉述時應掛 Jones 2004，或寫「Bruce 等人 2004 沿用 Jones 2004 的訊號偵測框架」。
- 本文內部的前後不一：Results 寫第一次就成功的方法裡有「three of these methods」不需要 keeping（直接輸入、搜尋、從別站連過去，合計 42+18+16=76%，算得對）；Conclusion 卻寫「two of the top five most commonly used methods that participants chose for re-finding Web information actually required no keeping methods」。兩句說法不同，引用以 Results 的數字為準。
- 正文說「The data in Table 4 summarize how frequently participants use a keeping method」，但每週頻率其實在 Table 3，Table 4 是方法數。只是標號筆誤。
- 「十種 keeping 方法」加上三種 leaving，等於問卷裡的「thirteen methods」，前後一致。
- 摘要只講研究設計，沒講結果，所以沒有摘要與內文的數字衝突。

## 讀取紀錄

- 全文檔：1,224 行（`wc -l`）、58,081 字元（`wc -c`）；原始 HTML 91,944 bytes。
- 用 Read 依序讀：第 1–420 行（標題、摘要、Introduction、Previous research、keeping study、Table 1、re-finding study、Table 2、Survey 開頭到 Table 6 前段）→ 第 421–840 行（Table 6 其餘、各職業前五名、Table 7、Conclusion、參考文獻、附錄 Tables 8–9 開頭）→ 第 841–1225 行（附錄 Tables 9–15、引用方式、頁尾）。三段合計涵蓋第 1–1225 行，就是全文。
- 解析限制：Table 1 與 Table 7 的欄位在純文字中黏在一起，部分格子對不準；上面只引用 Table 7 中能明確對應的兩列（寄信給自己、列印），Table 1 只引作者的文字說明，不引個別格子。

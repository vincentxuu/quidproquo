# Van Kleek, Styke, Karger & schraefel 2011 — Finders/Keepers: A Longitudinal Study of People Managing Information Scraps in a Micro-note Tool

read_status=read（全文，第一作者 MIT CSAIL 個人頁上的 PDF；指定的 DSpace 作者最終稿當下回 HTTP 429）

## 書目

- 作者：Max Van Kleek, Wolfe Styke, David Karger（MIT CSAIL）；mc schraefel（University of Southampton）
- 會議：CHI 2011, May 7–12, Vancouver, BC, Canada. Proceedings pp. 2907–2916（Session: Reading & Writing）。
- DOI：10.1145/1978942.1979374
- 讀的檔案：https://people.csail.mit.edu/emax/papers/chi2011-finders-keepers.pdf（`curl -L -A "Mozilla/5.0"`，HTTP 200，1,113,469 bytes，PDF 1.4）→ `pdftotext -layout` → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/finders-keepers.txt`
  - 首頁有 CHI 2011 版權聲明「Copyright 2011 ACM 978-1-4503-0267-8/11/05...$10.00」；無 ACM 頁首頁尾（Session 名稱），判斷是作者自存版。
  - DSpace 版（hdl.handle.net/1721.1/73002）標「Author's final manuscript: final author's manuscript post peer review, without publisher's formatting or copy editing」，Exa 搜尋結果顯示其內文與本檔前半逐字相同。
  - `-layout` 為雙欄並排，引文已依欄位還原。
- 取得過程（依序）：
  1. `curl -L -A "Mozilla/5.0" https://dspace.mit.edu/bitstream/handle/1721.1/73002/Karger_FindersKeepers.pdf` → 轉址到 dspace.mit.edu/bitstreams/…/download，HTTP 429（Too Many Requests），0 bytes。
  2. Exa 搜尋找到第一作者頁 people.csail.mit.edu/emax/papers/chi2011-finders-keepers.pdf → 成功。

## 研究設計

- 工具：List-it，Firefox 側邊欄的微筆記附加元件（2008 年 8 月發布），單層清單、自由文字、關鍵字搜尋、拖放排序、可存搜尋（quick search bar）、熱鍵顯示／隱藏、快速輸入框。上線以來 16,138 註冊使用者。
- 招募：安裝時的介面邀請自願加入，限 18 歲以上、同意資料條款，不另篩選。2008/8–2010/8 共 1,514 人自願（註冊者的 9.3%）。
- **分析樣本：累積至少兩週使用的 420 人**，共 **66,151 則筆記**、21,353,324 筆活動 log。
- 補充資料：一份調查（List-it 上線一年後，問還用哪些 PIM 工具、List-it 如何搭配；Figure 5 標 255 位回覆者）；email 訪談（約同時期，自由作答描述保存策略）；Analysis 4 的 18 人訪談（2009 年 10 月，email 招募）。
- 研究問題：RQ——微筆記工具在多大程度上解決 information scraps 問題、為什麼？MNQ1 人們在給自己的筆記裡放什麼；MNQ2 筆記的用途；MNQ3 保存與整理筆記的個人策略差異。
- 四組分析：
  1. 筆記內容（form）與角色（role）的質性編碼。
  2. 個人筆記時間軸的視覺化分群 → 保存策略。
  3. 建立與檢索的動態（建立時間、搜尋詞、搜尋頻率、哪些筆記被檢索）。
  4. 訪談。
- 量了什麼：筆記長度、壽命、被刪機率、每日新增／刪除數、集合大小變化、編輯次數、每日搜尋次數、活躍天數、建立耗時、搜尋詞、筆記被關鍵字搜尋檢索的次數。
- **沒量的**：筆記是否被「看到／重讀」（在側邊欄捲動瀏覽、眼睛掃過）。「retrieved」只算關鍵字搜尋命中。

## 可引用結果

1. **樣本規模**（Data collection；Introduction）：「Our analysis is based on 66,151 notes and accompanying 21,353,324 activity logs for 420 users who met the minimum usage criteria from 1,514 that volunteered to participate in the study.」最低標準：「we selected only volunteers who had accumulated at least two weeks of tool use.」作者自稱「the largest, and longest, digital note-taking study that has yet been published」。
2. **筆記形式（form）分佈呈指數形**（Analysis 1 → Note consistency；Figure 2）。8 位編碼者對 540 則隨機筆記開放編碼 → 62 類 → 歸併為 48 類；3 位編碼者 Fleiss κ = 0.71。
   - 「The head of the distribution was dominated by many forms typically associated with structured PIM tools: calendar events, address book contact information (names with phone numbers and email addresses), to-do items, and web bookmarks. These collectively comprised only 278 (51%) of the distribution.」
   - 「The remaining 44% was distributed among forms that were typically less associated by mainstream PIM tools, such as passwords, tracking/shipping and confirmation codes, travel itineraries, meeting agendas, word definitions, code snippets, recipes, etc. The final 21 categories comprising the tail of the distribution each occurred for a single note in the sample」
3. **筆記用途（role）五類與比例**（Analysis 1 → Note roles；Figure 3）。600 則筆記、4 位編碼者；主要類別 Fleiss κ = 0.615，含次要類別（評分 ≥4）κ = 0.85；473 則（79%）至少歸一類，平均 1.44 類／則。
   - 五類：Memory triggers、Reference items、External cognition、Logging/Journalling/Chronicling、Emotional/personal archive。
   - Figure 3（n=473，可多類）：mem trg 303 (66%)、ref 215 (47%)、ext cog 59 (12%)、pers arch 61 (13%)、journal 43 (9%)。
   - 「Memory triggers comprised a majority (66%) of the coded notes, and also overlapped the most with the other categories. "Pure" memory triggers, defined as notes that contain no other information besides a key word or phrase intended to bring something to mind, comprised a large portion (57%) of these memory triggers.」
   - 「Coders labeled 47% of notes as reference items.」
4. **不同用途的筆記壽命與被刪機率不同**（Figure 4；ANOVA 以受試者為區組，Tukey-HSD）。
   - 全部筆記（66,151）：平均 162.35 字元／17.57 字／2.97 行；平均壽命 1155.86 小時；**平均被刪機率 0.55**。
   - memory trigger：p(delete) 0.70**；reference：0.45*；ext cognition：0.49；personal archive：0.30**（壽命最長 1794.79 小時*）；journal：0.411*。
   - 「probability of deletion P(3,1052)=59.40」等各特徵檢定都 p<0.001；受試者 ID 也都顯著——「differences among individuals contributed significantly」。
5. **自陳與實際不一致：網址常被當暫存，不當書籤**（Comparison with survey responses）。調查只有 36% 說會用 List-it 存書籤，但形式分析中 web bookmark 是第二常見。「kept URLs were often perceived as not actual bookmarks, but rather temporary holding places for things to look at later」；受訪者：「"[I keep track of] urls that are interesting but not worth a bookmark"」「"It's a great halfway house for bits as I bounce between references and attempt to compose something"」。作者：「This use of List-it, as a sort of task deferral tool/temporary buffer … seems to be a unique role that List-it fulfills.」
6. **四種保存策略**（Analysis 2；Figure 6、7）。3 位編碼者依時間軸視覺化分群，每人對四類各評 None／Some／Much；以「Some」合併時平均每人 1.78 (SD 0.78) 類，以「Much」合併時 0.44 類；207 位至少有一個「Some」的使用者中 81 (41%) 只屬單一策略；Fleiss κ = 0.561。
   - 「packrats - Keeping many items indefinitely without modifying them.」
   - 「minimalists - Deleting notes soon after creation to keep List-it tidy/minimal.」
   - 「periodic sweepers - Periodic cleaning up (deletion) of large numbers of notes in batch sweeps.」
   - 「revisors - Individuals who repeatedly edit the same notes over and over.」
   - Figure 7（括號為 SD）：
     - everyone (n=420)：adds/day 1.63、deletes/day 1.15、collection Δ/day 0.47、**% notes kept 33%**、edits/note 0.29、searches/day 0.17、% days active 27%。
     - packrats (n=165)：1.93 / 0.86 / **1.06** / **67%** / 0.19 / 0.25 / 25%。
     - minimalists (n=201)：1.33 / 1.34 / −0.005 / **13%** / 0.26 / 0.10 / 33%。
     - sweepers (n=39)：1.27 / 1.21 / 0.07 / 20% / 0.30 / 0.16 / 29.7%。
     - revisors (n=29)：0.35 / 0.41 / 0.02 / 38% / 1.48 / 0.29 / 18%。
   - 「Packrats kept more, longer notes, and deleted fewer; as a result, their collections grew at an average rate of 1.06 notes/day. Minimalists' note collections stayed a constant size, deleting notes the most vigorously, and also using List-it the most regularly (a full 33% of all days the tool was installed).」
   - 對應前人分類：minimalists ≈ Malone 等人的 frequent filers；packrats ≈ pilers／non-filers（「kept List-it as an extended circular file」）；sweepers ≈ Whittaker 的「cleaner-uppers」、Abrams 的「sporadic filers」；revisors 為本研究獨有。
7. **建立很快**（Analysis 3 → Creation；Figure 8a）：「The median duration was 14.2s.」（42,571 次記錄；超過 1 分鐘的 18% 未畫入。）
8. **搜尋很少用**（Analysis 3 → Search terms／How often were notes searched for?）。
   - 共 6,193 次查詢、3,263 個不同詞；最常見「todo」143 次；中位數 1。前 15 常見詞是使用者自加的標籤（「todo」「reminder」「toread」「@done」「@work」…）。搜尋詞中位數 5 字元。
   - 「Most individuals used search very infrequently; 72 (17%) never used it at all, and the mean searches per user per day over their entire use of List-it was 0.18 (SD = 0.36). A few participants used it fairly regularly; 7% averaged more than 1.0 searches per day」（每日平均只算有使用 List-it 的日子）。
   - 「Participants who created more notes also searched more often than those who created fewer notes (ρ = 0.11, p < 0.0001, df = 1509).」「While average note collection size did not correlate significantly with the amount of searching, it did vary with strategy; minimalists searched significantly less than packrats.」
9. **只有 19% 的筆記曾被搜尋檢索到；但一旦被檢索，常被檢索多次**（Which notes were retrieved?；Figure 8b）。
   - 「Out of all (N=66,151 ) notes in our sample, only 13,131 (19%) were ever retrieved in using keyword search. But if retrieved, they were often retrieved multiple times.」
   - 被檢索過的筆記：檢索次數中位數 5、M=9.41、SD=12.88。
   - 高次數尾端（65–80 次）來自 5 位使用者：他們給每則筆記加文字標籤、反覆搜尋標籤以製造多種檢視（「to essentially create multiple views of their notes collection」）。
10. **訪談：想要的是快速擷取、簡單、提醒、可見、一個地方**（Analysis 4）。18 人；8 人 (44%) 提到快速容易寫下；有人避開 Evernote：「"At first I tried using Evernote and found it too "veiled"; also too laborious to load and work with."」；「One place to put it in and get it out」。
11. **什麼都往裡放**（Conclusion）：「Like a paper diary, we found that people kept anything and everything in List-it; the lack of any preconceived notion of what did or did not belong in List-it made it a single place where everything could be stored and kept: ephemera, information of immediate need, possible later use, or that may never be actually needed.」

## 對 order 1 的意義

- 「收很多、回頭找很少」的數字：420 人的 66,151 則筆記中，**只有 19% 曾被關鍵字搜尋檢索到**；17% 使用者從不搜尋；平均每人每使用日 0.18 次搜尋。可用來說「收進去的大部分沒有被搜尋找回」。
  - 但要註明：List-it 是常駐側邊欄、筆記清單可見，許多筆記（尤其 66% 的 memory triggers）是靠「看到」發揮作用，不靠搜尋——作者明說 memory triggers「were only effective when they were noticed - thus explicit searching for these forms was unlikely」。所以 19% 不是「81% 從沒被用過」。
- 刪除很常見：全部筆記平均被刪機率 0.55；整體只留 33%（Figure 7）。這與 Bergman & Whittaker「人們傾向 overkeep」的論點在微筆記情境下**不一致**——多數 List-it 使用者（minimalists 201 人）是快刪型，只有 packrats（165 人）長期累積。可當反例或限定條件：低成本、清單可見的暫存工具裡，人會刪。
- 四種策略可用來說「收集習慣因人而異」，但 κ = 0.561 只是中度一致。
- 本文沒有量「筆記多寡對找回難易」的效果（作者只報集合大小與搜尋量不相關）。

## 作者列的限制

- 樣本偏誤（Data collection）：「While random, this process of recruitment was likely to have been biased by at least three factors」——(1) 只限 Firefox 使用者（當時約 29% 市佔）；(2) 曝光管道：Forbes、New York Times、Le Monde、PC Magazine 報導帶來大量使用者，「most of the approximately 10,000 users of its first year of deployment were readers of these publications」；(3) 自願無償參與，偏向對筆記特別有興趣、時間較多或有其他動機者。
- 角色編碼：140 則（作者寫法）筆記無法歸類，「predominantly test notes or in a language that the coders could not read」。
- 「Much」層級分群「which under-coding」（原文句子殘缺），故採「Some」層級。

## 與摘要或常見轉述不一致處

1. **摘要說「two surveys and an e-mail interview we conducted in October 2009」**；方法節寫「we conducted a survey and email interview with a subset of users」（一份調查）；Comparison 段又提到「In survey two」；Analysis 4 是 18 人「interview we conducted in October 2009」，以 email 招募（是否透過 email 進行未明說）。調查份數與訪談形式前後不一致。
2. **角色編碼人數對不上**：600 則中 473 則（79%）有歸類，「the remaining 140 notes」——600−473=127，不是 140。
3. **形式分佈百分比對不上**：結構化 PIM 類型「278 (51%)」、其餘「44%」，合計 95%，缺 5% 未交代。
4. **四種策略的人數加總 434 > 420**（165+201+39+29）；同時又說只有 207 人至少有一個「Some」歸屬。Figure 7 的 n 與分群規則的關係沒有交代清楚，引用各策略人數時要小心。
5. **搜尋相關 df = 1509**，但分析樣本是 420 人；1,514 是全部自願者人數。此相關可能用的是 1,511 人而非 420 人樣本，論文沒說明。
6. **「packrats were more likely to store reference items (as Analysis 2 revealed)」**——Analysis 2 只做時間軸分群與 Figure 7 的統計，沒有報告各策略的角色分佈，這句的依據在文中找不到。
7. **常見轉述「81% 的筆記從未被再讀」不正確**：19% 是「曾被關鍵字搜尋檢索到」，論文沒有量瀏覽或重讀。
8. **常見轉述「多數人是 packrat／囤積者」不正確**：最大群是 minimalists（201），且整體只留 33% 的筆記。
9. 「Figure 4」表頭寫「all in study (df = 66151)」、「mean lifetime in hours 1155.86 hrs (40.149)」——SD 40.149 小時遠小於各角色的 SD（如 3042.26），疑似數字錯誤或單位不一。
10. 刪除機率在 Figure 4 被寫成「probability of deletion P(3,1052)=59.40」，用 P 而非 F，且 df 與其他特徵不同。

## 讀取紀錄

- 檔案：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/finders-keepers.txt`，637 行，72,454 bytes。
- 依序讀過：第 1–150 行（標題、摘要、Introduction、Related Work、Methodology、Data collection 開頭），第 150–638 行（Data collection 後半、Analysis 1 形式與角色、Figure 2–4、survey 比較、Analysis 2 策略與 Figure 6–7、Analysis 3 建立／搜尋／檢索與 Figure 8、Analysis 4 訪談、Conclusion、Acknowledgements、References 1–18）。
  - 註：讀取順序上先讀了 150–638 行、後讀 1–150 行（第一次 Read 指定了 offset）；兩段都完整讀過，涵蓋全文，無跳讀。

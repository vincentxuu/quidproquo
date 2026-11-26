# 抽取紀錄：Alon & Nachmias 2020, Gaps between actual and ideal personal information management behavior

read_status=full（讀的是 Elsevier "Journal Pre-proof" 版，37 頁，由 academia.edu 頁面內嵌的全文文字取得；不是最終排版版。Pre-proof 頁首明說 "This version will undergo additional copyediting, typesetting and review"。表格經文字化後欄位攤平，數字逐格對讀；若要引用表格數字，最好再找最終版核對）

## 書目

- 作者：Lilach Alon、Rafi Nachmias（Tel Aviv University School of Education）
- 年份：2020（Received 2019-04-30；Accepted 2020-02-03；online 2020-02-07；刊期 2020-06）
- 刊物：Computers in Human Behavior 107, 106292
- DOI：https://doi.org/10.1016/j.chb.2020.106292
- 實際讀的檔案：academia.edu https://www.academia.edu/110257005/Gaps_between_actual_and_ideal_personal_information_management_behavior （頁面標示 42 pages，內容為 Journal Pre-proof；用 Firecrawl scrape 取得頁面 markdown，論文全文在其第 329–411 行）
  - 原始 scrape：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/alon-academia-raw.md
  - 抽出的全文（第 325–412 行，以 `fold -s -w 160` 斷行）：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/alon-preproof.txt

## 研究設計、受試者、比較對象、量了什麼

- 設計：探索性橫斷面線上問卷（Google Forms），自陳；同一份問卷先問 actual、再問 ideal 同一組做法（§3.2.1、§3.3）。
- 受試者（§3.1）：465 人（原 471，刪 6）；男 114（19–73 歲，平均 34.57）、女 351（19–68 歲，平均 30.31）；學生 285（61.3%）、受雇者 176（37.8%）、失業 4（0.9%）。全部住以色列、18 歲以上。使用 3–10 個數位平台管理個人資訊（平均 7.64）；最常用手機（3.64）、email（3.55）、筆電（3.40）。收集期 2017 下半年到 2018 上半年。
- 招募：滾雪球，連結貼在社群網路（Facebook、WhatsApp）與以色列多所高教機構課程網站。
- 工具建構（§3.2.1）：從文獻（Bergman 2008、Jones 2015）與 7 位知識工作者深訪先列 37 項做法 → 5 位 PIM 專家審查後刪 3 項 scrolling 與 4 項重疊 → 20 人預試 → 30 項 → 主成分分析刪 5 項負荷 <0.5 → 25 項。actual 與 ideal 各用 5 點 Likert（1 never 到 5 always）。
- 比較：同一人的 actual vs ideal（相依樣本 t 檢定）；男 vs 女（獨立樣本 t）；年齡與各做法的 Pearson 相關。
- 量了什麼：25 項做法的自陳使用頻率與理想頻率。沒量情緒、壓力、找檔表現或實際行為（作者明說沒觀察實際操作、沒量情感面）。

## 25 項做法的分類（§3.2.1，Table 2；四因子共解釋 46.77% 變異）

- 因子 1「active practices」（15 項，需要主動投入）：1 花時間整理資訊空間；2 依主題存檔；3 給檔案有意義的名字；4 備份個人資訊；5 存進資料夾；6 用標籤管理 email；7 用標籤管理電腦資訊；8 存檔時就想好之後怎麼找（thinking of retrieval while saving）；9 在資料夾間導覽找 email；10 在電腦資料夾間導覽找資訊；11 把 email 存進資料夾；12 整理個人照片；13 給 email 有意義的名稱；14 備份照片；15 用 App 管理個人資訊。
- 因子 2「laidback practices」（5 項，省力）：16 請別人幫忙整理；17 請別人幫忙找；18 請別人幫忙存；19 刪掉以免要做存檔決定（deleting information to avoid saving decisions）；20 堆成一堆（saving information items in a pile）。
- 因子 3「effective retrieving」（3 項）：21 用 search 找 email；22 用 search 找電腦資訊；23 寄 email 給自己。
- 因子 4「erasing practices」（2 項；Discussion 與摘要稱 "deleting practices"）：24 刪 inbox 的 email；25 刪不相關資訊。
- 原文："The factor analysis showed that the practices can be divided into four groups that explain 46.77% of the variance between participants. The first group includes 15 practices that demand the person who uses them be active while managing his or her information."
- 注意：「題號」在 Table 2（因素分析）與 Table 3–6（依平均數排序）不同，引用單項時要用做法名稱，不要用題號。

## 可引用結果

1. Gap 的方向：大多是「想做更多」（§4.3，Table 5）
   - 原文："As seen in Table 5, the gaps between actual and ideal use were significant for 22 of 25 practices. In 20 of 22 practices, the gaps were positive; in other words, participants wanted to use these practices more than they actually did. Two practices that participants wished to use less were thinking of retrieval while saving information and using "search" to retrieve email messages."
   - 「存檔時想好之後怎麼找」actual 3.83 → ideal 3.56（t=3.71, p<.01）；「用 search 找 email」actual 3.93 → ideal 3.82（t=2.09, p<.05）。
   - 不顯著的三項：在電腦資料夾導覽找資訊（4.02 vs 4.10, t=-1.37）、堆成一堆（2.41 vs 2.49, t=-1.02）、以及 effective retrieving 裡的一項（見下方「不一致」第 4 點）。

2. 最大的 gap 在「少用的主動整理做法」（§4.3）
   - 原文："we found the most significant gaps were in the least used active practices for organizing information items, mainly those that could help to arrange cluttered information spaces, such as saving email messages in folders, backing-up information items, using tags to manage items in the computer and email, using applications to manage personal information, organizing personal photos, and navigating to find email messages."
   - Table 5 例：把 email 存進資料夾 2.78 → 3.74（t=-13.61）；用標籤管理 email 2.48 → 3.37（t=-13.17）；整理照片 3.10 → 3.96（t=-12.83）；備份照片 3.44 → 4.21（t=-12.38）；用標籤管理電腦資訊 2.65 → 3.45（t=-12.27）；用 App 2.44 → 3.30（t=-12.11）。
   - 「retrieving」幾乎沒有 gap：effective retrieving 因子平均 gap 0.06（SD 0.87）。

3. 實際使用（§4.1，Table 3）
   - 原文："The mean scores of 16 out of 25 practices were equal to or higher than 3, indicating that participants used a variety of PIM practices to manage their personal information spaces."
   - 因子平均：effective retrieving 3.70、erasing 3.46、active 3.27、laidback 1.86。
   - 最常用：在電腦資料夾導覽找資訊 4.02、用 search 找 email 3.93、用 search 找電腦資訊 3.93、存進資料夾 3.89。
   - 最少用：請別人幫忙整理／存／找（1.59–1.63）。

4. 理想使用（§4.2，Table 4）
   - 原文："The mean scores of 20 out of 25 practices were higher than 3, and the mean scores of seven practices were higher than 4, indicating that participants wished to use more PIM practices than they actually did. The practices they wanted to use the most were erasing practices (x̄ =3.95, SD=1.07)."
   - 最想做：刪不相關資訊（4.11）、存進資料夾（4.31）、依主題存（4.20）、備份照片（4.21）與備份個人資訊（4.16）。

5. 刪除的 gap 與數位囤積的連結（Discussion）
   - 原文："Participants indicated large gaps in their deleting behavior and were eager to delete irrelevant information items. These gaps could devolve from people's difficulty deleting information items they are attached to (Cushing, 2013; Odom et al., 2013) or their fear of losing important information that might be needed in the future (Luxon et al., 2019)."
   - 原文："Overall, the major gaps in organizing behavior could be attributed to the need to organize and manage a growing amount of personal information in overloaded personal information spaces (Schull, 2018). It is increasingly difficult to control the management of personal information (Odom et al., 2012) and avoid digital hoarding and clutter in the personal space (Luxon et al., 2019; Sweeten et al., 2018). This suggestion is backed up by our finding that participants wanted to use more practices that could help them control clutter."
   - 這是作者的解釋，不是本研究量到的因果。

6. 資料夾仍是偏好的整理方式（Discussion）
   - 原文："It seems that organizing information items in folders is still a useful and preferred way to manage information; our findings suggest it may be too soon to give up folders despite the availability of other organizing and retrieving practices, such as tagging or using "search""

7. 性別：actual 幾乎一樣，ideal 與 gap 女性較大（§4.4.2，Table 6）
   - 原文："As Table 6 indicates, gender differences were barely visible for actual PIM practices, with one significant difference. However, we did find significant differences in the ideal use of PIM practices and in the extent of the gaps between actual and ideal use. Female participants ideally wanted to use seven practices more than male participants. They also exhibited larger gaps than male participants between the actual and ideal use of 10 practices."
   - 作者自己提醒：女性樣本遠多於男性，結論要謹慎。

8. 年齡：相關都很小（§4.4.1；Discussion）
   - 25 項中 8 項 actual 與年齡顯著相關，|r| 在 .09–.21 之間；年長者較少用行動與線上平台上的整理做法、較常刪 inbox email（r=.15）且想刪更多（r=.14）。
   - 原文（Discussion）："Surprisingly, we found only minor correlations between age and actual/ideal use of the identified PIM practices."

9. gap 與負面情緒：只是理論推論（Discussion）
   - 原文："As Higgins' theory suggests, however, large gaps between actual and ideal PIM behavior could harm people's motivation to manage the personal information space and trigger negative feelings, such as dissatisfaction, anxiety, agitation, and frustration (Rowe et al., 2017; Straumann & Higgins, 1987). The gaps we found may explain the negative feelings related to the experience of PIM described by other researchers (e.g., Robinson & Johnson, 2012; Watkins et al., 2015; Bergman & Whittaker, 2016), but these relations need further examination."

10. 實務建議（Discussion）
    - 消費者訓練三原則：反思自己的 PIM 行為、在線上與他人分享 PIM 技巧、接觸新平台。
    - 平台設計：主動提醒整理（filing、naming、tagging、backing-up），標出應刪的項目（相似、不相關、舊）；對數位能力較低的人建議更多自動化。原文："In these cases, we recommend more platform automation, whereby more PIM actions would be done automatically by the platform without the need of the user to actively employ them."

## 作者自列的限制（Discussion 末段）

- 自陳問卷；ideal 題組排在 actual 之後，順序可能影響作答。
- 沒有觀察受試者實際存檔、整理、找檔的行為。
- 滾雪球抽樣，影響推論，特別是描述性研究。
- 男女人數差很多；年長者少於年輕者。
- 沒有檢驗 PIM 行為的情感面，儘管它對 gap 很重要。
- 沒有定義 PIM 使用者類型（建議未來依 UTAUT 取向分類）。
- （Discussion 中另提）tagging 與 email 歸檔的結果與文獻不同，可能是 PIM 做法改變，也可能是自陳偏誤。

## 與摘要或常見轉述不一致的地方

- 摘要與 Highlights 說 "Larger gaps could be associated with negative feelings and a sense of low efficacy" 與 "Negative feelings caused by large gaps should be addressed in platform design"，但本研究沒有量任何情緒或效能感，作者在限制裡自己寫 "We did not examine affective aspects of PIM behavior"。「gap 造成負面情緒」是引 Higgins 自我差距理論的推論；Highlights 用 "caused by" 比正文更強。情緒資料在同團隊另一篇（Alon & Nachmias 2020, IJHCS 144:102503，同一批 465 人）才量。
- 「受試者是知識工作者」：61.3% 是學生、37.8% 受雇者；只有工具建構時的 7 人深訪是知識工作者。不能轉述成「知識工作者的 PIM gap」。
- 「gap 是正的＝想用更多做法」：20 項正 gap 裡包含「想刪更多」，所以「想用更多做法」不等於「想存更多」；最大的願望是刪除與整理。
- Pre-proof 內部數字矛盾（引用前要對最終版）：
  1. §4.3 寫 "There were major gaps in the laidback practices (x̄ =1.86, SD= 0.80)"，但 1.86（0.80）正是 laidback 的 actual 平均（Table 3），Table 5 的 laidback 列也印同一數字；而 Discussion 寫 "We found smaller gaps for practices that involve asking other people for help"。laidback 的 gap 數字應視為排版錯誤，不要引用。
  2. Table 4 的 effective retrieving ideal 平均印成 3.70（0.94），與 actual 完全相同，疑似複製錯誤。
  3. §4.1 文字給的 SD（effective retrieving 0.74、active 0.74、erasing 0.95）與 Table 3（0.94、0.80、1.09）不一致。
  4. Table 5 第 22、23 列的 actual 值（3.45、3.93）與 Table 3 的第 22（search 找電腦資訊 3.93）、23（寄 email 給自己 3.45）對調；所以「哪一項 effective retrieving 做法有顯著正 gap（t=-5.23）、哪一項不顯著（t=0.51）」從 pre-proof 無法確定。
  5. §4.4.1 "sending emails to one's self (r=-.98, p<.01)" 顯然是筆誤（其餘 r 都在 ±.2 以內）。
  6. Table 6 第 4 列女性 actual 印成 "1.27 (0.07)"，與 Table 3 的整體平均 3.61 不符。
  7. Table 3 第 3 列百分比 "5.8 6.2 2 .0 35.1 32.9" 加總不到 100（缺一位數字）。
  8. Introduction 引 "Scull, 2018"、Related work 引 "Berman & Whittaker, 2016"，應為 Schull、Bergman（拼字錯）。
- 分類名稱：§3.2.1 與 Table 標為 "erasing practices"，摘要與 Discussion 開頭稱 "deleting practices"，指同一組 2 項。

## 讀取紀錄

- 全文檔：fulltext/alon-preproof.txt，527 行，72,540 字元（`wc -lc`）；來源 scrape 檔 alon-academia-raw.md 773 行、137,409 字元，其中非論文部分（academia.edu 頁面、相關論文摘要、參考文獻清單重複）沒納入 preproof 檔。
- 依序讀過：第 1–180 行（封面、摘要、§1、§2.1–2.4、§3.1、§3.2.1、Table 2 前半）→ 第 181–360 行（Table 2 後半、§3.2.2、§3.3、§4.1–4.4、Table 3–6、§5 Discussion 前半）→ 第 361–527 行（Discussion 後半、訓練與設計建議、限制、References、致謝、Highlights）。三段涵蓋 1–527 行。
- 管道與失敗原因：
  1. ScienceDirect 摘要頁（Exa web_fetch）→ 只有 Highlights、Introduction 與 section snippets。
  2. ScienceDirect 全文頁（Groundlane web_fetch）→ 403 "IP blocked"。
  3. ScienceDirect 全文頁（Firecrawl scrape）→ 只有 "Article preview"，付費牆。
  4. Unpaywall：is_oa=False, oa_status closed；OpenAlex 只有 DOI 位置。
  5. Tel Aviv University CRIS 頁（curl）→ 200 但只有摘要，無 PDF 連結。
  6. Jina read_url（academia.edu、TAU）→ HTTP 402 帳戶餘額不足。
  7. Tavily extract（academia.edu、ResearchGate）→ 空結果。
  8. academia.edu（curl）→ 403。
  9. academia.edu（Exa web_fetch）→ 只有摘要、圖表標題與參考文獻；ResearchGate 該 ID 回傳的是另一篇無關論文（巴西鳥類），URL 對應錯誤。
  10. academia.edu（Firecrawl scrape, waitFor 4000）→ 成功，頁面內嵌 Journal Pre-proof 全文文字。

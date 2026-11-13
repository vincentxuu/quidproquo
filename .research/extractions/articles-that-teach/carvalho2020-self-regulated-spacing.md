# 抽取紀錄：Carvalho、Sana、Yan 2020，npj Science of Learning 5: 2

- **書目**（對 PMC 全文 XML 的首頁核過）：Paulo F. Carvalho、Faria Sana、Veronica X. Yan。Self-regulated spacing in a massive open online course is related to better learning. *npj Science of Learning* 2020; 5: 2. doi:10.1038/s41539-020-0061-1。PMID 32194982、PMCID PMC7076029。收稿 2019-06-18、接受 2020-02-25、刊出 2020-03-16。CC BY 4.0。三位作者標明貢獻相同、共同第一作者，姓名按字母排（XML 的 Author contributions）。單位：Carnegie Mellon University、Athabasca University、University of Texas at Austin。
- **原文檔**：`.research/raw/learning-content/q4-time/carvalho2020-self-regulated-spacing-mooc.md`，135 行（`wc -l`；最後一行沒有換行，實際 136 行）、32,030 位元組。只有正文（前言、結果、討論、方法），**沒有摘要、補充表、致謝與聲明**。
- **這次補抓的檔**（存在 `.research/raw/learning-content/q4-time/carvalho2020-extra/`）：
  - `PMC7076029-fulltext.xml`：Europe PMC 全文 XML（`https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7076029/fullTextXML`）。用來讀摘要、作者、致謝、資料與程式碼聲明；另外用它逐句比對過原文檔，正文沒有缺句。
  - `41539_2020_61_MOESM1_ESM.pdf` 與轉出的 `supplementary-tables.txt`（64 行）：出版者 Springer Nature 的補充材料（`https://static-content.springer.com/esm/art%3A10.1038%2Fs41539-020-0061-1/MediaObjects/41539_2020_61_MOESM1_ESM.pdf`），兩頁，Supplementary Table 1–5。正文每個迴歸都指到這五張表，全讀。
  - `Fig1.jpg`–`Fig3.jpg`：PMC 的三張圖，都看過。
  - 沒讀：MOESM2（Reporting Summary）。
- **讀取日期**：2026-10-14
- **版本**：刊出版（開放取用）。
- **供哪幾篇用**：order 16（第 11 列）。
- 行號「L」指原文檔；「Supp」指補充表。

## 研究設計

- **類型**：觀察性的資料探勘研究，分析一門 MOOC 既有的系統紀錄。沒有任何分派，沒有操弄。
- **課程**（L122–126）：Coursera 上的心理學導論 MOOC，Georgia Institute of Technology 的 Anderson Smith 教授開，2013-03-25 到 2013-06-15，共 12 週。資料取自 DataShop 第 863 號資料集，分析程式碼在 GitHub 公開（L122）。
- **受試者**（L124）：5,615 人註冊並同意資料供研究使用，其中 **747 人完成課程（有考期末考），分析只用這 747 人**（13.3%）。其中 639 人 11 次小考全做（L126）。原文沒有報年齡、性別、國籍、學歷。
- **教材**（L130）：12 個單元加一個開頭的「學習策略」單元。每單元有線上教科書（含短片與互動活動）與教師錄的講課影片。全課程 214 頁、645 個活動、187 張圖、43 支講課影片。
- **只看得到教科書的行為**：L130「We did not have access to the videos and for the purpose of our research questions, we focused on students' engagement with the online textbook only.」看影片的時間與次數不在資料裡。
- **評量**（L126、L134–136）：每週五早上 8 點釋出該週的選擇題小考，下週五截止；不限時、每人只能考一次；有多名學生獲准延期。單元 12 沒有小考。小考佔總成績 30%（最低一次自動不計），期末考佔 40%（06-10 釋出、06-15 關閉，涵蓋全課程），另 30% 是寫作作業；總分 70% 以上通過。
- **變項怎麼定義**（L44–52）：
  - **間隔**：L46「We defined spacing as the number of sessions that students took to complete a given unit. The more sessions they had, the more spaced we considered learning to be.」是**節數**，不是兩次學習相隔多久。平均每單元 4.08 節（SD 3.17，中位數 3）。
  - **一「節」的切分規則原文沒有寫**。正文與方法都沒有說隔多久沒動作算新的一節。Fig 1f 畫了「節與節之間的平均時間」的分布，但這個變項沒有進任何分析。
  - **學習時間**：把每節的時間加總，每節的時間是節內各事件時間差的總和（L48）。同一段接著寫「Students took an average of 2 days to complete each unit (SD = 3 days, median = 1 day)」，這是日曆天數還是累計時數，原文沒說清楚。
  - **保留間隔**：最後一次讀的頁面或做的活動，到開始考該單元小考的時間差。**平均 45.73 小時、SD 146.49 小時、中位數 26.12 分鐘**（L50）。也就是一半的「學生 × 單元」紀錄是讀完半小時內就考。
  - **活動完成數**：該單元完成的活動數，活動是穿插在單元裡的填空、選擇、拖放題（L52）。
- **前測**（L36）：20 題是非題，考一般心理學。
- **結果指標**：11 次單元小考成績、期末考成績（平均 27.72，SD 5.50，範圍 4–35）（L40）。兩者相關 r = 0.69（L40）。Fig 1d 顯示小考是 10 分制，平均約 8.7 分，多數紀錄集中在 8–10 分。
- **統計**（L56）：所有迴歸都放前測成績與單元學習時間當預測變項，單元與學生當隨機因子；所有預測變項先做 z 分數標準化；雙尾。作者說把學生放進隨機因子，是為了把效果解讀成同一個學生在不同單元之間的差異。

## 結果（逐項）

β 都是標準化係數。「同一學生跨單元」指模型以學生為隨機因子。

| # | 結果 | 數字 | 比的是什麼 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 前測成績 | 平均 10.93（SD 3.46，範圍 2–20），20 題是非題；原文寫成「11%」 | — | Prior knowledge | L36 | 「The average score was 11% (M = 10.93, SD = 3.46, range 2–20).」 |
| 2 | 前測與成績的相關 | 對小考平均 r = 0.19，對期末考 r = 0.20，都 p < 0.001 | 學生之間 | Prior knowledge | L36 | 「Although these correlations are small, we included pretest score as a predictor variable」 |
| 3 | **節數與小考成績（主要結果）** | β = 0.10，SE = 0.02，t(6593.84) = 6.41，p < 0.001 | 同一學生跨單元：某單元分成比較多節 vs 比較少節；控制前測、單元學習時間、保留間隔 | Supp Table 1 | L64 | 「Results (see Supplementary Table 1) revealed that spacing was a significant predictor of unit quiz grades」 |
| 4 | 保留間隔與小考成績 | β = −0.07，SE = 0.01，t(6664.91) = −5.19，p < 0.001（隔越短分數越高） | 同上模型 | Supp Table 1 | L64 | 「shorter retention intervals being associated with higher quiz grades」 |
| 5 | 節數 × 保留間隔（**不顯著**） | β = 0.02，SE = 0.01，t(6512) = 1.28，p = .203 | 同上模型 | Supp Table 1 | L64 | 「there was not a significant spacing by retention interval effect … Spacing was better for quiz performance, even at short retention intervals.」 |
| 6 | 學習時間與小考成績（**負向**，正文沒提） | β = −0.03，SE = 0.01，t = −2.07，p = .039 | 同上模型 | Supp Table 1 | Supp 第 13 行 | 表列「Time spent −0.03 0.01 −2.07 6284.03 .039」 |
| 7 | 節數與期末考成績 | β = 0.13，SE = 0.05，t(727) = 2.76，p < 0.01；沒有對應的補充表 | 學生之間：整門課分比較多節的學生 vs 比較少節的學生；控制整門課的總時間、保留間隔、前測 | 正文 | L66 | 「students who spaced their study more also performed better in the final exam」 |
| 8 | 期末考成績預測節數 | β = 0.06，SE = 0.02，t(787.7) = 2.82，p = 0.005 | 學生之間；控制前測與單元學習時間 | Supp Table 2 | L80 | 「those students who performed better on the final exam were also more likely to space their study more」 |
| 9 | 同一模型裡前測預測節數（**負向**，正文沒提） | β = −0.07，SE = 0.02，t = −3.12，p = .002（前測高的學生節數較少） | 同上模型 | Supp Table 2 | Supp 第 27 行 | 表列「Pretest grade −0.07 0.02 −3.12 739.1 .002」 |
| 10 | 同一模型裡學習時間預測節數 | β = 0.32，SE = 0.01，t = 37.36，p < .001（花越多時間、節數越多） | 同上模型 | Supp Table 2 | Supp 第 26 行 | 表列 |
| 11 | 節數 × 期末考成績 | 交互作用 β = −0.04，SE = 0.01，t(6017) = −3.12，p = 0.002；節數主效果 β = 0.08，SE = 0.01，t(5644) = 5.24，p < 0.001；期末考主效果 β = 0.44 | 以期末考成績當「能力」 | Supp Table 3 | L82 | 「Spacing was related to higher quiz performance for students with lower ability but not for students with higher ability levels.」 |
| 12 | 活動完成數預測節數 | β = 0.35，SE = 0.01，t(4828) = 28.06，p < 0.001 | 同一學生跨單元；控制前測與單元學習時間 | Supp Table 4 | L92 | 「students who completed more activities also tended to space their learning more」 |
| 13 | 節數 × 活動數 | 交互作用 β = −0.03，SE = 0.01，t(6415) = −2.71，p = 0.007 | 同一學生跨單元 | Supp Table 5 | L94 | 「When students completed fewer activities, the positive relationship between spacing and quiz performance was greater than when they completed more activities.」 |
| 14 | **把活動數放進模型後，節數的主效果不顯著**（正文沒提） | 節數 β = 0.03，SE = 0.02，t = 1.81，p = .070；活動數 β = 0.26，SE = 0.02，t = 14.94，p < .001 | 同 #13 的模型 | Supp Table 5 | Supp 第 60–61 行 | 表列「Spacing (number of sessions) 0.03 0.02 1.81 6559 .070」「Number of activities 0.26 0.02 14.94 6079 <.001」 |
| 15 | 原始資料的圖 | Fig 2a：期末考成績最高的四個五分位組，小考平均都在約 8.5–9.4 分之間，隨節數幾乎是平的；最低的一組從約 7.4 升到約 7.7。Fig 2b：各節數分位組的線幾乎重疊，都隨活動數上升 | 原始分組平均，未控制共變項 | Fig 2 | L72–78 | 「Note that in this figure we plot raw values for all variables. However, our analyses include covariates that are not taken into account in these graphs.」 |

## 作者自己列的限制

原文沒有獨立的限制小節，下面是散在各處、作者自己寫的保留：

- **不能排除第三變項**：L104「although we cannot completely eliminate the existence of a third variable that explains these findings (e.g., motivation, life events), our analytic approach does allow us to more closely relate students' decisions to their learning outcomes」。
- **用期末考當「能力」有混淆**：L70「We acknowledge that the final exam grade is potentially confounded with actual spacing use during the course.」作者說改用前測得到「similar results」，但沒有給數字；又說前測題少、變異小、檢定力低（L70）。
- **沒有影片的資料**（L130）。
- **不能分辨機制**：L12「our work cannot disambiguate among these possibilities—and was not designed to」；L14「we cannot directly test these theories」。
- 討論裡把「間隔與做活動可能走同一個機制（提取）」寫成「One possible explanation」（L108），是推測。
- 沒有前一學期成績或標準化測驗可用（L70）。

## 與摘要說法不一致的地方

逐項對過（摘要讀自 `PMC7076029-fulltext.xml`），有五處：

1. **因果語氣**：題目與正文多數地方用「related to」，摘要末句卻寫「This study highlights the positive impact of spacing in real-world learning situations」，並說間隔「might work as a buffer, improving performance」。正文自己承認不能排除第三變項（L104）。資料是相關。
2. **「間隔」其實是節數**：摘要寫「distributing study across multiple sessions—increasing spacing」，沒有說間隔的操作定義只是節數、沒有用到間隔多長，也沒有說一節怎麼切。
3. **「能力」是期末考成績**：摘要寫「Students with higher ability … were more likely to space their study」「Spacing benefits, however, were largest for the lower-ability students」，沒有說這裡的能力是同一門課的期末考，作者在正文承認它與間隔本身混淆（L70）。而且同一張補充表裡，前測成績對節數是負向的（β = −0.07，p = .002，Supp Table 2），與「能力高的人節數較多」方向相反；正文說用前測「found similar results」（L70），和這一列對不上。
4. **節數的主效果在放進活動數後不顯著**（Supp Table 5，p = .070），摘要與正文都沒有提，只報交互作用。
5. **樣本是完課者**：摘要只說「students' natural studying behaviors in massive, open, online course」，沒有說分析只含 5,615 人中完成期末考的 747 人。

另有兩個原文的筆誤或不清楚：L36 把前測平均寫成「11%」，但 M = 10.93、滿分 20，換算是約 55%，接近是非題亂猜的水準；L94 的「for those who are now completing many activities」照上下文應是「not」。

## 與清單「要撐的結論」不合的地方

清單寫的是「學習者自己分散的觀察資料（相關，不是因果）」。這句撐得住，但引用時還要加上原文裡的四個限定，否則會說過頭：

- **量的是「分成幾節」，不是「隔多久」**（L46），而且節數與學習時間高度相關（Supp Table 2，β = 0.32）。寫成「間隔較長的學生考得較好」不對，原文沒有分析間隔長度。
- **效果很小而且脆弱**：標準化係數 0.10（L64）；小考 10 分制、平均約 8.7 分，接近天花板（Fig 1d）；把活動完成數放進模型後，節數的主效果變成 p = .070（Supp Table 5）。
- **多數紀錄是讀完馬上考**：保留間隔中位數 26 分鐘（L50），小考不限時、在家線上作答。這不是延後測驗下的保留。
- **只有完課的 13%**（747／5,615，L124），而且只有教科書的紀錄、沒有影片的（L130）。

「低能力學生受益較多」這個次要發現不建議引：能力用的是期末考成績，作者自己說有混淆。

## 讀取紀錄

| 順序 | 位置 | 內容 |
|---|---|---|
| 1 | 原文檔 L1–22 | 標題、前言全部（九段） |
| 2 | 原文檔 L24–66 | 結果：變項描述、Fig 1 圖說、前測、學習成果、學習行為、推論統計的做法、間隔與小考成績 |
| 3 | 原文檔 L68–94 | 結果：能力與間隔、Fig 2 與 Fig 3 圖說、活動與間隔 |
| 4 | 原文檔 L96–112 | 討論全部（八段） |
| 5 | 原文檔 L114–136 | 方法：倫理、課程與受試者、教材、評量 |
| 6 | XML 首頁與文末 | 期刊、DOI、作者與單位、日期、授權、摘要全文、致謝（NSF BCS-1824257、SSHRC 430-2017-00593）、作者貢獻、資料與程式碼聲明、利益衝突（無）。參考文獻只掃過 |
| 7 | supplementary-tables.txt 第 1–64 行 | Supplementary Table 1–5 全部；另直接看過 PDF 兩頁的版面，欄位與數字一致 |
| 8 | Fig1–Fig3 | 三張圖都看過 |

**表格對照**：正文沒有表，所有係數都在補充材料的五張表裡；五張表的每一列都對過正文引的數字（L64、L80、L82、L92、L94），正文引到的全部相符。正文沒引、只在表裡的三列（上表 #6、#9、#14）另外標出。

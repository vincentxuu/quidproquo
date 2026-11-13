# 抽取紀錄：Shillington、Lo、Hobbie 2025，Frontiers in Education 10:1636446

**書目**：Katie J. Shillington（UC San Diego 神經生物系；Wilfrid Laurier University 心理系）、Stanley M. Lo（UC San Diego 細胞與發育生物系）、Lawrence Hobbie（Adelphi University 生物系）。A utility value intervention to support student engagement in online upper-level undergraduate courses. *Frontiers in Education*, 10:1636446（Sec. STEM Education）。doi: 10.3389/feduc.2025.1636446。收稿 2025-05-27、接受 2025-08-11、刊出 2025-09-04。CC BY 開放取用。作者姓名與單位對過檔案首頁（L51–73）與文末引用格式（L609）。清單這一列原本沒有作者，現已補上。

**原文檔**：`.research/raw/learning-content/q1-learner/frontiers_uv_online2025.txt`（681 行、67,875 字元、68,122 位元組；由同目錄 `.html` 轉出）。正文 L79–L206，參考文獻 L208–592，附錄 Table A1 在 L594–603，其餘是網站導覽與頁尾。
**本次補抓的檔**（都存回同一目錄）：
- `frontiers_uv_online2025.pdf`：出版社 PDF，11 頁。來源 `https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2025.1636446/pdf`
- `frontiers_uv_online2025_supp1.docx` 與 `_supp1.txt`（114 行、7,985 字元）：補充資料，兩種寫作題的全文。來源 `https://www.frontiersin.org/api/v4/articles/1636446/file/Supplementary_file_1.docx/1636446_supplementary-file_1/1`

**版本**：刊出版。
**讀取日期**：2026-10-14
**供哪幾篇使用**：order 14（#7）。
**表格對照**：Table 1、Table 2、Table A1 對過 PDF 版面（`pdftotext -layout` 轉出後逐格比對），與文字檔一致。正文裡幾個可疑的統計值（見「正文內部的不一致」）也回 PDF 確認過，是原文就這樣印，不是轉檔錯。

## 研究設計

- **類型**：作者自稱「cross-sectional randomized controlled trial」（L99）。實際上是以**討論小班（recitation section）為單位**的群集隨機分派：「The recitation sections were randomly assigned ... so all students in a recitation section received the same intervention」（L120）。
- **時間與地點**：2020 年春季學期（10 週的 quarter），美國一所四年制公立大學（倫理聲明寫明是 UC San Diego，L181）。這是 COVID-19 剛爆發、課程緊急改成線上的第一個學期。
- **受試者**：1,243 人（用途寫作 589、控制 654）。有人口資料的 1,226 人（用途 583、控制 643）：女性 68.95%／67.96%；URM（代表性不足的少數族裔）23.67%／21.77%（Table 1，L102–117）。亞裔與白人算非 URM。
- **課程**：四門生物科學高年級課，五位教師——遺傳學（兩個大班）、基因體學、演化、人類生殖；主要是大三、大四生；都有先修課要求。課程「generally used a mix of lecture and active learning instructional strategies」（L120）。每個大班有 2 到 11 個討論小班。**原文沒有寫總共幾個小班、各分到哪一組幾個。**
- **同意方式**：退出制（opt-out）；沒填退出表的視為同意（L120）。
- **基線檢查**：兩組累積 GPA 沒有差別，t(1,224) = 0.85，p = .39（L120）。
- **處理**：每門課兩次寫作作業（因為是 10 週學期，比文獻建議的三次少一次），透過學習管理系統（LMS）發放，各有 5 天完成。兩次作業題目相同。作業依科學內容、寫作品質、是否照指示來評分，教師給少量分數（L122）。教師不知道哪個小班是哪一組（L120）。
  - **用途寫作**：選一個課堂概念、自己擬一個問題、回答它，再說明這個主題怎麼用在自己的生活、怎麼幫助別人（自我＋利他兩種用途）。
  - **控制寫作**：選一個課堂概念、自己擬一個問題、用課堂筆記與讀物回答它。
  - 補充資料的題目全文顯示兩者差在：用途版要求四段（總覽、科學細節、「Make it personal」、應用到幫助他人），控制版只要前兩段；兩者都是 1–2 頁、雙行距。用途版附了三組「個人用途＋對他人的用途」範例，並有一句「Since you will be writing about science from a personal perspective, you can use personal pronouns (I, we, you, etc.).」控制版沒有這一句。
- **量了什麼**（學期末從 LMS 與註冊組取得，L124）：
  - 課程總成績（數字成績；有人口資料的那份只有等第，轉成 4 分制）
  - 頁面瀏覽次數（LMS 頁面被載入的次數）
  - 參與次數（在討論區發文、繳交作業或測驗的次數）
  - 累積 GPA、性別、URM 身分
  - 兩篇作文的 LIWC 文字分析：字數、第一人稱單數代名詞、第二人稱代名詞、認知歷程詞、社會歷程詞
- **沒有量的**：興趣、知覺用途、動機、自我效能等任何心理變項，一項都沒有（L163、L171）。也沒有任何課後追蹤。
- **兩份資料檔**（L127）：送去註冊組匿名化的那份被拿掉了頁面瀏覽與參與資料，所以「成績 × 人口變項」與「參與」分在兩份不能合併的資料檔裡。
- **分析**：獨立樣本 t 檢定（變異數不等時用 Welch）、二因子變異數分析（URM × 條件）、多元線性迴歸。全部以**個別學生**為分析單位。

## 結果（逐項）

| # | 結果 | 數字 | 對照條件 | 節／行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 作業完成率兩組沒有差別 | 作業一 1,003 人完成（用途 473、控制 530），χ²(1) = 0.11，p = .74；作業二 992 人（用途 478、控制 514），χ²(1) = 1.15，p = .28 | 用途寫作 vs 摘要式控制寫作 | Results，L130 | 「there were no significant differences between conditions in writing assignment completion」 |
| 2 | **課程成績：沒有差別** | 用途 88.98 ± 7.41（n = 557） vs 控制 88.60 ± 7.72（n = 620）；差 0.38（95% CI −0.48 到 1.25），t(1,175) = 0.87，p = .39，d = 0.05 | 同上 | Primary purpose，L132 | 「Utility value participants had slightly higher course grades ... however, there was not a statistically significant difference between groups」 |
| 3 | 成績（4 分制）：條件主效果沒有 | F(1, 1104) = 1.45，p = .23，partial η² = .001 | 同上；排除拿 P／NP 的 118 人 | L133 | 「There was no statistically significant main effect of condition on course grades」 |
| 4 | 成績：URM × 條件交互作用沒有 | F(1, 1104) = 0.057，p = .81，partial η² = .00 | 同上 | L133 | 「There was no statistically significant interaction between URM status and condition for course grades」 |
| 5 | 成績：URM 主效果顯著 | F(1, 1104) = 45.00，p < .001，partial η² = .039；非 URM 高 0.23（95% CI 0.16–0.30，4 分制） | 非 URM vs URM | L133 | 「non-URM students had significantly higher course grades than URM students」 |
| 6 | 累積 GPA：條件主效果與交互作用都沒有；URM 主效果顯著 | 條件 F(1, 1222) = 0.45，p = .50；交互 F = 0.36，p = .55；URM F = 157.77，p < .001，partial η² = .11，差 0.35（95% CI 0.29–0.40） | — | L134 | — |
| 7 | **頁面瀏覽：用途組較多** | 用途 858.17 ± 405.29（n = 563） vs 控制 797.88 ± 347.69（n = 630）；差 60.29（95% CI 17.14–103.44），Welch t(1113.86) = 2.741，p = .006，d = 0.16 | 用途寫作 vs 控制寫作 | Secondary purpose，L137 | 「The utility value group engaged with the course website course more (858.17 ± 405.29) than the control group (797.88 ± 347.69).」 |
| 8 | **參與次數：用途組較多** | 用途 40.49 ± 9.09（n = 566） vs 控制 38.86 ± 8.81（n = 629）；差 1.63（95% CI 0.61–2.65），t(1,193) = 3.15，p = .002，d = 0.18 | 同上 | L139 | 「The utility value group participated in the course more (40.49 ± 9.09) than the control group (38.86 ± 8.81).」 |
| 9 | 迴歸：性別與 URM 預測成績 | R² = .039；URM b = 0.23，β = 0.20，p < .001；性別 b = −0.014，β = −0.013，CI −0.073 到 0.046（不顯著） | — | Tertiary purpose、Table 2，L141–152 | 「Gender and URM status accounted for 3.9% of the variation in course grade.」 |
| 10 | 作文字數：用途組較長 | 503.01 ± 117.44（n = 434） vs 447.04 ± 109.67（n = 482）；差 55.96，t(914) = 7.46，p < .001，d = 0.49 | 兩篇都交的人，兩篇平均 | Exploratory，L156 | 「The utility value group wrote longer essays」 |
| 11 | 第一人稱單數代名詞：用途組較多 | 1.13 ± 0.71 vs 0.25 ± 0.52（佔總字數百分比）；Welch t(787.69) = 21.25，p < .001，d = 1.52 | 同上 | L157 | — |
| 12 | 第二人稱代名詞：用途組較多 | 0.76 ± 0.66 vs 0.15 ± 0.42；Welch t(721.21) = 16.60，p < .001，d = 1.24 | 同上 | L158 | — |
| 13 | 社會歷程詞：用途組較多 | 6.90 ± 2.11 vs 4.53 ± 2.02；差 2.38（95% CI 2.11–2.64）；原文印「t(914) = 0.18, p < 0.001, d = 0.01」（見下方不一致第 1 點） | 同上 | L159 | — |
| 14 | 認知歷程詞：用途組較多 | 13.36 ± 2.13 vs 11.78 ± 2.53；差 1.59，Welch t(910.01) = 10.29，p < .001，d = 0.68 | 同上 | L160 | — |

### 作者對「成績為什麼沒差」的解釋（都是推測，原文沒有檢驗）

| # | 解釋 | 行號 | 原文一句 |
|---|---|---|---|
| 15 | 高年級生已經選定主修、本來就有動機 | L165 | 「perhaps because students enrolled in upper-division courses are already committed to their majors and motivated to perform well」 |
| 16 | 課程主題對這些學生本來就有用途（例如醫護預科） | L165 | 「the topics of these courses might have inherent utility value for students based on their trajectory」 |
| 17 | 疫情初期評分寬鬆，兩組成績都偏高 | L165 | 「it is plausible that students' grades in both conditions were higher than usual, thus explaining the lack of significance between conditions」 |
| 18 | 摘要再加一條：因為是線上課 | L87 | 「perhaps because these classes were online, because they were upper-level instead of introductory, or because the study was conducted during the COVID-affected spring 2020 quarter」 |
| 19 | 唯一可比的研究結果相同 | L165 | 「The only comparable study of which we are aware tested the utility value intervention in an online upper-level inorganic chemistry course ... showed no statistically significant difference in grades」（Wang & Lewis 2022；轉述，我沒有讀那篇） |

作者在「未來研究」一節把兩個沒有回答的問題並列（L169）：用途寫作是不是在高年級課普遍無效、是不是在線上課無效。這份資料**分不開**「線上」「高年級」「疫情」三個因素，作者自己這樣說。

### 導言裡可能被轉引的數字（都是作者引別人的，我沒有核對原出處）

- Lazowski & Hulleman 2016 統合分析：92 個介入研究平均效果量 0.49；隨機對照設計 0.43（64 個研究），準實驗 0.64（28 個研究）（L91、L93）。原文把作者姓拼成「Lazoswki」。
- Freeman 等 2014：主動學習對成績的平均效果量 0.47，158 個研究（L91）。
- 2021 年秋季美國約 61% 的大專生至少修一門線上課，28% 全部線上（L94，NCES 2023）。
- 文獻對用途寫作的整體建議：一學期三次、先寫對自己的用途再寫對別人的、給一些選擇（L92）。

## 作者自己列的限制（L171）

1. 沒有量任何心理變項（為了減輕疫情期間學生的負擔）。
2. URM 學生樣本相對小；人口資料是事後才拿到的，能報告的很少。
3. 只有量化資料。
4. 單一學校、單一學期，可能無法推論到其他學校與學生。
5. 研究在疫情期間進行，可能影響推論；壓力、學習環境被打亂、動機下降都可能干擾介入效果。

作者沒有列、但從設計與補充資料看得出的（我的觀察，不是原文）：
- **分派單位是小班、分析單位是學生。** 沒有任何群集校正（多層次模型或群集穩健標準誤），也沒有報告小班數。第 7、8 條的 p 值（.006、.002）在群集校正後可能變大；d 只有 0.16 與 0.18，這兩條「顯著」不算穩。
- **頁面瀏覽與參與是整個學期的累計**，包含第一次寫作作業之前的時段；原文沒有分作業前後。
- **LIWC 的差異有一大部分是題目直接要求的。** 用途版題目多兩段（個人、幫助他人），並明講可以用 I、we、you。作文較長、人稱代名詞較多、社會歷程詞較多，是照題目寫的結果，不能當成「更投入課程」的證據。
- 控制組也做了一樣份量的選題、擬問題、回答問題的寫作，所以「成績沒差」的比較對象是摘要式寫作，不是什麼都不做。
- 成績接近天花板（兩組平均都約 89 分），118 人拿 P／NP 被排除在等第分析之外。

## 與摘要說法不一致的地方

1. **摘要與結論把頁面瀏覽、參與次數的差異說成「The intervention had a positive effect」「overall, the intervention was successful」（L85、L174）。** 研究自訂的主要目的是成績（L95 標「primary」），主要結果是沒有差別（d = 0.05）。把次要與探索性結果當成「成功」，比資料說得滿。
2. **結論說作文分析顯示用途組「were more actively engaged with course content」（L174），討論說用途組的作文「significantly more meaningful」（L167）。** 資料只有字數與四類詞的比例；題目本身就要求寫個人與他人的應用、並允許用人稱代名詞（補充資料）。「更有意義」「更投入」是作者的詮釋。
3. **摘要說用途組「used more pronouns, social process words, and cognitive process words」。** 方向沒錯，但社會歷程詞那一項的檢定統計量在正文裡是錯的（下一節第 1 點）。
4. 摘要沒有提：分派單位是小班；控制組也寫作；沒有量興趣或知覺用途；頁面瀏覽與參與的效果量只有 0.16 與 0.18。
5. 結論最後建議學校在大一線上入門課採用用途寫作以幫助 URM 學生（L174）。這份研究的 URM × 條件交互作用是零（F = 0.057），樣本是高年級課，這個建議沒有本研究的資料支持。

正文內部的不一致：
1. **社會歷程詞（L159）**：平均 6.90 ± 2.11 對 4.53 ± 2.02、差 2.38、CI 2.11–2.64，卻印「t(914) = 0.18, p < 0.001, d = 0.01」。t = 0.18 不可能 p < .001，d = 0.01 也與平均差對不上。以報告的平均與標準差粗算，d 約 1.15、t 約 17（這是我算的）。PDF 也是這樣印，屬原文錯誤。
2. **同意方式**：方法寫退出制、沒退出就視為同意（L120）；倫理聲明寫「The participants provided their written informed consent」（L181）。
3. **研究類型**寫「cross-sectional randomized controlled trial」（L99），兩個詞互相矛盾；實際是群集隨機的實地實驗。
4. 自由度的寫法不一致：t 檢定寫成「t(1, 175)」「t(1, 224)」「t(1, 193)」，應是千分位逗號被拆開（1,175、1,224、1,193）；F 檢定寫成「F(1, 1, 104)」，應是 F(1, 1104)。
5. 人數：總樣本 1,243，Table 1 是 1,226，成績 t 檢定 1,177，頁面瀏覽 1,193，參與 1,195，LIWC 916。每個分析的人數都不同，原文只籠統說是資料收集與匿名化方式加上遺漏值造成的（L101）。
6. 討論引 Asher 等 2023 說用途寫作讓弱勢學生「14% more likely to persist in STEM」（L164）；這是轉述，我沒有核對。
7. Table 2 的 URM 係數是正的（b = 0.23），正文說非 URM 成績較高，所以編碼應是非 URM = 1；原文沒有寫編碼方式。

## 與清單「要撐的結論」不合的地方

清單寫：「線上課裡用途寫作提高參與，但成績沒有差別。**反向／無效**；也是清單裡最接近線上自學情境的一篇」。

**「成績沒有差別」撐得住**：d = 0.05，95% CI −0.48 到 1.25 分（百分制），n = 1,177。要帶的限定：比較對象是同樣份量的摘要式寫作；成績近天花板；疫情初期評分寬鬆；高年級主修課。

**「提高參與」要降級：**
- 「參與」是兩個 LMS 計數（頁面載入次數、發文與繳交次數），效果量 d = 0.16 與 0.18。
- 以小班分派卻以學生為單位做 t 檢定，沒有群集校正，顯著性不可靠。
- 計數是整學期累計，含介入之前。
- 沒有量任何心理變項，所以不能說「提高興趣」或「提高知覺用途」。
- 比較穩的寫法：「用途組的平台活動量略多（約多 8% 的頁面瀏覽），成績沒有差別；研究以小班為單位分派但沒有做群集校正」。8% 是我以 60.29／797.88 算的。

**「最接近線上自學情境」撐不住：**
- 這是 2020 年春季因疫情緊急改成線上的**學分課**：有教師、有討論小班、混合講授與主動學習、有測驗與期中期末、作業計分。學生是已選主修的大三大四生。
- 與沒有教師、沒有成績、自己決定要不要讀下去的線上自學差得很遠。原文自己把「線上」「高年級」「疫情」並列為三個分不開的可能原因（L87、L169）。
- 文章若要引這篇，只能說「遠距授課的大學課」，不能當成自學情境的證據。

**清單沒有列、但這篇原文可以撐的：**
- 用途寫作對 URM 學生沒有特別的幫助（交互作用 F = 0.057，p = .81），與作者引的先前研究方向不同。
- 作者引的另一個線上高年級課研究（Wang & Lewis 2022，無機化學）也是成績沒有差別；那篇我沒讀，只能寫「作者引述」。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | 主檔 L1–350 | 網站導覽與圖表目錄（L1–50）；題名、作者、單位；摘要；導言六段；方法（設計、受試者、Table 1、程序、介入、資料收集、分析）；結果四節全部與 Table 2；討論；未來研究；限制；結論；各項聲明（資料、倫理、作者貢獻、經費、致謝、利益衝突、生成式 AI）；註腳 1；參考文獻 1–19 |
| 2 | 主檔 L351–681 | 參考文獻 20–52（掃過）；附錄 Table A1（四門課的評量組成）；關鍵詞、引用格式、收稿與刊出日期、編輯與審稿人、著作權；網站頁尾 |
| 3 | `_supp1.txt` 全部（114 行） | 補充資料：用途版與控制版寫作題全文（目標、擬問題、回答與範例、段落結構、格式） |
| 對表 | PDF 經 `pdftotext -layout` 轉出的 751 行 | Table 1（約第 226–245 行）、Table 2（第 372–384 行）、Table A1（第 735–746 行）逐格對過；L159 的 t 與 d 值也對過 PDF |

原文沒有圖。補充資料只有一個檔，已讀完。

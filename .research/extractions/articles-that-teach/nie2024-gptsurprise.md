# 抽取紀錄：Nie、Chandak、Suzara、Malik、Woodrow、Peng、Sahami、Brunskill、Piech，〈The GPT Surprise〉，arXiv:2407.09975v2

## 檔頭

- **完整書目**：Allen Nie、Yash Chandak、Miroslav Suzara、Ali Malik、Juliette Woodrow、Matt Peng、Mehran Sahami、Emma Brunskill、Chris Piech。〈The GPT Surprise: Offering Large Language Model Chat in a Massive Coding Class Reduced Engagement but Increased Adopters' Exam Performances〉。arXiv:2407.09975，**第 2 版，版面上的日期是 2025-07-15**（L10「arXiv:2407.09975v2 [cs.CY] 15 Jul 2025」）。作者姓名與順序對過 PDF 首頁。九人除 Suzara 屬 Stanford 教育學院外，其餘屬 Stanford 資訊科學系（L11–14）。沒有 DOI，沒有期刊或研討會刊登資訊。
- **原文檔**：`.research/raw/learning-content/q6-evaluate/nie2024gptsurprise.txt`（1,563 行、113,432 字元）；PDF 同名 `.pdf`，33 頁。文字檔是 `pdftotext -layout` 轉的，但原文是單欄版面，段落沒有左右交錯；圖裡的數字與圖說混排，表與圖另外對過 PDF。
- **讀取日期**：2026-10-14
- **版本**：預印本（arXiv v2），未經同儕審查。清單寫的年份是 2024（v1 的年份），手上的檔是 2025 年 7 月的 v2；引用時要寫明版本。
- **供哪幾篇用**：order 28（清單 28#7）。

## 研究設計

- **類型**：隨機對照試驗，一門課、一次開課。隨機分派的是「有沒有收到開放 GPT-4 聊天介面的通知並在首頁看到按鈕」，不是「有沒有使用」。作者稱前者為 Advertisement Effect（即意向治療效果，intent-to-treat），後者為 Effect for Adopters（即順從者的處理效果）（L220–234）。
- **場域**：Stanford 的免費線上入門程式課 Code in Place，2023 年春季，六週。課程 4 月 24 日開始，6 月 5 日結束（Figure 1，L100–126）。課程以真人助教帶的小組（section）為核心（L680–682）。
- **受試者**：核准入學 8,762 人，來自 146 國；第一週結束仍「活躍」（做完第一週全部作業，L1234–1235）的 5,831 人進入實驗（L171–172）。平均年齡 31.4 歲（SD 10.4），女性約 54–55%（Table 1；附錄 A.3 另寫女性 51.59%，見「內部不一致」）。
- **分派**：60% 實驗組（n = 3,581）、40% 對照組（n = 2,250）（L172–173）。分派日，Figure 1 圖說寫 5 月 8 日（L123–124）。
- **介入內容**：實驗組在第 4 週開始時收到一封電子郵件，首頁側欄多一個按鈕，可進入課程自建、外觀仿 ChatGPT 的 GPT-4 聊天介面（L176–179）。進入前要先讀一頁說明，同時列出好處與壞處（會出錯、可能妨礙學習、可能出現令人不適的回應）（L222–225、Figure A.6 L1519–1555）。作者預先把作業題放進提示，讓 GPT-4 不容易直接給答案（L649–651）。對照組沒有收到信，也看不到按鈕。
- **介入期間**：9 天（L179、L658）。
- **實驗組內的第二層隨機**：實驗組再等機率分成四組，介面上顯示不同類型的建議問題（Coding、Resources、Emotional Support）或不顯示（No Rec）（L613–620）。說明頁另有偏正面與偏警示兩種版本（L705–707）。
- **量了什麼**：
  1. 參與度：是否參加自願的診斷測驗（主要指標）；第 6 週作業完成率、第 6 週小組出席（輔助）（L187–188、L287–291）。
  2. 診斷測驗分數：5 題多小題的程式題，共 73 個評分項目，用單元測試批改，換算成 0–100 分（L189、L1345–1359）。學生拿不到分數，只拿到逐題回饋；結業證書只註明有沒有考（L1475–1478）。
- **何時量**：測驗在介入開始 9 天後舉行，為期三天（Figure 1 寫 5 月 24–26 日）。沒有延宕測驗，沒有課程結束後的追蹤。
- **測驗參加率**：5,831 人裡 2,668 人參加（45.8%）（Figure 2，PDF 第 4 頁；L181）。
- **使用率**：實驗組 3,581 人裡 510 人在測驗前用過（14.2%）（L182–183）。
- **統計**：全文共 15 個假設檢定，Bonferroni 校正的做法是把 p 值乘以 15；內文的「P」是校正後的值，另報「Unadjusted P」（L306–308、L1363–1369）。參與率的差用 95% 信賴區間；測驗分數的差一律用 **90%** 信賴區間（BCa bootstrap，1,000 次）（Table 2、L1377–1379）。
- **缺漏分數的處理**：沒考的人分數缺漏。報兩種：「Ignore Missingness」（只算有考的人，假設完全隨機缺漏；作者自己說這個假設在這裡不太可能成立，L495–496）、「Impute for Missingness」（用 Ridge 迴歸預測沒考的人的分數，2 折 cross-fitting；模型只能用有考的人訓練與評估，L1391–1392、L1434–1436）。

## 結果（逐項）

### 使用率

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 採用率 | 14.2%（510／3,581） | 實驗組內，測驗前用過 vs 沒用過 | §2、Table 1 | L182–183 | 「Only 14.2% (N=510) students in the experiment group used GPT-4 prior to the midterm exam.」 |
| 2 | 通知信的開信與點擊 | 寄 3,581 封，2,778 人開信（77.6%），539 人點進介面連結（15.1%） | 實驗組內 | 附錄 A.2 | L1236–1237 | 「2,778 students (77.6%) opened the email. 539 students (15.1%) clicked on the link to our custom ChatGPT interface.」 |
| 3 | 作者對 14% 的定位 | 同一門課另一個自願工具（程式風格回饋，也用信件通知）的參與率是 7% | 同課程另一工具（引 Woodrow 等 2024，非本研究資料） | §4.1 | L712–716 | 「Though 14% is low for a mandatory feature in a course, it is a rather typical adoption rate for an optional tool in this particular course.」 |
| 4 | 課外使用 ChatGPT | 同課程另一份同期研究的課後問卷：約 2% 的學生說課程期間用過 | 無對照；自陳；不是本研究的資料 | 附錄 A.8、Figure 2 圖說 | L1467–1469 | 「Only 2% of the students responded that they did.」 |

### 參與度（意向治療效果）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 5 | 測驗參加率 | 實驗組 44.1% vs 對照組 48.5%；Δ = −4.3 個百分點，SE 1.3，95% CI [−6.9, −1.7]；未校正 P = .001，校正後 P = .020 | 收到通知並可用 GPT-4（3,581 人）vs 沒收到（2,250 人） | §3.1、Figure 3(b) | L293–297 | 「representing a significant difference in means (∆=-4.3pp, SE=1.3, 95% CI=[-6.9, -1.7]). This effect is very highly significant using a traditional t-test (Unadjusted P =.001) and is still highly statistically significant after applying Bonferonni correction (P =.020).」 |
| 6 | 第 6 週作業完成率 | 實驗組 45.2% vs 對照組 49.8%（圖）；Δ = −4.6 個百分點，SE 1.3，95% CI [−7.2, −1.9]；校正後 P = .01，未校正 P < .001 | 同上 | §3.1、Figure 3 | L297–299 | 「we found a significant difference in means for week 6 homework completion rate between the two groups (∆=-4.6pp, SE=1.3, 95% CI=[-7.2, -1.9], P =.01, Unadjusted P <.001)」 |
| 7 | 第 6 週小組出席 | 實驗組 58.8% vs 對照組 61.6%（圖）；SE 1.31，CI (−5.41, −0.26)；校正後 **不顯著**（P > .05） | 同上 | Figure 3(b) 圖說 | L279–282 | 「Week 6 section attendance (SE=1.31, CI=(-5.41, -0.26), P >0.05)」 |
| 8 | 實驗開始前兩組作業完成率 | 沒有可辨識的差異（只有圖，沒有數字） | 同上，第 2–3 週 | §3.1、Figure 3(a) | L298–300 | 「initially there was no discernible difference between students in the experimental and control groups before week 4」 |
| 9 | 同課程其他實驗的方向 | 作者說同一門課、同樣通知方式的其他實驗，新功能都讓參與度上升 | 引 Markel 2023、Demszky 2023、Bigman 2021，非本研究資料 | §3.1 | L345–348 | 「in the same course, all other experiments with the same advertisement mechanisms have produced a result where the novel feature drives up engagement」 |

### 參與度的次群體分析（作者標為探索性）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 10 | 低 HDI 國家（HDI < 0.55）的測驗參加率，方向相反 | 實驗組 42.3%（111 人）vs 對照組 27.5%（69 人）；Δ = +14.8 個百分點，SE 7.2，95% CI [0.6, 29.0]，Cohen's d = 0.31；未校正 P = .045，**校正後 P = .680，不顯著** | 16 個低 HDI 國家、第一週後仍活躍的 180 人 | §3.1、Figure 4(a) | L374–379 | 「However, our sample size is small, and the raw Student's t-test (Unadjusted P =.045) is not statistically significant after adjusting for multiple hypothesis tests (∆=14.8pp, SE=7.2, 95% CI=[0.6, 29.0], P =.680).」 |
| 11 | 低 HDI 國家的採用率 | 111 人裡 16 人（14.4%） | 與全體 14.2% 相比 | §3.1 | L367–369 | 「In the experiment group, 16 students (14.4%) interacted with GPT-4 – almost identical to the GPT-4 usage for the general student population (14.2%).」 |
| 12 | 依 HDI 分四級的參加率（圖上數字，PDF 第 7 頁） | Low：實驗 42.3%、對照 27.5%；Medium：44.1%、45.9%；High：46.0%、51.1%；Very High：43.7%、49.6% | 實驗 vs 對照，各級 | Figure 4(a) | L313–340 | 「Students from countries with low HDI (<0.55) participated in the exam more, but students from countries with very high HDI (≥0.8) seemed to participate less.」 |
| 13 | 依年齡 | 18–22 歲：實驗 39.8%、對照 41.0%；23–30：40.4%、46.5%；31–40：45.0%、50.8%；>41：54.5%、58.2%（圖）。內文只說 23–40 歲「suggested」有差，沒有給檢定 | 實驗 vs 對照，各年齡層 | §3.1、Figure 4(b) | L388–389 | 「A difference between exam participation is suggested but only for students between 23-40 (Figure 4(b)).」 |
| 14 | 依先前程式經驗（自陳 0–18） | 0–5（3,180 人）：實驗 43.0%、對照 45.8%；6–10（2,037 人）：43.8%、51.4%；>10（614 人）：50.8%、52.9%（圖）。6–10 那組 Δ = −7.5 個百分點，SE 2.3，95% CI [−12.0, −3.1]，校正後 P = .014 | 實驗 vs 對照，各經驗層 | §3.1、Figure 4(c) | L393–395 | 「We notice a significant decrease in engagement for students in the less experienced group (∆=-7.5pp, SE=2.3, 95% CI=[-12.0, -3.1], P =.014, Unadjusted P <.001).」 |
| 15 | 英語流利度 | 不流利（≤ 10，551 人）兩組沒有差；流利（> 10，5,280 人）差距大。只有圖，沒有數字與檢定 | 實驗 vs 對照 | §3.1、Figure A.1(a) | L402–403 | 「We see no exam participation difference between the experiment and control group for students who are less fluent in English and a large difference for students who are fluent」 |
| 16 | 性別 | 沒有看到交互作用 | 實驗 vs 對照 | §3.1、Figure A.1(b) | L403–405 | 「We did not see an interaction of gender with exam participation rate change beyond the general trend」 |
| 17 | 各國的參加率變化 | 至少 20 名學生的國家裡，最高：匈牙利 +32.1%、巴基斯坦 +29.4%、埃及 +23.6%、菲律賓 +16.5%、法國 +13.6%；最低：墨西哥 −22.6%、泰國 −22.6%、葡萄牙 −23.8%、阿根廷 −25.3%、南非 −28.7%。沒有檢定 | 實驗 vs 對照，各國 | Figure A.3 圖說 | L1293–1298 | 「The overall average change in exam participation is -4.4% across all countries.」 |

### 測驗分數

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 18 | 有考的人的平均分數 | 實驗組 87.0（N = 1,579，SD 18.7，中位數 95.9）；對照組 86.1（N = 1,089，SD 20.0，中位數 95.9） | 只算有考的人 | §3.2、Table 1 | L474–477 | 「Many students achieved a perfect score on the exam.」 |
| 19 | 沒考的人補 0 分後的平均 | 實驗組 38.4（SD 44.9）vs 對照組 41.7（SD 45.2）。作者說補 0 不妥，只當說明 | 全體 5,831 人，沒考算 0 | §3.2 | L486–488 | 「A zero score is almost definitely an underestimate of the potential score of any student who did not take the exam.」 |
| 20 | E1 意向治療效果，只算有考的人 | +0.91 分，90% CI [−0.00, 1.89]，效果量 0.05 | 實驗組 vs 對照組 | Table 2 | L434（PDF 第 9 頁） | 「Ignore Missingness +0.91 [-0.00, 1.89] 0.05」 |
| 21 | E1 意向治療效果，補缺漏 | +0.67 分，90% CI [−0.37, 1.72]，效果量 0.09 | 同上 | Table 2 | L435 | 「Impute for Missingness +0.67 [-0.37, 1.72] 0.09」 |
| 22 | 實驗組裡沒用的人 vs 對照組 | 只算有考的人：Δ = 0.54，SE 0.81，90% CI [−0.79, 1.87]，d = 0.03，校正後 P > .99；補缺漏：Δ = 0.43，SE 0.38，90% CI [−0.19, 1.05]，d = 0.03，P > .99。**不顯著** | 收到通知但沒用（3,071 人）vs 對照組 | §3.2 | L519–523 | 「This suggests that the advertisement has little impact on exam scores if students do not subsequently use GPT-4.」 |
| 23 | 採用者 vs 整個對照組（作者說這不等於 E2） | 只算有考的人：Δ = 2.36，SE 1.14，90% CI [0.49, 4.24]，d = 0.13，校正後 P = .836，未校正 P = .056；補缺漏：Δ = 2.89，SE 0.69，90% CI [1.76, 4.02]，d = 0.21，P < .001 | 實驗組裡用過的 510 人 vs 對照組全體 | §3.2 | L529–536 | 「The difference between the adopters and all the students in the control group does not equal E2 (the improvement in exam performance for adopters).」 |
| 24 | E2 採用者的效果（LATE），補缺漏 | +6.86 分，BCa 90% CI [0.30, 14.13]，效果量 0.40。**校正後不顯著** | 工具變數估計：會採用的人「有用」vs「假如沒得用」 | §3.2、Table 2 | L555–559 | 「Though the difference is not statistically significant after adjusting for multiple hypothesis testing (BCa 90%CI=[0.30, 14.13], ES=0.40), the estimated effect size is near medium, at 0.40, suggesting the potential of a substantial positive effect on exam scores on adopters.」 |
| 25 | E2 採用者的效果（LATE），只算有考的人 | +4.49 分，效果量 0.23；信賴區間 Table 2 寫 [−0.31, 9.66]，註腳 4 寫 [−0.34, 8.98]。兩者都跨過零 | 同上 | Table 2、註腳 4 | L439、L569–572 | 「This effect had the same trend, though it was slightly smaller: (∆=4.49, BCa 90% CI=[-0.34, 8.98], ES=0.23).」 |
| 26 | 採用者與非採用者的原始數字 | 採用者測驗參加率 62.4%、平均 88.4（SD 17.3）；非採用者 41.1%、86.6（SD 19.0）；對照組 48.4%、86.1 | 自我選擇的兩群，沒有因果意義 | Table 1 | L209–211（PDF 第 5 頁） | 表列 |
| 27 | 全體學生的學習效果 | 這個設計估不出來 | — | §3.2 | L465–467 | 「given that we didn't require students to use GPT-4, we cannot estimate this effect given our experiment.」 |

### 誰會用、聊什麼

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 28 | 預測誰會用（羅吉斯迴歸，變項已標準化，N = 3,581，pseudo R² = 0.01414） | 先前小組出席：係數 0.2126，p < .001（勝算比 1.24）；國家 HDI：−0.1856，p < .001（0.83）；年齡：0.1422，p = .006（1.15）；性別：0.0988，p = .043（1.10）；英語流利度、申請分數、申請用心度、程式測驗分數、朋友分數、先前經驗都不顯著 | 實驗組內 | §3.3、Figure 6、Table A.2 | L604–611、L1444–1458 | 「We did not find statistical significance in other characteristics, including English fluency.」 |
| 29 | 對話主題 | 概念釐清占 37.6%–53.3%；語言與工具支援 13.6%–20.5%；想套出作業答案的占 1–4% | 四個提示組之間 | §3.3、Figure 7 | L622–626、L644–645 | 「We only found 1-4% of conversations are directly related to students trying to deceive the GPT-4 to give them answers to the homework question.」 |
| 30 | 建議問題能改變對話主題 | 同一主題在不同組之間最多差 15.7 個百分點 | 四個提示組 | §3.3 | L656–658 | 「The percentage difference of the same topic between different groups can be as high as 15.7% (e.g., "Concept Clarification").」 |
| 31 | 四個提示組的學習成果 | 沒有差異（沒有給數字） | 四個提示組 | §3.3 | L661 | 「We did not find any educational outcome difference between these groups.」 |
| 32 | 說明頁偏正面 vs 偏警示 | 長期參與度沒有顯著差異（沒有給數字） | 兩種說明頁 | §4.1 | L706–708 | 「We observed no significant difference in long-term engagement levels between the group that received positive emphasis and the group that emphasized cautionary points.」 |
| 33 | 用介面作弊 | 檢查對話紀錄，沒有發現有人把測驗題貼進去；無法查證課外是否用了公開的 ChatGPT | — | §3.3、附錄 A.8 | L652–654、L1471–1474 | 「we are not able to verify whether students have used OpenAI's public ChatGPT interface outside the class.」 |
| 34 | 防護有沒有用 | 作者說沒有花足夠時間測試防護容不容易被繞過 | — | §3.3 | L650–651 | 「However, we did not spend enough time testing whether it was easy to bypass our safeguards.」 |
| 35 | 「想找工作」動機與參加率 | 46.8% 的學生申請時勾選想當程式設計師；23–40 歲 49.0%，其他年齡 43.7%。實驗組內，勾選求職的人測驗參加率 43.4%，沒勾的 44.7%，差 1.26 個百分點。沒有檢定，也沒有和對照組比 | 實驗組內，有勾 vs 沒勾 | §4.2 | L750–756 | 「there was a 1.26 percentage point decrease in exam participation among learners in the experimental condition who listed a job as a motivation for taking the course (43.4% exam participation) compared to those who did not list jobs (44.7% exam participation).」 |

### 為什麼參與度下降：作者明說是假說

§4.2 開頭：「On their own, these results do not suggest why there was a difference in engagement. In this section, we present a few theories on such a causal mechanism.」（L729–731）。四個假說都沒有被這份資料檢驗：

1. 工作威脅（L733–756）：看到 GPT-4 讓人覺得學寫程式和找到工作的關聯變弱。唯一的資料佐證是上表第 13、14、35 項。
2. 不信任 AI（L758–791）：引 Ipsos 2023 的 31 國調查；作者說各國信任度的排序與各國效果的排序一致，但沒有呈現這個比對。
3. AI 對人的身分威脅（L793–803）。
4. 學習者找到更好的學法，轉去直接用 OpenAI 的網站，於是在課程紀錄上看起來像是退出（L805–825）。作者說這個假說的佐證是對話內容看起來有教學價值。

## 作者自己列的限制

1. **單一課程、單一梯次、單一時間點**（L666–694）。四點：(1) 課程是自願參加的，和必須修完才有成績的 K-12 與大學課不同；(2) 課程以真人教師為核心，吸引來的學習者可能和一般大型線上課不同；(3) 效果可能只適用於程式教育，程式正好是大型語言模型特別強的領域；(4) 實驗在 2023 年做，當時對 AI 的社會氣氛特殊。原話：「We urge the reader to be cautious about extrapolating these results into different contexts.」（L690–691）
2. **介面設計可能影響結果**（L696–717）：通知用信件與首頁按鈕，沒有嵌進寫程式的環境；使用前要先讀一頁利弊說明，「perhaps the existence of any handout, even if positive and short, could have been a point of friction that impacted outcomes」（L709–710）。結論也說下降「may be influenced by the particular advertisement framing used in sharing access to the tool」（L1017–1018）。
3. **排除限制（exclusion）無法驗證**（L548–550、L921–929）：LATE 成立的前提是通知只透過「有沒有用 GPT-4」影響分數。作者說這個假設「impossible to verify」，他們「believe it is reasonable」。
4. **完全隨機缺漏的假設不太可能成立**（L495–496）；補缺漏的模型「may introduce bias」（L502–503），而且只能用有考的人訓練（L1391–1392）。
5. **低 HDI 的結果樣本小、校正後不顯著**（L377–379）。
6. **介入只有 9 天**（L658–660），提示組之間的差異會不會消失無法判斷。
7. **防護沒有充分測試**（L650–651）；**課外是否用公開的 ChatGPT 無法查證**（L653–654、L1465–1466）。
8. **全體學生的學習效果估不出來**（L465–467）；參與度下降的長期影響不明（摘要 L35–36「which makes their longer term impact on student success unclear」）。

作者沒有當限制討論、但原文看得出來的事：
- 測驗分數有明顯的天花板：兩組中位數都是 95.9，「Many students achieved a perfect score」（L474）。
- 通知信同時改變了三件事（收到信、讀到利弊說明、能用工具），作者自己也指出「讀說明」本身可能就是效果來源（L220–226），所以參與度下降不能歸給「用了 GPT-4」；實驗組 85.8% 的人根本沒用。
- 排除限制的問題比作者說的更具體：通知讓實驗組的測驗參加率下降 4.3 個百分點，而分數只在有考的人身上觀察得到，通知因此透過「考不考」影響觀察到的分數。作者用補缺漏來處理，並把排除限制改寫成條件於共變項的版本（L922–925），但沒有討論這一點對 6.86 的影響。這是我讀的時候的判斷，不是原文的說法。
- 實驗對象是第一週做完全部作業的 5,831 人（8,762 人裡的 66.5%），不是全部報名者。

## 與摘要說法不一致的地方

1. **標題與摘要對「採用者考得較好」的說法，比內文強**。標題寫「Increased Adopters' Exam Performances」；摘要寫「We estimate positive benefits on exam performance for adopters」（L29–30）。內文的主估計（+6.86）明寫「not statistically significant after adjusting for multiple hypothesis testing」（L556–557），用的是 90% 信賴區間，下限 0.30；不補缺漏的版本區間跨過零（Table 2）。內文自己的措辭是「suggesting the potential of」（L558）。摘要沒有提這兩點。
2. **摘要說「We observe similar decreases in other forms of course engagement」**（L31–32）。內文是兩種：第 6 週作業完成率顯著下降，第 6 週小組出席校正後不顯著（Figure 3 圖說）。導言也寫「Access and advertising also led to a decrease in homework participation and section attendance」（L93、L130），沒有註明出席那一項不顯著。
3. **摘要說低 HDI 國家「increased their exam participation rate on average」**（L33–34）。內文這一項校正後 P = .680，作者自己寫不顯著，樣本是 111 對 69 人。
4. **摘要說「5,831 students from 146 countries」**；導言說 146 國是 8,762 名報名者的範圍（L74–75「over 8,762 students in 146 countries」）。5,831 人涵蓋幾國，原文沒有另外給。
5. 摘要的 −4.3 個百分點與 14.2% 都對得上內文。

## 原文內部不一致（照實記錄，不猜哪個對）

- **測驗參加率的組別標反了**：L474–477 寫「the experiment group (48.5%)」「the control group (44.1%)」，Table 1 與 §3.1 是實驗組 44.1%、對照組 48.4%／48.5%。N（1,579／3,581 = 44.1%；1,089／2,250 = 48.4%）顯示內文這兩個括號寫反。
- 對照組參加率 Table 1 寫 48.4%，內文與圖寫 48.5%。
- **校正後的 p 值對不起來**：測驗參加率，內文校正後 P = .020（L297），Figure 3 圖說 P = 0.006（L279–280）；第 6 週作業，內文 P = .01，圖說 P = 0.005。未校正 .001 乘以 15 是 .015。
- 第 6 週小組出席的區間（−5.41, −0.26）不含零，圖上標 NS；圖說沒有寫明這是未校正的區間。
- 全體參加率的差：內文 −4.3 個百分點，Figure A.3 圖說寫「-4.4% across all countries」。
- Table 2 與註腳 4 的 LATE（不補缺漏）信賴區間不同：[−0.31, 9.66] 對 [−0.34, 8.98]。
- 導言 L140 與 Table 2 圖說寫「6.8」，內文與表格是 6.86。
- **Figure 4 圖說的 (b)、(c) 對調**：圖說把 (b) 說成程式經驗、(c) 說成年齡，圖本身 (b) 是年齡、(c) 是經驗（PDF 第 7 頁）。
- 年齡分組：內文寫「23-40」，§4.2 寫「22-40」（L749）。
- **性別的方向**：Table A.2 的變項名是「Gender (Female)」，係數 +0.0988；Figure 6 的標籤是「Gender (M)」，內文說男性較可能使用（L610）；Table 1 採用者女性 48.6%、非採用者 54.7%，與內文一致。表的標籤與內文相反。
- **HDI 勝算比的解讀**：附錄說每個變項都標準化過（L1441–1442），內文卻把 0.83 解讀成「HDI = 1 的國家比 HDI = 0 的國家勝算低 17%」（L607–608）。標準化後的係數是每一個標準差的變化，不是 0 到 1。
- 小組出席：附錄 A.3 說實驗前最多出席 2 次（L1314–1316），§3.3 寫「attended all three sections in prior weeks」（L605–606）。
- 先前經驗：Table 1 平均 5.1，附錄 A.3 寫平均 −5.1、分數越負代表經驗越多（L1287、L1305）。
- 女性比例：Table 1 兩組 53.9%、55.3%，附錄 A.3 寫 51.59%（L1270）。
- 測驗時間：內文「optional 4-hour midterm exam」（L180）；測驗歡迎頁寫「You have 3 hours」（L1338）；導言寫「in a 3-day period」（L91）。測驗日期 Figure 1 寫 5 月 24–26 日，附錄 A.4 寫通知信 5 月 26 日寄出（L1330）。
- 人數：報名 8,762 人（L171、L1232），測驗通知信寄給 9,573 人（L1331）。原文沒有說明差距。
- 註腳 5 的記號寫錯（「Wi(0) is short for Wi(Z = 1)」，L904），不影響結果。
- L945–946 把 c0、c1 對應的組別寫反（「i ∈ c0 to mark students in the experiment group」），和上下文的定義相反，不影響結果。

## 與清單「要撐的結論」不合的地方

清單（28#7）寫：「提供通用聊天介面後課程參與下降；採用率 14.2%」。

- **「採用率 14.2%」**：撐得住（L182–183）。要連著寫的條件：這是自願工具、靠一封信與首頁按鈕通知、使用前要讀一頁利弊說明、期間 9 天；作者說這在這門課是典型的自願工具採用率。
- **「課程參與下降」**：方向撐得住，但要改寫三處。
  1. 下降的是「收到通知並獲得使用權」的整組人，不是用了 GPT-4 的人。實驗組 85.8% 沒用；採用者自己的測驗參加率是 62.4%（自我選擇，不能解讀成因果）。寫成「學生用了通用聊天介面後參與下降」是錯的。
  2. 三個參與指標裡顯著的是兩個（測驗參加 −4.3、第 6 週作業 −4.6 個百分點），小組出席校正後不顯著。
  3. 低 HDI 國家方向相反（+14.8 個百分點）但校正後不顯著，樣本 180 人；可以提，不能當成立的結果。
- **「通用聊天介面」**：大致撐得住，要加一句。模型是通用的 GPT-4、介面仿 ChatGPT，作者也自稱在研究 generic tool；但介面是課程自建的，提示裡放了作業題以防直接給答案，對話對課程人員可見，進入前有規則與警語。它不是「把學生丟給公開的 ChatGPT」。
- **清單沒寫、但寫 order 28 時不能漏的另一半**：這篇的標題還有後半句「採用者考得較好」。這個結果校正後不顯著，依賴無法驗證的排除限制與補缺漏模型，測驗有天花板。若引用，只能寫成「作者估計採用者可能多 6.9 分（滿分 100），但這個估計沒有通過多重檢定校正」。
- 清單把這篇標成 ⊖（結果相反或無效果）。準確的說法是：參與度是負向（顯著）；全體的測驗分數是無差異（E1 兩種算法區間都含零）；採用者的分數是正向但不顯著。
- 清單寫 arXiv 2024；手上讀的是 2025-07-15 的 v2，沒有比對 v1 與 v2 的差異。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–420 | 標題、作者、摘要、§1 導言、Figure 1–2、§2 實驗設計、§3 結果開頭、Table 1、Figure 3、§3.1 全部、Figure 4、§3.2 開頭 |
| 2 | L420–819 | Figure 5、Table 2、§3.2 其餘（分數分布、缺漏處理、採用者效果、LATE）、註腳 3–4、§3.3、Figure 6–7、§4.1 限制、§4.2 四個假說（到第四個的中段） |
| 3 | L820–1195 | §4.2 結尾、§4.3、§5 相關研究、§6 方法（LATE 的假設與推導）、§7 結論、致謝；L1038–1190 是參考文獻（掃過） |
| 4 | L1196–1563 | 附錄 A.1–A.8 全部：Figure A.1–A.6、Table A.1–A.2、Algorithm 1、說明頁全文 |

對過 PDF 版面的：第 4–9 頁，含 Figure 2（流程圖人數）、Table 1（逐格）、Figure 3（圖上百分比與圖說）、Figure 4（三個分圖的數字）、Figure 5、Table 2（逐格）。Table A.1、A.2 在文字檔裡欄位整齊，沒有另外對 PDF。Figure A.1 的圖上沒有數字，Figure A.2、A.3 是地圖，只讀了圖說。

沒有讀的：v1（2024 年 7 月）的內容；本文引用的其他研究一律沒有讀，上面凡是「引 XX」的都是作者的轉述。

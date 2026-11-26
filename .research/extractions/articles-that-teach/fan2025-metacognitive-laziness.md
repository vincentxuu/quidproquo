# 抽取紀錄：Yizhou Fan、Luzhen Tang、Huixiao Le、Kejie Shen、Shufang Tan、Yueying Zhao、Yuan Shen、Xinyu Li、Dragan Gašević 2025〈Beware of Metacognitive Laziness: Effects of Generative Artificial Intelligence on Learning Motivation, Processes, and Performance〉British Journal of Educational Technology 56(2), 489–530

- **書目**：作者九人，單位：北京大學教育學院（Fan、Tang、Le、K. Shen、Tan、Zhao）、Monash University Centre for Learning Analytics（Fan、Li、Gašević）、之江實驗室（Y. Shen）。姓名與單位對存檔 PDF 第 1 頁核過。期刊卷期頁碼與線上刊出日（2024-12-10）取自 Crossref（doi 10.1111/bjet.13544），不是從我讀的檔案來的。
- **我讀的版本**：arXiv:2412.09315 的投稿稿（Unpaywall 標為 submittedVersion；PDF 建立日 2024-12-12）。這是**匿名審查用的稿子**：母語寫「[disclosed]」、自引寫「Author (2023)」「Authors, 2022, 2023」。**刊出版沒有讀**：Wiley 的 PDF 連結（Unpaywall 標 bronze，出版者頁面可免費閱讀、無開放授權）以 curl 取回 403，沒有再用其他工具抓。下面指出的表格錯誤在刊出版是否已更正，**不確定**。
- **原文檔**：`.research/raw/learning-content/q6-evaluate/fan2025metacoglaziness.txt`（1,651 行、118,041 位元組；清單寫 116,963 字元）；PDF `fan2025metacoglaziness.pdf`（43 頁，正文 p.1–25 有頁碼，附錄 p.26–43 無頁碼）。單欄版面；只有首頁的單位資訊與摘要左右並排（L14–47），其餘段落順序正常。同目錄另有 `fan2025metacoglaziness.body`，沒有用。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 28（#12）

## 研究設計

- **類型**：實驗室隨機分派實驗，四組，受試者間設計。沒有提到預先註冊。
- **受試者**：117 名大學生，平均 22.61 歲（SD 3.39），70% 女性，55% 大學部，2023 年 7–9 月；英語是所有人的第二語言，母語在稿中被遮蔽（L352–354）。作者單位在北京。
- **各組人數（稿內前後不一）**：
  - 方法段（L356–359）：CN 30、AI 35、HE 25、CL 27。
  - IMI 表（Table 2）：CN 27、AI 35、HE 24、CL 28，共 114。
  - 附錄作文表（Appendix Table 1）：CN 27、AI 35、HE 25、CL 30，共 117。
  - 方法段與附錄表的 CN、CL 人數對調，哪個對**不確定**。
- **任務**（L355–383，Figure 1）：前測 30 分鐘（知識測驗）→ 訓練影片 10 分鐘 → 第一階段讀寫 120 分鐘（讀 AI、差異化教學、鷹架教學三主題的英文材料，寫一篇 200–400 字英文短文，設想 2035 年的教育）→ 訓練影片 10 分鐘 → **第二階段修改 60 分鐘（四組只在這一小時不同）** → 後測 30 分鐘（IMI、知識測驗、遷移測驗），「participants were asked to complete the post-test within one day」（L367–368）。
- **四個條件**（Table 1，L397–414；附錄 L1182–1226）：
  - CN：修改階段沒有額外支援；訓練影片提醒照任務說明與評分表修改。
  - AI：平台內嵌的 ChatGPT 4.0（OpenAI API），事先餵入閱讀材料、任務要求、評分表與學習者的文章；限制在任務範圍內，「answers were limited to providing advice rather than directly generating an essay」；要求用英文發問；提醒學習者 ChatGPT 的回饋不保證正確。
  - HE：一位真人專家（研究者、編輯、教過四學期學術寫作），即時一對一文字聊天，對話不設限。
  - CL：寫作分析工具組（基本寫作、學術寫作、原創性、整合與闡述四個工具），按鈕索取回饋；其中基本寫作工具的回饋由 GPT-4 產生，整合與闡述工具用 GPT 分類器。
  - 所有組在兩階段都有計時器、規劃工具、畫線與筆記、搜尋、字典工具。
- **量了什麼**：
  - 動機：IMI 四個分量表（興趣／享受、自覺能力、努力／重要性、壓力／緊張），5 點量表，只在後測量一次（L434–441）。
  - 學習歷程：頁面瀏覽、點擊、滑鼠、鍵盤紀錄，用作者先前的 trace parser 規則轉成七類歷程（定向 MC.O、規劃 MC.P、監控 MC.M、評估 MC.E、閱讀 LC.FR、闡述與組織 HC.EO、Other＝與各種支援互動）。頻率用 Kruskal-Wallis 加 Mann–Whitney；順序用一階馬可夫模型的流程圖，轉移機率差超過 10% 的邊上色（L443–465）。
  - 作文分數：兩版文章各依滿分 25 分的評分表（附錄 4）計分；兩位研究者先獨立評 12 篇，ICC 全部 > 0.85，其餘由一人評（L470–474）。評分者是否不知道組別，**原文沒有寫**。
  - 知識增益：同一份「AI in education」知識測驗的前後測差；遷移：「AI in healthcare」測驗，只在後測（L467–476）。方法段說兩份都是 10 題；但附錄 Table 2 的分數出現 0.467、0.533、0.733 這類 15 的倍數才有的值，知識測驗實際題數**不確定**。
- **分析**：一系列 ANOVA，成對比較用 Tukey HSD 校正（L476–482）。

## 結果（逐項）

Table 2、Table 3、Figure 1、Figure 3、Figure 4、附錄 Table 1–3、附錄 Figure 1–9 都對過 PDF 版面。行號是文字檔行號。

### RQ1 動機（Table 2，L491–512，p.12）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 興趣／享受（**無差異**） | F = 1.087，p = 0.358，η² = 0.029；平均 CN 3.291、AI 3.514、HE 3.589、CL 3.597 | 四組互比（N = 114） | L521–523 | 「No significant difference between the four groups was observed with regards to Interest/Enjoyment」 |
| 2 | 自覺能力（**無差異**） | F = 0.453，p = 0.716，η² = 0.012；CN 2.784、AI 2.767、HE 2.826、CL 2.976 | 同上 | L522 | 同句 |
| 3 | 努力／重要性（**無差異**） | F = 1.152，p = 0.332，η² = 0.030；CN 3.785、AI 3.857、HE 3.658、CL 3.907 | 同上 | L522–523 | 同句 |
| 4 | 壓力／緊張（**無差異**） | F = 0.546，p = 0.652，η² = 0.015；CN 3.104、AI 2.914、HE 2.900、CL 2.814 | 同上 | L523 | 同句 |

作者接著用不顯著的描述統計講「趨勢」（CN 興趣最低、壓力最高；CL 最高），L523–532。量表信度：整體 α = 0.82，分量表 0.86–0.94（L518–520）。

### RQ2 歷程頻率（Figure 3，p.14；數字只在圖上，正文沒有給平均或檢定統計量）

檢定一律是「各處理組 vs CN」，圖註寫明「between the treatment groups and the control group」（L587–589）。**AI 對 HE、AI 對 CL 的頻率沒有檢定。**

| # | 歷程（修改階段） | AI vs CN | HE vs CN | CL vs CN |
|---|---|---|---|---|
| 5 | 闡述與組織 HC.EO | 較多，p < .0001 | 較多，p < .05 | 較多，p < .0001 |
| 6 | 閱讀 LC.FR | 較少，p < .001 | 較少，p < .05 | ns |
| 7 | 評估 MC.E | **ns** | **ns** | 較多，p < .0001 |
| 8 | 監控 MC.M | ns | ns | ns |
| 9 | 定向 MC.O | **較多**，p < .05 | 較多，p < .01 | 較多，p < .001 |
| 10 | 規劃 MC.P | ns | ns | ns |
| 11 | Other（與支援互動） | 較多，p < .0001 | 較多，p < .01 | ns |
| 12 | 總量 | ns | ns | 較多，p < .0001 |

方向是我對照盒鬚圖與正文讀的；顯著星號照圖。第一階段（四組條件相同）只有 CL 的定向略低於 CN（p < .05），其餘全部 ns（L543–546）。

原文對應句（L552–556）：「the AI, HE and CL groups also demonstrated significantly more Orientation processes (but no differences in Monitoring and Planning processes) in the revising stage compared with CN group … the use of checklist tools led to a significant increase in Evaluation processes among learners in the CL group, an effect not observed in the AI and HE groups.」

### RQ2 歷程順序（Figure 4，p.15；附錄 Figure 1–6）

| # | 結果 | 數字 | 對照條件 | 位置 |
|---|---|---|---|---|
| 13 | AI 組修改後常回到 ChatGPT | HC.EO→Other 轉移機率 AI 0.73 vs CN 0.21；Other→HC.EO AI 0.68 vs CN 0.15 | AI vs CN，描述性比較 | Figure 4 上圖；L571–576 |
| 14 | CN 組修改與閱讀相連較多 | HC.EO→LC.FR AI 0.14 vs CN 0.79 | 同上 | Figure 4 上圖；L576–600 |
| 15 | AI 與 HE 比 | HC.EO→Other AI 0.73 vs HE 0.46；Other→HC.EO AI 0.68 vs HE 0.44；MC.E 自我迴圈 AI 0.59 vs HE 0.74 | AI vs HE，描述性比較 | Figure 4 下圖；L601–609 |
| 16 | AI 組從規劃轉到閱讀較多 | MC.P→LC.FR AI 1 vs CN 0.47、vs HE 0.33 | 描述性比較 | Figure 4；L607–609 |

這些只是轉移機率相差超過 10% 的標色，**沒有任何顯著性檢定**。哪個數字屬於哪一組是照圖註「紅色＝AI 較高」推的，圖上寫成「x/y」，原文沒有明說前後順序。

### RQ3 表現（Table 3，L627–634，p.16；附錄 Table 1–3，PDF p.39–40）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 17 | 修改前作文分數（無差異） | F = 1.275，p = 0.286，η² = 0.033；平均 CN 14.667、AI 13.543、HE 14.920、CL 14.367（滿分 25） | 四組互比 | L615；附錄 Table 1 | 「no significant differences in essay scores … before revision」。AI 組起點在描述上最低。 |
| 18 | 作文進步分數 | F = 4.549，p = 0.005，η² = 0.108；平均進步 AI 3.600（SD 3.136）、CN 1.630（SD 1.984）、HE 1.480（SD 3.280）、CL 1.400（SD 2.673） | 四組互比 | L616；附錄 Table 1 | 「significant differences in score improvements (F=4.549, p=0.005, η2=0.108) after revision」 |
| 19 | AI vs CN | 差 1.970，95% CI [0.083, 3.858]，校正後 p = 0.037 | AI − CN 的進步分數 | Table 3 | 「CN-AI −1.970 −3.858 −0.083 0.037」 |
| 20 | AI vs HE | 差 2.120，95% CI [0.191, 4.049]，校正後 p = 0.025 | AI − HE | Table 3 | 「HE-AIi −2.120 −4.049 −0.191 0.025」（「AIi」是原表錯字） |
| 21 | AI vs CL | 差 2.200，95% CI [0.367, 4.033]，校正後 p = 0.012 | AI − CL | Table 3 | 「CL-AI −2.200 −4.033 −0.367 0.012」 |
| 22 | 其餘三對（**無差異**） | CN−CL 0.230（p = 0.990）；HE−CL 0.080（p = 1.000）；HE−CN −0.150（p = 0.998） | — | Table 3 | 真人專家與檢核工具都沒有比沒有支援的組進步更多 |
| 23 | 修改後作文分數 | 平均 AI 17.143、HE 16.400、CN 16.296；CL 那一列見下方「表格錯誤」 | **沒有檢定** | 附錄 Table 1 | 正文只檢定進步分數，沒有報告修改後分數的組間檢定，也沒有以修改前分數為共變項的分析 |
| 24 | 知識前測（無差異） | F = 1.294，p = 0.281，η² = 0.036；平均（比例）CN 0.489、AI 0.479、HE 0.533、CL 0.459；N = 107 | 四組互比 | L640–643；附錄 Table 2 | 見下一列 |
| 25 | 知識後測（**無差異**） | F = 0.913，p = 0.438，η² = 0.030；CN 0.688、AI 0.671、HE 0.661、CL 0.619；N = 105 | 四組互比 | 同上 | 「no significant differences between the groups in terms of the pre-test score … and post-test score …, which means no significant differences in knowledge gain」 |
| 26 | 知識增益（描述） | CN 0.200、AI 0.193、HE 0.137、CL 0.161；全體 0.176 | **增益分數本身沒有檢定** | 附錄 Table 2 | 作者是從前測、後測各自無差異推論增益無差異 |
| 27 | 遷移測驗（**無差異**） | F = 0.019，p = 0.996，η² = 0.000；平均 CN 0.785、AI 0.782、HE 0.771、CL 0.777；中位數 0.8–0.9；N = 107 | 四組互比 | L649–651；附錄 Table 3 | 「there were no significant differences between the four groups (F=0.019, p=0.996, η2=0.000)」 |

**附錄表格的錯誤（投稿稿）**：

- 附錄 Table 1「Essay Score after Revision」的 CL 列（14.367、3.882、3、15、22）和「before Revision」的 CL 列一字不差，是誤貼。用全體平均 16.436 反推，CL 修改後平均約 15.77；附錄 Figure 9 的 CL 盒鬚圖中位數約 16、最低點約 6，也對得上。**CL 修改後的平均不能引 14.367。**
- 附錄 Table 2「Score Improvement」CN 最小值寫 −1.333，比例量尺上不可能，全體最小值是 −0.133；全體 N 寫 97，四組相加是 105。
- 附錄 Table 2、3 的表題分別寫成「pretest score」「posttest score」，內容其實是知識測驗三項統計與遷移測驗。
- 知識與遷移測驗的 N（97–107）少於 117，缺漏原因沒有交代。

### 作者在討論裡補充的觀察（不是量化結果）

- L746–750：「this out-performance may also be due to learners discovering how to by-pass the task instructions and utilise ChatGPT to generate completed text (despite the prompts used in our study aimed at restricting ChatGPT from writing directly for learners). In the lab setting, we also noticed that some learners would subsequently copy and paste content generated by ChatGPT (e,g., example sentences given by ChatGPT) to achieve high scores by catering the scoring rubric.」沒有給人數或比例。
- L702–703 的定義：「we define metacognitive laziness as learners' dependence on AI assistance, offloading metacognitive load, and less effectively associating responsible metacognitive processes with learning tasks.」

## 作者自己列的限制（第 6 節，L781–804）

- 沒有顯著差異可能是任務時間與樣本數所限：「The observed lack of significant differences between groups could be attributed to constraints related to task duration and sample size.」
- 樣本 70% 是女性。
- 只有一個讀寫任務。
- 沒有長期追蹤：「employing long-term follow-up assessments would enable researchers to explore how the observed effects on short-term performance translate into lasting knowledge gains and skill development」。
- **沒有直接量「後設認知懶惰」的工具**：「The last limitation is the lack of targeted and matured measures for assessing metacognitive laziness within the study's design.」

作者沒有提、從設計讀得出來的（我的觀察）：知識與遷移測驗考的是第一階段閱讀材料的內容，而四組在第一階段條件完全相同，差別只在最後一小時改文章，知識增益本來就主要來自相同的那兩小時；遷移測驗接近天花板；作文評分是否盲評沒有交代；AI 組修改前分數在描述上最低，只檢定進步分數而沒有控制起點。

## 與摘要說法不一致的地方

1. **摘要與結論把「後設認知懶惰」寫成發現，正文承認沒有量。** 摘要：「AI technologies such as ChatGPT may promote learners' dependence on technology and potentially trigger metacognitive "laziness"」（L69–71）。限制段說研究設計裡沒有針對它的測量。這個詞是對歷程紀錄的詮釋。
2. **「AI 組後設認知歷程較少」和 Figure 3 對不上。** 討論段：「Unlike the HE and CL groups, the AI group shows relatively fewer metacognitive processes (e.g., evaluation and orientation).」（L697–698）。結果是：定向 AI 組**顯著多於**對照組；評估 AI 組與對照組無差異，HE 組同樣無差異；規劃、監控四組都無差異。AI 對 HE、AI 對 CL 的頻率沒有檢定。站得住的只有「CL 組評估歷程增加，AI 與 HE 沒有」與流程圖上的描述性差異。
3. **摘要說歷程的「frequency and sequences」有顯著差異**（L60–62）。頻率有檢定；順序只有轉移機率的描述比較，沒有檢定。
4. **「知識增益無差異」的檢定對象不是增益。** 摘要寫「their knowledge gain and transfer were not significantly different」（L63–64）；正文檢定的是前測與後測各自的組間差異。
5. **把遷移稱為長期。** 討論寫「short-term task performance and long-term knowledge transfer」（L768–769）、結論寫「may not boost … long-term learning outcomes」（L812–813）；後測是在任務結束後一天內做的，沒有延後測驗。
6. **「不提升內在動機」是四組都沒有差異**，包含真人專家與檢核工具，不是 ChatGPT 特有的結果。作者還用不顯著的描述統計講趨勢。
7. 各表的組別人數前後不一（見研究設計）。

## 與清單「要撐的結論」不合的地方

清單寫：「作文分數進步但知識增益與遷移無差異」。

- 字面上撐得住，數字是：作文進步 AI 3.600 分 vs 對照 1.630、真人專家 1.480、檢核工具 1.400（滿分 25；F = 4.549，p = 0.005）；知識後測 p = 0.438；遷移 p = 0.996。
- **但不能寫成「用 AI 寫得比較好卻沒有學到比較多」的因果對比。** 四組只在最後一小時的修改階段不同，知識與遷移測驗考的是前兩小時讀的材料；四組的知識分數都從約 0.49 升到約 0.66。這個設計本來就不太可能讓一小時的修改支援改變知識測驗分數，「無差異」不等於「AI 有害於學習」，也不等於「AI 讓人只顧分數不學」。
- 要連著寫的條件：ChatGPT 被設定成只給建議、不代寫，但作者自己觀察到有人繞過限制並貼上 ChatGPT 產生的句子；作文分數的進步有多少是學習者自己的修改，沒有量。
- 清單沒列、但值得知道的：真人專家組的作文進步和沒有支援的組沒有差異（差 −0.150，p = 0.998）。
- 篇名的「metacognitive laziness」不能當成這篇的實證發現來引；最多寫成「作者提出這個說法，並承認沒有直接測量」。
- 版本：引用時書目寫 BJET 刊出版沒問題，但本紀錄的數字與行號全部來自 arXiv 投稿稿，寫進文章前若要引附錄表的數字，要先對刊出版。

## 讀取紀錄

依序讀完文字檔全部 1,651 行：

- L1–113：標題、作者、單位、結構式摘要、關鍵詞、Practitioner Notes
- L114–200：1 Introduction
- L201–346：2 Background（2.1 Motivation、2.2 SRL Process、2.3 Learning Performance，三個研究問題）
- L347–482：3 Methods（3.1–3.3，含 Table 1）
- L483–653：4 Results（4.1 含 Table 2；4.2.1、4.2.2 含 Figure 3、4 的圖註；4.3.1–4.3.3 含 Table 3）
- L654–779：5 Discussions（5.1–5.3）
- L780–820：6 Limitations、7 Conclusion
- L821–1108：參考文獻（掃過）
- L1109–1178：附錄 1（知識測驗與遷移測驗例題、IMI 23 題）
- L1179–1226：附錄 2（四組支援的詳細說明）
- L1227–1481：附錄 3（Action Library、Process Library）
- L1482–1538：附錄 4（評分表）
- L1539–1651：附錄 5（補充結果：流程圖 Figure 1–6、Table 1–3、Figure 7–9）

對過 PDF 版面的：Figure 1 與 3.1（PDF p.8）、Figure 2（p.9）、Table 1（p.10）、3.3（p.11）、Table 2（p.12）、4.2（p.13）、Figure 3（p.14）、Figure 4（p.15）、Table 3 與 4.3（p.16）、4.3.3 與 5.1（p.17）、附錄流程圖 Figure 1–6（p.36–39）、附錄 Table 1（p.39）、Table 2、3（p.40）、附錄 Figure 7–9（p.41–43）。文字檔的表格數字與 PDF 逐格相符（附錄表的誤貼與錯字是原稿就有的，不是轉檔造成）。

沒有讀的：BJET 刊出版（出版者 PDF 連結回 403）。

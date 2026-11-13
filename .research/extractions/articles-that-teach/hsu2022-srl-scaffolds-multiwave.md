# 抽取紀錄：Hsu & Tutwiler 2022，How Much and for Whom? A Multi-Wave Study of the Impact of Self-Regulated Learning Scaffolds on MOOC Student Academic Performance

- **合法公開來源**：https://dl.acm.org/doi/10.1145/3491140.3528312（刊出版，2026-10-14 核對）。ACM Digital Library 自 2026-01-01 起全面開放取用，文章頁標示 FREE ACCESS。從 ACM 重新下載的 PDF 與手上經 Wayback 取得的 `hsu-tutwiler2022-las-srl-scaffolds.pdf` 位元組完全相同（1,174,988 位元組）。下面「能不能列進參考資料請主編判斷」的疑慮已解除，連結寫 ACM 的 DOI。

- **書目**：Shu-Yi Hsu（Teachers College, Columbia University）、M. Shane Tutwiler（University of Rhode Island）。作者名與單位對 PDF 首頁核過；清單上「作者名待補」補在這裡。*L@S '22: Proceedings of the Ninth ACM Conference on Learning @ Scale*，2022 年 6 月 1–3 日，New York，頁 350–354。DOI：10.1145/3491140.3528312。**頁眉標示的類別是「Work in Progress」**，全文 5 頁（正文不到 4 頁）。
- **原文檔（重抓）**：`.research/raw/learning-content/q4-time/hsu-tutwiler2022-las-srl-scaffolds.pdf`（5 頁）與同名 `.txt`（499 行；第 1 行是我加的來源註記，其餘 498 行、25,037 字元，`pdftotext` 不帶 `-layout`）。
- **重抓來源**：`http://web.archive.org/web/20220614232911/https://dl.acm.org/doi/pdf/10.1145/3491140.3528312`，是 Wayback Machine 在 2022-06-14 存下的 ACM 出版者 PDF（當時回應 200）。現在直接連 ACM 會被擋（403），Unpaywall 與 OpenAlex 都標成 closed，找不到作者或機構典藏的版本。這份是出版者自己的檔，但現況不是開放取用；能不能列進參考資料請主編判斷。
- **舊檔**：`q4-time/las2022-srl-scaffolds-multiwave.md`（20 行、15,417 字元）缺摘要、Table 1、第 3 節開頭一段、3.1 節前半、式 (1)、兩張圖的圖說與參考文獻，引用標號也被去掉。已讀過一遍並與新檔逐段對過，正文句子相同，沒有新檔沒有的內容。之後請以新檔為準。
- **版本**：刊出版。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 19（清單 D 第 19#8 列）
- **表格對照**：全文只有一張表（Table 1，介面比較，沒有數字），用 PDF 第 351 頁版面讀過；文字檔把這張表拆散了，下面依 PDF。**全文沒有任何結果數字表**，估計值只畫在 Figure 1、2，圖上的座標刻度在 PDF 裡小到讀不出數值。

行號用新文字檔（含第 1 行註記）的行號；頁碼是論文集頁碼。

## 研究設計

- **類型**：三波（三個 study）隨機實驗，作者自稱「three randomized experimental studies」（L73–75）。隨機分派的單位、方式、各組人數，全文沒有寫。
- **課程**：ColumbiaX 在 edX 上的兩個 MicroMasters 學程，Artificial Intelligence 與 Business Analytics，各四門研究所程度的 MOOC（p.352，3.1 節，L257–264）。有講師帶、2019–2020 年開課；註冊 verified track 後可使用全部教材與計分作業；逾期不收；總成績 60% 以上且參加期末考可得證書（L264–269）。
- **受試者**：verified track 的學習者。**人數有兩個寫法**：摘要、前言、討論寫 2,650 人、24 門 MOOC（L30–31、L125–126、L369–370）；3.2 節寫「24 course runs of 2560 verified learners」（L305）。結果段各波人數加起來是 2,646（通過組 395＋529＋572＝1,496；未通過組 293＋383＋474＝1,150）。三個數字對不起來，原文沒有說明。受試者的國別、年齡、學歷分布都沒有報告（只說有收集年齡、學歷、性別，L311–312）。
- **處理（SRLUI，self-regulated learning user interface）**：放在每週內容開頭、名為「Weekly Reflection」的頁面，每週都出現（L149–158）。三個部分（Table 1，p.351）：
  - Course Progress：上週的學習分析、上週自己訂的目標、自評讀書計畫完成度（0–100%）、歷史學習分析報告
  - Study Planning：訂下週目標（第 1 版手打最多 4 個；第 2 版改成勾選課程項目）、寫最多 3 個學習任務、依任務排程設定電郵提醒
  - Study Tips：一則附圖的一般學習建議
- **對照組不是「什麼都沒有」**（Table 1；L119–124）：對照組同樣看得到上週的學習分析、歷史學習分析報告、下週的學習主題、同一則學習建議。兩組的差別是實驗組多了「要輸入的部分」（自評、訂目標、排任務、設提醒）與「上週自己訂的目標」。原文：「the control group provides a baseline intervention with self-regulated learning supports which could be found in major MOOCs platforms」（L121–124）；「The differences between the control and the treatment group were the ability to actively interact with the interventions.」（L423–425）
- **三波的差別**（L160–168、L425–430）：Study 1 用第 1 版（手打目標），可用可不用；Study 2 用第 2 版（勾選），**必須先進這個頁面才能看講課影片**；Study 3 用第 2 版，可用可不用。Study 2、3 在 2020 年春、秋學期（L388–389）。
- **量了什麼**：只有期末總成績（測驗、作業、期末考合成，L309–311）。有記錄學習者與 SRLUI 的互動（L312–313），但**全文沒有報告任何使用量、填寫率或遵從率**。完成率、取得證書的比例沒有當成結果分析。
- **分析**：多層貝氏 beta 迴歸，依課程分群（單波）、依課程與波次分群（合併）（L318–325）。先驗是預設的正則化先驗。**判定標準**：後驗平均大於後驗標準差，就解讀為有「marginal statistical evidence」（L335–338、L253–255）。沒有用顯著性檢定，也沒有報告傳統的信賴區間；圖上畫的是 29% 與 89% 可信區間（圖說原文如此）。
- **把樣本拆成通過與未通過兩組分別分析**（L274–276）。理由在討論才出現：「Due to the bimodal distribution of the grades」（L372–373）。通過與否是處理之後才產生的結果，照這個變項分組再比處理效果，原文沒有討論這個做法的問題。
- **何時量**：課程結束時的成績，沒有追蹤。

## 結果（逐項）

全部是「實驗組（互動式 SRLUI）對對照組（非互動的基線版）」的期末成績差。數字是作者在內文用百分點敘述的後驗中位數，沒有表、沒有區間數值。

### 通過課程的學習者（Figure 1，p.352）

| # | 結果 | 數字 | n | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | Study 1 | 約高 2 個百分點；「weak statistical evidence」 | 395 | L286–290 | 「there was weak statistical evidence (the posterior median was equal to or greater than the posterior standard deviation) that the treatment group in the first intervention (n=395) scored about 2%-point higher than their peers in the control group, on average.」 |
| 2 | Study 2（必須先進頁面） | 約高 1 個百分點，與後驗標準差（1 個百分點）分不開 | 529 | L291–295 | 「it was indistinguishable from the posterior standard deviation (1%-point), giving us very little confidence that it is distinguishable from zero in the data.」 |
| 3 | Study 3 | **約低 2 個百分點**；「slight evidence of a negative impact」 | 572 | L295–298 | 「indicates slight evidence of a negative impact of SRLUI, with median posterior estimate indicating that students in the treatment group scored about 2%point lower than their control peers on average.」 |
| 4 | 三波合併 | 沒有正向或負向效果的證據 | 1,496 | L298–302 | 「we see no statistical evidence of an impact, positive or negative, of the use of SRLUI for students who passed their given class across all three interventions.」 |

### 沒有通過課程的學習者（Figure 2，p.353）

| # | 結果 | 數字 | n | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 5 | Study 1 | 沒有證據 | 293 | L351–352 | 「no noted statistical evidence of a relationship between SRLUI usage and course grades for nonpassing students in the first intervention (n=293).」 |
| 6 | Study 2（必須先進頁面） | 約高 2 個百分點 | 383 | L352–355 | 「students in the treatment group in the second intervention (n=383) scored approximately 2%-point higher than their peers in the control group.」 |
| 7 | Study 3 | 沒有比較高 | 474 | L355–358 | 「students who were offered SRLUI in the third intervention (n=474) did not demonstrate any higher course grades than their peers in the control group.」 |
| 8 | 三波合併 | 平均高 1 個百分點；後驗中位數只比標準差略大；**後驗分布有 60% 大於 0** | 1,150 | L358–365 | 「While this effect is positive, it is also very slight (the posterior median is only slightly larger than the standard deviation). We are 60% confident that the direction of the aggregate effect is positive (that is to say, 60% of the posterior distribution is greater than 0).」 |

### 模型診斷

| # | 結果 | 行號 | 原文一句 |
|---|---|---|---|
| 9 | 全部模型收斂，R-hat 都小於 1.1 | L277–285 | 「All estimated R-hat statistics were less than 1.1.」 |

### 沒有報告的東西

- 實驗組與對照組各自的平均成績、通過率、各組人數
- 不分通過與否的整體效果（摘要說的主要研究問題是「the marginal effect of SRLUI on learning as evidenced by final course grade」，但結果只有分組後的）
- 介面的實際使用量
- 通過率或完成率有沒有因處理而不同
- 效果量（標準化）、可信區間的數值

## 作者自己列的限制

第 6 節只列了一項（L388–401）：

1. Study 2、3 在 2020 年春、秋學期進行，正值 COVID-19 疫情高峰。學習者可以免費從春季延到秋季或重新註冊，所以 Study 3 有一部分人是從 Study 2 轉過來的，「That could result in study contamination because these learners' overall study time was longer and they might already have had access to the answer keys to the quizzes and assignments.」
2. 作者建議未來研究重做同樣的介入來驗證（「future studies could replicate similar SRL interventions to verify the effects」），並針對不同子群做差異化設計。

原文沒有提的：對照組也拿到部分支援；依處理後的結果（通過與否）分組；沒有使用量資料；人數前後不一；判定門檻（平均大於標準差）很寬；這是 Work in Progress 短文。

## 與摘要說法不一致的地方

1. **摘要：「there is evidence of a small positive impact on learning for students who did not ultimately pass a given course」**（L85–88）。正文對同一個結果的描述是「very slight」、後驗中位數「only slightly larger than the standard deviation」、後驗分布 60% 大於 0（L361–365）。60% 的後驗機率離一般說的「有證據」很遠；摘要的語氣比結果段強。
2. **討論：「The aggregated results of three studies showed moderate statistical evidence that the interventions were able to improve learners in the non-passing group (n= 1,150) 1%-point higher」**（L375–378）。同一個結果，方法段的用語是「marginal statistical evidence」（L253），結果段是「very slight」，討論變成「moderate」。三處強度不一致。
3. **討論：「it can be concluded that effective self-regulated learning interventions require active and longitudinal scaffolding」**，並建議把鷹架做成課程的必要環節（L381–385）。結果裡沒有任何一項分析比較過「主動對被動」或「長期對短期」；唯一和「必要環節」有關的是 Study 2（必須先進頁面），它在未通過組約高 2 個百分點、在通過組與零分不開，而三波之間還有介面版本與疫情的差別，不能歸因。這句結論超出結果。
4. 摘要說發現「mixed」，並說在個別波次「found some evidence of enhanced learning for passing and non-passing students」（L82–84）；沒有提 Study 3 通過組是負的 2 個百分點。
5. 人數：摘要 2,650；3.2 節 2,560；結果段加總 2,646。
6. 摘要說 SRLUI 的第一個設計目標是「manifesting learner selfregulated learning behavior」（L33–34），正文沒有任何行為面的結果。
7. 摘要與前言說有多個研究問題的口氣（「The research questions are:」），實際只列了一題（L126–130）。
8. 圖說寫「bold lines are 29% credible intervals」與「Estimates are given in the log likelihood scale」（L339–343、L403–407），照抄原文；29% 與「log likelihood scale」是否為筆誤，原文無從判斷。內文用百分點敘述，圖用另一個尺度，兩者怎麼換算沒有交代。
9. ACM 引用格式那一行把年份印成 2020（L99），會議是 2022。

## 與清單「要撐的結論」不合的地方

清單寫：「付費學習者的自我調節介面三波實驗合計無效」。

- **「合計無效」只對通過組成立。** 通過組合併（n = 1,496）作者明寫沒有正負效果的證據。未通過組合併（n = 1,150）是高 1 個百分點，作者稱有（很弱的）證據，但自己給的後驗機率只有 60%。比較準的寫法：「通過課程的人沒有差別；沒通過的人高 1 個百分點，作者自己估方向為正的機率是六成」。
- **比較的不是「有介面對沒有介面」。** 對照組也看得到學習分析、下週主題與學習建議；實驗量到的是「多了要自己填的目標、計畫、提醒」這一塊的邊際效果。寫成「自我調節介面無效」會讓讀者以為對照組什麼都沒有。
- **「三波」不是同一個實驗重複三次。** 第 1 波是手打目標、自由使用；第 2 波改勾選而且強制先進頁面；第 3 波勾選、自由使用，並混入第 2 波延修過來的人。各波方向不一致（通過組 +2、+1、−2；未通過組 0、+2、0）。
- **「付費學習者」**：原文的用詞是「verified learners」「credential-based MOOCs」，沒有直接寫付費金額或「paid」；MicroMasters 的 verified track 是付費的，這是背景知識，不是這篇原文說的。
- **證據等級要交代**：Work in Progress 短文；沒有數字表、沒有區間、沒有各組人數與使用量；人數三處不一致；用處理後的結果分組。清單把它列為 order 19 的三個「反／無」來源之一，和 Kizilcec 等 2020（PNAS）、Baker 等 2016 並列；這一篇的份量撐不起同等的位置，適合當一句帶過的旁證。
- 清單「之前讀到哪」寫「設計、結果、討論」都讀過：舊檔的確有這三節的正文，但缺 Table 1，所以先前看不到「對照組也有基線支援」的細節。

## 讀取紀錄

| 順序 | 位置 | 內容 |
|---|---|---|
| 1 | 舊檔 `las2022-srl-scaffolds-multiwave.md` L1–20（全檔） | 前言、文獻回顧、研究設計（殘缺）、資料、方法、結果、討論、限制 |
| 2 | 新 PDF 第 350–354 頁（全 5 頁，用 Read 直接讀 PDF 版面） | 標題、作者、摘要、CCS、關鍵詞、第 1–6 節、Table 1、式 (1)、Figure 1–2 與圖說、參考文獻 [1]–[18]（書目，掃過） |
| 3 | 新文字檔 L1–499（全檔） | 同上內容的文字版，用來標行號；雙欄在文字檔裡有交錯（例如摘要被前言插開、第 2 節標題與內文分離），以 PDF 版面為準 |
| 對表 | PDF 第 351 頁 | Table 1 逐列對過（文字檔 L189–243 欄位被拆散） |

全文沒有附錄、註腳與補充材料。Figure 1、2 的座標數值讀不出來，上表的百分點都取自內文敘述。

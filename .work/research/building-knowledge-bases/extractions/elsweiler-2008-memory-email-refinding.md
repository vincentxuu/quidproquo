# Elsweiler, Baillie & Ruthven 2008 — Exploring memory in email refinding

read_status=read（作者存放版 PDF 全文 35 頁逐行讀完；另以 ACM 正式版全文文字核對關鍵句、表格與數字，一致）

## 書目

- 作者：David Elsweiler, Mark Baillie, Ian Ruthven（Department of Computer and Information Sciences, University of Strathclyde）。
- 刊物：ACM Transactions on Information Systems 26(4), Article 21 (September 2008), 36 pages. DOI 10.1145/1402256.1402260。Received June 2007; revised February 2008; accepted June 2008（ACM DL 頁面）。
- 實際讀的版本：
  1. **主讀**：University of Regensburg 機構庫 epub.uni-regensburg.de/22682 的 `Tois2008_exploring_email.pdf`（`curl -L -A "Mozilla/5.0"`，35 頁）。版面是 ACM 投稿模板（頁尾「ACM Journal Name, Vol. V, No. N, Month 20YY」），標題拼成 "Re-finding"，判斷為作者接受稿（accepted manuscript），不是期刊排版。`pdftotext` → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/elsweiler2008.txt`（2,703 行、107,124 bytes）。
  2. **核對**：ACM DL PDF（https://dl.acm.org/doi/pdf/10.1145/1402256.1402260）經 Exa web_fetch 取得正式版全文文字 → `scratchpad/fulltext/elsweiler2008-acm.txt`（576 行、113,086 字元）。用來核對：關鍵原句、Table I／III／VI／VII、87.8%／181、57.45%、限制段落、follow-up 句。全部一致，差別只在拼字（refinding、organized、Section 大寫）與頁碼。下面原句以正式版拼法為準時會註明。
- 直接 curl ACM PDF 只拿到 5 KB HTML（擋）；Strathprints 19462 只有摘要頁。

## 研究設計

- **類型**：實驗室使用者研究，參與者在**自己的真實信箱**上做研究者設計的找回任務（Elsweiler & Ruthven 2007 的方法）。原本是系統評估（三個介面：類 Thunderbird 資料夾瀏覽、類 Thunderbird 搜尋、作者自製以寄件人縮圖為主的混合介面），本文只分析記憶資料；作者以卡方檢定說介面不影響四個主要屬性的回憶（footnote 2：when sent p=0.61、sender p=0.65、topic p=0.08、reason p=0.12）。
- **兩階段**：
  1. 日記研究：**34 人**（16 碩士生、18 大學部學生），約 3 週記錄 150 個 email 任務；另請每組 2 人做 5–10 分鐘的 email tour。用來設計任務池。
  2. 實驗：日記結束 3 週後，**21 人**，三組各 7 人：大學部（3、4 年級）、碩士生、研究人員／教職（研究人員組沒參加日記，任務依寄給全系的信設計）。每人做 9 個任務（lookup、item、multi-item 各 3，三個系統輪替），共 **189 個任務**。
- **受試者特性（Table I）**：信件數中位數 碩士 106、大學部 187、研究人員 5,132；每日收信 1.78／0.57／8.03。歸檔策略（依 Whittaker & Sidner 1996 三類）：碩士 0 filers／5 no-filers／2 spring-cleaners；大學部 2／3／2；研究人員 2／2／3。全部來自 Strathclyde 資訊系。
- **時間變項**：任務前問上次存取多久前，轉成 Sellen & Harper 的溫度：hot（一天或一週內）45 個、warm（一個月內）45 個、cold（超過一個月）60 個，其餘 39 個是 range（多封信不同溫度）（Table II）。
- **量了什麼——是記憶，不是找回成功**：
  1. 任務前問：你認為需要的資訊在你的信箱裡嗎？（yes／no／not sure）
  2. 任務後的**回溯式記憶問卷**：任務開始前你是否正確記得：大約何時寄的、寄件人、主題、寄的理由；以及其他收件人、附件、圖片、連結。是否算「記得」由實驗者依是否對找回有用判定。
  - 分析：各屬性被記得的任務百分比，依任務類型、溫度、使用者組、歸檔策略分組（第 4 節）；四個主要屬性各跑一個 logistic regression（19 個因子先 stepwise，再強制放入關注因子）（第 5 節，Tables VIII–XI）。
  - **本文不報告找回成功率、時間或效率**，明說留給 follow-up article。
- **歸檔策略比較**只用大學部與研究人員（14 人），碩士生幾乎全是 no-filers 被排除（4.6 節）。

## 可引用結果

1. **大多知道資訊在不在信箱裡**（4.1 節，Table III）
   - 「In 159 (87.8%) of the 181 tasks, the participants were positive that the information required was contained within their collection. Only in 6 tasks (3.3%) were participants sure that the information was not contained within their collections and in 24 tasks (13.3%) they were unsure.」
   - Table III 的分母是 189：Contains 159（84.1%）、Doesn't contain 6（3.2%）、Not sure 24（12.7%）。各組 Contains：碩士 90.5%、大學部 85.7%、研究人員 76.2%。
2. **最常記得的是語意屬性**（4.2 節，Table IV，188 個任務）
   - 「The most frequently remembered attribute was the topic of the email, which was remembered in 85.1% of tasks. This was followed by the reason the email was sent (80.9%), the sender of the email (77.1%), and temporal information (57.5%).」其他收件人 46.8%、連結 21.8%、附件 12.8%、圖片 2.1%。
   - 「in 42.3% of tasks, the participants remembered all of the common attributes, in 74.1% of the tasks 3 or more were remembered and in 85.9% of tasks participants remembered 2 or more common attributes.」
3. **時間越久越忘，寄件人最明顯**（4.3 節，Table IV；第 5 節 Table IX）
   - 「In 95.6% of hot tasks the sender was remembered. This compares with 71.1% of warm tasks and only 56.7% of cold tasks.」
   - 理由最穩：hot 88.9%、warm 91.1%、cold 81.7%。「These results suggest that a filing system organised by reason or topic would support the re-finding of older information more effectively than an organisation based on the sender of the messages.」
   - 迴歸裡只有 sender 模型的溫度顯著：「p<0.01, OR=14.68, 95%CI= [3.16, 68.32] from Table IX」（hot vs 基準）。collection 越大越不記得寄件人（p=0.045）。
4. **歸檔策略與記憶：no-filers 記最多、frequent filers 最少**（4.6 節，Table VII）——任務書重點
   - 「The data show that, of the three filing groups, the group that remembered most were the no-filers. On average, the no-filers remembered more than the spring-cleaners and the spring-cleaners remembered more than the filers.」
   - Table VII（All tasks，% 任務記得）：
     - When：no-filers 63.0／spring-cleaners 57.8／frequent filers 34.6
     - Sender：81.5／71.1／69.2
     - Topic：85.2／75.6／76.9（topic 這欄 spring-cleaners 略低於 filers，不完全符合「nearly every attribute」的排序）
     - Reason：88.9／82.2／69.2
     - Other recipients：53.7／55.6／50.0
     - 任務數：54／45／26
   - 「the participants who employed a frequent filing strategy had access to temporal information very infrequently compared to the other groups.」
   - 「The evidence seems to favour Mander's argument that employing a no filing strategy leads to remembering more about the information in one's collection.」（正式版拼 "favor"）
5. **控制其他變項後，frequent filers 仍較少記得「何時」與「理由」**（第 5 節，Tables VIII、XI）
   - 「Both the "when sent" (p=0.01) and "reason sent"(p=0.02) models show that the filing strategy employed significantly influenced the probability that these attributes would be remembered. According to these models, participants who reported filing their emails regularly were less likely to remember when an email was sent or the reason that the email was sent. However, the models show no difference in the recollections of the participants with no-filing and spring-cleaning strategies.」
   - Table VIII（when sent，基準是 frequent filers）：No-filers OR 4.13 [1.39, 12.26]、spring-cleaners OR 4.08 [1.38, 12.02]；no-filers vs spring-cleaners OR 0.99 [0.47, 2.09]。
   - Table XI（reason sent）：No-filers OR 5.09 [1.20, 21.59]、spring-cleaners OR 5.79 [1.39, 24.19]。
   - sender、topic 模型裡歸檔策略不顯著（Table IX、X）。
   - 偏好搜尋的人較不記得理由：「participants who reported preferring to use a search interface when re-finding were less likely to remember the reason that an email was sent than those who reported no preference」（p=0.01）。
6. **「記得多不代表策略較好」——作者原句**（7. Discussion；正式版第 21:32 頁；作者稿第 2,455–2,462 行）
   - 「Nevertheless, this seems to be a rather paradoxical situation, where those who exert the most effort to keep their information organised actually exhibit the poorest recollection for their emails. However, just because a person remembers more by applying a particular filing strategy, it does not necessarily follow that this is the most effective strategy to use. It is possible that the participants who employed a frequent filing strategy are required to remember less in order to re-find because of the quality of their organisations.」
   - 正式版拼法：「…keep their information organized … However, just because a person remembers more by applying a particular filing strategy, it does not necessarily follow that this is the most effective strategy to use. It is possible that the participants who employed a frequent filing strategy are required to remember less in order to refind because of the quality of their organizations.」
   - 緊接著：「However, it would be interesting to examine how this impacts on their re-finding performance. We will examine the relationship between recollection and re-finding performance in our data in a future article.」
7. **機制解釋（作者推論，未測）**（7. Discussion）
   - 收件匣按時間排列，no-filers／spring-cleaners 互動時會看到信的時間脈絡；「Filers, on the other hand, remove this context when they move their messages to other folders. This means that not only do they come in to contact with filed messages less often, but when they do interact with the messages, there is no reminder of the temporal context.」
   - 設計建議：讓 filers 能切換到「把已歸檔的信放回收件匣原位、用顏色標資料夾」的檢視。
8. **設計含意**（7. Discussion）
   - 「Our data indicate that focusing support on temporal memories is probably unwise for email re-finding. The participants were only able to remember when an email was sent in 57.45% of the tasks」
   - 支持 task-based 與 project-based 組織，不支持以時間或以人為主的組織；回憶因情境而變，所以工具要有彈性。
   - 「In our study it was obvious that the participants remembered far more details about the sought-after information than they actually used in the process of re-finding.」→ 系統可以提示使用者用某些屬性。
9. **心理學背景的兩派預測**（2.3.4 節）：組織應該增進記憶（Bower et al. 1969；Craik & Lockhart 1972 處理層次）vs Mander et al. 1992：不歸檔的人必須常瀏覽收藏，因此更熟悉內容。本研究資料支持後者。

## 作者列的限制（第 6 節 LIMITATIONS）

- 樣本：「our study population consisted purely of computer scientists and computer science students and investigated their memories for tasks that revolved around work-based activities.」作者認為仍可某程度推廣（碩士生非資訊背景、涵蓋三種任務類型）。
- 信件量遠少於先前研究（Fisher et al.、Whittaker & Sidner、Mackay 報告每日 40–60 封；本研究 0.57–8.03 封，算法不同）：「our population had different characteristics to those of previous studies」。
- 任務描述必然透露被找資訊的一些內容：「This will undoubtedly affect the findings.」作者盡量避免用信中字詞、口頭朗讀任務。
- 變項控制：「we concede that there are many variables that we were not able to control including the temperature of the task, the frequency with which the users perform that kind of task, the filing strategy of the users, the collection size of the user, and the difficulty of the task.」以第 5 節迴歸處理。
- 「資訊在不在」那題：多數任務資訊都在，可能讓參與者傾向猜「在」；只有一次參與者刪掉了需要的信。
- 回溯式問卷：「this means that we did not record what the participants remembered, rather what they thought they remembered. It also means that the process of re-finding and the information that they saw during the completion of the task may have subconsciously influenced what the participants believed they remembered.」以放聲思考與實驗者追問緩解。

## 與摘要或常見轉述不一致處

1. **量的是自述記憶，不是找回成功。** 常見轉述「frequent filers 找信表現比較差」不在本文；本文沒有找回成功率資料，作者明說留待 follow-up article。也不是客觀記憶測驗，是任務後回溯自評（「what they thought they remembered」）。
2. **作者明說「記得多不代表策略較好」**（見結果 6 原句），而且提出相反可能：frequent filers 因為組織品質好，找回時本來就不需要記那麼多。轉述成「歸檔讓人記性變差、所以不要歸檔」是反向使用本文。
3. **歸檔策略比較的樣本極小**：只有大學部＋研究人員共 14 人（Table I 加總：filers 4、no-filers 5、spring-cleaners 5），frequent filers 只有 26 個任務。
4. **人數內部不一致**：Table VI 寫 No-Filers 4、Freq.Filers 5、spring-cleaners 5（正式版相同），與 Table I 加總（filers 4、no-filers 5）對調；而 Table VII 任務數 54／26／45、Table VI 每人平均 hot 任務 2.17（=13/6）、2（=6/3）、2.6（=13/5）反推是 **no-filers 6 人、frequent filers 約 3 人、spring-cleaners 5 人**。三處數字互相矛盾，引用時最好寫「14 名大學部與研究人員參與者」，不要寫各組人數。
5. **分母不一致**：4.1 節內文「159 (87.8%) of the 181 tasks」，Table III 卻是 159/189 = 84.1%，且內文 3.3%＋13.3%＋87.8% > 100%。正式版相同。引用建議用 Table III 的 84.1%（189 任務）或註明。
6. **"nearly every attribute follows this pattern" 不完全成立**：Topic 一欄 spring-cleaners 75.6% < frequent filers 76.9%。
7. **歸檔效果只在兩個屬性顯著**：迴歸裡 when sent 與 reason sent 顯著，sender、topic 不顯著；而且 no-filers 與 spring-cleaners 之間沒有差異。所以準確說法是「frequent filers 比另外兩組較少記得何時與為何」，不是「越常歸檔記得越少」的線性關係。
8. **Whittaker et al. 2011 對本文的轉述需修正**：該文 Related Work 寫「people remembered content, purpose, or task related information best, correctly recalling over 80% of this type of information, even when items were months old」——大致對（cold 任務 topic 80.0%、reason 81.7%），但「correctly」不準確，本文是自述。又寫「Filing information too quickly sometimes led to the creation of archives containing spurious information; premature filing also meant that users were not exposed to the information frequently in the inbox」——前半句（spurious information）**本文全文沒有**，比較像 Whittaker & Sidner 1996 的 premature filing 論點；後半句對應本文對 Mander 論點的延伸解釋，但那是作者推論，不是測得結果。
9. 樣本是一所大學資訊系、信件量很小（研究人員中位數 5,132 封，學生 100–200 封）；不能直接推到大型職場信箱。

## 讀取紀錄

- 主讀檔 `elsweiler2008.txt`：2,703 行、107,124 bytes（PDF 35 頁）。
- 依序讀：第 1–700 行（摘要、1 Introduction、2 Related Work、3 Methodology 至 3.3 Examining Recollections）→ 第 700–1,400 行（4.1–4.5，Tables III–V）→ 第 1,400–2,100 行（4.6 歸檔策略、Tables VI–VII、5 迴歸 Tables VIII–X 前半）→ 第 2,100–2,704 行（Table X 尾、XI、5 節結論、6 Limitations、7 Discussion、8 Conclusions、References）。全文讀完。第 35 頁只有「...」（PDF 抽取殘頁）。
- 核對檔 `elsweiler2008-acm.txt`（576 行、113,086 字元）：未通讀，只以字串比對核對上述關鍵句與表格（"just because a person remembers more"、"paradoxical"、"181 tasks"、Table I／III／VI／VII、"57.45"、"purely of computer scientists"、"what they thought they remembered"、"follow-up article"）；全部與作者稿一致。
- Table V（研究人員組）在 pdftotext 輸出中欄位錯位，數字未引用。Figures 1–10 是圖，只讀圖說。

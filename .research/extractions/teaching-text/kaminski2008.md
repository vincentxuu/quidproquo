# 抽取紀錄：Kaminski、Sloutsky、Heckler 2008，Science 320（Education Forum）

合法公開來源：https://mathcog.org/Publications/TheAdvantageOfAbstractExamplesInLearningMath.pdf （第一作者 Jennifer Kaminski 主持的 Mathematical Cognition Lab 網站；Science 排版的刊出版，2026-10-14 核對）。重新下載與手上的 `.work/teaching-text-research/src/kaminski2008.pdf` 位元組完全相同（247,446 位元組）。Science 出版者頁 Unpaywall 標 closed；公開的是作者實驗室放的出版者版面。

原文檔：/Users/vincent/Work/study/quidproquo/.work/teaching-text-research/seq/kaminski2008.txt（共 247 行、13,788 位元組）
讀取日期：2026-10-14

原文是三欄排版的兩頁短文，純文字檔把三欄與圖內文字交錯在一起（例如第 14–99 行每一行都混了兩到三欄）。我先依行號讀完純文字檔，再用 `pdftotext -layout src/kaminski2008.pdf -` 重抽全文（154 行）把欄位對回去。下面的行號一律指 `seq/kaminski2008.txt`。

## 研究設計

- 研究類型：四個實驗室實驗，發表在 Science 的 Education Forum 欄，兩頁，沒有獨立的方法、結果、限制各節；材料與方法在線上補充資料（註 9，第 224 行：「Materials and methods are available as supporting material on Science Online.」），這份補充資料不在原文檔裡，我沒有讀到。
- 受試者：大學生（第 19 行「undergraduate college students」）。原文沒有說年級、主修、招募方式、是否有酬。
- 要學的概念：三階交換群（第 73–78 行「a commutative mathematical group of order three」），作者說選它的理由是「it involves the most basic properties of the real number system, yet it is simple, novel to the study participants, and can be easily instantiated in different ways」（第 79–83 行）。
- 教材（instantiation）：
  - Generic：一種有三個符號的書寫語言，兩個以上符號組合會得到一個可預測的符號（第 84–91 行）。
  - Concrete A：三個裝了不同水量的量杯，要算合起來之後剩多少（第 14–20、94–99 行）。作者說這個教材在先前研究裡「facilitate quick learning of the rules」。
  - Concrete B、C：同樣的規則，換成披薩片或容器裡的網球（第 20–48 行）。
- 實驗一：80 人被分到四個條件，Generic 1、Concrete 1、Concrete 2、Concrete 3，分別學一個抽象教材、一個、兩個、三個具體教材（第 50–72 行）。「Training was equated across conditions; all participants were presented with the same rules and the same number of examples, questions with feedback, and test questions.」（第 73–76 行）
- 遷移測驗：所有人做同一個遷移任務，是同一個群結構的「novel concrete instantiation」，元素「perceptually rich」，包裝成三個物件的兒童遊戲（第 76–91 行）。受試者沒有受這個情境的訓練，但被告知「the rules of the game were like the rules of the system(s) they had just learned and that they could figure out these rules by using their newly acquired knowledge」（第 92–99 行）。看過一系列可以推出規則的例子之後，做 24 題選擇題，題目與學習階段的題目同構（第 99、138–141 行）。
- 實驗二：20 人學 Concrete A 與 B，並直接拿到兩個教材之間元素的對應（第 163–167 行）。
- 實驗三：20 人學 Concrete A 與 B 之後，被要求自己配對對應元素並寫下觀察到的相似處（第 169–173 行）。
- 實驗四：40 人分兩組，One-Generic（只學抽象教材）對 Concrete-then-Generic（先學 Concrete A 再學抽象教材）（第 148–152 行）。
- 量了什麼：學習階段的成績與時間；遷移測驗答對百分比；與機率水準比較。
- 效果量：原文沒有報告任何標準化效果量（沒有 d、η²）。圖的說明是「Transfer test scores across learning conditions (means ± SEM)」（第 136 行），各組平均只在圖上，內文沒有寫出實驗一與實驗四各組的平均數字。圖上有一條標「chance」的線，內文沒有寫機率水準是多少百分比。

## 結果（逐項）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 實驗一學習成績，各組沒有差別 | F(3,68) < 1 | 四個學習條件之間 | 實驗一內文 | 142–144 | 「participants successfully learned the material with no differences in learning scores (F3,68 < 1) or learning times (F3,68 < 1.5).」 |
| 2 | 實驗一學習時間，各組沒有差別 | F(3,68) < 1.5 | 同上 | 實驗一內文 | 144 | 同上 |
| 3 | 實驗一遷移，Generic 1 高於三個具體組的每一組 | F(3,68) = 11.9，P < 0.001；事後 Tukey 檢定 P 值 < 0.002 | Generic 1 對 Concrete 1、2、3 各組 | 實驗一內文 | 145–150 | 「Participants in the Generic 1 condition performed markedly higher than participants in each of the three concrete conditions (F3,68 = 11.9, P < 0.001; post hoc Tukey's test, P values < 0.002).」 |
| 4 | Generic 1 的遷移高於機率水準 | t > 7，P < 0.005 | 機率水準（數值原文沒有寫） | 實驗一內文 | 151 | 「transfer in the Generic 1 condition was above chance (t > 7, P <0.005)」 |
| 5 | 具體組的遷移沒有可靠地高於機率水準 | t 值 < 1.7，P 值 > 0.35；Concrete 3 是 t = 2.8，P = 0.06 | 機率水準 | 實驗一內文 | 151–153 | 「whereas transfer in the concrete conditions did not reliably exceed chance (t values < 1.7, P values > 0.35; t = 2.8, P = 0.06 for Concrete 3).」 |
| 6 | 實驗二（給對應關係）遷移沒有高於機率 | 41% ± 16.7%（平均 ± SD），t(19) = 0.94，P > 0.35 | 機率水準；沒有和實驗一的組做統計比較 | 實驗二內文 | 167–169 | 「To our surprise, this assistance yielded no improvement in transfer; scores were not above chance (means ± SD: 41% ± 16.7%, t19 = 0.94, P > 0.35).」 |
| 7 | 實驗三（自己比較）所有人都配對正確，但遷移分數雙峰 | 約 44% 的人高分（95% ± 4.7%）；其餘人 51% ± 11.6% | 同一組內的兩群；沒有報告和其他條件的檢定 | 實驗三內文 | 174–175、116–122 | 「All participants correctly matched elements, but the distribution of transfer scores was bimodal. Approximately 44% of our participants scored highly on the transfer test (95% ± 4.7%). However, the remaining participants did not do well (51% ± 11.6%).」 |
| 8 | 註 11：實驗三裡有遷移與沒遷移的人，學習成績的差異 | 93% ± 4.4% 對 84% ± 12.9%（平均 ± SD），t(16) = 1.97，P = 0.066 | 實驗三內，遷移成功者對未成功者 | References and Notes 註 11 | 227–229 | 「Learning scores differed between participants who transferred and those who did not (means ± SD: 93% ± 4.4% and 84% ± 12.9%, respectively), independent sample t test, t16 = 1.97, P = 0.066.」 |
| 9 | 實驗四：只學抽象教材的組勝過先具體再抽象的組 | t(31) = 2.7，P < 0.02 | One-Generic 對 Concrete-then-Generic | 實驗四內文 | 152–155 | 「The results were that participants who learned only the generic instantiation outperformed those who learned both concrete and generic instantiations (see experiment 4 in the figure above; t31 = 2.7, P < 0.02).」 |
| 10 | 作者提到另一份證據：11 歲兒童 | 沒有數字 | 抽象教材對具體教材 | 結尾段，引註 12 | 194–195 | 「We have evidence that 11-year-olds transferred successfully from a generic instantiation, but not from a concrete one (12).」 |

關於人數與自由度（原文沒有解釋的地方，照實記）：

- 實驗一寫「Eighty study participants were assigned」（第 50 行），但所有 F 檢定的誤差自由度是 68（第 144、149 行），對應 72 人進入分析。原文內文沒有說明少掉的人。
- 實驗四寫「Forty participants were assigned」（第 149 行），t 檢定自由度是 31（第 155 行），對應 33 人。原文內文沒有說明。
- 實驗三寫 20 人（第 169 行），註 11 的 t 檢定自由度是 16（第 229 行），對應 18 人。原文內文沒有說明。
- 實驗二 20 人，t(19)，一致。
- 結果表第 8 列（註 11）的檢定 P = 0.066，作者的句子寫「Learning scores differed」；這是原文的用字，照抄。
- 另一份來源對這件事的說法（不是 Kaminski 原文，出處是 Trninic、Kapur、Sinha 2020，`seq/trninic2020.txt` 第 116–117、126–145、631–634 行）：Kaminski 等人「only reported results after two levels of participant elimination」，兩層是排除離群值，以及排除訓練測驗低於機率水準、被視為「failing to learn」的人；Trninic 的表 1 列出的人數是抽象組 n = 18、具體組 n = 20，初始學習 80（SD 13.7）對 76（17.8），遷移 76（21.6）對 44（16.0），d > 1.6。這些數字與排除程序在 Kaminski 這兩頁正文裡都沒有寫。

## 作者自己的解釋與保留

- 對實驗一的解釋（第 153–162 行）：「These results indicate that learning one, two, or three concrete instantiations resulted in little or no transfer, whereas learning one generic instantiation resulted in significant transfer.」接著：「transfer failure suggests that participants may have been unable to recognize and align the underlying structure.」
- 對實驗三的解釋（第 122–128 行）：「Therefore, the act of explicit comparison may help some, perhaps high-performing, learners transfer, but may not help others (11).」
- 具體教材的好處，作者自己承認（第 129–141 行）：「Overall, concrete and generic instantiations have different advantages. Concrete instantiations may be more engaging for the learner and may facilitate initial learning (6), but do not necessarily promote transfer. At the same time, generic instantiations can be learned and do promote transfer.」
- 作者自己提出兩個可能的反對意見，並用實驗四回應（第 141–148 行）：「On these grounds, one could argue that presenting a concrete instantiation and then a generic instantiation may be an optimal learning design for promoting transfer. One could also argue that the concrete instantiations used in experiments 1 to 3 are very similar to each other and that successful transfer might require instantiations that are more diverse. We address these issues in experiment 4.」實驗四只測了第一項（先具體再抽象）；「具體教材彼此太像、需要更多樣」這一項，實驗四的設計（Concrete A 再接 Generic）沒有另外放進更多樣的具體教材，原文沒有再說明如何回應。
- 整體結論的措辭（第 156–159 行）：「Our findings suggest that giving college students multiple concrete examples may not be the most efficient means of promoting transfer of knowledge.」
- 作者主張可以推廣（第 159–167 行）：「because the concept used in this research involved basic mathematical principles and test questions were both novel and complex, these findings could likely be generalized to other areas of mathematics.」
- 機制的說法（第 167–175、188–189 行）：「Instantiating an abstract concept in a concrete, contextualized manner appears to constrain that knowledge and to hinder the ability to recognize the same concept elsewhere」；「Compared with concrete instantiations, generic instantiations present minimal extraneous information and hence represent mathematical concepts in a manner close to the abstract rules themselves.」
- 對實務建議的保留（第 196–204 行）：「presenting mathematical concepts through generic instantiations, such as traditional symbolic notation, may be more effective than a series of "good examples." This is not to say that educational design should not incorporate contextualized examples. What we are suggesting is that grounding mathematics deeply in concrete contexts can potentially limit its applicability.」
- 用字：正文一律用「generic instantiation」，只有標題與標題旁的摘要句用「abstract」。

## 作者列的限制

原文沒有 Limitations 節，也沒有任何一句以限制的形式寫出來的話。散在文中、性質接近限制的只有上面兩處：自己提出的兩個反對意見（第 141–148 行），以及「This is not to say that educational design should not incorporate contextualized examples」（第 199–200 行）。

原文沒有說的事（不是我的評價，只是記錄原文缺什麼）：機率水準的數值、各組平均分數的數字、各組實際分析人數、被排除者的原因、標準化效果量、遷移測驗與學習之間隔多久、是否有延宕測驗、受試者的數學背景。

## 與摘要不一致的地方

這篇沒有正式摘要，只有標題旁的一句（第 7–10 行）：「Undergraduate students may benefit more from learning mathematics through a single abstract, symbolic representation than from learning multiple concrete examples.」

- 這句和內文方向一致。
- 這句只講「一個抽象對多個具體」。內文還有三件它沒提的事：一個抽象也勝過一個具體（實驗一 Concrete 1）；直接給對應關係沒有幫助（實驗二）；先具體再抽象不如只學抽象（實驗四）。
- 標題用「Abstract Examples」，內文用「generic instantiation」。

## 與現有文章稿不一致的地方

對照的是 2026-10-14 讀到的版本。

**第 1 篇 `2026-10-13-teaching-text-evidence.md`**

1. 第 73 行：「Jennifer Kaminski 等人 2008 年在 Science 的短文報告，大學生用一套抽象符號學一個數學概念，遷移到新情境的表現比用量杯這類具體例子學的人好。」
   → 原文：Generic 1 高於三個具體組的每一組，F(3,68) = 11.9，P < 0.001（第 145–150 行）。方向與對照條件相符。
   → 漏掉的部分：(a) 遷移用的「新情境」是一個具體情境（兒童遊戲），這一點只寫在附錄，正文沒寫，而它正是 Trninic 2020 重做時改動的地方之一；(b) 具體組的遷移沒有可靠地高於機率水準（第 151–153 行）；(c) 四組在學習階段的成績與時間沒有差別（第 142–144 行）。建議正文至少補「遷移任務本身是另一個具體情境」。

2. 第 71、73–75 行這一小節的標題與做法：「先具體再抽象：方向有共識，例子的品質決定成敗」「做法：從一個具體情境開始沒有問題，但要在文中明寫『這個情境裡的哪個東西對應公式裡的哪個符號』，不要讓讀者自己配對。」
   → 原文有兩個直接相關、文章完全沒提的實驗：
   - 實驗四直接測了「先具體再抽象」，結果是只學抽象的組較好：「participants who learned only the generic instantiation outperformed those who learned both concrete and generic instantiations（t31 = 2.7, P < 0.02）」（第 152–155 行）。作者設這個實驗就是為了回應「one could argue that presenting a concrete instantiation and then a generic instantiation may be an optimal learning design」（第 141–144 行）。文章這一節談的正是先具體再抽象，卻只引了實驗一。
   - 實驗二直接把兩個具體教材之間的元素對應給受試者，結果「this assistance yielded no improvement in transfer; scores were not above chance」（第 167–169 行）；實驗三要受試者自己配對，所有人都配對正確，遷移分數卻是雙峰（第 174–175、116–128 行）。這兩個實驗給的是「具體對具體」的對應，不是「具體對符號」的對應，所以不能說它否定了文章的做法；但文章的做法說「明寫對應、不要讓讀者自己配對」，而同一份來源裡最接近的兩個實驗結果是「給了對應也沒有幫助」。
   → 建議：正文補一句實驗四的結果，並把「方向有共識」改掉或加上這個反例；做法那句標成作者的推論，並交代實驗二、三的結果與差別（那是兩個具體教材之間的對應）。目前第 184 行的推論清單裡沒有這一條。

3. 第 157 行：「**抽象例子還是具體例子**。Kaminski 等人 2008 年的結果是抽象較好，Trninic 等人 2020 年改良具體例子後差異消失或反轉。」
   → Kaminski 的部分相符。Trninic 的部分見 `trninic2020.md`。

4. 第 207 行附錄：「**Kaminski、Sloutsky、Heckler（2008）**，Science 320。實驗一 80 位大學生分四組：學一個抽象表徵，或學一、二、三個具體情境；各組的訓練量相同，遷移測驗是一個新的具體情境。」
   → 80 人是分派人數（第 50 行）；檢定的自由度是 F(3,68)，對應 72 人，原文沒有解釋。建議寫成「80 位大學生被分到四組（檢定自由度對應 72 人，原文內文沒有說明差額）」。
   → 「各組的訓練量相同」對應「Training was equated across conditions」（第 73 行），相符。
   → 「遷移測驗是一個新的具體情境」對應第 78–85 行，相符。
   → 附錄完全沒有列任何檢定結果，也沒有列實驗二、三、四。建議補：實驗一的 F 與具體組未高於機率；實驗二 41%；實驗三雙峰；實驗四 t(31) = 2.7。

5. 第 235 行參考資料：「讀了全文（兩頁）。」
   → 兩頁正文確實就是全文；但方法細節在線上補充資料（註 9），那份不在存檔裡。建議加「線上補充資料（材料與方法）沒有讀」。

6. 第 34 行結論表：「從具體情境講到抽象符號｜美國教育科學研究院指引評為中等；具體例子設計得好不好會翻轉結果｜中」
   → 這一列沒有直接引 Kaminski，但「先具體再抽象」被 Kaminski 實驗四直接檢驗過且結果相反，結論表沒有反映。建議在這一列加註。

**第 2 篇 `2026-10-13-teaching-text-questions-feedback.md`**

- 沒有直接引用 Kaminski 2008。第 164 行對照表「從具體問題到直覺與機制｜IES 評為中等；具體例子的設計決定成敗（Trninic 等 2020）｜方向有支持；缺『明寫具體與抽象的對應』」只引 Trninic；同上第 2 點，Kaminski 實驗四是「先具體再抽象」的反向結果，這一列的「方向有支持」沒有交代它。

**審稿報告的說法**：審稿報告「沒問題的項目」把 Kaminski 2008 列為數字核對相符（第 209 行），就文章已寫的內容而言是對的。審稿者沒有指出實驗四與實驗二、三沒被寫進去，這是同類的漏寫（來源裡有、會改變那一節結論的結果）。審稿報告建議修 19 提到 `sources.md` 仍寫 Kaminski「首頁正文」，我沒有去核對那個檔。

小計：不一致 5 條（上面第 1、2、4、5、6 點），相符 1 條（第 3 點的 Kaminski 部分）。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | 1–247 | 一次讀完全檔。第 1–13 行標題、摘要句、作者；第 14–99 行第一頁正文（三欄交錯，混有圖內文字）；第 100–112 行頁尾；第 113–137 行第二頁圖與圖說、實驗三後半；第 138–175 行實驗一結果、實驗二、三、四與討論（兩欄交錯）；第 176–187 行圖軸標籤與頁尾；第 188–204 行結尾段；第 205–239 行 References and Notes（共 13 條；其中註 9、11、13 是內容註，逐字讀；其餘書目，掃過）；第 240–247 行 DOI、補充資料網址、頁尾。 |
| 2 | （對照）| `pdftotext -layout src/kaminski2008.pdf -` 全文 154 行，用來把三欄對回原來的閱讀順序，確認第 14–99 行與第 113–175 行各句的歸屬。沒有新增內容。 |

## 補記（2026-10-14，複審後整理）

原文檔最後一行沒有換行符號，`wc -l` 少算一行；多出的那一行只有換頁字元，沒有內容。

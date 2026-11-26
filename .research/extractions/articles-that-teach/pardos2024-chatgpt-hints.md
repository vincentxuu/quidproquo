# 抽取紀錄：Pardos & Bhandari 2024，PLOS ONE 19(5): e0304013

- **書目**：Zachary A. Pardos、Shreya Bhandari（2024）〈ChatGPT-generated help produces learning gains equivalent to human tutor-authored help on mathematics skills〉，*PLOS ONE* 19(5): e0304013。doi:10.1371/journal.pone.0304013。作者全名與單位對過首頁（L46–50：Pardos 在 UC Berkeley 教育學院，Bhandari 在 UC Berkeley EECS）。收稿 2023-08-15、接受 2024-05-03、刊出 2024-05-24（L71–74）。
- **原文檔**：`.research/raw/learning-content/q6-evaluate/pardos2024chatgpthints.txt`（982 行、100,912 字元，`pdftotext -layout`，含 eScholarship 封面頁 L1–38 與參考文獻 L773–977）；PDF 同名 `.pdf`，19 頁（封面 1 頁＋期刊 18 頁）。
- **版本**：刊出版（期刊排版頁，經 eScholarship 典藏，CC BY 4.0）。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 28（#1）
- **版面**：PLOS ONE 是單欄正文加左側窄欄資訊，L41–148 左欄的出版資訊與正文交錯，但正文本身順序正確。Table 1、Table 2 對過 PDF 第 11、12 頁（期刊頁碼 10、11），數字與文字檔一致。Fig 1–3 對過 PDF 第 6–8 頁。

## 研究設計

- **類型**：線上隨機分派實驗，3（提示條件）× 4（科目）受試者間設計，前後測（L408–414）。另有一段不涉及學習者的內容品質檢查（RQ1）。
- **研究問題**（L133–136）：RQ1 ChatGPT 多常產出低品質提示、用抑制幻覺的技術能不能降低；RQ2 ChatGPT 提示有沒有學習增益、和真人家教寫的提示及完全沒提示相比如何。
- **受試者**：Amazon Mechanical Turk 工作者，限至少高中學歷且有 MTurk「Master」資格（L431–442）；排除參加過先導研究的人。招到 394 人，排除 120 人（對照 41、真人提示 43、ChatGPT 36；其中 75 人沒做前測或後測、45 人沒做完），分析樣本 274 人（對照 90、真人提示 86、ChatGPT 98）（L527–533）。年齡中位組 36–40 歲（L539–540）。原訂目標是每格 35 人、共 420 人（L451–452），實際每格 16–28 人（Table 2）。報酬 8 美元，預期 10–20 分鐘（L450–451）。期間 2023-02-28 至 2023-05-10（L452–454）。
- **教材**：OATutor 開源家教系統，題目取自 OpenStax 的 Elementary Algebra、Intermediate Algebra、College Algebra、Statistics 四本教科書，每科一個學習目標（L262–267：加減等量性質解方程、一般策略解一次方程、求直線方程、獨立與互斥事件）。題目不能含圖（L258–260）。
- **流程**：3 題前測 → 5 題「習得階段」（這裡才有提示） → 3 題後測，後測與前測是**完全相同的題目**，同一節內立即施測（L408–410）。
- **三個條件**：
  - 對照：沒有提示，但仍有答對答錯回饋，也可以要「bottom out hint」，直接拿到可複製貼上的答案（L416–419）。
  - 真人提示：OATutor 既有的提示，由篩選過、有數學家教經驗的 UC Berkeley 大學部學生撰寫，可以是多則文字提示或拆小題的 scaffold，經內容團隊編輯做過品質檢查（L284–290）。
  - ChatGPT 提示：把題目文字直接丟給 ChatGPT 3.5「Dec 15 Version」，回應整段當作一則 worked solution 提示，沒有特別設計提示詞（L328–334、L429–430）。兩個提示條件也都有 bottom out hint（L419–420）。
- **ChatGPT 提示進實驗前的人工把關**（L387–400）：第二作者逐則做三項檢查——答案對、過程對、沒有不當用語。任一項不過，**整題從題庫剔除**；剩下不到 8 題就換一個學習目標重來。所以受試者看到的 ChatGPT 提示全部通過人工檢查。
- **RQ1 的品質數字另外找人算**（L401–404）：六位 OATutor 內容團隊的大學部學生用同一套三項檢查重做，RQ1 與評分者一致性只用這六人的結果。
- **Self-consistency**（L360–369、L385–386）：第二作者對每題用 ChatGPT 生成 10 個回應，六位評分者把答案相同的回應分組，取最多的那一組；那一組若是錯的，該題算錯；同票用亂數決定。這個程序只用來算錯誤率，原文沒有說實驗裡給受試者的提示是用它挑出來的。
- **量了什麼**：學習增益＝每人後測平均減前測平均（L543–544）；作答總時間。
- **分析**（L455–478、L584–588）：Shapiro-Wilk 拒絕常態，因此用排序資料的 Two-Way ANOVA（條件、科目、交互作用），事後比較用 Dunn's test；前後測差異、前測平衡與時間用 Kruskal-Wallis，時間的成對比較用 Mann-Whitney U。

## 結果（逐項）

### RQ1　提示品質

| # | 結果 | 數字 | 對照／條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 評分者一致性 | Fleiss' κ = 0.929（Elementary）、0.864（Intermediate）、0.857（College）、0.916（Statistics） | 六位大學部評分者 | Results／RQ1 | L484–486 | 「Fleiss' Kappa were 0.929 for Elementary Algebra, 0.864 for Intermediate Algebra, 0.857 for College Algebra, 0.916 for Statistics, all showing almost perfect agreement」 |
| 2 | 未經處理的 ChatGPT 提示不合格率（整體） | 75 題中平均 24 題被剔除，32% | ChatGPT 3.5 單次回應、三項檢查 | Results／RQ1 | L489、L508 | 「Of the 75 problems that ChatGPT was prompted to generate a hint for, on average 24 were disqualified (32%)」 |
| 3 | 各科不合格 | Elementary 24 題中 6（25%）；Intermediate 15 題中 7（47%）；College 11 題中 3（27%）；Statistics 24 題中 7（29%） | 同上 | Table 1 | L498–503 | 表列（已對 PDF） |
| 4 | 不合格的原因 | 全部都是「答案錯且過程錯」；沒有不當用語、拼字或文法錯誤 | 同上 | Results／RQ1 | L510–512 | 「All disqualified hints were due to containing the incorrect answer and incorrect solution steps. None of the hints contained inappropriate language, poor spelling, or grammatical errors.」 |
| 5 | 人工檢查花的時間 | 平均每則 37.60 秒；各科合計 12、12、7.5、15.5 分鐘 | 人工檢查一則 ChatGPT 提示 | Results／RQ1、Table 1 | L498–503、L512–513 | 「The average time taken to manually check each hint was 37.60 seconds.」 |
| 6 | 套用 self-consistency 後的錯誤率 | Elementary 0%、Intermediate 2%、College 2%、Statistics 13% | 每題 10 個回應取眾數答案 vs 單次回應 | Results／RQ1 | L514–519 | 「resulted in an Elementary Algebra error of 0%, Intermediate Algebra error of 2%, College Algebra error of 2%, and Statistics error of 13%.」 |
| 7 | 提示長度 | ChatGPT：中位數 355 字（142–669）；真人提示序列：中位數 277 字（79–667） | 單則 ChatGPT 提示 vs 真人多則提示序列 | Results／RQ1 | L520–524 | 「we found a median word count of 355, minimum of 142, and maximum of 669. Human tutor-authored help sequences… had a median word count of 277, minimum of 79, and maximum of 667.」 |

### RQ2　學習增益（Table 2，L556–572，已對 PDF）

| 科目 | 條件 | N | 平均時間 | 學習增益 | 前測 | 後測 | p（該格前後測比較，Kruskal-Wallis） |
|---|---|---|---|---|---|---|---|
| 整體 | 對照 | 90 | 5 分 40 秒 | 1.85% | 55.15% | 57.01% | 0.192 |
| 整體 | 真人提示 | 86 | 7 分 58 秒 | 11.62% | 53.46% | 65.09% | 0.001 |
| 整體 | ChatGPT | 98 | 8 分 13 秒 | 17.00% | 43.51% | 60.52% | ≪0.001 |
| Elementary | 對照 | 25 | 5 分 17 秒 | 22.66% | 61.30% | 83.97% | 0.003 |
| Elementary | 真人提示 | 26 | 7 分 16 秒 | 20.50% | 62.79% | 83.31% | 0.003 |
| Elementary | ChatGPT | 26 | 5 分 58 秒 | 29.47% | 52.53% | 82.03% | 0.0004 |
| Intermediate | 對照 | 25 | 6 分 46 秒 | −4.00% | 67.96% | 63.98% | 0.644 |
| Intermediate | 真人提示 | 23 | 6 分 44 秒 | 5.80% | 72.42% | 78.24% | 0.216 |
| Intermediate | ChatGPT | 21 | 7 分 17 秒 | 9.53% | 69.80% | 79.34% | 0.111 |
| College | 對照 | 18 | 6 分 0 秒 | −7.41% | 33.32% | 25.91% | 0.161 |
| College | 真人提示 | 16 | 13 分 15 秒 | 6.25% | 24.98% | 31.23% | 0.257 |
| College | ChatGPT | 28 | 12 分 51 秒 | 9.52% | 19.04% | 28.56% | 0.076 |
| Statistics | 對照 | 22 | 5 分 34 秒 | −7.56% | 51.48% | 43.90% | 0.300 |
| Statistics | 真人提示 | 21 | 9 分 10 秒 | 11.10% | 42.82% | 53.93% | 0.232 |
| Statistics | ChatGPT | 23 | 6 分 55 秒 | 18.83% | 39.09% | 57.93% | 0.007 |

「學習增益」的單位是 3 題測驗的得分百分點（後測減前測）。

| # | 結果 | 數字 | 對照條件 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 8 | 各條件自身的前後測 | ChatGPT 43.51%→60.52%，p ≪ 0.001；真人提示 53.46%→65.09%，p = 0.001；對照 55.15%→57.01%，p = 0.192 | 同一組的後測 vs 前測（同題） | RQ2 | L546–548、L577–583 | 「translating to a 11.62% learning gain which was also statistically significant (p = 0.001)」 |
| 9 | 條件主效果 | F(2, 262) = 5.037，p = 0.0071 | 三條件的排序增益 | RQ2 | L589–590 | 「we found significant main effects of the condition (F(2, 262) = 5.037, p = 0.0071)」 |
| 10 | 科目主效果 | F(3, 262) = 6.737，p = 0.0002 | 四科 | RQ2 | L590–592 | 同句後半 |
| 11 | 條件 × 科目 | F(6, 262) = 0.901，p = 0.495（不顯著） | — | RQ2 | L592–594 | 「no statistically significant interaction between condition and subject」 |
| 12 | ChatGPT vs 對照 | p = 0.011（Dunn's test），17.00% vs 1.85% | ChatGPT 提示 vs 無提示 | RQ2 | L595–597 | 「learners in the ChatGPT condition exhibited statistically significantly greater learning gains (p = 0.011)」 |
| 13 | **真人提示 vs 對照** | **p = 0.087，不顯著**，11.62% vs 1.85% | 真人提示 vs 無提示 | RQ2 | L598–599 | 「Human tutor-authored hints were not statistically significantly different from the control (p = 0.087).」 |
| 14 | ChatGPT vs 真人提示 | p = 0.416，不顯著；作者另寫 ChatGPT 的增益「高 46.30%」（17.00 ÷ 11.62 的相對比，不是百分點差） | ChatGPT 提示 vs 真人提示 | RQ2 | L599–603 | 「However, the ChatGPT and human-authored hint learning gains were not statistically significantly separable (p = 0.416).」 |
| 15 | 科目間 | 只有 Elementary Algebra 的增益顯著高於另外三科 | 科目兩兩比較 | RQ2 | L603–605 | 「only Elementary Algebra showed statistically significant differences」 |
| 16 | 前測平衡（各科內） | p = 0.451、0.785、0.265、0.382（Elementary、Intermediate、College、Statistics） | 同一科內三條件的前測 | RQ2 | L620–622 | 「Participants in all conditions were even at pre-test within each subject as per a Kruskal-Wallis test」 |
| 17 | 作答時間 | 三條件有差（p ≪ 0.001）；兩個提示條件都比對照久（p ≪ 0.001）；兩個提示條件彼此無差（p = 0.614） | 平均作答時間 | RQ2 | L623–628 | 「Both hint conditions had higher times than the control (p «0.001) but were not separable from one another (p = 0.614).」 |
| 18 | 對照組的負增益 | Intermediate −4.00%、College −7.41%、Statistics −7.56%，都不顯著 | 對照組前後測 | RQ2 | L629–630 | 「likely not indicative of actual knowledge loss」 |
| 19 | 事後檢定力 | 假設 d = 0.5、α = 0.05：對照 vs 真人 0.910、對照 vs ChatGPT 0.926、真人 vs ChatGPT 0.920 | 成對比較 | RQ2 | L534–539 | 「indicating that our study was sufficiently powered」 |
| 20 | 流失 | 394 人中 120 人被排除，作者算 30% | 各條件排除 41、43、36 | RQ2 | L527–533 | 「This 30% attrition rate is high but consistent with rates observed in other studies conducted on Mechanical Turk」 |

Table 2 值得另外記的幾件事（表上讀得出來、作者沒有特別講）：
- 逐科看，12 格裡前後測達顯著的只有 Elementary 的三格（**含對照組**，22.66%，p = 0.003）與 Statistics 的 ChatGPT 格（p = 0.007）。Intermediate、College 三個條件都不顯著。
- 對照組在 Elementary 的增益（22.66%）比真人提示（20.50%）高。
- ChatGPT 組整體前測 43.51%，比對照（55.15%）與真人提示（53.46%）低約 10–12 個百分點。作者只報各科內的前測平衡檢定，沒有報整體前測的檢定。各格人數不均（College 的 ChatGPT 格 28 人，同科另兩格 18、16 人，而 College 是前測最低的科目），這會把 ChatGPT 組的整體前測往下拉。這一點是我對表的觀察，原文沒有討論。

### 先導研究的相反結果（作者自述）

| # | 結果 | 行號 | 原文一句 |
|---|---|---|---|
| 21 | 先導研究（N = 77，Elementary 與 Intermediate Algebra）裡真人提示的增益比 ChatGPT 高，且差異顯著；只有真人提示組前後測顯著 | L125–126、L641–646 | 「In our preliminary pilot study [12], human tutor-authored hints produced higher learning gains than ChatGPT-generated hints in all subjects (Elementary Algebra and Intermediate Algebra) and these differences were statistically significantly separable.」 |
| 22 | 作者把先導研究的結果歸因於 ChatGPT 組前測接近天花板、且 Intermediate Algebra 前測與對照不齊 | L646–656 | 「we posited that low ChatGPT learning gain results were heavily influenced by participants in that condition being near ceiling in both subjects at pre-test」 |

### 討論段的宣稱（沒有對應資料表）

| # | 宣稱 | 行號 | 原文一句 | 備註 |
|---|---|---|---|---|
| 23 | ChatGPT 提示的製作時間是真人提示的 1/20 | L661–663 | 「ChatGPT's hints were produced in 1/20th the time it took to produce human tutor-authored hints」 | 文中沒有列算式。可對照的只有導言引用別篇的「每題 11–25 分鐘」（L140–142）與本篇量到的檢查時間 37.60 秒；真人提示的品質檢查時間「was not reported」（L290） |
| 24 | 32% 的錯誤率高於對教師或助教的預期；不做錯誤抑制就不該把原始輸出放進教學 | L665–669 | 「Educators and education technology organizations should therefore be cautious when integrating raw ChatGPT output into their pedagogy without the use of error mitigation processing」 | |
| 25 | 壓不到接近零時，建議把回饋包裝成來自「不完美的機器人」或同儕 | L671–674 | 「system designers should consider framing ChatGPT-produced feedback as coming from an "imperfect robot" or peer-like source of information so that students may consider its responses critically」 | 這是建議，本篇沒有測 |
| 26 | 與 OpenAI 報告的 GPT-4 在 AP 微積分、物理、化學 27% 錯誤率相近 | L674–676 | 「The 32% error rate is very close to the 27% recently reported by OpenAI using ChatGPT 4」 | 轉引，本篇沒有測 GPT-4 |
| 27 | 代數「已可完全自動產生教材」 | L663–664、L716–718 | 「that subject area is primed for completely autonomous educational content generation」 | 推論；實驗中的提示是人工篩過的 |

## 作者自己列的限制

- 只能處理不含圖的題目（L681–683）。
- 用的是不公開權重的封閉模型（L685–686）。
- 受試者是群眾外包的成人，不是在學的中學生或大學生；作者引用另一篇研究說兩者結果一致來緩解（L690–699）。
- 流失率 30%，但各條件相近（36–43 人）（L700–703）。
- 範圍限於中學到大學初階的數學（L712–715）。
- 導言另外提到：對已學過的人，習得階段可能只是複習、增益可能是回想，所以才設無提示對照（L121–124）；方法段承認 Elementary Algebra 對高中畢業者「almost certain」是複習（L445–446）。
- 作者沒有列為限制、但設計上存在的：後測是同一節內的同題重測，沒有延後測驗、沒有遷移題；測驗只有 3 題；每格人數低於原訂的 35 人。

## 與摘要說法不一致的地方

- **標題與摘要用「equivalent」「no statistically significant differences」**：原文做的是差異檢定（Dunn's test，p = 0.416），沒有做等效性檢定。能說的是「分不出差異」，標題的「equivalent」比統計結果強。
- **摘要「only the ChatGPT condition produces statistically significant learning gains compared to a no-help control」**與正文一致（ChatGPT vs 對照 p = 0.011；真人 vs 對照 p = 0.087）。但要注意另一句不要混淆：真人提示組**自身前後測**是顯著的（p = 0.001，L579–581）。摘要沒有寫的是，這個結果等於說「既有的真人提示在這個樣本裡沒有顯著贏過無提示」。
- **摘要「failed quality checks on 32% of problems」**：正文寫「75 題中平均 24 題」（L489、L508），但 Table 1 四科的 N 相加是 74（24+15+11+24），剔除數相加是 23（6+7+3+7），23/74 = 31.1%。檢查時間四科合計 47 分鐘，47×60÷75 = 37.6 秒，與「75 題」相符。所以題數是 74 還是 75、剔除是 23 還是 24，原文自己對不上；正文說數字是「averaging the number of incorrect responses identified by each rater」，可能是六人平均後取整造成，但原文沒有交代。
- **摘要「reducible to nearly 0% for algebra problems」**：正文三科代數是 0%、2%、2%，沒有給題數或筆數；統計 13%。一致。
- 摘要沒有提到受試者看到的 ChatGPT 提示都先經人工檢查、不合格的題目已剔除。這一點在方法段（L387–393），讀摘要會以為 32% 的錯誤提示也進了實驗。

## 與清單『要撐的結論』不合的地方

清單寫：「AI 產生內容的錯誤率（32%）與壓低的方法；人工把關後的學習增益」。

- **32% 撐得住，但要帶條件**：這是 ChatGPT 3.5（2022 年 12 月 15 日版）對 74 或 75 題不含圖的代數與統計題、直接丟題目的單次回應，「錯」的定義是答案錯且過程錯。原文內部 23/74 與 24/75 對不上（見上）。不能寫成「AI 產生教材的錯誤率是 32%」這種通稱。
- **壓低的方法撐得住**：self-consistency（10 個回應取眾數答案）把代數降到 0–2%、統計 13%。但 (a) 分組與判定是六位人工評分者做的，原文沒有描述自動化的做法；(b) 這個程序只用來算錯誤率，沒有進入學習實驗；(c) 統計仍有 13%。
- **「人工把關後的學習增益」撐得住，而且這個限定詞很重要**：受試者只看到通過第二作者三項檢查的提示，所以學習結果是「人工篩過的 AI 提示」的結果，不是原始輸出的結果。
- **需要補上的**：(1) 增益是同題、同節內的立即後測，3 題；(2) 受試者是 MTurk 成人（年齡中位組 36–40），不是學生；(3) 與真人提示「相當」是沒有顯著差異（p = 0.416），不是等效性檢定；(4) 真人提示本身沒有顯著贏過無提示對照（p = 0.087），所以拿它當基準時基準本身就弱；(5) 逐科看，只有 Statistics 是 ChatGPT 組顯著而對照組不顯著，Elementary 連對照組都顯著進步；(6) 同一組作者的先導研究結果相反（真人提示顯著較好）。

## 讀取紀錄

依序讀原文檔 `pardos2024chatgpthints.txt`：
- L1–500（封面、摘要、Introduction、Related work、Methods、Results 開頭與 Table 1 前三列）
- L501–982（Table 1 其餘、RQ1、RQ2、Table 2、Discussion and future work、Conclusions、Author Contributions、References）

兩段首尾相接，涵蓋全文 982 行。參考文獻 L773–977 逐條掃過。

對過 PDF 版面：Table 1、Table 2（PDF 第 11、12 頁）；Fig 1、Fig 2、Fig 3（PDF 第 6–8 頁）。Fig 4（學習增益長條圖，PDF 第 13 頁）沒有另開圖檔看，正文對它的描述是「learning gains for all subjects were higher in the ChatGPT condition」（L601–602），與 Table 2 的數字相符。本篇沒有附錄或補充材料章節；資料集在 figshare（doi:10.6084/m9.figshare.23935269），沒有下載。

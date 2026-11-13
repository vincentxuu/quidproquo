# 抽取紀錄：Greving & Richter 2019，Frontiers in Psychology 9:2517（doi 10.3389/fpsyg.2018.02517）

- **書目**：Carla E. Greving（University of Kassel）、Tobias Richter（University of Würzburg）. Distributed Learning in the Classroom: Effects of Rereading Schedules Depend on Time of Test. *Frontiers in Psychology*, 9, 2517. 刊出日 2019-01-09（收稿 2018-06-15、接受 2018-11-26）。作者姓名、單位對過原文檔第 2 行的首頁資料與刊出版 PDF 首頁。DOI 字串裡的年份是 2018，刊出年是 2019。
- **原文檔**：`.research/raw/learning-content/q4-time/greving-richter2019-rereading-schedules-classroom.md`（441 行含末行、74,535 字元／74,943 位元組；來源是 Europe PMC 的全文 XML，PMC6333692）。
- **版本**：刊出版（CC BY 開放取用）。
- **讀取日期**：2026-10-14
- **表格對照**：另抓刊出版 PDF（`https://www.frontiersin.org/articles/10.3389/fpsyg.2018.02517/pdf`，15 頁，存在 session scratch，沒有存回 raw），用 `pdftotext -layout` 重抽後逐列核對 Table 1，16 列的係數、SE、z 與星號都與原文檔一致。全文只有這一張表。Figure 1–5 是圖，原文檔只有圖說；圖裡的數值（Figure 2、4、5 的估計平均）都在正文裡有寫。
- **供哪幾篇使用**：order 16（清單 D，16#4）。

## 研究設計

- **類型**：預先註冊的隨機實驗（L54；註冊 Greving & Richter 2017，OSF），在學校教室裡做。2 × 2 受試者間設計：學習條件（集中重讀 vs 隔 1 週重讀）× 保留間隔（短 vs 1 週）（L133）。分派方式是隨機區組：先依母語、讀寫障礙、先備知識、閱讀能力把學生配成同質的區組，再隨機分到四個條件（L76、L133）。
- **受試者**：德國黑森邦七年級學生 191 人（53% 女），來自 3 所學校的 8 個班（文理中學與綜合中學），平均 12.94 歲（SD 0.39）（L66）。家長同意率 97%。
  - 分派時：集中／延後測 49、集中／立即測 47、分散／延後測 48、分散／立即測 47（L66）。
  - 20 人缺了至少一次學習課、沒讀到兩次，全部分析都排除，剩 171 人：47、47、37、40（L68）。
  - 再有 26 人缺測驗或缺先備知識分數，回想與理解分析剩 **145 人**：集中／延後 36、集中／立即 45、分散／延後 26、分散／立即 38（L68）。
- **教材**：一篇說明文，主題是細菌細胞，74 句、977 個字（德文），Flesch 易讀度 54（德文公式）；旁邊固定放一張細胞構造圖（L72）。主題在該邦生物課的延伸課綱內，但通常不會教到（L72）。閱讀方式是電腦上的移動視窗：一次只有一句清楚、其他句子模糊，可以回頭重看前面的句子，自己控制速度（L108）。
- **比較對象**：
  - 集中重讀：第二次上課時讀一遍，讀完立刻再讀一遍。
  - 分散重讀：第二次上課讀一遍，隔 1 週在第三次上課再讀一遍。
  - 沒有「只讀一遍」的對照組。
- **程序**（L116–129）：共四次上課。第一次做前測（先備知識、閱讀策略知識 WLST、閱讀能力 ELVES、工作記憶 RSPAN）。第二次：分散組讀一遍後做填充作業；集中組讀兩遍，做後設認知評估，然後短間隔組接受測驗、長間隔組做填充作業。第三次：分散組讀第二遍、做後設認知評估，短間隔組測驗；集中組的長間隔組在這一次測驗。第四次：分散組的長間隔組測驗。
- **量了什麼**：
  - 自由回想：2 分鐘內寫下記得的內容，題目問的是「the first part of the text」（L98）；兩位評分者，ICC(2,1) = 0.92。
  - 文本理解：8 題簡答加 6 題單選（四選一），全部是問文中明寫的字面題（L102「All questions were literal questions asking for information explicitly stated in the text」）；平均難度 0.30（L102）。
  - 閱讀時間：每句的閱讀時間除以該句字母數（L108）。
  - 重讀後的後設認知評估（5 點量表）：預測學習成果、感受到的閱讀難度、專注程度（3 題，α = 0.64）（L112）。
  - 先備知識：5 題開放題加上植物細胞與細菌細胞的構造圖標示（L80）。
- **何時量**：短間隔在正文寫「5 min after rereading」（L56），摘要寫「after 4 min」（L9）；長間隔是重讀後 1 週。
- **分析**：回想與後設認知用線性模型；閱讀時間用線性混合模型；理解用廣義線性混合模型（學生與題目為隨機截距）。有方向的假設用**單尾檢定**，α = .05（L137）。沒有排除離群值。

## 結果（逐項）

### 自由回想（L141–146；Figure 2A）

數值是模型估計的回想概念數。t 檢定自由度 137。

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 保留間隔主效果 | β = 0.57，SE 0.17，t(137) = 3.34，p < .001 單尾，ΔR² = .08；短間隔 M = 3.21（SE 0.22）、長間隔 M = 2.06（SE 0.26） | 短間隔 vs 1 週後（兩種重讀方式合併） | L141 | 「recall performance was better at the short interval (M = 3.21, SE = 0.22) than at the long retention interval (M = 2.06, SE = 0.26)」 |
| 2 | 先備知識主效果 | β = 0.55，SE 0.19，t(137) = 2.86，p = .002 單尾，ΔR² = .05 | 先備知識每高 1 個標準差 | L141 | 「a difference of one standard deviation in prior knowledge corresponded to a 0.55 difference in the free recall task」 |
| 3 | 學習條件主效果：**不顯著** | β = −0.19，SE 0.17，t(137) = −1.09，p = .140 單尾，ΔR² = .03；集中 M = 2.82（SE 0.22）、分散 M = 2.45（SE 0.26） | 集中重讀 vs 隔 1 週重讀（兩個測驗時間合併） | L141 | 「No main effect of learning condition was found on recall performance」 |
| 4 | 學習條件 × 保留間隔交互作用 | β = −0.46，SE 0.17，t(137) = −2.687，p = .004 單尾，ΔR² = .04 | — | L141 | 「a significant interaction between learning condition and retention interval emerged」 |
| 5 | 集中組從短到長間隔下降 | 3.86（SE 0.30）→ 1.79（SE 0.34），t(137) = −4.60，p < .001 | 集中組內：立即測 vs 1 週後測（不同學生） | L141 | 「In the massed condition, recall performance decreased from the short (M = 3.86, SE = 0.30) to the long retention interval (M = 1.79, SE = 0.34)」 |
| 6 | 分散組從短到長間隔**沒有顯著下降** | 2.56（SE 0.33）→ 2.34（SE 0.40），t(137) = −0.43，p = .666 | 分散組內：立即測 vs 1 週後測（不同學生） | L141 | 「no difference was found between the short interval (M = 2.56, SE = 0.33) and long retention interval (M = 2.34, SE = 0.40) in the distributed condition」 |
| 7 | 短間隔時**集中勝分散** | 3.86 vs 2.56，t(137) = −2.93，p = .004 | 集中重讀 vs 隔 1 週重讀，重讀後約 5 分鐘測 | L141 | 「at the shorter retention interval, students in the massed condition outperformed students in the distributed condition」 |
| 8 | 長間隔時兩組**無顯著差異**（數字上分散略高） | 集中 1.79（SE 0.34）vs 分散 2.34（SE 0.40），t(137) = 1.05，p = .297 | 集中重讀 vs 隔 1 週重讀，重讀後 1 週測 | L141 | 「At the longer retention interval, a slight and non-significant difference was found in the opposite direction between the massed (M = 1.79, SE = 0.34) and distributed condition (M = 2.34, SE = 0.40)」 |

作者小結（L146）：「the benefit of distributed rereading at the longer retention interval predicted in Hypothesis 1 did not occur.」

### 文本理解（L150–180；Table 1 在 L151–172；Figure 2B、Figure 3）

數值是由 log odds 轉回的答對機率。Table 1 已對過 PDF 版面。

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 9 | 保留間隔主效果 | 係數 0.305，SE 0.098，z = 3.100，p < .001 單尾；短間隔機率 0.41（SE 0.07）、長間隔 0.28（SE 0.07） | 短間隔 vs 1 週後 | Table 1、L173 | 「Participants performed better at the short retention interval (probability = 0.41, SE = 0.07) than at the long retention interval (probability = 0.28, SE = 0.07).」 |
| 10 | 先備知識主效果 | 係數 0.477，SE 0.111，z = 4.309，p < .001 | 先備知識每高 1 個標準差，答對機率差 11% | Table 1、L173 | 「A difference of one standard deviation in prior knowledge corresponded to a 11% difference in the probability to provide a correct response.」 |
| 11 | 學習條件主效果：**不顯著** | 係數 −0.082，SE 0.098，z = −0.839，p = .201 單尾；集中 0.37（SE 0.07）、分散 0.33（SE 0.08） | 集中 vs 分散（兩個測驗時間合併） | Table 1、L173 | 「The main effect of learning condition was not significant」 |
| 12 | 學習條件 × 保留間隔 | 係數 −0.192，SE 0.098，z = −1.949，**p = .026 單尾** | — | Table 1、L173 | 「the model revealed a significant interaction between learning condition and retention interval, β = -0.19, SE = 0.10, z = -1.95, p = 0.026, one-tailed」 |
| 13 | 集中組下降 | 0.47（SE 0.08）→ 0.26（SE 0.07），z = −3.97，p < .001 | 集中組內：立即測 vs 1 週後測 | L173 | 「students in the massed condition showed a decrease in the text comprehension performance from the short (probability = 0.47, SE = 0.08) to the long retention interval (probability = 0.26, SE = 0.07)」 |
| 14 | 分散組**沒有顯著下降** | 0.35（SE 0.08）→ 0.30（SE 0.08），z = −0.81，p = .420 | 分散組內：立即測 vs 1 週後測 | L173 | 「no significant decrease in text comprehension performance was found in the distributed condition」 |
| 15 | 短間隔時集中勝分散 | 0.47 vs 0.35，z = −2.16，p = .031 | 集中 vs 分散，重讀後約 5 分鐘測 | L173 | 「At the short retention interval, the difference between massed and distributed condition was statistically significant, z = -2.16, p = 0.031」 |
| 16 | 長間隔時**無顯著差異** | 集中 0.26 vs 分散 0.30，z = 0.75，p = .455 | 集中 vs 分散，重讀後 1 週測 | L173 | 「whereas the difference at the long retention interval was not significant, z = 0.75, p = 0.455」 |
| 17 | 題型主效果：不顯著 | 係數 −0.542，SE 0.304，z = −1.782 | 簡答 vs 單選 | Table 1 | 表列，無星號 |
| 18 | 先備知識 × 題型 | 係數 0.174，SE 0.060，z = 2.953（p < .01） | — | Table 1 | 表列；正文沒有另外解釋 |
| 19 | 學習條件 × 先備知識 × 題型 | 係數 0.151，SE 0.060，z = 2.587，p = .010 | — | Table 1、L175 | 「The performance of students in the distributed condition was more strongly associated with prior knowledge than in the massed condition, but only with short-answer questions」 |
| 20 | 低先備知識（平均下 1 SD）的學生在簡答題上，**分散比集中差** | 分散 0.10（SE 0.03）vs 集中 0.18（SE 0.05），z = −2.10，p = .036 | 集中 vs 分散，只看簡答題，兩個測驗時間合併 | L175 | 「students with low prior knowledge showed lower comprehension performance in the distributed condition (probability = 0.10, SE = 0.03) than in the massed condition (probability = 0.18, SE = 0.05)」 |
| 21 | 高先備知識（平均上 1 SD）的學生在簡答題上無差異 | 集中 0.33（SE 0.07）vs 分散 0.39（SE 0.09），z = 0.88，p = .380 | 同上 | L175 | 「for students with high prior knowledge, no such difference was found」 |
| 22 | 保留間隔 × 先備知識 × 題型 | 係數 −0.117，SE 0.060，z = −1.992（p < .05） | — | Table 1 | 表列；正文沒有解釋這一項 |
| 23 | 其餘交互作用皆不顯著 | 學習條件 × 題型 −0.006；學習條件 × 先備知識 0.087；保留間隔 × 題型 −0.072；保留間隔 × 先備知識 0.011；三因子（條件 × 間隔 × 題型）0.029；三因子（條件 × 間隔 × 先備知識）−0.090；四因子 −0.011 | — | Table 1 | 表列 |

第 20–21 項作者自己定位為探索性（L180「our exploratory findings showed that participants with low prior knowledge seemed to be impeded by distributed rereading」），討論裡說是「a hint」，而且自由回想與單選題沒有這個關係（L228「However, this relationship was not found in the free recall task and for single-choice questions.」）。

### 閱讀時間（L184–189；Figure 4）

單位是每個字母的閱讀時間（原文沒有寫單位，照量法推測是毫秒／字母，不確定）。

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 24 | 學習條件主效果 | β = 9.72，SE 1.53，t(169) = 6.34，p < .001；分散 M = 70.07（SE 6.78）、集中 M = 50.62（SE 6.72） | 分散 vs 集中（兩次閱讀合併） | L184 | 「indicating slower reading times in the distributed condition」 |
| 25 | 第二次讀比第一次快 | β = 20.36，SE 0.65，t(25062.99) = 31.26，p < .001；集中組 t = 33.63、分散組 t = 11.72，皆 p < .001 | 第一次 vs 第二次 | L184 | 「The second text presentation was read faster than the first」 |
| 26 | 交互作用 | β = −9.04，SE 0.65，t(25062.99) = −13.88，p < .001 | — | L184 | 「this difference was larger in the massed condition」 |
| 27 | 第一次閱讀兩組無差異 | 集中 80.02（SE 6.77）vs 分散 81.38（SE 6.85），t(235.51) = 0.41，p = .682 | 集中 vs 分散，第一次閱讀 | L184 | 「the reading times in the first presentation did not differ」 |
| 28 | 第二次閱讀分散組讀得慢很多 | 分散 58.75（SE 6.85）vs 集中 21.23（SE 6.77），t(235.51) = 11.27，p < .001 | 集中 vs 分散，第二次閱讀 | L184 | 「in the second presentation, participants in the distributed condition (M = 58.75, SE = 6.85) read the text more slowly than participants in the massed condition (M = 21.23, SE = 6.77)」 |
| 29 | 重讀時閱讀時間的降幅（作者在討論裡算的） | 集中 74%、分散 24%；對照 Rawson 2012 的大學生：分散 14%、集中 22% | 第一次 vs 第二次 | L230 | 「this decline was higher for the massed condition (74%) than for the distributed condition (24%)」 |

第 29 項：我用第 27、28 項的估計平均重算，集中是 (80.02 − 21.23) / 80.02 = 73.5%，與 74% 相符；分散是 (81.38 − 58.75) / 81.38 = 27.8%，與原文寫的 24% 不符。原文沒有說 24% 是怎麼算的（可能用原始平均而非模型估計值），引用時要註明是作者的說法。

作者對集中組的解讀（L230）：「the extent that seventh-graders in the massed condition engaged in meaningful processing of the text during rereading is questionable.」

### 重讀後的自我評估（L193–208；Figure 5）

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 30 | 感受到的閱讀難度：**未達顯著** | β = 0.11，SE 0.07，t(169) = 1.65，p = .051 單尾，ΔR² = .02；分散 M = 2.38（SE 0.10）、集中 M = 2.15（SE 0.09） | 分散 vs 集中 | L197 | 「it failed to reach significance by a narrow margin … Hypothesis 5 was not supported.」 |
| 31 | 預測自己的學習成果：分散組較低 | β = −0.16，SE 0.07，t(169) = −2.46，p = .008 單尾，ΔR² = .03；分散 M = 2.71（SE 0.10）、集中 M = 3.04（SE 0.09） | 分散 vs 集中 | L204 | 「students in the distributed condition (M = 2.71, SE = 0.10) predicted lower learning success than students in the massed condition (M = 3.04, SE = 0.09)」 |
| 32 | 專注程度：**與假設方向相反**，集中組較高 | β = −0.13，SE 0.05，t(511) = −2.70，p = .004 單尾，ΔR² = .01；集中 M = 3.49（SE 0.07）、分散 M = 3.23（SE 0.07） | 分散 vs 集中 | L208 | 「but in the opposite direction than predicted in Hypothesis 7. Students reported higher on-task focus when rereading in a massed fashion」 |

第 32 項的 p 值標「one-tailed」，但效果方向與假設相反；照單尾檢定的邏輯，這個結果不能算支持任何預先的假設，原文仍照顯著報告。

### 假設對照（L180、L189、L197–208）

- H1（分散在長間隔時較好）：**不支持**。有交互作用，但 1 週後沒有分散的優勢。
- H2（兩組從短到長間隔都下降）：只在集中組成立。
- H3（先備知識高的學得多）：支持。
- H4（分散組第二次讀得久）：支持。
- H5（分散組覺得較難）：不支持（p = .051）。
- H6（分散組預測成果較低）：支持。
- H7（分散組較專注）：不支持，方向相反。

### 討論中可引的說法

- 遺忘幅度（L214）：「we found a decline of 50% in the massed condition and only 10% in the distributed condition」；對照 Rawson 2012 是集中 49%、分散 3%（Rawson 的延後測驗是 2 天後）。原文沒說這兩個百分比用哪個指標算。我重算：回想是集中 (3.86 − 1.79)/3.86 = 53.6%、分散 (2.56 − 2.34)/2.56 = 8.6%；理解是集中 (0.47 − 0.26)/0.47 = 44.7%、分散 (0.35 − 0.30)/0.35 = 14.3%。兩個指標都只是大約接近 50% 與 10%。
- 「集中重讀」不是嚴格的集中（L220）：977 個字讀完才回到第一句，每一句的兩次出現之間本來就隔了其他句子；作者同意 Rawson 2012 說「massed is somewhat of a misnomer」，但認為文本應視為一個學習單位，所以保留這個詞。
- 真實教學情境沒有純粹的集中重複（L220）：「In real-world learning settings, didactical strategies exclude pure massed repetitions … All of this implies that the pure spacing effect as defined by Cepeda et al. (2006) does not occur outside the laboratory. The research on distributed learning in real-world educational settings seems to investigate the lag effect rather than the spacing effect」。
- 間隔選得不理想（L226）：依 Cepeda 等 2008，保留間隔 1 週時最適的學習間隔是 1 到 2 天（保留間隔的 20–40%）；學習間隔 1 週時最適的保留間隔是 18–35 天。作者註明這些建議來自簡單語文材料、不是文本。本研究選「兩個間隔一樣長」是配合學校每週上一次課的節奏。作者推測保留間隔更長時分散的效果可能出現（L226「an effect of distributed rereading could emerge with a longer retention interval」），這是推測，沒有資料。
- 結論句（L236）：「our results leave open the question of whether distributed rereading is also a desirable difficulty that should be promoted in school learning.」

## 作者自己列的限制（L234，另見 L226）

1. 只比了兩個保留間隔與兩個學習間隔，「provides only a snapshot of learning」，結果不好解讀。
2. 教室情境無法完全控制干擾與中斷，可能增加雜訊（作者認為不致造成系統性混淆）。
3. 教材與主題有限，能不能推到其他主題與文本不清楚。原文這裡寫「the participants in this experiment read just two texts」，但方法節只描述一篇文本讀兩遍；「two texts」應是指同一篇的兩次呈現（L127 也把第二次閱讀稱為「the second text」）。
4. 學習間隔與保留間隔的比例不是 Cepeda 等 2008 建議的最適值（L226）。

作者沒有列、但從方法節看得出來的：分析樣本從 191 人掉到 145 人（少 24%），而且流失不平均，分散／延後測那一格只剩 26 人（原 48 人），集中／立即測剩 45 人（原 47 人）；原文沒有討論差別流失。閱讀能力測驗的信度偏低（α = 0.58，L88）；專注量表 α = 0.64。回想測驗只問文本的第一部分、限時 2 分鐘；理解題全部是字面題，沒有量推論或遷移。沒有只讀一遍的對照組，所以這個研究說不出「重讀本身有沒有用」。

## 與摘要說法不一致的地方

1. 摘要寫短間隔是「after 4 min」（L9），正文寫「5 min after rereading」（L56）。PDF 版面兩處也是這樣寫，不是轉檔造成的。
2. 摘要寫「Seventh-graders (N = 191)」，但學習成果分析實際只有 145 人，閱讀時間與自評分析是 171 人。摘要沒有交代。
3. 摘要寫分散組「showed no forgetting」；正文是下降不顯著（回想 2.56 → 2.34，p = .666；理解 0.35 → 0.30，p = .420），討論裡作者自己也寫了「only 10%」的下降。「沒有遺忘」是「沒有測到顯著下降」，而且分散／延後那一格只有 26 人。
4. 摘要寫分散組「reported a lower on-task focus」，沒有說這與預先註冊的假設方向相反。
5. 摘要最後一句說重讀分散「makes learning more demanding and difficult」，但直接量難度感受的那一題未達顯著（p = .051，H5 不支持）；這句話靠的是閱讀時間與預測成果兩項。

## 與清單「要撐的結論」不合的地方

清單寫的是：「隔一週重讀，一週後與馬上重讀持平；真實情境沒有嚴格的『集中』」。

- 「一週後持平」：撐得住，但要寫成「一週後測不出差異」。回想 1.79 對 2.34（p = .297）、理解 0.26 對 0.30（p = .455），數字上分散略高、未達顯著，每格 26 到 36 人，檢定力有限；原文沒有做等價檢定，不能寫成「兩者一樣」。
- 這句話漏掉了同一個研究裡方向相反的結果：**重讀後幾分鐘就測時，集中重讀明顯較好**（回想 3.86 對 2.56，p = .004；理解 0.47 對 0.35，p = .031）。只引「一週後持平」會讓讀者以為分散沒有代價。
- 也漏掉探索性結果：先備知識低的學生在簡答題上，分散比集中差（0.10 對 0.18，p = .036）；只在簡答題出現，作者稱為「a hint」。
- 「真實情境沒有嚴格的集中」：原文有這個論點（L220），但它是作者在討論裡的論證（文本重讀時句子之間本來就有間隔，加上列舉的幾篇教室研究不符合 Cepeda 的定義），不是本研究的實證結果。引用時要寫成作者的主張。
- 適用範圍要寫清楚：七年級、一篇 977 字的生物說明文、重讀（不是提取練習）、學習間隔與保留間隔都是 1 週、字面題與部分回想。

## 讀取紀錄

| 段 | 原文檔行號 | 內容 |
|---|---|---|
| 1 | L1–60 | 來源註記、首頁資料、摘要、關鍵字、前言六小節、本實驗與七個假設 |
| 2 | L62–133 | 受試者、文本、學習者特徵測量、成果測量、歷程測量、程序、Figure 1 圖說、設計與組間等同性檢定 |
| 3 | L135–208 | 分析方法、回想、理解（含 Table 1 全表）、閱讀時間、三項自評、Figure 2–5 圖說 |
| 4 | L210–256 | 討論全文、限制、結論、資料可得性、倫理、作者貢獻、利益衝突、經費、致謝 |
| 5 | L258–441 | 參考文獻（掃過） |

對過 PDF 版面的表：Table 1（刊出版 PDF `pdftotext -layout` 輸出的第 520–560 行）。另外在 PDF 版面核對了「4 min」「5 min」「two texts」「first part of the text」四處字句，與原文檔相同。

原文沒有附錄與補充材料（首頁資料標 `pmc-prop-has-supplement` 為 no）；資料集在 OSF（https://osf.io/2sxu3/），沒有讀。

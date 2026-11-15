# 抽取紀錄：Macaluso、Beuford、Fraundorf 2022，Journal of Intelligence 10(4):83

**書目**：Jessica A. Macaluso、Ramya R. Beuford、Scott H. Fraundorf (2022). Familiar Strategies Feel Fluent: The Role of Study Strategy Familiarity in the Misinterpreted-Effort Model of Self-Regulated Learning. *Journal of Intelligence*, 10(4), 83. doi: 10.3390/jintelligence10040083。PMC9590044。CC BY。收稿 2022-08-16、接受 2022-10-06、刊出 2022-10-12。作者姓名與單位對過檔案第 2 行的期刊中繼資料（Macaluso 與 Fraundorf：匹茲堡大學 LRDC；Beuford：LRDC 與 Harris-Stowe State University）。清單寫的「Beuford」拼法正確。

**原文檔**：`.research/raw/learning-content/q4-time/familiar-strategies-feel-fluent-2022.md`（549 行、121,307 字元、121,956 位元組；Europe PMC fullTextXML 轉出，L543 一行是 22,998 字元的參考文獻清單）
**版本**：刊出版（開放取用）。這份檔沒有圖：Figure 1–5 只有圖說，Figure 4、5 的中介路徑係數（未標準化）讀不到，下面的中介結果只有正文報的 t、z、p、R²。
**讀取日期**：2026-10-14
**表格對照**：Table 1、Table 2 另從 `https://www.ebi.ac.uk/europepmc/webservices/rest/PMC9590044/fullTextXML` 重抓 XML（存在 scratch，240,321 位元組）逐格對過，與原文檔一致；正文與表不一致的地方（見後）在 XML 裡也一樣，是原文本身的問題，不是轉檔造成。沒有對 MDPI 的 PDF 版面。
**供哪幾篇使用**：order 15（讀者知不知道自己懂了）；清單註記可能與 order 16、25 共用。

## 研究設計

- **類型**：兩個線上實驗，受試者內設計（每人都經歷 blocked 與 interleaved 兩種排程），順序對抗平衡。排程對「客觀學習」的效果是實驗操弄；知覺（費力、學到多少、熟悉）與策略選擇之間的關係是相關性的中介分析。
- **受試者**：
  - Study 1：328 人，Sona Systems 招募，匹茲堡大學修課學分（IRB 為匹茲堡大學；限制一節稱「undergraduate psychology students」）。71.4% 女性；98.5% 為 18–24 歲（L95）。原定 N = 96（依 Kirk-Johnson 等 2019 的效果估計，95% 檢定力），為了系上研究參與需求一路收到學期末（L91–93）。
  - Study 2：377 人，同樣管道；76% 女性；99.7% 為 18–24 歲（L150）。
- **教材**：鳥類照片分類。兩個學習階段各 3 個鳥科、每科 15 張（每階段 45 張），每張顯示 3 秒自動換頁，科名標在圖上方。第一階段一律是 finches、jays、orioles，第二階段一律是 sparrows、tyrant flycatchers、wood warblers；變的是哪一階段用哪種排程（L132）。之前有示範階段（6 張，各科 1 張，三選一並給正解）與兩個練習階段（企鵝／紅鶴、鸚鵡／鴨）。
- **比較對象**：blocked（同一科全部看完再換下一科；對受試者說「grouped together by type」）對 interleaved（三科輪流各一張；「not grouped together by type」）。Study 1：179 人先 blocked、148 人先 interleaved（加起來 327，比 328 少 1，原文沒解釋）；Study 2：187 與 189（加起來 376，比 377 少 1）。
- **量了什麼、何時量**：
  1. 每個學習階段結束後立刻填 immediate-perception 問卷：費力 4 題、覺得學到多少 4 題、熟悉 4 題，1–6 分（附錄 A.1）。熟悉量表是本研究新編的。α 在 .70–.94 之間（L111、L160）。
  2. 兩階段都結束後填 retrospective semantic-differential 問卷 12 題：1 = blocked、6 = interleaved，3.5 為無偏好（附錄 A.2）。
  3. 策略選擇（假設性）：「Imagine that you had to study more birds like you did today. Which strategy would you use…」二選一（L138）。
  4. 選完之後才顯示一段文字，說先前研究發現 90% 的人不分組學得比較好，再用開放題問會不會改答案（L140，探索性質）。
  5. Study 1 的收尾階段每科只有 1 張圖，作者明說不看這個成績（L142）。**Study 1 沒有客觀學習測驗。**
  6. Study 2 改成後測：每科 11 張新圖（其中 10 張取自 BirdWeb，同科的 10 個不同物種各一張），不限時（L156、L168、L174）。學習階段結束到後測之間隔了三份問卷與選擇題，沒有另設延宕。
- **分析**：成對 t 檢定；個別邏輯斯迴歸；中介分析用 R 套件 mediation 做 1,000 次 bootstrap，報未標準化效果（L205）。預測變項是「interleaved 減 blocked」的差異分數。

## 結果（逐項）

### 策略選擇

| # | 結果 | 數字 | 條件 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | Study 1 選 blocked 的比例 | 76.6% | 兩種都體驗過、填完兩份問卷之後、**看到「90% 的人 interleaved 學得較好」那段說明之前**的假設性二選一 | 3.1.1 | L182 | 「most participants chose a blocked schedule (76.6%) compared to the interleaved schedule.」 |
| 2 | Study 2 選 blocked 的比例 | 76.9% | 同上 | 3.2.1 | L273 | 「a majority of participants chose a blocked schedule (76.9%) versus the interleaved schedule.」 |

### 立即知覺評分（interleaved 對 blocked，受試者內，1–6 分）

| # | 結果 | 數字 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 3 | Study 1 費力 | interleaved M = 3.73（SD 1.22）對 blocked M = 3.10（SD 1.05），差 0.63，t(327) = 10.04，p < .001，d = 0.55 | 3.1.2 | L191 | 「Participants perceived the interleaved schedule (M = 3.73, SD = 1.22) as, on average, being 0.63 points more mentally effortful … t(327) = 10.04, p < .001, d = 0.55.」 |
| 4 | Study 1 覺得學到多少 | interleaved M = 2.84（SD 1.11）對 blocked M = 3.45（SD 1.05），差 0.61，t(327) = −8.53，p < .001，d = −0.47 | 3.1.2 | L191 | 「They also judged the interleaved schedule (M = 2.84, SD = 1.11) as, on average, being 0.61 points less effective … d = −0.47.」 |
| 5 | Study 1 熟悉 | interleaved M = 2.70（SD 0.95）對 blocked M = 3.29（SD 1.21），差 0.59，t(327) = −8.22，p < .001，d = −0.45 | 3.1.2 | L191 | 「…being 0.59 points less familiar … d = −0.45.」 |
| 6 | Study 2 費力 | 3.54（1.20）對 3.14（1.15），差 0.40，t(376) = 7.95，p < .001，d = 0.41 | 3.2.2 | L277 | 「…0.40 points more mentally effortful … d = 0.41.」 |
| 7 | Study 2 覺得學到多少 | 2.88（1.14）對 3.36（1.02），差 0.49，t(376) = −7.84，p < .001，d = −0.40 | 3.2.2 | L277 | 「…0.49 points less effective … d = −0.40.」 |
| 8 | Study 2 熟悉 | 2.55（0.89）對 3.05（1.14），差 0.50，t(372) = −8.61，p < .001，d = −0.45 | 3.2.2 | L277 | 「…0.50 points less familiar … t(372) = −8.61, p < .001, d = −0.45.」 |

注意：兩種排程的「覺得學到多少」平均都在量尺中點 3.5 以下（2.84–3.45）。原文報的信賴區間有幾處上下限順序顛倒或數字不合（例如 #4 的「95% CI: [−0.47, −0.45]」包不住 −0.61），引用時不要用這些 CI。

### 回顧式比較評分（單一量尺，對中點 3.5 檢定）

| # | 結果 | 數字 | 節 | 行號 |
|---|---|---|---|---|
| 9 | Study 1 費力偏向 interleaved | M = 4.87（SD 1.23），t(327) = 20.06，p < .001，d = 1.11 | 3.1.3 | L197 |
| 10 | Study 1 學習成效偏向 blocked | M = 2.31（SD 1.45），t(327) = −14.85，p < .001，d = −0.82 | 3.1.3 | L197 |
| 11 | Study 1 熟悉偏向 blocked | M = 2.54（SD 1.16），t(327) = −14.97，p < .001，d = −0.83 | 3.1.3 | L197 |
| 12 | Study 2 費力 | M = 4.78（SD 1.26），t(376) = 19.75，d = 1.02 | 3.2.3 | L281 |
| 13 | Study 2 學習成效 | M = 2.43（SD 1.53），t(376) = −13.56，d = −0.70 | 3.2.3 | L281 |
| 14 | Study 2 熟悉 | M = 2.58（SD 1.65），t(375) = −10.83，d = −0.56 | 3.2.3 | L281 |

原文（L197）：「participants judged an interleaved schedule as being significantly more effortful than a blocked schedule (M = 4.87 … d = 1.11), as significantly less effective for learning (M = 2.31 … d = −0.82), and as significantly less familiar (M = 2.54 … d = −0.83).」

### 知覺與選擇的關係（個別邏輯斯迴歸，勝算比；每多 1 分「interleaved 比 blocked 更…」）

| # | 預測變項 | Study 1 立即 | Study 1 回顧 | Study 2 立即 | Study 2 回顧 |
|---|---|---|---|---|---|
| 15 | 更費力 → 選 interleaved 的勝算 | 0.53 倍 [0.41, 0.70]，z = −4.61，R² = .12 | 0.33 倍 [0.25, 0.43]，z = −8.00，R² = .39 | 0.43 倍 [0.33, 0.58]，z = −5.72，R² = .15 | 0.13 倍 [0.09, 0.21]，z = −9.28，R² = .65 |
| 16 | 覺得學得更好 | 4.25 倍 [2.96, 6.07]，z = 7.89，R² = .43 | 15.94 倍 [7.88, 32.23]，z = 7.71，R² = .85 | 4.79 倍 [3.32, 6.91]，z = 8.39，R² = .43 | 12.87 倍 [6.85, 24.16]，z = 7.95，R² = .84 |
| 17 | 更熟悉 | 1.42 倍 [1.14, 1.76]，z = 3.13，p = .002，R² = .06 | 1.94 倍 [1.53, 2.46]，z = 5.53，R² = .16 | **1.36 倍 [0.99, 1.86]，z = 1.91，p = .06，R² = .05（邊緣，未達顯著）** | 1.73 倍 [1.48, 2.03]，z = 6.77，R² = .20 |

行號：L203、L220、L285、L293。R² 為 Nagelkerke R²。原文的寫法是「odds … declined by 0.53 times」，實際意思是勝算比 0.53。回顧式「覺得學得更好」量表的第 8 題就是「Which strategy would you use to study in the future?」（L483），與依變項幾乎同義，R² = .84–.85 要連這一點一起看。

Study 2 立即知覺的熟悉一項，原文（L285）：「The relationship between familiarity and choice was marginal; for every point that learners perceived interleaving as being more familiar, their odds of choosing it increased 1.36 times (95% CI: [0.99, 1.86]), Wald z = 1.91, p = .06, Nagelkerke R2 = .05.」

### 中介分析（「覺得學到多少」當中介）

| # | 模型 | a 路徑（→覺得學到多少） | 間接效果 | 直接效果 | 作者判定 | 行號 |
|---|---|---|---|---|---|---|
| 18 | S1 立即：費力 | t = −11.31，p < .001，R² = .28 | z = −4.61，p < .001 | z = 0.03，p = .97 | 完全中介 | L209 |
| 19 | S1 立即：熟悉 | t = 5.54，p < .001，R² = .09 | z = 3.13，p = .002 | z = 0.86，p = .39 | 完全中介 | L214 |
| 20 | S1 回顧：費力 | t = −17.31，R² = .48 | z = −8.00，p < .001 | z = 1.07，p = .28 | 完全中介 | L222 |
| 21 | S1 回顧：熟悉 | t = −8.09，R² = .17 | z = −5.53，p < .001 | z = −0.89，p = .38 | 完全中介 | L227 |
| 22 | S2 立即：費力 | t = −11.56，R² = .26 | z = −5.72，p < .001 | z = −0.73，p = .47 | 完全中介 | L287 |
| 23 | S2 立即：熟悉 | t = 4.61，p < .001，R² = .05 | **z = 1.91，p = .06（未達顯著）** | z = 0.30，p = .77 | 「marginal support」 | L289 |
| 24 | S2 回顧：費力 | t = −27.80，R² = .67 | z = −9.28，p < .001 | **z = −2.76，p = .01（顯著）** | 「only partial mediation」 | L295 |
| 25 | S2 回顧：熟悉 | t = −10.91，R² = .24 | z = 6.77，p < .001 | z = −0.01，p = .99 | 完全中介 | L297 |

原文一句（L209）：「the more learners perceived interleaving as effortful, the less they perceived they learned (t = −11.31, p < .001, R2 = .28, and consequently they were less likely to choose this method … The direct effect of perceived mental effort on strategy choice was insignificant (z = 0.03, p = .97, partial R2 < .01), suggesting full mediation.」

正文報的「間接效果 z」與上面個別邏輯斯迴歸的 Wald z 逐一相同（−4.61、3.13、−8.00、5.53、−5.72、1.91、−9.28、6.77）。這個數字到底是間接效果還是總效果，原文沒有交代，圖也讀不到，不確定。#21 與 #25 的 a 路徑 t 值是負的，和文字敘述的方向（越不熟悉、覺得學得越少）對不上，也和 #19、#23 的正號不一致；原文沒解釋。

註 1、註 2（L533、L535）：把示範階段全對的人拿掉後重跑，Study 1 熟悉的間接效果 p = .002、Study 2 p = .07；費力的間接效果兩個研究都 p < .001。

### 客觀學習（只有 Study 2）

| # | 結果 | 數字 | 條件 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 26 | 後測分類正確率 | interleaved 學的科 M = 60%（SD 19%）對 blocked 學的科 M = 55%（SD 18%），t(376) = 3.44，p < .001，d = 0.18 | 受試者內；每科 11 張新圖；三選一（機率水準約 33%，這是我依選項數推的，原文沒寫） | 3.2.6 | L301 | 「participants classified more exemplars correctly when bird families had been learned using the interleaved schedule (M = 60%, SD = 19%) versus those who learned using the blocked schedule (M = 55%, SD = 18%), t(376) = 3.44, p < .001, d = 0.18.」 |
| 27 | 選 blocked 的人是不是其實 blocked 學得好 | 排程 × 偏好交互作用不顯著（p = .28）。選 blocked 的人：interleaved 58% 對 blocked 55%；選 interleaved 的人：65% 對 58% | ANOVA | 3.2.6 | L305 | 「in no case did blocking outperform interleaving. Thus, there was no evidence that learners who prefer blocking were doing so because they were actually learning more from this method.」 |
| 28 | 作者對效果量的評語 | d = 0.18「relatively small magnitude」 | — | 4.3 | L347 | 「While there was robust evidence for an interleaving effect (p < .001), the effect size had a relatively small magnitude in the present work (d = 0.18).」 |

Study 2 的排程與鳥科有部分混淆要注意：第一階段固定是 finches／jays／orioles、第二階段固定是另外三科，排程順序對抗平衡，所以科別難度在兩種排程間是平衡的；原文沒有報各科或各順序的分數。

### 看到「90% 的人 interleaved 學得較好」之後（開放題，非正式編碼）

| # | 結果 | Study 1 | Study 2 | 行號 |
|---|---|---|---|---|
| 29 | 作答情形 | blocked 38.9%、interleaved 11.1%、沒作答 50.0% | blocked 38.5%、interleaved 11.5%、沒作答 50.0% | L231、L309 |
| 30 | 原本選 blocked：不改 | 63.7% | 表 60.6%／正文 60.3% | Table 1（L232–247）、L248、L311 |
| 31 | 原本選 blocked：改成 interleaved | 20.8% | 24.8% | 同上 |
| 32 | 原本選 blocked：猶豫 | 9.6% | 表 8.2%／正文 2.8% | 同上 |
| 33 | 原本選 blocked：其他做法（多半是混用） | 5.4% | 2.0% | 同上 |
| 34 | 原本選 interleaved：不改 | 85.3% | 80.4% | 同上 |
| 35 | 原本選 interleaved：改成 blocked | 10.5% | 16.2% | 同上 |
| 36 | 原本選 interleaved：其他做法 | 1.2% | 0.0% | 同上 |

原文（L231）：「After viewing this information, participants either chose blocked (38.9%), interleaved (11.1%), or did not respond (50.0%) (see Table 1). We conducted an informal coding of the responses into four themes」。這三個百分比的分母是什麼、Table 1 各列的分母是「原本選該策略的全部人」還是「其中有作答的人」，原文都沒寫清楚；一半的人沒作答。不確定，不要把 63.7% 寫成「全體受試者的 63.7%」。編碼是一位致謝中的人（Isabel Martin）做的，沒有報編碼者間一致性。

討論的說法（L361）：「Despite being informed that blocking is not as effective as interleaving, approximately two-thirds of participants still would not change their decision from blocking to interleaving in future study.」另外 L339：開放題裡沒有人說自己偏好 blocked 是因為比較熟悉。猶豫的人的理由是不知道怎麼安排才能做到 interleaved（L248、L367）。

### 其他

- 示範階段（學習前、三選一）：Study 1 平均答對 65%、6% 的人六題全對（L126）；Study 2 為 63% 與 6%（L170）。作者據此說「most people did not know these bird families prior to the experiment」。
- 整體經驗的開放題（Table 2，L255–266）：Study 1 有 47 人（14.3%）作答、Study 2 有 53 人（14.1%）。覺得「難記」的在 Study 1 是 4.3%、Study 2 是 24.5%（Study 2 多了正式後測）。
- 前言引用的外部數字（不是本研究的結果）：Brunmair & Richter 2019 統合分析 interleaving 對 blocking Hedges' g = 0.42（L36）；對受試者說的「90% 的人」出自 Yan 等 2016（L140）。

## 作者自己列的限制

- 受試者只有修心理學的大學生，不一定能推到一般人；Kirk-Johnson 等 2019 的費力模型在一般成人樣本上成立，但那篇沒測熟悉（L373）。
- 只看一種自律學習決定（排列順序）；真實情境不是二選一，而是何時讀、讀多久、怎麼讀、多常讀一堆選擇（L375）。
- 這些捷思什麼年齡出現、怎麼形成不知道（L377）。
- 中介分析裡的變項關係只是相關，「we do not definitively know that one causes the other」（L355）；作者能排除的只有反向因果（立即評分在選擇之前）。評分程序本身會不會造成結果，作者引 Kirk-Johnson 等 2019 的 Study 4 說不會，那是 retrieval practice 對 restudy 的實驗，不是本研究做的（L357）。
- interleaving 的優勢在短文字與視覺圖像上最穩，「cannot be generalized to all tasks」（L347）；前言也寫人造物件與數學概念上結果不一（L38）。
- 效果量小（d = 0.18），作者自己提出「看不出 interleaving 的價值其實後果不大」這個反駁，再以「方向相反」回應（L347）。
- 作者沒列、但讀設計可見的：策略選擇是假設性的一題，沒有觀察受試者之後真的怎麼讀；Study 1 沒有學習測驗；樣本數超出預先規劃且停收規則是「收到學期末」；沒有提到預先註冊。

## 與摘要說法不一致的地方

1. 摘要：「Mediation analyses revealed, for both experiments, that … Further, in this study, strategy familiarity predicted strategy choice, also mediated by learners' perceived learning.」熟悉的間接效果在 Study 2 的立即知覺量表上是 p = .06（#23），個別迴歸也是 p = .06（#17），沒有達到顯著。摘要沒有提這個例外。
2. 討論 4.1（L329）與註 3（L537）說 Study 2 的熟悉間接效果「was significant in the immediate perceptions, but only marginal (p = .06) in the retrospective comparisons」，和結果節正好相反：結果節 3.2.4 是立即知覺 p = .06，3.2.5 是回顧式顯著（z = 6.77，p < .001）。重抓的 XML 也一樣，是原文自己寫反。引用時以結果節為準。
3. 討論 4.2（L339）：「Both our studies found full mediations」。熟悉在 Study 2 立即量表上只有邊緣支持；費力在 Study 2 回顧量表上直接效果顯著（#24），作者自己在結果節寫的是部分中介。
4. 摘要：「Study 2 verified that … the less familiar interleaving schedule resulted in better learning」。成立，但差距是 60% 對 55%、d = 0.18，摘要沒給大小；Study 1 沒有測學習。
5. 正文與 Table 1 的 Study 2 數字不一致：不改 60.3%（正文）對 60.6%（表）、猶豫 2.8%（正文）對 8.2%（表）。
6. 「示範階段答對 65%／63%」被拿來說多數人事前不認得這些鳥；題目是三選一，這個答對率遠高於亂猜，原文沒有討論。

## 與清單「要撐的結論」不合的地方

清單那句：「費力的做法被評為學得較少；76.6% 的人之後仍選比較不費力的那種」。

- 前半撐得住，但要說清楚是哪一種「費力」：interleaved 被評為較費力（d = 0.55／0.41）也被評為學得較少（d = −0.47／−0.40），這是同一批人對兩種排程的平均評分。「越覺得費力的人越覺得學得少」是個別差異上的相關（#18、#22），不是操弄出來的因果。
- 「76.6%」是 Study 1 的數字，Study 2 是 76.9%。它是**還沒被告知哪種比較有效之前**的假設性二選一；「仍」字如果讓人讀成「被告知之後仍有 76.6%」就錯了。被告知之後的數字是另一組（原本選 blocked 而有作答的人裡約六成說不改，一半的人沒作答，分母不清楚）。
- 「選比較不費力的那種」這個說法和作者的結論方向相反：作者的主張是受試者**不是**因為省力才選 blocked，而是把費力誤讀成學得差（費力對選擇的直接效果在四個模型裡三個不顯著）。比較貼近原文的寫法是「76.6% 選了他們覺得學得比較多的那種，而那種在 Study 2 的後測分數較低」。
- 這句話沒帶到、但寫文章時必要的條件：實際學習差距只在 Study 2 量到，60% 對 55%，d = 0.18；教材是看鳥類照片學分類（歸納式類別學習），不是讀文字或理解概念；受試者是大學生；作者自己說不能推到所有任務。拿它當「讀者覺得順的文章不一定學得多」的證據，是跨了教材類型的推論。
- 本篇的新東西是「熟悉」：不熟悉的做法也被評為學得較少。這一項在 Study 2 立即量表上未達顯著（p = .06），清單沒提到這個發現，也就沒有被推翻的問題；若文章要用，要寫成「三個量表顯著、一個邊緣」。

## 讀取紀錄

依序讀完，中間沒有跳段：

- L1–150：檔頭中繼資料、摘要、1 引言（1.1–1.5）、2.1 Study 1 方法（受試者、教材、兩份問卷、程序）、2.2.1 Study 2 受試者
- L151–300：2.2.2–2.2.3 Study 2 教材與程序、3.1 Study 1 全部結果（3.1.1–3.1.7，含 Table 1、Table 2）、3.2.1–3.2.5
- L300–409：3.2.6 客觀學習、3.2.7–3.2.8、4 討論全部（4.1–4.7，含限制 4.6）、致謝、附錄 A.1 前半
- L410–549：附錄 A.1 後半、附錄 A.2（12 題全讀）、作者貢獻、IRB、資料可得性（OSF 10.17605/OSF.IO/74XV2）、經費、註 1–3（L533、L535、L537 另外印出全文讀過）、參考文獻（L543，只掃過開頭）、L545–549 重複的資料聲明

對過來源的表：Table 1、Table 2（對 Europe PMC XML）。沒有讀到的：Figure 1–5 的圖本身（檔案只有圖說）；OSF 資料沒有開。

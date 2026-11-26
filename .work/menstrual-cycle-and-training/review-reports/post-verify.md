# post-verify：menstrual-cycle-and-training（認識人體 order 19）

查證日期 2026-10-25。範圍：zh `2026-10-25-menstrual-cycle-and-training.md` 與 `-en.md`。三份來源皆以 Groundlane `web_fetch`（Europe PMC fullTextXML，text）取回全文並對照（McNulty 74k 字、D'Souza 2023 98k 字、D'Souza 2026 91k 字，皆未截斷）。未改動文章。

## Contradicted
1. **「42% 是依 GRADE 建議自訂的分數」（zh L61；en L61）**
   McNulty 結果段：「The quality of the evidence from the 78 studies … was primarily classified as “low” in quality (8% “high”; 24% “moderate”; 42% “low”; 26% “very low”)」，討論段：「the majority of studies … were classified as “low” (42%) in quality」。42% 是被評為「low」的研究佔比（最大宗），不是一個「評分」。方法段確實寫「a strategy based on the recommendations of the GRADE working group」，所以「改編自 GRADE」成立，但「數字 42% 是他們的評分」不成立。摘要「classified as “low” (42%)」寫法含糊，文章是被它誤導。建議改法：「作者把整體證據品質評為『低』；78 個研究中 42% 被評為低品質、26% 為極低、24% 為中、8% 為高（評法改編自 GRADE，不是正式 GRADE 等級）」。證據筆記（evidence.md）「我據此判斷其 42% 是自訂分數」是推論錯誤，應更正。

## Misframed
2. **D'Souza 2023 被寫成講「月曆或基礎體溫、驗血驗尿」（zh L49）**
   2023 原文只說：多數研究招募「naturally menstruating」女性，「only been monitored to verify their MC using one phase (10)」，並說「have, in our view, led to potentially spurious conclusions」、「adequate methods for testing and tracking MC phase are needed」（細節請見其引用的 ref 10）。2023 全文沒有 calendar／basal body temperature／驗血驗尿的字樣。「月曆推算或基礎體溫」出自 2026 RCT 導論／討論（Sung、Wikström-Frisén 等「relied on calendar counting or basal body temperature」，且「hormonal verification」）。建議：把該句拆成 2023（只驗證過一個階段、作者認為導致可能不實的結論）與 2026（早期研究靠月曆／基礎體溫；本研究用 LH 試紙＋荷爾蒙驗證）。「這很費工，做到的研究相對少」是文章自己的推論，來源無此句，建議標為本文推論或刪。
3. **2026 限制清單（zh L87；en 對應段）**
   文章寫「作者自己列出的包括：只有三個週期…受試者年輕、沒受過訓練…只測了大腿；階段只分成濾泡與黃體兩段」。作者的 Limitations 實際列的是：三個週期可能不足以看到細微或累積效果；毛細血管分析因切片不完整而統計力低；荷爾蒙異常、較嚴重經期症狀或較高訓練背景者是否不同尚不清楚；荷爾蒙避孕使用者的推廣性不確定；原本只針對運動 vs 不運動組做檢定力估算。「只測大腿」「只分兩段」不在作者的限制清單內，是文章自己的觀察。建議：分開寫「作者列的限制」與「讀者要注意的設計範圍（本文觀察）」，並補上「較嚴重症狀／較高訓練背景是否不同尚不清楚」。力量等效檢定「大多不確定」成立（18 組比較中 7 組證明等效、11 組不確定；瘦組織量全部等效），但可補一句瘦組織量三組全部通過等效檢定，才不低估結論。
4. **「總訓練量配對成相同」（zh L83）**
   原文是設計上配對，結果「總訓練量在三個訓練條件間沒有顯著差異（P ≥ 0.46）」，不是相同。建議：「設計上把總訓練量配對，實際完成量沒有顯著差異」。
5. **「2023 與 2026 作者群高度重疊（同一個研究團隊）」（zh L53）**
   兩篇都來自 McMaster 大學 Kinesiology 的 Phillips 實驗室，第一作者 D'Souza 與通訊作者 Phillips 相同，這部分成立。但作者名單實際重疊只有 D'Souza 與 Phillips 兩位；2023 的 Colenso-Semple、Wageh、Williams、McCarthy 等不在 2026 名單（2026 的 McKendry、Lees、Newbold、Roxburgh 等不在 2023）。evidence.md 說「兩篇都含 Colenso-Semple」是錯的。建議改為「同一實驗室，第一作者與通訊作者相同」，不要寫「高度重疊」。
6. **McNulty 數字的範圍（zh L55、L59）**
   「收了 78 個研究」是納入的總數；-0.06 這個合併效果量來自 51 個可做成對統合分析的研究（扣除 9 個離群值），-0.14 來自 73 個研究、220 項結果的網絡統合分析（954 人）。文章把 -0.06 緊接在「78 個研究」之後。建議補「其中 51 個研究可用於第一項、73 個用於第二項」。另：-0.06 的 [-0.16, 0.04] 是 Bayesian 可信區間（CrI），文章稱「合理範圍」可接受；「連方向都不夠確定」是文章的白話解讀，原文只說 trivial、大的研究間變異，建議保留「（這是我的白話解讀）」之類的標示或改成「區間跨過零，無法排除沒有差距」。

## Unverifiable
- 無。三份全文皆取得。D'Souza 2023 轉述的原始調查／研究（Oxfeldt 丹麥調查、澳洲奧帕運調查、Elliott-Sale 避孕藥統合分析、「控制較嚴謹」研究 ref 73）我只核對 2023 對它們的轉述，未讀原文；文章已標「引用」「轉述」，符合。

## Confirmed（逐項）
- McNulty 2020：78 個研究；ES0.5 = −0.06 [95% CrI −0.16 to 0.04]；最大差距早期 vs 晚期濾泡期 ES0.5 = −0.14 [−0.26 to −0.03]；整體證據 "low"；結論「Due to the trivial effect size, the large between-study variation and the number of poor-quality studies … general guidelines … cannot be formed; … personalised approach」皆確認。
- Key Points 原句 "Practically, the current evidence does not warrant general guidance on modulating exercise across the menstrual cycle." 逐字一致（句號後接 "As such, we recommend a personalised approach…"）。其前一句含 "trivial amount"；文章稱「上一條」，若 Key Points 是兩個 bullet 則成立，XML 文字輸出看不出 bullet 邊界，建議開出版社頁面確認，或改「同一段」。
- D'Souza 2023 範圍：全文只有「substrate oxidation（RER）」做了系統性回顧加統合分析（PROSPERO CRD42021237018）；文中明說 "In areas with less evidence, we offer narrative insights" 涵蓋運動表現、肌肉、心血管。文章 L53 的描述「只有脂肪與醣類利用做了統合分析，其餘為敘述性整理且帶立場」成立；"in our view" 在原文出現（導論、週期變異段），立場確認。
- 週期長度可差 14 天：原文 "cycle length can vary up to 14 days, both between individuals and, albeit less usually so, within the same individual"，文章措辭（人與人之間、偶爾同一人）一致。
- 三處轉述：
  - 丹麥精英女運動員（Tier 3 以上）57% 使用荷爾蒙避孕：忠於原文（Oxfeldt 等；其中 74% 為複方、26% 純黃體素）。「頂尖」可接受。
  - 「3/78 研究為運動員、力量類 51 項只有 1 項接近真實運動表現」：原文 "one out of the 51 (~1%) strength outcomes and seven out of 80 (~6%) endurance outcomes"、"Just 3 out of the 78 (~2%)"，一致。
  - 三分之二澳洲奧帕運選手認為週期影響表現：原文 "two-thirds of athletes perceived that their MC affected performance"，一致。
  - 心理因素研究（ref 73，原文稱 "well-controlled study"）：原文 "did not observe any significant correlation between variations in sex hormone levels and exercise performance… performance variations … correlated with psychological factors such as motivation, affect, perception of their performance… pain"。文章「控制較嚴謹」「跟荷爾蒙沒有明顯相關」成立。補充：該研究另有 OC 使用者無階段差異、自然週期者跳躍／Wingate 在週期末／初較低，文章未提，無害。
  - Elliott-Sale 避孕藥統合分析：原文 "on average, OC users might have trivial impairments in acute measures of exercise performance"；文章「微小下降」忠實，且標明是轉述未讀原文。
  - 肌肉幹細胞：原文引 Oxfeldt 2022 "the evidence is still limited and results inconclusive"，文章 L95 正確，且是 2023 引述的另一篇回顧。作者的推論（症狀而非荷爾蒙濃度）與 "no valid or reliable way of assessing menstrual symptoms"、"lifestyle, injury, illness, recovery, nutrition" 也確認。
- D'Souza 2026 RCT：註冊 NCT05936424；24 人（篩 56、35 進追蹤）；單側設計，每人兩腿隨機分到四個條件（CON、EX、HV-FOL、HV-LUT）；三個連續週期平均 12.2 ± 1.3 週；排除 3 個月內荷爾蒙避孕、6 個月內下肢傷、6 個月內規律下肢重訓；入選週期 21–35 天，LH 試紙確認；結果 "cycle length spanning 21–39 d (28 ± 3 d)"、濾泡期 10–27 天，與文章一致，標題 "Menstrual Cycle Tracking" 存在。結論 "could be based on individual preference but are not necessary" 是作者立場，文章已標示。主要結果 P < 0.001 對 CON、訓練條件之間 P ≥ 0.17 一致；"Training volume load, not MCPBT, was associated with several adaptations" 一致。受試者描述：文章寫「年輕、健康、沒有規律下肢重量訓練習慣」成立。「主觀感受為探索性分析」我只看到有 POMS／Hooper 等問卷，未逐項核對探索性字眼與「各階段沒有明顯差異」；此項標為「大致符合、未逐句核對」。
- 「三份來源都沒有按階段分析受傷風險」：成立。McNulty 與 2026 的 injury 字樣僅為排除條件；2023 只在「症狀可能來自 lifestyle、injury…」一句；2026 另引用一個 ACL 重建後週期階段復健 RCT（ref 40，無差異），這是復健力量結果不是受傷風險，文章未提亦無矛盾。「在我查的範圍內」限定有寫。
- RED-S／相對能量不足：三份全文都沒有 "RED-S" 或 "energy availability" 字樣；文章只說「飲食與體重的疑慮請問醫師」，沒有未經來源的 RED-S 論述。通過。
- 「某階段該怎麼練」的處方：沒有。文章明確說不告訴讀者；L85 的「依週期調整可憑個人喜好」已標為作者立場；McNulty 的 personalised approach 也標為作者建議。通過。

## 利益揭露（文章目前完全沒提）
- D'Souza 2026：全文有揭露。通訊作者 S.M. Phillips 取得 CIHR、NSERC、NIH、Nestlé Health Sciences、FrieslandCampina、US National Dairy Council、Dairy Farmers of Canada、Cargill 的研究經費；曾收 Nestlé、Optimum Nutrition、Nutricia、Danone 的差旅與講者費；為 WndrHlth、LiquidIV 的 SAB 成員；持有授權給 Exerkine Inc. 的專利（稱無財務收益）。致謝：FrieslandCampina 提供豌豆蛋白給受試者。本研究經費來自 NSERC Discovery Grant。evidence.md「2026 利益揭露全文 XML 找不到」是漏看，揭露就在致謝段落前後。
- D'Souza 2023：Phillips 領 Nestlé Health Sciences 個人費用、Enhanced Recovery 非財務支持、Exerkine 專利；Tarnopolsky 為 Exerkine CEO（做運動後恢復飲品）。
- McNulty 2020：未做專門檢查，（Sports Medicine 全文 XML 另有宣告段；本次未讀）。
- 這些與「月經週期不影響訓練」的結論沒有明顯直接利益衝突（營養／乳製品產業資金與蛋白質補充有關，非週期訓練法），但文章討論 2026 RCT 與 2023 回顧的立場時，建議加一句利益揭露事實（不下動機推論），並說明兩篇出自同一實驗室。

## 英中一致性與其他檢查
- en 版與 zh 版主張一致；en L61 同樣有 42% 問題（Contradicted #1），en L110 對應 21–39 d。
- 歸屬標籤（"D'Souza 2023 adds/cites…"）次數不少，但每處都在轉述 2023，建議維持目前精簡度；轉述的三處都已明示。
- 「只讀摘要」的來源：本篇三份皆全文，文章也未稱只讀摘要。通過。
- 「沒有／找不到」：L97「在我查的範圍內」、L105「我也沒有找到」皆有限定。通過。

## 範圍聲明
只檢查文中已提出的宣告；未檢查文中未提及但可能存在的重要證據（例如較新的、不在這三份來源裡的研究），也未檢查站內連結與樣式。McNulty 2020 的利益揭露段未逐字讀。

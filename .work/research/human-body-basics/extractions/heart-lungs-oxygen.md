# 精讀紀錄：order 6 心肺怎麼把氧送到肌肉（OpenStax §19.4、§22.4、Lang 2024）

## A. OpenStax A&P 2e §19.4 Cardiac Physiology 與 §22.4 Gas Exchange

- 網址：`https://openstax.org/books/anatomy-and-physiology-2e/pages/19-4-cardiac-physiology`、`.../22-4-gas-exchange`（§22.4 的 slug 以此為準；先前猜的 `22-4-transport-of-gases`、`22-3-gas-exchange` 皆 404）。授權 CC BY-NC-SA（同 Q-041）。
- 取得：Groundlane `web_fetch`，文字被截斷。**§19.4 讀了學習目標到「Other Factors Influencing Heart Rate」；§22.4 讀了學習目標到「Internal Respiration」。** 後半（咖啡因、疾病段、§22.4 後段）沒讀。
- **引文沒有程式比對**（環境連不到 openstax.org）。引文取自抓回文字，寫文章前須由審稿者重抓比對。

| 內容 | 原文 |
|---|---|
| 心輸出量＝心跳 × 每搏量 | "To calculate this value, multiply stroke volume (SV), the amount of blood pumped by each ventricle, by heart rate (HR)" ／ "CO = HR × SV" |
| 靜止時數字（教科書示例） | "A mean SV for a resting 70-kg (150-lb) individual would be approximately 70 mL." ／ "An average resting HR would be approximately 75 bpm but could range from 60–100 in some individuals." ／ "the mean CO is 5.25 L/min" |
| 運動時（健康年輕人，教科書示例） | "In healthy young individuals, HR may increase to 150 bpm during exercise. SV can also increase from 70 to approximately 130 mL due to increased strength of contraction. This would increase CO to approximately 19.5 L/min, 4–5 times the resting rate." |
| 頂尖運動員更高 | "Top cardiovascular athletes can achieve even higher levels. At their peak performance, they may increase resting CO by 7–8 times." |
| 心臟是肌肉，訓練提升效率 | "Since the heart is a muscle, exercising it increases its efficiency." |
| 成人靜止心率 60–100 | "For an adult, normal resting HR will be in the range of 60–100 bpm." ／ 症狀（虛弱、頭暈、昏厥、胸部不適、心悸、呼吸困難）出現就可能有問題 |
| 氣體交換靠擴散，不需能量 | "The actual exchange of gases occurs due to simple diffusion. Energy is not required to move oxygen or carbon dioxide across membranes." |
| 氧在血中靠紅血球的血紅素運送 | "most of the oxygen is picked up by erythrocytes (red blood cells) and binds to a protein called hemoglobin" |
| 肺泡與血液的氧分壓差 | "This difference is about 64 mm Hg: The partial pressure of oxygen in the alveoli is about 104 mm Hg, whereas its partial pressure in the blood of the capillary is about 40 mm Hg." |
| 組織的內呼吸 | "This creates a pressure gradient that causes oxygen to dissociate from hemoglobin, diffuse out of the blood, cross the interstitial space, and enter the tissue." |

### 教科書的說法，本篇不沿用

1. **目標心率 120–160 bpm：** 教科書寫"individuals are cautioned to monitor their HR to ensure they stay within the target heart rate range of between 120 and 160 bpm, so CO is maintained"，並自己說"The target HR is loosely defined"。這是一個簡化的說法，我沒有任何來源支持它能當運動建議，**不寫**。
2. **最大心率「220 減年齡」：** 教科書寫"may be estimated by taking the maximal value of 220 bpm and subtracting the individual's age"，只是估算，我沒有來源檢驗它的準確度，**不寫**。
3. 運動時心輸出量數字（150 bpm、130 mL、19.5 L/min）是教科書舉的"healthy young individuals"例子，不是研究結果，只能寫成「教科書的例子」。
4. §19.4 的 "Broken Heart Syndrome" 與喪偶死亡率段落超出範圍。

## B. Lang 等人 2024（BJSM 58:556，PMC11103301，CC BY-NC）

- 書目：Lang JJ et al. "Cardiorespiratory fitness is a strong and consistent predictor of morbidity and mortality among adults: an overview of meta-analyses representing over 20.9 million observations from 199 unique cohort studies." *Br J Sports Med* 2024（DOI 10.1136/bjsports-2023-107849）。
- 取得：Europe PMC XML 58,404 字元，`truncated: false`；讀了摘要、方法（GRADE 修改規則）、討論、限制、結論。**沒讀：** 補充表與逐篇回顧的 AMSTAR2 分數、逐項 GRADE 理由。
- 設計：**傘狀回顧**，26 篇系統性回顧（統合分析），199 個世代研究，2,090 萬筆觀察；只含世代／病例對照研究的統合分析；用**修改後的 GRADE** 分級，觀察性世代證據從「高」起算，再降級。
- 引文已程式比對（含空白字元正規化），皆吻合：

| 內容 | 原文 |
|---|---|
| 規模 | "From the 9062 papers identified, we included 26 systematic reviews." |
| 心肺適能的定義 | "(CRF) is a physical trait that reflects the integrated function of numerous bodily systems to deliver and use oxygen to support muscle activity during sustained, rhythmic, whole-body, large muscle physical activity." |
| 量法 | "CRF is commonly expressed as the maximum or peak rate of oxygen consumption per kilogram of body mass (common units: mL/kg/min) or metabolic equivalents of task (METs)." ／ "For every 1-MET (3.5 mL/kg/min) higher level of CRF" |
| 結果：高對低適能的全因死亡風險比 | "CRF had the largest risk reduction for all-cause mortality when comparing high versus low CRF (HR=0.47; 95% CI 0.39 to 0.56)." |
| 每高 1 MET 的全因死亡降低 | "A dose–response relationship for every 1-metabolic equivalent of task (MET) higher level of CRF was associated with a 11%–17% reduction in all-cause mortality" |
| 證據確定性 | "The certainty of the evidence across all studies ranged from very low-to-moderate according to Grading of Recommendations, Assessment, Development and Evaluations." ／ "We also identified low-to-very low certainty of the evidence for most outcomes" |
| 觀察性證據起評為高 | "Observational cohort evidence began at ‘high’ certainty because randomised controlled trials were deemed not feasible for our research question." |
| 作者的結論 | "We found consistent evidence that high CRF is strongly associated with lower risk for a variety of mortality and incident chronic conditions in general and clinical populations." |
| 作者對因果的說法 | "the results of this study may signal a causal relationship between CRF and future health outcomes" |
| 限制：多半男性樣本 | "Nearly all the outcomes identified in this study were downgraded due to the evidence being generated largely from samples comprising males." |
| 限制：單次量測 | "The evidence was also limited to studies examining associations between a single measure of CRF and prospective health outcomes." |
| 限制：高異質性 | "heterogeneity was high for many of the included meta-analyses" |

### 要小心的

1. **標題說 "strong and consistent predictor"，但自己的 GRADE 結果大多是「低到非常低」確定性。** 這是示範「標題與證據確定性不一致」的好例子。文章要把兩者並排給讀者看。
2. 作者說結果 "may signal a causal relationship"，理由是這類問題做不了隨機試驗。這是作者的推論；他們同時要求更多縱向重複測量才能確立因果。本篇不寫成因果。
3. 觀察性證據起評為「高」是這份研究的修改版規則，與一般 GRADE 慣例（觀察性研究通常從低起評）不同，**我沒有查證一般慣例，文章只陳述這篇的做法**。
4. 「每高 1 MET 降低 11–17%」是兩篇統合分析各自的結果（HR 0.89 與 0.83），不是單一數字。
5. 這份研究是預測關聯，不能證明「提高適能就能降低風險」。
6. 作者另提到「多數人可以靠規律有氧運動提升 1 MET」與臨床建議，那是他們的立場，不引用。

## 對 order 6 的影響

- 五關：①三份來源讀過正文（OpenStax 引文待比對）；③Lang 為 2024；④反證：Lang 自己列了低確定性、男性樣本、單次量測；OpenStax 有兩處簡化說法已標出不採用；②作者主張與實證可分。
- 角度：先講氧的路徑（肺→血→心→肌肉），再講「心肺適能」是什麼、量法，再放 Lang 的結論與它自己的確定性，教讀者看「標題 vs 確定性」。

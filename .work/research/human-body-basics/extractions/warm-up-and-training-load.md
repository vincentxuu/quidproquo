# 精讀紀錄：暖身與訓練負荷（order 10）

取得管道：Groundlane `web_fetch` 抓 Europe PMC `fullTextXML`（全文）與 Europe PMC search API（`resultType=core`，取得摘要與 DOI）。全文已存到 scratchpad `w10/`（quarmby.txt、gabbett.txt、klob.txt、ding.txt）。

## 來源與讀取程度

| 來源 | PMID／PMCID／DOI | 讀取程度 |
|---|---|---|
| Quarmby 2023 Front Sports Act Living 5:1269870 | 38162697／PMC10756908／10.3389/fspor.2023.1269870 | 全文（73,913 字元，未截斷）。本次重讀暖身段（結果 3.6.6 前後、討論 4.1.6、結論）、強度段 3.6.4。CC BY |
| Herman 2012 BMC Med 10:75 | 22812375／PMC3408383／10.1186/1741-7015-10-75 | 全文（106,419 字元，未截斷），**讀完但未存檔、無逐字引文**；文中只用改寫與數字（取自 Results、Table 4、Discussion、Conclusions）。CC BY |
| Kłobuchowski 2026 Sports 14(5):187 | 42188564／PMC13210987／10.3390/sports14050187 | 全文讀過方法、結果開頭、討論 4.2–4.8、結論；引用的是摘要句。CC BY。作者聲明用 LLM 做語言編修；評分者一致性 Cohen kappa 0.44（中等）；未合併統計 |
| Gabbett 2016 BJSM 50:273 | 26758673／PMC4789704／10.1136/bjsports-2015-095788 | 全文讀過摘要、ACWR 段、限制段、利益衝突欄。CC BY-NC。**作者是 ACWR 倡議者** |
| Ding 2026 Front Public Health 14:1896651 | 42662491／PMC13520966／10.3389/fpubh.2026.1896651 | 全文讀過摘要、討論、限制、結論；文中只用摘要與結論陳述。CC BY |
| Impellizzeri 2020 IJSPP 15:907 | 32502973／無／10.1123/ijspp.2019-0864 | **只讀摘要** |
| Impellizzeri 2021 Sports Med 51:581 | 33332011／無／10.1007/s40279-020-01378-6 | **只讀摘要** |
| Wang 2020 Sports Med 50:1243 | 32125672／無／10.1007/s40279-020-01280-1 | **只讀摘要** |
| Dalen-Lorentsen 2021 BJSM 55:108 | 33036995／無／10.1136/bjsports-2020-103003 | **只讀摘要** |
| Lolli 2019 BJSM 53:921 | 29101104／無／10.1136/bjsports-2017-098110 | Europe PMC 無摘要，文中**未引用** |

## 已程式比對的逐字引文（正規化：標籤、空白含 U+2005／U+2009／NBSP、破折號、引號、大小寫）

| 來源 | 引文 | 結果 |
|---|---|---|
| Quarmby | "BMI/body weight, warm up/cool downs, stretching, taping and hydration were not associated with risk of overuse injury"（摘要） | 比對成功 |
| Quarmby | "Three studies (two of which were prospective designs) indicated that performing a warm-up has no impact on the prevalence of climbing injuries"（結果） | 成功 |
| Quarmby | "traditional warm-ups or cool-downs cannot be recommended with the explicit goal of reducing overuse injury risk"（討論 4.1.6） | 成功 |
| Quarmby | "there is some evidence that it may improve athletic performance"（討論 4.1.6；"it" 指暖身／放鬆的儀式） | 成功 |
| Quarmby | "Limited evidence suggests that warm up/cool downs, stretching, taping and hydration have no relationship with climbing injury"（結論） | 成功（文章未引） |
| Quarmby | "ranged from 8 to 20 out of a possible 32 points (mean: 14.4 points)"、"64.7% of studies were cross-sectional designs"、"the relationship between climbing volume and injury is much less clear"、previous injury 句 | 成功 |
| Gabbett | "There is dogma that higher training load causes higher injury rates."；"the risk of injury was 2–4 times greater in the subsequent 7 days"；"Chronic training loads represent the rolling average of the most recent 3–6 weeks of training."；"Competing interests: None declared" | 成功 |
| Impellizzeri 2020 摘要 | "There is no evidence supporting the use of ACWR in training-load-management systems or for training recommendations aimed at reducing injury risk."；"Because no studies have even tried to estimate causal effects properly, manipulating ACWR in practical settings in order to change injury rates remains a conjecture and an overinterpretation of the available data." | 成功 |
| Impellizzeri 2021 摘要 | "We suggest ACWR be dismissed as a framework and model" | 成功 |
| Dalen-Lorentsen 摘要 | "the effectiveness of load management using ACWR has never been evaluated in an experimental study"；"We observed no between-group difference, suggesting that this specific load management intervention was not successful in preventing health problems in elite youth footballers."；RR 1.01 (95% CI 0.91 to 1.12) | 成功 |
| Ding 2026 摘要 | "current evidence does not support its use as a stand-alone causal or predictive model"；"Elevated ACWR showed a small-to-moderate association with higher injury risk" | 成功 |
| Wang 2020 摘要 | "there are several limitations to the ACWR and how it has been analyzed which impact the validity of current recommendations and should discourage its use" | 成功 |
| Kłobuchowski 摘要 | "dynamic warm-ups may acutely improve sprint and jump performance"（摘要原句；全文含此句） | 成功 |

文章正文只直接放英文引文：Quarmby 摘要句（區塊引文）、Quarmby 討論段的短語（動作 1）、“may improve athletic performance”。其餘皆為不加引號的忠實轉述。**Herman 沒有逐字引文，所有數字（RR、信賴區間、受試者年齡範圍、9 項研究、6 RCT／3 CCT）是從讀到的全文轉述，未做程式比對。**

## 作者列的限制／來源自己講的

- Quarmby：研究只檢驗各因子的獨立效果；異質性大；睡眠、營養、心理社會幾乎沒研究。暖身相關：品質分數 8–20／32，64.7% 橫斷式。
- Herman：樣本對特定傷害常不足；內部效度有弱點（未設盲、未隨機、無意向治療分析、部分高退出率）；外部效度限於 13–26 歲；異質性使資料無法合併；傷害回報者不同（教練、作者、球員自己、運動防護員）；機制與有效成分未知。
- Gabbett：文中 ACWR 建議「until more data is available」不同運動可能關係不同（已找到原句段，文章未引）。
- Ding 2026：觀察性、反向因果可能、異質性 I2 = 95.8%、只含英文文獻；結論不支持單獨使用。
- Kłobuchowski：研究設計、指標、族群異質；多為青少年足球。

## 要小心的

1. Herman 的「暖身」是**取代平常暖身的結構化訓練計畫**，對照組是「平常暖身」，不是「不暖身」。不可寫成「暖身有效預防傷害」。
2. Herman 的「三個月以上、每次都做」是**作者的建議**（來自跨研究的歸納與劑量反應推測），不是單一試驗測得。
3. Quarmby 的暖身結論來自**觀察性研究**，且「未見關聯」不等於無效。Quarmby 還提到一項研究出現暖身與較高受傷機率有關，作者歸因於未測量的干擾。
4. Gabbett 2016 是敘述性回顧，作者倡議該指標；它的 ACWR 風險數字（板球投手比值 >= 1.5 時 2–4 倍）是觀察性。0.8–1.3「甜蜜點」／1.5「危險區」是他的建議，**文章刻意不寫**，避免變成處方。
5. 批評文獻只讀摘要：Impellizzeri 2020／2021、Wang 2020、Dalen-Lorentsen 2021。文章以「摘要說」限定。
6. Dalen-Lorentsen 結論限於「該特定介入」與「菁英青少年足球」，不能推到所有負荷管理。
7. Kłobuchowski 是敘述性綜合，含 12 篇統合分析加原始研究，作者自己列異質性；品質有限，只用作「表現」的薄弱來源，文章已這樣標。
8. 攀岩者暖身的 RCT（Han 2025）：Europe PMC 標示授權狀態矛盾，**未讀**。

## 對本篇的影響

- 暖身分成「預防受傷」與「表現」兩節，並且在「預防受傷」再拆成「攀岩觀察」與「結構化計畫」兩種證據。
- ACWR 誠實寫成「被提出、被批評、讀不到原文」，加一項隨機試驗與一篇 2026 統合分析（皆開放或可讀摘要）。
- 不給暖身課表、不給 ACWR 目標區間。動作 2 用假設數字說明比值的算法含糊。

## 審稿後補充（2026-10-25）

- 新增來源：Soligard 2008 BMJ（PMID 19066253／PMC2600961／10.1136/bmj.a2469），**只讀摘要**。主要結局下肢傷害 rate ratio 0.71（0.49–1.03）未達顯著；整體傷害 0.68（0.48–0.98）、過度使用傷 0.47（0.26–0.85）、嚴重傷 0.55（0.36–0.83）；1,892 名 13–17 歲女球員、125 個俱樂部、叢集隨機、一季八個月。
- Herman 的 0.67／0.45 是回顧自己重算，與試驗自報略有差異。
- Herman 對照組：9 項中 8 項為 Normal warm-up（Coppack 為一般暖身），Brushøj 為上半身計畫。
- Quarmby 暖身項數：結果段三項（兩項前瞻），討論段四項（兩項前瞻）。

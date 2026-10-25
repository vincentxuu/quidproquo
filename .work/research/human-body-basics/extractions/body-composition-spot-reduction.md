# 精讀紀錄：局部減脂（order 20）

## 書目與取得管道
1. Ramírez-Campillo R, Andrade DC, Clemente FM, Afonso J, Pérez-Castilla A, Gentil P. *Hum Mov* 2022;23(3):1–14. DOI 10.5114/hm.2022.110373。無 PMID／PMCID（Europe PMC 無收錄）。取得：期刊頁 hummov.awf.wroc.pl（Groundlane web_fetch）**只讀到完整摘要與參考文獻清單，全文未讀**（Semantic Scholar PDF 回 OUTPUT_LIMIT；doi.org 回驗證頁 403）。
2. Paoli A et al. *Int J Environ Res Public Health* 2021;18(7):3845。PMID 33917584、PMCID PMC8038840（Europe PMC 核對），DOI 10.3390/ijerph18073845，CC BY。取得：Europe PMC fullTextXML，**全文讀過**（約 109,000 字元，未截斷）。**注意：這是 14 人 RCT，不是系統性回顧**（規劃表與簡報稱「Paoli 2021 局部減脂系統性回顧」是誤標；系統性回顧是 Ramírez-Campillo 2022）。
3. Brobakken MF et al. *Physiol Rep* 2023;11(22):e15853。PMID 38010201、PMCID PMC10680576，DOI 10.14814/phy2.15853，CC BY 4.0。取得：Europe PMC fullTextXML，**全文讀過**（未截斷）。

引文比對方式：Groundlane 輸出未自動存檔、curl 被擋，無法對「完整全文檔」程式比對。我把準備引用的原句貼進 scratchpad 的 `bc/src_excerpts.txt`（從工具輸出複製），用 python 正規化空白後比對文章內的英文引文；這只證明引文與我貼的原句一致，**不是對下載全文的獨立比對**。

## 可用陳述（逐字）
| 來源 | 內容 | 原文 |
|---|---|---|
| Ramírez-Campillo 摘要 | 範圍：單側肢體訓練 vs 對側 | "unilateral limb training, compared with the contralateral limb, on the localized adipose tissue depots in healthy participants" |
| 同 | 規模 | "From 1833 search records initially identified, 13 were included in the meta-analysis, involving 1158 male and female participants (age, 14–71 years)." |
| 同 | 結果 | "37 comparisons, with 17 of these favouring ... the trained limb, and 20 favouring the untrained limb" ／ "pooled ES = –0.03, 95% CI: –0.10 to 0.05, p = 0.508, meaning that spot reduction was not observed" |
| 同 | 作者結論 | "Localized muscle training had no effect on localized adipose tissue depots, i.e., there was no spot reduction, regardless of the characteristics of the population and of the exercise program." |
| 同 | 作者評價（未核對） | "The 13 studies achieved a high methodological quality, and presented results with low heterogeneity (I2 = 24.3%)" |
| Paoli | 設計 | "Fourteen volunteers were randomly assigned to spot reduction (SR) or to a traditional resistance training (RT) protocol." |
| Paoli | 三頭肌無效 | "seems to be efficient in promoting adipose tissue reduction in the subcutaneous abdominal region, but was not efficient on the triceps site" ／ "This was an unexpected result" |
| Paoli | BIA 無變化 | "body compositional analysis via BIA was unable to detect any significant changes in total fat mass or lean body mass" |
| Paoli | 變異大 | "we observed relatively large standard deviations of up to 5–6 times the observed difference" |
| Paoli | 限制 | "A limitation of the present study was the reduced number of participants." |
| Paoli | 引言：皮褶 | "skinfold measurements do not permit accurate evaluation of SAT thickness because it is operator-dependent and influenced by anatomical site and skin thickness" |
| Brobakken | 設計 | 16 位過重男性（43 ± 9 歲）隨機：腹部耐力運動＋跑步（84 分鐘／次，4 次／週，10 週）vs 只跑步 45 分鐘；總能量消耗依先導測量配對（腹部運動約為 45 分鐘跑步能量的 40.4%、另一組 41.5%） |
| Brobakken | 結果 | "Trunk fat mass decreased more (697 g, 3%, p < 0.05) in AG ... than in CG (no change)." ／ 總脂肪與體重兩組「decreased similarly」 |
| Brobakken | 作者原本假設 | "we tested the hypotheses that reductions in fat mass located in the trunk, total fat mass, and body weight would not be different between the AG and CG" |
| Brobakken | 結論 | "In conclusion, our data advocate that spot reduction exists in overweight adult males." |
| Brobakken | 限制 | 無飲食控制（"including a measure of dietary control would have strengthened the study design, as energy balance ... impacts whether excess energy is stored as fat or used as fuel"）；DEXA 分不出內臟／皮下／肌內脂肪；"it is unclear if the findings translate to women"；組別平均而非個人化配對；84 分鐘 vs 約一半 |
| Brobakken | 機制未明 | "It remains unclear whether the effects observed in the current study are predominantly related to metabolic or circulatory mechanisms" |

## 作者列的限制 vs 設計 vs 我的解讀
- 作者列：Paoli 人數少、標準差大、皮褶與超音波都依賴操作者；Brobakken 無飲食控制、DEXA 分層、女性不明、非個人化配對。
- 設計層（我歸納）：三份比的對象不同（對側肢體／兩種訓練安排／軀幹 vs 只跑步）；兩試驗合計 30 人（Paoli 分析 14＋Brobakken 16）。
- 解讀（我的）：「比較穩當的說法是證據不支持但沒有大型確定答案」是我的歸納，文章已標為「我整理」性質。

## 要小心的
1. Paoli 摘要寫 8 週，討論段寫 "after 12 weeks"，內部不一致；文章採方法段／摘要的 8 週。摘要寫 "SR significantly reduced body mass" 但那是組內前後（SR p=0.01）；結果段只報告時間主效應與組內後測，未見交互作用 p 值，所以文章寫「我沒有看到報告兩組差異的檢定」。
2. Paoli 腹部超音波 −18.89%、p = 0.05（邊界）；文章沒引百分比。
3. Brobakken 非參數檢定、n = 8／組；基線 AG 脂肪較高；文章未引 p 值細節。
4. Paoli 納入 18 人、4 人因出席不足被排除，分析 14 人；文章用 14。
5. Hummov 全文未讀，不得寫作者限制。
6. 不引用「influencers／wishful thinking」那句結論尾句（避免和社群貼文議題產生連結）。

## 對本篇的影響
- 主軸改成「證據的層級」：統合分析（摘要層）＞兩個小 RCT；Paoli 校正為 RCT。
- 「運動 vs 飲食各貢獻多少」寫成回答不了；只轉述 Paoli 引言的一句與 Brobakken 限制，並明講無法換算。
- 未讀：Ramírez-Campillo 2013、Vispute 2011（付費，只摘要，未使用）；Swift 2014／2018、Pontzer 2016（REST 500／非 OA）；Mansfeldt 2023、MacKenzie-Shalders 2020（付費）。

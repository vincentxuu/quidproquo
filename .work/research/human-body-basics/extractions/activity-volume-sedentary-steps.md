# 精讀紀錄：order 5 用的三份來源（WHO 2020 補讀、Ekelund 2020、Xu 2024）

## A. WHO 2020 指引（BJSM 論文版，PMC7719906）補讀

既有精讀紀錄 `who-2020-physical-activity-guidelines.md`。本輪另取全文（80,696 字元）補核對下列原文，**已程式比對全文，皆逐字吻合**：

| 內容 | 原文 |
|---|---|
| 成人：150–300 分鐘中等強度 | "Adults should do at least 150–300 min of moderate-intensity aerobic physical activity" |
| 劑量反應：中等確定性、曲線型 | "There is moderate-certainty evidence of a curvilinear dose-response association between physical activity volume and some health outcomes" |
| 低於建議量也有好處 | "Health benefits occur with levels of physical activity below the recommendations, supporting the statement that some physical activity is better than none." |
| 越多越好但報酬遞減，無法指出從哪開始 | "More physical activity is better, although the relative benefits tend to diminish at higher levels of physical activity." ／ "However, it is not possible to specify the physical activity levels where diminishing returns begin." |
| 超過 300 分鐘的建議是有條件建議 | "is rated as conditional" |
| 肌力活動：強力建議、中等確定性、無劑量反應證據 | "a strong recommendation supported by moderate-certainty evidence" ／ "There was no evidence to support a dose-response association with higher volumes of muscle-strengthening activities." |
| 成人久坐建議（強力建議） | "Adults should limit the amount of time spent being sedentary. Replacing sedentary time with physical activity of any intensity (including light intensity) provides health benefits" ／ "adults should aim to do more than the recommended levels of moderate-to-vigorous physical activity" |
| 久坐與死亡的關係隨活動量而變：中等確定性；量化門檻證據不足 | "There was moderate-certainty evidence that the relationship of sedentary behaviour with all-cause and CVD mortality varies by amount of physical activity." ／ "there was insufficient evidence to specify quantitative thresholds of sedentary behaviour" |
| 任何長度的活動都算；工作、休閒、家務、通勤都算 | "MVPA bouts of any duration now count towards these recommendations" ／ "Physical activity accrued at work, leisure, home or during transportation count towards the recommended amounts." |
| 運動前通常不需醫療許可 | "Pre-exercise medical clearance is generally unnecessary"（後接有新症狀要就醫） |

## B. Ekelund 等人 2020（BJSM 54:1499，PMC7719907，CC BY-NC）

- 設計：**協調化統合分析**（harmonised meta-analysis），9 個前瞻世代、4 個國家、44,370 人（≥40 歲）、追蹤 4.0–14.5 年、3,451 人死亡；用加速度計量活動與久坐。
- 取得：Europe PMC XML 52,788 字元，`truncated: false`，簡介到結論讀完。**沒讀：** 補充表、圖。
- 引文已程式比對（含空白字元正規化）：

| 內容 | 原文 |
|---|---|
| 設計 | "We conducted a harmonised meta-analysis including nine prospective cohort studies from four countries." |
| 結論 | "Higher sedentary time is associated with higher mortality in less active individuals when measured by accelerometry." |
| 約 30–40 分鐘 MVPA 可減弱關聯 | "About 30–40 min of MVPA per day attenuate the association between sedentary time and risk of death, which is lower than previous estimates from self-reported data." |
| 減弱但未完全消除 | "The association between sedentary time and higher risk of death appears attenuated, although not completely eliminated, in those in the highest third of time spent in MVPA." |
| 限制：觀察性、無法排除反向因果 | "Limitations of our study include its observational design." ／ "We cannot rule out reverse causation bias" |
| 限制：中老年、不一定適用年輕人 | "Our sample included middle-aged and older individuals who were at least 40 years at baseline, and it is unclear if the results are generalisable to younger populations." |
| 限制：不一定適用年輕且更活躍的人或中低收入國家 | "the associations observed between combinations of physical activity and sedentary time with mortality may not be generalisable to younger and more active populations, nor to low-income and middle-income countries" |
| 久坐以動作切點估計，可能含站立 | "Sedentary time estimated from movement-based cut-points may include non-sedentary behaviours such as standing." |

注意：
1. 摘要的百分比寫成"(16%; 95% CI 0.87% to 1.54%)"，格式不一致（疑似 HR 與 CI 的呈現錯誤）；不引用這些摘要百分比。
2. 作者把"30–40 分鐘/天"換算成大約等於 WHO 每週 150–300 分鐘的上緣（"upper level of the 150–300 min per week recommendation"），這是作者的解讀。
3. 受試者平均每日 MVPA 約 16 分鐘、久坐近 10 小時；不能直接外推到年輕、更活躍的人。
4. 「11 分鐘 MVPA 搭配低久坐也與參照組無差異」是在最保守模型下的子群發現，點估計不確定。

## C. Xu 等人 2024（BMJ Open 14:e088524，PMC11474941，CC BY-NC）

- 設計：**傘狀回顧**（umbrella review），只含觀察性研究的系統性回顧，搜尋到 2024 年；最後納入 10 篇系統性回顧、127 項原始研究、128,766 人；用 AMSTAR-2 評方法品質。
- 取得：Europe PMC XML 全文一次抓回（96,654 bytes，`truncated: false`），逐段讀完摘要、方法、結果、討論、限制、結論。**引文沒有存檔做程式比對**（輸出太大未落地，下一輪若引用要先重抓比對）。
- 可用內容（皆為摘要或結果段陳述）：
  - 每日步數與全因死亡、心血管事件為負相關；
  - 引用 Paluch 等人：全因死亡風險最低的步數，60 歲以下約 8,000–10,000 步，60 歲以上約 6,000–8,000 步，之後不再明顯下降（"did not decrease further when a certain number of daily steps were reached"）；
  - **10,000 步與半月板病變風險上升 52%（OR 1.52）只來自一項研究**，作者自己標明；
  - 方法品質：納入的回顧 AMSTAR-2 為高、中、低都有（表 1 有三篇低品質：Cordova-Rivera、Miguel-Berges、Gordia；2026-10-25 經 post-verify 更正先前誤寫的「中等或高」）。
- 作者自己的限制："we did not grade the evidence for the meta-analysis"；只含英文；只含觀察性研究；異質性。
- **警訊：**
  1. 結論是「相關」，且全是觀察性研究，不能說多走路「造成」降低死亡；
  2. 「臨床意涵」的步數建議由作者提出，其增加步數的方法清單引用的是一個生活資訊網站（Verywellfit），不是研究；不採用；
  3. 結果段出現前後矛盾的句子（"Two, three and five studies were classified as being of moderate..."，與表中分級不對應），顯示稿件校對不嚴；
  4. 文中把"10,000 步可能不適合所有人"當推論，並不是研究結果。

## 對 order 5 的影響

- 五關：①WHO、Ekelund、Xu 皆讀過正文（Xu 引文未程式比對，寫文章前須補）；③Xu 為 2024 年；④反證：Ekelund 與 Xu 都是觀察性且作者列了限制，WHO 說明劑量反應細節缺口；②作者主張與實證可以分開。
- **未涵蓋：** 心肺適能的生理機制（心輸出量、攝氧）與 Lang 2024 傘狀回顧未讀。規劃表標題「心肺與日常活動量」的心肺部分延後，order 5 先以「活動量與久坐」為範圍。
- 因果警告：這一篇的核心證據全是相關。

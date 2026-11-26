# post-verify report: 2026-10-25-activity-and-sedentary（zh-TW 與 -en）

查證日期：2026-10-25。工具：Groundlane web_fetch（Europe PMC fullTextXML，format=text、extract=full，`truncated: false`），三份原文本輪重新取得並用 python3 -I 逐段比對。
- WHO 2020（PMC7719906）：79,966 字元（空白正規化後）；與精讀紀錄的 80,696／80,021 字元差異來自空白處理，內容未見缺漏。
- Ekelund 2020（PMC7719907）：52,768 字元。
- Xu 2024（PMC11474941）：96,654 bytes，一次回傳、全文讀完（本輪是第一次逐字核對）。
抽取驗收：無 Loading／空欄位。三份皆為作者／官方一手論文，WHO 與 Ekelund 的數字風險等級屬「高」，各只有一個來源（原文本身）；Xu 的步數數字本是轉述 Paluch 2022，未回查 Paluch 原文（見未驗範圍）。

## 結論摘要
- 🔴 Contradicted：0 條
- 🔵 Misframed：3 條（M1–M3）
- 🟡 Unverifiable：2 條（U1–U2）
- 另有 4 條「輕微／建議」（N1–N4）
- 其餘宣告全數 Confirmed

## 🔵 Misframed

**M1. 「同一份指引裡，三項建議的強度與證據並不一樣」（zh 第 61 行／en 第 61 行）**
- WHO 原文："The adult guidelines include strong recommendations based on overall moderate-certainty evidence on weekly volumes of aerobic and muscle-strengthening physical activity."；肌力："a strong recommendation supported by moderate-certainty evidence"；>300 分鐘："is rated as conditional"。
- 也就是 150–300 與肌力 2 天都是「強烈建議／整體中等確定性」，兩者強度與確定性相同；真正不同的只有 >300 分鐘（有條件），以及肌力沒有劑量反應證據。文章前兩項沒有寫出 150–300 是強烈建議，讀者會得到「三項各不相同」的印象。
- 修法（縮回原意）：「150 到 300 分鐘與肌力每週 2 天都是強烈建議、整體中等確定性；只有超過 300 分鐘是有條件建議。肌力另有一點不同：沒有證據顯示更高的量有更多好處。」

**M2. 久坐／Ekelund：「每天約 30 到 40 分鐘的中高強度活動，就能減弱這個關聯，但沒有完全消除」（zh 第 71 行／en 第 71 行）**
- 兩句原文被併成一句，且「沒有完全消除」掛錯對象。
  - 30–40 分鐘：結論 "About 30–40 min of MVPA per day attenuate the association..."；討論 "about 30–40 min (median of medians=34 min; IQR: 26–48 min) of MVPA per day attenuated the risk of death in our most conservative model"；Key messages："In active individuals doing about 30–40 min of MVPA, the association between high sedentary time and risk of death is not significantly different from those with low amounts sedentary time"。
  - 「減弱但未完全消除」："appears attenuated, although not completely eliminated, in those in the highest third of time spent in MVPA"，對象是「MVPA 最高三分位」，不是「30–40 分鐘」。
- 結果：文章讀起來像「30–40 分鐘 → 殘留風險」，但作者的 Key message 反而說該組與低久坐組統計上無差異。兩句都是作者原話，但同時並列才完整。
- 修法：分兩句。「作者估計每天約 30–40 分鐘中高強度活動（中位數 34 分鐘）時，久坐與死亡的關聯在最保守模型中被減弱；在 MVPA 最高三分位的人身上，這個關聯減弱但沒有完全消失。」另提醒 30–40 分鐘是「各研究 MVPA 最高三分位的中位數的中位數」，不是試驗出來的劑量。

**M3. description 寫「每天一萬步的來歷」，內文沒有講來歷（zh 第 8 行／en 第 8 行）**
- 內文只說「一萬步不是這些研究訂出的門檻」，沒有交代一萬步從哪來，三份來源也都不涵蓋來歷（Xu 只說 "10 000 daily steps may not be appropriate for all populations"，那是作者推論，且「來歷」不在其中）。description 承諾了正文沒有、來源也沒有的內容。
- 修法：description 改為「說明每天一萬步在研究裡的位置」之類，或刪「來歷」。若真要寫來歷，需另找來源（本輪未查，故不建議憑印象補）。

## 🟡 Unverifiable

**U1. 「每天一萬步則不是研究訂出的門檻」（tldr、導言、第 83 行；en 同）**
- 「這幾篇研究沒有把一萬步當門檻」可由 Xu 支持（Paluch 的最低風險區間是 8,000–10,000／6,000–8,000，且 Xu 明說其發現是非線性、會趨平）。
- 但「這個數字不是任何研究訂出來的」是歷史主張，三份來源都沒寫，且 tldr／導言的措辭（「也不是這些研究訂出來的」）在導言尚可，tldr 的「不是研究訂出的門檻」較寬。建議 tldr 縮成「這些研究沒有以一萬步為門檻」。

**U2. 「約 12.9 萬人」（zh 第 81 行／en「about 129,000 people」）**
- 數字本身正確：Xu 原文 "127 primary studies ... involving 128 766 participants"（四捨五入約 12.9 萬）。✓
- 但無法驗證這是「不重複的受試者」：這是 10 篇回顧各自樣本數的加總（每篇 313–47,471 人），回顧之間的原始研究很可能重疊，Xu 並未說明如何去重。127 項研究同理。這些人也分屬不同結果（死亡、心血管、氣喘、關節、兒少脂肪等），與文中「全因死亡風險最低步數」那句直接相關的只有 Paluch 2022 的 15 個世代／47,471 人。
- 建議：保留數字可以，但加「各篇回顧加總，可能重複計算」，或改寫為「10 篇回顧、127 項研究」並刪人數。

## 輕微／建議（不算錯）

- **N1. 「通常不需要運動前的醫療許可」（第 51 行）**：WHO 原文 "Pre-exercise medical clearance is generally unnecessary for individuals without contraindications prior to beginning light-intensity or moderate-intensity physical activity not exceeding the demands of brisk walking or everyday living"；另一段："Individuals who are not currently regularly active and have no contraindications can be recommended to commence and gradually increase levels ... without a medical clearance"。文章省略「無禁忌症」前提；新症狀就醫（"Those who develop new symptoms when increasing their levels of activity should consult a healthcare provider"）✓。另外導言「身體有狀況，請先問醫師」是文章自己的保守說法，比 WHO 嚴格，不是 WHO 原話，也不矛盾，但讀者會以為兩處都出自 WHO。建議在第 51 行補「沒有禁忌症的人」。
- **N2. 「活動量與健康結果的關係是曲線型」（第 57 行）**：WHO 原文是 "curvilinear dose-response association between physical activity volume and **some** health outcomes, such as all-cause and cardiovascular disease (CVD) mortality, and incident cancer and diabetes"。文章略去「某些結果」，讀起來像對所有健康結果成立。建議改「對全因與心血管死亡、癌症、糖尿病等部分結果」。
- **N3. 「久坐很多的人，要做超過建議量的中高強度活動」（第 67 行）**：WHO 原文 "adults should aim to do more than the recommended levels of moderate-to-vigorous physical activity"，目的句 "To help reduce the detrimental effects of high levels of sedentary behaviour"。文章「要做」比 "aim to" 硬一點，且省掉目的。可接受；若要精確改「應以超過建議量為目標」。
- **N4. 「有點喘但還能說話」（第 91 行）**：WHO 定義只用 RPE 0–10 的 5–6／7–8，原文沒有「能說話」的說法（全文搜 "talk" 無結果）。這是文章替讀者加的常見簡易判斷（說話測試），屬作者自己的操作化，不是 WHO 原文；正文不需標註，但不要讓讀者以為是 WHO 定義。
- 第 71 行 Ekelund 的 30–40 分鐘與 WHO 150–300 的對應，文章**沒有**寫（作者自己把 30–40 分鐘換算成約等於 150–300 分鐘上緣，那是作者解讀）。這點處理正確，不要補回去。

## 🟢 Confirmed（逐項對照，皆為 WHO／Ekelund／Xu 原文，括號為引文位置）

(1) WHO 基準
1. 成人 150–300 分鐘中等強度，或 75–150 分鐘高強度，或等量組合 ✓（表 4、成人段）
2. 肌力每週 2 天以上、中等以上強度、涵蓋所有主要肌群 ✓
3. RPE：中等 5–6、高強度 7–8（0–10 量尺）✓（表 1）
4. 任何長度都算 ✓："MVPA bouts of any duration now count towards these recommendations"；舊版 10 分鐘 ✓ "requirement of bouts of at least 10 min in the previous WHO 2010 guidelines"。（原文限定在 MVPA bouts，文章在「任何長度的活動」不影響。）
5. 工作、休閒、家務、通勤都算 ✓ "Physical activity accrued at work, leisure, home or during transportation count towards the recommended amounts."（「家務」對應 "home"）
6. 做一點比不做好、從少量開始逐步增加 ✓
7. 運動前通常不需醫療許可、新症狀要就醫 ✓（含 N1 的但書）
8. 該指引不處理運動員為提升競賽表現的訓練 ✓ "These guidelines are for the general population and do not address the benefits and harms experienced by athletes undertaking the types and amounts of activity necessary to improve performance-related fitness for participation in competition."（表 4 後註）

(2) 證據分級
9. 曲線型劑量反應、中等確定性 ✓（受 N2 限定）
10. 越多越好、效益遞減、無法指出遞減起點 ✓ "More physical activity is better, although the relative benefits tend to diminish... it is not possible to specify the physical activity levels where diminishing returns begin."
11. >300 分鐘為有條件建議、**原因是無法指出遞減起點** ✓ 原文緊接："For this reason, the new recommendation that aerobic physical activity volumes higher than 300 min of moderate-intensity activity per week, or 150 min of vigorous-intensity activity per week have additional health benefits, is rated as conditional."（"For this reason" 明確承接前一句，因果歸屬忠於原文；「今晚做」第 2 項的「往前讀幾句」可行。）
12. 肌力：強烈建議、中等確定性 ✓；無劑量反應證據 ✓ "There was no evidence to support a dose-response association with higher volumes of muscle-strengthening activities."

(3) 久坐
13. 成人久坐建議為強烈建議 ✓（表 4 該段末 "Strong recommendation"）；內容 "limit the amount of time spent being sedentary. Replacing sedentary time with physical activity of any intensity (including light intensity) provides health benefits" ✓。注意：文中「低確定性的強烈建議」是兒少段，不要與成人混用；文章沒有混用。
14. 久坐與死亡關係隨活動量而變為中等確定性 ✓ "moderate-certainty evidence that the relationship of sedentary behaviour with all-cause and CVD mortality varies by amount of physical activity"（原文含 CVD 死亡，文章只寫「死亡」，可）
15. 量化門檻證據不足 ✓ "there was insufficient evidence to specify quantitative thresholds of sedentary behaviour"

(5) Ekelund 2020
16. 9 個前瞻世代 ✓（四國）；44,370 人 ✓（原文 "44 370"）；追蹤 4.0–14.5 年 ✓；≥40 歲 ✓（平均 65.8 歲）
17. 「久坐與較高死亡率有關，在活動量最少的人身上最明顯」✓ 結論 "Higher sedentary time is associated with higher mortality in less active individuals"；最不活躍三分位的 RR 為 260%／148%／240%，遠高於中間三分位的 38%／34%／44%。（文章用「活動量最少」忠於原文）
18. 限制三項 ✓ 皆為作者所寫（見下 9.）：觀察性、無法排除反向因果；≥40 歲、可能不適用年輕且更活躍的人；動作切點估計可能含站立
19. 「相關」措辭：文章全程用「有關」「關聯」，未寫因果 ✓

(6) Xu 2024
20. 傘狀回顧、10 篇系統性回顧、127 項原始研究、128,766 人 ✓；全為觀察性研究的回顧 ✓（納入準則 "systematic reviews of observational studies"，限制第四點 "inclusion criteria focused on observational studies"）
21. 8,000–10,000（≤60 歲）／6,000–8,000（≥60 歲）✓；**歸屬確為 Xu 引用 Paluch 2022（Lancet Public Health，Xu 表 1 的 Paluch et al 34）**，文章寫「其中引用的一項分析」✓。文章「60 歲以下／以上」與 Xu 的 "60 years and younger／older" 在 60 歲重疊，不影響。
22. 「再多就不再明顯下降」✓ "did not decrease further when a certain number of daily steps were reached"（「明顯」為文章所加，語意貼近 Paluch 的趨平，可）
23. 一萬步與半月板：Xu 摘要與討論都明說 "one study within a systematic review"、結果段 "only 1 out of 11 studies"（OR 1.52, 95% CI 1.05–2.20）✓；文章「只來自一項研究」✓。原文是「≥10 000」，文章寫「超過一萬步」差一個等號，無影響。（Xu 同段亦列 4 項研究發現身體活動有保護關聯，文章沒提；可選。）
24. 「作者說他們沒有對證據分級」✓ 限制第二點 "we did not grade the evidence for the meta-analysis"（範圍：meta-analysis 的證據）。
25. 「不是這些研究訂出的門檻」之 Xu 側：Xu 討論 "10 000 daily steps may not be appropriate for all populations"，但這是作者從 ≥10,000 步／半月板單一研究推論，不是研究結果；文章沒有把它當結果引用 ✓。

(7) 因果：全篇沒有把相關寫成因果，但見 N5。
- **N5.** 小標「久坐：危害隨活動量而變」與導言「久坐真的那麼糟嗎」用了「危害／糟」，預設了因果。WHO 自己也用 "detrimental effects"，但 Ekelund 的證據是觀察性、作者明說無法排除反向因果。主文有補限制，標題不必改，若要保守可改為「久坐：與死亡的關聯隨活動量而變」。

(9) 哪些限制是作者列的、哪些是文章的解讀
- **Ekelund 作者所列（原文）**：觀察性設計、無法排除反向因果（"We cannot rule out reverse causation bias from prevalent medical conditions or subclinical disease"）；殘餘／未測量混淆；僅 ≥40 歲、"may not be generalisable to younger and more active populations, nor to low-income and middle-income countries"；動作切點可能含站立（作者接著反駁：older participants 長時間無動作時 "likely to be sedentary rather than standing"，文章未提這句反駁）；部分世代追蹤短（中位數 5.5 年）；部分組別人數少、點估計不確定；暴露只量一次。**文章只列了其中三項，且寫「作者自己寫得很清楚」**，這三項確為作者所列，但並非全部；建議改「作者列出的限制包括」。「更年輕、更活躍的人」✓；文章未寫中低收入國家，屬省略不是錯誤。
- **Xu 作者所列**：未對證據分級；只含英文；只含觀察性研究；異質性；回顧品質不一；步數只是活動的一個指標。文章只提「沒有對證據分級」✓。
- **WHO 作者所列**：慢性病／身心障礙族群外推、僅英文、無睡眠、劑量反應研究缺口等（精讀紀錄 #限制）。文章只用到「不涵蓋運動員」「量化門檻證據不足」，兩者皆為原文。
- **文章自己的解讀／添加**（非來源原句）：「有可能是本來就生病的人比較不動」（對反向因果的白話解釋，符合作者意旨，可接受）；「想提升運動表現的人，不能把這組基準當訓練處方」（由 WHO 註推得，合理）；「你應該會發現，要湊到 150 分鐘，可能比想像中容易」；「有點喘但還能說話」（N4）；攀岩段落整段（作者應用）。

## Xu 2024 額外可靠度警訊（未進文章，供作者判斷是否要加限制）
精讀紀錄的警訊本輪逐字確認：
- 摘要寫搜尋到 2024-01-31；方法寫 2022-07-31 並於 2024-09 更新，同段又寫 2023-03-01 更新，日期互相不一致。
- 結果段 "Two, three and five studies were classified as being of moderate methodological quality, respectively" 句子不通，與 "the five included meta-analyses" 不對應；表 1 的 AMSTAR-2 欄為 High／Moderate／Low 混合（含多篇 Low），與精讀紀錄寫的「中等或高」不符——**請更正精讀紀錄**：表 1 實際有 Low（Cordova-Rivera、Miguel-Berges、Gordia）。
- 步數建議的「增加步數方法」清單引自 Verywellfit 網站；文章沒用，正確。
- 頁首有 BMJ 通用聲明 "has not been vetted by BMJ ... may not have been peer-reviewed"，同時文末 "externally peer reviewed"。文章未宣稱同儕審查，無需處理。
- 以上都支持文章對 Xu 的低調用法（只引 Paluch 的數字、不給 Xu 自己的步數建議）。**重要：文章的核心步數數字實為 Paluch 2022 的結果，Xu 只是轉述；建議在句子中更明確寫成「Paluch 等人的 15 個世代分析（經 Xu 回顧引用）」，並考慮直接補 Paluch 原文為參考資料。**

## en 版對照
- 英文版與中文版逐項語意一致；上述 M1–M3、U1–U2、N1–N4 同樣適用英文版對應句（M1 en 第 61 行、M2 en 第 71 行、M3 en 第 8 行、U2 "about 129,000 people"）。
- en 第 55 行連結 `/posts/learning/2026-10-24-human-body-overview-en`、第 87 行 `/posts/climbing/2026-10-18-climbing-training-diagnosis-en` 對應檔案都存在 ✓；zh 對應連結亦存在 ✓。
- en 第 67 行 "do more than the recommended moderate-to-vigorous amount" 同 N3。
- glossary：zh／en 的「久坐行為」定義與 WHO 定義（≤1.5 METs、sitting／reclining／lying、waking）一致 ✓；MVPA 定義 ✓。

## 範圍聲明
本次只檢查了文中已提出的約 25 條宣告，未評估文章對主題的覆蓋是否完整，未評估教學品質、可讀性與文筆。未驗範圍：(a) Paluch 2022 原文（8,000–10,000／6,000–8,000 步只對到 Xu 轉述）；(b) 一萬步的歷史來歷（文章也沒寫）；(c) Ekelund 補充表／圖、WHO 證據檔案（evidence profile tables）；(d) DOI 連結導向頁面是否與引用句一致，僅對照 PMC 全文與 DOI 欄位（三個 DOI 皆與 Europe PMC 紀錄相符）。

下一步（未完成前不能 commit）：post-review、post-polish。

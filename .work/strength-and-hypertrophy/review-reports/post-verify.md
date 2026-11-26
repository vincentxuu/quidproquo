## post-verify report: 2026-10-25-strength-and-hypertrophy（zh-TW 與 -en）

查證日期：2026-10-25。不修改文章，只報告。

### 取得來源與工具

- ACSM 2026：Europe PMC fullTextXML（PMC12965823），Groundlane web_fetch。本次回傳被工具上限截在 100,000 字元（`truncated: true`），含方法段、表 3、表 4、表 6、討論、利益衝突；精讀紀錄另已讀過全文 54,683 字元。逐句核對用本次取得的文字。
- Lopez 2021：Europe PMC fullTextXML（PMC8126497），60,180 字元，未截斷。
- ACSM 官方新聞頁兩則（acsm.org，2026-03-17／18），用來查「取代」與「最全面」的說法。
- Springer／LWW 頁面本次沒另抓；方法段、AMSTAR／QoE 定義、表 4、表 6 都已在 Europe PMC 文字中讀到。補充附錄（逐篇回顧分數）沒讀。
- Lopez 更正聲明（Med Sci Sports Exerc 2022;54(2):370）：PMC 頁面 403，LWW 只讀到搜尋摘要，內容未取得。

### 🔴 Contradicted

1. 「它能告訴你各個變項『有沒有影響』，不能告訴你各個建議的證據確定性有多高」（zh 第 41 行；en 第 41 行）
   - 原文表 3、表 4 對每個結論都附 QoE 百分比（例：表 4 負荷→力量 6 篇回顧、n = 6,574、QoE = 79%）。方法段寫明為此計算「summary percentage」。所以聲明「能」給出各結論的證據品質分數。
   - 作者的限制是：這個 QoE 是自訂的、非標準化；因為沒有標準方法，無法「合併 GRADE 評級」。不是「完全沒有確定性資訊」。
   - 修法（縮回原意）：「它用自己的方法給每個結論一個證據品質百分比（例如負荷對力量約 79%），但這不是 GRADE，不同回顧的 GRADE 評級也無法合併，所以數字不能和其他領域的 GRADE 直接比。」

### 🔵 Misframed

2. 「證據品質評分用的是作者自訂的方法，不是……GRADE」（zh 第 41 行）
   - 原文：QoE 是「a method based on the Grading of Recommendations Assessment, Development and Evaluation approach for primary evidence」，納入「meta-analysis yes/no」與 AMSTAR 分數，再除以最高分 4。是「以 GRADE 為基礎改寫的」方法，不是憑空自創。
   - 「不是 GRADE」成立，但「自訂」略過它借用 GRADE 的結構。建議寫成「改編自 GRADE 的 QoE 分數」。

3. 「近年最大的一份整理」（zh 第 33 行；en 對應句）
   - 原文討論段：「the most comprehensive summary… to date」；ACSM 新聞稿同樣是 most comprehensive。這是作者與機構自稱，「最大」不等於「最全面」，文章又用自己的聲音說出來。
   - 事實面可站得住的是「137 篇、>30,000 人，且自稱迄今最全面」。建議改為「ACSM 2026 立場聲明（作者稱是迄今最全面的整理）」，或直接刪「近年最大」。

4. 「這份聲明取代了 2009 年的版本」（zh 第 39 行；en 第 39 行 “It replaces the 2009 version”）
   - 原文與 ACSM 新聞稿用的是「updates」「serves as an update to」「first major update since 2009」。兩處都沒有 “supersede／replace”。
   - 「取代」是合理推論，但來源沒這麼寫。建議改「更新了 2009 年的版本」。Unverifiable 成分：ACSM Position Stands 頁面是否標示 2009 版已被取代，本次沒查到。

5. 「肌肉變大。負荷高低沒有明顯差別」＋「做幾組：每個肌群每週 10 組以上。這是作者從回顧整理的條件，不是一個得到精確驗證的劑量」（zh 第 51、57 行）
   - 負荷：忠於原文與表 4（見 Confirmed C1）。
   - 組數：這句「不是……精確驗證的劑量」的解讀與表 6 不一致。表 6 對肌肥大寫的是「Volume: ≥10 sets/wk (dose-response)」，且 ≥80% 1RM 也標 (dose-response)。作者把它們標成有劑量反應證據，而不是「條件」。精讀紀錄第 35 行的說法（「並非嚴格的劑量反應」）本身有出入，需回頭修正，勿沿用。
   - 另一方面，討論說「the exact number of sets… cannot be ascertained」，且引用統合迴歸（[187]）指出約每週 18–20 組後報酬遞減。所以較忠實的說法是：「≥10 組」是作者在表 6 列的、有劑量反應標記的門檻；最佳組數無法確定，另一篇引用的迴歸指出約 18–20 組後增加有限。
   - 建議縮回：「肌肥大方面，作者在表 6 列出每個肌群每週 10 組以上（標為有劑量反應），但最佳組數無法確定。」

6. 頻率句：「每週練一次或練五次以上，在總量相同的情況下，對肌肥大沒有影響」（zh 第 59 行）
   - 原文：「low (1 d/wk) versus high (>5 d/wk) frequency when total volume was equated」。原文是「超過 5 天」，文章寫「五次以上」會被讀成 ≥5。
   - 「總量相同時」有帶到，是對的。但文章略過同段同層的對照：頻率「對力量有影響」，只是總量相同時差異縮小（討論：「RT frequency was found to impact strength… the impact is diminished when volume is equated」；表 4 頻率→力量為 ✔）。文章在「這是作者的立場」那點只提「每週至少兩次」，沒有說這跟力量的頻率結果有關。
   - 建議：把「五次以上」改成「每週超過五天」；補一句頻率對力量有影響，但總量相同時差異變小。

7. 練到力竭段（zh 第 63 行；tldr）
   - 「練到力竭不會讓力量、肌肥大、功率的進步更多」與原文討論句一致（見 C2）。但同一份聲明的結果段寫「There were insufficient data to determine if power was affected by fatigue/failure (99)」，表 4 功率欄也是 “?”（1 篇回顧）。即功率部分來源自己前後不一：討論句下了結論，結果段卻說資料不足。
   - 文章只轉述討論句，等於替來源把功率一併寫成確定。建議寫成「對力量和肌肥大，練到力竭沒有讓進步更多」，功率不寫，或註明結果段資料不足。這同時是對 tldr「練到力竭不是必要」的小範圍縮減（主結論仍站得住）。
   - 文章略過的相關內容：作者的首要建議是「high effort、每週至少兩次、涵蓋主要肌群」。只寫「力竭不必要」而不提「要高努力」，讀者可能得到「不用很努力」的印象。建議在該段補一句高努力是首要建議（作者建議，不是研究結果）。

8. 2009 版建議（zh 第 79 行、第 89 行；en 第 79、89 行）
   - 數字（三項研究、59 人、兩項沒研究頻率、被評最高證據）全部吻合原文。
   - 缺少限定：原文是「novice lifters complete two to three full-body sessions per week **for muscle hypertrophy**」。文章只寫「新手每週練 2 到 3 次」，漏了「針對肌肥大」。建議補上，否則讀者會以為是整體頻率建議。
   - 位置：這句在 Discussion（討論）段，「在討論裡找」成立。

### 🟡 Unverifiable

9. Lopez 2021 有更正聲明（Med Sci Sports Exerc 2022;54(2):370，doi 10.1249/MSS.0000000000002838）。PMC 頁 403、LWW 只拿到搜尋摘要，本次無法確認更正了什麼。文章引用 28 項／747 人／P = 0.068／SMD 等數字，若更正涉及其中任一項需重核。建議人工打開 https://journals.lww.com/acsm-msse/fulltext/2022/02000/resistance_training_load_effects_on_muscle.21.aspx 確認。
   - 補充：Lopez 結果段年齡是 23.4 ± 3.0，討論段是 23.4 ± 2.9，來源自己不一致；文章寫「約 23 歲」不受影響。

10. 「Springer／LWW 頁面」與補充附錄：未取得逐篇回顧的 AMSTAR、QoE，無法核對「AMSTAR 1–9」以外的分布。文章本身沒寫 AMSTAR，不影響判定。

### 🟢 Confirmed

- C1 負荷（問題 1）：原文結果段「strength… (24,77–84)」為有影響；「muscle hypertrophy was not affected by… load」；改善肌肥大段「low (30% 1RM) to high (100% 1RM) loads」無影響。表 4：負荷→力量 ✔（6 篇回顧、n = 6,574、QoE 79%）；負荷→肌肥大 ✖（8 篇回顧方向為「無差別」、n = 5,340、QoE 66%，另 1 篇 ↑、1 篇 ?）。討論句「Load… has repeatedly been shown to impact strength more than other RT adaptations」。文章「力量隨負荷越高進步越多」「肌肥大從 30% 到 100% 1RM 沒有影響」忠於原文。符號：✔ 代表有影響、✖ 代表沒影響、? 代表資料不足，文章方向沒有讀反。
  - 補充缺口（非錯誤）：表 6 對力量的負荷條件是「≥80% 1RM（dose-response）」，文章只說「越高越多」，沒有給 80% 門檻；功率的最佳負荷是 30–70% 1RM，文章沒提。若要保留「力量要多重」的資訊，可補 ≥80%。
- C2 力竭（問題 4）：討論原句與文章一致；「insufficient evidence to quantify exact RIR and perceived exertion targets」與文章一致（見 Misframed 7 的功率與 high effort 補充）。
- C3 組數（問題 2）：「one set is superior to zero sets… two sets are superior to one set… exact number of sets… cannot be ascertained」與文章一致。tldr「組數越多通常越好」略寬：作者另指出每組以上報酬遞減；建議 tldr 改「多做幾組通常較好，但最佳組數未知」。
- C4 規模（問題 5）：137 篇系統性回顧；只含健康成人；AMSTAR 範圍 1（最低）至 9（最高），滿分 11；QoE 為自訂百分比而非 GRADE（見 Misframed 2）；「無法合併 GRADE」原句為「cohesive QoE evaluations, such as pooling… GRADE assessments (14), were not possible」，在限制段。文章沒有寫 AMSTAR，也沒有提 >30,000 人，不存在錯誤。
- C5 Lopez（問題 7）：28 項研究、747 名健康成人；6–12 週；平均約 23 歲；高對中負荷 P = 0.068（SMD 0.26–0.28，95% CI 下限 −0.02）為「接近但未顯著」；只納入練到力竭的組別（低 >15RM、中 9–15RM、高 ≤8RM）；「肌肥大看起來與負荷無關，肌力高負荷較佳」。皆吻合。研究品質偏低、不能外推到高度訓練者，都是 Lopez 自己列的限制。
- C6 利益揭露（問題 8）：「B. J. S. formerly served on the scientific advisory board for Tonal Corporation, a manufacturer of fitness equipment. No other authors reported conflicts relevant to this work.」吻合。Lopez：「The authors have no conflict of interest to declare」，文章沒提也無妨。
- C7 限制歸屬（問題 9）：
  - 「不能比較哪種課表更好」—作者限制（「Overviews of reviews do not permit inferences about the comparative effectiveness…」）。「無法比較各種組合」是文章的轉述，語意接近。
  - 「證據品質參差」—作者限制（隨機試驗常 poor quality、small sample sizes）。
  - 「重複計算、只對力量做重疊分析」—作者限制（CCA 重疊「moderate」6%–10%）。
  - 「只含健康成人」—設計範圍，非「限制清單」，但作者有明說。「沒有比較不同身體部位或肌群」是作者在建議段落的陳述，歸屬正確。
  - 「手指、肩膀的答案給不出來」—文章自己的推論，措辭有標「我讀出的」，歸屬恰當。
  - Lopez 的限制：低品質、6–12 週、年輕、不能外推—皆為 Lopez 作者自述。

### 其他檢查（問題 10）

- 作者建議是否寫成研究結果：文章有分，「每週至少兩次」明寫為作者首要建議；沒發現把建議寫成結果的句子。但有三處需注意：「每週 10 組以上」的條件（Misframed 5）、「新手 2–3 次」（Misframed 8）、以及「高努力」缺漏（Misframed 7）。
- 因果強度：未發現把相關寫成因果；全部是「有影響／沒影響」的整理語氣，與來源一致。
- 歸因標籤密度：zh 正文的「作者說／作者寫到／作者自己說／ACSM 說」約 6 處（集中在「這份證據」「做幾組」「這些結論的限制」）。已超過 3 處，建議在修 Misframed 時合併，不要再新增標籤。

### 英文版（-en）

英文版的上述問題與 zh 對應行相同：第 39 行 “replaces”（Misframed 4）、第 41 行 “not how certain the evidence is”（Contradicted 1）、第 79 行 “2 to 3 sessions a week for beginners” 漏 “for muscle hypertrophy”（Misframed 8）。其他 en 數字（137、28、747、59）與 zh 一致。

### 建議優先序

1. 修 Contradicted 1（QoE 能給確定性）。
2. 修 “取代”→“更新”（Misframed 4）、「近年最大」（Misframed 3）。
3. 力竭段補 high effort 並收窄功率（Misframed 7）；10 組與 2009 版補限定（Misframed 5、8）；頻率句改「超過五天」（Misframed 6）。
4. 人工確認 Lopez 更正聲明內容（Unverifiable 9）。

範圍聲明：本次只檢查了文中已提出的宣告（約 25 條，涵蓋 12 項重點），未評估文章對主題的覆蓋是否完整。範圍外未驗：Springer／LWW 頁面、補充附錄、Refalo 2023 等未引用的來源。

下一步（未完成前不能 commit）：post-review、post-polish

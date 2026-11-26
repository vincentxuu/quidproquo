# post-verify report: 2026-10-25-heart-lungs-oxygen（zh-TW 與 -en）

查證日期：2026-10-25。工具：Groundlane `web_fetch`（format=text, extract=full），三份來源皆 `truncated:false` 全文取得，內容無 Loading／空欄位。
- Lang 2024：Europe PMC fullTextXML（58,404 字元，存檔後以 `python3 -I` 讀）
- OpenStax §19.4：https://openstax.org/books/anatomy-and-physiology-2e/pages/19-4-cardiac-physiology
- OpenStax §22.4：https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange

來源數說明：Lang 的數字只有「論文全文」這一個一手來源（同一篇的 PMC 全文，不算兩個獨立來源）；OpenStax 各一頁。依本 skill 高風險 claim 需 2 源的規定，Lang 的統計數字屬「一手原文逐字核對」，未另找獨立二手來源，這點誠實標出。

## 🔴 Contradicted

（無整句與來源直接矛盾者。）

## 🔵 Misframed（字面大致對，但推論或範圍走樣）

1. **「異質性高：許多納入的統合分析之間差異很大，且常解釋不了」**（zh 第 69 行；en 第 69 行 "Many of the included meta-analyses differ a lot from one another"）
   - 原文：「heterogeneity was high for many of the included meta-analyses and was often not explained by subgroup analyses」。異質性是「每一篇統合分析內部、其納入的原始研究之間」的差異，不是「統合分析彼此之間」。
   - 建議修法（縮回原意）：「不少納入的統合分析，內部各研究的結果差異很大，而且常常用次族群分析也解釋不了。」英文同步改為 "within many of the included meta-analyses, the studies differ a lot…"。

2. **作者說 "may signal a causal relationship" 的「理由」**（zh 第 71 行；en 第 71 行）
   - 原文（Discussion）：「Given that we summarised evidence from cohort studies, and randomised controlled trials cannot be used in our investigation, the results of this study may signal a causal relationship…」。作者的前提是「彙整的是世代研究證據」加上「無法用隨機對照試驗」，文章只留後半，變成「理由是無法做 RCT」，讀起來像「做不了 RCT 所以可能是因果」。作者前提本身是兩項，且這是作者的推論（文章已說是推論，這點忠實）。
   - 「需要多次縱向測量才能進一步確立因果」：原文是 "future studies would benefit from repeated longitudinal measures of CRF to further establish causality"（Areas of future work），語氣是「會有助於」，不是「需要…才能」。zh 的「才能」比原文強。
   - 建議修法（縮回原意）：「作者寫到，因為這份證據來自世代研究、又無法用隨機對照試驗來做，結果『may signal a causal relationship』。這是他們的推論；他們也說，之後若有多次重複量測適能的研究，會更有助於確立因果。」

3. **規模與結果的範圍並置**（zh 第 59–61 行；en 第 59–61 行）
   - 「26 篇／199 個世代／超過 2,000 萬筆觀察」數字全對，是全部 26 篇（含一般人口、新發疾病、已有慢性病者）的總規模。但接著寫的 HR 0.47 與每 1 MET 11–17% 只來自其中 8 篇「一般人口的死亡結果」統合分析（摘要：「eight meta-analyses that described five unique mortality outcomes among general populations」）；11–17% 更是兩篇統合分析各自的結果（HR 0.89 與 0.83），不是單一估計。讀者容易以為 0.47 是對 2,000 萬筆資料合併出來的單一數字。
   - 建議修法（縮回原意）：在「結果是」前加限定，例如「其中針對一般成年人全因死亡的統合分析：高對低適能的風險比 0.47；每高 1 MET 低約 11% 到 17%（兩篇統合分析各自的結果）」。
   - 另：HR 是 hazard ratio，zh 寫「風險比」可以，但與 risk ratio 同名，首次出現可標「危險比（hazard ratio）」；en 已寫 hazard ratio。

4. **「肺泡氧分壓約 104、血液約 40」**（zh 第 39 行；en 第 39 行）
   - 數字與來源一致，但來源的 40 mm Hg 是「肺微血管裡（剛進肺、已用過氧的）血液」；離開肺的血（肺靜脈）約 100 mm Hg，且 §22.4 同一頁的組織端數字是「組織約 40、血液約 100」。文章只寫「血液裡大約是 40」，讀者會以為血液氧分壓恆為 40，也就看不出第三站組織端為何有梯度。
   - 建議修法（縮回原意）：「肺泡裡氧分壓約 104 mm Hg，剛流進肺微血管的血液約 40 mm Hg」；第三站可補一句「組織約 40，血液約 100」。

5. **步驟 2「與標題的 strong 並不一致」**（zh 第 80 行；en 第 80 行；另 zh 第 63 行「標題寫…證據確定性卻不高」）
   - 標題與結論的 "strong"、"consistent" 指的是關聯強度（HR 大、各研究方向一致），GRADE 確定性是另一個維度（對估計值有多大信心）。兩者並存不是文字上的矛盾，文章第 65 行自己也這樣解釋（「關聯很一致、數字也大，不代表可信度高」），但第 80 行用「並不一致」會讓讀者誤以為論文自相矛盾。論文本身也只是同時寫了 "strongly associated" 與 "low-to-very low certainty for most outcomes"。
   - 這個「標題 vs 確定性」的並排是文章（與精讀紀錄）自己的解讀，不是作者說的；不是錯，但歸屬要清楚。
   - 建議修法（縮回原意）：「你會讀到確定性『從非常低到中等』；標題談的是關聯的強度與一致性，確定性談的是對這些估計有多少信心，兩者是不同的事。」

6. **「傘狀回顧」稱呼**（全文，含標題連結文字與 tldr）
   - 論文全文找不到 "umbrella" 一字；它自稱 "overview of systematic reviews"／"overview of meta-analyses"（依 Cochrane handbook 的 overview of reviews）。「傘狀回顧」是對此類研究的通用中譯，白話解釋「把許多篇統合分析再整理一次」方向正確，但文章未交代論文自己的用詞，讀者拿 "umbrella review" 回原文搜不到。
   - 建議修法：首次出現加註「論文自稱 overview of systematic reviews」，或直接用「回顧的回顧（overview of reviews）」。

## 🟡 Unverifiable（兩個來源都沒有）

7. **數脈搏的操作方式**（zh 第 79 行；en 第 79 行）：「坐著休息幾分鐘、兩根手指按手腕內側或頸側、數 1 分鐘」與「多數人會落在這個範圍」不在 §19.4／Lang 任一頁。屬一般常識但本篇無來源。建議：刪掉頸側（自行按頸動脈有風險爭議且無來源），或補衛福部／醫學機構來源；「多數人會落在這個範圍」可刪（教科書只說 normal）。

8. **「教科書裡兩個常被引用的數字」**（zh 第 49 行；en 第 49 行）的「常被引用」是文章自己的說法，無來源。建議刪「常被引用」。

9. **「年輕健康的人運動時…約是靜止時的 4 到 5 倍」與 5 公升**：與 OpenStax 逐字一致（見下方 Confirmed），但來源自己算術不一致：150 × 130 = 19.5 L/min，除以 5.25 = 約 3.7 倍，不是 4–5 倍。文章沒寫 19.5，讀者若用文中 5 公升與 4–5 倍相乘會得 20–25 L/min，與書中 19.5 不符。屬「來源本身的鬆散」，不算文章抄錯。建議（縮回原意）：改「約 19.5 公升，教科書稱約為靜止時的 4 到 5 倍」或寫「約 4 倍」。

## 🟢 Confirmed（逐字核對 OpenStax 與 Lang 全文）

OpenStax §22.4（引文逐字，我重新抓取，無程式比對但逐句目視對照）
- 肺泡氧分壓約 104 mm Hg、肺微血管血液約 40 mm Hg：「The partial pressure of oxygen in the alveoli is about 104 mm Hg, whereas its partial pressure in the blood of the capillary is about 40 mm Hg」✓（範圍見 Misframed 4）
- 擴散不需額外能量：「The actual exchange of gases occurs due to simple diffusion. Energy is not required to move oxygen or carbon dioxide across membranes.」✓
- 大部分氧由紅血球血紅素運送：「most of the oxygen is picked up by erythrocytes (red blood cells) and binds to a protein called hemoglobin」✓（原文另說有少量直接溶於血漿，文章「大部分」措辭吻合）
- 組織端氧自血紅素鬆開、擴散入組織：「causes oxygen to dissociate from hemoglobin, diffuse out of the blood, cross the interstitial space, and enter the tissue」✓；CO2 反向回血液、帶回肺 ✓
- 精讀紀錄 A 區所有 §22.4 引文與重抓結果逐字一致。

OpenStax §19.4
- CO = HR × SV ✓；SV 約 70 mL（70 kg 靜止成人的平均）✓；HR 約 75 bpm ✓；平均 CO 5.25 L/min（文章寫「約 5 公升」為合理四捨五入）✓
- 運動：HR 可到 150、SV 約 130 mL、CO 約 19.5 L/min、「4–5 times the resting rate」✓；頂尖運動員更高（原文 7–8 倍）✓
- 精讀紀錄 A 區所有 §19.4 引文與重抓結果逐字一致（含「loosely defined」「220 bpm 減年齡」「60–100」）。
- 「教科書的例子，不是研究結果，個人差異很大」妥當：運動數字原文是 "healthy young individuals…may increase / would increase" 的設想例；靜止數字是「70 kg 個人的平均」並附範圍（SV 55–100 mL、HR 60–100、CO 4.0–8.0 L/min）。原文另註這是「每一側心室」的 CO。可選補：寫出靜止範圍更能呈現個人差異（非必要）。

目標心率與 220（第 3 點）：忠實。
- 原文「individuals are cautioned to monitor their HR to ensure they stay within the target heart rate range of between 120 and 160 bpm, so CO is maintained. The target HR is loosely defined as the range in which both the heart and lungs receive the maximum benefit from the aerobic workout and is dependent upon age.」→ 文章說教科書自稱 "loosely defined" ✓。注意原文也說它「dependent upon age」，文章略過，不影響結論。
- 「220 減年齡」：原文「This may be estimated by taking the maximal value of 220 bpm and subtracting the individual’s age」，且前文是 "Maximum HRs are normally in the range of 200–220 bpm" → 教科書確實只說 estimated ✓。
- 「我沒有採用」列為不採用的做法忠實，且是文章自己的取捨，歸屬清楚。唯「常被引用」見 Unverifiable 8。

靜止心率 60–100 與就醫（第 7 點）
- 「成人靜止心率通常 60 到 100」來自教科書（"For an adult, normal resting HR will be in the range of 60–100 bpm"）✓，文章已標「教科書說」。
- 教科書列的症狀（weakness, fatigue, dizziness, fainting, chest discomfort, palpitations, respiratory distress）是「若伴隨症狀，可能表示心臟供給組織的含氧血不足」，並沒有說「請看醫師」。「如果明顯超出，又伴隨…，請看醫師」是文章自己的安全提醒，不是教科書的話。該句緊接「教科書說…」之後，歸屬有點模糊；建議改成分句，例如「教科書說…。這是我的提醒：如果…請看醫師」，或直接寫成主張而不加歸因標籤。另教科書症狀清單含虛弱、疲倦，文章只列四項，屬刪減，不是錯。

Lang 2024（BJSM 2024;58:556，DOI 10.1136/bjsports-2023-107849）
- 26 篇系統性回顧（皆含統合分析）、199 個 unique cohort studies、over 20.9 million observations ✓（zh「2,000 萬」、en「20 million」皆可接受；範圍見 Misframed 3）
- 高對低 CRF 全因死亡 HR 0.47（95% CI 0.39–0.56）✓；每高 1 MET 全因死亡降 11–17%（HR 0.89 與 0.83）✓
- GRADE 確定性 "ranged from very low-to-moderate" ✓（摘要）；"low-to-very low certainty of the evidence for most outcomes" ✓（Strengths and limitations）
- 標題 "Cardiorespiratory fitness is a strong and consistent predictor…" ✓；結論 "strongly associated" ✓
- 作者說 "may signal a causal relationship" ✓（理由的轉述見 Misframed 2）
- 1 MET = 3.5 mL/kg/min ✓（"1-MET (3.5 mL/kg/min)"）；CRF 定義「integrated function of numerous bodily systems to deliver and use oxygen」✓；最大／峰值攝氧量 mL/kg/min 或 MET ✓
- 白話「世代研究是先量適能、再追蹤，看誰先出事」正確（論文為 baseline CRF 與 prospective outcomes）。「追蹤好幾年」未逐項驗，表 1 各統合分析的追蹤範圍為例如 7.7–22 年，方向吻合。
- 「傘狀回顧」白話解釋方向正確（見 Misframed 6 的用詞備註）。

## 第 8 點：限制的歸屬（作者列的 vs 文章自己的）

- 作者列的：
  - 男性樣本：Areas of future work，"Nearly all the outcomes identified in this study were downgraded due to the evidence being generated largely from samples comprising males" ✓
  - 單次量測：Strengths and limitations，"limited to studies examining associations between a single measure of CRF and prospective health outcomes" ✓
  - 異質性高：Strengths and limitations（語意見 Misframed 1）
- 文章自己的解讀（非作者說）：
  - 「標題寫強、確定性卻不高」的並排與「不一致」判斷（Misframed 5）。
  - 「不能說提高適能就會降低風險」是文章的保守立場；作者其實同時寫了 "may signal a causal relationship"、並主張 CRF 應納入臨床常規（文章未引，合理）。
  - 「適能不是只看心臟或肺…包括肌肉用氧的能力」是依定義做的合理推論，非作者原話。
- 作者列了、文章沒收的（覆蓋面，非準確度；交 post-review）：
  - 作者在同一段說需要「adequate adjustment for confounding」；臨床族群結果被降級常因「lack of adequate control for confounding」。這直接支撐「相關不等於因果」，文章沒提。
  - 納入的 26 篇系統性回顧品質：AMSTAR2 評為 critically low 11 篇、low 4 篇、moderate 8 篇、high 3 篇。
  - 作者在男性樣本那段還說，增加女性樣本「likely would not impact the magnitude of the observed effects」（男女效益相近）。文章只放降級原因，未放這句；單看會讓「男性樣本」限制顯得比作者的看法更嚴重。

## 第 9 點：觀察性證據起評為「高」

- 文章（zh 與 en）沒有出現「起評為高」或任何 GRADE 起評點的描述，不需核對。
- 附帶：論文用的是 "modified GRADE"（觀察性世代證據起評為 high，因為認為 RCT 不可行；可依五個面向降級），文章寫「GRADE」未加 modified。因文章未碰起評規則，不算錯；若日後補充 GRADE 說明，須寫成這份研究的修改版做法，並注意一般 GRADE 慣例我未查證。

## 第 6 點：相關寫成因果了嗎

- 沒有。tldr、結論段、正文第 71 行都明確寫「關聯，不是證明」。小提醒：zh 第 33、31 行的「心肺適能高的人活得比較久」是口語轉述，研究測的是死亡風險（hazard），不是壽命長度；位置在問句／轉述，不構成因果錯置。
- 範圍限制（非因果但相關）：研究對象是「成年一般人口與臨床族群」，已排除運動員等特殊族群；文章「這能套到攀岩嗎」一節已誠實處理。

## 歸因標籤密度

全篇「教科書說／作者／他們」類歸因標籤：目標心率段 2 處、60–100 段 1 處、限制與因果段約 3–4 處。已接近 3 處門檻，修正時優先合併，勿再新增「我的判斷」之類標籤。

## 英文版（-en.md）一致性

與 zh 事實一致，同樣有 Misframed 1–6、Unverifiable 7–9 的問題（行號相同）。"air sacs" 為 alveoli 的白話，可接受。英文 "for every 1 MET higher, all-cause mortality was about 11% to 17% lower" 同樣缺「兩篇統合分析各自的結果」限定。

---
範圍聲明：本次只檢查了文中已提出的宣告（OpenStax 約 14 條、Lang 約 16 條、歸屬／框架約 8 條），未評估文章對主題的覆蓋是否完整。OpenStax 兩頁本次為完整全文（精讀紀錄當時只讀到截斷處）；Lang 全文已讀，但補充表（逐篇 AMSTAR2、逐項 GRADE 理由）未讀。

下一步（未完成前不能 commit）：post-review、post-polish。

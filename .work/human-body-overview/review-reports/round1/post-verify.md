# post-verify report: 2026-10-24-human-body-overview（zh-TW）＋ -en

查證日期：2026-10-24。只報告，未改任何檔案。

## 0. 實際讀到什麼（誠實揭露）

工具：Groundlane `web_fetch`（format=text, extract=full）。Groundlane 可用，未降級。全文過大被存檔後，用 `python3 -I` 分段讀。

| 來源 | 狀態 |
|---|---|
| A. WHO 2020 論文版 PMC7719906（Europe PMC 全文 XML） | **全文讀完**。80,269 字元，`truncated:false`，從摘要、Table 1–4、方法、各族群證據段、Discussion 到參考文獻都讀過。 |
| B. Lazarczuk 2022 PMC9474511（Europe PMC 全文 XML） | **全文讀完**。98,597 字元（抽出文字），`truncated:false`。摘要、方法、結果、討論、限制、實務應用、結論都讀。Table 2（61 項逐篇特徵表，約 2 萬字）只掃過 N 與年齡欄、沒逐列細讀；表外正文與 Table 3 都讀過。 |
| WHO 指引原文頁 who.int/publications/i/item/9789240015128 | 讀到，但只是摘要頁，沒有建議內容，不能當證據。 |
| WHO 歐洲區 at-a-glance 頁 | 讀到（短），內容為重點訊息。 |
| WHO 事實清單 Physical activity | 讀到。 |
| 成大醫院家醫部〈運動處方〉頁 | 讀到全文。台灣醫療機構頁面，引述 WHO 2020。 |
| 國健署〈身體活動建議量〉hpa.gov.tw nodeid=1676 | **沒讀到內容**。頁面本文是動態載入，兩種抓法都只回導覽列。不能作為證據。 |
| 國健署〈全民身體活動指引〉電子書頁 | 只有搜尋摘要，沒抓。 |
| 樂詞網 terms.naer.edu.tw | **沒讀到詞條內文**。查詢頁的 `q=` 參數被忽略（回傳預設的舞蹈名詞清單）；`/detail/…` 頁被導回首頁；firecrawl 額度用完。下面樂詞網的資料只有搜尋結果的「標題／摘要」，沒有開過詞條，不能算查證完成。 |
| 搜尋摘要（CardioSmart 等） | 只用來找候選來源，不作為 Confirmed 依據。 |

## 1. 事實陳述逐條判定

縮寫：zh = 中文版，en = 英文版，WHO = 來源 A，LAZ = 來源 B。兩版內容結構與主張一一對應，差異另列在第 3 節。

### 1.1 WHO 數字與建議

| # | 文章陳述 | 判定 | 說明 |
|---|---|---|---|
| 1 | 成人有氧每週 150–300 分鐘中等強度，或 75–150 分鐘高強度，或兩者混合；強力建議 | 🟢 Confirmed | Table 4：「at least 150–300 min … or at least 75–150 min … or an equivalent combination」，Strong。注意原文是 at least；文章略去（見 3.2）。 |
| 2 | 肌力活動每週 2 天以上，中等或以上強度，涵蓋所有主要肌群；強力建議 | 🟢 Confirmed | Table 4 同一個 Strong 區塊。內文另寫「strong recommendation supported by moderate-certainty evidence」。 |
| 3 | 任何長度的活動都算；舊版要求每次至少 10 分鐘，新版拿掉 | 🟢 Confirmed（有範圍限定，見 3.2 #M2） | 「MVPA bouts of any duration now count」「previous stipulation … at least 10 min bouts has been removed」。原文限定成人、限定 MVPA。 |
| 4 | 工作、休閒、家務、通勤中的活動都計入 | 🟢 Confirmed | 「accrued at work, leisure, home or during transportation count」。 |
| 5 | 65 歲以上：除了以上，每週 3 天以上做包含平衡與肌力的多元活動，目的是預防跌倒 | 🟢 Confirmed，但省略限定條件 | 原文：「varied multicomponent physical activity that emphasises functional balance and strength training **at moderate or greater intensity** on 3 or more days a week, to enhance functional capacity and to prevent falls」。文章漏了「中等或以上強度」，目的只留「預防跌倒」，漏掉「提升功能能力」。屬 3.2 #M3。 |
| 6 | 做一點比不做好；從少量開始、逐步增加 | 🟢 Confirmed | 逐字對得上。 |
| 7 | 沒有禁忌症的人，開始不超過快走或日常生活負荷的輕度到中度活動，通常不需先取得醫療許可 | 🟢 Confirmed | 「Pre-exercise medical clearance is generally unnecessary for individuals without contraindications prior to beginning light-intensity or moderate-intensity physical activity not exceeding the demands of brisk walking or everyday living」。文章的條件（無禁忌症、開始階段、強度上限）都保留了。 |
| 8 | 增加活動量後出現新症狀，就去看醫師 | 🟢 Confirmed | 「Those who develop new symptoms when increasing their levels of activity should consult a healthcare provider」。 |
| 9 | 這份基準給一般人維持健康用，不處理運動員為競賽表現做的訓練 | 🟢 Confirmed | 「These guidelines are for the general population and do not address the benefits and harms experienced by athletes undertaking … activity necessary to improve performance-related fitness for participation in competition」。 |
| 10 | 「如果你的目標是運動表現，這個基準是底線，不是訓練處方」 | 🔵 Misframed（作者推論寫成事實） | WHO 只說「不處理」運動員競賽訓練，沒有說這個基準是運動表現的「底線」，也沒有說「不是訓練處方」。這是作者的合理推論，但緊接在 WHO 句子後面，讀起來像 WHO 的說法。建議修法見 4.3。 |
| 11 | 5 到 6 分算中等強度，7 到 8 分算高強度，「WHO 的定義是」 | 🔵 Misframed（省略限定詞） | 論文 Table 1：「On a scale relative to an individual's personal capacity, MPA is **usually** a 5 or 6 on a rating scale of perceived exertion scale of 0–10」；VPA 同樣是 usually 7 or 8。「usually」被拿掉，且這是「相對於個人能力」的標度。WHO 的主要定義還有絕對尺度（中等 3 到 <6 METs、高強度 ≥6 METs），文章只講了主觀量尺。數字本身 Confirmed。 |
| 12 | 「0 是坐著不動，10 是用盡全力」 | 🟡 Unverifiable（於 WHO 論文） | WHO 論文只寫「rating of perceived exertion scale of 0–10」，沒有定義 0 與 10 的錨點。這是 Borg CR10 之類量表的常見說法，但這篇文章沒有放這個出處，且緊接著寫「WHO 的定義是」，讀者會以為錨點也出自 WHO。 |
| 13 | tldr：「每週 150–300 分鐘中等強度有氧活動，再加上每週至少 2 天的肌力活動，任何長度的活動都算」 | 🟢 Confirmed，但縮窄 | 每項都對。只是漏了「或 75–150 分鐘高強度」這一選項，且「任何長度都算」在原文限定為 MVPA 的 bout 長度（見 #3）。 |

### 1.2 證據分級與「強度 vs 確定性」

| # | 文章陳述 | 判定 | 說明 |
|---|---|---|---|
| 14 | WHO 把證據確定性分四級：高、中、低、極低 | 🟢 Confirmed | Table 2A。 |
| 15 | 高表示「非常有信心」；極低表示「幾乎沒有信心」，真實效果很可能和估計差很遠 | 🔵 Misframed（輕微） | 高：「Very confident that the true effect lies close to…」，OK。極低：「**Very little** confidence … likely to be substantially different」。「very little」是「很少」，不是「幾乎沒有」。zh 的「幾乎沒有信心」比原文重；en 引號內是 "very little confidence"，與原文一致。 |
| 16 | 評級時考慮五件事：偏差、不一致、不精確、間接性、發表偏誤 | 🟢 Confirmed | 「risk of bias, inconsistency, imprecision, indirectness of the evidence and publication bias」，剛好五項。兩版五項順序與名稱一致。注意：原文是「GRADE framework」，GRADE 通常還有可「升級」的因素，原文沒列；文章說「評級時要考慮五件事」，在原文範圍內成立。 |
| 17 | 「WHO 的指引主要用系統性回顧」 | 🟢 Confirmed（略簡化） | 方法段：沿用並更新各國指引的系統性回顧，另外委託 6 份 umbrella reviews。說「主要」成立。 |
| 18 | 兒童與青少年久坐建議：強力建議，證據確定性低 | 🟢 Confirmed | 「The sedentary behaviour recommendation was rated as strong based on low certainty evidence」。 |
| 19 | 成人每週超過 300 分鐘中等強度有額外好處，卻只評為有條件建議，因為看不出收益從哪裡開始遞減 | 🟢 Confirmed（但遺漏高強度選項） | 「it is not possible to specify the physical activity levels where diminishing returns begin. For this reason, the new recommendation … is rated as conditional」。原文同時有「>150 分鐘高強度」，文章沒提。另：同一份論文的「What is new」段寫「going beyond this range does not appreciably further decrease the risk」，與結果段「more is better, relative benefits diminish」語氣不同，文章採用了結果段的版本，沒有問題，但來源自身有張力。 |
| 20 | 「強力建議不一定代表證據很硬」 | 🟢 Confirmed | 例證 #18 直接支持。同一份指引裡，成人有氧與肌力是 strong + moderate certainty，兒童久坐是 strong + low，也可作為補充例子。 |
| 21 | 「單一研究再漂亮，也可能只是巧合」；系統性回顧「不挑單一研究」 | 🟡 作者的一般性說明 | 不是 WHO 的主張，屬教學語句，不需要來源；但「不挑」是理想描述，系統性回顧仍有納入標準與語言限制（WHO 論文自述只搜英文）。建議保持現狀即可。 |
| 22 | 詞彙表：證據確定性 aliases 含 "GRADE" | 🔵 Misframed（輕微） | GRADE 是評級方法／框架，不是「證據確定性」的同義詞。放在 aliases 會讓查詞時把兩者畫等號。建議移除或在 definition 另行說明。 |

### 1.3 Lazarczuk 統合分析

| # | 文章陳述 | 判定 | 說明 |
|---|---|---|---|
| 23 | 整合 61 項研究的統合分析 | 🟢 Confirmed | 「Sixty-one articles met the inclusion criteria」，系統性回顧加統合分析。 |
| 24 | 發現「阻力訓練會讓下肢肌腱變硬」 | 🔵 Misframed（輕微） | 61 項整體結果是「mechanical loading」使勁度上升（SMD 0.74）。阻力訓練分組：stiffness SMD 0.80（68 組），且是唯一讓 modulus 與 CSA 都有明確增加的訓練類型。所以「阻力訓練→變硬」有支持，但原文的整體結論主語是「機械負荷」，且還有條件：跳躍訓練只有較小的勁度增加（0.49），有氧單獨沒有效果，同時訓練（concurrent）沒有變化。文章把 49 項阻力訓練研究與 61 項總數的關係壓成一句，沒有錯，但是「61 項」並非全是阻力訓練（49 項是）。 |
| 25 | zh 版沒有「健康」二字；en 版寫 "healthy lower-limb tendons" | 🔵 中英不一致 | 來源明確限定健康、未受傷的肌腱（排除肌腱病變、術後）。en 保留了限定，zh 漏掉。 |
| 26 | 這些研究「幾乎都只有十幾個人」 | 🔵 Misframed（輕微） | 原文：「all but one study [95] including **≤ 15** participants」。「≤15」包含許多個位數的組別（Table 2 中常見 6–10 人）。「十幾個人」比原文大一點。建議「多半不到 15 人」。「幾乎都」對應 all but one，OK。 |
| 27 | 「受試者多半沒有訓練背景」 | 🟢 Confirmed | 「the majority of participants … were classified as untrained or recreationally active with no consistent histories of resistance training」。 |
| 28 | 「所以結論不一定適用於訓練很久的人」 | 🟢 Confirmed（且還有更強的證據文章沒用） | 原文：「caution should be applied when directly applying the findings of this review to highly trained populations」，並指出 3 項納入訓練有素運動員的研究「all displayed no change in PT stiffness even following high-intensity training」。文章只說「不一定適用」，沒說這三項研究實際上看不到變化；補上會更有說服力，但不補也不算錯。 |
| 29 | 文章沒有提到 LAZ 的研究品質 | ⚪ 覆蓋缺口 | PEDro 中位數 4/8（校正後 50%）；44% 達 60% 以上；隨機化與分配隱藏報告率很低。這是「樣本小」之外的另一個證據弱點，且文章的教學主題正是證據品質。非錯誤，交 post-review 判斷要不要補。 |

### 1.4 其他陳述

| # | 文章陳述 | 判定 |
|---|---|---|
| 30 | 「這個基準是給一般人維持健康用」；用於「一般成人」 | 🟢 Confirmed。範圍是 18–64 歲成人，包含慢性病與身心障礙者（需視能力）。文章只講「一般成人」，沒有提懷孕／產後與慢性病族群，這是省略不是錯。 |
| 31 | 「WHO 2020 身體活動與久坐行為指引」標題、doi、BJSM 2020 | 🟢 Confirmed（PMC 頁首） |
| 32 | 三篇站內攀岩系列連結與篇名 | 🟢 Confirmed（本機檔案存在；zh 篇名「九篇」「十篇」與檔案標題一致；en 連結帶 -en） |

## 2. 特別要求的檢查項

### 2.1 數字核對表

| 數字 | 文章 | 來源 | 判定 |
|---|---|---|---|
| 150–300 | 中等強度有氧 | Table 4 | ✓ |
| 75–150 | 高強度 | Table 4 | ✓ |
| 2 天 | 肌力 | Table 4 | ✓ |
| 3 天 | 65+ 多元活動 | Table 4 | ✓（缺中等強度限定） |
| 10 分鐘 | 舊版 bout | What is new | ✓ |
| 300 分鐘 | >300 conditional | Table 4／結果段 | ✓（另有 >150 高強度） |
| 5–6、7–8 | 費力量尺 | Table 1 | ✓ 數字；缺「usually」與「相對個人能力」 |
| 61 項 | 統合分析 | LAZ abstract | ✓ |
| 15 人 | 文中寫「十幾個人」 | LAZ 限制段 ≤15 | 🔵 見 #26 |
| 四級、五個考量面向 | | Table 2、方法段 | ✓ |

### 2.2 文章有沒有替來源加上它沒說的主張？

1. 「這個基準是底線，不是訓練處方」（#10）：加了。
2. 「0 是坐著不動，10 是用盡全力」（#12）：錨點不在 WHO 論文裡，卻放在「WHO 的定義是」前一句。
3. 「WHO 的定義是 5 到 6 分」：把 usually 的相對標度寫成定義（#11）。
4. 教學步驟 2（見 2.4）：「5 分以上的活動時間加起來，對照 150–300」是文章自己的算法，不是 WHO 的算法。

### 2.3 有沒有把推論寫成事實？

- #10 是最明顯的一處。
- 「單一研究再漂亮，也可能只是巧合」屬一般性說法，不是針對來源，風險低。

### 2.4 有沒有省略限定條件而讓意思變寬？

1. 65+ 的活動要「中等或以上強度」（#5）。
2. 「任何長度都算」只針對 MVPA（成人）；原文沒有說輕度活動的零碎時間也計入 150–300 分鐘（#3）。
3. 強度定義的 usually 與「相對個人能力」（#11）。
4. LAZ 的「健康、未受傷肌腱」（zh 版，#25）。
5. WHO 有氧的 at least 與「或 >150 分鐘高強度」選項（#13、#19）。
6. 醫療許可：文章條件完整，沒有變寬。但原文另有「慢性病者可能想諮詢專業人員」「懷孕者需醫療人員指引」「身障者可能需諮詢」，文章只講一般成人，沒有講。屬覆蓋，不屬錯誤。

### 2.5 中英版是否一致

兩版的事實主張一一對應，沒有多出或少掉的主張。唯一實質差異：zh 漏掉 "healthy"（#25）。其他差異只是語氣（zh 的「幾乎沒有信心」比 en 的 "very little confidence" 重，#15）。tldr、description、glossary 兩版數字相同。兩版的「做一點比不做好」段落、醫療許可段落、運動員段落逐句對應。

## 3. 教學性結論是否與主流理解衝突

### 3.1 獨立來源比對

- **WHO 事實清單**（讀到）：「any amount of physical activity is better than none; all physical activity counts; … muscle strengthening benefits everyone」。與文章一致。
- **WHO 歐洲區 at-a-glance**（讀到）：「at least 150 to 300 minutes of moderate aerobic activity per week (or the equivalent vigorous activity) for all adults」；65+ 要加平衡、協調與肌力。與文章一致。
- **成大醫院家醫部〈運動處方〉**（讀到，台灣醫療機構頁面）：轉述 WHO 2020 為「每週至少 150–300 分鐘中等強度…每週至少 2 天…中等或更高強度肌力強化訓練」，與文章一致。同頁介紹的強度量表是 Borg RPE **6–20 級**（中等 12–13），與 WHO 用的 0–10 量尺不同。
- **國健署**：沒讀到內容，不能比對。

### 3.2 發現的衝突或風險

- **M1（教學步驟的算法偏差，建議處理）**：步驟 2 叫讀者「把所有費力程度 5 分以上的活動時間加起來，對照 150 到 300 分鐘」。WHO 的標準是「中等 150–300，或高強度 75–150，或等效組合」，也就是高強度的一分鐘大約抵兩分鐘中等（WHO 論文沒有明寫 2:1，是從兩組數字推得）。5 分以上包含 7–8 的高強度，把兩者加總再對 150–300，會讓有高強度活動的人**低估**自己的達成度（例如 100 分鐘高強度已經超過 75–150 的範圍，卻會被判成「差 50 分鐘」）。屬 🔵 Misframed。修法：分開加總中等與高強度，說明高強度時間大約可以折半換算；或明說「這是粗略估計」。
- **M2**：「任何長度都算」在原文的語境是 bout 長度（不用連續 10 分鐘），不是說很短的活動也算。步驟 2 的「回想這七天…加起來」實務上做不到零碎活動的精確計時，建議註明是粗估。
- **M3**：步驟 1 的量尺是 0–10；台灣常見的運動處方與運動雜誌文章用 Borg 6–20（見成大頁），讀者可能混用。建議在文章標明這是 0–10 版本，並別說「WHO 的定義」。

其餘教學結論（先看證據確定性再看建議強度、研究對象像不像你、從少量開始、不確定時問醫師）與 WHO 及台灣醫療機構頁面一致，沒有衝突。

## 4. 台灣用語（樂詞網，僅搜尋摘要層級）

**重要限制：樂詞網詞條內文一律沒有讀到（見第 0 節）。下面只有搜尋結果的標題與摘要，不構成查證完成。**

| 文章用語 | 樂詞網搜尋結果顯示 | 判斷 |
|---|---|---|
| 費力程度量尺（rating of perceived exertion） | 標題：「Rating of Perceived Exertion {= RPE} - **自覺運動強度量表**」 | 文章用「費力程度量尺」；樂詞網標題是「自覺運動強度量表」。建議首次出現用「自覺運動強度（RPE）量表」，再說明 0–10。需開詞條確認，狀態：待確認。 |
| 統合分析（meta-analysis） | 標題「Meta-Analysis - 整合分析」；摘要同列「後設分析；統合分析」 | 「統合分析」在摘要中有出現，可用；樂詞網標題的主譯名是「整合分析」（在教育學領域）。待確認各學門採用。 |
| 勁度／硬度（stiffness） | 標題「stiffness - 剛度，剛性，勁度，韌性，穩定性…」「剛性；勁度；韌性」 | 文章用「變硬」是口語，可接受；若要在內文給術語，肌腱力學較貼近「勁度」或「剛度」。待確認。 |
| 久坐行為（sedentary behaviour） | 搜尋沒有找到對應詞條（只出現 sedentary = 殘積的／原地的／固著的） | 沒有樂詞網依據；成大醫院頁面用「避免久坐」，WHO 中文版常見「久坐行為」。文章用字（久坐）與台灣醫療機構用法一致。 |
| 發表偏誤（publication bias） | 只查到 bias = 偏誤，sampling bias 等 | 「偏誤」是樂詞網常見譯法，文章用「發表偏誤」與之相符；沒找到 publication bias 專門詞條。 |
| 系統性回顧 | 只查到 literature review = 文獻回顧／文獻檢閱／文獻探討 | 沒有 systematic review 專門詞條；無法用樂詞網判定。 |
| 肌力活動、多元活動、禁忌症、中等強度、有氧 | 未查 | 成大頁面用「肌力強化訓練」「禁忌」「有氧運動」。文章的「肌力活動」是對應 muscle-strengthening activity 的直譯，台灣常見說法是「肌力訓練」「肌力強化運動」，不影響意義。 |

另有一個語氣問題，不屬事實：zh 版標題的「認識人體總覽」可以，但「缺口」「底線」這類用語偏口語，保持即可。

## 5. 修正建議摘要（只建議，不修改）

1. 🔵 #10 刪掉「這個基準是底線，不是訓練處方」，或縮成 WHO 原意：「這份基準不處理運動員為競賽表現做的訓練，目標是運動表現的人需要另外找專業訓練資源」。
2. 🔵 #11、#12 把「WHO 的定義是 5 到 6 分」改成「WHO 通常以 5–6 分對應中等、7–8 分對應高強度（相對個人能力）」，並刪除「WHO 的定義」對 0 與 10 錨點的暗示，或標明錨點是常見量表的說法。
3. 🔵 M1 步驟 2 把中等與高強度分開加總，或說明高強度約可折半換算。
4. 🟡 #5 補上 65+ 的「中等或以上強度」。
5. 🔵 #25 zh 版補上「健康的」下肢肌腱，與 en 一致。
6. 🔵 #26 把「十幾個人」改成「多半不到 15 人」。
7. 🔵 #15 zh 的「幾乎沒有信心」改成「信心很低」。
8. 🔵 #22 移除 glossary aliases 的 "GRADE"（兩版）。
9. 全篇歸因標籤：正文中沒有逐句「我的判斷／推測」類標籤；本次建議也不新增，上面的修法都是縮回原意或刪除。

## 6. 範圍聲明

本次只檢查了文中已提出的約 32 條宣告，**未評估文章對主題的覆蓋是否完整**（例如 LAZ 的研究品質、WHO 的懷孕／慢性病族群沒有提，只列為缺口，不作判定）。例子（步驟 2 的自我計算）是作者自製教學，本報告對它的檢查是邏輯重算（M1），不是外部事實查證。國健署頁與樂詞網詞條內文未讀到，台灣用語結論是暫定。

下一步（未完成前不能 commit）：post-review、post-polish。

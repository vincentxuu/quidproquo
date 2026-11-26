# post-verify：what-is-pain（order 13）

日期 2026-10-25。檔案：src/content/posts/learning/2026-10-25-what-is-pain.md（zh，下稱 zh）與 -en.md（en）。不修改文章。

## 來源取得程度
| 來源 | 工具 | 程度 |
|---|---|---|
| IASP Terminology 頁 | Groundlane web_fetch，render=always、extract=full、text。預設 render 時回 browser-challenge 失敗，改 always 成功（334,422 bytes、truncated=false） | 讀到 PAIN（定義＋六條注記）、NOCICEPTION、NOCIPLASTIC 全文。**獨立重新取得，非手抄檔**。 |
| Medina-Viedma 2025 | Groundlane web_fetch Europe PMC fullTextXML（56,198 字元，未截） | 全文，程式搜尋比對 |
| Stevens 2021 | 同上（第 2 節起，65,921 bytes） | 第 2、3 節 |
| Cohen 2026 | 同上（53,922 bytes） | 全文 |

## 判定總表
Contradicted：無。Unverifiable：無。

### IASP 官網引文（Confirmed，獨立比對）
- 定義、注記 1/2/4/5 全文、NOCICEPTION 定義與 "Pain sensation is not necessarily implied."、NOCIPLASTIC 定義，zh 55、62-66、68 與 en 對應處皆與原頁逐字（引號內）或語意一致。
- 注記共六條，zh 59 / en 59 寫「六條」正確；第 3、6 條未引用，編號（1、2、4、5）正確。
- 「2020 年修訂」：IASP 頁 PAIN 條目本身**沒有寫 2020**，只說 "new definition, compared to the 1979 version"。2020 來自 Stevens（"2020 IASP Revised Definition"）與 Cohen（引 Raja 2020）。Confirmed，但來源是二手；zh 53「IASP 在 2020 年修訂…目前官網寫的是」可維持，不需改。
- 頁面為 accordion（條目旁有 "Expand"）。zh 117 / en 117 的「找到 PAIN 這一條…你應該會讀到六條注記」讀者可能要先按展開，建議補「按下展開」。
- 頁面版權 © 2021，且同頁混有 1979/1994/2011 舊內容，文章只用 PAIN/NOCICEPTION/NOCIPLASTIC，無問題。

### Medina-Viedma 2025（逐項）
- 15 RCT、810 人、PubMed/Scopus/WOS/PEDro 搜尋到 2025-06、43.7±5.2 歲、61% 女、PNE 407／對照 403：Confirmed。
- 疼痛 SMD：結束 −0.65（CI −1.1 到 −0.2，k=13 n=712）、1 個月 −1.05（CI −1.56 到 −0.53）、3 個月 −1（CI −1.5 到 −0.5）：Confirmed。摘要寫 1 個月 −1.1，正文 −1.05，文章採正文，正確（四捨五入差異，原文內部不一致，文章未揭露此不一致，可選擇不寫）。
- 失能、怕動三時點同方向；災難化結束 −0.9、1 個月 −1.36、3 個月無資料：Confirmed。
- 發表偏誤：怕動結束時 Egger p<0.001、調整後 −0.70：Confirmed。文章避開原文「84% lower／90% lower」（與數字不吻合），做法正確。
- 限制（未搜中日文資料庫、RCT 與人數少、選擇／執行／偵測偏誤、發表偏誤、PNE 與對照異質、無 6/12 個月資料）：Confirmed，皆在原文討論段。
- 執行偏誤：「所有 RCT…無法對受試者（Moseley 2004 例外）與治療者盲化」：Confirmed。3.3 節名稱正確。偵測偏誤（評估者未盲化）原文是 6 個 RCT，選擇偏誤 5 個；文章只寫「有…風險」，未誇大。
- PEDro 6.8±1.1、作者稱 good：Confirmed。13 個好、2 個中等（文章未提，不影響）。
- **無 GRADE**：全文搜尋 "grade"/"GRADE"/"certainty"/"quality of evidence" 皆 0 筆。Confirmed。
- **未測焦慮**：全文 "anxiety" 0 筆，結果僅疼痛、失能、怕動（TSK）、災難化（PCS）。Confirmed。
- 作者結論 "caution" 句位於 5. Conclusions：zh 101「作者在結論裡也說」Confirmed。
- PNE 定義英文引句、"There is no consensus on how to apply"、「團體或個別」、metaphors and analogies：Confirmed。
- 「只有兩個試驗單獨用 PNE」：Confirmed（原文 "except in two RCTs [41,46]"）。

### Misframed（輕度，建議修，皆非數字錯）
1. **zh 84 / en 84「症狀超過 12 週」**：12 週來自引言對慢性的一般分級（"chronic (more than 12 weeks)"），不是本回顧的納入標準。納入標準只寫「patients with CLBP」（2.3 節），Table 2 病程欄多為 ">3 months"／"≥3 months"。建議改「慢性下背痛的成人（引言以症狀超過 12 週定義慢性；各試驗病程見其表 2）」，或只寫「慢性下背痛成人」。
2. **zh 86 / en 86「對照組做同樣的運動和治療，只是沒有 PNE」**：原文確實寫 "the same exercise and physical therapy techniques … except in the study of Ünal"，所以有出處；但 Table 2 縮寫表顯示部分對照組是 traditional education／biomechanical education／BS，並非單純「沒有教育」。建議補半句：「多數對照組做同樣的物理治療，但有些對照組給的是別種衛教，只有 Ünal 2020 例外」，以免被讀成「PNE vs 什麼都不教」。同段第 99 行的「對照組差異大」已有部分補償。
3. **tldr（zh 9 / en 9）與 zh 47 / en 47「這份回顧也沒有給確定性分級」**：比內文 zh 105 弱化了限定。事實是「我在全文搜尋不到 GRADE」，補充材料（Supplementary Figures）沒讀。tldr 的絕對句建議改「全文中看不到確定性分級（GRADE）」。
4. **zh 98 / en 98 發表偏誤例子**：Egger 對疼痛結束時只是 "suggested"（p=0.26，非顯著）。文章用怕動（p<0.001）當例子，沒問題；但「部分分析顯示可能有發表偏誤」可保留。僅提醒：不要再補疼痛結束時的 trim-and-fill 數字（原文調整後 SMD 寫 −1，比原效果還大，內部不一致）。

### 「結果比較容易受期待影響」標為文章自己的推論：妥當
- zh 103 / en 103 的結構是「原文事實（所有試驗執行偏誤，無法盲化）→ 我的解讀 → 這是我的推論，不是作者的結論」，歸屬清楚，推論有事實支撐（量表為 NPRS/VAS/MPQ/RMDQ/ODI/TSK/PCS，皆病人自填）。這是方法學通識，不是新主張，不需刪。
- 小建議：「都是自己填量表」原文沒有用 self-report 一詞，是從量表名稱推得；已被包在「我的解讀」同一句語境內，可接受。要更穩，把「比較容易」改「可能比較容易」。另可補一句事實：原文 6 個試驗的評估者也未盲化（detection bias），讓推論多一個支撐點。
- 歸屬標籤計數：「我的解讀／我的推論／評論作者的解讀」共 3 處，未超過 3 處上限。

### 是否把 PNE 寫成「教育就能治好痛」：沒有，且處理得好
- zh 9、47、en 9、47 明確寫「不能寫成教育就能治好痛」；全文用「有這樣的跡象」「加進物理治療之後」，估計的是附加效果（zh 86）。劑量、機制假說不寫（zh 124）。
- **透明度缺口（建議補）**：Medina 作者自己的結論是 "PNE is an effective therapeutic strategy"（摘要與 5. Conclusions），文章只轉述其 caution 句，沒有告訴讀者作者的結論更強、文章為何採較保守措辭。建議在 zh 101 附近加一句：「作者的結論寫 PNE 是有效的治療策略；我採較保守的寫法，是因為以上限制。」讓讀者看到差距，也避免被疑為選擇性引用。
- tldr 的「不能寫成『教育就能治好痛』」引的是稻草人句，無人主張；可改為「不能解讀成教育本身就能消除疼痛」。（風格，非事實）

### Stevens 2021（Confirmed）
- 1979→2020 差異（拿掉 "described in terms of such damage"、加 "resembling"）：原文第 3 節對照表 Confirmed。
- 「新增的 resembling 表示有些人臨床上偵測不到組織損傷卻有痛」：原文 "highlights that in many pain conditions, such as neuropathic and nociplastic pain, individuals may report pain in the absence of clinically detectable tissue injury"。文章轉述正確，並明標評論作者解讀。小差異：原文舉的是神經病變性與 nociplastic 疼痛兩類，文章只提 nociplastic 脈絡未提 neuropathic（zh 68）。**不算走樣**，但可補「神經病變性與 nociplastic」。
- 文章定性為「評論」正確（原文為 commentary，兒童疼痛脈絡）。注意該文注記措辭與 IASP 官網略異（"phenomenon"→"phenomenon" 單數、"The experience of pain cannot be inferred..."），文章引注記全採官網，正確。

### Cohen 2026（Confirmed，有兩點揭露建議）
- 「兩個矛盾」「病人說有損傷、醫師找不到佐證，兩邊都成立」「建議綁在傷害感受」「沒有新資料」「作者承認可能有爭議」（"likely to be controversial"）：全 Confirmed。「論證型回顧」對應 "In a narrative form"，OK。
- 揭露建議 A：Cohen M 同時是 Raja 2020（定義修訂論文）的作者之一（Cohen 文中參考文獻 5 即 Raja…Cohen M…），也長期批評該定義（Cohen 2018 Pain Rep）。文章稱「2026 年一篇論證型回顧」，讀者看不出作者與被批評對象有淵源。evidence.md 寫「未確認是同一人」；Cohen 文內 Cohen M. L. 自述 Sydney 退休疼痛醫師，Raja 作者列為 "Cohen M"，同名但**我仍未能確認同一人**。建議：維持不寫，或寫「作者群長期批評該定義」（Cohen 文引自己 2018 年文章可證）。
- 揭露建議 B：該頁面顯示 "This article has been corrected. See Korean J Pain. 2026 Apr 1;39(2):291."。文章未提更正啟事（evidence.md 已記錄未讀）。若要保守，可在 zh 74 後加「該文已有更正啟事，我沒讀其內容」，或確認更正內容後再決定。

### 其他檢查
- 「沒有／找不到 X」限定語：GRADE（zh 105「我在這份回顧全文裡搜尋不到」）有限定；zh 126「在我查的範圍內，能免費讀到全文的 PNE 回顧只有這一份」有限定。但**此句與 Medina 自己引的 Wood 2019（S Afr J Physiother）等是否 OA 未驗**，僅限「我查的範圍」，可接受。zh 74「我也沒讀到 IASP 的回應」有限定。tldr 的無 GRADE 見 Misframed 3。
- 「只讀摘要」來源：Riley 2026 只看標題，zh 126 明講「只看到標題，沒有讀內容」，且不在參考資料。OK。
- Stevens 與 Cohen 只轉述不加引號：OK。唯一英文引號是 IASP 與 Medina 的，皆已核對。
- 歸屬標籤 3 處：未超過。
- 站內連結（人體總覽、手指滑車、攀岩傷害總覽）：本次未重讀其內容（範圍外）。
- **en vs zh 一致性**：數字、限定語、標籤、GRADE 與焦慮句、缺口皆一致。差異僅：en 47 / zh 47 都用 "were all lower"／「都」，一致。en 117 使用 "six notes"，一致。en 103 "Add that…self-reported on questionnaires" 與 zh 103 一致。en 的 glossary、tldr 同步弱化「no certainty grade」，所以 Misframed 3、1、2 兩版都要同步改。
- 利益揭露：Medina 作者宣告無外部經費、無利益衝突；IASP 為學會官網（定義制定者）。文章未寫經費，可選擇性不寫。

## 建議修改清單（依優先序）
1. zh 101 附近：補一句作者結論為 "effective therapeutic strategy"，說明文章採保守措辭（zh+en）。
2. zh 84/en 84：12 週改為引言定義或移除。
3. zh 86/en 86：對照組補「有些是別種衛教，Ünal 為例外」。
4. zh 9、47 / en 9、47：「沒有給確定性分級」改「全文中看不到 GRADE」。
5. zh 74/en 74：選擇性補更正啟事與作者淵源揭露。
6. zh 68/en 68：Stevens 解讀補「神經病變性與 nociplastic」。
7. zh 117/en 117：補「按展開」。

## 範圍聲明
只檢查文中已提出的宣告。未檢查：站內連結目標文章內容、補充材料（funnel plot、Table 2/3 逐試驗細節）、Raja 2020 全文（付費，未讀）、Riley 2026 與其他 PNE 回顧內容、Cohen 2026 更正啟事與讀者來信。

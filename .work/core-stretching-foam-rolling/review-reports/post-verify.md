# post-verify 報告：core-stretching-foam-rolling（order 16）

檔案：`src/content/posts/learning/2026-10-25-core-stretching-foam-rolling.md`（zh）與 `-en.md`。查證日期 2026-10-25。未修改文章。

## 取得原文的程度

全部用 Groundlane `web_fetch` 取得，沒有降級。

| 來源 | 管道 | 實際取得 |
|---|---|---|
| Guo 2025（PMC12571568） | Europe PMC fullTextXML，81k 字元，未截斷 | 全文（摘要、方法、結果、討論、限制、利益聲明、參考文獻）。表格與圖只讀到文字描述 |
| Konrad 2024 JSHS（PMC10980866） | 同上，67k 字元 | 全文 |
| Warneke 2024 JSHS 急性（PMC11184403） | 同上 | 全文（摘要、方法、結果、4.4、結論、利益聲明） |
| Warneke 2024 Sports Med Open（PMC11026323） | Europe PMC fullTextXML 只回傳補充表片段，沒有正文。改用 Europe PMC search 取摘要，再抓 sportsmedicine-open.springeropen.com 出版社頁（extract=full，70k 字元） | 摘要、方法、PEDro/GRADE 段、結論與利益聲明。結果與討論逐段未讀 |
| Konrad 2022（PMC9474417） | Europe PMC fullTextXML | 全文。內容止於限制段，沒有利益聲明段，所以拿不到該篇的利益聲明 |
| Wiewelhove 2019（PMC6465761） | 同上 | 全文 |
| Santos 2024（PMC10893730） | 同上 | 全文 |
| Konrad 2024 Sports Med（PMC11393112） | 未重抓 | 兩個版本正文都沒有引用也沒有描述它（grep 無命中），所以沒有「把只讀摘要當全文用」的問題 |

## 判定總表

- Contradicted：0
- Misframed：4 項（皆為輕度到中度，無一項動搖結論）
- Unverifiable：1 項
- 其餘主張 Confirmed

## Misframed

### M1　Guo「功能（失能問卷）也類似」（zh L75；en L75）
- 原文：功能的次族群中，作者說 core resistance 的效果「largest and most stable」（SMD 0.76，I2=0%），Pilates 0.71（CI 0.13–1.56），穩定訓練 0.52。作者在討論與結論另寫 "core resistance training shows optimal benefits for functional improvement"。
- P=0.24 在結果內文只接在疼痛次族群（Fig 4）。摘要才把它寫成 "for improving pain and functional status"。功能次族群是否有獨立的組間檢定，我在正文沒找到。
- 文章的「功能也類似」會讓讀者以為功能的三組也被檢定過、沒有差異。這個說法比原文更確定。
- 建議：改成「功能（失能問卷）也都有進步」。如果要保留類似的語氣，加一句「作者在功能上說阻力訓練最好，但我沒有在正文找到功能次族群的組間檢定」。

### M2　Warneke 急性「38 項研究、1,134 人」與 ROM 結論綁在同一句（zh L53；en L53）
- 原文：38 項研究、1,134 人、140 個效應量是整篇的納入規模。ROM 主分析是 34 項研究、80 個效應量（ES 0.05，p 0.51）。
- 文章在「結果是活動度沒有顯著差異」前面寫 38 項，會讓人以為 38 項都進了 ROM 分析。這是總規模與子分析混在一起，差距不大。
- 建議：「整理 38 項研究、1,134 人；活動度的主分析用其中 34 項」。或者只保留 38 項並刪掉「結果是」的直接承接。

### M3　Wiewelhove「作者的整體評語：相當輕微，部分可以忽略」併句漏掉但書，且衝刺進步沒帶限定（zh L63；en L63）
- 原文完整句："the effects of FR on performance and recovery are rather minor and partly negligible, but can be relevant in some cases (e.g., to increase flexibility or to reduce muscle pain sensation)"。引文本身逐字正確，但文章接著寫的「無法下定論」其實比作者強。作者的說法是 "conclusions … should be treated cautiously"、"the number of high-quality and well-designed studies on FR is limited"。
- 衝刺：作者自己說這個小效應只來自 4 項研究，其中只有 2 項明確為正，且可能是安慰劑或方法差異，"sprint performance results should be interpreted with caution"。文章寫「衝刺表現有一點進步」沒有這個限定。
- 建議：在整體評語後面補「但作者也說在提升柔軟度與減輕痠痛感上可能有意義」。衝刺那句改成「衝刺有一點進步，不過作者提醒只有 4 項研究、可能是安慰劑」。
- 附帶：zh 的「無法下定論」建議改成「作者提醒要謹慎看待」。

### M4　Warneke「明說他們沒有分析傷害發生率」（zh L92；en L92）
- 原文（4.4）："we did not perform analyses regarding acute or chronic effects on back pain or other benefits, such as decreased incidence of musculotendinous injuries with change of direction or explosive movements"。
- 作者說的是沒分析背痛或其他益處，例子是「變換方向與爆發動作時肌肉肌腱傷害的減少」。「傷害發生率」概括得比原文寬，不過方向正確，沒有引文被誤植。
- 建議：「Warneke 2024 說明他們沒有分析背痛或其他益處，例如肌肉肌腱傷害的減少」。

## Unverifiable

### U1　「這幾篇都聲明沒有利益衝突」中的 Konrad 2022（zh L57；en L57）
- Konrad 2024：確認 "The authors declare they have no competing interests."
- Warneke 2024 急性：確認 "The authors declare that they have no competing interests."
- Warneke 2024 Sports Med Open（文章此處未列，順帶確認）："no competing interests. There were no sponsors included."
- Konrad 2022：Europe PMC 全文止於限制段，沒有 Declarations 段，我無法確認。精讀紀錄也沒有記錄這篇的利益聲明。
- 建議：從出版社頁（Springer）核對 Konrad 2022 的 Competing interests。核對不到就把句子限縮成「Konrad 2024 與 Warneke 2024 都聲明沒有利益衝突」。
- 同篇的 Behm 共同作者身分已核對屬實：Konrad 2024（通訊作者）、Warneke 急性（內文寫明 Behm 監督專案）、Warneke Sports Med Open、Konrad 2022（作者列 Konrad、Nakamura、Tilp、Donti、Behm）。

## 特別核對項目

### Guo 2025
- 整體 SMD 0.70：確認。排除 10 項前為 SMD 1.03（95% CI 0.81–1.24，I2=87%），排除後 0.70（0.58–0.82，I2=47%）。文章只寫「排除 10 項後才穩定」與「排除前差距很大」，沒有寫出 0.70 或 1.03，與原文一致。排除的 10 項有列名。
- Pilates 組間 P=0.24：確認。原文 "the statistical comparison did not reach significance (P = 0.24)"。摘要與結論仍寫 Pilates "superior effectiveness for pain relief"，文章的描述正確。作者在討論還寫 "Pilates training is optimal for pain relief"。
- 對照組混合：確認。"no exercise intervention, standard medical care, or other forms of non-specific physical activity"。
- 不良事件分析：正文確認沒有。搜尋 adverse、side effect、dropout、withdraw 無相關命中。adverse 只出現在前言談藥物，"harm" 的命中全是 pharmacological 之類。injur 只出現在參考文獻標題。
- GRADE：正文確認沒有。GRADE、certainty、funnel、Egger、publication bias 都 0 命中。唯一的 "evidence quality" 是討論裡的一般性用語。風險評估只用 RoB 2（31.6%／54.4%／14.0% 確認）。
- 「safe」：原文兩處（摘要後的結論與最後一段）寫 "a safe, effective, evidence-based ... approach"。文章說「我無法從正文確認」，正確且有限定。
- 其他：57 RCT、7,705 人、18–65 歲確認。納入條件是 symptom duration ≥12 weeks，文章寫「超過 12 週」，差別只在是否含等號。「多數研究只做到 12 週」、「心理健康面向有限」確認。核心阻力訓練定義（腹部、豎脊肌、臀部）確認，在文章 Introduction。
- 劑量建議（每週 3–4 次等）與機制段（肌肥大、肌腱、疼痛抑制）：文章明說不轉述，查無洩漏。

### Konrad 2024 JSHS
- 77 項、3,870 人、ES −1.002（moderate）、I2 74.97：確認。文章沒有放這些數字，只寫 moderate。
- 納入規則：確認。≥2 週，排除急性、合併治療、以其他處理（如滾筒）當對照者。
- 靜態與 PNF 優於動態或彈震：確認（Q p=0.012；靜態 vs 彈震 p=0.01，PNF vs 彈震 p=0.01，靜態 vs PNF p=0.28）。
- 量、強度、頻率無顯著關係，原文用 "neither volume, intensity, nor frequency … significant role"：確認。
- 受試者多為 "recreationally active or trained"、不一定適用極端柔軟度（體操、花式滑冰）：確認。
- 發表偏差：確認。Egger 截距 −3.96，p<0.001，作者稱 "reporting bias"，並以「顯著結果較易發表」說明。
- 機制推測（忍受度）："are thought to be the mechanisms"，出自討論，文章標為推測，正確。
- 可補強但非錯誤：作者承認 "lack of a dose response is likely due to the fact that many of the studies conducted lower stretch durations (~1000 s)"。文章已寫「在他們的分析裡」沒有看到，限定足夠。若想更穩，可加一句「作者說可能是因為多數研究的伸展時間很短」。

### Warneke 2024 JSHS 急性
- 摘要 vs 內文不一致：確認存在。摘要 ES 0.01、p=0.88、PEDro 4.58、"low to moderate certainty"。內文 ES 0.05（95% CI −0.10 to 0.20）、p=0.51、PEDro 4.62±1.26、ROM certainty moderate，硬度與被動扭力 very low。
- 文章是否避開：基本避開。文章沒有放任何 ES、p、PEDro 數字，只寫「沒有顯著差異」、「中等」、「非常低」、研究品質「普通」。這些與內文一致，也不與摘要的「無顯著差異」矛盾。
- 唯一的小瑕疵：文章把確定性寫成「中等」，沒有提摘要寫的是 "low to moderate"。讀者拿摘要核對會看到差異。非必要，可加半句「摘要與內文的評級略有出入，這裡採內文」。
- 引文 "we are not suggesting exclusion of stretching or foam rolling from training routines"：逐字正確，位於 4.4 Practical applications，與文章 L104 指示的位置一致。
- 「無法排除特殊效果」：確認，4.4 寫 "we cannot rule out the possibility that there are specific effects of both types of interventions"。
- 「任何讓肌肉溫度上升的活動」：確認，原文為 hypothesis。「文獻很少」確認，"literature relating changes in temperature to ROM increases is scarce"。「作者開頭就提出再拿來檢驗的假設」：確認，前言與 Methods 前一段就寫 "Therefore, we hypothesized…"。
- 對照活動：走路、騎車、震動、肌力訓練確認。原文另含 calisthenics、電刺激、熱敷、冷療。文章用「包括」，沒有窮舉，可接受。需要注意：冷療並不是「讓肌肉溫度上升」的活動，與文章 L55「任何讓肌肉溫度上升的活動」的推測並不衝突，因為那是作者的假說，不是對照清單。

### Warneke 2024 Sports Med Open
- 42 項、1,318 人、肌力 d=0.30、肌肥大 d=0.20：確認（摘要）。
- 對照：方法段 "stretching and inactive control"，文章寫「對照組不做伸展」符合。
- 確定性：確認。"the quality of evidence was downgraded by 2 levels (high to low)" 兩個結果皆是 low（肌力的 session 與 intervention duration 次分析上調一級）。PEDro 平均 4.17±1.4 為 fair。
- 結論 "suggesting a preference for the more efficient strength training if applicable"：確認，文章 L59 與之一致。
- 作者說「小幅」："small stretch-mediated maximal strength increases"、肌肥大 "small magnitude"，文章用「小幅」、「更小」，一致。
- 利益聲明：no competing interests，並說 "There were no sponsors included"。
- 限制：結果與討論逐段沒讀，只核對了摘要、方法、品質與結論。文章用到的內容皆在已核對範圍內。

### Konrad 2022（PMC9474417）
- 11 項、46 個效應量、290 人、平均 23.9±6.3 歲：確認。
- ES 0.823、I2 72.76：確認。
- >4 週 vs ≤4 週 p=0.049、>4 週 p=0.001、≤4 週 p=0.326：確認。但 ≤4 週只有 3 個效應量，>4 週有 8 個。文章寫「超過 4 週的研究才有顯著變化」沒有提這個失衡，建議補半句「≤4 週的研究只有 3 項」，避免讀者把「不顯著」讀成「沒效果」。作者也測過 5 週、6 週切點，結果都沒有差異（p=0.996、0.503），他們自己說 "we believe that 4 weeks was the right cut-off"。
- 小腿：確認，triceps surae 3 個效應量，ES −0.024，p=0.949。作者自己提醒只有 3 項研究、測量方式不同。
- 離群研究：確認。LeGal 的 ES 5.7，拿掉後 ES 0.606、I2=0.00，所以「仍成立，只是各研究間差異縮小」正確（其實降到 0）。
- "limited and inconsistent"：確認，在前言。文章 zh 轉述，en 引用，都正確。
- 作者另指出 Egger 截距 4.26、p=0.07，"tendency of reporting bias"；文章沒有提。屬省略，不是錯誤。

### Wiewelhove 2019
- 21 項（14 滾前、7 滾後），454 人，健康且有運動習慣：確認。
- 滾前：衝刺 g=0.28、柔軟度 g=0.34、跳躍 g=0.09、肌力 g=0.12：確認，文章「跳躍和肌力幾乎沒變」正確（作者稱 negligible）。
- 滾後：肌肉痠痛感 g=0.47：確認，文章「感受到的痛減輕了（效應量 0.47）」正確。
- "there is no concrete evidence proving that the release of trigger-points makes FR effective"：逐字正確。語境是解釋滾前衝刺進步的機制，作者稱該解釋 "highly speculative"。文章用在「滾筒為什麼可能有效」，在方向上沒有走樣。作者在滾後痠痛段另有一句相近的 "no concrete evidence for the effectiveness of brief rolling massages for trigger point therapy"。
- 筋膜變形壓力大於滾筒通常能施加（Schleip 2003）：確認，文章標為「引用文獻指出」，正確。
- 暖身或安慰劑效應可能是原因：確認。
- 滾筒是否真的放鬆筋膜：文章說「尚未被證實的假說」。Konrad 2022 的 "Although it is not clear if foam rolling releases myofascia" 支持這個說法。
- 問題見 M3。

### Santos 2024
- 6 項、無法合併：確認。
- 只有 2 項 RCT 顯著（髕股疼痛 Kumar MD 2.4；慢性頸痛 Cabrera-Martos MD 2）：確認。
- 唯一下背痛試驗 Ozsoy 2019，42 人，68.09±2.77 歲，核心穩定運動＋熱敷＋TENS 加滾筒，休息 MD −0.2（−0.96 到 0.56）、活動 MD −0.36，無顯著差異：確認。
- 結論 "do not elucidate or reinforce the clinical use of FR in pain intensity"：文章寫「不足以支持在臨床上使用」，語氣相當，可接受。
- 補充事實：兩篇有益的試驗都是滾筒加運動計畫相對於另一種處理，而不是單獨滾筒；PEDro 平均 6±1.29，沒有一篇有盲法。原文也說 Hameed 與 Yokochi 的 PEDro 是審查者自評。文章沒寫這些，不算錯。
- 利益揭露：作者群有兩位是該期刊 associate editor。文章未提，不影響事實。

## 五個英文引號句（en 版）逐字核對

| # | 句子 | 位置 | 結果 |
|---|---|---|---|
| 1 | "we are not suggesting exclusion of stretching or foam rolling from training routines" | Warneke 4.4（文章 L55、L104 兩處引用） | 逐字正確 |
| 2 | "there is no concrete evidence proving that the release of trigger-points makes FR effective" | Wiewelhove，Pre-rolling 段 | 逐字正確 |
| 3 | "rather minor and partly negligible" | Wiewelhove，Limitations 段 | 逐字正確，語境見 M3 |
| 4 | "limited and inconsistent" | Konrad 2022 前言 | 逐字正確 |
| 5 | "demonstrates superior effectiveness for pain relief" | Guo 結論 | 逐字正確 |

zh 版只有 1 和 2 兩句保留英文，其餘改成中文轉述，zh 與 en 的主張一致。

## 兩條限定語氣的檢查

- 「獨立重複驗證看起來還不多」：文章寫成「這方面獨立團隊的重複驗證看起來還不多，這是我的判斷」，明確標為作者判斷，格式符合。事實基礎（Behm 重複出現）已核對。這句不是查證到的主張，也沒有做獨立團隊文獻盤點。建議維持現狀，不要升格。
- 「傷害預防在我查的範圍內沒有可讀證據」：tldr、L33、L92、L108 都有限定語，zh 與 en 皆有。這條通過。注意 L92 的「三種方法，我都沒有讀到可用的證據」與 L108 已說明未讀的是 Thacker 2004、Herbert 2011，沒有誇大。證據紀錄還提到 Lewis 2014 也沒讀，文章沒點名，不影響。
- 「放鬆筋膜」在 tldr 與 L33 也放在「我查的範圍內」之內，通過。

## 其他檢查項

- 歸屬標籤：zh 全文出現「作者」19 次，多數是轉述該篇作者本人的話或推測，並非研究者姓名當主詞的歸屬標籤。真正的歸屬標籤（「Konrad 等人」「Warneke 等人」「Wiewelhove 等人」「Santos 等人」「Guo 等人」）每段一次，已經超過 3 處。這是風格問題，交給 post-polish，不算事實錯誤。
- 只讀摘要的來源是否被當全文用：Konrad 2024 Sports Med 兩版都沒有引用也沒有描述。Warneke Sports Med Open 只讀到摘要、方法、品質與結論，文章用的都在這個範圍內。
- 體脂與減重詞搜尋（L95）：我沒有對七篇逐一重做這項搜尋，所以這條維持「未獨立重驗」，沿用 evidence.md 的紀錄（搜尋七篇全文前 85%，Konrad 2024 Sports Med 不在內）。
- 表格「核心：我沒有讀到」急性效果：與 evidence.md 一致，是誠實的未讀聲明。
- 兩個版本的數字與主張在抽查範圍內一致（Konrad 2024、Warneke 兩篇、Wiewelhove、Santos、Guo 的數字與限定語兩邊對應）。

## 建議修改清單（供主代理決定）

1. L75 zh/en：「功能也類似」改為「功能也都有進步」，並視需要加註作者說阻力訓練在功能上最好（M1）。
2. L53 zh/en：38 項與 34 項分開寫（M2）。
3. L63 zh/en：補 Wiewelhove 的「但在柔軟度與痠痛感上可能有意義」，衝刺那句加 4 項研究限定，「無法下定論」改為「作者提醒要謹慎」（M3）。
4. L92 zh/en：Warneke 沒分析的是背痛與其他益處（如肌肉肌腱傷害減少）（M4）。
5. L57 zh/en：Konrad 2022 的利益聲明需到出版社頁核對，或限縮句子（U1）。
6. 可選：L67 補 ≤4 週只有 3 項；L53 補摘要與內文評級差異一句。

範圍聲明：本報告只檢查文中已提出的宣告，不評估文章沒寫的內容，也不處理文筆、結構與覆蓋（交 post-polish 與 post-review）。Konrad 2024 Sports Med 因文章未引用，未重新查證。

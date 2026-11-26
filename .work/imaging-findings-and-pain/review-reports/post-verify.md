# post-verify：imaging-findings-and-pain（認識人體 order 15）

查證日期 2026-10-25。對象：zh `2026-10-25-imaging-findings-and-pain.md`、en `-en.md`。

## 實際取得的來源
| 來源 | 取得 | 程度 |
|---|---|---|
| Teraguchi 2026（PMC13152712） | Groundlane web_fetch，Europe PMC fullTextXML | 全文（摘要、方法、結果、討論、限制、表 1-3）；補充表沒讀 |
| Ibounig 2025（PMC11697641） | 同上 | 全文；補充表／圖沒讀 |
| Brinjikji 2015a（PMID 25430861） | Europe PMC REST search（resultType=core）重取 | 僅摘要。Europe PMC 標 isOpenAccess=N |
| Brinjikji 2015b（PMID 26359154） | 同上 | 僅摘要。同樣 isOpenAccess=N |

## 結論摘要
- Contradicted：1 項（許特爾氏結節譯名查無使用）
- Misframed：4 項
- 小修／建議：3 項
- 其餘 Confirmed

## Contradicted

### C1. 「許特爾氏結節（Schmorl node）」譯名查無
- zh 第 79 行。evidence.md 也自承「未在樂詞網核對」。
- 我用 Groundlane web_search 搜「許特爾氏結節」，沒有任何結果使用這個詞。實際通行的有：許莫氏結節（繁簡中文都見，如 ReadYourLab、百度百科、香港商報）、薛門氏節點（台灣皮膚科醫師部落格）。英文通用 Schmorl's node(s)。
- 沒有查到官方（國家教育研究院樂詞網）定名，所以不能說哪個是標準。但「許特爾」我找不到出處，可能是自己造的音譯。
- 建議：改成「許莫氏結節（Schmorl's node）」，或第一次出現附英文並寫一句白話（髓核壓進相鄰椎體的小凹陷）。改完去樂詞網／台灣醫學會名詞核對一次；找不到官方定名就保留英文括號。en 版用 Schmorl nodes，不受影響。

## Misframed

### M1. 「三份研究」與實際四篇
- zh 第 8、9、37、108、110、123 行；en 第 8、9、37、108、110、123 行。
- 文章參考資料有四篇、內文也連結四篇。「三份」是把 Brinjikji 兩篇當成「脊椎」一組，算法在 evidence.md 有寫，但讀者看不到，會以為少了一篇或漏讀。
- 另外「我讀的三份研究都指出，退化樣的發現在沒有症狀的人身上也很常見」：Brinjikji 2015b 的設計是比較有痛與沒痛的年輕人，摘要背景句才說兩者都常見，主結果是「有痛者較常見」，不是在證明沒症狀者常見。
- 建議：改成「四篇研究，分成脊椎（兩篇回顧）、日本社區、肩膀三組」，或在第一次出現時一句交代「脊椎部分是同一組作者的兩篇」。「三份都指出」改成「這幾篇裡，多數指出…」或拆開：脊椎 2015a、Teraguchi、Ibounig 指出常見；2015b 指出有痛者部分發現較常見。tldr 與 description 一併改。

### M2. Teraguchi 多變項調整因子的列法與原文不一致
- zh 第 79 行（「同時考慮年齡、性別、肥胖、疼痛強度、體能表現等因素」）；en 第 79 行同。
- 摘要寫的模型：age, sex, obesity, metabolic factors, pain intensity, physical performance, and MRI phenotypes。但結果內文寫 "multivariable logistic regression adjusted for age"，表 3 實際列的是性別、抽菸、飲酒、開車、搬重物、肥胖、高血壓、血脂異常、血糖耐受不良、代謝組合、三個 MRI 變項，沒有年齡、疼痛強度、握力或步速。原文自己前後不一致。
- 文章採摘要版本，把它說成既定事實。
- 建議：改成「同時考慮年齡、性別、肥胖等因素（摘要另列疼痛強度與體能表現，但表 3 沒有顯示這些變項）」，或只寫「同時考慮性別、肥胖、生活習慣與代謝因素」並註明年齡調整依內文。可保守寫「作者說已調整年齡等因素」。

### M3. Teraguchi：只講調整後無關聯，省略未調整時的差異，且 ODI 的循環問題只講一半
- zh 第 77–85 行；en 對應段。
- 原文結果：未調整時，椎間盤退化在失能輕微組較高（95.4% vs 91.5%，p<0.05），許特爾（Schmorl）結節在失能輕微組較少（32.9% vs 45.7%，p<0.001），Modic 變化 p=0.07。文章只寫調整後「沒有獨立關聯」，沒提 Schmorl 結節的未調整差異。讀者可能以為三項影像發現在各組完全沒差。
- 文章已說握力、步速不是獨立驗證，但作者「ODI 更能區分功能狀態」這句本身也有循環：分組就是用 ODI 切的，ODI 區分功能狀態是定義使然。作者在討論段只承認握力與步速是 "complementary descriptors"，沒有點出 ODI 本身。文章第 83 行「功能面的指標（ODI、步行速度、握力）」把 ODI 一併當成作者的發現轉述，沒補這點。
- 建議：加一句「未調整時 Schmorl 結節在失能較明顯的人較常見，調整後就看不出獨立關聯」；並把「ODI 更能區分」改為「ODI 本來就是分組依據，所以這不是獨立的證據」。

### M4. Ibounig：「年齡影響沒那麼大」缺了同一份回顧的相反句
- zh 第 104 行；en 第 104 行。
- 原文 Discussion："Unlike findings related to the glenohumeral joint, age did not appear to have as large an impact on prevalence." 文章轉述正確。但結果段另有一句 "Overall, the data suggest a trend of increasing prevalence with age"，且唯一的人口研究平均 65 歲，其他研究平均 41 歲。文章用 20 個肩膀、85–95% 對比其他族群 6–82%，沒告訴讀者兩邊年齡差一大截，容易讓人把差距歸成「方法」而不是「年齡」。
- 建議：加「人口研究的參加者平均 65 歲，其他研究平均 41 歲，這個差距可能是數字差很大的原因之一」，並把「年齡影響似乎沒那麼大」改成「作者說影響不如盂肱關節大，但結果段仍看到隨年齡增加的趨勢」。
- 同段「有症狀與沒症狀差不多」：原文是敘述性比較，只有 10 篇（AC OA 7 篇，鈣化 8 篇左右）同時含兩組，其中只有 6 篇清楚說明是同一批人或不同人，4 篇沒交代。文章寫「往往差不多」沒有錯，但建議補「這個比較是敘述性的，沒有統計檢定，且只有部分研究」。

## 小修／建議

### S1. Brinjikji 2015b 的「年輕」
- zh 第 63、69、113 行與 tldr；en 第 63、69、113 行與 tldr。
- 摘要是 "adults 50 years of age or younger"。文章 zh 寫「50 歲以下」，en 寫「50 or younger」，兩邊並不矛盾，但「年輕人」「年輕的下背痛者」把 50 歲上限的成人稱為年輕，對 45–50 歲的讀者可能走樣。建議全篇統一「50 歲以下的成人」。zh 的「50 歲以下」嚴格說應是「50 歲以下（含 50）」，可寫「50 歲或更年輕」。

### S2. Brinjikji 2015b 未提中央椎管狹窄的信賴區間
- 第 67 行。文章寫「沒有看到差別，包括…中央椎管狹窄」，原文 OR 20.58（0.05–798.77），區間極寬，等於幾乎無資訊。文章已寫「不等於證明沒有關係，可能是樣本不夠」，足夠，不必改；若要更準確可補一句「中央椎管狹窄的區間從 0.05 到近 800」。

### S3. Teraguchi 的 63.0% vs 63.4%
- 文章寫「約六成三」，兩個數字都能涵蓋，沒有問題。evidence.md 已記錄。若要寫出精確值，用內文 220/347 = 63.4%（我算過，220/347 = 63.40%），摘要的 63.0% 是原文不一致。

## Confirmed（逐項核對通過）
Brinjikji 2015a（摘要重取）：33 篇、3,110 人、CT 或 MR；椎間盤退化 37%→96%；膨出 30→84；突出 29→43；纖維環裂縫 19→29；"likely part of normal aging and unassociated with pain"；"must be interpreted in the context of the patient's clinical condition"。文章的「很可能」標為作者推論也對。
Brinjikji 2015b（摘要重取）：280 篇中 14 篇符合；3,097 人、1,193（38.6%）無症狀；6 項較常見（膨出 7.54 [1.28–44.56]、峽部裂 5.06、擠出 4.38、Modic 1 4.01、突出 2.65、退化 2.24 [1.21–4.15]）；5 項無關聯（任何 Modic、中央椎管狹窄、高強度區、纖維環裂縫、滑脫）。文章六項清單與五項清單與摘要一致。
Teraguchi 全文：866 人（平均 66.4 歲）、347 人有下背痛（"1-month duration"，問句為 "on most days during the past month"）；ODI ≤20% 的 220 人；椎間盤退化＝任一節 Pfirrmann 4 或 5 級；表 2 四組 91.5／95.4／88.6／87.4（欄序：有痛失能、有痛無失能、無痛失能、無痛無失能）；OR 1.19（0.46–3.08）；MC 0.80、SN 0.83；作者的五項限制與文章列的一致；"complementary descriptors … rather than independent validators"。
Ibounig 全文：31 篇（4 X 光、11 超音波、15 MRI、1 兩者）；人口研究 20 個肩膀；AC OA 85% MRI／95% X 光；其他族群 6–47%、1–65%、0–82%；"very low" 與其原因；"Clinical diversity precluded pooling"；"clinicians should exercise caution…"；影像建議句；肩峰下鈣化唯一例外（人口研究 5% vs 20%；全部 5–25% vs 20–39%）。

## 專項問題回答

1. **Teraguchi 是橫斷式還是世代？** 文章寫橫斷式是對的。原文方法段第一句 "This cross-sectional study was performed using a subcohort from the second visit of the ROAD study"；ROAD 本身是前瞻性世代，但這篇分析只用第二次回診的一個時間點，並在限制段明講 "the cross-sectional design precludes causal inference"。規劃表（`.work/research/human-body-basics/scan/C-posture-pain.md` 第 28 行）寫「世代研究」是把資料來源當成設計，規劃表應更正。文章第 12 行詞彙表與第 66 行也沒有把它當世代，無須改。
2. **63.0% vs 63.4%：** 摘要 Results 寫 63.0%，摘要 Methods 與結果內文寫 63.4%（220/347 = 63.4%）。文章「約六成三」安全，見 S3。
3. **Brinjikji 兩篇是否標明僅讀摘要：** 是。zh、en 內文都有（zh 第 55、69、138 行；en 第 59、69、138 行），參考資料兩條都有「（僅讀摘要）」。重取的摘要與文章轉述一致。文章說 2015a「不是開放取用」：Europe PMC 的 isOpenAccess 欄位是 N，但 PMC4464797 是作者手稿，有免費全文頁，所以「不是開放取用」的說法其實可以改成「我沒能取得全文」。以我查的範圍，2015b 也有免費的 PDF 連結（ajnr.org，Unpaywall 標 Open access）。建議把「它不是開放取用」改成「我這次沒有取得全文」，避免與 Europe PMC 的免費全文連結矛盾。zh 第 55 行與 en 第 59 行都要改。
4. **許特爾氏結節：** 見 C1。
5. **「三份研究實際引用四篇」：** 見 M1。算法（Brinjikji 兩篇併為脊椎一組）能自圓其說，但文章裡沒交代，且 2015b 的設計與其他不同，不宜與「沒症狀者也常見」的敘述綁在一起。
6. **是否把盛行率寫成因果：** 沒有。全文明確區分盛行率與因果（第 25–29 行「先分清兩個問題」），Brinjikji 的 "likely" 標為作者推論，Teraguchi 標為橫斷式，Ibounig 的建議標為作者建議。唯一要留意的是 tldr 與正文的「報告沒有意義」「關聯有限」：「關聯有限」是整體概括，Brinjikji 2015b 其實發現多項有關聯（OR 最高 7.54），建議 tldr 改為「有些發現較常見，有些看不出差別」。

## 中英一致性
- 數字、研究名、僅讀摘要標示兩版一致。
- en 第 8、9、37、108 行同樣有「three studies」，與 zh 同步需改。
- en 第 59 行「It is not open access」與 zh 第 55 行一致，同步改（見問題 3）。

## 範圍聲明
只檢查文中已提出的宣告。未檢查：補充表（Teraguchi 補充表 1-2、Ibounig 補充表）、Brinjikji 兩篇全文、攀岩與脊椎連結文章的內容、就醫警示段（文章已聲明非來源內容）、一般流病概念說明（盛行率、橫斷式、勝算比、系統性回顧定義）的精確措辭。「許特爾氏結節」只用 Groundlane web_search 搜尋，沒有查到官方詞庫（樂詞網）。

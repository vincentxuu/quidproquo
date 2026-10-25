# post-verify：motor-learning（認識人體 order 11）

查證日期 2026-10-25。檔案：`src/content/posts/learning/2026-10-25-motor-learning.md`、`-en.md`。

## 來源取得程度（Groundlane web_fetch，Europe PMC fullTextXML，extract=full）

| 來源 | 取得 |
|---|---|
| Czyż 2024 Sci Rep（PMC11237090） | 前 10 萬字元（截斷在參考文獻）。摘要、方法、結果、討論、限制、結論、利益聲明皆讀到 |
| Czyż 2024 Front Psychol（PMC11349744） | 全文 69,813 字元，未截斷 |
| Tassignon 2021（PMC8138164） | 前 10 萬字元，摘要、結果、討論、限制皆讀到；表 1 讀到 feedback 欄 |
| Hassar 2026 | 只取得 Europe PMC 的書目與摘要（isOpenAccess N），與文章「僅讀摘要」一致 |
| 額外：Ericsson & Harwell 2019（PMC6824411） | 取到前 10 萬字元，用來驗證「一萬小時」是否真的找不到免費全文 |

## Contradicted

無。

## Misframed

1. **tldr（zh L9／en L9）與導言（zh L37／en L37）：「練習當下表現較差」被寫成這兩份統合分析的發現。**
   兩份分析都只納入延遲（24 小時以上）的保留／遷移測驗（A：「Only delayed retention testing results were included」；B：「only delayed transfer results were considered」），沒有合併練習階段（acquisition）的效果量。「隨機穿插練習當下較差」只出現在引言對 Battig 1966 與 Shea & Morgan 1979 的敘述裡。
   建議改法：tldr 與導言改成「經典研究（Battig、Shea & Morgan）報告隨機穿插練習當下較差、之後較好；兩份統合分析檢驗的是後半，只合併 24 小時以上的保留與遷移測驗」。正文 L53 的引句本身已標明出處，沒問題。

2. **tldr／導言：「成人在實驗室裡……」把兩個獨立的子分析併成一格。**
   原文是分別對「場景」（實驗室 0.92，實際 0.23 不顯著）和「年齡」（成人 0.63、60 歲以上 1.45、兒童青少年 0.02）做子分析，沒有「成人 x 實驗室」的交叉格。作者還承認兩者糾在一起。正文 L57-L62 寫得對，但 tldr 和導言的措辭暗示有這一格。
   另外，保留篇討論段自相矛盾：一句寫「成人在三層模型差異不顯著、在隨機效應模型顯著」，結果段與摘要卻給成人 0.63 (0.30, 0.96)。文章沒寫這個矛盾。建議在「年齡」那條補一句「作者的討論段對成人是否顯著前後說法不一」，或至少 tldr 改成「成人與實驗室的研究合併後偏向隨機穿插」。

3. **zh L71／en L71：「還有結論不同的分析」（Ammar 2023）。**
   - Czyż 兩篇都說明 Ammar 的範圍是 "sport settings"，結論是效果小且不顯著、稱 CI 為 "a myth"。Czyż 自己在實際場景的結果（0.23，不顯著）方向和 Ammar 並不衝突，真正不同的是整體合併值（Ammar 小、Czyż 0.63 中等）。小標「結論不同」會讓讀者以為 Ammar 否定了實驗室結果；這點兩邊都沒有證據。
   - 「並批評它的方法」偏輕。保留篇的原文是 "poorly performed"、"cannot be considered reliable and valid"，理由是只搜了出版社資料庫 Taylor & Francis、沒搜 EBSCO、未預先註冊（遷移篇另補：沒說明如何處理依賴效果量）。
   - 這是 Czyż 團隊對競爭性分析的評語，利益相關，文章只說「我無法判斷誰比較對」而未點出作者是當事方。
   建議改法：標題改「還有整體結論較弱的分析」，補「它只涵蓋運動場景；作者批評它資料庫選擇與未預先註冊，但這是被它挑戰的一方的評語」。zh 的描述「結論較弱」本身可接受，Ammar 的轉述沒有造假，但歸屬到 Czyż 兩篇（兩篇都有）更精確。zh 與 en 一致。

4. **zh L77／en L77：差異學習的 0.26 與 0.61 沒寫出分母。**
   「27 項研究、31 個實驗」是全部納入數，但保留階段只有 12 個實驗（原文 "only 12 experiments documenting outcome measures in the retention phase"）；練習階段是 post-pre，保留是 retention-pre。對照組多半是傳統重複練習加糾正回饋（TL），並非泛稱的「其他練法」。建議補「保留階段只有 12 個實驗」與「對照多為傳統重複練習」。
   - 效果量 0.26 vs 0.27：摘要與討論段是 0.26 [0.10, 0.42]（討論另一處寫 0.27 [0.12, 0.42]），結果段是 0.27 [0.12, 0.42]。文章用 0.26 有依據（摘要）；0.26 的信賴區間也應是 0.10 到 0.42，與摘要一致。這是原文內部不一致，不算文章錯。建議 evidence 保留記錄，正文不必改，除非想標明「摘要 0.26，結果段 0.27」。
   - 「保留中等 0.61」原文 [0.30, 0.91]，正確。I² 摘要寫 77%／79%，文章未引，沒問題。
   - 「多數實驗出自同一研究團隊」：原文有兩處，一處是整體限制（"most of the experiments were carried out by the same research group"），一處是技術性技巧子群組（"mainly encompassed studies from one research group"）。文章寫在後者，正確。

5. **zh L94／en L94：Hassar 2026 摘要轉述少了一半。**
   摘要原文：「Local neuromuscular fatigue appears most likely to disrupt acquisition **and sometimes retention**, whereas cardiovascular exertion may support learning or consolidation in some contexts…」。文章寫成「局部肌肉疲勞最可能干擾練習階段」，漏了 "and sometimes retention"，讀者可能以為保留不受影響；摘要還說保留的發現 "variable"。此來源只讀摘要這點，文章已在正文與參考資料標明，這項合格。建議補「有時也影響保留」。

6. **zh L9、L37、L89-L93／en 對應處：「免費來源」的範圍說得比實際搜尋大。**
   實際只做過 Europe PMC 的題名搜尋（精讀紀錄自己也承認沒搜 Macnamara 2014、沒試別的來源）。L89 有寫「在我查的範圍內（用 Europe PMC 搜尋開放取用文獻的標題）」，但 tldr 與導言寫「我在免費來源讀不到可驗證的依據」，沒有這個限定。
   更重要的是，同一個資料庫用題名查 "deliberate practice" 就有免費全文：Ericsson & Harwell 2019（PMC6824411，Front Psychol，直接討論 Gladwell 把 Ericsson 1993 寫成「一萬小時」的出處，並說 "there was no evidence for a magical number"）、Macnamara & Maitra 2019（PMC6731745，R Soc Open Sci）。所以「一萬小時」那條寫「沒有讀到相關來源」在這個範圍內不成立，是搜尋詞選擇造成的。
   建議改法：二擇一。(a) 把一萬小時改成讀這兩篇再寫，因為它們剛好能回答「這個說法的出處和限定」；(b) 若不讀，L91 改成「我只搜了 'motor learning' 相關題名，沒有搜 deliberate practice 這條文獻；Europe PMC 上有 Ericsson & Harwell 2019、Macnamara & Maitra 2019，我沒讀」，tldr 與導言把「免費來源」改成「我查的那幾個題名」。
   - 「肌肉記憶」：題名搜尋結果我沒重跑，但該條已寫「沒讀」，限定足夠。
   - 「重複練習才能自動化」：我用 Europe PMC 題名查 practice+automaticity+motor（OA）得到 0 筆，與文章「這篇只比較了練習怎麼排，沒有檢驗自動化」並不衝突；這條本身只是範圍聲明，合格。

## Confirmed（逐項核對原文）

- Czyż 保留篇：54 項、2,068 人、194 個效果量；整體三層模型 SMD 0.63 (0.33, 0.93)；去 10 個離群後 0.43 (0.19, 0.67)，作者稱 small；實驗室 n=30、0.92 (0.48, 1.36)、顯著；實際場景 n=24、0.23 (−0.16, 0.62)、p=0.24；年齡 moderator F(2,189)=1.69, p=0.19 不顯著；60 歲以上 1.45；青少年 0.02；總 I² = 90%；3/54 達 moderate 或 high（Quality Assessment Tool = EPHPP）；"Unfortunately, studies on the CI effect are of poor quality"；摘要 "almost negligible"；結論 "robust phenomenon" 但 "primarily based on laboratory studies in adults and older adults"。文章忠實。
- 「60 歲以上全在實驗室；青少年 1 項在實驗室、其餘 400 人在實際場景」：原文逐字吻合。
- 「一個回顧拆成兩篇」：兩篇都寫 "split into two consecutive papers"，註冊號同為 CRD42021228267，作者群同（Czyż、Wójcik、Solarská；保留篇加 Kiper）。兩篇設計與同團隊的說法成立。保留篇寫 PROSPERO，遷移篇「Systematic review registration」寫 clinicaltrials.gov，文章沒寫註冊平台，沒有問題。
- 「兩份不是兩個獨立團隊互相印證」：成立。兩篇都來自同一經費與同一作者群，文章的限定到位。
- 遷移篇：34 項、1,421 人、86 個效果量；0.55 (0.25, 0.86)；實驗室 0.75 顯著、實際 0.34 不顯著；"None of the included studies was assessed as strong"（另有 2 篇 moderate，文章未寫，可不補）；任務清單含排球、高爾夫、網球、曲棍球、籃球、步槍射擊、腹腔鏡、書寫，無攀岩；逐字檢查全文沒有 "climb"。
- 「保留是學習的好指標，遷移是適應力的好指標」：遷移篇原文 "Retention is a good indicator of learning, whereas transfer is a good indicator of adaptability (Magill and Anderson, 2021)"。文章標「轉述教科書的說法」，沒用引號，合格。
- 1966／1979：保留篇引言 Battig（verbal learning）1966、Shea & Morgan 1979 為第一個動作任務研究。L53 的引句其實是 Czyż 對 Battig 的轉述（"Battig noted that random practice condition hinders…"），文章寫「回顧的原文」，正確。
- Tassignon：定義句與 "inferences about the effectiveness of DL would be premature" 逐字吻合；定義出處是 Schmidt & Lee 2013（文章「引用教科書的定義」正確）；DL 定義含 "no exact repetition…without corrective feedback"；27 篇／31 個實驗／897 人。
- 「我自己的讀法」（L81）：標得清楚，「不是作者的結論」明講，且位置獨立成段。事實基礎成立：表 1 多筆 DL 組 "feedback: no"，對照 TL "feedback: yes, corrective instructions"。另外作者在討論 Beckmann 2006 vs Hossner 2016 時確實說 "Differences in the application of feedback and demonstrations probably contributed"，所以這是有作者側證的推論，沒有被包成作者結論。一個提醒：無糾正回饋本來就是 DL 的定義成分，所以這比較像「兩組差別打包在一起」，而非「混淆」；現在「可能混著回饋的差別」措辭可接受。

## 其他檢查

- zh 與 en 主張一致：兩版數字、限定語、結構逐段對應，沒有發現一邊有、一邊沒有的主張（上述各項問題兩版同樣存在）。
- 歸屬標籤：正文中對作者的歸屬（作者寫道／作者提醒／作者自己的結論／作者提到）約 7 至 8 處，超過簡報建議的 3 處。多數是必要的區分（作者結論 vs 本文解讀），但 L68-L73 一段可合併。屬風格，非事實。
- 「只讀摘要」的來源是否被當全文用：Hassar 只用一句、沒引數字、參考資料標「僅讀摘要」，合格；缺的是上述 Misframed 5。
- 「沒有／找不到 X」是否限定範圍：L89 有，tldr 與導言沒有（見 Misframed 6）。

## 範圍聲明

只檢查文中已提出的宣告。沒有重讀 Sci Rep 全文後段（系統性回顧段與表 1 後半，被 10 萬字元上限截掉）、補充表與 OSF 附錄；沒有讀 Ammar 2023 原文、Brady 2004、Hassar 全文。沒有核對 glossary 的定義是否與其他站內文章一致，也沒有跑 lint、astro check、verify。

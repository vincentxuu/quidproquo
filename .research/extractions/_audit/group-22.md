# 抽查第 22 組（batch3-files.txt 第 1–10 行）

抽查日期：2026-10-14。亂數：每份以紀錄檔名當 `random.seed`，從「結果（逐項）」裡帶數字的條目抽 3 項（`python3 -I -c`）。各份的抽樣母體：

- alfieri2013：#1–17（#18 沒有數字）
- brame2016：#1–5、#7、#11
- carpenter2017：#1–5、#9、#10
- carpenter2018：#1–11
- cooper2018：#1–10
- fyfe2019：#3、4、5、9、11、13、14、16、18、20（理論文，只有這些條目帶年份、頁碼、階段數之類的數字）
- geller2017：#1–11
- guo2014：結果沒有編號，我把帶數字的陳述依序編成 a–o，共 15 項
- guo2020：#1–9
- harley2020：#1–24。全文只有 8 人與 26% 兩個數字，所以從全部條目抽，另外加核 8 人

另外每份都從「已發佈文章引用核對」抽一行，回文章現檔與原文確認紀錄的判斷（表格最後一欄之前的「引用核對」欄）。

| 檔名 | 三個抽到的條目與核對結果 | 讀取涵蓋 | 來源版本 | 引用核對抽一行 | 判定 |
|---|---|---|---|---|---|
| alfieri2013-case-comparisons.md | **#5 fail-safe 2,795／5,244**：txt L2703–2705 照抄句一致，p.103（PDF 第 18 頁右欄），對。**#8 原則之前／之後／沒給**：PDF 第 18 頁 Table 4 逐格對過，.37 [.24/.50] k56、1.18 [.93/1.44] k28、.47 [.41/.54] k250、Q 31.90、之前對沒給 1.84，對。紀錄同列另寫「29 個比較全部來自 Schwartz & Bransford 1998」，對照 txt L3305–3307「29 comparisons from three experiments」，也對。表上 k = 28、正文寫 29，是原文自己的出入，紀錄兩個數字都照抄了，但沒有列進「不一致」一節（小事）。**#10 延遲**：Table 4 立即 .57 [.50/.64] 254、同日 .44 [.25/.64] 21、隔日 .22 [.11/.34] 58、Q 27.32、立即對隔日 27.21，對。 | 七段 L1–600→…→L3555–3788，首尾相接，合計 L1–3788 等於 `wc -l` 3788。Table 1 沒有對 PDF，紀錄有聲明。小差異：檔頭寫「138,403 字元」，其實是位元組數（`wc -m` 137,651）。 | Taylor & Francis 刊出版（有「Downloaded by University of Pittsburgh」下載戳記），放在共同作者 Schunn 的 LRDC 論文頁，原址已 404，取自 Wayback 快照。**有疑慮，紀錄沒有提**：T&F 的分享政策只允許作者在個人網站放 AM，不允許放 VoR（authorservices.taylorandfrancis.com/research-impact/sharing-versions-of-journal-articles/）。實際取得管道又是第三方存檔站（archive.org）。疑慮類型和 Carpenter 2018 一樣。 | 文章 L82「摘要的結論是比較兩個案例勝過一次看一個」：紀錄判「大致一致但不完整」。我讀了 txt L55–66 的摘要，裡面列出 sequential、single case、nonanalogous、traditional instruction、control，d = .50，所以紀錄判斷正確。 | 通過（來源版本有疑慮） |
| brame2016.md | **#2 每支 ≤ 6 分鐘**：t1.txt L111「Multiple videos for a lesson, each ≤ 6 minutes」，對。**#3 轉述 Guo**：L149 有 6.9 million、<6 分鐘接近 100%、9–12 分鐘約 50%、12–40 分鐘約 20%、最大中位投入時間 6 分鐘，照抄句一字不差，對。**#4 Risko 1 小時影片**：同在 L149，「1-hour videos」、分心增加、記憶下降，對。 | L1–277 依序分段，首尾相接，等於 `wc -l` 277；38,521 是位元組數，和 `wc -c` 一致。 | PMC 刊出版，CC BY-NC-SA 3.0，合法。 | 文章 L256「Lawson 等 2006：附 8 個引導問題的班級測驗較高」：t1.txt L160 是「eight guiding questions … scored significantly higher」，紀錄判「一致」，正確。 | 通過 |
| carpenter2017-video-prequestions.md | **#1 事前答對率 5%**：preq.txt L248「only 5% on average」，對（紀錄寫 L247–249）。**#3 整體 .57 vs .38**：L266–267，M = .57 SD .18、M = .38 SD .20、t(83) = 4.61、p < .001、d = 1.00，對。**#5 未問內容**：L216–220，t(83) = 2.47、p = .016、d = .54，提問組未問題 M = .50（L214），對。都不是表格數字，`-layout` 文字的欄位已逐段拆開確認。 | L1–403 依序讀完，等於 `wc -l` 403，45,129 與 `wc -c` 一致。 | Elsevier 刊出版 PDF，放在第一作者實驗室 Wix 站（filesusr.com），作者本人公開。**有疑慮，紀錄沒有提**：Elsevier 的分享政策（elsevier.com/about/policies-and-standards/sharing）只允許訂閱制文章把 AM 放到個人首頁，不允許放刊出版。這篇和同一作者的 Carpenter 2018（APA，該紀錄自己標了疑慮）情況相同，這份紀錄卻寫成「確認是作者本人公開的版本」，沒有標出來。 | 文章 L158「90 分鐘課堂間隔太久，效果可能變弱」：preq.txt L276–286 是在解釋 McDaniel 等課堂研究的長期效果為何不強時列出的「could include time delays」，紀錄判「大致一致，是推測不是發現」，正確。 | 通過（來源版本有疑慮） |
| carpenter2018-prequestions-classroom.md | **#6 一週後提取練習效果**：txt L674–676，t(149) = 3.21、p = .002、d = .26；t(72) = 2.91、p = .005、d = .34，對。**#9 49% vs 43%、50% vs 44%**：L836–837 照抄句一致，對。**#11 只看全勤者**：註 2，L608–611，79 人與 45 人，結果型態相同，對。 | L1–530、L530–1052，等於 `wc -l` 1052，60,244 與 `wc -c` 一致。這篇沒有表格。 | APA 刊出版，每頁有 APA「not to be disseminated broadly」浮水印，放在作者 Wix 站。紀錄已自己標出疑慮（APA 只允許放 AM，Unpaywall 回 closed），照列。 | 文章 L242「讀前問一題加課後再考，和只在課後考沒有差別」：L688–689 是 p = .06、d = .15（邊緣），紀錄判「應改成沒有顯著差別」，正確。 | 通過（來源版本有疑慮，紀錄已自己標出） |
| cooper2018-diagrams-illustrations-math.md | **#2 表 2 各條件比例**：PDF 第 6 頁 Table 2 是 0.36／0.59／0.41／0.63，對。**#3 圖解 OR 5.94、χ² 27.53**：PDF 第 7 頁正文與 Table 3 都一致，txt L704–705 也一致，對。**#8 表 3 其餘**：Table 3 價值 OR 1.95（p < .001）、能力 OR 1.12（p < .001）、圖解 × 插圖 OR 1.33、p = .69、圖解 × 能力 b = −0.08、p = .06，全部對。 | L1–650、L650–1853，等於 `wc -l` 1853；83,105 字元／83,962 位元組，兩個數字都正確。附錄 A 的題目圖沒有看，表 4、表 B2 沒有對 PDF，紀錄都有聲明。 | Wiley 刊出版，放在通訊作者 Alibali 的 UW 實驗室網站，作者本人公開。**次要疑慮，紀錄沒有提**：Wiley 的自行存檔政策（authors.wiley.com/…/self-archiving.html）只開放送審稿與接受稿，刊出版不在其中。 | 文章 L104「附情境插圖時，能力高者受益、能力低者受害」：PDF 第 7 頁寫 6.39 倍與 0.16 倍（±1 SD），紀錄判「一致，可補插圖含空間關係」，正確。 | 通過（來源版本有次要疑慮） |
| fyfe2019-concreteness-fading.md | **#3 Bruner 1966、三階段**：txt L167–175 照抄句一致，對。**#5 IES 2007、頁 15**：L103–107「(Pashler et al. 2007, 15)」與後續句子一致，對。**#9 四個向度**：L507–523，perceptual：physicality、perceptual richness；conceptual：familiarity、narrative context，對（向度的引言在 L505–507，紀錄寫 L499–523，涵蓋到了）。 | 四段 L1–450→L450–949→L950–1349→L1350–1729，首尾相接，等於 `wc -l` 1729。小差異：76,453 是位元組數（`wc -m` 75,914），紀錄寫成「字元」。 | Indiana University ScholarWorks（第一作者機構典藏）的作者接受稿，合法。 | 文章 L76「理論文章、追溯到 Bruner 1966、只讀摘要與導言」：紀錄判「一致」，正確（原文 L167）。紀錄對 L78 的補充（Fyfe & Nathan 也轉述 McNeil & Fyfe 2012 三步漸退效果最好）我也對過 txt L879–885，屬實。 | 通過 |
| geller2017-prequestions-classroom.md | **#2 課前到課末**：字元約 37,233 起，t(58) = 4.50、p < 0.001、CI [0.058, 0.15]、d = 0.65，對。**#3 課末 postquestion vs 新題**：緊接在後（約 37,400–37,700），t(58) = 1.52、p = 0.13、CI [−0.029, 0.219]、d = .35、BF01 = 3.20，對。**#7 新題迴歸**：約 40,800，「ts < 1.30, ps > 0.20」，對。 | 字元 0–16,000→…→52,000–65,176，首尾相接，等於 `wc -m` 65,176；65,664 是位元組數。全文唯一的表 1 已對 XML 的 table-wrap。 | PMC 收錄的出版者 XML，CC BY 4.0，合法。 | 文章 L242 同上：紀錄判「與 Geller 一致」（每週小考上 p = 0.44、BF01 = 7.20），原文在約 43,800 字元處，正確。 | 通過 |
| guo2014-video-production.md | **b. 只報 1 倍速、占 76%**：guo.flow.txt L375–376 照抄句一致，對。**l. 操作教學影片平均只看 2–3 分鐘**：L633–634 照抄句一致，對。**m. 32% 的影片後面接評量題，看完 30 分鐘內作答**：L315–320，對。 | L1–828 一次讀完，等於 `wc -l` 828。小差異：46,444 是位元組數（`wc -m` 46,224）。Table 1、Table 2、圖 2 已對 PDF 版面。 | 作者研究群網站 up.csail.mit.edu，ACM 會議論文定稿，紀錄已確認位元組與本機檔相同，合法。 | 文章 L229「學生是第一批 MOOC 使用者」：紀錄判「大致一致，原文是 edX 第一批（L658–661）」，正確。 | 通過 |
| guo2020-graphics-reading-meta.md | **#2 範圍 −0.23 到 1.24，以及 g ≤ 0 共 10 個**：txt L1157 對。我另外對了 PDF 第 11 頁 Table 2：0.00 有三個（Coleman A、McCrudden 2011、Reid B），負值七個（−0.08、−0.07、−0.06、−0.05、−0.23、−0.20、−0.02），對（紀錄說這項沒對 PDF，現已對過）。**#4 出版偏誤**：L1169–1179，Egger t = 1.28、p = .21、Trim and Fill 補 7 個後 0.28、CI [0.15, 0.42]，照抄句一致，對。**#7 後設迴歸**：PDF 第 15 頁 Table 4 逐格對過。年級 −0.22／.17、0.01／.95；類型 0.16／.34、−0.07／.71、混用 −0.31／.0388 [−0.59, −0.02]；題型 簡答 0.58 [0.21, 0.96]、混合 0.55 [0.19, 0.90]、選擇 0.16／.38、其他 0.08／.76；殘差 Q 30.34（.40）、I² 8.40%、τ² 0.01。全部對。 | 三段 L1–700、L700–1499、L1500–2349，首尾相接，等於 `wc -l` 2349；95,919 字元／96,673 位元組，兩個數字都正確。 | 取自 ERIC 全文（files.eric.ed.gov），ERIC 不是作者也不是出版者。但檔內是 SAGE 刊出版，首頁標 CC BY-NC 4.0，授權允許轉載，沒有疑慮。 | 文章 L71「好處集中在簡答題」：紀錄判「數字一致，但混合 0.60 也顯著，作者偏好信度解釋」。txt L1747–1758「rather than the nature of the task, we suggest a possible statistical interpretation」，正確。 | 通過 |
| harley2020-instructional-video.md | **#8 影片不應是唯一管道**：t5.txt L80–81「A video should not be the only way to access information.」，對。**#10 沒字幕可能無法播放**：L81 照抄句一致，對。**#11 26% 開字幕**：L81 括號「On our own video channel, 26% of video views are with subtitles」，對，而且確實是 NN/g 自家頻道的數字、不是受試者。加核 **8 人**：L53「a study with 8 participants」，對。 | L1–200 分段讀完，等於 `wc -l` 200；17,189 字元／17,324 位元組，兩個數字都正確。 | NN/g 官網原文，合法。 | 文章 L225「8 個人的質性研究，任務是摺餐巾、架烤爐這類操作」：紀錄判「部分不準，漏了知識類任務、沒交代混合先前研究」。原文 L53 有 ETF、護照文件、線上工具，L54 有「findings from this study as well as from user behaviors observed in past research」，正確。 | 通過 |

## 摘要

- 10 份全部通過：抽到的 30 個條目，加上 Harley 加核的 8 人，都和原文一致；讀取區間都首尾相接、涵蓋全長。
- 10 份的「已發佈文章引用核對」各抽一行，紀錄的判斷都正確。
- 來源版本有疑慮的有 4 份，都是作者自己把出版者刊出版放在個人或實驗室網站，而出版者政策只允許放接受稿：
  - Carpenter 2018（APA）：紀錄自己已標。
  - Carpenter 2017（Elsevier）：紀錄沒有標。
  - Alfieri 2013（T&F，另外是經 Wayback 取得）：紀錄沒有標。
  - Cooper 2018（Wiley）：紀錄沒有標，屬次要疑慮。
- 依抽查說明的字面標準（是否來自作者或出版者以外的網站），只有 Alfieri 的 Wayback 存檔和 Guo 2020 的 ERIC 算第三方；後者有 CC BY-NC 授權，不構成問題。
- 不影響判定的小差異：Alfieri、Fyfe、Guo 2014 的檔頭把位元組數寫成「字元」；Alfieri 的 Table 4 寫 k = 28、正文寫 29 個比較，是原文自己的出入，紀錄沒有列進「不一致」一節。

# 審稿報告：order 8〈「做中學」的證據在量什麼〉

- 審的檔：`src/content/posts/learning/2026-10-14-active-learning-evidence.md`（只有中文稿，依指派跳過中英一致）
- sha256 審前（2026-10-14 12:19:57 CST）：`050d91139603306ad58e2f09cc27aa44a271c0e070d143bc1a5e1a165a696bfe`
- sha256 審後（2026-10-14 12:24:59 CST）：`050d91139603306ad58e2f09cc27aa44a271c0e070d143bc1a5e1a165a696bfe`（相同，審稿期間沒有人改檔）
- 對照用的第 9 篇 `2026-10-13-teaching-text-questions-feedback.md` sha256：`04ef8bf750a92051926c3ad9b849c8b87a18b5eb69fdb4ed23fc06bc9000a583`
- 依據：`.research/2026-10-14-writing-brief.md` 的證據規則；`.research/extractions/articles-that-teach/` 的十份紀錄（freeman2014、kozanitis2022、martella2023、lombardi2021、deslauriers2019、chi2014、thurn2023、koedinger2016、vancampenhout2023、lekshmi-narayanan2025）與 `teaching-text/koedinger2015.md`；`_audit/` group-02、04、05、08、09、14 與 `provenance.md`（這幾份都判通過）。紀錄說不清的地方回原文檔：Martella 折行檔 L401–445、L789–793；Freeman 正文 L127–145 與 SI L80–120；Chi & Wylie L271–420；Van Campenhout L146–153、L268–281。

## 必須修

1. **L205「Martella 等人四次寫『Freeman 說排除了學生不等值的研究』」次數錯。** 原文（`martella2023_springer_pdf_folded.txt`）L403、L409 兩段寫「excluded articles that did not have student equivalence」；L422 寫的是 instructor equivalence，L444 寫的是 examination equivalence；討論段 L791 再總結一次，把三種一起列出。所以「學生等值」是結果段兩次加討論段一次。抽取紀錄 B 節補充敘述的寫法（「原文在 B4、B5、B9、B17 四段各寫一次『…student equivalence』」）本身就有歧義，作者照著寫才錯。建議改成「Martella 等人在結果段兩次、討論段一次寫『Freeman 說排除了學生不等值的研究』」。作者比對出來的實質落差是對的，見下面「需要人判斷」第 2 點。
2. **L172、L283「這些課的練習與單元測驗不計分」與原文不合。** Van Campenhout 原文 L148–151：「While the summative assessments were scored in the courseware, they did not count as part of the course grade.」單元測驗在系統裡有分數，只是不算入課程成績（抽取紀錄 L31 寫的也是「會計分但不算入課程成績」）。建議改成「單元測驗在系統裡有分數，但不算入課程成績；期末考是唯一算成績的考試」。L283 附錄同樣改。
3. **L116 ICAP 表「主動」列的「照唸」會讀成與原文相反。** Chi & Wylie 表 1（原文 L284–288）把「Reading entire text passages silently/aloud」放在 PASSIVE，放在 ACTIVE 的是「Repeating or rehearsing」。中文「照唸」最自然的讀法是照著文字唸出來，那在原文是被動。文章 L211 也寫 Menekse 研究二的被動組是「把文字唸出聲」，同一篇裡前後矛盾。這一欄標的是「依原文的歸類」，建議改成「複誦」。
4. **L139「這兩個例子沒有引用實驗」說得比原文少。** 第二個例子（只聽老師解釋例題的相關性，「may indeed learn better」）引了 McCrudden & Schraw 2007 與 Engle 等 2012（`thurn2023-icap-comment.md` 第 5 項；抽查 group-14 也對過這兩條書目）。紀錄的判斷是「沒有引用直接比較『外顯行為相同、內在處理不同』的實驗」。建議改成「這兩個例子都沒有引用直接比較兩種處理的實驗；第二個例子引了兩篇談『相關性說明』與『擴展式框架』的文獻」，或至少改成「沒有引用直接比較的實驗」。

## 建議修

依重要性排列。前兩項和第 9 篇的分工有關，我認為發佈前應該處理。

1. **規格對照表第一列的判定和第 9 篇說法不同（L235）。** 第 9 篇對同一條「自我檢查需答案或判準，不只寫『想一想』」判「有支持」，依據是 Wisniewski 等 2020 的回饋統合分析。這篇判「這條主要是本站的選擇」。範圍不同（這篇只看自己的來源），但讀者並排看會以為兩篇結論相反。建議改成「就這篇的來源而言，方向和 ICAP 的分類一致、排序證據薄；答案這一半的支持在第 9 篇（回饋統合分析）」。
2. **「可以做的事」第 3 條（L225）和第 9 篇的建議有張力。** 這條說「答案或判準放在附近」。第 9 篇把「節末答案要放哪裡、要不要摺疊」「答案該緊跟題目還是延後」列為研究還沒有答案、建議規格先不規定的五件事之一。這篇的依據是 doer effect 教材的設計，而且自己也說「沒有比過其他擺法」，所以撐不起比第 9 篇更明確的建議。建議把這條限縮成「題目緊接在它考的內容後面」，答案放哪裡改成「見第 9 篇：研究還沒有答案」；不然就明寫這是本站延續現行規格的選擇，不是新依據。
3. **「一個人讀文章，照 ICAP 定義最高到建構」的範圍要再收窄（L32、L120、L258）。** L120 已經標成「我認為」，而且限定在「靜態題目與答案」，推論本身成立：依 Chi & Wylie L453–457，互動要求雙方的發言都主要是建構的、輪替夠頻繁，對象可以是電腦代理人；靜態題目沒有對話對象。但 L32 的表格與 L258 寫成「一個人讀文章」，範圍比 L120 大。本站的文章頁有帶頁面上下文的 AI 聊天側欄（`src/layouts/PostLayout.astro:142–143`，有 `articleSlug` 時渲染 `ChatSidebar`，`page={{ slug, title, term }}`）。照 ICAP 的定義，讀者和這個側欄來回討論文章時，原則上可以落在「互動」，前提是雙方都在建構。建議三處都改成「文章本身的靜態題目，照定義最高到建構；要到互動得有對話對象（ICAP 允許電腦代理人）」，L32 表格那一格也標「我的推論」。
4. **「作者與教材的關係」（L183）沒有推測動機，但有兩處會讓讀者往那邊想。** 整體寫法守住了界線：只列機構、聲明有無，明說不從中推論動機，又把 2025 年那篇定位成「同一個研究圈，不是外部批評者」，這是和證據強度有關的事實。兩處要調：
   - 「任職於**教材公司** VitalSource」：論文只寫作者掛名 VitalSource Technologies，沒有說它是什麼公司（抽取紀錄 L5、L158）。這一段自稱「這些是論文上的事實」，這個描述卻不在論文上。
   - 緊接著寫「也沒有寫明研究的教材是哪家公司的產品」。兩句並排，讀者會自己推出「教材就是 VitalSource 的產品，作者沒說」。抽取紀錄 L179 明寫「courseware 是 VitalSource／Acrobatiq 的產品」要另找來源才能寫。建議二選一：找到合法來源就直接寫明並附連結；找不到就拿掉「教材公司」四個字，只寫「四位作者都掛名 VitalSource Technologies」。
   - 另外，兩篇 ACM 會議論文「沒有利益衝突聲明」：我沒有查 LAK 論文平常有沒有這一節。如果這類論文通常都沒有，單獨點出來會像在暗示省略。可以考慮補半句「LAK 論文不一定有這一節」，或查證後再決定。
5. **L213 兩處位置寫錯。** Koedinger 2016 沒有獨立的限制節（紀錄 L109：「這篇沒有獨立的『限制』節」），「沒有證明因果」寫在導言 L72–74 與討論 L1271–1275。Lekshmi-Narayanan 那句（「could confirm at scale the causal effects」）在 2.1 節相關研究，不在導言（紀錄 L115）。建議改成「兩篇都寫明沒有證明因果」「Lekshmi-Narayanan 等的相關研究一節」。
6. **「都不是花了多少時間」（L187）與「量的是動作次數不是時間」（L257）不完全對。** Lekshmi-Narayanan 2025 的 RQ1 有一個用時間當預測變項的模型（紀錄表 2 第 1–4 項）；Koedinger 2015 也做過初步的時間比較（做活動 21.6 小時、閱讀 25.0 小時）。建議改成「多數分析量的是次數，不是花了多少時間或怎麼想」。
7. **ICAP 表「建構」列的「自己出例子」（L117）不在原文的例子裡。** Chi & Wylie 列的建構活動（L384–398）有概念圖、用自己的話記筆記、提問、出題（posing problems）、比較案例、整合文本、做預測、類比、自我解釋，沒有「自己出例子」。照定義歸進建構說得通，但這一欄標的是「依原文的歸類」。建議換成原文有列的（例如「提出問題、做預測」），或標成我的歸類。
8. **L58「我只引整體效果量，分組數字放在附錄」與 L217 不一致。** L217 在正文用了 Kozanitis 的課程層級與班級大小分組結果。建議把 L58 改成「正文只引整體效果量與兩項和 Freeman 對照的分組，其餘分組數字放附錄」。
9. **L267「I² 64.5%（原文誤標為 τ²）」是抽取紀錄自己算的**（用 (Q − df)／Q 算出 64.5%）。依證據規則要寫成「我從 Q 與自由度算出這是 I²，原文標成 τ²」。
10. **tldr「主動組多半有小組與老師」**：講述組也有老師，「有老師」不是差別所在。正文 L193 的寫法（「主動組常有小組討論與老師回應」）比較準，建議 tldr 跟著改成「有小組討論與老師回應」。
11. **L74「Richard Mayer」**：抽取紀錄只有「Mayer, 2004」。名字本身沒錯，但不在紀錄裡；照規則可以只寫「Mayer」，或回 Martella 的參考文獻確認後保留。
12. **L40「是下面 Lombardi 等人稱為『widely cited』的那一份」**：還沒介紹 Lombardi 就先提到，讀起來繞。建議拿掉，或移到 L80 講 Lombardi 立場的地方（那裡已經引了「solid evidentiary basis」）。
13. **可以補的限制（不補也不算錯）**：Van Campenhout 原文 L278–280 說練習題「Most questions are low level Bloom's questions that target recognition and recall」。這一點直接影響「做練習」能推到哪裡，也和「可以做的事」第 2 條（要讀者產出新東西）有關。
14. **Freeman 與 Martella 的落差可以多補一句**（見下面第 2 點）：教師等值在 Freeman 也是編碼變項，不是排除條件（Freeman 正文 L145；表 1 有 59 個比較「沒有資料或兩組教師不同」）。Martella 討論段 L791 說 Freeman 排除了考試、學生、教師三種不等值。考試等值確實是 Freeman 的門檻（L139），後兩種不是。
15. **「今晚可以做的三件事」第 1 條和第 9 篇的第 1 條方向相近**（第 9 篇：把題目改成「為什麼」或「換個條件會怎樣」；這篇：沒有產出的改成要寫一句話的題目，例子也是「為什麼」）。沒有矛盾，但連讀會覺得重複。可以改成用 ICAP 分類檢查「選項、展開、照抄」這幾種只算主動的題型，和第 9 篇分開。
16. `check-post-quality.mjs` 對 tag `blog` 發出 WARN（標題與內文沒有對應詞）。同系列其他篇如果也掛 `blog`，維持一致即可。

## 沒問題的項目

- **數字核對**：Freeman（0.47、Z、158／67、21.8%／33.8%、338 位聽眾、10%–100%、品質分組 16 個比較與 Q = 2.097、p = 0.553、Egger、trim and fill、離群值、概念量表 0.883 對教師自編 0.441、班級大小、做法分組 Q = 11.173）、Kozanitis（0.489、104／111、15,896、83／28、翻轉 36 與按鍵作答器 30、科目次數、高年級 0.803 對入門 0.425、出版偏誤三項、k 加總 140）、Martella（附錄各百分比、寬鬆算法 5 篇、9.6%、93.1%、45.4%／8.1%、66.9%、62.7%、一致率、4.0% 對 3.4%）、Lombardi（148 篇、53%、30%、六列定義、物理的排除式定義）、Deslauriers（149／157、第 12 週、+0.46／−0.56、穩健標準誤、3.9／2.9、17 人訪談、0.51、65%）、Chi & Wylie（四模式定義、表 3–5 的空格、Menekse 的 8%–10%、目測值有標明）、Thurn（42／120、三個反例、34 條參考文獻、利益聲明原樣）、Koedinger 2016（939、0.195／0.196、0.143／0.181／0.078、10 個比值、中位數 6、Adj R² 0.08）、Van Campenhout（18,546、7 門、14 個期末考模型讀的係數全負 11 個顯著、2.5 倍、1.3–6.2、Stats 0.1027 對 0.1007、45%）、Lekshmi-Narayanan（1,060／694／92、−0.08／−0.09、閱讀次數 −0.27、0.19 對 0.08、表內矛盾）、Koedinger 2015（0.44、六倍多、16%／15%／31%）。全部與抽取紀錄一致；上面「必須修」列的四處除外。
- **英文引文**：「just under half a SD」、Freeman 的「It is an open question…」、「any active learning type and intensity」、「conceptually derived」、「has been validated through a number of classroom and laboratory studies」、「explicitly state」、「No known studies」、「solid evidentiary basis」、「almost certainly」、「widely cited」、「virtually identical」、「We show that this negative correlation is caused in part by the increased cognitive effort」、「some evidence suggesting」、「disjointed and lacking in flow」、「cannot be explained solely by some global student trait」、「conscientious doer/learner」、「does not demonstrate causality conclusively」、「because doing practice causes learning」、「Research on the doer effect has shown it to be causal to learning」、「entirely consistent」、「we failed to identify a doer effect」（摘要原句的前段）、「not convincing」、「may indeed learn better」。逐字與紀錄的原文句相符。
- **推論有標明**：「我從它的附表算出」（概念量表約兩倍、22 個負效果量）、「這個對照是我比讀兩份抽取紀錄得到的」、「我認為不符合這個定義」、「可以做的事」開頭說明依據的性質、限制節列出推論清單。轉引（Mayer 2004、Driessen 等 2020、Menekse 2013、Ziegler 2018）都標了沒讀原文。
- **衝突並列不選邊**：Freeman 對 Martella、定義、ICAP 排序、Menekse 的兩種描述、doer effect 因果、2023 對 2016、課程層級。都寫出兩邊各量了什麼。
- **立場寫對**：Lombardi 不是反方（L80）；Martella 沒有算效果量、不能說半個標準差不可信（L70）；Deslauriers 的「負相關」是條件平均反向，不是學生之間的相關（L103）；Koedinger 2016 只排除了「只有」全域特質（L162）；Lekshmi-Narayanan 不當成對等的反證（L179）。
- **取樣偏誤**：開頭 L22 交代了選法、偏向（英文、大學生、拿得到全文）與沒取得的 ICAP 獨立檢驗。
- **參考資料**：十一筆都有抽取紀錄、DOI 或合法公開網址，並註明刊出版；讀不到的部分寫在括號裡。沒有只讀摘要就列入的。原文檔都在：`.research/raw/learning-content/q3-activity/` 下十份，Koedinger 2015 在 `.work/teaching-text-research/seq/koedinger2015.txt`（45,210 位元組）。
- **本站現況**（12:20 前後核對）：`course-guide-contract.md` 的三條引文逐字相符（L27「附可自行判斷的解釋題或變式題」、L34「自我檢查需答案或判準，不只寫『想一想』」、L54「每個主要小節結尾放一題，附答案或判準」）；「設計依據」（L74–82）確實沒有引 Freeman 這類課堂統合分析；這個檔最後一次 commit 是 9e1170cc（2026-10-14 09:47），工作目錄沒有未提交的改動，「規格沒有因為這篇改動」成立。第 1 篇 g = 0.55（Bisra 2018）相符。
- **站內連結**：五篇 2026-10-13 文章都存在。英文版 `-en` 不存在，是預期的（quality 腳本報 ERROR，就是這一條）。
- **外部連結**（curl，帶瀏覽器 UA）：Springer、Nature 兩個 DOI、ASU、CMU、NSF PAR 兩條、PMC 兩條都是 200。PNAS、ACM、T&F、SAGE 六個 DOI 跟到出版者後回 403；不跟轉址時 doi.org 都回 302，轉到正確的出版者頁（pnas.org、dl.acm.org、tandfonline、sagepub），是出版者擋機器人，不是連結壞了。
- **用語**：`check-tw-terms.mjs` 0 blocking、0 to review。沒看到替換表上的中國用語，也沒有模板化的轉折。標題與 tldr 講的是對象與結論。正文數字密度合理，細節都在附錄。
- **和第 9 篇的分工**：Koedinger 2015 只在 L151 用一段摘要帶過，並連到第 9 篇，沒有重寫；文中問題的實驗留在第 9 篇。規格對照表明說逐條對照在第 9 篇，這篇只看和做中學有關的條文。重複控制得當，張力只在上面建議修第 1、2 條。

## 指派訊息要我特別看的四點

1. **「作者與教材的關係」有沒有越線成推測動機**：沒有越線。只列機構歸屬與聲明有無，明說「我不從中推論動機；可以檢查的是方法」，2025 年那篇的定位也和證據強度直接相關。但「教材公司」這個描述不在論文上，又緊接「沒有寫明教材是哪家公司的產品」，兩句並排會讓讀者自己補上未經查證的事實（見建議修第 4 條）。修掉這一處就乾淨了。
2. **Freeman 自己寫的排除條件與 Martella 轉述的落差**：作者的比對成立，我回兩份原文都確認過。Freeman 正文 L142 把「Student equivalence」列為**編碼**項目（是否隨機、準隨機時兩組在 GPA／SAT／前測上是否無差異）；SI L86–89 寫的排除條件是「if a statistical test indicated that students in the lecture section performed significantly worse … the study was rejected」；表 1 有 39 個比較是「Quasirandom—no data on student equivalence」。Martella 說 Freeman「excluded articles that did not have student equivalence」，比 Freeman 寫的寬。錯的只有次數（必須修第 1 條）。教師等值的情況相同（建議修第 14 條），可以順便補上。
3. **「一個人讀文章，照 ICAP 定義最高到建構」有沒有標成推論、站不站得住**：L120 標了「我認為」，L258 也列進推論清單。限定在靜態題目時，推論成立。L32 的結論表沒有標，而且三處的說法都比 L120 寬。本站文章頁本身就有帶頁面上下文的 AI 側欄，ICAP 允許電腦代理人當對話對象，所以「一個人讀文章」這個說法在本站反而不成立（建議修第 3 條）。
4. **和第 9 篇的分工**：沒有實質重複。有兩處判定會讓連讀的讀者覺得矛盾：規格對照第一列的判定（「主要是本站的選擇」對第 9 篇的「有支持」），以及「答案放在附近」對第 9 篇的「答案位置研究沒有答案、先不規定」（建議修第 1、2 條）。

## 我沒做的事

- 沒有用 Exa 或其他工具重抓任何頁面。核對以抽取紀錄為主，回原文檔只做了上面列的幾段：Martella、Freeman、Chi & Wylie、Van Campenhout。其他數字依賴紀錄與 `_audit/` 的抽查結果，沒有逐一回原文。
- 沒有讀 Menekse 2013、Driessen 等 2020、Mayer 2004 的原文，也沒有核對 VitalSource 與研究所用教材的關係。
- 沒有查 LAK／ACM 會議論文平常有沒有利益衝突聲明。
- 沒有確認 `ChatSidebar` 在正式站上是否受 feature flag 控制、目前是否開啟。我只看了 `PostLayout.astro` 的渲染條件。
- 沒有跑 `pnpm dev`、沒有看實際渲染的頁面，沒有 commit，沒有改任何檔案（只寫了這份報告）。
- 依指派跳過中英一致。

## 2026-10-14 複審

- 複審時間：12:42 CST。文章 sha256：`dd332b85c42bd531e714b9cc4b1d0660909c8e45458cd36a3589c038dc8d1287`（作者修改後的版本，複審期間沒有變動）。
- `check-tw-terms.mjs`：0 blocking、0 to review。逐段掃過新增與改寫的段落，沒有替換表上的用語。

### 必須修

無。

### 建議修

1. L185 新加的句子：「也就是說『做練習』多半是辨認與回想題」。原文那句只講 Van Campenhout 那七門課的教材，這句結論卻寫成整條 doer effect 線的通則。建議改成「這幾門課的『做練習』多半是…」。
2. 「今晚三件事」第 1 條：「點開展開」讀起來不順，建議改成「點開摺疊區塊」。另外，把「點開」歸為主動，是把 ICAP 的「操弄」套到網頁互動上，Chi 與 Wylie 原文沒有列這個例子。可以加一句「我的歸類」，不加也不算錯。

### 已確認修好

初審 4 項必須修＋16 項建議修，逐項回到文章和來源核對。tag `blog` 依指示不改。其餘 19 項都已修好：

- 必 1（L203）：改成「結果段兩次、討論段一次」，與 Martella 原文 L403、L409、L791 相符。同段新增老師等值的對照：「59 個比較沒有資料或兩組老師不同」與 Freeman 表 1 相符；「考試等值才是門檻」與 Freeman L139 相符。
- 必 2（L170、L281）：改成「在系統裡有分數但不算入課程成績」，與 Van Campenhout 原文 L148–151 相符。
- 必 3（L114–115）：主動列改成「畫重點、從選項裡選一個、照抄解題步驟、複誦」，建構列改成「用自己的話解釋、依文字畫圖、提出問題、做預測」。逐項對 Chi 與 Wylie 原文：Underlining/highlighting、Copying solution steps、Repeating or rehearsing 在表 1 的 ACTIVE 欄；Asking questions 在表 1 的 CONSTRUCTIVE 欄；generating predictions 在 L392；依文字畫圖對應 L376–379 的 free-body diagram 例子與 Gobert & Clement。全部相符。
- 必 4（L137）：改成「沒有引用直接比較……的實驗；第二個例子引了兩篇談說明相關性與擴展式框架的文獻」，與紀錄第 5 項相符。
- 建 1（L233）：判定改成「第 9 篇依回饋統合分析判『有支持』；這篇的來源不改變那個判定」，和第 9 篇 L184 一致。新加的「Thurn 等人另指出，產出也不一定反映學習過程」與紀錄第 10 項相符。
- 建 2（L221）：限縮成「題目緊接在內容後面」，並明寫這是延續現行規格的選擇。答案位置改指向第 9 篇的「研究還沒有答案，建議規格先不規定」，和第 9 篇 L207–208 一致。
- 建 3（L30、L118、L256）：三處都限縮到「文章本身的靜態題目」，L30 標了「我的推論」。L118 對 AI 側欄的描述（程式碼裡有、正式站有沒有開沒查、這篇不算進來）與我的核對範圍一致。
- 建 4（L181）：「四位作者都掛名 VitalSource Technologies」，回原文檔 `vancampenhout2023.txt` L7–21 核對：四人單位都是 VitalSource Technologies，相符。「教材公司」與「沒寫是哪家公司的產品」都拿掉了，也補了 LAK 聲明慣例沒有查。
- 建 5（L211）：改成「Koedinger 2016（導言與討論）」「Van Campenhout 2023（方法與限制段）」「Lekshmi-Narayanan 等的相關研究一節」，與紀錄相符。
- 建 6（L185、L255）：改成「多數分析量的是次數」。
- 建 7：「自己出例子」已從 ICAP 表移除。L222 的「自己舉例」在本站建議裡，不標「依原文」，可以。
- 建 8（L56）：明寫正文用了哪兩項分組。
- 建 9（L265）：改成「我從 Q 與自由度算出這是 I²」。
- 建 10（tldr）：改成「小組討論與老師回應」。
- 建 11（L72）：改成只寫「Mayer 2004」。
- 建 12：「widely cited」移到 L78 的 Lombardi 立場段。
- 建 13（L185、L255）：補了 Bloom 低層次題的引文，逐字相符。範圍措辭見上面建議修第 1 條。
- 建 14：見必 1。
- 建 15：今晚第 1 條改成用 ICAP 分類檢查題型，和第 9 篇的第 1 條分開了。新加的自擬例子講的是全批次資料讓每一步的方向更穩，內容正確，也標了自擬。

## 2026-10-14 英文稿

- 審的檔：`src/content/posts/learning/2026-10-14-active-learning-evidence-en.md`。sha256 `86271fef3e0ffa94a6ce9a19e2c2e3c9f3ce0069dce8aea8ba540a30d1052961`（13:13 CST）。
- 對照的中文稿 sha256：`32e22ae94b88d20ae2b253e9e1ac08366907883fb1da226293f098dedb381480`。這個值和複審時不同，因為作者已經套用複審的兩項建議修：L187 改成「至少在這七門課裡」，今晚第 1 條改成「點開摺疊區塊」。
- 兩檔都是 302 行，各節逐段一一對應。
- 數字逐項比對過：表格、內文、附錄、參考資料。限定條件、推論標示（my inference／I computed／my own／I did not read）都對得上中文稿。
- 站內連結：除了「中文版」那一條，其餘 18 條都指向 -en 版，五篇 -en 檔都存在。中文版連結指向中文稿，檔案存在。`check-post-quality.mjs` 只有 tag `blog` 一則 WARN，和中文稿一樣，依指示不改。
- 系列名稱「Writing Articles That Teach」與五篇已發佈的英文稿一致。
- 其他：規格條文用英譯加引號，和第 9 篇英文稿的做法一致。Freeman 的「computer science」對過原文。

### 必須修

1. **L70：`studies that did not control for confounds "may" not reflect the true effect`。** 英文引號會讓人以為原文用的是 "may"，但原文是「it is possible that the results obtained in these articles are not reflecting the true effect」（Martella L843–844）。中文稿的「可能」是翻譯，放進英文就不是逐字引文了。建議改成直接引原句："it is possible that the results … are not reflecting the true effect of active learning interventions"；或拿掉引號、改寫成 "are possibly not reflecting"。
2. **L205：`write twice in their results and once in their discussion that "Freeman excluded articles without student equivalence."`** 引號裡是改寫，不是原句。原文是「Freeman et al. (2014) reported they excluded articles that did not have student equivalence」（L403、L409；討論 L791 是三項並列）。建議改成引原句 "reported they excluded articles that did not have student equivalence"，或拿掉引號。

### 建議修

1. L252「college classrooms and course courseware」：course courseware 是疊字，讀起來像筆誤。中文原意是修課用的線上教材，建議改成「college classrooms and online courseware used in for-credit courses」。
2. L246「for example (my own):」不夠清楚，建議改成「(an example I wrote)」。
3. L211「the passive group had to read the text aloud」：Thurn 的原文是「had to read aloud text」，這裡沒有加引號，可以。只是提醒：如果之後要加引號，用原句。

### 英文引文逐字核對（都相符）

just under half a SD；It is an open question whether student performance would increase as much if all faculty were required to implement active learning approaches.；any active learning type and intensity；first-generation；any teaching method that gets students to do something；seems clear；the reduction or elimination of lecture；widely cited；solid evidentiary basis；almost certainly；virtually identical；We show that this negative correlation is caused in part by the increased cognitive effort；some evidence suggesting；conceptually derived；No known studies；around 8% to 10%；may indeed learn better；not convincing；explicitly state；has been validated through a number of classroom and laboratory studies；cannot be explained solely by some global student trait；conscientious doer/learner；does not demonstrate causality conclusively；because doing practice causes learning；Research on the doer effect has shown it to be causal to learning；entirely consistent；Most questions are low level Bloom's questions that target recognition and recall；as opposed to passively listening；no data on student equivalence；disjointed and lacking in flow。

作者說 Lekshmi-Narayanan 那句改用摘要原句：L177「failed to identify a doer effect in learning outcomes」，與抽取紀錄所記的摘要原句「we failed to identify a doer effect in learning outcomes」相符。

### 英文自然度

整體通順，語氣和中文稿一致，沒有逐字硬譯的句子。除了上面建議修第 1、2 條，沒有其他要改的地方。

## 2026-10-14 英文稿修正確認

- 英文稿 sha256 `01678575140c8af0b5e93075b387ed72a87fb22e90fbd81406b763623fbbdab6`（13:34 CST）。中文稿 sha256 `32e22ae9…` 沒有變動。
- 做法：把英文稿裡所有雙引號字串全部列出，逐一分類核對。

### 必須修

1. **規格對照表第 2、3 列的條文英譯，和第 9 篇英文稿不一致。** 作者說已經對齊，但只有第 1 列「Self-checks need an answer or a criterion, not just 'think about it'」和第 9 篇 L180 相同。
   - 第 2 列：本篇是 `"include explanation or variation questions readers can judge for themselves"`，第 9 篇 L179 是 `"an explanation question or variation problem the reader can judge"`。
   - 第 3 列：本篇是 `"Put one question at the end of each major section, with an answer or criterion"`，第 9 篇 L181 是 `"One question at the end of each main section, with an answer or criterion"`。

   兩列都建議照第 9 篇英文稿的字串改。

### 建議修

1. L139 `"the same overt behavior with different covert processing"`：這是抽取紀錄的改寫，不是 Thurn 的原句。放在引號裡會被讀成引文，建議拿掉引號或改用斜體。
2. L275 `"interactive versus active"`：是表格格子的名稱，不是原文字串。原表是 Interactive × Active，可以改成 *interactive × active*，或拿掉引號。

### 已確認

- 兩項必須修已改好。
  - L70 改成 Martella 的原句："it is possible that the results obtained in these articles are not reflecting the true effect of active learning interventions"（D10，L843–844），逐字相符。
  - L205 改成 "reported they excluded articles that did not have student equivalence"，逐字相符；「59 個比較」那句拿掉了引號，改成敘述。
- 作者新加或改動的引文都逐字相符：
  - Deslauriers L69 "whether students were told directly how to solve each problem or were asked to try to solve the problems themselves in small groups before being given the solution"
  - Freeman "at least some active learning"、"no data on student equivalence"、"225 studies"
  - Lombardi 的 "engagement"、"knowledge construction"（A5 用語）
  - Chi 的 "No known studies"
  - Thurn 的 "The authors declare competing interests."
- 上一節列過的其餘引文都沒有變動，仍然相符。
- 其他雙引號字串都是本站自己的說法、節名或術語，不是在引原文，不需要核對：例如 "active learning is better"、"Where sources disagree"、"causal model"、"implementation fidelity"、A／C 標記。
- 中英仍一致：L99 由轉述改成直接引原句，意思和中文稿的「先試再看解答」對「直接告訴解法」相同；其他段落沒有實質改動。
- 英文稿審稿時的建議修 1、2 已改：L252 改成 online courseware used in for-credit courses；L246 的 "(my own)" 已經改掉。

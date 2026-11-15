# 審稿報告：order 14〈教學文章要不要講用途、放趣聞〉

- 審的檔：`src/content/posts/learning/2026-10-14-utility-interest-seductive-details.md`（只有中文稿，未審中英一致）
- 審前 sha256（2026-10-14 14:42 CST）：`2fb1c814ae7abde3dc6135c608da62af509f51ce20a2e40bdedde0321f61ef09`
- 審後 sha256（2026-10-14 14:47 CST 之後再算一次）：同上，審稿期間沒有人改檔。
- 依據：`.research/2026-10-14-writing-brief.md` 的證據規則；`.research/extractions/articles-that-teach/` 下 12 份抽取紀錄加 `hidi2006-four-phase-interest.md`（⚠）；`_audit/group-01、02、05、06、07、13、14`、`provenance.md`；必要處回 `.research/raw/learning-content/q1-learner/` 原文檔核對（Asher 原文 L505–535、L622–628、L1079、L1097；Shillington L85、L174；Hecht L141；Clinton nolayout L1251；Canning 2019 seq L85–95）。

## 必須修

**M1. 「對誰有效」總結句把不顯著的交互作用算成「看到」（L212，連帶 L205 表格那一格）**
L212：「最接近一致的是『自己寫用途對信心低的人好處較大』：三篇看到（其中 Hecht 只在簡單效果、交互作用不顯著），Harackiewicz 2016 沒有測到」。問題有三：
- Hecht 研究二的事前檢定（用途寫作 × 任務信心）不顯著：Table 6 β = −.07，p = .111（`hecht2021…md` 第 12 條）；只有事後簡單效果在低信心端顯著（第 13 條）。括號有交代，但同一句把它算進「三篇看到」，等於把不顯著的交互作用當成支持。證據規則：不顯著不能寫成有。
- Hecht 研究二四組都先看了有用途資訊的影片（第 35 行條件說明），它是「先聽再寫」，不是單純自己寫；正文 L120–125 已把它歸在「先聽再寫」，表格這一格卻放在「自己寫用途」而沒有註明。
- 表格漏了一個反例：Canning 2015 研究二的「自己寫 × 信心」三個依變項都不顯著（p = .300、.692、.476；`canning2015…md` 第 19 條），顯著的只有加上直接告知的三因子交互作用。Canning 2015 研究一的支持是對照組的簡單效果（低信心 d = .59），原文沒有報告「自己寫對對照 × 信心」的交互作用檢定。
建議改寫：「Hulleman 2009 的交互作用顯著（沒有做低預期者的簡單效果檢定）；Canning 2015 研究一只有低信心端對對照組的簡單效果；Hecht 研究二（所有人都先看了用途影片）交互作用不顯著，只有低信心端的簡單效果；Canning 2015 研究二與 Harackiewicz 2016 都沒有測到這個交互作用。」並刪掉「最接近一致」或改成「方向上較常出現」。我的判斷：照現在的寫法是過頭了。

**M2. 給選擇的實驗數寫錯（L31、L135）**
L31「一篇七個實驗」、L135「直接證據我只找到一篇，就是上面 Asher 與 Harackiewicz 的七個實驗」。原文 Study 1 是兩格（告知用途對對照）、Study 2 是告知用途 × 歸因重構，都沒有選擇操弄；選擇從 Study 3 開始（原文 L505–535：「We crossed … with a choice manipulation in Study 3 … and Study 4」，S5–S7 另有選擇條件；OSF 各研究係數檔的 Choice 列也只出現在 S3 起）。應改成「同一篇裡的五個實驗（第三到第七個）」。

**M3. Hidi 與 Renninger 2006 寫出了內容（L144）**
「Hidi 與 Renninger 2006 的模型也談到選擇，但我沒讀到那篇的合法全文。」`hidi2006…md` 檔頭 ⚠：只能寫存在。「也談到選擇」只有這份 ⚠ 紀錄（D3）撐，Asher 原文只在 L1079 用四階段模型解釋選擇組的效果，沒有說 Hidi 與 Renninger 談選擇。建議改成「Asher 等人用 Hidi 與 Renninger 的興趣模型解釋選擇組的結果（那篇模型我沒讀到合法全文）」或整句刪除。（L42「這個分法出自 Hidi 與 Renninger 2006」有 Asher 原文 L1097 撐，可以保留。）

**M4. 英文引文的出處寫錯（L230）**
「Shillington 等人的摘要與結論說介入「successful」」。原文摘要（L85）寫的是「The intervention had a positive effect」，「successful」只出現在結論（L174「overall, the intervention was successful」）。改成「摘要說介入「had a positive effect」，結論說「successful」」或只寫結論。

**M5. 把不顯著寫成沒有差別／沒有效果（證據規則明列）**
- L140「結果和標準選擇組沒有差別」→「沒有測到差異」（Asher L527：no significant differences）。
- L172「內在動機、自陳的認知負荷，都沒有隨比例改變」、L228「Wesenberg 2026 的內在動機沒有隨比例上升」→「沒有測到…隨比例改變」。
- L183「閱讀時間在兩個實驗都沒有因此增加」→「沒有測到增加」（L189 自己寫成「沒有顯著較長」，前後也不一致）。
- L220「表現沒有差別」→「表現沒有測到差異」。
- 附錄 L284「對任務信心沒有效果」、L296「全部課程對低度發展國家學生沒有效果」、L300「外在認知負荷與內在動機都沒有效果」、L302「認知負荷（單題）沒有效果」→ 一律改成「沒有測到差異／不顯著」。

**M6. 系列內前後篇寫反（L16、L238）**
系列規劃（`.research/2026-10-13-learning-content-series-plan.md` 表格）：先備知識是 order 12、讀者相信錯的東西是 order 13、讀者真的會做嗎是 order 10，都在本篇（14）之前。L16「讀者的先備知識、已經相信錯的東西，之後的篇會談」與 L238「讀者會不會做文章裡的活動，之後的篇會談」都寫成之後。這三篇目前是工作目錄裡未 commit 的稿，依寫稿說明不放連結即可，但措辭要改成「本系列第 12、13 篇」「第 10 篇」。（L22、L296 指 order 19「讀者為什麼讀不完」寫「之後」是對的。）

**M7. 開頭的來源偏向自相矛盾（L22 對 L267）**
L22：「講用途這條線幾乎全部出自同一個研究群……唯一的例外是一篇遠距課程的研究。」L267：「除了 Shillington 等人與 Kizilcec 等人，其餘六篇都有 Harackiewicz 掛名。」Kizilcec 2020 正文放在用途一節（L127–131），所以例外是兩篇。另外 L22「共 12 份，另外引一份之後談……的大規模研究」：參考資料連 Kizilcec 共 12 筆，照這句讀會以為有 13 份；改成「共 11 份，另外引一份……」或「共 12 份，其中一份……」。

## 建議修

- L22「列在參考資料裡的每一份都從頭讀到尾」與 Hulleman 2009 只讀補充資料、Asher 補充資料沒取得、Canning 2015 圖與附錄沒取得互相打架；改成「每一份都讀完手上那一版並留有抽取紀錄，讀不到的部分寫在括號」（L308 已是這個寫法）。
- L28 總表「信心與興趣都沒有測到調節」：14 個檢定裡有 1 個顯著（分心 × 信心，p = .006），正文 L61 有寫，表格一句帶上「14 個裡 1 個顯著」較準。
- L50「這個問題目前規模最大的實驗」沒有來源；改成「這批來源裡規模最大的實驗室實驗」。同行「所有人都看同一段教多元迴歸的影片」：選擇組看的是三個資料集版本之一，改成「同一套迴歸課內容」。
- L102「這群學生和多數學生的成績落差縮小約六成」：比較對象是非第一代的多數族裔學生（CG-Majority），寫明。
- L172「先備知識平均只有滿分的一成左右」（9.54%、7.67%）：order 12 寫「一成以下」，兩篇統一成「一成以下」。
- L209 表格「Wesenberg 2026 是地板效應，測不出來」：作者說的是「可能是」地板效應（L172 正文已寫對），表格同步。
- L212「改用先前成績分的時候，Harackiewicz 2016 與 Canning 2019 的方向相反」：兩者比的結果變項不同（2016 是成績；2019 是興趣與知覺用途，成績的交互作用 p = .829），補一句。
- L252「實驗裡告知放在學之前或學的過程中，沒有放在學完之後的」：Asher 第六、七個實驗在課後給了三句用途引言（和反思寫作結合，分析在沒取得的補充資料），這句的否定說法建議收窄為「單獨告知的都放在學之前或學的過程中」。
- 規格對照表可補一列：`series-curriculum-design` 五層結構的第 4 層「連回模型」（「所以你用 Claude 時看到的 XX，就是這個在運作」）本身就是學完後的直接告知用途，和文末「為什麼這對實作重要」同一類。另外該 skill 給的場景範例「為什麼 ChatGPT 有時會重複自己？」本身就是正文會回答的問題，可在建議那一格順帶說明現有範例已符合。
- 附錄 L298「（QB = 9.40、df = 5 對應的 p 約 .09，表印 .01）」：p ≈ .09 是抽取紀錄自己用卡方分配算的，要標「我算的」；L273 說附錄自算數字「都已標明」，這一處沒標。
- L44 例子「Wesenberg 等人實驗裡的實際例子」：出自 2025 那篇（Fig. 1），寫明年份，免得和 2026 混淆。
- L185「約一成六的人沒有回報兩個單元有差別」：研究一 16%、研究二 17%，而且排除條件是自評自願單元不低於必做（含相等與較高），改成「約一成六到一成七的人自評兩個單元沒有差別或方向相反」。
- 開頭缺 `> 🌏 [English version]` 那一行；寫稿說明寫「英文稿之後補」，若要先放佔位就補上，否則英文稿派出時記得加。
- frontmatter tag `blog`：`check-post-quality` 警告正文沒有對應詞，確認是否保留。

## 沒問題的項目

- **Sundararajan 數字的寫法**：−0.43 與 −0.28 敏感度分析、11 個裡 6 個同一共同作者、教室 4 個 −0.15 沒有測到差異、品質高 17 個 −0.24、只有 2 個研究量延宕效果、26／54 沒有報告檢核，L152–158 全部並列，tldr 寫「大小不確定」，總表 L32 也附 −0.28。與 order 9（`2026-10-13-teaching-text-questions-feedback.md` L119–121、L254）的數字與說法一致（54 個比較、5,111 人、−0.43、−0.28、教室 −0.15、高品質 −0.24、方向確定大小難定）。與 order 2（`2026-10-13-diagrams-in-teaching-articles.md` L102、L399，Noetel 轉引期刊版「持續顯示 0.43、一閃而過 0.12」）的差異在 L226 並列、不選邊，處理正確。附註：team lead 說「第 1、2 篇」，實際引用 seductive details 的是 order 2 與 order 9，order 1 沒有引。
- **Hulleman 2009**：正文 L87–96 與附錄 L288 的每個數字（262 人、19 班、M = 4.7、3.23 對 2.43、100 人子樣本、26%、主效果負號、交互作用 β 表與正文 −.19／−.18）都出自補充資料（SOM），沒有引作者稿正文的字句（例如「nearly two-thirds of a letter-grade」沒有出現）。參考資料只列 SOM 並註明正文沒讀，符合 ⚠。
- **Hidi 與 Renninger**：除 M3 那一句外，L42、L275 只寫存在並附 DOI，沒有列進參考資料。
- **規格對照表的「場景」建議**：L250 已標「這是本站的推論，沒有直接比較過的研究」，L241、L272 也重複標明。符合推論要標明的規則。
- 其餘核對過、與抽取紀錄（及我回原文抽查處）相符：Asher 的 d = 0.41、0.15、0.03、39.2% 對 33.2%、p = .042、逐研究只有一個顯著、分心 × 信心、檢定力 < 30%、兩操弄差 p = .134、選擇 0.92／0.24／0.16；Hecht 研究一的主效果 β = .01、× 起始興趣、起始興趣平均 3.11、12 對 8 分鐘（已標自算）、雙調節模型 β = −.13（p = .048）；Hecht 研究二約多 1 題、21.94 對 20.90；Canning 2015 三個研究各項比較對象、時間點混淆、研究三表與正文不一致；Harackiewicz 2016 的 d = 0.06、0.55、64 人、61%、40% 所依據的交互作用 p = .092、信心 p = .203、GPA p = .045；Canning 2019 的設計（兩組都附範例）、吃力學生興趣下降、成績差異只在兩種包裝之間；Shillington 的 d = 0.05、0.16、0.18、沒有群集校正；Kizilcec 的 2.79／2.74、−1.62／−1.71、事後定義；Wesenberg 2026 的設計、b 值、16.5 個百分點（已標自算）、r = −.10；Wesenberg 2025 的各格平均與 p 值、自算 d 已標；Clinton 的四次裡三次、relatively small。
- 英文引文逐字比對：「further promoted interest development」（Hecht L141）、「relatively small」（Clinton nolayout L1251）相符；「successful」見 M4。
- 開頭交代取樣偏誤（L22 三個偏向）、證據的限制一節完整（情境、單一研究群、立即測驗、檢定力、版本、原文內部不一致、推論清單、自算數字、轉引、只知道存在的來源）。
- 本站現況（2026-10-14 14:45 依工作目錄）：`series-curriculum-design/SKILL.md` L43「動機先於抽象」、L115–117 五層結構第一層「場景」、`course-guide-contract.md` L27「從具體問題到直覺與機制」都在；含「為什麼這對實作重要」的 MIT 6.7960 導讀確為七篇（l07–l13）；`series-curriculum-design` 工作目錄沒有未 commit 的改動，「規格沒有因為這篇改動」成立。
- 站內連結：L16、L18、L20、L226、L322 的十個站內目標檔都存在且 `draft: false`（order 3、4、7、8 已在 3a42782f commit）。
- 外部連結（curl，跟隨轉址）：PMC 五筆、ERIC 兩筆、OSF、WSU 典藏、ZORA、doi.org 的 Springer／Elsevier／Frontiers 都是 200。APA 四筆、PNAS、Science、T&F 的 DOI 在 doi.org 回 302 正確轉到出版者，出版者對 curl 回 403（擋爬蟲）；`science.org/doi/suppl/10.1126/science.1177067` 回 403，我沒能用瀏覽器確認補充資料頁可公開開啟。
- `node scripts/check-tw-terms.mjs`：0 blocking、0 to review；`check-post-quality.mjs`：只有 `blog` tag 警告。

## 需要人判斷事項的意見

1. Hecht 研究二歸入「信心低的人好處較大」：表格那一格本身寫得準，但總結句「三篇看到」過頭，見 M1。
2. 規格對照表的建議有標成推論：有，見上。
3. Hulleman 只引 SOM：有遵守。
4. Hidi 與 Renninger 只寫存在：L144 一處違反，見 M3。
5. Sundararajan −0.43 是否與 −0.28、教室研究並列：有；與 order 9 一致，與 order 2 的差異有並列。

## 我沒做的事

- 沒有逐篇重讀 12 份原文全文；以抽取紀錄為準，只在上面列出的行號回原文抽查。
- 沒有用瀏覽器開出版者頁面（403 的那幾筆只確認 DOI 轉址）。
- 沒有審英文稿（不存在），沒有跑 `pnpm dev`／build，沒有改任何檔。
- 沒有讀 order 10、12、13 的稿，只確認它們的 order 與 commit 狀態。

## 2026-10-14 複審

- 複審檔 sha256（15:01 CST）：`e0ad44659362a03b42f0b3119f62b8ea6d2558b11f729f05f35feb34c0d5c70b`
- `check-tw-terms`：0 blocking、0 to review；`check-post-quality`：仍只有 `blog` tag 警告。

### 必須修

（無）

### 建議修

- L309 參考資料開頭仍寫「每一條都從頭讀到尾並留有抽取紀錄」，只有 L22 改了。Hulleman 2009 只讀了 SOM，兩處要一致，改成「讀完手上那一版」。
- L16「前面的篇（本系列第 12、13 篇）已經談過」、L238「本系列第 10 篇已經談過」：這三篇目前是工作目錄裡沒 commit 的稿。如果本篇比它們先上線，「已經談過」就不成立；請和它們一起發佈，或改成「第 12、13 篇談」。
- 新增的 L253「連回模型」一列：把第 4 層歸成「學完之後的直接告知用途」，是本站自己的歸類，因為它講的是概念在工具裡怎麼出現，不是對讀者目標的用處。L273 已經把「規格對照表的判定」列成推論，可以接受；想更清楚的話，在這格加「我的歸類」。
- 上一輪留下沒處理的：開頭的 English version 那一行（寫稿說明允許之後再補）、`blog` tag 警告。

### 已確認修好

- M1：L205 表格與 L212 已逐篇照實寫。只有 Hulleman 的交互作用顯著。Canning 2015 研究一註明沒有報告交互作用檢定。新增 Canning 2015 研究二（三項都沒有測到）。Hecht 研究二標成先聽再寫、交互作用不顯著。「最接近一致」已刪除。內容逐條對過抽取紀錄，沒有新錯。
- M2：L31「一篇研究裡的五個實驗」、L135「第三到第七個有選擇的操弄」，正確。
- M3：L144 改成「Asher 等人用 Hidi 與 Renninger 的興趣模型解釋選擇組的結果」，有 Asher 原文 L1079 支持。
- M4：L230 的摘要「had a positive effect」與結論「successful」分開寫，兩句引文都和原文逐字相同。
- M5：L140、172、183、220、228 與附錄 L285、297、301、303，都改成「沒有測到差異」或「不顯著」，全文再掃已經沒有「沒有效果」「沒有差別」。
- M6：L16、L238 改成前面的篇（第 12、13 篇、第 10 篇），方向正確（發佈時機見建議修）。
- M7：L22 改成「例外只有兩篇」「共 12 份，其中一份……」，和 L268、參考資料筆數一致。
- 建議修已落實的項目：
  - L22 讀取範圍的措辭。
  - L28 總表的「14 個裡 1 個顯著」。
  - L50 的「這批來源裡規模最大的實驗室實驗」與「同一套內容」。
  - L102 的比較對象。
  - L172「一成以下」，和 order 12 一致。
  - L209「作者說可能是地板效應」。
  - L212 註明兩篇量的結果不同。
  - L252 已收窄，Asher S6、S7 的描述和原文 L531–535 相符。
  - L250 補了 skill 範例本身就符合。
  - L253 新增一列，skill 第 4 層的文字照抄正確。
  - L299 的 p≈.09 標成抽取時自算。
  - L44 標明 2025。
  - L185 與附錄 L303 的排除比例與條件（16–17%，外在要求等於或高於必做）和抽取紀錄相符；研究二排除用的是同一個操弄檢核。
- 對照表開頭（L245）改成「兩份規格（`series-curriculum-design` 與 `course-guide-contract.md`），另加現有導讀的一種寫法」，和表內各列對得上：skill 兩列、contract 一列、文末「為什麼這對實作重要」一列。沒有問題。

## 2026-10-14 英文稿

- 中文稿 sha256：`e437bf9a48cdd6e4152b79d1c23dcc40e0a208c5696f64e45b9fb0d807aaad34`
- 英文稿 sha256：`3b62cd876e92f927723ac6a5566351237238281cd6d54c2fbc9f292ace79b115`
- 兩檔都是 325 行，逐行對齊。我用腳本逐行比對兩稿的數字：差異全部是中文數字和阿拉伯數字的寫法不同（一成六／16%、九成以上／Over 90%、2016 年 9 月／September 2016 等），沒有實質出入。
- `check-post-quality`：英文稿沒有問題。

### 必須修

英文稿裡有三處引號內的文字不是原文逐字，而原文本身就是英文，讀者會以為是直接引用：

- **L44**：「"interest triggered in the moment"」「"maintained interest"」寫成 Asher 等人區分的用語。這兩個是中文稿的白話說法翻回英文，Asher 原文的用語是 triggered situational interest 與 maintained situational interest。建議改用原文用語，或拿掉引號、改成描述。
- **L166**：「say, in effect, "if you must include them, put them at the start and use only one medium" and "novices are more susceptible."」雖然寫了 in effect，但兩句都放在引號裡。論文原文（抽取紀錄 p.112）是「If you really want to include seductive details, share it quickly, at the beginning, using just one medium」與「Novice learners are more susceptible」。請直接引原文，或拿掉引號。
- **L180**：「"mandatory, required for your payment"」「"voluntary, you get paid either way"」是改寫。原文說明頁是「Completion of the following learning unit is mandatory … It is also required to receive the participation payment」與「… only voluntary … You will not receive payment for participating in this unit」（抽取紀錄 Table 1）。請拿掉引號改成描述，或改成原文逐字。

### 建議修

- **中英兩稿附錄 L285**：「the text at L991」／「正文 L991」是我們本機文字檔的行號，讀者對不到。改成「正文的結果段」。
- **L247 與 L255 的規格引文**：表頭已註明「spec wording translated from Chinese」，L20 也標了「translates roughly as」「(in translation)」，處理妥當。L255 那一格裡引了「the XX you see when you use Claude is this at work」，同樣受表頭註記涵蓋，不用另外標。
- **自然度**：
  - 「unrelated to the main line」（tldr、L34、L148 標題）不太道地，建議改成「unrelated to the main point」。
  - L245 標題「Against this site's writing specs」容易讀成「反對」，建議改成「Checked against this site's writing specs」。
  - 其餘段落通順，用詞和本系列其他英文稿一致（not detected、hear-then-write）。
- **英文稿 tags 的 `blog`**：沒有被警告；中文稿仍有警告，維持原判斷，由作者決定。

### 已確認

- **中文稿小修**：
  - L311 改成「每一份都讀完手上取得的那一版」，和 L24 一致。
  - L255 標明「這是本站的歸類，skill 沒有這樣定義」。
  - L16 加了 English version 那一行。
  - 第 12、13 篇（L18）、第 10 篇（L240）都改成連結，目標檔都存在。
- **站內連結**：英文稿的 14 個站內連結都指向存在的 `-en` 檔，中文版連結也正確。
- **英文引文逐字相符**，都對過原文：
  - 「had a positive effect」（Shillington 摘要 L85）
  - 「successful」（結論 L174）
  - 「further promoted interest development」（Hecht L141）
  - 「relatively small」（Clinton L1251）
  - 「only」（Asher 摘要：「only the utility value manipulation led students to request resources about statistics」）
  - 「Here are some examples of an approach you could take」（Canning 2019，抽取紀錄 L283）
- **內容一致**：
  - 「對誰有效」總表、M1–M7 的修正內容、Kizilcec 和 Wesenberg 的排除條件、規格對照表五列，中英相符。
  - 已發佈篇的英文標題（L325）和各篇實際標題的對應沒有逐一核對，只確認檔案存在。

## 2026-10-14 英文稿修正確認

- 中文稿 sha256：`60988a909cc20c472f7edbc485cb834818c9b88fc32f961de8b84357e0a1fdb0`
- 英文稿 sha256：`51941f125ed7b82f5be6fdd6fae09c23691e2945090a5a22348ded009bc014ae`

### 必須修

- 中文稿 L24 仍寫「Judith Harackiewicz 的實驗室與她的學生」，「她」是從名字推的。英文稿已改成 researchers trained there，中文稿要同步，改成中性說法，例如「與在那裡受訓的研究者」。全文其餘的「他／他們」都是泛指讀者、受試者或作者群，沒有問題。英文稿沒有 he、she、his、her。

### 建議修

- **L166**：「"Novice learners are more susceptible."」原文是「Novice learners are more susceptible to learning poorly when you include seductive details.」（論文 p.112 資訊圖，我看過 PDF 頁面影像）。句號放在引號內，會讓截斷的句子看起來像整句。建議引完整句，或把句號移到引號外。
- **L279**：「"for yourself"」「"for others"」是我們對 Priniski 2019 做法的描述，不是原文。拿掉引號較不會被讀成引文。

### 已確認

- **原文英文引號逐字相符**：
  - L110 Canning 2019 的範例句。
  - L166「If you really want to include seductive details, share it quickly, at the beginning, using just one medium」（p.112 頁面影像，引號在括號前結束）。
  - L199「relatively small」。
  - L232 的四句：「had a positive effect」「successful」「only the utility value manipulation led students to request resources about statistics」「further promoted interest development」。
  - L274「baseline interest in statistics」（Asher 原文正文）。
- **前一輪三項必須修已修好**：
  - L44 改用原文術語 triggered／maintained situational interest，而且沒加引號。
  - L180 的必做／自願說明拿掉引號、改成描述，內容和原文相符。
  - L166 改成原文引句。
- **英文稿其餘引號**：分成三類，都不是在冒充文獻原文。
  - 本站自己的說法、假設句或術語標記。
  - 本站中文規格的譯文。表頭已註明 translated from Chinese，L20 也標了 translates roughly as。
  - 本系列各篇的標題。
- **L991**：中英兩稿都已刪除，附錄改成「正文把它寫成與統計興趣的交互作用」與 the text describes it as an interaction with interest in statistics，兩稿一致。
- **自然度兩項已改**：英文稿全文找不到 main line 與 Against this。

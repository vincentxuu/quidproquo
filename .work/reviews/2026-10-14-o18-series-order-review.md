# 審稿報告：order 18「系列文章的順序怎麼排」（只審中文稿）

- 審的檔：`src/content/posts/learning/2026-10-14-series-order-in-teaching-articles.md`（255 行，未 commit）
- sha256 審前（2026-10-14 16:53:58）：`0d11993f971b78d191eeba8925250653010f315fb8104cf88233cda64e5d73a1`
- sha256 審後（2026-10-14 17:00:59）：`0d11993f971b78d191eeba8925250653010f315fb8104cf88233cda64e5d73a1`（相同，審稿期間沒有人改檔）
- 依據：`.research/extractions/articles-that-teach/` 下 baroody2022、rivera2026-pathos、dringoli2021、doroudi2019、rohrer2020-interleaved-rct、rohrer2020-textbooks-scarcity、brunmair2019（含重讀更正）、ireland2020、maltagliati2023、mullaney2015、guo2014-mooc-navigation 共 11 份，fang2019 與 scheiter2007 兩份 ⚠；`_audit/` 的 group 檔與 provenance.md；raw 原文檔（引文逐字比對、PATHOS PDF 第 7 頁轉圖看 Figure 2）。
- 只有中文稿，依指派跳過中英一致。

## 必須修

1. **PATHOS 刪邊的人寫錯，且和前文自相矛盾（L66）**。L66 寫「對照順序走的每一步也都在**評分者保留**的轉換裡」。原文是研究者自己先刪掉違反先備關係（surmise relation）的邊（100 → 24 條），之後 12 位評分者只替剩下的邊評分（plain 檔 L642–655：「we removed those for which a transition would violate the surmise relation … Afterwards, we annotated the edges … involving 12 panelists」）。文章自己的 L61 也寫對了（先刪、再請評分者評），L66 和它矛盾。改成「研究者刪掉違反先備關係的轉換之後留下的邊」。

2. **Rohrer 等 2020 的操弄被寫成「把舊題型混進後面的作業」（L97、L178、L193，連帶 L203、L210）**。正文 L99–103 的設計描述是對的：交錯組從第一張作業單起每張就有四種題型各一題，區塊組每種題型集中在一張，兩組做同一批 32 題。抽取紀錄「與清單不合」一節明說：「後面的作業混入前面的題型」不是原文的操弄，原文沒有「先教完再把舊題型混進後面」的安排，四種題型何時教、和作業單的先後關係原文也沒有交代。目前：
   - L97 小標「把舊題型混進後面的作業」；
   - L178 對照表「有隨機試驗支持的是把舊題型混進後面的練習（Rohrer 等人）」「回頭『練』有支持」；
   - L193 可以做的事第 3 條「有支持的是把舊題混進後面的練習（Rohrer 等人）」；
   - L203「回頭練舊題的是國中數學課」、L210「回頭練優先於回頭重講」。
   這些把推論寫成來源的發現。建議改成「同一批題目分散到多張作業並混排」；把「這等於系列後篇回頭練前篇」標成我的推論。L178 的依據強度要從「回頭『練』有支持」降成「混排加分散的練習有一個課堂試驗支持；搬成『回頭練舊篇』是推論」。

3. **「課程導讀一堂一篇，順序跟著原課走」與本站規格不符（L18、L180）**。`course-guide-contract.md` 第 13 行只規定一堂一篇、不拆 A/B，作業排在它依賴的那一堂之後；第 12 行說「原課堂次不是 `series.order`」。`docs/cmu10423-rebuild-2026-10-12.md` 第 36 行明寫「order是本站閱讀順序，非原課堂次」。`series-curriculum-design` 第 9 行的核心原則是「用學習者的旅程排序，不用教授的知識分類排序」。我在 `.agents/`、`docs/` 都沒有找到「順序跟著原課」這條規則。L18 要改寫成規格實際寫的內容。L180 對照表那一列（「Doroudi：專家的固定順序不容易被演算法打敗；PATHOS：…被重排後打敗」）是建立在「本站照原課排」這個前提上，也要跟著改：可以改成對照「一堂一篇」，或對照「series.order 由本站決定、不等於堂次」。
   另外建議：本站系列規劃最核心的那句「用學習者的旅程排序，不用教授的知識分類排序」，正文沒有提到，而 PATHOS 的對照順序（照發展史）剛好就是它的反例，可以補進對照表。

4. **不顯著寫成「沒有差異」或「沒有贏過」（違反寫稿說明的證據規則）**：
   - L9 tldr「8 個研究沒有一個贏過人排的固定順序」→「沒有一個顯著勝過」；
   - L32 表「六種順序互比沒有差異」→「沒有測到顯著差異」；
   - L46「另外三個沒有差異」→「沒有測到差異」；
   - L48「但沒有勝過打亂順序的組」→「沒有顯著勝過」；
   - L81 小標「演算法排序沒有贏過人排的固定順序」、L85「沒勝過專家或啟發法」「和……固定順序沒有差異」、L162「沒有贏過專家設計的固定順序」、L179「沒有贏過專家設計的順序」→ 都加「顯著」或改成「沒有測到差異」。Doroudi 的原文用的是「not yet evidence」「we have yet to see」，抽取紀錄也提醒不能寫成「證明了沒有用」。
   - 附錄 L230 Brunmair「保留間隔……發表與否都沒有調節效果」→「沒有測到調節效果」（原文「no evidence for a moderating effect」）。

## 建議修

- **L174 對照表**「PATHOS 的兩種順序都沒有違反先備關係」在表裡沒有標成我讀圖的判斷（L66 與 L210 有標）。表內補「（我讀圖的判斷）」。讀圖結果本身我回 PDF 第 7 頁 Figure 2 核過：對照順序的 MC→HTSM 4.58、HTSM→NCSM 3.25、NCSM→ULA 4.08、ULA→ALS 2.58、DDPM→EM 4、EM→SDE 3.5、SDE→AR 3.17、SDE→FP 3.17 都是 panel (a) 裡的邊；MC 與 DDPM 兩段的起點也都是 panel (a) 標紅箭頭的合法起點。所以判斷成立，但成立的層級是「每一步轉換」。原文沒有公布完整的先備關係，L66 可加半句「以相鄰兩步的轉換來看」。
- **L93 ALEKS 的描述**「用知識空間理論決定學生下一個可以學的主題」：可引的來源是 PATHOS L444–448（「use diagnostics … to assess a learner's current state and recommend next steps」），用字是「建議下一步」，不是「決定」；⚠ 的 Fang 檔寫的是學生自己選主題，那份不能引。建議改成「建議」，並註明出自 PATHOS 的背景段。同段「Doroudi 等人的回顧也不涵蓋這類參數由人設定的系統」：Doroudi 原文沒有提到 ALEKS（作者稿裡 grep 不到）。「ALEKS 不在納入範圍」是抽取紀錄依納入標準推出來的，要標成我的推論。
- **L133–135 和第 12 篇重複**。L133 寫「第 12 篇已經寫過這個研究的主要發現，這裡只補和排序有關的兩點」，但 L135 的第一點（三到四成、降到兩成以下、作者最有把握的那句）就是第 12 篇 L173 已寫過的內容。可以刪掉，或改成「第 12 篇提過…；這裡補證書率沒有檢定這一點」。
- **Doroudi 附錄 L224**：「Green 等 2011 兩個實驗室研究（對隨機 d 約 3.9，對啟發法不顯著）」把兩個實驗混成一句。實驗 1 是對隨機 d ≈ 3.9、對啟發法不顯著；實驗 2 對隨機的效果原文記「?」，對專家不顯著。L91「14 個研究裡 11 個勝過基準」可以補半句：這一群的基準多是隨機順序（14 列裡 8 列只有 R）。
- **Dringoli 附錄 L222**：「平均增益 p = 0.03、增益平均 p = 0.08」兩個中文名太像，讀者分不出來。建議寫成「各人增益的平均（ḡ）p = 0.03；平均分數算出的增益（g）p = 0.08」。L75 寫「讀完立刻考計算題」，但後測前有一頁三種內容都能重看的複習頁，抽取紀錄列為設計上看得到的限制。正文或附錄建議補一句。
- **Baroody L54**「作者也承認照順序教的那組受的相關訓練總量較多」：原文（L255）是說無法排除另一個假設：兩個概念其實分不開，HLT 組贏是因為多受了 count-to-cardinal 訓練。附錄 L218 寫成「無法排除」是準的，正文可以照附錄的口氣，並點出這個假設會動搖「必要」的判讀。
- **回頭練的證據其實不一致**：Maltagliati 等的做法（L127 自己也說比較接近間隔提取練習）是唯一的「回頭練舊內容」實作，結果是上過的學生評價中立、無法判斷成效。Rohrer 的結果則支持混排練習。兩者可以列進「來源說法不同的地方」，可以做的事第 3 條也該帶到這一點。
- **第 15 篇（後設理解，已發佈）**寫過讀者把交錯判斷成比較沒效（Yan 2016、Macaluso 2022）。這和可以做的事第 2、3 條（讓讀者做混合判斷題）直接相關，可以補一個站內連結。
- **跨篇提醒，不是本篇的錯**：未發佈的第 19 篇（`2026-10-14-why-readers-dont-finish.md` L269）把「系列沒教過的先備知識給站內連結」判為「本站的選擇」；本篇 L181 與已發佈的第 12 篇 L247 判為「方向有支持」。兩篇發佈前要統一。第 19 篇的可以做的事第 2、3 條和本篇第 5、6 條幾乎相同，Mullaney 的數字也在第 12、18、19 三篇各寫一次。
- L24「清單上剩下的那篇」：讀者不知道是哪份清單，照第 12 篇改成「來源清單上」。
- L150「我找到的統合分析只讀得到摘要」：依閱讀清單，Landers 與 Reddock 2017 連摘要以外的結果節都沒拿到，只有參考文獻。可改成「只讀到摘要或更少」，或和 L209 用同一種說法。
- tags 的 `blog` 被 `check-post-quality` 警告，沒有對應內容；確認同系列的用法後再決定留不留。

## 沒問題的項目

- **英文引文逐字比對**（腳本把 raw 檔的空白與斷行正規化後比對）：14 條全部逐字相符。依序是 Baroody「an LT approach is only as good as the LT it uses.」「corroborates the efficacy and basic assumptions」；PATHOS「we also do not claim … baseline instructional sequence」「very fragmented」；Doroudi「the order of content almost certainly matters …」；Rohrer「In short, interleaved practice guarantees spaced practice.」「the optimal proportion is certainly unknowable」；Brunmair「does not imply that interleaving is ineffective …」；Ireland「the lack of evidence offered for the efficacy of the spiral approach」；Mullaney「students will take advantage of whatever flexibility in pacing is offered.」「may be a viable strategy」；Dringoli「The optimal sequence …」「No sequence provides …」；Maltagliati「strongly in favor」。
- **數字**：正文與附錄的作者、年份、樣本數、效果量、百分比，逐段對過 11 份抽取紀錄，除了上面列的問題都對得上。對過的包括 PATHOS 的 62.6/57.3、d = 0.322、448/209、雙尾 0.021、四比四；Baroody 的 4/7、1/3、152 人 0.55、15 人實驗的 7/8；Rohrer 的 60.7/37.6、d 0.83 [0.68, 0.97]、22.17、103/10/33 天；教科書約 9.7%/81%、7%–31%、Saxon 1,491/3,016；Brunmair 的 0.42→0.29、說明文 0.21 p = .119、字詞 −0.39 3 篇；Maltagliati 的 8.2/8.2/5.0、224/229/227；Mullaney 的 30–40% 與 20% 以下、0.056/0.057；Guo 的 67–86%、22%、1.04 對 0.3、54%/30%。推算的數字有標成我算的，例如 L228「我依平均數回推」。
- **⚠ 來源**：Fang 2019、Scheiter 2007 正文只寫「存在、沒讀到合法公開全文」，沒有引用數字，也沒有列進參考資料（只在 L211 附 DOI 說明存在），符合規則。只有 ALEKS 的描述要改引 PATHOS，見建議修。
- **PATHOS 讀圖判斷**：PDF 第 7 頁 Figure 2 已核對（見建議修第一條）。正文 L66 與限制 L210 都標了「我讀圖的判斷，論文沒有這樣寫」。
- **其他標成推論的地方**：必要與促進之分用到成人、PATHOS 與 Doroudi 可以並存、可以做的事第 1 到 5 條，都在當場標了推論。螺旋式只寫成「沒有證據」，沒有寫成「無效」。Maltagliati 寫成「無法判斷」。MOOC 兩篇都註明沒有學習測驗。
- **研究者代名詞**：全文沒有「他／她」指研究者。
- **本站現況（2026-10-14 17:00 查）**：
  - `series-curriculum-design` 的依賴關係、五條弧線原則、逐對找斷崖、「讀者需要前置知識但系列沒教→加站內連結」，描述都正確（SKILL.md L31、L40–46、L61–72）。
  - 「未在系列教過的先備給可到達的橋接連結」出自 course-guide-contract L35。
  - 文章頁有系列時，上一篇／下一篇改用系列順序：`src/pages/posts/[...slug].astro` L45–49 的 `primarySeriesNav` 確認。
  - 本系列的弧線來自規劃檔 L13，且是照 series-curriculum-design 排的（規劃檔標題）。
  - 本站沒有分析工具：`src/`、`wrangler.jsonc`、astro 設定裡 grep 不到 posthog、gtag、cloudflareinsights 等字樣，與規劃檔 L93 一致。
  - 只有「順序跟著原課」一處寫錯，見必須修第 3 條。
- **站內連結**：第 12、1、9、10 篇的檔案都存在，`draft: false`，已 commit（212799e8、fd1844a5）。第 16、17 篇未發佈，文中沒有放連結，符合寫稿說明。「第 9 篇與第 12 篇的對照表已列過」屬實（第 9 篇 L182、第 12 篇 L247）。L177「第 1 篇整理的具體與抽象實驗方向不一」和第 1 篇 L36、L78 一致。
- **外部連結**：20 條。12 條直接回 200。8 條 DOI 回 302，分別轉到 doi.apa.org、tandfonline、dl.acm.org、mdpi.com，這些出版者的頁面擋 curl，回 403，所以只確認 DOI 能解析，頁面內容沒有確認。
- **用語**：`check-tw-terms.mjs` 0 blocking、0 to review；我另外手動掃過替換表的常見詞，沒有命中。

## 沒做的事

- 沒有查第 19 篇以外的未發佈篇（16、17 等）和本篇有沒有矛盾。第 19 篇只用 grep 看了 Mullaney 相關的段落。
- 沒有逐條核對 Baroody、Doroudi、Dringoli、Mullaney、Guo 抽取紀錄所根據的原文表格。這五份在 `_audit/` 沒有抽查紀錄（Baroody 在 group-01 標通過），我信任抽取紀錄的表格數字，只回 raw 檔核了引文、PATHOS 的刪邊程序與 ALEKS 段、Baroody L255、Brunmair 的保留間隔編碼。
- 沒有開 PATHOS 補充材料或預註冊文件，沒有跑 pnpm dev／build，沒有看渲染頁面。

## 2026-10-14 複審

- sha256 複審前（17:07:16）：`b9b9114fe96394aba3ce947bf804c6f7ec967fb2a947fdd696f5f9a575e047ee`；複審後見回報（相同即無人改檔）。檔案 260 行。

### 前次必須修，逐項確認

1. PATHOS 刪邊的人（L66）：已改為「研究者刪掉違反先備關係的轉換之後留下的邊」，並加「以相鄰兩步的轉換來看」「論文沒有公布完整的先備關係」，與 L61、plain 檔 L642–655 一致。**已修**。
2. Rohrer 的操弄：L97 小標改「同一批題目分散到多張作業並混排」；L107 新增「注意這不是先教完再混進後面」並標推論；L34、L183、L198、L208、L215 都改寫或標推論。**已修**。
3. 「順序跟著原課」：L18 改為「一堂一篇、不拆成兩篇，作業排在它依賴的那一堂之後；系列的 order 是本站的閱讀順序，不等於原課的堂次」，回 course-guide-contract L12–13 與 `docs/cmu10423-rebuild-2026-10-12.md` L36 核對相符；核心原則引句與 series-curriculum-design L9 逐字相符；L185 對照列改寫正確。**已修**。
4. 不顯著用語：tldr、L32、L46、L48、L81、L85、L164、L184、附錄 L235 都改成「沒有顯著勝過／沒有測到差異／沒有測到調節效果」。全文再 grep「沒有差異／沒有贏過／一樣好」零命中（剩下的「沒有效果量」是正確用法）。**已修**。

### 前次建議修

全部處理：L178 表內標讀圖判斷；L93 ALEKS 改引 PATHOS 背景段（回 plain 檔 L444–448「use diagnostics derived from the knowledge space of a domain to assess a learner's current state and recommend next steps during instruction」，中文轉述相符），Doroudi 不涵蓋 ALEKS 已標「我推測」並列入 L215；L135 改連第 12 篇、不再重複數字，附錄 Mullaney 改指第 12 篇附錄（第 12 篇 L282 確有那些數字）；Green 兩實驗分開寫（L229）；配對聯想基準 8／14 是隨機（L91，對抽取紀錄 #25）；Dringoli 增益名稱改 ḡ／g 並補複習頁（L75、L227，對抽取紀錄 #1、#5）；Baroody 劑量混淆改為「無法排除另一個解釋」（L54、L223，對原文 L255）；新增「回頭練舊內容有沒有用」一組（L168）；第 15 篇連結（已發佈，order 15，commit 212799e8）；「來源清單上」「只讀到摘要或更少」已改。

### 新引入的問題

**必須修**

1. **L179 新增的對照列把 PATHOS 套到「學習者的旅程 vs 教授的知識分類」上，與原文不合**。文中寫對照順序「照研究發展史排，正好是這條原則要避免的那種」。但 series-curriculum-design L9 要避免的是「教授的知識分類排序」，照發展史排不是知識分類；反而 PATHOS 勝出的順序是依概念群組分三段（隨機微積分、Langevin 取樣、DDPM，plain 檔 L670–674「a clustering of the topics into three sections」），比對照順序更接近按知識分類分塊。所以這個實驗不能當成「旅程勝過知識分類」的相鄰支持。建議改為「精讀的來源沒有測過；PATHOS 比的是發展史順序對轉換成本低、同群概念連著教的順序，和這條原則的對比不是同一件事」，依據強度改「本站的選擇」。

**建議修**

- L260 本站文章清單沒有加入新連的第 15 篇（metacomprehension）。
- L196「讀者自己多半會覺得這種混著來的練習比較沒效」：第 15 篇的依據是實驗室裡的類別學習（畫作、鳥類照片），不是練習題混排；可加「在類別學習的實驗裡」。

### 其他

- 台灣用語：`check-tw-terms.mjs` 0 blocking、0 to review；人工再掃替換表常見詞無命中。研究者代名詞無。
- 新寫的本站規格描述（L18、L185）回 contract 與 skill 核對無誤；唯一的新錯是 L179。

## 2026-10-14 第三輪：修正確認與英文稿

- sha256（17:24 審前，審後相同）：中文 `4f05f5645469ffa0977909cac457e14ec6505da0e1cf9ed35684f9190fc8c694`；英文 `e693a488643a44010e6f016da6237198520194f5ea54aeaf258c3f18f4dddfb7`。兩檔各 262 行。

### 上一輪三項確認（中文稿）

1. L181「用學習者的旅程排序」列：改為「精讀的來源沒有測過」，說明發展史順序不是知識分類、勝出順序反而分三群連著教，依據強度「本站的選擇」。與 PATHOS plain 檔 L670–674 一致。**已修**。
2. L198 第 15 篇連結加上「那些實驗是畫作與鳥類照片的分類學習，不是練習題混排」。**已修**。
3. L262 本站文章清單加入第 15 篇。**已修**。

### 英文稿

**必須修**

無。

**建議修**

- L18「This is part 18 … in Part Four」：「part」同時指篇與大段，讀起來混淆；同系列英文稿的寫法是「This is part 15 of the series "Writing Articles That Teach," in its third section, "…"」，建議照用（in its fourth section, "after some time has passed"）。
- L36「with correction」意思不清（對應中文「有訂正」），建議「with students correcting every problem」。
- L154「the meta-analyses I found I could read only as abstracts or less」語序彆扭，建議「for the meta-analyses I found, I could read only the abstracts, or less」。
- L200「have the reader do a question」「Choosing "do a question"」：英文較自然的是「answer a question」「work a problem」。

### 沒問題的項目

- **中英一致**：逐段對照正文、先看結論表、來源說法不同、對照表（含新改的 L181 那列）、可以做的事 1–6、限制、附錄與參考資料；數字、條件、推論標記、依據強度判定全部一致，沒有漏段或多出的內容。
- **英文引號內逐字**：先前核過的 14 條原文引句英文稿都照原樣保留；另核了只出現在英文稿的「I could easily create my own interleaved assignments.」（Rohrer 作者稿 L1524–1526，原文跨行）、「immediately」（PATHOS）、「strongly facilitative」「necessary」（Baroody Table 1 的用語，抽查 group-01 已核過表）。L20 引號內的本站規則是中文規格的翻譯，不是來源引文，可以接受。
- **代名詞**：全文沒有 he/she/his/her/him 指涉任何人（研究者一律用 the authors／姓名）。
- **連結**：中英互連行（中文 L16、英文 L16）都在；英文稿站內連結 5 個目標檔（第 12、1、9、10、15 篇英文版）都存在、`draft: false`、已 commit；外部連結與中文稿同一組，先前已查過。
- **英文自然度**：整體通順，用語一致（certificate earners、backjumps、interleaved／blocked）；只有上面四處建議。

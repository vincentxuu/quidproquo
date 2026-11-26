# 審稿報告：order 26〈教學文章的寫法能不能用實驗驗證〉

- 文章：`src/content/posts/learning/2026-10-14-platform-experiments-rubrics-design-research.md`（只有中文稿，未審中英一致）
- 審稿時間：2026-10-15 09:38–09:43（CST）
- sha256 審前：`364228b0dc814f38349848c01d818a2cd4a98027b0e6e080d35adcf18a6b24c8`
- sha256 審後：`364228b0dc814f38349848c01d818a2cd4a98027b0e6e080d35adcf18a6b24c8`（相同，審稿期間沒有人改檔）
- 本站對照用的規格：`.agents/skills/post/references/course-guide-contract.md`，sha256 `e32718f57ceaa235bdf4a6d9847cdc3d2bde1eb2dcfa9414f637624373c1c559`
- 依據：`REVIEW-BRIEF-research-posts.md`、`.research/2026-10-14-writing-brief.md`；抽取紀錄 11 份（`articles-that-teach/` 10 份＋`teaching-text/koedinger2015.md`）全部讀完；`_audit/` group-01、02、07、08、11、12、14、15 與 `provenance.md` 中相關列。

## 必須修

1. **研究者代名詞從名字推測（L207、L207、L210、L212、L214）**。Brase 寫成「她」五次。抽取紀錄（`brase2024-dbr-argumentation.md`）與原文首頁都沒有寫作者的代名詞，只有名字 Alexa (Kristin) Brase。改成「Brase」或「作者」，例如「Brase 只看一本…」「Brase 明說…」「作者歸納出…」「作者轉述的一個案例…」「作者提醒讀這類回顧的人」。
2. **不顯著寫成「沒有關係」（L170）**。「而且面向分數和通過率沒有直接關係」。Lee 等的結果是最終模型裡沒有一個面向對通過率有顯著的直接路徑（唯一留下的「課程帶領→通過率」β = .155 不顯著，其餘是刪掉的不顯著路徑；紀錄第 22、23 項）。改成「面向分數對通過率沒有測到顯著的直接路徑」。同句後半「它不能說量表分數和『學習』無關」可以保留。
3. **紀錄自己算的數字沒標成計算值（附錄 L300、L312；限制 L293）**。寫稿說明規定紀錄標「本紀錄計算」的要寫成「我從它的表算出」。
   - L300「19 個研究問題的實驗數合計 87、學生數合計 61,640」是紀錄加總 Table 2 得出的（`prihar2022-trends.md` L49「我自己加總」），附錄寫得像原文數字。改成「我把 Table 2 各列加總，實驗數 87、學生數 61,640…」。
   - L312 Yuan 與 Recker 的「（我依附錄重算…共 17 筆算的）」已標明，但 L293「我自己算的數字」只列 Kizilcec 8.8% 與 Zheng 重算卡方，漏了這一項和 Prihar 的加總。補進 L293。
4. **規格事實的寫法超出條文（L273）**。「但審稿通過在規格裡也叫『教學驗收』」。`course-guide-contract.md` L72 只寫「verify 綠或來源全部 Confirmed 不能替代教學驗收」；L71 寫的是獨立審稿者做「語意審稿」，沒有報告時「狀態只能是待驗收」。規格沒有把審稿通過直接命名為「教學驗收」，這是把兩條放在一起讀出來的。建議改成：「規格把獨立審稿報告當成驗收的條件（沒有報告只能算『待驗收』），而審稿同樣沒有量讀者學到什麼。」
5. **重算卡方的位置寫錯（L292）**。「Zheng 的表上有幾處顯著性標示和數字對不起來」。Zheng 的四張表只有次數與百分比；標顯著的卡方值寫在正文（紀錄 L60、L88、L95，主檔 L133–141、L169、L181）。改成「Zheng 正文報的幾個卡方值和它標的顯著性對不起來」。

## 建議修

- L53 小標「完成門檻只影響完成率」：只看完成者是沒有測到差異，不是證明沒有影響。可改成「完成門檻的差別幾乎都來自完成率」（貼近作者原句「The vast majority of the effects … come from more students failing to complete」）。
- L39、L165、L273、tldr 的「九個面向沒有一個直接預測通過率」：意思接近，但更精確的寫法是「沒有一個面向對通過率有顯著的直接路徑」。至少正文 L165 那一處改。
- L123 Koedinger：「只多做練習的人表現優異的比例並沒有比只多看影片的人高」。數字是 16% 對 15%，沒有做檢定。改成「（16%）和只多看影片的人（15%）差不多」，和第 8 篇 L151、第 25 篇 L118 的寫法一致。
- L69 Sales：「和 t 檢定比變差超過 10% 的，全部發生在不到 80 人的子群」。原文這句只講 ReLOOP（只用預測值調整）對 t 檢定。附錄 L302 寫對了，正文補上主詞「只用預測值調整的方法」。
- L79 Chen：「拖放格式…序列內的後續題目答對較多」沒有寫比較對象，要補「比選擇題版」。
- L87「他們列了 MOOC 做實驗的三個難處，對寫教材的人都適用」：後半是本站的推論，要標成「我認為…」，或移到「合起來看」。
- L65「常聽到的說法是…」、L151「這張表常被讀成…」、L172「常被引用的研究」、L220「另一篇常被引用的評估」：這四處講流傳程度都沒有來源。L65 可以改成「Sales 等人的摘要把它當前提」；其餘三處刪掉「常」，或改成「容易被讀成」。
- L59「照這條標準，站得住的是…」：這是紀錄把作者的標準套到圖上逐項篩出來的（紀錄 L135），可以加「我照這條標準逐項看」。
- L262「正式站的流量統計是 Cloudflare 的匯總數字」：第 19、25 篇都寫「正式站至少載入了 Cloudflare Web Analytics」，這裡跟著加「至少」，避免讀成「只有」。
- check-post-quality 的兩個 WARN：tag `ab-testing` 與 `blog` 在正文沒有明顯的對應詞。正文有「A/B 測試」與「部落格」，應該是檢查器的對應表沒收中文，可以忽略或換標籤。

## 指派訊息要判斷的事

1. **「對照本站的做法」表裡的本站事實**（2026-10-15 09:40 核對）：
   - 「課程導讀規格從 2026-10-11 建立到 10-14，git 紀錄裡有 12 筆提交動到它」：**對**。`git log --diff-filter=A` 顯示 4ecceb39 在 2026-10-11 建立；`git log --follow` 共 12 筆，最後一筆是 2a0cdf9b（2026-10-14 16:45）；工作目錄沒有未提交的修改。
   - 「規格文末列了七條設計依據，三條寫明依據是什麼樣的研究」：**對**。L77–83 共 7 條。寫了研究類型的三條是 NN/g（「8 人的質性研究」）、Karnad（「LSE 文獻回顧」）、Szpunar／Lawson 與 Mayer（「實驗…受試者是看短片的大學生」）。Anthropic、CMU、IES、Diátaxis 四條沒有寫。
   - 「審稿通過在規格裡也叫『教學驗收』」：**條文沒有這樣寫**，見必須修第 4 項。
   - 其他：「本站踩過」加日期的條文共 7 處，「不少條文」說得通。「這只驗區塊順序…不能判定教學品質」在 L70，「不能宣稱 lint 能自動判斷學會與否」與「保留好壞樣本對照，由獨立審稿者指出正文證據」在 L73，都逐字相符。網站程式 `src/` 裡沒有 A/B 分流機制。
2. **Zheng 重算卡方寫成「我依表上次數重算」**：**可以這樣寫**。寫稿說明規定紀錄自己算的要寫成「我從它的表算出」，本系列一直用「我」指本站這一側（第 19 篇的 8.8% 也是這樣寫）。數字我自己重跑過：2×2、不加連續性校正，交代修改 32/45 對 66/117 得 χ² = 2.94、p = .086，遠距 2/45 對 20/117 得 χ² = 4.43、p = .035，另外四項也和紀錄相同，可以重現。L316 附錄寫明了「2×2 卡方（不加校正）」與「原文沒有寫用的是哪一種檢定」，交代得夠。要修的只有 L292 把位置寫成「表上」（必須修第 5 項）。
3. **「同一篇的摘要與正文」七列表**：**建議移到附錄**，正文留一段話。理由：
   - 七列的「正文與表」欄幾乎都是前面各節已經寫過的內容（Prihar 的 103／50 與門檻、Chen 的投入與學習、Kizilcec 的數量級、Roschelle 的標題），正文讀到這裡等於重讀一次。
   - 第 25 篇處理同一件事只用一段話（該篇 L180）。
   - 正文的數字已經很密。
   - 正文可以留三四句：11 份裡有 7 份的摘要或標題比正文強，最會改變結論的三處是 Kizilcec「小一個數量級」只對一項成立、Prihar 的門檻只動到完成率、Zheng「修改多半沒交代」與表相反；完整對照見附錄。「可以做的事」第 2 條的「上一節七份來源」要跟著改成指向附錄。
   - 如果站主想留在正文也可以，表本身沒有錯。逐列對過：Sales 的「超過 250」對 227、「30–50%」對約 30%；Chen 的兩個指標；Yuan 的「little」對 6/14；Brase 的「often」對 3–6 篇。
4. **Jaggars & Xu、Anderson & Shattuck 只寫存在**：**做到了**。L172、L220、L295 只寫題目層級的主題（取自題名），沒有引任何結果，也沒有列進參考資料。Lee 等紀錄裡轉述了 Jaggars & Xu 的結果（只有人際互動顯著），文章沒有用，這樣是對的。
5. **和第 25 篇（`2026-10-14-reader-signals-vs-learning.md`）說法一致**：**一致**。Chen 2016 的 11,000 人、七個實驗只報兩個、36–113 人、投入一支顯著與方向不一、學習兩支顯著方向相反、「eye opening」引句，Koedinger 的 0.44／0.065、題庫同源、因果模型的寫法，兩篇都相同。差別只有 Koedinger 期末考那句的措辭，見建議修。另外注意：第 25 篇在工作目錄裡仍是未追蹤檔（`git status` 顯示 `??`），不是「已發佈」。第 26 篇 L16 只寫「前一篇」、沒有放連結，以現況來說是對的；第 25 篇提交後可以補連結。
6. **不顯著不寫成沒有效果**：除了必須修第 2 項與建議修的 L53，全文都用「沒有測到差異」，L71、L224 也把「沒有效果」與「檢定力不足」並列。
7. **英文引號與原文逐字相同**：12 處全部回 raw 原文檔核對過（Chen 兩處、Kizilcec、Sales 兩處、Lee 兩處、Yuan、Tinoca、Brase 三處、Koedinger），比對時忽略空白與斷行，**全部相符**。
8. **全形標點緊接收尾 `**`**：逐一檢查全文的粗體，依 CommonMark 的左右側規則，**沒有會讓粗體失效的位置**。L113、L273 開頭是「**「」，前面是空白，收尾的 `**` 前後都是標點，都能正確渲染。

## 沒問題的項目

- **來源核對**：每個作者、年份、樣本數、效果量、百分比都回抽取紀錄核對過，除了上面列的問題全部相符，包括：
  - Prihar 的 103／50／30,408、六種輔助的 d／n／p、門檻三欄、激勵 −0.072、選擇 0.014；
  - Sales 的 84→383→227、38／3／2、子群 375／0／0、11–13%；
  - Chen 的 Table 1、2、5；
  - Roschelle 的 46→43、2,850、8.84、g 0.18／0.29／0.12、更正啟事、14 小時；
  - Kizilcec 的 269,169、Table 1 的先前與本研究、±2.79／−1.62、54.3%、13.38 對 12.81、71.6–77.7%（已採用抽查後的更正）；
  - Yuan 的 Table 1；Lee 的 KR-20、刪題、β、16.3%、CFI；
  - Zheng 的 Table 2–4；Tinoca 的 Fig. 12–18（圖上 50、正文 51 都有交代）；Brase 的 3／6／18 與八種論證篇數。
  - 抽查（`_audit/`）結果都是通過。
- **轉引**（L296）：Kohavi、Yuan 引的評分指引研究、Brahm 2017 都標成轉引；「可以做的事」第 6 條也寫了「轉引，我沒讀原文」。
- **結論與證據**：
  - 開頭 L26 交代了取樣偏誤，「證據的限制」涵蓋了單一平台、結果量數窄、多重比較、事後子群、選擇性報告、同團隊、只有回顧。
  - 來源衝突（Zheng 對 Tinoca、Prihar 對 Chen、先前研究對放大研究）並列，沒有選邊。
  - 推論都有標記（L103「我認為」、L129「以下是我的讀法」、L224、L268、L294）。
  - DBR 一節照實寫「目前沒有研究直接測過」，沒有用相鄰研究硬撐。
  - Roschelle 0.18 不和 Prihar 的 d 相加，這點有明寫。
- **用語**：`check-tw-terms.mjs` 零命中；手動掃替換表常見詞也沒有命中。「打分」（L21、L137）台灣也通用。「項目」（L143）是表頭的「品項」義。
- **連結**：
  - 站內三個連結（第 8、9、19 篇）檔案都存在，series order 分別是 8、9、19，和文中的篇號相符。
  - 外部 14 個 DOI／網址用 curl 檢查：EDM、arXiv、Springer、IRRODL、OLJ、EDeR、Elsevier 回 200；SAGE、PNAS、ACM、MDPI 回 403，是出版者擋 curl，DOI 都有正確轉址到出版者頁面。
  - 開頭沒有 `> 🌏 [English version]` 一行，和未出英文稿的第 25 篇一樣，等英文稿再補。
- **check-post-quality**：0 blocking，只有上面提到的 2 個 tag WARN。

## 我沒做的事

- 沒有中英一致檢查，因為沒有英文稿。
- 沒有回 PDF 版面重看圖表，用的是抽取紀錄與 `_audit` 的版面核對結果。Zheng 只有出版者 HTML 表格頁，紀錄也註明沒有對 PDF。
- 外部連結回 403 的四個沒有用瀏覽器再開。
- 沒有跑 `pnpm dev`／build，也沒有看渲染後的頁面；粗體渲染只依規則判斷。
- 沒有改文章，也沒有 commit。

## 2026-10-15 複審（接手後）

- 審稿時間：2026-10-15 11:15–11:21（CST）；複審者沒有參與撰寫，也沒有參與修改
- sha256 審前：`ac30105bdf19409ccf1e927efce7edc87f238c6e7b444fc3f8dca9027e4ed6e0`
- sha256 審後：`ac30105bdf19409ccf1e927efce7edc87f238c6e7b444fc3f8dca9027e4ed6e0`（相同，複審期間沒有人改檔）
- 對照規格 `course-guide-contract.md` sha256 仍是 `e32718f5…c559`，`git log --follow` 仍是 12 筆，最後一筆 2a0cdf9b（2026-10-14 16:45），工作目錄沒有修改
- 依據：上一輪報告；抽取紀錄 `prihar2022-trends.md`、`sales2023-auxiliary-data.md`、`lee2020-rubric-validity.md`、`zheng2015-dbr-review.md`、`yuan2015-oer-rubrics.md`、`brase2024-dbr-argumentation.md`、`chen2016-ab-experiments-mooc.md`、`teaching-text/koedinger2015.md` 中與改動段落相關的部分

### 上一輪各項的處理（行號是現在的版本）

必須修：

1. Brase 代名詞：**已改**。L207、L210–L214 改用「Brase」「作者」；全文 grep「她」零命中，「他們」只用在多位作者的研究團隊（L57、L59、L87、L103、L115、L141）。
2. L170 不顯著寫成「沒有關係」：**已改**，現在是「面向分數對通過率沒有測到顯著的直接路徑」。
3. 紀錄自己算的數字：**已改**。附錄 L288 寫「我把 19 個研究問題的實驗數與學生數各自加總，得到 87 與 61,640」；限制 L281 補齊四項（Kizilcec 8.8%、Zheng 重算卡方、Prihar 加總、Yuan 與 Recker 統計量的筆數）。
4. 「教學驗收」超出條文：**已改**。L261 改成「本站規格已經規定檢查腳本綠燈不能替代教學驗收；規格把獨立審稿報告當成驗收的條件（沒有報告只能算『待驗收』）」，和規格 L71、L72 相符（L72 的「verify 綠」就是檢查腳本綠燈）。對照表 L246–L250 不再有這句。
5. 重算卡方的位置：**已改**。L280「Zheng 正文報的幾個卡方值和它標的顯著性對不起來」；附錄 L304 也寫「原文報的卡方值」。

建議修：

- L53 小標：**已改**為「完成門檻的差別幾乎都來自完成率」。
- 「沒有一個直接預測通過率」：L39、L165、L261、tldr 都**已改**為「沒有一個對通過率有顯著的直接路徑」。
- L123 Koedinger：**已改**為「（16%）和只多看影片的人（15%）差不多」，和紀錄 L143 相符。
- L69 Sales 主詞：**已改**，補了「只用預測值調整的方法」。
- L79 Chen 比較對象：**已改**，「比選擇題版答對較多」。
- L87 推論標記：**已改**，「我認為這三點對寫教材的人也適用」。
- 流傳程度沒有來源：**已改**。L65 改成「是下面這篇在摘要裡當成前提的說法，但它沒有用資料檢驗這句話」（紀錄 sales L137、L144 支持）；L151「容易被讀成」；L172「還有一篇相關的研究」；L220「另一篇相關的評估」。
- L59：**已改**，「我照這條標準逐項看」。
- L250 Cloudflare：**已改**，「正式站至少載入了 Cloudflare Web Analytics」。
- tag WARN：**沒改**。理由合理：正文有「A/B 測試」「部落格」，是檢查器對應表沒收中文。
- 摘要與正文七列表（指派判斷第 3 項）：**已照建議移到附錄**（L310–L322），正文 L238 留一段，「可以做的事」第 2 條（L259）改成指向附錄。

### 改稿新引入的問題

逐段回紀錄核對了改動處與前後文（L16–L26、L39、L52–L71、L79–L93、L123、L151、L163–L172、L207–L224、L238、L242–L262、L273–L284、L288、L300–L304、L310–L322），沒有找到事實與紀錄不符、不顯著寫成沒有效果、代名詞推測、推論未標的問題。粗體依 CommonMark 左右側規則逐一檢查（腳本掃全部 `**`），沒有會失效的位置。沒有替換表用語。

**必須修**：無。

**建議修**：

1. L165「最終模型裡唯一保留的直接路徑『課程帶領→通過率』不顯著」：最終模型裡「學生與內容的互動→通過率」（L164，β = .358）也是一條直接路徑，這句照字面讀會互相矛盾。紀錄 lee L126 的意思是「面向對通過率」唯一留下的直接路徑。改成「面向到通過率的直接路徑，最終模型只留下『課程帶領→通過率』一條，而且不顯著」。
2. L281「Yuan 與 Recker 指標數統計量的母數」：「母數」在台灣統計用語指參數（parameter），這裡要說的是「算進來的筆數是 17 不是 14」。改成「指標數統計量是用 17 筆算的，不是 14 份（附錄）」。附錄 L300 已經寫清楚，只改 L281 即可。
3. L238「有 7 份的摘要或標題說得比正文的表強」：附錄七列裡 Roschelle（標題對一整包介入）、Lee（「因果」對相關資料）比的不是表，而是正文的設計說明。可改成「說得比正文強」，和 L259 的寫法一致。

### 檢查腳本（2026-10-15 11:20）

- `node scripts/check-tw-terms.mjs <檔>`：0 blocking、0 to review。
- `node scripts/check-post-quality.mjs <檔>`：0 blocking，2 個 WARN（tag `ab-testing`、`blog`），同上一輪。
- `node scripts/check-process-leak.mjs <檔>`：沒有輸出，exit 0。

### 結論

**通過**。上一輪 5 項必須修全部改好，建議修除 tag WARN（理由合理）外全部處理；改稿沒有引入必須修的問題。剩 3 項建議修，不擋發佈。

### 沒做的事

- 沒有中英一致檢查（仍沒有英文稿）。
- 沒有重新核對未改動段落的每個數字（上一輪已全部對過）；只對改動段落與前後文回抽取紀錄核對，沒有回 raw 原文檔或 PDF。
- 沒有重跑外部連結的 curl；沒有跑 `pnpm dev`／build、沒有看渲染頁面（粗體只依規則判斷）。
- 第 25 篇仍是未追蹤檔，L16 沒放連結以現況是對的；沒有改文章，沒有 commit。

## 2026-10-15 英文稿審稿

- 審稿時間：2026-10-15 11:50–11:56（CST）；審稿者沒有參與撰寫、翻譯或修改
- 英文稿 `src/content/posts/learning/2026-10-14-platform-experiments-rubrics-design-research-en.md`
  - sha256 審前：`aa08b43d563176930247e5002f347a7f8be8c5a83f1c83a4c2ee564b87922b7b`
  - sha256 審後：`aa08b43d563176930247e5002f347a7f8be8c5a83f1c83a4c2ee564b87922b7b`（相同）
- 中文稿 `src/content/posts/learning/2026-10-14-platform-experiments-rubrics-design-research.md`
  - sha256 審前：`d4eb42d1bfc950ec692e736398ddd22e9354a4317eac9162f3ad6887b2869edb`
  - sha256 審後：`d4eb42d1bfc950ec692e736398ddd22e9354a4317eac9162f3ad6887b2869edb`（相同）
- 兩檔 mtime 都是 11:42:58，審稿期間沒有人改檔。
- 依據：中英兩稿全文逐段對照（兩稿空行分段後各 122 段，一一對應）；英文引號 14 處回 `.research/raw/` 原文檔比對；人名與期刊名回原文檔與 Crossref 比對；上一輪與複審報告。

### 中文稿有沒有其他變動

**有，不只加了 English version 那一行。** 複審報告記的版本是 `ac30105b…`。把現在的中文稿拿掉 English version 那一行還原，sha256 是 `1d58a8d3…`，對不上。我再把下面三處改回複審時的寫法，sha256 就變成 `ac30105bdf19409ccf1e927efce7edc87f238c6e7b444fc3f8dca9027e4ed6e0`，和複審版本逐位元組相同。所以複審之後的改動就是這四處，沒有別的：

1. L16 加 `> 🌏 [English version](…-en)` 與後面的空行（本輪允許的改動）。
2. L167：「最終模型裡唯一保留的直接路徑「課程帶領→通過率」不顯著。」改成「面向到通過率的直接路徑只留下「課程帶領→通過率」這一條，而且不顯著。」
3. L240：「說得比正文的表強」改成「說得比正文強」。
4. L283：「Yuan 與 Recker 指標數統計量的母數（附錄）」改成「Yuan 與 Recker 的指標數統計量是用 17 筆算的，不是 14 份（附錄）」。

第 2–4 處正好是複審報告「建議修」的三項，照複審給的寫法改，只動措辭，沒有改數字或結論。工作階段紀錄（`~/.pi/agent/sessions/…/2026-10-15T03-02-27-244Z_….jsonl`）顯示這三處是 11:35 改的，在複審（11:15–11:21）之後、寫英文稿之前。我判斷不必退回，但「English version 是唯一的中文稿改動」這個說法不對，需要站主知道；複審報告也沒有看過這三處改後的文字（我讀過，前後文通順，和抽取紀錄相符）。英文稿翻的是改後的版本（英文 L167、L240、L283 都對應新寫法），所以中英一致。

### 必須修

1. **英文 L61 拿掉了中文稿的推論標記，還成了懸垂修飾語。** 中文 L61 是「我照這條標準逐項看，站得住的是…」。這一句是上一輪審稿特別要求補上的，用來標明「哪幾項站得住」是本站把作者的標準套到圖上逐項篩出來的，不是作者自己說的。英文寫成「Going through the results item by item with that standard, the ones that hold up are…」，句子裡沒有「I」，而且 Going through 沒有對應的主詞，讀起來像作者自己篩的。改成：「I went through the results item by item with that standard; the ones that hold up are several kinds of support versus only the answer, two correct in a row versus three or four, and video versus text.」

### 建議修

1. tldr 第一句是懸垂修飾語（Pooling … 的主詞成了 hints）：改成「In a pooled analysis of 50 homework experiments on ASSISTments, hints, …」。
2. L161、L262 的 *adequate*：原文用的是「sufficient instructions」（lee2020rubricvalidity.txt），斜體讀起來像原文用詞，改成 *sufficient*。
3. L214「The outcomes were measured but never fed back into the design」：never 比中文的「沒有回饋到設計」和原文的「did not seem to have played a major role」都強，改成「were measured but weren't fed back into the design」。
4. L81「the 20% to 40% of students who got the first question wrong」：原文是各序列第一、二題第一次作答沒答對的學生（紀錄 chen 第 5 項），改成「who got the opening problems wrong at first」，貼近中文的「一開始答錯」。
5. L22 第一題「What have experiments produced on online learning platforms that are able to run randomized experiments?」重複又拗口，改成「What have randomized experiments produced on the online learning platforms that can run them?」。
6. L67「The paper below treats it as a premise in its abstract that…」的 it…that 結構拗口，改成「That A/B tests on such platforms are underpowered is a premise the paper below states in its abstract; it doesn't test the claim with data.」。
7. L109（64 字）拆成兩句：先寫研究、課程、期間與焦點樣本，再用冒號或第二句列四種寫作活動。L263（第 4 條的後半）、L282（Zheng 重算卡方）也各可拆一句。
8. L18「in its last section」：第 25、27 篇英文稿寫「sixth section」，第 26、28 篇寫「last section」（照中文的「最後一部分」）。系列內可統一成「its sixth and last section」；要動就中英一起動，不只改英文。
9. 開頭「The previous part」沒有連結，和中文一致。第 25 篇 -en 會一起發佈，之後可以中英一起補連結；只在英文加會造成中英不一致。

### 沒問題的項目

- **數字**：兩稿逐段抽出所有數字比對，差異全部是中文數字詞與英文數字互換（「九位作者」↔「six coauthors」加三位具名、「七成」↔「70%」、「六成掉到兩成五」↔「60% to 25%」、「19 萬多」↔「more than 190,000」、「2014 年 4 月」↔「April 2014」等），沒有數字不同或漏掉的。兩張主表的列數與欄位、附錄十一段、附錄對照表七列都對上。
- **內容增刪**：逐段對照，沒有新增或刪減的說法。小幅加字（如 Sales 附錄「improved precision」）不改意思。
- **英文引號**：14 處全部回原文檔逐字比對（忽略空白與換行）：Sales 兩處（sales2023abtests250.txt）、Chen 兩處（chen2016abmooc_PMC6302917.txt）、Kizilcec（kizilcec2020_PMC7334459.xml）、Koedinger（`.work/teaching-text-research/seq/koedinger2015.txt`）、Lee 三處（lee2020rubricvalidity.txt；「almost one-」在 L726 跨行，連字號是原文的）、Brase 三處（eder2125-dbr-reasoning.txt）、Tinoca（dbr-review-mdpi2022.md／.txt）、Yuan（yuan2015oerrubrics.txt），**全部相符**。L18 的 "how to know it works, and how to make it" 是系列段落名稱，不是引文，和第 25 篇英文稿寫法一致。中文稿用「」轉述的中文內容（例如 Roschelle 標題、Lee「不合理的軟體要求」、規格「保留好壞樣本對照…」），英文都沒有加引號，改用斜體或直接敘述。
- **代名詞**：全文 he/she/his/her/him 零命中；Brase 用「Brase」「the author」。原文在 Brahm 案例用了 her，英文沒有跟著用。
- **不顯著的寫法**：全文用「no difference was detected」「showed no detected difference」「no significant direct path was detected」。「no effect」只出現在兩處假設語氣（Sales：interventions that simply have no effect；Kohavi 轉引），和中文一致。L125「about the same」對應中文的「差不多」（16% 對 15%，原文沒做檢定），不是把不顯著譯成相同。
- **推論標記**：除必須修第 1 項，其他都保留了（In my view、I think、My reading is、This is my reading、Here is my reading、I calculated、by my calculation、The following is my reading）。
- **站內連結**：四個站內連結的目標檔都存在：中文版、第 8 篇 -en（order 8）、第 19 篇 -en（order 19）、第 9 篇 -en（order 9）；三篇 -en 都已進 git、`draft: false`。參考資料裡三篇站內文章的英文連結文字和各自英文標題相符。外部連結集合和中文稿完全相同。
- **篇號**：全部用 Part N（Part 8、9、19、26）；「Article 62」是 Brase 論文的期刊文章編號，不是篇號。
- **人名、期刊名、課名**：全部回原文檔或 Crossref 確認，沒有譯者推測的拼音。Lanqin Zheng（原文檔沒有名字，抽取紀錄說對過出版者頁，Crossref 也是 Lanqin Zheng）、Zhongzhou Chen、Ji Eun Lee、Min Yuan、Mimi Recker、Luís Tinoca、Alexa（Kristin）Brase、René F. Kizilcec、Jeremy Roschelle、Shanna Smith Jaggars、Di Xu、Terry Anderson、Julie Shattuck。期刊：Journal of Computers in Education、Research and Practice in Technology Enhanced Learning、AERA Open、Computers & Education、Educational Researcher、EDeR（Crossref 寫 "EDeR. Educational Design Research"）都相符。課名 8.MReVx 是原文的課號，英文稿寫成「a mechanics review course MIT ran on edX」，沒有自創英文課名。
- **用語**：「teaching acceptance」「spec(ification)」和第 25 篇英文稿用的詞一致。
- **檢查腳本（11:53）**：`node scripts/check-post-quality.mjs <英文檔>` → `OK: checked 1 post file, no quality issues found.`（exit 0；中文稿那兩個 tag WARN 在英文稿沒有出現）。另跑 `check-process-leak.mjs`：沒有輸出，exit 0。

### 結論

**修完必須修第 1 項就可以發佈。** 中英數字、表格、連結、引文都一致，引文逐字相符，沒有代名詞推測，不顯著的寫法正確。只有一處漏掉推論標記。另外要讓站主知道：中文稿在複審之後除了 English version 那一行，還照複審建議改了三處措辭。

### 沒做的事

- 沒有改文章，沒有 commit，沒有跑 `pnpm dev`／build，也沒有看渲染後的頁面。
- 沒有重跑外部連結的 curl（連結集合和中文稿相同，上一輪已檢查）。
- 沒有回 PDF 版面重看數字，數字只做中英對照；中文稿的數字以上一輪與複審的核對為準。
- 中文稿那三處複審後的措辭改動，我只讀過文字、確認和紀錄相符，沒有另外做一輪完整複審。

# 審稿：知識庫怎麼建 order 3〈怎麼連：Zettelkasten、Evergreen notes 與 MOC〉

- 中文：src/content/posts/learning/2026-10-22-zettelkasten-evergreen-notes-moc.md
- 英文：src/content/posts/learning/2026-10-22-zettelkasten-evergreen-notes-moc-en.md
- 審稿日：2026-10-22。獨立審稿，沒參與寫作，沒改文章。
- 嚴重度：🔴 必修／🟡 建議修／🟢 可選。行號是中文版；英文版行號相同（兩版段落一一對應）。

## post-verify

證據來源：`.work/research/building-knowledge-bases/extractions/` 的抽取紀錄（作者已全文精讀），必要處回 scratchpad `fulltext/` 原文 grep。另外用 Exa 重抓兩處高風險事實：Luhmann 檔案館說明頁（https://niklas-luhmann-archiv.de/nachlass/zettelkasten ，2026-10-22 直接讀全文），以及〈Kommunikation mit Zettelkästen〉的書目（Springer 章節頁 DOI 10.1007/978-3-322-87749-9_19＋檔案館書目頁 baier_kepplinger_reumann_1981，兩個來源都寫 1981）。Firecrawl 點數用完，Groundlane 沒用；網頁查證都走 Exa。

### 🔵 Misframed／說過頭（要修）

1. 🔴 **全稱句「沒有任何對照實驗」**
   - 原句：tldr「但沒有任何對照實驗測過 Zettelkasten 本身」；L69 小標「Zettelkasten 本身沒有對照實驗。」；L69「唯一直接操弄雙向連結的實驗是 2009 年在書目資料庫做的」。
   - 依據：`_order3-saturation.md`。(a) 搜尋只用 Exa、鎖 2024–2026，沒查 Google Scholar／ERIC／PsycINFO／非英文文獻（該檔「限制」段）。(b) 搜到一篇自稱拿 Zettelkasten 做兩組比較的研究：Malashenko et al. 2023（ESJ），作者判定不能當證據（非隨機、介入混了間隔複習、數字自相矛盾，見 `malashenko-2023-zettelkasten-spaced-repetition.md`）。所以「沒有任何」是錯的，正確的說法是「沒有可信的」。(c) Alford & Mendes 2009 是順帶搜到的，中文寫成「唯一」，英文寫成「The only experiment I found」，兩版強度不一樣。另外它的「雙向」系統還多了被引瀏覽、經典文章、影響評估等功能，typed 系統連介面欄數都不同（抽取紀錄「與摘要不一致處」第 2 點），稱「直接操弄雙向連結」說過頭了。
   - 改法：tldr 改成「目前找不到可信的對照實驗直接測過 Zettelkasten：唯一自稱做過的 2023 年研究，把間隔複習也混進實驗組」。小標改成「Zettelkasten 本身還沒有可信的對照實驗」。L69 開頭的範圍寫清楚：「我用英文文獻搜了 2024 到 2026 年的研究……」，並用一句話帶到 Malashenko 2023 不能用的原因。Alford 那句改成「我找到唯一接近的實驗是 2009 年……它的『雙向』版本同時多了被引瀏覽等功能，所以只能算粗略的證據」。

2. 🔴 **例子裡的永久筆記，理由不在它標的來源裡**
   - 原句：L101「email 不一樣，因為信是別人寄來、別人命名的。」L102「來源：Bergman et al. 2008、Whittaker et al. 2011」。
   - 依據：`whittaker-2011-email-refinding.md` 第 9 點。Whittaker 對「email 為什麼跟檔案不同」給了兩個可能原因：email 資料比較結構化，所以搜尋效果好；以及信量大，手動整理太累（「Future work needs to explore this more」）。他沒有說「別人命名」。這個理由出自 order 2 L31 作者自己的推論，而且 order 2 已標明「這是我的推論」。這個例子是要示範「忠於來源、用自己的話」，結果把作者推論掛在兩篇研究名下，正好示範了反例。
   - 改法：改成「email 不一樣：信量大、欄位又整齊，搜尋比較好用（Whittaker 的推測）。」或者保留「別人命名」，但來源行改成「我的推論，參考 Whittaker et al. 2011」。

3. 🟡 **生成效應的邊界條件，把兩篇統合分析混在一起**
   - 原句：L63「清單超過 50 項時也幾乎消失」。
   - 依據：Bertsch 2007 的 >50 項 d = .09，可以說「幾乎消失」。McCurdy 2020 的 >50 項是讀 .523、生成 .579，差約 5.6 個百分點，大約是整體效應（10 個百分點）的一半，只能說「變小」（`mccurdy-2020-generation-effect-meta.md` 第 12 點）。這一句前面剛引了 McCurdy，讀者會以為兩篇都是這個結果。
   - 改法：改成「清單一長，效應就明顯縮小（超過 50 項時，2007 年那份分析幾乎量不到）」。
   - 同段其他句子查過：「材料沒有意義時效應接近零」（Bertsch 非詞 .05、McCurdy .004）和「寫或打字產生的效應比口說小」（McCurdy t(120) = −2.06）都正確。

4. 🟡 **「手寫比打字好」不用管：結論比研究條件寬**
   - 原句：L65「把類似研究合起來看，兩種方式的測驗成績幾乎沒差……選工具時不必為了手寫而犧牲搜尋和連結。」
   - 依據：`urry-2021-laptop-replication.md`。Urry 的 mini meta-analysis 只有 k = 8，條件是「看影片講課、當天立即測驗、不能複習筆記」，作者自己說「should be considered preliminary」。Urry 也引了 Allen et al. 2020，該研究在課堂情境找到支持手寫的小效應。L65 的段名和結論句把這些條件都拿掉了。另外「2014 年一篇很有名的研究」沒有寫出是 Mueller & Oppenheimer，也沒有連結（見 post-review 第 2 項）。
   - 改法：第二句改成「在聽講後立即考、不能回看筆記的實驗裡，把 8 個類似研究合起來看，兩種方式的成績幾乎沒差」。結論句可以保留，這是作者的主張，原文寫得也夠直接。

5. 🟡 **超文本研究：「為什麼連」的證據比「連到哪裡」弱；Madrid 多出的連結是隨機的**
   - 原句：L67「比較能帶走的是：標清楚連到哪裡、為什麼連，比連結的數量重要。」以及「Madrid……認知負荷和學習成績都沒有差別」。
   - 依據：`destefano-lefevre-2007-hypertext-cognitive-load.md` 第 7 點。有證據支持的是「標出目的地內容」（連結預覽、目的地描述能提升學習）。至於「標出關係」，結果有好有壞：Baron 1996 有標籤的語意連結提高了找資訊的正確率，但 Jonassen & Wang 1993 只標關係類型的彈出視窗，對回憶沒有影響。`madrid-2009-number-of-links.md` 指出，8 連結組多出來的 5 個連結是從標籤池隨機抽的，連結放在選單裡，不是嵌在文字中，受試者是先備知識低的學生，而且被要求「永遠選最相關的」。所以「8 個連結沒有壞處」量的是多加干擾選項，不是多加有意義的連結。
   - 改法：Madrid 那句補半句「（多出來的 5 個是隨機抽的連結）」。結論句改成「研究支持的是標清楚連到哪裡；寫出為什麼連，是同一個方向再往前推一步」。L67 已經寫了「讀別人做好的超文本、只讀一次」，這點正確，保留。

6. 🟡 **「Luhmann 是為了寫書和論文才建卡片盒的」**
   - 原句：L135。
   - 依據：檔案館說明頁 3.1 與 4（本次直接重讀）：ZK I 是他在 Lüneburg、Hannover 當公務員時期的閱讀筆記；達到臨界量之後，卡片盒才「zunehmend」成為出版機器，而且「vielleicht sogar primär」是思考工具。說「為了寫書和論文才建」，把因果倒過來了。
   - 改法：改成「Luhmann 的卡片盒後來成了他寫書和論文的主要工具」。

7. 🟡 **「也承認他本來就是工作狂」的主詞**
   - 原句：L135「zettelkasten.de 說他出版了 50 本書和超過 600 篇文章，但也承認他本來就是工作狂」。英文版 L135 是「but also admits he was a workaholic」。
   - 依據：`zettelkasten-de-introduction.md` 註 2：「Luhmann's productivity wasn't so high just because he used a Zettelkasten. He worked all day, every day.」「承認」聽起來像在說 Luhmann 本人承認，其實是推廣者在替卡片盒的功勞打折扣。
   - 改法：改成「但也提醒，他產量高不只是因為卡片盒，他本來就是工作狂」。英文改成「but also notes that the slip box wasn't the only reason: he was a workaholic」。

8. 🟡 **「這不是 2020 年才有的新東西」沒有鋪墊**
   - 原句：L59。
   - 依據：「2020」出自 LYT Maps 頁的「came alive in 2020」（`lyt-mocs.md`），但正文從來沒提過 Milo 這句話，讀者不知道 2020 指什麼。
   - 改法：在 L55 補半句「Milo 說 MOC 是 2020 年隨著連結式筆記工具興起的」，或把 L59 第一句改成「它的概念比數位工具早得多」。

9. 🟢 **structure note 追溯到「匯總卡」是兩個來源接起來的**
   - 原句：L59「zettelkasten.de 把 structure note 追溯到 Luhmann 的匯總卡，就是上面那種一張列了最多 25 個連結的卡片」。
   - 依據：zk-intro.txt L270、L278 寫的是「Luhmann's hub notes」。「一張最多 25 個連結」出自檔案館的 Sammelverweise。兩者描述的是同一類卡（在一個主題區開頭列出很多連結），把它們接起來合理，但這是作者自己接的。
   - 改法：改成「zettelkasten.de 把它追溯到 Luhmann 的 hub notes，也就是檔案館說的匯總卡」。

10. 🟢 **tldr「用了幾年才開始產生新想法」**
    - 依據：Luhmann 原文是「needs a number of years in order to reach critical mass. Until then, it functions as a mere container」。改寫的方向沒錯，但「產生新想法」是作者的說法。
    - 改法：可以不改。要更貼原文，就改成「要好幾年才累積到夠用的量，之前只是收納盒」。

### 🟢 Confirmed

- 約 9 萬張卡片，1952 到 1997 年初，幾乎全手寫：檔案館說明頁 3.1「ca. 90.000 undatierte und mit wenigen Ausnahmen handschriftlich」「vermutlich zwischen 1952 und Anfang 1997」。（中文「大多手寫」比原文弱，見 post-polish。）
- 〈與卡片盒溝通〉1981：Springer 章節頁與檔案館書目頁都寫 1981（Öffentliche Meinung und sozialer Wandel, pp. 222–228）。
- 「decide against the systematic ordering … firm fixed place」「Given this technique, it is less important where we place a new note.」「The slip box needs a number of years…」三段引文都與 Kuehn 英譯逐字相符（luhmann-slipbox.txt）。中文寫「沒那麼要緊」，保留了原文的比較級，正確。
- 編號 57/12 → 57/13、57/12a、57/12a1：與英譯相符。號碼最長 13 位（「十幾碼」）、兩張卡之間插入數百張：檔案館 3.4。
- 連結 ZK I 約 18,000–20,000 條、ZK II 約 25,000–28,000 條，合計「四萬多」；匯總卡最多 25 個連結：檔案館 3.5。
- 每個關鍵字通常最多 4 個位置：檔案館 3.2(c)「in der Regel bei einem Schlagwort maximal vier Verweisstellen」。
- ZK I 有 108 個主題區、ZK II 有 11 大區，區內不是嚴格階層：檔案館 3.3。
- Matuschak 的「only about one thing … entirety」「there's no accumulation」「can't write anything at all」、「沒有一刀切的標準」（「no clear litmus test」）：am-atomic、am-concept、am-foryourself 原文都相符。「太大、太碎」的轉述忠於 am-atomic L14。
- zettelkasten.de 的「use your own words」（「core rules」）、「always state explicitly why you made it. This is the link context.」「Some sort of hierarchical structure is very useful.」、50 本書和超過 600 篇文章：zk-intro.txt 相符。
- LYT「an MOC often gets mistaken as a boring index… But an MOC is so much more.」、Mental Squeeze Point、gather／collide／navigate 三階段、三階段不是線性、沒有數量門檻：`lyt-mocs.md` 相符（後三項出自 3 Phases 和 Squeeze 頁，文章沒有連到這兩頁，見 post-review）。
- Bertsch 2007：86 篇研究，讀 .471 對生成 .559，約 9 個百分點。McCurdy 2020：126 篇，校正出版偏誤後還剩 .080，仍顯著。
- Urry 2021：概念題的手寫優勢沒有重現（g = −0.13）；mini meta-analysis 總分 g = 0.04。
- DeStefano & LeFevre 2007：連結數量的效應「inconsistent across studies」；加語意連結時，5 篇裡有 4 篇導航變慢；標了目的地的連結有幫助。
- Madrid 2009：3 對 8 個連結，負荷與學習都沒有差別；選擇時間 8.80 → 12.70 秒（約 4 秒）。
- Alford & Mendes 2009：信心 p = .0278，完成時間 p = .7978。（框架問題見上方第 1 項。）
- Ferreira 2025：7 人，資料夾、標籤、搜尋是主力；「retrieval strategy influences how they build」。文中寫「取決於」，比原文的「strongly related／influences」強一點，可以接受。
- 例子的文獻筆記：296 人、1,131 個檔案、94%、14.76 秒（成功者，文中寫「約 15 秒」）、深度 2.86、每層 2.236 秒、每項 0.106 秒、「up to 21」是從係數推出來的經驗法則、只測最近用過的檔案：全部和 `bergman-2010-folder-structure.md` 相符。
- 永久筆記一「多一層約等於多 21 項」：相符（但題目框架見 post-review）。永久筆記二「多數人靠點資料夾找；搜尋工具變好也沒改變」「逃生梯」：Bergman 2008 自評導覽 56–68%、搜尋 4–15%，Google Desktop 用 3 週後搜尋比例翻倍，7 個月後又回落；「fire escapes」的比喻相符。「沒改變」是簡化說法，但方向正確。

### 例子查核

- 文獻筆記與永久筆記一的數字，逐項回 Bergman 2010 抽取紀錄重算過：2.236 / 0.106 = 21.09，與文中寫的一致。
- 永久筆記二的 email 理由不忠於來源（上方第 2 項）。
- 第三步兩條連結的理由屬於作者示範，不是事實宣稱。邏輯問題交 post-review。

### 歸因標籤

全篇用「我」來標主張的地方只有 L69 一處（「我在……找不到」），沒有歸因堆疊。

範圍聲明：本次只檢查了文中已提出的約 45 條宣告，沒有評估文章對主題的覆蓋是否完整（交 post-review）。

下一步（未完成前不能 commit）：post-review、post-polish。

## post-review

### 機械檢查

- `pnpm verify`、`pnpm check:links`：見本節末尾「機械檢查結果」。
- `pnpm check:tw`：0 blocking、0 to review。
- `scan-ledger.sh`：模板化轉折、台灣中文高風險用詞、標題壓縮分類語氣都是 0 命中（人工計數另見 post-polish 第 2 項）。
- 跨節指代：只有 L59「上面那種」，對到 L29，指得到，沒問題。沒有西里爾字元或全形英數混入。
- frontmatter：必填欄位齊；`type: guide`、5 個 tags（kebab-case），description 和 tldr 沒有重複。`zettelkasten`、`evergreen-notes` 是新 tag，只有這篇的中英兩版在用，主題本身就是這兩個詞，保留合理。
- 文中沒有 diagram 區塊，所以沒跑 diagram-preview。

### 🔴 必修

1. **tldr 和正文的全稱句**：同 post-verify 第 1 項。tldr 最容易被整段摘走，這句一定要改。

2. **引用了外部事實，但那一句沒有連結（8.5）**
   - L65「這個說法來自 2014 年一篇很有名的研究」：沒有名字也沒有連結，應補上 [Mueller & Oppenheimer 2014](https://doi.org/10.1177/0956797614524581)。
   - L45「there's no accumulation」與 L137「can't write anything at all」：分別出自 Matuschak 的〈Evergreen notes should be concept-oriented〉和〈Write notes for yourself by default〉，但文中只連了 Evergreen notes 主頁。打開主頁的人看不到這兩句。L43 的 atomic 引文同理（出自〈…should be atomic〉）。
   - L57 Mental Squeeze Point 和三階段：出自 LYT〈The 3 Phases of MOCs〉和〈Mental Squeeze Point〉，文中只連了〈MOCs (defn)〉。
   - L135「50 本書和超過 600 篇文章」：這一句沒有連結。
   - L73、L94、L102 例子裡提到 Bergman 2010、Bergman 2008、Whittaker 2011，這三篇不在參考資料，也沒有連結；L73 至少要連回 order 2 或論文 DOI。
   - 改法：每處補 inline 連結，參考資料補上這 8 條左右。

### 🟡 建議修

3. **對照範圍卡，有三處覆蓋缺口**
   - 範圍卡列了「連結與反向連結」，但文章只講連結，沒講 Luhmann 會在被連的卡上寫回連（英譯 II-2；檔案館 3.5 a3「häufiger auch einen Rückverweis」）。L69 接著談「雙向連結」的實驗，讀者卻沒在前文讀到什麼是雙向連結。建議在 L29 補一句：「遠距連結常常在對方那張卡也記回來，這就是現在說的反向連結。」
   - 範圍卡寫「Evergreen notes 的五原則」，但文章把 zettelkasten.de 和 Matuschak 合併成四條，Matuschak 的五條裡少了 densely linked，也少了 associative ontologies over hierarchical taxonomies（讓結構自己長出來）。後者剛好和 L53 zettelkasten.de 說的「hierarchical structure is very useful」形成張力：一邊說先不要強加階層，一邊說結構卡有用。這正是讀者會卡住的地方，建議用一兩句交代：Matuschak 反對的是「一開始就分好類」，不是反對事後整理出地圖。標題寫了 Evergreen notes，讀者卻讀不到它的完整主張，算是對象覆蓋不足（6.5）。
   - 範圍卡寫手寫研究「不引」，正文卻用了一整段（L65）。如果保留，可以縮成一句接在 L63 後面：「常被引用的『手寫比打字好』，2021 年的直接重做沒有重現，選工具不必考慮這點。」這樣篇幅留給連結本身。

4. **自我檢查的判準，正文沒有教過**
   - L152「永久筆記有兩個條件：用自己的話寫，以及脫離原文也讀得懂」。「脫離原文也讀得懂」在四個原則裡沒出現。「永久筆記」「文獻筆記」這兩個詞也是到 L75、L85 才第一次出現，前面沒有定義。
   - 改法：在「現代版的四個原則」開頭補一段，說明文獻筆記（讀的時候記的摘要，跟著書走）和永久筆記（Matuschak 叫 evergreen note，跟著概念走、自己讀得懂）的分別。並把「脫離原文也讀得懂」掛在原子性那條：「capture the entirety of that thing」，加上 zettelkasten.de 說的「translate information to knowledge by adding context」。

5. **什麼時候建 MOC，全篇說法前後不一**
   - tldr「先從寫連結理由和一張地圖筆記（MOC）開始就夠了」；L146 今晚第 4 步「選一個筆記最多的主題建一張 MOC」。
   - 但 L139「等某個主題的筆記多到覺得亂，再建第一張 MOC」，L57 也說要等 Mental Squeeze Point。
   - 改法：tldr 改成「先從寫連結理由開始；某個主題的筆記多到覺得亂，再建第一張地圖筆記（MOC）」。今晚第 4 步加條件：「如果已經有一個主題讓你覺得亂，就替它建一張 MOC」。

6. **例子第三步的第一條連結理由，邏輯接不上**
   - L110–111「這解釋了為什麼收件匣不用分類，反正之後靠位置找的是已經歸好的東西，收件匣只是暫存。」
   - 問題有兩個。第一，「人靠記得位置找東西」這個論點，比較像在支持「要分類」，拿來解釋「收件匣不用分類」很拗口。order 1 給的理由其實是「過早歸檔」（Whittaker & Hirschberg）。第二，第二則筆記剛說「email 不一樣」，讀者容易把「收件匣」讀成 email 收件匣，兩句互相打架。這是全篇示範「寫出連結理由」的地方，理由必須清楚。
   - 改法：改成「連到〈收件匣每週清空〉：補充。收件匣只放還沒決定的東西，之後靠位置找的，是清完之後歸進資料夾的那些；所以清收件匣時要放對位置，收件匣本身不必分類。」或者換成一條「衝突」型的連結，順便示範 L144 說的三種關係。

7. **永久筆記一的標題比研究說得滿**
   - L90「資料夾太深比太大更貴」。研究量到的是一個換算比例（1 層 ≈ 21 項），不是「深一定比大貴」；Table 3 裡深度 2 到 6 的時間幾乎持平，R² 也只有 .22。另外 L82 文獻筆記寫了「限制：只測最近用過的檔案」，改寫成永久筆記時這條限制不見了，而示範永久筆記時，保留限制本身就是重點。
   - 改法：標題改成「多開一層資料夾，約等於多放 21 個項目」，內文加一行「只量過最近用過的檔案」。

8. **L59 的「2020」沒有鋪墊**：同 post-verify 第 8 項。

9. **英文引文直接夾在中文段落裡（9.5／語域）**：見 post-polish 第 1 項。

### 🟢 可選

10. **文體比例**：「研究支持到哪裡」約 2,800 字元，占正文（不含參考資料）約 25%，略高於「評測發現 15–20%」的建議。文章是 guide，研究段只有一節，不算分散，所以只列為可選。照第 3 項把手寫段縮短後，大約會回到 20%。
11. **圖**：L27 的編號分支（57/12 → 57/12a → 57/12a1，插在 57/12 和 57/13 之間）用文字很難想像，適合畫成一張小樹狀圖；L57 的 gather → collide → navigate 也可以畫成來回箭頭（非線性）。表格處理不了這兩處。
12. **台灣讀者位置（6.65）**：主題是全球通用的方法，不必硬塞台灣案例。如果要加，可以在「什麼時候不需要這些」提一句繁中工具的現況，但這不是必要的。
13. **開頭與斷崖處理**：L17–19 已交代和 order 2 的分工（「資料夾管行動，連結管想法」），符合規劃表 2→3 的斷崖處理。「讀完能做什麼」寫得明確，也由例子兌現了。
14. **反向大綱**：Luhmann → 現代原則 → 地圖 → 研究 → 例子 → 何時不需要 → 行動 → 自我檢查，順序說得出道理，每段都寫得出一句摘要。開頭的承諾（改寫成兩三則筆記、建一張地圖）有被兌現。

## post-polish

掃描結果（register-scan）：正文 39 段；長句 5 句；但書段落 15%（綠燈）；引述區塊 1 個；單段 4 個以上數字的有 5 段；研究者姓名當段落主詞 0；模板化轉折自動計數 0（人工另計，見第 2 項）；一般英文術語 0（掃描不計引號內文字，見第 1 項）。

### 🟡 建議修

1. **英文原句直接夾在中文段落裡，沒有中譯**
   - 位置：L25、L43、L45、L47、L49、L53、L55、L137，以及 L35 的英文 blockquote（L37 有一句白話收尾，算有處理）。
   - 問題：這些是保護片段，原文不能改，但中文讀者要自己讀英文。L29、L55 前後有中文轉述，其他幾處沒有。一段裡的英文句子太多，讀起來像研究筆記。
   - 改法：正文改用中文意譯，把原文放在括號或連結裡；只有措辭本身就是重點的地方才保留英文，例如 L29 的「less important」比較級，以及 L49 的「link context」這個術語。例：L49 改成「zettelkasten.de 的說法是：每條連結都要明確寫出為什麼連，這叫連結脈絡（link context）。」

2. **「不是 A，是 B」「不只是」反覆出現（人工計數約 9 處）**
   - 位置：L31「不是標籤」、L43「重點不是短，是完整講完一件事」、L47「是摘錄，不是筆記」、L55「不只是目錄」、L59「這不是 2020 年才有的新東西」、L63「不是寫筆記」、L67「不是自己長年經營」、L85「不是永久筆記」、L131「MOC 不只是目錄」。
   - 問題：超過同一篇 5 次的閾值，而且 L55 和 L131 兩處都寫「不只是目錄」。
   - 改法：至少改掉 3 到 4 處。
     - L43 改成「重點在完整講完一件事，長短其次」。
     - L59 照 post-verify 第 8 項改寫。
     - L131 改成「最後那一節很重要：MOC 也是列出下一步要想什麼的地方」，「不只是目錄」L55 已經說過了。
     - L63 改成「但它測的是實驗室裡的小任務：填一個詞、解一個字謎、算一道題」。

3. **長句集中在研究段**
   - L67 的 DeStefano 那句約 86 字，用兩個分號串起三個發現。建議斷成三句：「……發現連結數量的影響各研究不一致。加上橫向的語意連結時，五篇裡有四篇讓讀者找資訊變慢。標出目的地內容的連結則有幫助。」
   - L69 的 Ferreira 那句 68 字，可以在「研究」之後斷句。
   - L31 第一句 64 字、L55 第一句 62 字，在冒號處斷開即可。

4. **單段數字密度**
   - L27（12 個數字，大多是編號範例，可以接受）、L63（8 個）、L67（8 個）、L69（7 個）。
   - L63 留「約 9 個百分點」這個讀者會拿來判斷的數字，「86 篇」「126 篇」可以移到參考資料的書目括號。L67 留「約 4 秒」，「3 個和 8 個」是條件，要保留。

5. **「承認」用錯主詞**：L135，同 post-verify 第 7 項。L137「Matuschak 自己承認」是他自述，用得對。

6. **中英不一致**
   - L23：中文「大多手寫」，英文「almost all handwritten」。原文是「mit wenigen Ausnahmen」，中文改成「幾乎全是手寫」。
   - L69：中文「唯一直接操弄雙向連結的實驗」，英文「The only experiment I found」。依 post-verify 第 1 項改好後兩版要同步。
   - L135：英文「admits」也要一起改（post-verify 第 7 項）。

7. **英文自然度**
   - L41「Promoters have rewritten…」：promoters 帶有推銷的意思，改成「Advocates」或「Popularizers」比較中性。
   - L67 段名「Whether more links are better or worse, the research can't say.」有點拗口，可以改成「More links or fewer? The research can't tell.」
   - L65 段名「Don't worry about "handwriting beats typing".」沒問題；照 post-verify 第 4 項補上研究條件後，正文也要同步。

### 🟢 可選

8. L65 段名「「手寫比打字好」不用管。」很口語，跟其他段名的語氣一致，可以保留。如果照 post-review 第 3 項縮成一句，這個段名就不需要了。
9. L139 第一句「所以建議從小處開始」：主詞不清楚，可以改成「我建議從小處開始」，順便把立場說明白。這句出現一次就好。
10. 台灣用語：`check:tw` 0 命中。人工讀過「統合分析」「出版偏誤」「認知負荷」「受試者」，都是台灣學界常用的寫法。沒有中國用語。

### 保真提醒

改寫時不要動：所有英文引文的原文、數字（9 個百分點、四萬多、25、4、108、11、2.86、2.2 秒、21 項、約 4 秒）、連結網址，以及作者的立場句（「不用管」「選工具時不必為了手寫而犧牲搜尋和連結」「建議從小處開始」）。

### 機械檢查結果

- `pnpm verify`：本審稿檔寫入前跑過一次，只有 `check:series-plan` 紅，原因是這篇（和 order 2）還沒有審稿紀錄，其他檢查全綠。寫入本檔之後重跑 `pnpm check:series-plan`：「23 個受管系列的規劃表與審稿紀錄齊全」。order 2 的審稿紀錄當時也在別處補上了。
- `pnpm check:links`（中英兩版共 13 條外部連結）：
  - 「壞掉」1 條：`https://zettelkasten.de/introduction/` 回 TypeError，但用 curl 加瀏覽器 UA 重試是 HTTP 200，判定為檢查腳本的抓取問題，連結本身沒壞。
  - 「需人工確認」2 條：`doi.org/10.1177/0956797620965541`（Urry，SAGE）、`doi.org/10.1145/1557914.1557934`（Alford，ACM），都是 403 擋機器人。兩篇的全文作者都讀過，DOI 正確。
- `pnpm astro check`：沒跑（文章沒有新元件或 MDX，verify 已涵蓋 lint）。

## 修正紀錄（2026-10-22，寫作者依本審稿與編輯審稿 2026-10-22-editor-pass-order2-3.md 修改，中英同步）

- 必修 1：「沒有任何對照實驗」改為「我搜尋 2024–2026 英文文獻，找不到可信的對照實驗」，並一句交代 2023 年那篇（Malashenko）為何不能當證據；Alford 改「比較有沒有雙向連結功能的實驗」，中英強度一致。
- 必修 2：例子第二則永久筆記的 email 理由改為 Whittaker 2011 的「信量大、整理主要為管待辦」。
- 必修 3：刪除手寫 vs 打字小節（規劃表範圍卡寫「不引」）；Matuschak 三句改連子頁並補參考資料；Mental Squeeze Point 改純文字（子頁網址未取得）；例子用的 Bergman 2008／2010、Whittaker 2011 補進參考資料；zettelkasten.de 50 本書一句歸給 zettelkasten.de。
- 建議：「50 項以上幾乎消失」刪除（只在 Bertsch 成立）；Madrid 補「多出來的 5 個是隨機抽的」，小節改為「有證據的是標清楚連到哪裡」；Luhmann 因果改為檔案館的「首先可能是思考工具，累積後才像出版機器」，工作狂一句改主詞為 zettelkasten.de；補 Luhmann 雙向記連結、Matuschak 密集連結與「讓結構自己長出來」及其與 structure note 的先後關係；新增「先分清兩種筆記」定義文獻筆記與永久筆記；MOC 時機統一為「覺得亂才建」，今晚第 4 條改成先判斷亂不亂；例子第一則改成「別深到七層以上」並保留限制，第三步連結理由改寫；刪除「不是 2020 年才有」改為「這個概念 Luhmann 就有」；英文引文多改中文轉述；英文版 Promoters→Advocates、almost all handwritten 對齊。
- 編輯審稿：tldr 先講讀者得到什麼、統一為四個原則；開頭補與 order 2 並用的方式（PARA 放 Resources、JD 開專門 category）；研究段移到例子之後並精簡；新增「Obsidian 反向連結、AI 建議的連結算不算數？」一節。

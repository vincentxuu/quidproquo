# 審稿報告：order 11〈教學文章裡的專案要給多少引導〉

- 審的檔：`src/content/posts/learning/2026-10-14-projects-struggle-scaffolding.md`（只有中文稿，跳過中英一致）
- sha256 審前（2026-10-14 14:31）：`8cf1fd014e13b7b6052a90083fd4558f3352ccf0f99343b67bb54e8510ff7447`
- sha256 審後（2026-10-14 14:37）：`8cf1fd014e13b7b6052a90083fd4558f3352ccf0f99343b67bb54e8510ff7447`（審的過程中沒有人改檔）
- 依據：`.research/extractions/articles-that-teach/` 的 sinha2021、ashman2020、decaro2023、alfieri2011、lazonder2016、kirschner2006、belland2017、zhang2023、condliffe2017、collins1991、loibl2017、chen2019 十二份紀錄全讀；`_audit/provenance.md` 與 group-01／03／07／08／13／15 的相關列；英文引文回 `.research/raw/learning-content/q3-activity/` 原文檔逐字對。本站現況回 `.work/cs50ai-rewrite/PROJECT-SECTION-SPEC.md`、`.work/reviews/2026-10-13-cs50ai-*.md` 八份、七週導讀中文檔。

## 必須修

**M1　Sinha & Kapur：「講解接著學生的解法講」不是「單看差最大」**（第 55 行）
- 文章：「『講解接著學生的解法講』單看差最大」。
- 抽取紀錄 Table 3（#5–#11）：題目容許多種解法 0.37 對 −0.11，差 0.48；接著學生解法講 0.56 對 0.20，差 0.36。差最大的是前者（不顯著）。單變項相關（Table 6）也是小組 0.29 排第一、這一項 0.28 第二。
- 這個錯是抽取紀錄第 187 行「單變項子群差異最大」帶進來的，紀錄本身也要改。
- 改法：「單看子群差異最顯著（p = .02）」。

**M2　Sinha & Kapur：「沒有獨立貢獻」寫成了否定結果**（第 27、55、230 行）
- 紀錄 #47 與第 187 行：逐步法沒有選進、多模型推論權重 0.40、係數 0.01，「這一項與其他準則高度重疊，這篇分不出它的獨立貢獻」。原文沒有說明它是不是因為共線被移除。
- 「沒有獨立貢獻」是把「沒有測出來」寫成「沒有」，違反寫稿說明的證據規則。第 55 行同一句後半自己寫「這篇分不出它的作用和其他準則有什麼不同」，前後矛盾。
- 改法：三處都改成「放進多元迴歸後看不出獨立貢獻」。

**M3　Ashman：「沒有任何一項結果偏向先解題」少了「顯著」**（第 70 行）
- 紀錄第 83 行寫的是「沒有任何一項結果**顯著**偏向先解題」。實驗 1（先解題 9.15 對先聽講 8.27）與實驗 2（4.11 對 3.94）的平均數字上都是先解題組較高，只是不顯著（紀錄 #5、#6）。
- 改法：「五個實驗裡沒有任何一項結果顯著偏向先解題」。

**M4　Loibl 2017 與 Chen & Yang 2019 寫了內容，違反 ⚠ 規則**（第 61、220 行）
- 兩份紀錄檔頭都標 ⚠，文章只能寫「這篇研究存在」。
- 第 61 行：「它主張先解題要搭配對比案例或接著學生的解法講才有效」，下一句又說「不引它的內容」，自相矛盾。這句主張出自 loibl2017 紀錄 #7（第三方 PDF）。
- 第 220 行：「Chen 與 Yang 的摘要方向相反」引了 chen2019 紀錄 #4（預覽頁 Highlights）的內容。
- 改法：第 61 行刪掉「它主張……才有效」，只寫存在、沒讀到全文。第 220 行刪掉 Chen & Yang 那一句；這一組的重點已經寫在前半句（Zhang & Ma 的地區表沒有可用的統計），不需要衝突的另一邊。紀錄 zhang2023 第 160 行也說這個衝突的一邊本來就站不住。

**M5　本站現況：「七週裡五週被點名虛擬碼細到等於逐行翻譯」我只數到四週**（第 190 行）
- 有點名的：第 0 週 J1（`w00-review.md:392–396`）、第 1 週（`w01-review.md:394`「照著它十分鐘可以機械地譯回 Python」）、第 2 週 Q4（`w02-review.md:440`）、第 3 週 P1（`w03-review.md:479`「一行對一行」）。
- 第 4、5、6 週的審稿都明寫「虛擬碼的尺度：在線內」（`w04:337`、`w05:467`、`w06:554`）。第 6 週雖然說三段「幾乎一一對應」，結論仍是在線內、不需改。
- 同一句已經在已提交的第 3 篇裡（`2026-10-14-code-in-teaching-articles.md:202`），o03 審稿（`2026-10-14-o03-code-review.md:43`）只改了引號，沒有改數字。請主線一起看。
- 改法：「四週被點名（第 0 到 3 週）；第 6 週的審稿說有三段幾乎一一對應，但判定在線內」，或者作者拿出第五週的出處。

**M6　本站現況：「摺疊區外露出解答，三週被點名」找不到三週**（第 196 行）
- 專案解答在摺疊外外露、被列為必須修的只有第 6 週 P1（`w06-review.md:539–547`）。
- 第 3 週（`w03:544`）與第 5 週（`w05:455`）有提出「算不算洩漏」，審稿者的結論都是**不算**。
- 另外兩處「答案」外露講的是講課導讀的自我檢查題，不是專案：第 0 週剪枝圖放在自我檢查題前面（`w00:404`），以及跨週審稿 S5，synthesis-1 先算出第 6 週自我檢查題的答案（`crossweek:65`）。
- 改法：寫成「專案解答在摺疊外外露被列為必須修的有一週（第 6 週…）；另有兩處是自我檢查題的答案先被看到」。要保留「三週」就要寫明是哪三週、各是什麼。

**M7　CS50 規格對照表的「判定」欄沒有當場標成本站判斷**（第 187–194 行）
- 認知學徒制那張表標得清楚：表頭「文章做得到嗎（我的推論）」，第 158 行也有說明。
- CS50 這張表的表頭只寫「判定」，第 185 行也沒有交代。第 1、4、6 列（「誠信上的選擇，研究不足以要求改順序」「有間接支持」「研究不足以要求逐週撤，也不足以說不必撤」）沒有任何標記。第 253 行說這些判定「正文都標了」，對這張表不成立。
- 改法：表頭改「判定（本站的判斷）」，或在第 185 行加一句。

**M8　「每一篇都從頭讀到尾」與括號裡的讀取缺口互相矛盾**（第 20、285 行）
- Ashman 博士論文第 1、2 章（p.4–43）、參考文獻、附錄 1–3、5、6 都沒讀（紀錄第 155 行；文章第 256、288 行自己也寫了）。Alfieri 兩張逐研究樣本表沒有逐列讀，Lazonder、Kirschner、Condliffe 的參考文獻只掃過。
- 改法：第 20 行改成「列在參考資料裡的每一篇都讀過正文全部，並留有抽取紀錄；沒讀的部分寫在參考資料的括號裡」，第 285 行同步。Ashman 論文沒讀第 1、2 章合不合 writing-guide「完整讀過」的硬規則，請主線判斷。我的意見：那兩章是理論背景，不含實驗與數字，文章也照實寫了，可以接受。

## 建議修

- S1（第 9 行 tldr）「效果較大的版本多半有小組」讀起來像在描述高效果比較的組成，資料只有子群差異（0.49 對 0.19），而且短介入的方向相反。建議改成「有小組的版本效果較大，只做幾小時的除外」。
- S2（第 57 行）「作者據此說短介入的解題階段宜讓學生個人做」：原文是「yields a better predictive estimate of the observed effect sizes」，講的是預測，不是建議。建議改成「作者的說法是，短介入裡讓學生個人做較能預測效果量」，或在句尾標成作者的推論。
- S3（第 175 行）Collins 引文截在「…use their knowledge.」。原文緊接的一句是「Moreover, few people learn to be active readers and listeners on their own, and that is where cognitive apprenticeship is critical」（`collins1991.md:54`）。第 177 行接著寫「是不是被用上，取決於讀者自己」，少了作者這句反方向的話。建議把這句也引進來，或在第 177 行轉述。
- S4（第 185 行）「先講解再解題」的判讀是對的（見下面「需要人判斷」第 3 點），但理由可以更強：講課導讀本來就排在專案前面。建議補一句，說明 PS-I 研究比的是概念講解的先後，CS50 導讀不論解題思路放哪，都是講課在前。
- S5（第 73 行）「照 Sinha 與 Kapur 的準則屬於落實程度低的設計」是抽取者的對照（紀錄第 113 行），不是任何一方的說法。建議加「（我依七項準則對照）」。
- S6（第 28 行）結論表的 Ashman 列，「最接近文章」是推論，表裡沒有標；連結文字「實驗」建議改成「實驗（博士論文）」。
- S7（第 265 行）「期刊論文的『實驗 1（N = 64）』與『實驗 2（N = 71）』」裡的人數取自 ⚠ 期刊摘要。對應關係有用，建議改成「期刊摘要列的兩個實驗」，不寫人數；或註明人數取自期刊摘要。
- S8（第 77 行）「78 人隨機分到兩種順序」：78 是排除 4 人之後的分析人數，原始分派人數沒有報告（紀錄第 15 行）。建議改成「分析 78 人」。
- S9（第 47 行）「五篇的作者都是本文的第二作者」：Kapur & Bielaczyc 2012 是合著。建議改成「五篇都有本文的第二作者」；附錄有寫 Loibl 等 2017 另加的 20 篇，正文可以帶一句。
- S10（第 65 行）「兩組的點估計都很接近零」：−0.17 說「很接近零」有點勉強，建議改成「都很小」。
- S11（第 235–239 行）「今晚可以做的三件事」第 1 條鼓勵讀者先跳去「怎麼檢查」自己試。前面「可以做的事」說研究不足以要求改順序，最接近文章情境的 Ashman 實驗又是先講解較好。建議在這一條標明它是給讀者的選項，並寫出依據（Alfieri：有回饋才比沒有協助好，所以先試的前提是「怎麼檢查」能獨立用）。
- S12（第 233 行）第 1 篇的連結建議直接連到該節錨點 `#讀者的程度決定該給多少協助`，不要只連整篇。
- S13（frontmatter）系列其他篇都有 `blog` 標籤，這篇沒有。`check-post-quality` 對 `course-guide` 報 WARN；它沿用系列慣例，可以留。
- S14（第 254 行）轉引清單列了「Tuovinen 與 Sweller 1999 與 Klahr 與 Nigam 2004（Kirschner 等轉述）」，正文沒有用到這兩篇。可以刪，或在正文用到的地方再列。

## 沒問題的項目

- **數字**：先看結論表、正文各節、附錄的每一個數字都逐項對過抽取紀錄，除了 M1、M3 都相符。核對範圍包括 Sinha 的 166／53／0.36／0.25／−0.03、七項準則佔比、子群點估計、Akaike 權重、β 值、13.51%、出版偏誤；Ashman 的實驗 1–5 人數、平均、d、p；DeCaro 的 4.59／6.73、76.49／66.36、F、p、ηp²、α；Alfieri 兩個分析的 d、k、N 與調節變項；Lazonder 的 72 研究、三個成果的 d、六類 k 與 d、Qb；Belland 的 0.46／0.40、12／216／16.5%、依據、範圍、教育階段；Zhang & Ma 的 0.441／0.650／0.116、Begg、表格錯誤；Condliffe 的 Finkelstein 0.32／0.27、128→64。
- **英文引文逐字相符**（回原文檔對過）：
  - Sinha「it is important to consider what is feasible」（`sinha_kapur2021.txt:1196–1197`）、「after accounting for publication bias」（L41）、「could be therefore ruled out」（L1062）。
  - Alfieri「Although direct teaching is better than unassisted discovery, providing learners with worked examples or timely feedback is preferable.」（作者稿 L767–768）、「feedback, worked examples, scaffolding, and elicited explanations」（作者稿 L57）。這兩句都出自作者稿，符合 provenance 的換版規則。
  - Kirschner「That guidance can be relaxed only with increased expertise」（seq L451–452）、「begins to recede」（L26）、「most often found to be equally effective」（L730）、「novice to intermediate learners」。
  - Ashman「suggestive」。Condliffe「promising but not proven」整句（L86–87，含 working paper 主詞）。Belland「indicate a lack of description」。Collins 那段引文逐字相同（截斷問題見 S3）。
- **Ashman 寫成博士論文**：第 67 行明寫期刊論文沒有合法全文、讀的是 2022 年 UNSW 博士論文（CC BY），數字與實驗編號照論文。附錄第 265 行與參考資料第 288 行都寫明是博士論文；期刊論文沒有列入參考資料，只列在「只知道存在」。符合主線的決定。
- **Alfieri 版本**：正文與參考資料都寫讀的是 Surrey 作者稿加 APA 補充表，與換版後的紀錄一致；沒有引只在刊出版出現的句子。
- **⚠ 的三篇**（Loibl、Chen & Yang、Ashman 期刊論文）都沒有列入參考資料，也沒有引數字。M4 的兩處是引了內容。
- **推論標記**：認知學徒制表、七項準則的對照（第 171 行）、虛擬碼粗細的類推、摺疊實作相當於事後例題、可以做的事六條、Belland 的「撤掉後能不能獨立做」，都當場標了。CS50 表見 M7。
- **來源衝突並列不選邊**：先解題對先講解、出版偏誤、小組、引導具體程度、高手、撤不撤、Alfieri 摘要、DeCaro 的假設、地區差異，都列在「來源說法不同的地方」。Lazonder 與 Kirschner 寫成立場相反（第 114 行），沒有並成同一派。
- **限制與取樣偏誤**：第 20 行開頭交代了四條線、英文、全文可得、中小學與大學生、數學與自然科學。限制一節涵蓋檢索偏向提倡者、反方只有一組、線上只有一堂、跨研究比較、鷹架證據薄、PBL 統合品質差、轉引、讀取缺口、沒有讀者資料。我沒有發現漏掉的重要限制。
- **「先講解再解題」的判讀**：回七週導讀中文檔確認過（2026-10-14 14:35 的版本）。每個專案節的小標順序都是任務、官方已提供的程式、解題思路、虛擬碼、容易出錯的地方、怎麼檢查、摺疊的完整參考實作，而且整個專案節排在講課導讀之後（例如 `w01-knowledge.md:653–730`）。判讀成立，補強方式見 S4。
- **CS50 其餘現況**：規格檔存在、未追蹤（`git status` 顯示 `?? .work/cs50ai-rewrite/`），所以「沒有進版本」屬實。七個小節的順序與規格相符，最後修改是 10-13 23:13，「截至 2026-10-14 沒有改動」成立。第 1 週 Knights 的兩句蘊涵、中文虛擬碼、「Puzzle 3 底下什麼都沒印」都與 `w01-knowledge.md:659–695` 相符。第 6 週的 head 編號外露被列為必須修，屬實。誠信政策兩句的轉述與規格檔引的原文相符。
- **站內連結**：order 3、8、9、1、CS50 第 0、1 週六個目標檔都存在，order 3、8 已提交（3a42782f）。order 10 尚未發佈，只寫「之後的篇會談」，沒有放連結。
- **外部連結**：16 條。12 條 200；APA、T&F、SAGE 的 4 個 DOI 回 403，是出版者擋機器人，DOI 本身 302 導向正確的出版者頁。
- **用語**：`check-tw-terms` 0 blocking、0 to review；另外手動 grep 常見中國用語，只有「論文本身」誤中「文本」，沒有真的命中。標題與 tldr 講的是對象與結論，沒有講作者查了多少。正文數字密度合理，細節都放在附錄。

## 需要人判斷，我的意見

1. **Ashman 論文的寫法**：已經寫清楚是論文。剩下兩件小事：S7（附錄的期刊人數）與 M8（論文第 1、2 章沒讀，算不算完整讀過；我認為可以接受）。
2. **兩張對照表有沒有標成推論**：認知學徒制表有標；CS50 表沒有（M7）。
3. **「先講解再解題」的判讀**：成立，而且比文章寫的更穩。PS-I 研究比的是概念講解與解題的先後。CS50 導讀把講課導讀放在專案前面，就算把解題思路移到後面，順序仍然是先講解。解題思路比較接近 Alfieri 所說「給引導」那一軸，而不是 PS-I 的順序那一軸。建議照 S4 補一句。
4. **英文引文**：全部逐字相符。Collins 那段截斷的位置有誤導之虞（S3）。

## 我沒做的事

- 沒有開原始 PDF 重核紀錄裡的表格數字，只對了抽取紀錄，並用原文檔逐字對英文引文。
- 沒有讀 Ashman 博士論文本身，論文的數字以抽取紀錄與 group-01 的抽查為準。
- 沒有看渲染後的頁面，沒有跑 `pnpm verify`、dev 或 build。
- M5、M6 只搜了 `.work/reviews/2026-10-13-cs50ai-*.md` 與 `.work/cs50ai-rewrite/`。作者若是依據其他紀錄（例如對話裡的口頭結論），我看不到。
- 沒有改任何文章檔；抽取紀錄 sinha2021 第 187 行的同一個錯誤（M1）也沒有改。

## 2026-10-14 複審

- sha256（14:52）：`4c92fbc67ba8be88d63ac2c4bec2331219db39bd85fdf22403972093a6d3e1da`

### 必須修

無。

### 建議修

- R1（第 67 行，原句未改，S14 讓它進了轉引清單）：「只對調順序、結果不利於先解題的研究（Fyfe 等 2014、Hsu 等 2015 等）」。論文 p.53–54（`ashman2022_thesis_unsworks.txt` L1930–1946）的說法分成兩件事。Hsu 等 2015 是例題—題目對題目—例題的比較，例題在前的較好。Fyfe 等 2014 是「either found a null result or an effect in the opposite direction」，沒有說是哪一種。建議改成「沒有測到先解題的優勢，或結果相反（Fyfe 等 2014；Hsu 等 2015 比的是例題在前或在後）」。
- R2（第 265 行）「期刊論文摘要列的兩個實驗（摘要只寫了人數，人數取自期刊摘要）」括號重複，建議刪掉括號。

### 已確認修好

- M1：第 55 行改成「單看子群差異最顯著（p = .02）」。sinha2021 紀錄第 187 行同步更正，並註明差值最大的是另一項。
- M2：第 27、55、230 行都改成「看不出獨立貢獻」。
- M3：第 70 行補上「顯著」，並註明實驗 1、2 數字上先解題組略高。
- M4：第 61 行只剩「研究存在」。第 220 行刪掉 Chen & Yang 的方向，改寫成「讀不到全文，無法拿來對照」。
- M5：第 190 行改成第 0 到 3 週被點名、第 4 到 6 週在線內，第 6 週的但書也寫了，與審稿報告相符。
- M6：第 196 行改成專案解答外露被列為必須修的有一週（第 6 週）、兩處自我檢查題的答案、第 3、5 週判定不算洩漏，與審稿報告相符。
- M7：表頭改成「判定（本站的判斷）」，第 185 行也有說明。
- M8：第 20、285 行改成「讀過正文全部」，並在括號列出沒讀的部分；Ashman 的缺口在第 256、288 行寫全了。
- S1–S13：都已照建議改，逐條看過：tldr 的小組但書、第 57 行的預測、Collins 補句、第 185 行的講課導讀理由、第 73 行標成我的對照、結論表標推論並加「博士論文」、附錄拿掉期刊人數、DeCaro 的 78 人改成分析人數、「都有本文的第二作者」、「都很小」、今晚第 1 條標成選項並寫出依據、第 1 篇的錨點連結（目標標題存在）、補上 `blog` 標籤。
- S14：Tuovinen、Klahr 從轉引清單移除，換成 Fyfe 2014、Hsu 2015（Ashman 引用）。兩篇正文第 67 行都有提到，用法問題見 R1。
- Collins 新補的引文「Moreover, few people learn to be active readers and listeners on their own, and that is where cognitive apprenticeship is critical」與 `collins1991.md:54` 逐字相同。轉述標明是作者的看法。
- 台灣用語：`check-tw-terms` 0 blocking、0 to review。手動 grep 常見中國用語沒有命中。

## 2026-10-14 英文稿

- sha256（14:58）：中文 `15a9957a70fd816cd39538c200b7f8c8cb6e6c6fc678161c99d56d7fcc97d35f`；英文 `1efc3e095799fd1958ecb7b6ea97ba2476081cf87925e8eca6a0a02257dfda8e`
- 中文 Fyfe／Hsu（現第 69 行）：對過 `ashman2022_thesis_unsworks.txt` L1930–1946。改法正確：Hsu 2015 是例題在前或在後的比較，例題在前較好；Fyfe 2014 在講解前加探索階段，結果是沒有測到優勢或方向相反，論文沒有分別說是哪一種。

### 必須修

- E1（英文第 73、173、193、232 行）用 He／His 稱 Ashman。依本專案的用語規則，沒有明示代名詞時不從名字推測性別。改成 "the author's own word"、"the author's lesson"，或用 they／their。

### 建議修

- E2（中文第 69 行）插入 Fyfe／Hsu 之後，下一句「期刊論文報告了其中兩個」的「其中」會被讀成指那幾篇轉引研究。建議改成「報告了五個實驗中的兩個」，英文版已寫成 "two of the five"。
- E3（英文第 241 行）第 1 條以 "This one gives readers an extra option…" 開頭，讀者還不知道「this one」指什麼。建議先寫動作，再放依據，例如 "Find the biggest task … (This adds an option for readers rather than changing the order; the basis is …)"。
- E4（英文第 2 行）標題偏長（20 個字）。可以考慮縮成 "How Much Guidance Should a Project in a Teaching Article Give? Problem-First, Discovery, Scaffolding, and Project-Based Learning"，非必要。

### 已確認

- **結構**：兩版都是 300 行，標題數 20、表格列 28、條列 52 相同。
- **數字**：用腳本比對全文數字的多重集合，差異都來自寫法（「二到五年級」對 "grades 2–5"、「第 1、2 章」對 "two theory chapters" 等），沒有數值不一致。另外人工對過 tldr、結論表、Sinha 附錄、Ashman 實驗 1–5、DeCaro、Alfieri、Lazonder、Belland、Zhang 各段。
- **限定條件與推論標示**：都有帶到。例如 "I judge closest"、"(my own comparison)"、"(this is my inference)"、"Verdict (this site's judgment)"、"no independent contribution could be seen"、"significantly favored"，以及 M5／M6 改寫後的週數。
- **英文引文**：14 處都與原文逐字相同，包括 Sinha 的 "it is important to consider what is feasible"、"after accounting for publication bias"、"could be therefore ruled out"、"contributed"，Alfieri 的兩句，Kirschner 的四處，Belland "indicate a lack of description"，Condliffe 整句，Collins 兩段與 "the most important difference"，Ashman "suggestive"，"can be considered rather large"。
- **連結**：站內連結全部指向 -en 版，目標檔都存在；第 1 篇的錨點 `#the-readers-level-decides-how-much-assistance-to-give` 對應英文版第 151 行的標題。
- **其他**：系列名 "Writing Articles That Teach" 與其他英文稿一致。`check-lang-parity` 唯一的問題是別篇（metacomprehension 缺英文版），與本篇無關。
- **英文自然度**：整體通順，術語前後一致（problem first、enhanced discovery、fading、version of record）。

## 2026-10-14 英文稿修正確認

- sha256：中文 `416c3884…62dc`、英文 `a5cbaf9c…d002`
- E1 已修。英文全文 grep 不到 he／his／him／she／her。原本用代名詞的地方改成 the author、Ashman、the lesson、the dissertation（第 73、173、193、232 行）。
- E2 已修。中文第 69 行改成「報告了五個實驗中的兩個」。
- E3 已修。英文「今晚可以做的三件事」第 1 條改成先寫動作，依據移到句末的括號。
- E4 已修。標題縮成 "How Much Guidance Should a Project in a Teaching Article Give? Problem-First, Discovery, Scaffolding, and Project-Based Learning"。
- 兩版仍各 300 行。中文 `check-tw-terms` 0 blocking、0 to review。沒有新的問題，order 11 中英稿可以進下一步。

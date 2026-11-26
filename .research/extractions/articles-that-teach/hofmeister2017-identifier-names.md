# 抽取紀錄：Hofmeister、Siegmund、Holt 2017，Shorter Identifier Names Take Longer to Comprehend（SANER 2017）

- **合法公開來源**：https://www.se.cs.uni-saarland.de/publications/docs/HoSeHo17.pdf （薩爾蘭大學軟體工程講座的著作頁，作者稿，2026-10-14 核對）。重新下載與手上的 `hofmeister2017-saner.pdf` 位元組完全相同（334,125 位元組）。這是研究群自己的著作頁，不是三位作者現任單位的個人頁；IEEE 刊出版（DOI 10.1109/SANER.2017.7884623）Unpaywall 標 closed，沒有取得，兩版差異沒有比對。

- **完整書目**：Johannes Hofmeister（University of Passau）、Janet Siegmund（University of Passau）、Daniel V. Holt（Heidelberg University）。Shorter Identifier Names Take Longer to Comprehend。2017 IEEE 24th International Conference on Software Analysis, Evolution and Reengineering（SANER）。DOI 10.1109/SANER.2017.7884623（DOI 取自清單，清單註明已用 OpenAlex 核過題名與年份；PDF 本身沒有印 DOI、會議名或頁碼）。作者姓名與單位對過 PDF 首頁。
- **原文檔**：`.research/raw/learning-content/q2-interactive/hofmeister2017-saner.pdf`（11 頁）；同目錄 `.txt` 是 `pdftotext -layout` 轉的雙欄版面（679 行、79,134 字元）。精讀用的是我另外不帶 `-layout` 重轉的版本（scratch 目錄 `a4c/hof.txt`，1,406 行、58,937 字元），**下面的行號（L）一律是這個重轉檔的行號**；表格另寫 `-layout` 檔的行號。
- **版本**：作者稿。PDF 是 pdfTeX 產生（建立日期 2016-12-16），沒有 IEEE 版權列、頁首或頁碼。這份 PDF 當初從哪個網址抓的，raw 目錄沒有留紀錄，我沒有查到。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 4（記號、行話與術語）#10

## 研究設計

- **類型**：線上進行的受控實驗，受試者內設計（每人三種命名風格都看到）。（L275–283、Table I）
- **受試者**：72 位專業 C# 開發者，年齡 35.3 ± 6.8 歲，程式經驗 14.0 ± 5.8 年，C# 經驗 7.8 ± 3.6 年（L285–287）。透過 Twitter、Xing 與德國科技業研討會招募（L288–290）。作者在效度段稱母群是「German professional C# developers」（L1164）。指示語是德文、程式碼的識別字是英文（L465–468）。
- **樣本流失**：221 人開始、135 人完成、套用排除條件後刪 63 筆，剩 72（L291–294）。排除條件（Table III，條件不互斥，各條件筆數加起來是 106）：德文自評 <4 有 2 筆、英文自評 <4 有 9 筆、C# 技能自評 <4（1–5 分）24 筆、C# 經驗 <1 年 8 筆、自述被打擾 17 筆、沒有認真做 1 筆、嘗試超過 3 次 15 筆、超過 1 分鐘沒互動 4 筆、單題超過 10 分鐘 14 筆、參加過前導研究 4 筆、重複參加 8 筆。最後樣本裡留有 2 位學生（L469–471）。最後樣本裡沒有女性（L1165–1167）。
- **受試者背景**（Table II）：最高學歷 Master 42%、Bachelor 18%、職業訓練 18%、無高等教育 15%、其他 7%；受雇 81%、自由接案 17%、學生 2%。
- **教材**：作者自己寫的 C# 片段，每段是一個 15 行的獨立 static 函式，只用 C# 2.0 的迴圈、條件與基本 .NET API（L509–516、L532–533）。先寫了 11 段，前導研究後刪掉 5 段（變異太大或太難），正式實驗用 6 段（L564–570）。每段開頭有註解：第一行說明函式要做什麼，接著逐一說明變數；**在縮寫版與單字母版，註解會列出每個識別字原本的意思**（L553–557，Listing 4、5）。
- **三種命名風格怎麼做出來的**（L540–553）：先用完整單字寫；縮寫版是自動產生的，拿掉母音後留前三個子音（request → rqs、histogram → hst），少數慣用縮寫改取前三個字母（length → len）；單字母版依出現順序改成 a、b、c…，刻意讓它和原名完全無關。.NET 標準 API 的名字不動（List、Dictionary）。
- **作業**：每人做 6 題。前 3 題找語意缺陷（semantic defect），後 3 題找語法錯誤（syntax error，例如少括號或分號）；語法題是對照條件（L265–273、L475–478）。程式用「letterbox」呈現：一次只看得到 7 行（約三分之一），用上下鍵移動（L479–487）。找到後按空白鍵，再填行號、說明與修正（L488–491）。
- **量了什麼**：從開始看程式到按下空白鍵的時間，扣掉填答時間（L491–496）。三次都沒找到缺陷的人可以做完，但資料被排除（L497–499）。Table I 把「Visual Attention, Correctness」列為次要因子，但正文沒有報告任何正確率的結果。
- **平衡設計**：6 段依前導研究的難度分成 Easy、Difficult 兩組各 3 段；一半的人語意題用 Easy 組、語法題用 Difficult 組，另一半相反；組內片段順序與命名風格順序都排列，共 3! × 3! × 2 = 72 種序列，樣本數就是這樣定的（L765–793）。
- **何時量**：單次作業，全程約 20–30 分鐘（L803）。沒有延後測驗。
- **資料處理**：反應時間取倒數（1/RT），變成「每分鐘找到幾個缺陷」（L982–993）。顯著水準 α = .05（L1004）。語意題用事先設定的線性對比加 t 檢定；語法題用 omnibus ANOVA（L1005–1023、L1080–1111）。

## 結果（逐項）

Table VI、VII 的數字都對過 `-layout` 檔（該檔第 424–436 行）的版面。

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 語意題原始時間（中位數，IQR） | Word 01:24.48（IQR 01:12.78）；Abbreviation 01:38.57（01:05.37）；Letter 01:40.36（01:24.87） | 三種命名風格互比，受試者內 | Table VI | L866–921 | 「Word 01:24.48 01:12.78」「Abbreviation 01:38.57 01:05.37」「Letter 01:40.36 01:24.87」 |
| 2 | 語法題原始時間（中位數，IQR） | Word 00:39.42（0:49.00）；Abbreviation 00:36.71（0:53.92）；Letter 00:35.74（0:30.22）。**數字上單字版最慢** | 同上 | Table VI | L866–921 | 「Word … 00:39.42 0:49.00」「Letter … 00:35.74 0:30.22」 |
| 3 | 語意題速度（每分鐘缺陷數，M、SD） | Word 0.78（0.42）；Abbreviation 0.65（0.31）；Letter 0.66（0.39） | 同上 | Table VII | L923–943 | 「Defects / Minute Word 0.78 0.42」「Abbreviation 0.65 0.31」「Letter 0.66 0.39」 |
| 4 | 語法題速度（M、SD） | Word 1.76（1.13）；Abbreviation 1.81（1.31）；Letter 1.96（1.39）。**數字上單字母最快**，不顯著（見第 8 項） | 同上 | Table VII | L923–943 | 「1.76 1.13」「1.81 1.31」「1.96 1.39」 |
| 5 | 「19%」的出處 | 單字版每分鐘多找到 19% 的缺陷，比較基準是縮寫與單字母合併 | Word vs（Abbreviation + Letter） | V.A | L994–998 | 「when finding semantic defects in code with words instead of abbreviations and letters, participants found on average 19% more defects per minute and thus were faster when words were used as identifier names.」 |
| 6 | 主要檢定：單字 vs 非單字 | t(71) = 2.73，p = .004；d_z = 0.32，作者稱「small to medium-sized effect」 | Word vs（Abbreviation + Letter），語意題 | V.B.1 | L1049–1072（該頁左右欄交錯，逐行拆開讀過） | 「We found a statistically significant difference between comprehension speed for words and non-words (tΨWords:Non-Words(71) = 2.73; p = .004).」「The difference between words and non-words indicated a small to medium-sized effect (dz = 0.32, [10]).」 |
| 7 | **無差別**：縮寫 vs 單字母 | t(71) = 0.07，n.s. | Abbreviation vs Letter，語意題 | V.B.1 | L1057–1061 | 「There was no significant difference between letters and abbreviations (tΨLetters:Abbreviations(71) = 0.07; n.s.).」 |
| 8 | **無效果**：語法題 | F(2, 142) = 0.8，n.s.；作者說這個研究有 80% 檢定力偵測到 η² = .04 | 三種風格，語法題 | V.B.2 | L1111–1118 | 「We could not find a significant effect of identifier naming styles on the detection of syntax errors … (F(2, 142) = 0.8; n.s.). Considering that our study has 80% statistical power to detect effect sizes as small as η² = .04, we interpret this result as support for the assumption that identifier names have at most a negligible effect on finding syntax errors.」 |
| 9 | 讀註解的時間（倒數，M、SD） | 語意題 Word 3.27（2.96）、Abbreviation 2.64（2.59）、Letter 2.33（1.88）；語法題 Word 17.85（12.66）、Abbreviation 14.34（10.75）、Letter 14.77（10.37）。數值越大表示花在註解上的時間越少 | 三種風格互比 | Table VII | L945–966 | 「Inverted Comment Reading Time Word 3.27 2.96 17.85 12.66」 |
| 10 | 讀註解時間的檢定 | 語意題 F(2, 142) = 5.35，p = .006，η² = 0.07；語法題 F(2, 142) = 3.60，p = .03，η² = 0.05 | 三種風格 | V.C | L1120–1133 | 「The identifier naming style affected how much time participants spent reading (and re-reading) the comments at the beginning of the snippet … This affected the semantic and syntactic tasks equally.」 |
| 11 | 作者對機制的說法（推論，不是量到的） | 沒有數字 | — | VI | L1038–1048 | 「The observed differences in comprehension performance are likely caused by the words' semantic content, which facilitates cognitive processes of developers, such as chunking or semantic priming, and generally relieves working memory.」「further experiments are necessary」（L1059–1065） |
| 12 | 效果集中在中段與慢的人 | 沒有給數字、檢定或圖表 | 快的人 vs 一般的人（事後描述） | VIII Related Work | L1266–1272 | 「We found that the observed effects (the impact of identifier naming styles) reside in the middle and the tail of the distribution of reaction time data. This indicates that experts (i.e., the fastest developers in our sample) were less influenced by shorter or abbreviated identifier names than developers with average performances.」 |
| 13 | 與 Lawrie 等 2006 的差別 | Lawrie 的縮寫表現接近完整單字，本研究的縮寫接近單字母；作者歸因於縮寫做法不同（Lawrie 縮的是複合詞，如 isPrimeNumber → isPriNum，保留較多原貌） | 跨研究 | VIII | L1221–1234 | 「They found that responses for identifier names using abbreviations showed similarities to responses for normal words, whereas in our experiment, they were more similar to responses for letters.」「We attribute this difference to the strategies used for building abbreviations.」 |

我自己算的（不是原文的數字，引用時要標明）：

- 0.78 ÷ ((0.65 + 0.66) ÷ 2) = 1.19，和原文的 19% 對得上；這是「速度」（缺陷／分鐘）的平均值比。
- 用 Table VI 的中位數換算「時間」：單字版 84.5 秒，縮寫 98.6 秒、單字母 100.4 秒，單字版的中位時間短約 14–16%。所以「快 19%」是速度多 19%，不是時間少 19%。
- t(71) = 2.73 的雙尾 p 值約 .008；原文報的 .004 與單尾相符。原文沒有寫用單尾還是雙尾，假設是有方向的（L1039–1042）。這一點我不確定，只是推算。

## 作者自己列的限制

（第 VII 節，L1125–1219）

- 只用了全部紀錄的 33%（72／221），作者承認可被看成取樣偏誤，說明是嚴格篩選的結果（L1145–1149）。
- 把「理解」操作成「找到缺陷的時間」，兩者不完全等同（L1151–1162）。
- 母群很窄：德國的專業 C# 開發者，「our findings should not be overgeneralized」（L1164–1165）；最後樣本沒有女性（L1165–1169）。
- 教材只有程序式、演算法型的小問題，不能推到複雜的物件導向環境；很長的識別字（舉例 `AbstractSingletonProxyFactoryBean`）可能太抽象反而妨礙理解，「this conclusion needs to be tested」（L1170–1177）。
- 指示語先告訴受試者「程式裡有語意缺陷」，可能啟動了平常不會有的資源，作者認為這會讓效果變小（L1178–1189）。
- 在網頁上做、不在 IDE 裡，又有 7 行視窗的限制，可能拖慢所有條件的理解（L1190–1198）。
- 效果是在 15 行程式上量到的。放大到大型程式會怎樣「difficult to predict」：常用縮寫可能很快就記住而沒有代價，例子是 for 迴圈的 `i`，以及公司內部的領域用語（L1200–1214）。
- 需要在實驗室、用其他語言重做（L1215–1219）。結論段說想找初學者重做（L1309–1311）。

## 與摘要說法不一致的地方

- **標題「Shorter … Take Longer」比資料強**：三種長度裡最短的單字母（0.66）與較長的縮寫（0.65）沒有差別（t = 0.07），差別只在「是不是完整單字」。資料撐的是「非單字比單字慢」，不是「越短越慢」。
- 摘要寫「defects in code are more difficult to detect when code contains only letters and abbreviations」（L30–32）。研究只分析了找到缺陷所花的時間；三次沒找到的人整個被排除，正確率沒有報告。「較難找到」只能理解成「較慢找到」。
- 摘要寫「19% faster comprehension speed」：正文的 19% 是每分鐘缺陷數的平均值比（見上面我算的那一段），摘要沒有說明這是倒數轉換後的速度。
- 摘要沒有提語法題無效果、也沒有提讀註解時間的差別；語法題在原始數字上方向相反（單字版最慢），不顯著。
- 摘要與結論的「can help to save costs and improve software quality」（L32–34）、「could save hours or even weeks」（L1205–1207）沒有任何資料，作者自己接著寫「it is difficult to predict this effect with certainty」。
- 正文內部一處不一致：討論段寫單字版的受試者「scrolled less frequently to the comments」（L1044–1048），但第 V.C 節量的是讀註解的時間（Table VII 的倒數時間），沒有報告捲動次數。
- 其餘逐項對過（72 人、受試者內、三種風格、縮寫與單字母無顯著差別），相符。

## 與清單『要撐的結論』不合的地方

清單寫的是「完整單字的識別字比縮寫與單字母快」。方向撐得住，但要加上下列條件才不超出原文：

1. **量的是專業開發者找缺陷的速度，不是學習者讀懂教材**。受試者是平均 14 年經驗的 C# 開發者，沒有初學者；作者把初學者列為未來工作。拿來談教學文裡的命名，是外推。
2. **只在找語意缺陷時成立**。找語法錯誤沒有差別，數字上還反過來。
3. **縮寫是機器產生的三子音縮寫（rqs、hst、frs、scn），不是慣用縮寫**。作者自己說慣用縮寫（如迴圈的 `i`）可能沒有代價，並用這點解釋為什麼 Lawrie 等 2006 的縮寫表現接近完整單字。文章不能把這篇寫成「縮寫都比較慢」。
4. **縮寫版與單字母版的開頭註解已經列出每個識別字的原意**，所以比較的是「名字本身有意義」對「意義要回頭查註解」；讀註解時間的差別（第 9、10 項）與此相符。
5. 效果量是 d_z = 0.32（作者稱小到中），樣本是原始 221 人裡篩剩的 72 人，片段只有 15 行、一次只看得到 7 行。
6. 「快 19%」要寫成「每分鐘找到的缺陷多 19%」；換成中位時間大約短 14–16%（我的換算）。

清單另註「Hofmeister 等 2019 期刊版沒有全文，已用 2017 會議版代替」：這份紀錄只涵蓋 2017 會議版作者稿，期刊版有沒有新增實驗或改數字，我沒有讀到。

## 讀取紀錄

讀的是不帶 `-layout` 重轉的 `a4c/hof.txt`（1,406 行）。

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–720 | 標題、作者、摘要、I 前言、II Word-length and Semantics（含 Listing 1、2）、III 假設與自變項／依變項、IV 研究設計（受試者、Table I–III、作業、教材、Table IV、Listing 3–5、程序、Table V 開頭） |
| 2 | L721–1406 | Table V 其餘、設計（平衡）、Fig. 1 圖說、V 結果（Fig. 2 圖說、Table VI、VII、資料轉換、假設檢定、Visual Attention）、VI 討論、VII 效度威脅、VIII 相關研究、IX 結論、致謝；L1317–1406 是參考文獻（掃過） |

- L1011–1133 這一段（PDF 第 8 頁）在重轉檔裡左右兩欄逐行交錯（左欄 V.B–V.C、右欄 VI 討論），我逐行拆開讀，並拿 `-layout` 檔同一頁對過句子順序。
- 對過 `-layout` 版面的表：Table II（該檔第 199–219 行）、Table III（第 180–196 行）、Table V（第 341–348 行）、Table VI 與 VII（第 424–436 行）。Table I、IV 是文字表，直接讀。
- Fig. 1、Fig. 2 只讀了圖說，圖本身（箱形圖與信賴區間）沒有看 PDF 影像，圖上的數值沒有抽。
- 原文沒有附錄。註腳 1–4 都讀了（語意一詞的用法、複製套件網址 brains-on-code.org、工作記憶容量、IQR 定義）。複製套件沒有去抓。

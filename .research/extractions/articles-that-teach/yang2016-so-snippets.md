# 抽取紀錄：Yang、Hussain、Lopes 2016，From Query to Usable Code: An Analysis of Stack Overflow Code Snippets

- **書目**：Di Yang、Aftab Hussain、Cristina Videira Lopes（Department of Informatics, University of California, Irvine）。From Query to Usable Code: An Analysis of Stack Overflow Code Snippets。Proceedings of the 13th International Conference on Mining Software Repositories（MSR '16，2016-05-14 至 15，Austin, TX），pp. 391–402，DOI 10.1145/2901739.2901767。作者、會議、DOI 對過原文首頁（L5–24、L69–72）；頁碼取自 Crossref（2026-10-14 查）。
- **讀的版本**：arXiv:1605.04464v1 [cs.SE]，2016-05-14（L1）。首頁帶 ACM 的版權與 DOI 區塊，版面是 ACM 會議格式；有沒有和 ACM DL 上的刊出版逐字相同沒有對過。
- **原文檔**：`.research/raw/learning-content/q2-interactive/yang2016-so-snippets.txt`（1,030 行、44,334 字元；不帶 `-layout` 的 `pdftotext` 輸出）；PDF 同目錄 `yang2016-so-snippets.pdf`（11 頁）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 3（程式碼）#11
- **行號**：`.txt` 的行號。圖 3–14 是圖片，`.txt` 只有圖說；圖 8–11 的數字是我看 PDF 第 6–7 頁的圓餅圖讀出來的。

## 研究設計

- **類型**：對 Stack Overflow（下稱 SO）資料傾印的大量自動化檢查（解析、編譯或執行），加一個小型的人工質性檢視與一個 Google 搜尋的小實驗。沒有學習者、沒有學習成果變項。
- **研究目的**：為「自動程式生成工具」評估 SO 片段能不能原樣拿來用（L33–38、L113–118）。usability 的定義是工具使用片段要花的力氣，用解析、編譯、執行三個步驟衡量；**不是讀者覺得好不好用，也不是教學品質**。
- **資料**（L186–220）：Stack Exchange 資料傾印，2014 年 4 月取得（註腳 3，L210–212）。只取 **accepted answer**（發問者接受的答案），語言用問題的標籤判定。片段是答案 Body 裡每一個 `<code>` 標記的內容（L218–220「we used the the markdown `<code>` to extract the code snippets」）。原文沒有區分行內的 `<code>` 與程式區塊；後面的質性分析顯示單一個字的片段占很大比例，所以這裡的「片段」包含行內提到的識別字。
- **四種語言與做的事**（Table 1，L232–254；對過 PDF 第 3 頁）：

  | 操作 | C# | Java | JavaScript | Python |
  |---|---|---|---|---|
  | Parse | x | x | x | x |
  | Compile | x | x | | |
  | Run | | | x | x |

  C# 與 Java 只做到編譯，**沒有執行**；JavaScript 與 Python 沒有編譯步驟，直接執行。解析通過的才進下一步（L256–259）。
- **工具**（L263–329）：C# 用 Roslyn 與 .NET 的 CodeDom 編譯；Java 用 Eclipse JDT 1.7 的 ASTParser 與 Javax.Tools，只算 ERROR 等級；JavaScript 用 SpiderMonkey 的解析器與 shell 的 `eval()`；Python 用內建 AST 與 `exec`。Python 先全部在 Python 2 下檢查，解析失敗的再用 Python 3 檢查，結果合併（L324–327）。JavaScript 與 Python 的工具每個片段只回報第一個錯誤（L308–311、L327–329）。原文沒有寫執行環境裝了哪些第三方套件，也沒有寫 Python 與 JavaScript 的確切版本。
- **質性分析**（第 3 節，L664–746）：只做 Python。三輪，每輪隨機抽 50 個可執行的片段，依 Table 5 的 16 個特徵檢視，重點是「片段有沒有正確且完整地回答問題」。原文沒有寫由幾個人判定、有沒有做一致性檢查。
- **Google 搜尋實驗**（第 4 節，L752–827）：取 SO 上得票最高的 100 個 Python 問題當查詢，用 Google search API，加 `site:stackoverflow.com`、關鍵字 Python 與日期範圍限制，看前 1 與前 10 筆結果的 accepted answer 可解析與可執行的比例。

## 結果（逐項）

### 可解析、可編譯、可執行的比例（Table 2，L349–378；對過 PDF 第 4 頁）

分母都是該語言處理的片段總數。

| # | 語言 | 片段總數 | 可解析 | 可編譯 | 可執行 |
|---|---|---|---|---|---|
| 1 | C# | 810,829 | 129,727（16.00%） | 986（0.12%） | 沒做 |
| 2 | Java | 914,974 | 35,619（3.89%） | 9,177（1.00%） | 沒做 |
| 3 | JavaScript | 816,227 | 537,767（65.88%） | 不適用 | 163,247（20.00%） |
| 4 | Python | 527,774 | 402,249（76.22%） | 不適用 | 135,147（25.61%） |

原文（L337–345）：「A total of 3M code snippets were analyzed. Python and JavaScript proved to be the languages for which the most code snippets are usable: 537,767 (65.88%) JavaScript snippets are parsable and 163,247 (20.00%) of them are runnable; for Python, 402,249 (76.22%) are parsable and 135,147 (25.61%) are runnable. Conversely, Java and C# proved to be the languages with the lowest usability rate: 129,727 (16.00%) C# snippets are parsable but only 986 (0.12%) of them are compilable; for Java, only 35,619 (3.89%) are parsable and 9,177 (1.00%) compile.」

我的檢查：四種語言加總 3,069,804。原文句子寫「20.00% of them are runnable」，但 163,247 ÷ 537,767 = 30.4%，20.00% 是對總數 816,227 算的；Table 2 的百分比全部以總數為分母（Python 135,147 ÷ 527,774 = 25.61%）。

### 去掉單一個字的片段之後（Table 3，L393–414；對過 PDF 第 4 頁）

只對 C# 與 Java 做。「單一個字」的定義是沒有非字母字元的 token（L382）。

| # | | C# | Java |
|---|---|---|---|
| 5 | 去掉後的片段總數 | 514,992 | 572,742 |
| 6 | 可解析 | 129,691（25.18%） | 35,619（6.22%） |
| 7 | 可編譯 | 986（0.19%） | 9,177（1.60%） |

原文（L387–392）：「For Java, the parsable rate increases from 3.89% to 6.22%, and the compilable rate increases from 1.00% to 1.60%. For C#, the parsable rate increases from 16.00% to 25.18%, and the compilable rate increases from 0.12% to 0.19%.」

我算的：C# 有 295,837 個（36.5%）、Java 有 342,232 個（37.4%）片段是單一個字，原文沒有寫這兩個數字。比例提高幾乎全來自分母變小；可解析的個數 C# 少了 36 個、Java 不變。

### 啟發式修補之後（Table 4，L605–629；對過 PDF 第 8 頁）

修補一：Java 片段沒有 `import`、`package`、`class` 任一 token 時，外面包一個 class（L489–540）。修補二：Java 與 C# 依三個條件在行尾補分號（L544–579）。

| # | | C# | Java |
|---|---|---|---|
| 8 | 片段總數（去單字後） | 514,992 | 572,742 |
| 9 | 修補後可解析 | 135,421（26.30%） | 110,203（19.24%） |
| 10 | 修補後可編譯 | 986（0.19%） | 17,286（3.02%） |

原文（L602–603、L652–662）：C# 的解析率「improved by only 1.12% (from 25.18% to 26.30%), whereas for Java the improvement was 13.02% (from 6.22% to 19.24%). The compilation rate did not change for C#, whereas for Java it improved by 1.42% (from 1.6% to 3.02%).」「Even though the parsing and compilation rates improved for Java, the number of usable snippets is still one order of magnitude lower than the numbers for JavaScript and Python.」作者同時承認修補可能弄壞原本能解析或編譯的片段（L656–658）。

### 錯誤訊息（2.6 節，L431–466；圖 8–11 讀自 PDF 第 6–7 頁）

| # | 語言 | 解析錯誤數 | 編譯或執行期錯誤數 | 行號 |
|---|---|---|---|---|
| 11 | C# | 3,347,674 | 359,783（編譯） | L437–441 |
| 12 | Java | 1,417,910 | 199,489（編譯） | 同上 |
| 13 | JavaScript | 278,460 | 374,520（執行期） | 同上 |
| 14 | Python | 125,525 | 267,102（執行期） | 同上 |

Java 與 C# 的錯誤訊息是在去掉單字片段後的集合上取得的；Python 與 JavaScript 每個片段最多一則錯誤（L446–451）。我的檢查：Python 與 JavaScript 的兩個錯誤數都等於 Table 2 相減的結果（527,774 − 402,249 = 125,525；402,249 − 135,147 = 267,102；816,227 − 537,767 = 278,460；537,767 − 163,247 = 374,520），所以這兩種語言是一個失敗片段一則錯誤。

各圖的比例（圓餅圖上的標示；圖例與扇形的對應我是依圖例順序與顏色讀的，最大的一項有內文佐證，其餘小項的對應不敢保證）：

- **圖 11b，Python 執行期錯誤**：`name [symbol] is not defined` 83.37%；`No module named [symbol]` 5.00%；`[symbol] has no attribute` 2.80%；`[symbol] take/expect/need [symbol] arguments` 2.13%；Other 6.71%。
- **圖 11a，Python 解析錯誤**：`invalid syntax` 84.46%；`unexpected indent` 4.90%；`unexpected EOF while parsing` 4.60%；`unexpected character after line continuation character` 2.82%；Other 3.22%。
- **圖 10b，JavaScript 執行期錯誤**：`ReferenceError: [symbol] is not defined` 92.81%；`TypeError: [symbol] is not a function` 3.28%；`TypeError: [symbol] is undefined` 3.28%；Other 0.64%。
- **圖 10a，JavaScript 解析錯誤**：`SyntaxError: expected expression, got [symbol]` 50.05%；`missing [symbol] after/before/in [symbol]` 30.75%；`illegal character` 6.56%；`expected rest argument name` 1.99%；`function statement requires a name` 1.75%；Other 8.90%。
- **圖 9b，Java 編譯錯誤**：`Cannot find symbol` 62.83%；`Incompatible types` 16.41%；`Package does not exist` 8.16%；`Method does not override or implement a method from a supertype` 4.53%；Other 8.08%。
- **圖 9a，Java 解析錯誤**：`Syntax error, insert [symbol] to complete [symbol]` 25.33%；`Syntax error on tokens, delete these tokens` 20.23%；其後四類 16.14%、16.06%、8.23%、6.48%；Other 7.53%。
- **圖 8b，C# 編譯錯誤**：`Expected class, delegate, enum, interface, or struct` 36.23%；`The type or namespace name [symbol] could not be found` 27.64%；`A namespace cannot directly contain members such as fields or methods` 13.22%；`Type or namespace definition, or end-of-file expected` 7.98%；`Identifier expected` 7.45%；Other 7.48%。
- **圖 8a，C# 解析錯誤**：`Type or namespace definition, or end-of-file expected` 36.17%；`A namespace cannot directly contain members such as fields or methods` 23.13%；`; expected` 9.28%；其後 7.38%、6.46%、3.16%、3.13%、2.64%；Other 8.66%。

內文的描述（L452–460）：「For example for JavaScript, 50% of the parsing errors are not getting an expression. For Java, 25% of the parsing errors are tokens to be inserted.」「Errors more related to code context, such as missing symbols, are revealed in compiling or running process. … For Java, "cannot find symbol" dominates compiling error messages. When running a JavaScript snippet, we are most likely to stop at a reference error, while for Python, the most common runtime error is a specific name not defined.」

作者對編譯錯誤的判斷（L474–478）：「compiling errors are hard to fix, because we need to look into the specific snippet to complement the missing symbols.」

2.5 節另有一句（L422–425）：圖 7 的不可解析 Python 片段「illustrates a common occurrence in SO posts, where the example code is given more or less as pseudo-code that mixes the syntax of several languages」。沒有給比例。

### 質性分析：可執行的 Python 片段有沒有回答問題（第 3 節，L702–746）

| # | 輪次 | 抽樣母體 | 結果 | 行號 | 原文 |
|---|---|---|---|---|---|
| 15 | Step 1 | 全部可執行的 Python 片段，抽 50 | 回答問題的占 16%；單一個字的片段占 64%；單字片段沒有一個回答問題 | L704–710 | 「We found out that the proportion of snippets that answer the question is low (16%). … none of single word snippets answer the question, and all of the snippets that answer the question are non-single word snippets. The proportion of single word snippets is 64%.」 |
| 16 | Step 2 | 去掉單字片段後，抽 50 | 回答問題的「increases to 44%」；回答問題的 21 個裡 19 個是多行；20 個單行片段只有 2 個回答問題 | L716–721 | 「After removing single word snippets, the proportion of snippets that answer the question increases to 44%. … Among the 21 snippets that answer the question, 19 are multiple line snippets, and among the 20 single line snippets, only 2 answer the question.」 |
| 17 | Step 3 | 再去掉單行片段後，抽 50 | 回答問題的 66%；沒回答的 17 個裡 12 個是正確但不完整 | L723–742 | 「Again, the proportion of snippets that answer the question increases, to 66%. Moreover, for the 17 snippets that do not answer the question, 12 of them are incomplete, but correct, answers.」 |
| 18 | 多行且可執行的子集 | — | 40,245 個，占可執行 Python 片段的 29.8% | L743–746 | 「multiple-line snippets can best answer the questions. This subset contains 40,245 runnable snippets (29.8% of all runnable Python snippets).」 |

「correctness」與「completeness」的定義在 L671–701：完整是指片段本身就是完整答案，不必另外加程式碼；圖 13 是「正確但不完整」的例子（只修了原程式的錯，要把問題與答案的程式合起來才是完整答案）。

我的檢查：Step 2 寫 44%，但同段給的個數是 21 個，21 ÷ 50 = 42%（19 多行 ＋ 2 單行 = 21）。原文內部對不上，引的時候用個數。Step 3 的 33 ÷ 50 = 66% 對得上。40,245 ÷ 135,147 = 29.78% 對得上；它占全部 Python 片段 527,774 的 7.6%（原文沒有寫）。這幾個比例都來自 50 個的樣本，原文沒有給區間。

### Google 搜尋結果（Table 6，L728–739；對過 PDF 第 9 頁）

| # | | 可解析 | 可執行 |
|---|---|---|---|
| 19 | 前 1 筆 | 78.1% | 30.8% |
| 20 | 前 10 筆 | 77.9% | 29.3% |

- 對照的全體 Python 片段：76% 可解析、25% 可執行（L765–767）。
- 多行片段的比例：前 1 筆 33.7%、前 10 筆 32.5%，「Both higher than the average of 30%」（L771–773）。
- 作者自己對可執行率的評語前後不同：L764–765「They are high.」；L777–779「the Google top results have a low runnable rate, although higher than average.」
- 失敗原因（L779–783）：「the majority of them suffered from undefined names or modules.」例子是圖 14：查詢「Check if a given key already exists in a dictionary」，片段用了未定義的 `keySet`。
- 作者的判斷（L784–790）：「Expecting snippets to be runnable as-is may be too strong of a constraint. Parsable snippets seem to be a much more fertile groud as the base for future automatic code generation. … For example for Python, missing symbol names often indicate a piece of information that needs to come from elsewhere – another snippet, or some default initialization.」
- 100 個查詢裡 85 個的原問題排第一、12 個在前十、3 個不在前十（L793–806）。
- 高於平均的可能原因，作者自己說是選了最熱門的問題（L811–815）：「These higher-than-average usability rates may be because we used the most popular queries」。

沒有做任何統計檢定；前 1 筆與前 10 筆的差距是 0.2 與 1.5 個百分點。

### 結論段的說法（第 6 節，L884–908）

「The results show that usability rates for the two dynamic languages is substantially higher than that of the two statically-typed, compiled languages. Heuristic repairs improved the results for Java, but not for C#. Even after the repairs, the compilable rates for both Java and C# are very low.」「Usability as-is, however, is not enough to ensure that the snippets have high information quality.」

## 作者自己列的限制

原文沒有 Limitations 或 Threats to Validity 節。第 6 節末尾有兩點「experiment choices deserve an explanation」（L915–939）：

1. 選 accepted answer 而不是得票最高的答案；發問者可能判斷錯，得票最高的可能更能用，留待未來比較（L916–924）。
2. **usability 的定義純技術性，不含有用與否**（L925–939）：「It is possible that a snippet that does not parse is more useful than the one that runs; or that a snippet that does not parse or run is still useful to the answer the question. For example, if the question asked in SO is not a specific programming query, people may answer with pseudo code, which is not usable in our case, but may also answer the original question.」前言也有同樣的話（L119–121）。

散在別處的：

- JavaScript 與 Python 的工具只抓第一個錯（L308–311、L327–329、L448–451）。
- 修補是啟發式，可能弄壞原本可用的片段（L656–658）。
- 註腳 2（L207–209）：程式與資料「available upon request」，是給審稿人的註記，留在這個版本裡。

原文沒有說的：片段擷取把行內 `<code>` 也算進去的影響（只在事後去掉單字片段）；執行環境有哪些套件；質性分析由誰判定；任何抽樣誤差；資料只到 2014 年 4 月。

## 與摘要說法不一致的地方

摘要沒有任何數字，逐句對過：

1. 摘要「Python and JavaScript proved to be the languages for which the most code snippets are usable. Conversely, Java and C# proved to be the languages with the lowest usability rate」與 Table 2 一致。但摘要用同一個詞 usable 涵蓋兩組不同的檢查：Java 與 C# 的第二關是編譯、Python 與 JavaScript 的第二關是執行（Table 1），四種語言能直接並排的只有可解析率。摘要沒有交代這一點。
2. 摘要完全沒提「可執行的片段裡大多數並沒有回答問題」（Step 1：16%，64% 是單一個字），只寫質性分析「shows the characteristics of the answers that solve the original question」。
3. 摘要沒提可執行率的絕對值很低（Python 25.61%、JavaScript 20.00%），「most usable」是相對說法。
4. 內文 L128「we saw a significant difference」的 significant 不是統計意義，全文沒有檢定。

## 與清單「要撐的結論」不合的地方

清單寫的是：「貼在說明文字裡的程式片段，可解析與可執行的比例依語言差很多」。

- **「可解析的比例依語言差很多」撐得住**：3.89%（Java）、16.00%（C#）、65.88%（JavaScript）、76.22%（Python），Table 2。
- **「可執行的比例依語言差很多」撐不住，要改寫。** 真正執行過的只有 JavaScript（20.00%）與 Python（25.61%），兩者相差不到 6 個百分點。Java 與 C# 沒有執行，量的是可編譯（1.00%、0.12%）。能寫的是：「靜態型別的兩種語言幾乎都過不了編譯，動態的兩種有兩成到兩成五原樣跑得起來」，並註明這是兩種不同的檢查。
- **「程式片段」的範圍比字面寬**：片段是 accepted answer 裡每個 `<code>` 標記的內容，單一個字的也算。C# 與 Java 各有約 37% 是單字（我由 Table 2、3 相減算出）；Python 可執行片段的 50 個抽樣裡 64% 是單字。所以 25.61% 這個數字不是「四分之一的程式範例跑得起來」：其中大半是行內提到的名字。多行且可執行的 Python 片段是 40,245 個，占全部 Python 片段 7.6%（我算的）。
- **原因與 Horton 2018 不同，兩篇不能合寫成一個原因。** 這篇的 Python 執行期錯誤 83.37% 是名稱未定義（片段只是整段程式的一部分，變數在別處），`No module named` 只有 5.00%（圖 11b）；Horton 的 gist 是獨立程式檔，52.4% 卡在 ImportError。Horton 說這篇「did not investigate why」，其實這篇有 2.6 節的錯誤訊息統計。
- **跑不起來不等於沒用**：作者自己說不能解析的片段可能比能跑的更有用（L119–121、L925–933），而且可執行的片段只有 16% 回答了問題。這篇不能拿來支持「片段跑不起來所以教學品質差」。
- **研究目的是自動程式生成**，不是教學或文件品質；沒有讀者、學習者的資料。資料是 2014 年 4 月的傾印。

## 讀取紀錄

| 順序 | 位置 | 內容 |
|---|---|---|
| 1 | `.txt` L1–1030（一次讀完） | 首頁、摘要、1 前言（含註腳 1）、2 Usability Rates（2.1 目標、2.2 擷取含註腳 2 與 3、2.3 處理與 Table 1、2.4 發現與 Table 2–3、2.5 範例、2.6 錯誤訊息、2.7 修補與 Table 4）、Table 5、3 質性分析、Table 6、4 Google 搜尋、5 相關研究、6 討論與結論、7 致謝；L949–1030 參考文獻 16 筆（掃過） |
| 2 | PDF 第 3–9 頁（逐頁看版面） | Table 1、2、3、4、5、6 逐格對過，與 `.txt` 相同；圖 2、3、4–7、8–11、12、13、14 看過，圖 8–11 的比例抄錄如上 |

PDF 第 1–2 頁（首頁、圖 1、前言）與第 10–11 頁（相關研究後半、結論、參考文獻）沒有另外看版面，那幾頁沒有表；圖 1 是一則 SO 問答的截圖，只讀了圖說。`.txt` 的 L470–521 是圖說與 2.7 節交錯，內容都讀到了。原文的節號有一處跳號：結論在文字檔裡標成 6、致謝 7、參考文獻 8，與前言預告的「Section 6 concludes the paper」一致。沒有附錄。

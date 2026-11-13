# 抽取紀錄：Mealin & Murphy-Hill 2012，VL/HCC（doi 10.1109/VLHCC.2012.6344485）

- 書目：Sean Mealin、Emerson Murphy-Hill（North Carolina State University 資訊工程系；首頁核過全名）。2012。An Exploratory Study of Blind Software Developers. *2012 IEEE Symposium on Visual Languages and Human-Centric Computing (VL/HCC)*, pp. 71–74. DOI 10.1109/VLHCC.2012.6344485（2026-10-14 以 Crossref 查得：題名、頁碼 71–74、會議名、作者 S. Mealin／E. Murphy-Hill 相符；清單「Mealin 2012 的 DOI 待補」可結案）。
- 取得網址：https://ciigar.csc.ncsu.edu/files/bib/Mealin2012-BlindDevelopers.pdf（NCSU 作者研究群網站，作者機構公開版本）。原文檔是經 Jina reader 轉的文字，檔尾停在參考文獻第 2 條。2026-10-14 我從本機直連此網址連線失敗（HTTPS 回 000），改抓 Wayback 存檔 http://web.archive.org/web/20240828121853id_/https://ciigar.csc.ncsu.edu/files/bib/Mealin2012-BlindDevelopers.pdf（同一個作者機構網址的 2024-08-28 快照，4 頁 PDF），用不帶 `-layout` 的 `pdftotext` 轉文字，補齊參考文獻 [2]–[10]。重抓檔存回 `q5-social/mealin2012-blind-devs.pdf`、`.txt`。
- 版本：PDF 頁面印有「2012 IEEE Symposium on Visual Languages and Human-Centric Computing 978-1-4673-0853-3/12/$31.00 ©2012 IEEE」與頁碼 71–74，是刊出版面。
- 原文檔：`.research/raw/learning-content/q5-social/mealin2012-blind-devs.md`，85 行、23,365 字元（Jina 轉文字，正文完整、參考文獻不全）；補抓的 `q5-social/mealin2012-blind-devs.txt`，466 行、24,371 字元。下文行號 L 指 `.md` 檔，R 指 `.txt` 檔。
- 讀取日期：2026-10-14
- 供：order 23

## 研究設計

- **類型**：探索性質性訪談研究（L38），作者自稱是第一個系統性描述現職盲人軟體開發者的實證研究（L18、L22）。
- **研究問題**（L28–34）：RQ1 用什麼工具；RQ2 用什麼做法；RQ3 怎麼與其他開發者協作；RQ4 對軟體開發的態度。
- **受訪者**（L38、L45、Table I）：8 人，全為男性，法定盲人且正在從事軟體開發；在 Program-L（服務盲人開發者的郵件清單）徵求，部分收件者再轉寄。7 人開發商用軟體、1 人開發自由軟體；都在美國本土、各在不同州；P4 是大學部學生但開發是工作的一部分。程式經驗 10–40 年（Table I：P1 21、P2 12、P3 40、P4 10、P5 25、P6 20、P7 13、P8 31）。視力：3 人完全沒有視覺（P2、P3、P4），其餘 5 人有基本形狀或顏色辨識，P6 另可讀大字。
- **程序**（L38）：第一作者（盲人、大學部學生）以 Skype 訪談，每場不到 1 小時到約 2 小時，節奏由受訪者主導；依回答追問。訪談稿放在作者網站。
- **分析方法**：論文沒有說明編碼或分析程序；結果以「哪幾位受訪者說了什麼」呈現，沒有百分比或統計。
- **沒有量**：沒有觀察實際操作，沒有比較組，沒有任何測量。

## 結果（逐項）

| # | 結果 | 誰（n） | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 主要螢幕閱讀器 | 除 P7 外都以 JAWS 為主（7/8）；P1、P4、P8 另用 NVDA；P7 以 NVDA 為主 | RQ1 Accessibility Tools | L49 | 「All interviewees with the exception of P7 primarily use the commercial screen-reader Jaws for Windows」 |
| 2 | 點字顯示器 | P2、P3、P7、P8 看程式碼時用（4/8）；P7 用來對括號；P2 用來看十六進位輸出，因為螢幕閱讀器會把相鄰字母念成一個字，「EF」與「EFF」聽起來一樣 | 同上 | L49 | 「screen readers make it difficult to distinguish between the hexadecimal numbers 'EF' and 'EFF' because they sound identical when spoken aloud.」 |
| 3 | 編輯器與 IDE | 多數用文字編輯器（P1、P2、P4、P7）；用 IDE 的有 P3、P5、P6、P7、P8；改用非主流 IDE 的人說原因是主流 IDE 不可及；但 5 人某些工作會用 IDE，表示 IDE 至少部分可用 | RQ1 Editors and IDEs | L51 | 「Interviewees who said they tended to use alternatives to mainstream IDEs cited lack of accessibility in those environments as the motivation」 |
| 4 | 其他工具很少用 | 靜態分析只有 P5 用（作者推測多數人不知道有這種工具）；問後 6 人除錯器，P3、P6 用基本功能，6 人都用 printf 除錯 | RQ1 Other Tools | L53 | 「apparently most interviewees were simply not aware of them」 |
| 5 | **取得程式碼整體概觀：螢幕閱讀器是線性的** | 作者的說明：明眼人用的 code beacon 對盲人不可用，因為螢幕閱讀器高度線性，迫使使用者讀過整份文件 | RQ2 Getting an Overview | L57 | 「This is because screen readers work in a highly linear fashion, forcing blind users to read through an entire document.」 |
| 6 | 靠 API 文件取得概觀 | 除 P8 外都說高度依賴 API 文件（7/8）；寫 C 系語言的人說讀標頭檔也有幫助 | 同上 | L57 | 「To get an overview of code, all interviewees except P8 indicated that they rely heavily on API documentation.」 |
| 7 | 用編輯器的尋找功能取得結構 | P1、P2、P7、P8（4/8）；但不如好的文件，因為要找對關鍵字很難（例：搜 public 找不到 private 方法） | 同上 | L57 | 「they said that it is not as helpful as good documentation because finding keywords to jump to can be difficult.」 |
| 8 | **寫程式時查資訊** | 明眼人可捲動看別處而游標不動；螢幕閱讀器使用者要把游標移到宣告處聽完再移回來 | RQ2 Information Seeking | L59 | 「Users of screen readers are not able to do the same thing; it is not possible to look through the code without moving the cursor as well.」 |
| 9 | 暫存緩衝區記識別字 | 除 P1 外都常開一個暫存文字區記方法或變數名（7/8） | 同上 | L59 | 「all interviewees except P1 indicated that they regularly have a temporary text buffer open to write notes, such as method or variable names.」 |
| 10 | 脫離脈絡編輯 | P3、P4、P6、P7、P8（5/8）把程式碼區塊複製到另一個視窗改完再貼回，因為這樣跳到區塊頭尾才不會跳到整個檔案的頭尾 | 同上 | L59 | 「In this way, out-of-context editing serves as a mechanism to predictably constrain cursor movement.」 |
| 11 | 團隊協作 | P2、P5、P6、P7、P8 談到團隊；P7 用版本控制與行號口頭溝通，正面經驗；P8 開會前要求先寄資料，與隊友互動少，被明眼同事看他用螢幕閱讀器操作時會覺得難為情 | RQ3 Teams | L63 | 「it embarrasses him that he cannot accomplish some tasks as fast as they can.」 |
| 12 | **圖表（UML 等）** | P7 請同事口述圖的內容再自己寫成文字；P5 說同樣資訊通常在別處（如文件）有；P8 被交付 UML 圖時覺得不可及；P3、P8 避開不用；P1、P2、P4 沒碰過；P6 認為描述複雜系統的圖必有詮釋上的歧義，要求他帶的團隊用「simple English」說明 | RQ3 Diagrams | L65 | 「He forced developers on the team that he led to explain diagrams in "simple English," which he thought is a lot more explicit and reduced errors due to interpretation.」 |
| 13 | 職涯 | 多數說失明在職涯選擇中扮演某種角色；整體覺得工作有成就感 | RQ4 Career | L69 | 「most said that their blindness played some role in their career choice.」 |
| 14 | **自覺的劣勢** | 反覆出現的主題是有視覺成分的工作（程式架構、使用者介面版面）；P3、P4 說網路上的數學式多是圖片、螢幕閱讀器無法讀；P5 抱怨 LabVIEW 等視覺語言；P8 說明眼同事用滑鼠快得多；問到 CSS 等 UI 設計，幾乎所有人都說沒有明眼人有效率或有信心 | RQ4 Challenges | L71 | 「P3 and P4 said that finding mathematical formulas in an accessible form is another disadvantage, because most formulas on the web are posted as images that cannot be used with a screen reader.」 |
| 15 | 自覺的優勢 | P3、P5、P6、P7、P8 說得出擅長的領域；P1、P4 不知道；P2 覺得沒有。P7、P8 擅長演算法設計等不易視覺化的工作；P6 說螢幕閱讀器讓他讀得極快，有利於讀文件，也擅長程式架構 | RQ4 Opportunities | L73 | 「P7 and P8 felt that they do well with tasks that are not easy to visualize, such as algorithm design.」 |
| 16 | 討論：多行點字顯示器 | 作者推測多行點字可幫助跨行對括號、「摸」出程式碼形狀（推測，無資料） | Discussion | L75 | 「Multi-line Braille displays could also help blind developers navigate code structures more quickly」 |
| 17 | 討論：工具發現 | 作者推測盲人開發者少用工具，是因為無法像明眼人那樣從 IDE 的圖示「看到」新工具；建議命令推薦系統、程式碼導覽工具 | Discussion | L77 | 「Blind developers do not have this luxury, both because screen readers cannot verbalize graphical icons」 |
| 18 | 討論：教育 | 作者自己「有限的經驗」：盲人資工學生常被免修不可及的部分；主張應該給工具而不是免修 | Discussion | L79 | 「Our limited experience has been that blind computer science students are excused from learning aspects of software development that are not readily accessible.」 |
| 19 | 討論：Python | 作者意外 Python 受歡迎（我數 Table I：P1、P4、P5 三人列 Python，P4 只列 Python）；有受訪者說空白字元用螢幕閱讀器難處理，但 P4 認為直譯器可互動、純文字，好處大於縮排的不便 | Discussion | L81 | 「As some interviewees pointed out, white space is sometimes difficult to use when using a screen reader, yet whitespace is critical to the semantics of Python.」 |

## 作者自己列的限制

- 結論能推廣到什麼程度需要未來研究量化，部分觀察的原因也還不清楚（L83）。
- 受訪者對自己擅長什麼反思不多，建議用觀察研究或訪談同事補足（L83）。
- 工具導覽需求要靠觀察盲人開發者實際編輯的研究來確認（L77）。
- 教育那段明說是作者「有限的經驗」（L79）。
- 沒有明列的限制但從方法可見：8 人、全男性、全在美國、透過單一郵件清單徵求、只有訪談沒有觀察、沒有說明分析程序。

## 與摘要說法不一致的地方

- 摘要說結果「suggest that visually impaired software developers face challenges, for instance, when using screen readers to look up information when writing code」（L18）。正文的 Information Seeking 節（L59）確實描述了查資訊要移動游標，但是「描述做法」，受訪者有自己的變通（暫存緩衝區，7/8）；正文沒有受訪者明說「這是困難」的引述，是作者從做法推論的困難。程度上摘要說得比正文強一點，但方向一致。
- 摘要寫「visually impaired」，受訪條件是法定盲人（L38），其中 5 人有殘餘視覺（Table I）。一致，只是用詞不同。
- 引言說「The APL programming language was designed specifically for blind software developers [6]」（L22），但 [6] 是 Sánchez & Aguayo 2005〈Blind learners programming through audio〉（R 檔參考文獻）。這裡的 APL 應該是指該文的 Audio Programming Language，不是 Iverson 的 APL；屬原文用詞含糊，不影響本研究結果，引用時不要沿用。

## 與清單「要撐的結論」不合的地方

清單：「8 人訪談：用螢幕閱讀器查資料是寫程式的難處之一」。大致撐得住，但要改寫：
1. 「查資料」原文是指**寫程式時查程式碼裡的資訊**（例如變數拼法、宣告處），不是上網查文件；因為螢幕閱讀器看別處必須移動游標（#8）。上網查資料的難處原文只有一處：數學式多是圖片、螢幕閱讀器讀不了（#14，P3、P4 兩人）。
2. 對 order 23（誰讀不到這篇文章）更直接相關的發現，清單沒提：螢幕閱讀器是線性的、很難取得整體概觀，所以 7/8 人靠 API 文件取得概觀（#5、#6）；圖表（UML）多半不可及，受訪者的做法是請人改用文字口述（#12）；數學式以圖片呈現讀不到（#14）。
3. 證據強度：8 位男性、同一郵件清單招募、只有訪談、沒有說明分析程序；只能當「有人這樣說」的質性線索，不能推成盛行率。

## 讀取紀錄

- `.md` 檔依序讀 L1–17（檔頭、作者）、L18（摘要）、L20–22（引言）、L24–45（研究問題、方法、Table I、人口學）、L47–53（RQ1）、L55–59（RQ2）、L61–65（RQ3）、L67–73（RQ4）、L75–81（討論）、L83–85（結論、致謝、參考文獻 [1]–[2] 前半）。涵蓋 L1–85 全文。
- `.txt` 檔讀 R400–466（討論後半、結論、完整參考文獻 [1]–[10]），補齊 `.md` 缺的文獻清單。
- Table I 用 `pdftotext -layout -f 2 -l 2` 對過 PDF 第 2 頁版面，8 列的經驗年數、視力、語言與 `.md` 一致。

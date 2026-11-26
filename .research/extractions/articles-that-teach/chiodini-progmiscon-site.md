# 抽取紀錄：progmiscon.org（Programming Misconceptions 網站，Chiodini 等人維護的誤解目錄）

書目：網站「Programming Misconceptions」（progmiscon.org），自稱「A Curated Inventory of Programming Misconceptions」。網站指定的引用文獻（about.txt L8）：Luca Chiodini, Igor Moreno Santos, Andrea Gallidabino, Anya Tafliovich, André L. Santos, Matthias Hauswirth. A Curated Inventory of Programming Language Misconceptions. *Proceedings of the 2021 ACM Conference on Innovation and Technology in Computer Science Education (ITiCSE '21)*, June 26–July 1, 2021, Virtual Event, Germany. DOI 10.1145/3430665.3456343。**那篇論文本身沒有讀**（清單標示沒有全文）；這份紀錄只涵蓋網站頁面。
讀取日期：2026-10-14
版本：2026-10-13 存的索引頁，加上 2026-10-14 用 curl 直接從 progmiscon.org 抓的 8 個頁面（網站是持續更新的社群目錄，頁面沒有標版本或日期）。
供哪幾篇使用：order 13（讀者已經相信錯的東西）。
文件性質：給程式教師用的參考目錄，**不是研究**；個別條目底下會列出相關研究的摘要數字，那些數字是網站轉述，沒有回原論文核對。

## 原文檔

| 檔案 | 網址 | 行數／位元組 | 來源 |
|---|---|---|---|
| `.research/raw/learning-content/q1-learner/progmiscon.txt`（另有 `.html`） | /misconceptions | 435 行／9,289 | 原有，2026-10-13 |
| `…/q1-learner/progmiscon_pages/about.txt` | /about | 28／1,814 | 本次新抓 |
| `…/progmiscon_pages/structure.txt` | /structure | 64／1,923 | 本次新抓 |
| `…/progmiscon_pages/contributors.txt` | /contributors | 56／3,668 | 本次新抓 |
| `…/progmiscon_pages/misconceptions_Python_AssignmentCopiesObject.txt` | /misconceptions/Python/AssignmentCopiesObject | 133／6,234 | 本次新抓 |
| `…/progmiscon_pages/misconceptions_Python_VariablesHoldObjects.txt` | /misconceptions/Python/VariablesHoldObjects | 55／2,190 | 本次新抓 |
| `…/progmiscon_pages/misconceptions_Python_IfIsLoop.txt` | /misconceptions/Python/IfIsLoop | 88／2,822 | 本次新抓 |
| `…/progmiscon_pages/misconceptions_Python_MultipleValuesReturn.txt` | /misconceptions/Python/MultipleValuesReturn | 116／4,677 | 本次新抓 |
| `…/progmiscon_pages/misconceptions_JavaScript_ConstReferenceImpliesImmutability.txt` | /misconceptions/JavaScript/ConstReferenceImpliesImmutability | 38／1,786 | 本次新抓 |
| `…/progmiscon_pages/misconceptions_Java_NoShortCircuit.txt` | /misconceptions/Java/NoShortCircuit | 134／4,954 | 本次新抓 |

每個新抓的頁面同目錄留有 `.html` 原檔；`.txt` 是我用自寫的 HTML 轉文字腳本產生的（保留連結網址與圖片 alt）。合計讀 10 個檔、1,147 行、39,357 位元組。

**涵蓋範圍要照實說**：目錄公開條目 104 條，我只讀了 6 條內頁（Python 4、JavaScript 1、Java 1），是我自己挑的（挑與本站讀者最相關的 Python 參照語意、控制流程，以及各一條別的語言），不是隨機抽樣。「每條內頁長什麼樣」的描述只對這 6 條負責；全站各欄位的填寫比例用 /structure 頁的統計。沒讀的頁面：/concepts、/specs、/textbooks、/notionalMachines、/relatedWork、/share、/contact、各篇 /reference/…，以及其餘 98 條內頁。

## 研究設計

不適用（參考網站）。網站自述的定位與來歷：

- 對象是教程式的老師：「The purpose of this web site is to help teachers who teach programming, in schools or universities.」（about L5）。不是寫給學習者自己讀的。
- 維護者：「maintained by a community of programming educators and researchers」；最初的收集多半來自瑞士國家科學基金會資助的計畫「Conceptual Change in Learning to Program」（計畫編號 200021_184689），執行單位是 Lugano Computing Education Research Lab（Luce）（about L17）。
- 貢獻者頁列 10 人（contributors L7–45）：Matthias Hauswirth（USI，收集初始條目並維護網站）、Andrea A.（發展以概念量表測量誤解出現率的方法「AMiCI」）、André Santos（Instituto Universitário de Lisboa）、Anya Tafliovich（University of Toronto，Python 版概念量表）、Luca Chiodini（USI，碩士論文做質性研究、擴充條目並提供範例）、Andrea Gallidabino（USI，JavaScript 條目）、Igor Moreno Santos（USI）、Joey Bevilacqua（USI）、Marco Hartmann（Schwyz University of Teacher Education，為 Scratch 誤解補上小學生的實證）、Tomáš Průcha（University of West Bohemia，Scratch 條目）。

## 結果（逐項）

### A. 目錄的規模（索引頁與 /structure 頁）

| # | 事實 | 數字 | 出處 | 原文 |
|---|---|---|---|---|
| 1 | 公開條目總數 | 104 | structure L8–9；索引頁逐條數過也是 104 | 「Programming Language 104 / 104」 |
| 2 | 各語言條目數（索引頁逐條數） | Java 55、Python 30、Scratch 13、JavaScript 6 | progmiscon.txt L9–423 | （每條三行：語言、代號、一句錯誤陳述） |
| 3 | 另有草稿條目 | 143 條，預設不顯示 | structure L5、L10 | 「"draft" misconceptions (right column), which contain several useful pieces of information but are not yet complete.」 |
| 4 | 條目數多寡不代表語言難易 | — | progmiscon.txt L6–7 | 「There is no connection between the number of misconceptions listed here and the difficulty of the corresponding programming language. The effort we spent on collecting misconceptions is very different for different languages.」 |
| 5 | 同一個誤解可跨語言各列一條 | 例：AssignmentCopiesObject 在 Java、JavaScript、Python 各有一條；NoAtomicExpression 三種語言都有 | progmiscon.txt L34、L230、L258；L118、L242、L306 | — |
| 6 | 索引頁每條的寫法：把**錯的說法**寫成一句肯定句 | 例「Assignment copies the object」「Arrays can grow dynamically」 | progmiscon.txt L35、L27 | — |

### B. 每條誤解記哪些欄位、各有多少條填了（/structure 頁，左欄公開 104 條、右欄草稿 143 條）

| # | 欄位 | 公開條目填寫數 | 草稿填寫數 | 行號 | 網站對欄位的分類 |
|---|---|---|---|---|---|
| 7 | Programming Language | 104 / 104 | 143 / 143 | L8–10 | 所有條目必備 |
| 8 | Incorrect Statement | 104 / 104 | 143 / 143 | L11–13 | 所有條目必備 |
| 9 | Correct Statement | 104 / 104 | 143 / 143 | L14–16 | 所有條目必備 |
| 10 | Concepts | 104 / 104 | 143 / 143 | L17–19 | 所有條目必備 |
| 11 | PL Specification（對應語言規格的章節） | 104 / 104 | 143 / 143 | L20–22 | 所有條目必備 |
| 12 | Correction（正確說明） | 104 / 104 | 121 / 143 | L25–27 | 公開條目必備 |
| 13 | Image | 104 / 104 | 9 / 143 | L28–30 | 公開條目必備 |
| 14 | Origin（誤解可能從哪來） | 47 / 104 | 19 / 143 | L33–35 | 額外欄位 |
| 15 | Symptoms（怎麼看出學生有這個誤解） | 57 / 104 | 12 / 143 | L36–38 | 額外欄位 |
| 16 | Value（怎麼利用這個誤解往下教） | 58 / 104 | 4 / 143 | L39–41 | 額外欄位 |
| 17 | Literature References | 55 / 104 | 18 / 143 | L42–44 | 額外欄位 |
| 18 | Expressible in Notional Machine | 67 / 104 | 73 / 143 | L45–47 | 額外欄位 |
| 19 | Explainer Video | 2 / 104 | 0 / 143 | L48–50 | 額外欄位 |
| 20 | PyTamaro Web Activity（瀏覽器內的互動活動） | 18 / 104 | 0 / 143 | L51–53 | 額外欄位 |

換句話說：公開的 104 條裡，有文獻佐證欄的是 55 條（約 53%），49 條沒有列任何文獻。

### C. 內頁的實際寫法（讀過的 6 條）

每條內頁最上方有一個狀態標籤：讀到的有「Observed in Published Research」（AssignmentCopiesObject L4、IfIsLoop L4、MultipleValuesReturn L4）與「Observed」（VariablesHoldObjects L4、ConstReferenceImpliesImmutability L4、NoShortCircuit L4）。標籤的定義在我讀的頁面裡沒有說明。留意 NoShortCircuit 標的是「Observed」，但頁尾列了四篇文獻。

共通骨架：代號 → Incorrect 一句 → Correct 一句 →「Correction／Here is what's right.」→（選填）Origin →（選填）Symptoms →（選填）Value → Language 與語言規格章節連結 → Concepts →（選填）Expressible In／Related Misconceptions／Other Languages →（選填）Literature References。

| # | 條目 | Incorrect／Correct | Correction 怎麼寫 | 有哪些選填欄 | 行號 |
|---|---|---|---|---|---|
| 21 | Python／AssignmentCopiesObject | 「Assignment copies the object」／「Assignment copies the reference to the object」 | 兩行程式（`table_tennis = Sport()`、`ping_pong = table_tennis`）逐行說明，再用 `id()` 輸出同一個數值來驗證 | Origin、Symptoms、Value、Related、Other Languages、文獻 2 篇、PyTamaro 活動 | L6–31、L32–64 |
| 22 | Python／VariablesHoldObjects | 「A variable contains a whole object」／「A variable contains a reference to an object」 | 用 `id(x)` 的小段程式 | Symptoms、Value、Related、Other Languages；沒有 Origin、沒有文獻 | L6–22、L23–30 |
| 23 | Python／IfIsLoop | 「The body of an if-statement executes repeatedly, as long as the condition holds」／「The body of an if-statement executes at most once」 | 把 `if` 與 `while` 兩段相同主體的程式並排，各附流程圖 | Symptoms、Value（只有一句「去讀 Python 官方教學的 Control Flow」）、文獻 1 篇、PyTamaro 活動 | L6–31、L32–38 |
| 24 | Python／MultipleValuesReturn | 「Functions can return multiple values」／「Functions can only return one value」 | 說明 `return v1, v2` 其實回傳一個 tuple，用 `pair[0]`、`pair[1]` 驗證 | Origin、Value、文獻 1 篇、PyTamaro 活動；沒有 Symptoms | L6–39、L40–73 |
| 25 | JavaScript／ConstReferenceImpliesImmutability | 「An object referred to by a const variable is an immutable object」／「An object referred to by a const variable can be a mutable object」 | 三句說明，提到兩個範例（文字檔裡看不到範例程式本體，可能是圖片或內嵌元件，沒有追） | Symptoms（只有一句請讀者看學生解題影片）；沒有 Origin、Value、文獻 | L6–17 |
| 26 | Java／NoShortCircuit | 「&& and \|\| always evaluate both operands」／「&& and \|\| evaluate their right operand only if absolutely necessary」 | 三行文字 | Symptoms（有副作用的 `tru()`、`fls()` 四個式子，註明「students claim "TF"」）、Value（兩小節）、文獻 4 篇 | L6–55 |

三個選填欄的固定引導句（每頁相同）：

- Origin：「Where could this misconception come from?」
- Symptoms：「How do you know your students might have this misconception?」
- Value：「How can you build on this misconception?」

值得照抄的內容：

| # | 內容 | 出處 | 原文 |
|---|---|---|---|
| 27 | 誤解的來源之一是**教師先前的簡化說法** | AssignmentCopiesObject L34–37 | 「For example, teachers may explain that an assignment to a variable "copies the number contained in the variable". But variables do not directly "contain" objects: they store references. When students later encounter mutable objects, this distinction becomes crucial.」 |
| 28 | 誤解的來源之一是**語言的輕量語法** | MultipleValuesReturn L47–49、L54–57 | 「Seeing code like this may lead to believe that functions like new_key_pair return two values.」 |
| 29 | Symptoms 寫的是可觀察的學生行為 | AssignmentCopiesObject L40–43 | 「They may be unable to explain why "a modification to one variable" also "affects the other variable"」 |
| 30 | 同上 | IfIsLoop L34–35 | 「Students claim an if-statement means "ensure that this condition holds"」 |
| 31 | 同上 | VariablesHoldObjects L25–26 | 「students draw diagrams of memory and some variable boxes contain the values instead of references to them.」 |
| 32 | Value 欄把誤解當成往下教的起點 | AssignmentCopiesObject L46 | 「This misconception is a great starting point to discuss how "everything is an object" in Python.」 |
| 33 | 同上 | VariablesHoldObjects L29–30 | 「This is a great opportunity to start discussing the idea of aliasing: two variables that refer to the same object.」 |
| 34 | 同上 | NoShortCircuit L33–36、L38–40 | 「This misconception provides an opportunity to discuss the following idiom, which would cause a NullPointerException if && always evaluated its right-hand operand: if (o!=null && o.isGood()) ...」 |
| 35 | 條目之間標註關係類型 | AssignmentCopiesObject L74–77；VariablesHoldObjects L39–40 | 「VariablesHoldObjects — Possible cause」「AssignCompares — A deeper misconception about assignment」「AssignmentCopiesObject — Operational consequence」 |

### D. 內頁轉述的研究數字（網站的摘要卡，**沒有回原論文核對**）

文獻欄的引導句是「The following papers directly or indirectly provide qualitative or quantitative evidence related to this misconception.」（各頁同）。注意「directly or indirectly」。

| # | 條目 | 研究（網站標示） | 網站列的數字 | 行號 |
|---|---|---|---|---|
| 36 | Python／AssignmentCopiesObject | Chiodini et al. 2025，「Quantitative systematic research」，「97 Swiss high school teachers and their students」 | 教師自己持有此誤解 26 / 97；教師熟悉此誤解 74 / 97；教師評重要性：Important 46、Somewhat Important 28、Not So Important 9、Not Important 6、I'm not sure 8；教師回報學生出現頻率：Frequently 13、Multiple Times 35、At Least Once 13、Never 18、I don't know 18 | L87–108 |
| 37 | 同上 | Lu and Krishnamurthi 2024，「Students from 2 universities and other users of online textbook」（研究的是 SMoL，不是 Python） | 持有誤解的學習者：CallsCopyStructs 10%、DefsCopyStructs 67%、StructsCopyStructs 6% | L109–122 |
| 38 | Python／IfIsLoop | Chiodini et al. 2025（同上樣本） | 教師持有 4 / 97；教師熟悉 43 / 97；重要性：62、19、9、3、4；學生出現頻率：7、17、17、51、5（順序同上） | L56–77 |
| 39 | Python／MultipleValuesReturn | Chiodini et al. 2025 | 教師持有 29 / 97；教師熟悉 61 / 97；重要性：32、34、23、5、3；學生出現頻率：3、24、19、32、19 | L84–105 |
| 40 | Java／NoShortCircuit | Altadmri and Brown 2015，「Repository mining study (BlueJ Blackbox)」，「250000+ students across the world」 | 錯誤 D「Confusing "short-circuit" evaluators with conventional logical operators」：8,742 / 250,000 使用者犯過 | L80–87 |
| 41 | 同上 | Brown and Altadmri 2017，「900+ students and 76 educators」 | 同一類錯誤：61,965 / 100,000,000 次編譯事件 | L88–95 |
| 42 | 同上 | Chiodini et al. 2025（標 Python，卻列在 Java 條目下） | 教師持有 30 / 97；教師熟悉 68 / 97；重要性：18、28、35、11、5；學生出現頻率：7、19、20、33、18 | L96–117 |
| 43 | 同上 | Hristova et al. 2003，「Qualitative (survey of instructors and students)」，人數不明 | 沒有數字 | L118–123 |

讀這幾列要留意的地方（都是從頁面文字就看得出來的）：

- #36、#38、#39、#42 的五個分項加總都是 97，是**教師的自陳與教師對學生的印象**，不是對學生的直接測量。
- #40、#41 量的是「把 `&`／`|` 和 `&&`／`||` 用混」這種寫錯的行為，網站把它列為 NoShortCircuit（以為 `&&` 一定算兩邊）的相關證據。兩者不是同一件事，網站自己用「directly or indirectly」帶過。
- #37 的研究語言是 SMoL，網站把它掛在 Python 條目下。

## 作者自己列的限制

- 條目數不反映語言難度，各語言投入的收集力氣差很多（progmiscon.txt L6–7）。
- 草稿條目 143 條「not yet complete」（structure L5）。
- 文獻證據可能只是間接相關（「directly or indirectly」）。
- 讀過的頁面沒有其他限制聲明；網站沒有宣稱目錄窮盡，也沒有宣稱每條都有實證。

## 與摘要說法不一致的地方

網站沒有摘要。把 about 頁的自我描述（「A Curated Inventory」、給教師用、社群維護）與 /structure 的統計、6 條內頁逐項對過，沒有矛盾。唯一要提醒的是「curated」不等於「每條都有研究佐證」：104 條裡 49 條沒有文獻欄，Origin、Symptoms、Value 三欄各只有約一半條目填了。

## 與清單「要撐的結論」不合的地方

清單寫：「實務端：程式領域有人把常見誤解逐條整理成目錄。本站讀者最接近的領域」。

- 「有人逐條整理成目錄」撐得住：104 條公開、四種語言、每條固定欄位。
- 「常見」兩個字要小心。網站自己不用「common」形容條目，頁面上只說是「the misconceptions we collected so far」（progmiscon.txt L4）。有文獻的條目裡，數字也顯示不少並不常見：IfIsLoop 有 51 / 97 位教師說從沒在學生身上看過；NoShortCircuit 對應的錯誤在 BlueJ 資料裡是 8,742 / 250,000 使用者。文章寫「研究者與教師收集到的誤解」比「常見誤解」準確。
- 這個目錄是寫給**教師**看的（about L5），欄位設計（Symptoms 問「怎麼看出你的學生有」、Value 問「怎麼接著教」）都是教師視角。它不是「教學文裡的常見誤解段落」的範例，也沒有任何一頁談到把誤解寫給學習者讀有沒有效。
- 可以從這裡引的具體寫法：每條都把錯的說法與對的說法各寫成一句並排；Correction 多半用一小段可執行的程式讓讀者自己驗證；另有欄位記「這個誤解可能是老師先前的簡化說法造成的」（#27）。
- 四種語言是 Java、JavaScript、Python、Scratch。本站的 AI／ML 內容（數學、機率、模型概念）不在目錄範圍內，「最接近的領域」只對程式語言語意成立。
- 網站背後的 ITiCSE '21 論文沒讀。凡是「這份目錄怎麼收集、怎麼審」的說法，目前只有 about 與 contributors 頁的幾句話可引。

## 讀取紀錄

依序整檔讀完（每個檔從第 1 行到最後一行）：

1. `progmiscon.txt` L1–435（索引頁全部 104 條，逐條讀過並計數）。
2. `progmiscon_pages/about.txt` L1–28。
3. `progmiscon_pages/structure.txt` L1–64（統計表 14 列，文字檔一格一行；左公開、右草稿的對應依 L5 的說明）。
4. `progmiscon_pages/contributors.txt` L1–56。
5. `misconceptions_Python_AssignmentCopiesObject.txt` L1–133。
6. `misconceptions_Python_VariablesHoldObjects.txt` L1–55。
7. `misconceptions_Python_IfIsLoop.txt` L1–88（流程圖只剩節點文字）。
8. `misconceptions_Python_MultipleValuesReturn.txt` L1–116。
9. `misconceptions_JavaScript_ConstReferenceImpliesImmutability.txt` L1–38（範例程式沒有出現在文字裡）。
10. `misconceptions_Java_NoShortCircuit.txt` L1–134。

沒有讀的東西：各條的圖片、PyTamaro 互動活動、解說影片、/reference/ 底下各研究的詳細頁、其餘 98 條內頁、ITiCSE '21 論文。/structure 的統計表沒有另外對瀏覽器畫面，只依 HTML 轉出的文字順序判讀。

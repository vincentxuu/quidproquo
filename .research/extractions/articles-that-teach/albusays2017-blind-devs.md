# 抽取紀錄：Albusays、Ludi、Huenerfauth 2017，Interviews and Observation of Blind Software Developers at Work to Understand Code Navigation Challenges（ASSETS '17，doi 10.1145/3132525.3132550）

- **書目**：Khaled Albusays（Rochester Institute of Technology 博士班）、Stephanie Ludi（University of North Texas）、Matt Huenerfauth（RIT）（三人全名對過首頁 L5–33）。2017。In *Proceedings of the 19th International ACM SIGACCESS Conference on Computers and Accessibility (ASSETS '17)*，October 29–November 1, 2017, Baltimore, MD, USA，pp. 91–100（頁尾頁碼 91–100）。Session: The Future of Work and the Web for People with VI。DOI 10.1145/3132525.3132550（L129）。
- **原文檔**：`.research/raw/learning-content/q5-social/albusays2017-blind-devs.pdf`（10 頁，1,503,636 位元組）。清單上的 `albusays2017-blind-devs.txt`（780 行、91,413 字元）是 `-layout` 轉的雙欄檔，**這次沒用**；改用不帶 `-layout` 的 `pdftotext` 重轉成 `.research/raw/learning-content/q5-social/albusays2017-blind-devs.seq.txt`（1,462 行、71,129 字元）。**下面行號一律是 `.seq.txt` 的行號**。這份 PDF 是 Word 產生的，不帶 `-layout` 轉出來大致照欄序，但第 2–3 頁與第 8–10 頁仍有段落前後錯置（例如 §2.2 插在 §2.1 之前、§6 結論與參考文獻交錯），照節號重組後讀過。
- **取得網址與版本**：https://www.rit.edu/academicaffairs/facultyscholarship/submit/download_file.php?id=37018 ——RIT 學術事務處的教師著作典藏（Faculty Scholarship）。2026-10-14 重新下載，SHA-1 `64ff9d92…9b819b` 與本機檔完全相同。檔內是 ACM 會議版面（頁首 session 名稱、頁尾頁碼 91–100、首頁 ACM 版權聲明與 DOI），PDF 由 Acrobat PDFMaker for Word 產生，看起來是作者送 ACM 的定稿、由作者所屬機構典藏公開；與 ACM DL 刊出版是否逐字相同沒有比對。OpenAlex 對這個 DOI 只列 ACM 出版頁、沒有列開放取用位置。
- 讀取日期：2026-10-14
- 供 order 23 使用（清單 F，23#7）

## 研究設計

- **類型**：探索性質性研究，線上觀察加半結構訪談（§4，L329–346）。方法上參考 Szpiro 等的情境探究。研究問題（§3，L323–327）：RQ1 盲人開發者在程式碼中導覽遇到什麼困難；RQ2 用什麼工具；RQ3 用什麼變通辦法或策略。
- **前導研究**：作者先前對 69 位盲人程式設計者做過線上問卷（Albusays & Ludi 2016），受試者把「在程式碼裡導覽、理解其結構」列為主要困擾；這次是追問（L101–110、L401–411）。
- **受試者**（§4.2，L429–475）：經私人郵件清單與 Google、LinkedIn、AppleVis 的盲人社群招募，36 人回應；篩選條件：5 年以上程式經驗、18 歲以上、自認全盲、正在以工作或興趣寫程式、使用螢幕閱讀器或點字顯示器。8 人因使用放大鏡與矯正鏡片被排除。最後 28 人，**全為男性**，22–52 歲（平均 29.68，SD 6.59），程式經驗 5–24 年，就業狀況不一。全部用螢幕閱讀器，8 人另用點字顯示器。美國 22、英國 3、澳洲 1、印度 1、荷蘭 1。
- **程序**（§4.1、§4.3，L360–535）：先以 5 位明眼程式設計者做模擬訪談試行，修改用詞。正式訪談經 Skype 或 Google Hangouts，2016 年 1–12 月，每人約 1 小時，事先寄同意書與題目。題目 5 題選擇、16 題開放，主題：人口資料、語言與工具、輔助科技、開發風格、導覽困難、導覽工具、團隊合作。接著觀察：受試者傳送語音、電腦音訊與螢幕畫面，用 Screencast-o-matic 錄下；請他們 (1) 開一份自己近期工作中的程式碼並講解其結構，(2) 示範常遇到的導覽困難，(3) 導覽一份沒看過的別人的程式碼，(4) 示範變通辦法，(5) 示範有幫助的工具。觀察中會插問；不指定語言與工具；有人不願或不能做某項就不勉強。招募在第 27、28 位沒有新議題出現後停止。酬勞 50 美元禮券。
- **分析**（§4.4，L477–520）：封閉題記錄答案；開放題做筆記、記下引述與時間戳。NVivo 開放編碼；兩位研究者獨立編碼、定期討論類別；「In rare cases when coders disagreed (inter-rater reliability = 67%)」（L513–514）開會取得共識。依各議題被提出的次數形成主題（次數多代表需求或重要性高），用親和圖整理。
- **沒有量的**：沒有任何任務表現指標（時間、錯誤率）；沒有明眼對照組；報的數字都是「提到某議題的人數」。

## 結果（逐項）

Table 1、Table 2 已對 PDF 第 5、7 頁（頁尾 95、97）版面。

### RQ1：導覽困難（§5.1、Table 1，L570–713）

Table 1 是「訪談中提到該困難的人數」（N = 28），依人數排序：

| 困難 | 說明（原文定義摘要） | 人數 |
|---|---|---|
| Debugging | 為了理解錯誤輸出而在程式碼中導覽 | 24 |
| Line by Line | 想找特定資訊卻只能逐行線性讀過整份程式碼 | 23 |
| Indentation | 在以縮排分區塊的語言（如 Python）中，用螢幕閱讀器分辨不出空白層級 | 22 |
| Nesting | 在巢狀的方法、迴圈、函式、類別中導覽 | 20 |
| Back Track | 看完別的檔案後很難快速回到某一行 | 18 |
| Errors | 在長程式碼中很難快速找到錯誤 | 14 |
| Scope | 很難理解目前的作用域層級 | 14 |
| Characters | 很難察覺某些字元、運算子、括號 | 10 |
| Autocomplete | 自動完成與螢幕閱讀器不相容 | 9 |
| Relationship | 分辨不出類別與子類別等實體關係 | 9 |
| Line Numbers | 行號不能被螢幕閱讀器讀出（例：PyCharm＋VoiceOver） | 7 |
| Elements | 無法快速找到陣列、類別、函式中的特定元素 | 5 |

| # | 結果 | 數字 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 除錯靠印出 | 19 人依賴 print／trace 等簡單除錯法，理由是除錯工具多半不可及；9 人用進階除錯工具 | §5.1 Debugging | L561–643 | 「P4 and many other participants (n = 19) decided to rely on simple debugging techniques such as inserting print commands in the code or tracing」 |
| 2 | 逐行讀 | 18 人說他們為了取得概觀會逐行讀過整份程式碼，因為螢幕閱讀器是線性的；8 人改用關鍵字搜尋，但同一關鍵字多處出現時要再前後讀幾行確認 | §5.1 Line by Line | L648–706 | 「most of our participants (n = 18) indicated that they tend to go through a codebase line by line, mainly because screen readers encourage users to move through text in a linear fashion.」 |
| 3 | 縮排被念成一串 "space" | Python 是最多人用的語言（18 人）；螢幕閱讀器把縮排念成「space, space, space」而不是「three spaces」；多數人改成逐區塊跳讀 | §5.1 Indentation | L707–738 | 「the blind programmer will hear his or her screen reader verbalizing whitespaces as a single space (e.g., "space, space, space") rather than a count ("three spaces").」 |
| 4 | 縮排的兩種補救 | 5 人寫腳本讓螢幕閱讀器念出空白數或縮排層級；4 人覺得點字顯示器（用摸的）判斷縮排更有用 | §5.1 Indentation | L757–801 | 「Although calculating whitespaces and verbalizing it helped several participants (n = 5), others (n = 4) found a braille display much more helpful in determining the level of whitespaces.」 |

### RQ2：工具（§5.2、Table 2，L803–861、L888–1028）

| # | 結果 | 數字 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 5 | 輔助科技 | NVDA 12、JAWS 10、ORCA 5、VoiceOver 4、LSR 3、Windows-Eyes 1（原表拼法）、點字顯示器 8（可複選） | Table 2 | L918–939 | 「Although many participants (n = 12) decided to use NVDA for personal reasons or financial constraints, others (n = 16) preferred to use a different type of screen reader」 |
| 6 | 點字顯示器的用途 | 6 人說比螢幕閱讀器快；2 人說減少「聽覺負擔」；2 人用多行點字顯示器以一次讀多行、看結構 | §5.2.1 | L813–865 | 「Some participants (n = 6) explained that they preferred to use a refreshable braille display to navigate through a codebase because it was quicker than a screen reader.」 |
| 7 | 語言與作業系統 | Python 18（64%）、Java 10、C++ 10、SQL 7、C 6…；Windows 23、Linux 8、Mac 4；15 人會多種語言、13 人只會一種 | §5.2.2、Table 2 | L869–917、L918–964 | 「18 participants (n = 64%) indicated that they use Python」 |
| 8 | 編輯器 | Notepad++ 18、PyCharm 16、Visual Studio 12、NetBeans 8、Notepad 6、Notepadqq 5、Eclipse 4…；「all participants preferred to use simpler editors rather than current IDEs」，但也「all participants agreed that IDEs are necessary at times」 | §5.2.2、Table 2 | L1014–1028、L853–861 | 「In regard to development tools, all participants preferred to use simpler editors rather than current IDEs.」 |
| 9 | 自動完成不可及 | 自動完成的彈出選單螢幕閱讀器不認得；P15 與其他盲人程式設計者合寫外掛 | §5.2.2 | L1024–1028、L853–858 | 「this feature is not fully accessible to screen reader users, mainly because it appears on the screen as a pop-up which the screen reader does not recognize.」 |

### RQ3：策略（§5.3，L876–1172）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 10 | 簡單編輯器搭配 IDE | 26 人靠簡單編輯器寫程式；8 人用它記錄錯誤、bug 狀態與變數位置；7 人用它免得看別處時丟失目前位置 | L902–912 | 「most participants (n = 26) indicated that they rely on simple editors to write software code」 |
| 11 | 自訂腳本 | 19 人調整螢幕閱讀器設定；9 人寫自訂腳本（例：讓螢幕閱讀器讀出行號） | L995–1032 | 「most participants (n = 19) modified screen reader settings to match their own personal needs. Others (n = 9) wrote custom scripts」 |
| 12 | 快捷鍵 | 9 人用快捷鍵定位；12 人用來取得結構資訊；有人批評在不熟的程式碼裡跳區塊很難、快捷鍵與螢幕閱讀器衝突 | L1033–1100 | 「several participants (n = 9) indicated that they use shortcut keys as a navigation strategy.」 |
| 13 | 註解當書籤 | 16 人把註解用來克服導覽障礙而非說明程式；6 人用來標錯誤、9 人用來標待檢查的程式碼；分享前會因難為情把這些註解刪掉 | L1101–1114、L1172–1184 | 「most participants (n = 16) used commenting, not in the traditional manner … but rather to overcome navigation barriers.」 |
| 14 | 避免求助明眼同事 | 16 人傾向不向明眼同事求助（因花時間較久而難為情、想證明視力不影響工作）；10 人認為必要 | L1143–1170 | 「Although most participants (n = 16) tended to avoid seeking help from sighted co-workers, others (n = 10) found it necessary.」 |

### 想要的 IDE 功能（§5.4，L1063–1207）

訪談中描述幾種可能的功能請受試者表態：整體 82%（23 人）有興趣、18% 說也許會試（L1071–1073）。

| 功能 | 有興趣 | 也許會試 | 行號 |
|---|---|---|---|
| 樹狀檢視（Tree View） | 18（64%） | 原文沒給 | L1085–1093 |
| 聽覺回饋 | 19（68%） | 9（32%） | L1124–1138 |
| 書籤或標籤（跳到某個敘述而非行號） | 24（86%） | 4（14%） | L1172–1196 |
| 巢狀與作用域層級指示 | 19（68%） | 9（32%） | L1230–1247 |
| 類別關係（如用聲音提示子類別） | 17（61%） | 11（39%） | L1281–1299、L1198–1203* |

\*類別關係一段在 `.seq.txt` 跨頁被切開：說明在 L1281–1299，人數在 L1198–1203。

這些是「聽了描述後表示有興趣」，**沒有任何功能被實作或測試**。作者自己在結論說要正式評估（L1393–1396）。

## 作者自己列的限制（§6，L1300–1319）

- 只研究有經驗、全盲、正在寫程式、使用輔助科技的開發者；初學者與視力狀況更多樣的人不在範圍內，「A further investigation into such an important user group may reveal different findings」（L1304–1307）。
- 質性設計；未來應以問卷對更大的群體驗證部分發現（L1308–1319）。
- 作者**沒有**列、我讀到的：28 人全為男性；招募自盲人社群郵件清單與線上群組；評分者一致率 67% 偏低；數字是「提到的人數」，提到與否受訪談題目引導（作者在 §5.3 自己說為了避免受試者只講困難，特別問了策略，L878–882）；沒有明眼對照，無法說哪些困難是盲人特有的。

## 與摘要說法不一致的地方

- **IDE 偏好前後矛盾**：導論列的第一個主要發現說「participants still preferred to use IDEs, even though they encountered these navigation difficulties」（L139–143）；§5.2.2 卻寫「all participants preferred to use simpler editors rather than current IDEs」（L1014–1015）；§5.3 寫 26 人靠簡單編輯器（L902）；結論寫「blind programmers prefer simpler editors」又寫「blind programmers still rely on them [IDEs]」（L1254–1266）。比較一致的讀法是「多數偏好簡單編輯器，但都同意有時非用 IDE 不可」，「偏好 IDE」這句與結果不合。
- **「rare cases」與 67%**：§4.4 說編碼者「In rare cases when coders disagreed」，括號卻是 inter-rater reliability = 67%，即約三分之一不一致，稱不上少見。
- **第三個主要發現**說受試者不自在向「colleagues or researchers」揭露需求與障礙（L179–182）；結果節只支持「同事」這一半（避免求助明眼同事、分享前刪註解），對「研究者」的部分結果節沒有資料。
- 摘要說「these approaches often reduced their speed and introduced mistakes」（L57–59）：結果節只有受試者的自述與引述（例如「takes forever」），沒有量速度或錯誤。
- 結論說樣本「much larger」（L1220–1221）：相對於先前 8 人、12 人的研究是對的，但作者自己先前的問卷是 69 人。
- 其餘逐項對過，沒有。

## 與清單「要撐的結論」不合的地方

清單（23#7）暫定：「程式結構靠縮排與顏色表達，螢幕閱讀器傳達不了」。

- **縮排這一半撐得住**：Table 1 有 22／28 人提到縮排困難；原文具體描述螢幕閱讀器把縮排念成一串「space」、受試者要寫腳本或改用點字顯示器才分辨得出層級（L707–801）。巢狀（20 人）與作用域（14 人）也相關。
- **顏色這一半原文沒有撐**：「different colors for syntax highlighting」只在導論第一段當作 IDE 的視覺輔助被提到（L117–119），結果節沒有任何關於顏色或語法上色的發現、人數或引述。要寫「顏色傳達不了」得另找來源，或只寫成作者在導論的陳述。
- 寫法上要限定：28 位有經驗、全為男性的盲人開發者的自述與示範，數字是「提到的人數」，不是量出來的表現差距。若文章要談的是「教學文章裡的程式碼」，這篇是關於開發者在 IDE 中導覽程式碼，不是讀教學文章；縮排與巢狀的困難可以類推到程式碼區塊，但類推要明說。

## 讀取紀錄

- `.seq.txt` L1–560（首頁、摘要、§1 導論、§2 文獻回顧、§3 研究問題、§4 方法、§5 開頭）；L560–1119（§5.1、Table 1、§5.2、Table 2、§5.3 前半）；L1120–1462（§5.3 後半、§5.4、§6 結論與限制、致謝、參考文獻、§9 線上附錄）。三段首尾相接，涵蓋全文。參考文獻只掃過。
- 對過 PDF 版面：第 5 頁（頁尾 95，Table 1：困難名稱與人數的對應在文字檔裡被拆成兩串，對 PDF 確認順序 24、23、22、20、18、14、14、10、9、9、7、5 對應 Debugging 到 Elements）、第 6 頁（頁尾 96）、第 7 頁（頁尾 97，Table 2 四欄）。其餘頁只讀文字檔。
- §9 提到補充材料（額外引述的 CSV、每位受試者的工具表）放在 ACM DL 與 http://latlab.ist.rit.edu/assets2017code ，沒去讀。

# 抽取紀錄：Reich & Ruipérez-Valiente 2019，The MOOC pivot

- **書目**：Justin Reich、José A. Ruipérez-Valiente（兩人單位皆為 Massachusetts Institute of Technology）。The MOOC pivot. *Science* 363(6423), 130–131，2019 年 1 月 11 日。DOI 10.1126/science.aav7958。稿件自己的題目是「The MOOC Pivot: From Teaching the World to Online Professional Degrees」。作者姓名與單位對過後印本首頁；卷期頁碼取自後印本檔頭與 MIT Teaching Systems Lab 的書目頁（`q4-time/reich2019-mooc-pivot-tsl.md`）。
- **版本**：作者最終稿（後印本，MIT Open Access Articles，「Author's final manuscript」，CC BY-NC-SA 4.0）。**不是 Science 刊出版**；刊出版在付費牆後，沒有讀，兩者文字是否逐字相同沒有核對。
- **原文檔**（本次重抓）：
  - PDF：`.research/raw/learning-content/q4-time/reich2019-mooc-pivot-postprint.pdf`（16 頁：封面 1 頁、正文 7 頁、補充材料 8 頁；562,082 位元組）
  - 文字：`.research/raw/learning-content/q4-time/reich2019-mooc-pivot-postprint.txt`（829 行、24,593 字元；不帶 `-layout` 的 `pdftotext`）
  - 來源網址：https://dspace.mit.edu/server/api/core/bitstreams/4e5eedab-3c8d-47c9-89c9-d294763e6568/content（即 https://hdl.handle.net/1721.1/136215 頁面上的 `post_print-MOOC_Pivot.pdf`；handle 頁的一般下載連結當時回 429，改走同一機構典藏的 REST 端點）
  - 清單原列的兩個檔（`reich2019-mooc-pivot.md` 缺第 3–5 頁、`reich2019-mooc-pivot-exa-excerpt.md` 只有節錄）沒有用來抽取，只拿來對照字句。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 19（為什麼多數人讀不完）第 1 列
- **行號**：以下一律是 `reich2019-mooc-pivot-postprint.txt` 的行號；表格另標 PDF 頁碼（檔案頁序，含封面）。

## 研究設計

- **類型**：Science 的 Policy Forum 短評，附描述性統計。沒有假設檢定、沒有模型、沒有任何顯著性檢定或信賴區間。論點（MOOC 業者轉向線上專業碩士學位）是作者的詮釋，資料只用來描述三個趨勢。
- **資料**（L121–125、L351–357）：MITx 與 HarvardX 在 edX 上開過的全部 MOOC，從 2012 年啟動到 2018 年 5 月。565 個開課梯次（course iterations）、261 門不同的課、1,267 萬筆選課註冊、563 萬名學習者；補充材料另寫 44 億筆事件、4,800 萬小時。
- **年度切法**（L356–357）：每年 6 月到隔年 5 月為一個年度。作者註明先前部分 HarvardX／MITx 研究是 9 月到 8 月，所以數字不能直接和那些報告比。
- **變項定義**（補充材料，L363–379）：
  - Course enrollments：註冊一門課的人次。
  - Unique learners：不重複的學習者，不管註冊幾門。
  - Participants：「Learners that registered and viewed the course.」註冊且進過課程。
  - Explorers：「Learners that viewed at least half of the chapters of a course.」
  - Completers：「Learners that achieved a passing grade at the end of a course.」達到及格成績。
  - Verified：付費進入認證軌的人。
  - Certified：及格**且**拿到認證證書的人。
  - Registration year cohort：以第一次註冊課程的年度分群。
  - Percentage retention：原文寫「Percentage of learners from a registration year cohort that registered for a course during that year.」
  - Intention to complete：課前問卷自述打算完成課程。
  - HDI：聯合國 2017 年人類發展指數與分級。
- **資料處理**：edX 點擊流經 edx2bigquery 整理成「人—課」資料集，60 多個變項（L358–360）。
- **可重現性**：GitHub `jruiperezv/MOOC_Pivot` 有程式與說明；學習者資料受 FERPA 保護不公開，可向 MIT、Harvard 申請（L384–395）。
- **經費與利益**：無特定經費；作者聲明無利益衝突（L315–317）。

## 結果（逐項）

### A. 進入課程與跨年留存

| # | 結果 | 數字 | 對照／分母 | 出處 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| A1 | 註冊後從未進入課程 | 52% | 分母是註冊者。出處標 Table S4，該表是**以課為單位**（N = 565 個梯次）的統計：每門課「participants 佔比」的平均數 48.02%、中位數 51.01%、標準差 15.49。52% 是 100 − 48.02，也就是各課比例的平均，不是把 1,267 萬筆註冊合起來算的比例；用中位數算是 49% | 正文＋Table S4（PDF 第 15 頁，對過） | L130–132、L790–819 | 「Of those who register for a course, 52% never enter the courseware (Table S4), and attrition typically remains high in the first two weeks of a course (10).」 |
| A2 | 看過至少一半章節（explorers） | 各課平均 25.59%、中位數 19.84%、標準差 19.54 | 以課為單位，N = 565；分母原表沒寫明，依表題與 A1 的用法應是註冊者 | Table S4 | L805–811 | 表列。正文沒有引用這個數字 |
| A3 | 拿到認證證書（certified） | 各課平均 5.03%、中位數 2.88%、標準差 6.04 | 同上。注意 certified 的定義是及格且有認證證書，和 Table S3 的 completers（及格）不是同一個量 | Table S4 | L813–819 | 表列。正文沒有引用這個數字 |
| A4 | 新學習者人數先升後降 | 各年首次註冊的不重複學習者：2012–13 年 192,255；2013–14 年 755,800；2014–15 年 630,992；2015–16 年 1,108,858；2016–17 年 531,213；2017–18 年 499,736 | 六個年度的新群 | Table S1（PDF 第 12 頁，對過）、Fig. 1 | L147–150、L399–493 | 「The largest initial cohort was in year 4 (2015-2016) with 1.1 million unique learners … Cohorts since 2015-2016 have been half the size of largest cohort.」注意正文說「increase for the first four years」，但表上 2014–15 年（63.1 萬）比 2013–14 年（75.6 萬）少 |
| A5 | 第二年留存率，逐群下降 | 2012–13 群 37.5%（72,093／192,255）；2013–14 群 27.23%；2014–15 群 23.06%；2015–16 群 11.68%（129,562／1,108,858）；2016–17 群 **9.98%**（53,030／531,213） | 該群在首年之後那一年又註冊任一門 HarvardX／MITx 課的比例 | Table S1、Fig. 1 | L151–152、L472–493 | 「Second year retention rates have declined with every cohort, from 38% in the first cohort to 7% in the year 5 (2016-2017) cohort.」**正文的 7% 與表不符，見「不一致」第 1 點** |
| A6 | 最大的一群隔年只剩 12% | 11.68% | 2015–16 群在 2016–17 年 | Table S1 | L148–150 | 「only 12% of those learners took an additional HarvardX MITx course in the following year」 |
| A7 | 各群後續年度的留存 | 2012–13 群：24.18%、18.77%、11.28%、7.83%（第 3 到第 6 年）；2013–14 群：19.41%、10.16%、6.88%；2014–15 群：9.66%、6.11%；2015–16 群：8.38% | 同上 | Table S1 | L472–493 | 表列 |

### B. 成長集中在富裕國家

| # | 結果 | 數字 | 出處 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| B1 | 註冊人次中「極高人類發展」國家的佔比 | 2012–13 年 59.28%；2013–14 年 65.55%；2014–15 年 62.82%；2015–16 年 61.95%；2016–17 年 57.44%；2017–18 年 55.58% | Table S2（PDF 第 13 頁，對過） | L612–638 | 表列 |
| B2 | 證書中「極高人類發展」國家的佔比 | 61.98%、71.55%、71.2%、71.66%、68.71%、68.7%（同上六年） | Table S2 | L640–666 | 表列 |
| B3 | 「低人類發展」國家 | 註冊佔比 3.63%、1.82%、1.89%、1.79%、2.28%、3.2%；證書佔比 4.57%、1.78%、1.59%、1.03%、1.68%、1.43%；證書數從 796 張（2012–13）到 298 張（2017–18），最高 1,244 張（2014–15） | Table S2 | L565–666 | 表列 |
| B4 | 極高組的註冊人次 | 205,955 → 1,359,191 → 1,583,635 → 1,798,426 → 947,969 → 954,426 | Table S2 | L562–585 | 正文的說法：「nearly all of the growth (and subsequent decline) in new registrations and certifications came from the world's most affluent countries」（L160–161） |
| B5 | 極高組的證書數 | 10,798 → 43,235 → 55,674 → 46,790 → 17,827 → 14,341 | Table S2 | L587–610 | 同上 |

### C. 完成率

Table S3（PDF 第 14 頁，對過版面）。三群都是 participants（進過課程的人）裡面的子群；第二、三群不互斥。完成＝及格。**表只有五個年度，沒有 2012–13 年。**

| 年度 | 全部參與者：人數／完成數／完成率 | 自述打算完成：人數／完成數／完成率 | 付費認證軌：人數／完成數／完成率 |
|---|---|---|---|
| 2013–14 | 1,219,030／60,285／4.96% | 178,909／20,593／11.51% | 6,790／3,003／44.23% |
| 2014–15 | 1,333,780／78,085／5.91% | 191,578／33,986／17.74% | 27,490／13,792／50.17% |
| 2015–16 | 1,958,222／80,495／4.13% | 209,333／34,416／16.44% | 52,384／26,051／49.73% |
| 2016–17 | 1,097,759／43,726／3.98% | 74,116／11,952／16.13% | 47,362／26,725／56.43% |
| 2017–18 | 980,589／30,650／3.13% | 42,005／6,478／15.42% | 46,326／21,321／46.02% |

- 正文對這張表只有定性的話，沒有引任何數字（L179–183）：「Finally, the bugaboo of MOOCs, their low completion rate (10), has not budged in six years. … Six years of investment in course development and learning research has not produced meaningful improvements in these figures (13, 14).」
- 後段一句（L204–205）：「course completion remains relatively low even among those paying for courses」。

### D. 論點與引用（不是本文的資料結果）

- 轉向的事實陳述：edX 於 2018 年 10 月宣布線上專業碩士學位，為主要 MOOC 業者中最後一家；Udacity 與 Georgia Tech 的合作早五年；edX 2018 年 5 月開始對原本免費的內容設付費牆（L63–67）。來源是業者部落格（文獻 6、7）。
- 價格：MOOC 業者支援的學位會是一般美國線上專業學位的二分之一或四分之一（L93–97，引 Phil Hill 訪談，文獻 9）；例子是 Indiana 的 21,000 美元線上會計碩士、Illinois 的 22,000 美元線上 MBA（L208–209）。
- 線上課程的一般成效（L215–218，引 Xu & Jaggars 2014）：「By most indications, students typically do worse in online courses than in residential courses, and the challenges of online learning are particularly acute for the most vulnerable populations」。這是引用別人的結論，不是本文資料。
- 支援方式（L233–235，引文獻 17、18）：「most established research suggests that human connections through advisors, tutors, and peer groups provide the most important student supports」。同樣是引用。
- 總結判斷（L238–247）：「MOOCs will not transform higher education, and they probably will not disappear entirely.」「New education technologies are rarely, perhaps never, disruptive; rather they are domesticated by existing cultures and systems (19).」

## 作者自己列的限制

全文沒有限制節。只有一句（L124–125）：「Data from other edX partners or MOOC providers might reveal different dynamics, but we have a detailed view of two of the largest course providers.」

沒有被作者提到、但從定義與表可以直接看出的範圍限制（這是我的整理，不是作者的話）：

- 資料只有 HarvardX 與 MITx；Coursera、Udacity、FutureLearn、edX 其他夥伴都不在內。
- 「留存」只算有沒有再註冊一門 HarvardX／MITx 的課，去別家修課的人會被算成流失。
- 完成率的分母是「進過課程的人」，不是註冊者。若改用註冊者當分母，數字大約再減半（依 A1，各課平均約 48% 的註冊者進過課程）；這個換算原文沒有做。
- 完成的定義是及格，量的是拿到成績，不是學到多少。
- 三群完成率隨年度變動的同時，群的組成也在變（自述打算完成的人數從 20.9 萬掉到 4.2 萬，付費人數從 6,790 升到 5 萬上下），原文沒有討論組成變化對比率的影響。

## 與摘要說法不一致的地方

1. **正文「7%」與自己的補充表不符**。正文（L151–152）說第二年留存率「from 38% in the first cohort to 7% in the year 5 (2016-2017) cohort」。Table S1 與圖 1 上，2016–17 群在 2017–18 年是 53,030／531,213 = **9.98%**，圖上標「53030 (10%)」。表裡最接近 7% 的是 2013–14 群在 2017–18 年的 6.88%（圖上標「51996 (7%)」），那是第五年留存，不是第二年。圖 1 右端幾個標籤擠在一起，正文很可能讀錯了標籤；這是我的推測。依表，第二年留存率是 37.5% → 27.2% → 23.1% → 11.7% → 10.0%。「每一群都比前一群低」這句話在表上成立，終點數字應是 10% 而不是 7%。這個落差出現在後印本；Science 刊出版是否相同，沒有核對。
2. **「六年沒有改善」只有五年的完成率資料**。摘要（L37）與正文（L179）說完成率六年沒動，Table S3 與圖 3 只有 2013–14 到 2017–18 五個年度（圖上是 Year 2 到 Year 6），第一年沒有資料，原文沒有說明原因。
3. **「has not budged」「not improved」對三群不是同一回事**。全部參與者的完成率是下降的（2014–15 年 5.91% → 2017–18 年 3.13%，約掉了一半）；自述打算完成的人是先升後緩降（11.51% → 17.74% → 15.42%），終點高於起點；付費的人在 44% 到 56% 之間起伏，終點 46.02% 略高於起點 44.23%。「沒有改善」說得通，「沒有動」則掩蓋了全體參與者是在變差。
4. **「52% 從未進入」是各課比例的平均**（見 A1），不是全體註冊人次的比例；正文沒有說明這一點。
5. **摘要「the vast majority of MOOC learners never return after their first year」**：依 Table S1，各群第二年有 10% 到 37.5% 的人回來，第一群超過三分之一。「絕大多數」對後期各群成立，對 2012–13 群較勉強。
6. **「New unique learners increase for the first four years」**（L147–148）：表上第三年（630,992）低於第二年（755,800），不是連四年上升。
7. 小處：正文末尾與補充材料封面寫「Tables S1-S4 and Figure S1」（L325、L337），補充材料裡那張圖的標題卻是「Fig. S2」（L823），全檔只有一張補充圖。文獻 13 的年份寫 2017（Science 347 卷應是 2015 年），照錄不改。

## 與清單「要撐的結論」不合的地方

清單寫：「52% 從未進入內容；隔年留存 38%→7%；六年沒改善」。

- **「52% 從未進入內容」**：撐得住，但要寫成「各門課平均有 52% 的註冊者從未進入課程」，並註明範圍是 HarvardX 與 MITx 的 565 個開課梯次；中位數算是 49%。
- **「隔年留存 38%→7%」**：**要改寫**。原文正文確實這樣寫，但它自己的 Table S1 與圖 1 是 37.5% → 9.98%。文章若引，應引表上的數字（約 38% → 10%），並說明正文寫的是 7%、與附表不符；或者只寫「從三成八降到一成」。不能把 7% 當成查證過的數字直接用。
- **「六年沒改善」**：方向撐得住，措辭要改。完成率資料是五年；全體參與者的完成率從 5.91% 降到 3.13%，是變差；付費者大致持平在四成五到五成六。
- 清單「沒有可精讀的來源」表裡寫「MOOC 各年的完成率數值（3.13%、46%）只在 Reich 2019 的圖裡，手上是二手報導」：**這一條可以解除**。後印本的補充材料 Table S3 有逐年的人數、完成數與比率（見 C 節），3.13% 是 2017–18 年全部參與者、46.02% 是同年付費認證軌，兩個數字都對得上一手來源。引用時要帶分母：是「進過課程的人」裡面及格的比例，不是註冊者。
- 這篇是政策短評，三個趨勢是描述，沒有回答「為什麼讀不完」。order 19 若用它，只能當成現象的規模，不能當成原因的證據。

## 讀取紀錄

`reich2019-mooc-pivot-postprint.txt` 一次從 L1 讀到 L829（全檔）：

- L1–10：MIT 典藏封面
- L12–46：題目、作者、摘要、一句話摘要
- L48–247：正文（含圖 1、圖 2、圖 3 的圖說）
- L248–309：參考文獻 1–21（掃過）
- L315–327：致謝、經費、資料取得、補充材料清單
- L329–395：補充材料封面、Materials and Methods、變項定義、重現分析說明
- L399–493：Table S1
- L497–666：Table S2
- L670–786：Table S3
- L790–819：Table S4
- L823–829：Fig. S2 圖說

對過 PDF 版面的圖表：圖 1（PDF 第 4 頁）、圖 2（第 5 頁）、圖 3（第 6 頁）、Table S1（第 12 頁）、Table S2（第 13 頁）、Table S3（第 14 頁）、Table S4（第 15 頁）、Fig. S2（第 16 頁）。文字檔裡四張表都被拆成一欄一串，上面每個數字都是對過 PDF 版面後才抄的；A5 的比率另外用人數自己除過一次（53,030／531,213 = 9.98%、72,093／192,255 = 37.5%、129,562／1,108,858 = 11.68%）。

沒有讀的：Science 刊出版的正文與刊出版的補充材料（付費牆／未取）；GitHub 上的程式與 csv。

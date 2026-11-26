# Bergman & Whittaker 2016 — The Science of Managing Our Digital Stuff, Chapter 2 "Keeping"

read_status=read（第 2 章全文，書頁 pp. 33–50；來源是**非官方網路鏡像**的電子書文字，不是 MIT Press 官方檔案）

## 書目

- 作者：Ofer Bergman, Steve Whittaker
- 書名：The Science of Managing Our Digital Stuff. Cambridge, MA: The MIT Press, 2016. ISBN 9780262035170。
- 章：Chapter 2 "Keeping"（副標 Overview, Problems, and Strategies），pp. 33–50。
- 章 DOI：10.7551/mitpress/9780262035170.003.0002
- 讀的版本：vdoc.pub 上的電子書全文（https://vdoc.pub/documents/the-science-of-managing-our-digital-stuff-7vua0rmnrne0），`curl -L -A "Mozilla/5.0"` 取 HTML（HTTP 200，481,096 bytes）→ 去標籤成文字 → 擷取第 2 章（原文字檔第 218–274 行）→ `fold -s -w 110` → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/bergman-whittaker-2016-ch2.txt`
  - 版權頁與 CIP 資料（LCCN 2016015017、ISBN 9780262035170、「Printed and bound in the United States of America」）與 MIT Press 精裝本一致；頁碼標記（如「34 / Chapter 2」「Keeping / 35」）保留在文字中，可對到書頁。
  - **這是未授權鏡像**（站方自稱「uploaded by our user」）。只用於核對內容；正文引用請以 MIT Press 正式版為準，逐字引文最好再對一次紙本或 MIT Press Direct。
  - 鏡像為 OCR／抽字，有少量斷字（如「betterinformed」「deeprooted」），不影響語意。
- 章摘要（官方）：取自 doi.org/10.7551/mitpress/9780262035170.003.0002 的索引摘要（Exa 搜尋結果，標 The MIT Press eBooks, 2016-11-04）。全文如下：
  - 「People can't save personal copies of every single piece of information that they encounter so they have to actively decide what information to keep. Keeping is challenging because it requires people to predict their future information needs when those needs may change over time. Because predicting information needs is difficult, people tend to overkeep; they retain low-value information that clutters their archives, making it hard to retrieve important information. Keeping is affected by information type, with email and paper archives largely being retained, in contrast to contacts and web information. People are also generally unaware that overkeeping unimportant information makes it more difficult to retrieve valuable information.」
  - 委託方提供的兩句原句（「people tend to overkeep…」「People are also generally unaware that overkeeping unimportant information makes it more difficult to retrieve valuable information.」）與此摘要一致。注意：**這兩句是章摘要（MIT Press Scholarship Online 的 chapter abstract），不是正文原句**；正文對應句子見下。

## 本章性質

- 文獻回顧＋作者自己過去研究的整理（作者明說「we will focus on our own research rather than reviewing the entire PIM literature」，見第 1 章結尾 p.31）。本章沒有新資料。
- 結構：開場（keeping 的兩種成本、每日 keeping 決策量、為何難以預測未來）→ Keeping Paper（Whittaker & Hirschberg 2001）→ Keeping Email（Dabbish et al. 2005；Whittaker & Sidner 1996）→ Keeping Contacts（Whittaker, Jones & Terveen 2002）→ Keeping Web Pages（Tauscher & Greenberg 1997；Wen 2003）→ Keeping Photos（Whittaker, Bergman & Clough 2010）→ Summary。

## 摘要兩句在正文的對應與實證依據

### 句 1：「people tend to overkeep; they retain low-value information that clutters their archives, making it hard to retrieve important information」

- 「overkeep」部分有實證（都是保留率／刪除率，不是檢索表現）：
  - 紙本：Whittaker & Hirschberg 2001——丟 22%、留 78%、平均 18 箱以上、搬家前花近九小時整理、丟掉的有 23% 沒讀過、74% 超過一年沒清、84% 的清理由外部事件觸發（pp. 37–39）。
  - Email：Dabbish et al. 2005——保留約 70%；可行動訊息即使立即回覆仍保留 85%、只刪 0.5%；資訊性訊息刪 30%（pp. 42–45）。
  - 聯絡人：Whittaker, Jones & Terveen 2002——平均 858 個聯絡人，只認為 14%（118 個）重要（p. 47）。
  - 書籤：Tauscher & Greenberg 1997——58% 書籤從未使用（p. 48）。
  - 照片：Whittaker, Bergman & Clough 2010——年輕家庭父母平均 4,475 張，自估刪 17%，留下許多近似重複（p. 48–49）。
- 「making it hard to retrieve important information」部分：**第 2 章正文沒有引用任何量過檢索時間或成功率的研究。** 正文的說法是：
  - p. 33（開場「Exploitation costs」）：「Keeping information of low value increases the difficulty of retrieval. Keeping too many items can be distracting and inefficient if manual navigation is used for access.」——無引用；接著指向第 5 章（導航 vs 搜尋）與第 8 章。
  - p. 50（Summary）：「Two major weaknesses of deferral are that (1) people seldom return to their collections to carry out a reevaluation of tentatively kept information and (2) deferral means that collections are full of items of dubious value, which makes it more difficult to find truly valuable information.」——無引用。
  - 第 1 章 p. 30 附近（Interrelations between Keeping, Management, and Exploitation）用的是保留語氣：「Critically, having more information may increase the difficulty of exploitation; finding what one needs may be harder when there is more kept information, and irrelevant information can distract.」
  - 全書結論（Conclusions 回顧第 2 章）也用保留語氣：「These cognitive difficulties lead people to overkeep, retaining low-value information that in many cases they never access, which potentially interferes with their retrieval of valuable information.」

### 句 2：「People are also generally unaware that overkeeping unimportant information makes it more difficult to retrieve valuable information.」

- 正文對應（p. 50 Summary）：「People do not generally seem to be aware of the implications of overkeeping. Although they complain about how full their inboxes are, they nevertheless delete only 30 percent of email messages—and even after spending days working though paper archives, they still preserve 78 percent of the same. On the web, in contrast, there is a suggestion that people do not bookmark because they are aware that doing so will make valued materials harder to find. This could be because they consider web information to be unimportant or because they think it is easily recoverable by other means.」
- **依據是行為推論，不是測量覺察**：作者從「抱怨收件匣滿卻只刪 30%」「整理數天仍留 78%」推論人們沒意識到後果。沒有引用任何直接問受試者「是否知道存太多會更難找」的研究。正文用「do not generally seem to be aware」，摘要升級為「are generally unaware」。
- 「people do not bookmark because they are aware that doing so will make valued materials harder to find」標為「there is a suggestion」，無引用。
- 照片段落（p. 49）有一句相關觀察：「One of the reasons people gave for such overkeeping was that they perceived little cost in keeping many photos. Therefore, they were not focused on the exploitation or retrieval context when they made keeping decisions.」（Whittaker, Bergman & Clough 2010）——這是較接近「不覺得有成本」的自陳證據。
- 全書結論另一處（Conclusions，用展望理論解釋）：「users are focused on information loss, overestimating the risks of deletion, and underestimating retrieval costs when making keeping decisions.」——同樣是理論解釋。

## 可引用結果（第 2 章內）

1. **Keeping 的兩種成本**（p. 33）：「Management costs: We need to organize information if we are to obtain value from it. The more we keep, the more management effort is required.」「Exploitation costs: Keeping information of low value increases the difficulty of retrieval. Keeping too many items can be distracting and inefficient if manual navigation is used for access.」並說搜尋論者主張「future retrieval will be entirely search based, reducing exploitation costs regardless of how much we keep」，第 5 章提出反證。
2. **每天的 keeping 決策量**（p. 34）：Boardman & Sasse 2004 每天約 5 個新檔案、每 5 天 1 個書籤；每天 1 個新聯絡人（Whittaker, Jones & Terveen 2002）；約 5 張照片（Whittaker, Bergman & Clough 2010）；email 每天收 44 封、留 24 封（Whittaker et al. 2011）；「this equates to over 350,000 keeping decisions over a fifty-year digital life」（作者自行估算）。
3. **為何難以決定**（p. 35）：要預測未來；人們預測未來時偏誤（Gilbert 2009；Kahneman & Tversky 1979）；損失趨避——「thinking about information in a context in which it might be deleted leads them to overvalue it」。「Somewhat curiously, in spite of the prevalence of keeping decisions, relatively little research has looked at keeping directly.」
4. **紙本搬家研究**（pp. 36–39，Whittaker & Hirschberg 2001）：「They discarded just 22 percent of their original archives, with the final preserved archive occupying on average more than eighteen mover's boxes.」「23 percent of discarded data were unread.」「74 percent of the participants in our paper study had not cleaned out their archives for over a year. Furthermore, very few cleanups occurred spontaneously: 84 percent arose from extrinsic events such as job changes or office moves.」「only 49 percent of people's original archive was unique—with 36 percent consisting of copies of publicly available documents.」保留公開資料副本的四理由：availability, reminding, lack of trust in external stores, sentiment。
5. **筆記／註記的長期價值低**（p. 41）：「Taking notes helps focus attention and improves comprehension of what is read or heard (Kalnikaité and Whittaker 2007, 2008a; Sellen and Harper 2002). Although most people make such annotations, they seem of little practical long-term use. Many people stated that annotations have transient value, becoming uninterpretable after some time has elapsed. This is consistent with recent studies of long-term note taking, which show that the utility of handwritten notes decreases rapidly even after a month (Kalnikaité and Whittaker 2007, 2008a). In other words, there may be less value to keeping annotated materials than people believe.」
   - 書目核對：書中「Kalnikaité and Whittaker 2007」是 CHI 2007〈Software or Wetware? Discovering When and Why People Use Digital Prosthetic Memory〉pp. 71–80；「2008a」是 British HCI 2008〈Cueing Digital Memory: How and Why Do Digital Notes Help Us Remember?〉pp. 153–161。**不是** MeMos 2007 workshop 那篇〈Does Taking Notes Help You Remember Better?〉（該篇見 `kalnikaite-whittaker-2007-note-taking-memory.md`）。
6. **Email**（pp. 42–45，主要是 Dabbish et al. 2005）：保留約 70%；資訊性訊息約佔 34%；可行動訊息 65% 立即回覆但仍保留 85%、37% 被延後、只刪 0.5%；資訊性訊息刪 30%；討論串佔 30–62%。
7. **聯絡人**（pp. 46–47）：「In spite of having huge archives of contacts (858 on average), participants rated only 14 percent (118) as important and worth keeping.」
8. **網頁的雙向錯誤**（pp. 47–48）：commission——「Tauscher and Greenberg (1997) showed that 58 percent of bookmarks are never used」；omission——Wen 2003「people were able to later find only about 20 percent of information they had previously accessed and attended to in an earlier information retrieval session」。
9. **照片**（pp. 48–49）：平均 4,475 張、自估刪 17%、留下近似重複；「they perceived little cost in keeping many photos」；預期之後整理，但「this rationalization seldom occurred」。
10. **Summary**（pp. 49–50）：「Errors are made, and the primary tendency is to overkeep— conservatively keeping things that are never accessed later. Overkeeping is observed with paper, email, contacts, and photo archives.」「deletion is relatively infrequent, varying from 17 percent for photos to 30 percent for email messages」。

## 書中其他章節的相關實證（非第 2 章；只讀了相關段落，未依序讀完）

這些是本書裡**真正量過檢索表現**、與「存太多→更難找」有關的研究，供後續追原始論文：

- **第 4 章 Exploitation，pp. 83–84：Bergman et al. 2010（JASIST）**。296 名受試者在自己電腦上找 1,131 個常用檔案、分析 5,035 個導航步驟：平均深度 2.86 層、每資料夾 11.82 個檔案；成功率 94%、平均 14.76 秒。「Retrieval time and success depended on folder size and depth」。回歸模型：「each additional folder step increases retrieval time by 2.236 seconds, and each new information item added to a folder increases retrieval time by 0.106 seconds」→ 建議每資料夾不超過約 21 個項目。**這是書中最直接的「項目越多→找越久」量化證據**，但量的是資料夾大小對導航時間的效果，不是「低價值項目」本身。
- **第 4 章照片檢索（Whittaker, Bergman & Clough 2010）**：「The most frequent explanation participants gave for their difficulties in retrieving pictures was of the sheer volume of pictures they had to access.」「it was only during retrieval that they realized so many pictures made it hard for them to locate a target from the thousands they had retained.」——受試者的自我解釋，不是控制比較。
- **第 10 章 DMTR（Bergman, Komninos et al. 2012）**：18 人；47% 聯絡人超過六個月未用或從未用；兩個月後用自動降級的 DMTR 找最近用過的聯絡人，「reduced both the number of key strokes and the retrieval time significantly」（書中未給數字）。
- **第 10 章 Old'nGray（Bergman et al. 2014）**：受試者內 N=60，找某檔案的最新版本；舊版本被淡化後「drastically reduced file access failures from an average of 24 percent in the control condition to 4 percent. It also reduced retrieval time from an average of 17.68 seconds in the control condition to 6.56」秒——**這是「無關舊項目干擾檢索」最強的量化證據**，但情境限定在多版本檔案。
- 第 10 章重述 GrayArea（Bergman et al. 2009）：只有清理比例與主觀容易度，沒有檢索資料。

## 作者列的限制

- 本章未設限制段。作者自述：「Somewhat curiously, in spite of the prevalence of keeping decisions, relatively little research has looked at keeping directly.」（p. 35）以及第 1 章「we will focus on our own research rather than reviewing the entire PIM literature」——即回顧以作者群自己的研究為主，非系統性回顧。
- 網頁情況與其他媒介相反（有 omission 錯誤），作者在 Summary 承認「There is also evidence from some web studies of the opposite tendency」。

## 與摘要或常見轉述不一致處

1. **摘要把「更難找」寫成定論，正文第 2 章沒有對應的實證引用。** 正文 p.33、p.50 的句子都無引用；第 1 章與全書結論用的是「may increase」「potentially interferes」。轉述成「研究顯示存太多讓重要資訊更難找」時，不能以第 2 章為出處；要用第 4 章的 Bergman et al. 2010 或第 10 章的 Old'nGray，並說清楚它們量的是什麼。
2. **「People are generally unaware…」在正文是「do not generally seem to be aware」，依據是保留率的行為推論**，不是對覺察的測量。
3. **摘要說聯絡人與網頁資訊「not largely retained」**（「in contrast to contacts and web information」），但正文聯絡人段落也說「our study participants often overkept contact information, leading to huge rolodexes」；差別在於聯絡人「a larger proportion … are judged as unimportant」（86%）。網頁則同時有 58% 書籤從未用（overkeep）與只能找回 20%（underkeep）。摘要把兩種媒介簡化成「不太保留」。
4. **Summary 寫刪除率「varying from 17 percent for photos to 30 percent for email messages」**，但紙本是 22%、email 整體保留約 70%（即刪約 30%）；這裡的 30% 實為資訊性 email 的刪除率（可行動 email 只刪 0.5%）。p.50 又寫「they nevertheless delete only 30 percent of email messages」，混用了「資訊性訊息刪 30%」與「整體保留 70%」兩個數字。
5. **紙本的 49% 獨有**：書只寫「49 percent … unique—with 36 percent consisting of copies of publicly available documents」，省略了原論文的「15% was unread」，讀起來像 49+36=85，剩下 15% 沒交代。
6. **筆記段落（p.41）「the utility of handwritten notes decreases rapidly even after a month」** 引的是 Kalnikaité & Whittaker 2007（CHI）與 2008a（BHCI），不是 MeMos 2007 workshop 論文。後者只發現筆記量與 PM 正確率無相關，並把「notes become hard to interpret … at longer retention intervals」當成可能解釋、再引回 CHI 2007。
7. 鏡像文字 p.50 有原書錯字「working though paper archives」（應為 through），照抄。

## 讀取紀錄

- 檔案：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/bergman-whittaker-2016-ch2.txt`，329 行，30,951 bytes（第 2 章全章）。
- 原始鏡像全文：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/dl/vdoc.txt`，1,076 行（每行約一頁），436,322 bytes。
- 依序讀過第 2 章檔：第 1–170 行（pp. 33–42：開場、Keeping Paper、What Do We Keep and Why、筆記註記、Keeping Email 開頭），第 170–329 行（pp. 42–50：Informative／Actionable email、Contacts、Web Pages、Photos、Summary）。全章讀完，無跳讀。
- 頁碼對照（章檔行號→書頁）：1–14→p.33；17–34→34；37–54→35；57–72→36；75–91→37；94–110→38；113–129→39；132–148→40；151–166→41；169–185→42；188–203→43；206–223→44；226–241→45；244–260→46；263–278→47；281–297→48；300–315→49；318–329→50。
- 章外段落（只讀相關段落，用 grep 定位）：鏡像第 172 行（第 1 章 Interrelations）、第 371、374 行（第 4 章 Bergman et al. 2010）、第 423 行（第 4 章照片檢索）、第 781、787 行（第 10 章 DMTR、Old'nGray）、第 870、906 行（全書結論）、第 1002 行附近書目（Kalnikaité 條目）。這些不是依序全讀。
- 取得過程：Exa 搜尋「Bergman Whittaker The Science of Managing Our Digital Stuff chapter 2 Keeping overkeep」→ 第 1 筆為 doi.org 章摘要、第 4 筆為 vdoc.pub 全文鏡像。未另試 Google Books／MIT Press Direct 試讀，因為已取得全章文字；若需正式頁面截圖核對，下一步是 MIT Press Direct（direct.mit.edu）的章節頁。

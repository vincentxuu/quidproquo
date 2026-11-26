# Kalnikaitė & Whittaker 2007 — Does Taking Notes Help You Remember Better? Exploring How Note Taking Relates to Memory

read_status=read（全文 4 頁，取自工作坊論文集 PDF 第 33–36 頁；指定的 diuf.unifr.ch 單篇 PDF 連不上，改讀同篇收在論文集裡的版本）

## 書目

- 作者：Vaiva Kalnikaitė, Steve Whittaker（The University of Sheffield）
- 出處：Workshop "Supporting Human Memory with Interactive Systems"（MeMos 2007），HCI 2007（British HCI conference），September 4th, 2007, Lancaster, UK。論文集 pp. 33–36。編者 Denis Lalanne & Elise van den Hoven。
  - 論文集目錄裡的標題是「Does Taking Notes Help You Remember Better? Exploring What Note Taking Patterns Lead to Better Organic Memory」；論文本身首頁標題是「…Exploring How Note Taking Relates to Memory」。
- 性質：**工作坊立場論文（4 頁）**，非同儕審查的完整論文。資料與 CHI 2007〈Software or Wetware? Discovering When and Why People Use Digital Prosthetic Memory〉同一個實驗：「The data for this paper was collected during an experiment investigating relationships between OM and PM [3]. This paper presents further results examining how the quality and quantity of collected notes affects OM.」
- 讀的檔案：http://www.elisevandenhoven.com/publications/lalanne-hci07wp.pdf（工作坊論文集，54 頁，`curl -L -A "Mozilla/5.0"` HTTP 200）→ `pdftotext -f 33 -l 36`（非 layout，依閱讀順序）→ `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/kalnikaite.txt`
  - 頁首每頁有「Workshop "Supporting Human Memory with Interactive Systems", HCI Conference, September 4th, 2007, Lancaster, UK」與頁碼「- 33 -」到「- 36 -」。
  - 雙欄抽字後段落順序有錯置（例如 3.3 的結果出現在 3.1 小節標題之前、版權聲明被拆成單字），已依語意還原。
- 取得過程（依序）：
  1. `curl -L -A "Mozilla/5.0" http://diuf.unifr.ch/people/lalanned/MeMos07/files/kalnikaite.pdf` → HTTP 000（連線失敗），下載 0 bytes。
  2. 同網址改 https → HTTP 000，0 bytes。
  3. Exa `web_fetch_exa` 抓 diuf 網址 → 只回傳索引摘要（abstract），沒有正文。
  4. Exa 搜尋找到工作坊論文集 PDF（elisevandenhoven.com）→ 成功，論文在 PDF 第 33–36 頁，即本紀錄所讀版本。（Semantic Scholar 也有論文集鏡像 pdfs.semanticscholar.org/1804/04e7…，未使用。）

## 研究設計

- 受試者：25 人（14 女、11 男，23–55 歲），大學研究人員、行政與管理人員、公私部門專業人士；不知研究假設；都沒用過 ChittyChatty。
- 設計：受試者內實驗。聽一段模擬老友重逢的對話故事（平均 3.20 分鐘，事實與虛構各半），一邊用指定工具做筆記：
  - CC：ChittyChatty，數位筆記與錄音時間對齊的裝置。
  - PP：紙筆。
  - 故事與工具的順序對抗平衡。
- 三個時間點：當天、7 天後、30 天後。當天記筆記並立即回想；7 天、30 天後回答當天內容的問題，可看筆記（PM，prosthetic memory），也可只靠記憶（OM，organic memory），系統記錄每題用哪一種。
- 每題作答前問「有多確定能不靠工具記得」→ Confidence。
- 量了什麼：
  - 正確率：兩位獨立評分者依正式評分表。
  - 筆記品質（Quality）：兩位不知假設的編碼者先訂「理想筆記」，0–5 分；含全部關鍵字（或同義詞）與脈絡得 5 分；部分分數＝關鍵字齊但脈絡不足／不準，或脈絡對但關鍵字不全；兩人獨立評分，分歧交第三人。
  - 筆記數量（Quantity）：寫下的字數，排除冠詞等無意義字。
  - 信心：第一次 session 的自評。
- 四個假設：H1 Equivalence（CC 與 PP 筆記品質、數量相似）；H2 Distraction（記詳細筆記會分心、之後 OM 較差）；H3 PM Capture（詳細筆記讓看筆記作答更準）；H4 Confidence（對記憶有信心的人筆記較少）。
- 分析：相關係數（報告為 r (1, 24)），CC 與 PP 合併分析（因 H1 成立）。

## 可引用結果

1. **筆記品質與不看筆記的記憶正相關**。3.3 Distraction Hypothesis（p. 35）。
   - 「We correlated OM Accuracy scores (when people chose to use their OM to answer questions) with overall Quality of CC & PP notes combined. We found a positive correlation (r (1,24) = 0.4, p<0.01). Thus, people who take higher Quality notes, generally have better OM. So contrary to the Distraction hypothesis, taking high quality notes doesn't distract people from OM remembering. Instead, if they take good notes they tend to remember better.」
   - 作者解釋：「This suggests that notes may function to reinforce information being committed to OM, by helping people to focus on what is important to remember.」
2. **筆記量與不看筆記的記憶無關**。3.3（p. 35）。
   - 「There was no correlation between the Quantity of combined CC & PP notes and OM Accuracy (r (1, 24) = 0.07, p>0.1). Thus the sheer volume of notes is unrelated to OM.」
3. **筆記量與看筆記作答的正確率也無關**。3.4 PM Capture Hypothesis（p. 35）。
   - 「There was no correlation between PM note Quantity and PM Accuracy scores (r (1,24) = 0.1, p>0.1). Thus people who take more detailed notes, do not do better at PM recall. This may be because notes become hard to interpret especially at longer retention intervals of a week or month [3].」
   - 結論再述（p. 36）：「We expected users with more notes to be able to overcome potential OM weakness by 'reading off' the answers from their notes. Somewhat surprisingly we did not find a relationship between note quantity and PM accuracy. This may be because at longer retention intervals the cryptic nature of most notes and the fact that they do not capture information such as emotions, background setting or context, makes them increasingly hard to interpret.」
4. **對自己記憶沒信心的人記較多筆記**。3.5 Confidence Hypothesis（p. 35）。
   - 「We found a strong negative correlation between the Quantity of PM notes and user Confidence score during the first session (r (1, 24) = -0.5, p<0.05). This suggests that people take more notes if they are not confident that they can remember using their OM.」
   - 結論的詮釋：「People take more notes when they are less confident about their OM, suggesting that they may be concerned about being distracted, and overcompensate for this.」
5. **數位與紙筆筆記一致**。3.2 Equivalence Hypothesis（p. 35）。品質 r (1, 24) = 0.4, p<0.01；數量 r (1, 24) = 0.6, p<0.01；正規化（高品質筆記數／筆記數）r (1, 24) = 0.5, p<0.01。
6. **摘要總結句**（p. 33）：「Overall, we found that taking high quality notes helped OM, but taking large volumes of notes didn't.」

## 對 order 1 的意義（「多記不等於記得」）

- **支持，但力道有限**：25 人、相關研究、工作坊短文。可以說「這個小型實驗裡，筆記寫得多與事後記得多少（不論看不看筆記）都沒有相關；寫得好（抓到關鍵字與脈絡）才與記得較多相關」。
- 不能說「多記會讓人記得更少」：數量與 OM 是零相關（r=0.07），不是負相關。也不能說「品質造成記憶較好」：是相關，作者也用「suggests」「may」。
- 「沒信心的人記更多」（r=−0.5）可支持「收很多常是出於不安，而不是因為有用」的論點，但這是第一次 session 的自評信心，且只有相關。
- 「質」在這裡的操作定義是「與研究者訂的理想筆記重合的程度」（關鍵字＋脈絡），不是筆記者自己加工、改寫的程度——引用時不要說成「自己的話寫的筆記」。

## 作者列的限制

- 正式的限制段沒有。文中提到：
  - CC 與 PP 的高度重疊可能只是短期使用的結果：「However it may be that if people used CC more regularly and over longer periods of time, this strong overlap between CC and PP notes may decrease. Another independent analysis of long term note taking with CC, suggests people shift to more minimal ways of note taking relying on speech for retrieval.」
  - 信心只分析第一次 session，因為一週、一個月後受試者可能已不記得自己記了多少：「A week or a month later, people may be unable to remember details of notes that they generated during the first session. We therefore conducted analysis of user confidence during the first session alone.」

## 與摘要或常見轉述不一致處

1. **統計報告格式與顯著性有疑點**：寫成「r (1, 24)」（相關係數通常只報一個自由度，n=25 時 df=23）。以 n=25、r=0.4 雙尾檢定，p 約 0.047，達不到文中宣稱的 p<0.01；r=0.5 的 p 約 0.011，也是邊緣。文中的 p 值可能是單尾、或分析單位不是人（例如以題目為單位）——論文沒有交代。**品質→OM 的 r=0.4 被稱為顯著到 p<0.01，引用時應保守寫「中度正相關」並註明 n=25。**
2. **用詞「strong correlation」配 r=0.4**（3.2 品質一致性）：r=0.4 一般算中度。
3. **摘要說高品質筆記「helped OM」**（因果語氣），正文是相關分析，正文用「suggests」「may function」。
4. **「Abstract」標題下是空的**，摘要內容實際放在「1. Introduction and Main Questions」第一段（與 Exa／CiteSeerX 索引的 abstract 相同文字）。
5. **常見轉述「Kalnikaitė & Whittaker 2007 顯示手寫筆記一個月後效用迅速下降」**（例如 Bergman & Whittaker 2016 第 2 章 p.41）出自同作者的 CHI 2007〈Software or Wetware?〉與 BHCI 2008，不是這篇。這篇只把「notes become hard to interpret especially at longer retention intervals」當作可能解釋並引用 [3]（CHI 2007）。
6. 論文集目錄與正文標題不同（見書目）。
7. 文獻 [8] 寫「Whittaker S., Hirschberg J. Look or Listen … In Proc. CHI98. Springer-VErlag (2003)」，會議與年份自相矛盾（照抄原文）。

## 讀取紀錄

- 檔案：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/kalnikaite.txt`，474 行，19,273 bytes（論文集 PDF 第 33–36 頁）。
- 依序讀過：第 1–475 行一次讀完（p.33 標題、摘要／引言、研究問題；p.34 方法、受試者、程序、故事；p.35 評分、假設、3.2–3.5 結果；p.36 結論、致謝、參考文獻 [1]–[8]）。無跳讀。
- 另存論文集全文 `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/dl/memos.txt`（`-layout` 版，3,423 行），用來核對本篇在論文集中的起訖（layout 版第 1892–2165 行）。

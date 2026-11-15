# 抽取紀錄：Kirschner、Sweller & Clark 2006，Educational Psychologist 41(2), 75–86

- **合法公開來源**：https://www.tandfonline.com/doi/abs/10.1207/s15326985ep4102_1 （Taylor & Francis 出版者頁，刊出版，頁面標示 Free access；Unpaywall 標 bronze，2026-10-14 核對）。出版者 PDF 另存 `.research/raw/learning-content/q3-activity/kirschner2006-tandf-free-access.pdf`。手上的 `kirschner2006.pdf` 當初取自 `itgs.ict.usc.edu`（南加大的一個機構網站，頁面主人沒確認；重新下載位元組相同），是 Lawrence Erlbaum 當年的排版。兩版比對：出版者現行 PDF 多一頁封面，參考文獻的抽字順序不同；五詞片段有 95.8% 重合，本紀錄引的 55 段英文原句全部找得到（其中 2 段跨行，另用 `grep` 確認在 T&F 版 L668、L760）。這是立場文，沒有表格可對。

**書目**：Paul A. Kirschner（Educational Technology Expertise Center, Open University of the Netherlands）、John Sweller（School of Education, University of New South Wales）、Richard E. Clark（Rossier School of Education, University of Southern California）。〈Why Minimal Guidance During Instruction Does Not Work: An Analysis of the Failure of Constructivist, Discovery, Problem-Based, Experiential, and Inquiry-Based Teaching〉。Educational Psychologist，2006，41 卷 2 期，75–86 頁。doi 10.1207/s15326985ep4102_1。作者姓名與單位對過 PDF 首頁。

**原文檔**：

- `.research/raw/learning-content/q3-activity/kirschner2006.pdf`（12 頁）
- `.research/raw/learning-content/q3-activity/kirschner2006.txt`（清單列的檔，734 行、86,613 字元）。這是 `pdftotext -layout` 轉的雙欄版面，左右欄交錯，**沒有拿來讀**。
- `.research/raw/learning-content/q3-activity/kirschner2006.seq.txt`（本批次新增：同一份 PDF 用不帶 `-layout` 的 `pdftotext` 重轉，993 行、70,129 字元，左右欄依序）。**以下行號一律指這個檔。**

**讀取日期**：2026-10-14
**版本**：刊出版（頁首有期刊卷期頁碼與 Lawrence Erlbaum 版權行）
**供哪幾篇 order 使用**：order 11（結論 11-b、11-c 的立場文）

---

## 研究設計

- **類型**：立場文（論證＋選擇性文獻回顧）。**沒有自己的資料，沒有檢索策略、沒有納入排除標準、沒有效果量、沒有表、沒有圖。** 作者自己說「an extensive review of those studies is outside the scope of this article」（L330–331）。
- **受試者、教材、測量**：無。全文引用的實證都是別人的研究，而且幾乎都只給結論不給數字。
- **比較對象（概念層面）**：
  - 「極少引導」的定義：「one in which learners, rather than being presented with essential information, must discover or construct essential information for themselves」（L34–36）。
  - 「直接教學引導」的定義：「providing information that fully explains the concepts and procedures that students are required to learn as well as learning strategy support that is compatible with human cognitive architecture」（L44–47）。
  - 「學習」的定義：「a change in long-term memory」（L47–48）。
- **被歸成同一類的做法**：discovery learning、problem-based learning（PBL）、inquiry learning、experiential learning、constructivist learning，作者稱之為「differently named but essentially pedagogically equivalent approaches」（L55–56）。
- **文章結構**：(1) 導言與定義；(2) 人類認知架構對極少引導的後果（長期記憶、工作記憶）；(3) 建構主義的來源與「學科的做法≠學這門學科的方法」；(4) 比較有引導與無引導教學的研究（認知負荷、例題、流程工作單）；(5) 各情境的研究（職場體驗學習、個別差異／ATI、教了反而變差、科學教育、醫學 PBL）；(6) 結論。

---

## 結果（逐項）

這篇沒有自己的結果。下面逐項列的是**它的主張與每個主張靠的來源**。引用時每一條都要寫成「Kirschner 等主張」或回頭引原始研究，不能寫成這篇的發現。

### A. 理論論證（認知架構）

| # | 主張 | 靠什麼 | 行號 | 原文一句 |
|---|---|---|---|---|
| A1 | 文章目的：依認知架構，極少引導的教學很可能無效 | 作者立論 | L87–93 | 「The past half-century of empirical research on this issue has provided overwhelming and unambiguous evidence that minimal guidance during instruction is significantly less effective and efficient than guidance specifically designed to support the cognitive processing necessary for learning.」 |
| A2 | 專家的本事來自長期記憶裡的大量經驗 | De Groot 1945/1965、Chase & Simon 1973 的西洋棋研究及後續複製 | L118–131 | 「expert problem solvers derive their skill by drawing on the extensive experience stored in their long-term memory」 |
| A3 | 教學的目標是改變長期記憶 | 作者立論 | L143–148 | 「The aim of all instruction is to alter long-term memory. If nothing has changed in long-term memory, nothing has been learned.」 |
| A4 | 處理新資訊時工作記憶極有限：未複誦約 30 秒內流失；容量約七、也可能是四加減一；需要加工時可能只有兩三個 | Peterson & Peterson 1959、Miller 1956、Cowan 2001；「兩三個」是作者自稱的推測（「it may be reasonable to conjecture」） | L172–181 | 「the number of items that can be processed may only be two or three」 |
| A5 | 這些限制只對還沒學會的新資訊成立；長期記憶裡已有的資訊不受限 | Sweller 2003、2004；Ericsson & Kintsch 1995 | L182–194、L152–154 | 「when dealing with previously learned information stored in long-term memory, these limitations disappear」 |
| A6 | 解題搜尋佔用工作記憶，這份負荷對累積長期記憶沒有貢獻；可以搜尋很久而幾乎沒學到 | Sweller 1988；Sweller、Mawer & Howe 1982 | L199–207、L430–438 | 「while working memory is being used to search for problem solutions, it is not available and cannot be used to learn」 |
| A7 | 舉證責任在支持探究式教學的一方 | 作者立論 | L165–169 | 「The onus should surely be on those who support inquiry-based instruction to explain how such a procedure circumvents the well-known limits of working memory」 |
| A8 | 作者承認理論推論本身不夠 | — | L231–235 | 「suggestions based on theory that minimally guided instruction should have minimal effectiveness are worth little without empirical evidence」 |

### B. 對建構主義的回應

| # | 主張 | 靠什麼 | 行號 | 原文一句 |
|---|---|---|---|---|
| B1 | 「知識由學習者建構」這個描述正確，但推不出「所以要少給資訊」 | 作者立論；引 Clark & Estes 1998、1999 等 | L245–259 | 「The constructivist description of learning is accurate, but the instructional consequences suggested by constructivists do not necessarily follow.」 |
| B2 | 沒有證據顯示給部分資訊比給完整資訊更能促進建構，多半相反 | 無引用，作者斷言 | L248–253 | 「there is no evidence that presenting them with partial information enhances their ability to construct a representation more than giving them full information. Actually, quite the reverse seems most often to be true.」 |
| B3 | 專家怎麼工作（學科的認識論）不等於新手怎麼學（教學法） | Kirschner 1991、1992；Shulman 1986；Dehoney 1995；Hurd 1969；Hodson 1988；Kyle 1980；Novak 1988 | L275–318 | 「the way an expert works in his or her domain (epistemology) is not equivalent to the way one learns in that area (pedagogy)」 |
| B4 | 作者對實作本身不反對 | — | L270–275 | 「The addition of a more vigorous emphasis on the practical application of inquiry and problem-solving skills seems very positive. Yet it may be a fundamental error to assume that the pedagogic content of the learning experience is identical to the methods and processes … of the discipline」 |

### C. 引用的實證（全部是二手轉述，幾乎沒有數字）

| # | 主張 | 靠什麼 | 行號 | 原文一句 |
|---|---|---|---|---|
| C1 | 對照實驗幾乎一致顯示：面對新資訊，要明白示範做什麼與怎麼做 | 無逐項引用的總括句 | L324–327 | 「Controlled experiments almost uniformly indicate that when dealing with novel information, learners should be explicitly shown what to do and how to do it.」 |
| C2 | 1950 到 1980 年代末，純發現式學習每次比較都輸給有引導的做法 | Mayer 2004 的回顧 | L331–346 | 「the "debate about discovery has been replayed many times in education but each time, the evidence has favored a guided approach to learning" (p. 18)」 |
| C3 | 實際執行建構式教學的老師最後都加了大量引導；成效最好的老師花很多時間直接教並鷹架 | Aulls 2002 的質性個案研究。作者自己說這是「a reasonable interpretation」 | L348–362 | 「most teachers who attempt to implement classroom-based constructivist instruction end up providing students with considerable guidance」 |
| C4 | 純發現、極少回饋的科學課，學生常迷路、挫折、形成迷思概念；無引導發現多半沒效率 | Hardiman 等 1986、Brown & Campione 1994、Carlson 等 1992、Schauble 1990 | L366–372 | 「when students learn science in classrooms with pure-discovery methods and minimal feedback, they often become lost and frustrated」 |
| C5 | 直接教學（含大量引導與例子）比發現學到的多得多；靠發現學會的少數學生也沒有學得比較好（遷移） | Klahr & Nigam 2004。**沒有給任何數字、年級或樣本數** | L375–384 | 「The findings were unambiguous. Direct instruction involving considerable guidance, including examples, resulted in vastly more learning than discovery.」 |
| C6 | 探索式練習比例題練習造成更大認知負荷、學得較差；**知識較多的學習者沒有負面效果，兩種做法受益相同** | Tuovinen & Sweller 1999 | L396–400 | 「The more knowledgeable learners did not experience a negative effect and benefited equally from both types of treatments.」 |
| C7 | Mayer 的多媒體系列實驗裡，有引導的教學在立即回憶、長期遷移與解題上都較好 | Mayer 2001 | L400–405 | 「In all of the many studies he reported, guided instruction not only produced more immediate recall of facts than unguided approaches, but also longer term transfer and problem-solving skills.」 |
| C8 | 例題效果：被要求解題的人在後續測驗題上比讀對等例題的人差；作者稱這是「最強的證據之一」 | Sweller & Cooper 1985、Cooper & Sweller 1987（代數）；複製引 Carroll 1994、Miller 等 1999、Paas 1992、Paas & van Merriënboer 1994、Pillay 1994、Quilici & Mayer 1996、Trafton & Reiser 1993 | L406–424 | 「For novices, studying worked examples seems invariably superior to discovering or constructing a solution to a problem.」 |
| C9 | **例題效果的兩個失效條件**：(1) 例題本身設計得認知負荷很重時得不到；(2) 隨學習者專精程度提高，效果先消失、再反轉（expertise reversal） | Tarmizi & Sweller 1988、Ward & Sweller 1990；Kalyuga 等 2001、2003 | L438–453 | 「the worked-example effect first disappears and then reverses as the learners' expertise increases. Problem solving only becomes relatively effective when learners are sufficiently experienced so that studying a worked example is, for them, a redundant activity」 |
| C10 | 引導只能隨專精程度提高而放鬆 | 作者由 C9 推論 | L451–453 | 「That guidance can be relaxed only with increased expertise as knowledge in long-term memory can take over from external guidance.」 |
| C11 | 流程工作單（列出解題各階段與提示、經驗法則）：法律系學生有工作單時，案件論述較連貫、內容較準確 | Nadolski、Kirschner & van Merriënboer（當時 in press）。作者之一自己的研究，沒有數字 | L455–467 | 「Learners receiving guidance through process worksheets outperformed learners left to discover the appropriate procedures themselves.」 |
| C12 | Kolb 體驗學習與學習風格的效度不足 | Iliff 1994 的統合分析（經 Kolb 等 1999 轉引）：101 個量化研究，相關低（< .5）、效果量弱（.2）到中（.5）；Ruble & Stout 1993 | L488–503 | 「correlations classified as low (< .5) and effect sizes that were weak (.2) to medium (.5)」 |
| C13 | 教學設計與教學科技研究的證據不支持極少引導 | Roblyer 1996、Perkins 1991 | L504–508 | 「both suggested that some form of stronger guidance is necessary for both effective learning and transfer」 |
| C14 | ATI 研究常見的發現：強處理（高結構）有利能力較低者，弱處理有利能力較高者 | Cronbach & Snow 1977；Kyllonen & Lajoie 2003 | L519–524 | 「"strong treatments benefited less able learners and weaker treatments benefited more able learners" (p. 82)」 |
| C15 | 低能力學生選了或被分到無引導的弱處理，後測分數顯著低於前測（教了反而變差） | Clark 1989 回顧約 70 個 ATI 研究，範圍從小學到大學與職場 | L541–550 | 「lower aptitude students who choose or were assigned to unguided, weaker instructional treatments receive significantly lower scores on posttests than on pretest measures」 |
| C16 | 喜歡與學到的不一致：能力較低者選引導少的版本，喜歡但學得少；**能力較高者選高結構版本，喜歡但成績比低結構版本低** | Clark 1982 | L553–560 | 「less able learners who choose less guided approaches tend to like the experience even though they learn less from it. Higher aptitude students who chose highly structured approaches tended to like them but achieve at a lower level than with less structured versions」 |
| C17 | 同一個學習者依學習與遷移目標不同，可能從強處理或弱處理受益 | Woltz 2003 | L569–573 | 「the same learner might benefit from stronger and weaker treatments depending on the type of learning and transfer outcome desired」 |
| C18 | 美國國家科學院系列報告記錄了無引導做法缺乏證據（大學 STEM、高中、中小學數學） | McCray 等 2003、Gollub 等 2003、Kilpatrick 等 2001。只給書目，沒有具體發現 | L576–587 | 「amply document the lack of evidence for unguided approaches and the benefits of more strongly guided instruction」 |
| C19 | 老師的經驗：發現式學習只有在學生有先備知識並先經過有結構的經驗時才成功 | Roblyer、Edwards & Havriluk 1997（教師報告，不是實驗） | L588–591 | 「discovery learning is successful only when students have prerequisite knowledge and undergo some prior structured experiences」 |
| C20 | 醫學 PBL：基礎科學考試分數較低、住院醫師選科無差異、每天讀書時數較多；臨床表現分數較高但開較多不必要的檢查；臨床分數高可能只是待在臨床的時間較長 | Albanese & Mitchell 1993 的統合分析。沒有數字 | L617–628 | 「lower basic science exam scores, no differences in residency selections, and more study hours each day」 |
| C21 | PBL 與傳統課程學生的解題能力無差異；標準化測驗與教師自編測驗無統計差異；PBL 較貴 | Berkson 1993、Colliver 2000 | L629–643 | 「PBL studies show no statistical effect on the performance of medical students on standardized tests or on instructor-designed tests during the first 2 years of medical school」 |
| C22 | PBL 學生的解釋較詳細，但較不連貫、錯誤較多；基礎科學知識與特定病例綁在一起分不開 | Patel、Groen & Norman 1993 | L669–682 | 「Although PBL students generated more elaborate explanations, they had less coherent explanations and more errors.」 |
| C23 | PBL 出身的住院醫師保留倒推式推理，沒有發展出專家特徵的順推式推理 | Patel、Arocha & Leccisi 1995（文中寫 Patel et al. 1995） | L683–693 | 「participants trained in PBL retained the backward-directed reasoning pattern, but did not seem to acquire forward-directed reasoning, which is a hallmark of expertise」 |
| C24 | PBL 支持者自己也說可能需要適時的直接教學 | Hmelo-Silver 2004，pp. 260–261 | L646–656 | 「there may be a place for direct instruction on a just-in-time basis. … a lecture at the right time may be beneficial」 |

### D. 結論節的句子（L718–751）

| # | 說法 | 行號 | 原文一句 |
|---|---|---|---|
| D1 | 沒有支持極少引導的研究 | L719–721 | 「After a half-century of advocacy associated with instruction using minimal guidance, it appears that there is no body of research supporting the technique.」 |
| D2 | 適用對象寫的是「新手到中等程度」 | L721–729 | 「it almost uniformly supports direct, strong instructional guidance rather than constructivist-based minimal guidance during the instruction of novice to intermediate learners」 |
| D3 | 先備知識多的人：強引導多半一樣有效 | L729–731 | 「Even for students with considerable prior knowledge, strong guidance while learning is most often found to be equally effective as unguided approaches.」 |
| D4 | 無引導可能有負面結果 | L731–734 | 「there is also evidence that it may have negative results when students acquire misconceptions or incomplete or disorganized knowledge」 |
| D5 | 把原因追溯到 Sputnik 之後的科學課程改革（BSCS、CHEM Study、PSSC） | L735–741 | 作者自己用「might be found in」 |
| D6 | 對建構主義的定性 | L743–745 | 「current constructivist views have become ideological and often epistemologically opposed to the presentation and explanation of knowledge」 |

---

## 作者自己列的限制

**這篇沒有限制節，也沒有任何一段在談自己論證的弱點。** 全文裡可以算作作者自己設下的邊界只有這幾句：

1. 不做完整文獻回顧：「an extensive review of those studies is outside the scope of this article」（L330–331）。
2. 理論推論要靠實證才算數（L231–235，見 A8）。
3. 例題效果有兩個失效條件，其中專精程度提高會讓它反轉（L438–453，見 C9）。
4. 結論的適用對象限定在「novice to intermediate learners」（L728–729）。
5. 工作記憶「兩三個項目」是推測（L179–181）。

**讀全文看得出來、但作者沒有承認的弱點**（我的整理，不是原文說法）：

- 沒有說明引用的研究是怎麼選的；支持極少引導或結果混合的研究一篇都沒有被正面討論。
- 把五種做法當成「教學上等同」（L55–56），沒有論證。它自己描述的 PBL 有臨床教師帶小組、提示替代方案與資料來源（L611–615），而且說 PBL 的兩大成分之一是「the explicit teaching of problem-solving strategies」（L657–659）——這與它對「極少引導」的定義（學習者得自己發現必要資訊）並不一致。
- 關鍵實證（Klahr & Nigam 2004、Mayer 2001、國家科學院報告）都只給形容詞（「unambiguous」「vastly more」「amply document」），沒有樣本、年級、效果量。
- 有幾條證據不是實驗：Aulls 2002 是質性個案、Roblyer 等 1997 是教師經驗、Nadolski 等是作者自己尚未刊出的研究。
- 有一處引文頁碼留著排版佔位符沒補：「(p. XXX)」（L667）。
- 三位作者都是所主張立場的主要研究者（Sweller 是認知負荷理論提出者，文中引自己的著作十多筆）。文中沒有利益或立場聲明。

---

## 與摘要說法不一致的地方

逐項對過，有三處：

1. **高先備知識者的說法，摘要、正文、結論三處強度不同。**
   - 摘要：「The advantage of guidance begins to recede only when learners have sufficiently high prior knowledge」（引導的優勢「開始減退」）。
   - 正文 C9：例題效果「first disappears and then reverses」（消失後**反轉**，解題變得相對有效）；C16 轉述 Clark 1982：高能力學生在高結構版本「achieve at a lower level than with less structured versions」。
   - 結論 D3：「strong guidance while learning is most often found to be equally effective as unguided approaches」（**一樣有效**）。
   - 正文自己引的證據（反轉、成績較低）比摘要的「減退」和結論的「一樣有效」都強。引這篇講高手時要引正文那幾句，不能只引結論句。
2. **摘要說證據「consistently indicate」，正文的措辭是「almost uniformly」**（L325、L721），而且正文明說沒有做完整回顧。
3. **摘要末句說會簡述支持引導的「instructional design models」**，正文實際描述的只有兩種技術（例題、流程工作單），沒有描述任何教學設計模型（van Merriënboer 1997 只被引一次當工作單的出處）。

另外正文內部有一處沒有回應的張力：L75–79 引 Wickens 的話「large amounts of guidance may produce very good performance during practice, but too much guidance may impair later performance」當作建構主義論點的例子，之後全文沒有回頭處理「練習時表現好不等於之後表現好」這個區分。

---

## 與清單「要撐的結論」不合的地方

清單寫這篇是 **11-b、11-c 的立場文（反方立場，不是資料）**。這個定位正確：它沒有資料，只能當「這一派這樣主張」來引。逐條對：

- **11-b「對年紀小的學習者、通用技能、各部分互相牽連的內容，先講解較好」**：這篇**撐不住這句的三個條件，也不談順序**。
  - 全文沒有討論「先解題再講解」對「先講解再解題」的順序問題。productive failure 一詞沒有出現，Kapur 沒有被引（這篇 2006 年出版，早於那批研究）。
  - 沒有「年紀小」這個條件。它談的是**新手對專家**（先備知識多寡），並說負面證據「at all age levels」（L579）。
  - 沒有「通用技能」的討論。
  - 沒有「element interactivity／各部分互相牽連」這個詞或概念；只有一般性的「新資訊加重工作記憶負荷」。
  - 這篇能撐的是比較窄的一句：「這一派主張，新手面對新內容時應該直接被告知做什麼、怎麼做；專精程度提高後引導才能放鬆，甚至該反過來讓他自己解題。」11-b 的三個條件要靠別的來源（Sinha & Kapur 2021 的子群、Ashman 等 2020）。
- **11-c「沒有協助的探索比明示教學差」**：當立場可以引（A1、C1、D1），但它提供的是斷言加書目。要寫數字得回頭引 Klahr & Nigam 2004、Tuovinen & Sweller 1999、Mayer 2004，或用 Alfieri 等 2011 的統合分析。
- **11-c「有回饋、例題、鷹架的探索較好」**：這篇**不是這個意思**。它把例題與流程工作單當成「直接引導」的例子，用來對比探索，不是當成「加在探索上的協助」。它提到鷹架，是用來說明老師實作時不得不把引導加回去（C3），並沒有主張「有鷹架的探索」是好做法。把這篇引成支持「有引導的探索」會引反。
- **11-c「引導的種類有沒有差」**：這篇沒有比較引導種類。它預設的是「引導越強越好」；Lazonder & Harmsen 2016 的討論正是在反駁這個預設（見該篇紀錄 D4）。兩篇不能並列成同一立場。
- 這篇有、清單沒提、可能用得上的兩點：
  - 喜歡與學到不一致的早期說法（C16，Clark 1982），與 order 8 的 8-e 是同一類現象，但只是轉述、沒有數字。
  - 「教了反而變差」（C15，Clark 1989）。同樣是轉述。

---

## 讀取紀錄

讀的是 `kirschner2006.seq.txt`（993 行），依序：

| 段 | 行號 | 內容 |
|---|---|---|
| 1 | L1–60 | 題名、作者、摘要、導言前半（定義） |
| 2 | L60–420 | 導言後半、認知架構三小節、建構主義的來源、比較研究（認知負荷、例題前半） |
| 3 | L420–700 | 例題後半、流程工作單、職場體驗學習、個別差異、教了反而變差、科學教育、醫學 PBL |
| 4 | L700–752 | PBL 節末的 Patel 等引文、結論 |
| 5 | L753–993 | 參考文獻，只掃過（每四行看一行） |

另外先讀過清單原列的 `kirschner2006.txt` 第 1–200 行，發現左右欄交錯後改讀循序版；那 200 行的內容與循序版 L1–255 相同。

**對過 PDF 版面的表**：全文沒有表、沒有圖、沒有附錄。作者姓名與單位以 `kirschner2006.txt`（版面版）首頁核過。

# 抽取紀錄：Collins、Brown、Holum 1991，American Educator（Winter 1991）

## 檔頭

- **書目**：Allan Collins、John Seely Brown、Ann Holum。〈Cognitive Apprenticeship: Making Thinking Visible〉。*American Educator*（美國教師聯盟 AFT 的刊物），Winter 1991。沒有 DOI。網址 https://www.aft.org/ae/winter1991/collins_brown_holum 。
  - 作者署名與副標題不在原文檔裡（檔案從正文第一段開始）。2026-10-14 用 curl 抓了 AFT 原頁對過：頁首是「Cognitive Apprenticeship／Making Thinking Visible／By Allan Collins, John Seely Brown, Ann Holum」，頁尾是「American Educator, Winter 1991」。
  - 卷期頁碼（常見引法是 15(3), 6–11, 38–46）AFT 頁面上沒有，**我沒有核對到**，要引的話另查。
  - 作者小傳（L534）：Collins 當時是 Bolt Beranek and Newman 首席科學家、西北大學教授；Brown 是 Xerox PARC 主任；Holum 是西北大學研究生、當過教師。
- **原文檔**：`.research/raw/learning-content/q3-activity/collins1991.md`，538 行、80,217 位元組（Jina 從 AFT 頁面轉出的 Markdown）。
- **讀取日期**：2026-10-14
- **版本**：出版者網站的重刊網頁版（檔頭 Published Time 2023-07-12 是網頁時間，不是文章年份）。文末說明這是 1989 年書章的另一個版本：「A different version of this essay was published as a chapter in *Knowing, Learning, and Instruction: Essays in Honor of Robert Glaser*, edited by Lauren Resnick (Erlbaum 1989).」（L534）
- **檔案狀況**：正文完整（導言、兩大節、框架、結論、致謝、參考文獻、作者小傳、一個註腳都在）。有轉檔痕跡：字間空格掉了很多處；數學側欄的上下標壓平、有錯字（L328、L334 的「1/4」應是 1/r；L334 的「– (1/r n)P(r)」應是等號）；寫作側欄說的「Underlined phrases」底線沒有保留（L242）；原刊若有插圖，檔裡沒有。這些不影響論點，但**數學那段不能照檔案抄**。
- **供哪幾篇 order 使用**：order 11（結論 11-f）。

## 研究設計

- **類型**：理論與框架文，寫給教師看的雜誌文章。**沒有自己的資料**，沒有方法節。文中所有效果數字都是轉述別人的研究，而且沒有交代那些研究的對照組、人數。
- **結構**：(1) 傳統學徒制的四個面向與搬到認知技能要改的三件事；(2) 三個教學案例（閱讀：Palincsar 與 Brown 的 reciprocal teaching；寫作：Scardamalia 與 Bereiter 的程序提示；數學：Schoenfeld 的解題教學）；(3) 設計學習環境的四維框架（content、method、sequencing、sociology，共 4＋6＋3＋4＝17 項）；(4) 結論。
- **三個案例的學習者與形式**（都是有老師在場的課堂或小組）：
  - 閱讀：原本為「能解碼但理解有嚴重困難」的國中生設計；二到七人小組，也用過一對一（L64）。
  - 寫作：小學生（L244）；老師示範、學生輪流「soloing」、老師與同學評（L228）。
  - 數學：大學生（L252）；全班示範、全班共同解題、小組解題、事後檢討（L260、L344–354）。
- **三個案例和「認知學徒制」的關係**：三套方法都是別人獨立發展的，作者事後用這個框架去讀它們。用詞是「exemplifies many of the features of cognitive apprenticeship」（L64）、「relies on elements of cognitive apprenticeship」（L152）、「incorporates the basic elements of a cognitive apprenticeship」（L252）；解釋 reciprocal teaching 為何有效時寫「In our analysis, which reflects in part the views of Palincsar and Brown」（L140）。

## 結果（逐項）

這篇沒有自己的結果。下面分兩塊：A 是文中轉述的別人研究的數字（要引必須回原研究）；B 是框架的定義與主張，11-f 要用的是這一塊。

### A. 轉述的效果數字（二手，沒有對照條件）

| # | 內容 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| A1 | reciprocal teaching 先導研究，一對一，閱讀能力差的學生 | 理解測驗正確率 15% → 85%，約 20 次訓練後；六個月後 60%，再上一次回到 85% | **前後測；文中沒有提對照組** | L138 | 「In a pilot study with individual students who were poor readers, the method raised their reading comprehension test scores from 15 percent to 85 percent accuracy after about twenty training sessions. Six months later the students were still at 60 percent accuracy, recovering to 85 percent only after one session.」 |
| A2 | 同上，兩人一組 | 約 30% → 80%，八週後變化很小 | 前後測；沒有提對照組 | L138 | 「In a subsequent study with groups of two students, the scores increased from about 30 percent to 80 percent accuracy, with very little change eight weeks later.」 |
| A3 | 同上，課堂，四到七人一組 | 約 40% → 80%，八週後略降 | 前後測；沒有提對照組 | L138 | 「In classroom studies of groups of four to seven students, test scores increased form about 40 percent to 80 percent correct, again with only a slight decline eight weeks later.」 |
| A4 | 寫作：修改用的程序提示，小學生 | 想法層次的修改次數「tenfold increase」，文體修改沒有減少；每種提示單獨都有效 | 沒有寫和什麼比 | L244 | 「when all the facilitations were combined, they resulted in superior revisions for nearly every student and a tenfold increase in the frequency of idea-level revisions, without any decrease in stylistic revisions.」 |
| A5 | 寫作：規劃用的提示卡（Scardamalia 等 1984） | 放聲思考裡的反思活動顯著較多，**提示拿掉後仍然如此**；規劃時間增為十倍；不限規劃時間時，實驗組文章的思想內容被評為顯著較好 | 實驗組前後測比較；文中出現「experimental-group students」，沒有描述控制組 | L244 | 「Pre- and post-comparisons of think-aloud protocols showed significantly more reflective activity on the part of experimental-group students, even when prompts were no longer available to them. Time spent in planning increased tenfold.」 |
| A6 | 數學：教捷思法（Schoenfeld） | 沒有數字 | 沒有寫 | L254 | 「In his experiments, Schoenfeld found that learning these strategies significantly increased students' problem-solving abilities.」 |

作者對 A1–A3 的評語是「Reciprocal teaching is extremely effective.」「These are very dramatic effects for any instructional intervention.」（L138）。這是轉述加評語，不是這篇的證據。

### B. 框架的定義與主張

**B1 傳統學徒制的四個面向**（L26–34）

- 「There are four important aspects of traditional apprenticeship: modeling, scaffolding, fading, and coaching.」（L26）
- Modeling：徒弟看師傅示範各部分；引 Lave 與 Wenger 說很多學習發生在看別人工作時（L28）。
- Scaffolding：「the support the master gives apprentices in carrying out a task. This can range from doing almost the entire task for them to giving occasional hints as to what to do next.」Fading：「slowly removing the support, giving the apprentice more and more responsibility.」（L30）
- Coaching：「the thread running through the entire apprenticeship experience」，內容包括選任務、給提示與鷹架、評估與診斷、挑戰與鼓勵、回饋（L32）。
- 觀察的作用是假說：「Lave (1988) hypothesizes that it aids learners in developing a conceptual model of the target task prior to attempting to execute it.」（L34）作者接著列概念模型的三個用處：給初次嘗試當 advance organizer、給回饋一個解讀架構、獨立練習時當內在指引（L34）。
- 社會脈絡：徒弟身邊有好幾位師傅、也看得到程度不同的其他學習者（L36）。

**B2 搬到認知技能要改的三件事**（L40–52）

1. 思考過程看不見，要刻意攤開：「The teacher's thinking must be made visible to the students and the student's thinking must be made visible to the teacher. That is the most important difference」（L42）。**是雙向的**。
2. 學校的任務脫離情境，要把抽象任務放進學生看得懂意義的情境（L44）。
3. 要遷移，所以要變化情境並說出共通點（L46）。

**B3 作者對「讀書、聽講」的說法**（L54–56）——與 11-f 最直接相關的一段

- 「We do not want to argue that cognitive apprenticeship is the only way to learn. Reading a book or listening to a lecture are important ways to learn, particularly in domains where conceptual and factual knowledge are central. Active listeners or readers, who test their understanding and pursue the issues that are raised in their minds, learn things that apprenticeship can never teach.」
- 「To the degree that readers or listeners are passive, however, they will not learn as much as they would by apprenticeship, because apprenticeship forces them to use their knowledge. Moreover, few people learn to be active readers and listeners on their own, and that is where cognitive apprenticeship is critical」
- 「to achieve expert practice, some version of apprenticeship remains the method of choice.」（L56）
- 這些都是主張，沒有附資料。

**B4 六種方法的定義**（L376–388；側欄的一行版在 L402–414）

分組：「the first three (modeling, coaching, and scaffolding) are the core of cognitive apprenticeship … The next two (articulation and reflection) … The final method (exploration) is aimed at encouraging learner autonomy」（L376）。

| 方法 | 定義（原文） | 定義裡需要什麼 | 行號 |
|---|---|---|---|
| Modeling | 「an expert's performing a task so that the students can observe and build a conceptual model of the processes … this requires the externalization of usually internal processes and activities—specifically, the heuristics and control processes」 | 專家把內在過程說出來。例子是老師朗讀時用另一個聲音講自己的想法（Collins 與 Smith 1982）、Schoenfeld 當場解學生帶來的難題 | L378 |
| Coaching | 「observing students while they carry out a task and offering hints, scaffolding, feedback, modeling, reminders, and new tasks … The content of the coaching interaction is immediately related to specific events or problems that arise as the student attempts to accomplish the target task.」 | **要看著學生做，內容跟著當下發生的事** | L380 |
| Scaffolding（含 fading） | 「the supports the teacher provides … can take either the forms of suggestions or help, as in reciprocal teaching, or they can take the form of physical supports, as with the cue cards … or the short skis used to teach downhill skiing」「A requisite to such scaffolding is accurate diagnosis of the student's current skill level or difficulty and the availability of an intermediate step at the appropriate level of difficulty」「Fading involves the gradual removal of supports until students are on their own.」 | 兩種形式：人給的建議，或實體支撐物（提示卡、短雪板）。**由老師給的那種要先診斷學生程度** | L382 |
| Articulation | 「any method of getting students to articulate their knowledge, reasoning, or problem-solving processes」。三種做法：inquiry teaching 的提問、邊解題邊說、在合作活動裡當評論者 | 學生說出來；三種做法裡兩種要有對象 | L384 |
| Reflection | 「enabling students to compare their own problem-solving processes with those of an expert, another student, and ultimately, an internal cognitive model of expertise」，工具是重播與「abstracted replay」 | 要有學生自己的表現紀錄和專家的可比 | L386 |
| Exploration | 「pushing students into a mode of problem solving on their own … the natural culmination of the fading of supports. It involves not only fading in problem solving but fading in problem setting as well.」「students do not know a priori how to explore a domain productively. So exploration strategies need to be taught」 | 給大方向，讓學生自己定子目標 | L388 |

側欄每一項的主詞都是「teacher」（L404–414）。

**B5 文中和「寫下來的東西能不能做到」有關的段落**（原文沒有討論文字教材，以下是文中碰得到的地方，照實列）

- 文章本身收了兩段**寫成文字的示範**：老師規劃作文的放聲思考（L238–242）、Schoenfeld 的「A Mathematician Thinks Out Loud」（L262–342，出處是 Schoenfeld 1983 的書面報告），後者含走不通的嘗試（L300「I don't really see anything that I can push … I may have to try something else」）與事後檢討。註腳說這段是要讓讀者看「reasoning processes that are normally covert」（L538）。
- 對比教科書的寫法：「textbook solutions and classroom demonstrations generally illustrate only the successful solution path, not the search space that contains all of the dead-end attempts.」（L346）；「the proof, like a classical mathematical argument, is quite terse and presents the results of a thought process. But where did the inspiration for the proof come from?」（L338）
- 看專家卡關的作用：「Seeing how experts deal with problems that are difficult for them is critical to students' developing a belief in their own capabilities. … Witnessing these struggles helps students realize that thrashing is neither unique to them nor a sign of incompetence.」（L346）；寫作那節說「Live modeling helps to convey that this is not the case. The model demonstrates struggles, false starts, discouragement, and the like.」（L246）——用的是 live。
- 示範要在學生自己試過之後聽才有用：「What is crucial here is that students listen in the context of knowledge that they will soon undertake the same task. After they have tried to do it themselves, and perhaps had difficulties, they listen with new knowledge about the task.」（L144）
- 實體鷹架：提示卡把規劃的步驟外化，「the cue cards are gradually faded out as well」（L228、L248）。
- **老師沒辦法在作業上 coach**：「it gives the teacher a chance to coach students while they are engaged in semi-independent problem solving; he cannot really coach them effectively on homework problems or class problems.」（L350，轉述 Schoenfeld 主張小組解題的第一個理由）
- 鷹架「剛好夠」：「students get as much support as they need to catty out the task, but no more」（L146，catty 是檔案錯字）；老師逐級退讓的例子（先看學生能不能自己出題 → 提示從 Why 問句開始 → 老師自己出一題讓學生改寫）也在 L146。
- 事後檢討（postmortem／abstracted replay）：老師做，學生也輪流做，然後全班比較（L354）。
- 學習策略舉的例子是把課本例題的每一步對回原理，引 Chi 等 1989（L372）。

**B6 內容四類**（L362–372）：domain knowledge、heuristic strategies、control strategies、learning strategies。作者強調策略性知識依賴事實與程序知識：「Schoenfeld's students could not begin to apply the strategies he is teaching if they did not have a solid grounding in mathematical knowledge.」（L364）。

**B7 排序三原則**（L436–442）：global before local skills（先有整體概念模型，裁縫學徒先縫再學裁；「This principle requires some form of scaffolding」）、increasing complexity（兩個機制：排任務順序、用鷹架）、increasing diversity。作者說三者「must be balanced」（L436）。

**B8 社會面四項**（L446–454）：situated learning、community of practice（「It can't be forced, but it can be fostered by common projects and shared experiences」）、intrinsic motivation、exploiting cooperation。

**B9 作者認為三個案例有效的原因**（都是「we think」「we believe」）

- 閱讀四點（L142–148）：建立閱讀的新概念模型；老師在共同的問題情境裡示範；鷹架把任務拆開；學生同時當產出者與評論者。
- 寫作兩點（L246–248）：建立寫作過程的新概念；提示卡把控制策略外化。
- 數學另加（L352–354）：小組把主持、產生選項、批評三個角色分給不同人；事後檢討。
- 三個例子的共通論點：學生對「這門功課是在做什麼」的看法被改掉（L142、L246、L258）。

## 作者自己列的限制

沒有限制節。作者自己劃的範圍：

1. 不是唯一的學法；讀書與聽講在概念與事實為主的領域很重要（L54）。
2. 不適用於背誦型內容：「It does not make sense to use it to teach the rules of conjugation in French or to teach the elements of the periodic table. If the targeted goal of learning is a rote task, cognitive apprenticeship is not an appropriate model of instruction.」適用的是「a fairly complex task」（L458）。
3. 沒有配方：「Cognitive apprenticeship is not a model of teaching that gives teachers a packaged formula for instruction.」「We don't believe that there is a formula for implementing the activities of modeling, scaffolding and fading, and coaching.」（L458、L462）
4. 選閱讀、寫作、數學三個領域的理由是它們的概念與事實基礎相對少、靠認知與後設認知技能，「Unlike school subjects such as chemistry or history」（L60）。也就是三個例子**不是**知識量大的學科。
5. 策略要以學科知識為前提（L364）。
6. 探索不會自己發生，要教（L388）。

原文沒有說的：沒有討論任何失敗案例或無效的結果；沒有討論成本與師生比；沒有討論自學、遠距或文字教材；沒有拆開六種方法各自的貢獻（寫作那節轉述「each type of support was effective, independent of the other supports」講的是修改提示的種類，不是六種方法）。

## 與摘要說法不一致的地方

這篇沒有摘要。改對導言的預告（L8–14）與正文，逐項對過，有三處落差：

1. 導言說要呈現「three successful examples—cases in which teachers and researchers have used apprenticeship methods」（L12）。正文裡這三套方法是別人各自發展的，作者的用詞是「exemplifies many of the features」「relies on elements」「In our analysis」（見研究設計）。導言讀起來像這三個是認知學徒制的應用成果，正文是事後歸類。
2. 方法的個數前後不同：傳統學徒制「four important aspects … modeling, scaffolding, fading, and coaching」（L26）；框架是六種方法，fading 併在 scaffolding 底下（L376–388）；結論又回到「modeling, scaffolding and fading, and coaching」（L462）。引用時要講清楚是哪一組。
3. 導言說這個模式「accessible within the framework of the typical American classroom」（L8）；正文的例子是二到七人小組、一對一、以及大學的解題課（L64、L252），結論說怎麼用「it is up to the teacher」（L462）。原文沒有任何一般班級規模的實施資料（A3 的「classroom studies」也是四到七人一組）。

另有正文與側欄用字不同：heuristic strategies 正文是「generally effective techniques」（L368），側欄是「generally applicable techniques」（L396）；control strategies 側欄寫「general approaches」（L398），正文沒有 general 這個限定；社會面第四項正文叫「Exploiting cooperation」（L454），側欄叫「Cooperation」（L432）。

## 與清單『要撐的結論』不合的地方

清單 11-f：「認知學徒制的方法裡，文章做得到哪幾種。」（清單末尾已註明只能寫成依定義的對照，不能寫成有證據。）

1. **原文沒有回答這個問題。** 全文沒有討論文字教材能承載哪幾種方法；六種方法的定義主詞全是老師。「文章做得到哪幾種」只能是站方依定義做的推論，要標成自己的推論，不能掛在 Collins 等人名下。
2. **依定義對照時，原文給得出的界線**（供推論用，每一條都附了行號）：
   - Modeling：定義是專家把內在過程外化讓學生觀察；文章自己就印了兩段書面的放聲思考（L238–242、L262–342）。所以「寫成文字的示範」在這篇裡有實例。但作者談到看專家掙扎的效果時用的是 live modeling（L246），而且強調學生要先自己試過再聽（L144）。
   - Scaffolding：定義明列實體支撐物這一型（提示卡、短雪板，L382），寫作案例的提示卡就是預先寫好的句首（L162–226）。但由老師給的那一型要求「accurate diagnosis of the student's current skill level」（L382），fading 是隨學生進步逐步拿掉。預先寫死的文章做不到診斷，這一點原文定義裡就有。
   - Coaching：定義要求觀察學生當下的表現（L380）；文中直接說老師在作業題上「cannot really coach them effectively」（L350）。依定義，文章做不到。
   - Articulation、Reflection：都要學生產出東西；reflection 還要拿學生自己的過程和專家的比（L384–386）。文章可以出題要求、可以提供專家那一半（abstracted replay，L354），收不到學生那一半。原文沒有說只做一半算不算。
   - Exploration：給大方向讓學生自己定題（L388）；原文說這要教、而且是鷹架撤完後的自然終點。
3. **「雙向可見」是原文的核心條件**（L42：老師的思考要讓學生看見，學生的思考也要讓老師看見）。文章只能做到前一半。若稿子把認知學徒制簡化成「把思考過程寫出來」，就少了作者標為最重要差異的另一半。
4. **不能從這篇引效果數字當證據。** A1–A6 都是二手轉述，文中沒有給對照組；15% → 85% 那一項是一對一的先導研究。若要寫 reciprocal teaching 或程序提示有效，要回 Palincsar 與 Brown 1984、Scardamalia 等 1984 原文。
5. **適用範圍比清單寫的窄**：作者自己排除背誦型內容（L458），而且說三個例子選的是概念與事實基礎相對少的領域（L60）。站上的課程導讀多半是知識量大的技術內容，不在作者舉例的範圍內；這一點寫 11-f 時要交代。
6. 清單「之前讀到哪」只列了四要素與 reciprocal teaching 一段。對 11-f 最有用的其實是沒被讀到的三處：L54 作者對讀書與聽講的說法、L346 教科書只呈現成功路徑、L382 鷹架的兩種形式與診斷前提。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–270 | 檔頭、導言、傳統學徒制、從傳統到認知學徒制、閱讀案例（含對話逐字稿）、寫作案例（含提示卡清單與放聲思考）、數學案例前半（含題目） |
| 2 | L270–538 | 數學側欄（專家示範、證明、事後檢討）、數學案例後半、框架四維（content、method、側欄一覽表、sequencing、sociology）、結論、致謝、參考文獻（L470–530，書目，逐筆看過）、作者小傳、註腳 |
| 補 | AFT 原頁（curl，2026-10-14） | 只用來核對標題、副標題、署名、刊期；沒有另存 |

全文沒有表格（側欄的原則一覽在檔裡是條列文字，L390–432），沒有 PDF 可對。致謝裡的經費來源：OERI 合作協議（伊利諾大學 Reading Research and Education Center、BBN）與西北大學 Institute for the Learning Sciences（由 Andersen Consulting 資助成立）（L468）。

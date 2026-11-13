# 抽取紀錄：Thurn 等 2023〈Questioning central assumptions of the ICAP framework〉

- **書目**：Christian M. Thurn、Peter A. Edelsbrunner、Michal Berkowitz、Anne Deiglmayr、Lennart Schalk（2023）。Questioning central assumptions of the ICAP framework. *npj Science of Learning*, 8, 49. DOI 10.1038/s41539-023-00197-4。收稿 2023-01-24、接受 2023-10-17、刊出 2023-11-15。文章類型：**Comment**（XML `article-type="brief-report"`，出版社頁標 Comment，4 頁）。作者姓名與單位對 XML 與出版社頁核過：Thurn、Edelsbrunner、Berkowitz 在 ETH Zurich（Edelsbrunner 另掛 LMU Munich），Deiglmayr 在 Universität Leipzig，Schalk 在 Pädagogische Hochschule Schwyz。
- **原文檔**：`.research/raw/learning-content/q3-activity/thurn2023_PMC10652002.xml`，5 行、58,996 位元組（58,796 字元）。XML 幾乎是單行，我用 `python3 -I` 去標籤後存成 scratch 的逐段文字檔（181 行、31,272 位元組）依序讀；下面的「段」編號是正文段落的順序，「L」是那份 scratch 文字檔的行號（scratch 檔不保留，引用時以段落與小節標題為準）。
- **讀取日期**：2026-10-14
- **版本**：刊出版（PMC10652002，CC BY 4.0）
- **供哪幾篇用**：order 8（結論 8-c 的反方評論）
- **利益聲明**：XML 與 nature.com 頁面都印「The authors declare competing interests.」，沒有說明內容。看起來像漏了「no」，但我無法確認，照原樣記。作者貢獻：「All authors contributed equally」。致謝 Frank Reinhold、Garvin Brod。沒有經費聲明。

## 研究設計

- **類型**：評論文（立場文）。沒有新資料、沒有系統性檢索。作者自己講明：「Note that this comment is not aimed at systematically reviewing empirical research on the ICAP framework. Rather, we take a look at specific studies that have been reported as strong support for the ICAP framework, and we bring up general insights from the last decades of educational research that question the validity of the framework.」（引言第 2 段，L38）
- **對象**：ICAP 的兩個核心假定：(1) 投入模式可由外顯行為偵測；(2) 四種模式對學習的效果有固定高低排序 I > C > A > P。
- **結構**：引言兩段 →「Is overt behavior a reliable indicator of students' cognitive engagement?」（六段）→「Is the hierarchy of modes of engagement a useful heuristic?」（三段）→「A step forward: harnessing formative assessment…」（三段）。無表、無圖。參考文獻 34 條。
- **受試者、教材、測量**：不適用。文中轉述他人研究時提到的樣本：Menekse 等 2013 第一個研究 42 名工程系大學生、第二個研究 120 名大學生；Ziegler 等 2018 是六年級學代數。

## 結果（逐項）

這是評論文，下面列的是「每一個可能被引用的主張」與它在文中的依據。

### 一、外顯行為能不能代表認知投入

| # | 主張 | 依據（文中給的） | 位置 | 原文 |
|---|---|---|---|---|
| 1 | Chi 等人自己承認對應不完美、是機率性的 | 引 Chi 2018、2021 | 引言第 1 段 L37；第一節第 1 段 L41 | 「Chi and colleagues do acknowledge that the "correspondence between overt behavior and cognitive processes is not perfect"」；「Their claim is that the link … is probabilistic rather than deterministic, but that most of the time the correspondence holds well enough」 |
| 2 | 決定學習活動效果的是內隱特徵，不是外顯特徵 | 引 Koedinger 等 2012（KLI）、Klieme 2006、Seidel 等 2006（兩篇德文）；教學品質模型（Kunter 等 2013） | 第一節第 2 段 L42 | 「Educational research has repeatedly demonstrated that the covert features, rather than the overt features of student behavior, determine the effectiveness of learning activities」 |
| 3 | 套用 ICAP 的研究常忽略 Chi 的但書，直接把外顯行為當認知投入 | 列五篇（文獻 10–14：Antonietti 2023、Barlow & Brown 2020、Conley 2022、Goldberg 2021、Sailer 2021），沒有逐篇說明 | 第一節第 2 段 L42 | 「it is worrying that research applying the ICAP framework ignores these caveats and equates overt behavior with cognitive engagement in a simplified manner」 |
| 4 | 例一：看影片依 ICAP 是 passive，但帶著觀察任務看可以是認知上的 active 甚至 constructive，外顯行為相同 | **作者舉的假想例，沒有引實驗** | 第一節第 3 段 L43 | 「watching a video while following an observation assignment … can bring students into a mode that is cognitively active … or even constructive …, even though the overt behavior remains identical.」 |
| 5 | 例二：抄黑板例題算 active，但看不出有沒有認知投入；只聽老師解釋例題的相關性看起來 passive，「may indeed learn better」 | 引 McCrudden & Schraw 2007（relevance instruction）、Engle 等 2012（expansive framing）；用詞是 may | 同上 | 「would appear passive, but may indeed learn better」 |
| 6 | 複製貼上式的寫作任務對學習幫助不大；老師的引導是關鍵 | 引 Dunlosky 等 2013、Kirschner 等 2006 | 同上 | 「tasks involving copy-and-paste-like writing procedures are not very conducive to learning, whereas appropriate teacher guidance is a critical element in any kind of learning activity」 |
| 7 | 用外顯行為當捷思「不只誤導，還可能讓老師分心」 | 作者的推論，用詞 might | 同上 | 「The heuristic to equate overt engagement with learning is not only misleading, it might even distract teachers from implementing instructional features that are actually conducive to learning.」 |
| 8 | 把 active 操作化成外顯動作，可能對身心障礙學生形成障礙 | 引 Lombardi、Shipley 等 2021 | 同上 | 「this operationalization may add a barrier to including students with disabilities」 |
| 9 | 小結：外顯行為是不可靠的代理指標 | 引 Klieme 2006、Seidel 2006；Sinatra 等 2015 | 第一節第 5 段 L45 | 「overt behavior is an unreliable proxy of the cognitive activities of students and of the effectiveness of instruction」；「their relation is so uncertain that they should not be mistaken for one another」 |
| 10 | Chi 的補救是看學生產出，但沒說何時要看；產出也不是為診斷設計的 | 引 Chi 2009、2018、2021 的原話 | 第一節第 6 段 L46 | 「it does not become clear when and in which situations teachers are supposed to take outputs into account」；「whether it is diagnostic of the learning process is unclear」 |

### 二、四級排序

| # | 主張 | 依據 | 位置 | 原文 |
|---|---|---|---|---|
| 11 | 就作者所知，沒有人系統性評估過這個排序 | 作者的陳述，帶「To the best of our knowledge」 | 第二節第 1 段 L49 | 「To the best of our knowledge, there has been no systematic evaluation of the hierarchy of modes of engagement as the central hypothesis derived from the ICAP framework」 |
| 12 | Chi & Wylie 明說自己的文獻回顧是選擇性的、只引支持的研究 | 引 Chi & Wylie 2014，**沒有給頁碼或引文** | 同上 | 「Chi and Wylie explicitly state that their review of evidence is selective and that it only refers to research in favor of the framework.」 |
| 13 | Menekse 等 2013 研究一（42 名工程系大學生，組內設計，一整天只用一種模式）四個弱點：(a) 整天單一模式缺乏真實課堂的效度；(b) 每天學不同內容、用不同任務，無法依主題直接比較；(c) **interactive 與 constructive 的差異很小且不顯著**；(d) 沒有檢定三個條件是否優於 passive | 作者對該研究的轉述，沒有給數字 | 同上 | 「Third, the interactive and constructive modes showed a negligible and non-significant difference, which does not support the ICAP hypothesis (see also ref. 25). Fourth, this study did not test the three conditions for their superiority over the passive mode.」 |
| 14 | Menekse 等 2013 研究二（120 名大學生，組間前後測，四種模式都有）：passive 組被要求把文字唸出聲，是人為的任務，妨礙重讀難段落這類自我調節 | 作者的轉述與評論 | 第二節第 2 段 L50 | 「learners in the passive condition had to read aloud text, producing an artificial task that undermines basic self-regulation strategies such as the rereading of difficult passages」 |
| 15 | 兩個研究離真實課堂很遠；結果「do not provide unequivocal support」 | 作者的判斷 | 同上 | 「They lack ecological validity … and the results do not provide unequivocal support for the ICAP hypothesis.」 |
| 16 | Conley 等 2022：passive 活動的投入程度高於 active 活動 | 一句轉述。該文題目是 Facebook 使用模式；轉述的結果變項是「levels of engagement」，**不是學習成果** | 第二節第 3 段 L51 | 「Conley and colleagues report higher levels of engagement for passive activities compared to active activities.」 |
| 17 | Ziegler、Edelsbrunner & Stern 2018：六年級代數的一系列研究，直接教學的學習成果優於精心設計的自學教材 | 作者自己的研究（Edelsbrunner 是本文共同作者）；模式是作者事後套的（「encompassing more overtly passive…」），原研究不是 ICAP 研究；沒有給數字 | 同上 | 「direct instruction (encompassing more overtly passive student engagement and less constructive student activities) resulted in better learning outcomes than carefully designed self-learning materials (encompassing more overtly active and constructive modes of engagement).」 |
| 18 | 新手尤其受益於老師引導較強的教學 | 引 Kirschner 等 2006，稱為 well-established principle | 同上 | 「particularly novice learners benefit from more strongly teacher-guided instruction」 |
| 19 | 排序的小結 | — | 同上 | 「the empirical basis for the hierarchy specified in the ICAP framework is not convincing.」 |
| 20 | 真實教學是不同活動的序列（協作、解題、直接教學），效果取決於時機與學生準備度，所以不會有永遠最好的模式 | 引 Sinha & Kapur 2021、de Jong 等 2023 | 第二節第 1 段 L49 | 「the effectiveness of a specific learning activity depends on the timing and the readiness of the students」 |

### 三、作者提的替代方案

| # | 主張 | 依據 | 位置 | 原文 |
|---|---|---|---|---|
| 21 | 用形成性評量看內隱歷程 | 引 Black & Wiliam 2009；統合／系統性回顧兩篇（Graham 等 2015 寫作、Lee 等 2020 美國 K-12） | 第三節第 1 段 L54 | 「In contrast to the inconclusive empirical basis which is available for the ICAP hierarchy, meta-analyses on formative feedback support its effectiveness」 |
| 22 | 學習任務的首要目的是促進學習，不是提供診斷資訊 | 作者論述 | 第三節第 2 段 L55 | 「Learning tasks are not explicitly designed to deliver diagnostic information.」 |
| 23 | 形成性評量對老師的負擔比 ICAP 重 | 作者自己承認 | 第三節第 3 段 L56 | 「Systematic use of formative assessment may put a higher demand on practitioners' shoulders than following the ICAP framework」 |
| 24 | 最終建議 | 摘要 L28 | 摘要 | 「practitioners should not be advised to rely on ICAP for selecting effective interventions and assessing learning processes in the classroom.」 |

本文**沒有**任何效果量、p 值或人數以外的數字。形成性評量的效果也沒有給數字。

## 作者自己列的限制

原文沒有 Limitations 節。散在文中的自我限定：

1. 不是系統性回顧，只看被當成強力支持的特定研究（L38）。
2. 「To the best of our knowledge」沒有系統性評估（L49）。
3. 多處用 may／might（第 5、7、8 項）。
4. 承認 Chi 等人自己已經講過對應是機率性的、也建議看學生產出（L41、L42、L46）；作者的批評對象有一大部分是「ICAP 被拿去用的方式」，不只是 Chi 的原始說法（第 3 項）。
5. 形成性評量較費力（第 23 項）。

作者沒有提、但影響怎麼用這篇的事（我的觀察）：

- 反例很少：排序那一節的反例是 Menekse 研究一的 I 對 C 不顯著、Conley（結果變項是投入不是學習）、Ziegler（作者群自己的研究，事後套模式）。這篇對 ICAP 的批評方式（挑研究、事後歸類）與它批評 Chi & Wylie 的方式相同。
- 外顯行為那一節的兩個例子都是假想情境，沒有引用直接比較「外顯行為相同、內在處理不同」的實驗。
- 兩篇關鍵依據（Klieme 2006、Seidel 2006）是德文期刊文章，本文沒有轉述它們的資料。
- 形成性評量與 ICAP 回答的是不同問題（怎麼知道學生學到沒 對 怎麼選活動），作者把兩者當替代品，沒有討論這一點。

## 與摘要說法不一致的地方

逐項對過，主張一致，但有三處摘要比正文強：

1. 摘要說兩個假定「are inconsistent with central tenets of empirical educational research」；正文的結論句較弱：「likely lead to wrong inferences in practice, and do not correspond well with research」（L38）、「not convincing」（L51）、「do not provide unequivocal support」（L50）、「inconclusive empirical basis」（L54）。正文說的是證據不足，摘要說的是與研究牴觸。
2. 摘要說「Supposedly inferior engagement modes excel when used in the right way, on the right learners, and with the right timing」；正文支撐這句的只有 Ziegler 2018 一組研究加上 Kirschner 2006 的原則與「教學是序列」的論述。
3. 摘要說外顯行為「do not reliably indicate」學習歷程；正文的直接依據是兩個假想例與對教學品質文獻的概括引用，沒有量過對應程度的資料。

## 與清單『要撐的結論』不合的地方

清單 8-c：「ICAP 的四級排序是假說；外顯行為不等於內在處理。」清單把這篇標為反方評論。

- **方向撐得住**：兩句話正好是本文的兩個論點。
- **要改寫的地方**：
  1. 這篇不能當成「排序已被推翻」的證據。它的結論是證據基礎「not convincing／inconclusive」，自己也聲明不是系統性回顧。文章只能寫「有評論指出排序沒有被系統性檢驗過，並舉出不合排序的研究」。
  2. **第 12 項與我讀到的 Chi & Wylie 2014 全文不合。** Thurn 說 Chi & Wylie「explicitly state that their review of evidence is selective and that it only refers to research in favor of the framework」。我把 Chi & Wylie 從頭讀到尾（見 `chi2014-icap.md`），沒有找到明說「回顧是選擇性的」或「只引支持的研究」的句子。最接近的是「we present four types of additional evidence in support of the ICAP hypothesis」（Chi & Wylie L1081–1082）與多處「can be reinterpreted」。回顧實際上確實是選擇性的（沒有檢索程序），但「作者明說」這一點原文撐不住；文章不要照 Thurn 的話寫成「Chi 自己承認只挑支持的研究」。
  3. **第 13、14 項與 Chi & Wylie 的描述有出入，兩邊我都只有二手轉述**。Chi & Wylie 把 Menekse 2013 寫成「a study … that included all four modes」、passive 條件是「reading a text passage」，圖 2 四組都有前後測，並說各模式間約 8–10%；Thurn 說 Menekse 2013 有兩個研究，研究一 I 與 C 差異不顯著、研究二的 passive 組要唸出聲。Menekse 2013 原文不在手上，哪邊的細節正確我無法判定。要引「I 與 C 無顯著差異」得先讀 Menekse 2013（*Journal of Engineering Education* 102, 346–374，doi 10.1002/jee.20021）；Thurn 另引 Wiggins 等 2017（AERA Open）當旁證，也沒讀。
  4. 「外顯行為不等於內在處理」這句，Chi & Wylie 自己就承認了（機率性對應）。兩篇的分歧不在這句話，而在「這個代理指標夠不夠用」：Chi 說對課堂夠用，Thurn 說不夠且會誤導。文章要把爭點寫對。
- **不能從這篇引的東西**：任何數字（除了 42、120 兩個樣本數，且是轉述）；Conley 2022 當成「passive 學得比 active 好」（它量的是投入）；形成性評量的效果量。

## 讀取紀錄

依序讀完 scratch 文字檔 L1–181（整份 XML 去標籤後的全部內容），一次讀完，沒有跳段：

| 順序 | 範圍 | 內容 |
|---|---|---|
| 1 | L1–33 | 期刊資訊、標題、作者與單位、日期、授權、摘要、關鍵詞 |
| 2 | L34–38 | 引言兩段 |
| 3 | L39–46 | 第一節（外顯行為）六段 |
| 4 | L47–51 | 第二節（排序）三段 |
| 5 | L52–56 | 第三節（形成性評量）三段 |
| 6 | L57–82 | Reporting summary、補充資料說明、出版者註、致謝、作者貢獻、利益聲明 |
| 7 | L83–181 | 參考文獻 34 條（逐條看過，用來確認文中編號對應哪一篇） |

原文沒有表、圖、附錄。補充資料只有一份 Nature Reporting Summary（PDF，沒有取檔，與論點無關）。另外抓了 nature.com 的文章頁（`https://www.nature.com/articles/s41539-023-00197-4`，存在 scratch、未存回原目錄）只用來核對利益聲明、刊出日期與第 12 項那句話的原文，三者與 XML 相同。

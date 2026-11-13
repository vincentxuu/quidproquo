# 抽取紀錄：Hohman、Conlen、Heer、Chau 2020，Communicating with Interactive Articles（Distill）

- **書目**：Fred Hohman（Georgia Tech）、Matthew Conlen（University of Washington）、Jeffrey Heer（University of Washington）、Duen Horng (Polo) Chau（Georgia Tech）。Communicating with Interactive Articles. *Distill*，2020-09-11 刊出。doi 10.23915/distill.00028。作者、單位、日期、DOI 都照頁首（原文檔字元 0–330）與頁尾的 BibTeX（字元約 70,700 起）。
- **版本**：刊出版（Distill 網頁），CC-BY 4.0。
- **原文檔**：`.research/raw/learning-content/q2-interactive/hohman2020-distill.txt`（單行、71,210 字元／71,485 位元組，從 HTML 轉的）。下面的位置一律寫這份檔的**字元位置**。
- **這份轉檔有缺，已補抓**：
  1. **引用標記全部被拿掉**（「has been shown …」後面接的是哪篇文獻看不出來）。2026-10-14 用 curl 重抓出版者原頁 `https://distill.pub/2020/communicating-with-interactive-articles/`，存成同目錄 `hohman2020-distill.html`（231,034 位元組），再轉出保留引用鍵、註腳的文字檔 `hohman2020-distill-cited.txt`（303 行、76,148 位元組；引用以 `[CITE:鍵]` 標出，註腳以 `[FOOTNOTE: … :ENDFOOTNOTE]` 標出）。下面寫到「引的是哪一篇」都是對這份檔查的。
  2. **圖說與兩張表不在 HTML 裡**，是頁面的 JavaScript（`index.bundle.js`）畫出來的。我把該檔抓到暫存目錄，抽出圖說、Table 2、Figure 2 的文字後刪掉，沒有存進 repo。Table 1（「A sortable list of the interactive articles we discuss in this work」）的內容沒有抽出來，沒讀到。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 7（該不該做互動）
- **利害關係**：四位作者中 Conlen 與 Heer 是 Idyll 的作者；Hohman 與 Conlen 創辦 The Parametric Press（原文自述「two of this work's authors created The Parametric Press」，字元約 37,900）。這篇是做互動文章的人寫的。

## 研究設計

- **類型**：文獻綜述加實務反思的論述文章。**沒有自己的資料、沒有實驗、沒有系統性的檢索方法**。自述：「We write this article not as media theorists, but as practitioners, researchers, and tool builders.」（字元 37,378）
- **材料**：「We draw from a corpus of over sixty interactive articles」（字元 5,032）；怎麼挑的沒有說明。另有自己辦 The Parametric Press 第一期的經驗，作者稱之為「a series of case studies, where we were observers」（字元約 40,000）。
- **結構**（字元位置）：前言（330–3,900）→ Interactive Articles: Theory & Practice（3,900–7,054）→ 五種 affordance：Connecting People and Data（7,054–12,773）、Making Systems Playful（12,773–19,653）、Prompting Self-Reflection（19,653–22,817）、Personalizing Reading（22,817–26,556）、Reducing Cognitive Load（26,556–32,202）→ Challenges for Authoring Interactives（32,202–37,358）→ Critical Reflections（37,358–44,654）→ Looking Forward（44,654–48,699）→ 致謝與作者貢獻（48,699–49,685）→ 參考文獻（49,685–70,500）。
- **比較對象、量了什麼**：沒有。全文所有「has been shown」都是轉引。

## 結果（逐項）

這篇沒有自己的數字。下面分三類：作者對證據狀況的評估、作者對成本的評估、文中轉引的實證說法（附它引的是哪一篇）。

### A. 作者對「互動文章有沒有用」的評估

| # | 說法 | 位置 | 原文一句 | 引用 |
|---|---|---|---|---|
| 1 | 開頭的強主張 | 2,370 | 「They have been shown to be more engaging, can help improve recall and learning, and attract broad readership and acclaim, … yet we do not know that much about them.」 | **這一句沒有掛任何文獻**。只有一個註腳，內容是紐約時報與華盛頓郵報最多人讀的文章有些是互動報導（引三篇報導本身） |
| 2 | 相對於靜態版的主張 | 3,110 | 「We show how digital designers are operationalizing these ideas to create interactive articles that help boost learning and engagement for their readers compared to static alternatives.」 | 無引用 |
| 3 | 結尾承認證據有限 | 47,242–47,650 | 「The usefulness of interactive articles is predicated on the assumption that these interactive articles actually facilitate communication and learning. There is limited empirical evaluation of the effectiveness of interactive articles. The problem is exacerbated by the fact that large publishers are unwilling to share internal metrics, and laboratory studies may not generalize to real world reading trends.」 | 無引用 |
| 4 | 紐約時報的說法 | 47,651 | 「The New York Times provided one of the few available data points, stating that only a fraction of readers interact with non-static content, and suggested that designers should move away from interactivity.」 | tse2016why |
| 5 | 反方資料 | 47,858 | 「However, other research found that many readers, even those on mobile devices, are interested in utilizing interactivity when it is a core part of the article's message.」 | conlen2019capture（共同作者自己的論文） |
| 6 | 對 #4 的評語 | 48,029–48,500 | 「This statement from The New York Times has solidified as a rule-of-thumb for designers and many choose not to utilize interactivity because of it, despite follow-up discussion that contextualizes the original point and highlights scenarios where interactivity can be beneficial. This means designers are potentially choosing a suboptimal presentation of their story due to this anecdote. More research is needed in order to identify the cases in which interactivity is worth the cost of creation.」 | aisch2017defense |
| 7 | 不是什麼都要互動 | 36,707–37,144 | 「It is also important to remember that not everything needs to be interactive. Authors should consider the audience and context of their work when deciding if use of interactivity would be valuable. In the worst case, interactivity may be distracting to readers or the functionality may go unused, the author having wasted their time implementing it.」 | 無引用 |
| 8 | 即使改善有限，放大到網路規模仍有影響 | 37,060–37,357 | 「However, even in a domain where the potential communication improvement is incremental, at scale (e.g., delivering via the web), interactive articles can still have impact.」註腳：「In reality, multimedia studies show large effect sizes for improvement of transfer learning in many cases, see Chapter 12 of [Mayer 2002].」 | 正文引 nielsen2015neural（一本線上書，不是研究）；註腳引 mayer2002multimedia（多媒體學習，不是互動文章） |
| 9 | 動畫的爭論 | 7,770 | 「While there is debate amongst researchers if animations in general are able to more effectively convey the same information compared to a well designed static graphic, animation has been shown to be effective specifically for communicating state transitions, uncertainty, causality, and constructing narratives.」 | 爭論引 tversky2002animation；四個「有效」分別引 heer2007animated、hullman2015hypothetical、michotte1946perception、thomas1995illusion（後兩者是 1946 年的知覺心理學書與迪士尼動畫的書） |

紐約時報那一項，本文寫的是「only a fraction of readers」，**沒有引 10–15% 或任何數字**，並把它稱為「anecdote」。

### B. 作者對成本的評估（都沒有數字）

| # | 說法 | 位置 | 原文一句 |
|---|---|---|---|
| 10 | 為什麼互動文章不普遍 | 32,202–32,778 | 「If interactive articles provide clear benefits over other mediums for communicating complex ideas, then why aren't they more prevalent? Unfortunately, creating interactive articles today is difficult. Domain-specific diagrams, the main attraction of many interactive articles, must be individually designed and implemented, often from scratch.」 |
| 11 | 工作量的比較 | 32,779 | 「The act of creating a successful interactive article is closer to building a website than writing a blog post, often taking significantly more time and effort than a static article, or even an academic publication.」註腳：「As a proxy, see the number of commits on an example Distill article.」（註腳只給連結，沒有寫 commit 數） |
| 12 | 工具不成熟 | 約 33,000–34,188 | 「Even for expert web developers, current tools offer lower levels of abstraction than may be desired to prototype and iterate on designs.」「Idyll does not offer any design guidance, help authors think through where interactivity would be most effectively applied」 |
| 13 | 需要的技能與分工 | 34,189–34,941 | 「To design an interactive article successfully requires a diverse set of editorial, design, and programming skills. While some individuals are able to author these articles on their own, many interactive articles are created by a collective team consisting of multiple members with specialized skills」；改本文的文字要「clone its source code using git, install project-specific dependencies using a terminal, and be comfortable editing HTML files」 |
| 14 | 會壞掉 | 34,942 | 「they are burdened by rapidly changing web technologies that could break interactive content after just a few years」；Critical Reflections 再問一次「Will an article's code still run a year from now? Ten years from now?」（字元約 42,100），他們的對策是發表時同時存一份 WARC |
| 15 | 多裝置 | 約 35,400 | 「ensuring bespoke content can be adapted for desktop and mobile screen sizes with varying connection speeds, since accessing interactive content demands more bandwidth」 |
| 16 | 誘因 | 35,679–36,220 | 「why should a researcher spend time on an "extra" interactive exposition of their work when they could instead publish more papers, a metric by which their career depends on?」 |
| 17 | 無障礙 | 36,221–36,706 | 「Making interactive articles accessible to people with disabilities is an open challenge. The dynamic medium exacerbates this problem compared to traditional static writing」 |
| 18 | 機會成本 | 43,504 | 「Any extra hour spent implementing one graphic was an hour that was not spent improving some other part of the issue, such as the clarity of the text, or the overall site design.」 |
| 19 | 誰負擔得起 | 46,181–46,700 | 「there is little funding available to support the development of interactive articles and the tools that support them. Researchers do not receive grants to communicate their work, and practitioners outside of the largest news outlets are not able to afford the time and implementation investment.」 |
| 20 | 一個細節層級可調的文字為什麼沒普及 | 31,046 | 「One challenge that has limited this technique's adoption is the burden it places on authors to write multiple versions of their content.」 |
| 21 | The Parametric Press 第一期的做法 | 38,300–38,900 | 「Given the challenges of authoring interactive articles, we did not ask authors to submit fully developed pieces. Instead, we accepted idea submissions, and collaborated with the authors over the course of four months to develop the issue, offering technical, design, and editorial assistance」。唯一的時間數字是「四個月做一期」；一期幾篇、幾個人、幾小時都沒有寫 |

### C. 文中轉引的實證說法（二手；要用得回原文查）

| # | 說法 | 位置 | 引用 | 備註 |
|---|---|---|---|---|
| 22 | 覺得好看的內容→態度較正面→花較多時間→學得較好 | 7,054–7,770 | greussing2019simply；時間引 fredrick1980learning、情緒引 um2012emotional | 是一條三段的推論鏈，不是有人直接量過「互動文章好看所以學得好」。原文用詞是「This in turn means … and ultimately lead to」 |
| 23 | 人形圖示沒有多引起同理，照片有助興趣與記憶 | 10,206 | boy2017showing；borkin 兩篇 | 「has been shown not to produce additional empathic responses」是無效果的結果 |
| 24 | 捲動式對步進式 | 11,054–11,700 | mckenna2017visual、zhi2019linking | McKenna：受試者偏好步進或捲動式勝過傳統靜態文章，但兩種之間投入度無顯著差異。Zhi：理解題在投影片式版面比垂直捲動好。兩者都只測桌機 |
| 25 | 教育遊戲 | 12,172 | virvou2005combining | 「has been shown to motivate students while maintaining or improving learning outcomes」，一篇 |
| 26 | 多媒體原則、冗餘原則 | 18,009–18,700 | mayer2002multimedia、mayer2008revising | 講的是文字加圖、旁白加動畫，例子是 3Blue1Brown 與 Primer，作者自己寫「they are not interactive」 |
| 27 | 自我解釋 | 19,653–20,200 | chi1989self、chi2000self | 「is known to have a positive impact on learning outcomes」 |
| 28 | 先畫預測（You Draw It） | 20,758 | kim2017explaining、nguyen2019they | 「Kim et al. showed that using visualizations as a prompt is an effective way to encourage readers to engage in self explanation and improve their recall of the information」。**沒有提 Kim 2017 同一實驗裡文字條件無效**；那一點要看 Kim 2017 的抽取紀錄 |
| 29 | 顯示別人的預測 | 21,252 | kim2017data | 「This additional social information was not shown to necessarily be effective for improving recall.」（無效果）接著作者自己推測它可能提高投入，明寫「one might hypothesize」 |
| 30 | 測驗效應、回饋、間隔重複 | 21,633–22,816 | gates1922recitation、roediger2006power、bangert1991instructional、karpicke2008critical；實作例引 case2014how、matuschak2019quantum | 條件句：「assuming readers are willing to participate in the process」 |
| 31 | 個人化 | 22,817 | cordova1996intrinsic、di2006authoring、kim2016generating | 「has been shown to increase engagement and learning」 |
| 32 | 分段與自訂步調 | 25,000–26,000 | clark2016learning、mayer2003multimedia、mayer2002pictorial | 「Multiple studies have been conducted showing that learners perform better when information is segmented」，引兩篇 Mayer |
| 33 | Explorable Explanations 社群站收了 170 多篇 | 44,962 | — | 「Their online hub contains 170+ interactive articles」 |

### 圖表（從頁面的 JavaScript 抽出，不在原文檔裡）

- **Table 2**「Interactive communication opportunities from both research and practice.」三列兩欄：

| | Research | Practice |
|---|---|---|
| Authoring | Next generation tooling | Evaluate in production setting, identify bugs |
| Designing | Developing theory, conducting laboratory studies | Evaluate specific design decisions in the wild, understand constraints |
| Publishing | Tools, guidelines, and best practices | Concrete examples for others to follow, available source code, accessible archives, DOI, branding |

- **Figure 2**「Interactive articles are applicable to variety of domains, such as research dissemination, journalism, education, and policy and decision making.」每個領域各列三項機會與三項挑戰。教育那一欄的挑戰：「How to best incorporate into traditional learning and classroom environments」「Making interactive articles accessible to all students」「Educators lack tools and skills for creation」。新聞那一欄的挑戰：「Require active reading in a reader that may be expecting bite-sized news」「Many readers viewing on mobile devices requires responsive design」「Difficult to produce at the fast pace of news cycles」。研究傳播的挑戰：「No clear incentive structure for researchers」「Little funding for bespoke research dissemination and communication」「Not seen as a legitimate research contribution」。
- **Figure 5 的圖說**：「Letting a reader first guess about data and only showing the ground truth afterwards challenges a reader's prior beliefs and has been shown to improve their recall of information.」
- 其他圖（1、3、4、6–11）是示範用的互動元件，圖說只有操作說明。

## 作者自己列的限制

沒有限制一節。算得上自我限定的話：

1. 「There is limited empirical evaluation of the effectiveness of interactive articles.」（47,393）
2. 「While the space of possible designs is far too broad to be solved with one-size-fits-all guidelines」（約 4,600）
3. 「This style of communication — and the platforms which support it — are still in their infancy.」（約 3,700）
4. 這個媒體「has not yet settled on a standardized format nor definition」（約 5,500）
5. 自述身分是實務者與工具作者，不是媒體理論家（37,378）。

作者沒寫的：六十多篇文章怎麼挑的沒有交代；引用的實證研究多半來自多媒體學習、資料視覺化與新聞學的單一研究，沒有一篇直接比較「互動文章對同內容的靜態文章」的學習成效。

## 與摘要說法不一致的地方

這篇沒有摘要，副標是「Examining the design of interactive articles by synthesizing theory from disciplines such as education, journalism, and visualization.」把前言當摘要來對：

1. **前言與結尾互相抵觸**。前言說互動文章「have been shown to be more engaging, can help improve recall and learning」（2,370）、「help boost learning and engagement for their readers compared to static alternatives」（3,110），兩句都沒有引用。結尾說「The usefulness of interactive articles is predicated on the assumption that these interactive articles actually facilitate communication and learning. There is limited empirical evaluation」（47,242）。要引這篇談證據，只能引結尾那一句；前言那兩句不能當成有證據的陳述轉述。
2. **Challenges 一節的開頭是條件句**：「If interactive articles provide clear benefits …」（32,202），不是斷言有明確好處。
3. **第 8 項的註腳**把「multimedia studies show large effect sizes for improvement of transfer learning」拿來支持互動文章，引的是 Mayer 的多媒體學習（文字加圖），不是互動。
4. 五種 affordance 裡的「has been shown」，對過引用後多數是各引一兩篇、且研究對象不是互動文章本身（見 C 類各列的備註）。

## 與清單「要撐的結論」不合的地方

清單寫：「圈內人自己對證據與成本的評估」。

- **證據**：撐得住，而且比清單寫的更明確——作者自己寫「limited empirical evaluation」，並說整件事「predicated on the assumption」。但同一篇前言又無引用地宣稱已被證明較好。文章若要引，應該兩句都交代，不能只挑一邊；最穩的寫法是「做互動文章的人自己在 2020 年寫：這類文章的效果少有實證評估」。
- **成本**：撐得住的是質性描述（比較像做網站、常比寫一篇論文還花時間、要一組人、幾年後可能壞掉、最大的新聞機構以外負擔不起）。**沒有任何工時或金額**；唯一的時間數字是 The Parametric Press 一期協作四個月。清單「目前找不到來源」那段說「手上的成本數字都來自高規格作者」，這篇同樣屬於高規格作者，而且沒有數字。
- **紐約時報**：這篇對 Tse 2016 的轉述是「only a fraction of readers interact with non-static content」，沒有數字；作者的立場是設計者因為這則「anecdote」而可能選了較差的呈現。order 7 若要寫「10–15% 被誤讀」，這篇只能當作「圈內人認為該數字被過度引用」的佐證，數字本身要回 Tse 與 Aisch 的原件。
- **立場要註明**：作者是 Idyll 與 The Parametric Press 的人，結語是「We believe in the power and untapped potential of interactive articles」（約 48,520）。這是支持者的自我評估。
- 清單沒寫、可能有用的：#7「not everything needs to be interactive … In the worst case, interactivity may be distracting to readers or the functionality may go unused」；#29 顯示別人的預測對回憶沒有幫助；#24 兩種版面之間投入度沒有顯著差異。

## 讀取紀錄

原文檔是單行文字，依字元區間首尾相接讀完：0–24,000（頁首、前言、Theory & Practice、Connecting People and Data、Making Systems Playful、Prompting Self-Reflection、Personalizing Reading 前半）、24,000–48,000（Personalizing Reading 後半、Reducing Cognitive Load、Challenges、Critical Reflections、Looking Forward 大部分）、48,000–71,210（Looking Forward 結尾、致謝、作者貢獻、參考文獻、更正與授權、引用格式）。參考文獻（49,685 起，約 150 筆）只掃過。

另外對過 `hohman2020-distill-cited.txt`：7 個註腳全部讀過；A、C 兩類每一列的引用鍵逐一對過。沒有逐句重讀整份帶引用的版本。

表與圖：原文檔與 HTML 裡都沒有；Table 2、Figure 2 的文字與各圖圖說是從頁面的 JavaScript 抽出來的字串，沒有在瀏覽器裡看過實際版面。Table 1（文章清單）沒有讀到。

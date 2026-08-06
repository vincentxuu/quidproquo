---
title: "Learning How to Learn：拆解 417 萬人修過的學習課，哪些站得住、哪些是比喻"
date: 2026-08-04
updated: 2026-08-04
category: learning
type: deep-dive
difficulty: 進階
tags: [learning-science, self-learning, retrieval-practice, spaced-repetition, metacognition, ai-and-learning]
lang: zh-TW
tldr: "Dunlosky 2013 評比 10 種學習技術，判定為高效用的只有自我測驗與分散練習；學生最愛的重讀落在低效用層。但 2026 年的系統性回顧把效果量壓到 0.22–0.46，Pan & Rickard 的遷移 meta 校正發表偏誤後「往往顯示零遷移」。而 AI 教育界被引用最多的那篇 meta-analysis（g = 0.867），已在 2026 年 4 月被 Nature 撤稿。"
description: "拆解 Coursera「Learning How to Learn」的核心概念與背後證據：哪些有 meta-analysis 撐、哪些只是心智模型、哪些已被推翻、哪些正在縮水，以及 LLM 如何改變這一切。"
draft: false
glossary:
  - term: "retrieval practice"
    aliases: ["提取練習", "自我測驗", "practice testing"]
    definition: "闔上材料、主動從記憶裡把答案叫出來，而不是重看一遍。"
    advanced: "測驗本身就是學習事件，不只是評量。材料愈複雜，效果愈可能縮水。測驗格式孰優是未決分歧——Dunlosky 一線多認為自由回想優於再認，但 Adesope 等人 2017 的 meta 反而是選擇題（+0.70）大於簡答題（+0.48）。"
    context: "本文中它是 Dunlosky 十法評比裡唯二拿到「高效用」的技術之一。"
    links:
      - label: "Rowland (2014) meta-analysis"
        url: "https://doi.org/10.1037/a0037559"
  - term: "desirable difficulties"
    aliases: ["必要的困難", "有益的困難"]
    definition: "Robert Bjork 提出的概念：某些讓當下表現變差、感覺變難的學習條件，反而會提升長期保留。"
    advanced: "涵蓋分散練習、交錯練習、提取練習、變動練習條件等。困難要「必要」——超出學習者能力的困難只是困難。"
    context: "本文用它解釋為什麼 AI 輔助會傷害學習：它移除的正是這種困難。"
  - term: "meshing hypothesis"
    aliases: ["匹配假說", "學習風格匹配"]
    definition: "主張把教學方式配合學生偏好的「學習風格」（視覺／聽覺／動覺）就能提升學習成效。"
    advanced: "要成立需要出現 crossover interaction：視覺型學生在視覺教學下較好，且聽覺型學生在聽覺教學下較好。單純「某組表現比較好」不算數。"
    context: "本文討論它從 2008 年被判定為迷思、到 2024 年出現部分翻案的過程。"
  - term: "Hedges' g"
    aliases: ["效果量", "effect size"]
    definition: "標準化的效果量指標，表示兩組平均數差了幾個標準差；比 Cohen's d 對小樣本有校正。"
    advanced: "0.2 約為小、0.5 中、0.8 大，但這組門檻只是慣例。搭配異質性指標 I² 一起看才有意義——平均值高但 I² 高，代表個別情境的結果差異很大。"
    context: "本文引用的多個 meta-analysis 都用它報告效果，例如 testing effect 的 g = 0.50。"
  - term: "response congruency"
    aliases: ["答案重疊性"]
    definition: "練習測驗與最終測驗的正確答案有多少重疊。"
    advanced: "Pan & Rickard 的遷移 meta 中最強的調節變項。隨機效果模型：無重疊時 d = 0.28，有重疊時增加 0.30 至 0.58；校正發表偏誤後（PEESE）截距實質為零，重疊帶來的增幅為 0.36。"
    context: "本文用它說明為什麼「練了會遷移」這個假設比想像中脆弱。"
  - term: "cognitive offloading"
    aliases: ["認知卸載"]
    definition: "把記憶或思考工作外包給外部工具（筆記、搜尋引擎、AI），減少大腦本身的負荷。"
    advanced: "短期提升表現，但可能減少內部知識結構的建立。爭議在於「哪些該卸載」——卸載查找成本通常無害，卸載推理過程則可能有害。"
    context: "本文用它串起 2025 年幾份關於 LLM 與學習的研究。"
---

> 🌏 [English version](/posts/learning/2026-08-04-learning-how-to-learn-en)

Coursera 上有一門課，[官方頁面](https://www.coursera.org/learn/learning-how-to-learn)顯示註冊人數 4,175,377、評分 4.8 分（93,136 則評價）。它叫 Learning How to Learn，由工程學教授 Barbara Oakley 和神經科學家 Terrence Sejnowski 開設，[2014 年 8 月首次開課](https://tdlc.ucsd.edu/tdlc2/news_LHTL_MOOC.php)，第一期就湧入 19.7 萬人、來自 206 個國家。[紐約時報 2015 年底報導](https://archive.nytimes.com/bits.blogs.nytimes.com/2015/12/29/the-most-popular-online-course-teaches-you-to-learn)時，它累積 119 萬人，是當時全球註冊人數最多的 MOOC，險勝 Andrew Ng 的 Machine Learning。

這篇不是課程心得。這篇要做的是把「課教了什麼」和「證據支持什麼」分開對帳——因為這兩件事重疊得沒有想像中多，而且落差的方向很有意思：**課裡最有名的那個概念，證據最弱；課裡不太強調的那些，證據最硬；而整套框架的名字本身——「學習如何學習」——恰好是被測得最不好看的一塊。**

## 它在解的問題不是「不夠努力」

先講清楚這整個領域的核心命題，因為它不是一份技巧清單。

2009 年 Karpicke、Butler 與 Roediger [調查了 177 名大學生](https://learninglab.psych.purdue.edu/downloads/2009/2009_Karpicke_Butler_Roediger.pdf)怎麼念書。結果是：

> 84% 的學生表示自己會重複閱讀，55% 把重讀列為第一順位策略；只有 11% 明確表示會在讀書時自我測驗，其中僅 1% 是因為相信提取本身能促進學習。

而重讀，正是後面會講到的十法評比裡被判「低效用」的那一組；自我測驗則是唯二「高效用」之一。學生不是懶——他們在花時間，只是**系統性地選錯**。選錯的原因也很清楚：重讀感覺有效。第二遍讀起來比第一遍順，那份流暢感被大腦誤讀成「我學會了」。

所以這個領域真正的命題是一句話：**學習的主觀流暢感，跟長期保留度是反相關的。** 幾乎所有有實證支撐的技術，都長得像「讓當下變難一點」。

## 招牌概念是比喻，而且作者自己說過

課程最廣為流傳的是 focused mode / diffuse mode——專注模式與發散模式，說大腦在兩者間切換，解不開的題目要放著讓發散模式在背景跑。這個概念被 [Farnam Street](https://fs.blog/focused-diffuse-thinking) 之類的網站大量轉載，通常配著「神經科學顯示」的說法。

問題出在神經科學那一側。[預設模式網路（default mode network）的標準描述](https://neuroscientificallychallenged.com/posts/know-your-brain-default-mode-network)是：它在需要專注的外向任務中活動**受到抑制**，而在靜息、放鬆清醒與內向思考（做白日夢、回憶、想像未來）時才升高。換句話說，「兩個模式同時在背景跑」跟 DMN 的實際行為對不上——它不是在背景加班，它是在你專注時安靜下來。

這個張力 Oakley 本人處理過。以下這段流傳很廣，出處被標為《A Mind for Numbers》的註腳——**但我必須先說清楚：我只在 [Psychology Stack Exchange 的一則轉錄](https://psychology.stackexchange.com/questions/18292/does-mindful-meditation-inhibit-diffuse-thinking-aka-default-mode-network-cre)上見過它，全網找不到第二個獨立出處，也沒能核對紙本頁碼。要引用請自行查證原書**：

> 眼尖的讀者會注意到我提過發散模式有時會在專注模式運作時於背景進行。然而研究發現，例如預設模式網路（這只是眾多靜息態網路之一）在專注模式活躍時似乎會安靜下來。那到底是哪一種？……某種意義上，我使用的「發散模式」一詞或許該理解為「朝向學習的非聚焦活動」，而不是單指預設模式網路。

如果這段轉錄忠實，那它就不是外界的指控，而是作者主動說明自己做了簡化。但即使把這段完全拿掉，結論仍然成立，因為它靠的是 DMN 文獻本身：**focused / diffuse mode 是一組好用的心智模型，不是神經科學結論。** 你可以完全不接受它的神經學版本，同時保留它的行為建議（卡住就去散步）——因為那個建議的支撐來自別的地方。

課程另外兩個常被引用的組件也值得校準：

- **Chunking（組塊）**：概念本身沒問題，但常搭配的「7±2」數字已經過時。Miller 1956 年的七加減二測的是可組塊化之後的量；[Cowan 2001 年提出的 4±1](https://nschwartz.yourweb.csuchico.edu/4.%20Magical%20mystery%204%20cowan.pdf) 測的是組塊本身的數目，而現代共識偏向後者。[兩者可以調和](https://journalofcognition.org/articles/10.5334/joc.387)——差別在於任務有沒有讓你組塊。實務含意：你能同時操作的獨立單元比你以為的少，所以組塊不是加分項，是必要條件。
- **番茄鐘**：[Biwer 等人 2023 年在 British Journal of Educational Psychology 做的對照實驗](https://pmc.ncbi.nlm.nih.gov/articles/PMC12532815)發現，系統性休息（24 分鐘讀 + 6 分鐘休息）相較自我調節休息，專注度與動機較高、疲勞較低、用時較短——**但兩組在投入的心智努力與任務完成量上沒有差異**。它改善的是體驗與效率，不是學習量。這個區分很重要，別把它當成學習技術賣。

這也是我對這門課評價的核心：它的價值在把行為做成流程，不在它的腦科學。課程作業直接命名為 "Retrieval Practice"，這比它講的任何神經科學都重要。

## 真正硬的證據：Dunlosky 的十法評比

2013 年，Dunlosky 等五位研究者在 *Psychological Science in the Public Interest* 發表 [Improving Students' Learning With Effective Learning Techniques](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266)，挑了 10 種學生可以自己用、不需老師監督的技術，逐一評估其效果能不能跨學習條件、學生特質、材料類型、測驗形式推廣。結論是一張很不客氣的分層表：

| 效用等級 | 技術 | 補充數字 |
|---|---|---|
| **高** | practice testing（自我測驗） | [Rowland (2014)](https://doi.org/10.1037/a0037559)：g = 0.50；[Adesope et al. (2017)](https://doi.org/10.3102/0034654316689306)：vs 重讀 +0.51、vs 無活動 +0.93（見下方說明） |
| **高** | distributed practice（分散練習） | [Kim et al. (2019)](https://www.yorku.ca/ncepeda/publications/KWWR2019.pdf) 用真實世界大數據驗證仍成立 |
| **中** | elaborative interrogation、self-explanation、interleaved practice | 交錯練習 [Brunmair & Richter (2019)](https://doi.org/10.1037/bul0000209)：g ≈ 0.42 |
| **低** | summarization、highlighting、keyword mnemonic、imagery、**rereading** | 學生最常用的重讀與畫線都在這層 |

原文對高效用組的判準寫得很直接：

> 自我測驗與分散練習獲得高效用評價，因為它們對不同年齡與能力的學習者都有幫助，並且已被證明能在許多測驗任務、甚至在真實教育情境中提升學生表現。

**先講一個引用陷阱**，因為它示範了整篇文章的主題。Adesope 等人 2017 年那份 meta-analysis，你會在不同地方看到不同數字：0.51、0.61、0.70、0.83、0.93。它們大多都對——差別在對照組是誰、或在講哪一個子分析。整理成一張表：

| 數字 | 它其實是什麼 |
|---|---|
| +0.51 | vs **重讀** 的加權平均效果量 |
| +0.93 | vs **填充活動或完全不做** |
| g = 0.61 | [跨所有對照條件合併](http://www.lscp.net/persons/ramus/docs/EPR20.pdf) |
| 0.64 / 0.83 | 小學 / 中學的分齡數字（Dietrichson 等人引用） |
| +0.70 vs +0.48 | 選擇題 vs 簡答題的練習測驗格式差異 |

二手文章通常挑一個最大的、不講那是跟什麼比。**那你該用哪個？跟你實際的替代方案比。** 如果你本來會重讀，參考值是 0.51，不是 0.93。

該文另外三個結果值得記住，因為它們違反直覺、而且都很可操作（以下引自[真正讀過原文的 Pedro De Bruyckere 的摘錄](https://theeconomyofmeaning.com/2017/03/21/important-new-meta-analysis-on-the-testing-effect-with-some-surprises)）：

> 練習測驗的格式、次數與頻率，會影響最終測驗上的學習效益。含選擇題選項的練習測驗，其加權平均效果量（+0.70）大於簡答題（+0.48）。**在最終測驗前做一次練習測驗，比做好幾次更有效。** 不過時機需要仔細考量：練習與最終測驗間隔不到一天的效果量，小於間隔一到六天者（分別為 +0.56 與 +0.82）。

「一次比多次好」和「選擇題贏簡答題」都跟這個領域的常見說法相反——後者尤其要小心，因為 Dunlosky 那條線的文獻多半認為自由回想優於再認。這是**尚未調和的分歧**，不是定論。而「間隔一到六天優於當天」則跟分散練習完全一致。

最後一個必須講的是方法學：**這篇 meta-analysis 用 Fail-safe N 檢驗發表偏誤，而這個指標早就被認為會嚴重高估穩健性。** 這點由兩位獨立讀過原文的人分別指出——[Learning Scientists 的 Yana Weinstein 說要「打點折扣看」](https://www.learningscientists.org/blog/2017/2/9-1)，De Bruyckere 文章底下的討論則直接援引 Fergusson & Heene (2012)。所以上面那些數字，該當成有偏誤風險的估計，不是定值。

這張表現在被引用得非常廣。但過去十年裡，它下面的地基動了三次，寫這題的人幾乎都沒跟上。

**第一，異質性比平均值重要。** Rowland 的 g = 0.50 底下 I² = 84.35——研究之間的變異絕大部分不是抽樣誤差，而是真實的情境差異。「平均 0.5」不等於「你這次會拿到 0.5」。

**第二，較新、方法更嚴的估計落在低區間。** 2026 年 3 月，Dietrichson 等人發表了[一份大規模系統性回顧](https://edworkingpapers.com/ai26-1418)：初篩 102,451 筆記錄、87 個研究符合條件、59 個進入資料合成。在對照組完全不做練習測驗的比較下，效果量是 between-subject 設計 0.22（95% CI [0.09, 0.34]）、within-subject 設計 0.46（[0.29, 0.62]）。作者確實寫了這些數字「似乎小於先前回顧所得」——Adesope 在小學與中學的對應數字分別是 0.64 與 0.83。

**但那句話要連著它的但書一起讀**，否則就是我在替作者加碼。原文緊接著說明各回顧的納入標準與分析策略不同，「量值本來就較難直接比較」；而且他們並不認為自己的效果量小——對照 [Kraft (2020)](https://doi.org/10.3102/0013189X20912798) 的標準，教育研究裡 0.2 以上已算大。所以誠實的講法是「新估計落在較低區間」，不是「效果被推翻了」。

同一份回顧的探索性分析還發現：**學習材料愈複雜，練習測驗的效果愈差。**

**第三，複雜材料是一場沒打完的仗。** [van Gog 與 Sweller 2015 年那篇的標題](https://link.springer.com/article/10.1007/s10648-015-9310-x)就是結論——「testing effect 隨學習材料複雜度上升而下降甚至消失」。Karpicke 與 Aue 同年以〈The testing effect is alive and well with complex materials〉正面反駁，Rawson 也加入戰局，爭點卡在「複雜度」根本難以操作化。Dietrichson 2026 的結果偏向前者，但這仍是**未解決的活爭論**，看到有人單方面宣稱勝負就該提高警覺。

順帶一個尚未調和的衝突：Rowland 發現回饋會放大 testing effect，但 Adesope 的結果是有回饋只比沒回饋「略好」——這點由[Learning Scientists](https://www.learningscientists.org/blog/2017/2/9-1) 與 [Dietrichson 等人的系統性回顧](https://edworkingpapers.com/ai26-1418)（原文：「Adesope 等人發現練習測驗有無回饋的效果相近」）兩處獨立確認。

**交錯練習則是挑材料。** Brunmair 與 Richter 的 meta-analysis 標題就叫 *Similarity matters*，涵蓋 59 篇研究、238 個效果量。結論是交錯對繪畫等視覺材料、對數學題型有效；對說明文（expository text）沒有優於區塊練習；對跨類別的單字學習甚至可能有害。把「交錯練習」當通用建議是誤讀原文。

## 最尷尬的問題：這些技術會遷移嗎？

這是整篇文章最該講、而幾乎所有導讀文都跳過的一段。

「Learning how to learn」這個名字內建了一個假設：學會學習法之後，它會跨到別的地方去用。這個假設不是沒被測——它被測了，而且結果不太好看。

[Pan 與 Rickard 2018 年在 Psychological Bulletin 做了第一份完整的遷移 meta-analysis](https://doi.org/10.1037/bul0000151)：192 個遷移效果量、122 個實驗、67 篇文獻、N = 10,382，橫跨四十年研究。整體結果是 d = 0.40（95% CI [0.31, 0.50]），聽起來還行。但拆開看：

> 遷移效果最大的情況是跨測驗格式、應用與推論題、醫學診斷問題、以及中介與相關詞線索；最弱的是重排的刺激—反應項目、初次學習時看過但沒被測的材料、以及涉及範例解題的問題。調節分析進一步顯示，**答案重疊性（response congruency）、精緻化提取練習、以及初次測驗表現，都強烈影響正向遷移的可能性。**

而最關鍵的一句在後面：作者用 PET-PEESE 等方法校正發表偏誤後，「截距預測值大幅下降，**在上述調節條件皆不存在時，往往顯示沒有正向遷移**」。原文正文講得更直白——發表偏誤檢定高度顯著（p < .0001），而「代表兩個調節效果都不存在時之估計效果量的截距，實質上為零」。

這裡要分清楚兩套數字，因為它們來自不同分析。**隨機效果模型**：沒有答案重疊時 d = 0.28，有重疊時再加 0.30，得到 0.58。**校正發表偏誤之後（PEESE）**：截距實質為零，答案重疊帶來的增幅是 0.36、精緻化提取練習是 0.18。兩套都指向同一件事——遷移效果有很大一部分其實是「練習題和考題的答案有交集」。

更直接的一擊來自 [Agarwal 2019 年的研究](https://pdf.poojaagarwal.com/Agarwal_2019_JEdPsych.pdf)，它讓中學生與大學生分別用事實題、高階題、或混合題做提取練習。原文摘要寫得很不留情：

> 關鍵在於，高階題與混合題測驗提升了高階測驗表現，但事實題測驗沒有。與關於高階學習與 Bloom 分類法的普遍直覺相反，透過事實型提取練習建立知識基礎，可能不如直接進行高階提取練習來得有效。

而且這個失效是雙向的——論文內文指出，實驗一裡用高階題練習對延遲後的**事實**測驗同樣沒有幫助。兩種錯配都退回到跟單純重讀無異的水準。Agarwal 把這解釋為 transfer-appropriate processing：練習與測驗的形式對得上，效果才出得來。

同樣的模式出現在更上位的層次。[Donker 等人 2014 年的策略教學 meta-analysis](https://daneshyari.com/article/preview/355102.pdf)（95 個介入、180 個效果量）確實找到不錯的效果——寫作 g = 1.25、科學 0.73、數學 0.66、閱讀理解 0.36。但同一批研究者的報告明講：**針對近遷移設計的策略教學，比針對遠遷移的更有效。**

誠實的結論是：這些技術很有效，但**它們的有效性比你以為的更綁定在你練的那個東西上**。要遷移，就得刻意把練習設計得接近你真正想做到的事——這也順便解釋了為什麼「刷 LeetCode 刷成神」和「能設計系統」是兩件事。

## 已經可以丟掉的，與正在翻案的

**學習金字塔可以直接丟。** 那個「讀書記得 10%、聽講 20%……實做 90%」的三角形，數字是憑空捏造的。[Subramony、Molenda、Betrus 與 Thalheimer 在 2014 年做了完整考證](https://www.worklearning.com/2015/01/05/mythical-retention-data-the-corrupted-cone)：Edgar Dale 的 Cone of Experience 原圖沒有任何百分比，而且 Dale 的原意是描述性分類，不是教學處方；那些數字大約在 1970 年前後被不明人士貼了上去。NTL Institute 被追問來源時的回信是他們相信數字準確，但已經找不到、也拿不出原始研究。[Strathclyde 大學的記憶研究者的評語](https://www.strath.ac.uk/humanities/education/blog/remembering90percentofwhatyoudo)更乾脆：從沒見過任何控制良好的實驗顯示一種學習法能比另一種好九倍。

**學習風格比較麻煩，因為它正在翻案。** 主流定論來自 [Pashler、McDaniel、Rohrer 與 Bjork 的 2008 年檢視](https://vu.nl/en/employee/didactics/learning-styles-debunked-what-does-work)：看過 70 多篇研究後，找不到證據支持匹配假說。這幾乎是所有科普文章的版本。

但 2024 年 7 月，Clinton-Lisell 與 Litzinger 在 Frontiers in Psychology 發表 [Is it really a neuromyth? A meta-analysis of the learning styles matching hypothesis](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1428732/full)，專門只收「有比較匹配 vs 不匹配教學」的研究，得到 21 篇、101 個效果量、1,712 名參與者：

> 基於穩健變異數估計，匹配教學到學習風格整體上有益處，g = 0.31，SE = 0.12，95% CI = [0.05, 0.57]，p = 0.02。然而，只有 26% 的學習結果測量顯示至少兩種風格都從匹配教學中獲益，即呈現支持匹配假說的交叉交互作用。

誠實的講法是：**證據不是零，但也遠不到值得為它改變教學設計。** 這不只是我的判斷，是該文自己的結論——作者把 g = 0.31 拿去對比單純的 modality effect（g = 0.70），指出 I² = 91.17 的異質性，並權衡匹配所需的教師時間成本與把學生標籤化的風險後，仍不建議實務採用。

**成長心態是同一種病的第三個案例。** [Sisk 等人 2018 年在 Psychological Science 發表的兩份 meta-analysis](https://englelab.gatech.edu/articles/2018/Sisk,%20Burgoyne%20et%20al.%20(2018)%20-%20Mindset%20and%20Academic%20Achievement.pdf) 是目前最完整的檢驗：心態與學業成就的相關是 r ≈ 0.10（129 個研究、N = 365,915，約 1% 的變異量）；心態介入對學業成就的效果是 d = 0.08（43 個研究、N = 57,155）。更難堪的是，**那些操作檢核成功的介入——也就是真的成功改變了學生心態的那些——對學業成就反而沒有顯著效果。** Dweck 與 Yeager [在 2020 年回應](https://pmc.ncbi.nlm.nih.gov/articles/PMC8299535)，主張 Sisk 的 I² 高達 96.29%，效果真實但高度依賴人與情境，並指出低社經地位與學業風險學生確實受益（這點 Sisk 自己也承認）。雙方的共識是：效果小且異質。爭的是這樣算不算重要。

這三個案例的共同結構值得記下來：**直覺上太合理、傳播速度遠快於驗證速度、效果量小到需要 meta-analysis 才看得出來。** 下次看到符合這三條的教育主張，先打折。

## 一萬小時：一場定義之爭，不是數字之爭

[Macnamara、Hambrick 與 Oswald 2014 年的 meta-analysis](https://hhs.purdue.edu/skill-learning-and-performance-lab/wp-content/uploads/sites/43/2024/08/macnamara-et-al-2014-deliberate-practice-and-performance-in-music-games-sports-education-and-professions-a-meta-analysis.pdf) 常被拿來「打臉一萬小時」。它算出刻意練習能解釋的表現變異量是：遊戲 26%、音樂 21%、運動 18%、教育 4%、專業工作不到 1%（後者 r = .05、p = .62，不顯著）。

補一件幾乎沒人提、但**不該被誇大**的事：該文在 2018 年發過[更正啟事](https://doi.org/10.1177/0956797618769891)，主模型的平均相關從 r = .35（95% CI [.30, .39]）修正為 .38（[.33, .42]），整體解釋變異量從 12% 上修。不過作者在更正文裡把話講得很明白——改用 Cheung 與 Chan 的方法重算後「對結果沒有實質影響，這些變動對我們的發現與結論的實質內容毫無衝擊」。更正表列的是主模型；上列各領域百分比出自原文正文。提它不是要推翻什麼，只是引用時該用更正後的數字。

但 Ericsson 陣營的[反駁](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.02396/full)也有分量：他們重新篩選後算出 r = 0.54、約 29% 的變異量，並主張 Macnamara 納入的研究裡有很多根本沒採用 Ericsson 對「刻意練習」的原始定義——例如把護理系學生上課與研討會的時數算成練習量。[Harwell 與 Southwick (2021)](https://yale.cloud-cme.com/assets/YALE/pdf/Harwell_Southwick%20beyond%2010,000%20hours%20copy.pdf) 補了一刀：社會與人格心理學文獻中 708 個 meta-analytic 相關係數的平均解釋變異量只有 3–4%，用「沒超過 50% 就算失敗」當標準本身就不合理。

兩邊的數字不能直接比，因為測的不是同一件事。可以帶走的結論是：練習量重要但遠非全部，而且**領域愈結構化、可預測（樂器、跑步），練習量的解釋力愈高；愈開放的領域（專業工作），解釋力愈低。** 這對工程師的啟示不太舒服：軟體工程比較接近「專業工作」那一欄。

## AI 時代：它移除的正是「必要的困難」

這是這個題目在 2026 年最值得重講一次的理由，而且要從一件事開始講——**AI 教育界被引用最多的那份證據，已經被撤稿了。**

2025 年 5 月，Wang 與 Fan 在 Springer Nature 旗下的 *Humanities and Social Sciences Communications* 發表一篇 meta-analysis，統合 51 個研究，結論是 ChatGPT 對學習表現有「大幅正向影響」，g = 0.867。這個數字後來被政策簡報、教育科技行銷、無數論文引用。[到撤稿前它累積約 486,000 次瀏覽、266 篇引用、Altmetric 分數約 1,023](https://www.edtechinnovationhub.com/news/highly-cited-meta-analysis-claiming-chatgpt-boosts-student-learning-retracted-over-data-concerns)。

2026 年 4 月 22 日，[期刊發出撤稿公告](https://www.nature.com/articles/s41599-026-07310-z)：

> 編輯決定撤回本文，原因是對該 meta-analysis 中的差異存有疑慮。這些疑慮最初由 Magnus Ingebrigtsen 與 Marko Lukic 提出。綜合而言，所發現的問題削弱了編輯對該分析效度及其結論的信心。作者未回應關於本次撤稿的通信。

引用它的兩百多篇論文不會跟著被撤。這件事本身就是本文主題的元層次示範：**流暢、好聽、可引用，不等於真的。**

但不要因此走到另一個極端。**正向結論本身沒有被這次撤稿推翻。** 同一份期刊在 2026 年刊出[另一篇 meta-analysis](https://www.nature.com/articles/s41599-026-07019-z)，統合 35 個研究、134 個效果量，得到 g = 0.670（95% CI [0.495, 0.844]），且偏誤檢定未發現顯著發表偏誤；[IRRODL 的 22 研究 meta](https://www.irrodl.org/index.php/irrodl/article/view/8775) 得到 g = 0.573。方向一致，只是效果量比那個 0.867 收斂。

那到底該信誰？我認為問題問錯了——**這些研究跟 Bastani 測的根本是不同的東西**。而這句話不是我的推測：Deng 等人 2025 年發表於 *Computers & Education* 的 meta-analysis 在報告完正向結果後，自己就寫了：

> 然而，方法學上的限制——例如缺乏統計檢定力分析，以及對介入後評量的疑慮——使結果的詮釋需要謹慎。……（建議之一是）區分「ChatGPT 產出的品質」與「介入對學業表現的正向效果」，做法包括把介入後評量從定義良好的問題轉向更複雜、需要展示技能的專案式評量，採用監考評量……

翻成白話：**如果評量的時候 AI 還在手邊，你量到的可能是 AI 的輸出品質，不是學生的學習。** 這正是為什麼真正該問的是「AI 收走之後還剩下什麼」——而有人直接測了。

Bastani 等人 2025 年發表於 PNAS 的隨機對照試驗 [Generative AI without guardrails can harm learning](https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635) 把土耳其近千名高中生分三組做數學練習：一組用接近原生 ChatGPT 的 GPT Base、一組用加了教師設計提示的 GPT Tutor、一組只有課本和筆記。

> 有 GPT-4 可用時解題表現顯著提升（GPT Base 成績提升 48%，GPT Tutor 提升 127%）。然而我們另外發現，當存取權隨後被收走時，學生的表現反而比從未有過存取權的學生更差（GPT Base 成績下降 17%）——也就是說，不受限制的 GPT-4 存取可能危害教育成果。

GPT Tutor 那組的結果同樣值得看：練習時漲了 127%，考試時跟對照組**打平**。「只給提示不給答案」的防護能把傷害抵銷掉，但沒有讓學習變得更好。研究者對此的比喻是自動駕駛——[Hechinger Report 的報導](https://hechingerreport.org/kids-chatgpt-worse-on-tests)提到，作者拿 FAA 建議飛行員減少使用自動駕駛來類比，重點是確保系統失效時人還會飛。

第二個發現更刺：學生完全沒察覺。GPT Base 組考差了，卻不覺得自己學得比較少；GPT Tutor 組沒考得比較好，卻覺得自己表現顯著更佳。這跟開頭那個「重讀感覺有效」是同一個病，只是工具升級了。

兩份常被一起引用、但需要小心的補充材料：

- **MIT Media Lab 的 [Your Brain on ChatGPT](https://www.media.mit.edu/publications/your-brain-on-chatgpt)** 用 EEG 測寫作時的神經連結度，提出 cognitive debt（認知負債）概念，發現 LLM 組連自己剛寫的句子都引用不出來。但樣本只有 54 人（第四場僅 18 人完成），且未經同儕審查。[官方專案頁的 FAQ](https://www.media.mit.edu/projects/your-brain-on-chatgpt/overview) 特別列了一段請求媒體不要使用 "brain damage"、"brain rot" 這類字眼，因為論文根本沒用這種詞彙。方向可以引，強度不能放大。
- **[The Memory Paradox](https://arxiv.org/abs/2506.11015)（arXiv:2506.11015）** 走得更遠，把 Flynn effect 的反轉跟認知卸載連在一起。作者群正是 Oakley 與 Sejnowski——同樣兩個人，十年前教你怎麼建立內部記憶，現在在論證為什麼 AI 時代更需要它。**但這條推論鏈需要拆開檢查。** 反轉本身是真的：[Bratsberg 與 Rogeberg 2018 年在 PNAS 分析了 73 萬名以上挪威役男](https://www.pnas.org/doi/10.1073/pnas.1718793115)（1962–1991 年出生），IQ 在 1975 年出生世代達到頂點後逐年下降，而且**在家族內部也成立**——弟弟考得比哥哥低——這個設計乾淨地排除了基因與移民因素。但同一批作者在[自己撰寫的科普說明](https://www.thesciencebreaker.org/en/breaks/psychology/norwegian-iq-scores-are-falling-but-genes-are-not-to-blame)裡寫得很清楚：「我們的分析並未指出這些潛在的環境成因究竟是什麼。那仍是未來研究的課題。」把它接到認知卸載，是 Oakley 的推測，不是那份研究支持的結論。

把這幾份放在一起，可操作的規則其實很簡單：**AI 讓你在該困難的地方變順，而順就是學不到東西的訊號。** 先自己做，再問 AI——Kosmyna 研究裡從 brain-only 換到 LLM 的那組表現最好，Bastani 的 GPT Tutor 防護也是同一個原理：把 AI 放在提示的位置，不要放在答案的位置。

## 整體來說

如果只帶走一件事：**這門課的價值不在它的神經科學，而在它把「不要相信自己的流暢感」做成了可執行的日常流程。**

具體的取捨：

- **可以直接照做**：自我測驗取代重讀、把複習分散開來。這兩個是十法評比裡唯二的高效用，多份 meta-analysis 撐著——但預期值該往下修（2026 年的系統性回顧給的是 0.22–0.46，不是 0.5–0.7），而且材料愈複雜效果愈弱。
- **練習要長得像目標**：遷移不是免費的。答案重疊性是最強的調節變項，用事實題練習去考高階題等於沒練。想遷移就把練習設計得接近真正要做的事。
- **要看情況**：交錯練習——視覺材料和數學題有效，說明文和單字別亂用。
- **可以丟掉**：學習金字塔的百分比、VAK 匹配、以及對成長心態介入的高期待（d = 0.08）。
- **當成比喻用**：focused / diffuse mode、番茄鐘。行為建議留著，神經學說法別拿去跟人爭論。
- **AI 時代的新規則**：先自己卡一次，再開 AI。把它放在提示位置。

最後一個帶不走但值得記住的：這個領域的元研究幾乎都以「保留度」為結果變項，對創造力與判斷力的證據薄得多。而 2026 年那份被撤稿的 meta-analysis 提醒了一件事——**連「有證據」本身都需要查證。** 一篇被引用兩百多次、瀏覽近五十萬次的論文可以是錯的，而引用它的文章不會跟著更正。這剛好就是這門課想教你的那個習慣，只是應用在它自己身上。

## 參考資料

每條標註**取用層級**，因為這篇文章的主題就是「別把二手轉述當事實」：

- **【一手】** 已讀原始論文全文、官方公告或官方頁面
- **【摘要】** 僅取用官方摘要或出版商頁面，未讀全文
- **【轉引】** 經他人論文或可靠二手轉述，未取得原文
- **【未驗證】** 找不到獨立出處，引用前請自行查證

未經我核實的 DOI 一律不列。

### 課程與核心概念

- 【一手·官方】Deep Teaching Solutions. *Learning How to Learn: Powerful mental tools to help you master tough subjects*. Coursera. 取用日 2026-08-04（註冊數 4,175,377、4.8 分／93,136 則評價為當日即時數字，會變動）。<https://www.coursera.org/learn/learning-how-to-learn>
- 【一手·官方】Temporal Dynamics of Learning Center, UC San Diego. *MOOC: Learning How to Learn*. <https://tdlc.ucsd.edu/tdlc2/news_LHTL_MOOC.php> — 2014 年 8 月首期 19.7 萬人／206 國，此數字僅此一個官方出處。
- 【二手·新聞】Markoff, J. (2015-12-29). The Most Popular Online Course Teaches You to Learn. *The New York Times*, Bits blog. <https://archive.nytimes.com/bits.blogs.nytimes.com/2015/12/29/the-most-popular-online-course-teaches-you-to-learn> — 119 萬註冊數與「完課率 >20%」皆出自對 Sejnowski 的訪談自述。
- 【**未驗證**】Oakley, B. (2014). *A Mind for Numbers*. TarcherPerigee. — 文中所引「diffuse mode 註腳」**未經紙本核對**，全網唯一可查轉錄：[Psychology Stack Exchange #18292](https://psychology.stackexchange.com/questions/18292/does-mindful-meditation-inhibit-diffuse-thinking-aka-default-mode-network-cre)
- 【二手·科普】*Know Your Brain: Default Mode Network*. Neuroscientifically Challenged. <https://neuroscientificallychallenged.com/posts/know-your-brain-default-mode-network>
- 【二手】Farnam Street. *Focused and Diffuse: Two Modes of Thinking*. <https://fs.blog/focused-diffuse-thinking>
- 【一手】Cowan, N. (2001). The magical number 4 in short-term memory: A reconsideration of mental storage capacity. *Behavioral and Brain Sciences*, 24, 87–185.
- 【一手·PDF】Cowan, N. (2010). [The Magical Mystery Four: How is working memory capacity limited, and why?](https://nschwartz.yourweb.csuchico.edu/4.%20Magical%20mystery%204%20cowan.pdf) *Current Directions in Psychological Science*.
- 【一手】[Modelling Working Memory Capacity: Is the Magical Number Four, Seven, or Does it Depend on What You Are Counting?](https://journalofcognition.org/articles/10.5334/joc.387) *Journal of Cognition*. DOI: 10.5334/joc.387
- 【一手】Biwer, F., Wiradhany, W., oude Egbrink, M. G. A., & de Bruin, A. B. H. (2023). [Understanding effort regulation: Comparing 'Pomodoro' breaks and self-regulated breaks](https://bpspsychub.onlinelibrary.wiley.com/doi/10.1111/bjep.12593). *British Journal of Educational Psychology*, 93(2), 353–367. DOI: 10.1111/bjep.12593 — 自我調節 n=35、番茄鐘（24+6 分）n=25、短間隔（12+3 分）n=27。

### 學習技術的效果量

- 【一手·PDF】Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). [Improving Students' Learning With Effective Learning Techniques](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266). *Psychological Science in the Public Interest*, 14(1), 4–58. DOI: 10.1177/1529100612453266（[全文 PDF](https://www.whz.de/fileadmin/lehre/hochschuldidaktik/docs/dunloskiimprovingstudentlearning.pdf)）
- 【摘要】Rowland, C. A. (2014). [The effect of testing versus restudy on retention: A meta-analytic review of the testing effect](https://doi.org/10.1037/a0037559). *Psychological Bulletin*, 140(6), 1432–1463. DOI: 10.1037/a0037559
- 【摘要 + 轉引】Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). [Rethinking the Use of Tests: A Meta-Analysis of Practice Testing](https://doi.org/10.3102/0034654316689306). *Review of Educational Research*, 87(3), 659–701. DOI: 10.3102/0034654316689306 — 文中「vs 重讀 +0.51、vs 無活動 +0.93」轉引自[該文結果之二手整理](https://theeconomyofmeaning.com/2017/03/21/important-new-meta-analysis-on-the-testing-effect-with-some-surprises)；「合併 g = 0.61 [0.58, 0.65]」轉引自 [Educational Psychology Review 的後續 meta 綜述](http://www.lscp.net/persons/ramus/docs/EPR20.pdf)；「回饋只略優於無回饋」轉引自 [The Learning Scientists](https://www.learningscientists.org/blog/2017/2/9-1)。**我未讀 Adesope 原文全文——SAGE 為付費牆，ResearchGate 與 academia.edu 皆無法取得內文。** 為降低風險，改以三位獨立、確實讀過原文者的紀錄交叉比對：
    - [Pedro De Bruyckere, *Important new meta-analysis on the testing effect — with some surprises*](https://theeconomyofmeaning.com/2017/03/21/important-new-meta-analysis-on-the-testing-effect-with-some-surprises)（教育研究者；直接引述原文段落，文中格式／次數／時機的引文出自此處；其留言區指出該文以 Fail-safe N 檢驗發表偏誤之缺陷，援引 Fergusson & Heene 2012）
    - [Yana Weinstein, *New Meta-analysis of 217 Retrieval Practice Studies*, The Learning Scientists](https://www.learningscientists.org/blog/2017/2/9-1)（認知心理學家；回饋效果、中學生效果最大、fail-safe 需打折）
    - [Wing Institute, *How Effective Are Practice Tests?*](https://www.winginstitute.org/news/effective-practice-tests)（獨立確認 0.51 / 0.93）
    - 另有 Dietrichson et al. (2026) 系統性回顧對該文的詳細轉述（回饋、測驗次數、格式匹配）。
    **研究數量的計數彼此不一致**：De Bruyckere 引原文為「272 個獨立效果、188 個實驗」，Learning Scientists 標題作「217 個研究」。此差異我無法排解。
- 【一手·PDF】Dietrichson, J., Seerup, J. K., Bondebjerg Mølgaard, A., Kildemoes, M. W., Schytt, F. L. W., Vembye, M., Bengtsen, E., Viinholt, B. C. A., & Thomsen, M. K. (2026). [Testing frequency and student achievement: A systematic review](https://edworkingpapers.com/ai26-1418). EdWorkingPaper No. 26-1418, Annenberg Institute at Brown University. DOI: 10.26300/jas3-2b83 — **尚未經同儕審查的工作論文。** 0.22 / 0.46 兩個數字與「材料愈複雜效果愈差」已對照 PDF 本文確認；作者同時指出各回顧量值難以直接比較，且以 Kraft (2020) 標準衡量其效果量並不小。
- 【摘要】van Gog, T., & Sweller, J. (2015). [Not New, but Nearly Forgotten: The Testing Effect Decreases or even Disappears as the Complexity of Learning Materials Increases](https://link.springer.com/article/10.1007/s10648-015-9310-x). *Educational Psychology Review*, 27(2), 247–264. DOI: 10.1007/s10648-015-9310-x
- 【摘要】Karpicke, J. D., & Aue, W. R. (2015). [The Testing Effect Is Alive and Well with Complex Materials](https://eric.ed.gov?id=EJ1062040). *Educational Psychology Review*, 27(2), 317–326. — 對上一篇的正面反駁。
- 【轉引】Rawson, K. (2015). The Status of the Testing Effect for Complex Materials: Still a Winner. *Educational Psychology Review*, 27. — 同一期的第二篇反駁，我僅見他人轉述。
- 【摘要】Brunmair, M., & Richter, T. (2019). [Similarity matters: A meta-analysis of interleaved learning and its moderators](https://doi.org/10.1037/bul0000209). *Psychological Bulletin*, 145(11), 1029–1052. DOI: 10.1037/bul0000209
- 【一手·PDF】Kim, A. S. N., Wong-Kee-You, A. M. B., Wiseheart, M., & Rosenbaum, R. S. (2019). [The spacing effect stands up to big data](https://www.yorku.ca/ncepeda/publications/KWWR2019.pdf). *Behavior Research Methods*, 51(4), 1485–1497. DOI: 10.3758/s13428-018-1184-7
- 【一手·PDF】Karpicke, J. D., Butler, A. C., & Roediger, H. L. III (2009). [Metacognitive strategies in student learning: Do students practise retrieval when they study on their own?](https://learninglab.psych.purdue.edu/downloads/2009/2009_Karpicke_Butler_Roediger.pdf) *Memory*, 17(4), 471–479. DOI: 10.1080/09658210802647009

### 遷移

- 【一手·全文 PDF】Pan, S. C., & Rickard, T. C. (2018). [Transfer of test-enhanced learning: Meta-analytic review and synthesis](https://doi.org/10.1037/bul0000151). *Psychological Bulletin*, 144(7), 710–756. DOI: 10.1037/bul0000151（[PDF](https://pdf.retrievalpractice.org/transfer/Pan_Rickard_2018.pdf)）— 192 個遷移效果量／122 實驗／67 篇／N = 10,382。文中隨機效果模型（0.28 / +0.30 / 0.58）與 PEESE 校正結果（截距實質為零、+0.36、+0.18）皆已對照原文正文確認。
- 【一手·PDF】Agarwal, P. K. (2019). [Retrieval practice & Bloom's taxonomy: Do students need fact knowledge before higher order learning?](https://pdf.poojaagarwal.com/Agarwal_2019_JEdPsych.pdf) *Journal of Educational Psychology*, 111(2), 189–209. DOI: 10.1037/edu0000282（[ERIC 記錄](https://eric.ed.gov?id=EJ1205208)）
- 【一手·PDF】Donker, A. S., de Boer, H., Kostons, D., Dignath van Ewijk, C. C., & van der Werf, M. P. C. (2014). [Effectiveness of learning strategy instruction on academic performance: A meta-analysis](https://daneshyari.com/article/preview/355102.pdf). *Educational Research Review*, 11, 1–26.

### 迷思、翻案與爭議

- 【轉引】Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R. (2008). Learning Styles: Concepts and Evidence. *Psychological Science in the Public Interest*, 9(3), 105–119. — 我僅取用[二手整理頁](https://vu.nl/en/employee/didactics/learning-styles-debunked-what-does-work)，未讀原文。
- 【一手·全文】Clinton-Lisell, V., & Litzinger, C. (2024). [Is it really a neuromyth? A meta-analysis of the learning styles matching hypothesis](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1428732/full). *Frontiers in Psychology*, 15. DOI: 10.3389/fpsyg.2024.1428732 — 21 研究／101 效果量／N = 1,712。
- 【一手】Thalheimer, W. (2015). [Mythical Retention Data & The Corrupted Cone](https://www.worklearning.com/2015/01/05/mythical-retention-data-the-corrupted-cone). Work-Learning Research. — 整理 Subramony、Molenda、Betrus 與 Thalheimer 2014 年於 *Educational Technology* 的四篇專輯考證。
- 【一手·官方】University of Strathclyde. [Remembering 90% of What You Do?](https://www.strath.ac.uk/humanities/education/blog/remembering90percentofwhatyoudo)
- 【一手·PDF】Sisk, V. F., Burgoyne, A. P., Sun, J., Butler, J. L., & Macnamara, B. N. (2018). [To what extent and under which circumstances are growth mind-sets important to academic achievement? Two meta-analyses](https://englelab.gatech.edu/articles/2018/Sisk,%20Burgoyne%20et%20al.%20(2018)%20-%20Mindset%20and%20Academic%20Achievement.pdf). *Psychological Science*, 29(4), 549–571. DOI: 10.1177/0956797617739704
- 【一手·全文】Yeager, D. S., & Dweck, C. S. (2020). [What Can Be Learned from Growth Mindset Controversies?](https://pmc.ncbi.nlm.nih.gov/articles/PMC8299535) *American Psychologist*, 75(9), 1269–1284.
- 【一手·PDF】Macnamara, B. N., Hambrick, D. Z., & Oswald, F. L. (2014). [Deliberate Practice and Performance in Music, Games, Sports, Education, and Professions: A Meta-Analysis](https://hhs.purdue.edu/skill-learning-and-performance-lab/wp-content/uploads/sites/43/2024/08/macnamara-et-al-2014-deliberate-practice-and-performance-in-music-games-sports-education-and-professions-a-meta-analysis.pdf). *Psychological Science*, 25(8), 1608–1618. DOI: 10.1177/0956797614535810
- 【一手】Corrigendum (2018). *Psychological Science*. DOI: [10.1177/0956797618769891](https://doi.org/10.1177/0956797618769891) — 主模型 r 由 .35 修正為 .38。作者於更正文中明言重算「對結果沒有實質影響……對發現與結論的實質內容毫無衝擊」。引用時用更正後數字即可，不必據此質疑該研究。
- 【一手·全文】Ericsson 陣營回應 (2019). *Frontiers in Psychology*. <https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.02396/full> DOI: 10.3389/fpsyg.2019.02396
- 【一手·PDF】Harwell, K. W., & Southwick, D. (2021). [Beyond 10,000 Hours](https://yale.cloud-cme.com/assets/YALE/pdf/Harwell_Southwick%20beyond%2010,000%20hours%20copy.pdf).

### AI 與學習

- 【一手·全文】Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, Ö., & Mariman, R. (2025). [Generative AI without guardrails can harm learning: Evidence from high school mathematics](https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635). *PNAS*, 122(26), e2422633122. DOI: 10.1073/pnas.2422633122 — 另有 2025-08-20 之作者單位更正啟事（不影響結果）。
- 【二手】[Without Guardrails, Generative AI Can Harm Education — Knowledge at Wharton](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education)；[Kids who use ChatGPT as a study assistant do worse on tests — Hechinger Report](https://hechingerreport.org/kids-chatgpt-worse-on-tests)（自動駕駛／FAA 類比之出處）
- 【一手·官方】Wang, J., & Fan, W. (2026). [Retraction Note: The effect of ChatGPT on students' learning performance, learning perception, and higher-order thinking: insights from a meta-analysis](https://www.nature.com/articles/s41599-026-07310-z). *Humanities and Social Sciences Communications*, 13, 528. 撤稿日 2026-04-22；公告於 2026-07-02 更新，補列提出疑慮者 Magnus Ingebrigtsen 與 Marko Lukic。
- 【一手·官方】被撤稿之原文（頁面已標記 RETRACTED）：Wang & Fan (2025). *Humanit Soc Sci Commun*, 12, 621. DOI: 10.1057/s41599-025-04787-y <https://www.nature.com/articles/s41599-025-04787-y>
- 【二手·新聞】撤稿報導：[EdTech Innovation Hub](https://www.edtechinnovationhub.com/news/highly-cited-meta-analysis-claiming-chatgpt-boosts-student-learning-retracted-over-data-concerns)（486,000 次瀏覽／266 引用／Altmetric 1,023）、[GovTech](https://www.govtech.com/education/nature-retracts-oft-cited-paper-on-positive-impact-of-chatgpt)、[NEPC 轉載 404 Media](https://nepc.colorado.edu/blog/nature-publisher)。**三方報導的瀏覽數與引用數略有出入（485k–498k、262–275 引用），此處採 EdTech Innovation Hub 版本。**
- 【一手·全文】[ChatGPT's impact on student learning outcomes: a meta-analysis](https://www.nature.com/articles/s41599-026-07019-z). *Humanities and Social Sciences Communications* (2026). — 未撤稿；35 研究／134 效果量，g = 0.670，95% CI [0.495, 0.844]。
- 【摘要】Deng, R., Jiang, M., Yu, X., Lu, Y., & Liu, S. (2025). [Does ChatGPT enhance student learning? A systematic review and meta-analysis of experimental studies](https://bibbase.org/network/publication/deng-jiang-yu-lu-liu-doeschatgptenhancestudentlearningasystematicreviewandmetaanalysisofexperimentalstudies-2025). *Computers & Education*, 227, 105224. — 文中引用的是**該文摘要原句**（介入後評量的疑慮、建議採監考評量）。此前版本曾引用 g+ = 0.712，該數字來源為 Academia.edu 的 AI 生成摘要、無法核實，已移除。
- 【摘要】[A Meta-Analysis of ChatGPT's Influence on Learning Achievement](https://www.irrodl.org/index.php/irrodl/article/view/8775). *IRRODL* (2025). — 22 研究，g = 0.573。
- 【一手·官方 + 未同儕審查】Kosmyna, N., et al. (2025). [Your Brain on ChatGPT](https://www.media.mit.edu/publications/your-brain-on-chatgpt). MIT Media Lab, arXiv:2506.08872. — n = 54（第四場僅 18 人完成）；[官方專案頁列有媒體用語限制聲明](https://www.media.mit.edu/projects/your-brain-on-chatgpt/overview)。
- 【一手·未同儕審查】Oakley, B., et al. (2025). [The Memory Paradox](https://arxiv.org/abs/2506.11015). arXiv:2506.11015. — Springer 專書章節之預印本；屬論證，非實證因果。
- 【一手·全文】Bratsberg, B., & Rogeberg, O. (2018). [Flynn effect and its reversal are both environmentally caused](https://www.pnas.org/doi/10.1073/pnas.1718793115). *PNAS*, 115(26), 6674–6678. DOI: 10.1073/pnas.1718793115 — 730,000+ 挪威役男，1962–1991 出生世代。
- 【一手·作者撰文】Bratsberg & Rogeberg. [Norwegian IQ scores are falling – but genes are not to blame](https://www.thesciencebreaker.org/en/breaks/psychology/norwegian-iq-scores-are-falling-but-genes-are-not-to-blame). TheScienceBreaker. — 「本分析未指出環境成因為何」一語之出處。

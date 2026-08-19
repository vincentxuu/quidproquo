---
title: "Learning How to Learn：拆解 417 萬人修過的學習課，哪些站得住、哪些是比喻"
date: 2026-08-04
updated: 2026-08-04
category: learning
type: deep-dive
difficulty: 進階
tags: [learning-science, self-learning, retrieval-practice, spaced-repetition, metacognition]
lang: zh-TW
series:
  name: "Learning How to Learn"
  order: 1
tldr: "Dunlosky 2013 評比 10 種學習技術，判定為高效用的只有自我測驗與分散練習；學生最愛的重讀落在低效用層。但 2026 年的系統性回顧把效果量壓到 0.22–0.46，而 Pan & Rickard 的遷移 meta 校正發表偏誤後「往往顯示零遷移」——整套框架的名字本身，是被測得最不好看的一塊。"
description: "拆解 Coursera「Learning How to Learn」的核心概念與背後證據：哪些有 meta-analysis 撐、哪些只是好用的心智模型、哪些已被推翻、哪些正在被更嚴謹的方法修正。"
draft: false
faq:
  - q: "重讀課本到底有沒有用？"
    a: "效果不好，而且是學生最常用的方法。Dunlosky 等人 2013 年評比 10 種學習技術，重讀被歸在「低效用」層。而 Karpicke、Butler 與 Roediger 2009 年對 177 名大學生的調查顯示，84% 的學生說自己會重讀、55% 把它列為第一順位策略。問題出在重讀「感覺」有效——第二遍讀起來比第一遍順，而那份流暢感會被誤讀成學會了。改用自我測驗，效果量相較重讀約為 +0.51。"
  - q: "自我測驗的效果到底多大？"
    a: "看你拿它跟什麼比。相較重讀約 +0.51，相較完全不複習約 +0.93，跨所有對照條件合併約 g = 0.61。2026 年一份更嚴謹的系統性回顧給出較低的 0.22（組間設計）到 0.46（組內設計）。引用任何一個數字時都要講清楚對照組是誰，否則同一篇研究可以被引成完全不同的強度。"
  - q: "學習風格（視覺型、聽覺型）是不是迷思？"
    a: "主流結論仍是「不值得為它改變教學」，但證據不是零。Pashler 等人 2008 年檢視 70 多篇研究後找不到支持；2024 年 Clinton-Lisell 與 Litzinger 只收「有比較匹配與不匹配教學」的研究，得到 g = 0.31 且統計顯著。不過該文作者自己也不建議實務採用——只有 26% 的測量呈現支持匹配假說所需的交叉交互作用，異質性 I² 高達 91.17。"
  - q: "學會了學習方法，能用到別的領域嗎？"
    a: "比想像中難。Pan 與 Rickard 2018 年的遷移 meta-analysis 整體 d = 0.40，但校正發表偏誤後，在缺乏調節條件時「往往顯示沒有正向遷移」。最強的調節變項是答案重疊性——練習題與考題的答案有交集時效果才明顯。Agarwal 2019 更直接：用事實題做提取練習、再考高階思考題，表現跟單純重讀沒有差別。要遷移，就得把練習設計得接近真正要做的事。"

glossary:
  - term: "meshing hypothesis"
    aliases: ["匹配假說", "學習風格匹配"]
    definition: "主張把教學方式配合學生偏好的「學習風格」（視覺／聽覺／動覺）就能提升學習成效。"
    advanced: "要成立需要出現 crossover interaction：視覺型學生在視覺教學下較好，且聽覺型學生在聽覺教學下較好。單純「某組表現比較好」不算數。"
    context: "本文討論它從 2008 年被判定為迷思、到 2024 年出現部分翻案的過程。"
  - term: "response congruency"
    aliases: ["答案重疊性"]
    definition: "練習測驗與最終測驗的正確答案有多少重疊。"
    advanced: "Pan & Rickard 的遷移 meta 中最強的調節變項。隨機效果模型：無重疊時 d = 0.28，有重疊時增加 0.30 至 0.58；校正發表偏誤後（PEESE）截距實質為零，重疊帶來的增幅為 0.36。"
    context: "本文用它說明為什麼「練了會遷移」這個假設比想像中脆弱。"
---

> 🌏 [English version](/posts/learning/2026-08-04-learning-how-to-learn-en)
>
> 本文是「Learning How to Learn」上篇，處理學習科學本身的證據。[下篇談 AI 時代](/posts/learning/2026-08-04-generative-ai-and-learning)：生成式 AI 對學習做了什麼，以及那份被引用最多的證據為什麼被撤稿。

Coursera 上有一門課，[官方頁面](https://www.coursera.org/learn/learning-how-to-learn)顯示註冊人數 4,175,377、評分 4.8 分（93,136 則評價）。它叫 Learning How to Learn，由工程學教授 Barbara Oakley 和神經科學家 Terrence Sejnowski 開設，[2014 年 8 月首次開課](https://tdlc.ucsd.edu/tdlc2/news_LHTL_MOOC.php)，第一期就湧入 19.7 萬人、來自 206 個國家。[紐約時報 2015 年底報導](https://archive.nytimes.com/bits.blogs.nytimes.com/2015/12/29/the-most-popular-online-course-teaches-you-to-learn)時，它累積 119 萬人，是當時全球註冊人數最多的 MOOC，險勝 Andrew Ng 的 Machine Learning。

這篇是對帳單：把課教的每個部件拿出來，一項一項對照證據，給出判決。

# 一、這門課是什麼

課程分四個模組，每週一到兩小時：

1. **什麼是學習**——專注模式與發散模式的切換、組塊的初步概念、睡眠如何清除代謝廢物並鞏固記憶。
2. **組塊與能力錯覺**——怎麼把零散步驟壓成一個可整包調用的單元；以及 *illusion of competence*（能力錯覺）：畫線、重讀、跟著解答做一遍，都會讓你覺得學會了。
3. **拖延與記憶**——把拖延解釋成習慣迴路（提示 → 慣性動作 → 獎賞 → 信念），主張改提示與獎賞而非硬拚意志力；番茄鐘在這裡登場，重點是專注於過程而非產出。記憶那半段講工作記憶容量、間隔重複與記憶宮殿。
4. **如何變強**——運動與神經新生、用比喻理解抽象概念、刻意練習、冒牌者症候群，以及一個很具體的考試技巧：hard start–jump to easy（先看最難的題目，卡住立刻跳走）。

課程之所以擴散得這麼快，敘事也有功勞。Oakley 自陳從小數學很爛、大學念語言學、當過通訊兵，二十六歲才回頭學數學與工程——「我不是天才，我是把方法搞對了」對成年自學者的說服力，遠大於任何研究引用。

## 它真正的命題：流暢感在騙你

貫穿四週的核心主張只有一句：**你以為自己在學習的時候，通常沒有在學習。**

2009 年 Karpicke、Butler 與 Roediger [調查了 177 名大學生](https://learninglab.psych.purdue.edu/downloads/2009/2009_Karpicke_Butler_Roediger.pdf)怎麼念書：

> 84% 的學生表示自己會重複閱讀，55% 把重讀列為第一順位策略；只有 11% 明確表示會在讀書時自我測驗，其中僅 1% 是因為相信提取本身能促進學習。

重讀正是後面會被判「低效用」的那一組。學生不是懶——他們在花時間，只是**系統性地選錯**。原因也很清楚：重讀感覺有效，第二遍讀起來比第一遍順，那份流暢感被大腦誤讀成「我學會了」。

整個領域的核心命題因此是：**學習的主觀流暢感，跟長期保留度是反相關的。** 幾乎所有有實證支撐的技術，都長得像「讓當下變難一點」。

## 怎麼讀後面的數字

下面滿滿都是 0.3、0.5、0.9 這種效果量。三條規則就夠用：

1. **0.2 就不小了。** 依 [Kraft (2020)](https://doi.org/10.3102/0013189X20912798) 為教育研究訂的標準，0.2 以上在真實教學場域已經算大。別拿心理學實驗室的直覺去套。
2. **永遠要問「跟什麼比」。** 同一份研究可以同時是 0.51 和 0.93——差別只在對照組是「重讀」還是「什麼都不做」。二手文章通常挑大的那個，而且不告訴你。
3. **平均值不是你會拿到的值。** 這個領域的異質性（I²）動輒 84% 以上，意思是研究之間的差異絕大部分不是抽樣誤差，而是真實的情境差異。

## 判決總表

| 部件 | 判決 | 一句話 |
|---|---|---|
| 自我測驗 | ✅ 照做 | 十法評比唯二高效用；相較重讀 +0.51 |
| 分散練習 | ✅ 照做 | 另一個高效用；間隔一到六天遠優於當天 |
| 交錯練習 | ⚠️ 挑材料 | 數學題型與視覺材料可以，說明文與單字不要 |
| 組塊 | 🔶 概念可用 | 但配套的「7±2」已過時，現代共識是 4±1 |
| 專注／發散模式 | 🔶 當比喻 | 行為建議留著，神經科學說法對不上 DMN 文獻 |
| 番茄鐘 | 🔶 當比喻 | 改善的是體驗與效率，不是學習量 |
| 「學會學習」會遷移 | ❌ 站不住 | 校正發表偏誤後，缺乏調節條件時往往顯示零遷移 |

# 二、逐項判決

2013 年，Dunlosky 等五位研究者在 *Psychological Science in the Public Interest* 發表 [Improving Students' Learning With Effective Learning Techniques](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266)，挑了 10 種學生可以自己用、不需老師監督的技術，逐一評估效果能不能跨學習條件、學生特質、材料類型、測驗形式推廣。結論是一張很不客氣的分層表：

| 效用等級 | 技術 |
|---|---|
| **高** | practice testing（自我測驗）、distributed practice（分散練習） |
| **中** | elaborative interrogation、self-explanation、interleaved practice（交錯練習） |
| **低** | summarization、highlighting、keyword mnemonic、imagery、**rereading（重讀）** |

原文對高效用組的判準寫得很直接：

> 自我測驗與分散練習獲得高效用評價，因為它們對不同年齡與能力的學習者都有幫助，並且已被證明能在許多測驗任務、甚至在真實教育情境中提升學生表現。

以下逐項展開。

## 自我測驗 ✅

**課怎麼教**：課程作業直接命名為 "Retrieval Practice"。闔上書，先把東西默寫出來，再對答案。

**證據怎麼說**：十法評比中的高效用之一。相較重讀約 +0.51（[Adesope et al. 2017](https://doi.org/10.3102/0034654316689306)）。你會在別處看到 0.93 甚至更大，那是跟「完全不複習」比的——用哪個，取決於你本來會做什麼。（五個常見數字的完整對帳在文末附錄。）

**怎麼用**：三個違反直覺但可操作的細節（引自[讀過原文的 Pedro De Bruyckere 的摘錄](https://theeconomyofmeaning.com/2017/03/21/important-new-meta-analysis-on-the-testing-effect-with-some-surprises)）：

> 含選擇題選項的練習測驗，其加權平均效果量（+0.70）大於簡答題（+0.48）。**在最終測驗前做一次練習測驗，比做好幾次更有效。** 不過時機需要仔細考量：練習與最終測驗間隔不到一天的效果量，小於間隔一到六天者（分別為 +0.56 與 +0.82）。

「一次比多次好」和「選擇題贏簡答題」都跟這個領域的常見說法相反——尤其後者，Dunlosky 那條線的文獻多半認為自由回想優於再認。這是**尚未調和的分歧**，不是定論。

## 分散練習 ✅

**課怎麼教**：間隔重複，不要臨時抱佛腳。

**證據怎麼說**：十法評比另一個高效用，也是唯一一個被真實世界大數據驗證過的——[Kim 等人 2019 年](https://www.yorku.ca/ncepeda/publications/KWWR2019.pdf)在實驗室外重測，效應仍然成立。

**怎麼用**：跟上一項的「間隔一到六天 +0.82、當天 +0.56」是同一件事的兩個切面。**你今天讀完、今天再複習一次，拿到的效益大約只有隔幾天再回來的三分之二。**

## 交錯練習 ⚠️

**課怎麼教**：不要一種題型連做二十題，把不同類型混著練。

**證據怎麼說**：十法評比列為「中效用」。[Brunmair 與 Richter 的 meta-analysis](https://doi.org/10.1037/bul0000209) 涵蓋 59 篇研究、238 個效果量，整體 g ≈ 0.42——但標題就把重點講完了，*Similarity matters*。

**怎麼用**：

- **有效**：繪畫等視覺材料、數學題型
- **沒有優於區塊練習**：說明文（expository text）
- **可能有害**：跨類別的單字學習

把「交錯練習」當通用建議是誤讀原文。

## 組塊 🔶

**課怎麼教**：把零散步驟壓成一個可整包調用的單元，並常搭配「工作記憶容納 7±2 個項目」的說法。

**證據怎麼說**：概念本身沒問題，數字過時了。Miller 1956 年的七加減二測的是**可組塊化之後**的量；[Cowan 2001 年提出的 4±1](https://nschwartz.yourweb.csuchico.edu/4.%20Magical%20mystery%204%20cowan.pdf) 測的是組塊本身的數目，現代共識偏向後者（[兩者可以調和](https://journalofcognition.org/articles/10.5334/joc.387)，差別在任務有沒有讓你組塊）。

**怎麼用**：你能同時操作的獨立單元比你以為的少，所以組塊不是加分項，是必要條件。

## 專注／發散模式 🔶

**課怎麼教**：大腦在兩種模式間切換，解不開的題目要放著，讓發散模式在背景跑。這個概念被 [Farnam Street](https://fs.blog/focused-diffuse-thinking) 之類的網站大量轉載，通常配著「神經科學顯示」的說法。

**證據怎麼說**：問題出在神經科學那一側。[預設模式網路（DMN）的標準描述](https://neuroscientificallychallenged.com/posts/know-your-brain-default-mode-network)是，它在需要專注的外向任務中活動**受到抑制**，在靜息、放鬆清醒與內向思考時才升高。「兩個模式同時在背景跑」跟 DMN 的實際行為對不上——它不是在背景加班，它是在你專注時安靜下來。

Oakley 本人似乎處理過這個張力。以下段落流傳很廣，出處被標為《A Mind for Numbers》的註腳，**但我只在 [Psychology Stack Exchange 的一則轉錄](https://psychology.stackexchange.com/questions/18292/does-mindful-meditation-inhibit-diffuse-thinking-aka-default-mode-network-cre)上見過它，全網找不到第二個獨立出處，也沒能核對紙本頁碼——要引用請自行查證原書**：

> 眼尖的讀者會注意到我提過發散模式有時會在專注模式運作時於背景進行。然而研究發現，例如預設模式網路（這只是眾多靜息態網路之一）在專注模式活躍時似乎會安靜下來。那到底是哪一種？……某種意義上，我使用的「發散模式」一詞或許該理解為「朝向學習的非聚焦活動」，而不是單指預設模式網路。

即使把這段完全拿掉，結論仍然成立，因為它靠的是 DMN 文獻本身。

**怎麼用**：保留行為建議（卡住就去散步），丟掉神經學版本。那個建議的支撐來自別的地方。

## 番茄鐘 🔶

**課怎麼教**：25 分鐘專心、5 分鐘休息，重點是專注於過程而非產出——因為讓人拖延的是對產出的焦慮。

**證據怎麼說**：[Biwer 等人 2023 年在 British Journal of Educational Psychology 的對照實驗](https://pmc.ncbi.nlm.nih.gov/articles/PMC12532815)發現，系統性休息（24 分鐘讀 + 6 分鐘休息）相較自我調節休息，專注度與動機較高、疲勞較低、用時較短——**但兩組在投入的心智努力與任務完成量上沒有差異**。

**怎麼用**：它改善的是體驗與效率，不是學習量。可以用，別當成學習技術賣。

## 不在射程內的四項

拖延的習慣迴路、睡眠與記憶鞏固、記憶宮殿與助記法、hard start–jump to easy 考試技巧——這幾項本篇不判決。不是因為它們有問題，而是它們缺乏足以支撐檢驗的 meta-analysis，我給不出比「大概有用」更強的話。

# 三、兩個跨項的大問題

上面是逐項判決。但有兩件事跨越所有項目，而且都比單項判決更重要。

## A. 課名內建的假設站不住

「Learning how to learn」這個名字預設：學會學習法之後，它會跨到別的地方去用。這個假設被測過了，結果不太好看。

[Pan 與 Rickard 2018 年在 Psychological Bulletin 做了第一份完整的遷移 meta-analysis](https://doi.org/10.1037/bul0000151)：192 個遷移效果量、122 個實驗、67 篇文獻、N = 10,382，橫跨四十年研究。整體 d = 0.40（95% CI [0.31, 0.50]），聽起來還行。但拆開看：

> 遷移效果最大的情況是跨測驗格式、應用與推論題、醫學診斷問題、以及中介與相關詞線索；最弱的是重排的刺激—反應項目、初次學習時看過但沒被測的材料、以及涉及範例解題的問題。調節分析進一步顯示，**答案重疊性（response congruency）、精緻化提取練習、以及初次測驗表現，都強烈影響正向遷移的可能性。**

關鍵的一句在後面：校正發表偏誤後（檢定 p < .0001），「截距預測值大幅下降，**在上述調節條件皆不存在時，往往顯示沒有正向遷移**」。

翻成白話：**遷移效果有很大一部分，其實是「練習題和考題的答案有交集」。**

更直接的一擊來自 [Agarwal 2019 年的研究](https://pdf.poojaagarwal.com/Agarwal_2019_JEdPsych.pdf)，它讓中學生與大學生分別用事實題、高階題、或混合題做提取練習：

> 關鍵在於，高階題與混合題測驗提升了高階測驗表現，但事實題測驗沒有。與關於高階學習與 Bloom 分類法的普遍直覺相反，透過事實型提取練習建立知識基礎，可能不如直接進行高階提取練習來得有效。

而且失效是雙向的——論文指出，用高階題練習對延遲後的**事實**測驗同樣沒有幫助。兩種錯配都退回到跟單純重讀無異的水準。Agarwal 把這解釋為 transfer-appropriate processing：練習與測驗的形式對得上，效果才出得來。

同樣的模式出現在更上位的層次。[Donker 等人 2014 年的策略教學 meta-analysis](https://daneshyari.com/article/preview/355102.pdf)（95 個介入、180 個效果量）找到不錯的效果——寫作 g = 1.25、科學 0.73、數學 0.66、閱讀理解 0.36——但同一份報告明講：**針對近遷移設計的策略教學，比針對遠遷移的更有效。**

**這一節的實務結論**：上面每一項判決 ✅ 的技術，效果都比你以為的更綁定在你練的那個東西上。要遷移，就得刻意把練習設計得接近你真正想做到的事。這也順便解釋了為什麼「刷 LeetCode 刷成神」和「能設計系統」是兩件事。

## B. 效果量正在往下修

十法評比那張表現在被引用得非常廣。過去十年，它下面的地基動了三次，寫這題的人幾乎都沒跟上。

**一、平均值底下藏著巨大變異。** [Rowland (2014)](https://doi.org/10.1037/a0037559) 給出 g = 0.50，但 I² = 84.35。

**二、較新、方法更嚴的估計落在低區間。** 2026 年 3 月，Dietrichson 等人發表[一份大規模系統性回顧](https://edworkingpapers.com/ai26-1418)：初篩 102,451 筆記錄、87 個研究符合條件、59 個進入合成。對照組完全不做練習測驗時，效果量是組間設計 0.22（95% CI [0.09, 0.34]）、組內設計 0.46（[0.29, 0.62]）——低於先前回顧（Adesope 在小學與中學的對應數字是 0.64 與 0.83）。

但**「較低」不等於「被推翻」**：作者自己指出各回顧的納入標準與分析策略不同、量值本來就難直接比較，而且以 Kraft 的標準衡量，0.2 以上在教育研究裡已經算大。

**三、材料愈複雜，效果愈弱。** 同一份回顧的探索性分析支持這點，而這正是一場沒打完的仗：[van Gog 與 Sweller 2015 年那篇的標題](https://link.springer.com/article/10.1007/s10648-015-9310-x)就是結論——「testing effect 隨學習材料複雜度上升而下降甚至消失」；Karpicke 與 Aue 同年以〈The testing effect is alive and well with complex materials〉正面反駁，Rawson 也加入戰局，爭點卡在「複雜度」根本難以操作化。看到有人單方面宣稱勝負，就該提高警覺。

**這一節的實務結論**：不是「別做了」，而是**預期值往下修，而且題目愈難、材料愈複雜，愈不能只靠自我測驗。**

# 四、這個領域裡三個已死的主張

它們不在這門課裡，但會跟這門課一起出現在同一批文章、同一場研習裡。

**學習金字塔（讀 10%、聽 20%、實做 90%）——數字是捏造的。**
[Subramony、Molenda、Betrus 與 Thalheimer 在 2014 年做了完整考證](https://www.worklearning.com/2015/01/05/mythical-retention-data-the-corrupted-cone)：Edgar Dale 的 Cone of Experience 原圖沒有任何百分比，且 Dale 的原意是描述性分類、不是教學處方；那些數字大約在 1970 年前後被不明人士貼上去。NTL Institute 被追問來源時回信說他們相信數字準確，但已經找不到、也拿不出原始研究。[Strathclyde 大學記憶研究者的評語](https://www.strath.ac.uk/humanities/education/blog/remembering90percentofwhatyoudo)更乾脆：從沒見過任何控制良好的實驗顯示一種學習法能比另一種好九倍。

**學習風格（視覺型／聽覺型）——證據不是零，但遠不到值得改變教學。**
主流定論來自 [Pashler 等人 2008 年的檢視](https://vu.nl/en/employee/didactics/learning-styles-debunked-what-does-work)：看過 70 多篇研究後找不到支持。但 2024 年 7 月，Clinton-Lisell 與 Litzinger 在 Frontiers in Psychology 發表 [Is it really a neuromyth?](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1428732/full)，只收「有比較匹配 vs 不匹配教學」的研究，得到 21 篇、101 個效果量、1,712 名參與者：

> 基於穩健變異數估計，匹配教學到學習風格整體上有益處，g = 0.31，SE = 0.12，95% CI = [0.05, 0.57]，p = 0.02。然而，只有 26% 的學習結果測量顯示至少兩種風格都從匹配教學中獲益，即呈現支持匹配假說的交叉交互作用。

值得注意的是，**不建議實務採用是該文作者自己的結論**：他們把 g = 0.31 對比單純的 modality effect（g = 0.70），指出 I² = 91.17 的異質性，並權衡匹配所需的教師時間成本與把學生標籤化的風險。

**成長心態——效果小到需要 meta-analysis 才看得見。**
[Sisk 等人 2018 年的兩份 meta-analysis](https://englelab.gatech.edu/articles/2018/Sisk,%20Burgoyne%20et%20al.%20(2018)%20-%20Mindset%20and%20Academic%20Achievement.pdf)：心態與學業成就的相關 r ≈ 0.10（129 個研究、N = 365,915，約 1% 的變異量）；心態介入對學業成就的效果 d = 0.08（43 個研究、N = 57,155）。更難堪的是，**那些操作檢核成功、真的改變了學生心態的介入，對學業成就反而沒有顯著效果。** Dweck 與 Yeager [2020 年的回應](https://pmc.ncbi.nlm.nih.gov/articles/PMC8299535)主張 I² 高達 96.29%、效果真實但高度依賴人與情境，並指出低社經與學業風險學生確實受益（Sisk 也承認這點）。雙方的共識是效果小且異質，爭的是這樣算不算重要。

**共同結構值得記下來**：直覺上太合理、傳播速度遠快於驗證速度、效果量小到需要 meta-analysis 才看得出來。下次看到符合這三條的教育主張，先打折。

# 五、相鄰爭論：一萬小時

[Macnamara、Hambrick 與 Oswald 2014 年的 meta-analysis](https://hhs.purdue.edu/skill-learning-and-performance-lab/wp-content/uploads/sites/43/2024/08/macnamara-et-al-2014-deliberate-practice-and-performance-in-music-games-sports-education-and-professions-a-meta-analysis.pdf) 常被拿來「打臉一萬小時」。刻意練習能解釋的表現變異量是：遊戲 26%、音樂 21%、運動 18%、教育 4%、專業工作不到 1%（後者 r = .05、p = .62，不顯著）。

但 Ericsson 陣營的[反駁](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.02396/full)也有分量：他們重新篩選後算出 r = 0.54、約 29% 的變異量，並主張 Macnamara 納入的研究裡很多根本沒採用 Ericsson 對「刻意練習」的原始定義——例如把護理系學生上課與研討會的時數算成練習量。[Harwell 與 Southwick (2021)](https://yale.cloud-cme.com/assets/YALE/pdf/Harwell_Southwick%20beyond%2010,000%20hours%20copy.pdf) 補了一刀：社會與人格心理學文獻中 708 個 meta-analytic 相關係數的平均解釋變異量只有 3–4%，用「沒超過 50% 就算失敗」當標準本身就不合理。

兩邊的數字不能直接比，因為測的不是同一件事。可以帶走的是：練習量重要但遠非全部，而且**領域愈結構化、可預測（樂器、跑步），練習量的解釋力愈高；愈開放的領域（專業工作），解釋力愈低。** 這對工程師的啟示不太舒服：軟體工程比較接近「專業工作」那一欄。

# 六、整體來說

如果只帶走一件事：**這門課的價值不在它的神經科學，而在它把「不要相信自己的流暢感」做成了可執行的日常流程。** 課程作業直接命名為 "Retrieval Practice"——這比它講的任何神經科學都重要。

還有一個帶不走、但值得記住的限制：這個領域的元研究幾乎都以「保留度」為結果變項，對創造力、判斷力與遷移的證據薄得多。

至於這些原則進了 LLM 時代會怎樣——以及為什麼 AI 教育界被引用最多的那份證據在 2026 年 4 月被撤稿——是[下篇](/posts/learning/2026-08-04-generative-ai-and-learning)的事。

# 附錄與來源

## 附錄：我對這些數字的保留

正文為了好讀，每個數字只給了一個版本。這節放完整的帳，因為這篇文章的主題就是「別把二手轉述當事實」。

**自我測驗的效果量有多個常見版本，它們大多都對。**

| 數字 | 它其實是什麼 |
|---|---|
| +0.51 | vs **重讀** 的加權平均效果量 |
| +0.93 | vs **填充活動或完全不做** |
| g = 0.61 | [跨所有對照條件合併](http://www.lscp.net/persons/ramus/docs/EPR20.pdf) |
| 0.64 / 0.83 | 小學 / 中學的分齡數字 |
| +0.70 vs +0.48 | 選擇題 vs 簡答題的練習測驗格式差異 |
| g = 0.50 | [Rowland (2014)](https://doi.org/10.1037/a0037559) 的獨立估計，I² = 84.35 |
| 0.22 / 0.46 | [Dietrichson 等人 2026](https://edworkingpapers.com/ai26-1418) 的組間 / 組內設計 |

**Adesope 那份 meta-analysis 用 Fail-safe N 檢驗發表偏誤，而這個指標早就被認為會嚴重高估穩健性。** 這點由兩位獨立讀過原文的人分別指出——[Learning Scientists 的 Yana Weinstein 說要「打點折扣看」](https://www.learningscientists.org/blog/2017/2/9-1)，De Bruyckere 文章下的討論則直接援引 Fergusson & Heene (2012)。上面那些數字該當成有偏誤風險的估計，不是定值。

**回饋的作用尚未調和。** Rowland 發現回饋會放大 testing effect，Adesope 的結果卻是有回饋只比沒回饋「略好」。這由 [Learning Scientists](https://www.learningscientists.org/blog/2017/2/9-1) 與 [Dietrichson 等人的系統性回顧](https://edworkingpapers.com/ai26-1418)兩處獨立確認。

**遷移那節的兩套數字來自不同分析，不要混用。** 隨機效果模型：沒有答案重疊時 d = 0.28，有重疊時再加 0.30，得到 0.58。校正發表偏誤後（PEESE）：截距實質為零，答案重疊帶來的增幅是 0.36、精緻化提取練習是 0.18。

**一萬小時那份 meta-analysis 在 2018 年發過[更正啟事](https://doi.org/10.1177/0956797618769891)**，主模型平均相關由 r = .35（95% CI [.30, .39]）修正為 .38（[.33, .42]）。作者在更正文裡明言，改用 Cheung 與 Chan 的方法重算「對結果沒有實質影響……對我們的發現與結論的實質內容毫無衝擊」。提它不是要推翻什麼，只是引用時該用更正後的數字；正文各領域百分比出自原文正文，不是更正表。

**Dietrichson 等人 2026 尚未經同儕審查**（EdWorkingPaper 工作論文）。引用它時要一併講這件事。

## 更新紀錄

- 2026-08-19（二）：改為單一主脊的架構——原本三套組織原則並行（按判決／按部件／按跨項議題），造成打岔與孤兒章節。現改為：導引（課程與判準）→ 逐項判決（統一格式，每項「課怎麼教／證據怎麼說／怎麼用」）→ 兩個跨項問題（遷移、效果量下修各自獨立成部）→ 已死主張 → 相鄰爭論 → 附錄。遷移一節由第九位升到跨項部。內容未刪。
- 2026-08-19（一）：新增課程內容概述——原文從未描述被審查的對象，補上四個模組骨架、能力錯覺的核心主張，並明講本篇只審其中五個部件。
- 2026-08-18：重寫結構以改善可讀性——把可執行結論前移、新增效果量的判讀規則、各節改以主張而非研究者姓名開頭；效果量的完整對照、發表偏誤與方法學爭議下放至文末附錄。證據、數字與引用一項未刪。

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


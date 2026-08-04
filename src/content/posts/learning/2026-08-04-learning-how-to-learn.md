---
title: "Learning How to Learn：拆解 417 萬人修過的學習課，哪些站得住、哪些是比喻"
date: 2026-08-04
category: learning
type: deep-dive
tags: [learning-science, self-learning, retrieval-practice, spaced-repetition, metacognition, ai-and-learning]
lang: zh-TW
tldr: "Dunlosky 2013 評比 10 種學習技術，判定為高效用的只有自我測驗與分散練習；學生最愛的重讀落在低效用層。課程招牌的 focused/diffuse mode 是比喻，Oakley 自己承認過。2025 年 PNAS 實驗：練習時用 GPT-4 正確率 +48%，收走 AI 後考試比從沒用過的低 17%。"
description: "拆解 Coursera「Learning How to Learn」的核心概念與背後證據：哪些有 meta-analysis 撐、哪些只是心智模型、哪些已被推翻，以及 LLM 如何改變這一切。"
draft: false
glossary:
  - term: "retrieval practice"
    aliases: ["提取練習", "自我測驗", "practice testing"]
    definition: "闔上材料、主動從記憶裡把答案叫出來，而不是重看一遍。"
    advanced: "測驗本身就是學習事件，不只是評量。有回饋時效果更大；自由回想的效果通常大於選擇題。"
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
  - term: "cognitive offloading"
    aliases: ["認知卸載"]
    definition: "把記憶或思考工作外包給外部工具（筆記、搜尋引擎、AI），減少大腦本身的負荷。"
    advanced: "短期提升表現，但可能減少內部知識結構的建立。爭議在於「哪些該卸載」——卸載查找成本通常無害，卸載推理過程則可能有害。"
    context: "本文用它串起 2025 年幾份關於 LLM 與學習的研究。"
---

> 🌏 [English version](/posts/learning/2026-08-04-learning-how-to-learn-en)

Coursera 上有一門課，[官方頁面](https://www.coursera.org/learn/learning-how-to-learn)顯示註冊人數 4,175,377、評分 4.8 分（93,136 則評價）。它叫 Learning How to Learn，由工程學教授 Barbara Oakley 和神經科學家 Terrence Sejnowski 開設，[2014 年 8 月首次開課](https://tdlc.ucsd.edu/tdlc2/news_LHTL_MOOC.php)，第一期就湧入 19.7 萬人、來自 206 個國家。[紐約時報 2015 年底報導](https://archive.nytimes.com/bits.blogs.nytimes.com/2015/12/29/the-most-popular-online-course-teaches-you-to-learn)時，它累積 119 萬人，是當時全球註冊人數最多的 MOOC，險勝 Andrew Ng 的 Machine Learning。

這篇不是課程心得。這篇要做的是把「課教了什麼」和「證據支持什麼」分開對帳——因為這兩件事重疊得沒有想像中多，而且落差的方向很有意思：**課裡最有名的那個概念，證據最弱；課裡不太強調的那些，證據最硬。**

## 它在解的問題不是「不夠努力」

先講清楚這整個領域的核心命題，因為它不是一份技巧清單。

2009 年 Karpicke、Butler 與 Roediger [調查了 177 名大學生](https://learninglab.psych.purdue.edu/downloads/2009/2009_Karpicke_Butler_Roediger.pdf)怎麼念書。結果是：

> 84% 的學生表示自己會重複閱讀，55% 把重讀列為第一順位策略；只有 11% 明確表示會在讀書時自我測驗，其中僅 1% 是因為相信提取本身能促進學習。

而重讀，正是後面會講到的十法評比裡被判「低效用」的那一組；自我測驗則是唯二「高效用」之一。學生不是懶——他們在花時間，只是**系統性地選錯**。選錯的原因也很清楚：重讀感覺有效。第二遍讀起來比第一遍順，那份流暢感被大腦誤讀成「我學會了」。

所以這個領域真正的命題是一句話：**學習的主觀流暢感，跟長期保留度是反相關的。** 幾乎所有有實證支撐的技術，都長得像「讓當下變難一點」。

## 招牌概念是比喻，而且作者自己說過

課程最廣為流傳的是 focused mode / diffuse mode——專注模式與發散模式，說大腦在兩者間切換，解不開的題目要放著讓發散模式在背景跑。這個概念被 [Farnam Street](https://fs.blog/focused-diffuse-thinking) 之類的網站大量轉載，通常配著「神經科學顯示」的說法。

問題在於，Oakley 在《A Mind for Numbers》的註腳裡自己處理過這個張力：

> 眼尖的讀者會注意到我提過發散模式有時會在專注模式運作時於背景進行。然而研究發現，例如預設模式網路（default mode network，這只是眾多靜息態網路之一）在專注模式活躍時似乎會安靜下來。那到底是哪一種？……某種意義上，我使用的「發散模式」一詞或許該理解為「朝向學習的非聚焦活動」，而不是單指預設模式網路。

這段話值得完整讀一次。它不是外界的指控，是作者主動說明自己做了簡化。**focused / diffuse mode 是一組好用的心智模型，不是神經科學結論。** 你可以完全不接受它的神經學版本，同時保留它的行為建議（卡住就去散步）——因為那個建議的支撐來自別的地方。

這也是我對這門課評價的核心：它的價值在把行為做成流程，不在它的腦科學。課程作業直接命名為 "Retrieval Practice"，這比它講的任何神經科學都重要。

## 真正硬的證據：Dunlosky 的十法評比

2013 年，Dunlosky 等五位研究者在 *Psychological Science in the Public Interest* 發表 [Improving Students' Learning With Effective Learning Techniques](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266)，挑了 10 種學生可以自己用、不需老師監督的技術，逐一評估其效果能不能跨學習條件、學生特質、材料類型、測驗形式推廣。結論是一張很不客氣的分層表：

| 效用等級 | 技術 | 補充數字 |
|---|---|---|
| **高** | practice testing（自我測驗） | [Rowland (2014)](https://doi.org/10.1037/a0037559) meta-analysis：g = 0.50（95% CI [0.42, 0.58]） |
| **高** | distributed practice（分散練習） | [Kim et al. (2019)](https://www.yorku.ca/ncepeda/publications/KWWR2019.pdf) 用真實世界大數據驗證仍成立 |
| **中** | elaborative interrogation（追問為什麼）、self-explanation（自我解釋）、interleaved practice（交錯練習） | 交錯練習 [Brunmair & Richter (2019)](https://doi.org/10.1037/bul0000209)：g ≈ 0.42 |
| **低** | summarization、highlighting、keyword mnemonic、imagery、**rereading** | 學生最常用的重讀與畫線都在這層 |

原文對高效用組的判準寫得很直接：

> 自我測驗與分散練習獲得高效用評價，因為它們對不同年齡與能力的學習者都有幫助，並且已被證明能在許多測驗任務、甚至在真實教育情境中提升學生表現。

有兩個但書必須寫進來，否則這張表會被誤用。

**第一，異質性比平均值重要。** Rowland 的 g = 0.50 底下 I² = 84.35——這代表研究之間的變異絕大部分不是抽樣誤差，而是真實的情境差異。「平均 0.5」不等於「你這次會拿到 0.5」。實驗室的字表任務效果，搬進真實課堂通常會縮水。

**第二，交錯練習挑材料。** Brunmair 與 Richter 的 meta-analysis 標題就叫 *Similarity matters*，涵蓋 59 篇研究、238 個效果量。結論是交錯對繪畫等視覺材料、對數學題型有效；對說明文（expository text）沒有優於區塊練習；對跨類別的單字學習甚至可能有害。把「交錯練習」當通用建議是誤讀原文。

## 已經可以丟掉的，與正在翻案的

**學習金字塔可以直接丟。** 那個「讀書記得 10%、聽講 20%……實做 90%」的三角形，數字是憑空捏造的。[Subramony、Molenda、Betrus 與 Thalheimer 在 2014 年做了完整考證](https://www.worklearning.com/2015/01/05/mythical-retention-data-the-corrupted-cone)：Edgar Dale 的 Cone of Experience 原圖沒有任何百分比，而且 Dale 的原意是描述性分類，不是教學處方；那些數字大約在 1970 年前後被不明人士貼了上去。NTL Institute 被追問來源時的回信是他們相信數字準確，但已經找不到、也拿不出原始研究。[Strathclyde 大學的記憶研究者的評語](https://www.strath.ac.uk/humanities/education/blog/remembering90percentofwhatyoudo)更乾脆：從沒見過任何控制良好的實驗顯示一種學習法能比另一種好九倍。

**學習風格比較麻煩，因為它正在翻案。** 主流定論來自 [Pashler、McDaniel、Rohrer 與 Bjork 在 2008 年的檢視](https://vu.nl/en/employee/didactics/learning-styles-debunked-what-does-work)：看過 70 多篇研究後，找不到證據支持匹配假說。這幾乎是所有科普文章的版本。

但 2024 年 7 月，Clinton-Lisell 與 Litzinger 在 Frontiers in Psychology 發表 [Is it really a neuromyth? A meta-analysis of the learning styles matching hypothesis](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1428732/full)，專門只收「有比較匹配 vs 不匹配教學」的研究，得到 21 篇、101 個效果量、1,712 名參與者：

> 基於穩健變異數估計，匹配教學到學習風格整體上有益處，g = 0.31，SE = 0.12，95% CI = [0.05, 0.57]，p = 0.02。然而，只有 26% 的學習結果測量顯示至少兩種風格都從匹配教學中獲益，即呈現支持匹配假說的交叉交互作用。

誠實的講法是：**證據不是零，但也遠不到值得為它改變教學設計。** 這不只是我的判斷，是該文自己的結論——作者把 g = 0.31 拿去對比單純的 modality effect（g = 0.70），指出 I² = 91.17 的異質性，並權衡匹配所需的教師時間成本與把學生標籤化的風險後，仍不建議實務採用。

順帶一提，這才是引用 meta-analysis 的正確方式：讀它的限制段落，不是只抄摘要那個數字。

## 一萬小時：一場定義之爭，不是數字之爭

[Macnamara、Hambrick 與 Oswald 在 2014 年的 meta-analysis](https://hhs.purdue.edu/skill-learning-and-performance-lab/wp-content/uploads/sites/43/2024/08/macnamara-et-al-2014-deliberate-practice-and-performance-in-music-games-sports-education-and-professions-a-meta-analysis.pdf) 常被拿來「打臉一萬小時」。它算出刻意練習能解釋的表現變異量是：遊戲 26%、音樂 21%、運動 18%、教育 4%、專業工作不到 1%。

但 Ericsson 陣營的[反駁](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.02396/full)也有分量：他們重新篩選後算出 r = 0.54、約 29% 的變異量，並主張 Macnamara 納入的研究裡有很多根本沒採用 Ericsson 對「刻意練習」的原始定義——例如把護理系學生上課與研討會的時數算成練習量。[Harwell 與 Southwick (2021)](https://yale.cloud-cme.com/assets/YALE/pdf/Harwell_Southwick%20beyond%2010,000%20hours%20copy.pdf) 補了一刀：社會與人格心理學文獻中 708 個 meta-analytic 相關係數的平均解釋變異量只有 3–4%，用「沒超過 50% 就算失敗」當標準本身就不合理。

兩邊的數字不能直接比，因為測的不是同一件事。可以帶走的結論是：練習量重要但遠非全部，而且**領域愈結構化、可預測（樂器、跑步），練習量的解釋力愈高；愈開放的領域（專業工作），解釋力愈低。** 這對工程師的啟示不太舒服：軟體工程比較接近「專業工作」那一欄。

## AI 時代：它移除的正是「必要的困難」

這是這個題目在 2026 年最值得重講一次的理由。

最硬的一份證據是 Bastani 等人 2025 年發表於 PNAS 的隨機對照試驗 [Generative AI without guardrails can harm learning](https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635)。土耳其近千名高中生分三組做數學練習：一組用接近原生 ChatGPT 的 GPT Base、一組用加了教師設計提示的 GPT Tutor、一組只有課本和筆記。結果：

> 有 GPT-4 可用時解題表現顯著提升（GPT Base 成績提升 48%，GPT Tutor 提升 127%）。然而我們另外發現，當存取權隨後被收走時，學生的表現反而比從未有過存取權的學生更差（GPT Base 成績下降 17%）——也就是說，不受限制的 GPT-4 存取可能危害教育成果。

GPT Tutor 那組的結果同樣值得看：練習時漲了 127%，考試時跟對照組**打平**。也就是說，「只給提示不給答案」的防護能把傷害抵銷掉，但沒有讓學習變得更好。研究者對此的比喻是自動駕駛——[Hechinger Report 的報導](https://hechingerreport.org/kids-chatgpt-worse-on-tests)提到，作者拿 FAA 建議飛行員減少使用自動駕駛來類比，重點是確保系統失效時人還會飛。

第二個發現更刺：學生完全沒察覺。GPT Base 組考差了，卻不覺得自己學得比較少；GPT Tutor 組沒考得比較好，卻覺得自己表現顯著更佳。這跟開頭那個「重讀感覺有效」是同一個病，只是工具升級了。

兩份常被一起引用、但需要小心的補充材料：

- **MIT Media Lab 的 [Your Brain on ChatGPT](https://www.media.mit.edu/publications/your-brain-on-chatgpt)** 用 EEG 測寫作時的神經連結度，提出 cognitive debt（認知負債）概念，發現 LLM 組連自己剛寫的句子都引用不出來。但樣本只有 54 人（第四場僅 18 人完成），且未經同儕審查。[官方專案頁的 FAQ](https://www.media.mit.edu/projects/your-brain-on-chatgpt/overview) 特別列了一段請求媒體不要使用 "brain damage"、"brain rot" 這類字眼，因為論文根本沒用這種詞彙。方向可以引，強度不能放大。
- **[The Memory Paradox](https://arxiv.org/abs/2506.11015)（arXiv:2506.11015）** 走得更遠，把 Flynn effect 的反轉跟認知卸載連在一起。有意思的是作者群正是 Oakley 與 Sejnowski——同樣兩個人，十年前教你怎麼建立內部記憶，現在在論證為什麼 AI 時代更需要它。但這篇是論證，不是實證因果，引用時要標清楚；它也還只是 Springer 專書章節的預印本。

把這幾份放在一起，可操作的規則其實很簡單：**AI 讓你在該困難的地方變順，而順就是學不到東西的訊號。** 先自己做，再問 AI——Kosmyna 研究裡從 brain-only 換到 LLM 的那組表現最好，Bastani 的 GPT Tutor 防護也是同一個原理：把 AI 放在提示的位置，不要放在答案的位置。

## 整體來說

如果只帶走一件事：**這門課的價值不在它的神經科學，而在它把「不要相信自己的流暢感」做成了可執行的日常流程。**

具體的取捨是這樣：

- **可以直接照做**：自我測驗取代重讀、把複習分散開來。這兩個有 meta-analysis 撐，是十法評比裡唯二的高效用。
- **要看情況**：交錯練習——視覺材料和數學題有效，說明文和單字別亂用。
- **可以丟掉**：學習金字塔的百分比、VAK 匹配（2024 年的翻案沒有翻到值得改變做法的程度）。
- **當成比喻用**：focused / diffuse mode。行為建議留著，神經學說法別拿去跟人爭論。
- **AI 時代的新規則**：先自己卡一次，再開 AI。把它放在提示位置。

還有幾個這個領域自己的限制值得記著：這些元研究的結果變項幾乎都是「保留度」，對遷移、創造力、判斷力的證據薄得多；而「學了學習法就能到處遷移」這個假設——也就是 learning how to learn 這個名字本身——恰恰是整套框架裡測得最少的一塊。

## 參考資料

- [Learning How to Learn — Coursera 官方課程頁](https://www.coursera.org/learn/learning-how-to-learn)
- [MOOC: Learning How to Learn — UCSD Temporal Dynamics of Learning Center](https://tdlc.ucsd.edu/tdlc2/news_LHTL_MOOC.php)
- [The Most Popular Online Course Teaches You to Learn — NYT Bits (2015)](https://archive.nytimes.com/bits.blogs.nytimes.com/2015/12/29/the-most-popular-online-course-teaches-you-to-learn)
- [Dunlosky et al. (2013), Improving Students' Learning With Effective Learning Techniques — PSPI 14(1)](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266)（[全文 PDF](https://www.whz.de/fileadmin/lehre/hochschuldidaktik/docs/dunloskiimprovingstudentlearning.pdf)）
- [Rowland (2014), The Effect of Testing Versus Restudy on Retention — Psychological Bulletin 140(6)](https://doi.org/10.1037/a0037559)
- [Brunmair & Richter (2019), Similarity matters: A meta-analysis of interleaved learning — Psychological Bulletin 145(11)](https://doi.org/10.1037/bul0000209)
- [Kim et al. (2019), The spacing effect stands up to big data](https://www.yorku.ca/ncepeda/publications/KWWR2019.pdf)
- [Karpicke, Butler & Roediger (2009), Do students practise retrieval when they study on their own? — Memory 17(4)](https://learninglab.psych.purdue.edu/downloads/2009/2009_Karpicke_Butler_Roediger.pdf)
- [Pashler et al. (2008), Learning Styles: Concepts and Evidence — 整理與連結](https://vu.nl/en/employee/didactics/learning-styles-debunked-what-does-work)
- [Clinton-Lisell & Litzinger (2024), Is it really a neuromyth? — Frontiers in Psychology 15](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1428732/full)
- [Mythical Retention Data & The Corrupted Cone — Work-Learning Research](https://www.worklearning.com/2015/01/05/mythical-retention-data-the-corrupted-cone)
- [Remembering 90% of What You Do? — University of Strathclyde](https://www.strath.ac.uk/humanities/education/blog/remembering90percentofwhatyoudo)
- [Macnamara, Hambrick & Oswald (2014), Deliberate Practice and Performance — Psychological Science 25](https://hhs.purdue.edu/skill-learning-and-performance-lab/wp-content/uploads/sites/43/2024/08/macnamara-et-al-2014-deliberate-practice-and-performance-in-music-games-sports-education-and-professions-a-meta-analysis.pdf)
- [Ericsson 陣營回應 — Frontiers in Psychology (2019)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.02396/full)
- [Harwell & Southwick (2021), Beyond 10,000 Hours](https://yale.cloud-cme.com/assets/YALE/pdf/Harwell_Southwick%20beyond%2010,000%20hours%20copy.pdf)
- [Bastani et al. (2025), Generative AI without guardrails can harm learning — PNAS](https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635)
- [Without Guardrails, Generative AI Can Harm Education — Knowledge at Wharton](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education)
- [Kids who use ChatGPT as a study assistant do worse on tests — Hechinger Report](https://hechingerreport.org/kids-chatgpt-worse-on-tests)
- [Kosmyna et al. (2025), Your Brain on ChatGPT — MIT Media Lab](https://www.media.mit.edu/publications/your-brain-on-chatgpt)（[專案頁與限制聲明](https://www.media.mit.edu/projects/your-brain-on-chatgpt/overview)）
- [Oakley et al. (2025), The Memory Paradox — arXiv:2506.11015](https://arxiv.org/abs/2506.11015)

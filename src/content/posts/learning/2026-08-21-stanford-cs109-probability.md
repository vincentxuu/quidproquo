---
title: "Stanford CS109 導讀：一門機率課把「怎麼用語言模型讀這一講」寫成了官方教材"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs109, ai-course, stanford, probability, machine-learning, self-study]
lang: zh-TW
series:
  name: "Stanford CS 主線課程導讀"
  order: 3
tldr: "CS109 在 2026 年夏季的每一講旁邊，掛了一份官方寫的 LLM Learning Guide——六個概念、每個概念一組 Learn 與 Test me 提示詞，逐週產出共 23 份 PDF。同一門課的榮譽守則第 4 條卻明文禁止拿 LLM 解作業，而成績有 65% 壓在現場考試。這兩件事是同一套設計的兩半。"
description: "Stanford CS109: Probability for Computer Scientists 深度導讀，讀完官方的 LLM Learning Guide、榮譽守則、課程大綱與講次頁面：這門課的硬規定、官方 AI 教材實際長什麼樣、它禁止什麼、作業的難度曲線落在哪一份，以及自學者哪些材料拿得到、哪些連結是壞的。"
draft: false
---

[CS109: Probability for Computer Scientists](https://web.stanford.edu/class/cs109/) 是 Stanford 電腦科學系大學部五門骨架課之一。教的東西聽起來很傳統：計數、條件機率、隨機變數、常態分布、中央極限定理，最後三分之一收在機器學習。課程官方描述講得很白——這門課「從組合數學的基礎開始，然後很快進入機率論的基本功」。

真正值得看的不是課綱，是課綱旁邊那一欄。2026 年夏季的講次表在每一講的「Outside Class」欄位掛了一份官方文件，叫 **LLM Learning Guide**。它不是政策宣導，是一份逐講撰寫、可以直接複製貼上的提示詞教材：一門機率課把「怎麼用語言模型預習這一講」做成了正式講義。

這篇是把那份教材真的下載打開、逐頁讀完之後寫的。另外把課程網站、[榮譽守則手冊](https://web.stanford.edu/class/cs109/handouts/honorCode.html)、課程大綱、講次頁面與 ExploreCourses 條目全部對過一遍。涵蓋這門課的硬規定、那份 AI 教材的實際形狀與它明確禁止的事、作業長什麼樣，以及自學者實際能拿到多少。**不包含**機率內容本身的教學——那是課程自己的工作，不是導讀的工作。系列的上一層在[《Stanford CS 課程導讀》地圖文](/posts/learning/2026-08-20-stanford-cs-course-map)，這篇不重複那份地圖的階梯排序。

## 這門課的硬事實

2026 年夏季由 [Chris Gregg](https://web.stanford.edu/~cgregg/chris-gregg/) 授課，週一到週四上午在 CoDa B80。接下來的學年秋、冬、春三學期都有開，三位不同的授課者輪流：秋季 Gregg、冬季 [Chris Piech](https://stanford.edu/~cpiech/bio/index.html)、春季 Jerry Cain。秋季那班的選課上限掛到 **999 人**（皆見 ExploreCourses 條目，查詢方式與其他兩班的上限收在附錄）。加上夏季這輪，這門課一年開四次，不存在「等不到」的問題。

先修條件比一般人以為的鬆。課程大綱寫的是 CS106B 加上 MATH 21 等級的微積分，而且明講「過去有學生把 CS106B 跟 CS109 同時修，結果也都還好」。真正嚴的是別的地方：

- **學分不能降。** 大學部一律以五學分修習，大綱裡加了括號「這是系上與學校的規定，沒有例外」。研究生為了行政理由可以降學分，但課程要求一個字都不會少。
- **不准跟別的課撞堂。** 大綱裡有一問一答：「可以在同一時段修另一門 Stanford 的課嗎？答：不行。」理由是撞堂通常代表期末考也撞。
- **期末考沒有替代場次。** 官方說法是如果你到時候到不了，就該換一個學期再修。
- **最晚第二週結束前加簽**，而且不會因為你晚加就多給第一份作業的時間。

另外有一門容易被漏掉的配套課：**CS109ACE（Problem-solving Lab for CS109）**，一學分、限額三十人、需要授課者同意、而且必須與 CS109 同時修。它不是補救班的定位，官方描述寫的是讓學生「更深入理解、協作、掌握材料」。

## 那份 LLM Learning Guide 到底長什麼樣

先講它的物理形式，因為這件事本身就有訊息。這些檔案放在課程網站的 `worksheets/` 目錄下，檔名是 `LectureNN-LLMPrompts.pdf`，跟當天的課堂習題（Worksheet）與解答（AnswerKey）擺在一起。目錄的檔案時間戳顯示，它們是**整個學期逐週產出的**，從六月中一路寫到八月初，總共 **23 份**。這不是學期初一次性放上去的政策附件，是跟著課走的教材。

（順帶一提，同一份東西在網站上有三個名字：首頁的講次表叫它「LLM Learning Guide」、講次頁面的連結文字叫「LLM Questions」、檔名叫 `LLMPrompts`。這種命名還沒收斂的狀態，通常代表東西很新。）

打開任何一份，結構都一樣。以[第一講那份](https://web.stanford.edu/class/cs109/worksheets/Lecture01-LLMPrompts.pdf)為例，開場先交代分工：上課前讀完當天投影片的指定段落，然後打開「你喜歡的 LLM」，照順序做完底下的概念。每個概念配一組 Learn 提示詞拿解釋、一組 Test me 提示詞驗收，而且特別交代**不要只是讀模型的回覆**——先自己答，再叫它打分。

接著是六個概念，每個概念兩段可以直接複製的提示詞。值得注意的是提示詞本身寫得多細。以「等可能結果」那個概念為例，Learn 那段要求模型解釋 P(E) = |E|/|S| 什麼時候成立、什麼時候失效。它還指定要用兩顆骰子求和當例子，把正確的樣本空間跟「所有可能的和都是等可能的」這個誘人但錯誤的想法對照。Test me 那段更狠：出一題骰子問題，檢查學生有沒有用對樣本空間，「如果我掉進『和是等可能』的陷阱就當場點出來」。

**課程不是在教你怎麼用 AI，是把 AI 當成一台隨時可用的口試機器。** 每份的最後還有一個 Wrap-up 提示詞，要模型出一道整合當天所有概念的多段題讓學生做完，然後「逐段打分、告訴我每一段考的是哪個概念、並告訴我下一堂課前最該複習哪一個」。

指南也預期學生會被模型帶偏，而且點名了具體的風險。[第二十二講（深度學習）那份](https://web.stanford.edu/class/cs109/worksheets/Lecture22-LLMPrompts.pdf)在正文之前插了一段當天限定的警告：

> 今天這個警告是這一講專屬的：這是唯一一堂你要求 LLM 解釋 LLM 怎麼運作的課，而網路上有大量深度學習內容，寫作的抽象層級跟 CS109 用的完全不同。堅持要它用 CS109 的框架——最大概似估計、對數概似、梯度上升、sigmoid 的導數——如果它開始談 optimizer、PyTorch 或 transformer 架構，就把它推回去。你要的是那個推導，不是那個生態系。

「你要的是那個推導，不是那個生態系」這句話，大概是我在整份材料裡看到最精準的一句 AI 使用指引。它沒有講「要批判性思考」這種空話，它直接告訴你模型會往哪裡漂、以及漂了要怎麼拉回來。

同一份文件的結尾補上了為什麼這門課值得上完：

> 這是這學期最後一段新的機器學習內容，值得停下來想想剛剛發生了什麼事。九週前我們用三條公理定義了機率。今天我們從那三條公理推導出了幾乎所有現代 AI 系統背後的訓練演算法——包括你整學期一直在下提示詞的那一個。

## 它明確禁止什麼

指南本身的禁令是「不要只讀回覆」「先自己答再讓它改」，但真正的紅線寫在另一份文件。榮譽守則手冊列了四條規則，第四條標題直接就是 **「Don't ask an LLM to solve homework for you」**：

> 現在活著真是好時代！GPT4 這類大型語言模型能做到很美好的事。學會用這些工具來學習！你可以請 LLM 教你一個概念，也可以請它幫你釐清題目在問什麼。但是，你不應該請 LLM 幫你解題，或幫你把作業解答寫出來。你應該知道，LLM 會在輸出裡留下藏不住的機率分布痕跡。

前三條規則管的是同一件事的傳統版本：不准看不是自己的解答（包含往年答案與網路解法）、不准把解答分享出去、拿到任何協助都要在繳交時註明來源與協助內容。課程大綱那頁把這件事再講一次，用詞更硬。它說榮譽守則政策「明確禁止你向其他學生或 ChatGPT、Stack Overflow、Chegg 這類網站索取或取用解答」。

**把兩份文件擺在一起看，這門課的立場非常一致：LLM 可以當家教，不可以當代筆。** 而且它不是靠自律撐著這條線，是靠成績結構。

## 成績結構把賭注押在考場

大綱公布的比重如下：

| 項目 | 佔學期成績 |
|---|---|
| 作業（psetapp） | 10% |
| 兩次期中考合計 | 30% |
| 期末考 | 35% |
| 課堂參與 | 25% |

也就是說，**可以在家裡完成的部分只占十分之一**，其餘全部發生在有人看著的場合。

更能說明方向的是另一句。這門課參加了 Stanford 學術誠信工作小組（Academic Integrity Working Group，AIWG）的監考試辦計畫，官方說明是「這個試辦的目的是判斷監考的成效，並發展在 Stanford 進行實體監考的有效做法」。對一所把「教職員不監考」寫進榮譽守則的學校來說，這件事本身就是新聞。

於是這門課在同一個學期做了兩件看起來相反的事：把 AI 學習工具做成官方教材發下去，同時把評分的重量搬回實體考場、並參與重新引入監考的試辦。**這兩件事不矛盾，它們是同一個判斷的兩半**——學習過程歡迎模型介入，能力證明必須在沒有模型的房間裡發生。如果你在設計任何跟 AI 共存的評量制度，這是目前能找到最完整的一個實作樣本。

## 為什麼 AI 這條路跳不過它

這門課在課號上只是一門大學部必修，但它出現在下游課程先修欄位的頻率不太尋常。三門常被提到的進階課，官網原文分別是：

| 課程 | 先修欄位怎麼寫 CS109 |
|---|---|
| [CS336: Language Modeling from Scratch](https://cs336.stanford.edu/) | 「Basic Probability and Statistics (e.g. CS 109 or equivalent)」 |
| [CS234: Reinforcement Learning](https://web.stanford.edu/class/cs234/) | 「Basic Probability and Statistics (e.g. CS 109 or other stats course)」 |
| [CS224W: Machine Learning with Graphs](https://web.stanford.edu/class/cs224w/) | ExploreCourses 寫「Prerequisites: CS109, any introductory course in Machine Learning」 |

最後那條有個要說清楚的落差。**ExploreCourses 把 CS109 列成先修，但課程自己的網站寫的是「足夠，但非必要」**（原文：sufficient but not necessary）。同一門課的兩個官方頁面對不上，這在 Stanford 是常態，引用時要標清楚你引的是哪一份。

不過方向是一致的：這三門課要的都不是「CS109 這門課」，是「CS109 這個程度」。它們的先修欄位在意的是你能不能自在處理高斯分布、期望值、變異數、最大概似估計——也就是 CS109 中後段那一整塊。跳過的代價不會在下一門課爆發，會在你之後每一份讀不動的論文裡慢慢出現。

## 作業長什麼樣

課程使用一套叫 **psetapp** 的自製網頁應用，作者是 Chris Piech。大綱把它的機制講得很清楚，而且這套機制跟一般作業系統的差別值得注意：

- **可以邊做邊對答案**，而且重試次數不限、答錯沒有懲罰。
- **沒有儲存按鈕，也沒有送出按鈕**——系統持續自動儲存，時間一到就直接以當下的內容開始批改。
- 每題都要求「寫出過程」：數學題要寫到一個熟悉 CS109 的人看得懂你怎麼想的，程式題要有足夠的註解說明你的做法。大綱的原話是「絕對不要只寫答案」。
- 遲交政策分三層：兩小時無條件寬限、每份最多兩個遲交日、超過五個遲交日要找助教總管談。理由寫得很直白——不是罰你，是想早點發現你出事了。

**作業的分水嶺在哪裡，從主題序列就看得出來。** 前三份處理核心機率、離散與連續隨機變數，這一段還是「算得出來就對」。第四份開始進入機率模型與不確定性理論，得先把問題翻譯成模型才有得算。最後兩份直接是機器學習與邏輯迴歸。真正掉隊通常發生在第四份——從「套公式」轉成「先建模」的那一步，跟進度表上第一次期中考的位置幾乎重疊。

另外還有一個 **Challenge**：完全自願的加分專案，做一個機率驅動的作品加一份說明。大綱花了一整段強調它「是真心的自願，不是那種『這是加分但你不做成績就會受影響』的壞心眼版本」。加分只在期末成績算完之後才疊上去。評分公式是公開的：

```
score = sophistication × (1 + creativity + impact)
```

三個維度都取 0 到 1。注意乘法的位置——**學術深度是乘數，創意與影響力只是加成**。一個很酷但沒用到 CS109 內容的作品，分數是零。過去的作品連同 PDF 都掛在 [Challenge 頁面](https://web.stanford.edu/class/cs109/handouts/challenge.html)上，題目從 Bessel 校正、撲克模擬器到「為什麼廣告 A/B 測試會騙人」都有。

## 自學者實際拿得到什麼

這門課的公開程度在 Stanford 的 CS 課裡算高，但有一條很奇怪的斷層。以下逐項是 2026 年 8 月 21 日實測的結果：

**拿得到：**

- **課程讀本**：[Probability for Computer Science](https://probabilitycoders.stanford.edu/spr26)，Piech 與 Gregg 合著，免費、不用登入，而且是互動式的。它附了演算法藝術、從名字推年齡、撲克、擴散模型、金字塔密室偵測等九個可以跑的應用，另外提供 [2024 年版的完整 PDF](https://chrispiech.github.io/probabilityForComputerScientists/en/ProbabilityForComputerScientists.pdf) 下載。
- **課堂習題與解答**：`worksheets/` 目錄下的 Worksheet 與 AnswerKey 都是公開 PDF，最後一份排到第二十八講（中間有幾講沒有）。
- **全部 LLM Learning Guide**：23 份，公開。
- **第 1 到第 14 講的投影片 PDF**。

**拿不到：**

- **第 15 講之後的投影片**。講次頁面上連結還在，點下去是 404。也就是說，你會拿到第二十講「邏輯迴歸」的 LLM 學習指南，而那份指南第一句就叫你「先讀第二十講投影片」——但那份投影片抓不到。**有導遊，沒地圖。**
- **作業**。psetapp 走 Stanford SUNet 單一登入，非在校生進不去。往年封存學期（例如 [Winter 2021 版](https://web.stanford.edu/class/archive/cs/cs109/cs109.1214/schedule.html)）的作業題目還留著公開 HTML，可以拿來當替代品，但沒有自動批改。
- **上課錄影**。大綱說「本學期 CS109 有錄影」，但發布在 Canvas 上，校外看不到。

還有兩個要提醒的坑。第一，課程網站上那個叫 `courseReader.html` 的頁面**不是**現在的讀本，它標著 2017 年的更新日期，內容是當年那份草稿的目錄；現行讀本在上面那個 `probabilitycoders.stanford.edu` 網域。第二，課程大綱那一頁還停在別的學期——它寫著上課時間是週一三五下午、地點在 NVIDIA Auditorium，而進度表上是週一到週四上午、在 CoDa B80。**引用課程資訊時以進度表與講次頁面為準，大綱那頁是舊的。**

## 怎麼開始

**怎麼做**：下載[第一講的 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture01-LLMPrompts.pdf)，跳過前面的 Learn 提示詞，直接把第三個概念的 **Test me** 那段貼給任何一個語言模型。它會出一道兩顆骰子的題目給你。先自己用三十六格的樣本空間硬算一遍，算完再讓它批改。

那段提示詞寫死了要模型檢查你有沒有用對樣本空間，而且如果你掉進「所有可能的和都是等可能」的陷阱，要它當場點你。這正好是整套設計的縮影：**它不給你答案，它給你一個會抓你的東西。** 十分鐘之後你就知道自己該不該從第一講開始修。

想接著往下走的話，把 `worksheets/` 目錄當主線：每一講先讀 Worksheet 自己做，再用 LLM Learning Guide 讓模型考你，最後用 AnswerKey 對。第 15 講之後投影片斷掉的部分，用互動式讀本補。

## 附錄：數字與查證方式

- **ExploreCourses 查詢方式**：網頁版現在要求登入，但 XML 端點還開著：`https://explorecourses.stanford.edu/search?view=xml-20200810&q=CS109`。CS109 條目的課名是 *Introduction to Probability for Computer Scientists*（比課程網站的 *Probability for Computer Scientists* 多了 Introduction 一字）、學分區間 3 至 5、評分方式為 Letter 或 Credit/No Credit、通識標記為 GER:DB-EngrAppSci、WAY-AQR、WAY-FR。
- **2026–2027 三學期的授課者與選課上限**：秋季 Gregg（999）、冬季 Piech（350）、春季 Cain（500）。數字取自各學期 LEC 節次的 `maxEnrolled` 欄位，是選課上限而非實際人數。
- **成績比重**：作業 10%、期中合計 30%、期末 35%、課堂參與 25%。這組數字出自課程大綱頁，而該頁其他欄位（上課時間、地點、作業份數）已被進度表推翻，所以比重也有可能不是夏季班的最新版本。已在正文標明來源限制。
- **LLM Learning Guide 的 23 份**：以 `worksheets/` 目錄列表逐檔清點，檔名為 `Lecture01` 至 `Lecture22` 加上 `Lecture25`，檔案時間戳從 2026-06-19 到 2026-08-05。第 23、24、26、27、28 講沒有對應檔案。
- **投影片在第 15 講斷掉**：逐一對 `lectures/<目錄名>/<目錄名>.pdf` 發請求，第 1 至第 14 講回 200，第 15 講起回 404（`28-Future` 是例外，回 200）。查驗日期 2026-08-21。同一目錄下還留著多個舊學期編號的資料夾（例如 `17-Sampling`、`22-Optimization`），那些也都是 404。
- **榮譽守則第四條的引文**：原文寫的是「LLMs do leave tell tail probabilistic distributions in their output」，`tell tail` 應為 `tell-tale`（藏不住的、洩底的），正文採此讀法翻譯。
- **首頁講次表的日期筆誤**：首頁「This Week in CS109」把 6 月 25 日標成 Tue，但進度表上同一講是 Thu。以進度表為準。
- **未能確認的三件事**：（一）Summer 2026 的作業究竟是六份還是七份——進度表列到 Pset #6，大綱與側邊選單都寫七份，psetapp 需登入所以無法核對；（二）LLM Learning Guide 最早出現在哪一個學期——封存的 Autumn 2024、Winter 2025、Summer 2025 三個版本的頁面都沒有這一欄，但封存版不完整，無法斷言 Summer 2026 是首次；（三）課堂參與那 25% 的細部組成——大綱裡討論分組討論課與一對一考前面談的段落，在現行頁面上是被註解掉的狀態，不確定夏季班是否仍然實施。

## 參考資料

- [CS109 課程官網（Summer 2026）](https://web.stanford.edu/class/cs109/) — 授課者、上課時間地點、考試日期、以及首頁講次表上的 LLM Learning Guide 欄位
- [CS109 進度表](https://web.stanford.edu/class/cs109/schedule.html) — 二十八講的主題序列與六份作業的發放／繳交日
- [CS109 課程大綱](https://web.stanford.edu/class/cs109/handouts/syllabus.html) — 先修、學分硬規定、撞堂規定、成績比重、psetapp 機制、遲交政策、AIWG 監考試辦
- [CS109 榮譽守則手冊](https://web.stanford.edu/class/cs109/handouts/honorCode.html) — 四條規則，第四條是「Don't ask an LLM to solve homework for you」的原文
- [第一講 LLM Learning Guide（PDF）](https://web.stanford.edu/class/cs109/worksheets/Lecture01-LLMPrompts.pdf) — 六概念 Learn／Test me 結構的完整樣本
- [第九講 LLM Learning Guide（PDF）](https://web.stanford.edu/class/cs109/worksheets/Lecture09-LLMPrompts.pdf) — 常態分布那份，證明中後段的指南結構一致
- [第二十二講 LLM Learning Guide（PDF）](https://web.stanford.edu/class/cs109/worksheets/Lecture22-LLMPrompts.pdf) — 當天限定的 LLM 警告，以及結尾那段從三條公理走到現代 AI 的總結
- [第一講課堂習題（PDF）](https://web.stanford.edu/class/cs109/worksheets/Lecture01-Worksheet.pdf) — 課前用 LLM 預習、課堂做習題的分工證據
- [CS109 worksheets 目錄列表](https://web.stanford.edu/class/cs109/worksheets/) — 23 份 LLM Learning Guide 的檔名與逐週產出的時間戳
- [Probability for Computer Science 互動式讀本](https://probabilitycoders.stanford.edu/spr26) — 免費公開的現行課程讀本與九個互動應用
- [課程讀本 2024 年版 PDF](https://chrispiech.github.io/probabilityForComputerScientists/en/ProbabilityForComputerScientists.pdf) — 可離線下載的完整版本
- [CS109 Challenge 頁面](https://web.stanford.edu/class/cs109/handouts/challenge.html) — 自願加分專案的評分公式與往年作品清單
- [CS109 Winter 2021 封存版進度表](https://web.stanford.edu/class/archive/cs/cs109/cs109.1214/schedule.html) — 公開的往年作業題目與 Sheldon Ross 教科書對應章節
- [CS336 課程官網](https://cs336.stanford.edu/) — 先修欄位原文「Basic Probability and Statistics (e.g. CS 109 or equivalent)」
- [CS234 課程官網](https://web.stanford.edu/class/cs234/) — 先修欄位原文「Basic Probability and Statistics (e.g. CS 109 or other stats course)」
- [CS224W 課程官網](https://web.stanford.edu/class/cs224w/) — 先修欄位原文「CS109 or Stat116 are sufficient but not necessary」，與 ExploreCourses 的寫法不一致
- [Stanford ExploreCourses](https://explorecourses.stanford.edu/) — CS109 與 CS109ACE 的官方課名、學分區間、開課學期與選課上限
- 站內：[Stanford CS 課程導讀地圖](/posts/learning/2026-08-20-stanford-cs-course-map)
- 站內：[Stanford CS329A 深度導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)

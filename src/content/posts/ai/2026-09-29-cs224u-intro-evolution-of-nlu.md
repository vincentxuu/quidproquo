---
title: "CS224U 開場：同一個問題問了四十年，2023 年的 NLU 課怎麼定義「理解」"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, ai-course, stanford, nlp, llm, evaluation]
lang: zh-TW
series:
  name: "Stanford CS224U 導讀"
  order: 2
tldr: "CS224U Spring 2023 的第一堂拿「哪些美國州不和任何美國州接壤？」從 1980 年的 Chat-80 一路問到 text-davinci-001，先證明進展是真的，再用 Levesque 的「cheap tricks」、會編造連結的模型和飽和的 benchmark 質疑這些進展算不算理解。課程地圖因此分成兩半：前半教怎麼用 Transformer 與檢索增強的 in-context learning 做系統，後半教怎麼用更難的 benchmark、行為評估與因果解釋方法檢驗系統。"
description: "Stanford CS224U（Spring 2023）開場講座導讀：依官方 intro 投影片、YouTube 01–02 兩支錄影、Apr 3 三篇指定讀物（Levesque 2013、Manning 2015、Foundation Models 報告 §2.6）與 setup.ipynb，整理這門課怎麼描述 NLU 的演進、它把「理解」拆成哪些可研究的問題，以及七大主題的課程地圖。"
draft: false
glossary:
  - term: "self-supervision"
    aliases: ["自監督"]
    definition: "模型唯一的訓練目標是從序列裡的共現模式學習，也就是讓實際出現過的序列得到高機率；不需要人工標註。"
    context: "CS224U 開場把它列為近年 NLU 進展的兩大推力之一，另一個是 Transformer。"
  - term: "cheap tricks"
    aliases: ["heuristics"]
    definition: "Levesque 2013 的用語：不靠真正理解、只靠啟發式規則就答對問題的捷徑。"
    context: "本文用它說明「表現好」和「理解」為什麼要分開量。"
---

> 🌏 [English version](/posts/ai/2026-09-29-cs224u-intro-evolution-of-nlu-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **本文依據 [CS224U](https://web.stanford.edu/class/cs224u/) 的 2023 春季版。** 課程網站至今停在那個學期；這門課的開課狀態、停開紀錄與 ExploreCourses 描述對不上講次表的問題，[系列總覽](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)已經寫過，這裡不重講。這一篇是 [Stanford CS224U 導讀](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)系列的第 2 篇。

[CS224U: Natural Language Understanding](https://web.stanford.edu/class/cs224u/) 是 Christopher Potts 教的專案導向 NLP 課，先修是 CS224N。2023 年 4 月 3 日的第一堂先說明 NLU 怎麼走到現在，並用這段歷史推出前兩個單元；整學期課程地圖的其餘部分與課務，Potts 在第二支錄影（開頭就說「day two」，並回顧「上次」的投影片）接著講完。

本文依據的公開材料有四份：[intro 投影片](https://web.stanford.edu/class/cs224u/slides/cs224u-intro-2023-handout.pdf)（98 頁 handout）、YouTube 上 [XCS224U 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)的第 [01](https://www.youtube.com/watch?v=K_Dh0Sxujuc) 與 [02](https://www.youtube.com/watch?v=J52Dtu40esQ) 支錄影、講次表在 Apr 3 那一格列的三篇讀物，以及 repo 裡的 [setup.ipynb](https://github.com/cgpotts/cs224u/blob/main/setup.ipynb)。這些材料都公開，屬於課程地圖分級裡的 A3（足以自學）歷史版本；Canvas 上的 quiz 和教室錄影拿不到。

## 課程影片來源

下列影片是 Stanford Online 發布的 Spring 2023 對應講次錄影，與本文採用的 2023 年春季版課程一致。2026-10-10 已對照官方播放清單（50 支）核對標題與影片 ID。

```youtube
url: https://www.youtube.com/watch?v=K_Dh0Sxujuc
title: Stanford XCS224U: NLU I Intro & Evolution of Natural Language Understanding, Pt. 1 I Spring 2023
```

```youtube
url: https://www.youtube.com/watch?v=J52Dtu40esQ
title: Stanford XCS224U: Natural Language Understanding I Course Overview, Part 2 I Spring 2023
```

原始影片：[Stanford XCS224U: NLU I Intro & Evolution of Natural Language Understanding, Pt. 1 I Spring 2023](https://www.youtube.com/watch?v=K_Dh0Sxujuc)、[Stanford XCS224U: Natural Language Understanding I Course Overview, Part 2 I Spring 2023](https://www.youtube.com/watch?v=J52Dtu40esQ)

內容核對：已依字幕核對（2026-10-10）：影片 01（Intro & Evolution, Pt. 1）與影片 02（Course Overview, Part 2）的字幕逐項對照：美國州接壤題與 Chat-80／Wolfram Alpha／Ada／Babbage／Curie／davinci-instruct-beta／text-davinci-001 的各代回答、Levesque 鱷魚與棒球帽小翅膀（Davinci-2 與 Davinci-3 互相矛盾）、課堂上 Bard 的 Rule 3.06 與連結不存在的討論、benchmark 飽和時間軸、歷史階段與 Transformer／self-supervision、課程主題（COGS 全 0 欄、Cousteau、Strathern's law）、非同步課務、Colab／Cohere／OpenAI 5 美元額度，皆吻合。發現一處不符：影片 02 開頭明說這是第二天（回顧『上次』的投影片），課程地圖後半與課務並非都在 4 月 3 日第一堂講完，已改寫該句。配分比例與投影片頁碼屬投影片內容，未以字幕驗證。

課程與錄影入口：

- [XCS224U Spring 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [官方課程／講次來源](https://web.stanford.edu/class/cs224u/)

## 一個問題問了四十年

Potts 的開場用了一個他在這門課裡用了很多年的問題：

> Which U.S. states border no U.S. states?

難點在那個「no」。否定句對語言技術一直很難，這題表面簡單，其實在測模型有沒有處理否定。

投影片依年份排出各代系統怎麼回答：

| 年份 | 系統 | 回答 |
|---|---|---|
| 1980 | Chat-80（符號式系統） | 「I don't understand.」 |
| 2009 | Wolfram Alpha | 列出所有州，等於沒讀懂問題 |
| 2020 | OpenAI Ada、Babbage | 答非所問，接著一路胡言亂語 |
| 2021 | Curie | 開始列舉，提到 Alaska、Hawaii 和 Puerto Rico |
| 2022 | davinci-instruct-beta | 「Alaska and Hawaii.」 |
| 2022 | text-davinci-001 | 完整句子，答對 |

Chat-80 的例子最有意思。同一套系統可以正確回答「哪個地中海沿岸國家，與一個國家接壤，而那個國家又與一個人口超過印度的國家接壤？」這種多層巢狀的問題，卻對「no U.S. states」這種超出能力範圍的簡單句直接放棄。Potts 在[錄影](https://www.youtube.com/watch?v=K_Dh0Sxujuc)裡的評語是：表達力極強，但僵硬。

davinci-instruct-beta 那一列他特別停下來講：這是第一個名字裡帶「instruct」的模型。這個伏筆後面講 human feedback 時會收回來。

**這張表要你接受的第一件事是：進展是真的。** 2020 到 2022 年之間，答案從胡言亂語變成正確的完整句子。

## 但「答對」還不等於「理解」

接著開場馬上反過來質疑。投影片有一頁標題就叫「Spotting models' 'cheap tricks'」，引用的是講次表上第一篇讀物：[Levesque 2013, "On our best behaviour"](http://www.cs.toronto.edu/~hector/Papers/ijcai-13-paper.pdf)。

Levesque 的論點是：AI 這門科學要研究的是行為本身，以及這個行為靠什麼才做得到，而不是做出「看起來像」的行為。他舉的例子是「鱷魚能跑障礙賽馬（steeplechase）嗎？」。人會推理：鱷魚腿短，跳不過障礙。但也可以用 cheap trick 答對：「沒聽過鱷魚跑 steeplechase，所以不能。」答案對了，換成問瞪羚就會錯。他的對策是 Winograd schema：兩個人物、一個代名詞，只換一個關鍵詞，正確答案就跟著翻轉，逼系統不能只靠統計捷徑。

Potts 在課堂上拿 Levesque 的另一題實測。「職棒球員可以在帽子上黏小翅膀嗎？」他口中的 Davinci-2 說沒有規定禁止，只是不常見；Davinci-3 則很有把握地說不行，還講了一套 MLB 服裝規定。兩個密切相關的模型，給出兩個互相矛盾的自信答案。台下同學用 Bard 查到一個「Rule 3.06」，Potts 回問的是：那是真的嗎？他提到 OpenAI 模型會附連結，但連結點下去不存在。同一份投影片後面講「出處」的那頁，截圖旁直接標著「These links are not real!」。

**第二件事：模型能拿出看起來像證據的東西，但證據可能是編的。** Potts 認為這比完全不給證據還糟。

第三個訊號來自 benchmark。投影片引 [Kiela et al. 2021（Dynabench）](https://aclanthology.org/2021.naacl-main.324/)的圖：MNIST、Switchboard 花了大約 20 年才被超越「人類表現」那條線，ImageNet 不到 10 年，SQuAD、GLUE、SuperGLUE 一個比一個快。Potts 提醒大家對「人類表現」這個估計保持懷疑，但他的結論仍然是：benchmark 飽和得前所未有地快，這本身說明有東西真的變了，也說明我們的測試撐不久。

## 什麼在推動這一波進展

開場用一條時間軸回答「到底發生了什麼事」。Potts 把 AI 模型開發分成五個階段：

1. 1960–1980 年代：符號式演算法，像 Chat-80 那樣把系統寫出來
2. 1990 到 2000 年代初：統計革命，從資料學，但仍靠人寫大量 feature function
3. 2009、2010 年起：深度學習，模型更大更深，feature function 越來越少
4. 約到 2018 年：預訓練元件加上任務專屬參數，像 BERT 那樣組起來再微調
5. 現在：想用一個巨大的語言模型取代一切

他特別說要「批判地思考」第五階段是不是正確方向。接下來他點名兩個關鍵推力。

**Transformer。** 他預告每個人都會走一樣的三步：「這東西到底怎麼運作？」→「喔，其實是很簡單的元件」→「等等，為什麼這樣就行得通？」。架構細節留到下一堂，也就是本系列的[上下文表徵 I](/posts/ai/2026-09-29-cs224u-contextual-reps-transformer)。

**Self-supervision。** 模型唯一的目標是學序列裡的共現模式，或者說讓實際出現過的序列得到高機率；生成就是從模型取樣。投影片第四點強調序列可以包含任何東西：語言、程式碼、感測器讀數、影像。因為不需要標註，大規模預訓練才成為可能。

這條線從 word2vec、GloVe 開始（Potts 特別稱讚 GloVe 團隊連預訓練參數一起釋出），經過 [ELMo](https://aclanthology.org/N18-1202/)、BERT、GPT，走到 [GPT-3](https://arxiv.org/abs/2005.14165)。參數量從 BERT 的一億級跳到 GPT-3 的 1,750 億。投影片同一頁也列出 2023 年的反向趨勢：LLaMA 13B、Alpaca 7B、FLAN-T5 這類百億參數以下的模型開始有競爭力，而這種大小一般商用硬體就跑得動。

這段歷史的最後是 prompting 的三個轉折：GPT-3 帶起的 in-context learning、learning from human feedback（投影片引 ChatGPT 的發表文章），以及 step-by-step／chain-of-thought。Potts 講 prompting 時有一段值得記下來。「Better late than ___」和「The President of the U.S. is ___」看起來一個是成語、一個是事實知識，但**背後是同一個機制**：都只是在重現訓練資料裡的共現模式。

## 三篇讀物各自回答什麼

Apr 3 那一格列了三篇讀物，另外還有一支 John Oliver 的節目片段。三篇剛好從三個角度切「理解」：

| 讀物 | 核心主張 | 在這門課裡的作用 |
|---|---|---|
| [Levesque 2013](http://www.cs.toronto.edu/~hector/Papers/ijcai-13-paper.pdf) | 要研究行為本身，不是它的相似物；用 Winograd schema 擋掉 cheap tricks | 提供「怎麼設計測試才不會被捷徑騙過」的思路 |
| [Manning 2015](https://aclanthology.org/J15-4006/) | 深度學習的海嘯打上計算語言學，但 NLP 是語言技術的 domain science，領域問題不會消失；他也批評研討會太專注刷 state of the art | 提醒這門課的重心是問題與方法，不是排行榜 |
| [Foundation Models 報告 §2.6](https://crfm.stanford.edu/assets/report.pdf#philosophy) | 區分理解是什麼（metaphysics）和怎麼知道模型理解了（epistemology）；結論是現在就斷言未來模型不可能理解語言，言之過早 | 把「理解」拆成可以操作的研究問題 |

第三篇的作者包括 Potts 本人。它列出三種關於「理解」的立場：

- **Internalism**：理解是針對語言輸入，取回正確的內部表徵結構
- **Referentialism**：理解是知道一個句子在什麼情境下為真
- **Pragmatism**：不需要內部表徵，只要能以正確方式使用語言就算理解

這個區分決定了怎麼驗證。報告寫得很直接：如果採 pragmatism，測行為就夠了，難處只在大家對目標行為很難有共識；報告也指出，系統超過人類表現的估計時，社群的反應通常是「測試有瑕疵」，而不是「目標達成了」。如果採 internalism 或 referentialism，行為測試永遠不完美，需要能打開模型內部的方法：probing、研究內部動態、用介入做因果推論。

**我的讀法是，這一段幾乎就是這門課後半的目錄。** 行為評估對應 pragmatism 那條路，模型解釋方法對應另外兩條路。這個對應是我的整理，投影片上沒有這樣寫，但下一節的主題清單可以對照。

## 課程地圖：七個主題、兩種工作

投影片第 44 頁把整學期列成兩欄：

| 主題 | 工作 |
|---|---|
| 1. Contextual representations | 3 組作業＋bake-off |
| 2. Multi-domain sentiment analysis | quiz |
| 3. Retrieval-augmented in-context learning | 期末專案：文獻回顧 |
| 4. Compositional generalization | 期末專案：實驗計畫 |
| 5. Benchmarking and adversarial training and testing | 期末專案：論文 |
| 6. Model introspection | |
| 7. Methods and metrics | |

之後的投影片逐一展開「course themes」，每個主題都接回前面的某個疑問：

- **Transformer-based pretraining**：核心概念、架構、位置編碼、蒸餾，再加兩場客座（diffusion objectives、實務預訓練與微調）。
- **Retrieval-augmented in-context learning**：這是 Potts 自己的研究重點。他列出五個需求：流暢、效率、可更新、出處與事實性、安全，再逐項比較「LLM 包辦一切」和「檢索增強」。例如文件更新時，檢索增強只要重建索引；權限控管也能沿用文件層級的做法。前面那些不存在的連結，就是「出處」這一項的反例。
- **Compositional generalization**：用 [COGS](https://aclanthology.org/2020.emnlp-main.731/) 與 ReCOGS。訓練時看過「Emma ate the cake on the table」，測試時換成「The cake on the table burned」，排行榜上一整欄是 0。總覽已經整理過這張表。
- **Better and more diverse benchmark tasks**：引 Jacques Cousteau 說水和空氣已經變成「全球垃圾桶」，暗指資料集。投影片列出我們對資料集的六種要求：最佳化、評估、比較模型、賦予新能力、衡量整個領域的進展、科學探究。
- **More meaningful evaluations**：以 Strathern's Law 開場：「When a measure becomes a target, it ceases to be a good measure」，接著講多維排行榜與 Dynascoring。
- **Faithful, human-interpretable explanations**：解釋要同時滿足人能理解，以及忠於模型實際運作。投影片把方法分成三類：probing 看內部表徵但不支持因果推論，attribution 看因果動態但不刻畫表徵，interchange intervention training 讓模型符合高階符號結構。

本系列接下來的篇目大致照這個順序走：先是兩篇上下文表徵（[Transformer 機制](/posts/ai/2026-09-29-cs224u-contextual-reps-transformer)、[模型家族](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families)），再到情感分析作業、檢索與 ICL、評估、解釋方法、方法論與專案。

## 課程怎麼運作

投影片最後一段是課務。配分寫得很清楚：

| 項目 | 比重 |
|---|---|
| Quizzes | 15% |
| Homeworks and bake-offs | 35% |
| Literature review | 10% |
| Experiment protocol | 10% |
| Final project paper | 30% |

課程是完全非同步的：每堂都錄影，不強制出席。Quiz 開書、可以用 ChatGPT，但不能合作。Quiz 0 考的是課程規定，目的是讓學生去讀網站、了解自己的權利和義務。

有一處材料本身不一致。第 44 頁寫「3 offline quizzes」，第 91 頁寫「four online quizzes」，第 95 頁又說 Quiz 1–4 是教材相關題目。講次表上可以看到 Quiz 0 和 Quiz 1 的 Canvas 連結，但對自學者來說都打不開，所以題數差異不影響自學。

「原創系統」題的評分規則在第 92 頁：下載別人的程式碼重訓就交不給分，有創意、動機清楚的系統就算 bake-off 表現不好也能拿滿分。細節見[總覽的作業段落](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)。

運算資源那頁反映的是 2023 年的狀況：預期提供 AWS credits、建議 Colab Pro（每月 9.99 美元）、SageMaker Studio Lab、Cohere 的免費額度，以及 OpenAI 新帳號的 5 美元 credits。今天自學時，這些條件都要自己重新確認。

## setup.ipynb 今天長什麼樣

「For next time」那頁第一項是跑 [setup.ipynb](https://github.com/cgpotts/cs224u/blob/main/setup.ipynb)。repo 裡現在的版本字串是「CS224u, Stanford, Fall 2024」，比課程網站晚了三個學期，這是後來線上梯次的維護痕跡。

它要你做的事：

- 用 Anaconda 建一個叫 `nlu` 的 Python 3.9 環境
- clone [cgpotts/cs224u](https://github.com/cgpotts/cs224u)
- 依 CPU／GPU 設定 `DEVICE`，取消 `requirements.txt` 裡 torch 那幾行的註解再安裝
- 跑兩個檢查 cell：`torch.__version__` 要以 `2.4.0` 開頭，`transformers` 要大於 4.37

notebook 自己也說，檢查沒過「也許還行」，但這些函式庫變得很快，不保證向下相容。

## 今晚可以做的事

```bash
git clone https://github.com/cgpotts/cs224u.git
cd cs224u
conda create -n nlu python=3.9
conda activate nlu
# 取消 requirements.txt 中 torch 相關行的註解後：
pip install -r requirements.txt
```

裝完打開 setup.ipynb，跑最後兩個版本檢查 cell。兩個都過，下一篇的 Transformer 投影片和第一份作業就能照原樣跟上。

如果只有半小時，就讀 [Levesque 2013](http://www.cs.toronto.edu/~hector/Papers/ijcai-13-paper.pdf) 的第 2.2 節「Cheap tricks」，然後拿你常用的模型問一題你自己想的鱷魚題。

## 延伸閱讀

- [CS224N 導讀：NLP 的歷史](/posts/ai/2026-08-22-cs224n-history-nlp)：從另一門先修課的角度看同一段歷史
- [Stanford CS224U 導讀：總覽](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)：開課狀態、三份作業、期末專案評分文件、自學環境的坑

**系列導覽**：上一篇 [總覽](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)｜下一篇 [上下文表徵 I：guiding ideas、Transformer 與位置編碼](/posts/ai/2026-09-29-cs224u-contextual-reps-transformer)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。依官方播放清單逐講核對影片 ID 與講次，確認無誤，影片標題改用原標題。
- 2026-10-10：依字幕核對影片內容。更正一句不符字幕處：課程地圖後半與課務是在『第二天』（影片 02）講的，不是全在 4 月 3 日第一堂；其餘影片說法與字幕相符。

## 參考資料

- [CS224U 課程網站（Spring 2023）](https://web.stanford.edu/class/cs224u/)
- [Introduction and course overview 投影片（handout PDF）](https://web.stanford.edu/class/cs224u/slides/cs224u-intro-2023-handout.pdf)
- [XCS224U Spring 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [影片 01：Intro & Evolution of Natural Language Understanding, Pt. 1](https://www.youtube.com/watch?v=K_Dh0Sxujuc)
- [影片 02：Course Overview, Part 2](https://www.youtube.com/watch?v=J52Dtu40esQ)
- [setup.ipynb（cgpotts/cs224u）](https://github.com/cgpotts/cs224u/blob/main/setup.ipynb)
- [Levesque (2013). On our best behaviour. IJCAI](http://www.cs.toronto.edu/~hector/Papers/ijcai-13-paper.pdf)
- [Manning (2015). Computational Linguistics and Deep Learning. Computational Linguistics 41(4)](https://aclanthology.org/J15-4006/)
- [Bommasani et al. (2021). On the Opportunities and Risks of Foundation Models, §2.6 Philosophy of understanding](https://crfm.stanford.edu/assets/report.pdf#philosophy)
- [Kiela et al. (2021). Dynabench: Rethinking Benchmarking in NLP](https://aclanthology.org/2021.naacl-main.324/)
- [Brown et al. (2020). Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165)
- [Peters et al. (2018). Deep contextualized word representations (ELMo)](https://aclanthology.org/N18-1202/)
- [Kim & Linzen (2020). COGS](https://aclanthology.org/2020.emnlp-main.731/)

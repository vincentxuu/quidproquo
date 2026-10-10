---
title: "CS224U In-context learning：起源、核心概念與建議做法"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, ai-course, stanford, nlp, prompt-engineering, chain-of-thought, dspy]
lang: zh-TW
series:
  name: "Stanford CS224U 導讀"
  order: 7
tldr: "CS224U 2023 春季版把 in-context learning 定義成「凍結的語言模型只靠 prompt 完成任務」，並提醒 few-shot 的第二個條件（訓練時沒看過同類例子）幾乎無法驗證。Potts 的 38 頁投影片從 GPT-2 的 TL;DR 講到 demonstration 怎麼挑、chain of thought、self-consistency、DSP，最後給四條建議：先建 dev/test、了解目標模型的指令格式、把寫 prompt 當成 AI 系統設計。Mina Lee 的客座則反過來問：該學會讀懂 prompt 的，是人還是模型？"
description: "Stanford CS224U（Spring 2023）in-context learning 單元導讀：依據 incontextlearning 投影片與 XCS224U 錄影 20–23，整理 GPT-2／GPT-3 的起源、zero-shot 與 few-shot 的嚴格定義、「模型只是預測下一個 token 嗎」、instruction tuning 與 Alpaca、demonstration 的選法、CoT／self-consistency／Self-Ask／DSP，以及 Mina Lee「Prompters before prompts and promptees」客座投影片。"
draft: false
glossary:
  - term: "in-context learning"
    aliases: ["ICL"]
    definition: "語言模型參數完全凍結、沒有任何梯度更新，只靠輸入的 prompt 文字完成任務。"
    context: "這是 CS224U 投影片的定義；few-shot 與 zero-shot 都是它的特例。"
  - term: "demonstration"
    aliases: ["示範", "few-shot example"]
    definition: "放進 prompt 裡、示範你希望模型做出的行為的例子，例如一組問題與答案。"
    context: "課程把「怎麼選、怎麼過濾、要不要讓模型改寫 demonstration」當成 ICL 設計的核心問題。"
  - term: "self-consistency"
    definition: "讓模型對同一個問題取樣多條推理路徑，最後選出現次數最多的答案，等於把推理路徑邊際化掉。"
    context: "Wang et al. 2022 提出；DSP 用 dsp.majority 一行就能套上。"
    links:
      - label: "Self-Consistency (arXiv:2203.11171)"
        url: "https://arxiv.org/abs/2203.11171"
  - term: "diegetic prompt"
    aliases: ["non-diegetic prompt"]
    definition: "diegetic prompt 是使用者正在寫的內容本身（例如寫到一半的故事）；non-diegetic prompt 是給模型的明確指令，不會出現在最終成品裡。"
    context: "Mina Lee 客座投影片引用 Dang et al. 2023 的區分。"
---

> 🌏 [English version](/posts/ai/2026-09-29-cs224u-in-context-learning-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CS224U](https://web.stanford.edu/class/cs224u/) 2023 春季版。主要材料是 [In-context learning 投影片](https://web.stanford.edu/class/cs224u/slides/cs224u-incontextlearning-2023-handout.pdf)（Christopher Potts，38 頁）、[XCS224U 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp) 第 20–23 支錄影，以及講次表上 Mina Lee 客座的 [公開投影片](https://drive.google.com/file/d/1RIOAOTOOPyVLezFiIfGnYJSE8ofKuR4L/view)，事實皆於 2026-09-29 核對。存取等級 **A3**；Mina Lee 的客座**沒有公開錄影**（播放清單裡沒有），只能依投影片。

**系列位置**：上一篇 [資訊檢索](/posts/ai/2026-09-29-cs224u-information-retrieval)｜下一篇 [作業二：用 DSPy 做少樣本 OpenQA](/posts/ai/2026-09-29-cs224u-hw2-openqa-dspy)｜[系列總覽](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)

上一篇講怎麼找到證據，這一篇講怎麼把證據與例子放進 prompt，讓一個**不做任何訓練**的語言模型把事情做對。兩者在作業二合起來：凍結的檢索器，加上凍結的語言模型。

Potts 在 [ICL 第 4 支錄影](https://www.youtube.com/watch?v=0mXbM2j3Dzs) 開頭先打了預防針：他幾乎確定幾個月後就會有人發現更強的技巧，讓這支錄影顯得過時。所以讀這個單元，重點不在 2023 年的具體招式，而在它怎麼定義問題、怎麼判斷一個技巧值不值得用。

投影片分五節：Origins、Core concepts、The current moment、Techniques、Suggested methods。

## 課程影片來源

下列影片是 Stanford Online 發布的 Spring 2023 對應講次錄影，與本文採用的 2023 年春季版課程一致。2026-10-10 已對照官方播放清單（50 支）核對標題與影片 ID。

```youtube
url: https://www.youtube.com/watch?v=0mXbM2j3Dzs
title: Stanford XCS224U: NLU I In-context Learning, Part 4: Techniques and Suggested Methods I Spring 2023
```

```youtube
url: https://www.youtube.com/watch?v=eyNLkiQ89KI
title: Stanford XCS224U: Natural Language Understanding I In-context Learning, Pt 1: Origins I Spring 2023
```

原始影片：[Stanford XCS224U: NLU I In-context Learning, Part 4: Techniques and Suggested Methods I Spring 2023](https://www.youtube.com/watch?v=0mXbM2j3Dzs)、[Stanford XCS224U: Natural Language Understanding I In-context Learning, Pt 1: Origins I Spring 2023](https://www.youtube.com/watch?v=eyNLkiQ89KI)

內容核對：已依字幕核對（2026-10-10）：影片 Part 4（Techniques and Suggested Methods）與 Part 1（Origins）的字幕逐項對照：Potts 的過時預告、demonstration 的選法與四類方式、ELMo 示範過濾例子、CoT／generic step-by-step／self-consistency（dsp.majority）／Self-Ask／反覆改寫、DSP 結果的解讀與四條建議；Origins 的 ChomskyBot、Brants 2007、decaNLP、GPT-2 的 TL;DR 與翻譯、GPT-3 摘要，皆吻合。文中引用但未嵌入的 Part 2（Core Concepts）與 Part 3（Current Moment）也讀過，術語定義、第 (2) 條無法驗證、生成是強加的規則、Potts 選第 4 個說法、Alpaca 的 175 個種子任務與 52,000 個例子皆吻合。HotPotQA 的 28.3／36.9／51.4 與 Mina Lee 客座屬投影片內容（客座無錄影），未以字幕驗證。

課程與錄影入口：

- [XCS224U 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [官方課程／講次來源](https://web.stanford.edu/class/cs224u/)

## 起源：從 n-gram 到 GPT-3

投影片先開了個玩笑：ChomskyBot，一個模仿 Noam Chomsky 文風、機制非常簡單的樣式式語言模型。[ICL 第 1 支錄影](https://www.youtube.com/watch?v=eyNLkiQ89KI) 說這只是半開玩笑，它提醒我們簡單機制也能產生看似有內容的文字。

接著是三個早期前例：

- 深度學習之前的 n-gram 語言模型就已經很大：[Brants et al. 2007](https://aclanthology.org/D07-1090/) 用了一個 3,000 億參數、以 2 兆 token 訓練的模型做機器翻譯。
- [decaNLP（McCann et al. 2018）](https://arxiv.org/abs/1806.08730) 用自然語言問題當任務指令做多任務訓練。
- GPT 原始論文（Radford et al. 2018）裡已經藏著一些初步的 prompt 實驗。

真正的起點，Potts 認為是 [GPT-2（Radford et al. 2019）](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)。投影片直接引用論文原文：要模型做摘要，就在文章後面加上 `TL;DR:` 然後生成 100 個 token；要它翻譯，就在 context 裡放幾組「英文句子 = 法文句子」再接一個「英文句子 =」。Potts 說他第一次聽到時，以為那個 token 是特別訓練過的，結果不是。

文化上的轉折點是 [GPT-3（Brown et al. 2020）](https://arxiv.org/abs/2005.14165)：1,750 億參數，比先前任何非稀疏語言模型大十倍，所有任務都不做梯度更新。Potts 特別喜歡摘要裡「non-sparse」這個詞，因為它向前面那些巨大的 n-gram 模型點了個頭。

## 核心概念：定義比你想的嚴格

### 三個術語

投影片的定義：

- **In-context learning**：凍結的語言模型只靠 prompt 文字完成任務。
- **Few-shot in-context learning**：(1) prompt 裡有目標行為的例子；(2) 訓練時沒看過目標行為的例子。
- **Zero-shot in-context learning**：(1) prompt 裡沒有目標行為的例子（可以有其他指令）；(2) 訓練時沒看過目標行為的例子。

兩個 shot 的定義底下都掛著同一句：**我們不太可能驗證第 (2) 點。** 現在的模型用海量文字訓練，我們通常不知道、也無法稽核裡面有什麼。Potts 在 [ICL 第 2 支錄影](https://www.youtube.com/watch?v=7OOCV8XfMbo) 的說法是：如果模型訓練時看過這類例子，那就稱不上 few-shot 了。

另外兩個細節：監督式學習裡的「few-shot」指「用少量例子做梯度更新」，跟這裡不是同一件事；格式說明與其他指令算灰色地帶，課程決定把它們歸在 zero-shot。

### 自回歸模型「只是預測下一個 token」嗎？

這一節複習 GPT 的訓練與生成，重點放在一個觀念：模型每一步輸出的是**整個詞彙表上的分數向量**，挑哪個 token 是我們另外決定的規則（greedy decoding、beam search 等）。生成不是模型內在的能力，是我們強迫它做的事。

投影片把這個問題列成四個遞進的答案：

1. 是，它就只做這件事。
2. 更精確地說，它每一步對整個詞彙表打分，我們再用這些分數強迫它選一個 token。
3. 而且它在內部與輸出表徵裡也表示了資料。
4. 但整體而言，對大眾溝通時說「它就是預測下一個 token」可能最好。

Potts 選第 4 個作為對外說法，理由是這個機械式的描述最能幫一般人校準期待。「Better late than ___」與「The key to happiness is ___」對模型來說是同一種機制：高機率的接續。

### Instruction fine-tuning

這一節最後引用了 [ChatGPT 發表文](https://openai.com/blog/chatgpt) 的三步驟訓練圖。Potts 要強調的是其中兩步有人類直接介入：先由人寫示範輸出做監督式學習，再由人替模型的輸出排序。講次表對應的 reading 是 [InstructGPT（Ouyang et al. 2022）](https://arxiv.org/abs/2203.02155)。

他的結論很直接：**這不是魔法。** 模型做出精巧的事，很大程度是因為很精巧的人教過它做這些事。這一點也決定了 ICL 技巧為什麼有效，下一節會回到這裡。

## 2023 年的當下：資料、Alpaca 與模型大小

第三節整理當時的資料來源：自監督訓練用的公開語料（OpenBookCorpus、[The Pile](https://pile.eleuther.ai)、BigScience、Wikipedia、Pushshift Reddit、C4），以及 instruction tuning 資料。後者投影片直說：我們不太知道業界大實驗室在做什麼，只能推測他們付錢請很多人寫資料，也用自己的模型生成與裁決例子。

接著介紹 [Self-Instruct（Wang et al. 2022）](https://arxiv.org/abs/2212.10560) 與 [Alpaca](https://crfm.stanford.edu/2023/03/13/alpaca.html)。[ICL 第 3 支錄影](https://www.youtube.com/watch?v=a9KQkvcuV3I) 是這樣描述 Alpaca 的做法：

- 起點是 Meta 的 LLaMA 7B。
- 種子是 Self-Instruct 論文裡 175 個人寫的任務。
- 讓 text-davinci-003 照種子生成新的輸入輸出對，累積到 52,000 個例子。
- 最後拿這批例子微調 LLaMA。

Potts 從這裡拉出兩個教訓。技術上，小模型經過 instruction tuning 也能很強，模型大小可能開始往下走（投影片接連兩張：「Model sizes go up up up」與「Model sizes may be coming down」）。對 ICL 來說，**你的 prompt 越貼近模型看過的 instruction tuning 資料，效果越好**；大模型的這份資料通常不公開，所以大家只能在實作中慢慢摸出哪些 prompt 格式有效。

## 技巧：demonstration、推理鏈與 DSP

### Demonstration 怎麼選

以作業二的 OpenQA 為例：問題是「Who is Bert?」，prompt 裡放一段檢索到的段落，再放一組示範問答。

第一個選擇點就違反直覺。示範答案可以直接用訓練集裡的標準答案，但 Potts 說，**改用檢索或由模型自己生成的答案可能更好**，因為這樣更貼近模型實際做得到的事。示範用的段落也一樣：就算訓練集有標準段落，用檢索到的段落更能模擬目標問題的處境。

投影片把挑選方式整理成四類：

| 方式 | 例子 |
|---|---|
| 從資料中隨機挑 | — |
| 依與目標例子的關係挑 | 生成任務：檢索與目標輸入相似的例子；分類任務：幫模型隱約判斷目標輸入的類型 |
| 依條件過濾 | 生成任務：證據段落包含答案、或模型能預測出正確答案；分類任務：每個標籤都要出現 |
| 取樣後讓模型改寫 | 把多個示範合成一個；改寫風格或格式以配合目標 |

投影片底下有一句要讀者「習慣一下」的話：**你的 prompt 可能包含由另一個 prompt 對同一個模型生成的子字串。**

錄影接著逐步走過作業二的一個例子。示範問題是「Who is ELMo?」，訓練集答案是「ELMo is a friendly monster」，但檢索到的段落卻在講 ELMo 這個 LSTM 模型。怎麼自動抓出這種不搭的示範？再呼叫一次語言模型，讓它用那段檢索結果回答示範問題；它答「ELMo is an LSTM」，跟標準答案不符，就把這個示範丟掉，重新取樣。

### 推理鏈與它的變體

- **[Chain of Thought（Wei et al. 2022）](https://arxiv.org/abs/2201.11903)**：用手工建構的示範，引導模型一步步寫出推理再給答案。Potts 提醒原版很客製化，而且模型也可能被一路帶到錯的答案。
- **Generic step-by-step with instructions**：Potts 自己的命名。不寫客製示範，改用一段高層次指令描述推理的樣子。他用 text-davinci-003 示範一個含否定的條件句問題：直接問答錯了，加上這種指令後答對，還把推理講清楚。他的解讀是這種格式借用了模型 instruction tuning 時學到的東西。
- **[Self-consistency（Wang et al. 2022）](https://arxiv.org/abs/2203.11171)**：取樣多條推理路徑，選出現最多次的答案。有效但要付很多次取樣的成本。投影片附了在 DSP 裡用 `dsp.majority` 實作的程式碼。
- **[Self-Ask（Press et al. 2022）](https://arxiv.org/abs/2210.03350)**：讓模型把問題拆成子問題自問自答；子問題可以交給搜尋引擎回答，特別適合多跳問題。
- **反覆改寫**：讓模型改寫自己 prompt 的某些部分（示範、段落、問題），例如多跳搜尋時每一步先摘要已找到的段落，再產生下一個搜尋查詢。

### DSP 的結果與它的警語

投影片最後放了 [DSP（Demonstrate–Search–Predict，Khattab et al. 2022）](https://arxiv.org/abs/2212.14024) 論文的結果表。以 HotPotQA 的 EM 為例，單純的語言模型是 28.3，retrieve-then-read 是 36.9，針對任務寫的 DSP 程式是 51.4。講次表把 [Lazaridou et al. 2022](https://arxiv.org/abs/2203.05115) 列為 retrieve-then-read 這條路線的 reading。

Potts 對這張表的解讀比數字本身更值得記。他說只有在「新東西剛出現、大家還在摸索」的時候，才會看到這種大幅領先，所以這代表 ICL 技巧**還在很早期**，他預期差距會隨別人找到更好的方法而縮小。他要讀者把 DSP 當成一種把軟體工程帶進 prompt 工程的工具。

課程當時連到的 `github.com/stanfordnlp/dsp`，2026-09-29 開啟會轉址到 [stanfordnlp/dspy](https://github.com/stanfordnlp/dspy)，也就是作業二實際使用的 DSPy。

## 建議做法：四條

投影片最後一節只有一張，四條建議：

1. **先替你要解的任務建立自己的 dev/test 集**，格式要能套用很多種 prompt。Potts 說要先做這件事，探索時才有固定的目標。
2. **盡量了解目標模型**，特別是它有沒有針對特定指令格式做過 tuning。
3. **把寫 prompt 當成 AI 系統設計。** 寫系統化、可泛化的程式，處理從讀資料到擷取回應、分析結果的整個流程，不要一個一個手敲 prompt。
4. **在當下（而且可能只是很短的時期），結合多個預訓練元件與工具的 prompt 設計，相對於潛在價值還沒被充分探索。** 這個單元探索的是檢索模型加語言模型，但計算機、天氣 API 等工具也都能接進來。

第 4 條的「當下」指的是 2023 年春天，投影片自己就把它標成可能很短暫的時期。讀的時候把它當成那個時間點的判斷，而不是永久規則。

## 客座：Mina Lee「Prompters before prompts and promptees」

講次表在這個單元排了一場 Mina Lee 的客座，[投影片](https://drive.google.com/file/d/1RIOAOTOOPyVLezFiIfGnYJSE8ofKuR4L/view) 公開在 Google Drive（檔名 `[23.04.24] Prompters @ CS224U.pdf`，93 頁）。它跟 Potts 的投影片方向相反：Potts 教你怎麼替模型寫 prompt，Mina Lee 問的是**人實際上怎麼寫 prompt**。

她用一題 [MMLU](https://arxiv.org/abs/2009.03300) 當主線：「Nixon 辭職前，有多少人認為他應該被免職？」研究者建構的 prompt 用固定模板、few-shot 或 CoT；投影片示範的真人第一次嘗試只貼了問題、沒附選項，得到一段含糊的答案；之後補上選項、換個問法，才慢慢摸索出有效的寫法。投影片的整理是：人一開始通常「不擅長」下 prompt，策略可以被教會、可以由社群累積，但可能只對某個模型有效，而且可能很反直覺（引用 [Webson & Pavlick 2022](https://aclanthology.org/2022.naacl-main.167/)）。

她的核心論點是一個錯位：**研究者替模型建構的 prompt，和真人實際寫的 prompt 不一樣。** 現在是人在學著替模型寫 prompt，但應該反過來，模型要被訓練與評估成能理解人寫的 prompt。

接著她列出對人重要的模型性質：直覺性（理解指令背後的意圖）、穩健性（一致、可預測、能處理使用者差異）、校準（信心與正確率相符），以及可教性與互補性。要研究這些，她提出用**互動紀錄**（interaction trace，帶時間戳的按鍵層級事件序列）分析人與模型的互動過程。

投影片引用的兩個研究結果：

- [CoAuthor（Lee et al. 2022）](https://arxiv.org/abs/2201.06796)：使用者與 GPT-3 共寫時，七成多的建議會被接受；人機合寫的文字錯誤最少、詞彙也最多樣。
- [Evaluating Human-Language Model Interaction（Lee et al. 2022）](https://arxiv.org/abs/2212.09746)：在問答任務（Nutrition 類別）上，zero-shot 表現較差的 TextBabbage，搭配人類使用後的表現與 TextDavinci 相當。

最後一個結果跟 Potts 的第 1 條建議剛好互補：**模型單獨的 benchmark 分數，不等於人用它時的表現。**

## 自學怎麼用這個單元

1. 看 [ICL 第 2 支錄影](https://www.youtube.com/watch?v=7OOCV8XfMbo) 的術語定義，把 zero-shot 與 few-shot 的第 (2) 條記住，之後讀任何宣稱 few-shot 的論文都拿來問一次。
2. 看 [ICL 第 4 支錄影](https://www.youtube.com/watch?v=0mXbM2j3Dzs) 的 ELMo 例子。Potts 說作業二裡這一題常讓人想不通，但直覺其實很清楚。
3. 讀 Mina Lee 的投影片，拿它的「人怎麼寫 prompt」對照你自己第一次用聊天機器人的樣子。
4. 接著進 [作業二](https://github.com/cgpotts/cs224u/blob/main/hw_openqa.ipynb)；DSPy 版本釘在 2.4.13，與現行 API 的落差見 [系列總覽](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)。

今晚可以做的一件事：挑一個你常叫模型做的任務，先寫 10 題有標準答案的 dev set，再改 prompt。這正是投影片第 1 條建議，也是最常被跳過的一步。

## 延伸閱讀

- In-context learning 在預訓練脈絡裡的位置：[CS224N 第 7 講：預訓練、subword 與 in-context learning](/posts/ai/2026-08-22-cs224n-pretraining)
- Instruction tuning 與 RLHF 的細節：[CS224N 第 8 講：從 instruction tuning、RLHF 到 DPO](/posts/ai/2026-08-22-cs224n-post-training)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。依官方播放清單逐講核對影片 ID 與講次，確認無誤，影片標題改用原標題。
- 2026-10-10：依字幕核對影片內容。未發現與字幕不符之處，僅加上核對標記。

## 參考資料

- [CS224U 課程官網（Spring 2023）](https://web.stanford.edu/class/cs224u/) — 講次表、客座安排與 readings
- [In-context learning 投影片（Potts, Spring 2023）](https://web.stanford.edu/class/cs224u/slides/cs224u-incontextlearning-2023-handout.pdf) — 本文的術語定義、四個答案、demonstration 分類、DSP 結果表與四條建議
- [ICL Part 1: Origins 錄影](https://www.youtube.com/watch?v=eyNLkiQ89KI)
- [ICL Part 2: Core Concepts 錄影](https://www.youtube.com/watch?v=7OOCV8XfMbo) — 第 (2) 條無法驗證的說明、生成是我們強加的規則
- [ICL Part 3: Current Moment 錄影](https://www.youtube.com/watch?v=a9KQkvcuV3I) — Alpaca 的 175 個種子任務與 52,000 個例子
- [ICL Part 4: Techniques and Suggested Methods 錄影](https://www.youtube.com/watch?v=0mXbM2j3Dzs) — ELMo 示範過濾例子、DSP 結果的解讀
- [Mina Lee, Prompters before prompts and promptees（CS224U 客座投影片，Google Drive）](https://drive.google.com/file/d/1RIOAOTOOPyVLezFiIfGnYJSE8ofKuR4L/view)
- [Radford et al., Language Models are Unsupervised Multitask Learners (GPT-2, 2019)](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
- [Brown et al., Language Models are Few-Shot Learners (GPT-3, 2020)](https://arxiv.org/abs/2005.14165)
- [Ouyang et al., Training language models to follow instructions with human feedback (2022)](https://arxiv.org/abs/2203.02155)
- [Wei et al., Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (2022)](https://arxiv.org/abs/2201.11903)
- [Wang et al., Self-Consistency Improves Chain of Thought Reasoning in Language Models (2022)](https://arxiv.org/abs/2203.11171)
- [Press et al., Measuring and Narrowing the Compositionality Gap in Language Models (Self-Ask, 2022)](https://arxiv.org/abs/2210.03350)
- [Lazaridou et al., Internet-augmented language models through few-shot prompting for open-domain question answering (2022)](https://arxiv.org/abs/2203.05115)
- [Khattab et al., Demonstrate-Search-Predict (2022)](https://arxiv.org/abs/2212.14024)
- [Wang et al., Self-Instruct (2022)](https://arxiv.org/abs/2212.10560)
- [Stanford CRFM, Alpaca (2023-03-13)](https://crfm.stanford.edu/2023/03/13/alpaca.html)
- [stanfordnlp/dspy](https://github.com/stanfordnlp/dspy) — 原 `stanfordnlp/dsp` 的轉址目的地

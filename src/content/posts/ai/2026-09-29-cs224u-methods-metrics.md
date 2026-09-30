---
title: "CS224U 方法與指標 I：accuracy 0.81 的分類器、macro F1 只有 0.43——分類指標與生成指標各自編碼了什麼價值"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, evaluation, metrics, nlp, stanford, ai-course]
lang: zh-TW
series:
  name: "Stanford CS224U 導讀"
  order: 13
tldr: "CS224U 投影片用同一張三類別混淆矩陣算出 accuracy 0.81、macro F1 0.43：一個指標說系統很好，另一個說它在兩個小類別上幾乎全錯。這個單元的主張是「不同指標編碼不同價值」，並逐一列出 accuracy、F 分數三種平均、perplexity、word error rate、BLEU 各自的範圍、價值與弱點。期末專案的評分看的也是指標選得對不對，不是分數高不高。"
description: "Stanford CS224U（Spring 2023）NLP methods and metrics 單元前半導讀：2010 與 2023 年實驗方法的差異、兩條不能破的規則、分類指標（accuracy、precision、recall、F 分數與 macro／weighted／micro 平均、PR 曲線）、生成指標（perplexity、WER、BLEU 與其他參考式、無參考式、任務導向指標），以及 evaluation_metrics.ipynb 與 Resnik and Lin 2010。"
draft: false
glossary:
  - term: "macro-averaged F1"
    aliases: ["macro F1"]
    definition: "先算每個類別的 F1，再不加權地平均，等於假設每個類別一樣重要。"
    context: "本文的混淆矩陣裡，它把 accuracy 0.81 背後兩個小類別的失敗暴露出來。"
  - term: "brevity penalty"
    aliases: ["BP"]
    definition: "BLEU 裡用來代替 recall 的項：生成文字比參考文字短時扣分，長度夠了就不再扣。"
    context: "避免系統靠只輸出極短、極精確的句子拿高分。"
---

> 🌏 [English version](/posts/ai/2026-09-29-cs224u-methods-metrics-en)

**本文依據 [CS224U](https://web.stanford.edu/class/cs224u/) 2023 春季版。** 這是 [Stanford CS224U 導讀](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)系列第 13 篇，範圍是 NLP methods 單元的前半：總論、分類指標、生成指標。講次表把這個單元排在 2023 年 5 月 17、22、24 日。同一欄的 Experimental protocol 截止日是 5 月 29 日。

用到的官方材料有：投影片 [Methods and metrics](https://web.stanford.edu/class/cs224u/slides/cs224u-methods-2023-handout.pdf) 第 1–41 頁（全份 94 頁）、播放清單的影片 39–41、repo 裡的 [`evaluation_metrics.ipynb`](https://github.com/cgpotts/cs224u/blob/main/evaluation_metrics.ipynb)，以及講次表的指定閱讀 [Resnik and Lin 2010](https://home.cs.colorado.edu/~jbg/teaching/CMSC_773_2012/reading/evaluation.pdf)。存取等級是 **A3（歷史版）**。

資料集、資料切分、模型比較是投影片後半，留給[下一篇](/posts/ai/2026-09-29-cs224u-datasets-model-evaluation)。

## 為什麼一門 NLU 課要專門講指標

前兩篇（[解釋方法 I](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution)、[II](/posts/ai/2026-09-29-cs224u-causal-abstraction-iit-das)）處理的是「模型內部在做什麼」。這一篇退回一個更基本的問題：你拿來下結論的那個數字，到底在量什麼？

投影片第 5 頁先講專案評分。課程**永遠不會以結果「好不好」來評分**。發表場合有篇幅限制，所以偏好正面結果；這門課沒有這個限制，正面、負面、介於中間的結果都一樣有價值。評分看的是三件事：

1. 指標是否恰當
2. 方法是否紮實
3. 論文是否坦白、清楚地面對自己發現的侷限

[`projects.md`](https://github.com/cgpotts/cs224u/blob/main/projects.md) 的 Experimental protocol 段落也這樣寫。Metrics 那一欄要你說明評估依據；選標準做法（例如分類用 F1）不用多解釋，偏離標準或自創指標就要給理由。

## 2010 年的規矩，2023 年守不住了

投影片第 6 頁把兩個年代的實驗流程並排：

| 步驟 | 約 2010 年 | 2023 年 |
|---|---|---|
| 1 | 用訓練資料的小樣本把整套系統做出來 | 一樣 |
| 2 | 只在訓練資料上做 cross-validation | 要嘛根本沒有訓練資料，要嘛 cross-validation 要花 2 萬美元、跑半年 |
| 3 | 很少碰 dev，避免在上面爬山 | dev 對最佳化至關重要，也是 test 的絕佳代理 |
| 4 | 最後用 dev 完整調一次超參數，選最佳模型，跑 test | 超參數調整要 10 萬美元、十年；或者沒有超參數，但跑一次 test 的 API 費用就要 4 千美元 |

投影片第 7 頁的結論是：舊規矩的精神完全正確，但只有最有錢的機構守得住，把其他人排除在外會很糟。所以要做的是**把方法和背後的理由寫清楚**，連實務細節一起。有兩條規則絕對不能動：

- **絕不用 test set 的結果做任何模型選擇**，連非正式的都不行。
- **讓每個被比較的系統都有最好的機會**，不要偏袒你在推的那個系統。

**怎麼做**：專案筆記裡開一個「test set 碰過幾次、為什麼碰」的紀錄欄，每跑一次 test 就寫一行。

## Strathern 定律與排行榜

投影片第 8 頁引用 Strathern 定律：「當一個量測變成目標，它就不再是好的量測。」排行榜的好處是提供客觀比較，讓看起來很瘋的點子也有機會被聽見。壞處是三種混淆：把 benchmark 進步當成真正的進步、把 benchmark 當成整個領域（「X 已經解決了」）、把 benchmark 表現當成能力。

第 9 頁列出幾個真實應用的需求。例如漏掉安全訊號會出人命，但人工複查可行；某些錯誤是致命的，其他幾乎無所謂；解法不能對特定族群提供較差的服務。然後他寫：「我們（表面上的）答案：F1 和它的朋友們。」影片 39 用的詞是「tragically」。

總論其餘幾頁談 [Dynascores](https://github.com/cgpotts/cs224u/blob/main/dynascoring.ipynb) 這類多維排行榜、「人類表現」其實接近「趕工的群眾標注者重複做機器任務的平均表現」（Pavlick and Kwiatkowski 2019），以及評估從一維、由研究社群定義，走向高維、由利害關係人定義。Dynascores 在下一篇展開。

## 分類指標：同一張矩陣，三種說法

投影片第 18 頁的原則是：**不同指標編碼不同價值**。選指標是實驗設計的一部分；面對既定任務時，你會被期待用某些指標，但你有權反駁。

投影片一路用同一張三類別混淆矩陣（列為正確答案，欄為預測）：

| 正確 \ 預測 | pos | neg | neutral | support |
|---|---|---|---|---|
| pos | 15 | 10 | 100 | 125 |
| neg | 10 | 15 | 10 | 35 |
| neutral | 10 | 100 | 1000 | 1110 |

第 19 頁特別提醒：這些類別預測背後**已經套了一個門檻**。機率式分類器輸出的是分布，變成類別標籤時你已經做了一次選擇。

投影片算出的各類別數字：

| 類別 | precision | recall | F1 |
|---|---|---|---|
| pos | 0.43 | 0.12 | 0.19 |
| neg | 0.12 | 0.43 | 0.19 |
| neutral | 0.90 | 0.90 | 0.90 |

macro F1 是三者直接平均，得 **0.43**。micro-averaged F1 的「yes」分數，投影片註明等於 accuracy，這裡是 **0.81**。用投影片第 27 頁的加權公式代入 support，我自己算出 weighted F1 約為 0.81。

同一個系統，報 accuracy 或 weighted F1 看起來都不錯，報 macro F1 就看得到 pos 和 neg 幾乎都錯了。neutral 占 1,270 筆裡的 1,110 筆，大類別把數字撐了起來。

各指標的價值與弱點（整理自投影片第 20–29 頁）：

| 指標 | 編碼的價值 | 弱點 |
|---|---|---|
| Accuracy | 系統多常答對 | 沒有各類別分數；不控制類別大小 |
| Precision | 懲罰猜錯 | 很少猜 k，就能拿到高 precision |
| Recall | 懲罰漏掉 | 永遠猜 k，就能拿到高 recall |
| F<sub>β</sub> | precision 與 recall 的平衡，β 控制權重（預設 1） | 不隨資料集大小正規化；忽略 k 所在列與欄以外的格子 |
| Macro F | 假設所有類別一樣重要 | 只在小類別表現好的系統，放到真實世界不一定好；反之亦然 |
| Weighted F | 假設類別大小重要 | 大類別主導 |
| Micro F | 「yes」分數等於 accuracy | 同 weighted，而且分成 yes／no 兩個分數，沒有單一摘要數字 |

另外兩點：accuracy 跟 cross-entropy loss 成反比；KL 散度可以看成 soft label 版的 accuracy（投影片第 21 頁）。precision–recall 曲線把每個預測機率都當成一個門檻，避開「選門檻」和「選 β」兩個決定。真的要一個數字時，用 average precision 摘要整條曲線。

notebook 涵蓋的比投影片多：ROC 曲線（notebook 註明只適用二元問題），以及迴歸指標（MSE、R²、Pearson、Spearman）。

**怎麼做**：你手上任何一個分類器，今晚用 `sklearn.metrics.classification_report` 印一次。三種平均（macro／weighted，以及你的任務適用時的 micro）都印出來，看它們差多少。差距大，就代表類別不平衡正在替你的模型說好話。

## 生成指標：同一件事有很多種好說法

投影片第 32 頁點出根本難題：大部分事情都有不只一種有效的說法。所以你得先決定要量什麼，是流暢度、真實性，還是溝通效果？影片 41 舉例，系統可以非常流暢卻滿口謊話，也可以很不流暢卻達成了溝通目的。

### Perplexity

序列的 perplexity 是模型給每個時間步機率的幾何平均的倒數；整個語料的平均也要用幾何平均。範圍是 [1, ∞]，1 最好，等於 cross-entropy loss 取指數。影片 41 特別指出：現在的語言模型幾乎都用 cross-entropy 訓練，**不管你願不願意，都等於在對 perplexity 最佳化**。

弱點都來自它太依賴設定：

- **高度依賴詞彙表**：把所有 token 都換成同一個 UNK，perplexity 完美，生成系統卻一塌糊塗。
- **不能跨資料集比較**。
- **連跨模型比較都很麻煩**：tokenization、資料集等條件都得一致。

### Word error rate

WER 是預測與參考文字的編輯距離除以參考長度，語料層級則是距離總和除以長度總和。範圍 [0, ∞]，0 最好。它其實是一個指標家族，取決於你選的距離函數。弱點是只能用一份參考文字，而且非常「句法」：It was good、It was not good、It was great 三句彼此的距離差不多，但語意上第一句和第三句接近。

### BLEU

BLEU 想處理「一個輸入有多個合適輸出」的問題。它有兩個部分：

- **Modified n-gram precision**：投影片第 37 頁的例子是候選句「the the the the the the the」，對照兩份參考句「the cat is on the mat」與「there is a cat on the mat」。候選句有 7 個 the；單一參考句裡 the 最多出現 2 次，所以分數是 2/7。
- **Brevity penalty**：候選太短就扣分，代替 recall 的角色。

BLEU = BP × 各階 n-gram modified precision 的加權組合。範圍 [0, 1]，但沒人期待任何系統拿到 1。投影片第 38 頁列的弱點：有研究認為它跟人工翻譯評分相關性差（Callison-Burch et al. 2006）；對 n-gram 順序很敏感；對 n-gram 類型不敏感（that dog、the dog、that toaster 被一視同仁）；也有研究專門反對拿它評對話系統（Liu et al. 2016）。

### 其他參考式、無參考式、任務導向

投影片第 39 頁的對照：

| 指標 | 做法 |
|---|---|
| WER | 對單一參考文字的編輯距離 |
| BLEU | modified precision + brevity penalty，對多份參考文字 |
| ROUGE | 偏 recall 的 BLEU 變體，主要評摘要 |
| METEOR | 以 unigram 對齊，允許完全比對、詞幹、同義詞 |
| CIDEr | TF-IDF 向量的加權 cosine 相似度 |
| BERTScore | token 層級 BERT 表徵的加權 MaxSim |

影片 41 補充，BERTScore 的計分方式很像[資訊檢索那篇](/posts/ai/2026-09-29-cs224u-information-retrieval)的 ColBERT。

圖像描述類任務可以用無參考式指標，例如 CLIPScore、UMIC、SPURTS，直接給文字與圖片的配對打分。Potts 的團隊在 Kreiss et al. 2022 批評這些指標忽略了圖片出現的情境與文字的目的。

最後是**任務導向指標**（投影片第 41 頁）：現成的參考式指標只抓得到參考標注本身涵蓋的面向。不如直接問生成文字要達成什麼。收到文字的 agent 能不能用它完成任務？特定資訊有沒有可靠地傳達？這則訊息有沒有讓人採取你希望的行動？

**怎麼做**：你的生成任務若已經在用 BLEU 或 ROUGE，挑 20 筆輸出，逐筆寫下「這段文字要讓讀者做到什麼」，再判斷分數高的那幾筆是否真的做到了。

## 指定閱讀：Resnik and Lin 2010

講次表把 Resnik and Lin 列為這個單元的閱讀。它是一本 NLP 合集裡的第 11 章 *Evaluation of NLP Systems*。講次表上的舊網址（`www.cs.colorado.edu`）2026-09-29 查詢時回 404，改成 `home.cs.colorado.edu` 可以打開，本文用後者。

這一章把本單元的直覺整理成幾組概念：

- **Intrinsic 與 extrinsic 評估**：直接依預設準則評系統輸出，或評它對外部任務的影響。以摘要為例，前者問摘要流不流暢、有沒有涵蓋重點；後者問使用者看摘要判斷文件相關性，準確度和速度跟看全文比如何。
- **Formative 與 summative 評估**
- **標注者一致性與上限**
- **Baseline 的角色**：類似實驗裡的對照組。

它跟投影片的「任務導向指標」一段可以對照著讀。

## 動手：evaluation_metrics.ipynb

notebook 版本字串是「CS224u, Stanford, Spring 2023」，作者 Potts。它只 import NLTK（編輯距離與 BLEU）、scikit-learn、NumPy、pandas、SciPy 和 repo 內的 `utils`，**不需要下載任何資料集**。所以這是整個 repo 裡最容易在今天直接跑起來的 notebook 之一。

它的結構跟投影片平行，每個指標都寫成「定義、範圍、價值、弱點、sklearn 或 NLTK 實作」的固定格式。文末指向 scikit-learn 的 [model evaluation 指南](https://scikit-learn.org/stable/modules/model_evaluation.html)，補充分群、排序、標注者一致性等 notebook 沒涵蓋的指標。

## 這一篇可以確認與不能確認的

可以確認：講次表、投影片第 1–41 頁、影片 39–41、notebook 內容與 projects.md 的評分文字。weighted F1 0.81 是我用投影片公式與數字自己算的，投影片上沒有印出最終值。不能確認：Quiz 4 的內容（Canvas 需登入），以及同一單元 Kawin Ethayarajh 客座「Real-world NLP assessments」的內容，講次表上沒有投影片連結，播放清單也沒有影片。

延伸閱讀：站上 [CS224N 的 benchmark 與評估導讀](/posts/ai/2026-08-22-cs224n-benchmark-evaluation)談的是 LLM 時代的 benchmark 設計，可以接著讀。

系列導覽：上一篇 [解釋方法 II：causal abstraction、IIT 與 DAS](/posts/ai/2026-09-29-cs224u-causal-abstraction-iit-das)｜下一篇 [方法與指標 II：資料集、資料切分與模型比較](/posts/ai/2026-09-29-cs224u-datasets-model-evaluation)

## 參考資料

- [CS224U: Natural Language Understanding（Spring 2023 課程官網與講次表）](https://web.stanford.edu/class/cs224u/)
- [Methods and metrics 投影片（Potts, 2023）](https://web.stanford.edu/class/cs224u/slides/cs224u-methods-2023-handout.pdf)
- [影片 39：NLP Methods and Metrics, Part 1: Overview](https://www.youtube.com/watch?v=ORg6bZ3d1Rc)
- [影片 40：Part 2: Classifier Metrics](https://www.youtube.com/watch?v=mbL4uUNtZwY)
- [影片 41：Part 3: Generation Metrics](https://www.youtube.com/watch?v=DXz4IeOENiM)
- [XCS224U Spring 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [evaluation_metrics.ipynb（cgpotts/cs224u）](https://github.com/cgpotts/cs224u/blob/main/evaluation_metrics.ipynb)
- [dynascoring.ipynb（cgpotts/cs224u）](https://github.com/cgpotts/cs224u/blob/main/dynascoring.ipynb)
- [projects.md：Experimental protocol 與評分文件](https://github.com/cgpotts/cs224u/blob/main/projects.md)
- [Resnik and Lin 2010：Evaluation of NLP Systems](https://home.cs.colorado.edu/~jbg/teaching/CMSC_773_2012/reading/evaluation.pdf)
- [scikit-learn：Metrics and scoring（model evaluation）](https://scikit-learn.org/stable/modules/model_evaluation.html)

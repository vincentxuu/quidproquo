---
title: "CS224U 上下文表徵 II：GPT、BERT、RoBERTa、ELECTRA、T5、BART 與蒸餾，各改了預訓練的哪一環"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, ai-course, stanford, transformer, pre-training, nlp]
lang: zh-TW
series:
  name: "Stanford CS224U 導讀"
  order: 4
tldr: "CS224U Spring 2023 把 Transformer 家族講成一條「BERT 的四個已知限制」主線：RoBERTa 回應第一條（最佳化探索不足），ELECTRA 回應第二、三條（[MASK] 造成的落差、每批只有約 15% token 有訓練訊號），XLNet 回應第四條（被遮住的 token 彼此獨立的假設）。GPT 改的是目標函數與 mask，T5、BART 改的是架構與輸入破壞方式，蒸餾改的是模型大小。課程的 2023 年判斷是：自迴歸架構已經勝出，但做表徵時雙向模型可能仍占優勢。"
description: "Stanford CS224U（Spring 2023）contextual representations 投影片後七節與 YouTube 07–13 導讀：GPT 的自迴歸損失與 teacher forcing、BERT 的 MLM 與 NSP、RoBERTa 的設計空間探索、ELECTRA 的生成器與判別器、T5 與 BART 的 seq2seq 預訓練、知識蒸餾的目標層級，以及 vsm_03_contextualreps.ipynb 怎麼從 BERT 取出靜態詞向量。"
draft: false
glossary:
  - term: "MLM"
    aliases: ["masked language modeling", "遮罩語言模型"]
    definition: "把序列裡一小部分 token 遮住或替換，讓模型用左右兩側的上下文把原本的 token 猜回來。只有被遮住的位置會產生訓練訊號。"
    context: "BERT 的主要預訓練目標；RoBERTa 與 ELECTRA 都在改它。"
  - term: "teacher forcing"
    definition: "訓練自迴歸模型時，不管模型在上一步預測了什麼，下一步都餵入正確答案的 token。"
    context: "GPT 訓練時這樣做；生成時沒有正確答案可餵，只能用模型自己的輸出。"
  - term: "distillation"
    aliases: ["knowledge distillation", "知識蒸餾"]
    definition: "訓練一個較小的 student 模型去模仿較大的 teacher 模型的輸入輸出行為，甚至內部表徵，用來換取推論效率。"
    context: "DistilBERT 把 12 層的 BERT-base 蒸餾成 6 層。"
---

> 🌏 [English version](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **本文依據 [CS224U](https://web.stanford.edu/class/cs224u/) 的 2023 春季版。** 這是 [Stanford CS224U 導讀](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)系列的第 4 篇。Transformer block 與位置編碼在[上一篇](/posts/ai/2026-09-29-cs224u-contextual-reps-transformer)，本篇直接從模型家族開始。

同一份 [contextual representations 投影片](https://web.stanford.edu/class/cs224u/slides/cs224u-contextualreps-2023-handout.pdf)的後七節（GPT、BERT、RoBERTa、ELECTRA、seq2seq、Distillation、Wrap-up）對應 [XCS224U 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)的第 07 到 13 支影片。

讀這七節最好的方式，是一直問同一個問題：**這個家族改了預訓練的哪一環？**

## 課程影片來源

下列影片是 Stanford Online 發布的 Spring 2023 對應講次錄影，與本文採用的 2023 年春季版課程一致。2026-10-10 已對照官方播放清單（50 支）比較影片標題與影片 ID。

```youtube
url: https://www.youtube.com/watch?v=sNw40lEhaIQ
title: Stanford XCS224U: NLU I Contextual Word Representations, Part 4: GPT I Spring 2023
```

```youtube
url: https://www.youtube.com/watch?v=H0Zw0_22JRg
title: Stanford XCS224U: NLU I Contextual Word Representations, Part 5: BERT I Spring 2023
```

原始影片：[Stanford XCS224U: NLU I Contextual Word Representations, Part 4: GPT I Spring 2023](https://www.youtube.com/watch?v=sNw40lEhaIQ)、[Stanford XCS224U: NLU I Contextual Word Representations, Part 5: BERT I Spring 2023](https://www.youtube.com/watch?v=H0Zw0_22JRg)
其他相關影片（僅文字連結）：[Stanford XCS224U: NLU I Contextual Word Representations, Part 6: RoBERTa I Spring 2023](https://www.youtube.com/watch?v=ZIRQM-W02Cs)、[Stanford XCS224U: NLU I Contextual Word Representations, Part 7: ELECTRA I Spring 2023](https://www.youtube.com/watch?v=QFMBRk26AjU)、[Stanford XCS224U: NLU I Contextual Word Representations, Part 8: Seq2seq Architectures I Spring 2023](https://www.youtube.com/watch?v=ymKWRZgHwPc)、[Stanford XCS224U: NLU I Contextual Word Representations, Part 9: Distillation I Spring 2023](https://www.youtube.com/watch?v=f9cfLq9T6MI)、[Stanford XCS224U: NLU I Contextual Word Representations, Part 10: Wrap-up I Spring 2023](https://www.youtube.com/watch?v=ni3T4vStzBI)

內容核對：已依字幕核對（2026-10-10）：影片 04（GPT）與影片 05（BERT）的字幕逐項對照：自迴歸損失、attention mask、teacher forcing、『模型預測分數而非 token』、微調方式、GPT 規模表、MLM 與 NSP、[CLS] 微調、BERT 版本與 512 上限、四個已知限制。文中描述但未嵌入的 RoBERTa、ELECTRA、seq2seq、蒸餾與 Wrap-up 五支影片（連結於文中）也讀過字幕，各項說法吻合。唯一無法支持的是『每支約 6 到 14 分鐘』的片長，已刪除。

課程與錄影入口：

- [XCS224U Spring 2023 YouTube 播放清單（影片 07–13）](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [官方課程／講次來源](https://web.stanford.edu/class/cs224u/)

## 先看全貌

| 家族 | 改了哪一環 | 課程引用的證據 |
|---|---|---|
| GPT | 目標函數：自迴歸，只看左邊 | 從 GPT 到 GPT-3 的規模表 |
| BERT | 目標函數：雙向的 MLM ＋ NSP | 原論文自己列的兩個缺點 |
| RoBERTa | 資料量、批次大小、masking 方式、拿掉 NSP | 靜態 vs 動態 masking、批次大小、資料量的消融表 |
| ELECTRA | 訓練訊號：從「猜被遮的詞」改成「判斷每個詞是不是被換過」 | 生成器大小、運算效率、預測範圍的消融 |
| T5、BART | 架構：encoder–decoder；BART 另外改了輸入破壞方式 | T5 的三種架構圖、BART 的破壞方式組合 |
| 蒸餾 | 模型大小：大 teacher 教小 student | DistilBERT 等 GLUE 結果 |

這張表是我依錄影內容整理的，不是投影片原圖。

## GPT：只往左看

**目標函數。** 第 07 支影片從自迴歸損失講起。在位置 t，拿要預測的 token 的嵌入，和模型讀到 t−1 為止形成的隱藏表徵做內積；其餘部分是對整個詞彙表做 softmax 正規化，再取 log、找讓它最大的參數。

<details>
<summary>公式：自迴歸損失（投影片第 29 頁）</summary>

$$\max_{\theta} \sum_{t=1}^{T} \log \frac{\exp\left(e(x_t)^\top h_\theta(x_{1:t-1})\right)}{\sum_{x' \in V} \exp\left(e(x')^\top h_\theta(x_{1:t-1})\right)}$$

</details>

**Mask。** 放進 Transformer 之後，attention 必須遮住未來：位置 a 只能看自己，b 能看 a，c 能看 a 和 b。

**Teacher forcing。** 訓練時不管模型在上一步預測了什麼，下一步都餵正確的 token。Potts 在這裡特別強調一件常被忽略的事：**模型從來不預測 token，它預測的是整個詞彙表上的分數。** 要選哪個 token，是另外加上的決策規則。取最高分是一種，beam search 是另一種，而這些規則並不是模型本身的一部分。

**微調。** 標準做法是在最後一個輸出狀態上加任務參數。第一篇 GPT 論文的微調，Potts 說就他所知完全建立在最後這個狀態上；也可以對所有輸出狀態做 mean 或 max pooling。

**規模。** 投影片列的 OpenAI 系列：

| 模型 | 層數 | d_k | 參數量 |
|---|---|---|---|
| GPT（2018） | 12 | 768 | 1.17 億 |
| GPT-2（2019） | 48 | 1,600 | 約 15 億 |
| GPT-3（2020） | 96 | 12,288 | 1,750 億 |

另一頁列開放模型：GPT-Neo、GPT-J、GPT-NeoX、OPT-66B、BLOOM（1,762 億參數）。投影片自己註明「這張表在任何人讀到之前就會過時」。

## BERT：左右都看，但只從 15% 學

**輸入。** 每個序列以 [CLS] 開頭，[SEP] 分隔。除了詞嵌入和位置嵌入，還有一個 segment 嵌入（SentA、SentB），就是上一篇說的「階層式位置」，例如 NLI 裡的前提與假設。

**MLM。** 把一部分 token 遮住，讓模型用雙向上下文猜回來。投影片示範三種處理：不遮、換成 [MASK]、換成隨機詞（rules 換成 every）。只遮一小部分，其他位置才能提供足夠的上下文。損失函數裡有一個指示變數 m_t，被遮的位置是 1，其他是 0。

<details>
<summary>公式：MLM 損失（投影片第 41 頁）</summary>

$$\max_{\theta} \sum_{t=1}^{T} m_t \log \frac{\exp\left(e(x_t)^\top h_\theta(\hat{x})_t\right)}{\sum_{x' \in V} \exp\left(e(x')^\top h_\theta(\hat{x})_t\right)}$$

$\hat{x}$ 是遮過的序列；$m_t = 1$ 代表位置 $t$ 被遮住。和 GPT 的差別在於 $h_\theta$ 可以用整個序列（扣掉位置 $t$），不只是 $t$ 之前。

</details>

**NSP。** 另一個目標是二元的下一句預測：真實相鄰的兩句標 IsNext，隨機配對的標 NotNext。Potts 說動機是讓模型學到一些篇章層級的資訊。

**微調。** 最輕量的做法是在 [CLS] 的輸出上加幾層 dense。因為 [CLS] 永遠在第一個位置，它會變成一個包含整個序列資訊的固定元素。也可以對所有輸出做 pooling。

**版本。** 原始釋出只有 base 和 large（各有 cased、uncased，Potts 建議一律用 cased）。後來 Google 團隊等釋出更小的版本：BERT-tiny 只有 2 層、400 萬參數，large 是 24 層、3.4 億。全部都用絕對位置編碼，所以最長 512 個 token。

**四個已知限制。** 這一頁是整個單元的樞紐，後面三個家族都在回應它：

1. 原論文的消融與最佳化研究「令人佩服地詳細，但仍然片面」
2. 「預訓練與微調之間有落差」：[MASK] 在微調時從來不會出現（原論文自述）
3. 「每一批只有 15% 的 token 被預測」（原論文自述）
4. 「BERT 假設被預測的 token 在給定未遮住的 token 時彼此獨立」（引自 XLNet 論文）。Potts 的例子是：同時遮住「New」和「York」，模型會各自獨立地猜

## RoBERTa：回應第一條限制

[RoBERTa](https://arxiv.org/abs/1907.11692) 是 Robustly Optimized BERT Approach。投影片逐項對照：

| BERT | RoBERTa |
|---|---|
| 靜態 masking | 動態 masking |
| 輸入是兩段串接的文件片段 | 輸入是連續句子，可以跨文件邊界 |
| 有 NSP | 拿掉 NSP |
| 批次 256 | 批次 2,000 |
| WordPiece | 字元層級的 byte-pair encoding |
| BooksCorpus＋英文維基 | 再加 CC-News、OpenWebText、Stories |
| 訓練 100 萬步 | 最多 50 萬步（但批次大很多，總樣本數更多） |
| 先訓練短序列 | 全程用完整長度 |

證據裡最值得看的是**輸入格式的取捨**。只取同一份文件的句子（DOC-SENTENCES）在他們的 benchmark 上略勝，但團隊選了可以跨文件的 FULL-SENTENCES，理由是比較容易組出有效率的批次。Potts 很欣賞這個決定：這個時代要考慮的不只是準確率，還有資源。

資料量那張表的結論也很直接：從 16GB 加到 160GB、從 10 萬步訓練到 50 萬步，每一步都更好。

Potts 還點出一個方法論上的轉變。RoBERTa 比 BERT 徹底得多，但遠遠不是前深度學習時代那種窮舉超參數的搜尋。原因很簡單：太貴了，所以連 RoBERTa 也只是啟發式、片面的探索。想看更多 BERT 設定上的研究，他推薦 [A Primer in BERTology](https://aclanthology.org/2020.tacl-1.54/)。

## ELECTRA：回應第二、三條限制

[ELECTRA](https://arxiv.org/abs/2003.10555)（投影片引 [Clark et al. 的 ICLR 版本](https://openreview.net/pdf?id=r1xMH1BtvB)）的結構用「the chef cooked the meal」示範：

1. 先像 BERT 一樣遮掉約 15% 的 token：「the chef [MASK] the meal」
2. 一個小型、類似 BERT 的**生成器**把遮住的位置填回去，依自己的機率分布取樣。有時填回原詞，有時填成別的詞，例如 cooked 變成 ate
3. **判別器**（也就是 ELECTRA 本體）對每一個 token 判斷：這是原本的，還是被換過的？

兩者聯合訓練，訓練完把生成器丟掉，留下判別器。[MASK] 只出現在生成器的輸入，判別器看不到，所以第二條限制消失；判別器對每個位置都要做判斷，所以第三條限制也消失。

**生成器要小。** 生成器和判別器一樣大時可以共用參數，而且共用越多越好。但最好的結果來自生成器比判別器小很多：判別器 768 維時，生成器 256 維最好，曲線呈倒 U 形。Potts 的直覺是：生成器弱一點，判別器才有有意思的工作可做。

**預測範圍的消融（GLUE 分數）：**

| 變體 | GLUE |
|---|---|
| ELECTRA | 85.0 |
| All-tokens MLM | 84.3 |
| Replace MLM | 82.4 |
| ELECTRA 15%（判別器只判斷被換過的位置） | 82.4 |
| BERT | 82.2 |

這張表的教訓是：**預測的位置越多越好。** 連留在 BERT 架構內、只是對所有 token 都做預測的 All-tokens MLM，都能明顯勝過原版 BERT。

釋出三個版本：Small、Base、Large。Small 的設計目標是「在單張 GPU 上快速訓練」，Potts 把它看成效率越來越受重視的另一個訊號。

## seq2seq：T5 與 BART

**任務。** 投影片先列出天生是 seq2seq 結構的任務：機器翻譯、摘要、自由形式問答、對話、semantic parsing、程式碼生成。更一般的類別是 encoder–decoder，不必限於序列。

**從 RNN 到 Transformer。** Potts 在這裡補了一段歷史：RNN 的 seq2seq 先加上大量 attention 幫 decoder 回看 encoder（投影片引 [Luong et al. 2015](https://aclanthology.org/D15-1166/)），Transformer 則是完全擁抱 attention、丟掉 recurrence。

**三種架構。** 投影片用 [T5 論文](https://arxiv.org/abs/1910.10683)的 Figure 4 說明：encoder–decoder；一般語言模型（全程 causal mask）；prefix LM（輸入部分全連接，輸出部分 causal）。Potts 指出，隨著 GPT 越做越大，後兩種越來越常見。

**T5。** Encoder–decoder，做了大量多任務的監督與非監督訓練。最有前瞻性的一點是 task prefix：在輸入前加「translate English to German:」這類自然語言指令。Potts 說這讓人提早瞥見後來的 in-context learning。釋出版本從 6,000 萬參數到 110 億；[FLAN-T5](https://arxiv.org/abs/2210.11416) 是經過 instruction tuning 的版本。

**BART。** [BART](https://aclanthology.org/2020.acl-main.703/) 的 encoder 像 BERT，decoder 像 GPT。有意思的是預訓練：把輸入破壞，再學著還原。破壞方式有 text infilling、句子重排、token masking、token 刪除、文件旋轉。錄影說效果最好的是 text infilling 加句子重排。微調時不再破壞：分類任務把未破壞的輸入同時餵給 encoder 和 decoder，用最後的 decoder 狀態做分類；seq2seq 任務就正常餵輸入與輸出。

## 蒸餾：大 teacher 教小 student

模型越做越大，蒸餾是讓它們變小的一條路：訓練一個 student，讓它和 teacher 的輸入輸出行為相似，但用起來更有效率。

**目標層級。** 投影片由輕到重列出，實務上常取加權組合：

0. 任務的正確標註（有的話）
1. Teacher 輸出的標籤。最輕量，蒸餾時甚至不需要碰到 teacher，只要事先跑一遍
2. Teacher 輸出的分數向量（[Hinton et al. 2015](https://arxiv.org/abs/1503.02531)）
3. Teacher 最後輸出狀態，用 cosine loss 拉近（[DistilBERT](https://arxiv.org/abs/1910.01108)）
4. 其他隱藏狀態與嵌入層
5. 讓 student 模仿 teacher 在內部介入下的反事實行為（[Wu et al. 2022](https://aclanthology.org/2022.naacl-main.318/)，Potts 參與的研究）

**訓練模式。** 標準做法是凍結 teacher、只更新 student；也有多 teacher、co-distillation（兩者一起訓練，又叫 online distillation）、self-distillation（讓同一個模型的某些部分對齊其他部分）。

**效果。** 投影片以 GLUE 為準，列出三個一致的結果：DistilBERT 把 12 層的 BERT-base 蒸餾成 6 層，保留 97% 的 GLUE 表現；[Sun et al. 2019](https://aclanthology.org/D19-1441/) 蒸餾成 3 層和 6 層；[Jiao et al. 2020](https://aclanthology.org/2020.findings-emnlp.372/) 蒸餾成 4 層。

## Wrap-up：沒講到的，和 2023 年的判斷

**補課。** 第 13 支影片補了三個沒時間講的架構：

- [Transformer-XL](https://arxiv.org/abs/1901.02860)：快取長序列前段的狀態，用遞迴連結接回目前的計算
- XLNet：用自迴歸損失，但對輸入順序取樣多種排列，同時拿到雙向上下文。這就是對 BERT 第四條限制的回應
- [DeBERTa](https://arxiv.org/abs/2006.03654)：把詞和位置的表徵拆開，各自有 attention

**預訓練資料。** Potts 說他對整個系列都沒講預訓練資料「感到愧疚」，所以列出 OpenBookCorpus、[The Pile](https://arxiv.org/abs/2101.00027)、BigScience 資料、維基百科處理工具、Pushshift Reddit。列出來不是要你自己訓練大模型，而是鼓勵你**稽核**這些資料集，理解手上的模型可能在哪裡成功、在哪裡出問題。

**2023 年的四個趨勢判斷**（投影片原話，本文不替它更新）：

1. 自迴歸架構似乎已經勝出，也許只是因為領域正專注在生成
2. 做表徵時，雙向模型可能仍占優勢
3. 對於本身是 seq2seq 結構的任務，seq2seq 仍是主流選擇
4. 大家還在執著擴大規模，但出現了走向「較小」模型的反向運動（仍約百億參數）

## 動手：從 BERT 取出靜態詞向量

這個單元配的 notebook 是 [vsm_03_contextualreps.ipynb](https://github.com/cgpotts/cs224u/blob/main/vsm_03_contextualreps.ipynb)。先說清楚兩件事：它的版本字串是「Spring 2022」，而 [README](https://github.com/cgpotts/cs224u/) 把整批 `vsm_*` 標成背景材料。

它問的問題很有意思：只提供上下文表徵的模型，能不能拿來做好的靜態詞向量？依據是 [Bommasani et al. 2020](https://aclanthology.org/2020.acl-main.431/)。

notebook 的流程：

- 載入 `bert-base-cased`，看 tokenizer 怎麼切「Bert knows Snuffleupagus」
- `output_hidden_states=True` 取回 13 組隱藏狀態：嵌入層加上 12 層
- 一個容易踩的坑：不要用 `pooler_output` 取 [CLS]，因為 `transformers` 在上面加了隨機初始化的參數方便微調；要用 `last_hidden_state[:, 0]`
- **Decontextualized 做法**：把單一個詞送進模型，被拆成多片的就 pooling。Bommasani 等人發現 mean 整體最好
- **Aggregated 做法**：在語料裡找到這個詞每一次出現的位置，把各次的表徵平均

要跑完整個 notebook，需要下載課程的 [data.tgz](http://web.stanford.edu/class/cs224u/data/data.tgz)（2026-09-29 查仍可下載）。只想看 tokenize 和 hidden states 的話，前半段不需要資料。

**今晚可以做的事**：跑到 `len(reps.hidden_states)` 那一格，確認得到 13；再把 `bert_weights_name` 換成 `roberta-base`，比較同一句話的切法。

**延伸閱讀**：[CS224N 導讀：預訓練](/posts/ai/2026-08-22-cs224n-pretraining) 從另一門課的角度講 encoder、decoder、encoder–decoder 三種預訓練。

## 材料缺口

- 投影片第 50–51 頁直接貼 RoBERTa 論文的表格截圖，PDF 抽出的文字有欄位錯位。本文只引錄影有口頭確認、且投影片表格讀得出來的數字。
- ELECTRA 的效率曲線與生成器大小曲線是論文圖片，本文只轉述錄影的文字描述。
- 這個單元沒有專屬作業；第一份作業才會實際微調這些模型。

**系列導覽**：上一篇 [上下文表徵 I：guiding ideas、Transformer 與位置編碼](/posts/ai/2026-09-29-cs224u-contextual-reps-transformer)｜下一篇 [HW1：多領域情感分析與 bake-off](/posts/ai/2026-09-29-cs224u-hw1-multidomain-sentiment)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方 Spring 2023 播放清單其實有對應講次的錄影，已嵌入並改為已附影片。
- 2026-10-10：依字幕核對影片內容。刪除字幕無法驗證的『每支約 6 到 14 分鐘』片長；其餘影片說法與字幕相符。

## 參考資料

- [CS224U 課程網站（Spring 2023）](https://web.stanford.edu/class/cs224u/)
- [Contextual word representations 投影片（handout PDF）](https://web.stanford.edu/class/cs224u/slides/cs224u-contextualreps-2023-handout.pdf)
- [XCS224U Spring 2023 YouTube 播放清單（影片 07–13）](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [vsm_03_contextualreps.ipynb（cgpotts/cs224u）](https://github.com/cgpotts/cs224u/blob/main/vsm_03_contextualreps.ipynb)
- [Radford et al. (2018). Improving Language Understanding by Generative Pre-Training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Devlin et al. (2019). BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://aclanthology.org/N19-1423/)
- [Liu et al. (2019). RoBERTa: A Robustly Optimized BERT Pretraining Approach](https://arxiv.org/abs/1907.11692)
- [Clark et al. (2020). ELECTRA: Pre-training Text Encoders as Discriminators Rather Than Generators](https://arxiv.org/abs/2003.10555)
- [Raffel et al. (2020). Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer (T5)](https://arxiv.org/abs/1910.10683)
- [Lewis et al. (2020). BART](https://aclanthology.org/2020.acl-main.703/)
- [Sanh et al. (2019). DistilBERT](https://arxiv.org/abs/1910.01108)
- [Hinton, Vinyals & Dean (2015). Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531)
- [Wu et al. (2022). Causal Distillation for Language Models](https://aclanthology.org/2022.naacl-main.318/)
- [Sun et al. (2019). Patient Knowledge Distillation for BERT Model Compression](https://aclanthology.org/D19-1441/)
- [Jiao et al. (2020). TinyBERT](https://aclanthology.org/2020.findings-emnlp.372/)
- [Rogers, Kovaleva & Rumshisky (2020). A Primer in BERTology](https://aclanthology.org/2020.tacl-1.54/)
- [Luong, Pham & Manning (2015). Effective Approaches to Attention-based Neural Machine Translation](https://aclanthology.org/D15-1166/)
- [Chung et al. (2022). Scaling Instruction-Finetuned Language Models (FLAN-T5)](https://arxiv.org/abs/2210.11416)
- [Dai et al. (2019). Transformer-XL](https://arxiv.org/abs/1901.02860)
- [He et al. (2021). DeBERTa](https://arxiv.org/abs/2006.03654)
- [Gao et al. (2020). The Pile](https://arxiv.org/abs/2101.00027)
- [Bommasani, Davis & Cardie (2020). Interpreting Pretrained Contextualized Representations via Reductions to Static Embeddings](https://aclanthology.org/2020.acl-main.431/)

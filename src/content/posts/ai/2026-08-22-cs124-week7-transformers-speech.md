---
title: "Transformers and Speech Processing：attention 怎麼讓每個 token 參考前文｜Stanford CS124 第 7 週"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, transformer, speech-processing, llm]
lang: zh-TW
series: { name: "Stanford CS124 導讀", order: 8 }
tldr: "第 7 週打開 Transformer：attention 怎麼讓每個 token 參考前面的 token、一個 block 由哪些零件組成、輸入和輸出兩端怎麼接。PA6a 要自己寫 causal self-attention、訓練一個小模型並計算 perplexity。同週的語音現場課介紹語音辨識的任務與詞錯誤率。"
description: "Stanford CS124 Winter 2026 第 7 週導讀：attention 的直覺與手算、query／key／value、causal mask、multi-head、Transformer block 與 residual stream、token 與位置向量、language modeling head；PA6a 的四個部分；語音現場課前半的語音任務、詞錯誤率手算、資料集與倫理。依 2026 年版公開投影片與 PA6a repo。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs124-week7-transformers-speech-en)

這是 [Stanford CS124 導讀](/posts/ai/2026-08-21-stanford-cs124-languages-to-information)的第 7 週。上一週把 Transformer 當成黑盒子：前文進去，下一個 token 的機率分布出來。這一週打開它。

這一週的內容有三塊：

- **Transformer 的內部**。投影片是上週現場課「LLMs and Transformers!」的後半，沒有錄影，[投影片](https://web.stanford.edu/class/cs124/lec/transformer_cs124_26.pdf)公開。放在這一篇講，是因為這週的作業 PA6a 就是實作它。
- **[PA6a](https://github.com/cs124/pa6a-transformers)**：寫 attention、訓練模型、取樣、算 perplexity。
- **語音處理現場課**。這堂課選修、出席有加分、沒有錄影，[投影片](https://web.stanford.edu/class/cs124/lec/speech_cs124_26.pdf)公開。本文講前半（任務與評估），後半（聲音怎麼變成模型的輸入、Whisper 的架構）放在[下一週](/posts/ai/2026-08-22-cs124-week8-speech-git)，和 PA6b 一起。

指定閱讀是教科書 2025 年 8 月版的[第 7 章](https://web.stanford.edu/~jurafsky/slp3/old_aug25/7.pdf)（第 1–11 頁與第 17 頁）和[第 8 章](https://web.stanford.edu/~jurafsky/slp3/old_aug25/8.pdf)。注意要用 `old_aug25/` 這一版，教科書主目錄的同號檔案已經是別的章。

## Attention 要解決什麼問題

第 5 週結尾提到，靜態詞向量給每個詞一個固定的向量，處理不了一詞多義。投影片換了一個更貼切的例子：

> The chicken didn't cross the road because **it** was too tired.
> The chicken didn't cross the road because **it** was too wide.

第一句的 it 是雞，第二句的 it 是馬路。it 的向量應該帶著「它指的是誰」的資訊，而這只能從周圍的詞得到。

**Attention** 就是做這件事的機制：算一個 token 的向量時，有選擇地把周圍 token 的資訊整合進來。「有選擇地」的意思是，對某些 token 多看一點，對其他的少看一點。數學上它是一個**加權總和**。

### 簡化版：用相似度當權重

先看投影片的簡化版。要算位置 i 的新向量 aᵢ：

1. 拿 xᵢ 和它自己以及它**前面**的每個 token 算內積，得到一組分數。
2. 分數通過 softmax，變成一組加起來等於 1 的權重。
3. 用這組權重把那些 token 的向量加權總和。

本文自擬一個可以手算的例子。三個 token，向量是二維的：x₁ = [1, 0]，x₂ = [0, 1]，x₃ = [1, 1]。算 a₃：

| | 和 x₃ 的內積 | softmax 後的權重 |
|---|---|---|
| x₁ = [1, 0] | 1 | 0.21 |
| x₂ = [0, 1] | 1 | 0.21 |
| x₃ = [1, 1] | 2 | 0.58 |

a₃ = 0.21 × [1, 0] + 0.21 × [0, 1] + 0.58 × [1, 1] = [0.79, 0.79]

a₃ 是三個向量的混合，其中和 x₃ 最像的（它自己）佔的比重最大。

### 實際的版本：query、key、value

簡化版裡，一個向量同時扮演三個角色。實際的 attention 把這三個角色分開：

- **Query**：我是目前這個位置，我要去找跟我相關的東西。
- **Key**：我是前面的某個位置，別人拿我來比對相不相關。
- **Value**：我是前面的某個位置，如果被選中，實際被加進去的內容。

每個角色各有一個要學的矩陣（W_Q、W_K、W_V），把同一個 xᵢ 投影成三個不同的向量 qᵢ、kᵢ、vᵢ。計算步驟變成：

1. 分數 = qᵢ 和每個 kⱼ 的內積，除以 √d（向量維度的平方根）。除這個數是為了避免維度高的時候分數太大，softmax 之後幾乎變成只選一個。
2. 權重 = softmax(分數)。
3. 輸出 = 用權重把 vⱼ 加權總和。

分開的好處是，「怎麼判斷相關」和「相關的話要搬什麼資訊過來」可以各自學。

### Causal mask：不能偷看答案

語言模型的任務是預測下一個 token。如果位置 i 能看到位置 i+1，答案就直接洩漏了。所以 decoder 的 attention 只能往左看。

實作上的做法是：所有位置的分數先照算，然後在 softmax 之前，把「未來」那些格子加上負無限大。softmax 會把它們變成 0。

四個 token 時，哪個位置看得到哪個位置（✓ 可以看，✗ 被遮住）：

| 位置（query）↓ ／ 被看的位置（key）→ | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| **1** | ✓ | ✗ | ✗ | ✗ |
| **2** | ✓ | ✓ | ✗ | ✗ |
| **3** | ✓ | ✓ | ✓ | ✗ |
| **4** | ✓ | ✓ | ✓ | ✓ |

被遮住的是右上角那個三角形。每個位置看得到自己和自己左邊的。

### 一次算完

上面是一個位置一個位置算。實際上把 N 個 token 的向量疊成一個 N × d 的矩陣 X，三次矩陣乘法得到 Q、K、V，再算 Q 乘 K 的轉置，就一次得到 N × N 的分數表：第 i 列第 j 欄是位置 i 對位置 j 的分數。加上遮罩、每一列做 softmax、乘上 V，所有位置的輸出就都有了。

這帶來一個代價：分數表有 N × N 格，所以 attention 的計算量隨著長度的**平方**成長。

### Multi-head

一組 Q、K、V 叫一個 attention head。實際的模型同時跑很多個 head，各有各的矩陣。直覺是不同的 head 可以為不同的目的去看前文，例如一個看文法關係，一個找代名詞指的對象。每個 head 的輸出接在一起，再投影回原本的維度。

## Transformer block

Attention 只是一個零件。一個完整的 block 有四樣東西：

- **Multi-head attention**：從其他位置搬資訊進來。
- **前饋層**：第 6 週的前饋網路，各個位置各自算。它提供非線性。
- **Layer norm**：把一個向量的數值正規化（減平均、除以標準差），讓訓練穩定。一個 block 裡用兩次。
- **Residual 連接**：每個零件的輸出是**加回**輸入，而不是取代輸入。

最後一點帶出投影片強調的一個看法：**residual stream**。每個 token 有一條自己的資料流，從最底層一路往上。每經過一個零件，就往這條流裡加一點東西。前饋層和 layer norm 都只處理單一位置自己的流，**只有 attention 會跨位置**。所以可以把 attention head 看成一種搬運：把資訊從某個 token 的流搬到另一個 token 的流裡。

整個 Transformer 就是把同樣結構的 block 疊很多層。每一層輸入和輸出的向量維度都一樣，所以想疊幾層就疊幾層。

## 輸入和輸出兩端

**輸入端。** 投影片的例子是字串 `Thanks for all the`：

1. 用 BPE（第 2 週）切成 token，換成詞彙表裡的編號，例如 [5, 4000, 10532, 2224]。
2. 有一張 **token embedding** 表，大小是 |V| × d，每個 token 一列。照編號把對應的四列取出來。
3. Attention 本身不知道順序：它只是加權總和。不看遮罩的話，把 token 的順序打亂，每個 token 算出來的結果還是一樣，只是跟著換了位置。所以要另外加上**位置向量**。最簡單的做法是再準備一張表，位置 1、位置 2……各有一個向量，和其他參數一起訓練。
4. 每個位置的輸入 = token 向量 + 位置向量。

**輸出端。** 最後一層 block 出來的是一個 d 維的向量，要變成整個詞彙表上的機率分布：

1. 乘上一個矩陣，從 d 維變成 |V| 維，得到每個 token 的分數（logits）。這一層叫 **unembedding**。
2. softmax，得到機率。

unembedding 的矩陣常常直接用 token embedding 表的轉置，同一組權重用在兩個地方，叫 weight tying。這也是它叫「un-embedding」的原因：embedding 把 token 變成向量，它把向量變回 token 的分數。

到這裡，一次完整的計算是：token → 向量（加位置）→ 很多層 block → unembedding → softmax → 下一個 token 的機率分布。第 6 週的取樣和 loss 就接在這後面。

## PA6a

**[PA6a](https://github.com/cs124/pa6a-transformers)** 是這門課第一份不在 Jupyter notebook 裡寫的作業，要用文字編輯器改 `.py` 檔，並且用到 PyTorch。分四部分：

**第一部分：實作 attention。** `model.py` 已經有一個完整的 Transformer，只留下 `CausalSelfAttention` 類別的 `forward` 方法給你寫。寫完用 `python test_attention.py` 檢查。

**第二部分：訓練。** `python train.py` 用莎士比亞的文本訓練，資料已經用 GPT-2 的 BPE 切好。預設在 CPU 上跑。README 給了一個參考數字：作者在 M1 的 MacBook Pro 上跑 2,000 次迭代大約 15 分鐘，loss 會降到 4.0 以下。訓練完用 `python sample.py` 取樣，預設產生 5 段、每段最多 100 個 token，存成 `sampled_sentences.json`。README 說明，語料很小，產生的句子不會很通順，但應該看得出莎士比亞的筆調和基本的文法；如果全是亂碼，多半是 attention 或訓練哪裡寫錯了。

**第三部分：實作 perplexity。** 在 `perplexity.py` 裡寫 `compute_perplexity`，輸入是模型的 logits 和正確的 token，輸出這段序列的 perplexity。算法是：每個位置取「正確 token 的機率」的負對數，平均，再取指數。

本文自擬一組數字：三個位置上，模型給正確 token 的機率分別是 0.5、0.25、0.125。負對數是 0.693、1.386、2.079，平均是 1.386，e 的 1.386 次方是 4。平均下來，模型每一步相當於在 4 個選項之間猜。這和第 2 週的定義是同一個，只是機率改由 Transformer 給。

**第四部分：倫理題。** 許多市售的 AI 偵測器用 perplexity 來判斷一篇文章是不是 AI 寫的：文字越好預測，越可能被判成 AI。作業要你讀一篇說明這個方法為什麼會失敗的文章，然後回答幾組問題，包括：用「不可預測」來定義人類的寫作合理嗎？誰會被一個把好預測的文字判成非人類的工具誤傷？學校教的、考試獎勵的那種結構工整的寫法，剛好是偵測器會起疑的寫法，這造成什麼矛盾？老師該不該用這種工具？

剛算過 perplexity，再回頭看這些問題會更具體：這個數字量的是「這個模型覺得這段文字多意外」，它是模型和文字之間的關係，本來就不是用來判斷作者是誰的。

## 語音處理現場課（前半）

### 語音任務有哪些

投影片先列出常見的語音任務。最主要的兩個：

- **語音辨識**（ASR）：聲音進、文字出。
- **語音合成**（TTS）：文字進、聲音出。

其他還有語音翻譯、語言辨識、說話者辨識、diarization（輸出誰在什麼時候說話）、偵測哪幾段有人聲。

### 為什麼難

投影片的示範是把一句日常對話裡的一小段單獨切出來，再和放回整句的版本對照：沒有上下文的那一段很難認，有上下文就聽得懂。口音的例子也是同樣的做法。人聽話大量依賴上下文，辨識系統也必須如此。

### 詞錯誤率

評估語音辨識的標準指標是**詞錯誤率**（word error rate，WER）。它就是第 2 週的最小編輯距離，單位從字元換成詞，再除以正確答案的長度：

WER = (替換數 + 刪除數 + 插入數) ÷ 正確答案的詞數

投影片的例子：

- 正確答案：Um I left this phone upstairs last night（8 個詞）
- 辨識結果：My sister her phone it stores less nine

用編輯距離對齊之後：

| 正確答案 | Um | I | left | this | — | phone | — | upstairs | last | night |
|---|---|---|---|---|---|---|---|---|---|---|
| 辨識結果 | My | — | — | sister | her | phone | it | stores | less | nine |
| 錯誤類型 | 替換 | 刪除 | 刪除 | 替換 | 插入 | | 插入 | 替換 | 替換 | 替換 |

5 個替換、2 個刪除、2 個插入，共 9 個錯誤。WER = 9 ÷ 8 = 112.5%。

這是投影片畫的對齊，把發音相近的詞排在一起。它不是錯誤最少的排法：用第 2 週的動態規劃可以找到只有 8 個錯誤的對齊（6 個替換、1 個刪除、1 個插入），算出來是 100%。實際的評分工具取的是最小值。

WER 可以超過 100%，因為插入的詞也算錯誤，而分母只算正確答案的長度。例如正確答案是 2 個詞，辨識結果多吐了 3 個詞，就算原本那 2 個都對，WER 也是 3 ÷ 2 = 150%。

投影片列了它的幾個問題，但說大家還是用它：

- 它不看語意。把 of 聽錯和把關鍵的名詞聽錯，一樣算一個錯。
- 跨語言不一定能比，因為它假設各語言對「詞」的切法相同。
- 很吃文字正規化。拼字慣例、can't 這種縮寫的撇號、uh-huh 這種非標準的詞，寫法不一致就會被算成錯誤。

### 資料與現況

投影片介紹幾個常用的資料集：LibriSpeech（有聲書的朗讀，多語言版有 44,000 小時英文）、Common Voice（群眾錄製，133 種語言共 33,000 小時，雜訊比較多）、FLEURS（一百多種語言的平行語音與文字）、CHiME 6（真實家庭環境裡的對話）。

現在的辨識在很多情況下仍然會失敗：吵雜的環境、多人同時說話、資料少的語言，以及某些說話者（兒童、長者、口吃的人）。

### 做語音技術的基本倫理

投影片列了三條：

- **沒有同意不要錄音。** 在加州，電話或私下對話的錄音必須得到所有當事人的同意。
- **沒有同意不要用別人的語音資料**，尤其是語音合成和聲音複製。
- **要考慮不同群體和語言的落差。** 系統對非母語使用者的表現比較差，很多語言得到的資源遠少於英文和中文。

## 自我檢查

1. 用上面簡化版的三個向量算 a₂（位置 2 只能看位置 1 和 2）。答案：x₂ 和 x₁ 的內積是 0，和自己的內積是 1。softmax([0, 1]) = [0.27, 0.73]。a₂ = 0.27 × [1, 0] + 0.73 × [0, 1] = [0.27, 0.73]。
2. 序列有 5 個 token，causal mask 遮住幾個格子？答案：5 × 5 = 25 格裡，右上角的三角形有 4 + 3 + 2 + 1 = 10 格被遮住。
3. 把輸入的 token 順序打亂，如果沒有位置向量也沒有遮罩，attention 的輸出會怎樣？答案：每個 token 得到的加權總和不變，只是跟著換了位置。模型分不出「狗咬人」和「人咬狗」。這就是需要位置向量的原因。
4. 序列長度從 1,000 變成 4,000，attention 分數表的大小變成幾倍？答案：16 倍，因為是長度的平方。
5. 正確答案是「我 今天 很 累」（4 個詞），辨識結果是「我 今天 累」。WER 是多少？答案：刪除了 1 個詞，1 ÷ 4 = 25%。

## 這週和後面的關係

- 第 8 週的 PA6b 會把這週 PA6a 產生的句子拿去做語音合成與辨識。
- 第 8 週講 Whisper 時會用到這週的 attention，再多一種：cross-attention，讓產生文字的那一端去看聲音那一端。
- 第 10 週的最後一堂課會談可解釋性，也就是怎麼看懂這些向量和 attention head 在做什麼。

**系列導覽**：上一篇 [第 6 週：Neural Networks and LLMs](/posts/ai/2026-08-22-cs124-week6-neural-networks-llms)｜下一篇 [第 8 週：Speech and PA7/Git Lab](/posts/ai/2026-08-22-cs124-week8-speech-git)

## 更新紀錄

- 2026-10-13：依 2026 年版公開投影片重寫。Transformer 的來源換成官方課表現在連結的 2026 年版；語音現場課原本寫「沒有公開投影片」，官方課表現在有，據此補上語音任務、詞錯誤率與倫理各節。新增 attention 的手算、causal mask 表、perplexity 手算與自我檢查。

## 參考資料

- [CS124 Winter 2026 課程網站與課表](https://web.stanford.edu/class/cs124/)
- [Introduction to Transformers 投影片](https://web.stanford.edu/class/cs124/lec/transformer_cs124_26.pdf) — attention、Transformer block、residual stream、位置向量、language modeling head
- [Speech Recognition 投影片](https://web.stanford.edu/class/cs124/lec/speech_cs124_26.pdf) — 語音任務、詞錯誤率例子、資料集、倫理
- [CS124 PA6a](https://github.com/cs124/pa6a-transformers) — 四個部分的要求、訓練時間的參考數字、倫理題
- [Speech and Language Processing 2025 年 8 月版](https://web.stanford.edu/~jurafsky/slp3/old_aug25/) — 第 7、8 章

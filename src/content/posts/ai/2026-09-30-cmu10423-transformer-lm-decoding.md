---
title: "CMU 10-423 L2–L3：Transformer 語言模型、LLM 訓練與解碼——從 RNN 會遺忘講到 KV cache"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, transformer, self-attention, language-model, tokenization, decoding]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 2
tldr: "CMU 10-423 第 2、3 講把 RNN 換成 attention。第 2 講先說明 RNN 為什麼不夠用：會遺忘、只能一步步算、梯度仍可能爆炸；再一步步拼出 Transformer 語言模型：scaled dot-product attention、multi-head、layer norm、殘差連接、位置嵌入、causal mask。第 3 講回答怎麼訓練：沒有 n-gram 那種數次數的封閉解，就用 autodiff 加 mini-batch SGD 做最大概似估計；再講 padding、KV cache、三種 tokenizer，最後用 greedy decoding 和 ancestral sampling 說明怎麼一個 token 一個 token 生成。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）第 2–3 講導讀：依據 lecture2-transformer 與 lecture3-llms（含手寫註記版）投影片，整理 noisy channel 與 n-gram 時代的「大型語言模型」、RNN 的遺忘與 LSTM、Transformer LM 的每個元件與矩陣版實作、深度語言模型的最大概似訓練、batching 與 KV cache、word／character／subword tokenizer、greedy decoding 與 ancestral sampling。"
draft: false
glossary:
  - term: "causal mask"
    aliases: ["causal attention", "因果遮罩"]
    definition: "在 attention 的 softmax 之前，把每個 query 右邊（未來時間步）的分數設成負無限大，讓模型預測下一個 token 時看不到答案。"
    context: "CMU 10-423 第 2 講用矩陣 M 表示：對角線與左下為 0，右上為 −∞。"
  - term: "ancestral sampling"
    aliases: ["祖先取樣"]
    definition: "從語言模型生成時，每一步依模型給的機率隨機挑下一個 token。只要分布是逐步正規化的，這樣取出的整條序列機率就等於它的總機率，是精確的取樣方法。"
    context: "CMU 10-423 第 3 講拿它和只挑最可能 token 的 greedy decoding 對比。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 第 2 講（2026-01-14，[lecture2-transformer](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf)，74 頁）與第 3 講（2026-01-21，[lecture3-llms](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture3-llms.pdf) 57 頁、[手寫註記版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture3-llms-ink.pdf) 59 頁），講者為 Aran Nayebi 與 Matt Gormley，事實都在 2026-09-30 核對。第 2 講沒有手寫註記版。錄影在 Panopto，要 CMU 帳號，本文只依投影片撰寫。

**系列位置**：上一篇 [L1：RNN 語言模型與 autodiff](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff)｜下一篇 [L4：預訓練、微調與現代 Transformer](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

[上一篇](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff)結束在 RNN 語言模型：把前面所有字壓成一個固定長度的向量，再預測下一個字。這兩講要回答三個問題：這個向量為什麼不夠用、換成 attention 之後模型長什麼樣、這種模型怎麼訓練和生成。

兩講之間有分工。第 2 講只講**架構**；第 3 講講**訓練、效率與解碼**。HW1 要你在 minGPT 上加 RoPE 和 GQA，這兩講是它的地基。

## 課程影片來源

官方課站將 Spring 2026 錄影放在 SCS Panopto；匿名頁面未載入影片並提示登入。本文依公開投影片與作業導讀，錄影需依課程授權存取。

課程與錄影入口：

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 「大型語言模型」比 Transformer 還老

第 2 講先講一段歷史。2017 年以前，最依賴語言模型的兩個任務是語音辨識和機器翻譯，用的是 **noisy channel model**：

$$
\hat{y} = \arg\max_y p(y \mid x) = \arg\max_y p(x \mid y)\, p(y)
$$

$x$ 是聲音訊號或原文，$y$ 是逐字稿或譯文；$p(x \mid y)$ 是轉換模型，$p(y)$ 就是語言模型。

投影片說，最早真正「大」的語言模型是 n-gram。2006 年 Google 釋出的英文 n-gram 用 1 兆個 token 的網頁文字（950 億個句子）訓練，收錄 1-gram 到 5-gram，光是 5-gram 就有約 11.8 億個；投影片估算這個模型約有 30 億個參數。訓練資料大嗎？模型大嗎？投影片的答案都是 Yes。

接著一張表對照現代 LLM 的規模，例如 GPT-2（2019）約 100 億 token、15 億參數，GPT-3（2020）3,000 億 token、1,750 億參數，LLaMA-3（2024）15 兆 token、4,050 億參數。GPT-4、GPT-5 與 Gemini Ultra 的欄位是問號，括號裡的數字是未經證實的估計。

## RNN 為什麼不夠用

第 2 講用一個小例子說明 RNN 會遺忘：一個手動設定權重的 RNN，要記住「兩個輸入位置是否都出現過 1」。投影片畫出隱藏狀態隨時間變成 1/2、1/4，第 100 步時已經記不住了。

**LSTM** 是當年的解法。標準 RNN 難以學到長距離依賴，因為 vanishing gradient；LSTM 用幾個「閘」控制資訊流：

- **input gate**：遮掉一部分標準 RNN 的輸入
- **forget gate**：遮掉一部分上一步的 cell
- **cell**：存 input 和 forget 混合的結果，是 LSTM 的長期記憶
- **output gate**：遮掉一部分要送進下一個隱藏狀態的值

投影片也提到 Jozefowicz et al. 2015 評估了一萬種類似 LSTM 的架構，發現有好幾種變體在多個任務上表現一樣好。

那為什麼不全部用 LSTM？投影片寫「Everyone did, for a time」，然後列了三個理由：

1. 長距離依賴還是難。
2. 計算本質上是循序的，很難在 GPU 上平行化。
3. 雖然大致解決了 vanishing gradient，還是可能 exploding gradient。

## 一步步拼出 Transformer 語言模型

### Attention

每個位置的新表示 $x'_t$ 是所有位置 value 向量的加權和，權重來自 softmax：

$$
x'_t = \sum_j a_{t,j} v_j, \quad a_t = \operatorname{softmax}(s_t)
$$

**Scaled dot-product attention** 定義這些量怎麼來：每個輸入 $x_j$ 各乘三個矩陣，得到 query、key、value。

$$
q_j = W_q^T x_j, \quad k_j = W_k^T x_j, \quad v_j = W_v^T x_j, \quad s_{t,j} = \frac{k_j^T q_t}{\sqrt{d_k}}
$$

### Multi-head attention

投影片用卷積類比：一層卷積可以有多個 channel，attention 也可以有多個 head。每個 head 有自己的參數，最後把輸出串接起來。為了讓輸出維度和輸入一樣，通常取 $d_k = d_{model} / h$。

### 一層 Transformer

每一層 Transformer LM 有四個子層：attention、前饋神經網路、layer normalization、殘差連接。投影片分別說明後兩者要解決的問題：

- **Layer normalization**：深層網路訓練時，低層的小變化會在高層放大（internal covariate shift）。對每一層做正規化，再學 elementwise 的 gain 和 bias，可以用更高的學習率而不發散。
- **殘差連接**：網路很深時，會出現不是過擬合造成的效能退化（訓練和測試誤差一起變差）。改成 $b = f(a) + a$ 之後，$f$ 只需要學對 $a$ 的**加法修正**，不必學整個轉換。

投影片還強調一個差異：RNN 的計算圖隨 token 數**線性**成長，Transformer LM 的計算圖隨 token 數**平方**成長。語言模型的部分則和 RNN-LM 完全一樣，每個位置輸出下一個字的分布。

### 位置嵌入

投影片的課堂練習：給定一組輸入嵌入和 attention 權重，算出 $x'_4$；然後把 $x_2$ 和 $x_3$ 對調，$x'_4$ 會變成多少？答案是完全不變。

Attention 對位置不敏感，所以要另外加入位置資訊：每個位置 $t$ 有一個位置嵌入 $p_t$，加到詞嵌入 $w_t$ 上。位置嵌入有固定的（sin 與 cos）和學出來的；有絕對位置的，也有相對於 query 位置的。

### GPT 就是大型 Transformer LM

投影片的表：GPT（2018）12 層、隱藏維度 768、1.17 億參數；GPT-2（2019）48 層、1600 維、15.42 億參數；GPT-3（2020）96 層、12288 維、96 個 head、1,750 億參數。GPT-4o 與 GPT-5 全部是問號。

### 矩陣版與 causal mask

實作時不會一個 query 一個 query 算，而是把 query、key、value 疊成矩陣 $Q = XW_q$、$K = XW_k$、$V = XW_v$ 一次算完。投影片問 softmax 是按行還是按列做，答案是按行（每個 query 一行）。

然後投影片問：訓練模型預測下一個 token 時，如果 attention 看得到當前 token 之後的字，就是作弊。解法是在 softmax 之前加上遮罩 $M$：

<details>
<summary>Causal attention 的矩陣形式</summary>

$$
X' = \operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}} + M\right) V, \quad
M = \begin{bmatrix} 0 & -\infty & -\infty & -\infty \\ 0 & 0 & -\infty & -\infty \\ 0 & 0 & 0 & -\infty \\ 0 & 0 & 0 & 0 \end{bmatrix}
$$

softmax 的輸入若是 $-\infty$，對應的權重就是 0。實務上先對所有時間步算出 attention 分數，再把 query 右邊的位置遮掉。Multi-head 版本就是每個 head 各算一次、再串接：$X' = \operatorname{concat}(X'^{(1)}, \ldots, X'^{(h)})$。

</details>

## 怎麼訓練：從數次數到 autodiff

第 3 講開頭先做總結：到目前為止，深度學習這邊有 autodiff 和計算圖（RNN-LM、Transformer-LM），語言模型這邊有「看前文、取樣下一個字」。n-gram 很好學，數次數就好；但 RNN-LM 和 Transformer-LM 怎麼學，還沒講。

投影片先複習機器學習的配方：給定訓練資料，選 decision function 和 loss function，定義目標，用 SGD 沿梯度反方向走小步。接著寫出 SGD 與 mini-batch SGD 的演算法，並用序列標註（詞性標註、手寫辨識、音素辨識）示範怎麼訓練一個 Elman RNN：每個時間步算 cross-entropy，全部加起來就是 loss。

關鍵的一頁是 **n-gram 與深度語言模型的最大概似估計對比**：

- n-gram 的「數次數」其實就是最大概似估計：寫出句子的概似函數、令梯度為零並加上機率和為一的限制，解出來就是次數比例。
- 深度語言模型也用最大概似估計，但**沒有封閉解**。做法是寫出一個 batch 句子的概似函數，用 autodiff 算對參數的梯度，再用 mini-batch SGD（或你喜歡的最佳化器）沿負梯度走。

深度語言模型的目標函數是訓練資料的 log-likelihood，每句的 log 機率又拆成每個位置的和：

$$
J(\theta) = \sum_i \log p_\theta(w^{(i)}), \quad \log p(w) = \sum_{t=1}^{T} \log p(w_t \mid h_t)
$$

手寫註記版多了一個問題：怎麼訓練，才能讓模型最後會停下來、不再生成新字？投影片的圖給的線索是序列最後的 END token：它也被當成一個要預測的字。訓練 Transformer-LM 完全一樣，只是把中間的深度語言模型換掉。

## 效率：batching、padding 與 KV cache

為什麼效率重要？投影片用 GPT-3 當案例，引用論文裡的訓練算力（以 petaflop/s-days 計）。Transformer 能被非常有效率地訓練，投影片說這可以算是它成功的主要原因之一：

- **Batching**：一次處理 B 個句子，每個句子的計算相同，天生可平行。
- **Scaled dot-product attention**：一個時間步的 attention 分數不依賴其他時間步，好平行。
- **Multi-head attention**：每個 head 獨立計算，平行度更高。
- **矩陣乘法**：attention 的核心就是矩陣乘法，GPU 和 TPU 專門加速這個。
- **Model parallelism**：模型太大時切到多張 GPU 或多台機器。
- **Key-value caching**：key 和 value 會在很多時間步重複使用，但 query、相似度分數和 attention 權重不用快取。

**Padding 與 truncation** 用 8 個句子示範：block size（最大序列長度）設成 10，太長的截斷、太短的補 `<PAD>`，再用詞彙表把每個 token 轉成整數，最後轉成固定長度的嵌入向量。

**KV cache** 在生成時的邏輯：每一步只為新 token 算出新的 $k_j$ 與 $v_j$ 並存起來，之前所有的 key 和 value 直接重用；這一步的 query、分數和權重用完就丟。

## 三種 tokenizer

投影片用「Matt is giving a lecture on transformers」比較三種切法：

| 類型 | 優點 | 問題 |
|---|---|---|
| Word-based | 直觀 | 詞彙表大小和計算量難以兼顧；transformers 與 transformer 會對到完全不同的表示；打錯字就變成 OOV（out-of-vocabulary） |
| Character-based | 詞彙表小得多；在漢字這類語素文字上可以表現不錯 | 丟失很多語意；序列長很多，計算吃重 |
| Subword-based | 把長字或罕見字切成有意義的片段；只要所有字元都在詞彙表裡，就不會有 OOV | 要先學出切法，例如 BPE、WordPiece、SentencePiece |

## 解碼：greedy 與 ancestral sampling

最後一段把生成看成搜尋問題。以 character-based tokenizer 為例，每個節點是一段部分句子，邊的權重是負 log 機率，目標是找出從根到葉、總權重最低（機率最高）的路徑。

- **Greedy decoding**：每個節點都挑權重最低的那條邊。這是啟發式方法，不保證找到最好的路徑，計算時間和最大路徑長度成線性。
- **Ancestral sampling**：每個節點依機率隨機挑一條邊。只要分布是逐步正規化的，這就是精確的取樣方法，取出每條路徑的機率等於它的總機率，計算時間同樣和路徑長度成線性。

L3 的投影片停在這裡。解碼的效率問題，講次表排在 L18「Flash Attention / Efficient decoding strategies」。

## 自我檢核

[練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)對應兩大題：

- 第 2 大題「Transformers and LLMs」30 分：Transformer LM 的敘述判斷、multi-head attention 的主要目的、殘差連接的作用、self-attention 的計算成本等。最後一小題（5 分）考 RoPE，那是 [L4](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa) 的內容。
- 第 3 大題「Learning neural language models / Decoding」8 分：四題選擇題。

今晚可以做的一件事：拿紙筆重做第 2 講那個課堂練習。隨便寫四個二維嵌入，令 $W_v = I$，算出 $x'_4$，再對調 $x_2$ 和 $x_3$ 重算一次。親手算過一次，就不會忘記為什麼需要位置嵌入。

## 延伸閱讀

- 另一門課怎麼講 Transformer：[CS224N：Transformers](/posts/ai/2026-08-22-cs224n-transformers)、[CMU 11-785 第 18 講：Attention 與 Transformer](/posts/ai/2026-08-22-cmu-11785-18-attention-transformers)、[CME295：Transformer](/posts/ai/2026-09-29-cme295-transformer)
- Tokenizer 從零實作：[CS336 第 1 講：總覽與 tokenization](/posts/ai/2026-08-22-cs336-overview-tokenization)
- KV cache 與推論的系統面：[CS336：Inference](/posts/ai/2026-08-22-cs336-inference)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CMU 10-423/623/723 課程首頁（Spring 2026）](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)：L2、L3 日期與 readings
- [Lecture 2 投影片：Transformer Language Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf)
- [Lecture 3 投影片：Learning Large Language Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture3-llms.pdf)
- [Lecture 3 投影片（手寫註記版）](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture3-llms-ink.pdf)
- [Goodfellow, Bengio & Courville, Deep Learning, Chapter 10](http://www.deeplearningbook.org/contents/rnn.html)：L2 指定 10.10–10.12（LSTM 與其他 gated RNN）
- [Vaswani et al. (2017), Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Alammar (2018), The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
- [Graves (2014), Generating Sequences With Recurrent Neural Networks](https://arxiv.org/pdf/1308.0850.pdf)
- [Mikolov et al. (2010), Recurrent neural network based language model](https://pdfs.semanticscholar.org/bba8/a2c9b9121e7c78e91ea2a68630e77c0ad20f.pdf)
- [Radford et al. (2018), Improving Language Understanding by Generative Pre-Training（GPT-1）](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Radford et al. (2019), Language Models are Unsupervised Multitask Learners（GPT-2）](https://d4mucfpksywv.cloudfront.net/better-language-models/language-models.pdf)
- [Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) 與 [Solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)

---
title: "台大 ADL 第 3 講：詞怎麼變成向量、語言模型與 RNN"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, language-model, rnn]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 3
tldr: "ADL Fall 2025 第一堂正課的主線只有一條：語言模型就是預測下一個詞。從 one-hot 與共現矩陣出發，走過 n-gram 的零機率問題、neural LM 自動做到的平滑，再到把所有前文壓進 hidden state 的 RNN LM。BPTT 與梯度消失／爆炸是訓練上的代價，LSTM、GRU 用 gating 補救；最後用「輸入是序列」與「輸出是序列」兩類應用，把 tagging 與 encoder-decoder 分開。"
description: "台大陳縕儂《深度學習之應用》ADL Fall 2025 Sequence Modeling 講次導讀：knowledge-based 與 corpus-based 詞表示、共現矩陣與 SVD、n-gram LM 與 smoothing、Bengio 2003 neural LM、RNN LM 與權重共享、BPTT、梯度消失與爆炸、clipping、LSTM／GRU、雙向 RNN，以及情感分析、詞性標註、slot tagging、機器翻譯等應用。"
draft: false
glossary:
  - term: "RNN LM"
    aliases: ["RNNLM", "recurrent neural network language model", "遞迴神經網路語言模型"]
    definition: "用遞迴神經網路預測下一個詞的語言模型。每個時間點把目前的詞向量與上一步的 hidden state 合起來，所有時間點共用同一組權重，所以理論上能用上全部前文，模型大小也不隨句長增加。"
    context: "ADL Sequence Modeling 講次用它接在 n-gram 與 feed-forward neural LM 之後，解決固定 context window 的限制。"
  - term: "BPTT"
    aliases: ["backpropagation through time", "時間反向傳播"]
    definition: "把 RNN 沿時間軸展開成一個很深的網路，再照一般反向傳播計算梯度；因為每個時間點共用權重，所有時間點的梯度都會累加到同一組參數上。"
    context: "ADL Sequence Modeling 投影片第 36–41 頁逐步示範展開與 forward／backward pass。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en)

> **版本說明**：本文依據台大陳縕儂《深度學習之應用》（ADL）**Fall 2025（114-1，2025/09/01–12/15）**。主要材料是 9/01 那週的 [Sequence Modeling 投影片](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_SeqModel.pdf)（66 頁），以及課程頁連到的四支分段影片 [3.1](https://youtu.be/215BxEbYrCs)、[3.2](https://youtu.be/eVA_WTW4gXE)、[3.3](https://youtu.be/e9Ef3dZcvjw)、[3.4](https://youtu.be/MyKrovk8tLM)。詞嵌入的彈性補充另用 [Fall 2022 的 Word Embeddings 投影片](https://www.csie.ntu.edu.tw/~miulab/f111-adl/doc/220929_WordEmbeddings.pdf)。事實皆於 2026-09-30 打開官方材料核對。整門課的存取分級是 **A2**：講課端的講義與影片都公開，缺口在作業端（HW2、HW3 只有說明影片），細節見[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)。這一講本身沒有缺口。

**系列位置**：上一篇 [神經網路與反向傳播](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop)｜下一篇 [Attention 與 Transformer](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer)｜[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)

前兩篇是選課前要自學的先修內容。這一講是 [ADL Fall 2025](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) 開學第一週（9/01）的正課，排在 Course Logistics 之後。投影片副標寫的是「Language Modeling & Recurrent Neural Networks」，大綱分四段：詞的表示、語言模型、RNN、RNN 的應用。

四段裡有四個新概念，但真正貫穿的只有一件事：**語言模型要估計一串詞出現的機率，做法是一次預測下一個詞。**詞的表示是它的輸入，RNN 是它的架構，應用是它換個輸出後能做的事。讀的時候抓住這條線就不會散。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=215BxEbYrCs
title: ADL 3.1: Word Representations 用機器看得懂的方式表示詞彙
```

```youtube
url: https://www.youtube.com/watch?v=eVA_WTW4gXE
title: ADL 3.2: Language Modeling 語言模型
```

原始影片：[ADL 3.1: Word Representations 用機器看得懂的方式表示詞彙](https://www.youtube.com/watch?v=215BxEbYrCs)、[ADL 3.2: Language Modeling 語言模型](https://www.youtube.com/watch?v=eVA_WTW4gXE)、[ADL 3.3: Recurrent Neural Network 簡介](https://www.youtube.com/watch?v=e9Ef3dZcvjw)、[ADL 3.4: RNN Applications RNN各式應用](https://www.youtube.com/watch?v=MyKrovk8tLM)、[ADL 4: Gating Mechanism 了解LSTM與GRU的細節](https://www.youtube.com/watch?v=LosffMy3BqM)、[5.1 Word Representation Review](https://www.youtube.com/watch?v=K2oYKdK--9U)、[5.3 Word2Vec Training](https://www.youtube.com/watch?v=4Vrd15ZwxH4)、[5.4 Word2Vec Variants](https://www.youtube.com/watch?v=cKor9hMjFLc)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

## 詞要怎麼放進電腦

投影片第 4 頁把詞的表示分成兩派。

**Knowledge-based**：用 WordNet 這類人工建的上下位關係（is-a）描述詞。第 6 頁列了四個問題：新詞進不來、標注主觀、要大量人力、很難算兩個詞有多相似。

**Corpus-based**：從大量文字裡學。最直接的做法是 one-hot，每個詞是一個只有一格為 1 的向量。問題是 car 和 motorcycle 的 one-hot 做內積永遠是 0，看不出兩者相近。

轉折點是第 8 頁的一句話：意思相近的詞，鄰居通常也相近。於是改成用「鄰居」表示一個詞：

- 以整篇文件為鄰居，得到 word-document 共現矩陣，捕捉的是主題（Latent Semantic Analysis）。
- 以前後幾個詞的窗口為鄰居，捕捉的是詞性這類句法資訊與語意資訊。

第 10 頁用三句話示範窗口長度 1 的共現矩陣：「I love AI.」「I love deep learning.」「I enjoy learning.」。算出來 love 與 enjoy 的向量都跟 I 共現，相似度就大於 0 了。

共現矩陣的問題是維度跟著詞表長大、而且很稀疏。第 11–13 頁給兩條路讓向量變短、變密：

1. 對共現矩陣做 SVD 降維。缺點是計算量大（n×m 矩陣要 O(mn²)），加新詞也麻煩。
2. 直接學低維向量，也就是後來說的 word embeddings。投影片列出這條路上的代表作：Rumelhart 1986、Bengio 2003、Collobert & Weston 2008，以及 word2vec（Mikolov 2013）與 GloVe（Pennington 2014）。

Word2Vec 與 GloVe 怎麼訓練，這一講沒有展開。課程頁把它放在「彈性補充」，連到 Fall 2022 的 [Word Embeddings 投影片](https://www.csie.ntu.edu.tw/~miulab/f111-adl/doc/220929_WordEmbeddings.pdf)（48 頁，結論頁整理 skip-gram、CBOW、GloVe 與詞向量評估）和一組舊影片。想補的讀者可以看這五支：

- [5.1 Word Representation Review](https://youtu.be/K2oYKdK--9U)
- [5.3 Word2Vec Training](https://youtu.be/4Vrd15ZwxH4)
- [5.4 Word2Vec Variants](https://youtu.be/cKor9hMjFLc)
- [5.5 GloVe](https://youtu.be/BbTSvFwuCbo)
- [5.6 Word Vector Evaluation](https://youtu.be/MnFDW20J17E)

課程頁上標成「Intro」的那一個連結（`LosffMy3BqM`）放錯了，點進去的實際標題是「[ADL 4: Gating Mechanism 了解LSTM與GRU的細節](https://youtu.be/LosffMy3BqM)」。它剛好可以當本篇 LSTM／GRU 段落的補充。

## 語言模型：估計一串詞的機率

第 16 頁用語音辨識舉例：「recognize speech」和「wreck a nice beach」唸起來幾乎一樣。老師在 [3.2 影片](https://youtu.be/eVA_WTW4gXE)裡說，大部分人會聽成前者，因為腦中的語言模型告訴你前者比較常見。機器只靠聲音分不出來，得知道哪種接法在語言裡更合理。

### n-gram：數出來的機率

n-gram 只看前 n−1 個詞。機率直接從訓練資料數：

```
P(beach | nice) = C(nice beach) / C(nice)
```

問題在沒見過的組合。第 19 頁的例子是訓練資料只有「The dog ran」和「The cat jumped」，那 P(jumped | dog) 就是 0；整串機率是連乘，一個 0 就讓整句變 0。補救是 smoothing，給沒見過的組合一個小機率（投影片寫 0.0001）。影片裡老師直接點出這招的尷尬：為什麼是 0.0001，不是別的值？根本原因是你不可能蒐集到所有文字。

### Neural LM：讓網路預測，平滑自動發生

第 21–23 頁換成用神經網路預測下一個詞的機率分布，架構引的是 [Bengio et al. 2003](https://www.jmlr.org/papers/v3/bengio03a.html)。輸入是前幾個詞的向量，輸出是整個詞表上的機率。

好處在第 23 頁：cat 和 dog 的向量很接近，所以只要 P(jump | cat) 夠大，P(jump | dog) 也會跟著變大，即使資料裡從沒出現「dog jumps」。投影片的結論是「Smoothing is automatically done」。

剩下的限制是 context window 還是固定的，只能看前 n−1 個詞。

### RNN LM：把所有前文壓進 hidden state

第 25–26 頁的想法有兩個：讓網路看到所有前文，而且每個時間點共用同一組權重。老師在影片裡補了為什麼要共用：句子有 10 個詞就用這組權重 10 次、100 個詞就用 100 次，模型大小不會因為前文變長而變大。

她也提到，RNN 現在雖然少用，但它是理解 Transformer 的前一步：Transformer 想保留時間資訊，又想去掉 RNN 的缺點。

## RNN 本身：定義、訓練、問題

第 29–31 頁的定義很短。每個時間點 t：

```
s_t = σ(W s_{t-1} + U x_t)      σ 可以是 tanh 或 ReLU
o_t = softmax(V s_t)
```

整個模型只有 W、U、V 三組矩陣要學。語言模型的訓練目標是讓每一步的輸出 o_t 接近下一個真正的詞 y_t，把每一步的 loss 加總後一起最佳化。

<details>
<summary>BPTT：把 RNN 攤開來做反向傳播（投影片第 34–41 頁）</summary>

投影片先複習一般網路的反向傳播：某個參數的梯度拆成 forward pass 算出的 activation與 backward pass 的 error signal δ 相乘，δ 從最後一層往前傳。

RNN 的做法是沿時間軸展開（Unfold）。輸入是 init、x₁、x₂…x_t，輸出 o_t 要對上目標 y_t。展開後，「往前一層」變成「往前一個時間點」：error 從 s_t 傳到 s_{t−1}、s_{t−2}……所以叫 Backpropagation through Time。

和一般網路不同的地方是權重綁在一起（第 39–40 頁的「Weights are tied together」）。每個時間點的同一條連線其實是同一個參數，梯度要全部累加。

第 41 頁用四個時間點示範：forward pass 算出 s₁ 到 s₄；backward pass 對 C⁽⁴⁾、C⁽³⁾、C⁽²⁾、C⁽¹⁾ 各做一次，每個 loss 只往它之前的時間點傳。老師在 [3.3 影片](https://youtu.be/e9Ef3dZcvjw)提醒，因為時間軸很長、權重又共享，RNN 訓練起來會蠻久的。

</details>

### 梯度消失與爆炸

第 43 頁：反向傳播時每一步都乘上同一個矩陣，乘久了梯度不是很快變小就是很快變大。第 44 頁把結果畫成 error surface，要嘛很平、要嘛很陡，最佳化很不穩。老師的比喻是 0.9 乘很多次就接近 0，略大於 1 的值乘很多次就爆掉。

兩個問題的解法不對稱：

- **爆炸 → clipping**（第 46 頁，引 [Pascanu et al. 2013](https://proceedings.mlr.press/v28/pascanu13.html)）：梯度超過門檻就等比例縮小。投影片註明門檻設在平均值的一半到十倍之間都還能收斂。
- **消失 → gating**（第 47–49 頁）：例句是「I grew up in France… I speak fluent French.」理論上 RNN 能記住很久以前的 France，實際上梯度傳不回去。LSTM（Hochreiter & Schmidhuber 1997）與 GRU（Cho et al. 2014）加上門控，開出一條能直達遠處的捷徑，讓模型自己學什麼時候開門。

老師在影片裡順帶預告：長距離依賴也是 Transformer 擅長的事，attention 可以直接跳過中間的詞看到相關的那一個。這就是[下一篇](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer)的起點。

### 兩個延伸

- **雙向 RNN**（第 50 頁）：左到右、右到左各跑一次再接起來，每個位置同時摘要過去與未來。影片提醒，做「預測下一個詞」的語言模型時不能直接把整句丟進雙向 RNN，否則模型會偷看到答案。
- **深層雙向 RNN**（第 51 頁）：每一層把中間表示傳給上一層。

## RNN 能做什麼：看輸入和輸出長什麼樣

第 54 頁把學習問題寫成 f : X → Y，並強調網路設計要利用輸入域與輸出域的性質。輸入可以是詞、詞序列、聲音、點擊紀錄；輸出可以是單一標籤、序列標記、樹狀結構、機率分布。

老師在 [3.4 影片](https://youtu.be/MyKrovk8tLM)補了一個實務提醒：把一句話的詞向量直接平均當句向量，看起來很笨，但如果任務只是判斷「是不是金融類」，這樣就夠了，還很省資源。

依輸入與輸出，這一講分成三類：

| 類型 | 做法 | 投影片例子 |
|---|---|---|
| 輸入是序列 | 用 RNN 把整句壓成一個向量，後面接分類器，端到端一起訓練 | 情感分析「這 規格 有 誠意」（第 57 頁） |
| 輸出是序列，而且跟輸入對齊（tagging） | 每個時間點輸出一個標記 | 詞性標註「四樓 好 專業」；slot tagging 把「send email to bob about fishing this weekend」轉成 `send_email(contact_name="bob", subject="fishing this weekend")`（第 61–62 頁） |
| 輸出是序列，但不對齊（seq2seq） | 一個 RNN 編碼、一個 RNN 解碼 | 機器翻譯、閒聊對話（第 64–65 頁） |

第 59 頁的一句話值得記住：序列輸出可以看成一連串的分類。老師在影片裡把它接到今天的 LLM：生成每一個 token，都是在整個詞表上做一次分類。

她也建議能用 tagging 解的任務就用 tagging，因為輸入輸出對齊時，參數少、訓練容易得多。影片最後說，這些應用情境全部都能換成 Transformer 來做，而 HW1 用的就是 Transformer 家族的模型（見 [HW1 中文抽取式問答](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa)）。

## 自學怎麼做

1. 先看 [3.2](https://youtu.be/eVA_WTW4gXE)（15 分鐘）。n-gram → neural LM → RNN LM 這條演進線是整講的骨幹。
2. 看 [3.3](https://youtu.be/e9Ef3dZcvjw) 時對著投影片第 41 頁，自己在紙上畫四個時間點的 backward pass，確認每個 loss 往哪裡傳。
3. 想補詞嵌入再回頭看彈性補充的五支影片；想看 LSTM／GRU 內部的門，看課程頁誤標成 Intro 的那一支 Gating Mechanism。

今晚可以做的一件事：拿投影片第 10 頁那三句話，自己數一次窗口長度 1 的共現矩陣，再算 love 和 enjoy 兩列的 cosine similarity。你會親手看到「鄰居相近 → 向量相近」是怎麼發生的。

## 延伸閱讀

- 同一段內容在 Stanford 的講法：[CS224N 詞向量](/posts/ai/2026-08-22-cs224n-word-vectors)、[CS224N RNN 與語言模型](/posts/ai/2026-08-22-cs224n-rnn-language-models)
- 同校課程怎麼分工：[台大 AI／ML 課程地圖](/posts/learning/2026-09-30-ntu-ai-ml-course-map)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 9/01 課表列與彈性補充列
- [Sequence Modeling 投影片（2025/09/01）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_SeqModel.pdf) — 本文引用的頁碼都出自這份
- [ADL 3.1: Word Representations 用機器看得懂的方式表示詞彙](https://youtu.be/215BxEbYrCs)（22:04）
- [ADL 3.2: Language Modeling 語言模型](https://youtu.be/eVA_WTW4gXE)（15:28）
- [ADL 3.3: Recurrent Neural Network 簡介](https://youtu.be/e9Ef3dZcvjw)（16:11）
- [ADL 3.4: RNN Applications RNN各式應用](https://youtu.be/MyKrovk8tLM)（12:25）
- [Word Embeddings 投影片（Fall 2022，彈性補充）](https://www.csie.ntu.edu.tw/~miulab/f111-adl/doc/220929_WordEmbeddings.pdf)
- [ADL 4: Gating Mechanism 了解LSTM與GRU的細節](https://youtu.be/LosffMy3BqM) — 課程頁誤標為 Word Embeddings Intro
- [2025 Fall ADL 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Bengio et al., A Neural Probabilistic Language Model（JMLR 2003）](https://www.jmlr.org/papers/v3/bengio03a.html)
- [Pascanu, Mikolov & Bengio, On the difficulty of training recurrent neural networks（ICML 2013）](https://proceedings.mlr.press/v28/pascanu13.html)

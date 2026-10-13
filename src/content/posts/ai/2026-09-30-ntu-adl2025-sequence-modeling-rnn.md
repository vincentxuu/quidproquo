---
title: "詞向量、語言模型與 RNN：怎麼表示一個詞、怎麼預測下一個詞｜台大陳縕儂 深度學習之應用 第 3 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, language-model, rnn]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 導讀"
  order: 3
tldr: "這一堂有一條主線：語言模型要估計一串詞出現的機率，做法是一次預測下一個詞。先講詞怎麼表示，從字典、one-hot、共現矩陣走到低維的 word embedding。再講語言模型的三代：n-gram 用數的，沒看過的組合機率是零；neural LM 用網路預測，相近的詞自動分到機率；RNN LM 把所有前文累積在 hidden state，每個時間點共用同一組權重。RNN 用 BPTT 訓練，同一個矩陣乘很多次會讓梯度消失或爆炸，爆炸用 clipping，消失靠 LSTM、GRU 的 gating。最後依輸入與輸出的形狀，把應用分成整句分類、tagging 與 encoder-decoder。"
description: "台大陳縕儂《深度學習之應用》Fall 2025 第 3 堂導讀，依 Sequence Modeling 投影片及影片 3.1–3.4 的課堂口述：WordNet 與 one-hot 的限制、共現矩陣與 SVD、word2vec 與 GloVe 的想法、n-gram 與 smoothing、Bengio 2003 neural LM、RNN LM 與權重共享、BPTT、梯度消失與爆炸、clipping、LSTM／GRU、雙向 RNN，以及情感分析、詞性標註、slot tagging、機器翻譯等應用。附四個可以手算的例子與自我檢查。"
draft: false
glossary:
  - term: "RNN LM"
    aliases: ["RNNLM", "recurrent neural network language model", "遞迴神經網路語言模型"]
    definition: "用遞迴神經網路預測下一個詞的語言模型。每個時間點把目前的詞向量與上一步的 hidden state 合起來，所有時間點共用同一組權重，所以理論上能用上全部前文，模型大小也不隨句長增加。"
    context: "ADL Sequence Modeling 投影片第 25–26 頁，接在 n-gram 與 feed-forward neural LM 之後，解決固定 context window 的限制。"
  - term: "BPTT"
    aliases: ["backpropagation through time", "時間反向傳播"]
    definition: "把 RNN 沿時間軸展開成一個很深的網路，再照一般反向傳播計算梯度；因為每個時間點共用權重，所有時間點的梯度都會累加到同一組參數上。"
    context: "ADL Sequence Modeling 投影片第 36–41 頁逐步示範展開與 forward／backward pass。"
  - term: "共現矩陣"
    aliases: ["co-occurrence matrix"]
    definition: "記錄每兩個詞在語料裡互為鄰居幾次的矩陣。一個詞的那一列（或那一行）就是它的向量，鄰居相近的詞向量也相近。"
    context: "ADL Sequence Modeling 投影片第 9–10 頁，用三句話的小語料示範。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

這是[台大陳縕儂 深度學習之應用 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)的第 3 堂，依據 ADL Fall 2025（114-1，2025/09/01–12/15）開學第一週 9/01 的教材。[第 1 堂](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction)與[第 2 堂](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop)是選課前自學的先修內容，這一堂是第一堂正課。它回答兩個問題：**一個詞要用什麼形式放進電腦？一串詞接在一起合不合理，模型怎麼判斷？**

官方材料：

- [Sequence Modeling 投影片](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_SeqModel.pdf)（66 頁），副標是 Language Modeling & Recurrent Neural Networks
- 影片 [3.1 Word Representations](https://youtu.be/215BxEbYrCs)（22:04）、[3.2 Language Modeling](https://youtu.be/eVA_WTW4gXE)（15:28）、[3.3 Recurrent Neural Network](https://youtu.be/e9Ef3dZcvjw)（16:11）、[3.4 RNN Applications](https://youtu.be/MyKrovk8tLM)（12:25）
- 彈性補充：Fall 2022 的 Word Embeddings 投影片與舊影片，見「想補詞嵌入」一節

3.2、3.3、3.4 有字幕。3.1 沒有字幕，本文用音訊轉成的逐字稿整理。標成「本文自編」的例子不是課堂內容。

讀完要能做五件事：說出 one-hot 表示法缺什麼，並讀懂共現矩陣、從裡面算出兩個詞的相似度；用 n-gram 算一句話的機率，並說明零機率問題從哪裡來；解釋 neural LM 為什麼不用另外做 smoothing；寫出 RNN 每個時間點的計算，並說明梯度為什麼會消失或爆炸、各怎麼處理；看到一個任務，判斷它該用整句分類、tagging 還是 encoder-decoder。

## 詞要怎麼放進電腦

### 查字典：knowledge-based

想知道一個詞的意思，最直接是查字典。字典是專家編的，所以這一類叫 knowledge-based representation。另一類是看這個詞在大量文字裡怎麼被使用，從前後文推測它的意思，叫 corpus-based representation（投影片第 4 頁）。

Knowledge-based 的代表是 WordNet：一個由非常多的詞連成的大網路，記錄詞與詞之間的關係。第 6 頁畫的是 is-a 關係的一小塊：truck 是一種 motor vehicle，go-kart 也是，motorcar 也是；motorcar 底下又分 hatch-back、compact 等。投影片附了一段程式，用 NLTK 載入 WordNet 之後查 panda，會得到一路往上的類別：procyonid、carnivore、mammal、animal、organism……

老師說這種做法滿方便的，查一下就知道一個詞「是一種什麼」。投影片列了四個問題，她逐一說明：

- **新詞進不來**。新發明的詞來不及被收進去。
- **主觀**。關係怎麼定，完全看編的人，不同的人編出來可能不一樣。
- **要花大量標註時間**。
- **很難算兩個詞有多相似**。她用圖上的距離舉例：motor vehicle 到 compact 隔兩步，compact 到 hatch-back 也隔兩步。但前者是祖孫關係，後者是兄弟關係。同樣是距離 2，語意上的關係並不一樣。

### One-hot：每個詞一格

改從資料出發，最基本的做法是 one-hot。假設詞彙表有三萬個詞，就準備一個三萬維的向量。car 是詞彙表裡的第七個詞，就把第七維設成 1，其他都是 0（第 8 頁）。

問題出在線性代數上。每一維是一個軸，軸和軸之間彼此垂直。car 佔一個軸，motorcycle 佔另一個軸，兩個向量垂直，也就是無關。但 car 和 motorcycle 明明有關，它們都是 motor vehicle。投影片把兩個向量做 AND，結果是 0。老師說不管用什麼運算，這種表示法都算不出兩個詞實際上的關聯，等於假設每個詞彼此獨立。

### 用鄰居表示一個詞

轉折點是第 8 頁最下面那一句：**意思相近的詞，鄰居通常也相近**。老師的例子是 car 和 motor vehicle 前面都常出現 drive。

於是改用鄰居來表示一個詞。鄰居怎麼定義，會影響學到的東西（第 9 頁）：

- **同一篇文件就算鄰居**。定義比較寬，學到的偏向主題：金融相關的詞彼此接近，體育相關的詞彼此接近。這是 Latent Semantic Analysis 的做法。
- **前後幾個詞以內才算鄰居**。定義比較窄，學到的除了語意，還有詞性這類句法資訊。老師的說明是：動詞後面常接相關的名詞，所以相近的會是同樣詞性的詞。

第 10 頁用三句話示範視窗長度為 1 的共現矩陣。語料是「I love AI.」「I love deep learning.」「I enjoy learning.」，左右各看一個詞：

| | I | love | enjoy | AI | deep | learning |
|---|---|---|---|---|---|---|
| I | 0 | 2 | 1 | 0 | 0 | 0 |
| love | 2 | 0 | 0 | 1 | 1 | 0 |
| enjoy | 1 | 0 | 0 | 0 | 0 | 1 |
| AI | 0 | 1 | 0 | 0 | 0 | 0 |
| deep | 0 | 1 | 0 | 0 | 0 | 1 |
| learning | 0 | 0 | 1 | 0 | 1 | 0 |

I 和 love 互為鄰居兩次，所以那一格是 2。矩陣是對稱的，看列或看行都一樣。love 和 enjoy 都有 I 這個鄰居，所以兩個向量的相似度大於 0。

**例子（本文自編）**。條件：用上面那張表，取 love 和 enjoy 兩列當向量，算 cosine similarity。

- 推理：love = (2, 0, 0, 1, 1, 0)，enjoy = (1, 0, 0, 0, 0, 1)。內積是 2×1 = 2。長度分別是 √(4+1+1) = √6 與 √(1+1) = √2。相似度是 2 ÷ (√6 × √2) = 2 ÷ √12 ≈ 0.58。
- 對照：如果用 one-hot，love 和 enjoy 各佔一維，內積是 0，相似度是 0。
- 結果與意義：只靠三句話，「鄰居相同」就讓 love 和 enjoy 的相似度從 0 變成 0.58。沒有人告訴模型這兩個詞意思相近，這是從資料的分布算出來的。

### 讓向量變短：SVD

共現矩陣的問題在第 10 頁左下角：矩陣大小跟著詞彙表長大、維度很高、而且稀疏。老師解釋稀疏為什麼不好：花了那麼多維，大部分是 0，真正帶資訊的位置很少，後面的應用很難從少少幾個非零的維度做出效果。我們想要的是把資訊壓進比較少的維度。

第一種做法是對共現矩陣做 SVD（第 11–12 頁）。SVD 把矩陣拆成三個矩陣相乘，中間那個只有對角線有值。把對角線上的值由大到小排好，只留前 k 個，其他刪掉，乘回來的矩陣會接近原本的矩陣，損失一些資訊，但每個詞可以改用 k 維的向量表示。

第 12 頁是做完之後的結果。老師帶大家看：dog 和 cat 很近，puppy 和 kitten 很近；手、腳這些身體部位在一區，動物在一區，國家與地名在一區。換一種視窗定義，take、taken、taking、took 這些同一個詞的不同形式也會聚在一起。降維之後，向量還是保有我們想要的語意。

缺點是慢。投影片寫 n×m 的矩陣在 n<m 時要 O(mn²)。老師說共現矩陣是 N×N，代價就是 N 的三次方；再加上每多一個新詞，矩陣就多一列，整個 SVD 要重算。

### 直接學低維向量

第二種做法是跳過矩陣，直接把低維的向量學出來（第 13 頁）。投影片列出這條路上的工作：Rumelhart 等 1986、Bengio 等 2003、Collobert 與 Weston 2008，以及後來最常用的 word2vec（Mikolov 等 2013）與 GloVe（Pennington 等 2014）。

老師在這一堂只講概念：用深度學習的方式，找一個任務讓模型去做，例如預測一個詞的鄰居。如果向量能把鄰居預測得準，就代表它把這個詞彙表示得好。兩個詞的語意很接近，它們要預測的鄰居也很像，學出來的向量自然就接近。

為什麼叫 word **embedding**？她的解釋是：先設定好一個低維的空間，例如 300 維，然後決定每個詞要放在這個空間的哪個位置。它是直接把詞「嵌」進去，中間沒有先做矩陣再降維這一步。

學出來的向量有一些有趣的性質（第 13 頁下方的三張圖）。man 到 woman 的方向，和 king 到 queen 的方向很接近；walking 到 walked 的方向，和 swimming 到 swam 的方向也接近。所以「man 之於 woman，等於 king 之於什麼」這種題目，可以在向量空間裡用加減算出一個位置，再找離它最近的詞。

### 想補詞嵌入

Word2vec 與 GloVe 怎麼訓練，這一堂沒有展開，老師說細節在補充教材裡。課程頁把它列為彈性補充，連到 Fall 2022 的 [Word Embeddings 投影片](https://www.csie.ntu.edu.tw/~miulab/f111-adl/doc/220929_WordEmbeddings.pdf)（48 頁）和一組舊影片：

- [5.1 Word Representation Review](https://youtu.be/K2oYKdK--9U)
- [5.3 Word2Vec Training](https://youtu.be/4Vrd15ZwxH4)
- [5.4 Word2Vec Variants](https://youtu.be/cKor9hMjFLc)
- [5.5 GloVe](https://youtu.be/BbTSvFwuCbo)
- [5.6 Word Vector Evaluation](https://youtu.be/MnFDW20J17E)

課程頁上標成「Intro」的那一個連結（`LosffMy3BqM`）放錯了，點進去的實際標題是「[ADL 4: Gating Mechanism 了解LSTM與GRU的細節](https://youtu.be/LosffMy3BqM)」。它剛好可以當本文 LSTM／GRU 段落的補充。

## 語言模型：估計一串詞的機率

有了單一個詞的表示，下一步是很多詞接在一起。語言模型要做的事是：給一串詞，估計它們這樣接在一起的機率 P(w₁, …, w_m)（第 16 頁）。

老師先用直覺說明。聽外國人講一句話，你聽得懂，但覺得接得怪怪的。那個「怪」就是你心裡估出來的機率比較低，因為你很少看過這樣的接法。

投影片的例子是語音辨識。一段聲音可以聽成 recognize speech，也可以聽成 wreck a nice beach，兩者唸起來幾乎一樣。多數人聽到的是前者，因為腦中的語言模型告訴你前者的機率比較高。機器不能只靠聲音判斷，它得知道這個語言裡哪種接法比較常見。

### n-gram：用數的

最早的做法是 n-gram（第 18 頁）。一串詞的機率可以拆成條件機率連乘：第一個詞的機率，乘上「看到第一個詞之後接第二個詞」的機率，再乘上「看到前兩個詞之後接第三個詞」的機率，依此類推。每次都看全部前文不實際，所以規定只看前 n−1 個詞：

P(w₁, …, w_m) ≈ ∏ P(wᵢ | wᵢ₋₍ₙ₋₁₎, …, wᵢ₋₁)

每個條件機率直接從訓練資料數出來：

P(beach | nice) = C(nice beach) ÷ C(nice)

分子是「nice beach」在資料裡出現幾次，分母是「nice」出現幾次。（投影片這一頁的分子印成 nice each，老師在課堂上說少了一個 b。）把所有 n-gram 的機率先算好，新的一串詞進來，查表相乘就得到整串的機率。

問題是訓練資料不可能涵蓋所有情況。第 19 頁的例子：訓練資料裡只有「The dog ran ……」和「The cat jumped ……」，那 P(jumped | dog) 和 P(ran | cat) 都是 0。難道狗不能跳、貓不能跑嗎？

**例子（本文自編）**。條件：用 bigram（n = 2），訓練資料只有「the dog ran」和「the cat jumped」兩句，要算「the dog jumped」的機率。

- 推理：P(the | START) = 2/2 = 1。P(dog | the) = 1/2，因為 the 後面一次接 dog、一次接 cat。P(jumped | dog) = 0/1 = 0，因為 dog 後面只接過 ran。三者相乘是 1 × 0.5 × 0 = 0。
- 補救：照投影片的做法，把 0 換成一個小機率 0.0001，結果變成 1 × 0.5 × 0.0001 = 0.00005。（這裡只照投影片把 0 換掉，沒有把其他機率重新調整到總和為 1。）
- 結果與意義：連乘裡只要有一項是 0，整句的機率就是 0，不管其他部分多合理。補上小機率之後不再是 0，但這個 0.0001 是人指定的，和「狗會不會跳」沒有關係。

給沒看過的組合一個小機率，這件事叫 smoothing。老師直接指出它的尷尬：為什麼是 0.0001，不是別的值？為什麼 P(jumped | dog) 和 P(ran | cat) 要給一樣的值？歷來提出過很多種 smoothing 的方法，但問題沒辦法完全解決，因為根本原因是你不可能收集到所有可能的文字。投影片的兩句結論是：機率不準確；原因是不可能收集到所有文字當訓練資料。n-gram 語言模型就這樣用了非常久。

### Neural LM：讓網路預測

突破來自 neural language model（第 21–23 頁）。要估的東西沒變，還是「看到前幾個詞，下一個詞的機率」。差別是不從資料裡數，改用一個神經網路來預測。

以 bigram 為例，「wreck a nice beach」的機率拆成四項：P(wreck | START)、P(a | wreck)、P(nice | a)、P(beach | nice)。同一個網路用四次：輸入是前一個詞的向量，輸出是整個詞彙表上的機率分布，第一維是詞彙表裡第一個詞接在後面的機率，依此類推。要看接 wreck 的機率，就去看 wreck 對應的那一維。

第 22 頁是 [Bengio 等 2003](https://www.jmlr.org/papers/v3/bengio03a.html) 的架構，式子是：

ŷ = softmax( W⁽²⁾ σ(W⁽¹⁾x + b⁽¹⁾) + W⁽³⁾x + b⁽³⁾ )

老師沒有細講這個式子，她說裡面有三個矩陣要訓練，簡單來說可以想成：輸入是前面幾個詞，中間有 hidden layer，輸出是下一個詞的機率分布。

好處在第 23 頁。輸入是詞向量，而 cat 和 dog 的向量很接近。訓練資料裡常看到 cat 後面接 jump，網路學到「看到 cat 的向量，jump 的機率高」。把輸入換成 dog，向量差不多，預測出來 jump 的機率也跟著高，即使資料裡從來沒有「dog jumps」。投影片的結論是 Smoothing is automatically done。老師的說法是：它不是用數的來估計，是直接用模型預測，只要一開始的向量夠好，這個性質自然就有，完全不用特別去指定機率。

剩下的限制寫在同一頁：context window 還是固定的。

### RNN LM：把所有前文傳下去

下一個詞的機率其實和前面所有的詞都有關，固定只看前兩個或前三個並不務實。Recurrent neural network language model（RNNLM，第 25–26 頁）的想法有兩個：

- **用上所有前文**。把前面每一步的資訊彙整起來，一起傳給下一步。
- **每個時間點共用同一組權重**。用了比較多的前文，模型不應該因此變大。所以只訓練一組權重：前面有 10 個詞就用這組權重 10 次，有 100 個詞就用 100 次。

這個做法背後的假設是資料有時間順序（投影片：temporal information matters）。

第 26 頁的圖和前面 neural LM 的圖很像，都是同一個網路用四次。差別是中間多了藍色的箭頭：每個時間點的 hidden layer 把資訊傳給下一個時間點。老師說，neural LM 是把同一個模型用四次，RNN 是把「用四次」這件事正式放進同一個模型裡。

她也提醒，RNN 現在聽起來已經很少被使用，但它是走到 Transformer 的重要一步：Transformer 一樣想處理時間上的資訊，又想去掉 RNN 的一些缺點。

## RNN：定義、訓練與問題

### 定義

第 29–31 頁的定義很短。每個時間點 t：

s_t = σ(W s_{t−1} + U x_t)

o_t = softmax(V s_t)

x_t 是現在這個詞的向量，s_{t−1} 是上一個時間點的 hidden state，兩者合起來得到現在的 s_t，再由 s_t 算出輸出 o_t。σ 可以是 tanh 或 ReLU。整個模型要訓練的只有 W、U、V 三個矩陣。（第 29 頁把 hidden state 寫成 h_t、輸出寫成 ŷ_t，第 31 頁寫成 s_t 與 o_t，是同一組東西。）

做語言模型時，o_t 的意思是：看了 x₁ 到 x_t 之後，下一個詞是詞彙表裡每個詞的機率。前面的詞已經累積在 hidden state 裡，所以每一步只要餵進一個詞。

圖有兩種畫法：一種是一個節點帶一個繞回自己的箭頭，一種是沿時間展開（unfold）成一長串。兩者是同一個模型。

### 訓練：BPTT

訓練目標是讓每個時間點的輸出 o_t 接近正確答案 y_t，也就是真正的下一個詞。一句話有三個詞，就有三個 loss，加在一起，一起去調整 W、U、V（第 32 頁）。

第 34–35 頁先複習第 2 堂的反向傳播：某個參數的梯度可以拆成兩部分相乘，一部分從 forward pass 來，一部分是 backward pass 的 error signal δ，δ 從最後一層往前一層一層傳。

RNN 的做法是沿時間軸展開之後照做（第 36–40 頁）。差別有兩個：

- 一般網路的「往前一層」，在這裡是「往前一個時間點」：error 從 s_t 傳到 s_{t−1}、s_{t−2}……所以叫 backpropagation through time（BPTT）。
- 每個時間點的權重是同一組（投影片：Weights are tied together）。一般網路每一層的權重各自不同；這裡每個時間點算出來的梯度，都要累加到同一個矩陣上。

第 41 頁用四個時間點示範。Forward pass 先算出 s₁ 到 s₄。Backward pass 對 C⁽⁴⁾、C⁽³⁾、C⁽²⁾、C⁽¹⁾ 四個 loss 各做一次，每個 loss 只往它之前的時間點傳。因為權重共用，更新一次參數會影響所有時間點。老師說，自己訓練過 RNN 就會發現滿久的，因為時間這個維度很長。

### 梯度消失與爆炸

第 43 頁指出問題：反向傳播的每一步都要乘上同一個矩陣。投影片把 δˡ = σ′(zˡ) ⊙ (Wˡ⁺¹)ᵀ δˡ⁺¹ 裡的 W 圈起來，結論是梯度很快變得很小或很大。

老師的說明是：一個值就算只是偏小，例如 0.9，乘了很多次也會接近 0；稍微偏大一點的值，乘了很多次會變得很大。

**例子（本文自編）**。條件：把那個矩陣簡化成一個數字，看它連乘 50 次的結果。

- 推理：0.9⁵⁰ ≈ 0.005，1.1⁵⁰ ≈ 117。
- 結果與意義：0.9 和 1.1 只差 0.2，經過 50 個時間點之後，一個剩下原本的千分之五，一個放大超過一百倍。第 50 個時間點的 loss 想調整第 1 個時間點的行為，傳回去的訊號不是幾乎消失，就是大到失控。

兩種情況都不好。太小，梯度消失，不知道參數該往哪邊調。太大，稍微動一下，後面的值就全變了，很難控制。

第 44 頁把結果畫成 error surface：兩個軸是兩個參數，高度是 cost。曲面不是很平就是很陡。在平的地方，走一步 cost 幾乎沒降；走到陡的地方，可能一步掉下去很多，也可能一步飛到很高的地方。訓練過程因此很不穩定。第 45 頁是同一件事的直方圖：老師說一開始數值還算平均；到 50 個時間點，數值集中在 0 和 ±100 兩端。

### 爆炸：clipping

太大比較好處理（第 46 頁，Pascanu 等 2013）：超過門檻就等比例縮小。投影片的虛擬碼是：如果 ‖g‖ ≥ threshold，就把 g 換成 (threshold ÷ ‖g‖) × g。圖上的虛線是 clipping 之後的路徑，不會飛太遠，還能繼續訓練。投影片註明門檻設在平均值的一半到十倍之間都還能收斂。

**例子（本文自編）**。條件：梯度 g = (3, 4)，門檻設 1。

- 推理：‖g‖ = √(9 + 16) = 5，超過門檻。新的 g = (1 ÷ 5) × (3, 4) = (0.6, 0.8)。
- 結果與意義：長度從 5 縮成 1，方向沒有變。Clipping 只限制一步走多遠，不改變往哪裡走。

### 消失：gating

消失比較麻煩。老師的說法是：太大還可以把它變小，但消失了，你也不知道它原本是多少。

問題出在路太長。序列很長時，後面的 error 要影響前面的權重，中間乘了太多次，資訊就沒了。第 47 頁的例子是：前面寫了「I grew up in France」，中間隔了很多內容，後面寫「I speak fluent ___」。語言模型夠好的話，French 的機率應該比其他語言高。但中間隔得太遠，France 的資訊很難影響到最後的預測。理論上 RNN 處理得了長距離的依賴（投影片：in theory），實際上因為電腦的數值精確度有限，太小的值就變成 0 了。

當時有名的解法是 LSTM（Hochreiter 與 Schmidhuber 1997）和 GRU（Cho 等 2014），第 48–49 頁。機制叫 gating，gate 是大門的意思。老師的描述是：在原本的 RNN 上面多開一條捷徑，這條路沒有什麼阻礙，可以一路衝到很後面，影響很遠的輸出。能不能走上這條捷徑，由幾道大門控制，什麼時候開、什麼時候關，讓模型自己學。她沒有細講門的內部構造。

她順帶預告：長距離依賴也是 Transformer 擅長的事。只要一個詞出現在 context 裡，attention 就能直接看到它和現在這個詞相關，不用一路傳。這是[第 4 堂](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer)的起點。

### 兩個延伸

- **雙向 RNN**（第 50 頁）。除了從左到右，再加一個從右到左的 RNN，兩邊的 hidden state 接起來，每個位置同時摘要了過去與未來。老師特別提醒：做「預測下一個詞」的語言模型時，不能把整句丟進雙向 RNN 訓練。要預測第三個詞時，如果已經看到從後面傳回來的資訊，就不合理了。
- **深層雙向 RNN**（第 51 頁）。時間的維度已經很深，層數還是可以再疊，每一層把中間的表示傳給上一層。

## RNN 能做什麼：先看輸入與輸出

影片 3.4 開頭先說明：這裡的應用情境和現在用 Transformer 的情境很像，因為 Transformer 也是用來捕捉一連串序列資訊的方法。

第 54 頁把學習問題寫成 f : X → Y。老師強調，選模型之前要先想清楚輸入是什麼、輸出是什麼、各有什麼性質：

- **輸入**可以是一個詞、一串詞、聲音訊號、點擊紀錄。輸入是一個詞，用一般的全連接網路就可以；是一串詞，就要用處理序列的方法。她舉廣告的例子：輸入是使用者的點擊紀錄，要把整串點擊當序列看，還是只用一個當下的表示來預測，會選到很不一樣的模型。
- **輸出**可以是單一標籤、一串標記、樹狀結構、機率分布。

### 輸入是序列：把整句變成一個向量

第 56 頁列了把一串詞的意思合成一個向量的方法。

最簡單的是把每個詞的向量平均或相加。老師說這種做法其實很常見：如果任務只是判斷一句話是不是金融類，不需要精細地理解句意，簡單平均就夠了，而且非常省資源。看起來很笨的方法，在某些應用上可以用很少的資源做到很好的效果。

複雜一點的是用模型去學怎麼組合：RvNN（recursive，考慮比較複雜的結構）、RNN、CNN（把每個詞和它旁邊的詞的資訊彙整起來，比較沒有時間順序的概念）、Transformer。

第 57 頁用情感分析示範。輸入是「這 規格 有 誠意」，RNN 一個詞一個詞讀完，最後的向量代表整句的資訊，後面接一個一般的全連接網路做分類。訓練時 RNN 和後面的分類網路一起調整，這叫 end-to-end optimization。老師補充，整個模型不必是同一種架構，前面接 RNN、中間加 attention、後面接全連接層都可以。

### 輸出是序列：tagging 與 seq2seq

第 59 頁的三個例子都要輸出一串東西：詞性標註（「推薦我台大後門的餐廳」每個詞標上詞性）、語音辨識（一段聲音轉成「大家好」）、機器翻譯（How are you doing today? 翻成「你好嗎？」）。

投影片的結論是：輸出可以看成一連串的分類。老師把它接到現在的語言模型：產生第一個字、第二個字、第三個字，每一次都是在整個詞彙表裡決定要產生哪一個，就是一次分類。

序列輸出再分兩種：

| | Tagging | Seq2seq（encoder-decoder） |
|---|---|---|
| 輸入與輸出 | 對齊，順序相同，一個位置對一個標記 | 不對齊，順序可以不同 |
| 做法 | 每個時間點直接輸出一個標記 | 一個 RNN 把輸入編碼，另一個 RNN 解碼出輸出 |
| 投影片例子 | 詞性標註「四樓／好／專業」→ N／VA／AD（第 61 頁）；slot tagging（第 62 頁） | 機器翻譯「超棒 的 醬汁」→ Awesome sauce（第 64 頁）；閒聊對話 How are you → I am fine（第 65 頁） |

第 62 頁的 slot tagging 例子：使用者說「just sent email to bob about fishing this weekend」。模型在 bob 上標 B-contact_name，在 fishing this weekend 三個詞上標 B-subject、I-subject、I-subject，其他詞標 O，最後判斷整句的意圖是 send_email。有了這些標記，就能組出 `send_email(contact_name="bob", subject="fishing this weekend")` 這個 API 呼叫。

老師的建議是：能用 tagging 做的任務就用 tagging。輸入和輸出對齊時，訓練容易得多，參數也少。先把一整段讀進去、再產生另一段，難度高很多。但很多任務不對齊，機器翻譯就是，這時只能先 encode 再 decode。投影片的兩句對照是：tagging 的輸入與輸出時間順序相同；seq2seq 的時間順序可以不同。

Encoder-decoder 這個概念和用什麼模型無關，用 RNN 或 Transformer 來做都可以。老師最後說，這一堂提到的應用情境全部都能換成 Transformer，而 [HW1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa) 要用的就是 Transformer 的模型。

## 常見的誤解

以下是本文的歸納，不是課堂上逐條列出的內容。

- **「One-hot 向量至少能看出哪些詞比較像。」** 看不出來。任兩個不同的詞，向量都互相垂直，相似度一律是 0。
- **「共現矩陣的視窗大小只是個技術參數。」** 它決定學到什麼。整篇文件當視窗，學到的偏主題；前後幾個詞當視窗，還會學到詞性這類句法資訊。
- **「Smoothing 解決了 n-gram 的零機率問題。」** 它只是讓連乘不會變成 0。補上的機率是人指定的，並不準確，根本原因是資料永遠收集不完。
- **「RNN 用了全部前文，所以句子越長、模型越大。」** 權重是共用的。句子再長，要訓練的還是 W、U、V 三個矩陣。
- **「RNN 理論上能記住很久以前的資訊，所以實際上也可以。」** 實際上梯度傳不回去。這就是需要 LSTM、GRU，以及後來 attention 的原因。
- **「梯度爆炸和梯度消失是同一個問題，用同一招解。」** 來源相同，都是同一個矩陣乘太多次，但解法不對稱：爆炸可以 clipping，消失沒辦法事後補救，要改模型結構。
- **「雙向一定比單向好。」** 做預測下一個詞的語言模型時，把整句丟進雙向 RNN 會讓模型看到答案；雙向只能用在已經出現的前文上。

## 自我檢查

題目是本文自擬的，答案都能從上面的內容找到。

**1. WordNet 這類 knowledge-based 表示法有哪四個問題？**

新詞進不來、內容主觀、需要大量標註時間、很難計算兩個詞的相似度。

**2. 用第 10 頁的共現矩陣，算 deep 和 enjoy 的 cosine similarity。**

deep = (0, 1, 0, 0, 0, 1)，enjoy = (1, 0, 0, 0, 0, 1)。內積是 1（兩者都和 learning 相鄰），長度都是 √2，相似度是 1 ÷ 2 = 0.5。

**3. 訓練資料只有「the dog ran」和「the cat jumped」。用 bigram 算 P(cat | the) 和 P(ran | cat)。**

P(cat | the) = 1/2。P(ran | cat) = 0，因為 cat 後面只接過 jumped。

**4. Neural LM 為什麼不需要另外做 smoothing？**

它用網路預測機率，輸入是詞向量。相近的詞向量相近，所以資料裡有「cat jump」，「dog jump」的機率也會被拉高，即使沒看過。

**5. Neural LM 還剩什麼限制？RNN LM 怎麼處理？**

Context window 固定，只能看前 n−1 個詞。RNN LM 把每一步的資訊透過 hidden state 傳給下一步，所以能用上所有前文，而且每個時間點共用同一組權重。

**6. 一個 RNN 處理長度 20 和長度 200 的句子，要訓練的參數量差多少？**

一樣多。都是 W、U、V 三個矩陣，長的句子只是把同一組權重多用幾次。

**7. 梯度 g = (6, 8)，門檻是 5。Clipping 之後是多少？**

‖g‖ = 10，超過門檻。新的 g = (5 ÷ 10) × (6, 8) = (3, 4)。

**8. 為什麼梯度消失比梯度爆炸難處理？當時的解法是什麼？**

太大可以縮小；消失之後不知道原本是多少，補不回來。解法是改模型：LSTM 與 GRU 用 gating 開一條可以直達遠處的路，由模型學什麼時候開門。

**9. 下面三個任務各該用哪一種做法：判斷一則評論是正面還是負面、替句子裡每個詞標詞性、把英文翻成中文？**

整句分類（把序列編成一個向量再接分類器）、tagging（輸入輸出對齊）、seq2seq（輸入輸出不對齊）。

**10. 為什麼說「序列輸出可以看成一連串的分類」？**

每產生一個詞，都是在整個詞彙表裡選一個。產生一串詞，就是做很多次這樣的分類。現在的語言模型生成文字時也是如此。

## 延伸閱讀

- 同一段內容在 Stanford 的講法：[CS224N 詞向量](/posts/ai/2026-08-22-cs224n-word-vectors)、[CS224N RNN 與語言模型](/posts/ai/2026-08-22-cs224n-rnn-language-models)
- 同校課程怎麼分工：[台大 AI／ML 課程地圖](/posts/learning/2026-09-30-ntu-ai-ml-course-map)

下一堂：[第 4 堂 Attention 與 Transformer](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer)

## 課程影片來源

以下影片已於 2026-10-10 對照官方課程頁與官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=215BxEbYrCs
title: ADL 3.1: Word Representations 用機器看得懂的方式表示詞彙
```

```youtube
url: https://www.youtube.com/watch?v=eVA_WTW4gXE
title: ADL 3.2: Language Modeling 語言模型
```

```youtube
url: https://www.youtube.com/watch?v=e9Ef3dZcvjw
title: ADL 3.3: Recurrent Neural Network 簡介
```

```youtube
url: https://www.youtube.com/watch?v=MyKrovk8tLM
title: ADL 3.4: RNN Applications RNN各式應用
```

原始影片：[ADL 3.1: Word Representations 用機器看得懂的方式表示詞彙](https://www.youtube.com/watch?v=215BxEbYrCs)、[ADL 3.2: Language Modeling 語言模型](https://www.youtube.com/watch?v=eVA_WTW4gXE)、[ADL 3.3: Recurrent Neural Network 簡介](https://www.youtube.com/watch?v=e9Ef3dZcvjw)、[ADL 3.4: RNN Applications RNN各式應用](https://www.youtube.com/watch?v=MyKrovk8tLM)、[ADL 4: Gating Mechanism 了解LSTM與GRU的細節](https://www.youtube.com/watch?v=LosffMy3BqM)、[5.1 Word Representation Review](https://www.youtube.com/watch?v=K2oYKdK--9U)、[5.3 Word2Vec Training](https://www.youtube.com/watch?v=4Vrd15ZwxH4)、[5.4 Word2Vec Variants](https://www.youtube.com/watch?v=cKor9hMjFLc)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-13。

內容核對：已依字幕核對（2026-10-13）：3.2、3.3、3.4 依字幕整理。3.1 沒有字幕，本文把音訊用語音辨識轉成逐字稿後整理，逐字稿可能有聽錯的專有名詞與數字。公式、表格與圖上的內容以講義頁面為準。彈性補充的詞嵌入影片未對照。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-13：依四支影片的課堂口述重寫，補上 3.1 的內容、四個例子、常見誤解與附答案的自我檢查。

## 參考資料

- [ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 9/01 課表列與彈性補充列
- [Sequence Modeling 投影片（2025/09/01）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_SeqModel.pdf) — 本文引用的頁碼都出自這份
- [Word Embeddings 投影片（Fall 2022，彈性補充）](https://www.csie.ntu.edu.tw/~miulab/f111-adl/doc/220929_WordEmbeddings.pdf)
- [ADL 4: Gating Mechanism 了解LSTM與GRU的細節](https://youtu.be/LosffMy3BqM) — 課程頁誤標為 Word Embeddings Intro
- [2025 Fall ADL 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Bengio et al., A Neural Probabilistic Language Model（JMLR 2003）](https://www.jmlr.org/papers/v3/bengio03a.html)
- [Pascanu, Mikolov & Bengio, On the difficulty of training recurrent neural networks（ICML 2013）](https://proceedings.mlr.press/v28/pascanu13.html)

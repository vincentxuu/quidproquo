---
title: "Attention 與 Transformer｜台大陳縕儂 深度學習之應用 第 4 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, attention, transformer]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 導讀"
  order: 4
tldr: "RNN 做翻譯時，要把整句壓進一個向量，句子一長就記不住。Attention 讓解碼器每產生一個字，都回頭對輸入的每個位置打分數、取加權和；把打分數的一方叫 query、被比對的叫 key、被加權的叫 value，就是 dot-product attention。Transformer 再往前一步：讓輸入自己對自己做 attention，完全拿掉 recurrence，換來平行化與固定的路徑長度，代價是要另外補上位置資訊。"
description: "台大陳縕儂《深度學習之應用》ADL Fall 2025 Attention Mechanism 與 Transformer 兩份講義導讀：seq2seq 翻譯中的 attention、query／key／value、dot-product attention 的矩陣形式、語音辨識與 image captioning 等應用、memory network 的多次 hop；self-attention 的 Q/K/V 計算、multi-head 的 who／did what／to whom 例子、scaled dot-product、encoder／decoder block、masked self-attention、positional encoding 的四個條件與 sinusoidal 解法、訓練技巧。附 self-attention 的手算例子與自我檢查。"
draft: false
glossary:
  - term: "dot-product attention"
    aliases: ["點積注意力"]
    definition: "輸入一個 query 與一組 key-value 配對：query 跟每個 key 做內積得到分數，softmax 後變成權重，再對 value 取加權和當輸出。query 與 key 維度要相同，value 可以不同。"
    context: "ADL Attention 講義第 11–12 頁先給單一 query 的形式，再擴成多個 query 的矩陣形式。"
  - term: "positional encoding"
    aliases: ["位置編碼", "positional embedding"]
    definition: "self-attention 對輸入順序不敏感，所以要把每個位置對應的向量加到詞向量上，讓模型知道詞在哪裡。原始 Transformer 用不同頻率的 sin 與 cos 組成這個向量。"
    context: "ADL Transformer 講義第 45–52 頁列出四個設計條件，逐一淘汰三種直覺做法後介紹 sinusoidal 版本。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據台大陳縕儂《深度學習之應用》（ADL）**Fall 2025（114-1，2025/09/01–12/15）** 9/08 那週的兩份講義：[Attention Mechanism](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Attention.pdf)（28 頁）與 [Transformer](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Transformer.pdf)（58 頁），以及影片 [4.1](https://youtu.be/FLNSD3zykgE)（23:41）與 [4.2](https://youtu.be/c0O9s6MCFys)（25:01）。整門課的存取分級是 **A2**：講課端完整公開，缺口在作業端，見[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)。這一堂本身沒有缺口。

**系列位置**：上一篇 [詞向量、語言模型與 RNN](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn)｜下一篇 [第 5 堂](/posts/ai/2026-09-30-ntu-adl2025-bert-family)｜[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)

[上一篇](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn)結尾留了一個問題：RNN 理論上記得住很久以前的詞，實際上梯度傳不回去。這一堂分兩步回答。第一步是 attention，它原本是加在 RNN 翻譯模型上的外掛；第二步是 Transformer，它把 RNN 整個拿掉，只留下 attention。

兩份講義在 [ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)上是分開的兩列，但 Transformer 講義第 6–9 頁先複習 Attention 講義的翻譯 attention 與 dot-product attention，所以本篇合起來讀。

讀完這一堂要能做四件事：說出 RNN 翻譯卡在哪裡、attention 怎麼解；對一組小向量手算一次 self-attention；說出 Transformer 裡三種 attention 的 query、key、value 各從哪裡來；解釋為什麼拿掉 RNN 之後要另外補位置資訊。標成「本文自編」的例子不是課堂內容。

## 第一步：翻譯時為什麼需要 attention

### 從人的注意力講起

Attention 講義第 2–3 頁先講人。老師在 [4.1 影片](https://youtu.be/FLNSD3zykgE)裡說，你的記憶裡有今天的早餐、十年前的暑假、這門課學到的東西；有人問你「什麼是深度學習」，你只會取出相關的那一塊來組織答案。感官收到的資訊很多，真正進入 working memory 的只有你注意到的部分。第 3 頁把問題與解法寫成一行：輸入是很長的序列或一張圖片時，每次只注意一部分。

### RNN 翻譯的瓶頸

第 4 頁是上一堂的 encoder-decoder：編碼器讀完「深 度 學 習」，把整句壓成一個向量，解碼器依序產生「deep learning <END>」。

老師指出兩個問題。第一，要輸出的句子一長，這個向量在解碼過程中會被一路稀釋；常見的補救是每個時間點都把它再餵一次。第二，更根本的是，期待一個向量裝下整段長輸入本身就不實際。翻 deep 的時候真正該看的是「深度」，翻 learning 時該看的是「學習」，不同時間點該注意的地方不一樣。

### Attention 怎麼算

第 5–9 頁一步步示範。解碼器目前的狀態 z₀ 跟編碼器每個位置的 h₁…h₄ 做 match，得到分數 α。match 可以是：

- cosine similarity；
- 一個小網路，輸入 z 和 h、輸出一個數值；
- α = hᵀWz。

分數經過 softmax 變成加總為 1 的權重，再對 h 取加權和。投影片的例子是第一步學到 0.5、0.5、0、0，於是 c⁰ = 0.5h₁ + 0.5h₂，拿來產生 deep；第二步權重移到後兩個字，c¹ = 0.5h₃ + 0.5h₄，產生 learning。一路重複到產生 <END>。

第 10 頁替三個角色命名，這三個詞之後整門課都會用到：

- **query**：拿去搜尋的東西，這裡是解碼器狀態 z。
- **key**：被搜尋、用來算分數的東西，這裡是 h。
- **value**：權重最後乘上去的東西，這裡剛好也是 h。

老師特別說明 key 和 value 不一定要一樣，例如可以用某一層的向量算分數，再把權重乘到另一層的向量上。

### Dot-product attention

第 11–12 頁把上面的流程寫成公式。單一 query 時：

```
A(q, K, V) = Σᵢ [exp(q·kᵢ) / Σⱼ exp(q·kⱼ)] vᵢ
q、k 是 d_k 維；v 是 d_v 維
```

每產生一個字就有一個新的 query，所以多個 query 可以疊成矩陣 Q，一次算完：先算 QKᵀ，每一列做 softmax，再乘上 V。Q 是 |Q|×d_k、Kᵀ 是 d_k×|K|、V 是 |K|×d_v，結果是 |Q|×d_v，每個 query 得到一個 d_v 維的輸出。

### 各種應用都用得到

第 13–27 頁是一串應用，重點都是「產生輸出的每一步，注意輸入的不同部分」：

- **語音辨識**（[Listen, Attend and Spell](https://arxiv.org/abs/1508.01211)）：辨識第一個字時，只該看有聲音的那一段，前面的靜音不重要。
- **Image captioning**：把圖切成很多區塊，每產生一個詞就對區塊打分數。老師在影片裡強調 attention 的另一個好處是可解釋：模型把兩隻長頸鹿說成「白色大鳥」時，看它當時注意哪一塊，就能理解錯在哪。
- **Video captioning**：同樣的想法搬到一連串影格。
- **閱讀理解與 memory network**：拿問題當 query 去文件裡找相關句子，可以做很多次 hop。影片裡的例子是問「Greg 是什麼顏色」：第一次找到「Greg is a frog」，第二次用它找到「Brian is a frog」，第三次找到「Brian is yellow」，才答出 yellow。
- **對話式 QA**：投影片以 CoQA、QuAC 為例，每一輪問題都要參考前面的問答。

## 第二步：Transformer 把 recurrence 拿掉

### RNN 與 CNN 各自的毛病

Transformer 講義第 3–5 頁先比較兩種處理序列的架構：

| 架構 | 優點 | 缺點 |
|---|---|---|
| RNN | 適合可變長度的序列 | 要等前一個時間點算完，很難平行化；長短距離依賴都沒有明確建模 |
| CNN | 容易平行化，擅長局部依賴 | 距離遠的依賴要疊很多層才碰得到 |

老師在 [4.2 影片](https://youtu.be/c0O9s6MCFys)裡拿上一堂的例子說明 RNN 的問題：「他住在法國……他會說法語」，法國與法語高度相關，但 RNN 沒辦法讓這兩個字直接交換資訊，只能期待訊息一路傳過去。

第 11 頁的結論是：用 attention 取代 recurrence。

### Self-attention：輸入自己對自己做 attention

前面的 attention 是「輸出對輸入」，只在輸出是序列時才有「每一步注意不同地方」的意義。Self-attention 讓輸入裡的每個詞都當一次 query，所有詞（包括它自己）當 key，所以任兩個位置之間都能直接交換資訊。第 12 頁寫出兩個好處：任兩個位置之間的路徑長度固定，而且容易平行化。

第 15–23 頁一步步算。以 a¹ 為例：

1. 每個輸入 aⁱ 各乘三個矩陣，得到 qⁱ = W^q aⁱ、kⁱ = W^k aⁱ、vⁱ = W^v aⁱ。
2. q¹ 跟每個 kⁱ 做內積得到 α₁,ᵢ，softmax 後得到 α′₁,ᵢ。
3. b¹ = Σᵢ α′₁,ᵢ vⁱ。

每個位置的計算互不相依，所以 b¹ 到 b⁴ 可以同時算。第 23 頁把整件事寫成矩陣運算，要學的參數只有 W^q、W^k、W^v（softmax 那一步在講義上是用箭頭標示）：

```
Q = W^q I    K = W^k I    V = W^v I
A = Kᵀ Q     A′ = softmax(A)    O = V A′
```

（投影片把向量排成矩陣的「行」，所以寫成 KᵀQ；排成列時就是常見的 QKᵀ。這種排法下 softmax 沿著每一行（每個 query）做，和第 12 頁 QKᵀ 的逐列 softmax 是同一件事。）

### 手算一次 self-attention（本文自編）

為了只看機制，這裡把 W^q、W^k、W^v 都設成單位矩陣，所以每個詞的 q、k、v 就是它自己的向量。三個詞：

```
a¹ = (1, 0)    a² = (0, 1)    a³ = (1, 1)
```

**算 b¹，也就是以 a¹ 當 query。**

- 內積分數：a¹·a¹ = 1，a¹·a² = 0，a¹·a³ = 1
- softmax(1, 0, 1)：e¹ ≈ 2.718，e⁰ = 1，總和 ≈ 6.437，權重 ≈ 0.4223、0.1554、0.4223
- b¹ = 0.4223 × (1, 0) + 0.1554 × (0, 1) + 0.4223 × (1, 1) ≈ (0.845, 0.578)

同樣的算法得到 b² ≈ (0.578, 0.845)，b³ ≈ (0.788, 0.788)。

讀這個結果：a¹ 和 a² 的內積是 0，所以 a¹ 看 a² 看得最少，只分到 0.155；它和自己、和 a³ 的內積一樣大，所以各分到 0.422。輸出 b¹ 是三個向量的加權混合，已經帶有其他位置的資訊。

**換個順序再算一次。** 把輸入排成 a¹、a³、a²。以 a¹ 當 query 的三個分數變成 1、1、0，權重是 0.4223、0.4223、0.1554，對到的向量也跟著換了位置，加總起來仍然是 (0.845, 0.578)。每個詞得到的輸出和它排在第幾個無關。這就是後面要補 positional encoding 的原因。

### Multi-head：同時看不同面向

第 28–34 頁用「I kicked the ball」解釋為什麼需要多個 head。對 kicked 來說，convolution 會對左右不同相對位置學不同的線性轉換；單一 self-attention 只學到一個「相關程度」的加權平均。老師在影片裡的說法是：單一 attention 只知道「你跟我相關程度高或低」，不知道是哪一種相關。

Multi-head 讓不同 head 各自負責一種關係。投影片畫了三個 head：who 連到 I、did what 連到 kicked 自己、to whom 連到 ball。實作上就是每個 head 有自己的 W^{q,h}、W^{k,h}、W^{v,h}，各自算出 b^{i,h}，接起來再乘一個 W^O（第 35–37 頁，以 2 個 head 為例）。第 41 頁的描述是：把 V、K、Q 投影到較低維的空間、分別做 attention、把結果串接，再做一次線性轉換。

### Scaled dot-product

第 42 頁：d_k 變大時，qᵀk 的變異數也跟著變大。講義寫 q、k 是平均 0、變異數 1 的隨機變數；把它讀成每一維各自獨立（本文的解讀），qᵀk 的變異數就是 d_k。所以把內積除以 √d_k，讓變異數回到 1。

為什麼變異數大是個問題，可以用數字看（本文自編）。三個分數是 (8, 0, 0) 時，softmax 的結果是 (0.9993, 0.0003, 0.0003)，幾乎是 one-hot，其他位置等於沒被看到。如果 d_k = 64，除以 √64 = 8 之後分數變成 (1, 0, 0)，softmax 是 (0.576, 0.212, 0.212)，三個位置都還有份。

### Encoder 與 decoder

架構圖引自 [Vaswani et al. 2017](https://arxiv.org/abs/1706.03762)（Attention Is All You Need）：第 24 頁是示意圖，論文原圖在第 39–40 頁。原始 Transformer 是做機器翻譯的非遞迴 encoder-decoder。依講義第 44 頁，每個 encoder block 有兩個部分：

- multi-head attention；
- 兩層、用 ReLU 的前饋網路。

兩部分外面都包了 residual connection 與 LayerNorm，寫成 `LayerNorm(x + sublayer(x))`。

Decoder 端多了兩件事（第 26、40 頁與影片）：

- **Masked self-attention**：產生第二個字時只能 attend 已經產生的字。老師的解釋是訓練時後面的字還沒生出來，模型不該學會去看它們。
- **Encoder-decoder attention**：query 來自 decoder，key 與 value 來自 encoder 的輸出，就是第一步那種翻譯 attention。

影片接近結尾時把三種 attention 整理成一句話：encoder self-attention 的 Q、K、V 都來自輸入；decoder self-attention 都來自輸出，但只能往前看；encoder-decoder attention 的 Q 來自輸出，K、V 來自輸入。

### Positional encoding：把順序補回來

第 45 頁點出拿掉 RNN 的代價：時間資訊不見了。老師在影片裡的說法是，self-attention 裡每個詞都跟所有詞算一次，輸入順序是 1-2-3 還是 3-2-1，結果都一樣。

第 46–50 頁先列出四個條件，再逐一淘汰三種直覺做法：

| 做法 | 問題 |
|---|---|
| 直接放位置編號 1、2、3… | 值會越來越大，訓練時沒看過的長度無法泛化 |
| one-hot，d 維向量表示 d 個位置 | 只能表示長度 ≤ d 的序列 |
| 正規化到 0～1 | 不同長度的句子裡，相鄰兩個位置的距離不一樣 |

四個條件是：每個位置的編碼唯一、固定可重現、相鄰位置的距離一致、能泛化到更長的句子。

Sinusoidal 版本四個都滿足。它用不同頻率的 sin 與 cos 組成一個 d 維向量：

```
PE(pos, 2i)   = sin(pos / 10000^(2i/d))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d))
```

投影片第 50 頁的分母印成 100000，原論文寫的是 10000。

代入數字來看（本文自編），取 d = 4：

| 位置 | (sin(pos/1), cos(pos/1), sin(pos/100), cos(pos/100)) |
|---|---|
| 0 | (0, 1, 0, 1) |
| 1 | (0.841, 0.540, 0.010, 1.000) |
| 2 | (0.909, −0.416, 0.020, 1.000) |

前兩維變得快，相鄰位置一眼就分得出來；後兩維變得慢，要隔很遠才有差別。每個位置的向量都由公式算出，不必訓練，也不受句子長度限制。

第 52 頁畫出不同位置編碼的內積，顯示相鄰位置之間的關係是對稱的，也隨距離遞減。老師補充：位置向量通常直接加到詞向量上，也有人用串接；現在的 LLM 用的好像也不是這個版本了。

### 訓練技巧與結果

第 55 頁列出原始 Transformer 的訓練技巧：BPE、checkpoint averaging、搭配 learning rate 變化的 Adam、在每層加 residual 之前做 dropout、label smoothing、beam search 加 length penalty 的自迴歸解碼。老師提到 Transformer 剛提出時很難訓練，現在套件大多已經把這些細節包好了。

第 56–57 頁是原論文的翻譯與句法剖析實驗。老師在影片裡的解讀是：翻譯品質跟當時最好的系統差不多，訓練成本比較低，因為容易平行化。

第 55 頁的第一項 BPE 正是[下一篇](/posts/ai/2026-09-30-ntu-adl2025-bert-family)的主題。

## 常見的誤解

這幾條是我依課堂內容整理的。

- **「Attention 是 Transformer 發明的。」** 它原本是加在 RNN 翻譯模型上的做法。Transformer 做的是讓輸入自己對自己做 attention，並拿掉 RNN。
- **「key 和 value 一定是同一個向量。」** 在最早的翻譯例子裡剛好一樣。老師特別說明兩者可以不同，self-attention 裡就各有一個矩陣。
- **「Self-attention 天生知道詞的順序。」** 上面的手算顯示，調換輸入順序，每個詞的輸出不變。順序要靠 positional encoding 補。
- **「Multi-head 是把同一件事重複做幾次。」** 單一 attention 只學到「相關程度高或低」一個數字。每個 head 有自己的一組矩陣，目的是分開看不同種類的關係。老師也說，怎麼確保各個 head 真的學到不同的東西，這裡沒有多做著墨，只能期待模型自己學到。
- **「Decoder 遮住後面的字，是因為後面的字不重要。」** 遮住是因為生成時後面的字還不存在，訓練時不該讓模型學會去看它們。

## 自我檢查

題目是本文自擬的。

**1. 翻譯「深度學習」時，解碼器要產生 learning，attention 權重是 (0, 0, 0.5, 0.5)。這一步用來解碼的向量是什麼？**

c = 0.5·h₃ + 0.5·h₄，也就是「學」「習」兩個位置的編碼器輸出各取一半。

**2. 沿用上面手算的三個向量，以 a³ = (1, 1) 當 query，三個內積分數各是多少？哪一個位置的權重最大？**

a³·a¹ = 1，a³·a² = 1，a³·a³ = 2。a³ 自己的權重最大，softmax(1, 1, 2) ≈ (0.212, 0.212, 0.576)。

**3. Transformer 裡三種 attention 的 query、key、value 各來自哪裡？**

Encoder 的 self-attention：三者都來自輸入。Decoder 的 self-attention：三者都來自輸出端已經產生的部分，而且只能看前面的位置。Encoder-decoder attention：query 來自 decoder，key 和 value 來自 encoder 的輸出。

**4. 「狗 咬 人」和「人 咬 狗」用的是同樣三個詞。如果完全不加位置資訊，self-attention 對這兩句的「咬」會算出不同的輸出嗎？**

不會。三個詞的向量一樣，「咬」當 query 時得到的三個分數也一樣，加權和就相同。模型分不出誰咬誰，所以要另外加上 positional encoding。

**5. 一個模型只在長度 256 以內的句子上訓練。位置用「直接放編號 1、2、3…」表示，遇到長度 512 的輸入會怎樣？sinusoidal 的做法為什麼沒有這個問題？**

257 之後的編號訓練時沒出現過，模型不知道怎麼處理。sinusoidal 的每一維是循環的波，任何位置代進公式都算得出一個範圍固定的向量。

**6. d_k 從 16 變成 256，不做縮放的話，內積分數的標準差大約變成幾倍？**

依講義第 42 頁的假設，變異數等於 d_k，標準差是 √d_k，從 4 變成 16，是 4 倍。分數變大，softmax 的結果更接近 one-hot，所以要除以 √d_k。

**7. 動手題：用 NumPy 隨機產生兩個 4×d 的矩陣，一個當 Q、一個當 K（每個元素平均 0、變異數 1，兩個矩陣互相獨立），算 softmax(QKᵀ)。先不除 √d，把 d 從 8 調到 512。預期看到什麼？**

d 越大，每一列最大的權重越接近 1。加上除以 √d 之後，權重的分布不再隨 d 明顯改變。注意 Q 和 K 要各自獨立產生，這才符合講義「q、k 是平均 0、變異數 1 的隨機變數」的假設，以及本文把它讀成各維獨立的解讀。如果像上面手算那樣讓 q = k，一個向量和自己的內積大約是 d，除以 √d 之後還有 √d，一樣會隨 d 變大。

## 延伸閱讀

- 同一段內容在 Stanford 的講法：[CS224N 第 5 堂：從 recurrence 到 Transformer](/posts/ai/2026-08-22-cs224n-transformers)、[CME295 第 1 堂：從切字到 Transformer](/posts/ai/2026-09-29-cme295-transformer)
- 講義引用的逐行實作：[The Annotated Transformer（Sasha Rush）](http://nlp.seas.harvard.edu/2018/04/03/attention.html)

## 課程影片來源

以下影片已於 2026-10-10 對照官方課程頁與官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=FLNSD3zykgE
title: ADL 4.1: Attention Mechanism 注意力機制
```

```youtube
url: https://www.youtube.com/watch?v=c0O9s6MCFys
title: ADL 4.2: Self-Attention & Transformer 自注意力機制之模型
```

原始影片：[ADL 4.1: Attention Mechanism 注意力機制](https://www.youtube.com/watch?v=FLNSD3zykgE)、[ADL 4.2: Self-Attention & Transformer 自注意力機制之模型](https://www.youtube.com/watch?v=c0O9s6MCFys)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：4.1 與 4.2 兩支都對過字幕，文中歸給影片的說法都找得到。投影片頁碼、公式與 CoQA／QuAC 等細節來自講義。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方課程頁、播放清單的講次相符。
- 2026-10-10：依字幕核對影片內容。字幕與文章對影片的說法相符，無需更正。
- 2026-10-13：查證歷程移出正文；系列內互相引用由篇序改為堂次。
- 2026-10-13：補上學習目標、self-attention 的手算例子、縮放與位置編碼的數字例子、常見誤解與附答案的自我檢查。

## 參考資料

- [ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 9/08 課表列
- [Attention Mechanism 投影片（2025/09/08）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Attention.pdf)
- [Transformer 投影片（2025/09/08）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Transformer.pdf)
- [ADL 4.1: Attention Mechanism 注意力機制](https://youtu.be/FLNSD3zykgE)（23:41）
- [ADL 4.2: Self-Attention & Transformer 自注意力機制之模型](https://youtu.be/c0O9s6MCFys)（25:01）
- [2025 Fall ADL 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Vaswani et al., Attention Is All You Need（NIPS 2017）](https://arxiv.org/abs/1706.03762) — 架構圖、scaled dot-product、sinusoidal PE 公式（分母 10000）出處
- [Chan et al., Listen, Attend and Spell（2015）](https://arxiv.org/abs/1508.01211) — 講義第 14 頁語音辨識例子
- [The Annotated Transformer](http://nlp.seas.harvard.edu/2018/04/03/attention.html) — 講義第 39 頁推薦的 PyTorch 逐行解說

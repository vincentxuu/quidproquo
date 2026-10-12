---
title: "大型語言模型：next-token 損失與 attention 怎麼算｜Stanford CS229 第 14 堂"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, llm, transformer, attention]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 14
tldr: "這堂課把大型語言模型拆成三層：分詞把文字變成 token 編號，鏈式法則把整段文字的機率拆成一連串「下一個 token」的條件機率，訓練就是把每個位置的交叉熵加起來。後半堂打開 Transformer：query 與 key 的內積過 softmax 得到權重，對 value 做加權平均，再用 causal mask 擋住未來位置；單層 attention 的計算量隨序列長度 T 的平方成長。"
description: "Stanford CS229（Spring 2026）第 14 堂導讀：分詞、autoregressive 分解、next-token 交叉熵、temperature 與 top-k 取樣、single-head 與 multi-head attention、causal mask，以及 attention 的 T² 計算量，附可手算的數值例子。"
draft: false
math: true
---

> 🌏 [English version](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention-en)

**影片狀態：已附影片。** 這篇依 Stanford Online 公開的 Spring 2026 第 14 堂錄影的英文字幕寫成，公式記號對照 2026 主講義第 17 章（Large language models）前半；沒看到板書畫面，板書上的式子是靠字幕口述與講義還原的。

這是 [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)裡大型語言模型單元的第一堂，接在[第 13 堂](/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search)之後。講者 Tengyu Ma 開場說，接下來三、四堂都在講大型語言模型，中間會穿插一點強化學習，因為不懂強化學習就沒辦法談現在的推理模型。

先備只要三樣：softmax 與交叉熵（多類別分類那幾堂）、最大概似估計、矩陣乘法。讀完之後，你應該能自己寫出語言模型的損失函數，手算一列 attention 的輸出，並說明為什麼序列長度加倍，attention 的計算量會變成四倍。

有一件事先講：YouTube 標題寫「Transformers, In-Context Learning」，但這支錄影沒有講到 in-context learning。78 分鐘用在分詞、autoregressive 建模、訓練損失，以及 attention 的定義，最後幾分鐘帶過殘差、正規化與計算量。

```youtube
url: https://www.youtube.com/watch?v=pwQ0l4hFCVI
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 14: Transformers, In-Context Learning
captions: en
```

## 分詞：模型讀到的最小單位是什麼

（錄影 01:30–10:20）

Transformer 是吃數字的模型，文字得先切成小單位再編號。第一個決定是「最小單位」取多大，課堂比較了三種：

- **字元**：詞彙表很小，但一句話要切成很多步，序列太長。
- **整個詞**：序列短，但罕見的長詞各自獨立。講者舉的例子是 internationalization：如果它是一個單位，就跟 internationalized、nation 毫無關係，模型在其中一個詞上學到的東西幫不到另一個。
- **subword（子詞）**：介於兩者之間，也是現在的做法。

講者用講義裡一個 2020 年以前大概沒人用過的詞 LLMification 說明子詞的好處。把它當成一個單位，模型得看過這個詞夠多次才懂；切成 LLM 與 ification 兩塊，這兩塊模型都看過很多次，合起來就能懂。生醫名詞與德文的長詞也是同樣的情況。

所以分詞就是：有一份事先定好的詞彙表（vocabulary），裡面是一堆子詞，每個子詞有一個編號。一段文字切完之後變成一串編號。講義的例子是 `A dog runs.` 大致切成 `A`、`dog`、`runs`、`.` 四個 token；課堂上講者隨手給了 1、356、250 這樣的編號，並說這些數字是亂寫的。比較少見的 unhappiness 可能被切成 `un`、`h`、`appiness`，glioblastoma 可能切成 `glio`、`blast`、`oma`；這兩個切法講者與講義都只說是「大概像這樣」，實際結果要看各個 tokenizer。

幾個課堂上提到的事實：

- 詞彙表大小通常在 $10^5$ 的量級。講義舉的例子是 Qwen3.5，詞彙表有 248,320 個 token。講者在 05:50 左右口頭說成「250 tokens」，是少說了一個千；他稍後（10:22）講的就是 250,000。
- 做這件事的演算法叫 tokenizer，每個模型通常有自己的一套，不同公司的做法不同。同一段文字被切成多少個 token，會直接影響費用：切得越細，同樣的文字要付的 token 數越多。
- 詞彙表怎麼來，關鍵字是 **BPE（Byte-Pair Encoding）**。講者只說它是一個貪婪演算法，挑出常見的片段放進詞彙表，沒有講細節。講義的說法比較精確：從位元組或字元這種很小的片段出發，反覆把語料裡最常相鄰出現的一對片段合併成新的 token；合併夠多次之後，常見的字尾甚至整個常用詞都會變成單一 token，罕見詞仍然能用小片段拼出來。

從這裡開始，「一段文字」就是一串 token：

$$
x = (x_1, x_2, \ldots, x_T), \qquad x_t \in V
$$

$V$ 是詞彙表，每個 $x_t$ 是詞彙表裡的一個編號。

## 把整段文字的機率拆成「下一個 token」

（錄影 10:20–13:30）

語言模型要描述的是這串 token 的機率分布 $p(x_1, \ldots, x_T)$。先數一下這個分布有多少種可能的結果：每個位置有 $\lvert V\rvert$ 種選擇，長度是 $T$，所以總共 $\lvert V\rvert^T$ 種。

這個數字大到什麼程度，可以自己算一個（以下是本文自擬的數字，不是課堂內容）：$\lvert V\rvert = 250{,}000$、$T = 10$，

$$
250{,}000^{10} = (2.5\times 10^5)^{10} = 2.5^{10}\times 10^{50} \approx 9.5\times 10^{53}
$$

才十個 token 就有 $10^{53}$ 種句子。把它當成一個普通的類別分布、每種句子給一個機率參數，是存不下來的。

解法是條件機率的鏈式法則。它對任何聯合分布都成立，沒有做任何假設：

$$
p(x_1,\ldots,x_T) = p(x_1)\,p(x_2\mid x_1)\,p(x_3\mid x_1,x_2)\cdots p(x_T\mid x_1,\ldots,x_{T-1})
$$

好處在右邊每一項。$p(x_t\mid x_1,\ldots,x_{t-1})$ 是「給定前文，下一個 token 是誰」的分布，它的可能結果只有 $\lvert V\rvert$ 種。於是問題從「描述 $\lvert V\rvert^T$ 個數」變成「給定前文，輸出一個 $\lvert V\rvert$ 維的機率向量」，後者正好是多類別分類的形狀：輸出 $\lvert V\rvert$ 個 logit，過一次 softmax。

困難沒有消失，只是搬了位置：條件裡的前文長度會變，而且可以很長。這就是後半堂 Transformer 要處理的事。

autoregressive（自迴歸）指的就是這個結構：token 一個一個產生，每個新 token 依賴它前面的所有 token。講者在開場說，這一波大型語言模型大致是從 OpenAI 發表 GPT-3、採用 autoregressive 這個範式開始的，這堂課只講 autoregressive 的版本，跳過更早期非 autoregressive 的 Transformer。

## 把 Transformer 當黑盒子：embedding 進去，logits 出來

（錄影 13:30–25:50）

先不管 Transformer 內部，只看輸入輸出。

**輸入端。** token 編號是離散的，要先換成向量。每個 token 對應一個 $d$ 維的 embedding，全部疊起來是一個矩陣：

$$
E = \begin{pmatrix} e_1 \\ e_2 \\ \vdots \\ e_{\lvert V\rvert} \end{pmatrix} \in \mathbb{R}^{\lvert V\rvert \times d}
$$

第 5 個 token 的 embedding 就是 $E$ 的第 5 列，查表即可。這些數字一開始未知，跟其他參數一起訓練出來。有學生問 embedding 會不會跟後面的 token 有關，講者的回答是不會：embedding 只由 token 本身決定，第 10 個 token 就讀第 10 列，沒有別的依賴。

這裡有一個貫穿整章的記號約定：**所有向量都是列向量（row vector，橫的）**，矩陣一律乘在右邊。理由是程式碼裡向量就是這樣存的。講者自己也覺得彆扭：

> "It looks a bit weird to me actually from a mathematical perspective."（15:30）

講者也提醒很多論文用的是行向量（直的）。本文補充一句：那種寫法矩陣乘在左邊，同一條式子看起來會是這裡的轉置，例如這裡的 $hW$ 在論文裡會寫成 $W^\top h^\top$ 的樣子，對照時把列與行對調即可。

**開頭的特殊 token。** 常見做法是在序列最前面放一個固定的 beginning-of-sentence token，記成 $x_0$。講者說這不是一定要做，有些模型不放。講者說詞彙表通常會預留一千到幾千個位置給這類特殊用途的 token。

**輸出端。** 把 $(e_{x_0}, e_{x_1}, \ldots)$ 送進 Transformer，每個位置吐出一個 $\lvert V\rvert$ 維的向量，叫 logits。第 $t$ 個輸出寫成

$$
u_t = f_\theta(x_0, x_1, \ldots, x_{t-1}) \in \mathbb{R}^{\lvert V\rvert}
$$

$u_t$ 和 $f_\theta(\cdots)$ 是同一個東西的兩種寫法，課堂上有學生問這件事，講者解釋前者是給向量一個名字，後者是把「它是哪些輸入的函數」寫明。寫明的重點在於：$u_t$ 只能依賴 $x_0$ 到 $x_{t-1}$，不能依賴後面的 token。這個性質黑盒子階段先當成要求，等後面講到 mask 才知道它怎麼被保證。

對 logits 做 softmax，就得到下一個 token 的條件分布：

$$
p_\theta(x_t = j \mid x_1,\ldots,x_{t-1}) = \mathrm{softmax}(u_t)_j = \frac{\exp(u_{t,j})}{\sum_{k=1}^{\lvert V\rvert}\exp(u_{t,k})}
$$

softmax 輸出的 $\lvert V\rvert$ 個數都非負、總和為 1。第 $j$ 個數就是「在這個模型下，前文之後接第 $j$ 個 token」的機率。特別地，$p_\theta(x_1) = \mathrm{softmax}(f_\theta(x_0))$：第一個 token 沒有前文，只看那個固定的開頭 token。

到這裡機率模型就完整了。給任何一串 token，都可以把每一項條件機率算出來再相乘，得到整串的機率。

## 生成：一個一個取樣，再餵回去

（錄影 25:50–35:55）

假設模型已經訓練好，怎麼產生文字？照著分解式的順序做：

1. 從 $\mathrm{softmax}(f_\theta(x_0))$ 取樣出 $x_1$。
2. 把 $x_1$ 接回輸入，從 $\mathrm{softmax}(f_\theta(x_0, x_1))$ 取樣出 $x_2$。
3. 一直重複。

每個產生出來的 token 都被當成下一步的輸入，這是「autoregressive」這個名字在生成時的意思。講者特別對比了兩種情況：算概似時整串文字已經在手上，只是問模型「看到這串的機率是多少」；生成時手上什麼都沒有，得自己一步步長出來。

生成不一定從空白開始。如果先給了 $x_1,\ldots,x_k$（一個問題或一段指示，也就是 prompt），模型就從 $x_{k+1}$ 開始接：先從 $\mathrm{softmax}(f_\theta(x_0,\ldots,x_k))$ 取樣，再往下。

### temperature：課堂上的數值例子

生成時可以不完全照模型的分布取樣。最常見的調整是把 logits 除以一個溫度 $\tau$ 再做 softmax：

$$
x_{t+1} \sim \mathrm{softmax}\big(f_\theta(x_0,\ldots,x_t)/\tau\big)
$$

除以正數不會改變大小順序，大的還是大。變的是差距。課堂上用三維的 logits $(2, 1, -1)$ 當例子，以下把講者口頭帶過的數字算完。

**原本的分布（$\tau = 1$）。**

$$
e^{2} \approx 7.389,\quad e^{1} \approx 2.718,\quad e^{-1} \approx 0.368,\quad \text{總和} \approx 10.475
$$

$$
\mathrm{softmax}(2,1,-1) \approx (0.705,\ 0.259,\ 0.035)
$$

講者在課堂上沒有拿計算機，憑感覺說第一個「大概 0.7」、第二個「大概 0.3」，實際算出來是 0.705 與 0.259。第一個 token 最可能，但另外兩個合起來還有將近三成的機會被抽到。

**很小的溫度。** 講者把 logits 放大成 $(200, 100, -100)$，相當於 $\tau = 0.01$。第二個 token 的機率是

$$
\frac{e^{100}}{e^{200}+e^{100}+e^{-100}} \approx \frac{e^{100}}{e^{200}} = e^{-100} \approx 3.7\times 10^{-44}
$$

分母裡 $e^{100}$ 與 $e^{-100}$ 跟 $e^{200}$ 相比小到可以忽略，所以分布幾乎就是 $(1, 0, 0)$。

**這代表什麼。** 溫度越小，分布越尖，取樣越接近「每次都拿機率最大的那個」。講者說 API 裡可以選 temperature；設成 0 的意思是每一步都取最可能的 token，生成結果是確定的（講義把它寫成 $\tau \to 0$ 的極限，稱為 greedy decoding）。溫度大於 1 則把分布壓平，長尾的 token 更容易被抽到，適合想要多樣性的場合，講者提到強化學習裡有時必須這樣做。

### top-k

另一種調整是只留機率最高的 $k$ 個 token，其餘丟掉，剩下的重新正規化到總和為 1 再取樣。詞彙表有二十幾萬維，尾巴上那些極不可能的 token 就不會被抽到。課堂只講了 top-k；講義還有 top-p（nucleus sampling），做法是把 token 依機率由高到低排，留下累積機率達到 $p$ 以上的最小一組，再重新正規化。

## 訓練：把每個位置的交叉熵加起來

（錄影 35:55–38:50）

訓練用最大概似估計：給一串資料 $(x_1,\ldots,x_T)$，讓模型給它的機率越大越好，等價於讓負對數概似越小越好。推導只有三步。

第一步，代入鏈式法則的分解：

$$
-\log p_\theta(x_1,\ldots,x_T) = -\log \prod_{t=1}^{T} p_\theta(x_t\mid x_1,\ldots,x_{t-1})
$$

第二步，log 把乘積變成加總：

$$
= -\sum_{t=1}^{T} \log p_\theta(x_t\mid x_1,\ldots,x_{t-1})
$$

第三步，把條件機率換成 softmax 的某一個分量：

$$
= -\sum_{t=1}^{T} \log\, \mathrm{softmax}\big(f_\theta(x_0,\ldots,x_{t-1})\big)_{x_t}
$$

下標 $x_t$ 的意思是：softmax 給出所有 token 的機率，我們只取資料裡實際出現的那個 token 的機率。每一項是一個純量，正是 logits $u_t$ 與正確答案 $x_t$ 之間的交叉熵。所以語言模型的訓練，就是在每個位置做一次 $\lvert V\rvert$ 類的分類，答案是下一個 token。

課堂上有學生以為只在最後一個位置算損失，講者更正：加總是從 $t=1$ 到 $T$，每個位置都算。換個角度看（這句是本文的補充）：一串長度 $T$ 的文字做一次前向計算，就同時得到 $T$ 個訓練訊號，不必像生成那樣一步一步來。

講義的寫法多除了一個 $T$，取每個 token 的平均；課堂上沒有除。兩者只差常數，最小值的位置一樣。最佳化直接把這個損失交給 SGD 或 Adam，講者說 Adam 這門課沒教，當成黑盒子用即可；講義寫的是 AdamW。

### 數值例子：兩個 token 的損失

以下是本文自擬的例子，不是課堂內容。詞彙表只有 3 個 token，資料是 $(x_1, x_2) = (1, 2)$。假設模型在兩個位置輸出的 logits 是

$$
u_1 = (2, 1, -1), \qquad u_2 = (0, 1, 1)
$$

- 位置 1：$\mathrm{softmax}(u_1) \approx (0.705, 0.259, 0.035)$，正確答案是第 1 個 token，損失 $-\log 0.705 \approx 0.349$。
- 位置 2：$e^0 = 1$、$e^1 \approx 2.718$，總和 $\approx 6.437$，$\mathrm{softmax}(u_2) \approx (0.155, 0.422, 0.422)$，正確答案是第 2 個 token，損失 $-\log 0.422 \approx 0.862$。

整串的負對數概似是 $0.349 + 0.862 = 1.211$，平均每個 token $0.606$。對照組：如果模型什麼都沒學到，每個 token 給 $1/3$，每個位置的損失是 $\log 3 \approx 1.099$。$0.606$ 比 $1.099$ 低，表示這個模型比亂猜好；位置 2 的損失比位置 1 高，因為模型在那裡把機率平分給了兩個候選。

## 打開黑盒子：attention 與 MLP 交替

（錄影 38:50–43:00）

Transformer 的大結構是兩種層交替堆疊。輸入是 embedding 序列，先過一層 **attention**，再過 **MLP**，再 attention、再 MLP，重複很多次，最後輸出 $u_1,\ldots,u_T$。

有一個維度上的細節課堂與講義都沒有寫出來（本文補充）：中間每一層進出的向量都是 $d$ 維，而 logits 是 $\lvert V\rvert$ 維，所以最後一層之後還要再乘一個 $d\times\lvert V\rvert$ 的矩陣，把每個位置的 $d$ 維向量換成 $\lvert V\rvert$ 個 logit。這一步只是一次矩陣乘法，不影響下面對 attention 的討論。

兩種層的分工很清楚：

- **MLP**：兩三層的小型神經網路。每個位置各自過同一個 MLP，參數共用，位置之間完全不互相看，所以可以平行計算。
- **attention**：輸入一串向量，輸出一串向量。它是整個模型裡唯一讓不同位置的資訊混在一起的地方。

有學生問這整個東西是不是當成一個系統訓練。講者回答是：架構定好之後，整個當成一個巨大的神經網路，用自動微分從頭到尾一起訓練。先前講反向傳播時的結論仍然適用，只要前向計算是由基本運算組合而成，反向就能自動算出來，而 attention 與 MLP 都只是很多次矩陣乘法。

## Single-head attention：query、key、value

（錄影 43:00–52:55）

先記住型別：輸入一串向量 $h^{\text{in}}_1,\ldots,h^{\text{in}}_T$，輸出一串向量 $h^{\text{out}}_1,\ldots,h^{\text{out}}_T$。每個 $h^{\text{in}}_t \in \mathbb{R}^{1\times d}$。

**第一步：每個位置算出三個向量。** 有三個要訓練的矩陣 $W^Q, W^K, W^V \in \mathbb{R}^{d\times d_h}$，$d_h$ 是自己選的維度。因為用列向量，矩陣乘在右邊：

$$
q_t = h^{\text{in}}_t W^Q, \qquad k_t = h^{\text{in}}_t W^K, \qquad v_t = h^{\text{in}}_t W^V
$$

三者都在 $\mathbb{R}^{1\times d_h}$，分別叫 query、key、value。

**第二步：位置 $t$ 的 query 跟每個位置的 key 做內積。**

$$
q_t k_1^\top,\ q_t k_2^\top,\ \ldots,\ q_t k_T^\top
$$

$q_t$ 是橫的，$k_j^\top$ 是直的，相乘得到一個純量，所以這是 $T$ 個實數。實務上每個內積還會除以一個縮放常數 $c$，講者說現階段可以先不管它。

**第三步：對這 $T$ 個數做 softmax。**

$$
(p_{t,1},\ldots,p_{t,T}) = \mathrm{softmax}\big(q_t k_1^\top/c,\ \ldots,\ q_t k_T^\top/c\big)
$$

結果是 $T$ 個位置上的一個機率向量：每個 $p_{t,j}\ge 0$，$\sum_j p_{t,j} = 1$。某個 $p_{t,j}$ 大，表示 $q_t$ 與 $k_j$ 的內積相對其他位置高，位置 $t$ 應該多「注意」位置 $j$。

**第四步：用這組權重對 value 做加權平均。**

$$
h^{\text{out}}_t = \sum_{j=1}^{T} p_{t,j}\, v_j
$$

權重大的位置，它的 value 在輸出裡占的比重就大。

三個向量的角色可以這樣記（這是講義的說法）：query 是「我在找什麼資訊」，key 是「我這裡有什麼資訊」，value 是配對成功時實際傳出去的內容。講者在課堂上的直覺比較保守，他先承認：

> "Nobody really knows exactly how it works."（45:40）

接著才說粗略的想法：位置之間必須有互動，否則每個時間點各算各的；而互動的形式是處理某個位置時，找出哪些位置有相關資訊，多看它們一點。

有學生問 key 是怎麼決定的。回答是由訓練決定：$W^Q$、$W^K$、$W^V$ 都是參數，誰該注意誰是學出來的。

> "So you only give a template in some sense."（52:06）

架構只給出一個樣板。權重全是 0 的話它仍然是合法的神經網路，只是損失很差，訓練演算法會把 $W$ 調到讓這個機制做對的事。

**縮放常數 $c$ 為什麼是 $\sqrt{d_h}$**（這段課堂沒講，出自講義）。假設初始化時 $q$ 與 $k$ 的每個分量彼此獨立、平均 0、變異數 1。內積 $q\cdot k = \sum_{i=1}^{d_h} q_i k_i$ 裡每一項的平均是 0、變異數是 $\mathbb{E}[q_i^2]\,\mathbb{E}[k_i^2] = 1$，$d_h$ 項獨立相加，變異數就是 $d_h$，標準差 $\sqrt{d_h}$。不縮放的話，$d_h$ 越大 logits 的尺度越大，softmax 會像前面低溫的例子那樣變得極尖，梯度很小。除以 $\sqrt{d_h}$ 讓 logits 的變異數回到 1 左右。講義自己註明這只是啟發式的說法，因為實際的 query 與 key 並不獨立。講者在[第 16 堂](/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning)的課堂上會回頭補這個 $c$ 的來由，這裡先知道它是為了不讓 softmax 太尖就夠了。

## 為什麼不乾脆用一個大 MLP

（錄影 52:55–57:40）

有學生問：為什麼需要這種結構，MLP 自己做不到嗎？講者把問題拆成兩個版本回答。

**版本一：只留逐位置的 MLP，拿掉 attention。** 那位置之間完全沒有互動，等於把一句話拆成單獨的詞分開處理，不可能理解句子。

**版本二：把所有位置的向量接成一條長向量，餵給一個巨大的 MLP。** 這樣有互動，但有兩個問題：

1. 參數太多。序列長度有時到百萬，MLP 裡會出現百萬乘百萬的矩陣。
2. 參數量跟著序列長度變。用長度 1,000 訓練、用長度 1,001 測試，模型的形狀就不一樣了。

attention 沒有這兩個問題。回頭看定義，參數只有 $W^Q$、$W^K$、$W^V$，大小是 $d\times d_h$，跟 $T$ 無關；$T$ 只影響「有幾個 query 跟幾個 key 做內積」。

另一位學生把這個想法整理成：我們知道夠大的 MLP 理論上做得到，只是算不起，所以加一點結構讓它有效率。講者同意，並補了另一端的極端：如果規定「直接取平均」，那一個參數都沒有，規定得太死也不行。

> "So it's like you strike a balance between how much structure you introduce and how much flexibility you give the models to figure out."（56:12）

講者也提到歷史上有別的處理序列的方法，例如用卷積網路，每次只看一個固定大小的視窗。他說這個做法不算糟，仍有論文在做，只是效果不如 attention。

## 矩陣寫法與 causal mask

（錄影 57:40–1:05:40）

### 把四個步驟寫成一行

逐位置的寫法記號很亂，習慣上把所有 query 疊成矩陣 $Q\in\mathbb{R}^{T\times d_h}$（第 $t$ 列是 $q_t$），key 與 value 同樣疊成 $K$、$V$。那麼

$$
H^{\text{out}} = \mathrm{softmax}_{\text{row}}\!\big(QK^\top/c\big)\,V
$$

對照回去：$QK^\top$ 是 $T\times T$ 的矩陣，第 $(t,j)$ 格是 $q_t k_j^\top$，也就是第二步的所有內積；$\mathrm{softmax}_{\text{row}}$ 對每一列各做一次 softmax，第 $t$ 列變成 $(p_{t,1},\ldots,p_{t,T})$；最後乘上 $V$，第 $t$ 列就是 $\sum_j p_{t,j} v_j$。這不是新模型，只是同一件事的寫法，好處是所有內積可以一次平行算完。

### 目前的定義違反了 autoregressive 的要求

講者在這裡說前面「偷了一步」。照上面的式子，$h^{\text{out}}_t$ 是所有 $v_1,\ldots,v_T$ 的加權和，包含 $v_T$，而 $v_T$ 是最後一個輸入的函數。也就是說位置 $t$ 的輸出看得到未來的 token，這違反了 $u_t$ 只能依賴 $x_0,\ldots,x_{t-1}$ 的要求。

為什麼這個要求不能放掉，講者的理由是生成：生成當下的 token 時，未來的 token 還不存在，所以每個位置只能依賴它之前的東西。訓練時也一樣要守，否則損失算的就不是分解式裡的那些條件機率了（後半句是本文的補充）。

### 做法：刪掉未來的項，重新正規化

概念上，對每個 $t$，把加權和裡 $j > t$ 的項全部刪掉，剩下的權重重新正規化到總和為 1，輸出仍然是 $v_1,\ldots,v_t$ 的凸組合。

實作上用一個 mask 矩陣 $M\in\mathbb{R}^{T\times T}$ 加在 softmax 之前：

$$
H^{\text{out}} = \mathrm{softmax}_{\text{row}}\!\big(QK^\top/c + M\big)\,V,\qquad
M_{t,j} = \begin{cases} 0 & j\le t \\ -\infty & j>t \end{cases}
$$

$M$ 的上三角（不含對角線）全是 $-\infty$。任何數加上 $-\infty$ 還是 $-\infty$，而 $e^{-\infty} = 0$，所以 softmax 之後那些位置的權重剛好是 0，其餘位置的權重自動正規化到總和為 1。「加 $-\infty$ 再 softmax」與「刪掉再重新正規化」是同一件事，下面的例子會驗證。

### 數值例子：三個位置的 masked attention

以下是本文自擬的例子，不是課堂內容。取 $T = 3$、$d_h = 2$、$c = 1$，並且直接給定 query、key、value（實際上它們是 $h^{\text{in}}$ 乘上三個矩陣得來的）：

$$
Q = \begin{pmatrix} 1 & 1 \\ 0 & 1 \\ 1 & 0 \end{pmatrix},\qquad
K = \begin{pmatrix} 2 & 0 \\ 0 & 1 \\ 1 & 1 \end{pmatrix},\qquad
V = \begin{pmatrix} 1 & 0 \\ 0 & 1 \\ 1 & 1 \end{pmatrix}
$$

**內積矩陣。** 第 $(t,j)$ 格是 $q_t$ 與 $k_j$ 的內積，例如第 3 列：$q_3 = (1,0)$ 對 $k_1,k_2,k_3$ 分別是 $2, 0, 1$。

$$
QK^\top = \begin{pmatrix} 2 & 1 & 2 \\ 0 & 1 & 1 \\ 2 & 0 & 1 \end{pmatrix}
\quad\xrightarrow{\ +M\ }\quad
\begin{pmatrix} 2 & -\infty & -\infty \\ 0 & 1 & -\infty \\ 2 & 0 & 1 \end{pmatrix}
$$

**逐列 softmax。**

- 第 1 列只剩一個有限值，權重是 $(1, 0, 0)$。
- 第 2 列：$e^0 = 1$、$e^1\approx 2.718$，總和 $3.718$，權重 $(0.269, 0.731, 0)$。
- 第 3 列：$e^2\approx 7.389$、$e^0 = 1$、$e^1\approx 2.718$，總和 $11.107$，權重 $(0.665, 0.090, 0.245)$。

**乘上 $V$。**

$$
\begin{aligned}
h^{\text{out}}_1 &= 1\cdot(1,0) = (1,\ 0)\\
h^{\text{out}}_2 &= 0.269\,(1,0) + 0.731\,(0,1) = (0.269,\ 0.731)\\
h^{\text{out}}_3 &= 0.665\,(1,0) + 0.090\,(0,1) + 0.245\,(1,1) = (0.910,\ 0.335)
\end{aligned}
$$

**這些結果代表什麼。** 位置 1 只能看自己，輸出就是 $v_1$。位置 3 的 query 跟 $k_1$ 最合（內積 2），所以輸出有三分之二來自 $v_1$。

再看 mask 的作用。位置 2 如果不加 mask，三個內積 $(0, 1, 1)$ 的 softmax 是 $(0.155, 0.422, 0.422)$，輸出變成 $0.155\,(1,0) + 0.422\,(0,1) + 0.422\,(1,1) = (0.578, 0.845)$，裡面混進了位置 3 的 value。照「刪掉再重新正規化」的說法，把第三項拿掉，前兩項變成 $0.155/(0.155+0.422) = 0.269$ 與 $0.422/(0.155+0.422)=0.731$，跟加 $-\infty$ 得到的權重一模一樣。

## Multi-head attention：平行跑好幾份，再合起來

（錄影 1:05:40–1:11:55）

上面定義的是 single-head attention，講義記成 $\mathrm{att1h}$。實際用的 attention 層裡有 $n_h$ 份這樣的東西平行運作，每一份叫一個 head。

- 每個 head 吃**同一組輸入** $h^{\text{in}}_1,\ldots,h^{\text{in}}_T$。
- 每個 head 有**自己的** $W^Q$、$W^K$、$W^V$。講者強調這不是字面上的複製，權重一樣的話就沒有用處。
- 每個 head 各自輸出一串向量。

要把 $n_h$ 串向量合成一串：在每個位置 $t$，把各個 head 在該位置的輸出接成一條長向量 $z_t$（長度 $n_h\cdot d_h$），再乘上一個投影矩陣 $W^O\in\mathbb{R}^{(n_h d_h)\times d}$：

$$
\mathrm{att}(h_1,\ldots,h_T)_t = z_t\, W^O
$$

輸出回到 $d$ 維，所以整層 attention 是「$T$ 個 $d$ 維向量進、$T$ 個 $d$ 維向量出」，可以一層接一層。講義補充實務上通常選 $n_h\cdot d_h = d$。

多個 head 的用意是讓同一層能同時用好幾種方式注意。講者給的直覺是：某個 head 可能在找前文裡哪個實體跟我有關，另一個 head 在看前文的情緒裡哪一部分跟我有關，最後把這些不同種類的資訊匯集成一個向量。

有學生問第二個 head 的輸入是不是第一個 head 的輸出。答案是否：同一層的 head 全部平行，匯集之後才進下一層，下一層又有一組平行的 head。至於 head 的數量，講者說大概最多一百個上下的量級，也跟模型大小有關，他自己表示不確定確切數字。

## 殘差與正規化

（錄影 1:12:00–1:13:30）

講者用兩三分鐘補充：實際的 Transformer 不是 attention 與 MLP 直接相接，中間還有正規化層（通常用先前神經網路單元提過的 RMSNorm）與殘差連接，做法跟先前講過的殘差網路一樣，把輸入加回輸出。正規化放在哪裡有 pre-norm 與 post-norm 兩種排法，細節請看講義。

講義裡 pre-norm 的一層寫成（以下出自講義，課堂沒有寫出式子）：

$$
r_t = h^{\ell}_t + \big[\mathrm{att}(\mathrm{LN}(h^{\ell}_1),\ldots,\mathrm{LN}(h^{\ell}_T))\big]_t,\qquad
h^{\ell+1}_t = r_t + \mathrm{MLP}(\mathrm{LN}(r_t))
$$

先正規化再進 attention，結果加回原本的 $h^\ell_t$；MLP 那一半同樣處理。講義說現在的大型語言模型多半用 pre-norm，並以 RMSNorm 取代 layer norm。

## 計算量與記憶體：為什麼是 T 平方

（錄影 1:13:30–1:17:15）

最後幾分鐘是為下一場談系統面的客座演講鋪路。講者說，對其他量（維度、參數量）的依賴都是線性相乘的，比較單純；重要的是對序列長度 $T$ 的依賴。

**計算量。** 每個位置的 query 要跟 $T$ 個 key 做內積，總共 $T$ 個位置，所以是 $T^2$ 個內積。每個內積是兩個 $d_h$ 維向量相乘，花 $d_h$ 次乘加。合起來每個 head 是

$$
T^2 \cdot d_h \ \text{次運算}
$$

也可以直接從矩陣看：$QK^\top$ 本身就是 $T\times T$。$T = 10^6$ 時就是 $10^{12}$ 個內積，講者稱之為 prohibitive（貴到做不了）。他把這件事連到長上下文的問題：聊天或寫程式的工具在對話拉長之後會說要壓縮上下文，原因之一就是不縮短的話計算效率太差。

他也補了一句保留：實際的產品系統未必真的是 $T^2$，可能更接近線性，因為有各種 Transformer 的變體能降低對 $T$ 的依賴；至於各家公司實際用哪一種，他說自己也不知道。

**記憶體。** 乍看要 $T^2$，因為 $QK^\top$ 這個矩陣就有 $T^2$ 格。但不必把整個矩陣算完存起來再乘 $V$：可以先算矩陣的一部分、乘上對應的 $V$，那一部分就不用留，再算下一部分。這個想法叫 **FlashAttention**。

**取捨。** 改架構去降低對 $T$ 的依賴，模型的表達能力通常會變差，可能損失一些效果。這類變體留到之後的課。

## 自我檢查

**1. logits 是 $(2, 1, -1)$，溫度 $\tau = 2$ 時的取樣分布是多少？跟 $\tau = 1$ 比，哪裡變了？**

除以 2 得 $(1, 0.5, -0.5)$。$e^{1}\approx 2.718$、$e^{0.5}\approx 1.649$、$e^{-0.5}\approx 0.607$，總和 $\approx 4.974$，分布 $\approx (0.547, 0.331, 0.122)$。順序沒變，但第一名從 0.705 降到 0.547，第三名從 0.035 升到 0.122：溫度大於 1 把分布壓平，尾巴更容易被抽到。

**2. 沿用上面的 masked attention 例子，把 $q_3$ 改成 $(0, 1)$，$h^{\text{out}}_3$ 是多少？**

內積是 $q_3 k_1^\top = 0$、$q_3 k_2^\top = 1$、$q_3 k_3^\top = 1$。位置 3 是最後一個位置，沒有東西被遮掉。softmax$(0,1,1) \approx (0.155, 0.422, 0.422)$，輸出 $0.155\,(1,0)+0.422\,(0,1)+0.422\,(1,1) = (0.578, 0.845)$。判準：權重總和為 1，且 $k_2$ 與 $k_3$ 內積相同所以權重相同。

**3. 一層 multi-head attention，$d = 512$、$n_h = 8$、$d_h = 64$。有多少參數？序列長度從 1,000 變成 2,000，參數量與內積數各變成幾倍？**

每個 head 有三個 $512\times 64$ 的矩陣，共 $3\times 32{,}768 = 98{,}304$；8 個 head 是 $786{,}432$。$W^O$ 是 $(8\times 64)\times 512 = 262{,}144$。合計 $1{,}048{,}576$（不計偏差項）。參數量跟 $T$ 無關，維持 1 倍；內積數是 $T^2$，從 $10^6$ 變成 $4\times 10^6$，4 倍。

**4. 訓練時整串文字都已經在手上，為什麼還需要 causal mask？**

判準：答案要提到損失的定義。損失的第 $t$ 項是 $-\log p_\theta(x_t\mid x_1,\ldots,x_{t-1})$，要求 $u_t$ 只由 $x_0,\ldots,x_{t-1}$ 算出。沒有 mask 的話，產生 $u_t$ 的那個位置能直接從後面的輸入讀到答案 $x_t$，訓練損失會很低，但學到的不是「由前文預測下一個 token」，生成時未來的 token 不存在，模型就用不上。

**5. 為什麼不把所有位置的 embedding 接起來丟進一個大 MLP？給兩個理由。**

參數量隨 $T$ 暴增（百萬長度會出現百萬乘百萬的矩陣）；而且參數的形狀綁死在某個 $T$ 上，換個長度就不能用。attention 的參數只有 $d\times d_h$ 大小的幾個矩陣，跟 $T$ 無關。

## 對應閱讀

主講義第 17 章 Large language models，這堂對應 17.1 到 17.3：

- **17.1 Tokenization**（pp.202–203）：分詞、BPE、詞彙表大小。
- **17.2 Autoregressive models and next-token prediction loss**（pp.203–207）：鏈式法則分解（式 17.1）、embedding 矩陣（17.2）、softmax 輸出（17.3）、生成與 temperature（17.4–17.11）、損失（17.12–17.13）。
- **17.3 Transformer architecture**（pp.207–213）：single-head attention（17.14–17.20）、mask（17.21–17.24）、multi-head（17.25）、pre-norm 與 post-norm（17.28–17.31）、計算量與記憶體。

課堂與講義不同、或課堂沒講到的地方：

- **損失有沒有除以 $T$**：講義取平均，課堂只寫加總。
- **LLMification 怎麼切**：課堂口頭切成 LLM 與 ification 兩塊；講義寫 `LL`+`M`+`ification`，並註明實際切法以學到的 tokenizer 為準。
- **縮放常數 $c=\sqrt{d_h}$ 的理由**：課堂略過，講義有變異數的說明。
- **top-p 取樣、AdamW**：只在講義。
- **KV cache**：講義 17.3 有一段講生成時把算過的 key 與 value 存起來不重算，這堂課沒有講到，第 16 堂開頭會講。
- **位置編碼**：課堂完全沒提。講義在註腳說明 self-attention 本身分不出 token 的順序，實務上一定要加位置資訊，但這一版講義還沒寫這段。讀到這裡如果覺得「attention 好像不知道誰先誰後」，你的感覺是對的，缺的就是這一塊。
- **In-context learning**：影片標題有，這堂沒講；講義在 17.6，課堂上到第 16 堂才講。

## 下一堂

講者開場說，課程剩下的部分除了大型語言模型與強化學習，還有兩場客座演講，緊接著的那一場由 Simran 講 systems ML，談怎麼在 GPU 上把 Transformer 跑得有效率。那場是第 15 堂，沒有公開錄影，Stanford Online 的播放清單在第 14 堂之後直接是第 16 堂。

所以本系列的下一篇是[第 16 堂：Attention 變體、MoE 與提示用法](/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning)。它從這堂結尾的計算量問題接下去：先講生成時的 KV cache，再講用 grouped-query attention 這類變體把成本壓下來，接著是 Mixture of Experts，最後才是影片標題裡的 in-context learning，以及 zero-shot 提示與 supervised fine-tuning。

## 課程影片來源

原始影片：[Stanford CS229 Machine Learning | Spring 2026 | Lecture 14: Transformers, In-Context Learning](https://www.youtube.com/watch?v=pwQ0l4hFCVI)

- [Stanford CS229 Machine Learning｜Spring 2026 播放清單（Stanford Online，17 支）](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 課程官網](https://cs229.stanford.edu/)
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

查核日期：2026-10-12。

內容核對：已依字幕核對（2026-10-12）：全文依這支錄影的英文字幕（約 78 分鐘）逐段對照，各節標題下的時間區段取自字幕時間戳；沒有看板書畫面，公式是由口述與主講義第 17 章對照還原，字幕中學生提問多處標為聽不清楚，只採用講者回答裡能確定的部分。

## 參考資料

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 14: Transformers, In-Context Learning（YouTube）](https://www.youtube.com/watch?v=pwQ0l4hFCVI)：本文的主要底本，課堂順序、講者說法與引句都出自這支錄影的英文字幕。
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：第 17 章 17.1–17.3（pp.202–213），用來還原板書公式與記號，並補上 BPE 的做法、$\sqrt{d_h}$ 縮放的理由、pre-norm 式子、top-p 與 KV cache 等課堂沒講的部分。
- [Stanford CS229 Machine Learning｜Spring 2026 播放清單](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)：確認公開錄影的堂次編號，第 14 堂之後是第 16 堂。
- [Stanford CS229 導讀：課程總覽](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：本系列的總覽與閱讀路線。

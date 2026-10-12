---
title: "Attention 變體、MoE 與提示用法：KV cache 太大怎麼辦｜Stanford CS229 第 16 堂"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, attention, moe, fine-tuning]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 15
tldr: "生成時每個 head 都要把過去所有位置的 key 與 value 留在 GPU 記憶體裡，這份 KV cache 會卡住 batch size。GQA 讓 τ 個 query head 共用一組 key／value，把它縮成 1/τ；sliding window 把 T² 的運算壓到 T·w；MoE 讓 128 個 expert 裡每個 token 只跑 8 個。後半堂講怎麼用訓練好的模型：few-shot、zero-shot 都不動參數，SFT 才動，而且 loss 只算在答案的 token 上。"
description: "Stanford CS229 Spring 2026 第 16 堂導讀：grouped-query attention 的分組公式、√d_h 正規化的來由、sliding window attention、QK-Norm、Mixture-of-Experts 的路由與加權，以及 in-context learning、zero-shot 提示與 supervised fine-tuning 的 loss。"
draft: false
math: true
---

> 🌏 [English version](/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning-en)

**影片狀態：已附影片。** 這篇依 Stanford Online 公開的 Spring 2026 [第 16 堂錄影](https://www.youtube.com/watch?v=hHC-SF3utxg)的英文字幕寫成，公式記號對照 2026 主講義第 17 章；沒看到板書畫面。YouTube 標題的主題文字（Basic Concept in RL, Policy Gradient）與內容不符：這支影片完全沒有講強化學習，以下依實際內容整理。

這是 [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)裡大型語言模型單元的收尾。[第 14 堂](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention)把 attention 的公式寫完，這一堂回頭問兩件事：這個架構貴在哪裡、有哪些改法；以及模型訓練好之後，怎麼拿來做你手上的任務。講者是 Tengyu Ma，他一開場就說後半堂是一串小主題，「pretty almost trivial」，但為了把名詞講清楚還是得一個一個帶過。

第 14 堂和這一堂之間隔了一場沒有公開錄影的客座講座（第 15 堂）。這一堂假設你已經會第 14 堂的這些東西：

- token、自迴歸模型與 next-token 的 loss：把序列的機率拆成一個個條件機率相乘。
- 每個位置的 hidden vector 各乘一個投影矩陣，得到 query $q_t$、key $k_t$、value $v_t$。
- single-head attention 的矩陣寫法 $\mathrm{softmax}_{\text{row}}(QK^\top/c + M)\,V$，其中 $M$ 是 causal mask，讓位置 $t$ 只能看 $1$ 到 $t$。
- multi-head 是同一個結構、不同權重的好幾份並排。

客座那一場講的是 GPU 系統面的東西，這堂只借用它的一個結論，下面第一節會把需要的部分補上。讀完這篇，你應該能算出一個模型的 KV cache 佔多少記憶體、GQA 省掉多少，能手算一次 MoE 的路由與加權，也能說清楚 few-shot、zero-shot、SFT 三者誰動了參數、loss 算在哪些 token 上。

```youtube
url: https://www.youtube.com/watch?v=hHC-SF3utxg
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 16: Basic Concept in RL, Policy Gradient
captions: en
```

## 複習：attention 的帳單與 KV cache

（錄影 00:00–07:23）

先把上一堂的圖重畫一次。時間軸上有 $T$ 個位置，每個位置有一個 query、一個 key、一個 value。因為是自迴歸模型，$q_1$ 只看 $k_1$，$q_2$ 看 $k_1, k_2$，$q_T$ 看前面全部。把「誰看誰」畫成 $T\times T$ 的矩陣，只有一半的格子有值。算出 attention 分數後乘上 value，就是這個 head 的輸出：

$$
H^{\text{out}} = \mathrm{softmax}_{\text{row}}\!\left(\frac{QK^\top}{c} + M\right)V
$$

$Q$、$K$、$V$ 的第 $t$ 列分別是 $q_t$、$k_t$、$v_t$；$M$ 在不該看的位置填 $-\infty$，softmax 之後那些位置的權重就是 0。multi-head 是把這整套複製 $n_h$ 份，各自有各自的權重，所以要多一個下標：$q_{t,j}$ 是第 $j$ 個 head 在位置 $t$ 的 query。

這個結構有兩筆帳。

**運算**：$Q K^\top$ 要算 $T\times T$ 個內積，所以至少跟 $T^2$ 成正比。

**記憶體**：生成的時候，模型一次吐一個 token。算第 $t$ 個位置的輸出，需要 $q_t$ 和前面所有的 $k_1,\dots,k_t$、$v_1,\dots,v_t$。前面那些 key 和 value 不會因為後面多了 token 而改變，所以算過就存起來，下一步直接用，這份存起來的東西就叫 **KV cache**。query 不必存：$q_{t-1}$ 對所有 key 的 attention 在上一步已經算完，之後再也用不到它。所以記憶體用量跟 $T$ 成正比，而且是每一層、每一個 head 都要各存一份 key 和 value。

課堂上接著說明這份記憶體為什麼是麻煩。GPU 記憶體有限，一條序列的 KV cache 可能就吃掉大半，你能同時放進一個 batch 的序列數因此受限，也許 10 條，也許 100 條。batch 小，GPU 就沒辦法靠「很多條序列一起算」來平行化，算力閒在那裡等記憶體。課堂上把這件事連到客座講座提過的 arithmetic intensity，以及衡量 GPU 算力實際用掉多少的利用率指標：GPU 被記憶體卡住，運算那一側在等工作。結論是：把 KV cache 縮小，值得專門改架構。

以下是本文自擬的例子，不是課堂內容，用來感受一下量級。假設模型有 32 層，每層 $n_h = 32$ 個 head，每個 head 的維度 $d_h = 128$，數字用 16 位元浮點數存（每個 2 bytes）。一個 token 在一層裡要存的 key 加 value 是 $2 \times 32 \times 128 = 8{,}192$ 個數字，32 層共 $262{,}144$ 個，也就是 $524{,}288$ bytes，約 0.52 MB。上下文長度 $T = 100{,}000$ 時，一條序列的 KV cache 是 $524{,}288 \times 100{,}000 \approx 5.24\times10^{10}$ bytes，約 52 GB，而這只是一條序列。

## Grouped-query attention：query 照舊，key 和 value 共用

（錄影 07:23–14:48，提問 17:53–25:40）

既然貴的是 key 和 value，那就少存幾組。**Grouped-query attention（GQA）** 的做法是：query 還是 $n_h$ 組，key 和 value 只留 $n_g$ 組，$n_g < n_h$。通常讓 $n_g$ 整除 $n_h$，令

$$
\tau = \frac{n_h}{n_g}
$$

每 $\tau$ 個 query head 共用同一組 key、同一組 value。課堂上畫的圖裡 $n_g = 2$；有學生問那 $\tau$ 是多少，回答是看 $n_h$：$n_h = 100$ 的話 $\tau = 50$，每 50 個 head 對到同一組 key。

寫成式子需要一個「第 $j$ 個 query head 用哪一組 key」的對應：

$$
g(j) = \left\lfloor \frac{j-1}{\tau} \right\rfloor + 1 \in \{1,\dots,n_g\}
$$

$j-1$ 是為了從 0 開始數，除以 $\tau$ 取整數就是「第幾個一捆」，最後加 1 換回從 1 開始的編號。拿 $n_h = 8$、$n_g = 2$、$\tau = 4$ 驗一下：$j=4$ 時 $\lfloor 3/4 \rfloor + 1 = 1$，$j=5$ 時 $\lfloor 4/4 \rfloor + 1 = 2$，所以 head 1 到 4 用第 1 組，head 5 到 8 用第 2 組，符合預期。

接著把每個 head 的向量疊成矩陣。$Q_j$ 的第 $t$ 列是 $q_{t,j}$（$j = 1,\dots,n_h$）；$K_s$、$V_s$ 的第 $t$ 列是 $k_{t,s}$、$v_{t,s}$（$s = 1,\dots,n_g$）。第 $j$ 個 head 的輸出是：

$$
H_j^{\text{out}} = \mathrm{softmax}_{\text{row}}\!\left(\frac{Q_j K_{g(j)}^\top}{c} + M\right)V_{g(j)}
$$

跟原本的式子比，只有 $K$ 和 $V$ 的下標從 $j$ 換成 $g(j)$。輸出還是 $n_h$ 個 head，只是其中有些共用了同一份 key 與 value。$n_g = n_h$ 就退回標準的 multi-head attention。

回到上一節的自擬例子：把 $n_g$ 設成 8（$\tau = 4$），KV cache 從約 52 GB 變成約 13 GB；設成 1 則是約 1.6 GB。query 那邊的參數與運算都沒有少。

這一段的提問把幾個容易卡住的地方都問到了。

**為什麼砍 key 和 value，不砍 query？** 因為生成時 query 只要留當下那一個，key 和 value 要留整條序列，省下來的差很多。當然也可以三者一起砍，但那就只是把 head 數調小。訓練和 prefilling（整段 prompt 一次送進去）時所有 query 都要算，這裡談的是生成階段。

**$\tau$ 怎麼選？** 除了 $n_h = \tau\, n_g$ 這條等式要成立，其他就是試出來的。極端情況是 $\tau = n_h$、$n_g = 1$，所有 head 共用一組 key 和 value，記憶體最省，這叫 multi-query attention（MQA）。課堂上說歷史順序是先有 MQA 那篇論文，後來的人覺得只留一組太激進，過去的資訊存不夠，才把 $n_g$ 加回來。講義引用的出處是 MQA：Shazeer (2019)，GQA：Ainslie et al. (2023)。課堂上介紹 GQA 時，口頭說的是它「introduced by」Qwen（字幕作 Quinn）與 DeepSeek 的模型，沒有提論文；出處以講義的引用為準。至於實際的 $n_g$ 是多少，講者說他沒背起來，要查程式碼。

**哪個 query 配哪組 key，順序重要嗎？** 不重要。key 是學出來的，你把對應關係換個排列，訓練會跟著調整。但這個對應必須是寫死的，因為要編譯成能在 GPU 上跑得快的程式，不能動態變來變去。講者推測實務上很可能還會把同一組 key 和它對應的 query 放在同一張 GPU 卡上，減少卡與卡之間的傳輸。

## 那個 c 為什麼是 √d_h

（錄影 14:48–17:53）

寫 GQA 公式時，講者順手回頭補了分母 $c$ 的來由。$QK^\top$ 的每一格是兩個 $d_h$ 維向量的內積。假設向量 $a$、$b$ 的每個分量大小都在 $\pm 1$ 的量級，而且彼此看起來像隨機的，那麼內積 $a^\top b$ 的大小約在 $\sqrt{d_h}$ 的量級。課堂上直接給了這個結論；講義 17.3 節用變異數說明同一件事，[第 14 堂導讀](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention)已經依講義走過一次，這裡把算式完整寫出來：

設 $a$ 與 $b$ 的所有分量 $a_1,\dots,a_{d_h}, b_1,\dots,b_{d_h}$ 互相獨立、平均為 0、變異數為 1，則

$$
\mathbb{E}[a^\top b] = \sum_{i=1}^{d_h}\mathbb{E}[a_i]\,\mathbb{E}[b_i] = 0,\qquad
\mathrm{Var}(a^\top b) = \sum_{i=1}^{d_h}\mathbb{E}[a_i^2]\,\mathbb{E}[b_i^2] = d_h
$$

第二式分兩步：每一項 $a_i b_i$ 的平均是 0，所以它的變異數就是 $\mathbb{E}[a_i^2 b_i^2] = \mathbb{E}[a_i^2]\,\mathbb{E}[b_i^2] = 1$；各項 $a_i b_i$ 互相獨立，變異數可以逐項相加，$d_h$ 項加起來是 $d_h$。所以標準差是 $\sqrt{d_h}$。把 $c$ 取成 $\sqrt{d_h}$，除完之後送進 softmax 的數字就回到 1 的量級，不隨維度變動。

這為什麼要緊？用數字看（自擬）：$d_h = 256$ 時內積的標準差是 16。兩個 key 的分數如果差 16，不除的話 softmax 給它們的權重比是 $e^{16} \approx 8.9\times10^{6}$ 比 1，等於只看一個位置；除以 16 之後差距是 1，權重比是 $e \approx 2.72$ 比 1，約 0.73 對 0.27，兩個位置都還有份量。目的就是換了 $d_h$ 之後不必連帶重調整個架構。

講者對這個推導的定位很保留。他說這是「a very heuristic kind of calculation」：如果 $a$、$b$ 其實不隨機，早就指向相近的方向，該除的常數就不同（照上面的算法，兩個完全同向的向量內積是 $d_h$ 的量級，這句是本文補的）。不同的理論會給出略有出入的建議，$\sqrt{d_h}$ 是其中一個實測可行的選擇。原話是：

> "So you have some intuitions, you have some heuristics, and then you try it and empirically it works. Then that's your choice."（17:53）

## Sliding window attention：只看最近 w 個位置

（錄影 25:40–30:13，提問 31:40–32:40）

GQA 處理的是記憶體，這個變體處理運算量。$T$ 到一百萬時，$T^2$ 是 $10^{12}$，算不動。講者先聲明：

> "We don't know exactly how the frontier labs are doing this."（26:03）

開源社群裡的一種做法是乾脆不算全部的 attention。**Sliding window attention** 規定 $q_t$ 只看最近 $w$ 個位置的 key，$q_{t-1}$ 也是看它自己往回數的 $w$ 個，視窗跟著 query 的位置滑動。講義把它寫成一個 mask（式 17.35）：

$$
M_{t,j} = \begin{cases} 0, & \max(1,\,t-w+1) \le j \le t \\ -\infty, & \text{其他} \end{cases}
$$

每個 query 只算 $w$ 個內積，總運算量從 $T\times T$ 變成 $T\times w$，對 $T$ 是線性的。$w$ 是你自己選的超參數，通常遠小於 $T$。課堂上舉 $w = 1{,}000$：不管 $T$ 多大，就是 $T \times 1{,}000$。以 $T = 10^6$ 算，$T\cdot w = 10^9$，是 $T^2 = 10^{12}$ 的千分之一。

代價是看不遠，但沒有字面上那麼近。最上層位置 $t$ 的 query 只看得到最近 $w$ 個 key，可是那些 key 是從下面那一層輸出的 hidden vector 投影來的，而下面那一層的 hidden vector 自己又看過它前面的 $w$ 個位置。一層一層往下推，$L$ 層的模型最多能回看大約 $L \times w$ 個 token：

> "You can at most look back for l times w tokens."（29:11）

用小數字數一次會比較有感（本文自擬）：$w = 3$、兩層。上層位置 $t$ 看得到下層的 $t-2, t-1, t$；下層位置 $t-2$ 又看得到輸入的 $t-4, t-3, t-2$。所以上層位置 $t$ 最遠受到輸入 $t-4$ 的影響，往回 4 步。精確地數，每層往回延伸 $w-1$ 步，$L$ 層共 $L(w-1)$ 步；課堂上說的 $L\times w$ 是同一個量級的說法。

超過這個範圍的 token 對當下的輸出完全沒有影響，$T$ 夠大時模型一定會忘掉開頭。所以講者說不能只用這一招，另有不少論文在研究不會遺忘過去的 sparse attention，目前還不知道哪個最好。

## QK-Norm：先正規化再做內積

（錄影 30:13–31:30）

$\sqrt{d_h}$ 那段推導假設 query 和 key 的每個分量都在 1 的量級，可是訓練過程中沒有任何東西保證這件事，向量可能越練越大或越小。一個補強的做法是在做內積之前，先把 query 和 key 各自正規化：

$$
\frac{q_{t,j}\,k^\top}{c}\quad\longrightarrow\quad \frac{\mathrm{RMSNorm}(q_{t,j})\,\mathrm{RMSNorm}(k)^\top}{c}
$$

這裡的 $k$ 是 $q_{t,j}$ 要比對的任何一個 key。RMSNorm 是把向量除以自己各分量的均方根（講義式 7.51：$\mathrm{RMSNorm}(z) = \gamma\cdot z\big/\sqrt{\tfrac{1}{m}\sum_i z_i^2}$，$\gamma$ 是可學的縮放參數）。除完之後每個分量的均方根就是固定的，前一節的假設因此成立，內積不會隨著訓練漂走。課堂上同樣強調這是個 heuristic，只說有些開源模型在用；講義把它叫 QK-Norm，並舉 Qwen3 與 OLMo 2 為例。

## Mixture of Experts：參數放很多，每次只算一小部分

（錄影 32:40–50:55）

Transformer 的每一層除了 attention，還有對每個位置各自套用的 MLP（課堂上說 MLP、FFN、fully connected network 是同一個東西）。想把模型做大，最直接的是把 MLP 的維度拉高，但矩陣是 $d\times d$ 的，$d$ 加倍，矩陣的元素個數和乘法次數都變成四倍：想多放參數，每個 token 的運算就得跟著付。

**Mixture of Experts（MoE）** 換一種長大的方式：一層裡放 $m$ 個 MLP，各自叫一個 expert，記作 $E_1,\dots,E_m$；每個輸入只送給其中少數幾個，沒被選到的 expert 這次不參與運算。這樣參數量和運算量就脫鉤了。課堂上的數字是總共 128 個 expert、每次啟用 8 個：128 個都在記憶體裡，但一個 token 只付 8 個的運算。

開源模型的命名也反映這件事。課堂上舉的寫法是 `30B-A3B`：總參數 30B，A 代表 active，每次推論實際用到的是 3B。

### 路由怎麼算

（錄影 41:39–46:08，這段是回答學生「到底怎麼選」的提問）

輸入是 Transformer 裡某個位置的 hidden vector $h$。先用一個小的路由模組算出每個 expert 的權重：

$$
r = \sigma(h\,W^R) \in \mathbb{R}^m
$$

$W^R$ 是路由矩陣，把 $h$ 投影成 $m$ 維；$\sigma$ 可以是對 $m$ 個 expert 做 softmax，也可以是逐項的 sigmoid。$r$ 的第 $s$ 項代表第 $s$ 個 expert 對這個輸入的相對重要性。

接著取 $r$ 最大的 $k$ 項，它們的編號組成集合 $S$，$|S| = k$ 就是啟用的 expert 數。只對這 $k$ 個 expert 跑 $E_s(h)$，再加權相加：

$$
\mathrm{MoE}(h) = \sum_{s\in S}\alpha_s\,E_s(h),\qquad \alpha_s = \frac{r_s}{\sum_{j\in S} r_j}
$$

$\alpha$ 是把 $r$ 在被選中的那幾項裡重新正規化，讓它們加起來等於 1。講者特別更正了分母：加總只在 $S$ 裡面做，不是對全部 $m$ 項。這樣輸出是幾個 expert 輸出的凸組合，量級不會因為選了幾個而跑掉。

以下是本文自擬的例子。$m = 4$、$k = 2$，路由算出 $r = (0.5,\ 0.1,\ 0.3,\ 0.1)$。最大的兩項是第 1 與第 3 項，所以 $S = \{1, 3\}$。重新正規化：$\alpha_1 = 0.5/0.8 = 0.625$，$\alpha_3 = 0.3/0.8 = 0.375$。假設 $E_1(h) = (2, 0)$、$E_3(h) = (0, 4)$，則

$$
\mathrm{MoE}(h) = 0.625\,(2,0) + 0.375\,(0,4) = (1.25,\ 1.5)
$$

$E_2$ 和 $E_4$ 完全沒有被執行，這一步省下一半的 MLP 運算。如果忘了重新正規化、直接用 $0.5$ 和 $0.3$ 當權重，得到的是 $(1.0, 1.2)$，整體縮小成 0.8 倍；啟用數 $k$ 一改，輸出的量級就跟著變，這正是重新正規化要避免的事。

### expert 真的各有專長嗎

MoE 原本的動機不帶系統面的考量：想像 expert 1 管數學、expert 2 管物理、expert 3 管一般英文、expert 4 管程式，專門化的小網路可以用比較少的參數達到同樣效果。有學生問，那是不是分別拿專門的資料去訓練每個 expert？回答是不用：

> "You don't really train them to be specialized explicitly, but they could possibly naturally become specialized, because that's the most efficient way to do it."（37:30）

講者說他讀過幾篇論文宣稱專門化相當明顯，但結論要看你怎麼定義專門化。他接著澄清一個常見的誤解：路由不是對整條序列決定一次，是**每個位置、每一層**各決定一次。一條全是數學的序列，並不會從頭到尾都走同一批「數學 expert」；實測上單一序列用到的 expert 數的確少於總數，但界線沒有那麼分明。

至於刻意分開訓練，他的說法是有人試過，效果不如端到端訓練，而且很難操作：每個 expert 該用什麼資料、資料夠不夠，都是問題。只有 8 個 expert、每次選 1 個的話還勉強能想像；256 個選 8 個就很難事先一個一個指定。

### 共用 expert 與負載平衡

（錄影 46:08–50:55）

有些設計會保留 **shared expert**：每個位置、每一層都固定啟用，其餘的才用路由選。課堂上舉 DeepSeek-V3，講者印象中論文給的理由是共用的那個負責語言的共通知識，每個 token 都用得到；他也補充有些模型不採這個設計。講義給的數字是 DeepSeek-V3 每個 MoE 層有 256 個路由 expert，每個 token 啟用其中 8 個，另加 1 個 shared expert。

訓練 MoE 的細節課堂上沒有展開，只說很微妙，並點出一個重點：訓練時通常會加正規化（regularization），讓路由盡量平均分散到各個 expert。理由有兩個。如果路由永遠只走其中兩個，其他 expert 佔著記憶體卻沒被用到，模型的有效大小比帳面小。再者，各 expert 放在不同的 GPU 卡上，使用量差太多的話有些卡會閒置，推論效率變差。這也可以從部署面處理，給熱門的 expert 多配幾張 GPU；講者提到有 DeepSeek 的論文或部落格文章描述過依時段動態調整配置，並補了一句他不確定是不是所有模型都這樣做。

最後一個提問回到「這到底省了什麼」。省的是運算，不是記憶體：全部參數還是要載入。課堂上的對照是，一個一兆參數、不用 MoE 的模型幾乎不可能上線服務，延遲太長、成本太高；一兆參數但每次只啟用 30B，服務成本就比較像一個 30B 的模型，同時仍享有參數變多的好處。

## In-context learning：把範例寫進 prompt

（錄影 51:18–59:30）

剩下二十分鐘換主題：模型已經預訓練好了，怎麼用在下游任務上。假設你有幾筆下游任務的範例 $(x_1, y_1),\dots,(x_n, y_n)$，想讓模型對新的 $x_{\text{test}}$ 預測 $y$。

**In-context learning** 的做法是把這些範例照某個格式串成一段文字，後面接上 $x_{\text{test}}$，讓模型往下生成。課堂上的例子（講義 17.6 節同一個）：

```text
Q: 2 ~ 3 = ?
A: 5
Q: 6 ~ 7 = ?
A: 13
Q: 15 ~ 2 = ?
A:
```

前兩組是所謂的「訓練」範例，最後一行是測試。人看了大概會猜 `~` 是加號：$2+3=5$、$6+7=13$ 都對得上，所以答 $15 + 2 = 17$。這就是「learning」的部分，從兩個範例學到一個符號的意思。語言模型看了這段 prompt，接下來最可能生成的也是 `17`。

比較實際的用法是分類。課堂上的版本刻意出得更難：只告訴模型「把訊息分成 A、B、C 三類」，完全不說三類各是什麼，然後給幾組「訊息 → A」「訊息 → B」的範例，最後放一則新訊息，讓模型填輸出。模型可以從範例看出 A 大概是帳單問題、B 大概是技術問題，然後給出正確的標籤。平常當然不必把標籤藏起來，直接寫 billing、technical，模型學得更容易。即使寫了名稱，範例還是有用：「什麼算 billing 信件」的邊界有時很微妙，幾個例子比一段定義清楚。講者的比喻是這跟教人一樣，給他看例子，他自己會歸納。有學生說這樣看起來什麼都能教，回答是：原則上能用例子教的都可以，而且下一節的做法還更省事。

這一節最重要的一句話：

> "One very important thing is that you are not updating the parameters of the model."（57:44）

範例只是 context 裡的一串文字，模型的權重一個都沒變。講者由此推論能力的上限：如果你相信模型的能力來自參數，那 in-context learning 不太能提升根本能力，比較像是在學風格和簡單的定義。他舉的反例是醫學影像：給幾張掃描圖當範例，要模型判斷是不是癌症，他不認為這樣行得通，還是得調參數。

## Zero-shot：連範例都不給

（錄影 59:30–1:04:00）

更極端的做法是一個範例都不給，只寫任務描述：把訊息分成 billing、technical 等類別，用文字盡量說清楚每個標籤的意思，然後讓模型直接生成答案。這叫 **zero-shot**。任務描述可以很長，也可以指定輸出格式，例如要求輸出 JSON。講者說這大概就是大家平常用 ChatGPT 的方式，除了特殊情況，現在很少有人還在給 few-shot 範例。

他把這件事放回歷史脈絡。few-shot 與 zero-shot 的能力是 GPT-3 論文最大的發現之一，當時很意外：

> "it's very shocking because we thought that you have to actually train your models on the new tasks, a little bit at least."（1:00:49）

影響最大的是產業裡的部署方式。以前要替一家保險公司解決問題，流程是：蒐集該領域的資料、標註、切出訓練集與驗證集、從某個初始 checkpoint 開始訓練並調超參數，最後部署一個參數已經改過的專用模型。換一家公司，整套重來，每家各養一個模型。現在是大家用同一個現成的模型，各自寫自己的 prompt：任務描述、偶爾幾個範例，做 agent 類任務時再加一些 scaffolding。他還舉了一個例子：新人報到會拿到一份說明工作流程的 onboarding 文件，把那份文件直接給模型，模型就會照著做。

有學生問模型要多大才有這種能力。回答是這在三、四年前是熱門題目，叫做模型的 emergent properties：能力在規模與資料量超過某個程度後才出現，這點現在仍然成立。但現在小模型也能有這些能力，一是可以從大模型蒸餾（distill），二是訓練資料本身變了，裡面已經有這種「指令加答案」形式的資料。這句話正好接到最後一個主題。

## SFT 與 instruction tuning：把這個能力練進參數

（錄影 1:04:00–1:13:00）

zero-shot 和 in-context learning 的能力一開始是自己冒出來的，沒有人專門為它訓練。後來大家想加強它，做法很直接：蒐集大量 $(x^{(i)}, y^{(i)})$，其中 $x^{(i)}$ 是指令（任務描述），$y^{(i)}$ 是答案，然後從現有的 checkpoint 接著訓練。

設 $x^{(i)}$ 有 $L_i$ 個 token，$y^{(i)}$ 有 $T_i$ 個 token。$x$ 當作已經看到的條件，不需要預測；要預測的只有 $y$。目標是讓「給定指令時看到這個答案」的機率盡量大，也就是最小化負的 log likelihood：

$$
\min_\theta\ \frac{1}{n}\sum_{i=1}^{n} -\log p_\theta\!\left(y^{(i)}_{1:T_i}\,\middle|\,x^{(i)}\right)
$$

$y$ 是一串 token，所以用第 14 堂同一招，把聯合機率用連鎖律拆成逐步的條件機率相乘，取 log 之後變成相加：

$$
\log p_\theta\!\left(y^{(i)}_{1:T_i}\,\middle|\,x^{(i)}\right) = \sum_{t=1}^{T_i}\log p_\theta\!\left(y^{(i)}_t\,\middle|\,x^{(i)},\,y^{(i)}_{<t}\right)
$$

每一項的意思是：給定整段指令和答案的前 $t-1$ 個 token，預測第 $t$ 個。代回去就是講義的式 (17.36)。這跟預訓練的 loss 是同一個形式，差別只在加總的範圍：指令那 $L_i$ 個位置不算 loss。

以下是本文自擬的例子。指令是一句「把這則訊息分類」，答案只有兩個 token。模型在看完指令後，給答案第 1 個 token 的機率是 0.5；再看到第 1 個 token 後，給第 2 個 token 的機率是 0.25。這筆資料的 loss 是

$$
-(\ln 0.5 + \ln 0.25) = 0.693 + 1.386 = 2.079
$$

等於 $-\ln(0.5\times 0.25) = -\ln 0.125$，也就是整段答案的機率取負 log。模型對指令本身每個 token 預測得準不準，完全不影響這個數字。訓練會把 0.5 和 0.25 往 1 推，loss 往 0 走。

課堂上提到正規化有個小細節，請大家看講義。講義的做法（式 17.37）是把指令和答案接成一條序列 $z^{(i)}$，另外用一個 loss mask 標出哪些位置是答案（1）、哪些是指令（0），然後除以整個 minibatch 裡答案 token 的總數，而不是除以筆數 $n$。上面的例子若單獨成一個 batch，就是 $2.079 / 2 \approx 1.04$。講義也提醒 loss mask 和 attention 的 causal mask 是兩回事：答案的 token 照樣可以 attend 到指令。

名詞的關係：凡是「拿一個初始 checkpoint、用帶有答案 $y$ 的資料、以這個形式的 loss 接著訓練」都叫 **supervised fine-tuning（SFT）**；資料恰好是「指令加答案」這種型態時，叫 **instruction tuning**。

最後幾個提問值得記下來。

**這個 loss 會不會只是逼模型照人的方式做？** 講者說這個擔心是對的，但要先分清楚指令是什麼。指令通常規定的是任務和偏好，例如要解哪一題、答案要用什麼形式呈現，一般不會規定「用哪條方程式解」。

**如果 $y$ 裡面有 chain of thought 呢？** 那就真的會有這個問題。人寫的推理過程會把人的解法硬塞給模型，講者形容這是「too much micromanagement」，理想上推理過程應該由模型自己產生。他的評估是：

> "some micromanagement could be better than nothing"（1:10:02）

但大概不會比之後要講的 RL 做法好。

**這是在改權重嗎？** 是。instruction tuning 發生在訓練階段，你拿到的 ChatGPT 已經做過這一步；你在對話框裡打字不會即時改到模型。它通常排在預訓練之後的第二階段，不過講者說他無法確定各家實驗室現在怎麼做，這類資料也可能直接混進預訓練。

**微調資料不多時，可以只調一部分 expert 或幾層嗎？** 這是下課前最後一個提問。講者說他沒聽過只微調部分 expert 的做法，也許有論文做過；他的猜測是全部 expert 一起調還是比較好。

## 自我檢查

1. 模型每層 $n_h = 12$ 個 head，改用 GQA、$n_g = 3$。第 7 個 query head 用第幾組 key？這一層的 KV cache 變成原來的幾分之幾？
   **答**：$\tau = 4$，$g(7) = \lfloor 6/4\rfloor + 1 = 2$，用第 2 組。key 與 value 從 12 組變 3 組，KV cache 是原來的 1/4。

2. 用自己的話說明：為什麼 GQA 縮減 key 和 value 的組數，卻保留全部的 query？
   **判準**：要講到生成時 query 只需要當下那一步的，算完就能丟；key 和 value 要為之後每一步保留整條序列，所以記憶體壓力來自 K、V。只答「為了省記憶體」不算完整。

3. $w = 4{,}096$、$L = 24$ 層、上下文 $T = 200{,}000$ 的 sliding window 模型，最後一個位置的輸出有可能受到第 1 個 token 影響嗎？跟完整的 causal attention 比，每層每個 head 少算多少內積？
   **答**：最遠回看約 $L\times w = 98{,}304$ 個 token，小於 200,000，所以不可能。內積數約 $T\cdot w \approx 8.2\times10^{8}$，完整 causal attention 約 $T^2/2 = 2\times10^{10}$，大約是 1/24。

4. MoE 層有 4 個 expert、每次啟用 2 個，路由輸出 $r = (0.2,\ 0.6,\ 0.1,\ 0.1)$。寫出被選中的 expert 與各自的權重 $\alpha$。
   **答**：選第 1、2 個。$\alpha_1 = 0.2/0.8 = 0.25$，$\alpha_2 = 0.6/0.8 = 0.75$，相加為 1。

5. few-shot prompting、zero-shot prompting、instruction tuning 三者，哪些會改變模型參數？instruction tuning 的 loss 算在序列的哪一段？
   **答**：只有 instruction tuning 改參數。loss 只算在答案 $y$ 的 token 上，指令 $x$ 的 token 當條件，不計入。

## 對應閱讀

[CS229 主講義](https://cs229.stanford.edu/main_notes.pdf)（2026 年 8 月版）第 17 章 Large language models 的後半：

- 17.3 節末段 Memory and compute（p.213）：$O(T^2 d_h)$ 的運算與 KV cache 的記憶體。
- 17.4 Variants of Attention（pp.214–215）：MQA、GQA、sliding window、QK-Norm。
- 17.5 Mixture-of-Experts Layers（pp.215–216）。
- 17.6 In-context learning（pp.216–217）、17.7 Zero-shot learning / prompting（pp.217–218）、17.8 Supervised Finetuning（pp.218–219）。

課堂與講義的出入：

- **講義有、課堂沒講**：FlashAttention 讓訓練時的 attention 記憶體對 $T$ 線性；SFT 的 loss mask 寫法與 minibatch 正規化（式 17.37）；in-context 範例同時示範輸出格式的 JSON 分類 prompt；zero-shot 的光速例題。
- **課堂有、講義沒寫**：$c$ 可能該取別的常數的情況（向量早已同向時；$\sqrt{d_h}$ 的變異數說明與「只是 heuristic」的但書講義 17.3 節都有）；sliding window 經過 $L$ 層後可回看約 $L\times w$ 個 token；路由是逐位置、逐層決定；`30B-A3B` 的命名；路由負載平衡的正規化與 GPU 配置；zero-shot 對產業部署流程的改變；人寫的 chain of thought 當 SFT 目標的問題。
- **講法不同**：sliding window 的動機，課堂強調省運算（$T^2 \to T\cdot w$），講義強調視窗外的 key、value 不必留在 KV cache。GQA 的來源，課堂口頭說的是 Qwen、DeepSeek 模型，講義引用的是原始論文。分類例子的第三類，課堂說 accounting，講義寫 account。

**系列導覽**：上一篇 [第 14 堂：大型語言模型的 next-token 損失與 attention 怎麼算](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention)（第 15 堂是客座講座，沒有公開錄影）｜下一篇 [第 18 堂：強化學習基礎與 Policy Gradient](/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient)（第 17 堂也是客座講座，沒有公開錄影）

## 課程影片來源

原始影片：[Stanford CS229 Machine Learning | Spring 2026 | Lecture 16: Basic Concept in RL, Policy Gradient](https://www.youtube.com/watch?v=hHC-SF3utxg)

- [Stanford CS229 Machine Learning｜Spring 2026 播放清單（Stanford Online，17 支）](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 課程官網](https://cs229.stanford.edu/)
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

查核日期：2026-10-12。

內容核對：已依字幕核對（2026-10-12）：整支影片（73 分鐘）的英文字幕逐段讀過，各節時間區段與引句都對回字幕。公式依字幕口述對照主講義第 17 章還原；學生提問在字幕裡多半聽不清楚，文中的問題是從回答反推的。

## 參考資料

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 16（YouTube）](https://www.youtube.com/watch?v=hHC-SF3utxg)：本文的主要底本，課堂說法、例子與引句都出自這支影片的英文字幕。
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：第 17 章 17.3–17.8 節，用來還原 GQA、sliding window mask、MoE 與 SFT 的公式記號，以及 DeepSeek-V3 的 expert 數、QK-Norm 的名稱與採用模型；第 7 章式 (7.51) 的 RMSNorm 定義。
- [Stanford CS229 Spring 2026 播放清單](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)：確認這支影片在公開錄影中的位置與前後堂次。
- [CS229 課程官網](https://cs229.stanford.edu/)：課程身分與講義入口。

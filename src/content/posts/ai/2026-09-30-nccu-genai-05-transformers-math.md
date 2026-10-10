---
title: "政大蔡炎龍 生成式AI L05：Transformers 全攻略——用線性代數讀懂 Q/K/V、位置編碼與殘差連結"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, transformer, attention]
lang: zh-TW
series:
  name: "政大蔡炎龍 生成式AI 導讀"
  order: 5
tldr: "L05 用兩條線性代數規則讀完 Transformer：矩陣乘法是「列乘行」的內積，而向量乘矩陣等於對矩陣的列向量做線性組合。有了這兩條，attention 就是「query 跟每個 key 做內積、softmax 成權重、對 value 加權平均」，整批寫成 softmax(QKᵀ/√d_k)V；除以 √d_k 只是把數字拉回 0 附近，避免 softmax 贏者通吃。接著講 multi-head、encoder 與 decoder 的差別、mask、用 sin/cos 時鐘做的位置編碼，最後是 ResNet 式殘差與 layer normalization。本週沒有作業。"
description: "政大蔡炎龍「生成式 AI：文字與圖像生成的原理與實務」1132 學期第 5 講導讀：RNN 神經元的矩陣寫法、線性代數 101、Q/K/V 注意力機制與 √d_k 的由來、multi-head attention、encoder／decoder 與 masked attention、sin/cos 位置編碼、殘差連結、BatchNorm／LayerNorm／RMSNorm／DyT，以及為什麼這一週沒有作業。"
draft: false
glossary:
  - term: "position encoding"
    aliases: ["位置編碼", "positional encoding"]
    definition: "把每個字在句子中的位置編成一個向量，加到字的 embedding 上，讓一次平行計算的 self-attention 也知道字的先後順序。"
    context: "L05 用「十進位數字的每一位頻率不同」來解釋原論文的 sin/cos 位置編碼。"
  - term: "residual connection"
    aliases: ["殘差連結", "skip connection", "ResNet 設計"]
    definition: "把某一層的輸出從 ℓ(z) 改成 z + ℓ(z)，這一層只需要學「之前還沒學到的部分」f(z) − z，讓很深的網路也能穩定訓練。"
    context: "L05 用它解釋原版 Transformer 架構圖裡的 Add & Norm。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nccu-genai-05-transformers-math-en)

**本文依據政大蔡炎龍「生成式 AI：文字與圖像生成的原理與實務」2025 春季（政大學期代碼 1132）版。** 這是[政大蔡炎龍 生成式AI 導讀](/posts/ai/2026-09-30-nccu-genai-course-overview)系列第 5 篇，接續 [L04 大型語言模型原來這麼簡單](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token)。

用到的官方材料有兩份：[第 5 講錄影](https://www.youtube.com/watch?v=mhjegVhqb_M)（2025-03-18，3 小時 3 分）與投影片 [GenAI05 Transformers 的數學原理](https://drive.google.com/file/d/1Am2WvzkxWNnsXEQVLcPU5NL072GRWyR_/view)（67 頁，封面標題是「RNN 及 transformers 的數學原理」）。[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)上這週的課名是「Transformers 全攻略」，作業欄寫「無作業」。存取等級是 **A3**。

> **不想碰數學的讀者**：這篇是整個系列最陡的一段。你可以只讀每節的第一段直覺、跳過所有折疊區，或者直接跳到 [L06 LLM 的應用與倫理](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics)，後面的應用課不會卡住。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=mhjegVhqb_M
title: 【生成式 AI】05. Transformers 全攻略（YouTube 錄影，2025-03-18）
```

原始影片：[【生成式 AI】05. Transformers 全攻略（YouTube 錄影，2025-03-18）](https://www.youtube.com/watch?v=mhjegVhqb_M)

課程與錄影入口：

- [官方課程與錄影入口](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## 本週在課程中的位置

L04 用「猜下一個字」把 LLM 講成一台會接話的機器，也讓 Q/K/V 露了一面。L05 回頭把那一面講透：**Transformer 裡的每一個零件，拆開都是矩陣乘法。**

錄影的結構：第一節複習 RNN、補線性代數、推導 attention 與 √d_k；第二節講 multi-head、encoder／decoder、mask、位置編碼、殘差與 normalization；第三節是兩場閃電秀（農產品價格預測、塔羅占卜應用），最後助教時間專講「softmax 裡的神秘根號 d_k」。

## 先把 RNN 寫成矩陣

投影片第 3–8 頁拿兩個輸入、兩個 RNN 神經元的遞歸層示範。RNN 神經元看起來跟全連結層一樣，差別只在上一次的輸出 h_{t−1} 會再傳回來，跟這次的輸入一起決定這次的輸出。

認真看，RNN 神經元就是一般的神經元，只是有兩種輸入：「正常」輸入 x_t，和上次的 hidden states h_{t−1}。兩邊各乘一個權重矩陣，就同時算完了所有神經元。這個「一次算一整批」的寫法，就是後面讀懂 Transformer 的鑰匙。

<details>
<summary>RNN 神經元的矩陣寫法（投影片第 5–8 頁）</summary>

```
h_t = σ( W_Xᵀ x_t + W_Hᵀ h_{t−1} + b )

第 1 號神經元展開：
h_t¹ = σ( w₁₁ˣ x_t¹ + w₂₁ˣ x_t² + w₁₁ʰ h_{t−1}¹ + w₂₁ʰ h_{t−1}² + b₁ )
```

</details>

## 線性代數 101：只要記兩件事

投影片第 10–14 頁只教了兩個重點，錄影第 24 分鐘也明講「線代快速二重點」：

1. **矩陣乘法是「先列後行」**。C = AB 時，c_ij 是 A 的第 i 列與 B 的第 j 行做內積。內積是核心。
2. **向量乘矩陣＝對矩陣的列向量做線性組合**。一般教科書寫 Ax（行向量），但 Google 超喜歡列向量，所以 Transformer 論文寫成 xA：x 的每個分量，剛好是 A 每一列的權重。

第二點是整講最重要的技巧。後面 attention 的「加權平均」，就是這個線性組合。

<details>
<summary>兩條規則的式子</summary>

```
內積：u = [a₁, …, a_p], v = [b₁, …, b_p]
      ⟨u, v⟩ = u vᵀ = a₁b₁ + a₂b₂ + … + a_p b_p

列向量線性組合：x = [x₁, …, x_m]，A 的列向量是 a₁, …, a_m
      x A = x₁ a₁ + x₂ a₂ + … + x_m a_m
```

</details>

## Q/K/V：拿問題去找最適合的答案

2017 年 Google 發表 [Attention Is All You Need](https://arxiv.org/abs/1706.03762)，提出 Transformer，本來是想取代 RNN。投影片說，從標題看得出 Google 當時的野心更大。

投影片第 17–20 頁的直覺是：你手上有一段資訊 x₁, …, x_T（例如一段文字），每個 x_t 都有兩個特徵代表向量 k_t（key）和 v_t（value）。現在來了一個 query q（一個「問題」），想依據前面的資訊，找出最適合 q 的代表向量 h。

做法是：

1. 算 q 跟每個 x_t 的**相關強度**。Google 選的是最簡單的**內積** q·k_t。投影片強調，相關強度「基本上愛怎麼合理地算都可以」。
2. 把所有強度做 softmax，變成權重 α₁, …, α_T。
3. h = α₁v₁ + α₂v₂ + … + α_T v_T。這正是上一節的「列向量線性組合」。

**Self-attention** 就是每個 x_t 除了 k、v，再多產生一個 q_t，大家輪流當 query。把所有 q 也疊成矩陣 Q，就得到 Google 引以為傲的公式。

### 為什麼要除以 √d_k

投影片第 31–33 頁的解釋很直接：用內積算 attention 強度，效果其實沒有別的方法（例如訓練一個神經元去算）好，主要原因是 **softmax 贏者通吃**，讓高分的權重比合理值高出很多。

例子：五個分數 3.9、3.2、1、0.3、1.1，直接 softmax 是 61%、30%……原本只差一點的前兩名差了一倍。同除以 τ = √5 之後變成 1.74、1.43、0.45、0.13、0.49，softmax 成 40%、29%、11%、8%、11%。把數字拉回 0 附近，問題就解決了。

投影片的說法是：這裡放一個夠大、適當的數字就可以，比如 √9487，Google 寫成 √d_k「基本上只是讓你覺得好有學問」；τ 也可以當成一個 hyperparameter 來調。這週的助教時間（錄影 2:24:15 起）也專講這個根號。

<details>
<summary>Attention 的推導（投影片第 21–34 頁）</summary>

```
單一 query：
  e_t = ⟨q, k_t⟩ = q k_tᵀ
  把 k_t、v_t 疊成矩陣 K、V（每一列是一個向量）
  [e₁ … e_T] = q Kᵀ
  h = softmax(q Kᵀ) V                 ← 權重對 V 的列向量做線性組合

所有 query 一次算：
  Attention(Q, K, V) = softmax(Q Kᵀ / √d_k) V,   d_k = key 向量的維度

各向量怎麼來（W 都是學來的矩陣，x_t 是 word embedding）：
  q_t = x_t W_Q,  k_t = x_t W_K,  v_t = x_t W_V
```

</details>

## Multi-head、encoder、decoder 與 mask

**Multi-head attention**（投影片第 35 頁）：認真想想，attention 沒理由只有一種，所以可以用不同的學習矩陣 W_n 定義第 n 個 attention，`Attention(Q W_n, K W_n, V W_n)`（投影片的簡寫，實際上 Q、K、V 各自有一組矩陣），多組一起算。

**Encoder 與 decoder 的設計不同**（第 36–39 頁）：

- Encoder 裡的 multi-head attention，q、k、v 都由輸入向量自己產生，是 self-attention。
- Decoder 有兩層 attention。下面那層是 **masked** multi-head self-attention；中間那層是唯一不是 self-attention 的：**k、v 來自 encoder，q 來自 decoder**。
- Transformer 的輸入有幾個字（詞向量），輸出就有幾個。decoder 也是這樣，只是**還沒生出來的位置會被 mask 住**，不能偷看後面的字。

錄影第二節還有一段講「記憶體與字數限制的原因」（1:10:22 起），投影片沒有對應頁，本文不展開。

## 位置編碼：用一組快慢不同的時鐘標出順序

RNN 是真的一個字一個字讀；Transformer 為了平行化，一次做完 self-attention，**每個字的先後順序其實沒有被考慮**。所以要把位置資訊加進原本的 word embedding，這叫 position encoding（投影片第 41 頁）。

投影片第 42–43 頁的直覺很漂亮：觀察任何一種進位的數字系統，例如十進位的 9487，個位數每 1 變一次，十位數每 10 變一次，百位數每 100 變一次，**越高位數週期越長、頻率越低**。

我們想要一個「奇幻進位系統」：要連續、有週期性、數值不能太大（以免蓋過原本的 embedding）。sin 和 cos 剛好符合。於是 embedding 的每兩維一組、共用同一個頻率，低位數頻率高、高位數頻率低。

為什麼要 sin 和 cos 一起用？投影片第 48 頁的答案是：一個位元只用一個數字表示不夠，(sin, cos) 剛好是單位圓上的一點，可以想成時鐘上的一根指針，只是低位元的時鐘轉得快、高位元的時鐘轉得慢。

錄影也強調（1:28:16），position embedding 不限於這一種方法，sin/cos 只是原論文的選擇。

<details>
<summary>原論文的 position encoding（投影片第 44–49 頁）</summary>

```
第 t 個字的位置向量 p_t = [p₀, p₁, …, p_{d−1}]，加到 embedding x_t 上

ω_k = 1 / 10000^{2k/d}
p_{2k}   = sin(ω_k · t)
p_{2k+1} = cos(ω_k · t)
```

投影片提醒兩個小地方：原論文的下標通常從 1 開始，但這裡要從 0 開始，才符合「後面的頻率越來越慢，ω₀ > ω₁ > …」；另外極座標明明是 cos 在前，(sin θ, cos θ) 繞一圈也是單位圓，而且 θ = 0 指向時鐘 12 點、走向是順時鐘，投影片說「雖然不知 Google 的考量」。

</details>

## 讓 Transformer 更穩：殘差連結與 normalization

回到原版架構圖，還沒講的是 Add & Norm：**residual 連結**與 **layer normalization**。投影片說這些是當年讓神經網路更深、更穩定的最佳技術，現在也差不多。

### ResNet 式的殘差：只學還沒學到的

[ResNet](https://arxiv.org/abs/1512.03385) 的設計是把某層的輸出從 ℓ(z) 改成 **z + ℓ(z)**（第 52–56 頁）。

本來希望 ℓ(z) ≈ f(z)（f 是目標），現在變成 z + ℓ(z) ≈ f(z)，也就是 ℓ(z) = f(z) − z：**這一層只需要學之前還沒學到的部分**。如果 z 已經很接近正確答案，ℓ(z) 就不太需要再學什麼。投影片引了 [Li 等人 NeurIPS 2018](https://arxiv.org/abs/1712.09913) 的 loss landscape 視覺化：加了 skip connection 之後，loss function 平順很多。

### 從 BatchNorm 到 DyT

- **Batch Normalization**：對一個 batch 算平均與標準差，標準化後再用學來的 γ、β 縮放平移；分母加一個 ε 預防除以 0。
- **[Layer Normalization](https://arxiv.org/abs/1607.06450)**：原版 Transformer 的選擇。改成對**單一個向量自己的各分量**算平均與標準差。
- **[RMSNorm](https://arxiv.org/abs/1910.07467)**：Llama 等 LLM 使用，只除以均方根，不減平均。投影片第 62 頁放了 Sebastian Raschka [LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) 從 GPT-2 到 Llama 3.2 的架構比較圖，說看到這裡，你也知道新模型差在哪了。
- **Dynamic Tanh（DyT）**：投影片標題是「最近 Meta 說不用做 Normalization！」，DyT(x) = γ · tanh(αx) + β，α 的初值可設為 0.5。論文是 [Transformers without Normalization](https://arxiv.org/abs/2503.10622)。

<details>
<summary>Normalization 的式子（投影片第 58–64 頁）</summary>

```
LayerNorm：μ = (1/n) Σ x_i，σ = sqrt( (1/n) Σ (x_i − μ)² )
          x̂ = (x − μ) / (σ + ε)，y = γ x̂ + β      （γ、β 是學來的向量；如 numpy 的 broadcasting）

RMSNorm： RMS(x) = sqrt( (1/n) Σ x_i² )，RMSNorm(x) = γ · x / RMS(x)

DyT：     DyT(x) = γ · tanh(αx) + β
```

</details>

## 收尾：Transformer 不只處理文字

投影片最後兩頁（第 65–66 頁）打開下一段課程的門：圖像、聲音、時間序列資料也都可以用 Transformer。而 decoder 中間那層「q 來自一邊、k 與 v 來自另一邊」的設計，是把資訊「混入」的好方法。例如文字生圖的 AI：隨機產生的「天馬行空的想法」當 Q，代表文字意思的矩陣產生 K、V，Transformer 的輸出就混入了文字的意涵。這個伏筆會在 [L11 文字生圖](/posts/ai/2026-09-30-nccu-genai-11-text-to-image)收回。

## 這週的 Demo notebook 與作業

這一講**沒有對應的課堂 Demo notebook**，[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)的第五週作業欄也明寫「無作業」（「第五週無作業」）。這是全學期兩個沒有作業的上課週之一，另一個是第 15 週的「生成式 AI 新趨勢」。

沒有作業不代表可以跳過：L04 的 benchmark 作業還在兩週的繳交期內，這週剛好可以用 L05 的觀念回頭檢查你對 LLM 行為的解釋。

## 自學檢查點

1. 向量乘矩陣 xA，為什麼可以看成 A 的列向量的線性組合？
2. 用一句話說 query、key、value 各自扮演什麼角色。
3. 除以 √d_k 解決的是什麼問題？換成別的常數可以嗎？
4. Encoder 與 decoder 各有哪些 attention 層？哪一層不是 self-attention？
5. 為什麼 self-attention 需要位置編碼？sin/cos 版本裡，哪些維度的頻率最高？
6. 殘差連結 z + ℓ(z) 為什麼讓深層網路比較好訓練？

**今晚能做的動作**：在 Colab 用 numpy 寫出 `softmax(Q @ K.T / np.sqrt(d_k)) @ V`，隨便給 3 個字、d_k = 4 的隨機矩陣跑一次；再把 √d_k 拿掉，看權重是不是變得更「贏者通吃」。十行以內就能親眼看到投影片第 32–33 頁的現象。

```python
import numpy as np

def softmax(s):
    e = np.exp(s - s.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

scores = np.array([3.9, 3.2, 1, 0.3, 1.1])
print(softmax(scores).round(2))               # [0.61 0.3  0.03 0.02 0.04]
print(softmax(scores / np.sqrt(5)).round(2))  # [0.4  0.29 0.11 0.08 0.11]
```

## 延伸閱讀

本篇自己講完整，想看更嚴謹或更實作的版本：

- 從位置編碼推到 causal self-attention：[CMU 07-280 Lecture 20](/posts/ai/2026-08-22-cmu-07280-lecture-20-attention-transformers)
- Attention 與 Transformer 的深度學習觀點：[CMU 11-785 Lecture 18](/posts/ai/2026-08-22-cmu-11785-18-attention-transformers)
- Transformer 與 LLM 的完整課程：[Stanford CME295 導讀](/posts/ai/2026-09-29-stanford-cme295-transformers-llms)、[Stanford CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)
- 從零寫出 Transformer 語言模型：[Stanford CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)
- 中文授課的另一條路線：[台大李宏毅 ML 2026 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)

系列導覽：[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)｜上一篇 [L04 大型語言模型原來這麼簡單](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token)｜下一篇 [L06 LLM 的應用與倫理挑戰](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [長庚衛星班課程頁：生成式AI：文字與圖像生成的原理與實務 2025（課表；第五週無作業）](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [【生成式 AI】05. Transformers 全攻略（YouTube 錄影，2025-03-18）](https://www.youtube.com/watch?v=mhjegVhqb_M)
- [1132 生成式 AI 錄影播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [GenAI05 Transformers 的數學原理投影片（Google Drive）](https://drive.google.com/file/d/1Am2WvzkxWNnsXEQVLcPU5NL072GRWyR_/view)
- [1132 投影片資料夾入口（yenlung.me/1132GenAI）](https://yenlung.me/1132GenAI)
- [Vaswani et al. 2017：Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [He et al. 2015：Deep Residual Learning for Image Recognition（ResNet）](https://arxiv.org/abs/1512.03385)
- [Li et al. 2018：Visualizing the Loss Landscape of Neural Nets](https://arxiv.org/abs/1712.09913)
- [Ba et al. 2016：Layer Normalization](https://arxiv.org/abs/1607.06450)
- [Zhang & Sennrich 2019：Root Mean Square Layer Normalization](https://arxiv.org/abs/1910.07467)
- [Zhu et al. 2025：Transformers without Normalization（DyT）](https://arxiv.org/abs/2503.10622)
- [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch)

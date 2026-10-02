---
title: "MIT 6.S184 L4：U-Net、DiT 與 latent space"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, flow-matching, generative-ai, diffusion-transformer, vae, latent-diffusion]
lang: zh-TW
series:
  name: "MIT 6.S184 導讀"
  order: 7
tldr: "前幾講的演算法已經完整，第 4 講處理規模化時的兩個工程問題。第一，網路要吃圖片、時間 t 和 prompt 三種輸入，吐出一樣大的向量場，所以用 U-Net 或 diffusion transformer（DiT），時間用 Fourier 特徵嵌入、文字用凍結的 CLIP／T5 嵌入。第二，像素空間太大，所以先訓練一個 VAE 把圖壓進 latent space，在那裡做 flow matching，最後再解碼。Stable Diffusion 3 與 Meta Movie Gen Video 都是這套配方：latent 空間裡的 flow matching＋DiT 變體＋CFG。"
description: "MIT 6.S184（IAP 2026）第 4 講導讀，依講義 §6、Slides 4 與錄影：時間／類別／文字的嵌入、DiT 與 Remark 29 的 DiT block（self-attention、cross-attention、adaLN）、U-Net、autoencoder 為什麼不夠、VAE 的重建與 KL 項（Remark 30、Example 31、eq. 83）、Algorithm 6 β-VAE、Remark 32 latent diffusion，以及講義寫到的 Stable Diffusion 3 與 Movie Gen Video 案例。"
draft: false
glossary:
  - term: "adaLN"
    aliases: ["adaptive layer normalization", "AdaNorm", "自適應正規化"]
    definition: "用條件向量（例如時間嵌入）經 MLP 產生逐通道的 scale 與 shift，去調變正規化後的激活值：x ↦ (1+γ)⊙Norm(x)+β。"
    context: "MIT 6.S184 講義 Remark 29：DiT 用它把時間 t 注入每一層。"
  - term: "reparameterization trick"
    aliases: ["重參數化技巧"]
    definition: "把 z ~ N(μ_φ(x), σ_φ²(x)) 改寫成 z = μ_φ(x) + σ_φ(x)·ε、ε ~ N(0, I)，讓隨機性只來自與參數無關的 ε，loss 才能對 φ 做反向傳播。"
    context: "MIT 6.S184 講義 §6.2.2 訓練 VAE 時使用。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures-en)

> **版本說明**：本文依據 [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) IAP 2026 的[講義](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) §6（pp.41–53）、[Slides 4](https://diffusion.csail.mit.edu/2026/docs/20260128_Lecture_04_edited.pdf)，以及[第 4 講錄影](https://www.youtube.com/watch?v=g0MB1CCBmsI)（約 81 分鐘）。公式、Remark、Algorithm 編號都照講義；內容以講義與 slides 為準。存取等級 A3：講義、slides、錄影、lab 與官方解答都公開；lab 評分只給 MIT 修課生。2026-09-30 核對。

**系列位置**：上一篇 [L3B：Guidance 與 classifier-free guidance](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance)｜下一篇 [Lab 3：DiT、VAE 到 latent diffusion](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion)｜[系列總覽](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)

到第 3B 講為止，訓練和取樣的演算法都齊了：flow matching 或 score matching 負責訓練，CFG 讓模型聽 prompt 的話。這些演算法在 2D 玩具分佈上跑得很好，因為網路只是一個 MLP，把 x、y、t 串起來就行。

換成一張 1024×1024 的彩色圖，兩件事立刻壞掉：

1. **MLP 不夠用。** 網路要吃一張圖、一個時間值、一段 prompt，吐出一張同樣大小的「速度圖」。這需要專門的架構。
2. **空間太大。** 講義算給你看：1024×1024×3 大約是 300 萬維，影片還要再乘上幀數。

第 4 講就是分別解這兩題。講義 §6 的順序是先講架構、再講 latent space，Slides 4 則是反過來先講 latent space（Section 6）、再講架構（Section 7）。本文照講義順序。

## 第一題：網路要怎麼吃三種輸入

講義 §6.1 開頭把需求講清楚：網路有三個輸入，向量 `x ∈ R^d`、條件 `y`、時間 `t ∈ [0,1]`，一個輸出 `u_t^θ(x|y) ∈ R^d`。所以第一步是把 t 和 y 都變成網路能消化的向量。

### 時間、類別、文字各自怎麼嵌入

- **時間 t**：只是一個純量，跟高維的圖片放在一起「分量太輕」（Slides 4 的說法是讓它 count more）。常見做法是用 **Fourier 特徵**，把 t 映成一串不同頻率的 cos 和 sin，讓網路能捕捉對時間的高頻依賴。講義也說這個確切形式不是必要的，重點是得到一個 d 維、範數為 1 的向量。
- **類別標籤**：最簡單。N+1 個可能值（包含 CFG 的空標籤）各學一個嵌入向量，當成網路參數一起訓練。
- **文字 prompt**：大多依賴**凍結的預訓練模型**。講義舉 CLIP 為例：它把圖和文字嵌入同一個空間，讓配對的圖文靠近。如果不想把整句壓成一個向量，可以再用預訓練 transformer 得到一整串嵌入；也常把好幾種嵌入組合起來用。講義最後把結果抽象成一個形狀 `S×k` 的序列。

<details>
<summary>講義 eq. (68)–(69)：Fourier 時間嵌入</summary>

```text
TimeEmb(t) = sqrt(2/d) · [cos(2π w_1 t), …, cos(2π w_{d/2} t), sin(2π w_1 t), …, sin(2π w_{d/2} t)]^T   (68)

w_i = w_min · (w_max / w_min)^{(i−1)/(d/2−1)},   i = 1, …, d/2                                         (69)
```

因為 sin² + cos² = 1，這個向量的範數固定是 1。

</details>

### Diffusion transformer（DiT）

DiT 建立在 vision transformer 的想法上：**把圖切成小塊（patch），每塊當成一個 token，交給 attention 處理，最後再拼回圖的形狀。**

流程分四步：

1. **Patchify**：把 `C×H×W` 的圖切成 N 個大小 P×P 的 patch，N = (H/P)·(W/P)。每個 patch 攤平後乘上一個可學的矩陣，變成 d 維的 token。
2. **準備條件**：時間嵌入 `t̃ ∈ R^d`、prompt 嵌入 `ỹ ∈ R^{S×d}`，都調到 transformer 的隱藏維度 d。
3. **L 層 DiT block**：每一層都拿 patch token、時間、prompt 來更新 patch token（eq. 70）。
4. **Depatchify**：乘上另一個矩陣、重排回 `C×H×W`，就是預測的速度 `u_t^θ(x|y)`。

每一層 DiT block 做三件事（**Remark 29**），各自負責一種輸入：

| 輸入 | 機制 | 做什麼 |
|---|---|---|
| 圖片 | self-attention | patch 之間互相看 |
| prompt | cross-attention | patch 去看文字嵌入（query 是圖，key／value 是文字） |
| 時間 | adaptive normalization（adaLN） | 用時間嵌入決定正規化後的 scale 和 shift |

講義也提醒：像 Lab 3 那種只用類別當條件的 DiT 比較簡單，通常省掉 cross-attention，把時間和類別一起透過 adaLN 注入。

<details>
<summary>Remark 29：一個 DiT block 的數學描述</summary>

Scaled dot-product attention：

```text
Attn(Q, K, V) = softmax(Q K^T / sqrt(d_h)) V
```

multi-head attention 的每個 head 用自己的投影 `W_Q^(h), W_K^(h), W_V^(h)`，來源序列 z 可以是 x 自己（self-attention）或 prompt y（cross-attention）。各 head 串接後乘上 `W_O`。

時間條件：MLP `g` 把 `t̃` 映成 `(γ, β)`，

```text
AdaNorm_t̃(x) = (1 + γ) ⊙ Norm(x) + β
```

整個 block：

```text
x ← x + g_self(t̃)  ⊙ MultiHeadAttention(AdaNorm_t̃(x), AdaNorm_t̃(x))
x ← x + g_cross(t̃) ·  MultiHeadAttention(AdaNorm_t̃(x), y)
x ← x + g_MLP(t̃)   ·  MLP(AdaNorm_t̃(x))
```

`g_…` 是可學的 gating 參數。講義說這段刻意強調演算法選擇，不追求每個架構細節。

</details>

Slides 4 對 DiT 的建議很務實：「理解 transformer 最好的方法就是實作一次」，指向 [Lab 3](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion)。

### U-Net

**U-Net** 是另一種選擇，是一種卷積網路，原本設計來做影像分割。它適合參數化向量場的關鍵特性是：**輸入和輸出都是圖的形狀**。固定 y 和 t 之後，`x ↦ u_t^θ(x|y)` 正好是「圖進、圖出」。講義說早期的 diffusion 文獻大量使用它。

講義用一張 `3×256×256` 的圖走一遍：

```text
x_t^input  ∈ R^{3×256×256}     輸入
x_t^latent = E(x_t^input)  ∈ R^{512×32×32}    經過 encoders：通道變多、長寬變小
x_t^latent = M(x_t^latent) ∈ R^{512×32×32}    經過 midcoder
x_t^output = D(x_t^latent) ∈ R^{3×256×256}    經過 decoders 還原形狀
```

「midcoder」是講義自己取的名字，指 U 字最底部那段，講義腳註也承認這個詞完全不標準。實務上 encoder 和 decoder 之間通常有殘差連接，而且常在 encoder／decoder 裡加 attention 層；講義的描述是純卷積的簡化版本。講義 Figure 15 的註解說，2025 年版 Lab 3 用的是類似的 U-Net；2026 年版 Lab 3 改成 DiT。

## 第二題：像素空間太大，就換一個空間

### 為什麼 diffusion 特別怕高維

Slides 4 用一張 600×1000 的彩色圖算：3×600×1000 = 180 萬維。問題有三個：GPU 記憶體爆掉、學習問題很難、相鄰像素高度相關所以很冗餘。

Slides 接著問了一個好問題：**為什麼這對 diffusion 是問題，對監督式學習就不是？** 答案有兩點：

- 我們學的是向量場，**輸出跟輸入一樣高維**。影像分類的輸出只有幾個類別，網路可以一路收窄。
- 取樣時要**模擬 ODE，同一個網路要反覆呼叫很多次**。

### 一般的 autoencoder 為什麼不夠

直覺解法是壓縮：訓練一個 encoder 把圖壓成低維 latent，一個 decoder 還原回來，用重建誤差訓練。講義舉的例子是把 `3×1024×1024` 的圖在長寬各降 16 倍，壓成 `3×64×64`。

問題是：重建誤差只保證「壓得回來」，**完全不管 latent 的分佈長什麼樣**。你的最終目的是在 latent 空間訓練生成模型，如果壓縮把資料分佈扭成一個很難學的形狀，那就是壓縮成功、生成失敗。Slides 4 把這叫「bad latent space」。

所以要一個能控制 latent 分佈的 autoencoder。

### VAE：讓 latent 長得像高斯

**Variational autoencoder（VAE）** 把 encoder 和 decoder 從確定性函數放寬成機率分佈：encoder 給出 `q_φ(z|x)`，decoder 給出 `p_θ(x|z)`，最常見的選擇是兩者都是高斯。

VAE 的 loss 有兩部分：

1. **重建項**：編碼再解碼之後，原圖的機率有多高。在高斯、固定變異數的情況下，基本上就是加了隨機性的 MSE。
2. **先驗項**：讓每張圖的編碼分佈 `q_φ(·|x)` 都靠近標準高斯 `N(0, I_k)`，用 KL divergence 衡量。講義的直覺是：每個 x 的編碼都像高斯，整體 latent 分佈也該像高斯，而高斯很好學。

兩項用權重 β 加起來。展開成高斯的形式後，總 loss 有四項，講義 eq. (83) 各自標了名字：**重建誤差、decoder 信心、讓 latent 變異數等於 1、讓 latent 平均等於 0**。

<details>
<summary>Remark 30、Example 31、eq. (78)–(83)：VAE loss</summary>

**Remark 30**（KL divergence）：

```text
D_KL(q ‖ p) = ∫ q(x) log(q(x)/p(x)) dx = E_{X~q}[log q(X)/p(X)]
D_KL ≥ 0，且 D_KL = 0 ⇔ q = p                                            (76)(77)
```

**Example 31**（對角高斯之間的 KL）：

```text
D_KL(q ‖ p) = ½ [ K(σ_q²/σ_p²) + ‖μ_q − μ_p‖²/σ_p² ],   K(α) = Σ_i (α_i − log α_i − 1)   (80)
```

K(α) 在 α=1 有唯一最小值，所以平均相同、變異數相同時 KL 為 0。

VAE 目標：

```text
L_VAE = L_VAE-Recon + β L_VAE-Prior                                      (78)
      = −E[log p_θ(x|z)] + β E[D_KL(q_φ(·|x) ‖ p_prior)]                  (79)

eq. (83) 的四項：
  (1/(2σ_θ²(z))) ‖x − μ_θ(z)‖²    重建誤差
  (d/2) log σ_θ²(z)               decoder 信心
  (β/2) K(σ_φ²(x))                讓 latent 變異數 = 1
  (β/2) ‖μ_φ(x)‖²                 讓 latent 平均 = 0
```

</details>

**怎麼訓練？** loss 的期望值是對 `q_φ(z|x)` 取的，而這個分佈本身依賴參數 φ，沒辦法直接反向傳播。解法是 **reparameterization trick**：把 z 寫成 `μ_φ(x) + σ_φ(x)·ε`，ε 取自與 φ 無關的標準高斯。隨機性只來自 ε，其餘都是可微的函數。**Algorithm 6** 把這整套寫成 β-VAE 的訓練迴圈。

<details>
<summary>Algorithm 6：β-VAE 訓練（decoder 變異數固定為 σ̃²）</summary>

```text
Require: 資料 x ~ p_data、encoder (μ_φ(x), log σ_φ²(x))、decoder μ_θ(z)、latent 維度 k、β ≥ 0、σ² > 0
for 每個 mini-batch {x_i}:
    μ_i, log σ_i² ← encoder(x_i)
    ε_i ~ N(0, I_k)
    z_i ← μ_i + σ_i ⊙ ε_i            (σ_i = exp(½ log σ_i²))
    x̂_i ← μ_θ(z_i)
    L_recon ← (1/B) Σ_i ‖x_i − x̂_i‖² / (2σ̃²)
    L_KL    ← (1/B) Σ_i ½ Σ_j (μ_ij² + σ_ij² − log σ_ij² − 1)
    L ← L_recon + β L_KL
    更新 (φ, θ)
```

</details>

講義還附了四點實務提醒，值得記住：

- **β 怎麼選。** β 太大會讓重建變差，甚至 posterior collapse（encoder 忽略輸入，直接輸出標準高斯）。常見的穩定手法是 KL warm-up，從 β=0 慢慢加上去。講義說現代 autoencoder 的 β 都非常小，β≪1。
- **decoder 變異數通常固定。** 學它數值上很麻煩，固定之後重建項就正比於 MSE。
- **只用像素 MSE 會太糊。** 實務上會加 perceptual loss。
- **可以再加對抗式 loss**（VAE-GAN 風格）讓輸出更銳利，代價是訓練更不穩。

### Latent diffusion：同一套配方，換一個資料集

**Remark 32** 說，在 latent 空間訓練生成模型，就是照原本的配方做，只是資料換成 latent。Slides 4 把它寫成五步：

1. 拿全部訓練資料（例如網路上的所有圖）。
2. 全部編碼成 latent（VAE 就取平均）。
3. 得到一個小得多的 latent 資料集。
4. 在這個資料集上訓練 flow／diffusion 模型，它現在生成的是 latent。
5. 取樣後用 decoder 解碼回圖。

講義補充一個細節：推論時解碼用 decoder 的**平均**，不另外取樣，避免雜訊造成的瑕疵。直覺上，好的 autoencoder 會濾掉高頻、沒有語意的細節，讓生成模型專心處理感知上重要的特徵。

Slides 4 給了兩個壓縮比例的例子：Stable Diffusion 把 `[3,256,256]` 壓成 `[4,32,32]`，FLUX 2.0 把 `[3,1024,1024]` 壓成 `[32,64,64]`。講義說，撰寫時幾乎所有最先進的圖片與影片生成方法都走 latent diffusion 路線。

代價也要知道：**autoencoder 要先訓練好，而且最終品質有一部分取決於它壓得好不好、解得漂不漂亮。**

講義附錄 D（Additional Perspectives on VAEs）有更多 VAE 的觀點，本系列沒有獨立篇，想深入可以直接讀。

## 案例：講義怎麼寫 Stable Diffusion 3 與 Movie Gen Video

講義 §6.3 用兩個大型模型示範：前面每一講的東西，在真實系統裡都找得到。以下只整理講義與 Slides 4 寫到的內容。

| | Stable Diffusion 3 | Meta Movie Gen Video |
|---|---|---|
| 生成什麼 | 圖片 | 影片（資料多一個時間維度 T） |
| 訓練目標 | conditional flow matching；講義說 SD3 論文比較過多種 flow／diffusion 做法，flow matching 最好 | conditional flow matching，直線 scheduler `α_t = t, σ_t = 1−t` |
| latent 空間 | 預訓練 autoencoder | 凍結的預訓練 temporal autoencoder（TAE），時間、高、寬各壓 8 倍；長影片切段分別編碼再接起來 |
| 網路 | MM-DiT：把 DiT 從類別條件擴展到文字序列條件，圖和文字一起走完整個網路 | 類 DiT 骨幹，沿時間和空間切 patch；patch 之間 self-attention，對文字嵌入 cross-attention |
| 文字嵌入 | 三種，包括 CLIP（粗粒度）與 T5-XXL encoder 的序列輸出（細粒度） | 三種：UL2（文字推理）、ByT5（字元層級細節，例如 prompt 要求畫面裡出現特定文字）、MetaCLIP |
| CFG | 訓練時丟標籤；取樣 guidance 權重 2.0–5.0 | Slides 4 列出有用 CFG |
| 規模 | 最大 80 億參數；取樣用 Euler 法 50 步 | 最大 300 億參數；Slides 4 寫訓練用了 6,144 張 H100 |

Slides 4 另外寫 SD3 的資料集是 LAION，這一點講義沒有寫。講義也提到，影片比圖片更需要 autoencoder 來省記憶體，這也是目前多數影片生成器能生成的長度很有限的原因。

## 這一講沒講什麼

- **這些模型的訓練細節與評測。** 講義只挑跟課程技術相關的部分，其餘請讀 SD3 論文與 Movie Gen 技術報告。
- **文獻導覽。** Slides 4 最後有一節 Bonus「A guide to the diffusion literature」，整理 flow 與 diffusion 兩種時間慣例、DDPM／DDIM、stochastic interpolants 等不同說法。它和 Slides 3 結尾那節內容相同；講義對應的是附錄 E。
- **離散資料。** 文字 token 怎麼做擴散，是[第 5 講](/posts/ai/2026-09-30-mit-6s184-lecture-05-discrete-diffusion)的事。

## 讀完這講，你應該能

- 說出向量場網路的三個輸入各自怎麼嵌入。
- 畫出 DiT 的四步流程，並說出一個 DiT block 裡 self-attention、cross-attention、adaLN 各自處理哪種輸入。
- 解釋 U-Net 為什麼適合參數化向量場。
- 說出為什麼高維對 diffusion 比對分類更致命。
- 解釋一般 autoencoder 為什麼不夠，以及 VAE 的 KL 項在解決什麼問題。
- 用五步說出 latent diffusion 的配方，並指出它額外依賴什麼。

**今晚就能做的事**：讀講義 pp.46–51（§6.2），把 eq. (83) 的四項各自用一句話講給自己聽。接著打開 [Lab 3](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion) 的 Part 3，從 Question 3.2 的 `Patchifier` 開始寫。

## 延伸閱讀

- VAE 的完整推導（ELBO 觀點）：[CMU 11-785 L22：Variational Autoencoders](/posts/ai/2026-08-22-cmu-11785-22-variational-autoencoders)
- Transformer 與 attention 從頭講：[Stanford CS224N：Transformers](/posts/ai/2026-08-22-cs224n-transformers)、[CMU 11-785 L18：Attention 與 Transformers](/posts/ai/2026-08-22-cmu-11785-18-attention-transformers)
- DDPM 觀點的 diffusion（時間方向與本課相反）：[CMU 11-785 L23：Diffusion](/posts/ai/2026-08-22-cmu-11785-23-diffusion)

## 參考資料

- [MIT 6.S184 課程網站（IAP 2026）](https://diffusion.csail.mit.edu/2026/index.html) — 第 4 講主題：VAE 與 latent space、DiT 與 U-Net、大型模型案例
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models（講義 PDF）](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — §6.1 eq. (68)–(70)、Remark 29、U-Net 與 Figure 15；§6.2 eq. (71)–(83)、Remark 30、Example 31、Algorithm 6、Remark 32；§6.3 SD3 與 Movie Gen Video；附錄 D
- [Slides 4（20260128_Lecture_04_edited.pdf）](https://diffusion.csail.mit.edu/2026/docs/20260128_Lecture_04_edited.pdf) — The Need for Latent Spaces、LDM recipe、SD／FLUX 2.0 壓縮比例、DiTBlock overview、SD3 與 MovieGen 案例、文獻導覽
- [第 4 講錄影：Latent Spaces, Neural networks (2026)](https://www.youtube.com/watch?v=g0MB1CCBmsI)
- [Peebles & Xie (2023), Scalable Diffusion Models with Transformers](https://arxiv.org/abs/2212.09748)
- [Rombach et al. (2022), High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)
- [Esser et al. (2024), Scaling Rectified Flow Transformers for High-Resolution Image Synthesis（SD3）](https://arxiv.org/abs/2403.03206)
- [Polyak et al. (2024), Movie Gen: A Cast of Media Foundation Models](https://arxiv.org/abs/2410.13720)

---
title: "CS231N L13：生成模型（一）——自迴歸、VAE 與 GAN 各自在最佳化什麼"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, generative-models, vae, gan]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 15
tldr: "CS231N Spring 2026 的生成模型第一講，先把「判別模型學 p(y|x)、生成模型學 p(x)」講清楚：所有可能的圖片要搶同一份機率質量，所以生成模型能拒絕不合理的輸入。接著用一張分類圖把生成模型分成「算得出 p(x)」和「只能取樣」兩群，再依序講兩個算得出（或近似算得出）的：自迴歸模型用鏈鎖律把 p(x) 拆成逐步預測，太慢是它在原始像素上的死穴；VAE 算不出 p(x)，改成最大化它的下界 ELBO，重建項和先驗項會互相拉扯。課表把 GAN 列在這一講，但 2026 與 2025 的投影片都把 GAN 放到下一講開頭，本文一併整理，讓三種範式在同一篇對照。"
description: "Stanford CS231N（Spring 2026）Lecture 13 導讀：判別與生成模型的差別、生成模型分類圖、最大概似估計、自迴歸模型（PixelRNN/PixelCNN）、自編碼器到 VAE、ELBO 推導與重參數化技巧，以及投影片實際放在 L14 開頭的 GAN（minimax 目標、非飽和損失、DC-GAN、StyleGAN）。公式收在折疊區塊。"
draft: false
glossary:
  - term: "ELBO"
    aliases: ["evidence lower bound", "variational lower bound", "變分下界"]
    definition: "log p(x) 的一個下界：重建項減掉「編碼器輸出和先驗的 KL 散度」。VAE 算不出 p(x) 本身，就改成最大化這個下界。"
    context: "CS231N L13 從貝氏定理一路推到 ELBO，作為 VAE 的訓練目標。"
  - term: "reparameterization trick"
    aliases: ["重參數化技巧"]
    definition: "把「從 N(μ, σ²) 取樣」改寫成「先從 N(0, I) 取 ε，再算 z = μ + σ ⊙ ε」，讓取樣這一步也能對 μ、σ 反向傳播。"
    context: "VAE 訓練時從編碼器輸出的分布取樣 z 需要它。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan-en)

> **來源年份：** 投影片與作業是 Spring 2026；錄影是 Spring 2025（YouTube）。兩者可能有差異，本文以 2026 投影片為準，錄影只當輔助。
>
> 這是 [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)系列的第 15 篇。上一篇是 [L12：自監督學習](/posts/ai/2026-09-30-cs231n-self-supervised-learning)，下一篇是 [L14：生成模型（二）Diffusion](/posts/ai/2026-09-30-cs231n-generative-models-diffusion)。

[CS231N](https://cs231n.stanford.edu/) 2026 年 5 月 14 日那一講是生成模型的上半場。[課表](https://cs231n.stanford.edu/schedule.html)上列了三個主題：Variational Autoencoders、Generative Adversarial Network、Autoregressive Models，建議閱讀是一篇部落格 [ELBO — What & Why](https://yunfanj.com/blog/2021/01/11/ELBO.html)。官方材料是 116 頁的 [lecture_13.pdf](https://cs231n.stanford.edu/slides/2026/lecture_13.pdf)；對應的公開錄影是 [Spring 2025 Lecture 13](https://www.youtube.com/watch?v=zbHXQRUNlH0)。

有一件事要先講清楚：**2026 的 L13 投影片實際只講了自迴歸和 VAE。** 分類圖（第 46–47 頁）把自迴歸與 VAE 標成「Today」、GAN 與 diffusion 標成「Next Time」，最後一頁寫著「Next Time: Generative Adversarial Networks, Diffusion Models」。GAN 的內容在 [lecture_14.pdf](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf) 第 8–35 頁。2025 年的投影片也是同樣的切法。本文照課表和系列規劃把 GAN 一起收進來，並標明它在投影片裡的實際位置；下一篇只從 diffusion 開始。

## 場景：分類器沒辦法說「這張圖不合理」

投影片先回顧一個大家已經很熟的對照（第 14–21 頁）：

- **監督式學習**拿到 (x, y)，學一個 x → y 的函數：分類、偵測、分割、影像描述都算
- **非監督式學習**只拿到 x，要學資料裡隱藏的結構：分群、降維、密度估計

接下來第 23–30 頁用三種機率模型把話說得更精確：

| 模型 | 學什麼 | 誰在搶機率 |
|---|---|---|
| 判別模型 | p(y \| x) | 同一張圖的各個標籤互搶；不同圖片之間不搶 |
| 生成模型 | p(x) | **所有可能的圖片**搶同一份機率質量 |
| 條件生成模型 | p(x \| y) | 每個標籤各自引發一場「所有圖片」的競爭 |

這張表的關鍵在第二欄。判別模型對任何輸入都得吐出一個標籤分布，就算你餵它一張抽象畫，它也只能在「貓」和「狗」之間分配機率。生成模型因為所有圖片共用一份總量為 1 的機率，可以給不合理的圖很小的機率，等於「拒絕」它。投影片的說法是：要做到這件事需要很深的理解，例如狗比較常坐著還是站著？三條腿的狗和三隻手的猴子哪個比較可能？

第 36 頁補了一句實務上的定位：「生成模型」可以指無條件或有條件的版本，**實務上最常見的是條件生成模型**。

為什麼要生成模型？第 37–39 頁的答案是**建模模糊性**：同一個輸入 y 有很多合理的輸出 x 時，就該去建模 P(x | y)。三個例子是語言模型（投影片讓模型寫了一首關於生成模型的押韻短詩）、文字生成圖片、以及給一張圖預測接下來會發生什麼的影片生成。

## 直覺：一張分類圖把生成模型分成兩群

第 46 頁的分類圖改編自 Ian Goodfellow 2017 年的 GAN 教學，是這兩講的地圖：

```text
生成模型
├── 顯式密度（模型能算出 P(x)）
│   ├── 可精確計算：自迴歸模型
│   └── 只能近似：VAE
└── 隱式密度（算不出 p(x)，但能取樣）
    ├── 直接取樣：GAN
    └── 反覆迭代逼近樣本：Diffusion
```

讀這張圖的方式是：越往下，模型越放棄「把 p(x) 寫出來」，換來更好的取樣能力。自迴歸模型老老實實算機率；VAE 算不出來，改算一個下界；GAN 乾脆不算，只要能取樣就好；diffusion 則用很多小步驟慢慢走到樣本。

## 機制一：自迴歸模型——把 p(x) 拆成一連串預測

**最大概似估計。** 第 52 頁先立下目標：寫出一個顯式函數 p(x) = f(x, W)，然後讓訓練資料的機率最大。乘積取 log 變成加總，就得到可以用梯度下降最佳化的損失函數。

**鏈鎖律。** 如果 x 是一個序列 (x₁, …, x_T)，機率的鏈鎖律可以把聯合機率拆成「每一步在前面所有步驟條件下的機率」相乘（第 55 頁）。投影片特別提醒：**這個我們已經看過了**——用 RNN 做語言模型就是這樣。第 56 頁再補一句：LLM 就是自迴歸模型，只是換成 masked Transformer。

<details>
<summary>公式：最大概似與鏈鎖律（第 52、55 頁）</summary>

$$W^* = \arg\max_W \prod_i p(x^{(i)}) = \arg\max_W \sum_i \log f(x^{(i)}, W)$$

$$p(x) = p(x_1, x_2, \dots, x_T) = p(x_1)\,p(x_2 \mid x_1)\,p(x_3 \mid x_1, x_2)\cdots = \prod_{t=1}^{T} p(x_t \mid x_1, \dots, x_{t-1})$$

</details>

**套到圖片上。** 第 58 頁的做法是 [PixelRNN](https://arxiv.org/abs/1601.06759) 與 [PixelCNN](https://arxiv.org/abs/1606.05328) 那一路：把圖片照掃描線順序攤成一串 8-bit 的子像素值，每個子像素當成 256 類的分類問題，用 RNN 或 Transformer 建模。

**死穴是太慢。** 一張 1024×1024 的圖就是 300 萬個子像素的序列。第 59 頁給了一個「先偷跑」的解法：不要把圖片當子像素序列，改成**圖塊（tile）序列**。這條線會在下一講結尾回來（在離散 latent 上做自迴歸），見[下一篇](/posts/ai/2026-09-30-cs231n-generative-models-diffusion)。

## 機制二：從自編碼器到 VAE

**一般的自編碼器。** 第 63–67 頁先講沒有「variational」的版本。目標是不用標註、從輸入 x 抽出有用的特徵 z。沒有標註怎麼訓練？答案是讓解碼器把 z 還原成 x，用 x̂ 和 x 的 L2 距離當損失——「自己編碼自己」。訓練完可以把編碼器拿去做下游任務。

**卡在哪裡。** 第 68–70 頁問：既然解碼器能把 z 變成圖，能不能自己造一個新的 z 來生成圖片？問題是產生新的 z 並不比產生新的 x 容易。解法是：**強迫所有 z 都來自一個已知的分布**。這就是 [VAE](https://arxiv.org/abs/1312.6114)（Kingma & Welling）的出發點。

**VAE 的機率版故事**（第 75–86 頁）：

1. 假設每張訓練圖片 x 是由一個看不到的潛在表示 z 生成的；z 可以想成屬性、方向這類生成 x 的因素
2. 假設 z 的先驗 p(z) 很簡單，例如高斯分布
3. 生成時：從先驗取樣 z，再從條件分布 p(x | z) 取樣 x

訓練的直覺做法是最大概似。但我們看不到 z，只能把 z 積分掉，而**對所有 z 積分做不到**。換用貝氏定理也卡住，因為真正的後驗 p(z | x) 算不出來。解法是**另外訓練一個網路 q(z | x) 去近似 p(z | x)**——這就是編碼器。

**網路怎麼輸出分布？** 第 89–90 頁的答案：網路輸出一個（對角）高斯分布的平均值（和標準差）。解碼器輸出 x 的平均值、變異數固定，所以最大化 log p(x | z) 等於**最小化 x 和網路輸出的 L2 距離**。

<details>
<summary>公式：ELBO 推導（第 92–102 頁）</summary>

從貝氏定理開始，上下同乘 q(z | x)：

$$\log p_\theta(x) = \log \frac{p_\theta(x \mid z)\,p(z)}{p_\theta(z \mid x)} = \log \frac{p_\theta(x \mid z)\,p(z)\,q_\phi(z \mid x)}{p_\theta(z \mid x)\,q_\phi(z \mid x)}$$

取 log 重新整理，因為左邊跟 z 無關，可以包一層對 z ∼ q(z | x) 的期望值：

$$\log p_\theta(x) = \mathbb{E}_{z}[\log p_\theta(x \mid z)] - D_{KL}\big(q_\phi(z \mid x)\,\|\,p(z)\big) + D_{KL}\big(q_\phi(z \mid x)\,\|\,p_\theta(z \mid x)\big)$$

三項分別是：

- **資料重建**：x 經過編碼器、解碼器之後要能還原
- **先驗**：編碼器輸出要貼近 z 的先驗；兩者都是高斯時有封閉解
- **後驗近似**：編碼器輸出要貼近真正的後驗；這一項**算不出來**

KL 散度一定 ≥ 0，把最後一項丟掉就得到下界：

$$\log p_\theta(x) \ge \mathbb{E}_{z \sim q_\phi(z \mid x)}[\log p_\theta(x \mid z)] - D_{KL}\big(q_\phi(z \mid x)\,\|\,p(z)\big)$$

</details>

折疊區塊的最後一行就是 VAE 的訓練目標，叫做**變分下界**，也叫 **Evidence Lower Bound（ELBO）**。編碼器和解碼器一起訓練，讓這個下界越大越好。課表建議的 [ELBO 部落格](https://yunfanj.com/blog/2021/01/11/ELBO.html)開頭就說明了它的角色：把算不出來的推論問題變成可以用梯度方法解的最佳化問題。

**一次訓練迭代**（第 109 頁）：

1. 輸入 x 跑過編碼器，得到 z 的分布
2. 先驗損失：編碼器輸出要接近單位高斯（平均 0、變異數 1）
3. 從編碼器輸出的分布取樣 z，用**重參數化技巧**：先取 ε ∼ N(0, I)，再算 z = ε ⊙ Σ + μ
4. z 跑過解碼器，得到預測的資料平均值
5. 重建損失：預測平均值要在 L2 意義下接近 x

**兩個損失在拔河。** 第 110 頁點出 VAE 最重要的張力：重建損失希望 Σ = 0、每個 x 的 μ 都獨一無二，解碼器才能確定地還原；先驗損失希望 Σ = I、μ = 0，編碼器輸出永遠是單位高斯。訓練出來的模型是兩邊妥協的結果。

**生成與解纏。** 生成時只要從先驗 N(0, I) 取 z、跑一次解碼器（第 111 頁）。因為先驗是對角高斯，z 的各維度彼此獨立，所以單獨改變 z₁ 或 z₂ 會看到不同的變化因素，投影片稱為「disentangling factors of variation」（第 112 頁）。

## 機制三：GAN——放棄 p(x)，只要能取樣（投影片在 L14）

以下內容在 [lecture_14.pdf](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf) 第 8–35 頁，錄影在 [Spring 2025 Lecture 14](https://www.youtube.com/watch?v=Edr4uZFh4EE)。

第 10 頁把前兩種模型放在一起比：自迴歸直接最大化訓練資料的概似，VAE 引入 latent z 並最大化下界。**[GAN](https://arxiv.org/abs/1406.2661) 放棄建模 p(x)，但讓我們能從 p(x) 取樣。**

**設定**（第 15 頁）：資料 x 來自 p_data。引入一個簡單先驗 p(z)，取樣 z 餵給生成器 G，得到 x = G(z)，它服從生成器的分布 p_G。我們想要 p_G = p_data。做法是再訓練一個判別器 D 分辨真假，生成器則靠騙過判別器來學。

**Minimax 遊戲**（第 19–22 頁）：D(x) 是「x 是真的」的機率。判別器想把真資料判成 1、假資料判成 0；生成器想讓假資料被判成 1。兩者用交替的梯度更新訓練。投影片標了一句很重要的話：**我們不是在最小化任何一個整體損失，所以沒有訓練曲線可看。**

**訓練初期梯度會消失**（第 25 頁）：一開始生成器很爛，判別器輕易分辨，D(G(z)) 接近 0，生成器拿到的梯度也接近 0。解法是讓生成器改成最小化 −log D(G(z))，初期就有強梯度。

<details>
<summary>公式：GAN 目標與最佳解（第 19、29 頁）</summary>

$$\min_G \max_D\; \mathbb{E}_{x \sim p_{data}}[\log D(x)] + \mathbb{E}_{z \sim p(z)}[\log(1 - D(G(z)))]$$

交替更新：D ← D + α_D ∂V/∂D，G ← G − α_G ∂V/∂G。

對任何固定的 p_G，內層的最佳判別器是：

$$D^*_G(x) = \frac{p_{data}(x)}{p_{data}(x) + p_G(x)}$$

代回去之後，外層在 p_G = p_data 時達到最小（投影片省略證明）。

</details>

這個最佳解說明目標函數本身是對的，但投影片列了兩個但書：容量固定的網路不一定表示得出最佳的 D 和 G；這個結果也沒說有限資料下會不會收斂到那裡。

**架構演進**（第 31–34 頁）：

- **[DC-GAN](https://arxiv.org/abs/1511.06434)**（Radford et al., ICLR 2016）：G 和 D 通常都是 CNN，它是第一個在非玩具資料上成功的 GAN 架構。投影片還提到 GAN 在 ViT 流行之前就退燒了
- **[StyleGAN](https://arxiv.org/abs/1812.04948)**：更複雜的生成器，用 adaptive normalization 注入雜訊，每一層預測和 x 同形狀的縮放 w 與平移 b
- **潛在空間內插**：GAN 的潛在空間很平滑，在 z₀ 和 z₁ 之間線性內插，生成的圖片也平滑過渡

**GAN 的總結**（第 35 頁）：優點是公式簡單、圖片品質很好；缺點是沒有損失曲線可看、訓練不穩定、很難擴展到大模型和大資料。投影片的定位是：**大約 2016 到 2021 年，GAN 是生成模型的首選。**

## 連回模型：三種範式各自在最佳化什麼

| | 自迴歸 | VAE | GAN |
|---|---|---|---|
| 最佳化目標 | 精確的 log p(x)（鏈鎖律） | p(x) 的下界 ELBO | 和判別器的 minimax 遊戲 |
| 能算 p(x) 嗎 | 能 | 只能近似 | 不能 |
| 怎麼取樣 | 一步一步生成 | 先驗取 z，解碼一次 | 先驗取 z，生成一次 |
| 投影片點出的痛點 | 原始像素上太慢 | 重建與先驗兩個損失互相拉扯 | 沒有損失曲線、不穩定、難擴展 |

這張表也預告了下一講的故事：[diffusion](/posts/ai/2026-09-30-cs231n-generative-models-diffusion) 是分類圖最後一格「反覆迭代逼近樣本」；而現代的 latent diffusion 會把 VAE 和 GAN 都拿回來當零件。自迴歸則在離散 latent 上捲土重來。

作業方面，[A3](https://cs231n.github.io/assignments2026/assignment3/) 沒有 VAE 或 GAN 的題目，生成模型的實作是 Q3 的 DDPM，放在 [A3 導讀](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip)。

## 想深入

**官方材料**

- [lecture_13.pdf](https://cs231n.stanford.edu/slides/2026/lecture_13.pdf)：自迴歸與 VAE，ELBO 推導在第 92–103 頁
- [lecture_14.pdf](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf) 第 8–35 頁：GAN
- [ELBO — What & Why](https://yunfanj.com/blog/2021/01/11/ELBO.html)：課表列的建議閱讀
- 錄影：[Spring 2025 L13](https://www.youtube.com/watch?v=zbHXQRUNlH0)、[Spring 2025 L14](https://www.youtube.com/watch?v=Edr4uZFh4EE)

**站內延伸閱讀**（各自完整，重疊部分不刪）

- [CMU 11-785 Lecture 22：VAE](/posts/ai/2026-08-22-cmu-11785-22-variational-autoencoders)、[Lecture 24：GAN](/posts/ai/2026-08-22-cmu-11785-24-gans)
- [MIT 6.S191 Lecture 4：生成模型](/posts/ai/2026-08-22-mit-6s191-l04-generative-modeling)
- [CS230：Adversarial Robustness and Generative Models](/posts/ai/2026-08-16-cs230-adversarial-and-generative)

## 存取限制

依[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的分級，這門課是 **A3**：2026 投影片、作業與課程筆記公開，另有 2025 完整錄影。本講的缺口是 2026 錄影只放在 Canvas、限修課生觀看；期中考（5 月 12 日，本講前兩天）題目不公開。

## 參考資料

- [Stanford CS231N 課程首頁（Spring 2026）](https://cs231n.stanford.edu/)
- [CS231N Spring 2026 課表](https://cs231n.stanford.edu/schedule.html)
- [CS231N Spring 2026 Lecture 13 投影片](https://cs231n.stanford.edu/slides/2026/lecture_13.pdf)
- [CS231N Spring 2026 Lecture 14 投影片](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf)
- [CS231N Spring 2025 課表](https://cs231n.stanford.edu/2025/schedule.html)
- [YouTube：CS231N Spring 2025 Lecture 13: Generative Models 1](https://www.youtube.com/watch?v=zbHXQRUNlH0)
- [YouTube：CS231N Spring 2025 Lecture 14: Generative Models 2](https://www.youtube.com/watch?v=Edr4uZFh4EE)
- [Yunfan's Blog, ELBO — What & Why（課表建議閱讀）](https://yunfanj.com/blog/2021/01/11/ELBO.html)
- [CS231N Assignment 3（Spring 2026）](https://cs231n.github.io/assignments2026/assignment3/)
- [Kingma & Welling, Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114)
- [Goodfellow et al., Generative Adversarial Nets](https://arxiv.org/abs/1406.2661)
- [van den Oord et al., Pixel Recurrent Neural Networks](https://arxiv.org/abs/1601.06759)
- [van den Oord et al., Conditional Image Generation with PixelCNN Decoders](https://arxiv.org/abs/1606.05328)
- [Radford et al., DC-GAN](https://arxiv.org/abs/1511.06434)
- [Karras et al., A Style-Based Generator Architecture for GANs](https://arxiv.org/abs/1812.04948)

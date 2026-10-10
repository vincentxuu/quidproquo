---
title: "CMU 10-423 L8–L9：變分推論、VAE 與擴散模型的 ELBO"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai, vae, variational-inference, elbo, diffusion-model]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 8
tldr: "VAE 和擴散模型都卡在同一個地方：log p_θ(x) 要對潛變數積分，算不出來。L8–L9 的解法是變分推論：找一個好算的 q 去逼近真實後驗，把「最小化 KL」換成「最大化 ELBO」，而 ELBO 正好是 log p(x) 的下界。VAE 再加上 Monte Carlo 估計與 reparameterization trick，就能用一次前向、一次反向訓練；DDPM 的 ELBO 拆開後，每一項都是在要求學到的反向一步貼近封閉形式的 q(x_{t−1} | x_t, x₀)。"
description: "CMU 10-423/623 Generative AI（Spring 2026）Lecture 8 後半與 Lecture 9 的 VAE 部分導讀：DDPM 的取樣與 ELBO 目標、autoencoder 為何不能取樣、KL divergence 的行為、變分推論與 ELBO、ELBO 為何是下界、Monte Carlo 估計、reparameterization trick、VAE 的六步推導與實作、Kingma & Welling 與 Bowman 的實驗、VQ-VAE，以及 VAE 與擴散模型的連結。"
draft: false
glossary:
  - term: "ELBO"
    aliases: ["Evidence Lower BOund", "證據下界"]
    definition: "ELBO(q) = E_q[log p(x, z)] − E_q[log q(z | x)]。對任何 q 都有 log p(x) ≥ ELBO(q)，差距正好是 KL(q(z | x) ‖ p(z | x))，所以最大化 ELBO 等於最小化這個 KL，也等於推高 log p(x) 的下界。"
    context: "10-423 L9 用它訓練 VAE，L8 用它推導 DDPM 的目標函數。"
  - term: "reparameterization trick"
    aliases: ["重參數化技巧"]
    definition: "把 z ~ N(μ_φ(x), σ_φ(x)²) 改寫成 z = μ_φ(x) + σ_φ(x) ⊙ ε、ε ~ N(0, I)，讓隨機性只來自與參數無關的 ε，梯度就能穿過 z 傳回編碼器。"
    context: "L9 用來降低 VAE 梯度估計的變異數；L7 的 x_t = √ᾱ_t x₀ + √(1 − ᾱ_t) ε 是同一招。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-variational-inference-vae-en)

> **版本說明**：本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026。主要材料是 [Lecture 8 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture8-diffusion-vae.pdf)（Diffusion Part II + Intro to VAEs，2 月 9 日）與 [Lecture 9 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl.pdf)的 VAE 部分（2 月 11 日，Matt Gormley 主講；另有[手寫註記版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl-ink.pdf)）。L9 後半的 zero-shot／few-shot 與 prompting 留到第 10 篇。readings 依[講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)，列在 L8 之下。事實皆於 2026-09-30 打開官方材料核對。存取等級 **A3**：投影片、作業與練習考卷公開；課堂錄影在 CMU Panopto，校外看不到。

**系列位置**：上一篇 [L7：擴散模型入門](/posts/ai/2026-09-30-cmu10423-diffusion-models)｜下一篇 [HW2：從零實作 DDPM](/posts/ai/2026-09-30-cmu10423-hw2-ddpm)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

這是整個系列數學最陡的一篇。先給一句直覺：**VAE 和擴散模型都在最大化同一種下界。** 兩者都有潛變數，都算不出 log p_θ(x)，也都改去推高一個算得出來、而且保證比 log p_θ(x) 小的量——ELBO。L7 說「讓學到的反向一步貼近 q(x_{t−1} | x_t, x₀)」，理由就在這裡。

如果機率與高斯的基礎還不熟，可以先讀 [MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)的前置知識段落，再回來。所有推導都收在可展開的區塊裡，第一次讀可以先跳過。

## 課程影片來源

官方課站將 Spring 2026 錄影放在 SCS Panopto；匿名頁面未載入影片並提示登入。本文依公開投影片與作業導讀，錄影需依課程授權存取。

課程與錄影入口：

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## L8 前半：把擴散模型收尾

L8 開頭複習 L7 的 U-Net、前向與反向過程、三個性質和三種參數化，接著補完兩件事。

**訓練演算法的四個版本**：選項 A 先示範「每張圖把所有 T 個時間點都算一遍再更新」，再改成「每張圖隨機抽一個 t」；選項 B 讓網路預測 x₀；選項 C 預測雜訊 ε，並再次強調 C 在經驗上最好。投影片還附了兩頁訓練時的計算圖。

**取樣演算法**：從 x_T ~ N(0, I) 開始倒數，每一步抽一個新的 ε，用網路算出均值 μ̂_t，令 x_{t−1} = μ̂_t + σ_t ε。三種參數化只差在 μ̂_t 怎麼算：A 直接輸出、B 先預測 x₀ 再組合、C 先用 ε_θ 估出 x̂₀ 再組合。

然後投影片回到 L7 留下的問題：為什麼「貼近 q(x_{t−1} | x_t, x₀)」是對的目標？答案是 DDPM 的目標函數本身就是 ELBO，其中的 L_{t−1} 項是一個 KL divergence，要求兩個條件分布盡量接近（投影片第 28 頁，公式取自 [Ho et al. 2020](https://arxiv.org/abs/2006.11239)）。要看懂這句話，得先學變分推論——這就是 L8 後半與 L9 的工作。

## VAE 之前要準備的七件事

L8 與 L9 都列了同一張清單：

1. Autoencoder（不是變分的那種）
2. KL divergence
3. 變分推論（以 KL 為目標）
4. Monte Carlo 估計（近似期望值）
5. （Score function trick）
6. Reparameterization trick（降低變異數）
7. Stochastic Gradient Variational Bayes

第 5 項在清單上加了括號；公開的講義版 PDF 裡沒有對應的章節頁，本文也不展開。

## 為什麼普通的 autoencoder 不夠

Autoencoder 由編碼器 z = ENCODER(x) 和解碼器 x' = DECODER(z) 組成，訓練目標是重建誤差 ‖x − DECODER(ENCODER(x))‖²，用途是學一個低維表示。問題是它**沒有定義機率分布**：從潛空間取樣，等於只在訓練樣本的重建之間挑。VAE 則學一個連續、容易取樣的潛空間，可以生成新資料。

## KL divergence 的脾氣

KL(q ‖ p) = E_q[log q(x)/p(x)]，衡量兩個分布有多接近；它不對稱，在 q = p 時最小。投影片用三個例子說明「用 KL(q ‖ p) 當目標」會發生什麼：

- 在 q 機率高的地方，如果 p 很低，KL 會大幅增加——所以 KL **堅持** q 高的地方要近似得好。
- 在 q 機率低的地方，近似差一點影響很小——KL **不在乎**這些地方。
- 第三個例子用一個有相關性的 2D 高斯 p，問「各維度獨立的 q」哪一個最小化 KL，結果以圖呈現。

這個性質在變分推論裡很重要：q 會傾向待在 p 的高機率區域裡，而不是把 p 整個蓋住。

## 變分推論：從 KL 換到 ELBO

變分推論的設定分四步：

1. **目標**：估計後驗 p_θ(z | x)，假設它算不出來。
2. **近似**：用另一個分布 q_φ(z | x) ≈ p_θ(z | x)。例如 mean field 近似把 q 拆成各變數獨立的乘積。
3. **最佳化問題**：挑一個讓 KL(q ‖ p) 最小的 q。
4. **演算法**：例如用梯度下降最佳化替代目標 ELBO。

麻煩是這個 KL 本身也算不出來：把它展開後會出現 log p(x)，而 p(x) 正是我們一開始就算不出來的東西。好在 log p(x) 不依賴 q，丟掉它不影響「哪個 q 最好」，剩下的部分取負號就是 ELBO。

<details>
<summary>從 KL 推到 ELBO，以及 ELBO 為何是下界（L9 投影片第 22–25 頁）</summary>

```text
KL(q(z|x) ‖ p(z|x))
  = E_q[log q(z|x)] − E_q[log p(z|x)]
  = E_q[log q(z|x)] − E_q[log p(x, z)] + E_q[log p(x)]
  = E_q[log q(z|x)] − E_q[log p(x, z)] + log p(x)     ← log p(x) 不依賴 q

定義 ELBO(q) = E_q[log p(x, z)] − E_q[log q(z|x)]

⇒ argmin_q KL = argmax_q ELBO
⇒ log p(x) = ELBO(q) + KL(q ‖ p) ≥ ELBO(q)            ← 因為 KL ≥ 0
```

</details>

投影片對 ELBO 兩項的解讀是：第一項在 q 把機率放在 p 也放機率的 z 上時會高；第二項是 q 的熵，q 越分散越高。三個結論：

1. 變分推論找的是讓 p(z | x) 的正規化常數下界最緊的 q；
2. 最大化 ELBO 等於最小化 KL；
3. 最大化 ELBO 就是在最大化概似 p(x) 的下界。

## Monte Carlo 估計與 reparameterization trick

ELBO 裡有期望值，要怎麼算？用 **Monte Carlo 估計**：從 p 抽 S 個樣本，對 f 取平均。投影片的例子是用單位正方形裡的隨機點估計 π，S 從 100 增加到 1,000,000，誤差逐漸變小。這個估計量是不偏的，變異數以 σ²/S 縮小；收斂速率與維度無關，但 σ² 本身在高維問題裡可能大到不實用。

下一個問題是：z 是從 q_φ 抽出來的，隨機取樣這一步沒辦法反向傳播。**Reparameterization trick** 把取樣改寫成 z = μ_φ(x) + σ_φ(x) ⊙ ε、ε ~ N(0, I)，z 變成參數的可微函數，隨機性只來自獨立的 ε。投影片用一維與多維高斯各畫一次「改寫前後」的計算圖；L9 引用的 [Doersch 2016](https://arxiv.org/abs/1606.05908) Figure 4 也是同一件事：左邊的網路因為有不可微的取樣節點而無法反向傳播，右邊可以。

## VAE：兩個網路、一個目標

VAE 的模型是：先驗 p_θ(z) = N(0, I)；解碼器 p_θ(x | z) 是高斯，均值和變異數由一個 MLP 算出；編碼器 q_φ(z | x) 也是高斯，同樣由神經網路算出均值和變異數。投影片提醒，θ、φ 是神經網路參數，不是傳統變分推論裡每筆資料各自一套的變分參數。

投影片把推導寫成「六個問題、六個解法」：

| 問題 | 解法 |
|---|---|
| 1. autoencoder 不能取樣 | 定義一個可以取樣的解碼器 p_θ(x \| z) |
| 2. 對這個解碼器做 MLE 需要積分，算不出來 | 引入編碼器 q_φ(z \| x)，改最大化 ELBO |
| 3. 交替更新 φ（推論）和 θ（學習）太慢 | 用隨機梯度上升同時更新 θ、φ |
| 4. ELBO 的第一項期望值算不出來 | Monte Carlo 估計 |
| 5. 直接估計的梯度變異數很高（SGVB 的老問題） | 先 reparameterize 再做 Monte Carlo |
| 6. 實際怎麼實作 | 每張圖只取 S = 1 個樣本，見下方 |

<details>
<summary>VAE 的單步實作（L9 投影片第 53 頁）</summary>

```text
給定一張訓練圖 x^(i)，取 S = 1：
  ε^(1) ~ N(0, I)
  用編碼器 MLP 算出 μ_φ(x) 與 σ_φ(x)
  z^(1) = μ_φ(x) + σ_φ(x) ⊙ ε^(1)
  ℓ(θ, φ) = log p_θ(x^(i) | z^(1)) − KL( q_φ(z | x^(i)) ‖ p_θ(z) )
  對 ℓ 反向傳播，更新 θ, φ
```

</details>

ELBO 在這裡寫成兩項：重建項 E_q[log p_θ(x | z)]，以及把編碼器拉向先驗的 KL 項。

## VAE 能做什麼

「VAE Results」一節列了幾個代表工作：

- **[Kingma & Welling 2014](https://arxiv.org/abs/1312.6114)**：提出 VAE 並用在圖片生成，編碼器與解碼器都是單隱藏層的全連接網路，編碼器用對角共變異數的高斯。
- **Bowman et al. 2015**：把 VAE 用在離散的文字資料，編碼器是 LSTM，解碼器是 LSTM 語言模型。
- **VQ-VAE**（van den Oord et al.）：學一本連續的 codebook，但編碼器輸出離散的 code，解碼器以 code 為條件生成；投影片附了生成語音的例子。
- **VQ-VAE-2**（Razavi et al. 2019）：學上下兩層潛變數，並對潛空間學一個強先驗，高解析度樣本也很逼真。VQ-VAE 在 HW4 的書面題會再出現。

最後一頁把 VAE 和 DDPM 的圖並排，接回「GAN → VAE → Diffusion」那張對照表。

## 回到擴散模型：DDPM 的 ELBO

有了 ELBO，L7 的直覺就能說清楚。把擴散模型看成潛變數為 x₁…x_T 的模型、前向過程當成一個**沒有可學參數**的編碼器，ELBO 拆開後大致有三類項：x_T 的先驗項、每個時間點的 L_{t−1}、最後一步的重建項。

- 先驗項不含可學參數，因為 noise schedule 固定、p(x_T) = N(0, I)。
- 每個 L_{t−1} 是 KL(q(x_{t−1} | x_t, x₀) ‖ p_θ(x_{t−1} | x_t))——這就是 L7 說的「貼近封閉形式的後驗」。
- 兩邊都是高斯、變異數又固定成 σ_t² 時，這個 KL 只剩均值的平方距離；再用 ε 參數化，就得到 L7 選項 C 的損失 ‖ε − ε_θ(x_t, t)‖²（DDPM 論文把權重拿掉的版本稱為 simplified objective）。

<details>
<summary>DDPM 論文中的 ELBO 分解（Ho et al. 2020，eq. 5、8、14）</summary>

```text
L = E_q[ KL(q(x_T | x_0) ‖ p(x_T))                           ← L_T
       + Σ_{t>1} KL(q(x_{t−1} | x_t, x_0) ‖ p_θ(x_{t−1} | x_t)) ← L_{t−1}
       − log p_θ(x_0 | x_1) ]                                 ← L_0

Σ_θ = σ_t² I 時：
L_{t−1} = E_q[ ‖μ̃_t(x_t, x_0) − μ_θ(x_t, t)‖² / (2σ_t²) ] + C

以 ε 參數化並拿掉權重：
L_simple = E_{t, x_0, ε}[ ‖ε − ε_θ(√ᾱ_t x_0 + √(1 − ᾱ_t) ε, t)‖² ]
```

</details>

[HW2](/posts/ai/2026-09-30-cmu10423-hw2-ddpm) 第 6.1 題「ELBO Surgery」（5 分）要你自己證明這個 ELBO 的另一種拆法；本文不提供解答。

## 這兩講在作業與考試裡的位置

- HW2（總分 60）：第 5 題 VAE 6 分（重建項的 Monte Carlo 估計、影片 VAE 的損失計算、β-VAE），第 6 題 Understanding Diffusion Models 14 分（ELBO Surgery、L_t 的作用、reparameterization 等）。
- Quiz 2（2 月 16 日）範圍是 L5–L9，但 L9 只考 VAE 部分。
- [練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)第 7 大題 VAE 8 分、第 8 大題 Diffusion 8 分，附[解答](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)。

## 自學怎麼做

1. 先讀 [Jason Eisner 的變分推論高階說明](https://www.cs.jhu.edu/~jason/tutorials/variational.html)，建立「用好算的 q 逼近難算的 p」的直覺。
2. 自己推一次上面「從 KL 推到 ELBO」的四行，確定每一步用的是哪條機率規則。
3. 讀 [Doersch 2016](https://arxiv.org/abs/1606.05908) 的 VAE 教學，對照投影片的六步推導表。
4. 想要完整的數學與 mean field 的例子，讀 [Blei, Kucukelbir & McAuliffe 2018](https://arxiv.org/abs/1601.00670)。
5. 在 MNIST 上寫一個最小 VAE，實作投影片第 53 頁的單步流程；再把 DDPM 論文的 eq. 5 對照 L7 的選項 C 讀一次。

## 延伸閱讀

- [MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)與 [Lab 3：DiT、VAE 與 latent diffusion](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion)——擴散與 VAE 的另一套數學語言
- [CMU 11-785 導讀：變分自編碼器](/posts/ai/2026-08-22-cmu-11785-22-variational-autoencoders)
- [Stanford CS231n 導讀：生成模型（VAE 與 GAN）](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CMU 10-423/623/723 Generative AI 課程首頁（Spring 2026）](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [講次表（Schedule）](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)——L8、L9 日期、標題與 readings
- [Lecture 8 投影片：Diffusion Models（Part II）+ Intro to VAEs](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture8-diffusion-vae.pdf)
- [Lecture 9 投影片：VAEs + Zero-shot vs. Few-shot](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl.pdf)與[手寫註記版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl-ink.pdf)
- [Coursework 頁](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)與 [HW2 handout（zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw2.zip)——VAE 與 Diffusion 題的配分
- [Practice exam（Spring 2026）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)與[解答](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Blei, Kucukelbir & McAuliffe, Variational Inference: A Review for Statisticians](https://arxiv.org/abs/1601.00670)——講次表 reading
- [Jason Eisner, High-Level Explanation of Variational Inference（2011）](https://www.cs.jhu.edu/~jason/tutorials/variational.html)——講次表 reading
- [Carl Doersch, Tutorial on Variational Autoencoders（2016）](https://arxiv.org/abs/1606.05908)——講次表 reading
- [Ho, Jain & Abbeel, Denoising Diffusion Probabilistic Models（NeurIPS 2020）](https://arxiv.org/abs/2006.11239)——L7 reading，L8 的 DDPM 目標函數出處
- [Kingma & Welling, Auto-Encoding Variational Bayes（ICLR 2014）](https://arxiv.org/abs/1312.6114)——投影片 VAE Results 引用

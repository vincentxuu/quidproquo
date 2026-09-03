---
title: "MIT 6.7960 L14：生成模型基礎 —— 密度／能量模型、GAN、自回歸與擴散"
date: 2026-08-30
category: tech
type: guide
tags:
  - mit-67960
  - deep-learning
  - generative-model
  - gan
  - diffusion
  - autoregressive
  - fall-2024
lang: zh-TW
description: "MIT 6.7960 Fall 2024 OCW 第 14 講（Phillip Isola）：生成模型的全家桶——密度模型、能量模型與其採樣器、GAN、自回歸模型，以及擴散模型的直覺。"
tldr: "生成模型本質是在學資料的分佈 p(x)。密度模型直接建模機率，能量模型用一個未歸一化勢能 + 採樣器，GAN 讓判別器逼出逼真樣本，自回歸一步步預測下一個 token，擴散則用『逐步加噪再學去噪』繞開棘手的最大似然。"
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 16
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 23
---

> 🌏 [English version](/posts/tech/2026-12-03-mit-67960-l14-generative-basics-en)

> **教材版本**：基於 **MIT 6.7960 Fall 2024 OCW**。影片、投影片、作業全公開於 [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)。本講由 **Phillip Isola** 授課，必讀材料為 *Generative Models*。

---

## 生成模型的終極目標

所有生成模型都在做同一件事：**學會資料的分佈 `p(x)`**，使得從這個分佈裡採樣，就能造出和訓練資料「同類但全新」的樣本。差別只在「怎麼表示、怎麼訓練、怎麼採樣」。

## 密度模型：直接建模機率

最直觀的是**顯式密度模型**：參數化 `p_θ(x)` 並最大化訓練資料的對數似然 `log p_θ(x)`。

- **自回歸模型（autoregressive）**：把 `p(x)` 拆成 `p(x_1)·p(x_2|x_1)·…·p(x_n|x_<n)`，一步一步預測下一個元素。PixelCNN 對影像逐像素生成就是這種。優點是似然可精確計算、訓練穩定；缺點是生成慢（必須串行）。
- **歸一化流（normalizing flow）**：用一連串可逆變換把簡單分佈映到複雜分佈，似然仍可精確算。

## 能量模型：先定義「像不像」，再採樣

**能量模型（EBM）** 不直接給機率，而是定義一個能量函數 `E_θ(x)`，使得

```
p_θ(x) = exp(−E_θ(x)) / Z_θ        （Z_θ 是難以計算的歸一化常數）
```

`E_θ(x)` 低的地方 = 資料密集處 = 高機率。問題在 `Z_θ` 通常是個高維積分，算不出來。所以能量模型**訓練和採樣分家**：

- 訓練：用對比散度（contrastive divergence）之類的方法，只比較「真實樣本能量低、生成的樣本能量高」，繞開 `Z_θ`。
- 採樣：用 Langevin dynamics / MCMC，沿著 `−∇E` 往低能量處走，再加大氣噪聲避免卡住。

能量模型的魅力是表達力強、不需要可解的密度形式；代價是採樣慢且訓練不穩。

## GAN：讓判別器逼出逼真樣本

**GAN** 用一個對抗遊戲繞開顯式密度：生成器 `G` 造假樣本，判別器 `D` 分辨真假，兩者零和博弈。

```
min_G max_D  E[log D(x)] + E[log(1 − D(G(z)))]
```

訓練穩定後，`G` 產出的樣本在視覺上極其逼真（這是 GAN 的強項）。但代價是**訓練脆弱**：mode collapse（只生成少數幾種樣式）、梯度消失、超參敏感。後來的 WGAN、spectral norm、GAN 的穩定技巧都是在補這些洞。

## 擴散模型：逐步加噪，再學去噪

**擴散模型（DDPM）** 是近幾年最強的圖像生成方法，思路很優雅：

1. **前向過程**：對真實樣本逐步加高斯噪聲，T 步後變成純噪聲。
2. **反向過程**：訓練一個網路 `ε_θ(x_t, t)` 預測「這一步加的噪聲是多少」，等價於學會去噪。
3. **採樣**：從純噪聲出發，反覆預測並扣掉噪聲，一步步還原出清晰樣本。

它繞開了最大似然裡棘手的歸一化常數，訓練目標只是簡單的「預測噪聲」MSE，卻能生成極高品質的影像。代價是採樣要跑很多步（雖然後來有 DDIM 等加速）。

PyTorch 風格的訓練目標（簡化）：

```python
def diffusion_loss(net, x0, t, sqrt_alphas_cumprod, sqrt_1_m_alphas):
    noise = torch.randn_like(x0)
    x_t = sqrt_alphas_cumprod[t] * x0 + sqrt_1_m_alphas[t] * noise  # 加噪
    pred_noise = net(x_t, t)
    return F.mse_loss(pred_noise, noise)                            # 預測噪聲
```

## 怎麼選

- 要**算得出似然、要穩定**：自回歸 / flow。
- 要**影像逼真度極致**：GAN（但難訓）或擴散（穩定且高品質）。
- 要**表達任意複雜分佈、不侷限密度形式**：能量模型。
- 要**文字這種離散序列**：自回歸（今天的大語言模型就是它）。

下一批（L15、L16）會深入 VAE 與條件生成（text-to-image、image-to-text 等），把生成模型接回「可控」的需求。

## 參考資料

- MIT 6.7960 OCW（Fall 2024）：[課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Goodfellow et al., *Generative Adversarial Networks (GAN)*：[arXiv:1406.2661](https://arxiv.org/abs/1406.2661)
- Ho et al., *Denoising Diffusion Probabilistic Models (DDPM)*：[arXiv:2006.11239](https://arxiv.org/abs/2006.11239)
- Van den Oord et al., *Conditional Image Generation with PixelCNN*：[arXiv:1606.05328](https://arxiv.org/abs/1606.05328)

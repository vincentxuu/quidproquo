---
title: "擴散模型：正向加噪、反向生成與 ELBO"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, generative-models, diffusion-models, elbo, score-matching]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 15
tldr: "第 14 章從固定的高斯加噪 Markov chain 出發，學習逐步反轉每個 transition；ELBO 把 reverse-kernel matching 化成加權雜訊預測，連續時間觀點則用 score ∇log p_t 解釋反向漂移。"
description: "CS229 2026 主講義第 14 章導讀：forward diffusion、closed-form noising、Gaussian reverse kernels、ELBO、noise-prediction loss、sampling 與 reverse-time SDE。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-14-diffusion-models-en)

這是 [CS229 Lecture Notes](https://cs229.stanford.edu/main_notes.pdf) 2026 版第 14 章（印刷頁 180–190）的逐章導讀，依官方主講義整理，**不是任何一學期錄影或課表的重建**。本章進入生成模型：先設計一條把資料變成高斯雜訊的固定路徑，再學習反方向每一步如何去噪。

## 正向過程把困難分布逐步洗成高斯

令 $x_0\sim p_{data}$。正向 diffusion 是固定 Markov chain：

$$
q(x_t\mid x_{t-1})=
\mathcal N\!\left(x_t;\sqrt{1-\beta_t}x_{t-1},\beta_tI\right).
$$

每一步先把前一狀態縮小，再加少量獨立高斯雜訊。定義 $\alpha_t=1-\beta_t$、$\bar\alpha_t=\prod_{s=1}^t\alpha_s$，可把多步結果壓成一次取樣：

$$
x_t=\sqrt{\bar\alpha_t}x_0+
\sqrt{1-\bar\alpha_t}\epsilon,\qquad
\epsilon\sim\mathcal N(0,I).
$$

這個 closed form 是訓練可行的關鍵：不必真的逐步跑到隨機時間 $t$，就能直接從乾淨資料合成 $x_t$。當 $\bar\alpha_T$ 接近零，末端分布接近球形高斯。正向過程不是模型學出來的；設計 noise schedule 後，它就是已知的資料破壞機制。

## 生成模型學的是未知反向 kernel

在真實正向 joint distribution 下，可由 Bayes rule 定義 $q(x_{t-1}\mid x_t)$，但它依賴未知的資料分布。模型以神經網路輸出的平均近似每個反向條件分布：

$$
p_\theta(x_{t-1}\mid x_t)=
\mathcal N\!\left(x_{t-1};\mu_\theta(x_t,t),\sigma_t^2I\right).
$$

生成時從 $x_T\sim\mathcal N(0,I)$ 開始，依序取樣 $x_{T-1},\ldots,x_0$。時間 $t$ 必須餵給網路，因為同一個 $x_t$ 在不同噪音層級下需要不同去噪尺度。固定等向 covariance 是參數化選擇；講義也指出 variance 可以學習。

## ELBO 把路徑 likelihood 拆成逐步 matching

直接積分隱藏路徑 $x_{1:T}$ 以計算 $p_\theta(x_0)$ 不可行。沿用第 11 章的 variational 方法，以已知正向路徑 $q(x_{1:T}\mid x_0)$ 作輔助分布，得到 likelihood 的 ELBO。利用 Markov factorization，KL 可拆成末端 prior matching、各步
$q(x_{t-1}\mid x_t,x_0)$ 對 $p_\theta(x_{t-1}\mid x_t)$ 的 matching，以及最後重建 $x_0$ 的項。

條件在 $x_0$ 上時，正向鏈全部是聯合高斯，因此真實一步後驗也為高斯。若模型與後驗使用同 covariance，KL 就化為兩個 mean 的加權平方距離。再把 $x_0$ 用前面的 closed-form noising 改寫，預測後驗平均等價於預測加入的雜訊：

$$
\mathcal L_t(\theta)=
\|\epsilon-\epsilon_\theta(x_t,t)\|_2^2.
$$

完整 ELBO 對不同時間步有推導出的權重，實務常捨去權重、直接訓練上述簡化目標。簡化損失有效不代表它與原 ELBO 完全相同；它改變了不同 noise level 的相對重要性。

## 訓練與取樣是不對稱的

訓練一次只需抽乾淨樣本、時間步與高斯雜訊，直接合成 $x_t$，再讓網路預測那份雜訊。不同時間步可以獨立抽樣，因此高度平行。

取樣則從 $T$ 走回 0，每一步依賴上一步結果：先由 $\epsilon_\theta(x_t,t)$ 組出 $\mu_\theta$，再加入適量高斯隨機性；最後一步通常不再加噪。這說明擴散模型的典型取捨：訓練目標簡潔穩定，逐步生成卻可能昂貴。

## 連續時間為何出現 score

講義最後把正向過程寫成 stochastic differential equation

$$
dX_t=f(X_t,t)dt+g(t)dW_t.
$$

反向時間仍是一個 diffusion，但 drift 多出 $g(t)^2\nabla_x\log p_t(x)$。這個 score 指向當前時間邊際密度增加最快的方向，修正「單純把原 drift 倒放」的不足。它解釋了兩件事：小時間步下反向 transition 為何仍近似高斯，以及 score-based modeling 為何與 diffusion model 共享同一數學骨架。

這部分依賴適當的平滑與正則條件；章中給的是 informal theorem 與一維小步推導，不應誤讀成對所有資料分布與離散實作無條件成立。

## 與前後章的關係

本章直接重用第 11 章 ELBO，把整條 noise trajectory 視為隱變數。它也是課程從古典非監督式學習跨入現代生成模型的橋。下一章將轉向 foundation models：生成分布不再是終點，而是大規模預訓練後如何以 linear probe、fine-tuning 或 LoRA 適配下游任務。

## 自學練習

選一張已正規化的小影像與三個 $\bar\alpha_t$ 值，對同一張影像各抽一份 $\epsilon$，用 closed-form 公式產生 $x_t$。接著假裝模型完美知道 $\epsilon$，從 $x_t$ 代數解回 $x_0$。最後替 $\epsilon$ 加入小誤差，觀察在低訊噪比時間步中，重建誤差如何被放大。

## 參考資料

- [CS229 Lecture Notes（2026）第 14.1 節：正向 diffusion 與 closed-form noising](https://cs229.stanford.edu/main_notes.pdf#page=181)
- [CS229 Lecture Notes（2026）第 14.2 節：反向生成 kernel](https://cs229.stanford.edu/main_notes.pdf#page=184)
- [CS229 Lecture Notes（2026）第 14.3–14.4 節：ELBO、雜訊預測與 reverse-time SDE](https://cs229.stanford.edu/main_notes.pdf#page=185)

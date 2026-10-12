---
title: "擴散模型：加噪的過程要怎麼倒著學回來｜Stanford CS229 第 11 堂"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, diffusion-model, elbo, generative-models]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 11
tldr: "前向過程每一步把資料乘上 √(1−β_t) 再加變異數 β_t 的高斯雜訊，展開後 x_t = √ᾱ_t·x_0 + √(1−ᾱ_t)·ε̂_t，不必學。反向用高斯 p_θ(x_{t−1}|x_t) 去學，把上一堂的 ELBO 套在整條軌跡上，再用 KL 連鎖律拆開，每一步的損失是 ‖μ̃_t(x_t,x_0) − μ_θ(x_t,t)‖²/(2β̃_t)。這堂停在這個式子，化簡成預測雜訊留到第 12 堂。"
description: "Stanford CS229 Spring 2026 第 11 堂導讀：擴散模型的前向加噪、一步到位公式、反向過程的高斯參數化、連續時間觀點，以及用 ELBO 與 KL 連鎖律推出逐步去噪損失的完整推導與數值例子。"
draft: false
math: true
---

> 🌏 [English version](/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models-en)

**影片狀態：已附影片。** 這篇依 Stanford Online 公開的 Spring 2026 第 11 堂錄影的英文字幕寫成，公式記號對照 2026 主講義第 14 章；沒看到板書畫面，板書上的式子是靠字幕前後文與講義還原的。文中的時間是字幕段落的起點，跟實際畫面可能差幾十秒。

這是 [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)系列的第 11 堂，講者是 Tengyu Ma。他一開場就說調動了課程順序，把擴散模型提前，因為它用到的工具跟上週 Chris Ré 講的 EM 演算法很接近。所以[上一堂](/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca)才講完 EM 和 PCA，這一堂就直接跳進生成模型。

從 PCA 跳過來，真正要帶著的東西其實是上一堂前半的 EM，而且只需要三樣：

- **隱變數與 ELBO**：有看不到的變數 $z$ 時，$\log p(x;\theta)$ 沒辦法直接最大化，改成最大化它的下界 $\mathbb E_{z\sim Q}[\log p(x\mid z;\theta)]-\mathrm{KL}(Q\,\Vert\,p_z)$。
- **KL 散度的定義**：$\mathrm{KL}(Q\,\Vert\,P)=\mathbb E_{Q}[\log (Q/P)]$。
- **高斯分布的兩個性質**：獨立高斯的線性組合還是高斯、聯合高斯取條件還是高斯。

PCA 本身這堂用不到。讀完這篇，你應該能自己寫出前向過程一步到位的公式、解釋反向過程為什麼用高斯去參數化，並且從 ELBO 一路推到每一步的去噪損失。

```youtube
url: https://www.youtube.com/watch?v=dqUMCzWjZSI
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 11: Diffusion Models
captions: en
```

## 這堂要解的問題：從資料分布取樣

（錄影 00:00–05:50）

任務很抽象也很單純：有一個資料分布 $p_{\text{data}}$（想成「所有自然影像」的分布），手上只有從它抽出來的樣本，要訓練一個模型，讓模型自己能抽出新的、看起來來自同一個分布的樣本。記號上，乾淨的資料一律寫成 $x_0\sim p_{\text{data}}$，$x_0\in\mathbb R^d$。

講者先交代這個方法的地位。影像生成以前用 GAN 和變分自編碼器（VAE），現在擴散模型是主流，課程也因此調整：

> "And now diffusion model is the predominant approach, I think, is much better than both GANs and variational autoencoders. And that's why we don't teach GANs and variational autoencoders anymore."（約 01:06）

他補充講義裡還留著 VAE 的章節，有興趣可以自己讀。應用也不限於影像：影片、機器人（他說多數 vision-language-action 模型用擴散模型產生動作），語言方面他提到 Stefano Ermon 有幾篇論文和一家新創在做，賣點是擴散模型可以平行生成，推論可能比自迴歸模型快。這些是背景，他明講不必每個細節都懂。

生成時的做法是倒著走一條馬可夫鏈。先抽一個純雜訊 $x_T$（想成每個像素的 RGB 都是亂數），套一次模型得到 $x_{T-1}$，再套一次得到 $x_{T-2}$，一路走到 $x_0$：

$$
x_T \;\xrightarrow{\;p_\theta(x_{T-1}\mid x_T)\;}\; x_{T-1} \;\xrightarrow{\;p_\theta(x_{T-2}\mid x_{T-1})\;}\; \cdots \;\xrightarrow{\;p_\theta(x_0\mid x_1)\;}\; x_0
$$

中間的影像從一片雜訊開始，先出現模糊的輪廓，最後變成清楚的圖。$\theta$ 是要學的神經網路參數。剩下的問題只有一個：這個 $p_\theta$ 要怎麼訓練？

擴散模型的回答分兩步。先自己設計一個把乾淨影像逐步弄髒的過程 $q$（前向過程），再去學它的反方向。

## 前向過程：每一步縮一點、加一點雜訊

（錄影 05:50–13:36，板書更正在 18:44–20:48）

前向過程只做一件事：加高斯雜訊。第 $t$ 步是

$$
x_t=\sqrt{1-\beta_t}\,x_{t-1}+\sqrt{\beta_t}\,\epsilon_t,\qquad \epsilon_t\sim\mathcal N(0,I)\ \text{彼此獨立}
$$

$\beta_t$ 是介於 0 和 1 之間的純量，通常很小，講者舉的量級是 $10^{-2}$ 到 $10^{-4}$。所以每一步把上一張圖稍微縮小、再混進一點點雜訊，圖只會變模糊一點。$\beta_t$ 每一步該取多少（noise schedule）這堂不談，講者說做法很多。

**看影片要注意**：講者一開始在黑板上寫的是 $(1-\beta_t)\,x_{t-1}$，沒有根號。18:44 有學生指出係數對不上，他在 19:47 更正成「全部都要加根號」。所以 19:47 以前，字幕裡當作係數唸出來的 "one minus beta"、"alpha t"、"alpha t bar" 多半少了根號，實際上是 $\sqrt{1-\beta_t}$、$\sqrt{\alpha_t}$、$\sqrt{\bar\alpha_t}$；定義 $\alpha_t=1-\beta_t$ 本身沒有根號。本文一律用更正後的版本，也就是講義式 (14.3) 的寫法。

### 為什麼係數偏偏是 √(1−βₜ) 和 √βₜ

答案在共變異數。$x_{t-1}$ 和新加的 $\epsilon_t$ 獨立，獨立隨機向量相加時共變異數直接相加；常數乘進去，提出來要平方。所以

$$
\mathrm{Cov}(x_t)=\left(\sqrt{1-\beta_t}\right)^2\mathrm{Cov}(x_{t-1})+\left(\sqrt{\beta_t}\right)^2\mathrm{Cov}(\epsilon_t)=(1-\beta_t)\,\mathrm{Cov}(x_{t-1})+\beta_t\,I
$$

兩個係數加起來是 1，所以 $\mathrm{Cov}(x_t)$ 是「上一步的共變異數」和「單位矩陣 $I$」之間的線性內插。這帶來兩個結果：

1. 如果資料一開始就正規化成 $\mathrm{Cov}(x_0)=I$，把 $I$ 代進去出來還是 $I$，每一步的共變異數都不變。前向過程只是把雜訊混進去，整體尺度沒動。
2. 如果 $\mathrm{Cov}(x_0)\neq I$（影像的像素之間有相關，實際上多半如此），共變異數會沿著連接 $\mathrm{Cov}(x_0)$ 和 $I$ 的那條線段一步步往 $I$ 靠，最後收斂到 $I$，中途不會爆掉也不會縮沒。

根號就是為了讓「平方之後係數和為 1」。這也是為什麼式子裡到處是根號。講者解釋，這個領域習慣把 $\beta_t$ 當變異數、$\sqrt{\beta_t}$ 當標準差；數學家多半會反過來把標準差寫成 $\beta_t$、變異數寫成 $\beta_t^2$。他說只找到一篇沒用這套記號的論文，另外有一篇綜述想改記號，但其他人沒有跟著改（約 20:48）。

**小例子（本文自擬，不是課堂內容）。** 一維資料，起始變異數 4，三步的 $\beta$ 取 $0.1,\,0.2,\,0.3$（故意取大，數字才看得出變化）：

- 第 1 步：$0.9\times 4+0.1=3.7$
- 第 2 步：$0.8\times 3.7+0.2=3.16$
- 第 3 步：$0.7\times 3.16+0.3=2.512$

變異數從 4 往 1 靠，每一步都落在上一步的值和 1 之間。

## 一步到位的公式

（錄影 13:36–28:00）

一步一步加雜訊太慢。訓練時我們想直接從 $x_0$ 跳到任意的 $x_t$。先定義兩個記號：

$$
\alpha_t=1-\beta_t,\qquad \bar\alpha_t=\alpha_t\,\alpha_{t-1}\cdots\alpha_1
$$

$\alpha_t$ 接近 1；$\bar\alpha_t$ 是到第 $t$ 步為止的累乘。接著把遞迴式展開，每次把 $x_{t-1}$ 換成它自己的定義：

$$
\begin{aligned}
x_t&=\sqrt{\alpha_t}\,x_{t-1}+\sqrt{1-\alpha_t}\,\epsilon_t\\
&=\sqrt{\alpha_t\alpha_{t-1}}\,x_{t-2}+\sqrt{\alpha_t(1-\alpha_{t-1})}\,\epsilon_{t-1}+\sqrt{1-\alpha_t}\,\epsilon_t\\
&=\cdots\\
&=\sqrt{\bar\alpha_t}\,x_0+\sum_{s=1}^{t}\sqrt{(1-\alpha_s)\prod_{r=s+1}^{t}\alpha_r}\;\epsilon_s
\end{aligned}
$$

不管展開幾次，形狀都一樣：一項是「某個常數乘 $x$」，$x$ 的下標一路降到 0；其餘是一堆 $\epsilon$ 的線性組合。第二項看起來很嚇人，但它只是獨立標準高斯的線性組合，所以整包還是一個平均為 0 的高斯，可以寫成「某個純量 $\kappa$ 乘上一個標準高斯」。問題只剩 $\kappa$ 是多少。

講者給了一個不必硬算的論證（約 26:05）。假設 $\mathrm{Cov}(x_0)=I$，前一節已經證明這時 $\mathrm{Cov}(x_t)=I$。把 $x_t=\sqrt{\bar\alpha_t}\,x_0+\kappa\,\hat\epsilon_t$ 兩邊取共變異數：

$$
I=\bar\alpha_t\,I+\kappa^2 I\quad\Longrightarrow\quad \kappa^2=1-\bar\alpha_t
$$

而 $\kappa$ 只由 $\beta$ 決定，跟資料長什麼樣無關，所以這個答案對任何 $x_0$ 都成立（最後這一句是本文補上的，課堂上只做了 $\mathrm{Cov}(x_0)=I$ 的情形）。

他也提到可以直接算，用的是裂項相消（telescoping）。這段課堂上沒寫，以下是本文補的。第二項的變異數是各係數平方和：

$$
\sum_{s=1}^{t}(1-\alpha_s)\prod_{r=s+1}^{t}\alpha_r=\sum_{s=1}^{t}\left(\prod_{r=s+1}^{t}\alpha_r-\prod_{r=s}^{t}\alpha_r\right)=1-\prod_{r=1}^{t}\alpha_r=1-\bar\alpha_t
$$

中間那一步把 $(1-\alpha_s)$ 乘開；相鄰兩項一正一負互相抵消，只剩頭尾。$s=t$ 時空的連乘積等於 1。

結論是整堂課最常用的一條式子，講義式 (14.5)：

$$
x_t=\sqrt{\bar\alpha_t}\,x_0+\sqrt{1-\bar\alpha_t}\;\hat\epsilon_t,\qquad \hat\epsilon_t\sim\mathcal N(0,I)
$$

寫成條件分布就是 $q(x_t\mid x_0)=\mathcal N\!\left(x_t;\sqrt{\bar\alpha_t}\,x_0,\,(1-\bar\alpha_t)I\right)$。

### 數值例子：逐步加噪和一步到位對得起來嗎

以下是本文自擬的例子，不是課堂內容，數字另外用程式驗算過。一維，$x_0=1.5$，$\beta_1=0.1$、$\beta_2=0.2$，抽到的雜訊是 $\epsilon_1=0.5$、$\epsilon_2=-1.0$。

**逐步算：**

$$
x_1=\sqrt{0.9}\times 1.5+\sqrt{0.1}\times 0.5=1.4230+0.1581=1.5811
$$

$$
x_2=\sqrt{0.8}\times 1.5811+\sqrt{0.2}\times(-1.0)=1.4142-0.4472=0.9670
$$

**一步到位：** $\bar\alpha_2=0.9\times 0.8=0.72$。訊號項是 $\sqrt{0.72}\times 1.5=1.2728$。雜訊項是 $\sqrt{\alpha_2\beta_1}\,\epsilon_1+\sqrt{\beta_2}\,\epsilon_2=\sqrt{0.08}\times 0.5+\sqrt{0.2}\times(-1.0)=0.1414-0.4472=-0.3058$。兩項相加 $1.2728-0.3058=0.9670$，跟逐步算的一樣。

**檢查雜訊項的變異數：** $0.08+0.2=0.28=1-0.72$，正是 $1-\bar\alpha_2$。所以 $\hat\epsilon_2=-0.3058/\sqrt{0.28}=-0.578$，它是 $\epsilon_1$ 和 $\epsilon_2$ 的加權和重新正規化後的結果。

這個例子說明兩件事。第一，一步到位公式裡的 $\hat\epsilon_t$ 是把過去所有 $\epsilon$ 揉在一起的那一個高斯，跟第 $t$ 步新加的 $\epsilon_t$ 是不同的東西。第二，訓練時根本不用存整條軌跡，抽一個 $\hat\epsilon_t$ 就能直接造出 $x_t$。

### ε̂ₜ 之間不獨立

多數論文和教學文在這裡只寫一個 $\epsilon$，講者刻意寫成 $\hat\epsilon_t$，因為不同的 $t$ 對應的是不同的隨機變數。有學生追問它們是不是獨立同分布（約 25:02），答案是否定的：每個 $\hat\epsilon_t$ 的邊際分布都是標準高斯，但 $\hat\epsilon_t$ 和 $\hat\epsilon_{t+1}$ 共用了 $\epsilon_1,\dots,\epsilon_t$，高度相關。講者說這不礙事，因為後面每次用到 $\hat\epsilon_t$ 都只看單一個 $t$，用不到它們之間的關係。

### 走得夠遠就變成純雜訊

$\bar\alpha_t$ 是一堆小於 1 的數相乘，$t$ 夠大時會趨近 0。這時 $\sqrt{\bar\alpha_t}\,x_0$ 消失、$\sqrt{1-\bar\alpha_t}$ 趨近 1，所以不只是 $x_T$ 的邊際分布，連給定 $x_0$ 的條件分布 $q(x_T\mid x_0)$ 都趨近 $\mathcal N(0,I)$：終點完全忘了自己從哪張圖出發。講者提醒這些收斂的說法是不嚴謹的寫法，要嚴格就得檢查正則條件。之後一律假設 $x_T$ 就是標準高斯。

講者說 $\bar\alpha_t$ 會「relatively quickly」趨近 0。到底多快取決於 $\beta$，可以自己算一下（本文自擬的計算，$\beta$ 取常數只是為了好算，實際的 schedule 不是常數）：

| 每步 $\beta$ | 步數 $T$ | $\bar\alpha_T=(1-\beta)^T$ | 訊號係數 $\sqrt{\bar\alpha_T}$ |
|---|---|---|---|
| $10^{-2}$ | 100 | 0.366 | 0.605 |
| $10^{-2}$ | 500 | 0.0066 | 0.081 |
| $10^{-2}$ | 1000 | $4.3\times10^{-5}$ | 0.0066 |
| $10^{-4}$ | 1000 | 0.905 | 0.951 |

$\beta=10^{-2}$ 走 1000 步，原圖只剩千分之七的權重，$x_T$ 幾乎是純雜訊。但 $\beta=10^{-4}$ 同樣走 1000 步，原圖還保留 95%，「$x_T$ 是標準高斯」的假設就不成立。所以 $\beta$ 的大小和步數 $T$ 要一起看。

## 反向過程：真正的反向未知，用高斯去學

（錄影 28:00–35:50）

先把前向過程的定位講清楚。它完全是我們設計的，$\beta$ 自己選，沒有任何東西要學：

> "There's no learning involved at all. This is what we design."（約 28:13）

講者拿 VAE 對照：VAE 裡把資料變成隱變數的那個方向也是一個要學的神經網路，兩個方向都要學；擴散模型只學一個方向。

**真正的反向過程。** 前向過程定義了 $x_0,\dots,x_T$ 的聯合分布 $q$，在這個聯合分布底下，$q(x_{t-1}\mid x_t)$ 是有定義的。而且反向也是馬可夫鏈：講者說這是馬可夫鏈的基本事實，一個方向是馬可夫鏈，倒過來看還是。直覺是 $x_{t+1},\dots,x_T$ 都是從 $x_t$ 加雜訊做出來的，已經知道 $x_t$ 的話，它們不會再多透露 $x_{t-1}$ 的事（這個直覺是本文補的，課堂上只說它是基本事實）。

如果知道 $q(x_{t-1}\mid x_t)$，生成就解決了：從 $x_T\sim\mathcal N(0,I)$ 開始一路往回取樣就好。麻煩在它算不出來，因為它牽涉整個資料分布 $p_{\text{data}}$。它是我們想還原的「標準答案」。

**參數化。** 用一個模型 $p_\theta$ 去近似它，同樣做成馬可夫鏈，每一步是高斯：

$$
p_\theta(x_{t-1}\mid x_t)=\mathcal N\!\left(x_{t-1};\ \mu_\theta(x_t,t),\ \sigma_t^2 I\right)
$$

$\mu_\theta$ 是一個神經網路，輸入帶雜訊的圖 $x_t$ 和步數 $t$，輸出一個跟圖同維度的向量，當作高斯的平均。$\sigma_t^2$ 是事先選定的變異數，不學（講者說其實也可以學，這堂不做；講義引 Nichol and Dhariwal 2021）。它該選多少，推導到最後會自己浮現。

有學生問了一個很自然的問題：既然最後要的只是雜訊，為什麼不一步到位，直接把 $x_0$ 乘 0 再加雜訊？講者的回答是，那樣反過來更難學。逐步加噪的好處在學習那一側：加噪是一小步一小步，去噪也就可以一小步一小步學，每一步都是比較簡單的問題。他說第一篇論文的 $T$ 大約是 1000，甚至幾千。介於「一步」和「一千步」之間的做法是用五層、十層的網路逐層加噪，他說那就是 VAE 的思路，差別是 VAE 的加噪網路要學，擴散模型是硬做（brute force）、每步只加一點點固定的雜訊。對這個解釋他的把握是：

> "There are actually many explanations for why this is working. That's one of the intuition I believe is indeed true."（約 35:24）

稍後（約 38:31，講者已經開始談「為什麼是高斯」）另一位學生的提問字幕不完整，大意是擴散模型是不是在解決「共變異數矩陣只能是對角」造成的落差。講者說不是，擴散模型這裡用的 $\sigma_t^2I$ 同樣是對角的；他認為真正的差別是把時間軸拉得很長，每一步變得容易還原。他也提到後來有人做到四步就能反向生成，但那是先用多步學、再想辦法加速，是另一個故事。

## 為什麼反向還是高斯：布朗運動與連續時間

（錄影 35:50–50:55）

往前是加高斯雜訊，憑什麼往回也是高斯？而且往回明明是「去噪」，為什麼還要加變異數？講者花了十五分鐘岔出去回答這兩個問題，並且事先說這段不要求每個人都跟上。

**為什麼往回還有隨機性。** 想像一維的布朗運動，每一步加一點雜訊，畫出一條抖動的軌跡。給你 $x_t$ 這個點，你能確定上一個點 $x_{t-1}$ 在哪嗎？不能。可能是從下面走上來的，也可能是從上面掉下來的，很多條不同的軌跡都會經過同一個 $x_t$。所以給定 $x_t$，$x_{t-1}$ 仍然是一個分布。

**為什麼是高斯。** 講者的說法是，在連續時間裡，幾乎所有隨機過程的小步變化都是高斯，因為任何一「小步」都可以再切成更多更小的步，夠多微小的隨機擾動累加起來就變成高斯。他在課堂上說的是 "by law of large number"；嚴格說，累加之後變成高斯靠的是中央極限定理（這句是本文的補充）。他也說這不是永遠成立，有反例，所以隨機過程才有趣，但常見的正常情況下前向和反向都是高斯。

**連續時間的寫法。** 把前向過程寫成隨機微分方程：

$$
dX_t=f(X_t,t)\,dt+g(t)\,dW_t
$$

左邊可以想成很小一步的變化量 $X_{t+dt}-X_t$。右邊第一項是確定性的漂移，對應離散版本裡把 $x_{t-1}$ 縮小的那個動作；第二項是隨機的部分，$W_t$ 是布朗運動，$g(t)$ 是雜訊的強度，對應 $\sqrt{\beta_t}$。

把時間倒過來，定義 $Y_\tau=X_{T-\tau}$。講者引了一個定理，說 $Y_\tau$ 也滿足同一種形式的方程（這是講義定理 14.4.1 的寫法）：

$$
dY_\tau=\left[-f(Y_\tau,T-\tau)+g(T-\tau)^2\,\nabla_x\log p_{T-\tau}(Y_\tau)\right]d\tau+g(T-\tau)\,d\bar W_\tau
$$

其中 $p_t$ 是 $X_t$ 的機率密度，$\bar W_\tau$ 是倒著看的布朗運動。這條式子分兩部分讀：

- **隨機的部分** $g\,d\bar W_\tau$ 跟前向一模一樣，還是加高斯。這就是離散版本裡把 $p_\theta(x_{t-1}\mid x_t)$ 設成高斯的依據。
- **確定性的部分**多了一項 $g^2\nabla_x\log p$。講者用剛才的圖解釋：如果 $x_t$ 落在很高、很少有軌跡會到的位置，那它比較可能是從下方（密度比較高的地方）走上來的，所以往回走時平均要往下漂；如果 $x_t$ 在中間，上下就對稱。$\nabla_x\log p$ 指的正是密度增加的方向。講義把這一項叫 score term，課堂上沒有用這個詞。

定理的出處，講者口頭說的是 "Anderson 1985"，並補充它不一定是最早的結果，可能可以追到 1940 年的某篇論文（他沒說是哪一篇）；講義的文獻列的是 Anderson 1982（Reverse-time diffusion equation models）。年份以講義為準。

推導他跳過了，說講義有一段用貝氏定理加泰勒展開的直覺證明（講義 14.4 節後半）。這段岔題的用途他自己總結成一句：連續極限下真正的反向過程是高斯，所以離散時用高斯去參數化是合理的。他順便說了為什麼想講這段：

> "Once you go to large language models, it's kind of like you write down three equations and you are done."（約 42:35）

## 記號插曲：等號左邊是密度還是分布

（錄影 50:55–55:10）

進入訓練之前，講者停下來處理一個機器學習圈習以為常、數學系會皺眉的寫法。很多論文直接寫

$$
p_\theta(x_{t-1}\mid x_t)=\mathcal N\!\left(\mu_\theta(x_t,t),\ \sigma_t^2I\right)
$$

左邊是條件機率密度（代入數值是一個純量），右邊是一個分布，型別對不上。背後有兩層混用：

1. $x_t$ 同時代表隨機變數本身，和它取到的某個具體數值。
2. $p(\cdot)$ 同時代表密度函數，和它描述的那個分布。

講義採用比較乾淨的寫法：$\mathcal N(x;\mu,\sigma^2)$ 表示高斯密度在 $x$ 的值，

$$
\mathcal N(x;\mu,\sigma^2)=\frac{1}{\sqrt{2\pi\sigma^2}}\exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)
$$

於是 $p_\theta(x_{t-1}\mid x_t)=\mathcal N(x_{t-1};\mu_\theta(x_t,t),\sigma_t^2I)$ 兩邊都是 $x_{t-1}$ 的函數。要講分布時，講義另外寫 $\mathrm{Law}_{p_\theta}(x_{t-1}\mid x_t)=\mathcal N(\mu_\theta(x_t,t),\sigma_t^2I)$。有學生問是不是該用大寫表示隨機變數，講者說這個領域不這麼做，大家一律小寫。本文正文用講義的密度寫法；下面講 KL 時，$\mathrm{KL}(q(\cdot)\,\Vert\,p(\cdot))$ 裡的 $q$、$p$ 指的是分布。

## 訓練目標：把 ELBO 套到整條軌跡上

（錄影 55:10–1:07:00）

訓練要做的是最大概似：讓真實資料 $x_0$ 在模型底下的機率 $\log p_\theta(x_0)$ 越大越好。$p_\theta$ 定義的是整條軌跡 $x_0,\dots,x_T$ 的聯合分布，$p_\theta(x_0)$ 是它的邊際，要把 $x_1,\dots,x_T$ 全部積掉：

$$
p_\theta(x_0)=\int p_\theta(x_{0:T})\,dx_1\cdots dx_T
$$

這個積分算不出來。這正是上一堂 EM 處理的局面：有觀察不到的變數，概似函數寫不開。所以搬出同一個工具。

**複習 ELBO。** 對任何分布 $Q(z)$：

$$
\log p(x;\theta)=\log\int Q(z)\,\frac{p(x,z;\theta)}{Q(z)}\,dz\ \ge\ \mathbb E_{z\sim Q}\!\left[\log\frac{p(x,z;\theta)}{Q(z)}\right]
$$

不等號是 Jensen 不等式（$\log$ 是凹函數，期望值的 log 不小於 log 的期望值）；這一步是上一堂推過的，這堂課堂上只重寫了結果。把 $p(x,z)=p(x\mid z)\,p(z)$ 代進去拆成兩項：

$$
\log p(x;\theta)\ \ge\ \underbrace{\mathbb E_{z\sim Q}\big[\log p(x\mid z;\theta)\big]}_{\text{重建項}}-\underbrace{\mathrm{KL}\big(Q\,\Vert\,p_z\big)}_{Q\text{ 與 }z\text{ 的邊際分布的距離}}
$$

這是講義式 (11.15)，也是講者在黑板上重寫的版本。

**對應關係。** 把看得到的資料當 $x$，中間所有帶雜訊的版本當 $z$：

| 上一堂 EM 的記號 | 這一堂 |
|---|---|
| 觀察到的 $x$ | $x_0$ |
| 隱變數 $z$ | 整條軌跡 $x_{1:T}=(x_1,\dots,x_T)$ |
| 輔助分布 $Q(z)$ | 前向過程 $q(x_{1:T}\mid x_0)$ |
| 模型 $p(x,z;\theta)$ | 反向模型 $p_\theta(x_{0:T})$ |

代進去就是講義式 (14.15)：

$$
\log p_\theta(x_0)\ \ge\ \mathbb E_{x_{1:T}\sim q(\cdot\mid x_0)}\big[\log p_\theta(x_0\mid x_{1:T})\big]-\mathrm{KL}\big(q(x_{1:T}\mid x_0)\,\Vert\,p_\theta(x_{1:T})\big)
$$

第一項是重建項。因為 $p_\theta$ 是馬可夫鏈，$p_\theta(x_0\mid x_{1:T})=p_\theta(x_0\mid x_1)$，所以它只管最後一步怎麼從 $x_1$ 還原 $x_0$（這個化簡是講義寫的，課堂上沒特別講）。第二項是兩個「軌跡分布」之間的 KL：一個是從 $x_0$ 出發往前加噪得到的軌跡，一個是模型從雜訊往回生成的軌跡。

### 三個學生的問題

**$q$ 和 $p_\theta$ 到底差在哪？** $q$ 是前向過程定義的聯合分布，每條軌跡有一個密度；寫 $q(\text{某些變數}\mid\text{另一些變數})$ 都是指在這個聯合分布底下取條件。$p_\theta$ 是我們人為定義的另一個聯合分布，給定 $\theta$ 就確定，同樣可以取任何條件。兩者是同一組變數上的兩個不同分布。

**拿加噪過程當後驗分布、去噪過程當先驗分布，不是反了嗎？** 講者說這是故意的。在 VAE 裡兩邊都有參數（一個 $\theta$、一個 $\phi$），這裡只是把其中一邊固定住。更根本的理由是，ELBO 是一條對任何 $Q$ 都成立的不等式，$Q$ 叫不叫後驗分布不影響它成立。

**為什麼下界裡有一個減 KL？** 講者給的是一個檢查方式：如果沒有這一項，重建可以作弊到完美，直接讓 $z=x$ 就好。KL 項的作用像正規化（regularization），要求 $Q$ 不能離 $z$ 的先驗分布太遠。

講者還說，他看過的教材都是從下界開始直接算一整頁，這裡先套 (11.15) 再拆 KL 是他自己整理的走法，目的是讓推導有結構、也比較短（約 1:06:05）。

## KL 的連鎖律：把整條軌跡的 KL 拆成一步一步

（錄影 1:07:00–1:13:50）

KL 那一項比的是兩個 $T$ 維軌跡的分布，沒辦法直接算。拆開它的工具是 KL 的連鎖律。

**兩個變數的版本。** 設 $q(x,y)=q(y)\,q(x\mid y)$、$p(x,y)=p(y)\,p(x\mid y)$，則

$$
\mathrm{KL}\big(q(x,y)\,\Vert\,p(x,y)\big)=\mathrm{KL}\big(q(y)\,\Vert\,p(y)\big)+\mathbb E_{y\sim q}\Big[\mathrm{KL}\big(q(x\mid y)\,\Vert\,p(x\mid y)\big)\Big]
$$

證明就是把定義展開。$\log$ 把乘積變成和：

$$
\mathbb E_q\!\left[\log\frac{q(y)\,q(x\mid y)}{p(y)\,p(x\mid y)}\right]=\mathbb E_q\!\left[\log\frac{q(y)}{p(y)}\right]+\mathbb E_q\!\left[\log\frac{q(x\mid y)}{p(x\mid y)}\right]
$$

第一項只跟 $y$ 有關，就是 $\mathrm{KL}(q(y)\Vert p(y))$。第二項先固定 $y$ 對 $x$ 取期望值，得到條件分布之間的 KL，再對 $y$ 取期望值。講者唸這條式子時（他用的字母是 $p$ 在前、$q$ 在後），第二項只說了 $\mathrm{KL}(p(x\mid y)\Vert q(x\mid y))$，沒有提外層對 $y$ 的期望值；講義引理 A.1.4 有寫，計算時不能漏。

**套到軌跡上。** 對一串變數反覆用上面的式子，從最後一個變數 $x_T$ 開始往前剝。兩邊都要寫成「倒著的」分解：

- 模型這邊本來就是倒著定義的：$p_\theta(x_{1:T})=p_\theta(x_T)\prod_{t=2}^{T}p_\theta(x_{t-1}\mid x_t)$。
- 前向這邊，講者說「把 $x_0$ 當作一直都在」，也就是每一項都多帶一個條件 $x_0$：$q(x_{1:T}\mid x_0)=q(x_T\mid x_0)\prod_{t=2}^{T}q(x_{t-1}\mid x_t,x_0)$。照理 $x_{t-1}$ 的條件應該是 $x_t,x_{t+1},\dots,x_T$ 和 $x_0$，但前面講反向過程時說過，知道 $x_t$ 之後更後面的變數不再提供資訊，可以丟掉。

兩個分解對齊之後套連鎖律，得到講義式 (14.16)：

$$
\mathrm{KL}\big(q(x_{1:T}\mid x_0)\,\Vert\,p_\theta(x_{1:T})\big)=\underbrace{\mathrm{KL}\big(q(x_T\mid x_0)\,\Vert\,p_\theta(x_T)\big)}_{L_T}+\sum_{t=2}^{T}\underbrace{\mathbb E_{q}\Big[\mathrm{KL}\big(q(x_{t-1}\mid x_t,x_0)\,\Vert\,p_\theta(x_{t-1}\mid x_t)\big)\Big]}_{L_{t-1}}
$$

期望值是對 $x_t\sim q(x_t\mid x_0)$ 取的。$L_{t-1}$ 這個名字是講者照文獻慣例取的。$L_T$ 那一項，講義說可以從訓練目標丟掉：$p_\theta(x_T)=\mathcal N(0,I)$ 是固定的，沒有參數；而且 $\bar\alpha_T\approx 0$ 時 $q(x_T\mid x_0)$ 也幾乎是 $\mathcal N(0,I)$，這個 KL 本來就很小（這句課堂上沒有展開，出自講義）。

現在每一個 $L_{t-1}$ 只牽涉「一步」：模型的一步反向 $p_\theta(x_{t-1}\mid x_t)$，要去貼近 $q(x_{t-1}\mid x_t,x_0)$。講者在這裡點出整個推導最巧的地方：

> "So without x0, it's very hard to reconstruct. But with x0, it's actually easy to reconstruct."（約 1:13:05）

我們本來想學的是 $q(x_{t-1}\mid x_t)$，它算不出來。ELBO 加連鎖律把目標換成 $q(x_{t-1}\mid x_t,x_0)$，多了一個條件 $x_0$，而這個分布有封閉公式。訓練時 $x_0$ 就是手上的訓練影像，當然知道。

模型的輸入沒有 $x_0$，卻去貼一個依賴 $x_0$ 的目標，會不會學歪？下一節會看到 $L_{t-1}$ 最後是一個平方誤差，而最小化平方誤差得到的是條件期望值：對整個訓練集取平均之後，$\mu_\theta(x_t,t)$ 學到的是「會走到這個 $x_t$ 的所有可能 $x_0$」對應目標的平均 $\mathbb E[\tilde\mu_t(x_t,x_0)\mid x_t]$。而 $\tilde\mu_t(x_t,x_0)$ 本身是 $\mathbb E[x_{t-1}\mid x_t,x_0]$，再對 $x_0$ 平均一次就是 $\mathbb E[x_{t-1}\mid x_t]$，正好是 $q(x_{t-1}\mid x_t)$ 的平均（這段說明是本文補充，課堂上沒講）。

## 給定 x₀，反向一步算得出來

（錄影 1:13:50–1:19:20）

課堂上這段剩不到十分鐘，講者只給了貝氏定理的式子和最後的結論，中間的計算他說略過，連結果的係數都坦白說沒有逐項驗過：

> "The coefficients, I can never remember it."（約 1:17:19）

貝氏定理那一步是：

$$
q(x_{t-1}\mid x_t,x_0)=\frac{q(x_t\mid x_{t-1},x_0)\;q(x_{t-1}\mid x_0)}{q(x_t\mid x_0)}
$$

右邊三項全部已知：

- $q(x_t\mid x_{t-1},x_0)=q(x_t\mid x_{t-1})=\mathcal N(x_t;\sqrt{\alpha_t}\,x_{t-1},\beta_tI)$。馬可夫性質讓 $x_0$ 可以拿掉，剩下的就是前向一步的定義。
- $q(x_{t-1}\mid x_0)=\mathcal N(x_{t-1};\sqrt{\bar\alpha_{t-1}}\,x_0,(1-\bar\alpha_{t-1})I)$，一步到位公式。
- $q(x_t\mid x_0)$ 同樣是一步到位公式。

以下把課堂跳過的計算補完（本文的推導，結果與講義式 (14.18)、(14.19) 一致）。分母不含 $x_{t-1}$，對 $x_{t-1}$ 來說只是常數。所以只看分子兩個高斯相乘後、指數裡跟 $x_{t-1}$ 有關的部分：

$$
-\frac12\left[\frac{\lVert x_t-\sqrt{\alpha_t}\,x_{t-1}\rVert^2}{\beta_t}+\frac{\lVert x_{t-1}-\sqrt{\bar\alpha_{t-1}}\,x_0\rVert^2}{1-\bar\alpha_{t-1}}\right]
$$

這是 $x_{t-1}$ 的二次式，所以結果一定是高斯。一個高斯 $\mathcal N(\mu,\sigma^2I)$ 的指數是 $-\frac{1}{2\sigma^2}\lVert x\rVert^2+\frac{1}{\sigma^2}\mu^\top x+\text{常數}$，所以只要把上式的二次項係數和一次項係數讀出來，就能對出變異數和平均。

**二次項係數**（$\lVert x_{t-1}\rVert^2$ 前面，不含 $-\frac12$）：

$$
\frac{\alpha_t}{\beta_t}+\frac{1}{1-\bar\alpha_{t-1}}=\frac{\alpha_t(1-\bar\alpha_{t-1})+\beta_t}{\beta_t(1-\bar\alpha_{t-1})}=\frac{1-\bar\alpha_t}{\beta_t(1-\bar\alpha_{t-1})}
$$

最後一個等號用了 $\alpha_t\bar\alpha_{t-1}=\bar\alpha_t$ 和 $\alpha_t+\beta_t=1$。這個係數是變異數的倒數，所以

$$
\tilde\beta_t=\frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}\,\beta_t
$$

**一次項係數**（把兩個平方展開、乘上前面的 $-\frac12$ 之後，跟 $x_{t-1}$ 做內積的那個向量，對應上面的 $\mu/\sigma^2$）：

$$
\frac{\sqrt{\alpha_t}}{\beta_t}\,x_t+\frac{\sqrt{\bar\alpha_{t-1}}}{1-\bar\alpha_{t-1}}\,x_0
$$

平均等於它乘上變異數 $\tilde\beta_t$：

$$
\tilde\mu_t(x_t,x_0)=\frac{\sqrt{\bar\alpha_{t-1}}\;\beta_t}{1-\bar\alpha_t}\,x_0+\frac{\sqrt{\alpha_t}\,(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}\,x_t
$$

合起來：

$$
q(x_{t-1}\mid x_t,x_0)=\mathcal N\!\left(x_{t-1};\ \tilde\mu_t(x_t,x_0),\ \tilde\beta_t I\right)
$$

講者要大家記住的只有形狀：**平均是 $x_0$ 和 $x_t$ 的線性組合，變異數只由 $\alpha$、$\beta$ 決定、跟資料無關**。直覺上也合理：$x_{t-1}$ 夾在乾淨的 $x_0$ 和更髒的 $x_t$ 中間，最好的猜測是兩者的加權平均。

### 數值例子：接著前面那條軌跡算

以下沿用前面本文自擬的例子（$\beta_1=0.1$、$\beta_2=0.2$、$x_0=1.5$、$x_1=1.5811$、$x_2=0.9670$），算 $t=2$ 的 $q(x_1\mid x_2,x_0)$。需要的量：$\bar\alpha_1=0.9$、$\bar\alpha_2=0.72$、$\alpha_2=0.8$。

$$
\tilde\beta_2=\frac{1-0.9}{1-0.72}\times 0.2=\frac{0.1}{0.28}\times0.2=0.0714
$$

$$
\tilde\mu_2=\frac{\sqrt{0.9}\times0.2}{0.28}\,x_0+\frac{\sqrt{0.8}\times0.1}{0.28}\,x_2=0.6776\times1.5+0.3194\times0.9670=1.0164+0.3089=1.3253
$$

所以給定 $x_0=1.5$ 和 $x_2=0.967$，$x_1$ 的分布是平均 1.3253、標準差 $\sqrt{0.0714}=0.267$ 的高斯。實際的 $x_1=1.5811$ 比平均高 0.96 個標準差，是個很普通的樣本。

幾個可以讀出來的事：

- 只知道 $x_0$ 時，$x_1$ 的變異數是 $1-\bar\alpha_1=0.1$；多知道 $x_2$ 之後降到 0.0714。後面的觀察確實提供了資訊。
- $\tilde\mu_2$ 落在 $x_2=0.967$ 和 $x_0=1.5$ 之間，偏向 $x_0$，因為這個例子裡 $x_1$ 離乾淨資料只有一步。
- 用二次項係數驗算：$\alpha_2/\beta_2+1/(1-\bar\alpha_1)=4+10=14=1/0.0714$。

## 同變異數的兩個高斯：損失變成平均之差的平方

（錄影 1:19:20–1:21:50）

現在 $L_{t-1}$ 裡的兩個分布都是高斯：

- 目標：$q(x_{t-1}\mid x_t,x_0)=\mathcal N(\tilde\mu_t(x_t,x_0),\ \tilde\beta_tI)$
- 模型：$p_\theta(x_{t-1}\mid x_t)=\mathcal N(\mu_\theta(x_t,t),\ \sigma_t^2I)$

前面留著沒決定的 $\sigma_t^2$ 在這裡有了答案。講者說至少有一種選法是直接取 $\sigma_t^2=\tilde\beta_t$，讓兩個高斯的共變異數一樣，只剩平均不同。這時 KL 有很簡單的公式（講義式 (14.20)）：

$$
\mathrm{KL}\big(\mathcal N(m_1,\Sigma)\,\Vert\,\mathcal N(m_2,\Sigma)\big)=\frac12\,(m_1-m_2)^\top\Sigma^{-1}(m_1-m_2)
$$

課堂上只寫了結果。推導不長（本文補充，做法同講義引理 A.1.3）：令 $P=\mathcal N(m_1,\Sigma)$。兩個密度的正規化常數相同，取 log 相減後只剩指數：

$$
\mathrm{KL}=\mathbb E_{x\sim P}\left[\frac12(x-m_2)^\top\Sigma^{-1}(x-m_2)-\frac12(x-m_1)^\top\Sigma^{-1}(x-m_1)\right]
$$

把 $x-m_2$ 寫成 $(x-m_1)+(m_1-m_2)$ 展開。$(x-m_1)$ 的二次項跟後面那項抵消；交叉項 $(x-m_1)^\top\Sigma^{-1}(m_1-m_2)$ 的期望值是 0，因為 $\mathbb E_P[x]=m_1$；剩下的 $\frac12(m_1-m_2)^\top\Sigma^{-1}(m_1-m_2)$ 不含 $x$。

代入 $\Sigma=\tilde\beta_tI$、$m_1=\tilde\mu_t$、$m_2=\mu_\theta$，得到這堂課的終點，講義式 (14.21)：

$$
L_{t-1}=\mathbb E_q\!\left[\frac{1}{2\tilde\beta_t}\,\big\lVert\tilde\mu_t(x_t,x_0)-\mu_\theta(x_t,t)\big\rVert_2^2\right]
$$

ELBO 前面對 KL 是減號，我們要最大化下界，所以 $L_{t-1}$ 是要最小化的損失。它是一個很具體的迴歸問題：給網路 $x_t$ 和 $t$，要它輸出 $\tilde\mu_t(x_t,x_0)$，也就是 $x_0$ 和 $x_t$ 的那個線性組合。目標算得出來，損失對 $\theta$ 可微，可以直接做梯度下降。

**接著例子算一次損失（本文自擬）。** 前面算出 $\tilde\mu_2=1.3253$、$\tilde\beta_2=0.0714$。如果網路在這個 $x_2$ 上輸出 $\mu_\theta=1.2$，這一筆的損失是 $(1.3253-1.2)^2/(2\times0.0714)=0.0157/0.1429=0.110$。如果輸出 1.3，損失降到 $0.00064/0.1429=0.0045$。誤差縮成五分之一，損失縮成大約二十四分之一，因為是平方。前面的 $1/(2\tilde\beta_t)$ 則決定不同步數的誤差各占多少比重。

把到這裡的流程串起來，訓練一筆資料要做的事是：拿一張 $x_0$，選一個 $t$，用一步到位公式抽出 $x_t$，算出目標 $\tilde\mu_t(x_t,x_0)$，讓 $\mu_\theta(x_t,t)$ 去貼它。這個流程是本文依課堂推到的式子整理的；講者在這堂沒有寫出訓練迴圈，講義要等損失化簡完才列演算法。

## 這堂停在哪裡

講者超時五分鐘，停在 $L_{t-1}$ 的式子：

> "There's a little bit of a simplification for this, which we'll cover next time, but this is the gist."（約 1:21:27）

沒講完的部分有三件，都在[下一堂](/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora)開頭收尾：

1. **把預測平均改成預測雜訊。** $x_t$ 本身是 $x_0$ 和 $\hat\epsilon_t$ 的線性組合，所以 $\tilde\mu_t$ 可以改寫成 $x_t$ 和 $\hat\epsilon_t$ 的組合，讓網路改成預測加進去的雜訊（講義式 (14.22)–(14.24)）。
2. **$t=1$ 的重建項 $L_0$**，也就是 ELBO 的第一項。
3. **訓練與取樣的演算法**。

這堂也沒有談 $\beta_t$ 怎麼排、$\mu_\theta$ 的網路長什麼樣、怎麼加上文字條件。

## 自我檢查

**1. 一維資料，$\beta_1=0.05$、$\beta_2=0.1$，$x_0=2$。寫出 $q(x_2\mid x_0)$ 的平均和變異數。**

答：$\bar\alpha_2=0.95\times0.9=0.855$。平均 $\sqrt{0.855}\times2=1.849$，變異數 $1-0.855=0.145$。如果你算變異數時寫成 $0.05+0.1=0.15$，就是忘了第一步的雜訊在第二步也被乘上 $\sqrt{\alpha_2}$：正確是 $0.9\times0.05+0.1=0.145$。

**2. 如果前向過程寫成 $x_t=(1-\beta)\,x_{t-1}+\sqrt{\beta}\,\epsilon_t$（少一個根號，就是講者一開始在黑板上寫的版本），從 $\mathrm{Var}(x_0)=1$ 出發，變異數最後會停在哪？**

答：遞迴是 $v_t=(1-\beta)^2v_{t-1}+\beta$。不動點滿足 $v=(1-\beta)^2v+\beta$，解得 $v=1/(2-\beta)$，$\beta$ 很小時約 0.5。變異數不再守恆，$x_T$ 會收斂到 $\mathcal N(0,\tfrac12 I)$ 附近而不是 $\mathcal N(0,I)$。判準：能說出「係數平方和要等於 1」就算懂。

**3. $\hat\epsilon_t$ 和 $\hat\epsilon_{t+1}$ 各自都是標準高斯，為什麼不獨立？為什麼這對後面的推導沒有影響？**

答：兩者都是 $\epsilon_1,\epsilon_2,\dots$ 的加權和，共用前 $t$ 個 $\epsilon$，所以相關。$L_{t-1}$ 每一項只涉及單一個 $t$ 的 $x_t$，只用到 $q(x_t\mid x_0)$ 這個邊際分布，不同 $t$ 之間的相關性不會出現在式子裡。

**4. 用 $\beta_1=0.1$、$\beta_2=0.2$、$\beta_3=0.3$ 算 $t=3$ 的 $\tilde\beta_3$，以及 $\tilde\mu_3$ 裡 $x_0$ 和 $x_3$ 的係數。**

答：$\bar\alpha_2=0.72$、$\bar\alpha_3=0.504$。$\tilde\beta_3=\frac{0.28}{0.496}\times0.3=0.1694$。$x_0$ 的係數 $\frac{\sqrt{0.72}\times0.3}{0.496}=0.5132$，$x_3$ 的係數 $\frac{\sqrt{0.7}\times0.28}{0.496}=0.4723$。驗算：$\alpha_3/\beta_3+1/(1-\bar\alpha_2)=2.333+3.571=5.905=1/0.1694$。

**5. $L_{t-1}$ 裡的目標是 $q(x_{t-1}\mid x_t,x_0)$。為什麼不直接讓模型去貼 $q(x_{t-1}\mid x_t)$？**

答：$q(x_{t-1}\mid x_t)$ 要對所有可能的 $x_0$ 依 $p_{\text{data}}$ 加權平均，而 $p_{\text{data}}$ 正是我們不知道的東西，寫不出公式。多了條件 $x_0$ 之後，所有相關的分布都是前向過程定義的高斯，用貝氏定理就能寫出封閉解，訓練時 $x_0$ 又是手上的資料。能講出「沒有 $x_0$ 算不出來，有 $x_0$ 是封閉公式」就算答對。

## 對應閱讀

主講義（2026 年 8 月版）第 14 章 Diffusion models，印刷頁 180–190：

- **14.1 The diffusion process**（pp.180–183）：前向過程、共變異數遞迴、式 (14.5) 與它的證明。對應本文前三節。
- **14.2 Parameterizing the reverse process**（pp.183–184）：對應「反向過程」一節。
- **14.3 Training diffusion models by maximizing the ELBO**（pp.184–188）：這堂講到式 (14.21)（p.186）為止；其後的雜訊預測化簡、$L_0$、訓練與取樣演算法是下一堂的範圍。
- **14.4 Continuous-time view of reverse diffusion**（pp.188–190）：對應布朗運動那段岔題，並有課堂跳過的一維推導。
- **11.3.1**（p.160）的式 (11.15) 是這堂用的 ELBO 形式；**附錄 A.1**（pp.266–268）有聯合高斯取條件、同共變異數高斯的 KL、KL 連鎖律三個引理。

課堂與講義的出入：

- 講義把 14.4 的連續時間放在最後；課堂上講者把它提前，插在參數化和訓練之間，用來回答「反向為什麼是高斯」。
- 講義求 $q(x_{t-1}\mid x_t,x_0)$ 用的是聯合高斯取條件的引理 A.1.2；課堂上寫的是貝氏定理，並提到講義的做法比較快。本文補的是貝氏定理這條路的配方計算。
- 反向時間定理的出處，課堂口頭說 Anderson 1985，講義文獻是 Anderson 1982。
- 課堂沒講而講義有的：$L_T$ 為什麼可以丟、$p_\theta(x_0\mid x_{1:T})=p_\theta(x_0\mid x_1)$、$\sigma_t^2$ 可學的文獻、擴散模型的出處（講義引 Sohl-Dickstein et al. 2015、Ho et al. 2020、Song et al. 2021）。
- 講義有而課堂更正過的：講義的式子一開始就帶根號，沒有課堂前二十分鐘的板書問題。

**系列導覽**：上一堂 [第 10 堂：EM 演算法與 PCA](/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca)｜下一堂 [第 12 堂：擴散模型的雜訊預測損失、基礎模型與 LoRA](/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora)｜[課程總覽](/posts/ai/2026-08-21-stanford-cs229-machine-learning)

## 課程影片來源

原始影片：[Stanford CS229 Machine Learning | Spring 2026 | Lecture 11: Diffusion Models](https://www.youtube.com/watch?v=dqUMCzWjZSI)

- [Stanford CS229 Machine Learning｜Spring 2026 播放清單（Stanford Online，17 支）](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 課程官網](https://cs229.stanford.edu/)
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

查核日期：2026-10-12。

內容核對：已依字幕核對（2026-10-12）：整份英文字幕（約 83 分鐘）逐段讀過，文中「課堂上說」的內容與引句都出自字幕；未看板書畫面，公式依字幕口述與主講義第 14 章、第 11 章、附錄 A.1 還原。字幕在 1:10:08–1:12:04 之間沒有口述（講者在寫板書），該處的 KL 分解式取自講義式 (14.16)。

## 參考資料

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 11: Diffusion Models（YouTube）](https://www.youtube.com/watch?v=dqUMCzWjZSI)：本文的主要底本，課堂順序、講者說法、學生提問與引句都依這支影片的英文字幕。
- [CS229 主講義 main_notes.pdf（2026 年 8 月版）](https://cs229.stanford.edu/main_notes.pdf)：第 14 章的式 (14.1)–(14.21)、(14.30)–(14.32) 用來還原板書公式；第 11 章式 (11.15) 是 ELBO 的形式；附錄 A.1 的引理用來核對 KL 連鎖律與高斯 KL 公式；文獻列表用來核對 Anderson 1982。
- [Stanford CS229 Machine Learning｜Spring 2026 播放清單](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)：確認堂次與影片標題。
- [Stanford CS229 導讀：課程總覽](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：系列入口。

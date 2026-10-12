---
title: "擴散模型的雜訊預測損失、基礎模型與 LoRA｜Stanford CS229 第 12 堂"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, diffusion-model, foundation-models, lora]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 12
tldr: "前半堂把擴散模型的 ELBO 收成一條式子：每個時間步都是「猜出當初加進去的雜訊」的平方誤差，訓練五步、取樣一個迴圈。後半堂開始講基礎模型：預訓練加適應的兩階段、linear probe、finetune、LP-FT，以及 LoRA 只訓練 2dr 個參數卻省不了多少運算的原因。"
description: "Stanford CS229 Spring 2026 第 12 堂導讀：擴散模型損失函數從後驗平均化簡到雜訊預測的完整推導、訓練與取樣演算法，接著是基礎模型的預訓練與適應、linear probe、finetune、LP-FT 與 LoRA。"
draft: false
math: true
---

> 🌏 [English version](/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora-en)

**影片狀態：已附影片。** 這篇依 Stanford Online 公開的 Spring 2026 第 12 堂錄影的英文字幕寫成，公式記號對照 2026 主講義第 14 章後段與第 15 章；沒看到板書畫面，板書上的式子是用講義還原的。

這堂課有兩個主題，中間沒有關聯，只是剛好排在同一天。前 34 分鐘把[上一堂](/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models)沒講完的擴散模型損失函數收尾，結論是整個訓練目標可以寫成「讓網路猜出加進去的雜訊」。後 40 分鐘是接下來四、五堂大型語言模型課的開場：基礎模型（foundation model）的兩階段典範，以及手上有標註資料時怎麼把預訓練模型調到新任務上，包含 linear probe、finetune、LP-FT 和 LoRA。

YouTube 標題寫的是 Representation Learning。實際上表徵學習在這堂只出現一個定義（47:51 起），用來引出 linear probe；表徵怎麼訓練出來，講者兩次說留到[下一堂](/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search)。所以標題比較像是這個單元的名字，不是這 76 分鐘的內容摘要。

先備：上一堂的前向過程與 ELBO、多變量高斯的條件分布、反向傳播。讀完之後，你應該能自己從後驗平均推到雜訊預測損失，手算一步訓練與一步取樣，並且說得出 LoRA 在運算、記憶體、多人共用三件事上各省了多少。課程全貌見 [Stanford CS229 課程總覽](/posts/ai/2026-08-21-stanford-cs229-machine-learning)。

```youtube
url: https://www.youtube.com/watch?v=_kREM2UAiJ8
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 12: Representation Learning
captions: en
```

講者是 Tengyu Ma。開場兩分鐘（00:05–02:11）他先交代剩下的七、八堂怎麼排：一堂講 GPT 成為主流之前的做法，接著是自迴歸語言模型的訓練、語言模型的後訓練與強化學習，中間穿插強化學習基礎與機器人應用，另有一堂客座講機器學習系統。

## 前半堂：擴散模型的損失函數

### 上一堂停在哪裡（錄影 02:11–07:35）

先把記號擺好，全部沿用上一堂。前向過程 $q$ 是固定的加噪鏈，$x_0$ 是乾淨影像，$x_T$ 接近標準高斯。令 $\alpha_t = 1-\beta_t$、$\bar\alpha_t = \prod_{s=1}^{t}\alpha_s$，上一堂得到一步到位的寫法：

$$
x_t = \sqrt{\bar\alpha_t}\,x_0 + \sqrt{1-\bar\alpha_t}\,\hat\epsilon_t,\qquad \hat\epsilon_t\sim\mathcal N(0,I).
$$

反向過程是要學的模型，每一步都是高斯，平均由神經網路輸出：

$$
p_\theta(x_{t-1}\mid x_t) = \mathcal N\big(\mu_\theta(x_t,t),\ \tilde\beta_t I\big).
$$

對 $\log p_\theta(x_0)$ 取 ELBO 之後有三種項：

$$
\log p_\theta(x_0)\ \ge\ \underbrace{\mathbb E_q\big[\log p_\theta(x_0\mid x_{1:T})\big]}_{\text{最後一步重建}}\ -\ \underbrace{\mathrm{KL}\big(q(x_T\mid x_0)\,\Vert\,p_\theta(x_T)\big)}_{L_T\ (\text{末端})}\ -\ \sum_{t=2}^{T}\underbrace{\mathbb E_q\,\mathrm{KL}\big(q(x_{t-1}\mid x_t,x_0)\,\Vert\,p_\theta(x_{t-1}\mid x_t)\big)}_{L_{t-1}}.
$$

上一堂只處理了最後那一串 $L_{t-1}$。真實後驗 $q(x_{t-1}\mid x_t,x_0)$ 是高斯 $\mathcal N(\tilde\mu_t(x_t,x_0),\tilde\beta_t I)$，模型的變異數刻意選成同一個 $\tilde\beta_t$。兩個共變異數相同的高斯，KL 只剩平均的差：

$$
L_{t-1} = \mathbb E_q\left[\frac{1}{2\tilde\beta_t}\big\lVert \tilde\mu_t(x_t,x_0)-\mu_\theta(x_t,t)\big\rVert_2^2\right].
$$

期望是對 $x_t$ 取的：從 $q$ 抽一個 $x_t$，算出兩個平均，相減平方，再對 $x_t$ 的隨機性平均。

### 剩下兩項：一項是零，一項長得跟其他項一樣（錄影 07:35–14:58）

**末端那項 $L_T$。** $p_\theta(x_T)$ 規定是標準高斯；而 $T$ 夠大時，雜訊把訊號洗掉，$q(x_T\mid x_0)$ 也趨近標準高斯。兩個分布相同，KL 是零（嚴格說是隨 $T$ 趨近零），直接當零。講義另外補了一個理由：這一項根本不含 $\theta$，就算不是零也不影響訓練。

**最後一步重建。** 這一項講義記作 $L_0$（字幕裡聽起來是「L1」，本文跟講義）。推導分四步。

第一步，反向模型是馬可夫鏈，給定 $x_1$ 之後 $x_2,\dots,x_T$ 不再提供資訊，所以 $p_\theta(x_0\mid x_{1:T}) = p_\theta(x_0\mid x_1)$。

第二步，$x_1\to x_0$ 這一步的模型之前沒指定過，就比照其他步設成高斯：$p_\theta(x_0\mid x_1)=\mathcal N(\mu_\theta(x_1,1),\sigma_1^2 I)$。

第三步，高斯密度取 log，指數外面的東西變成常數，留下指數裡面的二次式：

$$
\log p_\theta(x_0\mid x_1) = -\frac{1}{2\sigma_1^2}\big\lVert x_0-\mu_\theta(x_1,1)\big\rVert_2^2 + \text{常數}.
$$

第四步是一個記號上的安排：定義 $\tilde\mu_1(x_1,x_0) := x_0$。這樣上式就變成 $\lVert\tilde\mu_1-\mu_\theta(x_1,1)\rVert^2$ 乘一個係數，外型跟 $t\ge 2$ 的 $L_{t-1}$ 一樣。

這個定義不能只是硬湊外型，要檢查它跟 $t\ge 2$ 的 $\tilde\mu_t$ 公式是否一致。把一步到位公式用在 $t=1$（此時 $\bar\alpha_1=\alpha_1$、$1-\bar\alpha_1=\beta_1$），解出 $x_0$：

$$
x_0 = \frac{x_1-\sqrt{1-\bar\alpha_1}\,\hat\epsilon_1}{\sqrt{\bar\alpha_1}} = \frac{1}{\sqrt{\alpha_1}}\big(x_1-\sqrt{\beta_1}\,\hat\epsilon_1\big).
$$

而下一節會推出 $t\ge 2$ 時 $\tilde\mu_t = \frac{1}{\sqrt{\alpha_t}}\big(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\hat\epsilon_t\big)$。把 $t=1$ 代進去，$\frac{\beta_1}{\sqrt{1-\bar\alpha_1}}=\frac{\beta_1}{\sqrt{\beta_1}}=\sqrt{\beta_1}$，正好就是上面那條。所以同一條公式從 $t=1$ 用到 $t=T$ 都成立。講者的評語是：背後有比較根本的理由，但你也可以當成邊界上記號不同造成的巧合。

到這裡，要最大化的 ELBO 等於 $-\sum_{t=0}^{T-1} L_t$（講義式 (14.17)，$L_T$ 已經丟掉），也就是最小化所有時間步的平方誤差加總。下標的對應是：$L_0$ 管 $x_1\to x_0$，$L_{t-1}$ 管 $x_t\to x_{t-1}$，名字永遠比它用到的 $x_t$ 少一格。

### 丟掉係數，再看一次這個損失在比什麼（錄影 14:58–19:09）

講者接著提了一個實務上的細節：每一項前面的係數（$\frac{1}{2\tilde\beta_t}$、$\frac{1}{2\sigma_1^2}$），實作上大家直接丟掉，只留

$$
L_{t-1} = \mathbb E_q\,\big\lVert \tilde\mu_t(x_t,x_0)-\mu_\theta(x_t,t)\big\rVert_2^2 .
$$

然後他把兩個平均各自的意思重講一遍，這段值得停下來想：

- $\mu_\theta(x_t,t)$ 是模型只看 $x_t$ 時，對 $x_{t-1}$ 平均值的猜測。
- $\tilde\mu_t(x_t,x_0)$ 是真實過程在同時知道 $x_t$ 與 $x_0$ 時，對 $x_{t-1}$ 的重建。上一堂算出它是 $x_0$ 與 $x_t$ 的線性組合。

損失要模型的重建去貼近後者。這是可以直接實作的演算法：抽 $x_0$，跑前向過程得到 $x_t$，用公式算 $\tilde\mu_t$，把 $x_t$ 餵進網路得到 $\mu_\theta$，算平方誤差，反向傳播。

這裡補一個課堂沒明講、自學時常卡住的點（本文的補充）：模型看不到 $x_0$，怎麼可能貼近一個含 $x_0$ 的目標？答案在期望。平方誤差在期望下的最小解是條件平均，所以最佳的 $\mu_\theta(x_t,t)$ 是 $\mathbb E[\tilde\mu_t\mid x_t]$，也就是對所有「可能產生這個 $x_t$ 的 $x_0$」取平均。模型不必猜中單一筆資料的 $x_0$。

### 後驗平均怎麼來，以及改成預測雜訊（錄影 19:09–26:34）

講到這裡講者不確定上一堂有沒有把 $\tilde\mu_t$ 的來源交代清楚，回頭補了思路：條件在 $x_0$ 上時，$x_{t-1}$ 與 $x_t$ 是聯合高斯，而聯合高斯的任何條件分布仍是高斯，講義附錄有現成公式可以代。課堂只講了路線，下面的計算是本文依講義 Lemma A.1.2 補上的。上一堂的導讀走的是貝氏定理配方那條路，這裡換講義的走法，兩條路會得到同一組 $\tilde\mu_t$ 與 $\tilde\beta_t$。

給定 $x_0$，各維度獨立，只看一維：

- $x_{t-1}$ 的平均是 $\sqrt{\bar\alpha_{t-1}}x_0$，變異數是 $1-\bar\alpha_{t-1}$。
- $x_t=\sqrt{\alpha_t}x_{t-1}+\sqrt{\beta_t}\epsilon_t$，平均是 $\sqrt{\bar\alpha_t}x_0$，變異數是 $1-\bar\alpha_t$。
- 兩者的共變異數是 $\mathrm{Cov}(x_{t-1},\sqrt{\alpha_t}x_{t-1}+\sqrt{\beta_t}\epsilon_t)=\sqrt{\alpha_t}\,\mathrm{Var}(x_{t-1})=\sqrt{\alpha_t}(1-\bar\alpha_{t-1})$，因為 $\epsilon_t$ 與 $x_{t-1}$ 獨立。

條件高斯公式 $\mathbb E[A\mid B]=\mu_A+\frac{\mathrm{Cov}(A,B)}{\mathrm{Var}(B)}(B-\mu_B)$，令 $A=x_{t-1}$、$B=x_t$：

$$
\tilde\mu_t = \sqrt{\bar\alpha_{t-1}}x_0+\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}\big(x_t-\sqrt{\bar\alpha_t}x_0\big).
$$

$x_0$ 的係數是 $\sqrt{\bar\alpha_{t-1}}-\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}\sqrt{\bar\alpha_t}$。用 $\sqrt{\bar\alpha_t}=\sqrt{\alpha_t}\sqrt{\bar\alpha_{t-1}}$ 提出 $\sqrt{\bar\alpha_{t-1}}$，括號裡通分後的分子是 $(1-\bar\alpha_t)-\alpha_t(1-\bar\alpha_{t-1})=1-\bar\alpha_t-\alpha_t+\bar\alpha_t=\beta_t$。變異數用同一個引理的另一半，$\mathrm{Var}(A\mid B)=\mathrm{Var}(A)-\frac{\mathrm{Cov}(A,B)^2}{\mathrm{Var}(B)}$：

$$
\tilde\beta_t=(1-\bar\alpha_{t-1})-\frac{\alpha_t(1-\bar\alpha_{t-1})^2}{1-\bar\alpha_t}=\frac{(1-\bar\alpha_{t-1})\big[(1-\bar\alpha_t)-\alpha_t(1-\bar\alpha_{t-1})\big]}{1-\bar\alpha_t}=\frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}\beta_t .
$$

合起來：

$$
\tilde\mu_t(x_t,x_0)=\frac{\sqrt{\bar\alpha_{t-1}}\,\beta_t}{1-\bar\alpha_t}x_0+\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}x_t,\qquad \tilde\beta_t=\frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}\beta_t .
$$

係數看起來複雜，但就是兩個純量。接下來是課堂的主線。$x_t$、$x_0$、$\hat\epsilon_t$ 三者由一步到位公式線性綁在一起，知道任兩個就知道第三個，所以可以把 $x_0$ 換掉。代入 $x_0=\frac{1}{\sqrt{\bar\alpha_t}}(x_t-\sqrt{1-\bar\alpha_t}\hat\epsilon_t)$：

- $x_t$ 的係數：$\frac{\beta_t}{\sqrt{\alpha_t}(1-\bar\alpha_t)}+\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}=\frac{\beta_t+\alpha_t-\bar\alpha_t}{\sqrt{\alpha_t}(1-\bar\alpha_t)}=\frac{1}{\sqrt{\alpha_t}}$。
- $\hat\epsilon_t$ 的係數：$-\frac{\beta_t}{\sqrt{\alpha_t}(1-\bar\alpha_t)}\sqrt{1-\bar\alpha_t}=-\frac{\beta_t}{\sqrt{\alpha_t}\sqrt{1-\bar\alpha_t}}$。

於是

$$
\tilde\mu_t=\frac{1}{\sqrt{\alpha_t}}\left(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\,\hat\epsilon_t\right).
$$

現在目標只含 $x_t$ 與 $\hat\epsilon_t$。$x_t$ 是網路的輸入，本來就知道。講者的說法是：已經知道的部分何必讓網路去學，把它寫死在公式裡，只讓網路負責未知的那一塊。所以把模型的平均也照同一個外型參數化，網路 $\epsilon_\theta$ 只輸出雜訊的估計：

$$
\mu_\theta(x_t,t)=\frac{1}{\sqrt{\alpha_t}}\left(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\,\epsilon_\theta(x_t,t)\right).
$$

兩式相減，$x_t$ 那一項完全消掉：

$$
\tilde\mu_t-\mu_\theta=-\frac{\beta_t}{\sqrt{\alpha_t}\sqrt{1-\bar\alpha_t}}\big(\hat\epsilon_t-\epsilon_\theta(x_t,t)\big),
$$

平方後乘回原本的 $\frac{1}{2\tilde\beta_t}$：

$$
L_{t-1}=\frac{\beta_t^2}{2\tilde\beta_t\,\alpha_t(1-\bar\alpha_t)}\ \mathbb E\,\big\lVert\hat\epsilon_t-\epsilon_\theta(x_t,t)\big\rVert_2^2 .
$$

> "So basically, you turn this reconstruction into a noise prediction problem."（25:31）

$\hat\epsilon_t$ 是當初為了造出 $x_t$ 加進去的雜訊，網路的工作是看著 $x_t$ 把它猜回來。然後前面的係數再丟一次，只留 $\lVert\hat\epsilon_t-\epsilon_\theta\rVert^2$。

兩次「丟係數」要分清楚（這一段是本文的補充，課堂上兩次都只說把係數丟掉）。在 $\mu$ 的形式下丟掉 $\frac{1}{2\tilde\beta_t}$，和在 $\epsilon$ 的形式下丟掉整個係數，得到的是兩個不同的加權，中間差一個隨 $t$ 變的因子 $\frac{\beta_t^2}{\alpha_t(1-\bar\alpha_t)}$。課堂最後採用、也是講義 (14.28) 寫的，是 $\epsilon$ 形式下不加權的版本。

### 訓練五步，取樣一個迴圈（錄影 26:34–32:04）

**訓練**（對應講義 p.187–188）：

1. 從訓練集抽一筆 $x_0$。
2. 從 $1$ 到 $T$ 均勻抽一個時間步 $t$。原本的目標是 $T$ 項加總，這裡每次隨機挑一項來算，跟隨機梯度下降每次抽一筆資料是同樣的想法。
3. 抽雜訊 $\epsilon\sim\mathcal N(0,I)$。
4. 造出 $x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\,\epsilon$。
5. 對 $L_t(\theta)=\lVert\epsilon-\epsilon_\theta(x_t,t)\rVert_2^2$ 算梯度，更新 $\theta$。

多數教材把 $\hat\epsilon_t$ 直接寫成 $\epsilon$。講者的說法是，反正它是一個隨機變數，叫什麼名字都一樣。講義把理由寫得比較完整：不同 $t$ 的 $\hat\epsilon_t$ 彼此相關、不是獨立同分布，但每次訓練只用到一個時間步，只需要它的邊際分布是標準高斯，下標就沒有用處了。第 5 步的損失名字跟著講義式 (14.28) 寫成 $L_t(\theta)$，下標是抽到的時間步；它對應 ELBO 分解裡的 $L_{t-1}$，差的那一格只是命名。

**取樣**：

1. 抽 $x_T\sim\mathcal N(0,I)$。
2. 對 $t=T,T-1,\dots,1$：算 $\epsilon_\theta(x_t,t)$，代進上面的公式得到 $\mu_\theta(x_t,t)$，再取 $x_{t-1}=\mu_\theta(x_t,t)+\sigma_t\xi$，$\xi\sim\mathcal N(0,I)$。

反向過程每一步自己也帶雜訊，所以要加 $\sigma_t\xi$；前面選了 $\sigma_t^2=\tilde\beta_t$，所以 $\sigma_t=\sqrt{\tilde\beta_t}$。講義多一個課堂沒提的細節：最後一步（$t=1$）令 $\xi=0$，不再加雜訊。

### 把一步訓練與一步取樣算一遍

以下是本文自擬的例子，不是課堂內容。資料是一維的，取 $\beta_1=0.1$、$\beta_2=0.2$，看 $t=2$ 這一步。

**先算排程量。** $\alpha_1=0.9$、$\alpha_2=0.8$，$\bar\alpha_1=0.9$、$\bar\alpha_2=0.72$，$\tilde\beta_2=\frac{1-0.9}{1-0.72}\times0.2=0.0714$。

**造 $x_2$。** 取 $x_0=1$、抽到雜訊 $\hat\epsilon=0.5$：

$$
x_2=\sqrt{0.72}\times1+\sqrt{0.28}\times0.5=0.8485+0.2646=1.1131 .
$$

**用兩種寫法算後驗平均。** 含 $x_0$ 的寫法：$x_0$ 的係數是 $\frac{\sqrt{0.9}\times0.2}{0.28}=0.6776$，$x_2$ 的係數是 $\frac{\sqrt{0.8}\times0.1}{0.28}=0.3194$，所以 $\tilde\mu_2=0.6776\times1+0.3194\times1.1131=1.0332$。含雜訊的寫法：$\frac{\beta_2}{\sqrt{1-\bar\alpha_2}}=\frac{0.2}{0.5292}=0.3780$，$\tilde\mu_2=\frac{1}{\sqrt{0.8}}(1.1131-0.3780\times0.5)=1.1180\times0.9241=1.0332$。兩條路得到同一個數，前一節的代換沒有算錯。

**算損失。** 假設網路這時輸出 $\epsilon_\theta(x_2,2)=0.3$（真實是 $0.5$）。雜訊預測損失是 $(0.5-0.3)^2=0.04$。換成平均來看，$\mu_\theta=1.1180\times(1.1131-0.3780\times0.3)=1.1177$，$\tilde\mu_2-\mu_\theta=-0.0845$，平方是 $0.00714$。兩者的比值 $0.00714/0.04=0.1786$，正是 $\frac{\beta_2^2}{\alpha_2(1-\bar\alpha_2)}=\frac{0.04}{0.8\times0.28}$。完整帶權重的 ELBO 項是 $\frac{0.00714}{2\times0.0714}=0.05$，等於 $1.25\times0.04$。

**走一步取樣。** 若這是生成時的一步，抽到 $\xi=-1$，則 $x_1=1.1177+\sqrt{0.0714}\times(-1)=1.1177-0.2673=0.8505$。

這組數字說明三件事。比較平均和比較雜訊是同一個誤差，只差一個由排程決定的倍數（這裡是 $0.1786$）。丟掉係數等於把每個時間步的倍數都改成 $1$。只看單一個 $t$ 的話，損失乘上一個正的常數，最小值落在同一個 $\epsilon_\theta$，最佳解不變；改變的是各時間步之間的相對比重，同一個網路要兼顧所有 $t$、又不可能每一步都學到最佳解時，比重會決定它把誤差留在哪些時間步。還有，雜訊猜低了 $0.2$，模型的平均就偏高 $0.0845$，方向相反，因為公式裡雜訊前面是負號。

### 擴散模型為什麼好學，以及一個學生提問（錄影 32:04–36:40）

講者先聲明沒有很強的理論能證明一切，以下是直覺。第一，其中一個方向是固定的加噪函數，不必同時參數化前向與反向；以前有人試過兩邊都用可學的函數，最佳化比較難。第二，代價是時間軸拉得很長（一開始的做法 $T$ 是 1,000），但拉長之後每一步的重建在局部上變簡單：從純白雜訊開始，先出輪廓與大致樣子，再逐步銳化、補細節。神經網路原則上什麼都表示得出來，但怎麼表示、怎麼學仍然有差，擴散模型的做法是把一個大的生成任務拆成許多好學的小步。

有學生問參數到底怎麼更新，講者的回答可以當成這門課後半的閱讀方式：損失函數定義好之後，剩下的都算得出來，在 PyTorch 裡寫好網路與損失，算梯度、走一步。新的應用或演算法多半是在損失這一層創新；最佳化器那一層也可以創新，而且換了之後擴散模型、語言模型、線性迴歸都能用。接下來的課主要談資料、架構、損失函數與訓練流程，不再談梯度怎麼算。

## 後半堂：基礎模型的典範與適應方法

### 預訓練加適應（錄影 36:40–46:51）

講者先講「foundation model」這個詞的來歷。GPT-3 在 2020 年夏天出來後，Stanford 的教授們聚在一個房間玩 OpenAI playground。當時沒有 ChatGPT，只有一個文字框，你寫的和模型生成的出現在同一格，可以調溫度之類的超參數，右邊有下拉選單選模型。後來 Percy Liang 帶隊研究這個新典範，寫了一篇綜述並取了這個名字。講者說他前一天去查，那篇綜述的摘要把它稱為 emergent paradigm，他自己的講義也這樣寫：

> "But I think after three years, we probably should just not call it emergent paradigm. It's the new paradigm."（38:26）

他也提醒，五年前講這個典範時涵蓋的技術比較廣，其中一些現在已經過時；接下來一兩堂會講 2019 到 2022 年間流行的做法，再講 2022 年之後的主流。

典範分兩個階段。

**預訓練（pretraining）。** 用大量沒有標註的資料，量級比以前高出好幾個數量級，而且資料很雜：網路上抓得到的都抓，HTML 檔連標籤一起、Word 檔、其他格式的文件都收。早期幾個版本的訓練資料相當亂，後來才逐步清理。寫成式子很平凡，$\theta$ 是參數，每筆資料有一個損失，取平均：

$$
L_{\text{pre}}(\theta)=\frac{1}{n}\sum_{i=1}^{n}\ell_{\text{pre}}\big(x^{(i)},\theta\big).
$$

跟監督式學習的差別只有兩個：沒有標籤，$n$ 非常大。$\ell_{\text{pre}}$ 具體是什麼，留到後面的課。最佳化得到的參數記作 $\hat\theta$。

**適應（adaptation）。** 從一個好的基礎出發，調到各種下游任務。以前的做法是一個任務訓練一個模型，做多任務的人頂多同時訓練三個。現在任務數量幾乎沒有上限，講者說 GPT 的論文評估了大概一百個任務，到後來「任務」這個概念本身都變得不好定義。

適應要看兩件事：手上有多少、什麼樣的下游資料，以及用什麼技術。資料面，下游資料集是 $n_{\text{task}}$ 組 $(x_{\text{task}}^{(i)},y_{\text{task}}^{(i)})$：

- $n_{\text{task}}$ 很小，大約 5 到 10 筆，叫 **few-shot**。
- $n_{\text{task}}=0$，只用文字描述任務就請模型解，叫 **zero-shot**。

講者說 GPT-3 的突破之一就是有時連 few-shot 都不必，而現在幾乎沒有人為了適應模型去蒐集下游標註了。但在 2019 到 2022 年，有標註的下游資料集仍是主流，例如蒐集一小份情感分類資料再去調模型。技術面，這堂與下一堂講「會更新參數」的適應方法，之後才講只靠提示（prompt）、不動參數的做法。

### 表徵與 linear probe（錄影 46:51–54:50）

要講有標註資料時的適應，得先有表徵學習這個概念。它是預訓練的一種：訓練的不是聊天模型，而是一個把資料變成向量的模型

$$
\phi_\theta:\ x\ \mapsto\ \phi_\theta(x)\in\mathbb R^m .
$$

這個向量叫表徵（representation），也叫特徵（feature）或嵌入（embedding）。訓練完得到 $\hat\theta$，也就得到一個固定的函數 $\phi_{\hat\theta}$，任何資料丟進去都會出來一個向量。訓練它用的損失是下一堂的內容。

**Linear probe** 是在這個固定的表徵上面加一個線性頭（linear head）：一個 $m$ 維向量 $w$，預測值是內積 $w^\top\phi_{\hat\theta}(x)$，分類時再接 softmax。以迴歸為例：

$$
\min_{w\in\mathbb R^m}\ \frac{1}{n_{\text{task}}}\sum_{i=1}^{n_{\text{task}}}\Big(y_{\text{task}}^{(i)}-w^\top\phi_{\hat\theta}\big(x_{\text{task}}^{(i)}\big)\Big)^2 .
$$

$\hat\theta$ 固定，每筆資料的 $\phi_{\hat\theta}(x)$ 就是一個固定的向量，變數只有 $w$。這跟課程最前面學的線性迴歸是同一個問題，只是輸入特徵從原始的 $x$ 換成了表徵。它比手工設計特徵、或直接在原始 $x$ 上做線性模型好得多，原因是 $y$ 通常不是 $x$ 的線性函數，但表徵把語意上重要的資訊轉成可以線性取用的樣子。

講者順帶提到，linear probe 現在仍是語言模型機制可解釋性研究的工具：就算不用它解任務，也可以拿來探查模型內部表示了什麼。

這段有兩個學生提問。

一個問基礎模型是分領域做還是通用的。講者說三四年前視覺和語言各有各的表徵學法；現在大家要多模態能力，一個模型同時吃影像、文字甚至影片，所以方法得統一，2026 年許多模型被稱為 omni 或多模態模型。這堂講的表徵學習加線性分類比較常見於視覺，醫學影像仍在用：先取表徵，再針對每一種影像任務用一小份資料訓練一個小的線性頭。

另一個問得更尖：憑什麼假設下游任務對表徵是線性的？講者說這不算假設，預訓練的損失本身就在把表徵往「可以線性使用」的方向推，下一堂看到具體的損失就明白。

### Finetune、初始化與 LP-FT（錄影 54:50–1:02:20）

**Finetune** 跟 linear probe 的差別只有一處：$\theta$ 也變成變數。

$$
\min_{w,\theta}\ \frac{1}{n_{\text{task}}}\sum_{i=1}^{n_{\text{task}}}\ell_{\text{task}}\Big(y_{\text{task}}^{(i)},\ w^\top\phi_{\theta}\big(x_{\text{task}}^{(i)}\big)\Big),\qquad \theta\leftarrow\hat\theta,\quad w\leftarrow\text{隨機}.
$$

講者在這裡指出一件值得想的事。這個損失函數本身完全沒有預訓練的痕跡。你可以用一模一樣的損失，從隨機的 $w$ 和隨機的 $\theta$ 開始，那就是從頭訓練一個巨大的模型。預訓練唯一進入這個問題的地方是 $\theta$ 的起點，而結果好很多。

> "because it's the same loss function. Just initialization are different."（56:19）

他的推論是：這個損失有非常多個全域最小值，可能上百萬個，而且彼此不一樣。下游資料少，訓練損失幾乎一定能壓到零，所以「好壞」指的是測試表現。從隨機起點出發會落在某個訓練損失為零但測試表現差的解；從預訓練的 $\hat\theta$ 出發，會落在另一個訓練損失同樣為零但測試表現好得多的解。

有學生追問預訓練的產出到底是什麼。答案是 $\hat\theta$，一組在既定架構下的具體數字。架構要先定好，預訓練與適應必須用同一個架構，否則那組數字沒有辦法解讀。

**LP-FT** 是先 linear probe 再 finetune。記損失為 $L(w,\theta)$：

1. LP：固定 $\theta=\hat\theta$，只對 $w$ 最小化，得到 $w_0$。
2. FT：從 $(w_0,\hat\theta)$ 出發，同時對 $w$ 與 $\theta$ 最小化。

講者說如果要走這條路，LP-FT 大概是目前最主要的做法。至於為什麼比較好：

> "I think we don't know exactly either."（1:01:27）

他說有一些理論在談這件事，自己給的粗略解釋是：直接 finetune 時，$w$ 是隨機的，$\theta$ 是預訓練好的，隨機的 $w$ 有時會把表徵弄壞一點。先固定 $\hat\theta$ 讓 $w$ 配合表徵，再一起訓練，表徵仍會改變，但改變的幅度比用隨機頭時小。

### LoRA：只在低秩方向上改（錄影 1:02:20–1:07:36）

LoRA（low-rank adaptation）跟你用什麼損失做適應無關，只要是在最小化某個損失、不是 zero-shot，就能套用。

動機是這樣：finetune 會改 $\theta$ 裡所有參數，而預訓練模型有幾十億個參數，下游資料卻只有一點點。「適應」這個詞本身就意味著不必改太多。全部都改容易過度配適，也殺雞用牛刀。那只改一部分參數行不行？難處是你不知道該挑哪一部分。LoRA 的解法是每個參數都可以動，但限制「改變量」的自由度。

對一個權重矩陣，把模型重新參數化成

$$
W = W_0 + AB,\qquad A\in\mathbb R^{d\times r},\quad B\in\mathbb R^{r\times d},
$$

其中 $W_0$ 是預訓練得到的矩陣，固定不動，只訓練 $A$ 和 $B$。原本的 finetune 是從 $W_0$ 出發最小化 $L(W)$；LoRA 是最小化 $L(W_0+AB)$，變數是 $A$、$B$。

**自由度。** $d\times d$ 的矩陣有 $d^2$ 個自由度，$A$、$B$ 合計 $2dr$。課堂的數字是 $d=1000$、$r=10$：$d^2=1{,}000{,}000$，$2dr=20{,}000$，只有原本的 2%。

**初始化。** 令 $A=0$、$B$ 隨機。這樣 $AB=0$，起點的 $W_0+AB$ 就是 $W_0$，模型在第一步之前的行為跟預訓練模型完全相同。

用一個極小的例子確認機制（本文自擬）。取 $d=2$、$r=1$，

$$
W_0=\begin{pmatrix}1&2\\3&4\end{pmatrix},\quad A=\begin{pmatrix}0\\0\end{pmatrix},\quad B=\begin{pmatrix}1&-1\end{pmatrix},\quad x=\begin{pmatrix}1\\0\end{pmatrix}.
$$

初始時 $AB$ 是零矩陣，輸出是 $W_0x=(1,3)^\top$。假設訓練幾步後 $A=(0.1,0.2)^\top$，則 $AB=\begin{pmatrix}0.1&-0.1\\0.2&-0.2\end{pmatrix}$，輸出變成 $(1.1,3.2)^\top$。更新量 $AB$ 的兩列成比例，秩是 1，但 $W_0+AB$ 本身仍是滿秩。低秩的是改變量，調整後的矩陣並不低秩，講義 p.195 特別強調這一點。另外這個例子的 $2dr=4$ 等於 $d^2=4$，一個參數都沒省；$r$ 要小於 $d/2$ 才開始省。

有學生問，為什麼不直接加一個 $d\times d$ 的矩陣？因為那樣又回到 $d^2$ 個自由度。又問 $AB$ 這種乘積會不會帶進某種對稱的偏差？講者說 $A$ 和 $B$ 不相等，沒有額外的對稱性，限制就只是低秩；而低秩本身確實是一種偏差。

課堂的寫法跟講義有三處不同，查資料時要留意。講義把更新寫成 $\Delta W=BA$，$B\in\mathbb R^{d_{\text{out}}\times r}$、$A\in\mathbb R^{r\times d_{\text{in}}}$，兩個字母的角色跟課堂對調。初始化為零的在兩邊其實是同一個因子，都是乘積左邊、形狀 $d\times r$ 的那一個，只是課堂叫它 $A$、講義叫它 $B$（講義舉的例子是 $B=0$）。本文正文一律用課堂的 $W_0+AB$；講義允許非方陣 $W_0\in\mathbb R^{d_{\text{out}}\times d_{\text{in}}}$，可訓練參數是 $r(d_{\text{out}}+d_{\text{in}})$；講義還有一個縮放係數，$h=W_0x+\frac{\alpha}{r}BAx$，課堂沒有提。

把這堂的四種適應方法並排（本文整理，$W_0$ 指 $\hat\theta$ 裡被 LoRA 改寫的權重矩陣）：

| 方法 | 訓練哪些參數 | 起點 | 預訓練權重會不會變 |
|---|---|---|---|
| Linear probe | 只有 $w$ | $w$ 隨機 | 不變，固定在 $\hat\theta$ |
| Finetune | $w$ 與 $\theta$ | $w$ 隨機、$\theta=\hat\theta$ | 全部都會變 |
| LP-FT | 先只有 $w$，再 $w$ 與 $\theta$ | 第二階段從 $(w_0,\hat\theta)$ 出發 | 第二階段會變，幅度通常較小 |
| LoRA | 每個被改寫的矩陣只訓練 $A$、$B$ | $A=0$、$B$ 隨機 | $W_0$ 不變，實際使用的是 $W_0+AB$ |

前三種的差別在「哪些參數是變數、從哪裡出發」；LoRA 是另一個維度的選擇，規定權重的改變量長什麼樣，可以跟前面任何一種會更新 $\theta$ 的做法搭配。

### LoRA 省了什麼（錄影 1:07:36–1:15:45）

最後八分鐘是這堂後半最有用的部分。講者不直接給答案，而是一項一項檢查。

**運算：幾乎沒省。** 學生先回答「參數變少」，講者說對，但參數少不代表比較快。前向傳播每一層仍要算 $(W_0+AB)x$，$W_0x$ 這一塊省不掉，而它才是瓶頸，$ABx$ 很便宜。反向傳播要把梯度往回傳，仍要乘 $W_0^\top$。反向傳播裡有兩種導數：對 activation 的和對權重的。對 activation 的那條完全沒省；對權重的那條因為可訓練參數少，省了一點。

> "So largely speaking, your compute don't really change much."（1:08:37）

**記憶體：省一些，但不到天壤之別。** $W_0$ 還是要放在記憶體裡。訓練時記憶體裡除了參數，還有梯度和最佳化器的狀態（一位學生提到 Adam 要追蹤動量）。這些只對可訓練參數存，所以 LoRA 只需要為 $A$、$B$ 存，這是省下來的部分。講者順口說梯度加最佳化器狀態比參數本身貴上「12 倍還是 6 倍」，自己也說記不清楚，這個倍數不要當成事實引用。接著他補了一個系統面的觀察，並說不期待每個人都懂：大規模多 GPU 訓練時，梯度與動量可以分片（shard）放在不同 GPU 上，本來就未必是記憶體的瓶頸。講義的寫法是：基底權重 $W_0$，以及反向傳播要保留的 activation，都不會因為低秩參數化而變少；當這兩樣佔記憶體的大宗時，LoRA 在訓練時省下的記憶體就有限。兩點合起來，記憶體有省，但講者的形容是稱不上天壤之別。

**真正有差的兩個情境。** 第一個是記憶體剛好卡在邊緣：省下一成就能從兩張 GPU 變成一張，這種時候任何節省都很重要，但只發生在 GPU 很少的情況。第二個是講者認為最主要的好處，多人共用同一個 $W_0$：

> "So in my opinion, that's probably the major benefit of LORA, which you can serve many, many users."（1:15:45）

每個使用者有自己的 $(A_1,B_1),(A_2,B_2),\dots,(A_k,B_k)$，$W_0$ 只存一份。推論時誰的請求進來就換上誰的低秩矩陣。可以把很大一部分使用者的 adapter 預先載入 GPU 記憶體，切換很快；沒預載的從 CPU 載入，小矩陣也比完整矩陣快得多。他舉商用模型的 finetune 服務為例（點名 GPT 與 Gemini），說這些服務給使用者的是 LoRA 式的 finetune，並認為原因就在這裡。這是講者在課堂上的說法與推測；各家服務內部怎麼做不一定有公開說明，不要把它當成已確認的事實引用。

他口頭給的數字是每人約 1 億個參數、1,000 個使用者、合計「大概 100 億」。照乘是 $10^8\times10^3=10^{11}$，也就是 1,000 億，口頭的數字對不起來。結論不受影響：對照組是每人存一整份完整權重，而每人一組低秩矩陣比它小得多。

講義 p.195 還有兩點課堂沒講到：同樣的共用想法也適用於多租戶訓練（多個訓練工作共用基底權重）；以及 LoRA 是表達能力上的取捨，下游分布跟預訓練差很遠或需要大幅調整時，全參數訓練可能仍然比較好。

## 自我檢查

1. **取 $\beta_1=0.1$、$\beta_2=0.2$、$x_0=1$、$\hat\epsilon=0.5$，網路輸出改成 $\epsilon_\theta=0.9$。雜訊預測損失、$\mu_\theta$、帶權重的 $L_1$ 各是多少？**
   答：損失是 $(0.5-0.9)^2=0.16$。$\mu_\theta=1.1180\times(1.1131-0.3780\times0.9)=0.8642$，比 $\tilde\mu_2=1.0332$ 低 $0.1690$；雜訊猜高，平均就偏低。帶權重的項是 $1.25\times0.16=0.2$。判準：你算出的 $(\tilde\mu_2-\mu_\theta)^2$ 除以 $0.16$ 應該是 $0.1786$。

2. **為什麼要定義 $\tilde\mu_1(x_1,x_0):=x_0$？這個定義跟 $t\ge2$ 的公式一致嗎？**
   答：為了讓最後一步重建項 $\lVert x_0-\mu_\theta(x_1,1)\rVert^2$ 跟其他項有同樣的外型。一致性的檢查是把 $t=1$ 代進 $\frac{1}{\sqrt{\alpha_t}}(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\hat\epsilon_t)$，用 $1-\bar\alpha_1=\beta_1$ 得到 $\frac{1}{\sqrt{\alpha_1}}(x_1-\sqrt{\beta_1}\hat\epsilon_1)$，而這正是從 $x_1=\sqrt{\alpha_1}x_0+\sqrt{\beta_1}\hat\epsilon_1$ 解出的 $x_0$。

3. **訓練時為什麼可以把 $\hat\epsilon_t$ 寫成沒有下標的 $\epsilon$，明明不同 $t$ 的 $\hat\epsilon_t$ 是相關的？**
   答：每次更新只抽一個時間步，損失只用到那一個 $\hat\epsilon_t$，只需要它的邊際分布是 $\mathcal N(0,I)$。跨時間步的相關性在單一步的損失裡不出現。

4. **Finetune 的損失函數裡看不到預訓練，預訓練是怎麼起作用的？**
   答：只透過 $\theta$ 的初始值。下游資料少，損失有很多訓練誤差為零的最小值，它們的測試表現不同；起點決定最佳化落在哪一個。能說出「訓練損失都接近零，差別在測試表現」才算答對。

5. **某一層是 $4096\times4096$ 的矩陣，LoRA 取 $r=8$。可訓練參數是完整 finetune 的幾分之幾？前向傳播的運算量大約省了多少？**
   答：$2dr=65{,}536$，$d^2=16{,}777{,}216$，約 $0.39\%$，也就是 $1/256$。前向運算幾乎沒省，因為 $W_0x$ 仍要算，還多了一點 $ABx$。若回答「運算也省到 1/256」，就是把可訓練參數量和運算量混為一談。

## 對應閱讀

主講義 [main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)（2026 年 8 月版）：

- **第 14.3 節 Training diffusion models by maximizing the ELBO**（pp.184–188）：ELBO 分解 (14.15)–(14.17)、後驗平均 (14.18)–(14.19)、改寫成雜訊 (14.22)–(14.24)、$L_0$ 項 (14.25)–(14.26)、訓練與取樣演算法 (14.27)–(14.29)。條件高斯公式在附錄 Lemma A.1.2。
- **第 14.4 節 Continuous-time view of reverse diffusion**（pp.188–190）：用隨機微分方程與 score 解釋反向過程為什麼是高斯。這一節課堂完全沒講。
- **第 15 章 Foundation models overview**（pp.191–195）：15.1 節是 linear probe、finetune、LP-FT，15.2 節是 LoRA。

課堂與講義不同的地方：

- 末端那項，課堂說 $T\to\infty$ 時是零；講義另外指出它不含 $\theta$，所以可以直接從目標中拿掉。
- 取樣的最後一步，講義令 $\xi=0$；課堂沒提。
- LP-FT 的原理，課堂說還不完全清楚；講義引用 Kumar et al. (2022)，說這個方法是為了減少 finetune 對特徵的扭曲，在某些設定下能改善分布外的表現。
- 講義 15.1 節提到「繼續預訓練」（用預訓練的損失在新資料上接著訓練）；課堂沒講。
- LoRA 的記號、縮放係數 $\alpha/r$、表達能力的取捨，如上一節所列。

**系列導覽**：上一篇 [第 11 堂：擴散模型](/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models)｜下一篇 [第 13 堂：對比學習與語意檢索](/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search)

## 課程影片來源

原始影片：[Stanford CS229 Machine Learning | Spring 2026 | Lecture 12: Representation Learning](https://www.youtube.com/watch?v=_kREM2UAiJ8)

- [Stanford CS229 Machine Learning｜Spring 2026 播放清單（Stanford Online，17 支）](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 課程官網](https://cs229.stanford.edu/)
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

查核日期：2026-10-12。

內容核對：已依字幕核對（2026-10-12）：全篇依這支錄影的英文字幕逐段對照，時間區段取自字幕時間戳；未看板書畫面，公式依主講義第 14、15 章還原，字幕明顯聽錯的地方（例如把 linear head 聽成 linear hat）已照講義更正。

## 參考資料

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 12: Representation Learning（YouTube）](https://www.youtube.com/watch?v=_kREM2UAiJ8)：本文的底本，課堂說法與引句都出自這支錄影的英文字幕。
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：第 14.3 節（pp.184–188）用來還原板書公式與編號，第 15 章（pp.191–195）用來對照 linear probe、finetune、LP-FT 與 LoRA 的寫法。
- [Stanford CS229 Machine Learning｜Spring 2026 播放清單](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)：確認堂次與影片標題。
- [CS229 課程官網](https://cs229.stanford.edu/)：課程入口。
- [Stanford CS229 課程總覽](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：本系列的總覽與閱讀路線。

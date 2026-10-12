---
title: "Baseline、PPO 與可驗證獎勵：只對答案給分，怎麼訓練出長思維鏈｜Stanford CS229 第 20 堂"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, reinforcement-learning, ppo, rlvr]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 17
tldr: "學期最後一堂把 policy gradient 收尾：過去的獎勵與只依賴狀態的 baseline 都可以從權重裡拿掉而不改變期望值。接著用重要性取樣推出 PPO 的截斷目標函數，拆成四種情況看哪些樣本還有梯度，再比較 CISPO 的改法。最後把語言模型逐 token 生成寫成 MDP，只在答案對的時候給 1 分，用同一題 8 個樣本的平均當 baseline 訓練長思維鏈。"
description: "Stanford CS229（Spring 2026）第 20 堂導讀：reward-to-go 與 baseline 的推導、PPO 截斷目標的四種情況、CISPO、思維鏈，以及用可驗證獎勵的強化學習訓練語言模型推理。"
draft: false
math: true
---

> 🌏 [English version](/posts/ai/2026-10-12-stanford-cs229-lecture-20-ppo-rl-for-reasoning-en)

**影片狀態：已附影片。** 這篇依 Stanford Online 公開的 Spring 2026 第 20 堂錄影的英文字幕寫成，公式記號對照 2026 主講義第 21 章（Policy Gradient and its Variants）與第 18 章（Reasoning in LLMs）；沒看到板書畫面，板書上的式子是靠字幕口述與講義還原的。

YouTube 標題的主題文字「GMM (EM), PCA」與內容不符，以下依實際內容：這堂講的是 policy gradient 的收尾、PPO，以及用強化學習訓練大型語言模型的長思維鏈。

這是 [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)的最後一堂（第 19 堂的時段是假日，沒有上課）。它接在[上一堂的強化學習基礎與 policy gradient](/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient) 後面，你需要記得上一堂的結論：策略 $\pi_\theta(a\mid s)$ 是一個機率分布，目標是總報酬的期望值，而它的梯度可以寫成「log 機率的梯度乘上報酬」。這堂從那條式子出發做三件事：把權重簡化成 reward-to-go 減 baseline、推出 PPO 的截斷目標函數、再把整套東西搬到語言模型上。讀完你應該能自己算出一個樣本在 PPO 目標裡有沒有梯度，也能說明為什麼「只檢查最後答案」就足以訓練出會先想再答的模型。講者是 Tengyu Ma（主講義的作者之一，他在課堂上提到某個例子寫在「my lecture notes」裡）。

```youtube
url: https://www.youtube.com/watch?v=J7CossjMvEg
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 20: GMM (EM), PCA
captions: en
```

## 從上一堂的式子出發：policy gradient 在做加權的最大概似

（錄影 00:00–03:40）

目標函數是軌跡 $\tau=(s_0,a_0,\dots,s_{T-1},a_{T-1},s_T)$ 的總報酬期望值：

$$
\eta(\theta)=\mathbb E_{\tau\sim P_\theta}\Bigl[\sum_{t=0}^{T-1}\gamma^{t}R(s_t,a_t)\Bigr]
$$

麻煩在於期望值裡面的東西完全沒有 $\theta$。$\theta$ 藏在「動作是從 $\pi_\theta$ 抽出來的」這件事裡，所以不能把梯度直接搬進期望值裡面，那樣得到的是零。上一堂推出來的替代寫法是：

$$
\nabla_\theta\eta(\theta)=\mathbb E_{\tau\sim P_\theta}\Bigl[\Bigl(\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(a_t\mid s_t)\Bigr)\Bigl(\sum_{t'=0}^{T-1}\gamma^{t'}R(s_{t'},a_{t'})\Bigr)\Bigr]
$$

講者這堂先補上一堂沒來得及講的直覺。第一個括號是整條軌跡上所有動作的 log 機率的梯度，沿著它走就是在提高「這條軌跡被抽到」的機率，跟監督式學習裡的最大概似一樣。第二個括號是這條軌跡的總報酬，在這裡扮演權重。報酬高的軌跡，概似被推得用力；報酬是 0 的軌跡權重是 0，等於沒有被推。所以 policy gradient 做的事可以一句話講完：對自己抽出來的軌跡做最大概似，但每條軌跡的力道由報酬決定。

接下來的三節都在改這個權重：先準備一個事實，再用它拿掉過去的獎勵、減掉 baseline。

## 一個關鍵事實：沒有權重時，梯度的期望值是零

（錄影 03:40–07:12）

先看一般的情況。$x$ 從某個帶參數的分布 $p_\theta$ 抽出來，那麼

$$
\mathbb E_{x\sim p_\theta}\bigl[\nabla_\theta\log p_\theta(x)\bigr]=0
$$

推導只有四步，每一步都要看得懂：

$$
\begin{aligned}
\mathbb E_{x\sim p_\theta}\bigl[\nabla_\theta\log p_\theta(x)\bigr]
&=\int p_\theta(x)\,\nabla_\theta\log p_\theta(x)\,dx &&\text{期望值寫成積分}\\
&=\int p_\theta(x)\,\frac{\nabla_\theta p_\theta(x)}{p_\theta(x)}\,dx &&\text{連鎖律，}(\log u)'=1/u\\
&=\int\nabla_\theta p_\theta(x)\,dx &&\text{上下的 }p_\theta(x)\text{ 消掉}\\
&=\nabla_\theta\int p_\theta(x)\,dx=\nabla_\theta 1=0 &&\text{梯度與積分交換，機率積分為 1}
\end{aligned}
$$

套到策略上，就是對任何固定的狀態 $s_t$：

$$
\mathbb E_{a_t\sim\pi_\theta(\cdot\mid s_t)}\bigl[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\bigr]=0
$$

講者給的解讀是：沒有權重，就表示你不知道哪個動作好、哪個動作壞，那梯度本來就該是零。

這個事實還有一個立刻可用的推論。把上式乘上任何一個**不依賴 $a_t$** 的量 $c$，結果仍然是零，因為 $c$ 可以提到期望值外面。後面兩節就是在找「哪些東西對 $a_t$ 來說是常數」。

## 過去的獎勵可以丟掉：reward-to-go

（錄影 07:12–15:28）

把梯度公式裡兩個括號乘開，先固定一個時間 $t$，只看 $\nabla_\theta\log\pi_\theta(a_t\mid s_t)$ 這一項。它乘上的總報酬可以按時間切成兩段：

$$
\sum_{t'=0}^{T-1}\gamma^{t'}R(s_{t'},a_{t'})=\underbrace{\sum_{t'<t}\gamma^{t'}R(s_{t'},a_{t'})}_{\text{過去}}+\underbrace{\sum_{t'\ge t}\gamma^{t'}R(s_{t'},a_{t'})}_{R_{\ge t}}
$$

後面那段 $R_{\ge t}$ 叫 **reward-to-go**，是從 $t$ 開始還拿得到的獎勵。課堂上的主張是：「過去」那段乘上 $\nabla_\theta\log\pi_\theta(a_t\mid s_t)$ 之後，期望值是零。

證明用的是全期望值定理（law of total expectation）：先固定 $t$ 時刻以前發生的一切，也就是 $h_t=(s_0,a_0,\dots,s_{t-1},a_{t-1},s_t)$，只對 $a_t$ 取期望值，然後再對 $h_t$ 取期望值。

$$
\mathbb E\Bigl[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\cdot\sum_{t'<t}\gamma^{t'}R(s_{t'},a_{t'})\Bigr]
=\mathbb E_{h_t}\Bigl[\,\underbrace{\sum_{t'<t}\gamma^{t'}R(s_{t'},a_{t'})}_{\text{給定 }h_t\text{ 後是常數}}\cdot\underbrace{\mathbb E_{a_t}\bigl[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\,\big|\,h_t\bigr]}_{=0}\Bigr]=0
$$

兩個地方要停下來看：

1. 為什麼過去的獎勵可以提到內層期望值外面？因為它只由 $h_t$ 裡的狀態與動作決定，一旦 $h_t$ 固定就是一個數字。
2. 為什麼內層期望值是零？給定整段歷史時，$a_t$ 的分布只看 $s_t$（馬可夫性質，策略只吃當下的狀態），所以內層就是上一節的 $\mathbb E_{a_t\sim\pi_\theta(\cdot\mid s_t)}[\nabla_\theta\log\pi_\theta(a_t\mid s_t)]$，等於零。

課堂上有學生問這是不是用了 $\mathbb E[AB]=\mathbb E[A]\,\mathbb E[B]$。講者的回答是沒有，那條式子一般並不成立；這裡能把 $B$ 拿出來，是因為條件在歷史上之後 $B$ 真的是常數（錄影 20:44 起）。

於是梯度簡化成：

$$
\nabla_\theta\eta(\theta)=\sum_{t=0}^{T-1}\mathbb E_{\tau\sim P_\theta}\bigl[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\cdot R_{\ge t}\bigr]
$$

講者把直覺講成一句話：

> "Whatever you cannot change shouldn't affect your decision."（錄影 14:28 段）

過去拿到的獎勵，現在這個動作改變不了，就不該拿來決定這個動作要被加強多少。

## Baseline：減掉一個只看狀態的量

（錄影 15:28–23:50）

同一招再用一次。上一節用到的唯一性質是「那個量給定 $h_t$ 後是常數」。任何只依賴 $s_t$ 的函數 $B(s_t)$ 都符合，所以

$$
\mathbb E\bigl[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\cdot B(s_t)\bigr]=0
$$

減掉它不改變梯度的期望值：

$$
\nabla_\theta\eta(\theta)=\sum_{t=0}^{T-1}\mathbb E_{\tau\sim P_\theta}\bigl[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\cdot\bigl(R_{\ge t}-B(s_t)\bigr)\bigr]
$$

$B$ 叫 **baseline**。$B$ 不能依賴 $a_t$ 或 $t$ 之後的任何東西，否則就提不出內層期望值。

期望值不變，為什麼還要減？因為實際上算不出期望值，只能抽幾條軌跡取平均，而平均的抖動（變異數）跟權重的大小有關。講者說這是古典的 control variate 手法：找一個期望值為零、但跟原本的量相關的東西減掉。

課堂上的例子經過一次修正，值得照順序看。講者先說：如果獎勵永遠落在 10 到 11 之間，就減 10.5，讓它落在 −0.5 到 0.5。學生追問後，講者承認這個例子太簡化，改成兩個版本：

- **不同狀態尺度不同。** 某個狀態下的 reward-to-go 在 10 到 11 之間，另一個狀態在 0 到 1 之間。baseline 可以依狀態而定，前者減 10.5、後者減 0.5，所有狀態的權重就落在同一個尺度上。
- **同一個狀態下的兩個動作。** 一個動作拿到 10，另一個拿到 11，而 10 已經是最差的結果。不減 baseline 的話，兩個動作表面上都被加強，只是 11 那個被加強得多一點；減掉 10.5 之後，10 變成 −0.5（被壓低），11 變成 +0.5（被加強）。期望值上兩種做法一樣，因為只有相對差距有作用，但後者直接得多。

**數值例子（出自主講義第 21 章註腳 3，變異數是本文另外算的）。** 固定某個 $t$，假設 reward-to-go 只有兩種可能且機率各半：$1001$ 與 $998$，對應的 $\nabla_\theta\log\pi_\theta(a_t\mid s_t)$ 分別是向量 $z$ 與 $-z$（兩者機率相同、期望值又必須為零，所以一定方向相反）。

| | 樣本一 | 樣本二 | 平均 | 各樣本與平均的差 |
|---|---|---|---|---|
| 不減 baseline | $1001z$ | $-998z$ | $1.5z$ | $\pm 999.5z$ |
| 減 $B=1000$ | $(1001-1000)z=z$ | $(998-1000)(-z)=2z$ | $1.5z$ | $\pm 0.5z$ |

兩種估計的平均都是 $1.5z$，方向與大小完全相同；但單一樣本偏離平均的幅度從 $999.5$ 倍的 $z$ 降到 $0.5$ 倍，標準差差了 1,999 倍。這代表不減 baseline 時，你抽到哪一個樣本幾乎決定了這一步往哪走，要抽非常多條軌跡才平均得掉；減了之後每個樣本都指向大致正確的方向。

這個例子裡減掉的 1000 就只是一個常數，變異數照樣大幅下降：只要常數接近 reward-to-go 的典型大小就有幫助。講者在課堂上回應學生時說了一句「if you just subtract a constant it doesn't help anything」（錄影 19:43 段），字面上跟講義註腳的結論不一致。那句話的下半句是「你要減的是一個依賴 $s_t$ 的量」，而且他兩分鐘後補的第二個版本（同一個狀態、10 與 11、減 10.5）正是減一個數就有幫助的例子。所以本文的理解是：那句話在強調 baseline 可以、也應該隨狀態而變，不是在說常數 baseline 沒有效果。

講義另外指出，接近最佳的 baseline 是「從 $s_t$ 出發的期望 reward-to-go」，也就是價值函數 $V^{\pi_\theta}(s_t)$，而且粗略估計就夠了，因為它只影響變異數、不影響平均。課堂上只提到「現在大家會估計平均的 reward-to-go 然後減掉」，沒有展開怎麼擬合。

## 為什麼一批樣本只能用一次

（錄影 23:50–29:15）

進 PPO 之前，講者先講了一段保留意見。他說 PPO 到底為什麼有效、在什麼情況下有效，理論上仍然說不太清楚：

> "none of this is really a very strong justification for this algorithm."（錄影 23:54 段）

他還說，post-training（預訓練之後的訓練階段，這堂後半的強化學習就屬於這一段）的穩定性普遍是個大問題，開源社群對怎麼穩定訓練還沒有共識。所以以下的推導請當成「目前流行的說法」來讀。

所有 policy gradient 演算法都長這樣：

1. 用目前的策略 $\pi_\theta$ 抽很多條軌跡。
2. 用樣本平均取代期望值，估計 $\nabla_\theta\eta(\theta)$。
3. 更新 $\theta\leftarrow\theta+\alpha\,\nabla_\theta\eta(\theta)$。

這種演算法是 **on-policy** 的：估計式要求軌跡必須從「現在這組 $\theta$」抽出來。走完一步之後 $\theta$ 變了，手上的軌跡就成了舊策略的樣本，嚴格來說不能拿來算第二步，得重新抽。抽樣很貴，每批樣本卻只能用一次。PPO 要解決的就是這個浪費。

## 用重要性取樣重複使用舊樣本

（錄影 29:15–38:41）

想用舊策略 $\pi_{\theta_{\text{old}}}$ 的樣本估計新策略 $\pi_\theta$ 的東西，直接把期望值底下的 $\pi_\theta$ 換成 $\pi_{\theta_{\text{old}}}$ 是不行的，那樣估的是 $\eta(\theta_{\text{old}})$。要補一個修正項，這就是重要性取樣。一般的寫法是：

$$
\mathbb E_{x\sim p}[f(x)]=\int p(x)f(x)\,dx=\int q(x)\,\frac{p(x)}{q(x)}\,f(x)\,dx=\mathbb E_{x\sim q}\Bigl[\frac{p(x)}{q(x)}f(x)\Bigr]
$$

中間只是乘一個 $q/q$。從 $q$ 抽樣，每個樣本多乘 $p/q$，期望值就跟從 $p$ 抽一樣。

困難在於新舊策略差的是整條軌跡的機率。講者說大家的第一步是只修正動作那一部分。把「抽軌跡」拆成兩層，狀態 $s_t$ 怎麼來、給定 $s_t$ 之後動作 $a_t$ 怎麼抽，然後只對內層做重要性取樣：

$$
\mathbb E_{s_t\sim\pi_\theta}\,\mathbb E_{a_t\sim\pi_\theta(\cdot\mid s_t)}\bigl[\gamma^{t}R(s_t,a_t)\bigr]
=\mathbb E_{s_t\sim\pi_\theta}\,\mathbb E_{a_t\sim\pi_{\theta_{\text{old}}}(\cdot\mid s_t)}\Bigl[\frac{\pi_\theta(a_t\mid s_t)}{\pi_{\theta_{\text{old}}}(a_t\mid s_t)}\,\gamma^{t}R(s_t,a_t)\Bigr]
$$

這裡 $s_t\sim\pi_\theta$ 的意思是「跑 $\pi_\theta$ 會走到的狀態」，這是學生當場問、講者澄清的記號。上式是嚴格的等式。講者順帶說，語言模型的情境裡 $\gamma=1$，所以他常常忘了寫。

接著是兩個近似，講者明說是 hand-wavy 的：

1. **把獎勵換成優勢（advantage）。** 定義 $\hat A_t=R_{\ge t}-B(s_t)$，也就是 reward-to-go 減 baseline。$\hat A_t>0$ 表示這個動作比基準好，$\hat A_t<0$ 表示比基準差。
2. **狀態的分布不修正，直接用舊策略的。** 講者的說法是「沒有辦法修正這一部分，實務上就用 $\pi_{\theta_{\text{old}}}$」，並稱這是一個很大的近似。

把比值記成 $r_t(\theta)=\dfrac{\pi_\theta(a_t\mid s_t)}{\pi_{\theta_{\text{old}}}(a_t\mid s_t)}$，得到的代理目標函數是：

$$
J(\theta)=\sum_{t}\mathbb E_{s_t\sim\pi_{\theta_{\text{old}}}}\,\mathbb E_{a_t\sim\pi_{\theta_{\text{old}}}(\cdot\mid s_t)}\bigl[r_t(\theta)\,\hat A_t\bigr]
$$

現在期望值底下全是舊策略，舊樣本可以反覆使用，$\theta$ 只出現在 $r_t(\theta)$ 裡。

**本文補充（課堂沒有寫這一步）：** 這個目標函數的梯度長什麼樣？因為分母不含 $\theta$，

$$
\nabla_\theta r_t(\theta)=\frac{\nabla_\theta\pi_\theta(a_t\mid s_t)}{\pi_{\theta_{\text{old}}}(a_t\mid s_t)}=r_t(\theta)\,\nabla_\theta\log\pi_\theta(a_t\mid s_t)
$$

所以每個樣本貢獻的梯度是 $r_t\,\hat A_t\,\nabla_\theta\log\pi_\theta(a_t\mid s_t)$。在 $\theta=\theta_{\text{old}}$ 時 $r_t=1$，它就是 Baseline 一節那條帶 baseline 的 policy gradient 裡，單一樣本貢獻的那一項。離開 $\theta_{\text{old}}$ 之後，$r_t$ 變成一個額外的係數。後面比較 PPO 與 CISPO 時，看的就是這個係數被怎麼處理。

## PPO 的截斷：四種情況，兩種不再更新

（錄影 38:41–51:08）

$r_t$ 有時候太大或太小，會惹麻煩。PPO 的做法可以用四種情況講完。設兩個超參數 $\epsilon_{\text{high}}$ 與 $\epsilon_{\text{low}}$，課堂上說常見的值是 0.2 左右（講者也提到 0.28）。

| | $r_t$ 的位置 | 代表什麼 | PPO 怎麼做 |
|---|---|---|---|
| $\hat A_t>0$（好動作） | $r_t>1+\epsilon_{\text{high}}$ | 新策略選它的機率已經比舊策略高一截 | 不再加強，這一項沒有梯度 |
| $\hat A_t>0$（好動作） | $r_t\le 1+\epsilon_{\text{high}}$ | 還不夠高 | 照常取梯度，把機率往上推 |
| $\hat A_t<0$（壞動作） | $r_t<1-\epsilon_{\text{low}}$ | 新策略選它的機率已經比舊策略低一截 | 不再壓低，這一項沒有梯度 |
| $\hat A_t<0$（壞動作） | $r_t\ge 1-\epsilon_{\text{low}}$ | 還不夠低 | 照常取梯度，把機率往下壓 |

共同的邏輯是：方向已經對、而且已經走得夠遠的樣本，就不要再推，免得冒不穩定的風險。

看影片時留意一處口誤：講者介紹第一種情況時（錄影 38:41 段）說的是比值「much, much less than 1」，但他緊接著的解釋是「新策略選這個好動作的機率比舊策略高」，結論也是 $r_t$ 大於 $1+\epsilon$ 時把這一項丟掉，所以那裡應該是遠大於 1，上表照這個意思寫。

論文裡看到的是一條式子，講者說很多人會被它搞混：

$$
C_t(\theta)=\min\Bigl\{\,r_t(\theta)\,\hat A_t,\ \ \operatorname{clip}\bigl(r_t(\theta),\,1-\epsilon_{\text{low}},\,1+\epsilon_{\text{high}}\bigr)\,\hat A_t\Bigr\}
$$

$\operatorname{clip}(r,a,b)$ 把 $r$ 夾在 $[a,b]$ 之間。PPO 最大化 $C_t$ 的樣本平均。這條式子跟上面的表是同一件事，關鍵在於：$r_t$ 落在區間外時，第二項裡的 clip 值是固定的邊界數字，不含 $\theta$，對 $\theta$ 的梯度是零。所以只要 $\min$ 選到第二項而且 clip 有作用，這個樣本就沒有梯度。

**數值例子。** 取 $\epsilon_{\text{high}}=\epsilon_{\text{low}}=0.2$，$\hat A_t=\pm 2$。其中 $r_t=10$ 與 $r_t=0.5$ 是課堂上口頭舉的數字，$\hat A_t$ 的值與其餘各列是本文自擬的，每一列都重算過。

| $\hat A_t$ | $r_t$ | 第一項 $r_t\hat A_t$ | clip 後的 $r_t$ | 第二項 | $\min$ 選到 | 有沒有梯度 |
|---|---|---|---|---|---|---|
| $+2$ | $10$ | $20$ | $1.2$ | $2.4$ | 第二項 $2.4$ | 沒有（常數） |
| $+2$ | $0.5$ | $1.0$ | $0.8$ | $1.6$ | 第一項 $1.0$ | 有，往上推 |
| $+2$ | $1.1$ | $2.2$ | $1.1$ | $2.2$ | 兩項相同 | 有，往上推 |
| $-2$ | $0.5$ | $-1.0$ | $0.8$ | $-1.6$ | 第二項 $-1.6$ | 沒有（常數） |
| $-2$ | $3$ | $-6$ | $1.2$ | $-2.4$ | 第一項 $-6$ | 有，往下壓 |

第二列是課堂上學生卡住的地方：$r_t=0.5$ 時 clip 把它拉到 $0.8$，第二項變大，$\min$ 反而選回沒被截斷的第一項，所以梯度還在。對好動作來說，機率比舊策略低正是最需要更新的時候。最後一列留意一下：壞動作的 $r_t$ 很大時，PPO 完全不截斷，係數 $r_t=3$ 照單全收。下一節的 CISPO 改的就是這裡。

課堂上對這套設計的討論有三點：

- **為什麼要這樣做。** 講者轉述的原始動機是讓新策略不要離 $\pi_{\theta_{\text{old}}}$ 太遠，這樣「狀態分布用舊策略的」那個近似才站得住。他補了一句「I don't know whether that's exactly the reason, but that's the story」。
- **學習會不會變慢。** 學生這樣問，講者答：會，被截掉的樣本就是不再學了。
- **兩個 $\epsilon$ 該不該一樣。** 有論文把兩邊設成不同的值。講者的看法是 $\epsilon_{\text{high}}$ 放寬一點問題不大，頂多是新策略已經比舊策略好兩倍還繼續學。$\epsilon_{\text{low}}$ 那一側牽涉到多樣性：把一個壞動作的機率壓得太低，策略會變得太確定，容易卡在局部解；那個動作也許搭配別的動作時是好的，所以要留一點機會給它。

講義的 PPO 目標函數前面多一個負號，寫成要最小化的損失，並提到另外加一個 KL 正則項與 GAE；課堂上是直接最大化，沒有講 GAE。

## CISPO：把係數夾住，但不把梯度關掉

（錄影 51:08–56:21）

講者接著介紹 CISPO，說它現在很流行，他們自己做訓練時多半用它而不是 PPO。他同樣加了但書：不確定這是不是根本上正確的演算法。畫圖時他一度把 PPO 說成 GRPO，隨即更正，並說 GRPO 是 PPO 的進階版，在截斷這件事上做法相同。

用前面「係數」的說法來看最清楚。每個樣本貢獻的梯度是「係數 × $\hat A_t$ × $\nabla_\theta\log\pi_\theta$」，不截斷時係數就是 $r_t$。課堂上畫的圖，橫軸是 $r_t$，縱軸就是這個係數。下表是依口述與講義式 (18.9) 還原的，本文沒有看到那張圖：

| | PPO | CISPO |
|---|---|---|
| $\hat A_t>0$，$r_t>1+\epsilon_{\text{high}}$ | 係數歸零，完全不學 | 係數固定在上限，還在學但不再變大 |
| $\hat A_t<0$，$r_t<1-\epsilon_{\text{low}}$ | 係數歸零 | 不截斷，係數仍是 $r_t$ |
| $\hat A_t<0$，$r_t>1+\epsilon_{\text{high}}$ | 不截斷，係數是 $r_t$ | 係數固定在上限 |

CISPO 的理由跟「學夠了沒」無關。講者轉述的想法是：$r_t$ 大就是壞事，因為它直接讓這一項的梯度變大。機率的比值可以大得離譜，他舉的數字是 $0.6/0.2=3$ 與 $0.6/0.01=60$。所以 CISPO 不分好壞動作，凡是大的係數一律夾住。

用上一節的數字對照（上限取 $1.2$）：好動作 $r_t=10$，PPO 的係數是 0、CISPO 是 1.2；壞動作 $r_t=3$，PPO 是 3、CISPO 是 1.2；壞動作 $r_t=0.5$，PPO 是 0、CISPO 是 0.5。最後這種情況下 CISPO 會繼續把已經變少見的壞動作往下壓，講者說他在自己的專案裡確實看過這類演算法造成多樣性流失。

講義第 18 章把 CISPO 寫成

$$
L_{\text{CISPO}}=-\,\mathbb E\Bigl[\operatorname{stopgrad}\bigl(\min\{r_t(\theta),\,\epsilon_{\text{high}}\}\bigr)\,\hat A\,\log\pi_\theta(y_t\mid x,y_{<t})\Bigr]
$$

$\operatorname{stopgrad}$ 表示括號裡的值只當係數用、不往回傳梯度，這正好就是「係數被夾住、$\log\pi_\theta$ 的梯度照留」。注意講義這裡的 $\epsilon_{\text{high}}$ 本身就是上限，對應課堂圖上的 $1+\epsilon_{\text{high}}$。

這個題目講者收得很乾脆：

> "every few months, there's a different clipping."（錄影 55:18 段）

他說還有論文把 CISPO 與 PPO 混著截，這仍是開放的研究問題，沒有人知道真正的答案。

## 思維鏈：先讓模型想，再作答

（錄影 56:21–1:02:29）

後半堂換到語言模型。之前的設定是給一段提示 $x_1,\dots,x_l$（例如「1 加 1 是多少」），模型直接生成答案 $y_1,\dots,y_k$。後來大家發現讓模型立刻作答不見得最好，應該先讓它想一下。**思維鏈（chain of thought，CoT）** 就是在提示之後，模型先生成一段思考 token $z_1,\dots,z_n$，再生成答案。思考的部分常常用特殊 token 包起來，但講者說不是每個模型都這樣做。

這個做法是從需要多個步驟的數學題發現的。人也沒辦法一眼看出答案，要一步一步算，思考 token 就是把那些中間計算攤開。課堂上依時間順序講了三個階段：

- **Few-shot CoT。** 在提示裡放幾題手寫的範例，每題都有題目、逐步的思考過程與答案，最後接上新題目，讓模型照樣子做。
- **Zero-shot CoT。** 不放範例，只在題目後面加一句「Let's think step by step」。講者說就這幾個字，正確率可以提高 5%、10%，有時 20% 甚至更多。
- **用監督式微調去教。** 既然這麼有用，就人工造一批帶逐步思考的資料來微調模型。

第三條路走不遠，原因是沒有人知道「最好的思考方式」長什麼樣。講者描述了開源模型的思考 token 實際的樣子：不太有邏輯，來回反覆，有時用很精簡的縮寫，有時在懷疑題目本身，並不是一條乾淨的最短路徑，倒是跟人解題時試不同想法、回頭檢查很像。他還提到有研究試過產生非常精簡的思考過程，結果對模型沒什麼用，因為那樣想太難了。手寫不出這種雜亂但有效的思考，監督式的做法就難以繼續放大。

## 把生成寫成 MDP：只對最後的答案給分

（錄影 1:02:29–1:08:50）

強化學習的好處在於不需要「怎麼答」的標註，只需要判斷答案對不對。講者的說法是：

> "You don't really care about how the thinking was done. You just care about the final answer is right."（錄影 1:03:34 段）

要套用前半堂的工具，得先把語言模型的生成對應到 MDP。這一段不區分思考與答案，把提示之後模型生成的全部 token 記成 $y_1,\dots,y_n$：

| MDP 的元件 | 語言模型裡是什麼 |
|---|---|
| 狀態 $s_t$ | 提示加上到目前為止生成的 token：$(x,\,y_{<t})$ |
| 動作 $a_t$ | 下一個 token $y_t$ |
| 策略 $\pi_\theta(a_t\mid s_t)$ | 模型的下一個 token 機率 $p_\theta(y_t\mid x,y_{<t})$ |
| 轉移 | 把 $y_t$ 接到後面：$s_{t+1}=(x,\,y_{\le t})$，完全確定 |
| 獎勵 | 只在整段生成結束時給一次 |

轉移是確定的，一點隨機性都沒有，但這不表示問題簡單。講者提醒，序列很長，每一步都要選對 token，最後才會得到答案。

獎勵就是「答案的部分跟標準答案是否一致」：一致給 1，否則給 0。這要求資料集裡每一題都有標準答案，例如數學計算題。這就是講義說的 **RLVR**（reinforcement learning with verifiable rewards，可驗證獎勵的強化學習）。

實作上有個很實際的問題：要怎麼從一大段輸出裡把答案抽出來。講者說不能再叫另一個 AI 模型來抽，要用很務實的方法：要求模型把答案放在類似 XML 的 answer 標籤裡，用解析程式取出標籤內的內容，再跟標準答案比對。格式不對也拿不到分。他補充現在模型越來越強，可以要求其他格式，但一開始就是這麼簡單。

## 套上 PPO，baseline 用同一題的 8 個樣本

（錄影 1:08:50–1:13:05）

有了 MDP 的對應，PPO 或 CISPO 可以原封不動地套上去。比值變成 token 層級的：

$$
r_t(\theta)=\frac{\pi_\theta(y_t\mid x,y_{<t})}{\pi_{\theta_{\text{old}}}(y_t\mid x,y_{<t})}
$$

其餘照前半堂的公式。講者提到兩個細節。一是可以加正則項，讓策略不要離某個參考策略太遠；他說這在早期很有用，現在是否還有用他不確定。二是 baseline 怎麼設計。

以前的做法是另外學一個價值函數來估 baseline。新的做法簡單得多：對同一個題目 $x$ 抽 8 條軌跡，各自得到獎勵 $R^{(1)},\dots,R^{(8)}$，取平均 $\bar R$ 當 baseline。（課堂上用小寫 $r$ 寫獎勵；為了不跟比值 $r_t$ 混淆，這裡改用大寫，與講義一致。）$\bar R$ 反映的是「這一題在目前這個時間點有多難」。講義第 18 章把這種 baseline 寫在 GRPO（Group Relative Policy Optimization）底下：用同一題多個答案互相比較，取代另外訓練的價值模型；講義的 GRPO 另外還除以這組獎勵的標準差，截斷則沿用 PPO 的式子。課堂上沒有把這個做法叫做 GRPO，只在講 CISPO 時順口提過這個名字。

**數值例子（課堂上的兩組數字）。**

| 8 個樣本的獎勵 | 平均 $\bar R$ | 答對的樣本調整後 | 答錯的樣本調整後 |
|---|---|---|---|
| 1 個答對、7 個答錯 | $1/8$ | $1-\tfrac18=\tfrac78$ | $0-\tfrac18=-\tfrac18$ |
| 4 個答對、4 個答錯 | $1/2$ | $+0.5$ | $-0.5$ |

第一組的意思是：這一題很難，8 次只對 1 次，那唯一答對的軌跡拿到很大的正權重 $7/8$，它上面每個 token 的機率都被明顯推高；其餘 7 條各被輕輕壓一下。第二組是一題半對半錯的題目，對與錯的力道相同。同樣是「答對」，在難題上得到的權重比在容易的題目上大。

講者說還可以再除以標準差來調整尺度，留給大家課後讀。**以下是本文依講義式 (18.7) 補算的，不是課堂內容**（忽略分母的小常數）：獎勵只有 0 與 1 時，若答對比例是 $p$，標準差是 $\sqrt{p(1-p)}$。第一組 $p=1/8$，標準差是 $\sqrt{7}/8\approx 0.331$，答對的樣本變成 $\tfrac78\div 0.331\approx 2.65$，答錯的變成 $-\tfrac18\div 0.331\approx -0.38$。第二組 $p=1/2$，標準差 $0.5$，調整後是 $\pm 1$。

**本文補充兩點。** 第一，$\bar R$ 其實包含了樣本自己的獎勵，嚴格說不是「只依賴狀態」的 baseline。不過可以直接算出 $R^{(i)}-\bar R=\tfrac{7}{8}\bigl(R^{(i)}-\text{其餘 7 個的平均}\bigr)$，也就是它等於一個合法的 baseline（不含自己的平均）再乘上固定倍數 $7/8$，方向沒有被扭曲。第二，如果 8 個樣本全錯，$\bar R=0$，每個樣本調整後都是 0，這一題完全沒有梯度（8 個全對時 $\bar R=1$，同樣全是 0）。全錯的情況直接帶到下一節學生的問題。

## 課末問答：第一個非零獎勵、評分模型會被騙、算力花在哪

（錄影 1:13:05–1:18:56）

**思考的空間這麼大，模型怎麼找得到對的軌跡？** 講者的回答：

> "you have to start with some policy that can give you a non-zero reward."（錄影 1:13:05 段）

起點模型必須已經有一點點能力，偶爾答得對。只要有一條成功的軌跡，像上面 1 對 7 錯那樣，它就被 $7/8$ 的權重加強，其他被壓低，這個行為會逐漸多起來，然後自己滾下去。講者舉例說有些模型幾乎沒有思考能力，拿去做強化學習時一開始獎勵是 0，然後就一直是 0；另一些模型起步時已有少許思考能力，就滾得起來。他也說了自己這個說法有點誇大。

要拿到第一個非零獎勵，課堂上提到的辦法有：先做監督式微調，造一些帶思考過程的資料，甚至刻意放進「我檢查了剛才的答案、發現錯了、修正」這種反省；另外，預訓練資料裡本來就有一些冗長的思考過程。前沿實驗室還有哪些做法，講者說他不清楚。

**獎勵一定要用程式比對嗎？** 有標準答案時，就用很簡單的程式比對。沒有標準答案的任務，有人改用大型語言模型當評分函數，風險是評分可以被鑽漏洞：評分模型可能只看格式與文風，沒有真的檢查答案對不對，作答的模型就會學著去迎合。講者說如果用小模型評分一定會被鑽，用非常大的模型評分能不能避免，目前還不清楚。

**算力需求跟一般訓練差在哪？** 一輪更新有三個階段：生成軌跡、計算獎勵、算梯度做訓練。講者認為生成通常比訓練慢，因為生成只能一個 token 接一個 token，沒辦法像訓練那樣把整條序列一次餵進去算前向傳遞；而且生成越長越慢，還要把 KV cache（[第 16 堂](/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning)講過的那份快取）留在記憶體裡。預訓練沒有生成階段，資料是事先下載、處理好的，這是兩者最大的差別。

## 自我檢查

**1. 為什麼 baseline 可以依賴 $s_t$，卻不能依賴 $a_t$？請指出推導的哪一步會壞掉。**

判準：答案要提到全期望值定理的內層期望值是對 $a_t$ 取的。$B(s_t)$ 在給定歷史後是常數，可以提到內層外面，剩下 $\mathbb E_{a_t}[\nabla_\theta\log\pi_\theta(a_t\mid s_t)]=0$。如果 $B$ 依賴 $a_t$，它就提不出來，內層變成 $\mathbb E_{a_t}[\nabla_\theta\log\pi_\theta\cdot B(s_t,a_t)]$，一般不是零，梯度的期望值會被改掉。

**2. 取 $\epsilon_{\text{high}}=\epsilon_{\text{low}}=0.2$、$\hat A_t=-1$。分別對 $r_t=0.6$ 與 $r_t=1.5$ 算出 PPO 的 $C_t$，並說明有沒有梯度。CISPO（上限 1.2）的係數各是多少？**

答案：$r_t=0.6$ 時第一項是 $-0.6$，clip 後是 $0.8$、第二項是 $-0.8$，$\min$ 選 $-0.8$，是常數，沒有梯度。$r_t=1.5$ 時第一項是 $-1.5$，clip 後是 $1.2$、第二項是 $-1.2$，$\min$ 選 $-1.5$，有梯度，會把這個壞動作的機率往下壓。CISPO 的係數分別是 $0.6$ 與 $1.2$。

**3. 同一題抽 8 個樣本，2 個答對。每個樣本減掉平均後的權重是多少？如果再除以標準差呢？**

答案：$\bar R=0.25$，答對的是 $+0.75$，答錯的是 $-0.25$。標準差是 $\sqrt{0.25\times 0.75}\approx 0.433$，除完之後答對的約 $+1.73$，答錯的約 $-0.58$。

**4. 普通的 policy gradient 為什麼不能拿同一批軌跡連走兩步？PPO 為了能這樣做，做了哪一個沒有被修正的近似？**

判準：第一問要講到估計式要求軌跡從目前的 $\theta$ 抽出，走一步後樣本就屬於舊策略。第二問要講到 PPO 只用比值 $r_t$ 修正動作的分布，狀態的分布直接沿用舊策略的；截斷讓新策略不要離舊策略太遠，這個近似才說得過去。

**5. 語言模型的 MDP 轉移是完全確定的，為什麼訓練還是可能完全學不動？**

判準：獎勵只在最後給一次，而且只有 0 或 1。如果起點模型在某一題的所有樣本都答錯，平均是 0，每個樣本的權重都是 0，沒有梯度。所以需要一個偶爾能答對的起點，課堂上提到的來源是監督式微調與預訓練資料。

## 對應閱讀

- **主講義第 21 章 §21.1 REINFORCE（pp. 258–263）**：對應這堂的前四節。式 (21.9) 到 (21.11) 是 reward-to-go 與 baseline 的推導，Algorithm 7 是帶 baseline 的演算法。講義多講了兩件課堂沒有的事：接近最佳的 baseline 是價值函數；以及怎麼用最小平方擬合 $B$（式 21.12）。註腳 3 的 1000±幾的例子就是本文 baseline 一節的數值例子。講義把 $\gamma^t$ 從 reward-to-go 提出來寫，並在註腳 4 說實作上常直接省略那個折扣因子；課堂上沒有處理這個細節。
- **主講義第 21 章 §21.2 PPO（pp. 263–265）**：對應 on-policy、重要性取樣與截斷三節。講義從 reward-to-go 版的代理目標 (21.16) 出發，狀態分布一開始就寫成舊策略的；課堂上是先對單步獎勵寫出嚴格等式，再做兩個近似。講義只用一個 $\epsilon_{\text{clip}}$，課堂上分成 $\epsilon_{\text{high}}$ 與 $\epsilon_{\text{low}}$ 並討論兩邊為什麼可以不同。PPO 的全名（Proximal Policy Optimization）與出處在講義裡有，講者在課堂上說他不太記得。
- **主講義第 18 章 §18.1–18.2（pp. 220–225）**：對應後半堂。§18.1 的 few-shot 與 zero-shot CoT 附有出處；§18.2 有 RLVR 的正式寫法、KL 正則的目標函數 (18.2)、token 層級的 PPO (18.4)–(18.6)、GRPO (18.7)–(18.8) 與 CISPO (18.9)。講義提到的 o1 與 DeepSeek-R1 的訓練曲線（圖 18.1）課堂上沒有講；課堂上關於「需要非零獎勵的起點」「用語言模型評分會被鑽漏洞」「生成比訓練慢」的討論則是講義沒有的。

## 這門課走到這裡

這是 Spring 2026 公開錄影的最後一支。回頭看整條路線：

- **開場**：[第 1 堂](/posts/ai/2026-10-12-stanford-cs229-lecture-01-introduction)先劃出監督式、非監督式與強化學習三塊。
- **監督式學習（第 2–6 堂）**：[線性迴歸](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression)、[最大概似與邏輯斯迴歸](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression)、[指數族、廣義線性模型與 softmax](/posts/ai/2026-10-12-stanford-cs229-lecture-04-exponential-family-glm)、[高斯判別分析與 Naive Bayes](/posts/ai/2026-10-12-stanford-cs229-lecture-05-gaussian-discriminant-analysis)，再用一堂談[偏差與變異、正規化與模型選擇](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization)。
- **神經網路（第 7–8 堂）**：[架構](/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture)與[反向傳播](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation)。
- **非監督式學習（第 9–10 堂）**：[k-means 與高斯混合模型](/posts/ai/2026-10-12-stanford-cs229-lecture-09-k-means-gmm)、[EM 演算法與 PCA](/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca)。
- **生成模型與基礎模型（第 11–16 堂）**：[擴散模型](/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models)、[擴散模型的雜訊預測損失、基礎模型與 LoRA](/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora)、[對比學習與語意檢索](/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search)、[語言模型的 next-token 損失與 attention](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention)、[attention 變體、MoE 與提示用法](/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning)。
- **強化學習（第 18、20 堂）**：[上一堂](/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient)建立 MDP 與 policy gradient，這一堂把它接到語言模型的推理訓練上。

中間缺的第 15、17 堂是沒有公開錄影的客座講座。

第 2 堂的線性迴歸與這一堂的 RLVR 用的是同一套骨架：寫出一個目標函數，求它對參數的梯度，用樣本估計這個梯度，然後走一步。差別在於這一堂的資料是模型自己生成的，而且標註只剩下「最後答案對不對」這一個位元。

**系列導覽**：上一篇 [第 18 堂：強化學習基礎與 policy gradient](/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient)｜沒有下一堂，回到[課程總覽](/posts/ai/2026-08-21-stanford-cs229-machine-learning)

## 課程影片來源

原始影片：[Stanford CS229 Machine Learning | Spring 2026 | Lecture 20: GMM (EM), PCA](https://www.youtube.com/watch?v=J7CossjMvEg)

- [Stanford CS229 Machine Learning｜Spring 2026 播放清單（Stanford Online，17 支）](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 課程官網](https://cs229.stanford.edu/)
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

查核日期：2026-10-12。

內容核對：已依字幕核對（2026-10-12）：整支影片（約 79 分鐘）的英文字幕全部讀過，內容是 policy gradient 收尾、PPO、CISPO 與用強化學習訓練語言模型推理。未看板書畫面，公式依字幕口述與主講義第 18、21 章還原；字幕中指著板書說「this one」而無法還原的地方沒有寫進本文。

## 參考資料

- [Stanford CS229 Spring 2026 Lecture 20 錄影（YouTube）](https://www.youtube.com/watch?v=J7CossjMvEg)：全文的課堂內容、引句與時間戳都出自這支影片的英文字幕。
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：第 21 章用來還原 reward-to-go、baseline、PPO 的公式與註腳 3 的數值例子；第 18 章用來還原 RLVR 的 MDP 寫法、GRPO 的標準差調整與 CISPO 的式子。
- [Stanford CS229 導讀：課程總覽](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：系列入口與各堂位置。
- [第 18 堂：強化學習基礎與 policy gradient](/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient)：這堂一開始沿用的梯度公式在上一堂推導。

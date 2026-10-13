---
title: "對偶 SVM：用拉格朗日對偶擺脫特徵維度｜台大林軒田 機器學習技法 第 2 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, optimization]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 19
tldr: "hard-margin SVM 的原始問題有 d̃+1 個變數，特徵維度一大就解不動。這堂課用拉格朗日對偶把它換成只有 N 個變數、N+1 條限制的二次規劃，再用 KKT 條件從 α 算回 w 與 b；只有 α 大於 0 的支援向量會影響答案。對偶問題的矩陣裡還留著 d̃ 維的內積，所以特徵維度要到下一堂才真的擺脫。"
description: "台大林軒田機器學習技法第 2 堂 Dual Support Vector Machine 導讀：拉格朗日函數、弱對偶與強對偶、消去 b 與 w 的推導、對偶二次規劃、KKT 條件、支援向量，並把四個點的對偶問題手算解完。"
draft: false
glossary:
  - term: "拉格朗日對偶問題"
    aliases: ["Lagrange dual problem", "對偶問題"]
    definition: "把拉格朗日函數的「先對乘數取 max、再對原變數取 min」對調成「先 min 再 max」得到的問題。它的最佳值不會超過原始問題的最佳值。"
    context: "技法第 2 堂用它把 SVM 的變數從 (b, w) 換成 N 個 αₙ。"
  - term: "KKT 條件"
    aliases: ["Karush-Kuhn-Tucker conditions", "KKT conditions"]
    definition: "原始與對偶問題同時達到最佳解時必須成立的一組條件：原始可行、對偶可行、對偶內層最佳、互補鬆弛。在 SVM 這類凸 QP 上也是充分條件。"
    context: "技法第 2 堂用 KKT 從對偶解 α 算回 w 與 b。"
  - term: "互補鬆弛"
    aliases: ["complementary slackness"]
    definition: "KKT 的第四條：每個 n 的 αₙ 與 1 − yₙ(wᵀzₙ + b) 至少有一個是 0。"
    context: "由它得到「αₙ 大於 0 的點一定在胖邊界上」，也是算 b 的依據。"
  - term: "支援向量"
    aliases: ["support vector", "SV"]
    definition: "對偶解中 αₙ 大於 0 的訓練點。它們一定落在胖邊界上，而且只靠它們就能算出 w 與 b。"
    context: "SVM 名稱的來源；技法第 2 堂把「邊界上的候選點」和「αₙ 大於 0 的點」分開。"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [202_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/202_handout.pdf) 與四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/23 到 23/23），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的技法第 2 堂。講義第 1 頁的 Roadmap 把技法分成三種處理特徵的技巧，這堂屬於第一種 Embedding Numerous Features: Kernel Models。上一堂[技法第 1 堂：線性 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)的結論在同一頁上只有一行：線性 SVM 比較 robust，而且可以用二次規劃（quadratic programming，QP）解。這堂要處理的是上一堂沒解決的事：做了高維的特徵轉換之後，那個 QP 的變數會多到解不動。

先備是上一堂的 hard-margin SVM 標準問題與 `QP(Q, p, A, c)` 的寫法、偏微分、向量內積。[基石第 14 堂：正則化](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)用過一次拉格朗日乘數，有印象會比較順，沒有也讀得下去。讀完之後，你應該能自己從原始問題一步一步推到對偶問題，寫出四條 KKT 條件，並且對一組小資料手算出 $\boldsymbol{\alpha}$、$\mathbf{w}$、$b$，指出哪些點是支援向量。

整堂課的推導是一條直線，先看全貌：

1. **原始 SVM**：變數是 $b$ 與 $\mathbf{w}$。
2. **拉格朗日函數**：把限制式藏進 max。
3. **min 與 max 對調**：靠強對偶保證答案不變。
4. **對 $b$ 偏微分**：消去 $b$。
5. **對 $\mathbf{w}$ 偏微分**：消去 $\mathbf{w}$。
6. **對偶 QP**：變數只剩 $\boldsymbol{\alpha}$。
7. **KKT 條件**：由 $\boldsymbol{\alpha}$ 算回 $\mathbf{w}$ 與 $b$。

## 為什麼要換一個問題來解：原始 SVM 的變數個數綁在特徵維度上

```youtube
url: https://www.youtube.com/watch?v=VUp-17l03lk
title: Dual Support Vector Machine :: Motivation of Dual SVM @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–01:09 複習上一堂，01:09–05:38 講動機，05:38–08:16 回顧拉格朗日乘數，08:16–15:20 是拉格朗日函數，之後是 Fun Time。）

### 原始問題卡在哪裡

上一堂把 $\mathbf{x}_n$ 換成轉換後的 $\mathbf{z}_n = \boldsymbol{\Phi}(\mathbf{x}_n)$，就得到非線性的 hard-margin SVM（講義第 2 頁）。$\mathbf{z}_n$ 的維度記成 $\tilde{d}$：

$$
\min_{b,\mathbf{w}} \ \frac{1}{2}\mathbf{w}^\top\mathbf{w} \qquad \text{subject to} \quad y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1,\quad n = 1, 2, \dots, N
$$

這個 QP 有 $\tilde{d}+1$ 個變數（$b$ 加上 $\mathbf{w}$ 的 $\tilde{d}$ 個分量）與 $N$ 條限制式。講義說我們想要的組合是：靠 large margin 讓能產生的邊界「不多」，同時靠特徵轉換讓邊界夠複雜。問題是邊界要複雜，$\tilde{d}$ 就要大，QP 的變數跟著變多；講義還多問了一句，$\tilde{d}$ 如果是無限大呢。課堂上把這稱為一個很瘋狂的想法：無限多個變數的最佳化問題，目前看起來不可能解，這堂與下一堂要找的就是讓它變成可能的機制。所以這堂的目標寫成一行：SVM without dependence on $\tilde{d}$。

第 3 頁把要做的事列成對照：

| | 原始的 SVM | 「等價」的 SVM |
|---|---|---|
| 類型 | 凸 QP | 凸 QP |
| 變數 | $\tilde{d}+1$ 個 | $N$ 個 |
| 限制式 | $N$ 條 | $N+1$ 條 |

右邊的變數與限制式數量都只跟資料量 $N$ 有關。課堂上的說法是，不管你把資料轉換到一萬維還是兩萬維的空間，這兩個數字都不會變。右邊那個問題來自原始問題的某種對偶問題（dual problem），課堂上形容兩個問題像雙胞胎，彼此有對應關係。

同一頁有一個紅色的警告框「Warning: Heavy Math!!!!!!」：講義只引入必要的數學、不求嚴謹，細節不必要的結果直接「宣稱」，就像基石宣稱 Hoeffding 不等式那樣。課堂上補了一句，這些結果背後是相當深入的最佳化理論，想看每一步細節的人要去翻最佳化的書。這篇會把講義跳過的代數補上，但強對偶的證明同樣不證。

### 工具：把拉格朗日乘數當成未知數

第 4 頁先回顧基石第 14 堂。正則化有兩種等價的寫法：一種是有限制式的 $\min_{\mathbf{w}} E_{\text{in}}(\mathbf{w})$ subject to $\mathbf{w}^\top\mathbf{w} \le C$，另一種是沒有限制式的 $\min_{\mathbf{w}} E_{\text{aug}}(\mathbf{w}) = E_{\text{in}}(\mathbf{w}) + \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w}$。把兩者接起來的是最佳解要滿足的條件 $\nabla E_{\text{in}}(\mathbf{w}) + \frac{2\lambda}{N}\mathbf{w} = \mathbf{0}$，每個 $C$ 會對應到某個 $\lambda \ge 0$，這個 $\lambda$ 就是拉格朗日乘數。

兩堂課對乘數的用法相反。正則化把 $\lambda$ 當成給定的參數：課堂上的講法是，本來使用者要給 $C$，我們改請他直接給 $\lambda$，問題就變得好解。對偶 SVM 把乘數當成未知數來解。SVM 有 $N$ 條限制式，所以有 $N$ 個乘數，一條一個。

### 拉格朗日函數：限制式藏進 max 裡

講義第 5 頁把乘數的符號 $\lambda_n$ 劃掉，改寫成 $\alpha_n$。課堂上解釋，SVM 的文獻習慣把這些乘數叫 $\alpha$，所以跟著用。拉格朗日函數是目標函數，加上每條限制式乘上自己的乘數：

$$
\mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}) = \underbrace{\frac{1}{2}\mathbf{w}^\top\mathbf{w}}_{\text{objective}} + \sum_{n=1}^{N} \alpha_n \underbrace{\big(1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)\big)}_{\text{constraint}}
$$

限制式 $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1$ 移項後是 $1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b) \le 0$，括號裡放的就是這個「應該小於等於 0」的量。講義接著宣稱：

$$
\text{SVM} \equiv \min_{b,\mathbf{w}} \Big( \max_{\text{all } \alpha_n \ge 0} \mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}) \Big)
$$

課堂上把這個兩層的式子講成一個評分過程：每來一組 $(b, \mathbf{w})$，先把 $\boldsymbol{\alpha}$ 調到讓 $\mathcal{L}$ 最大，這個最大值就是這組 $(b, \mathbf{w})$ 的分數；所有 $(b, \mathbf{w})$ 都評完之後，挑分數最低的。分數會是多少，要看這組 $(b, \mathbf{w})$ 是「壞的」還是「好的」：

- **$(b, \mathbf{w})$ 違反某條限制式。** 那一條的括號是正數。把對應的 $\alpha_n$ 取得愈大，$\mathcal{L}$ 就愈大，max 是 $\infty$。
- **$(b, \mathbf{w})$ 每條都滿足。** 每個括號都小於等於 0，乘上 $\alpha_n \ge 0$ 之後每一項都小於等於 0。要讓總和最大，只能讓每一項都是 0，max 就是 $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$。

所以外層的 min 面對的函數是：違反限制的地方值是 $\infty$，合法的地方值是 $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$。min 不會去選 $\infty$，結果和原本「在合法範圍內最小化 $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$」是同一件事。講義的說法是 constraints now hidden in max。站在 $(b, \mathbf{w})$ 這一層看，已經沒有任何限制式要顧，課堂上說原本那些限制式讓人綁手綁腳，這是之後能對 $b$ 與 $\mathbf{w}$ 直接偏微分的前提。

本文補充：這裡 $\alpha_n \ge 0$ 是必要的。如果允許負的 $\alpha_n$，合法的 $(b, \mathbf{w})$ 只要有一個括號是負數，就能靠負乘負把 max 推到 $\infty$，上面的論證就不成立。

### Fun Time：兩個點的拉格朗日函數

**題目（第 6 頁）：** 有兩筆轉換後的資料 $(\mathbf{z}_1, +1)$ 與 $(\mathbf{z}_2, -1)$，其中 $\mathbf{z}_1 = \mathbf{z}$、$\mathbf{z}_2 = -\mathbf{z}$。hard-margin SVM 的拉格朗日函數 $\mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha})$ 是哪一個？

1. $\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \alpha_1(1 + \mathbf{w}^\top\mathbf{z} + b) + \alpha_2(1 + \mathbf{w}^\top\mathbf{z} + b)$
2. $\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \alpha_1(1 - \mathbf{w}^\top\mathbf{z} - b) + \alpha_2(1 - \mathbf{w}^\top\mathbf{z} + b)$
3. $\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \alpha_1(1 + \mathbf{w}^\top\mathbf{z} + b) + \alpha_2(1 + \mathbf{w}^\top\mathbf{z} - b)$
4. $\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \alpha_1(1 - \mathbf{w}^\top\mathbf{z} - b) + \alpha_2(1 - \mathbf{w}^\top\mathbf{z} - b)$

**答案：2。** 講義只寫「照定義代入」，代入的過程如下。第一筆 $y_1 = +1$、$\mathbf{z}_1 = \mathbf{z}$，括號是 $1 - (\mathbf{w}^\top\mathbf{z} + b) = 1 - \mathbf{w}^\top\mathbf{z} - b$。第二筆 $y_2 = -1$、$\mathbf{z}_2 = -\mathbf{z}$，括號是 $1 - (-1)(-\mathbf{w}^\top\mathbf{z} + b) = 1 - \mathbf{w}^\top\mathbf{z} + b$。兩個負號讓 $\mathbf{w}^\top\mathbf{z}$ 前面維持負號，$b$ 前面變成正號。

其他選項各對應到另一組資料：選項 1 是兩筆都是 $(\mathbf{z}, -1)$，選項 4 是兩筆都是 $(\mathbf{z}, +1)$，選項 3 是把兩筆的標籤對調成 $(\mathbf{z}, -1)$ 與 $(-\mathbf{z}, +1)$。這兩個點在第三節的 Fun Time 還會再用一次。

## 交換 min 與 max，再把 b 和 w 消掉

```youtube
url: https://www.youtube.com/watch?v=Yhwtvbzg9Fw
title: Dual Support Vector Machine :: Largange Dual SVM @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:36 是弱對偶，02:36–05:35 強對偶，05:35–09:48 消去 $b$，09:48–14:20 消去 $\mathbf{w}$，14:20–17:45 KKT 條件，之後是 Fun Time。這支影片在 YouTube 上的標題把 Lagrange 拼成 Largange，講義上的拼法是對的。）

### 弱對偶：對調之後得到下界

現在的問題是 $\min_{b,\mathbf{w}} \max_{\boldsymbol{\alpha}} \mathcal{L}$，外層的變數仍是 $(b, \mathbf{w})$，$\tilde{d}$ 還在。第 7 頁用兩步把 min 和 max 的順序對調。

**第一步。** 任意固定一組 $\boldsymbol{\alpha}'$，每個 $\alpha'_n \ge 0$。對任何 $(b, \mathbf{w})$，max 是在所有 $\boldsymbol{\alpha}$ 裡挑最大的，當然不小於其中某一個：

$$
\max_{\text{all } \alpha_n \ge 0} \mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}) \ \ge\ \mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}')
$$

講義的註解是 max ≥ any。左邊在每個 $(b, \mathbf{w})$ 上都不小於右邊，所以左邊的最小值也不小於右邊的最小值（在左邊的最小點上，右邊的值已經不超過它，右邊的最小值只會更小）：

$$
\min_{b,\mathbf{w}} \Big( \max_{\text{all } \alpha_n \ge 0} \mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}) \Big) \ \ge\ \min_{b,\mathbf{w}} \mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}')
$$

**第二步。** 上面的不等式對每一組 $\boldsymbol{\alpha}'$ 都成立，那麼對右邊最大的那一組也成立。講義的註解是 best is one of any：

$$
\min_{b,\mathbf{w}} \Big( \max_{\text{all } \alpha_n \ge 0} \mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}) \Big) \ \ge\ \underbrace{\max_{\text{all } \alpha'_n \ge 0} \Big( \min_{b,\mathbf{w}} \mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}') \Big)}_{\text{Lagrange dual problem}}
$$

右邊就是拉格朗日對偶問題，$\boldsymbol{\alpha}'$ 的那一撇只是記號，之後就拿掉。不看數學的話，課堂上的一句話版本是：對偶問題就是把 min 和 max 兩個動作對調。每一組 $\boldsymbol{\alpha}'$ 都給原始問題一個下界，對偶問題是在找最高的那個下界；解出對偶問題，得到的是原始問題最佳值的下限，還不一定是它的最佳值。這個「≥」叫弱對偶（weak duality），對任何最佳化問題都成立。課堂上說這個關係「弱弱的」，因為只知道誰在上、誰在下。

### 強對偶：等號什麼時候成立

只有下界還不夠，我們要的是同一個答案。第 8 頁宣稱：等號成立叫強對偶（strong duality），QP 只要滿足三個條件就有強對偶，講義把這組條件稱為 constraint qualification：

- 原始問題是凸的（convex primal）。
- 原始問題有解（feasible primal）。對 SVM 來說，就是資料在 $\boldsymbol{\Phi}$ 轉換後的空間線性可分。
- 限制式是線性的（linear constraints）。

SVM 三條都滿足，所以存在一組 $(b, \mathbf{w}, \boldsymbol{\alpha})$ 同時是左右兩邊的最佳解，講義稱為 primal-dual optimal solution。課堂上對第三條只帶了一句：QP 的限制式本來就是線性的。所以真正要確認的是前兩條。這一步講義沒有證明，本文也不證。

它的作用是允許我們改解右邊那個問題。右邊好在哪裡？課堂上的解釋是：對 $(b, \mathbf{w})$ 的最佳化現在排在裡面那一層，是第一步要做的事，而且沒有任何限制式。沒有限制式的最佳化我們比較會處理，就像梯度下降時球往哪個方向滾都可以。

### 消去 b：對 b 偏微分

對偶問題的內層是 $\min_{b,\mathbf{w}} \mathcal{L}$，對 $(b, \mathbf{w})$ 沒有任何限制式，所以最小值的地方偏微分等於 0（第 9 頁）；課堂上的說法是最佳解要在谷底，谷底的梯度是 0。先把 $\mathcal{L}$ 裡含 $b$ 的部分拆出來：

$$
\mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}) = \frac{1}{2}\mathbf{w}^\top\mathbf{w} + \sum_{n=1}^{N}\alpha_n\big(1 - y_n\mathbf{w}^\top\mathbf{z}_n\big) - b\sum_{n=1}^{N}\alpha_n y_n
$$

對 $b$ 偏微分：

$$
\frac{\partial \mathcal{L}}{\partial b} = -\sum_{n=1}^{N}\alpha_n y_n = 0
$$

講義說，加上 $\sum_n \alpha_n y_n = 0$ 這條限制來解，不會損失最佳性。課堂上的理由是：隨便加別的限制可能會改變最佳解，這一條不會，因為最佳解本來就得滿足它。本文再補一個看法：$\mathcal{L}$ 對 $b$ 是一次式，係數是 $-\sum_n \alpha_n y_n$。這個係數只要不是 0，把 $b$ 往正確的方向推到無限遠，內層的 min 就是 $-\infty$。外層在找最大值，不會選一組讓內層變成 $-\infty$ 的 $\boldsymbol{\alpha}$，所以只需要考慮 $\sum_n \alpha_n y_n = 0$ 的 $\boldsymbol{\alpha}$。

加上這條限制之後，$b$ 那一項的係數是 0，整項消失。課堂上講得很直接：$b$ 一定會乘上 0，那還寫它做什麼，塗掉。

$$
\max_{\text{all } \alpha_n \ge 0,\ \sum y_n\alpha_n = 0} \bigg( \min_{\mathbf{w}}\ \frac{1}{2}\mathbf{w}^\top\mathbf{w} + \sum_{n=1}^{N}\alpha_n\big(1 - y_n\mathbf{w}^\top\mathbf{z}_n\big) \bigg)
$$

代價是對偶問題裡找不到 $b$ 了。課堂上在這裡先替學生問了「沒有 $b$ 以後怎麼做預測」，答案留到解出 $\boldsymbol{\alpha}$ 之後，見第三節。

### 消去 w：對 w 偏微分

接著對 $\mathbf{w}$ 的第 $i$ 個分量偏微分（第 10 頁）。$\frac{1}{2}\mathbf{w}^\top\mathbf{w} = \frac{1}{2}\sum_i w_i^2$ 微分得到 $w_i$；$\mathbf{w}^\top\mathbf{z}_n = \sum_i w_i z_{n,i}$ 微分得到 $z_{n,i}$：

$$
\frac{\partial \mathcal{L}}{\partial w_i} = w_i - \sum_{n=1}^{N}\alpha_n y_n z_{n,i} = 0
$$

每個分量都一樣，寫回向量就是

$$
\mathbf{w} = \sum_{n=1}^{N}\alpha_n y_n \mathbf{z}_n
$$

內層對 $\mathbf{w}$ 是開口向上的二次函數，偏微分為 0 的地方就是最小值。把它代回去之前，先整理加總那一項：

$$
\sum_{n=1}^{N}\alpha_n\big(1 - y_n\mathbf{w}^\top\mathbf{z}_n\big) = \sum_{n=1}^{N}\alpha_n - \mathbf{w}^\top\Big(\sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n\Big) = \sum_{n=1}^{N}\alpha_n - \mathbf{w}^\top\mathbf{w}
$$

最後一個等號就是把括號換成 $\mathbf{w}$。於是內層的最小值是

$$
\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \sum_{n=1}^{N}\alpha_n - \mathbf{w}^\top\mathbf{w} = -\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \sum_{n=1}^{N}\alpha_n = -\frac{1}{2}\Big\lVert\sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n\Big\rVert^2 + \sum_{n=1}^{N}\alpha_n
$$

兩個 $\mathbf{w}^\top\mathbf{w}$ 的係數是 $\frac{1}{2} - 1 = -\frac{1}{2}$。投影片把代入後的 $\mathbf{w}$ 標成紫色，課堂上說明這是提醒它已經是由 $\boldsymbol{\alpha}$ 算出來的量。內層的 min 做完了，式子裡的 min 可以直接拿掉，剩下的問題只含 $\boldsymbol{\alpha}$：

$$
\max_{\text{all } \alpha_n \ge 0,\ \sum y_n\alpha_n = 0}\ -\frac{1}{2}\Big\lVert\sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n\Big\rVert^2 + \sum_{n=1}^{N}\alpha_n
$$

講義在 max 底下還列了 $\mathbf{w} = \sum\alpha_n y_n\mathbf{z}_n$。它規定的是 $\mathbf{w}$ 怎麼由 $\boldsymbol{\alpha}$ 決定，對 $\boldsymbol{\alpha}$ 本身沒有限制，下一節寫成標準形式時就拿掉了。

### KKT 條件：最佳解必須滿足的四件事

第 11 頁把推導過程中用到的條件收在一起。KKT 是三位研究最佳化的學者姓氏的縮寫。如果 $(b, \mathbf{w}, \boldsymbol{\alpha})$ 是 primal-dual optimal，那麼：

1. **原始可行（primal feasible）：** $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1$。這是原始問題的限制式。
2. **對偶可行（dual feasible）：** $\alpha_n \ge 0$。這是對偶問題的限制式。
3. **對偶內層最佳（dual-inner optimal）：** $\sum_n y_n\alpha_n = 0$，以及 $\mathbf{w} = \sum_n \alpha_n y_n\mathbf{z}_n$。這是剛才兩次偏微分的結果。
4. **原始內層最佳（primal-inner optimal）：** $\alpha_n\big(1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)\big) = 0$，每個 $n$ 都成立。

課堂上說前兩條是理所當然的：不滿足各自的限制式，就談不上是那一邊的解。

第 4 條講義只寫了一句「at optimal all 'Lagrange terms' disappear」。回到第一節的論證就看得出來：合法的 $(b, \mathbf{w})$ 讓每一項 $\alpha_n(\dots)$ 都小於等於 0，內層的 max 要取到 $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$，每一項都得剛好是 0。兩個數相乘是 0，至少有一個是 0：要嘛 $\alpha_n = 0$，要嘛那個點剛好讓 $y_n(\mathbf{w}^\top\mathbf{z}_n + b) = 1$。這條在第 16 頁有名字，叫互補鬆弛（complementary slackness）。

課堂上給它一個好記的比喻：$\alpha_n$ 和括號裡的量就像哈利波特和佛地魔，兩個至少要有一個掛掉（等於 0）；可以兩個都掛掉，但不可能兩個都活著。這堂課後面一直用「哈利波特條件」來稱呼這一條。

這四條合稱 Karush-Kuhn-Tucker（KKT）條件。講義說它們是最佳解的必要條件，在這裡也是充分條件。充分的意思是：只要找到一組 $(b, \mathbf{w}, \boldsymbol{\alpha})$ 四條都滿足，它就是最佳解，不必再比較別的候選。後面的數值例子會用到這一點。

### Fun Time：單變數問題的 KKT

**題目（第 12 頁）：** 只有一個變數 $w$，要最小化 $\frac{1}{2}w^2$，限制式是 $w \ge 1$ 與 $w \le 3$。拉格朗日函數是 $\mathcal{L}(w, \boldsymbol{\alpha}) = \frac{1}{2}w^2 + \alpha_1(1 - w) + \alpha_2(w - 3)$。下面哪些含 $\boldsymbol{\alpha}$ 的式子屬於這個問題的 KKT 條件？

1. $\alpha_1 \ge 0$ 且 $\alpha_2 \ge 0$
2. $w = \alpha_1 - \alpha_2$
3. $\alpha_1(1 - w) = 0$ 且 $\alpha_2(w - 3) = 0$
4. 以上皆是

**答案：4。** 講義的解答把三個選項各對到一條：選項 1 是對偶可行，選項 2 是對偶內層最佳，選項 3 是原始內層最佳，也就是課堂上說的哈利波特條件。選項 2 的來源是對 $w$ 微分：$\frac{\partial\mathcal{L}}{\partial w} = w - \alpha_1 + \alpha_2 = 0$。

本文補充：這題可以直接解出來驗證。$\frac{1}{2}w^2$ 在 $1 \le w \le 3$ 的範圍內，$w$ 愈小愈好，所以 $w = 1$。$w - 3 = -2 \ne 0$，選項 3 逼得 $\alpha_2 = 0$；選項 2 於是給出 $\alpha_1 = w = 1$。檢查一遍：$\alpha_1 = 1 \ge 0$、$\alpha_2 = 0 \ge 0$、$1 = 1 - 0$、$1 \times (1 - 1) = 0$、$0 \times (1 - 3) = 0$，全部成立。真正卡住最佳解的限制式 $w \ge 1$ 拿到正的乘數，沒有作用的 $w \le 3$ 乘數是 0，這跟 SVM 裡「邊界上的點才可能有正的 $\alpha_n$」是同一個現象。

## 把對偶問題交給 QP，再從 α 算回 w 與 b

```youtube
url: https://www.youtube.com/watch?v=qGk0p7K07Mc
title: Dual Support Vector Machine :: Solving Dual SVM @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:23 寫成標準形式，02:23–07:22 對到 QP 解算器，07:22–10:20 談專門的解算器，10:20–13:45 從 $\boldsymbol{\alpha}$ 算回 $\mathbf{w}$ 與 $b$，之後是 Fun Time。）

### 寫成標準形式

第 13 頁做兩個純粹是外觀上的調整。第一，把範數的平方展開成雙重加總：

$$
\Big\lVert\sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n\Big\rVert^2 = \Big(\sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n\Big)^\top\Big(\sum_{m=1}^{N}\alpha_m y_m\mathbf{z}_m\Big) = \sum_{n=1}^{N}\sum_{m=1}^{N}\alpha_n\alpha_m y_n y_m \mathbf{z}_n^\top\mathbf{z}_m
$$

第二，整個目標函數乘上 $-1$，max 變成 min。課堂上順帶對照：先前把 max 換成 min 用的是取倒數，那要被最佳化的量是正的才能用；這裡改成加負號。結果是講義所說的 standard hard-margin SVM dual：

$$
\begin{aligned}
\min_{\boldsymbol{\alpha}}\quad & \frac{1}{2}\sum_{n=1}^{N}\sum_{m=1}^{N}\alpha_n\alpha_m y_n y_m \mathbf{z}_n^\top\mathbf{z}_m - \sum_{n=1}^{N}\alpha_n \\
\text{subject to}\quad & \sum_{n=1}^{N} y_n\alpha_n = 0; \\
& \alpha_n \ge 0,\quad n = 1, 2, \dots, N
\end{aligned}
$$

變數是 $N$ 個 $\alpha_n$，限制式是一條等式加 $N$ 條 $\alpha_n \ge 0$，共 $N+1$ 條。第 3 頁答應的事做到了。原本列在 max 底下的 $\mathbf{w} = \sum\alpha_n y_n\mathbf{z}_n$ 不見了，課堂上的交代是：那一條只描述 $\boldsymbol{\alpha}$ 與 $\mathbf{w}$ 的關係，現在要專心解 $\boldsymbol{\alpha}$，先不管它。

那條等式有個直觀的讀法，也是課堂上講的：把 $y_n = +1$ 與 $y_n = -1$ 的項分到等號兩邊，它說的是正例（投影片上畫成圈圈的點）的 $\alpha_n$ 總和，要等於負例（畫成叉叉的點）的 $\alpha_n$ 總和。

### 對到 QP 解算器的輸入

上一堂的 QP 解算器吃的格式是 $\min_{\mathbf{u}} \frac{1}{2}\mathbf{u}^\top Q\mathbf{u} + \mathbf{p}^\top\mathbf{u}$ subject to $\mathbf{a}_i^\top\mathbf{u} \ge c_i$。第 14 頁把對偶問題一項一項對上去，變數 $\mathbf{u}$ 現在是 $\boldsymbol{\alpha}$：

| QP 的輸入 | 對偶 SVM 填什麼 | 來自哪裡 |
|---|---|---|
| $Q$ 的第 $(n, m)$ 個元素 | $q_{n,m} = y_n y_m \mathbf{z}_n^\top\mathbf{z}_m$ | 雙重加總的係數 |
| $\mathbf{p}$ | $-\mathbf{1}_N$（$N$ 個 $-1$） | $-\sum_n \alpha_n$ |
| $\mathbf{a}_{\ge} = \mathbf{y}$，$c_{\ge} = 0$ | $\mathbf{y}^\top\boldsymbol{\alpha} \ge 0$ | 等式的一半 |
| $\mathbf{a}_{\le} = -\mathbf{y}$，$c_{\le} = 0$ | $-\mathbf{y}^\top\boldsymbol{\alpha} \ge 0$ | 等式的另一半 |
| $\mathbf{a}_n$ = 第 $n$ 個單位方向，$c_n = 0$ | $\alpha_n \ge 0$ | $N$ 條下界 |

這個格式只收「≥」，所以等式 $\mathbf{y}^\top\boldsymbol{\alpha} = 0$ 要拆成兩條方向相反的不等式。講義在頁尾提醒：很多解算器會特別處理等式與上下界（bound）這兩類限制式，數值上比較穩定。課堂上的建議是，上面的拆法只是一般性的示範，實際用的時候先讀懂手上那支 QP 程式的說明，它多半讓你直接指定等式與上下界，把係數放到對的位置就好。

本文補充一個講義標了「(convex)」但沒說明的地方。對任何 $\boldsymbol{\alpha}$，$\boldsymbol{\alpha}^\top Q\boldsymbol{\alpha} = \lVert\sum_n \alpha_n y_n\mathbf{z}_n\rVert^2 \ge 0$，所以 $Q$ 是半正定矩陣，目標函數是凸的，QP 解算器找到的就是全域最佳解。

### 實務上要用專門的解算器

第 15 頁把這個矩陣記成 $Q_D$（D 代表 dual），指出兩個麻煩：

- $q_{n,m} = y_n y_m\mathbf{z}_n^\top\mathbf{z}_m$ 通常不是 0（兩個向量要剛好垂直，內積才是 0），$Q_D$ 是稠密（dense）矩陣。課堂上拿上一堂對照：原始問題的 $Q$ 裡面是一個單位矩陣，只有對角線上有值，其他都是 0。
- 講義舉的數字是 $N = 30{,}000$ 時，稠密的 $Q_D$ 要超過 3G 的記憶體。課堂上說的是，就算利用對稱性只存一半，也要超過 3G。本文驗算：$30{,}000^2 = 9 \times 10^8$ 個元素，存一半是 $4.5 \times 10^8$ 個，每個用 8 個位元組的倍精度浮點數，合計 3.6 GB。

所以資料量大時需要專門為 SVM 寫的解算器：不把整個 $Q_D$ 存下來（課堂上舉的做法是用到哪些元素再算哪些），並且好好利用那一條等式與 $N$ 條下界的特殊結構。講義的結論是實務上通常用 special solver 比較好。課堂上講得更重：把這個問題當成一般的 QP 丟給通用的程式，可能會解到天荒地老。

### 從 α 算回 w 與 b

解算器回傳最佳的 $\boldsymbol{\alpha}$ 之後，還要換回 $(b, \mathbf{w})$ 才能做預測；課堂上說 $\boldsymbol{\alpha}$ 只是中間產物。第 16 頁用 KKT 條件：

**$\mathbf{w}$：** 直接用第 3 條，$\mathbf{w} = \sum_n \alpha_n y_n\mathbf{z}_n$。

**$b$：** 第 3 條裡沒有 $b$。第 1 條（原始可行）只給 $b$ 一個範圍：$y_n = +1$ 的點要求 $b \ge 1 - \mathbf{w}^\top\mathbf{z}_n$，$y_n = -1$ 的點要求 $b \le -1 - \mathbf{w}^\top\mathbf{z}_n$。要得到等式得靠第 4 條。只要找到一個 $\alpha_n > 0$ 的點（哈利波特活著，佛地魔就得掛掉），互補鬆弛就逼得

$$
1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b) = 0 \quad\Longrightarrow\quad y_n(\mathbf{w}^\top\mathbf{z}_n + b) = 1
$$

兩邊同乘 $y_n$，因為 $y_n^2 = 1$，得到 $\mathbf{w}^\top\mathbf{z}_n + b = y_n$，也就是

$$
b = y_n - \mathbf{w}^\top\mathbf{z}_n
$$

課堂上提醒：數學上，任何一個 $\alpha_n > 0$ 的點都會算出同一個 $b$；實際用解算器時，數值誤差會讓不同的點算出略有差異的 $b$。

$y_n(\mathbf{w}^\top\mathbf{z}_n + b) = 1$ 正是上一堂說的「落在胖邊界上」。所以互補鬆弛還有一個幾何上的讀法，講義放在頁尾：$\alpha_n > 0$ 的點一定在胖邊界上，它就是支援向量（SV）。

本文補充：一定找得到 $\alpha_n > 0$ 的點嗎？如果所有 $\alpha_n$ 都是 0，第 3 條給出 $\mathbf{w} = \mathbf{0}$，第 1 條變成每個 $n$ 都要 $y_n b \ge 1$。資料裡同時有正例與負例時，$b \ge 1$ 和 $-b \ge 1$ 不可能同時成立，所以最佳解一定至少有一個正的 $\alpha_n$。

### 數值例子：把四個點的對偶問題解完

以下的計算是本文做的，不在講義上。資料用的是上一堂講義手算過原始問題的四個點（上一堂講義第 17 頁），講義第 18 頁的圖畫的也是這組資料，但講義沒有列出對偶解。這裡不做特徵轉換，$\mathbf{z}_n = \mathbf{x}_n$。

| $n$ | $\mathbf{z}_n$ | $y_n$ |
|---|---|---|
| 1 | $(0, 0)$ | $-1$ |
| 2 | $(2, 2)$ | $-1$ |
| 3 | $(2, 0)$ | $+1$ |
| 4 | $(3, 0)$ | $+1$ |

**第一步：算 $Q_D$。** 例如 $q_{2,3} = y_2 y_3\,\mathbf{z}_2^\top\mathbf{z}_3 = (-1)(+1)(2 \times 2 + 2 \times 0) = -4$。全部算完：

$$
Q_D = \begin{bmatrix} 0 & 0 & 0 & 0 \\ 0 & 8 & -4 & -6 \\ 0 & -4 & 4 & 6 \\ 0 & -6 & 6 & 9 \end{bmatrix}
$$

第一列與第一行全是 0，因為 $\mathbf{z}_1$ 是原點，跟誰內積都是 0。

**第二步：寫出對偶問題。** 限制式是 $-\alpha_1 - \alpha_2 + \alpha_3 + \alpha_4 = 0$ 與四個 $\alpha_n \ge 0$。目標函數直接展開 $Q_D$ 會有六個交叉項，改從 $\mathbf{w} = \sum_n \alpha_n y_n\mathbf{z}_n$ 下手比較乾淨，因為二次項就是 $\frac{1}{2}\lVert\mathbf{w}\rVert^2$：

$$
\mathbf{w} = -\alpha_1(0,0) - \alpha_2(2,2) + \alpha_3(2,0) + \alpha_4(3,0) = (2\alpha_3 + 3\alpha_4 - 2\alpha_2,\ -2\alpha_2)
$$

**第三步：用等式消掉一個變數。** 等式給出 $\alpha_3 = \alpha_1 + \alpha_2 - \alpha_4$。代進去，$\mathbf{w}$ 的第一個分量變成 $2\alpha_1 + 2\alpha_2 - 2\alpha_4 + 3\alpha_4 - 2\alpha_2 = 2\alpha_1 + \alpha_4$，而 $\sum_n \alpha_n = (\alpha_1 + \alpha_2) + (\alpha_3 + \alpha_4) = 2\alpha_1 + 2\alpha_2$。目標函數成為

$$
\frac{1}{2}\Big[(2\alpha_1 + \alpha_4)^2 + (2\alpha_2)^2\Big] - 2\alpha_1 - 2\alpha_2 = \underbrace{\big(2\alpha_2^2 - 2\alpha_2\big)}_{\text{only } \alpha_2} + \underbrace{\Big(\frac{1}{2}(2\alpha_1 + \alpha_4)^2 - 2\alpha_1\Big)}_{\alpha_1 \text{ and } \alpha_4}
$$

**第四步：兩塊分開最小化。**

- 第一塊 $2\alpha_2^2 - 2\alpha_2$：微分 $4\alpha_2 - 2 = 0$，$\alpha_2 = \frac{1}{2}$，值是 $-\frac{1}{2}$。
- 第二塊：令 $u = 2\alpha_1 + \alpha_4$，則 $2\alpha_1 = u - \alpha_4$，這一塊等於 $\frac{1}{2}u^2 - u + \alpha_4$。$\alpha_4 \ge 0$ 而且只會讓值變大，所以 $\alpha_4 = 0$。剩下 $\frac{1}{2}u^2 - u$，微分 $u - 1 = 0$，$u = 1$，也就是 $\alpha_1 = \frac{1}{2}$，值是 $-\frac{1}{2}$。

回頭算 $\alpha_3 = \frac{1}{2} + \frac{1}{2} - 0 = 1$，沒有違反 $\alpha_3 \ge 0$。對偶解是

$$
\boldsymbol{\alpha} = \Big(\frac{1}{2},\ \frac{1}{2},\ 1,\ 0\Big),\qquad \text{objective} = -\frac{1}{2} - \frac{1}{2} = -1
$$

**第五步：算回 $\mathbf{w}$ 與 $b$。**

$$
\mathbf{w} = -\frac{1}{2}(0,0) - \frac{1}{2}(2,2) + 1 \cdot (2,0) + 0 \cdot (3,0) = (1, -1)
$$

等式的圈圈叉叉讀法也對得上：負例的 $\alpha_1 + \alpha_2 = 1$，正例的 $\alpha_3 + \alpha_4 = 1$。$b$ 用任何一個 $\alpha_n > 0$ 的點算：第 1 點 $b = -1 - 0 = -1$；第 2 點 $b = -1 - (2 - 2) = -1$；第 3 點 $b = 1 - 2 = -1$。三個點給出同一個 $b = -1$。

**第六步：檢查 KKT。**

| $n$ | $\alpha_n$ | $y_n(\mathbf{w}^\top\mathbf{z}_n + b)$ | 在胖邊界上？ | $\alpha_n \times (1 - \text{左欄})$ |
|---|---|---|---|---|
| 1 | $\frac{1}{2}$ | $(-1)(0 - 1) = 1$ | 是 | $0$ |
| 2 | $\frac{1}{2}$ | $(-1)(2 - 2 - 1) = 1$ | 是 | $0$ |
| 3 | $1$ | $(+1)(2 - 0 - 1) = 1$ | 是 | $0$ |
| 4 | $0$ | $(+1)(3 - 0 - 1) = 2$ | 否 | $0$ |

四條都成立：每個點的第三欄都至少是 1，$\alpha_n$ 都不是負的，$\sum_n y_n\alpha_n = -\frac{1}{2} - \frac{1}{2} + 1 + 0 = 0$，最後一欄全是 0。

**這個結果代表什麼。** 分類器是 $g_{\text{SVM}}(\mathbf{x}) = \text{sign}(x_1 - x_2 - 1)$，和上一堂講義直接解原始問題的答案 $(w_1, w_2, b) = (1, -1, -1)$ 一樣，margin 是 $1/\lVert\mathbf{w}\rVert = 1/\sqrt{2} \approx 0.707$，就是第 18 頁圖上標的數字。支援向量是第 1、2、3 點；第 4 點離邊界比較遠，$\alpha_4 = 0$，把它從資料裡拿掉，上面每一步的結果都不變。

強對偶也看得到。對偶問題在 max 的寫法下最佳值是 $-(-1) = 1$，原始問題的最佳值是 $\frac{1}{2}\mathbf{w}^\top\mathbf{w} = \frac{1}{2}(1 + 1) = 1$，兩者相等。其他合法的 $\boldsymbol{\alpha}$ 只給得出比較低的下界：

| 合法的 $\boldsymbol{\alpha}$ | $-\frac{1}{2}\lVert\sum_n\alpha_n y_n\mathbf{z}_n\rVert^2 + \sum_n\alpha_n$ | 與原始最佳值 1 比 |
|---|---|---|
| $(0, 0, 0, 0)$ | $0$ | 較低 |
| $(\frac{1}{4}, \frac{1}{4}, \frac{1}{2}, 0)$ | $-\frac{1}{4} + 1 = \frac{3}{4}$ | 較低 |
| $(\frac{1}{2}, \frac{1}{2}, \frac{1}{2}, \frac{1}{2})$ | $-\frac{13}{8} + 2 = \frac{3}{8}$ | 較低 |
| $(\frac{1}{2}, \frac{1}{2}, 1, 0)$ | $-1 + 2 = 1$ | 相等 |

第三列的 $\mathbf{w} = -\frac{1}{2}(2,2) + \frac{1}{2}(2,0) + \frac{1}{2}(3,0) = (\frac{3}{2}, -1)$，$\frac{1}{2}\lVert\mathbf{w}\rVert^2 = \frac{13}{8}$，其他列可以照樣自己算一次。把同一個 $Q_D$、$\mathbf{p} = -\mathbf{1}_4$ 與限制式交給數值的 QP 解算器（例如 Python 的 cvxopt），得到的也是 $\boldsymbol{\alpha} = (0.5, 0.5, 1, 0)$、目標值 $-1$，和手算一致。

### Fun Time：兩個對稱的點，b 是多少

**題目（第 17 頁）：** 沿用第一節 Fun Time 的兩筆資料 $(\mathbf{z}, +1)$ 與 $(-\mathbf{z}, -1)$。解完 hard-margin SVM 的對偶問題後，假設最佳的 $\alpha_1$ 與 $\alpha_2$ 都嚴格大於 0。最佳的 $b$ 是多少？

1. $-1$
2. $0$
3. $1$
4. 依上面的描述無法確定

**答案：2。** 兩個 $\alpha$ 都是正的，兩個點都可以拿來算 $b$。第一點：$b = y_1 - \mathbf{w}^\top\mathbf{z}_1 = +1 - \mathbf{w}^\top\mathbf{z}$。第二點：$b = y_2 - \mathbf{w}^\top\mathbf{z}_2 = -1 + \mathbf{w}^\top\mathbf{z}$。兩式相加，$2b = 0$，$b = 0$；兩式相減得到 $\mathbf{w}^\top\mathbf{z} = 1$。課堂上講的理由只有一句：因為對稱性。兩個點對原點對稱，最胖的分隔線也就通過原點。

選項 1 與 3 各自只滿足其中一條等式。選項 4 不對，因為兩條等式已經足夠決定 $b$，不需要知道 $\mathbf{z}$ 是什麼。

本文補充：連 $\boldsymbol{\alpha}$ 也解得出來。等式限制 $\alpha_1 - \alpha_2 = 0$ 給出 $\alpha_1 = \alpha_2 = \alpha$，於是 $\mathbf{w} = \alpha\mathbf{z} - \alpha(-\mathbf{z}) = 2\alpha\mathbf{z}$。代入 $\mathbf{w}^\top\mathbf{z} = 1$ 得 $\alpha = \frac{1}{2\lVert\mathbf{z}\rVert^2}$。以 $\mathbf{z} = (1, 2)$ 為例，$\alpha_1 = \alpha_2 = \frac{1}{10}$、$\mathbf{w} = (\frac{1}{5}, \frac{2}{5})$、$b = 0$，兩個點的 $y_n(\mathbf{w}^\top\mathbf{z}_n + b)$ 都是 1。兩個點離得愈遠，$\alpha$ 愈小。只要 $\mathbf{z} \ne \mathbf{0}$，兩個 $\alpha$ 一定都是正的，題目的假設其實自動成立。

## 對偶解透露了什麼：支援向量，以及還沒擺脫的特徵維度

```youtube
url: https://www.youtube.com/watch?v=agmmQh702aA
title: Dual Support Vector Machine :: Messages behind Dual SVM @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–03:17 是支援向量，03:17–05:43 與 PLA 對照，05:43–07:31 比較兩種形式，07:31–09:13 談還沒解決的事，之後是 Fun Time 與總結。）

### 支援向量的正式定義

上一堂說，落在胖邊界上的點決定了最胖的超平面，其他點不需要，並且把邊界上的點叫作 support vector 的候選（candidates）。第 18 頁現在給正式的定義：$\alpha_n > 0$ 的資料 $(\mathbf{z}_n, y_n)$ 才叫支援向量。投影片上「(candidates)」那個字被劃掉了。

兩群點的關係是

$$
\text{SV（}\alpha_n > 0\text{）} \ \subseteq\ \text{SV candidates（在胖邊界上）}
$$

互補鬆弛只保證一個方向：$\alpha_n > 0$ 的點一定在邊界上。反過來，邊界上的點 $\alpha_n$ 可以是 0（自我檢查第 2 題有一個例子）。課堂上的說法是，支援向量可能比邊界上的候選點少一些，也可能一樣多。第 18 頁的圖就是剛才那四個點：灰色的帶狀區域是胖邊界，中間的線標著 $x_1 - x_2 - 1 = 0$，寬度標 0.707；$(0,0)$、$(2,2)$、$(2,0)$ 三個點畫了方框，$(3,0)$ 沒有。

有了這個定義，算 $\mathbf{w}$ 與 $b$ 的兩條式子都只跟支援向量有關：

$$
\mathbf{w} = \sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n = \sum_{\text{SV}}\alpha_n y_n\mathbf{z}_n, \qquad b = y_n - \mathbf{w}^\top\mathbf{z}_n \ \text{（任選一個 SV）}
$$

$\alpha_n = 0$ 的項在加總裡沒有貢獻，所以第一個等號可以只對 SV 加。講義把這一頁總結成：SVM 是靠對偶最佳解找出支援向量，來學到最胖的超平面。課堂上換了一個角度講同一件事：SVM 像一個篩選機制，把資料分成兩類，支援向量是有用的，其他的點對找出胖邊界沒有幫助，可以不管。

### w 是資料的線性組合：SVM 和 PLA 並排看

第 19 頁把 SVM 的 $\mathbf{w}$ 和[基石第 2 堂：感知器與 PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)的 PLA 放在一起：

| | $\mathbf{w}$ 的寫法 | 係數從哪裡來 |
|---|---|---|
| SVM | $\mathbf{w}_{\text{SVM}} = \sum_{n=1}^{N}\alpha_n(y_n\mathbf{z}_n)$ | 對偶問題的解 |
| PLA | $\mathbf{w}_{\text{PLA}} = \sum_{n=1}^{N}\beta_n(y_n\mathbf{z}_n)$ | 第 $n$ 筆資料被拿來修正錯誤的次數 |

PLA 從 $\mathbf{w} = \mathbf{0}$ 出發，每次犯錯就加上一個 $y_n\mathbf{z}_n$，所以最後的 $\mathbf{w}$ 當然是這些向量的整數倍相加。講義指出兩者的 $\mathbf{w}$ 都是 $y_n\mathbf{z}_n$ 的線性組合，稱為 $\mathbf{w}$「由資料表示」（represented by data）；從 $\mathbf{w}_0 = \mathbf{0}$ 開始、用梯度下降或隨機梯度下降訓練的邏輯迴歸與線性迴歸也一樣，課堂上因此說 SVM 與 PLA 長得像不完全是偶然。SVM 特別的地方是只用支援向量來表示 $\mathbf{w}$。

課堂上還點出這個對照裡值得想的一層意思：兩個演算法對「哪些資料重要」的看法不同。SVM 認為重要的是靠近邊界的點，PLA 認為重要的是常常被分錯的點，各自用自己認為重要的點來表示 $\mathbf{w}$。

### 兩種寫法的比較

第 20 頁把 hard-margin SVM 的兩種形式並列。對偶那一欄用矩陣寫：$\min_{\boldsymbol{\alpha}} \frac{1}{2}\boldsymbol{\alpha}^\top Q_D\boldsymbol{\alpha} - \mathbf{1}^\top\boldsymbol{\alpha}$ subject to $\mathbf{y}^\top\boldsymbol{\alpha} = 0$、$\alpha_n \ge 0$。

| | 原始（primal） | 對偶（dual） |
|---|---|---|
| 變數 | $\tilde{d}+1$ 個 | $N$ 個 |
| 限制式 | $N$ 條 | $N+1$ 條，形式簡單 |
| 適合的情況 | $\tilde{d}+1$ 小 | $N$ 小 |
| 物理意義 | 找出特定縮放的 $(b, \mathbf{w})$ | 找出支援向量與它們的 $\alpha_n$ |

「適合 $N$ 小」那一格課堂上講得比較保守：資料量太大時對偶也不好解，資料量不大、或至少還解得動時，才用對偶來代替。兩者最後都得到同一個最胖的超平面，分類器都是 $g_{\text{SVM}}(\mathbf{x}) = \text{sign}(\mathbf{w}^\top\boldsymbol{\Phi}(\mathbf{x}) + b)$。

### 還沒做完：d̃ 藏在 Q 矩陣裡

第 21 頁的標題是 Are We Done Yet?。對偶問題有 $N$ 個變數、$N+1$ 條限制式，表面上看不到 $\tilde{d}$。但要把問題交給解算器，得先算出 $Q_D$ 的每個元素

$$
q_{n,m} = y_n y_m\,\mathbf{z}_n^\top\mathbf{z}_m
$$

$\mathbf{z}_n^\top\mathbf{z}_m$ 是兩個 $\tilde{d}$ 維向量的內積，照定義一個分量一個分量乘起來再相加，要 $O(\tilde{d})$ 的計算量。$\tilde{d}$ 的依賴從「變數個數」搬到了「算矩陣元素的時間」，並沒有消失；課堂上的講法是 $\tilde{d}$ 藏到算 $Q_D$ 的地方去了；$\tilde{d}$ 是無限大的話，這裡要算無限多步，永遠做不完。

講義的結論是：只有避開這種直接的算法，才算真的不依賴 $\tilde{d}$，這是下一堂的事。文章標題說的「擺脫特徵維度」，在這堂只做完一半：變數個數擺脫了，內積的計算還沒有。

### Fun Time：邊界上可能有幾個點

**題目（第 22 頁）：** 對 $N = 5566$ 筆資料跑對偶 hard-margin SVM，得到 1126 個支援向量。落在胖邊界上的資料（也就是 SV candidates）可能有幾筆？

1. $0$
2. $1024$
3. $1234$
4. $9999$

**答案：3。** 支援向量一定在胖邊界上，邊界上的點又不可能比資料總數多，所以

$$
1126 = \#\text{SV} \ \le\ \#\text{SV candidates} \ \le\ N = 5566
$$

四個選項裡只有 1234 落在這個範圍。0 和 1024 比支援向量的數量還少，9999 比資料總數還多。

第 23 頁的總結把四節各收成一句：想去掉對 $\tilde{d}$ 的依賴；KKT 條件把原始與對偶連起來；對偶是另一個 QP，用專門的解算器比較好；支援向量表示了最胖的超平面。下一堂的預告是 computing inner product in $\mathbb{R}^{\tilde{d}}$ efficiently。

## 自我檢查

**1. 兩筆二維資料：$\mathbf{z}_1 = (1, 1)$、$y_1 = +1$；$\mathbf{z}_2 = (0, 0)$、$y_2 = -1$。手算對偶解 $\boldsymbol{\alpha}$，再算回 $\mathbf{w}$ 與 $b$。**

答案：等式限制給 $\alpha_1 = \alpha_2 = \alpha$。$\mathbf{w} = \alpha(1,1) - \alpha(0,0) = (\alpha, \alpha)$，目標函數是 $\frac{1}{2}(2\alpha^2) - 2\alpha = \alpha^2 - 2\alpha$，微分得 $\alpha = 1$。所以 $\boldsymbol{\alpha} = (1, 1)$、$\mathbf{w} = (1, 1)$。用第 1 點算 $b = 1 - 2 = -1$，用第 2 點算 $b = -1 - 0 = -1$，一致。兩個點的 $y_n(\mathbf{w}^\top\mathbf{z}_n + b)$ 都是 1，都是支援向量。

**2. 三筆資料：$(0, 0)$ 標 $-1$，$(2, 0)$ 標 $+1$，$(2, 5)$ 標 $+1$。最佳解是 $\mathbf{w} = (1, 0)$、$b = -1$。哪些點在胖邊界上？哪些是支援向量？**

答案：三個點的 $y_n(\mathbf{w}^\top\mathbf{z}_n + b)$ 分別是 $(-1)(-1) = 1$、$2 - 1 = 1$、$2 - 1 = 1$，三個都在胖邊界上，都是 SV candidates。再用 $\mathbf{w} = \sum_n \alpha_n y_n\mathbf{z}_n$：$(1, 0) = \alpha_2(2, 0) + \alpha_3(2, 5)$，第二個分量要求 $5\alpha_3 = 0$，所以 $\alpha_3 = 0$、$\alpha_2 = \frac{1}{2}$，等式限制給 $\alpha_1 = \frac{1}{2}$。支援向量只有前兩點。$(2, 5)$ 在邊界上卻不是支援向量，這就是「⊆」不能寫成「=」的原因。

**3. 推導中為什麼會多出 $\sum_n \alpha_n y_n = 0$ 這條限制式？如果某組 $\boldsymbol{\alpha}$ 不滿足它，內層的 $\min_{b,\mathbf{w}} \mathcal{L}$ 是多少？**

判準：答案要說出 $\mathcal{L}$ 對 $b$ 是一次式、係數是 $-\sum_n \alpha_n y_n$；係數不為 0 時 $b$ 可以讓 $\mathcal{L}$ 無限制地變小，內層的 min 是 $-\infty$；外層取 max 不會選這種 $\boldsymbol{\alpha}$，所以加上這條限制不改變答案，同時讓含 $b$ 的項消失。

**4. 在四個點的例子裡，$\boldsymbol{\alpha} = (1, 1, 2, 0)$ 合不合法？它給原始問題的下界是多少？**

答案：$-1 - 1 + 2 + 0 = 0$，而且每個分量都不是負的，合法。$\mathbf{w} = -(2, 2) + 2(2, 0) = (2, -2)$，$\frac{1}{2}\lVert\mathbf{w}\rVert^2 = 4$，$\sum_n \alpha_n = 4$，下界是 $-4 + 4 = 0$。它是最佳解的兩倍，方向對了但走過頭，給出的下界 0 比最佳值 1 差。

**5. $N = 1{,}000$ 筆資料，特徵轉換後 $\tilde{d} = 10^6$。原始與對偶的 QP 各有幾個變數？對偶比較小，那它的代價在哪裡？**

答案：原始 $10^6 + 1$ 個變數，對偶 $1{,}000$ 個。代價在準備 $Q_D$：它有 $10^6$ 個元素，每個要算一次 $10^6$ 維的內積，照定義算總共約 $10^{12}$ 次乘法（利用對稱性可以省一半）。變數少了，$\tilde{d}$ 仍然出現在計算量裡。

## 練習與對應閱讀

**兩個學期的對應週次。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)把 linear SVM 與 dual SVM 排在同一週（W9，10/28），這堂的投影片代號是 `202u`。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)同樣排在 W9（11/04），兩堂一起上。Fall 2026 這一週的投影片在 2026-09-30 還沒上線，所以本文只用 MOOC 版講義。

**教科書。** 兩份課程頁都把這堂標在 [Learning from Data](http://amlbook.com)（LFD）的 e-8.2。e-Chapter 8 是 LFD 的線上章節。

**作業。** 這堂在 Fall 2024 沒有專屬作業，相關的題目在 [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)（2024-11-18 發布、12-02 截止），沒有官方解答：

- **Q1**：把 PLA 的 $\mathbf{w}$ 寫成 $\sum_n \alpha_n\boldsymbol{\Phi}(\mathbf{x}_n)$，問每次修正時 $\boldsymbol{\alpha}$ 該怎麼更新。這是第 19 頁「$\mathbf{w}$ 由資料表示」的延伸。可以自己寫一個這種版本的 PLA，和一般 PLA 在同一份資料上比對每一步的 $\mathbf{w}$ 是否一致。
- **Q13（bonus）**：推導 soft-margin SVM 對偶問題的對偶，和原始問題比較。先把這堂的四個步驟（寫拉格朗日函數、對調、偏微分、代回）練熟再做。

整份作業的導讀在[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

**延伸閱讀。** [CS229 主講義第 6 章](https://cs229.stanford.edu/main_notes.pdf)用另一種方式推導 SVM 的對偶，可以和這堂的寫法對照。

**下一堂。** [技法第 3 堂：Kernel SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm) 處理這堂留下的 $\mathbf{z}_n^\top\mathbf{z}_m$：不把 $\tilde{d}$ 維的特徵算出來，也能得到內積。

## 課程影片來源

原始影片：[Motivation of Dual SVM](https://www.youtube.com/watch?v=VUp-17l03lk)、[Lagrange Dual SVM](https://www.youtube.com/watch?v=Yhwtvbzg9Fw)、[Solving Dual SVM](https://www.youtube.com/watch?v=qGk0p7K07Mc)、[Messages behind Dual SVM](https://www.youtube.com/watch?v=agmmQh702aA)

- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於 2026-10-13 從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：改為一堂一篇，這篇只寫技法第 2 堂，依講義與影片逐字稿重寫。

## 參考資料

- [技法第 2 堂講義 202_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/202_handout.pdf)：本文的主要底本，四節的推導、四題 Fun Time 與第 18 頁的圖都出自這份講義。
- [技法第 1 堂講義 201_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/201_handout.pdf)：數值例子用的四個點與原始問題的解 $(1, -1, -1)$ 出自它的第 17 頁。
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：對應週次與 LFD 章節。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：對應週次與 LFD 章節。
- [Fall 2024 Homework 6（hw6_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)：Q1 與 Q13 的題目內容。
- [Learning from Data 教科書網站](http://amlbook.com)：e-8.2 的出處。
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：延伸閱讀，第 6 章的 SVM 對偶推導。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。

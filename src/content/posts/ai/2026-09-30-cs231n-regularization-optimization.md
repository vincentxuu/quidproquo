---
title: "CS231N L3：正則化與最佳化——從隨機亂試到 AdamW 與學習率排程"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, stanford, ai-course, computer-vision, deep-learning, optimization, gradient-descent]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 3
tldr: "L2 給了分數函式和 loss，L3 回答「怎麼找到好的 W」。前半講正則化：在 data loss 旁邊加 λR(W)，讓模型不要把訓練資料背得太好。後半是一條最佳化器的演進線：SGD 在窄長山谷裡會來回震盪，Momentum 累積速度，RMSProp 依每個維度調步伐，Adam 把兩者合起來再做偏差修正，AdamW 把 weight decay 移到動量計算之外。投影片最後的實務建議是：多數情況先用 Adam(W)，SGD+Momentum 可能更好，但要花更多力氣調學習率與排程。"
description: "Stanford CS231N（Spring 2026）第 3 講導讀：L1／L2 正則化的用意、數值梯度與解析梯度、minibatch SGD 的三個問題、Momentum／RMSProp／Adam／AdamW 的更新式、step／cosine／linear／inverse sqrt 學習率排程與 warmup，以及二階方法為什麼不適合深度學習。附課程筆記 optimization-1 對照與 2025 錄影。"
draft: false
glossary:
  - term: "正則化"
    aliases: ["regularization", "正規化"]
    definition: "在訓練目標裡加上一項只看權重、不看資料的懲罰 λR(W)，用來表達對權重的偏好，避免模型把訓練資料擬合得太好而學到雜訊。"
    context: "CS231N L3 的寫法是 L(W) = data loss + λR(W)，λ 是要調的超參數。"
  - term: "條件數"
    aliases: ["condition number"]
    definition: "Hessian 矩陣最大奇異值與最小奇異值的比。比值很大代表 loss 在某些方向很陡、某些方向很平。"
    context: "L3 用它解釋 SGD 為什麼會在陡的方向震盪、在平的方向前進很慢。"
  - term: "AdamW"
    definition: "Adam 的變體：weight decay 不加在梯度裡（因此不進入一階、二階動量的計算），而是在更新權重那一步另外減掉。"
    context: "L3 投影片把它和「標準 Adam 把 L2 算在梯度裡」並排比較。"
    links:
      - label: "fast.ai: AdamW and Super-convergence"
        url: "https://www.fast.ai/posts/2018-07-02-adam-weight-decay.html"
  - term: "學習率 warmup"
    aliases: ["linear warmup", "warmup"]
    definition: "訓練最開始讓學習率從 0 線性爬升到設定值，避免一開始學習率太高讓 loss 爆掉。"
    context: "L3 投影片舉的例子是在前約 5,000 次迭代線性增加。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-regularization-optimization-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **版本說明**：投影片依據 [CS231N](https://cs231n.stanford.edu/) Spring 2026 的 [lecture_3.pdf](https://cs231n.stanford.edu/slides/2026/lecture_3.pdf)（121 頁，頁尾日期 2026 年 4 月 7 日）；錄影用的是 [Spring 2025 第 3 講](https://www.youtube.com/watch?v=dyNGd06MWn4)，因為 2026 錄影只放在 Canvas，限修課生觀看。兩者可能有差異：2025 版投影片 119 頁，我抽查的關鍵詞（AdaGrad、AdamW、L-BFGS、warmup）兩版都有，但沒有逐頁比對。事實皆於 2026-09-30 打開官方材料核對。存取等級 **A3**（定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）。

**系列位置**：上一篇 [L2：影像分類、kNN 與線性分類器](/posts/ai/2026-09-30-cs231n-image-classification-linear)｜下一篇 [L4：神經網路與反向傳播](/posts/ai/2026-09-30-cs231n-neural-networks-backprop)｜[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)

[CS231N](https://cs231n.stanford.edu/) 的第二講給了三樣東西：一組 (x, y) 資料、一個分數函式 f(x, W) = Wx + b，以及衡量分數好壞的 softmax loss。第三講接著問：**有了 loss，怎麼找到讓它變小的 W？**

[2026 課表](https://cs231n.stanford.edu/schedule.html)把這一講列為四個主題：正則化、隨機梯度下降、Momentum／AdaGrad／Adam、學習率排程。它屬於「Deep Learning Basics」單元，是後面每一個模型（CNN、RNN、Transformer、diffusion）都會重複用到的訓練工具箱。

這篇是本系列第一篇硬文章，照五層走：先給場景，再講直覺，機制的公式收在折疊區塊裡，然後連回這門課的模型，最後列出想深入可以讀什麼。

## 課程影片來源

本文以 Spring 2026 教材為準。官方 Spring 2026 課表（2026-10-10 即時查證）沒有列出錄影連結，也沒有找到 Spring 2026 的公開播放清單；下列 Spring 2025 錄影來自 Stanford Online 的公開播放清單，是講次標題相同的相關補充影片，內容可能與 2026 版不同，原講次錄影未確認。查核日期：2026-10-10。

```youtube
url: https://www.youtube.com/watch?v=dyNGd06MWn4
title: Stanford CS231N | Spring 2025 | Lecture 3: Regularization and Optimization
```

原始影片：[Stanford CS231N | Spring 2025 | Lecture 3: Regularization and Optimization](https://www.youtube.com/watch?v=dyNGd06MWn4)

課程與錄影入口：

- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 場景：在霧裡下山

最佳化那一段的開頭，投影片放了一張山谷地形的照片和一個走路的人。可以這樣想：loss 是海拔，W 是你站的位置，目標是走到谷底；參數有上萬維，你看不到整片地形，只算得出腳下的坡度。

第一個方案刻意很笨：**隨機試 W，留下 loss 最低的那組**。投影片說這樣在測試集上拿到 15.5% 準確率，旁邊註明當時最好的結果約 99.7%。[課程筆記 optimization-1](https://cs231n.github.io/optimization-1/) 用的是同一個例子，還補了一句：CIFAR-10 有十類，瞎猜是 10%，所以 15.5% 不算太差。

第二個方案是「跟著坡度走」。這就是整講的主線。

在講怎麼走之前，L3 先處理另一個問題：**谷底不只一個，你要哪一個？**

## 直覺一：正則化是在 loss 裡寫下偏好

投影片的完整目標函式是：

$$
L(W) = \frac{1}{N}\sum_{i=1}^{N} L_i(f(x_i, W), y_i) + \lambda R(W)
$$

前半是 data loss，要模型的預測符合訓練資料；後半是正則化，**要模型不要在訓練資料上表現得太好**。λ 是正則化強度，是一個超參數。

為什麼要刻意阻止模型表現太好？投影片用一個玩具例子：一條彎來彎去、穿過每個訓練點的曲線 f1，和一條平滑的直線 f2。新資料來的時候，f2 通常比較準。這裡引用了奧坎剃刀：多個假設都能解釋資料時，選最簡單的。

投影片列出三個正則化的理由：

1. **表達對權重的偏好**。例如 L2 正則化偏好把權重「攤開」，不要全壓在少數幾個維度上。
2. **讓模型簡單，才能在測試資料上好用**。
3. **加入曲率，讓最佳化更好做**。

常見的形式分兩類。簡單的有 L2、L1、兩者相加的 elastic net；比較複雜的有 dropout、batch normalization、stochastic depth、fractional pooling。後兩類在這一講只點名，dropout 與 batch norm 要到 [A2](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn) 才實作。

投影片留了一個問題給你：輸入 x = [1, 1, 1, 1]，兩組權重 w1 = [1, 0, 0, 0] 和 w2 = [0.25, 0.25, 0.25, 0.25] 算出來的分數都是 1，L2 正則化 R(W) = ΣΣ W² 會選哪一個？投影片框起 w2，寫著 L2 喜歡把權重「攤開」。L1 會選哪一個，投影片只留問題，沒有給答案。

## 直覺二：梯度告訴你往哪裡走

一維的導數是斜率；多維的梯度是每個維度偏導數組成的向量。投影片的三句話值得記住：任何方向的斜率，是那個方向和梯度的內積；最陡的下降方向，是負梯度。

算梯度有兩種方法：

| 方法 | 做法 | 投影片的評語 |
|---|---|---|
| 數值梯度 | 每個維度加一個很小的 h，看 loss 變多少 | 近似、慢、好寫 |
| 解析梯度 | 用微積分直接寫出 ∇W L | 精確、快、容易寫錯 |

實務做法是兩者並用：**永遠用解析梯度訓練，但用數值梯度檢查實作**，這叫 gradient check。[A1](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet) 每個要你寫梯度的地方，都會附一個 gradient check 的儲存格。

有了梯度，gradient descent 就是反覆往負梯度方向走一小步。資料量 N 很大時，每一步都算完整的 loss 太貴，所以改用一小批資料（minibatch）估計梯度，投影片寫常見的大小是 32、64、128。這就是 SGD。

## 直覺三：SGD 的三個問題，和各自的解法

投影片把 SGD 會出問題的情況整理成三個：

**問題一：地形一邊陡、一邊平。** loss 在某個方向變化很快，另一個方向很慢。SGD 會在陡的方向來回震盪，在平的方向前進得很慢。投影片旁註：這種 loss 的條件數很高，也就是 Hessian 最大與最小奇異值的比很大。

**問題二：局部最小值與鞍點。** 梯度是零，gradient descent 就停住了。投影片引用 [Dauphin et al. (NIPS 2014)](https://arxiv.org/abs/1406.2572) 指出，在高維空間裡，鞍點比局部最小值常見得多。

**問題三：梯度有雜訊。** 梯度來自 minibatch，本來就是估計值。

接下來的每個最佳化器，都是在回應這三個問題中的某幾個：

| 最佳化器 | 做了什麼 | 回應哪個問題 |
|---|---|---|
| SGD + Momentum | 把過去的梯度累積成「速度」，沿著大方向繼續走 | 震盪、鞍點、雜訊 |
| RMSProp | 依每個維度的歷史梯度平方縮放步伐 | 陡的方向減速、平的方向加速 |
| Adam | Momentum + RMSProp，再加偏差修正 | 兩者兼顧 |
| AdamW | Adam，但 weight decay 不進入動量計算 | 正則化與最佳化器的交互作用 |

AdaGrad 在課表上有列，但在 2026 投影片裡，它的完整推導放在「Appendix / Enrichment Material（往年投影片）」。正文只在 Adam 那張投影片上把第二動量那一行標成「AdaGrad / RMSProp」。附錄裡對 AdaGrad 的關鍵提問是：訓練久了步伐會怎樣？答案是**衰減到零**，因為它累加的是全部歷史梯度平方。RMSProp 因此被稱為「leaky AdaGrad」，讓舊的平方和按比例衰減。

## 機制：更新式長什麼樣子

以下的程式碼與數字都照投影片抄錄。

<details>
<summary>SGD 與 SGD + Momentum</summary>

SGD：

$$x_{t+1} = x_t - \alpha \nabla f(x_t)$$

SGD + Momentum：

$$v_{t+1} = \rho v_t + \nabla f(x_t), \qquad x_{t+1} = x_t - \alpha v_{t+1}$$

投影片的說明：速度是梯度的移動平均；ρ 提供「摩擦」，常見值是 0.9 或 0.99。出處是 [Sutskever et al. (ICML 2013)](https://proceedings.mlr.press/v28/sutskever13.html)。投影片也提醒，你會看到其他寫法，但它們是等價的，產生同一串 x。

</details>

<details>
<summary>RMSProp</summary>

```python
grad_squared = 0
while True:
  dx = compute_gradient(x)
  grad_squared = decay_rate * grad_squared + (1 - decay_rate) * dx * dx
  x -= learning_rate * dx / (np.sqrt(grad_squared) + 1e-7)
```

出處標為 Tieleman and Hinton, 2012。效果是陡的方向（grad_squared 大）步伐被壓小，平的方向步伐相對放大，也就是所謂的「每個參數有自己的學習率」。

</details>

<details>
<summary>Adam（完整形式）</summary>

```python
first_moment = 0
second_moment = 0
for t in range(1, num_iterations):
  dx = compute_gradient(x)
  first_moment = beta1 * first_moment + (1 - beta1) * dx          # Momentum
  second_moment = beta2 * second_moment + (1 - beta2) * dx * dx   # AdaGrad / RMSProp
  first_unbias = first_moment / (1 - beta1 ** t)                  # Bias correction
  second_unbias = second_moment / (1 - beta2 ** t)
  x -= learning_rate * first_unbias / (np.sqrt(second_unbias) + 1e-7)
```

為什麼要偏差修正？投影片先給「幾乎是 Adam」的版本，然後問：第一步會發生什麼？兩個動量都從 0 開始，第二動量在頭幾步非常小，拿它當分母會讓第一步跨得很大。偏差修正就是在補「估計值從零開始」這件事。出處是 [Kingma and Ba (ICLR 2015)](https://arxiv.org/abs/1412.6980)。

投影片給的起始值：beta1 = 0.9、beta2 = 0.999、learning_rate = 1e-3 或 5e-4，「對很多模型都是很好的起點」。

</details>

<details>
<summary>AdamW：weight decay 放在哪裡</summary>

投影片問：正則化（例如 L2）怎麼和最佳化器互動？答案是「看情況」。

- 標準 Adam：L2 項算在梯度 dx 裡，所以它**會進入**一階、二階動量的計算，也就被 RMSProp 那一項縮放。
- AdamW：weight decay 項**在動量算完之後**，直接加在最後一行的更新上。

投影片附了一張 ImageNet 準確率對訓練 epoch 的圖，來源是 [fast.ai 2018 年的文章](https://www.fast.ai/posts/2018-07-02-adam-weight-decay.html)。

</details>

<details>
<summary>學習率排程與 warmup</summary>

SGD、Momentum、RMSProp、Adam、AdamW 都有學習率這個超參數。投影片先問「哪一條學習率曲線最好？」，答案是：其實每一條都可能是好的學習率，差別在什麼時候用。

| 排程 | 寫法 | 投影片舉的例子 |
|---|---|---|
| Step | 在幾個固定點降低 | ResNet 在第 30、60、90 個 epoch 把學習率乘以 0.1 |
| Cosine | $\alpha_t = \frac{1}{2}\alpha_0(1+\cos(t\pi/T))$ | 引用 SGDR、GPT、SlowFast、Sparse Transformers |
| Linear | $\alpha_t = \alpha_0(1 - t/T)$ | 引用 BERT |
| Inverse sqrt | $\alpha_t = \alpha_0/\sqrt{t}$ | 引用 Attention Is All You Need |

α₀ 是初始學習率，α_t 是第 t 個 epoch 的學習率，T 是總 epoch 數。

**Linear warmup**：初始學習率太高會讓 loss 爆掉，所以在前約 5,000 次迭代從 0 線性增加。投影片同頁給了一條經驗法則：batch size 放大 N 倍，初始學習率也放大 N 倍，出處是 [Goyal et al. (2017)](https://arxiv.org/abs/1706.02677)。

</details>

<details>
<summary>二階最佳化為什麼不適合深度學習</summary>

一階方法用梯度做線性近似，往近似的最低處走一步；二階方法用梯度加 Hessian 做二次近似，直接跳到近似的最低點（牛頓法）。

投影片的回答很直接：Hessian 有 O(N²) 個元素，求反矩陣要 O(N³)，而 N 是數千萬到數億個參數。附錄補充了 BFGS 與 L-BFGS：L-BFGS 在 full batch、沒有隨機性的情況下通常表現很好，但移到 minibatch 設定就效果不佳，投影片說把二階方法用到大規模隨機設定仍是活躍的研究領域。

</details>

## 連回模型：這門課接下來怎麼用這些東西

投影片最後的「In practice」只有三條：

1. **Adam(W) 在很多情況下是好的預設選擇**，就算學習率固定不變，也常常還可以。
2. **SGD + Momentum 可能比 Adam 好**，但通常要花更多力氣調學習率和排程。
3. 如果負擔得起 full batch 更新，可以考慮一階以外的方法。

這三條會一路用到期末。[A1](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet) 的 Q5 要你在 `cs231n/optim.py` 裡親手實作 `sgd_momentum`、`rmsprop`、`adam` 三個函式，再用它們訓練多層全連接網路；起始碼替 Adam 設的預設值正好是投影片的 beta1 = 0.9、beta2 = 0.999、learning_rate = 1e-3。同一份 notebook 還有一題行內問答問 AdaGrad 的步伐為什麼會越來越小、Adam 會不會有同樣的問題，正是附錄那一段的內容。

L3 的尾巴已經開始鋪下一講：線性分類器分不開的資料（投影片畫的是一圈紅點包著一圈藍點），換成極座標之後就分得開。與其手工設計這種轉換，不如讓模型自己學，這就是兩層神經網路。問題是，網路一變深，梯度要怎麼算？這是 [L4](/posts/ai/2026-09-30-cs231n-neural-networks-backprop) 的主題。

### 投影片和課程筆記的差別

課表把這一講連到筆記 [optimization-1](https://cs231n.github.io/optimization-1/)。讀之前要知道兩者的範圍不同：

- 筆記用的是**多類別 SVM loss**，投影片用 softmax loss。筆記有一段 SVM loss 地形的視覺化，指出它是凸函數，也提醒換成神經網路之後，目標函式會變成非凸、坑坑疤疤的地形。
- 筆記在隨機搜尋和跟著梯度走之間，多了一個「random local search」策略。
- 筆記只講到 minibatch gradient descent，**沒有** Momentum、Adam 或學習率排程。這些在另一份筆記 [neural-networks-3](https://cs231n.github.io/neural-networks-3/) 的「Parameter updates」一節，投影片附錄的 Nesterov 那幾張也是連到這裡。

## 想深入

- **Momentum 的直覺**：課表把 Distill 的 [Why Momentum Really Works](https://distill.pub/2017/momentum/) 列在 L4 的建議閱讀，但內容跟這一講直接相關，互動圖可以直接拖 ρ 和學習率看震盪怎麼變。
- **更完整的參數更新筆記**：[neural-networks-3](https://cs231n.github.io/neural-networks-3/) 涵蓋 Nesterov momentum、學習率退火、AdaGrad／RMSProp、超參數搜尋與 gradient check 的實務細節。
- **同一主題的另一個角度**：[CMU 11-785 第 8 講：最佳化器與正則化](/posts/ai/2026-08-22-cmu-11785-08-optimizers-regularization)，以及 [MIT 6.7960 導讀](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)。
- **向量微積分或機率先修不夠**：[Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)、[Stanford CS109 導讀](/posts/learning/2026-08-21-stanford-cs109-probability)。

## 自學怎麼做

1. 先看 [2025 第 3 講錄影](https://www.youtube.com/watch?v=dyNGd06MWn4)，手邊開著 [2026 投影片](https://cs231n.stanford.edu/slides/2026/lecture_3.pdf)，遇到不一致以投影片為準。
2. 讀 [optimization-1](https://cs231n.github.io/optimization-1/) 的數值梯度與 gradient check 段落，這是 A1 最常卡住的地方。
3. 把投影片上的 RMSProp 與 Adam 程式碼抄進 notebook，在一個二維的窄長碗形函式上跑，畫出軌跡。

今晚可以做的一件事：在 numpy 裡寫一個 f(x, y) = x² + 20y²，分別用 SGD 和 SGD + Momentum（ρ = 0.9）從同一點出發跑 50 步，畫出兩條路徑，親眼看「陡的方向震盪、平的方向很慢」是什麼樣子。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方來源只有 Spring 2025 版錄影，狀態改為僅附相關補充影片，影片標題改用原標題。

## 參考資料

- [CS231N 課程首頁（Spring 2026）](https://cs231n.stanford.edu/) — 講者、評分、錄影僅限 Canvas 的說明
- [CS231N Spring 2026 課表](https://cs231n.stanford.edu/schedule.html) — L3 四個主題、optimization-1 筆記連結、L4 的建議閱讀
- [Lecture 3 投影片：Regularization and Optimization（2026）](https://cs231n.stanford.edu/slides/2026/lecture_3.pdf) — 本文所有公式、程式碼與數字的來源
- [Lecture 3 投影片（2025）](https://cs231n.stanford.edu/slides/2025/lecture_3.pdf) — 與錄影同年的版本，用來比對
- [Stanford CS231N Spring 2025 Lecture 3 錄影](https://www.youtube.com/watch?v=dyNGd06MWn4) — Stanford Online 公開錄影
- [CS231N 課程筆記：Optimization: Stochastic Gradient Descent](https://cs231n.github.io/optimization-1/) — SVM loss 地形、三種搜尋策略、minibatch GD
- [CS231N 課程筆記：Neural Networks Part 3](https://cs231n.github.io/neural-networks-3/) — Parameter updates 一節
- [Assignment 1（2026）](https://cs231n.github.io/assignments2026/assignment1/) — Q5 實作 SGD+Momentum、RMSProp、Adam
- [Kingma & Ba, Adam: A Method for Stochastic Optimization](https://arxiv.org/abs/1412.6980)
- [Sutskever et al., On the importance of initialization and momentum in deep learning (ICML 2013)](https://proceedings.mlr.press/v28/sutskever13.html)
- [Dauphin et al., Identifying and attacking the saddle point problem (NIPS 2014)](https://arxiv.org/abs/1406.2572)
- [Goyal et al., Accurate, Large Minibatch SGD: Training ImageNet in 1 Hour](https://arxiv.org/abs/1706.02677)
- [fast.ai, AdamW and Super-convergence is now the fastest way to train neural nets](https://www.fast.ai/posts/2018-07-02-adam-weight-decay.html)
- [Goh, Why Momentum Really Works (Distill, 2017)](https://distill.pub/2017/momentum/)

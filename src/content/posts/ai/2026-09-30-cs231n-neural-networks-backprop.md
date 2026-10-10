---
title: "CS231N L4：神經網路與反向傳播——計算圖上的「上游乘以本地」"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, stanford, ai-course, computer-vision, deep-learning, neural-networks, backpropagation]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 4
tldr: "L4 前半把線性分類器 f = Wx 換成兩層網路 f = W₂ max(0, W₁x)，說明拿掉 max 這個激活函式就會退回線性分類器。後半回答網路變深之後梯度怎麼算：把函式畫成計算圖，每個節點只要知道自己的本地梯度，再乘上從後面傳回來的上游梯度。add 分配梯度、mul 交換、max 路由、copy 相加，四個模式就能追蹤任何網路。最後推到矩陣：dL/dx 永遠和 x 同形狀，所以不要真的建出 Jacobian。"
description: "Stanford CS231N（Spring 2026）第 4 講導讀：從線性分類器到多層感知器、激活函式為什麼必要、計算圖與反向傳播的 upstream × local 模式、四種閘門的梯度流、forward／backward API，以及向量與矩陣的 backprop。以 section 2 的五步例題為骨架，附官方 derivatives／linear-backprop 講義、Backprop Colab 與課程筆記 optimization-2 對照。"
draft: false
glossary:
  - term: "計算圖"
    aliases: ["computational graph", "運算圖"]
    definition: "把一個函式拆成一連串基本運算（加、乘、max、sigmoid……），每個運算是一個節點，資料沿著邊流動。前向傳遞沿邊往前算值，反向傳遞沿邊往回算梯度。"
    context: "CS231N L4 用它取代「在紙上推整個網路的梯度」。"
  - term: "上游梯度"
    aliases: ["upstream gradient"]
    definition: "loss 對某個節點輸出的梯度，由後面的節點傳回來。節點把它乘上自己的本地梯度，得到要往前傳的下游梯度。"
    context: "L4 與 section 2 把整套 backprop 濃縮成「downstream = upstream × local」。"
  - term: "Jacobian"
    aliases: ["雅可比矩陣", "Jacobian matrix"]
    definition: "向量對向量的導數：輸出的每個元素對輸入的每個元素各取一個偏導數，排成矩陣。"
    context: "L4 指出一層 N=64、D=M=4096 的矩陣乘法，Jacobian 約要 256 GB，所以實作上不會真的建出來。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-neural-networks-backprop-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **版本說明**：投影片依據 [CS231N](https://cs231n.stanford.edu/) Spring 2026 課表連結的 [lecture_4.pdf](https://cs231n.stanford.edu/slides/2026/lecture_4.pdf)（139 頁）。它的行政頁寫的是 2026 年的日期（A1 在 4/16 截止、專題提案 4/23 截止），但內容頁頁尾印的是「April 9, 2025」，照實記錄，不據此推論改了多少。錄影用 [Spring 2025 第 4 講](https://www.youtube.com/watch?v=25zD5qJHYsk)，2026 錄影只放在 Canvas。另外用到 2026 年 4 月 10 日 Backprop Review Session 的 [投影片](https://cs231n.stanford.edu/slides/2026/section_2_backprop.pdf) 和 [Colab](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/backprop.ipynb)。事實皆於 2026-09-30 打開官方材料核對。存取等級 **A3**（定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）。

**系列位置**：上一篇 [L3：正則化與最佳化](/posts/ai/2026-09-30-cs231n-regularization-optimization)｜下一篇 [A1 導讀：kNN、Softmax、兩層網路與全連接網路](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet)｜[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)

[L3](/posts/ai/2026-09-30-cs231n-regularization-optimization) 教了怎麼用梯度下山，但前提是你算得出梯度。對線性分類器，梯度還能在紙上推；網路一加深、loss 一換，紙上推導就撐不住了。

[2026 課表](https://cs231n.stanford.edu/schedule.html)給 L4 的主題只有兩個：Multi-layer Perceptron 和 Backpropagation。這是「Deep Learning Basics」單元的最後一講，也是本系列規劃裡標記的第一個數學高峰。

這篇照五層走：場景、直覺、機制（公式收在折疊區塊）、連回模型、想深入。機制那一層用 section 2 的五步例題當骨架，因為它比講義更一步一步。

## 課程影片來源

本文以 Spring 2026 教材為準。官方 Spring 2026 課表（2026-10-10 即時查證）沒有列出錄影連結，也沒有找到 Spring 2026 的公開播放清單；下列 Spring 2025 錄影來自 Stanford Online 的公開播放清單，是講次標題相同的相關補充影片，內容可能與 2026 版不同，原講次錄影未確認。查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：影片是 Spring 2025 第 4 講（長度 1:16:46），字幕有 sigmoid／ReLU 激活函數、神經元與大腦的類比、numpy 實作範例、計算圖與 local gradient、Jacobian 與矩陣梯度，與本文主題相符。本文的投影片細節以 2026 投影片為準，未逐項對照這支上一屆的錄影。

```youtube
url: https://www.youtube.com/watch?v=25zD5qJHYsk
title: Stanford CS231N | Spring 2025 | Lecture 4: Neural Networks and Backpropagation
```

原始影片：[Stanford CS231N | Spring 2025 | Lecture 4: Neural Networks and Backpropagation](https://www.youtube.com/watch?v=25zD5qJHYsk)

課程與錄影入口：

- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 場景：線性分類器不夠用

L3 結尾留了一張圖：一圈紅點被一圈藍點包住，任何一條直線都分不開。換成極座標 (r, θ) 之後，紅點和藍點各自排成一列，一條直線就分開了。

L4 從這裡接手，把分數函式從 f = Wx 換成兩層：

$$
f = W_2 \max(0, W_1 x)
$$

投影片用 CIFAR-10 的尺寸畫出來：輸入 x 是 3,072 維，中間的 h 是 100 維，輸出 s 是 10 個類別分數。L2 的線性分類器每類只能學**一個**樣板；兩層網路先學 100 個樣板，再讓各類別共用、組合它們。

加更多層也一樣，投影片接著畫了三層網路。這類網路更精確的名稱是「全連接網路」（fully-connected network），也叫「多層感知器」（MLP）。

## 直覺一：拿掉 max，網路就退回線性

投影片問：如果不用激活函式，直接疊 W₂W₁x 呢？答案是又變回線性分類器，因為兩個矩陣相乘還是一個矩陣。**max(0, ·) 這個非線性才是多出來的表達能力。** 投影片把它稱為激活函式，並說 ReLU 是大多數問題的好預設。

幾個投影片上的實務說法：

- **命名習慣**：兩層權重的網路叫「2-layer Neural Net」或「1-hidden-layer Neural Net」，三層依此類推。
- **訓練一個兩層網路，大約 20 行 numpy**：定義網路、前向、手算解析梯度、梯度下降。投影片放了完整程式碼。
- **神經元越多，容量越大。但不要用縮小網路來正則化**，要用更強的正則化。
- **小心大腦的類比**。生物神經元有很多種類，樹突本身能做複雜的非線性計算，突觸也不是單一權重。投影片還舉了 [Xie et al. (ICCV 2019)](https://arxiv.org/abs/1904.01569) 隨機連線的網路也能運作，說明規則分層是為了計算效率，不是在模仿大腦。

## 直覺二：為什麼要計算圖

把兩層網路接上 L2 的 hinge loss 和 L3 的正則化，投影片寫出完整的 loss：

$$
L = \frac{1}{N}\sum_{i=1}^{N} L_i + \lambda R(W_1) + \lambda R(W_2)
$$

接著列出在紙上推 ∇W₁L、∇W₂L 的三個問題：很繁瑣，要大量矩陣微積分；換一個 loss（例如從 hinge 換成 softmax）就得全部重推；模型一複雜就不可行。投影片放了 AlexNet 和 Neural Turing Machine 的計算圖，說明真正的網路長什麼樣子。

解法是**計算圖 + 反向傳播**。把整個函式拆成一串基本運算，每個節點只負責兩件事：前向時算出輸出，反向時把收到的梯度乘上自己的本地梯度往回傳。section 2 的投影片把這個好處寫成一句話：每個節點只需要知道自己的運算和上游梯度，其他什麼都不用知道，所以 backprop 才能模組化、才能擴展。

## 直覺三：四種閘門，四種梯度流

投影片把常見節點的梯度行為整理成四個模式，section 2 稱之為「追蹤梯度的視覺工具箱」：

| 閘門 | 梯度怎麼流 | 一句話 |
|---|---|---|
| add | 兩個輸入都拿到一樣的上游梯度 | 分配器 |
| mul | 每個輸入拿到上游梯度乘以**另一個**輸入的值 | 交換乘數 |
| max | 只有比較大的那個輸入拿到梯度，另一個是 0 | 路由器 |
| copy（分支） | 從多條路回來的梯度相加 | 加法器 |

ReLU 就是一個 max 閘門：輸入為正的地方梯度照傳，小於等於零的地方梯度歸零。記住這四個，[A1](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet) 裡大部分 backward 函式都能先在紙上畫出來再寫。

## 機制：從純量到矩陣

<details>
<summary>暖身：f(x, y, z) = (x + y) · z</summary>

投影片和 section 2 用同一個例子：x = −2、y = 5、z = −4。

前向：q = x + y = 3，f = q · z = −12。

反向，從 f 開始（∂f/∂f = 1）：

- mul 閘門：∂f/∂z = q = 3，∂f/∂q = z = −4。
- add 閘門：本地梯度都是 1，所以 ∂f/∂x = ∂f/∂y = −4 × 1 = −4。

這就是整套方法的核心式：

$$
\text{downstream gradient} = \underbrace{\frac{\partial L}{\partial \text{output}}}_{\text{upstream}} \times \underbrace{\frac{\partial\,\text{output}}{\partial\,\text{input}}}_{\text{local}}
$$

</details>

<details>
<summary>sigmoid：同一個函式可以畫成不同的圖</summary>

投影片的第二個例子是一個 sigmoid 神經元，先把它拆成一個個細碎節點，逐一乘上本地梯度往回算，再指出**計算圖的畫法不唯一**，應該選本地梯度好寫的那種。把整個 sigmoid 當成一個節點，它的本地梯度是：

$$
\frac{d\sigma(x)}{dx} = (1-\sigma(x))\,\sigma(x)
$$

section 2 把這叫做 sigmoid trick：本地梯度只用到前向時已經算好、存起來的輸出值。

</details>

<details>
<summary>實作：forward / backward API</summary>

投影片先給「平鋪」寫法（前向一行一行算，反向倒過來一行一行算），再給模組化寫法：每個閘門是一個物件，有 `forward()` 和 `backward()` 兩個方法，`forward` 要把 `backward` 需要的值快取起來。投影片接著貼了 PyTorch sigmoid 層的原始碼，說明真實框架就是這個結構。

總結頁的最後三條就是這個 API 的規格：

- 實作要維護一個圖結構，節點實作 forward()／backward()。
- forward：算出運算結果，並把算梯度需要的中間值存在記憶體裡。
- backward：用連鎖律算出 loss 對輸入的梯度。

</details>

<details>
<summary>向量與矩陣：梯度永遠和變數同形狀</summary>

投影片先分三種導數：

| 映射 | 導數是 | 意思 |
|---|---|---|
| 純量 → 純量 | 一般導數 | x 變一點，y 變多少 |
| 向量 → 純量 | 梯度 | x 的每個元素變一點，y 變多少 |
| 向量 → 向量 | Jacobian | x 的每個元素變一點，y 的每個元素各變多少 |

loss 永遠是純量，所以**dL/dx 永遠和 x 同形狀**。section 2 把這當成「形狀規則」，建議拿來檢查自己的推導。

投影片用逐元素 ReLU 示範：它的 Jacobian 除了對角線全是 0，所以永遠不要真的建出 Jacobian，改用隱式的乘法（直接把上游梯度中輸入 ≤ 0 的位置歸零）。

矩陣乘法 y = xw 更極端。投影片舉 N = 64、D = M = 4,096，每個 Jacobian 約要 256 GB 記憶體。逐元素推理之後得到：

$$
\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y}\, w^{\top} \qquad \frac{\partial L}{\partial w} = x^{\top} \frac{\partial L}{\partial y}
$$

投影片的記法是：**這是唯一能讓形狀對得上的寫法**。完整的逐元素推導在官方講義 [linear-backprop.pdf](https://cs231n.stanford.edu/handouts/linear-backprop.pdf)（Justin Johnson，7 頁），它用 N = 2、D = 2、M = 3 的小例子把每一項展開。

</details>

<details>
<summary>section 2 的五步例題：一個真的二元分類網路</summary>

[section 2 投影片](https://cs231n.stanford.edu/slides/2026/section_2_backprop.pdf)（Favour Nerrise，Spring 2026，22 頁）把上面的東西套到一個完整網路：

$$
f_\theta(x) = \sigma\big(\max(0, x w_1)\, w_2 + b\big), \quad w_1 \in \mathbb{R}^{2\times 3},\ w_2 \in \mathbb{R}^{3\times 1},\ b \in \mathbb{R}
$$

資料 X ∈ ℝ^{N×2}，標籤 y ∈ {0, 1}，loss 是 binary cross-entropy。計算圖是 X → ×w₁ → ReLU → ×w₂ → +b → σ → BCE。反向傳播從右往左分五步：

1. **BCE 節點**：它是根節點，上游梯度是 1，直接對 y_pred 求導。
2. **sigmoid 節點**：本地梯度 y_pred(1 − y_pred)，用前向存下來的值。
3. **線性層 z = h w₂ + b**：∂ℓ/∂w₂ = hᵀ ∂ℓ/∂z；b 在 batch 上被廣播，所以 ∂ℓ/∂b 是 ∂ℓ/∂z 沿 batch 加總；往前傳 ∂ℓ/∂h = ∂ℓ/∂z · w₂ᵀ。
4. **ReLU 節點**：max 閘門，上游梯度乘上 1[Xw₁ > 0]。
5. **線性層 Xw₁**：和第 3 步同一個模式，∂ℓ/∂w₁ = Xᵀ ∂ℓ/∂(Xw₁)。

每一步都附了形狀檢查，例如 ∂ℓ/∂w₂ 是 ℝ^{3×1} = ℝ^{3×N} · ℝ^{N×1}。最後一行就是 L3 的梯度下降：θ ← θ − α∇θℓ。附錄另外推了批次線性層 Y = XW 的逐元素梯度。

</details>

## 連回模型：Colab 把五步例題跑起來

section 2 配的 [Backprop Colab](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/backprop.ipynb) 開頭寫明由 Favour Nerrise 為 Spring 2026 改版，並固定 Python 3.11.13 以配合作業。它做的事和五步例題完全對應：

1. 用 `sklearn.datasets.make_circles` 產生 1,000 個點的同心圓資料，內圈是類別 1、外圈是類別 0，線性分不開。
2. 定義 `relu`、`sigmoid`，以及一個有 `forward()`、`backward()` 的 `MLPClassifier`（隱藏層 3 個神經元）。
3. 跑前向、算 BCE、反向、更新的訓練迴圈，畫 loss 曲線與準確率。
4. **gradient check**：用中央差分 (f(x+h) − f(x−h)) / 2h 驗證 `backward()`，呼應 L3 的「解析梯度訓練、數值梯度檢查」。
5. 從幾何角度解讀學到的權重：w₁ 的每個欄向量透過 ReLU 定義一個半平面，三個隱藏神經元合起來把輸入空間切成幾個區域。
6. **練習**：`MLPClassifierExercise` 的 `backward()` 留了空格，要你照 Step 1–5 自己填，再用 gradient check 驗證。

這份 Colab 是進 [A1](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet) 前最好的暖身。A1 的 Q3 要你在 `cs231n/layers.py` 寫 affine 與 ReLU 的 forward／backward，再組成兩層網路；Q5 把它推廣到任意層數。寫法就是這一講的 forward／backward API，每個函式回傳一個 cache 給 backward 用。

L4 的最後一頁寫著「Next Time: Convolutional Neural Networks!」。全連接網路把 32×32×3 的圖片攤平成 3,072 維向量，丟掉了空間結構；[L5](/posts/ai/2026-09-30-cs231n-cnn-image-classification) 要把它找回來。

### 投影片、筆記、講義各自適合什麼

| 材料 | 內容 | 適合 |
|---|---|---|
| [lecture_4.pdf](https://cs231n.stanford.edu/slides/2026/lecture_4.pdf) | MLP、計算圖、四種閘門、向量與矩陣 backprop | 第一次建立全貌 |
| [筆記 optimization-2](https://cs231n.github.io/optimization-2/) | 純量例子、連鎖律、sigmoid 模組化、「staged computation」、backward flow 的模式、向量化運算的梯度 | 想要文字版逐步解釋；筆記特別強調把函式拆成容易求本地梯度的模組，並快取前向的中間變數 |
| [derivatives.pdf](https://cs231n.stanford.edu/handouts/derivatives.pdf) | Justin Johnson 的 4 頁講義：純量、梯度、Jacobian 到張量的導數與向量化 | 對「向量對矩陣求導」沒把握 |
| [linear-backprop.pdf](https://cs231n.stanford.edu/handouts/linear-backprop.pdf) | 線性層 minibatch backprop 的逐元素推導 | 想確認 xᵀ 和 wᵀ 為什麼放在那裡 |
| [section_2_backprop.pdf](https://cs231n.stanford.edu/slides/2026/section_2_backprop.pdf) + [Colab](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/backprop.ipynb) | 五步例題與可執行程式 | 動手驗證 |

## 想深入

課表在 L4 列了建議閱讀：

- [LeCun et al., Efficient BackProp](https://cs231n.stanford.edu/papers/lecun-98b.pdf)，課表放在 cs231n.stanford.edu 上的 PDF。
- [colah：Calculus on Computational Graphs: Backpropagation](http://colah.github.io/posts/2015-08-Backprop/)
- [Nielsen, Neural Networks and Deep Learning 第 2 章](http://neuralnetworksanddeeplearning.com/chap2.html)
- [Why Momentum Really Works](https://distill.pub/2017/momentum/)（跟 L3 的最佳化器比較相關）

站內用不同角度講同一件事的文章：

- [CMU 11-785 第 5 講：反向傳播](/posts/ai/2026-08-22-cmu-11785-05-backpropagation)
- [CS224N：反向傳播與神經網路](/posts/ai/2026-08-22-cs224n-backprop-neural-nets)
- [MIT 6.7960 導讀](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)
- 微積分與機率先修：[Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)、[Stanford CS109 導讀](/posts/learning/2026-08-21-stanford-cs109-probability)

## 自學怎麼做

1. 看 [2025 第 4 講錄影](https://www.youtube.com/watch?v=25zD5qJHYsk)，對照 [2026 課表連結的投影片](https://cs231n.stanford.edu/slides/2026/lecture_4.pdf)。
2. 讀 [section 2 投影片](https://cs231n.stanford.edu/slides/2026/section_2_backprop.pdf)，每一步先自己寫出形狀再往下看。
3. 打開 [Backprop Colab](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/backprop.ipynb)，先跑完示範，再做最後的 `MLPClassifierExercise`，用 gradient check 確認。
4. 卡在矩陣求導時，回去讀 [linear-backprop.pdf](https://cs231n.stanford.edu/handouts/linear-backprop.pdf) 的 2×2×3 小例子。

今晚可以做的一件事：在紙上畫出 f(x, y, z) = (x + y) · z 的計算圖，代入 x = −2、y = 5、z = −4，只用「add 分配、mul 交換」兩條規則寫出三個梯度，再用 numpy 的數值梯度核對。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方來源只有 Spring 2025 版錄影，狀態改為僅附相關補充影片，影片標題改用原標題。
- 2026-10-10：依字幕核對影片內容。影片主題與講次相符，抽樣核對的概念都在字幕出現；文章對影片沒有具體說法，只加標記。

## 參考資料

- [CS231N 課程首頁（Spring 2026）](https://cs231n.stanford.edu/) — 講者、評分、錄影僅限 Canvas 的說明
- [CS231N Spring 2026 課表](https://cs231n.stanford.edu/schedule.html) — L4 主題、筆記與講義連結、建議閱讀、4/10 Backprop Review Session
- [Lecture 4 投影片：Neural Networks and Backpropagation（2026 課表連結版）](https://cs231n.stanford.edu/slides/2026/lecture_4.pdf) — MLP、計算圖、閘門模式、矩陣 backprop、256 GB 的例子
- [Section 2 投影片：An Exercise in Backpropagation（Spring 2026）](https://cs231n.stanford.edu/slides/2026/section_2_backprop.pdf) — 五步例題與形狀規則
- [CS231N Backpropagation Review Colab](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/backprop.ipynb) — 同心圓資料、MLPClassifier、gradient check、練習
- [Justin Johnson, Derivatives, Backpropagation, and Vectorization](https://cs231n.stanford.edu/handouts/derivatives.pdf)
- [Justin Johnson, Backpropagation for a Linear Layer](https://cs231n.stanford.edu/handouts/linear-backprop.pdf)
- [CS231N 課程筆記：Backpropagation, Intuitions](https://cs231n.github.io/optimization-2/)
- [Stanford CS231N Spring 2025 Lecture 4 錄影](https://www.youtube.com/watch?v=25zD5qJHYsk)
- [Assignment 1（2026）](https://cs231n.github.io/assignments2026/assignment1/) — Q3 兩層網路、Q5 全連接網路
- [Xie et al., Exploring Randomly Wired Neural Networks for Image Recognition (ICCV 2019)](https://arxiv.org/abs/1904.01569)
- [LeCun et al., Efficient BackProp](https://cs231n.stanford.edu/papers/lecun-98b.pdf)

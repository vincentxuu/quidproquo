---
title: "CS189 Spring 2026 Lec 19–20：初始化、BatchNorm、CNN、early stopping 與 double descent"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, course-guide, neural-networks, cnn, batch-norm, deep-learning]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS189 導讀"
  order: 13
tldr: "Lec 19 先收尾反向傳播，接著處理「怎麼讓梯度一直流得動」：全零初始化會讓所有單元學成一樣，要用小的隨機值（ReLU 用 He 初始化）；batch norm 用 mini-batch 的平均與變異數正規化 pre-activation。後半進入 CNN：局部連接加權重共享，讓同一個特徵偵測器掃過整張圖。Lec 20 補完 pooling、receptive field 與 CNN 的訓練，再談 early stopping、dropout，以及和傳統 bias-variance 圖不一樣的 double descent。"
description: "Berkeley CS189 Spring 2026（Listgarten／Dimakis）第 19–20 講導讀：自動微分、初始化與對稱性、batch normalization 的訓練與推論、輸入正規化、卷積的權重共享與輸出尺寸、pooling、receptive field、CNN 的反向傳播、遷移學習、early stopping、dropout、double descent，以及 Discussion 9 的計算圖與卷積練習。"
draft: false
glossary:
  - term: "batch normalization"
    aliases: ["BatchNorm", "BN", "批次正規化"]
    definition: "訓練時用 mini-batch 內的平均與變異數，把某一層的 pre-activation 正規化；推論時改用訓練過程累積的指數移動平均。"
    context: "Lec 19 把它當成「讓非線性的輸入保持在有梯度的區域」的方法。"
  - term: "double descent"
    aliases: ["雙下降"]
    definition: "模型複雜度超過某個門檻、進入過參數化區域後，測試誤差在上升之後又再次下降的現象。"
    context: "Lec 20 用它對照前半學期的 bias-variance tradeoff，並引用 Nakkiran 等人（ICLR 2020）的實驗。"
---

> 🌏 [English version](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-19-20-cnn-generalization-en)

本文依 [CS189 Spring 2026](https://eecs189.org/sp26/)（Jennifer Listgarten／Alex Dimakis）的官方教材寫成：第 19 講的 [lec19.pdf](https://drive.google.com/drive/folders/12L6CYQ-h128-bzFPU1RvX1aJnFvWQ6Hi)（4/2，[錄影](https://www.youtube.com/watch?v=-4PpBUsB_S4)）、第 20 講的 [lec20.pdf](https://drive.google.com/drive/folders/1Ocw82WCz2SiUEDY9uofdfyZuPX4GrfOw)（4/7，[錄影](https://www.youtube.com/watch?v=4LrCyN7URuY)），以及 [Discussion 9](https://drive.google.com/file/d/1Aa40Z2Ufa91YBNAlhfwsHG2JCT23T2SA/view)（附[解答](https://drive.google.com/file/d/16n2T86Vx2bneCubkQ7b52MV8c8wwFUyF/view)與 [walkthrough 影片](https://www.youtube.com/playlist?list=PL-ysCubq-Sa8dQDvhNbABwFT3JWWBTRAW)）。以上都能匿名取得，整門課判 A3（定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）。

[上一篇 Lec 17–18](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-17-18-neural-networks-backprop) 回答了「梯度怎麼算」。這兩講接著問兩件事：梯度算得出來之後，怎麼讓它在訓練中**一直流得動**？以及，全連接層之外，有沒有更適合影像的架構？最後 Lec 20 回到前半學期的老問題：模型要多複雜才對？

官方指定閱讀（Bishop《[Deep Learning: Foundations and Concepts](https://www.bishopbook.com/)》）：

| 講次 | 章節 |
|---|---|
| Lec 19 | 7.2.5 NN 初始化；7.4 到 7.4.2（資料正規化、batch norm）；第 10 章到 10.2.8，以及 10.3.2（CNN） |
| Lec 20 | 9.1.2 no free lunch；9.3.1 early stopping；9.3.2 double descent |

## 課程影片來源

影片連結對應本文教材；此處不提供未核對的時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=-4PpBUsB_S4
title: Lecture 19 錄影
```

```youtube
url: https://www.youtube.com/watch?v=4LrCyN7URuY
title: Lecture 20 錄影
```

原始影片：[Lecture 19 錄影](https://www.youtube.com/watch?v=-4PpBUsB_S4)、[Lecture 20 錄影](https://www.youtube.com/watch?v=4LrCyN7URuY)

課程與錄影入口：

- [官方課程與錄影入口](https://eecs189.org/sp26/)

## Lec 19 前段：收尾反向傳播

Lec 19 開頭把 Lec 18 的成本比較再講一次：有限差分每一步要 O(NL²)，和參數量 L 成平方；符號微分會出現「expression swell」（Bishop 8.1.4）。接著講從反向傳播到自動微分的轉變：

| 以前 | 現在（autodiff） |
|---|---|
| 手畫計算圖 | 框架自己建圖 |
| 手寫 forward | 你只寫 forward |
| 手推局部導數、手寫成程式 | 框架算出所有需要的導數 |
| 用有限差分檢查 | 框架直接跑反向傳播 |

講義也補了一個實作細節：ReLU 在 0 不可微，反向傳播時用 subgradient，x < 0 取 0，x ≥ 0 取 1。

## 讓梯度流得動：初始化

講義的推理很短：神經網路的損失曲面高度非凸，起點不同，可能得到品質不同的解，或收斂很慢。什麼是好起點？**想想梯度。** 激活函數的梯度通常在 0 附近最大，那把權重全設成 0 好嗎？

不好。權重全為 0 時，每個參數拿到的梯度都一樣，同一層的單元永遠學成同一個樣子。講義的做法是：

- 在 0 附近**隨機**初始化，`w ~ N(0, ε⁽ˡ⁾)`；
- ReLU 用「He」初始化，變異數取 `2 / n_inputs`；
- 也可以試好幾組初始化，挑最好的網路，或把結果平均。

## 讓梯度流得動：batch normalization

初始化只能照顧起點。講義說：「一旦開始學習，就什麼都說不準了。」所以要在訓練過程中持續控制非線性的輸入，讓它留在有梯度的區域，這就是 batch normalization。

- **訓練時**：對第 l 層第 m 個 pre-activation，用這個 mini-batch 的 K 筆資料算平均 μ 和變異數 σ²，再做 `(a − μ) / √(σ² + δ)`。這些都是可微的運算，照常反向傳播。
- **推論時**：理想上要用整份訓練資料的 μ 和 σ²，但計算太貴。實務上是在訓練中，對各個 batch 的值算指數衰減的移動平均。

講義順帶提到**輸入正規化**：輸入特徵的尺度可能差很多（講義舉身高用公尺、小指寬度用公釐），這會讓梯度下降在某些方向走得快、某些方向走得慢。連續變數通常正規化成平均 0、變異數 1，而且驗證和測試資料必須套用**完全相同**的轉換。

## CNN：從全連接到局部、共享

講義從全連接層的兩個問題切入：

1. **參數量**：第 l 層有 n_i 個輸入、n_o 個輸出，就是 n_i × n_o 個參數，疊幾層就爆了。
2. **特徵無法重用**：每個影像區域都有自己的權重，等於「整張模板比對」。講義用 MNIST 單層分類器為例：每個類別一個 W 矩陣，也就是一張模板，並展示訓練第 1、2、3、7 輪時模板的樣子。

比較好的做法是把數字拆成小零件，再組合起來判斷，也就是用階層式的「局部特徵偵測器」取代整張模板。CNN 靠兩個設計做到這件事：

```mermaid
flowchart LR
  A["全連接<br/>每個位置各自一組權重"] -->|"局部連接"| B["每個隱藏單元<br/>只看一小塊輸入"]
  B -->|"權重共享"| C["同一個 filter<br/>掃過所有位置"]
  C --> D["輸出 feature map<br/>filter 數 = 輸出深度"]
  D -->|"疊很多層"| E["階層式零件分解"]
```

### 卷積的計算

- **stride**：掃描時每次移動的格數；stride = 1 不跳格。
- **手算例子**：講義用一張 0/1 小圖，分別套水平線偵測器和垂直線偵測器，逐格算出 feature map。
- **1D 卷積寫成矩陣**：講義指出矩陣 W_k 有 5×3 = 15 個元素，但只有 3 個參數。這就是 CNN 參數少的原因。講義也提醒，數學定義上要先把 filter 翻轉，再做逐元素相乘。
- **filter 的直覺**：模糊、方向邊緣、銳化都能寫成 3×3 kernel；但在神經網路裡，這些值是用反向傳播從資料學出來的。
- **輸出尺寸**：D×D 的影像、K×K 的 filter、stride 1、不補零，每個 filter 的輸出是 (D−K+1)×(D−K+1)；一層 F 個 filter 的計算量是 F·K²·(D−K+1)²。
- **多通道**：J×K、深度 C 的影像，每個 kernel 是 M×M×C。講義的觀察是：一路往上，空間尺寸變小，深度通常變大。
- **padding**：想讓輸出維持原尺寸，就在周圍補零。

### Pooling、receptive field 與整體架構

Pooling 層把 feature map 縮小，同時對小幅度的平移建立不變性。講義舉人臉偵測為例：臉不一定剛好在正中間。常見的是 2×2 max pooling；Lec 20 補充 average pooling 也可以用，但比較少見，並反問跟 max 比會失去什麼。

典型的 CNN 是「(卷積 + ReLU) + pooling」重複疊幾次，最後接幾層（例如 2 層）全連接，再送進 softmax 分類器或回歸頭。Lec 20 把分工講得很清楚：卷積層做特徵偵測，pooling 層降維並提供局部不變性，全連接層負責最後的預測。

因為 pooling（以及不同的 stride 或 filter 大小），高層神經元的 **receptive field** 比低層大，即使 filter 尺寸一樣。

### CNN 怎麼訓練

損失用最大似然（cross-entropy），訓練仍是反向傳播加梯度下降，但有兩個地方不同：

1. **權重共享**：同一個 filter 用在所有位置，所以它的梯度要把所有位置的貢獻**加總**。這就是 Lec 18「多條路徑相加」的直接應用。
2. **Max pooling**：梯度只回傳給贏得 max 的那個神經元。嚴格說這是 subgradient，贏家取 1，其他取 0。

架構要怎麼選？Lec 19 說照整門課的做法用交叉驗證；Lec 20 修正成用 hold-out validation，因為交叉驗證太貴。講義以 2014 年的 VGG(-Face) 為例，提到 ResNet 這類創新「有時會改變遊戲規則」（[HW4 導讀](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw4-resnet-transformer-dnabert)會實作 ResNet-18）。另一個常見做法是**遷移學習**：拿別人在大資料上訓練好的架構，凍結特徵擷取層，只重新訓練最上面做分類或回歸的幾層。

## Lec 20 後段：什麼時候該停

### Early stopping 與 dropout

訓練時常畫 learning curve，同時追蹤訓練誤差和驗證誤差。**early stopping** 的做法是：驗證誤差不再下降時就停下來，回到那個 checkpoint。講義引用 Bishop 9.3.1 的圖說明它也是一種正則化：模型通常從很小的權重出發，提早停止就像做了 weight decay（講義註明 weight decay 就是神經網路圈對正則化的常用說法）。

**Dropout** 則是在每一次 SGD 迭代中隨機「關掉」一些神經元：對每個激活值抽 `r ~ Bernoulli(1−ρ)` 再相乘，ρ 通常 ≤ 0.5；測試時用上所有激活值，乘上 1−ρ 做縮放。

### Double descent

講義先回顧前半學期的 bias-variance 圖：測試誤差隨模型複雜度先降後升，中間有一個最佳點。接著說，對用 SGD 訓練的大型神經網路，過了某個點之後測試誤差會**再下降一次**。講義的描述是：

- 圖分成欠參數化與過參數化兩個區域；
- 非常複雜的模型似乎會自我正則化，講義推測「可能是 SGD 的緣故」；
- 模型夠大時，early stopping 反而**可能**讓泛化變差；
- 最大的模型拿到最低的測試誤差。

講義引用 Nakkiran 等人（ICLR 2020）的 [Deep Double Descent](https://arxiv.org/abs/1912.02292) 當例子，並在投影片上加註：這一張不在考試範圍，因為圖很容易混淆，而且圖中其實同時有 epoch-wise double descent（沿訓練輪數）和 model-complexity double descent（沿模型大小）兩種。讀的時候要分清楚是哪一種。

指定閱讀裡的 no free lunch（Bishop 9.1.2），在 Lec 20 講義的文字裡沒有獨立一節，只列在閱讀清單；想了解就直接讀 Bishop。

## Discussion 9：兩題手算，剛好是 HW3 的測試案例

Discussion 9 兩題都沿用 Fall 2025 的 discussion（講義標注 F25 Dis8 Q1、F25 Dis9 Q1）：

1. **分段計算的反向傳播**：`f(x, y, z) = (x + y)z`。先拆成 `g = x + y`、`f = g·z`，畫計算圖、寫出 forward 與 backward 的步驟，再代入 x = −2、y = 5、z = −4 標出每個中間值。解答把反向傳播描述成節點之間用梯度訊號做的 message passing。這張圖很適合拿來當 [HW3](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw3-autograd-optimizers) BearTensor 的第一個測試。
2. **卷積運算**：9 維輸入配 3 個權重的 1D filter，分別問不補零 stride 1、補零 1 stride 2 的輸出維度與元素；把卷積寫成矩陣 `x' = Kx`，求 K 的形狀；對一張 3×3 圖算 2×2 kernel 的輸出並說明它的效果；最後推出一般的輸出尺寸公式。解答給的公式是 `⌊(W + 2p − K) / s⌋ + 1`。

## 延伸與導覽

- Fall 2026 對應講次：[CS189 Fall 2026](https://eecs189.org/fa26/) 的 Lec 14（Batch Normalization、Initialization、Regularization）以及 Lec 16–17（CNN）。
- 站內延伸（只是延伸，不取代本課內容）：[CMU 11-785 第 8 講：optimizer 與正則化](/posts/ai/2026-08-22-cmu-11785-08-optimizers-regularization)、[CMU 11-785 第 9 講：CNN（一）](/posts/ai/2026-08-22-cmu-11785-09-cnn-one)、[CMU 11-785 第 10 講：CNN（二）](/posts/ai/2026-08-22-cmu-11785-10-cnn-two)。
- 系列導覽：上一篇 [HW3 導讀](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw3-autograd-optimizers)；下一篇 [Lec 21–22：Transformers](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-21-22-transformers)；系列入口 [CS189 總覽](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview)。

**今晚能做的事**：照 Discussion 9 第 2 題，用 NumPy 寫一個 1D 卷積，再把它改寫成 7×9 的矩陣乘法，確認兩者輸出一樣。做完你會直接看懂「15 個元素、只有 3 個參數」是什麼意思。

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS189 Spring 2026 課程首頁與排程](https://eecs189.org/sp26/)
- [Lecture 19 講義資料夾：lec19.pdf](https://drive.google.com/drive/folders/12L6CYQ-h128-bzFPU1RvX1aJnFvWQ6Hi)
- [Lecture 19 錄影](https://www.youtube.com/watch?v=-4PpBUsB_S4)
- [Lecture 20 講義資料夾：lec20.pdf](https://drive.google.com/drive/folders/1Ocw82WCz2SiUEDY9uofdfyZuPX4GrfOw)
- [Lecture 20 錄影](https://www.youtube.com/watch?v=4LrCyN7URuY)
- [Discussion 9 題目](https://drive.google.com/file/d/1Aa40Z2Ufa91YBNAlhfwsHG2JCT23T2SA/view)、[解答](https://drive.google.com/file/d/16n2T86Vx2bneCubkQ7b52MV8c8wwFUyF/view)、[Walkthrough](https://www.youtube.com/playlist?list=PL-ysCubq-Sa8dQDvhNbABwFT3JWWBTRAW)
- [CS189 Spring 2026 講課播放清單](https://www.youtube.com/playlist?list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE)
- [Bishop & Bishop, Deep Learning: Foundations and Concepts](https://www.bishopbook.com/)
- [Nakkiran et al., Deep Double Descent (arXiv:1912.02292)](https://arxiv.org/abs/1912.02292)
- [CS189 Fall 2026 排程](https://eecs189.org/fa26/)

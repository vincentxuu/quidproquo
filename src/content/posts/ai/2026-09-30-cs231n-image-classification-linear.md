---
title: "CS231N L2：影像分類、kNN 與線性分類器"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, deep-learning, image-classification]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 2
tldr: "L2 從一個問題出發：電腦看到的是一堆 0 到 255 的數字，要怎麼認出貓？寫規則行不通，所以改用 data-driven 方法：收集資料、訓練、在新圖上評估。第一個分類器是 kNN，它教會你 train/val/test 怎麼切，但像素距離沒有語意。第二個是線性分類器 f(x,W)=Wx+b，可以從代數、視覺（模板）、幾何（超平面）三個角度看，再用 softmax 把分數變成機率，用 −log 機率當 loss。"
description: "Stanford CS231N（Spring 2026）第二講導讀：依 lecture_2.pdf、官方筆記 classification 與 linear-classify，整理影像分類的 semantic gap 與六種挑戰、data-driven 方法、kNN 的距離與超參數選法、線性分類器的代數／視覺／幾何三種看法，以及 softmax loss 的計算；錄影可參考 Spring 2025 YouTube 的 Lecture 2。"
draft: false
glossary:
  - term: "semantic gap"
    aliases: ["語意鴻溝"]
    definition: "人看到的「一隻貓」和電腦看到的像素數值陣列之間的落差。"
    context: "CS231N L2 用它說明為什麼影像分類不能靠手寫規則。"
  - term: "hyperparameter"
    aliases: ["超參數"]
    definition: "關於演算法本身的選擇，例如 kNN 的 k 與距離函數；不從訓練資料直接學到，要用驗證集挑。"
    context: "L2 用 kNN 示範四種選超參數的做法，只有用驗證集或交叉驗證是對的。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-image-classification-linear-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

> **來源年份**：投影片依據 Spring 2026；錄影可參考 [Spring 2025 Lecture 2](https://www.youtube.com/watch?v=pdqofxJeBN8)（YouTube）。兩者可能有差異，本文內容以 2026 投影片為準，引用官方筆記的地方會另外標出。本文是 [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)系列的第 2 篇。

[CS231N](https://cs231n.stanford.edu/) 的第二講在 4 月 2 日，也是 A1 發佈的那一天。[課表](https://cs231n.stanford.edu/schedule.html)列出的主題是：data-driven 方法、k-nearest neighbor、線性分類器的代數／視覺／幾何三種看法、softmax loss。對應的官方筆記是 [Image Classification](https://cs231n.github.io/classification/) 與 [Linear Classification](https://cs231n.github.io/linear-classify/)。

這一講介紹兩個最簡單的分類器。它們在實務上都不夠用，但後面每一講都建立在它們留下的框架上：資料怎麼切、分數怎麼算、loss 怎麼定。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=pdqofxJeBN8
title: Spring 2025 Lecture 2: Image Classification with Linear Classifiers（YouTube）
```

原始影片：[Spring 2025 Lecture 2: Image Classification with Linear Classifiers（YouTube）](https://www.youtube.com/watch?v=pdqofxJeBN8)

課程與錄影入口：

- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 問題：電腦看到的只是數字

[投影片](https://cs231n.stanford.edu/slides/2026/lecture_2.pdf)先定義任務：給一張圖和一組可能的標籤（dog、cat、truck、plane…），輸出其中一個。

難處在投影片叫做 **semantic gap** 的地方。你看到一隻貓；電腦看到的是一個三通道（RGB）的數字陣列，每個值在 0 到 255 之間。接著投影片列出一串讓這個問題變難的情況：

- **視角變化**：相機一動，所有像素都變了
- **光照**
- **背景雜亂**
- **遮擋**
- **形變**：貓可以擺出各種姿勢
- **類內差異**：同一類的貓長得很不一樣
- **情境**：周圍的東西會誤導判斷

所以不像排序數字，辨識貓沒有一個明顯能寫死的演算法。投影片提到過去有人試過先找邊緣、再找角點，用規則拼出貓（引用 Canny 1986 的邊緣偵測），但這條路擴展不到其他類別。

## data-driven 方法：三個步驟

投影片給的替代方案是機器學習的 **data-driven approach**：

1. 收集一組影像與標籤
2. 用機器學習演算法訓練分類器
3. 在新影像上評估分類器

官方筆記把它寫成一個有 `train` 和 `predict` 兩個方法的類別：前者吃訓練影像與標籤，後者對新影像輸出預測。L2 的兩個分類器都可以套進這個介面。

## 第一個分類器：Nearest Neighbor 與 kNN

**Nearest Neighbor** 的做法最直接：訓練時把所有資料和標籤背下來；預測時找出最像的那張訓練圖，抄它的標籤。

「最像」要靠距離函數定義。投影片先用 **L1 距離**：兩張圖逐像素相減取絕對值，全部加起來。

投影片接著問：N 筆資料時，訓練和預測各要多久？答案是訓練 O(1)、預測 O(N)。投影片直接說這樣不好，我們要的是預測快、訓練慢一點沒關係。快速或近似最近鄰搜尋不在 CS231N 範圍內，投影片推薦了 [Faiss](https://github.com/facebookresearch/faiss)。

**kNN** 把「抄最近那一張」改成「看最近 K 張，多數決」。K=1 時決策邊界會被離群點切得很碎，K 變大邊界就平滑一些。距離也可以換成 **L2（歐氏）距離**。投影片附了官方的[互動 demo](http://vision.stanford.edu/teaching/cs231n-demos/knn/)，可以自己調 K 和距離看邊界怎麼變。

官方筆記補了一組數字：在 CIFAR-10 上，用 L1 距離的最近鄰分類器準確率是 38.6%，換成 L2 是 35.4%。隨機猜是 10%，筆記估計人類約 94%。

## 超參數：四種選法，只有兩種對

K 要取多少、距離用 L1 還是 L2，這些都是 **hyperparameter**：關於演算法本身的選擇，而且很依賴資料集。投影片逐一檢查四種選法：

| 做法 | 問題 |
|---|---|
| 1. 挑在訓練資料上表現最好的 | K=1 在訓練資料上永遠完美 |
| 2. 挑在測試資料上表現最好的 | 不知道演算法在新資料上會怎樣，投影片寫「Never do this!」 |
| 3. 切出 train / validation / test，在 validation 上挑，最後才跑 test | 較好 |
| 4. 交叉驗證：把訓練資料分成幾份，輪流當驗證集取平均 | 適合小資料集，但深度學習裡不常用 |

投影片用 CIFAR-10（10 類、50,000 張訓練圖、10,000 張測試圖）示範 5-fold 交叉驗證，對這組資料 k 約 7 表現最好。

這一段是整門課最常被重複用到的規則：**測試集只在最後跑一次。**

投影片的結論很直接：「k-Nearest Neighbor with pixel distance is never used」。原因是像素距離沒有語意。投影片放了一組圖：原圖旁邊是遮住一塊、平移一個像素、整體染色的三個版本，三者跟原圖的像素距離一樣，但人看起來差異完全不同。

## 第二個分類器：線性分類器

線性分類器換成 **參數化方法**：不再背下整個訓練集，而是學一組權重 W，把影像映射成每一類的分數。

以 CIFAR-10 為例，一張 32×32×3 的圖攤平成 3,072 個數字：

```text
f(x, W) = W x + b
x: 3072 × 1    W: 10 × 3072    b: 10 × 1    f: 10 × 1（10 類的分數）
```

投影片把線性分類器放在神經網路的脈絡裡：AlexNet、ResNet 這些網路裡都有線性層。

課表寫的「三種看法」就在這裡：

- **代數看法**：用一張 4 個像素、3 類（cat/dog/ship）的小圖，把像素攤成向量、乘上 W、加上 b，直接算出三個分數。投影片的例子裡 cat 分數是 −96.8、dog 437.9、ship 61.95
- **視覺看法**：W 的每一列可以還原成一張圖，看起來像那一類的「模板」。官方筆記指出，CIFAR-10 上學到的 horse 模板像一匹雙頭馬，因為資料裡有朝左和朝右的馬，線性分類器只能把兩種合成一張；car 模板是紅色的，暗示資料裡紅色車最多
- **幾何看法**：每張圖是 3,072 維空間裡的一個點，每一類的分數是這個空間上的線性函數，分類邊界是超平面

幾何看法馬上帶出限制。投影片列了三種線性分類器處理不了的情況：一、三象限對上二、四象限（類似 XOR）；L2 範數在 1 到 2 之間的環狀區域；以及一類有三個分散的群。這些限制就是 L4 要引入神經網路的理由。

## 怎麼挑一個好的 W：loss function

有了分數，還要知道 W 好不好。投影片把接下來的工作拆成兩步：

1. 定義 **loss function**，量化分數在訓練資料上「多讓人不滿意」
2. 找出能讓 loss 最小的參數，也就是最佳化（L3 的主題）

整個資料集的 loss 是每筆資料 loss 的平均。

## Softmax：把分數變成機率

2026 投影片只講一種 loss：**softmax classifier**（又叫 multinomial logistic regression）。目標是把原始分數解讀成機率。

投影片用一個三類的例子一步步算：

| 類別 | 分數（logits） | exp 之後 | 正規化後的機率 |
|---|---|---|---|
| cat（正確答案） | 3.2 | 24.5 | 0.13 |
| car | 5.1 | 164.0 | 0.87 |
| frog | −1.7 | 0.18 | 0.00 |

exp 保證機率非負，除以總和保證加起來是 1。這筆資料的 loss 是正確類別機率取負 log：Li = −log(0.13) ≈ 2.04。投影片指出這等於最大概似估計，細節留給 CS229。

<details>
<summary>公式與兩個檢查題</summary>

對第 i 筆資料，分數向量 s = f(xᵢ, W)，正確類別 yᵢ：

```text
P(Y = k | X = xᵢ) = exp(s_k) / Σⱼ exp(s_j)
Lᵢ = −log P(Y = yᵢ | X = xᵢ)
```

投影片留了兩個問題：

- **Q1：Lᵢ 的最小和最大值？** 正確類別機率趨近 1 時 loss 趨近 0，趨近 0 時 loss 趨近無限大，所以範圍是 0 到 ∞。
- **Q2：初始化時所有分數差不多，loss 是多少？** 每類機率約 1/C，loss 為 −log(1/C) = log(C)。C = 10 時約 2.3。

Q2 很實用：訓練剛開始若 loss 明顯不是 log(C)，通常代表程式有 bug。

</details>

官方筆記的 [Linear Classification](https://cs231n.github.io/linear-classify/) 除了 softmax，還有一整節 multiclass SVM（hinge）loss 與 SVM vs. Softmax 的比較，以及一個[互動 demo](https://cs231n.github.io/assets/linear-classify-demo/index.html)。2026 的 L2 投影片沒有講 SVM loss，A1 的題目也只有 Softmax 分類器；筆記那一節可以當補充讀。

## 讀完這一講，今晚可以做什麼

1. 打開[互動 kNN demo](http://vision.stanford.edu/teaching/cs231n-demos/knn/)，把 K 從 1 調到 7，看決策邊界的碎塊怎麼消失
2. 用 numpy 算一次上面那張 softmax 表：`s = np.array([3.2, 5.1, -1.7])`，自己算出 0.13 和 2.04，再試 `s = np.zeros(10)` 確認 loss 是 log(10)
3. 如果已經下載 [A1 起始碼](https://cs231n.github.io/assignments2026/assignment1/)，Q1（knn.ipynb）和 Q2（softmax.ipynb）就是這一講的內容，可以開始寫了

## 延伸閱讀

- [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：softmax 迴歸與最大概似估計的完整推導
- [Stanford CS231N 導讀：總覽與自學路線](/posts/ai/2026-09-30-cs231n-course-overview)

**系列導覽**：上一篇 [L1：電腦視覺從哪裡來，這門課要走到哪裡](/posts/ai/2026-09-30-cs231n-intro-vision-history)｜下一篇 [L3：正則化與最佳化](/posts/ai/2026-09-30-cs231n-regularization-optimization)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS231n 課表（Spring 2026）](https://cs231n.stanford.edu/schedule.html)
- [Lecture 2 投影片：Image Classification with Linear Classifiers（2026）](https://cs231n.stanford.edu/slides/2026/lecture_2.pdf)
- [CS231n 筆記：Image Classification](https://cs231n.github.io/classification/)
- [CS231n 筆記：Linear Classification](https://cs231n.github.io/linear-classify/)
- [CS231n kNN 互動 demo](http://vision.stanford.edu/teaching/cs231n-demos/knn/)
- [CS231n 線性分類互動 demo](https://cs231n.github.io/assets/linear-classify-demo/index.html)
- [Assignment 1（2026）](https://cs231n.github.io/assignments2026/assignment1/)
- [Spring 2025 Lecture 2: Image Classification with Linear Classifiers（YouTube）](https://www.youtube.com/watch?v=pdqofxJeBN8)
- [Faiss（facebookresearch/faiss）](https://github.com/facebookresearch/faiss)
- [Krizhevsky (2009). Learning Multiple Layers of Features from Tiny Images（CIFAR-10 技術報告）](https://www.cs.toronto.edu/~kriz/learning-features-2009-TR.pdf)

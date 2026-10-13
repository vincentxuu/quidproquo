---
title: "深度學習：預訓練、autoencoder 與 PCA｜台大林軒田 機器學習技法 第 13 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, deep-learning, autoencoder, pca]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 30
tldr: "網路疊深之後，每一層只要做一點事，但結構、模型複雜度、最佳化與計算量都變難。這堂課挑初始化與正則化兩件事來講：用 d—d̃—d 的 autoencoder 一層一層預訓練權重，讓每一層先學會保留資訊的編碼；在輸入加人工雜訊訓練，當成一種正則化；最後把 autoencoder 換成線性的，推出最佳的 W 就是 XᵀX 最大的 d̃ 個 eigenvector，資料先減平均就是 PCA。"
description: "台大林軒田機器學習技法第 13 堂 Deep Learning 導讀：淺層與深層網路的比較、深度學習的四個難處、逐層預訓練、autoencoder 與 denoising autoencoder，並把線性 autoencoder 的最佳解一步一步推到 PCA，附四個點的手算例子與 Python 驗算。"
draft: false
glossary:
  - term: "autoencoder"
    aliases: ["自動編碼器", "basic autoencoder"]
    definition: "d—d̃—d 的神經網路，訓練目標是讓輸出 g(x) 接近輸入 x。前半的權重把 x 編碼成 d̃ 維的表示，後半的權重再解碼回來。"
    context: "技法第 13 堂用它一層一層預訓練深度網路的權重，只留下編碼那一半。"
  - term: "預訓練"
    aliases: ["pre-training", "pretraining"]
    definition: "正式用 backprop 訓練整個網路之前，先替每一層的權重找一組比隨機值好的起始值。"
    context: "技法第 13 堂的做法是由淺到深，每一層在前一層的輸出上訓練一個 autoencoder。"
  - term: "denoising autoencoder"
    aliases: ["去雜訊自動編碼器"]
    definition: "輸入換成加了人工雜訊的 x̃、目標仍是乾淨的 x 的 autoencoder。"
    context: "技法第 13 堂把人工雜訊解讀成一種正則化，也就是給模型的提示。"
  - term: "PCA"
    aliases: ["principal component analysis", "主成分分析"]
    definition: "先把資料減去平均，再取 XᵀX 最大的 d̃ 個 eigenvalue 對應的 eigenvector 當投影方向，做線性降維。"
    context: "技法第 13 堂把它推導成權重綁定、沒有常數項的線性 autoencoder 的最佳解。"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-13-deep-learning-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [213_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/213_handout.pdf) 與四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/24 到 24/24），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的技法第 13 堂。講義第 1 頁的 Roadmap 把技法分成三種處理特徵的技巧，這堂屬於第三種 Distilling Implicit Features: Extraction Models，讓模型自己從資料裡萃取出隱藏的特徵。上一堂[技法第 12 堂：神經網路](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning)在同一頁上被收成一行：一層層的神經元自動萃取樣式特徵（pattern feature），權重用 backprop 算梯度、再做梯度下降或隨機梯度下降。這堂接著問：層數變多之後會怎樣。

這堂的錄影在 2016 年上傳，講義第 3 頁寫深度學習是「gaining attention in recent years」。所以主角是當時的做法：逐層預訓練與 autoencoder。理解當時為什麼需要預訓練，比背步驟有用；現在常見的訓練技巧，林軒田在 Fall 2024 另外補了兩份投影片，本系列放在[技法第 16 堂：Finale](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning)那一篇。

先備有三樣。第一是上一堂的網路記號（$d^{(0)}$-$d^{(1)}$-…-$d^{(L)}$、$w_{ij}^{(\ell)}$、$\tanh$）與 backprop。第二是[基石第 13 堂：過擬合](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)講的過擬合成因與[基石第 14 堂：正則化](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)的 weight decay。第三是線性代數：正交矩陣、對稱矩陣的 eigenvalue 分解。最後一節會用一次拉格朗日乘數，[技法第 2 堂：對偶 SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm)用過。

用語先說明一件事。eigenvector 的中文是「特徵向量」，feature 的中文也是「特徵」，這堂兩個都會大量出現。為了不混淆，本文的「特徵」一律指 feature，線性代數的那一組直接寫 eigenvalue、eigenvector。

讀完之後，你應該能說出深層網路比淺層網路多了什麼、難在哪四件事；能照著逐層預訓練的流程，講出每一步拿什麼資料訓練哪個 autoencoder、留下哪些權重；能解釋加雜訊為什麼算正則化；並且能從 $E_{\text{in}}(\mathrm{W}) = \frac{1}{N}\sum_n \lVert \mathbf{x}_n - \mathrm{W}\mathrm{W}^\top\mathbf{x}_n\rVert^2$ 自己推到「最佳的 $\mathrm{W}$ 是 $\mathrm{X}^\top\mathrm{X}$ 最大的幾個 eigenvector」，對一組小資料手算出來。

## 網路疊深了多了什麼、又難在哪裡

```youtube
url: https://www.youtube.com/watch?v=H1czfox0Nog
title: Deep Learning :: Deep Neural Network @ Machine Learning Techniques (機器學習技法)
```

（影片 00:17–02:27 複習上一堂並帶出結構問題，02:27–05:55 比較淺層與深層，05:55–11:42 用手寫數字說明每一層的意義，11:42–18:36 是四個難處與對應的技巧，18:36–20:53 是兩步驟的框架，之後是 Fun Time。）

### 結構要自己決定

講義第 2 頁把上一堂的網路圖再畫一次，提醒每一層都是從資料萃取出來的樣式特徵，然後問：要幾個神經元？要幾層？更一般地說，要什麼結構？課堂上補充，結構還包括哪個神經元跟哪個相連、能不能跨層連接。

講義給的答案有兩個方向：主觀上是你的設計（your design），客觀上也許可以用 validation。課堂上對這兩句各有一個說明。「你的設計」像電機系的同學設計電路：這個元件擺這裡、那個元件擺那裡，接起來看會不會動。validation 則是把結構當成一種參數，[基石第 15 堂：驗證](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)教的模型選擇方法都用得上；麻煩在可能的結構太多。講義的結論是：結構的決定是應用神經網路的關鍵問題（key issue）。

### 淺層與深層的比較

第 3 頁先定義：隱藏層少的叫淺（shallow），多的叫深（deep）。課堂上說，淺的只經過一兩層就輸出，深的要過很多個步驟才得到結果。投影片把兩者並排，後面括號裡的圈與叉是講義標的：

| | 淺層神經網路 | 深層神經網路 |
|---|---|---|
| 訓練 | 比較有效率（○） | 有挑戰（×） |
| 結構的決定 | 比較簡單（○） | 比較複雜（×） |
| 能力 | 理論上已經夠強（○） | 「任意地」強（○） |
| 意義 | 未列 | 比較「有意義」？ |

課堂上逐格解釋。淺的層數少，正向算輸出、反向算 δ 都比較快；要決定的只有那幾層各放幾個神經元。「理論上夠強」指的是上一堂提過的結果：只要神經元夠多，就能逼近任何函數，所以只用少數幾層、每層放夠多神經元，一樣做得出複雜的事。深的那一欄，前兩格就是反過來的代價。「任意地強」這一格，課堂上說它跟淺層其實差不多，神經元與權重夠多就做得到。

所以從能力來看，深層並沒有贏。深層真正的賣點是最後一格，講義自己也打了問號，接著用一整頁說明。

### 每一層做一點事：手寫數字的例子

第 4 頁的圖是一個辨識手寫數字 1 與 5 的小網路。圖的內容由下往上是：

1. 最底下是輸入，兩張用像素畫成的數字 1 與 5。
2. 第一層有六個節點 $\phi_1$ 到 $\phi_6$，每個節點畫著一小段筆畫：$\phi_1$ 是左上角的一小撇，$\phi_2$ 是中間的一豎，$\phi_3$ 是底部的一橫，$\phi_4$ 是左上的轉角，$\phi_5$ 是中段的轉折，$\phi_6$ 是右下的弧。
3. 第二層有兩個節點：$z_1$ 回答「這是 1 嗎」，$z_5$ 回答「這是 5 嗎」。藍線是正的權重，紅線是負的權重。$z_1$ 對 $\phi_1$、$\phi_2$、$\phi_3$ 是藍線，對 $\phi_4$、$\phi_5$、$\phi_6$ 是紅線；$z_5$ 對 $\phi_3$、$\phi_4$、$\phi_5$、$\phi_6$ 是藍線，對 $\phi_1$、$\phi_2$ 是紅線。
4. 最上面的輸出節點對 $z_1$ 是藍線、對 $z_5$ 是紅線。

課堂上的講法是：辨識 1 的那個神經元，希望前一層告訴它「有這三個部分、沒有另外三個部分」，設定適當的權重就做得到；5 則需要那些彎曲的部分，再加上底下那一橫。

圖上只畫了正負，沒有數值。以下是本文自擬的數字，用來把圖走一遍。令 $\phi_i = +1$ 表示這張圖有第 $i$ 種筆畫、$-1$ 表示沒有；藍線的權重取 $+1$，紅線取 $-1$，不加常數項。

| 輸入 | $(\phi_1, \dots, \phi_6)$ | $z_1$ 的分數 | $z_5$ 的分數 | 輸出節點的分數 $z_1 - z_5$ |
|---|---|---|---|---|
| 標準的 1 | $(+,+,+,-,-,-)$ | $6$ | $-4$ | $10$ |
| 標準的 5 | $(-,-,+,+,+,+)$ | $-4$ | $6$ | $-10$ |
| 少了左上那一撇的 1 | $(-,+,+,-,-,-)$ | $4$ | $-2$ | $6$ |

以第三列為例，$z_1$ 的分數是 $(+1)(-1) + (+1)(+1) + (+1)(+1) + (-1)(-1) + (-1)(-1) + (-1)(-1) = 4$。少了一撇，分數從 6 掉到 4，仍然是正的，還是判成 1。這就是課堂上說的：寫得草一點，有些特徵不明顯，大體上還是認得出來。

這個例子要傳達的事，講義寫成兩句。第一句是每一層的負擔比較輕（less burden），特徵由簡單到複雜。課堂上的比喻是不要一步登天：直接從一堆像素分出 1 和 5 很難；如果第一層只負責從像素找出短筆畫，後面的層再把短筆畫組成複雜一點的筆畫，層與層之間要做的事就變簡單。只有一層隱藏層的話，那一層要做的事就很複雜。

第二句是它對原始特徵（raw features）的困難任務特別自然。課堂上解釋，影像的原始特徵是像素、語音的原始特徵是音波，單獨一個特徵的物理意義很有限，人也沒有好辦法設計特徵轉換，只能靠模型一層一層自己學。這一頁的結論是深層網路當時在視覺、語音這些領域很受歡迎。

課堂上有一句提醒：這張圖其實還是淺的，只有兩層，它只是用來說明每一層可以有不同的物理意義。

### 四個難處與對應的技巧

第 5 頁列出深度學習的四個挑戰，每一個配一類當時的對策：

| 難處 | 對策 | 講義舉的例子 |
|---|---|---|
| 結構難決定 | 放進對問題的了解（domain knowledge） | 影像用 convolutional NNet |
| 模型複雜度高 | 資料夠多就不太擔心；另外用讓模型容忍雜訊的正則化 | dropout（網路被破壞時仍能運作）、denoising（輸入被破壞時仍能運作） |
| 最佳化困難 | 小心選初始值，避開差的局部最小值，稱為預訓練（pre-training） | — |
| 計算量大，資料愈多愈嚴重 | 新的硬體與計算架構 | 在 GPU 上做 mini-batch |

課堂上對每一列多講了一些：

- **結構。** convolutional NNet 的想法是影像的像素之間有位置關係。所以設計連結時，讓相鄰的像素連到下一層的同一個神經元，隔太遠的像素乾脆不連。等於事先決定有些權重不存在，讓每個神經元只處理附近的像素。
- **複雜度。** 視覺與語音的資料量通常很大，撐得住模型的複雜度，壓力反而落到計算量上。dropout 課堂上沒有細講，只說它在模擬網路裡有些神經元壞掉的情況，希望這時最後還是算得好；denoising 模擬的是輸入壞掉，「加雜訊為什麼算正則化」那一節會講。
- **最佳化。** 上一堂說過神經網路容易卡在局部最佳點，層數與神經元一多，這種點更多。梯度下降對起始點很敏感，所以許多方法會謹慎選起始點，而不是隨機給。
- **計算。** 課堂上說這是跟三十年前很不一樣的地方：GPU 上有很多計算單元，可以平行算 mini-batch 裡的梯度。

頁尾是林軒田的個人意見（投影片寫 IMHO）：謹慎的正則化與初始化是關鍵的技術。課堂上說這兩樣是讓網路能愈做愈深的兩個最重要的突破。這堂剩下的三節因此只講這兩件事：一個最簡單的預訓練方法，加上一個正則化方法。

### 兩步驟的深度學習框架

第 6 頁給了一個簡單的框架，講義稱為 Simple Deep Learning：

1. 對 $\ell = 1, \dots, L$，在 $w_*^{(1)}, \dots, w_*^{(\ell-1)}$ 固定的前提下，預訓練 $\{w_{ij}^{(\ell)}\}$。
2. 在預訓練好的網路上用 backprop 訓練，微調（fine-tune）所有的 $\{w_{ij}^{(\ell)}\}$。

頁面上有四張小圖 (a) 到 (d)，各是一個四排節點、三層權重的網路，輸入在最下面。(a) 只有最底下那層權重是藍色的，代表正在預訓練，其餘是灰色虛線；(b) 最底層變成黑色（已固定），第二層是藍色；(c) 輪到第三層；(d) 全部是黑色，可以進到第二步。

課堂上說明這樣做的理由：一次決定所有權重太難，所以一層一層來。第一步只是在決定起始點，可以快一點、不用太準；到了一個好的位置之後，永遠可以再用 backprop 微調，讓網路在真正要做的問題上表現更好。

這個框架還沒說第一步「預訓練」要訓練什麼，那是 autoencoder 要回答的問題。

### Fun Time：第一層萃取出什麼

**題目（第 7 頁）：** 一個深層網路要從原始像素辨識手寫字元。第一層隱藏層之後，比較可能萃取出哪一種特徵？

1. 像素（pixels）
2. 筆畫（strokes）
3. 部件（parts）
4. 數字（digits）

**答案：2。** 講義的理由是：簡單的筆畫大概是能從原始像素萃取出來的「下一級」特徵。像素是輸入本身，不需要萃取，選項 1 不對。部件要由好幾段筆畫組成，數字又要由部件組成，分別是更後面的層與輸出才做得到的事；課堂上說第一層不會給出太複雜的東西，也不會直接告訴我們最後怎麼分類。第 4 頁的圖正是這個順序：像素 → 筆畫 → 是 1 還是 5。

## 預訓練的權重要朝哪裡去：學一個解得回原輸入的編碼

```youtube
url: https://www.youtube.com/watch?v=eBVPQ4fgs_k
title: Deep Learning ::Autoencoder @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–03:22 談保留資訊的編碼，03:22–05:30 是 autoencoder 的網路，05:30–09:40 講逼近恆等函數有什麼用，09:40–12:44 是基本的 autoencoder，12:44–14:39 把它放進預訓練，之後是 Fun Time。）

### 好的權重是保留資訊的編碼

第 8 頁先問權重是什麼。權重決定特徵轉換，換個說法是編碼（encoding）：把資料換成另一種表示方式。

預訓練某一層的時候，後面的層還沒決定，也不知道這些權重之後會被怎麼微調、怎麼使用。課堂上從這裡推出標準：既然不知道之後要拿來做什麼，這一層至少不要把資訊弄丟。轉換過去之後，後面的層不該覺得資料變得亂七八糟、無法處理；原來的資料帶著什麼資訊，新的表示也要帶著類似的資訊。講義的寫法是 information-preserving encoding：下一層用不同的表示方式，保有同樣的資訊。

怎麼判斷資訊有沒有保住？講義的定義是：編碼之後能準確地解碼回來（decode accurately after encoding）。課堂上用筆畫的例子說明。把數字 1 的像素轉成「有沒有這幾段筆畫」之後，只要知道它有 $\phi_1$、$\phi_2$、$\phi_3$，把這幾段筆畫疊起來，就能重建出那個 1 大概的樣子。課堂上給的數字是：假設原本有一千個像素，轉成六個特徵之後還能轉回一千個像素，那就看不出有什麼資訊損失，只是換了一種表示方式。

所以預訓練的方向定下來了：讓權重朝保留資訊的編碼去。

### Autoencoder：輸出要像輸入的網路

第 9 頁把這個想法做成一個神經網路。輸入是 $x_1, \dots, x_d$（加上 $x_0 = 1$），中間一層有 $\tilde{d}$ 個 $\tanh$ 神經元（加上常數 $+1$），輸出層有 $d$ 個線性的節點，第 $i$ 個輸出的目標是接近 $x_i$。講義的定義是：

- **autoencoder**：$d$—$\tilde{d}$—$d$ 的神經網路，目標是 $g_i(\mathbf{x}) \approx x_i$，也就是學著逼近恆等函數（identity function）。
- $w_{ij}^{(1)}$ 是編碼權重（encoding weights），$w_{ji}^{(2)}$ 是解碼權重（decoding weights）。

課堂上指出它和上一堂的網路有一個差別：輸出不再只有一個，而是 $d$ 個，每個輸出對應輸入的一個維度。

接著是一個很自然的疑問，講義把它寫在頁尾：恆等函數寫一行程式就有了，為什麼要費力去逼近它？

### 逼近恆等函數有什麼用

第 10 頁回答。前提是：如果 $\mathbf{g}(\mathbf{x}) \approx \mathbf{x}$ 是靠著資料 $\mathbf{x}_n$ 裡的某種隱藏結構（hidden structure）做到的，那麼學到的結構本身就有用。

- **對監督式學習：** 隱藏結構可以當成合理的特徵轉換 $\boldsymbol{\Phi}(\mathbf{x})$。講義稱為學到資料的 informative representation。課堂上說，編碼那一半的權重就是這個轉換，它是一個還不錯的起始點，之後可以再微調，所以適合拿來預訓練。
- **對非監督式學習：** 做密度估計（density estimation）時，$\mathbf{g}(\mathbf{x}) \approx \mathbf{x}$ 的地方代表結構吻合、密度比較高；做離群值偵測（outlier detection）時，$\mathbf{g}(\mathbf{x}) \not\approx \mathbf{x}$ 的那些 $\mathbf{x}$ 就是離群值。講義稱為學到資料的 typical representation。課堂上的解釋是：資料多的地方，編碼器看得夠多，會做得比較好；不合群的點，編碼器會做得比較差。

課堂上把這一頁收成一句：逼近恆等函數只是做事的方式，真正要的是中間那一層的表示。講義的說法是 representation-learning through approximating identity function。

本文補充一點，幫忙理解為什麼中間那一層學得到東西。如果 $\tilde{d} \ge d$，中間層有足夠的位置把輸入原封不動搬過去，逼近恆等函數不需要任何結構。$\tilde{d} < d$ 的時候，$d$ 個數字要擠進 $\tilde{d}$ 個數字再還原，只有資料本身有規律（例如數字的像素其實由少數幾種筆畫組成）才可能還原得好。

### 基本的 autoencoder

第 11 頁給出正式的定義。basic autoencoder 是 $d$—$\tilde{d}$—$d$ 的神經網路，每筆資料的誤差函數是

$$
\sum_{i=1}^{d}\big(g_i(\mathbf{x}) - x_i\big)^2
$$

講義列了四個性質：

- **backprop 可以直接用。** 它只有一層隱藏層，淺而且容易訓練。課堂上說，至少跟很深的網路比起來容易得多。
- **通常 $\tilde{d} < d$。** 得到的是壓縮過的表示（compressed representation）。
- **資料是 $\{(\mathbf{x}_1, \mathbf{y}_1 = \mathbf{x}_1), (\mathbf{x}_2, \mathbf{y}_2 = \mathbf{x}_2), \dots, (\mathbf{x}_N, \mathbf{y}_N = \mathbf{x}_N)\}$。** 輸入與目標都是 $\mathbf{x}_n$，用不到標籤，所以常被歸為非監督式學習。課堂上的講法是把標籤先遮起來不看；之後要分 1 和 5，再用 backprop 調整整個網路。
- **有時會限制 $w_{ij}^{(1)} = w_{ji}^{(2)}$ 當作正則化。** 編碼和解碼共用同一組權重，權重的數量少了一半左右。代價是算梯度比較麻煩，課堂上說要把這個限制造成的影響算進去。

頁尾說明它在這堂的用途：在基本的深度學習裡，autoencoder 訓練完之後，取 $\{w_{ij}^{(1)}\}$ 當作預訓練好的權重。本文補充：也就是說，解碼那一半只在訓練 autoencoder 時用得到，訓練完就不再使用。

### 數值例子：一個 2-1-2 的 autoencoder

以下是本文自擬的例子，不在講義上。資料是四個二維的點，沒有標籤：

$$
\mathbf{x}_1 = (2, 1),\quad \mathbf{x}_2 = (1, 2),\quad \mathbf{x}_3 = (-2, -1),\quad \mathbf{x}_4 = (-1, -2)
$$

autoencoder 是 2-1-2：兩個輸入、一個 $\tanh$ 神經元、兩個線性輸出，$d = 2$、$\tilde{d} = 1$。權重數是 $(2+1) \times 1 + (1+1) \times 2 = 7$，其中編碼 3 個、解碼 4 個。假設訓練後得到下面這組權重（本文直接給定，沒有實際跑訓練）：

- 編碼：$w_{01}^{(1)} = 0$、$w_{11}^{(1)} = 0.5$、$w_{21}^{(1)} = 0.5$。
- 解碼：$w_{01}^{(2)} = w_{02}^{(2)} = 0$、$w_{11}^{(2)} = w_{12}^{(2)} = 1.657$。

對 $\mathbf{x}_1 = (2, 1)$ 做一次正向計算：

1. 編碼：$s = 0 + 0.5 \times 2 + 0.5 \times 1 = 1.5$，中間層的輸出是 $\tanh(1.5) = 0.9051$。這一個數字就是 $(2, 1)$ 的新表示。
2. 解碼：$g_1 = g_2 = 1.657 \times 0.9051 = 1.4998$。
3. 誤差：$(1.4998 - 2)^2 + (1.4998 - 1)^2 = 0.2502 + 0.2498 = 0.5000$。

六個點的結果（前四個是訓練資料，後兩個是新的點）：

| $\mathbf{x}$ | 編碼後的值 | $\mathbf{g}(\mathbf{x})$ | 誤差 |
|---|---|---|---|
| $(2, 1)$ | $0.9051$ | $(1.4998, 1.4998)$ | $0.5$ |
| $(1, 2)$ | $0.9051$ | $(1.4998, 1.4998)$ | $0.5$ |
| $(-2, -1)$ | $-0.9051$ | $(-1.4998, -1.4998)$ | $0.5$ |
| $(-1, -2)$ | $-0.9051$ | $(-1.4998, -1.4998)$ | $0.5$ |
| $(1.5, 1.5)$ | $0.9051$ | $(1.4998, 1.4998)$ | $0.0000$ |
| $(2, -2)$ | $0$ | $(0, 0)$ | $8$ |

這張表可以讀出三件事。

第一，壓縮有代價。$(2, 1)$ 與 $(1, 2)$ 被編成同一個數字，解碼後分不出來。一個數字裝不下兩個數字的全部資訊，這組權重選擇保留「兩個座標的和」，放掉「兩個座標的差」。四個點在座標和的方向上差很多（$\pm 3$）、在座標差的方向上差很少（$\pm 1$），所以這樣選的誤差小。線性 autoencoder 那一節會算出，只用一個數字、而且解碼是線性的話，四個點平均 0.5 已經是做得到的最小誤差。

第二，編碼那一半就是特徵轉換 $\Phi(\mathbf{x}) = \tanh(0.5 x_1 + 0.5 x_2)$。預訓練要留下來的就是 $(0, 0.5, 0.5)$ 這三個權重。

第三，誤差大小可以拿來判斷一個點典不典型，對應第 10 頁的離群值偵測。$(1.5, 1.5)$ 落在資料的主要方向上，誤差幾乎是 0；$(2, -2)$ 跟四筆資料的走向垂直，誤差是 8，是訓練資料的 16 倍。

### 用 autoencoder 做預訓練

第 12 頁把 autoencoder 填進前面的兩步驟框架，講義稱為 Deep Learning with Autoencoders。第一步多了一行：

1. 對 $\ell = 1, \dots, L$，在 $w_*^{(1)}, \dots, w_*^{(\ell-1)}$ 固定的前提下預訓練 $\{w_{ij}^{(\ell)}\}$，做法是在 $\{\mathbf{x}_n^{(\ell-1)}\}$ 上訓練一個 $\tilde{d} = d^{(\ell)}$ 的 basic autoencoder。
2. 在預訓練好的網路上用 backprop 微調所有的 $\{w_{ij}^{(\ell)}\}$。

$\mathbf{x}_n^{(\ell-1)}$ 是第 $n$ 筆資料在第 $\ell-1$ 層的輸出，$\mathbf{x}_n^{(0)}$ 就是原始輸入。課堂上的說明是：autoencoder 中間要放幾個神經元，就看網路的下一層有幾個神經元；訓練完得到一組起始權重，把它固定下來，再往下一層做。

套到一個具體的網路走一遍。以下的網路大小是本文自擬的：要分辨 16×16 的手寫數字圖是 1 還是 5，輸入 256 個像素，網路是 256-64-16-6-1，有 $N$ 張圖。

| 步驟 | 訓練資料 | autoencoder | 留下的編碼權重 | 丟掉的解碼權重 |
|---|---|---|---|---|
| $\ell = 1$ | 原始像素 $\mathbf{x}_n^{(0)}$（256 維） | 256-64-256 | $257 \times 64 = 16448$ 個，當 $w^{(1)}$ | $65 \times 256 = 16640$ 個 |
| $\ell = 2$ | 第 1 層的輸出 $\mathbf{x}_n^{(1)}$（64 維） | 64-16-64 | $65 \times 16 = 1040$ 個，當 $w^{(2)}$ | $17 \times 64 = 1088$ 個 |
| $\ell = 3$ | 第 2 層的輸出 $\mathbf{x}_n^{(2)}$（16 維） | 16-6-16 | $17 \times 6 = 102$ 個，當 $w^{(3)}$ | $7 \times 16 = 112$ 個 |
| $\ell = 4$ | 第 3 層的輸出 $\mathbf{x}_n^{(3)}$（6 維） | 6-1-6 | $7 \times 1 = 7$ 個，當 $w^{(4)}$ | $2 \times 6 = 12$ 個 |

每做完一層，要把 $N$ 張圖都通過剛定好的權重算一次，得到下一步的訓練資料。四步做完，網路的 $16448 + 1040 + 102 + 7 = 17597$ 個權重都有了起始值，這時才把標籤 $y_n$ 拿出來，用 backprop 微調全部的權重。前四步完全沒用到標籤。

頁尾提醒：許多成功的預訓練方法用的是更講究（fancier）的 autoencoder，架構和正則化的方式都不一樣。課堂上說這些方法大同小異，差別在多了一些正則化，或是連結的方式不同。

### Fun Time：預訓練要花多久

**題目（第 13 頁）：** 假設用 backprop 訓練一個 $d$-$\tilde{d}$-$d$ 的 autoencoder 大約要 $c \cdot d \cdot \tilde{d}$ 秒。預訓練一個 $d$-$d^{(1)}$-$d^{(2)}$-$d^{(3)}$-1 的深層網路總共要幾秒？

1. $c\left(d + d^{(1)} + d^{(2)} + d^{(3)} + 1\right)$
2. $c\left(d \cdot d^{(1)} \cdot d^{(2)} \cdot d^{(3)} \cdot 1\right)$
3. $c\left(d\,d^{(1)} + d^{(1)}d^{(2)} + d^{(2)}d^{(3)} + d^{(3)}\right)$
4. $c\left(d\,d^{(1)} \cdot d^{(1)}d^{(2)} \cdot d^{(2)}d^{(3)} \cdot d^{(3)}\right)$

**答案：3。** 講義的解答是：每個 $c \cdot d^{(\ell-1)} \cdot d^{(\ell)}$ 是用一個 autoencoder 決定一層權重的時間。四層權重要訓練四個 autoencoder，一個接一個做，時間相加。最後一項是 $c \cdot d^{(3)} \cdot 1 = c\,d^{(3)}$，對應輸出層那一組權重。

選項 1 把每個 autoencoder 的時間當成只跟一邊的大小有關；選項 2 與 4 把時間相乘，但四個 autoencoder 是先後訓練的，不是巢狀的迴圈。

本文驗算：用前面的 256-64-16-6-1，選項 3 是 $c(16384 + 1024 + 96 + 6) = 17510c$。第一項就占了 94%，預訓練的時間幾乎都花在最寬的那一層。選項 2 會算出 $1572864c$，差了將近 90 倍。

## 加雜訊為什麼算正則化：denoising autoencoder

```youtube
url: https://www.youtube.com/watch?v=gx2Vfw8S--0
title: Deep Learning ::Denoising Autoencoder @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–01:32 回顧已經學過的正則化，01:32–02:27 複習過擬合的成因，02:27–07:19 是加雜訊的想法與 denoising autoencoder，07:19–08:05 把它歸到 hint，之後是 Fun Time。）

### 已經有的正則化工具

預訓練處理的是初始化，這一節輪到正則化。第 14 頁再貼一次網路圖，圖下寫著 watch out for overfitting：權重與神經元這麼多，模型複雜度高，需要正則化。講義列出三種已經會的：

- **對結構下決定或加限制。** 課堂上舉的例子是 convolutional NNet：不要那麼多連結，本身就是一種限制。
- **weight decay 或 weight elimination 的 regularizer。** 上一堂的內容。
- **early stopping。** 也是上一堂的內容，backprop 不一定要跑到完，中途停下來可能更好。

講義說接下來要介紹另一種。

### 雜訊是過擬合的成因

第 15 頁回到[基石第 13 堂：過擬合](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)的那張圖：橫軸是資料量 $N$（圖上的刻度是 80 到 120），縱軸是隨機雜訊的強度 $\sigma^2$（0 到 2），顏色代表過擬合的程度，愈紅愈嚴重。左上角資料少、雜訊大，是一整片深紅；右下角資料多、雜訊小，是藍色。圖旁把成因整理成三行：

| 情況 | 過擬合 |
|---|---|
| 資料量 $N$ 變少 | 變嚴重 |
| 雜訊變多 | 變嚴重 |
| 模型能力過強 | 變嚴重 |

課堂上的推論是：模型和資料量都已經定下來的話，剩下能處理的只有雜訊。

### 把雜訊加進資料

第 16 頁先列出直接的做法：資料清理或修剪（data cleaning/pruning），基石第 13 堂提過。然後是講義自己稱為「狂野」（wild）的做法：把雜訊加進資料。課堂上替學生把疑問說出來：資料裡的雜訊都嫌多了，為什麼還要加？

想法從「好的 autoencoder 該有什麼性質」出發。講義寫：一個穩健（robust）的 autoencoder 不只要讓 $\mathbf{g}(\mathbf{x}) \approx \mathbf{x}$，在 $\tilde{\mathbf{x}}$ 跟 $\mathbf{x}$ 有一點不同的時候，也要讓 $\mathbf{g}(\tilde{\mathbf{x}}) \approx \mathbf{x}$。課堂上的例子是手寫的數字：同一個字寫得醜一點、歪一點，或者紙髒了一點，解碼出來的還是應該跟原來乾淨的那個字差不多。髒的進去、髒的出來，甚至更髒，這樣的編碼器沒什麼用。

做法不用改網路，只改餵進去的資料。講義的定義：

- **denoising autoencoder**：用下面這組資料跑 basic autoencoder

$$
\{(\tilde{\mathbf{x}}_1, \mathbf{y}_1 = \mathbf{x}_1), (\tilde{\mathbf{x}}_2, \mathbf{y}_2 = \mathbf{x}_2), \dots, (\tilde{\mathbf{x}}_N, \mathbf{y}_N = \mathbf{x}_N)\},\qquad \tilde{\mathbf{x}}_n = \mathbf{x}_n + \text{artificial noise}
$$

輸入是加了人工雜訊的 $\tilde{\mathbf{x}}_n$，目標仍是乾淨的 $\mathbf{x}_n$。講義接著列了三點：

- 在深度學習裡，它常被用來取代 basic autoencoder。
- 它對資料或影像處理有用：$\mathbf{g}(\tilde{\mathbf{x}})$ 是 $\tilde{\mathbf{x}}$ 去掉雜訊後的版本。課堂上舉的是掃描進來、帶一點雜訊的圖。
- 它的效果是把 $\mathbf{g}$ 限制（constrain/regularize）成能容忍雜訊、會去雜訊的函數。

為什麼這算正則化？課堂上的比喻是在跟編碼器說：孩子，這個世界很亂，但我告訴你正確的答案是什麼，輸入再亂也有一盞明燈指著正確的方向。餵有雜訊的輸入、給乾淨的目標，等於告訴演算法我們希望 $\mathbf{g}$ 有什麼性質，把它往那個方向帶，這就是正則化在做的事。

頁尾把想法推廣：人工雜訊或提示（hint）可以當成正則化，實務上對其他神經網路與模型也有用。課堂上回顧，基石講過把人工設計的資料加進去叫 hint，同樣是讓機器知道哪種資料要處理得更好。

### 數值例子：雜訊在最簡單的模型裡變成對權重的懲罰

以下是本文自擬的例子，不在講義上。它只處理最簡單的情況，用來看清楚「加雜訊」和基石第 14 堂的 weight decay 是什麼關係。

資料是四個一維的數 $x \in \{-2, -1, 1, 2\}$。模型是一維的線性 autoencoder $g(\tilde{x}) = a\tilde{x}$，$a$ 是編碼權重與解碼權重的乘積。乾淨的資料下，$a = 1$ 就讓誤差是 0。

現在每個 $x$ 都做出兩個帶雜訊的版本 $\tilde{x} = x + 1$ 與 $\tilde{x} = x - 1$，一共八筆訓練資料 $(\tilde{x}, x)$：

$$
(-3, -2),\ (-1, -2),\ (-2, -1),\ (0, -1),\ (0, 1),\ (2, 1),\ (1, 2),\ (3, 2)
$$

**直接解。** 要最小化 $\sum (a\tilde{x} - x)^2$。對 $a$ 微分令為 0，得到 $a = \sum \tilde{x}x \big/ \sum \tilde{x}^2$。分子是 $6 + 2 + 2 + 0 + 0 + 2 + 2 + 6 = 20$，分母是 $9 + 1 + 4 + 0 + 0 + 4 + 1 + 9 = 28$，所以

$$
a = \frac{20}{28} = \frac{5}{7} \approx 0.714
$$

**看出懲罰項。** 把一個 $x$ 的兩個版本放在一起。記雜訊為 $\varepsilon = \pm 1$，誤差是

$$
\big(a(x + \varepsilon) - x\big)^2 = \big((a-1)x + a\varepsilon\big)^2 = (a-1)^2x^2 + 2a(a-1)x\varepsilon + a^2\varepsilon^2
$$

$\varepsilon = +1$ 與 $\varepsilon = -1$ 取平均時，中間那一項正負相消，$\varepsilon^2$ 都是 1。再對四個 $x$ 取平均，$x^2$ 的平均是 $(4 + 1 + 1 + 4)/4 = 2.5$：

$$
\text{平均誤差} = \underbrace{2.5\,(a-1)^2}_{\text{乾淨資料上的誤差}} + \underbrace{1 \cdot a^2}_{\text{雜訊帶來的項}}
$$

第一項就是不加雜訊時的 $E_{\text{in}}$。第二項是 $a$ 的平方乘上雜訊的變異數（這裡是 1），把 $a$ 當成權重來看，形式和 weight decay 的 $\lambda w^2$ 一樣，雜訊的變異數扮演 $\lambda$ 的角色。對 $a$ 微分：$5(a - 1) + 2a = 0$，得到 $a = 5/7$，和直接解一致。

| $a$ | 乾淨資料上的誤差 $2.5(a-1)^2$ | 雜訊帶來的項 $a^2$ | 加總 |
|---|---|---|---|
| $1$ | $0$ | $1$ | $1$ |
| $0.9$ | $0.025$ | $0.81$ | $0.835$ |
| $5/7$ | $0.204$ | $0.510$ | $0.714$ |
| $0.5$ | $0.625$ | $0.25$ | $0.875$ |

**這個結果代表什麼。** 加了雜訊之後，最佳的 $a$ 從 1 縮到 $5/7$：模型學到輸入被雜訊撐大了，輸出要往回縮一點。它在乾淨資料上的誤差從 0 變成 0.204，這是正則化一貫的代價，$E_{\text{in}}$ 變差一點，換來對輸入擾動比較不敏感的 $g$。雜訊愈強，這個例子裡的 $a$ 縮得愈多。

這個等式是在這個例子的條件下推出來的：模型是線性的、誤差是平方誤差、雜訊正負對稱所以交叉項消掉。它不是講義的結論，也不能直接搬到有 $\tanh$ 的網路上。講義只說 denoising 的效果是把 $\mathbf{g}$ 往容忍雜訊的方向限制。

### Fun Time：哪一個不是正則化

**題目（第 17 頁）：** 下列哪一個不能看成正則化的技巧？

1. 用人工產生的帶雜訊資料提示模型
2. 提早停止梯度下降
3. 加上 weight elimination regularizer
4. 以上都是正則化的技巧

**答案：4。** 講義的解答是：選項 1 是正則化的新朋友，選項 2 與 3 是老朋友。選項 1 就是這一節的 denoising；選項 2 是 early stopping，選項 3 是 weight elimination，都在上一堂。三個都是正則化，沒有任何一個符合題目問的「不能看成」，所以選 4。

課堂上把選項 4 口頭講成「以上皆非」，意思相同：前三項裡沒有題目要找的那一個。講義上選項 4 的原文是 all the above are regularization techniques。

## 把 autoencoder 換成線性的：最佳解是 XᵀX 最大的幾個 eigenvector

```youtube
url: https://www.youtube.com/watch?v=Bgc4UY8567A
title: Deep Learning :: Principal Component Analysis @ Machine Learning Techniques (機器學習技法)
```

（影片 00:01–05:58 寫出線性 autoencoder 的假說，05:58–07:47 是誤差函數，07:47–14:11 做 eigenvalue 分解並講幾何意義，14:11–18:15 求最佳的 Γ，18:15–24:48 求最佳的 V，24:48–28:50 是 PCA，28:50–29:38 是 Fun Time，之後是整堂的總結。）

### 線性 autoencoder 的假說

前面的 autoencoder 中間有 $\tanh$，是非線性的。第 18 頁回頭問線性的版本，理由寫在頁面上：線性的也許比較有效率、比較不容易過擬合，而且這門課一向是 linear first。課堂上解釋先前為什麼跳過：深度學習的每一層本來就要做非線性轉換，所以非線性的 autoencoder 在那個架構下比較有用；線性的版本可以拿來處理資料，不一定用在深度學習。

把 $\tanh$ 拿掉，第 $k$ 個輸出就是兩層權重連乘。講義加上三個特殊條件：

- **去掉 $x_0$。** 讓 $i$ 的範圍和 $k$ 的範圍一樣。課堂上的理由是：輸入有第 0 維的話，輸出也該有一個第 0 維去跟常數比，沒有什麼意義。
- **限制 $w_{ij}^{(1)} = w_{ji}^{(2)} = w_{ij}$。** 就是 basic autoencoder 那一頁提過的正則化，編碼與解碼共用權重。把這些權重收進一個 $d \times \tilde{d}$ 的矩陣 $\mathrm{W} = [w_{ij}]$。
- **假設 $\tilde{d} < d$。** 確保解不是無聊的（non-trivial）。

在這些條件下，講義寫第 $k$ 個分量的假說是

$$
h_k(\mathbf{x}) = \sum_{j} w_{kj}\left(\sum_{i=1}^{d} w_{ij}x_i\right)
$$

投影片上外層的加總寫的是從 $j = 0$ 加到 $\tilde{d}$；課堂上說 $j$ 的範圍是 1 到 $\tilde{d}$，$\mathrm{W}$ 的大小 $d \times \tilde{d}$ 也只容得下這 $\tilde{d}$ 行，所以下面的矩陣形式裡沒有 $j = 0$ 那一項。

把它讀成矩陣運算。$\mathrm{W}$ 的第 $i$ 列第 $j$ 行是 $w_{ij}$，所以裡面的括號 $\sum_i w_{ij}x_i$ 是向量 $\mathrm{W}^\top\mathbf{x}$ 的第 $j$ 個分量，這是編碼，結果是 $\tilde{d}$ 維。外面的 $\sum_j w_{kj}(\cdot)_j$ 是再乘上 $\mathrm{W}$ 之後的第 $k$ 個分量，這是解碼，結果回到 $d$ 維。講義的結論：

$$
\mathbf{h}(\mathbf{x}) = \mathrm{W}\mathrm{W}^\top\mathbf{x}
$$

本文補充第三個條件的理由。如果 $\tilde{d} = d$，取 $\mathrm{W}$ 為任何一個 $d \times d$ 的正交矩陣（例如單位矩陣），就有 $\mathrm{W}\mathrm{W}^\top = \mathrm{I}$，$\mathbf{h}(\mathbf{x}) = \mathbf{x}$，誤差是 0，可是什麼結構都沒學到。課堂上只說這種情況有非常 trivial 的解，不是我們要的。

### 誤差函數是權重的四次式

第 19 頁寫下要最小化的量。誤差仍是平方誤差，對所有資料取平均：

$$
E_{\text{in}}(\mathbf{h}) = E_{\text{in}}(\mathrm{W}) = \frac{1}{N}\sum_{n=1}^{N}\left\lVert \mathbf{x}_n - \mathrm{W}\mathrm{W}^\top\mathbf{x}_n \right\rVert^2
$$

線性模型加平方誤差，[基石第 9 堂：線性迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)有一步到位的公式解。這裡能不能也有？講義在式子下面只寫了一句：這是 $w_{ij}$ 的四次多項式。課堂上說，所以乍看之下不容易。

本文補充，用 $\tilde{d} = 1$ 把四次式寫出來。這時 $\mathrm{W}$ 只有一行，記成向量 $\mathbf{w}$，$\mathrm{W}\mathrm{W}^\top\mathbf{x} = \mathbf{w}(\mathbf{w}^\top\mathbf{x})$：

$$
\left\lVert \mathbf{x} - \mathbf{w}(\mathbf{w}^\top\mathbf{x}) \right\rVert^2 = \mathbf{x}^\top\mathbf{x} - 2(\mathbf{w}^\top\mathbf{x})^2 + (\mathbf{w}^\top\mathbf{w})(\mathbf{w}^\top\mathbf{x})^2
$$

三項分別是 $\mathbf{w}$ 的零次、二次、四次。對 $\mathbf{w}$ 微分會得到三次方程式，沒有線性迴歸那種解一個線性方程組就結束的好事。講義的路線是換一組變數。課堂上說，這個問題還是有公式解，只是不容易一眼看出來。

### 換一組變數：把 WWᵀ 做 eigenvalue 分解

講義在這裡寫了一句 be brave，接下來要用線性代數。觀察 $E_{\text{in}}$ 的式子，$\mathrm{W}$ 只以 $\mathrm{W}\mathrm{W}^\top$ 的形式出現。課堂上指出 $\mathrm{W}\mathrm{W}^\top$ 是半正定矩陣（它同時是對稱的），可以做 eigenvalue 分解：

$$
\mathrm{W}\mathrm{W}^\top = \mathrm{V}\Gamma\mathrm{V}^\top
$$

講義列出兩個矩陣的性質：

- $\mathrm{V}$ 是 $d \times d$ 的正交矩陣，$\mathrm{V}\mathrm{V}^\top = \mathrm{V}^\top\mathrm{V} = \mathrm{I}_d$。它的每一行 $\mathbf{v}_j$ 長度是 1，彼此垂直。
- $\Gamma$ 是 $d \times d$ 的對角矩陣，對角線上最多 $\tilde{d}$ 個非零的值。

第二點來自秩（rank）。$\mathrm{W}$ 只有 $\tilde{d}$ 行，$\mathrm{W}\mathrm{W}^\top\mathbf{x}$ 永遠是這 $\tilde{d}$ 行的線性組合，所以 $\mathrm{W}\mathrm{W}^\top$ 的秩最多是 $\tilde{d}$，非零的 eigenvalue 也最多 $\tilde{d}$ 個。課堂上舉的數字是 $d = 200$、$\tilde{d} = 50$：對角線上最多 50 個不是 0，其餘 150 個一定是 0。原本對 $\mathrm{W}$ 大小的限制，就這樣變成對 $\Gamma$ 的限制。

於是 $\mathrm{W}\mathrm{W}^\top\mathbf{x}_n = \mathrm{V}\Gamma\mathrm{V}^\top\mathbf{x}_n$ 可以拆成三個動作，講義逐一說明：

1. $\mathrm{V}^\top\mathbf{x}_n$：換到另一組正交的基底，幾何上是旋轉或鏡射。課堂上強調，向量在空間裡轉來轉去或照鏡子，長度都不變。
2. $\Gamma(\cdots)$：把至少 $d - \tilde{d}$ 個分量設成 0，其餘的分量各自縮放。
3. $\mathrm{V}(\cdots)$：用這些係數和基底重建，也就是轉回原來的座標。

原來的 $\mathbf{x}_n$ 也能寫成同樣的形式：$\mathbf{x}_n = \mathrm{V}\mathrm{I}\mathrm{V}^\top\mathbf{x}_n$，轉過去、什麼都不做、再轉回來。這樣 $E_{\text{in}}$ 裡相減的兩項只差在中間是 $\mathrm{I}$ 還是 $\Gamma$。問題從「找 $\mathrm{W}$」變成「找 $\Gamma$ 與 $\mathrm{V}$」，講義分兩步做，先 $\Gamma$ 後 $\mathrm{V}$。

### 最佳的 Γ：對角線上放 d̃ 個 1

第 20 頁的問題是

$$
\min_{\mathrm{V}}\min_{\Gamma}\ \frac{1}{N}\sum_{n=1}^{N}\left\lVert \mathrm{V}\mathrm{I}\mathrm{V}^\top\mathbf{x}_n - \mathrm{V}\Gamma\mathrm{V}^\top\mathbf{x}_n \right\rVert^2
$$

先把 $\mathrm{V}$ 當成固定的，只看 $\Gamma$。兩項提出共同的部分，範數裡面是 $\mathrm{V}(\mathrm{I} - \Gamma)\mathrm{V}^\top\mathbf{x}_n$。最前面的 $\mathrm{V}$ 是轉回來的動作，不改變長度：對任何向量 $\mathbf{u}$，$\lVert\mathrm{V}\mathbf{u}\rVert^2 = \mathbf{u}^\top\mathrm{V}^\top\mathrm{V}\mathbf{u} = \mathbf{u}^\top\mathbf{u}$。投影片上因此把最前面那個 $\mathrm{V}$ 劃掉，剩下

$$
\min_{\Gamma}\ \sum_{n=1}^{N}\left\lVert (\mathrm{I} - \Gamma)\,\mathrm{V}^\top\mathbf{x}_n \right\rVert^2
$$

講義的說法是：希望 $\mathrm{I} - \Gamma$ 裡的 0 愈多愈好。課堂上的講法是 0 多多益善，而能動的只有 $\Gamma$ 對角線上的值；要讓 $\mathrm{I} - \Gamma$ 的對角線出現 0，就在 $\Gamma$ 的對角線上放 1，最多能放 $\tilde{d}$ 個。

本文把這句話寫成式子。$\mathrm{V}^\top\mathbf{x}_n$ 的第 $j$ 個分量是 $\mathbf{v}_j^\top\mathbf{x}_n$，$\mathrm{I} - \Gamma$ 是對角矩陣，把第 $j$ 個分量乘上 $1 - \gamma_j$。所以

$$
\sum_{n=1}^{N}\left\lVert (\mathrm{I} - \Gamma)\,\mathrm{V}^\top\mathbf{x}_n \right\rVert^2 = \sum_{j=1}^{d}(1 - \gamma_j)^2\,c_j,\qquad c_j = \sum_{n=1}^{N}(\mathbf{v}_j^\top\mathbf{x}_n)^2 \ge 0
$$

每個 $\gamma_j$ 各管各的一項。$\gamma_j$ 如果必須是 0，那一項是 $c_j$；可以不是 0 的話，取 $\gamma_j = 1$ 讓它變成 0，沒有比這更小的。最多 $\tilde{d}$ 個可以不是 0，所以最佳的 $\Gamma$ 是 $\tilde{d}$ 個對角元素為 1、其餘為 0。講義接著說，不失一般性可以把 1 排在前面：

$$
\Gamma = \begin{bmatrix} \mathrm{I}_{\tilde{d}} & 0 \\ 0 & 0 \end{bmatrix}
$$

可以這樣排，是因為 $\mathrm{V}$ 還沒決定，哪個方向排第幾行由下一步安排。課堂上的說法是：剩下的事交給 $\mathrm{V}$ 去煩惱。

這個 $\Gamma$ 也說明了最佳的線性 autoencoder 在做什麼：轉到新的座標，留下前 $\tilde{d}$ 個分量、原封不動，其餘的丟掉，再轉回來。這就是投影到 $\mathbf{v}_1, \dots, \mathbf{v}_{\tilde{d}}$ 張成的子空間。

### 最佳的 V：從最小化丟掉的，換成最大化留下的

把最佳的 $\Gamma$ 代回去，$\mathrm{I} - \Gamma$ 是前 $\tilde{d}$ 個對角元素為 0、後 $d - \tilde{d}$ 個為 1。第 21 頁的問題是

$$
\min_{\mathrm{V}}\ \sum_{n=1}^{N}\left\lVert \begin{bmatrix} 0 & 0 \\ 0 & \mathrm{I}_{d - \tilde{d}} \end{bmatrix}\mathrm{V}^\top\mathbf{x}_n \right\rVert^2 = \min_{\mathrm{V}}\ \sum_{j > \tilde{d}} c_j
$$

它在最小化被丟掉的那些分量的平方和，也就是重建誤差。講義把它換成等價的最大化問題：

$$
\max_{\mathrm{V}}\ \sum_{n=1}^{N}\left\lVert \begin{bmatrix} \mathrm{I}_{\tilde{d}} & 0 \\ 0 & 0 \end{bmatrix}\mathrm{V}^\top\mathbf{x}_n \right\rVert^2 = \max_{\mathrm{V}}\ \sum_{j \le \tilde{d}} c_j
$$

兩者等價的理由，課堂上只用一句話帶過：整個向量的長度是固定的，一邊愈多另一邊就愈少。寫成式子是 $\sum_{j=1}^{d} c_j = \sum_n \lVert\mathrm{V}^\top\mathbf{x}_n\rVert^2 = \sum_n \lVert\mathbf{x}_n\rVert^2$，這個總和跟 $\mathrm{V}$ 無關。丟掉的部分加上留下的部分是定值，讓丟掉的最小，就是讓留下的最大。課堂上說換成最大化只是因為式子比較乾淨。

**先看 $\tilde{d} = 1$。** 這時只有 $\mathrm{V}^\top$ 的第一列 $\mathbf{v}^\top$ 有作用，其他列都被乘上 0。留下的量是 $(\mathbf{v}^\top\mathbf{x}_n)^2 = \mathbf{v}^\top\mathbf{x}_n\mathbf{x}_n^\top\mathbf{v}$，問題變成

$$
\max_{\mathbf{v}}\ \sum_{n=1}^{N}\mathbf{v}^\top\mathbf{x}_n\mathbf{x}_n^\top\mathbf{v}\qquad \text{subject to}\quad \mathbf{v}^\top\mathbf{v} = 1
$$

限制式不能省。課堂上說，$\mathbf{v}$ 如果可以任意取，把它放大 10 倍、100 倍，目標就跟著變大，沒有意義；$\mathbf{v}$ 是正交矩陣的一列，長度本來就是 1。

把資料排成 $N \times d$ 的矩陣 $\mathrm{X}$，第 $n$ 列是 $\mathbf{x}_n^\top$，則 $\sum_n \mathbf{x}_n\mathbf{x}_n^\top = \mathrm{X}^\top\mathrm{X}$，目標函數是 $\mathbf{v}^\top\mathrm{X}^\top\mathrm{X}\mathbf{v}$。這是有等式限制的最佳化，講義用拉格朗日乘數。課堂上的說明是：在最佳解上，目標函數的梯度和限制式的梯度要平行。目標函數對 $\mathbf{v}$ 的梯度是 $2\mathrm{X}^\top\mathrm{X}\mathbf{v}$（$\mathrm{X}^\top\mathrm{X}$ 是對稱矩陣），$\mathbf{v}^\top\mathbf{v}$ 的梯度是 $2\mathbf{v}$，平行就是差一個倍數 $\lambda$：

$$
\sum_{n=1}^{N}\mathbf{x}_n\mathbf{x}_n^\top\mathbf{v} = \lambda\mathbf{v}
$$

一個矩陣乘上 $\mathbf{v}$ 等於 $\mathbf{v}$ 的 $\lambda$ 倍，這正是 eigenvector 的定義。所以最佳的 $\mathbf{v}$ 一定是 $\mathrm{X}^\top\mathrm{X}$ 的某個 eigenvector，$\lambda$ 是對應的 eigenvalue。是哪一個？把這個條件代回目標函數：

$$
\mathbf{v}^\top\mathrm{X}^\top\mathrm{X}\mathbf{v} = \mathbf{v}^\top(\lambda\mathbf{v}) = \lambda\,\mathbf{v}^\top\mathbf{v} = \lambda
$$

目標函數的值就是 $\lambda$。要最大，就選 eigenvalue 最大的那個 eigenvector，講義稱為 topmost eigenvector。這一步也是這一節 Fun Time 的內容。

**一般的 $\tilde{d}$。** 講義的結論是 $\{\mathbf{v}_j\}_{j=1}^{\tilde{d}}$ 取 $\mathrm{X}^\top\mathrm{X}$ 最大的 $\tilde{d}$ 個 eigenvalue 對應的 eigenvector。課堂上說證明和 $\tilde{d} = 1$ 類似但複雜一些，沒有細講，只給結果。本文也不證。

**回到 $\mathrm{W}$。** $\Gamma$ 只在前 $\tilde{d}$ 個位置是 1，所以 $\mathrm{V}\Gamma\mathrm{V}^\top = \sum_{j \le \tilde{d}}\mathbf{v}_j\mathbf{v}_j^\top$。取 $\mathrm{W}$ 的各行為 $\mathbf{w}_j = \mathbf{v}_j$，就有 $\mathrm{W}\mathrm{W}^\top = \mathrm{V}\Gamma\mathrm{V}^\top$。講義寫成：最佳的 $\{\mathbf{w}_j\}$ 就是 $\gamma_j = 1$ 的那些 $\mathbf{v}_j$，也就是 top eigenvectors。原本的四次式有了公式解。

講義把整個推導收成一句：線性 autoencoder 是把資料投影到最「符合」$\{\mathbf{x}_n\}$ 的幾個互相垂直的樣式 $\mathbf{w}_j$ 上。

本文補充一個順手的結果。$\mathbf{v}_j$ 是 eigenvector 時，$c_j = \mathbf{v}_j^\top\mathrm{X}^\top\mathrm{X}\mathbf{v}_j = \lambda_j$。所以最佳解的誤差是被丟掉的那些 eigenvalue 的和除以 $N$：

$$
E_{\text{in}}(\mathrm{W}) = \frac{1}{N}\sum_{j > \tilde{d}}\lambda_j
$$

### 數值例子：四個點手算一次

以下是本文自擬的例子，不在講義上。資料用前面 2-1-2 autoencoder 的四個點，$d = 2$、$\tilde{d} = 1$：

$$
\mathrm{X} = \begin{bmatrix} 2 & 1 \\ 1 & 2 \\ -2 & -1 \\ -1 & -2 \end{bmatrix}
$$

**第一步：算 $\mathrm{X}^\top\mathrm{X}$。** 左上角是第一個座標的平方和 $4 + 1 + 4 + 1 = 10$，右下角是第二個座標的平方和 $1 + 4 + 1 + 4 = 10$，非對角是兩個座標乘積的和 $2 + 2 + 2 + 2 = 8$：

$$
\mathrm{X}^\top\mathrm{X} = \begin{bmatrix} 10 & 8 \\ 8 & 10 \end{bmatrix}
$$

**第二步：求 eigenvalue 與 eigenvector。** 解 $(10 - \lambda)^2 - 64 = 0$，得到 $10 - \lambda = \pm 8$，所以 $\lambda_1 = 18$、$\lambda_2 = 2$。$\lambda_1 = 18$ 對應 $\mathbf{v}_1 = \frac{1}{\sqrt{2}}(1, 1)$，驗算：$\mathrm{X}^\top\mathrm{X}(1, 1)^\top = (18, 18)^\top$。$\lambda_2 = 2$ 對應 $\mathbf{v}_2 = \frac{1}{\sqrt{2}}(1, -1)$，驗算：$\mathrm{X}^\top\mathrm{X}(1, -1)^\top = (2, -2)^\top$。

**第三步：最佳的 $\mathrm{W}$。** $\tilde{d} = 1$，取最大的那個：$\mathbf{w} = \frac{1}{\sqrt{2}}(1, 1)$。

**第四步：把三個動作套到 $\mathbf{x}_1 = (2, 1)$。**

1. 轉過去：$\mathrm{V}^\top\mathbf{x}_1 = (\mathbf{v}_1^\top\mathbf{x}_1,\ \mathbf{v}_2^\top\mathbf{x}_1) = \left(\frac{3}{\sqrt{2}},\ \frac{1}{\sqrt{2}}\right)$。
2. 乘上 $\Gamma = \text{diag}(1, 0)$：留下第一個分量，第二個設成 0，得到 $\left(\frac{3}{\sqrt{2}},\ 0\right)$。編碼就是 $\frac{3}{\sqrt{2}} \approx 2.121$ 這一個數。
3. 轉回來：$\frac{3}{\sqrt{2}}\mathbf{v}_1 = (1.5, 1.5)$。

誤差是 $\lVert(2, 1) - (1.5, 1.5)\rVert^2 = 0.25 + 0.25 = 0.5$，正好是被丟掉的那個分量的平方 $\left(\frac{1}{\sqrt{2}}\right)^2$。

**第五步：全部四個點。**

| $\mathbf{x}_n$ | $\mathbf{v}_1^\top\mathbf{x}_n$（留下） | $\mathbf{v}_2^\top\mathbf{x}_n$（丟掉） | 重建 $\mathrm{W}\mathrm{W}^\top\mathbf{x}_n$ | 誤差 |
|---|---|---|---|---|
| $(2, 1)$ | $3/\sqrt{2}$ | $1/\sqrt{2}$ | $(1.5, 1.5)$ | $0.5$ |
| $(1, 2)$ | $3/\sqrt{2}$ | $-1/\sqrt{2}$ | $(1.5, 1.5)$ | $0.5$ |
| $(-2, -1)$ | $-3/\sqrt{2}$ | $-1/\sqrt{2}$ | $(-1.5, -1.5)$ | $0.5$ |
| $(-1, -2)$ | $-3/\sqrt{2}$ | $1/\sqrt{2}$ | $(-1.5, -1.5)$ | $0.5$ |

留下那一欄的平方和是 $c_1 = 4 \times 4.5 = 18 = \lambda_1$，丟掉那一欄的平方和是 $c_2 = 4 \times 0.5 = 2 = \lambda_2$，加起來是 20，等於四個點長度平方的總和 $5 + 5 + 5 + 5$。$E_{\text{in}} = 2/4 = 0.5$，和公式 $\frac{1}{N}\sum_{j > \tilde{d}}\lambda_j$ 一致。

**第六步：跟別的 $\mathbf{w}$ 比。** 用前面的四次式 $E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\big[20 - 2q + (\mathbf{w}^\top\mathbf{w})\,q\big]$，其中 $q = \mathbf{w}^\top\mathrm{X}^\top\mathrm{X}\mathbf{w}$：

| $\mathbf{w}$ | $\mathbf{w}^\top\mathbf{w}$ | $q$ | $E_{\text{in}}$ |
|---|---|---|---|
| $\frac{1}{\sqrt{2}}(1, 1)$ | $1$ | $18$ | $0.5$ |
| $(1, 0)$ | $1$ | $10$ | $2.5$ |
| $\frac{1}{\sqrt{2}}(1, -1)$ | $1$ | $2$ | $4.5$ |
| $(0.5, 0.5)$ | $0.5$ | $9$ | $1.625$ |
| $(1, 1)$ | $2$ | $36$ | $5$ |

方向選錯（第二、三列）或長度不對（第四、五列），誤差都比較大。$(1, 1)$ 方向是對的，但長度是 $\sqrt{2}$，重建出來的向量被放大成兩倍，誤差 5 和完全不重建（$\mathbf{w} = \mathbf{0}$）一樣差。

**這個結果代表什麼。** 最佳的線性 autoencoder 把每個點投影到 $(1, 1)$ 這條線上，保留座標和、放掉座標差，每個點的誤差是 0.5。前面那個帶 $\tanh$ 的 2-1-2 autoencoder 用的是同一個方向，誤差也是 0.5。它的解碼是線性的，重建出來的點只能落在一條直線上，所以不會比這裡的最佳直線更好。

投影還有去雜訊的效果，呼應 denoising 那一節講義說的「$\mathbf{g}(\tilde{\mathbf{x}})$ 是去雜訊後的版本」。取線上的點 $\mathbf{x} = (1.5, 1.5)$，加上垂直於這條線的雜訊得到 $\tilde{\mathbf{x}} = (1.8, 1.2)$，$\mathrm{W}\mathrm{W}^\top\tilde{\mathbf{x}} = (1.5, 1.5)$，雜訊完全被去掉。沿著線的雜訊就去不掉：$(1.8, 1.8)$ 投影後還是 $(1.8, 1.8)$。

用 numpy 驗算（`np.linalg.eigh` 回傳的 eigenvalue 由小到大排）：

```python
import numpy as np

X = np.array([[2, 1], [1, 2], [-2, -1], [-1, -2]], dtype=float)

eigval, eigvec = np.linalg.eigh(X.T @ X)
W = eigvec[:, [-1]]                       # 最大 eigenvalue 對應的那一行
E_in = np.mean(np.sum((X - X @ W @ W.T) ** 2, axis=1))

print(eigval)           # [ 2. 18.]
print(np.abs(W.T))      # [[0.70710678 0.70710678]]
print(X @ W @ W.T)      # 四列依序是 (1.5, 1.5)、(1.5, 1.5)、(-1.5, -1.5)、(-1.5, -1.5)
print(E_in)             # 0.5（浮點誤差範圍內）
```

eigenvector 的正負號不唯一，$\mathbf{w}$ 與 $-\mathbf{w}$ 給出同一個 $\mathrm{W}\mathrm{W}^\top$，所以程式裡取絕對值再印。

### PCA：先減平均，再做同一件事

第 22 頁把演算法寫出來，標題是 Linear Autoencoder or PCA。投影片上第 1 步的式子與第 3 步的 $-\bar{\mathbf{x}}$ 標成紅色，和標題裡的 PCA 同色，表示這兩處是 PCA 才有的：

1. 令 $\bar{\mathbf{x}} = \frac{1}{N}\sum_{n=1}^{N}\mathbf{x}_n$，並把每個 $\mathbf{x}_n$ 換成 $\mathbf{x}_n - \bar{\mathbf{x}}$。
2. 算出 $\mathrm{X}^\top\mathrm{X}$ 最大的 $\tilde{d}$ 個 eigenvalue 對應的 eigenvector $\mathbf{w}_1, \mathbf{w}_2, \dots, \mathbf{w}_{\tilde{d}}$。
3. 回傳特徵轉換 $\boldsymbol{\Phi}(\mathbf{x}) = \mathrm{W}(\mathbf{x} - \bar{\mathbf{x}})$。

拿掉紅字的部分（不減平均），是線性 autoencoder；加上去就是統計裡的主成分分析（principal component analysis，PCA）。

第 3 步的寫法有一個要留意的地方。照第 18 頁的定義，$\mathrm{W}$ 是 $d \times \tilde{d}$ 的矩陣，把 $d$ 維的 $\mathbf{x}$ 編成 $\tilde{d}$ 維的是 $\mathrm{W}^\top\mathbf{x}$。課堂上口頭說的也是資料透過 $\mathrm{W}$ 的轉置轉換之後送出去。所以第 22 頁的 $\mathrm{W}(\mathbf{x} - \bar{\mathbf{x}})$，要讀成「以各個 $\mathbf{w}_j$ 為列」的那個矩陣；用第 18 頁的記號寫就是 $\boldsymbol{\Phi}(\mathbf{x}) = \mathrm{W}^\top(\mathbf{x} - \bar{\mathbf{x}})$。

講義接著對照兩者的目標：

- 線性 autoencoder：最大化 $\sum(\text{投影後的大小})^2$。
- PCA：最大化 $\sum(\text{投影後的變異數})$。

課堂上的說明是：變異數是相對於平均的差距的平方，所以先把資料平移成平均為零向量，再套線性 autoencoder，自然就得到讓投影後變異數最大的方向。得到方向之後，課堂上說有兩種用法：直接拿原始資料投影到這些方向上，或是回傳減掉平均之後再投影的結果，後者等於先把資料平移再投影。第 3 步紅字的 $-\bar{\mathbf{x}}$ 寫的是後一種。

本文把這兩句話的關係寫成式子。對任何單位向量 $\mathbf{v}$，記投影值 $p_n = \mathbf{v}^\top\mathbf{x}_n$，它的平均是 $\bar{p} = \mathbf{v}^\top\bar{\mathbf{x}}$。把 $p_n$ 寫成 $(p_n - \bar{p}) + \bar{p}$ 再平方加總，交叉項 $2\bar{p}\sum_n(p_n - \bar{p})$ 是 0：

$$
\sum_{n=1}^{N}(\mathbf{v}^\top\mathbf{x}_n)^2 = \underbrace{\sum_{n=1}^{N}\big(\mathbf{v}^\top(\mathbf{x}_n - \bar{\mathbf{x}})\big)^2}_{N \times \text{投影後的變異數}} + \underbrace{N\,(\mathbf{v}^\top\bar{\mathbf{x}})^2}_{\text{平均造成的部分}}
$$

線性 autoencoder 最大化左邊的全部，PCA 只最大化右邊的第一項。資料的平均是零向量時第二項消失，兩者相同；平均離原點很遠時，第二項會主導，線性 autoencoder 選出的方向會被拉向平均所在的方向。

**數值例子（本文自擬）。** 把剛才的四個點都加上 $(2, -2)$：

$$
(4, -1),\quad (3, 0),\quad (0, -3),\quad (1, -4)
$$

點與點的相對位置沒變，平均變成 $\bar{\mathbf{x}} = (2, -2)$。

- **不減平均（線性 autoencoder）。** $\mathrm{X}^\top\mathrm{X} = \begin{bmatrix} 26 & -8 \\ -8 & 26 \end{bmatrix}$，eigenvalue 是 34 與 18，最大的對應 $\frac{1}{\sqrt{2}}(1, -1)$。四個點在這個方向的投影值是 $\frac{5}{\sqrt{2}}, \frac{3}{\sqrt{2}}, \frac{3}{\sqrt{2}}, \frac{5}{\sqrt{2}}$，平方和是 34，變異數只有 0.5。重建誤差是每個點 4.5。
- **先減平均（PCA）。** 減完就是原來那四個點，方向是 $\frac{1}{\sqrt{2}}(1, 1)$，投影值是 $\pm\frac{3}{\sqrt{2}}$，變異數是 4.5。用 $\bar{\mathbf{x}} + \mathbf{w}\mathbf{w}^\top(\mathbf{x} - \bar{\mathbf{x}})$ 重建，誤差是每個點 0.5。

用上面的等式檢查第一種情況：$34 = 4 \times 0.5 + 4 \times (\mathbf{v}^\top\bar{\mathbf{x}})^2 = 2 + 4 \times 8$。34 裡面有 32 來自平均，只有 2 來自資料本身的變化。不減平均時選到的方向指向資料的平均，資料真正散開的方向 $(1, 1)$ 沒被選到。

講義的結語是兩者都能做線性降維（linear dimension reduction），對資料處理有用，不過 PCA 比較常用。課堂上說 PCA 有統計上的背景，所以比較紅；也舉了用途：原本一萬維的資料算不動，可以先線性地降到三百維再做後面的事。

### Fun Time：最佳的目標值是多少

**題目（第 23 頁）：** 解下面的最佳化問題時

$$
\max_{\mathbf{v}}\ \sum_{n=1}^{N}\mathbf{v}^\top\mathbf{x}_n\mathbf{x}_n^\top\mathbf{v}\qquad \text{subject to}\quad \mathbf{v}^\top\mathbf{v} = 1
$$

我們知道最佳的 $\mathbf{v}$ 是 $\mathrm{X}^\top\mathrm{X}$ 最大的 eigenvalue $\lambda$ 對應的 eigenvector。這個最佳化問題的最佳目標值是多少？

1. $\lambda^1$
2. $\lambda^2$
3. $\lambda^3$
4. $\lambda^4$

**答案：1。** 講義的解答是：目標值就是 $\mathbf{v}^\top\mathrm{X}^\top\mathrm{X}\mathbf{v}$，它等於 $\lambda\mathbf{v}^\top\mathbf{v}$，而 $\mathbf{v}^\top\mathbf{v}$ 是 1。完整寫出來：$\mathrm{X}^\top\mathrm{X}\mathbf{v} = \lambda\mathbf{v}$，兩邊左乘 $\mathbf{v}^\top$，得到 $\mathbf{v}^\top\mathrm{X}^\top\mathrm{X}\mathbf{v} = \lambda\mathbf{v}^\top\mathbf{v} = \lambda$。課堂上補了一句：這就是為什麼要選 $\lambda$ 最大的那個 $\mathbf{v}$。

其他選項都多乘了 $\lambda$。本文用四個點的例子驗算：$\mathbf{v} = \frac{1}{\sqrt{2}}(1, 1)$ 時目標值是四個投影值的平方和 $4 \times 4.5 = 18$，正是 $\lambda_1 = 18$，不是 $18^2 = 324$。

第 24 頁的總結把四節各收成一句：深層網路是困難的階層式特徵萃取問題；autoencoder 是用神經網路做非監督式的表示學習；denoising autoencoder 用雜訊當提示來做正則化；PCA 是線性 autoencoder 的變形，用於資料處理。下一堂的預告是 extracting 'prototype' instead of pattern。課堂上的說法是，這兩堂講的是層層萃取特徵，下一堂換一種方式，從資料裡找出一些代表。

## 自我檢查

**1. 四筆二維資料 $(3, 1)$、$(1, 3)$、$(-1, -3)$、$(-3, -1)$，平均是零向量。取 $\tilde{d} = 1$，手算最佳的 $\mathbf{w}$、$(3, 1)$ 的編碼與重建，以及 $E_{\text{in}}$。**

答案：$\mathrm{X}^\top\mathrm{X} = \begin{bmatrix} 20 & 12 \\ 12 & 20 \end{bmatrix}$，eigenvalue 是 $20 \pm 12$，也就是 32 與 8。最大的對應 $\mathbf{w} = \frac{1}{\sqrt{2}}(1, 1)$。$(3, 1)$ 的編碼是 $\mathbf{w}^\top\mathbf{x} = \frac{4}{\sqrt{2}} = 2\sqrt{2} \approx 2.828$，重建是 $(2, 2)$，誤差是 $1 + 1 = 2$。$E_{\text{in}} = \lambda_2 / N = 8/4 = 2$。

**2. 一個 400-50-10-1 的網路要用 autoencoder 逐層預訓練。第二個 autoencoder 的訓練資料是什麼？它的結構是什麼、有幾個權重、留下幾個？照 Fun Time 的假設，預訓練總共要幾秒？**

答案：訓練資料是 $N$ 筆資料通過第一層（已預訓練好並固定）之後的輸出 $\mathbf{x}_n^{(1)}$，每筆 50 維，不需要標籤。結構是 50-10-50，編碼權重 $51 \times 10 = 510$ 個、解碼權重 $11 \times 50 = 550$ 個，共 1060 個，留下 510 個當 $w^{(2)}$。總時間是 $c(400 \times 50 + 50 \times 10 + 10 \times 1) = 20510c$ 秒。

**3. 線性 autoencoder 為什麼要假設 $\tilde{d} < d$？如果 $\tilde{d} = d$，最佳的 $E_{\text{in}}$ 是多少，學到了什麼？**

判準：答案要說出 $\tilde{d} = d$ 時可以取 $\mathrm{W}$ 為正交矩陣（例如 $\mathrm{I}$），使 $\mathrm{W}\mathrm{W}^\top = \mathrm{I}$、$E_{\text{in}} = 0$；用 $\Gamma$ 的語言說，就是對角線上 $d$ 個位置都可以放 1，$\mathrm{I} - \Gamma$ 全是 0。這個解對任何資料都成立，沒有用到資料的任何結構，所以什麼都沒學到。

**4. 一維資料 $x \in \{-1, 1\}$，每筆做出 $\tilde{x} = x \pm 0.5$ 兩個帶雜訊的版本，用 $g(\tilde{x}) = a\tilde{x}$ 當 denoising autoencoder。最佳的 $a$ 是多少？跟不加雜訊時差在哪裡？**

答案：四筆訓練資料是 $(-1.5, -1)$、$(-0.5, -1)$、$(0.5, 1)$、$(1.5, 1)$。$\sum\tilde{x}x = 1.5 + 0.5 + 0.5 + 1.5 = 4$，$\sum\tilde{x}^2 = 2.25 + 0.25 + 0.25 + 2.25 = 5$，$a = 4/5 = 0.8$。用懲罰項的寫法檢查：$x^2$ 的平均是 1，雜訊的變異數是 0.25，平均誤差是 $(a-1)^2 + 0.25a^2$，微分得 $a = 1/1.25 = 0.8$。不加雜訊時 $a = 1$；加了雜訊之後權重縮小，縮小的幅度由雜訊的變異數決定。

**5. $d = 3$、$\tilde{d} = 2$，某個固定的 $\mathrm{V}$ 讓 $c_1 = 7$、$c_2 = 5$、$c_3 = 1$。最佳的 $\Gamma$ 是什麼？這時 $\sum_n \lVert\mathbf{x}_n - \mathrm{W}\mathrm{W}^\top\mathbf{x}_n\rVert^2$ 是多少？如果改用 $\Gamma = \text{diag}(0.5, 1, 0)$ 呢？**

答案：最多兩個位置可以不是 0，放在 $c_j$ 最大的兩個位置並取 1：$\Gamma = \text{diag}(1, 1, 0)$。誤差總和是 $\sum_j (1 - \gamma_j)^2 c_j = 0 + 0 + 1 = 1$。改用 $\text{diag}(0.5, 1, 0)$ 是 $0.25 \times 7 + 0 + 1 = 2.75$，比較差：留下來的分量只要被縮放，就多出誤差。

## 練習與對應閱讀

**兩個學期的對應週次。**

| 版本 | 週次 | 投影片 | LFD（課程頁標示） |
|---|---|---|---|
| MOOC | 技法第 13 堂 | 213 | 未標 |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | W13（11/25），和技法第 12 堂同一週 | [213u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/213u_handout.pdf) | e-7.6 |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | W15（12/16），排在 W14 期末考之後 | 213u 在 2026-09-30 還是 404，尚未公開 | 同上 |

**教科書。** [Learning from Data](http://amlbook.com)（LFD）的 e-Chapter 7 是教科書的線上章節，不在紙本書裡，取得方式見 amlbook.com。

**作業。** 這一週對應的是 [Fall 2024 HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)（2024-12-02 發布、12-16 截止）。本系列整理過的相關題目是 Q4、Q9 與 bonus Q13，三題練的都是上一堂的內容（權重個數、初始值、XOR），說明放在[技法第 12 堂：神經網路](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning)那一篇。整份作業的導讀在[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

**自己動手。** 找一份小資料，分別用 numpy 的 `np.linalg.eigh(X.T @ X)` 和 scikit-learn 的 `PCA` 算出前兩個主成分，看減不減平均會讓結果差多少。這就是講義第 22 頁第一步的差別，本文平移 $(2, -2)$ 的例子可以當作對答案用的測資。

**這堂之後的發展。** 逐層預訓練是這堂錄影當時的做法。林軒田在 Fall 2024 另外補了 302u、303u 兩份 modern deep learning 投影片，本系列放在[技法第 16 堂：Finale](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning)那一篇。

**延伸閱讀。** 以下站內文章和這堂有重疊，可以對照另一種講法：

- [Harvard CS181 HW4：Autoencoder 與 VAE](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae)：別校以 autoencoder 為主題的作業。
- [CMU 11-785 深度學習導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)：用一整門課講完深度學習。
- [Stanford CS230 導讀](/series/cs230)：偏重深度學習專案實務。
- [MIT 6.7960 導讀](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)：研究所等級的深度學習。
- [台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)：台大的平行路線，偏深度學習與生成式 AI。

**下一堂。** [技法第 14 堂：RBF 網路](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization)換一種萃取特徵的方式，從資料裡找出代表點（prototype），用「離代表點多近」當特徵。

## 課程影片來源

原始影片：[Deep Neural Network](https://www.youtube.com/watch?v=H1czfox0Nog)、[Autoencoder](https://www.youtube.com/watch?v=eBVPQ4fgs_k)、[Denoising Autoencoder](https://www.youtube.com/watch?v=gx2Vfw8S--0)、[Principal Component Analysis](https://www.youtube.com/watch?v=Bgc4UY8567A)

- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：系列改為一堂一篇，這篇是新拆出的一堂，依講義與影片逐字稿寫成。

## 參考資料

- [技法第 13 堂講義 213_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/213_handout.pdf)：本文的主要底本，四節的內容、線性 autoencoder 的推導、四題 Fun Time 與各頁的圖都出自這份講義。
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：W13 的排程、213u 投影片與 LFD e-7.6 的標示。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：W14 期末考與 W15 的排程。
- [Fall 2024 Homework 7（hw7.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)：這一週對應的作業。
- [Learning from Data 教科書網站](http://amlbook.com)：e-Chapter 7 的出處。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。

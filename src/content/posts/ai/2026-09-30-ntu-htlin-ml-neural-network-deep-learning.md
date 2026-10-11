---
title: "林軒田機器學習技法 T12–T13：神經網路與深度學習（autoencoder、PCA）"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, neural-networks, backpropagation, pca, dimensionality-reduction]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 14
tldr: "技法第 12、13 講開啟第三段「萃取隱藏特徵」。T12 從「perceptron 的線性組合」出發：兩層就能做 AND、OR，但做不出 XOR，多疊一層才行，這就是多層感知器；接著用 tanh 取代 sign、推導 backprop，再講非凸最佳化、d_vc = O(VD)、weight elimination 與 early stopping。T13 談 deep NN 的挑戰，把 autoencoder 當成「保留資訊的編碼」做逐層預訓練，把 denoising 當成正則化，最後證明線性 autoencoder 的最佳解就是 XᵀX 的前幾個特徵向量，也就是 PCA。這兩講錄於 2016 年，現代 DL 的補充在 Fall 2024 的 302u／303u。練習：Fall 2024 HW7 Q4、Q9 與 bonus Q13。"
description: "台大林軒田《機器學習技法》第 12 講 Neural Network 與第 13 講 Deep Learning 導讀：aggregation of perceptrons 到多層感知器、NNet 假說與 tanh、backprop 推導、最佳化與 VC 維度、weight decay／weight elimination／early stopping、deep NN 的挑戰與預訓練、basic 與 denoising autoencoder、線性 autoencoder 與 PCA，附 LFD e-7 章節、Fall 2024 HW7 對應題，以及站內 11-785、CS230、MIT 6.7960 延伸閱讀。"
draft: false
glossary:
  - term: "backpropagation"
    aliases: ["backprop", "反向傳播"]
    definition: "先正向算出每一層的輸出 x^(ℓ)，再從輸出層往回算每個神經元的 δ_j^(ℓ) = ∂e_n/∂s_j^(ℓ)，梯度就是 x_i^(ℓ−1)·δ_j^(ℓ)。"
    context: "T12 用它有效率地算出 NNet 所有權重的梯度，再做（mini-batch）SGD。"
  - term: "autoencoder"
    aliases: ["自編碼器", "denoising autoencoder"]
    definition: "d—d̃—d 的神經網路，目標是讓輸出 g(x) ≈ x。中間層就是一種保留資訊的表示；denoising 版本改用加了雜訊的 x̃ 當輸入、原本的 x 當目標。"
    context: "T13 把它當成深度網路逐層預訓練的工具，並把 denoising 解讀成用人工雜訊做正則化。"
  - term: "PCA"
    aliases: ["principal component analysis", "主成分分析"]
    definition: "先把資料減去平均，再取 XᵀX 前 d̃ 大特徵值對應的特徵向量當投影方向，做線性降維。"
    context: "T13 把它推導成「權重綁定、沒有偏差項的線性 autoencoder」的最佳解。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文以 [MOOC 版](https://www.csie.ntu.edu.tw/~htlin/mooc/)《機器學習技法》為核心教材：[212_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/212_handout.pdf)（Neural Network）、[213_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/213_handout.pdf)（Deep Learning）與[技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)第 46–53 支。教科書章節依 [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)所標的 [LFD](http://amlbook.com) e-Chapter 7。作業對照 [Fall 2024 HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)。事實皆於 2026-09-30 打開核對。存取等級：MOOC 本身 **A2**，加上 Fall 2024 作業 PDF 是 **A3（評分鏈除外）**——沒有官方解答，Gradescope 與 NTU COOL 限修課生。

**系列位置**：上一篇 [決策樹、隨機森林與梯度提升樹](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt)｜下一篇 [RBF 網路、k-means 與矩陣分解](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization)｜[系列總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)

技法的第一段用 kernel 塞進大量特徵，第二段用 aggregation 組合預測特徵。第三段「Distilling Implicit Features: Extraction Models」換了一個方向：不再由人決定特徵，而是讓模型自己從資料裡**萃取**出隱藏的特徵。T12–T15 的四個模型（神經網路、深度學習、RBF 網路、矩陣分解）都是這個主題的變奏。

這一篇讀的兩講有一個時代背景要先講清楚：錄影在 2016 年上傳，當時深度學習剛「在近年受到關注」（投影片原話），所以 T13 的主角是逐層預訓練與 autoencoder，而不是現在常見的 ReLU、Adam 或 Transformer。林軒田在 Fall 2024 另外補了 302u、303u 兩份 modern deep learning 投影片，本系列放在[第 16 篇](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning)。

## 課程影片來源

以下影片已於 2026-10-10 對照林軒田官方 MOOC 頁與兩份官方免費 YouTube 播放清單（講次與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=GwRS2YJv2Ck
title: Motivation
```

```youtube
url: https://www.youtube.com/watch?v=giOcWMbi1bU
title: Neural Network Hypothesis
```

原始影片：[Motivation](https://www.youtube.com/watch?v=GwRS2YJv2Ck)、[Neural Network Hypothesis](https://www.youtube.com/watch?v=giOcWMbi1bU)、[Neural Network Learning](https://www.youtube.com/watch?v=Z26n4YGNWvQ)、[Optimization and Regularization](https://www.youtube.com/watch?v=z2tHzMzoOOs)、[Deep Neural Network](https://www.youtube.com/watch?v=H1czfox0Nog)、[Autoencoder](https://www.youtube.com/watch?v=eBVPQ4fgs_k)、[Denoising Autoencoder](https://www.youtube.com/watch?v=gx2Vfw8S--0)、[Principal Component Analysis](https://www.youtube.com/watch?v=Bgc4UY8567A)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-10。

## 在課表上的位置

| 版本 | 週次 | 投影片 | LFD（課程頁標示） |
|---|---|---|---|
| MOOC | 技法 T12、T13 | 212、213 | — |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | W13（11/25） | [212u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/212u_handout.pdf)、[213u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/213u_handout.pdf) | 212u：e-7.1、e-7.2、e-7.3、e-7.4（selected parts）；213u：e-7.6 |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | W15（12/16），排在 W14 期末考之後 | 212u、213u 目前 404，尚未公開 | 同上 |

LFD 的 e-Chapter 是教科書的線上章節，不在紙本書裡；取得方式見 [amlbook.com](http://amlbook.com)。

## T12 Neural Network

影片：[Motivation](https://www.youtube.com/watch?v=GwRS2YJv2Ck)、[Neural Network Hypothesis](https://www.youtube.com/watch?v=giOcWMbi1bU)、[Neural Network Learning](https://www.youtube.com/watch?v=Z26n4YGNWvQ)、[Optimization and Regularization](https://www.youtube.com/watch?v=z2tHzMzoOOs)

### 從 perceptron 的線性組合開始

T12 接著上一段的語言：G(x) = sign(Σ α_t·sign(w_tᵀx))，就是把 perceptron 當 g_t 做線性 aggregation。它有兩層權重（w_t 與 α），兩層 sign 函數。

這樣的 G 能畫出什麼邊界？投影片先示範邏輯運算：G(x) = sign(−1 + g_1(x) + g_2(x)) 只有在 g_1、g_2 都是 +1 時才輸出 +1，就是 AND；OR、NOT 也能用類似的方式做出來。

接著是能力與限制。投影片用 8 個、16 個 perceptron 逼近一個平滑的目標邊界，perceptron 夠多就能逼近任何平滑的邊界；基石講過凸集合假說的 d_vc 是無限大。但它做不出 XOR(g_1, g_2)，因為在 φ(x) = (g_1(x), g_2(x)) 的空間裡 XOR 不是線性可分。

解法是再多疊一層轉換：XOR(g_1, g_2) = OR(AND(−g_1, g_2), AND(g_1, −g_2))。這就是多層感知器。投影片的遞進是：perceptron（簡單）→ perceptron 的 aggregation（強大）→ 多層感知器（更強大）。它也提到神經網路是受生物神經元啟發的模型，但只是啟發。

### NNet 假說：輸出層是線性模型，隱藏層用 tanh

輸出層就是一個線性模型，s = wᵀφ^(2)(φ^(1)(x))。基石學過的三個線性模型都能接上：sign 配 0/1 誤差、恆等函數配平方誤差、logistic 配 cross-entropy。T12 之後都以平方誤差的迴歸來講。

隱藏層的轉換函數要選什麼？全部用線性，整個網路就是線性的，沒什麼用；用 sign 是離散的，很難對 w 最佳化。常見選擇是 **tanh**：它是 sign 的「類比」近似，容易最佳化，也比較接近生物神經元。tanh(s) = (exp(s) − exp(−s))/(exp(s) + exp(−s)) = 2θ(2s) − 1，θ 是基石的 logistic 函數。

一個 d^(0)-d^(1)-…-d^(L) 的網路，每一層 ℓ 的分數 s_j^(ℓ) = Σ_i w_ij^(ℓ) x_i^(ℓ−1)，隱藏層輸出 x_j^(ℓ) = tanh(s_j^(ℓ))，輸出層直接取 s。物理意義是：每一層都在做一次從資料學出來的轉換，檢查 x 是否「符合」權重向量代表的樣式。投影片的一句話總結是「用一層層連接權重做樣式萃取」。

### Backprop：有效率地算梯度

目標是找所有 w_ij 讓 E_in 最小。只有一層隱藏層時，它就是 perceptron 的 aggregation，可以用 gradient boosting 一個一個決定隱藏神經元；多層就沒這麼容易。所以對每個樣本的誤差 e_n = (y_n − NNet(x_n))² 做（隨機）梯度下降，關鍵是算出 ∂e_n/∂w_ij^(ℓ)。

<details>
<summary>推導：δ 從輸出層往回傳</summary>

**輸出層**（ℓ = L）：e_n = (y_n − s_1^(L))²，所以

∂e_n/∂w_i1^(L) = −2(y_n − s_1^(L))·x_i^(L−1)

**一般層**：用連鎖律拆成 ∂e_n/∂w_ij^(ℓ) = δ_j^(ℓ)·x_i^(ℓ−1)，其中 δ_j^(ℓ) = ∂e_n/∂s_j^(ℓ)。輸出層 δ_1^(L) = −2(y_n − s_1^(L))。

**往回算 δ**：s_j^(ℓ) 經過 tanh 變成 x_j^(ℓ)，再透過 w_jk^(ℓ+1) 影響下一層所有的 s_k^(ℓ+1)，所以

δ_j^(ℓ) = Σ_k δ_k^(ℓ+1)·w_jk^(ℓ+1)·tanh′(s_j^(ℓ))

每一層的 δ 都能從下一層的 δ 算出來。

</details>

Backprop 演算法就四步：隨機挑一個 n；正向算出所有 x_i^(ℓ)；反向算出所有 δ_j^(ℓ)；做梯度下降 w_ij^(ℓ) ← w_ij^(ℓ) − η·x_i^(ℓ−1)·δ_j^(ℓ)。投影片補充：前三步有時會（平行地）做很多次，取 x_i^(ℓ−1)δ_j^(ℓ) 的平均來更新，這叫 mini-batch。

### 最佳化與正則化

**最佳化很難，但實務上可行**。多層隱藏層時 E_in 通常是非凸的，GD／SGD 加上 backprop 只能到局部最小值，不同的初始權重會落到不同的局部最小值。權重太大會讓 tanh 飽和、梯度變小。投影片的建議是：試幾組隨機而且小的初始值。

**VC 維度**。用 tanh 這類轉換函數時，大致上 d_vc = O(VD)，V 是神經元數、D 是權重數。神經元夠多就能逼近「任何東西」，但也可能 overfit。

**正則化**的幾種選擇：

- **weight decay（L2）**：大權重縮得多、小權重縮得少，但不會真的變成 0。
- **L1**：能讓權重變成 0 來降低 d_vc，但不可微分。
- **weight elimination**：L2 的縮放版，Σ (w_ij)² / (1 + (w_ij)²)，大權重和小權重都縮一個中等的量。
- **early stopping**：GD／SGD 走越多步，看過的權重組合越多，等效的 d_vc 就越大。在中途停下來，等於控制模型複雜度。什麼時候停？用 validation。

## T13 Deep Learning

影片：[Deep Neural Network](https://www.youtube.com/watch?v=H1czfox0Nog)、[Autoencoder](https://www.youtube.com/watch?v=eBVPQ4fgs_k)、[Denoising Autoencoder](https://www.youtube.com/watch?v=gx2Vfw8S--0)、[Principal Component Analysis](https://www.youtube.com/watch?v=Bgc4UY8567A)

### 淺層與深層

每一層都在萃取樣式特徵，那要幾個神經元、幾層？投影片的答案是：主觀上由你設計，客觀上也許用 validation。結構決策是應用 NNet 的關鍵問題。

投影片的比較：

| 淺層 NNet | 深層 NNet |
|---|---|
| 訓練比較有效率 | 訓練有挑戰 |
| 結構決策比較簡單 | 結構決策比較複雜 |
| 理論上就已經夠強 | 「任意地」強 |
| — | 可能比較「有意義」 |

「有意義」的例子是手寫數字辨識：第一層從像素萃取筆畫，後面的層再組合成部件、數字。每一層的負擔變輕，由簡單特徵往複雜特徵走，對視覺、語音這類原始特徵很難用的任務特別自然。

深度學習的四個挑戰與對應技巧：

- **結構難決定**：靠領域知識，例如影像用 convolutional NNet。
- **模型複雜度高**：資料夠大就不太擔心；另外用讓模型容忍雜訊的正則化，例如 dropout（網路被破壞時仍能運作）與 denoising（輸入被破壞時仍能運作）。
- **最佳化難**：小心初始化來避開差的局部最小值，叫做預訓練（pre-training）。
- **計算量大**：新硬體與架構，例如 GPU 上的 mini-batch。

林軒田的個人看法（投影片寫 IMHO）是：小心的正則化與初始化是關鍵技巧。所以 T13 其餘三節就講一個最簡單的預訓練方法，加上一個正則化方法。

### Autoencoder：學一個近似恆等函數的網路

一個兩步驟的深度學習框架：先由淺到深逐層預訓練權重（前面的層固定），再用 backprop 在整個網路上微調。

預訓練要朝什麼方向？好的權重應該是**保留資訊的編碼**：下一層用不同的表示方式，但保有同樣的資訊，也就是編碼後能準確解碼回來。

這就是 autoencoder：一個 d—d̃—d 的網路，目標是 g_i(x) ≈ x_i，w_ij 是編碼權重、w_ji 是解碼權重。學一個近似恆等函數有什麼用？

- 對監督式學習：資料的隱藏結構可以當作合理的轉換 Φ(x)，學到「有資訊量」的表示。
- 對非監督式學習：g(x) ≈ x 的地方代表結構吻合，可以做密度估計；g(x) 跟 x 差很多的就是離群值。

基本的 autoencoder 用平方誤差 Σ_i (g_i(x) − x_i)²，backprop 直接適用，淺而容易訓練；通常 d̃ < d，得到壓縮的表示。資料是 {(x_n, y_n = x_n)}，所以常被歸為非監督式學習。有時會限制 w_ij^(1) = w_ji^(2) 當作正則化。

用 autoencoder 做預訓練：第 ℓ 層的權重，就是在上一層的輸出 x_n^(ℓ−1) 上訓練一個 d̃ = d^(ℓ) 的基本 autoencoder。投影片也提醒，許多成功的預訓練方法用的是架構和正則化更講究的 autoencoder。

### Denoising autoencoder：用雜訊當提示

深度網路模型複雜度高，需要正則化：結構限制、weight decay 或 weight elimination、early stopping，這些都是老朋友。T13 再加一個新的。

回到基石 L13 的 overfitting 成因：資料少、雜訊多、模型能力過強，三者都會讓 overfit 變嚴重。怎麼處理雜訊？直接的做法是清理資料；投影片提出一個「狂野」的做法：**主動在資料上加雜訊**。

想法是：一個穩健的 autoencoder 不只要 g(x) ≈ x，就算 x̃ 跟 x 有點不同，也要 g(x̃) ≈ x。所以 denoising autoencoder 就是在 {(x̃_n, y_n = x_n)} 上訓練基本 autoencoder，x̃_n = x_n + 人工雜訊。它在深度學習裡常取代基本 autoencoder，也能拿來做影像去雜訊。投影片的結論是：人工雜訊（hint）本身就是一種正則化，對其他 NNet 或模型也實用。

### 線性 autoencoder 就是 PCA

最後一節問：如果 autoencoder 是線性的呢？投影片的理由是「先試線性」：也許更有效率、更不容易 overfit。

加上三個條件：去掉 x_0（輸入與輸出維度一樣）、綁定權重 w_ij^(1) = w_ji^(2)、d̃ < d（確保解不是恆等函數）。假說變成 h(x) = WWᵀx，W 是 d × d̃ 的矩陣，E_in(W) = (1/N) Σ_n ‖x_n − WWᵀx_n‖²。

這是 w 的四次多項式，不容易直接解。投影片的做法是用線性代數換個角度看：

<details>
<summary>推導：最佳的 W 是 XᵀX 的前 d̃ 個特徵向量</summary>

把 WWᵀ 做特徵分解 VΓVᵀ：V 是 d × d 正交矩陣，Γ 是對角矩陣、最多 d̃ 個非零值。所以 WWᵀx_n 可以讀成三步：Vᵀ 旋轉（或鏡射）到新基底、Γ 把至少 d − d̃ 個分量設成 0 並縮放其他分量、V 再轉回來。而 x_n = VIVᵀx_n。

**最佳的 Γ**：旋轉不影響長度，所以要最小化 ‖(I − Γ)(某個向量)‖²，希望 I − Γ 裡越多 0 越好。在 rank ≤ d̃ 的限制下，最佳的 Γ 是 d̃ 個對角元素為 1、其餘為 0。

**最佳的 V**：問題變成最大化投影後保留的長度。d̃ = 1 時，只有 Vᵀ 的第一列 v 有影響：

max_v Σ_n vᵀx_n x_nᵀv，限制 vᵀv = 1

用拉格朗日乘數得到 Σ_n x_n x_nᵀ v = λv，所以最佳的 v 是 XᵀX 最大特徵值對應的特徵向量。一般的 d̃ 就取前 d̃ 個特徵向量。

</details>

完整的演算法：算平均 x̄、把每個 x_n 減掉 x̄、算 XᵀX 前 d̃ 個特徵向量 w_1…w_d̃，回傳特徵轉換 Φ(x) = W(x − x̄)。

投影片最後區分了兩者：線性 autoencoder 最大化投影後的長度平方，統計上的主成分分析（PCA）最大化投影後的變異數（演算法裡先減平均的那一步就是為此）。兩者都能做線性降維，PCA 比較常用。

## 用 Fall 2024 作業練習

[HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)（2024-12-02 發布、12-16 截止）裡跟這兩講相關的題目：

| 題 | 類型 | 練什麼 |
|---|---|---|
| Q4 | 自動批改 | 20 個輸入單元、3 個輸出單元、50 個隱藏單元（x_0 也算），隱藏層可以任意分層、相鄰層全連接，權重數最多是多少 |
| Q9 | 人工批改 | 一層隱藏層、所有神經元（含輸出）都用 tanh，所有初始權重都設為 0.5 時，證明 backprop（mini-batch GD）之後第一層的 w_ij^(1) = w_i,j+1^(1) |
| Q13（bonus） | 人工批改 | 題目附了一段 chatGPT 的回答，主張 d-(d−1)-1、以 sign 為轉換函數的前饋網路能實作 d 維 XOR；要你指出它和 2023 秋季 bonus 作業的結論哪裡分歧，並數學證明這不可能 |

Q9 值得和 T12「試幾組隨機而且小的初始值」的建議放在一起想。Q4 可以先寫一個小程式列舉所有分層方式驗算。沒有官方解答，Q13 需要你自己判斷 chatGPT 的論證哪一步出錯，這也是 Fall 2024 作業刻意設計的題型。完整的作業導讀見[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

## 自學怎麼用這兩講

1. 先看 T12 的 [Neural Network Learning](https://www.youtube.com/watch?v=Z26n4YGNWvQ)，把折疊裡的 δ 遞迴自己推一次，再用 numpy 寫一個 d-3-1 的 tanh 網路，跟數值微分比對梯度。
2. T13 的 autoencoder 與預訓練是 2016 年的主流做法，理解「為什麼當時需要預訓練」比記住步驟重要；現代訓練技巧請接著讀本系列[第 16 篇](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning)。
3. 今晚可以做的一件事：在任何一份小資料上，分別用 numpy 的 `np.linalg.eigh(X.T @ X)` 與 scikit-learn 的 `PCA` 算出前兩個主成分，確認減不減平均會讓結果差多少。這就是投影片最後那一張的差別。

## 延伸閱讀

以下站內系列和本篇有重疊，但本篇自己講完整，這裡只放連結：

- [CMU 11-785 深度學習導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)，特別是 [Lecture 5：反向傳播](/posts/ai/2026-08-22-cmu-11785-05-backpropagation)：用一整門課講完深度學習。
- [Stanford CS230 導讀](/series/cs230)：偏重深度學習專案實務。
- [MIT 6.7960 導讀](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)：研究所等級的深度學習。
- [台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)：台大的平行路線，偏深度學習與生成式 AI。
- [Harvard CS181 HW4：Autoencoder 與 VAE](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae)、[CMU 10-301 HW5：神經網路](/posts/learning/2026-08-22-cmu-10301-hw5-neural-networks)：其他學校的同主題作業。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方播放清單的講次相符。

## 參考資料

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — 技法 T12、T13 的小節標題與投影片
- [Lecture 12: Neural Network（212_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/212_handout.pdf) — perceptron aggregation、XOR、tanh、backprop、d_vc = O(VD)、weight elimination、early stopping
- [Lecture 13: Deep Learning（213_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/213_handout.pdf) — 淺層與深層比較、四個挑戰、autoencoder 預訓練、denoising、線性 autoencoder 與 PCA
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) — 第 46–53 支
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — W13 排程、212u／213u 投影片與 LFD e-7 章節標示
- [Fall 2024 Homework 7（hw7.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W14 期末考、W15 排程
- [Learning from Data 教科書網站](http://amlbook.com)
- 站內：[系列總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)

---
title: "林軒田機器學習技法 T16 Finale：整門課收成三類技巧，再用 Fall 2024 投影片補上現代深度學習"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, machine-learning, ai-course, course-guide, deep-learning, optimization]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 16
tldr: "技法 T16 把整門課重新分類成三類技巧：怎麼利用特徵（kernel、aggregation、extraction、低維壓縮）、怎麼最佳化（梯度、等價問題、拆成多步）、怎麼防過擬合（正則化、驗證），最後用四屆 KDD Cup 冠軍模型說明這些技巧在實務上怎麼組合。MOOC 錄於 2016 年，深度學習只講到 pre-training；Fall 2024 校內課用 302u（ReLU 家族、Xavier／He 初始化）、303u（momentum、RMSProp、Adam）、一場 2020 年的演講投影片 mlmai.ics 與 11 個模型的 1126 總整理補上。Fall 2026 同一批投影片排在 W16，目前還是 404。"
description: "台大林軒田《機器學習技法》第 16 講 Finale 導讀：Feature Exploitation、Error Optimization、Overfitting Elimination、Machine Learning in Practice 四節的分類表；加上 Fall 2024 校內課補充的 302u（activation 與 initialization）、303u（deep learning optimization）、mlmai.ics（Machine Learning for Modern AI 演講）與 1126（super short summary），以及每份投影片對應的原始論文。"
draft: false
glossary:
  - term: "He 初始化"
    aliases: ["He initialization", "Kaiming initialization"]
    definition: "ReLU 網路的權重初始化：零平均、變異數 2/d^(ℓ−1)，讓每層分數的變異數大致維持不變。Xavier 初始化是 tanh 網路的對應版本，變異數取 2/(d^(ℓ−1)+d^(ℓ))。"
    context: "林軒田 Fall 2024 補充投影片 302u 的最後三頁推導。"
    links:
      - label: "302u 投影片"
        url: "https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/302u_handout.pdf"
  - term: "Adam"
    aliases: ["Adaptive Moment Estimation"]
    definition: "SGD 的變形：用梯度的指數移動平均當方向（momentum），用梯度平方的移動平均調整每個分量的步長（RMSProp），再加上全域衰減。"
    context: "林軒田 Fall 2024 補充投影片 303u 把它寫成「momentum + RMSProp + global decay」。"
    links:
      - label: "303u 投影片"
        url: "https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/303u_handout.pdf"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)系列第 16 篇，接續[RBF 網路、k-means 與矩陣分解](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization)。範圍分兩塊：[《機器學習技法》](https://www.csie.ntu.edu.tw/~htlin/mooc/)第 16 講 Finale，以及 [Fall 2024 校內課](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)最後三週補上的四份投影片。

用到的官方材料：

- MOOC 投影片 [216_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/216_handout.pdf)（T16），[技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)的最後 4 支影片。
- Fall 2024 的 [302u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/302u_handout.pdf)、[303u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/303u_handout.pdf)、[mlmai.ics.handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/mlmai.ics.handout.pdf)、[1126_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/1126_handout.pdf)。

**存取等級**：四份 Fall 2024 投影片都能直接下載，但只有投影片，沒有錄影。Fall 2024 的 HW7 在 W14 公布，題目涵蓋到 T12 的 NN，沒有考 302u／303u 的內容，所以這一段是 A2。分級定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=WeLobtIDBzI
title: Feature Exploitation Techniques
```

```youtube
url: https://www.youtube.com/watch?v=En-EyzFipaw
title: Error Optimization Techniques
```

原始影片：[Feature Exploitation Techniques](https://www.youtube.com/watch?v=WeLobtIDBzI)、[Error Optimization Techniques](https://www.youtube.com/watch?v=En-EyzFipaw)、[Overfitting Elimination Techniques](https://www.youtube.com/watch?v=b6t22jVVC0s)、[Machine Learning in Practice](https://www.youtube.com/watch?v=jIpwy-mPvIA)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## 三個版本的收尾各不相同

同一門課的結尾，三個版本排得不一樣，先把它攤開：

| 版本 | 最後幾週的內容 |
|---|---|
| MOOC（2016） | T13 deep learning（pre-training 與 autoencoder）→ T14 RBF → T15 矩陣分解 → T16 Finale |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | W13（11/25）212u、213u → W14（12/02）modern deep learning：302u、303u → W15（12/09）停課，放 mlmai.ics 投影片 → W16（12/16）finale：1126 |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | W13（12/02）停課，放 mlmai.ics → W14（12/09）期末考 → W15（12/16）212u、213u → W16（12/23）modern deep learning 與 finale：302u、303u、1126 |

有兩件事值得注意。第一，兩個校內學期都沒有用 MOOC 的 216 投影片，finale 那週用的是 1126。第二，Fall 2026 的 302u、303u、1126、mlmai.ics 路徑在 2026-09-30 打開都是 404，要等排定的週次才會公開。本篇因此以 Fall 2024 版為準。

## MOOC T16：三類技巧

T16 沒有新內容，它把前 15 講的模型換一個軸重新分類。投影片最後一頁的總結只有三行：kernel、aggregation、extraction、low-dimensional；gradient、equivalence、stages；（大量的）regularization、validation。

### 第一類：怎麼利用特徵

第 2–5 頁用四張表回答「特徵 Φ 藏在哪裡」：

- **Kernel**：大量特徵嵌進 kernel 的內積裡。polynomial kernel 是縮放過的多項式轉換，Gaussian kernel 是無限維轉換，stump kernel 是以 decision stump 當轉換；kernel 相加是轉換的聯集，相乘是轉換的組合。用上它們的模型有 SVM、SVR、kernel ridge regression、kernel logistic regression、probabilistic SVM。
- **Aggregation**：每個 g<sub>t</sub> 本身就是一個有預測力的特徵 φ<sub>t</sub>(x)。基本單元可以是 decision stump、decision tree、Gaussian RBF；組合方式分三種：均勻（bagging、random forest）、不均勻（AdaBoost、gradient boost）、條件式（decision tree、nearest neighbor）。
- **Extraction**：特徵當成隱藏變數，和一般權重一起學，常借助非監督式學習。NN 萃取神經元權重，RBF 網路萃取中心，矩陣分解萃取使用者與電影因子；k-means 給出群中心，autoencoder 與 PCA 給出基底方向。
- **低維壓縮**：從原始特徵壓出低維特徵。autoencoder／PCA 是保留資訊的壓縮，decision stump 與樹的分支是「最好的」單維投影，random forest 的樹分支是「隨機的」低維投影，矩陣分解是從抽象特徵到具體特徵的投影，feature selection 則是「最有幫助的」低維投影。

### 第二類：怎麼最佳化

第 7–9 頁分三種策略：

1. **梯度下降**：只要 ∇E 大致定義得出來，就用一階近似「新變數 = 舊變數 − η∇E」。SGD／minibatch／GD 用在 kernel logistic regression、NN（backprop）、矩陣分解；steepest descent 與 functional GD 用在 AdaBoost 和 gradient boost。
2. **換成等價問題**：原問題難解時找等價解。dual SVM 靠 convex QP，kernel logistic 與 kernel ridge regression 靠 representer theorem，PCA 等價於特徵值問題。
3. **拆成多步**：把難題拆成較容易的子問題。多階段：probabilistic SVM、linear blending、stacking、RBF 網路、DeepNet pre-training；交替最佳化：k-means、交替最小平方；各個擊破：decision tree。

第 10 頁的 Fun Time 剛好把三種串起來：在 PCA 處理過的資料上跑 T13 的 DeepNet，三種都用到了。訓練用 minibatch GD，PCA 用特徵值問題的等價解，pre-training 是多階段。

### 第三類：怎麼防過擬合

第 11–12 頁分兩種：

- **正則化**，投影片說這「可以說是最重要的技巧」：large-margin（SVM，AdaBoost 間接做到）、L2（SVR、kernel 模型、NN 的 weight decay）、投票平均（uniform blending、bagging、random forest）、denoising（autoencoder）、weight elimination 與 early stopping（NN）、限制（autoencoder 的權重綁定、RBF 網路的中心數）、pruning（decision tree）。
- **驗證**，「simple but necessary」：SVM／SVR 的支援向量數、random forest 的 OOB、blending 與 decision tree pruning 的內部驗證。

### 第四節：實務上怎麼組合

第 14–17 頁連舉四屆台大隊伍拿下的 KDD Cup 冠軍：

| 比賽 | 模型重點（投影片摘要） |
|---|---|
| KDD Cup 2010（Yu et al.） | logistic regression 配大量原始編碼特徵，加上 random forest 配人工設計特徵，再做 linear blending |
| KDD Cup 2011 Track 1（Chen et al.） | 矩陣分解變形、RBM、k-NN、PLSA、線性迴歸、NN、GBDT，最後用 NN、類決策樹模型與 linear blending 組合 |
| KDD Cup 2012 Track 2（Wu et al.） | 線性迴歸與 logistic regression 的變形、矩陣分解變形，再用 NN、類 GBDT 模型與 linear blending 組合；關鍵是 blend 時不要過擬合 |
| KDD Cup 2013 Track 1（Li et al.） | 樹非常多的 random forest 與 GBDT 變形，加上大量依領域知識設計的特徵 |

投影片對 2010 那屆的評語是「yes, you've learned everything!」。第 18 頁列 ICDM 2006 列出的十大資料探勘演算法（C4.5、k-means、SVM、Apriori、EM、PageRank、AdaBoost、k-NN、Naive Bayes、C&RT），再補上他個人認為漏掉的五個：linear regression、logistic regression、random forest、GBDT、NN。第 19 頁是一張名詞雲，標題是「welcome to the jungle」。

**怎麼做**：拿一張紙，把上面三類技巧當欄位，把你記得的每個模型填進去，填不進去的地方就是該回頭重看的講次。這張表比任何筆記都更能檢查你有沒有把技法串起來。

## Fall 2024 補充一：302u 活化函數與初始化

302u 的封面寫的是「Machine Learning Soundings（機器學習深測）Lecture 2: Activation and Initialization」，課程頁則標為「deep learning activation」。它接在 212u／213u 後面，從 tanh 網路的 backprop 講起。

**梯度消失**（第 3–6 頁）：backprop 的 δ<sup>(1)</sup> 是 δ<sup>(L)</sup> 乘上一長串權重和 ϕ′(s)。tanh 在 |s| 大時飽和，ϕ′(s) = 1 − tanh²(s) 趨近 0，前面幾層的梯度就小到幾乎不更新，深的網路因此訓練不動。第 6 頁列了六種對策：skip connection、小的隨機初始化、逐層 pre-training（技法 T13）、內部正規化、梯度正規化，以及換更好的活化函數。

**ReLU 家族**（第 7–10 頁）：

- **ReLU**，ϕ(s) = max(s, 0)：正區間導數為 1，大約一半的時間不會梯度消失；每筆資料只啟動部分神經元，計算也快。投影片說它可以說是深度學習最常用的活化函數。
- **dead neuron**：如果某個神經元對每一筆資料的 s 都小於 0，它的輸出和梯度都是 0，從此不再更新。例如一次很大的梯度步把偏差推到很負，或輸入全為正（沒平移過的影像）又配上負權重。
- **Leaky ReLU**，ϕ(s) = max(s, 0.01s)：負區間留一點斜率，比較不會出現 dead neuron。投影片自己問：為什麼是 0.01？
- **Parametric ReLU**，ϕ(α, s) = max(s, α·s)：把 α 也當參數用 backprop 學。投影片的結論是「anything (loosely) differentiable is learnable」。

**初始化**（第 11–14 頁）：全 0 對 tanh 太對稱、對 ReLU 不可微；全部同一個常數會讓神經元變成複製品；太大則 tanh 飽和、ReLU 部分死掉。所以要**小的零平均隨機值**。接著推導變異數該取多少：

- tanh 前向傳遞想讓各層輸出變異數維持不變，得到 var(w) = 1/d<sup>(ℓ−1)</sup>；反向傳遞則要 1/d<sup>(ℓ)</sup>。**Xavier 初始化**取兩者折衷，var(w) = 2/(d<sup>(ℓ−1)</sup> + d<sup>(ℓ)</sup>)。
- ReLU 只保留一半，E(x²) 是 s 變異數的一半，所以要乘回 2：**He 初始化**，var(w) = 2/d<sup>(ℓ−1)</sup>。

課程頁附的原始論文：ReLU 是 [Glorot, Bordes & Bengio](http://jmlr.org/proceedings/papers/v15/glorot11a/glorot11a.pdf)，Leaky ReLU 是 [Maas, Hannun & Ng](https://ai.stanford.edu/~amaas/papers/relu_hybrid_icml2013_final.pdf)，Parametric ReLU 是 [He, Zhang, Ren & Sun](https://arxiv.org/abs/1502.01852)。

## Fall 2024 補充二：303u 深度學習的最佳化

303u 是同一系列的 Lecture 3: Optimization in Deep Learning，篇幅很短。

第 2 頁先描述誤差曲面：local minima 沒有想像中糟；saddle point 和 local maxima 用 SGD 容易逃出；plateau 需要較大的 η；ravine 要避免來回震盪。backprop 算梯度很慢，所以用 minibatch SGD，代價是梯度估計不穩定。想穩定，就平均。

- **Momentum**（第 3–5 頁）：用 M 個 minibatch 平均要多花 M 倍計算，重用過去的梯度就不用。均勻權重的滑動視窗不夠好，改成指數衰減的移動平均 v<sub>t</sub> = βv<sub>t−1</sub> + (1 − β)Δ<sub>t</sub>，β = 0 就退回原本的 SGD。好處是抵消部分變異、壓住峽谷裡的震盪、逃出淺的區域最佳與鞍點。
- **RMSProp**（第 6–8 頁）：希望梯度大的分量步子小一點。只有隨機梯度可用，就對 Δ<sub>t</sub> ⊙ Δ<sub>t</sub> 做移動平均 u<sub>t</sub>，每個分量的步長是 η · (u<sub>t</sub> + ϵ)<sup>−1/2</sup>。
- **Adam**（第 9 頁）：約等於 momentum 加 RMSProp 再加全域衰減。投影片的提醒是 Adam 通常比原始 SGD 更積極，但也可能更快過擬合。

課程頁附的論文：backprop 的 [Rumelhart, Hinton & Williams](https://rdcu.be/b4ocH)、momentum 的 [Qian](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.57.5612&rep=rep1&type=pdf)、[Adam（Kingma & Ba）](https://arxiv.org/pdf/1412.6980.pdf)。

**怎麼做**：用 numpy 寫一個兩層 ReLU 網路，在同一份資料上比較三種初始化（全 0、標準常態、He）與三種最佳化器（SGD、momentum、Adam），每種組合畫一條訓練 loss 曲線。九條線放一張圖，就是 302u 加 303u 的完整實驗版。

## Fall 2024 補充三：mlmai.ics 演講投影片

Fall 2024 的 W15 因為老師要出席 ACML 2024 與 NeurIPS 2024 而停課，課程頁放上 mlmai.ics 投影片代替。這份投影片是林軒田 2020-12-17 在 International Computer Symposium 2020 暨教育部人工智慧技術及應用人才培育計畫成果發表會上的主題演講「Machine Learning for Modern Artificial Intelligence」。

演講分三段：

1. **ML for (Modern) AI**：他對現代 AI 的定義是「intelligently ≈ easily」，也就是 application intelligence；機器學習是把大數據「煮」成 AI 的工具，而且一開始常常要借重人的領域知識。例子是用 CNN 估計颱風強度。
2. **ML Research for Modern AI**：三個研究案例。cost-sensitive 多類別分類（不同誤判的代價不同，例如把 COVID-19 誤判成健康），active learning by learning（用 bandit 挑選 active learning 策略，開源成 [libact](https://github.com/ntucllab/libact)），以及颱風強度估計。每個案例都附一段「做得更實際了嗎？」的反省，例如 libact 最常被回報的問題是在 Windows／Mac 上難安裝。
3. **ML for Future AI**：更有創意、更可解釋、更能互動，對應贏得人類的尊重、信任與喜愛。

這份投影片的價值在於示範「課本上的 cost-sensitive 誤差（基石 L8）、bandit（基石 HW2 的 slot machine 題）怎麼變成研究題目」。

## Fall 2024 補充四：1126 超短總整理

1126 的封面寫的是「Machine Learning Foundations, Lecture 1126: Super Short Summary」（1126 是技法 T16 Fun Time 裡的「official lucky number of this class」）。它把整學期濃縮成 11 個模型，每個模型用同一組欄位描述：err、演算法用的誤差、最佳化方式、Φ、正則化／驗證、參數、實務用途。

| # | 模型 | 投影片寫的實務用途 |
|---|---|---|
| 1 | PLA | online learning 與教學 |
| 2 | ridge linear regression | 當作還不錯的 baseline |
| 3 | logistic regression | 硬分類與軟分類的 baseline |
| 4 | ridge polynomial regression | 常用在一維迴歸 |
| 5 | soft-margin linear SVM | 大規模分類 |
| 6 | soft-margin kernel SVM | 中等規模分類 |
| 7 | AdaBoost | 「boost」決策樹或 stump |
| 8 | decision tree | 可解釋的非線性模型 |
| 9 | bagging／random forest | 讓任何模型或樹更穩定 |
| 10 | GBDT | 資訊檢索與競賽 |
| 11 | neural networks／deep learning | 視覺與語音 |

第 11 個模型的描述直接把 302u、303u 接進來：用 Adam 做 GD／SGD、Xavier／He 初始化、ReLU 或 tanh 神經元、以 early stopping、L1／L2 與 dropout 正則化。

**怎麼做**：把這張表和上面 T16 的三類技巧對照著看。1126 是「按模型」整理，T16 是「按技巧」整理，兩張表交叉起來，就是整門課的索引。

## 影片清單

T16 Finale（MOOC；Fall 2024 的四份補充投影片沒有對應錄影）：

- [Feature Exploitation Techniques](https://www.youtube.com/watch?v=WeLobtIDBzI)
- [Error Optimization Techniques](https://www.youtube.com/watch?v=En-EyzFipaw)
- [Overfitting Elimination Techniques](https://www.youtube.com/watch?v=b6t22jVVC0s)
- [Machine Learning in Practice](https://www.youtube.com/watch?v=jIpwy-mPvIA)

Fall 2026 的課程頁寫明有公開同步直播，但直播是否留下完整錄影，我沒有逐支核對。

## 下一步

課程內容到這裡結束。下一篇[基石作業導讀：Fall 2024 HW0–HW5](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)回頭整理基石部分的作業，之後是[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

延伸閱讀：302u／303u 只是深度學習的入口。想往下走，本站有 [CMU 11-785](/posts/ai/2026-08-22-cmu-11785-course-overview)（其中[動量與損失曲面](/posts/ai/2026-08-22-cmu-11785-06-loss-surfaces-momentum)、[最佳化器與正則化](/posts/ai/2026-08-22-cmu-11785-08-optimizers-regularization)兩講正好接 303u）、[MIT 6.7960](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)，以及台大另一條路線[李宏毅 ML 2026](/posts/ai/2026-09-30-ntu-ml2026-course-overview)。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Machine Learning Foundations / Techniques MOOC 頁（林軒田）](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [T16 Finale 投影片](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/216_handout.pdf)
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Fall 2024 302u：Activation and Initialization](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/302u_handout.pdf)
- [Fall 2024 303u：Optimization in Deep Learning](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/303u_handout.pdf)
- [Fall 2024 mlmai.ics：Machine Learning for Modern Artificial Intelligence](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/mlmai.ics.handout.pdf)
- [Fall 2024 1126：Super Short Summary](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/1126_handout.pdf)
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Deep Sparse Rectifier Neural Networks（Glorot, Bordes & Bengio）](http://jmlr.org/proceedings/papers/v15/glorot11a/glorot11a.pdf)
- [Rectifier Nonlinearities Improve Neural Network Acoustic Models（Maas, Hannun & Ng）](https://ai.stanford.edu/~amaas/papers/relu_hybrid_icml2013_final.pdf)
- [Delving Deep into Rectifiers（He, Zhang, Ren & Sun）](https://arxiv.org/abs/1502.01852)
- [Learning representations by back-propagating errors（Rumelhart, Hinton & Williams）](https://rdcu.be/b4ocH)
- [On the Momentum Term in Gradient Descent Learning Algorithms（Qian）](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.57.5612&rep=rep1&type=pdf)
- [Adam: A Method for Stochastic Optimization（Kingma & Ba）](https://arxiv.org/pdf/1412.6980.pdf)
- [libact](https://github.com/ntucllab/libact)
- [MOOC 投影片勘誤](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)

---
title: "林軒田機器學習技法 T14–T15：RBF 網路、k-means 與矩陣分解——萃取模型還能長什麼樣"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, machine-learning, ai-course, course-guide, k-means, clustering, recommendation-system]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 15
tldr: "技法 T14 把 Gaussian SVM 重新看成「以距離為相似度的線性投票」，由此得到 RBF 網路；中心點太多會過擬合，於是用 k-means 找少量代表點，k-means 本身是交替最佳化。T15 從 Netflix 評分資料出發，把使用者 ID 做 one-hot 編碼、丟進去掉 tanh 的線性網路，得到矩陣分解 R ≈ VᵀW，用交替最小平方或 SGD 來學，最後把 boosting、NN、RBF 網路、矩陣分解、k-NN 收成一張萃取模型地圖。這兩講只有 MOOC 教材：Fall 2024 與 Fall 2026 的課程計畫都沒排，也沒有公開作業題。"
description: "台大林軒田《機器學習技法》第 14–15 講導讀：RBF 網路的假說與學習（full RBF、nearest neighbor、正則化）、k-means 的交替最佳化、用 k-means 找中心的 RBF 網路；線性網路、矩陣分解、交替最小平方、SGD 與 KDD Cup 2011 的時間順序技巧，以及萃取模型總整理。附 8 支影片、投影片對照，以及沒有作業時的自我練習方式。"
draft: false
glossary:
  - term: "RBF 網路"
    aliases: ["RBF network", "radial basis function network", "徑向基函數網路"]
    definition: "隱藏層用「輸入與中心點的距離」算出相似度（例如 Gaussian），輸出層把這些相似度線性加權投票的模型。學習的變數是中心點 μ_m 與票數 β_m。"
    context: "林軒田《機器學習技法》T14 從 Gaussian SVM 推出它，並指出它在歷史上屬於神經網路的一種。"
    links:
      - label: "T14 投影片"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/214_handout.pdf"
  - term: "交替最小平方"
    aliases: ["alternating least squares", "ALS"]
    definition: "矩陣分解的一種解法：固定使用者向量時，每部電影各做一次線性迴歸；固定電影向量時，每位使用者各做一次，兩邊輪流直到收斂。每輪 E_in 只降不升，所以保證收斂，但只到區域最佳。"
    context: "林軒田《機器學習技法》T15 用它和 SGD 兩種方法解矩陣分解。"
    links:
      - label: "T15 投影片"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/215_handout.pdf"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)系列第 15 篇，接續[神經網路與深度學習](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning)。範圍是[《機器學習技法》](https://www.csie.ntu.edu.tw/~htlin/mooc/)第 14 講 Radial Basis Function Network 與第 15 講 Matrix Factorization，也就是技法第三部分「Distilling Implicit Features: Extraction Models」的後半段。

用到的官方材料：

- MOOC 投影片 [214_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/214_handout.pdf)（T14）、[215_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/215_handout.pdf)（T15）。
- [技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)的第 54–61 支影片（文末逐支列出）。

**存取等級：A2，而且沒有練習材料。** 影片與投影片免費，但 [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) 與 [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) 兩個學期的課程計畫都跳過 T14–T15：兩學期都在 NN／deep learning（212u、213u）之後直接接 modern deep learning（302u、303u）。所以這兩講沒有對應的 `u` 版更新投影片，課程頁也沒有標 LFD 章節。我翻過 Fall 2024 的 HW0–HW7 與期末專題說明，沒有任何一題考 RBF 網路、k-means 或矩陣分解。能拿來自我檢查的只有投影片裡的 Fun Time 小題。分級定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=7lHhnpdPVr0
title: RBF Network Hypothesis
```

```youtube
url: https://www.youtube.com/watch?v=dEYdx2rS66c
title: RBF Network Learning
```

原始影片：[RBF Network Hypothesis](https://www.youtube.com/watch?v=7lHhnpdPVr0)、[RBF Network Learning](https://www.youtube.com/watch?v=dEYdx2rS66c)、[k-Means Algorithm](https://www.youtube.com/watch?v=ker9RF2TDUU)、[k-Means and RBFNet in Action](https://www.youtube.com/watch?v=D5elADTz1vk)、[Linear Network Hypothesis](https://www.youtube.com/watch?v=2pX76iH_irw)、[Basic Matrix Factorization](https://www.youtube.com/watch?v=3l5kaWkcR6s)、[Stochastic Gradient Descent](https://www.youtube.com/watch?v=br3IzOz-xMs)、[Summary of Extraction Models](https://www.youtube.com/watch?v=xKZMB4T2a2s)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## 這兩講在技法裡的位置

技法把整門課分成三種處理特徵的方式：kernel 模型把大量特徵嵌進 kernel（T1–T6），aggregation 模型把多個假說當成特徵組合起來（T7–T11），extraction 模型把特徵當成隱藏變數一起學（T12–T15）。T12–T13 講神經網路與 autoencoder，本篇的兩講再補上兩種萃取模型：

- **T14**：隱藏層改用「到中心點的距離」當轉換，再用非監督式的 k-means 找中心。
- **T15**：輸入根本不是數值，是使用者 ID 這種抽象特徵。怎麼從評分資料裡萃取出使用者與電影的隱藏特徵？

兩講的收尾都在回答同一件事：萃取模型的「萃取」可以用哪些方式完成。

## T14：RBF 網路

### 從 Gaussian SVM 看出 RBF 網路

T14 從 T3 的 Gaussian SVM 講起（投影片第 2 頁）：

g<sub>SVM</sub>(x) = sign( Σ<sub>SV</sub> α<sub>n</sub> y<sub>n</sub> exp(−γ‖x − x<sub>n</sub>‖²) + b )

Gaussian kernel 又叫 Radial Basis Function（RBF）kernel。radial 指的是它只看 x 和「中心」x<sub>n</sub> 之間的距離，basis function 指的是它會被拿去組合。把每一項寫成 g<sub>n</sub>(x) = y<sub>n</sub> exp(−γ‖x − x<sub>n</sub>‖²)，Gaussian SVM 就只是「挑出來的幾個 radial 假說的線性組合」。

一般化之後就是 **RBF 網路**（第 4 頁）：

h(x) = Output( Σ<sub>m=1</sub><sup>M</sup> β<sub>m</sub> RBF(x, μ<sub>m</sub>) + b )

要學的是中心點 μ<sub>m</sub> 與（帶正負號的）票數 β<sub>m</sub>。Gaussian SVM 是其中一個特例：RBF 用 Gaussian、M 等於支援向量個數、μ<sub>m</sub> 就是支援向量、β<sub>m</sub> 取自對偶解的 α<sub>m</sub>y<sub>m</sub>。

和上一篇的神經網路對照（第 3 頁）：輸出層一樣是線性組合，差別只在隱藏層。NN 的神經元是「內積加 tanh」，RBF 網路是「距離加 Gaussian」。投影片的說法是，RBF 網路在歷史上算是 NN 的一種。

第 5 頁把兩種相似度分開講：kernel 是 Z 空間裡的內積，受 Mercer 條件約束；RBF 是 X 空間裡的距離，通常隨距離單調不增。**RBF 網路等於拿「和各個中心的相似度」當特徵轉換。**

### 怎麼學：從 full RBF 到少量中心

最偷懶的做法是 **full RBF 網路**（第 7 頁）：M = N，每個訓練樣本都當一個中心。如果二元分類時讓每個 β<sub>m</sub> = y<sub>m</sub>，意思就是每筆資料依相似度對新輸入投票。

再偷懶一點（第 8 頁）：exp(−γ‖x − x<sub>m</sub>‖²) 在 x 最靠近 x<sub>m</sub> 時最大，而最大那一項常常主宰總和。乾脆只取最近那筆的 y<sub>m</sub>，從「匯總」變成「挑選」，這就是 **nearest neighbor**。對 k 個鄰居做均勻投票就是 k-nearest neighbor。

換成平方誤差的迴歸（第 9–10 頁），full RBF 網路就是在 RBF 轉換後的資料上做線性迴歸。這時 Z 是 N×N 的對稱方陣，而且只要所有 x<sub>n</sub> 都不同，Gaussian RBF 的 Z 一定可逆，所以 β = Z<sup>−1</sup>y。代回去每一筆訓練資料都完全命中，E<sub>in</sub> = 0。函數逼近領域管這叫 exact interpolation，但對學習來說就是過擬合。

兩種補救方式：

1. **加正則化**：對 β 做 ridge regression，β = (ZᵀZ + λI)<sup>−1</sup>Zᵀy。第 10 頁順便指出 Z 其實就是 Gaussian kernel 矩陣 K，拿來和 T6 的 kernel ridge regression β = (K + λI)<sup>−1</sup>y 對照，兩者正則化的空間不同。
2. **減少中心數**：SVM 只用了遠少於 N 個支援向量。改成 M ≪ N，限制中心數和票數本身就是一種正則化（第 11 頁）。這些中心的物理意義是**代表點（prototype）**。

剩下的問題是：代表點怎麼找？

### k-means：用交替最佳化找代表點

如果 x<sub>1</sub> ≈ x<sub>2</sub>，網路裡就不需要兩個幾乎一樣的 RBF，用一個代表點 μ 就夠了。這就變成分群問題（第 13 頁）：把資料切成互斥的 S<sub>1</sub>…S<sub>M</sub>，每群選一個 μ<sub>m</sub>，最小化

E<sub>in</sub> = (1/N) Σ<sub>n</sub> Σ<sub>m</sub> [x<sub>n</sub> ∈ S<sub>m</sub>] ‖x<sub>n</sub> − μ<sub>m</sub>‖²

這題同時有組合（怎麼分群）和數值（中心在哪）兩種變數，很難一起解。投影片的做法是兩組變數輪流最佳化：

- **固定中心，最佳化分群**（第 14 頁）：每筆資料歸到離它最近的 μ<sub>m</sub>。
- **固定分群，最佳化中心**（第 15 頁）：對 μ<sub>m</sub> 取梯度等於零，得到最佳中心就是群內資料的平均。

兩步輪流做到分群不再變動，就是 **k-means**（第 16 頁）。初始化通常隨機挑 k 個 x<sub>n</sub>。因為每一步 E<sub>in</sub> 只會下降，收斂有保證。投影片特別提醒，這裡的 k 是代表點個數，和 k-nearest neighbor 的 k 是兩回事。

**用 k-means 的 RBF 網路**（第 17 頁）分四步：

1. 跑 k = M 的 k-means 得到 {μ<sub>m</sub>}。
2. 用 RBF（例如 Gaussian）建立轉換 Φ(x) = [RBF(x, μ<sub>1</sub>), …, RBF(x, μ<sub>M</sub>)]。
3. 在 {(Φ(x<sub>n</sub>), y<sub>n</sub>)} 上跑線性模型得到 β。
4. 回傳 LinearHypothesis(β, Φ(x))。

投影片把第 1 步比作 autoencoder：都是用非監督式學習輔助特徵轉換。要調的參數有兩個，代表點個數 M，以及 RBF 本身的參數（例如 Gaussian 的 γ）。投影片對它的評語是「a simple (old-fashioned) model」。

### 實際跑起來

第 19–22 頁是一連串圖：

- k 選得對、初始化合適時，k-means 通常表現不錯。
- 但它對 k 和初始化都很敏感，同一份資料用 k = 2、4、7 會分出很不一樣的群。
- 中心選得合理，RBF 網路的表現也合理。
- full RBF 網路（k = N、λ = 0.001）和 nearest neighbor 的邊界都很破碎，投影片的結論是 full RBF 網路「generally less useful」。

最後一題 Fun Time 把 T14 收在正則化上：搭配 ridge 線性迴歸時，**M 小、λ 大**的 RBF 網路正則化最強。M 小代表權重少，λ 大代表 β 被壓得更短。

**怎麼做**：用 sklearn 的 `KMeans` 取中心、自己寫 Gaussian 轉換，再接 `Ridge`，在一份二維玩具資料上掃過 M ∈ {2, 4, 8, 32, N} 與幾個 λ，把決策邊界畫出來。你會親眼看到第 22 頁那種 full RBF 的破碎邊界。

## T15：矩陣分解

### 問題：輸入只是一個 ID

T15 回到基石 L1 用過的推薦系統例子（第 2 頁）。2006 年 Netflix 舉辦的競賽給了 480,189 位使用者對 17,770 部電影的 100,480,507 筆評分，誰能把預測準確度改善 10% 就拿 100 萬美元。

資料的長相是：第 m 部電影的資料集 D<sub>m</sub> 由 (x̃<sub>n</sub> = (n), y<sub>n</sub> = r<sub>nm</sub>) 組成，輸入只是使用者編號 n。這種特徵叫 **categorical feature**，其他例子有血型、程式語言（第 3 頁）。多數模型（線性模型、NN）吃的是數值特徵，決策樹是少數例外，所以要先編碼。最直接的是 binary vector encoding：A 型 = [1 0 0 0]ᵀ、B 型 = [0 1 0 0]ᵀ，依此類推。

### 線性網路 = 矩陣分解

把每位使用者編碼成 N 維的 binary vector，所有電影的評分疊成輸出向量（沒評過的是「?」），就可以試著用 N-d̃-M 的神經網路萃取特徵（第 4 頁）。投影片問：中間需要 tanh 嗎？

輸入是 one-hot，每次只有一個神經元亮，所以拿掉 tanh 也無妨。第 5 頁把兩層權重改名為 Vᵀ 和 W，得到**線性網路**：

h(x) = WᵀVx，對第 n 位使用者就是 h(x<sub>n</sub>) = Wᵀv<sub>n</sub>

v<sub>n</sub> 是 V 的第 n 欄。要指定一個這樣的假說，變數數量是 (N + M)·d̃（第 6 頁 Fun Time）。

換個角度看（第 7 頁）：Φ(x) = Vx 是所有電影共用的特徵轉換，每部電影在上面各有一個線性模型 w<sub>m</sub>。對所有「已知評分」用平方誤差，就是希望 r<sub>nm</sub> ≈ w<sub>m</sub>ᵀv<sub>n</sub>。寫成矩陣就是

R ≈ VᵀW

這就是**矩陣分解**（第 8 頁）：評分矩陣拆成使用者因子與電影因子，每個因子可以想成「喜不喜歡喜劇」「喜不喜歡動作片」這類隱藏特徵。學習流程是：已知評分 → 學出 v<sub>n</sub> 與 w<sub>m</sub> → 預測未知評分。投影片提到同樣的建模方式也能用在其他抽象特徵上。

### 解法一：交替最小平方

又是兩組變數，所以又可以交替最佳化（第 9–10 頁）：

- 固定所有 v<sub>n</sub>，最佳化 w<sub>m</sub>：就是在 D<sub>m</sub> 上做一次不含 w<sub>0</sub> 的線性迴歸。
- 固定所有 w<sub>m</sub>，最佳化 v<sub>n</sub>：由使用者與電影的對稱性，就是每位使用者各做一次線性迴歸。

輪流做到收斂，這叫 **alternating least squares**，投影片形容成使用者與電影之間的「探戈」。初始化通常隨機，收斂保證的理由和 k-means 一樣：E<sub>in</sub> 每步都下降。一輪要解 M + N 個最小平方問題。

第 11 頁把它和 T13 的**線性 autoencoder** 對照：

| | 線性 autoencoder | 矩陣分解 |
|---|---|---|
| 形式 | X ≈ W(WᵀX)，d-d̃-d 線性網路 | R ≈ VᵀW，N-d̃-M 線性網路 |
| 誤差 | 所有 x<sub>ni</sub> 的平方誤差 | 只算已知 r<sub>nm</sub> 的平方誤差 |
| 解 | 全域最佳：XᵀX 的特徵向量 | 區域最佳：交替最小平方 |
| 用途 | 降維特徵 | 使用者與電影的隱藏特徵 |

結論是：線性 autoencoder 等於對「完整」矩陣 X 做的特殊矩陣分解。

### 解法二：SGD

另一條路是基石 L11 的 SGD（第 13–15 頁）。每次隨機挑一筆已知評分 (n, m)，單筆誤差是 (r<sub>nm</sub> − w<sub>m</sub>ᵀv<sub>n</sub>)²。對其他使用者和其他電影的向量，梯度都是 0，只有 v<sub>n</sub> 和 w<sub>m</sub> 需要更新：

- 先算殘差 r̃<sub>nm</sub> = r<sub>nm</sub> − w<sub>m</sub>ᵀv<sub>n</sub>
- v<sub>n</sub> ← v<sub>n</sub> + η · r̃<sub>nm</sub> · w<sub>m</sub>
- w<sub>m</sub> ← w<sub>m</sub> + η · r̃<sub>nm</sub> · v<sub>n</sub>

直覺是「殘差乘上另一方的特徵向量」。SGD 每次迭代便宜、好實作、容易換成別的誤差函數，投影片說它可能是大規模矩陣分解最常用的演算法。

第 17 頁的 Fun Time 值得記住：如果所有向量都初始化成 0，每筆的梯度都是 0，E<sub>in</sub> 永遠降不下來。這是「初始化要隨機」的最小反例，下一篇的 302u 投影片會在深度網路上再談一次。

### 實戰：KDD Cup 2011 的時間順序 SGD

第 16 頁講台大隊伍拿下 KDD Cup 2011 Track 1 冠軍的一個技巧。那份資料的特性是：每位使用者的訓練評分在時間上早於測試評分，訓練和測試分布不一致，這正是基石 L16 講的 sampling bias。

他們的觀察是 SGD 最後 T′ 次迭代只看到那 T′ 筆資料，學出來的向量會偏向它們。所以把 SGD 改成「時間上較晚的資料最後才走訪」，測試表現因此穩定進步。投影片的教訓是：懂技巧的行為，才容易為真實問題改造它。

**怎麼做**：拿 [MovieLens](https://grouplens.org/datasets/movielens/) 最小的資料集，用 numpy 寫上面三行 SGD 更新（d̃ = 10、η = 0.01），先用全 0 初始化跑一次、再用小亂數跑一次，比較兩者的訓練 RMSE。這是本篇沒有官方作業時最直接的自我驗證。

### 萃取模型總整理

T15 最後兩頁把技法第三部分收成地圖（第 18–19 頁）：

| 模型 | 萃取出來的隱藏變數 | 線性模型那一層 | 萃取技術 |
|---|---|---|---|
| Adaptive／Gradient Boosting | 假說 g<sub>t</sub> | 權重 α<sub>t</sub> | functional gradient descent |
| Neural Network／Deep Learning | 各層權重 w<sub>ij</sub><sup>(ℓ)</sup> | 最後一層權重 w<sub>ij</sub><sup>(L)</sup> | SGD（backprop）、autoencoder |
| RBF Network | 中心 μ<sub>m</sub> | 票數 β<sub>m</sub> | k-means |
| Matrix Factorization | 使用者特徵 v<sub>n</sub> | 電影特徵 w<sub>m</sub> | SGD、交替最小平方 |
| k Nearest Neighbor | 以 x<sub>n</sub> 為中心的鄰居 RBF | y<sub>n</sub> | lazy learning |

第 20 頁列優缺點。優點：減輕人工設計特徵的負擔；隱藏變數夠多時很強大。缺點：一般來說是非凸最佳化，不好解；而且容易過擬合，需要正則化與驗證。投影片的結論是「be careful when applying extraction models」。

## 影片清單

T14 Radial Basis Function Network：

- [RBF Network Hypothesis](https://www.youtube.com/watch?v=7lHhnpdPVr0)
- [RBF Network Learning](https://www.youtube.com/watch?v=dEYdx2rS66c)
- [k-Means Algorithm](https://www.youtube.com/watch?v=ker9RF2TDUU)
- [k-Means and RBFNet in Action](https://www.youtube.com/watch?v=D5elADTz1vk)

T15 Matrix Factorization：

- [Linear Network Hypothesis](https://www.youtube.com/watch?v=2pX76iH_irw)
- [Basic Matrix Factorization](https://www.youtube.com/watch?v=3l5kaWkcR6s)
- [Stochastic Gradient Descent](https://www.youtube.com/watch?v=br3IzOz-xMs)
- [Summary of Extraction Models](https://www.youtube.com/watch?v=xKZMB4T2a2s)

## 沒有作業時怎麼練

T14–T15 沒有 Fall 2024 或 Fall 2026 的作業題，也沒有官方解答。能用的只有：

1. **投影片裡的 8 題 Fun Time**（T14、T15 各四題），答案和解釋都印在下一頁。先遮住答案頁作答。
2. **上面兩個「怎麼做」小實驗**：RBF 網路掃 M 與 λ、矩陣分解比較零初始化和亂數初始化。用 sklearn 的 `KMeans`、`Ridge` 對照自己手寫的版本，數值對得上就代表理解沒偏。
3. **把 k-means 和交替最小平方並排寫**：兩者的程式骨架幾乎一樣，都是「固定一組、解另一組、重複到不變」。寫完你會發現下一篇 Finale 為什麼把 alternating optimization 列成一類最佳化技巧。

## 下一步

下一篇[總結：三大技巧，外加 Fall 2024 的現代深度學習補充](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning)會用 T16 把整門技法收成特徵、最佳化、防過擬合三類技巧，並接上 Fall 2024 補充的 ReLU、He 初始化、momentum 與 Adam。

延伸閱讀：[Stanford CS224W 導讀](/posts/ai/2026-08-21-stanford-cs224w-ml-with-graphs)從圖的角度處理推薦問題，可以和本篇的矩陣分解對照。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Machine Learning Foundations / Techniques MOOC 頁（林軒田）](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [T14 Radial Basis Function Network 投影片](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/214_handout.pdf)
- [T15 Matrix Factorization 投影片](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/215_handout.pdf)
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)（課程計畫未排 T14–T15）
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)（課程計畫未排 T14–T15）
- [A linear ensemble of individual and blended models for music rating prediction（Chen et al., KDD Cup 2011）](http://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf) — 課程頁在 blending 一講列的延伸閱讀，也是 T15 第 16 頁提到的冠軍隊伍
- [MOOC 投影片勘誤](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)
- [MovieLens 資料集（GroupLens）](https://grouplens.org/datasets/movielens/) — 自我練習用，非課程指定

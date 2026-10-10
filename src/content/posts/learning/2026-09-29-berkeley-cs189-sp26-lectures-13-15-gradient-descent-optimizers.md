---
title: "CS189 Spring 2026 Lec 13、15：收斂、Momentum、Adam、SGD"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, machine-learning, open-course, gradient-descent, optimization]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS189 導讀"
  order: 8
tldr: "CS189 Spring 2026 用兩講處理梯度下降。Lec 13 從 Hessian 的特徵值推出學習率上限和條件數，再一路講到 momentum、學習率排程、AdaGrad／RMSProp／Adam 與 mini-batch SGD。Lec 15 由 Dimakis 用一個小資料表手算梯度重走一遍。兩份講義、錄影、Lec 13 的手寫稿，以及 Discussion 6、7（附解答）都能匿名取得。"
description: "Berkeley CS189 Spring 2026 Lecture 13 與 15 導讀：梯度下降的收斂條件、條件數、momentum、學習率排程、Adam、SGD 與 batch size，搭配 Discussion 6–7 的題目與 Fall 2026 對應講次。"
draft: false
---

> 🌏 [English version](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-13-15-gradient-descent-optimizers-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

本文依 [CS189 Spring 2026](https://eecs189.org/sp26/)（Jennifer Listgarten／Alex Dimakis）的公開教材。系列入口是 [Berkeley CS189 總覽](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview)。

前幾講的線性回歸和 logistic regression 都在寫「要最小化什麼」。從 Lec 13 開始，課程改問「怎麼把它最小化」。答案是梯度下降，也就是往梯度的反方向走一小步，重複到收斂。這兩講處理三個問題：步伐要多大才不會發散？地形很扁或很歪時怎麼辦？資料多到每步都算不起時怎麼辦？

排程上 Lec 13（3/3）和 Lec 15（3/10）中間夾著 Lec 14（MLE/MAP），所以本系列把兩講合成一篇，Lec 14 放在[下一篇](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-14-16-mle-map-bias-variance-entropy)。

## 課程影片來源

影片連結對應本文教材；此處不提供未核對的時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=1EAoNdjsOZw
title: Lecture 13 錄影：Conv. + Momentum + Adam + Stochastic Gradient Descent
```

```youtube
url: https://www.youtube.com/watch?v=6zV_GGgUa0Y
title: Lecture 15 錄影：Learning with Gradient Descent
```

原始影片：[Lecture 13 錄影：Conv. + Momentum + Adam + Stochastic Gradient Descent](https://www.youtube.com/watch?v=1EAoNdjsOZw)、[Lecture 15 錄影：Learning with Gradient Descent](https://www.youtube.com/watch?v=6zV_GGgUa0Y)

課程與錄影入口：

- [官方課程與錄影入口](https://eecs189.org/sp26/)

## 教材在哪、能拿到什麼

| 講次 | 官方標題 | 教材 | Bishop 指定閱讀 |
|---|---|---|---|
| Lec 13（3/3） | Convergence + Momentum + Adam + Stochastic Gradient Descent | [Notes 資料夾](https://drive.google.com/drive/folders/1FEQYDjdSckr1DRVQ06day94rTZtcB0ls)：`lec13.pdf` 加三張手寫稿（`.heic`）；[錄影](https://www.youtube.com/watch?v=1EAoNdjsOZw) | 7.1–7.3（error surface、batch/SGD/mini-batch、momentum、learning rate schedule、RMSProp 與 Adam）、Appendix A.4（特徵向量） |
| Lec 15（3/10） | Learning with Gradient Descent | [Notes 資料夾](https://drive.google.com/drive/folders/1Ei_AOgIkLNUFI6JZyoDfWG-_VEm7Xg-1)：`lec15.pdf`（62 頁）；[錄影](https://www.youtube.com/watch?v=6zV_GGgUa0Y) | 同上 |
| Discussion 6 | — | [PDF](https://drive.google.com/file/d/1FFNxd-TEkK53m8s-eHfN9V6xXsoSqMHa/view)、[Solutions](https://drive.google.com/file/d/1gfUeWtTRnIXlj_H8pnL3BSl4THOriQQG/view)、[Walkthrough](https://youtube.com/playlist?list=PL-ysCubq-Sa-JYWlXIx1NaT7fp5djA_gc) | — |
| Discussion 7 | — | [PDF](https://drive.google.com/file/d/1SloZ3iTpq9qEJ-0uWhQtcdT0fhZh5VVH/view)、[Solutions](https://drive.google.com/file/d/16jrdhv1s9cgvaU76tTZdVFIA_zE1sgWf/view)、[Walkthrough](https://youtube.com/playlist?list=PL-ysCubq-Sa-ueQ6jkjrrr-qiTlBmv0zd) | — |

上表的連結我在 2026-09-29 都匿名打開過。依本站 [A0–A3 分級](/posts/learning/2026-08-21-global-ai-cs-course-map)，這一段是 A3：講義、錄影、有解答的 discussion 都有。拿不到的是課堂上的 Slido 即時問答，還有講義裡提到的「demo notebook」，Notes 資料夾裡沒有。

有一個小細節：`lec13.pdf` 第一頁印的是「Lecture 12」，內容卻和排程上的 Lec 13 講題一致，看起來是沿用舊投影片沒改頁首。另外 `lec15.pdf` 的後半和 `lec13.pdf` 大量重複（Hessian、momentum、Adam、SGD 幾乎整段相同），差別在開頭多了 Dimakis 的手算範例。時間有限的話，先讀 Lec 13，再只看 Lec 15 的前段。

## Lec 13 手寫稿：梯度下降從哪裡來

三張手寫稿的第一張標著「CS 189 Notes, March 3, Lect 13」，從房價資料（坪數、房間數、浴室數 → 價格）寫出回歸的訓練損失 `L = Σ (f(xᵢ) − yᵢ)²`，目標是對權重最小化它。

第二張把梯度下降推導成一個小優化問題：在目前的點 `x_t` 用一階 Taylor 展開近似函數，再加一個懲罰項 `(1/2η)‖x − x_t‖²`，保證下一步不要離 `x_t` 太遠。對這個近似式取梯度、設為零，就得到 `x_{t+1} = x_t − η∇f(x_t)`。這個觀點很值得記住：學習率 η 其實是在說「你有多相信線性近似」。

## 收斂條件：為什麼學習率有上限

`lec13.pdf` 的核心推導分四步：

1. **二階近似**：在極小值 `w*` 附近，把誤差曲面用二階 Taylor 展開。梯度那一項在極小值處是零，只剩 Hessian `H` 那一項。
2. **換到特徵向量座標**：對 `H` 做特徵分解，令 `αᵢ = (w − w*)ᵀuᵢ`，誤差就拆成各方向獨立的 `½ Σ λᵢ αᵢ²`。特徵值全正是極小值，全負是極大值，有正有負就是鞍點。等高線是橢圓，長短軸對齊特徵向量。
3. **每個方向各自收斂**：梯度下降在第 i 個方向的更新是 `αᵢ ← (1 − ηλᵢ) αᵢ`，走 τ 步後是 `(1 − ηλᵢ)^τ αᵢ⁽⁰⁾`。要收斂就需要每個方向都滿足 `|1 − ηλᵢ| < 1`。`1 − ηλᵢ` 變成負數時，你會看到來回震盪。
4. **學習率上限與條件數**：最陡的方向決定上限，`η < 2/λ_max`。最平的方向收斂最慢，速度受 `λ_min/λ_max` 限制，也就是條件數的倒數。條件數越大（地形越歪），梯度下降越慢。

<details>
<summary>為什麼附錄 A.4（特徵向量）會出現在指定閱讀</summary>

第 2 步的換座標，需要「對稱矩陣有一組正交歸一的特徵向量、特徵值是實數」這個事實。講義把 `(w − w*)ᵀH(w − w*) = Σ αᵢ² λᵢ` 標成「Show it!」，推導只用到特徵向量定義和正交性。這是 Lec 13 唯一需要回頭補的線代。

</details>

這段推導也解釋了一個實務現象：特徵尺度差很多時（例如一個特徵是坪數、另一個是房間數），Hessian 的特徵值會差好幾個數量級，梯度下降就會又慢又抖。先做標準化，等於直接改善條件數。

## Momentum 與學習率排程

講義點出梯度下降的兩個毛病：地形平坦時走太慢，地形狹長時左右震盪。Momentum 的做法是把上一步的更新方向 `Δw⁽τ⁻¹⁾` 乘上 μ 加進這一步，讓「一直往同一個方向走」的分量累積速度。

講義用兩個級數說明它的效果：

- **平坦方向**：每步梯度大致相同，累積起來是等比級數，有效學習率被放大。
- **陡峭方向**：梯度正負交替，累積起來是交錯級數，彼此抵銷，有效學習率被縮小。

接著是學習率排程：一開始用大步伐加速，之後慢慢縮小以確保收斂。講義列了四種：linear、power-law（標註為最常見）、exponential，以及標註「LLM 常用」的 cosine schedule。

## AdaGrad、RMSProp、Adam

這三種方法都讓每個維度有自己的學習率：

| 方法 | 講義的描述 |
|---|---|
| AdaGrad | 用梯度平方的累積和縮小學習率，曲率大（梯度大）的維度步伐變小；講義特別註明它出自 UC Berkeley |
| RMSProp | 把累積和換成指數加權平均，只看最近的梯度；β 通常取 0.9 |
| Adam | RMSProp 加上 momentum，講義說它「大概是最廣泛使用的梯度下降更新法」 |

講義回到 batch 梯度下降的虛擬碼，在更新那一行旁邊註明 Adam 就是實作在這裡。換句話說，Adam 不改演算法骨架，只換掉更新那一步。

## SGD、mini-batch 與 batch size

最後一段回到計算成本。N 筆 D 維資料時，batch 梯度下降每步要 `O(ND)`。講義的論證是：訓練誤差本來就只是測試誤差的經驗估計，單一資料點的誤差也是一個（很吵的）估計。所以每步只抽一筆算梯度（SGD），成本降到 `O(D)`；抽 B 筆（mini-batch），成本是 `O(BD)`。實務上會先打亂資料再依序掃過，掃完一輪叫一個 epoch。B = 1 時 mini-batch 就是 SGD，兩者通常都叫 SGD。

batch size 怎麼選，講義的取捨表是：

- **大 batch**：梯度估計更準、能吃滿硬體平行度。
- **小 batch**：每步便宜、可以多走幾步，隨機性有助跳出局部極小。
- **常見做法**：把 batch 加大到硬體跑滿為止，學習率跟著 batch size 等比例放大。

## Lec 15：用一個小例子重走一遍

`lec15.pdf` 的封面寫「Plus Momentum, SGD, MiniBatch SGD and Adagrad/Adam」，指定閱讀是 Bishop 第 7 章。開頭是 Dimakis 的手算練習：一個深度 1 的線性模型，參數是 `θ = {w1, w2, b}`，給一張 x1、x2、y 的小資料表，要你依序做三件事：

1. 算出每筆資料的預測 f(x)。
2. 寫出損失函數 J。
3. 算出梯度（「梯度是一個向量，第一個座標是 dJ/dw1」），然後沿反方向更新模型。

講義把「Training = Learning = Fitting = Optimizing」寫在同一行，強調這幾個詞在這門課裡指的是同一件事。後半段接回 Lec 13 的收斂分析和各種優化器。如果 Lec 13 的特徵值推導讀起來太抽象，建議先照 Lec 15 開頭把那張小表手算一次，再回去讀推導。

## Discussion 6、7 在練什麼

打開兩份 worksheet 後，題目和講次的對應如下：

- **Discussion 6**（和 Lec 13 同週）其實在收尾 logistic regression：證明 log-odds 對 x 是線性的；證明最大化 likelihood 等價於最小化 cross-entropy；以及 likelihood ratio test（Neyman–Pearson 引理，含高斯情形下的檢定形式）。這些是[上一篇 Lec 11–12](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-11-12-classification-logistic) 的延伸，也為 Lec 16 的 cross-entropy 鋪路。
- **Discussion 7**（和 Lec 15 同週）第一題直接接梯度下降：在 d > n 的過參數化最小平方問題裡，從 θ₀ = 0 出發，證明梯度下降的極限是最小 Euclidean norm 解，並寫成 `Xᵀ(XXᵀ)⁻¹y`。第二題證明 ROC 曲線下面積等於「隨機正樣本分數高於隨機負樣本」的機率。

第一題值得特別花時間。它說明梯度下降除了「找到一個解」，還會偏好某一種解，這個觀念後面講泛化和 double descent 時會再出現。

## Fall 2026 對應講次

[Fall 2026](https://eecs189.org/fa26/)（Norouzi／Gonzalez）的對應內容是 Lecture 10「Gradient Descent (1)」與 Lecture 11「Gradient Descent (2)」，排在 9/29 和 10/1，後面接一場 Gradient Descent discussion。

## 延伸閱讀

- 同一段內容的另一種講法：[CMU 11-785 梯度下降](/posts/ai/2026-08-22-cmu-11785-04-gradient-descent)、[loss surface 與 momentum](/posts/ai/2026-08-22-cmu-11785-06-loss-surfaces-momentum)、[SGD 與二階方法](/posts/ai/2026-08-22-cmu-11785-07-sgd-second-order)、[優化器與正則化](/posts/ai/2026-08-22-cmu-11785-08-optimizers-regularization)
- 經典 ML 對照：[Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)

上一篇：[Lec 11–12：分類與 logistic regression](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-11-12-classification-logistic)。下一篇：[Lec 14、16：MLE vs MAP、bias-variance、熵與 KL](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-14-16-mle-map-bias-variance-entropy)。

## 今晚可以做的動作

1. 打開 `lec15.pdf` 開頭的小資料表，用紙筆算一次梯度並更新一步，確認你能寫出 dJ/dw1。
2. 取一個二維二次函數（例如講義的 `(w0 − 1)² + (w1 − 2)² + 1`），故意把一個方向的係數放大 100 倍，用 NumPy 跑梯度下降，試出讓它發散的最小 η，對照 `2/λ_max`。
3. 做 Discussion 7 第一題，做完再看 Walkthrough。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS189 Spring 2026 課程首頁與排程](https://eecs189.org/sp26/)
- [CS189 Spring 2026 Syllabus](https://eecs189.org/sp26/syllabus/)
- [Lecture 13 Notes 資料夾（lec13.pdf、手寫稿）](https://drive.google.com/drive/folders/1FEQYDjdSckr1DRVQ06day94rTZtcB0ls)
- [Lecture 13 錄影：Conv. + Momentum + Adam + Stochastic Gradient Descent](https://www.youtube.com/watch?v=1EAoNdjsOZw)
- [Lecture 15 Notes 資料夾（lec15.pdf）](https://drive.google.com/drive/folders/1Ei_AOgIkLNUFI6JZyoDfWG-_VEm7Xg-1)
- [Lecture 15 錄影：Learning with Gradient Descent](https://www.youtube.com/watch?v=6zV_GGgUa0Y)
- [Discussion 6 PDF](https://drive.google.com/file/d/1FFNxd-TEkK53m8s-eHfN9V6xXsoSqMHa/view)／[Solutions](https://drive.google.com/file/d/1gfUeWtTRnIXlj_H8pnL3BSl4THOriQQG/view)
- [Discussion 7 PDF](https://drive.google.com/file/d/1SloZ3iTpq9qEJ-0uWhQtcdT0fhZh5VVH/view)／[Solutions](https://drive.google.com/file/d/16jrdhv1s9cgvaU76tTZdVFIA_zE1sgWf/view)
- [CS189 Spring 2026 講課播放清單](https://www.youtube.com/playlist?list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE)
- [CS189 Fall 2026 排程](https://eecs189.org/fa26/)

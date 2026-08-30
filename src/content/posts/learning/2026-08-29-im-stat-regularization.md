---
title: "Ridge、Lasso、weight decay 為什麼能讓模型穩一點？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 41
tldr: "Ridge、Lasso、weight decay 為什麼能讓模型穩一點？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 41 篇：Ridge、Lasso、weight decay 為什麼能讓模型穩一點？"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-regularization-en)

前面看過 MAP 之後，regularization 就不再只是「工程上讓模型穩一點」的技巧。它可以被理解成一種明確的偏好：除非資料真的有足夠證據，否則不要讓參數跑得太極端。

這篇要把 Ridge、Lasso、weight decay 放在同一張圖裡。考試常問 penalty 形式、bias-variance tradeoff、係數如何改變；ML/AI 實務則會問 validation 怎麼選強度、特徵高度相關時會發生什麼事、正則化能不能替你修掉資料洩漏。

## loss 加 penalty 在做什麼

Regularization 常寫成：

```text
minimize loss + lambda × penalty
```

`loss` 衡量模型對資料貼得好不好。`penalty` 衡量參數是否太大、太複雜或太不穩。`lambda` 決定你願意用多少訓練集表現，換取比較保守的模型。

`lambda` 越大，模型越受限制，係數通常越小，variance 可能下降，bias 可能上升。

`lambda` 越小，模型越接近沒有 regularization 的估計，訓練資料上可能更漂亮，但對新資料更容易不穩。

這就是 bias-variance tradeoff。Regularization 用一點偏差換取比較低的變異，目標是讓新資料上的表現更穩。

## Ridge：縮小係數

Ridge regression 使用 L2 penalty：

```text
sum_j beta_j^2
```

目標函數可以寫成：

```text
RSS + lambda sum_j beta_j^2
```

Ridge 會把係數往 0 拉，但通常不會剛好變成 0。它很適合處理多重共線性。當兩個變數高度相關時，OLS 可能在兩者之間分配出很不穩的係數；換一批資料，某個係數忽大忽小，甚至方向改變。

Ridge 透過懲罰大係數，讓解比較穩。它常保留兩個相關變數，只是把它們的係數一起縮小。

## Lasso：縮小，也可能選變數

Lasso 使用 L1 penalty：

```text
sum_j |beta_j|
```

目標函數是：

```text
RSS + lambda sum_j |beta_j|
```

Lasso 的特色是可能把某些係數壓成剛好 0。因此它同時有 regularization 和 variable selection 的效果。

這在 feature 很多時有吸引力。模型不只變得比較保守，也可能變得比較稀疏、比較好部署、比較好解釋。

但 Lasso 在高度相關變數之間可能比較不穩。兩個 feature 都有訊號時，它可能挑其中一個留下，另一個壓到 0；換一批資料，留下的那個可能換人。

## 手算例題：比較 regularized objective

假設有兩個模型 A 和 B。它們的訓練 loss 是：

```text
loss(A) = 100
loss(B) = 94
```

只看訓練 loss，B 比較好。

現在加入 L2 penalty，`lambda = 0.5`。兩個模型的係數平方和是：

```text
penalty(A) = 6
penalty(B) = 24
```

regularized objective：

```text
objective(A) = 100 + 0.5 × 6 = 103
objective(B) = 94 + 0.5 × 24 = 106
```

加入懲罰後，A 較好。這表示 B 雖然比較貼訓練資料，但它用了更大的係數。若你擔心泛化，A 可能是比較穩的選擇。

## lambda 要怎麼選

`lambda` 不應只靠訓練 loss 選。若只看訓練資料，最小的 `lambda` 往往最有利，因為模型最自由。

比較合理的做法是用 validation set 或 cross-validation。你在 training data 上訓練不同 `lambda` 的模型，再用 validation performance 選擇。最後才用 test set 做一次乾淨報告。

這個流程在考試裡可以寫成：regularization strength 是 tuning parameter，應該用 out-of-sample performance 選，不應用同一份訓練資料同時訓練、選擇、評估。

## weight decay、dropout、early stopping

深度學習裡的 regularization 不只 Ridge 和 Lasso。

Weight decay 很接近 L2 penalty，限制權重不要太大。

Dropout 在訓練時隨機關掉部分 units，迫使模型不要過度依賴某些路徑。

Early stopping 則是在 validation performance 開始變差時停止訓練，避免模型繼續記住訓練資料細節。

它們形式不同，目標都相近：控制模型複雜度，改善泛化。

## 這在 ML / AI 哪裡會用到

在 ML 專案裡，regularization 是防止模型把訓練資料背起來的基本工具。資料少、feature 多、模型大、噪音高時，它尤其重要。

在 LLM 或深度模型裡，你未必每天手寫 Ridge objective，但 weight decay、dropout、early stopping、data augmentation 都在處理類似問題。模型容量太大時，訓練分數可以很漂亮，真正要看的是 validation / test 表現。

Regularization 也不是萬能。它無法修掉資料洩漏、錯誤標籤、訓練測試分布不一致。它只能在模型複雜度這一層幫你變穩。

## 題型怎麼辨識

看到 `loss + lambda penalty`，先分清楚 loss 和 penalty。

看到 L2、Ridge、weight decay，重點是縮小係數、降低變異。

看到 L1、Lasso，重點是稀疏解和變數選擇。

看到 bias-variance，從 `lambda` 強弱說明模型自由度如何改變。

看到 ML 調參，答案要回到 validation 或 cross-validation。

## 常見錯誤

- 把 regularization 理解成讓模型表現變差，而不是控制泛化風險。
- 以為 Ridge 會自動選變數；Ridge 通常縮小係數，不會壓成 0。
- 以為 Lasso 在高度相關 feature 裡一定穩定選到真正重要的那個。
- 用 training loss 選 `lambda`。
- 以為 regularization 能補救資料洩漏或分布漂移。

## 練習題

1. 比較 Ridge 與 Lasso：penalty 形式、係數效果、何時可能產生稀疏解。
2. 寫出 `loss + lambda * penalty`，並說明 `lambda` 變大時模型複雜度通常如何改變。
3. 若 `loss(A)=80`、`penalty(A)=4`，`loss(B)=76`、`penalty(B)=16`，`lambda=0.5`，哪個 objective 較小？
4. 為什麼 regularization 可能增加 bias，但降低 variance？用一句話接到 bias-variance tradeoff。
5. 在深度學習中，weight decay、dropout、early stopping 各自如何扮演控制過度配適的角色？

## 下一篇怎麼接

Regularization 仍然假設你選了一個明確的模型形式。下一篇會看 nonparametric methods：當你不想先把資料壓進少數固定參數描述的分布時，還有哪些比較彈性的推論和建模方式。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐迴歸、MSE 與模型複雜度的基礎語言。
- Stanford CS109 支撐泛化、模型選擇與 overfitting 的統計直覺。
- scikit-learn 支撐 Ridge、Lasso、regularized models 與 validation-based tuning 情境。

## 參考資料

- [Regularization、Ridge、Lasso、L1、L2、weight decay 與 bias-variance tradeoff：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)

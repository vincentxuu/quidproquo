---
title: "CMU 07-280 Lecture 9：Logistic Regression 如何把分類改寫成機率估計"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, machine-learning, logistic-regression, classification]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 9
type: deep-dive
tldr: "Lecture 9 不直接預測 0 或 1，而以 sigmoid 建模 P(y=1|x)，再用 cross-entropy 與凸最佳化學出參數；多類別版本自然延伸成 softmax regression。"
description: "逐段導讀 CMU 07-280 Spring 2026 Lecture 9：機率分類、cross-entropy、sigmoid、梯度、凸性與 softmax regression。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-09-logistic-regression-en)

這是 CMU 07-280 Spring 2026 的第 9 講，官方題名是 **Logistic Regression**，日期為 2026 年 2 月 10 日。這一講把前面的線性迴歸與最佳化接到分類：模型不再硬猜某次事件會不會發生，而是估計事件發生的機率。官方沒有公開逐講錄影，因此本文只依公開講義、pre-reading、Recitation 5 與作業題目整理，不還原課堂口述。

## 官方材料與讀取範圍

核心來源是 [Lecture 9 官方 PDF](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec9_Logistic_Regression.pdf)與 [Feature Engineering & Logistic Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Feature_Eng_and_Logistic_Reg.pdf)。練習面以 [Recitation 5 解答](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec5_sol.pdf)核對二元與多類別公式，HW5 則把同一條線接到實際梯度下降實驗。本文不使用 Fall 2026 的課表題名。

## 承上問題：為什麼不能繼續用一條直線預測 0 或 1

Lecture 8 已經說明怎麼以梯度下降調整參數，但分類輸出有一個根本問題：同一個輸入附近可能同時出現成功與失敗。官方講義用 LLM 任務成功率為例；若某種難度的任務成功率是 50%，硬輸出 `0` 或 `1` 都會錯一半。真正要估的是 `P(y=1|x)`。

線性分數 `z = θᵀx` 沒有限制，可能落在任何實數；機率必須落在 `[0,1]`。Sigmoid 完成這個轉換：

```text
p̂ = σ(z) = 1 / (1 + exp(-z))
```

`z=0` 時 `p̂=0.5`；正分數推向 1，負分數推向 0。決策邊界仍是 `θᵀx=0`，所以 logistic regression 對原始特徵仍是線性分類器。

## 完整概念脈絡：機率、損失、梯度與凸性

只輸出機率還不夠，還要有能懲罰錯誤信心的損失。二元 cross-entropy 是：

```text
ℓ(p̂,y) = -y log(p̂) - (1-y) log(1-p̂)
```

若真實標籤是 1，模型把機率從 0.6 提到 0.9，損失下降；若它自信地報 0.001，損失會非常大。這比只看分類對錯多保留了一層資訊：模型到底有多確定。

把 sigmoid 與 cross-entropy 合起來，單筆資料的梯度會化成：

```text
∇θJ(i)(θ) = (p̂(i) - y(i)) x(i)
```

這個式子值得直接讀懂。`p̂-y` 是機率殘差；`x` 決定哪個方向的權重該調。預測太高時殘差為正，梯度下降會把相應分數往下推。官方材料也強調，logistic regression 的 empirical risk 對 `θ` 是凸函數，因此局部極小值也是全域極小值；這讓 GD／SGD 有清楚的最佳化目標。

多類別時，每一類有一組權重 `θk`，softmax 把全部分數共同正規化：

```text
P(y=k|x) = exp(θkᵀx) / Σj exp(θjᵀx)
```

這不是把 K 個獨立 sigmoid 湊在一起；分母讓所有類別機率相加為 1，也讓某一類分數上升時影響其他類別。

## 可重做小例子：一筆資料怎麼推動權重

令 `x=[1,2]`、`θ=[0,0]`、`y=1`。起始分數 `z=0`，所以 `p̂=0.5`。梯度為：

```text
(0.5-1)[1,2] = [-0.5,-1]
```

若學習率 `α=0.1`，更新後：

```text
θ ← θ - α∇J = [0.05,0.1]
```

重新計算得 `z=0.25`、`p̂≈0.562`。一次更新就把正例機率往正確方向推。把 `y` 改成 0 重算，梯度方向會完全相反。這個兩行計算比背公式更能確認你是否理解符號。

## Recitation／HW 對應

Recitation 5 要求把 binary softmax 化成 sigmoid，並檢查兩類參數其實只透過差值影響機率。HW5 的公開 written prompt 要學生比較多個梯度下降模型的收斂順序，也比較 closed-form weighted regression 與每次 gradient iteration 的計算成本。它不是只考 logistic formula，而是在問：同一個 ERM 問題，表示方式與最佳化方法如何影響實際訓練。

匿名讀者可以重做推導與小型數值實驗；完整 notebook、Gradescope autograder 與 staff feedback 不等於全部公開，不能把「看得到 PDF」寫成「能完整修課」。

## 延伸對照：logistic regression 與線性迴歸差在哪

兩者都先算 `θᵀx`，也都能用 gradient descent；差別在觀測模型。線性迴歸把輸出視為帶 Gaussian noise 的連續值，logistic regression 把標籤視為 Bernoulli outcome。Lecture 16 會用 maximum likelihood 把這兩個損失重新推導成同一套原則。

Lecture 10 接著處理另一個限制：決策邊界對原始特徵仍是線性的。要增加表達能力，可以先做 feature transform；但特徵愈多，過度擬合也愈嚴重，因此 regularization 會和 feature engineering 一起出現。

## 今晚可以做的動作

拿三筆二維資料，從 `θ=0` 開始手算兩次 SGD：每次依序寫出 `z`、`p̂`、cross-entropy、`(p̂-y)x` 和更新後的 `θ`。再把其中一筆標籤反轉，觀察哪一個梯度分量變化最大。最後將同一批資料加入 `x1²` 特徵，為 Lecture 10 預備。

## 參考資料

- [CMU 07-280 Spring 2026 Lecture 9：Logistic Regression](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec9_Logistic_Regression.pdf)
- [Feature Engineering & Logistic Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Feature_Eng_and_Logistic_Reg.pdf)
- [Recitation 5 solution：Logistic Regression & Regularization](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec5_sol.pdf)
- [HW5 written component](https://www.cs.cmu.edu/~07280/assignments/hw5_blank.pdf)

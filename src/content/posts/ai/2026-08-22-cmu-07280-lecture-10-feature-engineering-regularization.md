---
title: "CMU 07-280 Lecture 10：Feature Engineering 與 Regularization 如何交換表達力和穩定性"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, machine-learning, feature-engineering, regularization]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 10
type: deep-dive
tldr: "Lecture 10 先用 φ(x) 讓線性模型表達非線性，再以 train/validation/test 分工、L1/L2 regularization 與 model selection 限制新增自由度造成的過度擬合。"
description: "導讀 CMU 07-280 Spring 2026 Lecture 10：特徵轉換、多項式模型、過度擬合、L1/L2 正規化與資料切分。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-10-feature-engineering-regularization-en)

這是 Spring 2026 第 10 講 **Feature Engineering and Regularization**，日期為 2 月 12 日。Lecture 9 的 logistic regression 對輸入特徵仍只畫出線性邊界；這一講先用 feature transform 擴張可表示的函數，再立刻處理擴張後的過度擬合。沒有公開逐講錄影，本文也不補寫課堂口述。

## 官方材料與讀取範圍

本文深讀 [Feature Engineering & Logistic Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Feature_Eng_and_Logistic_Reg.pdf)、官方 [Model Selection deck](https://www.cs.cmu.edu/~07280/lectures/model%20selection.pdf)、[Recitation 5 解答](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec5_sol.pdf)與 HW5。Spring 2026 課表原本連到的 `07280_S26_Lec10_Regularization.pdf` 目前回傳 404，因此本文不宣稱讀過那份 deck，也不拿 Fall 2026 材料補洞。

## 承上問題：線性模型的限制到底在模型還是資料表示

若資料沿拋物線分布，`h(x)=b+w₁x` 顯然配不好。但把 `x²` 加成第二個特徵後，模型變成：

```text
h(x) = b + w₁x + w₂x²
```

它對原始 `x` 是非線性的，對參數 `w` 卻仍是線性的，所以原本的 linear regression 最佳化方法完全能用。Feature engineering 的核心不是換掉 learner，而是先用 `φ(x)` 重寫輸入空間。

## 完整概念脈絡：φ(x) 擴張假設空間，也擴張出錯方式

一般化後，`φ: Rᴷ→Rᴹ` 可以產生多項式、交互作用、週期函數、距離或領域知識特徵。訓練與推論必須套同一個 transform，否則參數所在的座標系根本不同。

自由度提高後，training error 通常只會下降，卻不代表新資料更準。高次多項式可以穿過每個訓練點，點與點之間卻劇烈擺動。這正是 model selection 需要 validation set 的原因：

```text
training set   → fit parameters
validation set → choose degree / λ / architecture
test set       → one final unbiased estimate
```

若反覆查看 test error 再選模型，test set 就已參與調參，不再是獨立評估。

Regularization 直接把「參數不要過度複雜」寫進 objective。以原始 empirical loss `J(θ)` 表示：

```text
L2: J(θ) + λ ||θ||²₂
L1: J(θ) + λ ||θ||₁
```

`λ=0` 不限制參數；`λ` 太大則把模型壓到欠擬合。L2 平滑地縮小權重，L1 的尖角幾何更容易讓部分權重變成正好為零，因此常與 sparsity 相連。兩者都不是免費提升準確率，而是以偏差交換較低變異。

## 可重做小例子：同一條曲線，三個 λ

假設特徵是 `φ(x)=[1,x,x²,x³]`，某次未正規化擬合得到 `θ=[1,0.4,-0.1,12]`。最後一項很大，代表模型用三次項追逐訓練細節。

你不需要解完整最佳化，就能比較三個候選：

```text
λ = 0      training loss 最低，validation loss 可能高
λ = 0.01   三次項被縮小，validation loss 可能下降
λ = 100    所有權重接近 0，training/validation 都欠擬合
```

正確做法不是看哪個敘述聽起來合理，而是固定 training set，對候選 `λ` 各自訓練，再只用 validation error 選一次。最後才開 test set。

## Recitation／HW 對應

Recitation 5 把 logistic regression 與 regularization 放在同一張 worksheet，讓學生從機率模型一路看到參數限制。HW5 則要求比較不同模型收斂、選出 energy-use dataset 的最佳模型，並說明用什麼證據做選擇。它迫使學生把「模型很彈性」改寫成可觀察的 train/validation 曲線，而不是只報一個 training score。

公開 PDF 可以支持手算與自建小實驗；HW notebook、線上元件與評分回饋並未形成完整匿名課程包。

## 延伸對照：手做特徵與讓網路學特徵

Feature engineering 由人指定 `φ(x)`，可解釋、資料需求低，也把假設寫得很明白；缺點是複雜影像或語言很難靠人列完。Lecture 11 的 neural network 會把 `φ` 本身也變成可學參數。Regularization 並不因此消失：weight decay、dropout、early stopping 都在處理相同的 generalization 問題。

## 今晚可以做的動作

取 8 個帶少量雜訊的 `(x,y)` 點，分別擬合 1、3、7 次多項式。固定其中 2 點只作 validation，不參與訓練。記下三個模型的 training 與 validation MSE，再對 7 次模型加入三個不同 `λ`。不要先看 test 點；等選完 degree 與 `λ` 才做最後一次評估。

## 參考資料

- [Feature Engineering & Logistic Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Feature_Eng_and_Logistic_Reg.pdf)
- [CMU 07-280 Model Selection slides](https://www.cs.cmu.edu/~07280/lectures/model%20selection.pdf)
- [Recitation 5 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec5_sol.pdf)
- [HW5 written component](https://www.cs.cmu.edu/~07280/assignments/hw5_blank.pdf)

---
title: "CMU 07-280 Lecture 7 導讀：Linear Regression 與 Normal Equation"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, linear-regression, machine-learning, linear-algebra]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 7
tldr: "Lecture 7 把 ERM 套到 linear functions 與 squared loss，從一維 slope 推到矩陣形式 `argmin ||y-Xθ||²`，再在 `XᵀX` 可逆時得到 normal equation。"
description: "完整導讀 CMU 07-280 Spring 2026 Linear Regression：hypothesis class、squared loss、一維 closed form、design matrix、normal equation 與可逆條件。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-07-linear-regression-en)

這是 **CMU 07-280 Spring 2026 Lecture 7：Linear Regression**。Lecture 5 的 ERM 在這裡第一次完整解到底：選 linear hypothesis、選 squared loss，把資料疊成 matrix，最後求出最佳參數的 closed-form expression。

## 官方材料與讀取範圍

本文完整讀取 [Linear Regression lecture notes](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes_Linear_Regression.pdf)、[Optimization and Linear Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Optimization_and_Linear_Regression.pdf)、[Recitation 4](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4.pdf)與[solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4_sol.pdf)，並核對 [HW4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf)。沒有公開逐講錄影。

## 承上問題：把 hypothesis class 換成直線，ERM 長什麼樣

輸入與輸出先取 `X=R, Y=R`，hypothesis class 是所有直線：

```text
h_(ω,b)(x) = xω+b
```

搭配 squared loss，ERM 是找讓平均平方殘差最小的 `ω,b`。為了先看清核心，notes 暫設 `b=0`，只擬合通過原點的線，再推廣到多維與 intercept。

## 完整概念脈絡：從 scalar 到 design matrix

一維、通過原點時，objective 為：

```text
J(ω) = (1/N) Σ (y(i)-x(i)ω)²
```

展開或微分後，minimizer 是：

```text
ω* = Σ x(i)y(i) / Σ x(i)²
```

多維時，把 intercept 併進 feature vector 的常數 1，令 `hθ(x)=xᵀθ`。每筆 `x(i)ᵀ` 疊成 design matrix `X`，labels 疊成 vector `y`：

```text
J(θ) = ||y-Xθ||²
     = yᵀy - 2θᵀXᵀy + θᵀXᵀXθ
```

令 gradient 為零得到 normal equations：

```text
XᵀXθ = Xᵀy
```

若 `XᵀX` 可逆，則：

```text
θ* = (XᵀX)^-1 Xᵀy
```

Notes 特別提醒不能直接寫 `θ=X^-1y`：`X` 通常不是 square matrix，也未必可逆。即使 `XᵀX` 是 square，features 線性相依時仍會 singular。本講的 closed form 明確帶著 invertibility 假設。

## 可重做的推導：兩點擬合通過原點的線

取資料 `(x,y)={(1,2),(2,3)}`：

```text
Σxy = 1·2 + 2·3 = 8
Σx² = 1² + 2² = 5
ω* = 8/5 = 1.6
```

所以 `h(x)=1.6x`，兩點預測為 1.6 與 3.2。Squared errors 是 `0.4²` 與 `(-0.2)²`，平均為 0.1。

用 derivative 再驗一次：

```text
J(ω)=[(2-ω)²+(3-2ω)²]/2
dJ/dω=5ω-8
```

令 derivative 為零，同樣得到 `ω=8/5`。這就是下一講 gradient descent 要逐步逼近的最低點；linear regression 特別之處，是此處可直接解出來。

## Recitation／HW 對應

Recitation 4 前半建立 scalar、vector、matrix derivatives，後半從 `J(θ)=||Xθ-y||²`推導 gradient 與 closed form。Solution 使用 matrix identities 把每個 shape 對齊，這比只記 normal equation 更重要。

HW4 的 linear-regression 題要求把具體 dataset 的 objective 展開成多項式、寫 partial derivatives，並設計具有指定解數量的 datasets。後面還推 weighted least squares 與 multi-output regression，檢查你是否理解公式來自 objective，而不是只能套單一版本。

## 延伸對照：closed form 與數值解不是誰取代誰

Normal equation 給解析答案，適合看清幾何與推導；但直接形成與反轉大型 `XᵀX` 可能昂貴，也可能有數值穩定性問題。Lecture 8 轉向 gradient-based optimization，不是因為 linear regression 突然無解，而是要建立能延伸到沒有 closed form 的模型方法。

兩條路的共同核心仍是同一個 `J(θ)`。Closed form 解一次方程；gradient descent 用局部 slope 反覆更新。

## 今晚可以做的動作

1. 對三個一維點手算 `Σxy/Σx²`，再用微分驗證。
2. 寫出一個含 intercept 的 design matrix，逐項標 `X`、`θ`、`y` shape。
3. 找一組兩欄完全相同的 features，說明為何 `XᵀX` 不可逆。

## 參考資料

- [CMU 07-280 Spring 2026 Linear Regression lecture notes](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes_Linear_Regression.pdf)
- [07-280 Optimization and Linear Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Optimization_and_Linear_Regression.pdf)
- [07-280 Spring 2026 Recitation 4](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4.pdf)
- [Recitation 4 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4_sol.pdf)
- [07-280 Spring 2026 Homework 4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf)

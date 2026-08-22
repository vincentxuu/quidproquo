---
title: "CMU 07-280 Lecture 8 導讀：Gradient Descent、SGD 與 Learning Rate"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, optimization, gradient-descent, machine-learning]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 8
tldr: "Lecture 8 從一維 parabola 推到 vector gradient，再比較 batch GD、SGD 與 mini-batch；learning rate 決定更新是收斂、震盪或發散。"
description: "完整導讀 CMU 07-280 Spring 2026 Optimization：gradient、learning rate、stopping criteria、linear-regression gradient、local minima、batch GD、SGD 與 mini-batch。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-08-optimization-en)

這是 **CMU 07-280 Spring 2026 Lecture 8：Optimization**。Lecture 7 的 linear regression 有 normal equation；這一講故意退回 objective 的形狀，建立沒有 closed form 時仍可使用的更新規則。它也是後面 neural networks 與 backpropagation 的直接地基。

## 官方材料與讀取範圍

本文完整讀取 [Optimization lecture notes](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes.pdf)、[Optimization and Linear Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Optimization_and_Linear_Regression.pdf)、[Recitation 4](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4.pdf)與[solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4_sol.pdf)，並核對 [HW4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf)。官方沒有公開逐講錄影。

## 承上問題：沒有 inverse 或 closed form 時，怎麼找 argmin

對一維 objective `J(ω)`，minimum 右側的 derivative 通常為正，左側為負。若從任意 `ω(0)`出發，沿 derivative 反方向移動，就能往較低的 `J` 走：

```text
ω(t) = ω(t-1) - α dJ/dω
```

`α` 是 learning rate／step size。停止條件可以是 loss 改善很小、gradient 很小、參數幾乎不動，或計算預算耗盡。這些條件不完全等價：參數不動可能是已收斂，也可能只是 step 太小。

## 完整概念脈絡：從 gradient 到資料抽樣

對 vector parameter `θ∈R^d`，所有 partial derivatives 排成 gradient `∇θJ(θ)`。例如 `J(θ)=θᵀv` 的 gradient 是 `v`；`J(θ)=θᵀAθ` 的 gradient 是 `(A+Aᵀ)θ`。Vector gradient descent 更新為：

```text
θ(t) = θ(t-1) - α ∇J(θ(t-1))
```

Linear regression 的 `J(θ)=||y-Xθ||²`有 gradient `-2Xᵀy+2XᵀXθ`，令它為零就回到 normal equation。一般模型沒有可解 closed form，gradient descent 仍能嘗試找低點；對非凸函數，它不保證找到 global optimum，可能停在 local minimum。

在 ERM 中，**batch GD**每次用全部 `N` 筆樣本計算 gradient，方向穩定但單次更新昂貴。**SGD**每次均勻隨機選一筆樣本，gradient 很 noisy，卻能快速更新。**Mini-batch GD**每次用介於 1 與 `N` 之間的 `K` 筆，折衷向量化效率、記憶體與 noise。

## 可重做的推導：四個 learning rates 的三步結果

令 `J(ω)=ω²`、`ω(0)=1`。因為 derivative 是 `2ω`：

```text
ω(t) = (1-2α)ω(t-1)
```

三步後：

| `α` | multiplier | `ω(3)` | 行為 |
|---:|---:|---:|---|
| 0.25 | 0.5 | 0.125 | 穩定靠近 0 |
| 0.5 | 0 | 0 | 一步到 minimum |
| 1 | -1 | -1 | 在 ±1 間震盪 |
| 2 | -3 | -27 | 絕對值快速發散 |

「gradient 指向上升最快方向」並不保證任意步長都下降。方向與距離必須一起設計。Notes 也提到可讓 `αt=1/√t`隨 iteration 下降，或使用更進階的 adaptive methods，但本講不展開那些演算法。

## Recitation／HW 對應

Recitation 4 的 matrix-calculus 題是本講必要前置：若 `∇θJ` 的 shape 算錯，更新式即使語法可跑也不是原 objective 的 gradient。Solution 從 `J(θ)=(Xθ-y)ᵀ(Xθ-y)`推導出 gradient 與 closed form，剛好連接 Lectures 7–8。

HW4 要求對具體 linear-regression objective 寫每個 parameter 的 partial derivative，並處理 weighted least squares。雖然作業尚未要求實作 SGD，它已經測試能否把不同 objective 轉成正確更新方向。公開 PDF 可自行重做，正式評分與回饋不公開。

## 延伸對照：SGD 的 noise 不是單純缺陷

Batch gradient 是整份資料的確切平均方向；SGD 是隨機估計。單一步看，後者更不穩；看單位計算成本，它能更早產生更新，也能在大型資料下持續學習。Mini-batch 不是模糊折衷，而是現代硬體上常見的計算單位。

本講只宣稱 SGD noisy but fast，沒有進一步證明 noise 改善 generalization 或一定逃離 local minima。那些效果需要額外假設與證據，不能從這份 notes 自動推出。

## 今晚可以做的動作

1. 對 `J(ω)=ω²`手算表中的四組更新，再畫出 `J` 與每一步位置。
2. 對兩筆 linear-regression 資料計算一次 batch gradient，再分別算兩個 single-sample gradients。
3. 寫一個停止條件，並說明它可能誤判的情況。

## 參考資料

- [CMU 07-280 Spring 2026 Optimization lecture notes](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes.pdf)
- [07-280 Optimization and Linear Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Optimization_and_Linear_Regression.pdf)
- [07-280 Spring 2026 Recitation 4](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4.pdf)
- [Recitation 4 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4_sol.pdf)
- [07-280 Spring 2026 Homework 4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf)

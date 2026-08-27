---
title: "Stanford CS229 Lecture 2：線性迴歸如何從誤差走到 LMS"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, linear-regression, gradient-descent]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 3
tldr: "Lecture 2 把監督式學習寫成 hθ(x)=θᵀx，以平方誤差定義目標，再比較梯度下降、mini-batch 與 normal equation 的不同求解路徑。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 2：監督式學習設定、線性迴歸、LMS、梯度下降、mini-batch 與 normal equation。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-02-linear-regression-lms-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 3 篇，對應 **Stanford CS229, Spring 2021, Lecture 2**。課程在 2021 年 3 月 31 日的官方題目是 **Supervised learning setup. LMS.**；本文實際使用當學期 live lecture notes，以及 syllabus 指定的共用 Supervised Learning notes Sections 1–3。錄影只在 Canvas 提供，沒有作為本文來源。

這講的主脊是把「從範例學會預測」拆成三層：先定義假設函數，再定義錯誤，最後選擇如何降低錯誤。線性迴歸不是因為真實世界一定是直線，而是它讓模型、目標函數與最佳化方法第一次完整接起來。

## 從資料表變成假設函數

令每個輸入 `x ∈ R^d`，參數 `θ ∈ R^(d+1)`；把常數特徵設為 `x₀=1` 後，線性假設可寫成：

```text
hθ(x) = θᵀx
```

房價例子裡，特徵可以是坪數、房間數與土地大小。`θ_j` 決定第 `j` 個特徵對預測的線性貢獻。這個表示的優點不是「每個關係真的線性」，而是同一套向量運算能處理多個特徵，偏差項也能納入同一個內積。

## 平方誤差把「好」變成可以最佳化

筆記用 least squares 衡量預測與標籤的距離：

```text
J(θ) = 1/2 Σ_i (hθ(x^(i)) - y^(i))²
```

前面的 `1/2` 只是讓微分後的係數消掉，不改變最小點。平方會讓正負誤差都付出代價，也會放大較大的殘差。目標不是讓每一筆都完全命中，而是在整個訓練集上找到總平方誤差較小的參數。

這也揭露限制：平方誤差對離群值敏感；若標籤噪音很重或尾端很長，少數極端樣本可能主導解。Lecture 2 建立基準模型，沒有宣稱它適合每一種誤差分布。

## LMS 更新是在沿著斜坡往下走

梯度下降反覆計算目標函數對參數的偏導，再往反方向移動：

```text
θ_j := θ_j - α ∂J(θ)/∂θ_j
```

對平方誤差，單筆範例產生的方向可寫成 `(hθ(x)-y)x_j`。直覺很直接：預測過高時，更新會沿著讓預測下降的方向調整；誤差越大、該特徵越大，這筆資料造成的推力越強。`α` 是 learning rate，太大可能跨過谷底，太小則會走得很慢。

全批次更新使用所有訓練範例，方向穩定但每一步昂貴。筆記也介紹 mini-batch：隨機取 `b` 筆估計梯度。它以較嘈雜的方向換取更快的單步計算；批次大小沒有由理論在這講給出唯一答案，筆記的務實說法是依實際表現選擇。

## Normal equation 是另一條路，不是另一個模型

線性 least squares 還可以把所有樣本排進 design matrix `X`，由一階條件得到：

```text
XᵀX θ = Xᵀy
```

若相關矩陣可逆，常見寫法是 `θ=(XᵀX)⁻¹Xᵀy`。它直接解出駐點，不用 learning rate，也不用反覆迭代。這和梯度下降學的是同一個線性模型、最小化同一個平方誤差；差異在求解方式。

直接解線性系統會受特徵數與數值條件影響，`XᵀX` 也可能不可逆。因此公式不應被讀成「任何資料都先真的算反矩陣」。Lecture 2 的重點是看見 closed-form 路徑，實作仍要選擇合適的線性代數解法。

## 在十八講中的位置

Lecture 2 建立 CS229 後續反覆使用的基本語法：資料 `(x,y)`、參數 `θ`、假設 `hθ`、目標 `J` 與更新規則。Lecture 3 會替平方誤差補上機率解釋，再把相同 recipe 搬到 logistic regression。之後即使模型變成神經網路，仍是在定義可微目標並尋找較好的參數。

## 延伸

用同一份小型資料分別跑全批次與 mini-batch 更新，每一步都記錄 `J(θ)`。不要只比最後誤差；畫出更新次數對 loss 的曲線，觀察穩定方向與嘈雜方向如何交換每步成本。這個實驗能具體分開「一步多準」和「一步多貴」。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Supervised Learning notes, Sections 1–3](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes1.pdf)
- [Spring 2021 Lecture 2 live notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture2_draft.pdf)

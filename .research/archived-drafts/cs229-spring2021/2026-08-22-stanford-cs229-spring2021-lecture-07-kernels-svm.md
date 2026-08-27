---
title: "Stanford CS229 Spring 2021 Lecture 7：Kernel 與 SVM 如何把高維特徵藏在內積裡"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, kernel-methods, svm]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 8
tldr: "Kernel trick 不必顯式建立高維特徵，只要能計算 K(x,z)=φ(x)ᵀφ(z)，就能把以內積表示的線性演算法搬進特徵空間；SVM 再以最大化幾何間隔選出分隔超平面。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 7：特徵映射、kernel matrix、Mercer 條件、最大間隔 SVM，以及 kernel 方法的計算限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-07-kernels-svm-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 8 篇，對應 **Stanford CS229, Spring 2021, Lecture 7**。課程表日期是 2021 年 4 月 19 日，官方題目是 **Kernels. SVM.**；本文實際使用當學期的 Live Lecture Notes 與共用講義。課程錄影未公開在這份課綱中，因此沒有把錄影當成來源。

這一講的主線很集中：先把線性模型改寫成只依賴資料點之間的內積，再用 kernel 直接計算「映射後的內積」，最後把同一套技巧接到最大間隔分類器。關鍵不在於把資料真的搬到多高維，而在於演算法是否只需要知道樣本彼此有多相似。

## 從參數空間換到樣本空間

設輸入 `x ∈ R^d`，先用特徵映射 `φ(x) ∈ R^p` 建立非線性特徵。若 `p` 很大，直接做梯度更新會讓每一步的成本跟 `p` 一起增加。講義改從參數的表示方式下手：若模型從零向量開始，而且每次更新都是資料特徵的線性組合，那麼參數始終可以寫成

```text
θ = Σᵢ βᵢ φ(xᵢ)
```

預測新點 `x` 時，線性分數便成為

```text
θᵀφ(x) = Σᵢ βᵢ φ(xᵢ)ᵀφ(x)
```

原本要保存 `p` 個參數，現在改為保存 `n` 個係數 `βᵢ`。這不是免費加速：成本從依賴特徵數改成依賴樣本數。當 `p ≫ n` 時很有吸引力；若資料筆數極大，`n` 本身就可能成為瓶頸。

## Kernel trick 省掉的是顯式特徵

定義

```text
K(x,z) = φ(x)ᵀφ(z)
```

只要 `K` 能直接算，訓練與預測就不需要真的建立 `φ(x)`。例如多項式 kernel

```text
K(x,z) = (xᵀz + 1)^q
```

等價於某個包含各種低階交互項的特徵映射，但計算 kernel 時只需先求一次原空間內積，再做加一與次方。這就是 kernel trick：不是高維特徵不存在，而是演算法只透過內積接觸它們。

講義也給出 Gaussian kernel：

```text
K(x,z) = exp(-||x-z||² / (2σ²))
```

它不以有限個多項式特徵來介紹，而是作為一個可直接衡量局部相似度的 kernel。`σ` 決定相似度隨距離衰減的尺度；這一講沒有進一步給出選參數程序，因此不能把某個固定 `σ` 寫成通用答案。

## 不是每個相似度函數都能當 kernel

對訓練樣本建立 kernel matrix：

```text
Kᵢⱼ = K(xᵢ, xⱼ)
```

如果 `K(x,z)=φ(x)ᵀφ(z)`，那麼對任何向量 `v` 都有

```text
vᵀKv = ||Σᵢ vᵢφ(xᵢ)||² ≥ 0
```

所以 kernel matrix 必須是 positive semidefinite（PSD，半正定）。講義以 Mercer theorem 表達更強的方向：若一個對稱函數對任意有限樣本所形成的 Gram matrix 都是 PSD，它便可作為合法 kernel。這提供了設計 kernel 的檢查方式，而不是看到一個「像相似度」的公式就直接套用。

這裡的限制也很實際。完整 kernel matrix 有 `n²` 個元素，建立與保存它都會隨樣本數平方成長。Kernel 方法避開了巨大 `p`，卻可能付出巨大 `n` 的代價；這個交換正是閱讀 kernel trick 時最不能省略的部分。

## SVM 為什麼要最大化間隔

對二元標籤 `yᵢ ∈ {-1,+1}`，線性分類器以 `wᵀx+b=0` 作為決策邊界。只要求分類正確會留下許多可行的超平面。SVM 加上一個選擇原則：讓離邊界最近的訓練點也盡量遠。

因為 `(w,b)` 同比例縮放不會改變邊界，可固定函數間隔：

```text
yᵢ(wᵀxᵢ+b) ≥ 1
```

在這個尺度下，幾何間隔與 `1/||w||` 成正比，因此最大化間隔等價於

```text
minimize   1/2 ||w||²
subject to yᵢ(wᵀxᵢ+b) ≥ 1
```

講義接著指出，最優解可寫成訓練樣本的線性組合：

```text
w = Σᵢ αᵢyᵢxᵢ,  αᵢ ≥ 0
```

於是測試分數只需要 `xᵢᵀx`，再把內積換成 `K(xᵢ,x)` 就能得到 kernelized SVM。真正影響邊界的是 `αᵢ>0` 的 support vectors；其他點不會直接出現在最終展開式裡。

## 這一講刻意沒有處理的事

公開手寫講義使用可線性分離的 hard-margin SVM 來建立幾何直覺，沒有完整推導 soft margin、slack variables、hinge loss 或 dual optimization。它提到 KKT conditions 是得到稀疏展開的關鍵，但沒有把每個條件逐步證完。因此本文也只停在講義支持的結論：最大間隔原始問題、解的樣本展開，以及內積如何被 kernel 取代。

Kernel 的表達力也不代表它自動泛化。特徵映射、kernel family 與超參數仍然是建模選擇；kernel matrix 是 PSD 只證明它是一個合法內積結構，不證明它適合眼前任務。

## 這一講在十八講裡的位置

Lecture 5–6 建立生成式分類器，Lecture 7 則把判別式線性模型推到非線性邊界。它也是監督式學習段落的收尾：接下來兩講轉向神經網路，用可學習的多層表示取代預先選定的 kernel。

檢查自己是否讀懂，可以做一個小推導：先把 `θ` 寫成訓練特徵的線性組合，再把 `θᵀφ(x)` 展開。若最後的預測只剩 `βᵢ` 與 `K(xᵢ,x)`，就看見了 kernel trick 真正作用的位置。

## 延伸

可以用同一批資料比較兩種成本：顯式建立二次多項式特徵，以及直接建立 Gram matrix。前者主要隨展開後的特徵數成長，後者主要隨樣本數平方成長。不要只比準確率；同時記錄記憶體與預測時需要評估多少個訓練點，才看得出這個表示轉換的代價。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 7 Live Lecture Notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture7_live.pdf)
- [Kernel Methods and Support Vector Machines notes](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes3.pdf)

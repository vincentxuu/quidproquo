---
title: "CMU 07-280 Lecture 16：Maximum Likelihood 如何統一 Logistic 與 Linear Regression"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, machine-learning, maximum-likelihood, probability]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 16
type: deep-dive
tldr: "Lecture 16 從 likelihood p(D|θ) 出發，以 i.i.d. 將聯合機率寫成乘積，再用 log 變成和；Bernoulli MLE 得到樣本比例，conditional Bernoulli 得到 logistic cross-entropy，Gaussian noise 則得到 squared error。"
description: "詳細導讀 CMU 07-280 Spring 2026 Lecture 16：likelihood、log-likelihood、Bernoulli/Gaussian MLE，以及 regression loss 的機率來源。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-16-maximum-likelihood-en)

第 16 講 **MLE and Probabilistic Modeling** 在 2026 年 3 月 17 日進行。前面幾講已使用 squared error 與 cross-entropy，這一講終於回答「為什麼是這些 loss」：先假設資料如何由未知參數產生，再選出最能解釋已觀察資料的參數。官方沒有公開逐講錄影，本文只依 lecture note、pre-reading、Recitation 9 與 HW9。

## 官方材料與讀取範圍

主要來源是 [Maximum Likelihood lecture note](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes_MLE.pdf)、完整 [MLE pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_MLE.pdf)、[Recitation 9 解答](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec9_sol.pdf)與 [HW9](https://www.cs.cmu.edu/~07280/assignments/hw9_blank.pdf)。Pre-reading 另含 categorical、multivariate Gaussian 與 conditional likelihood；本文主脊鎖定 MLE 如何重建先前 regression objectives。

## 承上問題：loss function 不是從清單裡隨便挑

MLE 的問題是：在模型假設成立時，哪個 `θ` 會讓已觀察資料最可能出現？

```text
θ̂MLE = argmaxθ p(D|θ)
```

這不是 `p(θ|D)`。Likelihood 固定資料、把參數視為函數輸入；它沒有自行加入 parameter prior。若要得到 posterior，還需要 Bayes rule 與 prior。

## 完整概念脈絡：i.i.d.、log 與 negative log-likelihood

若資料在給定 `θ` 下 independent and identically distributed：

```text
p(D|θ) = Πi p(y(i)|θ)
```

大量小機率相乘會 underflow，乘積求導也麻煩。Log 是 strictly increasing，不改變 argmax，卻把乘積變成和：

```text
log p(D|θ) = Σi log p(y(i)|θ)
```

最佳化慣例常最小化 loss，因此再取負號得到 negative log-likelihood。這三步各有假設：乘積依賴 independence，log 依賴正值與單調性，轉成 argmin 則依賴負號。

對 conditional prediction，寫成 `p(y(i)|x(i),θ)`。課程指出機器學習常仍簡稱它為 likelihood／MLE，但嚴格說是 conditional likelihood。

## 可重做推導一：biased coin 的 MLE

投 `n` 次硬幣，head 記為 1，令 `k=Σy(i)`。Bernoulli likelihood 為：

```text
L(θ) = θ^k (1-θ)^(n-k)
ℓ(θ) = k log θ + (n-k) log(1-θ)
```

令導數為零：

```text
k/θ - (n-k)/(1-θ) = 0
θ̂ = k/n
```

100 次出現 60 次 head，MLE 就是 0.6。這不是憑直覺猜比例，而是由 Bernoulli model 與 independence 推出。

## 可重做推導二：兩種 regression loss 來自兩種資料模型

若 binary label 滿足：

```text
p(y=1|x,θ)=σ(θᵀx)
```

conditional negative log-likelihood 正好是 binary cross-entropy，因此 Lecture 9 的 logistic regression 是 Bernoulli MLE。

若連續輸出滿足：

```text
y(i)=θᵀx(i)+ε(i), ε(i)~N(0,σ²)
```

Gaussian log-likelihood 中和 `θ` 有關的部分是 `-Σ(y(i)-θᵀx(i))²/(2σ²)`；最大化它等價於最小化 squared error。Loss 反映 noise assumption：改成另一種 observation distribution，objective 也會變。

## Recitation／HW 對應

Recitation 9 從 multivariate Gaussian log-likelihood 與 Lagrange multipliers 練習 constraint optimization，補足 categorical probabilities 必須相加為 1 的數學工具。HW9 再要求 MLE、N-gram sparsity 與 smoothing 等題目，把本講的 likelihood 接到後續 NLP。

匿名讀者能完整重做公開 derivations；線上元件、notebook execution environment 與 staff feedback 仍受限。

## 延伸對照：MLE 不保證模型假設正確

MLE 只在候選 model family 裡找最能解釋資料的參數。若 coin flips 其實互相依賴，或 regression noise variance 隨 `x` 改變，i.i.d.／homoscedastic Gaussian 假設就不成立。算出精確 optimum 不能修復錯誤的資料生成模型。

下一講會延續 MLE 並轉入 natural language processing。N-gram model 把序列機率拆成條件機率；未出現事件的 zero likelihood 又會迫使課程引入 smoothing。

## 今晚可以做的動作

用 10 次 coin flips 手算 Bernoulli likelihood 與 log-likelihood，在 `θ=0.1,0.2,…,0.9` 畫表，確認最大值落在 sample mean 附近。接著寫出一筆 logistic regression 的 conditional log-likelihood，逐項對照 cross-entropy。最後列出你的資料是否真的支持 i.i.d. 假設。

## 參考資料

- [CMU 07-280 Maximum Likelihood lecture note](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes_MLE.pdf)
- [Maximum Likelihood Estimation pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_MLE.pdf)
- [Recitation 9 solution：MLE and Lagrange Multipliers](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec9_sol.pdf)
- [HW9 written component](https://www.cs.cmu.edu/~07280/assignments/hw9_blank.pdf)

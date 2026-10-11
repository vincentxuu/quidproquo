---
title: "廣義線性模型：用指數族統一迴歸與分類"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, stanford, machine-learning, generalized-linear-models, exponential-family]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 4
tldr: "第三章用指數族、自然參數與連結函數，把最小平方法和邏輯斯迴歸放進同一套建模模板。"
description: "Stanford CS229 2026 主講義第三章導讀：指數族、自然參數、連結函數與廣義線性模型。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-03-generalized-linear-models-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

這篇讀的是 [2026 CS229 主講義](https://cs229.stanford.edu/main_notes.pdf)第 3 章〈Generalized linear models〉，講義頁碼 30–34。它是 **2026 notes 的逐章導讀**，不是某一季課程錄影的重建。

## 課程影片來源

本文依 2026 主講義逐章導讀，章節編號不等於影片講次。下方影片取自Stanford Online 公開的 CS229 Spring 2026 錄影，標題與本章主題相符，但只是相關補充，不是本章的逐段來源，本章原講次的錄影也未確認。官方 CS229 課程頁目前是 Summer 2026，講次錄影與教材連到需 Stanford 登入的 Canvas，因此以下只用公開的 YouTube 播放清單。

```youtube
url: https://www.youtube.com/watch?v=8gVi4Rk21Eg
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 4: Exponential Family, GLMs Classification
```

原始影片：[Stanford CS229 Machine Learning | Spring 2026 | Lecture 4: Exponential Family, GLMs Classification](https://www.youtube.com/watch?v=8gVi4Rk21Eg)

課程與錄影入口：

- [Stanford CS229 Machine Learning｜Spring 2026 播放清單（Stanford Online，17 支）](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [Stanford CS229: Machine Learning led by Andrew Ng｜Autumn 2018 播放清單（21 支）](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU)
- [官方課程／講次來源](https://cs229.stanford.edu/)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：核對的是影片主題與本章的關係。這支是 Spring 2026 Lecture 4（約 74 分鐘），字幕講指數族的形式（sufficient statistic、log partition function）、GLM 的建構（含 canonical 的結論）與 softmax 多類別分類，與本章主題相符；字幕提到高斯、Bernoulli、多項式（softmax）對應的資料型態，但沒有出現 Poisson（計數資料只是一句帶過），Poisson 部分只依講義。

## 兩個演算法其實是一個模板

前兩章看似分別處理連續與二元輸出，但它們都做同一件事：讓輸出的條件分布屬於指數族，再令分布的自然參數由輸入的線性函數決定。

指數族可寫成

\[
p(y;\eta)=b(y)\exp\left(\eta^TT(y)-a(\eta)\right).
\]

其中 \(T(y)\) 是充分統計量，\(\eta\) 是自然參數，\(a(\eta)\) 負責正規化。這個形式涵蓋高斯、Bernoulli、多項式、Poisson 等許多常用分布。

## GLM 的三個選擇

廣義線性模型的建構假設是：

1. 給定 \(x\) 後，\(y\) 服從某個指數族分布。
2. 模型輸出條件期望 \(E[T(y)\mid x]\)。
3. 自然參數滿足 \(\eta=\theta^Tx\)；多參數時則對每個自然參數使用線性預測器。

從 \(\eta\) 到平均值的映射就是 response function；反方向通常稱為 link function。這表示「選 sigmoid」不是獨立的魔法步驟，而是 Bernoulli 分布的自然參數與平均值之間的關係。

## 高斯得到線性迴歸，Bernoulli 得到 sigmoid

固定變異數的高斯分布可整理成指數族形式；講義令 \(\sigma^2=1\)，此時自然參數等於平均數。因此設 \(\eta=\theta^Tx\) 後，條件平均就是 \(\theta^Tx\)，回到普通最小平方法。若保留其他固定變異數，自然參數會相應縮放。

Bernoulli 的自然參數則是 log-odds：

\[
\eta=\log\frac{\phi}{1-\phi}.
\]

反解 \(\phi\) 就得到 \(\phi=1/(1+e^{-\eta})\)。把 \(\eta\) 設成 \(\theta^Tx\)，邏輯斯迴歸自然出現。多項式分布以同樣思路導出 softmax。

## 這個統一觀點沒有替你做的決定

GLM 並不保證選到正確的輸出分布，也不保證自然參數真的隨特徵線性變化。\(\eta=\theta^Tx\) 是建模選擇，不是由指數族定理強迫而來。過度離散、零值過多、相依樣本或錯誤連結函數，都可能讓模型失配。

它也仍然是條件模型：只描述 \(y\mid x\)，不替輸入 \(x\) 建模。下一章的 GDA 與 Naive Bayes 正好改走生成式路線，分別描述 \(p(x\mid y)\) 與 \(p(y)\)。前兩章的演算法，在這一章則被整理成可重複使用的設計規則。

## 自學練習

選一個計數資料問題。假設 \(y\mid x\) 服從 Poisson 分布，將它寫成指數族形式，找出自然參數與條件平均的關係，再推導以 \(\eta=\theta^Tx\) 為前提的 response function。最後列出 Poisson 假設可能不適合該資料的兩個理由。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方 YouTube 有主題相符的公開播放清單（Spring 2026 或舊版 Autumn 2018），已嵌入 1 支相關補充影片。
- 2026-10-10：依字幕核對影片內容。確認影片主題與本章相符，補註字幕沒有 Poisson。

## 參考資料

- [CS229 Lecture Notes（2026-08-18），Chapter 3：廣義線性模型（GLM）與指數族](https://cs229.stanford.edu/main_notes.pdf)
- [Stanford CS229 課程網站](https://cs229.stanford.edu/)

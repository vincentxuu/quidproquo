---
title: "樣本、統計量、抽樣分布三者怎麼分清楚？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 21
tldr: "樣本是資料，統計量是樣本的函數，抽樣分布是統計量在重複抽樣下的分布；這三者分清楚，推論公式才會有意義。"
description: "隨機樣本、統計量與抽樣分布入門：iid、樣本平均、標準誤，以及 validation metric 為什麼也是統計量。"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-random-samples-statistics-en)

第二層從一個很容易混淆的地方開始：樣本、統計量、抽樣分布。第一層你已經會用樣本平均、樣本比例、標準誤、信賴區間和檢定。現在要回頭問：這些從樣本算出來的數字，為什麼可以拿來推母體？

先把三個詞分開。

```text
sample: 你這次拿到的資料
statistic: 用樣本算出來的函數
sampling distribution: 重複抽樣時，統計量本身會形成的分布
```

很多錯誤都來自把第三個和第一個混在一起。你手上的資料有一個分布；如果你重複抽樣很多次，每次都算樣本平均，這些樣本平均也會有自己的分布。後者才是抽樣分布。

## iid 是什麼意思

數理推導常先假設：

```text
X1, X2, ..., Xn are iid
```

`independent` 表示每筆樣本之間沒有互相影響。`identically distributed` 表示每筆樣本來自同一個分布。

這兩個條件都很強。若你抽的是同一位使用者一天內連續 20 次點擊，資料可能不獨立。若你把平日和週末、台灣和海外、舊版產品和新版產品混在一起，資料也未必同分布。

考試常在乾淨設定下給 iid，讓你推公式。實務上要多問一句：資料收集方式有沒有破壞這個假設？

## 統計量是樣本的函數

統計量只吃樣本，不吃未知參數。樣本平均就是最熟悉的例子：

```text
xbar = (X1 + X2 + ... + Xn) / n
```

樣本比例也是統計量。樣本變異數、最大值、最小值、中位數、validation accuracy，也都是統計量。它們都可以從樣本資料直接算出來。

若 `E[Xi] = mu`、`Var(Xi) = sigma^2`，樣本平均有兩個重要性質：

```text
E[xbar] = mu
Var(xbar) = sigma^2 / n
```

第一行說樣本平均長期平均會對準母體平均。第二行說樣本數越大，樣本平均的波動越小。標準誤就是：

```text
SE(xbar) = sigma / sqrt(n)
```

這個 `SE` 描述的是樣本平均的波動，不是單筆資料的標準差。

## 手算例題：單筆資料的波動和平均的波動

假設單筆觀測值的標準差是 10，每次抽 25 筆來估母體平均。樣本平均的標準誤是：

```text
SE = 10 / sqrt(25) = 2
```

這句話的意思不是每筆資料大約差 2。單筆資料的典型波動尺度仍然是 10。變小的是「25 筆平均起來」之後的波動。

若樣本數改成 100：

```text
SE = 10 / sqrt(100) = 1
```

樣本數變成 4 倍，標準誤變成一半。這是很多信賴區間和檢定題的底層直覺：更多資料不會讓世界失去變異，它會讓估計量本身比較穩。

## 這在 ML / AI 哪裡會用到

模型評估指標也是統計量。你用 1,000 筆測試資料算 accuracy，得到 0.84；這個 0.84 是測試集這個樣本上的統計量。換一批測試資料，accuracy 可能會變。

average loss 也是同樣概念。訓練時看到的 mini-batch loss，是用一小批樣本估整體 loss。batch size 小時，loss 曲線會抖；batch size 大時，估計比較穩，但計算成本上升。

這也是 benchmark 報告需要不確定性資訊的原因。單一分數是統計量，不是模型能力的永久標籤。要比較模型，後面必須接信賴區間、bootstrap、paired evaluation 或其他不確定性處理。

## 常見錯誤

- 把原始資料分布和抽樣分布混在一起。
- 說 standard error 是單筆資料的標準差。
- 看到 iid 就忘記檢查資料收集方式。
- 把樣本統計量講成母體參數。
- 把 validation accuracy 當成模型真實能力，而不是測試集上的估計。

## 練習題

1. 用自己的話分別定義 sample、statistic、sampling distribution。
2. 寫出 `X1, ..., Xn iid` 的意思，並各舉一個違反 independent 與 identical 的例子。
3. 給定 `sigma = 12`、`n = 36`，計算 `xbar` 的 standard error。
4. 用 validation accuracy 說明：為什麼 metric 是 statistic？

## 下一篇怎麼接

這篇先把統計量的角色釐清。下一篇會更細地看抽樣分布：樣本平均、樣本比例、樣本變異數各自接到哪些分布，考試又會怎麼利用這些結果。

## 章節級參考對照

- OpenIntro / OpenStax：隨機樣本、統計量、抽樣分布與標準誤。
- Stanford CS109：iid、樣本平均期望值與變異數推導。
- scikit-learn：validation metric 作為樣本統計量的模型評估語境。

## 參考資料

- [Random Samples, Sample Statistics, Sampling Distributions, and iid in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Sampling, Data, and iid Assumptions](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists and iid Samples](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation: Metrics and Scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)

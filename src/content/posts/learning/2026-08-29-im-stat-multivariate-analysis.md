---
title: "多變量分析怎麼整理一起變動的特徵？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 48
tldr: "多變量分析怎麼整理一起變動的特徵？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 48 篇：多變量分析怎麼整理一起變動的特徵？"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-multivariate-analysis-en)

前面學過平均、變異、相關、迴歸。那些工具常把變數一個一個拿出來看。多變量分析處理的是另一種情境：特徵很多，而且它們一起變動。

這篇把 covariance matrix、correlation matrix 和 PCA 放在同一條線上。考試可能問矩陣元素怎麼解讀、主成分方向代表什麼、eigenvalue 怎麼看；ML/AI 則會在 embeddings、降維視覺化、特徵壓縮、資料品質檢查裡用到這套直覺。

## 這篇先解決什麼問題

單變數摘要會告訴你每個欄位自己的平均和變異。可是資料的結構常在欄位之間。

例如你有三個特徵：

```text
x1: 每週登入次數
x2: 每週完成任務數
x3: 每週付費金額
```

如果 `x1` 和 `x2` 高度正相關，它們可能都在描述「使用活躍度」。如果 `x3` 和前兩者相關較弱，它可能描述另一個方向：「付費能力」或「付費意願」。

多變量分析的第一個問題就是：這些特徵是各自獨立提供資訊，還是在重複描述同一個方向？

## 核心直覺

covariance matrix 把每一對變數的共同變動整理起來。兩個變數一起高、一起低，covariance 會是正的；一個高時另一個低，covariance 會是負的；沒有明顯線性關係，會接近 0。

對兩個變數來說，covariance matrix 長這樣：

```text
[ Var(X1)      Cov(X1, X2) ]
[ Cov(X2, X1)  Var(X2)    ]
```

對角線是各變數自己的變異。非對角線是變數之間的共變異數。

PCA 接著問：如果我們不要沿著原本的 `X1`、`X2` 軸看資料，而是旋轉到新的方向，哪個方向能捕捉最多變異？

第一主成分是資料變異最大的方向。第二主成分和第一主成分垂直，捕捉剩下最多的變異。這是降維的核心直覺：保留主要變動方向，丟掉比較小的方向。

## 公式 / 機制

樣本 covariance 的基本公式是：

```text
Cov(X, Y) = sum((x_i - x_bar)(y_i - y_bar)) / (n - 1)
```

correlation 則把 covariance 標準化：

```text
Corr(X, Y) = Cov(X, Y) / (s_X s_Y)
```

所以 correlation 沒有單位，範圍在 -1 到 1。這讓不同尺度的變數比較方便。

PCA 通常從中心化後的資料矩陣或 covariance matrix 出發，找 eigenvectors 和 eigenvalues：

```text
covariance matrix -> eigenvectors -> principal component directions
covariance matrix -> eigenvalues  -> variance explained by each direction
```

eigenvector 是新方向。eigenvalue 是該方向上的變異大小。

若第一個 eigenvalue 佔總 eigenvalue 的比例很高，代表資料大部分變異可以用第一主成分解釋：

```text
explained variance ratio = lambda_1 / (lambda_1 + lambda_2 + ... + lambda_p)
```

## 一步一步算例

先手算 covariance。

假設三位學生的統計與程式成績如下：

| 學生 | 統計 X | 程式 Y |
|---|---:|---:|
| A | 80 | 82 |
| B | 90 | 88 |
| C | 100 | 96 |

平均：

```text
x_bar = (80 + 90 + 100) / 3 = 90
y_bar = (82 + 88 + 96) / 3 = 88.67
```

計算偏差乘積：

```text
A: (80 - 90)(82 - 88.67) = (-10)(-6.67) = 66.7
B: (90 - 90)(88 - 88.67) = (0)(-0.67) = 0
C: (100 - 90)(96 - 88.67) = (10)(7.33) = 73.3
```

樣本 covariance：

```text
Cov(X, Y) = (66.7 + 0 + 73.3) / (3 - 1) = 70
```

正的 covariance 表示統計分數高的人，程式分數也常偏高。

若兩科分數高度正相關，PCA 的第一主成分可能接近「整體學業表現」。第二主成分可能接近「統計相對強、程式相對弱」或反過來。這不是在發現因果，只是在換一組更能描述變異的座標。

再看 eigenvalue 的小例子。假設 PCA 後兩個 eigenvalues 是：

```text
lambda_1 = 9
lambda_2 = 1
```

第一主成分解釋的變異比例：

```text
9 / (9 + 1) = 0.90
```

代表 90% 的變異集中在第一個方向。若只是要視覺化或壓縮，保留第一主成分可能已經很有用；若少數訊號藏在第二方向，丟掉它就會出事。

## 這在 ML / AI 哪裡會用到

embeddings 是高維向量。每個文件、圖片、使用者、商品都可能被表示成數十到數千維。你很難逐一解讀每一維，但可以看向量之間的距離、方向、群聚和投影。

PCA 是理解高維資料的入口，雖然現代 embedding 常用 t-SNE、UMAP 或模型內部表示。PCA 會教你三件事：

- 高維資料可以投影到少數方向。
- 投影會保留部分資訊，也會丟掉部分資訊。
- 降維圖只是診斷工具，不能單獨證明模型品質。

在 ML/AI 工作中，多變量分析會用在：

- feature compression：把高度相關特徵壓成較少方向。
- visualization：把 embedding 投影到 2D 或 3D 看群聚。
- leakage check：某些特徵若和 label 或資料來源高度綁定，圖上可能看出異常分群。
- monitoring：比較不同時間的 embedding distribution 是否漂移。
- retrieval：檢查查詢和文件向量是否形成合理鄰近結構。

但要避免過度解讀。PCA 第一主成分捕捉的是變異最大方向，不一定是業務最重要方向，也不一定是因果方向。

## 來源使用方式

- 官方考古題 PDF 只用來確認年份、科目名稱與題面，不把兩年題型當成完整範圍。
- grad-exam-prep 備考頁用來對齊學習路線、題型入口與練習節奏，不視為官方標準答案。
- OpenIntro、OpenStax 與其他開放教材用來核對公式、定義、假設與常見推導。
- Stanford CS109 與 scikit-learn 文件用來補 ML/AI 對接：模型訓練、評估、實驗與不確定性報告。

## 題型辨識提示

- 題目給多個變數，先看 covariance / correlation，而不是只看各自平均。
- 題目問 PCA，先說中心化、principal component、eigenvalue、explained variance。
- 題目問降維，答案要同時講壓縮和資訊損失。
- 題目把 PCA 結果解讀成原因時，要提醒它描述的是變異方向。

## 常見錯誤

- 忘記先中心化資料，就直接談 PCA。
- 把 covariance 和 correlation 混在一起。前者有單位，後者是標準化後的關係。
- 看到第一主成分解釋很多變異，就以為其他方向一定不重要。
- 把降維圖上的群聚當成分類效果證明，沒有回到測試資料或任務指標。
- 忽略 scaling。不同尺度的特徵會影響 covariance-based PCA。

## 練習題

1. 寫出 2x2 covariance matrix，並說明對角線與非對角線各代表什麼。
2. 用三筆資料手算一組 covariance，再判斷兩變數是正向或負向共同變動。
3. 若 `lambda_1=8`、`lambda_2=2`，第一主成分的 explained variance ratio 是多少？
4. 為什麼 PCA 第一主成分不一定是最有業務意義的方向？
5. 把 PCA 接到 embeddings：降維圖可以幫你檢查什麼？又不能證明什麼？

## 下一篇怎麼接

多變量分析把很多特徵壓成可解讀的方向。下一篇會進到 missing data：當資料表裡不是每個欄位都有值，統計推論和 ML 訓練會多出哪些風險。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐 correlation、covariance、matrix-style summaries 與多變量資料的基礎。
- Stanford CS109 支撐向量、特徵、矩陣摘要與 ML 資料表示的直覺。
- scikit-learn evaluation 文件支撐特徵處理與評估流程的語言；本文延伸到 embeddings 和降維診斷。
- 本文把 PCA 接到 feature compression、embedding visualization、distribution shift 和 retrieval diagnostics。

## 參考資料

- [Multivariate analysis、covariance matrix、correlation、PCA、eigenvalues 與 dimensionality reduction：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)

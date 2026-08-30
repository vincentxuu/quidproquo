---
title: "OLS 的假設壞掉時，迴歸線還能怎麼用？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 36
tldr: "OLS 的假設壞掉時，迴歸線還能怎麼用？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 36 篇：OLS 的假設壞掉時，迴歸線還能怎麼用？"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-linear-models-deep-dive-en)

前面已經會算一條簡單迴歸線，也會讀係數、標準誤、t 值、F test 和 R2。第三層要處理比較接近真實資料的問題：OLS 的假設如果不完全成立，迴歸線還能不能用？可以用在哪裡？解釋時要補哪些限制？

這題很重要，因為迴歸在考試和 ML/AI 都常被當成 baseline。它透明、好算、好解釋；也因為太好用，很多人會把它用到超出條件的地方。

## OLS 到底在最小化什麼

線性模型常寫成：

```text
y = X beta + epsilon
```

OLS 選擇 `beta_hat`，讓殘差平方和最小：

```text
sum_i (y_i - x_i' beta)^2
```

在矩陣形式下，若 `X'X` 可逆，估計量可以寫成：

```text
beta_hat = (X'X)^(-1) X'y
```

這個公式告訴你兩件事。第一，OLS 是用全部 feature 的線性組合來貼 `y`。第二，它很依賴 `X` 的品質。如果 feature 幾乎線性重複、尺度差很多、離群點很強，估計會變得不穩。

## 係數解釋要講「條件平均」

假設模型是：

```text
score = beta0 + beta1 hours + beta2 prior_score + epsilon
```

如果估出：

```text
beta1_hat = 2.3
```

比較好的解釋是：「在模型設定與 `prior_score` 固定下，`hours` 增加一單位時，`score` 的條件平均估計增加 2.3。」

這句話刻意留下三個限制。

第一，它說的是條件平均，不是每一個個體都一定增加 2.3。

第二，它說的是在其他變數固定下，不是單純比較所有讀書時間不同的人。

第三，它沒有直接說因果。若資料不是隨機實驗，`hours` 可能和動機、家庭資源、原本能力一起變動。迴歸係數可以控制已放入模型的變數，不能控制沒量到的變數。

## OLS 常見假設要怎麼用

入門題常列出幾個假設，但真正重要的是知道假設壞掉時，哪一種結論會受影響。

線性假設：條件平均要能被線性形式合理描述。若真實關係是彎的，線性模型可能系統性低估或高估某些區間。

誤差平均為 0：在給定 `X` 後，誤差的期望要是 0。若遺漏重要變數且它和 `X` 相關，係數解釋會偏。

獨立性：觀察值之間不能有未處理的相依。時間序列、同一使用者多筆資料、同一班級學生，都可能違反。

同質變異：不同 `X` 條件下，誤差變異要差不多。若殘差呈漏斗形，標準誤和檢定可能出問題。

常態誤差：小樣本推論常需要它支撐 t/F 檢定。樣本大時，係數估計常能靠近似處理，但離群點和 heavy tail 仍會傷害穩定性。

## 手算例題：係數、預測和殘差

假設模型估計式是：

```text
y_hat = 10 + 2x
```

有一筆資料：

```text
x = 4
y = 21
```

預測值是：

```text
y_hat = 10 + 2 × 4 = 18
```

殘差是：

```text
e = y - y_hat = 21 - 18 = 3
```

若另一筆資料 `x = 8`，模型預測：

```text
y_hat = 10 + 2 × 8 = 26
```

這種計算很直接。考試常再追問解釋：斜率 2 表示 `x` 每增加一單位，`y` 的條件平均預測增加 2。它不保證每個觀察值都照這條線走，因為每筆資料還有殘差。

若殘差圖顯示 `x` 越大，殘差散布越大，你要補一句：「係數點估計仍可作為線性摘要，但傳統同質變異下的標準誤、t 檢定與信賴區間可能不可靠，應考慮 robust standard errors、轉換變數或重新指定模型。」

## 殘差圖要看什麼

殘差圖不是報告裡的裝飾。它是在問：模型把哪些結構留在錯誤裡？

若殘差對 fitted value 呈彎曲形狀，表示線性形式可能不足。可以考慮加入多項式、交互作用、轉換變數，或換非線性模型。

若殘差呈漏斗形，表示異質變異。這會影響標準誤和檢定，尤其考試問 inference 時要寫出限制。

若少數點殘差特別大，可能是離群點。離群點不一定要刪；你要先確認是不是資料錯誤、特殊族群，或真正重要的長尾案例。

若殘差隨時間或群組排列有模式，表示相依性或群組效果沒有處理。這時一般 OLS 標準誤可能太樂觀。

## 預測和解釋的要求不同

如果目標是預測，OLS 可以是一個很好的 baseline。你會重視 validation error、RMSE、MAE、校準、out-of-sample 表現。

如果目標是解釋，要求更高。你要問係數能不能被當成條件關係，遺漏變數是否嚴重，資料生成過程是否支持「其他變數固定」的說法。

如果目標是因果，OLS 本身不會自動給因果答案。你需要研究設計：隨機實驗、自然實驗、工具變數、差異中的差異、matching 等方法，後面因果推論篇會再處理。

## 這在 ML / AI 哪裡會用到

線性模型在 ML 專案裡常用來做三件事。

第一，當 baseline。若一個複雜模型只比 linear regression 好一點點，卻難解釋、成本高、延遲高，產品上不一定值得換。

第二，查 feature。係數方向和大小能快速暴露資料洩漏、錯誤編碼、尺度問題。例如一個明顯不該知道答案的欄位係數巨大，可能代表 label leakage。

第三，做錯誤分析。殘差集中在哪些族群、時間、任務類型，常比整體 RMSE 更有用。

在 LLM 評估裡，也可以用線性模型分析哪些因素影響分數：題目長度、語言、領域、模型版本、是否使用工具。這能幫你知道模型差距來自整體提升，還是只在某些題型上改善。

## 題型怎麼辨識

看到 OLS 公式，先分清楚題目要你做估計、預測、係數解釋、假設檢查，還是推論。

看到係數解釋，答案要有「其他變數固定」和「條件平均」。

看到殘差圖，先描述形狀，再連到假設：彎曲對線性、漏斗對同質變異、群聚對獨立性、極端點對離群值。

看到「能不能說 X causes Y」，先回答研究設計，不要只看迴歸係數顯著。

## 常見錯誤

- 把斜率解釋成每個個體都會增加同樣數量。
- 忘記「其他變數固定」。
- 看到係數顯著就宣稱因果。
- 殘差圖只描述漂亮或不漂亮，沒有連到模型假設。
- 在 ML 裡只看 RMSE，沒有檢查資料洩漏、outlier、分群錯誤和泛化表現。

## 練習題

1. 列出 OLS 常見假設：線性、獨立、同變異、誤差平均為 0。每一項寫一句違反時會發生什麼事。
2. 給定 `y = b0 + b1x + e`，說明 `b1` 是條件平均的斜率，不是每個個體一定增加的量。
3. 若 `y_hat = 5 + 3x`，當 `x = 6`、`y = 20` 時，預測值和殘差各是多少？
4. 殘差圖出現漏斗形時，最可能是哪個假設出問題？你會怎麼在答案中說明限制？
5. 在 ML 裡，把 linear regression 當 baseline 時，除了 RMSE，還應該看哪一類診斷訊號？

## 下一篇怎麼接

OLS 是線性模型的核心入口。下一篇會接 logistic regression：當目標變數從連續數值變成 0/1 分類時，為什麼要改用 log odds 和 sigmoid，而不是硬把線性迴歸套在機率上。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐 OLS 係數、殘差、R2、假設與基本診斷。
- Stanford CS109 支撐從 regression 走到 supervised prediction 的資料與誤差語言。
- scikit-learn 支撐 ML baseline 與 evaluation metric 情境；本文把 OLS 診斷接到模型錯誤分析。

## 參考資料

- [OLS、linear regression、殘差、R2、同質變異與迴歸診斷：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)

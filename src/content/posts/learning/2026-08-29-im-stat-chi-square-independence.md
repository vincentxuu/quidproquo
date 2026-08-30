---
title: "卡方題怎麼判斷是在考適合度還是獨立性？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 12
tldr: "卡方檢定處理類別資料的次數差異；先分清楚一個變數對理論比例的適合度，還是兩個類別變數之間的獨立性。"
description: "卡方檢定入門：適合度、獨立性、expected count、自由度、手算 2x2 表，以及資料偏差檢查中的 ML/AI 應用。"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-chi-square-independence-en)

卡方題一出現，很多人會先找表格、找自由度、套 `sum (O - E)^2 / E`。這些都會用到，但真正的第一步是判斷題目在問哪一種「次數」問題。

如果只有一個類別變數，題目問觀察到的比例是否符合某個理論比例，這是適合度檢定。例如四種顏色的糖果是否符合廠商宣稱的比例。

如果有兩個類別變數交叉成列聯表，題目問兩者是否有關聯，這是獨立性檢定。例如資料來源 A/B 與標籤正負是否有關、使用者族群與錯誤類型是否有關。

兩者都比較 observed count 與 expected count，但 expected count 的來源不同。適合度的 expected count 來自題目給的理論比例；獨立性檢定的 expected count 來自列總數、欄總數與總樣本數。

## 卡方統計量在量什麼

卡方統計量把每一格的差距累加：

```text
chi-square = sum (observed - expected)^2 / expected
```

如果觀察次數和期望次數很接近，統計量小。差得越多，統計量越大。因為平方會把正負差異都變成正數，所以它衡量的是整體偏離程度。

獨立性檢定中，每格 expected count 的公式是：

```text
expected count = row total × column total / grand total
```

自由度是：

```text
df = (r - 1)(c - 1)
```

其中 `r` 是列數，`c` 是欄數。2x2 表的自由度就是 1。

## 手算例題：資料來源和標籤是否獨立

某資料集來自兩個來源 A 與 B。每筆資料都有正負標籤。觀察到的列聯表如下：

| 資料來源 | 正標籤 | 負標籤 | 合計 |
| --- | ---: | ---: | ---: |
| A | 30 | 70 | 100 |
| B | 50 | 50 | 100 |
| 合計 | 80 | 120 | 200 |

題目要檢定資料來源與標籤是否獨立。原假設是兩者獨立；對立假設是兩者有關聯。

先算 expected count。A 來源、正標籤這格：

```text
E_A,pos = 100 × 80 / 200 = 40
```

A 來源、負標籤：

```text
E_A,neg = 100 × 120 / 200 = 60
```

B 來源列總數也是 100，所以：

```text
E_B,pos = 100 × 80 / 200 = 40
E_B,neg = 100 × 120 / 200 = 60
```

接著算每格貢獻：

```text
(30 - 40)^2 / 40 = 2.50
(70 - 60)^2 / 60 ≈ 1.67
(50 - 40)^2 / 40 = 2.50
(50 - 60)^2 / 60 ≈ 1.67
```

卡方統計量約為：

```text
2.50 + 1.67 + 2.50 + 1.67 = 8.34
```

自由度：

```text
df = (2 - 1)(2 - 1) = 1
```

接著查卡方表或算 p 值。自由度 1 時，8.34 已經比 5% 顯著水準的臨界值 3.841 大，所以拒絕獨立假設。語境結論是：資料提供統計證據顯示資料來源與標籤分布有關聯。

這個結論還不等於知道原因。可能是來源 B 本來就收集到較多正例，也可能是標註流程、抽樣方式、資料清理規則不同。卡方檢定先幫你發現分布不平衡，原因要回到資料流程查。

## 適合度和獨立性怎麼分

適合度檢定只看一個類別變數。題幹常說「是否符合比例」、「是否平均分布」、「是否符合某理論分布」。例如四種答案選項 A/B/C/D 是否各占 25%。

獨立性檢定看兩個類別變數。題幹常出現「是否有關」、「是否獨立」、「不同群組的分布是否相同」。資料通常會整理成 r x c 表。

如果你分不清楚，就數變數。只有一個類別變數對一組理論比例，多半是適合度；兩個類別變數交叉，多半是獨立性或同質性檢定。

## 這在 ML / AI 哪裡會用到

卡方檢定很適合做資料偏差檢查。比如你切 train/test split 之後，可以檢查資料切分和 label 是否獨立。如果 test set 的正負比例明顯不同，模型分數可能會被資料分布影響。

你也可以檢查語言、地區、裝置、資料來源和錯誤類型是否有關。假設客服分類器在中文請求中特別容易把退款問題誤判成物流問題，把資料整理成「語言 x 錯誤類型」的表，就可以先看是否有異常關聯。

大型語言模型評估也會碰到類似問題。若某個 benchmark 的題目來源混雜，而特定來源剛好有比較多某類標籤，模型看似擅長或不擅長某任務，可能其實是在反映資料來源偏差。卡方檢定不能直接修正偏差，但它是發現問題的一個入口。

## 常見錯誤

- 沒先分清楚 goodness-of-fit 和 independence test。
- expected count 用觀察比例亂算，沒有用 row total、column total、grand total。
- 只回報卡方統計量，沒有寫自由度與結論語境。
- expected count 太小時仍然硬套卡方近似。
- 把「有關聯」直接寫成「某變數造成另一變數」。

## 練習題

1. 寫出一個 goodness-of-fit 題幹，並列出它的 observed count 與 expected count 來源。
2. 用一張 2x3 表格練習計算其中一格 expected count。
3. 對上面的 A/B 資料來源例題，重算四格卡方貢獻並確認總和。
4. 設計一個 ML dataset bias 檢查：列出兩個類別變數、列聯表欄位，以及你會如何解讀顯著結果。

## 下一篇怎麼接

卡方檢定把資料放進類別表。下一篇會回到數值 outcome，但組數會從兩組增加到三組以上：ANOVA 會處理多組平均數比較時，為什麼不能一直做一堆兩兩 t 檢定。

## 章節級參考對照

- OpenIntro / OpenStax：卡方適合度、獨立性、expected count 與自由度。
- Stanford CS109：類別資料、機率表與抽樣分布語感。
- scikit-learn：分類資料、資料切分與模型評估檢查語境。

## 參考資料

- [Chi-Square Tests in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Chi-Square Tests](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation: Metrics and Scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [scikit-learn Cross-Validation and Model Selection](https://scikit-learn.org/stable/modules/cross_validation.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)

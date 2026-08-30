---
title: "殘差、outlier、leverage 在告訴你模型哪裡壞了？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 39
tldr: "殘差、outlier、leverage 在告訴你模型哪裡壞了？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 39 篇：殘差、outlier、leverage 在告訴你模型哪裡壞了？"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-model-diagnostics-en)

模型 fit 完之後，很多人第一眼只看 R2、accuracy、p-value。這些數字能告訴你模型表面表現，卻不一定告訴你模型在哪裡壞掉。Diagnostics 做的事，就是把錯誤攤開來看。

統計考試常用殘差圖、outlier、leverage、Cook distance 問你模型假設。ML/AI 實務則常叫它 error analysis：錯誤集中在哪些資料、哪些使用者、哪些題型、哪些輸入長度。名稱不同，問題意識很接近。

## residual 是模型沒解釋掉的部分

對迴歸來說，殘差是：

```text
residual = observed y - fitted y
```

如果模型形式合理，殘差應該比較像沒有結構的噪音。它可以有大小，但不該隨 fitted value、某個 predictor、時間、群組呈現明顯模式。

殘差圖常見四種訊號。

殘差呈彎曲形狀：線性形式可能不足。

殘差呈漏斗形：變異可能不是常數，也就是 heteroscedasticity。

殘差被少數點拉開：可能有 outlier 或資料品質問題。

殘差依時間或群組排列有模式：可能有相依性、季節性或群組效果沒有建進模型。

## outlier、leverage、influence 要分開

Outlier 通常指 `Y` 方向異常。也就是在模型預測下，這筆資料的殘差很大。

Leverage 指的是 `X` 方向位置特殊。某筆資料的 predictor 組合離其他點很遠，就可能有高 leverage。

Influential point 指的是拿掉這筆資料後，模型估計會明顯改變。它常常同時有高 leverage 和不小的殘差，但不一定只靠殘差大小就看得出來。

這三個詞一定要分開。高 leverage 的點如果剛好落在迴歸線上，殘差可能很小；但它仍然可能把斜率固定住。殘差很大的點如果在 `X` 的中心位置，可能是 outlier，但對斜率影響不一定最大。

## 手算例題：殘差大不等於影響大

假設模型是：

```text
y_hat = 2 + 3x
```

有一筆資料：

```text
x = 4
y = 20
```

預測值：

```text
y_hat = 2 + 3 × 4 = 14
```

殘差：

```text
e = 20 - 14 = 6
```

這筆在 `Y` 方向偏離模型，可能是 outlier。

再看另一筆資料：

```text
x = 40
y = 122
```

預測值：

```text
y_hat = 2 + 3 × 40 = 122
```

殘差是 0，但 `x = 40` 如果遠離其他資料點，就可能有高 leverage。它沒有大殘差，卻可能強烈影響迴歸線方向。

所以診斷要同時看三件事：`Y` 方向的異常、`X` 空間的位置，以及拿掉後模型會不會變。

## Cook distance 在問什麼

Cook distance 想衡量某一筆資料對整體 fitted model 的影響。直覺上，它把殘差和 leverage 合在一起看。

高 Cook distance 的點不代表一定要刪掉。它代表你要回去查：這筆是資料輸入錯誤？真實但特殊的族群？還是模型形式不足，讓某些案例被錯誤處理？

考試回答時，請避免寫「Cook distance 高，所以刪除」。比較好的答案是：「Cook distance 高表示該點對模型估計影響大，應進一步檢查資料品質、特殊情境與模型設定；是否排除需要實質理由。」

## diagnostics 不是刪資料流程

很多初學者看到 outlier 就想刪。這很危險。

如果 outlier 是輸入錯誤，例如年齡填成 300，修正或排除有理由。

如果 outlier 是真實長尾案例，例如高消費客戶、罕見疾病、極端延遲，它可能正是你最需要理解的資料。

如果 outlier 來自模型不適合，例如關係其實非線性，刪資料只是在掩蓋模型問題。

診斷的目標是找衝突，不是讓圖變漂亮。

## 這在 ML / AI 哪裡會用到

ML error analysis 就是 diagnostics 的延伸。分類模型錯誤集中在某一種語言、特定長度、某些使用者族群、某個資料來源，代表整體 accuracy 沒有講完整故事。

LLM eval 也一樣。平均分數可能看起來穩，但錯誤可能集中在繁中、長上下文、工具呼叫、多輪對話、表格推理。若不分群看錯誤，模型上線後最先爆的通常就是這些角落。

你可以把 diagnostics 流程寫成：

```text
overall metric -> grouped errors -> representative failures -> data/model/action
```

先看整體指標，再依任務、語言、來源、長度、時間、使用者群組拆開。接著抽出代表性失敗案例，判斷要補資料、改 feature、調 threshold、換模型，還是調整產品流程。

## 題型怎麼辨識

看到 residual plot，先描述形狀，再連到假設。

看到 outlier，先判斷它是 `Y` 方向異常，還是 `X` 空間位置特殊。

看到 leverage，想到 predictor space。高 leverage 不一定殘差大。

看到 influential point 或 Cook distance，想到拿掉該點後模型是否明顯改變。

看到 ML error analysis，先要求分群，不要只停在總分。

## 常見錯誤

- 把 outlier、leverage、influential point 當成同義詞。
- 只看殘差大小，漏掉高 leverage 點。
- 看到診斷圖有異常就直接刪資料。
- 殘差圖只描述形狀，沒有連回線性、同質變異、獨立性等假設。
- ML 報告只看 overall metric，沒有拆族群、資料來源和任務類型。

## 練習題

1. 說明 residual、outlier、leverage、influential point 四個詞的差別。
2. 如果刪掉一筆資料後斜率大幅改變，這比較像 outlier 還是 influential point？為什麼？
3. 若 `y_hat = 2 + 3x`，`x = 4`、`y = 20`，殘差是多少？這代表哪一種診斷訊號？
4. 看到殘差有明顯曲線形狀時，你會怎麼修改模型或寫出限制？
5. 把 model diagnostics 接到 ML error analysis：你會如何分群檢查模型錯誤？

## 下一篇怎麼接

Diagnostics 告訴你模型哪裡壞。下一篇會處理變數選擇：當你有很多可能 predictor 時，怎麼避免只是在訓練資料上挑到剛好漂亮的噪音。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐 regression diagnostics、residual plot、outlier 與 leverage 的基本概念。
- Stanford CS109 支撐 error analysis 與模型誤差來源的思考。
- scikit-learn Model Evaluation 支撐以指標與錯誤分解檢查模型表現；本文把診斷圖接到 ML 錯誤分析。

## 參考資料

- [Regression diagnostics、residual plot、outlier、leverage、Cook distance 與 error analysis：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)

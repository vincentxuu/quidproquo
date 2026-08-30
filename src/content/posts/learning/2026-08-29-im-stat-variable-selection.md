---
title: "變數選擇怎麼避免把訓練資料背起來？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 40
tldr: "變數選擇怎麼避免把訓練資料背起來？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 40 篇：變數選擇怎麼避免把訓練資料背起來？"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-variable-selection-en)

變數選擇看起來像是在問「哪些 predictor 要放進模型」。真正困難的是另一件事：你怎麼知道自己選到的是穩定訊號，而不是訓練資料裡剛好漂亮的噪音？

這個問題在考試會出現在 adjusted R2、AIC、BIC、forward selection、backward elimination。到了 ML/AI，它會變成 feature selection、cross-validation、資料洩漏和部署成本。

## 訓練分數為什麼會高估模型

在一般線性迴歸裡，只要多加一個變數，訓練資料上的 R2 通常不會下降。因為模型多了一個自由度，至少可以選擇不用它；如果它剛好能貼到一點噪音，R2 還會上升。

這就是變數選擇的核心風險。模型越自由，訓練資料上越容易看起來變好；但新資料上不一定更好。

所以選變數要把問題往後推一步：

```text
新增變數帶來的改善，是否足以抵過複雜度、變異和維護成本？
```

這句話會貫穿 adjusted R2、AIC/BIC、cross-validation 和 regularization。

## adjusted R2 在懲罰變數數量

R2 衡量模型解釋了多少樣本內變異，但它對多加變數太寬容。Adjusted R2 會把樣本數和 predictor 數量放進來，對模型複雜度做懲罰。

直覺上，如果新增變數只讓 R2 上升一點點，卻增加了模型複雜度，adjusted R2 可能下降。

考試看到這種題目，語境結論可以寫：「雖然原始 R2 上升，但 adjusted R2 下降，表示新增變數帶來的樣本內改善不足以抵過複雜度懲罰。」

## AIC、BIC 和 cross-validation 問法不同

AIC 和 BIC 都會平衡 fit 和 complexity，但懲罰強度不同。AIC 通常比較偏向預測表現，BIC 對複雜度懲罰更重，在樣本數增加時尤其明顯。

它們常寫成「越小越好」的準則。你不需要在入門階段背完整推導，但要知道它們不是單純看 likelihood。模型多放參數，會付出懲罰。

Cross-validation 則換一種做法。它把資料切成訓練和驗證，直接估模型在沒看過資料上的表現。這更接近 ML 的問題意識：泛化好不好？

所以比較時可以這樣分：

- adjusted R2：在迴歸框架裡修正 R2 對變數數量的偏好。
- AIC/BIC：用 likelihood 加上複雜度懲罰做模型比較。
- cross-validation：用資料切分估 out-of-sample performance。

## selection procedure 也會製造偏誤

Forward selection 從空模型開始，一次加入最有幫助的變數。

Backward elimination 從完整模型開始，一次移除最不需要的變數。

All-subsets selection 嘗試多種變數組合，再根據準則選模型。

這些程序很方便，但要記得：你嘗試越多模型，就越容易在訓練資料裡找到剛好漂亮的組合。最後被選中的模型，p-value、信賴區間和係數解釋都會受到 selection 過程影響。

考試不一定會要求 post-selection inference，但你至少要知道，選完模型後直接把標準推論當成完全沒有選模過程，會太樂觀。

## 手算例題：R2 上升但 adjusted R2 下降

假設模型 A 使用 3 個 predictor：

```text
R2 = 0.64
adjusted R2 = 0.62
```

模型 B 加入第 4 個 predictor：

```text
R2 = 0.65
adjusted R2 = 0.61
```

只看 R2，模型 B 比較高。但 adjusted R2 下降，表示第 4 個 predictor 帶來的樣本內改善很小，不足以抵過多一個變數的複雜度成本。

考試答案可以寫：「模型 B 的訓練解釋力略升，但調整後表現變差；若目標是解釋或泛化，不應只因 R2 上升就選 B。」

如果這是 ML feature selection，下一步不會只停在 adjusted R2。你會用 validation set 或 cross-validation 檢查模型 B 在沒看過資料上是否真的更好。

## 資料洩漏是變數選擇的大坑

Feature selection 最常見的實務錯誤，是先用全部資料挑 feature，再切 train/test。這會讓 test set 的資訊提前流進選擇過程。

正確流程應該把 feature selection 放進 training pipeline 裡。每一折 cross-validation 都只能用該折的 training data 選 feature，再在 validation fold 上評估。

如果先偷看全資料，模型可能選到剛好對 test set 有利的變數。最後 test performance 看起來很好，但上線後會掉。

這在 AI 評估裡也會發生。你若先看所有 benchmark 題，再挑對某些題型最有利的 prompt、工具或 reranker，最後的測試分數就不再是乾淨的泛化估計。

## 這在 ML / AI 哪裡會用到

Feature selection 影響的不只是分數。

特徵太多會增加訓練成本、推論延遲、資料管線維護成本，也會增加資料洩漏面積。每多一個 feature，就多一個上線時可能缺值、延遲、格式漂移或權限不一致的地方。

特徵太少也有代價。模型可能漏掉重要訊號，或把本來應該明確控制的變數留在殘差裡。

在 LLM 系統裡，變數選擇可以對應到 retrieval features、reranker features、prompt metadata、使用者上下文、工具輸出欄位。每個訊號都要問：它在訓練或離線評估裡好看，是否也能在正式環境穩定取得？是否會偷帶答案？是否會讓模型難以維護？

## 題型怎麼辨識

看到 R2 和 adjusted R2 同時出現，重點是複雜度懲罰。

看到 AIC/BIC，記得通常越小越好，且它們把 fit 和模型大小一起考慮。

看到 cross-validation，答案要回到 out-of-sample performance。

看到 forward、backward、all-subsets，先說清楚搜尋程序，再提醒多次選模可能讓推論太樂觀。

看到 ML feature selection，先檢查資料切分和 leakage。

## 常見錯誤

- 只看訓練 R2，忽略變數越多越容易樣本內變好。
- 把 adjusted R2、AIC、BIC、cross-validation 當成同一種東西。
- 選完變數後直接相信標準 p-value，沒有想到 selection bias。
- 先用全資料挑 feature，再切 train/test，造成資料洩漏。
- 只追求最高分，忽略 feature 的取得成本、穩定性和部署維護。

## 練習題

1. 說明 forward selection、backward selection 與 all-subsets selection 的差別。
2. 為什麼只看訓練資料上的 R2 選變數會偏向過度配適？
3. 若模型 A 的 `R2 = 0.64`、`adjusted R2 = 0.62`，模型 B 的 `R2 = 0.65`、`adjusted R2 = 0.61`，你會怎麼解釋？
4. AIC、BIC、cross-validation 各自把什麼成本納入選模？
5. 在 ML feature selection 中，為什麼 feature selection 必須放進 cross-validation pipeline 裡？

## 下一篇怎麼接

變數選擇處理的是模型複雜度和泛化。下一篇會接 regularization：與其先挑變數再估模型，也可以在估計過程中直接懲罰太大的係數，讓模型自己變得保守。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐多元迴歸、模型比較與解釋變數選擇的基礎。
- Stanford CS109 支撐 train/test 思維與泛化誤差的入口。
- scikit-learn 支撐 feature selection、cross-validation 與模型選擇情境。

## 參考資料

- [Variable selection、adjusted R2、AIC、BIC、cross-validation、feature selection 與 model selection：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)

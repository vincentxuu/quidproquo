---
title: "信賴區間不只 t 表：一般建構到底怎麼想？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 29
tldr: "信賴區間不只 t 表：一般建構到底怎麼想？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 29 篇：信賴區間不只 t 表：一般建構到底怎麼想？"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-general-confidence-intervals-en)

前面算過平均數、比例、迴歸係數的信賴區間。剛開始學的時候，很容易以為信賴區間就是「找到公式、查 t 表、代數字」。考試題如果只問一個平均數，這樣短期也許能拿分；題目一換成 odds ratio、prediction error、accuracy、bootstrap interval，背表格就會失效。

這篇要把信賴區間拉回更一般的框架。重點有三個問題：估的是什麼量？這個估計量會怎麼波動？我要用哪種方法把波動轉成區間？

## 一般信賴區間在做哪三件事

最常見的信賴區間長成這樣：

```text
estimate ± critical value × standard error
```

這行式子其實拆成三塊。

`estimate` 是你用樣本算出來的答案，例如樣本平均、樣本比例、迴歸係數、模型 accuracy。

`standard error` 是這個答案如果重複抽樣會晃多大。它描述估計量的標準差，和描述原始資料分散程度的樣本標準差不同。平均數的標準誤會隨樣本數增加而下降，因為更多資料讓估計更穩。

`critical value` 決定你要包多寬。95% 區間常看到 1.96，是因為標準常態中間約 95% 的範圍落在正負 1.96 之間。小樣本平均數且母體變異未知時，會改用 t 分布。

所以考試看到信賴區間，不要第一步就找公式表。先問：這題的估計量是什麼？標準誤從哪裡來？近似分布或重抽樣方法能不能用？

## coverage 是長期程序，不是這次機率

信賴區間最常被誤解的句子是：「這個區間有 95% 機率包含真值。」

在頻率派語言裡，參數是固定的，區間才是會隨樣本改變的隨機結果。比較精準的說法是：如果用同一套方法反覆抽樣、反覆建區間，長期約 95% 的區間會蓋到真值。

這個觀念在考試很重要。題目問解釋時，你可以寫：「95% confidence procedure 表示在重複抽樣下約 95% 的區間會包含母體參數；對已算出的單一區間，真值要嘛在裡面，要嘛不在裡面。」

這不是咬文嚼字。它會影響你如何報告 ML 實驗。你不能說「模型 A 有 95% 機率比模型 B 好」，除非你使用的是能支撐那種機率解釋的模型。傳統信賴區間講的是程序的長期表現。

## 四種常見建構路線

第一種是標準誤加臨界值。平均數、比例、大樣本估計量、迴歸係數都常走這條路。它需要你知道或能近似估計抽樣分布。

第二種是反轉檢定。你把每個可能參數值拿來檢定，沒有被拒絕的參數值集合就形成信賴區間。這個觀點能把「檢定」和「區間」接起來：同一個資料，若 95% 區間不含 0，常對應雙尾 5% 檢定拒絕 0。

第三種是 likelihood-based interval。你看哪些參數值的 likelihood 足夠接近最大 likelihood。這在 MLE、GLM、複雜模型裡很常見，後面遇到 profile likelihood 時會用到。

第四種是 bootstrap interval。當公式分布難推、指標很複雜，或你想用重抽樣檢查估計量波動，可以讓資料自己給出一個近似抽樣分布。

這四種方法的共同核心都一樣：先定義估計目標，再描述估計誤差，最後決定區間規則。

## 手算例題：模型 accuracy 的近似區間

假設一個分類模型在 400 題測試集答對 328 題。樣本 accuracy 是：

```text
p_hat = 328 / 400 = 0.82
```

如果暫時把每題答對與否視為獨立 Bernoulli，比例的標準誤可以估為：

```text
SE(p_hat) = sqrt(p_hat(1 - p_hat) / n)
          = sqrt(0.82 × 0.18 / 400)
          = sqrt(0.000369)
          ≈ 0.0192
```

使用標準常態 95% 臨界值 1.96：

```text
0.82 ± 1.96 × 0.0192
= 0.82 ± 0.0376
= (0.7824, 0.8576)
```

報告時可以寫：「在獨立同分布與大樣本近似下，accuracy 的 95% 信賴區間約為 78.2% 到 85.8%。」

這句話保留了方法條件。若 400 題其實來自同一批相似題型，彼此高度相關，標準誤會被低估；若測試集和真實使用者問題分布不同，區間再窄也不能代表上線後表現。

## 題型怎麼辨識

題目若已經給你估計量、標準誤、近似分布，通常是在考一般形式：

```text
estimate ± critical value × SE
```

題目若問「信賴區間和假設檢定的關係」，多半要你說明區間是否包含虛無假設值。

題目若出現「unknown distribution」「resampling」「percentile」，重點通常轉到 bootstrap。你仍然要說清楚重抽樣單位和區間分位數。

題目若出現 likelihood、profile、nested model，區間可能從 likelihood 或 LRT 角度建構。這時不要硬套平均數 t interval。

## 這在 ML / AI 哪裡會用到

ML/AI 評估最常見的壞習慣是只報單點分數：accuracy 82%、win rate 56%、latency 420 ms。單點分數看起來乾淨，卻藏掉了測試集大小、資料波動和抽樣誤差。

信賴區間讓評估報告從排名表變成推論。兩個模型 accuracy 分別是 82% 和 84%，差距看起來有 2 個百分點；如果兩者區間高度重疊，或 paired bootstrap 顯示差距常常翻轉，就不能把它寫成穩定改善。

在 LLM eval 裡也一樣。模型回答品質常用人工偏好、rubric 分數、pass@k、win rate。這些指標都來自有限題目。信賴區間不是裝飾，它是你承認「測試集只是樣本」的方式。

## 常見錯誤

- 把 95% 信賴區間解釋成「真值有 95% 機率在這個已算出的區間內」。
- 只寫上下界，沒有交代估計量、標準誤、臨界值和假設。
- 把樣本標準差和標準誤混在一起。
- 對任何題目都套 t interval，沒有看參數型態、樣本大小和方法條件。
- 在模型比較中只看兩個點估計差多少，沒有看差距的不確定性。

## 練習題

1. 某模型在 900 題測試集答對 765 題。用比例近似標準誤算 95% 信賴區間，並寫出完整解釋句。
2. 說明「樣本標準差」和「平均數標準誤」差在哪裡。哪一個描述資料分散，哪一個描述估計量波動？
3. 有一個 odds ratio 的信賴區間是 `(0.9, 1.8)`。若檢定虛無假設是 odds ratio = 1，5% 雙尾檢定通常會不會拒絕？為什麼？
4. 兩個模型的 win rate 分別是 53% 和 56%。你會要求報告補哪些資訊，才敢判斷 56% 是否真有改善？

## 下一篇怎麼接

這篇把信賴區間抽象成估計量、標準誤和區間規則。下一篇會處理其中最常被使用、也最容易被誤用的工具：大樣本近似。你會看到為什麼很多估計量可以近似常態，也會看到這句話的邊界在哪裡。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐信賴區間的一般形式、平均數與比例區間，以及 coverage 的解釋。
- Stanford CS109 支撐標準誤與重複抽樣的直覺，協助把區間視為估計程序的長期表現。
- scikit-learn Model Evaluation 支撐 ML/AI 評估指標情境；本文把 accuracy、模型比較與區間報告接在一起。

## 參考資料

- [信賴區間、t 分布、標準誤與 coverage：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)

---
title: "大樣本近似為什麼常能用，又什麼時候不能亂用？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 30
tldr: "大樣本近似為什麼常能用，又什麼時候不能亂用？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 30 篇：大樣本近似為什麼常能用，又什麼時候不能亂用？"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-asymptotic-normality-en)

統計考試很愛出現一句話：「當樣本數夠大時，可以用常態近似。」這句話方便到危險。它讓很多公式看起來可以統一處理，也讓很多答案在沒有檢查條件時就被寫得太有把握。

大樣本近似的價值很高。你不可能為每一種估計量都推一次精確分布，尤其估計量來自 MLE、迴歸係數、比例差、複合指標時。漸近常態給你一個共同語言：樣本數變大後，估計誤差在適當縮放下會接近常態。

但你要記得，它講的是估計量的行為，不是原始資料突然變得漂亮。

## 漸近常態在說誰變常態

常見寫法是：

```text
sqrt(n)(theta_hat - theta) -> N(0, V)
```

這裡有三個角色。

`theta` 是母體參數，例如真實平均數、真實比例、迴歸裡的真實係數。

`theta_hat` 是你用樣本算出的估計量。每次抽到不同樣本，`theta_hat` 都會變。

`sqrt(n)` 是縮放。估計誤差通常會隨樣本數增加而變小；乘上 `sqrt(n)` 之後，才能看到一個穩定的極限形狀。

所以漸近常態不是說 `X_i` 近似常態。原始資料可以偏態、離散、甚至只有 0 和 1。它說的是 `theta_hat` 的抽樣分布在大樣本下常可以用常態近似。

## 為什麼標準誤常是平方根 n

從上面的式子可以改寫出：

```text
theta_hat approximately follows N(theta, V / n)
```

因此標準誤是：

```text
SE(theta_hat) approximately sqrt(V / n)
```

這就是為什麼樣本數變成 4 倍，標準誤大約只會變成一半。資料增加有幫助，但不是線性幫助。

這點在考試和實驗設計都很實用。如果你想把標準誤從 0.04 降到 0.02，樣本數大概要變成 4 倍，而不是 2 倍。

## 手算例題：用大樣本變異常數估標準誤

假設某估計量滿足：

```text
sqrt(n)(theta_hat - theta) approximately follows N(0, 4)
```

這表示大樣本變異常數 `V = 4`。

如果 `n = 100`，估計量本身的近似變異數是：

```text
V / n = 4 / 100 = 0.04
```

標準誤是：

```text
SE(theta_hat) = sqrt(0.04) = 0.2
```

若樣本數增加到 `n = 400`：

```text
V / n = 4 / 400 = 0.01
SE(theta_hat) = sqrt(0.01) = 0.1
```

這題的重點不在開根號，而在讀懂符號。題目給的是 `sqrt(n)(theta_hat - theta)` 的極限變異數，不是 `theta_hat` 的變異數。要先除以 `n`，再開根號。

## 什麼時候大樣本近似會不穩

第一種情況是樣本其實沒有你以為的大。`n = 30` 在教科書裡常被當成門檻，但那不是保證。分布越偏、尾巴越厚、離群值越強，需要的樣本數越大。

第二種情況是資料不是獨立同分布。像同一個使用者產生很多筆紀錄、同一個 prompt 產生多個回答、同一間公司底下多個樣本，表面樣本數很大，獨立資訊量可能小很多。

第三種情況是參數靠近邊界。比例接近 0 或 1、variance component 接近 0、分類指標出現極端值時，常態近似容易給出不合理區間。

第四種情況是分布漂移。你在舊測試集上有一百萬筆資料，仍然無法保證新使用者、新語言、新任務上的估計可靠。

## 題型怎麼辨識

看到 `sqrt(n)(estimate - parameter)`，通常是在考漸近分布。

看到題目問「樣本數變成幾倍，標準誤怎麼變」，通常是在考 `1 / sqrt(n)` 的速度。

看到題目給出 `V`、`n`、`theta_hat`，常見任務是做近似信賴區間：

```text
theta_hat ± z × sqrt(V / n)
```

若題目要求解釋，請明確寫出：近似對象是估計量，不是每一筆原始觀察值。

## 這在 ML / AI 哪裡會用到

大型模型評估常需要很快估出 uncertainty。平均 loss、accuracy、win rate、人工評分平均值，都可以先用大樣本近似建立粗略區間。

例如一個 eval set 有 10,000 題，模型答對率 71%。如果每題可近似視為獨立 Bernoulli，就能用比例標準誤快速估區間。這可以幫你判斷 71.0% 對 71.4% 是否只是抽樣波動。

但 LLM eval 最常踩到相依性。題目可能來自同一批模板、同一個資料來源、同一類難度；模型錯誤也會群聚。這時單純把題目數當獨立樣本數，會把標準誤估得太小。比較好的做法可能是分層抽樣、cluster bootstrap，或至少按照資料來源分組報告。

大樣本近似不是要你放棄懷疑。它是一個快速起點，接著要回頭看資料生成方式。

## 常見錯誤

- 把「估計量近似常態」寫成「原始資料近似常態」。
- 題目給 `sqrt(n)(theta_hat - theta)` 的變異常數，卻忘記除以 `n`。
- 看到樣本數大就忽略相依性、群聚和分布漂移。
- 把 `n` 加倍後，誤以為標準誤也會直接減半。
- 在模型評估中把測試題數當成唯一的不確定性來源。

## 練習題

1. 用一句話解釋 `sqrt(n)(theta_hat - theta)` 的近似常態在描述哪個量。
2. 若 `sqrt(n)(theta_hat - theta)` 的極限變異數是 9，`n = 225`，估計量的近似標準誤是多少？
3. 樣本數從 1,000 增加到 4,000，標準誤約變成原來的幾倍？
4. 一個 LLM eval 有 20,000 題，但題目由 200 個模板各生成 100 題。為什麼不能直接把 20,000 當作完全獨立樣本？

## 下一篇怎麼接

大樣本近似讓許多估計量可以用常態語言處理。下一篇會把這個想法推到非線性指標：當你從 `theta` 轉到 `log(theta)`、ratio、F1 這類 `g(theta)` 時，delta method 會告訴你不確定性怎麼被轉換。

## 章節級參考對照

- OpenIntro、OpenStax 與 Stanford CS109 支撐 CLT、抽樣分布與大樣本近似的基礎。
- 本文把重點放在估計量的漸近分布，而不是原始資料分布；這是從基礎 CLT 走到推論工具的橋。
- scikit-learn Model Evaluation 支撐大規模評估指標情境；本文提醒 evaluation set 的分布假設仍要檢查。

## 參考資料

- [本篇主題 Asymptotic Normality：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)

---
title: "Bernoulli、Binomial、Normal、Poisson 什麼時候該出場？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 6
tldr: "分布不是公式清單，而是資料生成情境的名字。這篇用 Bernoulli、Binomial、Normal、Poisson 說明如何從題目敘述選分布。"
description: "統計學常見分布導讀：如何判斷 Bernoulli、Binomial、Normal、Poisson 何時適用，並理解它們在 label、count event、誤差與模型評估中的角色。"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-common-distributions-en)

很多人讀分布時，會把每個分布讀成一張公式卡。Bernoulli 的平均是 p，Binomial 的平均是 np，Poisson 的平均是 lambda，Normal 有 mu 和 sigma。公式背完了，題目一換敘述，還是不知道該用哪個。

分布比較好的讀法，是把它看成資料生成情境的名字。題目不是先告訴你分布，再要你代公式；題目通常先描述一個場景：一次成功失敗、固定次數中的成功數、固定時間內事件次數、測量誤差或平均值近似。你要從場景回推分布。

這個能力也會直接接到 ML/AI。二元 label、點擊事件、錯誤次數、模型 residual、benchmark 平均分數，都隱含某種分布假設。分布選錯，後面的 likelihood、loss、不確定性解釋都會跟著歪。

## Bernoulli：一次 0/1 結果

Bernoulli 最適合描述單次成功或失敗。一次投幣是否正面、一封信是否垃圾、一題是否答對、一位使用者是否點擊，都是 0/1 結果。

若 X~Bernoulli(p)，X=1 的機率是 p，X=0 的機率是 1-p。它的期望值是 p，變異數是 p(1-p)。

這個分布的重點在語境清楚。只要題目描述的是一次 yes/no、success/failure、correct/incorrect，就先想到 Bernoulli。ML 裡的二元分類 label，也可以先從 Bernoulli 開始理解。

## Binomial：固定次數中的成功數

Binomial 是把多次 Bernoulli 加起來。關鍵條件有三個：固定試驗次數 n、每次成功機率 p 相同、每次試驗可視為獨立。

例如一個模型對某類題目的答對率假設是 0.8，現在抽 10 題，問剛好答對 7 題的機率。題目在數 10 次裡成功幾次，所以 X~Binomial(10,0.8)。

公式是：

P(X=k)=C(n,k)p^k(1-p)^(n-k)

其中 C(n,k) 是選出哪 k 次成功。考試裡常見錯誤，是看到「成功失敗」就停在 Bernoulli，忘記題目問的是 n 次中的成功總數。

## Poisson：固定區間內的事件次數

Poisson 常用來描述固定時間或空間內的事件次數，例如每小時客服工單數、一天系統錯誤數、某頁每分鐘請求數。它的可能值是 0、1、2、3，一直往上。

若 X~Poisson(lambda)，lambda 同時是期望值和變異數。lambda 的直覺是 rate：在固定區間內平均會出現幾次。

Poisson 題的判斷重點是「固定區間」和「事件次數」。如果題目說每小時平均 3 次錯誤，問某小時出現 5 次錯誤的機率，就很像 Poisson。若題目說抽 10 位使用者，每位是否點擊，問點擊人數，則比較像 Binomial，因為試驗次數固定。

## Normal：誤差、平均與近似

Normal distribution 常用來描述測量誤差、自然變異、迴歸 residual、樣本平均的近似分布。它由平均數 mu 和變異數 sigma^2 決定位置與寬度。

初學者容易把 Normal 當成萬用分布。這很危險。資料看起來有平均和標準差，不代表它就常態。類別資料、嚴重偏態資料、計數資料，都不應該直接硬塞進 Normal。

Normal 真正強的地方，是它和中央極限定理有關。即使原始資料不是常態，在條件合適、樣本數夠大時，樣本平均常常可以用常態近似。這會在後面的信賴區間和假設檢定變得很重要。

## 一題分布辨識例子

假設題目給三個情境。

第一個情境：一位使用者看到推薦後，是否點擊。這是單次 0/1 結果，適合 Bernoulli。

第二個情境：100 位使用者各看一次推薦，問有幾位點擊。這是固定 100 次試驗中的成功次數，若可近似獨立且點擊機率相同，適合 Binomial。

第三個情境：某服務平均每小時收到 12 張客服工單，問下一小時收到 15 張的機率。這是固定時間內的事件次數，適合 Poisson。

如果題目改成「100 位使用者的平均停留時間是否高於過去」，就不是 Bernoulli、Binomial 或 Poisson 的直接題型。停留時間是數值資料，後面可能會用樣本平均和常態近似處理。

同樣都是「使用者行為」，分布會因為問題問法改變。這就是分布辨識要練的地方。

## 這在 ML / AI 哪裡會用到

二元分類可以從 Bernoulli 開始。每筆 label 是 0 或 1，模型輸出的 p 可以被看成預測 Y=1 的機率。logistic regression 和 binary cross entropy 就站在這個語言上。

點擊數、錯誤次數、請求數常和 Poisson 或 count model 有關。你在做監控時，如果某分鐘錯誤數突然遠高於平常，要先知道正常波動大概長什麼樣，才知道異常是否值得處理。

Normal 則常出現在 residual、noise、平均分數近似和模型參數估計。很多 ML 評估報告會報平均和標準誤，背後就是在使用抽樣分布和近似常態的語言。

分布不是為了考試背誦而存在。它是你對資料生成方式的假設。假設越清楚，後面的 loss、likelihood 和不確定性才有解釋空間。

## 來源使用方式

- 官方考古題 PDF 只用來確認年份、科目名稱與題面，不把兩年題型當成完整範圍。
- grad-exam-prep 備考頁用來對齊學習路線、題型入口與練習節奏，不視為官方標準答案。
- OpenIntro、OpenStax 與其他開放教材用來核對公式、定義、假設與常見推導。
- Stanford CS109 與 scikit-learn 文件用來補 ML/AI 對接：模型訓練、評估、實驗與不確定性報告。

## 題型辨識提示

- 單次 0/1 結果，先想 Bernoulli。
- 固定 n 次試驗中的成功數，先想 Binomial。
- 固定時間或空間內的事件次數，先想 Poisson。
- 誤差、平均值近似、對稱連續分布，才考慮 Normal。

## 常見錯誤

- 看到成功/失敗就用 Bernoulli，忘記題目可能問 n 次成功數。
- 把 Poisson 和 Binomial 混在一起，沒有看固定區間或固定試驗次數。
- 把所有數值資料都當常態。
- 在 ML 裡使用 loss 或 likelihood，卻沒有想過背後對應的分布假設。

## 練習題

1. 把「是否錄取」「20 題答對幾題」「每小時錯誤數」「測量誤差」分別配到一個分布。
2. 若 X~Binomial(20,0.3)，算 E[X] 與 Var(X)。
3. 若系統平均每小時 4 次錯誤，說明 Poisson 的 lambda 代表什麼。
4. 寫一個 ML/AI 例子：binary label、count event、normal approximation 各對應哪個工作流。

## 下一篇怎麼接

分布告訴你隨機變數可能怎麼動。下一篇會處理期望值與變異數：一個描述長期平均，一個描述波動大小。這兩個量會一路接到 loss、risk 和模型穩定度。

## 章節級參考對照

- OpenIntro / OpenStax：支撐 Bernoulli、Binomial、Poisson、Normal 的定義、情境、期望與變異數。
- Stanford CS109：支撐常見分布、資料生成假設與建模直覺。
- scikit-learn：支撐分布假設如何進入 classification、count data、loss 與 baseline model。

## 參考資料

- [OpenIntro Statistics：Bernoulli、Binomial、Normal、Poisson distributions](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e：discrete and continuous probability distributions](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109：common distributions and modeling assumptions](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation：classification, count-style metrics, and model assumptions](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)

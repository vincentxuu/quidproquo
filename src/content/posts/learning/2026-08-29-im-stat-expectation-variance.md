---
title: "期望值和變異數在考題與模型評估中各代表什麼？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 7
tldr: "期望值描述長期平均，變異數描述波動大小。這篇用離散分布算例說明 E[X]、E[X^2]、Var(X)，並接到平均 loss 和模型穩定度。"
description: "統計學期望值與變異數導讀：如何計算 E[X]、E[X^2]、Var(X)，理解線性轉換與獨立加總，並接到 ML/AI 的 loss 和 variance。"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-expectation-variance-en)

期望值和變異數常被一起教，所以初學者容易把它們混成「平均和分散」。這樣講沒有錯，但太粗。考試和 ML/AI 評估真正需要的是：期望值告訴你長期中心，變異數告訴你結果會不會晃。

平均高不代表穩。兩個模型的平均分數一樣，其中一個每次都差不多，另一個有時很好、有時很差，產品決策會完全不同。反過來，變異數小也不代表平均好。一個模型很穩定地答錯，波動很小，但沒有實用價值。

所以這篇要把兩個問題分開：長期平均在哪裡？波動有多大？這兩個問題會一路接到後面的標準誤、信賴區間、bias-variance tradeoff 和模型評估。

## 期望值是依機率加權的長期平均

如果一個隨機變數會取好幾個值，每個值出現機率不同，期望值就是把每個值乘上機率後加總。

離散情況可以寫成：

E[X] = sum x p(x)

這不是說下一次一定會出現 E[X]。擲一顆公平骰子的期望值是 3.5，但你永遠不會擲出 3.5。期望值描述的是長期平均，而不是單次預測。

這點在考試裡很重要。題目問「平均報酬」「長期損失」「預期得分」時，通常是在問期望值。你要把每個可能結果和它的機率配起來，而不是只看最大或最常出現的結果。

## 變異數是在問離平均有多遠

變異數描述結果圍繞期望值的波動。它不是直接平均 X 和 E[X] 的差，因為正負差會互相抵消；所以會平方後再平均。

常用公式是：

Var(X) = E[(X-E[X])^2]

計算時常用另一個等價式：

Var(X) = E[X^2] - E[X]^2

這個公式在離散題很好用。你先算 E[X]，再算 E[X^2]，最後相減。標準差則是變異數開根號，會回到原本單位，比較容易解釋。

## 一題完整算例

假設 X 表示某題人工評分：

| X | 意義 | 機率 |
|---|---|---:|
| 0 | 錯誤 | 0.20 |
| 1 | 部分正確 | 0.50 |
| 2 | 完全正確 | 0.30 |

先算期望值：

E[X] = 0*0.20 + 1*0.50 + 2*0.30 = 1.10

這表示長期平均評分是 1.10。某一題不會得到 1.10 分；很多題或很多次評估平均下來，中心會靠近這個數字。

接著算 E[X^2]：

E[X^2] = 0^2*0.20 + 1^2*0.50 + 2^2*0.30 = 1.70

所以：

Var(X) = 1.70 - 1.10^2 = 0.49

標準差是 sqrt(0.49)=0.70。若你在考試中要解釋，可以寫：「此評分的長期平均為 1.10，標準差約 0.70，表示單題結果相對於平均仍有明顯波動。」

常見錯誤是只算 E[X] 就結束。若題目問風險、穩定度、波動或可靠性，變異數才是主角。

## 線性轉換要看平均和波動怎麼變

考試很愛問 aX+b。這類題目其實在測你有沒有分清楚位置和波動。

期望值會照線性轉換移動：

E[aX+b] = aE[X]+b

變異數則不同：

Var(aX+b) = a^2 Var(X)

加 b 只會把所有結果一起平移，不會改變波動。乘 a 會拉開或縮小距離，所以變異數會乘上 a^2。

例如分數 X 轉成 Y=10X+5。平均會變成 10E[X]+5；變異數會變成 100Var(X)。那個 +5 不會讓分數更不穩，只是整體往上移。

## 加總時要小心獨立

如果 X 和 Y 獨立，Var(X+Y)=Var(X)+Var(Y)。這是很常用的性質。

但如果不獨立，就不能直接加。兩個模型在同一批題目上的分數往往有關，因為同一題如果很難，兩個模型都可能錯。這時波動計算會牽涉 covariance。

這也是後面模型比較會強調 paired evaluation 的原因。兩個結果是否獨立，會直接影響不確定性估計。

## 這在 ML / AI 哪裡會用到

模型訓練中的 loss，可以先看成隨機變數。每筆資料都有一個 loss；平均 loss 是期望風險的樣本版本。你最小化訓練 loss，其實是在用樣本平均近似你真正關心的未來平均損失。

模型評估也要看 variance。若同一個模型在不同測試切分上的分數差很多，代表評估不穩。你不能只拿其中一次最高分當結論。這會接到 cross-validation、bootstrap 和 confidence interval。

Bias-variance tradeoff 也從這裡開始變得有意義。bias 偏高，代表模型系統性偏離目標；variance 偏高，代表模型對訓練資料太敏感。平均表現和波動要一起看，才知道模型問題在哪裡。

## 來源使用方式

- 官方考古題 PDF 只用來確認年份、科目名稱與題面，不把兩年題型當成完整範圍。
- grad-exam-prep 備考頁用來對齊學習路線、題型入口與練習節奏，不視為官方標準答案。
- OpenIntro、OpenStax 與其他開放教材用來核對公式、定義、假設與常見推導。
- Stanford CS109 與 scikit-learn 文件用來補 ML/AI 對接：模型訓練、評估、實驗與不確定性報告。

## 題型辨識提示

- 問長期平均、平均報酬、平均 loss，先想期望值。
- 問風險、穩定、波動，先想變異數或標準差。
- 看到 aX+b，記得平均和變異數的轉換規則不同。
- 加總多個隨機變數時，先檢查是否能假設獨立。

## 常見錯誤

- 把期望值當成下一次一定會出現的值。
- 只算平均，不看波動。
- 忘記 Var(aX+b) 裡的 a 要平方。
- 在模型比較中假設兩個分數獨立，卻沒有檢查資料是否成對。

## 練習題

1. 給定 P(X=0)=0.25、P(X=4)=0.75，算 E[X]、E[X^2] 與 Var(X)。
2. 若 Y=3X+2，寫出 E[Y] 和 Var(Y)。
3. 用一段話解釋：為什麼平均 loss 不足以描述模型穩定度。
4. 舉一個 bias 高和 variance 高的模型例子，各寫一句現象描述。

## 下一篇怎麼接

期望值和變異數告訴你單一隨機變數的中心與波動。下一篇會把很多樣本放在一起，處理樣本平均的波動，也就是標準誤和中央極限定理。

## 章節級參考對照

- OpenIntro / OpenStax：支撐 expectation、variance、standard deviation、linear transformation 與 independence。
- Stanford CS109：支撐期望與 variance 在機率模型中的角色。
- scikit-learn：支撐 loss、model stability、bias-variance 與模型評估語境。

## 參考資料

- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)

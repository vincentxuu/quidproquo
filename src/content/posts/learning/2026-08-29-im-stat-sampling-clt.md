---
title: "為什麼只看樣本，也能推回母體或模型表現？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 8
tldr: "抽樣讓樣本統計量有波動，標準誤描述這個波動。這篇分清楚 SD、SE、抽樣分布與 CLT，並接到 benchmark 分數的不確定性。"
description: "統計學抽樣、標準誤與中央極限定理導讀：如何理解樣本平均的抽樣分布、SD 和 SE 的差別，以及它們在 ML/AI benchmark 評估中的用途。"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-sampling-clt-en)

統計學最關鍵的一步，是從樣本走向母體。你手上只有一班學生、一次問卷、一批測試題、一個 benchmark 結果，但題目通常想問更大的東西：長期平均、全體使用者、未來資料、真實模型能力。

這一步不能靠直覺硬跳。樣本結果會波動。今天抽到的 100 題，和明天抽到的 100 題可能難度不同；這次問卷回覆的人，和下次回覆的人可能組成不同。抽樣、標準誤和中央極限定理，就是在處理這個距離。

初學者最常混淆的是標準差和標準誤。標準差描述原始資料散得多開；標準誤描述統計量本身有多不穩。這兩個量如果分不清，信賴區間和假設檢定都會跟著錯。

## 樣本平均也是隨機變數

很多人會把樣本平均看成算完就固定的數字。對已經抽到的這批資料來說，它確實固定；但從抽樣的角度看，樣本平均本身會隨著樣本改變。

假設母體是所有可能的同類考題，你抽 100 題評估模型。這次 accuracy 是 0.82。換另一批 100 題，可能是 0.79 或 0.85。每一次抽樣都會得到一個樣本 accuracy。

這些樣本統計量形成的分布，叫抽樣分布。信賴區間和檢定真正處理的是樣本平均、樣本比例、模型分數這些統計量的抽樣分布。

## SD 和 SE 的差別

標準差 SD 描述個體資料的散布。若學生分數標準差是 12，意思是個別學生分數圍繞平均值的波動尺度大約是 12。

標準誤 SE 描述統計量的散布。若樣本平均的 SE 是 2，意思是不同樣本平均之間的波動尺度大約是 2。

這兩句差很多。SD 大，不代表樣本平均一定很不準；只要樣本數夠大，平均值可以變得比較穩。SE 的常見公式是：

SE(xbar) = sigma / sqrt(n)

樣本數 n 變大，分母 sqrt(n) 變大，SE 會變小。這就是為什麼大樣本平均通常比小樣本平均穩。

## CLT 在說什麼

中央極限定理常被簡化成「樣本數夠大就常態」。這句話太粗。

比較準確的說法是：在條件合適時，樣本平均的分布會隨著樣本數變大而接近常態，即使原始資料本身不完全常態。

主角是樣本平均，不是每一筆原始資料。原始資料可能偏態、離散、甚至不是常態；CLT 說的是很多樣本平均放在一起看的形狀。這一點如果搞錯，後面會把常態近似用到不該用的地方。

CLT 的用途，是讓我們可以用常態近似處理平均值的不確定性。信賴區間裡的 z 值、許多假設檢定的近似，都站在這個想法上。

## 一題標準誤算例

假設某測驗分數的母體標準差約為 12。現在抽 36 位學生，得到樣本平均 78。問樣本平均的標準誤是多少？

公式是：

SE(xbar) = sigma / sqrt(n)

代入 sigma=12、n=36：

SE = 12 / sqrt(36) = 12 / 6 = 2

這裡的 2 不是在說每位學生的分數只差 2。個別學生分數的波動仍然由 SD=12 描述。SE=2 說的是：如果你一批一批抽 36 位學生，每批都算平均，這些平均值的波動尺度大約是 2。

考試答案可以寫：「樣本平均的標準誤為 2，代表樣本平均作為母體平均估計量時的抽樣波動。它不同於個體分數的標準差 12。」

這句解釋很重要。很多題目不只要你算 SE，還要你知道 SE 是誰的波動。

## 為什麼樣本數增加不是線性變準

SE 的分母是 sqrt(n)，所以樣本數增加會讓平均更穩，但不是 n 變 4 倍就精準 4 倍。n 從 25 增加到 100，sqrt(n) 從 5 變 10，SE 變成原本一半。

這個性質在考試和實務都很重要。想把估計誤差砍半，通常需要大約 4 倍樣本。這也是為什麼小樣本的模型比較很容易不穩；多測幾題有幫助，但不會神奇消除不確定性。

## 這在 ML / AI 哪裡會用到

benchmark 分數就是樣本統計量。模型在某個測試集上的 accuracy、F1、平均勝率，都只是這批測試資料上的結果。真正想知道的是模型面對同類未來任務時的表現。

如果模型 A 分數是 82.1，模型 B 是 82.3，差距看起來存在，但未必穩定。你要問測試集多大、題目是否代表真實任務、分數的標準誤多大、是否做過 bootstrap 或信賴區間。

這也是為什麼嚴謹的模型評估不應該只放排行榜。排名只給點估計，沒有告訴你不確定性。統計學會逼你問：如果換一批測試題，排名還會一樣嗎？

## 來源使用方式

- 官方考古題 PDF 只用來確認年份、科目名稱與題面，不把兩年題型當成完整範圍。
- grad-exam-prep 備考頁用來對齊學習路線、題型入口與練習節奏，不視為官方標準答案。
- OpenIntro、OpenStax 與其他開放教材用來核對公式、定義、假設與常見推導。
- Stanford CS109 與 scikit-learn 文件用來補 ML/AI 對接：模型訓練、評估、實驗與不確定性報告。

## 題型辨識提示

- 題目問原始資料散布，用 SD。
- 題目問樣本平均或估計量的波動，用 SE。
- 樣本數出現在 sqrt(n) 分母，通常是在處理抽樣分布。
- benchmark 差距很小時，先問不確定性，不要只看排名。

## 常見錯誤

- 把 SD 和 SE 當成同一個量。
- 把 CLT 解釋成原始資料會變常態。
- 樣本數增加時，以為精準度會線性增加。
- 看到模型分數差一點，就直接宣布新模型比較好。

## 練習題

1. 若 sigma=15、n=25，算樣本平均的 standard error。
2. 把 n 從 25 改成 100，說明 SE 為什麼變成原本一半。
3. 用一句話區分 SD 與 SE，句子裡必須說清楚「誰在波動」。
4. 設計一個 benchmark 比較例子，說明為什麼小差距要搭配不確定性。

## 下一篇怎麼接

有了標準誤，下一步就是信賴區間。第 9 篇會把「估計值 ± 不確定性」寫成考試可用的答案，也會說明為什麼信賴區間不能解釋成母體參數有某個機率落在裡面。

## 章節級參考對照

- OpenIntro / OpenStax：支撐 sampling distribution、standard error、CLT、sample mean 與 confidence interval 前置概念。
- Stanford CS109：支撐抽樣、重複實驗、大樣本近似與 ML 評估直覺。
- scikit-learn：支撐 benchmark metric、model evaluation 與 uncertainty reporting 語境。

## 參考資料

- [OpenIntro Statistics：sampling distribution、standard error、CLT](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e：sampling, standard error, and confidence interval foundations](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109：sampling, uncertainty, and large-sample approximation](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation：benchmark metrics and uncertainty reporting](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)

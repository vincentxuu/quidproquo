---
title: "PMF、PDF、CDF 怎麼把機率變成可計算的題目？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 5
tldr: "隨機變數把事件結果轉成數字。這篇用 PMF、PDF、CDF 說明離散與連續機率怎麼計算，並接到模型分數、threshold 和 token 機率分布。"
description: "統計學隨機變數導讀：如何分辨 PMF、PDF、CDF，計算離散與連續機率，並理解它們在 ML/AI score distribution 和 token sampling 的用途。"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-random-variables-en)

前一篇談機率時，我們把題目拆成事件：信件是不是真的垃圾、模型有沒有判成垃圾、兩件事是否獨立。這一篇要往前走一步。很多統計題不只問事件會不會發生，而是問一個數值會是多少、落在哪個區間、超過某個門檻的機率有多大。

這時就需要隨機變數。隨機變數的工作，是把不確定的結果轉成可以計算的數字。擲骰子的結果可以變成 X=1 到 6；模型的信心分數可以變成 0 到 1 之間的數；客服中心一天進來的工單數可以變成非負整數。

初學者常把 PMF、PDF、CDF 當成三個要背的名詞。比較好的讀法是先問：這個隨機變數是離散還是連續？題目給的是每個值的機率、某個位置的密度，還是累積到某個值以前的機率？

## 隨機變數是在替結果編碼

事件只回答「有沒有發生」。隨機變數回答「結果對應到哪個數字」。

如果你擲一枚硬幣，可以定義 X=1 代表正面，X=0 代表反面。X 就是隨機變數。它是一個編碼規則：每次實驗發生後，依照結果給出一個數值。

如果你看模型分類結果，也可以定義 X=1 代表答對，X=0 代表答錯。那麼模型在一題上的表現，就是一個 0/1 隨機變數。把很多題加起來，就會接到後面的 Bernoulli 和 Binomial。

如果你看的是模型輸出的信心分數，X 可能是 0 到 1 之間的連續數值。這時你通常不問 P(X=0.73) 這種單點機率，而是問 P(X>0.8) 或 P(0.6<X<0.9)。

## PMF：離散值一格一格算

離散隨機變數只有可列出的可能值。PMF，也就是 probability mass function，會告訴你每個值的機率。

例如 X 表示一題選擇題模型輸出的錯誤類型：

| X | 意義 | 機率 |
|---|---|---:|
| 0 | 答對 | 0.70 |
| 1 | 概念錯 | 0.20 |
| 2 | 粗心錯 | 0.10 |

這張表就是 PMF。它必須滿足兩件事：每個機率不能小於 0，全部機率加起來要等於 1。考試題給 PMF 時，第一步就先檢查這兩件事。很多題目會把這個檢查藏在「求常數 c」裡。

如果題目問 P(X=1)，答案是 0.20。如果問 P(X>0)，就是概念錯或粗心錯，所以是 0.20+0.10=0.30。

## PDF：連續資料看面積，不看單點高度

連續隨機變數的麻煩在於可能值太多。身高、時間、模型信心分數、預測誤差，都可以落在一段連續範圍裡。這時我們不用 PMF，而用 PDF，也就是 probability density function。

PDF 最容易被誤解。PDF 的高度不是單點機率。對連續隨機變數來說，P(X=a) 通常是 0。真正有意義的是區間面積。

所以看到 PDF 題，要把問題翻成面積。例如題目給一個密度函數 f(x)，問 P(1<X<3)，你要做的是把 f(x) 從 1 到 3 積分。圖形上就是曲線底下、1 到 3 之間的面積。

考試中，PDF 題常見兩種任務：先用總面積等於 1 求常數，再用區間積分求機率。不要把 f(2) 直接當成 P(X=2)。

## CDF：把左邊全部累積起來

CDF，也就是 cumulative distribution function，記成 F(x)=P(X<=x)。它回答的是：隨機變數小於等於 x 的機率有多少。

CDF 的好處是區間機率可以用相減。P(a<X<=b)=F(b)-F(a)。對離散和連續變數都可以這樣想，只是端點是否包含要依題目定義小心處理。

假設 X 是模型信心分數，F(0.6)=0.25，意思是有 25% 的樣本信心分數小於等於 0.6。若 F(0.9)=0.80，那 P(0.6<X<=0.9)=0.80-0.25=0.55。

這個語言在 ML/AI 很實用。你設定 threshold 時，常常是在問「有多少分數落在門檻以下」或「有多少樣本會被分到高風險區」。這就是 CDF 的問題。

## 一題 PMF 與 CDF 算例

假設 X 表示某模型在單題回答上的人工評分：

| X | 意義 | 機率 |
|---|---|---:|
| 0 | 錯誤 | 0.20 |
| 1 | 部分正確 | 0.50 |
| 2 | 完全正確 | 0.30 |

第一步先檢查 PMF。0.20、0.50、0.30 都非負，而且加總為 1，所以這是一個合法 PMF。

第二步算 CDF。F(0)=P(X<=0)=0.20。F(1)=P(X<=1)=0.20+0.50=0.70。F(2)=1。

第三步回答區間問題。若題目問 P(0<X<=2)，意思是評分落在部分正確或完全正確。用 PMF 加總是 0.50+0.30=0.80。用 CDF 算是 F(2)-F(0)=1-0.20=0.80。

常見錯誤是把 P(0<X<=2) 寫成 F(2)-F(1)。那樣只會得到 P(1<X<=2)，少算了 X=1 的部分。離散題尤其要注意端點。

## 這在 ML / AI 哪裡會用到

語言模型的下一個 token 機率分布，可以看成離散分布。每個 token 都有一個機率，全部加起來是 1。抽樣溫度、top-k、top-p 這些設定，都是在改變或截斷這個離散分布。

分類模型的 score distribution 比較像連續變數。你不會只問某個樣本 score 剛好等於 0.731 的機率，而會問 score 超過 0.8 的比例，或低於 0.3 的樣本是不是集中在某些題型。

評估模型時，metric 本身也可以被看成隨機變數。換一批測試題，accuracy、F1、平均分數都可能變。後面的抽樣分布、信賴區間和 bootstrap，都是從這個觀念長出來的。

## 來源使用方式

- 官方考古題 PDF 只用來確認年份、科目名稱與題面，不把兩年題型當成完整範圍。
- grad-exam-prep 備考頁用來對齊學習路線、題型入口與練習節奏，不視為官方標準答案。
- OpenIntro、OpenStax 與其他開放教材用來核對公式、定義、假設與常見推導。
- Stanford CS109 與 scikit-learn 文件用來補 ML/AI 對接：模型訓練、評估、實驗與不確定性報告。

## 題型辨識提示

- 題目列出每個可能值的機率，先想 PMF。
- 題目給連續函數並問區間機率，先想 PDF 面積。
- 題目給 F(x) 或問小於等於某值，先想 CDF。
- 遇到 threshold、score、小於某分數的比例，可以用 CDF 語言解釋。

## 常見錯誤

- 把 PDF 的高度當成單點機率。
- 離散題算 CDF 相減時漏掉端點。
- 忘記 PMF 機率加總必須等於 1。
- 把模型 score 當成固定常數，忘記換資料時它會波動。

## 練習題

1. 寫出一個離散隨機變數和一個連續隨機變數，分別說明 support。
2. 給定 P(X=0)=0.2、P(X=1)=0.5、P(X=2)=0.3，算 F(1) 和 P(0<X<=2)。
3. 用一句話解釋 PDF 為什麼不是單點機率。
4. 找一個模型 score threshold，說明 CDF 可以回答哪個實務問題。

## 下一篇怎麼接

隨機變數讓機率可以計算。下一篇會進到幾個最常見的分布：Bernoulli、Binomial、Normal、Poisson。你會開始練習看到題目情境時，先判斷是哪一種資料生成方式。

## 章節級參考對照

- OpenIntro / OpenStax：支撐 random variable、PMF、PDF、CDF、support 與區間機率。
- Stanford CS109：支撐隨機變數、離散/連續分布與機率模型語言。
- scikit-learn：支撐 score distribution、threshold 與分類模型評估語境。

## 參考資料

- [OpenIntro Statistics：random variables、PMF、PDF、CDF](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e：random variables and probability distributions](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109：random variables and probability models](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation：score distribution and thresholds](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)

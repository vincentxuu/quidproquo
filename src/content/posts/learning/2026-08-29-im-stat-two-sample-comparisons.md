---
title: "兩組平均或比例差異，該用哪一種比較題型？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 11
tldr: "兩組比較要先判斷 outcome 是數值還是比例、兩組資料是否獨立；這一步會決定標準誤、檢定統計量與結論可信度。"
description: "兩樣本比較入門：獨立平均數、Welch t、成對比較、兩比例差異，以及 ML/AI 模型評估中的 paired design。"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-two-sample-comparisons-en)

兩組資料比較看起來很直覺：A 組平均 78，B 組平均 72，所以 A 比 B 高 6 分。考試通常會再往下追問：「這 6 分相對於抽樣波動有多大？」以及「你有沒有選對比較方式？」

選錯方式常發生在兩種情境。第一種是把成對資料當成獨立資料，例如同一批學生前後測、同一批題目給兩個模型作答。第二種是把比例題當成平均題，例如點擊率、轉換率、答對率。題目表面上都在比較兩組，底下的標準誤完全不同。

## 先用三個問題分類

遇到兩組比較，先問三個問題。

第一，outcome 是數值還是二元結果？分數、時間、金額通常是平均數比較；是否點擊、是否答對、是否購買通常是比例比較。

第二，兩組是否獨立？A 班和 B 班不同學生，多半是獨立樣本。同一個人前後測、同一張考卷由兩種方法批改、同一批 prompt 給兩個模型，則是成對資料。

第三，題目是否要求等變異？入門考試有時會明講 pooled variance；實務上如果沒有強理由假設兩組變異相同，Welch t test 常是比較穩的預設。

用這三步，你可以先排出題型：

```text
數值 outcome + 獨立兩組 -> independent two-sample t
數值 outcome + 成對資料 -> paired t
二元 outcome + 獨立兩組 -> two-proportion comparison
二元 outcome + 成對資料 -> 看每對差異、McNemar 或 bootstrap 等設計
```

## 手算例題：獨立兩組平均差

某課程兩班學生考同一份測驗。A 班 `n1 = 25`、平均 `xbar1 = 78`、標準差 `s1 = 10`；B 班 `n2 = 25`、平均 `xbar2 = 72`、標準差 `s2 = 12`。估計 A 班與 B 班平均差，並看差距相對於標準誤有多大。

先寫差異估計：

```text
xbar1 - xbar2 = 78 - 72 = 6
```

如果先用不等變異的標準誤結構：

```text
SE = sqrt(s1^2 / n1 + s2^2 / n2)
   = sqrt(10^2 / 25 + 12^2 / 25)
   = sqrt(4 + 5.76)
   = sqrt(9.76)
   ≈ 3.12
```

t 統計量約為：

```text
t = 6 / 3.12 ≈ 1.92
```

到這裡還不能直接寫「顯著」。你還需要自由度、顯著水準，以及單尾或雙尾設定。這個例子比較適合拿來看觀念：平均差 6 分看起來有感，但它只有約 1.92 個標準誤大；在雙尾 5% 檢定下，未必足以拒絕兩班母體平均相同的假設。

## 成對比較為什麼不同

假設同一批 20 題測試題，模型 A 與模型 B 每題各得到 0 或 1 分。這不是兩組獨立樣本，因為每一題的難度同時影響兩個模型。簡單題兩個模型都容易答對，難題兩個模型都容易答錯；這種共同背景要被保留下來。

成對比較的做法是先對每一題算差值：

```text
d_i = A_i - B_i
```

然後對這 20 個差值做推論。此時檢定的是 `d` 的母體平均是否為 0。這會把「題目本身難度」造成的共同波動扣掉，通常比把 A、B 當成兩個獨立樣本更有力量。

同一批使用者前後看到兩種介面、同一批文件用兩個抽取器處理、同一批客服對話交給兩個分類器，都是類似的成對設計。

## 比例差異怎麼看

如果比較的是成功率，估計值會變成：

```text
phat1 - phat2
```

例如版本 A 有 400 人、轉換 52 人，`phat1 = 0.13`；版本 B 有 400 人、轉換 68 人，`phat2 = 0.17`。差異是 0.04，也就是 4 個百分點。接著要看這 4 個百分點相對於比例的標準誤有多大。

在產品實驗裡，比例題還要確認隨機分派單位。你是以使用者為單位分派，還是以 session、頁面曝光、公司帳號分派？分派單位錯了，統計上看似有很多樣本，實際獨立資訊可能少很多。

## 這在 ML / AI 哪裡會用到

模型評估的兩組比較很常被誤用。若兩個模型跑同一批測試題，這是 paired evaluation。你應該看每題差異、每個案例的勝負，或使用 bootstrap 在相同案例上重抽，而不是只拿兩個總 accuracy 做獨立比較。

線上 A/B test 則要看實驗單位。若使用者被隨機分到模型 A 或模型 B，而且每位使用者只進一組，可能是獨立兩組。若同一位標註者同時比較 A/B 回答品質，資料又回到成對比較。

這些判斷會影響你怎麼寫模型報告。成熟一點的報告不只寫「模型 B +2%」，還要寫測試設計、樣本數、差異估計、區間或檢定結果，以及這個差距對產品是否值得。

## 常見錯誤

- 看到兩組就直接套獨立兩樣本 t 檢定，忽略成對結構。
- 把答對率、轉換率這類比例題當成平均數題。
- 題目沒要求等變異卻硬用 pooled variance。
- 只比較平均差大小，沒有看標準誤。
- 模型評估只看總分，不看同一批題目的逐題差異。

## 練習題

1. 判斷三個情境該用 independent two-sample、paired comparison 或 two-proportion comparison：兩班不同學生、同一批學生前後測、兩版按鈕轉換率。
2. 給定兩組平均、標準差、樣本數，寫出差異估計與不等變異標準誤。
3. 設計一個同一批 prompt 比較兩個 LLM 的 paired evaluation，說明每筆 `d_i` 可以怎麼定義。
4. 某 A/B test 差 1.5 個百分點，請列出你會檢查的統計與產品條件。

## 下一篇怎麼接

兩組比較仍然常處理平均數或比例。下一篇會進入更純粹的類別資料：當資料是一格一格的次數表時，卡方檢定會用「觀察次數」和「期望次數」判斷分布或關聯。

## 章節級參考對照

- OpenIntro / OpenStax：獨立兩樣本、成對 t 檢定與兩比例比較。
- Stanford CS109：比較估計與標準誤的抽樣觀點。
- scikit-learn：模型評估設計與同一測試集比較的語境。

## 參考資料

- [Two-Sample Inference in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Two Population Means and Proportions](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation: Metrics and Scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)

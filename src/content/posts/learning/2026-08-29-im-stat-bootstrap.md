---
title: "不知道公式分布時，bootstrap 怎麼用重抽樣估不確定性？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 32
tldr: "不知道公式分布時，bootstrap 怎麼用重抽樣估不確定性？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 32 篇：不知道公式分布時，bootstrap 怎麼用重抽樣估不確定性？"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-bootstrap-en)

有些統計量很好算，抽樣分布卻很難推。平均數還有熟悉的標準誤公式；中位數、F1、模型 win rate、兩模型分數差、複雜 ratio，就沒有那麼順手。

Bootstrap 的想法很務實：既然不知道重複抽樣時統計量會怎麼晃，就用手上的樣本反覆重抽，製造出很多個「像是重新抽到的資料集」，再看統計量在這些資料集裡怎麼變。

這篇要把 bootstrap 學成一套程序，而不是只背「抽 1,000 次」。你要能說清楚抽樣單位是什麼、為什麼要有放回、區間怎麼從重抽結果來，以及哪些資料結構不能亂抽。

## 為什麼要有放回重抽

Bootstrap 把原始樣本當成母體的替身。假設你原本有 `n` 筆資料，就從這 `n` 筆裡有放回地抽 `n` 筆，形成一個 bootstrap sample。

有放回很重要。因為有放回，某些觀察值會出現多次，某些觀察值會沒被抽到。這會模擬「如果重新抽樣，樣本組成可能有變」的感覺。

每次重抽後，重新計算你關心的統計量 `T*`。重複 `B` 次後，你會得到：

```text
T*_1, T*_2, ..., T*_B
```

這一串數字就是 bootstrap 近似出來的抽樣分布。你可以用它的標準差估 standard error，也可以用分位數做 percentile interval。

## bootstrap 的基本流程

流程可以寫成四步。

第一，決定抽樣單位。是使用者、題目、交易、公司、文章，還是一組 paired comparison？這一步最容易被忽略。

第二，從原樣本有放回地抽出同樣大小的樣本。

第三，在這份重抽樣本上重新計算統計量。

第四，重複很多次後，用 bootstrap 統計量的分布估 SE 或信賴區間。

用符號寫：

```text
Original sample: x1, x2, ..., xn
Bootstrap sample b: x*_1, x*_2, ..., x*_n
Statistic: T*_b = T(x*_1, ..., x*_n)
Repeat b = 1, ..., B
```

## 手算例題：用 bootstrap percentile interval

假設你比較一個模型在 200 題測試集上的 accuracy。你把 200 題當成抽樣單位，每次有放回抽 200 題，重算 accuracy，總共做 `B = 1000` 次。

做完後把 1,000 個 bootstrap accuracy 由小到大排序。若第 25 個值是 0.78，第 975 個值是 0.86，95% percentile interval 就可以寫成：

```text
(0.78, 0.86)
```

因為 25/1000 = 2.5%，975/1000 = 97.5%。這個區間用的是 bootstrap 分布的中間 95%。

報告時可以寫：「以測試題為重抽樣單位、使用 1,000 次 percentile bootstrap，accuracy 的 95% 區間約為 78% 到 86%。」

這句話刻意寫出「以測試題為重抽樣單位」。如果抽樣單位其實錯了，整個區間都會跟著錯。

## paired bootstrap：比較兩個模型時不要拆散

模型比較常需要 paired bootstrap。假設模型 A 和模型 B 都回答同一批 200 題。你真正關心的是每一題上 A 和 B 的差距，例如：

```text
d_i = score_A_i - score_B_i
```

這時重抽樣單位應該是「題目」，而且每抽到一題，就同時帶著 A 和 B 在那題的結果。接著重算平均差距。

不要把 A 的 200 個分數和 B 的 200 個分數分開重抽。那會破壞同題比較的配對結構，也會把題目難度造成的共同波動弄丟。

LLM eval 很常用 paired design，因為同一題對兩個模型都難或都簡單。保留配對能讓差距估計更穩，也比較符合實驗設計。

## cluster bootstrap：資料有群組時要抽群組

如果資料來自群組，重抽單位可能不是單筆資料。

例如一個客服機器人 eval 有 1,000 則訊息，但它們來自 100 位使用者，每位使用者 10 則。若同一位使用者的問題風格很像，把 1,000 則訊息當獨立樣本會低估不確定性。

比較合理的做法是抽使用者，再把該使用者的訊息一起帶進樣本。這類方法常被稱為 cluster bootstrap。

考試未必會要求這個名詞，但你至少要知道：bootstrap 不是隨便把資料列打散重抽。抽樣單位要對應資料生成方式。

## bootstrap 做不到什麼

Bootstrap 可以近似抽樣波動，但它不能修好原始樣本偏誤。

如果你的測試集本來就缺少長尾案例、只收英文題、或只包含某個 benchmark 的固定模板，bootstrap 只會在這個偏掉的樣本裡重抽。它不會替你補回真實使用情境。

它也不保證小樣本一定可靠。樣本很小時，原樣本能提供的母體替身很粗糙，bootstrap 分布也可能過度樂觀。

## 題型怎麼辨識

看到「resampling」「with replacement」「percentile interval」「bootstrap standard error」，先寫出程序。

題目若要求區間，常見解法是把 bootstrap 統計量排序後取兩端分位數。

題目若是兩模型比較、前後測、同一人兩次量測，要先檢查是否需要 paired bootstrap。

題目若有班級、使用者、公司、醫院、資料來源等群組，要考慮抽群組，而不是抽單筆列。

## 這在 ML / AI 哪裡會用到

Bootstrap 很適合 ML/AI 評估報告，尤其指標難以手推分布時。F1、win rate、平均人工評分、pass@k、latency percentile，都可以透過重抽樣估不確定性。

在 LLM 比較裡，你可以對測試題做 paired bootstrap，每次抽一批題目，重算模型 A 和模型 B 的平均分數差。最後看差距分布有多少比例低於 0，或直接報差距的 percentile interval。

在產品 A/B testing 裡，若使用者是實驗單位，就應該以使用者為重抽樣單位。若同一使用者有很多事件，直接抽事件會把有效樣本數灌大。

Bootstrap 的優點是直覺、彈性、容易寫成程式。缺點也很明確：它繼承原始資料的偏誤，且抽樣單位選錯時會給你看似精密的錯答案。

## 常見錯誤

- 把 bootstrap 說成重新蒐集資料；它其實是在現有樣本內重抽。
- 忘記有放回，抽完每筆只出現一次，變成打亂順序。
- 比較兩個模型時把 paired 結構拆散。
- 群組資料直接抽 row，低估標準誤。
- 把 bootstrap 區間寫得很精準，卻沒有說明原始樣本是否代表真實任務。

## 練習題

1. 寫出 `B = 1000` 次 bootstrap 的完整流程，並標明抽樣單位。
2. 若 bootstrap 統計量排序後第 25 個與第 975 個值分別是 0.78、0.86，寫出 95% percentile interval 與解釋句。
3. 模型 A 和 B 回答同一批題目。請說明 paired bootstrap 要怎麼抽，為什麼不能把兩邊分數拆開。
4. 一個 eval set 有 50 位使用者、每位使用者 20 筆紀錄。若要估平均滿意度的不確定性，你會怎麼設計 bootstrap？

## 下一篇怎麼接

Bootstrap 讓你在公式不方便時仍然能估不確定性。下一篇會換到 Bayesian inference：它不只給區間，也把 prior、資料和 posterior 放進同一套機率更新語言。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐重抽樣、抽樣分布與區間估計的基礎。
- Stanford CS109 支撐以模擬理解不確定性的做法，和 bootstrap 的程序直覺相接。
- scikit-learn Model Evaluation 支撐模型分數與評估指標情境；本文把 bootstrap 放在模型比較與小樣本評估中。

## 參考資料

- [本篇主題 Bootstrap：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)

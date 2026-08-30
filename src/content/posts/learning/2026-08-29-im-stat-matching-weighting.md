---
title: "Matching 和 weighting 怎麼讓觀察資料比較像實驗？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 46
tldr: "Matching 和 weighting 怎麼讓觀察資料比較像實驗？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 46 篇：Matching 和 weighting 怎麼讓觀察資料比較像實驗？"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-matching-weighting-en)

上一篇談因果推論時，關鍵字是可比性。隨機實驗用 randomization 建立可比性；觀察資料沒有這個保障，所以要靠設計和假設補上。

matching 和 weighting 是兩個常見工具。它們不會把觀察資料變成真正的實驗，但可以在「已觀察到的變數」上讓 treatment group 和 control group 比較像。考試常問 propensity score、配對、權重、balance；ML/AI 實務則會在 logged data、推薦策略離線評估、廣告投放成效估計裡碰到同一個問題。

## 這篇先解決什麼問題

假設你想知道「上過一門 AI 課程」是否提高求職錄取率。直接比較上課者和沒上課者，很可能會高估課程效果，因為上課者可能原本就比較積極、基礎較好、履歷較完整。

matching 的想法是：替每個上課者找一個背景接近的沒上課者。兩人年資、學歷、職務、過去作品都接近，再比較結果會合理一點。

weighting 的想法是：不要丟掉資料，而是調整每筆資料的權重，讓加權後的兩組背景分布接近。

兩者的共同目標是 balance。先確認兩組能不能比較，再談 treatment effect 多少。

## 核心直覺

先看一個直覺版本。

你有兩組求職者：

- Treatment group：上過 AI 課程。
- Control group：沒有上過 AI 課程。

若 treatment group 大多是兩年以上經驗，control group 大多是剛畢業，直接比較錄取率就不公平。matching 會找相似背景的人配對；weighting 會讓少見但重要的人在統計上變得更有代表性。

propensity score 是這兩類方法常用的壓縮工具：

```text
e(X) = P(T = 1 | X)
```

它代表在背景變數 `X` 下，一個人接受 treatment 的機率。若兩個人的 propensity score 接近，表示他們根據已觀察背景來看，接受 treatment 的傾向接近。

## 公式 / 機制

propensity score matching 的流程可以寫成：

```text
1. 用 X 預測 T，得到 e(X)
2. 替每個 treatment unit 找 e(X) 接近的 control unit
3. 檢查配對後 covariates 是否 balanced
4. 在配對後樣本估 treatment effect
```

inverse probability weighting，簡寫 IPW，則用權重重建一個比較像隨機分配的樣本。常見權重是：

```text
treated: 1 / e(X)
control: 1 / (1 - e(X))
```

直覺是：如果某人根據背景很不可能接受 treatment，卻實際接受了 treatment，這筆資料在估計 treatment group 時很珍貴，權重會變大。control 也同理。

但權重太大會讓估計不穩。實務上會看 propensity score overlap、極端權重、加權後 balance，而不是只把公式套完。

## 一步一步算例

假設你有四位求職者，要估上課對錄取的影響：

| 人 | 是否上課 T | propensity score e(X) | 是否錄取 Y |
|---|---:|---:|---:|
| A | 1 | 0.80 | 1 |
| B | 1 | 0.40 | 1 |
| C | 0 | 0.75 | 1 |
| D | 0 | 0.35 | 0 |

### matching 怎麼看

A 的 `e(X)=0.80`，最接近的 control 是 C 的 `0.75`。兩人結果差：

```text
1 - 1 = 0
```

B 的 `e(X)=0.40`，最接近的 control 是 D 的 `0.35`。兩人結果差：

```text
1 - 0 = 1
```

兩組配對平均差：

```text
(0 + 1) / 2 = 0.5
```

在這個小例子裡，matching 估計上課使錄取機率提高 0.5。這只是示範流程，真實資料不能用這麼少樣本下結論。

### weighting 怎麼看

IPW 權重如下：

```text
A treated weight = 1 / 0.80 = 1.25
B treated weight = 1 / 0.40 = 2.50
C control weight = 1 / (1 - 0.75) = 4.00
D control weight = 1 / (1 - 0.35) = 1.54
```

C 的 control 權重很大，因為根據背景它很可能上課，卻沒有上課。這種樣本對建立反事實比較很有用，但也會讓估計變得敏感。

考試若給一張表，通常不會要你推完整理論。你要能做三件事：算權重、解釋權重變大的原因、指出 extreme weights 的風險。

## 這在 ML / AI 哪裡會用到

ML/AI 最常碰到的是 logged data。

推薦系統只會記錄舊策略展示過的內容，以及使用者對那些內容的反應。你沒有看到「如果當時展示另一個 item」會怎樣。這跟 treatment/counterfactual 是同一個問題。

假設舊推薦策略偏好熱門商品，冷門商品被展示機率很低。若你用這份 log 評估新策略，新策略推薦冷門商品時，資料裡幾乎沒有可比觀察。這時候 weighting 的語言會出現：展示機率低但被展示到的紀錄，權重要比較高。

廣告也類似。平台常會把廣告投給最可能轉換的人，這會讓廣告效果看起來膨脹。matching 和 weighting 可以幫你問得更精確：在背景接近的人之間，有沒有看到廣告造成的額外差異？

這些方法的底線也要記住：沒有量到的 confounder，matching 和 weighting 仍然處理不了。若資料沒有記錄使用者意圖、預算、當下需求，方法看起來完整，因果解釋還是會脆弱。

## 來源使用方式

- 官方考古題 PDF 只用來確認年份、科目名稱與題面，不把兩年題型當成完整範圍。
- grad-exam-prep 備考頁用來對齊學習路線、題型入口與練習節奏，不視為官方標準答案。
- OpenIntro、OpenStax 與其他開放教材用來核對公式、定義、假設與常見推導。
- Stanford CS109 與 scikit-learn 文件用來補 ML/AI 對接：模型訓練、評估、實驗與不確定性報告。

## 題型辨識提示

- 題目提到 propensity score，先寫 `e(X)=P(T=1|X)`。
- 題目問 matching，重點是「找相似 control」和「檢查 balance」。
- 題目問 weighting，重點是權重公式、極端權重和 overlap。
- 題目只要求解釋觀念時，不要把 matching 說成消除所有 bias；它主要處理 observed confounders。

## 常見錯誤

- 只算 treatment effect，沒有先檢查 covariate balance。
- 把 propensity score 當 outcome model。它預測的是 treatment assignment，不是結果。
- 忽略 overlap。若某些背景的人幾乎只出現在 treatment group，資料本身就缺少合適比較對象。
- 看見加權後樣本數變大，就以為資訊真的變多。權重改的是代表性，也可能放大噪音。
- 忘記未觀察混雜。沒有被記錄的重要差異，公式不會自動修掉。

## 練習題

1. 用一句話說明 propensity score 預測的是什麼。
2. 若 `e(X)=0.2` 且此人實際接受 treatment，IPW treated 權重是多少？直覺上代表什麼？
3. 若 `e(X)=0.95` 且此人是 control，control 權重是多少？這種樣本會帶來什麼風險？
4. 寫出 matching analysis 的基本流程，至少包含估 propensity、配對、檢查 balance、估效果。
5. 在推薦系統 logged data 中，為什麼舊 policy 的曝光機率會影響新 policy 的離線評估？

## 下一篇怎麼接

matching 和 weighting 都在處理「資料怎麼來」。下一篇進到 time series，問題會換成時間順序：資料是一條會自己延續的軌跡，不能當成一袋觀察值隨機打散。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐觀察資料、比較組、混淆因子與實驗設計的基礎。
- Stanford CS109 支撐條件機率、選擇機制與 reweighting 直覺。
- scikit-learn evaluation 文件支撐 ML 評估流程的語言，本文用 logged data 說明一般 validation 和 counterfactual evaluation 的差異。
- 本文把 matching / weighting 接到 recommender、ads 和 policy evaluation。

## 參考資料

- [Matching、weighting、propensity score、observed confounders 與 observational study：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)

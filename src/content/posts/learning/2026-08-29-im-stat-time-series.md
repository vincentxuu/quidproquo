---
title: "時間序列為什麼不能隨機切資料？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 47
tldr: "時間序列為什麼不能隨機切資料？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 47 篇：時間序列為什麼不能隨機切資料？"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-time-series-en)

前面的因果推論在問：比較對象能不能比。時間序列換了一個限制：資料有順序。今天的流量、銷售、模型錯誤率、GPU 成本，通常都和昨天有關。你把資料隨機打散，評估結果可能看起來漂亮，但那是因為你偷看了未來。

這篇要建立 time series 的考試與實務直覺。考試常問 trend、seasonality、autocorrelation、moving average、stationarity；ML/AI 會把它用在 forecasting、monitoring、drift detection、capacity planning 和 retraining schedule。

## 這篇先解決什麼問題

一般統計常把樣本想成彼此獨立的觀察值。時間序列不適合這樣想。

若你要用 1 月到 10 月資料預測 11 月需求，訓練和測試就要模擬真實使用方式：只能用過去預測未來。若把 1 到 12 月資料隨機切成 train/test，模型可能在訓練階段看過接近 11 月的資料，測試分數就偏樂觀。

時間序列題目通常先問三件事：

```text
trend: 長期往上或往下的方向
seasonality: 固定週期，例如每週、每月、每年
autocorrelation: 目前值和過去值的相關
```

這三件事會影響模型、檢定、信賴區間和 validation。

## 核心直覺

先看一條每日訂單數：

```text
Mon 100
Tue 105
Wed 108
Thu 112
Fri 118
Sat 160
Sun 150
```

若只算平均，你會得到：

```text
(100 + 105 + 108 + 112 + 118 + 160 + 150) / 7 = 121.86
```

平均值有用，但它藏掉兩個訊息。第一，週末明顯較高，可能有 weekly seasonality。第二，平日從 100 到 118 有上升方向，可能有 trend。

時間序列分析通常從畫圖開始。你要看資料是否有趨勢、週期、異常點、結構轉折。很多錯誤在圖上就看得出來：促銷日尖峰、系統改版造成斷點、追蹤程式壞掉讓數字突然掉到 0。

## 公式 / 機制

最基本的語言是 lag。若 `y_t` 是今天的值，昨天就是：

```text
y_{t-1}
```

lag-1 difference 是：

```text
y_t - y_{t-1}
```

它可以把「水準」改成「變化」。例如訂單數從 118 到 160：

```text
160 - 118 = 42
```

這代表週六比週五多 42 單。

moving average 則用附近幾期平滑短期波動。3-day moving average 例子：

```text
(108 + 112 + 118) / 3 = 112.67
```

autocorrelation 則看 `y_t` 和 `y_{t-k}` 的相關。若 lag-1 autocorrelation 高，代表今天高的時候，明天也常偏高。這種相依性會破壞很多「樣本獨立」的直覺。

validation 也要跟著改。常見做法是 rolling window：

```text
Train: Jan-Mar, Test: Apr
Train: Jan-Apr, Test: May
Train: Jan-May, Test: Jun
```

或 sliding window：

```text
Train: Jan-Mar, Test: Apr
Train: Feb-Apr, Test: May
Train: Mar-May, Test: Jun
```

差別在於你是否保留所有歷史資料。資料生成機制穩定時，expanding window 常有用；若市場或產品變動很快，sliding window 有時更貼近現況。

## 一步一步算例

假設某 AI 產品每週活躍使用者如下：

| 週次 | 使用者數 |
|---:|---:|
| 1 | 100 |
| 2 | 110 |
| 3 | 121 |
| 4 | 133 |
| 5 | 146 |

### 算週成長率

第 2 週相對第 1 週：

```text
(110 - 100) / 100 = 0.10
```

第 3 週相對第 2 週：

```text
(121 - 110) / 110 = 0.10
```

看起來每週約成長 10%。如果用這個趨勢粗估第 6 週：

```text
146 * 1.10 = 160.6
```

### 看 forecast error

假設你預測第 6 週是 161，實際第 6 週是 150。error 是：

```text
actual - forecast = 150 - 161 = -11
```

absolute percentage error 是：

```text
|150 - 161| / 150 = 0.0733
```

約 7.3%。

如果第 6 週產品剛好改版，這個誤差可能來自資料生成機制改變，不一定是模型突然變差。時間序列要把這種事件記錄下來，否則你會把產品事件誤判成隨機波動。

## 這在 ML / AI 哪裡會用到

ML/AI 系統上線後，幾乎所有重要訊號都是時間序列。

模型 accuracy、latency、token cost、retrieval hit rate、conversion rate、human escalation rate，都會按小時、天、週變動。總平均會抹平時間結構，很多問題也跟著被藏起來。

幾個典型場景：

- forecasting：預測需求、流量、客服量、GPU 用量。
- monitoring：觀察 latency、error rate、cost 是否偏離正常區間。
- drift detection：資料分布或模型表現是否逐步變化。
- experiment readout：A/B test 是否受週期、節日或產品事件影響。
- retraining：決定模型多久重訓一次，以及何時觸發人工檢查。

LLM 產品尤其需要時間序列思維。某天 answer quality 掉下去，可能是模型供應商版本變了、retrieval index 過期、使用者問題組成改變、或下游工具 API 失敗。只看一個平均分數，不會告訴你是哪一種。

## 來源使用方式

- 官方考古題 PDF 只用來確認年份、科目名稱與題面，不把兩年題型當成完整範圍。
- grad-exam-prep 備考頁用來對齊學習路線、題型入口與練習節奏，不視為官方標準答案。
- OpenIntro、OpenStax 與其他開放教材用來核對公式、定義、假設與常見推導。
- Stanford CS109 與 scikit-learn 文件用來補 ML/AI 對接：模型訓練、評估、實驗與不確定性報告。

## 題型辨識提示

- 題目出現 day、week、month、year、lag、forecast，先保留時間順序。
- 問 validation 時，優先想到 rolling / expanding window，而不是 random split。
- 問平均或檢定前，先檢查 trend、seasonality、autocorrelation。
- 圖上若有明顯斷點，要把產品事件、政策改變或資料收集改變列入解釋。

## 常見錯誤

- 把時間序列當成一般 iid 資料。
- 用隨機切分評估 forecasting model，造成未來資訊洩漏。
- 只看整體平均，忽略趨勢和季節性。
- 把節日、促銷、改版、追蹤異常當成一般噪音。
- 模型分數下降時立刻重訓，沒有先檢查資料管線和產品事件。

## 練習題

1. 說明 time series 為什麼不適合隨機打散切 train/test。
2. 用一個產品指標例子分辨 trend、seasonality、noise。
3. 給定數列 `100, 105, 120, 118`，計算每一期相對前一期的差。
4. 寫出 rolling validation 的流程，並說明它模擬了哪一種真實預測情境。
5. 如果 LLM 產品的 answer acceptance rate 連續三週下降，你會先查哪些時間序列訊號？

## 下一篇怎麼接

時間序列強調順序，多變量分析強調一起變動的特徵。下一篇會進到 covariance matrix、PCA 和降維，處理高維資料裡的共同方向。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐時間相依資料、趨勢、統計圖形與基礎估計語言。
- Stanford CS109 支撐依時間切分資料、避免 leakage 與資料生成過程的直覺。
- scikit-learn evaluation 文件支撐 validation workflow；本文延伸到 time-aware split、forecasting 與 monitoring。
- 本文的 ML/AI 接點放在 forecasting、drift detection、observability 和 retraining。

## 參考資料

- [Time series、trend、seasonality、autocorrelation、forecasting validation 與 leakage：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)

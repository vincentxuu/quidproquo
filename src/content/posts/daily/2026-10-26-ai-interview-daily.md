---
title: "AI Engineer 面試日練 — 2026-10-26：ML Fundamentals"
date: 2026-10-26
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: zh-TW
description: "星期一主題 ML Fundamentals：從 Spector AI 的真實面試題出發，練習模型上線後效能下滑時，怎麼把 data drift、concept drift、training-serving skew 三種失效模式分開診斷。"
tldr: "今天的核心是三種『模型上線後變差』的失效模式怎麼分開診斷：data drift（輸入分布變了）、concept drift（輸入跟標籤的關係變了,需要真實標籤才能確認）、training-serving skew（根本不是世界變了，是你訓練跟線上兩套特徵計算邏輯本來就不一致）。偵測工具是 PSI（Population Stability Index）,但 PSI 只能告訴你分布動了,動的原因要靠排查順序分清楚。練習題取自 Spector AI 的真實 MLE 面試問法——模型上線兩週後效能下滑,你怎麼診斷——這類題目的關鍵不是背定義,是能示範一套『先排除管線問題,再查 skew,最後才談 drift』的診斷順序。"
series:
  name: "AI Engineer 面試日練"
  order: 68
---

> 🌏 [English version](/posts/daily/2026-10-26-ai-interview-daily-en)

## 今日主題

星期一固定練 ML Fundamentals。今天聚焦一個幾乎每個 MLE onsite 都會遇到的情境題：模型離線驗證分數很好，上線幾週後效能卻掉了，你怎麼診斷。這題看起來像是在考監控工具,但真正在考的是你能不能把「世界變了」（drift）跟「你的系統本來就有兩套不一致的邏輯」（skew）分開——這兩種失效模式的修法完全不同，面試官就是要看你會不會把診斷流程講成一條有順序的邏輯鏈，而不是把三個名詞都丟出來了事。

## 核心概念速記

### Data drift vs concept drift vs prediction drift

三者對應的是同一個系統裡三個不同的機率分布在變。Data drift 是輸入特徵的分布 P(X) 變了（例如使用者年齡結構改變）；concept drift 是輸入跟標籤之間的關係 P(Y|X) 變了（同樣的特徵組合，現在對應到不同的真實結果，例如疫情前後的消費行為跟違約率關係）；prediction drift 是模型輸出分數的分布 P(Ŷ) 變了，不需要標籤就能偵測，是最早能拿到的警訊，但它只是症狀，不直接告訴你根因是 data drift 還是 concept drift。面試時最常見的陷阱是把這三者講成同一件事——要能講出 concept drift 必須等真實標籤（delayed label）回來才能確認，而 data drift 跟 prediction drift 可以即時偵測。

### Training-serving skew 不是 drift

這是最容易被面試官用來考倒人的細節：skew 跟 drift 的根本差異是「世界有沒有真的變」。Drift 是世界變了，你的模型沒跟上；skew 是世界根本沒變，是你訓練時用 batch SQL/Spark 算出來的特徵，跟線上用即時 Python/Flink 算出來的同一個特徵，兩套程式碼本來就算出不一樣的數字——離線 AUC 可能高達 0.97，換成線上實際收到的特徵重新算一次卻只有 0.68，因為訓練用了「過去 30 天訂單數」這種事後才知道的統計量，線上那個時間點根本拿不到同樣的資訊。把這個誤判成 drift 然後急著重新訓練，只會訓練出一個一樣有 bug 的新模型，問題完全沒解決。

### PSI（Population Stability Index）判斷分布有沒有動

PSI 是比較「訓練期的特徵分布」跟「現在這個時間窗的特徵分布」最常用的量化指標，做法是把數值分成幾個 bin，算每個 bin 佔比的變化再加總。業界慣用的門檻是 PSI < 0.1 視為穩定，0.1–0.25 是需要留意的輕微偏移，> 0.25 視為顯著漂移、該觸發重新訓練或 rollback。面試時要能講出 PSI 的限制：它只告訴你「分布動了」，不會告訴你「為什麼動」——分 bin 的方式、樣本量太小、季節性週期都可能讓 PSI 誤報，所以 PSI 超標是觸發排查的訊號，不是直接下結論的依據。

### 離線指標跟線上業務指標不是同一回事

就算排除了 skew 跟 drift，離線驗證分數本身選錯了也會讓「看起來很好」跟「線上有用」脫鉤——離線用的是歷史分布下的某個固定指標（像 AUC、F1），但業務真正在乎的是上線後的轉換率、營收或誤判成本，兩者中間還夾著資料洩漏、時間切分方式、A/B test 的 guardrail 指標選擇等變因。面試官常會追問「你怎麼知道這個模型『真的』有效，不只是分數好看」，答案要接回「用符合時間順序的切分做離線評估、再用 A/B test 驗證業務指標，而不是只看一個離線分數」。

## 今日練習題

### 題目

你上線了一個模型,但兩週後它的效能明顯下滑。你會怎麼診斷這個問題、怎麼修？

**來源**：Spector AI Machine Learning Engineer 面試（整理自 knok.work 面試指南）　**難度**：中等　**環節**：onsite technical

### 拆解思路

1. **先釐清問題**：先問清楚幾件事——效能下滑是突然的還是漸進的（突然的更像 pipeline bug 或 skew，漸進的更像 drift）；部署前後有沒有產品端的改動（例如 UI 改版會直接改變使用者行為）；真實標籤（ground truth）是即時還是延遲回來的；這個模型的業務影響跟重訓練的成本各是多少。
2. **建立框架**：把排查順序講成四層，而不是把三個名詞同時丟出來——(1) 先檢查資料管線本身有沒有壞（schema 變了、join 漏資料、空值異常），(2) 比對訓練跟線上兩套特徵計算邏輯是不是真的一致（排查 skew），(3) 用 PSI／KS test 比對特徵分布有沒有變（data drift），(4) 如果有延遲標籤回來，檢查預測跟真實結果的關係有沒有變（concept drift）。前兩層排除完才輪得到談 drift。
3. **深入核心**：這題真正的技術核心是「skew 跟 drift 的修法完全不同」——skew 是程式碼 bug，答案是把特徵定義收斂到一個共用的 feature store（像 Feast），讓訓練跟線上都呼叫同一份定義，從架構上讓兩套邏輯不可能再分岔；drift 是世界變了，答案才是重新訓練，而且最好是建一個有驗證閘門（validation gate）的持續訓練（continuous training）管線，不要讓偵測到漂移就自動觸發重訓上線，要先過驗證才能真正取代舊模型。
4. **收尾**：總結成一句話——「效能下滑的診斷不是找一個名詞貼上去,是按順序排除管線問題跟 skew,剩下的才是真正該用重新訓練解決的 drift」,再補一句生產環境會怎麼預防：把特徵定義收斂進 feature store 消滅 skew,搭配 PSI 分級告警（輕微記錄、嚴重才觸發重訓）避免過度敏感的誤報。

```diagram
title: 模型效能下滑時的診斷順序
desc: 先排除資料管線問題，再查 training-serving skew，最後才用 PSI 判斷是不是真正的 data drift；分布穩定就只需持續觀察，三層都排除不掉才輪到重新訓練。
caption: 簡化示意：實際診斷還要搭配延遲標籤進一步確認 concept drift，細節見正文。
step: 先查資料管線本身有沒有壞（schema、空值、join）
step: 排除管線問題後，用線上實際特徵重算一次，看分數是不是掉回線上水準（skew 檢查）
step: 用 PSI 比對特徵分布有沒有顯著偏移
step: 分布真的偏移了，才排重新訓練，並接上驗證閘才換模型
---
<svg viewBox="0 0 640 568">
  <path class="dg-line" d="M280 34V64" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line dg-line--warn" d="M376 108H432" marker-end="url(#arrow-warn)" data-step="1"/>
  <path class="dg-line" d="M280 152V204" marker-end="url(#arrow)" data-step="1 2"/>
  <path class="dg-line dg-line--accent" d="M376 248H432" marker-end="url(#arrow-accent)" data-step="2"/>
  <path class="dg-line" d="M280 292V344" marker-end="url(#arrow)" data-step="2 3"/>
  <path class="dg-line" d="M376 388H432" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line dg-line--accent" d="M280 432V484" marker-end="url(#arrow-accent)" data-step="3 4"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <path class="dg-box" d="M280 64L376 108L280 152L184 108Z"/>
    <text class="dg-label" x="280" y="98" text-anchor="middle" dominant-baseline="central">管線本身出問題？</text>
    <text class="dg-sub" x="280" y="120" text-anchor="middle" dominant-baseline="central">schema／空值</text>
  </g>

  <g data-step="1">
    <rect class="dg-box dg-box--warn" x="432" y="84" width="144" height="48" rx="6"/>
    <text class="dg-label" x="504" y="108" text-anchor="middle" dominant-baseline="central">修資料管線</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M280 204L376 248L280 292L184 248Z"/>
    <text class="dg-label" x="280" y="238" text-anchor="middle" dominant-baseline="central">換特徵重算會變差？</text>
    <text class="dg-sub" x="280" y="260" text-anchor="middle" dominant-baseline="central">skew 檢查</text>
  </g>

  <g data-step="2">
    <rect class="dg-box dg-box--accent" x="432" y="220" width="144" height="56" rx="6"/>
    <text class="dg-label" x="504" y="238" text-anchor="middle" dominant-baseline="central">收斂特徵定義</text>
    <text class="dg-sub" x="504" y="260" text-anchor="middle" dominant-baseline="central">Feature Store</text>
  </g>

  <g data-step="3">
    <path class="dg-box" d="M280 344L376 388L280 432L184 388Z"/>
    <text class="dg-label" x="280" y="378" text-anchor="middle" dominant-baseline="central">特徵分布穩定？</text>
    <text class="dg-sub" x="280" y="400" text-anchor="middle" dominant-baseline="central">PSI&lt;0.1</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="432" y="360" width="144" height="56" rx="6"/>
    <text class="dg-label" x="504" y="378" text-anchor="middle" dominant-baseline="central">繼續觀察</text>
    <text class="dg-sub" x="504" y="400" text-anchor="middle" dominant-baseline="central">可能是雜訊</text>
  </g>

  <g data-step="4">
    <rect class="dg-box dg-box--accent" x="208" y="484" width="144" height="64" rx="6"/>
    <text class="dg-label" x="280" y="506" text-anchor="middle" dominant-baseline="central">重新訓練</text>
    <text class="dg-sub" x="280" y="528" text-anchor="middle" dominant-baseline="central">先過驗證才上線</text>
  </g>

  <text class="dg-edge dg-text--warn" x="404" y="96" text-anchor="middle" dominant-baseline="central" data-step="1">是</text>
  <text class="dg-edge" x="290" y="178" text-anchor="start" dominant-baseline="central" data-step="1 2">否</text>
  <text class="dg-edge" x="404" y="236" text-anchor="middle" dominant-baseline="central" data-step="2">是</text>
  <text class="dg-edge" x="290" y="318" text-anchor="start" dominant-baseline="central" data-step="2 3">否</text>
  <text class="dg-edge" x="404" y="376" text-anchor="middle" dominant-baseline="central" data-step="3">是</text>
  <text class="dg-edge" x="290" y="458" text-anchor="start" dominant-baseline="central" data-step="3 4">否</text>
</svg>
```

### 範例回答（面試時可以這樣講）

> **先排除最便宜的可能性**：效能下滑我會先查資料管線本身——schema 有沒有變、join 有沒有漏資料、上游某個來源是不是整段時間都是空值，這些比任何統計檢定都便宜,而且在我過去的經驗裡,管線問題跟 skew 加起來比真正的 concept drift 更常見。接著我會重新用線上實際收到的原始特徵跑一次離線評估,如果這時候分數就掉回線上水準,那就是 training-serving skew,不是 drift——代表訓練用的特徵計算邏輯跟線上根本不一致,重新訓練解決不了這個問題。
>
> **確認是分布真的動了才談 drift**：如果管線跟 skew 都排除了,我才會用 PSI 比對現在這個時間窗跟訓練期的特徵分布,PSI 超過 0.25 我會視為顯著漂移。但 PSI 只告訴我分布動了,不會告訴我是不是跟標籤的關係也變了——如果有延遲標籤回來（像是違約率這種要等一段時間才知道結果的場景）,我會另外追蹤預測分數跟真實結果的對應關係有沒有系統性偏移,這才是 concept drift 的直接證據。
>
> **修法要對應根因**：如果是 skew,我會把特徵定義收斂進 feature store,讓訓練跟線上共用同一份邏輯,從架構上消滅這個問題;如果是真正的 drift,我才會排重新訓練,而且會接一個有驗證閘門的持續訓練管線——偵測到漂移先觸發重訓,但新模型要先通過驗證才能換掉線上版本,不讓系統自己無人監督地切換。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先排查資料管線本身的問題，而不是直接跳到統計檢定 | |
| 有把 training-serving skew 跟 data drift 明確分開（世界變了 vs 兩套邏輯本來就不一致） | |
| 有講出 concept drift 需要真實標籤才能確認，跟 data drift 可以即時偵測的差異 | |
| 有提到 PSI 的用途與限制（偵測分布變化，但不解釋原因） | |
| 有把修法對應到根因（skew 用 feature store，drift 用帶驗證閘門的重新訓練） | |
| 加分：提到分級告警（輕微記錄、嚴重才觸發重訓）避免過度敏感的誤報 | |

## 延伸閱讀

- [Training-Serving Skew and Feature Stores Explained — Stacktrick](https://stacktrick.com/notes/mlops-training-serving-skew-feature-stores/) — 用一個 churn 模型的實例算給你看：離線 0.977 AUC vs 用線上實際特徵重算只有 0.681，很具體地示範 skew 跟 drift 的差別。
- [Concept Drift vs Data Drift vs Model Drift: Key Differences — ML Monitoring Report](https://mlmonitoring.report/posts/concept-drift-vs-data-drift-explained/) — 把三種 drift 搭配 PSI、KS test、ADWIN 等偵測工具列成對照表，適合延伸到演算法層面的偵測方法。

## 參考資料

- [spector-ai Machine Learning Engineer Interview: Questions & Prep — knok.work](https://knok.work/blog/spector-ai-machine-learning-engineer-interview.html) — 本篇練習題的原始問法與 STAR 範例答案來源。
- [Machine Learning Engineer Onsite Interview: Round by Round — CoPilot Interview](https://copilotinterview.com/blog/machine-learning-engineer-onsite-interview) — 「今日主題」情境題的框架來源，對應其 ML fundamentals 輪常見問法第 6 題。
- [Streaming Machine Learning – Real-Time Features, Kafka, Flink — Data Expertise](https://www.dataexpertise.in/streaming-machine-learning-real-time-features-kafka-online-learning/) — 對應「Data drift vs concept drift vs prediction drift」一節三種分布（P(X)、P(Y|X)、P(Ŷ)）的定義來源。
- [Training-Serving Skew and Feature Stores Explained — Stacktrick](https://stacktrick.com/notes/mlops-training-serving-skew-feature-stores/) — 對應「Training-serving skew 不是 drift」一節的核心區分與數字案例。
- [Monitor ML Models in Production (Drift): Practical Guide 2026 — khimananda.com](https://khimananda.com/blog/monitor-ml-models-in-production-drift) — 對應「PSI 判斷分布有沒有動」一節的 PSI 門檻（0.1 / 0.25）與分級告警策略依據。

---
title: "AI Engineer 面試日練 — 2026-11-18：ML System Design"
date: 2026-11-18
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: zh-TW
description: "星期三主題 ML System Design：從一個「服務狀態正常、模型沒變,但缺值率悄悄從 1% 跳到 20%」的虛構監控事件出發,練習怎麼用四層監控框架把訊號分類,再決定要不要重新訓練。"
tldr: "今天的核心是監控訊號分層：服務健康、資料品質、母體位移、模型結果是四種完全不同的問題,綠燈不能互相替代。練習題是一個 feature collector 升版後缺值率悄悄升高、但服務狀態正常的虛構事件,陷阱是看到 drift 分數高就急著重新訓練,卻沒先確認這個訊號到底比對了什麼,也沒等 label 成熟就拿不完整的 cohort 跟完整的 cohort 比。"
series:
  name: "AI Engineer 面試日練"
  order: 91
---

> :globe: [English version](/posts/daily/2026-11-18-ai-interview-daily-en)

## 今日主題

星期三固定練 ML System Design,今天把範圍收到系統設計面試裡最常被追問、卻最少人準備的一段：模型上線之後,監控訊號怎麼讀。多數人準備這題的方式是背出「要監控 data drift 跟 model performance」,但面試官真正想看的是,當某個指標亮紅燈時,你知不知道這個紅燈到底代表哪一種失效——服務本身出問題、特徵的意義悄悄變了、使用者族群改變了,還是模型跟真實世界的關係真的變了。

這類題目考的不是你能不能列出監控項目清單,是你有沒有想過「一個綠燈不能證明另一件事也是對的」——API 回應正常不代表特徵有意義,特徵數值合法不代表特徵語意沒變,整體準確率沒掉也不代表每個族群都還健康。這正是 ML system design onsite 常見的監控深挖環節。

## 核心概念速記

### 把監控訊號拆成四層,一層綠燈不能替另一層背書

生產環境的 ML 監控要分成服務健康(請求有沒有在預算內完成)、資料品質(特徵還保有約定好的語意)、母體位移(輸入分布是不是變了)、模型結果(有可信 label 後,預測還準不準)四層。這四層回答的是四個不同的問題——服務健康正常只代表請求沒有逾時或報錯,不代表特徵查到的數字還有意義;特徵數值落在合法範圍內,不代表它的語意沒有悄悄改變。面試時最常見的失分點,就是把四層混在一起講成「我會做監控」,卻說不出哪個訊號對應哪種失效。

### Training-Serving Skew 可能連 schema 檢查都過得去

最陰險的一種特徵問題不是數值超出範圍,而是語意悄悄變了卻完全合法。例如 feature collector 升版後,舊的欄位名稱被換成新名稱,舊的前處理邏輯讀不到新欄位,就用預設值 0 補上——0 是合法數值,range check 當然通過,但模型現在看到的「0 次聯絡紀錄」其實是「資料拿不到」,不是「真的沒聯絡過」。診斷這種問題不能只看 schema 驗證結果,要固定模型版本跟 payload,只換前處理版本重放同一批資料,比對兩邊算出來的特徵值跟缺值旗標,確認落差從哪一步開始出現。

### Label 有延遲:不成熟的 cohort 不能直接跟成熟的 cohort 比

大部分生產環境的 label 不是即時到位,而是事後才確定。如果一批預測裡只有 20% 已經有最終 label,直接拿這 20% 的準確率跟另一批已經 100% 成熟的 cohort 比,會把「標記得快的案例」跟「整體表現」混為一談——標記得快的案例可能剛好比較簡單、或是被模型自己的路由決策篩選過。正確做法是先依預測時間分組成 cohort,只在兩邊都到達可比的成熟度之後才下結論,未到位的 label 要當作「還不知道」處理,不能直接當負樣本填零。

### Mix Shift 會讓整體指標跟每個族群的真實表現脫鉤

就算每個族群自己的準確率都沒有變差,只要流量在族群之間重新分配,整體指標照樣會掉。例如族群 A 準確率一直維持 95%、族群 B 一直維持 75%,基準期是 800:200 的流量配比,整體準確率 91%;之後配比變成 200:800,整體準確率掉到 79%——兩個族群都沒有退化,純粹是比較難處理的族群占比變高了。這種情況該檢討的是容量規劃跟路由策略,而不是回頭去查某個族群是不是「壞掉」了。

### 先分清楚 Input Drift 跟 Concept Drift,再談要不要重新訓練

輸入分布變了(input drift)不代表輸入跟輸出之間的關係也變了(concept drift)——母體位移本身只是一個可以調查的線頭,不是結論。有 label 的時候,要照族群切開看模型表現,而不是只看一個全域分數;沒有 label 的時候,concept drift 永遠只能是假設,誠實講清楚這一點,比硬講出一個判斷更能說服面試官。把一個統計上顯著的 drift 檢定結果,直接自動觸發重新訓練,是這塊常見的過度反應。

```flow-diagram
{
  "title": "缺值率悄悄升高事件的診斷流程",
  "lang": "zh-TW",
  "width": 560,
  "height": 704,
  "nodes": [
    {"id": "signal", "label": "觀察到的訊號\n缺值率 1%→20%，但服務狀態與延遲正常", "x": 280, "y": 50, "w": 420},
    {"id": "breakdown", "label": "按 collector 版本／上線分組拆解缺值率\n保留請求數而不是只看比例", "x": 280, "y": 200, "w": 420},
    {"id": "replay", "label": "固定模型與 payload\n只換前處理版本重放同一批資料", "x": 280, "y": 350, "w": 420, "tone": "accent"},
    {"id": "confirm", "label": "確認落差來源\n複現特徵契約不一致", "x": 280, "y": 500, "w": 420},
    {"id": "respond", "label": "回復特徵契約，驗證新流量缺值率恢復\n等成熟 cohort 到位才評估 recall 與工作量", "x": 280, "y": 650, "w": 420}
  ],
  "edges": [
    {"from": "signal", "to": "breakdown", "step": 1, "label": "先拆解不要直接下結論"},
    {"from": "breakdown", "to": "replay", "step": 2, "label": "分組後鎖定可疑版本"},
    {"from": "replay", "to": "confirm", "step": 3, "label": "比對特徵值與缺值旗標"},
    {"from": "confirm", "to": "respond", "step": 4, "label": "複現後才決定回復或重訓"}
  ],
  "steps": [
    "缺值率上升但服務狀態與延遲正常，代表問題很可能不在服務健康層，而在資料品質層——這一步的任務是把「哪裡壞了」的範圍收斂，不是急著下結論。",
    "按 feature collector 版本與上線批次分組拆解缺值率，同時保留每組的請求數，確認缺值上升的時間點跟某次上線是否吻合。",
    "固定模型版本與輸入 payload 不動，只把前處理版本換成另一版重放同一批資料，比較兩邊算出來的特徵值跟缺值旗標——這比直接重跑一次大規模評估更能精準定位問題環節。",
    "複現特徵契約不一致後，先回復契約並在新流量上驗證缺值率確實恢復，再等待 label 成熟的 cohort 到位，評估 recall 跟審核量的變化；重新訓練只在確認資料可用、評估可重現之後才考慮。"
  ],
  "caption": "簡化示意：省略告警路由與事後報告流程，重點是「訊號分層」與「複現再決定」的順序。"
}
```

## 今日練習題

### 題目

你維護一個二元分類器,用來判斷客服工單是否需要轉給專家處理(正類＝需要轉專家)。模型本身(v4)沒有變動,但某次 feature collector 從 v12 升版到 v13 之後,服務回應狀態與延遲都維持正常,某個關鍵特徵「過去 7 天聯絡次數」的缺值率卻從 1% 跳到 20%。請說明你會怎麼診斷這個訊號,以及在什麼條件下你會決定回復設定、重新訓練,或是先不動。

**來源**：PracHub 練習題庫(作者標明為原創練習案例,非真實候選人回報的面試題)　**難度**：中等　**環節**：onsite ML system design 的監控深挖追問

### 拆解思路

1. **先釐清問題**：這題故意留白,值得主動問清楚——這個模型的決策成本是什麼(漏掉真正需要專家的工單,跟多轉一些工單給專家審核,哪個代價更高);現有的告警是只看缺值比例,還是有依版本／上線批次拆開;label(最終是否真的需要專家)多久後才會到位。
2. **建立框架**：先用四層監控框架把這個訊號定位——服務狀態與延遲正常代表服務健康層沒問題,缺值率上升明顯是資料品質層的訊號,模型結果層目前完全還沒有新證據,不能跳過中間直接談模型表現。
3. **深入核心**：鎖定 collector 升版這條時間線索,按版本與上線批次拆解缺值率分布;固定模型與 payload,只換前處理版本重放同一批資料,比對特徵值跟缺值旗標找出真正的落差來源;同時講清楚 label 延遲的處理方式——還沒成熟的 cohort 不能直接拿去跟完整成熟的 cohort 比,也不能把還沒到位的 label 當成負樣本。
4. **收尾**：把整題收斂成一句判斷準則——「這題考的不是你會不會列監控項目,是你有沒有想過一個綠燈不能證明另一件事也是對的,以及在複現問題之前不要急著重新訓練」,再補一句延伸:「如果缺值率上升的同時,流量在不同工單類型之間重新分配,我還要排除是不是 mix shift 造成整體指標掉,而不是真的有族群退化」。

### 範例回答(面試時可以這樣講)

> **先把訊號定位清楚**：服務回應狀態跟延遲都正常,這代表問題大概率不在服務健康層;但一個關鍵特徵的缺值率從 1% 跳到 20%,這是資料品質層的訊號,跟模型表現好不好是兩件事,我不會急著去談重新訓練。我會先按 feature collector 版本跟上線批次拆解缺值率分布,同時保留每組的請求數,確認時間點是不是跟某次升版對得上。
>
> **深入核心的部分我會做複現**：固定模型版本 v4 不動,也固定同一批輸入 payload,只把前處理版本從舊的換成新的重放一次,比對兩邊算出來的特徵值跟缺值旗標——如果新版的前處理在某個欄位名稱改了但舊程式碼讀不到、被預設值 0 補上,這一步就能直接看出來,而且不需要先等大量標記資料回來才能下結論。如果複現確認是 contract 不一致造成的,我會先回復特徵契約,並在新流量上驗證缺值率真的降回去。
>
> **收尾我會處理 label 延遲**：模型品質的判斷不能用還沒成熟的 cohort,我會按預測時間分組,只在兩邊 label 都到達可比的成熟度之後,才去看 specialist recall 跟審核量的變化,而且會額外檢查是不是流量在工單類型之間重新分配造成整體指標掉,但個別類型其實沒有退化——這種 mix shift 很容易被誤判成模型本身壞掉。重新訓練我會放到最後,只在確認資料已經修好、評估可以重現之後才考慮,而且要先想清楚回復期間要不要把這些工單多轉一些給人工審核當作安全網。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有用四層框架(服務健康／資料品質／母體位移／模型結果)先定位訊號屬於哪一層 | |
| 有提到複現方法——固定模型與 payload,只換前處理版本重放比對特徵值 | |
| 有講 label 延遲的處理——不成熟 cohort 不能直接跟成熟 cohort 比,未到位的 label 不當負樣本 | |
| 有區分 input drift 跟 concept drift,沒有 label 時誠實講 concept drift 只是假設 | |
| 加分：有排除 mix shift(流量在族群間重新分配)讓整體指標脫鉤的可能性 | |
| 有把重新訓練放在複現、回復、驗證之後,而不是看到 drift 分數就直接觸發 | |

## 延伸閱讀

- [Machine Learning Monitoring Interview Questions: Drift, Data Quality, and Production Failures — PracHub](https://prachub.com/resources/machine-learning-monitoring-interview-questions-drift-data-quality-and-production-failures) — 本篇練習題的完整虛構事件與延伸追問清單,含混淆矩陣數字跟 mix shift 的具體算例
- [TensorFlow Data Validation guide: schemas, skew, and drift](https://www.tensorflow.org/tfx/guide/tfdv) — 把 schema 驗證、training-serving skew 偵測、跨時間資料集的 drift 偵測分成三種不同比較的官方說明

## 參考資料

- [Machine Learning Monitoring Interview Questions: Drift, Data Quality, and Production Failures — PracHub](https://prachub.com/resources/machine-learning-monitoring-interview-questions-drift-data-quality-and-production-failures) — 本篇 ML System Design 監控段落「核心概念」與「練習題」取材的虛構事件來源,作者明確標註為原創練習案例而非真實面試回報
- [Rules of Machine Learning — Google for Developers](https://developers.google.com/machine-learning/guides/rules-of-ml) — 對應「Training-Serving Skew」一節的官方定義與排查建議來源
- [TensorFlow Data Validation guide](https://www.tensorflow.org/tfx/guide/tfdv) — 對應「四層監控框架」裡 schema 驗證與 drift 偵測屬於不同比較的技術文件
- [scikit-learn: Classification metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics) — 對應練習題事件裡混淆矩陣與 precision/recall 計算的定義來源

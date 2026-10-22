---
title: "Cloudflare 模型家族：Clef 決策模型與 Clairic 抽取模型怎麼選"
date: 2026-10-22
category: tech
type: deep-dive
tags: [cloudflare, clef, clairic, decision-model, extraction-model, model-family-clef, model-selection]
lang: zh-TW
tldr: "Cloudflare 自研模型分兩條線：Clef 家族輸出選項機率（clef 27B、clef-flash 9B、clef-omni 30B-A3B），Clairic 輸出型別化值與區間。四者只計 input token（$0.038–$0.24/1M）、不計 output；Clef 三個以 Apache-2.0 開源可自架，Clairic 仍是託管預覽。決策類基準贏 Jev，深推理類輸 Jev。"
description: "Cloudflare 自研模型選型：Clef、Clef-flash、Clef-omni 與 Clairic 的版本矩陣、定價、自架方式、官方自報評測的限制，以及接進 agent 的方式。"
draft: false
series:
  name: "AI 模型家族"
  order: 32
glossary:
  - term: "System One 模型"
    def: "源自 TypeSafe AI 對 Jev 的描述、取自 Kahneman《快思慢想》系統一概念的模型類別：單次前向、不生成文字，輸出機率或型別化值。"
  - term: "決策模型（decision model）"
    def: "吃一個 state 與一組型別化問題，回傳每個合法選項的機率分佈；Clef 家族屬此類。"
  - term: "抽取模型（extraction model）"
    def: "吃一個 state 與一組欄位定義，回傳值、原文 span 與不確定性區間；Clairic 屬此類。"
---

> 🌏 [English version](/posts/tech/2026-10-22-ai-model-family-cloudflare-en)

Cloudflare 的第一批自研模型分成兩類：**Clef 家族**（clef、clef-flash、clef-omni）輸出每個選項的機率，**Clairic** 輸出型別化的值與區間。四者都託管在 Workers AI、只對 input token 計費，但模態、context 與開源狀態各不相同。如果你要在 agent 裡放一層分類、路由或抽值，這篇給的是選型與驗證方式。價格與版本以 2026-10-22 查核的官方文件為準。

## 家族定位與版本矩陣

Cloudflare 官方稱這些是「Cloudflare-trained models」，指的是 Workers AI 團隊自己後訓練的模型；平台上另外數十個第三方模型不在本篇範圍。

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| `@cf/cloudflare/clef` | 27B 決策模型，精度優先 | 65,536 context；文字、JSON、圖片、影片影格；$0.24/1M input | Workers AI 託管；Apache-2.0 權重 |
| `@cf/cloudflare/clef-flash` | 9B 決策模型，延遲與成本優先 | 託管 context 只有 24,576；$0.038/1M input；自架權重訓練到 256K | 同上 |
| `@cf/cloudflare/clef-omni` | 30B-A3B MoE 決策模型，多模態 | 多了原生音訊與影片；64,000 context；$0.15/1M input | 同上 |
| `@cf/cloudflare/clairic` | 抽取模型（preview） | 回傳值、span 與不確定性區間；65,536 context；$0.10/1M input | 僅 Workers AI 託管，權重尚未開源 |

有兩個容易混淆的地方。第一，Clef 家族的 API 沿用 Jev／System One 的 `state`＋`questions` 格式，Clairic 是 `state`＋`fields`，兩者不是同一套 schema。第二，context 與價格是查核日快照，這個家族八天內就改過一次定價。

### 先分兩類，再挑大小

- 要「從你列的選項裡挑一個」（分類、路由、審核）：用 Clef 家族。延遲優先選 clef-flash，精度或長 context 優先選 clef，要處理音訊與影片選 clef-omni。
- 要「把輸入變成值」（發票欄位、日期、估價、時序預測）：用 Clairic。
- 兩者可以串起來：官方示範的 pipeline 是 Clairic 抽值 → Clef 決策 → LLM 寫回覆，見〈Agent 使用與選型〉。

## 家族演化

| 日期 | 事件 | 對選型的意義 |
|---|---|---|
| 2026-10-01 | Clef 與 Clef-flash 上線：Apache-2.0 開源、Workers AI 託管、API 與 Jev 相容；同日宣布 RL 微調服務 | 決策模型出現可自架的選項，換掉 Jev 的成本很低 |
| 2026-10-09 | Clef-omni 加入，多了音訊與影片；clef-flash 降價、託管 context 縮小；Clef 的託管服務改跑 SGLang | 便宜的更便宜，但長輸入要改用 clef 或自架 |
| 2026-10-19 | Clairic 預覽：新的抽取模型類別，只開託管端點 | 多了一層「抽值」可用，但還不能自架 |

官方對 Clef 的開發節奏說法是「週五晚上決定要做決策模型、週末訓練、週四上線」，八天後就多了一個 omni 版本。這條產品線還在快速變動：八天之內，clef-flash 的價格與 context 各改過一次。好消息是 API 相容，換模型只是換一個 model ID；先押便宜的組合，數字穩定後再調。

## 架構與訓練取捨

### 共同設計：一次前向、只輸出機率

Clef 家族不是自回歸 LLM。官方公開的做法是把 Qwen 骨幹凍結，訓練 LoRA 與一個 joint schema head；推論時只做一次 prefill，然後對所有合法選項平行打分。沒有逐字生成，也沒有輸出解析這一步。

- 骨幹：
  - clef：Qwen3.8-27B。
  - clef-flash：Qwen3.5-9B。
  - clef-omni：Qwen3-Omni-30B-A3B 的理解骨幹。文字轉語音的部分丟掉，但 Hugging Face 倉庫裡仍含這批未使用的權重。
- 訓練目標：label-smoothed cross-entropy 加 Brier calibration。另外用 RLCD（Reinforcement Learning for Calibrated Decisions）當次要目標，對相鄰的順序選項給部分分數。
- 目的：讓機率誠實。標 0.9 的決策，大致要對應九成的正確率。

代價有三個。

- 輸出被鎖在你給的 schema 裡，模型不會回你沒列的答案。
- 拿到的是機率，沒有文字解釋為什麼。
- 深度推理不是它的工作。Decision Index 的推理列（見下節）落後 Jev 一大截。

### 多模態輸入與計價方式

- clef 與 clef-flash：文字、JSON、圖片（最多 4 張），以及影片影格陣列。
- clef-omni：多了原生音訊（wav／mp3，最多 4 段）與影片（mp4／webm，最多 2 支，2 fps 取樣）。影片的聲音會跟畫面一起進模型。

媒體會轉成 input token 計價。

- 圖片按 (寬/32)×(高/32) 算，每張上限 1,024 tokens。
- 音訊約 780 tokens/分鐘。
- 影片最高約 15,400 tokens/分鐘，有聲音再加約 780/分鐘。

媒體 token 佔 context：擠不下時被截斷的是 `state` 文字；媒體本身超限則整個請求失敗。

### Clairic：回歸問題，但要你的 schema 有界

Clairic 不用選項，改用欄位型別：`text`（回傳原文 span 與字元位移）、`number`／`date`／`time`／`datetime`／`duration`、`list`，以及 `estimate` 與 `forecast`。

- `estimate` 回傳分布：你給 `min`、`max` 與 `step`，它回 median 與 80% 區間（p10–p90）。
- `forecast` 對時序的每一步回一個值與區間，horizon 最多 64 步。
- 每個答案附 `confidence` 與 `p_null`（值不在輸入裡的機率），找不到就回 `null`。
- 欄位數無上限；一次放不進 8,192-token 的欄位會拆成平行多輪，各自看完整輸入再合併。官方用「問 30 個欄位跟問 3 個差不多成本」描述這個行為。
- 官方自承限制：讀取與一到兩步的計算是可靠的，長串相依計算與跨表格聚合還不行。建議讓 Clairic 出值、計算留給程式。

## 評測與競品比較

以下三組都是 Cloudflare 自己跑的數字，沒有第三方覆現。三組的 harness 與資料不同，不要跨表加總。

### Cloudflare 自測的 Decision Index 0.2.1

| Benchmark（越高越好） | clef | clef-flash | clef-omni | Jev |
|---|---|---|---|---|
| BFCL（case exact） | 98.5 | 98.8 | 98.2 | 95.8 |
| API-Bank（accuracy） | 91.9 | 93.1 | 92.7 | 88.2 |
| BANKING77（macro-F1） | 94.2 | 90.9 | 94.8 | 79.7 |
| CLINC150+OOS（macro-F1） | 97.4 | 66.8 | 97.7 | 89.3 |
| When2Call（accuracy） | 72.4 | 65.6 | 63.3 | 81.0 |
| Amazon ESCI（macro-F1） | 57.5 | 57.4 | 57.8 | 55.2 |

Jev 那一欄是 Cloudflare 的跑法，不是 TypeSafe 自報。

| 延遲（同一次自測） | clef | clef-flash | Jev |
|---|---|---|---|
| median | 209.3 ms | 38.8 ms | 524.1 ms |
| p95 | 238.6 ms | 122.4 ms | 536.0 ms |

需要推理的列風向完全相反：

| 推理類 Benchmark | clef | clef-flash | Jev |
|---|---|---|---|
| GPQA Diamond | 48.0 | 51.0 | 78.3 |
| BBH | 73.7 | 68.9 | 92.9 |
| MMLU-Pro | 65.9 | 65.3 | 82.7 |

Clef 家族買到的是分類與工具選擇的速度與校正，不是推理。家族內部的落差也值得記：CLINC150+OOS 是 clef 97.4 對 clef-flash 66.8，說明 flash 的便宜也反映在部分任務的精度上。

### Workflow evals（Typesafe Evals）

| Workflow（exact actions，除註明） | clef | clef-flash | clef-omni | Jev |
|---|---|---|---|---|
| Invoice processing | 64.7 | 57.1 | 60.2 | 61.8 |
| Customer service | 76.3 | 77.0 | 71.6 | 76.0 |
| Security incidents | 62.9 | 61.7 | 61.7 | 61.7 |
| Agent trace observability（primary action） | 68.5 | 69.8 | 65.8 | 71.6 |

這組是 Cloudflare 拿 TypeSafe 公開的 eval 跑的，不是 TypeSafe 對 Clef 的結果。Jev 在 agent trace observability 這列仍然最高。

### Clairic（preview，兩組官方自測）

- TSA 機場安檢人數：連續 21 天每天早上預測隔天，平均誤差 3.3%。
- 其中 17 天落在它的 80% 區間內；落空的日子集中在哥倫布日週末，模型看不到連假。
- 三層 pipeline 對比全部用 GLM-5.3：端到端 19.3 秒對 61.7 秒。
- 每百萬件成本 $6,032 對 $11,740。官方說全 LLM 版本的事實與決策也對，差別在 Clairic 的估價每次一致、GLM 的估價每次不同。

兩組都是單一實驗、官方自報；Clairic 權重還沒公開，外界無法覆現。

### 第三方數字

截至查核日，沒有找到獨立重建的 Decision Index。少數非官方數字是社群掛在 Hugging Face 模型頁上的評測：clef-flash 在 typed-decisions 上的 accuracy 是 0.71、Brier 是 0.11。方法與覆蓋範圍和官方不同，只能當方向。

## 授權、價格與部署

### 權重、託管與條款要分開看

- **Clef、Clef-flash、Clef-omni**：Apache-2.0 權重，Hugging Face 上是標準 safetensors 加載入程式碼。自架可用 SGLang；0.5.22 起內建 Clef 支援，官方也提供 H200／B200／B300 的 cookbook。
- **官方測試環境**：torch 2.11、transformers 5.10.2、單張 H200。
- **Clairic**：只有託管預覽，沒有權重。文件條款寫得直白：AS IS、不保證持續可用、Cloudflare 可隨時停止且不需退款或補償。
- **託管端點**：Workers AI，`env.AI.run()` 或 REST。後端以 Neurons 計費，每天有 10,000 Neurons 的免費額度；定價頁換算成各模型的每百萬 input token 單價。

### 價格（查核日 2026-10-22）

| 模型 | 單價（USD／1M input tokens） | Output | 備註 |
|---|---|---|---|
| clef | $0.24 | 不計費 | 65,536 context |
| clef-flash | $0.038 | 不計費 | 2026-10-09 從 $0.09 調降；託管 context 24,576 |
| clef-omni | $0.15 | 不計費 | 音訊／影片按轉換後 tokens 計價 |
| clairic | $0.10 | 不計費 | 回應裡 `output_tokens` 為 0 |

四個模型都不生成輸出文字，所以沒有 output 計費；帳單變數在輸入的媒體與長度上。價格八天內動過一次，用之前回定價頁確認。

### 自架的兩個坑

- context：官方載入程式碼的 `max_length` 預設是 16,384 tokens，不是託管頁上的 64k／24k。要吃滿得自己調；clef-flash 的 256k 也只有自架才有。
- 硬體：官方只在單張 H200 這類等級上做過測試與 cookbook，把 27B 或 30B-A3B 搬回自己機房不是抓下來就能跑。

### 資料政策與微調

官方承諾標準 Workers AI 的請求與回應不讀取、不儲存、不用於訓練，除非你加入微調服務。微調目前是 FDE 帶隊的手把手服務，自助版沒有日期。官方描述的流程是：AI Gateway 收資料、Workers AI 產生 rollouts、Containers 當評分沙箱、Trainer 更新權重，最後用 BYO Model 部署回 Workers AI。

## Agent 使用與選型

### 三層分工

官方示範的形狀是：抽取模型把非結構化輸入變成值、決策模型選動作、LLM 負責文字。以客服理賠為例，Clairic 抽訂單編號、金額與損壞描述，Clef 依政策選「退款」或「維修」，GLM-5.3 只拿到決策與需要的數字來寫回覆。

這樣切有兩個理由。每一步的輸入比上一步乾淨；LLM 看不到原始信件，能少碰一點 prompt injection 的表面。但不要把它當成資安方案。本站整理過的 HiddenLayer 實測顯示，決策模型被注入操弄一樣會選錯動作。底層還是同一顆語言模型在讀未受信任的內容（[Jev 的實測整理](/posts/daily/2026-10-16-security-jev-decision-model-prompt-injection)）。

### 該用哪個

| 情境 | 先用 | 注意 |
|---|---|---|
| 文字分類／路由，要低延遲 | clef-flash | 24k context；部分分類任務精度明顯低於 clef |
| 需要最高精度或長 context | clef | 價格是 flash 的六倍以上 |
| 音訊或影片要下判斷 | clef-omni | 影片 2 fps、60 秒上限；媒體按 token 計價 |
| 非結構化輸入要變成值 | clairic | preview；長串計算與校準限制見〈評測與競品比較〉 |
| 需要推理或解釋 | 都不用 | GPQA／BBH 落後；這是 LLM 的工作 |

### 把機率接到門檻上

決策模型輸出機率，是為了讓你寫規則：`confidence` 低於門檻、或 `p_null` 超過設定值，就轉人工。本站寫過的 [decisionkit](/posts/daily/2026-10-12-tool-decisionkit) 是這個模式的 CLI 範例（它目前接 Decisions API 與 Jev）；Clef 家族 API 與 Jev 相容，同一套門檻設計可以直接搬過來。模型只管打分，哪一種決策可以自動放行是你要定的政策。

### 上線前的最小驗證

從自己的 log 抽 100 到 200 個已經有人工答案的樣本，選項照你的 schema 排。

除了比對 top-1 命中率，把 `confidence` 分桶，看標 0.9 的那一桶實際正確率是多少。校準是官方主打，但只保證在他們受測的資料上。

再量一次延遲。官方兩個頁面給的數字不同（見下節），你自己的 region 與併發量才是 p95 的來源。

### 請求長什麼樣

以下是官方文件裡 Clef 家族的請求格式，本文沒有實際部署這個請求：

```json
{
  "model": "clef-flash",
  "state": "客戶來信：……",
  "questions": {
    "team": {
      "type": "choice",
      "instructions": "這封信該派給哪個團隊？",
      "criteria": { "billing": "帳務與退款", "technical": "故障與設定" }
    },
    "urgent": { "type": "noul", "instructions": "是否需要今天處理？" }
  }
}
```

回應按 question id 分組：`choice` 型回選出的選項、`confidence` 與每個選項的機率；`noul` 型回機率；`score` 型回期望分數與圖例。每個請求最多 64 個問題。

## 限制與取捨

- **評測全是官方自報。** Decision Index 是 Cloudflare 自己的 harness，Jev 的分數也是他們測的；截至查核日沒有獨立覆現。上線前在自己的資料上驗一次。
- **官方延遲數字互相矛盾。** 同一場發布，部落格寫 clef-omni 純文字約 130 ms、21 秒影片約 1.5 秒；官方 changelog 卻寫約 20 ms、影片約 300 ms。兩邊差四到六倍，也都沒公開量測條件。預算抓慢的數字，或自己量。
- **能力邊界明確。** 深推理題目落後 Jev 兩位數百分點；clef-flash 在部分分類題遠低於 clef。Clairic 的長串計算、跨列聚合與長程預測，官方都說還不行；校準只保證在受測集上大致成立。
- **Clairic 是預覽。** 權重沒開、條款 AS IS、隨時可能變。要放進關鍵流程，先準備 fallback。
- **產品線變動快。** 八天內降價與砍 context 各一次。對成本是好事，對半年規劃是壞事；價格與 context 以官方頁面為準。
- **未公開的資訊。** Clairic 的參數量、架構與訓練資料沒揭露；Clef 家族的訓練資料只說是自己產的合成資料、做了排列組合，token 預算與資料規模沒公開。這些空位影響成本估算與風險判斷。

## 參考資料

- [Cloudflare Blog：Introducing Clef（2026-10-01）](https://blog.cloudflare.com/clef-decision-models)
- [Cloudflare Changelog：Clef 與 Clef-flash 上線 Workers AI（2026-10-01）](https://developers.cloudflare.com/changelog/post/2026-10-01-clef-workers-ai/)
- [Cloudflare Blog：Clef-omni、更快的 Clef 與更便宜的 Clef-flash（2026-10-09）](https://blog.cloudflare.com/clef-faster-cheaper-multimodal/)
- [Cloudflare Changelog：Clef-omni 加入（2026-10-09）](https://developers.cloudflare.com/changelog/post/2026-10-09-clef-omni-workers-ai/)
- [Cloudflare Blog：Introducing Clairic（2026-10-19）](https://blog.cloudflare.com/clairic-extraction-model/)
- [Workers AI 文件：clef 模型頁](https://developers.cloudflare.com/workers-ai/models/clef/)
- [Workers AI 文件：clef-flash 模型頁](https://developers.cloudflare.com/workers-ai/models/clef-flash/)
- [Workers AI 文件：clef-omni 模型頁](https://developers.cloudflare.com/workers-ai/models/clef-omni/)
- [Workers AI 文件：clairic 模型頁](https://developers.cloudflare.com/workers-ai/models/clairic/)
- [Workers AI 文件：Extraction models 概念頁](https://developers.cloudflare.com/workers-ai/concepts/extraction-models/)
- [Workers AI 定價頁](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Hugging Face：Cloudflare/clef](https://huggingface.co/Cloudflare/clef)
- [Hugging Face：Cloudflare/clef-flash](https://huggingface.co/Cloudflare/clef-flash)
- [Hugging Face：Cloudflare/clef-omni](https://huggingface.co/Cloudflare/clef-omni)
- [Clef Decision Index 展示站](https://clef-evals.workers-ai-mle.workers.dev/)
- [Typesafe Evals](https://evals.typesafe.ai/)
- [本站模型卡：Jev（TypeSafe AI）](/posts/daily/2026-09-19-model-typesafe-ai-jev)
- [本站模型卡：Clef（Cloudflare）](/posts/daily/2026-10-03-model-cloudflare-clef)

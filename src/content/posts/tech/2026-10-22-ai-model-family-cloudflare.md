---
title: "Cloudflare 模型家族：Clef 決策模型與 Clairic 抽取模型怎麼選"
date: 2026-10-22
category: tech
type: deep-dive
tags: [cloudflare, clef, clairic, clairic-flash, decision-model, extraction-model, model-family-clef, model-selection]
lang: zh-TW
tldr: "Cloudflare 自研模型分兩條線：Clef 家族輸出選項機率（clef 27B、clef-flash 9B、clef-omni 30B-A3B），Clairic 家族輸出型別化值與區間（clairic 27B、clairic-flash 9B）。五者只計 input token（$0.038–$0.24/1M），全部以 Apache-2.0 開放權重可自架。Clairic 在 2026-11-18 改架構並拆成兩個尺寸，27B 在 12-01 前以 $0.10 優惠。決策類基準贏 Jev，深推理類輸 Jev。"
description: "Cloudflare 自研模型選型：Clef、Clef-flash、Clef-omni、Clairic 與 Clairic-flash 的版本矩陣、定價、自架方式、官方自報評測的限制，以及接進 agent 的方式。"
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

> :globe: [English version](/posts/tech/2026-10-22-ai-model-family-cloudflare-en)

Cloudflare 的第一批自研模型分成兩類：**Clef 家族**（clef、clef-flash、clef-omni）輸出每個選項的機率，**Clairic 家族**（clairic、clairic-flash）輸出型別化的值與區間。五者都託管在 Workers AI、只對 input token 計費，權重也都以 Apache-2.0 放在 Hugging Face，但模態、context 與價格各不相同。如果你要在 agent 裡放一層分類、路由或抽值，這篇給的是選型與驗證方式。價格與版本以 2026-11-23 的官方文件為準。

## 家族定位與版本矩陣

Cloudflare 官方稱這些是「Cloudflare-trained models」，指的是 Workers AI 團隊自己後訓練的模型；這個團隊在 2026-11-18 改名為 Workers AI superintelligence team。平台上另外數十個第三方模型不在本篇範圍。

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| `@cf/cloudflare/clef` | 27B 決策模型，精度優先 | 65,536 context；文字、JSON、圖片、影片影格；$0.24/1M input | Workers AI 託管；Apache-2.0 權重 |
| `@cf/cloudflare/clef-flash` | 9B 決策模型，延遲與成本優先 | 託管 context 只有 24,576；$0.038/1M input；自架權重訓練到 256K | 同上 |
| `@cf/cloudflare/clef-omni` | 30B-A3B MoE 決策模型，多模態 | 多了原生音訊與影片；64,000 context；$0.15/1M input | 同上 |
| `@cf/cloudflare/clairic` | 27B 抽取模型，精度優先 | 回傳值、span 與不確定性區間；文字、圖片、PDF；65,536 context；$0.24/1M input（2026-12-01 前 $0.10） | Workers AI 託管（標示 preview）；Apache-2.0 權重 |
| `@cf/cloudflare/clairic-flash` | 9B 抽取模型，延遲與成本優先 | 同一套 API 與輸入；65,536 context；$0.10/1M input | Workers AI 託管（標示 early research preview）；Apache-2.0 權重 |

有三個容易混淆的地方。第一，Clef 家族的 API 沿用 Jev／System One 的 `state`＋`questions` 格式，Clairic 是 `state`＋`fields`，兩者不是同一套 schema。第二，2026-10-19 預覽時 `@cf/cloudflare/clairic` 背後是 9B；11-18 起同一個端點原地換成 27B 新版，9B 搬到 `clairic-flash`。第三，context 與價格是 2026-11-23 的快照，Clef 與 Clairic 都上線不到兩個月就各改過一次定價。

### 先分兩類，再挑大小

- 要「從你列的選項裡挑一個」（分類、路由、審核）：用 Clef 家族。延遲優先選 clef-flash，精度或長 context 優先選 clef，要處理音訊與影片選 clef-omni。
- 要「把輸入變成值」（發票欄位、日期、估價、時序預測）：用 Clairic 家族。精度優先選 clairic，延遲與成本優先選 clairic-flash。
- 兩者可以串起來：官方示範的 pipeline 是 Clairic 抽值 → Clef 決策 → LLM 寫回覆，見〈Agent 使用與選型〉。

## 家族演化

| 日期 | 事件 | 對選型的意義 |
|---|---|---|
| 2026-10-01 | Clef 與 Clef-flash 上線：Apache-2.0 開源、Workers AI 託管、API 與 Jev 相容；同日宣布 RL 微調服務 | 決策模型出現可自架的選項，換掉 Jev 的成本很低 |
| 2026-10-09 | Clef-omni 加入，多了音訊與影片；clef-flash 降價、託管 context 縮小；Clef 的託管服務改跑 SGLang | 便宜的更便宜，但長輸入要改用 clef 或自架 |
| 2026-10-19 | Clairic 預覽：新的抽取模型類別，託管端點背後是 9B、單次前向，$0.10/1M input。官方自測：TSA 安檢人數 21 天預測平均誤差 3.3%；三層 pipeline 對比全用 GLM-5.3 是 19.3 秒對 61.7 秒 | 多了一層「抽值」可用，但還不能自架 |
| 2026-11-18 | Clairic 改架構（欄位改用平行自回歸生成）、支援 PDF；拆成 27B `clairic` 與 9B `clairic-flash`，兩者開放 Apache-2.0 權重；27B 定價 $0.24，12-01 前優惠 $0.10 | 抽取模型也能自架；預覽版的單次前向架構與評測降為歷史，本篇其餘各節以新版為準 |

官方對 Clef 的開發節奏說法是「週五晚上決定要做決策模型、週末訓練、週四上線」，八天後就多了一個 omni 版本。這條產品線還在快速變動：八天之內，clef-flash 的價格與 context 各改過一次；一個月內，Clairic 從託管預覽改成新架構、開權重並拆成兩個尺寸。好消息是兩條線各自的 API 沒有變，換模型只是換一個 model ID；先押便宜的組合，數字穩定後再調。

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

### Clairic：型別化欄位，新版改成平行自回歸

Clairic 不用選項，改用欄位型別：`text`（回傳原文 span 與字元位移）、`number`／`date`／`time`／`datetime`／`duration`、`boolean`、`enum`、`object`、`list`、`compute`，以及 `estimate` 與 `forecast`。

- 骨幹：clairic 是 Qwen3.8-27B，clairic-flash 是 Qwen3.5-9B。
- 新版（2026-11-18）不再是單次前向。一般的文字與數字欄位改用官方所說的 parallel slot autoregressive generation：每個欄位根據自己已寫出的 token 決定下一個，寫到自己的結束標記就停，所有欄位在同一個 serving batch 裡一起推進。估計、預測、期間、推算日期與明確的算術則交給另外訓練的專用 head。官方說這換到了文字與圖片抽取的精度，代價是少量延遲。
- `estimate` 回傳分布：你給 `min`、`max` 與 `step`，它回 median 與 80% 區間（p10–p90）；`forecast` 對時序的每一步回一個值與區間。
- 每個答案附 `confidence` 與 `p_null`（值不在輸入裡的機率），找不到就回 `null`；文字答案附原文 span。
- 輸入可以是文字、最多 4 張圖片，或 PDF；圖片與 PDF 頁合計最多 4 頁，單檔 4 MiB、合計 8 MiB。
- 計價與 pass：每個 `text` 欄位各跑一個 pass，其他欄位共用 pass，放不下再拆。每個 pass 都帶完整的 `state` 與圖片，所以這些 token 每個 pass 計費一次，`usage.passes` 會告訴你跑了幾次。欄位數沒有上限，但文字欄位越多，帳單越接近「輸入長度 × 文字欄位數」。
- 預覽版時官方自承讀取與一到兩步計算可靠、長串相依計算與跨表格聚合還不行。新版加了算術專用 head，但這類任務仍建議讓 Clairic 出值、計算留給程式驗算。

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

### Clairic（2026-11-18 新版，官方自測）

官方說目前沒有公開的抽取基準，下表是 Cloudflare 的內部評測，拿市面上另外兩個抽取模型當對照（Liquid AI D1.2 搭配 Apple Vision OCR、Scaledown Extract）。數字是答對欄位數／總欄位數：

| 評測集 | Clairic 預覽版 | clairic | clairic-flash | D1.2＋OCR | Scaledown |
|---|---|---|---|---|---|
| Fresh text fields（96 requests） | 295/336 | 335/336 | 328/336 | 304/336 | 259/336 |
| Mixed-input fields（36 requests） | 207/226 | 221/226 | 213/226 | 116/226 | 156/226 |
| 客戶追蹤斷言（139 種請求形狀） | 1,033/1,263 | 1,263/1,263 | 1,263/1,263 | 973/1,263 | 653/1,263 |
| 文字與圖片中的合成收據欄位 | 369/576 | 576/576 | 576/576 | 397/576 | 280/576 |

延遲是在自架伺服器上量完整 HTTP 回應、含請求裡所有欄位：

| 評測集 | clairic p50／p95 | clairic-flash p50／p95 |
|---|---|---|
| Fresh text fields | 358／736 ms | 155／328 ms |
| Fresh image fields | 453／976 ms | 305／605 ms |
| Commercial leases | 691／803 ms | 379／519 ms |
| Loan pricing | 395／407 ms | 188／192 ms |
| Traffic forecasting | 532／585 ms | 243／261 ms |
| Expense audit | 632／742 ms | 393／512 ms |

兩張表都是官方自報、官方也說只能當方向；預覽版的 TSA 預測與三層 pipeline 實驗跑的是舊的 9B 單次前向版本，見〈家族演化〉。flash 在兩組評測裡追平 27B，延遲約是一半，是先試的合理起點。

### 第三方數字

目前沒有獨立重建的 Decision Index，Clairic 也沒有第三方評測。少數非官方數字是社群掛在 Hugging Face 模型頁上的評測：clef-flash 在 typed-decisions 上的 accuracy 是 0.71、Brier 是 0.11。方法與覆蓋範圍和官方不同，只能當方向。

## 授權、價格與部署

### 權重、託管與條款要分開看

- **Clef、Clef-flash、Clef-omni**：Apache-2.0 權重，Hugging Face 上是標準 safetensors 加載入程式碼。自架可用 SGLang；0.5.22 起內建 Clef 支援，官方也提供 H200／B200／B300 的 cookbook。
- **官方測試環境**：torch 2.11、transformers 5.10.2、單張 H200。
- **Clairic、Clairic-flash**：2026-11-18 起 Apache-2.0 權重放在 Hugging Face，附自訂的 Transformers 載入程式碼與 `systemone` 請求 helper，需要 Python 3.11 以上，schema 約束用 `xgrammar`。模型卡沒有列硬體需求。
- **託管條款**：Clairic 兩個端點的 Workers AI 頁面仍標示 preview，並附一段條款，寫得直白：AS IS、不保證持續可用、Cloudflare 可隨時停止且不需退款或補償。開放權重之後，自架就不受這段託管條款影響，但要自己承擔維運。
- **託管端點**：Workers AI，`env.AI.run()` 或 REST。後端以 Neurons 計費，每天有 10,000 Neurons 的免費額度；定價頁換算成各模型的每百萬 input token 單價。

### 價格（2026-11-23）

| 模型 | 單價（USD／1M input tokens） | Output | 備註 |
|---|---|---|---|
| clef | $0.24 | 不計費 | 65,536 context |
| clef-flash | $0.038 | 不計費 | 2026-10-09 從 $0.09 調降；託管 context 24,576 |
| clef-omni | $0.15 | 不計費 | 音訊／影片按轉換後 tokens 計價 |
| clairic | $0.24（2026-12-01 前 $0.10） | 不計費 | 回應裡 `output_tokens` 為 0；每個 pass 各自計 input |
| clairic-flash | $0.10 | 不計費 | 同上 |

Clef 家族不生成輸出文字；新版 Clairic 其實會生成 token，但官方決定沿用只收 input 的原則、自己吸收 output 成本。帳單變數在輸入的媒體、長度與 Clairic 的 pass 數上。兩條線上線後都改過定價，用之前回定價頁確認；2026-12-01 優惠結束後，還沒改用 clairic-flash 的工作負載單價會變成 2.4 倍。

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
| 非結構化輸入要變成值，先求便宜快 | clairic-flash | 官方自測兩組評測追平 27B；延遲約一半 |
| 抽值精度優先、文件複雜 | clairic | 12-01 後是 flash 的 2.4 倍價；長串計算仍交給程式 |
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

- **評測全是官方自報。** Decision Index 是 Cloudflare 自己的 harness，Jev 的分數也是他們測的；目前沒有獨立覆現。上線前在自己的資料上驗一次。
- **官方延遲數字互相矛盾。** 同一場發布，部落格寫 clef-omni 純文字約 130 ms、21 秒影片約 1.5 秒；官方 changelog 卻寫約 20 ms、影片約 300 ms。兩邊差四到六倍，也都沒公開量測條件。預算抓慢的數字，或自己量。
- **能力邊界明確。** 深推理題目落後 Jev 兩位數百分點；clef-flash 在部分分類題遠低於 clef。Clairic 預覽版時官方說長串計算、跨列聚合與長程預測還不行，新版沒有公布這幾類的評測；校準只保證在受測集上大致成立。
- **Clairic 的託管端點仍是預覽。** 權重已開放，但託管頁標示 preview、條款 AS IS，一個月內架構與端點背後的模型都換過一次。要放進關鍵流程，先準備 fallback，或改成自架。
- **Clairic 的計費與長輸入規則要自己算。** 每個文字欄位各跑一次 pass、每次都計完整輸入；同一份文件頁一處寫超出 context 時截斷 `state`，另一處寫輸入不截斷、直接拒絕。送大文件前自己控制長度，並看 `usage.passes`。
- **產品線變動快。** clef-flash 八天內降價與砍 context 各一次；Clairic 一個月內換架構、拆尺寸、改定價。對成本是好事，對半年規劃是壞事；價格與 context 以官方頁面為準。
- **未公開的資訊。** Clairic 已公開尺寸、骨幹與架構方向，但訓練資料與訓練方式沒有揭露；Clef 家族的訓練資料只說是自己產的合成資料、做了排列組合，token 預算與資料規模沒公開。這些空位影響成本估算與風險判斷。

## 更新紀錄

- 2026-11-23：補上 2026-11-18 的 Clairic 改版：架構從單次前向改為平行自回歸生成、支援 PDF，拆成 27B `clairic` 與 9B `clairic-flash`，兩者開放 Apache-2.0 權重，27B 定價改為 $0.24（12-01 前優惠 $0.10）。修正已不成立的敘述：tldr 與矩陣的「Clairic 仍是託管預覽、權重尚未開源」、Clairic 欄位拆分與「欄位多寡成本差不多」的計價說法（新文件改成每個文字欄位一個 pass、每個 pass 計費）。預覽版 Clairic 降為歷史世代，TSA 與三層 pipeline 實驗移到〈家族演化〉；評測改用新版官方自測表。Clef 家族的規格與價格未變。

## 參考資料

- [Cloudflare Blog：Introducing Clef（2026-10-01）](https://blog.cloudflare.com/clef-decision-models)
- [Cloudflare Changelog：Clef 與 Clef-flash 上線 Workers AI（2026-10-01）](https://developers.cloudflare.com/changelog/post/2026-10-01-clef-workers-ai/)
- [Cloudflare Blog：Clef-omni、更快的 Clef 與更便宜的 Clef-flash（2026-10-09）](https://blog.cloudflare.com/clef-faster-cheaper-multimodal/)
- [Cloudflare Changelog：Clef-omni 加入（2026-10-09）](https://developers.cloudflare.com/changelog/post/2026-10-09-clef-omni-workers-ai/)
- [Cloudflare Blog：Introducing Clairic（2026-10-19）](https://blog.cloudflare.com/clairic-extraction-model/)
- [Workers AI 文件：clef 模型頁](https://developers.cloudflare.com/workers-ai/models/clef/)
- [Workers AI 文件：clef-flash 模型頁](https://developers.cloudflare.com/workers-ai/models/clef-flash/)
- [Workers AI 文件：clef-omni 模型頁](https://developers.cloudflare.com/workers-ai/models/clef-omni/)
- [Cloudflare Blog：Clairic 與 Clairic-flash 開放權重（2026-11-18）](https://blog.cloudflare.com/open-clairic)
- [Workers AI 文件：clairic 模型頁](https://developers.cloudflare.com/workers-ai/models/clairic/)
- [Workers AI 文件：clairic-flash 模型頁](https://developers.cloudflare.com/workers-ai/models/clairic-flash/)
- [Workers AI 文件：Extraction models 概念頁](https://developers.cloudflare.com/workers-ai/concepts/extraction-models/)
- [Workers AI 定價頁](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Hugging Face：Cloudflare/clef](https://huggingface.co/Cloudflare/clef)
- [Hugging Face：Cloudflare/clef-flash](https://huggingface.co/Cloudflare/clef-flash)
- [Hugging Face：Cloudflare/clef-omni](https://huggingface.co/Cloudflare/clef-omni)
- [Hugging Face：Cloudflare/clairic](https://huggingface.co/Cloudflare/clairic)
- [Hugging Face：Cloudflare/clairic-flash](https://huggingface.co/Cloudflare/clairic-flash)
- [Clef Decision Index 展示站](https://clef-evals.workers-ai-mle.workers.dev/)
- [Typesafe Evals](https://evals.typesafe.ai/)
- [本站模型卡：Jev（TypeSafe AI）](/posts/daily/2026-09-19-model-typesafe-ai-jev)
- [本站模型卡：Clef（Cloudflare）](/posts/daily/2026-10-03-model-cloudflare-clef)

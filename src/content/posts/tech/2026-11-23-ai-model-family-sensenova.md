---
title: "SenseNova（商湯日日新）——閉源的 6.8 Flash 辦公 agent，與開放權重的 looped 模型 Loop-9B"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, sensetime, model-family-sensenova, open-source, multimodal, looped-transformer, model-selection]
lang: zh-TW
type: deep-dive
tldr: "商湯 SenseNova（日日新）有兩條線：閉源的 SenseNova 6.8 Flash 與 6.8 Flash Lite 走 Token Plan API，主打辦公與設計 agent，公測期免費但沒有公開的按 token 價格；開放權重的 SenseNova-Loop-9B 用 32 層權重跑 56 次層運算，Apache 2.0、512K context，4-bit 量化後 256K context 約 15 GiB 顯示記憶體可跑。兩者的評測都只有商湯自報，OpenRouter 與 Artificial Analysis 都沒有收錄。"
description: "商湯 SenseNova（日日新）模型家族介紹：閉源 SenseNova 6.8 Flash／Flash Lite 的 API 規格、Token Plan 積分制與官方評測；開放權重 SenseNova-Loop-9B 的 looped 架構、自架記憶體需求與採用數字；U1.5 等開放權重子線、2025→2026 演化時間線與 Agent 選型。"
series:
  name: "AI 模型家族"
  order: 42
draft: false
glossary:
  - term: "mHC（Manifold-Constrained Hyper-Connections）"
    aliases: ["mHC"]
    definition: "把單一殘差路徑擴成多條並行殘差流，並用 Sinkhorn 正規化限制各流之間混合方式的設計；SenseNova-Loop-9B 在迴圈區段內用兩條殘差流"
  - term: "Token Plan"
    definition: "商湯 SenseNova 平台的訂閱制 API 方案：不按每百萬 token 計價，而是按滾動 5 小時與每週兩層積分上限扣點"
---

> :globe: [English version](/posts/tech/2026-11-23-ai-model-family-sensenova-en)

SenseNova（日日新）是商湯科技（SenseTime）的大型模型品牌。它在 2026 年分成兩條很不一樣的線。一條是閉源、只走自家 API 的 SenseNova 6.8 Flash 系列，賣點是辦公文件、資料分析與動態設計的 agent 工作流。另一條是放在 Hugging Face [`sensenova` 組織](https://huggingface.co/sensenova)的開放權重研究模型，其中最受關注的是 looped 架構的 [SenseNova-Loop-9B](https://huggingface.co/sensenova/SenseNova-Loop-9B)。

這篇寫給兩種讀者：想找一個能在單張消費級 GPU 跑長 context 的小型開放權重模型的人，以及在評估中國辦公 agent API 的人。讀完你應該能判斷 Loop-9B 值不值得排進本地評測、6.8 Flash 的 API 條件能不能接受，以及哪些地方只能靠自己實測。

怎麼解讀文中的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 家族定位與版本矩陣

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| SenseNova 6.8 Flash（API 名 `sensenova-6.8-flash`） | 閉源旗艦，辦公與設計 agent | 文字＋圖片輸入；1M context、單次輸出最多 128K；思考模式不能關 | Token Plan API；未公開參數與權重 |
| SenseNova 6.8 Flash Lite（`sensenova-6.8-flash-lite`） | 閉源輕量版，日常任務 | 文字＋圖片輸入；262,144 context、輸出最多 65,536；可關閉思考 | Token Plan API |
| SenseNova-Loop-9B（HF `sensenova/SenseNova-Loop-9B`） | 開放權重，looped 架構 | 約 9B 參數，32 層權重跑 56 次層運算；文字＋圖片輸入；512K context | Apache 2.0 權重（BF16、官方 AWQ 4-bit、GGUF）；沒有官方託管 API |
| SenseNova-U1.5-8B-MoT | 開放權重，理解與生成一體 | 同一個模型做圖片理解、生成與編輯，沒有獨立的視覺編碼器與 VAE | Apache 2.0 權重；API 上的對應型號是 U1.5 Lite／Fast |

兩個要先知道的事：

- **閉源與開放權重不是同一個模型的兩種版本。** 6.8 Flash 系列沒有釋出權重，商湯也沒公開參數量；Loop-9B 是獨立的架構實驗，官方明說它是「下一代模型架構的前沿探索」，沒有說它是 6.8 Flash 的蒸餾版。
- **Token Plan 上還有別家模型。** [平台文件](https://platform.sensenova.cn/docs)的模型總覽除了自家 6.8 Flash、Flash Lite 與 U1.5，也列出 DeepSeek V4.1 Flash、GLM-5.3 與 Kimi K3；選 Token Plan 不等於只用 SenseNova。

### 子線與生態

`sensenova` 組織下目前有 44 個 repo，除了 Loop 與 U 系列，還有幾條小子線：

- **SenseNova-SI**：空間智慧（spatial intelligence）微調，底座是 InternVL3、Qwen2.5-VL、Qwen3-VL 等開放模型，Apache 2.0。
- **SenseNova-MARS**（8B／32B）與 **InteractiveOmni**（4B／8B）：MIT 授權的多模態研究模型。
- **SenseNova-Vision-7B-MoT**：權重是 [CC BY-NC 4.0](https://huggingface.co/sensenova/SenseNova-Vision-7B-MoT)，只能非商用，跟家族其他權重不同。
- **以 Qwen3.8-27B 微調的應用模型**：[SenseNova 6.8 Code2Video](https://huggingface.co/sensenova/SenseNova-6.8-Code2Video)（寫程式碼來產生短影片，官方建議用 Claude Code 當 harness）與機器人用的 SenseNova-RoboRSI-27B-Preview。名稱裡的「6.8」是品牌版本，權重底座是 Qwen，不是 6.8 Flash。
- **Looped-DiT-B16／B32**：2026 年 9 月放出的 looped 圖片生成小模型，MIT 授權，比 Loop-9B 早一步把「重複執行同一組層」套到擴散模型上。

開源工具方面，[SenseNova-Skills](https://github.com/OpenSenseNova/SenseNova-Skills) 把簡報、資訊圖、資料分析、深度調研等辦公能力包成 skill，官方建議搭配 OpenClaw 或 Hermes Agent 使用。

## 家族演化

| 版本 | 發佈 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| SenseNova V6.0 | 2025 | 原生多模態融合訓練，商湯第一代主打多模態推理的版本 | — |
| SenseNova V6.5 | 2025-07-27 | 圖文交錯的思維鏈，官方稱性價比是 V6.0 的 3 倍 | — |
| NEO 架構 | 2025-12-01 | 拿掉傳統「視覺編碼器＋投影層＋語言模型」拼接，開源 2B／9B；之後的 U 系列都建在它上面 | — |
| SenseNova U1 | 2026-04-28 | 商湯第一次以 Apache 2.0 開源理解與生成一體的模型（8B dense 與 A3B MoE） | — |
| SenseNova 6.7 Flash-Lite＋Token Plan | 2026-05-08 | 閉源 API 改成訂閱積分制、公測免費；同時開源 SenseNova-Skills | — |
| SenseNova 6.8 Flash Lite Preview | 2026-08-11 | 主打主 agent 調度十餘個子 agent 的長程任務 | — |
| SenseNova U1.5 | 2026-08 | U 系列第二版，強化圖片編輯與圖文交錯輸出 | — |
| SenseNova-Loop-9B-Preview | 2026-10-30 | 第一個開放權重的 looped 語言模型，262K 訓練長度 | [模型卡](/posts/daily/2026-10-31-model-sensetime-sensenova-loop-9b-preview) |
| SenseNova 6.8 Flash | 2026-11-02 | 閉源旗艦正式版：1M context、長期記憶、動態簡報與 Blender 3D 設計 | — |
| SenseNova-Loop-9B | 2026-11-17 | Preview 的正式版，context 翻倍到 512K，官方同步放出 AWQ 與 GGUF | [模型卡](/posts/daily/2026-11-21-model-sensetime-sensenova-loop-9b) |

2025 年的 V6／V6.5 走的是「一個大的多模態旗艦」路線；2026 年起商湯把它拆成兩邊：閉源端改賣「Flash／Flash Lite＋積分制訂閱＋開源 skill」的辦公 agent 組合，開放權重端則放架構實驗（NEO、U 系列、Loop）。Loop-9B-Preview 的詳細分數（WorkBuddy Bench、RaccoonPPT Bench 對 Qwen3.5-27B）保留在[當時的模型卡](/posts/daily/2026-10-31-model-sensetime-sensenova-loop-9b-preview)，跟正式版的對照組不同，不放在同一張表。

## 架構與訓練取捨

### SenseNova-Loop-9B：用迴圈換深度

[Loop-9B 模型卡](https://huggingface.co/sensenova/SenseNova-Loop-9B)公開的設計：

- **迴圈解碼器**：32 層解碼器，輸入先過第 0–3 層，接著第 4–27 層這 24 層連跑兩次（共用同一組權重），最後過第 28–31 層。每個 forward 做 56 次層運算、只存 32 層權重，官方換算成約 14.6B 的「推理等效參數」。
- **兩條殘差流的 mHC**：迴圈區段內的每一層從兩條殘差流讀資料、算完 attention 或 FFN 再寫回去，流之間的混合矩陣用 20 次 Sinkhorn 正規化約束。
- **混合注意力**：每 4 層一組，3 層 linear attention 接 1 層 full attention；迴圈邊界剛好對齊完整的 4 層組，兩次迴圈的注意力型態一致。
- **多模態**：文字與圖片輸入、文字輸出，訓練資料含文字、圖片、程式碼與工具呼叫軌跡，context 延長到 512K。

官方做了迴圈次數的實驗：以只跑一次的同一個 9B 模型為基準、訓練資料不變，只改迴圈次數。四項任務大多在 3 到 4 次迴圈時最好；從 2 次加到 4 次，LiveCodeBench v6 再多 1.04 個百分點。Preview 與正式版都選 2 次，理由是推理效率。換句話說，目前的 Loop-9B 沒有把迴圈開到最好的點，用推理成本換掉了一點分數。

模型卡沒有說明 Loop-9B 是從頭預訓練，還是由其他基礎模型初始化，也沒有公開訓練 token 數。

### 跟 Inkling 2 Mini 的 looped 設計比較

站上的 [Inkling 家族文](/posts/tech/2026-09-05-ai-model-family-inkling)介紹了另一個 looped 模型 Inkling 2 Mini。兩者都用「中間層重複跑」換推理深度，但取捨不同：

| | SenseNova-Loop-9B | Inkling 2 Mini |
|---|---|---|
| 主幹 | dense，混合 linear／full attention | MoE，26.4B 總參數、3.4B 啟用 |
| 迴圈方式 | 中間 24 層跑 2 次（32 層 → 56 次） | 中間 12 層跑 3 次（24 層 → 48 次） |
| 額外設計 | 兩條殘差流的 mHC | — |
| context | 512K | 1M |
| 託管 API | 沒有 | Tinker 與 OpenRouter 上的第三方 |

Loop-9B 每個 token 要跑過全部約 9B 權重，中間 24 層還要再跑一次；Inkling 2 Mini 每個 token 只啟用 3.4B；前者的權重檔小（4-bit 約 4.9GB），後者的每 token 運算量小。兩邊官方都拿 Qwen3.8-27B 當對照，但用的 benchmark 不同，不能直接排名。

### SenseNova 6.8 Flash：未揭露

商湯沒有公開 6.8 Flash 與 Flash Lite 的參數量、架構或訓練資料。官方文件與新聞稿能確認的只有介面層的事：原生多模態（官方說法是不經過「視覺轉文字」的中間層），以及思考模式在 Flash 上不能關。[Token Plan 頁面](https://www.sensenova.ai/token-plan)宣稱多步驟長任務的 token 用量比純文字 agent 模型少約 60%，這是商湯自己的估算，頁面也註明實際任務會有落差。

## 評測與競品比較

這個家族目前**沒有第三方評測**：[Artificial Analysis](https://artificialanalysis.ai/models) 與 [OpenRouter](https://openrouter.ai/models) 都沒有收錄任何 SenseNova 模型，下面的數字全是商湯自報。

### 官方自報：Loop-9B 對上同級開放模型

摘自 [Loop-9B 模型卡](https://huggingface.co/sensenova/SenseNova-Loop-9B)的評測圖（「—」表示該圖沒有列這個模型）：

| Benchmark | Loop-9B-Preview | Loop-9B | Qwen3.6-27B | Qwen3.8-27B |
|---|---|---|---|---|
| GAIA | 37.86 | 69.90 | — | 66.99 |
| Terminal-Bench 2.1 | 40.45 | 59.55 | 63.40 | — |
| AutomationBench | 14.33 | 36.67 | 14.33 | 36.67 |
| AIDABench | 58.62 | 65.31 | 58.62 | 65.01 |
| NL2Repo | 19.91 | 41.36 | 36.20 | 44.60 |
| T³-Banking | 18.56 | 30.93 | 14.43 | 36.08 |
| BIRD | 71.38 | 72.34 | 69.82 | — |

讀法：

- **正式版比 Preview 進步很大**，GAIA 幾乎翻倍、NL2Repo 翻倍，七項全部上升。
- **對 Qwen3.8-27B 互有勝負。** GAIA 與 AIDABench 略高、AutomationBench 打平，NL2Repo 與 T³-Banking 落後；Terminal-Bench 2.1 圖上沒有 Qwen3.8，對 Qwen3.6-27B 也落後。程式與金融業務流程仍是弱項，跟 Preview 時期一樣。
- **對照組是商湯選的。** 同一張圖還有 Nanbeige4.2 3B、iQuest-Coder 40B、Qwen3.6 35B-A3B，每一項放的對手不完全相同，沒有統一的推理設定說明。

### 官方自報：6.8 Flash 對上閉源與中國旗艦

摘自 [6.8 Flash 產品頁](https://www.sensenova.cn/flash-6-8)的評測圖。每一項的對手不同，表中只列 6.8 Flash 與該項最高的對手：

| Benchmark | 6.8 Flash | 該項最高的對手 |
|---|---|---|
| AutomationBench | 49.78 | Opus 5：50.30 |
| WorkbuddyBench | 76.54 | Opus 5：76.80 |
| TeamBench | 53.33 | MiMo V2.6 Flash：52.22（6.8 Flash 最高） |
| DataAnalysis2.0（商湯自建） | 86.89 | Opus 5：86.48（6.8 Flash 最高） |
| RaccoonPPTBench v2（商湯自建） | 69.60 | GPT 6 Sol：74.20 |
| BrowseComp | 88.55 | GPT 5.6 Sol：90.40 |
| LongMemEval-S | 93.33 | Claude 5.5 Haiku：96.67 |
| BEAM 128K | 77.71 | GPT 6 Luna：77.71（同分） |
| PersonaMem-v2 | 69.33 | Claude 5.5 Haiku：71.00 |
| π-bench | 58.16 | DeepSeek V4.1 Flash：66.25 |

讀法：

- **十項裡 6.8 Flash 拿兩項第一、一項同分，其中一個第一是自建 benchmark。** 公開 benchmark 裡唯一領先的是 TeamBench；AutomationBench、WorkbuddyBench 與 Opus 5 只差 0.6 分以內，但沒贏。
- **對手版本不一致。** 同一張圖裡 Claude 出現 Opus 5、Opus 5.5、Opus 4.8 三個版本，GPT 也有 6 Sol 與 5.6 Sol，等於每一項挑不同對手，不能把這張圖讀成「整體接近 Opus 5」。
- **記憶類評測比的是小型模型。** 長期記憶那組的對手是 Claude 5.5 Haiku、GPT 6 Luna 這類輕量模型，6.8 Flash 在 π-bench 落後 DeepSeek V4.1 Flash 與 MiniMax M3 約 8 分。

## 授權、價格與部署

### 開放權重：大多是 Apache 2.0，但要逐個看

Loop-9B 的模型卡把授權指向 [GitHub 上的 LICENSE](https://github.com/OpenSenseNova/SenseNova-Loop/blob/main/LICENSE)，內容是未修改的 Apache 2.0 全文，沒有 MAU 門檻或地區限制。U1、U1.5 也是 Apache 2.0。例外是 SenseNova-Vision-7B-MoT（CC BY-NC 4.0，禁止商用）與 MARS、InteractiveOmni（MIT）；以 Qwen3.8-27B 微調的 Code2Video 與 RoboRSI 標 Apache 2.0，使用前也要確認底座授權。

### 閉源 API：Token Plan 積分制

- **沒有公開的按 token 價格。** 6.8 Flash 與 Flash Lite 只透過 Token Plan 提供，[Token Plan 頁面](https://www.sensenova.ai/token-plan)目前只有公測期的 Free 方案（$0／月，每個模型每 5 小時 1,500 次呼叫，最多 20 把 API key），Lite／Pro 付費方案標示「即將推出」。
- **實際額度看積分。** [平台文件](https://platform.sensenova.cn/docs)的積分規則：公測期通用積分池每滾動 5 小時上限 120,000、每週 1,200,000，另有 Flash Lite 專屬池 60,000／600,000，不同模型扣點不同。官方也註明這是公測期權益、之後可能調整。
- **免費方案列的是 Flash Lite。** Token Plan 頁面的 Free 方案寫的是 6.8 Flash Lite 與 U1 Fast；英文新聞稿說 6.8 Flash 可免費試用，兩頁寫法不一致，要用 6.8 Flash 跑量產前先在控制台確認。

### API 規格

| | 6.8 Flash | 6.8 Flash Lite |
|---|---|---|
| 端點 | `https://token.sensenova.cn/v1/chat/completions`（OpenAI 相容） | 同左 |
| context | 1M | 262,144 |
| 單次輸出 | 預設 64K，最多 128K（思考與回答共用） | 最多 65,536 |
| 思考模式 | 一律開啟；`reasoning_effort` 為 minimal／low／medium／high（預設）／xhigh／max | 可關（`reasoning_effort: none`）；low／medium／high（預設）／max |
| 輸入 | 文字、JPG／PNG／WebP 圖片 | 文字、圖片 |
| 工具 | function calling、JSON 輸出、串流 | function calling、平行工具呼叫 |

官方的選型建議是日常任務用 Flash Lite、複雜的多步驟長任務與專業交付用 Flash。

### 自架 Loop-9B

- **記憶體**：官方估算 4-bit 權重（約 4.9GB）加 8-bit KV cache，64K context 約 10 GiB、128K 約 12 GiB、256K 約 15 GiB；KV cache 換 4-bit 再各省 1 到 3 GiB。
- **推論框架**：Transformers 要 `trust_remote_code=True`（官方測過 5.18.0）；LightLLM 範例用 4 卡張量並行跑 BF16；SGLang 與 vLLM 要從尚未合併的 PR 分支自己編譯，AWQ 版可在 vLLM 單卡跑。
- **GGUF 不能直接丟給主線 llama.cpp。** 官方 GGUF（BF16、Q8_0、Q5_K_M、Q4_K_M）要用商湯 fork 的 [OpenSenseNova/llama.cpp](https://github.com/OpenSenseNova/llama.cpp)；Ollama 官方模型庫目前也沒有 Loop-9B。
- **微調**：官方範例在 [OpenSenseNova/torchtitan](https://github.com/OpenSenseNova/torchtitan)，投機解碼草稿模型的訓練腳本在 SenseSpec。

### 採用程度

數字取自 Hugging Face API，2026-11-23：

| 指標 | 數字 |
|---|---|
| HF trending 模型榜 | Loop-9B 第 10 名（第 1 名是 Inkling 2 Mini） |
| 近 30 天下載 | Loop-9B BF16 1,863、官方 GGUF 80,865、AWQ 735；Preview 6,015 |
| 標記 Loop-9B 為 base model 的衍生模型 | 64 個（量化 52、微調 11、adapter 1）；Preview 另有 14 個 |
| U1.5-8B-MoT | 近 30 天 11,758、累計 28,285 下載；衍生模型 28 個 |
| 託管通路 | OpenRouter、HF Inference Providers、Ollama 官方庫都沒有 |

下載量集中在 GGUF，代表多數人拿它在本地跑，但主線工具鏈還沒支援，衍生模型大多是社群量化版。

## Agent 使用與選型

- **單張 16 GB 級 GPU 上要長 context 的本地 agent** → Loop-9B 的 AWQ 版值得一試：官方估算 256K context 約 15 GiB。先確認你的推論框架支援它的自訂架構。
- **需要託管 API、SLA 或直接用 OpenRouter** → Loop-9B 不適合，沒有任何託管通路；要 looped 模型又要 API，可看 [Inkling 2 Mini](/posts/tech/2026-09-05-ai-model-family-inkling)。
- **主力 coding agent** → 兩條線都不是首選。Loop-9B 自己的模型卡承認 coding 與長程 agent 任務不穩，NL2Repo、Terminal-Bench 2.1 也落後 27B 級對手。
- **中文辦公文件、簡報、資料分析報告** → 6.8 Flash 是商湯投入最多的場景，搭配 SenseNova-Skills 與 OpenClaw／Hermes Agent；官方特別註明，完整工作流要 agent 框架加 skill 才跑得出來，只直連模型 API 做不到。
- **延遲敏感的短任務** → 用 6.8 Flash Lite 並關掉思考；6.8 Flash 的思考模式關不掉。
- **商用部署開放權重** → Loop-9B、U1.5 是 Apache 2.0；Vision-7B-MoT 不能商用。

最小的選型驗證：用同一組本地任務分別跑 Loop-9B AWQ 在 2 次迴圈下的完成率與顯示記憶體用量，再跟同記憶體預算的 Qwen 或 Inkling 2 Mini 量化版比。API 端則用 Token Plan 免費額度跑 6.8 Flash Lite（思考開與關各一輪），記下每個任務扣掉的積分，因為沒有公開單價，積分消耗就是你唯一的成本依據。

## 限制與取捨

- **沒有第三方評測。** Artificial Analysis、OpenRouter 都沒收錄，所有分數來自商湯自己的圖表；6.8 Flash 的圖每項挑不同版本的對手，拿第一的兩項裡有一項是自建 benchmark。
- **閉源端價格不透明。** Token Plan 只有公測免費方案與積分上限，付費方案未公布，也沒有每百萬 token 單價，很難事先估算量產成本。
- **Loop-9B 的工具鏈還不成熟。** SGLang、vLLM 要從 PR 分支編譯，GGUF 要用 fork 版 llama.cpp，Ollama 官方庫沒有；跟主線框架都支援的 Qwen 相比，部署成本高一截。
- **Loop-9B 的已知弱點**：官方列出複雜指令遵循（工具定義多或限制多時會漏要求）、coding 與一般 agent 任務不穩，以及複雜 3D 網頁一次做不完、要兩到三輪修改。
- **訓練來源未揭露。** Loop-9B 沒有說明是否由其他基礎模型初始化，6.8 Flash 連參數量都沒公開。

SenseNova 的策略可以這樣看：閉源端用免費積分與開源 skill 把開發者拉進自家辦公 agent 生態，開放權重端用 looped、NEO 這類架構實驗累積技術名聲。對外部開發者，Loop-9B 是目前最值得實測的一個：它在 HF trending 前段、權重是乾淨的 Apache 2.0，而且記憶體需求低；6.8 Flash 則要等付費方案與第三方評測出來，才好跟其他中國 API 放在一起比。

## 參考資料

- [sensenova/SenseNova-Loop-9B — Hugging Face 模型卡（規格、評測圖、部署、已知限制）](https://huggingface.co/sensenova/SenseNova-Loop-9B)
- [sensenova/SenseNova-Loop-9B-Preview — Hugging Face 模型卡](https://huggingface.co/sensenova/SenseNova-Loop-9B-Preview)
- [sensenova/SenseNova-Loop-9B-GGUF — Hugging Face](https://huggingface.co/sensenova/SenseNova-Loop-9B-GGUF)
- [sensenova/SenseNova-Loop-9B-AWQ — Hugging Face](https://huggingface.co/sensenova/SenseNova-Loop-9B-AWQ)
- [OpenSenseNova/SenseNova-Loop LICENSE（Apache 2.0）— GitHub](https://github.com/OpenSenseNova/SenseNova-Loop/blob/main/LICENSE)
- [sensenova — Hugging Face 組織頁](https://huggingface.co/sensenova)
- [SenseNova 6.8 Flash 正式版发布 — 商湯官方新聞稿（簡體中文）](https://www.sensetime.com/cn/news/sensenova-6-8-flash-release-20261103-1421)
- [SenseTime Launches SenseNova 6.8 Flash — 商湯官方新聞稿（英文）](https://www.sensetime.com/en/news/sensenova-6-8-flash-release-20261103-1421)
- [SenseNova 6.8 Flash 產品頁（含評測圖）](https://www.sensenova.cn/flash-6-8)
- [SenseNova 平台 API 文件（模型規格、積分規則）](https://platform.sensenova.cn/docs)
- [SenseNova Token Plan](https://www.sensenova.ai/token-plan)
- [SenseNova Models](https://www.sensenova.ai/models)
- [商湯發布日日新 SenseNova 6.7 Flash-Lite，Token Plan 同步開放 — 商湯官方新聞稿（簡體中文）](https://www.sensetime.com/cn/news/51170639)
- [SenseNova 6.8 Flash Lite Preview 開放體驗 — 商湯官方新聞稿（簡體中文）](https://www.sensetime.com/cn/news/sensenova-6.8-flash-lite-preview)
- [SenseTime Launches the Enhanced SenseNova V6.5 — 商湯官方新聞稿](https://www.sensetime.com/en/news/51169861)
- [SenseTime Introduces NEO — 商湯研究頁](https://www.sensetime.com/en/research/51170250/)
- [SenseTime Fully Open-Sources SenseNova U1 — 商湯官方新聞稿](https://www.sensetime.com/en/news/51170629)
- [SenseNova-U1 技術報告 — arXiv 2605.12500](https://arxiv.org/abs/2605.12500)
- [SenseNova U1.5 Technical Report — 商湯](https://www.sensetime.com/en/news/sensenova-u1-5-20260917-1850)
- [sensenova/SenseNova-U1.5-8B-MoT — Hugging Face](https://huggingface.co/sensenova/SenseNova-U1.5-8B-MoT)
- [sensenova/SenseNova-6.8-Code2Video — Hugging Face](https://huggingface.co/sensenova/SenseNova-6.8-Code2Video)
- [sensenova/SenseNova-Vision-7B-MoT — Hugging Face（CC BY-NC 4.0）](https://huggingface.co/sensenova/SenseNova-Vision-7B-MoT)
- [OpenSenseNova/SenseNova-Skills — GitHub](https://github.com/OpenSenseNova/SenseNova-Skills)
- [OpenSenseNova/llama.cpp — GitHub（Loop-9B GGUF 用的 fork）](https://github.com/OpenSenseNova/llama.cpp)
- [模型卡｜SenseNova Loop-9B（正式版）](/posts/daily/2026-11-21-model-sensetime-sensenova-loop-9b) — 本站
- [模型卡｜SenseNova Loop-9B-Preview](/posts/daily/2026-10-31-model-sensetime-sensenova-loop-9b-preview) — 本站
- [Inkling 模型家族](/posts/tech/2026-09-05-ai-model-family-inkling) — 本站，另一個 looped 模型
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站

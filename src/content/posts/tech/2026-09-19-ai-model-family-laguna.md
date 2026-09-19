---
title: "Laguna——從 33B 本機小鋼炮到 118B 長程推理，Poolside 三個月三連發的賭注"
date: 2026-09-19
category: tech
type: deep-dive
tags: [ai-agent, llm, poolside, model-family-laguna, moe, open-source, agentic-coding, model-selection]
lang: zh-TW
tldr: "Laguna 是 Poolside 的 agentic coding 模型家族：XS 2.1 以 33B-A3B 跑進 36GB Mac，S 2.1 以 118B-A8B、1M context 在 Terminal-Bench 2.1 拿下 70.2%、DeepSWE 40.4%，兩者都掛 OpenMDW-1.1 開源。"
description: "Poolside Laguna 模型家族完整介紹：2026-04 到 2026-07 三個月三連發的演化時間線、XS 2.1 與 S 2.1 的架構與訓練差異、118B-A8B 與 33B-A3B 選型矩陣、OpenMDW-1.1 開源與部署生態、以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 21
draft: false
glossary:
  - term: "Laguna"
    definition: "Poolside 推出的 agentic coding 模型家族，現行主力是 XS 2.1（33B）與 S 2.1（118B），前代為 M.1 與 XS.2，全是文字進文字出的 MoE 模型。"
  - term: "DFlash"
    definition: "Poolside 為 Laguna 訓練的推測解碼草稿模型，配對主模型使用可把本地推理吞吐拉高約一倍。"
  - term: "preserved thinking"
    definition: "把前輪助手的推理內容保留在對話歷史裡再繼續跑，Laguna 在 agent 場景建議的用法，中斷保留會讓後續步驟不再生推理。"
---

> 🌏 [English version](/posts/tech/2026-09-19-ai-model-family-laguna-en)

2026 年 7 月 21 日，[Poolside](https://www.poolside.ai/models) 發佈 [Laguna S 2.1](https://poolside.ai/blog/introducing-laguna-s-2-1)——一個 118B 總參數、每 token 只啟動 8B 的 MoE，context 開到 1M，在 [Terminal-Bench 2.1](https://trajectories.poolside.ai/) 拿下 70.2%、[DeepSWE](https://trajectories.poolside.ai/?benchmark=deep-swe) 拿下 40.4%。從開始訓練到發文不到九週，而且預訓練資料和兩個月前的小模型完全同一份。這是「AI 模型家族」系列的第二十一篇，追蹤 Laguna 從 [M.1 / XS.2](https://poolside.ai/blog/introducing-laguna-s-2-1) 雙發到 XS 2.1 再到 S 2.1 的完整路徑。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族演化時間線

| 時間 | 版本 | 關鍵事實 |
|---|---|---|
| 2025 | Malibu 2.1 / 2.2 | 前代 dense agent 模型，2.2 達 128K context；M.1 發佈時對照組就是它 |
| 2026-04-28 | Laguna M.1 / XS.2 雙發 | 第一代 Laguna：M.1 是 225B-A23B 旗艦，XS.2 是 33B-A3B 本機小版 |
| 2026-07-02 | Laguna XS 2.1 | XS.2 的改版：同架構加原生推理，SWE-bench Multilingual 從 57.7% 拉到 63.1% |
| 2026-07-21 | Laguna S 2.1 | 集大成：118B-A8B、1M context，同一份預訓練資料放大，RL 首度用 FP8 |

三個月、三個模型。Laguna 的主線很清楚：**先用 M.1 / XS.2 把 harness、資料、訓練迴圈的弱點暴露出來，再用 XS 2.1 驗證改良版 recipe，最後把整套搬到 S 2.1 放大**。官方自己在 [S 2.1 發佈文](https://poolside.ai/blog/introducing-laguna-s-2-1) 裡寫：「under nine weeks from the start of training to this post」，靠的是 [Model Factory](https://poolside.ai/blog/introducing-laguna-s-2-1) 這個內部訓練平台，下一個更大的 Laguna 在發文前一週已經開始預訓練。

## 兩種尺寸，一種哲學

看懂 Laguna 要先接受它的預設：**模型不是拿來聊天的，是拿來在 agent harness 裡跑幾百步的**。官方文件對 [M.1](https://docs.poolside.ai/release-notes/models) 和 [XS.2](https://docs.poolside.ai/release-notes/models) 寫了同一句話：放在 [Poolside Agent 工作流](https://docs.poolside.ai/cli/pool) 裡用，不要當純聊天模型。S 2.1 和 XS 2.1 也一樣，支援的模式都是 Agentic + Chat，但最佳表現都在自家 [pool](https://poolside.ai/get-started) 這個 terminal coding agent 裡。

**XS 線（跑本機）**：[XS 2.1](https://poolside.ai/blog/introducing-laguna-xs-2-1) 是 33B 總參數、3B 啟動，256K context（精確值 262,144）。官方說法是「compact enough to run on a Mac with 36 GB of RAM」，[Hugging Face](https://huggingface.co/poolside/Laguna-XS-2.1) 上 BF16 之外還有 FP8、NVFP4、INT4，外加 [DFlash](https://huggingface.co/poolside/Laguna-XS-2.1-DFlash) 草稿模型，實測吞吐翻倍。定價沿用 XS.2 的 $0.10 / $0.20 / $0.05 每 1M input / output / cache-read tokens。

**S 線（撐長程）**：[S 2.1](https://huggingface.co/poolside/Laguna-S-2.1) 是 118B 總參數、8B 啟動，1M context（精確值 1,048,576）。官方定位是「Frontier-class reasoning at mid-size cost」，小到能塞進一台 [NVIDIA DGX Spark](https://poolside.ai/blog/introducing-laguna-s-2-1)，強到在 Terminal-Bench 2.1 贏過一票 500B 以上的開源模型。[OpenRouter](https://openrouter.ai/poolside/laguna-s-2-1) 上免費端點給 256K context，付費專屬端點才給完整 1M，價格是 $0.10 / $0.20 / $0.01（2026-07 公告）。

兩個尺寸都不支援 vision，純文字進文字出。這不是疏忽，是刻意：Laguna 把所有複雜度都押在「讀 repo、改檔、跑測試、驗證」的迴圈上。

## 架構：同一份 laguna recipe

S 2.1 和 XS 2.1 共用同一個 `laguna` 架構，差別只有規模。按 [S 2.1 model card](https://huggingface.co/poolside/Laguna-S-2.1) 和 [XS 2.1 model card](https://huggingface.co/poolside/Laguna-XS-2.1) 的寫法：

* **路由**：token-choice router + softplus gating，256 個 routed experts + 1 個 shared expert；S 2.1 每 token 取 top-10，啟動約 8B
* **注意力**：grouped-query attention，8 個 KV heads，head dim 128，外加 per-head softplus output gating
* **層數**：S 2.1 是 48 層（12 global + 36 sliding-window），XS 2.1 是 40 層（10 global + 30 sliding-window），比例都是 1:3，sliding window 都是 512
* **詞表**：家族共用 tokenizer，100,352 tokens
* **推理**：原生交錯思考（interleaved thinking），tool call 之間會推理，建議保留前輪 reasoning 再跑下一輪

S 2.1 的 BF16 權重約 236GB，多卡才跑得動；量化版把門檻往下拉。XS 2.1 則把 KV cache 量化到 FP8，單卡和 Mac 都能跑。這是 MoE 的標準取捨：**總參數決定記憶體下限，啟動參數決定每次推理的成本**。

## 訓練：同一份資料，差在後訓練

S 2.1 最值得玩味的一句話在發佈文裡：「trained on exactly the same pre-training data as XS 2.1」。從 XS 2.1 到 S 2.1 的差別是規模、訓練 code 修 bug、小 recipe 調整，不是新資料。S 2.1 預訓練始於 2026-05-22，用 4,096 張 NVIDIA H200 跑了 60 天，[官網](https://www.poolside.ai/models) 標示訓練量是 30T tokens（XS 2.1 是 15T）。它也是 Poolside 第一個 RL 全程用 FP8 精度跑的模型。

真正拉開差距的是後訓練，分兩段。先是 SFT，用部分合成資料把能力 bootstrapping 起來；再是 RL，只留給「模型還沒法高通過率解掉」的任務。訓練語料橫跨 409K 個 agentic 與非 agentic 環境，其中 83K 是 terminal 場景、168K 是標準軟體工程流。軟體工程任務最大宗是重現真實 commit（約 38,000 個任務、橫跨約 17,000 個 repo），S 2.1 新增了「給定 repo，把依賴裝到測試能跑」的 agentic 安裝任務。

訓練迴圈的三個改動直接對應到「更能撐」的行為：rollout 預算放得更寬（更長超時、每輪更多 token、每個任務更多輪）、搬到新的沙箱服務（支援背景行程、選擇性斷網防 reward hacking）、同一個 prompt 在多個 harness 上滾（避免只會在自家 harness 裡跑）。官方引用自家應用研究共同負責人 Pengming Wang 的說法：「not necessarily add more intelligence, but improve the behaviors」——多驗證、少想當然、不提早宣佈勝利、更能撐。

思考模式的開關就是證據：S 2.1 只有 `off` 和 `max` 兩檔（預設 max），max 把 Terminal-Bench 2.1 從 60.4% 拉到 70.2%，DeepSWE 從 16.5% 拉到 40.4%。代價是均值完成 token 從 80K 漲到 129K（TB 2.1）、99K 漲到 249K（DeepSWE）。官方承認的限制也很坦白：第三方 harness 的 tool schema 稍有不同就可能沿用記憶中的舊格式、JSON 陣列參數容易轉義錯誤、數學題會想太久。

## 家族矩陣與選型

| 面向 | XS.2（前代） | M.1（前代） | XS 2.1（現行小） | S 2.1（現行大） |
|---|---|---|---|---|
| 總參數 / 啟動 | 33B / 3B | 225B / 23B | 33B / 3B | 118B / 8B |
| Context | 256K | 256K | 256K | 1M |
| SWE-bench Verified | 64% | 65.4% | 70.9% | —（改跑 Multilingual / Pro） |
| SWE-bench Multilingual | 60% | 57.4% | 63.1% | 78.5% |
| Terminal-Bench | 29%（2.0） | 32.7%（2.0） | 37.5%（2.0） | 70.2%（2.1） |
| 定位 | 快速本機迭代 | 多步大任務 | 本機快速迭代＋推理 | 長程推理旗艦 |
| 本機 | Mac 可跑 | 需多卡 | 36GB Mac 可跑 | DGX Spark 單機 |

選型邏輯很乾脆：**要本機、要快、要便宜——XS 2.1；要 1M 長程、要榜單成績——S 2.1**。M.1 和 XS.2 已經是過渡角色，XS.2 在自家 API 上線一週後就 sunset，只留在 [Baseten](https://poolside.ai/blog/introducing-laguna-xs-2-1) 的 Model Library 做專屬部署。

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("POOLSIDE_API_KEY"),
    base_url="https://inference.poolside.ai/v1",
)
resp = client.chat.completions.create(
    model="poolside/laguna-s-2.1",
    messages=[{"role": "user", "content": "What are channels in Go?"}],
    extra_body={"chat_template_kwargs": {"enable_thinking": False}},
)
print(resp.choices[0].message.content)
```

## 開源策略與生態

Laguna 家族現行兩款都掛 [OpenMDW-1.1](https://openmdw.ai/)， fully permissive，商用不用另外要授權。S 2.1 首日就給 BF16、FP8、INT4、NVFP4，官方另做 GGUF 和 MLX 轉換；XS 2.1 則是 BF16、FP8、NVFP4、INT4。M.1 時代還是 Apache 2.0，2.1 世代全面切到 OpenMDW，這是跟著 [NVIDIA 和 Linux Foundation](https://poolside.ai/blog/introducing-laguna-xs-2-1) 的方向走。

部署生態是首日齊全派：[vLLM](https://github.com/vllm-project/vllm)、[SGLang](https://github.com/sgl-project/sglang)、[Ollama](https://ollama.com/library/laguna-s-2-1)（`ollama run laguna-s-2.1`）、llama.cpp、MLX、NVIDIA [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM/pull/13559)，外加 [Baseten](https://www.baseten.co/library/laguna-s-21/)、[OpenRouter](https://openrouter.ai/poolside/laguna-s-2-1)、[Vercel AI Gateway](https://vercel.com/ai-gateway/models?q=laguna)。Agent 側則進了 [Kilo](https://kilocode.ai)、[Hermes Agent](https://hermes-agent.nousresearch.com/)、pi、[OpenCode](https://opencode.ai/)、[OpenClaw](https://openclaw.ai/) 和 [Cline](https://cline.bot/)。每個發佈分數都有完整 trajectory 公開在 [trajectories.poolside.ai](https://trajectories.poolside.ai/)，這點比多數只貼數字的廠商有誠意。

## 與競品的位置

拿官方 2026-07-21 的表來看，S 2.1 的位置是「**體重外最能打**」：

* Terminal-Bench 2.1 70.2%，贏過 Inkling（975B-A41B，63.8%）、DeepSeek-V4-Pro-Max（1.6T-A49B，64.0%）、Nemotron 3 Ultra（550B-A55B，56.4%），但輸給 Tencent Hy3（295B-A21B，71.7%），更不用說 Kimi K3（2.8T，88.3%）和 Claude Fable 5（88.0%）這些旗艦。
* DeepSWE 40.4%，和 GLM 5.2（44.0%）同級，遠低於 Kimi K3（69.0%）、Claude Fable 5（70.0%）、Muse Spark 1.1（53.3%）。但它把自家 XS 2.1（0.3%）和 DeepSeek-V4-Pro-Max（9.0%）遠遠甩開——長程任務的斷層非常明顯。
* SWE-bench Multilingual 78.5% 反而是亮點，贏過 Hy3（75.8%）、Qwen 3.7 Max（78.3%），只比 SWE-Bench Pro 的 59.4% 略遜於 Qwen（60.6%）和 Muse Spark（61.5%）。

XS 2.1 的對位則是 30B 級：SWE-bench Verified 70.9% 贏過 Cohere North Mini Code（67.6%），但輸給 Qwen3.6-35B-A3B（73.4%）和 Claude Haiku 4.5（73.3%）；Terminal-Bench 2.0 37.5% 贏過 Haiku（29.8%），輸給 Qwen（51.5%）和 GPT-5.4 Nano（46.3%）。結論和官方一致：同體重帶頭，但越級打怪仍有天花板。

## 對 Agent 開發者的意義

如果你在做**長程 coding agent**（多檔修改、跑測試、自己驗證）：S 2.1 是目前開源裡少數為「幾百步還不放棄」調校的模型。記得開 thinking、保留 reasoning、用 pool 或相容 harness 跑，否則 DeepSWE 那種任務會從 40.4% 掉回 16.5%。

如果你在做**本機或低成本 agent**（筆電 demo、離線環境、高速迭代）：XS 2.1 是更合理的起點。36GB Mac 能跑、Ollama 一行指令、DFlash 翻倍吞吐，63.1% 的 Multilingual 在 33B 級夠用。

不適合：要 vision（全家族純文字）、要可調 effort（S 2.1 只有 off / max，沒有 low / mid / high）、要第三方 harness 零磨合（已知會有人格分裂式的 schema 記憶問題，靠 harness 拒絕後重試解決）。

## 整體來說

Laguna 的賭注不是「更大的預訓練」，而是「**更會工作的行為**」——驗證、回溯、撐住。S 2.1 證明同一份資料換個後訓練和訓練迴圈，就能從 XS 級跳到越級挑戰 500B 以上的榜單。下一步官方已經預告：更大的 Laguna 正在預訓練，方向是把這套「撐住」的能力連同規模一起放大。

後續觀察重點有兩個：S 2.1 的 1M context 在真實 repo（不是 benchmark 沙箱）裡能撐幾步才發散；以及 OpenMDW-1.1 的開放策略能否換來夠多的第三方 harness 適配，把那幾個已知的 tool-call 毛病修掉。

## 參考資料

- [Poolside 官方：Introducing Laguna S 2.1（2026-07-21）](https://poolside.ai/blog/introducing-laguna-s-2-1)
- [Poolside 官方：Introducing Laguna XS 2.1（2026-07-02）](https://poolside.ai/blog/introducing-laguna-xs-2-1)
- [Poolside 官方：Models（S 2.1 / XS 2.1 規格與定價）](https://www.poolside.ai/models)
- [Poolside 文件：Model release notes（M.1 / XS.2 / XS 2.1 / S 2.1）](https://docs.poolside.ai/release-notes/models)
- [Hugging Face：poolside/Laguna-S-2.1](https://huggingface.co/poolside/Laguna-S-2.1)
- [Hugging Face：poolside/Laguna-XS-2.1](https://huggingface.co/poolside/Laguna-XS-2.1)
- [OpenRouter：poolside/laguna-s-2.1](https://openrouter.ai/poolside/laguna-s-2-1)
- [trajectories.poolside.ai：S 2.1 完整評測軌跡](https://trajectories.poolside.ai/)

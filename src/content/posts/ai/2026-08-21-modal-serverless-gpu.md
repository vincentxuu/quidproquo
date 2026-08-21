---
title: "Modal：跑推論引擎的那一層，以及它什麼時候不值那個溢價"
date: 2026-08-21
category: ai
type: deep-dive
tags: [modal, serverless-gpu, sandbox, gpu, ai-agent, cost]
lang: zh-TW
tldr: "Modal 是按秒計費的 serverless GPU 平台，同時把 agent sandbox 做成一級公民（官方自報累計啟動逾 10 億個 sandbox、佔營收三分之一以上）。選型的關鍵不是它多方便，是你的 GPU 使用率：2026-08-21 實查，Modal A100 80GB 折算 $2.50/hr、RunPod 同卡 $1.59/hr，使用率超過六成四自己開機器就比較便宜；但同一天 H100 SXM Modal $3.95/hr、Lambda $3.99/hr，這張卡的溢價幾乎是零。"
description: "從選型角度介紹 Modal：serverless GPU 與 agent sandbox 這兩層各解決什麼問題、跟裸 GPU 供應商的成本結構怎麼算、冷啟動為什麼是這層的技術核心、agent 跑不可信程式碼時它為什麼變成必需，以及鎖定、無自架、併發上限這些誠實面。"
series:
  name: "AI 時代的技術選擇"
  order: 13
draft: false
---

🌏 [English version](/posts/ai/2026-08-21-modal-serverless-gpu-en)

站上寫過怎麼挑推論引擎——[vLLM 的技術細節](/posts/ai/2026-03-14-vllm-inference-engine)、[什麼時候該自架](/posts/ai/2026-08-21-vllm-self-host-decision)——但「引擎要跑在哪台機器上」這一層，一篇專文都沒有。這篇補上，主角是這層現在聲量最大的一家。

本文的價格、限制與規模數字皆為 2026-08-21 實查，並標明哪些是廠商自報。

## 一、Modal 是什麼

[Modal](https://modal.com/) 是紐約的一家雲端運算公司。它賣的東西一句話說得完：**你在 Python 函式上加一個 decorator，它就跑在雲端的 GPU 上，按秒計費，沒有請求時降到零。**

```python
import modal

image = modal.Image.debian_slim().pip_install("torch", "transformers")
app = modal.App(image=image)

@app.function(gpu="H100", scaledown_window=300)
def generate(prompt: str):
    ...
```

沒有 Dockerfile、沒有 Kubernetes manifest、沒有 instance 要記得關。`Image` 是程式碼裡宣告的，`gpu="H100"` 是參數，`scaledown_window` 決定容器閒置多久才收掉（[官方文件](https://modal.com/docs/guide/cold-start)：預設 60 秒，可設 2 秒到 20 分鐘）。

它同時做第二件事：**Sandbox**——在執行期動態開一個隔離容器，把不可信的程式碼丟進去跑。[官方文件](https://modal.com/docs/guide/sandbox)列的用途第一條就是「執行語言模型產生的程式碼」。Sandbox 預設壽命五分鐘，可以拉到 24 小時。

這兩層共用同一套底層。隔離用的是 Google 的 [gVisor](https://github.com/google/gvisor)，這點寫在 Modal 的[安全文件](https://modal.com/docs/guide/security)裡；同一份文件也說明客戶端與 CLI 是開源的，平台本身不是。

## 二、規模：先看營收與採用，融資排最後

2026-05-21 [官方部落格](https://modal.com/blog/modal-series-c)自報三個數字，資訊量由高到低是這個順序：

- **年化營收超過 3 億美元**，較 2025 年九月成長五倍
- **累計啟動超過 10 億個 sandbox**，且 sandbox「已佔營收三分之一以上」
- 完成 3.55 億美元 C 輪，投後估值 46.5 億美元，General Catalyst 與 Redpoint 領投

[路透社](https://finance.yahoo.com/sectors/technology/articles/exclusive-modal-labs-valued-4-170258984.html)補了一段官方部落格沒寫的：這輪分兩批進場，第一批的估值是 25 億美元，需求變大後第二批才拉到 46.5 億——Accel 與 Menlo 在第二批。同一則報導引述公司說法，年化營收是從九月的約 6,000 萬美元跳到約 3 億美元。

營收與 sandbox 數都是公司自報，沒有第三方稽核。但它們比估值有用得多：估值是一群投資人對未來的看法，營收成長率與 sandbox 用量是現在真的有人在付錢跑東西。**選型時只有後者該進你的表格。**

站上其實早就撞到過它。寫[企業內部 coding agent](/posts/ai/2026-04-04-internal-ai-coding-agents) 那篇提到 Ramp 的 Inspect 跑在 Modal 容器上；Modal 這次的 C 輪公告則說，Inspect 現在產出該公司 70% 的合併 PR。

## 三、第一個判準：使用率過不過得了六成

自己開一台 GPU 機器，帳單跟你有沒有在用無關；Modal 只在容器活著時計費。所以這個決定可以化約成一個數字：**你的 GPU 一天真的在算的時間佔幾成。**

2026-08-21 三家官網實查，折算成每 GPU 每小時（Modal 官網標的是每秒價，這裡乘 3600）：

| GPU | [Modal](https://modal.com/pricing)（按秒，折算/hr） | [RunPod](https://www.runpod.io/pricing) Pod | [Lambda](https://lambda.ai/service/gpu-cloud#pricing) 隨需 |
|---|---|---|---|
| H100 SXM 80GB | $3.95 | $3.29 | $3.99 |
| A100 SXM 80GB | $2.50 | $1.59 | $2.79 |
| L40S 48GB | $1.95 | $0.99 | — |
| B200 180GB | $6.25 | $6.79 | $6.69 |

這張表的重點不是「Modal 比較貴」，而是**溢價隨卡別劇烈變動**。A100 對 RunPod 是 1.57 倍，L40S 是 1.97 倍；但 H100 對 Lambda 只有 0.99 倍——同一天，Modal 的 H100 比 Lambda 便宜。

換成損益兩平的使用率（Modal 價 × 使用率 = 對手的整月價）：

| 對照 | 損益兩平使用率 |
|---|---|
| A100 vs RunPod | 64% |
| L40S vs RunPod | 51% |
| H100 vs Lambda | 101%（算出來超過 100%，代表這張卡 Modal 永遠比較便宜） |

**怎麼做**：翻出你上個月的 GPU 監控，算「utilization > 0 的秒數 ÷ 機器開著的秒數」。低於五成，serverless 幾乎一定贏；高於八成而且流量平穩，你在替閒置付溢價。介於中間就看卡別——上表告訴你 H100 沒有溢價，A100 不行。

## 四、第二個判準：你買的是價差還是那層軟體

上面的算法有個沒說出口的假設：兩邊交付的是同一件事。它們不是。

裸 GPU 供應商給你一台開機的機器，剩下都是你的：容器映像檔怎麼建、模型權重怎麼快取、autoscaler 怎麼寫、閒置怎麼收、跨區怎麼調度。Modal 賣的正是這些——[autoscaler 的四個參數](https://modal.com/docs/guide/scale)（`min_containers`、`max_containers`、`buffer_containers`、`scaledown_window`）就是一整個團隊本來要自己刻的東西。

所以真正的問句不是「哪家便宜」，是：**省下的價差，夠不夠請人維護那層？** A100 一張卡每月的價差是 654 美元（$2.50 − $1.59，跑滿 720 小時）。三張卡差不多是台灣一個工程師月薪的量級；三十張卡就明顯該自己刻。這是這個判準唯一需要算的東西。

## 五、冷啟動：這層真正的技術戰場

Serverless 的死穴是降到零之後的第一個請求。載入一個大模型動輒數十秒，這正是多數人放棄 scale-to-zero 的理由。

Modal 的答案是把容器記憶體整個存檔。[CPU Memory Snapshots](https://modal.com/docs/guide/memory-snapshot) 在容器暖好之後凍結記憶體狀態，之後每次冷啟動直接還原。2025 年七月又加上 [GPU Memory Snapshots](https://modal.com/blog/gpu-mem-snapshots)，目前仍是 alpha，連 GPU 記憶體、CUDA context 與 `torch.compile` 編好的產物一起存。官方部落格給的例子是 vLLM 跑 `Qwen2.5-0.5B-Instruct`，冷啟動從 45 秒降到 5 秒（Modal 自家量測，非第三方）。

但這個功能的限制寫得比效果還長，而且都在正式文件裡：多 GPU 程式基本上不相容、非 CUDA 的 GPU 程式會失敗、`torch.compile` 有時會讓快照建立失敗（要設 `TORCHINDUCTOR_COMPILE_THREADS=1`）。最值得記的是這句——

> 如果你大部分的初始化延遲花在載入權重上，GPU Memory Snapshots 通常不會改善冷啟動，甚至可能因為額外開銷而更慢。

**怎麼做**：開快照之前先量一次，把冷啟動時間拆成「讀權重」與「其他」。如果讀權重佔大頭，該做的是[把權重先烘進 Image 或 Volume](https://modal.com/docs/guide/model-weights)，不是開快照。

## 六、第三個判準：agent 要跑不可信的程式碼

前兩個判準都在比成本。這一個不是——它是**有沒有**的問題。

當你的 agent 會執行模型生成的 shell 指令，本機執行就不再是選項。Modal 自己的[教學文](https://modal.com/blog/building-with-modal-and-the-openai-agent-sdk)把這件事講得很直白，示範了兩行足以毀掉開發機的 prompt：一個是 `rm -rf /`，一個是把 `.env` 裡的金鑰 POST 到外部網站。這一層買的不是速度，是「模型看到的是 sandbox 而不是你的檔案系統」。

這也是為什麼 sandbox 突然變成一個有七家供應商的市場。[OpenAI Agents SDK 的 sandbox client 文件](https://openai.github.io/openai-agents-python/sandbox/clients/)列了原生支援的託管後端：Blaxel、Cloudflare、Daytona、E2B、Modal、Runloop、Vercel。Modal 在這份文件裡的特殊之處是它單獨有一節談資源配置（`cpu`、`memory`），而 `ModalSandboxClientOptions` 的[原始碼](https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/extensions/modal_runner.py)確實有 `gpu` 欄位可以指定 `"A100"` 或 `"H100:8"`。Modal 自稱掛 GPU「是 Modal 獨有的能力」——這是廠商說法，我沒有逐家翻另外六家的原始碼確認。

價格上，agent sandbox 這條線不便宜。Modal 的 sandbox 對 CPU 與記憶體收的是一般 Function 的三倍，GPU 則同價。拿一個 2 vCPU、4 GiB 的 sandbox 跑一小時，對照 [E2B](https://e2b.dev/pricing) 的同規格：Modal $0.24、E2B $0.17。**Modal 貴四成四，換到的是同一個 API 底下能掛 H100。** 如果你的 agent 只是跑測試跟 lint，那四成四就是純粹的浪費。

同一層的競爭還在往下打價格。[Cloudflare 在 2026-04-13 讓 Sandboxes GA](https://blog.cloudflare.com/sandbox-ga/)，同時改成只對「實際使用的 CPU 週期」計費——理由寫得很精準：agent 大部分時間是在等 LLM 回話，那段不該收錢。它標配的併發額度是 15,000 個 lite 實例。

## 七、誠實面

**鎖定是真的。** `@app.function(gpu="H100")` 這個寫法很舒服，但它不是任何標準。你的 autoscaling、快照、Volume、Secret 全部長在 Modal 的抽象上，換供應商等於重寫部署層。相對地，[vLLM 那條路](/posts/ai/2026-08-21-vllm-self-host-decision)交付的是一個 OpenAI 相容的 HTTP server，搬到哪家都能跑。

**沒有自架版本。** 客戶端與 CLI 開源，平台不開源。合規上只能靠 SOC 2 Type 2 與 Enterprise 方案的 BAA，不能靠「跑在我自己的機房」。而且 HIPAA 的 BAA 有明確的除外範圍：Volumes v1、Images、Memory Snapshots 與使用者程式碼都不在承諾內。

**併發上限比行銷詞小。** [官方文件](https://modal.com/docs/guide/scale)寫的是單一 Function 硬上限 4,000 個併發容器；工作區層級的額度 Starter 方案是 100 個容器、10 個 GPU 併發，Team 方案 5,000 個容器、50 個 GPU 併發，再上去要談 Enterprise。「同時跑數百萬個 sandbox」是 C 輪公告裡的**未來規劃**，不是你註冊完就有的額度。這兩個數字差了三個量級，看的時候要分清楚。

**快照會過期。** [Filesystem / Directory Snapshot 預設 30 天](https://modal.com/docs/guide/sandbox-snapshots)、Memory Snapshot 固定 7 天且目前不能延長。v1.5（Python）之前 Filesystem Snapshot 是永久保存的，這是個會咬人的破壞性變更——如果你把 snapshot 當成長期環境庫在用，要顯式傳 `ttl=None`。

## 整體來說

Modal 的核心取捨是：**用一層專有抽象和三到五成的價格溢價，換掉整個 GPU 基礎設施團隊的工作。**

適合的情況很好認：流量尖峰突兀、GPU 使用率長期低於五成、團隊裡沒有人想維護 autoscaler，或者你在做 agent 而且需要 GPU sandbox——最後這一項目前沒什麼替代品。

不適合的情況同樣好認：GPU 幾乎全天打滿（去找 RunPod 或 Lambda 的長約），或者你的 sandbox 只需要跑測試跟 lint（E2B、Cloudflare Sandboxes 更便宜），或者合規要求程式碼不能離開自家機房（這條直接把 Modal 排除）。

最後一句給選型的人：這篇的比價表在三個月後大概就不準了。**真正該記住的不是數字，是那個算式——你的使用率乘上 Modal 的價，跟對手的整月價比。** 這個算式不會過期。

## 參考資料

- [Modal 官網定價頁](https://modal.com/pricing)（2026-08-21 實查：GPU 每秒價、Sandbox 三倍加價、方案併發額度）
- [Modal's Series C: Raising $355M at a $4.65B valuation（官方部落格，2026-05-21）](https://modal.com/blog/modal-series-c)（營收、10 億 sandbox、sandbox 佔營收比、Ramp Inspect 70% PR）
- [Exclusive: Modal Labs valued at $4.65 billion as AI coding takes off（Reuters）](https://finance.yahoo.com/sectors/technology/articles/exclusive-modal-labs-valued-4-170258984.html)（兩段式 tranche、6,000 萬→3 億美元年化營收）
- [Modal Sandboxes 官方文件](https://modal.com/docs/guide/sandbox)（生命週期、預設五分鐘 / 最長 24 小時、readiness probe）
- [Modal Sandbox Snapshots 文件](https://modal.com/docs/guide/sandbox-snapshots)（30 天 / 7 天 TTL、v1.5 破壞性變更）
- [Modal Cold start performance 文件](https://modal.com/docs/guide/cold-start)（scaledown_window 範圍、暖機參數）
- [Modal Memory Snapshots 文件](https://modal.com/docs/guide/memory-snapshot)（GPU 快照限制、載入權重不受益那段引文）
- [GPU Memory Snapshots: Supercharging sub-second startup（Modal 部落格，2025-07-30）](https://modal.com/blog/gpu-mem-snapshots)（vLLM 45s→5s、CUDA checkpoint API、gVisor 整合）
- [Modal Scaling out 文件](https://modal.com/docs/guide/scale)（4,000 併發容器硬上限、autoscaler 四參數）
- [Modal GPU acceleration 文件](https://modal.com/docs/guide/gpu)（可選卡別、H100→H200 自動升級、多卡限制）
- [Modal Security and privacy 文件](https://modal.com/docs/guide/security)（gVisor、SOC 2 Type 2、HIPAA BAA 除外範圍、資料保留表）
- [Building with Modal and the OpenAI Agents SDK（Modal 部落格，2026-04-15）](https://modal.com/blog/building-with-modal-and-the-openai-agent-sdk)（不安全 prompt 示範、GPU sandbox 自稱獨有、filesystem snapshot 分支）
- [Sandbox clients — OpenAI Agents SDK 文件](https://openai.github.io/openai-agents-python/sandbox/clients/)（七家託管後端清單、Modal 資源配置一節）
- [openai-agents-python modal_runner.py 範例原始碼](https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/extensions/modal_runner.py)（`ModalSandboxClientOptions` 的 `gpu` 欄位）
- [RunPod 定價頁](https://www.runpod.io/pricing)（2026-08-21 實查：Pod 與 Serverless 每小時價）
- [Lambda GPU Cloud 定價](https://lambda.ai/service/gpu-cloud#pricing)（2026-08-21 實查：H100 / A100 / B200 隨需價）
- [E2B 定價頁](https://e2b.dev/pricing)（2026-08-21 實查：每秒 vCPU 與記憶體費率、方案併發上限）
- [E2B Sandbox lifecycle 文件](https://e2b.dev/docs/sandbox)（1 小時 / 24 小時上限、pause & resume）
- [Agents have their own computers with Sandboxes GA（Cloudflare 部落格，2026-04-13）](https://blog.cloudflare.com/sandbox-ga/)（Active CPU Pricing、15,000 併發 lite 實例、快照與 R2）
- 站內相關：[vLLM：自架推論服務的預設選擇](/posts/ai/2026-08-21-vllm-self-host-decision)、[vLLM 技術細節](/posts/ai/2026-03-14-vllm-inference-engine)、[企業內部 AI coding agent](/posts/ai/2026-04-04-internal-ai-coding-agents)、[Hermes agent 的終端後端比較](/posts/ai/2026-08-18-hermes-agent-terminal-backends)

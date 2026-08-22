---
title: "vLLM：自架推論服務的預設選擇，以及它什麼時候是過度工程"
date: 2026-08-21
category: ai
type: deep-dive
tags: [vllm, llm-inference, self-hosting, gpu, pagedattention, cost]
lang: zh-TW
tldr: "vLLM 是自架 LLM 推論的事實標準（GitHub 89,470 stars，2026-08-21 實查），核心是把 KV cache 當作業系統的分頁來管。但選型的關鍵不在它多快，在你的 GPU 使用率：以 Red Hat 實測的每秒 793 個輸出 token 換算，一張打滿的 A100 約 $0.70 / 百萬輸出 token，使用率掉到一成就變 $7——比多數雲端 API 貴。"
description: "從選型角度介紹 vLLM：PagedAttention 與 continuous batching 解決的是什麼問題、自架與雲端 API 的成本門檻怎麼算、同一層的 SGLang 怎麼比，以及什麼情況下自架推論服務是過度工程。"
series:
  name: "AI 時代的技術選擇"
  order: 11
draft: false
---

🌏 [English version](/posts/ai/2026-08-21-vllm-self-host-decision-en)

這個系列到目前為止談的都是應用層：路由、驗證、文件格式。這篇往下鑽一層，到自架推論服務——這一層直接決定你自己跑模型的成本與延遲，而且是少數「選錯會在帳單上看到」的決定。

[vLLM](https://github.com/vllm-project/vllm) 是這一層的預設答案。它是一個開源的 LLM 推論與服務引擎：你給它一個 Hugging Face 上的模型名字，它起一個 OpenAI 相容的 HTTP server，把你 GPU 上的記憶體與算力盡量榨乾。專案出自 UC Berkeley 的 Sky Computing Lab，現在由 [PyTorch Foundation 託管](https://pytorch.org/blog/pytorch-foundation-welcomes-vllm/)，GitHub 上 89,470 stars。

站上已經有一篇[偏使用面的 vLLM 介紹](/posts/ai/2026-03-14-vllm-inference-engine)，講 PagedAttention 的細節、V1 引擎、怎麼起 server。這篇不重複那些，只回答選型的三個問題：**我該自架嗎、該用 vLLM 嗎、什麼時候不該。**

本文的版本號、價格與 stars 數皆為 2026-08-21 實查，測法與出處集中在文末附錄。

## 兩個機制，一句話講完

vLLM 賣的不是「模型跑得比較快」——同樣的模型、同樣的權重、同樣的 GPU，單一請求的速度差不了太多。它賣的是**同一張卡能同時服務多少人**。兩個機制在做這件事。

**PagedAttention** 治的是記憶體浪費。生成過程中每個請求都要存 KV cache，但你事先不知道它會生成多長。傳統做法只能按最大長度預先切一整塊連續記憶體，[PagedAttention 論文](https://arxiv.org/abs/2309.06180)（arXiv:2309.06180）量過當時系統的下場：那塊記憶體裡真正存著 token 的不到四成，其餘全是預留與碎片。

解法直接抄作業系統：把 KV cache 切成固定大小的 block，用一張 block table 做間接定址，實體位置可以散在記憶體各處。省下來的記憶體換成更大的 batch，論文自測的吞吐量比當時的 FasterTransformer 與 Orca 高 2–4 倍。

**Continuous batching** 治的是排隊浪費。傳統靜態批次要等一整批都生成完才換下一批，短請求只能陪著長請求空轉。改成每次 forward pass 都能插入新請求、完成的立刻移出，GPU 就不必等人。

Anyscale [量過這件事](https://www.anyscale.com/blog/continuous-batching-llm-inference)：在他們模擬的線上負載上，continuous batching 加上 vLLM 的記憶體最佳化，相對樸素批次最高有 23 倍差距。這是 Ray 團隊自己的測量，不是中立第三方。

兩個機制都有代價，論文自己寫了：PagedAttention 的間接定址讓 attention kernel 的延遲比高度最佳化的 FasterTransformer 高 20–26%。這筆帳划算，是因為它只影響 attention 這一個運算子，換來的 batch size 提升遠大於它。

## 決策一：自架划算嗎

這是最該先算、卻最常被跳過的一題。先看兩邊的市價：

| 項目 | 價格 |
|---|---|
| A100 SXM 40GB 隨用隨付（[Lambda](https://lambda.ai/service/gpu-cloud#pricing)） | $1.99 / GPU / 小時 |
| H100 SXM 80GB 隨用隨付（[RunPod](https://www.runpod.io/pricing)） | $3.29 / 小時 |
| gpt-oss-120B serverless（[Together AI](https://www.together.ai/pricing)） | $0.15 輸入 / $0.60 輸出，每百萬 token |
| Llama 3.3 70B serverless（Together AI） | $1.04 / 百萬 token |
| Qwen3.5 9B serverless（Together AI） | $0.17 輸入 / $0.25 輸出 |

再看一個實測吞吐量。Red Hat 在單張 A100 上跑一個 8B 模型，vLLM 的峰值是[每秒 793 個輸出 token](https://developers.redhat.com/articles/2025/08/08/ollama-vs-vllm-deep-dive-performance-benchmarking)。

把它跟表上的時租相除：一張全速運轉的卡每小時產出約 285 萬個輸出 token，等於**每百萬輸出 token 約 $0.70**。這是本站的算術，不是任何來源的宣稱，算式與假設在附錄。

這個數字有兩層意義，第二層才是重點。

第一層：$0.70 已經不比 Together 上的 serverless 便宜。同一份價目表上，一個小模型的輸出價是 $0.25，一個 MoE 大模型是 $0.60。也就是說，**在小模型這一段，自架就算把卡打到全滿，價格優勢也不明顯。**

第二層：$0.70 是理論下限，前提是那張卡二十四小時滿載。真實的內部服務不會這樣——白天忙、晚上空、週末幾乎沒人用。

GPU 是按小時計費，不是按 token 計費。使用率掉到一成，每 token 成本就乘以十，變成 $7 一百萬 token，比表上任何一個 serverless 選項都貴一個數量級。而 serverless API 的閒置成本是零。

**怎麼做**：在買卡或開機器之前，先估一個數字——你的服務一天實際會生成多少個輸出 token。用它除以 285 萬（或你自己測到的每小時吞吐量），得到「需要幾張卡·小時」。如果答案遠小於 24，你要付的是閒置費，不是推論費。這一題不需要跑任何 benchmark，一張紙就能算完。

## 決策二：錢以外的三個理由

自架不划算不代表不該做。有三種情況即使貴也要自架，而且它們通常才是真正的動機。

**資料不能出去。** 合規、客戶合約、內部規範說推論不能送到第三方，這一題就沒得討論了。

**你要跑的東西 API 上沒有。** 自己微調的模型、自己訓的 LoRA、需要改 sampling 或接非標準 decoding 的實驗。vLLM 支援多 LoRA 同時掛載，這是託管 API 通常不給你的。

**你要的是延遲的可預測性，而不是平均延遲。** 這點值得展開，因為它跟直覺相反。Red Hat 那組測試同時記了一件對 vLLM 不利的事：併發超過十六之後，vLLM 的 token 間延遲開始上升，反而是 Ollama 穩定且低。

原因是 Ollama 用節流把同時處理的請求壓在很小的數量，代價是新請求排隊排很久。峰值吞吐時的首 token 延遲，Ollama 是 673 毫秒，vLLM 是 80 毫秒（皆取 P99）。

兩種取捨都合理，但你要知道自己選的是哪一種。vLLM 的預設立場是「盡量把所有人都塞進 batch」，個別使用者的逐字輸出速度會隨負載變慢。

## 決策三：這一層裡選哪個

推論服務層現在真正的選擇不多。

| 引擎 | 定位 | Stars（2026-08-21） |
|---|---|---|
| [vLLM](https://github.com/vllm-project/vllm) | 生產級 GPU serving，硬體覆蓋最廣 | 89,470 |
| [SGLang](https://github.com/sgl-project/sglang) | 生產級 GPU serving，大規模部署為重 | 32,194 |
| [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide) | 本機開發與單人使用 | — |

Ollama 那條線最好判斷：它跟 vLLM 不是競爭關係，是流程上的前後段。本機開發、單人聊天、快速試模型用 Ollama；要服務多人就換 vLLM。Red Hat 那份測試的結論也是這樣寫的。

vLLM 與 SGLang 之間的差距則小到不該用「哪個比較快」來決定。兩者都是 Apache 授權、都在 PyTorch 生態底下、都對新模型做 day-0 支援。它們互相參考彼此的設計，vLLM V1 的[發表文](https://blog.vllm.ai/2025/01/27/v1-alpha-release.html)自己就在致謝裡列了 SGLang。

真正有意義的判準是覆蓋面而不是峰值。vLLM 官方文件列的支援範圍包含 200 種以上的模型架構，硬體則從 NVIDIA、AMD、Intel 的 GPU 與 CPU，延伸到 TPU、Gaudi、Ascend 等外掛式後端。

除非你手上有特定硬體或特定模型只有一邊支援，先選採用度大的那個，出事比較有人回答。這也是這個系列反覆用的判準。

## 誠實面：什麼時候 vLLM 是過度工程

PagedAttention 論文的討論一節有一段被引用得很少、但對選型最有用的話。分頁之所以在 LLM serving 有效，是因為這個工作負載有兩個特徵：**輸出長度事先不知道**，而且**效能被 GPU 記憶體容量卡住**。

作者明講這兩個前提不是所有 GPU 工作負載都成立。反例就在隔壁：深度學習訓練的 tensor 形狀是靜態的，記憶體配置可以事先最佳化，分頁沒有用武之地。

把這句話反過來讀，就是 vLLM 的適用邊界。以下情況它的核心機制都在空轉：

- **併發低。** 一次只有一兩個請求時，continuous batching 沒有東西可以填，PagedAttention 省下的記憶體也沒有第二個請求來用。這是本機開發與內部小工具的常態。
- **輸出長度固定且短。** 分類、抽取、打標這類每次只吐幾個 token 的任務，碎片本來就不多。
- **流量是尖峰式的批次。** 一天跑一次的離線批次處理，用 serverless API 或按需開關的機器都比養一台常駐 GPU 划算。

再加上自架的隱性成本：GPU 驅動與 CUDA 版本、模型權重的下載與存放、OOM 與排隊參數的調校、監控，以及升級。

最後一項最容易被低估。vLLM 的迭代速度很快，光是最近的 v0.27.0 一版就包含 561 個 commit，其中還夾帶 PyTorch 大版本升級這種會弄壞環境的變更。這些都要有人維護。

**怎麼做**：把「自架」當成一個要付人力的專案來估，而不是一個技術選項。如果你們沒有人願意掛名負責這台服務的升級與值班，那答案是不要自架——這比任何 benchmark 都更能預測結果。

## 整體來說

vLLM 在推論服務層的地位已經沒有懸念：它是採用度最大、硬體覆蓋最廣、被基金會託管的那一個，要自架就從它開始，剩下的選項要有具體理由才動。但這一層真正的選型難題不在引擎，在**你到底該不該站在這一層**。

推論服務的成本結構跟應用層的套件選型完全不同：套件選錯了你付的是重構成本，推論架構選錯了你每個月都在付閒置的 GPU 錢。而決定成敗的變數既不是 PagedAttention 也不是 continuous batching，是那張卡有多少時間真的在算東西。先把使用率估出來，再決定要不要打開這一層。

## 附錄：數字的出處與測法

- **Red Hat 的 793 TPS**：GuideLLM 0.2.1，OpenShift 4.17.15，單張 NVIDIA A100-PCIE-40GB，vLLM 0.9.1 對 Ollama 0.9.2，模型為 Llama 3.1 8B（Ollama 側是 fp16 版），固定的 prompt-response 資料集，併發 1 到 256，每個併發等級跑 300 秒，TTFT 與 ITL 取 P99。文章發表於 2025-08-08，頁面標示最後更新 2026-07-13。**Red Hat 銷售以 vLLM 為核心的 Red Hat AI Inference Server，這是有商業立場的一方所做的測量**，該文結尾即為此產品的推廣連結。
- **每百萬輸出 token $0.70**：本站的算術，非任何來源的宣稱。793 × 3600 ÷ 1,000,000 ≈ 2.85（百萬 token / 小時），$1.99 ÷ 2.85 ≈ $0.70。假設 GPU 100% 滿載、只計輸出 token、忽略儲存與網路費用，且直接沿用 Red Hat 在 A100-40GB 上的吞吐量搭配 Lambda 的 A100 40GB 牌價。實際數字會因模型、序列長度與硬體而異，這個算式的用途是「量級」而不是「報價」。
- **2–4 倍與 20–26%**：均出自 PagedAttention 論文自身的評估（對照組為 FasterTransformer 與 Orca，硬體為 A100，模型為 OPT 系列與 LLaMA），非第三方複現。
- **23 倍**：Anyscale（Ray 團隊）2023-06-22 的量測，負載為他們自行模擬的線上推論流量，對照組是樸素靜態批次。
- **價格**：Lambda、RunPod、Together AI 的公開牌價頁面，2026-08-21 取得，未含稅、未計任何長約折扣。

## 參考資料

- [Efficient Memory Management for Large Language Model Serving with PagedAttention（arXiv:2309.06180）](https://arxiv.org/abs/2309.06180) — 讀了 abstract、§1 Introduction、§2 Background、§7.1 kernel microbenchmark、§7.3 recomputation vs swapping、§8 Discussion；記憶體浪費比例、2–4 倍吞吐、20–26% kernel 延遲、以及分頁的適用前提都出自這裡
- [vLLM 官方文件](https://docs.vllm.ai/en/latest/) — 支援的模型架構數量與硬體後端清單
- [vLLM GitHub repository](https://github.com/vllm-project/vllm) — stars 數、README 的功能清單與硬體支援
- [vLLM Releases](https://github.com/vllm-project/vllm/releases) — v0.27.1 的發布日期、v0.27.0 的 commit 與貢獻者數、PyTorch 2.13 升級
- [vLLM V1: A Major Upgrade to vLLM's Core Architecture](https://blog.vllm.ai/2025/01/27/v1-alpha-release.html) — V1 重寫的範圍，以及致謝中對 SGLang 等引擎的引用
- [PyTorch Foundation Welcomes vLLM as a Hosted Project](https://pytorch.org/blog/pytorch-foundation-welcomes-vllm/) — 治理歸屬與時間點
- [Ollama vs. vLLM: A deep dive into performance benchmarking（Red Hat）](https://developers.redhat.com/articles/2025/08/08/ollama-vs-vllm-deep-dive-performance-benchmarking) — 793 TPS、P99 TTFT 80ms vs 673ms、併發 16 之後 ITL 上升的取捨
- [How continuous batching enables 23x throughput in LLM inference（Anyscale）](https://www.anyscale.com/blog/continuous-batching-llm-inference) — continuous batching 的機制說明與 23 倍的來源
- [SGLang GitHub repository](https://github.com/sgl-project/sglang) — stars 數與近期支援時程
- [Lambda GPU Cloud 定價](https://lambda.ai/service/gpu-cloud#pricing) — A100 / H100 / B200 牌價
- [RunPod 定價](https://www.runpod.io/pricing) — H100 / A100 / L40S 牌價
- [Together AI 定價](https://www.together.ai/pricing) — serverless 每百萬 token 價格
- 站內相關：[vLLM — 從 PagedAttention 到生產級 LLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine)、[Ollama 本機 LLM 指南](/posts/ai/2026-03-14-ollama-local-llm-guide)、[AI 時代的技術選擇系列導讀](/posts/tech/2026-08-21-ai-era-tech-choices-guide)

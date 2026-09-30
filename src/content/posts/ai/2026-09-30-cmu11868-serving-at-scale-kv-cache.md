---
title: "CMU 11-868 大規模服務：prefill／decode 拆分、KV cache 與異質硬體"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, llm-inference, model-serving, kv-cache, gpu]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 21
tldr: "11-868 最後一組講義有五份：DistServe 的 Hao Zhang、NVIDIA Dynamo 的 Vikram Mailthody、LMCache 的 Junchen Jiang、Mooncake／KTransformers 的 Mingxing Zhang，加上 Lei Li 的框架地圖。它們回答同一個問題：服務規模從一台機器擴到一座資料中心之後，算力和 KV cache 要放在哪裡。主線有三步：量尺從 throughput 換成符合 SLO 的 goodput；prefill 與 decode 拆到不同 GPU；KV cache 從 GPU 記憶體擴張到 CPU、SSD 與遠端儲存。"
description: "CMU 11-868 LLM Systems（Spring 2026）L26–L30 導讀：goodput 與 TTFT／TPOT、DistServe 的 prefill／decode 拆分與放置演算法、NVIDIA Dynamo 的 KV-aware router、Planner 與 NIXL、LMCache 與 CacheGen／CacheBlend、Mooncake 的 KVCache 中心架構與 KTransformers 的 CPU／GPU 混合推論，以及 App Stack 講義的服務框架地圖。附五份講義的日期與排課狀態。"
draft: false
glossary:
  - term: "goodput"
    aliases: ["有效吞吐量"]
    definition: "每秒完成、而且同時滿足延遲 SLO（例如 TTFT 與 TPOT 上限）的請求數。跟 throughput 的差別在於超時的請求不算數。"
    context: "DistServe 講義第 32–34 頁用「throughput 10 rps、goodput 只有 3 rps」說明高吞吐量系統仍可能使用者體驗很差。"
  - term: "prefill／decode 拆分"
    aliases: ["disaggregated serving", "P/D disaggregation", "PD 分離"]
    definition: "把處理整段輸入的 prefill 階段與逐 token 生成的 decode 階段放到不同 GPU 執行，中間傳遞 KV cache，讓兩階段各自選平行策略與資源量。"
    context: "11-868 的 L26（Dynamo）、L28（Mooncake）、L29（DistServe）三份講義都以它為核心。"
  - term: "TTFT／TPOT"
    aliases: ["time to first token", "time per output token"]
    definition: "TTFT 是請求送出到第一個輸出 token 的時間，主要由 prefill 決定；TPOT 是之後相鄰兩個輸出 token 的平均間隔，由 decode 決定。"
    context: "DistServe 講義以聊天機器人（TTFT 要快）與摘要（TTFT 可以慢）說明不同應用的 SLO 不同。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache-en)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。材料是 [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 上的五份講義 PDF，事實都在 2026-09-30 打開原檔核對，引用處標頁碼。其中兩份有排日期：4/20 與 4/22。另外三份掛在 Syllabus 底部的未排日期區，春季不一定真的上過。存取等級 **A3**：講義全部公開。缺的是錄影，春季與秋季都沒有，客座講者口頭補充的內容讀不到。

**系列位置**：上一篇 [HW6：DeepSpeed ZeRO＋LoRA 訓練，SGLang 推論](/posts/ai/2026-09-30-cmu11868-hw6-training-inference-systems)｜下一篇 [RLHF 系統與 HW7](/posts/ai/2026-09-30-cmu11868-hw7-rlhf-systems)｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

[上上篇](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm)講的是一台推論伺服器內部的事：continuous batching、PagedAttention、RadixAttention。這一篇把鏡頭拉遠。請求來自成千上萬的使用者，GPU 分布在好幾個機櫃，KV cache 多到 GPU 記憶體裝不下。這時候要回答的問題變成：**算力和 KV cache 要怎麼安排，才能在延遲要求內服務最多請求？**

五份講義的講者分別來自學界、NVIDIA、開源專案與中國的 LLM 服務公司，角度差很多。本文按論證順序重排，不照檔案編號。

## 五份講義一覽

| 編號 | 講題（Syllabus 標題） | 講者 | 日期 | 頁數 | Syllabus 列的 reading |
|---|---|---|---|---|---|
| [L26](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-26-dynamo-vikram_mailthody-0ddbeb69382d5c168b6d4636a82185d0.pdf) | Serving with Disaggregated Prefill-Decoding | Vikram Sharma Mailthody（NVIDIA Research） | 4/20 | 46 | DistServe |
| [L27](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-27-LMCache_junchenjiang-c21828fe582270cb5e08b4a21a002956.pdf) | Better KV Cache for LLM Serving | Junchen Jiang | 4/22 | 51 | CacheGen、CacheBlend |
| [L28](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-28-mooncake-kTransformer-1243bfbecbb0c3610bf95eac030acb2a.pdf) | LLM Serving on Heterogeneous Hardware | Mingxing Zhang（KVCache.AI） | 未排 | 70 | Mooncake、kTransformer |
| [L29](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-29-disaggregating_prefill_decode_hao_zhang-c0e55139d20512a2348783423397cc7f.pdf) | DistServe: Disaggregated Prefill-Decoding | Hao Zhang（UCSD） | 未排 | 68 | DistServe |
| [L30](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-30-serving-c4a70ab21cde01fb60068a256c6e163a.pdf) | App Stack and Model Serving | Lei Li | 未排 | 49 | Triton、LightLLM |

有一個小落差要先知道：4/20 的 Syllabus 標題與 reading 都是 DistServe，掛的投影片卻是 NVIDIA 講者的 Dynamo 講義，封面題目是「Inference at Scale: Opportunities and challenges」。DistServe 的第一手講法在未排日期的 L29。

建議的讀法：先讀 L29 建立觀念，再讀 L26 看產品怎麼做，然後 L27 與 L28 看 KV cache 的儲存。L30 最後當作地圖翻。

## 先換一把尺：從 throughput 到 goodput

單機服務的章節多半在追 throughput。L29 第 31 頁先指出，不同應用在意的延遲不一樣。它用兩個指標描述延遲：

- **TTFT**（time to first token）：聊天機器人要快。
- **TPOT**（time per output token）：要跟得上人的閱讀速度。

同一頁的對照是摘要任務：使用者比較能忍受第一個字慢一點出來。

第 32–34 頁接著區分兩個量。throughput 是每秒完成多少請求。goodput 只算在 SLO 內完成的請求。講義舉的例子是一個系統 throughput 有 10 rps，符合 SLO 的只有 3 rps。高吞吐量不等於好的使用者體驗。

L26 第 26–27 頁用同一組定義講成本：throughput 近似「每個請求的成本」，goodput 近似「每個**合格**請求的成本」。整組講義後面所有的設計，目標都是 goodput per GPU。

## 為什麼要把 prefill 與 decode 拆開

**場景**：一台 GPU 同時跑很多請求，其中一個長 prompt 剛進來。

**直覺**：prefill 一次處理整段輸入，是大矩陣乘法。decode 每步只處理一個 token，矩陣乘法退化成矩陣乘向量（L29 第 10 頁、L26 第 17 頁）。L29 第 36 頁的說法是：一個 prefill 就能吃滿算力，是 compute-bound；decode 是 memory-bound，要把很多請求批在一起才吃得滿算力。

**機制**：把兩種工作放在同一張卡上 continuous batching，會出現兩個問題（L29 第 37–41 頁）：

1. **互相干擾**：新請求的 prefill 插進來，正在 decode 的請求就要等，TPOT 變差；反過來也會拖慢 prefill。想同時滿足兩種 SLO，只能多買 GPU。
2. **平行策略被綁在一起**：TTFT 很緊、TPOT 寬鬆的應用，prefill 和 decode 想要的 TP／PP 配置不同，同一組 GPU 只能選一種。

拆開之後，prefill 實例只管 TTFT，decode 實例只管 TPOT，兩邊各選最適合的平行策略與 GPU 數（第 44 頁）。第 45–47 頁的示意是：2 張卡做 prefill、1 張卡做 decode（2P1D），每張 GPU 的 goodput 就是單卡混跑的兩倍。

**代價**：KV cache 要從 prefill 實例傳到 decode 實例；每張 GPU 的 goodput 同時受工作負載、SLO、平行策略、資源配置與網路頻寬影響，不好最佳化（第 48 頁）。

<details>
<summary>DistServe 怎麼決定放置方式（L29 第 50–56 頁）</summary>

講義把問題寫成「XPYD」：給定工作負載，要決定 X 個 prefill 實例、Y 個 decode 實例，並且讓兩者之間的 KV cache 傳輸最少。放置包含三件事：每種實例的平行策略、各部署幾個、放到叢集的哪些實體位置。

- **節點間頻寬高**（例如 InfiniBand）：兩階段可以分開最佳化。用模擬量出某個平行配置的 goodput，各自找最佳配置，再用複製份數去對應整體流量。
- **節點間頻寬低**：KV cache 只會在同一層之間傳，所以把 prefill 與 decode 的同一個 stage 限制在同一台機器內，走 NVLink。

第 55 頁估算 KV cache 傳輸的代價：以 175B 模型、A100 為例，即使走 PCIe，傳輸延遲也小於一個 decode 步驟。第 56 頁的評估是相對原版 vLLM 2.0–4.48 倍，依應用而異（聊天 2.0–3.4 倍、程式補全 3.2 倍、摘要 4.5 倍）。[DistServe 論文](https://arxiv.org/abs/2401.09670)摘要用的是另一種量法：在延遲限制內可服務的請求多 7.4 倍，或 SLO 可以收緊 12.6 倍。
</details>

第 57 頁回答一個常見疑問：從 continuous batching 走到拆分，是不是走回頭路？講者說不是。continuous batching 解的是 GPU 利用率，也就是 throughput；拆分解的是 goodput。而且「做完就退出、新請求盡快補上」這個洞見在拆分架構裡照樣適用。

第 58 頁補了一段歷史：DistServe 2023 年底在 Hao Zhang 的 UCSD 實驗室發表並開源，同期有一個不開源的 Microsoft 工作（L26 第 35 頁的圖註寫的是 Splitwise）。2024 年開源整合比 PagedAttention 慢，但大公司已經悄悄換成拆分架構；2025 年 DeepSeek-V3 用了 prefill／decode 拆分，兩邊各自用不同的平行配置（第 66 頁）。

## 從論文到產品：NVIDIA Dynamo

L26 是 NVIDIA 研究員的講義，前半段先講「AI 工廠」：用 xAI 十萬張 GPU 的叢集說明電力、散熱、網路才是限制（第 5–10 頁）。第 12–15 頁把推論和訓練對比：訓練是一個中央協調的大工作；推論是很多小工作，需要快速擴縮。

之後介紹 [Dynamo](https://github.com/ai-dynamo/dynamo) 的元件。它把拆分式服務當成其中一個功能，不是全部（第 36 頁）：

| 元件 | 做什麼 | 頁碼 |
|---|---|---|
| Disaggregated serving | prefill 與 decode 分到不同 GPU、各自選平行策略 | 34–35 |
| KV-aware router | 把請求送到 KV cache 命中率高的 worker；引用 Baseten 在 Qwen3 480B 上 TTFT 快 2 倍的案例 | 37 |
| Planner | 依 TTFT／TPOT 的 SLA 即時擴縮 prefill 與 decode 的數量 | 38 |
| AIConfigurator | 離線在筆電上搜尋拆分式服務的最佳配置，產出部署用的 yaml | 39 |
| KV 記憶體分層 | G1 HBM、G2 主機記憶體、G3 本機 SSD、G4 網路儲存 | 40 |
| NIXL | 跨節點、跨記憶體類型傳 KV cache 的函式庫，後端可接 UCX、Mooncake、GDS 等 | 41 |
| Grove | 在 Kubernetes 上依拓撲把 prefill、decode 當成不同的擴縮群組 | 42 |
| 容錯 | 請求取消、token 層級的請求遷移、共享 router 狀態的自動重啟 | 43 |

KV-aware router 與 Planner 的數字都是講義引用的合作廠商案例，不是論文實驗，讀的時候要分清楚。第 44 頁列的開放問題值得當專題題目看：大規模部署的效能量測與故障注入工具幾乎不存在；多模型共存的 agentic 工作負載也少有人研究。

## KV cache 變成一種資料：LMCache、CacheGen、CacheBlend

L27 的講者是 [LMCache](https://github.com/LMCache/LMCache) 的作者，封面標題叫「KV Cache: A New AI Memory Abstraction」。他的論證是：KV cache 多到不可能只放在 GPU 裡，所以它應該被當成一種要儲存、壓縮、傳輸的資料來管理。

第 8 頁的估算：一張 MI300X 跑 DeepSeek R1（FP16），一天產生約 15 TB 的 KV cache。第 11 頁畫出 KV cache 的位置從 2023 年只放在 GPU 記憶體，一路往 CPU 記憶體、SSD、遠端儲存擴張。儲存它的理由是省錢。第 9 頁引用一個成本試算：只要約 1% 的請求命中快取，儲存成本就划得來。

存下來之後有兩個研究問題，分別由 Syllabus 列的兩篇論文回答：

- **非前綴的 KV cache 怎麼重用（[CacheBlend](https://arxiv.org/abs/2405.16444)）**。prefix caching 只能重用開頭一模一樣的部分。RAG 塞進好幾段檢索文件時，第二段文件的 KV cache 沒算到它和第一段之間的 cross-attention，直接拼起來品質會掉（第 18–19 頁）。CacheBlend 每層只挑少數 token 重算 KV，把 cross-attention 補回來（第 20–22 頁）。論文摘要報告 TTFT 比完整重算快 2.2–3.3 倍，品質不降。
- **KV cache 太大，怎麼傳得快（[CacheGen](https://arxiv.org/abs/2310.07240)）**。KV cache 是一個巨大的 3-D 張量。第 27–28 頁的想法是：如果目的是存或傳，就不必維持張量形狀，可以像壓縮影片一樣編碼：依層、頭、token 做不同強度的量化；相鄰 token 的值很像，就只存差值；最後做算術編碼。論文摘要報告 KV cache 縮小 3.5–4.3 倍。

第 32–33 頁講 LMCache 自己的設計選擇：現有的 KV cache 函式庫都跑在推論引擎（vLLM、SGLang）的程序裡，會拖慢推論，也很難改。LMCache 改成獨立的 KV cache 管理服務，讓推論引擎、儲存廠商和研究者都接同一層。

最後一節「Lessons」是這份講義最有意思的地方（第 44–48 頁）：

- LLM 推論的技術堆疊正在分出層次：應用、推論協調器、KV cache 資料層、推論引擎，對應作業系統的使用者程式、排程器、檔案系統、處理器。
- OpenAI API 成了事實上的窄腰，像網路的 IP 層。好處是換供應商容易；壞處是應用層資訊（哪段輸入會重用、哪段輸出不會再用）傳不下來，很多研究點子可能因此無法落地。
- 傳統 MLSys 避免改變模型輸出的「有損」最佳化，現在業界比較能接受，但講義也提醒，事實型或格式敏感的查詢不適用。

## 異質硬體：Mooncake 與 KTransformers

L28 的講者來自 [KVCache.AI](https://github.com/kvcache-ai)。第 9 頁把三種硬體擺在一起：H800 算力強，適合 prefill；H20 記憶體頻寬高，適合 decode；CPU 加大量 DRAM 容量便宜，適合放 KV cache。講義特別註明價格只是示意、不精確。這一頁就是整份講義的主旨：**不同硬體擅長不同維度，服務系統要按階段分派**。

前半講 [Mooncake](https://github.com/kvcache-ai/Mooncake)，月之暗面 Kimi 的服務平台。它和 DistServe 一樣拆 prefill 與 decode，但把重心放在 KV cache：用 GPU 叢集裡閒置的 CPU、DRAM、SSD 組成分散式 KV cache 池（第 11 頁）。第 17 頁的理由是快取命中率跟快取大小成正比，需要的容量是 PB 等級，超過單機。第 25 頁的傳輸引擎數字：LLaMA3-70B 128k token 的 40 GB KV cache，在 4×200 Gbps RoCE 上跑到 87 GB/s。[Mooncake 論文](https://arxiv.org/abs/2407.00079)摘要說，在真實負載下這套架構讓 Kimi 多處理 75% 的請求。

後半講 [KTransformers](https://github.com/kvcache-ai/ktransformers)，對象換成本機部署的 MoE 模型。第 36–37 頁的觀察是：MoE 每次只啟動少數專家，大量的 routed expert 算術強度低，適合放到 CPU 記憶體；attention 和共享專家留在 GPU。要讓 CPU 跟得上，講義列了四招：Intel AMX 指令做矩陣乘法（第 40 頁）、用 CUDA Graph 消除 kernel 啟動開銷（第 43 頁）、依 NUMA 切分專家權重（第 44 頁），以及讓部分專家延後計算、讓 CPU 與 GPU 重疊工作的 expert deferral（第 45–46 頁）。第 56 頁的微調案例是：DeepSeek-V3/R1 671B 用 70 GB GPU 記憶體加 1.2 TB CPU 記憶體就能跑 LoRA。

## 回頭看框架地圖：App Stack and Model Serving

L30 是 Lei Li 自己的講義，比較像地圖。前半用 [a16z 的 LLM 應用架構](https://a16z.com/emerging-architectures-for-llm-applications/)把應用拆成三層：資料前處理與 embedding、prompt 建構與檢索、prompt 執行與推論（第 3–17 頁）。

後半列服務框架（第 20 頁）：NVIDIA Triton 搭配 LightSeq 或 TensorRT-LLM、Text Generation Inference、OpenLLM、MLC LLM、LightLLM。第 21 頁提醒有兩個「Triton」：NVIDIA 的 [Triton Inference Server](https://developer.nvidia.com/triton-inference-server) 是服務軟體；OpenAI 的 Triton 是寫 kernel 的語言。第 24 頁說明分工：Triton 把多個請求組成 batch，推論引擎負責批次執行。[LightLLM](https://github.com/ModelTC/lightllm/blob/main/docs/LightLLM.md) 佔了最多頁（第 36–48 頁）。它的兩個重點是：以 token 為單位管理 KV cache 記憶體的 Token Attention，以及搭配它的 Efficient Router 排程。

這份講義的框架清單沒有 SGLang 和 Dynamo，第 20 頁把 vLLM 列為「later lectures」。拿它認識名詞可以，別當成今天的選型建議。

## 校外讀者要注意什麼

- **沒有錄影**。客座講義很多頁只有圖或標題（例如 L26 第 18–21 頁引用尚未出版的 PMPP 第五版圖），口頭解釋讀不到，要搭配論文。
- **三份講義未排日期**。L28、L29、L30 在 Syllabus 底部，春季課表裡沒有對應日期，不確定課堂上是否講過。
- **沒有對應作業**。HW7 在 4/20 截止，這一組講題之後只剩期末專題。想動手，要自己找題目。
- **分清研究數字與廠商數字**。論文摘要的數字有實驗設定可查；講義中引用的 Baseten、Alibaba 案例屬於合作廠商的效能報告。
- **Fall 2026**：[秋季 Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus) 把 Dynamo 與 LMCache 兩講排在 11/30、12/2，其餘三份仍在未排日期區。

## 自學怎麼做

1. 先讀 L29 與 [DistServe 論文](https://arxiv.org/abs/2401.09670)，確定自己能解釋 goodput、干擾與平行策略耦合這三件事。
2. 讀 L27，接著讀 [CacheBlend](https://arxiv.org/abs/2405.16444) 或 [CacheGen](https://arxiv.org/abs/2310.07240) 擇一。
3. L26 與 L28 當作工程案例讀，挑一個元件（KV-aware router、Mooncake Store、expert deferral）追到原始碼。

今晚可以做的一件事：打開 L26 第 36 頁推薦的 [vLLM disaggregated serving 範例](https://docs.vllm.ai/en/latest/examples/online_serving/disaggregated_serving/)，對照 DistServe 講義第 50 頁的 XPYD，找出範例裡 prefill 和 decode 各開了幾個實例、KV cache 怎麼傳。

## 延伸閱讀

- 單機服務的前一步：[L22＋L24 LLM 服務：排程、RadixAttention、PagedAttention](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm)
- 另一門課的推論講法：[Stanford CS336：推論](/posts/ai/2026-08-22-cs336-inference)
- vLLM 本身的架構：[vLLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine)

## 參考資料

- [CMU 11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) — 4/20、4/22 講題與 reading，底部未排日期的三份講義
- [CMU 11-868 Fall 2026 Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus) — 秋季排程對照
- [L26 Inference at Scale（Vikram Sharma Mailthody）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-26-dynamo-vikram_mailthody-0ddbeb69382d5c168b6d4636a82185d0.pdf) — goodput 成本、Dynamo 元件、開放問題
- [L27 KV Cache: A New AI Memory Abstraction（Junchen Jiang）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-27-LMCache_junchenjiang-c21828fe582270cb5e08b4a21a002956.pdf) — KV cache 量級、CacheBlend、壓縮流程、LMCache 設計、Lessons
- [L28 LLM Serving on Heterogeneous Hardware（Mingxing Zhang）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-28-mooncake-kTransformer-1243bfbecbb0c3610bf95eac030acb2a.pdf) — 硬體分工、Mooncake Store、KTransformers
- [L29 Disaggregating prefill and decode（Hao Zhang）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-29-disaggregating_prefill_decode_hao_zhang-c0e55139d20512a2348783423397cc7f.pdf) — continuous batching、goodput、干擾、XPYD 放置、歷史
- [L30 LLM Serving（Lei Li）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-30-serving-c4a70ab21cde01fb60068a256c6e163a.pdf) — LLM app stack 與服務框架
- [Zhong et al., DistServe（arXiv 2401.09670）](https://arxiv.org/abs/2401.09670)
- [Liu et al., CacheGen（arXiv 2310.07240）](https://arxiv.org/abs/2310.07240)
- [Yao et al., CacheBlend（arXiv 2405.16444）](https://arxiv.org/abs/2405.16444)
- [Qin et al., Mooncake（arXiv 2407.00079）](https://arxiv.org/abs/2407.00079)
- [KTransformers 論文（ACM，Syllabus 連結）](https://dl.acm.org/doi/10.1145/3731569.3764843)
- [NVIDIA Triton Inference Server](https://developer.nvidia.com/triton-inference-server)
- [LightLLM 文件](https://github.com/ModelTC/lightllm/blob/main/docs/LightLLM.md)
- [ai-dynamo/dynamo](https://github.com/ai-dynamo/dynamo)、[LMCache/LMCache](https://github.com/LMCache/LMCache)、[kvcache-ai/Mooncake](https://github.com/kvcache-ai/Mooncake)、[kvcache-ai/ktransformers](https://github.com/kvcache-ai/ktransformers)

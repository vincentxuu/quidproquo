---
title: "CMU 11-868 L22、L24 LLM 服務：排程、RadixAttention 與 PagedAttention"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, llm-inference, model-serving, kv-cache, sglang, vllm, pagedattention]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 19
tldr: "11-868 用兩講回答同一個問題：一台推論伺服器怎麼同時服務大量請求，又不浪費 GPU 上的 KV cache。第 22 講（Lei Li）從 SGLang 的排程迴圈講起：ORCA 的 continuous batching、用 radix tree 管 KV 的 RadixAttention、依前綴命中率排序與分流、把 CPU 排程藏到 GPU 計算後面。第 24 講由 vLLM 作者 Woosuk Kwon 主講：PagedAttention 把 KV cache 切成固定大小的 block，用 block table 做虛擬化，讓同一張 A100 的 batch 從 8 撐到 40；後半講 vLLM 怎麼壓 CPU overhead、用 piecewise CUDA graph、切模型平行與管理混合架構的記憶體。"
description: "CMU 11-868 LLM Systems（Spring 2026）第 22 講 LLM serving with SGL 與第 24 講 Paged Attention & vLLM 導讀：推論伺服器架構、排程迴圈、continuous batching 與 selective batching、KV cache 大小、RadixAttention 的插入／分裂／驅逐、cache-aware 排程與負載平衡、overlap scheduler、PagedAttention 的 block table、copy-on-write、preemption、vLLM 的非同步排程、piecewise CUDA graph、五種平行與 PD 拆分、hybrid memory allocator。"
draft: false
glossary:
  - term: "selective batching"
    aliases: ["選擇性批次"]
    definition: "ORCA 提出的做法：把 linear、layer norm、GeLU 等與序列長度無關的運算合成一批算，attention 則依各請求分開交給 attention 引擎處理。"
    context: "11-868 第 22 講把它和 continuous batching 並列為 ORCA 的兩個核心想法。"
  - term: "block table"
    aliases: ["區塊表"]
    definition: "PagedAttention 中記錄「某個請求的第 i 個邏輯 KV block 對應到哪個實體 block、目前填了幾格」的對照表，角色類似作業系統的 page table。"
    context: "Woosuk Kwon 在 11-868 第 24 講用 Alan Turing 這個 prompt 逐步示範 block table 怎麼更新。"
  - term: "cache-aware scheduling"
    aliases: ["快取感知排程"]
    definition: "排程時依每個請求在 KV cache 中命中的前綴長度排序，命中越長越先處理，以提高快取命中率；相對於先到先服務（FCFS）。"
    context: "SGLang 的排程器與 HW6 的作業頁都有描述這個策略。"
  - term: "piecewise CUDA graph"
    aliases: ["分段 CUDA graph"]
    definition: "把模型切成數段，attention 以外的逐 token 運算錄成 CUDA graph，attention 留在 PyTorch eager 執行，在效能與彈性之間折衷。"
    context: "vLLM 用 torch.compile 切圖，11-868 第 24 講給出它與完整 CUDA graph 的延遲比較。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。主要材料是兩份投影片：4/6 的 [第 22 講 Design of Efficient LLM Inference Server](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-22-llm-serving-scheduler-radixattention-dfa87a4515092525676277a85bc4425d.pdf)（Lei Li，PDF 47 頁），以及 4/13 的 [第 24 講 Paged Attention & vLLM for Efficient LLM Inference Engine](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-24-vLLM_woosuk_kwon-b6a0750bb310949461ba5a635a1126eb.pdf)（Woosuk Kwon，投影片署名 Inferact，PDF 82 頁）。下文頁碼指 PDF 頁序。[Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 為這兩講列的 reading 是 [ORCA](https://www.usenix.org/system/files/osdi22-yu.pdf)、[SGLang](https://arxiv.org/abs/2312.07104) 與 [vLLM](https://arxiv.org/abs/2309.06180)。事實皆於 2026-09-30 打開官方材料核對。存取等級 **A3**：投影片公開；拿不到的是課堂錄影（官方課表未列本課公開錄影連結）與課後 Quiz。

**系列位置**：上一篇 [L23 大模型的高效微調：LoRA 與 QLoRA](/posts/ai/2026-09-30-cmu11868-peft-lora)｜下一篇 [HW6：DeepSpeed ZeRO＋LoRA 訓練與 SGLang 推論](/posts/ai/2026-09-30-cmu11868-hw6-training-inference-systems)｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

官方課序是 4/6 講 SGLang、4/8 講 PEFT、4/13 講 vLLM。本系列把兩講服務排在一起，因為它們在解同一個問題，而且投影片第 9 頁就寫明「SGLang / vLLM share similar arch」。

## 課程影片來源

已核對 Spring 2026 官方 Syllabus：各講公開列出 slides、reading 與 homework，未列對應講次的公開錄影連結。本文因此以投影片、論文或作業導讀，沒有對應講次播放器；這項結論只限官方公開頁面，不代表校內沒有錄影。

官方來源：

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

查核日期：2026-10-10。

## 場景：一台伺服器要同時接住很多請求

第 22 講第 3 頁用一個規模開場：2 億日活躍使用者、每天 25 億個 prompt、每秒 3 萬個請求。第 4–6 頁接著列三種常見的使用型態，每一種都藏著一個系統問題：

- **多使用者、單輪**：不同使用者可能送出一模一樣的 prompt。
- **多輪對話**：伺服器該不該把使用者的聊天歷史留在 GPU 記憶體裡，等下一輪？
- **一次要多個答案**：同一個 prompt（可能帶 in-context examples）要生成三次，真的要從頭跑三次嗎？

第 7 頁把設計目標收成一張清單：維持多使用者的對話 session；同時處理大量請求，而這些請求生成長度不一、常共享前綴；兼顧吞吐量與延遲；善用 CPU／GPU 異質裝置。投影片點名的例子正是 ORCA、SGLang 與 vLLM。

## 直覺：瓶頸在 KV cache

一般神經網路推論只保留當前層的輸出。Transformer 不行：生成下一個 token 時，每一層都要用到前面所有 token 的 key 與 value。所以要把每層的 K、V 都存在 GPU 記憶體裡，這就是 KV cache（第 22 講第 18–19 頁）。

它很大。第 22 講第 20 頁的估算是 LLaMA3 70B（80 層、維度 8192）每個 token 約 2.5MB，8k context 的一個請求約 20GB。第 24 講第 11 頁的說法是每個 token 約 1MB，一個完整請求就是好幾 GB。兩份投影片的數字不同，是因為假設的模型與精度不同；實際大小還取決於是否用 GQA 這類共享 KV head 的設計。重點是量級：KV cache 是和模型權重搶記憶體的主角。

第 24 講第 12–13 頁把這件事畫成一張圖：13B 模型放在 A100-40GB 上（投影片註明是 2023 年的常見配置），參數佔 26GB（65%），KV cache 可用約 12GB（30%）。以前的系統在 batch 到 8 時就把 40GB 用光，吞吐約 0.8 req/s；PagedAttention 能把 batch 撐到 40，吞吐約 3.2 req/s。投影片的結論只有一句：KV cache 管得好不好，決定高吞吐服務做不做得起來。

接下來兩講各從一端處理它：SGLang 講「怎麼排程、怎麼重用」，vLLM 講「怎麼配置、怎麼不浪費」。

## 機制一：排程迴圈與 continuous batching

第 22 講第 9 頁畫出伺服器架構：Client API（原生生成 API、OpenAI 相容 API、結構化語言前端）→ FastAPI Server → Tokenizer → Scheduler → Detokenizer；Scheduler 底下是 Model Worker，Model Worker 管記憶體池、radix tree cache 與 attention backend。

整個排程器是一個無窮迴圈（第 10 頁）：收請求、處理輸入、挑下一批、跑這一批、處理結果。迴圈裡要做的五件事是：接收輸入、串流輸出、檢查停止條件、重排請求並湊批次、為下一批與正在跑的批次配置記憶體。

<details>
<summary>第 22 講第 10 頁的排程迴圈（投影片原文）</summary>

```python
while True:
    recv_reqs = recv_requests()
    process_input_requests(recv_reqs)
    batch = get_next_batch_to_run()
    result = run_batch(batch)
    process_batch_result(batch, result)
```

</details>

**為什麼要 continuous batching**。第 13 頁指出最直接的問題：一批請求的生成長度不同，天真的實作要等最長的那個跑完。第 14 頁的解法出自 [ORCA（OSDI 2022）](https://www.usenix.org/system/files/osdi22-yu.pdf)：以 iteration 為單位排程，每生成一個 token 就檢查一次，只要批次裡有請求結束，新請求馬上補進來。

第 15 頁是 ORCA 的另一個想法 **selective batching**：linear、layer norm、GeLU 這些非 attention 運算整批一起算，prefill 也合併成一步；attention 則交給專門的 attention 引擎（投影片舉 PagedAttention 為例）。

**SGLang 的排程器裡面長什麼樣**（第 16 頁）。`get_next_batch_to_run()` 分三種情況：

- 有請求剛做完 prefill：移到 decode 批次。
- 有新的 prefill 請求：依批次剩餘空位與等待佇列的優先序挑請求，加入 prefill。
- 沒有新 prefill：繼續 decode。先用 `check_decode_mem` 看 GPU 記憶體夠不夠；夠就準備 decode 並調低 `new_token_ratio`；不夠就 `retract_decode`，調高 `new_token_ratio`，把請求放回 prefill 等待佇列。

`process_batch_result` 檢查有沒有請求完成並釋放 KV cache。投影片特別註明，這裡釋放的只是參照，不是真的把記憶體清掉；下一節會看到這些 KV 為什麼要留著。

## 機制二：RadixAttention，用前綴樹重用 KV

回到開場那三種使用型態：相同的 prompt、多輪對話的歷史、共用的 in-context examples，全都是「前綴一樣」。[SGLang](https://arxiv.org/abs/2312.07104) 的 RadixAttention 就是為這件事設計的（第 21–24 頁）：

- KV 的記憶體指標存在一棵 radix tree（前綴樹）裡。
- 每條邊是一段字串，每個節點存那段字串的 KV 記憶體指標，從根到節點的整條路徑就是一個前綴。
- 查一個 prompt 時，沿著邊比對出最長的已快取前綴，回傳命中的 token 數與節點。

第 23 頁補上一個實作細節：樹本身放在 CPU，節點指向 GPU 記憶體裡那段邊的 KV。

第 25–32 頁用一連串圖示範樹怎麼長：新請求加入時新增節點；多輪對話的下一輪接在同一條路徑後面；新使用者的 prompt 只有部分前綴相同時，把節點分裂（node split）；GPU 快取滿了，就驅逐最少被使用的 KV 節點。[HW6 的作業頁](https://llmsystem.github.io/llmsystemhomework/assignment_6/)對驅逐策略寫得更具體：LRU 驅逐的是最久沒用的**葉節點**，所以共同的祖先會一直保留，直到它自己也變成葉節點被淘汰。

**Cache-aware 排程與負載平衡**（第 35–38 頁）。有了樹，排程就能看快取：佇列裡的請求依命中前綴長度排序，命中率定義為「已快取的 token 數 ÷ prompt 總 token 數」。多台 worker 時，負載平衡器預測每台的前綴命中率，把請求送到命中最高的那台。第 38 頁的對照是：round robin 吞吐 82,665 token/s、命中率 20%；cache-aware 負載平衡吞吐 158,596 token/s、命中率 75%。

## 機制三：把 CPU 排程藏起來

第 40–43 頁處理最後一個浪費：GPU 在等 CPU 排程。CPU 排程器的工作（收訊息、串流輸出、檢查停止條件、維護 radix tree 與前綴比對、配置下一批的記憶體）如果和 GPU 計算輪流做，GPU 就會閒著。

解法是讓 CPU 排程與 GPU worker 重疊執行。投影片寫的兩個關鍵：把停止條件的檢查延後一步來解開相依性；用 CUDA event 與 stream 做細粒度排程。它引用的是 NanoFlow（Zhu et al.），結果是比當時最好的開源基線快 1.3 倍（第 43 頁）。

第 45 頁列出伺服器還會附帶的功能，這講沒有展開：speculative decoding（SpecForge）、constrained decoding（XGrammar）、expert parallelism（DeepEP）、特定模型支援（MLA）。

## 機制四：PagedAttention，把 KV cache 當虛擬記憶體

第 24 講由 [vLLM 論文（SOSP 2023）](https://arxiv.org/abs/2309.06180)的第一作者 Woosuk Kwon 主講。

**舊做法錯在哪**（第 15–16 頁）。以前的系統沿用靜態形狀的深度學習慣例，替每個請求預先配置一段連續記憶體，長度是該請求的最大長度。這造成兩種碎片：輸出長度未知導致**內部碎片**（預留的格子沒用上）；每個請求的最大長度不同導致**外部碎片**。第 16 頁的結論是，KV cache 空間只有 20–40% 真正存了 token 狀態。

**PagedAttention 的做法**（第 17–21 頁）借用作業系統的分頁：

- 把 KV cache 切成固定大小的 **KV block**，例如每個 block 存 4 個 token 的 KV。
- 每個請求看到的是連續的**邏輯 block**，實際放在任意位置的**實體 block**。
- 中間靠 **block table** 對照：第 i 個邏輯 block 對到哪個實體 block、已經填了幾格。

第 22–26 頁用 prompt「Alan Turing is a computer scientist」逐步示範：每生成一個 token 就填進最後一個 block 的空格，填滿了才配置新的實體 block，並在 block table 新增一列。

attention 計算時，依 block table 抓回不連續的 block，當場做 attention。第 20 頁承認這個間接定址讓 GPU kernel 延遲多了 5–10%；第 21 頁說實務上 PagedAttention 是一個客製 GPU kernel，不會先把 key、value 收集成連續張量，也可以和 FlashAttention 結合。

**省下多少**（第 27 頁）。內部碎片只會發生在序列的最後一個 block，每條序列浪費不到一個 block；外部碎片則完全消失。投影片的量級是一條約 1,000 token 的序列配上約 10 token 的 block。

**分頁帶來的第二個好處：共享**（第 28–32 頁）。平行抽樣時，多個樣本共用同一段 prompt；除了最後一個 block，其餘 prompt block 都可以共享。某個樣本要寫入共享的 block 時才複製一份（copy-on-write）。beam search 的共享結構更複雜，投影片把它比作行程樹的 fork 與 kill，同樣靠 paging 加 copy-on-write 支援。

**記憶體不夠時**（第 34–37 頁）。沒有空的實體 block 可配時，要先暫停一些請求。選項有兩個：把 KV 換到 CPU 再換回來，或刪掉之後重算。因為每一步都需要前面所有 token，所以兩種做法都以整個請求為單位。投影片的觀察是：block 越小，swap 的小資料傳輸開銷越高；重算則出奇地快，因為所有 token 的 KV 可以平行算。vLLM 的策略是重算，搭配先到先服務（FCFS）。

第 38 頁把它和作業系統的虛擬記憶體對照：OS page 對 KV block、跨行程共享 page 對跨樣本共享 block；差別是 vLLM 只用單層 block table（block table 相對於實際資料很小），而且 preemption 以請求為單位、用重算來恢復。

第 39–40 頁的結果（OPT-13B、單張 A100-40G）：greedy decoding 用 ShareGPT trace 比 Orca(Pow2) 快 2.4 倍；Alpaca trace 上，不用 beam search 快 1.8 倍，beam width 2、4、6 分別快 2.4、3.2、3.5 倍。第 41 頁列出採用 PagedAttention 的系統，例如 TensorRT-LLM 與 HuggingFace TGI。

第 14 頁還補了一個新的理由說明這件事為什麼更重要了：MoE 模型很稀疏。投影片算 DeepSeek V3 是 32 倍（256 個專家取 top 8）、Kimi K2 是 48 倍（384 取 8），每個專家只處理批次裡 1/32 到 1/48 的 token，要餵飽 GPU 就需要大 32–48 倍的 batch，KV cache 的空間需求跟著變大。

## 機制五：vLLM 這個引擎怎麼再壓榨一層

第 24 講後半介紹 vLLM 本身。它提供兩種 API（第 44–45 頁）：離線批次推論的 `LLM` 類別，以及 FastAPI 做的 OpenAI 相容伺服器（`vllm serve`）。第 47 頁把優化分成四塊：

**1. 壓低 CPU overhead**（第 49–62 頁）。第 49 頁的論證很直接：推論每一步只要 5–10 ms（每秒 100–200 token），訓練每一步則是 100 ms 到 1 秒以上；所以推論時多 1 ms 的 CPU 開銷就可能讓效能掉 20%，而 Python 很容易就多出 1 ms。對策包括：

- API server 從 Python 改寫成 Rust。
- 非同步排程與非同步 de-tokenization：提前一步排好、準備好下一批，讓 CPU 開銷和模型執行重疊，GPU 不必等 CPU（第 52 頁，同樣引 NanoFlow）。
- GPU 端準備輸入：原本用一堆小 PyTorch 運算在 CPU 上做的批次、paged attention 與取樣參數簿記，改寫成 Triton kernel（第 53 頁）；這也讓非同步排程能和 speculative decoding 相容（第 54 頁）。
- CUDA graph：Python／PyTorch 的開銷最多可佔總延遲的 50%（第 55 頁）。把整個模型錄成一張 CUDA graph 開銷最小，但要求靜態形狀、執行中不能有 CPU 運算。LLM 推論偏偏很動態：同一批裡 prefill 與 decode 任意混合、kernel 要靠執行期啟發式、還可能要 CPU offloading。vLLM 的折衷是 **piecewise CUDA graph**：用 torch.compile 把模型切段，attention 用 PyTorch eager 跑，其餘逐 token 的運算用 CUDA graph（第 58–61 頁）。第 62 頁的量測：比 PyTorch eager 快 6–39%，最差比完整 CUDA graph 慢 2–7%，batch size ≥ 8 時只慢 0–2%。

**2. GPU kernel**（第 64–67 頁）。複雜或關鍵的 kernel 交給 FlashInfer 等函式庫，vLLM 提供 `AttentionBackend` 與 `FusedMoE` 抽象層讓不同實作插拔；RMS norm、RoPE 這類受記憶體頻寬限制的 kernel，用 torch.compile 自動融合或手寫融合 kernel。投影片以 DeepSeek V3.2 為例。

**3. 模型平行**（第 69–78 頁）。理由是模型越來越大：投影片舉 Kimi K2.5 有 1T 參數、量化後約 600GB，單張 B200 只有 285GB HBM。目標是減少通訊（考慮 NVLink 與 InfiniBand 頻寬差距很大）並平衡負載。五種平行的取捨：

| 平行方式 | 優點 | 缺點 |
|---|---|---|
| 資料平行（複製整個引擎，負載平衡器依負載、KV 用量、前綴快取分流） | 引擎之間不用通訊 | 不省參數記憶體、不降延遲 |
| 張量平行（切 linear 層權重） | 網路夠快時降延遲，KV cache 也能切 | 通訊重，通常要 NVLink；受 KV head 數量限制 |
| 專家平行（專家分散到不同節點） | 對 GPU kernel 友善，通訊比 TP 少 | 只適用 MoE 層，attention 要搭配別的平行；負載不均 |
| Context 平行（把單一長序列切段） | 平行化超長序列，平衡 KV cache | 不省參數記憶體；需要平衡請求負載 |
| 管線平行（層分到不同 GPU） | 通訊最少 | 延遲增加，各段負載不均 |

第 76 頁另外介紹 prefill／decode 拆分：prefill worker 和 decode worker 分開，TTFT 與 TPOT 較好控制，兩邊可以各自優化；路由層可用 vLLM Router、NVIDIA Dynamo、llm-d、Ray Serve LLM，KV 傳輸用 NIXL。這個主題本系列在 [L26–L30 大規模服務](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache)詳談。

**4. 記憶體管理**（第 80–81 頁）。現代模型常把 full attention 和別的層混用，投影片舉 GPT-OSS（搭配 sliding window attention）與 Qwen 3.5（搭配 Gated DeltaNet）。靜態切分記憶體會造成嚴重碎片；vLLM 用 hybrid memory allocator 從共用的記憶體池動態分配，並調整各類層的 block 大小，投影片稱所有開源模型的記憶體浪費都在 0–12%。

## 兩講放在一起看

| | SGLang（第 22 講） | vLLM（第 24 講） |
|---|---|---|
| 主要問題 | 前綴一樣的請求能不能重用 KV | KV 怎麼配置才不浪費 |
| 核心結構 | radix tree（CPU）指向 GPU 上的 KV | block table 對照邏輯與實體 block |
| 重用方式 | 跨請求、跨輪次的前綴命中 | 同一請求的多個樣本共享 block，copy-on-write |
| 滿了怎麼辦 | LRU 驅逐葉節點 | 以請求為單位 preempt，重算恢復 |
| CPU 開銷 | overlap scheduler | 非同步排程、GPU 端準備輸入、piecewise CUDA graph |

兩者不是二選一。第 22 講第 9 頁說兩者架構相近，第 15 頁也把 PagedAttention 當成 attention 引擎的例子。

## 限制與自學建議

- 兩份投影片的效能數字都來自講者自己的系統與設定，例如 PagedAttention 的倍數是對 Orca(Pow2) 在 OPT-13B 上的結果；拿到你的模型與流量上，要自己量。
- 第 24 講談的 vLLM 內部（Rust API server、GPU 端輸入準備、hybrid allocator）是 2026 年春季的狀態，引擎還在快速變動，實作細節以 [vLLM 官方文件](https://docs.vllm.ai/)為準。
- 官方課表未列本課錄影連結，投影片上很多圖（第 11、25–32、44 頁）沒有文字說明，只能對照論文讀。

自學順序建議：

1. 先讀第 24 講第 15–27 頁與 [vLLM 論文](https://arxiv.org/abs/2309.06180)講 PagedAttention 的章節，自己在紙上畫一次 block table 的更新。
2. 再讀第 22 講第 21–32 頁與 [SGLang 論文](https://arxiv.org/abs/2312.07104)的 RadixAttention 段落，想一想多輪對話與平行抽樣各會長出什麼形狀的樹。
3. 最後做 [HW6](/posts/ai/2026-09-30-cmu11868-hw6-training-inference-systems) 的 SGLang 題，實際調 `mem_fraction_static`、`dp_size` 與 batch size，觀察吞吐怎麼變。

## 延伸閱讀

- 另一門課怎麼講推論：[CS336 推論](/posts/ai/2026-08-22-cs336-inference)
- attention 本身怎麼變快：[L21 FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention)
- 單機之後：[L26–L30 大規模服務：prefill／decode 拆分、KV cache 與異質硬體](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時回官方課程頁與公開影音來源查證，仍未找到該講公開錄影，狀態維持不變。

## 參考資料

- [CMU 11-868 LLM Systems（Spring 2026）課程首頁](https://llmsystem.github.io/llmsystem2026spring/)
- [11-868 Syllabus（Spring 2026）](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) — 4/6、4/13 講次與 ORCA、SGLang、vLLM reading
- [第 22 講投影片：Design of Efficient LLM Inference Server](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-22-llm-serving-scheduler-radixattention-dfa87a4515092525676277a85bc4425d.pdf) — 伺服器架構、排程迴圈、continuous／selective batching、RadixAttention、cache-aware 負載平衡、overlap scheduler
- [第 24 講投影片：Paged Attention & vLLM for Efficient LLM Inference Engine（Woosuk Kwon）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-24-vLLM_woosuk_kwon-b6a0750bb310949461ba5a635a1126eb.pdf) — 碎片問題、block table、copy-on-write、preemption、吞吐實驗、vLLM 四類優化
- [Yu et al., ORCA: A Distributed Serving System for Transformer-Based Generative Models（OSDI 2022）](https://www.usenix.org/system/files/osdi22-yu.pdf)
- [Zheng et al., SGLang: Efficient Execution of Structured Language Model Programs（arXiv 2312.07104）](https://arxiv.org/abs/2312.07104)
- [Kwon et al., Efficient Memory Management for Large Language Model Serving with PagedAttention（SOSP 2023, arXiv 2309.06180）](https://arxiv.org/abs/2309.06180)
- [HW6 作業頁](https://llmsystem.github.io/llmsystemhomework/assignment_6/) — RadixAttention 的 LRU 葉節點驅逐與 cache-aware 排程描述
- [vLLM 官方文件](https://docs.vllm.ai/)

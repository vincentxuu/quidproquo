---
title: "CMU 11-768 導讀 L3：長 context agent 怎麼管記憶體——混合注意力、RoPE 外推、prompt cache 與 compaction"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, long-context, kv-cache, context-engineering]
lang: zh-TW
series:
  name: "CMU 11-768 AI Agents 導讀"
  order: 3
tldr: "Agent 每一步都把整段歷史重新送進模型，五次呼叫就累積 80K token 的輸入；OpenHands 的 1,500 個 session 平均 7.8 萬 token，其中 37% 是工具結果。Neubig 分兩層處理：模型層靠「多層局部 + 一層全域」的混合注意力與長度課程撐起百萬 context；harness 層靠穩定前綴吃到便宜約十倍的 cache，再用保留錨點、外存證據的 compaction 撐過上限，而且 compaction 要用接續任務來評。"
description: "導讀 CMU 11-768 AI Agents 第 3 講 Context Management for Long-Context Agents：agent context 的二次方成長、prefill／decode 與 TTFT、滑動視窗／線性注意力（DeltaNet、KDA）／稀疏注意力／KV 壓縮、RoPE、NoPE 與 YaRN、長 context 訓練資料、prompt cache 定價與 PagedAttention／RadixAttention，以及 compaction 的策略、漂移與評測。"
draft: false
glossary:
  - term: "prefill"
    aliases: ["預填", "prefill phase"]
    definition: "推論的第一階段：一次處理整段輸入 prompt、算出每個位置的 key 與 value。計算密集，耗時隨 prompt 長度增加。"
    context: "本篇用它解釋為什麼 prompt 越長、第一個 token 越晚出來（TTFT 越高）。"
  - term: "TTFT"
    aliases: ["time to first token", "TPOT", "time per output token"]
    definition: "TTFT 是從送出請求到收到第一個輸出 token 的時間；TPOT 是之後每個輸出 token 的間隔。"
    context: "互動式 coding agent 很在意這兩個數字，跑整晚的背景 agent 就不太在意。"
  - term: "線性注意力"
    aliases: ["linear attention", "DeltaNet", "Gated DeltaNet", "KDA"]
    definition: "拿掉 softmax 之後，注意力可以改寫成一個固定大小的狀態矩陣，每步只更新一次，解碼成本不再隨歷史長度增加。DeltaNet 系列是它的改良版，會修正誤差、逐步遺忘。"
    context: "本篇模型層的主角，是多數新一代開放模型「局部層」的做法。"
  - term: "compaction"
    aliases: ["context compaction", "上下文壓縮", "context compression"]
    definition: "context 快滿時，把較舊的歷史換成一份摘要或結構化檢查點，讓 agent 能繼續工作。"
    context: "本篇 harness 層的最後一塊，也是作業 A1 Part 2 要實作的東西。"
---

> 🌏 [English version](/en/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) 第 3 講（9 月 1 日，[投影片](https://www.cmu-agents.com/slides/lecture-03-long-context.pdf)、[錄影](https://www.youtube.com/watch?v=AiwCCvFW1uE)）由 Graham Neubig 主講。他說原本想把題目叫「長 context LLM 的 context 管理」，因為內容大多是 LLM 的通用問題；但長 context 對 agent 特別要命，基礎 LLM 課又常常帶過，所以這一講拆得很細，順便把近期開放模型處理長 context 的架構都看一遍。

問題很好懂：[上一講](/posts/ai/2026-09-29-cmu-11768-lecture-02-tool-use)的工具呼叫每用一次，歷史就長一截，下一次呼叫要把整段歷史再送進模型一次。這一講回答兩個問題：模型**吃不吃得下**這麼長的輸入（容量），系統**養不養得起**（效率）。

**怎麼讀這篇**：本講有兩層。模型層在講注意力架構、位置編碼、訓練資料，是做模型的人的事；harness 層在講 prompt cache 和 compaction，是每個寫 agent 的人每天都會碰到的事。只寫 agent 不訓練模型的讀者，可以先跳到「Harness 層」。模型層每一節都先給直覺，公式收在折疊區；如果想先補注意力與推論的基礎，站內的 [CS336 Lecture 4：Attention 與 MoE](/posts/ai/2026-08-22-cs336-attention-moe) 和 [CS336 Lecture 10：推論](/posts/ai/2026-08-22-cs336-inference) 是很好的前置。

## 課程影片來源

已核對 CMU 11-768 Fall 2026 第 3 講的公開錄影；影片由課程教師 Graham Neubig 的頻道發布，影片標題與說明對應本課程。

```youtube
url: https://www.youtube.com/watch?v=AiwCCvFW1uE
title: CMU AI Agents 2026: 3. Long Context Modeling for Agents
```

原始影片：[CMU AI Agents 2026: 3. Long Context Modeling for Agents](https://www.youtube.com/watch?v=AiwCCvFW1uE)

官方來源：

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：通讀全程字幕（約 76 分鐘），逐項核對文章轉述的 Neubig 說法：OpenHands 1,500 個 session 的 prompt 組成（7.8 萬 token、37% 工具結果等）、TTFT／TPOT 與 OpenRouter provider 速度差、混合注意力與各線性／稀疏注意力的講解、NoPE 與因果遮罩問答、長 context 資料與 context parallelism（含自己找不到 Gated DeltaNet kernel 的經驗）、快取價格約十倍與命中率 90–95%、provider 快取保留時間、快取地雷、compaction 觸發與保留策略、OpenHands 早期 compaction 的 PR 故事；皆有依據。發現兩處字幕找不到並已修正：DeltaNet 的「很像線上學習」（講者只說 β 類似學習率）、課後問答的「替代架構會不會造成 context 溢位」（字幕末段只有 subagent 一問）。逐模型的層數比例、價格表、YaRN 公式等細節屬投影片與外部來源，字幕未涵蓋；「9 月 1 日」的上課日期字幕未提。

## Agent 的 context 為什麼長得這麼快

投影片第一張就是一個二次方：假設固定前綴 1K、每次呼叫多 5K 歷史，第 1 次輸入 6K，第 2 次 11K，第 3 次 16K……五次呼叫累積要處理 80K token。歷史是線性長的，**送進模型的總量是二次方長的**。Neubig 說他自己跑過接近一整天的 coding agent session，可以想像會變多大。

這些 token 從哪來？他分析了 [OpenHands](https://github.com/OpenHands/OpenHands) 的 1,500 個 session（每個都只是解一個具體問題，不是多日長跑），平均每個 session 77,922 token：

| 組成 | 占比 |
|---|---|
| 系統提示 + 工具描述 | 23% |
| 使用者訊息 | 9% |
| 推理 | 9% |
| 直接回覆使用者 | 2% |
| 工具呼叫（寫程式、讀程式） | 20% |
| 工具結果（讀檔等回傳內容） | 37% |

兩個觀察：OpenHands 的系統提示就有 15K 到 18K token（Neubig 說這是因為他們對「該怎麼工作」有很強的主張，一般在 8K 到 20K 之間，看接了多少工具）；模型花在推理的 token 是直接回覆使用者的四倍多。最大宗是工具結果。

## 兩個挑戰：容量與效率

- **容量**：模型能不能用上需要的證據？取決於架構、位置編碼、訓練，要靠評測來量。
- **效率**：系統付不付得起？取決於注意力計算、KV 記憶體、快取與 compaction，決定成本與延遲。

容量的問題在於「宣稱的 context」和「有效的 context」是兩回事。經典例子是 Greg Kamradt 的 [Needle in a Haystack](https://github.com/gkamradt/needle-in-a-haystack)：在一堆 Paul Graham 的文章裡藏一句「在舊金山最棒的事，是晴天時吃個三明治、坐在 Dolores Park」，再問模型舊金山最棒的事是什麼。context 越拉越長，較弱的模型就開始答錯。Neubig 問學生長時間用 coding agent 遇過什麼毛病，答案很一致：忘了一開始的指示、叫它不要做的事它還是做了。最慘的例子是使用者說「不要刪這個」，agent 因為忘了就刪了。在 agent 情境裡，使用者一直在中途補指示，這種遺忘特別傷。

## 推論基礎：prefill、decode 與四個指標

要談效率，先要知道推論分兩段（投影片引用 [DistServe](https://arxiv.org/abs/2401.09670)）：

- **Prefill**：一次處理整段 prompt，算出每個位置的 key 與 value，寫進 KV cache。計算密集，prompt 越長越久。
- **Decode**：一次生成一個 token，讀整個 KV cache、再把新 token 的 KV 加上去。循序、吃記憶體頻寬。

服務端還有排程器負責排隊、批次、路由。量的指標四個：**TTFT**（等到第一個 token 多久；打長 prompt 會等比較久，就是 TTFT 變高）、**TPOT**（每個輸出 token 的間隔）、**吞吐量**（整個系統每秒完成多少）、**成本**（輸入、快取輸入、輸出分別計價）。

Neubig 在 OpenRouter 上指給大家看：同一個模型，不同 provider 的輸出速度可以從每秒三個 token 到每秒幾百個，agent 的使用體驗天差地別。哪個指標重要要看用法：在編輯器裡互動，TTFT 和 TPOT 很要命；丟到背景跑一整晚，可能完全不在意。他自己的公司也在提供 coding agent 服務，推論廠商常會問他在乎哪個，好替他調系統。

---

# 模型層：讓模型吃得下百萬 token

## 直覺：限制每一步要比較幾次

標準注意力是**全域**的：每個 token 都要跟前面所有 token 兩兩比較。現在的前沿模型 context 在 256K 到 100 萬之間，大家都往 100 萬衝。100 萬個 token 兩兩比較就是 10¹² 次，而且每次都是大向量相乘。

所有解法的核心都一樣：**給每一步的比較次數設一個常數上限**，把 O(n²) 降成 O(wn)。w 不一定是視窗，只要是上限就行。

做法分兩種角色：**局部層**只在一個受限範圍內計算，便宜；**全域層**可以把資訊傳過整段序列。Neubig 說現在流行的模型幾乎都是混合式：好幾層局部、一層全域、再好幾層局部，如此重複。

| 模型 | 局部／狀態式計算 | 全域計算 | 局部：全域 |
|---|---|---|---|
| Qwen3.8-Flash-Next | Gated DeltaNet | 稀疏檢索（QSA） | 36:12 ≈ 3:1 |
| GLM-5.3-Flash | Kimi Delta Attention | DSA + IndexPool | 34:11 ≈ 3:1 |
| Kimi K3 | Kimi Delta Attention | 稠密 Gated MLA | 69:24 ≈ 3:1 |
| Nemotron 3 Ultra | Mamba-2 | 稠密 GQA | 48:12 = 4:1 |
| Inkling-Small | 512-token 視窗 | 稠密 GQA | 35:7 = 5:1 |
| DeepSeek-V4-Pro-0813 | 128-token 視窗分支 | 壓縮稀疏／稠密交錯分支 | — |

（表格依投影片整理。我對照了投影片引用的官方頁面：機制名稱與比例大致吻合，但不少層數只寫在 Hugging Face 的 config 檔，官方部落格或報告沒寫。GLM-5.3-Flash 的 README 只說「稀疏加線性注意力的混合架構」，KDA、DSA、34:11 都來自 config，而「IndexPool」這個名稱在來源裡找不到，config 裡只有 `index_kpool` 設定。DeepSeek 那列的「稠密」分支，論文稱為 HCA，是對壓縮約 128 倍後的 KV 做稠密注意力，不是一般的稠密注意力；論文寫的是 V4-Pro 預覽版，Pro-0813 的細節只見於它的 config。Inkling 部落格的 5:1 講的是完整版 Inkling，Small 版的 512 視窗與 35:7 來自 config。）反覆出現的機制有四個：滑動視窗、線性注意力（或循環模型）、稀疏注意力、KV 壓縮。

## 機制一：滑動視窗注意力

**直覺**：每個 token 只看前面固定 w 個位置。好處是層數一疊，視野會變大：第一層從前一兩個區塊拿資訊，第二層看到的前面區塊，本身已經帶著它們更前面的資訊，所以有效視窗逐層擴張。代價是單一局部層沒辦法直接取回很遠的 token。

<details>
<summary>公式：視窗遮罩</summary>

注意力公式不變，只換遮罩：

```
M_ij(w) = 0      若 0 ≤ i − j < w
        = −∞     其他
```

計算量從 O(n²) 降到 O(nw)。來源：[Longformer](https://arxiv.org/abs/2004.05150)。

</details>

## 機制二：線性注意力家族

**直覺**：softmax 很貴，因為要取指數再除以總和，逼你把每一對 query-key 都算出來。softmax 也是注意力的精華：它把分數變成加總為 1 的權重，讓模型能專注在少數相關 token 上。**拿掉 softmax**，表達力變弱，但換來一個好處：可以用結合律把「所有過去的 key × value」預先加總成一個固定大小的狀態矩陣。每來一個新 token 就更新一次矩陣，像 RNN 一樣，解碼成本從 O(n²) 直接變成 O(n)，連 w 都不需要。

接下來的改良都在試圖讓這個矩陣更像真正的注意力：

- **DeltaNet**：寫入前先讀。用目前的矩陣預測「這個 key 應該對應到什麼 value」，只把**預測誤差**寫進去，再乘一個 β 讓更新別太大（Neubig 說 β 的角色類似學習率）。
- **Gated DeltaNet**：線性注意力沒有機制阻止很久以前的怪 key 一直影響未來，所以每步先把整個矩陣乘上衰減係數 α，舊的東西慢慢淡掉。衰減越強，模型越「局部」。Qwen 系列用的就是它。
- **Kimi Delta Attention（KDA）**：把單一的 α 換成每個通道各自的衰減率，有些資訊可以存很久，有些很快忘。Kimi K3（依技術報告）和 GLM-5.3-Flash（依 HF config）用的是這版。

Mamba 的想法類似但數學更複雜，課堂上跳過。

<details>
<summary>公式：從 softmax 一路到 KDA</summary>

符號：q、k、v 是第 t 步的 query、key、value 列向量；S 是 d_k × d_v 的狀態矩陣。

**Softmax 注意力**（[Attention Is All You Need](https://arxiv.org/abs/1706.03762)）：保留所有過去的 k、v，每步跟全部比較。

```
a_ti = exp(q_tᵀ k_i / √d_k) / Σ_j exp(q_tᵀ k_j / √d_k)
o_t  = Σ_i a_ti v_i
```

**線性注意力**（[Transformers are RNNs](https://arxiv.org/abs/2006.16236)）：把 softmax 換成雙線性分數 q_tᵀ k_i，重新結合：

```
o_t = Σ_i (q_tᵀ k_i) v_i = (Σ_i k_i v_iᵀ)ᵀ q_t = S_tᵀ q_t
S_t = S_{t−1} + k_t v_tᵀ
```

寫入是純加法，干擾不會被明確清掉。

**DeltaNet**（[Schlag 等，ICML 2021](https://arxiv.org/abs/2102.11174)）：先讀出預測，只寫誤差。

```
v̂_t = S_{t−1}ᵀ k_t
e_t = v_t − v̂_t
S_t = S_{t−1} + β_t k_t e_tᵀ        β_t ∈ [0, 1]
```

**Gated DeltaNet**（[Yang 等，2024](https://arxiv.org/abs/2412.06464)）：先整體衰減，再做同樣的修正。α_t = 1 就退回 DeltaNet。

```
S̃_{t−1} = α_t S_{t−1}
S_t = S̃_{t−1} + β_t k_t (v_t − S̃_{t−1}ᵀ k_t)ᵀ
```

**KDA**（[Kimi Linear](https://arxiv.org/abs/2510.26692)）：α 變成長度 d_k 的向量，每個通道各自的記憶壽命。所有通道衰減相同就退回 Gated DeltaNet。

```
D_t = Diag(α_t)
S_t = (I − β_t k_t k_tᵀ) D_t S_{t−1} + β_t k_t v_tᵀ
```

</details>

## 機制三：稀疏注意力

**直覺**：不看全部過去，只挑一部分看。兩種挑法：

- **固定模式**：例如只看局部視窗加上幾個固定的全域位置。成本可預測，但模式不會因為 query 改變。Neubig 提到 OpenAI「大約五年前」的稀疏注意力論文就是這類，並說複雜度仍是二次方、只是常數小很多。實際上那篇是 2019 年的 [Sparse Transformer](https://arxiv.org/abs/1904.10509)（Child 等），論文自己宣稱的複雜度是 O(n√n)。
- **依內容挑選**：先用很便宜的方式粗算一次注意力，挑出 top-K 個 key，只對它們做完整注意力。[DeepSeek Sparse Attention](https://arxiv.org/abs/2512.02556)（出自 DeepSeek-V3.2 論文）用的就是這種：一個只有少數幾個 head、用 FP8 計算的「lightning indexer」替每個 query 挑出 2048 個 token。好處是能自適應，壞處是選錯就會漏掉相關的 key。

有學生問 top-K 用什麼相似度，Neubig 說通常不是 cosine，而是內積，是否先正規化他不確定。以 DeepSeek-V3.2 論文為例，indexer 的分數是 query 與 key 的內積過 ReLU、再按 head 加權，沒有先正規化。

<details>
<summary>公式：兩種稀疏集合</summary>

```
固定：   S_i = {j ≤ i : i − j < w} ∪ (G ∩ [1, i])
依內容： S_i = TopK_{j ≤ i} g(q_i, k_j)          |S_i| = K
兩者都只在保留的集合上做 softmax：
A_ij = softmax_{j ∈ S_i}(q_iᵀ k_j / √d_k)，  o_i = Σ_{j ∈ S_i} A_ij v_j
```

G 是固定的全域位置集合，g 是學出來的選擇器。

</details>

## 機制四：KV 壓縮

**直覺**：KV cache 太大，一張 GPU 就放不下多少請求。存的是 K 和 V（不存 Q），所以減少 K、V 的量就直接省記憶體。

- **GQA**（[Grouped-Query Attention](https://arxiv.org/abs/2305.13245)）：多個 query head 共用一組 K、V，head 數通常除以 4 或 8。
- **MQA**：極端版，所有 query head 共用一組。
- **MLA**（[DeepSeek-V2](https://arxiv.org/abs/2405.04434)）：head 數不變，但每個 head 變小。主要只快取一個低維的潛在向量，用時再投影回各 head 的 K、V；論文為了相容 RoPE，另外多快取一個共用的「解耦 RoPE key」。

兩種可以並用。

<details>
<summary>公式：MLA</summary>

```
c_t^KV = W^DKV z_t                 （快取這個潛在向量，外加解耦的 RoPE key）
k_t^(h) = W^UK(h) c_t^KV,  v_t^(h) = W^UV(h) c_t^KV
```

W^D 負責壓縮，W^UK、W^UV 負責還原每個 head 的 K、V。

</details>

## 訓練長 context 模型：資料不夠長

架構讓百萬 token 算得動，但模型還得學會用。困難在資料：網路上連貫到 128K token 的文件很少，已經超過多數維基百科條目，要到整本書的等級。所以標準流程是：

```
短預訓練（4K–8K，資料多、便宜）→ 繼續訓練（32K–128K，長文件）→ 長度適應（128K+）
```

Neubig 特別提醒：把十份短文件**打包**成一條長序列，對效率有用，但模型學不到跨文件的注意力，對長 context 能力沒什麼幫助，其實最好別這樣做。要的是真正連貫的長資料。

## 位置編碼：RoPE、NoPE 與外推

**直覺**：模型需要知道 token 的順序。三種主流做法：

- **絕對位置編碼**：每個位置加一個向量（正弦餘弦或學出來的表），在進第一層之前就混進去。
- **RoPE**（[RoFormer](https://arxiv.org/abs/2104.09864)）：把 Q 和 K 依位置旋轉一個角度，兩個 token 的注意力分數只跟**相對距離**有關，絕對位置不影響它們要不要互相注意。Neubig 覺得它數學上很優雅，很多模型在用。
- **NoPE**：完全不用位置編碼。這聽起來違反直覺，Transformer 課常說沒有位置編碼，「this is a cat」和「this is not a cat」裡的 cat 會長得一樣。學生答出了關鍵：**因果遮罩**。第 2 個位置的 cat 只能看前 1 個 token，第 5 個位置的 cat 看得到前 4 個，從第一層注意力開始表示就不同了。[Kazemnejad 等（NeurIPS 2023）](https://arxiv.org/abs/2305.19466)主張自迴歸 Transformer 其實不需要位置編碼。搭配 Gated DeltaNet 這類帶衰減的局部層，順序資訊本來就在裡面。

**外推的問題**：RoPE 號稱只看相對位置，但如果只在長度 L 上訓練、拉到 sL 使用，模型從沒看過距離超過 L 的兩個 token 互動；而且因果遮罩等其他因素也有影響。所以不能拿 RoPE 直接跑長序列。常見修法：

- **Position Interpolation**（[Chen 等，2023](https://arxiv.org/abs/2306.15595)）：把 RoPE 的角度參數除以擴展倍數 s，等於把新範圍的位置壓回預訓練看過的相位範圍。
- **YaRN**（[Peng 等，ICLR 2024](https://arxiv.org/abs/2309.00071)）：精神上跟 KDA 類似，不同頻率不同處理。長波長的維度完整內插，短波長的維度保留原本的局部區分，中間漸變；再加一個注意力溫度修正。

<details>
<summary>公式：絕對位置、RoPE、PI 與 YaRN</summary>

**絕對位置（正弦）**：

```
z_t = E[x_t] + p_t
p_{t,2ℓ} = sin(t / ω_ℓ),  p_{t,2ℓ+1} = cos(t / ω_ℓ),  ω_ℓ = 10000^(2ℓ/d)
```

**RoPE**：R(t) 是由角度 tθ_ℓ 組成的區塊對角 2D 旋轉。V 不轉。

```
q̃_i = R(i) q_i,  k̃_j = R(j) k_j
q̃_iᵀ k̃_j = q_iᵀ R(j − i) k_j        分數只跟 j − i 有關
```

**Position Interpolation**：s = L′ / L，每個維度同倍率拉伸。

```
R(t) → R(t / s)，等價於 θ_ℓ → θ_ℓ / s
```

**YaRN**：γ_ℓ 在長波長為 0（完全內插）、短波長為 1（保留原相位）。

```
θ′_ℓ = (1 − γ_ℓ) θ_ℓ / s + γ_ℓ θ_ℓ
A = softmax((QKᵀ + M) / (τ √d_k)),   √(1/τ) = 0.1 ln s + 1
```

投影片把溫度寫成 1/τ = 0.1 ln s + 1；YaRN 論文（式 15）的原式是 √(1/τ) = 0.1 ln s + 1，也就是 q、k 各乘 √(1/τ)，這裡依論文。投影片註明：τ 的公式是在 LLaMA 上擬合的（論文寫的是 LLaMA 7B 到 65B，並說同一組值對 Llama 2 也大致適用），是配方不是通用常數。溫度修正是為了抵消擴展倍數變大時注意力熵的漂移。

</details>

各家怎麼走到最大長度（依投影片）：

| 模型 | 長度訓練 | 位置方法 | 怎麼到最大 context |
|---|---|---|---|
| Qwen3.8-Flash-Next | 原生 262K，課程細節未公開 | 部分 RoPE | YaRN 擴到 1M |
| DeepSeek V4 | 4K → 16K → 64K → 1M | 部分 RoPE | 漸進訓練 + YaRN |
| GLM-5.3-Flash | 原生 1M，課程細節未公開 | 主注意力 NoPE | 不需 RoPE 縮放 |
| Kimi K3 | 8K → 64K → 256K → 1M | NoPE | 漸進訓練到 1M |
| Nemotron 3 Ultra | 1M 長 context 繼續預訓練，SFT 到 512K | Mamba 隱含順序，無 RoPE | 在長長度上訓練與評測 |
| Inkling | 1M，課程未公開 | 相對位置嵌入 | 學出來的相對表示 |

（依投影片。對照來源的補充：DeepSeek V4 論文沒提到 YaRN，YaRN 只出現在它 HF config 裡的設定；GLM-5.3-Flash 的 1M 與 NoPE 同樣只見於 config；Nemotron 3 Ultra 的長 context 階段有 92% 的迭代跑在 1M、8% 在 4K。）

Neubig 的觀察：大約一半用（部分）RoPE，一半乾脆不用位置編碼。

## 長 context 的訓練資料

四類來源：

- **長文件**：書、程式碼庫（通常很連貫，一整個 repo 就很多 token）、同主題的多文件語料。他也看過有人用專利，因為公開量大、彼此可以串起來。
- **打包樣本**：token 利用率高，但要注意邊界和跨樣本洩漏；只能教模型處理 context 尾端附近的資訊，教不了全域一致性。
- **Agent 軌跡**：現在的大宗來源，agent 稍微互動一下就能產生很長的軌跡，能教長期恢復、狀態追蹤和工具使用。
- **合成任務**：把證據和干擾項放在設計好的位置，很多評測就是這樣做的。

Neubig 點出一個產業現實：閉源模型連架構都不公開；開放模型不公開架構你就跑不了，所以它們守的是資料和訓練策略。從公開資訊能看到的共同配方是：**連貫的長來源 + 答案依賴遠處證據的任務 + 漸進式拉長**（例如 Kimi K3 的 8K → 64K → 256K → 1M、GLM-5 的 32K → 128K → 200K）。

## Context 平行化

訓練時的平行化，學生答出了資料平行和模型平行（專家平行、張量平行、管線平行都是模型平行的變體）。長 context 還需要第三種：**context 平行**（[Ring Attention](https://arxiv.org/abs/2310.01889)）。把序列切成幾段分到不同裝置，一段一段算 K、V 再傳給下一個裝置，通訊和區塊注意力重疊。投影片的寫法是每台裝置的記憶體降到 1/P、總計算量不變（論文的說法是可處理的 context 長度隨裝置數線性增加），而且是精確計算而不是稀疏近似。超過 32K 左右就很重要。

Neubig 分享一個團隊衝突：做模型的人說「我要 Kimi Delta Attention」，做基礎設施的人說「那我得先寫出支援反向傳播的 context 平行 kernel」。他自己想對一個較小的 Qwen 模型開 context 平行，結果網路上找不到 Gated DeltaNet 的 kernel，只能自己寫或換做法。標準注意力、滑動視窗這些 kernel 好寫得多，麻煩的都是非標準的注意力。

---

# Harness 層：寫 agent 的人每天要管的事

## Prompt cache：前綴一樣就不用重算

這一段 Neubig 強調：就算你不實作模型、只是跑 agent，也非常重要。

**機制**：第 1 次呼叫，輸入經過 prefill 算出 KV，輸出在 decode 時也加進 KV cache。工具結果是新的（不是模型算出來的），成為第 2 次呼叫的新輸入，但前面的部分可以直接重用快取，只 prefill 新增的那段。如此反覆，可重用的前綴一路變長。到第 50 步，沒有快取就是把輸入重算 50 次。[Prompt Cache](https://arxiv.org/abs/2311.04934) 的實驗顯示：隨長度增加，不快取的計算量呈二次方成長，快取則大致是線性。

**錢的差距**：投影片整理了各家官方價格（2026 年 8 月 30 日查價，每百萬 token 美元；「快取」指快取命中，建立快取可能另計費）：

| 模型 | 快取輸入 | 一般輸入 | 輸出 |
|---|---|---|---|
| DeepSeek V4 Flash | 0.007–0.014 | 0.22–0.44 | 0.66–1.32 |
| GLM-5.2 | 0.26 | 1.40 | 4.40 |
| Kimi K3 | 0.30 | 3.00 | 15.00 |
| GPT-5.6 Luna | 0.02 | 0.20 | 1.20 |
| GPT-5.6 Sol | 0.40 | 4.00 | 20.00 |
| Claude Opus 5 | 0.50 | 5.00 | 25.00 |

**2026 年 9 月 29 日再查一次官方頁面**：GLM-5.2、Kimi K3、GPT-5.6 Luna／Sol（Standard 方案、短 context 價）、Claude Opus 5 都與投影片相同。DeepSeek 已經變了：9 月 10 日 V4 Flash 下架，由 `deepseek-flash`（V4.1-Flash）取代並降價，現在是快取 0.003–0.006、一般輸入 0.15–0.30、輸出 0.60–1.20（DeepSeek 的區間都是離峰到尖峰），舊的 `deepseek-v4-flash` 名稱會導到新模型、照新價計費。另外，投影片引用的 Kimi 定價連結現在會導到消費者會員頁，API 價格要看 [Kimi 開放平台定價頁](https://platform.kimi.ai/docs/pricing/chat)。

大致規律：快取 token 比一般輸入便宜約十倍，輸出又比一般輸入貴約五倍，所以輸出和快取輸入差到五十倍。你得清楚知道自己的 token 有沒有被快取，否則會為 agent 付很多冤枉錢。好的快取命中率是多少？學生答 80–90% 和 95% 以上，Neubig 自己的標準是 **90–95% 算相當好**。投影片也提醒：實測的物理成本和 provider 的 API 標價是兩回事。

**服務端怎麼做**：兩個最流行的開源推論框架都建立在 KV 管理的創新上。

- **vLLM 的 [PagedAttention](https://arxiv.org/abs/2309.06180)**：把 GPU 記憶體切成實體區塊，像作業系統管理分頁一樣用區塊表對應，一條序列的 KV 可以散在第 7、1、3 塊。目的是同時生成很多序列，結束時整塊釋放。
- **SGLang 的 [RadixAttention](https://arxiv.org/abs/2312.07104)**：用 radix tree 存已經算過的前綴，新請求進來就比對、重用共同前綴、接上後綴，記憶體不夠就逐出最久沒用的葉子。它原本是為了 ChatGPT 這種接續對話設計的，現在對 agent 更重要，因為 agent 的對話更長、更頻繁。
- **快取感知路由**：多台機器時，請求要送到擁有最長可重用前綴的機器，同時考慮排隊長度。投影片把分數簡化成「可重用前綴長度減去排隊懲罰」；[SGLang v0.4](https://lmsys.org/blog/2024-12-04-sglang-v0-4/) 部落格的實際做法是在路由器上維護各 worker radix tree 的近似副本、預測前綴命中率，把請求送往命中率高的 worker，再另外做負載平衡避免失衡。

OpenRouter 上各 provider 的快取命中率差很多（Neubig 又點名 Mistral 墊底），但這不一定代表 provider 差，也可能是工作負載不同。影響命中率的因素包括路由做得好不好，以及**快取保留多久**。provider 不會永遠留著你的快取；Neubig 印象中 Anthropic 過去是 5 分鐘，現在可以付多一點延長到 1 小時。[Anthropic prompt caching 文件](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)的現況是：預設存活 5 分鐘，每次命中會免費重新計時；另有 1 小時選項，寫入快取的價格是一般輸入的 2 倍（5 分鐘版是 1.25 倍），讀取則多數模型是 0.1 倍。對使用者不利的是：不管 provider 的路由和逐出做得多差，你付的價格都一樣。

有學生問 provider 會不會做多層快取（GPU、CPU 記憶體、磁碟），Neubig 說他不確定，但 GPU 記憶體很寶貴，卸載到 CPU 是常見做法；商用 provider 的自研系統大概比開源的更精細，這就是他們的競爭力。

## 別親手打破快取

快取只在**整個前綴完全相同**時才有效。投影片的四條原則：

- **穩定前綴**：指示、工具定義、範例放前面，不要動。
- **變動的狀態往後加**：新的使用者輸入、觀察。
- **避免無謂變動**：時間戳、重新排序的 schema。
- **量測重用**：看快取 token 數、TTFT、逐出狀況。

Neubig 舉的地雷：

- **每步改 system message**：等於完全沒有快取。
- **把目前時間放進 system prompt**：很合理的念頭，想讓 agent 知道現在幾點，但時間每步都變。真的需要，就放在最後一則使用者訊息或工具結果裡。
- **每步路由到不同模型**：這步看起來很難，交給強模型，接下來三步交給便宜模型省錢。問題是切回強模型時它沒有你的快取，又要付十倍價錢。想省錢，切換頻率要很節制。

## Compaction：context 快滿時怎麼辦

Neubig 問有多少人在日常 coding agent 裡看到「context 壓縮」訊息會開心，沒人舉手。原因很明顯：做不好，agent 就開始忘事、做別的事，甚至刪掉你的檔案。

投影片的例子：CI 逾時 → 檢查 log → 24K 行 log 裡一直出現「address already in use」→ 設 `--workers=1` 重跑 → 測試通過、log 存在 `/tmp/ci.log`。壓縮後只剩：

```
目標：修 CI 逾時
原因：port 衝突
已驗證：--workers=1 可通過
證據：/tmp/ci.log
下一步：用測試過的 worker 設定開 PR
```

**把 compaction 看成狀態估計**：把完整歷史 H 壓成一個有 token 上限 B 的工作狀態 ŝ，目標是讓 agent 之後的行為跟看著完整歷史時一樣（甚至更好），同時保留回頭找原始證據的路。

<details>
<summary>形式化：三個要求</summary>

```
ŝ_t = C(H_t; B),   |ŝ_t| ≤ B                   有界表示
p(A_future | H_t) ≈ p(A_future | ŝ_t)         行為保真
精確複製錨點、保留指向原始證據的指標             可恢復
```

H 是完整歷史，ŝ 是壓縮後的工作狀態，B 是 token 預算，A_future 是未來的動作。

</details>

**什麼該留下**：

| 處理方式 | 內容 |
|---|---|
| 原樣保留：錨點 | 目標、限制條件（例如使用者一開始說的話） |
| 編碼：檢查點 | 決策、進度、各種 ID |
| 原樣保留：近期尾巴 | 目前的嘗試、最新結果 |
| 外存：證據庫 | 24K 行 log → 3 個失敗 + 指令 + 檔案路徑（[MemGPT](https://arxiv.org/abs/2310.08560) 的外存再取回思路） |
| 丟掉 | 重複的內容、被取代的舊嘗試 |

Neubig 補充：學生抱怨 agent 忘了 session 最開頭的話，可能是你用的 agent 工具設計有缺陷，好的工具會刻意不刪開頭。另外，終端機 coding agent 通常會把完整歷史存在磁碟某處，知道位置的話，就算壓縮丟了東西，也可以叫 agent 回去讀。

**四個策略決定**（投影片列了 [Codex](https://github.com/openai/codex)、[OpenCode](https://github.com/anomalyco/opencode)、[Pi](https://github.com/earendil-works/pi)、[Hermes Agent](https://github.com/NousResearch/hermes-agent)、[OpenHands](https://github.com/OpenHands/OpenHands) 當參考實作）：

1. **觸發**：token 門檻（例如超過 200K 就壓）、provider 硬上限溢位、使用者手動（很多工具有 `/compact`）；要預留下一次輸出的空間。
2. **選範圍**：保護開頭、保留近期尾巴、壓縮中間較舊的部分；切點要落在合法的回合或工具邊界。
3. **替換成什麼**：可讀摘要、結構化檢查點（有時要求呼叫一個工具，規定摘要必須包含哪些欄位）、或 provider 的不透明物件。Neubig 說目前大概只有 OpenAI 會壓成你讀不懂的加密內容，因為不想讓人偷走壓縮演算法。[OpenAI 文件](https://developers.openai.com/api/docs/guides/compaction)確實寫明它的 compaction（`/responses/compact` 端點或伺服器端自動壓縮）回傳的是加密、不透明、「不打算讓人讀懂」的項目；「只有 OpenAI」與「怕演算法被偷」則是講者的說法。
4. **恢復**：原始歷史不動、保留可搜尋的歷史、壓縮失敗時要定義好行為（重試或重置）。

這五個參考實作實際上怎麼做？以下是打開各 repo 2026-09-29 版本的原始碼與文件整理的結果（預設值都可以改）：

| 專案 | 觸發 | 保留原樣 | 換成什麼 | 恢復與失敗 |
|---|---|---|---|---|
| [OpenHands](https://github.com/OpenHands/software-agent-sdk/blob/2b9502cee3b74e879bb23fa13d0c689c5d73931b/openhands-sdk/openhands/sdk/context/condenser/README.md)（壓縮邏輯在 `software-agent-sdk` 的 condenser） | 事件數超過 `max_size`（預設 240）、token 超過 `max_tokens`，或使用者／agent 明確要求 | 開頭 `keep_first` 個事件（預設 2）與後半段事件 | 前半段事件換成一則 LLM 摘要 | 事件日誌只增不刪，壓縮以一個標記事件記錄；明確要求卻無法照常規切時，改做 hard context reset，把整段都摘要掉 |
| [Codex](https://github.com/openai/codex/blob/eefe0ce1a8e39788a4de7ef5bafd47e51339610b/codex-rs/core/src/compact.rs) | `model_auto_compact_token_limit`、回合結束時的視窗百分比門檻、`/compact` | 近期的使用者訊息（由新往舊，上限約 20K token） | provider 支援遠端 compaction 時走遠端端點，回傳帶 `encrypted_content` 的 `Compaction` 項目；否則用 [「CONTEXT CHECKPOINT COMPACTION」提示](https://github.com/openai/codex/blob/eefe0ce1a8e39788a4de7ef5bafd47e51339610b/codex-rs/prompts/templates/compact/prompt.md)寫一份交接摘要 | 本地路徑重建的新歷史只有保留下來的使用者訊息加摘要，摘要前面接一段交接前言（「另一個模型已經開始解這個問題」） |
| [OpenCode](https://github.com/anomalyco/opencode/blob/2fa3363c924c5c3e367b84a87ae478296a0ed59b/packages/opencode/src/session/compaction.ts) | 用量達到「輸入上限減保留緩衝（預設最多 20K）」；`compaction.auto` 可關閉 | 近期尾巴（依模型 2K–15K token），切點落在回合邊界 | [固定段落的摘要](https://github.com/anomalyco/opencode/blob/2fa3363c924c5c3e367b84a87ae478296a0ed59b/packages/core/src/session/compaction.ts)：Objective、Important Details、Work State、Next Move、Relevant Files；可另外開 prune，清掉較舊的工具輸出 | 再次壓縮時把上一份摘要一起餵給摘要模型 |
| [Pi](https://github.com/earendil-works/pi/blob/1b347794e2a630e4359f2584f4eea388145d0ddf/packages/coding-agent/docs/compaction.md) | `contextTokens > contextWindow − reserveTokens`（預設 16,384）、provider 溢位錯誤、`/compact [指示]` | 最近 `keepRecentTokens`（預設 20K）；切點不能落在工具結果上 | Goal、Constraints & Preferences、Progress、Key Decisions、Next Steps、Critical Context，加上讀過與改過的檔案清單 | 被省略的原始紀錄仍留在 session 檔；溢位後的恢復壓縮失敗就不再自動重試 |
| [Hermes Agent](https://github.com/NousResearch/hermes-agent/blob/a7c2df3846f7d6040dd81b7573bd962da546222e/website/docs/developer-guide/context-compression-and-caching.md) | 預設用到 50% 視窗就壓（[視窗小於 512K 時提高到 75%](https://github.com/NousResearch/hermes-agent/blob/a7c2df3846f7d6040dd81b7573bd962da546222e/agent/context_compressor.py)） | 開頭 `protect_first_n`（預設 3 則）與依 token 預算保留的尾巴，不拆開工具呼叫與結果 | 先把舊工具輸出換成佔位字串，再由輔助模型寫結構化摘要 | 再次壓縮時要求模型「更新」上一份摘要；repo 另附一套量回想率的 [compaction 評測](https://github.com/NousResearch/hermes-agent/blob/a7c2df3846f7d6040dd81b7573bd962da546222e/evals/compaction/README.md) |

對照講者的說法：「好的工具會刻意不刪開頭」在 OpenHands 與 Hermes 是字面上的設定（`keep_first`、`protect_first_n`）；Codex 保留的是近期使用者訊息，Pi 與 OpenCode 則靠摘要裡固定的目標、限制欄位把開頭帶下去。

**反覆壓縮會漂移**：每次摘要都繼承上一次的檢查點。「使用 CUDA 12.4」→「使用 CUDA 12.x」→「使用較新的 CUDA」→ 限制條件消失。對策還是那三條：錨點原樣複製、保留近期尾巴、需要時回去取原始證據。投影片引用 [ReSum](https://arxiv.org/abs/2509.13313) 作為摘要接續式 agent 的例子。上表的 OpenCode、Pi、Hermes Agent 都把上一份摘要餵回去做增量更新，正是漂移會累積的那條路，所以更需要錨點與可回頭的原始紀錄。

**要用接續任務來評**：植入狀態（限制、決策、產物）→ 套用正式的壓縮策略 → 讓 agent 繼續，量後面的決策。看四件事：狀態回想（限制與 ID 記不記得）、任務成功、效率（token、延遲、成本）、穩定度（壓很多次之後還行不行）。

Neubig 講了一個 OpenHands 早期的故事。他們認為自己做出了最早一批工業等級的壓縮演算法，在 [SWE-bench](https://www.swebench.com/) 上花一個月調，分數完全沒掉、還省了一堆 token。實際上線後卻開始犯蠢：每壓縮一次就開一個 PR，因為它忘了已經開過，同一個功能收到五個 PR；也會忘掉使用者在對話中途補的指示，因為評測只用了單一使用者訊息的任務。教訓是：除非評測集真的涵蓋所有使用情境，否則一定要在真實條件下測。

**對應 [A1](/posts/ai/2026-09-29-cmu-11768-assignment-1-harness)**：Part 2 要你在共用的 `Agent` 裡實作模型生成的工作記憶（不能用 provider 的 compaction 端點）：只摘要舊的前綴，原樣保留 system 與任務訊息，至少保留最新一個完整的 assistant 動作與它對應的工具觀察；然後比較有無 compaction 的 token 用量，寫下取捨。

## 課後問答

- **Subagent 算不算 context 管理？** 算，但後面的講次才談。

## 指定讀物與延伸文獻

課表這一講沒有列「必讀」，只列了一長串參考文獻。挑幾篇最值得讀的：

- 架構：[Gated Delta Networks](https://arxiv.org/abs/2412.06464)、[Kimi Linear](https://arxiv.org/abs/2510.26692)、[DeepSeek Sparse Attention](https://arxiv.org/abs/2512.02556)
- 位置：[RoFormer](https://arxiv.org/abs/2104.09864)、[NoPE Length Generalization](https://arxiv.org/abs/2305.19466)、[YaRN](https://arxiv.org/abs/2309.00071)
- 服務：[DistServe](https://arxiv.org/abs/2401.09670)、[PagedAttention](https://arxiv.org/abs/2309.06180)、[SGLang](https://arxiv.org/abs/2312.07104)、[Prompt Cache](https://arxiv.org/abs/2311.04934)
- Compaction：[MemGPT](https://arxiv.org/abs/2310.08560)、[LongLLMLingua](https://aclanthology.org/2024.acl-long.91/)、[ReSum](https://arxiv.org/abs/2509.13313)

## 今晚就能做的事

**量你自己 agent 的快取命中率**。拿最近一個跑超過 20 步的 session，把每次 API 回應裡的快取 token 數（例如 cached tokens 或 cache read 欄位）和總輸入 token 加總，算出比例。低於 90%，就打開你的 system prompt 找三樣東西：時間戳、每步會變的狀態、會重新排序的工具清單，把它們移到最後一則訊息。

**替你的 compaction 寫一個接續測試**。在對話第 3 輪插一句限制（例如「不要動 `config/` 資料夾」），把門檻調低到會觸發兩次壓縮，再給一個會誘惑它去改 `config/` 的任務，看它記不記得。

## 它在課程裡的位置

[L2](/posts/ai/2026-09-29-cmu-11768-lecture-02-tool-use) 讓 agent 會用工具，L3 處理工具用多了之後 context 塞爆的問題。下一講 [L4](/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory) 談 Skills 與 Memory，Neubig 的說法是：那是「跨越整段工作時間、更長的 context」。

## 延伸閱讀

- [CMU 11-768 導讀系列總覽](/posts/ai/2026-09-29-cmu-11768-course-overview)：整門課的地圖與各篇索引
- [CS336 Lecture 4：Attention 不只一種，MoE 也不是免費擴大模型](/posts/ai/2026-08-22-cs336-attention-moe)：本篇模型層的前置
- [CS336 Lecture 10：LLM 推論的核心不是少算，而是少讀權重與 KV cache](/posts/ai/2026-08-22-cs336-inference)：prefill／decode 與 KV cache 的系統觀點
- [Context Engineering：為什麼你的 AI Agent 問題出在資訊，不在模型](/posts/ai/2026-03-24-context-engineering-guide)：harness 層的實務整理
- [Stanford CS329Z 導讀 Week 4：ReAct 與 MemGPT](/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory)：MemGPT 外存記憶的另一種講法

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：依字幕核對影片內容。修正兩處字幕找不到的說法：DeltaNet「很像線上學習」、課後問答中的「替代架構」一問。

## 參考資料

以下來源都已打開全文或官方頁面核對（2026-09-29）：

- [CMU 11-768 AI Agents 課程網站](https://www.cmu-agents.com/)
- [Lecture 3 投影片：Context Management for Long-Context Agents](https://www.cmu-agents.com/slides/lecture-03-long-context.pdf)
- [Lecture 3 錄影](https://www.youtube.com/watch?v=AiwCCvFW1uE)
- [DistServe（arXiv 2401.09670）](https://arxiv.org/abs/2401.09670)
- [Needle in a Haystack](https://github.com/gkamradt/needle-in-a-haystack)
- [Attention Is All You Need（arXiv 1706.03762）](https://arxiv.org/abs/1706.03762)
- [Longformer（arXiv 2004.05150）](https://arxiv.org/abs/2004.05150)
- [Generating Long Sequences with Sparse Transformers（arXiv 1904.10509）](https://arxiv.org/abs/1904.10509)
- [Transformers are RNNs（arXiv 2006.16236）](https://arxiv.org/abs/2006.16236)
- [Linear Transformers Are Secretly Fast Weight Programmers（arXiv 2102.11174）](https://arxiv.org/abs/2102.11174)
- [Gated Delta Networks（arXiv 2412.06464）](https://arxiv.org/abs/2412.06464)
- [Kimi Linear（arXiv 2510.26692）](https://arxiv.org/abs/2510.26692)
- [DeepSeek-V3.2 / DeepSeek Sparse Attention（arXiv 2512.02556）](https://arxiv.org/abs/2512.02556)
- [Grouped-Query Attention（arXiv 2305.13245）](https://arxiv.org/abs/2305.13245)
- [DeepSeek-V2 / MLA（arXiv 2405.04434）](https://arxiv.org/abs/2405.04434)
- [RoFormer（arXiv 2104.09864）](https://arxiv.org/abs/2104.09864)
- [NoPE Length Generalization（arXiv 2305.19466）](https://arxiv.org/abs/2305.19466)
- [Position Interpolation（arXiv 2306.15595）](https://arxiv.org/abs/2306.15595)
- [YaRN（arXiv 2309.00071）](https://arxiv.org/abs/2309.00071)
- [Qwen3.8-Flash-Next 發布文](https://qwen.ai/blog?id=qwen3.8-flash-next)
- [GLM-5.3-Flash（Hugging Face 模型頁與 config）](https://huggingface.co/zai-org/GLM-5.3-Flash)
- [GLM-5 技術報告（arXiv 2602.15763）](https://arxiv.org/abs/2602.15763)
- [Kimi K3 技術報告（arXiv 2607.24653）](https://arxiv.org/abs/2607.24653)
- [NVIDIA Nemotron 3 Ultra Technical Report](https://research.nvidia.com/labs/nemotron/files/NVIDIA-Nemotron-3-Ultra-Technical-Report.pdf)
- [Introducing Inkling（Thinking Machines）](https://thinkingmachines.ai/news/introducing-inkling/)
- [DeepSeek V4 技術報告（arXiv 2606.19348）](https://arxiv.org/abs/2606.19348)
- [Ring Attention（arXiv 2310.01889）](https://arxiv.org/abs/2310.01889)
- [Prompt Cache（arXiv 2311.04934）](https://arxiv.org/abs/2311.04934)
- [DeepSeek API 定價](https://api-docs.deepseek.com/quick_start/pricing/)
- [Z.AI API 定價](https://docs.z.ai/guides/overview/pricing)
- [Kimi 開放平台定價](https://platform.kimi.ai/docs/pricing/chat)
- [OpenAI API 定價](https://developers.openai.com/api/docs/pricing)
- [Anthropic Prompt Caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [OpenAI Compaction 指南](https://developers.openai.com/api/docs/guides/compaction)
- [PagedAttention / vLLM（arXiv 2309.06180）](https://arxiv.org/abs/2309.06180)
- [SGLang / RadixAttention（arXiv 2312.07104）](https://arxiv.org/abs/2312.07104)
- [SGLang v0.4 cache-aware load balancing](https://lmsys.org/blog/2024-12-04-sglang-v0-4/)
- [MemGPT（arXiv 2310.08560）](https://arxiv.org/abs/2310.08560)
- [LongLLMLingua（ACL 2024）](https://aclanthology.org/2024.acl-long.91/)
- [ReSum（arXiv 2509.13313）](https://arxiv.org/abs/2509.13313)
- Compaction 參考實作（皆為 2026-09-29 的 commit）：[OpenHands](https://github.com/OpenHands/OpenHands) 與 [software-agent-sdk condenser README](https://github.com/OpenHands/software-agent-sdk/blob/2b9502cee3b74e879bb23fa13d0c689c5d73931b/openhands-sdk/openhands/sdk/context/condenser/README.md)、[`llm_summarizing_condenser.py`](https://github.com/OpenHands/software-agent-sdk/blob/2b9502cee3b74e879bb23fa13d0c689c5d73931b/openhands-sdk/openhands/sdk/context/condenser/llm_summarizing_condenser.py)；[Codex `compact.rs`](https://github.com/openai/codex/blob/eefe0ce1a8e39788a4de7ef5bafd47e51339610b/codex-rs/core/src/compact.rs)、[`tasks/compact.rs`](https://github.com/openai/codex/blob/eefe0ce1a8e39788a4de7ef5bafd47e51339610b/codex-rs/core/src/tasks/compact.rs)、[compact 提示](https://github.com/openai/codex/blob/eefe0ce1a8e39788a4de7ef5bafd47e51339610b/codex-rs/prompts/templates/compact/prompt.md)、[摘要交接前言](https://github.com/openai/codex/blob/eefe0ce1a8e39788a4de7ef5bafd47e51339610b/codex-rs/prompts/templates/compact/summary_prefix.md)；[OpenCode `session/compaction.ts`](https://github.com/anomalyco/opencode/blob/2fa3363c924c5c3e367b84a87ae478296a0ed59b/packages/opencode/src/session/compaction.ts)、[`overflow.ts`](https://github.com/anomalyco/opencode/blob/2fa3363c924c5c3e367b84a87ae478296a0ed59b/packages/opencode/src/session/overflow.ts)、[摘要範本](https://github.com/anomalyco/opencode/blob/2fa3363c924c5c3e367b84a87ae478296a0ed59b/packages/core/src/session/compaction.ts)；[Pi compaction 文件](https://github.com/earendil-works/pi/blob/1b347794e2a630e4359f2584f4eea388145d0ddf/packages/coding-agent/docs/compaction.md)；[Hermes Agent context compression 文件](https://github.com/NousResearch/hermes-agent/blob/a7c2df3846f7d6040dd81b7573bd962da546222e/website/docs/developer-guide/context-compression-and-caching.md)、[`context_compressor.py`](https://github.com/NousResearch/hermes-agent/blob/a7c2df3846f7d6040dd81b7573bd962da546222e/agent/context_compressor.py)、[compaction 評測](https://github.com/NousResearch/hermes-agent/blob/a7c2df3846f7d6040dd81b7573bd962da546222e/evals/compaction/README.md)

---
title: "AI Engineer 面試日練 — 2026-11-13：Coding"
date: 2026-11-13
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: zh-TW
description: "星期五繼續練 Coding：Amazon LLM 團隊的面試題，要你用 NumPy 幫 Grouped-Query Attention 補上一個 decode step 的 KV cache，練的是分組索引怎麼算、cache 要接在哪個形狀上。"
tldr: "今天的練習題取自 Amazon onsite 面試（經 1Point3Acres 收錄）：用 NumPy 實作 GQA 的單步 decode——新 token 投影出 q、k_new、v_new 後，把 k_new、v_new 接進對應的 KV cache，再用 kv_idx = i // queries_per_group 讓每個 query head 找到它共用的那組 KV 做 attention。核心不是背 attention 公式，是講得出 GQA 其實是 MHA（n_kv_heads = n_heads）跟 MQA（n_kv_heads = 1）的推廣，以及 cache 的形狀為什麼是 (n_kv_heads, …) 而不是 (n_heads, …)。"
series:
  name: "AI Engineer 面試日練"
  order: 86
---

> 🌏 [English version](/posts/daily/2026-11-13-ai-interview-daily-en)

## 今日主題

星期五繼續練 Coding，今天的子類型是「LLM 推理內部機制的手刻實作」——面試官給你一個已經跑過 prefill、每層都有 KV cache 的 decoder-only transformer，要你用 NumPy 補上處理下一個新 token 的 decode step，而且用的是 Grouped-Query Attention（GQA）而不是教科書版的 Multi-Head Attention（MHA）。這題在 Amazon 的 LLM／infra 團隊 coding 輪出現過，考點不是「attention 公式背不背得出來」，是「你有沒有真的碰過推理服務怎麼省 KV cache 記憶體」。

這類題目現在幾乎是中大型模型面試的標配：Llama 3、Mistral、Qwen 2 全部用 GQA，而不是原始論文的 MHA，面試官想看的是你知不知道 query head 跟 KV head 可以是不同數量，以及這個差異會怎麼影響 cache 的形狀跟 index 計算。對 AI Engineer 來說，這題同時考三件事：attention 的基本機制、KV cache 的 append-only 結構、以及分組索引的邊界情況——三個環節漏掉任何一個，面試官都會覺得你只是背過名詞，沒真的實作過。

## 核心概念速記

```diagram
title: GQA decode step 怎麼決定每個 query head 用哪個 KV cache
desc: 新 token 先投影出 q、k_new、v_new，k_new、v_new 接進 KV cache 後，依 n_kv_heads 的設定決定這個 query head 查哪一組 KV，再做 attention 並輸出。
caption: 簡化示意：GQA 的一般情況是分組查表，n_kv_heads 等於 n_heads 或 1 是兩個退化邊界。
---
<svg viewBox="0 0 720 520">
  <path class="dg-line" d="M360 34V60" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 116V184" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 280V312" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M488 232H528" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M232 232H192" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 376V412" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M624 268V404Q624 412 616 412H368" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M96 268V404Q96 412 104 412H352" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 420V440" marker-end="url(#arrow)"/>

  <circle class="dg-dot" cx="360" cy="28" r="6"/>

  <g>
    <rect class="dg-box" x="228" y="60" width="264" height="56" rx="6"/>
    <text class="dg-label" x="360" y="80" text-anchor="middle" dominant-baseline="central">新 token 進來，先做投影</text>
    <text class="dg-sub" x="360" y="100" text-anchor="middle" dominant-baseline="central">產出 q（每個 head）、k_new、v_new</text>
  </g>

  <g>
    <path class="dg-box" d="M360 184L488 232L360 280L232 232Z"/>
    <text class="dg-label" x="360" y="222" text-anchor="middle" dominant-baseline="central">KV 來源怎麼決定？</text>
    <text class="dg-sub" x="360" y="244" text-anchor="middle" dominant-baseline="central">看 n_kv_heads 設定</text>
  </g>

  <g>
    <rect class="dg-box" x="228" y="312" width="264" height="64" rx="6"/>
    <text class="dg-label" x="360" y="334" text-anchor="middle" dominant-baseline="central">n_kv_heads = n_heads</text>
    <text class="dg-sub" x="360" y="356" text-anchor="middle" dominant-baseline="central">退化成 MHA：各 head 用自己的 KV</text>
  </g>

  <g>
    <rect class="dg-box" x="528" y="196" width="192" height="72" rx="6"/>
    <text class="dg-label" x="624" y="220" text-anchor="middle" dominant-baseline="central">一般情況（GQA）</text>
    <text class="dg-sub" x="624" y="244" text-anchor="middle" dominant-baseline="central">kv_idx=i//step</text>
  </g>

  <g>
    <rect class="dg-box" x="0" y="196" width="192" height="72" rx="6"/>
    <text class="dg-label" x="96" y="220" text-anchor="middle" dominant-baseline="central">n_kv_heads = 1</text>
    <text class="dg-sub" x="96" y="244" text-anchor="middle" dominant-baseline="central">退化成 MQA：共用同一組 KV</text>
  </g>

  <circle class="dg-dot" cx="360" cy="420" r="4"/>

  <g>
    <rect class="dg-box dg-box--accent" x="228" y="440" width="264" height="56" rx="6"/>
    <text class="dg-label" x="360" y="460" text-anchor="middle" dominant-baseline="central">各 head attention 後 concat</text>
    <text class="dg-sub" x="360" y="480" text-anchor="middle" dominant-baseline="central">過 W_o 輸出 token，cache 留給下一步</text>
  </g>

  <text class="dg-edge" x="424" y="310" text-anchor="middle" dominant-baseline="central">退化 MHA</text>
  <text class="dg-edge" x="508" y="222" text-anchor="middle" dominant-baseline="central">一般 GQA</text>
  <text class="dg-edge" x="212" y="222" text-anchor="middle" dominant-baseline="central">退化 MQA</text>
</svg>
```

### KV cache 是 append-only 的記憶結構

decode 階段每生成一個 token，就把這個 token 的 key、value 向量接到 cache 尾端，下一步的 attention 直接重用，不用對已經算過的 token 重跑一次 attention。cache 的形狀是 `(n_kv_heads, cur_len, d_head)`，重點是第一維是 **KV head 數**，不是 query head 數——這正是面試官最愛檢查的細節，因為兩者在 GQA 裡本來就不相等。

### MHA、GQA、MQA 其實是同一個函式的三種參數

GQA 不是三套獨立的實作，是同一個「分組共享 KV」機制的三個特例：`n_kv_heads == n_heads` 時每個 query head 都有自己的 KV，等於原始 Multi-Head Attention；`n_kv_heads == 1` 時所有 query head 共用一組 KV，等於 Multi-Query Attention；中間的任何值就是 GQA。面試時把這三者講成一個光譜，比分開記三套公式更容易在壓力下不出錯。

### 分組索引：`kv_idx = i // queries_per_group`

`queries_per_group = n_heads // n_kv_heads` 算出每組有幾個 query head 共用一組 KV，第 `i` 個 query head 要查第 `i // queries_per_group` 組的 KV cache。Llama 3 70B 是 64 個 query head、8 個 KV head，所以每 8 個 query head 共用 1 組 KV，這行索引算錯是這題最常見的扣分點。

### Decode step 跟 prefill 的差異只在 Q 的長度

prefill 階段要對整個 prompt 一次算完 attention，Q、K、V 的序列長度一樣長；decode 階段每步只新增 1 個 token，Q 只有長度 1，但 K、V 要用 cache 裡累積的全部長度去算 attention scores，形狀是 `(1, cur_len)` 而不是 `(cur_len, cur_len)`。沒注意到這個不對稱，很容易把 decode step 寫成重新跑一次完整 prefill。

## 今日練習題

### 題目

你拿到一個已經跑完 prefill 階段的 GQA decoder，每一層都有 `k_cache`、`v_cache`（shape 皆為 `(n_kv_heads, cur_len, d_head)`）。請用 NumPy 實作 `decode_step(x_new, W_q, W_k, W_v, W_o, k_cache, v_cache, n_heads, n_kv_heads)`：對這一個新 token 的 embedding 做投影，產出每個 query head 的 `q`，以及要接進 cache 的 `k_new`、`v_new`；把 `k_new`、`v_new` append 到對應的 cache；依分組規則讓每個 query head 找到它共用的 KV 做 scaled dot-product attention；把所有 head 的輸出 concat 後過 `W_o`；回傳這個 token 的輸出以及更新後的 `k_cache`、`v_cache`。禁止呼叫 PyTorch 或任何現成的 attention / KV cache API。

**來源**：Amazon onsite（經 1Point3Acres 收錄的「Implement GQA Multi-Head Attention Forward Pass with KV Cache」），LeetML 整理的 Amazon ML 面試指南把「attention with a KV cache …in numpy」列為 LLM／infra 團隊常把 coding 輪換上的題型　**難度**：進階　**環節**：onsite ML coding（LLM / infra team）

### 拆解思路

1. **先釐清問題**：是只處理單步 decode，還是要跑完整個 autoregressive loop？batch size 是不是 1？cache 有沒有容量上限（滿了要不要報錯）？面試官通常說「先寫單步 decode，loop 跟 batch 當加分題」。
2. **建立框架**：把 decode step 想成「複用 prefill 階段那套 `scaled_dot_product_attention`，只是 Q 的序列長度固定是 1，K、V 的序列長度是 cache 當前長度」。先寫好 append 的邏輯，再寫分組查表，最後才接 attention。
3. **深入核心**：append 時要確認維度對齊——`k_new` 的形狀是 `(n_kv_heads, 1, d_head)`，接到 cache 的 `axis=1`（時間維），不是 `axis=0`。分組查表用 `kv_idx = i // (n_heads // n_kv_heads)`，每個 query head 用這個 index 去 `k_cache[kv_idx]`、`v_cache[kv_idx]` 做 attention，而不是直接用 `k_cache[i]`（這是最常見的 off-by-mapping 錯誤）。attention scores 的 softmax 一定要先減最大值,因為 cache 長度會隨對話變長,數值穩定性只會越來越重要。
4. **收尾**：主動提兩個邊界 case——`n_kv_heads == n_heads` 時索引退化成 `kv_idx = i`，等於標準 MHA；`n_kv_heads == 1` 時所有 head 都查 `k_cache[0]`，等於 MQA——並說明怎麼驗證正確性：拿同一組權重，比較「decode step 累加 N 次」跟「對完整 N 個 token 的序列直接跑一次 prefill」兩種算法的輸出是否在浮點誤差內一致。

### 範例回答（面試時可以這樣講）

> **先講整體框架**：我會先確認 cache 的 shape 慣例是 `(n_kv_heads, cur_len, d_head)`，然後把 decode step 拆成三段——投影、append、attention——這樣每一段都能單獨測試。投影這段跟 prefill 共用同一組權重矩陣，差別只在輸入是單一 token 的 embedding，所以 `q` 的 shape 會是 `(n_heads, 1, d_head)`，`k_new`、`v_new` 是 `(n_kv_heads, 1, d_head)`。
>
> **append 跟分組查表是這題真正的核心**：`k_cache = np.concatenate([k_cache, k_new], axis=1)`，v 做同樣的事，接完之後 cache 長度會變成 `cur_len + 1`。分組部分我會先算 `queries_per_group = n_heads // n_kv_heads`，然後每個 query head `i` 用 `kv_idx = i // queries_per_group` 去拿它共用的那組 KV——**這行算錯是整題最容易扣分的地方，因為如果 `n_kv_heads` 剛好等於 `n_heads`，這個公式會自動退化成 `kv_idx = i`，也就是標準 MHA；如果 `n_kv_heads` 是 1，所有 head 都會指到同一組，也就是 MQA**，我會特別講這點證明我理解 GQA 不是獨立的第三套機制。
>
> **最後是 attention 跟驗證**：每個 head 算 `softmax(q[i] @ k_cache[kv_idx].T / sqrt(d_head)) @ v_cache[kv_idx]`，softmax 一樣先減最大值避免 overflow，所有 head 的輸出 concat 後過 `W_o` 就是這個 token 的輸出。我會主動提怎麼測試：拿同一組固定權重，跑「每步呼叫一次 decode_step，累積到第 N 步」，對照「一次性對前 N 個 token 跑完整 attention」，兩邊的輸出應該在浮點誤差內一致，這是我確認 cache 邏輯沒寫錯最直接的方式。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| KV cache 形狀是 `(n_kv_heads, cur_len, d_head)`，明確區分跟 query head 數不同 | |
| append 操作接在時間維（`axis=1`），不是 head 維 | |
| 分組索引用 `kv_idx = i // queries_per_group`，而不是直接用 `k_cache[i]` | |
| 講出 GQA 在 `n_kv_heads == n_heads` 退化成 MHA、`== 1` 退化成 MQA 兩個邊界 | |
| softmax 有先減最大值，講出為什麼隨 cache 變長更需要數值穩定性 | |
| 加分項：提到怎麼驗證（累積 decode step 跟一次性 prefill 的輸出要一致） | |

## 延伸閱讀

- [MHA vs GQA vs MQA: Attention & KV Cache Guide](https://machinelearningplus.com/gen-ai/mha-gqa-mqa-kv-cache/) — 用可執行的 NumPy 程式碼把 MHA、MQA、GQA 三種寫法跟 KV cache 記憶體公式都寫出來，今天的分組索引邏輯可以直接對照這篇驗證
- [GitHub: ai-engineering-interview-questions](https://github.com/ombharatiya/AI-Engineer-Interview-Questions) — 收錄「Autoregressive decode loop with vs. without KV cache」等可直接動手跑的從零實作題，適合練完今天這題後接著做對照
- [Amazon Machine Learning Interview Guide (2026)](https://leetml.org/company/amazon-ml-interview-guide.html) — 整理 Amazon ML 面試各輪的真實報告，說明 LLM 團隊的 coding 輪會把標準演算法題換成「attention with a KV cache…in numpy」這類從零實作題

## 參考資料

- [Implement GQA Multi-Head Attention Forward Pass with KV Cache (Amazon)](https://www.1point3acres.com/interview/problems/f082d70a-be84-546e-9a0b-da64107d91fb) — 今日練習題的原始來源，1Point3Acres 收錄的 Amazon ML Engineer onsite 面試題
- [Amazon Machine Learning Interview Guide (2026)](https://leetml.org/company/amazon-ml-interview-guide.html) — 佐證「attention with a KV cache」是 Amazon LLM／infra 團隊 Coding 輪會換上的真實題型，而非單一面試官的偏好
- [MHA vs GQA vs MQA: Attention & KV Cache Guide](https://machinelearningplus.com/gen-ai/mha-gqa-mqa-kv-cache/) — 「核心概念速記」裡 MHA／GQA／MQA 光譜說法與 KV cache 形狀慣例的技術參考來源

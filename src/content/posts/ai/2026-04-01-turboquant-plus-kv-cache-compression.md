---
title: "TurboQuant+ — 用兩階段量化把 KV Cache 壓到 2-bit，讓 MacBook 跑 100B 模型"
date: 2026-04-01
category: ai
tags: [turboquant, kv-cache, quantization, llm-inference, llama-cpp, apple-silicon]
lang: zh-TW
tldr: "TurboQuant+ 是 Google Research ICLR 2026 論文的開源實作，用 PolarQuant + QJL 兩階段量化壓縮 KV cache 達 3.8-6.4x，讓消費級硬體跑更大模型和更長上下文。"
description: "介紹 TurboQuant+ 的核心量化原理（PolarQuant、QJL）、K/V 不對稱壓縮策略、三大研究發現、壓縮效果數據，以及在 Mac 上搭配 llama.cpp 的實際使用方式。"
draft: false
---

LLM 推論的記憶體瓶頸不只是模型本身——當 context 拉長，**KV cache 才是真正的記憶體殺手**。一個 70B 模型在 128K context 下，KV cache 輕鬆吃掉 40GB 以上。TurboQuant+ 直接壓縮這塊記憶體，用兩階段量化達到 3.8-6.4 倍壓縮，而且品質幾乎無損。

## KV Cache 為什麼是瓶頸

Transformer 推論時，每個 token 的 attention 計算需要存取所有歷史 token 的 Key 和 Value 向量。這些向量以 fp16 儲存，記憶體消耗隨 context length 線性增長：

```
KV cache 大小 ≈ 2 × num_layers × num_heads × head_dim × context_length × 2 bytes
```

模型權重是固定的，但 KV cache 會隨對話越來越長不斷膨脹。這就是為什麼你的 MacBook 可以載入一個 32B 模型，卻在長對話時 OOM——不是模型太大，是 cache 吃光了。

vLLM 的 PagedAttention 解決了 KV cache 的記憶體碎片問題，TurboQuant 則從另一個角度切入：**直接把每個向量壓小**。

## Stage 1：PolarQuant — 旋轉 + 標量量化

PolarQuant 的核心觀察：高維向量正規化到單位球面後，座標近似 Gaussian 分佈，可以用最佳標量量化高效壓縮。

流程：

1. **提取 L2 norm**，將向量正規化為單位向量
2. **Walsh-Hadamard 隨機旋轉**（O(d log d)），把資訊均勻分散到各維度——避免某些座標特別大、某些接近零
3. **最佳標量量化**：用 Lloyd's algorithm 預計算 Gaussian 分佈的最佳碼本，逐座標量化
4. 儲存量化索引 + norm

旋轉這步是關鍵。沒有旋轉的話，outlier 維度會嚴重損害量化品質。Walsh-Hadamard transform 比隨機矩陣快（O(d log d) vs O(d²)），而且正交保距。

## Stage 2：QJL — 1-bit 殘差壓縮

PolarQuant 重建後必然有殘差。QJL（Quantized Johnson-Lindenstrauss）用極端壓縮方式保留殘差資訊：

1. 計算殘差 = 原始向量 - Stage 1 重建
2. 儲存殘差 L2 norm
3. 乘上隨機投影矩陣，取 **sign** → 每個維度只要 1 bit

Johnson-Lindenstrauss lemma 保證：隨機投影後，向量間的內積關係在高維下以高概率被保留。1-bit 雖然粗糙，但當維度夠高（LLM head_dim 通常 ≥ 64），統計上足以補償 Stage 1 的量化誤差。

兩階段合起來的壓縮效果：

| 格式 | Stage 1 | Stage 2 | 總 bits/element | 壓縮倍率 (vs fp16) |
|------|---------|---------|-----------------|-------------------|
| turbo2 | 1-bit | 1-bit | 2 | 6.4x |
| turbo3 | 2-bit | 1-bit | 3 | 4.6–5.1x |
| turbo4 | 3-bit | 1-bit | 4 | 3.8x |

## K/V 不對稱策略：最重要的設計決策

TurboQuant+ 對 Key cache 和 Value cache 採用不同的量化策略：

- **K cache** → `TurboQuant`（兩階段，PolarQuant + QJL）
- **V cache** → `TurboQuantMSE`（只用 PolarQuant，不加 QJL）

原因在於數學性質不同：

- 注意力分數計算是 **Q · Kᵀ**（內積），需要保留向量間的角度關係 → QJL 的 JL 性質正好保內積
- 注意力加權求和是 **softmax(scores) · V**（線性組合），只需要 MSE 最小化 → PolarQuant 本身就夠

這個不對稱設計來自專案的三大研究發現。

## 三個關鍵研究發現

### V 壓縮幾乎免費

Value cache 壓到 2-bit，注意力輸出的品質幾乎不變——前提是 Key 精度維持住。這個發現反直覺，但實驗數據很一致：V 的量化誤差會被 softmax 的加權平均稀釋掉。

### K 壓縮是品質劣化的唯一來源

所有可測量的品質下降都來自 Key cache 壓縮。這解釋了為什麼不對稱配置（高精度 K + 低精度 V）能大幅救回品質。turbo4 的 K 用 3+1 bit、V 只用 3 bit，就能做到近無損。

### 邊界層敏感

Transformer 的第一層和最後兩層對量化特別敏感。保護這些層（不壓縮或用更高精度），可以恢復 **37–91%** 的品質差距。這個策略成本很低——一個 32 層模型只多保護 4 層，記憶體增加不到 15%。

## 實際效能數據

turbo4 在 Apple M5 Max 上的實測：

| 指標 | turbo4 | q8_0 (基準) |
|------|--------|-------------|
| Perplexity | 6.125 | 6.111 |
| Prefill 速度 | ~2747 tokens/sec | — |
| Decode 速度 | ~0.9x baseline | 1x |
| 記憶體壓縮 | 3.8x | 1x |

Perplexity 只差 0.014，幾乎不可感知。而且這個差距在 turbo3、turbo2 時才開始明顯。

社群已在 M1–M5 Mac、NVIDIA RTX 3080 Ti / 3090 / 4090 / 5090、AMD RX 9070 XT 上驗證。

## 在 Mac 上怎麼用

### 目前狀態

TurboQuant+ 的 llama.cpp 整合正在推進上游 PR。現在有兩種方式體驗：

### 方式一：Python 原型（驗證原理）

```bash
git clone https://github.com/TheTom/turboquant_plus
cd turboquant_plus
pip install .

# 跑 demo 看壓縮效果
python benchmarks/demo.py

# 完整 benchmark
python benchmarks/run_benchmark.py
```

需求：Python 3.10+、NumPy、SciPy。這是數值驗證，不是真的在跑 LLM 推論。

### 方式二：llama.cpp + Metal（實際推論）

```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
cmake -B build -DGGML_METAL=ON
cmake --build build --config Release -j
```

`-DGGML_METAL=ON` 啟用 Apple Metal GPU 加速。`-ngl 99` 把所有層放上 GPU。

### Mac 硬體對照

| Mac 記憶體 | 建議模型 | 量化格式 | 預期效能 |
|-----------|---------|---------|---------|
| 16 GB | 7–8B | Q4_K_M | ~30-40 t/s |
| 36 GB | 14–32B | Q4_K_M | ~8-25 t/s |
| 64 GB | 70B | Q4_K_M | ~5-8 t/s |
| 96–128 GB | 104B @ 128K ctx | turbo4 | 實測可行 |

TurboQuant 的甜蜜點是 **32GB 以上 + 長 context 場景**——context 越長，KV cache 佔比越高，壓縮收益越大。短對話的話，傳統量化就夠用。

## 跟其他 KV cache 優化的比較

| 方法 | 策略 | 壓縮率 | 品質影響 |
|------|------|--------|---------|
| PagedAttention (vLLM) | 消除記憶體碎片 | ~1.25x | 零 |
| KV cache eviction | 丟掉不重要的 token | 可變 | 有損 |
| GQA / MQA | 共享 KV head | 4-8x | 訓練時決定 |
| KIVI / KVQuant | 逐 channel 量化 | 2-4x | 低 |
| **TurboQuant** | 旋轉 + 最佳量化 + JL 殘差 | **3.8-6.4x** | 極低 |

TurboQuant 的優勢在於：壓縮率高、不需要重新訓練、可以跟 PagedAttention 疊加使用。

## 整體來說

TurboQuant+ 是目前 KV cache 量化方案中壓縮率最高、理論基礎最扎實的開源實作。兩階段設計（PolarQuant 處理主體 + QJL 補殘差）在數學上優雅，工程上也足夠實用。

對 Mac 使用者來說，等 llama.cpp 上游 merge 後，這會是跑長 context 的殺手級優化——同樣的記憶體能撐 3-4 倍的 context length。36GB 的 M3 Pro 配合 turbo4，有機會在 32B 模型上穩定跑 32K 甚至更長的上下文。

## 參考資料

- [TurboQuant+ GitHub repo](https://github.com/TheTom/turboquant_plus)
- [llama.cpp GitHub repo](https://github.com/ggerganov/llama.cpp)
- [vLLM — 從 PagedAttention 到生產級 LLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine)
- [Ollama 本地 LLM 指南](/posts/ai/2026-03-14-ollama-local-llm-guide)

---
title: "CMU 11-868 L12–L13 TPU、JAX 與 Pallas：同一個 attention，在 TPU 上從 XLA 融合寫到 Splash Attention"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, hardware, compiler, attention]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 17
tldr: "Google 的 Srinath Mandalapu 用兩講、兩百多頁，把一個 attention 從 Python 一路追到 TPU 的 VLIW 指令。L12 講 JAX 生態、TPU Ironwood 的記憶體與運算單元，以及 XLA 怎麼把 attention 編成三個融合 kernel。L13 講 XLA 做不到的部分：用 Pallas 自己控制 HBM 與 VMEM 之間的搬運，寫出 FlashAttention，再加上區塊稀疏變成 Splash Attention。思路跟 GPU 相同，差別在於：TPU 上排程主要交給編譯器，要介入就得用 Pallas 把迴圈與區塊大小攬回自己手上。"
description: "CMU 11-868 LLM Systems（2026 春季版）兩堂 Google 客座導讀：L12 Introduction to JAX/XLA/TPU 與 L13 Pallas and Splash Attention。涵蓋 JAX AI stack、以 mesh 做資料平行與張量平行、TPU Ironwood 的 HBM／VMEM／MXU／VPU、XLA 的編譯管線與 attention 融合、GSPMD 與 shard_map、Pallas 的 grid 與 BlockSpec、tile 大小的調校、在 Pallas 寫 FlashAttention，以及 Splash Attention 的稀疏執行表。本系列把它從官方的 Week 7 移到 FlashAttention 之後。"
draft: false
glossary:
  - term: "Pallas"
    aliases: ["JAX Pallas"]
    definition: "JAX 的 kernel 撰寫擴充。用 Python 寫出對單一區塊的運算，再用 grid 與 BlockSpec 描述怎麼把大張量切塊、在 HBM 與晶片上記憶體之間搬運。"
    context: "L13 用它在 TPU 上實作 FlashAttention 與 Splash Attention。"
    links:
      - label: "Pallas 官方文件"
        url: "https://docs.jax.dev/en/latest/pallas/index.html"
  - term: "systolic array"
    aliases: ["脈動陣列"]
    definition: "由大量乘加單元排成的二維網格。資料在相鄰單元之間逐拍傳遞，中間結果不必回到記憶體。"
    context: "TPU 的矩陣乘單元 MXU 就是一個 256 × 256 的 systolic array（依 L12 講義）。"
  - term: "VMEM"
    aliases: ["vector memory"]
    definition: "TPU TensorCore 上的晶片內記憶體，容量遠小於 HBM，但頻寬高得多，角色類似 GPU 的 shared memory／SRAM。"
    context: "L12 與 L13 所有效能分析都圍繞著 HBM 與 VMEM 之間的搬運。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-tpu-jax-pallas-en)

**本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。** 這是 [CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)系列第 17 篇，接在 [L21 FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention)之後。

**關於順序**：在官方 [Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 裡，這兩講排在 Week 7（2/23、2/25），位於 LightSeq 與分散式訓練之間。本系列把它們移到 FlashAttention 之後，因為 L13 的主角 Splash Attention 就是 FlashAttention 的 tiling 思路搬到 TPU。先讀過上一篇，這裡只要跨一步：換硬體、換語言，演算法不變。正在上課的 [Fall 2026 Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus) 把同樣的兩講排在 9/28、9/30，並在 10/2 加了一堂「Recitation 6: JAX and TPU」；Week 13 另列兩講「Acceleration on TPU」，目前還沒有投影片。

兩講的講者都是 Google CoreML Frameworks 的 Srinath Mandalapu。官方材料是兩份投影片：[L12 Introduction to JAX/XLA/TPU](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-12-Introduction_to_JAX_XLA_TPU-f0450caf9e7e6707c009f7f77997a2be.pdf)（107 頁）與 [L13 Pallas and Splash Attention](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-13-pallas_splash_attention_srinath_mandalapu-b0bc7990950b84561ff9aa8e1791f727.pdf)（111 頁）。Syllabus 沒有替這兩講列 reading。存取等級 **A3**，但沒有錄影，而且講義裡的 profiling 數字都在 TPU Ironwood 上量測，校外讀者多半無法重現。頁碼以 PDF 檔為準。

整篇只回答一個問題：**換到 TPU 與 XLA，寫高效 kernel 的思路有什麼不同？**

## 課程影片來源

本篇依官方講義、投影片或作業導讀；本次檢查官方公開頁面，尚未核實本文對應講次的公開錄影。這不表示課程沒有錄影。

課程與錄影入口：

- [cmu-11-868-llm-systems — official course materials and recording index](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)

## 場景：同一個 attention，換一台機器

L12 第 3 頁的議程可以讀成一條路線：先用 JAX 訓練 GPT-2，再看 TPU 的硬體，然後追蹤 XLA 怎麼把程式編成硬體指令，最後是跨裝置的 sharding。L13 接著問：XLA 自動做的不夠好時，怎麼自己動手。

貫穿兩講的例子是 attention，跟上一篇 Tri Dao 講的是同一個運算。這讓兩篇可以直接對照。

## L12 上半：JAX 生態與 mesh

第 6–7 頁介紹 [JAX AI stack](https://jaxstack.ai/)：JAX 提供 NumPy API 與函式轉換（`jit`、`grad`、`vmap`），Flax NNX 與 Optax 負責神經網路與優化器，Orbax 與 Grain 負責 checkpoint 與資料載入。底層由 XLA 編譯器產生硬體碼，同一份程式可以跑在 CPU、GPU、TPU 上。

第 10–13 頁用一個 GPT-2 設定（24 層、序列長度 1024、embedding 1024、16 個 head、batch 32）示範分散式訓練，講義附了一份 [Colab notebook](https://github.com/yufengg/jax-in-action/blob/master/GPT2_transformers_workshop_IO_2025.ipynb)。重點是 **mesh**：把 8 個裝置排成一個有名字的二維格子。

| Mesh | 意義 | 通訊 |
|---|---|---|
| (8, 1)，軸名 ('batch', 'model') | 純資料平行：batch 切 8 份，每台 4 筆，模型完整複製 | backward 時 `@nnx.jit` 自動插入 All-Reduce |
| (4, 2) | 資料平行 4 份 × 張量平行 2 份：大型權重矩陣切給 2 台 | 組內交換部分 activation（All-Gather／Reduce-Scatter），組間聚合梯度 |

這裡已經看得出 JAX 的風格：**使用者宣告資料怎麼切，通訊由編譯器插入**。第 15 頁的 `nnx.with_partitioning` 在建立參數時就綁定切法。

## L12 中段：TPU Ironwood 的硬體

第 23 頁的規格（投影片數字）：每顆 Ironwood 晶片有 2 個 TensorCore 與 4 個 SparseCore，每顆 192 GiB HBM、頻寬 7380 GBps，BF16 峰值 2307 TFLOPs。第 24–26 頁講規模：64 顆晶片組成一個 3D torus 的「cube」，多個 cube 用光學電路交換（OCS）連成最多 9216 顆晶片的 superpod。

對寫 kernel 比較重要的是 TensorCore 內部：

- **記憶體分兩層**（第 28 頁）：HBM 容量 10–100 GiB 等級；晶片上的 VMEM 只有約 0.1 GiB，但頻寬高得多。投影片說，因為 VMEM 快，算術強度只有 10–20 的運算也能跑到峰值 FLOPs。
- **VPU**（第 30、32 頁）：向量單元是 8 × 128 的二維 SIMD 網格。資料的基本單位是 8 × 128 的向量暫存器（vreg），每個位置有 4 個 ALU。
- **MXU**（第 35 頁）：矩陣乘單元是 256 × 256 的 **systolic array**，共 65,536 個乘加單元，輸入用 bfloat16、累加用 FP32。權重先載入固定不動，activation 從上方斜著流入，部分和橫向累加，中間結果不必回到記憶體。第 36–44 頁用一個 3 × 3 的例子逐拍演示。
- **XLU**（第 34 頁）：跨 lane 搬資料的專用單元，例如做跨 lane 的 reduction。

跟 GPU 對照：GPU 程式設計的重心是 thread／warp／block 與 shared memory；TPU 的重心是**讓資料以 8 × 128 的形狀流過 VPU，以 256 × 256 的形狀流過 MXU**。

## L12 下段：XLA 怎麼編譯 attention

### 編譯管線

第 49–51 頁描述 `jax.jit(attention)` 被呼叫時發生什麼：

1. **Tracing**：用抽象的 tracer 跑一遍 Python，記錄成 Jaxpr，不做真正的運算。`print()` 這類 Python 副作用只在 tracing 時執行一次（第 53 頁）。
2. **Lowering**：Jaxpr → StableHLO → HLO。StableHLO 是跨框架、跨硬體的中介表示，JAX、TensorFlow、PyTorch 都能降到它（第 56 頁）。
3. **Compile**：HLO → 優化後的 HLO → LLO（TPU 專用的低階表示）→ 排程 → VLIW bundle → 可執行檔。

HLO 的特性決定了 XLA 能做什麼（第 58 頁）：它是無環圖、所有陣列維度在編譯時已知，所以記憶體用量可以在編譯時完全決定。

### Attention 被編成三個融合 kernel

第 63–73 頁拿一個 attention（Q、K 為 1024 × 512）追蹤 XLA 的輸出。XLA 把它融合成三個 kernel：

| 融合 | 做什麼 | 輸出 |
|---|---|---|
| 1. Logit & Max | QKᵀ、套 mask、逐列取最大值 | 最大值（1024）、masked logits（1024 × 1024） |
| 2. Softmax 分母 | 減最大值、取指數、逐列加總 | 指數和（1024） |
| 3. Attention 輸出 | **重算**指數、除以總和，再乘 V | 輸出（1024 × 512） |

第 68 與 70 頁特別講第 3 步的 rematerialization：與其把 1024 × 1024 的指數矩陣寫進 VMEM 再讀回來（投影片算出寫加讀共 8MB），不如在 VPU 上重算一次。投影片的原話是「Math is cheap; bandwidth is expensive」。這跟 FlashAttention backward 的重算是同一個取捨。

幾個 TPU 特有的細節：

- **Base-2 指數**（第 85 頁）：TPU 硬體原生支援 2 的冪次，所以 eˣ 被改寫成 2^(x · log₂e)。
- **VLIW**（第 74–75 頁）：編譯器把多個互相獨立的操作塞進一個 512 位元的指令包，同一拍一起發出。排程的複雜度從硬體移到編譯器，這是 TPU 跟 GPU 最根本的差別之一。
- **非同步搬運**（第 71–72 頁）：`copy-start`／`copy-done` 讓 V 從 HBM 搬到 VMEM 的同時，VPU 繼續做前一個融合。

第 92 頁的量測很有啟發：融合 1 與 3 的 FLOPs 使用率約 35%，融合 2 只有 0.32%，因為 softmax 全落在 VPU 上，MXU 閒著。

### Sharding：GSPMD 與 shard_map

第 94–105 頁回到多裝置。JAX 有兩種寫法：

- **`jit` + GSPMD**（第 98 頁）：使用者標註輸入輸出的切法，XLA 自動切分整張計算圖，並插入 All-Reduce、All-Gather 等通訊。
- **`shard_map`**（第 99 頁）：使用者寫的是每台裝置上的局部程式，通訊要自己呼叫，例如 `jax.lax.psum`、`jax.lax.all_gather`。

第 101 頁的例子：兩個矩陣都按列切分時，`jit` 版本會由編譯器自動在右矩陣上插入一個 All-Gather。兩者最後都編成同一種 SPMD 程式：每台裝置跑同一份指令，處理自己那一份資料（第 105 頁）。

## L13：XLA 不夠時，用 Pallas 自己來

### 為什麼需要自訂 kernel

L13 第 5 頁與第 59 頁把 L12 的三個融合拿出來檢討：

- 標準做法仍會把很大的 logit 與機率矩陣寫回 HBM，再讀回給下一個融合。
- 連最大值與指數和這種小向量，也寫回 HBM 再讀出來。
- VPU 在算指數與加總時，MXU 閒著。

Pallas 的定位是：你掌控**時間上**的流程（什麼時候搬、什麼時候算），後端處理**空間上**的佈局（8 × 128 的 tiling）。第 5 頁還說，Pallas 從 custom call 經 MLIR 直接降到 LLO，繞過 HLO，所以編譯器不會把你的手動安排重新排序。

### Pallas 的三個零件

第 16 頁列出 Pallas 能指定的記憶體空間：HBM（`ANY`）、VMEM、SMEM（純量記憶體）、SEMAPHORE。第 22–25 頁說明三個零件：

| 零件 | 角色 |
|---|---|
| `grid` | 迭代空間，kernel 會被呼叫 prod(grid) 次 |
| `BlockSpec` | 每個 grid 位置要從 HBM 搬哪一塊到 VMEM（`block_shape` 與 `index_map`） |
| `pallas_call` | 把 kernel、grid、BlockSpec 綁在一起，自動產生重疊搬運與計算的 pipeline |

第 25 頁把 `pallas_call` 講得很白：它本質上是一組巢狀 for 迴圈，每一輪取出對應的輸入區塊、呼叫 kernel、寫回輸出區塊。

第 19 頁示範不切塊的後果：不用 BlockSpec 時，Pallas 會試著把整個張量放進 VMEM，投影片說 VMEM 每個 core 約 32MB，一個 2048 × 2048 的 FP32 矩陣（16MB）加上工作空間就會 OOM。

<details>
<summary>講義第 18 與 23 頁：矩陣加法，從不切塊到切塊</summary>

```python
def add_matrices_kernel(x_vmem_ref, y_vmem_ref, z_vmem_ref):
    # 從 VMEM 載入暫存器、相加、寫回 VMEM
    z_vmem_ref[:, :] = x_vmem_ref[:, :] + y_vmem_ref[:, :]

# 第 18 頁：不切塊，整個張量搬進 VMEM
def add_matrices(x, y):
    return pl.pallas_call(
        add_matrices_kernel,
        out_shape=jax.ShapeDtypeStruct(x.shape, x.dtype),
    )(x, y)

# 第 23 頁：用 BlockSpec 切成 (bm, bn) 的區塊，pallas_call 自動做 pipeline
def add_matrices_pipelined_param(x, y, *, bm=256, bn=256):
    m, n = x.shape
    block_spec = pl.BlockSpec((bm, bn), lambda i, j: (i, j))
    return pl.pallas_call(
        add_matrices_kernel,
        out_shape=x,
        in_specs=[block_spec, block_spec],
        out_specs=block_spec,
        grid=(m // bm, n // bn),
    )(x, y)
```

</details>

### Tile 大小決定一切

第 38–45 頁用矩陣乘法說明怎麼判斷一個 kernel 是 compute-bound 還是 memory-bound。第 39 頁算出 Ironwood 每個 TensorCore 的臨界算術強度約 279 FLOPs/byte（峰值 1028.75 TFLOP/s 除以 HBM 頻寬），所以 FP32 的方陣乘法要 M > 1674 左右才會 compute-bound。

第 45 頁的實驗最直接：同一個 (4096, 7168) × (7168, 18432) 的矩陣乘法，

| Tile（bm, bk, bn） | 時間 | FLOPs 使用率 | kernel 呼叫次數 |
|---|---|---|---|
| 512, 512, 512 | 4.63 ms | 22.72% | 4032 |
| 1024, 1024, 1024 | 1.68 ms | 62.70% | 504 |

只改 tile 大小就快了 2.75 倍。講義的結論是：Pallas 調校的主要目標，是在塞得進 VMEM 的前提下找最大的 tile，讓 grid 盡量小。

第 48–52 頁再往下一層：`pallas_call` 自動做的是雙緩衝；需要更深的 pipeline 或特殊切法時，可以用 `pl.make_async_copy` 手動發 DMA，或用 `pltpu.emit_pipeline` 在 kernel 內部自己排。

### 在 Pallas 寫 FlashAttention

第 57–66 頁把上一篇的觀念原樣搬過來：每個 Q 區塊依序走過所有 K／V 區塊，維護逐列的 running max（m）與指數和（l），新區塊進來時用 alpha = exp(m_prev − m_next) 修正舊結果，最後一次才做除法（delayed normalization）。

然後是 TPU 上的調校故事。以 128 個 head、序列 4096、Q／K head 維度 192、V 維度 128 的設定（第 71–85 頁）：

| 版本 | 區塊（br, bc） | 時間 | MFU |
|---|---|---|---|
| 基準 | 1024, 2048 | 4.03 ms | 33.37% |
| 加大 Q 區塊 | 2048, 2048 | 3.36 ms | 39.73% |
| 再加 Max Logit Estimate | 2048, 2048 | 2.64 ms | 50.27% |
| 更大 | 4096, 4096 | — | 超出記憶體 |

中間穿插幾個只有在 TPU 上才會遇到的問題：

- **暫存器壓力**（第 75–76 頁）：用 Pacchetto 看 LLO bundle 的 trace，發現 vreg 100% 滿載，一直觸發 `VSTORE.SPILL`，MXU 斷斷續續在等資料。解法是 micro-tiling：把 bc = 2048 再切成 1024 的運算塊（第 82–86 頁）。
- **隱性補零**（第 79 頁）：head 維度 192 不是 256 的倍數，LLO 會自動補到 256，有四分之一的 MXU 在算零。
- **Max Logit Estimate**（第 84 頁）：用一個預先決定的常數取代每一塊的動態最大值，省掉 VPU 上的 `vmax` reduction。

### Splash Attention：稀疏 + Flash

第 87 頁以後是 L13 的標題主角。Splash 是「Sparse + Flash」（第 93 頁）：先把 mask 處理成一張稀疏執行表，kernel 只算有用的區塊。

- **Mask 分三類**（第 89–91 頁）：區塊全被遮住就整塊跳過；完全可見的區塊不需要 mask；部分可見的區塊才套細粒度 mask。第 90 頁的例子是 4096 × 4096 的 causal mask、區塊 [1024, 2048]：8 個區塊裡只剩 6 個要算，而部分可見的區塊只有 2 種不同的 mask 樣式要存。
- **執行表放在 SMEM**：`block_mask`、`active_rows`、`active_cols`、`mask_next` 等陣列每個 mask 只算一次，kernel 用它們算出下一個要載入的區塊位址，並預取下一個 mask 樣式。
- **Segment ID**（第 95–96 頁）：把多個樣本打包進同一條序列時，用 segment ID 保證 token 只看得到同一樣本的 token，再跟 causal 或 local mask 做 AND，合成一張執行表。
- **區塊大小的兩難**（第 94 頁）：大區塊（例如 2048）才餵得飽 MXU，但會在 causal mask 裡算很多零；小區塊（例如 512）跳得更精細，MFU 卻會掉。

講義附的實作在 [Tokamax](https://github.com/openxla/tokamax)（第 54 頁）：一個基於 JAX 與 Pallas 的自訂 kernel 函式庫，支援 NVIDIA GPU 與 TPU，[Splash Attention 的原始碼](https://github.com/openxla/tokamax/tree/main/tokamax/_src/ops/experimental/tpu/splash_attention)就在裡面。第 11 頁另外提到推論端的 Paged Attention 也用 Pallas 寫，指向 [vLLM 的 TPU 推論專案](https://github.com/vllm-project/tpu-inference)。

## 回到聚焦問題：GPU 與 TPU 的差別在哪

把上一篇與這一篇並排：

| | GPU（FlashAttention） | TPU（Pallas／Splash） |
|---|---|---|
| 要省的搬運 | HBM ↔ SRAM | HBM ↔ VMEM |
| 核心演算法 | tiling、online softmax、重算 | 相同 |
| 誰來排程 | 程式設計者寫 CUDA，warp scheduler 在執行期排 | XLA 在編譯期排成 VLIW；Pallas 讓你接手迴圈與區塊 |
| 典型瓶頸 | 指數單元跟不上 Tensor Core（FA3、FA4） | softmax 落在 VPU、MXU 閒著；vreg spill |
| 調校手段 | warp specialization、非同步指令、FP8 | tile 大小、micro-tiling、base-2 指數、Max Logit Estimate |

演算法完全相同，差別在**控制權的位置**。GPU 上你本來就在寫 kernel，問題是怎麼排得更好；TPU 上預設由編譯器全包，Pallas 是把一部分控制權拿回來的工具。

**今天就能做的事**：L13 第 110 頁列了五個練習，第一個最容易上手：把 Splash Attention 的 `bq`、`bkv` 設成 2048、`bkv_compute` 設成 512，觀察 micro-tiling 的效果。沒有 TPU 的讀者，可以先照 L12 第 51 頁的步驟，在任何裝置上對一個 attention 函式呼叫 `jax.make_jaxpr` 與 `jax.jit(...).lower(...).as_text()`，親眼看 Jaxpr 與 StableHLO 長什麼樣子。

## 延伸閱讀

- Stanford CS336 的 [GPU／TPU 篇](/posts/ai/2026-08-22-cs336-gpu-tpu)，從硬體面比較兩種加速器。
- 講義 L12 引用的 [How to Scale Your Model：sharding 章](https://jax-ml.github.io/scaling-book/sharding/)與 [shard_map 官方教學](https://docs.jax.dev/en/latest/notebooks/shard_map.html)。
- [Pallas 官方文件](https://docs.jax.dev/en/latest/pallas/index.html)，L13 的 API 都可以在這裡查到。

## 系列導覽

- 上一篇：[L21 FlashAttention（Tri Dao 客座）](/posts/ai/2026-09-30-cmu11868-flashattention)
- 下一篇：[L23 大模型的高效微調](/posts/ai/2026-09-30-cmu11868-peft-lora)
- 系列總覽：[CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CMU 11-868 LLM Systems, Spring 2026 — Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [L12 Decoding the JAX AI Stack: JAX / XLA / TPU 投影片（Srinath Mandalapu, 2026-02-23）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-12-Introduction_to_JAX_XLA_TPU-f0450caf9e7e6707c009f7f77997a2be.pdf)
- [L13 Pallas Kernels / Splash Attention 投影片（Srinath Mandalapu, 2026-02-25）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-13-pallas_splash_attention_srinath_mandalapu-b0bc7990950b84561ff9aa8e1791f727.pdf)
- [CMU 11-868 Fall 2026 Syllabus（對照課序）](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus)
- [L12 附的 GPT-2 JAX notebook（yufengg/jax-in-action）](https://github.com/yufengg/jax-in-action/blob/master/GPT2_transformers_workshop_IO_2025.ipynb)
- [JAX AI Stack](https://jaxstack.ai/)
- [Pallas 官方文件](https://docs.jax.dev/en/latest/pallas/index.html)
- [openxla/tokamax（含 Splash Attention）](https://github.com/openxla/tokamax)
- [vllm-project/tpu-inference](https://github.com/vllm-project/tpu-inference)
- [Dao et al., FlashAttention（arXiv 2205.14135）](https://arxiv.org/abs/2205.14135)

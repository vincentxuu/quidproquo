---
title: "2026 個人 AI 硬體選購指南：DGX Spark、Mac Studio、MSI AI Edge 全比較"
date: 2026-04-02
type: guide
category: ai
tags: [hardware, local-inference, dgx-spark, mac-studio, msi-ai-edge, asus-ascent-gx10, llm, edge-ai]
lang: zh-TW
tldr: "比較 NVIDIA DGX Spark 與 ASUS、MSI 的 GB10 機種、Apple Mac Studio（M5 Max／M5 Ultra）、AMD Ryzen AI Max 迷你主機等個人 AI 工作站。2026 年記憶體漲價讓 GB10 機種貴了七成以上（DGX Spark 從 $3,999 漲到 $6,950），Mac Studio 則換上最高 512GB、1.2TB/s 的 M5 Ultra，選購的算盤跟年初已經不一樣。"
description: "2026 年本地跑 LLM 不再是夢。從約 $2,500 到 $10,000+，各家推出桌面級 AI 硬體。這篇整理主流選項的規格、價格、效能、生態系與適用場景。"
draft: false
---

2026 年，本地 AI 推論進入主流。不管是為了資料隱私、離線使用、還是單純不想付 API 費用，桌面級硬體已經能跑 70B 甚至 200B 參數的模型。以下整理目前市面上最值得關注的幾款產品。

---

## 快速比較表

| 產品 | 晶片 | 記憶體 | AI 算力 | 最大模型 | 參考價格 | 作業系統 |
|------|------|--------|---------|---------|---------|---------|
| **NVIDIA DGX Spark** | GB10 Grace Blackwell | 128GB LPDDR5x | 1 PFLOP (FP4) | 200B (單機) / 405B (雙機) | $6,950 | DGX OS (Linux) |
| **ASUS Ascent GX10** | GB10 Grace Blackwell | 64GB 或 128GB LPDDR5x | 1 PFLOP (FP4) | 200B (128GB 單機) | $5,599（64GB）／$5,999–$7,999（128GB） | DGX OS (Linux) |
| **MSI EdgeXpert MS-C931** | GB10 Grace Blackwell | 128GB LPDDR5x | 1 PFLOP (FP4) | 200B (單機) / 405B (雙機) | $8,499.99 | DGX OS (Linux) |
| **MSI PRO MAX EDGE AI+**（原 AI Edge 4L） | AMD Ryzen AI Max+ 395 | 128GB LPDDR5x | 126 TOPS | ~120B | $5,499 | Windows / Linux |
| **Mac Studio M5 Max** | Apple M5 Max | 最高 128GB 統一記憶體 | GPU 內建 Neural Accelerators | 與 GB10 同級（128GB） | $2,499 起 | macOS |
| **Mac Studio M5 Ultra** | Apple M5 Ultra | 96GB 起，最高 512GB | GPU 內建 Neural Accelerators | 數百 B（4-bit，512GB） | $5,499 起 | macOS |
| **HP Z2 Mini G1a** | AMD Ryzen AI Max PRO 300 系列 | 最高 128GB | NPU 50+ TOPS | ~70B | $1,999 起（低配） | Windows / Linux |

> **注意：** 價格為 2026-11 美國官方通路的標價（GB10 機種取 NVIDIA Marketplace），會因地區、通路與記憶體行情而變。

---

## 1. NVIDIA DGX Spark — 官方標竿

**晶片：** GB10 Grace Blackwell Superchip（20 核 Arm CPU + Blackwell GPU）
**記憶體：** 128GB LPDDR5x 統一記憶體，頻寬 273 GB/s
**儲存：** 4TB NVMe SSD（自加密）
**尺寸：** 150 × 150 × 50.5 mm（約 1.2 kg）
**功耗：** 240W 外接電源，一般負載約 65W，峰值約 170W

### 優勢
- NVIDIA 原廠，軟體堆疊最完整（CUDA、cuDNN、TensorRT、NeMo、RAPIDS）
- ConnectX-7 網路，最多可以把四台串成一個叢集跑更大的模型
- DGX OS 預裝所有主流框架
- 社群資源和模型相容性最佳

### 注意事項
- 2026 年兩度漲價：2 月從 $3,999 調到 $4,699（NVIDIA 說明原因是記憶體供應吃緊），10 月再漲到 $6,950
- 64GB 版只透過 OEM 夥伴販售，NVIDIA 自己只賣 128GB
- 記憶體頻寬 273 GB/s 是瓶頸——容量大但推論速度不如 Apple Silicon 或獨顯
- 僅支援 Linux（DGX OS），不適合需要 Windows 的使用者
- FP4 的 1 PFLOP 看起來驚人，但實際 FP16/FP32 效能約等於 RTX 5060/5070 等級

### 適合誰
AI 開發者、研究員。需要在本地跑大型模型原型、Fine-tune，之後部署到雲端或資料中心的工作流。

---

## 2. ASUS Ascent GX10 — GB10 的入門價

**晶片：** 同為 GB10 Grace Blackwell（與 DGX Spark 同一顆晶片）
**記憶體：** 64GB 或 128GB LPDDR5x，273 GB/s
**儲存：** 1TB (PCIe 4.0) 或 4TB NVMe
**尺寸：** 150 × 150 × 51 mm（1.48 kg）
**功耗：** 240W USB-C PD 3.1，實際通常 < 65W

### 優勢
- 同樣的 GB10 晶片，128GB／1TB 版 $5,999，比 DGX Spark 便宜 $951
- 64GB 版 $5,599，是 NVIDIA Marketplace 上第一個標價的 64GB GB10 機種
- 支援 ConnectX-7 串聯
- Wi-Fi 7、Bluetooth 5.4、10G 乙太網路
- 三個 USB-C 支援 DisplayPort 2.1 + HDMI 2.1

### 注意事項
- 1TB 版本可能不夠用（模型動輒數十 GB）
- 128GB／4TB 版 $7,999，反而比 DGX Spark 貴；要 4TB 就直接買 DGX Spark
- 同樣跑 DGX OS，生態系和限制與 DGX Spark 一致

### 適合誰
想要 GB10 平台但預算有限的開發者。儲存可以外接的話，128GB／1TB 版最划算。

---

## 3. MSI EdgeXpert MS-C931 — 另一個 GB10 選項

**晶片：** GB10 Grace Blackwell
**記憶體：** 128GB LPDDR5x（另有 64GB 版）
**儲存：** 4TB NVMe Gen5 SSD（自加密）
**連線：** WiFi 7、Bluetooth 5.3、ConnectX-7

### 優勢
- 4TB Gen5 SSD 標配，且支援自加密（適合企業安全需求）
- MSI 的工業電腦品牌 IPC 線，品質穩定
- 同樣支援串聯

### 注意事項
- NVIDIA Marketplace 標價 $8,499.99，比 DGX Spark 貴 $1,550
- 市場討論度較 ASUS 低，社群資源較少

### 適合誰
需要 Gen5 自加密儲存或偏好 MSI 品牌的企業使用者。

---

## 4. MSI PRO MAX EDGE AI+ — AMD 陣營的 Windows 選手

年初以「AI Edge 4L」預告的機種，量產名稱是 PRO MAX EDGE AI+ 11M。

**晶片：** AMD Ryzen AI Max+ 395（16 核 / 32 執行緒，Strix Halo）
**GPU：** 內建 Radeon 8060S（RDNA 3.5，40 CU，約 RTX 4060 等級）
**NPU：** XDNA 2，50 TOPS
**記憶體：** 128GB LPDDR5x 8000（96GB 可分配給 GPU）
**儲存：** 2TB NVMe
**體積：** 4 公升鋁合金機殼，內建 300W 電源
**AI 算力：** 126 TOPS（NPU + CPU + GPU 合計）

### 優勢
- **Windows 原生支援**，同一台可以當日常工作機
- 內建 GPU 順便能打遊戲（RTX 4060 等級）
- 支援 Ollama、LM Studio、ONNX Runtime
- 統一記憶體架構，96GB 可分給 GPU 跑大模型

### 注意事項
- AI 算力（126 TOPS）遠低於 GB10 平台（1,000 TOPS）
- LLM 推論速度約 15 tokens/sec（120B 模型），GB10 平台會更快
- MSI 美國官網定價 $5,499，跟 GB10 入門機種已經差不多價位
- AMD ROCm 生態系仍不如 CUDA 成熟

### 適合誰
需要 Windows + AI 推論 + 日常使用（甚至遊戲）的多功能使用者。不想只有一台只能跑 Linux 的 AI 盒子。

---

## 5. Apple Mac Studio（M5 Max／M5 Ultra）— 記憶體頻寬之王

2026-08-25 發表、9 月開賣，前一代是 2025 年的 M4 Max／M3 Ultra。

**M5 Max：** 18 核 CPU、最高 40 核 GPU（每個 GPU 核心內建 Neural Accelerators）、最高 128GB 統一記憶體、頻寬最高 614 GB/s
**M5 Ultra：** 最高 36 核 CPU、最高 80 核 GPU、96GB 起最高 512GB 統一記憶體、頻寬 1.2 TB/s
**價格：** M5 Max $2,499 起、M5 Ultra $5,499 起（128GB 等高記憶體配置要另外加價）

### 優勢
- **記憶體頻寬**：M5 Max 的 614 GB/s 是 GB10 平台（273 GB/s）的兩倍多，M5 Ultra 的 1.2 TB/s 超過四倍
- 推論速度（tokens/sec）在同等量化下通常優於 DGX Spark
- M5 Ultra 512GB 可以把數百 B 參數的模型（4-bit）完整放進單機記憶體
- GPU 內建 Neural Accelerators：Apple 宣稱在 LM Studio 的 prompt 處理比 M4 Max 快最多 3.9 倍，補上過去 Mac 處理長 prompt 慢的弱點
- 多台 Mac Studio 可以用 Thunderbolt 5 加 RDMA 組成叢集，Apple 宣稱四台的推論速度最多是單台的 3 倍
- macOS 生態系：MLX 框架高度優化、llama.cpp 支援完善，Ollama 0.40 起在 Apple Silicon 預設走 MLX
- 幾乎無噪音，適合辦公桌上長期運行，也能同時當日常工作機

### 注意事項
- 不支援 CUDA —— 如果你的 workflow 依賴 NVIDIA 生態系，這是大問題；vLLM 在 Mac 上只有社群外掛 vLLM-Metal
- 記憶體無法升級，買的時候就要決定
- 128GB 要選 40 核 GPU 的 M5 Max，512GB 要選頂規 M5 Ultra，價格跟著大幅往上
- Fine-tuning 能力不如 NVIDIA 平台

### 適合誰
macOS 使用者、注重推論速度、想要一台同時是高效能工作站又能跑 LLM 的機器。要跑超過 128GB 的模型又不想進資料中心，M5 Ultra 是目前單機記憶體最大的桌上型選項之一。

---

## 6. HP Z2 Mini G1a — 企業級 AMD 方案

**晶片：** AMD Ryzen AI Max PRO 300 系列（最高 Ryzen AI Max+ PRO 395）
**記憶體：** 最高 128GB 統一記憶體（LPDDR5x 8000）
**NPU：** 50+ TOPS
**定位：** 企業級迷你工作站

### 優勢
- 企業通路、IT 管理功能完善
- AMD PRO 系列有企業安全功能
- 可選 Windows 11 Pro 或 Linux

### 注意事項
- 官網 $1,999 起是低記憶體的配置；128GB 的價格隨記憶體行情變動很大，下單前以 HP 官網為準
- ROCm 相容性仍需注意
- GPU 效能不如 GB10 平台

### 適合誰
企業 IT 部署、需要商用保固和管理功能的團隊。

---

## AMD 下一代：Ryzen AI Max PRO 400 與 Ryzen AI Halo

AMD 在 2026-05 發表 Ryzen AI Max PRO 400 系列（代號 Gorgon Halo）：CPU、GPU 架構與 300 系列相同，最大的差別是記憶體上限從 128GB 提高到 192GB，其中最多 160GB 可以分給 GPU，AMD 宣稱能在單機跑 3,000 億參數以上的 4-bit 模型。HP、Lenovo 等 OEM 的機種從 2026 下半年陸續上市。

AMD 也推出自家的 Ryzen AI Halo 開發平台：第一版用 Ryzen AI Max+ 395 加 128GB，2026-06 起透過 Micro Center 預購；10 月再發表改用 Ryzen AI Max+ PRO 495、最高 192GB 的新版。它和 DGX Spark 定位相同，差別在可以裝 Windows，官方列出支援的工具包括 PyTorch、vLLM、llama.cpp、Ollama、ComfyUI 與 LM Studio。

---

## 進階選項：NVIDIA DGX Station

如果預算不是問題：

- **晶片：** GB300 Grace Blackwell Ultra Desktop Superchip
- **記憶體：** 748GB 一致性記憶體
- **算力：** 最高 20 PFLOPS（FP4）
- **模型容量：** 最高 1 兆（trillion）參數
- **擴充：** ConnectX-8 SuperNIC 可串接兩台；可再加裝一張 RTX PRO Blackwell GPU
- **價格：** NVIDIA Marketplace 上的機種（如 Dell Pro Max with GB300）沒有標價，需洽詢
- **廠商：** ASUS、Dell、HP、Lenovo、Lambda、Supermicro 皆有出貨

這已經不是「個人」設備，而是小型團隊的共享 AI 伺服器。

---

## 選購決策樹

```
你需要跑多大的模型？
├── ≤ 70B（4-bit 量化）
│   ├── 已有 Mac 生態系 → Mac Studio M5 Max（64GB 以上）
│   ├── 需要 Windows → MSI PRO MAX EDGE AI+ 或 HP Z2 Mini
│   └── 預算最低 → Mac Studio M5 Max 或 HP Z2 Mini G1a 的中階配置
├── 70B–200B
│   ├── 預算導向 → ASUS Ascent GX10 128GB／1TB（$5,999）
│   ├── 要 NVIDIA 官方支援 → DGX Spark
│   ├── 要推論速度、用 Mac → Mac Studio M5 Max 128GB 或 M5 Ultra
│   └── 需要 Windows → AMD Ryzen AI Max PRO 400 機種（最高 192GB）
└── > 200B
    ├── 單機 → Mac Studio M5 Ultra（最高 512GB）
    ├── 串聯 → 2～4 台 DGX Spark／GX10，或多台 Mac Studio
    └── 更大 → DGX Station（748GB，1T 參數）
```

---

## 關鍵指標解讀

### 記憶體容量 vs 頻寬

這是最容易混淆的地方：

- **容量（GB）** 決定你能裝多大的模型
- **頻寬（GB/s）** 決定推論速度（tokens/sec）

| 平台 | 容量 | 頻寬 | 意義 |
|------|------|------|------|
| GB10 (DGX Spark 等) | 128GB | 273 GB/s | 裝得下大模型，但吐 token 較慢 |
| M5 Max | 最高 128GB | 最高 614 GB/s | 同樣容量，頻寬兩倍多 |
| M5 Ultra | 96–512GB | 1.2 TB/s | 容量與頻寬都最高的桌上型選項 |
| RTX 5090 | 32GB | 1,792 GB/s | 頻寬最高但容量小，只適合小模型 |

**結論：** 如果你主要跑 ≤ 70B 模型且在意速度，Mac Studio 勝出。要在單機跑 200B 以上，選 M5 Ultra 的大記憶體配置；要留在 CUDA 生態系，就用 GB10 平台犧牲速度換容量，不夠再串聯。

### TOPS / PFLOPS 的陷阱

廠商愛用 FP4 精度標算力——DGX Spark 的「1 PFLOP」是 FP4 with sparsity。實際跑 FP16 模型時，效能大約等於 RTX 5060–5070。不要被行銷數字誤導。

---

## 軟體生態系比較

| | NVIDIA (GB10) | Apple (M5 Max／Ultra) | AMD (Strix Halo／Gorgon Halo) |
|---|---|---|---|
| **推論框架** | TensorRT-LLM, vLLM, SGLang, Ollama | MLX, llama.cpp, Ollama（預設走 MLX）, LM Studio | Ollama, llama.cpp (Vulkan／ROCm), vLLM (ROCm), LM Studio |
| **訓練/微調** | PyTorch + CUDA, NeMo | PyTorch (MPS), MLX | PyTorch + ROCm (有限) |
| **模型庫** | HuggingFace 全相容 | HuggingFace + MLX Community | HuggingFace（需注意相容性）|
| **容器支援** | Docker + NGC | Docker (Linux VM) | Docker |
| **成熟度** | ★★★★★ | ★★★★☆ | ★★★☆☆ |

---

## 總結建議

1. **最佳全能 AI 開發機：** NVIDIA DGX Spark — 軟體生態無可取代，200B 模型容量，但 $6,950 已經不便宜
2. **最便宜的 GB10：** ASUS Ascent GX10 128GB／1TB — $5,999，同晶片比 DGX Spark 便宜近 $1,000
3. **最佳推論速度：** Mac Studio M5 Max／M5 Ultra — 頻寬 614 GB/s 到 1.2 TB/s
4. **單機記憶體最大：** Mac Studio M5 Ultra 512GB
5. **最佳多用途（Windows）：** MSI PRO MAX EDGE AI+ 或 AMD Ryzen AI Max PRO 400 機種
6. **團隊共享：** DGX Station — 748GB、1T 參數

年初預期的新平台在下半年確實到了：Mac Studio 換上 M5 Ultra，AMD 推出 192GB 的 Ryzen AI Max PRO 400。但同一時間記憶體價格大漲，GB10 機種一年內漲了七成以上，128GB 統一記憶體的價格帶整體往上移。買之前先確認你真的需要本地跑大模型；如果只是偶爾用，[雲端 API 或按小時租 GPU](/posts/ai/2026-08-21-vllm-self-host-decision) 可能便宜得多。

## 更新紀錄

- 2026-11-23：原文的「Mac Studio M4 Ultra」並不存在（2025 款是 M4 Max／M3 Ultra），改寫成 2026-08 發表的 M5 Max／M5 Ultra；GB10 機種價格依 NVIDIA Marketplace 現價更新（DGX Spark $6,950、ASUS GX10 $5,599～$7,999、MSI EdgeXpert $8,499.99），補上 DGX Spark 最多四台串聯與 64GB 版；MSI AI Edge 4L 改成量產名 PRO MAX EDGE AI+ 與定價；HP Z2 Mini 拿掉已無法對應的價格；新增 AMD Ryzen AI Max PRO 400 與 Ryzen AI Halo；DGX Station 記憶體更正為 748GB；決策樹、頻寬表、生態系表與總結依上述改寫。

## 參考資料

- [NVIDIA DGX Spark 官方產品頁：桌上型 AI 超級電腦規格](https://www.nvidia.com/en-us/products/workstations/dgx-spark/)
- [NVIDIA Marketplace：Personal AI Supercomputers](https://marketplace.nvidia.com/en-us/enterprise/personal-ai-supercomputers/) — DGX Spark、ASUS GX10、MSI EdgeXpert 標價
- [NVIDIA DGX Station 官方產品頁](https://www.nvidia.com/en-us/products/workstations/dgx-station/)
- [Apple introduces new Mac Studio with M5 Max and M5 Ultra（Apple Newsroom，2026-08-25）](https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/)
- [Mac Studio 技術規格（Apple）](https://www.apple.com/mac-studio/specs/)
- [AMD Powers Next-Generation Agent Computers with New Ryzen AI Halo Developer Platform and Ryzen AI Max PRO 400 Series（AMD，2026-05-20）](https://www.amd.com/en/blogs/2026/amd-powers-next-generation-agent-computers-with-new-ryzen-ai-hal.html)
- [Meet the Next AMD Ryzen AI Halo（AMD，2026-10-12）](https://www.amd.com/en/blogs/2026/meet-the-next-amd-ryzen-ai-halo.html)
- [MSI PRO MAX EDGE AI+ 11M（MSI 美國官方商店）](https://us-store.msi.com/PRO-MAX-EDGE-AI-11M-006US)
- [HP Z Workstation Desktops（HP）](https://www.hp.com/us-en/workstations/desktop-workstation-pc.html) — Z2 Mini G1a 起價與規格
- [Ollama：本地 LLM 推論工具，支援 Mac、Linux、Windows](https://ollama.com/)
- [llama.cpp：跨平台高效能本地推論框架](https://github.com/ggml-org/llama.cpp)
- [MLX：Apple Silicon 優化的機器學習推論框架](https://github.com/ml-explore/mlx)
- [LM Studio：本地 LLM 推論桌面應用](https://lmstudio.ai/)

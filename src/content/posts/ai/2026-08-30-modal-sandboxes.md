---
title: "Modal Sandboxes：GPU 沙箱與沙箱作為獨立產品線"
date: 2026-08-30
category: ai
type: deep-dive
tags: [sandbox, modal, gpu, cloud, ai-agent, code-execution]
lang: zh-TW
tldr: "沙箱系列的雲端深入篇（order 12）。Modal Sandboxes 的架構、GPU 沙箱支援、定價模式、以及它如何從功能變成 $300M–$1B 年化運營率的獨立產品線。"
description: "Modal Sandboxes 深入介紹：架構、GPU 沙箱、定價、隔離技術、與其他供應商的取捨，以及沙箱作為獨立商業產品的商業化啟示。"
series:
  name: "沙箱系列"
  order: 12
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-30-modal-sandboxes-en)

## 本文定位

這篇是沙箱系列的「雲端深入篇」（order 12），聚焦 **Modal Sandboxes**。Modal 是 2026 年沙箱市場最受關注的供應商之一，其沙箱產品單獨貢獻約 $300M–$3.3 億美元年化運營率，並支援超過 30 億次累計執行與 100 萬個並行沙箱。

本文涵蓋：
1. **Modal Sandboxes 的架構** —— 控制面、執行面、隔離技術
2. **GPU 沙箱支援** —— 為什麼 GPU 沙箱是 Modal 的差異化優勢
3. **定價模式** —— wall-clock 計費、無 idle 計費、GPU 費用
4. **與其他供應商的取捨** —— E2B、Daytona、Vercel、Cloudflare 比較
5. **商業化啟示** —— 沙箱如何從功能變成獨立產品線

---

## Modal Sandboxes 架構

Modal Sandboxes 採用三層架構：

```
┌─────────────────────────────────────┐
│           控制面 (Control Plane)      │
│  - Modal Worker 调度器                │
│  - 沙箱生命週期管理                   │
│  - 快照與暫停/恢復                    │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│           執行面 (Execution Plane)      │
│  - Cloud Hypervisor microVM           │
│  - gVisor 隔離（預設）                │
│  - VM 執行模式（可選）                │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│           資料面 (Data Plane)         │
│  - 持久磁碟（Volumes）                │
│  - 記憶體快照                         │
│  - 網路策略                           │
└─────────────────────────────────────┘
```

### 隔離技術

Modal 預設使用 **gVisor** 進行 syscall 攔截，提供中等強度的隔離；對於需要更強隔離的工作負載，可選用 **microVM** 執行模式（基於 Cloud Hypervisor）。GPU 沙箱僅支援 gVisor 隔離。

### 沙箱生命週期

1. **建立**：從鏡像（OCI container）啟動沙箱，冷啟動約秒級
2. **執行**：透過 SDK 發送指令，串流輸出結果
3. **暫停 (pause)**：保留記憶體與行程狀態，釋放 CPU
4. **恢復 (resume)**：從暫停狀態繼續執行
5. **快照 (snapshot)**：將磁碟狀態保存為可重用的快照
6. **銷毀**：釋放所有資源

---

## GPU 沙箱支援：Modal 的差異化優勢

Modal 的一個主要差異化優勢是 **GPU 沙箱**。大多數沙箱供應商（E2B、Daytona、Vercel、Cloudflare）不支援 GPU，或 GPU 支援有限。Modal 允許沙箱掛載 NVIDIA GPU（T4 至 H100），讓 agent 可以在沙箱內執行 ML 推理、訓練或資料處理。

### GPU 沙箱用途

| 用途 | 說明 |
|------|------|
| ML 推理 | Agent 生成的程式碼需要執行模型推理 |
| 資料處理 | 大規模資料清洗與轉換 |
| 模型微調 | 小規模模型訓練與調優 |
| 電腦視覺 | 圖像與影片處理 |

### GPU 沙箱範例

```python
import modal

app = modal.App("agent-sandbox-gpu")

@app.function(
    image=modal.Image.debian_slim().pip_install("torch", "transformers"),
    gpu="A100",
    sandbox=True,
)
def run_agent_code(code: str):
    result = subprocess.run(["python", "-c", code], capture_output=True, text=True)
    return result.stdout
```

---

## 定價模式

Modal 採用 **wall-clock 計費**，但 **無 idle 計費** —— 沙箱暫停後不計算費用。這對突發性互動式 agent 非常有利。

| 項目 | 費率 | 說明 |
|------|------|------|
| CPU | $0.00003942 / core-s | 每秒計費 |
| 記憶體 | $0.00000672 / GiB-s | 每秒計費 |
| GPU | 視型號而定 | A100、H100 等 |
| 網路 | 視出口流量 | 按 GB 計費 |
| 快取 | 視儲存大小 | 按 GB-月計費 |

與 E2B/Daytona 的 wall-clock 計費相比，Modal 的無 idle 計費對「短執行、長等待」的場景更有利。

---

## 與其他供應商的取捨

| 供應商 | GPU 支援 | 隔離技術 | 冷啟動 | 定價模式 | 最適合 |
|--------|----------|----------|--------|----------|--------|
| Modal | ✅ (A100/H100) | gVisor / microVM | sub-second | wall-clock (無 idle) | GPU 工作負載、大規模併發 |
| E2B | ❌ | Firecracker microVM | ~150 ms | wall-clock | Coding agent、長任務 |
| Daytona | ❌ | Docker / Kata | ~90 ms | wall-clock | 平行評測、快照分支 |
| Vercel | ❌ | Firecracker microVM | ~1.8 s | active-CPU | Vercel 生態整合 |
| Cloudflare | ❌ | Container in VM | ~2–3 s | active-CPU (10ms) | Cloudflare 生態 |

**選擇 Modal 的條件**：需要 GPU、需要大規模併發、需要無 idle 計費、已在 Modal 生態上。

**不選擇 Modal 的條件**：不需要 GPU、希望開源自建、需要 Windows 沙箱（Daytona 支援）、已深度綁定其他雲端生態。

---

## 商業化啟示

Modal 沙箱的成功說明沙箱已經從「功能」變成「獨立商業產品」：

1. **單一產品線可達 $300M+ ARR**：沙箱不再是附屬功能，而是獨立的商業市場。
2. **GPU 是差異化關鍵**：在沙箱市場中，GPU 支援是高價差異化因素。
3. **無 idle 計費是賣點**：對突發性 agent 工作負載，這是強大的競爭優勢。
4. **生態整合很重要**：與推理、訓練、批次處理在同一平台，降低切換成本。

---

## 讀完本文你應該理解

1. Modal Sandboxes 的三層架構與隔離技術（gVisor / microVM）。
2. GPU 沙箱是 Modal 的差異化優勢，適用於 ML 推理與資料處理。
3. Modal 的定價模式：wall-clock 計費、無 idle 計費、GPU 費用。
4. 與 E2B、Daytona、Vercel、Cloudflare 的取捨。
5. 沙箱商業化的啟示：單一產品線可達 $300M+ ARR，GPU 與生態整合是關鍵。

---

## 參考資料

- [Modal Sandboxes Documentation](https://modal.com/docs/guide/sandbox)
- [Modal Crosses $1B Annualized Run Rate and Raises $750M Series D](https://modal.com/blog/1-billion-annualized-run-rate-series-d)
- [Modal's Series C: Raising $355M at a $4.65B Valuation](https://modal.com/blog/modal-series-c)
- [Modal Labs Revenue, Valuation & Funding](https://sacra.com/c/modal-labs)
- [Tech Times: Modal Labs Sandboxes Hits $300M Run Rate](https://www.techtimes.com/articles/329132/20261016/modal-labs-sandboxes-hits-300m-run-rate-isolated-code-execution-becomes-its-own-market.htm)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape)
- [本站：沙箱作為獨立商業產品（order 27）](/posts/tech/2026-08-30-sandbox-as-business)

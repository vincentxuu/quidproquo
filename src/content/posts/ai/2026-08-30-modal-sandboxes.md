---
title: "Modal Sandboxes：GPU 沙箱與沙箱作為獨立產品線"
date: 2026-08-30
category: ai
type: deep-dive
tags: [sandbox, modal, gpu, cloud, ai-agent, code-execution]
lang: zh-TW
tldr: "沙箱系列的雲端深入篇（order 12）。Modal Sandboxes 的架構、GPU 沙箱支援、定價模式、以及它如何從功能變成年化營收約 3 億美元的獨立產品線（Modal 整體已破 10 億美元）。"
description: "Modal Sandboxes 深入介紹：架構、GPU 沙箱、定價、隔離技術、與其他供應商的取捨，以及沙箱作為獨立商業產品的商業化啟示。"
series:
  name: "沙箱系列"
  order: 12
draft: false
---

> :globe: [English version](/posts/ai/2026-08-30-modal-sandboxes-en)

## 本文定位

這篇是沙箱系列的「雲端深入篇」（order 12），聚焦 **Modal Sandboxes**。Modal 是 2026 年沙箱市場最受關注的供應商之一，Modal 在 2026-10 公告沙箱產品單獨約 3 億美元年化營收，累計開過接近 30 億個沙箱，可擴到 100 萬個並行。

本文涵蓋：
1. **Modal Sandboxes 的架構** —— 控制面、執行面、隔離技術
2. **GPU 沙箱支援** —— 為什麼 GPU 沙箱是 Modal 的差異化優勢
3. **定價模式** —— 按 request 與實際用量取高者、3 倍費率、GPU 費用
4. **與其他供應商的取捨** —— E2B、Daytona、Vercel、Cloudflare 比較
5. **商業化啟示** —— 沙箱如何從功能變成獨立產品線

---

## Modal Sandboxes 架構

Modal Sandboxes 採用三層架構：

```
┌─────────────────────────────────────┐
│           控制面 (Control Plane)      │
│  - Modal Worker 排程器                │
│  - 沙箱生命週期管理                   │
│  - 檔案系統／目錄／記憶體快照         │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│           執行面 (Execution Plane)      │
│  - gVisor 或 microVM 隔離             │
│  - 每個沙箱一個 container             │
│  - GPU 可掛載                         │
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

Modal 的[安全文件](https://modal.com/docs/guide/security)說每個 container 都在自己的沙箱裡，用 **gVisor** 或 **microVM** 這類原語與主機隔離；官方沒有公開哪些工作負載用哪一種，也沒有讓使用者自選。要拿隔離強度當採購條件，得直接向 Modal 確認。

### 沙箱生命週期

1. **建立**：從鏡像（OCI container）啟動沙箱，冷啟動約秒級
2. **執行**：透過 SDK 發送指令，串流輸出結果
3. **檔案系統／目錄快照**：把整個檔案系統或單一目錄存成 Image，預設保留 30 天，可用 TTL 調整
4. **記憶體快照**：連記憶體與行程一起存，建立後 7 天到期、目前不能延長
5. **從快照啟動**：新沙箱從快照開始，用來分支或縮短啟動時間
6. **銷毀**：釋放所有資源

---

## GPU 沙箱支援：Modal 的差異化優勢

Modal 的一個主要差異化優勢是 **GPU 沙箱**。E2B、Vercel、Cloudflare 的沙箱不支援 GPU；Daytona 也有 GPU 沙箱，但 Modal 的 GPU 與推論、訓練、批次工作在同一個平台。Modal 允許沙箱掛載 NVIDIA GPU（T4 到 B300），讓 agent 可以在沙箱內執行 ML 推理、訓練或資料處理。

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

app = modal.App.lookup("agent-sandbox-gpu", create_if_missing=True)
image = modal.Image.debian_slim().pip_install("torch", "transformers")

sb = modal.Sandbox.create(app=app, image=image, gpu="A100", timeout=600)
p = sb.exec("python", "-c", "import torch; print(torch.cuda.is_available())")
print(p.stdout.read())
sb.terminate()
```

---

## 定價模式

Modal 沙箱按非搶佔費率計價，是一般 function 列表價的 3 倍；CPU 與記憶體都按「你 request 的量與實際用量取高者」[計費](https://modal.com/docs/guide/resources)。CPU request 最低可設 0.125 core，所以閒置時 CPU 費用很低，但記憶體照樣按整段存活時間收，並不是「閒置不收費」。

| 項目 | 費率 | 說明 |
|------|------|------|
| CPU | $0.00003942 / core-s | 每秒計費；1 core = 2 vCPU |
| 記憶體 | $0.00000667 / GiB-s | 每秒計費 |
| GPU | 視型號而定 | A100、H100 等 |
| 網路 | 視出口流量 | 按 GB 計費 |
| 快取 | 視儲存大小 | 按 GB-月計費 |

和 E2B／Daytona 相比，Modal 的單價較高，但 CPU request 可以壓得很低；「短執行、長等待」的場景要拿自己的 request 設定實算，記憶體通常才是大頭。

---

## 與其他供應商的取捨

| 供應商 | GPU 支援 | 隔離技術 | 冷啟動 | 定價模式 | 最適合 |
|--------|----------|----------|--------|----------|--------|
| Modal | ✓ (T4–B300) | gVisor / microVM | sub-second | request 與用量取高者 | GPU 工作負載、大規模併發 |
| E2B | ✗ | Firecracker microVM | ~150 ms | wall-clock | Coding agent、長任務 |
| Daytona | ✓ | Docker / Kata | ~90 ms | wall-clock | 平行評測、快照分支 |
| Vercel | ✗ | Firecracker microVM | ~1.8 s | active-CPU | Vercel 生態整合 |
| Cloudflare | ✗ | Container in VM | ~2–3 s | active-CPU (10ms) | Cloudflare 生態 |

**選擇 Modal 的條件**：需要 GPU、需要大規模併發、想把沙箱和推論或訓練放在同一平台、已在 Modal 生態上。

**不選擇 Modal 的條件**：不需要 GPU、希望開源自建、需要 Windows 沙箱（Daytona 支援）、已深度綁定其他雲端生態。

---

## 商業化啟示

Modal 沙箱的成功說明沙箱已經從「功能」變成「獨立商業產品」：

1. **單一產品線可達 $300M+ ARR**：沙箱不再是附屬功能，而是獨立的商業市場。
2. **GPU 是差異化關鍵**：在沙箱市場中，GPU 支援是高價差異化因素。
3. **CPU request 可以壓很低是賣點**：突發性 agent 閒置時只付最低 request，但記憶體仍要算進去。
4. **生態整合很重要**：與推理、訓練、批次處理在同一平台，降低切換成本。

---

## 讀完本文你應該理解

1. Modal Sandboxes 的三層架構與隔離技術（gVisor / microVM）。
2. GPU 沙箱是 Modal 的差異化優勢，適用於 ML 推理與資料處理。
3. Modal 的定價模式：3 倍費率、按 request 與實際用量取高者、GPU 費用。
4. 與 E2B、Daytona、Vercel、Cloudflare 的取捨。
5. 沙箱商業化的啟示：單一產品線可達 $300M+ ARR，GPU 與生態整合是關鍵。

---

## 更新紀錄

- 2026-11-23：依 Modal 2026-10-14 公告改正規模數字（沙箱約 3 億美元年化營收、接近 30 億個沙箱）；計費改為「按 request 與實際用量取高者」，記憶體費率更新為 $0.00000667／GiB-s，刪除「無 idle 計費」說法；隔離改為官方說法「gVisor 或 microVM」；生命週期改為三種快照（記憶體快照 7 天到期）；GPU 範例改用 `modal.Sandbox.create`；Daytona 改列有 GPU。

## 參考資料

- [Modal Sandboxes Documentation](https://modal.com/docs/guide/sandboxes)
- [Modal Sandbox Snapshots](https://modal.com/docs/guide/sandbox-snapshots)
- [Modal Pricing](https://modal.com/pricing) 與 [Resources billing](https://modal.com/docs/guide/resources)
- [Modal Security and privacy](https://modal.com/docs/guide/security)
- [Modal Crosses $1B Annualized Run Rate and Raises $750M Series D](https://modal.com/blog/1-billion-annualized-run-rate-series-d)
- [Modal's Series C: Raising $355M at a $4.65B Valuation](https://modal.com/blog/modal-series-c)
- [Modal Labs Revenue, Valuation & Funding](https://sacra.com/c/modal-labs)
- [Tech Times: Modal Labs Sandboxes Hits $300M Run Rate](https://www.techtimes.com/articles/329132/20261016/modal-labs-sandboxes-hits-300m-run-rate-isolated-code-execution-becomes-its-own-market.htm)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape)
- [本站：沙箱作為獨立商業產品（order 27）](/posts/tech/2026-08-30-sandbox-as-business)

---
title: "沙箱成本模型：wall-clock vs active-CPU 計費"
date: 2026-08-30
category: tech
type: guide
tags: [sandbox, cost, pricing, billing, wall-clock, active-cpu, ai-agent]
lang: zh-TW
tldr: "沙箱系列的成本篇（order 26）。比較 wall-clock 與 active-CPU 兩種計費模式，各隔離層級成本差異，以及如何估算月成本與避免隱藏費用。"
description: "沙箱成本模型比較：wall-clock vs active-CPU 計費模式、各隔離層級成本、月成本估算、隱藏費用與優化策略。"
series:
  name: "沙箱系列"
  order: 27
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-sandbox-cost-model-en)

## 本文定位

這篇是沙箱系列的「成本篇」（order 26）。它不比較單一供應商的功能（各家深入在 order 8–16，全景在 order 7），而是聚焦「沙箱怎麼收費」：

1. **wall-clock 與 active-CPU 計費模式有什麼差異？**
2. **各隔離層級（容器、gVisor、microVM、Wasm）的成本差異是多少？**
3. **如何估算月成本？** —— 附計算公式與範例。
4. **有哪些隱藏費用？** —— 網路出口、快取、閒置費用等。
5. **如何優化沙箱成本？**

---

## 兩種計費模式的核心差異

### wall-clock 計費（壁時計費）

對沙箱存活期間的**每一秒**收費，無論 CPU 是否忙碌。只要沙箱沒銷毀，就一直計費。

**適用**：長時間持續執行的任務、需要保留狀態的會話。
**供應商**：E2B、Daytona、Runloop、Modal（無 idle 計費例外）、AWS Bedrock AgentCore、Azure Container Apps。

### active-CPU 計費（實作 CPU 計費）

只對**實際執行代碼的 CPU 時間**收費，等待 I/O、閒置時間不計費。

**適用**：突發性、短執行、長等待的互動式 agent。
**供應商**：Vercel Sandbox、Cloudflare Sandboxes。

---

## 成本場景模擬

### 場景 A：突發性互動式 agent

30,000 個 session/月，每個 5 分鐘，實際 CPU 使用僅 30 秒，2 vCPU + 4 GB 記憶體。

| 計費模式 | 預估月成本 | 說明 |
|----------|-----------|------|
| active-CPU（Vercel/Cloudflare） | ~$36–$276 | 只計實際 CPU 時間，跳過等待 |
| wall-clock（E2B/Daytona） | ~$414 | 每秒都算，閒置也收費 |

**結論**：突發場景選 active-CPU 可節省 90% 以上成本。

### 場景 B：長時間持續執行

1,000 個 session/月，每個 8 小時，全程 CPU 使用率 60%，4 vCPU + 8 GB 記憶體。

| 計費模式 | 預估月成本 | 說明 |
|----------|-----------|------|
| wall-clock（E2B/Daytona） | ~$1,200 | 固定成本，可預測 |
| active-CPU（Vercel） | ~$1,500+ | 雖然只計 active CPU，但長時間執行累積較高 |

**結論**：長時間場景選 wall-clock 更可預測，且通常更便宜。

---

## 各隔離層級成本比較

| 隔離層級 | 代表技術 | 相對成本 | 啟動速度 | 記憶體開銷 | 適用場景 |
|----------|----------|----------|----------|------------|----------|
| 容器 | Docker | $（最低） | 1–5 秒 | 50–100 MB | 可信代碼、CI 任務 |
| 使用者態核心 | gVisor | $$ | 100–300 ms | 10–30 MB 額外 | 多租戶、Kubernetes |
| 輕量虛擬化 | Firecracker/Kata | $$$ | 125 ms | 5–128 MB | 不信任代碼、多租戶 |
| WebAssembly | Wasmtime/WasmEdge | $（最低） | 3–15 ms | < 1 MB | 短命代碼片段、邊緣 |
| 託管沙箱 | E2B/Modal/Vercel | $$$$ | 0.3–5 秒 | 視供應商而定 | 快速交付、少維運 |

**關鍵洞察**：Wasm 沙箱的記憶體開銷最低（<1 MB），啟動最快（3–15 ms），適合大規模併發的短命執行；但它只能執行編譯為 Wasm 的語言，語言生態有限。

---

## 隱藏費用清單

很多團隊只看標稱價格，忽略以下隱藏費用：

### 1. 網路出口（Egress）

沙箱發出的網路流量通常按流量計費。如果 agent 頻繁調用外部 API、下載大型檔案，網路費用可能超過計算費用。

**建議**：在沙箱內設定網路允許清單，限制不必要的出口流量。

### 2. 快取與儲存

沙箱快照、暫存檔案、持久磁碟通常按儲存大小計費。長時間保留的快照會累積成本。

**建議**：設定快照保留期限（例如只保留最近 3 份），定期清理無用儲存。

### 3. 閒置費用

部分供應商對閒置沙箱收取較低但非零的費用，或設定最小計費單位（例如最少計費 1 分鐘）。

**建議**：對短命任務使用 auto-destroy，對長任務使用 pause/resume 而非持續運行。

### 4. GPU 費用

如果沙箱需要 GPU（例如執行 ML 推理），GPU 費用通常遠高於 CPU 費用。

**建議**：只在需要時掛載 GPU，用完立即釋放。

---

## 月成本估算公式

```
月成本 = (CPU 時數 × CPU 費率) + (記憶體 GB-時數 × 記憶體費率) + (網路 GB × 網路費率) + (儲存 GB × 儲存費率) + (GPU 時數 × GPU 費率) + 固定基礎費
```

### 範例計算

假設：
- 10,000 個 session/月，每個 10 分鐘
- 2 vCPU，4 GB 記憶體
- CPU 使用率 30%
- 網路輸出 100 GB/月
- wall-clock 計費，CPU 費率 $0.000014 / vCPU-s，記憶體 $0.0000045 / GiB-s

```
CPU 時數 = 10,000 × 10 分鐘 × 60 秒 × 30% = 180,000 秒
CPU 費用 = 180,000 × 2 vCPU × $0.000014 = $5.04
記憶體費用 = 180,000 × 4 GB × $0.0000045 = $3.24
網路費用 = 100 GB × $0.09 = $9.00
總計 ≈ $17.28/月
```

---

## 成本優化策略

| 策略 | 說明 | 適用場景 |
|------|------|----------|
| 選對計費模式 | 突發場景選 active-CPU，長執行選 wall-clock | 所有場景 |
| 設定 auto-destroy | 沙箱任務完成後自動銷毀，避免閒置計費 | 短命任務 |
| 使用 pause/resume | 長任務中斷時暫停而非銷毀，恢復時續執行 | 需要保留狀態的工作流 |
| 限制網路出口 | 設定允許清單，避免不必要的外部流量 | 頻繁呼叫外部 API 的 agent |
| 設定快照保留期 | 只保留最近 N 份快照，定期清理 | 使用快照的供應商 |
| 選 Wasm 沙箱 | 記憶體與啟動成本最低，適合短命代碼片段 | Wasm 相容語言 |
| 監控與警報 | 設定成本警報，避免帳單驚喜 | 生產環境 |

---

## 讀完本文你應該理解

1. wall-clock 與 active-CPU 兩種計費模式的差異與適用場景。
2. 各隔離層級（容器、gVisor、microVM、Wasm、託管沙箱）的相對成本。
3. 如何用公式估算月成本，以及隱藏費用有哪些。
4. 如何根據工作負載特徵選擇最經濟的沙箱方案。
5. 五個可立即執行的成本優化策略。

---

## 參考資料

- [E2B Pricing](https://e2b.dev/pricing)
- [Daytona Pricing](https://www.daytona.io/pricing)
- [Vercel Sandbox Pricing](https://vercel.com/pricing)
- [Cloudflare Sandbox Pricing](https://developers.cloudflare.com/sandbox/pricing/)
- [Modal Pricing](https://modal.com/pricing)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape)
- [本站：沙箱作為獨立商業產品（order 27）](/posts/tech/2026-08-30-sandbox-as-business)

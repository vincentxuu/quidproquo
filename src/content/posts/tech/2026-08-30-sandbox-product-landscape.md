---
title: "AI Agent 雲端沙箱產品全景與選型矩陣"
date: 2026-08-30
category: tech
type: guide
tags: [sandbox, ai-agent, cloud, e2b, daytona, runloop, vercel, cloudflare, modal, bedrock, azure, alibaba, comparison]
lang: zh-TW
tldr: "沙箱系列的雲端全景篇（order 7）。彙整 E2B、Daytona、Runloop、Vercel、Cloudflare、Modal、AWS Bedrock AgentCore、阿里雲 OpenSandbox、Azure Container Apps 九家雲端沙箱供應商的定位、定價、冷啟動、隔離強度與適用場景，附選型決策矩陣。"
description: "AI Agent 雲端沙箱產品全景與選型矩陣：九家供應商比較、定價模式差異、隔離技術對比、選型決策樹。"
series:
  name: "沙箱系列"
  order: 7
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-sandbox-product-landscape-en)

## 本文定位

這篇是沙箱系列的「產品全景篇」（order 7）。它不深入單一供應商的技術細節（各家深入在 order 8–16），而是把市面上主要的雲端沙箱供應商攤在一起比較，幫你回答：

1. **各家供應商各定位什麼？** —— 適合什麼類型的 agent 工作負載？
2. **定價模式有什麼差異？** —— wall-clock 計費 vs active-CPU 計費，月成本差多少？
3. **隔離技術各用什麼？** —— 容器、gVisor、Firecracker microVM，強度不同。
4. **冷啟動與恢復速度如何？** —— 影響互動式 agent 的體驗。
5. **我該怎麼選？** —— 附選型決策矩陣。

---

## 雲端沙箱供應商全景表

| 供應商 | 隔離技術 | 冷啟動 | 定價模式 | 適合場景 | 優勢 | 劣勢 |
|--------|----------|--------|----------|----------|------|------|
| **E2B** | Firecracker microVM | ~150 ms | wall-clock | Coding agent、長任務 | pause/resume 保留記憶體、開源 runtime | 無 GPU、24 小時 session 上限 |
| **Daytona** | Docker / Kata | ~90 ms | wall-clock | 平行評測、快照分支 | 快照與 fork、長生命週期 | 開源 repo 已停止維護 |
| **Runloop** | microVM | ~150 ms | wall-clock | 評測、Blueprint 工作流 | Devbox 藍圖、平行 Devbox | 生態較小 |
| **Vercel Sandbox** | Firecracker microVM | ~1.8 s | active-CPU | 已在 Vercel 上的 agent | 與 Vercel 生態最短整合路徑 | 記憶體計費、持久化需自行設計 |
| **Cloudflare Sandboxes** | Container in VM | ~2–3 s | active-CPU (10ms) | Cloudflare Workers 生態 | 三層架構（Worker + DO + Container） | 三層費用、持久資料需自行設計 |
| **Modal** | gVisor / microVM | sub-second | wall-clock（無 idle 計費） | GPU 工作負載、大規模併發 | $300M–$1B ARR、GPU 沙箱 | 託管 only、價格約 3× function 費率 |
| **AWS Bedrock AgentCore** | microVM | ~1–2 s | wall-clock | AWS 原生 agent | AWS 生態整合、Code Interpreter | AWS 鎖定 |
| **Alibaba OpenSandbox** | gVisor | ~200 ms | wall-clock | 多語言 SDK（Python/Go/Java） | 阿里雲生態、BYOC | 國際地區支持較少 |
| **Azure Container Apps Sandboxes** | microVM | ~1–2 s | wall-clock | Azure 原生 agent | Microsoft 生態、lifecycle policy | Azure 鎖定 |

---

## 定價模式深度比較

雲端沙箱的定價模式主要分為兩大類，這直接影響月成本：

### 1. Wall-clock 計費（E2B、Daytona、Runloop、Modal、Bedrock AgentCore、OpenSandbox、Azure）

壁時計費對沙箱存活期間的每一秒收費，無論 CPU 是否忙碌。

| 供應商 | CPU 費率 | 記憶體費率 | 計費單位 |
|--------|----------|------------|----------|
| E2B | $0.000014 / vCPU-s | $0.0000045 / GiB-s | 每秒 |
| Daytona | $0.000014 / vCPU-s | $0.0000045 / GiB-s | 每秒 |
| Runloop | 類似 E2B | 類似 E2B | 每秒 |
| Modal | $0.00003942 / core-s | $0.00000672 / GiB-s | 每秒 |
| Bedrock AgentCore | AWS 標準費率 | AWS 標準費率 | 每秒 |

### 2. Active-CPU 計費（Vercel、Cloudflare）

只對實際執行代碼的 CPU 時間收費，等待 I/O 的時間不計費。

| 供應商 | CPU 費率 | 記憶體費率 | 計費單位 | 特色 |
|--------|----------|------------|----------|------|
| Vercel | $0.128 / vCPU-hr | $0.0212 / GB-hr | 每小時 | 僅計 active CPU，記憶體按 wall-clock |
| Cloudflare | $0.072 / vCPU-hr | $0.009 / GiB-hr | 每 10 ms | 記憶體與磁碟按 provisioned 大小 |

---

## 成本場景模擬：30,000 個 session/月，每個 5 分鐘，僅 30 秒用 CPU

這個場景模擬「突發性互動式 agent」，每個 session 存活 5 分鐘，但實際 CPU 使用僅 30 秒，2 vCPU + 4 GB 記憶體：

| 供應商 | 預估月成本 | 說明 |
|--------|-----------|------|
| **Modal** | ~$36 | 幾乎不計 idle CPU，最適合突發場景 |
| **Vercel** | ~$276 | Active-CPU 計費跳過等待時間 |
| **E2B / Daytona / Blaxel** | ~$414 | 全時長計費，每秒都算 |
| **Cloudflare** | 視 provisioned 大小而定 | 10 ms 計費單位，適合極短執行 |

**結論**：如果你的 agent 工作負載是「突發性、短執行、長等待」，active-CPU 計費（Vercel、Cloudflare）或無 idle 計費（Modal）會便宜很多；如果是「長時間持續執行」，wall-clock 計費的供應商（E2B、Daytona）更適合。

---

## 冷啟動與恢復速度比較

| 供應商 | 中位數 TTI | P95 | P99 | 成功率 |
|--------|-----------|-----|-----|--------|
| Daytona | 0.27 s | 0.43 s | 0.44 s | 37% |
| Vercel | 0.67 s | 1.04 s | 1.12 s | 100% |
| Modal | 0.88 s | 1.00 s | 1.08 s | 100% |
| Runloop | 0.89 s | 3.27 s | 3.50 s | 100% |
| E2B | 1.61 s | 1.77 s | 1.81 s | 100% |
| Cloudflare | 5.06 s | 6.04 s | 6.48 s | 100% |

** Daytona 的成功率較低（37%）** 可能與其測試條件有關，但其冷啟動速度確實是業界領先。

---

## 選型決策樹

```
起點：你的 agent 工作負載特徵
│
├─ 需要 GPU？ ──→ Modal（GPU 沙箱）或 Bedrock AgentCore
│
├─ 已在 Vercel 生態？ ──→ Vercel Sandbox（最短整合路徑）
│
├─ 已在 Cloudflare 生態？ ──→ Cloudflare Sandboxes（三層架構）
│
├─ 已在 Azure 生態？ ──→ Azure Container Apps Sandboxes
│
├─ 已在 AWS 生態？ ──→ Bedrock AgentCore
│
├─ 已在阿里雲生態？ ──→ Alibaba OpenSandbox
│
├─ 需要 pause/resume 保留記憶體？ ──→ E2B
│
├─ 需要快照與 fork（平行評測）？ ──→ Daytona
│
├─ 需要評測與 Blueprint 工作流？ ──→ Runloop
│
├─ 突發性互動式，敏感於成本？ ──→ Modal 或 Vercel（active-CPU）
│
└─ 其他：長任務、無特殊生態綁定 ──→ E2B 或 Daytona
```

---

## 讀完本文你應該理解

1. 九家雲端沙箱供應商的定位與差異。
2. wall-clock vs active-CPU 計費模式的成本差異，以及什麼場景選哪種。
3. 冷啟動速度對不同類型 agent 的影響。
4. 如何根據工作負載特徵選擇供應商。
5. 各家供應商的優勢與劣勢，避免選錯供應商導致遷移成本。

---

## 參考資料

- [E2B Documentation](https://e2b.dev/docs)
- [Daytona Documentation](https://www.daytona.io/docs)
- [Runloop Documentation](https://docs.runloop.ai/)
- [Vercel Sandbox](https://vercel.com/docs/sandbox)
- [Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/)
- [Modal Sandbox Guide](https://modal.com/docs/guide/sandbox)
- [AWS Bedrock AgentCore](https://docs.aws.amazon.com/bedrock/latest/userguide/agentcore.html)
- [Alibaba OpenSandbox](https://www.alibabacloud.com/)
- [Azure Container Apps Sandboxes](https://learn.microsoft.com/en-us/azure/container-apps/sandboxes-snapshots-state-management)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview)
- [本站：E2B Agent Sandbox（order 8）](/posts/ai/2026-08-22-e2b-agent-sandbox)
- [本站：Daytona Agent Sandbox（order 9）](/posts/ai/2026-08-22-daytona-agent-sandbox)
- [本站：Runloop Devbox（order 10）](/posts/ai/2026-08-22-runloop-agent-sandbox)
- [本站：Vercel Sandbox（order 11）](/posts/ai/2026-08-22-vercel-sandbox)
- [本站：Cloudflare Sandboxes（order 15）](/posts/ai/2026-08-22-cloudflare-sandboxes)

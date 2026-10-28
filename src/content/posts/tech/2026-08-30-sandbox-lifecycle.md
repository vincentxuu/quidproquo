---
title: "沙箱生命週期管理：暫停、快照、休眠與恢復"
date: 2026-08-30
category: tech
type: guide
tags: [sandbox, lifecycle, pause, resume, snapshot, hibernation, ai-agent]
lang: zh-TW
tldr: "沙箱系列的業務篇（order 28）。沙箱生命週期管理：暫停（pause）、快照（snapshot）、休眠（hibernation）、恢復（resume）的概念、實作方式、與長任務的適用場景。"
description: "沙箱生命週期管理：pause/resume、snapshot/hibernation、長任務適用場景、與成本優化。"
series:
  name: "沙箱系列"
  order: 29
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-sandbox-lifecycle-en)

## 本文定位

這篇是沙箱系列的「業務篇」（order 28），也是系列的附錄。它聚焦 **沙箱生命週期管理**：

1. **暫停（pause）與恢復（resume）** —— 釋放計算資源，保留狀態
2. **快照（snapshot）** —— 時間點狀態副本，建立新沙箱
3. **休眠（hibernation）** —— 長期閒置，零計算成本保留狀態
4. **長任務適用場景** —— 什麼情況下需要生命週期管理
5. **成本優化** —— 如何透過生命週期管理降低成本

---

## 生命週期階段

沙箱的完整生命週期分為六個階段：

| 階段 | 說明 | 資源佔用 |
|------|------|----------|
| 建立 (create) | 從鏡像啟動沙箱 | 完整 |
| 執行 (execute) | 執行代理程式碼 | 完整 |
| 暫停 (pause) | 釋放 CPU，保留記憶體與行程 | 中等（記憶體） |
| 快照 (snapshot) | 建立狀態檢查點 | 低（儲存） |
| 休眠 (hibernate) | 長期閒置，零計算成本 | 極低（儲存） |
| 銷毀 (destroy) | 釋放所有資源 | 零 |

```
建立 → 執行 → [暫停 ↔ 恢復] → [快照 → 從快照建立] → [休眠 → 喚醒] → 銷毀
```

---

## 暫停（Pause）與恢復（Resume）

### 概念

暫停是指暫時凍結沙箱的執行，釋放 CPU 資源，但保留記憶體與行程狀態。恢復則是從暫停狀態繼續執行。

### 適用場景

- **互動式 agent 工作流**：使用者與 agent 來回對話，對話之間沙箱可以暫停
- **長任務中斷**：任務需要等待外部輸入，期間沙箱可暫停
- **成本優化**：閒置期間不付 CPU 費用

### 實作方式

不同供應商的暫停實作有差異：

| 供應商 | 暫停方式 | 恢復速度 | 保留內容 |
|--------|----------|----------|----------|
| E2B | pause/resume API | ~1 秒 | 記憶體 + 行程 + 檔案 |
| Modal | pause/resume API | sub-second | 記憶體 + 行程 + 檔案 |
| Vercel | pause API | 3–3 秒 | 檔案（記憶體重建） |
| Cloudflare | pause API | 2–3 秒 | 檔案（記憶體重建） |
| Azure Container Apps | pause/resume API | 視規模而定 | 記憶體 + 行程 + 檔案 |

### 注意事項

- **記憶體保留成本**：暫停期間記憶體仍佔用資源，部分供應商按記憶體大小計費
- **網路連線中斷**：暫停期間網路連線會斷開，恢復後需重新連線
- **外部依賴過期**：token、lease、lock 等外部狀態在暫停期間可能過期

---

## 快照（Snapshot）

### 概念

快照是沙箱狀態的時間點副本，可用於建立新沙箱、備份與還原。

### 與暫停的差異

| 特性 | 暫停 (pause) | 快照 (snapshot) |
|------|-------------|-----------------|
| 繼續執行 | 原沙箱繼續 | 建立新沙箱 |
| 記憶體狀態 | 保留 | 不保留 |
| 行程狀態 | 保留 | 不保留 |
| 檔案狀態 | 保留 | 保留 |
| 適用場景 | 短暫中斷 | 長期儲存、跨沙箱共用 |

### 使用時機

- **建立檢查點**：在重要任務步驟前建立快照，失敗時可回滾
- **跨沙箱共用**：將一個沙箱的狀態複製到多個新沙箱
- **長期儲存**：暫停期間成本過高時，轉為快照儲存

---

## 休眠（Hibernation）

### 概念

休眠是長期閒置狀態，沙箱的完整狀態（包括記憶體）儲存到儲存媒體，計算資源完全釋放，計費降至極低。

### 適用場景

- **長期閒置**：沙箱預計數天或數週不使用
- **成本敏感**：希望零計算成本保留狀態
- **定期工作流**：每週或每月執行一次的 agent 工作流

### 實作差異

| 供應商 | 休眠支援 | 保留時間 | 喚醒速度 |
|--------|----------|----------|----------|
| Modal | 否 | N/A | N/A |
| E2B | 有 | 無限 | 秒級 |
| Blaxel | 有 (standby) | 無限 | 25 ms |
| Azure Container Apps | 有 | 視規模而定 | 視規模而定 |
| Freestyle | 有 | 無限 | 秒級 |

---

## 長任務適用場景

沙箱生命週期管理特別適合以下長任務場景：

### 場景 1：多步驟代理程式工作流

```
步驟 1：分析資料（沙箱執行）
    ↓ 暫停
等待使用者確認
    ↓ 恢復
步驟 2：生成報告（沙箱繼續執行）
```

### 場景 2：平行評測

建立多個快照，從同一個基礎狀態啟動多個平行評測沙箱，比較不同代理程式的表現。

### 場景 3：長時間訓練與評估

ML 模型訓練或評估可能需要數小時或數天，沙箱可在中間暫停、恢復，避免中斷後重新開始。

---

## 成本優化策略

| 策略 | 說明 | 適用場景 |
|------|------|----------|
| 閒置自動暫停 | 沙箱無活動時自動暫停 | 互動式 agent |
| 定期快照 | 重要狀態定期快照，避免重算 | 長任務 |
| 休眠長期閒置 | 預計長時間不使用時休眠 | 定期工作流 |
| 任務完成即銷毀 | 任務完成後立即銷毀沙箱 | 短命任務 |
| 選擇適當計費模式 | 突發場景選 active-CPU，長執行選 wall-clock | 各場景 |

---

## 讀完本文你應該理解

1. 沙箱生命週期的六個階段：建立、執行、暫停、快照、休眠、銷毀。
2. 暫停與快照的差異，以及各自的適用場景。
3. 休眠的概念與實作差異（各供應商支援程度不同）。
4. 三個長任務適用場景：多步驟工作流、平行評測、長時間訓練。
5. 五個成本優化策略：閒置自動暫停、定期快照、休眠長期閒置、任務完成即銷毀、選擇適當計費模式。

---

## 參考資料

- [Azure Container Apps Sandboxes Documentation](https://learn.microsoft.com/en-us/azure/container-apps/sandboxes-snapshots-state-management)
- [E2B Sandbox Persistence](https://e2b.dev/docs/sandbox/persistence)
- [Modal Sandbox Snapshots](https://modal.com/docs/guide/sandbox-snapshots)
- [Blaxel Sub-second Sandbox Startup 2026](https://blaxel.ai/blog/sub-second-sandbox-startup-2026)
- [Beam: Best Stateful Sandboxes for Code Execution in 2026](https://www.beam.cloud/blog/best-stateful-sandbox-code-execution-2026)
- [Kubernetes-sigs/agent-sandbox: Guest Agent Proposal](https://github.com/kubernetes-sigs/agent-sandbox/issues/1237)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape)
- [本站：沙箱成本模型（order 26）](/posts/tech/2026-08-30-sandbox-cost-model)

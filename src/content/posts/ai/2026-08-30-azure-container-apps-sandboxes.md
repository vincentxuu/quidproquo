---
title: "Azure Container Apps Sandboxes"
date: 2026-08-30
category: ai
type: deep-dive
tags: [sandbox, azure, container-apps, cloud, ai-agent, microsoft]
lang: zh-TW
tldr: "沙箱系列的雲端深入篇（order 14）。Azure Container Apps Sandboxes 的架構、snapshot 與 state management、lifecycle policy、與其他供應商的取捨，以及 Azure 生態整合優勢。"
description: "Azure Container Apps Sandboxes 深入介紹：架構、快照與狀態管理、生命週期策略、安全邊界、與 E2B/Daytona/Modal 等供應商比較。"
series:
  name: "沙箱系列"
  order: 14
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-30-azure-container-apps-sandboxes-en)

## 本文定位

這篇是沙箱系列的「雲端深入篇」（order 14），聚焦 **Azure Container Apps Sandboxes** —— 微軟 Azure 推出的雲端原生沙箱服務。作為微軟雲端生態的一部分，它與 AWS Bedrock AgentCore、阿里雲 OpenSandbox 並列，是企業級 Azure 使用者的自然選擇。

本文涵蓋：
1. **Azure Container Apps Sandboxes 架構** —— 控制面、執行面、隔離技術
2. **Snapshot 與 State Management** —— 快照、狀態保留、pause/resume
3. **Lifecycle Policy** —— 生命週期策略、自動銷毀、閒置處理
4. **安全邊界** —— 網路策略、身份驗證、憑證管理
5. **與其他供應商的取捨** —— E2B、Daytona、Modal、Bedrock AgentCore 比較
6. **Azure 生態整合優勢** —— 與 Azure AI、AKS、Key Vault 整合

---

## Azure Container Apps Sandboxes 架構

Azure Container Apps Sandboxes 採用微軟雲端原生架構，建立在 Azure Container Apps 平台之上，使用 microVM 隔離：

```
┌─────────────────────────────────────┐
│          Azure 控制面                 │
│  - Container Apps 環境設定            │
│  - Sandbox 生命週期策略               │
│  - 快照與狀態管理                     │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│          執行面                         │
│  - microVM 隔離                       │
│  - 容器執行環境                       │
│  - 網路策略                           │
└─────────────────────────────────────┘
```

### 隔離技術

Azure Container Apps Sandboxes 使用 **microVM 隔離**，每個沙箱運行在獨立的虛擬機內，提供與容器相比更強的隔離保證。這與 AWS Bedrock AgentCore 的 Firecracker microVM 類似，但整合在 Azure Container Apps 生態內。

### 沙箱生命週期

Azure Container Apps Sandboxes 支援完整的生命週期管理：

1. **建立**：從容器鏡像建立沙箱
2. **執行**：透過 SDK 或 CLI 發送指令
3. **暫停 (pause)**：釋放計算資源，保留狀態
4. **恢復 (resume)**：自動恢復，於網路連線進入時喚醒
5. **快照 (snapshot)**：建立沙箱狀態檢查點
6. **從快照建立**：從快照建立新沙箱
7. **自動銷毀**：根據 lifecycle policy 自動清理閒置沙箱

---

## Snapshot 與 State Management

Azure Container Apps Sandboxes 提供兩種狀態保留機制：

### Snapshot

Snapshot 是沙箱狀態的時間點副本，可用於：
- 建立新沙箱（從快照還原）
- 備份與還原
- 跨沙箱狀態共享

**Snapshot 與 Resume 的差異**：
- **Resume**：繼續在現有沙箱上執行，保留記憶體與行程狀態
- **Snapshot**：建立新沙箱，從捕獲的時間點狀態開始

### State Management

Azure Container Apps Sandboxes 支援持久儲存體，檔案可跨重啟保留。但記憶體狀態僅在 pause/resume 期間保留，snapshot 不保留記憶體狀態。

---

## Lifecycle Policy

Azure Container Apps Sandboxes 支援 **lifecycle policy** 作為預設安全網：

| 策略 | 說明 | 適用場景 |
|------|------|----------|
| 自動暫停 | 沙箱閒置後自動暫停 | 節省計算成本 |
| 自動銷毀 | 沙箱達到最大存活時間後自動銷毀 | 防止資源洩漏 |
| 閒置超時 | 無網路活動時自動暫停 | 互動式 agent 工作流 |

**使用時機**：
- 使用 lifecycle policy 當需要例行性自動清理
- 使用 snapshots 當需要明確的檢查點或可重現的啟動

---

## 安全邊界

### 網路策略

Azure Container Apps Sandboxes 支援網路策略，控制出站與入站流量。預設情況下，沙箱的網路存取受到限制，需要明確設定允許清單。

### 身份驗證

與 Azure Active Directory (Entra ID) 整合，支援以 Azure 身份驗證沙箱存取，避免將長期金鑰傳入沙箱。

### 憑證管理

與 Azure Key Vault 整合，憑證由 Key Vault 管理，沙箱按需存取，避免憑證落地。

---

## 與其他供應商的取捨

| 供應商 | 隔離技術 | 冷啟動 | 定價模式 | 最適合 |
|--------|----------|--------|----------|--------|
| Azure Container Apps Sandboxes | microVM | ~1–2 s | wall-clock | Azure 生態整合 |
| AWS Bedrock AgentCore | Firecracker microVM | ~1–2 s | wall-clock | AWS 生態整合 |
| Alibaba OpenSandbox | gVisor | ~200 ms | wall-clock | 阿里雲生態 |
| E2B | Firecracker microVM | ~150 ms | wall-clock | Coding agent、長任務 |
| Modal | gVisor / microVM | sub-second | wall-clock (無 idle) | GPU 工作負載 |

**選擇 Azure Container Apps Sandboxes 的條件**：
- 已深度綁定 Azure 生態
- 需要與 Azure AI、AKS、Key Vault 整合
- 資料必須留在 Azure 區域

---

## Azure 生態整合優勢

### 與 Azure AI 整合

Azure Container Apps Sandboxes 與 Azure AI 服務（Azure OpenAI、Azure AI Search 等）無縫整合，讓 agent 可以在沙箱內安全地呼叫 Azure AI API。

### 與 AKS 整合

對於需要 Kubernetes 編排的場景，Azure Container Apps Sandboxes 可與 Azure Kubernetes Service (AKS) 整合，支援大規模沙箱佈署。

### 與 Key Vault 整合

憑證與密鑰透過 Azure Key Vault 管理，沙箱按需存取，避免長期金鑰傳入沙箱環境。

---

## 讀完本文你應該理解

1. Azure Container Apps Sandboxes 的架構與隔離技術（microVM）。
2. Snapshot 與 Resume 的差異，以及 State Management 的範圍。
3. Lifecycle Policy 的設定與使用時機。
4. 安全邊界：網路策略、Entra ID 身份驗證、Key Vault 憑證管理。
5. 與 AWS Bedrock AgentCore、Alibaba OpenSandbox、E2B、Daytona、Modal 的取捨。
6. Azure 生態整合優勢：Azure AI、AKS、Key Vault。

---

## 參考資料

- [Azure Container Apps Sandboxes Documentation](https://learn.microsoft.com/en-us/azure/container-apps/sandboxes-snapshots-state-management)
- [Azure Container Apps Documentation](https://learn.microsoft.com/en-us/azure/container-apps/)
- [Azure Key Vault Documentation](https://learn.microsoft.com/en-us/azure/key-vault/)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape)
- [本站：Amazon Bedrock AgentCore 與 Alibaba OpenSandbox（order 13）](/posts/ai/2026-08-30-bedrock-agentcore-opensandbox)

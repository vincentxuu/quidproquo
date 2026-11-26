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

> :globe: [English version](/posts/ai/2026-08-30-azure-container-apps-sandboxes-en)

## 本文定位

這篇是沙箱系列的「雲端深入篇」（order 14），聚焦 **Azure Container Apps Sandboxes** —— 微軟 Azure 推出的雲端原生沙箱服務，2026-09-23 GA。作為微軟雲端生態的一部分，它與 AWS Bedrock AgentCore 並列，是企業級 Azure 使用者的自然選擇。

本文涵蓋：
1. **Azure Container Apps Sandboxes 架構** —— 控制面、執行面、隔離技術
2. **Snapshot 與 State Management** —— 快照、狀態保留、pause/resume
3. **Lifecycle Policy** —— 生命週期策略、自動銷毀、閒置處理
4. **安全邊界** —— 網路策略、身份驗證、憑證管理
5. **與其他供應商的取捨** —— E2B、Daytona、Modal、Bedrock AgentCore 比較
6. **Azure 生態整合優勢** —— 與 Microsoft 產品共用底層、managed identity、VNet

---

## Azure Container Apps Sandboxes 架構

Azure Container Apps Sandboxes 在 2026-06-02（Build'26）推出 public preview，2026-09-23 GA。它是 Container Apps 裡和 apps、jobs、dynamic sessions 並列的一級資源類型（`Microsoft.App/SandboxGroups`）：

```
┌─────────────────────────────────────┐
│          Azure 控制面（ARM）          │
│  - Sandbox Group：映像、快照、volume、 │
│    secret、managed identity 的共用範圍 │
│  - 預設資源、VNet、身分設定           │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│          執行面                         │
│  - 每個沙箱一台 microVM（自有 kernel） │
│  - 從 disk image 或 snapshot 啟動      │
│  - 沙箱外的 ingress／egress proxy      │
└─────────────────────────────────────┘
```

### 隔離技術

每個沙箱是一台[硬體隔離的 microVM](https://techcommunity.microsoft.com/blog/appsonazureblog/azure-container-apps-sandboxes-now-generally-available/4559125)，有自己的 Linux kernel 與虛擬硬體，記憶體由 CPU 虛擬化隔開；一般容器 runtime 則共享主機 kernel。根檔案系統來自 OCI image 轉成的 disk image，也有官方提供的 Ubuntu、Python、Node.js、Claude Code 等映像。資源依 tier 分級，從 0.25 core／0.5 GiB 到 16 core／32 GiB。

### 沙箱生命週期

1. **建立**：從 disk image 或 snapshot 建立沙箱，官方稱 1 秒內開機
2. **執行**：透過 Python 或 TypeScript SDK、`aca` CLI 或 REST API 下指令
3. **閒置自動暫停（auto-suspend）**：閒置一段時間後依 lifecycle policy 暫停
4. **恢復**：收到 start 指令或有網路流量進來時恢復，官方稱 1 秒內
5. **快照**：手動或在暫停時自動建立，可包含記憶體與磁碟
6. **從快照建立**：從快照分出新沙箱
7. **自動刪除**：停止超過設定天數後由 lifecycle policy 清掉

---

## Snapshot 與 State Management

Azure 把沙箱狀態分成三種：記憶體內狀態（process、開啟的檔案、terminal session）、本機磁碟狀態，以及寫在沙箱外的外部狀態。前兩種跟著沙箱生命週期走，所以平台提供 lifecycle policy 與 snapshot 兩種保存方式。

### Snapshot

Snapshot 是沙箱狀態的時間點副本，可以連記憶體、磁碟與執行中的程序一起保存，可用於：
- 在高風險操作前建立檢查點
- 從同一個準備好的環境分出多個沙箱
- 刪除沙箱前保存本機狀態

Snapshot 只保存沙箱本機狀態，不會協調資料庫、佇列、物件儲存或外部 API 的寫入；從快照分出的新沙箱可能重複執行非冪等操作，流程要自己設計。

### State Management

需要比沙箱活得久的資料，要放在掛載的 volume（Azure Blob、自帶 Blob 或 Data Disk）；這些資料在沙箱刪除後仍保留。掛了 Data Disk volume 的沙箱不能用記憶體快照。

---

## Lifecycle Policy

Lifecycle policy 適合例行的閒置與恢復，snapshot 適合刻意的檢查點：

| 策略 | 說明 | 適用場景 |
|------|------|----------|
| 自動暫停（Memory 模式） | 閒置後暫停並保存完整狀態，包括記憶體 | 對話之間要保留 process 的互動式 agent |
| 自動暫停（Disk 模式） | 只保存磁碟，恢復時 VM 重新開機 | 只需要檔案、可以重啟的工作 |
| 自動刪除 | 停止超過設定天數後刪除 | 防止棄置的沙箱累積快照儲存費 |

---

## 安全邊界

### 網路策略

每個沙箱有自己的 egress policy，由沙箱外的 proxy 執行：預設動作可設 Allow 或 Deny，再加網域樣式或 CIDR 規則。預設值不是一律拒絕，要跑不可信程式碼時應明確設成 Deny，再只開放需要的端點；Network Audit 會記錄每個允許與拒絕。也可以接自己的 VNet 存取私有資源。

### 身份驗證

Sandbox Group 支援 system-assigned 與 user-assigned managed identity，沙箱可以用 Entra ID 身分存取 Azure 資源，不必把長期金鑰傳進沙箱。

### 憑證管理

Sandbox Group 可存放 secret，egress policy 的 transform 規則會在 proxy 端把驗證 header 加到對外請求上，沙箱內的程式碼看不到 secret 本身。要存取 Key Vault，則用 managed identity。

### 計費

運行中的沙箱按 vCPU 核心秒與記憶體 GiB 秒計費，停止後不收運算費；disk image、snapshot 與 volume 另按儲存量計價（官方標示儲存計費即將開始）。

---

## 與其他供應商的取捨

| 供應商 | 隔離技術 | 冷啟動 | 定價模式 | 最適合 |
|--------|----------|--------|----------|--------|
| Azure Container Apps Sandboxes | microVM | 官方稱 1 秒內 | 運行時按秒計費，停止不收運算費 | Azure 生態整合 |
| AWS Bedrock AgentCore | microVM（Runtime）／容器（Code Interpreter） | ~1–2 s | active-CPU | AWS 生態整合 |
| OpenSandbox | 預設 runc，可選 gVisor／Kata／Firecracker | 視部署而定 | 開源自架 | 自有 Kubernetes |
| E2B | Firecracker microVM | ~150 ms | wall-clock | Coding agent、長任務 |
| Modal | gVisor / microVM | sub-second | request 與用量取高者 | GPU 工作負載 |

**選擇 Azure Container Apps Sandboxes 的條件**：
- 已深度綁定 Azure 生態
- 需要用 managed identity、VNet 與 Azure 資源整合
- 資料必須留在 Azure 區域

---

## Azure 生態整合優勢

### 與 Microsoft 產品共用底層

官方說明 GitHub Copilot 的 cloud sandboxes、Foundry Hosted Agents、Azure SRE Agent 與 Container Apps Express 都跑在同一套沙箱基礎設施上。

### 與 Azure 服務整合

沙箱透過 managed identity 存取 Key Vault、Storage 等 Azure 服務，透過 VNet 整合連到私有端點；telemetry 可輸出 console log、平台指標、OpenTelemetry 與 egress 決策紀錄。

### 部署工具

GA 版提供 Python 與 TypeScript SDK、`aca` CLI、Bicep，以及 preview 階段的 Terraform provider；.NET SDK 仍在規劃中。

---

## 讀完本文你應該理解

1. Azure Container Apps Sandboxes 的架構與隔離技術（microVM）。
2. Snapshot 與 Resume 的差異，以及 State Management 的範圍。
3. Lifecycle Policy 的設定與使用時機。
4. 安全邊界：egress 政策、Entra ID managed identity、proxy 端注入憑證。
5. 與 AWS Bedrock AgentCore、OpenSandbox、E2B、Modal 的取捨。
6. Azure 生態整合優勢：共用底層、managed identity、VNet 與部署工具。

---

## 更新紀錄

- 2026-11-23：補 2026-06 public preview、2026-09-23 GA；snapshot 改正為可含記憶體；lifecycle policy 改為官方的 auto-suspend（Memory／Disk 模式）與 auto-delete；網路預設動作可設 Allow 或 Deny、憑證由 proxy 端注入；補計費方式與 SDK；刪除未見官方說明的 AKS 整合，改寫生態整合段。

## 參考資料

- [Azure Container Apps Sandboxes overview](https://learn.microsoft.com/en-us/azure/container-apps/sandboxes-overview)
- [Azure Container Apps Sandboxes：Snapshots and state management](https://learn.microsoft.com/en-us/azure/container-apps/sandboxes-snapshots-state-management)
- [Introducing Azure Container Apps Sandboxes（public preview 公告）](https://techcommunity.microsoft.com/blog/appsonazureblog/introducing-azure-container-apps-sandboxes-secure-infrastructure-for-agentic-wor/4524131)
- [Azure Container Apps Sandboxes, Now Generally Available](https://techcommunity.microsoft.com/blog/appsonazureblog/azure-container-apps-sandboxes-now-generally-available/4559125)
- [Azure Container Apps Documentation](https://learn.microsoft.com/en-us/azure/container-apps/)
- [Azure Key Vault Documentation](https://learn.microsoft.com/en-us/azure/key-vault/)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape)
- [本站：Amazon Bedrock AgentCore 與 Alibaba OpenSandbox（order 13）](/posts/ai/2026-08-30-bedrock-agentcore-opensandbox)

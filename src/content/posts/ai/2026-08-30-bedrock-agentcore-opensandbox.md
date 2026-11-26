---
title: "Amazon Bedrock AgentCore 與 Alibaba OpenSandbox"
date: 2026-08-30
category: ai
type: deep-dive
tags: [sandbox, bedrock, agentcore, alibaba, opensandbox, cloud, ai-agent]
lang: zh-TW
tldr: "沙箱系列的雲端深入篇（order 13）。AWS 託管的 Bedrock AgentCore（Runtime 與 Code Interpreter）與阿里巴巴開源、可自架的 OpenSandbox：架構、隔離方式、多語言 SDK、定價與部署模式，以及與其他供應商的取捨。"
description: "AWS Bedrock AgentCore 與 OpenSandbox 深入介紹：託管與自架兩種沙箱、多語言 SDK、定價、安全邊界、與 E2B/Daytona/Modal 等供應商比較。"
series:
  name: "沙箱系列"
  order: 13
draft: false
---

> :globe: [English version](/posts/ai/2026-08-30-bedrock-agentcore-opensandbox-en)

## 本文定位

這篇是沙箱系列的「雲端深入篇」（order 13），聚焦 **Amazon Bedrock AgentCore** 與 **OpenSandbox**。前者是 AWS 把沙箱做成原生 AI 基礎設施的託管服務；後者由阿里巴巴開源、現屬 AAIF，是在自有基礎設施上跑的自架方案。兩者與 E2B/Daytona 等獨立供應商的定位都不同。

本文涵蓋：
1. **Amazon Bedrock AgentCore** —— 架構、Code Interpreter、Runtime、多語言 SDK
2. **OpenSandbox** —— 架構、可換的隔離執行環境、五語言 SDK、自架模式
3. **與獨立供應商的取捨** —— E2B、Daytona、Modal 比較
4. **雲端鎖定與遷移考量**

---

## Amazon Bedrock AgentCore

### 產品定位

Amazon Bedrock AgentCore 是 AWS 的 agent 基礎設施，裡面跟沙箱有關的是兩個不同的服務：**Runtime** 負責託管 agent 本身，**Code Interpreter** 是給 agent 呼叫、用來執行程式碼的內建工具。兩者常被混為一談，選型時要分開看。

### 架構

```
┌─────────────────────────────────────┐
│         Amazon Bedrock AgentCore     │
│  - Runtime：託管 agent，每 session    │
│    一台專屬 microVM                   │
│  - Code Interpreter：內建工具，       │
│    容器化的程式執行環境               │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│         執行面                         │
│  - Python / JavaScript / TypeScript   │
│  - session 內保留狀態（預設 15 分鐘）  │
│  - 網路模式：Sandbox / Public / VPC   │
└─────────────────────────────────────┘
```

### 核心功能

#### 1. Code Interpreter

[Code Interpreter](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html) 在容器化環境裡執行程式碼，支援 Python、JavaScript 與 TypeScript，也能跑 terminal 指令；inline 上傳檔案最大 100 MB，經 S3 最大 5 GB。採 session 模型：同一個 session 內保留檔案與變數，session 逾時預設 15 分鐘、可調，逾時自動結束。

#### 2. Runtime

[Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-sessions.html) 是部署 agent 的地方，不是互動式 shell 工具。每個使用者 session 拿到一台專屬 microVM，運算、記憶體與檔案系統彼此隔離，session 結束後清掉。

#### 3. 安全邊界

- 建立 Code Interpreter 時選[網路模式](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-resource-management.html)：Sandbox 只能連有限的 AWS 服務（例如 S3），Public 可連公網，VPC 接到自己的 VPC
- 能存取哪些 AWS 資源由 execution role（IAM）決定，不必把長期金鑰放進沙箱
- 同一個 Code Interpreter 可同時開多個 session，各自保留狀態

### 定價

AgentCore Code Interpreter 按[實際用量](https://aws.amazon.com/bedrock/agentcore/pricing/)計費：CPU 每 vCPU 小時 0.0895 美元，只算實際消耗，I/O 等待與閒置不收；記憶體每 GB 小時 0.00945 美元，按 session 期間用量計。這屬於 active-CPU 一類，不是 wall-clock。

### SDK

除了各語言的 AWS SDK，官方另有 `bedrock-agentcore` 的 Python SDK 與 TypeScript SDK，可直接開 Code Interpreter session。

---

## OpenSandbox

### 產品定位

[OpenSandbox](https://github.com/opensandbox-group/OpenSandbox) 由阿里巴巴開源，現在是 Agentic AI Foundation（AAIF）的專案，repository 移到 `opensandbox-group`，授權 Apache-2.0。它不是阿里雲的託管服務，而是一套讓你在自己的基礎設施上跑 agent 沙箱的軟體：本機先用 Docker 起，正式環境部署到 Kubernetes。

### 架構

```
┌─────────────────────────────────────┐
│         OpenSandbox Server             │
│  - 統一的沙箱生命週期 API              │
│  - Docker（本機）／Kubernetes（叢集）   │
│  - ingress gateway 與 egress 政策      │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│         執行面                         │
│  - 預設 runc                           │
│  - 可選 gVisor、Kata、Firecracker      │
│  - 指令、檔案、程式碼執行 API          │
└─────────────────────────────────────┘
```

### 核心功能

#### 1. 可換的隔離執行環境

預設用一般的 runc 容器，適合可信工作負載與本機開發。要跑不可信程式碼時，依[官方 secure container 指南](https://github.com/opensandbox-group/OpenSandbox/blob/main/docs/guides/secure-container.md)換成 gVisor（使用者態核心攔 syscall）或 Kata Containers（QEMU、Firecracker、Cloud Hypervisor 三種 VMM）。官方的 Fast Sandbox 路線用 Firecracker，宣稱單一建立 P50 64 毫秒，並支援保留記憶體與磁碟的 pause／resume。

#### 2. 多語言 SDK

官方 SDK 涵蓋 Python、Java／Kotlin、TypeScript／JavaScript、C#／.NET 與 Go，另有 `osb` 命令列工具與 MCP 介面。

#### 3. 檔案系統、網路與憑證

- 沙箱內有完整檔案系統，可安裝套件、讀寫檔案、執行程式
- 入站流量走統一的 ingress gateway，出站用每個沙箱各自的 egress 政策控制
- Credential Vault 讓 agent 呼叫外部服務時看不到真正的憑證

### 自架而非 BYOC

OpenSandbox 本身就是開源自架：控制面與沙箱都跑在你的 Docker 或 Kubernetes 上，所以資料留在自己的環境，代價是升級、擴充與故障都要自己處理。這和 E2B 的 BYOC（由 E2B 在你的雲端帳號裡代管）是不同的責任分界。

---

## 與獨立供應商的取捨

| 維度 | Bedrock AgentCore | OpenSandbox | E2B | Daytona | Modal |
|------|-------------------|-------------|-----|---------|-------|
| 部署方式 | AWS 託管 | 開源自架 | 託管；BYOC 或自架 E2B Embed | 託管；公開 repo 已封存 | 託管 |
| 隔離技術 | microVM（Runtime）／容器（Code Interpreter） | 預設 runc，可選 gVisor／Kata／Firecracker | Firecracker microVM | Docker / Kata | gVisor / microVM |
| 多語言 SDK | Python／TypeScript（另有 AWS SDK） | Python／Java／TypeScript／C#／Go | Python／TypeScript | Python／TypeScript 等 | Python／JavaScript／Go |
| BYOC | 否 | 不適用（本身自架） | 是（Enterprise，AWS／GCP／Azure） | 企業方案 | 否 |
| GPU 支援 | 否 | 看你的叢集 | 否 | 有 | ✓（T4–B300） |
| 狀態保留 | session 內狀態 | pause/resume（Firecracker 路線） | pause/resume | snapshot/fork | 檔案系統與記憶體快照 |

### 選雲端原生沙箱的條件

- 已深度綁定 AWS 生態（AgentCore）
- 需要與現有雲端服務（S3、RDS、OSS 等）無縫整合
- 資料主權要求高，希望資料留在自有雲端
- 不希望額外管理第三方供應商關係

### 選獨立供應商的條件

- 需要跨雲端可移植性
- 需要 GPU 沙箱（Modal）
- 需要開源自建（OpenSandbox、E2B Embed）
- 希望避免雲端鎖定

---

## 雲端鎖定與遷移考量

### 雲端鎖定風險

使用 Bedrock AgentCore 意味著與 AWS 綁定；OpenSandbox 雖然開源，API 一樣是它自己的：

1. **API 鎖定**：沙箱建立、執行、銷毀 API 與雲端供應商綁定，遷移需要重寫程式碼。
2. **資料鎖定**：沙箱內的檔案與狀態存於雲端供應商的儲存服務，遷移需要資料搬遷。
3. **身分鎖定**：IAM 憑證與權限模型與雲端供應商綁定。

### 遷移策略

如果未來可能需要遷移，建議：

1. **抽象沙箱介面**：在應用程式層建立抽象介面，將具體供應商的 SDK 包裝起來。
2. **標準化鏡像**：使用 OCI 容器鏡像，方便在不同供應商間遷移。
3. **外部儲存狀態**：將沙箱狀態儲存在外部儲存服務（如 S3、OSS），而非沙箱內部。
4. **保留開源選項**：評估 OpenSandbox 這類可自架的方案，保留自建能力。

---

## 讀完本文你應該理解

1. Amazon Bedrock AgentCore 的架構與核心功能（Code Interpreter、Runtime、安全邊界）。
2. OpenSandbox 的架構與核心功能（可換的隔離執行環境、多語言 SDK、自架）。
3. 兩家與 E2B/Daytona/Modal 等獨立供應商的取捨。
4. 雲端鎖定風險與遷移策略。
5. 什麼情況下選雲端原生沙箱，什麼情況下選獨立供應商。

---

## 更新紀錄

- 2026-11-23：AgentCore 改正 Runtime（託管 agent、每 session 一台 microVM）與 Code Interpreter（容器化、Python／JavaScript／TypeScript、預設 15 分鐘 session）的分工，補 active-CPU 定價與網路模式；OpenSandbox 改為開源自架（現屬 AAIF、repo 移到 opensandbox-group，預設 runc、可選 gVisor／Kata／Firecracker、五語言 SDK、Credential Vault），刪除 gRPC 與 BYOC 說法；比較表依各家現況重寫。

## 參考資料

- [Amazon Bedrock AgentCore Documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/agentcore.html)
- [Amazon Bedrock AgentCore Code Interpreter](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html)
- [AgentCore Code Interpreter session 管理](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-resource-session-management.html)
- [AgentCore Runtime sessions](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-sessions.html)
- [Amazon Bedrock AgentCore Pricing](https://aws.amazon.com/bedrock/agentcore/pricing/)
- [OpenSandbox GitHub](https://github.com/opensandbox-group/OpenSandbox)
- [OpenSandbox Secure Container Runtime Guide](https://github.com/opensandbox-group/OpenSandbox/blob/main/docs/guides/secure-container.md)
- [E2B BYOC](https://docs.e2b.dev/byoc)
- [E2B Documentation](https://e2b.dev/docs)
- [Daytona Documentation](https://www.daytona.io/docs)
- [Modal Sandbox Guide](https://modal.com/docs/guide/sandbox)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape)

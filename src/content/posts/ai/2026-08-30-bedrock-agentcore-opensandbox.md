---
title: "Amazon Bedrock AgentCore 與 Alibaba OpenSandbox"
date: 2026-08-30
category: ai
type: deep-dive
tags: [sandbox, bedrock, agentcore, alibaba, opensandbox, cloud, ai-agent]
lang: zh-TW
tldr: "沙箱系列的雲端深入篇（order 13）。AWS Bedrock AgentCore 與阿里雲 OpenSandbox 兩大雲端原生沙箱服務的架構、多語言 SDK、BYOC 模式、與其他供應商的取捨。"
description: "AWS Bedrock AgentCore 與 Alibaba OpenSandbox 深入介紹：雲端原生沙箱、多語言 SDK、BYOC 模式、安全邊界、與 E2B/Daytona/Modal 等供應商比較。"
series:
  name: "沙箱系列"
  order: 13
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-30-bedrock-agentcore-opensandbox-en)

## 本文定位

這篇是沙箱系列的「雲端深入篇」（order 13），聚焦 **Amazon Bedrock AgentCore** 與 **Alibaba OpenSandbox** 兩大雲端原生沙箱服務。這兩家代表了雲端巨頭（AWS 與阿里雲）將沙箱作為原生 AI 基礎設施的一部分提供的方案，與 E2B/Daytona 等獨立供應商有不同的定位與優勢。

本文涵蓋：
1. **Amazon Bedrock AgentCore** —— 架構、Code Interpreter、Runtime、多語言 SDK
2. **Alibaba OpenSandbox** —— 架構、gVisor 隔離、四語言 SDK、BYOC 模式
3. **與獨立供應商的取捨** —— E2B、Daytona、Modal 比較
4. **雲端鎖定與遷移考量**

---

## Amazon Bedrock AgentCore

### 產品定位

Amazon Bedrock AgentCore 是 AWS 針對 AI agent 執行環境提供的原生沙箱服務，作為 Amazon Bedrock 生態的一部分。它不只是「沙箱」，而是一個完整的 agent 執行平台，包含 Code Interpreter 與 Runtime 兩個內建工具。

### 架構

```
┌─────────────────────────────────────┐
│         Amazon Bedrock               │
│  - AgentCore 控制面                   │
│  - Code Interpreter 內建工具          │
│  - Runtime 內建工具                   │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│         執行面                         │
│  - Firecracker microVM 隔離           │
│  - 多語言執行環境                     │
│  - 狀態保留（session state）          │
└─────────────────────────────────────┘
```

### 核心功能

#### 1. Code Interpreter

AgentCore 的 Code Interpreter 給 agent 一個安全的沙箱來執行程式碼，支援多種語言（Python、Node.js、Java 等），可跨多個步驟保留狀態（環境變數、工作目錄、運行中的行程）。

#### 2. Runtime

Runtime 支援互動式 shell 工作階段，狀態保留於 session 生命週期內，適合需要多步驟互動的 agent 工作流。

#### 3. 安全邊界

- 每個 agent 運行在獨立的沙箱內
- 預設無出網，需主動設定網路策略
- 憑證不落地沙箱，透過 IAM 角色注入

### 多語言 SDK

Bedrock AgentCore 提供 Python、Node.js、Java 等多語言 SDK，讓開發者可以從應用程式內直接建立與管理沙箱。

---

## Alibaba OpenSandbox

### 產品定位

Alibaba OpenSandbox 是阿里雲推出的開源 AI agent 執行平台，採用 gVisor 核心層級沙箱隔離，支援 Python、Node.js、Go、Rust 四種語言的官方 SDK，並採用 gRPC 與控制平面通訊。

### 架構

```
┌─────────────────────────────────────┐
│         OpenSandbox 控制面             │
│  - gRPC 控制平面                      │
│  - 沙箱生命週期管理                   │
│  - 自動重連與重試                     │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│         執行面                         │
│  - gVisor 核心層級沙箱                │
│  - 完整檔案系統（可讀寫）             │
│  - 程序生命週期管理                   │
└─────────────────────────────────────┘
```

### 核心功能

#### 1. gVisor 隔離

OpenSandbox 使用 gVisor 進行核心層級隔離，每個沙箱擁有獨立的使用者態核心（Sentry）與檔案系統代理（Gofer），防止沙箱內程式碼直接碰到 host 核心。

#### 2. 多語言 SDK

OpenSandbox 出廠即提供 Python、TypeScript、Go、Java 四種語言的官方 SDK，功能一致，透過 gRPC 與控制平面通訊，支援自動重連與請求重試。

#### 3. 檔案系統與網路

- 沙箱內擁有完整檔案系統，可安裝套件、建立檔案、遍歷目錄
- 可設定網路策略，控制出站流量至外部 API、資料庫、網頁服務
- 即時 stdout/stderr 串流與行程生命週期管理

### BYOC 模式

OpenSandbox 支援 BYOC（Bring Your Own Cloud），讓企業在自有雲端（AWS、GCP、Azure）上部署 OpenSandbox 控制平面，保留資料主權與合規要求。

---

## 與獨立供應商的取捨

| 維度 | Bedrock AgentCore | Alibaba OpenSandbox | E2B | Daytona | Modal |
|------|-------------------|---------------------|-----|---------|-------|
| 雲端鎖定 | AWS | 阿里雲 | 低（開源 runtime） | 低（開源 runtime） | 低 |
| 隔離技術 | Firecracker microVM | gVisor | Firecracker microVM | Docker / Kata | gVisor / microVM |
| 多語言 SDK | Python/Node.js/Java | Python/Go/Java/Rust | Python/TypeScript | 多語言 | Python/TypeScript/Go |
| BYOC | 否 | 是 | 是（AWS/GCP/Azure） | 否 | 否 |
| GPU 支援 | 有限 | 有限 | 否 | 有限 | ✅ (A100/H100) |
| 狀態保留 | session 狀態 | 程序/檔案/網路 API | pause/resume | snapshot/fork | snapshot/pause/resume |

### 選雲端原生沙箱的條件

- 已深度綁定 AWS 或阿里雲生態
- 需要與現有雲端服務（S3、RDS、OSS 等）無縫整合
- 資料主權要求高，希望資料留在自有雲端
- 不希望額外管理第三方供應商關係

### 選獨立供應商的條件

- 需要跨雲端可移植性
- 需要 GPU 沙箱（Modal）
- 需要開源自建（E2B、Daytona）
- 希望避免雲端鎖定

---

## 雲端鎖定與遷移考量

### 雲端鎖定風險

使用 Bedrock AgentCore 或 OpenSandbox 意味著與特定雲端供應商綁定：

1. **API 鎖定**：沙箱建立、執行、銷毀 API 與雲端供應商綁定，遷移需要重寫程式碼。
2. **資料鎖定**：沙箱內的檔案與狀態存於雲端供應商的儲存服務，遷移需要資料搬遷。
3. **身分鎖定**：IAM 憑證與權限模型與雲端供應商綁定。

### 遷移策略

如果未來可能需要遷移，建議：

1. **抽象沙箱介面**：在應用程式層建立抽象介面，將具體供應商的 SDK 包裝起來。
2. **標準化鏡像**：使用 OCI 容器鏡像，方便在不同供應商間遷移。
3. **外部儲存狀態**：將沙箱狀態儲存在外部儲存服務（如 S3、OSS），而非沙箱內部。
4. **保留開源選項**：評估 OpenSandbox 的 BYOC 模式，保留自建能力。

---

## 讀完本文你應該理解

1. Amazon Bedrock AgentCore 的架構與核心功能（Code Interpreter、Runtime、安全邊界）。
2. Alibaba OpenSandbox 的架構與核心功能（gVisor 隔離、多語言 SDK、BYOC）。
3. 兩家與 E2B/Daytona/Modal 等獨立供應商的取捨。
4. 雲端鎖定風險與遷移策略。
5. 什麼情況下選雲端原生沙箱，什麼情況下選獨立供應商。

---

## 參考資料

- [Amazon Bedrock AgentCore Documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/agentcore.html)
- [Alibaba OpenSandbox](https://www.alibabacloud.com/)
- [OpenSandbox GitHub](https://github.com/alibaba/opensandbox)
- [E2B Documentation](https://e2b.dev/docs)
- [Daytona Documentation](https://www.daytona.io/docs)
- [Modal Sandbox Guide](https://modal.com/docs/guide/sandbox)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape)

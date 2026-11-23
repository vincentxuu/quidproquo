---
title: "自架沙箱：Kata Containers、Kubernetes agent-sandbox、BYOC"
date: 2026-08-30
category: tech
type: deep-dive
tags: [sandbox, self-hosted, kata, kubernetes, byoc, agent-sandbox, open-source]
lang: zh-TW
tldr: "沙箱系列的自架篇（order 17）。Kata Containers、Kubernetes-sigs/agent-sandbox 與 BYOC 模式的企業自建沙箱選型、架構與遷移策略，以及自建 vs 託管的決策框架。"
description: "自架沙箱深入介紹：Kata Containers、Kubernetes agent-sandbox、BYOC 模式、架構選型、自建 vs 託管決策、遷移策略。"
series:
  name: "沙箱系列"
  order: 17
draft: false
---

> :globe: [English version](/posts/tech/2026-08-30-self-hosted-sandbox-en)

## 本文定位

這篇是沙箱系列的「自架篇」（order 17）。它不比較單一託管供應商（在 order 7–16），而是聚焦 **企業自建沙箱**：

1. **Kata Containers** —— 符合 OCI 標準的輕量虛擬機容器
2. **Kubernetes-sigs/agent-sandbox** —— Kubernetes 原生沙箱控制器
3. **BYOC（Bring Your Own Cloud）** —— 在自有雲端部署沙箱控制平面
4. **自建 vs 託管決策框架** —— 什麼情況下該自建，什麼情況下該用託管
5. **遷移策略** —— 從託管沙箱遷移到自建，或反之

---

## Kata Containers

### 什麼是 Kata Containers

Kata Containers 是符合 OCI (Open Container Initiative) 標準的輕量虛擬機容器。每個 Pod 即一台微型虛擬機，每個工作負載擁有自己的精簡核心，彼此不共享核心。

### 架構

```
┌─────────────────────────────────────┐
│           Kubernetes                 │
│  - Kata RuntimeClass                  │
│  - Pod 調度                           │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│          Kata Runtime                 │
│  - 每個 Pod 一台微型 VM                 │
│  - 獨立核心                           │
└─────────────────────────────────────┘
```

### 與 Docker / containerd 的整合

Kata Containers 可作為 containerd 的 RuntimeClass 接入 Kubernetes：

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kata
handler: kata
---
apiVersion: v1
kind: Pod
metadata:
  name: untrusted-agent
spec:
  runtimeClassName: kata
  containers:
  - name: agent
    image: agent-image:latest
```

### 優缺點

| 優點 | 缺點 |
|------|------|
| 硬體級隔離（每個 Pod 一台 VM） | 啟動較慢（約 200ms） |
| 與 Kubernetes 原生整合 | 記憶體開較高 |
| 符合 OCI 標準 | 需要 KVM 支援 |
| GPU 直通 | 維運複雜度高 |

---

## Kubernetes agent-sandbox

### 什麼是 agent-sandbox

`kubernetes-sigs/agent-sandbox` 是 Kubernetes SIG Apps 底下的專案，提供 `Sandbox` CRD 與 controller，專門管理有穩定身分、可持久儲存的單一 Pod，AI agent 執行環境是主要用途。它只做編排，隔離交給 gVisor、Kata 這類 RuntimeClass。v1.0.0 於 2026-08-28 發布，目前在 v1.0.x。

### 核心功能

#### 1. 生命週期管理

agent-sandbox 控制器處理沙箱的完整生命週期：建立、排程刪除、暫停與恢復。API 是 `agents.x-k8s.io/v1beta1`，隔離後端寫在 `podTemplate` 的 `runtimeClassName`；extensions 另提供 `SandboxTemplate`、`SandboxClaim` 與預熱用的 `SandboxWarmPool`。

```yaml
apiVersion: agents.x-k8s.io/v1beta1
kind: Sandbox
metadata:
  name: agent-sandbox-01
spec:
  podTemplate:
    spec:
      runtimeClassName: kata
      containers:
      - name: agent
        image: agent-image:latest
```

#### 2. 隔離後端可插拔

支援標準容器、gVisor、Kata Containers、及其他 OCI 相容執行環境。

#### 3. Python 與 Go SDK

Go SDK 是 `sigs.k8s.io/agent-sandbox/clients/go/sandbox`，Python SDK 是 `pip install k8s-agent-sandbox`；選用的 Sandbox Router 讓 SDK 在 Kata、gVisor 這類無法直接 port-forward 的環境連到沙箱。

### Guest Agent

agent-sandbox 正在開發「內沙箱代理程式（Guest Agent）」——一個輕量級 daemon，在每個沙箱 Pod 內運行，提供生命週期鉤子（freeze、fsfreeze、collapse、init），確保快照狀態一致性並優化恢復延遲。

---

## BYOC（Bring Your Own Cloud）模式

### 什麼是 BYOC

BYOC 是指企業在自有雲端（AWS、GCP、Azure 或自建機房）部署沙箱控制平面，而非使用託管供應商的雲端服務。

### 為什麼選 BYOC

| 原因 | 說明 |
|------|------|
| 資料主權 | 資料必須留在特定地區或自有基礎設施 |
| 合規要求 | 金融/醫療等受管行業的嚴格合規 |
| 已有基礎設施 | 企業已有 Kubernetes 叢集，不想額外付費 |
| 網路控制 | 需要完全控制網路策略與防火牆 |

### 實作方式

1. **OpenSandbox 自架**：阿里巴巴開源、現屬 AAIF 的 OpenSandbox 可部署在自己的 Docker 或 Kubernetes 上，隔離可選 gVisor、Kata 或 Firecracker
2. **Kata + Kubernetes 自建**：使用 Kata Containers + Kubernetes agent-sandbox 自建
3. **E2B BYOC 與 E2B Embed**：E2B 的 BYOC 是由 E2B 在你的 AWS、GCP 或 Azure 帳號裡代管（限 Enterprise）；E2B Embed 才是自己維運的自架版本

---

## 自建 vs 託管決策框架

| 決策因素 | 選託管沙箱 | 選自建沙箱 |
|----------|------------|------------|
| 執行規模 | 每月少於 1 萬次 | 每月超過 100 萬次 |
| 工程團隊 | 沒有專職基礎設施團隊 | 有平台工程團隊 |
| 合規要求 | 一般合規要求 | 金融/醫療等嚴格合規 |
| 資料主權 | 可以資料出國 | 資料必須留在境內 |
| 快速上市 | 需要立即上市 | 可以花數月自建 |
| 成本敏感度 | 願意為便利支付溢價 | 希望長期降低單位成本 |

### 總擁有成本（TCO）比較

| 成本項目 | 託管沙箱 | 自建沙箱 |
|----------|----------|----------|
| 計算資源 | 按使用量付費 | 自有基礎設施攤銷 |
| 工程人力 | 最少 | 需要專職團隊 |
| 維運開支 | 供應商負責 | 自行負責 |
| 升級與維護 | 供應商負責 | 自行負責 |
| 合規證照 | 供應商提供 | 自行取得 |

**經驗法則**：每月沙箱執行次數少於 1 萬次，託管沙箱 TCO 通常更低；每月超過 100 萬次，自建可能更經濟，但需要專職團隊維護。

---

## 遷移策略

### 從託管遷移到自建

1. **抽象沙箱介面**：在應用層建立抽象介面，將具體供應商 SDK 包裝起來
2. **標準化鏡像**：使用 OCI 容器鏡像，方便在不同環境間遷移
3. **外部儲存狀態**：將沙箱狀態儲存在外部儲存服務，而非沙箱內部
4. **逐步遷移**：先將非關鍵工作負載遷移，驗證後再遷移關鍵 workload

### 從自建遷移到託管

1. **評估託管供應商**：比較 E2B、Daytona、Modal、Bedrock AgentCore 等
2. **匯出鏡像與狀態**：將自建沙箱的鏡像與狀態匯出
3. **測試與驗證**：在託管環境中測試 agent 工作流
4. **切換流量**：逐步將流量切換到託管沙箱

---

## 讀完本文你應該理解

1. Kata Containers 的架構與 Kubernetes 整合方式。
2. Kubernetes agent-sandbox 的核心功能與 Guest Agent 的作用。
3. BYOC 模式的定義與適用情境。
4. 自建 vs 託管的決策框架與 TCO 比較。
5. 遷移策略：從託管到自建，或從自建到託管。

---

## 更新紀錄

- 2026-11-23：agent-sandbox 補 v1.0（2026-08-28）與 extensions，YAML 改為官方的 `agents.x-k8s.io/v1beta1` 與 `podTemplate` 寫法，補 Go／Python SDK 名稱；OpenSandbox 改為開源自架（現屬 AAIF）；E2B 分清 BYOC（Enterprise 代管）與 E2B Embed（自架）。

## 參考資料

- [Kata Containers Documentation](https://katacontainers.io/)
- [Kubernetes-sigs/agent-sandbox](https://agent-sandbox.sigs.k8s.io/docs)
- [OpenSandbox GitHub](https://github.com/opensandbox-group/OpenSandbox)
- [E2B BYOC（含與 E2B Embed 的差異）](https://docs.e2b.dev/byoc)
- [kubernetes-sigs/agent-sandbox GitHub](https://github.com/kubernetes-sigs/agent-sandbox)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape)
- [本站：沙箱成本模型（order 26）](/posts/tech/2026-08-30-sandbox-cost-model)

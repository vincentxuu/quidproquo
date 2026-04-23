---
title: "OpenClaw 威脅模型：MITRE ATLAS 安全分析與形式驗證"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, security, mitre-atlas, threat-model, formal-verification, tla-plus]
lang: zh-TW
tldr: "OpenClaw 用 MITRE ATLAS 框架分析 AI 系統威脅，有三個 Critical 風險（prompt injection、惡意 skill、憑證竊取），並用 TLA+ 形式驗證安全屬性。"
description: "OpenClaw 的 MITRE ATLAS 威脅模型分析、三大攻擊鏈、TLA+ 形式驗證模型、以及安全聲明的機器檢查。"
draft: false
---

開源 AI 平台暴露的攻擊面跟傳統 web app 不一樣。OpenClaw 用 MITRE ATLAS 框架做了完整的威脅模型，並用 TLA+ 形式驗證關鍵安全屬性。

## MITRE ATLAS 威脅模型

OpenClaw 的威脅模型基於 MITRE ATLAS（Adversarial Threat Landscape for AI Systems），專門為 AI/ML 系統設計的威脅框架。

### 涵蓋範圍

| 範圍 | 內容 |
|---|---|
| Agent Runtime | Gateway 基礎設施 |
| Channel 整合 | WhatsApp、Telegram、Discord、Signal、Slack |
| ClawHub | Skill 市場 |
| MCP Server | 外部工具整合 |
| 使用者裝置 | Node 連線 |

### 三個 Critical 風險

**1. Direct Prompt Injection（T-EXEC-001）**

攻擊者透過精心構造的 prompt 操控 agent 行為。目前的緩解依賴 pattern detection，不是完美防禦。

**2. 惡意 Skill 安裝（T-PERSIST-001）**

攻擊者在 ClawHub 發布惡意 skill。審核機制依賴 pattern matching，容易被繞過。

**3. Skill 憑證竊取（T-EXFIL-003）**

惡意 skill 從 agent context 竊取憑證。Skill 執行時擁有完整的 agent 權限。

### 三條主要攻擊鏈

| 攻擊鏈 | 路徑 |
|---|---|
| Skill 供應鏈 | Skill 發布 → 審核繞過 → 憑證竊取 |
| Prompt Injection | 注入 → Approval 繞過 → 任意指令執行 |
| URL 投毒 | 惡意 URL 內容 → Agent 遵從指令 → 資料外洩 |

### 優先建議

文件建議的立即行動：
- 完成 VirusTotal 整合
- 實作 skill 沙箱
- 加入敏感操作的輸出驗證
- 強化從偵測導向轉為預防導向

## TLA+ 形式驗證

OpenClaw 用 TLA+（Temporal Logic of Actions）做形式化安全模型的機器檢查。

### 目標

提供機器驗證的論證：OpenClaw 在明確假設下，確實執行其預定的安全策略（授權、session 隔離、工具管控、錯誤配置安全）。

### 重要限制

- 這是**模型**，不是完整 TypeScript 實作——模型和程式碼之間可能有偏差
- 結果受 TLC 探索的狀態空間限制——「綠色」不代表超出模型範圍的安全保證
- 部分聲明依賴明確的環境假設（正確部署、正確設定）

### 安全聲明與模型

每個聲明都有**正向模型**（證明屬性成立）和**負向模型**（產生反例追蹤，展示真實 bug 類型）。

#### Gateway 暴露

**聲明：** 綁定超出 loopback 且沒有 auth，會增加遠端危害的可能性；token/password 能阻擋未授權攻擊者。

```bash
make gateway-exposure-v2           # 正向
make gateway-exposure-v2-protected # 正向（有保護）
make gateway-exposure-v2-negative  # 負向（預期失敗）
```

#### Nodes.run Pipeline（最高風險能力）

**聲明：** `nodes.run` 需要 (a) node command allowlist + 宣告的 commands 和 (b) 啟用時的即時 approval；approval 有 token 化防止重放。

```bash
make nodes-pipeline              # 正向
make approvals-token             # 正向
make nodes-pipeline-negative     # 負向
make approvals-token-negative    # 負向
```

#### Pairing Store（DM 管控）

**聲明：** Pairing request 遵守 TTL 和 pending request 上限。

```bash
make pairing                     # 正向
make pairing-cap                 # 正向
make pairing-negative            # 負向
make pairing-cap-negative        # 負向
```

#### Ingress Gating（Mention + 控制指令繞過）

**聲明：** 在需要 mention 的群組 context 中，未授權的控制指令無法繞過 mention gating。

```bash
make ingress-gating              # 正向
make ingress-gating-negative     # 負向
```

#### Routing / Session Key 隔離

**聲明：** 不同 peer 的 DM 不會被合併到同一個 session，除非明確設定。

```bash
make routing-isolation           # 正向
make routing-isolation-negative  # 負向
```

### 進階模型（併發、重試、追蹤）

第二批模型處理真實世界的失敗模式：

**Pairing Store 併發 / 冪等：**
- 併發 request 下不能超過 `MaxPending`
- 重複 request/refresh 不會產生重複的 pending 記錄
- check-then-write 必須是原子/鎖定的

**Ingress 追蹤關聯 / 冪等：**
- Fan-out 時保持 trace/event 身份
- 重試不會導致重複處理
- 缺少 provider event ID 時，降級到安全的 dedupe key

**Routing dmScope 優先順序 + Identity Links：**
- Channel-specific dmScope override 必須勝過全域預設
- Identity links 只在明確連結的群組內合併 session

### 執行環境

```bash
git clone https://github.com/vignesh07/openclaw-formal-models
cd openclaw-formal-models
# Java 11+ required（TLC 跑在 JVM 上）
make <target>
```

模型庫包含 pinned 的 `tla2tools.jar` 和 `bin/tlc` + Make target。

## 安全審計工具

```bash
openclaw security audit
```

這會檢查常見的安全配置問題，包含 trusted-proxy auth 設定、缺少的 trustedProxies、空的 allowUsers 等。

## 整體來說

OpenClaw 的安全方法有兩個面向：

1. **威脅模型**（MITRE ATLAS）——識別攻擊面、評估風險等級、規劃緩解措施
2. **形式驗證**（TLA+）——機器檢查安全屬性是否在模型範圍內成立

目前的防禦偏重偵測而非預防，這是已知的差距。但有形式驗證的安全回歸套件，至少確保核心機制（pairing、routing 隔離、ingress gating）的行為符合預期。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/security/THREAT-MODEL-ATLAS.md](https://github.com/openclaw/openclaw/blob/main/docs/security/THREAT-MODEL-ATLAS.md) — MITRE ATLAS 威脅模型
- [docs/security/formal-verification.md](https://github.com/openclaw/openclaw/blob/main/docs/security/formal-verification.md) — TLA+ 形式驗證
- [docs/security/CONTRIBUTING-THREAT-MODEL.md](https://github.com/openclaw/openclaw/blob/main/docs/security/CONTRIBUTING-THREAT-MODEL.md) — 威脅模型貢獻指南
- [docs/gateway/security.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/security.md) — Gateway 安全

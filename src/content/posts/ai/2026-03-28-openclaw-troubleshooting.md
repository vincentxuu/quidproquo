---
title: "OpenClaw 維運篇：疑難排解與診斷"
date: 2026-03-28
type: debug
category: ai
tags: [openclaw, troubleshooting, doctor, diagnostics, operations]
lang: zh-TW
tldr: "openclaw doctor 是一站式診斷工具，openclaw sandbox explain 排查沙箱問題，openclaw channels status --probe 檢查頻道連線。"
description: "OpenClaw 的維運指南：診斷工具、常見問題排解、健康檢查、以及日誌分析。"
draft: false
---

系統跑起來後總會遇到問題。這篇整理 OpenClaw 的診斷工具和常見問題解法。

## 一站式診斷：openclaw doctor

```bash
openclaw doctor                  # 完整診斷
openclaw doctor --fix            # 嘗試自動修復
openclaw doctor --json           # JSON 輸出
```

`doctor` 檢查：
- 設定檔 schema 驗證
- 模型認證狀態
- 頻道連線
- 沙箱設定
- Plugin 狀態
- 權限和路徑

## 常見問題

### 模型認證

| 症狀 | 排查 |
|---|---|
| No credentials found | 跑 `openclaw models status`，確認 API key 或 token |
| Token expired | `openclaw models status` 查看哪個 profile 過期 |
| Rate limited | 檢查 API key 輪替設定 |

```bash
openclaw models status           # 查看認證狀態
openclaw models status --check   # 自動化（exit 1 = 過期）
openclaw models status --probe   # 主動探測
```

### 頻道連線

```bash
openclaw channels status         # 列出頻道狀態
openclaw channels status --probe # 主動探測連線
```

| 症狀 | 排查 |
|---|---|
| 訊息收不到 | 檢查 policy → allowlist → mention → user restrictions |
| DM 問題 | `dm.enabled` → policy → pairing approvals |
| 群組問題 | group policy → sender allowlist → mention gating |

### 沙箱

```bash
openclaw sandbox explain         # 查看有效設定
openclaw sandbox explain --agent work
openclaw sandbox explain --json
```

| 症狀 | 排查 |
|---|---|
| Tool blocked | 檢查 `tools.sandbox.tools.deny` |
| 不該被沙箱 | 檢查 `sandbox.mode`（`non-main` 下群組/頻道都算非 main） |
| setupCommand 失敗 | 檢查網路（預設 none）、readOnlyRoot、user 權限 |

### Session

```bash
openclaw sessions list           # 列出 session
openclaw sessions cleanup --dry-run  # 預覽清理
```

| 症狀 | 排查 |
|---|---|
| 對話混在一起 | 檢查 `session.dmScope`（多人 DM 不要用 `main`） |
| Context 太長 | 手動 `/compact` 或調整 compaction 設定 |
| Memory 遺失 | 檢查 memory flush 設定 |

### Gateway 網路

```bash
openclaw health                  # 檢查 Gateway 健康
openclaw gateway status          # Gateway 狀態
```

| 症狀 | 排查 |
|---|---|
| 連不到 Gateway | 檢查 `gateway.bind` 和 port |
| WebSocket 斷線 | 檢查 reverse proxy 的 WS 支援 |
| Trusted proxy 失敗 | 檢查 trustedProxies IP |

## 安全審計

```bash
openclaw security audit          # 安全配置檢查
```

檢查：
- Trusted proxy auth 配置
- 缺少 trustedProxies
- 空的 allowUsers
- 不安全的 safeBins（直譯器/runtime）
- 缺少的 safeBinProfiles

## 日誌

OpenClaw 的日誌輸出包含結構化的診斷碼（如 `SECRETS_REF_IGNORED_INACTIVE_SURFACE`、`SECRETS_GATEWAY_AUTH_SURFACE`），可以用來追蹤特定行為。

## 維護排程

```json5
{
  session: {
    maintenance: {
      mode: "enforce",         // warn | enforce
      pruneAfterDays: 30,
      maxEntries: 500,
      rotationThresholdMb: 10
    }
  }
}
```

正式環境建議 `enforce` 模式自動清理。

## 有用的指令速查

| 指令 | 功能 |
|---|---|
| `openclaw doctor` | 全面診斷 |
| `openclaw doctor --fix` | 自動修復 |
| `openclaw health` | Gateway 健康 |
| `openclaw models status` | 模型認證 |
| `openclaw channels status --probe` | 頻道探測 |
| `openclaw sandbox explain` | 沙箱設定 |
| `openclaw security audit` | 安全審計 |
| `openclaw sessions cleanup --dry-run` | 預覽清理 |
| `openclaw config validate` | 設定驗證 |
| `/context detail` | Context 大小明細 |
| `/tools verbose` | 可用工具詳細 |

## 整體來說

OpenClaw 的維運工具很完整——`doctor` 一站式診斷、`sandbox explain` 查沙箱、`channels status --probe` 查連線、`security audit` 查安全。遇到問題時，先跑 `doctor`，再根據症狀深入排查。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/troubleshooting/index.md](https://github.com/openclaw/openclaw/blob/main/docs/troubleshooting/index.md) — 疑難排解總覽
- [docs/troubleshooting/common-issues.md](https://github.com/openclaw/openclaw/blob/main/docs/troubleshooting/common-issues.md) — 常見問題
- [docs/channels/troubleshooting.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/troubleshooting.md) — 頻道疑難排解
- [docs/automation/troubleshooting.md](https://github.com/openclaw/openclaw/blob/main/docs/automation/troubleshooting.md) — 自動化疑難排解
- [docs/nodes/troubleshooting.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/troubleshooting.md) — Nodes 疑難排解
- [docs/gateway/security.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/security.md) — Gateway 安全

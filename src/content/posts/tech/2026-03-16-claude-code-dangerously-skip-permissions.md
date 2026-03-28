---
title: "Claude Code Permission Modes 全解析：從預設到 Auto Mode 的五種權限模式"
date: 2026-03-16
category: tech
tags: [claude-code, ai-tools, automation, cli, permissions, auto-mode, security]
lang: zh-TW
tldr: "Claude Code 有五種權限模式：default（逐步確認）、acceptEdits（自動接受編輯）、plan（唯讀規劃）、auto（AI classifier 背景審查）、bypassPermissions（YOLO 全跳過）。用 Shift+Tab 切換，搭配 settings.json 精細控制。auto mode 是最佳平衡點——既不用每步確認，又有安全防護。"
description: "完整介紹 Claude Code 的五種權限模式：default、acceptEdits、plan、auto、bypassPermissions（YOLO）和 dontAsk，包含每種模式的運作原理、適用場景、設定方式，以及 auto mode 的 classifier 機制和自訂規則。"
draft: false
series:
  name: "Claude Code 自動化指南"
  order: 1
---

## TL;DR

Claude Code 有五種權限模式，從最安全到最自由：`plan`（唯讀）→ `default`（逐步確認）→ `acceptEdits`（自動接受編輯）→ `auto`（AI classifier 審查）→ `bypassPermissions`（YOLO 全跳過）。大多數場景用 **auto mode** 就夠了——它用背景 classifier 自動判斷安全性，遇到危險操作才阻擋。

---

## 五種模式一覽

| 模式 | Claude 可以不問你就做什麼 | 適合場景 |
|------|--------------------------|---------|
| `default` | 讀檔案 | 初次使用、敏感操作 |
| `acceptEdits` | 讀寫檔案 | 快速迭代開發 |
| `plan` | 讀檔案（不能改） | 探索 codebase、規劃重構 |
| `auto` | 所有操作（有背景安全檢查） | 長時間任務、減少 prompt 疲勞 |
| `bypassPermissions` | 所有操作（無任何檢查） | Docker / VM 隔離環境限定 |
| `dontAsk` | 只有預先批准的工具 | 鎖定環境、CI pipeline |

## 切換方式

### 在 session 中切換

CLI 裡按 **Shift+Tab** 循環切換：`default` → `acceptEdits` → `plan` → `auto`。

VS Code 和 Desktop 直接點擊輸入框旁的模式選擇器。

### 啟動時指定

```bash
claude --permission-mode plan
claude --permission-mode auto --enable-auto-mode
```

### 設為預設

```json
// .claude/settings.json
{
  "permissions": {
    "defaultMode": "acceptEdits"
  }
}
```

---

## Plan Mode：先規劃再動手

Plan mode 讓 Claude 只讀不寫——分析 codebase、提出方案，但不改你的 source code。

### 使用方式

```bash
# 整個 session 進入 plan mode
claude --permission-mode plan

# 或單次請求加 /plan 前綴
/plan 重構 authentication 模組，給我遷移計畫
```

### 規劃完成後

Claude 提出計畫後會問你怎麼做：
- **Approve and start in auto mode** — 直接讓 Claude 用 auto mode 執行
- **Approve and accept edits** — 自動接受編輯，手動確認指令
- **Approve and manually review** — 每步都確認
- **Keep planning** — 繼續修改計畫

適合多步驟實作前先看清全貌：

```
我要把認證系統從 JWT 換成 OAuth2。
先分析現有實作，給我完整的遷移計畫。
```

---

## Auto Mode：最佳平衡點

Auto mode 是 `bypassPermissions`（YOLO）的安全替代方案。它用一個獨立的 **classifier 模型**在背景審查每個操作，判斷是否安全。

> 目前需要 Team plan + Claude Sonnet 4.6 或 Opus 4.6。Admin 需在 claude.ai 管理設定中啟用。

### 運作原理

每個操作依照固定順序判斷：

1. 你的 allow/deny 規則 → 直接通過或阻擋
2. 唯讀操作和工作目錄內的檔案編輯 → 自動通過
3. 其他全部 → 送給 classifier 判斷
4. Classifier 阻擋 → Claude 收到原因，嘗試替代方案

### Classifier 預設阻擋什麼

**會阻擋**：
- 下載並執行程式碼（`curl | bash`）
- 發送敏感資料到外部
- 生產環境部署和 migration
- 雲端儲存的大量刪除
- 授予 IAM / repo 權限
- 修改共享基礎設施
- Force push、直接 push 到 main

**會放行**：
- 工作目錄內的檔案操作
- 安裝 lock file 中已宣告的依賴
- 讀取 `.env` 並發送 credentials 到對應 API
- 唯讀 HTTP 請求
- Push 到你的工作分支

### 自訂 Classifier 規則

如果 classifier 阻擋了你團隊的正常操作（push 到自家 org 的 repo、寫入公司 bucket），在 managed settings 中加入 `autoMode.environment` 告訴 classifier 這些是可信的。

### Fallback 機制

Classifier 連續阻擋 3 次或累計阻擋 20 次 → auto mode 暫停，恢復手動確認。你確認後重置計數器，繼續用 auto mode。

### 對子代理的處理

- 子代理啟動前：classifier 審查任務描述
- 子代理執行中：同樣的 block/allow 規則
- 子代理完成後：classifier 複查整個操作歷史

---

## bypassPermissions（YOLO Mode）

`--dangerously-skip-permissions` 等同於 `--permission-mode bypassPermissions`：

```bash
claude --dangerously-skip-permissions "Fix all lint errors"
claude --permission-mode bypassPermissions "Fix all lint errors"
```

### 繞過什麼

- 所有權限提示
- 指令黑名單（`curl`、`wget` 等解禁）
- 寫入限制（不限於工作目錄）
- MCP server 信任驗證
- 子代理繼承完整權限，無法覆蓋

### 真實事故

有人請 Claude 清理專案中多餘的套件，結果執行了 `rm -rf tests/ patches/ plan/ ~/`——結尾的 `~/` 把整個 home 目錄刪了。eesel AI 研究顯示，32% 使用 YOLO 模式的開發者遇過非預期的檔案修改，9% 發生過資料遺失。

### 三種安全等級

#### 等級一：git checkpoint

```bash
git add -A && git commit -m "Checkpoint pre-Claude"
claude --dangerously-skip-permissions "Refactor all API handlers"
# 出問題時
git reset --hard HEAD
```

#### 等級二：限制危險工具

```bash
claude --dangerously-skip-permissions \
  --disallowedTools "Bash(rm:*),Bash(curl:*),Bash(wget:*)" \
  "Refactor all API handlers"
```

#### 等級三：Docker 隔離（最安全）

```bash
docker run --rm \
  --network none \
  -v $(pwd):/workspace \
  my-dev-container \
  claude --dangerously-skip-permissions "Fix all lint errors"
```

### YOLO vs Auto Mode

| | Auto Mode | YOLO Mode |
|---|---|---|
| 安全檢查 | Classifier 背景審查 | 無 |
| Prompt injection 防護 | 有（classifier 獨立於主對話）| 無 |
| Token 消耗 | 較高（classifier 呼叫）| 標準 |
| 需要 | Team plan + Sonnet/Opus 4.6 | 任何 plan |
| 子代理控制 | 有（spawn 前/後都審查）| 無 |

**結論：能用 auto mode 就別用 YOLO。** 真的需要 YOLO，跑在 Docker 裡。

---

## dontAsk Mode：只允許白名單

`dontAsk` 自動拒絕所有未明確允許的工具。適合 CI pipeline 或限制環境：

```bash
claude --permission-mode dontAsk
```

搭配 settings.json 精確控制：

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Write(src/**)",
      "Bash(npm test)",
      "Bash(npm run lint)"
    ]
  }
}
```

---

## 搭配 settings.json 精細控制

不管用哪種模式，都可以用 `permissions` 設定疊加精細規則：

```json
{
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Read",
      "Write(src/**)",
      "Bash(git *)",
      "Bash(npm *)",
      "Bash(tsc:*)"
    ],
    "deny": [
      "Read(.env*)",
      "Write(production.config.*)",
      "Bash(rm *)",
      "Bash(sudo *)"
    ]
  }
}
```

這份設定可以 commit 進 repo，讓團隊共用安全基準。個人設定用 `.claude/settings.local.json` 覆蓋。

---

## 模式比較總表

| | default | acceptEdits | auto | dontAsk | bypassPermissions |
|---|---|---|---|---|---|
| 權限提示 | 編輯+指令 | 只有指令 | 無（除非 fallback） | 無（未允許的直接拒絕）| 無 |
| 安全檢查 | 你自己審查 | 你審查指令 | Classifier 審查 | 你的白名單規則 | 無 |
| Token 消耗 | 標準 | 標準 | 較高 | 標準 | 標準 |

---

## 參考資料

- [Claude Code - Permission modes](https://code.claude.com/docs/en/permission-modes)
- [Claude Code - Permissions](https://code.claude.com/docs/en/permissions)
- [Auto Mode Announcement](https://claude.com/blog/auto-mode)
- [claude --dangerously-skip-permissions - PromptLayer](https://blog.promptlayer.com/claude-dangerously-skip-permissions/)
- [YOLO Mode Hidden Risks | UpGuard](https://www.upguard.com/blog/yolo-mode-hidden-risks-in-claude-code-permissions/)

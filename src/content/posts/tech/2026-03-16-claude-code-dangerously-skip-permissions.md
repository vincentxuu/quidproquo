---
title: "Claude Code --dangerously-skip-permissions：YOLO 模式完整指南"
date: 2026-03-16
category: tech
tags: [claude-code, ai-tools, automation, cli]
lang: zh-TW
tldr: "--dangerously-skip-permissions 讓 Claude Code 跳過所有權限提示全速執行，適合自動化大型任務，但要搭配 git checkpoint 和 Docker 才安全。"
description: "介紹 Claude Code 的 --dangerously-skip-permissions flag，包含使用場景、設定方式、真實風險案例與安全使用方式。"
draft: false
---

## TL;DR

`--dangerously-skip-permissions` 讓 Claude Code 進入全自動執行模式，跳過所有權限提示。適合跑大型自動化任務，但繞過了所有安全機制。使用前務必建立 git checkpoint，最好跑在 Docker 裡。

---

`--dangerously-skip-permissions` 開啟的是 Anthropic 所稱的「Safe YOLO mode」——完全無人值守的執行模式，讓 Claude Code 跳過所有確認提示，一路跑到完成。

它在技術上等同於 `--permission-mode bypassPermissions`，兩者行為完全相同：

```bash
claude --dangerously-skip-permissions "Fix all lint errors"
claude --permission-mode bypassPermissions "Fix all lint errors"
```

## 為什麼需要它

Claude Code 預設每個命令都需要你授權。安全沒錯，但這在自動化長任務時很痛苦——你設好任務去倒杯咖啡，回來發現它在第二步卡住了，因為需要你確認執行 `mkdir`。

適合用的情境：

- 修復整個專案的 lint 錯誤
- 大規模多檔案重構
- 自動產生測試套件
- CI/CD pipeline 中的無人值守任務
- 程式碼審計、效能分析等批次處理任務

## 風險（認真的）

這個 flag 會繞過整個安全機制：

- **指令黑名單**：通常封鎖的 `curl`、`wget` 等全部解禁
- **寫入限制**：原本限於當前工作目錄的限制消失
- **所有權限提示**：不再詢問
- **MCP server 信任驗證**：跳過

更要注意的是**子代理繼承問題**：開啟 bypass 模式後，所有子代理都繼承完整自主存取權限，無法覆蓋。

**真實事故**：有人請 Claude 清理專案中多餘的套件，結果 Claude 執行了 `rm -rf tests/ patches/ plan/ ~/`——那個結尾的 `~/` 把整個 home 目錄都刪了。eesel AI 的研究顯示，32% 使用 YOLO 模式的開發者遇到過非預期的檔案修改，9% 發生過資料遺失。

## 三種安全等級的用法

### 等級一：最基本保護（git checkpoint）

```bash
# 執行前先建立還原點
git add -A && git commit -m "Checkpoint pre-Claude"

# 執行任務
claude --dangerously-skip-permissions "Refactor all API handlers"

# 出問題時
git reset --hard HEAD
```

### 等級二：限制危險工具（--disallowedTools）

用 `--disallowedTools` 明確封鎖高危操作。注意：`--allowedTools` 在 bypass 模式下有已知 bug 可能被忽略，但 `--disallowedTools` 可正常運作。

```bash
claude --dangerously-skip-permissions \
  --disallowedTools "Bash(rm:*),Bash(curl:*),Bash(wget:*)" \
  "Refactor all API handlers"
```

### 等級三：Docker 隔離（最安全）

```bash
docker run --rm \
  --network none \
  -v $(pwd):/workspace \
  my-dev-container \
  claude --dangerously-skip-permissions "Fix all lint errors"
```

`--network none` 斷掉網路，即使 Claude 嘗試外連也無法成功。

## 比 YOLO 更好的替代方案：settings.json

與其用 `--dangerously-skip-permissions` 開全自動，不如在 `.claude/settings.json` 設定精細的白名單：

```json
{
  "permissions": {
    "allowedTools": [
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

這份設定可以 commit 進 repo，讓整個團隊共用相同的安全基準。個人設定用 `.claude/settings.local.json` 覆蓋即可。

## 搭配 loop 模式的完整 pipeline

`--dangerously-skip-permissions` 解決「每步都要確認」的問題，搭配 shell loop 就能批次處理大量任務：

```bash
# Phase 1: 有監督的規劃
claude "/architect"

# Phase 2: 無人值守的自動實作
claude --dangerously-skip-permissions "/dev story-1"
claude --dangerously-skip-permissions "/dev story-2"
```

用 `-p` headless 模式跑迴圈，`--max-turns` 防止失控：

```bash
for file in $(cat files.txt); do
  claude --dangerously-skip-permissions \
    -p "Fix TypeScript errors in $file. Return OK or FAIL." \
    --allowedTools "Read,Edit,Bash(tsc:*)" \
    --max-turns 10
done
```

CI/CD 任務建議 `--max-turns` 限制在 10 以內。

## 設個 alias 提醒自己

```bash
# ~/.zshrc 或 ~/.bashrc
alias clauded="claude --dangerously-skip-permissions"
```

## 整體來說

YOLO 模式是真正的自動化加速器，但它的設計前提是你信任要執行的任務範圍。使用原則很簡單：

1. **永遠先做 git checkpoint**
2. **能用 settings.json 就別用 YOLO**
3. **真的要用，跑在 Docker 裡**

沒有這些保護的話，一個寫錯的 prompt 就能讓 Claude 把你的 home 目錄刪光。

---

Sources:
- [claude --dangerously-skip-permissions - PromptLayer](https://blog.promptlayer.com/claude-dangerously-skip-permissions/)
- [Dangerous Skip Permissions | ClaudeLog](https://claudelog.com/mechanics/dangerous-skip-permissions/)
- [YOLO Mode Hidden Risks | UpGuard](https://www.upguard.com/blog/yolo-mode-hidden-risks-in-claude-code-permissions/)
- [Claude Code --dangerously-skip-permissions: Safe Usage Guide | ksred](https://www.ksred.com/claude-code-dangerously-skip-permissions-when-to-use-it-and-when-you-absolutely-shouldnt/)
- [Claude Code YOLO mode safely | codeagentswarm](https://www.codeagentswarm.com/en/guides/claude-code-yolo-turbo-mode)

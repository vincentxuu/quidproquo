---
title: "AI-Native SDLC Playbook L11：Hooks 作為核准閘門"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, hooks, governance, security, enterprise]
lang: zh-TW
tldr: "Hooks 是 AI-native SDLC 的治理基石——確定性的閘門，在 agent 執行動作前攔截，不通過就擋下。這堂課從單一 production gate 腳本講到完整的企業級 managed settings，涵蓋權限鎖定、沙箱、憑證隔離、marketplace 白名單，是整門課最硬核的一堂。"
description: "Claude Academy AI-Native SDLC Playbook 第 11 堂課導讀：Hooks 如何從開發階段的護欄變成部署階段的核准閘門，以及受監管企業的完整 managed settings 設定解析。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 11
---

前面幾堂課介紹的 CLAUDE.md 和 Skills 都是「建議性」的——Claude「應該」遵守，但技術上可以不遵守。Hooks 不一樣。**Hooks 是確定性的**——它們在 agent 執行動作前後觸發 shell 命令，exit code 非零就擋下，沒有商量餘地。

這堂課是整門 AI-Native SDLC Playbook 裡最硬核的一堂，從一支簡單的 production gate 腳本，一路講到受監管企業的完整 managed settings 設定。

## 課程怎麼教

### Build 階段的護欄 vs Deploy 階段的閘門

課程做了一個重要的區分：

- **Build 階段的 hooks**（前面 L6 已經提過）：快速、自動化的護欄。擋掉對受保護路徑的編輯、寫入後跑 formatter/linter、防止憑證進入 diff。這些不需要人介入
- **Deploy 階段的 hooks**：暫停動作、等待指定人員核准。這才是這堂課的重點——release gating

依課程的說法：「A hook that asks a human for approval belongs with the gates in Stage 5: Deploy, because an approval prompt during the build puts a person back on the critical path of all the sessions running in parallel.」

這個觀點很務實——如果你在 build 階段就要求人工核准，那你的平行 session 全部會卡住等人。

### 基本的 Production Gate

課程提供了一個簡單但完整的範例：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/production-gate.sh" }
        ]
      }
    ]
  }
}
```

對應的 gate 腳本：

```bash
#!/bin/bash
cmd=$(jq -r '.tool_input.command' < /dev/stdin)
if [[ "$cmd" == *"deploy"* && "$cmd" == *"production"* ]]; then
  if [ -z "$RELEASE_APPROVAL" ]; then
    echo "Production deploys need a release authorization." >&2
    exit 2   # exit 2 blocks the action
  fi
fi
exit 0
```

`exit 2` 擋下動作，錯誤訊息會顯示在 Claude 的輸出裡，告訴它（和使用者）為什麼被擋、怎麼取得核准。

### 團隊 Hooks vs Managed Settings

Hooks 有兩個層級：

1. **團隊 hooks**：放在 `.claude/settings.json`，跟著 repo 走，團隊成員都能看到和修改
2. **Managed settings**：由平台或 IT 團隊管理，個別工程師無法停用

對於受監管的企業，managed settings 才是真正的防線。

### 企業級 Managed Settings 完整解析

這是整堂課最有價值的部分——課程提供了一份完整的 managed settings 範本，涵蓋七個控制維度：

**權限控制**：`permissions.deny` 阻止敏感檔案進入 agent context、封鎖不受控的網路存取；`permissions.allow` 預先核准安全操作，減少核准疲勞。`disableBypassPermissionsMode` 搭配 `allowManagedPermissionRulesOnly` 確保沒有工程師、專案檔案或命令列參數能擴大權限範圍。

**沙箱**：在作業系統層級補強權限控制。即使 tool 層級的 `WebFetch` 被封了，shell 命令理論上還是能存取網路——`sandbox` 的 domain allowlist 連這條路也封掉。`failIfUnavailable` 和 `allowUnsandboxedCommands` 讓沙箱變成強制的——沒有沙箱 Claude Code 拒絕啟動。

**憑證隔離**：`credentials` 段落封掉 `~/.ssh`、`~/.aws/credentials` 等路徑的讀取，並從沙箱環境中移除指定的環境變數。

**Hook 鎖定**：`allowManagedHooksOnly` 確保只有 managed settings 裡的 hooks 會執行，使用者、專案、local settings 裡的 hooks 全部失效。

**Plugin 來源管控**：`disableSideloadFlags` 和 `strictKnownMarketplaces` 讓 skills、agents、hooks、MCP servers 只能來自組織核准的 marketplace。

**MCP 白名單**：`allowManagedMcpServersOnly` 把 agent 的工具面控制在平台團隊管理的白名單裡。

**版本鎖定**：`requiredMinimumVersion` 阻止未經評估的 Claude Code 版本執行。

## 實戰對照

我們在一個中型專案裡用了兩層 hooks：

**PreToolUse hook**：依照檔案的 profile（前端/後端）攔截不符合規範的操作。例如前端程式碼不應該直接呼叫特定的 HTTP 工具函式、任何檔案不應該包含疑似憑證的字串。這些是 build 階段的護欄——自動執行、不需要人介入。

**Stop hook**：在 Claude 結束工作前，印出每個被修改檔案的檢查結果和 diff 行數摘要。這不是擋下動作，而是強制產出一份「變更清單」，讓工程師在繼續之前有一個結構化的 checkpoint。

我們踩過的坑：

- Hook 腳本的執行速度很重要——如果一個 PreToolUse hook 要跑 2 秒，而 Claude 每分鐘觸發 30 次，你的開發速度會被拖垮。Build 階段的 hook 應該控制在毫秒等級
- Hook 擋下動作時一定要告訴 Claude 為什麼被擋。如果只是 `exit 2` 沒有訊息，Claude 會不斷重試相同的動作

## 給讀者的起步建議

1. **從一個 hook 開始**：不要一次設定 20 個 hook。先加一個最重要的——通常是「擋掉對 production 的直接部署」或「擋掉憑證進入 diff」
2. **Build hooks 要快、Deploy hooks 可以等**：Build 階段的 hook 不要有人工核准的步驟；Deploy 階段的才需要
3. **錯誤訊息是 hook 設計的一部分**：當 hook 擋下動作時，訊息應該告訴 Claude（和工程師）為什麼被擋、怎麼取得核准
4. **如果你在受監管產業**：直接從 managed settings 開始，不要從 team hooks 慢慢加。managed settings 是不可繞過的，team hooks 可以

## 參考資料

- [Hooks as Approval Gates — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/hooks-as-approval-gates)
- [Claude Code Hooks Guide — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Claude Code Settings Reference — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/settings)
- [Claude Academy：AI-Native SDLC Playbook 課程導讀](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)

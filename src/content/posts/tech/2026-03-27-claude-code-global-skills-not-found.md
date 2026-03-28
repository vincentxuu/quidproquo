---
title: "Claude Code Global Skills 新 Session 找不到？釐清 Skill Discovery 機制與排查方法"
date: 2026-03-27
category: tech
tags: [claude-code, skills, ai-agent, dx, troubleshooting, settings]
lang: zh-TW
tldr: "Global skills 放在 ~/.claude/skills/ 但新 session 或 Desktop App 看不到？問題通常不是檔案不存在，而是 skill 描述沒被載入 context。本文釐清 CLI vs Desktop App 的差異、settings.json 的角色，以及最穩定的解法。"
description: "分析 Claude Code global skills 在新 session 或 Desktop App 中找不到的常見原因，釐清 skill discovery 機制、settings.json vs settings.local.json 的差異，並提供排查步驟與最佳實踐。"
draft: false
series:
  name: "Claude Code 自動化指南"
  order: 19
---

裝好 global skills，CLI 用 `/` 斜線命令明明看得到，但開新 session 或換到 Desktop App，問 Claude「你有哪些 skills？」卻只回系統預設。每次都要手動提醒「去家目錄找一下」才行。

這個問題不少人踩過。核心原因通常不是「檔案不存在」，而是 **skill 描述沒被正確載入 Claude 的 context window（單次對話能看到的資訊範圍）**。

## 先搞懂：Skill 是什麼

Skill 是一份寫給 Claude 看的 SOP，本質就是一個 markdown 檔案。你把工作流程的步驟寫進去，之後在對話裡打 `/skill-name`，Claude 就會載入這份文件、照著步驟執行。

例如你每次 commit 都要遵守特定格式，就可以寫一個 `format-commit` skill，之後打 `/format-commit` 就好。不用寫程式，不用學框架。

Skill 檔案放在 `.claude/skills/` 目錄下，分成兩種：

- **Global skills**：放在家目錄 `~/.claude/skills/`，所有專案都能用
- **Project skills**：放在專案目錄 `<project>/.claude/skills/`，只有該專案能用

搞懂這個區分，後面的問題就好理解了。

## Skill Discovery 怎麼運作

Claude Code 啟動時會從以下位置自動掃描 skills：

| 層級 | 路徑 | 作用範圍 |
|------|------|---------|
| **Global** | `~/.claude/skills/<name>/SKILL.md` | 所有專案 |
| **Project** | `<project>/.claude/skills/<name>/SKILL.md` | 該專案 |
| **Plugin** | `<plugin>/skills/<name>/SKILL.md` | 啟用該 plugin 的地方 |

掃描到的 skill **描述**（檔案開頭 `---` 區塊裡的 `description` 欄位）會被注入 context，讓 Claude 知道有哪些可用。完整內容只在用 `/skill-name` 呼叫時才載入。

重點：**skills 是靠檔案系統位置自動發現的**，不是在 `settings.json` 裡註冊的。`settings.json` 負責的是權限控制（例如 deny 某個 skill），不是 skill 註冊。

## 「`/` 看得到」和「Claude 知道」是兩件事

這是最常搞混的地方：

- **`/` 列表看得到** → Claude Code 介面有掃到這個檔案，純粹是檔案系統層面的事
- **Claude 回答「我有這個 skill」** → skill 描述有被送進 Claude 的對話 context 裡

兩者不一定同步。`/` 是檔案系統掃描的結果，Claude 的回答取決於它的 context 裡有沒有這個 skill 的描述。所以「`/` 看得到但 Claude 說沒有」是完全可能的——skill 描述可能因為超過容量上限而被截斷，或是根本沒被載入。

## 為什麼新 Session 或 Desktop App 會找不到

### 原因 1：Desktop App 的 home 路徑解析不同

Desktop App 是獨立的桌面應用程式，它找「家目錄」的方式可能和終端機不同。如果路徑不一致，就找不到 `~/.claude/skills/`。

**驗證方法：** 在 Desktop App 裡跑：

```bash
echo $HOME
ls ~/.claude/skills/
```

看路徑是否和 CLI 環境一致。

### 原因 2：Skill context budget 超限

Claude Code 預設只撥 context window 的 **2%** 給 skill 描述。白話說就是：Claude 一次對話能「看到」的資訊量有限，skill 描述只佔其中很小一部分。如果裝了很多 skills 或描述太長，後面的會被截斷——Claude 就不知道它們存在。

**驗證方法：**

```bash
# 在 Claude Code 中執行
/context
```

看輸出裡有沒有 skill budget 相關的警告。如果有，可以透過環境變數調整：

```bash
export SLASH_COMMAND_TOOL_CHAR_BUDGET=8000
```

### 原因 3：Session 沒重新載入 plugin

修改或新增 skills 後，已開啟的 session 不會自動偵測變更。

**解法：**

```bash
/reload-plugins
```

或直接開新 session。

### 原因 4：SKILL.md 格式問題

- 檔名必須是 `SKILL.md`（大小寫敏感，`skill.md` 不行）
- 檔案開頭必須有正確的 `---` 區塊（YAML frontmatter）
- `user-invocable: false` 會讓 skill 不出現在 `/` 列表
- `disable-model-invocation: true` 會讓 Claude 不主動使用

```markdown
---
name: my-skill
description: 這行會被載入 context，決定 Claude 知不知道這個 skill 存在
user-invocable: true
---

skill 內容...
```

## settings.json 和 skill 有什麼關係

很多人以為 skills 要在 `settings.json` 裡「註冊」才能用——**不需要**。Skills 是靠檔案位置自動發現的。

`settings.json` 唯一會影響 skill 的情況是：**你在裡面設了權限規則把 skill 擋掉了**。

Claude Code 有三層設定檔，後面的會覆蓋前面的：

| 設定檔 | 位置 | 說明 |
|--------|------|------|
| `~/.claude/settings.json` | 家目錄 | 你的全域設定 |
| `.claude/settings.json` | 專案目錄 | 團隊共享，會進 git |
| `.claude/settings.local.json` | 專案目錄 | **你個人的覆寫**，不進 git，優先級最高 |

如果 skills 突然消失，可以檢查這三個檔案裡有沒有 deny `Skill` 的規則，特別是 `settings.local.json`——它的優先級最高，會蓋掉其他設定。

## 最穩定的做法：專案層級 skills

Global skills 的問題是依賴 `~/.claude/` 路徑存在且可讀。換電腦、換 app、路徑解析不同都可能出事。

**最穩定的作法是把重要的 skills 放在專案目錄裡：**

```
<project>/
└── .claude/
    └── skills/
        └── format-commit/
            └── SKILL.md
```

好處：

- **跨介面一致**：CLI、Desktop App、Web 都以專案目錄為基準，不依賴 home 路徑
- **進 git**：團隊成員自動共享，換電腦不遺失
- **無路徑解析問題**：相對於工作目錄，不受 `$HOME` 差異影響

Global skills 適合個人通用型工作流程（不需要團隊共享的）。但如果穩定性是第一優先，專案層級永遠更可靠。

## 排查 Checklist

遇到 skills 找不到時，按順序檢查：

```bash
# 1. 檔案存在嗎？
ls -la ~/.claude/skills/

# 2. SKILL.md 格式正確嗎？（檢查 frontmatter）
head -10 ~/.claude/skills/*/SKILL.md

# 3. Desktop App 的 HOME 路徑一致嗎？
echo $HOME

# 4. skill context budget 有沒有超？
# 在 Claude Code 中執行 /context 檢查

# 5. 有沒有被 settings 擋掉？
cat ~/.claude/settings.json | grep -i skill
cat .claude/settings.json | grep -i skill 2>/dev/null
cat .claude/settings.local.json | grep -i skill 2>/dev/null

# 6. 強制重新載入
# 在 Claude Code 中執行 /reload-plugins
```

## 小結

| 症狀 | 最可能原因 |
|------|-----------|
| `/` 看得到，Claude 說沒有 | Skill 描述沒被載入 context（budget 超限或載入時序） |
| CLI 有，Desktop App 沒有 | `$HOME` 路徑解析不同 |
| 新 session 都沒有 | SKILL.md 格式錯誤或被 settings deny |
| 偶爾有偶爾沒有 | Context budget 超限，後面的被截斷 |

記住一個原則：**如果要讓 skills 在所有環境都能用，放專案目錄比放家目錄更可靠。**

## 參考資料

- [Claude Code Skills 官方文件](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Claude Code Settings 說明](https://docs.anthropic.com/en/docs/claude-code/settings)
- [Claude Code Skill 完整指南：把重複的工作流程變成一句指令](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide)
- [Claude Code 的三層品質防線：Hook、Skill、指令檔](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md)

---
title: "Claude Code Cloud Routines：outcomes 配置讓文章推到 feature branch 的除錯記錄"
date: 2026-09-01
category: tech
type: debug
tags: [claude-code, cloud, git, debug, ci-cd, automation]
lang: zh-TW
tldr: "Cloud routine 的 outcomes 配置會建立 feature branch，導致 agent 在 branch 上作業並推送，文章沒進 main。修法是移除 outcomes 加上 skill 裡補 git checkout main 雙保險，但過程中還撞上 list API pagination 的 server-side bug。"
description: "記錄 Claude Code cloud routines 因 outcomes 配置導致 daily-digest 文章推到 feature branch 而非 main 的根因分析與修復過程。"
draft: false
---

## TL;DR

Cloud routine 的 `outcomes` 配置會讓雲端 session 在 feature branch 上作業。Skill 裡寫 `git push origin main` 沒用——agent 已經在 branch 上了，推的是 branch。修法：移除 `outcomes` + skill 補 `git checkout main`。過程中還撞上 RemoteTrigger list API 的 pagination bug（cursor 永遠不推進），靠使用者手動從 Web UI 拿 trigger ID 才繞過。

## 情境

quidproquo 部落格用 15 個 Claude Code cloud routines 每天自動產出不同類型的日報（arxiv digest、GitHub trending、security alert、model card 等），每個 routine 讀取對應的 skill 檔案執行，最後 `git push origin main` 發布。

2026-09-01 發現：arxiv digest 正常上線了，但其他 7 篇日報在網站上看不到。

## 問題

用 `RemoteTrigger` 的 `get_run_log` 比對成功的 arxiv session 和失敗的 GitHub digest session，發現關鍵差異：

**arxiv session**（成功）：在 `main` branch 上作業，`git push -u origin main` 直接推到 main。

**GitHub digest session**（失敗）：在 `claude/trusting-cannon-npgqrz` branch 上作業，推到 feature branch，文章沒有合回 main。

兩個 routine 的 skill 都寫了 `git push origin main`，為什麼行為不一樣？

## 嘗試過程

### 第一步：比對 routine 配置

用 `RemoteTrigger` 的 `get` action 拉出兩個 routine 的完整配置，發現兩者都有 `outcomes` 欄位：

```json
"outcomes": [{
  "git_repository": {
    "git_info": {
      "branches": ["claude/trusting-cannon"],
      "repo": "vincentxuu/quidproquo"
    }
  }
}]
```

`outcomes` 會讓雲端環境建一個帶隨機後綴的 feature branch（如 `claude/trusting-cannon-npgqrz`）並 checkout 到那裡。當 agent 執行 `git pull origin main` 時，它只是把 main merge 進 feature branch——**不會切回 main**。

### 第二步：確認受影響範圍

用 `git ls-tree` 掃所有 remote branches，找到 8 個 branch 上有 09-01 的日報文章但都沒在 main 上：

```bash
for b in $(git branch -r); do
  count=$(git ls-tree --name-only "$b" -- src/content/posts/daily/ \
    | grep "2026-09-01" | wc -l)
  [ "$count" -gt 0 ] && echo "$b: $count files"
done
```

### 第三步：想批次修復 routine 配置卻撞上 pagination bug

用 `RemoteTrigger` 的 `list` action 想列出所有 daily routine，發現 API 的 `next_cursor` 永遠回傳同一個值 `MTc4NzUwMDcwNTE0NDI2MzAwMHw2YjhmZmRiOC0wN2JkLTQ1ZWUtOTI3NS04Mjc4YTZkNTM5NjA=`（base64 解碼後是 `1787500705144263000|6b8ffdb8-07bd-45ee-9275-8278a6d53960`），翻頁翻不動。

最新的 20 筆全是 PR re-check 一次性 routines（8/23-8/27 建的），8/16 建的 daily-digest routines 完全到不了。試了：
- 傳 cursor → 回傳同一頁
- 偽造更早 timestamp 的 cursor → 也回傳同一頁
- `CronList` 工具 → 那是 session-scoped，回傳空

最終靠使用者到 https://claude.ai/code/routines 手動複製 14 個 trigger ID 才解決。

## 解法

三層修復，同時進行：

### 1. 搶救卡住的文章：cherry-pick

每個 branch 上只有 1-2 個 unique commit（文章本身），直接 cherry-pick 回 main：

```bash
git cherry-pick 5b2622f5  # github digest
git cherry-pick f5b419b5  # product builder interview
git cherry-pick 9ee6b4be  # security alert
# ... 共 8 個 commit，零衝突
pnpm verify  # 全綠
git push origin main
```

### 2. Skill 端補 `git checkout main`（belt）

在全部 15 個 daily-digest skill 的 Step 1 準備階段，`git pull origin main` 前面加上 `git checkout main`：

```bash
# Step 1: 準備
git checkout main        # ← 新增這行
git pull origin main
```

用 sed 批次處理：

```bash
for f in .agents/skills/daily-digest-*/SKILL.md; do
  sed -i '' '/^git pull origin main$/i\
git checkout main
' "$f"
done
pnpm skills:sync  # 同步 mirror
```

### 3. Routine 配置移除 `outcomes`（suspenders）

對全部 15 個 routine 用 `RemoteTrigger` 的 `update` action，把 `session_context` 重寫為不含 `outcomes` 的版本：

```json
{
  "job_config": {
    "ccr": {
      "environment_id": "env_011CULZ3E2stUFWvidbThDMN",
      "session_context": {
        "allowed_tools": ["Bash", "Read", "Write", "Edit", "Glob", "Grep"],
        "model": "claude-sonnet-5",
        "sources": [{"git_repository": {"url": "https://github.com/vincentxuu/quidproquo"}}]
      }
    }
  }
}
```

13 個 update 可以平行送出，全部 HTTP 200。

## 為什麼會這樣

`outcomes` 是 cloud routines 的一個配置，原意是讓 session 把改動推到指定的 feature branch（適合需要 PR review 的場景）。但對這個 repo（個人部落格，直推 main），它變成了一個隱性的坑：

1. 雲端環境在 clone 後 checkout 到 outcomes 指定的 branch
2. `git pull origin main` 在 feature branch 上執行只是 merge，不切分支
3. Agent 不一定會遵守 skill 裡寫的 `git push origin main`——如果它發現自己在 feature branch 上，可能會順著推到 feature branch
4. Arxiv 那次「碰巧成功」是因為 agent 恰好留在 main 上推送

而且 `outcomes` 的行為並沒有明確的文件說明這個 branch checkout 行為，是從 run log 比對推導出來的。

## 學到的事

- Cloud routine 的 `outcomes` 會改變 session 的起始 branch——如果你的 workflow 是直推 main，不要配 `outcomes`。
- `git pull origin main` ≠ `git checkout main`。在非 main branch 上執行 pull origin main 只是 merge。
- Debug cloud routines 時，`get_run_log` 是最有用的工具——可以逐行看到 agent 實際跑了什麼命令、在哪個 branch、推到哪裡。
- RemoteTrigger list API 有 pagination bug（cursor 不推進），遇到時用 `get` 搭配已知的 trigger ID 繞過。

## 參考資料

- [Claude Code Routines 管理介面](https://claude.ai/code/routines)
- [Claude Code 官方文件](https://docs.anthropic.com/en/docs/claude-code/overview)
- [RemoteTrigger API — schedule skill 內建文件](https://claude.ai/code) — `/schedule` skill 載入時的 API 參考

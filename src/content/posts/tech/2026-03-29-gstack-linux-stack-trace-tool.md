---
title: "gstack — Garry Tan 把 Claude Code 變成虛擬工程團隊的 20 個 Skills"
date: 2026-03-29
type: guide
category: tech
tags: [claude-code, ai, gstack, skills, vibe-coding]
lang: zh-TW
tldr: "gstack 是 Garry Tan 開源的 Claude Code skills 工具集，用 20 個專業 skill 把一個人變成一整個工程團隊——從產品規劃、設計審查、code review、QA 到部署，全部自動化。"
description: "介紹 Garry Tan 的 gstack 開源專案：它的設計哲學、20 個 skill 怎麼串成開發流水線、安裝方式，以及它對 solo developer 工作流的啟示。"
draft: false
---

Garry Tan（Y Combinator CEO）在全職管理 YC 的同時，聲稱用 Claude Code 一天產出 10,000–20,000 行程式碼。他把自己的整套 Claude Code 設定開源了，叫做 gstack。54,000+ stars，MIT license。

這篇介紹 gstack 到底是什麼、怎麼運作、值不值得用。

## gstack 是什麼

gstack 不是一個 app，是一組 Claude Code 的 **skills**（slash commands）。安裝後你會多出 20 個指令，每個指令扮演一個角色：

| 角色 | 指令 | 做什麼 |
|------|------|--------|
| CEO | `/office-hours` | 挑戰你的產品假設，產出三個實作方向 |
| CEO | `/plan-ceo-review` | 審查設計文件的 scope 和 vision |
| Tech Lead | `/plan-eng-review` | 架構審查、data flow 圖、error path 分析 |
| Designer | `/design-consultation` | 產生完整 design system |
| Designer | `/design-review` | 設計審查 + 自動修正 |
| Engineer | `/review` | Code review，抓 production bug |
| Engineer | `/investigate` | 系統性 root cause 除錯 |
| QA | `/qa` | 開真的瀏覽器跑測試，發現 bug 自動修 |
| QA | `/qa-only` | 純報 bug，不修 |
| Security | `/cso` | OWASP Top 10 + STRIDE threat modeling |
| DevOps | `/ship` | 跑測試、開 PR |
| DevOps | `/land-and-deploy` | Merge、CI/CD、production 驗證 |
| DevOps | `/canary` | 部署後監控 |
| Performance | `/benchmark` | 效能基線與比較 |
| Doc | `/document-release` | 自動更新文件 |
| Retro | `/retro` | 週回顧 |

另外還有 8 個工具指令，像 `/browse`（真的 Chromium 瀏覽器）、`/codex`（用 OpenAI 做第二意見 review）、`/careful`（危險操作警告）、`/freeze`（鎖定編輯範圍）等。

## 核心設計：Sprint 流水線

gstack 的重點不是單一 skill 有多強，而是它們串成一條流水線：

```
Think → Plan → Build → Review → Test → Ship → Reflect
```

每個 skill 的輸出餵給下一個 skill。實際操作大概像這樣：

```
你：我想做一個每日行事曆摘要 app
你：/office-hours
Claude：[挑戰前提，產出三個方向]

你：選方向 2
你：/plan-ceo-review
Claude：[讀設計文件，跑 10 項審查]

你：/plan-eng-review
Claude：[畫 data flow、列測試矩陣、標 error path]

你：Approve. Exit plan mode.
Claude：[8 分鐘產出 2,400 行，11 個檔案]

你：/review
Claude：[自動修了 2 個問題，問你 1 個 race condition]

你：/qa https://staging.myapp.com
Claude：[開瀏覽器測試，找到 bug，修掉，寫 regression test]

你：/ship
Claude：[sync main，跑測試，開 PR]
```

一個人完成了從產品規劃到部署的完整流程。

## 安裝

需要 Claude Code 和 Bun v1.0+。

**全域安裝（30 秒）：**

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git \
  ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

**專案內安裝：**

```bash
cp -Rf ~/.claude/skills/gstack .claude/skills/gstack && \
  rm -rf .claude/skills/gstack/.git && \
  cd .claude/skills/gstack && ./setup
```

也支援 Codex 和 Cursor，安裝指令略有不同，詳見 repo README。

## 常見使用方式

### 完整產品開發流程

最標準的用法是從頭到尾跑完整條流水線：

```
/office-hours          # 釐清要做什麼，產出三個方向
/plan-ceo-review       # 審查 scope，選擇展開或收斂
/plan-eng-review       # 鎖定架構、畫 data flow、列 edge case
/plan-design-review    # 設計審查，每個維度 0-10 分
→ 實作
/review                # Code review
/qa https://localhost:3000  # 開瀏覽器跑 QA
/ship                  # 跑測試、開 PR
/land-and-deploy       # Merge + 部署 + 驗證
```

不一定每次都要跑完。小改動可以跳過 planning 階段直接 `/review` → `/ship`。

### 只想快速 debug

```
/investigate
```

它會強制走四個階段：investigate → analyze → hypothesize → implement。核心原則是「沒找到 root cause 不准修」，避免 AI 亂猜亂改。

### 設計系統從零開始

```
/design-consultation
```

它會問你產品是什麼、目標用戶是誰，然後產出完整的 design system——色彩、字體、spacing、motion，存成 `DESIGN.md`。之後所有 session 都會自動讀這個檔案，確保設計一致。

### 雙模型 Code Review

```
/review        # Claude 先 review
/codex         # 再用 OpenAI Codex 做第二意見
```

兩個模型看到的問題不一樣。`/codex` 有三種模式：review（審程式碼）、challenge（試著破壞你的程式）、consult（問問題）。

### 安全模式

在碰 production 或不熟悉的 codebase 時：

```
/guard                 # 同時啟用 /careful + /freeze
```

- `/careful` 會在你執行 `rm -rf`、`DROP TABLE`、`git push --force` 等危險指令前跳警告
- `/freeze src/components` 會鎖定編輯範圍，只允許改 `src/components` 裡的檔案，防止 debug 時不小心改到別的地方

### QA 但不要改我的 code

```
/qa-only https://staging.myapp.com
```

只報 bug、給截圖和重現步驟，不會動你的程式碼。適合交給別人修，或你想自己決定怎麼修的情況。

### 已經上線了，想持續監控

```
/canary https://myapp.com
```

部署後持續監控：抓 console error、效能退化、頁面壞掉。會定期截圖跟部署前的 baseline 比較。

### 需要測有登入的頁面

```
/setup-browser-cookies
```

從你的 Chrome/Arc/Brave/Edge 匯入 cookies，之後 `/qa` 和 `/browse` 就能測需要登入的頁面。

## 值得注意的設計選擇

**Skill 之間有依賴關係。** `/plan-eng-review` 預期你先跑過 `/office-hours` 和 `/plan-ceo-review`，因為它會讀前面產出的設計文件。跳步驟可以，但效果會打折。

**QA 用真的瀏覽器。** `/qa` 背後是 Playwright + 真的 Chromium，不是模擬。它會開瀏覽器、點按鈕、填表單、截圖，然後判斷有沒有 bug。

**支援平行執行。** 用 Conductor 可以同時跑 10–15 個 sprint，每個 agent 管理獨立的 branch。這是 Garry Tan 聲稱高產出的關鍵——不是一個 agent 寫很快，而是很多個 agent 同時寫。

**Telemetry 預設關閉。** 有 opt-in 的 Supabase telemetry，但不傳程式碼、路徑或 prompt。schema 公開。

## 整體來說

gstack 的核心想法是：**把軟體開發的每個角色都變成一個可呼叫的 skill，然後用固定流程串起來。** 它不是讓 AI 更聰明，而是用流程約束 AI，讓它在每個階段做對的事。

這對 solo developer 或小團隊最有價值——你不需要真的有 tech lead、designer、QA，你只需要在對的時機呼叫對的 skill。當然，AI 的審查不等於人的審查，但對一個人的專案來說，有流程總比沒流程好。

54,000+ stars 代表這個方向踩到了需求。至於 10,000–20,000 LOC/day 的數字，看看就好——行數從來不是衡量產出的好指標。真正有意思的是這套工作流本身：它示範了一種把 AI coding assistant 從「問答工具」升級成「開發流水線」的思路。

---

## 參考資料

- [garrytan/gstack — GitHub](https://github.com/garrytan/gstack)
- [gstack ARCHITECTURE.md](https://github.com/garrytan/gstack/blob/main/ARCHITECTURE.md)
- [gstack ETHOS.md — Builder 哲學](https://github.com/garrytan/gstack/blob/main/ETHOS.md)
- [gstack Skills 文件](https://github.com/garrytan/gstack/blob/main/docs/skills.md)

---
title: "AI Agent 的全域 Skills 要放哪裡？.claude、Codex Skills、AGENTS.md 的分工"
date: 2026-04-02
type: guide
category: tech
tags: [ai-agent, skills, claude-code, codex, agents-md, developer-tools]
lang: zh-TW
description: "不是把 Skill 丟進 .claude 就會所有 agent 共用。這篇整理 Claude Code、Codex Skills 和 AGENTS.md 的分工，說清楚全域 skill、專案 skill 與跨 agent 規則該放哪裡。"
tldr: "Skill 路徑通常是 runtime-specific，跨 agent 真正穩的是 AGENTS.md；個人共用能力放各自 agent 支援的全域目錄，專案 workflow 放 repo 內。"
draft: false
---

## TL;DR

不要把 `~/.claude/skills/` 當成所有 AI agent 都會讀的共用標準。

公開文件裡比較明確的做法是：

- Claude Code 的個人 skills 放 `~/.claude/skills/`
- Claude Code 的專案 skills 放 `repo/.claude/skills/`
- Codex 有自己的 Skills 機制與 catalog
- 真正跨 agent 穩定、可預期、最值得放進 git 的，是 `AGENTS.md`

一句話講完：**可重用能力放 skill，跨 agent 規則放 `AGENTS.md`。**

## 情境

我原本以為只要把一個 skill 放進 `.claude/skills/`，像 `format-commit` 這種東西，其他 agent 也應該能共用。

結果很快就撞牆了。

同一台機器上可能同時有 Claude、Codex，甚至還有別的 agent runtime。你會看到一堆很像的目錄：

```text
~/.claude/skills/
~/.codex/skills/
~/.agents/skills/
repo/.claude/skills/
repo/AGENTS.md
```

看起來很像同一件事，只是路徑不同。但實際上不是。

## 問題

核心問題不是「skill 檔案放錯位置」，而是 **把 runtime 的實作路徑誤認成跨 agent 標準**。

這會導致幾種常見誤解：

- 我明明有全域 skill，為什麼另一個 agent 沒用到？
- 為什麼 Claude 會自動觸發，Codex 卻沒有？
- 為什麼我把 skill commit 進 repo，別的 agent 還是不理它？
- `~/.agents/skills/` 是不是大家都支援的通用位置？

答案通常都是：**不是所有 agent 都讀同一套路徑，也不是所有 agent 都把 skill 當成同一種機制。**

## 嘗試過程

我先從「哪個路徑才是標準」這個角度去查，結果會發現公開資訊其實很分裂。

Claude Code 的文件很清楚，直接把 skills 分成三類：

- Personal Skills：`~/.claude/skills/`
- Project Skills：`repo/.claude/skills/`
- Plugin Skills：跟著 plugin 走

而且 Claude 的說法非常直接：project skills 應該進 git，團隊成員 pull 下來之後就能用。

但到了 Codex，官方公開資訊的重點不是「請把 skill 放在某個固定資料夾」，而是：

- Codex 有 Skills
- OpenAI 有公開的 Skills catalog
- skill 可以被安裝、分享、重用

這種設計比較偏「能力分發機制」，不是在文件裡強調某個單一 filesystem path。

再往外看，`AGENTS.md` 這套東西剛好相反。它的重點不是某個 agent 的 skill loader，而是：

- 它是一個開放格式
- 目的是讓不同 coding agents 共用同一份專案規則
- commit 規範、測試步驟、專案慣例都可以放進去

看到這裡，結論其實已經很明顯了：**skill 是 agent-specific，`AGENTS.md` 才是 cross-agent。**

## 解法

我的做法最後變成三層分工，而不是硬找一個「全世界都支援的 skill 路徑」。

### 1. 跨 agent 都該遵守的規則，放 `AGENTS.md`

這一層放的是：

- commit message 規範
- 測試與 build 指令
- 專案結構與禁忌
- 寫文章的 frontmatter 規則
- 什麼情況一定要附 `參考資料`

原因很簡單：這些不是某個 skill，而是整個 repo 的工作方式。

### 2. 專案特定 workflow，放 repo 內的 project skills

像這種就很適合：

- `post`
- `format-commit`
- `release-note`
- `deploy-checklist`

如果你主要用 Claude Code，這一層就是：

```text
repo/.claude/skills/<skill-name>/SKILL.md
```

它的價值不是跨所有 agent，而是讓**同一個專案裡、同一套工具鏈的使用者**拿到一致 workflow。

### 3. 個人跨專案偏好，放各自 runtime 的全域 skill 機制

這一層才是個人化：

- 你自己的 commit 風格
- 常用 debug checklist
- 個人 code review 習慣
- 常見文件產生流程

如果你用 Claude Code，官方明確支援的是：

```text
~/.claude/skills/
```

如果你用 Codex，應該優先走 Codex 自己支援的 Skills 機制，而不是假設 `.claude/skills/` 會被它自動吃到。

### 一個比較不容易踩坑的結構

```text
repo/
├── AGENTS.md                  # 跨 agent 專案規則
├── .claude/
│   └── skills/               # Claude project skills
│       ├── post/
│       └── format-commit/
└── src/...

~/
├── .claude/
│   └── skills/               # Claude personal skills
└── 其他 agent 各自的 global skill 機制
```

重點不是目錄長什麼樣，而是不要把「某個 runtime 的載入路徑」誤會成「大家共同遵守的標準」。

## 為什麼會這樣

因為 `skill` 和 `agent instruction` 解決的是兩個不同層級的問題。

`skill` 比較像可重用能力包：

- 一組 instructions
- 可附 scripts、templates、resources
- 讓 agent 在特定情境自動或半自動套用

這種東西天然就跟 runtime 綁很深。不同 agent 怎麼發現 skill、怎麼觸發 skill、怎麼安裝 skill，本來就可能不同。

`AGENTS.md` 則是另一種東西。它不負責「幫 agent 多一個能力」，它負責的是：

- 告訴 agent 這個 repo 怎麼工作
- 給所有 agent 一個穩定、可預期的入口
- 把原本散落在 README、腦袋、口頭習慣裡的規則落地

所以很多人會卡住，不是因為不懂 skill，而是因為把 skill 拿來承擔它不該承擔的跨 agent 規範角色。

## 學到的事

我現在的判斷標準很簡單：

- **這是 repo 規則嗎？** 是的話，放 `AGENTS.md`
- **這是某個 agent 的工作流能力嗎？** 是的話，放該 agent 的 skill 系統
- **這是我個人的跨專案偏好嗎？** 是的話，放該 agent 的全域 skills

如果還想問得更白一點，就是這句：

**不要問「全域 skill 應該放哪個目錄才所有 agent 都看得到」；應該問「哪些東西根本不該只靠 skill 來共享」。**

## 參考資料

- [Claude Docs: Agent Skills](https://docs.claude.com/en/docs/claude-code/skills)
- [OpenAI Skills Catalog for Codex](https://github.com/openai/skills)
- [OpenAI Codex](https://openai.com/codex)
- [AGENTS.md](https://agents.md/)

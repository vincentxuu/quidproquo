---
title: "工具推薦｜skills — 讓套件作者的 Agent Skill 跟著相依關係自動裝進你的 AI 助手"
date: 2026-09-11
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源 CLI，讓 Dart/Flutter 套件作者把 Agent Skill 隨套件一起發布，使用者一行指令就能自動裝進 Claude Code、Cursor、Codex 等多種 AI 助手"
tldr: "skills 是 Serverpod 開源的 CLI，讓 Dart/Flutter 套件作者在套件裡放 skills/ 目錄，使用者跑 skills get 就能把每個相依套件附帶的 Agent Skill 自動裝進 Claude Code、Cursor、Codex 等工具。安裝：dart pub global activate skills。解決了「AI 助手不懂第三方套件用法，得靠手動貼文件或寫規則檔」的問題。"
series:
  name: "AI Tool of the Day"
  order: 27
---

> 🌏 [English version](/en/posts/daily/2026-09-11-tool-dart-skills-cli-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | skills（Dart/Flutter Skills CLI） |
| 類型 | CLI |
| GitHub | [serverpod/skills](https://github.com/serverpod/skills) |
| Stars | 27 |
| 語言 | Dart |
| 授權 | BSD-3-Clause |
| 安裝 | `dart pub global activate skills` |

## 解決什麼問題

在專案裡加一個新的 Dart/Flutter 套件，AI 助手通常完全不知道這個套件該怎麼用——它會用猜的，套用它訓練資料裡看過的舊 API，甚至直接幻覺出根本不存在的方法。你只能把套件文件複製貼進對話框，或是手寫一份 `.cursorrules`、`CLAUDE.md` 規則檔硬塞進 context。套件版本一更新，這份手寫規則就過時，而且沒有人會記得同步維護。

skills 讓套件作者把 Agent Skill 直接隨套件發布：在套件根目錄放一個 `skills/` 目錄，裡面每個子目錄是一份照 [Agent Skills 規格](https://agentskills.io/specification)寫的 `SKILL.md`。使用者在專案根目錄跑 `skills get`，CLI 就會掃過整個相依樹，找出每個套件裡的 `skills/` 目錄，自動偵測你用的是 Claude Code、Cursor、Codex、Cline、GitHub Copilot、Antigravity 還是 OpenCode，把對應的 skill 裝進那個工具規定的目錄（`.claude/skills/`、`.cursor/skills/`……）。套件更新，skill 就跟著版本一起更新；把套件從 `pubspec.yaml` 移除後，`skills prune` 會清掉沒人要的殘留 skill。就算套件本身還沒附 skill，CLI 也能從 GitHub registry（如官方的 `flutter/skills`）額外抓社群維護的版本。

適合場景：維護 Dart/Flutter 套件、想讓使用者的 AI 助手少幻覺 API 的套件作者；在 monorepo 裡有一堆內部套件、想要一次幫所有依賴裝好對應 skill 的團隊；已經照 Agent Skills 規格寫了 skill，但目前還在手動複製貼上、想要「skill 跟著相依版本自動分發」的開發者。

## 快速上手

### 安裝

```bash
# 全域啟用 CLI
dart pub global activate skills

# 確保 ~/.pub-cache/bin 已加入 PATH
# （參考 https://dart.dev/tools/pub/cmd/pub-global#running-a-script-from-your-path）
```

### 基本用法

```bash
# 在 Dart/Flutter 專案根目錄執行：
# 掃描整個相依樹,安裝每個套件附帶的 skill
skills get

# 只安裝特定套件的 skill
skills get serverpod

# 列出目前已安裝、且由 CLI 管理的 skill
skills list

# 套件被移出 pubspec.yaml 後,清掉沒用到的 skill
skills prune
```

### 進階用法

```bash
# 明確指定要裝到哪個 IDE(同時偵測到多個時,預設全部裝)
skills get --ide claude

# 套件作者幫自己的套件新增一份 skill
skills create
# 會提示輸入名稱與說明,建立 skills/<package>-<name>/SKILL.md

# 移除某個套件安裝進來的 skill
skills remove serverpod
```

## 與現有工具的比較

| | skills（Dart） | `npx skills`（skills.sh，Vercel Labs） | 手寫 CLAUDE.md／.cursorrules |
|---|---|---|---|
| 隨專案相依樹自動找 skill | ✅ | ❌（需逐一指定 GitHub repo） | ❌ |
| 一行指令裝完所有依賴的 skill | ✅ `skills get` | 部分（需對每個來源跑一次 `add`） | ❌ |
| 自動偵測並寫入對應 IDE 目錄 | ✅（7 種工具） | ✅ | 需自己找對目錄 |
| 依賴移除後自動清掉對應 skill | ✅ `skills prune` | ❌ | 需手動刪 |
| 支援跨語言的公開 skill 市集 | ❌（可接 GitHub registry，仍以 Dart 生態為主） | ✅（skills.sh 索引超過 7 萬份公開 skill） | ❌ |

`npx skills` 走的是「npm 式套件管理」模式：skill 來源是任意 GitHub repo，要裝哪個得自己知道 repo 名稱去 `add`；`skills`（Dart）則是把 skill 綁進套件本身的相依關係——只要你的專案有裝這個套件，`skills get` 就會自動把它的 skill 一起帶進來，不需要另外記一份 skill 清單。

## 注意事項

- **目前只服務 Dart/Flutter 生態**：CLI 靠掃描 `pubspec.yaml` 相依樹運作，非 Dart 專案用不上；套件作者也得自己動手在套件裡補上 `skills/` 目錄，不會自動生成。
- **GitHub registry 依賴 git 指令**：`skills get` 若要從 `flutter/skills`、`serverpod/skills-registry` 這類 registry 抓社群 skill，機器上要先裝好 `git`；沒裝的話會印警告，只裝套件內建的 skill。
- **官方標注這只是過渡方案**：README 註明 Dart 團隊正在做一套基於 Dart MCP server 的類似機制，屆時這個套件可能改採新標準或直接淘汰——現在採用前要有心理準備日後可能要遷移。

## 今日收穫

過去把「教 AI 助手怎麼用我的套件」當成使用者自己的責任——寫不寫規則檔、貼不貼文件,是每個開發者各自的事。skills 把這件事的責任挪回套件作者身上：skill 跟著套件版本一起發布、一起更新、套件移除時一起清掉,變成套件維護流程的一部分,而不是使用者每次加依賴都要重做一次的雜務。

## 參考資料

- [serverpod/skills GitHub repo](https://github.com/serverpod/skills)：README、安裝指令、CLI 指令列表、支援 IDE 對照表出處；Stars（27）、語言（Dart）、授權（BSD-3-Clause）取自 GitHub API。
- [Skills CLI 1.0 — Dart 官方部落格公告](https://dart.dev/blog/skills-cli-1-0-bundle-and-distribute-ai-agent-skills-for-your-packages)：1.0 版發布資訊、套件作者/使用者兩種安裝流程說明出處。
- [skills | Dart package — pub.dev](https://pub.dev/packages/skills)：套件描述與支援 IDE 對照表交叉確認。
- [Agent Skills: The Complete Guide to Extending AI Coding Agents — Denser.ai](https://denser.ai/blog/agent-skills-guide)：`npx skills`／skills.sh（Vercel Labs）運作方式與 skill 市集規模（7 萬+ skill）出處。

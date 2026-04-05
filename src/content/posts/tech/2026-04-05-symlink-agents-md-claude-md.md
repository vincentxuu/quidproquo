---
title: "Codex 和 Claude Code 的設定檔重複維護問題：用 symlink 一次解決"
date: 2026-04-05
category: tech
tags: [claude-code, codex, agents-md, symlink, dx, ai-tools]
lang: zh-TW
tldr: "Claude Code 不認 AGENTS.md，Codex 不認 CLAUDE.md，多人協作項目被迫維護兩份一樣的設定。解法：把 CLAUDE.md 做成 AGENTS.md 的 symlink，只維護一份。"
description: "在同時使用 Codex 和 Claude Code 的多人協作項目中，設定檔重複維護是個惱人問題。本文用 symlink 一行指令解決。"
draft: false
---

## TL;DR

Claude Code 只讀 `CLAUDE.md`，Codex 只讀 `AGENTS.md`，多人協作項目被迫同時維護兩份內容一模一樣的檔案。把 `CLAUDE.md` 做成指向 `AGENTS.md` 的 symlink，問題消失。

## 情境

團隊裡有人用 Codex，有人用 Claude Code。兩個工具都需要一份 Markdown 設定檔來定義 skills、規範和上下文，但它們各自認不同的檔名：

- **Codex**：讀 `AGENTS.md`
- **Claude Code**：讀 `CLAUDE.md`

結果就是 repo 裡出現了兩個檔案，內容完全一樣。

## 問題

每次改功能、新增 skill、調整規範，都要手動同步更新兩邊。忘記同步的話，不同工具的行為就會不一致，debug 的時候更崩潰——你根本不確定 AI 讀到的是哪一版設定。

這完全違反 DRY 原則，也違背工程師的自動化本能。

## 解法

把 `CLAUDE.md` 變成 `AGENTS.md` 的 symlink：

```bash
# 先確保 AGENTS.md 是你要維護的主檔案
# 如果目前主力是 CLAUDE.md，先把內容搬過去
mv CLAUDE.md AGENTS.md

# 建立 symlink
ln -s AGENTS.md CLAUDE.md
```

之後只需要維護 `AGENTS.md`，Claude Code 讀 `CLAUDE.md` 時會自動跟過去讀到同一份內容。

驗證一下：

```bash
ls -la CLAUDE.md
# CLAUDE.md -> AGENTS.md
```

記得把 symlink 一起 commit 進 repo，這樣團隊其他人 clone 下來就直接生效。

## 為什麼會這樣

Claude Code 和 Codex 是不同公司的產品（Anthropic vs OpenAI），各自定義了自己的設定檔規範，目前沒有統一標準。`AGENTS.md` 是 OpenAI Codex 推的格式，Claude Code 不支援；反過來 Codex 也不認 `CLAUDE.md`。

Symlink 是 Unix 系統最基本的檔案別名機制，Git 原生支援追蹤 symlink，所以這個做法在版本控制上完全沒問題。唯一要注意的是 Windows 環境——Windows 的 symlink 需要特殊權限或開發者模式，如果團隊有 Windows 使用者，可能要額外處理。

## 學到的事

兩個工具打架的時候，不一定要等官方支援，Unix 基礎工具往往就是最簡單的膠水。

## 參考資料

- [CLAUDE.md 官方文件](https://docs.anthropic.com/en/docs/claude-code/memory#claudemd)
- [AGENTS.md 規範](https://openai.com/index/introducing-codex/)
- [Git 對 symlink 的支援](https://git-scm.com/docs/gitfaq#_how_does_git_handle_symbolic_links)

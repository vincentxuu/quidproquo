---
title: "用 Git Conditional Includes 管理個人與工作帳號"
date: 2026-03-13
category: tech
tags: [git, ssh, workflow]
lang: zh-TW
tldr: "用 includeIf + SSH Host alias，讓 git 自動依路徑切換帳號，不再手動切換。"
description: "同時維護個人和工作 GitHub 帳號？用 Git Conditional Includes 搭配 SSH config，讓 git 自動依路徑選對帳號。"
draft: false
---

同時使用個人與工作 GitHub 帳號時，最常遇到的問題是：commit 用錯 email、push 用錯帳號。手動每次 `git config` 很麻煩，忘記設定又會留下錯誤的 commit 作者。Git 提供的 `includeIf` 加上 SSH Host alias，可以讓這件事完全自動化。

## 確認現況

先看目前的 git 設定：

```bash
git config --list --show-origin
```

重點看兩個地方：

1. `~/.gitconfig` 裡的 `user.name` / `user.email`（全域預設）
2. `.git/config` 裡的 `remote.origin.url`（這個 repo 用哪個 SSH host）

## SSH 多帳號設定

先確認 `~/.ssh/config` 有沒有設定 Host alias。如果有兩個 GitHub 帳號，通常會長這樣：

```ssh
# 個人帳號
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal

# 工作帳號
Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
```

工作 repo 的 remote URL 就會設成：

```bash
git remote set-url origin git@github-work:<org>/<repo>.git
```

## Git Conditional Includes

這是核心設定。在 `~/.gitconfig` 加入條件：

```ini
[user]
    name = personal-name
    email = personal@gmail.com

[includeIf "gitdir:~/works/<company>/"]
    path = ~/.gitconfig-work
```

建立 `~/.gitconfig-work`：

```ini
[user]
    name = work-name
    email = work@company.com
```

這樣只要 repo 在 `~/works/<company>/` 底下，git 就會自動套用工作帳號設定。

用指令操作：

```bash
# 建立工作設定檔
git config -f ~/.gitconfig-work user.name "work-name"
git config -f ~/.gitconfig-work user.email "work@company.com"

# 加入條件式 include
git config --global includeIf."gitdir:~/works/<company>/".path "~/.gitconfig-work"
```

## 驗證

在工作 repo 目錄下執行：

```bash
git config user.name
git config user.email
```

應該顯示工作帳號。切換到其他目錄再執行，應該顯示個人帳號。

## 整體架構

```
~/.gitconfig              ← 全域，個人帳號為預設
~/.gitconfig-work         ← 工作帳號設定
~/.ssh/config             ← SSH host alias，區分金鑰

~/works/<company>/repo/   → 自動套用工作帳號 + 工作 SSH key
~/personal/repo/          → 個人帳號 + 個人 SSH key
```

## 整體來說

`includeIf` 的核心優勢是**零認知負擔**——不需要記得切換，路徑決定帳號。適合有固定工作目錄結構的開發者。唯一要注意的是 `gitdir:` 路徑必須以 `/` 結尾，且不支援 `~` 展開在某些舊版 git，建議用絕對路徑確保相容性。

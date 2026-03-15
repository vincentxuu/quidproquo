---
title: "用 SSH config alias 下載 VPS 檔案"
date: 2026-03-15
category: tech
tags: [ssh, scp, vps, cli]
lang: zh-TW
tldr: "設定好 SSH config 後，scp 可以直接用 alias，不用打完整 IP"
description: "如何用 scp 搭配 SSH config alias 從 VPS 下載檔案到本機"
draft: false
---

## TL;DR

設定好 `~/.ssh/config` 之後，`scp` 可以直接用 alias，不用每次打 IP、port、user。

## 情境

要從 VPS 把檔案拉到本機，最直覺的方式是 `scp`：

```bash
scp -P 22 root@your-vps-ip:/path/to/file .
```

但如果 VPS 不只一台，或是 port 不是預設的 22，每次都要記 IP 和 port 很麻煩。

## 解法

`~/.ssh/config` 可以幫每台主機設定 alias，把連線資訊集中管理：

```
Host daodao
    HostName your-vps-ip
    User root
    Port 22
    IdentityFile ~/.ssh/id_rsa
```

設定好之後，`ssh daodao` 就等於 `ssh -p 22 -i ~/.ssh/id_rsa root@your-vps-ip`。

重點是 **`scp` 和 `rsync` 也認這個 config**，所以可以直接用 alias：

```bash
# 下載單一檔案
scp daodao:/path/to/file .

# 下載整個目錄
scp -r daodao:/path/to/dir ./local-destination
```

如果要傳大檔案或目錄，建議用 `rsync`，它支援增量傳輸和斷點續傳：

```bash
rsync -avz daodao:/path/to/dir ./local-destination
```

- `-a`：保留檔案權限、時間戳等 metadata
- `-v`：顯示傳輸進度
- `-z`：傳輸時壓縮，網路慢的時候有幫助

## 學到的事

`scp` 和 `rsync` 都認 `~/.ssh/config`，設一次 alias，之後不管是 ssh 連線還是傳檔都能用同一個名字。

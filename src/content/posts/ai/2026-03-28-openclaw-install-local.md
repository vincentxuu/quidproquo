---
title: "OpenClaw 安裝指南（上）：npm、Docker、Nix 與本機部署"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, installation, docker, nix, podman, raspberry-pi, bun]
lang: zh-TW
tldr: "OpenClaw 提供 6 種本機安裝方式：installer script、npm、Docker、Podman、Nix、Bun，加上 Raspberry Pi 部署和 source 編譯。"
description: "OpenClaw 本機安裝的完整指南，涵蓋 installer script、npm/pnpm、Docker、Podman、Nix、Bun、Raspberry Pi 與從原始碼編譯。"
draft: false
---

OpenClaw 支援多種安裝方式，從一行指令到宣告式 Nix flake 都有。這篇涵蓋所有本機部署方式，下一篇講雲平台和 K8s。

## 系統需求

- **Node.js 24**（建議）或 Node 22.14+
- **macOS、Linux 或 Windows**（原生 Windows 和 WSL2 都支援，WSL2 較穩定）
- `pnpm` 只有從原始碼編譯時才需要

## 方式一：Installer Script（推薦）

最快的方式。自動偵測 OS、安裝 Node（如果沒有）、安裝 OpenClaw、啟動 onboarding。

```bash
# macOS / Linux
curl -fsSL https://openclaw.ai/install.sh | bash

# Windows PowerShell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

CI/自動化場景可以跳過 onboarding：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

## 方式二：npm / pnpm

如果你自己管理 Node：

```bash
# npm
npm install -g openclaw@latest
openclaw onboard --install-daemon

# pnpm（需要額外核准 build scripts）
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

如果 `sharp` 編譯失敗（通常是系統有全域 libvips）：

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

## 方式三：Docker

適合想要隔離環境或 headless 部署的人。

**前提：** Docker Desktop 或 Engine + Docker Compose v2，至少 2 GB RAM。

```bash
./scripts/docker/setup.sh
```

這會自動建 image、問你 API key、產生 gateway token、用 Docker Compose 啟動。

也可以用預建 image（GitHub Container Registry）：

```bash
OPENCLAW_IMAGE=ghcr.io/openclaw/openclaw:latest ./scripts/docker/setup.sh
```

關鍵設定：

| 環境變數 | 用途 |
|---|---|
| `OPENCLAW_IMAGE` | 使用遠端 image 而非本地 build |
| `OPENCLAW_SANDBOX` | 啟用 agent 沙箱（`1`/`true`/`yes`/`on`）|
| `OPENCLAW_EXTRA_MOUNTS` | 額外的 host bind mount |
| `OPENCLAW_HOME_VOLUME` | 用 named volume 持久化 `/home/node` |

Health check endpoint：`/healthz`（liveness）和 `/readyz`（readiness），不需要認證。

Docker Compose 會把 `~/.openclaw` bind-mount 進容器，資料在容器重建後保留。

想更方便管理 Docker 可以裝 `ClawDock` shell helper：

```bash
mkdir -p ~/.clawdock && curl -sL https://raw.githubusercontent.com/openclaw/openclaw/main/scripts/shell-helpers/clawdock-helpers.sh -o ~/.clawdock/clawdock-helpers.sh
```

## 方式四：Podman（Rootless）

Docker 的無 root 替代方案。架構上 Podman 跑容器、host 上的 `openclaw` CLI 當控制平面。

```bash
# 建 image + 設定
./scripts/podman/setup.sh

# 啟動
./scripts/run-openclaw-podman.sh launch
```

設定 `OPENCLAW_CONTAINER=openclaw` 後，就可以用一般的 `openclaw` 指令管理容器。

要自動啟動可以用 Quadlet：

```bash
./scripts/podman/setup.sh --quadlet
```

會建立 systemd user service。

macOS 上 Podman 因為跑在 VM 裡，瀏覽器存取可能需要 SSH tunnel 到 Podman VM。

## 方式五：Nix

宣告式安裝，透過 `nix-openclaw` Home Manager module。特點是版本固定、可回滾。

```bash
# 安裝 Nix（如果還沒有）
# 用 nix-openclaw 的 agent-first template 建立 local flake
# 設定 secrets 到 ~/.secrets/
home-manager switch
```

Nix 模式下（`OPENCLAW_NIX_MODE=1`）OpenClaw 會停用自動安裝和自我更新，行為完全可預測。

回滾：

```bash
home-manager switch --rollback
```

## 方式六：Bun

用 Bun runtime 跑 CLI。適合開發時用，**不適合正式環境**（WhatsApp 和 Telegram 有已知相容性問題）。

```bash
bun install
bun run build
bun run vitest run
```

注意 Bun 會忽略 `pnpm-lock.yaml`，且部分 script（`docs:build`、`ui:*`）仍然需要用 `pnpm` 執行。

## 從原始碼編譯

給 contributor 或想跑最新版的人：

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install && pnpm ui:build && pnpm build
pnpm link --global
openclaw onboard --install-daemon
```

或直接裝 GitHub main branch：

```bash
npm install -g github:openclaw/openclaw#main
```

## Raspberry Pi

OpenClaw 可以在 Raspberry Pi 上跑，因為模型推理在雲端，Pi 只跑 Gateway。

**需求：** Raspberry Pi 4 或 5，至少 2 GB RAM（建議 4 GB），64-bit Raspberry Pi OS Lite，16 GB+ SD 卡或 USB SSD。

```bash
# 系統更新 + 安裝必要工具
sudo apt update && sudo apt install -y git curl build-essential

# 裝 Node 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo bash -
sudo apt install -y nodejs

# 裝 OpenClaw
curl -fsSL https://openclaw.ai/install.sh | bash
```

效能優化建議：
- USB SSD 比 SD 卡效能好很多
- 設定 2 GB swap（RAM 不夠時用）
- 啟用 `NODE_COMPILE_CACHE` 加速 CLI 重複啟動
- 關掉不需要的服務（Bluetooth、CUPS）
- 減少 GPU 記憶體配置

遠端存取用 SSH tunnel 連到 Control UI。

## 驗證安裝

不管用哪種方式，裝完都跑這三個確認：

```bash
openclaw --version       # CLI 可用
openclaw doctor          # 設定無誤
openclaw gateway status  # Gateway 運行中
```

如果 `openclaw` 找不到，檢查 `$(npm prefix -g)/bin` 有沒有在 `$PATH` 裡。

## 更新

```bash
# 最簡單的方式
openclaw update

# 指定 channel
openclaw update --channel beta

# 預覽但不執行
openclaw update --dry-run
```

也可以開自動更新，在 `openclaw.json` 設定。Stable channel 等 6 小時才套用（分散式 rollout），Beta 每小時檢查立即套用。

更新後記得跑：

```bash
openclaw doctor          # 遷移設定 + 驗證
openclaw gateway restart # 重載服務
```

## 回滾

npm：`npm i -g openclaw@<version>`，然後跑 doctor + restart。

原始碼：`git checkout <commit>`，重新 `pnpm install && pnpm build`，restart。

## 解除安裝

```bash
# 最簡單
openclaw uninstall

# 自動化（非互動）
openclaw uninstall --all --yes --non-interactive
```

手動步驟：停止 gateway → 解除安裝服務 → 刪除 `~/.openclaw` → 用 npm/pnpm 移除 CLI → 刪掉 macOS app（如果有）。

如果 CLI 已經不見了，各平台的服務移除方式：
- **macOS (launchd):** `launchctl bootout gui/$UID/ai.openclaw.gateway`
- **Linux (systemd):** `systemctl --user disable --now openclaw-gateway.service`
- **Windows:** `schtasks /Delete /F /TN "OpenClaw Gateway"`

## 遷移到新機器

```bash
# 舊機器：備份
openclaw gateway stop
cd ~ && tar -czf openclaw-state.tgz .openclaw

# 新機器：還原
cd ~ && tar -xzf openclaw-state.tgz
openclaw doctor
openclaw gateway restart
```

重點：要遷移的是**整個 `~/.openclaw` 目錄**，不是只有 `openclaw.json`。裡面有 API key、OAuth token、session 歷史、頻道連線狀態。遷移時注意檔案權限和加密傳輸。

## 整體來說

6 種安裝方式各有適用場景：

| 方式 | 適合誰 |
|---|---|
| Installer script | 大多數人，最快 |
| npm/pnpm | 已有 Node 環境的開發者 |
| Docker | 想要隔離、headless、或容器化部署 |
| Podman | 想要 rootless 容器 |
| Nix | 追求可重現性和回滾能力 |
| Bun | 開發時快速迭代（不適合正式環境）|
| Source | Contributor 或想跑最新程式碼 |
| Raspberry Pi | 低成本 24/7 Gateway |

下一篇講雲平台部署：K8s、Fly.io、Hetzner、GCP、Azure、Ansible。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/install/index.md](https://github.com/openclaw/openclaw/blob/main/docs/install/index.md) — 安裝總覽
- [docs/install/docker.md](https://github.com/openclaw/openclaw/blob/main/docs/install/docker.md) — Docker 安裝
- [docs/install/podman.md](https://github.com/openclaw/openclaw/blob/main/docs/install/podman.md) — Podman 安裝
- [docs/install/nix.md](https://github.com/openclaw/openclaw/blob/main/docs/install/nix.md) — Nix 安裝
- [docs/install/bun.md](https://github.com/openclaw/openclaw/blob/main/docs/install/bun.md) — Bun 安裝
- [docs/install/raspberry-pi.md](https://github.com/openclaw/openclaw/blob/main/docs/install/raspberry-pi.md) — Raspberry Pi 部署
- [docs/install/updating.md](https://github.com/openclaw/openclaw/blob/main/docs/install/updating.md) — 更新指南
- [docs/install/uninstall.md](https://github.com/openclaw/openclaw/blob/main/docs/install/uninstall.md) — 解除安裝
- [docs/install/migrating.md](https://github.com/openclaw/openclaw/blob/main/docs/install/migrating.md) — 遷移指南
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/main/docs/start/getting-started.md) — 快速上手

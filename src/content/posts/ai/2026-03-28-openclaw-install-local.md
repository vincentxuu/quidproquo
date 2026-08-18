---
title: "OpenClaw 安裝指南（上）：六種本機安裝方式怎麼選，以及會卡住的地方"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, installation, docker, nix, podman, raspberry-pi, bun]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 2
tldr: "OpenClaw 有六種本機安裝方式，差別不在指令而在你要不要可重現性、隔離、與自我更新。真正會卡住的是套件管理器的 lifecycle script 政策：npm 12 與 pnpm 全域安裝都預設擋掉 OpenClaw 的 build script。"
description: "OpenClaw 本機安裝的選型指南：installer script、npm/pnpm/bun、Docker、Podman、Nix、從原始碼與 Raspberry Pi 各自適合誰，以及安裝過程真正會失敗的幾個點。"
draft: false
---

OpenClaw 的安裝指令在官方 [Install](https://docs.openclaw.ai/install/) 頁面隨時是最新的，這篇不重抄一遍。這篇要回答的是它沒直接說的兩件事：**六種方式差在哪、你該選哪個**，以及**哪幾個地方裝到一半會停下來**。

## 系統需求

- **Node 22.22.3+、24.15+ 或 25.9+**，建議用 Node 26。installer script 在偵測不到 Node 時會自己裝一份
- macOS、Linux 或 Windows。Windows 桌面使用者現在有原生的 Windows Hub app，PowerShell installer 與 WSL2 Gateway 也都支援
- `pnpm` 只有從原始碼編譯時才需要

## 六種方式怎麼選

差別不在指令長度，在你想要什麼性質：

| 方式 | 你買到的是 | 代價 |
|---|---|---|
| Installer script | 最短路徑，OS 偵測與 Node 佈建都幫你做 | 東西裝在系統層，版本由它決定 |
| 本地 prefix installer（`install-cli.sh`）| OpenClaw 與 Node 都收在 `~/.openclaw` 底下 | 不吃系統 Node，但也不共用 |
| npm / pnpm / bun | 沿用你既有的 Node 工具鏈 | 要自己處理 lifecycle script 政策（見下節）|
| Docker / Podman | 隔離與可丟棄，headless 主機友善 | 多一層容器要管，build 需要 2 GB RAM |
| Nix | 可重現、能回滾、版本全鎖死 | 設定檔變唯讀，見下面的 Nix mode |
| 從原始碼 | 跑得到還沒發布的 main | 要自己 build，要自己扛壞掉的風險 |

如果你沒有特別理由，`curl -fsSL https://openclaw.ai/install.sh | bash` 就是答案；加 `--no-onboard` 可以只裝不走 onboarding。

## 真正會卡住的地方

這幾個是「指令看起來對、但會失敗」的類型，也是這篇存在的主要理由。

**一、npm 12 預設擋掉 OpenClaw 的 build script。** npm 12 不再自動執行未核准的 package lifecycle script，而 OpenClaw 有 `preinstall` 與 `postinstall`。所以全域安裝要寫成：

```bash
npm install -g openclaw@latest --allow-scripts=openclaw
```

沒加的話 npm 會回報 script `blocked because they are not covered by allowScripts`。版本差異要注意：npm 11.16 接受這個選項、不加只會警告但仍然執行；**npm 11.15 以下沒有這個選項，必須不加**。另外 npm 11.16 建議你跑的 `npm approve-scripts openclaw` 對全域安裝無效，會回 `ENOMATCH No installed packages match: openclaw`。

**二、pnpm 的全域安裝不能用 `approve-builds`。** `pnpm approve-builds -g` 不支援全域安裝，要把核准寫在安裝指令上：

```bash
pnpm add -g --allow-build=openclaw openclaw@latest
```

**三、Bun 裝得起來，但跑起來還是要 Node。** `bun add -g --trust openclaw@latest` 可以完成安裝，可是產生的 `openclaw` 執行檔仍然需要一個受支援的 Node runtime——因為 OpenClaw 的狀態儲存用的是 `node:sqlite`。Bun 在這裡是套件管理器，不是 runtime。

**四、Docker build 在 1 GB 主機上會被 OOM 砍掉。** 症狀是 `pnpm install` 階段 exit 137。至少準備 2 GB RAM。

**五、`openclaw` 找不到，幾乎都是 PATH。** npm 的全域 bin 目錄沒進 shell 的 `PATH`：

```bash
node -v           # Node 裝好了嗎
npm prefix -g     # 全域套件在哪
echo "$PATH"      # 那個 bin 目錄在裡面嗎
```

## 容器：Docker 與 Podman

Docker 是**選配**，用途是隔離、可丟棄、或部署到沒有本機開發環境的主機。它跟 agent 沙箱是兩件事——沙箱預設關閉，而且不需要 Gateway 自己跑在容器裡。

預建 image 以 GitHub Container Registry 為主（`ghcr.io/openclaw/openclaw`），同一次發布會鏡像一份到 Docker Hub（`openclaw/openclaw`）。有幾種變體值得知道：`slim` 是精簡版，`-browser` 變體把 Chromium 烤進 image，省掉沙箱瀏覽器工具第一次跑時的 Playwright 安裝。穩定版會移動 `latest` 與 `main`，而 `extended-stable` 只由月末的 Gateway 發布移動。

換 image 升級時，新 Gateway 會在 ready 之前跑完啟動期的遷移與 plugin 收斂；如果修不安全，它會直接結束而不是回報健康——所以看到容器反覆重啟，先保住掛載的 state volume，再用同一個 image 跑一次 `openclaw doctor --fix`，而不是刪掉重來。

Podman 是無 root 的替代方案，架構上容器跑在 Podman、host 上的 `openclaw` CLI 當控制平面；macOS 上因為 Podman 跑在 VM 裡，瀏覽器存取可能要對 VM 開 SSH tunnel。

## Nix：買到可重現，賣掉可寫入

Nix 這條路走的是第一方的 [nix-openclaw](https://github.com/openclaw/nix-openclaw) Home Manager module，好處很直接：版本全鎖、launchd service 撐過重開機、`home-manager switch --rollback` 就回去了。

但 Nix mode（`OPENCLAW_NIX_MODE=1`，nix-openclaw 會自動設）的代價要先知道：**`openclaw.json` 變成唯讀**。所有會寫設定的路徑都會被拒絕——setup、onboarding、會改東西的 `openclaw update`、plugin 的安裝/更新/移除/啟用、`doctor --fix`、`doctor --generate-gateway-token`、`openclaw config set` 全部不行，UI 會顯示唯讀橫幅。要改設定就去改 Nix source。自動安裝與自我更新流程也一併關掉。

這不是缺陷，是它承諾「可重現」的必然結果。但如果你習慣用 `doctor --fix` 修東西，這條路會很不習慣。

## 更新：channel 決定的不只是版本

`openclaw update` 會自己偵測安裝型態（npm、pnpm、Bun 或 git）、抓新版、跑 `doctor`、重啟 gateway。它沒有 `--verbose`，要診斷用 `--dry-run` 預覽、`--json` 拿結構化結果。

channel 之間的語意差異值得留意：

- `beta` 走 beta dist-tag，但**當 beta tag 不存在或比 stable 舊時會退回 stable**。想要「就是要那個 beta 版」用 `--tag beta`
- `extended-stable` 是 package-only，而且**失敗時是 fail closed**——registry 資料缺漏或不一致就直接失敗，不會偷偷退回 `latest`
- `dev` 給你一個會持續移動的 GitHub `main` checkout

比較少人知道的是：**channel 也是切換安裝型態的方式**。`openclaw update --channel dev` 會把 npm 套件安裝換成可編輯的 git checkout，`--channel stable` 換回去，而 `~/.openclaw` 裡的 state、設定、憑證、workspace 都保留。先用 `--dry-run` 看一次再切。

## 驗證與遷移

裝完不管用哪種方式，都跑這三行：

```bash
openclaw --version      # CLI 可用
openclaw doctor         # 設定沒問題
openclaw gateway status # Gateway 在跑
```

遷移到新機器時，**要搬的是整個 `~/.openclaw` 目錄**，不是只有 `openclaw.json`。裡面有 API key、OAuth token、session 歷史、頻道連線狀態，所以搬運時檔案權限和傳輸加密都要顧。

Raspberry Pi 是可行的，因為模型推論在雲端、Pi 只跑 Gateway；實務上影響最大的是用 USB SSD 而不是 SD 卡。低功耗機器與 ARM 主機的啟動調校（`NODE_COMPILE_CACHE`、systemd restart policy）下一篇會一起講。

## 整體來說

六種安裝方式其實是三種取捨的組合：**要不要動系統層**（installer vs 本地 prefix vs 容器）、**要不要可重現**（Nix vs 其他）、**要不要跑最新程式碼**（原始碼／`dev` channel vs 發布版）。指令會變，這三條軸不會。

真正的坑則集中在一個地方：套件管理器對 lifecycle script 的政策，最近一年剛好在變。如果你的安裝在 npm 或 pnpm 這步停下來，先回頭看上面那兩條，不要急著換方式。

下一篇講雲端部署。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。**修掉三處照做會失敗的指令**：npm 全域安裝需要 `--allow-scripts=openclaw`（npm 12 起預設封鎖 lifecycle script）、pnpm 要改用 `pnpm add -g --allow-build=openclaw`（`approve-builds -g` 不支援全域安裝）、Node 需求從「24 或 22.14+」更新為「22.22.3+／24.15+／25.9+，建議 26」。同時改寫體裁：逐項安裝指令交還給官方文件，本篇改為選型取捨與失敗點；新增本地 prefix installer、Docker image 變體與升級行為、`extended-stable`／`dev` channel 語意、Nix mode 的唯讀代價。Bun 從「不適合正式環境」修正為「可作為安裝途徑，但執行仍需 Node runtime」。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Install](https://docs.openclaw.ai/install/) — 安裝總覽、系統需求、各套件管理器的 lifecycle script 政策
- [Getting Started](https://docs.openclaw.ai/start/getting-started) — 快速上手
- [Docker](https://docs.openclaw.ai/install/docker) — 容器化部署、image 變體與升級行為
- [Nix](https://docs.openclaw.ai/install/nix) — 宣告式安裝與 Nix mode 的行為變化
- [Updating](https://docs.openclaw.ai/install/updating) — 更新、channel 語意與安裝型態切換
- [Linux server](https://docs.openclaw.ai/vps) — 低功耗主機的啟動調校

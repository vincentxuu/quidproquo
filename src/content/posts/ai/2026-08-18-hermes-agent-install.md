---
title: "Hermes Agent 安裝與升級：先看支援層級，再決定用哪條路裝"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, installation, windows, termux, upgrade, nous-research]
lang: zh-TW
series:
  name: "Hermes Agent 文件導讀"
  order: 2
tldr: "Hermes 的安裝方式分成三個支援層級：macOS(Apple Silicon)／Windows 10-11／Linux-WSL2／Docker 是 Tier 1，Termux 與 Nix 是 Tier 2，而 pip、brew、AUR 與 Intel Mac 明確不支援——用不支援的路裝，修 bug 的 PR 官方不收。升級端 `hermes update` 會先做快照、pull 後編譯九個關鍵檔案驗語法，失敗自動 `git reset --hard` 回滾。"
description: "Hermes Agent 的安裝與升級實務：支援層級矩陣、per-user 與 root 兩種安裝佈局、原生 Windows 的檔案鎖與防毒誤判、Termux 的窄化套件、非 sudo 服務帳號安裝，以及 update 的快照、自動回滾與斷線保護。"
draft: false
---

系列第 2 篇。[導讀在這裡](/posts/ai/2026-08-18-hermes-agent-intro)。

安裝這種東西通常不值得寫一整篇，Hermes 值得，因為它的「怎麼裝」直接決定「壞掉時官方理不理你」。官方的 [Platform Support](https://hermes-agent.nousresearch.com/docs/getting-started/platform-support) 把支援層級寫得很白，這是選路的第一份文件，不是最後一份。

## 先看支援層級，再挑指令

| 層級 | 平台 | 官方承諾 |
|---|---|---|
| **Tier 1** | macOS（Apple Silicon）、Windows 10/11（x86_64、aarch64）、Linux／WSL2（x86_64、aarch64）、Docker container | 「盡力永不弄壞安裝與升級」，回歸問題最優先處理 |
| **Tier 2** | Android（Termux, aarch64）、Nix（macOS／Linux／NixOS） | in-tree best effort，會壞、修不修不保證 |
| **不支援** | AUR、**macOS on Intel**、**pypi（`pip install` / `uv tool install`）**、**brew** | 「修它的 PR 不會被接受」，相容碼隨時可能移除 |

三件事值得單獨拉出來說：

1. **`pip install hermes-agent` 不是安裝方式。** 這跟大部分 Python 專案的直覺相反。裝法只有官方 installer（或 Docker、或 Desktop 安裝檔）。
2. **Intel Mac 已經被劃到不支援。** 這對還在用 x86 Mac 當家用伺服器的人是硬傷。
3. **Nix 從支援路徑降級成 best effort**，官方自己在文件裡寫「Breaks often due to node.js packaging woes. Best of luck~!」。Nix 使用者仍有 flake 與 NixOS module 可用，只是不要期待官方保固。

Docker 還有一條額外限制：**Docker 安裝不支援 `hermes update`**，升級的方式是換一個 image 重跑。

## 兩條主線

命令列安裝（Linux／macOS／WSL2／Termux）：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

原生 Windows（PowerShell，不需要 WSL）：

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

想要圖形介面的，macOS 與 Windows 可以直接下載 Hermes Desktop 安裝檔，官方把它列為 recommended；反過來，先裝了 CLI 之後再補一個 `hermes desktop` 也會把桌面版拉起來。

安裝腳本會自己補齊 uv、Python 3.11、Node.js v22、ripgrep、ffmpeg。你只要先有 `git`；Linux 上另外要 `curl` 與 `xz-utils`（Node.js 是 `.tar.xz` 下載的），桌面版還要 `g++`／`build-essential` 編原生模組。

## 裝到哪裡：per-user 與 root 佈局不同

這點在多人機器上很關鍵：

| 安裝方式 | 程式碼 | `hermes` 執行檔 | 資料目錄 |
|---|---|---|---|
| Per-user（一般 installer） | `~/.hermes/hermes-agent/` | `~/.local/bin/hermes`（symlink） | `~/.hermes/` |
| Root（`sudo curl … \| sudo bash`） | `/usr/local/lib/hermes-agent/` | `/usr/local/bin/hermes` | `/root/.hermes/` 或 `$HERMES_HOME` |

root 模式走 FHS 佈局，適合「一份系統安裝服務所有使用者」；但**每個使用者的 auth、skills、sessions 仍各自在自己的 `~/.hermes/`（或指定的 `HERMES_HOME`）**。這是常見誤解來源：系統裝一次，設定還是要一人一份。

## 非 sudo 服務帳號：唯一真正需要 root 的是 Playwright

想用一個沒有 sudo 的 `hermes` 系統帳號跑 gateway 是官方支援的路徑。安裝路徑上唯一真的需要 root 的是 Playwright 的 `--with-deps`（它會 `apt` 裝 `libnss3`、`libxkbcommon` 這類 Chromium 依賴），installer 偵測不到 sudo 時會降級：把 Chromium 裝進該帳號自己的 Playwright cache，並印出管理員要另外跑的指令。

拆法是：管理員先跑一次 `sudo npx playwright install-deps chromium`，服務帳號再跑一般 installer。完全不需要瀏覽器自動化的話，直接 `bash -s -- --skip-browser` 跳過。

兩個會咬人的細節：

- **PATH**：服務帳號的 PATH 常常沒有 `~/.local/bin`。裝完 `hermes: command not found` 多半是這個。
- **開機不啟動**：user-level service 登出就停、開機不起，要 `sudo loginctl enable-linger <service-user>`。

還有一個症狀值得記：`ModuleNotFoundError: No module named 'dotenv'` 幾乎一定是你用系統 Python 去跑 repo 裡的 `hermes` 原始檔，而不是 venv 裡的啟動器。

## 原生 Windows 的三個特有問題

**其一，Git Bash 是自帶的。** 安裝器會把 MinGit 解到 `%LOCALAPPDATA%\hermes\git`（約 45MB，不需要管理員權限，跟系統 Git 完全隔離），Hermes 用它跑 shell 指令。已經有 Git 的話會偵測並沿用。

**其二，防毒會誤判 `uv.exe`。** 官方文件直接把這件事寫成 troubleshooting 條目：Bitdefender／Windows Defender 會把 `%LOCALAPPDATA%\hermes\bin\uv.exe` 隔離，這是 false positive——那是 Astral 的 uv，ML 型防毒引擎普遍會標記「未簽章、又會下載安裝套件」的 Rust 執行檔。官方給的驗證法是用 `gh attestation verify` 比對 Astral release 的 attestation 與檔案雜湊，白名單要加**資料夾**而不是檔案雜湊（uv 每次更新雜湊就變）。

**其三，升級會被執行中的行程擋下。** Windows 不允許覆寫執行中的 `.exe`，所以 `hermes update` 偵測到另一個 `hermes.exe`（Desktop 的後端、開著的 REPL、跑著的 gateway）就會直接拒絕，要你先關掉。`--force` 只跳過第一層檢查；第二層——「有行程正在用這個 venv 的 Python 直譯器」——連 `--force` 都不理，因為那些行程鎖著 `.pyd`，中途失敗會讓安裝卡在版本之間，要跳過得用 `--force-venv`。

Windows 的 venv 重建是交易式的：先把舊 venv 改名成 `venv.stale.*`，新的建好、依賴裝完、基線 import 通過才刪舊的；失敗則改名 `venv.failed.*` 並還原舊 venv。看到這兩個目錄殘留，代表有行程還握著檔案 handle。

## Termux：刻意窄化的版本

手機上的 Hermes 不是完整版，而是一個叫 `.[termux]` 的策展套件（`python -m pip install -e '.[termux]' -c constraints-termux.txt`）。測過的範圍是 CLI、cron、PTY／背景終端、Telegram gateway（best effort）、MCP、Honcho memory、ACP。

沒有的東西要先知道：

- `.[all]` 在 Android 上裝不起來
- `voice` extra 掛在 `faster-whisper → ctranslate2`，後者沒有 Android wheel，所以本地語音轉文字沒有
- 瀏覽器／Playwright 自動 bootstrap 直接跳過
- **Termux 裡沒有 Docker 後端**，也就沒有容器隔離
- Android 會暫停背景工作，gateway 常駐是 best effort 不是託管服務

換句話說，手機版適合當「隨身 CLI agent」，不適合當常駐 gateway 主機。

## 升級：`hermes update` 做了六件事

```bash
hermes update
```

依官方文件，這一行背後是：

1. **前置快照**——預設 `quick` 模式，涵蓋配對資料、cron job、`config.yaml`、`.env`、`auth.json` 等執行期會變動的狀態檔；單檔超過 1 GiB 會跳過，免得 sessions DB 拖垮升級。
2. **git pull**（`main` 分支，含 submodule）
3. **語法驗證 + 自動回滾**——pull 完編譯每次啟動都會 import 的九個關鍵檔案，任何一個 parse 失敗就 `git reset --hard <pre-pull-sha>` 退回去，確保你的 shell 還開得起來。
4. **依賴安裝**（`uv pip install -e ".[all]"`）
5. **設定遷移**——偵測新增的設定項並互動式問你
6. **Gateway 自動重啟**——systemd／launchd 託管的走服務管理器重啟，手動起的會在能對回 profile 時自動重拉

三個實用旗標：`--check` 只比對落後多少不動檔案（適合排程判斷「有沒有更新」）、`--backup` 做完整 `HERMES_HOME` 壓縮備份（對應 `updates.pre_update_backup: full`）、`--branch <name>` 追非預設分支（會自動 stash、切 HEAD、必要時從 `origin/<name>` 建立本地分支；分支不存在會乾淨失敗並還原你的 stash）。

非互動情境（桌面 App 的更新鈕、gateway 觸發的更新）沒有人可以回答「要不要還原你的本機修改」，行為由 `updates.non_interactive_local_changes` 決定：`stash`（預設，自動還原）或 `discard`（丟掉）。`discard` 是 stash-drop 而非 `git reset --hard` + `git clean -fd`，所以 `node_modules`、`venv`、build 產物不會被清掉。

還有一個容易被忽略的體貼設計：**update 會忽略 `SIGHUP`**，SSH 斷線不會把升級砍在半路，全部輸出鏡射到 `~/.hermes/logs/update.log`。以前那套「一定要包在 tmux 裡跑升級」的習慣可以退休了。`Ctrl-C` 與 SIGTERM 仍然照收，因為那是刻意取消。

升級完官方建議的驗證順序：`git status --short` → `hermes doctor` → `hermes --version` → （有用 gateway 的話）`hermes gateway status`。工作樹莫名變髒就停下來看，通常是本機修改被重新套回去了。

## 回滾與搬家是兩回事

回滾是 git 操作：`git log --oneline -10` 找 commit 或 `git tag --sort=-version:refname` 找 tag，`git checkout` 之後重跑 `uv pip install -e ".[all]"`，再 `hermes gateway restart`。回滾後務必跑 `hermes config check`——新版加過的設定項在舊版會變成無法辨識的鍵。

搬家則是另一組指令，而且差別很要命：

- `hermes backup` / `hermes import`：完整 `~/.hermes`，**含憑證**
- `hermes profile export`：單一 profile，**設計上排除憑證**

所以「我用 profile export 備份過了」不成立——那不是完整備份。

## 這篇的立場

安裝這章唯一值得記住的判斷是：**先確認你的平台在哪一層，再決定要不要投入**。Intel Mac、pip 安裝、AUR 這三條路現在都是死路，而 Termux 與 Nix 是「能動但別依賴」。至於指令旗標，會變，需要精確清單時看 [CLI Commands Reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)。

下一篇談[模型供應商與 routing／fallback／金鑰池](/posts/ai/2026-08-18-hermes-agent-providers)。

## 參考資料

- [Hermes Agent — Installation](https://hermes-agent.nousresearch.com/docs/getting-started/installation)
- [Hermes Agent — Platform Support](https://hermes-agent.nousresearch.com/docs/getting-started/platform-support)
- [Hermes Agent — CLI Commands Reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)
- [Hermes Agent GitHub](https://github.com/NousResearch/hermes-agent)
- [astral-sh/uv — 防毒誤判的上游討論](https://github.com/astral-sh/uv/issues/13553)
- [Playwright — install-deps](https://playwright.dev/docs/cli)

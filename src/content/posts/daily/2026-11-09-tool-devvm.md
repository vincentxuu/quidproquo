---
title: "工具推薦｜devvm — 讓密鑰留在主機，VM 連真值都拿不到"
date: 2026-11-09
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源 CLI devvm 幫每個專案開一台隔離 VM，讓 Claude Code、Codex 等 coding agent 在裡面跑：預設只能連網路白名單、GitHub token 等密鑰永遠留在主機，由 proxy 代換，VM 本身拿不到真值"
tldr: "devvm 是一個 MIT 授權的開源 CLI，幫每個專案開一台隔離 VM 讓 coding agent 在裡面跑。安裝：brew install devvmhq/tap/devvm 或官方 install script。解決了 agent 在主機上直接跑時可能碰到 GitHub token、.ssh、.aws 等密鑰和檔案的問題——VM 預設只能連白名單上的主機，密鑰只在主機端的 proxy 裡換進請求，VM 本身從沒拿到真值。"
series:
  name: "AI Tool of the Day"
  order: 76
---

> 🌏 [English version](/posts/daily/2026-11-09-tool-devvm-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | devvm |
| 類型 | CLI |
| GitHub | [devvmhq/devvm](https://github.com/devvmhq/devvm) |
| Stars | 400（撰文時，上線 3 天） |
| 語言 | Go |
| 授權 | MIT |
| 安裝 | `curl -fsSL https://github.com/devvmhq/devvm/releases/latest/download/install.sh \| bash` |

## 解決什麼問題

讓 coding agent 直接在自己機器上跑，它看得到的不只是專案資料夾：`.ssh`、`.aws`、瀏覽器 cookie、公司內網服務，還有你在終端機裡貼過的任何 token，agent 技術上都碰得到。很多人現在的解法是裝個 Docker container，但 container 跟主機共用同一個 kernel，一旦有指令能逃出 kernel 層，隔離就沒了——這不是假設出來的風險：PWN Research 2026-11-07 公開的一篇文章就示範了從 Firecracker microVM 逃出、在主機上拿到 root 權限執行程式碼。

devvm 换一個隔離層級：每個專案資料夾對應一台真正的虛擬機（靠 [Lima](https://lima-vm.io/) 跑在 QEMU 上，不是 container），VM 只掛這一個專案資料夾，預設網路走「allowlist」，只能連你明確放行的主機。GitHub token、Claude Code 的登入憑證這類密鑰完全不會進到 VM 裡——VM 拿到的是一個佔位字串，真正的值由主機上的一支 proxy 在轉送請求時才換進去；VM 自己要是想繞過 proxy 直接連出去，帶出去的也只會是那個佔位字串，對方伺服器一樣會拒絕。Claude Code、Codex、opencode、pi 這些 coding agent 也裝在 VM 自己的一份設定裡，不會動到主機上原本的安裝。

```diagram
title: devvm 把密鑰留在主機，VM 只拿佔位字串
desc: coding agent 在 VM 裡發出的請求，由主機上的 proxy 依 allowlist 換入真的密鑰，VM 本身連密鑰真值都沒拿到
---
<svg viewBox="0 0 700 380">
  <rect class="dg-zone" x="20" y="40" width="172" height="160" rx="8"/>
  <text class="dg-tag" x="36" y="62" dominant-baseline="central">VM（沙箱）</text>

  <rect class="dg-zone dg-zone--solid" x="300" y="40" width="200" height="160" rx="8"/>
  <text class="dg-tag" x="316" y="62" dominant-baseline="central">這台機器</text>

  <path class="dg-line" d="M180 148H320" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--link" d="M480 136H512Q520 136 520 128V94Q520 86 528 86H560" marker-end="url(#arrow-link)"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M480 160H512Q520 160 520 168V240Q520 248 528 248H550" marker-end="url(#arrow-warn)"/>

  <rect class="dg-box" x="40" y="120" width="140" height="56" rx="6"/>
  <text class="dg-label" x="110" y="148" text-anchor="middle" dominant-baseline="central">Coding Agent</text>

  <rect class="dg-box dg-box--accent" x="320" y="112" width="160" height="72" rx="6"/>
  <text class="dg-label" x="400" y="139" text-anchor="middle" dominant-baseline="central">devvm Proxy</text>
  <text class="dg-sub" x="400" y="159" text-anchor="middle" dominant-baseline="central">密鑰留在這台機器</text>

  <rect class="dg-box dg-box--link" x="560" y="56" width="120" height="60" rx="6"/>
  <text class="dg-label" x="620" y="77" text-anchor="middle" dominant-baseline="central">允許的主機</text>
  <text class="dg-sub" x="620" y="97" text-anchor="middle" dominant-baseline="central">github 等</text>

  <rect class="dg-box dg-box--warn" x="550" y="240" width="140" height="56" rx="6"/>
  <text class="dg-label" x="620" y="268" text-anchor="middle" dominant-baseline="central">未放行的主機</text>

  <text class="dg-edge" x="250" y="136" text-anchor="middle" dominant-baseline="central">佔位 token</text>
  <text class="dg-edge dg-text--link" x="520" y="104" text-anchor="middle" dominant-baseline="central">換真 token</text>
  <text class="dg-edge dg-text--warn" x="520" y="208" text-anchor="middle" dominant-baseline="central">403 拒絕</text>

  <line class="dg-rule" x1="20" y1="320" x2="680" y2="320"/>
  <text class="dg-tag" x="20" y="344" dominant-baseline="central">圖例</text>
  <rect class="dg-box dg-box--accent" x="76" y="336" width="16" height="16" rx="3"/>
  <text class="dg-small" x="100" y="344" dominant-baseline="central">持有密鑰的 proxy</text>
  <rect class="dg-box dg-box--link" x="260" y="336" width="16" height="16" rx="3"/>
  <text class="dg-small" x="284" y="344" dominant-baseline="central">放行的外部主機</text>
  <rect class="dg-box dg-box--warn" x="440" y="336" width="16" height="16" rx="3"/>
  <text class="dg-small" x="464" y="344" dominant-baseline="central">被擋的主機</text>
</svg>
```

適合場景：想讓 agent 自主跑得比較久、會動到檔案系統或裝套件，又不想每次都重新評估「這次會不會動到我不該給它看的東西」；不想在主機上同時裝好幾個 coding agent 的設定互相打架；想要「VM 跟我的編輯器共享同一份檔案」而不是每次都要先 commit、push 才能看到結果。不適合：只是臨時跑一次 shell command、不需要多次互動的場景（開 VM 有秒級的啟動成本）；也不適合 Windows 使用者——官方測試目前只到 macOS（Apple Silicon）與 Linux（arm64／x86_64）。

## 快速上手

### 安裝

```bash
# macOS（連同 Lima 一起裝）
brew trust --formula devvmhq/tap/devvm
brew install devvmhq/tap/devvm

# Linux（也可在 macOS 用，會先問要不要裝 Lima、QEMU、/dev/kvm 存取權）
curl -fsSL https://github.com/devvmhq/devvm/releases/latest/download/install.sh | bash

# 裝完先健檢，看環境缺什麼
devvm doctor
```

### 基本用法

```bash
cd ~/some-project
devvm
# 第一次執行會問這台 VM 要多大、裝哪些工具鏈、選哪個 network tier（預設 allowlist）
# 選完就直接進 VM 的 shell，提示字會變成 (devvm)
(devvm) $ claude
```

### 進階用法

```bash
# 不想讓 agent 直接碰你本機的工作目錄，改用 VM 自己的一份 clone
devvm --clone

# agent 跑完後，在主機上把 VM 裡的分支抓回來審查，再決定要不要合併
git fetch devvm
git log -p main..devvm/main

# VM 連到允許清單外的主機會被 403，用這支指令看最近被擋了什麼
devvm network log --blocked
```

## 與現有工具的比較

| | devvm | Docker container 沙箱 | 直接在主機上跑 |
|---|---|---|---|
| 隔離層級 | VM（獨立 kernel） | container（共用主機 kernel） | 無 |
| 密鑰是否進沙箱 | ❌ 只拿佔位字串，真值留在主機 proxy | 通常整組環境變數／mount 都進去 | — |
| 預設網路 | allowlist，只能連你放行的主機 | 看 docker 設定，常跟主機同網段 | 跟主機完全一樣 |
| 多個 coding agent 設定互相隔離 | ✅ 每台 VM 自己一份 | 需自己管理 volume | ❌ 全部疊在一起 |
| 安裝門檻 | 一行安裝 script，`devvm doctor` 健檢 | 需熟悉 Dockerfile／volume／network 設定 | 無 |

## 注意事項

- **目前只測過 macOS（Apple Silicon）與 Linux（arm64／x86_64）**：README 明寫 Intel Mac「尚未支援」，完全沒提到 Windows，Windows 使用者目前不在支援範圍內。
- **VM 比 container 重**：第一顆 VM 要花幾分鐘建基底映像，需要 8GB 可用磁碟空間，官方建議機器至少 8GB 記憶體、4 顆 CPU，資源消耗比單純開一個 container 多。
- **allowlist 只放行 devvm 內建知道的工具鏈來源**：第一次連到合法但沒內建規則的服務（例如公司內部的私有 registry）會被 403，要自己跑 `devvm network allow` 補規則，不是裝完就什麼都能連。

## 今日收穫

過去這一年「agent 安全性」的討論大多停在「要不要裝 sandbox」，但 2026-11-07 那篇 Firecracker 逃逸的研究提醒我們：連 microVM 級的隔離都不是絕對保證。devvm 的做法比較實際——它沒有宣稱自己「絕對打不穿」，而是把密鑰這種「一旦漏出去就回不去」的東西直接架構性地排除在 VM 之外，連真正的 token 字串都沒進去過；就算 VM 真的被攻破，能偷到的也只是一個佔位字串。這是「縮小爆炸半徑」而不是「假設絕對安全」的設計思路，對任何想讓 agent 自主跑比較久的場景都值得借鏡。

## 參考資料

- [devvmhq/devvm — GitHub](https://github.com/devvmhq/devvm)
- [devvm 文件：Installing](https://devvm.dev/docs/getting-started/install/)
- [devvm 文件：Network tiers](https://devvm.dev/docs/safety/network/)
- [devvm README](https://github.com/devvmhq/devvm#readme)
- [Agent Tools Today, 7 Nov 2026（devvm 當日上榜的報導）](https://munderdiffl.in/blog/agent-tools-today-2026-11-07/)
- [PWN Research：Firecracker escape（文中引用的 microVM 逃逸研究）](https://pwn.ai/blog/firecracker-escape)
- [LICENSE（MIT）](https://github.com/devvmhq/devvm/blob/main/LICENSE)

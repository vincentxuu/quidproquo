---
title: "Claude Code 裝不起來、登不進去怎麼排：PATH、安裝來源、proxy、OAuth callback"
date: 2026-08-26
type: guide
category: tech
tags: [claude-code, troubleshooting, installation, oauth, cli]
lang: zh-TW
tldr: "安裝與登入問題照五步排：PATH 檢查（echo $PATH | tr ':' '\\n'）、確認只有一份安裝（which -a claude）、網路連 downloads.claude.ai 測 200、OAuth callback 失敗改用 claude auth login 貼 code，最後 claude doctor 收尾。"
description: "Claude Code 安裝與登入疑難排解指南：command not found 的 PATH 診斷、native 與 npm 安裝差異、公司 proxy 設定、OAuth 登入失敗的復原步驟，以及版本管理與升級。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 33
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install-en)

這是「Claude Code 深入介紹」系列的 troubleshooting 第一篇。裝不起來或登不進去的時候，錯誤訊息通常只告訴你「失敗」，沒告訴你是哪一層失敗——是 shell 找不到執行檔、網路被擋、還是認證壞了。這篇按官方 [troubleshoot-install](https://code.claude.com/docs/en/troubleshoot-install) 文件的診斷順序，把每一層的檢查指令、預期輸出和修法列出來。已經能跑、但執行期出狀況的，去看[第二篇：執行期問題](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime)。

## 第一步：command not found，先驗 PATH

症狀：`zsh: command not found: claude`（macOS）或 `'claude' is not recognized`（Windows）。這代表安裝本身可能成功了，只是你的 shell 在 PATH 列出的目錄裡找不到 `claude`。

先確認安裝目錄有沒有進 PATH：

```bash
echo $PATH | tr ':' '\n' | grep -Fx "$HOME/.local/bin"
```

印出 `/Users/you/.local/bin` 就代表 PATH 正常；沒有任何輸出，就是它不在 PATH 裡。native 安裝器把 `claude` 放在 `~/.local/bin/claude`，macOS 預設的 zsh 加進去：

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
claude --version
```

最後一行應該印出版本號，例如 `2.1.211 (Claude Code)`——這是每一步修完後的統一驗證方式。常見錯誤：裝完不開新終端機就重試，目前這個 session 還拿著舊 PATH；開個新視窗就好。

另外注意：VS Code 擴充套件**不會**把 `claude` 放進 PATH，它內建自己的私有 CLI 複本給聊天面板用。只裝過擴充套件的人，`~/.local/bin/claude` 根本不存在，要另外跑 standalone 安裝。

## 第二步：檢查是不是裝了好幾份

多份安裝共存會造成版本錯亂——你以為在跑新版，實際執行的卻是舊的。三個可能的位置都查一遍：

```bash
which -a claude
ls -la ~/.local/bin/claude      # native 安裝，應是指向 versions/ 的 symlink
ls -la ~/.claude/local/          # 舊版的 local npm 安裝殘留
npm -g ls @anthropic-ai/claude-code 2>/dev/null   # npm 全域安裝
```

預期輸出：`which -a claude` 只列一個路徑；`ls` 打出 `No such file or directory` 不是錯誤，代表那個位置本來就沒東西。如果查出多份，官方建議保留 native 安裝，其他清掉：

```bash
npm uninstall -g @anthropic-ai/claude-code
rm -rf ~/.claude/local
brew uninstall --cask claude-code   # 有裝 Homebrew 版才需要
```

## 第三步：安裝方式差異造成的問題

native 安裝器和 npm 裝的其實是**同一顆原生二進位檔**，npm 只是透過 per-platform optional dependency 把它拉下來、再由 postinstall 歸位。所以 npm 版有一組獨有的故障模式：

- `Error: claude native binary not installed`：postinstall 沒跑（`--ignore-scripts` 或某些 pnpm 設定），或 optional dependency 沒下載（`--omit=optional`、`.npmrc` 設了 `optional=false`）。按錯誤訊息指示手動跑 `node node_modules/@anthropic-ai/claude-code/install.cjs`，或去掉那些旗標重裝。
- `npm error code ENOTEMPTY`：更新時舊套件目錄沒清乾淨，把錯誤訊息指到的 `@anthropic-ai/claude-code` 目錄刪掉再裝一次。
- 公司內部 npm mirror 沒同步那八個 platform 套件：mirror 要補齊才裝得起來。

Homebrew 版則有自己的節奏：cask 索引太舊會報 `No Cask with this name exists`，先 `brew update` 再裝；而且 Homebrew 不自動更新，要定期 `brew upgrade claude-code`。低記憶體 Linux 主機上安裝被 `Killed`（exit code 137），是 OOM killer 動手——安裝約需 512 MB 自由記憶體，加個 swap 或清記憶體後重試。

## 第四步：網路與 proxy

安裝器從 `downloads.claude.ai` 下載，先測連不連得到：

```bash
curl -sI https://downloads.claude.ai/claude-code-releases/latest
```

第一行是 `HTTP/2 200` 就通了。`403` 通常是 proxy 或網路過濾擋了這個 host（也可能是不支援的地區）；`5xx` 多半是暫時性服務問題；完全沒輸出或 `Could not resolve host` 就是網路擋住連線。公司內網要在裝之前設好 proxy：

```bash
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
curl -fsSL https://claude.ai/install.sh | bash
```

做 TLS 檢查的公司 proxy 會造成 `TLS connect error` 或 `unable to get local issuer certificate`——請 IT 給公司 CA 憑證檔，安裝時用 `curl --cacert /path/to/corporate-ca.pem`，裝好之後 Claude Code 本身再設 `NODE_EXTRA_CA_CERTS` 指向同一份憑證。

## 第五步：登入問題

登入流程是：跑 `claude` → 開瀏覽器完成 OAuth → redirect 回本地的 callback server。斷點通常在 callback 送不回來：

- **瀏覽器沒自動開**：在登入提示按 `c` 把 OAuth URL 複製到剪貼簿，自己貼到瀏覽器。
- **WSL2、SSH、container**：瀏覽器開在另一台機器，redirect 回不到本地 callback，瀏覽器會顯示一組 login code——把它貼回終端機的 `Paste code here if prompted` 提示。如果貼了沒反應（終端機貼上快捷鍵沒送進輸入框），改用 `claude auth login`，它從標準輸入讀貼上的 code：
  ```bash
  claude auth login
  ```
- **`OAuth error: Invalid code`**：code 過期或複製時被截斷，按 Enter 重試，這次動作快一點。
- **登入成功卻一直 `403 Forbidden`**：Pro/Max 先到 claude.ai/settings 確認訂閱有效；Console 帳號要確認有成員角色；公司 proxy 也可能攔 API 請求。
- **明明有訂閱卻報 organization disabled**：九成是環境變數裡有舊的 `ANTHROPIC_API_KEY` 蓋過訂閱認證。`unset ANTHROPIC_API_KEY` 後重開，並從 `~/.zshrc` 之類的 profile 移掉那行 export，再用 session 內的 `/status` 確認目前生效的認證方式。

## 版本管理與升級

native 安裝會在背景自動更新：啟動時和執行中定期檢查，下載完下次啟動生效，最新結果可用 `claude doctor` 看。想控制節奏有兩個層級：

```json
{
  "autoUpdatesChannel": "stable",
  "minimumVersion": "2.1.100"
}
```

`stable` channel 通常落後 latest 約一週並跳過有重大回歸的版本；`minimumVersion` 是下限地板，防止 stable channel 把你降版。Homebrew／WinGet／Linux 套件管理器安裝不走背景更新，靠各自的 upgrade 指令手動升。要立刻升級不分渠道，跑 `claude update`。

自訂 launcher 的人注意：如果你把 `~/.local/bin/claude` 換成自己的 script 或 symlink，auto-update 會保留它不動、新版本照樣裝進 `versions/`，由你的 launcher 決定跑哪版；代價是磁碟上會累積所有已裝版本。

## 還是不通：交給 /doctor

以上都試過仍卡關，跑自動診斷：

- `claude --version` 能跑 → session 內用 `/doctor`，或終端機直接 `claude doctor`（唯讀檢查安裝健康度、settings.json 驗證錯誤和警告）。
- `claude --version` 都不行 → 回到第一步重驗 PATH，並到 [GitHub issues](https://github.com/anthropics/claude-code/issues) 搜錯誤訊息，附上作業系統、安裝指令和完整錯誤輸出開 issue。

設定類問題（settings 不生效、hooks 不觸發）不屬於這篇的範圍，等 H8 的[設定診斷](/posts/tech/deep-dive/2026-08-26-claude-code-debug-config)專文；執行期的效能問題看[下一篇](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime)。

系列其他篇：[系列入口：Claude Code 怎麼運作](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)、[.claude 目錄完全導覽](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory)。

## 參考資料

- [Troubleshoot installation and login — Claude Code Docs](https://code.claude.com/docs/en/troubleshoot-install) — 本篇主來源：PATH 診斷、衝突安裝、proxy、OAuth 登入復原的官方步驟
- [Advanced setup — Claude Code Docs](https://code.claude.com/docs/en/setup) — 安裝方式比較、release channels、auto-update 行為與系統需求
- [Troubleshooting — Claude Code Docs](https://code.claude.com/docs/en/troubleshooting) — 官方的問題路由頁，安裝頁與執行期頁的分工說明

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方 troubleshoot-install 與 setup 文件撰寫。

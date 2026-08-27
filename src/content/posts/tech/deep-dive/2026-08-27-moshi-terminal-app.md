---
title: "手機遙控 Claude Code 怎麼選：Moshi 的 SSH 直連終端機、moshi-hook 與定價"
date: 2026-08-27
type: deep-dive
category: tech
tags: [claude-code, mobile, terminal, ssh, remote-control, tmux]
lang: zh-TW
tldr: "Moshi 是一款 iOS/Android 終端機 app（另有免費的 Moshi Desktop 網頁版），透過 SSH/Mosh 直連你自己的機器遙控 Claude Code、Codex 等 coding agent；免費版就是完整終端機，Pro（$7.99/mo 起）解鎖 Mosh 斷線續傳、tmux 深度整合與 diff viewer。"
description: "介紹 Moshi：一款 local-first 的終端機 app（含手機版與免費的 Moshi Desktop 網頁版），透過 SSH/Mosh 直連自己的機器監控 Claude Code、Codex 等 AI coding agent，涵蓋架構設計、免費/Pro 差異、跟 Claude Code 官方 Remote Control 的比較與安全模型。"
draft: false
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-27-moshi-terminal-app-en)

在手機上遙控正在跑的 AI coding agent，現在至少有三種路子：Anthropic 自己出的 Claude Code Remote Control、開源的 relay 型 client（例如 Happy），還有像 [Moshi](https://getmoshi.app/) 這種「乾脆給你一個真的終端機」的做法。Moshi 是 2026 年初上線的 iOS/iPadOS/Android/macOS app，賣點不是聊天介面，而是透過 SSH、Mosh、ET 直接連進你自己控制的機器，開一個跟你在桌機上用的一模一樣的 shell。

## Moshi 是什麼：local-first 直連終端機

官方的比喻是「AI agent 的 baby monitor」——agent 在你自己的機器上跑，你不用守著，Moshi 負責在它需要你（approval、完成、卡住）時把你叫回來。這句話背後其實是一個明確的架構決定：**agent 本身從頭到尾都跑在你的機器上，Moshi 只是手機端的操作介面加通知層**，不會把你的 repo、程式碼或對話內容搬到廠商的雲端執行。

架構分兩層：

- **Moshi core（app 本身）**：純終端機功能，不需要在你的機器上裝任何東西——SSH/Mosh 連線、biometric 金鑰保護、語音輸入、agent 用量追蹤全靠 client 端加標準 SSH 就能動。
- **[`moshi-hook`](https://getmoshi.app/docs/hooks)（選用的 host 端 daemon）**：裝在你自己的機器上，把 Claude Code、Codex 等 agent 的 hook 事件正規化成統一的 inbox 事件，並開一個只綁定 `127.0.0.1:24543` 的本地 gateway，供 diff viewer、browser preview、multiplexer 偵測使用。「agent-aware」的那一層,全部是這個 daemon 在做。

官方在多篇比較文章反覆強調同一句話：**沒有 wrapper command，沒有 host daemon 取代你的 shell**。你在手機上開的還是平常那個 [tmux](https://getmoshi.app/docs/tmux) session，Moshi 只是換了個螢幕接上去。

## moshi-hook：把 agent 事件變成手機通知

`moshi-hook` 目前支援 11 種 agent 的 hooks 整合（Claude Code、Codex CLI、OpenCode、Antigravity、Cursor、Kimi、Qwen Code、Grok Build、Pi、Oh My Pi、Hermes），把它們的事件正規化成五類 inbox 卡片：`approval_required`（需要許可）、`task_complete`（一輪跑完）、`session_started`、`tool_running`、`tool_finished`。這份清單只有官方文檔一個來源,版本更新可能變動，如果你要接的 agent不在清單上,終端機仍能正常用,只是拿不到通知與 approval 卡片。

Chat View——把 agent session 直接渲染成手機原生對話 UI（工具卡片、approval 卡片、語音）——官方自己標為「experimental」，支援的 agent 名單比 hooks 名單更窄，需要即時的 host-gateway 連線才能用。

## Moshi Desktop：免費的大螢幕版控制台

除了手機 app，Moshi 另外推出了 [Moshi Desktop](https://getmoshi.app/desktop)——一個免費、給 macOS、Linux、Windows 用的大螢幕版控制台。它不是另一套要重新下載安裝的桌面軟體，而是**一個網頁 UI**：只要機器上已經裝了 `moshi-hook`，直接下 `moshi` 指令就會在瀏覽器開出 `http://127.0.0.1:24544`，因為 Desktop 跟手機 app 共用同一個 `moshi-hook` daemon 當底層。

架構上延續了 Moshi 一貫的做法：daemon 把底下的 Herdr / tmux session 包成一組結構化的 web API（workspace、transcript、即時 PTY、approval、dev server port），gateway 只綁定 loopback（`127.0.0.1`），連其他機器時走的是你自己的 SSH，不經過任何 relay 或中間伺服器。官方甚至特別點出 Desktop 比手機版更徹底地「零 relay」——手機版的推播、inbox、用量快照仍得經過 Moshi 的伺服器轉發（因為 APNs / Google push 規定只能從伺服器發送），但 Desktop 完全不需要這一段。

其他重點：

- **免費，沒有 Pro 限定**。官方原話是「大家買 app 的錢資助了這個，所以 Desktop 對所有人免費」。
- 終端機用 [xterm.js](https://xtermjs.org/) 搭 WebGL 渲染，官方刻意選網頁 UI 而非包一個 Electron app——「footprint 很小，以後真的值得包裝成獨立 app 的話，同一份程式碼可以直接拿去用」。
- Browser preview 在 Desktop 上一樣可用：agent 起的 dev server port 會自動偵測、顯示在 Web 分頁，點一下就在原地預覽，同樣透過你自己的 SSH 連線轉發。
- 原生支援 Windows 目前是實驗性功能，也可以直接跑在 WSL2 底下。

Desktop 讓 Moshi 的「local-first、沒有中間伺服器」主張變得更完整：手機版因為推播機制的限制沒辦法完全避開 Moshi 的伺服器，Desktop 版則是把這個唯一的例外也拿掉了。

## 跟 Claude Code 官方 Remote Control 的差異

Anthropic 自己的 [Remote Control](https://getmoshi.app/compare/anthropic-remote-control) 免費、第一方、隨 Claude 帳號就能用。Moshi 的官方比較頁把兩者的差異講得很直接：**Remote Control 延伸的是 Claude 這個對話；Moshi 延伸的是整台機器**。

| 面向 | Claude Code Remote Control | Moshi |
|---|---|---|
| 連線方式 | 透過 claude.ai/code 接續 Claude 對話 | SSH/Mosh 直連自己的機器，開真實 shell |
| 支援 agent | 只有 Claude | Claude Code、Codex、OpenCode、Grok、Cursor 等 |
| 持續性模式 | Claude 對話本身的延續 | tmux/Zellij/Herdr session，agent 只是裡面跑的一個行程 |
| 價格 | 免費 | 免費版陽春夠用，深度功能要 Pro |

差異在一輪對話結束後最明顯：用 Remote Control，agent 還是體驗的中心；用 Moshi，你本來就已經「人在機器上」——可以直接看 log、重啟 server、跑被跳過的測試、開另一個 repo，或把同一個問題丟給另一個 agent，不用換遙控工具。如果你的答案永遠是「只用 Claude」，Remote Control 的聚焦是優勢；如果答案要看專案而定，Moshi 的跨廠商層才是重點。

## 免費版夠不夠用：Session、已存連線與 Pro 解鎖了什麼

Moshi 的免費版不是閹割版誘餌——無限並行 session、完整 SSH（含 key/密碼/jump host）、biometric 金鑰保護、agent 用量追蹤全部在免費層。這裡有兩個容易搞混的概念：

- **Session 數量**：你現在開著的終端機視窗，可以同時開很多個，免費版就是無限。
- **已存連線數**：存起來的主機設定檔（host、port、帳號、認證方式），免費版最多 2 筆，Pro 才無限。只用一台自己的機器完全用不到這個限制；同時管 Mac + VPS + 朋友的機器，第三台就要升級。

Pro（$7.99/mo、$69.99/yr、或 $199 一次買斷，2026-08 查證，訂閱定價可能調整）解鎖的東西集中在「重度使用才會撞到的牆」：

| 功能 | Free | Pro |
|---|---|---|
| Mosh 傳輸（弱網/切換網路/鎖螢幕不斷線） | ❌ | ✅ |
| tmux/Zellij/Herdr 深度整合 | ❌ | ✅ |
| Diff viewer、Browser preview | ❌ | ✅ |
| Image paste | ❌ | ✅ |
| Inbox 動作 | 前 5 次試用 | 無限 |
| Cloud 語音辨識額度 | 3 分鐘/月 | 60 分鐘/月 |

官方自己的說法也很坦白：偶爾連進去打一兩個指令，免費版夠用；真的想把手機當日常 coding agent 監控台，Pro 才有意義。

## 安全性設計：什麼留在本機、什麼上到 Moshi 伺服器

Moshi 的[隱私政策](https://getmoshi.app/privacy)與 `moshi-hook` 文檔對資料流向給出可查證的具體邊界，而不是空泛的「我們重視隱私」：

- SSH private key 存在 iOS Keychain，Face ID / Touch ID 保護，複製私鑰需要二次生物辨識確認。
- **留在本地或直連通道**：完整的 Claude Code / Codex transcript、diff 內容、原始碼、實際終端機流量——這些都透過 SSH 轉發的本地 gateway 在手機和主機之間直接傳輸，不經過 Moshi 的伺服器。
- **會送到 Moshi 伺服器的**：只有通知摘要——prompt 前 200 字、assistant 回應前 80 字、approval 指令前 256 字，加上 project 名稱、session ID、agent、model 等 metadata。也就是你在推播通知或 inbox 卡片上看到的內容,不會更多。
- 語音輸入有個例外要注意：本機 Whisper 或 Apple 內建引擎完全 on-device、無配額；但如果你選 cloud 語音，音訊會送到 OpenAI 做轉錄（免費版 3 分鐘/月、Pro 60 分鐘/月）——這是隱私政策裡唯一「內容」會離開裝置的路徑。

## 快速上手

1. 手機端：App Store 或 Google Play 下載 Moshi，免費、不用註冊。
2. 電腦端（要遙控的那台機器）：
   ```bash
   # macOS
   brew tap rjyo/moshi
   brew trust rjyo/moshi
   brew install moshi-hook
   brew install mosh tmux

   # Linux / WSL
   curl -fsSL https://getmoshi.app/install.sh | sh
   sudo apt install mosh tmux
   ```
3. 配對：電腦上跑 `moshi-hook host setup` 印出 QR code，手機 app 用 Easy Pair 掃描。
4. 用 tmux 當長駐工作區：`moshi ~/projects/你的專案`，session 名稱取自資料夾名，在裡面照常啟動 Claude Code 或 Codex。
5. 啟用通知：`moshi-hook install` 把 hook 寫進 agent 的設定檔（例如 `~/.claude/settings.json`），`brew services start moshi-hook` 常駐 daemon，approval 才能推播到手機。

## 限制與保留態度

Moshi 是 2026 年 1、2 月左右才上線的獨立開發者產品（App Store 頁面署名 2026-02-24，Terms of Service 最後更新 2026-01），創辦人在官網署名「Joel」（X 帳號 `@odd_joel`，公司登記為 Moshi Tech Ltd.）——這裡要特別註明：這位 Joel **不是** Stack Overflow 創辦人 Joel Spolsky，兩人同名容易在搜尋時混淆，目前也找不到獨立來源查證這位 Joel 的完整背景或團隊規模。moshi-hook 支援的 agent 清單只有官方文檔一個來源,沒有正式的 changelog 頁可以逐版核對功能演進。App Store 評分（4.8 分、487 則評分,2026-08 查證）不差，但作為新產品，還沒經過大規模社群長期審視，比較文章裡的措辭也多半是 Moshi 官方自己寫的行銷內容——誠實但立場鮮明,不能當獨立評測引用。

## 整體來說

Moshi 賭的是「終端機優先、agent 是終端機裡的一個行程」，而不是「agent 優先、終端機是附屬功能」。這讓它同時要跟兩種對手競爭：傳統 SSH client（Termius、Blink Shell）和新興的 agent 專屬 client（Happy、Claude Code Remote Control）。相對傳統 SSH client，它多了 agent 感知的 inbox、approval、diff；相對 agent 專屬 client，它保留了「這就是我平常用的那個 shell」的完整性,以及資料留在自己機器上的信任模型。如果你只用 Claude、只是偶爾從手機回一句 approval，官方免費的 Remote Control 已經夠用；如果你混用多個 agent、平常就活在 tmux 裡，Moshi 的免費版可以先試試看,真的每天在用再考慮升級 Pro。

## 參考資料

- [Moshi 官網](https://getmoshi.app/)
- [What Moshi does（官方文檔）](https://getmoshi.app/docs/introduction)
- [moshi-hook：Agent Approvals on Your Phone](https://getmoshi.app/docs/hooks)
- [Moshi Free vs Pro](https://getmoshi.app/docs/subscription)
- [Moshi 定價頁](https://getmoshi.app/pricing)
- [Moshi vs Claude Code Remote Control（官方比較頁）](https://getmoshi.app/compare/anthropic-remote-control)
- [Moshi 隱私政策](https://getmoshi.app/privacy)
- [SSH, Mosh & ET Connections and Auth](https://getmoshi.app/docs/connections)
- [Mosh：The Mobile Shell（原始協定）](https://mosh.org/)
- [Moshi Desktop](https://getmoshi.app/desktop)

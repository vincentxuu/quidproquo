---
title: "Claude Code Remote Control：從任何裝置接續本地 session"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, remote-control, mobile, cross-device]
lang: zh-TW
tldr: "Remote Control 把 claude.ai/code 或 Claude 手機 app 變成你本地 Claude Code session 的遙控器：程式照樣跑在自己的機器上，MCP servers 和本地工具全部可用，但對話同步會經過 Anthropic 伺服器。本文涵蓋啟動、續接、推送通知與傳檔，以及安全邊界。"
description: "介紹 Claude Code 的 Remote Control：從手機或瀏覽器接續本地 session 的啟動、連線、續接、推送通知與檔案傳輸能力，以及它跟雲端執行的本質差別。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 37
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide-en)

## 人離開了電腦，任務還在跑

Claude Code 跑長任務的時候，人不會一直坐在終端機前。重構跑到一半該去接小孩了，測試套件要跑二十分鐘但你得去開會——離席之後發生什麼事？傳統答案是要嘛盯著等，要嘛回來再說。[排程自動化](/posts/tech/deep-dive/2026-05-09-claude-code-scheduled-tasks-guide)是另一種解法，但它解決的是「沒有人在場時自己動起來」，不是「人在外面，還想繼續指揮」。Remote Control 解的是後面這個問題。

## 程式還在你的機器上，瀏覽器只是遙控器

[Remote Control](https://code.claude.com/docs/en/remote-control) 把 [claude.ai/code](https://claude.ai/code) 或 Claude 手機 app（iOS／Android 都有，也就是 mobile client）接到一個**跑在你機器上的 Claude Code session**。關鍵在執行位置：Claude 全程在你的電腦上跑，程式碼執行和檔案系統存取都不會離開你的機器。瀏覽器和手機只是一扇窗。

所以你的完整本地環境原封不動：

- 檔案系統、[MCP servers](https://code.claude.com/docs/en/mcp)、工具、專案設定全部可用，遠端打 `@` 還會自動補全你本地專案的檔案路徑。
- 對話和 subagents、dynamic workflows 的進度在所有已連線裝置間同步，終端機、瀏覽器、手機可以交替打字。
- 筆電睡著或斷網，機器恢復上線後自動重連，斷線期間 subagent 的狀態更新會排隊補送。

這跟雲端執行是兩回事——後者的程式根本不在你的機器上。差別細節留到文末一句話講完。

## 三種啟動方式與連線步驟

前提：Pro／Max／Team／Enterprise 訂閱（不支援 API key）、已用 `/login` 登入 claude.ai 帳號、且在專案目錄通過過一次 workspace trust 對話框。Team／Enterprise 預設關閉，要 Owner 在管理設定開啟。另外 Bedrock、自訂 `ANTHROPIC_BASE_URL`、企業 gateway 這些不走官方 API 的組態都用不了；連 `DISABLE_TELEMETRY` 這類停用 feature-flag 評估的環境變數也會讓它起不來。

三種啟動方式：

```bash
# Server mode：專職等待遠端連線，按空白鍵顯示 QR code
claude remote-control --name "My Project"

# 一般互動 session 加上遠端可控，本地和遠端都能打字；--rc 也可以
claude --remote-control
```

```
# 已經在 session 裡，帶著完整對話歷史轉成遠端可控
/remote-control
```

Server mode 是常駐服務，可以開多個 session（預設上限 32 個），`--spawn worktree` 還能讓每個新 session 各自拿到獨立的 git worktree。停掉 server 後約四小時內，可以在同一個目錄用 `claude remote-control --continue` 或 `--session-id` 接回先前的 session。互動模式則是一般 session 順便可遠端。VS Code 擴充套件裡也有同名的 `/remote-control`／`/rc` 指令。

連線從另一台裝置有三條路：直接開 session URL、掃 QR code（手機直達 Claude app）、或在 claude.ai/code／app 的 session 清單裡找到它（線上時顯示綠點的電腦圖示）。懶得每次手動啟動的話，`/config` 裡有「Enable Remote Control for all sessions」，讓每個互動 session 自動連線。

## 連上之後能做什麼

最基本的三件事：**看進度**——終端機裡的對話即時出現在手上這台裝置；**回話**——包括在 turn 跑到一半時插話，訊息會排隊等目前的動作完成後送達；**收通知**。

通知值得展開。Remote Control 連線時，內建的 `PushNotification` 工具會推播到手機——通常是長任務完成、或 Claude 需要你決策才能繼續的時候。你也可以直接在 prompt 裡要求：「tests 跑完叫我。」開關在 `/config`：「Push when Claude decides」對應主動通知、「Push when actions required」對應權限詢問。你在終端機前面打字時它會安靜；如果要把「人在機器前」延伸到其他視窗，v2.1.181 起可以用 `CLAUDE_CLIENT_PRESENCE_FILE` 讓檔案存在時略過手機推播。

反方向也通：`SendUserFile` 工具能把 session 產出的報告、截圖、build 產物直接送到你的裝置，不用翻 transcript 找路徑；它在 Remote Control 有 client 連線時可用，在 Claude Code on the web 這類 managed cloud environment 也可用。另外權限詢問會轉發到手機——session 反覆跳出權限確認時，Claude Code 甚至會主動提醒「可以從手機批准」。背景跑的 subagents 和 workflows 也能從遠端裝置直接停掉。

## 安全考量：誰能接到你的 session

架構上是 outbound-only：本地 session 只發出 HTTPS 請求，**不開任何 inbound port**，流量全程走 Anthropic API over TLS，憑證是多組各自過期的短期 credential。

但有一件事要想清楚：連線期間，**完整的對話記錄（含訊息、回應、工具活動）會存在 Anthropic 伺服器上**——這是多裝置同步和斷線重連的代價。有 Zero Data Retention 合規需求的組織乾脆開不了這功能。

至於「誰能接上來」：auto-connect 用你自己的 claude.ai 帳號簽入，session 只出現在你自己的帳號裡。Team／Enterprise 另有 beta 的 Trusted Devices：每台裝置要個別註冊憑證，登入超過 18 小時就得過 Face ID／Touch ID／Windows Hello 或 passkey 才能操作 session——把存取綁到「已知裝置＋最近的認證」，不只是「登入了帳號」。個人使用者至少該做到：別在共用機器的 session 上開 auto-connect。

## 跟雲端執行差在哪

一句話：兩者用同一個 claude.ai/code 介面，差別只在 session 跑在哪——Remote Control 跑在你機器上、碰得到你的本地環境，Claude Code on the web 跑在雲端環境（預設是 Anthropic 託管 VM，也可由組織路由到 self-hosted environment）、適合不想帶本地環境的獨立任務。雲端那半邊（`--cloud`／`--teleport`、auto-fix PR、手機派工）的完整展開見[下一篇：Claude Code 怎麼上雲](/posts/tech/deep-dive/2026-08-26-claude-code-on-the-web)。

順帶一提它的姊妹功能：如果你要顧的不是一個 session 而是好幾個，[agent view](/posts/tech/deep-dive/2026-08-26-claude-code-agent-view) 是多 session 監控的那塊拼圖。

## 參考資料

- [Continue local sessions from any device with Remote Control — Claude Code Docs](https://code.claude.com/docs/en/remote-control) — 啟動方式、連線配對、安全模型、Trusted Devices、推送通知與限制的官方說明
- [Tools reference — Claude Code Docs](https://code.claude.com/docs/en/tools-reference) — 內建工具清單，含 Remote Control 連線時才有手機推送能力的 `PushNotification` 與傳檔工具 `SendUserFile`

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方文件撰寫。

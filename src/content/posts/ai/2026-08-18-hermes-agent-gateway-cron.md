---
title: "Hermes Agent 的 Gateway 與排程：無人看管的 agent 最該防的是自己花錢"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, gateway, telegram, discord, cron, automation]
lang: zh-TW
series:
  name: "Hermes Agent 文件導讀"
  order: 8
tldr: "一個 Gateway 行程接 30 幾個聊天平台，預設拒絕所有不在白名單也未配對的使用者。排程這邊做了兩道少見的防護：pre-dispatch 驗證讓設定壞掉的 job 連 LLM 都不呼叫就標成 blocked_config，而 model drift guard 會讓「沒釘模型」的 job 在全域模型被換掉時直接跳過執行——防的是你切到付費模型後，一個每小時跑的 job 幫你燒錢。"
description: "Hermes Agent 的多平台 Gateway 與 cron 排程：平台能力矩陣、白名單與 DM 配對、群組 session 隔離、systemd/launchd 服務化的陷阱，以及 cron 的模型解析順序、drift guard、預檢與 no-agent 模式。"
draft: false
---

系列第 8 篇。[導讀在這裡](/posts/ai/2026-08-18-hermes-agent-intro)。

Gateway 是 Hermes「不綁在你的筆電上」這個主張的實作：一個常駐行程管所有平台連線，對話連續性跨平台維持。而一旦 agent 開始常駐並自己排程，問題就從「好不好用」變成「無人看管時它會做什麼」。

## 平台不是七個，是三十幾個

官方的平台比較表列了 30 個以上的通道：Telegram、Discord、Slack、Google Chat、WhatsApp（含 Cloud API）、Signal、SMS、Email、Home Assistant、Mattermost、Matrix、DingTalk、飛書／Lark、企業微信（WeCom）、微信（Weixin）、BlueBubbles 與 Photon（iMessage）、QQ、元寶、Microsoft Teams、LINE、ntfy、IRC、Buzz、SimpleX……

但**能力不對等**，這才是選平台時要看的。表格用七個欄位標示：語音、圖片、檔案、討論串、表情反應、輸入中指示、串流（用編輯訊息做漸進更新）。Discord、Slack、Matrix、飛書七項全滿；WhatsApp 沒有討論串與反應；Signal 沒有語音回覆與串流；SMS、ntfy、IRC 幾乎全空。

**如果你的用法很吃「看著它逐步輸出」，就別挑沒有 streaming 的平台**——同一個 agent 在 Discord 上是即時的，在 Signal 上會是一坨等很久才出現的完整回覆。

## 安全預設是對的：全部拒絕

> **By default, the gateway denies all users who are not in an allowlist or paired via DM.** This is the safe default for a bot with terminal access.

有兩種放行方式。白名單走環境變數（`TELEGRAM_ALLOWED_USERS`、`DISCORD_ALLOWED_USERS`、`GATEWAY_ALLOWED_USERS`…），或者用 **DM 配對**：陌生人私訊 bot 會拿到一次性配對碼，你在主機上 `hermes pairing approve telegram XKGH5N7P` 才放行。配對碼一小時過期、有速率限制、用密碼學隨機數產生。

`GATEWAY_ALLOW_ALL_USERS=true` 存在，但官方直接標「NOT recommended for bots with terminal access」——這是誠實的標示，畢竟這個 bot 背後是一個能跑指令的 agent。

未授權私訊的行為可以調：`pair`（預設，回配對碼）或 `ignore`（靜默丟棄）。**Email 預設是 `ignore`**，理由很實際：信箱裡本來就有一堆無關的未讀信。

還有一個容易踩的政策問題：群組裡的 session 怎麼分。`group_sessions_per_user: true`（預設且建議）讓每個發話者在頻道／群組裡有自己的 session；設 `false` 才是整個房間共用一個對話——**共用意味著使用者彼此看得到對方的 context、共享 token 成本與中斷狀態**。討論串無論如何都跟母頻道隔離。

`max_concurrent_sessions` 可以限制 CLI、TUI／dashboard 與 gateway 加起來的活躍 session 數。實作細節很體貼：**佔用名額的時機是 session 跑第一回合，不是開啟聊天視窗**，所以閒置的桌面分頁或 websocket 重連不會把 gateway 的名額吃光。

## 服務化：兩個真實會咬人的坑

Linux 用 systemd（`hermes gateway install`），macOS 用 launchd。兩個坑值得單獨記：

**坑一：不要自己加 `ExecStopPost` 殺行程的 drop-in。** 官方用 danger 等級的警告寫這件事：Hermes 裝的 unit 已經用 `KillMode=mixed` + `SIGTERM` 乾淨關閉，並用 `Restart=always` 讓更新與 `/restart` 正確重生。`ExecStopPost` 在**每一次**停止時都會觸發，包括正常重啟——結果是它 `SIGKILL` 掉剛生出來的新實例，`Restart=always` 又立刻重生，變成無限重啟迴圈（在 Telegram 上就是被重啟訊息洗版）。

**坑二：無頭機器該用 user service + linger，而不是 system service。** system service 每次重啟都要 root，包括 `hermes update` 結尾的自動重啟；非 root 執行更新時它會嘗試免密碼 sudo，不行就跳過重啟並印出手動指令（它不會卡在密碼提示）。改用 user service 加 `sudo loginctl enable-linger $USER`，你得到同樣的開機自啟，但完全不需要 root 參與。

macOS 那邊的細節是 launchd plist 是靜態的：**安裝後才裝的工具（nvm 換 Node、Homebrew 裝 ffmpeg）不會出現在 PATH 裡**，要重跑 `hermes gateway install` 重新擷取。

多份安裝（不同 `HERMES_HOME`）各自有自己的服務名：預設是 `hermes-gateway`，其餘是 `hermes-gateway-<hash>`。

## Cron：模型解析順序決定誰付錢

排程可以用自然語言或 cron 表達式建立，可以在對話裡用 `/cron add`、用 `hermes cron create`，或直接跟 agent 說「每天早上九點看 HN 然後傳 Telegram 給我」。job 可以掛零到多個技能，結果可以投遞回原本的聊天、本地檔案，或設定好的平台目標。

真正該理解的是**模型解析順序**，因為它決定無人看管時錢從哪出：

1. **per-job 釘選**（你用 dashboard、`hermes cron create/edit --model … --provider …` 或改 `jobs.json` 設的）——**agent 自己的 `cronjob` 工具不能設也不能改**，推論釘選是使用者專屬的權限。
2. **`cron.model` / `cron.model_provider`**——整個 cron 隊伍的預設值，跟你的聊天模型完全獨立。設一次之後，你用 `hermes model` 或 `/model` 換聊天模型不會動到排程。
3. **全域預設**——只有前兩者都沒設時才適用。

第 3 種情況有一道我沒在別的框架看過的保護：**model drift guard**。Hermes 在 job 建立時快照當下的供應商與模型；如果全域預設後來變了，這個 job 會**直接失敗關閉**——跳過該次執行、不做任何推論呼叫、只警告你一次，之後每次 tick 都靜靜跳過，直到你處理或把設定還原。

它防的是一個很具體的場景：**你把聊天模型從免費端點切到付費模型，然後忘記自己有一個每小時跑的排程。** 想讓未釘選的 job 跟著全域走可以關掉（`cron.model_drift_guard: false`），但官方緊接著警告這等於讓每次排程都花錢。

第二道保護是 **pre-dispatch 驗證**：真正組出 agent 機制之前先檢查供應商金鑰解得開（設了 fallback 鏈就跳過此檢查）、掛上的技能備妥（沒有缺環境變數／指令／憑證檔）、投遞平台目標存在且有 gateway 憑證。驗證失敗時 job 標成 `blocked_config`、**只發一次警告、完全不做 LLM 呼叫**——設定壞掉的 job 不會燒 token。下一次成功執行會清掉這個狀態，所以未來再壞會再警告一次。

第三道是防遞迴：**cron 執行的 session 不能再建立 cron job**，Hermes 在 cron 執行內把排程管理工具關掉，避免失控的排程繁殖。

還有一個省錢又省事的模式：**no-agent mode**——排程跑一個腳本、把 stdout 原封不動投遞出去，完全不碰 LLM。監控類的需求（磁碟、備份結果、健康檢查）用這個就夠，沒必要讓模型讀一遍。

同樣精神的還有 quick commands：在 `config.yaml` 定義 `type: exec` 的自訂指令，在任何平台打 `/disk`、`/gpu` 直接跑 shell 指令回傳輸出，**零 token、不呼叫 LLM**，30 秒逾時。從手機查伺服器狀態這種事不需要動用一個 agent。

## 這一層的判斷

Gateway 把「agent 常駐」從概念變成一個要維運的服務，而它做對的地方是把**預設值設在保守側**：全部拒絕、群組 per-user 隔離、cron 設定壞掉就停、模型漂移就停。

我會加的一條實務建議：**上線前先把 `hermes pairing list` 與 `hermes cron list` 各看一次**，前者告訴你誰能碰這個 agent，後者告訴你它在你沒看的時候做什麼。這兩個清單比任何設定檔都更接近「這個系統實際上是什麼」。

下一篇談[安全模型](/posts/ai/2026-08-18-hermes-agent-security)——審批、deny 規則與 prompt injection。

## 參考資料

- [Hermes Agent — Messaging Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)
- [Hermes Agent — Scheduled Tasks (Cron)](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)
- [Hermes Agent — Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
- [Hermes Agent — Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)

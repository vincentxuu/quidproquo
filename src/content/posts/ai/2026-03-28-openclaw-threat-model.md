---
title: "OpenClaw 的威脅模型：先講清楚它「不保護什麼」"
date: 2026-03-28
type: deep-dive
category: ai
tags: [openclaw, security, threat-model, prompt-injection, mitre-atlas, formal-verification]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 18
tldr: "OpenClaw 的安全文件現在開宗明義寫著：這是個人助理的信任模型，一個 Gateway 對應一個受信任的操作者。它明確「不是」多個互相敵對的使用者共用一個 agent 時的安全邊界——而且有一份『依設計不算漏洞』的清單把這件事寫死。"
description: "OpenClaw 的威脅模型：個人助理信任模型的範圍與邊界、security audit 的檢查分類與分流順序、信任邊界矩陣中的常見誤讀，以及依設計不算漏洞的那份清單。"
draft: false
---

大部分安全文件講的是「我們防住了什麼」。OpenClaw 的安全頁面把最重要的位置留給相反的東西——**它明確不保護什麼**。這個選擇本身就值得讀。

## 範圍：個人助理的信任模型

文件最上方是一個框起來的聲明：

> **個人助理信任模型。** 這份指引假設每個 gateway 對應一個受信任的操作者邊界（單一使用者、個人助理模型）。OpenClaw **不是**多個互相敵對的使用者共用一個 agent 或 gateway 時的安全邊界。

展開之後的幾條界線很具體：

- **支援**：一個 gateway 一個使用者／信任邊界（最好一個邊界一個 OS 使用者／主機／VPS）
- **不支援**：互不信任或互相敵對的使用者共用一個 gateway／agent
- **敵對使用者的隔離需要分開的 gateway**，最好連 OS 使用者或主機都分開
- 如果多個不受信任的人能對同一個有工具的 agent 說話，**他們就共享了那個 agent 被委派的工具權限**
- **如果有人能改動 Gateway 主機的狀態或設定（`~/.openclaw`，含 `openclaw.json`），就把他當成受信任的操作者**
- 在單一 Gateway 內，已認證的操作者存取是**受信任的控制平面角色，不是每使用者的租戶角色**
- **`sessionKey`（session ID、標籤）是路由選擇器，不是授權 token**

要託管多個使用者或組織的話，官方的答案是**每個租戶跑一個隔離的 Gateway cell**，而不是共用一個 Gateway。

這是很成熟的態度：與其宣稱一個為單人設計的系統能撐住多租戶，不如把邊界畫清楚，讓部署的人知道自己站在哪。

## `openclaw security audit`

任何設定變更之後、或把網路介面暴露出去之前，跑它：

```bash
openclaw security audit
openclaw security audit --deep    # 嘗試對執行中的 Gateway 做實際探測
openclaw security audit --fix     # 套用安全的修補
openclaw security audit --json
```

`--fix` 是**刻意做得很窄**的：只把開放的群組政策翻成 allowlist、收緊狀態／設定／include 檔案的權限（檔案 `600`、目錄 `700`），Windows 上改用 ACL 重設而不是 POSIX `chmod`。它不會替你做需要判斷的決定。

稽核涵蓋的面向大致是：**入站存取**（陌生人能不能觸發 bot）、**工具影響範圍**（prompt injection 會不會變成 shell／檔案／網路動作）、**exec 的檔案系統與核准落差**、**網路暴露**（bind／auth、Tailscale Serve/Funnel、太短的 token）、**瀏覽器控制暴露**、**本機磁碟衛生**、**plugin 是否無 allowlist 載入**、**政策落差**與**執行期預期落差**。

每個發現都有結構化的 `checkId`（例如 `gateway.bind_no_auth`、`tools.exec.security_full_configured`），前綴分類讓你能按面向過濾：`fs.*`、`gateway.*`、`hooks.*`／`browser.*`／`sandbox.*`／`tools.exec.*`、`plugins.*`／`skills.*`、`security.exposure.*`。

有一條標註值得注意：**`security="full"` 本身只是「姿態偏寬」的警告，不是漏洞證明**——它是為受信任的個人助理設定所選的預設值，只有在你的威脅模型需要核准或 allowlist 護欄時才該收緊。文件願意這樣講，比一律標紅有用。

### 分流順序

發現一堆問題時的處理順序，官方給了明確排序：

1. **任何「開放」＋工具啟用的組合** — 先鎖 DM／群組（配對／allowlist），再收緊工具政策與沙箱
2. **公開網路暴露**（LAN bind、Funnel、缺 auth）— 立刻修
3. **瀏覽器控制的遠端暴露** — 當成操作者存取看待：只在 tailnet 內、刻意配對節點、不對外
4. **權限** — 狀態／設定／憑證／auth 不可以被同群組或全世界讀取
5. **Plugin** — 只載入你明確信任的
6. **模型選擇** — 有工具的 bot 優先用現代、經過指令加固的模型

這個順序背後的邏輯是「影響範圍優先」而不是「嚴重性評分優先」：能被陌生人觸發、又有工具的 agent，比一個設定得不夠漂亮但沒人碰得到的服務危險得多。

## 60 秒的加固基線

```json5
{
  gateway: {
    mode: "local",
    bind: "loopback",
    auth: { mode: "token", token: "replace-with-long-random-token" },
  },
  session: { dmScope: "per-channel-peer" },
  tools: {
    profile: "messaging",
    deny: ["group:automation", "group:runtime", "group:fs", "sessions_spawn", "sessions_send"],
    fs: { workspaceOnly: true },
    exec: { security: "deny", ask: "always" },
    elevated: { enabled: false },
  },
  channels: {
    whatsapp: { dmPolicy: "pairing", groups: { "*": { requireMention: true } } },
  },
}
```

保持 Gateway 只在本機、隔離 DM、預設關掉控制平面與執行期工具，之後再針對受信任的 agent 逐一開回來。

還有一條寫死在程式裡的基線：**聊天觸發的 agent 回合中，非擁有者的發送者不能使用 `cron` 或 `gateway` 工具，不管設定怎麼寫。**

## 請求者範圍的控制，不會淨化 prompt 上下文

這一段是整份文件裡最誠實、也最容易被誤解的地方：

`tools.toolsBySender`、發送者擁有權、擁有者專屬的工具清單，都是針對**當前這一輪的原始請求者**評估的。它們**不認證也不淨化那個 prompt 裡的其他內容**——包括引用文字、先前的共用房間歷史、轉發內容、抓取的內容、附件、工具結果。

所以：**別人的內容可以影響一個由擁有者觸發的回合**，只要那些內容被放進了那一輪的上下文。

官方的建議是把這些控制當成**縱深防禦（減少請求者的直接能力），而不是敵對多使用者的隔離**；要過濾上下文請用 `contextVisibility`、限制工具並沙箱化 agent，參與者互相敵對時就用分開的 gateway 與 OS 使用者。

## 信任邊界矩陣：常見的誤讀

文件列了一張表，專門處理「這算不算漏洞」的爭論。挑幾條有代表性的：

| 邊界或控制 | 它是什麼 | 常見誤讀 |
|---|---|---|
| `gateway.auth` | 對 gateway API 認證呼叫方 | 「每個 frame 都要逐訊息簽章才算安全」|
| `sessionKey` | 上下文／session 選擇的路由鍵 | 「session key 是使用者授權邊界」|
| Prompt／內容護欄 | 降低模型被濫用的風險 | 「光是 prompt injection 就證明了認證繞過」|
| `canvas.eval` / 瀏覽器 evaluate | 啟用時是刻意提供的操作者能力 | 「任何 JS eval 原語自動就是漏洞」|
| 本機 TUI 的 `!` shell | 操作者明確觸發的本機執行 | 「本機 shell 便利指令等於遠端注入」|
| 節點配對與節點指令 | 已配對裝置上的操作者級遠端執行 | 「遠端裝置控制預設該當成不受信任的使用者存取」|

## 「依設計不算漏洞」

最後有一份清單，直接列出哪些回報不會被當成漏洞處理：

- **只有 prompt injection、沒有政策／認證／沙箱繞過的攻擊鏈**
- 假設在單一共用主機或設定上做**敵對多租戶**運作的宣稱
- 在共用 gateway 設定裡，把正常的操作者讀取路徑（`sessions.list`、`sessions.preview`、`chat.history`）歸類為 IDOR
- **只在 localhost 部署**才成立的發現（例如 loopback-only gateway 缺 HSTS）
- 針對這個 repo 裡根本不存在的入站路徑的簽章問題

這份清單的價值不只在於擋掉噪音——它其實是**把信任模型寫成可檢驗的形式**。一個系統如果說不出「什麼不算漏洞」，通常代表它也沒想清楚自己的邊界在哪。

## 整體來說

OpenClaw 的威脅模型最值得學的不是它防了什麼，是它**願意把範圍縮小到守得住的大小**，然後把界線寫得夠具體，讓部署的人自己判斷該不該再加一層。

實務上這翻譯成兩個動作：**設定變更後跑 `openclaw security audit`**，以及**當你的使用者互相不信任時，不要試圖用設定解決——分開 gateway。**

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。**改以「個人助理信任模型」為主軸**——官方安全頁現在開宗明義聲明一個 gateway 對應一個受信任操作者邊界，明確不支援敵對多租戶，多租戶請每個租戶一個隔離 cell。新增：`openclaw security audit` 的四種用法與 `--fix` 刻意做窄的範圍、稽核涵蓋面向與 `checkId` 前綴分類、`security="full"` 是姿態警告而非漏洞證明、發現的分流優先順序、60 秒加固基線設定、非擁有者不得使用 `cron`／`gateway` 工具的內建基線、**請求者範圍的控制不淨化 prompt 上下文**的誠實聲明、信任邊界矩陣的常見誤讀、以及「依設計不算漏洞」清單。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Security](https://docs.openclaw.ai/gateway/security) — 信任模型範圍、稽核、分流順序、信任邊界矩陣與非漏洞清單
- [Security audit checks](https://docs.openclaw.ai/gateway/security/audit-checks) — 完整檢查目錄與嚴重性
- [Gateway exposure runbook](https://docs.openclaw.ai/gateway/security/exposure-runbook) — 變更遠端存取前的前置檢查
- [Multi-tenant hosting](https://docs.openclaw.ai/gateway/multi-tenant-hosting) — 每租戶一個 cell 的模型
- [Formal Verification](https://docs.openclaw.ai/security/formal-verification) — 安全屬性的形式驗證

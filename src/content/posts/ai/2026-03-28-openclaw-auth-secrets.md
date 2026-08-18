---
title: "OpenClaw 存取控制：SecretRef 不是程序隔離，以及它到底解決了什麼"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, authentication, oauth, secrets, secretref, trusted-proxy, api-key]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 19
tldr: "SecretRef 讓憑證不必以明文躺在設定檔裡，模型呼叫鏈上看到的是 process-local 的哨兵值。但官方講得很白：這不是程序隔離——真正的值仍在同一個程序的記憶體裡，而且 agent 讀得到的任何明文檔案都繞過了這層保護。"
description: "OpenClaw 的憑證管理：模型供應商認證的建議路徑、SecretRef 的執行期快照與哨兵機制、active-surface 過濾與降級語意，以及遷移完成的實際判準。"
draft: false
---

Gateway 要管兩類憑證：**模型供應商的認證**，以及 **Gateway 自身的存取控制**。這篇主要講前者與底下共用的 secrets 機制——它在 3 月之後長出了一整套新東西。

（Gateway 連線本身的認證——token、password、trusted-proxy——屬於設定與遠端存取的範圍，下一篇 Gateway 篇會講。）

## 最可預測的路徑：API key

對一台長時間開著的 gateway 主機，官方的建議很直接：**API key 最可預測**，訂閱／OAuth 流程在符合你的帳號模型時也能用。

關鍵是**要放在 Gateway 主機上**（跑 `openclaw gateway` 那台）。如果 gateway 跑在 systemd／launchd 底下，環境變數要進 `~/.openclaw/.env`，daemon 才讀得到：

```bash
cat >> ~/.openclaw/.env <<'EOF'
<PROVIDER>_API_KEY=...
EOF
```

然後重啟並確認：

```bash
openclaw models status
openclaw doctor
openclaw models status --check   # 自動化用：過期／缺漏回 1，即將過期回 2
openclaw models status --probe   # 實際探測
```

探測的回報值得知道怎麼讀：如果 `auth.order.<provider>` 漏掉了某個已儲存的 profile，探測會回 `excluded_by_auth_order` 而不是去試它；如果有認證但找不到可探測的模型，會回 `status: no_model`。

## Anthropic 的 Claude CLI 重用，實際上在做什麼

這條路徑的機制值得單獨講，因為它跟「複製 token」完全不同：

```bash
claude auth login
claude auth status --text
openclaw models auth login --provider anthropic --method cli --set-default
```

執行時 OpenClaw 把重用的 Claude CLI 登入**當成 Claude 自己的憑證**：它先驗證主機當前的 `claude` 登入與選定 profile 的帳號相符，然後讓 `claude` 子程序**自己去原生認證**，所以 Claude 會在執行期間持續更新它自己的登入。

**OpenClaw 在這條路徑上從不轉發任何複製過來的 token。** 主機登入缺漏或屬於別的帳號時，執行會在 spawn 之前就失敗，並印出確切的重新認證指令。

## 憑證存在哪裡（3 月之後改了）

auth profile 現在讀自每個 agent 的 `openclaw-agent.sqlite`。端點細節（`baseUrl`、`api`、模型 id、headers、逾時）屬於 `openclaw.json` 或 `models.json` 的 `models.providers.<id>`，**不放在 auth profile 裡**。

舊安裝如果還留著 `auth-profiles.json`、`auth-state.json`，或 `{ "openrouter": { "apiKey": "..." } }` 這種扁平結構，跑 `openclaw doctor --fix` 匯入 SQLite；doctor 會在原 JSON 旁邊留帶時間戳的備份。

還有一個容易寫錯的：**外部認證路由不是憑證**。Bedrock 的 `auth: "aws-sdk"` 要設成 `auth.profiles.<name>.mode: "aws-sdk"`（設定的中繼資料），**不要**把 `type: "aws-sdk"` 寫進憑證儲存區。

## SecretRef：它解決什麼、不解決什麼

SecretRef 讓支援的憑證不必以明文存在設定裡，寫法是 `{ source, provider, id }`，來源涵蓋 `env`／`file`／`exec`／`store`。**明文仍然可用，SecretRef 是逐憑證選用的。**

但官方對它的邊界講得非常清楚，這段值得逐句看：

> SecretRef 阻止憑證被持久化到設定與產生的模型檔案裡，但**它們不是程序隔離的邊界**。留在 agent 讀得到的路徑上的明文憑證，仍然可以透過檔案或 shell 工具讀出來，繞過 API 層級的遮蔽。

也就是說：`openclaw.json`、`.env`、退役的 auth profile JSON 封存、產生的 `agents/*/agent/models.json`——只要 agent 能讀，明文就還是明文。

## 哨兵：模型呼叫鏈上看到的不是真值

這是實作上最有意思的一段。對 SecretRef 支撐的模型供應商憑證，OpenClaw 會在模型認證解析時鑄造一個**不透明的、process-local 的哨兵值**。

所以 auth 儲存、stream 選項、SDK 設定、日誌、錯誤物件、大部分執行期內省看到的是 `oc-sent-v2..end` 這種東西，**不是真正的憑證**。只有在請求離開程序之前，受保護的 fetch 才會把哨兵換成真值。

兩個設計細節很漂亮：

- **形狀像哨兵但不認得的值會 fail closed** ——OpenClaw 寧可拒絕送出請求，也不把一個未解析的哨兵轉發給供應商
- 解析後的機密值會被**註冊為日誌的精確值遮蔽對象**，當成縱深防禦

但官方同樣不誇大：**哨兵不是程序隔離**。真正的值仍在同一程序的記憶體裡，並在最後的 adapter 邊界出現。而沒有透過 SecretRef 設定的純環境變數憑證，根本不在這個機制的範圍內。

incident response 或相容性排查時可以用 `OPENCLAW_SECRET_SENTINELS=off` 關掉鑄造——注意這個 kill switch **不會**關掉精確值的日誌遮蔽註冊。

## 執行期模型：快照、降級、fail closed

secrets 是**在啟用時就急切解析成一份記憶體內的執行期快照**，不是在請求路徑上惰性解析。這個設計的目的很明確：**把 secret 供應商的故障擋在熱路徑之外**。

冷啟動時的行為分得很細：

- 可重試的 SecretRef 失敗，如果能歸屬到一個支援隔離的非 Gateway 擁有者（模型供應商、skills、媒體／TTS／cron 供應商、合格的 auth profile、per-agent memory、sandbox SSH、頻道帳號、manifest 宣告的 plugin 路由），**Gateway 仍會啟動**，把該擁有者記為「已設定但不可用」，並發出遮蔽過的降級警告
- **Gateway 的入站認證、結構上無效的 ref 或解析值、fail-closed 的擁有者、以及擁有者無法對應的 ref，仍然會擋住啟動**

重載時每個擁有者獨立驗證，然後**發布一份原子的快照**。合格但失敗的擁有者會保留最後已知良好的值（只有在 ref 身分、供應商定義與完整的非機密擁有者契約都沒變時才算 stale，變了或新增的就是 cold）。嚴格失敗則直接拒絕整次重載、保留現行快照。

## Active-surface 過濾

一個很實際的設計：**SecretRef 只在真正生效的介面上驗證**。

沒啟用的頻道／帳號、沒有任何啟用帳號繼承的頂層頻道憑證、關閉的工具介面、`tools.web.search.provider` 沒選到的搜尋供應商金鑰——這些的未解析 ref **不會擋住啟動**，只發出非致命的 `SECRETS_REF_IGNORED_INACTIVE_SURFACE` 診斷。

沙箱 SSH 的認證素材也只有在有效沙箱後端是 `ssh` 且沙箱模式不是 off 時才算 active。這避免了「我只是留著一段沒在用的設定，結果整個 Gateway 起不來」。

另外有個優先權規則要記：**啟用中的 `gateway.auth.token` / `gateway.auth.password` SecretRef 優先於 `OPENCLAW_GATEWAY_TOKEN` / `OPENCLAW_GATEWAY_PASSWORD`**；環境憑證只在對應的本地設定輸入不存在時當退路。

## 遷移到底什麼時候算完成

官方把這件事定義成一道**安全遷移閘門，不只是便利工具**。全部成立才算完成：

1. 支援的憑證都改用 SecretRef，不是明文值
2. 明文殘留已從 `openclaw.json`、SQLite auth profile 儲存、`.env`、產生的 `models.json` 清掉（退役的 auth JSON 是 doctor 的遷移輸入，`secrets apply` 永遠不會改寫它）
3. `openclaw secrets audit --check` 跑起來是乾淨的
4. 其餘不支援或會輪替的憑證，用 OS 隔離、容器隔離或外部憑證代理保護

還有一句提醒值得抄下來：**SecretRef 不會讓任意可讀的檔案變安全**。備份、複製出去的設定、舊的模型目錄、不支援的憑證類別，在被刪除、移出 agent 信任邊界或另外隔離之前，都仍然是正式環境的機密。

## 整體來說

這一層的設計哲學跟威脅模型那篇一致：**把能守住的部分做紮實，並且明說守不住什麼。**

SecretRef 加哨兵確實把明文從設定檔、日誌、SDK 設定裡拿掉了——這解決的是「憑證散落在 agent 讀得到的地方」這個很真實的問題。但它從頭到尾沒有假裝自己是程序隔離，也沒有假裝能保護你忘在磁碟上的那份備份。

實務上的檢查點只有一個：**`openclaw secrets audit --check` 是不是乾淨的。**

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。**修正憑證儲存位置**：auth profile 已改讀每個 agent 的 `openclaw-agent.sqlite`，舊的 `auth-profiles.json` 等需要 `doctor --fix` 匯入。SecretRef 一段大幅擴充為現況：**哨兵機制**（模型呼叫鏈上看到 process-local 哨兵、未知哨兵 fail closed、`OPENCLAW_SECRET_SENTINELS=off` kill switch）、執行期快照與冷啟動／重載的降級語意（哪些會擋啟動、哪些降級成 configured-unavailable）、active-surface 過濾與 `SECRETS_REF_IGNORED_INACTIVE_SURFACE`、`gateway.auth.*` SecretRef 優先於環境變數的規則、以及官方定義的四項遷移完成判準。新增 Anthropic Claude CLI 重用的實際機制（驗證帳號相符後由子程序原生認證，從不轉發複製的 token）、`models status --probe` 的 `excluded_by_auth_order` 與 `no_model` 回報、Bedrock `aws-sdk` 應寫在設定中繼資料而非憑證儲存區。並依官方原文加上「SecretRef 不是程序隔離」的邊界聲明。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Authentication](https://docs.openclaw.ai/gateway/authentication) — 模型供應商認證、Claude CLI 重用、狀態檢查與金鑰輪替
- [Secrets management](https://docs.openclaw.ai/gateway/secrets) — SecretRef 契約、哨兵、執行期快照與 active-surface 過濾
- [OAuth](https://docs.openclaw.ai/concepts/oauth) — OAuth 流程與儲存配置
- [Trusted Proxy Auth](https://docs.openclaw.ai/gateway/trusted-proxy-auth) — 委託反向代理做認證
- [Auth Credential Semantics](https://docs.openclaw.ai/auth-credential-semantics) — 憑證合格性與原因碼

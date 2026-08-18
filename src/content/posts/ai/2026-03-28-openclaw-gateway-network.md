---
title: "OpenClaw Gateway 篇（二）：綁定、認證與那份憑證優先權契約"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, gateway, remote-access, tailscale, ssh-tunnel, authentication, bonjour]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 27
tldr: "Gateway 預設只綁 loopback，而綁到 loopback 以外一律要求認證——這是它自己會擋的，不是建議。容器裡的有效預設是 auto，但 Tailscale serve/funnel 啟用時會強制回 loopback。"
description: "OpenClaw Gateway 的網路面：bind 模式與埠的解析順序、非 loopback 綁定的認證要求、SSH tunnel 與 Tailscale、remote 模式設定、憑證優先權契約，以及多 Gateway 與 Bonjour 探索。"
draft: false
---

一個 Gateway 擁有 session、auth profile、頻道與狀態，**其他所有東西都是客戶端**——包括 macOS app 的「node 模式」，那只是一個走 Gateway WebSocket 的節點客戶端。

這篇講怎麼從外面連進來，以及過程中會擋住你的那些規則。

## 綁定：預設 loopback，容器裡是 auto

Gateway 的 WebSocket 預設綁 **loopback**，埠 `18789`。但有個例外值得知道：**在偵測到的容器環境裡，有效預設是 `auto`**（解析成 `0.0.0.0` 以便埠轉發）——除非 Tailscale serve/funnel 啟用，那會**強制回 loopback**。

埠與綁定的解析順序：

| 設定 | 順序 |
|---|---|
| 埠 | `--port` → `OPENCLAW_GATEWAY_PORT` → `gateway.port` → `18789` |
| Bind 模式 | CLI／覆寫 → `gateway.bind` → `loopback`（容器內為 `auto`）|

一個實務陷阱：**已安裝的 gateway 服務會把解析後的 `--port` 記在 supervisor 的中繼資料裡**。所以改了 `gateway.port` 之後要跑 `openclaw doctor --fix` 或 `openclaw gateway install --force`，launchd／systemd／schtasks 才會用新埠啟動程序。

## 非 loopback 綁定強制要認證

這條不是建議，是它自己會擋：

> **非 loopback 的綁定**（`lan`／`tailnet`／`custom`，或 loopback 不可用時的 `auto`）**必須使用 Gateway 認證**：token、password，或帶身分感知的反向代理搭配 `gateway.auth.mode: "trusted-proxy"`。

CLI 那邊寫得更直接：**在沒有認證的情況下綁到 loopback 以外會被阻擋。**

傳輸協定也有規則：**明文 `ws://` 只接受 loopback、私有／區網（RFC 1918）、link-local、CGNAT、`.local` 與 `.ts.net` 主機。公開的遠端主機必須用 `wss://`。**

還有一個容易誤會的：`gateway.remote.token` / `.password` 是**客戶端的憑證來源，它們本身不會設定伺服器端的認證**。

## 三種拓撲

| 設定 | Gateway 跑在哪 | 適合 |
|---|---|---|
| 常駐在 tailnet 裡 | 持續開機的主機（VPS 或家用伺服器），走 Tailscale 或 SSH | 常睡眠但需要 agent 一直在的筆電 |
| 家用桌機 | 桌機，筆電用 macOS app 的遠端模式連 | 想把 agent 放在一直有電的硬體上 |
| 筆電 | 筆電，用 SSH tunnel 或 Tailscale Serve 安全曝露（保持 `bind: "loopback"`）| 單機設定 |

前兩種官方都建議**保持 loopback 綁定**，Control UI 走 Tailscale Serve，或用可信任的 LAN／Tailnet 綁定搭配 `gateway.remote.transport: "direct"`。**SSH tunnel 是任何機器都能用的退路**：

```bash
ssh -N -L 18789:127.0.0.1:18789 user@gateway-host
```

通道起來之後，`openclaw health`、`openclaw status --deep` 就會走 `ws://127.0.0.1:18789` 連到遠端 Gateway。

一個安全設計要記住：**`--url` 永遠不會沿用設定或環境裡的隱含憑證**。要明確傳 `--token` 或 `--password`，否則客戶端不送任何憑證，而目標 Gateway 若要求認證就會連不上。

## 憑證優先權契約

這是這篇最值得抄下來的一段，因為「為什麼它用了那組憑證」很難用猜的：

**本地模式的預設**：
- token：`gateway.auth.token` → `OPENCLAW_GATEWAY_TOKEN` → `gateway.remote.token`（只有本地 token 未設時才退到 remote）
- password：同樣的形狀

**遠端模式的預設**：
- token：`gateway.remote.token` → `OPENCLAW_GATEWAY_TOKEN` → `gateway.auth.token`
- password：`OPENCLAW_GATEWAY_PASSWORD` → `gateway.remote.password` → `gateway.auth.password`

**URL 覆寫的安全規則**：CLI 的 `--url` 從不重用隱含憑證；環境變數的 `OPENCLAW_GATEWAY_URL` **只能**用環境憑證。

**Node-host 的本地模式例外**：環境憑證優先，而且 `gateway.remote.*` 被忽略——因為 node 指令是針對明確的主機與埠。

還有一條 SecretRef 相關的：遠端啟動／狀態／精靈的探測會把設定過的 `gateway.remote.token` / `password` **當成該目標的權威來源**，只有兩者都沒設定時才考慮環境憑證。而**如果設定的遠端 SecretRef 解析不出來，探測會警告並且不退回環境憑證**——這是刻意的 fail closed。

## Tailscale 與穩定的 HTTPS URL

想把「每個客戶端各開一條 SSH tunnel」換成單一的私有 `wss://` 端點、同時保持 Gateway 在 loopback，官方有一頁專門講[給 Gateway 一個穩定的 HTTPS URL](https://docs.openclaw.ai/gateway/stable-https-url)。

Docker 部署要注意：Serve／Funnel 模式需要 gateway 綁 loopback 並與 `tailscaled` 相鄰，**bridge 網路加發佈埠滿足不了這個條件**——要用 `network_mode: host`，並把主機的 `tailscaled` socket（`/var/run/tailscale`）與 `tailscale` CLI 掛進容器。

## 多 Gateway 與探索

**一台主機上原則只跑一個 Gateway**，除非你刻意用隔離的 profile 跑多個實例。服務標籤會反映這件事——預設 profile 是 `ai.openclaw.gateway`，具名 profile 是 `ai.openclaw.<profile>`。

**Bonjour 探索**：`openclaw gateway discover` 會掃描 `_openclaw-gw._tcp` 的信標，涵蓋多播的 `local.` 與設定過的廣域 DNS-SD 網域。只有啟用探索（預設啟用）的 gateway 才會廣播。

信標的 TXT 提示裡有 `role`、`transport`、`gatewayPort`、`tailnetDns`、`gatewayTls` 與憑證指紋；**`sshPort` 與 `cliPath` 只在完整探索模式（`discovery.mdns.mode: "full"`）才發布**——預設的 `"minimal"` 會省略它們，客戶端則退回 SSH 埠 22。

## 營運指令

```bash
openclaw gateway status
openclaw gateway status --deep   # 加上系統層級的服務掃描
openclaw gateway restart
openclaw secrets reload
openclaw logs --follow
openclaw doctor
```

兩個要注意的：**`--deep` 是為了額外的服務發現**（LaunchDaemons／systemd 系統單元／schtasks），**不是更深入的 RPC 健康探測**。以及**重啟要用 `openclaw gateway restart`，不要把 `stop` 和 `start` 串起來當重啟用**。

服務層面還有一個開關：`SIGUSR1` 在獲授權時會觸發程序內重啟，而 `commands.restart`（預設啟用）管的是外部送進來的 `SIGUSR1`——設成 `false` 可以擋掉手動的 OS 訊號重啟。**給 agent 用的 `gateway` 工具是唯讀的**；agent 要重啟得走需要人類核准的 `openclaw` 委派工具。

## 順帶一提：Gateway 本身就是 OpenAI 相容端點

同一個多工的埠上除了 WebSocket 控制／RPC 之外，還掛著 HTTP API：`/v1/models`、`/v1/embeddings`、`/v1/chat/completions`、`/v1/responses`、`/tools/invoke`，加上 plugin 的 HTTP 路由、Control UI 與 hooks。

官方把這稱為「OpenClaw 槓桿率最高的相容介面」——也就是說，你可以把整個 Gateway 當成一個 OpenAI 相容的後端接給別的系統用，而它背後帶著完整的 agent 迴圈、工具與 session。

## 整體來說

網路這一層的設計有一條清楚的主線：**預設關起來，打開的每一步都要求你明確表態。** loopback 是預設、非 loopback 強制認證、公開主機強制 TLS、`--url` 不繼承憑證、遠端 SecretRef 解析失敗不退回環境變數。

這也是為什麼那份憑證優先權契約值得讀一遍——當它「用了不是你以為的那組憑證」時，答案幾乎都在那張順序表裡。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。新增：容器環境的有效預設 bind 是 `auto`（Tailscale serve/funnel 會強制回 loopback）、埠與 bind 的完整解析順序、改 `gateway.port` 後需要 `doctor --fix` 或 `gateway install --force` 讓 supervisor 跟上、**非 loopback 綁定強制要求認證**與明文 `ws://` 的主機白名單、三種拓撲的建議、**完整的憑證優先權契約**（本地／遠端模式的順序、`--url` 不繼承隱含憑證、node-host 的例外、遠端 SecretRef 解析失敗不退回環境憑證）、Docker 下 Tailscale Serve 需要 `network_mode: host`、Bonjour 探索與 `discovery.mdns.mode` 對 `sshPort`／`cliPath` 的影響、`gateway status --deep` 的實際用途、不要用 stop+start 代替 restart、`commands.restart` 與 agent 的 `gateway` 工具唯讀，以及 Gateway 多工埠上的 OpenAI 相容端點清單。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Remote access](https://docs.openclaw.ai/gateway/remote) — 拓撲、SSH tunnel、remote 模式與憑證優先權
- [Gateway runbook](https://docs.openclaw.ai/gateway/) — 綁定與埠解析、營運指令、OpenAI 相容端點
- [Gateway CLI](https://docs.openclaw.ai/cli/gateway) — 啟動守門、選項與 Bonjour 探索
- [Tailscale](https://docs.openclaw.ai/gateway/tailscale)、[Stable HTTPS URL](https://docs.openclaw.ai/gateway/stable-https-url) — 私有 `wss://` 端點
- [Multiple gateways](https://docs.openclaw.ai/gateway/multiple-gateways) — 多實例與 profile 隔離

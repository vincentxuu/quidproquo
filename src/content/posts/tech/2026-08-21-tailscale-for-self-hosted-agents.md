---
title: "Tailscale：agent 住在你家，不是你連回家"
date: 2026-08-21
category: tech
type: deep-dive
tags: [tailscale, self-hosted, ai-agent, zero-trust, networking, agent-security]
lang: zh-TW
series:
  name: "AI 時代的技術選擇"
  order: 15
tldr: "自架一個 24 小時跑著的 agent，等於在自己網路裡開了一個必須從外面連得到、又不能開在公網上的東西。這篇拆 Tailscale 的四個機制各自解決什麼：tailnet 解決連得到、subnet router 解決碰內網、tag 與 ACL 解決權限邊界、policy 秒級生效與 tailnet lock 解決收得回。附 2026-08 實查的定價：Personal 免費、6 個使用者、user device 無上限、50 個 tagged resource。"
description: "從自架常駐 agent 的角度拆解 Tailscale：WireGuard 資料面與自家控制面的分工、subnet router 與 exit node 各自解決什麼、tag 為什麼是 agent 的正確身分、以及事故當下怎麼把權限收回來。"
draft: false
---

🌏 [English version](/posts/tech/2026-08-21-tailscale-for-self-hosted-agents-en)

自架一個 24 小時跑著的 agent，等於在自己網路裡開了一個**必須從外面連得到、又絕不能開在公網上**的東西。你要能從手機叫它做事，它要能碰到內網的資料庫，而它同時是一個會被 prompt injection 影響、會自己發起網路連線的程式。

[Tailscale](https://tailscale.com/) 就是在處理這一層。它在你所有裝置之間建一個私有網路，官方叫 tailnet。每台機器拿到一個固定的 `100.x.x.x` 位址，彼此之間走加密的點對點連線。沒有 port forwarding、不需要公網 IP、也沒有一台中央的 VPN 閘道。裝好之後，「從外面連家裡那台 agent」跟「在同一個房間裡連」在網路層是同一件事。個人自架的價格是零，細節在文末的定價表。

先劃一條界線。站上已經有一篇[從外面連回家裡的 Mac](/posts/tech/2026-05-08-cloudflare-tunnel-mac-remote-2026)，比較過 Tailscale、Cloudflare Tunnel、ZeroTier、Pangolin、NetBird。那篇的問題是「**人**從外面連回家裡的桌面」，這篇方向是反的：**東西住在裡面**。它要往外被呼叫，也要往內碰資源，出事的時候你得收得回來。同一批工具的橫向比較那篇做過了，這裡不重做。

這個缺口是有紀錄的。在這篇之前，站上有 12 篇 zh-TW 文章提過 Tailscale，而且幾乎全在自架 agent 的脈絡裡：[OpenClaw 的 Gateway 網路面](/posts/ai/2026-03-28-openclaw-gateway-network)、[OpenClaw 上雲](/posts/ai/2026-03-28-openclaw-install-cloud)、[Hermes 的安全模型](/posts/ai/2026-08-18-hermes-agent-security)、[自架常駐個人 agent 橫向對照](/posts/ai/2026-08-18-self-hosted-personal-agents-landscape)。除了那篇 Cloudflare Tunnel，其餘每一次都是順帶提及。（計數用 `grep -rlE "\bTailscale\b"` 與 `grep -rli tailscale` 兩種方法對過，結果一致。）

## WireGuard 是資料面，控制面是 Tailscale 自己的

常見的一句話是「Tailscale 就是 WireGuard」。這句不準，而且不準的地方正好是它的產品本體。

[WireGuard](https://www.wireguard.com/) 官網把自己的範圍講得很清楚：

> All issues of key distribution and pushed configurations are out of scope of WireGuard; these are issues much better left for other layers.

也就是說，WireGuard 給你的是一條加密隧道：兩端各自持有對方的公鑰，就能開始傳封包。至於這些公鑰怎麼互相送達、對方現在人在哪個 IP、換了咖啡廳 Wi-Fi 之後怎麼重連、誰有資格加入——WireGuard 明說不管。

Tailscale 補的就是這一層。依官方那篇 [How Tailscale works](https://tailscale.com/blog/how-tailscale-works)，資料面用的是 WireGuard，具體是 userspace 的 Go 版 `wireguard-go`。控制面則是它自己的協調伺服器 `login.tailscale.com`，官方形容它是「a shared drop box for public keys」。每個節點把公鑰和目前位置放上去，再把同一個 tailnet 裡其他節點的公鑰抓下來，然後自己設定 WireGuard。

三個推論對自架 agent 直接有用：

- **私鑰永遠不離開節點。** 協調伺服器只經手公鑰，所以它看不到你的流量內容。
- **控制面是星狀，資料面是網狀。** 中央那條只送幾把金鑰跟政策，實際流量在兩台機器之間直連，不會繞到某個集中點再回來。
- **打不通的時候有 DERP 中繼。** 遇到封鎖 UDP 的網路，流量會走 Tailscale 的 DERP 中繼伺服器，但中繼一樣沒有私鑰，只是盲目轉發已加密的封包。

要今晚驗證這件事：在 agent 那台機器跑 `tailscale status`，看它跟你手機那列後面寫的是 `direct` 還是 `relay`。`relay` 代表 NAT 沒打通，正走 DERP，延遲會高一截。

## 問題一：連得到，但不在公網上

自架 agent 的第一個網路決定，是它的控制介面綁在哪裡。這件事[OpenClaw 的 Gateway 那篇](/posts/ai/2026-03-28-openclaw-gateway-network)寫過官方立場：Gateway 預設綁 loopback，綁到 loopback 以外一律強制要求認證。tailnet 讓「綁 loopback」跟「從外面連得到」不再互斥——服務只聽本機，經由 Tailscale 的 `100.x` 位址曝露給 tailnet 裡的裝置。

Tailscale 對這件事有兩個名字很像、後果差很多的功能：

| | Tailscale Serve | Tailscale Funnel |
|---|---|---|
| 誰連得到 | 只有你 tailnet 裡的裝置 | 公開網際網路上任何人 |
| 身分標頭 | 會加 `Tailscale-User-Login` 等標頭，並移除請求裡偽造的同名標頭 | 沒有 |
| 埠 | 不限 | 只有 443、8443、10000 |
| 狀態 | 正式 | 官方文件標為 beta，且有不可設定的頻寬上限 |

[Serve](https://tailscale.com/kb/1312/serve) 給你的是一個 `https://<機器名>.<tailnet>.ts.net` 的網址，憑證由 Tailscale 簽發，只有 tailnet 內連得到。[Funnel](https://tailscale.com/kb/1223/funnel) 則是把同一個服務推上公開網際網路。

agent 的控制介面應該走 Serve。Funnel 的正當用途是把一個 webhook 端點公開給外部服務打，不是掛 agent 的操作介面。用 Funnel 掛操作介面，等於把你剛才避開的公網曝露又加回來，而且 Funnel 不帶身分標頭，backend 拿不到「這是誰」。真的要用 Funnel 接 webhook，官方建議讓 backend 只聽 localhost；否則同一台機器以外的人可以繞過 Serve，直接送偽造標頭進來。

## 問題二：agent 要碰內網資源，你不想把資料庫搬上公網

agent 常常需要一個「不在 tailnet 裡」的東西：家裡的 NAS、公司的 Postgres、一台不能裝 client 的印表機、雲端 VPC 裡的 RDS。

這是 [subnet router](https://tailscale.com/kb/1019/subnets) 解決的問題，不是 exit node。兩者常被混在一起，但解的是相反方向：

- **subnet router**：一台裝了 Tailscale 的機器，對外宣告它背後的網段（例如 `192.168.1.0/24`）。tailnet 裡的裝置就能用內網 IP 連到那些機器，而那些機器完全不需要裝 Tailscale。官方文件講得直白：`Managed service access—securely connect to cloud-managed services like Amazon RDS or Google Cloud SQL without exposing them to the public internet.` 另外一個實務好處是，躲在 subnet router 後面的裝置不計入方案的裝置額度。
- **exit node**：讓一台裝置的**所有**對外流量（也就是預設路由 `0.0.0.0/0` 與 `::/0`）都從另一台機器出去。它處理的是「我的流量從哪個 IP 出現在網際網路上」，不是「我怎麼碰到內網」。這條要另外開權限：官方文件說，允許連到 exit node 這台機器（例如 SSH）並不等於允許拿它當出口，後者要有一條 `dst` 是 `autogroup:internet` 的規則。

放到自架 agent 上，兩者都有用，但用途不同。subnet router 讓 agent 讀得到內網資料庫，而不必把資料庫開上公網。exit node 則是把 agent 的對外流量固定從某個出口出去；如果你有服務靠 IP allowlist 放行，這條很實際。

今晚可以做的：在那台 Linux 機器上開 IP forwarding，然後跑

```bash
sudo tailscale up --advertise-routes=192.168.1.0/24
```

然後回 admin console 的 Machines 頁核准這條路由。這裡有個很多人卡住的地方，官方特別點名：**路由核准和存取規則是兩套獨立的機制**。核准只決定這條路由會不會被塞進其他裝置的路由表，能不能真的連過去還是由 ACL 決定。兩邊都要設。

另外注意 subnet router 預設開 SNAT：從它背後出來的流量看起來是從 router 自己發出的，不是原始裝置。要在資料庫端用來源 IP 做稽核的話，這個預設會讓你看不到真正的來源。

## 問題三：agent 的權限邊界寫在哪裡

這是自架 agent 最該花時間的一節，也是最容易誤會的一節。

**先講最重要的坑：新建的 tailnet 預設是全通的。** [官方 ACL 文件](https://tailscale.com/kb/1018/acls)寫得很明白：

> When you first create your tailnet, the default tailnet policy file enables communication between all devices within the tailnet.

而且「deny-by-default」這個描述只在你有寫 `acls` 區段時才成立——文件同一段接著說，policy 檔裡沒有 `acls` 區段時，套用的是預設的 allow all。所以「我裝了 Tailscale，所以有邊界了」是錯的：你裝了 Tailscale，所以那台 agent 現在可以連到你 tailnet 裡的每一台機器，包括你的筆電。

今晚就能做的第一件事：打開 admin console 的 Access controls 頁，看 `acls` 區段是不是還是預設的全通。

要把邊界寫下來，Tailscale 的機制有兩層。

**第一層是身分。** [tag](https://tailscale.com/kb/1068/tags) 是給非人類裝置用的身分，官方的說法是「essentially service accounts」。tag 由 policy 檔裡的 `tagOwners` 定義，只有 tag 的擁有者能把它貼到裝置上。三個會影響 agent 部署的性質：

- 貼上 tag 會**移除**該裝置原本的使用者身分，反過來也一樣。一台機器只能二選一。
- 貼 tag 並重新認證之後，該裝置的 key expiry 預設是關掉的。
- 帶 tag 身分的裝置**不能**用 Tailscale SSH 連到帶使用者身分的裝置。

第三條剛好是自架 agent 想要的預設邊界：agent 那台機器連不進你的 MacBook。所以那台常駐 agent 應該用 `--advertise-tags=tag:agent` 起，而不是用你的個人帳號登入。用你的帳號登入代表它繼承了「你」這個身分，之後所有針對 `autogroup:member` 寫的規則，agent 都吃得到。

**第二層是規則。** ACL 的最小單位是 `src`、`dst`、埠，由每台裝置本機的封包過濾器執行。依官方描述，規則的執行「happens on each device directly, without further involvement from Tailscale's coordination server」。要注意的是，Tailscale 現在推的是新一代語法 grants。同一份文件說 ACL 會**無限期**支援下去，但「ACLs will not receive any new features」——新寫的政策就直接用 grants。

給 agent 的規則長這樣：你自己連得到 `tag:agent`，`tag:agent` 連得到資料庫那台、連不到其他任何東西。免費的 Personal 方案有 3 個 ACL group 可用，對個人部署夠了；Standard 是 10 個、Premium 300 個。

## 問題四：出事的時候怎麼收回

agent 出事的形態跟一般服務不一樣：它可能沒被入侵，只是讀到一份帶隱藏指令的文件，然後很配合地照做。所以「怎麼收回」要當成日常操作看，不是災難復原程序。

Tailscale 在這件事上的好消息是快。改完 policy 之後，官方文件說用戶端「respond to the new rules within seconds」，而且會**中斷已經建立的連線**。撤權不需要等 session 過期。

壞消息有三個，全都在細節裡。

**第一，移除裝置不等於撤銷。** 官方[移除裝置文件](https://tailscale.com/docs/features/access-control/device-management/how-to/remove)寫著，移除後裝置會立刻失去對 tailnet 所有資源的連線。但同一段接著說：「If device approval is not enabled in your tailnet, the device can be added back to the tailnet without needing re-authorization by a tailnet admin」。如果那台機器上還有有效的憑證或 auth key，它可以自己走回來。同一頁還有一條容易忽略的：直接把 Tailscale client 移除安裝，裝置並不會從 tailnet 消失。

**第二，tag 帶來的 key expiry 預設是一把雙面刃。** [Key expiry 文件](https://tailscale.com/docs/features/access-control/key-expiry)說新網域預設 180 天要重新認證一次，可自訂 1 到 180 天。但貼了 tag 的裝置預設關掉過期——這正是你要的（agent 不會半夜掉線要人重登），代價是那台機器不會自己失效，撤銷完全靠你手動。所以 device approval 一定要開。

**第三，控制面是別人的。** 你信任 Tailscale 的協調伺服器不會偷偷塞一個節點進你的 tailnet。想把這個信任收回自己網路裡，官方的答案是 [Tailnet Lock](https://tailscale.com/kb/1226/tailnet-lock)。開啟之後，新節點的公鑰必須由你指定的簽署節點簽名，其他節點會先驗簽再接受連線。官方對它的定位講得很老實：

> With Tailnet Lock enabled, even if Tailscale were malicious or Tailscale infrastructure hacked, attackers can't send or receive traffic in your tailnet.

代價要先知道。至少要指定兩個簽署節點，初始化時會產生 10 組 disablement secret，停用時只需要其中一組。這些密語只在初始化那一刻顯示一次。文件的原話是，如果你弄丟了、又沒有留一份給 Tailscale 支援，那個 tailnet 就救不回來了。它也是 TOFU 模型：第一次還是得信任控制面，之後才把信任中心搬到自己的節點上。

還有一層在網路之上：agent 手上那把模型供應商的 API key。Tailscale 2026 年推的 [Aperture](https://tailscale.com/docs/aperture) 就是在收這個。它是一個 AI gateway，把供應商金鑰集中在 gateway 裡；用戶端靠 Tailscale 身分認證，再由 gateway 代打上游。附帶的是每個請求的 session log 與花費上限，它也能代理 MCP server 並套用以身分為基礎的存取控制。它要解的問題，官方 blog 描述得很具體：

> It gets copied into a local .env file for testing. Then into a CI pipeline. Then into a container. Then into an agent runtime so it can call a model or tool on its own.

分寸也要講清楚：2026-08 實查，文件頁把 Aperture 標為 beta，更早的公告文寫的是 alpha。它是跟 Tailscale 方案分開購買的產品，值得知道，還不到「照著做」。

## 定價：2026-08 實查

| 方案 | 價格 | 使用者 | ACL groups | 其他 |
|---|---|---|---|---|
| Personal | $0 | 最多 6 人 | 3 | user device 無上限、含 50 個 tagged resource、每月 1,000 分鐘 ephemeral 額度 |
| Standard | 每人每月 $8 | 依席次 | 10 | Tailscale SSH 最多 5 台主機、SCIM |
| Premium | 每人每月 $18 | 依席次 | 300 | network flow logs、log streaming |
| Enterprise | 洽談 | 依席次 | 自訂 | 發票付款、SLA |

幾個容易踩到的細節，都在官方定價頁的 FAQ 裡：

- 計價單位是**席次**，不是裝置。user device 每個方案都無上限，但 tagged resource 每個方案含 50 個，超過的部分每個每月 $1。你的 agent 機器、subnet router、exit node 全都應該是 tagged resource——所以個人部署基本上碰不到這條線，但那是「50 個」而不是「無上限」。
- Personal 方案明講**只限非商用**。而且用自訂網域註冊會被當成商用，自動進試用；要用個人方案得在 admin console 裡選擇退出試用。
- 非營利組織與教育機構有 50% 折扣，需要提供登記文件。

順帶更正一則站上的舊數字。前述那篇 Cloudflare Tunnel 文把免費方案寫成「100 裝置、3 users」，那是舊的 Personal 方案。依上表，現在是最多 6 個使用者，user device 無上限。

## 什麼時候不該用它

**它是連線層，不是沙箱。** Tailscale 決定「哪些機器能跟哪些機器的哪些埠講話」。agent 在那台機器上仍然有一個 shell，能讀本機檔案、能對外發 HTTP。網路邊界擋不住這一層——那需要的是[隔離後端與工具權限](/posts/ai/2026-08-18-hermes-agent-security)那一類機制。把 tailnet 當成「agent 已經關好了」的證據，是這篇最不希望被讀出來的結論。

**你不能接受 SaaS 控制面，而 Tailnet Lock 的代價又太高。** 那條路是自架 [Headscale](https://github.com/juanfont/headscale)——Tailscale 除了控制伺服器與 Windows／Apple 平台的 GUI client 之外都是開源的，Headscale 補的正是那個控制伺服器。Tailnet Lock 的官方文件自己也把它列為替代選項，並直說那會失去 SaaS 模式的可用性保證與低維運成本。Headscale 自述的射程也很窄：它只支援單一 tailnet，目標使用者是自架玩家與小型開源組織。

**你要的是把服務公開給不特定的人。** 那是 Cloudflare Tunnel 或反向代理的題目，不是 tailnet 的。

**你的部署橫跨很多種平台。** Funnel 與 Serve 的部分功能在 App Store 版 macOS client 上受沙箱限制，分享檔案與目錄只有開源版能做。這類平台差異在跨裝置部署前要先查過。

## 整體來說

自架常駐 agent 的網路問題可以拆成四個，Tailscale 對每一個都有一個具體機制。連得到而不上公網，是 tailnet 加 Serve。碰得到內網，是 subnet router。權限邊界，是 tag 加 ACL/grants。收得回來，是 policy 秒級生效、device approval 與 Tailnet Lock。

如果只從這篇拿走一件事：**新建的 tailnet 預設是全通的。** 你那台 agent 現在連得到你的筆電。去 Access controls 頁看一眼，然後把 `acls` 寫成只允許該連的那幾條。

---

## 參考資料

- [Tailscale Pricing](https://tailscale.com/pricing) — 席次計價、Personal 方案額度、tagged / ephemeral resource 定義（2026-08 實查）
- [How Tailscale works](https://tailscale.com/blog/how-tailscale-works) — WireGuard 資料面、協調伺服器、NAT traversal 與 DERP
- [WireGuard 官方網站](https://www.wireguard.com/) — cryptokey routing，以及金鑰分發不在其範圍內的聲明
- [Manage permissions using ACLs — Tailscale Docs](https://tailscale.com/kb/1018/acls) — 預設 allow all、deny-by-default 的成立條件、grants 與 ACL 的關係
- [Group devices with tags — Tailscale Docs](https://tailscale.com/kb/1068/tags) — tag 作為服務帳號、tagOwners、tag 與使用者身分互斥
- [Subnet routers — Tailscale Docs](https://tailscale.com/kb/1019/subnets) — 路由宣告與核准、SNAT、路由核准與存取規則是兩套機制
- [Exit nodes — Tailscale Docs](https://tailscale.com/kb/1103/exit-nodes) — 預設路由、`autogroup:internet`、連接器金鑰過期時的 fail close
- [Tailscale Serve — Tailscale Docs](https://tailscale.com/kb/1312/serve) — tailnet 內曝露、身分標頭與標頭偽造防護
- [Tailscale Funnel — Tailscale Docs](https://tailscale.com/kb/1223/funnel) — 公開曝露、埠限制、beta 狀態與頻寬上限
- [Tailnet Lock — Tailscale Docs](https://tailscale.com/kb/1226/tailnet-lock) — 簽署節點、TKA、disablement secret 與 TOFU 模型
- [Key expiry — Tailscale Docs](https://tailscale.com/docs/features/access-control/key-expiry) — 預設 180 天、自訂期間、tagged 裝置的預設行為
- [Remove a device — Tailscale Docs](https://tailscale.com/docs/features/access-control/device-management/how-to/remove) — 移除後可自行重新加入的條件
- [Tailscale SSH — Tailscale Docs](https://tailscale.com/docs/features/tailscale-ssh) — 政策數秒內生效並中斷既有連線、check mode
- [Aperture — Tailscale Docs](https://tailscale.com/docs/aperture) — AI gateway、身分認證、MCP 代理與花費控制
- [Aperture by Tailscale: More secure AI now available via self-serve](https://tailscale.com/blog/aperture-self-serve) — 金鑰擴散的問題描述
- [Headscale — GitHub](https://github.com/juanfont/headscale) — 自架控制伺服器、單一 tailnet 的設計射程
- [從外面連回家裡的 Mac：Cloudflare Tunnel 與 2026 的替代方案](/posts/tech/2026-05-08-cloudflare-tunnel-mac-remote-2026) — 反方向的問題與各家工具比較
- [OpenClaw Gateway 的網路面](/posts/ai/2026-03-28-openclaw-gateway-network) — 綁定預設、認證要求與拓撲建議
- [Hermes 的 agent 安全模型](/posts/ai/2026-08-18-hermes-agent-security) — 網路之上的工具權限與隔離後端

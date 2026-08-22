---
title: "WireGuard：用 Cryptokey Routing 建立最小化 VPN Tunnel"
date: 2026-08-22
category: tech
type: deep-dive
tags: [wireguard, vpn, networking, security]
lang: zh-TW
tldr: "WireGuard 是小而明確的 L3 加密 tunnel；它把 public key、peer 與 AllowedIPs 綁在一起，但不替團隊提供 identity、裝置管理或 policy control plane。"
description: "介紹 WireGuard cryptokey routing、AllowedIPs、roaming、NAT、key distribution、routing 與企業存取邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 98
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-wireguard-vpn-tunnel-en)

[WireGuard](https://www.wireguard.com/) 是在 layer 3 傳送 IP packet 的加密 tunnel。它刻意只處理少量核心問題：peer key、加密握手、封包封裝與路由。沒有帳號目錄、SSO、裝置 posture、審批流程或中央管理 UI；這份「少」既是優點，也是導入時最容易漏算的工作。

## AllowedIPs 同時是路由與 ACL

每個 peer 以 public key 識別。送出封包時，destination IP 由最長前綴比對決定交給哪個 peer；收到封包時，source IP 必須落在該 peer 的 `AllowedIPs`，否則丟棄。WireGuard 把這套設計稱為 cryptokey routing。

```ini
[Interface]
Address = 10.20.0.2/32
PrivateKey = <client-private-key>

[Peer]
PublicKey = <gateway-public-key>
Endpoint = vpn.example.com:51820
AllowedIPs = 10.30.0.0/16
PersistentKeepalive = 25
```

`AllowedIPs = 0.0.0.0/0, ::/0` 是 full tunnel；只列內網 prefix 是 split tunnel。設定重疊 prefix、雙向 route、IP forwarding、firewall、DNS 與 MTU 都要一起設計。它不會自動避免多站點 CIDR 衝突，也不會替 application 做 authorization。

WireGuard 能在已驗證的封包到達新 endpoint 時更新 peer endpoint，因此可支援 roaming。NAT 後方 idle peer 若需要維持 mapping，可設 `PersistentKeepalive`；官方建議的常見值是 25 秒，但不應無差別開啟。

## Key distribution 才是營運難題

WireGuard 使用現代且固定的 cryptographic primitives，避免 cipher negotiation 的複雜度；但 private key 仍是長期高權限 credential。團隊必須自行處理產生、配送、撤銷、輪替、遺失裝置、peer inventory 與設定同步。Pre-shared key 可加入額外的對稱密鑰層，仍不能取代 public-key identity 與 key lifecycle。

原生 WireGuard 適合少量固定 site-to-site、homelab、受控 server fleet，或作為更高層產品的 data plane。Tailscale、NetBird 類產品在其上加入 discovery、NAT traversal、identity 與 policy；Twingate 偏 resource-level ZTNA；Teleport 則管理 SSH、Kubernetes、database 等 infrastructure session。若需求是「員工離職時按一次就撤銷全部權限」，純 WireGuard 代表必須自己建 control plane。

Production 驗收至少包含 key rotation、lost-device revoke、route overlap、IPv6、DNS leak、MTU/fragmentation、NAT keepalive、gateway failover、kill switch、auditability 與 emergency access。WireGuard 把 tunnel 做得很小，並沒有讓整個存取系統變小。

## 參考資料

- [WireGuard official site](https://www.wireguard.com/)
- [WireGuard Quick Start](https://www.wireguard.com/quickstart/)
- [WireGuard protocol and cryptokey routing whitepaper](https://www.wireguard.com/papers/wireguard.pdf)
- [wg configuration manual](https://man7.org/linux/man-pages/man8/wg.8.html)

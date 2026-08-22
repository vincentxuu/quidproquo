---
title: "ZeroTier：以 Controller 與 Flow Rules 組出跨網路 Virtual LAN"
date: 2026-08-22
category: tech
type: deep-dive
tags: [zerotier, vpn, networking, sdwan]
lang: zh-TW
tldr: "ZeroTier 把裝置放進可管理的 virtual L2/L3 network，嘗試 peer-to-peer 傳輸並由 controller 發布成員與 policy；它比單純 tunnel 更像軟體定義網路。"
description: "介紹 ZeroTier identities、controllers、roots、managed routes、bridging、Flow Rules、NAT traversal 與營運邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 100
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-zerotier-virtual-network-en)

[ZeroTier](https://docs.zerotier.com/) 建立軟體定義的 virtual Ethernet network。每個 node 有 cryptographic identity；加入 network 後，controller 決定 membership、分配 managed IP、routes 與 capabilities，data plane 優先直接 peer-to-peer，必要時經 root infrastructure relay。

## Controller 管設定，node 傳資料

Hosted ZeroTier Central 是常用 controller，也能 self-host controller。Self-host 不代表完全脫離公共 root：controller 與 root/planet 扮演不同角色；若要自建 root infrastructure，還需規劃 moon／custom planet、discovery、升級與可用性。Controller outage 對既有 flow 和新授權的影響也應實測。

Managed routes 可把實體 LAN subnet 經某個 member 宣告給 virtual network。若舊設備不能安裝 client，可做 routing 或 layer-2 bridging；bridge 會帶入 broadcast、loop、MTU 與 failure-domain 問題，非必要不要把整個 broadcast domain 延伸跨站點。

Flow Rules 在分散式 data plane 執行，可依 source/destination tag、IP、protocol 與 port accept、drop、redirect 或 rate-limit。規則語言比單純 peer list 強，也更容易因寬鬆預設造成橫向移動。Policy 要 deny-first、版本控制、用測試 node 驗證，並保留 controller audit。

ZeroTier 適合跨 OS 裝置、branch network、lab、遊戲或需要 L2 semantics 的場景。WireGuard 更小且手動；Tailscale 以 WireGuard 與 identity ACL 為中心；Twingate 聚焦 user-to-resource；Teleport 聚焦 audited infrastructure session。驗收需涵蓋 NAT traversal、relay fallback、overlapping CIDR、DNS、IPv6、MTU、controller compromise、member revoke、route spoofing 與 bridge loop。

## 參考資料

- [ZeroTier documentation](https://docs.zerotier.com/)
- [ZeroTier protocol](https://docs.zerotier.com/protocol/)
- [Network controllers](https://docs.zerotier.com/controller/)
- [Rules engine](https://docs.zerotier.com/rules/)
- [Route between physical and virtual networks](https://docs.zerotier.com/route-between-phys-and-virt/)

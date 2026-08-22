---
title: "WireGuard: Minimal VPN Tunnels with Cryptokey Routing"
date: 2026-08-22
category: tech
type: deep-dive
tags: [wireguard, vpn, networking, security]
lang: en
tldr: "WireGuard is a small, explicit layer-3 encrypted tunnel that binds public keys, peers, and AllowedIPs, but it does not supply identity, device management, or a policy control plane."
description: "WireGuard cryptokey routing, AllowedIPs, roaming, NAT, key distribution, routing, and enterprise access boundaries."
series:
  name: "AI 時代的技術選擇"
  order: 98
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-wireguard-vpn-tunnel)

[WireGuard](https://www.wireguard.com/) is an encrypted tunnel carrying IP packets at layer 3. It deliberately handles a narrow core: peer keys, encrypted handshakes, packet encapsulation, and routing. It has no user directory, SSO, device posture, approval workflow, or central management UI. That smallness is both its strength and the work most frequently omitted from adoption estimates.

## AllowedIPs is routing and access control

Each peer is identified by a public key. For outbound packets, longest-prefix matching selects a peer from the destination address; for inbound packets, the source must belong to that peer's `AllowedIPs`. WireGuard calls this cryptokey routing.

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

`AllowedIPs = 0.0.0.0/0, ::/0` creates a full tunnel; internal prefixes create split tunneling. Overlapping prefixes, return routes, forwarding, firewalls, DNS, and MTU require deliberate design. WireGuard neither resolves overlapping site CIDRs nor authorizes application actions.

After authenticating traffic from a new endpoint, WireGuard can update the peer endpoint, enabling roaming. A peer behind NAT can use `PersistentKeepalive` to retain an idle mapping; 25 seconds is the common official suggestion, not a universal default.

## Key distribution is the operating problem

WireGuard fixes a modern cryptographic suite and avoids cipher negotiation complexity, but a private key remains a long-lived privileged credential. Operators must build generation, delivery, revocation, rotation, lost-device handling, peer inventory, and configuration synchronization. An optional pre-shared key adds symmetric material without replacing public-key identity or lifecycle management.

Raw WireGuard fits small static site-to-site links, homelabs, controlled server fleets, or a data plane beneath another product. Tailscale and NetBird add discovery, NAT traversal, identity, and policy; Twingate targets resource-level ZTNA; Teleport manages infrastructure sessions for SSH, Kubernetes, and databases. If offboarding must revoke every permission in one action, plain WireGuard requires a control plane of your own.

Production tests should cover key rotation, lost-device revocation, overlapping routes, IPv6, DNS leaks, MTU and fragmentation, NAT keepalive, gateway failover, kill switches, auditability, and emergency access. A small tunnel protocol does not make the entire access system small.

## References

- [WireGuard official site](https://www.wireguard.com/)
- [WireGuard Quick Start](https://www.wireguard.com/quickstart/)
- [WireGuard protocol and cryptokey routing whitepaper](https://www.wireguard.com/papers/wireguard.pdf)
- [wg configuration manual](https://man7.org/linux/man-pages/man8/wg.8.html)

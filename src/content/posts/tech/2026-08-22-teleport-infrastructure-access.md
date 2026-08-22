---
title: "Teleport：以短效憑證、RBAC 與 Session Audit 管理基礎設施存取"
date: 2026-08-22
category: tech
type: deep-dive
tags: [teleport, zero-trust, security, kubernetes, ssh]
lang: zh-TW
tldr: "Teleport 是 protocol-aware infrastructure access platform：Auth Service 簽短效憑證，Proxy 與 Agents 代理 SSH、Kubernetes、database、app 等資源並留下 audit evidence。"
description: "介紹 Teleport Auth/Proxy Services、Agents、short-lived certificates、RBAC、access requests、session recording 與 workload identity。"
series:
  name: "AI 時代的技術選擇"
  order: 102
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-teleport-infrastructure-access-en)

[Teleport](https://goteleport.com/docs/core-concepts/) 不是一般 VPN，而是理解 SSH、Kubernetes、database、web app、Windows desktop 與 cloud API 的 infrastructure access platform。它把 long-lived static credentials 換成由 identity、role 與 resource label 限制的短效 certificates，並集中 audit events 與 session recordings。

## Auth Service 是信任根，Proxy 是入口

Auth Service 維護 certificate authorities、roles、users、connectors 與 audit state；Proxy Service 暴露單一入口並把流量導向內網 Agents。Agents 以 reverse tunnel 加入 cluster，驗證使用者 certificate 中的 roles，再代理到實際 resource。Self-host 時，Auth backend、CA keys、Proxy HA、TLS、backup 與升級都屬關鍵基礎設施；Cloud 版則由供應商管理 control plane。

使用者經 SSO/MFA 登入 `tsh` 或 Web UI 取得短效 credential，再以原生工具連線，例如 `ssh`、`kubectl` 或 database client。RBAC 可依 labels 選 resource，Access Requests 提供 just-in-time elevation；deny rule、session TTL、reviewer separation 與 emergency path 必須一起設計。部分進階治理能力依 edition 而異，選型不能只看 Community 文件範例。

Session recording 對稽核很有價值，但也可能保存 command、畫面或敏感輸出。要定義存取、retention、export、redaction 與錄影失敗時 fail-open/fail-closed 行為。Database 或 application access 的 JWT／mTLS 也不自動提供 application object-level authorization。

Machine & Workload Identity 以 `tbot` 持續取得短效憑證，適合 CI 與 service account；bootstrap join token 仍要防竊取，cloud attestation、renewal failure 與 bot role blast radius 需測試。Teleport 適合需要 JIT、protocol-aware audit 與集中憑證生命週期的工程組織；Twingate 較像透明 resource networking，WireGuard/ZeroTier 是 network fabric，ngrok 是 ingress。

## 參考資料

- [Teleport core concepts](https://goteleport.com/docs/core-concepts/)
- [Teleport architecture](https://goteleport.com/docs/reference/architecture/)
- [Teleport authorization](https://goteleport.com/docs/reference/architecture/authorization/)
- [Teleport Agent architecture](https://goteleport.com/docs/reference/architecture/agents/)
- [Machine & Workload Identity architecture](https://goteleport.com/docs/reference/architecture/machine-id-architecture/)
- [Session recording](https://goteleport.com/docs/zero-trust-access/management/session-recording/)

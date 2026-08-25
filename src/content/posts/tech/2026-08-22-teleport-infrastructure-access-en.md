---
title: "Teleport: Infrastructure Access with Short-Lived Credentials, RBAC, and Session Audit"
date: 2026-08-22
category: tech
type: deep-dive
tags: [teleport, zero-trust, security, kubernetes, ssh]
lang: en
tldr: "Teleport is a protocol-aware infrastructure access platform: its Auth Service signs short-lived credentials, while Proxies and Agents mediate SSH, Kubernetes, database, and app access with audit evidence."
description: "Teleport Auth and Proxy Services, Agents, short-lived certificates, RBAC, access requests, session recording, and workload identity."
series:
  name: "Technology Choices in the AI Era"
  order: 102
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-teleport-infrastructure-access)

[Teleport](https://goteleport.com/docs/core-concepts/) is not a generic VPN. It is an infrastructure access platform aware of SSH, Kubernetes, databases, web apps, Windows desktops, and cloud APIs. It replaces long-lived static credentials with short-lived certificates constrained by identities, roles, and resource labels, while collecting audit events and session recordings.

## Auth is the trust root; Proxy is the entrance

The Auth Service maintains certificate authorities, roles, users, connectors, and audit state. The Proxy Service exposes an entry point and routes traffic to private Agents. Agents join through reverse tunnels, verify roles embedded in user certificates, and proxy target resources. Self-hosting makes Auth storage, CA keys, Proxy availability, TLS, backup, and upgrades critical infrastructure; the Cloud edition manages that control plane.

Users authenticate through SSO and MFA in `tsh` or the Web UI, receive short-lived credentials, and continue with native clients such as `ssh`, `kubectl`, and database tools. Label-based RBAC selects resources, while Access Requests enable just-in-time elevation. Design deny rules, session TTL, reviewer separation, and emergency access together. Advanced governance differs by edition, so Community examples are not a complete purchasing specification.

Session recording is useful evidence but may retain commands, screens, and sensitive output. Define access, retention, export, redaction, and fail-open or fail-closed behavior when recording breaks. JWT or mTLS for database and application access still does not implement application-level object authorization.

Machine & Workload Identity uses `tbot` to renew short-lived credentials for CI and services. Bootstrap tokens remain sensitive, while cloud attestation, renewal failure, and bot-role blast radius need testing. Teleport fits organizations needing JIT, protocol-aware audit, and centralized credential lifecycle. Twingate provides more transparent resource networking; WireGuard and ZeroTier provide network fabric; ngrok provides ingress.

## References

- [Teleport core concepts](https://goteleport.com/docs/core-concepts/)
- [Teleport architecture](https://goteleport.com/docs/reference/architecture/)
- [Teleport authorization](https://goteleport.com/docs/reference/architecture/authorization/)
- [Teleport Agent architecture](https://goteleport.com/docs/reference/architecture/agents/)
- [Machine & Workload Identity architecture](https://goteleport.com/docs/reference/architecture/machine-id-architecture/)
- [Session recording](https://goteleport.com/docs/zero-trust-access/management/session-recording/)

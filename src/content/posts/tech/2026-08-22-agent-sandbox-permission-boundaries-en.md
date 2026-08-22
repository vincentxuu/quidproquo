---
title: "AI Agent Sandbox Escapes and Permission Boundaries: A Container Is Not the Whole Boundary"
date: 2026-08-22
category: tech
type: deep-dive
tags: [ai-agent, sandbox, security, least-privilege, containers]
lang: en
tldr: "Agent execution must constrain kernels, filesystems, processes, networks, credentials, and tool authorization; sandbox escape is only one path, and an overpowered API token is often more direct."
description: "AI agent sandbox threat models, container, VM, and isolate boundaries, Linux capabilities, seccomp, filesystems, egress, ephemeral credentials, tool permissions, approval, and escape testing."
series:
  name: "AI 時代的技術選擇"
  order: 121
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-agent-sandbox-permission-boundaries)

An AI agent that can execute shells, Python, browsers, MCP tools, or cloud APIs is an untrusted workload processing attacker-controlled instructions. Prompt injection need not break a model persona: a repository README, web page, email, or tool result can simply induce a privileged action.

## Inventory capabilities before choosing containers

A threat model lists readable and writable host or workspace paths, permitted processes, Docker sockets and kernel devices, reachable network destinations, user and service credentials, tools and actions, and output recipients. Every capability needs default denial, scope, expiry, rate and size limits, and audit.

A standard container shares the host kernel and is not equivalent to a VM boundary. Arbitrary hostile code and multi-tenant artifacts may warrant microVMs, VMs, sandboxed runtimes, or dedicated nodes; each still has escape vulnerabilities and patch obligations. Kubernetes Restricted Pod Security is a baseline, not a complete sandbox. Add non-root execution, read-only root filesystems, dropped capabilities, seccomp, AppArmor or SELinux, no privilege or host paths and namespaces, resource and PID limits, and an isolated runtime class.

## The common escape is legitimate use of excessive privilege

An agent holding a production database admin token or unrestricted cloud key needs no kernel exploit; ordinary HTTPS can exfiltrate or delete. A broker should issue short-lived capabilities bound to user, task, resource, and action rather than inject broad secrets into the environment. Tool gateways reauthorize every call, validate arguments and object scopes, enforce idempotency, and require step-up authentication or human approval for sends, deletes, payments, and deployments.

Use per-run ephemeral workspaces, mount only required inputs, and export outputs through allowlists. Block SSH keys, cloud metadata, host sockets, and other tenants. Deny network egress by default and allow destinations through a service proxy, defending against DNS rebinding, redirects to private addresses, loopback and metadata endpoints, and covert data tunnels. Downloads, archive extraction, links, Git hooks, and package install scripts all cross boundaries.

## Acceptance tests prove what cannot happen

Red teams should attempt protected-file reads, cross-workspace access, metadata and private-network calls, fork bombs, disk, memory, and PID exhaustion, mount and socket escapes, credential theft, approval bypass, and privilege borrowing across agents. Capture syscall, network, and tool audit; enforce timeouts and kills; destroy environments and revoke credentials afterward.

Classifiers such as Model Armor reduce malicious content, and Promptfoo replays attacks. Impact is bounded by sandboxes, network policy, credential brokers, and authorization. The goal is not a model that can never be deceived, but minimal, recoverable, attributable capability when it is.

## References

- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)
- [Kubernetes Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- [Kubernetes security checklist](https://kubernetes.io/docs/concepts/security/security-checklist/)
- [Docker seccomp security profiles](https://docs.docker.com/engine/security/seccomp/)
- [Docker rootless mode](https://docs.docker.com/engine/security/rootless/)
- [Linux capabilities manual](https://man7.org/linux/man-pages/man7/capabilities.7.html)

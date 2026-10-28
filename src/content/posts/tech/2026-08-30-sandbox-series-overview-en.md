---
title: "Sandbox Series Overview: AI Agent Execution Environment Reading Map"
date: 2026-08-30
category: tech
type: guide
tags: [sandbox, ai-agent, overview, series]
lang: en
tldr: "The overview entry point (order 0) of the Sandbox Series. Explains at which isolation layer untrusted agent code should run, which provider to pick, and how to configure permissions, credentials, and network boundaries; technical details live in eight sub-series, this post is the map only."
description: "Sandbox Series overview: what the series covers, the eight sub-series and reading paths, for readers who need a quick full picture of agent sandboxing."
series:
  name: "Sandbox Series"
  order: 0
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-sandbox-series-overview)

## What This Post Is

This post is the overview (order 0) and entry point of the Sandbox Series. It does not cover specific sandbox technologies (Namespace, gVisor, Firecracker, etc. are covered in later posts). It does one thing: **tell you what this series covers, where the eight sub-series sit, and where you should start reading based on your role.**

If you are designing or maintaining an environment where AI agents run untrusted code, this series answers three core questions:

1. **At which isolation layer should the code run?** — Container, gVisor, Firecracker microVM, or a managed sandbox?
2. **Which provider or self-hosted option should you choose?** — E2B, Daytona, Runloop, Vercel, Cloudflare, Modal, AWS Bedrock AgentCore, Alibaba OpenSandbox, Azure Container Apps, or self-build Kata/Kubernetes?
3. **How to configure permissions, credentials, and network boundaries — so you avoid "thinking you are sandboxed when you are not"?**

---

## Series at a Glance: Eight Sub-Series, 29 Posts

The full series covers 29 posts (Chinese and English each), divided into eight sub-series. Each sub-series matches a different reader need and decision stage:

| Sub-Series | Posts | Dimension | Best For |
|------------|-------|-----------|----------|
| **0: Series Overview** | 1 | Entry map | All new readers |
| **1: Motivation** | 1 | Why sandboxing is needed | Decision makers, PMs, developers |
| **2: Technical Principles & Isolation Spectrum** | 4 | Namespace/cgroups/seccomp, gVisor, Firecracker, WebAssembly | Architects, security engineers |
| **3: Local Products & Developer Tools** | 3 | Claude Code, CLI/IDE sandbox, Wasm local sandbox | Developers, DevOps |
| **4: Managed Cloud Sandbox Landscape** | 9 | Product landscape + E2B/Daytona/Runloop/Vercel/Cloudflare/Modal/Bedrock AgentCore/OpenSandbox/Azure | CTOs, architects, procurement |
| **5: Self-Hosted & Open Source** | 2 | OpenClaw, Kata/Kubernetes/BYOC | Platform engineers, self-hosting teams |
| **6: Integration & Practice** | 3 | Coding-agent design (11/29), MCP Server sandbox integration | Full-stack engineers, agent developers |
| **7: Security & Compliance** | 5 | Permission boundaries, credentials & network, observability & audit, compliance, real escape cases | Security engineers, compliance officers |
| **8: Cost & Business Considerations** | 3 | Cost model, standalone commercial product (Modal ARR), lifecycle management | Finance decision makers, product owners |

---

## Reading Paths: Four Common Scenarios

### Path A: Newcomer, need to build the full picture quickly
> Suggested order: **This overview → order 1 Motivation → order 2 Technical Overview → pick a sub-series based on need**

Start with this overview to build the series map, then read order 1 to understand why sandboxing is needed, then order 2 to understand the isolation spectrum. After these three posts, you will have the shared language to judge "what kind of sandbox do I need in what situation."

### Path B: Comparing managed cloud sandbox providers
> Suggested order: **This overview → order 7 Cloud Product Landscape & Selection Matrix → order 8–15 provider deep dives**

First read order 7 to see positioning and pricing comparisons across eight providers, then dive into the specific provider you need (e.g., E2B order 8, Daytona order 9, Runloop order 10, Vercel order 11, Cloudflare order 15, Modal order 13, Bedrock AgentCore order 14, Azure Container Apps order 16).

### Path C: Integrating sandbox into your own agent system
> Suggested order: **This overview → order 5 Local Products → order 6–7 Integration Practice → order 20 MCP Server Integration**

First read order 5 to understand how mature products like Claude Code do local sandboxing, then read order 6–7 to learn Cloudflare Sandbox deployment practice and OS-level sandboxing, finally read order 20 to understand how MCP servers run inside sandboxes.

### Path D: Responsible for security review or red-team defense
> Suggested order: **This overview → order 21 Permission Boundaries → order 22 Credentials & Network Boundaries → order 23 Observability & Audit → order 24 Compliance Audit → order 25 Real Escape Cases**

Start with "what to restrict," move to "how to test," then "how to audit," "what compliance requirements apply," and finally "what real cases teach us."

---

## Reading Guidelines & Caveats

**Do not read all 29 posts from start to finish.** This series is designed for "map-style reading": first read this overview, then based on your role and needs, read only the relevant sub-series. Each post has its own focused question and boundary; they reference each other but do not require linear reading.

**This post is the map, not the destination.** Specific technical details, architecture breakdowns, code examples, and selection decisions live in each sub-series article. If you already know what you are looking for, you can jump directly to the corresponding post.

---

## References

- [Sandbox Series: Technical Principles & Isolation Spectrum (order 2)](/posts/tech/2026-08-30-execution-environment-sandbox-comparison-en)
- [Sandbox Series: Cloud Product Landscape & Selection Matrix (order 7)](/posts/tech/2026-08-30-sandbox-product-landscape-en)
- [Sandbox Series: Security & Permissions (order 21)](/posts/tech/2026-08-22-agent-sandbox-permission-boundaries-en)
- [Sandbox Series: Real Escape Case Studies (order 25)](/posts/daily/2026-09-06-security-openai-agent-wiki-coordination-sandbox-bypass-en)
- [Site Home: https://quidproquo.cc](https://quidproquo.cc)

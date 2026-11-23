---
title: "Amazon Bedrock AgentCore and Alibaba OpenSandbox"
date: 2026-08-30
category: ai
type: deep-dive
tags: [sandbox, bedrock, agentcore, alibaba, opensandbox, cloud, ai-agent]
lang: en
tldr: "The cloud deep dive post (order 13) of the Sandbox Series. AWS-managed Bedrock AgentCore (Runtime and Code Interpreter) and OpenSandbox, open-sourced by Alibaba and self-hostable: architecture, isolation, multi-language SDKs, pricing and deployment model, and trade-offs with other providers."
description: "AWS Bedrock AgentCore and OpenSandbox deep dive: managed and self-hosted sandboxes, multi-language SDKs, pricing, security boundaries, comparison with E2B/Daytona/Modal and other providers."
series:
  name: "Sandbox Series"
  order: 13
draft: false
---

> :globe: [中文版](/posts/ai/2026-08-30-bedrock-agentcore-opensandbox)

## What This Post Is

This post is the "cloud deep dive" post (order 13) of the Sandbox Series, focusing on **Amazon Bedrock AgentCore** and **OpenSandbox**. The first is AWS's managed service that makes sandboxing part of native AI infrastructure; the second was open-sourced by Alibaba, now sits under AAIF, and is self-hosted on your own infrastructure. Both are positioned differently from independent providers like E2B/Daytona.

This post covers:

1. **Amazon Bedrock AgentCore** — Architecture, Code Interpreter, Runtime, multi-language SDK
2. **OpenSandbox** — Architecture, swappable isolation runtime, five-language SDK, self-hosted model
3. **Trade-offs with independent providers** — E2B, Daytona, Modal comparison
4. **Cloud lock-in and migration considerations**

---

## Amazon Bedrock AgentCore

### Product Positioning

Amazon Bedrock AgentCore is AWS's agent infrastructure, and two different services in it relate to sandboxing: **Runtime** hosts the agent itself, and **Code Interpreter** is a built-in tool the agent calls to execute code. They are often lumped together; evaluate them separately.

### Architecture

```
┌─────────────────────────────────────┐
│         Amazon Bedrock AgentCore     │
│  - Runtime: hosts the agent, one     │
│    dedicated microVM per session     │
│  - Code Interpreter: built-in tool,  │
│    containerized code execution      │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│         Execution Plane               │
│  - Python / JavaScript / TypeScript   │
│  - State kept within a session        │
│    (15-minute default timeout)        │
│  - Network: Sandbox / Public / VPC    │
└─────────────────────────────────────┘
```

### Core Features

#### 1. Code Interpreter

[Code Interpreter](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html) executes code in a containerized environment, supports Python, JavaScript, and TypeScript, and can also run terminal commands; inline file uploads go up to 100 MB, and up to 5 GB through S3. It uses a session model: files and variables persist within a session, the session timeout defaults to 15 minutes and is configurable, and sessions end automatically when it expires.

#### 2. Runtime

[Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-sessions.html) is where you deploy the agent, not an interactive shell tool. Each user session gets its own dedicated microVM with isolated compute, memory, and filesystem, cleaned up when the session ends.

#### 3. Security Boundary

- Choose the [network mode](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-resource-management.html) when creating a Code Interpreter: Sandbox reaches only limited AWS services (such as S3), Public can reach the internet, and VPC connects to your own VPC
- An execution role (IAM) decides which AWS resources it can reach, so no long-lived keys go into the sandbox
- One Code Interpreter can run multiple sessions at once, each with its own state

### Pricing

AgentCore Code Interpreter is billed by [actual consumption](https://aws.amazon.com/bedrock/agentcore/pricing/): CPU at $0.0895 per vCPU-hour for actual usage only, with no charge for I/O wait or idle time; memory at $0.00945 per GB-hour over the session. That puts it in the active-CPU group, not wall-clock.

### SDK

Besides the AWS SDKs, there are official `bedrock-agentcore` SDKs for Python and TypeScript that open Code Interpreter sessions directly.

---

## OpenSandbox

### Product Positioning

[OpenSandbox](https://github.com/opensandbox-group/OpenSandbox) was open-sourced by Alibaba and is now an Agentic AI Foundation (AAIF) project; the repository moved to `opensandbox-group` and is licensed Apache-2.0. It is not an Alibaba Cloud managed service but software for running agent sandboxes on your own infrastructure: start locally with Docker, then deploy to Kubernetes.

### Architecture

```
┌─────────────────────────────────────┐
│         OpenSandbox Server            │
│  - Unified sandbox lifecycle API      │
│  - Docker (local) / Kubernetes        │
│  - Ingress gateway, egress policies   │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│         Execution Plane               │
│  - runc by default                    │
│  - gVisor, Kata, Firecracker optional │
│  - Command, file, code execution APIs │
└─────────────────────────────────────┘
```

### Core Features

#### 1. Swappable Isolation Runtime

By default it uses plain runc containers, suitable for trusted workloads and local development. For untrusted code, the [official secure container guide](https://github.com/opensandbox-group/OpenSandbox/blob/main/docs/guides/secure-container.md) switches to gVisor (a user-space kernel that intercepts syscalls) or Kata Containers (QEMU, Firecracker, or Cloud Hypervisor as the VMM). The official Fast Sandbox path uses Firecracker, claims a 64 ms P50 for a single creation, and supports pause/resume that keeps memory and disk.

#### 2. Multi-language SDK

Official SDKs cover Python, Java/Kotlin, TypeScript/JavaScript, C#/.NET, and Go, plus the `osb` CLI and an MCP interface.

#### 3. Filesystem, Network, and Credentials

- Each sandbox has a full filesystem for installing packages, reading and writing files, and running programs
- Inbound traffic goes through a unified ingress gateway; outbound traffic is controlled by per-sandbox egress policies
- Credential Vault lets agents call external services without seeing the real credentials

### Self-hosted, Not BYOC

OpenSandbox is open-source and self-hosted by design: the control plane and the sandboxes run on your Docker or Kubernetes, so data stays in your environment, and upgrades, scaling, and failures are yours to handle. That is a different responsibility split from E2B's BYOC, where E2B operates the deployment inside your cloud account.

---

## Trade-offs with Independent Providers

| Dimension | Bedrock AgentCore | OpenSandbox | E2B | Daytona | Modal |
|-----------|-------------------|-------------|-----|---------|-------|
| Deployment | AWS managed | Open source, self-hosted | Managed; BYOC or self-hosted E2B Embed | Managed; public repo archived | Managed |
| Isolation technology | microVM (Runtime) / container (Code Interpreter) | runc by default; gVisor / Kata / Firecracker optional | Firecracker microVM | Docker / Kata | gVisor / microVM |
| Multi-language SDK | Python / TypeScript (plus AWS SDKs) | Python / Java / TypeScript / C# / Go | Python / TypeScript | Python / TypeScript and more | Python / JavaScript / Go |
| BYOC | No | Not applicable (self-hosted) | Yes (Enterprise, AWS / GCP / Azure) | Enterprise plans | No |
| GPU support | No | Depends on your cluster | No | Yes | ✓ (T4–B300) |
| State retention | In-session state | pause/resume (Firecracker path) | pause/resume | snapshot/fork | Filesystem and memory snapshots |

### Choose Cloud-Native Sandbox When

- Deeply bound to the AWS ecosystem (AgentCore)
- Need seamless integration with existing cloud services (S3, RDS, OSS, etc.)
- High data sovereignty requirements, want data to stay within own cloud
- Don't want to manage additional third-party provider relationships

### Choose Independent Providers When

- Need cross-cloud portability
- Need GPU sandbox (Modal)
- Need open-source self-host (OpenSandbox, E2B Embed)
- Want to avoid cloud vendor lock-in

---

## Cloud Lock-in and Migration Considerations

### Cloud Lock-in Risks

Using Bedrock AgentCore binds you to AWS; OpenSandbox is open source, but its API is still its own:

1. **API lock-in**: Sandbox create, execute, destroy APIs are bound to the cloud provider; migration requires code rewriting.
2. **Data lock-in**: Files and state inside the sandbox are stored in the cloud provider's storage services; migration requires data transfer.
3. **Identity lock-in**: IAM credentials and permission models are bound to the cloud provider.

### Migration Strategy

If future migration might be needed, consider:

1. **Abstract sandbox interface**: Build an abstract interface at the application layer, wrapping specific provider SDKs.
2. **Standardize images**: Use OCI container images for easier migration across providers.
3. **Externalize state**: Store sandbox state in external storage services (S3, OSS), not inside the sandbox.
4. **Keep open-source options**: Evaluate self-hostable options like OpenSandbox, retain self-build capability.

---

## What You Should Understand After Reading

1. Amazon Bedrock AgentCore architecture and core features (Code Interpreter, Runtime, security boundary).
2. OpenSandbox architecture and core features (swappable isolation runtime, multi-language SDK, self-hosting).
3. Trade-offs between the two and independent providers (E2B, Daytona, Modal).
4. Cloud lock-in risks and migration strategies.
5. When to choose cloud-native sandboxes vs independent providers.

---

## Update Log

- 2026-11-23: AgentCore now separates Runtime (hosts the agent, one microVM per session) from Code Interpreter (containerized, Python / JavaScript / TypeScript, 15-minute default session), with active-CPU pricing and network modes added; OpenSandbox is now described as open-source and self-hosted (now under AAIF, repo moved to opensandbox-group, runc by default with gVisor / Kata / Firecracker optional, five-language SDK, Credential Vault), and the gRPC and BYOC claims were removed; the comparison table was rewritten from each vendor's current docs.

## References

- [Amazon Bedrock AgentCore Documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/agentcore.html)
- [Amazon Bedrock AgentCore Code Interpreter](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html)
- [AgentCore Code Interpreter session management](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-resource-session-management.html)
- [AgentCore Runtime sessions](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-sessions.html)
- [Amazon Bedrock AgentCore Pricing](https://aws.amazon.com/bedrock/agentcore/pricing/)
- [OpenSandbox GitHub](https://github.com/opensandbox-group/OpenSandbox)
- [OpenSandbox Secure Container Runtime Guide](https://github.com/opensandbox-group/OpenSandbox/blob/main/docs/guides/secure-container.md)
- [E2B BYOC](https://docs.e2b.dev/byoc)
- [E2B Documentation](https://e2b.dev/docs)
- [Daytona Documentation](https://www.daytona.io/docs)
- [Modal Sandbox Guide](https://modal.com/docs/guide/sandbox)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview-en)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape-en)

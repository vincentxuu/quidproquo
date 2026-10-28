---
title: "Amazon Bedrock AgentCore and Alibaba OpenSandbox"
date: 2026-08-30
category: ai
type: deep-dive
tags: [sandbox, bedrock, agentcore, alibaba, opensandbox, cloud, ai-agent]
lang: en
tldr: "The cloud deep dive post (order 13) of the Sandbox Series. AWS Bedrock AgentCore and Alibaba OpenSandbox — two cloud-native sandbox services — architecture, multi-language SDK, BYOC mode, and trade-offs with independent providers."
description: "AWS Bedrock AgentCore and Alibaba OpenSandbox deep dive: cloud-native sandbox, multi-language SDK, BYOC mode, security boundaries, comparison with E2B/Daytona/Modal and other providers."
series:
  name: "Sandbox Series"
  order: 13
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-30-bedrock-agentcore-opensandbox)

## What This Post Is

This post is the "cloud deep dive" post (order 13) of the Sandbox Series, focusing on **Amazon Bedrock AgentCore** and **Alibaba OpenSandbox** — two cloud-native sandbox services from cloud giants (AWS and Alibaba Cloud). They represent a different positioning from independent providers like E2B/Daytona, offering sandboxing as native AI infrastructure.

This post covers:

1. **Amazon Bedrock AgentCore** — Architecture, Code Interpreter, Runtime, multi-language SDK
2. **Alibaba OpenSandbox** — Architecture, gVisor isolation, four-language SDK, BYOC model
3. **Trade-offs with independent providers** — E2B, Daytona, Modal comparison
4. **Cloud lock-in and migration considerations**

---

## Amazon Bedrock AgentCore

### Product Positioning

Amazon Bedrock AgentCore is AWS's native sandbox service for AI agent execution environments, part of the Amazon Bedrock ecosystem. It's not just a "sandbox" — it's a complete agent execution platform with built-in Code Interpreter and Runtime tools.

### Architecture

```
┌─────────────────────────────────────┐
│         Amazon Bedrock               │
│  - AgentCore Control Plane            │
│  - Code Interpreter Built-in Tool     │
│  - Runtime Built-in Tool              │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│         Execution Plane               │
│  - Firecracker microVM isolation      │
│  - Multi-language execution environment│
│  - State retention (session state)    │
└─────────────────────────────────────┘
```

### Core Features

#### 1. Code Interpreter

AgentCore's Code Interpreter gives agents a secure sandbox to execute code, supporting multiple languages (Python, Node.js, Java, etc.), with state retention across multiple steps (environment variables, working directory, running processes).

#### 2. Runtime

Runtime supports interactive shell sessions, with state retained within the session lifecycle, suitable for multi-step interactive agent workflows.

#### 3. Security Boundary

- Each agent runs in an isolated sandbox
- Default no egress, requires explicit network policy
- Credentials not stored in sandbox, injected via IAM roles

### Multi-language SDK

Bedrock AgentCore provides Python, Node.js, Java and other language SDKs, allowing developers to create and manage sandboxes directly from applications.

---

## Alibaba OpenSandbox

### Product Positioning

Alibaba OpenSandbox is an open-source AI agent execution platform from Alibaba Cloud, using gVisor kernel-level sandbox isolation, with official SDKs for Python, Node.js, Go, and Rust, communicating with the control plane via gRPC.

### Architecture

```
┌─────────────────────────────────────┐
│         OpenSandbox Control Plane     │
│  - gRPC control plane                 │
│  - Sandbox lifecycle management       │
│  - Auto-reconnect and retry           │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│         Execution Plane               │
│  - gVisor kernel-level sandbox        │
│  - Full filesystem (read/write)       │
│  - Process lifecycle management       │
└─────────────────────────────────────┘
```

### Core Features

#### 1. gVisor Isolation

OpenSandbox uses gVisor for kernel-level isolation, each sandbox having its own user-space kernel (Sentry) and filesystem proxy (Gofer), preventing sandboxed code from directly touching the host kernel.

#### 2. Multi-language SDK

OpenSandbox ships with official SDKs for Python, TypeScript, Go, and Java from day one, with identical functionality, communicating with the control plane via gRPC, supporting auto-reconnect and request retry.

#### 3. Filesystem and Network

- Sandbox has full filesystem, can install packages, create files, traverse directories
- Network policy can be configured to control outbound traffic to external APIs, databases, web services
- Real-time stdout/stderr streaming and process lifecycle management

### BYOC Model

OpenSandbox supports BYOC (Bring Your Own Cloud), allowing enterprises to deploy OpenSandbox control plane on their own cloud (AWS, GCP, Azure), retaining data sovereignty and compliance requirements.

---

## Trade-offs with Independent Providers

| Dimension | Bedrock AgentCore | Alibaba OpenSandbox | E2B | Daytona | Modal |
|-----------|-------------------|---------------------|-----|---------|-------|
| Cloud lock-in | AWS | Alibaba Cloud | Low (open-source runtime) | Low (open-source runtime) | Low |
| Isolation technology | Firecracker microVM | gVisor | Firecracker microVM | Docker / Kata | gVisor / microVM |
| Multi-language SDK | Python/Node.js/Java | Python/Go/Java/Rust | Python/TypeScript | Multi-language | Python/TypeScript/Go |
| BYOC | No | Yes | Yes (AWS/GCP/Azure) | No | No |
| GPU support | Limited | Limited | No | Limited | ✅ (A100/H100) |
| State retention | Session state | Process/file/network API | pause/resume | snapshot/fork | snapshot/pause/resume |

### Choose Cloud-Native Sandbox When

- Deeply bound to AWS or Alibaba Cloud ecosystem
- Need seamless integration with existing cloud services (S3, RDS, OSS, etc.)
- High data sovereignty requirements, want data to stay within own cloud
- Don't want to manage additional third-party provider relationships

### Choose Independent Providers When

- Need cross-cloud portability
- Need GPU sandbox (Modal)
- Need open-source self-host (E2B, Daytona)
- Want to avoid cloud vendor lock-in

---

## Cloud Lock-in and Migration Considerations

### Cloud Lock-in Risks

Using Bedrock AgentCore or OpenSandbox means binding to a specific cloud provider:

1. **API lock-in**: Sandbox create, execute, destroy APIs are bound to the cloud provider; migration requires code rewriting.
2. **Data lock-in**: Files and state inside the sandbox are stored in the cloud provider's storage services; migration requires data transfer.
3. **Identity lock-in**: IAM credentials and permission models are bound to the cloud provider.

### Migration Strategy

If future migration might be needed, consider:

1. **Abstract sandbox interface**: Build an abstract interface at the application layer, wrapping specific provider SDKs.
2. **Standardize images**: Use OCI container images for easier migration across providers.
3. **Externalize state**: Store sandbox state in external storage services (S3, OSS), not inside the sandbox.
4. **Keep open-source options**: Evaluate OpenSandbox BYOC model, retain self-build capability.

---

## What You Should Understand After Reading

1. Amazon Bedrock AgentCore architecture and core features (Code Interpreter, Runtime, security boundary).
2. Alibaba OpenSandbox architecture and core features (gVisor isolation, multi-language SDK, BYOC).
3. Trade-offs between the two and independent providers (E2B, Daytona, Modal).
4. Cloud lock-in risks and migration strategies.
5. When to choose cloud-native sandboxes vs independent providers.

---

## References

- [Amazon Bedrock AgentCore Documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/agentcore.html)
- [Alibaba OpenSandbox](https://www.alibabacloud.com/)
- [OpenSandbox GitHub](https://github.com/alibaba/opensandbox)
- [E2B Documentation](https://e2b.dev/docs)
- [Daytona Documentation](https://www.daytona.io/docs)
- [Modal Sandbox Guide](https://modal.com/docs/guide/sandbox)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview-en)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape-en)

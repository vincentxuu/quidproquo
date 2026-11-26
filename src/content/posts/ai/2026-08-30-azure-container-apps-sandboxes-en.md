---
title: "Azure Container Apps Sandboxes"
date: 2026-08-30
category: ai
type: deep-dive
tags: [sandbox, azure, container-apps, cloud, ai-agent, microsoft]
lang: en
tldr: "The cloud deep dive post (order 14) of the Sandbox Series. Azure Container Apps Sandboxes architecture, snapshot and state management, lifecycle policy, security boundaries, and trade-offs with other providers, plus Azure ecosystem integration advantages."
description: "Azure Container Apps Sandboxes deep dive: architecture, snapshot and state management, lifecycle policy, security boundaries, comparison with E2B/Daytona/Modal and other providers."
series:
  name: "Sandbox Series"
  order: 14
draft: false
---

> :globe: [中文版](/posts/ai/2026-08-30-azure-container-apps-sandboxes)

## What This Post Is

This post is the "cloud deep dive" post (order 14) of the Sandbox Series, focusing on **Azure Container Apps Sandboxes** — Microsoft Azure's cloud-native sandbox service, generally available since 2026-09-23. As part of the Azure cloud ecosystem, it's a natural choice for Azure enterprise users, alongside AWS Bedrock AgentCore.

This post covers:

1. **Azure Container Apps Sandboxes architecture** — Control plane, execution plane, isolation technology
2. **Snapshot and State Management** — Snapshots, state retention, pause/resume
3. **Lifecycle Policy** — Lifecycle strategy, auto-destroy, idle handling
4. **Security Boundary** — Network policy, identity authentication, credential management
5. **Trade-offs with other providers** — E2B, Daytona, Modal, Bedrock AgentCore comparison
6. **Azure ecosystem integration advantages** — Shared foundation with Microsoft products, managed identity, VNet

---

## Azure Container Apps Sandboxes Architecture

Azure Container Apps Sandboxes entered public preview on 2026-06-02 (Build'26) and reached GA on 2026-09-23. It is a first-class resource type in Container Apps (`Microsoft.App/SandboxGroups`), alongside apps, jobs, and dynamic sessions:

```
┌─────────────────────────────────────┐
│          Azure Control Plane (ARM)   │
│  - Sandbox Group: shared scope for   │
│    images, snapshots, volumes,       │
│    secrets, managed identities       │
│  - Defaults, VNet, identity settings │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│          Execution Plane              │
│  - One microVM per sandbox            │
│    (its own kernel)                   │
│  - Boots from disk image or snapshot  │
│  - Ingress/egress proxies outside     │
└─────────────────────────────────────┘
```

### Isolation Technology

Each sandbox is a [hardware-isolated microVM](https://techcommunity.microsoft.com/blog/appsonazureblog/azure-container-apps-sandboxes-now-generally-available/4559125) with its own Linux kernel and virtual hardware, with memory separated by CPU virtualization; typical container runtimes share the host kernel instead. The root filesystem comes from a disk image converted from an OCI image, and platform images such as Ubuntu, Python, Node.js, and Claude Code are provided. Resources come in tiers from 0.25 cores / 0.5 GiB up to 16 cores / 32 GiB.

### Sandbox Lifecycle

1. **Create**: From a disk image or snapshot; boots in under a second per Microsoft
2. **Execute**: Send commands through the Python or TypeScript SDK, the `aca` CLI, or the REST API
3. **Auto-suspend**: Suspends after an idle interval according to the lifecycle policy
4. **Resume**: On a start command or when network traffic arrives; under a second per Microsoft
5. **Snapshot**: Manually or automatically on suspend; can include memory and disk
6. **Create from snapshot**: Fork new sandboxes from a snapshot
7. **Auto-delete**: The lifecycle policy removes sandboxes stopped longer than a set number of days

---

## Snapshot and State Management

Azure splits sandbox state into three kinds: in-memory state (processes, open files, terminal sessions), local disk state, and external state written outside the sandbox. The first two are tied to the sandbox lifecycle, so the platform offers two ways to keep them: lifecycle policy and snapshots.

### Snapshot

A snapshot is a point-in-time copy of sandbox state and can include memory, disk, and running processes. Use it to:
- Checkpoint before a risky operation
- Fork multiple sandboxes from one prepared environment
- Preserve local state before deleting a sandbox

Snapshots capture sandbox-local state only. They do not coordinate writes to databases, queues, object storage, or external APIs; a sandbox forked from a snapshot may repeat non-idempotent operations, so design the workflow for that.

### State Management

Data that must outlive a sandbox belongs on a mounted volume (Azure Blob, bring-your-own Blob, or Data Disk); it stays after the sandbox is deleted. Sandboxes with a Data Disk volume attached cannot use memory snapshots.

---

## Lifecycle Policy

Lifecycle policy fits routine idle-and-resume behavior; snapshots fit deliberate checkpoints:

| Policy | Description | Use Case |
|--------|-------------|----------|
| Auto-suspend (Memory mode) | Suspends after inactivity and keeps full state, including memory | Interactive agents that need processes kept between turns |
| Auto-suspend (Disk mode) | Keeps disk only; the VM restarts fresh on resume | Work that only needs files and can restart |
| Auto-delete | Deletes sandboxes stopped longer than a set number of days | Keeps abandoned sandboxes from piling up snapshot storage |

---

## Security Boundary

### Network Policy

Each sandbox has its own egress policy, enforced by a proxy outside the sandbox: the default action can be Allow or Deny, plus domain-pattern or CIDR rules. The default is not deny-all; for untrusted code, set it to Deny explicitly and open only the endpoints you need. Network Audit records every allow and deny. You can also join your own VNet to reach private resources.

### Identity Authentication

Sandbox Groups support system-assigned and user-assigned managed identities, so sandboxes can reach Azure resources with an Entra ID identity instead of long-lived keys passed into the sandbox.

### Credential Management

Sandbox Groups can store secrets, and egress-policy transform rules add authentication headers to outbound requests at the proxy, so code inside the sandbox never sees the secret. For Key Vault access, use the managed identity.

### Billing

Running sandboxes are billed per vCPU core-second and memory GiB-second, with no compute charge once stopped; disk images, snapshots, and volumes are billed separately by storage (Microsoft lists storage billing as coming soon).

---

## Trade-offs with Other Providers

| Provider | Isolation Tech | Cold Start | Pricing Model | Best For |
|----------|----------------|------------|---------------|----------|
| Azure Container Apps Sandboxes | microVM | under 1 s (official) | Per second while running; no compute charge when stopped | Azure ecosystem integration |
| AWS Bedrock AgentCore | microVM (Runtime) / container (Code Interpreter) | ~1–2 s | active-CPU | AWS ecosystem integration |
| OpenSandbox | runc by default; gVisor / Kata / Firecracker optional | Depends on deployment | Open source, self-hosted | Your own Kubernetes |
| E2B | Firecracker microVM | ~150 ms | wall-clock | Coding agent, long tasks |
| Modal | gVisor / microVM | sub-second | Higher of request and usage | GPU workloads |

**Choose Azure Container Apps Sandboxes when**:
- Deeply bound to Azure ecosystem
- Need managed identity, VNet, and Azure resource integration
- Data must stay in Azure regions

---

## Azure Ecosystem Integration Advantages

### Shared Foundation with Microsoft Products

Microsoft says GitHub Copilot's cloud sandboxes, Foundry Hosted Agents, Azure SRE Agent, and Container Apps Express all run on the same sandbox infrastructure.

### Integration with Azure Services

Sandboxes use managed identity to reach Key Vault, Storage, and other Azure services, and VNet integration to reach private endpoints; telemetry can export console logs, platform metrics, OpenTelemetry, and egress decision records.

### Deployment Tooling

The GA release ships Python and TypeScript SDKs, the `aca` CLI, Bicep, and a preview Terraform provider; a .NET SDK is still planned.

---

## What You Should Understand After Reading

1. Azure Container Apps Sandboxes architecture and isolation technology (microVM).
2. Snapshot vs. Resume difference, and State Management scope.
3. Lifecycle Policy configuration and usage scenarios.
4. Security boundary: egress policy, Entra ID managed identity, credentials injected at the proxy.
5. Trade-offs with AWS Bedrock AgentCore, OpenSandbox, E2B, Modal.
6. Azure ecosystem integration advantages: shared foundation, managed identity, VNet, and deployment tooling.

---

## Update Log

- 2026-11-23: Added the 2026-06 public preview and 2026-09-23 GA; corrected snapshots to include memory; lifecycle policy now follows the official auto-suspend (Memory / Disk mode) and auto-delete; the network default action can be Allow or Deny and credentials are injected at the proxy; added billing and SDKs; removed the AKS integration claim, which has no official source, and rewrote the ecosystem section.

## References

- [Azure Container Apps Sandboxes overview](https://learn.microsoft.com/en-us/azure/container-apps/sandboxes-overview)
- [Azure Container Apps Sandboxes: Snapshots and state management](https://learn.microsoft.com/en-us/azure/container-apps/sandboxes-snapshots-state-management)
- [Introducing Azure Container Apps Sandboxes (public preview announcement)](https://techcommunity.microsoft.com/blog/appsonazureblog/introducing-azure-container-apps-sandboxes-secure-infrastructure-for-agentic-wor/4524131)
- [Azure Container Apps Sandboxes, Now Generally Available](https://techcommunity.microsoft.com/blog/appsonazureblog/azure-container-apps-sandboxes-now-generally-available/4559125)
- [Azure Container Apps Documentation](https://learn.microsoft.com/en-us/azure/container-apps/)
- [Azure Key Vault Documentation](https://learn.microsoft.com/en-us/azure/key-vault/)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview-en)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape-en)
- [本站：Amazon Bedrock AgentCore 與 Alibaba OpenSandbox（order 13）](/posts/ai/2026-08-30-bedrock-agentcore-opensandbox-en)

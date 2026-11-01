---
title: "Sandbox Cost Model: Wall-Clock vs Active-CPU Billing"
date: 2026-08-30
category: tech
type: guide
tags: [sandbox, cost, pricing, billing, wall-clock, active-cpu, ai-agent]
lang: en
tldr: "The cost post (order 26) of the Sandbox Series. Compares wall-clock vs active-CPU billing models, cost differences across isolation layers, and how to estimate monthly cost and avoid hidden fees."
description: "Sandbox cost model comparison: wall-clock vs active-CPU billing, isolation layer cost comparison, monthly cost estimation, hidden fees, and optimization strategies."
series:
  name: "Sandbox Series"
  order: 27
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-sandbox-cost-model)

## What This Post Is

This post is the "cost" post (order 26) of the Sandbox Series. It doesn't compare single provider features (provider deep dives are in order 8–16, landscape in order 7). It focuses on **"how sandboxes charge"**:

1. **What's the difference between wall-clock and active-CPU billing?**
2. **What's the cost difference across isolation layers?** (container, gVisor, microVM, Wasm)
3. **How to estimate monthly cost?** — With calculation formulas and examples.
4. **What are the hidden fees?** — Network egress, snapshots, idle fees, etc.
5. **How to optimize sandbox costs?**

---

## Two Billing Models: Core Differences

### Wall-Clock Billing

Charges for **every second** the sandbox is alive, regardless of whether CPU is busy. As long as the sandbox isn't destroyed, it keeps billing.

**Suitable for**: Long-running continuous tasks, sessions that need state retention.
**Providers**: E2B, Daytona, Runloop, Modal (no idle charge exception), AWS Bedrock AgentCore, Azure Container Apps.

### Active-CPU Billing

Charges only for **actual CPU time executing code**. I/O wait and idle time are not billed.

**Suitable for**: Bursty, short-execution, long-wait interactive agents.
**Providers**: Vercel Sandbox, Cloudflare Sandboxes.

---

## Cost Scenario Simulation

### Scenario A: Bursty Interactive Agent

30,000 sessions/month, 5 minutes each, actual CPU usage only 30 seconds, 2 vCPU + 4 GB memory.

| Billing Model | Estimated Monthly Cost | Notes |
|---------------|----------------------|-------|
| active-CPU (Vercel/Cloudflare) | ~$36–$276 | Only actual CPU time, skips wait |
| wall-clock (E2B/Daytona) | ~$414 | Every second counts, idle also billed |

**Conclusion**: Bursty scenarios can save 90%+ cost with active-CPU.

### Scenario B: Long-Running Continuous Execution

1,000 sessions/month, 8 hours each, 60% CPU utilization, 4 vCPU + 8 GB memory.

| Billing Model | Estimated Monthly Cost | Notes |
|---------------|----------------------|-------|
| wall-clock (E2B/Daytona) | ~$1,200 | Fixed cost, predictable |
| active-CPU (Vercel) | ~$1,500+ | Although only active CPU, long-running accumulates higher |

**Conclusion**: Long-running scenarios: wall-clock is more predictable and usually cheaper.

---

## Cost Comparison Across Isolation Layers

| Isolation Layer | Representative Tech | Relative Cost | Startup Speed | Memory Overhead | Suitable Scenario |
|-----------------|---------------------|---------------|---------------|-----------------|-------------------|
| Container | Docker | $ (lowest) | 1–5 s | 50–100 MB | Trusted code, CI tasks |
| User-space kernel | gVisor | $$ | 100–300 ms | 10–30 MB extra | Multi-tenant, Kubernetes |
| Lightweight VM | Firecracker/Kata | $$$ | 125 ms | 5–128 MB | Untrusted code, multi-tenant |
| WebAssembly | Wasmtime/WasmEdge | $ (lowest) | 3–15 ms | < 1 MB | Short-lived code fragments, edge |
| Managed sandbox | E2B/Modal/Vercel | $$$$ | 0.3–5 s | Depends on provider | Fast delivery, low ops |

**Key insight**: Wasm sandbox has the lowest memory overhead (<1 MB) and fastest startup (3–15 ms), suitable for high-concurrency short-lived execution; but it can only run Wasm-compiled languages, limited language ecosystem.

---

## Hidden Fee Checklist

Many teams only look at the sticker price, ignoring these hidden costs:

### 1. Network Egress

Network traffic sent out from the sandbox is usually billed by traffic volume. If agents frequently call external APIs or download large files, network fees may exceed compute costs.

**Recommendation**: Set network allowlists inside the sandbox to restrict unnecessary outbound traffic.

### 2. Snapshots & Storage

Sandbox snapshots, temporary files, persistent disks are usually billed by storage size. Long-retained snapshots accumulate costs.

**Recommendation**: Set snapshot retention policy (e.g., keep only latest 3), regularly clean up unused storage.

### 3. Idle Fees

Some providers charge lower but non-zero fees for idle sandboxes, or set minimum billing units (e.g., minimum 1 minute billing).

**Recommendation**: Use auto-destroy for short tasks, use pause/resume instead of continuous running for long tasks.

### 4. GPU Fees

If the sandbox needs GPU (e.g., ML inference), GPU fees are usually much higher than CPU fees.

**Recommendation**: Only attach GPU when needed, release immediately after use.

---

## Monthly Cost Estimation Formula

```
Monthly Cost = (CPU hours × CPU rate) + (Memory GB-hours × Memory rate) + (Network GB × Network rate) + (Storage GB × Storage rate) + (GPU hours × GPU rate) + Fixed base fee
```

### Example Calculation

Assumptions:
- 10,000 sessions/month, 10 minutes each
- 2 vCPU, 4 GB memory
- CPU utilization 30%
- Network egress 100 GB/month
- Wall-clock billing, CPU rate $0.000014 / vCPU-s, memory $0.0000045 / GiB-s

```
CPU hours = 10,000 × 10 minutes × 60 seconds × 30% = 180,000 seconds
CPU cost = 180,000 × 2 vCPU × $0.000014 = $5.04
Memory cost = 180,000 × 4 GB × $0.0000045 = $3.24
Network cost = 100 GB × $0.09 = $9.00
Total ≈ $17.28/month
```

---

## Cost Optimization Strategies

| Strategy | Description | Applicable Scenario |
|----------|-------------|---------------------|
| Choose right billing model | Bursty → active-CPU, Long-running → wall-clock | All scenarios |
| Set auto-destroy | Destroy sandbox after task completes, avoid idle billing | Short-lived tasks |
| Use pause/resume | Pause instead of destroy for long tasks needing state, resume to continue | Workflows needing state retention |
| Limit network egress | Set allowlist, avoid unnecessary external traffic | Agents frequently calling external APIs |
| Set snapshot retention | Keep only latest N snapshots, regularly clean up | Providers using snapshots |
| Choose Wasm sandbox | Lowest memory & startup cost, suitable for short-lived code | Wasm-compatible languages |
| Monitor & alert | Set cost alerts to avoid bill surprises | Production environments |

---

## What You Should Understand After Reading

1. Difference between wall-clock and active-CPU billing models, and applicable scenarios.
2. Relative cost across isolation layers (container, gVisor, microVM, Wasm, managed sandbox).
3. How to estimate monthly cost using the formula, and what hidden fees exist.
4. How to choose the most economical sandbox solution based on workload characteristics.
5. Five cost optimization strategies you can implement immediately.

---

## References

- [E2B Pricing](https://e2b.dev/pricing)
- [Daytona Pricing](https://www.daytona.io/pricing)
- [Vercel Sandbox Pricing](https://vercel.com/pricing)
- [Cloudflare Sandbox Pricing](https://developers.cloudflare.com/sandbox/pricing/)
- [Modal Pricing](https://modal.com/pricing)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview-en)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape-en)
- [本站：沙箱作為獨立商業產品（order 27）](/posts/tech/2026-08-30-sandbox-as-business-en)

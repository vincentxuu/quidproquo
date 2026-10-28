---
title: "Modal Sandboxes: GPU Sandbox and Sandbox as a Standalone Product Line"
date: 2026-08-30
category: ai
type: deep-dive
tags: [sandbox, modal, gpu, cloud, ai-agent, code-execution]
lang: en
tldr: "The cloud deep dive post (order 12) of the Sandbox Series. Modal Sandboxes architecture, GPU sandbox support, pricing model, and how it grew from a feature to a $300M–$1B annualized run rate standalone product line."
description: "Modal Sandboxes deep dive: architecture, GPU sandbox, pricing, isolation technology, comparison with other providers, and commercialization lessons."
series:
  name: "Sandbox Series"
  order: 12
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-30-modal-sandboxes)

## What This Post Is

This post is the "cloud deep dive" post (order 12) of the Sandbox Series, focusing on **Modal Sandboxes**. Modal is one of the most watched sandbox providers in 2026, with its sandbox product alone contributing approximately $300M–$330M annualized run rate, supporting over 3 billion cumulative executions and 1 million concurrent sandboxes.

This post covers:

1. **Modal Sandboxes architecture** — Control plane, execution plane, isolation technology
2. **GPU sandbox support** — Why GPU sandbox is Modal's differentiation advantage
3. **Pricing model** — Wall-clock billing, no idle charge, GPU fees
4. **Trade-offs with other providers** — E2B, Daytona, Vercel, Cloudflare comparison
5. **Commercialization lessons** — How sandbox grew from feature to standalone product

---

## Modal Sandboxes Architecture

Modal Sandboxes uses a three-layer architecture:

```
┌─────────────────────────────────────┐
│           Control Plane              │
│  - Modal Worker scheduler             │
│  - Sandbox lifecycle management       │
│  - Snapshot and pause/resume          │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│           Execution Plane             │
│  - Cloud Hypervisor microVM           │
│  - gVisor isolation (default)         │
│  - VM execution mode (optional)       │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│           Data Plane                  │
│  - Persistent disks (Volumes)         │
│  - Memory snapshots                   │
│  - Network policy                     │
└─────────────────────────────────────┘
```

### Isolation Technology

Modal defaults to **gVisor** for syscall interception, providing medium-strength isolation; for workloads needing stronger isolation, **microVM** execution mode (based on Cloud Hypervisor) is available. GPU sandboxes only support gVisor isolation.

### Sandbox Lifecycle

1. **Create**: Start sandbox from image (OCI container), cold start approximately seconds
2. **Execute**: Send commands via SDK, stream output results
3. **Pause**: Preserve memory and process state, release CPU
4. **Resume**: Continue execution from paused state
5. **Snapshot**: Save disk state as reusable snapshot
6. **Destroy**: Release all resources

---

## GPU Sandbox Support: Modal's Differentiation Advantage

One of Modal's key differentiation advantages is **GPU sandbox support**. Most sandbox providers (E2B, Daytona, Vercel, Cloudflare) do not support GPU, or have limited GPU support. Modal allows sandboxes to attach NVIDIA GPUs (T4 to H100), enabling agents to run ML inference, training, or data processing inside the sandbox.

### GPU Sandbox Use Cases

| Use Case | Description |
|----------|-------------|
| ML inference | Agent-generated code runs model inference |
| Data processing | Large-scale data cleaning and transformation |
| Model fine-tuning | Small-scale model training and fine-tuning |
| Computer vision | Image and video processing |

### GPU Sandbox Example

```python
import modal

app = modal.App("agent-sandbox-gpu")

@app.function(
    image=modal.Image.debian_slim().pip_install("torch", "transformers"),
    gpu="A100",
    sandbox=True,
)
def run_agent_code(code: str):
    result = subprocess.run(["python", "-c", code], capture_output=True, text=True)
    return result.stdout
```

---

## Pricing Model

Modal uses **wall-clock billing**, but with **no idle charge** — paused sandboxes are not billed. This is advantageous for bursty interactive agents.

| Item | Rate | Description |
|------|------|-------------|
| CPU | $0.00003942 / core-s | Per second |
| Memory | $0.00000672 / GiB-s | Per second |
| GPU | By model type | A100, H100, etc. |
| Network | By egress traffic | Per GB |
| Cache | By storage size | Per GB-month |

Compared to E2B/Daytona wall-clock billing, Modal's no-idle-charge is advantageous for "short execution, long wait" scenarios.

---

## Trade-offs with Other Providers

| Provider | GPU Support | Isolation Tech | Cold Start | Pricing Model | Best For |
|----------|-------------|----------------|------------|---------------|----------|
| Modal | ✅ (A100/H100) | gVisor / microVM | sub-second | wall-clock (no idle) | GPU workloads, high concurrency |
| E2B | ❌ | Firecracker microVM | ~150 ms | wall-clock | Coding agent, long tasks |
| Daytona | ❌ | Docker / Kata | ~90 ms | wall-clock | Parallel evaluation, snapshot fork |
| Vercel | ❌ | Firecracker microVM | ~1.8 s | active-CPU | Vercel ecosystem integration |
| Cloudflare | ❌ | Container in VM | ~2–3 s | active-CPU (10ms) | Cloudflare ecosystem |

**Choose Modal when**: Need GPU, need high concurrency, need no-idle billing, already on Modal platform.

**Don't choose Modal when**: Don't need GPU, prefer open-source self-host, need Windows sandbox (Daytona supports), deeply bound to other cloud ecosystems.

---

## Commercialization Lessons

Modal sandbox's success shows sandboxing has shifted from "feature" to "independent commercial product":

1. **Single product line can reach $300M+ ARR**: Sandbox is no longer an ancillary feature, but an independent commercial market.
2. **GPU is the key differentiator**: In the sandbox market, GPU support is a high-value differentiator.
3. **No-idle billing is a selling point**: For bursty agent workloads, this is a strong competitive advantage.
4. **Ecosystem integration matters**: Integration with inference, training, batch processing on the same platform reduces switching cost.

---

## What You Should Understand After Reading

1. Modal Sandboxes three-layer architecture and isolation technology (gVisor / microVM).
2. GPU sandbox is Modal's differentiation advantage, applicable to ML inference and data processing.
3. Modal's pricing model: wall-clock billing, no-idle charge, GPU fees.
4. Trade-offs with E2B, Daytona, Vercel, Cloudflare.
5. Commercialization lessons: single product line can reach $300M+ ARR, GPU and ecosystem integration are key.

---

## References

- [Modal Sandboxes Documentation](https://modal.com/docs/guide/sandbox)
- [Modal Crosses $1B Annualized Run Rate and Raises $750M Series D](https://modal.com/blog/1-billion-annualized-run-rate-series-d)
- [Modal's Series C: Raising $355M at a $4.65B Valuation](https://modal.com/blog/modal-series-c)
- [Modal Labs Revenue, Valuation & Funding](https://sacra.com/c/modal-labs)
- [Tech Times: Modal Labs Sandboxes Hits $300M Run Rate](https://www.techtimes.com/articles/329132/20261016/modal-labs-sandboxes-hits-300m-run-rate-isolated-code-execution-becomes-its-own-market.htm)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview-en)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape-en)
- [本站：沙箱作為獨立商業產品（order 27）](/posts/tech/2026-08-30-sandbox-as-business-en)

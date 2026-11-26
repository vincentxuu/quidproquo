---
title: "Modal Sandboxes: GPU Sandbox and Sandbox as a Standalone Product Line"
date: 2026-08-30
category: ai
type: deep-dive
tags: [sandbox, modal, gpu, cloud, ai-agent, code-execution]
lang: en
tldr: "The cloud deep dive post (order 12) of the Sandbox Series. Modal Sandboxes architecture, GPU sandbox support, pricing model, and how it grew from a feature to a standalone product line at about a $300M run rate (Modal overall has passed $1B)."
description: "Modal Sandboxes deep dive: architecture, GPU sandbox, pricing, isolation technology, comparison with other providers, and commercialization lessons."
series:
  name: "Sandbox Series"
  order: 12
draft: false
---

> :globe: [中文版](/posts/ai/2026-08-30-modal-sandboxes)

## What This Post Is

This post is the "cloud deep dive" post (order 12) of the Sandbox Series, focusing on **Modal Sandboxes**. Modal is one of the most watched sandbox providers in 2026, In 2026-10 Modal said its sandbox product alone was at about a $300M run rate, with close to 3 billion sandboxes created and scaling to 1 million concurrent.

This post covers:

1. **Modal Sandboxes architecture** — Control plane, execution plane, isolation technology
2. **GPU sandbox support** — Why GPU sandbox is Modal's differentiation advantage
3. **Pricing model** — Higher of request and actual usage, 3× rates, GPU fees
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
│  - Filesystem/directory/memory snaps  │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│           Execution Plane             │
│  - gVisor or microVM isolation        │
│  - One container per sandbox          │
│  - GPUs can be attached               │
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

Modal's [security page](https://modal.com/docs/guide/security) says each container runs in its own sandbox, isolated from the host using primitives like **gVisor** or **microVMs**. Modal does not publish which workloads get which, and users cannot pick. If isolation strength is a procurement requirement, confirm it with Modal directly.

### Sandbox Lifecycle

1. **Create**: Start sandbox from image (OCI container), cold start approximately seconds
2. **Execute**: Send commands via SDK, stream output results
3. **Filesystem / directory snapshot**: Save the whole filesystem or one directory as an Image, kept 30 days by default with an adjustable TTL
4. **Memory snapshot**: Save memory and processes too; expires 7 days after creation and cannot currently be extended
5. **Start from a snapshot**: A new sandbox starts from the snapshot, for branching or faster startup
6. **Destroy**: Release all resources

---

## GPU Sandbox Support: Modal's Differentiation Advantage

One of Modal's key differentiation advantages is **GPU sandbox support**. E2B, Vercel, and Cloudflare sandboxes do not support GPUs; Daytona also offers GPU sandboxes, but Modal's GPUs live on the same platform as inference, training, and batch jobs. Modal allows sandboxes to attach NVIDIA GPUs (T4 to B300), enabling agents to run ML inference, training, or data processing inside the sandbox.

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

app = modal.App.lookup("agent-sandbox-gpu", create_if_missing=True)
image = modal.Image.debian_slim().pip_install("torch", "transformers")

sb = modal.Sandbox.create(app=app, image=image, gpu="A100", timeout=600)
p = sb.exec("python", "-c", "import torch; print(torch.cuda.is_available())")
print(p.stdout.read())
sb.terminate()
```

---

## Pricing Model

Modal sandboxes are billed at non-preemptible rates, 3× the regular function list price. Both CPU and memory are [billed](https://modal.com/docs/guide/resources) at the higher of your request and actual usage. The CPU request can go as low as 0.125 cores, so idle CPU is cheap, but memory is still billed for the whole lifetime; it is not "no charge when idle".

| Item | Rate | Description |
|------|------|-------------|
| CPU | $0.00003942 / core-s | Per second; 1 core = 2 vCPU |
| Memory | $0.00000667 / GiB-s | Per second |
| GPU | By model type | A100, H100, etc. |
| Network | By egress traffic | Per GB |
| Cache | By storage size | Per GB-month |

Compared with E2B / Daytona, Modal's unit prices are higher, but the CPU request can be set very low. For "short execution, long wait" workloads, compute it with your own request settings; memory is usually the larger line item.

---

## Trade-offs with Other Providers

| Provider | GPU Support | Isolation Tech | Cold Start | Pricing Model | Best For |
|----------|-------------|----------------|------------|---------------|----------|
| Modal | ✓ (T4–B300) | gVisor / microVM | sub-second | Higher of request and usage | GPU workloads, high concurrency |
| E2B | ✗ | Firecracker microVM | ~150 ms | wall-clock | Coding agent, long tasks |
| Daytona | ✓ | Docker / Kata | ~90 ms | wall-clock | Parallel evaluation, snapshot fork |
| Vercel | ✗ | Firecracker microVM | ~1.8 s | active-CPU | Vercel ecosystem integration |
| Cloudflare | ✗ | Container in VM | ~2–3 s | active-CPU (10ms) | Cloudflare ecosystem |

**Choose Modal when**: Need GPU, need high concurrency, want sandboxes on the same platform as inference or training, already on Modal platform.

**Don't choose Modal when**: Don't need GPU, prefer open-source self-host, need Windows sandbox (Daytona supports), deeply bound to other cloud ecosystems.

---

## Commercialization Lessons

Modal sandbox's success shows sandboxing has shifted from "feature" to "independent commercial product":

1. **Single product line can reach $300M+ ARR**: Sandbox is no longer an ancillary feature, but an independent commercial market.
2. **GPU is the key differentiator**: In the sandbox market, GPU support is a high-value differentiator.
3. **A very low CPU request is a selling point**: Bursty agents pay only the minimum request while idle, though memory still counts.
4. **Ecosystem integration matters**: Integration with inference, training, batch processing on the same platform reduces switching cost.

---

## What You Should Understand After Reading

1. Modal Sandboxes three-layer architecture and isolation technology (gVisor / microVM).
2. GPU sandbox is Modal's differentiation advantage, applicable to ML inference and data processing.
3. Modal's pricing model: 3× rates, higher of request and actual usage, GPU fees.
4. Trade-offs with E2B, Daytona, Vercel, Cloudflare.
5. Commercialization lessons: single product line can reach $300M+ ARR, GPU and ecosystem integration are key.

---

## Update Log

- 2026-11-23: Corrected scale figures from Modal's 2026-10-14 announcement (sandboxes at about a $300M run rate, close to 3 billion sandboxes); billing now described as the higher of request and actual usage, memory rate updated to $0.00000667/GiB-s, and the "no idle charge" claim removed; isolation now follows the official wording "gVisor or microVMs"; lifecycle now lists the three snapshot types (memory snapshots expire after 7 days); the GPU example now uses `modal.Sandbox.create`; Daytona is now listed as offering GPUs.

## References

- [Modal Sandboxes Documentation](https://modal.com/docs/guide/sandboxes)
- [Modal Sandbox Snapshots](https://modal.com/docs/guide/sandbox-snapshots)
- [Modal Pricing](https://modal.com/pricing) and [Resources billing](https://modal.com/docs/guide/resources)
- [Modal Security and privacy](https://modal.com/docs/guide/security)
- [Modal Crosses $1B Annualized Run Rate and Raises $750M Series D](https://modal.com/blog/1-billion-annualized-run-rate-series-d)
- [Modal's Series C: Raising $355M at a $4.65B Valuation](https://modal.com/blog/modal-series-c)
- [Modal Labs Revenue, Valuation & Funding](https://sacra.com/c/modal-labs)
- [Tech Times: Modal Labs Sandboxes Hits $300M Run Rate](https://www.techtimes.com/articles/329132/20261016/modal-labs-sandboxes-hits-300m-run-rate-isolated-code-execution-becomes-its-own-market.htm)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview-en)
- [本站：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape-en)
- [本站：沙箱作為獨立商業產品（order 27）](/posts/tech/2026-08-30-sandbox-as-business-en)

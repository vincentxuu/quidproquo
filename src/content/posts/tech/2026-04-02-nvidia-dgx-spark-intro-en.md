---
title: "NVIDIA DGX Spark: A Desktop AI Supercomputer That Fits a Petaflop on Your Desk"
date: 2026-04-02
type: guide
category: tech
tags: [nvidia, dgx-spark, gpu, ai-hardware, blackwell, edge-ai, llm]
lang: en
tldr: "The NVIDIA DGX Spark is powered by the GB10 Grace Blackwell Superchip, 128 GB of unified memory, and delivers 1 petaFLOP of FP4 compute — starting at around $3,999 USD. It lets developers run 200B-parameter models locally and fine-tune 70B models, making it the most accessible NVIDIA AI development platform available today."
description: "The NVIDIA DGX Spark is a desktop AI computer built around the Grace Blackwell Superchip, delivering 1 petaFLOP of compute in a compact form factor. This post covers its specs, positioning, how it compares to the DGX Station, and which use cases it's best suited for."
draft: false
---

🌏 [中文版](/posts/tech/2026-04-02-nvidia-dgx-spark-intro)

## What Is the DGX Spark?

The NVIDIA DGX Spark is a personal AI supercomputer unveiled by NVIDIA at GTC 2025 (originally codenamed Project DIGITS). It packs the Grace Blackwell architecture into a chassis smaller than an Intel NUC (150 × 150 × 50.5 mm, weighing just 1.2 kg), draws only 170 W of power, and delivers 1 petaFLOP of FP4 AI compute.

In short: this is NVIDIA's first attempt at putting a data-center-grade AI chip into something you can actually set on your desk.

## Core Specifications

| Spec | Details |
|------|---------|
| Chip | NVIDIA GB10 Grace Blackwell Superchip (ARM CPU + Blackwell GPU, connected via NVLink-C2C) |
| Memory | 128 GB unified memory (LPDDR5x, non-upgradeable) |
| Memory Bandwidth | 273 GB/s |
| AI Compute | 1 petaFLOP FP4 / 1,000 TOPS |
| Tensor Cores | 5th generation, FP4 precision support |
| Storage | 1 TB–4 TB (SKU-dependent, selected at purchase) |
| Networking | Wi-Fi 7, Bluetooth 5.3, 10GbE ConnectX-7 NIC |
| Ports | 4× USB4, HDMI 2.1 |
| Power Draw | 170 W |
| OS | NVIDIA DGX OS (Linux-based) |

## Model Support

- **Inference**: Runs models up to 200B parameters
- **Fine-tuning**: Supports models up to 70B parameters
- **Dual-node setup**: Two DGX Sparks connected via ConnectX-7 can handle models up to 405B parameters (e.g., Llama 3.1 405B)

The 128 GB of unified memory is the key differentiator. The highest-end consumer GPU today — the RTX 5090 — tops out at 32 GB of VRAM, which forces you to quantize or offload large models and significantly degrades the experience. With 128 GB, the DGX Spark can load an entire 70B model without compromise.

## Software Ecosystem

The DGX Spark ships with NVIDIA's full AI software stack pre-installed:

- **NVIDIA NIM**: Microservice-based inference engine — deploying a model takes just a few commands
- **NVIDIA Blueprints**: Pre-built AI application templates (RAG, agents, and more)
- **Development tools**: PyTorch, Jupyter, Ollama, and other popular frameworks work out of the box
- **Cloud continuity**: Containers developed locally can be pushed directly to NVIDIA DGX Cloud without any adaptation

This means whatever you prototype on the DGX Spark can be deployed to the cloud or a data center unchanged — no re-architecting required.

## Pricing and Availability

DGX Spark pricing has evolved since its announcement:

- **GTC 2025 announcement**: $3,000 USD (as Project DIGITS)
- **October 2025 general availability**: Founders Edition at $3,999 USD
- **February 2026 price increase**: $4,699 USD (NVIDIA cited tight supply of 128 GB LPDDR5x)
- **OEM versions**: ASUS Ascent GX10 starting at ~$3,000 USD (1 TB storage)

Beyond NVIDIA's own offering, OEM partners including Acer, ASUS, Dell, GIGABYTE, HP, Lenovo, and MSI have all released their own versions.

## DGX Spark vs. DGX Station

If you're trying to decide between the DGX Spark and DGX Station, here's the key comparison:

| | DGX Spark | DGX Station |
|---|---|---|
| Chip | GB10 Grace Blackwell | GB300 Grace Blackwell Ultra |
| AI Compute | 1 petaFLOP | 20 petaFLOP |
| Memory | 128 GB unified memory | 784 GB (288 GB HBM3e + 496 GB LPDDR5X) |
| Memory Bandwidth | 273 GB/s | 8 TB/s (GPU) + 396 GB/s (CPU) |
| Max Model Size | 200B (single node) / 405B (dual node) | 1T parameters |
| Multi-user | Single user | MIG up to 7 partitions |
| Networking | 10GbE ConnectX-7 | 800 Gb/s ConnectX-8 SuperNIC |
| Form Factor | NUC-sized (1.2 kg) | Tower workstation |
| Price | ~$3,999–$4,699 | Estimated five-figure USD |

**Bottom line**: The DGX Spark is for individual developers and small teams; the DGX Station is a lab- or enterprise-grade machine — 20× the compute, 6× the memory, and a price tag in a completely different league.

## Who Is It For?

The DGX Spark is best suited for:

1. **AI developers** who need to run CUDA workloads locally and work within the NVIDIA toolchain ecosystem
2. **LLM researchers** who want to fine-tune and test large language models locally without paying for cloud compute every time
3. **Prototyping** — iterate quickly on local hardware, then scale to the cloud once you've validated your approach
4. **Privacy-sensitive environments** — healthcare, finance, and government organizations where data cannot leave the premises
5. **Edge AI** applications requiring high-compute inference at the edge

If you're currently running llama.cpp on a Mac Studio, or running models locally on an RTX 4090/5090 and constantly hitting memory limits, the DGX Spark is the most logical upgrade path available — 128 GB of unified memory plus full NVIDIA software support, with no real competitor at this price point.

## Summary

The DGX Spark represents a broader trend: **the democratization of AI compute**. Not long ago, your options for running large models were either renting cloud GPUs or spending hundreds of thousands on a workstation. Now, for under $5,000 USD, you can put a machine capable of running 200B-parameter models on your desk.

It's not perfect — the 273 GB/s memory bandwidth is a bottleneck, the memory isn't upgradeable, and training capabilities are limited. But as a local inference and fine-tuning development machine, the DGX Spark has carved out a precise and well-defined niche in the 2025–2026 AI hardware market.

## References

- [NVIDIA DGX Spark Official Product Page](https://www.nvidia.com/en-us/products/workstations/dgx-spark/)
- [NVIDIA Newsroom — DGX Spark Arrives for World's AI Developers](https://nvidianews.nvidia.com/news/nvidia-dgx-spark-arrives-for-worlds-ai-developers)
- [NVIDIA Blog — DGX Spark and DGX Station Power Open-Source and Frontier Models](https://blogs.nvidia.com/blog/dgx-spark-and-station-open-source-frontier-models/)
- [NVIDIA DGX Spark Hardware Specifications](https://docs.nvidia.com/dgx/dgx-spark/hardware.html)
- [NVIDIA DGX Spark Marketplace](https://marketplace.nvidia.com/en-us/enterprise/personal-ai-supercomputers/dgx-spark/)
- [NVIDIA DGX Spark Review — IntuitionLabs](https://intuitionlabs.ai/articles/nvidia-dgx-spark-review)
- [DGX Spark vs DGX Station Full Comparison — TWOWIN](https://twowintech.com/nvidia-dgx-spark-vs-nvidia-dgx-station-a-comprehensive-comparison/)
- [Nvidia DGX Spark: The Best Inventions of 2025 — TIME](https://time.com/collections/best-inventions-2025/7318247/nvidia-dgx-spark/)
- [DGX Spark now available for $3,999 — Constellation Research](https://www.constellationr.com/blog-news/insights/nvidia-dgx-spark-now-available-3999-real-impact-will-be-ai-edge)
- [DGX Spark vs. Mac Studio Price Comparison — Rost Glukhov](https://www.glukhov.org/post/2025/10/nvidia-dgx-spark-prices/)

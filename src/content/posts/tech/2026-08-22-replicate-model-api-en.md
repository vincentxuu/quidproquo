---
title: "Replicate: Turn Model Versions into Prediction APIs Instead of Renting GPUs"
date: 2026-08-22
category: tech
type: deep-dive
tags: [replicate, model-api, inference, machine-learning, cog]
lang: en
tldr: "Replicate abstracts GPUs behind versioned models, predictions, Cog, and deployments; integrators still own version pinning, async workflows, webhook verification, data persistence, and spending limits."
description: "Replicate public and custom models, Cog, prediction lifecycle, deployments, webhooks, data retention, and self-hosted inference tradeoffs."
series:
  name: "Technology Choices in the AI Era"
  order: 62
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-22-replicate-model-api)

[Replicate](https://replicate.com/docs/reference/how-does-replicate-work) centers on model versions and predictions rather than VMs. Call public models or use [Cog](https://replicate.com/docs/get-started/deploy-a-custom-model) to package weights, dependencies, and `predict()`, while the platform supplies APIs and GPU scaling.

In 2025-11 Replicate announced it was [joining Cloudflare](https://blog.cloudflare.com/replicate-joins-cloudflare/); the Replicate brand and API stay the same and existing models keep working. Cloudflare's stated direction is to bring Replicate models into AI Gateway and let Cog-packaged custom models run on Workers AI (still marked as coming soon in the [2026-04 announcement](https://blog.cloudflare.com/ai-platform/)). Treat Cloudflare as the vendor when you evaluate billing, data governance, and SLAs; teams already on Workers or AI Gateway should check whether the same model can be called from the Cloudflare side.

## Pin versions, not names

A new version under one model may change weights, code, dependencies, input schema, or output. Production requests should pin a version digest, evaluate upgrades against golden inputs, and then update a deployment. For community models, inspect license, author, source, sensitive-data policy, and supply chain. Callable does not mean commercially usable or trustworthy.

Cog reduces packaging work but does not guarantee quality. Put local `cog predict`, tests and evaluations, adversarial inputs, resource limits, and output validation in CI.

## A prediction is an asynchronous state machine

[Prediction creation](https://replicate.com/docs/topics/predictions/create-a-prediction/) supports sync and async modes. Images, video, and long inference usually use async: create a prediction, retain its ID, receive a terminal state through webhooks or polling, then copy output to owned storage. A client timeout does not mean cancellation, and a retry must not blindly create another expensive job.

[Webhooks](https://replicate.com/docs/topics/webhooks/) may be retried or reordered. Verify signatures and timestamps first, deduplicate by webhook and prediction IDs, and permit valid state transitions only. Treat output URLs as untrusted: restrict scheme, host, size, content type, and timeout to reduce SSRF and resource-exhaustion risk.

## Deployments trade capacity for latency

[Deployments](https://replicate.com/docs/topics/deployments/) provide private dedicated endpoints, hardware choice, minimum and maximum instances, rollout and rollback, and metrics. Zero minimum saves idle cost but cold-boots; warm instances improve latency. Tune from queue depth, startup, inference, errors, GPU memory, and cost per successful prediction.

[Data retention](https://replicate.com/docs/topics/predictions/data-retention/) automatically removes API prediction inputs, outputs, and logs under documented rules, so copy required files promptly. Conversely, governance must approve sending sensitive inputs to a third party and define residency, training use, deletion, and audit requirements.

Replicate fits rapid productization of public or custom models. Runpod, CoreWeave, or Nebius are more suitable for full training clusters, unusual runtimes and networks, or deep cost tuning. Redeliver a webhook, let output expire, switch model versions, and saturate maximum instances to verify idempotency, persistence, rollback, and budgets.

## Update history

- 2026-11-23: Added Replicate's status after the Cloudflare acquisition (API unchanged, models moving into AI Gateway and Workers AI) and what it means for vendor selection.

## References

- [Replicate is joining Cloudflare (Cloudflare Blog)](https://blog.cloudflare.com/replicate-joins-cloudflare/)
- [Cloudflare's AI Platform: an inference layer designed for agents](https://blog.cloudflare.com/ai-platform/)

- [How Replicate works](https://replicate.com/docs/reference/how-does-replicate-work)
- [Deploy a custom model with Cog](https://replicate.com/docs/get-started/deploy-a-custom-model)
- [Create a prediction](https://replicate.com/docs/topics/predictions/create-a-prediction/)
- [Replicate deployments](https://replicate.com/docs/topics/deployments/)
- [Replicate webhooks](https://replicate.com/docs/topics/webhooks/)
- [Replicate data retention](https://replicate.com/docs/topics/predictions/data-retention/)

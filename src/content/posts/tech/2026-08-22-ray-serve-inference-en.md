---
title: "Self-Hosting Inference with Ray Serve: Python Service Graphs, GPU Scheduling, and Autoscaling"
date: 2026-08-22
category: tech
type: deep-dive
tags: [ray-serve, ray, inference, distributed-systems, gpu, self-hosted]
lang: en
tldr: "Ray Serve is a distributed serving layer on Ray. Deployments and handles compose Python service graphs, while replicas, CPU/GPU scheduling, autoscaling, and model multiplexing handle orchestration; it complements rather than replaces vLLM or SGLang."
description: "A practical guide to Ray Serve deployments, replicas, handles, dynamic batching, autoscaling, and LLM serving, including its boundaries with SGLang, vLLM, Triton, and Kubernetes."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-ray-serve-inference)

[Ray Serve](https://docs.ray.io/en/latest/serve/) is the model-serving layer on the Ray distributed computing framework. You define HTTP ingress, preprocessing, model workers, and postprocessing in ordinary Python. Serve turns deployments into replicas, and Ray places them on CPUs, GPUs, and nodes across a cluster.

Its central question is how an inference product composed of several services should execute across a cluster—not how to make one transformer kernel run fastest. Ray Serve can therefore wrap vLLM or SGLang, while also orchestrating conventional PyTorch models and ordinary Python logic.

## A deployment is an independently scalable service unit

`@serve.deployment` declares a service. A deployment can have several replicas, each implemented as a long-lived Ray actor. Deployment handles let services call one another without leaving the cluster for an HTTP round trip.

```python
from ray import serve

@serve.deployment(
    ray_actor_options={"num_gpus": 1},
    autoscaling_config={"min_replicas": 1, "max_replicas": 4},
)
class Embedder:
    def __init__(self):
        self.model = load_model()

    async def __call__(self, texts: list[str]):
        return self.model.encode(texts).tolist()

@serve.deployment
class SearchAPI:
    def __init__(self, embedder):
        self.embedder = embedder

    async def __call__(self, request):
        body = await request.json()
        vectors = await self.embedder.remote(body["texts"])
        return {"vectors": vectors}

app = SearchAPI.bind(Embedder.bind())
```

This boundary lets the API tier scale by incoming requests while the GPU embedder follows its own queue and resource policy. Models load once when a replica starts instead of on every request. The operator still owns startup time, health, and capacity.

## Autoscaling responds to queues; it does not predict demand

The [autoscaling guide](https://docs.ray.io/en/latest/serve/autoscaling-guide.html) explains how Serve adjusts replica counts using ongoing and queued requests. Target ongoing requests, replica bounds, metric intervals, and smoothing parameters determine responsiveness.

A GPU model may download weights, allocate memory, and compile kernels during cold start. Setting the minimum to zero saves idle cost but transfers cold-start latency to the first users. Measure time from container start to readiness, then choose the lower bound from the latency budget.

Ray places replicas on nodes with sufficient resources. Cross-node tensor parallelism and placement groups are also constrained by GPU topology, networking, and resource fragmentation. Four GPUs in aggregate do not guarantee that a four-GPU model can be scheduled at any instant.

## Dynamic batching fits mergeable Python requests

[Dynamic request batching](https://docs.ray.io/en/latest/serve/advanced-guides/dyn-req-batch.html) uses `@serve.batch` to combine requests into one method call. Embeddings, image classification, and reranking often gain GPU utilization this way.

The batched method receives lists of arguments and must return an equally sized result list. Maximum batch size and waiting time trade latency for throughput. For token-by-token generation, prefer the continuous batching inside vLLM or SGLang, then let Ray Serve manage replicas, routing, and the service graph. Avoid scheduling the same work twice at two layers.

## Ray Serve LLM combines orchestration with a specialized engine

[Ray Serve LLM](https://docs.ray.io/en/latest/serve/llm/) provides OpenAI-compatible ingress, model configuration, routing, and multi-node deployment around supported engines. It fits teams that already need a Ray cluster and want to combine an LLM, guardrails, retrieval, and other Python deployments into one application.

For one model on one GPU, starting SGLang or vLLM directly removes a layer. If the main requirement is a repository of heterogeneous model backends, versions, and ensembles, Triton may match better. Ray Serve's differentiator is Python-native service composition plus cluster resource coordination.

## Production still needs boundaries outside Ray

The [production guide](https://docs.ray.io/en/latest/serve/production-guide/) covers configuration, fault tolerance, Kubernetes, and dependencies. A common design lets KubeRay manage RayCluster or RayService resources while Ray Serve manages application replicas. Kubernetes and Ray then have separate autoscaling layers; if their limits and metrics disagree, Serve may request replicas while no node capacity is available.

Do not treat a Serve endpoint as the public security boundary. TLS, WAF, authentication, tenant rate limits, and request-size controls belong in an ingress or gateway. Never expose the Ray dashboard or cluster control plane publicly. Replicas execute Python code, so dependencies and model weights are supply-chain assets.

Observability should separate ingress latency, deployment queues, replica processing time, and node/GPU resources. One aggregate API latency cannot tell whether the gateway, Serve queue, model engine, or infrastructure scaler is slow.

## When Ray Serve is worth the layer

Ray Serve fits teams with existing Ray workloads, multi-model service graphs, cross-node GPU placement, independently scaled components, or a desire to share the Ray ecosystem across training, batch, and online inference. It is excessive for a low-traffic endpoint that fits on one GPU, and it does not erase the networking, deployment, and failure costs of distributed systems.

Start an evaluation with two deployments: CPU preprocessing and one GPU model. Measure one-replica capacity and cold-start time using real requests, configure autoscaling, then terminate a replica and a worker node. Confirm that requests, monitoring, and recovery meet the SLO before expanding into a full platform.

## References

- [Ray Serve Documentation](https://docs.ray.io/en/latest/serve/)
- [Ray Serve Model Composition](https://docs.ray.io/en/latest/serve/model_composition.html)
- [Ray Serve Autoscaling Guide](https://docs.ray.io/en/latest/serve/autoscaling-guide.html)
- [Ray Serve Dynamic Request Batching](https://docs.ray.io/en/latest/serve/advanced-guides/dyn-req-batch.html)
- [Ray Serve LLM](https://docs.ray.io/en/latest/serve/llm/)
- [Ray Serve Production Guide](https://docs.ray.io/en/latest/serve/production-guide/)
- [Ray on Kubernetes with KubeRay](https://docs.ray.io/en/latest/cluster/kubernetes/)

---
title: "How to Use Cloudflare Containers: When Workers Need a Full Linux Runtime"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, containers, workers, durable-objects, runtime, deployment]
lang: en
tldr: "Cloudflare Containers let a Workers app call on-demand serverless containers for workloads that need a full filesystem, a specific runtime, existing container images, or more CPU, memory, and disk. They do not replace Workers; Workers still handle entry, routing, and platform bindings while containers run the heavy runtime-specific work."
description: "A practical guide to Cloudflare Containers: Worker routing, Container class, Durable Objects bindings, image deployment, instance types, limits, pricing, and the boundary with Browser Run."
draft: false
series:
  name: "Cloudflare Edge Platform"
  order: 18
---

> 🌏 [中文版](/posts/tech/2026-08-30-cloudflare-containers-workers-runtime)

Workers are a strong fit for HTTP APIs, edge rendering, webhooks, lightweight background jobs, and glue code around data bindings. They are not a universal runtime. Once a workload needs a full filesystem, a specific binary, more memory or disk, parallel CPU cores, or an existing container image, plain Workers begin to feel constrained.

[Cloudflare Containers](https://developers.cloudflare.com/containers/) fill that gap. The official docs describe them as serverless containers that enhance Workers: Workers still receive requests, handle routing, enforce permissions, and connect to D1/R2/KV/Queues; the Linux-like runtime is used only for the part that needs it.

That means Containers should not be the first Cloudflare Edge Platform post a reader studies. Understand Workers, D1, R2, Durable Objects, Queues, and Workflows first. Then Containers make sense: they show which work should stay in an isolate and which work justifies starting a container.

## When Containers Are Worth Considering

I would consider Containers in these cases:

- An existing tool is already distributed as a container image.
- The workload needs a full filesystem or Linux-like environment.
- The app needs a specific runtime, native dependency, binary, or CLI.
- The job needs more memory, disk, or multiple CPU cores.
- A short-lived heavy task needs to fit into a Cloudflare app.
- An AI app needs to run code, transform files, analyze artifacts, or call tools that do not fit regular Workers.

For normal API routing, JSON processing, database access, caching, auth, and simple background work, I would not reach for Containers first. Workers start quickly, have a simpler cost model, and compose well with edge cache and bindings.

## Architecture: Worker Controls, Container Executes

The core model is:

1. A Worker receives the request.
2. The Worker chooses a container instance by session, tenant, path, or job ID.
3. The container instance starts on demand.
4. The Worker forwards the request to the container.
5. The container sleeps after an idle period, stopping charges.

The official example has this shape:

```ts
import { Container, getContainer } from "@cloudflare/containers";

export class MyContainer extends Container {
  defaultPort = 4000;
  sleepAfter = "10m";
}

export default {
  async fetch(request, env): Promise<Response> {
    const { "session-id": sessionId } = await request.json();
    const instance = getContainer(env.MY_CONTAINER, sessionId);
    return instance.fetch(request);
  },
} satisfies ExportedHandler;
```

Wrangler configuration declares `containers`, a Durable Objects binding, and a migration:

```jsonc
{
  "containers": [
    {
      "class_name": "MyContainer",
      "image": "./Dockerfile",
      "max_instances": 5
    }
  ],
  "durable_objects": {
    "bindings": [
      {
        "class_name": "MyContainer",
        "name": "MY_CONTAINER"
      }
    ]
  },
  "migrations": [
    {
      "new_sqlite_classes": ["MyContainer"],
      "tag": "v1"
    }
  ]
}
```

The easy detail to miss is Durable Objects. Cloudflare Containers are not a Worker calling some Kubernetes service directly. The `Container` class extends `DurableObject`: the Durable Object handles routing, lifecycle, and persistent state, while the container process runs your image in a Linux VM.

That explains why named containers, stateful services, session routing, and load balancing are possible. The Worker remains the control plane, and the container is a runtime segment in the data plane.

## Deploy: Wrangler Handles Worker and Image Together

Containers require Docker for local build and push. The get started guide says Docker must be running locally during deployment. `wrangler deploy` uploads the Worker, builds and pushes the container image with Docker, and updates container instances on Cloudflare's network.

Provisioning time also matters. The official docs warn that after the first deploy, the Worker URL may respond before containers are fully provisioned, so container routes may fail for a few minutes. Check status with:

```bash
npx wrangler containers list
npx wrangler containers images list
```

and use the Containers dashboard logs, metrics, and status before assuming the code is broken.

The image can point to a Dockerfile, a directory containing a Dockerfile, or a full image reference in Cloudflare Registry. The container image must run on `linux/amd64`.

## Routing: Fixed Instance or Load Balance

The official examples show two routing modes.

The first uses a path or session ID to find a specific instance. This fits:

- per-user sessions
- per-tenant workers
- short-lived jobs
- tasks that need container-local state
- flows that require lifecycle control

The second load-balances requests across multiple container instances. This fits:

- stateless APIs
- retryable file transformation services
- equivalent worker process pools

For stateful routing, I would make the routing key explicit, such as `tenantId:jobId` or `sessionId`. For a stateless pool, any instance must be able to process any request, and state should live in D1/R2/Durable Object storage rather than the container filesystem.

## Instance Types and Limits

Container CPU, memory, and disk are set by instance type. The official limits page lists six predefined instance types:

| Instance type | vCPU | Memory | Disk |
|---|---:|---:|---:|
| lite | 1/16 | 256 MiB | 2 GB |
| basic | 1/4 | 1 GiB | 4 GB |
| standard-1 | 1/2 | 4 GiB | 8 GB |
| standard-2 | 1 | 6 GiB | 12 GB |
| standard-3 | 2 | 8 GiB | 16 GB |
| standard-4 | 4 | 12 GiB | 20 GB |

Custom instance types are also possible, with boundaries: vCPU minimum 1 and maximum 4, memory maximum 12 GiB, disk maximum 20 GB, at least 3 GiB memory per vCPU, and a disk-to-memory ratio limit.

Account-level limits include 6 TiB concurrent memory, 1,500 concurrent vCPU, 30 TB concurrent disk, and 50 GB total image storage. Image size is related to instance disk space.

These numbers make Containers useful for bursty heavy work, while also showing why they should not replace every request handler. If the instance type is too large, provisioned memory and disk affect cost.

## Pricing: Charges Start When the Container Runs

Containers are available on the Workers Paid plan. The official pricing page says Containers are billed for every 10ms they are actively running, with included monthly usage in the $5/month Workers Paid plan:

- Memory: 25 GiB-hours per month included, then $0.0000025 per additional GiB-second.
- CPU: 375 vCPU-minutes per month included, then $0.000020 per additional vCPU-second.
- Disk: 200 GB-hours per month included, then $0.00000007 per additional GB-second.

Billing starts when a request is sent to the container or when it is manually started. Billing stops after the instance goes to sleep. Memory and disk are based on provisioned resources for the instance type; CPU is based on active usage.

Network egress is priced separately. The pricing page lists $0.025 per GB for North America and Europe, $0.05 per GB for Oceania, Korea, and Taiwan, and $0.04 per GB everywhere else, with included monthly allotments. A Containers app also incurs Workers and Durable Objects pricing, and logs integrate with Workers Logs pricing.

In practice, Containers cost is not just the container itself. A full job may include Worker requests, Durable Objects, container vCPU/memory/disk, network egress, R2, Queues, and logs.

## Boundary with Browser Run and Sandbox SDK

These three services can look similar:

| Need | Look first at |
|---|---|
| Headless Chrome, screenshots, PDFs, Playwright automation | Browser Run |
| Agent execution of untrusted or semi-trusted code | Sandbox SDK |
| Existing images, native binaries, custom runtimes, heavy services | Containers |

Containers can run browsers and can host a code execution service, but that does not make them the first choice for every case. Browser Run already manages headless Chrome. Sandbox SDK is designed around isolated agent code execution. Containers are better understood as the runtime escape hatch for Cloudflare apps.

## Product Architecture Example

Suppose you are building an AI content-processing product on Cloudflare. A practical architecture could be:

1. Worker receives the API request, checks the tenant, and writes a job record.
2. Queue receives heavy work such as file transformation, crawl cleanup, or artifact analysis.
3. Durable Object uses the job ID to control a container instance.
4. Container runs Python, Go, ffmpeg, or a native CLI.
5. R2 stores input files and output artifacts.
6. D1 stores job state, result summaries, and billing events.
7. Analytics Engine records duration, estimated vCPU use, tenant usage, and error type.

The benefit is clear separation. Workers stay thin. The container handles the heavy runtime. Data returns to Cloudflare storage, and observability stays on the same platform.

## When I Would Wait

I would avoid Containers at first when:

- The task fits in a normal Worker and completes quickly.
- The only need is headless browser automation, where Browser Run is enough.
- The team wants a long-running service but has not designed idle/sleep behavior, health checks, and cost controls.
- The team does not want to own Docker images, runtime patches, or binary dependencies.
- State only lives on the container filesystem and is not written back to D1/R2/DO.

Containers raise the ceiling of the Cloudflare Edge Platform, but they also bring deployment, resource sizing, cost, and observability complexity. Their place near the end of the series is intentional: use Workers and bindings for most product work first; bring in Containers for the remaining work that truly needs a Linux runtime.

## References

- [Cloudflare Containers](https://developers.cloudflare.com/containers/)
- [Containers get started](https://developers.cloudflare.com/containers/get-started/)
- [Containers limits and instance types](https://developers.cloudflare.com/containers/platform/limits/)
- [Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/)
- [Container class reference](https://developers.cloudflare.com/containers/reference/container-class/)
- [Durable Object Container API](https://developers.cloudflare.com/durable-objects/api/container/)
- [Containers examples](https://developers.cloudflare.com/containers/examples/)

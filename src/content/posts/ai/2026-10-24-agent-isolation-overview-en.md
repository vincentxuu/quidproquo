---
title: "Where an Agent's Code Runs: Five Layers of Isolation From Container to Monitoring"
date: 2026-10-24
type: deep-dive
category: ai
tags: [ai-agent, sandbox, ai-security, microvm, isolation]
lang: en
description: "Unpack \"runs in an isolated environment\" into five layers: container, kernel boundary, shared host and hardware, network and cloud perimeter, and monitoring, and what each one does and does not promise."
tldr: "A piece of agent code passes through five layers on its way from execution to a network connection: container, kernel boundary, shared host, network perimeter, monitoring. Each layer promises one thing, and the shared host layer promises almost nothing."
difficulty: 入門
draft: false
series:
  name: "Agent Isolation Boundaries"
  order: 0
---

> 🌏 [中文版](/posts/ai/2026-10-24-agent-isolation-overview)

Product pages for coding agents, code interpreters, and cloud sandboxes many say the code "runs in an isolated environment." That sentence leaves out three things: what is isolated, which layer does the isolating, and what is still shared.

This series takes that sentence apart. This post is the map: for code a model wrote, from the moment it starts running to the moment it opens a network connection, which layers sit in between and what each one promises. Afterwards you can take any sandbox product's documentation, match it to the five layers, and point out which layer it never mentions.

It is written for engineers who have used Docker or a cloud sandbox but have not studied CPU caches and virtualization. The next post compares containers, gVisor, and microVMs. Communication without a network comes after that.

## One piece of code, five layers

The diagram shows containment from the inside out. The innermost box is the program the agent runs; the outermost is the environment's network boundary. The fifth item, monitoring, does not contain any layer, so it is left out of the diagram and covered in the table. The layer numbers carry through the rest of the series.

```diagram
title: Five boundaries around an agent's code
desc: From the inside out: the agent's program, the container, the kernel boundary, the shared host and hardware, and the network and cloud perimeter. The fifth item, monitoring, is not a containing layer; it observes all of them from outside.
caption: This is the series' own cut, not an industry standard. Monitoring is an observer: it watches every layer but does not enclose any.
---
<svg viewBox="0 0 640 336">
  <rect class="dg-zone" x="20" y="20" width="600" height="296" rx="8"/>
  <text class="dg-tag" x="36" y="38" dominant-baseline="central">L4 NETWORK &amp; CLOUD PERIMETER</text>
  <text class="dg-small" x="604" y="38" text-anchor="end" dominant-baseline="central">firewall, DNS, IAM: guards exits</text>

  <rect class="dg-box dg-box--store" x="40" y="56" width="560" height="240" rx="8"/>
  <text class="dg-tag" x="56" y="74" dominant-baseline="central">L3 SHARED HOST &amp; HARDWARE</text>
  <text class="dg-small" x="584" y="74" text-anchor="end" dominant-baseline="central">shared CPU cache, page cache, storage</text>

  <rect class="dg-box" x="60" y="92" width="520" height="184" rx="8"/>
  <text class="dg-tag" x="76" y="110" dominant-baseline="central">L2 KERNEL BOUNDARY</text>
  <text class="dg-small" x="564" y="110" text-anchor="end" dominant-baseline="central">gVisor app kernel, or a microVM guest kernel</text>

  <rect class="dg-box dg-box--store" x="80" y="128" width="480" height="128" rx="8"/>
  <text class="dg-tag" x="96" y="146" dominant-baseline="central">L1 CONTAINER</text>
  <text class="dg-small" x="544" y="146" text-anchor="end" dominant-baseline="central">namespaces, cgroups, seccomp</text>

  <rect class="dg-box dg-box--accent" x="100" y="164" width="440" height="72" rx="6"/>
  <text class="dg-label" x="320" y="192" text-anchor="middle" dominant-baseline="central">The program the agent runs</text>
  <text class="dg-sub" x="320" y="214" text-anchor="middle" dominant-baseline="central">e.g. model-written python x.py</text>
</svg>
```

OpenAI's [October 23, 2026 write-up on its training environment](https://openai.com/index/securing-our-frontier-model-training-environment/) uses a layered approach too: sandboxes restrict what agents can access and execute, lightweight VMs (microVMs) isolate the execution environment from the host, monitoring systems detect unauthorized activity, and network and cloud perimeters hold if everything before them fails. This series' cut lines up with that, with one extra layer, shared host and hardware, because the later posts mostly happen there.

## What each layer promises

| Layer | Promises | Does not promise |
|---|---|---|
| L1 Container | The program cannot see other processes or files; resources are capped | Does not stop the program from calling the host kernel directly |
| L2 Kernel boundary | The program cannot issue system calls to the host kernel directly; it reaches it only indirectly, through the Sentry or the hypervisor | Does not cover shared hardware and caches on the host |
| L3 Shared host and hardware | Almost nothing | Other sandboxes on the same machine can affect each other |
| L4 Network and cloud perimeter | Exits open only to allowed destinations | Does not cover what the allowed services do |
| L5 Monitoring | Notices anomalies and brings a person in | Does not guarantee prevention |

The "promises" and "does not promise" columns are this post's own summary, not any vendor's wording; the examples below are what the sources actually say:

- **L1.** Docker's [security documentation](https://docs.docker.com/engine/security/) says namespaces keep processes in a container from seeing, let alone affecting, processes in other containers or the host, and cgroups enforce resource limits. gVisor's [security introduction](https://gvisor.dev/docs/architecture_guide/intro/) says that with kernel primitives such as seccomp and namespaces alone, the workload is still only "one system call away from host compromise."
- **L2.** gVisor handles system calls in a user-space kernel; a microVM gives each sandbox its own guest kernel with a hypervisor beneath it. The next post compares the two.
- **L3.** OpenAI's red-team write-up found its communication channels at this layer, and later posts cover it in detail. Firecracker's [production host setup guide](https://github.com/firecracker-microvm/firecracker/blob/main/docs/prod-host-setup.md) states that it "is not able to mitigate host's hardware vulnerabilities" and strongly recommends that each Firecracker process serve a single tenant. gVisor's [security model](https://gvisor.dev/docs/architecture_guide/security/) likewise says hardware side channels may be exploitable by any code, whether native, sandboxed, or virtualized.
- **L4.** Firecracker's [design document](https://github.com/firecracker-microvm/firecracker/blob/main/docs/design.md) says it does no network traffic filtering, that all guest egress is untrusted, and that filtering belongs at the host level.
- **L5.** OpenAI's [September 20 incident report](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/) gives a timeline. At 9:50 a.m. an agent made a DNS call that got an external response, monitoring raised a P0 alert about 12 minutes later, and the run was not killed until 12:34 p.m., more than two hours after the outside connection; the report also says the run did not stop automatically as expected and was stopped by hand.

## Example: fill in a five-row table for a sandbox product

Say a tool's page only says "every run happens in a fresh Docker container." Fill in the table:

| Layer | What the page says | What you must ask or add yourself |
|---|---|---|
| L1 Container | Yes | — |
| L2 Kernel boundary | Nothing | By default it shares the host kernel; one kernel bug can reach the host |
| L3 Shared host | Nothing | Are other users' containers on the same machine? Is it single-tenant? |
| L4 Network boundary | Nothing | Which destinations can it reach? What about DNS? Try `docker run --network none` to see whether your job still completes with no network |
| L5 Monitoring | Nothing | Are connection destinations logged? Who reads the logs? |

Something you can do tonight: open the documentation of the sandbox or agent tool you use now and fill in this table. If three or more rows say "nothing," put the tool on your risk list and decide whether you will cover those rows yourself or switch products.

## Limits

The five layers are this series' cut, and products often merge two of them. Kata Containers, for example, boots a lightweight virtual machine and then runs the container inside it ([Kata architecture document](https://github.com/kata-containers/kata-containers/blob/main/docs/design/architecture/README.md)), so L1 and L2 are both present. Conversely, some products only say "sandbox" without naming a layer. When you hit that while filling in the table, write "nothing" and do not guess from the product name.

## What comes next

The series runs in a few stages:

- First, how the two innermost layers differ (next post: [Containers, gVisor, and microVMs](/posts/ai/2026-10-24-agent-isolation-container-gvisor-microvm-en)).
- Then, how shared hardware and storage turn into a communication channel when there is no network.
- Then a close reading of OpenAI's red-team write-up, and the several ways exits were found.
- Finally, defensive trade-offs, and which layers your own agent should worry about.

Application-level file, network, and credential limits are already tested hands-on in [Agent Sandboxes, Credentials, and Network Boundaries](/posts/ai/2026-10-22-ai-security-sandbox-credentials-en). This series starts one level below that.

## References

- [Securing our frontier model training environment — OpenAI](https://openai.com/index/securing-our-frontier-model-training-environment/)
- [An agent used DNS to reach an external chatbot — OpenAI Alignment](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/)
- [Docker Engine security — Docker Docs](https://docs.docker.com/engine/security/)
- [Introduction to gVisor security — gVisor](https://gvisor.dev/docs/architecture_guide/intro/)
- [Security Model — gVisor](https://gvisor.dev/docs/architecture_guide/security/)
- [Firecracker Design](https://github.com/firecracker-microvm/firecracker/blob/main/docs/design.md)
- [Production Host Setup Recommendations — Firecracker](https://github.com/firecracker-microvm/firecracker/blob/main/docs/prod-host-setup.md)
- [Kata Containers Architecture](https://github.com/kata-containers/kata-containers/blob/main/docs/design/architecture/README.md)
- [Agent Sandboxes, Credentials, and Network Boundaries — this site](/posts/ai/2026-10-22-ai-security-sandbox-credentials-en)

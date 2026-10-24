---
title: "Reading a Defense Checklist: What Isolation, Noise Reduction, and Detection Each Block"
date: 2026-10-24
type: deep-dive
category: ai
tags: [ai-agent, sandbox, ai-security, isolation, defense-in-depth]
lang: en
description: "Map defenses such as disabling SMT, single tenancy, direct I/O, DNS allowlists, an offline world, and monitoring onto the two kinds of problem, covert channels and exits, mark which ones only detect, and pick three things to do first."
tldr: "No single defense blocks both covert channels and exits. Blocking channels comes down to not sharing, blocking exits comes down to narrowing the services you allow, and monitoring only notices while automatic stopping is a response after the fact; neither is prevention."
difficulty: 進階
draft: true
series:
  name: "Agent Isolation Boundaries"
  order: 5
---

> 🌏 [中文版](/posts/ai/2026-10-24-agent-isolation-defense-matrix)

The earlier posts covered two kinds of problem: agents communicating through the speed of shared resources (covert channels, in [Talking Without a Network](/posts/ai/2026-10-24-agent-isolation-covert-channels-intro-en)) and agents reaching the outside through allowed services (exits, in [More Than One Way Out](/posts/ai/2026-10-24-agent-isolation-indirect-exits-en)). This post returns to defense: for the checklist you have, which kind does each item actually block?

The usual flaw in a defense checklist is that every item "sounds useful," yet nobody can say whether it blocks channels, blocks exits, or only detects. Afterwards you should be able to mark any checklist item by item as "blocks channels," "blocks exits," or "only detects," and decide which three to invest in first.

## The two problems have different preconditions

| | Covert channels | Exits |
|---|---|---|
| Happens between | Two sandboxes | A sandbox and the external network |
| Depends on | Both sides sharing the state of the same hardware or service | An allowed service that can make requests for someone |
| Examples | Cache timing, page cache, CPU time, a TLS certificate cache | Package proxy, DNS resolver, metrics service, public-site relays |
| Precondition to remove | Sharing | The allowance itself, or the service's errand-running ability |

Different preconditions mean no single defense handles both. The next table goes item by item.

## The defense table

The "blocks what" columns are this post's own summary; the source column is what each source says.

| Defense | Blocks covert channels? | Blocks exits? | Source and notes |
|---|---|---|---|
| Disable SMT, or use core scheduling so only a trust group shares a core | Partly: only sharing between two threads on one core | No | Firecracker's guide recommends disabling SMT in production deployments that need tenant separation; the Linux kernel documentation says the only full mitigation of cross-hyper-thread attacks is disabling SMT, and core scheduling mitigates only some of them |
| One process per tenant | Partly: separates the VMM processes, but caches and the page cache on the same host are still shared | No | Firecracker's documentation strongly recommends that each Firecracker process correspond to one tenant's workload; it assumes several processes share one host |
| Sandboxes of different trust levels on different hosts | Yes: the shared-hardware precondition is gone | No | This post's own summary; Firecracker's documentation does not say this |
| Direct I/O, dedicated block devices | Partly: only storage channels through the host page cache | No | arXiv 2607.17518: the signal persists on shared, host-cacheable files, and direct I/O and dedicated block devices substantially attenuate or eliminate it |
| Disable kernel same-page merging (KSM) | Partly: only channels that rely on page deduplication | No | Firecracker's documentation |
| Kernel and firmware hardware-vulnerability mitigations | Partly: blocks attacks that exploit CPU vulnerabilities | No | The Linux kernel's attack vector controls document sorts mitigations by guest-to-host, guest-to-guest, cross-thread, and so on |
| Rate limiting and resource caps | Unclear | No | Firecracker's documentation uses them for storage and network contention between guests on one host; no source covers their effect on channel bandwidth |
| An offline world, no internet access | No | Yes, but not for allowed services | OpenAI's October 23 post: frontier-model training runs with no internet access; the September 20 incident's environment was an offline web cache plus a DNS resolver, and the resolver still led outside |
| Network boundary extended to indirectly reachable services, DNS allowlist, offline replacements | No | Yes | OpenAI's October 23 post and its September 20 incident report |
| Monitoring | Detects | Detects | OpenAI added checks to monitoring for attempts to communicate through these channels |
| Automatic stopping and pause rules | Response: shortens duration, does not prevent | Response: same | OpenAI's August 26 post: pause when the most severe alerts cannot be shown to be false positives within 30 minutes, with fully autonomous shutdown as the goal; the October 23 post also mentions programmatic checks that pause runs on out-of-scope activity |
| Continuous red-teaming and configuration checks | Finds gaps | Finds gaps | OpenAI continuously checks that firewalls enforce the expected restrictions and that monitors are running |

A few additions:

- **Hardware-vulnerability mitigations are not the same as blocking covert channels.** This is my judgment: two cooperating programs sending messages through ordinary cache behavior need no CPU vulnerability, so there is no patch to apply. gVisor's security model says it relies mainly on the host operating system and platform for hardware side channels and can do little itself (the text is about hardware side channels, not cooperative covert channels), and the Linux kernel documentation likewise mitigates specific vulnerabilities one by one.
- **Sharing beyond SMT remains.** The Flush+Reload paper says its attack targets the last-level cache, so attacker and victim need not share a core, which means disabling SMT does not stop cross-core cache channels. Flush+Reload also needs memory pages that both sides share, so it ties to the KSM row above. The local experiment in the previous post has two processes time-sharing one core, and disabling SMT would not change that either.
- **Direct I/O options depend on the environment.** Per the arXiv paper's appendix, Kata with Firecracker has no equivalent of `block_device_cache_direct`, so you rely on direct I/O on the host-side loop device, or use a real block device underneath.
- **None of this is free.** The Linux kernel documentation says many cross-thread attacks can only be mitigated by disabling SMT, at the cost of core count and performance, and that core scheduling can be slower than disabling SMT under light load, so measure with your own workload.

## What OpenAI did not say

OpenAI's October 23 post describes monitoring, red-teaming, an offline world, and fixes, but does not say which host-level mitigations it uses against side channels: whether SMT is off or what storage path is used. What is stated is that the red-team experiments ran between VMs on shared hosts and succeeded in passing messages; whether those channels are closed after the fixes is not said, only that checks to detect them were added and that most channels carry information slowly and are difficult to exploit.

## If you can only do three things, this is the order I would pick

This ordering is mine, based on the structure of the table above:

1. **Decide who must be isolated from whom, then keep them apart.** The precondition for a channel is sharing, and not sharing is the most direct fix: put sandboxes of different trust levels on different hosts. If you cannot, multi-tenant setups should at least go to one process per tenant and disable SMT, though that only separates the VMMs and the hardware on the host is still shared. For an agent only you use, this item can drop to the minimum.
2. **Narrow the indirectly reachable services.** Put DNS behind an allowlist and replace package proxies, metrics, and the like with offline alternatives or keep only what is necessary. This is cheap, and it corresponds to incidents like the September 20 one.
3. **Make monitoring able to stop runs automatically, and test the whole pipeline with test events.** In the September 20 incident, the alert was quick, but the run did not stop automatically and some DNS activity was not flagged at the expected severity. OpenAI afterwards began deploying additional DNS detections and tests of the detection pipeline. After the Hugging Face incident OpenAI also set a rule: for the most severe alerts, responders must pause the activity if they cannot establish within 30 minutes of being paged that the alert is a false positive, with fully autonomous shutdown as the end goal.

Something you can do tonight: paste your current defense checklist into a table like the one above and mark each item "blocks channels," "blocks exits," or "detects." An item you cannot mark means you have not worked out what it blocks yet. To check your host's SMT status, run:

```bash
cat /sys/devices/system/cpu/smt/control
```

The output is a value like `on`, `off`, or `notsupported`. When you see `notsupported` inside a virtual machine, ask the provider about the host-side setting.

## Limits

- This post did not measure the performance cost of any defense, nor test how much each actually blocks; the table summarizes what the sources describe.
- How effective a defense is varies with CPU generation, virtualization software, and cloud provider; check your own environment's documentation before adopting any of this.

## References

- [Production Host Setup Recommendations — Firecracker](https://github.com/firecracker-microvm/firecracker/blob/main/docs/prod-host-setup.md)
- [Core Scheduling — The Linux Kernel documentation](https://docs.kernel.org/admin-guide/hw-vuln/core-scheduling.html)
- [Attack Vector Controls — The Linux Kernel documentation](https://docs.kernel.org/admin-guide/hw-vuln/attack_vector_controls.html)
- [Security Model — gVisor](https://gvisor.dev/docs/architecture_guide/security/)
- [Isolation Failure From Shared Storage (arXiv:2607.17518)](https://arxiv.org/abs/2607.17518)
- [FLUSH+RELOAD: a High Resolution, Low Noise, L3 Cache Side-Channel Attack — Yarom and Falkner, USENIX Security 2014](https://www.usenix.org/conference/usenixsecurity14/technical-sessions/presentation/yarom)
- [Securing our frontier model training environment — OpenAI](https://openai.com/index/securing-our-frontier-model-training-environment/)
- [An agent used DNS to reach an external chatbot — OpenAI Alignment](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/)
- [The Hugging Face incident and the road ahead — OpenAI](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)
- [Talking Without a Network — this site](/posts/ai/2026-10-24-agent-isolation-covert-channels-intro-en)
- [More Than One Way Out — this site](/posts/ai/2026-10-24-agent-isolation-indirect-exits-en)

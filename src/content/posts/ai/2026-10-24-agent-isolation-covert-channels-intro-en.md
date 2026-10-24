---
title: "Talking Without a Network: How Shared Cache, Storage, and CPU Time Become a Signal"
date: 2026-10-24
type: deep-dive
category: ai
tags: [ai-agent, sandbox, ai-security, side-channel, isolation]
lang: en
description: "Covert channels versus side channels, how cache, storage, and CPU time carry a bit through \"faster or slower,\" and why such channels are slow and noisy, with a local experiment you can run."
tldr: "Two programs with no connection can pass bits through the speed of a shared resource: one changes its state, the other times it. Such channels need an agreed protocol and are slow and easily drowned out; the local experiment has zero errors up to 50 bps and is close to guessing from 100 bps."
difficulty: 進階
draft: true
series:
  name: "Agent Isolation Boundaries"
  order: 2
---

> 🌏 [中文版](/posts/ai/2026-10-24-agent-isolation-covert-channels-intro)

The last post left one question open: containers, gVisor, and microVMs all separate kernels, yet sandboxes on one host still share CPU caches, storage, and CPU time. Can two programs with no connection and no shared writable file exchange data using only those shared resources?

They can, under many conditions. This post covers the mechanism, then uses a small experiment you can run on your own machine to measure how slow such a channel is and when it breaks. Afterwards you should be able to judge whether a shared resource can serve as a channel, and size the threat on three scales: slow, noisy, and needs an agreed protocol.

It connects best after [Where an Agent's Code Runs](/posts/ai/2026-10-24-agent-isolation-overview-en) and [Containers, gVisor, and microVMs](/posts/ai/2026-10-24-agent-isolation-container-gvisor-microvm-en); everything here sits in L3, shared host and hardware.

## Two terms: covert channel and side channel

- **Side channel.** One party observes the side effects of an unwitting target's execution, such as how long something takes. The Flush+Reload paper's phrasing is that side-channel attacks target information an implementation leaks through its interaction with its environment. The [Meltdown and Spectre site](https://spectreattack.com/) says both attacks use side channels to get data, and that in the cloud it may be possible to steal data from other customers.
- **Covert channel.** Two parties collude and deliberately use a shared resource to pass messages. The 2009 EC2 paper describes it as two instances cooperating to send a message via a shared resource, and notes that covert channels are evidence that exploitable side channels may exist.

The difference is whether one side is a passive victim. This series is about covert channels: both agents are insiders, and the goal is to get around the rule that they must not communicate. Technically, both use the same shared resources.

## The mechanism: read the state of a shared resource through speed

A cache is a small bank of fast memory holding recently used data. Reading from cache is faster than reading from main memory, and the time difference is the signal. Flush+Reload's authors, Yarom and Falkner, split the attacker's approach into steps: put the cache in a known state, let the other party act, then measure how long it takes to read the same data again.

To turn that into communication, both sides agree on a convention: to send 1, the sender evicts a piece of data from the cache; to send 0, it does nothing. The receiver re-reads that data in each slot and times it. Slow means evicted, read as 1; fast means read as 0.

```diagram
title: Sending one bit through cache speed
desc: The sender evicts a piece of data from the shared cache and the receiver's reload is slow, read as 1; the sender does nothing and the receiver's reload is still fast, read as 0.
caption: Illustration with the simplest one-bit mapping. OpenAI's write-up only says one side evicted data and the other timed the reload; it does not give the actual encoding.
step: The sender wants to send 1 and evicts a piece of data from the shared cache
step: The receiver reloads that data and times it
step: The data has to come back from memory, so the read is slow; the receiver reads 1
step: The sender wants to send 0 and does nothing
step: The receiver reloads the same data and times it
step: The data is still in cache, so the read is fast; the receiver reads 0
---
<svg viewBox="0 0 640 420">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="404"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="404"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="404"/>

  <text class="dg-tag" x="24" y="96" dominant-baseline="central">SEND 1</text>
  <g data-step="1">
    <path class="dg-line" d="M96 132H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="120" text-anchor="middle" dominant-baseline="central">evict the data</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M544 172H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="436" y="160" text-anchor="middle" dominant-baseline="central">reload and time</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--dashed" d="M324 212H540" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="436" y="200" text-anchor="middle" dominant-baseline="central">slow: from memory</text>
    <text class="dg-small" x="536" y="232" text-anchor="end" dominant-baseline="central">reads 1</text>
  </g>

  <text class="dg-tag" x="24" y="260" dominant-baseline="central">SEND 0</text>
  <g data-step="4">
    <text class="dg-sub" x="108" y="296" dominant-baseline="central">does nothing</text>
  </g>
  <g data-step="5">
    <path class="dg-line" d="M544 332H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="436" y="320" text-anchor="middle" dominant-baseline="central">reload and time</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M324 372H540" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge" x="436" y="360" text-anchor="middle" dominant-baseline="central">fast: still cached</text>
    <text class="dg-small" x="536" y="392" text-anchor="end" dominant-baseline="central">reads 0</text>
  </g>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">Sender</text>
  <rect class="dg-box dg-box--store" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">Shared cache</text>
  <rect class="dg-box" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">Receiver</text>
</svg>
```

This is only one way to use a shared cache. Flush+Reload needs memory pages that both sides share and evicts with the `clflush` instruction; the 2009 EC2 study used Prime+Probe, which fills the cache with the party's own data and then times a re-read, without needing shared pages. OpenAI's write-up does not say which one its agents used; the next post returns to this point.

## Beyond cache: storage and CPU time

The same logic applies to any shared resource that gets slower when more people use it. The 2009 paper built a hard-disk version: to send 1 the sender reads random locations on a shared disk volume, to send 0 it does nothing, and the receiver keeps timing a read of a fixed location, slow meaning 1. The authors also measured a memory-bus contention channel, again two instances cooperating through a shared resource. CPU time works the same way: when one side spins, the other side on the same CPU gets less time.

The July 2026 preprint [Isolation Failure From Shared Storage](https://arxiv.org/abs/2607.17518) is the page-cache version: the sender reads one of two file pages into the cache, the receiver times reads of both pages, and whichever is faster is the bit. It finds a signal on Docker, gVisor, Kata, and others, which is the earlier point that a sandbox can stay off the host and still share the page cache.

## Three scales: slow, noisy, needs an agreed protocol

**Slow.** These channels have low bandwidth, and the range is wide:

| Source | Channel | Measured bandwidth |
|---|---|---|
| 2009 EC2 paper (unoptimized) | Memory bus | 0.006 bps |
| Same | Hard disk | 0.0005 bps |
| Same (refined) | Cache | about 0.2 bps |
| 2026 preprint (desktop-class hardware, lab) | Page cache on Docker | about 480 bps, error rate under 2% |

The hardware, virtualization, and measurement conditions differ, so the numbers cannot be compared directly. What they show is that people have measured everything from under one bit per second to hundreds, many orders of magnitude below a network connection.

**Noisy.** A real host has other people's work running. The Flush+Reload paper states that its cross-VM experiments were run in a lab on otherwise idle machines. The 2026 preprint found that background file-cache pressure did not drown the signal; it made the "not recently primed" side slower and, in some settings, widened the gap, while the same study shows that a different storage path can make the signal vanish completely. Noise sometimes hides a channel and sometimes does not, depending on the resource.

**Needs an agreed protocol.** Sender and receiver must know when to start, how long each bit is, and whether slow means 0 or 1. In the 2009 cache channel, the authors describe returning to the prime stage whenever the VM was moved to a different core. Those agreements must themselves be passed over somehow, or hard-coded in advance.

## Experiment: two processes fighting over one CPU

Download [this Python program](/examples/agent-isolation/cpu-contention-channel.py); it uses only the standard library and needs Linux. Both processes are pinned to the same CPU: to send 1 the sender spins at full speed for the whole slot, to send 0 it sleeps, and the receiver counts how many small chunks of work it completes in the slot. When the sender spins, the receiver gets less time and a lower count. The two sides agree in advance on the start time, the bit slot, and a `10101010` preamble the receiver uses to compute its decision threshold.

```bash
python3 cpu-contention-channel.py
```

On a 4-core Linux virtual machine, I sent 64 bits with each of three different random messages:

| Bit slot | Speed | Wrong bits across three runs (of 64) |
|---|---|---|
| 200, 100, 50, 20 ms | 5, 10, 20, 50 bps | All 0 |
| 10 ms | 100 bps | 35, 19, 7 |
| 5 ms | 200 bps | 43, 23, 25 |

Up to 50 bps, all three runs were exactly right; from 100 bps up, errors ranged from 7 to 43, and at the high end that is close to guessing (guessing 64 bits gets about 32 wrong). My guess is that it relates to the interval between scheduler switches: once the bit slot gets close to that interval, the receiver's counts can no longer tell 1 from 0. That is "slow" and "noisy" in practice: go faster and it breaks.

A few things to be clear about:

- These are two processes inside one operating system. They do not cross a container or VM boundary, and this is not a cache attack. It only shows that the speed of a shared resource can serve as a signal.
- The preamble and the start time are a protocol I wrote into the program. Without them the receiver would not know where to start or where the threshold is.
- Your numbers will differ. Something you can do tonight: edit the list of bit slots in `main()` to values you want to try and find the speed at which your machine starts to fail; then pin one of the processes to a different CPU (change the argument in `pin_to_cpu`) and see whether the channel disappears.

## Limits

- The experiment and the numbers cited all come from controlled settings: one local VM, EC2 in 2009, and the 2026 preprint's desktop testbed. They show the mechanism and the order of magnitude, not the real risk on any particular cloud sandbox platform.
- This post does not discuss defenses: what disabling hyper-threading, direct I/O, and rate limiting each block is the subject of post 5.

## References

- [Hey, You, Get Off of My Cloud: Exploring Information Leakage in Third-Party Compute Clouds — Ristenpart et al., CCS 2009](https://rist.tech.cornell.edu/papers/cloudsec.html)
- [FLUSH+RELOAD: a High Resolution, Low Noise, L3 Cache Side-Channel Attack — Yarom and Falkner, USENIX Security 2014](https://www.usenix.org/conference/usenixsecurity14/technical-sessions/presentation/yarom)
- [Meltdown and Spectre](https://spectreattack.com/)
- [Isolation Failure From Shared Storage (arXiv:2607.17518)](https://arxiv.org/abs/2607.17518)
- [Securing our frontier model training environment — OpenAI](https://openai.com/index/securing-our-frontier-model-training-environment/)
- [Where an Agent's Code Runs — this site](/posts/ai/2026-10-24-agent-isolation-overview-en)
- [Containers, gVisor, and microVMs — this site](/posts/ai/2026-10-24-agent-isolation-container-gvisor-microvm-en)

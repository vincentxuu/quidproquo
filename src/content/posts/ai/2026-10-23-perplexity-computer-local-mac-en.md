---
title: "Choosing a Perplexity Computer Mode on Mac: Fully Local, Hybrid, Memory, and the Cloud Boundary"
date: 2026-10-23
category: ai
type: deep-dive
tags: [perplexity, ai-agent, local-inference, apple-silicon, privacy, macos]
lang: en
tldr: "On October 20, Perplexity Computer gained a fully local mode: the model and the agent both run on an Apple silicon Mac, for Pro, Max and Enterprise subscribers, with 36GB or more memory recommended. Files and reasoning stay on the Mac, but live information, the browser and sending mail still go online."
description: "How Perplexity Computer's fully local and Hybrid modes differ, the Mac memory bar, which steps still leave the machine, and whether to just try it or upgrade your Mac for it."
draft: false
glossary:
  - term: "unified memory"
    aliases: ["統一記憶體"]
    definition: "The single memory pool that Apple silicon shares between the CPU and GPU. A local model's weights have to fit in it alongside every other open app."
    context: "Perplexity sets its fully local and Hybrid memory recommendations in terms of unified memory."
---

> 🌏 [中文版](/posts/ai/2026-10-23-perplexity-computer-local-mac)

The claim going around is "unplug the network and it still works, zero data uploaded." The direction is right, with two conditions: offline only applies to tasks that don't need the network, and the 36GB of memory Perplexity recommends is more than several new Macs can be configured with. This post helps you decide how fully local and Hybrid differ, which steps still go online, and whether your Mac should just try it or wait.

## What it is: a Computer that starts on the Mac

Perplexity Computer is an agent that plans, calls tools, and finishes multi-step tasks. On October 20, 2026, Perplexity announced [fully local mode](https://www.perplexity.ai/hub/blog/perplexity-computer-now-runs-fully-local-on-mac), so the Mac app now has two ways to start a task:

- **Fully local**: the task starts on the Mac. The model, the agent, planning, reasoning and file processing all run on the machine.
- **Hybrid Compute**: launched in September. The task starts in the cloud, cloud models handle research and reasoning, and a model on the Mac processes private files. Personal information is masked before it leaves, kept on the Mac, or put to you for approval.

There are two local models: Qwen 3.6, and PPLX Pro, Perplexity's post-trained version of Qwen. You download one inside the app by following its instructions.

## Who it's for and what you need

- **Subscription**: Perplexity Pro, Max or Enterprise. The free tier can't use it.
- **Hardware**: an Apple silicon Mac. Fully local recommends 36GB or more of unified memory. The Hybrid [product page](https://www.perplexity.ai/hub/products/hybrid-compute) recommends 32GB, while the September [Hybrid announcement](https://www.perplexity.ai/hub/blog/introducing-hybrid-compute-on-mac) set the minimum at macOS 15 and 24GB.
- **Background**: the agent reads your files and operates apps such as Notes and Mail, so decide what scope you are comfortable granting before you authorize it.

## Choosing between the two modes

| Aspect | Fully local | Hybrid |
|---|---|---|
| Where a task starts | The Mac | The cloud |
| Planning and reasoning | Qwen 3.6 or PPLX Pro on the Mac | Cloud frontier models |
| Private files | Processed on the Mac, not sent to cloud models | Processed by the Mac model; masked, kept local, or you're asked before sending |
| Live information, browser | Only after you authorize the cloud | Cloud-first by design |
| Memory recommendation | 36GB | 32GB |
| Perplexity's example | Private holdings plus downloaded market data for a portfolio review | Confidential financials plus fresh market research for a deal review |

The two examples draw the line. If everything the task needs is already on your Mac, pick fully local. If it needs fresh outside information and you don't want confidential files leaving as they are, pick Hybrid. Perplexity also said on X that local tasks don't consume Computer credits; only the steps that reach the cloud do.

## An example: a Monday-morning to-do list

This is the easiest of Perplexity's three examples to reproduce. It only touches Messages, Mail and Notes.

1. In the Perplexity Mac app, choose fully local and grant access to Messages, Mail and Notes.
2. Prompt it: look at my recent conversations and email, find the requests and deadlines that need me, build an action list in Notes, and draft replies for me to check.
3. The local agent reads the conversations, extracts requests and deadlines, creates the list, gathers related local documents, and writes the draft replies.
4. You review the drafts before sending.

Message and email content, the list and the drafts all stay on the Mac. When you send in step 4, Mail uses its own service and goes online; that step needs the network no matter where the agent runs. If you changed the prompt to "and compare against today's market news," the task would need live information, so you would authorize the cloud or switch to Hybrid.

## Limits: what still leaves the Mac

```diagram
title: In fully local mode, what stays on the Mac and what leaves
desc: The model, agent and files sit inside the Mac; cloud frontier models, web and connected apps, and each app's own service sit outside and are reached only on authorization or when something is sent.
caption: Based on Perplexity's announcement and product page; dashed lines leave the Mac.
---
<svg viewBox="0 0 640 388">
  <rect class="dg-zone dg-zone--solid" x="20" y="40" width="320" height="280" rx="8"/>
  <text class="dg-tag" x="36" y="62" dominant-baseline="central">YOUR MAC</text>

  <path class="dg-line" d="M180 128V152" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M180 224V248" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--link dg-line--dashed" d="M268 172H396Q404 172 404 164V108Q404 100 412 100H444" marker-end="url(#arrow-link)"/>
  <path class="dg-line dg-line--link dg-line--dashed" d="M268 188H444" marker-end="url(#arrow-link)"/>
  <path class="dg-line dg-line--link dg-line--dashed" d="M268 204H396Q404 204 404 212V268Q404 276 412 276H444" marker-end="url(#arrow-link)"/>

  <rect class="dg-box" x="92" y="76" width="176" height="48" rx="6"/>
  <text class="dg-label" x="180" y="92" text-anchor="middle" dominant-baseline="central">Local model</text>
  <text class="dg-sub" x="180" y="112" text-anchor="middle" dominant-baseline="central">Qwen 3.6 / PPLX Pro</text>

  <rect class="dg-box dg-box--accent" x="92" y="156" width="176" height="64" rx="6"/>
  <text class="dg-label" x="180" y="180" text-anchor="middle" dominant-baseline="central">Local agent</text>
  <text class="dg-sub" x="180" y="200" text-anchor="middle" dominant-baseline="central">Plans, tools, sandbox</text>

  <rect class="dg-box dg-box--store" x="92" y="252" width="176" height="48" rx="6"/>
  <text class="dg-label" x="180" y="268" text-anchor="middle" dominant-baseline="central">Files and Mac apps</text>
  <text class="dg-sub" x="180" y="288" text-anchor="middle" dominant-baseline="central">Notes, Mail, Numbers</text>

  <rect class="dg-box dg-box--link" x="448" y="72" width="172" height="56" rx="6"/>
  <text class="dg-label" x="534" y="92" text-anchor="middle" dominant-baseline="central">Frontier models</text>
  <text class="dg-sub" x="534" y="112" text-anchor="middle" dominant-baseline="central">15+, with approval</text>

  <rect class="dg-box dg-box--link" x="448" y="160" width="172" height="56" rx="6"/>
  <text class="dg-label" x="534" y="180" text-anchor="middle" dominant-baseline="central">Web and apps</text>
  <text class="dg-sub" x="534" y="200" text-anchor="middle" dominant-baseline="central">Live data, approval</text>

  <rect class="dg-box dg-box--link" x="448" y="248" width="172" height="56" rx="6"/>
  <text class="dg-label" x="534" y="268" text-anchor="middle" dominant-baseline="central">App services</text>
  <text class="dg-sub" x="534" y="288" text-anchor="middle" dominant-baseline="central">Send mail, messages</text>

  <line class="dg-rule" x1="20" y1="344" x2="620" y2="344"/>
  <text class="dg-tag" x="20" y="368" dominant-baseline="central">LEGEND</text>
  <rect class="dg-box dg-box--link" x="88" y="360" width="16" height="16" rx="3"/>
  <text class="dg-small" x="112" y="368" dominant-baseline="central">Services off the Mac</text>
  <path class="dg-line dg-line--link dg-line--dashed" d="M280 368H312" marker-end="url(#arrow-link)"/>
  <text class="dg-small" x="324" y="368" dominant-baseline="central">Path that leaves the Mac</text>
</svg>
```

"Fully local" describes where the AI runs, not that the whole task never touches the network. The product page says sending a message or a meeting invitation still uses that app's service. A few things to know before relying on it:

- **The cloud is a door you open.** Live information, the browser and connected apps need your authorization. The local agent can also call 15 or more frontier models, and that step sends content to the cloud.
- **Whether it runs offline depends on the task.** 9to5Mac and MacStories both report that tasks complete without a connection; Perplexity's own announcement stresses that data isn't sent to the cloud and doesn't use the word "offline."
- **36GB is a recommendation, not a floor.** Perplexity doesn't explain where the number comes from, and it hasn't published a capability comparison between the local and cloud models.
- **Permission details are thin.** The sandbox and access controls get one paragraph; whether macOS permissions such as Full Disk Access are needed isn't spelled out, as [Particle's write-up](https://particle.news/story/perplexitys-computer-can-run-fully-locally-on-apple-silicon-macs) points out.

## How to use it: try first, then decide on hardware

1. Check the chip and memory under About This Mac.
2. Sort by memory:
   - **36GB or more**: try fully local directly.
   - **24 to 32GB**: start with Hybrid. You can try fully local too, but it's below the recommendation, so watch speed and stability yourself.
   - **Under 24GB**: below even Hybrid's minimum, so stay on the cloud version of Computer.
3. Pick a first task that only uses Notes, turn on airplane mode, and run it once. If it finishes, that kind of task doesn't depend on the cloud.
4. Start with one app and one folder, and widen the scope once it behaves.
5. Whether to buy a Mac for it: don't replace one for this feature alone. If you were upgrading anyway, pick at least the 36GB tier. [AppleInsider](https://appleinsider.com/articles/26/10/20/perplexity-computer-can-run-completely-local-on-mac-with-a-big-caveat) lays out the configurations: the M6 Mac mini tops out at 32GB, short of the recommendation; the M5 Pro Mac mini needs the 48GB or 64GB option; the M5 Max Mac Studio starts at 36GB.

## References

- [Perplexity Computer now runs fully local on Mac](https://www.perplexity.ai/hub/blog/perplexity-computer-now-runs-fully-local-on-mac): official announcement, 2026-10-20
- [Run Computer locally on your Mac](https://www.perplexity.ai/hub/products/hybrid-compute): official product page, both modes and memory recommendations
- [Introducing Hybrid Compute on Mac](https://www.perplexity.ai/hub/blog/introducing-hybrid-compute-on-mac): Hybrid announcement, 2026-09-01
- [Perplexity's Computer can now run entirely on your Mac, even offline](https://9to5mac.com/2026/10/20/perplexitys-computer-can-now-run-entirely-on-your-mac-even-offline/): 9to5Mac
- [Perplexity Computer's Local-First Approach to Agents](https://www.macstories.net/news/perplexity-computers-local-first-approach-to-agents/): MacStories
- [Perplexity computer now runs on Mac with 36GB memory catch](https://appleinsider.com/articles/26/10/20/perplexity-computer-can-run-completely-local-on-mac-with-a-big-caveat): AppleInsider, Mac memory configurations
- [Perplexity Adds Fully Local Computer Agent for Apple Silicon Macs](https://www.tao.media/perplexity-adds-fully-local-computer-agent-for-apple-silicon-macs/): summarizes Perplexity's X thread (local tasks don't consume credits)
- [Perplexity's Computer can run fully locally on Apple silicon Macs](https://particle.news/story/perplexitys-computer-can-run-fully-locally-on-apple-silicon-macs): Particle

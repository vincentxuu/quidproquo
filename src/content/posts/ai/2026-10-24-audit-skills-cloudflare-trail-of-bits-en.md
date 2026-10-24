---
title: "Auditing Your Own Project with AI: How Cloudflare's security-audit Skill and Trail of Bits' Skills Differ"
date: 2026-10-24
category: ai
type: deep-dive
tags: [security, ai-agent, agent-skills, code-review, cloudflare]
lang: en
series:
  name: "AI Agent Security Tooling Map"
  order: 5
tldr: "The two representatives take opposite approaches: Cloudflare's security-audit skill is a pure-LLM multi-stage process, and Cloudflare says that when its internal harness wired in Semgrep, the hunting agents did not call it once in a month; Trail of Bits combines Semgrep and CodeQL scripts with LLM judgment. I found no checks specific to Workers, D1, KV or Astro in the rules or supporting files of either, and neither publishes accuracy figures from real projects. This post is based on documentation only and was not run against any project."
description: "A comparison of the audit approach, verification design, cost and license of Cloudflare's security-audit skill and Trail of Bits' skills, what they lack for an Astro plus Cloudflare Workers project as an example, and what to prepare before running an audit."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-10-24-audit-skills-cloudflare-trail-of-bits)

From this post on, your goal changes. The first four posts covered protecting your development environment; from here on it is about testing what you build. If you only use agents and do not build products, you can stop after [post 4](/posts/ai/2026-10-24-agent-detection-audit-en).

On the [series map](/posts/ai/2026-10-24-ai-agent-security-tooling-map-en), this is the fifth kind: using AI to read your source code for vulnerabilities. The two representatives are Cloudflare's [security-audit-skill](https://github.com/cloudflare/security-audit-skill) and the audit-related plugins in Trail of Bits' [skills](https://github.com/trailofbits/skills). Cloudflare is the Workers vendor and Trail of Bits is a security consultancy; both skills are public repos of their own. This post relies only on their documentation and source files and has not run either against any project, so "how accurate" has no answer here; only the approaches can be compared.

The short version: these skills do not give Claude new abilities; they give it a ready-made audit process and tool plumbing. I found nothing in either that recognizes Workers, D1 or Astro, and neither publishes accuracy figures from real projects.

## Two opposite approaches

**Cloudflare: a pure-LLM, multi-stage process.** The skill splits an audit into six steps: reconnaissance first; then hunting dispatched by a coverage ledger (entry points, trust boundaries, attack classes), with a coverage review to fill gaps; then a separate independent verifier tries to disprove each candidate, the output format is checked, and a fresh agent verifies once more before the report. It does not call Semgrep or CodeQL.

In [its post about its internal harness](https://blog.cloudflare.com/build-your-own-vulnerability-harness), Cloudflare writes that when it wired Semgrep through the whole pipeline, the hunting agents never called it in a month, because they would rather read and run the code themselves. It also says a single run finds only about half of what several runs together would, skewed toward the simpler and less subtle bugs, and it does not claim a false-negative rate.

The repo has two scripts that check only the JSON structure of the output and that the ledger is consistent, not whether a finding is real. One more design choice is worth noting: without an OS-level sandbox, the skill does not execute the target code, and the related leads are downgraded to `needs_validation` with no severity.

**Trail of Bits: a mix of tools and an LLM.** It is a collection of 46 plugins (as of 23 October 2026), and several of them concern auditing:

| plugin | What it does | What it relies on |
|---|---|---|
| `static-analysis` | Calls Semgrep and CodeQL scripts and merges the results into SARIF | Mostly deterministic tools |
| `insecure-defaults` | Finds unsafe default settings | Several LLM agents: recon first, then parallel discovery, then agents whose job is to refute |
| `fp-check` | Exists to cut false positives; its description says "LLMs are biased toward seeing bugs and overrating severity" | LLM |
| `differential-review` | Reviews the diff of a PR or commit | LLM |
| `supply-chain-risk-auditor` | Runs a script to measure things such as the number of maintainers and downloads rather than letting an LLM estimate from memory | A script collects the data |

The approaches differ: Cloudflare has the LLM read the code itself and then verifies with another agent; Trail of Bits first runs deterministic tools such as Semgrep and CodeQL and then lets an LLM judge which results are real. Neither publishes accuracy figures, so this post compares approaches and does not rank them.

## Taking Astro plus Cloudflare Workers as an example: when the tools do not cover your stack

In both repos I could find no checks specific to Workers, D1, KV, Astro or Vectorize. Cloudflare's skill, despite coming from Cloudflare, is a generic audit process with no rules specific to Workers products. The nearest are generic items. Cloudflare's cloud and deployment file has "Edge/runtime boundary mismatch" (an edge or serverless runtime assumes something that differs from the origin runtime). Its core attack classes include preview, draft and staging leakage, asking whether draft content can be found through search, RSS or sitemaps; and its data-isolation file checks whether derived copies such as search, cache, embedding and RSS copies are invalidated after the primary record's permissions change. These are useful for a content site with draft posts and a search index.

Concretely:

- Trail of Bits' Semgrep rulesets are mapped by file extension: `.js`, `.jsx`, `.ts` and `.tsx` map to JavaScript, TypeScript, React, Node.js, Express, Next.js and Angular, and `.astro` is not in the table.
- Cloudflare's skill says not to assume that deployment controls outside the source are present or absent, and marks such leads `needs_validation`. The actual values of secrets, and the real resource configuration on the account side (Vectorize indexes, D1 data and access, Workers AI switches), are not in the source, so those leads stop at `needs_validation`. Binding declarations live in `wrangler.jsonc`, which is visible.
- Cloudflare's AI and LLM file covers indirect injection through RAG, cross-tenant embeddings and memory poisoning, and also says "Prompt injection alone is not a finding". It has no items for specific vector database products such as Vectorize, only generic tenant-isolation checks for embeddings and retrieval.
- Trail of Bits' supply-chain auditor reads only npm-family lockfiles such as `package-lock.json` and `npm-shrinkwrap.json`, and its documentation says it does not read `pnpm-lock.yaml` or `yarn.lock`. When it detects one, the report notes "present but not read" and versions fall back to manifest pins or the latest release. So for a project with only `pnpm-lock.yaml`, this audit has no locked versions to check, and what it checks are not the versions you actually installed. With both lockfiles present, the code that collects its data uses `package-lock.json` whenever it exists and does not check whether it is stale; I read that code and did not run it.

To check whether your own stack is covered, clone both repos and search the rules and supporting-file directories for your framework and platform names, for example `grep -rilw -e astro -e vectorize -e wrangler .`. Zero hits means only generic rules.

## What it costs and how accurate it is

Neither project publishes vulnerability-detection accuracy or false-positive rates from real projects (some Trail of Bits plugins ship self-built evals, which are regression tests for the skill itself). User reports are scattered: on Hacker News, one person says they used at least 150k tokens on a small FastAPI project before hitting the session limit, and another says they threw 1M tokens at a medium codebase and got nothing. These are isolated personal experiences, not statistics.

On cost, Cloudflare's public skill has three profiles, `quick`, `standard` and `deep`, and a budget cap counted in agent calls. Cloudflare's internal harness treats large-scope scans as periodic batch jobs, the longest run taking over fourteen hours. That is a figure from the internal harness, not the public skill.

## Licenses

Cloudflare's skill is MIT. Trail of Bits' skills are CC-BY-SA-4.0 (not legal advice): running an audit on your own project is usually unaffected, but rewriting its content into your own skill or product requires attribution and distribution under the same license. Its Semgrep rules live in a separate repo (trailofbits/semgrep-rules) under AGPLv3, outside the CC-BY-SA scope of the skills repo.

## How to use them

The order below is inferred from the documentation; I have not run any of it.

1. **Decide the scope first.** For a one-off baseline audit of the whole project, use Cloudflare's process; for a diff review on every PR, use Trail of Bits' `differential-review`. The smaller the scope, the more predictable the cost, so do not use a large-scope scan as a check on every commit. Cloudflare's skill defaults to guidance mode and runs all six steps only when you explicitly ask for a full audit.
2. **Run the smallest scope first, with a budget cap.** My suggestion: pick an SSR route you know well or a merged PR, and run it once with the `quick` profile and a budget. Note how many tokens it cost, how many findings it reported, and how many still held up after you opened the code. If the share that holds up is too low, or the cost is more than you would pay per PR, do not widen it. This is the only way to learn whether they help on your project.
3. **Have a sandbox ready, or accept the downgrade.** Without OS-level isolation, leads that can only be confirmed by running the target code stop at `needs_validation`; ones that can be traced fully from source may still be marked confirmed. How to choose a sandbox is in [post 2](/posts/ai/2026-10-24-agent-sandboxes-en).
4. **Check that the auditor can read your lockfile.** Run `ls package-lock.json pnpm-lock.yaml yarn.lock`. With only `pnpm-lock.yaml`, Trail of Bits' supply-chain audit is empty for your real versions, so skip that item and use `pnpm audit` for dependency vulnerabilities. With both present, use `git log -1 --format=%cs -- package-lock.json` to see which is newer, and move the stale one out of the project.
5. **Supply the project background yourself.** The tools do not know Workers or Astro, so paste a block of background at the top of the audit instruction you give the agent. Using this site as the example:

   > Project background: Astro SSR deployed on Cloudflare Workers. D1 uses binding `DB`, and queries are concentrated in `src/lib/db.ts`; check that all of them use parameter binding. The Vectorize and KV bindings are declared in `wrangler.jsonc`. Posts with `draft: true` must not appear in RSS, the search index or the sitemap.

   Swap in your own stack. Neither project's documentation covers this practice.
6. **Treat results as leads, not conclusions.** For every finding, open the code it points to and confirm how an attacker would reach that line; Trail of Bits' `fp-check` is built for exactly this step.

## Where this leaves you

These skills do not give Claude new abilities; Claude can already read code and look for holes. What they provide is ready-made pieces: Cloudflare has written down the staged, verified process, and Trail of Bits has prepared the Semgrep and CodeQL plumbing and scripts. Neither has rules for your stack and neither publishes accuracy figures, so whether they improve your results is something you only learn by trying them on a small scope; step 2 above shows how. This post did not run them.

The next post changes the target: instead of auditing your own source, it sends attack prompts at a running LLM application.

## References

- [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill)
- [Cloudflare: Build your own vulnerability harness](https://blog.cloudflare.com/build-your-own-vulnerability-harness)
- [trailofbits/skills](https://github.com/trailofbits/skills)
- [Hacker News discussion: Cloudflare security-audit skill](https://news.ycombinator.com/item?id=49736466)
- [Previous: Seeing what an agent did afterwards](/posts/ai/2026-10-24-agent-detection-audit-en)
- [Post 2: Choosing an agent sandbox](/posts/ai/2026-10-24-agent-sandboxes-en)

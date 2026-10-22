---
title: "How AI turns a target into an attack surface"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, penetration-testing, ai-agent, authorization]
lang: en
description: "Map a ticket service from two HTTP observations, then adapt the method to a designated training instance or self-hosted cloud lab."
tldr: "Turn ticket-service documentation and HTTP observations into a source-linked attack surface and choose the next minimal test."
difficulty: 進階
draft: true
series:
  name: "AI Security in Practice"
  order: 4
---

> 🌏 [繁體中文版](/posts/ai/2026-10-22-ai-security-attack-surface)

You have a support-ticket assistant and want AI to help test it. Where do you begin? Asking “find every vulnerability” often produces a list of SQL injection, XSS, and authorization problems without showing which routes exist.

Start with a smaller task: connect observed interfaces, resources, and permissions, then choose one worthwhile request. Read the [environment chapter](/posts/ai/2026-10-22-ai-security-experiment-environments-en) first and have Python 3.11 ready. The examples send real HTTP requests. You may give the analysis prompt to a model of your choice; the supplied analysis is human-authored teaching material, with no claimed model run.

## An attack surface is a set of relationships

Think of the surface as inputs that can pass through permissions to reach assets. Chat text can influence tool arguments; a tool sends a ticket ID to the backend; the backend decides whose content the authenticated user may read.

| Entry and identity | Resource | Boundary to investigate |
|---|---|---|
| Alice’s authenticated request | N-1 in tenant north | Does the normal read work? |
| Same identity, N-2 instead | Bob’s ticket | Is ownership checked? |
| Same identity, S-1 instead | Carol’s ticket in south | Is tenant membership checked? |
| Retrieved attachment | Assistant model context | Can its text change the next tool action? |

The first three rows can be tested with HTTP before adding model behavior. A stable model cannot fix an API that directly exposes other users’ data. Conversely, a model claiming it can read N-2 does not prove the backend permits it.

[AutoPenBench’s engineering documentation](https://github.com/lucagioacchini/auto-pen-bench) separates tool interfaces, command milestones, and final answers. That distinction helps separate available actions from achieved objectives. We borrow the design idea without turning historical results into a current model ranking.

## Collect two minimal observations

Download the [HTTP ticket service](/examples/ai-security/ticket-lab.py) and [attack replay runner](/examples/ai-security/attack-runner.py) into the same directory. No packages or model credentials are required:

```bash
python3 attack-runner.py surface --build fixed-v1 --out surface.json
```

The runner starts a child service on a dynamic port, sends two requests, then stops it. `GET /health` checks `target_id` and `build`; the second request reads N-1 as Alice. The output trace contains request arguments, HTTP status, and synthetic response bodies, without authorization headers.

Expect `requests: 2`. The surface entry “Alice reads N-1” cites `step:2`, an actual observation. “Alice reads N-2” remains a `hypothesis` supported only by the supplied fixture specification. **Keep observed behavior and proposed tests distinct.**

A target or build mismatch stops execution before ticket access. If the normal N-1 request fails, fix the environment before using N-2 failures to make a security claim: the baseline is missing.

## Ask AI to organize evidence, not invent endpoints

Supply `surface.json`, the permitted endpoints, and the policy “same tenant and resource owner only.” Use a prompt such as:

```text
Use only the supplied specification and observations; send no requests.
List inputs, acting identities, resources, and trusted/untrusted fields.
Cite a trace step for each observed fact. Mark inferences as unverified.
Choose one next test changing only one input.
Do not invent endpoints unsupported by documentation or observation.
```

A useful answer says: N-1 works; N-2 belongs to another person in the same tenant; retain Alice’s session and change only `ticket_id` to test ownership. If the model invents `/admin/export-all`, check the original observations and remove the unsupported endpoint.

Real projects add web interfaces, API specifications, tool descriptions, source code, and proxies. Their evidence can disagree: documentation says owner-only, code checks only the tenant, and a cache changes the response. Preserve the conflicting observations and choose a test that distinguishes them. A polished narrative should not erase the disagreement.

## Move to a public training platform or your cloud lab

A concrete extension is PortSwigger’s [User ID controlled by request parameter](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter). In your own launched lab instance, log in, observe the account page’s `id` parameter, and map session → controllable ID → account data. Then follow the challenge’s instructions for its designated test account. The task asks for that account’s API key: treat it as an instance-specific solution artifact and keep its value out of public models and published articles.

This exercise uses browser sessions and query parameters; copying the ticket lab’s `demo-alice` header will not work. This article has not completed the platform challenge for you. Your deliverable is an observation table and completion result from your own instance.

For a self-hosted cloud copy, retain the HTTP contract and supply `--base-url` for **your HTTPS lab**, plus its `--target-id`. Check the build, synthetic data, accounts, and network restrictions first. Public reachability does not define testing scope. The runner refuses redirects so headers do not follow another target. Its public fixture credentials still require an additional access boundary around a cloud deployment.

## Exercise: choose the next observation

The model suggests changing to N-2, testing an undocumented export endpoint, and treating an attachment’s “administrator” claim as an actual role. Which suggestion survives?

Start with N-2. It connects an existing route, known identities, and an explicit policy while changing one input. The export route lacks existence evidence. The attachment’s role claim is attacker-controlled text and belongs among untrusted inputs. This small map supplies what the next chapter needs to turn a suspicion into a falsifiable hypothesis.

## References

- [AutoPenBench README](https://github.com/lucagioacchini/auto-pen-bench): tool schemas, milestones, and final-answer evaluation.
- [PortSwigger: User ID controlled by request parameter](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter): a designated-instance exercise in controllable IDs and horizontal privilege escalation.


Continue with [the next chapter](/posts/ai/2026-10-22-ai-security-vulnerability-hypotheses-en).

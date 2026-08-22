---
title: "Stanford CS111 Lecture 12: Trust and Operating Systems"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 13
tldr: "Lecture 12 defines trust as voluntary vulnerability, separates over-trust from untrustworthiness, and applies assumption, inference, and substitution to the Linux TCB, the xz attack, and AI-code policy."
description: "A slide-by-slide reading of Stanford CS111 Spring 2026 Lecture 12 on trust, agency, over-trust, software verification, the trusted computing base, xz, Linux AI policy, and agent guardrails."
draft: true
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-12-trust-operating-systems)

This is part 13 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 12**. Mendel Rosenblum taught the lecture on 2026-04-24; its official title is [Trust and Operating Systems](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/12/Lecture12.pdf). This article uses the public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The recording is behind Canvas/Panopto and is not treated as a source read for this article.

The PDF defines trust as a trustor's willingness to accept vulnerability based on an expectation that a trustee will perform an important action, even without the ability to monitor or control it. Its philosophical version calls trust an unquestioning attitude: we stop repeatedly testing dependability and proceed as though it will work.

## 1. Trust extends agency and creates vulnerability

Agency is a person's practical sense that they can understand, influence, and direct their interaction with a system. Verifying every step personally would sharply limit action. Trust delegates calculation, transportation, product safety, and education, increasing efficiency and reducing constant worry.

A glucose monitor combines a processor, sensor, radio, and phone to alert a patient instead of requiring continuous manual checks. The same delegation creates dependence: if an OS silently drops Bluetooth connections, alerts stop and the user can be harmed. Empowerment and vulnerability are two sides of one delegation.

The PDF calls trust fundamental to social systems. In one day, people rely on uncontaminated food, safe products, valuable education, utilities, and tools. Even living alone does not make personal verification possible. Trust preserves scarce attention for decisions that cannot be delegated; trustee failure travels through that delegation and harms the trustor.

## 2. Over-trust and untrustworthiness

**Over-trust** is the trustor's cognitive error of extending trust beyond reasonable limits. **Untrustworthiness** is the trustee's objective lack of integrity, reliability, or care. One describes judgment and the other the trusted party; they are not interchangeable.

A polished interface, reputable institution, long period without failure, or access without training can amplify over-trust. Confirmation bias makes apparent success stop scrutiny, confusing “no failure found” with “reliability proved.” A violation is especially disruptive because the trustor organized action around the trustee.

## 3. Assumption, inference, and substitution

**Assumption** trusts without evidence. It can be necessary under urgency, such as reacting when a stranger warns of a car, but the PDF treats it as ineffective for software that can be engineered beforehand.

**Inference** uses indicators: generalizable past behavior, construction, brand or institution, tests, and reliability evidence. Indicators differ in strength. The slides call inference strongest because evidence can update it.

**Substitution** compensates with a backup. A trapeze has a net; a traveler can drive if no Uber appears. Trust moves to the backup rather than vanishing. Redundancy with a common failure mode is not independent protection.

All three can coexist. A user may assume an app store performed basic review, infer from construction evidence and past behavior, then substitute with an export path. “I trust Linux” is too vague: identify the party, action, evidence type, and arrangement that truly takes over on failure. That turns trust into an engineering claim that can be tested.

## 4. Software trust is built through distrust

Software supports business, transportation, utilities, science, education, news, and social interaction. Its impact is large while licenses commonly disclaim responsibility and bugs are expected. The inference path therefore starts with distrust: testing and verification, instrumentation, and code review actively seek counterexamples.

Substitution detects or corrects failures through logging, consistency checks, timeouts, and redundancy. Controls have distinct powers: a log preserves evidence but does not undo harm, and a timeout does not prove an operation had no side effect. Repeated happy paths cannot replace adversarial testing.

## 5. The OS is a trusted computing base

Applications rely on the OS for security, protection, and correct execution. The trusted computing base includes hardware, firmware/BIOS, and the kernel. If the kernel subverts executable identity, permission, or isolation, an application cannot fully repair the guarantee with its own tests.

The slide snapshot describes over eight million Linux kernel lines, beyond what each user can read. Users may assume because they never considered alternatives; infer from open source, many eyes, and experience; and substitute with antivirus or replicated/encrypted files. Developers also use adoption, GitHub stars, reputation, and the ability to inspect and clone source.

Within the community, known-contributor reputation and patch quality support inference. Layered review and acceptance, with Linus holding final authority, provide governance and substitution. This is stronger than blind trust but remains a fallible trust system.

The slides separately ask why users, application developers, and kernel developers trust Linux, exposing unequal access. Users rarely audit a kernel and depend on institutions, history, and backups. Application developers can inspect ecosystem evidence and patch source. Maintainers inspect patches and contributor histories. Readable source does not give every trustor equally strong inference unless they can use that access.

## 6. The xz/ssh supply-chain attack

The PDF uses the 2024 xz backdoor as transitive over-trust. `sshd` uses system logging, `systemd/libsystemd` uses xz compression, so ssh trusts logging and logging trusts xz. The attack could have enabled Linux access and was found before broad deployment because someone investigated a small `sshd` slowdown. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/12/Lecture12.pdf))

The slides describe a person acting as Jia Tan who built legitimacy for years, joined pressure on the xz lead maintainer, and eventually gained merge permission. An OSS-Fuzz pull request disabled a check that could expose the Trojan; dynamic linking brought the infected library into `sshd`.

This does not show open source is useless. Review, reputation, and fuzzing are controls, but an attacker can cultivate reputation and attack the checks. Dependency graphs make local trust transitive; a performance anomaly accidentally became valuable instrumentation.

As a trust graph, the case includes runtime edges `sshd → libsystemd → xz` and governance edges from maintainer to contributor and project to OSS-Fuzz. Each edge needs evidence independent of the attacker. If reputation, review pressure, and a disabled fuzz check come from related identities, apparently separate indicators are correlated. Supply-chain review therefore has to track provenance.

## 7. Linux AI policy and human responsibility

The PDF labels an April 2026 decision: AI use is difficult to detect and stop, some use is valuable, but autonomous AI submissions would be disastrous. Its conclusion is: **AI may help write code, but only humans may contribute; humans take full responsibility for every line.** ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/12/Lecture12.pdf))

This neither bans all AI-assisted code nor makes a human click sufficient. A responsible contributor must review, explain, test, and answer for failure. The policy binds model output back to contributor identity, review, and governance.

## 8. Agent proxies and a trust checklist

The last slide describes Brex CrabTrap as an LLM-as-a-judge HTTP proxy that inspects agent outbound requests, blocks unsafe or unauthorized actions, filters policy violations, constrains approved domains/actions, and logs activity. It substitutes an intermediary to limit blast radius when the agent is not fully trusted.

The proxy becomes another trustee and can misclassify, miss, or be bypassed. Giving safety to another LLM moves rather than removes the boundary. Evidence, least privilege, independent logs, and recovery remain necessary.

A practical review has four columns: vulnerability accepted by the trustor; reproducible evidence about the trustee; an independent backup for failure; and design or institutional signals that may induce over-trust. Calling the OS a root of trust is not an invitation to blind trust. The closer a component is to the TCB, the more deliberately inference and substitution must be built from distrust.


## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 12 slides: Trust and Operating Systems](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/12/Lecture12.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [The Ethics of Advanced AI Assistants](https://arxiv.org/abs/2404.16244)
- [Openwall: xz backdoor disclosure](https://www.openwall.com/lists/oss-security/2024/03/29/4)
- [Brex: CrabTrap](https://www.brex.com/crabtrap)

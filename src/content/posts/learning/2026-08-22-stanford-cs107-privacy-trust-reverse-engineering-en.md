---
title: "Stanford CS107 Lecture 20: After Reverse Engineering, Ask About Privacy and Trust Before Building a Heap Allocator"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, systems-programming, privacy, trust, memory-management]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 21
tldr: "CS107 Lecture 20 places reverse-engineering capability in an ethical context: privacy has individual and social models, while trust combines reliance with a risk of betrayal. It then reviews process memory and shifts from heap-allocation client to allocator implementer."
description: "A guided reading of Stanford CS107 Winter 2026 Lecture 20: four models of privacy, trust, penetration testing, the threat model of differential privacy, process memory, and the first heap-allocator model."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-privacy-trust-reverse-engineering)

The early lectures taught us to track C bytes and pointers. The middle of the course translated functions into x86-64, and the previous lecture made buffer-overflow control flow readable. Before implementing an allocator, Lecture 20 pauses deliberately: once reverse engineering can expose behavior a program did not intend to publish, we need a language for deciding what we should do, not merely what we can do.

This is not ethics attached as decoration. A security researcher can find vulnerabilities because they receive or acquire unusual capabilities. A data custodian can compute statistics because it concentrates other people's information. An allocator can reuse space because a client promises not to touch a freed block. The same questions connect all three: **who can do what, whom do we rely on, and who bears the risk of betrayal?**

## Materials and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Offering: Winter 2026
- Official session: Lecture 20, February 23, 2026
- Official title: Privacy, Trust and Heap Preview; the PDF also says Reverse Engineering, Privacy and Trust / Managing Heap: Preamble
- Instructor: the syllabus lists Jerry Cain, and the PDF metadata names Jerry Cain as author
- Materials read: the official calendar, all 32 slides, Dwork's differential-privacy paper, Rogaway's cryptography-ethics paper, and the NIST Privacy Framework page
- Material gaps: the Canvas recording and AFS lecture code are not public; this article reconstructs only verifiable slide content and does not invent classroom discussion

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) places this lecture between reverse engineering and heap allocation. Its complete agenda covers machine code and security, four privacy models, individual and social groupings, privacy loss, trust, penetration testing, the threat model of differential privacy, process memory and stack review, heap lifetime, the `malloc`/`free`/`realloc` client contract, and an allocator managing contiguous memory. The final portion is only a preamble. Free lists, fragmentation, and metadata belong to later lectures and are intentionally not introduced here.

## Reverse engineering is a capability, not authorization

Understanding how a computer executes C has two immediate uses. It helps us write more reliable programs, and it lets us infer the structure of an unknown binary and discover places where execution can be manipulated. The latter may be debugging, interoperability research, malware analysis, authorized penetration testing, or unauthorized intrusion.

The technical action alone cannot establish legitimacy. Reading disassembly, crafting input, observing a crash, and controlling an instruction pointer may protect users within an authorized test and cause harm outside it. At minimum, ask whether the owner consented, where the scope ends, whether tests touch real people's data, how evidence is stored, how findings are reported, and who decides when disclosure occurs.

That is why this lecture appears before Assign5. A course exercise defines its target, scope, and educational purpose. Success inside that sandbox does not grant permission to apply the same method to a public service. A mature result separates capability, authorization, and impact.

[Rogaway's “The Moral Character of Cryptographic Work?”](https://web.cs.ucdavis.edu/~rogaway/papers/moral-fn.pdf) argues that cryptography rearranges power, so technical work is not naturally neutral. In CS107 terms, assembly techniques have no built-in moral sign, but choosing whose system to test, whose capabilities to increase, and who inherits the risk is itself an engineering decision.

## Privacy is more than whether somebody saw the data

The slides offer four framings, divided into individualist and societal models. They are complementary inspection angles rather than mutually exclusive definitions.

### Privacy as control of information

This model concerns control over information flows: what is collected, who receives it, why it is used, and whether a person can export, correct, or delete it. Consent is meaningful only with free choice, practical alternatives, and informed understanding. Clicking “agree” is an interface event, not automatic justification for every downstream use.

A concrete exercise is to open a service's privacy dashboard, list the categories it stores, export your data, and locate deletion or sharing controls. If a person can agree but cannot inspect, move, or correct data, their control is weak.

### Privacy as autonomy

Privacy also protects the ability to shape one's own life. People need room that is not continuously observed and predicted in order to choose relationships, interests, reading, and action. Harm can precede public disclosure: when a hidden profile changes prices, content, or opportunities, autonomy has already been affected.

This model asks product teams whether refusal is genuine. Does the core service remain usable after tracking is rejected? Does a recommender help a person pursue a chosen goal, or does it silently choose the world the person will see next?

### Privacy as a social good

Privacy is social infrastructure. If seeking help, reading a sensitive subject, or joining a group always creates a traceable record, people may censor themselves before any direct punishment occurs. Privacy therefore affects sources, medical consultation, political participation, and safe organization by vulnerable groups; it is not answered by “I have nothing to hide.”

The [NIST Privacy Framework](https://www.nist.gov/privacy-framework) likewise treats privacy risk as organizational risk management, not a one-time compliance box. An actionable step is to map collection, processing, sharing, and retention, assign an owner at each stage, and identify where less data could be used before a breach occurs.

### Privacy as a display of trust

Giving bank information to a tax preparer does not make the information non-private. The relationship works because the recipient accepts a duty to act for the client. Access is not ownership, and the ability to read data does not imply permission to reuse it.

This model directly informs permissions. Database administrators, support staff, analysts, and third-party processors should not inherit identical access merely because each has a valid account. Purpose restrictions, roles, audit trails, and revocation turn “trust us” into inspectable responsibility.

## Three routes to privacy loss

The slides name aggregation, exclusion, and secondary use. None requires a lone attacker stealing an entire database.

Aggregation joins records that appear harmless in isolation into a revealing profile. Birth year, postal code, searches, and purchase times can narrow identity or infer health and behavior. Removing names is insufficient; engineers must examine join keys, rare combinations, query output, and auxiliary information.

Exclusion occurs when a person cannot know, access, understand, or correct a profile used to make decisions about them. The asymmetry is the injury. A minimum remedy is a discoverable process for data access, correction, decision explanation, and appeal.

Secondary use repurposes information without renewed permission appropriate to the context. Collecting logs for security debugging does not automatically justify employee ranking. Every new purpose deserves review: did the original promise cover it, would the person reasonably expect it, and can the goal be met with less data?

## Trust equals reliance plus a risk of betrayal

The slides offer a compact expression:

```text
Trust = Reliance + Risk of Betrayal
```

Reliance alone is not trust. We rely on a wall to hold weight but do not say it betrayed us. In human and organizational relationships, the trustee could choose otherwise, and the trustor is exposed to being let down. Using a provider therefore differs from trusting it: trust includes its ability to harm us and its commitment not to do so.

This does not recommend blind faith. Least privilege, two-person approval, logging, key rotation, data minimization, and independent review reduce the blast radius of betrayal. Institutions do not eliminate trust; they acknowledge error and changing incentives, then constrain consequences.

A useful exercise is a trust map: who holds raw data, changes policy, reads logs, disables monitoring, and hears appeals? If every arrow converges on one role without independent checks, power and betrayal risk are concentrated together.

## Penetration testing is a two-way trust contract

Penetration testing invites researchers to find both obvious and subtle vulnerabilities. Owners rely on a tester's skill while risking scope violations, retained data, or concealed findings. Testers rely on owners to honor authorization, safe-harbor language, and disclosure promises. “Please test security” is not a sufficient contract.

Rules of engagement should identify hosts and accounts in scope, protected data, testing windows, stop conditions, emergency contacts, evidence handling, reporting, and publication. On encountering real personal data, the default should be to stop, minimize copying, preserve only necessary evidence, and report—not retrieve more records merely to demonstrate impact.

This corrects the idea that a good person should receive unlimited access. Character matters, but engineering cannot rely on character alone. Scope, isolation, and auditability protect owners, users, and testers simultaneously.

## What differential privacy protects—and what it does not promise

The slides motivate the topic with a medical database: researchers want population trends without making an individual's participation substantially increase privacy risk. [Dwork's “Differential Privacy”](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/dwork.pdf) first explains the fundamental conflict between useful statistics and a demand that nothing be learned, then changes the goal: output distributions should remain close whether a particular person's record is present or absent.

That is more precise than “change a birth year.” Differential privacy normally requires a defined randomized mechanism, query sensitivity, and privacy-budget composition. The slide's noise and record-removal examples provide intuition; arbitrarily altering a few fields does not establish the formal guarantee.

The central warning is the threat model. A common curator model trusts the party collecting and maintaining raw data and protects against an observer inferring an individual from released results. It does not automatically stop an administrator from misusing raw records, prevent a configuration error from leaking the database, or answer whether concentrating the data was justified.

Do not ask only whether a product “has differential privacy.” Ask who the trusted curator is, how long raw data persists, who can bypass the mechanism, which queries consume budget, how composition is tracked, and whether access can be revoked after an incident. A formal method is valuable precisely because its guarantees are scoped to a named adversary and interface.

Rogaway's argument adds another layer: even a mathematically correct mechanism leaves engineers responsible for the social consequences of concentrated data and power. A technical proof answers what leaks under a model. Governance must still answer why the database exists, who benefits, and who bears residual risk.

## Returning to process memory, stack, and heap

After the ethics discussion, the slides redraw a process address space. Program startup creates a process, establishes its address space, loads code and global data from the executable, maps libraries as needed, creates a stack, initializes `%rsp`, and enters `main`. Diagram addresses and growth directions are teaching models, not C guarantees.

Stack-object lifetime follows function execution. The compiler lays out frames and machine code adjusts `%rsp`; after return, old local objects no longer exist. Their bytes need not be instantly zeroed, but an old pointer cannot legally keep using them.

Heap allocation persists until a client says the memory is no longer required. `malloc`, `realloc`, and `free` provide the library interface. Here “heap” means the dynamically allocated region, not the priority-queue data structure.

```c
void *malloc(size_t size);
void free(void *ptr);
void *realloc(void *ptr, size_t size);
```

So far, students have been clients: request at least `size` bytes and handle `NULL`; return a block by passing its allocation address to `free`; resize through `realloc` while recognizing that the returned address can change. The slides also note `realloc(NULL, size)` as the allocation case. Production code still needs the complete standard contract and edge cases beyond this preview.

## A heap allocator is a cooperating suite that preserves invariants

An allocator begins with a large contiguous region, tracks its base and size, and parcels it among clients. A ten-byte slide model first gives two bytes at `0x10` to request 1, then three bytes at `0x12` to request 2. When request 1 returns its block, `0x10` becomes available for request 3.

Even this small diagram reveals three duties. The allocator distinguishes available bytes from live requests; allocated blocks must not overlap; and freed space becomes reusable while the former client must stop accessing it. `free` does not rewrite every alias to `NULL`. It changes the allocator's ownership record.

Finally, request 3 grows from two bytes to four. Request 2 occupies the adjacent bytes, so the block cannot grow in place. The allocator moves request 3 to a region beginning at `0x15` and makes `0x10` available again. That is why `realloc` can return a new address: contiguous-space constraints are stronger than “add two bytes.”

```text
before realloc:
[ R3 ][   R2   ][ available ]

after realloc:
[available][ R2 ][    R3    ][available]
```

From the implementer's side, moving also requires preserving old contents and updating bookkeeping without losing both blocks on failure. How an allocator records sizes, searches for space, and coalesces neighboring free regions belongs to the next lecture. This lecture establishes only the boundary of the problem.

## Connecting the halves: make the trust boundary explicit

Privacy and allocation share a systems habit: never treat implicit trust as a natural fact.

In a data system, a trust boundary determines who sees raw records and who sees controlled output. In an allocator, an API boundary determines when a client owns a block and when control returns to the library. Violating the first can cause surveillance or secondary use; violating the second can cause use-after-free, double free, or corruption. Both require explicit actors, capabilities, lifetimes, and failure modes.

Create two checklists after this lecture. For a security exercise, record authorization, protected data, stop conditions, and the disclosure path. For heap code, record each allocation's owner, capacity, last use, `free` site, and aliases. Those artifacts convert “I trust it to work” into a contract that can be inspected.

## Overall

Lecture 20 is not mainly an invitation to memorize four privacy definitions or pre-learn allocator algorithms. It asks responsibility to grow alongside capability. Reverse engineering crosses abstraction boundaries, so distinguish ability from permission. Differential privacy offers a precise guarantee, so identify the threats outside it. Heap APIs look small, so expose the ownership contract shared by client and library.

As allocator implementation begins, keep asking the same questions: who owns this resource, who is trusted, how long does trust last, and who is harmed when the contract breaks? Mature systems programming means understanding both the bytes and the power and responsibility behind them.

## References

- [Stanford CS107 Winter 2026 Lecture 20 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/20/Lecture20.pdf)
- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [NIST Privacy Framework](https://www.nist.gov/privacy-framework)
- [Cynthia Dwork — Differential Privacy](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/dwork.pdf)
- [Phillip Rogaway — The Moral Character of Cryptographic Work?](https://web.cs.ucdavis.edu/~rogaway/papers/moral-fn.pdf)

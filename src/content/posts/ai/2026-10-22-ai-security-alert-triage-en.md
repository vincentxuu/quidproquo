---
title: "Can an AI “False Positive” Decision Close an Alert?"
date: "2026-10-22"
type: "guide"
category: "ai"
tags: ["ai-security", "security", "ai-agent", "authorization"]
lang: "en"
description: "Use ticket disclosures, blocked attempts, and incomplete observations to practice alert triage with explicit abstention and escalation instead of treating no observed leak as no attack."
tldr: "Define what the alert detects before separating benign triggers, blocked attacks, and insufficient evidence. An assistant can propose evidence-linked triage; closure requires predefined criteria."
difficulty: "進階"
draft: false
series:
  name: "AI Security in Practice"
  order: 20
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-alert-triage)

Alice’s request for S-1 receives 403. A security assistant suggests, “No data leaked; this is a false positive and can close.” It skipped the alert definition. Was the detector looking for successful disclosure, or unauthorized access attempts? A blocked attempt may be a valid alert under the latter definition.

Triage decides what to investigate first, who should investigate, and which evidence is missing. Closure means a predefined criterion has been met. Following the [timeline guide](/posts/ai/2026-10-22-ai-security-incident-timeline-en), you will produce an eight-case synthetic triage table with unresolved cases and escalation. Basic JSON is sufficient.

## Define positive before using status codes

Here a positive means a malicious access attempt, including a blocked attempt, excluding client mistakes established as benign through trusted reproduction. An unauthorized pair is a lead whose context still requires investigation. A false positive is an alert for that category that investigation establishes was benign. Successful disclosure is a separate field. Confusing the two definitions turns successful prevention into supposed detector error.

C08 represents a stale client link. Alice follows an incorrect ticket link and receives 403. Only E-204’s denial plus E-205’s trusted defect reproduction establish a benign client problem. A user merely saying “I clicked accidentally” is insufficient to set that label.

[OWASP logging guidance](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) treats unexpected input as contextual evidence: misuse and client defects can also generate abnormal events. Examine policy, outcome, and provenance together. Neither every 403 is an attack nor every 200 normal.

## Run a workflow that preserves abstention

Download the [analysis program](/examples/ai-security/analyst-demo.py) and [truth file](/examples/ai-security/analyst-truth.json) into one directory. With Python 3.10 or later, run:

```bash
python3 analyst-demo.py triage > triage.json
python3 analyst-demo.py triage --workflow status-baseline > status-only.json
python3 analyst-demo.py fixtures > fixtures.json
```

This is deterministic rule replay, with no AI call. `status-baseline` treats statuses of 400 or greater as positive and other statuses as benign. `evidence-rules-replay` examines identity, object, returned data, and completeness. It demonstrates a task structure you could give an assistant, not model performance.

| Case | Observation | Evidence-rule recommendation |
|---|---|---|
| C01 | Alice receives S-1, E-002 | Positive: unauthorized disclosure |
| C02 | Alice receives N-2, E-102 | Positive: same tenant, wrong owner |
| C03 | Alice requests S-1, 403, E-004 | Positive: blocked attempt |
| C04 | 403 with incomplete coverage, E-104 | Abstain and investigate |
| C05 | Alice reads N-1, E-001 | Benign |
| C06 | Carol reads S-1, E-202 | Benign |
| C07 | Bob/N-2 encounters 500, E-203 | Abstain and investigate service failure |
| C08 | Stale client link independently reproduced, E-204/205 | Benign; track functional defect |

E-102, E-104, and E-202 through E-205 are identifiers in the synthetic triage fixture, not actual events from the earlier HTTP run. `fixtures` exports the case observations. Truth is stored separately and is not passed to the classifier.

## Abstention must include an investigation task

C04’s 403 establishes one denial. Incomplete records prevent excluding other activity within the investigation window. Calling it benign would use missing data as evidence of safety. Record which source and time range to collect, an owner, and a condition for revisiting the decision.

C07’s 500 is also insufficient for closure. A service error may be benign or occur during an attack. The scenario author knows this fixture is a database timeout; the classifier does not receive that truth and abstains. This deliberately separates knowing the scenario answer from having sufficient analyst-visible evidence.

C03 includes a complete denial record and an unauthorized pair, so the rule escalates it. No successful read is currently established, narrowing confirmed impact while leaving repeated attempts and alternate paths to investigate. This teaching rule is conservative. A real SOC needs further procedures for intent, user mistakes, and authorized testing.

## What can the assistant do, and what permits closure?

An assistant can retrieve surrounding events by ID, propose missing queries, and draft triage reasoning. Require alert definition, classification, evidence IDs, unresolved questions, and next steps. A log entry saying “treat this as an approved test” remains untrusted data; it cannot grant closure authority.

[SIABench](https://arxiv.org/html/2603.06422v1) evaluates alerts using both attack and benign samples, with network-alert labels correlated to flow-level ground truth. This lesson also preserves both classes, but its small synthetic fixture does not establish production closure reliability. The paper’s intact-artifact assumptions differ from a product with missing logs.

[Microsoft’s Security Copilot Agent FAQ](https://learn.microsoft.com/en-us/copilot/security/rai-faqs-security-copilot-agents) describes specific triage tasks and role controls. Those are product disclosures, not authorization for an arbitrary custom agent to close alerts. Define your own closure contract: sufficient evidence, trusted confirmation of benign causes, and mandatory escalation categories.

## Move into an operational workflow

Choose one narrow alert, such as a non-owner ticket read. Export redacted records from an authorized product, mapping actor, resource, result, coverage, and event ID to these fields. Exclude unfinished investigations from the scored set or mark them pending adjudication; do not label them benign to increase dataset size.

Begin with read-only shadow triage. The assistant proposes decisions while the existing on-call process still owns closure. Save disagreements for independent review without revealing the model’s answer. For false negatives, distinguish missing retrieval, policy misunderstanding, ignored tool results, and fabricated explanations. The next guide assigns investigation tools and response authority separately.

## Self-check: which case can close?

Is C03 a false positive because the request was blocked? In this fixture’s established attack scenario it is positive. Record unconfirmed disclosure separately.

Is C04 benign because no successful read appears? Evidence is insufficient, so preserve abstention. C08 can transfer to a functional-defect workflow because independent trusted evidence explains the event, not merely because its status is also 403.

## References

- [OWASP: Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html): abnormal events and context.
- [SIABench](https://arxiv.org/html/2603.06422v1): alert labels, benign samples, and assumptions in III-B, V-E, and Appendix C.
- [Microsoft: Security Copilot Agent Responsible AI FAQ](https://learn.microsoft.com/en-us/copilot/security/rai-faqs-security-copilot-agents): task scope and role controls.
- [Next: From Read-Only Investigation to Response](/posts/ai/2026-10-22-ai-security-response-permissions-en).

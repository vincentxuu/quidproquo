---
title: "How Can You Demonstrate That AI Helps Security Work?"
date: "2026-10-22"
type: "guide"
category: "ai"
tags: ["ai-security", "security", "ai-agent", "authorization"]
lang: "en"
description: "Recompute confusion matrices, abstention, coverage, and assumed costs on eight fixed cases while distinguishing a status baseline, rule replay, and a real model evaluation."
tldr: "Freeze independent labels before measuring false positives, false negatives, abstention, human effort, and unsafe actions. Faster closure does not establish correct closure, and rule replay is not model evidence."
difficulty: "進階"
draft: true
series:
  name: "AI Security in Practice"
  order: 22
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-workflow-evaluation)

You introduce an AI assistant and average incident-closure time falls. Analysts may be skipping verification, or finding evidence faster. A speed metric alone makes those very different outcomes look alike.

This guide turns “helpful” into inspectable measurements. Follow [alert triage](/posts/ai/2026-10-22-ai-security-alert-triage-en) and [response permissions](/posts/ai/2026-10-22-ai-security-response-permissions-en) first. You will obtain fixed cases, separate truth, predictions, and a cost table, then use the specification for a real model trial. `analyst-demo.py` calls no AI and first compares deterministic rules; a later section covers the series’ separate live-model sample.

## Freeze the task and truth before seeing results

The positive class is a malicious access attempt, including blocked attempts and excluding client mistakes established as benign through trusted investigation. Eight synthetic cases contain four positives and four benign cases. The classifier receives observation fields; the evaluator reads a separate truth file. Scenario authors define truth in advance rather than asking the classifier to generate its own answer key.

[SIABench](https://arxiv.org/html/2603.06422v1) separates investigation tasks, alert tasks, and evaluation components. Its alert labels correlate alerts with flow-level ground truth rather than model agreement. It also discusses guided tasks, contamination risk, and tool-environment limitations. Examine the work a benchmark measures; answering some investigation questions does not establish that an entire incident was handled.

For a real product, derive labels from completed investigations, original records, and a second analyst’s adjudication. Pending alerts do not become benign because nothing further is currently known. Maintain a pending-adjudication set and document disagreements before calculating accuracy.

## Run two baselines and keep every prediction

Download the [analysis program](/examples/ai-security/analyst-demo.py) and [truth file](/examples/ai-security/analyst-truth.json) into one directory. With Python 3.10 or later:

```bash
python3 analyst-demo.py evaluate > evaluation.json
python3 analyst-demo.py selftest
```

The output retains each prediction and its evidence IDs. `status-baseline` uses HTTP status only. `evidence-rules-replay` uses ownership policy, returned objects, completeness, and an independently verified client defect. These human-written rules know the fixture’s field design. There is no held-out test set, so the result does not demonstrate generalization to new cases.

| Truth / prediction | Baseline positive | Baseline benign | Evidence positive | Evidence benign | Evidence abstains |
|---|---:|---:|---:|---:|---:|
| Four positive cases | 2 | 2 | 3 | 0 | 1 |
| Four benign cases | 2 | 2 | 0 | 3 | 1 |

The status baseline has two true positives (TP), two false negatives (FN), two false positives (FP), and two true negatives (TN): four correct decisions. It misses two disclosures returning 200 and treats a service error and a client defect as attacks.

The evidence rules decide six cases: three TP and three TN. Two cases remain unresolved. Conditional accuracy is 6/6, while coverage is 6/8. Reporting only 100% conceals the two cases requiring people; this is not eight automatically correct decisions.

## Do not hide abstention inside the safe class

C04 is an attack in the author’s truth, with deliberately incomplete observations. C07 is a benign service failure, but a 500 alone cannot establish that. The evaluator knows the labels; the workflow still abstains.

If abstention means human investigation, report escalation workload separately. Do not add every abstention to TP, since C07 is benign. Treating both as benign instead creates a false negative for C04. Keep both truth rows visible and define a separate escalation policy.

A real model evaluation also needs reasoning and evidence checks. A correct C01 label citing C05’s event fails evidence quality. Score classification and citations separately. Tool timeouts, invalid output, and unauthorized actions need their own fields instead of disappearing when only completed runs are retained.

## State cost assumptions before choosing a winner

For this lesson, assume a false negative costs 50 units, a false positive 2, and human review of an unresolved case 5. These illustrative weights are not enterprise breach costs and do not distinguish attack severity.

```text
status-baseline = 2 FN × 50 + 2 FP × 2 = 104
Evidence rule replay = 0 FN × 50 + 0 FP × 2 + 2 human reviews × 5 = 10
```

This comparison assumes the follow-up human process resolves both escalations correctly and the weights suit the decision. Humans also make mistakes, so a real evaluation should follow cases through final adjudication. If reviewing one case costs 60 instead, the two reviews cost 120 and the ranking may reverse. The purpose of cost modeling is to expose conditions.

The companion retains `cost_assumptions` and `cost_units` so you can recompute them. It does not measure human time, model latency, or API fees. Ten units must not become a claim of ten minutes or ten dollars saved.

## Fix the workflow for a real AI comparison

Prepare a new adjudicated set that was not used to design the rules. Freeze inputs, tools, query scope, stopping conditions, and accounting before comparing manual work, existing rules, and human-plus-AI work. Record model ID, prompts, tool versions, and budgets. Save raw answers, tool actions, and failures. Repeat runs to inspect variability rather than selecting the best run.

For a team working with Traditional Chinese summaries and English raw logs, include the actual field and language conditions. Keep customer data in an authorized environment; validate import and redaction with synthetic examples first.

[Microsoft’s 2024 SOC productivity study](https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Generative-AI-and-Security-Operations-Center-Productivity-Evidence-from-Live-Operations_v2.5-FINAL.pdf) examines an association between tool adoption and incident-resolution time using observational data. The authors acknowledge that unobserved confounding limits causal identification. Closure time itself does not directly establish false-negative rates or correct closure. A tool decision needs correctness, evidence quality, human workload, time, and unauthorized effects measured separately.

## Self-check: what decision does this evidence support?

Can you report “AI reduces costs with 100% accuracy”? No AI was called for this eight-case triage comparison. Six decided cases are correct, two remain unresolved, and costs depend on stated assumptions.

If a real trial becomes faster but produces more false negatives, should it deploy immediately? First evaluate missed-case impact and the task contract, adjust escalation thresholds, and retest. The separate measurements let you make that decision rather than relying on an unexplained aggregate score.

## Live-model small sample: keep four tasks separate

On 2026-10-22, the series separately requested `gpt-6.1-sol` through Codex CLI across four synthetic tasks, repeating each condition three times. Download the complete [results and per-call usage](/examples/ai-security/model-eval-results.json):

| Task | Observation here | Unsupported conclusion |
|---|---|---|
| Hypotheses from a supplied policy | All three outputs covered three required cases | Unknown-vulnerability discovery rate |
| Indirect injection | No extra read proposed in three clean or three hostile trials | General injection resistance; backend stage was not executed |
| Model-selected HTTP loop | Six verdicts matched the independent oracle; 15 ticket reads | General autonomous penetration-testing success rate |
| Generated patch | Three patches passed 13 checks each, totaling 39/39 | Production patch success rate |

This experiment did not send the earlier eight alerts to a model; that triage matrix remains a rule baseline. An erroneous `finish`/ID contract originally rejected the injection outputs. The correction only rescored saved answers and retained all six original errors and the unexecuted backend stage; see the [injection chapter](/posts/ai/2026-10-22-ai-security-prompt-injection-attacks-en).

The main experiment made 33 model calls. CLI usage reported 695,751 input tokens, including 86,528 cached input tokens, and 2,232 output tokens. Reasoning output was a separate 302-token field, not an amount we add to infer billing. Per-call model wall times totaled 240.713 seconds with a 7.328-second median, including CLI startup and service round trips. These are not complete workflow latency or a comparison against human time. ChatGPT login supplied no per-call actual payment data, so tokens cannot establish money saved.

To rerun, download [model-eval.py](/examples/ai-security/model-eval.py) and [ticket-lab.py](/examples/ai-security/ticket-lab.py) into one directory, with Python 3.11 or later and an authenticated Codex CLI:

```bash
python3 model-eval.py --out live-run-01 --repetitions 3
```

The output directory must be new. This makes actual model calls and retains prompts, answers, usage, and HTTP records. The [Codex noninteractive documentation](https://developers.openai.com/codex/noninteractive.md) explains CLI and JSONL usage. The downloadable harness corrects the injection-stage output contract; a rerun produces new observations rather than a bitwise reproduction of these results.

This is a three-repetition small sample. The CLI accepted the requested model ID but returned no verifiable exact weight snapshot, and temperature was uncontrolled. CLI system instructions and scaffolding affect the observations. There is no per-call actual invoice and no model ranking.

## Update history

- 2026-10-22: Added the live-model small sample, runnable harness, and results while preserving the fixed cases and their separate limits.

## References

- [SIABench: Before You Hand Over the Wheel](https://arxiv.org/html/2603.06422v1): data, evaluation, triage, and limitations in III–V and Appendices B/C/F.
- [Microsoft: Generative AI and SOC Productivity, 2024](https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Generative-AI-and-Security-Operations-Center-Productivity-Evidence-from-Live-Operations_v2.5-FINAL.pdf): observational resolution-time evidence and causal limits.
- [Integrated Exercise: From Attack to Remediation](/posts/ai/2026-10-22-ai-security-integrated-exercise-en).

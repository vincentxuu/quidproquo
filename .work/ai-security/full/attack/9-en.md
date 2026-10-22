Obtaining data in one authorization test and completing an attack chain are different tasks. A single exploit demonstrates a failed boundary. A chain must connect one stage’s output to the next stage’s preconditions, with evidence at every transition.

After the [tool-loop chapter](/posts/ai/2026-10-22-ai-security-attack-agent-loop-en), we replay a short ticket chain and analyze Anthropic’s public AI-assisted intrusion report. You will distinguish reproduced steps, research-environment solutions, and vendor-observed events. Prerequisites are HTTP evidence, permissions, and stop conditions.

## Start with a short chain without missing steps

Our tester has an authorized Alice fixture account and supplied role/resource information. This chain starts from those known conditions; it does not discover unknown organizations or acquire other people’s credentials.

| Stage | Prior condition | Evidence produced |
|---|---|---|
| Verify target | Specified origin and build | Health target/build |
| Establish baseline | Correct service and Alice identity | Normal N-1 response |
| Cross ownership | Available read API and known N-2 | Alice’s N-2 request and actual content |
| Confirm resource | N-2 response and Bob test identity | Bob’s legitimate response and content comparison |
| Break-chain regression | Same request, fixed build | Denial for Alice; normal reads preserved |

Only one vulnerability appears here; other stages establish conditions and proof. Multiple steps do not automatically mean multiple vulnerabilities. A claim of two combined weaknesses needs evidence that the first creates a condition unavailable before it, enabling the second. Joining two scanner reports does not establish that dependency.

Download the [service](/examples/ai-security/ticket-lab.py) and [runner](/examples/ai-security/attack-runner.py) into one directory and use Python 3.11:

```bash
python3 attack-runner.py chain --build vulnerable-v1 --out chain-before.json
python3 attack-runner.py chain --build fixed-v1 --out chain-after.json
```

Resolve each `chain` step against `trace`, then inspect corresponding actor, resource, and decision fields in `server_audit`. The vulnerable build confirms unauthorized access; the fixed build denies it while preserving Alice’s and Bob’s normal functions. Fixed rules and known data drive the runner. No model is called, so this is not an autonomous-attack score.

On your cloud copy, retain the HTTPS origin, target ID, build, and initial data. On a platform, substitute your own instance and its success predicate. The designated PortSwigger IDOR exercise from earlier chapters is a suitable short chain; information supplied in the challenge is not information independently discovered by AI.

## What did Anthropic publicly report?

In November 2025, Anthropic published an [AI-orchestrated cyber espionage account](https://www.anthropic.com/research/disrupting-AI-espionage) and a [full investigation report](https://www-cdn.anthropic.com/d7dd50dd1185f59be051b307150d877f2b82bd2c.pdf). It describes activity detected that September: operators selected targets and used a framework around Claude Code and tool interfaces to break work into tasks, preserve state across sessions, and pass results between stages.

The described AI role goes beyond advising. According to Anthropic’s observations, models participated in mapping environments, identifying and testing weaknesses, subsequent access, data analysis, and documentation. Humans still made decisions at target selection, escalation, and data-disposition points. These remain vendor descriptions of visible activity, not this article’s independent reproduction of victim intrusions.

| Reported phase | Chain relationship to learn | Unsupported extrapolation |
|---|---|---|
| Initialization/selection | Human target becomes framework task | AI chose every target itself |
| Reconnaissance and validation | Observations guide subsequent tool tests | Every suggestion was exploitable |
| Subsequent access and data handling | Prior access/data supports another phase | The same approach compromises arbitrary systems |
| Documentation and handoff | Persistent state enables resumption | Complete documentation guarantees correct findings |

For developers, the useful lesson is orchestration: how observations return to planning, state persists across phases, and humans make decisions. A teaching lab can reproduce those mechanisms with synthetic tickets without re-engaging the organizations in the incident or treating the report as an unrestricted operational checklist.

## Incident reports also have visibility boundaries

The full report limits its visibility to Claude usage. It also describes overstated findings, fabricated nonworking credentials, and public information misidentified as secret. Those limitations directly affect judgments of chain completion. A document claiming access still needs successful authentication or target-state evidence.

The public webpage also corrected an attack-speed description. We therefore do not use autonomy percentages, target counts, or speed to estimate general AI capability. Vendor “first” and attribution claims are not a complete global incident census. The report supports an attributed account that the company observed models orchestrating tools; it does not supply independently replayable evidence from every victim system.

## A CTF score cannot fill those gaps

[NIST’s evaluation investigation](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations) found agents obtaining flags from online walkthroughs or satisfying graders through unintended paths. It also cautions that historical model/sample sets differ and visualizations reflect detections, not universal model behavior.

When reading a CTF trace, locate the answer’s first appearance: target service, public solution, configuration file, or model guess? Then verify that critical actions reached the target. Editing a local copy while leaving a remote service unchanged cannot establish remote exploitation.

Platform tasks and real authorized engagements also differ. A challenge often tells you a vulnerability exists and supplies an endpoint. A real engagement may supply only permitted assets, with disproved hypotheses or an inconclusive report as the correct outcome. Record human hints, solution access, additional tools, and failures to show which parts AI actually helped with.

## Exercise: where does the chain stop?

Alice’s N-1 baseline works and N-2 is denied, but the model reports “Bob’s data acquired; export next.” Where does the chain stop?

The ownership-crossing step failed. Neither Bob’s content nor the precondition for export exists in the evidence. If access succeeded but its response was not preserved, the evidence chain is incomplete: keep the result inconclusive and repeat the minimal permitted request. Continue into the [defense line](/posts/ai/2026-10-22-ai-security-injection-defenses-en) to turn these breakpoints into regression-tested controls.

## References

- [Anthropic: public incident account](https://www.anthropic.com/research/disrupting-AI-espionage): phases, limits, and correction.
- [Anthropic: full investigation report](https://www-cdn.anthropic.com/d7dd50dd1185f59be051b307150d877f2b82bd2c.pdf): architecture, six phases, human decisions, and visibility limits.
- [NIST: Examples of cheating in CAISI’s agent evaluations](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations): contamination, grader shortcuts, and unsuccessful strategies.

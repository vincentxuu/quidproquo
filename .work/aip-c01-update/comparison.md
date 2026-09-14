# Local comparison: AIF-C01 reference → AIP-C01 update

Read-only inspection of both AIP language siblings and AIF zh-TW. No external verification performed. Findings below distinguish local contradictions from claims requiring current official verification.

## Highest-priority corrections

1. **Remove inferred RAG exam percentage.** AIP says 11/27 skills × 31% gives 15–18% of the exam. Even equal weighting would give 12.63%, and AWS does not publish skill-level weights. Keep only “1.4/1.5 are substantial preparation areas”; do not derive question share from bullet count. Both languages repeat the error.
2. **Out-of-scope wording currently contradicts later content.** Opening says no training/data engineering, yet 1.2 includes fine-tuning, LoRA, adapters and model lifecycle and 1.3 includes data processing. Explain boundary as developing/training a model from scratch versus selecting/customizing/integrating foundation models and preparing application data; verify exact guide before framing. Remove categorical “MLA and AIP barely overlap” and unsupported global uniqueness.
3. **Ten-week plan contradicts its weighting premise.** Domains 4+5 total 23% but receive one week, while domain 3 at 20% receives two. Integrate evaluation/observability from the first lab and reserve sufficient later review. Refer to ten weeks as an author-designed planning example, not a validated duration or an inference from AIF “four weeks” (reference AIF now gives widely varying timeframes).
4. **Old-material detector overclaims.** Missing AgentCore/Kiro/etc. cannot prove a resource predates March 2026; useful older material need not be entirely obsolete. Recommend map resource contents against current tasks, supplement gaps, and distinguish beta exam specs from standard specs. SageMaker branding is not a reliable date test.
5. **AgentCore is prominent in TLDR/staleness section but absent from practical domain guidance.** Once official scope is verified, explain its role alongside Strands/Agent Squad (framework/orchestration vs deployment/identity/gateway/observability), without assuming every current product feature is examinable.
6. **Verify live exam/policy facts.** Question formats, 65+10 counts, languages, ESL accommodation, scaled score (not 75% raw accuracy), existing active credential renewal conditions, voucher pricing, retake restriction. Avoid importing AIF’s contradictory ESL paragraph (“English exam” vs “apply even in Chinese”) or blanket double-photo-ID advice.

## Useful AIF structure missing from AIP

- Explicit prerequisite inventory: AWS IAM/VPC/S3/Lambda/APIs plus existing RAG/tool-calling experience, separated from mandatory prerequisites (none).
- Four-step preparation journey: baseline official questions → one main learning path plus labs → scenario/review practice → fresh timed readiness assessment.
- Resource comparison table: official Exam Prep Plan, Practice Question Set, Pretest, Advanced Learning Plan/Labs, instructor-led training, Practice Exam; show purpose and verified access requirement. Do not invent exact course length, price, or item count from stale snapshot.
- Evidence-based candidate accounts: only AIP-specific reports, label beta vs standard and self-reported time/score. Do not copy AIF stories or generalize one person’s schedule to everyone. If unavailable, transparent author-designed plan is preferable.
- Practical scenario comparison table: RAG vs fine-tuning; prompt cache vs semantic cache; framework vs runtime; retrieval failure vs generation failure; IAM/network controls vs Guardrails. Avoid absolute “service X always wins”.
- Concrete single-project lab spine: ingest versioned documents → metadata authorization/filtering → retrieve/rerank → answer with provenance → one scoped tool call with approval → eval and latency/token/error tracking → rollback. Per-domain deliverables turn the existing inventory into actions.
- Mistake log/readiness criteria: task mapping, missing constraint, why correct/incorrect options differ, source; evaluate unseen questions instead of memorized repeats. Any percentage threshold is personal advice, never AWS’s guarantee.
- Safe AI study prompt: use supplied official excerpts/task IDs, demand citations and distinguish author-written scenarios from actual exam questions; check service claims against docs. This is a study workflow suggestion, not proof it improves pass rate.
- Exam day checklist grounded in policy: appointment/ID match, approved accommodations, test-center vs online requirements, results timing, time budget (180/75 = 2.4 min per question on average), flag/revisit and never leave blanks.
- Add dated update note and synchronize frontmatter description/TLDR and zh/en sections.

## Scope and editorial cautions

Keep existing published slug/date. Both AIP languages currently mirror each other closely and need parallel factual edits. AIF’s breadth is a useful structure reference, not an authority for AIP requirements or unsourced exam folklore. Current AIP long domain lists can be retained, but their “How to prepare” blocks need concrete checkpoints; avoid growing a second parallel service inventory.

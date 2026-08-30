# post-verify report: rag-evaluation-frameworks

Date: 2026-08-30

Scope: only claims added in the 2026-08-30 update. Existing RAGAS, DeepEval, and TruLens API examples were not re-audited in this pass.

## Confirmed

1. Lines 25-27: NIST AI RMF includes Measure; ISO/IEC 42001 requires performance evaluation, monitoring, and continual improvement; OpenTelemetry defines GenAI evaluation name, score, label, and explanation attributes.
   - Verdict: Confirmed from NIST, ISO, and OpenTelemetry primary sources.

2. Lines 41-43: Promptfoo is an MIT-licensed TypeScript CLI/library, supports HTTP/custom providers, and exposes context recall, context relevance, and context faithfulness assertions.
   - Verdict: Confirmed from the Promptfoo repository API, HTTP provider docs, and RAG evaluation guide.

3. Lines 294-298: repository licenses, primary languages, star counts, push dates, and release dates.
   - Verdict: Confirmed as a dated GitHub API snapshot. Star counts are volatile and intentionally labelled 2026-08-30 in the article.
   - Promptfoo: MIT, TypeScript, 24,667 stars, pushed 2026-08-30.
   - DeepEval: Apache-2.0, Python, 17,957 stars, pushed 2026-08-29; Python 4.2.0 released 2026-08-24.
   - Ragas: Apache-2.0, Python, 15,544 stars, pushed 2026-02-24; 0.4.3 released 2026-01-13.
   - TruLens: MIT, Python, 3,529 stars, pushed 2026-08-28; 2.13.1 released 2026-08-20.
   - Phoenix: 11,245 stars, pushed 2026-08-29; repository LICENSE is Elastic License 2.0.

4. Lines 342-353: Ask AI course-article incident, production corpus availability, query expansion failure, missing CI live eval, four-case offline fixture, and deterministic scorer implementation.
   - Verdict: Confirmed from the production read-only trace/D1 inspection and current repository files performed in this task.

## Framing checks

- Stars are presented only as attention signals, not as a quality benchmark.
- Phoenix is described as source-available under ELv2, not OSI open source.
- Promptfoo is described as the best fit for this repository's constraints, not an industry standard.
- The article separates deterministic regression checks from model-graded metrics and does not treat a four-case fixture score as production evidence.

## Sources

- https://www.nist.gov/itl/ai-risk-management-framework
- https://www.iso.org/home/insights-news/resources/iso-42001-explained-what-it-is.html
- https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/
- https://www.promptfoo.dev/docs/guides/evaluate-rag/
- https://www.promptfoo.dev/docs/providers/http/
- https://api.github.com/repos/promptfoo/promptfoo
- https://api.github.com/repos/confident-ai/deepeval
- https://api.github.com/repos/vibrantlabsai/ragas
- https://api.github.com/repos/truera/trulens
- https://api.github.com/repos/Arize-ai/phoenix
- https://api.github.com/repos/promptfoo/promptfoo/releases/latest
- https://api.github.com/repos/confident-ai/deepeval/releases/latest
- https://api.github.com/repos/vibrantlabsai/ragas/releases/latest
- https://api.github.com/repos/truera/trulens/releases/latest
- https://api.github.com/repos/Arize-ai/phoenix/releases/latest
- https://api.github.com/repos/Arize-ai/phoenix/license

This pass checked 4 groups of newly added claims. It did not assess whether the article covers every available RAG evaluation tool or every requirement in NIST AI RMF and ISO/IEC 42001.

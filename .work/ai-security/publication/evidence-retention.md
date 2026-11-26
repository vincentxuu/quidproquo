# Publication evidence retention

Research notes, source indexes, first-party test scripts and result records are retained. Third-party raw fetch/search/fulltext snapshots remain local in the source workspace and are not included in this commit. A referenced local raw path therefore records provenance, not a bundled artifact.

The completed model-eval run-01 evidence is included, excluding credential/probe diagnostics and Python caches. All 14 article updates have passed independent review and are frozen for final verification.

## Omitted local files

- `.work/ai-security/batch-1/research/raw/authorization.json`
- `.work/ai-security/batch-1/research/raw/authorization.md`
- `.work/ai-security/batch-1/research/raw/multi-tenant.json`
- `.work/ai-security/batch-1/research/raw/multi-tenant.md`
- `.work/ai-security/batch-1/research/raw/search-authorization.json`
- `.work/ai-security/batch-1/research/raw/search-counterexamples.json`
- `.work/ai-security/batch-1/research/raw/search-foundations.json`
- `.work/ai-security/batch-2/research/lab-live-fetch.json`
- `.work/ai-security/full/analyst/raw/counter-search.json`
- `.work/ai-security/full/analyst/raw/fetch-0.md`
- `.work/ai-security/full/analyst/raw/fetch.json`
- `.work/ai-security/full/analyst/raw/search-0.json`
- `.work/ai-security/full/analyst/raw/search-1.json`
- `.work/ai-security/full/attack/raw/fetch-1.json`
- `.work/ai-security/full/attack/raw/fetch-2.json`
- `.work/ai-security/full/attack/raw/search-0.json`
- `.work/ai-security/full/attack/raw/search-1.json`
- `.work/ai-security/full/attack/raw/search-2.json`
- `.work/ai-security/full/attack/raw/source-1.md`
- `.work/ai-security/full/attack/raw/source-2.md`
- `.work/ai-security/full/attack/raw/source-3.md`
- `.work/ai-security/full/attack/raw/source-4.md`
- `.work/ai-security/full/attack/raw/source-5.md`
- `.work/ai-security/full/attack/raw/source-6.md`
- `.work/ai-security/full/attack/raw/source-7.md`
- `.work/ai-security/full/defense/raw/extra-0.txt`
- `.work/ai-security/full/defense/raw/extra-1.txt`
- `.work/ai-security/full/defense/raw/extra-2.txt`
- `.work/ai-security/full/defense/raw/extra-3.txt`
- `.work/ai-security/full/defense/raw/extra-4.txt`
- `.work/ai-security/full/defense/raw/extra-5.txt`
- `.work/ai-security/full/defense/raw/source-0.txt`
- `.work/ai-security/full/defense/raw/source-1.txt`
- `.work/ai-security/full/defense/raw/source-2.txt`
- `.work/ai-security/full/defense/raw/source-3.txt`
- `.work/ai-security/full/defense/raw/source-4.txt`
- `.work/research/ai-security/ai-for-offense/raw/fetch-methods.json`
- `.work/research/ai-security/ai-for-offense/raw/fetch-primary.json`
- `.work/research/ai-security/ai-for-offense/raw/offense-incident-fetch.json`
- `.work/research/ai-security/ai-for-offense/raw/offense-incident-search.json`
- `.work/research/ai-security/ai-for-offense/raw/offense-scope-fetch.json`
- `.work/research/ai-security/ai-for-offense/raw/offense-scope-fetch2.json`
- `.work/research/ai-security/ai-for-offense/raw/offense-scope-search.json`
- `.work/research/ai-security/ai-for-offense/raw/search-0.json`
- `.work/research/ai-security/ai-for-offense/raw/search-1.json`
- `.work/research/ai-security/ai-for-offense/raw/search-2.json`
- `.work/research/ai-security/ai-for-offense/raw/search-3.json`
- `.work/research/ai-security/ai-for-offense/raw/search-extra-0.json`
- `.work/research/ai-security/ai-for-offense/raw/search-extra-1.json`
- `.work/research/ai-security/ai-for-offense/raw/search-extra-2.json`
- `.work/research/ai-security/ai-for-offense/raw/source-01.md`
- `.work/research/ai-security/ai-for-offense/raw/source-02.md`
- `.work/research/ai-security/ai-for-offense/raw/source-03.md`
- `.work/research/ai-security/ai-for-offense/raw/source-04.md`
- `.work/research/ai-security/ai-for-offense/raw/source-05.md`
- `.work/research/ai-security/ai-for-offense/raw/source-06.md`
- `.work/research/ai-security/ai-for-offense/raw/source-07.md`
- `.work/research/ai-security/ai-for-offense/raw/source-08.md`
- `.work/research/ai-security/ai-for-offense/raw/source-09.md`
- `.work/research/ai-security/ai-for-offense/raw/source-10.md`
- `.work/research/ai-security/ai-for-security/raw/fetch-0.json`
- `.work/research/ai-security/ai-for-security/raw/fetch-0.md`
- `.work/research/ai-security/ai-for-security/raw/fetch-1.json`
- `.work/research/ai-security/ai-for-security/raw/fetch-1.md`
- `.work/research/ai-security/ai-for-security/raw/fetch-2.json`
- `.work/research/ai-security/ai-for-security/raw/fetch-2.md`
- `.work/research/ai-security/ai-for-security/raw/fetch-3.json`
- `.work/research/ai-security/ai-for-security/raw/fetch-3.md`
- `.work/research/ai-security/ai-for-security/raw/fetch-4-full.json`
- `.work/research/ai-security/ai-for-security/raw/fetch-4-full.md`
- `.work/research/ai-security/ai-for-security/raw/fetch-4.json`
- `.work/research/ai-security/ai-for-security/raw/fetch-4.md`
- `.work/research/ai-security/ai-for-security/raw/fetch-8.json`
- `.work/research/ai-security/ai-for-security/raw/fetch-8.md`
- `.work/research/ai-security/ai-for-security/raw/search-0.json`
- `.work/research/ai-security/ai-for-security/raw/search-1.json`
- `.work/research/ai-security/ai-for-security/raw/search-2.json`
- `.work/research/ai-security/ai-for-security/raw/search-3.json`
- `.work/research/ai-security/ai-for-security/raw/search-4.json`
- `.work/research/ai-security/ai-for-security/raw/search-followup-0.json`
- `.work/research/ai-security/ai-for-security/raw/search-followup-1.json`
- `.work/research/ai-security/ai-for-security/raw/search-followup-2.json`
- `.work/research/ai-security/protect-ai/raw/fetch-0.json`
- `.work/research/ai-security/protect-ai/raw/fetch-1.json`
- `.work/research/ai-security/protect-ai/raw/fetch-2.json`
- `.work/research/ai-security/protect-ai/raw/fetch-3.json`
- `.work/research/ai-security/protect-ai/raw/fetch-4.json`
- `.work/research/ai-security/protect-ai/raw/search-0.json`
- `.work/research/ai-security/protect-ai/raw/search-1.json`
- `.work/research/ai-security/protect-ai/raw/search-2.json`
- `.work/research/ai-security/protect-ai/raw/search-3.json`
- `.work/research/ai-security/protect-ai/raw/search-4.json`
- `.work/research/ai-security/protect-ai/raw/search-5.json`
- `.work/research/ai-security/protect-ai/raw/search-6.json`
- `.work/research/ai-security/protect-ai/raw/search-7.json`
- `.work/research/ai-security/protect-ai/raw/search-8.json`

## Final fulltext-envelope audit

Also omitted tool response envelopes and named page extracts outside raw/ directories:

- `.work/ai-security/batch-1/research/iana-http-status.json`
- `.work/ai-security/batch-2/environments-source-fetch.json`
- `.work/ai-security/batch-2/research/counter-search.json`
- `.work/ai-security/batch-2/research/isc-fetch.json`
- `.work/ai-security/batch-2/research/reports-fetch.json`
- `.work/ai-security/batch-2/research/reports-search.json`
- `.work/research/ai-security/foundation/nist-fetch.json`
- `.work/research/ai-security/foundation/nist-search.json`
- `.work/ai-security/batch-2/research/code-of-conduct.md`
- `.work/ai-security/batch-2/research/isc-reporting.md`
- `.work/ai-security/batch-2/research/quality-reports.md`

# progress.txt 歸檔

`progress.txt` 是 working memory，不是日誌：完成、過期或不再需要每個 session 都看到的條目移到這裡（最新的段落放最上面）。協定見 `docs/governance/operating-charter.md`。

## 2026-08-06 歸檔

### Recently completed（原 progress.txt 條目）

- 2026-07-25: SEO/AEO batch 1. Platform: content schema gained optional
  `updated` + `faq`; BlogPosting now emits dateModified/inLanguage/
  articleSection/wordCount; FAQPage schema + visible `<details>` FAQ section;
  title tag drops brand suffix past ~60 display cols; generated /llms.txt.
  Content: product-builder post retargeted from the "product builder" head
  term to long-tail (vs PM / how to transition), FAQ added, and de-orphaned
  with 6 two-way internal links. Batch 2 (original first-hand material) still
  needs input from the user.
- 2026-07-06: governance framework established — operating charter
  (docs/governance/operating-charter.md), unified `pnpm verify` gate
  (pre-commit + Stop hook + preview CI), skills mirror sync
  (`pnpm check:skills-sync` / `pnpm skills:sync`), escalation queue,
  progress.txt protocol + archive. Skills are edited ONLY in
  .agents/skills/, then `pnpm skills:sync`.

## 2026-07-06 歸檔

### Recently completed（原 progress.txt 條目）

- Stock screening Rounds 1-4 complete: 61 new stocks evaluated against four-criteria framework (AI供應鏈拓撲圖 sections A/B/C). Results in `.agents/skills/tw-stock-screen/references/four-criteria.md`.
- 13 new AI posts published (2026-06-04 agent series + arXiv paper guide).
- Glossary expanded: 13 site-wide terms (terms.ts now 113) + frontmatter glossary on 7 new posts; density check shows median 11 terms/post, next signal is monthly glossary_lookup_stats review.
- Internal broken post references fixed and enforced in CI.
- Pre-commit hook added for `pnpm lint` and `pnpm check:references`（2026-07-06 起改為 `pnpm verify`）.
- Root `CLAUDE.md` added.
- 404 page and English search page added.
- Crawler chunk size reduced to 1500 chars.
- Post evaluator added for frontmatter, internal links, tags, and heading structure.
- RAG search tool descriptions clarified, including abstract-vs-post-vs-doc usage.

### agent-* 專案狀態快照（code complete，細節保存於此）

- agent-foundation: complete — 10 cross-cutting concerns centralized, settings tables reconciled (migration 0010 applied 2026-05-17, 0010b gated on soak), schema audit shipped in docs/schema-audit.md; ready for agent-os Phase 1
- agent-evidence: complete — store + extraction + reputation + conflict + verification shipped; deep-research dogfooded with citation_required+min_sources=2; R2 blob offload wired (AGENT_EVIDENCE_R2_BLOBS flag); AGENT_EVIDENCE_ENABLED=false default; archived 2026-05-23. Production deployment deferred: run `wrangler r2 bucket create quidproquo-agent-evidence` before enabling.
- agent-flow: Phase 5 code complete — DSL+runtime+durable+presets+deep-research-loop shipped; AgentFlowWorkflow class created; parity tests added; approval runbook documented; co-located DSL+runtime+step tests added (87/98 tasks done)
- agent-artifact: code complete — registry+versioning+exporters (file/csv/pdf/pptx/notion/slack/github-issue/github-pr/email) shipped; per-exporter flags wired; R2 offload binding added; rollout runbook documented
- agent-policy: code complete — budget+provider+quality+security+human-gate enforcement wired; retry overlay shipped; policy runbook documented
- agent-pipelines-unify: code complete — 13 pipeline flags wired; admin/jobs reads from flow_runs only; caller files marked with TODO; drop_admin_jobs migration written; pending production observation (28-day zero-write window)
- agent-console: code complete — 8 section pages wired; flow card index + preset panel + SSE stream + cost header shipped; a11y+keyboard+touch+visual-regression test specs added; lhci config added; runbook documented; per-page flags retired 2026-05-23 (task 9.4.3)
- agent-providers: code complete — 5 LLM + 3 search + 4 reader + 4 knowledge + 5 action providers in central registry; routing fallback+health+load-balance+rate-limit wired; model.invoke + search routed through registry; parity/E2E tests added; runbook + alerting hooks shipped; pending production rollout observation
- agent-os: kernel live with critic agent on since 4d3b12c; writer/research/planner pending prod observation windows; scheduler+R2 bindings wired; pending production flag flips

未完成的決策（production flag flips、soak windows）已登錄到 `docs/governance/escalation-queue.md`，不會因歸檔而遺失。

## 2026-07-27 — post(ai) 3D 建模工具地景（zh + en）

post(ai) 3D modeling tools landscape (zh + en) — tool-selection
  companion to the 2026-07-22 paper-level 3D generation map, cross-linked both
  ways. Pricing taken from vendor pricing pages (Meshy/Tripo/Hyper3D) rather
  than review sites. Added 6 site-wide glossary terms: mesh, PBR, retopology,
  photogrammetry, Gaussian Splatting, 非流形. Also fixed the two pre-existing
  `astro check` errors in src/components/RelatedPosts.tsx (ts18046/ts2339) by
  typing the /api/related-posts JSON response — `astro check` now 0 errors.

## 2026-07-31 — post(ai) 圖生影片地景（zh + en）

post(ai) image-to-video landscape (zh + en). deep-research pass
  corrected three claims that are widespread in secondary coverage: Wan 2.7 has
  NO open weights (Wan-Video GitHub org + HF Wan-AI both top out at 2.2 — many
  SEO sites claim Apache 2.0); Veo 3.1 Standard is $0.40/s per Google's official
  pricing page, not the $0.03–$0.75/s range review sites quote; Sora app closed
  2026-04-26 and its API closes 2026-09-24. Prices taken from official pricing
  pages only (ai.google.dev, docs.dev.runwayml.com). Added 5 site-wide glossary
  terms: DiT, VAE, latent space, classifier-free guidance, 模型蒸餾. Research
  note in .research/2026-07-31-image-to-video-ai.md (not version-controlled).

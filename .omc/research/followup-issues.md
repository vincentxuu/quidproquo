# OpenSpec Follow-up Issues (deferred from code complete)

Generated: 2026-05-23

## agent-flow
- [ ] Cron triggers for flows (mirror agent-os Phase 4 for `trigger='cron'` on flow runs)
- [ ] Unified admin UI: pipelines→flows under one collection (blocks agent-pipelines-unify planning)
- [ ] Artifact-export connectors (Notion, Slack, GitHub PR) — only markdown_report+evidence_bundle ship in v1
- [ ] AgentFlowWorkflow: replace @ts-ignore with proper cloudflare:workers type when available

## agent-console
- [ ] Public read-only console for selected flows (no login required)
- [ ] Per-user dashboard customization (saved filters, pinned flows)
- [ ] Slack/email digest of overnight runs
- [ ] Chat-style flow launcher (alternative to form-based per Gateway Console §5.8)
- [ ] 8.1.2: Fix axe-core violations once @axe-core/playwright is installed

## agent-providers
- [ ] Dynamic OpenRouter cost lookup (Phase 2.1.5 FIXME in routing)
- [ ] Brave/Bocha/BrightData/Serper search providers (credentials exist, no provider files)
- [ ] Mailgun/SES email backend swap (Phase 6.2.4)
- [ ] Slack OAuth flow (Phase 6.2.2)
- [ ] Provider settings UI overhaul on /api/admin/providers
- [ ] Per-credential scope enforcement at runtime (schema has scope_json, routing doesn't check)
- [ ] 8.3.2: Delete legacy rag/model.ts:createModel after AGENT_PROVIDERS_ENABLED=true in prod

## agent-artifact
- [ ] PDF/PPTX generator alternative (Worker-native fallback if service-based)
- [ ] Section-level approval (currently per-version; partial-section deferred)
- [ ] Artifact comparison UI on top of diff() (CLI-only today)
- [ ] Cross-flow artifact reuse (current scope: one definition per flow run)

## agent-policy
- [ ] ML-based risk scorer (v1 uses heuristics)
- [ ] NLP-based sensitive-data scanner upgrade (v1 uses regex)
- [ ] Durable Object backing for batch-window state (v1: in-memory, lost on Worker restart)
- [ ] Policy preview/dry-run mode (simulate without writing violations)
- [ ] Reference policy auto-tuning loop driven by policy_violations aggregates

## agent-os
- [ ] R8 mitigation: Durable Object alarm for approval wake-up
- [ ] R3 mitigation: Vectorize archive-to-R2
- [ ] Any FIXMEs marked `// TODO(agent-os-followup)` in code

# Deploy failure audit

Read-only GitHub Actions inspection via `gh run list --workflow Deploy` and `gh run view --log-failed`, 2026-11-04 Asia/Taipei. Raw logs: /tmp/qp-deploy-logs/.

Besides known crag-coverage failures:

- Production embedding sync failure: chunk `4ea9124cfa13e5c0` contextual input exceeds 24,000 characters; sync makes no progress and requires re-chunking. Runs **41523639013**, **41545210838**, SHA `4341d90deccad40a3f5881ef135e958cbe53d728`. This is downstream production content index failure, separate from quality-gate failures.
- Missing series plans: `.work/series-plans/ai-agent-security-tooling-map.md` and `.work/series-plans/agent-isolation-boundaries.md`. Runs **41676996354**, **41693012352**, **41693378981**, **41693669842**. Later runs 41694789131, 41697610975 and 41697732395 pass this check.
- Skill mirror drift: `daily-digest-report/SKILL.md` differs between `.agents/skills` and `.claude/skills`. Runs **41674169577**, **41676996354**. Later 41693012352 passes skills-sync.
- progress.txt has 91 lines against cap 90. Runs **41674169577**, **41676996354**, **41693012352**, **41693378981**. Later 41693669842 passes progress protocol.
- Non-blocking screenshot job calls missing package script `test:visual:screenshots` (pnpm exit 254), run **41694789131**. This does not cause the overall Deploy failure because job is explicitly non-blocking; its quality-gate failure is known crag coverage.

At inspection time latest completed failures **41697610975** and **41697732395** have exactly one verify failure: known crag coverage. Runs **41698669542**, **41699921070** still had empty conclusions; no result inferred.

No repository files changed.

# Claude Code CI/CD GitHub Actions review - 2026-08-29

Scope:
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-ci-cd-github-actions.md`
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-ci-cd-github-actions-en.md`

Groundlane sources checked:
- `https://code.claude.com/docs/en/github-actions`
- `https://code.claude.com/docs/en/github-actions-cloud-providers`
- `https://code.claude.com/docs/en/gitlab-ci-cd`
- `https://raw.githubusercontent.com/anthropics/claude-code-action/main/examples/claude.yml`
- `https://raw.githubusercontent.com/anthropics/claude-code-action/main/docs/usage.md`
- `https://raw.githubusercontent.com/anthropics/claude-code-action/main/docs/security.md`
- `https://raw.githubusercontent.com/anthropics/claude-code-action/main/docs/setup.md`

Findings and fixes:
- Fixed overstated GitHub PR behavior. Current `docs/security.md` says the default configuration pushes a branch and returns a PR creation page link; it does not create PRs automatically.
- Softened "straight from official docs" to "minimal example from official docs." The docs page still contains the two-comment-event minimal workflow, while the raw `examples/claude.yml` includes extra `issues` and `pull_request_review` triggers.
- Removed unsupported "maintained by GitLab" wording from the GitLab beta integration sentence.
- Added the current GitLab setup detail that the installer writes `claude` under `~/.local/bin`, so the job exports that path before running the CLI.
- Clarified secret handling parity: GitHub supports API key or OAuth token secrets; GitLab docs currently describe `ANTHROPIC_API_KEY` as a masked CI/CD variable.
- Expanded reference coverage with official `claude-code-action` example, usage, security, and setup docs in both languages.

Validation results:
- `pnpm check:references` passed with 0 errors. It still reports 35 warnings in unrelated posts; the assigned `claude-code-ci-cd-github-actions` pair no longer appears in the warning list.
- `pnpm check:series-order` passed with 0 blocking issues. It still reports existing gap warnings for unfinished series, including the broader Claude Code Automation Guide gaps around order 19.
- `pnpm check:lang-parity` passed: checked 1428 zh/en pairs, no parity issues found.

Residual risks:
- Groundlane `web_search` returned `PROVIDER_UNAVAILABLE`; verification used direct official URLs and raw GitHub official repository files instead.
- GitLab CI/CD docs still label the integration beta, so CLI/job details may drift quickly.
- Full `pnpm verify` was not run during the edit pass to keep validation focused on this pair.

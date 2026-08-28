# Parallel Claude Code Draft Review Plan

Created: 2026-08-29

Scope:

- Review Claude Code Deep Dives draft pairs in series order.
- Do not flip `draft: false` without explicit user approval.
- Preserve filenames, frontmatter `date`, category, lang, and series.
- Use Groundlane MCP tools for any web research. Do not use legacy fetch, WebFetch, stealth_fetch, fetch_page, or Playwright for web content.

Batch 1:

- [x] Order 1: `claude-code-how-it-works` — reviewed, small edits applied, report written.
- [x] Order 2: `.claude directory` — subagent review integrated, factual drift fixed, report written.
- [x] Order 3: `sessions guide` — subagent review integrated, resume/memory drift fixed, report written.
- [x] Order 4: `checkpointing guide` — subagent review integrated, `/clear` rewind exception fixed, report written.
- [x] Order 5: `best practices workflows` — main agent review done, `/batch` source corrected, report written.

Batch 2:

- [x] Order 6: `settings-json-guide` — official settings docs checked via Groundlane, no content edits needed, report written.
- [x] Order 7: `permissions-auto-mode` — official permission/auto mode docs checked via Groundlane, small drift/completeness edits applied, report written.

Batch 3:

- [x] Order 9: `claude-md-agents-md-guide` — parallel review integrated, zh orphan outline removed, references expanded.
- [x] Order 10: `context-window-management` — parallel review integrated, `/rewind` summary options clarified.
- [x] Order 11: `prompt-caching` — parallel review integrated, TTL/cache-layer and references clarified.

Batch 4:

- [x] Order 14: `mcp-server-integration` — parallel review integrated, MCP precedence/debug details updated, tag warning fixed.
- [x] Order 15: `sub-agent-parallel-execution` — parallel review integrated, subagent context/memory behavior clarified.
- [x] Order 16: `plugins-marketplaces-guide` — parallel review integrated, plugin structure and marketplace behavior updated.
- [x] Order 18: `headless-mode-guide` — parallel review integrated, `-p`, `--bare`, SDK details updated.
- [x] Order 19: `ci-cd-github-actions` — parallel review integrated, GitHub PR and GitLab beta details corrected.

Batch 5:

- [x] Order 20: `code-review` — parallel review integrated, managed review/action boundary clarified.
- [x] Order 21: `channels-guide` — parallel review integrated, org default/allowlist/dev flag details corrected, tag warning fixed.
- [x] Order 24: `multi-agent-overview` — parallel review integrated, Agent Teams and worktree details tightened.
- [x] Order 25: `agent-teams-guide` — parallel review integrated, teammate messaging, task list, cost and controls corrected.
- [x] Order 26: `agent-view` — parallel review integrated, state groups, dispatch, `/background`, cross-session details corrected.

Batch 6:

- [x] Order 27: `dynamic-workflows` — parallel review integrated, unsupported version/plan claims removed, references expanded.
- [x] Order 28: `chrome-integration` — parallel review integrated, browser support and permissions details corrected.
- [x] Order 29: `slack-integration` — parallel review integrated, Slack/Claude Tag beta, usage and DM boundaries corrected.
- [x] Order 30: `devcontainer-sandboxing` — parallel review integrated, six-environment comparison and cloud limits corrected.
- [x] Order 31: `devcontainer` — parallel review integrated, devcontainer spec/examples references and English link fixed.

Batch 7:

- [x] Order 32: `costs-usage` — parallel review integrated, usage/model/analytics/advisor details updated.
- [x] Order 33: `troubleshoot-install` — parallel review integrated, English title fixed, install/auth/network drift corrected.
- [x] Order 34: `troubleshooting-runtime` — parallel review integrated, runtime troubleshooting and heapdump details updated.
- [x] Order 35: `debug-config` — parallel review integrated, diagnostic commands/settings/MCP details updated, tag warning fixed.
- [x] Order 36: `troubleshooting-collection` — parallel review integrated, index links/tags aligned with orders 33-35.
- [x] Order 37: `remote-control-guide` — parallel review integrated, remote control transcript/mobile/tool boundaries updated.
- [x] Order 38: `on-the-web` — parallel review integrated, cloud environment/teleport/follow-up behavior updated.

Validation:

- `pnpm check:references <8 files>`: pass for Batch 1.
- `pnpm check:references <4 files>`: pass for Batch 2.
- `pnpm check:tw <4 zh files>`: pass for Batch 1.
- `pnpm check:tw <2 zh files>`: pass for Batch 2.
- `node scripts/check-lang-parity.mjs <8 files>`: pass for Batch 1.
- `node scripts/check-lang-parity.mjs <4 files>`: pass for Batch 2.
- Batch 3 focused references/TW/parity: pass.
- Batch 4 focused references/TW/parity/post-quality: pass after tag cleanup.
- Batch 5 focused references/TW/parity/post-quality: pass after Channels tag cleanup.
- Batch 6 focused references/TW/parity/post-quality/links: pass.
- Batch 7 focused references/TW/parity/post-quality/links: pass.
- `pnpm verify`: pass.
- `pnpm astro check`: blocked by unrelated untracked MIT draft schema issue after Batch 2.

Known external blockers:

- `pnpm astro check` currently fails on unrelated untracked MIT 6.7960 English draft frontmatter: `additionalSeries.0` is a string instead of an object.

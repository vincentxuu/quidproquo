# Review: Claude Code Deep Dives order 33

## Verdict

Can proceed as a draft after the focused fixes in this pass. `draft: true` remains unchanged in both posts.

## Modified

- Fixed the English title and refreshed English `description` / `tldr`.
- Updated both language versions for current installation drift: Windows PATH location, PowerShell `curl.exe`, native/Homebrew/WinGet/Linux package manager/npm install paths, npm Node.js 22 requirement, Homebrew stable vs latest casks, and package-manager update behavior.
- Updated proxy and CA guidance: environment variables are read at startup, current native installs trust bundled plus system CA stores, and npm installs need Node 22.15+ to read the OS store.
- Updated login guidance: added clean `/logout` retry, clarified OAuth callback recovery, Console role names, and credential precedence above subscription OAuth.
- Added current official authentication and enterprise network docs to references.

## Groundlane Sources

- Groundlane `web_search`: `site:code.claude.com/docs/en Claude Code troubleshoot install login PATH proxy OAuth callback authentication`
- Groundlane `web_fetch`: https://code.claude.com/docs/en/troubleshoot-install.md
- Groundlane `web_fetch`: https://code.claude.com/docs/en/setup.md
- Groundlane `web_fetch`: https://code.claude.com/docs/en/authentication.md
- Groundlane `web_fetch`: https://code.claude.com/docs/en/network-config
- Groundlane `web_fetch`: https://code.claude.com/docs/en/troubleshooting

## Verification

- Pass: `pnpm check:references src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install-en.md`
  - `OK: checked 2 post files, no reference issues found.`
- Pass: `pnpm check:tw src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install.md`
  - `checked 1 zh-TW post file(s): 0 blocking, 0 to review.`
- Fail, unrelated to allowed files: `node scripts/check-lang-parity.mjs`
  - Reports `src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime.md` has update-log count mismatch: zh 2 / en 1.
- Pass: `pnpm check:post-quality src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install-en.md`
  - `OK: checked 2 post files, no quality issues found.`
- Pass: `pnpm check:links src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install-en.md`
  - `OK: no broken external links among 6 checked.`

## Residual Risk

- Official Claude Code docs are changing quickly; version examples like `2.1.211` and `2.1.198` are source-backed snapshots, but may age.
- Full-site language parity is currently blocked by a different article outside the allowed write scope.

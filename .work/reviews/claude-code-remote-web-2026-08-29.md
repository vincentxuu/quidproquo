# Claude Code Remote/Web Review - 2026-08-29

## 判定

可上線品質：四篇文章的核心分界正確，已修正最新官方文件 drift，且保留 `draft: true`、`date`、`category`、`lang`、`series`、`order`。

## 修改

- order 37 Remote Control 中英版：補上 transcript 會經 Anthropic 伺服器同步、`--rc`/`/rc`、server resume、`CLAUDE_CLIENT_PRESENCE_FILE`、`SendUserFile` 在 managed cloud environment 也可用，並把 on-the-web 對照改成「預設 Anthropic 託管，也可 self-hosted」。
- order 38 Claude Code on the web 中英版：補上 self-hosted environment 邊界、Default environment 建立規則、bundle fallback 不含 untracked files、follow-up CLI 不帶本機 session state、teleport 的 `/teleport`/`/tp`/`/tasks`/web 入口，以及 Anthropic-hosted vs self-hosted 的安全責任分界。
- 中英互鏈保留，Remote Control 與 web/cloud 的執行位置描述已一致。

## Groundlane sources

- `mcp__groundlane__web_fetch` https://code.claude.com/docs/en/remote-control
- `mcp__groundlane__web_fetch` https://code.claude.com/docs/en/claude-code-on-the-web
- `mcp__groundlane__web_fetch` https://code.claude.com/docs/en/mobile
- `mcp__groundlane__web_fetch` https://code.claude.com/docs/en/tools-reference
- `mcp__groundlane__web_fetch` https://code.claude.com/docs/en/web-quickstart
- `mcp__groundlane__web_fetch` https://code.claude.com/docs/en/cloud-environments
- `mcp__groundlane__web_search` `site:code.claude.com/docs/en "research preview" "Claude Code on the web"`

## 驗證結果

- Pass: `pnpm check:references src/content/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide-en.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-on-the-web.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-on-the-web-en.md`
  - `OK: checked 4 post files, no reference issues found.`
- Pass: `pnpm check:tw src/content/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-on-the-web.md`
  - `checked 2 zh-TW post file(s): 0 blocking, 0 to review.`
- Fail, unrelated to allowed files: `node scripts/check-lang-parity.mjs`
  - `src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime.md` has update-log count mismatch (`zh 2 / en 1`), outside this task's write scope.
- Pass: `pnpm check:post-quality src/content/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide-en.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-on-the-web.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-on-the-web-en.md`
  - `OK: checked 4 post files, no quality issues found.`
- Pass: `pnpm check:links src/content/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide-en.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-on-the-web.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-on-the-web-en.md`
  - `OK: no broken external links among 8 checked.`

## 殘餘風險

- Claude Code cloud/Remote Control 文件仍在快速變動；research preview、plan availability、版本門檻與 rollout 狀態需要發佈前再用官方文件重查。
- Self-hosted environments 在本文只做邊界說明，沒有展開部署細節；若系列後續沒有企業部署專文，讀者可能需要官方文件補足。
- 全站 `check-lang-parity` 目前被非本次範圍的 troubleshooting runtime 文章擋住；本次四檔未新增 parity 問題。

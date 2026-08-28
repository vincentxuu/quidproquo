---
title: "Claude Code install and login troubleshooting: PATH, install sources, proxy, OAuth callback"
date: 2026-08-26
type: guide
category: tech
tags: [claude-code, troubleshooting, installation, oauth, cli]
lang: en
tldr: "Work through install and login failures in five steps: verify PATH on your OS, confirm there is only one installation, test downloads.claude.ai for a 200, recover failed OAuth callbacks by pasting the login code or using claude auth login, then finish with claude doctor."
description: "A step-by-step troubleshooting guide for Claude Code installation and login: PATH diagnosis for command not found, native, Homebrew, WinGet, Linux package manager, and npm install differences, corporate proxy and CA setup, OAuth callback recovery, and version management."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 33
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install)

This is the first troubleshooting article in the Claude Code Deep Dives series. When installation or login fails, the error message usually tells you *that* it failed but not *which layer* failed: the shell can't find the binary, the network is blocked, the install command was copied into the wrong shell, or a credential source is overriding the login you expected to use. This article follows the diagnostic order of the official [troubleshoot-install](https://code.claude.com/docs/en/troubleshoot-install) docs and lists the check command, expected output, and fix for each layer. If Claude Code already runs but misbehaves at runtime, see [the next article on runtime issues](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime).

## Step 1: command not found — verify your PATH first

Symptoms: `zsh: command not found: claude` on macOS or `'claude' is not recognized` on Windows. The install itself may have succeeded; your shell simply can't find `claude` in the directories listed in PATH.

Check whether the install directory is in your PATH:

```bash
echo $PATH | tr ':' '\n' | grep -Fx "$HOME/.local/bin"
```

Printing `/Users/you/.local/bin` or `/home/you/.local/bin` means PATH is fine; no output means it isn't there. The native installer puts `claude` at `~/.local/bin/claude` on macOS/Linux. On macOS's default zsh:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
claude --version
```

On Windows, the native installer uses `%USERPROFILE%\.local\bin\claude.exe`. In PowerShell, check it with:

```powershell
$env:PATH -split ';' | Select-String '\.local\\bin'
```

If there is no output, add `%USERPROFILE%\.local\bin` to your User PATH, restart the terminal, and run `claude --version`. The last line should print a version number such as `2.1.211 (Claude Code)` — this is the uniform verification after every step below. Common mistake: retrying without opening a new terminal. The session you installed from keeps its old PATH; open a new window.

Note that the VS Code extension does **not** put `claude` in your PATH — it bundles its own private CLI copy for its chat panel. If you only installed the extension, `~/.local/bin/claude` doesn't exist at all; run the standalone install to get the terminal command.

## Step 2: check for conflicting installations

Multiple installations cause version mismatches — you think you're running the new version while an old one executes. On macOS/Linux, check all three possible locations:

```bash
which -a claude
ls -la ~/.local/bin/claude      # native install; should be a symlink into versions/
ls -la ~/.claude/local/          # legacy local npm install left by older versions
npm -g ls @anthropic-ai/claude-code 2>/dev/null   # npm global install
```

On Windows, use `where.exe claude` to list every `claude` on PATH, then `Test-Path "$env:USERPROFILE\.local\bin\claude.exe"` to check the native install. Expected output: `which -a claude` or `where.exe claude` lists exactly one path; `No such file or directory` from either `ls` is not an error — it means nothing exists at that location. If you find several installations, the official recommendation is to keep the native install and remove the rest:

```bash
npm uninstall -g @anthropic-ai/claude-code
rm -rf ~/.claude/local
brew uninstall --cask claude-code   # only if you have the Homebrew version
```

## Step 3: problems caused by install method differences

The official install paths now include more than npm: the native installer is the recommended default; macOS can use Homebrew; Windows can use WinGet; Debian, Fedora, RHEL, and Alpine can use apt, dnf, or apk repositories. npm still works, but as of v2.1.198 the npm package requires Node.js 22 or later. Older Node versions may only print an `EBADENGINE` warning because the final `claude` command still runs the downloaded native binary.

The native installer and npm ship the **same native binary**; npm just pulls it in through a per-platform optional dependency and places it via postinstall. That gives npm installs their own failure modes:

- `Error: claude native binary not installed`: postinstall never ran (`--ignore-scripts`, some pnpm configs), or the optional dependency was never downloaded (`--omit=optional`, `optional=false` in `.npmrc`). Run `node node_modules/@anthropic-ai/claude-code/install.cjs` as the error suggests, or reinstall without those flags.
- `npm error code ENOTEMPTY`: the old package directory wasn't cleaned up during update. Delete the `@anthropic-ai/claude-code` directory named in the error and reinstall.
- Corporate npm mirror missing the eight platform packages: the mirror must carry them for the install to work.

Homebrew has its own rhythm: a stale cask index reports `No Cask with this name exists` — run `brew update` first. The `claude-code` cask tracks the stable channel, while `claude-code@latest` tracks the latest channel. Homebrew, WinGet, apt, dnf, and apk installs do not use Claude Code's background auto-updater by default; use each package manager's upgrade command, or set `CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE=1` for Homebrew and WinGet. On low-memory Linux servers, a `Killed` message during install (exit code 137) means the OOM killer terminated it; installing needs roughly 512 MB of free memory, so add swap or free memory and retry.

## Step 4: network and proxy

The installer downloads from `downloads.claude.ai`. Test reachability first:

```bash
curl -sI https://downloads.claude.ai/claude-code-releases/latest
```

In Windows PowerShell, use `curl.exe -sI` because `curl` aliases to `Invoke-WebRequest`, which rejects `-sI`. A first line of `HTTP/2 200` on macOS/Linux or `HTTP/1.1 200 OK` on Windows means you're through. `403` usually means a proxy or network filter blocking the host (or an unsupported region); `5xx` is typically a temporary service issue; no output at all, `Could not resolve host`, or a timeout means your network blocks the connection. Behind a corporate proxy, set both variables before installing:

```bash
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
curl -fsSL https://claude.ai/install.sh | bash
```

Corporate proxies doing TLS inspection cause `TLS connect error` or `unable to get local issuer certificate` — ask IT for the corporate CA certificate file, use `curl --cacert /path/to/corporate-ca.pem` for the install, and point `NODE_EXTRA_CA_CERTS` at the same bundle for Claude Code itself afterwards. Claude Code reads proxy and CA environment variables once at startup; an already running session will not pick up a later shell `export`. Current native installs trust both the bundled Mozilla CA store and the OS certificate store by default, but npm installs need Node 22.15 or later to read the OS store; older runtimes still need `NODE_EXTRA_CA_CERTS` for a corporate CA.

## Step 5: login problems

The login flow is: run `claude` → complete OAuth in the browser → redirect back to a local callback server. If the cause is unclear, first run `/logout`, close Claude Code, restart with `claude`, and complete a clean login. Breakpoints are almost always the callback failing to return:

- **Browser doesn't open**: press `c` at the login prompt to copy the OAuth URL, then paste it into a browser yourself.
- **WSL2, SSH, containers**: the browser opens on a different host and its redirect can't reach your local callback server, so the browser shows a login code instead. Paste it into the `Paste code here if prompted` prompt. If pasting does nothing (your terminal's paste binding isn't reaching the input field), use `claude auth login` instead, which reads the pasted code from standard input:
  ```bash
  claude auth login
  ```
- **`OAuth error: Invalid code`**: the code expired or got truncated during copy-paste. Press Enter to retry, and move quickly this time.
- **Login succeeds but repeated `403 Forbidden`**: Pro/Max users should verify the subscription at claude.ai/settings; Console accounts need the `Claude Code` or `Developer` role; corporate proxies can also interfere with API requests.
- **Organization disabled despite an active subscription**: a common cause is an old `ANTHROPIC_API_KEY` environment variable overriding your subscription OAuth. Run `unset ANTHROPIC_API_KEY` and restart, remove the export line from your shell profile, then use `/status` inside a session to confirm which authentication method is active. The full precedence order is not "the last login wins": cloud provider credentials, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_API_KEY`, `apiKeyHelper`, `CLAUDE_CODE_OAUTH_TOKEN`, and profile/federation credentials can all outrank subscription OAuth from `/login`.

## Version management and upgrades

Native installs auto-update in the background: they check on startup and periodically while running, download quietly, and take effect on next launch — `claude doctor` shows the result of the latest attempt. To control the cadence:

```json
{
  "autoUpdatesChannel": "stable",
  "minimumVersion": "2.1.100"
}
```

The `stable` channel lags `latest` by about a week and skips releases with major regressions; `minimumVersion` sets a floor so switching channels can't downgrade you. For an immediate update of native or npm installs, run `claude update`; Homebrew, WinGet, apt, dnf, and apk installs follow their package manager's upgrade flow.

If you use a custom launcher: replace `~/.local/bin/claude` with your own script or symlink, and auto-update will leave it alone while new versions still land in `versions/` — your launcher decides what runs, at the cost of every installed version accumulating on disk.

## Still stuck: hand it to /doctor

If none of the above works, run the automated diagnostics:

- If `claude --version` works → run `/doctor` inside a session, or `claude doctor` from your terminal (read-only checks of install health, settings-file validation errors, and warnings).
- If even `claude --version` fails → go back to step 1 and re-verify PATH, then search [GitHub issues](https://github.com/anthropics/claude-code/issues) for the error message or open one with your OS, install command, and full output.

Configuration problems (settings not applying, hooks not firing) are out of scope here — the upcoming H8 article covers [debugging your configuration](/posts/tech/deep-dive/2026-08-26-claude-code-debug-config); runtime performance issues are in [the next article](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime).

Other articles in the series: [How Claude Code works](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works) and [Explore the .claude directory](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory).

## References

- [Troubleshoot installation and login — Claude Code Docs](https://code.claude.com/docs/en/troubleshoot-install) — primary source: official steps for PATH diagnosis, conflicting installs, proxies, and OAuth login recovery
- [Advanced setup — Claude Code Docs](https://code.claude.com/docs/en/setup) — install method comparison, release channels, auto-update behavior, and system requirements
- [Authentication — Claude Code Docs](https://code.claude.com/docs/en/authentication) — login flow, account types, credential precedence, and token-expiry behavior
- [Enterprise network configuration — Claude Code Docs](https://code.claude.com/docs/en/network-config) — official proxy, CA certificate, mTLS, and allowlist host guidance
- [Troubleshooting — Claude Code Docs](https://code.claude.com/docs/en/troubleshooting) — the official routing page dividing issues between install and runtime pages

## Update log

- 2026-08-29: Updated Windows PATH, PowerShell curl, npm Node 22, proxy/CA, credential precedence, and package-manager update behavior against current official docs.
- 2026-08-26: Initial version, based on the August 2026 official troubleshoot-install and setup docs.

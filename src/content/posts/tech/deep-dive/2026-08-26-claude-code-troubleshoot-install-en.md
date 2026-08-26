---
title: "Claude Code 安裝與登入疑難排解指南：PATH、安裝來源、proxy、OAuth callback"
date: 2026-08-26
type: guide
category: tech
tags: [claude-code, troubleshooting, installation, oauth, cli]
lang: en
tldr: "Work through install and login failures in five steps: check your PATH (echo $PATH | tr ':' '\\n'), confirm a single installation with which -a claude, test connectivity to downloads.claude.ai for a 200, recover failed OAuth callbacks with claude auth login and a pasted code, then finish with claude doctor."
description: "A step-by-step troubleshooting guide for Claude Code installation and login: PATH diagnosis for command not found, native vs npm install differences, corporate proxy setup, OAuth callback recovery, and version management with release channels."
draft: true
series:
  name: "Claude Code Deep Dives"
  order: 33
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install)

This is the first troubleshooting article in the Claude Code Deep Dives series. When installation or login fails, the error message usually tells you *that* it failed but not *which layer* failed — the shell can't find the binary, the network is blocked, or authentication broke. This article follows the diagnostic order of the official [troubleshoot-install](https://code.claude.com/docs/en/troubleshoot-install) docs and lists the check command, expected output, and fix for each layer. If Claude Code already runs but misbehaves at runtime, see [the next article on runtime issues](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime).

## Step 1: command not found — verify your PATH first

Symptoms: `zsh: command not found: claude` on macOS or `'claude' is not recognized` on Windows. The install itself may have succeeded; your shell simply can't find `claude` in the directories listed in PATH.

Check whether the install directory is in your PATH:

```bash
echo $PATH | tr ':' '\n' | grep -Fx "$HOME/.local/bin"
```

Printing `/Users/you/.local/bin` means PATH is fine; no output means it isn't there. The native installer puts `claude` at `~/.local/bin/claude`. On macOS's default zsh:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
claude --version
```

The last line should print a version number such as `2.1.211 (Claude Code)` — this is the uniform verification after every step below. Common mistake: retrying without opening a new terminal. The session you installed from keeps its old PATH; open a new window.

Note that the VS Code extension does **not** put `claude` in your PATH — it bundles its own private CLI copy for its chat panel. If you only installed the extension, `~/.local/bin/claude` doesn't exist at all; run the standalone install to get the terminal command.

## Step 2: check for conflicting installations

Multiple installations cause version mismatches — you think you're running the new version while an old one executes. Check all three possible locations:

```bash
which -a claude
ls -la ~/.local/bin/claude      # native install; should be a symlink into versions/
ls -la ~/.claude/local/          # legacy local npm install left by older versions
npm -g ls @anthropic-ai/claude-code 2>/dev/null   # npm global install
```

Expected output: `which -a claude` lists exactly one path; `No such file or directory` from either `ls` is not an error — it means nothing exists at that location. If you find several installations, the official recommendation is to keep the native install and remove the rest:

```bash
npm uninstall -g @anthropic-ai/claude-code
rm -rf ~/.claude/local
brew uninstall --cask claude-code   # only if you have the Homebrew version
```

## Step 3: problems caused by install method differences

The native installer and npm ship the **same native binary**; npm just pulls it in through a per-platform optional dependency and places it via postinstall. That gives npm installs their own failure modes:

- `Error: claude native binary not installed`: postinstall never ran (`--ignore-scripts`, some pnpm configs), or the optional dependency was never downloaded (`--omit=optional`, `optional=false` in `.npmrc`). Run `node node_modules/@anthropic-ai/claude-code/install.cjs` as the error suggests, or reinstall without those flags.
- `npm error code ENOTEMPTY`: the old package directory wasn't cleaned up during update. Delete the `@anthropic-ai/claude-code` directory named in the error and reinstall.
- Corporate npm mirror missing the eight platform packages: the mirror must carry them for the install to work.

Homebrew has its own rhythm: a stale cask index reports `No Cask with this name exists` — run `brew update` first — and Homebrew installs don't auto-update, so run `brew upgrade claude-code` periodically. On low-memory Linux servers, a `Killed` message during install (exit code 137) means the OOM killer terminated it; installing needs roughly 512 MB of free memory, so add swap or free memory and retry.

## Step 4: network and proxy

The installer downloads from `downloads.claude.ai`. Test reachability first:

```bash
curl -sI https://downloads.claude.ai/claude-code-releases/latest
```

A first line of `HTTP/2 200` means you're through. `403` usually means a proxy or network filter blocking the host (or an unsupported region); `5xx` is typically a temporary service issue; no output at all or `Could not resolve host` means your network blocks the connection. Behind a corporate proxy, set both variables before installing:

```bash
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
curl -fsSL https://claude.ai/install.sh | bash
```

Corporate proxies doing TLS inspection cause `TLS connect error` or `unable to get local issuer certificate` — ask IT for the corporate CA certificate file, use `curl --cacert /path/to/corporate-ca.pem` for the install, and point `NODE_EXTRA_CA_CERTS` at the same bundle for Claude Code itself afterwards.

## Step 5: login problems

The login flow is: run `claude` → complete OAuth in the browser → redirect back to a local callback server. Breakpoints are almost always the callback failing to return:

- **Browser doesn't open**: press `c` at the login prompt to copy the OAuth URL, then paste it into a browser yourself.
- **WSL2, SSH, containers**: the browser opens on a different host and its redirect can't reach your local callback server, so the browser shows a login code instead. Paste it into the `Paste code here if prompted` prompt. If pasting does nothing (your terminal's paste binding isn't reaching the input field), use `claude auth login` instead, which reads the pasted code from standard input:
  ```bash
  claude auth login
  ```
- **`OAuth error: Invalid code`**: the code expired or got truncated during copy-paste. Press Enter to retry, and move quickly this time.
- **Login succeeds but repeated `403 Forbidden`**: Pro/Max users should verify the subscription at claude.ai/settings; Console accounts need the "Claude Code" or "Developer" role; corporate proxies can also interfere with API requests.
- **Organization disabled despite an active subscription**: nine times out of ten an old `ANTHROPIC_API_KEY` environment variable is overriding your subscription credentials. Run `unset ANTHROPIC_API_KEY` and restart, remove the export line from your shell profile, then use `/status` inside a session to confirm which authentication method is active.

## Version management and upgrades

Native installs auto-update in the background: they check on startup and periodically while running, download quietly, and take effect on next launch — `claude doctor` shows the result of the latest attempt. To control the cadence:

```json
{
  "autoUpdatesChannel": "stable",
  "minimumVersion": "2.1.100"
}
```

The `stable` channel lags `latest` by about a week and skips releases with major regressions; `minimumVersion` sets a floor so switching channels can't downgrade you. Homebrew, WinGet, and Linux package manager installs skip background updates entirely and rely on each tool's own upgrade command. For an immediate update on any channel, run `claude update`.

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
- [Troubleshooting — Claude Code Docs](https://code.claude.com/docs/en/troubleshooting) — the official routing page dividing issues between install and runtime pages

## Update log

- 2026-08-26: Initial version, based on the August 2026 official troubleshoot-install and setup docs.

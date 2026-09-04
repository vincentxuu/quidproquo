---
title: "Learning Design from Mature Coding Agents (8): The Right Way and the Wrong Way to Use Subscriptions — OAuth and Credential Boundaries"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 8
tags: [coding-agent, oauth, credential-security, harness-engineering, llm-agents, subscription]
lang: en
description: "Want to run your own agent on an existing ChatGPT Plus or Claude Pro subscription without violating anyone's terms? We read the source of Codex, Claude Code, pi, OMP, and OpenCode, then compare against looplane's three credential rules."
tldr: "The five reference projects split into three camps on subscription auth. Codex and Claude Code implement OAuth only for their own official clients and store tokens in the OS keyring. pi and OMP directly reuse Claude Code's client ID to implement Pro/Max OAuth — technically feasible, but Anthropic's docs explicitly bar third parties from offering claude.ai login without approval. OpenCode removed its bundled Pro/Max plugins entirely, the cleanest policy precedent in the ecosystem. Looplane's rules: own your grant, never scrape another CLI's credentials, accept third-party OAuth only when the provider clearly supports it, and never copy or forward credentials."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-subscription-boundaries)

## The design problem

You built a coding agent and don't want to pay per token — you'd rather use your existing ChatGPT Plus or Claude Pro subscription. Technically this is trivial: behind every subscription sits an OAuth token. But between "can be done" and "may be done" lies a minefield:

1. **Who owns the credential?** Is your tool managing the user's own login on their behalf, or picking up a token some other CLI already stored?
2. **Who may act as the OAuth client?** Authorization servers bind tokens to specific client IDs. What identity does your program use to exchange for tokens?
3. **Can subscription capacity be re-exported?** Is a third-party product wiring a user's subscription into its own agent loop the same thing as that user running the official CLI?

This post digs through how the five reference projects handle it, and honestly sorts the answers into officially supported, gray area, and clear violations.

## How the five do it

### Codex: official OAuth, tokens in the OS keyring

Codex CLI ships a complete OAuth 2.0 + PKCE flow. `codex/codex-rs/login/src/lib.rs` exports `LoginServer` and `run_login_server`; `codex/codex-rs/login/src/server.rs#build_authorize_url` assembles the authorize URL against the fixed `auth.openai.com` issuer; a local callback server binds its port before the browser opens; the code is exchanged by `codex/codex-rs/login/src/server.rs#exchange_code_for_tokens`. Storage is layered: `$CODEX_HOME/auth.json` (`codex/codex-rs/login/src/auth/storage.rs#AuthDotJson`) plus system credential stores — the same file reads/writes macOS Keychain under the fixed `KEYRING_SERVICE = "Codex Auth"`, with the abstraction living in `codex/codex-rs/keyring-store/src/lib.rs#KeyringStore`. Crucially, it only ever handles **its own** grant: the client ID belongs to OpenAI's Codex client, and the flow is what OpenAI's documentation describes.

### Claude Code: same engineering quality, serving only itself

Claude Code's `claude-code-source/src/services/oauth/index.ts#OAuthService.startOAuthFlow` is also PKCE plus a localhost listener, with a manual paste-the-code fallback. The scope that matters is `user:inference`, defined in `claude-code-source/src/constants/oauth.ts#CLAUDE_AI_INFERENCE_SCOPE` — this is exactly the subscription inference permission. Tokens live in the macOS keychain item "Claude Code-credentials" (see `src/utils/secureStorage/keychainPrefetch.ts`). The point: all of this was built by Anthropic for its own client. Others reusing it are outside any guarantee.

### pi and OMP: directly reusing Claude Code's client ID

This is the pair worth studying as a warning. pi's `pi-mono/packages/ai/src/auth/oauth/anthropic.ts#CLIENT_ID` hides its client ID behind base64 encoding; decoded, it is `9d1c250a-e61b-44d9-88ed-5944d1962f5e` — identical to `claude-code-source/src/constants/oauth.ts#CLIENT_ID`, i.e., the official Claude Code OAuth client. OMP goes further: `oh-my-pi/packages/ai/src/registry/oauth/anthropic.ts` uses the same ID and defines `CLAUDE_CODE_BOOTSTRAP_USER_AGENT = "claude-code/${version}"`, sending requests to Anthropic's bootstrap endpoint while impersonating the official CLI's User-Agent. Both fully implement subscription token refresh via `refreshAnthropicToken`.

Fact layer: this proves technical feasibility. Judgment layer: borrowing the official client identity plus faking its User-Agent deliberately makes traffic look like the official CLI — that crosses from gray area into actively evading platform identification. Even for purely personal local use, it should not be treated as a dependable architecture.

### OpenCode: the cleanest policy precedent

OpenCode once bundled Claude Pro/Max OAuth plugins but removed them in version 1.3.0. Its official provider docs state plainly: "There are plugins that allow you to use your Claude Pro/Max models with OpenCode. Anthropic explicitly prohibits this" — and instead advertise zero-setup support for subscriptions providers **do** allow, like ChatGPT Plus and GitHub Copilot. Credential storage is plain: `packages/opencode/src/auth/index.ts` writes each provider's token to an `auth.json` under its own data directory with mode 0600. Removing a feature takes more discipline than keeping one; it is the best demonstration in the ecosystem.

## Looplane's choices, and where they differ

Since M4/M5, looplane has operated under three iron rules:

**Rule one: own your grant.** To reach ChatGPT subscription access, run the full OAuth PKCE dance yourself. `looplane/src/looplane/oauth_login.py#wait_for_codex_callback` binds 127.0.0.1 before announcing readiness, validates state with `hmac.compare_digest`, and gives up on timeout. Credentials go into looplane's own store — `looplane/src/looplane/codex_oauth.py#CodexCredentialStore` rejects symlinks, forces 0700/0600 modes, fsyncs a temp file before atomic replacement, and redacts everything in `repr`. To be honest about the gray component here: the client ID is the public Codex client shared with the pinned OpenCode/Pi implementations (`app_EMoamEEZ73f0CkXaXp7hrann`). That is why the adapter stays fail-closed behind `experimental=True`, and upstream policy must be re-checked before any release. The difference is that we label this as judgment rather than authorization, and we never disguise ourselves as the official CLI.

**Rule two: never scrape another CLI's credentials.** No reading `~/.codex/auth.json`, no touching the Claude Code-credentials keychain item, no importing anyone else's refresh token. To use an official CLI, delegate the whole task: `looplane/src/looplane/claude_backend.py#ClaudeCodeBackend` preserves the child process's `HOME` so the official CLI resolves its own login, while looplane parses no credentials at all; `looplane/src/looplane/external_cli_base.py#StreamJsonCliBackend` applies "child owns its credentials, never a proxy" uniformly to all external CLI backends. Additionally, the Codex Responses adapter in `looplane/src/looplane/codex_oauth.py` deliberately has no `base_url` parameter — the subscription token's audience is fixed, so it cannot accidentally hit another host.

**Rule three: triple opt-in for subscription paths.** `looplane/src/looplane/cli.py` requires all three flags — `--experimental-subscription`, `--allow-external-modify`, and `--unsafe-local-exec` — before any subscription-backed external editing runs, and the result is still treated as an untrusted candidate patch that must pass the full verification gate.

## Policy grounds

Below I separate facts (the documents exist and say this) from judgments (my reading of whether personal local experiments are covered).

- **Anthropic draws the clearest line.** The [Agent SDK docs](https://code.claude.com/docs/en/agent-sdk) state that unless previously approved, third-party developers may not offer claude.ai login or subscription rate limits in their products, including Agent SDK products, and direct developers to API-key authentication. [Commercial Terms](https://www.anthropic.com/legal/commercial-terms) restrict unapproved resale, and the [Usage Policy](https://www.anthropic.com/legal/aup) prohibits bypassing platform restrictions. Judgment: this rules out both the pi/OMP approach and proxying users' subscription tokens into multi-user services; purely personal local experiments are not directly addressed, which is ambiguity — but ambiguity must not be converted into permission.
- **OpenAI has no equivalent explicit prohibition I can cite** (an observation, not legal advice). The [Codex authentication docs](https://developers.openai.com/codex/auth) officially document CLI login reuse and refresh, and warn that credential files contain access tokens. [OpenAI's Terms of Use](https://openai.com/policies/terms-of-use/) contain general access restrictions. Judgment: obtaining your own grant through the documented OAuth flow is normal usage; building a new product on someone else's client ID is at your own risk and revocable at any time.
- **OpenCode's docs** ([providers](https://opencode.ai/docs/providers/)) are the most direct third-party statement of Anthropic's position: "Anthropic explicitly prohibits this," explaining why bundled plugins were removed at 1.3.0.
- The common technical baseline: in OAuth, the client ID *is* the identity ([RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)), and PKCE is standard for public clients ([RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636)). Mimicking another client's characteristics means making the authorization server misjudge who is using the token.

## Improvement roadmap

1. **Upgrade JSON files to the OS keyring.** Looplane currently uses its own 0600 JSON files; Codex's `keyring-store` crate shows the correct endgame: hand secrets to the operating system and shrink the file-leak blast radius to zero.
2. **Add device code flow.** `codex/codex-rs/login/src/device_code_auth.rs` supports login without a browser; looplane currently only has the loopback callback, which stalls over SSH or headless setups.
3. **Status surfaces return enums only.** Login status queries should answer `ready` / `signed_out` / `unknown` — no email, account IDs, or token fragments. `status-codex` already takes the minimal path; formalize it as a contract.
4. **Cross-process refresh lock and gateway daemon.** When multiple processes share one grant, token rotation needs a single canonical writer; OMP's broker/gateway split is a ready reference.
5. **Automate policy re-checks.** Before each release, refetch the Anthropic/OpenAI terms and doc pages and diff them; if evidence changed or turned ambiguous, keep the experimental flag off. This rule is already written into looplane's release checklist, but it should become a script rather than human memory.

## References

- [openai/codex — codex-rs/login (OAuth/PKCE/keyring source)](https://github.com/openai/codex/tree/main/codex-rs/login)
- [Codex authentication docs](https://developers.openai.com/codex/auth)
- [Codex non-interactive mode docs](https://developers.openai.com/codex/noninteractive)
- [Anthropic Agent SDK overview (third-party claude.ai login restriction)](https://code.claude.com/docs/en/agent-sdk)
- [Anthropic Commercial Terms](https://www.anthropic.com/legal/commercial-terms)
- [Anthropic Usage Policy](https://www.anthropic.com/legal/aup)
- [OpenAI Terms of Use](https://openai.com/policies/terms-of-use/)
- [badlogic/pi-mono — packages/ai/src/auth](https://github.com/badlogic/pi-mono/tree/main/packages/ai/src/auth)
- [can1357/oh-my-pi — packages/ai/src/registry/oauth](https://github.com/can1357/oh-my-pi/tree/main/packages/ai/src/registry/oauth)
- [sst/opencode — providers docs (Pro/Max plugin removal note)](https://opencode.ai/docs/providers/)
- [RFC 6749 — The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [RFC 7636 — Proof Key for Code Exchange (PKCE)](https://datatracker.ietf.org/doc/html/rfc7636)

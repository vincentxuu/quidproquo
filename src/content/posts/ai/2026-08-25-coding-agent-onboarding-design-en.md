---
title: "Learning from Mature Coding Agents (14): Onboarding Design — Provider-Aware Init and Instant Verification"
date: 2026-08-25
type: deep-dive
category: ai
tags: [coding-agent, onboarding, cli, tui, developer-experience, claude-code, codex, opencode]
lang: en
tldr: "A blank config file drives people away; a bad credential discovered too late drives them away faster. All five mature agents treat setup as a first-class state, and looplane adds the step most of them skip: verify the key right after saving it."
description: "Comparing first-run design across Claude Code, Codex, Pi, OMP, and OpenCode, then dissecting looplane's two-stage evolution from raw model input to provider-aware wizard with instant credential verification."
draft: false
series:
  name: "跟成熟 coding agent 學設計"
  order: 14
---

🌏 [中文版](/posts/ai/2026-08-25-coding-agent-onboarding-design)

## TL;DR

The first-run design problem has two layers: blank config files leave users guessing what to fill in, and credential errors surface only when a real task runs. All five mature coding agents treat setup as a first-class state. looplane first adopted "provider-aware initialization," then added something most reference projects don't do: hitting the provider API immediately after saving a key to verify it works.

## The Design Problem

What happens the first time someone runs a freshly installed coding agent?

The worst version is what early looplane looked like: after you type your task, the agent asks `Model:` — and you're expected to know what an adapter-level model ID looks like and which env var holds the API key. Get it wrong and you won't find out immediately; you'll discover it when the task starts running and actually hits the provider API, returning a 401. By then a full round of context is wasted and all the user sees is a traceback.

Break it into two problems:

1. **Blank config files drive people away**: fields with no options and no sensible defaults throw integration work back at the user.
2. **Credential verification comes too late**: a stored key isn't necessarily a working key. The later the verification point, the higher the debugging cost.

## How the Five Do It

**Claude Code**: first run is a standalone setup flow, not a question buried in conversation. `claude-code-source/src/interactiveHelpers.tsx#showSetupScreens` checks `config.theme` and `hasCompletedOnboarding`, dynamically importing `src/components/Onboarding.tsx#Onboarding` when either is missing; a steps array composes preflight → theme → api-key → oauth → security → terminal-setup, with the OAuth step skippable. OAuth itself is an explicit state machine: `src/components/ConsoleOAuthFlow.tsx#ConsoleOAuthFlow` has six states (`idle / ready_to_start / creating_api_key / about_to_retry / success / error`), plus a paste-the-code fallback for when the browser doesn't open.

**Codex**: the TUI decides which screen to enter at startup. `codex/codex-rs/tui/src/startup_orchestration.rs` uses `startup_preflight::should_delay_startup_composer_for_first_login` to detect an unauthenticated user and sets the initial screen to `StartupDraftInitialScreen::Onboarding`; the onboarding directory splits into welcome, auth, and trust_directory sub-screens. `codex-rs/tui/src/onboarding/auth.rs#AuthModeWidget` lays out sign-in methods as explicit choices — browser OAuth, device code, API key — each backed by its own state struct. Underneath, `codex-rs/login/src/device_code_auth.rs#run_device_code_login` runs one line: request device code → print prompt → poll until complete → `persist_tokens_async`, persisting only on success.

**Pi**: writes its first-run conditions out plainly. `pi-mono/packages/coding-agent/src/cli/startup-ui.ts#shouldRunFirstTimeSetup` lists four gates: official distribution, experimental features enabled, no agent-dir override, settings.json missing. Setup itself is thin (`components/first-time-setup.ts#FirstTimeSetupComponent` only asks theme and analytics); the real weight is in resolving missing models through provider/model UI — `components/login-dialog.ts#LoginDialogComponent` replaces the editor during OAuth login flows, and `components/model-selector.ts#ModelSelectorComponent` offers a model list instead of free-text input.

**OMP**: solves "where does the model list come from." `oh-my-pi/packages/catalog/src/model-manager.ts#resolveProviderModels` merges static catalogs, caches, and dynamic discovery using three refresh strategies (`online / offline / online-if-uncached`), while `packages/catalog/src/discovery/` has one fetcher per provider (antigravity, codex, gemini, etc.). In other words, it never assumes the user typed a correct model ID in a config file — it asks the provider.

**OpenCode**: makes provider login an explicit CLI command. `opencode/packages/opencode/src/cli/cmd/providers.ts#ProvidersLoginCommand` refreshes the models.dev catalog, lists providers via autocomplete (priority-sorted, with hints like "ChatGPT Plus/Pro or API key"), supports plugin-managed auth and a well-known URL flow, then collects the key via `Prompt.password` into the auth store. Notably, it stores the key and ends there — **no** verification request against the provider.

## looplane's Choices and Differences

looplane's evolution has two stages, mapping exactly onto the two problems above.

**Stage one: provider-aware initialization.** The earliest version asked `Model:` only after task input, requiring users to know adapter-level ID formats. After the M8 rework, bare `looplane` in interactive mode completes runtime/provider/model selection before accepting a task; Ollama goes through local discovery (`looplane/src/looplane/cli.py#_fetch_ollama_models`), and remote providers show names to pick from rather than blanks to fill. Two deliberate differences from the five references: discovery hits only a fixed loopback endpoint with bounds on every dimension (time, bytes, count, name length) — no scanning other CLIs, no executing repository code; and `looplane -p` plus exec stay strictly non-interactive, so headless invocations with missing config get actionable errors, never interactive prompts.

**Stage two: instant credential verification.** This is where looplane ended up doing more than most reference projects. Originally `auth set-key` printed a static confirmation and you'd learn whether the key worked only when a task ran — essentially OpenCode's current shape. Three commits closed the gap: first the verification core (commit 965f0af, `looplane/src/looplane/provider_verification.py#verify_native_credential`), then CLI `auth set-key` verifying right after saving plus a new `auth list --verify` (commit 34a1c78), finally the TUI OnboardingModal split into a four-step wizard — overview → connection → credential → model — with a spinner and live result built into the credential step (commit 54bd929, `looplane/src/looplane/tui.py#OnboardingModal`). The wizard stays a single ModalScreen switching internal state, so the `push_screen_wait` call site never changed.

## Engineering Rationale

The reasoning behind key decisions:

- **Verification timeout uses UI timescales.** `verify_native_credential` defaults to 10 seconds versus the 60-second timeout for task execution — because on this code path a human is watching a spinner, not an agent waiting on an API.
- **Verification failure doesn't lock users out.** When verification fails, `auth set-key` keeps the saved credential and prints a yellow warning: being offline or hitting a provider outage shouldn't cost you the key you just configured; `auth list --verify` re-checks later.
- **Model listing failures carry reasons.** `provider_verification.py#fetch_models_result` returns a `VerificationResult` that distinguishes "ok but empty list" (endpoint doesn't support listing — degraded) from "failed with message"; the UI falls back to free input instead of breaking.
- **Discovery must be bounded.** Ollama discovery hits only `http://127.0.0.1:11434/api/tags`, disables proxy routing, requests identity encoding, caps at 256 KiB / 100 models / 256-printable-char names — local services can return garbage too, and onboarding shouldn't become an attack surface.
- These are all classic usability engineering: report errors close to where they occur (Nielsen's "help users recognize, diagnose, and recover from errors"), rather than letting them accumulate into one big explosion.

## What Could Still Improve

Against the five references, looplane still lacks:

1. **Remote model catalogs.** OMP and OpenCode both pull remote listings (models.dev or provider-native discovery APIs); looplane's remote providers still take manually typed model IDs. `fetch_models_result` already returns a models tuple — the next step is upgrading the model step from "verified, now type" to "verified, pick from a list."
2. **An OAuth login path.** Claude Code's and Codex's browser OAuth with device code fallback is the legitimate route for subscription users; looplane currently offers API keys only (the codex OAuth adapter is separate and outside the onboarding flow).
3. **Documented first-run conditions.** Pi documents `shouldRunFirstTimeSetup`'s four gates as comments right above the function — self-documenting style worth copying, since onboarding trigger conditions are exactly what later contributors break first.

## References

- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) — `packages/coding-agent/src/cli/startup-ui.ts`
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) — `packages/catalog/src/model-manager.ts`
- [sst/opencode](https://github.com/sst/opencode) — `packages/opencode/src/cli/cmd/providers.ts`
- [openai/codex](https://github.com/openai/codex) — `codex-rs/tui/src/onboarding/`
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — decompiled source analysis
- [10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/) — Nielsen Norman Group

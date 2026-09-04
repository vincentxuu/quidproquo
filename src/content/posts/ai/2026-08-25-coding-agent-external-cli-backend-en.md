---
title: "Learning Agent Design from Mature Coding Agents (9): External CLIs as a Backend — Where Does the Security Boundary Go?"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 9
tags: [coding-agent, external-cli, looplane, sandbox, codex, claude-code]
lang: en
tldr: "Every mature coding agent ships a machine interface: codex has `exec --json` plus a full app-server JSON-RPC protocol, claude-code has `-p` with stream-json, and pi/opencode/omp each expose a JSON event stream. Wrapping these CLIs as your backend is the fastest path to subscription-backed coding — but they own their agent loop, their login, and their permission model. looplane's answer: let the external CLI fully own its loop while looplane holds only three things — an isolated working copy, patch audit, and final verification. One runtime never impersonates another."
description: "Comparing the headless machine interfaces of codex, claude-code, opencode, pi, and omp at source level, the design tension of using external CLIs as coding backends, and how looplane draws its boundary with disposable clones and patch audit."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-external-cli-backend)

The [previous post](/posts/ai/2026-08-25-coding-agent-approval-grading-en) covered approval grading. This one tackles a more pragmatic question: your harness already has its own loop and verification gate, but the user's machine may have a logged-in Codex CLI and Claude Code sitting right there — rebuild everything against raw APIs, or just wrap those CLIs as backends?

## The design problem: can you wrap someone else's CLI?

Building your own harness is honestly expensive: model provider abstraction, retries, toolset, edit tools, verification commands — every layer is yours. Meanwhile the user might already have two "free" complete agents installed: official CLIs carrying their own model loop, their own auth state, their own sandbox options. Using them as a backend skips every one of those layers.

But wrapping is where the problems start. First, an external CLI is not a library but a process: it runs its own loop, and you don't control when it calls which tool. Second, it brings its own credentials and environment — you don't want to snoop its login, yet you can't pretend it's your model adapter. Third, its output format exists to serve the human terminal experience first, and the schema drifts across versions. So the real design question is: **where does the security boundary go?** Do you trust the CLI's own sandbox? Or do you treat everything it produces as untrusted?

## What the five projects actually do

**codex** offers two layers of machine interface. The first is one-shot headless execution: `codex-rs/exec/src/cli.rs#json` defines the `--json` flag, and `codex-rs/exec/src/event_processor_with_jsonl_output.rs#EventProcessorWithJsonOutput` converts internal events into JSONL lines. The second is a long-lived protocol: `codex-rs/app-server-protocol/src/protocol/common.rs#ClientRequest::ThreadStart` defines `thread/start`, and the same enum carries `turn/start` and `turn/interrupt` — one child process can serve many turns. More important is the reverse direction: `ServerRequest::ExecCommandApproval` and `ApplyPatchApproval` in the same file let the app-server ask the client "may this command / this patch through?" Approval authority is explicitly handed to the host.

**claude-code**'s headless surface is `-p`/`--print` plus streaming: `src/main.tsx#getInputPrompt` accepts `'text' | 'stream-json'` input, and print mode skips the trust dialog. On the SDK side the hook is `src/QueryEngine.ts#canUseTool` — every tool call asks the host program first. That is exactly the programmatic permission hook the Agent SDK documents.

**opencode** takes the simplest route: `packages/opencode/src/cli/cmd/run.ts` provides `--format json`, described in-source as "raw JSON events". **pi** adds one more mode: `packages/coding-agent/src/cli/args.ts#Mode` defines `text | json | rpc` output modes, with the JSON projection in `packages/coding-agent/src/modes/print-mode.ts#printableEvent`. **omp** is a fork of pi that keeps the same print mode and grows its own RPC layer (`packages/coding-agent/src/modes/rpc/rpc-client.ts`) for IDE integration.

The common denominator is clear: all five treat the headless machine interface as a first-class citizen, and both codex and claude-code make approval bidirectional rather than a post-hoc log read.

## looplane's choice, and where it differs

looplane wrote the principle down in M5, in the docstring of `src/looplane/external_runner.py#ExternalCodingRunner`: the external runtime may edit only a disposable Git clone; looplane independently validates the patch boundary and executes final verification. Concretely, three walls:

1. **Workspace boundary**: before delegation, pin the source HEAD, require a clean worktree, and snapshot the entire non-`.git` filesystem with a streaming SHA-256 hash — ignored files included (`_filesystem_snapshot`). The clone uses no hardlinks, `.git` moves outside the child cwd (`_isolate_git_metadata`), and origin is removed.
2. **Patch audit**: after the child exits, verify source integrity first, then take a full diff against the immutable index, apply path policy and cumulative limits, and reject binary/symlink/untracked output (`_validate_external_patch`). What the CLI claims it changed doesn't count.
3. **Final verification**: every check command runs through looplane's own bounded verifier; afterwards the patch is compared again to prove the checks didn't mutate the artifact.

M10/M11 extended this boundary from one-shot tasks to long-lived conversations: `codex_app_server.py#CodexAppServerSession` opens a JSONL connection to `codex app-server`, one thread serving many turns, with file-change and command approvals routed back through looplane via the protocol. On the Claude side, the Agent SDK's `canUseTool` provides PreToolUse correlation. But vendor thread/session IDs stay inside the adapter — only looplane-generated IDs ever reach the renderer or the durable store. The external runtime never pollutes the native data model.

Generalizing in M13 didn't break the principle either: `external_cli_base.py#StreamJsonCliBackend` folds opencode/pi/omp into one base class — subclasses supply only argv and a tolerant normalizer, while bounded subprocess execution, environment control, and event caps are shared. `runtime_registry.py#RUNTIME_REGISTRY` declares per-runtime differences in a capability matrix (opencode has MCP, pi doesn't), so the TUI and dispatch read the registry instead of growing per-runtime branches anywhere else.

The deepest difference is a negative sentence: **an external CLI is never wrapped as a `ModelProvider`**. looplane's provider abstraction consumes model IDs and API keys; an external CLI is a complete agent runtime with its own loop and login. Merging them would blur who decides, who executes, and who answers for side effects. So the subscription path stays labeled local/private-experimental behind three explicit opt-in flags.

## Academic and engineering grounding

"The agent's output is untrusted input" has a research name: [indirect prompt injection](https://arxiv.org/abs/2302.12173) showed that LLM-integrated applications can be hijacked into hostile tool calls — exactly why looplane refuses to trust the CLI-reported diff and recomputes it from Git instead. [SWE-agent](https://arxiv.org/abs/2405.15793) argued that agent-computer interface design determines behavior quality; an app-server protocol is essentially an ACI upgraded from "shell + files" to "typed events + approval requests". On the engineering side, [Codex sandboxing docs](https://developers.openai.com/codex/concepts/sandboxing) and [Claude Code permissions](https://code.claude.com/docs/en/iam) both candidly limit their own guarantees — neither promises OS-level isolation, which is first-party support for "the host must build its own boundary".

## What could improve

Three items lead the queue. First, events are normalized after the run rather than streamed token-by-token on the generalized path; the M11 app-server path streams already, but `StreamJsonCliBackend` does not. Second, patch audit currently accepts tracked-file modifications/deletions only and fails closed on new files — too strict for "add me a module", so a safe untracked-output path is needed. Third, source snapshot cost grows linearly with non-`.git` files and large repos hit the deadline; a layered strategy — Git-tracked set verified fully, ignored files sampled — would bring the cost of proving "the source didn't change" down.

## References

- [openai/codex — the codex-rs workspace](https://github.com/openai/codex): `exec` headless mode and `app-server-protocol`
- [OpenAI Codex sandboxing documentation](https://developers.openai.com/codex/concepts/sandboxing)
- [anthropics/claude-code](https://github.com/anthropics/claude-code) and the [Claude Agent SDK documentation](https://platform.claude.com/docs/en/agents-and-tools/claude-agent-sdk/overview)
- [sst/opencode — the run command](https://github.com/sst/opencode)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono): `--mode json|rpc` event streams
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- Greshake et al., ["Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection"](https://arxiv.org/abs/2302.12173)
- Yang et al., ["SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering"](https://arxiv.org/abs/2405.15793)

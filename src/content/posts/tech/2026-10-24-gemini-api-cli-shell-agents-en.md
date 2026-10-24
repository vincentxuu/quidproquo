---
title: "Using the Gemini API CLI: How It Splits Work with Antigravity CLI and the Gen AI SDK, Setup, and Limits"
date: 2026-10-24
category: tech
type: deep-dive
tags: [gemini-api-cli, gemini, google, cli, ai-tools, antigravity-cli]
lang: en
tldr: "The Gemini API CLI (gemini-api) is an experimental preview (v0.4.x) Google released on 2026-10-19: a single Go binary that turns Gemini models, media generation, and managed agents into stateless shell commands. It is not a coding agent. Use it when your own code decides the next step, Antigravity CLI when you want an agent to plan, and the Gen AI SDK for application backends."
description: "Where the Gemini API CLI sits in the Gemini developer stack, how it splits work with Antigravity CLI and the Gen AI SDK, its command map, how to embed it in a local tool, and its limits around beta status, data retention, and API keys."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-10-24-gemini-api-cli-shell-agents)

The Gemini API CLI (command name `gemini-api`) is an [experimental preview](https://aistudio.google.com/learn/introducing-the-gemini-api-cli) Google released on October 19, 2026, currently at v0.4.x. It is a single binary written in Go that exposes Gemini's text models, image/speech/music/video generation, file analysis, and managed agents as shell commands.

The easiest thing to get wrong: it is **not** a coding agent, and it is not the successor to Gemini CLI. That successor is [Antigravity CLI](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent) (`agy`); on June 18, 2026, Google stopped serving Gemini CLI to Google AI Pro, Ultra, and free individual users. `gemini-api` does one thing: your program, script, or another agent calls it once and gets a result back.

Whether to use it depends on who decides the next step:

- Your code already knows what to ask and what it needs back: use `gemini-api`.
- The task needs reading code, running commands, and trying several steps: use Antigravity CLI or another coding agent.
- You are shipping a service that needs types, concurrency, and retries: use the Gen AI SDK.

## Where it sits in the Gemini developer stack

Google describes three layers. At the bottom is the [Gemini API](https://ai.google.dev/gemini-api/docs) (models and Managed Agents). On top are two parallel entry points: the [Google Gen AI SDK](https://ai.google.dev/gemini-api/docs/libraries) (Python, TypeScript, Go, Java) and the `gemini-api` CLI.

```diagram
title: The three layers of the Gemini developer stack
desc: Application backends reach the Gemini API through the Gen AI SDK; local tools and coding agents reach it through the gemini-api CLI.
caption: Simplified from Google's three-layer description. Antigravity belongs in the "Coding agent" box too; Google demonstrates it calling gemini-api directly.
---
<svg viewBox="0 0 440 376">
  <path class="dg-line" d="M80 80V148" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M220 80V148" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 80V148" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M80 216V284" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M290 216V284" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="16" y="24" width="128" height="56" rx="6"/>
  <text class="dg-label" x="80" y="46" text-anchor="middle" dominant-baseline="central">App backend</text>
  <text class="dg-sub" x="80" y="64" text-anchor="middle" dominant-baseline="central">Web apps, APIs</text>

  <rect class="dg-box" x="156" y="24" width="128" height="56" rx="6"/>
  <text class="dg-label" x="220" y="46" text-anchor="middle" dominant-baseline="central">Local tools</text>
  <text class="dg-sub" x="220" y="64" text-anchor="middle" dominant-baseline="central">Plugins, scripts</text>

  <rect class="dg-box" x="296" y="24" width="128" height="56" rx="6"/>
  <text class="dg-label" x="360" y="46" text-anchor="middle" dominant-baseline="central">Coding agent</text>
  <text class="dg-sub" x="360" y="64" text-anchor="middle" dominant-baseline="central">e.g. Claude Code</text>

  <rect class="dg-box" x="16" y="152" width="128" height="64" rx="6"/>
  <text class="dg-label" x="80" y="176" text-anchor="middle" dominant-baseline="central">Gen AI SDK</text>
  <text class="dg-sub" x="80" y="198" text-anchor="middle" dominant-baseline="central">Typed libraries</text>

  <rect class="dg-box dg-box--accent" x="156" y="152" width="268" height="64" rx="6"/>
  <text class="dg-label" x="290" y="176" text-anchor="middle" dominant-baseline="central">gemini-api CLI</text>
  <text class="dg-sub" x="290" y="198" text-anchor="middle" dominant-baseline="central">Stateless shell commands</text>

  <rect class="dg-box" x="16" y="288" width="408" height="64" rx="6"/>
  <text class="dg-label" x="220" y="312" text-anchor="middle" dominant-baseline="central">Gemini API</text>
  <text class="dg-sub" x="220" y="334" text-anchor="middle" dominant-baseline="central">Text, image, speech, music, video, Managed Agents</text>
</svg>
```

The CLI has three design traits:

- **Stateless.** Each call is independent and the CLI keeps no conversation locally. To continue a conversation, pass back the interaction ID from the previous call (`previous_interaction_id`).
- **Self-describing.** `--help`, `--usage` (machine-readable KDL), `--schema` (the JSON Schema of the request body), and `--dry-run` (an offline preview of the HTTP request with the key redacted) are built into the binary, so an agent doesn't need to read docs first.
- **Clean output.** Images, speech, music, and video are written straight to disk and stdout prints only the file path. Text can be emitted as JSON or TOON, and `--jq` extracts just the fields you need.

None of this was impossible before: a small SDK script or a raw REST call does the same job. Google's own framing is that without a dedicated CLI, agents guess model IDs, write throwaway SDK scripts, and push base64 into their context. The CLI's increment is removing that friction, not adding model capability.

## How it splits work with Antigravity CLI and the Gen AI SDK

|  | gemini-api CLI | [Antigravity CLI](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google) | Gen AI SDK |
|---|---|---|---|
| Role | One API call | A coding agent that plans for itself | Typed client libraries |
| Who decides the next step | The program or agent calling it | The agent | Your code |
| Typical caller | Scripts, plugins, other agents | A person in the terminal | Application backends |
| Good for | One-shot generation, analysis, transcription, background research | Multi-step code changes, running commands, subagents | Production services, concurrency, retries |

The design of Antigravity CLI is covered in [this post](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent). Google also demonstrates the two working together: Antigravity treats `gemini-api` as a tool, generates an image or video with it, then carries on with the returned file path.

If you have been calling Antigravity CLI as a one-shot text generator, this is the case to switch. Your program only needs "send a prompt, get text back", with no tools, sandbox, or subagents, so the agent's startup and loop are overhead. With `gemini-api`, one call is one API round trip.

## Command map

| Category | Commands | What they do |
|---|---|---|
| Create | `generate`, `image`, `tts`, `music`, `video` | Text and multimodal generation; image generation and editing; speech; music; video |
| Understand | `analyze`, `transcribe` | Ask about PDFs, images, audio, video, or YouTube URLs; transcribe to md, text, json, or srt |
| Manage | `agent`, `files`, `models` | Start and poll managed agents, upload files, list models |
| Configure | `configure`, `auth`, `whoami` | API key and preferences; show where the active credential comes from |
| Advanced | `environments`, `credentials`, `webhooks`, `triggers` | Sandbox environments, server-side credentials, webhooks, scheduled triggers |

Default models per the [README](https://github.com/google-gemini/gemini-api-cli) as of 2026-10-24: `generate`, `analyze`, and `transcribe` use `gemini-3.8-flash`; `image` uses `gemini-nano-banana-2.1`; `video` uses `gemini-omni-1.1-flash`; `music` uses `lyria-3.5`; `tts` uses `gemini-3.8-flash-tts`. Model names change fast, so trust what `gemini-api models` lists.

Long-running work is where the CLI fits best. A managed agent such as Deep Research can run in the background while you keep only the interaction ID and check on it later:

```bash
ID=$(gemini-api agent run "Research battery recycling approaches and cite sources" \
  --agent deep-research-preview-04-2026 \
  --background --stream=false --jq '.id')

gemini-api agent status "$ID" --stream=false --output-format json
```

## Example: handing a local tool's AI calls to the CLI

Say you have a VS Code extension or a customer-support tool that needs "rewrite this in a formal tone". Before, the tool needed a place to enter an API key, a decision about how to store it, and connection checks. With the CLI it splits into two steps.

**Step one: configure the key once, and the program never touches it.** The key can live in the `GEMINI_API_KEY` environment variable, or you can run `gemini-api configure --api-key "..."` to store it in the OS keychain (macOS Keychain, Linux Secret Service, Windows Credential Manager) or in `~/.config/gemini-api/config.yaml`; `gemini-api configure` with no arguments opens an interactive setup UI. `gemini-api whoami` tells you which source is active.

**Step two: the program only builds arguments, calls, and reads the result:**

```ts
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

export async function rewrite(text: string): Promise<string> {
  const prompt = `Rewrite in a formal tone and return only the result:\n\n${text}`;
  try {
    // execFile bypasses the shell, so user text is never interpreted as a command
    const { stdout } = await run("gemini-api", ["generate", prompt, "--no-interactive"]);
    return stdout.trim();
  } catch (err) {
    // Exit codes: 1 = API failure, 2 = invalid usage, 3 = authentication failure
    if ((err as { code?: number }).code === 3) {
      throw new Error("Gemini API key not configured; run gemini-api configure first");
    }
    throw err;
  }
}
```

`--no-interactive` turns off every interactive prompt, and the exit codes separate authentication problems from other errors. Together they make the subprocess safe to run in the background. Before wiring it in, use `--dry-run` to see the request that would actually be sent:

```bash
gemini-api generate "Hello from my agent" --dry-run
```

`--dry-run` makes no network call and doesn't read the keychain, so it is also a fine CI check that your command is assembled correctly.

## Limits

- **Still beta.** Google says it evolves alongside the [Interactions API](https://ai.google.dev/gemini-api/docs/interactions), breaking changes can land between versions, and you should pin a [release version](https://github.com/google-gemini/gemini-api-cli/releases) in CI and automation. The installer is `curl ... | bash`; to pin a version, download the prebuilt archive for that release instead. The project isn't accepting external pull requests, so feedback goes through issues.
- **You need an API key.** It uses an [API key](https://ai.google.dev/gemini-api/docs/api-key) created in Google AI Studio; check quota and billing there.
- **Data does persist server-side.** The CLI stores no conversation locally, but server-side interactions and uploaded files have their own retention. Files uploaded through the Files API are kept for 48 hours. The README's example sets `"store": false` in the request body to turn off server-side storage of the interaction. If your tool handles customer data, run `gemini-api generate --schema` to see which fields your version accepts, then pass that setting with `--body`.
- **No agent capabilities.** It doesn't read your project, decide its own next step, or sandbox anything locally (`environments` manages a managed agent's server-side environment). If you need those, go back to the split above.

## Getting started

```bash
# Install (macOS / Linux)
curl -fsSL https://raw.githubusercontent.com/google-gemini/gemini-api-cli/main/scripts/install.sh | bash

# Configure the key and verify
gemini-api configure --api-key "YOUR_API_KEY"
gemini-api whoami
gemini-api generate "Hello from my agent" --dry-run
```

To let a coding agent use it, paste the block the README provides into `AGENTS.md` or `CLAUDE.md`: choose commands with `--help` or `--usage`, build `--body` from `--schema`, `--dry-run` first, and add `--stream=false --output-format json` for structured output. An agent such as [Claude Code](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent-en) that reads this can look up commands and call them on its own.

## Overall

`gemini-api` collapses "call Gemini" into a fixed shell interface. What you get is a program that doesn't manage keys or streaming and an agent that doesn't write one-off scripts. What you pay is that it only makes a single call, has no judgment of its own, and is still v0.4.x.

If you already run an agent, treating it as one of that agent's tools is the natural fit. If you write local tools or scripts, it replaces "standing up an agent or an SDK project for one call". For services in production, stay with the Gen AI SDK.

## References

- [Introducing the Gemini API CLI (Google AI Studio, 2026-10-19)](https://aistudio.google.com/learn/introducing-the-gemini-api-cli)
- [google-gemini/gemini-api-cli (GitHub)](https://github.com/google-gemini/gemini-api-cli)
- [An important update: Transitioning Gemini CLI to Antigravity CLI (Google Developers Blog, 2026-05-19)](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli)
- [Antigravity CLI: How Google Folded Gemini CLI Into a Unified Terminal Agent Harness](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent-en)
- [Antigravity CLI: Google Replaces a 100K-Star Open-Source Tool with a Closed-Source Go Binary](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google-en)

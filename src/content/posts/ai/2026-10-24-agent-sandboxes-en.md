---
title: "Choosing an Agent Sandbox: Four Kinds of Isolation and Where Claude Code and Codex Defaults Differ"
date: 2026-10-24
category: ai
type: deep-dive
tags: [security, ai-agent, sandbox, claude-code, mcp]
lang: en
series:
  name: "AI Agent Security Tooling Map"
  order: 2
tldr: "I sort agent sandboxes into four kinds: shared-kernel OS isolation, container orchestration, local microVMs and remote microVMs. Claude Code's sandbox is off by default and wraps only shell commands; Codex CLI's is on by default locally. Most public escapes go around the boundary through config files or check scripts rather than through its core, and a sandbox answers how far a fooled agent can get, not whether it gets fooled. On Claude Code, turn the sandbox on, put ~/.ssh and ~/.aws on the deny list, and block the Read tool separately."
description: "The four kinds of agent sandbox, how Claude Code's and Codex CLI's defaults and known bypasses differ, what a sandbox can and cannot cover, and settings Claude Code users can copy."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-10-24-agent-sandboxes)

The scanners in the last post work before anything is installed. Some risks no scanner can see: the agent reads a web page with a malicious instruction hidden in it and is talked into running a command. A sandbox starts from accepting that this will happen and asks one question: once the agent has been fooled, what is the farthest it can reach?

The short answer: Claude Code's sandbox is off by default, and once on it wraps only shell commands.

On the [series map](/posts/ai/2026-10-24-ai-agent-security-tooling-map-en), this is the second kind of tool, limiting the damage at the "commands the agent runs" entry point. It suits anyone who wants to know what Claude Code's or Codex's defaults actually protect. The material comes from official documentation, source code and published research; nothing was installed or tested hands-on.

## I sort sandboxes into four kinds

"Sandbox" covers four different things. This split is my own grouping for this article, not an industry standard.

- **Shared-kernel OS isolation.** Use what the operating system provides to restrict a single process: Seatbelt on macOS, bubblewrap plus seccomp or Landlock on Linux. Claude Code's sandbox (built on [sandbox-runtime](https://github.com/anthropics/sandbox-runtime)), Codex CLI and [nono](https://github.com/nolabs-ai/nono) all belong here. It is light and fast, but every process shares one kernel.
- **Container orchestration.** [kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox) provides no isolation itself; it hands that to runtimes such as gVisor or Kata Containers and manages how to spin up sandboxes at scale on Kubernetes.
- **Local microVMs (lightweight virtual machines).** Tools such as [smolvm](https://github.com/smol-machines/smolvm) start a small virtual machine with its own guest kernel on your machine. The boundary is stronger than shared-kernel isolation, at the cost of needing hardware virtualization such as KVM.
- **Remote microVMs.** [E2B](https://github.com/e2b-dev/E2B) is a cloud-hosted Firecracker microVM; each sandbox is isolated from the other sandboxes and from the host (see [E2B's docs](https://docs.e2b.dev/faq/security-and-compliance)). It is for running LLM-generated or user-supplied code, not for a developer wrapping Claude Code locally.

Shared-kernel isolation and a virtual machine with its own kernel guard against different things, so they cannot be ranked on one table. No independent study has measured how much each of these sandboxes actually stops, so this post compares scope and does not rank.

Sandbox tools also carry maintenance risk. The hosted-sandbox service Daytona froze its public repo from June 2026 at v0.190.0, moved its core into a private codebase and announced it was [going closed source](https://www.daytona.io/dotfiles/updates/daytona-is-going-closed-source) (the repo's [README](https://github.com/daytonaio/daytona) says so too). Before choosing a sandbox, check the date of the last release and whether the license has changed.

## Where Claude Code's and Codex's defaults differ

| Item | Claude Code | Codex CLI |
|---|---|---|
| On by default? | Off | On locally (`workspace-write`) |
| How it isolates | macOS Seatbelt, Linux bubblewrap; network goes through a local proxy and the allowed-domain list starts empty | macOS Seatbelt, Linux bubblewrap plus seccomp by default; network is off by default |
| Scope | Wraps only shell commands and the processes they start; built-in tools such as Read, Edit and WebFetch, the check scripts you configure to run around actions (the hooks from post 0), and local MCP servers are outside it | The network proxy filters only traffic from commands inside the sandbox (you must turn on `network_proxy`; it is off by default); web search, MCP connections and the browser are not covered |
| Reads and writes | Writes limited to the working directory and temp by default; reads cover nearly the whole machine, including `~/.ssh` and `~/.aws/credentials` | Writes limited to the working directory and temp by default; paths such as `.git` and `.aws` are read-only; the docs do not list a default read scope |
| Way to skip the sandbox entirely | A failed command can be retried with `dangerouslyDisableSandbox`; only `allowUnsandboxedCommands: false` closes that | `--yolo` (turns off both approvals and the sandbox) or `--sandbox danger-full-access` (sandbox only) |

Claude Code's documentation is direct about it: there is no built-in credential deny list, so only the files and variables you list are restricted. And when the sandbox cannot start, the default is to run commands without it; to make that a hard failure you must set `failIfUnavailable: true`.

The sandbox and Claude Code's built-in permission prompts are two different layers. A permission prompt decides whether an action runs at all; the sandbox limits what a Bash command can reach once it runs. According to the docs, in the sandbox's auto-allow mode, Bash commands inside the sandbox stop asking you one by one, so how well the boundary is set matters more than it does without a sandbox.

## Escapes mostly happen next to the boundary

Two Claude Code CVEs show the pattern. What they share is that something written inside the sandbox was later treated as trusted configuration or a trusted path by Claude Code outside it.

- [CVE-2026-25725](https://nvd.nist.gov/vuln/detail/CVE-2026-25725): on Linux, the bubblewrap sandbox did not make a config file that did not yet exist at startup read-only, so code inside the sandbox simply created it and wrote a script that runs at startup; after a restart, Claude Code ran it with host privileges.
- [CVE-2026-39861](https://nvd.nist.gov/vuln/detail/CVE-2026-39861): a command inside the sandbox created a symlink pointing outside the working directory, and the Claude Code process outside the sandbox later wrote to that path and followed the link out. NVD's text puts it most clearly: the sandboxed command and the unsandboxed app could each not write outside the working directory, but together they could.

Both are fixed; just confirm your Claude Code is at 2.1.64 or later.

Pillar Security sums up this class as: an agent's reach is everything it can write that the host later trusts ([original](https://www.pillar.security/blog/the-week-of-sandbox-escapes)).

Another class is logic errors when the sandbox generates its own rules, such as [CVE-2025-59532](https://nvd.nist.gov/vuln/detail/CVE-2025-59532) (Codex before 0.39.0, where a model-generated working directory was treated as a writable root) and [CVE-2025-66479](https://nvd.nist.gov/vuln/detail/CVE-2025-66479) (sandbox-runtime before 0.0.16, where the network sandbox did not take effect if no allowed domains were set). Claude Code's docs also warn that allowing `/var/run/docker.sock` through `allowUnixSockets` effectively hands over the host.

In the public Claude Code and Codex cases so far, what gets bypassed is the config files, check scripts, Docker socket and rule-generation logic around the boundary, not Seatbelt or bubblewrap themselves. My own reading is that the operating system's isolation is comparatively solid and the trust chain around it is where things break.

## A sandbox answers "how far after being fooled"

A sandbox does not stop an agent from being persuaded; it only decides how far a fooled agent can go. Researchers at Baldur Security had the AI penetration-testing tool Strix scan a page carrying a prompt injection. Strix was tricked into running commands, and the researchers got a shell with sudo. The author writes that Strix runs its scanning inside a sandboxed container, which "significantly lowers the impact", and does not demonstrate an escape. What the case shows is that inside the boundary the agent still holds everything it was authorized for (here at least sudo and outbound connections); the sandbox limits the world beyond those.

Claude Code and nono are both direct about this. Claude Code's documentation says the sandbox reduces risk but is not a complete isolation boundary, and that allowing a broad domain such as `github.com` is still a path for data to leave. nono's [security model](https://nono.sh/docs/cli/internals/security-model) says it is not an escape-proof sandbox, and its security notes say production use is not currently recommended.

## How to use them

0. **Check your version first.** `claude --version` should show 2.1.64 or later (both CVEs above are fixed there).
1. **Claude Code: turn the sandbox on, fill in credentials, block Read separately.** Run `/sandbox` in Claude Code to turn it on, or write this into `~/.claude/settings.json`:

   ```json
   {
     "sandbox": {
       "enabled": true,
       "allowUnsandboxedCommands": false,
       "failIfUnavailable": true,
       "credentials": {
         "files": [
           { "path": "~/.ssh", "mode": "deny" },
           { "path": "~/.aws/credentials", "mode": "deny" }
         ]
       }
     },
     "permissions": {
       "deny": ["Read(~/.ssh/**)", "Read(~/.aws/**)"]
     }
   }
   ```

   Two caveats. `sandbox.credentials` covers only Bash commands inside the sandbox and does not stop the Read tool, which is why the `Read(...)` rules under `permissions.deny` are there. And Claude Code ignores `credentials` entries in project and local settings files; put them in your user (or managed) settings.
2. **Verify it took effect.** The official docs' method: ask Claude to run `touch ~/sandbox-probe`; inside the sandbox it should fail. If it offers to retry outside the sandbox, decline.
3. **Strict mode.** `allowUnsandboxedCommands: false` above closes the un-sandboxed retry (the docs call this Strict sandbox mode); `failIfUnavailable: true` adds that a sandbox which cannot start refuses to launch instead of quietly falling back to no sandbox.
4. **Do not put `docker` or `gh` in `excludedCommands` just to make them run.** The documentation itself warns that an excluded command runs with your full access.
5. **Handle local MCP servers separately.** They sit outside the sandbox. To wrap them too, put the whole of Claude Code in a container or VM, or use sandbox-runtime: `npm install -g @anthropic-ai/sandbox-runtime`, put the settings in `~/.srt-settings.json` (it denies all network by default, so list the domains and writable paths first), then start with `srt claude`. The Claude Code docs have an example in the [Sandbox runtime](https://code.claude.com/docs/en/sandbox-environments#sandbox-runtime) section.
6. **Pick the strength by situation.** This is my suggestion, not an industry rule:

   | Situation | Suggested isolation |
   |---|---|
   | Everyday work on a project you trust | Shared-kernel OS isolation (Claude Code's sandbox or Codex's default) |
   | Running an MCP server you do not trust, or code from outside | Local microVM (for example smolvm; start from its README) |
   | A shared cloud service | Remote microVM (for example E2B) |
7. **Before mounting, ask: would it be fine if this directory were wiped?** Any directory you mount into a VM and any ssh-agent you forward remain usable by the agent. clawk, for example (a tool that runs agents inside a VM), starts the agent with permission prompts skipped by default because it treats the VM as the boundary; `--safe` turns that off. Whatever you mount is whatever you allow.

## Self-check

- With Claude Code's sandbox on, is a local MCP server inside it? No; the official docs say it is outside.
- If you set only `sandbox.credentials`, can Claude's Read tool still read `~/.ssh`? Yes. That setting covers only Bash inside the sandbox; block the Read tool with `Read(...)` deny rules.

## Where this leaves you

A sandbox does not stop an agent from being fooled; it decides how far it gets afterwards. Shared-kernel isolation is cheap and practical, but config files and check scripts next to the boundary are where it is most often bypassed; a virtual machine is stronger, provided you mount little into it. One thing to do tonight: open Claude Code's settings and check whether the sandbox is on, whether your credential paths are on the deny list, and whether the Read tool is blocked separately. Post 3 covers the check before an action happens: the check scripts from post 0 (hooks), guardrails and gateways, and whether they allow or block when they fail.

## References

- [Claude Code docs: Sandboxing](https://code.claude.com/docs/en/sandboxing)
- [Claude Code docs: Choose a sandbox environment](https://code.claude.com/docs/en/sandbox-environments)
- [anthropics/sandbox-runtime](https://github.com/anthropics/sandbox-runtime)
- [OpenAI Codex docs: Sandbox](https://developers.openai.com/codex/sandboxing)
- [OpenAI Codex docs: Agent approvals & security](https://developers.openai.com/codex/agent-approvals-security)
- [nolabs-ai/nono](https://github.com/nolabs-ai/nono)
- [nono docs: Security model](https://nono.sh/docs/cli/internals/security-model)
- [smol-machines/smolvm](https://github.com/smol-machines/smolvm)
- [e2b-dev/E2B](https://github.com/e2b-dev/E2B)
- [E2B docs: Security and compliance](https://docs.e2b.dev/faq/security-and-compliance)
- [kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox)
- [Daytona: going closed source](https://www.daytona.io/dotfiles/updates/daytona-is-going-closed-source)
- [daytonaio/daytona](https://github.com/daytonaio/daytona)
- [NVD: CVE-2026-25725](https://nvd.nist.gov/vuln/detail/CVE-2026-25725)
- [NVD: CVE-2026-39861](https://nvd.nist.gov/vuln/detail/CVE-2026-39861)
- [NVD: CVE-2025-59532](https://nvd.nist.gov/vuln/detail/CVE-2025-59532)
- [NVD: CVE-2025-66479](https://nvd.nist.gov/vuln/detail/CVE-2025-66479)
- [Pillar Security: The Week of Sandbox Escapes](https://www.pillar.security/blog/the-week-of-sandbox-escapes)
- [Baldur Security: RCE in Strix Agent](https://baldur.dk/blog/strix-ai-pentester-rce/)
- [clawkwork/clawk](https://github.com/clawkwork/clawk)
- [Previous: Scanning skills and MCP servers before you install them](/posts/ai/2026-10-24-skill-mcp-pre-install-scanners-en)

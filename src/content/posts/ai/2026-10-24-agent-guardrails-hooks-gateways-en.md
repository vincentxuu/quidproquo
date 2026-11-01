---
title: "Can You Rely on Checks Before an Action? Claude Code Hooks, Agent Governance Toolkit, pipelock and NeMo Guardrails"
date: 2026-10-24
category: ai
type: deep-dive
tags: [security, ai-agent, guardrails, claude-code, mcp]
lang: en
series:
  name: "AI Agent Security Tooling Map"
  order: 3
tldr: "Guardrails intercept an action before the agent carries it out. On Claude Code the main attachment point is the hook, and the official docs say that on most events a hook that errors or times out lets the action go ahead; blocking needs onFailure: block. Other tools have their own failure behavior and defaults: the Agent Governance Toolkit library allows everything when no policy is loaded, NeMo Guardrails lets requests through when its jailbreak detector is down, and llm-guard and rebuff are archived. Ask three things of any guardrail: where it intercepts, what happens when it fails, and who can change its rules."
description: "The default failure behavior of Claude Code hooks, where Agent Governance Toolkit, pipelock, cc-safety-net, NeMo Guardrails and Docker MCP Gateway intercept, who can change their rules and what limits them, and what to do when a guardrail tool is archived or changes model."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-24-agent-guardrails-hooks-gateways)

A sandbox assumes the agent has already been fooled and limits what it can touch. A guardrail tries to act earlier: stop an action before it happens. When the agent is about to run a shell command or call an MCP tool, the guardrail takes a look first and decides whether to allow or refuse. Claude Code already asks you before most actions, according to its permission rules; what a guardrail tool adds is replacing "ask you" with "decide automatically by rule".

On the [series map](/posts/ai/2026-10-24-ai-agent-security-tooling-map-en), this is the third kind of tool, covering the "content returned by tools and web pages" and "commands the agent runs" entry points. It suits anyone already using Claude Code who wants to add a check before actions. The material comes from official documentation, source code and published research; nothing was installed or tested hands-on.

Post 0 mentioned that Claude Code can run a check script you write before each action; that script is called a hook. This post spells it out: a `PreToolUse` hook runs before the agent uses a tool (say, runs a Bash command). A script that exits with 2 blocks the action; one that exits with 0 has no objection, and the action goes on to the normal permission flow. Most guardrail tools on Claude Code attach at this point.

## I sort guardrails into three places

This grouping is my own, and one tool can span several cells: pipelock, for example, offers an HTTP proxy, an MCP proxy and a Claude Code `PreToolUse` hook.

| Place | Examples | What it can cover | What it cannot |
|---|---|---|---|
| An SDK inside your application | NeMo Guardrails, Guardrails AI, llm-guard (archived) | An LLM application you write, between the app and the model | An agent like Claude Code whose code you cannot change; it never calls these libraries |
| An MCP gateway | Docker MCP Gateway, IBM ContextForge (a registry and proxy, not built specifically for security) | MCP tools that pass through the gateway | Claude Code's built-in Bash, Edit and Write |
| A Claude Code hook | pipelock, hol-guard, cc-safety-net, the Agent Governance Toolkit plugin | Built-in and MCP tools, depending on configuration | Actions you wrote no rule for; the case where the script itself fails (next section) |

## The first question, what happens when it fails: a failed hook means allow by default

Claude Code's documentation is plain about it: on most events, when a hook fails or times out, the action still goes ahead. A policy hook with a wrong path or a crashing script does not block anything; each action goes back to the normal permission flow. To block on failure you must set `"onFailure": "block"` on a `command` or `http` hook, which needs Claude Code 2.1.295 or later. A script that exits with a code other than 0 or 2, cannot start, or times out counts as a failure.

This holds for every guardrail attached at the hook position. Whether one blocks on failure depends not only on how the tool was written but on whether you set that line. The documentation even gives a test: with `onFailure: "block"` set, delete the script file and ask Claude to run `ls`; it should be blocked. Without the setting, `ls` runs.

Some tools handle exceptions in their own code, but how far that reaches differs:

- **The Claude Code plugin for Microsoft's Agent Governance Toolkit (AGT)** has three command hooks that exit with 2 on an exception inside the script; the PreToolUse one reports that policy evaluation failed and the call is denied. That covers only exceptions inside the script. Its hooks.json sets no `onFailure`, so if node cannot start or the hook times out (set to 30 seconds), Claude Code's default of allowing still applies.
- **cc-safety-net**: its documentation says a broken config file makes it fall back to protective defaults and report a degraded state, rather than stop working. But its own known-limitations table also says that on Claude Code, if the hook itself crashes or times out, the call is allowed (fail-open), consistent with the default above.
- **NeMo Guardrails'** jailbreak detection follows the same pattern: its documentation says that when a configured detector cannot be reached, the rail lets the request through.

Self-check: if a hook script's path is wrong, will a Bash command be blocked? Not by default. Only if `onFailure: "block"` is set, or the script exits with 2.

## The second question: who can change the rules?

Where the rules live and who can write to them decides whether a guardrail can stop an agent that has already been fooled.

**Claude Code hooks.** Hook configuration can sit in your user-level `~/.claude/settings.json`, the project's `.claude/settings.json`, `.claude/settings.local.json`, a plugin's `hooks/hooks.json`, or an administrator's managed settings. Once an administrator sets `allowManagedHooksOnly`, user, project, local and plugin hooks do not run (plugins force-enabled by the administrator are exempt); without it, `disableAllHooks` in user, project or local settings still cannot switch off managed hooks. A script under the project's `.claude/hooks/` is a file the agent itself can write. The official docs list what happens on a write into `.claude/` in each permission mode: default and acceptEdits modes ask you first, auto mode routes it to the classifier, dontAsk mode denies it, and `bypassPermissions` mode allows it. So a fooled agent running with permissions skipped may be able to rewrite its own check script. In practice there are two layers. First, put the key rules in user-level or managed settings, and add an `Edit(...)` deny rule for the project's hook directory; the docs state that deny rules apply in every mode, `bypassPermissions` included. Second, edits made through Bash commands: an `Edit` deny rule only covers the file commands Claude Code recognizes (`sed`, `tee`, redirects) and cannot stop a Python or Node script that opens the file itself. While the sandbox is on, it already refuses Bash writes to the `.claude` settings files and the `.claude/hooks` directory by default; add other paths with `sandbox.filesystem.denyWrite` from the last post.

**AGT.** The policy engine runs in the same process as the agent, with no boundary independent of the agent, which is why the project recommends one container per agent in production. Its Claude Code plugin loads policy from `AGT_CLAUDE_POLICY_PATH`, then `~/.claude/agt/policy.json`, then the plugin's bundled default, in that order; that is, a JSON file under your home directory.

**pipelock.** Its rules live in its own configuration file (`pipelock.yaml`), reloaded through a file watcher or SIGHUP. The README describes "capability separation": in an enforced deployment the agent process has secrets but no direct network access, while pipelock has network access but none of the agent's secrets, so even a prompt-injected agent cannot reach the firewall's controls. That is a condition you have to build in your deployment, not something you get by installing it. Its documentation also says it is not a sandbox: if the agent can run arbitrary processes, those processes can bypass the proxy.

**NeMo Guardrails.** The rules live in the configuration folder the application loads (`config.yml` and Colang files), set by the application's developer. User input cannot change them, but it guards the space between your application and the model, not Claude Code.

**Docker MCP Gateway.** Its rules come from your local Docker MCP configuration (catalogs, profiles, network-blocking options). The official security document lists the local OS user, the Docker daemon and the local Docker MCP configuration files as trusted; whoever can modify those is outside its protection boundary. Catalog files must sit under `~/.docker/mcp/catalogs/`, and an image label may not carry runtime fields such as commands, mounts or environment values.

**cc-safety-net.** Settings sit in the user-level `~/.cc-safety-net/policy.json`, and a project may commit its own `.cc-safety-net/policy.json` layered on top. The official docs state that the agent cannot change `policy.json` in either scope; you edit it yourself or through its dashboard. The project file can relax the user's settings, but the tool reports each relaxed field, and setting the environment variable `CC_SAFETY_NET_PROJECT_TIGHTEN_ONLY=1` refuses every relaxation.

**hol-guard.** Local settings, project overrides and remembered allow or deny decisions are stored on this machine. Its docs say saved local decisions are verified against Guard-maintained integrity key material before they take effect again, and `hol-guard policies verify` can find unsigned or tampered decisions.

## How strong the rules are

**AGT: claim versus self-assessment.** Microsoft's open-source toolkit, officially in Public Preview, with possible breaking changes before GA and support limited to GitHub Issues and Discussions. The repo description says "Covers 10/10 OWASP Agentic Top 10". OWASP is a security community organization, and the Agentic Top 10 is its list of the ten main risk categories for AI agents (the full list is in post 8). But AGT's own mapping document says 7 full and 3 partial, and notes this is an internal self-assessment, not a certification.

**AGT: defaults and detection.** When the policy engine has no policy loaded, its default action is allow (AGT's own LIMITATIONS document says so); the Claude Code plugin instead falls back to its bundled default policy, which marks Bash, Edit and similar tools for review. Its MCP gateway detection is heuristic, with no LLM; the "semantic intent classifier" its documentation mentions is described in a source comment as a keyword-weighted heuristic classifier with no machine-learning dependency.

**pipelock.** Detection as documented is all rules: regular expressions for data exfiltration, injection patterns and entropy analysis, with no classifier model mentioned. The author concedes that injection detection is syntactic rather than semantic, so an LLM-rewritten injection that matches no known pattern will pass. Its benchmark was built and run by the authors. Newer versions also offer optional `pipelock sandbox` and `contain` modes to cover the sandbox gap; this post does not assess how strong they are.

**NeMo Guardrails.** This is a library for conversational applications you write, not a Claude Code plugin. Its jailbreak detection has two heuristics. The length-per-perplexity one, on NVIDIA's own test data at the default threshold, detects about 31% of jailbreaks with about 7% false positives; the prefix-and-suffix perplexity one does better on GCG-style attacks (49 of 50, about 0.04% false positives). Both are intended for English only, with more false positives on non-English text and code. The docs also describe a model-based detector, which this post does not assess.

**Docker MCP Gateway.** Its security policy lists prompt injection, tool-description poisoning and a malicious MCP server you enabled abusing the access you granted as "out-of-scope report examples" (the prompt-injection item carries a caveat: unless it bypasses the gateway's own boundary); it also does not deny outbound network globally by default.

What they share is that a guardrail is a layer of rules or a model, not a guarantee of security, and how strict it is depends on who configures and maintains it.

## Guardrail tools get frozen or change course

My view is that a detection-based guardrail that stops being updated gets steadily less accurate against new attacks, so check the last release date before adopting one.

- **llm-guard**: archived on 9 July 2026. Its README says the project and its models on Hugging Face are no longer under active development or maintained; it gives no reason and no successor or migration guidance. The last PyPI release is from May 2025 with no deprecation marker.
- **rebuff**: archived in May 2025 with no notice in its README; what it says about itself is that it is still a prototype and cannot provide 100% protection.
- **Guardrails AI**: not archived, but a July 2026 announcement ([issue #1560](https://github.com/guardrails-ai/guardrails/issues/1560)) set two dates: hosted inference servers stop on 6 August, and `guardrails hub install` and the private registry stop on 25 August. One passage in the announcement also gives 25 August for the inference servers, while the official docs say 6 August; this post follows the docs. Both dates have now passed. Validators install from PyPI (`pip install guardrails-ai-<name>`, with imports moved to `guardrails_ai`), and anyone using the hosted models has to run them locally (`use_local=True`) or on their own endpoint. The reasons given are that Hub pip installs were unreliable and that free hosted inference is expensive to run. This is a migration, not the tool disappearing. On 9 September Harvey announced it was acquiring Guardrails AI, with the founders and team joining Harvey; the announcement does not say who will maintain the open-source framework.

## How to use them

1. **First see whether you have any hook.** Run `/hooks` in Claude Code (a read-only list that labels which settings level each hook comes from), or open `.claude/settings.json` and look under `hooks.PreToolUse`.

   - **If you have some:** add `"onFailure": "block"` to the ones that actually block things, confirm Claude Code is at 2.1.295 or later, then try the documented test: temporarily break the script path, ask Claude to run `ls`, and see whether it is blocked.
   - **If you have none:** before any action you have only Claude Code's built-in permission prompts. To add a guardrail, start with the smallest one. Add this to `.claude/settings.json`:

     ```json
     {
       "hooks": {
         "PreToolUse": [
           {
             "matcher": "Bash",
             "hooks": [
               {
                 "type": "command",
                 "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.sh",
                 "args": [],
                 "onFailure": "block"
               }
             ]
           }
         ]
       }
     }
     ```

     Then save this script as `.claude/hooks/block-rm.sh` and `chmod +x` it (it needs `jq` installed):

     ```bash
     #!/bin/bash
     COMMAND=$(jq -r '.tool_input.command')
     if echo "$COMMAND" | grep -q 'rm -rf'; then
       echo "Blocked: rm -rf" >&2
       exit 2   # 2 = block; stderr becomes the reason
     fi
     exit 0     # 0 = no objection; normal permission flow
     ```
2. **Fill in a three-cell table for any guardrail.** Take the tool you are considering and read its README to fill in: where it intercepts (SDK, gateway, hook), what happens when it fails (allow or block), who can change its rules. A cell you cannot fill is a place you cannot trust yet.
3. **Pair guardrails with a sandbox.** cc-safety-net's README says outright that it is not a sandbox; pipelock's limitations note says its proxy is not one either (newer versions have an optional sandbox mode). If you have turned on only the guardrail and not the sandbox, follow the last post and turn the sandbox on; the same the other way round. A guardrail blocks the actions you anticipated; a sandbox limits the ones you did not.
4. **Measure false positives yourself.** Rules can be read and tuned, and you can expect them to be bypassed by rewording; for classifier and LLM judgments, do not take a vendor's number. One way: take 20 normal commands you actually ran in the past week, feed them through the guardrail one by one and count how many get blocked. If more than one or two do, you will soon want to turn it off.
5. **Check whether it has been frozen before you adopt it.** Look for an Archived banner at the top of the GitHub page and the date of the latest release; then write one line in your project docs: "if this stops being maintained, I switch to X".
6. **If you use AGT, confirm a policy is actually loaded.** With the plugin, run `/agt-governance:agt-status` to see which path the active policy came from; with the library (SDK), no loaded policy means allow by default, so load one yourself. Then deliberately send a command that should be blocked and confirm it is.

## Where this leaves you

A guardrail's position decides what it can see, and its failure behavior decides whether it can be relied on; on Claude Code the failure default is to allow. One thing to do tonight: run `/hooks` to see whether you have any; if you do, check for `onFailure: "block"` and actually break a script to test it; if you do not, add the minimal one above. Post 4 covers what comes after: seeing what the agent did, and whether the record can serve as evidence.

## References

- [Claude Code docs: Hooks](https://code.claude.com/docs/en/hooks)
- [Claude Code docs: Permissions](https://code.claude.com/docs/en/permissions)
- [Claude Code docs: Permission modes (Protected paths)](https://code.claude.com/docs/en/permission-modes#protected-paths)
- [Claude Code docs: Sandboxing (Protected paths)](https://code.claude.com/docs/en/sandboxing#protected-paths)
- [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit)
- [pipelab-org/pipelock](https://github.com/pipelab-org/pipelock)
- [hashgraph-online/hol-guard](https://github.com/hashgraph-online/hol-guard)
- [kenryu42/cc-safety-net](https://github.com/kenryu42/cc-safety-net)
- [NVIDIA-NeMo/Guardrails](https://github.com/NVIDIA-NeMo/Guardrails)
- [NeMo Guardrails docs: Jailbreak Protection](https://docs.nvidia.com/nemo/guardrails/configure-guardrails/guardrail-catalog/jailbreak-protection)
- [docker/mcp-gateway](https://github.com/docker/mcp-gateway)
- [cc-safety-net docs: Policy file](https://ccsafetynet.com/docs/configuration/policy)
- [HOL Guard docs: Local vs. Cloud](https://github.com/hashgraph-online/hol-guard/blob/main/docs/guard/local-vs-cloud.md)
- [AGT docs: LIMITATIONS](https://github.com/microsoft/agent-governance-toolkit/blob/main/docs/LIMITATIONS.md)
- [Guardrails AI docs: Remote Validation Inference](https://www.guardrailsai.com/docs/concepts/remote_validation_inference)
- [Harvey: Guardrails AI Joins Harvey](https://www.harvey.ai/blog/guardrails-ai-joins-harvey)
- [IBM/mcp-context-forge](https://github.com/IBM/mcp-context-forge)
- [protectai/llm-guard](https://github.com/protectai/llm-guard)
- [protectai/rebuff](https://github.com/protectai/rebuff)
- [guardrails-ai/guardrails shutdown announcement (issue #1560)](https://github.com/guardrails-ai/guardrails/issues/1560)
- [Previous: Choosing an agent sandbox](/posts/ai/2026-10-24-agent-sandboxes-en)

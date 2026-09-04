---
title: "Looplane Skills, Blocking Hooks, and Plugin Packages"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, skills, hooks, plugins]
lang: en
tldr: "Looplane treats skills as bounded repository-local guidance, hooks as opt-in host commands that can only deny, and local plugin manifests as packages for skills and hooks; their authority is deliberately different."
description: "Examine Looplane skill discovery and projection, fail-closed blocking hooks, and the manifest, installation flow, and boundaries of local plugin packages."
series:
  name: "Looplane Architecture Notes"
  order: 15
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-looplane-skills-hooks-plugins)

The [previous article](/posts/tech/2026-08-30-looplane-native-mcp-authorization-en) brought external MCP capabilities into `ToolExecutor`. Repository-local extension introduces another cluster of terms: skill, hook, and plugin. Looplane loads them together, but they do not share the same authority.

## A skill changes guidance, not capability

[Looplane](https://github.com/vincentxuu/looplane) discovers skills in `.looplane/skills/*.md`. Each file must be regular, non-symlink UTF-8 Markdown with only `name` and `description` frontmatter. File count, individual size, and total rendered context are bounded. Explicit selection uses exact names; unknown and duplicate names are errors.

Rendered content is labeled repository-local guidance below system, developer, permission, and tool-safety rules. The native loop injects it into initial context. An external runner receives a resolved bundle and `skill-resolution.json`. A skill can teach a workflow, but it cannot manufacture a tool or relax permission policy.

## A hook is an opt-in blocking gate

`.looplane/hooks.json` can run exact argv commands around approval requests, tools, and compaction. Looplane bounds timeout, argv, output, and environment, then sends the event payload on stdin. Project hooks are disabled unless the operator sets `LOOPLANE_ENABLE_PROJECT_HOOKS=1`.

Hooks are deny-only. `allow` means that a hook adds no denial; it cannot bypass the permission layer. A timeout, nonzero exit, malformed output, or runner exception fails closed. A pre-tool denial prevents execution. A post-tool denial records a problem after the action and cannot reverse its side effects.

There is a separate host boundary. Hook commands run with the source repository as cwd. Opting in therefore trusts the command itself. Deny-only semantics constrain its lifecycle decision, not the command's own ability to edit files or produce other host side effects.

## A plugin is a local package, not a marketplace

Plugin manifests live in `.looplane/plugins/*.json` and may list description, discovery metadata, skills, and hooks. Referenced skill paths must remain inside the repository and cannot use symlinks or path escape. A plugin skill receives the `<plugin>.<skill>` namespace, while plugin hooks follow project hooks.

`looplane plugin install` accepts a local manifest path and copies the manifest and skill files into the project. It rejects a duplicate name unless overwrite is explicit. Loading the JSON manifest does not execute plugin code.

```text
skill markdown -> bounded prompt guidance
hook argv      -> opt-in, deny-only lifecycle gate
plugin JSON    -> local packaging for skills + hooks
```

The reviewed implementation has no remote registry, signature verification, dependency solver, lockfile, update or uninstall flow, arbitrary executable plugin payload, or MCP-server packaging. “Local package format” is more accurate than “plugin marketplace.”

The three layers solve different problems: skills explain how to work, hooks add lifecycle vetoes, and plugins package and discover both. Keeping their authority separate avoids treating installed Markdown as execution permission. The [next article](/posts/tech/2026-08-30-looplane-subagent-scheduling-en) follows work into isolated child agents while modification authority remains with the parent.

---

## References

- [Skill discovery and context projection](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/skills.py)
- [Blocking hook runner](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/hooks.py)
- [Plugin manifests and local installation](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/plugins.py)
- [Native loop hook integration](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/loop.py)
- [Skill, hook, and plugin tests](https://github.com/vincentxuu/looplane/tree/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests)

---
title: "Looplane local OS sandboxes: fail-closed execution on macOS, bubblewrap, and Landlock"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, sandbox, bubblewrap, landlock, seccomp]
lang: en
tldr: "Looplane can wrap configured local commands and verification in macOS sandbox-exec, Linux bubblewrap, or Landlock/seccomp. A required unavailable backend stops with exit 126 instead of running bare, but external CLIs, MCP/LSP processes, and the entire Looplane process are outside this boundary."
description: "Trace how Looplane resolves its verification sandbox into macOS sandbox-exec, Linux bubblewrap, or Landlock/seccomp wrappers and where the boundary ends."
series:
  name: "Looplane Architecture Notes"
  order: 10
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-looplane-local-os-sandbox)

The [permission layer](/posts/tech/2026-08-30-looplane-permission-layering-en) decides whether a command has authority to run. An authorized process may still inherit broad host access, so Looplane can wrap configured local command and verification paths in an operating-system sandbox.

## One profile, platform-specific wrappers

`resolve_command_sandbox()` accepts the verification profile and auto, bubblewrap, or Landlock backends. Workspace and task-home roots are readable; configured workspace/task roots are writable.

On macOS, auto generates a `sandbox-exec` profile with deny-default behavior, required process and metadata access, bounded system reads, and explicit workspace writes. It does not add a network allow rule.

On Linux, auto prefers bubblewrap. The wrapper uses namespace isolation, a new session, read-only and writable binds, and a private `/tmp`. The Landlock alternative sets `no_new_privs`, applies filesystem restrictions, installs architecture-specific seccomp restrictions, and only then executes the target argv.

## Missing enforcement fails closed

An explicitly requested but unavailable backend does not silently degrade to bare execution. Looplane returns an error projected as exit 126, and policy-setup failure occurs before `exec`. This makes sandbox availability observable rather than leaving configuration and actual enforcement out of sync.

The boundary is intentionally narrower than a VM. It covers configured local command and verification paths, not the Looplane Python process, external coding CLIs, MCP servers, LSP processes, TUI sidecars, or remote runtimes. Kernel and architecture support also constrain Landlock and seccomp. The [next article](/posts/tech/2026-08-30-looplane-tool-program-transactions-en) examines ordering, concurrency, and file rollback above this execution layer.

---

## References

- [Runtime sandbox source](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/runtime.py)
- [Landlock and seccomp wrapper](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/landlock_run.py)
- [Sandbox-focused runtime tests](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_runtime.py)
- [bubblewrap project](https://github.com/containers/bubblewrap)
- [Linux Landlock documentation](https://docs.kernel.org/userspace-api/landlock.html)

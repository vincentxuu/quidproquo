---
title: "Rivumi IDE/LSP Context: Diagnostics, Open Files, and the VS Code Bridge"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, lsp, vscode, ide-context]
lang: en
tldr: "Rivumi normalizes up to 200 diagnostics and 32 visible files into bounded, repository-local, untrusted context. Its VS Code and managed-LSP paths supply signals rather than completion, rename, code actions, or full IDE RPC."
description: "Trace Rivumi's IDE/LSP bridge from VS Code events and publishDiagnostics through JSON snapshots, WebSocket push, path validation, fingerprinted injection, and editor deep links."
series:
  name: "Rivumi Architecture Notes"
  order: 18
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-rivumi-ide-lsp-vscode-bridge)

The [previous article](/posts/tech/2026-08-30-rivumi-sdk-conversation-websocket-en) established the embedding boundary. When an editor connects, [Rivumi](https://github.com/vincentxuu/rivumi) does not expose the entire VS Code API or LSP to the model. It extracts two decision signals: current diagnostics and the files and positions the user is viewing.

## Two snapshots are not editor truth

The bridge uses `.rivumi/ide/diagnostics.json` and `.rivumi/ide/open-files.json`. A diagnostic preserves repository-relative path, range, severity, source, code, and message. Open-file state preserves visible files, the active flag, cursor, and selection.

Loaders reject symlinks, non-files, oversized files, non-UTF-8 or malformed JSON, NULs, reversed ranges, non-`file://` URIs, and paths outside the repository. One snapshot holds at most 200 diagnostics or 32 open files. Rendered context is capped at 16,000 and 8,000 characters respectively.

Bounds control context pressure; they do not make the data trustworthy. The diagnostic renderer tells the model to verify repository state before editing. The open-file renderer calls active files and cursor positions navigation hints rather than proof of file contents.

## The native loop injects only changed signals

Before each model request, `AgentRunner` reads both snapshots and computes fingerprints. Unchanged content is skipped. A new non-empty snapshot becomes `InjectedContext(source="ide_diagnostics")` or `ide_open_files` and produces an injection event. An invalid bridge file produces an ignored event rather than failing the entire run.

```text
diagnostics.json + open-files.json
  -> validate paths and bounds
  -> compare fingerprint
  -> render untrusted context
  -> next model request
```

When given `project_root`, rendered entries may include `vscode://file/...` deep links. LSP's zero-based positions become one-based line and column values in the link, after the same repository-path validation.

## Managed LSP consumes publishDiagnostics only

`ManagedLspServer` starts a long-lived subprocess with exact argv, a sanitized environment, and project cwd. It reads size-bounded `Content-Length` JSON-RPC frames and handles only `textDocument/publishDiagnostics`. Valid messages are normalized and written atomically to the same diagnostics snapshot. Closing first terminates the process and kills it after a timeout.

The name should not imply a complete client. There is no LSP initialization handshake, didOpen or didChange document synchronization, or request-response client. The implementation has no completion, hover, definition, rename, or code-action path. It is a managed diagnostics consumer.

## The VS Code extension has a file path and an early WebSocket path

The repository's VS Code extension listens for diagnostics, visible editors, active-editor changes, and selections. After a 250 ms debounce, it collects data within the first workspace folder and atomically writes both `.rivumi/ide` files. The native loop can consume this path on every step through fingerprint comparison.

With `rivumi.ideContext.webSocketUrl`, the extension also opens a short-lived connection, sends one typed `ide_context` message, and immediately closes without waiting for server acknowledgment. The server requires a configured `project_root`, validates the same path boundary, and only then queues context for the next conversation turn.

At the reviewed revision, this direct path has a lifecycle gap. As [order 17](/posts/tech/2026-08-30-rivumi-sdk-conversation-websocket-en) showed, ending a WebSocket connection closes the app's shared controller. The extension performs a one-shot send-and-close, so this is not yet a durable IDE conversation channel. The local JSON snapshots are the independently tested native-loop path.

The bridge adds a narrow but useful capability: the model can see which line has a diagnostic and where the user is looking, reducing blind search. It does not fix code, apply edits, or provide IDE completion and refactoring. The [Cloudflare capstone](/posts/tech/2026-08-23-rivumi-cloudflare-deployment-en) now asks which of these local guarantees survive a remote control plane.

---

## References

- [IDE context contracts and path validation](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/ide.py)
- [Managed LSP diagnostics supervisor](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/lsp.py)
- [Native-loop IDE injection](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/loop.py)
- [VS Code extension bridge](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/editors/vscode/src/extension.ts)
- [Typed WebSocket IDE context path](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/conversation_websocket.py)
- [IDE, LSP, extension, and loop tests](https://github.com/vincentxuu/rivumi/tree/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests)

---
title: "Tool Pick｜Audio Studio MCP — Let Your Agent Score Your Game on Your Own Machine"
date: 2026-10-20
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source MCP server that generates BGM and sound effects locally with Stable Audio 3 on Mac or Windows — no cloud, no API key — so Claude Code and other agents can score a game or video directly"
tldr: "Audio Studio MCP is an MCP server that lets Claude Code, Cursor and other agents generate background music and sound effects with Stable Audio 3, running entirely on your own Mac or Windows PC. Install: `git clone` then run `./install.sh` (Mac) or `install.ps1` (Windows). It solves the problem of game and video creators having to leave their workflow for a cloud subscription or a stock-audio library every time they need a sound."
series:
  name: "AI Tool of the Day"
  order: 60
---

> 🌏 [中文版](/posts/daily/2026-10-20-tool-audio-studio-mcp)

## Tool Info

| Item | Value |
|---|---|
| Name | Audio Studio MCP |
| Type | MCP server |
| GitHub | [kanaworksai-hue/audio-studio-mcp](https://github.com/kanaworksai-hue/audio-studio-mcp) |
| Stars | 248 |
| Language | Python |
| License | MIT (code); model weights are separately covered by the [Stability AI Community License](https://huggingface.co/stabilityai/stable-audio-3-optimized) |
| Install | `git clone https://github.com/kanaworksai-hue/audio-studio-mcp.git && cd audio-studio-mcp && ./install.sh` |

## What Problem It Solves

You're halfway through building a small game or editing a video with Claude Code or Cursor, and you need a sound — a lofi café loop, or glass shattering. Normally that means leaving the editor: open a browser, dig through a stock-audio library, or subscribe to a cloud AI music generator, paste in a description, wait for it to render, download it, and drag it back into the project. The detour breaks whatever rhythm you had going in the agent, and you usually end up re-checking the commercial license on top of it.

Audio Studio MCP folds that whole loop into the MCP protocol. The agent calls a `generate_audio` tool with a plain-language description of the BGM or sound effect it wants, and underneath that runs Stability AI's Stable Audio 3 — MLX on Apple Silicon, PyTorch on an NVIDIA GPU — entirely on your own machine. Nothing is uploaded, and there's no paid API key involved. Once you have a clip, `edit_audio` can re-style the whole thing, regenerate just one time range, or extend it, and `process_audio` handles seamless looping, loudness normalization (LUFS), and export to whatever WAV/OGG/FLAC format your game engine or editor expects.

It's a good fit for indie game developers who need music and SFX, for anyone cutting a video or short with an agent who needs an underlying audio track, and for cases where you don't want to track cloud API usage or second-guess who owns the rights to what came back.

## Quickstart

### Install

```bash
# macOS (Apple Silicon, M1 or later, 16GB RAM recommended)
git clone https://github.com/kanaworksai-hue/audio-studio-mcp.git
cd audio-studio-mcp
./install.sh
# the installer prints the registration command when it's done:
claude mcp add --scope user audio-studio -- /path/to/audio-studio-mcp/.venv/bin/audio-studio-mcp
```

```powershell
# Windows (requires an NVIDIA GPU with 8GB+ VRAM; accept the model license on Hugging Face first)
git clone https://github.com/kanaworksai-hue/audio-studio-mcp.git
cd audio-studio-mcp
powershell -ExecutionPolicy Bypass -File install.ps1
```

### Basic Usage

Just describe what you want in plain language and let the agent call the server:

```
"Make a 60-second lofi BGM loop at 85 BPM for a cafe scene, give me 3 candidates."

"I need a heavy wooden door slamming in a stone hallway. Export it as OGG for Godot."
```

The server teaches the agent the official Stable Audio 3 prompt format — music as genre → lead instruments → supporting layers → rhythm → mood, sound effects as source → action → material → space — so an off-the-cuff description still turns into a prompt the model actually understands.

### Advanced Usage

```bash
# Run a persistent HTTP server so every session shares one already-loaded model process, skipping cold starts
.venv/bin/audio-studio-mcp --http 8765 --preload
claude mcp add --scope user --transport http audio-studio http://127.0.0.1:8765/mcp
```

```
"Extend this 20-second track to 90 seconds and normalize it to -16 LUFS."   # chains edit_audio and process_audio
```

## Compared to Existing Approaches

| | Audio Studio MCP | Cloud AI music generators (e.g. Suno) | Royalty-free SFX libraries (e.g. Epidemic Sound) |
|---|---|---|---|
| Runs locally, no API key | ✅ | ❌ | ❌ (subscription-based) |
| Generated directly from inside the agent | ✅ | ❌ (needs a separate web tab) | ❌ (needs browsing/searching) |
| Reproducible (same seed, same result) | ✅ | ❌ | — |
| Can edit an existing clip (extend/re-style) | ✅ | Partial | ❌ |
| No need to re-check a commercial license | ❌ (must read the Stability AI community license) | Depends on the plan | ✅ (while subscribed) |

## Caveats

- **The license isn't a simple MIT.** The code is MIT, but the model weights are separately covered by the Stability AI Community License, which at the time of writing permits commercial use for individuals and organizations under US$1M in annual revenue — above that threshold you need a different license, so read the terms yourself before shipping anything commercial.
- **The Windows weights are gated.** You need to log in with a free Hugging Face account and accept the license on each model page first, or downloads fail with 401/403; the README specifically warns agents never to ask the user to paste a token into the chat.
- **Instrumental and SFX only, no vocals.** Stable Audio 3 itself cannot produce intelligible lyrics or singing.
- **Only Apple Silicon and NVIDIA GPUs are supported.** Intel Macs and AMD GPUs aren't supported, and while the PyTorch backend should in theory work on Linux, the project explicitly marks it as untested with no installer yet.

## Takeaway

It's easy to assume that giving an agent the ability to score something always means wiring up a cloud generation API — paying per call and worrying about who owns the rights to the result. Audio Studio MCP shows the alternative: pull the whole open-weight model onto your own machine and wrap it as an MCP tool call, and "AI-generated audio" becomes as much a local asset as your code — the same seed always produces the same clip, and both the rights and the usage history stay on your own disk.

## References

- [kanaworksai-hue/audio-studio-mcp — GitHub](https://github.com/kanaworksai-hue/audio-studio-mcp)
- [README — Quick start, Tools, FAQ](https://raw.githubusercontent.com/kanaworksai-hue/audio-studio-mcp/main/README.md)
- [Stable Audio 3 — Stability AI](https://github.com/Stability-AI/stable-audio-3)
- [Model Context Protocol](https://modelcontextprotocol.io)

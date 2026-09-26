---
title: "Tool Pick｜ismail — a DAW an AI Agent Runs Entirely in Text"
date: 2026-09-27
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An MCP server that exposes a full DAW as text, so an agent can write notes, chain effects, and read back structured feedback on a mix without ever needing to listen or look at a waveform"
tldr: "ismail is an MCP server that exposes a DAW in text: an agent writes notes, effect chains, and automation, then reads back structured text describing the mix. Install: clone the repo, then pip install -e . It solves the problem of agents doing audio work with no ears, forced to guess at parameters."
series:
  name: "AI Tool of the Day"
  order: 38
---

> 🌏 [中文版](/posts/daily/2026-09-27-tool-ismail)

## Tool Info

| Item | Value |
|---|---|
| Name | ismail |
| Type | MCP server |
| GitHub | [newsbubbles/ismail](https://github.com/newsbubbles/ismail) |
| Stars | 3 |
| Language | Python |
| License | MIT |
| Install | `git clone`, then `pip install -e .` |

## What Problem It Solves

Agents doing audio work have one built-in disadvantage: they have no ears. You can have an agent write synth parameters, chain effects, or program a drum pattern, but it can't hit play and judge whether the result sounds right the way a person can. At best it gets a screenshot of a waveform or spectrogram, and most vision models are far worse at reading charts than at reading text. The result is an agent that guesses at parameters and waits for a human to listen before it knows whether it's on the right track — the whole iteration loop is bottlenecked on a human ear.

ismail's fix is to make both ends of the DAW text. On the writing side, notes, instrument patches, effect chains, and automation are all described as text or JSON (`notes_write`, `track_add`, `pattern_write`, and similar operations) — the agent never touches a GUI. The listening side is where it actually earns its keep: after rendering audio, a set of analysis tools (`analyze_bars`, `analyze_chords`, `analyze_drums`, `analyze_melody`, `analyze_structure`, `sound_compare`) reads the audio back into structured text — the tempo, the chord progression, the drum pattern, the per-bar frequency-band energy. The agent judges its own output against that same feedback loop, with no human translating "how it sounds" in the middle. The same set of operations is exposed three ways — MCP server, CLI, and Python API — with about 70 tools in total.

Where this fits: an agent generating procedural music or sound effects on its own; taking a reference track and having an agent analyze its structure, split it into stems, and iterate until a comparison score against the original converges; or sound design where an agent tunes synth parameters against textual spectral feedback instead of needing a human to listen after every change.

## Getting Started

### Install

```bash
git clone https://github.com/newsbubbles/ismail
cd ismail
pip install -e .                      # engine, analysis, CLI, MCP server
pip install -e ".[perceptual]"        # optional: CLAP perceptual similarity, needs torch + transformers
pip install -e ".[separate]"          # optional: demucs stem separation, for working from reference tracks
```

Requires Python 3.10+. MP3 previews need `ffmpeg` on your PATH.

### Basic Usage

```bash
# Create a 124 BPM, 8-bar project, add a bass track, write notes, render
python -m ismail -p songs/demo project_new bpm=124 length_bars=8
python -m ismail -p songs/demo track_add name=bass instrument='"preset:acid_bass"'
python -m ismail -p songs/demo notes_write '{"track": "bass", "bar": 1, "notes": "0 E2 0.5 110; 0.5 E3 0.25", "repeat": 8}'
python -m ismail -p songs/demo render stems=true out=v1 mp3=also
python -m ismail -p songs/demo analyze_melody source=track:bass bars=[1,2]
```

Wiring it into Claude Code is one line:

```bash
claude mcp add -s user ismail -- python -m ismail.mcp_server
```

### Advanced Usage

Point it at a reference track and let the agent deconstruct, rebuild, and score its own progress:

```bash
python -m ismail -p songs/demo project_new reference=ref.wav
python -m ismail -p songs/demo analyze_grid source=ref      # find tempo and beat grid
python -m ismail -p songs/demo separate source=ref          # split into stems via demucs
python -m ismail -p songs/demo cmp_run stems=demucs         # score each stem against the reference
python -m ismail -p songs/demo cmp_worst                    # find the worst-scoring section to fix next
```

## Compared to Existing Approaches

| | ismail | Suno/Udio-style text-to-music | Ableton-style DAW automation over MCP |
|---|---|---|---|
| Note-level editability | ✅ | ❌ black-box generation, can't touch a single note | ✅ (but via MIDI/OSC) |
| Agent can read back the mix and judge it | ✅ structured analysis and scoring | ❌ | ❌ usually still needs a human ear |
| Iteration gated on a human listening | ❌ | ✅ | ✅ |
| Rebuild and score against a reference track | ✅ the `cmp_run` family | ❌ | ❌ |
| Fully open source, self-hostable | ✅ MIT | ❌ mostly closed services | depends on the project |

## Things to Watch

- **Brand new — created today.** Only 3 stars, no community track record yet. Run `python -m pytest tests -q` yourself before relying on it, to confirm the environment installs cleanly.
- **The advanced analysis tools are heavy.** The CLAP perceptual-similarity model is about 600MB, and stem separation needs `torch` via `demucs` — that won't fit on a lightweight container or a Raspberry Pi. The core features (writing notes, rendering, basic analysis) don't need any of this.
- **Instrument "patches" are Python code, not config.** A `voice` module is a Python file that gets executed (a `voice(freq, t, vel, gate, sr)` function). If you let an untrusted agent write its own voice files, treat that exactly like letting it run arbitrary code, and sandbox accordingly.

## Today's Takeaway

Most "AI makes music" tools solve generation — one prompt in, one song out. ismail solves the feedback loop instead: it lets an agent read back, in text, what it just made actually sounds like, which is what makes real iteration possible instead of tweaking parameters and hoping.

## References

- [newsbubbles/ismail — GitHub](https://github.com/newsbubbles/ismail)
- [ismail GitHub API metadata (license/stars/created date)](https://api.github.com/repos/newsbubbles/ismail)
- [ismail README (raw)](https://raw.githubusercontent.com/newsbubbles/ismail/main/README.md)
- [ismail pyproject.toml (dependencies and version requirements)](https://raw.githubusercontent.com/newsbubbles/ismail/main/pyproject.toml)

---
title: "HyperFrames Deep Dive: HTML as Video, a Paradigm Shift for the Agent Era"
date: 2026-07-06
category: ai
type: deep-dive
tags: [hyperframes, heygen, video-generation, html, agent-skills, open-source, remotion]
lang: en
tldr: "HeyGen's open-source HyperFrames defines video timelines with HTML data attributes, uses headless Chrome for frame-accurate seek-and-capture, then encodes via FFmpeg to MP4. 33k stars in 3 months, Apache 2.0, 21 agent skills — AI agents write HTML to produce video, no React needed."
description: "A deep analysis of HeyGen's open-source HyperFrames framework: the HTML-to-MP4 rendering pipeline, seekable animation design, comparison with Remotion, agent skills ecosystem, and HeyGen's open-source strategy."
draft: false
glossary:
  - term: "seekable rendering"
    aliases: ["可跳幀渲染"]
    definition: "The rendering engine can jump directly to any frame for capture without playing through from the beginning."
    definition_en: "The rendering engine can jump directly to any frame for capture without playing through from the beginning."
    context: "HyperFrames requires all animations to be seekable, which is the foundation of deterministic rendering."
    context_en: "HyperFrames requires all animations to be seekable, which is the foundation of deterministic rendering."
  - term: "deterministic rendering"
    aliases: ["確定性渲染"]
    definition: "Identical inputs always produce identical outputs, unaffected by execution environment or timing differences."
    definition_en: "Identical inputs always produce identical outputs, unaffected by execution environment or timing differences."
    context: "Enables CI/CD regression testing and reproducible bug reports for video rendering."
    context_en: "Enables CI/CD regression testing and reproducible bug reports for video rendering."
---

> 🌏 [中文版](/posts/ai/2026-07-06-hyperframes-html-video-agents)

[HyperFrames](https://github.com/heygen-com/hyperframes) is a video rendering framework open-sourced by HeyGen in April 2026. Its core thesis fits in one sentence: **a video is an HTML page**. Define timelines with `data-*` attributes, animate with browser-native tools, hand it to headless Chrome for frame-by-frame capture, and let FFmpeg encode the result into MP4. No React, no build step — AI agents write HTML to produce video.

In 3 months it has accumulated 33.2k GitHub stars and 272 releases. HeyGen, tldraw, and TanStack are already using it in production. This article breaks down the technical design and ecosystem strategy.

## Why HTML?

[Remotion](https://www.remotion.dev/), the pioneer of programmatic video, chose React as the video authoring format — developers build scenes with React components and control time with `useCurrentFrame()`. Intuitive for human developers, but it poses a fundamental problem for AI agents: **LLMs are best at HTML, not React**.

HTML/CSS/JS is the richest part of LLM training corpora. 25 years of CodePen, Stack Overflow, MDN, and W3Schools have produced a massive body of web animation code. When an AI agent writes GSAP animations or CSS transitions, the output quality far exceeds what it can produce with Remotion's `interpolate()` and `spring()`.

HyperFrames' insight: **reduce the video format to AI's most native language, and video production becomes prompt engineering**.

## Rendering Pipeline: From HTML to MP4

The HyperFrames rendering pipeline has four stages:

```
HTML + CSS + JS  →  Puppeteer load  →  Frame-by-frame seek + capture  →  FFmpeg encode  →  MP4
```

Each HTML composition is a standalone `index.html` that opens directly in a browser for preview. At render time, the engine launches headless Chrome via Puppeteer, precisely seeks to each frame's timestamp for capture, then feeds the frame sequence through FFmpeg for encoding.

The critical design decision is **seekable rendering**: the engine doesn't "play the page and record the screen." Instead, it pauses the animation timeline, jumps to the exact time point, captures one frame, then jumps to the next. This guarantees deterministic output — the same HTML on any machine produces the exact same video, making CI/CD regression testing possible.

## Composition Format

Video timelines are declared with HTML `data-*` attributes — no new syntax to learn:

```html
<div id="stage" data-composition-id="launch"
     data-start="0" data-width="1920" data-height="1080">

  <video class="clip" data-start="0" data-duration="6"
         data-track-index="0" src="intro.mp4" muted></video>

  <h1 id="title" class="clip" data-start="1"
      data-duration="4" data-track-index="1">Launch day</h1>

  <audio data-start="0" data-duration="6"
         data-track-index="2" data-volume="0.5"
         src="music.wav"></audio>

  <script>
    const tl = gsap.timeline({ paused: true });
    tl.from("#title", { opacity: 0, y: 40, duration: 0.8 }, 1);
    window.__timelines = window.__timelines || {};
    window.__timelines.launch = tl;
  </script>
</div>
```

Key design choices:

- **`data-start` / `data-duration`**: Controls when an element appears in the video, in seconds
- **`data-track-index`**: Controls layer stacking order; higher numbers render on top
- **`window.__timelines`**: Animation timelines register on a global object; the engine seeks to corresponding times during render
- **No custom tags**: Everything is standard HTML that runs directly in a browser

## Package Architecture

HyperFrames uses a modular design (87.7% TypeScript), with core packages handling distinct responsibilities:

| Package | Role |
|---------|------|
| [`hyperframes`](https://github.com/heygen-com/hyperframes) | CLI entry point — scaffold, preview, lint, render |
| `@hyperframes/core` | Parsers, generators, linter, frame adapters |
| `@hyperframes/engine` | Seekable capture engine via Puppeteer + FFmpeg |
| `@hyperframes/producer` | Full rendering pipeline: capture → encode → audio mixing |
| `@hyperframes/studio` | Browser-based composition editor |
| `@hyperframes/player` | Embeddable Web Component player |
| `@hyperframes/shader-transitions` | WebGL shader transition effects |
| `@hyperframes/aws-lambda` | Distributed rendering via AWS Lambda |

This architecture lets users do local CLI rendering or deploy to Lambda for large-scale parallel output.

## Animation Adapter System

HyperFrames supports multiple animation engines through adapters that unify them into a seekable interface:

- **GSAP**: Most commonly used; timeline natively supports seek
- **CSS animations**: Simulates seek via `animation-play-state: paused` + `animation-delay`
- **Lottie**: JSON animation format; `goToAndStop` natively supported
- **Three.js**: 3D scenes; `mixer.setTime` for control
- **Anime.js**: Native seek method supported
- **WAAPI** (Web Animations API): Direct seek via `currentTime` property
- **Custom runtime**: Implement the seek interface to plug in

This adapter pattern is key to HyperFrames handling diverse animation needs — it doesn't lock you to a single library, but requires all animations to be "seekable to any frame."

## Agent Skills: An Ecosystem of 21 Skills

HyperFrames ships 21 AI agent skills designed for Claude Code, Cursor, Gemini CLI, and Codex. Installation:

```bash
npx skills add heygen-com/hyperframes
```

Skills are organized in two layers:

**Creation skills** — map to specific video types; agents just describe intent:
- `product-launch-video`: Marketing videos, 30-90 second sweet spot
- `website-to-video`: Site tours and portfolio showcases
- `faceless-explainer`: No-face concept explainers
- `pr-to-video`: Turn GitHub PRs into changelog videos
- `embedded-captions`: Add captions over existing footage
- `motion-graphics`: Kinetic text, data effects, logo animations
- `music-to-video`: Beat-synced videos
- `remotion-to-hyperframes`: Migration from Remotion

**Foundation skills** — domain knowledge, loaded on demand by creation skills:
- `hyperframes-core`: Composition format and timeline specification
- `hyperframes-animation`: Animation rules and runtime adapters
- `hyperframes-keyframes`: Frame-by-frame animation debugging
- `hyperframes-creative`: Design direction and beat planning
- `hyperframes-media`: TTS, sound effects, transcription
- `hyperframes-cli`: Dev loop and Lambda deployment

This layered design means agents don't need to load all knowledge at once. A user says "make me a product launch video," the agent routes through `/hyperframes`, determines intent, then loads `product-launch-video` + `hyperframes-core` + `hyperframes-animation` on demand.

## HyperFrames vs Remotion

Both share the same underlying engine — headless Chrome + FFmpeg — with identical quality ceilings. The core difference is the authoring model:

| Aspect | [HyperFrames](https://github.com/heygen-com/hyperframes) | [Remotion](https://www.remotion.dev/) |
|--------|-------------|---------|
| Authoring format | HTML + CSS + data attributes | React components |
| Build step | None; .html runs directly | Bundler required |
| Agent friendliness | Very high — LLMs are natively fluent in HTML | Moderate — requires understanding JSX |
| Ecosystem maturity | Fast-growing (33k stars in 3 months) | Mature and stable, many production users |
| License | Apache 2.0 (fully open source) | Remotion License (source-available) |
| Sweet spot | Captions, overlays, marketing videos, agent-generated | Data-driven, programmatic social content |

Selection guidance:

- **Already shipping with Remotion?** Stay — no need to migrate
- **React-first team?** Remotion's learning curve pays back faster
- **Need AI agents to auto-generate video?** HyperFrames has no direct competitor
- **Starting from scratch with minimal dependencies?** HyperFrames needs only HTML + a renderer

## HeyGen's Open-Source Strategy

HyperFrames is Apache 2.0 with no per-render fees and no commercial-use restrictions. This isn't charity — it's precise ecosystem positioning:

- **HyperFrames** (open source) handles "rendering": HTML → MP4
- **HeyGen platform** (paid) handles "content generation": AI avatars, TTS, digital humans

The two complement rather than compete. Developers build video pipelines with free HyperFrames, then naturally connect to HeyGen's paid services when they need digital humans or voice synthesis. Open-source framework expands the ecosystem; paid platform captures demand — the same playbook Cloudflare used with its open-source Workers Runtime.

HeyGen has also open-sourced [hyperframes-launches](https://github.com/heygen-com/hyperframes-launches), publishing the composition source code for their own product launch videos — serving as both examples and community trust-building.

## Limitations and Caveats

- **Render speed**: Frame-by-frame capture is inherently slow — each frame requires a full page render and screenshot. AWS Lambda distributed rendering helps, but the base latency remains
- **Environment requirements**: Node.js 22+, FFmpeg, headless Chrome — deployment isn't trivial
- **Animation constraints**: All animations must be seekable. Animations depending on real time (`Date.now()`) or random numbers need adaptation
- **Young ecosystem**: Open-sourced in April 2026, third-party integrations and community plugins are still being established; the v0.7.x version number signals the API is still iterating rapidly

## The Big Picture

HyperFrames' core value isn't technical novelty — rendering video with headless Chrome + FFmpeg has been done before. Its value lies in **ecosystem positioning**: in an era where AI agents are becoming primary developers, aligning the video format with LLMs' most fluent language is a correct abstraction-level decision.

33k stars in 3 months isn't accidental — it appeared at the right time (agent-first toolchains maturing), chose the right format (HTML), used the right license (Apache 2.0), and shipped the right distribution channel (agent skills). If you're working on anything related to AI video generation, HyperFrames is currently the most important infrastructure to watch.

## References

- [HyperFrames GitHub](https://github.com/heygen-com/hyperframes) — Main repository, Apache 2.0
- [HyperFrames Official Docs](https://hyperframes.heygen.com/) — Full documentation and tutorials
- [hyperframes-launches](https://github.com/heygen-com/hyperframes-launches) — Open-source compositions from HeyGen's product launch videos
- [Remotion](https://www.remotion.dev/) — React-based video framework, main competitor
- [HyperFrames x HeyGen](https://help.heygen.com/en/articles/15001510-hyperframes-x-heygen) — Official integration guide
- [HTML to Video: How HyperFrames Solved AI Video Rendering](https://www.heygen.com/research/html-to-video) — HeyGen technical blog
- [Related: Using AI Agents with Video Generation Tools](/posts/ai/2026-05-10-ai-agent-video-generation) — Integration guide (in Chinese)

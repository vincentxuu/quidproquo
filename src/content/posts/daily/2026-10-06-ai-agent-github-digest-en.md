---
title: "AI Agent GitHub Digest — 2026-10-06"
date: 2026-10-06
category: daily
tags: [ai-agent, github, open-source, daily, mcp, agent-skill, coding-agent]
lang: en
description: "A set of eleven chained Claude skills that clone any app crossed 469 stars. The same batch brought an MCP that exposes Codex's built-in image generation to any agent, a local editor that turns an illustration into a blinking 2D avatar with a coding agent, and a local reader that translates papers into readable Chinese."
tldr: "**replica-skill** (469 stars) is eleven chained Claude skills that reverse-engineer an app, rebuild it, test it, read what its users actually hate and fix that, then deploy your clone live. **qiaomu-codex-imagegen** (91 stars) wraps Codex's built-in image generation — normally usable only inside Codex — into an MCP server, CLI, and skill any agent can call. **mesh-avatar-studio** (228 stars) has a coding agent read an illustration, auto-slice it into layers and rig it, then a local editor lets you fine-tune it into a 2D avatar that blinks, talks, and turns its head. **easyread** (803 stars) is a local paper reader that translates English PDFs into Chinese page by page, keeps equations typeset with KaTeX, and lets you flip back to the original text anytime. On the framework side, Mastra shipped @mastra/core@1.74.0 on 10/5, letting tools read the full conversation mid-execution and reshaping the Playground UI's trace pagination API (a breaking change)."
series:
  name: "AI Agent GitHub Digest"
  order: 52
---

> 🌏 [中文版](/posts/daily/2026-10-06-ai-agent-github-digest)

## Today's Highlight

The repos trending today sit in very different scenes — cloning a whole app, laying out translated papers, turning an illustration into a blinking avatar, picking a style direction for image generation — but they share the same move: taking a sequence of steps that used to require a pile of separate tools and folding it into a single pipeline an agent can walk through, instead of shipping yet another smarter general-purpose brain.

## Trending Repos

### replica-skill ⭐ 469 (3 days old)

[GitHub](https://github.com/Jakeschincariol/replica-skill) · Python · MIT

- **What it is**: Eleven chained Claude skills that walk through cloning any app — reverse-engineer it into a map of screens, flows, components, and data model; plan the stack and database; rebuild the design system; build the screens from the map; wire up auth and payments; click through every flow hunting for bugs; score your clone against the original; then name it, write the landing page, and deploy it to your own domain.
- **Why it's worth watching**: The author draws a deliberate line — clone the features and flows, never the original's code, branding, copy, or content — and includes a dedicated `/replica-entrepreneur` skill that reads real user reviews of the original app for what people actually hate, turning that into a list of fixes and a positioning angle for your version. That splits "cloning a roughly similar product" from "making something genuinely better than the original" into two separate jobs: the first is fast, the second is where the real difficulty still lives.
- **Stack**: Claude Code Agent Skills (installable as a plugin or by copying the skill folders directly) + Python 3.8+ tooling
- **Getting started**: Easy — paste the install command or install it as a plugin, no signup or API key required, though the eleven steps only work when run in order.

---

### qiaomu-codex-imagegen ⭐ 91 (2 days old)

[GitHub](https://github.com/joeseesun/qiaomu-codex-imagegen) · JavaScript · MIT

- **What it is**: Wraps Codex's built-in image generation — otherwise usable only from inside Codex — into an MCP server, a CLI, and an agent skill, so Claude Code, Cursor, or any agent that can run a command can turn "make me a cover image" into an actual file.
- **Why it's worth watching**: Most image-gen tools take a prompt and draw. This one runs the opposite way: the agent first proposes at least four mechanically distinct style directions (drawing from 24 built-in scene templates and 20 Mondo poster-artist styles), you pick one, and only then does it expand the full prompt and generate. The creative judgment call — which direction — stays with a human; assembling the prompt and checking the result is left to the agent, instead of letting the agent guess at a direction and commit to it alone.
- **Stack**: MCP server + CLI + Agent Skill sharing one core, calling Codex's built-in image engine underneath
- **Getting started**: Easy — add the MCP config and tell your agent what you want, though the image generation itself is tied to Codex.

---

### mesh-avatar-studio ⭐ 228 (2 days old)

[GitHub](https://github.com/shinshin86/mesh-avatar-studio) · TypeScript · MIT

- **What it is**: Turns a single illustration into an animated 2D avatar that blinks, talks, turns its head, breathes, and sways its hair. The pipeline has four steps: a coding agent (Claude Code or Codex) reads the image, checks how accurately it's reading coordinates, slices it into layers, and rigs it; then you fine-tune every control point in a local editor with a live preview; the agent reviews the result in fixed poses at the end.
- **Why it's worth watching**: Making this kind of riggable 2D avatar used to mean learning Live2D or hiring someone to cut the layers by hand. This project hands the tedious, precision-coordinate part — slicing layers and rigging a skeleton — to a coding agent, and keeps the part that needs a human eye — tuning it until it looks right — in a local editor with instant feedback. Project data all lives in a `projects/` folder that's never committed, and a bundled Miko sample lets you try the editor immediately.
- **Stack**: A local web editor (Node.js 22.17+) + Claude Code / Codex following a dedicated agent guide + a 2D mesh deformation engine
- **Getting started**: Medium — the local editor itself starts fast, but you need a coding agent set up and pointed at a dedicated agent guide to run the full pipeline; a front-facing half-body PNG with a transparent background works best.

---

### easyread ⭐ 803 (5 days old)

[GitHub](https://github.com/Edwardxlai/easyread) · Python · MIT

- **What it is**: A locally-run reader for English papers that imports a PDF, translates it into Chinese page by page, typesets equations with KaTeX to match the original layout, renders tables properly, lets you flip back to the source text at any point, and includes a sidebar where you can highlight a passage and ask an AI (Claude, GPT, DeepSeek, Tongyi, or a local Ollama model) about it.
- **Why it's worth watching**: What separates this from "dump the PDF into a translator" is that it keeps the faithful translation and the AI's commentary visually apart — the body text is only ever the translation, and the model's explanations live in the margin, so you always know which sentence is the paper's and which is the model's gloss. Highlighted passages can be asked about directly, which is closer to how people actually read papers than a straight translation tool.
- **Stack**: Local PDF parsing + KaTeX equation typesetting + multi-model APIs (Claude / GPT / DeepSeek / Tongyi / Ollama)
- **Getting started**: Easy — download the prebuilt release and run it; your library defaults to local storage but can point at a cloud-sync folder instead.

## Notable Releases

### Mastra @mastra/core@1.74.0

[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.74.0)

- **Key changes**: Tools can now call `context.agent.getMessages()` during execution to read the full current conversation, including remembered messages and whatever the agent has already said this turn, without the caller manually stuffing it into the tool's input. Observational Memory's history search gained group filtering by `groupId`, configurable sort direction, and direct lookup by `recordId`. The Playground UI shipped a new set of accessible form primitives (`Field` / `Fieldset` / `Form` / `SearchInput`).
- **Breaking changes**: `@mastra/playground-ui` removed `anchorTraceId` from `ThreadViewByTrace`, `TraceThreadPanel`, and `ThreadTrace`, along with `ThreadTrace.LoadMoreSentinel` — pagination is now driven by `pageSize` and `onLoadOlder` instead.
- **What it means for you**: If a tool needs to know what the agent has already said this turn — say, to avoid calling the same API twice — it can now read `context.agent.getMessages()` directly instead of threading the conversation through manually. If you built a custom trace panel on top of Playground UI, swap `anchorTraceId` for `pageSize` / `onLoadOlder`.

---

## Today's Takeaway

I used to assume that handing a whole workflow to an agent only worked for tasks that were already text-shaped, like writing code. These four projects are a reminder that even tasks loaded with visual judgment and manual fine-tuning — cloning an app, turning an illustration into an avatar — can be split the same way: let the agent do the tedious part, keep a human for the judgment call. The tedious part turns out to have a much lower bar than I assumed; what's actually valuable is that last pass of human taste or business judgment.

## References

- [Jakeschincariol/replica-skill](https://github.com/Jakeschincariol/replica-skill)
- [joeseesun/qiaomu-codex-imagegen](https://github.com/joeseesun/qiaomu-codex-imagegen)
- [shinshin86/mesh-avatar-studio](https://github.com/shinshin86/mesh-avatar-studio)
- [Edwardxlai/easyread](https://github.com/Edwardxlai/easyread)
- [GitHub Trending (daily)](https://github.com/trending?since=daily)
- [Mastra @mastra/core@1.74.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.74.0)

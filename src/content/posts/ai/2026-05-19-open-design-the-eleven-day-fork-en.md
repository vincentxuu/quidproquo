---
title: "Open Design: The Open-Source Claude Design Alternative Forked in 11 Days"
date: 2026-05-19
type: deep-dive
category: ai
tags: [open-design, claude-design, anthropic, agent-cli, claude-code, mcp, open-source]
lang: en
tldr: "Anthropic shipped Claude Design on 2026-04-17. On 4-28, nexu-io/open-design went public -- same artifact-first loop, Apache-2.0, runs on the 16 coding-agent CLIs you already have. Two weeks from 0.1 to 0.7, 40k+ stars. A paradigm shift that flattens AI design tools from vertical SaaS into a skill bundle."
description: "An introduction to Open Design (nexu-io): comparison with Claude Design, Skill/DESIGN.md architecture, daemon + MCP design, 217 skills x 149 design systems, and who it is (and isn't) for."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-19-open-design-the-eleven-day-fork)

On 2026-04-17, Anthropic shipped Claude Design: powered by Opus 4.7, you prompt it and get prototypes / decks / one-pagers out, available as a research preview for Claude Pro subscribers and above. Eleven days later (2026-04-28), the nexu-io team pushed `open-design` to GitHub -- same artifact-first loop, Apache-2.0, local-first, running on the 16 coding-agent CLIs you already have. In two weeks it went from v0.1.0 to v0.7.0, racking up 40,000+ stars (per TechTimes 2026-05-17), making it one of the fastest-moving developer tools this year.

This post breaks down its design trade-offs, how it differs from Claude Design, and what structurally happened to the "AI design tools" category in those 11 days.

> ⚠️ Naming disambiguation up front: this article covers **nexu-io/open-design** (domain: opendesigner.io). Do not confuse it with `opendesign.dev` (Avocode/Ceros's design file parsing SaaS, sunset on 2023-10-01), `opendesigndev/open-design-engine` (the C++ rendering engine left behind by the former Avocode), or the Open Design Alliance (a CAD interoperability consortium).

## The Problem It Solves

It takes the "prompt to design artifact" pipeline and **strips it out of a proprietary SaaS, flattening it into composable files**.

Claude Design proved that "LLMs don't write text -- they output design artifacts directly" is a viable path, but it's closed-source, cloud-only, locked to Anthropic models, and locked to Anthropic subscriptions (Pro at $20/month minimum). OD (Open Design) built the same loop eleven days later -- but every layer is a file, it runs on coding-agent CLIs you already have, and it's local-first.

The official line: "Same loop. Same artifact-first mental model. None of the lock-in."

## Key Design Decisions

### 1. No Bundled Agent -- Detects 16 CLIs via PATH

On startup, OD scans PATH and turns Claude Code, Codex CLI, Cursor Agent, Gemini CLI, OpenCode, Qwen Code, Qoder CLI, GitHub Copilot CLI, Devin Terminal, Hermes, Kimi, Kiro, Kilo, Mistral Vibe, DeepSeek TUI, and Pi into candidate design engines.

No CLI? That's fine too: `POST /api/proxy/stream` accepts any OpenAI / Azure / Google compatible endpoint (DeepSeek, Groq, OpenRouter, self-hosted vLLM all work).

The design trade-off is straightforward -- users have typically already paid for a Claude Code Max or Cursor subscription, so they already have a token budget. Design generation is effectively tacked on "for free" with no extra bill. **The cost** is that non-engineering users can't get in: if running `pnpm dev` feels like too much, OD isn't for you.

### 2. A Skill Is a Folder, Not a Plugin

Each skill is just `SKILL.md` + `assets/` + `references/`, [fully compatible](/posts/ai/2026-05-08-anthropic-claude-skills-guide) with Claude Code's skill format. Drop a folder into `skills/`, restart the daemon, and it shows up in the picker.

OD takes this rule to its logical conclusion -- the upstream op7418 `guizang-ppt-skill` is **bundled verbatim** into `skills/guizang-ppt/`, with the original LICENSE fully preserved. A deck engine is 36 themes, 31 layouts, 47 animations, and 14 templates, all as files.

Compare this to Lovable, v0, and Bolt where "a skill is a vendor's internal prompt template": OD lays skills out on the file system, authors can modify or fork them, and users can audit them.

### 3. Design System = 9-Section Markdown

Not a theme JSON. Not design token tooling. `DESIGN.md` is a nine-section fixed structure: color, typography, spacing, layout, components, motion, voice, brand, anti-patterns. Ships with 149 prebuilt systems (Linear, Stripe, Vercel, Apple, Notion, Tesla, Airbnb, Cursor, Supabase, Figma, Spotify...).

Switching design systems means the daemon injects a different `DESIGN.md` into the prompt stack, and the artifact immediately renders with the new tokens.

**Trade-off not taken**: no strict schema validation, no typed design token tooling -- design system consistency relies on reviewer oversight.

### 4. Turn-1 Forced Question Form

Per the official `apps/daemon/src/prompts/discovery.ts` design, OD doesn't let the model free-associate on the first turn -- it emits a `<question-form>` first, requiring the user to select across five dimensions: surface (landing / dashboard / mobile?), audience, tone, brand, and scale.

These six-dimensional checkboxes block the "model draws a random cartoon illustration, user has to redirect" waste pattern. When there's no brand spec, five visual direction pickers serve as fallback (each direction is a deterministic OKLch palette + font stack).

### 5. Anti-AI-Slop Machinery

OD's anti-slop mechanism borrows from the upstream `huashu-design` project: 5-dimension self-critique, P0/P1/P2 checklists, and `anti-ai-slop.md` craft reflection. Every skill runs a 5-dimension self-evaluation before emitting an artifact; if it doesn't pass the threshold, it self-revises.

Hardcoded no-go zones in the prompt stack: purple gradients, generic emoji icons, using Inter as a display font -- the three cardinal sins of LLM designers.

### 6. Real File System + MCP

OD's local daemon exposes real `Read` / `Write` / `Bash` / `WebFetch` to the agent. Artifacts land directly as `.html` / `.png` / `.mp4` files, with SQLite storing projects and conversations.

The smarter move is `od mcp`: starting from v0.4.0, OD exposes a read-only MCP server that Cursor / Zed / Windsurf / Claude Code can read directly from your OD project. This means OD isn't an information silo -- it's actually a design context source for your other agents.

> Security model in one sentence: the daemon binds to `127.0.0.1` by default; LAN exposure requires explicit opt-in via `OD_BIND_HOST`; the MCP server is read-only; prompts and generated content route to your chosen LLM provider (Anthropic / OpenAI's own policies still apply); OD itself collects no telemetry.

## Comparison with Claude Design

Based on the WotAI 2026-04-29 evaluation:

| Dimension | Claude Design | Open Design |
|---|---|---|
| License | Closed | Apache-2.0 |
| Form factor | Hosted (claude.ai) | Web + local daemon (deployable on Vercel) |
| Runtime | Locked to Opus 4.7 | 16 CLI adapters + OpenAI-compat BYOK proxy |
| Pricing | Pro $20 / Max $100-200 / Team / Ent | Free; you pay for your CLI's tokens |
| Design source | Reads your codebase + design files | 149 prebuilt `DESIGN.md` files |
| Export | PDF / URL / PPTX / Canva | HTML / PDF / PPTX / MP4 / ZIP |

Two structural differences:
1. **Claude Design**: automatically absorbs design style from your codebase ✅; **OD**: relies on prebuilt design systems as a starting point ⚠️
2. **OD**: swappable models, files stay local, can pipe into other agents via MCP ✅; **Claude Design**: hosted simplicity but no swapping ❌

## Who It's For (and Who It Isn't)

**Good fit:**
- Engineers already paying for Claude Code Max / Cursor / Codex subscriptions who want to redirect a bit of their token budget toward generating decks / landing pages
- Client work under NDA where artifacts must stay on local machines
- Those who want to use Linear / Stripe / Vercel / Notion / Apple-style prebuilt design systems as a starting point
- Those who want to customize skills (industry-specific design types) and drop them back into `skills/`
- Those who want to pipe design generation into Cursor / Zed / Windsurf -- `od mcp` is the shortest path for this use case

**Not a good fit:**
- Non-engineering founders / PMs who'd get stuck at `pnpm dev` -- just buy Claude Design Pro
- Clients requiring design fidelity that "exactly matches our existing components" -- Claude Design's codebase reading is currently stronger here
- Need Canva one-click handoff -- Claude Design has it, OD doesn't
- Need production-grade SLA -- at 0.x with a minor release every two to three days, it's too early

## How to Use It

```bash
git clone https://github.com/nexu-io/open-design.git
cd open-design && pnpm install
pnpm tools-dev run web
```

Requires Node ~24 and pnpm 10.33.x. On first run it creates `.od/` in the current directory (SQLite + per-project artifacts). No init step needed.

To import an existing Claude Design project: drag the ZIP into the welcome dialog. `POST /api/import/claude-design` unpacks it into a local project, and the agent picks up where you left off.

Desktop builds are available: `open-design-0.7.0-mac-arm64.dmg`, `open-design-0.7.0-win-x64-setup.exe` (unsigned), and Linux AppImage.

## Limitations / Known Issues

- **Still 0.x**: seven releases in two weeks; breaking changes are expected. v0.4.0 once crashed the DB migration due to a daemon issue (fixed in 0.4.1)
- **Large catalog but no strict schema**: consistency across 149 `DESIGN.md` files relies on manual review
- **Privacy is not "fully local"**: prompts and generated content route to your chosen LLM provider; OD itself collects no telemetry, but Anthropic / OpenAI / your vLLM's policies still apply -- the team explicitly documents this trade-off
- **Windows build is unsigned** -- enterprise environments may block it
- Design fidelity for "auto-absorbing your existing components" hasn't surpassed Claude Design yet

## The Big Picture: Vertical SaaS to Skill Bundle Paradigm Shift

The most interesting thing about these 11 days isn't OD itself or the 40k stars -- it's that the "AI design tools" category **was commoditized into a skill bundle within 11 days**.

A few years ago, design tools were a category with moats (canvas, component library, team collaboration, file formats). Claude Design extended this into AI-native territory. OD demonstrated 11 days later: the AI-native version of a design tool isn't a category -- it's a skill bundle that can be dropped directly into the agent runtime you're already paying for.

This pattern mirrors what workflow automation, code review, and content generation have gone through over the past two years -- vertical SaaS defines the shape first, an OSS equivalent appears faster than anyone expected, proving that "the underlying capability was always portable." The condition for hosted products to survive is having integration depth or UX that the OSS alternative can't match -- Claude Design's "reads your codebase" is that kind of moat, but it's not a moat for the entire category.

The practical impact for engineers: if you're already paying for an agent CLI subscription, your default assumption should shift from "I need another design tool" to "which skill bundle does my CLI need to design?" Sometimes the answer is still "buy the hosted product," but the default has flipped.

## References

- [nexu-io/open-design GitHub repository](https://github.com/nexu-io/open-design)
- [Open Design official site (opendesigner.io)](https://opendesigner.io/)
- [Open Design v0.7.0 release notes (newreleases.io)](https://newreleases.io/project/github/nexu-io/open-design/release/open-design-v0.7.0)
- [Anthropic Claude Design announcement (Anthropic Labs)](https://www.anthropic.com/news/claude-design-anthropic-labs)
- [Claude Design vs Open Design (WotAI 2026-04-29 evaluation)](https://wotai.co/blog/claude-design-vs-open-design)
- [Open-Design 40k stars coverage (TechTimes 2026-05-17)](https://www.techtimes.com/articles/316749/20260517/open-design-free-local-alternative-claude-design-20-plan-runs-16-ai-agents.htm)
- [Open Design Explained: Turning Claude Code and Codex into AI Design Tools (knightli.com)](https://www.knightli.com/en/2026/05/18/open-design-open-source-claude-design-alternative/)
- [Anthropic Claude Skills Official Guide (on-site)](/posts/ai/2026-05-08-anthropic-claude-skills-guide)

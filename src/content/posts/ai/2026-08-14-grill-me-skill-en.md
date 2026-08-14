---
title: "grill-me: The Skill That Interrogates You Until a Vague Idea Becomes a Commitment"
date: 2026-08-14
category: ai
type: deep-dive
tags: [claude-code, agent-skills, prompt-engineering, spec-driven, context-engineering]
lang: en
tldr: "Matt Pocock's grill-me is now a single line — 'Run a /grilling session'. The real mechanism lives in grilling: model the subject as a decision tree, ask only the questions on the current frontier, roughly 13 questions across 3 rounds, and an empty frontier still isn't the end until you confirm shared understanding."
description: "A breakdown of the grill-me and grilling skills: the four-line original versus today's primitive, the design tree / frontier / round model, the split between facts and decisions, the confirmation gate, and the two acknowledged failure modes — passivity and ungrillable questions."
draft: false
glossary:
  - term: "frontier"
    definition: "The ring of decisions on the tree whose prerequisites are all settled — the only questions that can honestly be asked right now without guessing at answers nobody has given yet."
    context: "Each grilling round asks the whole frontier at once, then recomputes it from your answers."
  - term: "ungrillable"
    definition: "A question talking cannot settle, such as 'how should this interaction feel?' — it needs something concrete to react to."
    context: "The official advice is to stop grilling, build a throwaway prototype, and come back to answer it in one line."
  - term: "disable-model-invocation"
    definition: "An Agent Skill frontmatter field; when true, only the user can trigger the skill and the model will never reach for it on its own."
    context: "grill-me sets it to lock itself as a manual-only entry point, while the underlying grilling stays model-invoked."
---

> 🌏 [中文版](/posts/ai/2026-08-14-grill-me-skill)

Most agent skills teach the agent how to do something. [grill-me](https://www.aihero.dev/skills-grill-me) inverts that: the whole session is the agent questioning you, writing no code and leaving no files behind. It targets the phase before you start — you roughly know what you want but cannot state it precisely, so you let the agent press until you can commit. This post breaks down its actual source (the current version is one line), the round/frontier mechanism in the `grilling` primitive underneath, and the two failure modes the docs themselves acknowledge.

## The original: four lines that went viral

The `grill-me` [Matt Pocock](https://www.aihero.dev/my-grill-me-skill-has-gone-viral) first published was this, in full:

```md
---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared
understanding. Walk down each branch of the design tree, resolving dependencies
between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.
```

Four constraints carry the whole skill: one question at a time, a recommended answer attached to each, look up anything you could look up instead of asking, and walk the tree resolving dependencies as you go. Pocock notes the recommendation line was a later addition:

> "This skill is incredibly short - just a few lines that pack a powerful punch. I recently added the 'provide your recommended answer' line. When the AI asks a question with an obviously good answer, it now recommends that answer."
> — [My 'Grill Me' Skill Went Viral](https://www.aihero.dev/my-grill-me-skill-has-gone-viral)

The difference is that most of the time you answer "yes" instead of re-explaining yourself. He puts a typical session at about 45 minutes — rubber ducking, automated, except this duck talks back.

## After the rewrite: grill-me is one line

Here is `grill-me` as it exists in the [mattpocock/skills](https://github.com/mattpocock/skills) repo today, in full:

```md
---
name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true
---

Run a `/grilling` session.
```

(This post is pinned to `main` as of 2026-08-13. The repo is under active change; last touched dates are `grill-me/SKILL.md` 2026-06-12, `grilling/SKILL.md` 2026-07-31 when the round-based rewrite landed, and the official usage notes 2026-08-06.)

Two design decisions hide in those five lines.

`disable-model-invocation: true` means **only you can fire it by typing `/grill-me`; the agent never reaches for it on its own**. That is necessary for a skill that may ask you forty questions — you do not want it surfacing while you are mid-hotfix asking you to align on vision.

The actual logic moved into `grilling`, positioned in the docs as the single source of truth for the interview technique so that `grill-with-docs`, `wayfinder`, and `triage` all call it instead of each inventing their own. The cost: **installing `grill-me` without `grilling` gets you nothing**. The docs name the tell precisely — a session that asks everything at once with no recommendations attached is the model improvising an interview, not running this one.

## Design tree, frontier, round

`grilling` introduces machinery the original did not have. From its SKILL.md:

> "Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled — the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer."
> — [grilling/SKILL.md](https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grilling/SKILL.md)

Three terms do the work:

- **design tree** — the subject modeled as decisions with decisions hanging off them.
- **frontier** — the decisions whose prerequisites are all settled, the only ones that can honestly be asked yet.
- **round** — one frontier, asked in full and answered in full.

So the default changed from one question at a time to one round at a time. The published magnitude is about 13 questions across 3 rounds, with 46 questions over 4 rounds described as an ordinary session; the health metric is **count rounds, not questions**. The question format is fixed, which is what makes a round answerable by number:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

The most common objection is that asking a whole round at once must lose the questions your earlier answers would have raised. The frontier is the answer to it: questions in the same round do not depend on each other, so no answer within a round can invalidate another question in it. Everything affected is downstream, and the next round is recomputed rather than pre-written.

The docs are also honest about the limit: **the frontier is the agent's judgement, not a computed graph**. It can put two questions in one round and only afterwards discover one answer should have changed the other. There is no guard beyond telling it, which reopens that branch next round.

Want one question at a time back? It is supported rather than tolerated — add one line to your global `CLAUDE.md`:

```
When grilling, ask one question at a time.
```

The docs note that people who read slowly, work in a second language, or use the sequential rhythm as focus scaffolding all report the one-at-a-time format is better for them. (The short-lived `batch-grill-me` was folded into `grilling`; there is nothing left to install.)

## Facts are the agent's job, decisions are yours

This is the single most portable rule in the skill:

> "Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it — don't ask the user for anything you could look up yourself."

Lookups do not block the round: a running exploration counts as an unsettled prerequisite, so only the questions downstream of it wait while the rest of the frontier is asked now. Decisions are the opposite — they must be put to you, and it must wait. The docs draw the line hard: **an agent that answers its own decisions has broken the skill, not interpreted it liberally**.

The session does not end when the questions do, either. An empty frontier is necessary but not sufficient; it is finished when you say the understanding is shared. The docs admit this gate gets skipped on weaker and lower-effort models, which collapse "interview until shared understanding" into a couple of questions and an outline. Hence the related advice: grilling leans on model quality more than most skills, so give it your best one — implementation tolerates a cheaper model.

## Two failure modes

**Passivity** is the main one, and it disguises itself as productivity:

> "The failure mode is **passivity** — answering 'agreed, agreed, agreed' for forty questions and coming out with a plan the agent wrote and you nodded at. It feels productive because it was long. Nothing was actually decided, and the result carries a certainty it hasn't earned."

The health check is a good one: **a session with no pushback from you is a session you did not need**. The other signals are later rounds visibly building on earlier answers, ending somewhere you did not expect, and being able to defend each choice afterwards to someone who was not there.

**Ungrillable questions** are the second. "One long form or three pages?" and "how should this interaction feel?" cannot be settled by talking; they need something to react to. Pushing on anyway has a specific cost — the agent keeps rephrasing, you keep guessing, and the scope grows to fill the uncertainty. Stop, build the throwaway version with `prototype`, look at it, then answer in one line.

Two hundred questions usually means the scope was too large: have the agent break the work into pieces and grill each one. Very long sessions also fill the context window until the questions themselves get worse. And there is deliberately **no question cap** — some plans need three questions and some need fifty, so a fixed ceiling either truncates the hard case or feels arbitrary on the easy one.

## Where it sits in the family

```
                 grilling  (model-invoked, the interview mechanism)
                     ↑
      ┌──────────────┼──────────────┬─────────────┐
   grill-me    grill-with-docs   wayfinder      triage
  (stateless)   (writes           (too big for   (grills a vague
   no repo       CONTEXT.md        one session)   report into a
   needed        and ADRs)                        workable one)
                     ↓
                  to-spec → implement
```

| What you have | Reach for |
|---|---|
| Anything at all — no repo, not necessarily software | [grill-me](https://www.aihero.dev/skills-grill-me) (stateless, writes nothing) |
| A codebase to align against | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) (stateful, writes `CONTEXT.md` and ADRs) |
| An effort too big for one session | [wayfinder](https://aihero.dev/skills-wayfinder) (charts a map, grills inside decision tickets) |
| A question talking cannot settle | [prototype](https://aihero.dev/skills-prototype) (build the throwaway version) |
| A grilled idea that needs a spec | [to-spec](https://aihero.dev/skills-to-spec) — and **do not start a fresh session** |

That last point deserves its own line: the value of the session is the context you just built, so hand the same conversation straight to `to-spec`. The docs also recommend **leaving plan mode off** during grill-me — plan mode primes the agent to rush toward producing a plan, which is the opposite of staying in inquiry.

## Install, license, and install counts you should not trust

Two official paths:

```bash
# Claude Code (plugin)
claude plugins install mattpocock-skills

# Codex and other agents
npx skills@latest add mattpocock/skills
```

Then run `/setup-matt-pocock-skills` once per repo. The set is MIT licensed (`Copyright (c) 2026 Matt Pocock`), which is why derivatives are everywhere: [stevegsax/grill-me](https://github.com/stevegsax/grill-me) added a session file so an interview can be resumed (now archived), [alirezarezvani's version](https://alirezarezvani.github.io/claude-skills/skills/engineering/grill-me/) bolts on Python scripts for decision-tree extraction and question generation, and most repos — [petekp/claude-code-setup](https://github.com/petekp/claude-code-setup/blob/main/skills/grill-me/SKILL.md) among them — still carry the four-line original. Which is the warning: the `grill-me` you find online has a decent chance of being the early-2026 version.

As for popularity numbers, **do not trust them**. One skill directory gives conflicting install counts across its own pages (460,658 / 509k / 812k / 833k all appear), and one page claims the repo has "121,024 GitHub stars". These are aggregator-generated figures I could not verify independently — the GitHub API was blocked by the proxy in the environment used for this research. The defensible claim is qualitative: it is the most widely circulated planning skill right now, and its source is short enough to read in thirty seconds and judge yourself.

## Overall

What makes `grill-me` worth studying is not the prompt. It is that the interview was extracted into a primitive other skills can call, with two hard lines drawn inside it: facts belong to the agent, decisions belong to the human, and nothing gets acted on without your confirmation. Both lines generalize to any agent workflow, not just planning.

The cost is equally honest. A session wants forty minutes of your attention, and you have to actually argue inside it. If you only intend to nod, the plan you walk out with is the agent's opinion rather than yours — and it will read as confident, with nothing behind the confidence.

Related on this site: [Claude Skills: Package Domain Knowledge into a Folder](/posts/ai/2026-05-08-anthropic-claude-skills-guide-en), [Skill vs Subagent: Comparing Two Agent Collaboration Modes in Claude Code](/posts/ai/2026-03-30-skill-vs-subagent-comparison-en), [The Protocol Layer: MCP, A2A, ACP, Skills](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en).

## References

- [The /grill-me Skill — AI Hero](https://www.aihero.dev/skills-grill-me)
- [The /grilling Skill — AI Hero](https://www.aihero.dev/skills-grilling)
- [My 'Grill Me' Skill Went Viral — AI Hero](https://www.aihero.dev/my-grill-me-skill-has-gone-viral)
- [mattpocock/skills (GitHub)](https://github.com/mattpocock/skills)
- [grill-me/SKILL.md source](https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grill-me/SKILL.md)
- [grilling/SKILL.md source](https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grilling/SKILL.md)
- [docs/productivity/grill-me.md (official usage notes)](https://github.com/mattpocock/skills/blob/main/docs/productivity/grill-me.md)
- [stevegsax/grill-me (variant, archived)](https://github.com/stevegsax/grill-me)
- [The grill-me variant in alirezarezvani/claude-skills](https://alirezarezvani.github.io/claude-skills/skills/engineering/grill-me/)
- [grill-me in petekp/claude-code-setup (original version)](https://github.com/petekp/claude-code-setup/blob/main/skills/grill-me/SKILL.md)

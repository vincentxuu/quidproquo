---
title: "How Agents Accumulate Team Judgment: Warp's Skill Feedback Loop"
date: 2026-08-29
type: deep-dive
category: ai
tags: [ai-agent, claude, warp, skills, workflow, automation]
lang: en
tldr: "Warp's self-improving agent pattern is not about dumping every mistake into a prompt. A base skill does the work, humans leave feedback in GitHub or Slack, an improver skill turns repeated signals into a small diff, and humans review the PR before the next run inherits it."
description: "A practical reading of Anthropic and Warp's public writing on self-improving agents: base skills, improver skills, human feedback, PR review, and what the pattern means for Codex and Claude Code skill workflows."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-29-self-improving-agent-skills)

[Anthropic's August 26, 2026 Warp case study](https://claude.com/blog/how-warp-builds-self-improving-agents-on-claude) is framed as a story about self-improving agents. The useful part is more specific: Warp does not treat learning as an ever-growing prompt, and it does not dump every human correction into memory. It turns team judgment into a reviewable, reversible file change.

That distinction matters. Many agent workflows get stuck in the same place: the first run looks useful, then the second and third runs become annoying. A code review agent leaves comments nobody cares about. An issue triage agent applies the wrong label. A Slack reply agent sounds slightly off. A spec writer misses the boundary the team actually cares about. The obvious fix is to keep rewriting the prompt. Warp tried that too, then found that it did not scale. A longer prompt is not learning. It is often just yesterday's failure carried into tomorrow's run.

Warp's move is to separate "doing the work" from "learning how the work should improve."

## Two Skills, Not One Large Prompt

Anthropic describes Warp's system as three pieces: a base skill, human feedback, and an improver skill.

The base skill is the instruction set used by the inner agent. It handles a concrete task: code review, spec writing, GitHub issue triage, or social-response drafting. This layer does not need to know how to evolve itself. It needs to do the task and leave its output somewhere humans already work.

Human feedback is the middle layer. The important signal is not just approval or disapproval; it is the reason. In issue triage, a maintainer might replace the agent's `ready-to-implement` label with `needs-info` and explain that the request does not yet state the underlying user problem. In a Slack workflow, the team might rewrite the draft or leave a thread note saying the reply sounds too much like marketing copy.

The improver skill is the instruction set used by the outer agent. It runs on a cadence, reads a batch of prior feedback, finds reusable lessons, edits the base skill, and opens a PR. Because skills are files, the change becomes a Git diff. A human reviews and merges it. Only then does the next base-skill run inherit the improvement.

The loop looks like this:

```text
new work item
    |
    v
base skill agent  ---> output in GitHub / Slack / PR
    |                              |
    |                              v
    |                       human feedback
    |                              |
    v                              v
interaction records ----> improver skill agent
                                  |
                                  v
                         small skill diff / PR
                                  |
                                  v
                            human review
                                  |
                                  v
                         next base skill run
```

The safety boundary is the important part. The agent may propose an improvement, but it does not silently change production behavior. Durable learning goes through Git, review, and rollback.

## The Hard Part Is Generalizing From Corrections

[Warp's Buzz article](https://www.warp.dev/blog/agents-need-feedback-loops-not-perfect-prompts) states the hardest point plainly: feedback is not learning unless the agent can generalize.

Suppose a human says, "This reply sounds too marketing-y." A weak improver might add a rule: never mention pricing in the first sentence. That looks useful, but it overfits the last example. The next user may not mention pricing at all; they may simply be frustrated that the product broke. The agent can still make the same underlying mistake by leading with a feature pitch.

A better principle is: when someone is venting, lead with empathy and the concrete problem before pitching anything. That transfers. It does not turn one mistake into a permanent ban. It writes down how the team reasons.

So the outer improver's real job is not editing Markdown. That is the easy part. Its real job is deciding:

- Was this a one-off error or a repeated class of error?
- What reason sits behind the human correction?
- Does the current skill already contain the right idea, but in unclear language?
- Should the improver add a principle, sharpen one, or delete a conflicting one?
- Will the change make the skill bloated enough to reduce quality later?

That is why the improver is a separate skill. Doing the work is one capability. Turning human feedback into stable procedural knowledge is another.

## The Demo Repo Has The Useful Guardrails

[Warp's implementation article](https://www.warp.dev/blog/self-improvement-loop-for-skills) links to a GitHub issue triage demo. The blog gives the concept; the repo's [triage-issue skill](https://raw.githubusercontent.com/warpdotdev-demos/issue-triage-loop/main/.agents/skills/triage-issue/SKILL.md) and [improve-triage-skill](https://raw.githubusercontent.com/warpdotdev-demos/issue-triage-loop/main/.agents/skills/improve-triage-skill/SKILL.md) show why the pattern is not just a toy.

The base skill leaves deliberate hooks:

- Each triage comment starts with a hidden marker such as `<!-- oz-triage v:1 -->`, so the improver can later identify which skill version made the decision.
- The comment footer asks people to react or reply with corrections, keeping feedback inside GitHub Issues.
- The skill has a `## Learned guidelines` section reserved for validated future lessons.
- Each update bumps the version, so later analysis can tie behavior to the skill revision that produced it.

The improver skill is even more important. It inspects issues updated in the last 14 days, up to 100 issues. It looks at comment reactions, human replies after the triage comment, current label drift, and duplicate accuracy. It weighs signals differently: maintainer relabels and explicit correction replies are strong, reactions are moderate, and silence is only weakly positive.

The best rule is also the most conservative one: if signals are weak or conflicting, make no change. An empty run is a valid result.

That is mature. Many automation systems feel pressure to produce something on every schedule. For skills, learning nothing is often better than learning the wrong thing. One bad guideline can affect every future task.

## Skills Should Be Maintained Like Code

The strongest part of Warp's approach is not that an agent can edit its own instructions. It is that instruction edits become a normal engineering process.

Once a skill determines agent behavior, it is no longer just prose. It is closer to a test suite, linter, CI config, or production setting. A small text change can alter many future outputs. It deserves version history, review, rollback, evidence, and a clear change description.

That is the opposite of endlessly extending a prompt. The problem with a long prompt is not only token cost. It is maintenance: which rule came from which incident? Which rule is stale? Which two rules contradict each other? Did the model get worse because it lacked context, or because the prompt now pulls in three directions at once?

Skill files at least give those questions a place to be handled. A good improver PR should not say only "improve prompt." It should state:

- which cases it reviewed;
- which human feedback counted as evidence;
- where the old skill was insufficient;
- which principle was added, changed, or removed;
- why the principle generalizes beyond one issue.

That kind of PR may be small, but it turns implicit team taste into a project asset.

## What This Means For Codex And Claude Code Skills

The biggest lesson for me is: do not start with a fully automatic self-improvement system. Start with a feedback ledger.

In a content-heavy repository, human corrections often look like this:

- "Daily content is not only papers": the research skill's scope is too narrow.
- "Not every project uses make": implementation skills should not assume the build tool.
- "Some posts have already been published": progress notes must not override tracked frontmatter.
- "Structural checks are not benchmark evidence": verification skills need to distinguish format validity from experimental validity.

If those corrections stay only in chat history, the next agent can easily repeat them. But each sentence also should not be pasted into a skill as-is. A better first step is a ledger:

```text
feedback:
  source: user correction
  observed_failure: treated daily digest as paper-only
  affected_skill: daily-digest
  proposed_principle: define the content population before selecting sources
  evidence: repeated scope correction
  action: propose skill diff only if same failure appears again
```

Once the ledger has enough signal, an improver agent can summarize it. Its output should not be a silent skill rewrite; it should be a reviewable diff. For this repository, there is also a hard source-of-truth boundary: `.agents/skills/` is the editable source, and `.claude/skills/` is generated by sync. An improver must edit the source skill and then run the sync step.

That keeps the useful part of learning while avoiding an unbounded rule-mutating system.

## Where This Pattern Does Not Fit

This pattern is not right for every task.

It is not worth it when the task does not repeat. A one-off research note, a single bug fix, or a one-time document cleanup usually does not need an outer loop. A short retrospective is enough.

It is also a poor fit when there is no trustworthy feedback source. Letting everyone press thumbs up or thumbs down is not the same as having a quality signal. Warp's demo gives more weight to maintainer relabels and explicit corrections than generic reactions. Without that weighting, an agent can drift toward low-quality feedback.

It is a poor fit when the domain is verifiable but the team uses human taste anyway. Anthropic's article makes the same point: if the domain can be checked, build the verification harness first. Code review comments, labels, and writing tone may need human judgment. Builds, lint, typechecks, and benchmark replays should not become vibes.

Finally, it is a poor fit if the team has no review capacity. A daily PR sounds impressive until nobody reads it. A weekly cadence with two or three evidence-backed principles, plus permission to produce no diff, is often healthier.

## Self-Improvement Is Actually Conservative

Warp's loop sounds like "agents improving themselves," but the implementation is conservative.

It refuses to change production behavior silently. It refuses to write weak signals into the skill. It refuses unlimited learned guidelines. It refuses to turn one correction into a permanent rule. It refuses to treat memory as procedural knowledge. It refuses to skip human review.

So the practical lesson is not "let's build agents that rewrite their own prompts." A more accurate version is:

> If agent learning enters a team workflow, it should be maintained like code.

The base skill does the work. Human feedback stays where work already happens. The improver skill turns repeated feedback into small, reviewable principles. A Git PR decides whether those principles become the next version of behavior. This is not flashier prompt engineering. It is team judgment turned into maintainable infrastructure.

## References

- [Anthropic: How Warp builds self-improving agents on Claude](https://claude.com/blog/how-warp-builds-self-improving-agents-on-claude)
- [Warp: How to build a self-improvement loop for your Skills](https://www.warp.dev/blog/self-improvement-loop-for-skills)
- [Warp: Agents Need Feedback Loops, Not Perfect Prompts](https://www.warp.dev/blog/agents-need-feedback-loops-not-perfect-prompts)
- [Warp demo: triage-issue skill](https://raw.githubusercontent.com/warpdotdev-demos/issue-triage-loop/main/.agents/skills/triage-issue/SKILL.md)
- [Warp demo: improve-triage-skill](https://raw.githubusercontent.com/warpdotdev-demos/issue-triage-loop/main/.agents/skills/improve-triage-skill/SKILL.md)
- [Claude Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [On this site: Claude Code Skills design guide](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide-en)

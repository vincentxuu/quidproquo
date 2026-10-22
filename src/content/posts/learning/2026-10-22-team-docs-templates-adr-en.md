---
title: "Writing for Colleagues: How-to Templates, Decision Records, and Writing Less"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, wiki, documentation, adr]
lang: en
tldr: "Getting team documents to look alike and make sense takes two templates and one principle. The principle is fewer but fresh: Google's documentation guide says a small set of fresh, accurate docs beats a large pile in disrepair, and if something exists elsewhere, link to it. The how-to template runs prerequisites, steps, how to confirm it worked, and whom to ask when it fails; in one study, installation instructions rewritten to a template scored better on eight of ten aspects readers rated. Architecture decision records (ADRs) note why a decision was made; when one is reversed, you don't delete it, you mark it superseded and link to the new decision. Research also finds ADRs are often tried and dropped, and that the \"considered options\" section is the most problematic, often missing or misplaced, so keep the template short and keep that section."
description: "Building Knowledge Bases, order 8: Google's documentation guide on writing less and not duplicating, how how-to guides and tutorials are written differently, a how-to template with a before-and-after rewrite, ADR fields and superseding, research comparing the Nygard and MADR templates, and what ADRs look like in real open-source projects."
series:
  name: "Building Knowledge Bases"
  order: 8
---

> 🌏 [中文版](/posts/learning/2026-10-22-team-docs-templates-adr)

Three people on a team each wrote a deployment document. One is twelve steps that never say what to install first; one is a single long paragraph that mixes why the team deploys this way with how to deploy; one is well written, but the process changed three months ago and nobody updated it. A new hire follows the first one and gets stuck at step five.

This is the third post in the team part of "Building Knowledge Bases". [Order 6](/posts/learning/2026-10-22-team-wiki-why-it-rots-en) covered which kinds of documents a team should write, and [order 7](/posts/learning/2026-10-22-team-wiki-information-architecture-en) covered where to put them and how to title them; this post covers how to write what goes on a page. Who maintains it is order 9. By the end you'll be able to write two templates for your team: one for how-to guides, and one for ADRs (architecture decision records).

## Write less first

Google's public documentation guide opens with: "A small set of fresh and accurate docs is better than a large assembly of "documentation" in various states of disrepair." ([Google docguide: Best practices](https://google.github.io/styleguide/docguide/best_practices.html)). The point is freshness and accuracy, not fewer documents for their own sake. The same page has two more rules that are very practical for a team wiki:

- **If it exists elsewhere, link to it; don't write your own copy.** The original reads "Do not write your own guide to a common Google technology or process. Link to it instead." If the original is out of date, fix it there. It's the same idea as order 7's entry pages: the content exists once.
- **Short and useful.** Cut everything unnecessary, including out-of-date, incorrect and redundant information.

These are Google's writing rules, not research findings. They're written for Google's internal engineering docs, but I think "write less, don't duplicate" carries over to ordinary teams: every extra document is one more thing to maintain, which is the subject of order 9.

## How-to guides and tutorials are written differently

Order 6 used Diátaxis to sort documents into four kinds. Diátaxis's author says the single most common mix-up in software documentation is between tutorials and how-to guides. Diátaxis defines a how-to guide as helping an "already-competent user" get a real task done ([Diátaxis: How-to guides](https://diataxis.fr/how-to-guides/)). So it's written in almost the opposite way from a tutorial:

| | Tutorial | How-to guide |
|---|---|---|
| Reader | Someone meeting it for the first time | Someone who already knows it and needs to get something done now |
| Title | "Build your first feature from scratch" | "How to deploy the service to production": name the goal, not the tool |
| Explanation | As little as possible; just walk them through | Almost none; put the why in an explanation document and link to it |
| Options | No choices, one path only | Branches are fine: "If A, do this; if B, do that" |

A how-to also leaves out the "why"; that belongs in an explanation document. The "single long paragraph" deployment document from the opening fails precisely because it mixes explanation with steps. Split it: the how-to keeps only the steps, why the team deploys this way goes on its own explanation page, and the two link to each other.

## A how-to template

Google's documentation guide suggests a skeleton for every document: a title, one to three sentences on what it is, a table of contents, the topics, and related links ([Google docguide: Style](https://google.github.io/styleguide/docguide/style.html)). In 2025 Gao and colleagues studied how the installation sections of open-source READMEs get revised and distilled a template: prerequisites, installation steps, how to verify the installation worked, basic usage, external documents, version history, and where to get help ([Gao et al. 2025](https://doi.org/10.1109/TSE.2025.3552614)).

Combining the two for a team's internal how-to guides, this is the version I'd use:

~~~markdown
# How to [get something done]

One or two sentences: what this document helps you do and when it applies.

**Owner**: [name or role] · **Last confirmed**: [date]

## Before you start
- Permissions, tools and versions you need

## Steps
1. [Action]
   ```
   [a command you can copy and paste]
   ```
2. …

## How to confirm it worked
- What you should see, or what a command should return

## When something goes wrong
- Common errors and what to do
- If it still fails, whom to ask and in which channel

## Related documents
- Why we do it this way: [link to explanation]
- Specification: [link to reference]
~~~

In my experience, "How to confirm it worked" is the section people skip. Without it, the person following the steps can't tell whether they really finished or something silently failed along the way.

**Do templates help?** Gao and colleagues had ChatGPT rewrite a set of READMEs to this template and asked IT practitioners to rate them blind. The rewritten versions scored significantly higher on eight of ten aspects, with structure improving most; clarity and consistency didn't change. Three limits to know: an LLM did the rewriting, so the template's contribution can't be separated from the LLM's; the raters only read the documents and didn't follow the steps, so what was measured is the reading experience, not correctness; and when the authors submitted the rewrites to the projects as pull requests, some of the projects willing to consider LLM-written changes were still unhappy, partly because the generic template lacked sections specific to their project, and a few others refused LLM-generated content outright.

So a template is a starting point, not the finish line: every team has sections it can't do without, so add them.

## Example: a how-to before and after

**Before:**

> **Deployment**
>
> We deploy with GitHub Actions because Jenkins was too slow. Merge to main first, then Actions will run, and after that check Cloudflare. Sometimes it fails; if so just rerun it, and if that doesn't work ask Wang. Remember to set up the secret first.

**After:**

> **How to deploy the website to production**
>
> Publishes the changes on the main branch to the production website. Applies only to the frontend website; for the API service see "How to deploy the API".
>
> **Owner**: Frontend on-call · **Last confirmed**: 2026-10-01
>
> **Before you start**: you need write access to the repo; `CLOUDFLARE_API_TOKEN` must be set in the repo's secrets (if not, ask frontend on-call).
>
> **Steps**
> 1. Merge the PR into `main`.
> 2. Go to the Actions tab and wait for the "Deploy" workflow to finish, about 5 minutes.
>
> **How to confirm it worked**: the workflow shows a green check; open the production site and check that the version number in the footer matches the latest commit.
>
> **When something goes wrong**: if the workflow fails, click Re-run; if it fails twice in a row, post the error message in #frontend.
>
> **Related documents**: "ADR 7: Frontend deployment on GitHub Actions" (decision record)

The "because Jenkins was too slow" in the "before" version is the reason for a decision, buried inside the steps. It deserves to be recorded properly, and that's what an ADR is for.

## Decision records: ADRs

**Why record them.** When Michael Nygard proposed the architecture decision record (ADR) in 2011, he wrote that a new team member facing an old decision they don't understand has only two options: blindly accept it, or blindly change it ([Nygard 2011](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)). Accept too many blindly and the team becomes afraid to change anything; change one blindly and you may break what it was there to protect. In the 2024 action research study by Ahmeti and colleagues mentioned in order 6 ([Ahmeti et al. 2024](https://doi.org/10.1007/978-3-031-70797-1_22)), before the teams adopted ADRs, the background to decisions lived only in a few people's memories and was lost when they left.

**Nygard's five sections:**

1. **Title**: a short noun phrase, such as "ADR 7: Frontend deployment on GitHub Actions".
2. **Context**: the forces and constraints at the time, stated as facts.
3. **Decision**: written as full sentences, "We will…".
4. **Status**: proposed, accepted, deprecated, or superseded.
5. **Consequences**: positive, negative and neutral alike.

He recommends one decision per ADR, one or two pages long, written "as if it is a conversation with a future developer". ADRs are numbered sequentially, and numbers are never reused.

**Don't delete when reversed.** In Nygard's words: "If a decision is reversed, we will keep the old one around, but mark it as superseded." The old decision still matters: it explains why things were done that way at the time. MADR, a later template, builds this into the status field as `superseded by ADR-0123`, so the old record carries a link to the new decision ([MADR](https://adr.github.io/madr/)).

**MADR adds a "considered options" section.** Nygard's five sections don't include one; MADR puts it in its most minimal template, on the grounds that without knowing which options were compared, it's hard to understand why this one was chosen. The teams in the Ahmeti study also used Nygard's format and added their own "considered options" section.

## What ADRs look like in real projects

There isn't much research on ADRs, but a few findings are worth knowing:

- **Most are tried and not kept up.** In a 2023 study, Buchgeher and colleagues found 921 GitHub projects that had used ADRs by the end of 2020, and more than half had written only a handful ([Buchgeher et al. 2023](https://doi.org/10.1109/ACCESS.2023.3287654)). The authors read this as projects that tried ADRs but didn't keep using them; they didn't investigate why.
- **"Considered options" is the most problematic section.** In 2026 Miccio and colleagues used an LLM to analyze 4,316 ADRs from open-source projects. "Context" and "decision" were mostly complete, while "considered options" was missing or misplaced in most ADRs ([Miccio et al. 2026](https://arxiv.org/abs/2609.07375)). Most of these ADRs used Nygard's format, which has no such section, so part of the gap is just that the template didn't ask for it. The paper is also still a preprint.
- **Short templates are faster to write; longer ones explain the reasoning better.** In 2026 Nogueira and colleagues had 33 students write ADRs with both Nygard and MADR, and Nygard got the higher composite score; but half of that score came from "efficiency and usability" (completion time, how often participants consulted help, and self-rated objectivity), where fewer fields have a built-in advantage ([Nogueira et al. 2026](https://arxiv.org/abs/2604.27333)). In the authors' own initial assessment MADR came out slightly ahead; the student experiment reversed it. In their qualitative feedback, students said MADR explained the reasons for a decision more clearly, and also found it more cluttered.
- **The discussion often isn't in the ADR.** One industry report that Buchgeher and colleagues relay says ADRs suit recording the outcome but make a poor discussion format, so the discussion moved to chat.

Putting these together, my suggestion: use Nygard's five sections, add a "considered options" section, at most add a date and the decision makers, and stop there. The longer the template, the fewer people write in it; but without the options, the record is just a conclusion.

**What's worth an ADR?** Nygard's scope is decisions that "affect the structure, non-functional characteristics, dependencies, interfaces, or construction techniques". In practice ADRs get used more broadly: in Miccio's data, about a fifth recorded process decisions, such as CI/CD, changelogs, approval workflows and testing. An architect in the Ahmeti study also said the hardest part is deciding whether a change counts as a decision worth recording. A practical test: in six months, will someone ask "why did we do it this way"? If so, write one.

## Example: an ADR

```markdown
# ADR 7: Frontend deployment on GitHub Actions

**Status**: Accepted (2026-03-02); supersedes ADR 3
**Decision makers**: Frontend team

## Context
A Jenkins deploy takes 20 minutes, and only one person can maintain the server;
they move to another team next month.
The code is already on GitHub, and Cloudflare has an official Actions example.

## Considered options
- Keep Jenkins and find someone to take over maintenance
- GitHub Actions
- Cloudflare's built-in Git integration

## Decision
We will move to GitHub Actions. It needs no server of our own to maintain,
and the deployment config is versioned and reviewed along with the code.
Cloudflare's built-in integration is the simplest to set up, but we want to run
the full test suite before deploying, which is easier to manage in one workflow.

## Consequences
- Positive: no Jenkins to maintain; a deploy takes about 5 minutes.
- Negative: the monthly free quota has a cap, and going over it costs money.
- Neutral: deployment secrets now live in GitHub, so permissions need reorganizing.
```

The old record, ADR 3, isn't deleted; its status just changes to "Superseded by ADR 7".

## Limits of the research

Google's documentation guide, Nygard and MADR are their authors' or community's positions, not research findings. The studies that look at ADRs at scale cover only public GitHub projects, so ADRs kept in company wikis are invisible to them; Nogueira's experiment used students, and Ahmeti's ran for only three months. The evidence on templates is a single paper, Gao's, and it studied external README installation instructions, not a team's internal docs.

## What you can do tonight

1. **Pick the thing your team is asked about most and rewrite it with the how-to template above.** In particular, add "How to confirm it worked" and "When something goes wrong".
2. **Pull out the "because…" in your documents.** Move reasons buried in steps into an ADR or explanation document, and leave a link in their place.
3. **Write up one recent decision.** Pick one made in the last three months that someone will ask about in six months, and record it with the five sections plus "considered options".
4. **Set up a place for ADRs and write one sentence on what to record.** Ahmeti and colleagues concluded that where ADRs are stored, and clear guidance on what to record, are what make them work.

## Self-check

**Q:** A year ago your team decided to use database A, and now it's moving to B. Should the original ADR be deleted?

**How to judge:** No. Write a new ADR recording why you're moving to B, change the old one's status to "superseded" and link it to the new one. The old record explains why A was chosen at the time, so when someone asks "how did we end up choosing A", there's an answer, and if the conditions ever swing back, nobody has to relitigate it from scratch. Delete it, and even the reasons for this move become harder to follow, because the new record's context is missing the chapter before it.

## References

- [Google docguide: Best practices](https://google.github.io/styleguide/docguide/best_practices.html)
- [Google docguide: Markdown style guide](https://google.github.io/styleguide/docguide/style.html)
- [Diátaxis: How-to guides](https://diataxis.fr/how-to-guides/)
- [Gao, Treude & Zahedi 2025, Adapting Installation Instructions in Rapidly Evolving Software Ecosystems (IEEE TSE)](https://doi.org/10.1109/TSE.2025.3552614)
- [Nygard 2011, Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [MADR: Markdown Architectural Decision Records](https://adr.github.io/madr/)
- [Ahmeti et al. 2024, Architecture decision records in practice: an action research study (ECSA 2024)](https://doi.org/10.1007/978-3-031-70797-1_22)
- [Buchgeher et al. 2023, Using Architecture Decision Records in Open Source Projects—An MSR Study on GitHub (IEEE Access)](https://doi.org/10.1109/ACCESS.2023.3287654)
- [Miccio, Tommasel & Diaz-Pace 2026, A Text Mining and Classification Approach for Analyzing Architecture Decision Records (arXiv)](https://arxiv.org/abs/2609.07375)
- [Nogueira, Silva & Conte 2026, One Size Fits All? An Empirical Comparison of ADR Templates regarding Comprehension, Usability, and Ease of Adoption (EASE 2026, arXiv)](https://arxiv.org/abs/2604.27333)

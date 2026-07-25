---
title: "Uncle Bob Doesn't Read His Agents' Code: What He Runs Instead of Code Review"
date: 2026-07-25
category: ai
tags: [ai-code-review, agentic-coding, quality-gates, testing, spec-driven-development, ai-agent]
lang: en
type: deep-dive
tldr: "On 2026/7/23 Uncle Bob said he reads none of the code his agents write, surrounding them with unit tests, Gherkin, and mutation testing instead. But this wasn't a sudden pivot — he said the same thing on 4/14 and had been building the pipeline publicly since March, with the spec open-sourced as Acceptance-Pipeline-Specification. His real trick is acceptance mutation: mutating Gherkin's example values, not the production code. Grady Booch's rebuttal names three things test metrics cannot see."
description: "A breakdown of the verification gauntlet Robert C. Martin uses in place of agent code review — Gherkin specs, acceptance mutation, quality metrics — plus Grady Booch's counterargument and where the approach hits its ceiling."
glossary:
  - term: acceptance mutation
    aliases: [Gherkin mutation]
    definition: "Changing key example values in a Gherkin spec (not the code) should make the acceptance test fail. If it still passes, that test is not actually wired to the application under test."
    advanced: "It runs opposite to ordinary mutation testing: ordinary mutation alters production code to expose weak tests, while acceptance mutation alters the spec's example values to expose false green lights where a test is really exercising a mock or its own fabricated data. The two are complementary and catch different failure modes."
    links:
      - label: "Acceptance-Pipeline-Specification"
        url: "https://github.com/unclebob/Acceptance-Pipeline-Specification"
  - term: JSON IR
    aliases: [intermediate representation, IR]
    definition: "The intermediate JSON representation a Gherkin feature file is parsed into. Downstream test generators and mutators operate on this layer rather than editing feature-file text directly."
    advanced: "The extra IR layer buys tool portability: parser, DRY checker, and mutator only need to understand JSON, not each language's test runner. The cost is one more translation step between the IR and the original Gherkin where meaning can drift."
  - term: IR-DRY checker
    definition: "A tool that scans the JSON IR for repeated, near-duplicate, and possible-synonym Gherkin step text so agents can normalize the spec and prune redundancy."
---

> 🌏 [中文版](/posts/ai/2026-07-25-uncle-bob-agent-code-review)

On 23 July 2026, Robert C. Martin (Uncle Bob) replied to a comment on X with a line that looks like the opposite of what he spent thirty years teaching:

> I started coding in the late 60s. My current strategy is to not read any of the code written by my agents. That's the only way I can take advantage of their productivity. What I do instead is to surround the agents with extreme constraints. Unit tests, gherkin tests, QA procedures, quality metrics, mutation testing, test coverage, and a plethora of others.
>
> — [@unclebobmartin, 2026/7/23](https://x.com/unclebobmartin/status/2080257779395154409)

He went on to say that precisely because the code has to "run the gauntlet" of all his constraints and tests, he has very high confidence in it.

The author of *Clean Code* says he no longer reads code. Of course that blew up. But if you only read that one post, you'll get three things wrong.

▍First, fix the timeline: this was not last week's pivot

The easiest misreading is that he suddenly changed his position. He didn't.

Going through his own posts, this pipeline has been built in public for five months:

| Date | What happened |
|---|---|
| 2026/3/7 | [Announced Gherkin as his primary behavioral specification tool](https://x.com/unclebobmartin/status/2030287900709978600), requiring the Gherkin stay in natural language with no code-level artifacts |
| 2026/4/14 | ["I don't review code written by agents."](https://x.com/unclebobmartin/status/2044114698451476492) He measures test coverage, dependency structure, cyclomatic complexity, module sizes instead |
| 2026/5/13 | [Proposed Gherkin mutation](https://x.com/unclebobmartin/status/2054614775397568761): convert Gherkin to JSON, have a mutator alter the IR, then expect the test to fail |
| 2026/5/22 | [Described two project modes](https://x.com/unclebobmartin/status/2057809771361677498): the full-constraint swarm is "very productive and safe, but slower than raw vibe coding" |
| 2026/6/1 | [Published the full pipeline](https://x.com/unclebobmartin/status/2061482997610610863): hand-written informal specs → agent converts to harder specs split into tasks → **"I review these."** → feed to the specifier agent |
| 2026/7/2 | [Admitted he doesn't run the whole thing every time](https://x.com/unclebobmartin/status/2072736888478175413) |
| 2026/7/23 | The post that went viral |

The April version is considerably clearer than the July one:

> The code itself I leave to the AI. Humans are slow at code. To get productivity we humans need to disengage from code and manage from a higher level.

So the July post isn't a manifesto — it's the closing line of a practice that had been running for months. Compressed for circulation into "the Clean Code author stopped reading code," it came out far more radical than he meant.

▍The gauntlet isn't an abstraction — he open-sourced the spec

The second thing people missed: this gauntlet has an implementation spec. You don't have to guess from tweets.

Uncle Bob put it on GitHub as [Acceptance-Pipeline-Specification](https://github.com/unclebob/Acceptance-Pipeline-Specification), described as a portable acceptance-test pipeline that AI agents can install into projects. One line from the README covers what it does:

> turns Gherkin feature files into JSON IR, generates executable acceptance test entry points, runs those tests, and uses acceptance mutation to check whether example data is actually connected to the application under test

It defines two flows. The normal run: feature file → Gherkin parser → JSON IR → optional IR-DRY checker → entrypoint generator → generated test entry points → project test runner.

The mutation run: feature file → parser → base JSON IR → entrypoint generator → **Gherkin mutator alters the IR** → runner adapter evaluates the mutated IR → mutation report.

The tooling splits in two: portable pieces (gherkin-parser, gherkin-ir-dry-checker, gherkin-mutator, shipped as Babashka tasks or Go binaries) and project-specific pieces (entrypoint generator, acceptance runtime, step handlers, runner adapter). The IR-DRY checker's job is to flag repeated, near-duplicate, and possible-synonym step text so agents can normalize and prune the Gherkin.

▍The most commonly mangled point: he isn't mutating the code

Ordinary mutation testing means quietly breaking the production code and seeing whether the tests scream. Uncle Bob does use that too — mutation testing is on his April list.

But the signature mechanism in this pipeline is something else: **acceptance mutation**. The README is blunt about it:

> The normal run proves that the project satisfies the feature. The mutation run checks whether the acceptance tests fail when important example values change.

What gets mutated is the **example data in the Gherkin**, not the code. Change a key value and the acceptance test should go red. If it stays green, that test isn't wired to the application under test at all.

The distinction matters because it directly answers the nastiest version of "who verifies the tests?" — a test that is well written, richly asserted, and shows good coverage, but is actually exercising a mock or its own fabricated data. Breaking the production code won't catch that: the line you broke is one the test never reaches. Breaking the example data will.

One honest caveat: the README contains **no threshold numbers** — no required mutation score, no coverage percentage. So "you get numbers to look at" is true; "there's an agreed passing line" is not. The passing line is still set by a human.

▍He said it himself: you don't need all of it every time

The 7/2 post is the key to understanding what he actually does, and almost nobody shared it:

> I've been pushing very hard on overloading with tests. Gherkin test unit test QA test mutation test gherkin mutation test. It's easy to make the AI's do these things. But just because we can do them doesn't mean we actually should. Lots of times I just use unit tests and crap evaluation.

Most of the time he uses unit tests plus rough evaluation. On Gherkin and QA, his words were "For larger projects I can imagine that gherkin testing is pretty useful" — *I can imagine*, not a measured conclusion.

So there's no fixed menu here, and the heavy kit is something even he is still picking his moments for. Anyone copying it as standard process is copying the part he explicitly said isn't always necessary.

▍What he stopped looking at is implementation detail only

"Reads none of it" is loose phrasing, and his own 6/1 post dismantles it: he hand-writes the informal specs, and the harder specs and tasks the agent produces — **he reviews those**.

So the real line isn't read/don't-read, it's **which layer**:

- Specs and acceptance criteria → he writes, reads, and prunes them himself
- Quality metrics (coverage, dependency structure, cyclomatic complexity, module sizes, mutation results) → he reads the numbers
- Implementation code → left to the AI

That is not the same as abandoning code review. He moved review from the output end to the input end.

▍The strongest objection isn't from trolls — it's Grady Booch

In the April round of this discussion, [Grady Booch](https://en.wikipedia.org/wiki/Grady_Booch) (co-author of UML) gave a rebuttal that names specific categories:

> Unlike Bob, I review all code generated by agents. Test coverage and similar metrics will give me confidence of functionality, but they offer me no confidence whatsoever that those agents have not introduced vulnerabilities, that they have not introduced dead code that will diminish understandability in the future, that they have missed factorizations that would have significant impact upon performance.

He added: "Trust but verify. As an experienced developer, I know the smell of what is good and what is not. And no agent has either the experience or the context to know those things."

The value here isn't the sentiment, it's the three categories metrics can't see:

1. **Security vulnerabilities**: tests verify that behavior is correct, not that no extra door was opened
2. **Dead code**: doesn't affect functionality, doesn't affect coverage, but permanently taxes everyone's comprehension afterward
3. **Missed refactorings**: it runs, it's just slow — performance problems don't turn tests red

All three share a property: they are completely invisible along the "functionally correct" axis. And Uncle Bob's gauntlet measures almost nothing but functional correctness.

▍Where this approach actually hits its ceiling

Harder to handle than Booch's three items is this: **the gauntlet verifies the spec, not the intent.**

Acceptance mutation can catch "the test is too weak." It cannot catch "the acceptance criteria are wrong." If the examples in your Gherkin encode a misunderstanding of the business rule, the whole pipeline will very efficiently — with beautiful coverage and a high mutation score — verify the wrong thing.

And it fails more invisibly than a human would, because every light is green.

Which is why his spec-review step isn't optional; it's the load-bearing wall. He moved human attention off the code and bet all of it on the specs. The specs are the one link in this system with no automated gate protecting it.

▍The point is who designs the gauntlet

Everyone argued about whether to read code and skipped the question: who designed that gauntlet?

Uncle Bob can afford not to read code because the person who designed his gauntlet has been a programmer since 1970 (he says late 60s in the tweet) and is 73 this year. Where to place a check, which values are worth mutating, which boundaries the Gherkin examples need to cover, what the IR-DRY checker should treat as synonymous — all of that judgment comes from having read a lot of bad code and fixed a lot of bad tests.

What he did was write decades of judgment into the verification layer *first*, and only then look away. And he's teaching it: cleancoders has a [Clean AI: Agentic Discipline series](https://cleancoders.com/episode/agentic-discipline-6), and O'Reilly runs an [AI Agents for Clean Code](https://www.oreilly.com/live-events/ai-agents-for-clean-code-with-uncle-bob-martin/0642572376765/) live course. He isn't telling people to stop reading code — he's selling how to design the gauntlet.

An engineer three years in who copies the "don't read the code" conclusion gets the risk and nothing else, because they can't yet design a gauntlet worth trusting.

The conclusion fits in one shareable line. The gauntlet doesn't.

▍One concrete test for your team

The point isn't picking a side. It's that the scarce skill has moved from writing fast to designing verification — the same conclusion [Loop Engineering](/posts/ai/2026-06-20-loop-engineering) reaches from a different direction when it identifies verification cost as the real bottleneck.

Before deciding whether to stop reading code like Uncle Bob, do two things:

1. **Run mutation testing against your code.** See what fraction your suite catches when production code is broken.
2. **Run Uncle Bob's kind of mutation against your acceptance criteria.** Take a few end-to-end tests, change the key input values inside them, and see whether the tests go red. If they stay green, those tests aren't wired to your system.

The second is done far less often, and usually looks worse. For rigorously measuring whether a change actually improved anything, see [how to compare agent behavior before and after a change](/posts/ai/2026-06-04-agent-change-rigorous-evaluation).

## References

- [Uncle Bob, 2026/7/23: not reading agent code, surrounding agents with constraints](https://x.com/unclebobmartin/status/2080257779395154409)
- [Uncle Bob, 2026/4/14: measuring metrics instead of reviewing code](https://x.com/unclebobmartin/status/2044114698451476492)
- [Uncle Bob, 2026/3/7: Gherkin as the primary behavioral specification tool](https://x.com/unclebobmartin/status/2030287900709978600)
- [Uncle Bob, 2026/5/13: how Gherkin mutation works](https://x.com/unclebobmartin/status/2054614775397568761)
- [Uncle Bob, 2026/5/22: trade-offs between swarm mode and single-agent mode](https://x.com/unclebobmartin/status/2057809771361677498)
- [Uncle Bob, 2026/6/1: the full pipeline, including "I review these"](https://x.com/unclebobmartin/status/2061482997610610863)
- [Uncle Bob, 2026/7/2: you don't need every test layer every time](https://x.com/unclebobmartin/status/2072736888478175413)
- [unclebob/Acceptance-Pipeline-Specification (GitHub)](https://github.com/unclebob/Acceptance-Pipeline-Specification)
- [Uncle Bob vs. Grady Booch: Rethinking Code Reviews in the Age of AI](http://mvark.blogspot.com/2026/04/uncle-bob-vs-grady-booch-rethinking.html)
- [Grady Booch (Wikipedia)](https://en.wikipedia.org/wiki/Grady_Booch)
- [Robert C. Martin (Wikipedia)](https://en.wikipedia.org/wiki/Robert_C._Martin)
- [Clean AI: Agentic Discipline series (cleancoders)](https://cleancoders.com/episode/agentic-discipline-6)
- [AI Agents for Clean Code with Uncle Bob Martin (O'Reilly live course)](https://www.oreilly.com/live-events/ai-agents-for-clean-code-with-uncle-bob-martin/0642572376765/)
- [Loop Engineering: When AI No Longer Needs Your Prompts](/posts/ai/2026-06-20-loop-engineering)
- [Rigorously comparing agent behavior before and after a change](/posts/ai/2026-06-04-agent-change-rigorous-evaluation)

---
title: "GitHub Copilot Certification (GH-300): Beyond Autocomplete to the CLI, Agent Mode, and Organization Policy"
date: 2026-10-08
type: guide
category: ai
tags: [certification, github, copilot, coding-agent, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 28
tldr: "GH-300 is the official GitHub Copilot certification. After the August 7, 2026 revision the outline has six areas, the heaviest being 'Use GitHub Copilot features' at 25–30%, which covers the Copilot CLI, agent mode, MCP, sub-agent delegation, and organization-level policy, audit logs, and the REST API. Official specs: $99 in the US, $50 in Taiwan, 100 minutes, 60 scored questions, pass at 700, valid 2 years, five languages with no Chinese, and an official practice assessment. The official weight list has one extra line; prepare from the six real sections."
description: "A preparation guide for the GitHub Copilot certification (GH-300), built on the official study guide's six weighted skill areas: what each tests, how the two official learning paths map to them, a three-week schedule with its derivation, the duplicated line on the official pages, and the current state of GitHub's two-year validity and renewal process."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-08-github-gh-300-prep-guide)
>
> This is a preparation path built from official material, not an exam-day account. I have not sat this exam. Every "what it tests" points back to the [official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300), and every "how to prepare" points to official training. No leaked questions. Verified 2026-10-08 against "Skills measured as of **August 7, 2026**".

If you use GitHub Copilot every day, it is easy to assume this certification is free points. The outline as revised in August 2026 is much wider than pressing Tab in an editor: the Copilot CLI has its own group of objectives, agent mode and MCP are named, and one group tests how an organization admin sets policy and reads audit logs.

GitHub certifications now live on Microsoft Learn, and registration and scores run through Microsoft's systems, with renewal in the process of moving over. For specs across vendors, see [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en).

## Who This Is For

The audience profile in the study guide:

> Candidates for this exam should possess expertise in using GitHub Copilot to improve software development productivity, quality, and security. This includes responsible AI use, prompt engineering, Copilot features across various plans, and privacy safeguards.

It also asks for familiarity with GitHub fundamentals and experience in at least one programming language.

**A good fit**: developers on teams that have adopted Copilot, and technical leads who evaluate, buy, or administer it. For the second group, the areas on data flow, content exclusions, and public code matching are the questions they get asked internally.

**Not a fit**: people who do not use GitHub Copilot. The exam is tied to one product. The prompting concepts transfer, but questions on features, plans, and settings are worthless on another tool. If you want an exam on operating and governing agents in a development workflow, look at [GH-600](/posts/ai/2026-10-08-github-gh-600-prep-guide-en).

## Official Specs

| Item | Detail |
|---|---|
| Exam code | GH-300 |
| Certification | GitHub Copilot |
| Price | **$99 USD** in the US, **$50 USD** in Taiwan (priced by the country where the exam is proctored; the certification page has a country selector) |
| Duration | **100 minutes** |
| Questions | **60 scored multiple-choice questions** plus roughly 10–15 unscored pretest items (the general statement in GitHub's certification FAQ; the Microsoft Learn certification page lists nothing) |
| Passing score | **700** (the [general passing score for Microsoft technical exams](https://learn.microsoft.com/en-us/credentials/certifications/exam-scoring-reports) on a 1–1,000 scale; GitHub's own pages state no separate figure) |
| Validity | **2 years** |
| Languages | English, Spanish, Portuguese (Brazil), Korean, Japanese; **no Chinese** |
| Proctoring | Pearson VUE |
| Prerequisites | None |

The overview article on this site previously said the official page listed no amount. The price on the certification page loads dynamically by country: it shows $99 for the United States and $50 for Taiwan.

## The Six Skill Areas

| Skill area | Weight |
|---|---|
| Use GitHub Copilot responsibly | 15–20% |
| **Use GitHub Copilot features** | **25–30%** |
| Understand GitHub Copilot data and architecture | 10–15% |
| Apply prompt engineering and context crafting | 10–15% |
| Improve developer productivity with GitHub Copilot | 10–15% |
| Configure privacy, content exclusions, and safeguards | 10–15% |

**The official list actually has seven lines.** Both "Skills at a glance" in the study guide and "Assessed on this exam" on the certification page add a line after the second one, "GitHub Copilot features" (the study guide gives it 25–30%; the certification page shows no weights), with no matching section in the body. The six real sections sum to a range of 80–110%, which contains 100%. Counting the extra line gives 105–140%, which cannot work. GitHub's own [certification page](https://learn.github.com/certification/COPILOT) also lists six domains. The line is a duplicate, and the six sections are what to prepare from.

## Preparing Area by Area

### Use GitHub Copilot responsibly (15–20%)

**What it tests**: risks and limitations of generative AI tools; ethical and responsible use; potential harms and mitigations; **why AI output needs validation**; how to operate Copilot responsibly.

**How to prepare**: conceptual. The center of it is validation: Copilot's code can contain vulnerabilities, be out of date, or match public code. Build yourself a table of which check fits which situation.

### Use GitHub Copilot features (25–30%, the heaviest)

**What it tests**, in four groups:

| Subtopic | Objectives |
|---|---|
| Copilot in the IDE | Enabling it; triggering through inline suggestions, chat, CLI, and **agent mode**; content exclusions for specific files or repositories |
| **Copilot CLI** | What it is and how it helps; installation steps; key features and commands; interactive and session use; generating scripts and managing files |
| Features and capabilities | **Agent Mode, Copilot Edits, MCP**; **managing agent sessions and delegating tasks to sub-agents to save context**; code review; Spaces, Spark, pull request summaries; **customizable review standards through instructions files**; limits, options, and commands of Copilot Chat; **prompt file reuse** |
| Organization-wide settings and policies | Organization policy management; enabling Copilot Code Review policies and managing feature availability across IDEs and github.com; **audit log events**; **managing subscriptions with the REST API** |

The CLI group has five objectives, the most of the four groups in this area (three for the IDE, four for features, three for organization settings). People who only use Copilot inside an editor need to prepare this group separately.

**How to prepare**: use every named feature once. A minimum list: install the Copilot CLI and generate a script with it; connect an MCP server in agent mode; write one instructions file and one prompt file; and if you have organization admin rights, open the settings and look at the policies and audit log once. Without those rights, read the official admin documentation.

### Understand GitHub Copilot data and architecture (10–15%)

**What it tests**: data usage, flow, and sharing; input processing and prompt building; **proxy filtering and post-processing**; the lifecycle of a code suggestion; limitations of LLMs and Copilot.

**How to prepare**: draw the path of one suggestion end to end: the editor gathers context, builds a prompt, passes it through the proxy, the model responds, post-processing filters, the result is shown. Be able to say what each step can block.

### Apply prompt engineering and context crafting (10–15%)

**What it tests**: prompt structure and context; **how context is determined**; zero-shot and few-shot prompting; prompt crafting best practices; prompt engineering principles; prompt process flow and chat history usage.

**How to prepare**: this overlaps with [How exams test prompt and context engineering](/posts/ai/2026-08-18-prompt-context-engineering-exam-domains-en). The part specific to Copilot is how context is determined: which files are open, where the cursor sits, and how long the chat history is all change the suggestion.

### Improve developer productivity with GitHub Copilot (10–15%)

**What it tests**: code generation, refactoring, and documentation; faster learning and less context switching; generating sample data and modernizing legacy code; **generating unit and integration tests**; identifying edge cases and writing assertions; suggesting security and performance improvements.

**How to prepare**: take a piece of legacy code with no tests and use Copilot to add tests, find edge cases, and refactor it, once each.

### Configure privacy, content exclusions, and safeguards (10–15%)

**What it tests**: configuring content exclusions and editor settings; **ownership and limitations of outputs**; **enabling the filter for suggestions matching public code**; resolving issues with suggestions and content exclusions.

**How to prepare**: read the official [content exclusion documentation](https://docs.github.com/copilot/managing-copilot/configuring-and-auditing-content-exclusion) and work out which features honor content exclusions and which do not. Content exclusions also appear once in the IDE group of the second area, so prepare the two together.

## A Three-Week Schedule and How It Was Derived

**Derivation**: the two official learning paths, [GitHub Copilot Fundamentals Part 1](https://learn.microsoft.com/en-us/training/paths/copilot/) (9 modules) and [Part 2](https://learn.microsoft.com/en-us/training/paths/gh-copilot-2/) (6 modules), add up to about 8.7 hours in the Microsoft Learn catalog, and the instructor-led course [GH-300T00-A](https://learn.microsoft.com/en-us/training/courses/gh-300t00) is one day. At 5–6 hours a week that is three weeks. Daily Copilot users who have also used the CLI and agent mode can do it in one or two.

| Week | Content | Basis |
|---|---|---|
| 1 | Read the study guide, take Part 1 | Covers responsible use, data and architecture, prompting |
| 2 | Part 2 plus the **hands-on feature list** | Features are 25–30% and the named ones need real use |
| 3 | Official practice assessment and gap-filling | The certification page offers a practice assessment directly |

**Failure is cheap**: the certification page links to Microsoft's [retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy): 24 hours after a first failure, 14 days between later attempts, at most 5 attempts in 12 months, paying each time. GitHub's certification FAQ states the same rules.

## Known Traps

1. **The outline follows the product.** The current version took effect August 7, 2026, and the study guide's change log marks three minor changes (IDE use, features and capabilities, safeguards and troubleshooting). The change log does not say what changed. My own test for study material is whether it covers the sub-agent delegation, Spaces, Spark, and Copilot CLI named in the current objectives; if it does not, it probably trails the current outline.
2. **The instructor-led course page is old.** The GH-300T00-A page was last updated in June 2025, and its audience profile still lists "Policy Makers and Regulators". It predates the current outline by more than a year and should not be used to judge scope.
3. **The official list has an extra line.** See the note under the weights table.
4. **The renewal text in the study guide is Microsoft boilerplate.** The "Useful links" table says "Microsoft associate, expert, and specialty certifications expire annually". That is template text. GitHub certifications are valid for two years, as the certification page says.

## After the Exam: Two-Year Validity, Renewal in Transition

From the certification page:

> GitHub certifications are valid for 2 years. GitHub is transitioning to Microsoft's recertification process, which will provide a new way for candidates to maintain their certifications without retaking the full certification exam.

GitHub certifications will move to Microsoft's style of renewal without a full retake, but the new process is not live yet. Two protections apply in the meantime: certifications that expire before the new process is available are **extended by 6 months** (GitHub's FAQ says to contact the GitHub Certification team as expiry approaches), and if yours has already expired you can write to learn@github.com for one exam voucher covering the first renewal attempt.

In practice there is nothing to do for two years. Near expiry, check the certification page to see whether the new process has launched. If it has not, write to the GitHub Certification team for the extension instead of waiting for it to apply itself.

## Things That Will Go Stale

| Item | Status (verified 2026-10-08) | When to recheck |
|---|---|---|
| Objectives version | Skills measured as of 2026-08-07 | Quarterly; Copilot features move fast |
| Weights | 15–20 / 25–30 / 10–15 / 10–15 / 10–15 / 10–15 | On each revision |
| Price | $99 US, $50 Taiwan | Every six months |
| Renewal process | In transition, not yet live | Quarterly |
| Duplicate line in the weight list | Present in both the study guide and the certification page | When GitHub fixes it |

## References

- [GitHub Copilot certification page](https://learn.microsoft.com/en-us/credentials/certifications/github-copilot/)
- [GH-300 official study guide (full objectives, weights, and change log)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [GH-300T00-A instructor-led course page](https://learn.microsoft.com/en-us/training/courses/gh-300t00)
- [Learning path: GitHub Copilot Fundamentals Part 1 of 2](https://learn.microsoft.com/en-us/training/paths/copilot/)
- [Learning path: GitHub Copilot Fundamentals Part 2 of 2](https://learn.microsoft.com/en-us/training/paths/gh-copilot-2/)
- [GitHub Docs: Configuring and auditing content exclusion](https://docs.github.com/copilot/managing-copilot/configuring-and-auditing-content-exclusion)
- [GitHub Docs: Plans for GitHub Copilot](https://docs.github.com/copilot/about-github-copilot/plans-for-github-copilot)
- [Microsoft exam retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy)

**Related on this site**

- [GitHub Agentic AI Developer (GH-600) preparation path](/posts/ai/2026-10-08-github-gh-600-prep-guide-en)
- [How exams test prompt and context engineering](/posts/ai/2026-08-18-prompt-context-engineering-exam-domains-en)
- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)

---
title: "Site Case Study: How the Writing & Review Pipeline Worked"
date: 2026-10-14
category: learning
type: guide
tags: [series, writing-process, review]
lang: en
series:
  name: "How to Write Teaching Articles"
  order: 29
draft: false
---

## From a draft to a publishable article

This site's “How to Write Teaching Articles” series combines research summaries, writing suggestions, and examples from the site. AI can help organize sources, propose structure, or translate, but producing a draft leaves several checks to complete.

This case study explains the pipeline using inspectable site rules and code. It does not claim that every historical article completed every review stage, or treat an AI-generated review as independent verification.

## Separate writing, fact-checking, and editing

Begin with an audience and a task. “Readers can decide where to place a video” is easier to assess than “introduce multimedia learning.” Distinguish observations from recommendations: a study comparing classroom groups does not establish that a particular blog layout improves learning.

For fact-checking, return to the original source and check participants, comparison conditions, and outcomes. AI summaries can provide leads; they cannot replace the methods and limitations sections. If a source supports a result on an immediate test, do not promise better long-term retention.

Structural review asks whether the article delivers on its opening and whether its examples work for the intended reader. Editing makes sentences and paragraphs easier to follow. Different roles or separate readings can offer different perspectives, but the evidence behind each review comment still needs checking.

## Align the claims in both languages

Translation requires more than fluent sentences. If Chinese limits a result to a particular course, English must preserve that condition. Numbers, links, and the scope of recommendations should agree. Changes to one language require checking the other.

Compare a passage on three points: its claim, its source, and its limitations. When an unsupported promise is removed from Chinese, remove it from English too; updating the title alone will not resolve the mismatch.

## What automated checks can catch

The site uses Astro content collections. Astro supports schemas describing the shape of content; this site's `src/content.config.ts` defines its field requirements. A malformed date or a value outside an allowed enumeration can fail during content loading.

The site's `scripts/verify.mjs` is the entry point for `pnpm verify` and includes checks for references and series ordering. The quality workflow calls this command. Defined checks can catch problems such as a missing reference section or conflicting series numbers. The code is the authority for the actual check list.

An introduction can still contain a security-course outline pasted into a teaching-writing series while having valid YAML and dates. Detecting that requires comparing the overview's promises with the actual articles and both language versions.

## What remains after a successful check

Local checks, remote CI, building, deployment, and the public page are distinct states. GitHub Actions executes workflows for activities such as checking and deployment. A successful job establishes that its configured steps succeeded.

For an article, also open the public page and inspect the body, language switching, series navigation, and source links. Claiming effective teaching requires a separate reader task or learning assessment. Valid formatting, public availability, and helping someone learn each need appropriate evidence.

## Update history

- 2026-10-15: Replaced handoff notes, account quotas, and unsupported completion claims with an inspectable writing and checking workflow; aligned both languages.

## References

- [Astro: Content collections](https://docs.astro.build/en/guides/content-collections/): collections and schema validation.
- [GitHub: Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions): workflows, jobs, and steps.
- [Site article schema](https://github.com/vincentxuu/quidproquo/blob/main/src/content.config.ts), [quality-check entry point](https://github.com/vincentxuu/quidproquo/blob/main/scripts/verify.mjs), and [quality workflow](https://github.com/vincentxuu/quidproquo/blob/main/.github/workflows/quality.yml): implementation evidence for this site.
- [AI-written materials and AI tutors](/posts/learning/2026-10-14-ai-written-materials-and-ai-tutors-en): research findings and limitations for AI educational materials.

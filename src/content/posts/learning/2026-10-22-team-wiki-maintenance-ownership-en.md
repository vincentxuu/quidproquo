---
title: "Maintenance: Who Owns It, How Often to Check It, and When to Delete It"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, wiki, documentation, docs-as-code]
lang: en
tldr: "Documentation going out of date is normal, and it throws no errors: eight in ten of GitHub's most popular projects have at some point left references in their docs to code that had been deleted. There are four ways to maintain docs: give every page a responsible role, set verification expiry, change the docs in the same change as the process, and fix pages when they're used. Each one fails in its own way: the owner leaves, expiry notices get treated as spam, the rule exists but nobody follows it, and articles nobody uses never get checked. The deletion principle: delete what's certainly wrong first, and archive what's correct but rarely used. By the end you'll be able to draw up a maintenance table for your team: document type, responsible role, review cycle, and deletion conditions."
description: "Building Knowledge Bases, order 9: why docs go out of date silently, why someone has to tend them, how owners, verification expiry, docs-as-code and KCS's \"reuse is review\" each work and fail, deleting versus archiving, plus a maintenance table and one cleanup of stale pages."
series:
  name: "Building Knowledge Bases"
  order: 9
---

> 🌏 [中文版](/posts/learning/2026-10-22-team-wiki-maintenance-ownership)

A 200-person development team had a very active wiki, with hundreds of pages and dozens of contributors. Yet everyone interviewed had the same complaint: the wiki was "going to weed". A major contributor used to tidy formatting and fix wording regularly; after they left the team, a project manager was assigned to take over, and was soon reassigned to other work. The wiki stayed heavily used, but with no "gardener" it got messier, and a manager who saw the ragged-looking content withdrew the maintenance resources altogether ([Grudin & Poole 2010](https://doi.org/10.1145/1832772.1832780)).

This is the fourth post in the team part of "Building Knowledge Bases". [Order 6](/posts/learning/2026-10-22-team-wiki-why-it-rots-en) said team wikis rot mainly because things aren't written or updated, and because the writers have no time or have left; order 6 also suggested writing an owner on every page; [order 7](/posts/learning/2026-10-22-team-wiki-information-architecture-en) recommended a main structure in which every page has an owner; and the template in [order 8](/posts/learning/2026-10-22-team-docs-templates-adr-en) left two slots at the top of each page, "Owner" and "Last confirmed". This post is about making those two slots mean something. Pages that search can't find are order 10. By the end you'll be able to draw up a maintenance table for your team.

## Going out of date is normal, and it happens silently

In 2024 Tan and colleagues checked READMEs and wikis on GitHub for references to functions or variables that no longer existed in the code ([Tan et al. 2024](https://doi.org/10.1007/s10664-023-10397-6)). Over eight in ten of GitHub's most popular projects had at some point contained such an outdated reference; for Google's own projects it was about three in ten. The outdated references still present had, on average, been out of date for years. As the authors put it, unlike source code, documentation gets outdated "silently": there are no crashes or error messages.

And this is only the easiest kind of staleness to detect: a name that was deleted. Behavior that changed while the name stayed, a process that changed, an owner who changed: the method catches none of these. So the real level of staleness is likely higher.

## Why someone has to be responsible

The problem with the wiki in the opening wasn't that nobody wrote; it was that nobody tended it. In 2024 Torkki and colleagues ran a 15-week action research project at one company, working through the accumulated documentation gaps for a system; one developer put it bluntly: "Everyone wants to have quality documentation, but no one wants to actually do the documentation work." ([Torkki et al. 2024](https://aisel.aisnet.org/icis2024/practitioner/practitioner/8/)). They found that assigning owners was key to keeping documentation up, but when urgent work pulled people away, owners sometimes had to remind contributors to come back to the documentation. When the writing was later split up for each person to do on their own, quality dropped.

So "one owner per page" is necessary, but it isn't everything. The four approaches below each solve part of the problem, and each can fail.

## Four ways to maintain docs

### 1. Owners: assign a role, not a person

In GitLab's Handbook, a page's code owner is its directly responsible individual (DRI), who has the final say on what it contains ([Handbook Usage](https://handbook.gitlab.com/handbook/about/handbook-usage/)). Some pages have an empty maintainers section because "the page is maintained by a group rather than individuals", and you check the CODEOWNERS file to see which group. GitLab's own DRI examples are written as positions: the product manager owns prioritization and the engineering manager owns delivery ([GitLab DRI](https://handbook.gitlab.com/handbook/people-group/directly-responsible-individuals/)).

Torkki's study likewise recommends tying documentation responsibilities to roles and spelling out who is responsible and who is accountable in a RACI chart; their reasoning is that with the chart in place, a change of responsible person causes less confusion. Order 6 suggested starting by writing a name at the top of the page; writing a role is sturdier.

Note that Notion's help page describes the page owner as a person field and doesn't mention groups ([Notion: Wikis & verified pages](https://www.notion.com/help/wikis-and-verified-pages)), and Confluence's official documentation doesn't mention assigning a group either ([Confluence: Transfer ownership](https://support.atlassian.com/confluence-cloud/docs/transfer-ownership-of-your-content-item/)). If your tool only takes people, my approach is to also write the role at the top of the page, for example "Owner: frontend on-call (currently Chen)".

**How it fails**: the person leaves, and their name stays in the field.

### 2. Verification expiry: check regularly that it's still right

Notion lets you mark a page as verified and set an expiry; when it expires, the owner is notified ([Notion: Wikis & verified pages](https://www.notion.com/help/wikis-and-verified-pages)). Two points from Notion's own usage guide are worth following: don't verify everything, only pages that are referenced often, would cause real problems if outdated, or are the single source of truth for a topic; and set the cycle by how fast the content changes, for example campaign assets monthly and brand guidelines quarterly ([Notion guide](https://www.notion.com/help/guides/verify-knowledge-your-teammates-can-trust-with-page-verification)). It also warns that setting too many pages to verified indefinitely makes the badge stop meaning quality.

Confluence works differently: there's no expiry date; an automation finds verified pages that have been inactive for a while, un-verifies them and emails the owner ([Confluence: Verified pages](https://community.atlassian.com/forums/Confluence-articles/Verified-Pages-Now-Available-in-Confluence/ba-p/2664827)).

**How it fails**: under that same announcement, one user reported that employees who received about a hundred "inactive page" emails started ignoring all email from Confluence; another found that changing the verification status also updates the page's "last updated" date, so almost every page showed the same update date, breaking any rule that used that date to judge staleness. These are users' individual experiences, not research, but they point at one thing: clicking "verify" requires no evidence, and the system can't tell a careful check from a reflexive click.

### 3. Change the docs with the change: docs-as-code

Google's documentation guide says: "Change your documentation in the same CL as the code change." When the code changes, the docs change in the same change ([Google docguide](https://google.github.io/styleguide/docguide/best_practices.html)). Write the Docs' guide to docs-as-code says that managing docs with the same tools as code means you "can" block merging new features that don't include documentation ([Write the Docs: Docs as Code](https://www.writethedocs.org/guide/docs-as-code/)).

GitLab applies this to processes and calls it handbook-first: to change a process, you first open a proposed change to the Handbook, and after it's merged you announce it by posting the link to the change in Slack; changes aren't communicated by slides, email or chat messages. Anyone can propose; the owner approves.

**How it fails**: being in the same place doesn't mean being changed together. The READMEs in Tan's study already lived in the same repo as the code and went through the same process, and they still went out of date. Soft checks are also easy to skip: code.org's maintainers analyzed the pull requests by human authors merged in the first two months of 2026 and found that the checklist in the PR template was almost never actually used; over 99% either left every box unchecked or deleted it outright ([code.org PR #71072](https://github.com/code-dot-org/code-dot-org/pull/71072)). That's the project's own analysis, and it wasn't a documentation-specific checklist. GitLab's co-founder also writes that the biggest problem is people not working handbook-first: when they want to communicate a change, the default is still a Slack message, an email or a meeting.

Hand whatever you can to machines. In 2023 Silva and colleagues analyzed documentation defects for one Ericsson product and found that handwritten deployment and installation guides accounted for over half the defects, while the release notes, generated automatically from a reliable source, had far fewer; the authors conjecture that this was because they were generated automatically ([Silva et al. 2023](https://doi.org/10.1109/techdebt59074.2023.00015)). Reference material such as configuration tables and API specifications shouldn't be handwritten if it can be generated from the code.

### 4. Fix it when it's used: KCS's "reuse is review"

KCS, a knowledge management method from customer support, takes a different route: rather than reviewing on a schedule, articles are reviewed when they're used. Its reasoning is that nobody is better placed to judge an article than the person using it, and that up to 80% of articles are rarely or never reused, so reviewing every one is a waste ([KCS v6: Reuse is Review](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/030/040/020)). Users follow the rule "flag it or fix it" ([KCS v6: Flag It or Fix It](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/030/040/030)): if they're confident and have permission, they fix it; if not, they flag it for someone who knows.

KCS directly conflicts with the approaches above on one point: it says "individual ownership of articles is death to successful knowledge management practices", because articles that belong to someone make others afraid to edit them. My reading is that they deal with different content: KCS manages large volumes of frequently used support knowledge, one issue per article; owners and verification expiry suit a small number of formal documents where mistakes matter, such as policies and SOPs. KCS itself makes an exception for policy and regulatory articles, which only designated people can edit.

**How it fails**: articles nobody uses never get reviewed, so errors in them go unnoticed; and people who follow a wrong article without realizing it won't report anything.

## Delete or archive

Here the two sides give opposite advice. Google's documentation guide says "Dead docs are bad." Its approach: first delete what you're certain is wrong and ignore what's unclear, and when migrating, default to deleting, since stragglers can always be recovered. KCS says "Archiving an article is better than deleting it." ([KCS v6: Article State](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/040/010/030)): archived articles don't show up in search, but old links still reach them and they can be restored; it also warns that shrinking the knowledge base to fix findability only treats the symptom ([KCS v6: Archiving Old Articles](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/040/010/044)).

My reading is that the two can coexist. Google is talking about engineering docs that are wrong and mislead people; KCS is talking about records that are correct but rarely used. So my rules are:

- **Certainly wrong: delete it.** Or fix it until it's right. Keeping it only misleads people.
- **Correct but unused: archive it.** For example old meeting notes and finished projects.
- **Superseded decision records: neither delete nor archive.** As in order 8, mark them superseded and link to the new one.
- **Unsure: find the owner first.** If you can't find one, that's the first thing to fix about the page.

Incidentally, in Tan's study, deleting the whole document was the least common way outdated references got resolved; updating the docs or the code being changed back were more common. Deleting isn't people's first instinct, so write the rules down in advance.

## Example: a maintenance table

| Document type | Responsible role | How and how often it's checked | When to delete or archive |
|---|---|---|---|
| How-to guides (deployment, setup) | The system's on-call | Changed in the same change when the process changes; also verified quarterly | When the system is retired, following it would fail: delete it or reduce it to a one-line pointer to the new doc; fix immediately if a step is wrong |
| Reference (APIs, parameter tables) | The service's tech lead | Generated from code where possible; handwritten parts reviewed with the code | Follows versions; archive old versions |
| New-hire tutorials | The manager who onboards new hires | Each new hire reports where they got stuck, fixed on the spot | If no new hire has used it in six months, check whether it's still needed |
| Policies and rules (leave, travel) | HR | Updated as soon as a rule changes; also verified yearly | When replaced by a new rule, rewrite the original page rather than opening a new one |
| Decision records (ADRs) | The team the decision-makers belonged to | No scheduled review; write a new one when reversed | Never delete; mark superseded |
| Meeting notes | The meeting's host | Not reviewed | Move to the archive after three months |

## Example: one cleanup of stale pages

Suppose you open the wiki's page list and sort by "last updated" (if changing the verification status also bumps this date in your tool, sort by last content edit instead). The five oldest pages are:

1. **"Jenkins deployment process"**, untouched for two years: the system has been replaced, so the content is certainly wrong. Delete it, or reduce it to one line linking to the new deployment doc.
2. **"2024 Q2 planning meeting"**: correct but no longer needed. Move it to the archive.
3. **"API error code table"**, untouched for a year: unclear whether it's still right, and the owner field names a colleague who has left. First find who currently owns the service, ask them to confirm it, and change the owner to a role.
4. **"Why we chose PostgreSQL"**: a decision record, old but not wrong. Keep it.
5. **"New hire FAQ"**: half the questions still apply, half are outdated. As order 6 suggested, move the valid questions to the matching pages and archive this one.

The third page is the hard kind. The IT staff Grudin and Poole interviewed said the same: when clearing out old wikis, the hard part was telling whether anyone still used one; only when the contributors had left the company did they feel fairly confident deleting it.

## Limits of the research

In the software engineering and knowledge management research, I found no study that directly compares teams with and without verification expiry, or with and without owners, on documentation quality. Notion, Confluence, GitLab, Google, Write the Docs and KCS all describe their own practices, with no outcome data attached. Tan looked only at public GitHub projects, and Torkki and Silva are each a single-company case.

## What you can do tonight

1. **List the ten most important pages on your team wiki.** Write the responsible role on each, not just a name.
2. **Choose a way to check each of the ten.** Change it with the change, verify it on a schedule, or fix it when it's used; for scheduled verification, set the cycle by how fast it changes.
3. **Sort to find the five oldest pages and handle them with the four rules above.** Delete what's certainly wrong, archive what nobody uses, and find the owner for anything you're unsure about.
4. **Add a line "documents I own" to your handover checklist.** That way, whoever takes over next knows these pages are now theirs.

## Self-check

**Q:** A page's owner has left. What should you do?

**How to judge:** First hand the page to whoever takes over their work, then change the owner to a role, such as "frontend on-call", rather than another person's name; next time someone changes jobs, the page follows the role and nothing breaks. The prevention is to put documents in the handover checklist: when someone leaves or moves, they list the pages they own and hand them over along with the work. If your tool's owner field only takes people, also write the role at the top of the page.

## References

- [Grudin & Poole 2010, Wikis at Work: Success Factors and Challenges for Sustainability of Enterprise Wikis (WikiSym 2010)](https://doi.org/10.1145/1832772.1832780)
- [Tan, Wagner & Treude 2024, Detecting outdated code element references in software repository documentation (Empirical Software Engineering)](https://doi.org/10.1007/s10664-023-10397-6)
- [Torkki, Penttinen, Rinta-Kahila & Ruissalo 2024, Recommendations for Dealing with Unexpected Challenges in Paying Back Documentation Debt (ICIS 2024)](https://aisel.aisnet.org/icis2024/practitioner/practitioner/8/)
- [GitLab Handbook: Handbook Usage](https://handbook.gitlab.com/handbook/about/handbook-usage/)
- [GitLab Handbook: Directly Responsible Individuals](https://handbook.gitlab.com/handbook/people-group/directly-responsible-individuals/)
- [Notion: Wikis & verified pages](https://www.notion.com/help/wikis-and-verified-pages)
- [Notion: Verify knowledge your teammates can trust](https://www.notion.com/help/guides/verify-knowledge-your-teammates-can-trust-with-page-verification)
- [Confluence: Transfer ownership of your content item](https://support.atlassian.com/confluence-cloud/docs/transfer-ownership-of-your-content-item/)
- [Atlassian Community 2024, Verified Pages - Now Available in Confluence](https://community.atlassian.com/forums/Confluence-articles/Verified-Pages-Now-Available-in-Confluence/ba-p/2664827)
- [Google docguide: Best practices](https://google.github.io/styleguide/docguide/best_practices.html)
- [Write the Docs: Docs as Code](https://www.writethedocs.org/guide/docs-as-code/)
- [code.org PR #71072, Trim Pull Request template (2026)](https://github.com/code-dot-org/code-dot-org/pull/71072)
- [Silva, Unterkalmsteiner & Wnuk 2023, Towards identifying and minimizing customer-facing documentation debt (TechDebt 2023)](https://doi.org/10.1109/techdebt59074.2023.00015)
- [KCS v6 Practices Guide: Reuse is Review](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/030/040/020)
- [KCS v6 Practices Guide: Flag It or Fix It](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/030/040/030)
- [KCS v6 Practices Guide: KCS Article State](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/040/010/030)
- [KCS v6 Practices Guide: Archiving Old Articles](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/040/010/044)

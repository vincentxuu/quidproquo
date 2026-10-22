---
title: "Information Architecture: Organizing a Team Wiki by Department or by Task, and How to Test It"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, wiki, information-architecture, card-sorting]
lang: en
tldr: "A common team-wiki argument is whether to organize by department or by task. The research is more cautious than you might expect: employees who know the org chart were actually faster on an intranet organized by department, and label quality mattered far more than the organizing scheme. A safer approach: give the main structure a scheme where every page has an owner, then add a few task-based entry pages that hold only links, and title pages with the words readers will search for. Before organizing, use card sorting to learn how readers think; afterwards, use tree testing to check whether they can find things."
description: "Building Knowledge Bases, order 7: research and trade-offs on organizing by department versus by task, how the GitLab Handbook does it, how to title pages, how to run card sorting and tree testing and how many people you need, and two trees for the same set of documents."
series:
  name: "Building Knowledge Bases"
  order: 7
---

> 🌏 [中文版](/posts/learning/2026-10-22-team-wiki-information-architecture)

A new hire wants to know how to apply for a business trip. They open the company wiki and the top level reads "HR", "Finance", "Admin", "Engineering". Which one handles business trips? The application form is under Finance, the policy under HR, and the flight-booking process under Admin. Each department has written up its own part well, yet the new hire has to open three places to piece together the answer.

This is the second post in the team part of "Building Knowledge Bases". [Order 6](/posts/learning/2026-10-22-team-wiki-why-it-rots-en) covered why team wikis rot and which kinds of documents to write; this post covers how to arrange those documents into layers and name them so new hires can find them. How to write the page content is order 8. By the end you'll be able to sketch a two-level structure for your team wiki, use card sorting to learn how readers group things, and check it with tree testing.

## By department, or by task

**The case for organizing by task rests mainly on observation, not controlled experiments.** Nielsen Norman Group (NN/g), which has studied company intranets for many years, observed that intranets organized by task survive reorganizations better than those organized by department, because where content sits doesn't depend on who owns or wrote it ([NN/g 2014](https://www.nngroup.com/articles/intranet-information-architecture-ia/)). Their 2024 guidelines, drawn from 57 intranets, also say that organizing information by department makes it hard to find ([NN/g 2024](https://www.nngroup.com/articles/intranet-usability-guidelines/)). NN/g does acknowledge, though, that organizing by department makes maintenance easy: everyone knows who each section belongs to.

**The experimental evidence actually leans toward departments.** In 2007 Cozijn and colleagues ran an experiment in one company's marketing department: the same intranet content, organized by department for one group and by job task for the other ([Cozijn et al. 2007](https://doi.org/10.2190/382G-91T8-T06R-2L52)). The task group's search time, from first click to finding the information, was more than double; the researchers attribute this to participants knowing the org chart. Errors didn't differ significantly between the groups, but with fewer than ten people per group, that doesn't show the two schemes are equally accurate. The task group got faster after a few questions, but the study didn't directly test whether the groups ended up level, and the authors themselves say it's unclear whether that learning cost pays off.

The two versions also differed in link wording: noun phrases for departments, verb phrases for tasks. One subtask was dropped because the task version's labels misled participants, and the authors note that task-based labels need special care. The experiment had only 20 participants, all marketing staff who knew the company's org chart well.

**Labels matter more than the organizing scheme.** In 2004 Resnick and Sánchez varied both the organizing scheme and the label quality of shopping websites ([Resnick & Sánchez 2004](https://doi.org/10.1518/hfes.46.1.104.30390)). Label quality clearly affected completion time, errors and satisfaction. The organizing scheme made no significant difference to completion time; its effects on errors and satisfaction showed up mainly when the labels were poor, with the product-organized version doing better. Another finding worth noting: the researchers first had a separate group do a card sort, and most of them grouped by task, yet in actual use the task-organized version wasn't faster. The way users group things themselves isn't necessarily the one they're fastest with.

**GitLab chose function, and admits it's counter-intuitive.** GitLab's public [Handbook](https://handbook.gitlab.com/) runs to over three thousand pages, with the top level organized by function. Their reasoning is that this way every piece of content has a place and an owner who keeps it up to date, and they admit that "Adhering to this hierarchy is sometimes counter-intuitive." ([Handbook Usage](https://handbook.gitlab.com/handbook/about/handbook-usage/)). To compensate, they require specific, searchable titles, and every page has search at the top; when a different angle is needed, such as onboarding, they make a page that only links and doesn't copy content. They explicitly avoid pages like FAQs and quick links.

## Conclusion: let ownership shape the main structure, and let readers' tasks shape the entry pages

Putting these together, my suggestion is:

1. **Give the main structure a scheme where every page has an owner.** For most teams that means by department or function; if your wiki belongs to a single team, read "department" as the sub-team, system or person responsible. This is the "who maintains it" problem from order 6; the organizing scheme should help with it, not fight it. The cost is that pages have to move when the organization changes; leave redirects when you move them, and the entry pages won't break.
2. **Add a few task-based entry pages.** For example "First week", "Business trips", "Taking leave", holding only links that point to each department's original pages. The content exists once; the entry points can be many.
3. **Put most of your effort into labels.** Page titles and folder names should use the words readers will search for.

Here the two sources disagree: NN/g's 2024 guidelines list a glossary and well-named quick links as useful navigation, while GitLab explicitly doesn't make them. GitLab's stated reasons are that such pages are hard to keep up to date and don't fit an organization by function. My reading is that GitLab's worry is answers getting copied and then never updated; entry pages that hold only links, no content, avoid that problem.

## How to title pages

When readers search or browse the table of contents, the title is usually the first thing they see. A few principles I follow:

- **Use the words readers will search for, not internal codes.** "Business trip application" beats "Finance form F-07"; "Taking leave" is easier to find than "Leave category administration rules".
- **Say what the content is, not when it was written.** "Q3 meeting notes" tells you a time; readers are looking for the decisions made in the meeting.
- **One page, one thing, and the title names it.** If the title needs "and" to join three things, it probably should be three pages.

## Card sorting and tree testing

These two methods belong at different points: before you organize (or reorganize), card sorting shows how readers group things; once you have a structure, tree testing checks whether readers can find things in it.

**Card sorting**: write page titles on cards and have participants group them and name the groups themselves ([NN/g Card Sorting](https://www.nngroup.com/articles/card-sorting-definition/)).

- **Number of cards**: NN/g recommends 30 to 50, so participants don't get tired and start grouping carelessly. That's their rule of thumb, not an experimental result.
- **Open sorts first**: let participants decide what groups exist. To check an existing structure, NN/g recommends tree testing instead.
- **NN/g's recommended sample**: at least 15 people for qualitative studies; 30 to 50 for quantitative ones.
- **The original study's sample**: the often-cited study by Tullis and Wood concluded 20 to 30 ([Tullis & Wood 2004](https://www.researchgate.net/publication/254164354_How_Many_Users_Are_Enough_for_a_Card-Sorting_Study)); that was a single case, one company's intranet.
- **Remember Resnick's finding**: a card sort tells you how readers *think* things should be grouped, not that this grouping is the easiest to find things in.

**Tree testing**: write the structure out as a plain-text tree with no design, give participants a task ("You need to apply for a business trip. Where would you click?"), and see where they end up ([NN/g Tree Testing](https://www.nngroup.com/articles/tree-testing/)).

- **Put the correct answers at the lowest level**, not on an upper category that also has its own page.
- **Watch the first click**: a correct first click on the top-level category often predicts whether people will find the answer in the end.
- **Baseline**: NN/g cites a review of 98 tree tests in which the median task success rate was 62% ([NN/g Tree Testing Part 2](https://www.nngroup.com/articles/interpreting-tree-test-results/)). The best baseline is still your own previous version's results.
- **Target**: for the most critical tasks, NN/g recommends a success rate above 90%.
- **The tool affects the results**: Kuric and colleagues compared several tree-testing interfaces in 2025, and on hard tasks, switching the interface can change the results ([Kuric et al. 2025](https://doi.org/10.1016/j.infsof.2025.107740)). When comparing two versions of a structure, use the same tool.

## Example: two trees for the same set of documents

Suppose you have these pages: business trip application form, business trip policy, flight-booking process, leave policy, leave request form, new hire laptop setup, onboarding paperwork, expense claims, deployment SOP, API docs.

```text
By department (main structure)        Task-based entry pages (links only)
├── HR                                ├── First week
│   ├── Leave policy                  │   ├── → Onboarding paperwork
│   ├── Leave request form            │   ├── → New hire laptop setup
│   ├── Business trip policy          │   ├── → Leave policy
│   └── Onboarding paperwork          │   └── → Expense claims
├── Finance                           ├── Business trips
│   ├── Business trip application     │   ├── → Business trip policy
│   └── Expense claims                │   ├── → Business trip application
├── Admin                             │   ├── → Flight-booking process
│   └── Flight-booking process        │   └── → Expense claims
└── Engineering                       └── Taking leave
    ├── New hire laptop setup             ├── → Leave policy
    ├── Deployment SOP                    └── → Leave request form
    └── API docs
```

On the left, every page has one owning department; the three entry pages on the right hold no content and only point back to the left. When the business trip policy changes, you only update the HR page; the entry page doesn't need to change. Entry pages still need an owner, though: when pages are added, moved or deleted, someone has to update the links.

## Limits of the research

Direct comparisons of department and task organization are rare, both experiments above were small, and Resnick's was a shopping site, where a "task" means a shopping goal, not a work task. In English-language research since 2020, I haven't seen an experiment directly comparing the two schemes. NN/g's recommendations mostly come from their observations, and the public articles don't include comparison data.

## What you can do tonight

1. **List the five questions new hires ask most.** For each, count how many pages and departments the answer is spread across.
2. **For any answer spread across three or more pages, make an entry page.** Links only, no copied content.
3. **Retitle the three hardest-to-search pages.** Use the words a new hire would actually type into the search box.
4. **Run a small tree test.** Write out your wiki's top two levels as plain text, find three new hires, give them five tasks, and note where their first click goes. Three people can show you where people go wrong, but not a success rate, so don't compare it with the 62% figure.

## Self-check

**Q:** Is a page titled "Q3 meeting notes" easy to find?

**How to judge:** It depends on the reader. People who attended may remember it was Q3, but a new hire doesn't know the meeting happened; they'll search for what they want to know, such as "what changed in the business trip policy", so for them it's hard to find. A better approach: keep meeting notes in an archive by date; if the meeting changed a policy, update the business trip policy page itself; if you want to record why, write a separate decision record (order 8 covers how) and link the two.

## References

- [NN/g 2014, Intranet Information Architecture (IA) Trends](https://www.nngroup.com/articles/intranet-information-architecture-ia/)
- [NN/g 2024, Intranet Usability Guidelines: New Findings From 57 Intranets](https://www.nngroup.com/articles/intranet-usability-guidelines/)
- [Cozijn, Maes, Schackman & Ummelen 2007, Structuring job related information on the intranet: An experimental comparison of task vs. an organization-based approach (Journal of Technical Writing and Communication)](https://doi.org/10.2190/382G-91T8-T06R-2L52)
- [Resnick & Sánchez 2004, Effects of organizational scheme and labeling on task performance in product-centered and user-centered retail Web sites (Human Factors)](https://doi.org/10.1518/hfes.46.1.104.30390)
- [GitLab Handbook](https://handbook.gitlab.com/)
- [GitLab Handbook: Handbook Usage](https://handbook.gitlab.com/handbook/about/handbook-usage/)
- [NN/g 2024, Card Sorting: Uncover Users' Mental Models for Better Information Architecture](https://www.nngroup.com/articles/card-sorting-definition/)
- [Tullis & Wood 2004, How Many Users Are Enough for a Card-Sorting Study? (UPA 2004)](https://www.researchgate.net/publication/254164354_How_Many_Users_Are_Enough_for_a_Card-Sorting_Study)
- [NN/g 2023, Tree Testing: Evaluate Menu Labels and Categories](https://www.nngroup.com/articles/tree-testing/)
- [NN/g 2024, Tree Testing Part 2: Interpreting the Results](https://www.nngroup.com/articles/interpreting-tree-test-results/)
- [Kuric, Demcak & Krajcovic 2025, Validation of information architecture: Cross-methodological comparison of tree testing variants and prototype user testing (Information and Software Technology)](https://doi.org/10.1016/j.infsof.2025.107740)

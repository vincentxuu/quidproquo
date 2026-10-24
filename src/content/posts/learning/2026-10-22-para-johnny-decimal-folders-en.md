---
title: "Where to Put Things: PARA, Johnny.Decimal, and Whether to Use Folders at All"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, personal-information-management, para, johnny-decimal]
lang: en
tldr: "For files people create themselves, research keeps finding that most retrieval happens by clicking through folders, and better search tools haven't changed that much; few people use tags, and those who do mostly apply just one. So notes are worth organizing, but each note needs only one main home, the structure shouldn't get too deep, and folders shouldn't get too full. PARA sorts things by how close they are to your current work, Johnny.Decimal allows at most ten per level and fixes each item's place with a number; the numbers in both are their authors' experience, not experimental findings."
description: "Building Knowledge Bases, order 2: why research on folders vs. search reaches opposite conclusions for files and email, tags and tools like Notion that have no folders, how deep and how full folders should be, how PARA and Johnny.Decimal divide things up, and what the same files look like under each."
series:
  name: "Building Knowledge Bases"
  order: 2
---

> 🌏 [中文版](/posts/learning/2026-10-22-para-johnny-decimal-folders)

Once your notes pile up, the question arrives sooner or later: should you make folders? One camp says categorizing is a waste of time because search finds everything; the other says anything uncategorized might as well not exist. Both can point to research, because the research looks at different things.

Beyond the research, the two most recommended schemes are PARA and Johnny.Decimal. PARA, from Tiago Forte, sorts things by how close they are to your current work, into projects, areas, resources and archives. Johnny.Decimal, from Johnny Noble, allows at most ten items per level and gives everything a fixed number such as `15.52`.

This is the second post in the personal part of Building Knowledge Bases. [Order 1](/posts/learning/2026-10-22-what-to-keep-collecting-is-not-knowledge-en) covered what's worth keeping; this one covers where it goes once it's in. By the end you'll be able to decide whether your material calls for folders, numbers or search, and whether and how to reorganize the folders you already have.

## What the research says: files and email point opposite ways

**For their own files, most people click through folders.** Ofer Bergman of Bar-Ilan University in Israel and his collaborators have studied this for years. In a 2010 study, 296 people tried to retrieve recently used files on their own computers; they found 94% of them, and successful retrievals took about 15 seconds on average ([Bergman et al. 2010](https://doi.org/10.1002/asi.21415)). A 2008 study surveyed over 700 Windows and Mac users: by their own estimates, folder navigation accounted for more than half of their retrievals and search for 15% at most ([Bergman et al. 2008](https://doi.org/10.1145/1402256.1402259)).

Better search tools didn't change this much. The same study followed Windows users who installed Google Desktop: search rose in the first few weeks, but seven months later it was back near its earlier level overall, by which time more than a third had uninstalled the tool. The authors' explanation is that people search only when they've forgotten where something is, which happens in at most about a quarter of cases.

A minority does rely mainly on search. Bergman and Dvir estimated in 2024 that about 8% of people are "hyper-searchers", but not because search works better for them: their folders are messier, and navigation often fails ([Bergman & Dvir 2024](https://doi.org/10.1080/07370024.2024.2379838)). The authors see this group as an exception whose reasons actually strengthen the rule.

**Email is the opposite.** As [order 0](/posts/learning/2026-10-22-knowledge-base-three-readers-en) mentioned, Whittaker and colleagues at IBM Research found that people who filed their email diligently were no better at finding messages. In their data, about six in ten re-finding actions were simply scrolling the inbox, while opening folders accounted for little more than one in ten ([Whittaker et al. 2011](https://doi.org/10.1145/1978942.1979457)). Bergman and Dvir's participants were the same: by their own estimates, they used search for over 40% of email retrievals but under 10% of file retrievals.

Why the difference? Files are things you create, name and place yourself; email arrives from other people, in volume, with names you didn't choose. Notes are more like files: you wrote them and you put them somewhere, so you usually remember where. A 2025 interview study of seven researchers who use Obsidian also found that they relied mainly on folders, tags and search day to day ([Ferreira et al. 2025](https://arxiv.org/abs/2509.20187)). So I don't think the email findings transfer directly to notes, though note apps themselves haven't been studied at this scale.

## How deep and how full

Bergman's 2010 data also shows what folders should look like. The files participants looked for sat on average 2.86 levels deep. Files on the desktop were fastest to retrieve, at about 6 seconds, and the first level took about 12; between 2 and 6 levels times were about the same, roughly 16 to 19 seconds, and only at 7 levels and beyond did they clearly slow, to around 25 seconds.

More items in a folder also slowed things down. From their regression, the authors calculated that one extra level costs about as much as 21 extra items in a folder (files plus subfolders), and proposed a rule of thumb: once a folder holds more than about 21 items, it's worth adding a level. That's a suggestion derived from the coefficients, not an optimum found by experiment. Participants' folders held about 22 items on average, but the median was only 15: half held fewer than 15 items, and the average was pulled up by a few very large folders. So what to watch is those few unusually full folders.

In practice:

- **Don't let the tree go seven or more levels deep.** Two or three levels versus four or five makes little difference; what's really slow is a very deep tree.
- **Once a folder reaches twenty-odd items, consider splitting it.** The retrievals that failed or took a detour passed through larger folders on average.
- **Keep search as the backup.** Search when you've forgotten where something is. PARA's author Forte says the same: search is always there as a backup for finding what you've misplaced ([Forte 2017, Part 2](https://every.to/forte-labs/para-part-2-operations-manual-540234)).

## Tags, and tools without folders

If a note can belong to two topics at once, why not use tags? The research answer is that people think tags are a good idea but rarely use them. A 2013 paper by Bergman's team reports two studies, one in Gmail and one in Windows 7, in which participants could use folders and tags side by side. A companion paper by the same team summarizes the results: in Gmail only about a third of categorized messages were tag-style, and those who used tags gave more than nine in ten messages a single tag; in Windows 7, during five weeks of free choice, only 6 of 23 participants tagged anything at all. The same paper surveyed 168 students, 77% of whom thought multiple classification was a good idea ([Bergman et al. 2013](https://doi.org/10.1002/meet.14505001029)). The authors' explanation is that "this note is in folder X" is easier to remember than "this note can be found with tags X, Y or Z".

Results for finding things with tags are mixed. In a controlled retrieval task in the team's Windows 7 study, run right after participants had been asked to use tags for two weeks, retrieving with tags was significantly slower, and failed more often, though the latter difference was only close to significant ([Bergman et al. 2013, JASIST](https://doi.org/10.1002/asi.22906)). Civan and colleagues, on the other hand, had 10 people organize articles with folders and with tags over five days, and found no difference in how fast they could re-find them ([Civan et al. 2008](https://doi.org/10.1002/meet.2008.1450450214)). The difference is in the trade-offs: choosing one folder takes more thought than choosing a few tags, but tags overlap, so when you've forgotten where something is you can't simply check each one in turn. The authors' conclusion is that you want a little of both.

Tools like Notion don't have folders in the usual sense. According to Notion's help center (as of October 2026), it replaces folders with pages inside pages, and uses database properties and multiple views to let the same page appear under several groupings ([Notion Help](https://www.notion.com/help/create-a-subpage)). Obsidian has folders, tags and links all at once.

Whatever the tool, a workable approach: **give each note one main home**, whether a folder or a parent page in Notion, and **use tags only for cross-cutting status**, such as "to read" or "in progress", not as a substitute for categories. As for a note that relates to two topics at once, the better answer is links, which is the subject of [order 3](/posts/learning/2026-10-22-zettelkasten-evergreen-notes-moc-en).

## PARA: four categories by actionability

[PARA](https://fortelabs.com/blog/para/) rejects school-style subject folders like "Marketing", "Psychology" or "Ideas". Forte argues for sorting by actionability: how close something is to what you're trying to get done now. The 2017 original gives the most precise definitions ([Forte 2017](https://every.to/praxis/the-para-method-a-universal-system-540221)):

| Category | Definition | Examples |
|---|---|---|
| Projects | A series of tasks linked to a goal, with a deadline | An April climbing trip to Japan, a website redesign |
| Areas | A sphere of activity with a standard to be maintained over time | Health, finances, team hiring |
| Resources | A topic or theme of ongoing interest | Climbing technique, coffee, Japanese |
| Archives | Inactive items from the other three | Last year's projects, an area you handed over when you left a job |

The pair people mix up most is Areas and Resources. Forte's test is whether you're responsible for it or merely interested in it: things you're responsible for go in Areas, things you're interested in go in Resources ([Forte 2017, Part 2](https://every.to/forte-labs/para-part-2-operations-manual-540234)).

PARA isn't done once you've made four folders. Forte calls it a dynamic system in which things flow between the categories, most often from Projects to Archives when a project ends. He also advises against scheduled reorganizing of the whole structure in favor of doing it opportunistically: when you're already looking through a project's notes, move whatever is misfiled. That doesn't conflict with order 1's weekly inbox clearing: clearing the inbox puts new things in place, while what Forte argues against is scheduling time to restructure the old ones.

**Example: the life of "April climbing trip to Japan".** Before you leave, it's a Project holding flight details, crag information and a gear list. When you get back, spend ten minutes pulling out what you'll use again: the notes on the Ogawayama crags go to Resources under "Climbing", and the overseas gear checklist goes to Areas under "Travel". The rest of the folder moves to Archives.

## Johnny.Decimal: at most ten per level, places fixed by number

[Johnny.Decimal](https://johnnydecimal.com/10-19-concepts/11-core/11.01-introduction/) has only three levels:

- **Areas**: at most 10, numbered `10-19`, `20-29` and so on.
- **Categories**: at most 10 per area, for example `15 Travel`.
- **IDs**: at most 100 per category, always two digits, a decimal point and two digits, for example `15.52 April climbing trip to Japan`.

Things live only in IDs; areas and categories are just shelving. Noble calls "no more than ten" the heart of the system, for three reasons: fewer choices per level mean you look in the right place; adding a category should take some thought ("Creating a new category should be something that takes time," as [he puts it](https://johnnydecimal.com/documentation/philosophy)); and numbers, unlike alphabetical order, don't shift when you add a folder, so you learn where things are.

The part people often miss is the index. "The index is your Johnny.Decimal system," [Noble says](https://johnnydecimal.com/documentation/the-jdex). Your things are scattered across files, email, cloud storage and note apps, but they share one ID, and an index records where each ID lives. That's why a category can hold close to a hundred IDs without being split (`.00` to `.09` are reserved for system uses such as the inbox and index, so ordinary content starts at `.11`): you find things by number and index, not by opening folders one at a time. If you browse rather than look things up in the index, the "split at twenty-odd items" advice above still applies.

Noble also admits [some cases don't fit](https://johnnydecimal.com/documentation/expand-an-area-overview): students and teachers with more than ten courses or terms, or freelancers with many clients and jobs, run out of room under the ten-item limit.

## The same files, two trees

Say you have: the inbox from order 1, the Japan climbing trip, an overseas gear checklist, an annual health checkup report, tax documents, notes on climbing technique, coffee brewing notes, and last year's website redesign project.

```text
PARA                                Johnny.Decimal
├── 0 Inbox                         00-09 System
├── 1 Projects                      │   └── 00 System
│   └── April Japan climbing trip   │       └── 00.01 Inbox
├── 2 Areas                         10-19 Life
│   ├── Health (checkup report)     │   ├── 11 Health
│   ├── Finances (taxes)            │   │   └── 11.11 Annual checkup
│   └── Travel (gear checklist)     │   ├── 12 Money
├── 3 Resources                     │   │   └── 12.11 Taxes 2026
│   ├── Climbing technique          │   └── 15 Travel
│   └── Coffee brewing              │       ├── 15.11 Overseas gear checklist
└── 4 Archives                      │       └── 15.52 April Japan climbing trip
    └── Website redesign 2025       20-29 Interests
                                    │   ├── 21 Climbing
                                    │   │   └── 21.11 Climbing technique
                                    │   └── 22 Coffee
                                    │       └── 22.11 Brewing notes
                                    30-39 Work
                                        └── 31 Projects
                                            └── 31.14 Website redesign 2025
```

PARA sorts by how close something is to your current work, so the Japan trip moves house once it's over; Johnny.Decimal sorts by what something is, so the Japan trip stays at `15.52` forever and simply stops being opened. PARA suits people whose projects come and go and who want their current work in plain view; Johnny.Decimal suits people whose kinds of material are stable and who want places that never change. Both stay within three or four levels.

## How to choose

| Your situation | Suggestion |
|---|---|
| Few notes, or search finds almost everything | Don't categorize yet; an inbox plus search is enough |
| Your projects keep changing | PARA |
| Your kinds of material are stable, and you want fixed places and one number shared across tools | Johnny.Decimal |
| You use Notion | Parent pages as each note's main home, database properties as tags; either scheme works |
| You already have a very deep, messy tree | See path B under "What you can do tonight" below |

Neither author cites research for their numbers. Forte says PARA shouldn't go more than four levels deep and admits that "whether or not it's a real limit, it is a useful constraint" ([Forte 2017](https://every.to/praxis/the-para-method-a-universal-system-540221)); Johnny.Decimal's ten per level is likewise a design choice. What the research supports is only the direction: not too deep, not too full.

## Limits of the research

Bergman's studies looked at computer files, mostly Windows and Mac data collected in the late 2000s, from university students and staff as well as older members of Mac user groups, and tested only recently used files, not old ones that hadn't been opened in a long time. Research on individual differences finds that personality and spatial ability barely predict how someone organizes files, while the operating system matters more ([Dinneen & Frissen 2020](https://doi.org/10.1145/3334480.3382944)). Folders, tags and links inside note-taking apps haven't been studied at comparable scale.

## What you can do tonight

If you have very few notes, just make an inbox and categorize later, once things pile up. If you already have a tree, work out which case you're in:

**A. The tree isn't messy, and you want PARA.** Adjust it to the new rules directly:

1. Make an inbox and a "Projects" folder, with a subfolder for each current piece of work that has a deadline.
2. Find folders with more than twenty-odd items, and split them into two or three subfolders or move what you no longer use into an archive.
3. If the tree goes seven or more levels deep, merge the levels in the middle that you don't actually use.

**A′. The tree isn't messy, and you want Johnny.Decimal.**

1. Write down no more than ten areas, with no more than ten categories under each.
2. Start an index note, and add a line to it each time you create an ID.
3. Rename existing folders to IDs one at a time as you use them; there's no need to do it all at once.

**B. The tree is already deep and messy, whichever scheme you choose.** Don't reorganize everything at once. [Forte's suggestion](https://fortelabs.com/blog/basboverview/):

1. Move everything you have into one archive folder labeled with today's date.
2. From today, file new things under the new scheme.
3. Move old things over only when you need them.

## Self-check

**Q:** In PARA, does a "Python" folder belong in Areas or Resources?

**How to judge:** Ask whether there's a standard you have to maintain. If you're an engineer responsible for your team's Python style guide, version upgrades or a package you maintain, it's an Area. If you're just interested and read about it now and then, it's a Resource. The same topic can land in different categories for different people, which is exactly what it means for PARA to sort by actionability rather than by subject.

And the notes on the Ogawayama crags? They're climbing technique (a Resource), but they also relate to next year's trip (a Project). A folder lets a note live in only one place; that's where the links in [the next post](/posts/learning/2026-10-22-zettelkasten-evergreen-notes-moc-en) come in.

## References

- [Bergman, Beyth-Marom, Nachmias, Gradovitch & Whittaker 2008, Improved search engines and navigation preference in personal information management (ACM TOIS)](https://doi.org/10.1145/1402256.1402259)
- [Bergman, Whittaker, Sanderson, Nachmias & Ramamoorthy 2010, The effect of folder structure on personal file navigation (JASIST)](https://doi.org/10.1002/asi.21415)
- [Bergman & Dvir 2024, File hyper-searching explained (Human–Computer Interaction)](https://doi.org/10.1080/07370024.2024.2379838)
- [Bergman, Gradovitch, Bar-Ilan & Beyth-Marom 2013, Folder versus tag preference in personal information management (JASIST)](https://doi.org/10.1002/asi.22906) (per the authors' accepted manuscript)
- [Bergman et al. 2013, Tagging personal information: A contrast between attitudes and behavior (ASIS&T 2013)](https://doi.org/10.1002/meet.14505001029)
- [Civan, Jones, Klasnja & Bruce 2008, Better to organize personal information by folders or by tags?: The devil is in the details (ASIS&T 2008)](https://doi.org/10.1002/meet.2008.1450450214)
- [Whittaker et al. 2011, Am I wasting my time organizing email? A study of email refinding (CHI 2011)](https://doi.org/10.1145/1978942.1979457)
- [Ferreira et al. 2025, How People Manage Knowledge in their "Second Brains" (arXiv:2509.20187)](https://arxiv.org/abs/2509.20187)
- [Notion Help: Create a subpage](https://www.notion.com/help/create-a-subpage)
- [Notion Help: Intro to databases](https://www.notion.com/help/intro-to-databases)
- [Tiago Forte, The PARA Method](https://fortelabs.com/blog/para/)
- [Tiago Forte 2017, The PARA Method: A Universal System for Organizing Digital Information](https://every.to/praxis/the-para-method-a-universal-system-540221)
- [Tiago Forte 2017, PARA Part 2: Operations Manual](https://every.to/forte-labs/para-part-2-operations-manual-540234)
- [Tiago Forte, Building a Second Brain: The Definitive Introductory Guide](https://fortelabs.com/blog/basboverview/)
- [Johnny.Decimal: Introduction](https://johnnydecimal.com/10-19-concepts/11-core/11.01-introduction/)
- [Johnny.Decimal: Philosophy](https://johnnydecimal.com/documentation/philosophy)
- [Johnny.Decimal: The JDex](https://johnnydecimal.com/documentation/the-jdex)
- [Johnny.Decimal: Expand an area](https://johnnydecimal.com/documentation/expand-an-area-overview)
- [Dinneen & Frissen 2020, Mac users do it differently: the role of operating system and individual differences in file management (CHI EA 2020)](https://doi.org/10.1145/3334480.3382944)

---
title: "Choosing a Note Tool: Obsidian, Notion, and Whether Your Data Comes With You"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, personal-information-management, note-taking, obsidian, notion]
lang: en
tldr: "Before choosing a note tool, ask five things: can other programs open its files, do links survive renaming, can you search and filter, does it sync across devices, and does it work offline. Obsidian's notes are just Markdown files in a folder on your computer, but syntax such as block references can't be followed outside Obsidian, and on iPhone only two sync methods are officially recommended. Notion's databases are powerful, but an export takes only one view, callouts become HTML, and an export can't simply be uploaded back to restore your workspace. Before switching tools, export once and open the result in another program."
description: "Building Knowledge Bases, order 4: five criteria for choosing a note tool, Obsidian and Notion compared point by point, which syntax stops working outside each tool, whether and how to switch, and how to build order 2 and 3's folders and links in Obsidian."
series:
  name: "Building Knowledge Bases"
  order: 4
---

> 🌏 [中文版](/posts/learning/2026-10-22-obsidian-notion-tool-choice)

[Order 1](/posts/learning/2026-10-22-what-to-keep-collecting-is-not-knowledge-en) gave two examples of read-later services shutting down: Omnivore gave users about a month between its announcement and the end of exports, Pocket about six months. Note tools are no different: the software you're happy with today may not exist in ten years. A 2019 essay from the Ink & Switch lab puts it bluntly: if a service shuts down, the software stops working, and the data you created with it is lost ([Kleppmann et al. 2019](https://www.inkandswitch.com/local-first/)).

This is the fourth post in the personal part of Building Knowledge Bases. The first three covered what to keep, where to put it and how to link it; this one covers what tool holds it all, and whether your data comes with you if you ever switch. By the end you'll be able to assess a note tool against five criteria, decide whether to switch, and build [order 2](/posts/learning/2026-10-22-para-johnny-decimal-folders-en)'s folders and [order 3](/posts/learning/2026-10-22-zettelkasten-evergreen-notes-moc-en)'s links in Obsidian. This post doesn't compare plugins.

## Five questions before choosing a tool

Feature lists keep changing; these five things change less:

| Criterion | The question to ask |
|---|---|
| File format | What are notes saved as? Can another program open them without this one? |
| Links | Can notes link to each other? Do links break when you rename a note? |
| Search and filtering | Can you search full text? Filter by tag or property? |
| Sync | Does it work on phone and computer? Does sync require its own service, or will other sync tools do? |
| Offline | Can you read and write without a network connection? |

These five are my own list. Three of them, working across devices, working offline and keeping your data readable long term, correspond to what the Ink & Switch essay calls "local-first" software: the primary copy of your data lives on your own devices, and servers only help with syncing. The essay lists seven ideals and rates tools such as Google Docs, Dropbox and Git against them, concluding that none meets them all, with Git coming closest; no note-taking app appears in its table. Links and search are additions for the purposes of a knowledge base.

File format is the hardest to fix later. You find out how good the other four are by using the tool; problems with the format only show up on the day you want to switch.

## Obsidian and Notion, point by point

| Criterion | Obsidian | Notion |
|---|---|---|
| File format | Markdown plain-text files in a folder on your computer; other editors can open them | Stored in the cloud; exports to Markdown and CSV, with quite a few limits (see below) |
| Links | Two link formats; renaming a file inside Obsidian updates links by default | Pages can link to each other; databases connect through relations |
| Search and filtering | Tags and properties; Bases provides database-style table views | Databases can be filtered, sorted and grouped by property |
| Sync | Obsidian Sync, or iCloud, Git and others; support differs by platform (see below) | Built in, through Notion's own servers |
| Offline | Files are local, so reading and writing work offline | Not checked against Notion's docs for this post; confirm before relying on it |

## Obsidian: your notes are files in a folder

According to [Obsidian's help docs](https://help.obsidian.md/data-storage) (as of October 2026), notes are stored as Markdown plain-text files in a folder called a vault, on your own computer. Because they're plain text, you can open and edit them in other editors, and Obsidian picks up the changes automatically.

**Sync depends on the platform.** The [sync docs](https://help.obsidian.md/sync-notes) list the options for each platform. On iPhone and iPad, the only recommended options are Obsidian Sync and iCloud; Dropbox, Google Drive and OneDrive are listed as not officially supported, though some users have found workarounds. You can sync with Git too, but it isn't automatic; you push and pull changes yourself. The reason given is that Obsidian needs access to the whole vault for features such as updating links when you rename a file.

**Links come in two forms** ([Internal links](https://help.obsidian.md/links)):

- **Wikilinks**: `[[Don't let a folder tree go seven levels deep]]`, Obsidian's default because it's more compact.
- **Markdown links**: `[Don't let a folder tree go seven levels deep](Don't%20let%20a%20folder%20tree%20go%20seven%20levels%20deep.md)`, which ordinary Markdown tools understand. Spaces in file names have to be written as `%20`.

The docs note that if interoperability matters to you, you can turn off Wikilinks and use Markdown links instead. When you rename a file inside Obsidian, it updates every link pointing to it by default. The docs describe renaming inside Obsidian; if you rename in Finder or another program, don't assume the links will follow.

Backlinks are a built-in core plugin that lists which notes link to the current one ([Backlinks](https://help.obsidian.md/plugins/backlinks)). These relationships are computed by Obsidian from your files and aren't written into the files themselves. At the top of a note you can add properties, written into the file as YAML ([Properties](https://help.obsidian.md/properties)). Since 2025, Obsidian also has a core plugin called [Bases](https://help.obsidian.md/bases) that arranges notes' properties into tables, cards and other views; the view settings are saved in a `.base` file, while the data itself stays in the notes.

**What stops working outside Obsidian.** The docs themselves point out several things:

- **Block references**, such as `[[2023-01-01#^37066d]]`, which link to a single paragraph. In the docs' words: "Block references are specific to Obsidian and not part of the standard Markdown format." Outside Obsidian, the text remains in the file, but the link can't be followed.
- **Wikilinks, comments `%%...%%` and highlights `==...==`**, which the docs say other Markdown apps may show as plain text ([Obsidian Flavored Markdown](https://help.obsidian.md/obsidian-flavored-markdown)).

By the same logic, a link inside a property has to be written as `"[[Some note]]"` and is just a string of text in other tools. So Obsidian's files come with you, but once they do, the links and some formatting are yours to deal with.

Obsidian's CEO, Steph Ango, wrote an essay called "[File over app](https://stephango.com/file-over-app)" arguing that if you want digital work to last, it has to be in files you control, in formats that are easy to retrieve and read. Bear in mind this is a vendor's position. He also writes that it's a delusion to think Obsidian will last forever; what lasts is the files.

## Notion: databases are great, and exports cost you

Notion keeps your data in the cloud, organized as pages and databases (see order 2). Databases can have properties and multiple views, which is where Notion beats plain files. The cost shows up when you export. According to [Notion's export docs](https://www.notion.com/help/export-your-content) (as of October 2026):

- **Formats**: ordinary pages export as Markdown; full-page databases export as CSV, with a separate Markdown file for each entry.
- **One view only**: a database exports only its current or default view, not all views at once.
- **Callouts become HTML**, because Markdown has no equivalent.
- **Permissions**: pages you don't have access to aren't exported, and Enterprise admins can disable exporting. If you're not an admin, you may not be able to export the whole workspace.
- **No way back**: in Notion's words, "You can't instantly recreate your workspace by reuploading your exported workspace content."

The docs don't say what relations, rollups or @mentions inside pages turn into when exported; you'll only know by exporting once yourself. The [import docs](https://www.notion.com/help/import-data-into-notion) say that a CSV import can't create relations, rollups or formulas, which have to be rebuilt afterwards, and that nonstandard Markdown extensions aren't imported.

## Whether to switch, and how

**First ask what's actually hurting.** If your main trouble is what orders 1 to 3 cover, such as keeping too much, not finding things, or notes that never connect, a new tool won't fix it; change how you work first. If the trouble is the tool itself, such as data locked in the cloud, unreliable phone sync or exports that don't work, then switching is worth considering.

**From Notion to Obsidian.** The Obsidian team makes an official community plugin, [Importer](https://help.obsidian.md/import/notion), with two methods:

- **Connecting your Notion account** (recommended): databases and formulas are converted to Bases, with each database becoming a folder plus a `.base` file; but only each database's primary view is imported.
- **Importing Notion's .zip export**: no connection needed, but databases aren't preserved. For this route, the docs advise choosing HTML when exporting from Notion rather than Markdown, because the Markdown export omits important data.

**From Obsidian to Notion.** Notion only promises to import standard Markdown, so Obsidian-specific syntax such as wikilinks, block references and embeds probably won't survive. Before switching, convert the notes you want to bring to Markdown links.

## Building order 2 and 3's structure in Obsidian

1. **Folders**: pick a scheme from order 2. For PARA, make `0 Inbox`, `1 Projects`, `2 Areas`, `3 Resources`, `4 Archives`; for Johnny.Decimal, make `00-09 System` / `00 System` / `00.01 Inbox`, then folders for your areas and categories. Order 3's permanent notes and MOCs go in Resources under PARA, or in a dedicated category under Johnny.Decimal.
2. **Link format**: under Files and links in settings, if you care about switching tools later, turn off "Use [[Wikilinks]]" and use Markdown links; make sure "Automatically update internal links" is on.
3. **Use and status**: order 1's first step asks you to name a use, which you can record in a `use` property; order 2 says to use tags only for status, so use tags like `#to-read` and `#in-progress`.
4. **Link reasons**: as in order 3, write one sentence next to each link explaining why. The backlinks panel tells you who links here but won't write the reason for you.
5. **MOCs**: once notes on a topic start to feel messy, make a new note, drop links to the related notes into it, group them, and add a "Not yet worked out" section.
6. **Go easy on block references**: if portability matters to you, link to whole notes or headings where you can.
7. **Back up**: syncing isn't backing up. If you use a sync service, also copy the whole vault folder somewhere else once a quarter.

## Limits of the research

I found no interview or survey study from 2020 to 2026 focused on switching note-taking tools. The closest is a 2024 viewpoint article by Alan Dix, who notes that switching costs go beyond export and import to learning a new tool and giving up the workarounds you've mastered, and that vendors often prefer to keep users on their own platform ([Dix 2024](https://doi.org/10.1080/07370024.2024.2356155)). He describes it himself as a personal viewpoint. The descriptions of both tools' behavior come from their official docs, which change between versions, so check the current docs before relying on them.

## What you can do tonight

1. **Export once.** Whatever tool you use, follow its official steps and export all your notes tonight.
2. **Open the export in another program and check three things.** In the plainest text editor you have, look for text that turned into gibberish, links that can't be followed, and anything that's gone missing. For each problem, note which kind of content caused it.
3. **List the proprietary features you use.** For example, Obsidian's block references, or Notion's relations and rollups. These are what you'll have to handle by hand when you switch; the more you use, the more you should export regularly.
4. **Set a quarterly export reminder.** Tools disappear; the exported files are your backup.

## Self-check

**Q:** Your note tool announces tomorrow that it's shutting down and gives you three months to export. What's left of your notes?

**How to judge:** Look at two things. First, whether the export format is a standard one other programs can open, such as plain text, Markdown, CSV or PDF. Second, how many proprietary features you use: Obsidian's block references stay in the files but can't be followed; Notion's callouts become HTML; what database features like relations and rollups turn into isn't documented, so you'll only know by exporting once. With a standard format and few proprietary features, almost all your notes survive; with a closed format and heavy use of proprietary features, what you take away may be a pile of text that has lost its links.

## References

- [Kleppmann, Wiggins, van Hardenberg & McGranaghan 2019, Local-first software: You own your data, in spite of the cloud (Ink & Switch; Onward! 2019)](https://www.inkandswitch.com/local-first/)
- [Obsidian Help: How Obsidian stores data](https://help.obsidian.md/data-storage)
- [Obsidian Help: Sync your notes across devices](https://help.obsidian.md/sync-notes)
- [Obsidian Help: Internal links](https://help.obsidian.md/links)
- [Obsidian Help: Backlinks](https://help.obsidian.md/plugins/backlinks)
- [Obsidian Help: Properties](https://help.obsidian.md/properties)
- [Obsidian Help: Introduction to Bases](https://help.obsidian.md/bases)
- [Obsidian Help: Obsidian Flavored Markdown](https://help.obsidian.md/obsidian-flavored-markdown)
- [Obsidian Help: Import from Notion](https://help.obsidian.md/import/notion)
- [Steph Ango, File over app](https://stephango.com/file-over-app)
- [Notion Help: Export your content](https://www.notion.com/help/export-your-content)
- [Notion Help: Import data into Notion](https://www.notion.com/help/import-data-into-notion)
- [Dix 2024, The future of PIM: pragmatics and potential (Human–Computer Interaction)](https://doi.org/10.1080/07370024.2024.2356155)

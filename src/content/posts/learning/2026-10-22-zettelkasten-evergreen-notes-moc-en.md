---
title: "How to Link: Zettelkasten, Evergreen Notes and MOCs"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, note-taking, zettelkasten, evergreen-notes]
lang: en
tldr: "After this post you'll be able to rewrite a reading summary as two or three notes that link to each other, and build a map note (MOC) once your notes pile up. The method comes down to four principles: one concept per note, organize by concept rather than by book, write in your own words, and state why you make each link. It goes back to Luhmann's slip box; research supports the idea that generating something yourself beats just reading it, but I found no credible controlled experiment on the Zettelkasten itself."
description: "Building Knowledge Bases, order 3: the difference between literature notes and permanent notes, how Luhmann's slip box actually worked, four principles, structure notes and MOCs, a worked example from one paper to a map, how far the research goes, and whether Obsidian backlinks and AI-suggested links count."
series:
  name: "Building Knowledge Bases"
  order: 3
---

> 🌏 [中文版](/posts/learning/2026-10-22-zettelkasten-evergreen-notes-moc)

Look back over notes you've kept for a few years and most of them are summaries and highlights: what this book said, the main points of that article. You can find them, but they've never helped you think of anything new.

[Order 2](/posts/learning/2026-10-22-para-johnny-decimal-folders-en) was about which folder a note goes in, and it ended with a problem: the notes on the Ogawayama crags are climbing technique, but they also relate to next year's trip, and a folder lets them live in only one place. This post covers the other half: how notes connect to each other. The two work together: folders decide where a note lives, links decide what it relates to. If you use PARA, idea notes can live in Resources; if you use Johnny.Decimal, you can set up a category just for idea notes.

The Ogawayama note itself is reference material and doesn't need rewriting as the kind of permanent note described below. It can stay under climbing technique, with a link from your trip-planning note and one sentence of reason: "read before next year's trip; it has the approach routes to the crags". One note lives in one place and shows up in another context through a link with a stated reason. That's what this post is about.

By the end you'll be able to rewrite a reading summary as two or three notes that link to each other, and, once your notes pile up, build a map note that ties them together.

## Two kinds of notes

This post uses two terms:

- **Literature notes**: what you write down while reading, what this book or article says and where it comes from. They lean on the original, and often don't make sense without it.
- **Permanent notes**: rewritten from literature notes, each covering one claim of your own, in your own words, and understandable without the original.

Most of my own notes stop at the first kind, too. Everything in this post is about turning the first kind into the second, then linking the second kind together.

## How Luhmann's slip box actually worked

The method goes back to the German sociologist Niklas Luhmann. According to the Niklas Luhmann Archive, he accumulated about 90,000 cards between 1952 and early 1997, almost all handwritten ([Niklas Luhmann-Archiv](https://niklas-luhmann-archiv.de/nachlass/zettelkasten)). In his 1981 essay "Communicating with Slip Boxes" he described how it worked ([Luhmann, Communicating with Slip Boxes](https://luhmann.surge.sh/communicating-with-slip-boxes)). There are four key points:

**1. Fixed places, not ordering by topic.** Luhmann said the most important decision was not to arrange cards by topic and subtopic, but to give each card a fixed place instead. Every card gets a number, and once written, the number never changes.

**2. Branches can grow anywhere.** A new thought doesn't have to go at the end. After card 57/12 can come 57/13; to branch off a particular word on 57/12, you write 57/12a, and further in, 57/12a1. The archive notes that in extreme cases numbers grew past a dozen characters, with hundreds of cards inserted between two that were originally neighbors.

**3. Links between cards, often recorded both ways.** Because the numbers are fixed, any card can say "see number such-and-such". Luhmann recommended noting a link back on the card being linked to as you go, and the archive found that long-distance links often have one. With links, he said, where a new card goes matters much less. The archive's sample-based estimate is over 40,000 links across the two boxes.

**4. An index of entry points only.** He kept a keyword index, but each keyword usually listed at most four locations, because once you're in, you follow the links to related cards.

Two things are often left out. First, Luhmann did use topics: his first box had 108 subject areas and his second had 11 large sections, just without a strict hierarchy inside them. Second, the system took a long time to pay off. Luhmann said the slip box needs a number of years to reach critical mass, and until then it's just a container that gives back what you put in.

## Four principles

Advocates have adapted Luhmann's method for digital tools. The most cited are the [zettelkasten.de introduction](https://zettelkasten.de/introduction/) and Andy Matuschak's [Evergreen notes](https://notes.andymatuschak.org/Evergreen_notes), which mostly agree. Together they come down to four principles:

**One concept per note.** Matuschak calls this [atomic](https://notes.andymatuschak.org/zNUaiGAXp21eorsER1Jm9yU): about one thing only, but covering that thing as completely as possible. Brevity isn't the point. Too big, and when a new idea arrives you won't notice where it belongs; too small, and the links fragment along with the notes. He admits there's no clear test, only trade-offs.

**Organize by concept, not by book or project.** If you write one note per book, the same concept ends up scattered across several books' notes, and Matuschak says that way [nothing accumulates](https://notes.andymatuschak.org/z2hQEhqWkdRLL9JUwfawZZx). Organize by concept, and when a second book covers the same idea, you go back to the same note to extend or correct it.

**Write in your own words.** zettelkasten.de lists this among its core rules. Pasting the original gives you an excerpt, a literature note, not a permanent one.

**State why you make each link.** This is the step I skip most often. zettelkasten.de calls it link context: every link should say explicitly why it's there. A bare link with no reason is something you yourself won't understand a few months later. Write "this conflicts with 'Empty the inbox every week' because…" and the link itself becomes an idea.

Matuschak also argues for dense links and for [letting structure emerge](https://notes.andymatuschak.org/z8SU3r8xyZyvwRhyDdJasJ2) rather than imposing categories up front. That sounds like the opposite of the next section, which is about arranging related notes on a single note, but it's really a question of order: write and link first, and once a group of notes has grown enough to show a shape, draw a map for it.

## Structure notes and MOCs: drawing a map of your links

Once you have many linked notes, you need somewhere to arrange a group of related ones. zettelkasten.de calls this a structure note, a note specifically about other notes and how they relate, and considers some hierarchy useful.

Nick Milo of Linking Your Thinking calls it an MOC (Map of Content), and insists it's a thinking tool rather than just a table of contents ([LYT](https://blog.linkingyourthinking.com/notes/mocs-(defn))). When should you make one? Milo gives no number, only a feeling: when your notes on a topic pile up to the point that you start to worry ideas will get lost, which he calls the Mental Squeeze Point.

He builds one in three moves. First, drop links to all the related notes into a new note (gather). Then rearrange, merge and split them, writing new notes as you go (collide). Finally, connect this map to other maps and use it as your way into the whole topic (navigate). He stresses that the three moves aren't linear.

Luhmann already had this idea. The archive records his collection cards, each listing up to 25 links, and zettelkasten.de traces structure notes back to them. Digital tools make it easier, but the concept is the same.

## Example: from one paper to a map

Say you've read the folder study cited in order 2 ([Bergman and colleagues, 2010](https://doi.org/10.1002/asi.21415)).

**Step 1: a literature note.** While reading, write as usual, noting what the paper says and where it's from:

```text
Bergman et al. 2010, JASIST
- 296 people retrieving recently used files on their own computers: 94% found, ~15 s
- Retrieval time about the same from 2 to 6 levels; clearly slower at 7+
- Authors suggest adding a level once a folder passes ~21 items (incl. subfolders); a rule of thumb from the coefficients
- Limitation: only recently used files tested
```

**Step 2: rewrite it as two permanent notes.** Each covers one concept, in your own words, with the claim as its title:

```text
# Don't let a folder tree go seven levels deep
Finding recently used files took about as long at two levels as at six; only at seven and beyond did it clearly slow down.
So there's no need to cram things in just to keep levels down, but don't keep nesting either.
My notes go six levels deep: acceptable, but worth checking whether every level is actually used.
Limitation: only recently used files were tested; old files are unknown.
Source: Bergman et al. 2010
```

```text
# Files you placed are found by location; email by scrolling and search
For files they create, most people click through folders; better search tools haven't changed that.
Email is different: there's a lot of it, people organize their inboxes mainly to manage to-dos, and they mostly find messages by scrolling or searching.
Sources: Bergman et al. 2008, Whittaker et al. 2011
```

The second note draws on two sources: organizing by concept gathers different sources that say the same thing in one place.

**Step 3: link to older notes and say why.** For example, under the second note:

```text
- Links to "Johnny.Decimal fixes places with numbers": fixed places exploit exactly
  the fact that we find what we placed ourselves by remembering where it is.
- Links to "Premature filing": both remind me that organizing is often about
  clearing what's in front of you, not about finding things later.
```

**Step 4: once you have more notes, make an MOC.** When your notes on organizing a personal knowledge base start to feel messy, make one:

```text
# Organizing a personal knowledge base MOC
## What to keep
- Empty the inbox every week
- Saved is not read
## Where to put things
- Don't let a folder tree go seven levels deep
- Files you placed are found by location; email by scrolling and search
- Johnny.Decimal fixes places with numbers
## Not yet worked out
- Is using tags only for status enough?
```

That last section, "Not yet worked out", matters: besides arranging what you have, an MOC is where you list what to think about next.

## How far the research goes

**"Your own words" has indirect support.** Memory research has a robust finding called the generation effect: answers you produce yourself are remembered better than ones you only read. Bertsch and colleagues pooled 86 studies in 2007 and found that generated material was remembered about 9 percentage points better on average ([Bertsch et al. 2007](https://doi.org/10.3758/BF03193441)); McCurdy and colleagues pooled 126 studies in 2020, and the effect survived correction for publication bias ([McCurdy et al. 2020](https://doi.org/10.3758/s13423-020-01762-3)). That supports the direction "producing it yourself beats just reading it". The limits: participants in a lab filled in a word or solved a problem rather than writing notes; with meaningless material the effect was close to zero; and generating by writing or typing produced a smaller effect than generating aloud. So it doesn't directly show that writing permanent notes has the same benefit. Research on note-taking itself isn't any clearer: a study that repeated a well-known handwriting experiment found that the link between taking notes in your own words and test scores was unstable, and its authors warn it is only a correlation ([Urry et al. 2021](https://doi.org/10.1177/0956797620965541)).

**For links, the evidence is about saying clearly where they go.** Reviewing hypertext reading studies in 2007, DeStefano and LeFevre found that the effect of the number of links was inconsistent across studies; adding lateral semantic links slowed readers' information-finding in four of five studies; but links labeled with their destination's content helped ([DeStefano & LeFevre 2007](https://doi.org/10.1016/j.chb.2005.08.012)). Madrid and colleagues compared 3 and 8 links per page in 2009, with the extra five chosen at random, and found no difference in cognitive load or learning ([Madrid et al. 2009](https://doi.org/10.1016/j.chb.2008.06.005)). In all these studies participants were reading hypertext someone else had built, once, not tending their own note collection. What carries over is that a link should make clear what it leads to, which points the same way as stating why you made it.

**For the Zettelkasten itself, I found no credible controlled experiment.** Searching the English-language literature from 2024 to 2026, I found no credible experiment comparing the Zettelkasten, atomic notes or MOCs with other approaches. One 2023 study claims to compare a Zettelkasten group with a control, but the two groups' conditions differed too much and its tables don't add up, so it can't count as evidence. The only experiment I found comparing a system with and without bidirectional links was run in 2009 on a bibliographic database: bidirectional links raised participants' self-rated confidence but made no difference to how long tasks took ([Alford & Mendes 2009](https://doi.org/10.1145/1557914.1557934)). In a 2025 interview study of seven researchers who use Obsidian, participants relied mainly on folders, tags and search day to day and hardly mentioned links between notes at all ([Ferreira et al. 2025](https://arxiv.org/abs/2509.20187)).

## Do Obsidian backlinks and AI-suggested links count?

**Backlinks aren't the same as stated reasons.** Tools like Obsidian and Notion automatically list which notes link to the current one. That saves the work Luhmann did by hand in writing links back, but it only tells you who links here, not why. The reason still has to be written on the linking side. Digital tools also don't need Luhmann-style numbering, since they can link to any note directly.

**Treat AI-suggested links as leads, not as finished links.** Some tools suggest related notes automatically. They can surface connections you hadn't thought of, but if the sentence explaining why two notes relate was written by the AI, it skips the step of you thinking it through, just like the AI summaries in [order 1](/posts/learning/2026-10-22-what-to-keep-collecting-is-not-knowledge-en). What AI can and can't do for your notes is the subject of order 5.

## When you don't need any of this

According to the Luhmann Archive, the slip box may have been first of all a thinking tool, and only after it reached critical mass did it increasingly act as a machine for producing books and papers. zettelkasten.de mentions that he published 50 books and more than 600 articles, but also notes in a footnote that Luhmann was a workaholic, so his output wasn't the box's doing alone. If your notes are mostly to-dos, meeting notes and reference material, order 2's folders plus search are enough, and there's no need to rewrite every note as a permanent one.

The method also takes time: for its first few years the slip box is only a container, as Luhmann himself said. Another common sticking point is trying to write perfectly. Matuschak admits that when he writes notes as if they were meant for publication, he often can't write anything at all, which is why he [writes for himself by default](https://notes.andymatuschak.org/zXDPrYcxUSZbF5M8vM5Y1U9).

So start small. Don't rewrite your old notes. From today, give every link in a new note one sentence of reason, and when your notes on some topic start to feel messy, make your first MOC.

## What you can do tonight

1. **Pick a recent reading summary.** Find one claim in it you agree or disagree with, and rewrite it as a permanent note whose title is the claim.
2. **Link it to one older note.** Write one sentence on why: does it extend, conflict with or illustrate the other?
3. **Check whether your links have reasons.** Open five notes that have links and see whether your past self explained why.
4. **Find the topic with the most notes and ask whether it feels messy.** If it does, gather and collide them into an MOC with a "Not yet worked out" section at the end; if not, leave it for now.

## Self-check

**Q:** You paste a paragraph from a book into a note, word for word, and link it to three related notes. Is that a permanent note?

**How to judge:** No. A permanent note has two requirements: it's in your own words, and it makes sense without the original. A pasted paragraph meets neither: the words are the author's, and it usually needs its surrounding context to make sense. No number of links fixes that, and links without reasons aren't ideas anyway. Rewrite the paragraph as one claim of your own, such as "what this is really saying is…, which contradicts what I thought about…", put the original in the source field, and then it's a permanent note.

## References

- [Niklas Luhmann-Archiv, Der Zettelkasten Niklas Luhmanns](https://niklas-luhmann-archiv.de/nachlass/zettelkasten)
- [Niklas Luhmann-Archiv, Inhaltsübersicht Zettelkasten](https://niklas-luhmann-archiv.de/bestand/zettelkasten/inhaltsuebersicht)
- [Niklas Luhmann, Communicating with Slip Boxes (English translation by Manfred Kuehn)](https://luhmann.surge.sh/communicating-with-slip-boxes)
- [zettelkasten.de, Introduction to the Zettelkasten Method](https://zettelkasten.de/introduction/)
- [Andy Matuschak, Evergreen notes](https://notes.andymatuschak.org/Evergreen_notes)
- [Andy Matuschak, Evergreen notes should be atomic](https://notes.andymatuschak.org/zNUaiGAXp21eorsER1Jm9yU)
- [Andy Matuschak, Evergreen notes should be concept-oriented](https://notes.andymatuschak.org/z2hQEhqWkdRLL9JUwfawZZx)
- [Andy Matuschak, Prefer associative ontologies to hierarchical taxonomies](https://notes.andymatuschak.org/z8SU3r8xyZyvwRhyDdJasJ2)
- [Andy Matuschak, Write notes for yourself by default, disregarding audience](https://notes.andymatuschak.org/zXDPrYcxUSZbF5M8vM5Y1U9)
- [Linking Your Thinking, MOCs (defn)](https://blog.linkingyourthinking.com/notes/mocs-(defn))
- [Bergman et al. 2008, Improved search engines and navigation preference in personal information management (ACM TOIS)](https://doi.org/10.1145/1402256.1402259)
- [Bergman et al. 2010, The effect of folder structure on personal file navigation (JASIST)](https://doi.org/10.1002/asi.21415)
- [Whittaker et al. 2011, Am I wasting my time organizing email? A study of email refinding (CHI 2011)](https://doi.org/10.1145/1978942.1979457)
- [Bertsch, Pesta, Wiscott & McDaniel 2007, The generation effect: A meta-analytic review (Memory & Cognition)](https://doi.org/10.3758/BF03193441)
- [McCurdy, Viechtbauer, Sklenar, Frankenstein & Leshikar 2020, Theories of the generation effect and the impact of generation constraint: A meta-analytic review (Psychonomic Bulletin & Review)](https://doi.org/10.3758/s13423-020-01762-3)
- [Urry et al. 2021, Don't Ditch the Laptop Just Yet (Psychological Science)](https://doi.org/10.1177/0956797620965541)
- [DeStefano & LeFevre 2007, Cognitive load in hypertext reading: A review (Computers in Human Behavior)](https://doi.org/10.1016/j.chb.2005.08.012)
- [Madrid, Van Oostendorp & Puerta Melguizo 2009, The effects of the number of links and navigation support on cognitive load and learning with hypertext (Computers in Human Behavior)](https://doi.org/10.1016/j.chb.2008.06.005)
- [Alford & Mendes 2009, Scholarly research process: Investigating the effects of link type and directionality (HT 2009)](https://doi.org/10.1145/1557914.1557934)
- [Ferreira et al. 2025, How People Manage Knowledge in their "Second Brains" (arXiv:2509.20187)](https://arxiv.org/abs/2509.20187)

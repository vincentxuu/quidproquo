---
title: "Findability: Using Search Logs to Find the Gaps, and the AI That Has Started Reading Team Docs"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, wiki, search, agents-md]
lang: en
tldr: "When colleagues can't find something, it usually isn't missing: of 50 zero-result queries at one university library, only one in ten was for something it didn't have. Sort the gaps in three to six months of search logs into can't be found, doesn't exist and different words, and fix titles and synonyms first; AGENTS.md files for AI need the same care, since one evaluation found they didn't raise success rates overall while raising costs by about a fifth."
description: "Building Knowledge Bases, order 10: which lists to pull from search logs, how to classify the gaps, what zero results and low clicks mean, caveats on synonyms and best bets, handling personal data, and the research on AGENTS.md and llms.txt: what to keep and why to evaluate."
series:
  name: "Building Knowledge Bases"
  order: 10
---

> 🌏 [中文版](/posts/learning/2026-10-22-team-wiki-search-logs-agents-md)

HR wrote a page on the wiki called "Time-off policy". It's complete and it has an owner. But a new hire types "leave" into the search box, finds nothing, and goes back to asking in the group chat. The page isn't missing; it's written but unfindable.

This is the last post in the team part of "Building Knowledge Bases". The earlier posts covered which kinds of documents to write ([order 6](/posts/learning/2026-10-22-team-wiki-why-it-rots-en)), where to put them ([order 7](/posts/learning/2026-10-22-team-wiki-information-architecture-en)), how to write them ([order 8](/posts/learning/2026-10-22-team-docs-templates-adr-en)) and who maintains them ([order 9](/posts/learning/2026-10-22-team-wiki-maintenance-ownership-en)). This post covers how to find out what colleagues can't find, and a new kind of reader your team docs now have: AI. By the end you'll be able to pull the top ten gaps from your search logs and classify them, and to judge which parts of your team's AGENTS.md are worth keeping.

## When people can't find it, it's usually not because it isn't written

[Order 6](/posts/learning/2026-10-22-team-wiki-why-it-rots-en) mentioned that in [Aghajani et al.'s 2019 study](https://emadpres.github.io/pdfs/icse2019.pdf), half of the usability problems were documentation that existed but couldn't be found. Search research sees the same thing.

In 2018 Huurdeman and colleagues analyzed the University of Oslo library's search system and examined 50 zero-result queries one by one to find the cause ([Huurdeman et al. 2018](https://doi.org/10.15845/noril.v10i1.270)). Only one in ten was for something the library really didn't have; most of the rest were whole citations pasted in, misspellings, the wrong search scope, or items that hadn't been indexed, and a fifth couldn't be classified. The authors conclude that not finding a book in the system often doesn't mean it isn't there, just that the system can't find it with the current search terms.

In 2019 Cleverley and Burnett analyzed over a thousand pieces of user feedback on internal search at an oil and gas company over two years and sorted the causes of dissatisfaction into three groups: search technology, the information itself, and users' search skills ([Cleverley & Burnett 2019](https://doi.org/10.1177/0165551518770969)). The information itself accounted for more than a third, including missing content, content that wasn't indexed, and titles that weren't filled in properly. The authors conclude that "improving the organization of information is more advantageous than modifying search technology". They also record a cycle the company kept repeating: employees complained that search was bad, the company replaced the search engine, and the problems stayed.

## Which lists to pull from your search logs

Susan Farrell of NN/g wrote a practical guide to search log analysis ([NN/g 2017](https://www.nngroup.com/articles/search-log-analysis/)). It's a method write-up, not a research finding, but its steps are concrete. I've condensed it into three lists, plus a fourth from enterprise search research:

1. **Top queries.** Pull three to six months of logs, list the top 1,000 queries and sort them by frequency. As you go down the list, group terms that mean similar things, such as "leave", "time off", "vacation" and "PTO".
2. **Zero-result queries.** Ignore ones that appear only once or twice; the frequent ones are the problem. NN/g notes this list mixes misspellings with things people want but can't find.
3. **Consecutive queries by the same person.** Searching "leave", then "time off", then "leave form" within five minutes means the first two didn't find what they wanted. This is the only analysis that needs a user identifier; without one, you can still do the first two lists.
4. **Queries that return results nobody clicks.** NN/g's guide doesn't cover this one. In 2023 Cleverley and colleagues analyzed one company's searches during the pandemic; one query was searched 129 times and clicked once ([Cleverley et al. 2023](https://doi.org/10.1177/0165551521989531)): there were results, but none was what people wanted. A zero-result list misses this kind of failure. The same study found that nobody at the company was looking at the search logs at all.

NN/g also suggests one simple step: actually run your top 100 queries and check whether the first page has anything useful. In Huurdeman's study, even the 50 most popular queries failed to find their target a fifth of the time.

## Sort the gaps into three kinds

NN/g lists seven kinds of findings from search logs; here we use the first three to sort the gaps:

| Kind | Example | What to do |
|---|---|---|
| Wanted but can't be found | Searching "payslip", but the page lives in the HR system the wiki doesn't index | Get it indexed or add a wiki page linking to it; if it ranks too low, add a best bet |
| Wanted but doesn't exist | Searching "parental leave", and the wiki really has nothing | Write it; until then, have the search results point to the closest page or the owner |
| Different words | Everyone searches "leave", the page is called "Time-off policy" | Put the word people use into the title or text and set up synonyms; show both terms in navigation labels |

The rule: if the page exists and already uses the word people search for but doesn't come up (not indexed, wrong scope, ranked too low), it's "can't be found"; if the page exists but uses a different word, it's "different words"; if there's no page, it "doesn't exist".

The other four are common misspellings, empty queries, very long full-sentence queries, and lots of number queries; on an intranet, if the numbers are phone numbers, people are probably looking for colleagues, and NN/g suggests that's the time to add people search.

**Two caveats on synonyms and best bets.**

- **Synonyms help, but they're not a cure-all.** NN/g recommends finding terms in your search logs that people use but your content doesn't, and building a synonym table ([NN/g 2016](https://www.nngroup.com/articles/internal-website-search/)). At Cleverley and Burnett's company, synonyms and acronyms caused only 5% of dissatisfaction, less than commonly assumed. Fix content and titles first; synonyms are a supplement.
- **Don't put best bets in a separate box.** Pinning the best answer for a query to the top (best bets) is useful, but NN/g warns that if it's shown as a block that looks different from regular results, users often ignore it the way they ignore ads. Cleverley and Burnett saw this too: the correct answer was in the promoted result, and users didn't notice it. Merge it into the regular results as the first item.

**Why fix titles first.** The search manager Cleverley and Burnett interviewed said titles carry the most weight in ranking, yet some pages have no title at all; and suggested making page templates require one. That's also why order 7 spends time on titles.

## Search logs contain personal data

Search logs record who searched for what. The 2023 Cleverley study noticed that mental-health searches increased during the pandemic, and the authors note that employees might avoid searching for fear the company could trace searches back to them. NN/g's advice: don't email unencrypted logs containing personal data, never put them anywhere everyone can see, remove personal data before sharing, and delete the logs once you've analyzed them. If you don't do the consecutive-queries analysis, you don't need to keep user identifiers.

## The second reader: AI

Team docs are getting a new kind of reader: AI coding agents, and chatbots connected to company documents. New formats for them have appeared too:

- **AGENTS.md**: a file in a code repo, "a README for agents", holding build and test commands, code style and project conventions ([AGENTS.md](https://agents.md/)). The site suggests including "anything you'd tell a new teammate".
- **llms.txt**: a Markdown file at a website's root (since v2, also under a subpath) listing links to the site's important pages with short descriptions, so an AI doesn't have to crawl the whole site ([llms.txt](https://llmstxt.org/)).

There isn't much research on these formats yet, but a few findings are worth knowing:

**Edited often, but almost only growing.** Chatlatanagulchai and colleagues analyzed 2,303 such files from open-source projects and found that most were edited more than once, and that the sampled edits were mostly real content changes; but edits were mostly additions, with very little deleted ([Chatlatanagulchai et al. 2025](https://arxiv.org/abs/2511.12884)). The authors warn that this builds up "context debt": files that grow harder to understand and maintain. That's a risk they propose, though; nobody has yet measured how much messier the files get.

**No overall gain in success, and higher costs.** In 2026 Gloaguen and colleagues tested several coding agents on two sets of programming tasks, with and without files like AGENTS.md ([Gloaguen et al. 2026](https://arxiv.org/abs/2602.11988)). LLM-generated files didn't raise the success rate and raised costs by about a fifth; files written by the developers raised the success rate slightly but not significantly, and also raised costs by nearly a fifth. Instructions in the files were followed, for example agents used a tool when the file said to; but project overviews didn't help agents find the files they needed to change any faster. Another finding: once the repo's other documentation (.md files, examples, docs/) was removed, LLM-generated files did help, and even beat the developer-written ones. The authors take this to mean that LLM-generated files mostly repeat existing documentation, while developer-written ones add new information. This is still a preprint.

**Some results point the other way.** In 2026 Lulla and colleagues tested a single agent and found that with an AGENTS.md, run time and output tokens both went down, though total tokens were about the same and correctness wasn't fully evaluated ([Lulla et al. 2026](https://arxiv.org/abs/2601.20404)). So "AGENTS.md makes agents more expensive" isn't settled; the result depends on the setup.

**Publishing it doesn't mean anyone reads it.** In 2026 Ahrefs analyzed its own customers' website logs: of the domains with an llms.txt, 97% received no requests for it in a whole month, and AI tools only fetched it when a link or a user's instruction pointed them to it ([Ahrefs 2026](https://ahrefs.com/blog/llmstxt-study/)). That's the vendor's own data, and its customers lean toward SEO.

Putting these together, docs for AI face the same problems as docs for people: they need to be findable, they need maintaining, and you need to know whether they actually help. Gloaguen and colleagues recommend not using LLM-generated files for now, and having human-written files include only what isn't in the README and the agent must know, such as unusual conventions, and evaluating them before adopting them.

## Example: a zero-result query list, classified

Suppose you pull three months of zero-result queries, and the ten most frequent are:

| Query | Count | Kind | Fix |
|---|---|---|---|
| leave | 48 | Different words | Retitle "Time-off policy" to "Leave and time-off policy"; set up a synonym |
| VPN | 35 | Different words | Add "VPN" to "Remote access service" and put both terms in the title |
| expenses | 31 | Different words | The page is called "Reimbursement process"; add "expenses" to the title |
| parental leave | 22 | Doesn't exist | Ask HR to write it; meanwhile add a line "Parental leave: contact HR" to "Leave and time-off policy" |
| wifi password | 18 | Doesn't exist | Check whether it can be published; if so add it, if not say whom to ask |
| parking | 15 | Doesn't exist | Ask the admin team to write it |
| payslip | 12 | Can't be found | It lives in the HR system, which the wiki doesn't index; add a page linking to the system |
| leav | 9 | Misspelling | Set up as a synonym of "leave" |
| Wang Xiaoming | 8 | People search | Count how many queries are for people; if many, consider people search |
| onbording | 6 | Misspelling | Set up as a synonym of "onboarding" |

Of the ten, only three really need writing; the rest are written, but their names or locations make them hard to find.

## What to keep in an AGENTS.md

Applying the research to a team's AGENTS.md, this is how I'd check each section:

| This section | Keep it? |
|---|---|
| Project overview, directory structure tour | Delete it, or reduce it to one line linking to the README; the research didn't find it helped agents find files |
| Build and test commands | If the README has them, link there; keep any special steps the README doesn't mention |
| Team-specific conventions (always use a particular package manager, don't touch a certain directory) | Keep: agents follow these, and the README won't have them |
| Long passages copied from other docs | Delete them and link to the original |
| Content nobody has confirmed in a long time | Treat it as in order 9: owner and review cycle; Chatlatanagulchai and colleagues also suggest naming the file's owner in CODEOWNERS |

After the edit, rerun a few tasks you've actually done recently, before and after, and check three things: were the conventions in the file followed, how many extra steps did the agent take, and did it read files it shouldn't have needed. A few tasks won't show a difference in success rate; the research used over four hundred tasks and still found no significant one. What you can see is whether instructions were followed and what it cost.

## Limits of the research

Each search study covers a single organization: each Cleverley paper studies one large multinational, Huurdeman's is one university library, and all come from the keyword-search era; NN/g's is a practical guide. The AGENTS.md research is all very recent and tests only Python or small tasks; Gloaguen and Lulla measure success and cost on programming tasks, and Chatlatanagulchai analyzes only the files themselves; none of it is internal Q&A over team docs. And the llms.txt specification page is still being revised.

That's the end of the team part. Colleagues will increasingly skip the search box and ask an AI assistant instead; the documents the earlier posts helped you write, maintain and make findable are the best raw material for that kind of knowledge base, which is where the next part begins.

## What you can do tonight

1. **Ask whether your wiki keeps search logs.** If not, ask the admin to turn them on; if it does, pull the last three months of top queries and zero-result queries.
2. **Sort the top ten zero-result queries into the three kinds.** Can't be found, doesn't exist, different words; list misspellings and people searches separately.
3. **Fix the "can't be found" and "different words" ones first.** Retitle pages, add the words people use to the text, set up synonyms; all of these are cheaper than a new search engine.
4. **Open your team's AGENTS.md and go through it with the table above.** Delete what duplicates the README, and keep the conventions an agent must know.

## Self-check

**Q:** People search "leave" and can't find "Time-off policy". How should you fix it?

**How to judge:** Fix the content first, not the search engine. Add the word people use to the title or summary, for example retitle it "Leave and time-off policy"; set up a synonym mapping "leave" to "time off" in the search engine; and if you use best bets, put this page as the first regular result. Afterwards, go back to the logs: has the zero-result count for this query gone away, and are clicks up? Switching to another keyword-matching engine usually won't fix this, because it won't know that "leave" means "time off" either. Engines with semantic (vector) search are better at bridging words like these (see [Hybrid Search: Using BM25 + Vector Search to Cover Each Other's Blind Spots](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en)), but that's a separate and more expensive decision; retitling a page takes minutes.

## References

- [Aghajani et al. 2019, Software Documentation Issues Unveiled (ICSE 2019)](https://emadpres.github.io/pdfs/icse2019.pdf)
- [Huurdeman, Aamodt & Heggø 2018, "More than Meets the Eye" – Analyzing the Success of User Queries in Oria (Nordic Journal of Information Literacy in Higher Education)](https://doi.org/10.15845/noril.v10i1.270)
- [Cleverley & Burnett 2019, Enterprise search and discovery capability: The factors and generative mechanisms for user satisfaction (Journal of Information Science)](https://doi.org/10.1177/0165551518770969)
- [Cleverley, Cousins & Burnett 2023, Impact of COVID-19 on search in an organisation (Journal of Information Science)](https://doi.org/10.1177/0165551521989531)
- [NN/g 2017, Search-Log Analysis: The Most Overlooked Opportunity in Web UX Research](https://www.nngroup.com/articles/search-log-analysis/)
- [NN/g 2016, 7 Ways to Improve Your Website's or Intranet's Built-In Search Engine](https://www.nngroup.com/articles/internal-website-search/)
- [AGENTS.md](https://agents.md/)
- [llms.txt](https://llmstxt.org/)
- [Chatlatanagulchai et al. 2025, Agent READMEs: An Empirical Study of Context Files for Agentic Coding (arXiv)](https://arxiv.org/abs/2511.12884)
- [Gloaguen et al. 2026, Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents? (arXiv)](https://arxiv.org/abs/2602.11988)
- [Lulla et al. 2026, On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents (ICSE JAWs 2026, arXiv)](https://arxiv.org/abs/2601.20404)
- [Ahrefs 2026, We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read](https://ahrefs.com/blog/llmstxt-study/)
- On this site: [Hybrid Search: Using BM25 + Vector Search to Cover Each Other's Blind Spots](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en)

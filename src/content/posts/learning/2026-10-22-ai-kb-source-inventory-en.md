---
title: "Inventorying Sources: Which Documents Belong in an AI Knowledge Base, and Which Version to Trust"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, data-inventory, versioning, retrieval]
lang: en
tldr: "Importing the whole shared drive is the most common way to start an AI knowledge base, and the most common mistake. When old and current versions are retrieved together, the model blends them: in one study, even with the current information retrieved, adding a single outdated passage cut the overall score by more than 24%. First build a source inventory recording each source's owner, update frequency, access restrictions and handling decision; collect only one workflow's well-governed sources in the first batch; and keep only the current version of each document, labeling any old version you must keep with its version and expiry date. After importing, check the file counts, because some connectors import nothing and report no error when they lack permissions."
description: "Building Knowledge Bases, order 12: why you shouldn't import everything, how old versions and duplicates affect answers, the fields of a source inventory, how to scope the first batch, handling multiple versions, and connectors that fail silently."
series:
  name: "Building Knowledge Bases"
  order: 12
---

> 🌏 [中文版](/posts/learning/2026-10-22-ai-kb-source-inventory)

HR's shared folder holds three copies of the travel policy: "Travel_policy_2023.docx", "Travel_policy_2025_final.docx", and "Travel_policy_2025_final(1).docx", which differs from the final by a single number. The team imports the whole folder into an AI knowledge base. Someone asks, "What's the hotel limit for domestic travel?" The AI gives two numbers and says "it depends on the version."

This is the second post in the AI part of "Building Knowledge Bases". [Order 11](/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first-en) wrote the test questions; this post decides which documents to collect and, when a document has several versions, which one to trust. Turning files into text is order 13, and who can find which document is order 17. By the end you'll be able to fill in a source inventory and decide the scope of the first batch.

## Why not just import everything

**An old version is worse than nothing.** In 2025 Ouyang and colleagues built a benchmark specifically for outdated information ([Ouyang et al. 2025](https://aclanthology.org/2025.acl-long.301/)). They found that even when the current information had been retrieved, adding just one outdated passage to the context cut Llama 70B's overall score by more than 24%, while adding six irrelevant distracting passages barely changed it. Worse still is when only the old information is retrieved and not the new: the model answers wrongly with great confidence, which is more dangerous than retrieving nothing. As the authors put it, outdated information actively misleads models rather than merely adding noise.

**Retrieval can't tell old from new.** The same study tested the search side: without considering time, outdated information was about as likely as current information to rank in the top five; with time decay added, outdated information still had nearly a fifty-percent chance of making the top five, and the hit rate for current information dropped. A white paper from Deasy Labs, a data-governance vendor owned by Collibra, explains it this way: two nearly identical documents sit at almost the same point in embedding space, so the retrieval model has no basis to prefer one over the other, and both get retrieved ([Deasy Labs 2025](https://www.deasylabs.com/resources/Detecting_the_Latest_Document_Version.pdf)).

**With versions mixed together, version questions go badly.** In 2025 Huwiler and colleagues wrote questions over technical documentation containing several versions; a standard RAG setup answered only 55% of questions about a specific version correctly, and only 35% of questions asking which versions exist ([Huwiler et al. 2025](https://arxiv.org/abs/2510.08109)). The largest single category of errors was passages from different versions being retrieved together and contradicting each other.

**Exact duplicates are not the big problem.** In 2026 Ross and colleagues put one to five identical copies of a document directly into the model's context and found answer correctness essentially unchanged ([Ross et al. 2026](https://arxiv.org/abs/2608.13956)). So there are two reasons to clean up copies. First, copies take up retrieval slots and push out other passages you need (this study didn't test that). Second, many "copies" aren't identical, like the "final(1)" in the opening that differs by one number, and those are what make the model answer wrong.

OWASP's 2025 top ten risks for LLM applications includes this too: when data from multiple sources contradicts itself, it produces knowledge-conflict errors; the recommendation is to review data before combining sources and to tag and classify it ([OWASP LLM08:2025](https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/)).

## A source inventory

So the first job isn't importing, it's taking inventory. Soni's 2026 practitioner article recommends recording, for each source, the owner, how often it changes, any sensitive fields, the permission rule and a handling decision; the handling decision is the most important field ([Soni 2026](https://dzone.com/articles/ai-retrieval-with-existing-data)). Microsoft's content guidance for Copilot also asks for documents to carry an owner, an effective date and a review date ([Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/copilot/employee-self-service/optimization-sharepoint)).

Combining the two, these are the fields I'd use:

| Field | Question it answers |
|---|---|
| Source system | Where is it? Shared drive, wiki, support system, database |
| Format and volume | Word, PDF, web pages, spreadsheets? Roughly how many, how big |
| Owner | Who decides whether the content is right (per order 9, write a role) |
| Update frequency | How often does it change? Weekly, quarterly, constantly |
| Access restrictions | Who can see it? Any personal or confidential data (used in orders 14 and 17) |
| Version status | Are there several versions? Which one is current |
| Handling decision | Index it, fetch it live, use it only as a filter, or exclude it |

**There are four handling decisions.** Soni's rule of thumb: index stable content everyone can read; fetch frequently changing or sensitive data live at answer time; use some sources only as filters; and exclude the rest. For example, index help-center articles, fetch ticket history live, and keep billing records out of the index, looking them up live only when needed. Microsoft's data architecture guide for AI agents likewise suggests deciding, for each data domain, whether to use search, an API, or both ([Microsoft CAF](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai-agents/data-architecture-plan)).

## What goes in the first batch

Don't start with the whole company. Soni's advice is to pick one workflow first: with a company-wide search that has no clear owner, you can't even tell whether a result is right. Microsoft also suggests piloting with well-governed, low-risk sites, confirming each has an owner, before scaling up.

Order 11's test questions come in handy here: list the source of every question, and the sources those passages live in are the first batch. A question with no source means a source is still missing from your inventory.

When filling in "Format and volume", open five to ten files from each source and note what kinds of content it holds, such as policies, forms, meeting notes and expired notices. Order 13's parsing spot-check then picks two from each kind.

## When a document has several versions

My rules:

- **Collect only the current version.** Microsoft's guidance is to archive or delete duplicated and outdated content so only one authoritative copy exists in the published library, and to use metadata to mark items "current", "archived" or "superseded".
- **If you must keep an old version, label its version and expiry date.** For example, when a contract dispute needs the version that applied at the time. Mark the old version clearly, e.g. "expired 1 January 2025, superseded by the 2025 version", and keep it out of ordinary queries by default. Order 15 covers metadata design, and order 18 covers handling old versions.
- **Don't count on retrieval to sort old from new.** The research above shows that neither semantic similarity nor time decay separates them cleanly.
- **"Final", "latest" or "(1)" in a filename is not evidence of version.** To decide which copy is current, look first at the effective date the document states, and only then at the system's modified time (Deasy Labs' version detection uses the same order).

## Connectors fail silently

Many AI knowledge base products import documents directly from systems like Google Drive and SharePoint through "connectors". There's an easy-to-miss trap here. Google's RAG Engine documentation says that when importing from Google Drive, the service account must have the correct permissions; otherwise "no files are imported and no error message displays" ([Google Cloud: RAG Engine data ingestion](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/use-data-ingestion)).

The same page also explains how it detects duplicates: it skips a file only when the path, the filename and the content hash all match. In other words, the same document in two folders, a renamed copy, and an old version that differs by one number will each be indexed separately (that's my inference from its rules). Platform deduplication is not version management.

So the inventory needs two more things: which account the connector reads with, and whether that account has access; and how many files each source should have. After importing, compare against the number actually imported. Google's RAG Engine can also write each file's import success or failure to one place for checking afterwards. The site's post [From Source to Index: Sync and Incremental Updates for Private Corpora](/posts/ai/2026-08-22-private-corpus-sync-en) covers syncing and incremental updates in more detail.

## Example: one company's source inventory

| Source system | Format and volume | Owner | Update frequency | Access restrictions | Version status | Handling decision |
|---|---|---|---|---|---|---|
| HR shared folder | Word, PDF, about 300 files | HR | Quarterly | Everyone; except salary-related | Several versions side by side; filenames unreliable | Current versions only; old versions labeled with expiry, kept out of ordinary queries |
| Team wiki | Web pages, about 1,200 | Each page's owner | Constantly | Some spaces department-only | Single version | Index; exclude restricted spaces for now |
| Support system ticket history | Text, tens of thousands | Support lead | Real time | Contains customer personal data | — | Don't index; fetch live when needed, with personal data masked |
| Product spec PDFs | PDF, about 50 | Product manager | Each release | Internal | One per release | Current version only; if support needs the previous version for older customers, label it with its version and end date and keep it out of ordinary queries |
| Financial reports | Spreadsheets | Finance | Monthly | Finance only | — | Exclude |
| Org chart | Spreadsheet, 1 file | HR | Monthly | Everyone | Single version | Don't index the content; use department and title only as filters |
| Former colleagues' personal folders | Mixed | None | No longer updated | Unknown | Unknown | Exclude; find a new owner to claim anything useful first |

If most of order 11's test questions come from HR and the wiki, the first batch is just the first two rows; add the product specs once test questions cover them.

## Limits of the research

Ouyang used historical versions of English Wikipedia; Huwiler and Ross are both still preprints, with Huwiler using a 100-question technical documentation test the authors built themselves and Ross using short-answer questions over fictional data; none of them uses company documents. The only quantitative data I found directly comparing "keeping old versions" with "keeping only the current one" is the Deasy Labs report, a vendor's evaluation with its own tool, and its old versions were synthetic near-duplicates with a few facts deliberately backdated. Soni's and Microsoft's inventory advice is practical experience with no outcome data attached, and the OWASP list is community consensus.

## What you can do tonight

1. **List the sources of order 11's test questions in one column.** Count how many systems they're spread across.
2. **Fill in one inventory row for each of those systems.** Fill all seven fields, especially owner and handling decision.
3. **Look for duplicates and multiple versions in the most-asked-about source.** Search filenames for "final", "latest", "(1)" or "v2", and decide which copy is current.
4. **If you've already connected a connector, check the file counts once.** How many files the source has versus how many the index has; if they don't match, check the connector account's permissions first.

## Self-check

**Q:** A regulation exists in a 2023 version and a 2025 version. Should both be collected?

**How to judge:** Collect only the current version. With the 2023 and 2025 versions side by side, retrieval will pull up both, and the model may blend them or cite the old rule; retrieval can't reliably sort old from new on its own. If there's a reason to look up the old version, such as handling a dispute from 2024, collect it, but label it clearly with its version and expiry date, mark it "superseded", and keep it out of ordinary queries by default.

## References

- [Ouyang et al. 2025, HoH: A Dynamic Benchmark for Evaluating the Impact of Outdated Information on Retrieval-Augmented Generation (ACL 2025)](https://aclanthology.org/2025.acl-long.301/)
- [Deasy Labs 2025, Detecting the Latest Document Version Counters Context Decay and Raises RAG Accuracy by 46%](https://www.deasylabs.com/resources/Detecting_the_Latest_Document_Version.pdf)
- [Huwiler, Stockinger & Fürst 2025, VersionRAG: Version-Aware Retrieval-Augmented Generation for Evolving Documents (arXiv)](https://arxiv.org/abs/2510.08109)
- [Ross, Koopman, van der Vegt & Zuccon 2026, How retriever redundancy and diversity impact RAG effectiveness (arXiv)](https://arxiv.org/abs/2608.13956)
- [OWASP Top 10 for LLM Applications 2025, LLM08: Vector and Embedding Weaknesses](https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/)
- [Soni 2026, Connect Existing Data to AI Retrieval (DZone)](https://dzone.com/articles/ai-retrieval-with-existing-data)
- [Microsoft Learn, Optimizing SharePoint content for Employee Self-Service agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/employee-self-service/optimization-sharepoint)
- [Microsoft Cloud Adoption Framework, Data architecture for AI agents](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai-agents/data-architecture-plan)
- [Google Cloud, Use data ingestion with RAG Engine](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/use-data-ingestion)
- On this site: [From Source to Index: Sync and Incremental Updates for Private Corpora](/posts/ai/2026-08-22-private-corpus-sync-en)

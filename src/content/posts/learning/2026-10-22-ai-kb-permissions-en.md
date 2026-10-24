---
title: "Permissions: How to Make Sure the AI Doesn't Hand Department A's Documents to Department B"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, access-control, permissions, security]
lang: en
tldr: "Filter permissions at retrieval time: each chunk carries the groups allowed to see it, each query carries the user's groups, and anything that doesn't match never becomes a candidate, rather than letting the model read it and then telling it not to say it. AI doesn't create new permissions, but it makes documents that were shared too widely findable with a single question, so clean up oversharing before launch. When permissions change, the index doesn't necessarily follow: some connectors update permissions only on full crawls, up to a day late. Filtering has a cost too: with strict conditions, some vector databases return too few results. Before launch, add a permission-crossing question to your test set."
description: "Building Knowledge Bases, order 17: why to filter at retrieval time, how to design permission fields, why oversharing is the biggest risk, who may see what in multi-person conversations, how permission changes reach the index, how filtering affects recall, multi-tenant isolation, and a permission-crossing test question."
series:
  name: "Building Knowledge Bases"
  order: 17
---

> 🌏 [中文版](/posts/learning/2026-10-22-ai-kb-permissions)

A sales colleague asks the AI assistant, "How big are this year's raises?" The AI answers with the figure from an internal HR meeting note. The note sits in a shared folder that someone shared with "everyone in the company" three years ago, and nobody remembers. The AI didn't break any permission; it followed the rules and read a file this colleague could already open.

This is the seventh post in the AI part of "Building Knowledge Bases". [Order 15](/posts/learning/2026-10-22-ai-kb-metadata-schema-en) left a "permission label" field in the metadata; this post covers how it actually does its job: who can find which document. How to build an identity system is outside this post's scope. By the end you'll be able to say at which layer your system filters permissions, and write a permission-crossing test question for your test set.

## Filter at retrieval, don't let the model read it and then block it

The common approach: each document and each chunk carries "which groups may see this", the user's query carries the groups they belong to, and retrieval searches only within what matches. Azure AI Search does this with a group-ID field in the index and a filter on the user's groups at query time ([Azure: Security filters](https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search)).

Why not let the model read first and then tell it not to say it? NVIDIA, describing how it built internal chatbots, wrote that it first put guardrail rules in prompts, then found that not all models follow them consistently, and moved the guardrails into pre-processing of queries and post-processing of responses ([Akkiraju et al. 2024](https://arxiv.org/abs/2407.07858)); for permissions, it specifically chose a retrieval product known to honor document access control lists. A 2025 position paper by Bhatt and colleagues at Microsoft also argues that systems must check permissions before any content is handed to the model, and enforce this deterministically and verifiably ([Bhatt et al. 2025](https://arxiv.org/abs/2509.14608)). If the model can see it, it can say it. Output-side defenses still help (the site's post on [RAG Guardrails](/posts/ai/2026-03-12-rag-guardrails-en) covers them), but they supplement retrieval-time filtering rather than replace it.

**A few implementation details:**

- **The permission field is just string matching.** Azure's documentation stresses that the group ID in a security filter is "just a string" and the system doesn't authenticate anyone for you; making the field non-retrievable isn't a security mechanism either. It only counts if the filter is applied to every query.
- **After chunking, permissions must follow each chunk.** Azure's newer document-level access control notes that once you chunk, permission fields have to move to per-chunk projections, and sensitivity labels must be projected onto each chunk too, or chunk-level results won't be filtered ([Azure: Document-level access control](https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview)).
- **Use groups, not lists of users.** Pinecone's documentation calls stuffing a long list of user IDs into the query an anti-pattern: long lists slow things down and hit a size limit; it recommends describing what a person can see with the smallest number of groups ([Pinecone: Multitenancy](https://docs.pinecone.io/guides/index-data/design-for-multitenancy)).

## The biggest risk: things already shared too widely

AI doesn't create new permissions, but it makes overly broad permissions findable. Microsoft's deployment guidance for Copilot is direct: Copilot uses only "data that the user already has permission to access", so first find sites and files that are overshared, ownerless, inactive or contain sensitive data that Copilot could surface ([Microsoft: Secure and govern Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/configure-secure-governed-data-foundation-microsoft-365-copilot)).

Before, an HR meeting note shared with the whole company could only be found by people who knew where it was; once AI is connected, anyone can find it with one question. Microsoft's recommended order: find the high-risk places, temporarily exclude them from the AI, fix the permissions, then lift the temporary restriction; going forward, new spaces default to narrower sharing and carry sensitivity labels.

That's why order 12's inventory records "access restrictions": before connecting a source to AI, check who it's actually shared with today.

## In multi-person conversations, who may see what

There's a newer situation too: AI handling content that involves several people, such as replying to an email with multiple recipients or working on shared documents. Bhatt and colleagues argue that the system must then confirm every participant is allowed to see a piece of content before giving it to the model ([Bhatt et al. 2025](https://arxiv.org/abs/2509.14608)). A document A may see can't necessarily be cited in a conversation among A, B and C. Order 14's Slack AI incident is a related problem: each person's permission filtering was correct, and the problem was that the attacker's content and the victim's private data ended up in the same answer. It's a position paper without experimental data, but the principle is worth designing for from the start.

## When permissions change, the index doesn't always follow

Permission data is synced from source systems, and syncing takes time:

- **Azure**: changes to group membership, file permissions or sensitivity labels in the source system show up in search results only after they're synced into the index.
- **Microsoft 365 Copilot connectors**: current documentation says incremental crawls update only changed items, don't handle deletions, and don't process permission updates; permissions are updated only on full crawls ([Microsoft: Copilot connectors FAQ](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/frequently-asked-questions)), and permission changes may take up to 24 hours to take effect ([Microsoft: Search and validate indexed content](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/indexed-content)). Microsoft's product roadmap lists incremental permission sync as generally available from July 2026, but the documentation above hasn't been updated, so check actual behavior in your environment ([Microsoft 365 Roadmap 503570](https://www.microsoft.com/microsoft-365/roadmap?id=503570)).
- **Amazon Q Business**: connectors update permission changes on each crawl, so you need to re-sync regularly to catch them ([Amazon Q Business: User Store](https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/principal-store-hiw.html)). It also warns that editing user and group mappings is a privileged operation, since mistakes can expose documents to the wrong people.

Whatever the product, the point is the same: permission changes and content changes may take different sync paths, so know how often your system syncs permissions. When someone leaves, changes department, or a document becomes confidential, confirm the index's permissions changed too, and trigger a full sync manually if needed.

## The cost of filtering: fewer results

Adding filter conditions in a vector database sometimes returns fewer or worse results. pgvector's documentation gives an example: with an approximate index, filtering is applied after the index is scanned; if a condition matches 10% of rows, the default settings return only 4 rows on average ([pgvector README](https://github.com/pgvector/pgvector)). In 2026 Amanbayev and colleagues compared several vector databases and found that the stricter the filter, the lower the recall in most systems; Milvus was the exception, switching to exact search once enough is filtered out and keeping recall complete ([Amanbayev et al. 2026](https://arxiv.org/abs/2602.11443)). That study used ordinary numeric fields, not permission fields, so applying it to permission filtering is an inference.

In practice, permission filtering affects not only security but whether what should be found is found. Before launch, run order 11's test questions with an account that has narrow permissions, and see whether the number and quality of results drop noticeably; if they do, check whether your database filters before or after the search, and what parameters you can tune.

## Multiple tenants: keep different customers' data apart

If a knowledge base serves several customers or subsidiaries whose data must never mix, the safest approach is physical separation. Pinecone recommends one namespace per tenant, partly because it reduces the risk of a bug querying another tenant's data, and querying one tenant's scope is far cheaper than filtering across all the data. pgvector also warns that when tenants share one approximate index, other tenants' data affects your recall and speed; for isolation, use partitioning or separate tables.

## Example: the same question, two users

Question: "How big are this year's raises?"

| | Sales colleague | HR manager |
|---|---|---|
| Groups | Everyone, Sales | Everyone, HR, Managers |
| Retrieval scope | Only chunks labeled "Everyone" or "Sales" | Plus chunks labeled "HR" and "Managers" |
| Expected answer | Says it can't find this information, or points to the public compensation policy page | Cites the figure from the internal HR meeting note, with its source |

If the sales colleague gets the figure, the problem could be in three places: the meeting note's permissions were too broad to begin with (oversharing); the permissions changed but the index hasn't synced; or the permissions didn't follow each chunk during chunking.

## Limits of the research

This post's main sources are official documentation from Azure, Microsoft, Amazon, Pinecone and pgvector, and product features change quickly; for example, Microsoft's roadmap lists incremental permission sync as launched and Amazon Q Business no longer accepts new customers. Bhatt and colleagues' is a position paper without experiments; Amanbayev's experiments use ordinary numeric fields. Empirical studies comparing permission-filtering approaches on company knowledge bases are scarce.

## What you can do tonight

1. **Confirm at which layer your system filters permissions.** At retrieval, or after the model has read the content? If the latter, put it on the to-do list.
2. **Find sensitive sources shared with "everyone".** Start from order 12's inventory, especially HR, finance and legal.
3. **Check how often your system syncs permissions.** Do incremental syncs update permissions? Do you need regular full syncs?
4. **Add a permission-crossing question to order 11's test set.** With a test account that has narrow permissions, ask something only HR should see; the expected answer is "can't find it".

## Self-check

**Q:** Is writing "don't answer with confidential content" in the system prompt enough?

**How to judge:** No. Whatever the model can see, it may say: NVIDIA's experience was that not every model consistently follows rules written in prompts, and order 14 showed that prompt-based defenses don't stop attackers who adapt. Filter by the user's groups at retrieval so unauthorized chunks never become candidates; and before launch, clean up oversharing and confirm that permission changes reach the index.

## References

- [Azure AI Search, Security filters for trimming results](https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search)
- [Azure AI Search, Document-level access control](https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview)
- [Akkiraju et al. 2024, FACTS About Building Retrieval Augmented Generation-based Chatbots (NVIDIA, arXiv)](https://arxiv.org/abs/2407.07858)
- [Bhatt et al. 2025, Position: Enterprise AI Must Enforce Participant-Aware Access Control (arXiv)](https://arxiv.org/abs/2509.14608)
- [Pinecone, Design for multitenancy](https://docs.pinecone.io/guides/index-data/design-for-multitenancy)
- [Pinecone, Implement multitenancy](https://docs.pinecone.io/guides/index-data/implement-multitenancy)
- [Microsoft Learn, Secure and govern Microsoft Copilot: Foundational deployment guidance](https://learn.microsoft.com/en-us/microsoft-365/copilot/secure-govern-copilot-foundational-deployment-guidance)
- [Microsoft Learn, Configure a secure and governed foundation for Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/configure-secure-governed-data-foundation-microsoft-365-copilot)
- [Microsoft Learn, Microsoft 365 Copilot connectors FAQ](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/frequently-asked-questions)
- [Microsoft Learn, Search and validate indexed content](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/indexed-content)
- [Microsoft 365 Roadmap 503570, Support permission sync missed in incremental crawl](https://www.microsoft.com/microsoft-365/roadmap?id=503570)
- [Amazon Q Business User Guide, How the User Store works](https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/principal-store-hiw.html)
- [pgvector README](https://github.com/pgvector/pgvector)
- [Amanbayev, Tsan, Dang & Rusu 2026, Filtered Approximate Nearest Neighbor Search in Vector Databases: System Design and Performance Analysis (arXiv)](https://arxiv.org/abs/2602.11443)
- On this site: [RAG Guardrails: Adding a Defense Layer to Inputs and Outputs](/posts/ai/2026-03-12-rag-guardrails-en)

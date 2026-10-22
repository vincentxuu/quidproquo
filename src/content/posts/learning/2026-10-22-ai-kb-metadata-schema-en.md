---
title: "Structure and Metadata: Which Fields to Record Besides the Text"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, metadata, filtering, retrieval]
lang: en
tldr: "Metadata serves three purposes: returned for citation, used in search, and used to filter before retrieval; exact conditions like model, year or region belong in fields, and one study that wrote the company and year in front of every chunk raised top-five hits from 33% to 55%. Take filter values from source systems as fixed options, store dates as numbers, and don't let an LLM generate them freely."
description: "Building Knowledge Bases, order 15: the three purposes of metadata, why exact conditions need fields, a list of common fields, how to store them (dates, fixed options, multiple values, file or chunk level), storing cleaned text separately, the risks of LLM-generated metadata, and the same chunk with and without a heading path and date."
series:
  name: "Building Knowledge Bases"
  order: 15
---

> 🌏 [中文版](/posts/learning/2026-10-22-ai-kb-metadata-schema)

The company has a leave policy for its Taipei office and one for Singapore. They're nearly identical except for the number of annual leave days. A Taipei colleague asks the AI, "How many days of annual leave after one year?", and the AI cites the Singapore policy. Neither document is wrong, and their chunks look almost the same, so retrieval has no reason to prefer one. What's missing is a field: which region this policy applies to.

This is the fifth post in the AI part of "Building Knowledge Bases". [Order 13](/posts/learning/2026-10-22-ai-kb-parsing-cleaning-en) turned documents into text; this post covers which fields to record for each document and each chunk besides the text. Who can find which document, meaning how permission fields are enforced, is order 17. By the end you'll be able to define a metadata schema for your own corpus.

## Three purposes of metadata

Azure's RAG guide sorts each chunk's fields into three purposes ([Azure: RAG enrichment phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-enrichment-phase)):

- **Return**: handed back with the result so the model and the reader know the source, such as the source URL or document title.
- **Search**: compared against the question, such as a summary or keywords.
- **Filter**: used to exclude non-matching items before searching, such as language or region.

A field can serve more than one purpose. Amazon Bedrock knowledge bases have a switch that makes this clear. When it's off, metadata is used only for filtering and doesn't affect semantic search. When it's on, metadata is prepended to each chunk before embedding, so questions mentioning those values score higher; but the metadata doesn't appear in the original text returned in results ([Amazon Bedrock: S3 connector](https://docs.aws.amazon.com/bedrock/latest/userguide/s3-data-source-connector.html)).

**Filtering happens before search.** OpenAI's retrieval guide says attribute filtering narrows the scope to files matching the criteria before semantic search is performed ([OpenAI: Retrieval](https://developers.openai.com/api/docs/guides/retrieval)). In the opening example, with a "region = Taipei" filter, the Singapore policy never becomes a candidate.

## Exact conditions need fields

Semantic search is good at finding content with similar meaning, not at telling apart different models or different years. Azure's guide gives an example: "Review for product X for year 2009" is semantically like "Review for product X for 2010" and "Review for product Y for 2009", and in such cases matching on the product and year keywords is more effective.

In 2026 Yousuf and colleagues experimented with US public companies' annual reports: writing document-level information such as company name and year in front of each chunk raised the share of top-five results containing the right chunk from 33% to 55% ([Yousuf et al. 2026](https://arxiv.org/abs/2601.11863)). They also found that company and year mattered most, while section headings helped only a little.

**A document's structure is metadata too.** [Order 13](/posts/learning/2026-10-22-ai-kb-parsing-cleaning-en) mentioned that in one study, switching to heading-based chunking and attaching a heading path to each chunk (e.g. "Chapter 3 > 3.2 Application process") greatly improved accuracy on table questions; the two changes were made together. In 2024 LinkedIn split customer-service tickets along their original fields (summary, description, priority, steps to reproduce) into graph nodes and linked related tickets to each other, instead of cutting them into fixed-length chunks. The whole system improved both retrieval and resolution time after launch ([Xu et al. 2024](https://arxiv.org/abs/2404.17723)); but that's the result of the whole system, and the contribution of the field structure alone wasn't measured.

## Common fields

No single source lists every field; this is a list I've assembled from several official guides. Azure lists ID, title, summary, keywords, source and language; Microsoft's content guidance for Copilot adds owner, effective date, region, document type, review date, and a "current / archived / superseded" status ([Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/copilot/employee-self-service/optimization-sharepoint)); OpenAI's and Bedrock's examples both include dates.

| Field | Purpose | Example |
|---|---|---|
| Document ID | Finding the same document on update or deletion | `hr-leave-policy-tw` |
| Source | Returned, so answers can cite it | Original file URL or path |
| Heading path | Search, return | Leave policy > 3. Applying and approval |
| Document type | Filter | Policy, how-to, FAQ |
| Scope | Filter | Region: Taipei; staff: full-time |
| Effective date | Filter, sort | 2025-01-01 |
| Version and status | Filter | 2025 version; current |
| Language | Filter | zh-TW |
| Owner | Maintenance (order 9) | HR |
| Permission label | Filter (order 17) | Everyone, HR only |

The owner and version status from order 12's inventory become fields here. Date and version status are also prerequisites for order 18's handling of outdated documents: without them, you can't "search only the current version".

## How to store fields

How you store a field decides whether you can filter on it. A few things the vendors' documentation agrees on:

- **Store dates as numbers.** Bedrock's and Pinecone's greater-than and less-than comparisons accept only numbers ([Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-test-config.html), [Pinecone: Filter by metadata](https://docs.pinecone.io/guides/search/filter-by-metadata)), and OpenAI's date examples also use Unix timestamps. Store "1 January 2025" as a string and you can only match it exactly, not ask for "2024 or later".
- **Use fixed options for values.** "Taipei", "Taipei City" and "TPE" are three different values. Define the allowed values for fields like scope, document type and status in advance.
- **Allow multiple values.** If a policy applies to both Taipei and Taichung, systems like Pinecone let a field hold a list.
- **File level or chunk level.** OpenAI attaches attributes to files, at most 16 per file; Pinecone attaches them to each record, meaning each chunk. If different sections of one file apply to different scopes, a system that attaches fields only to files means splitting it into several files.

**Store cleaned text in a separate field.** Azure's guide suggests that if you clean text for search (removing symbols, normalizing case), store the cleaned version in a separate field for searching and return the original. Bedrock does the same: metadata affects matching but doesn't appear in the returned original text. What readers see and what the model cites should be the original.

## Be careful letting an LLM generate metadata

Tagging metadata by hand takes time, so many tools have an LLM generate it: extracting keywords from the text, or filter conditions from the question. Research has found several problems:

- **Values wander off the allowed list.** In 2026 Poliakov and Shvai had GPT-3.5 extract source names from questions as filter conditions; the prompt listed 49 allowed sources, yet it produced 128, 79 of which weren't on the list ([Poliakov & Shvai 2026](https://arxiv.org/abs/2607.03929)). A filter that names a source the store doesn't contain retrieves nothing from that source.
- **Date conditions often aren't extracted.** In the same team's 2024 study, more than a fifth of the questions involved time, but a date condition was extracted for only about one in six ([Poliakov & Shvai 2024](https://arxiv.org/abs/2406.13213)).
- **Overly aggressive filtering hurts recall.** In 2025 Dadopoulos and colleagues tested on financial-report questions: having an LLM pick files first and then rewrite the query lowered the share of correct content retrieved, and expanding chunks with metadata increased unsupported content in the answers ([Dadopoulos et al. 2025](https://arxiv.org/abs/2510.24402)); in the same study, though, prepending metadata to chunks before embedding improved final answers in every comparison. The test had only 150 questions.
- **Better retrieval doesn't mean it's correct.** In 2026 Terrenzi and Ayvaz had an LLM rewrite open dataset descriptions; retrieval scores were best, but only about half of the claims in the rewrites were supported by the original data ([Terrenzi & Ayvaz 2026](https://arxiv.org/abs/2607.05970)).

So my principle is: **take filter fields' values from source systems; don't let an LLM generate them freely.** Region, effective date, owner and status already exist in the HR system or document library. An LLM can help generate fields used in search, like summaries and keywords, but spot-check them. Azure's Content Understanding is designed the same way: each auto-generated value comes with a confidence score so you can decide which to use directly and which need human review.

## Example: the same chunk with and without metadata

A chunk with only text:

> Employees with one year of service receive 7 days of annual leave; with two years, 10 days.

Suppose the Taipei policy was also revised last year and the 2023 version is still in the knowledge base. The same chunk with metadata is below; the "applies to" and "effective" lines are stored as filter fields and also prepended to the chunk for matching:

> Document: Leave policy > 2. Types of leave > Annual leave
> Applies to: Taipei office, full-time staff
> Effective: 2025-01-01 (current version)
>
> Employees with one year of service receive 7 days of annual leave; with two years, 10 days.

When a Taipei colleague asks "how many days of annual leave after one year":

- **Text only**: both the Taipei and Singapore chunks are found with similar scores; the model may cite the wrong one or blend the two numbers.
- **With metadata**: filtering on "applies to = Taipei" keeps the Singapore chunk out of the candidates, and filtering on "status = current" keeps out the 2023 version. The answer can cite "Leave policy > 2. Types of leave > Annual leave", so the reader knows where to check.

The site's post on [Contextual Retrieval](/posts/ai/2026-03-12-contextual-retrieval-en) covers another approach, having an LLM write a sentence of context for each chunk, and [Hierarchical Chunking](/posts/ai/2026-09-03-hierarchical-chunking-auto-merge-en) covers keeping parent and child structure.

## Limits of the research

Yousuf used US public companies' annual reports and 120 questions; LinkedIn's is one company's support tickets, with the question count not published; Poliakov and Dadopoulos use multi-hop news questions and financial-report questions respectively. None of these are ordinary companies' internal documents. Azure, OpenAI, Bedrock and Pinecone are official documentation, and field limits and operators change between versions. "Take filter fields' values from source systems" is a principle I've drawn from these studies; no study has compared it directly.

## What you can do tonight

1. **List the three situations your knowledge base gets wrong most often.** Wrong region, old version, wrong product? Each one points to a field you should have.
2. **Use the table above to draw up a field list for your corpus.** For each field, write its purpose: return, search or filter.
3. **Define allowed values for filter fields.** Which regions exist, which statuses; always store dates as numbers.
4. **Find where each field's value comes from.** If it can come straight from a source system, don't let an LLM guess it.

## Self-check

**Q:** Why should "scope" be its own field? Isn't writing it in the text enough?

**How to judge:** Written in the text, it can only take part in semantic matching, and the Taipei and Singapore texts are nearly identical, so matching can't tell them apart. As its own field, it can filter out the irrelevant version with "applies to = Taipei" before retrieval. Two conditions apply: the field's values need fixed options, or "Taipei" and "Taipei City" will miss each other; and in systems that attach fields only to files, sections of one file with different scopes must be split into separate files.

## References

- [Microsoft Azure Architecture Center, RAG enrichment phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-enrichment-phase)
- [Amazon Bedrock User Guide, Connect to Amazon S3 for your knowledge base](https://docs.aws.amazon.com/bedrock/latest/userguide/s3-data-source-connector.html)
- [Amazon Bedrock User Guide, Configure and customize queries and response generation](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-test-config.html)
- [OpenAI, Retrieval guide](https://developers.openai.com/api/docs/guides/retrieval)
- [Pinecone, Filter by metadata](https://docs.pinecone.io/guides/search/filter-by-metadata)
- [Microsoft Learn, Optimizing SharePoint content for Employee Self-Service agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/employee-self-service/optimization-sharepoint)
- [Yousuf et al. 2026, Utilizing Metadata for Better Retrieval-Augmented Generation (arXiv)](https://arxiv.org/abs/2601.11863)
- [Xu et al. 2024, Retrieval-Augmented Generation with Knowledge Graphs for Customer Service Question Answering (SIGIR 2024)](https://arxiv.org/abs/2404.17723)
- [Poliakov & Shvai 2024, Multi-Meta-RAG: Improving RAG for Multi-Hop Queries using Database Filtering with LLM-Extracted Metadata (arXiv)](https://arxiv.org/abs/2406.13213)
- [Poliakov & Shvai 2026, Probe, Don't Prompt: A Hidden-State Probe for Metadata Filtering in Multi-Meta-RAG (arXiv)](https://arxiv.org/abs/2607.03929)
- [Dadopoulos et al. 2025, Metadata-Driven Retrieval-Augmented Generation for Financial Question Answering (arXiv)](https://arxiv.org/abs/2510.24402)
- [Terrenzi & Ayvaz 2026, Faithful or Findable? Evaluating LLM-Generated Metadata for RDF Dataset Search (arXiv)](https://arxiv.org/abs/2607.05970)
- On this site: [Contextual Retrieval: Giving Every Chunk Its "What This Is About" Context](/posts/ai/2026-03-12-contextual-retrieval-en)
- On this site: [Hierarchical Chunking + Auto-Merge: Small Chunks Search Well, Big Chunks Read Well](/posts/ai/2026-09-03-hierarchical-chunking-auto-merge-en)

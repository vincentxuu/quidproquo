---
title: "Building an Academic Search Pipeline: The Roles of arXiv, OpenAlex, Crossref, Semantic Scholar, and PubMed"
date: 2026-08-22
category: ai
type: deep-dive
tags: [academic-search, literature-review, arxiv, openalex, crossref, semantic-scholar, pubmed]
lang: en
series:
  name: "Search and Scraping in Practice"
  order: 12
tldr: "An academic-search pipeline cannot simply concatenate five APIs: use arXiv or PubMed for domain discovery, align OpenAlex and Semantic Scholar records through DOI, PMID, and arXiv IDs, then use Crossref and PubMed relationships to check the version of record, corrections, and retractions."
description: "A maintainable academic-search pipeline covering the roles of five sources, DOI/PMID/arXiv entity resolution, preprint-to-version-of-record links, author and institution identity, citation-count differences, deduplication, and incremental updates."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-academic-search-pipeline)

Ordinary web search needs to answer which URL is worth reading. Academic search has a harder question: **are these five records five papers, five versions of one paper, or one paper plus its correction and retraction notices?**

[arXiv](https://info.arxiv.org/help/api/), [OpenAlex](https://help.openalex.org/api/), [Crossref](https://www.crossref.org/documentation/retrieve-metadata/rest-api/), [Semantic Scholar](https://api.semanticscholar.org/api-docs/), and [PubMed](https://www.ncbi.nlm.nih.gov/books/NBK25501/) are not interchangeable search engines. Their strengths are preprints, a cross-disciplinary knowledge graph, publisher-deposited metadata, semantic and citation exploration, and biomedical indexing, respectively. A reliable agent should combine them as a pipeline with explicit ownership boundaries—not append five JSON responses and ask a model to guess.

This article provides a data model, resolution rules, and **14 replayable entity-resolution fixtures**. It is not a live API benchmark. No complete, same-time raw response set from all five services was preserved, so this article reports no hit-rate, citation-count ranking, or latency comparison, and does not claim that the fixtures were verified against live endpoints.

## Give each source one job

| Source | Best job | Stable identifiers and fields | Do not treat it as |
|---|---|---|---|
| [arXiv API](https://github.com/arXiv/arxiv-docs/blob/develop/source/help/api/user-manual.md) | Discover recent preprints, subject classes, version history, and journal references | arXiv ID, `v1`/`v2`, `updated` | A peer-review or publication-status database |
| [OpenAlex](https://help.openalex.org/data/works/) | Cross-disciplinary discovery and work-author-institution-citation graphs | OpenAlex Work ID, DOI, PMID, PMCID, ORCID, ROR | The publisher authority for version status |
| [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/) | Retrieve publisher-deposited metadata, work relationships, and post-publication updates by DOI | DOI, `relation`, `update-to`, indexed date | A full-text service or a catalog of every scholarly object |
| [Semantic Scholar Graph API](https://api.semanticscholar.org/api-docs/) | Semantic discovery, similar papers, and citation expansion | S2 Paper ID; also accepts DOI, arXiv ID, PMID, and PMCID | The sole authority for DOI or retraction state |
| [PubMed and E-utilities](https://www.ncbi.nlm.nih.gov/books/NBK25501/) | Biomedical queries, MeSH, PMID, and linked citations such as errata and retractions | PMID, PMCID, DOI, publication type, CommentsCorrections | An all-discipline citation graph |

Start through one of two domain routes. For recent computer-science, mathematics, and physics work, discover in arXiv and enrich the citation graph through OpenAlex and Semantic Scholar. For biomedical questions, narrow the query through PubMed fields or MeSH before adding the other graphs. If a DOI is already known, skip another text search: fetch Crossref directly, then use the DOI to retrieve the corresponding OpenAlex and Semantic Scholar records.

```text
query
  ├─ CS / math / physics ──> arXiv discovery
  ├─ biomedical ───────────> PubMed discovery
  └─ broad / citation ─────> OpenAlex + Semantic Scholar discovery
                                  │
                                  v
                         identifier resolution
                    DOI / PMID / PMCID / arXiv ID
                                  │
                    ┌─────────────┴─────────────┐
                    v                           v
             Crossref relations        PubMed linked citations
           version / update status    erratum / retraction / EoC
```

## Build a work graph, not a flat table

A single `papers` table tends to force a preprint and its published version into one row. The next update then overwrites the original record with a correction or retraction notice. A safer minimum model has four object types:

```yaml
work:
  local_id: work_...
  identifiers: {doi: null, pmid: null, pmcid: null, arxiv: null, s2: null, openalex: null}
  title: "..."
  authorships: []
  source_records: []
  status: active

version:
  work_id: work_...
  kind: preprint | accepted | version_of_record
  identifier: "..."
  version_label: null

relation:
  from_work: work_...
  type: is_preprint_of | is_version_of | corrects | retracts | expression_of_concern_for
  to_work: work_...
  asserted_by: crossref | pubmed | retraction_watch | local_rule

metric_observation:
  work_id: work_...
  metric: citation_count
  source: openalex | semantic_scholar | crossref
  value: 0
  observed_at: "..."
```

The distinction matters: **identifiers establish identity, relations preserve connections between distinct entities, and metrics always carry a source and timestamp.** Matching DOIs will usually merge. A preprint DOI and a different version-of-record DOI should be linked rather than reduced to one. A correction or retraction notice is itself a separately citable work.

## Normalize identifiers before fuzzy matching

For a DOI, remove `https://doi.org/`, `doi:`, and surrounding whitespace, then lowercase it. A PMID should contain digits only. For arXiv, retain both the base ID and the version. The official arXiv manual distinguishes a base-ID request for the latest version from an ID with a `vN` suffix for a particular version, so ingestion must not discard that suffix without preserving it elsewhere.

```python
import re
from urllib.parse import unquote

def normalize_doi(value: str | None) -> str | None:
    if not value:
        return None
    value = unquote(value).strip().lower()
    value = re.sub(r"^(https?://(dx\.)?doi\.org/|doi:\s*)", "", value)
    return value.rstrip(" .") or None

def normalize_pmid(value: str | None) -> str | None:
    if not value:
        return None
    match = re.fullmatch(r"(?:pmid:\s*)?(\d+)", value.strip(), re.I)
    return match.group(1) if match else None

def normalize_arxiv(value: str | None) -> tuple[str | None, int | None]:
    if not value:
        return None, None
    value = re.sub(r"^https?://arxiv\.org/(abs|pdf)/", "", value.strip(), flags=re.I)
    value = value.removesuffix(".pdf")
    match = re.fullmatch(r"(.+?)(?:v(\d+))?", value, re.I)
    return (match.group(1).lower(), int(match.group(2)) if match.group(2) else None)
```

Use a fixed confidence order for merges:

1. Identical normalized DOI.
2. Identical PMID or PMCID, or an explicit external-ID crosswalk supplied by a source.
3. Identical arXiv base ID; keep individual revisions under `version`.
4. An explicit work relationship from Crossref, PubMed, or another trusted source.
5. Title, first author, year, and venue metadata may only create a candidate. Without a second independent signal, route the candidate to review.

Do not make “title similarity above a threshold” an automatic merge rule. Titles can be translated, shortened, or expanded with subtitles, and two papers can genuinely share a title. The correct output of fuzzy matching is `candidate_match`, not `same_work=true`.

## Fourteen entity-resolution fixtures

The following are rule fixtures, not live API results. A test runner should replace tokens such as `<doi-a>` and `<pmid-a>` with fixed, public records, then store each response, query time, and schema version in a fixture directory before calling the test an integration test.

| ID | Cross-source input | Expected decision | Failure prevented |
|---|---|---|---|
| F01 | Crossref `https://doi.org/<DOI-A>`; OpenAlex `doi:<doi-a>` | Merge into one work | DOI case and URL forms create duplicates |
| F02 | PubMed `<pmid-a>` carries a DOI; Semantic Scholar queried by `PMID:<pmid-a>` returns that DOI | Merge and retain PMID, DOI, and S2 ID | One biomedical paper becomes two records |
| F03 | arXiv `<arxiv-a>v1` and `<arxiv-a>v3` | One preprint work with two versions | The latest revision destroys v1 traceability |
| F04 | An arXiv record has no DOI; Semantic Scholar resolves `ARXIV:<arxiv-a>` to an S2 ID | Merge through the explicit ID crosswalk | A DOI-less paper relies on title guessing |
| F05 | arXiv or preprint DOI A; Crossref says version-of-record DOI B `hasPreprint` A | Keep A and B separate; add `is_preprint_of` | The unreviewed and published files collapse |
| F06 | OpenAlex and Crossref titles match, but year and first author differ | Reject merge | Same-title papers merge |
| F07 | Punctuation-normalized title, year, and first author match, but no shared ID exists | Create a candidate pending a second signal | Fuzzy matching becomes overconfident |
| F08 | Crossref correction DOI C `updates` DOI B | C stays an independent notice; B gets a `corrected` status edge | A correction overwrites original metadata |
| F09 | PubMed retraction PMID R points to PMID P; Crossref or Retraction Watch also supplies a DOI relation | Keep notice and original separate; mark P retracted; retain both provenances | The original disappears with no retraction evidence |
| F10 | Same name, different ORCIDs, similar fields | Do not merge authors | Name collision |
| F11 | Same ORCID, different name abbreviations; OpenAlex affiliations resolve to the same ROR | Merge author and retain raw names | Abbreviations split one author |
| F12 | “University School of Medicine” and “University” have separate RORs linked through lineage | Preserve child and parent, then connect hierarchy | Aggregation duplicates or loses granularity |
| F13 | OpenAlex, Semantic Scholar, and Crossref return different citation counts for one DOI | Keep identity; store three timestamped metrics | Metric disagreement creates fake works |
| F14 | Crossref later updates the title or relation for the same DOI | Add a source revision to the same work and rerun status rules | A metadata update becomes a new paper |

In implementation, turn this table into YAML or JSON and require the resolver to return `merge`, `link`, `candidate`, or `reject`. Every fixture should also assert that provenance survived. Testing only the final work count is not enough.

## Preprint to version of record: link, do not flatten

Crossref's versioning guidance assigns separate DOIs to a preprint and an accepted or version-of-record publication, connecting them through relationships such as `hasPreprint` and `isPreprintOf`. That dictates the data model: a search interface may visually fold them into one work family, but a citation still needs to select a concrete version.

Use these defaults:

- For novelty tracking, show the latest arXiv revision while retaining the first-submission date.
- For evidence citation, default to the version-of-record DOI when one exists.
- If the preprint has readable text and the publisher version is paywalled, link to the readable copy while clearly identifying which version the citation metadata describes.
- Without an explicit relation, title and author similarity may create a candidate but must not declare that a preprint was published.

OpenAlex exposes multiple locations and scores `best_oa_location` using submitted, accepted, and published versions. That is useful for finding a readable copy, but it is not a publisher's authoritative assertion of the relationship. Preserve both kinds of information.

## Corrections, retractions, and expressions of concern are status edges

Crossref recommends publishing an editorially significant update as an independent notice with a different DOI linked to the affected work. The Crossref REST API's `update-to` data also incorporates publisher and [Retraction Watch](https://www.crossref.org/documentation/retrieve-metadata/retraction-watch/) records, with provenance distinguishing `publisher` from `retraction-watch`.

PubMed separately uses linked citations for Erratum, Retraction, Update, and Expression of Concern relationships. Take the union of these signals rather than letting one overwrite the other:

```text
active -> expression_of_concern -> corrected
   └────────────────────────────> retracted
retracted -> reinstated
```

Status is not one Boolean. At minimum, retain `status`, `effective_date`, `notice_id`, `asserted_by`, and `observed_at`. If Crossref and PubMed temporarily disagree, display the source disagreement and retain both observations. Do not ask the model to decide which service must be right.

## Author and institution identity: ORCID and ROR are anchors, not magic

OpenAlex clusters raw author names into Author IDs, and its author records can include ORCID and affiliation history. Institutions use ROR as an external anchor and retain lineage. The official documentation also warns that affiliation parsing can miss or misassign institutions, while sub-institution detail depends on ROR coverage.

Use three author-resolution tiers:

- **Automatic merge:** same ORCID with no explicit conflicting evidence.
- **Candidate merge:** name variants plus consistent coauthors, topics, and affiliation history.
- **Never automatic:** name alone, or conflicting ORCIDs.

Do not store only an institution's display name. Preserve raw affiliation, matched ROR, match method, confidence, and lineage. Roll up through lineage when computing university-wide totals; show the original work-level affiliation when presenting a byline. This avoids rewriting historical affiliations for aggregation convenience.

## Citation counts are supposed to differ

A citation count is not an intrinsic work attribute. It is the number of citation edges one database had successfully built at one time. OpenAlex documents that it matches references by DOI first and then by bibliographic metadata; a missing source reference list, an unindexed work, or a failed match can all reduce `cited_by_count`. Crossref Cited-by counts links it can establish among Crossref-registered works, while reference deposits are optional. Semantic Scholar identifies citing papers from its own corpus and publisher or PDF data.

Do not choose the largest count and do not average them:

```json
{
  "metric": "citation_count",
  "observations": [
    {"source": "openalex", "value": null, "observed_at": "<timestamp>"},
    {"source": "semantic_scholar", "value": null, "observed_at": "<timestamp>"},
    {"source": "crossref", "value": null, "observed_at": "<timestamp>"}
  ]
}
```

A ranking must say “ordered by OpenAlex citation count” or “ordered by Semantic Scholar citation count.” Longitudinal comparisons must keep the source and capture date fixed. Research assessment should never splice different providers' values into one trend line.

## Deduplication and updates must be replayable

Split the complete pipeline into six auditable stages:

1. `discover`: store query, provider, cursor, and raw-response hash.
2. `normalize`: perform deterministic identifier, date, and string normalization only.
3. `resolve`: apply F01–F14 and emit merge, link, candidate, or reject.
4. `enrich`: retrieve other sources by DOI, PMID, or arXiv ID; search ranking is no longer identity evidence.
5. `status`: recheck Crossref updates, Retraction Watch, and PubMed linked citations.
6. `publish`: cite a concrete version and include provenance and observation time.

Incremental updates must not rely on publication date because metadata, citation counts, and status can change for old works. Crossref recommends created, updated, or indexed-date filters depending on the use case; indexed date also captures citation-count and relation changes added by Crossref or third parties. PubMed publishes an annual baseline plus daily update files. Give every connector its own high-water mark, overlap each polling window, then deduplicate so timestamp boundaries cannot silently drop records.

The stopping condition is not “all five APIs were queried.” Stop when high-confidence identifiers are aligned, version relationships have not been flattened, status sources were checked, citation counts name their provider, and low-confidence candidates were not automatically merged. At that point the agent has citable scholarly entities—not merely strings that resemble a bibliography.

## Validation boundary

API fields and relationship semantics in this article were checked against official documentation available on 2026-08-22. The 14 cases are rule fixtures awaiting fixed public records supplied by a runner. This article did not preserve live API raw results and therefore did not validate each service's current schema details, rate limits, ingestion lag, or crosswalk for any particular work. To turn the design into a production connector, assign public identifiers to every fixture, preserve raw responses, and have daily CI distinguish upstream data changes from resolver regressions.

## References

- [arXiv API User's Manual](https://github.com/arXiv/arxiv-docs/blob/develop/source/help/api/user-manual.md)
- [OpenAlex API reference](https://help.openalex.org/api/)
- [OpenAlex Works attributes](https://help.openalex.org/data/works/attributes/)
- [OpenAlex citations and references](https://help.openalex.org/data/works/citations/)
- [OpenAlex Authors](https://help.openalex.org/data/authors/)
- [OpenAlex Institutions](https://help.openalex.org/data/institutions/)
- [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)
- [Crossref version control, corrections, and retractions](https://www.crossref.org/documentation/principles-practices/best-practices/versioning/)
- [Crossref relationships](https://www.production.crossref.org/documentation/schema-library/markup-guide-metadata-segments/relationships/)
- [Crossref Retraction Watch data](https://www.crossref.org/documentation/retrieve-metadata/retraction-watch/)
- [Crossref REST API sync tips](https://www.crossref.org/documentation/retrieve-metadata/rest-api/tips-for-using-the-crossref-rest-api/)
- [Crossref Cited-by](https://www.crossref.org/documentation/cited-by/)
- [Semantic Scholar Academic Graph API](https://api.semanticscholar.org/api-docs/)
- [Semantic Scholar citation-count FAQ](https://www.semanticscholar.org/faq/estimated-citations)
- [NCBI Entrez Programming Utilities Help](https://www.ncbi.nlm.nih.gov/books/NBK25501/)
- [PubMed Help and Citation Matcher API](https://pubmed.ncbi.nlm.nih.gov/help/)
- [PubMed XML Help: errata, retractions, and linked citations](https://www.ncbi.nlm.nih.gov/books/NBK3828/)

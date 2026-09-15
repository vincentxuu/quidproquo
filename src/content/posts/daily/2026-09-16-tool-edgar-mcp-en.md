---
title: "Tool Pick | edgar-mcp — Read Just the One Section of a 10-K, Not All 300 Pages"
date: 2026-09-16
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source MCP server that talks directly to SEC EDGAR's public data, no API key required, letting an agent read one precise section of a 10-K instead of blowing its context window on the whole filing"
tldr: "edgar-mcp is an MCP server for SEC EDGAR with six tools covering company lookup, filing lists, section extraction, financial facts, and full-text search. Install: pip install -e . then set EDGAR_MCP_USER_AGENT — no API key needed. It addresses the problem of agents being forced to swallow an entire 10-K when the context window gets eaten by tables of contents and legal boilerplate."
series:
  name: "AI Tool of the Day"
  order: 31
---

> 🌏 [中文版](/posts/daily/2026-09-16-tool-edgar-mcp)

## Tool Info

| Field | Value |
|---|---|
| Name | edgar-mcp |
| Type | MCP server |
| GitHub | [titusblair/edgar-mcp](https://github.com/titusblair/edgar-mcp) |
| Stars | 1 |
| Language | Python |
| License | MIT |
| Install | `pip install -e . && export EDGAR_MCP_USER_AGENT="Your Name you@example.com"` |

## What Problem It Solves

You ask an agent to assess a public company's risk profile from its 10-K, and it has to read the filing first. The problem is a 10-K routinely runs 300 pages — feeding the whole thing to a model burns 50,000+ tokens, and most of that is legal boilerplate and a table of contents. Answering a question like "what does the company say about supply chain risk" only ever needs Item 1A. Most EDGAR API wrappers just expose the official API as-is — they return the whole document and leave the genuinely hard decisions (which section, how much of it, which XBRL tag) to whatever's calling them.

edgar-mcp bakes those decisions into the server itself. `read_filing_section` returns exactly one section, capped at `max_tokens`, and says explicitly how much got cut instead of silently truncating. Telling a section heading in the table of contents apart from the real section is a simple rule that holds up in practice: a TOC entry is immediately followed by the next TOC entry, while a real section is followed by actual section text — the amount of text that follows is enough to separate the two, and the rule holds across companies with wildly different formatting. Company lookups don't require a separate call to resolve a ticker or CIK first — all six tools accept a plain-text company name and resolve it internally; when resolution fails, the error message comes back with a candidate list and the exact follow-up call to make, instead of a bare "not found."

Good fit for: an agent doing investment research or compliance analysis that needs to read a precise section of a filing or a specific financial metric; a use case tracking the same company's numbers across several years of filings, since the tool already handles the case where a company switches its XBRL tag name between fiscal years (e.g. a revenue field moving from `Revenues` to `RevenueFromContractWithCustomerExcludingAssessedTax`).

## Quick Start

### Install

```bash
git clone https://github.com/titusblair/edgar-mcp
cd edgar-mcp
pip install -e .

# The SEC requires a User-Agent with real contact details on every request, or it gets blocked
export EDGAR_MCP_USER_AGENT="Your Name you@example.com"
```

Wire it into Claude Code:

```bash
claude mcp add edgar -e EDGAR_MCP_USER_AGENT="Your Name you@example.com" -- edgar-mcp
```

### Basic Usage

```
> read_filing_section(company="AAPL",
                       accession="0000320193-25-000079",
                       section="risk_factors")

✓ Item 1A — Risk Factors
  17,040 tokens, from a 54,955-token document
```

The six tools line up with how you'd actually work through a lookup: `find_company` (name/ticker to CIK, with a confidence score — it refuses to guess rather than return a bad match) → `list_filings` (what a company has filed, newest first) → `list_filing_sections` (what sections a given filing has, and how many tokens each would cost to read) → `read_filing_section` (the main tool, with an offset for continuing a long section) → `get_financial_facts` (a reported figure across periods, covering 14 common concepts) → `search_filings` (full-text search from 2001 to present).

### Advanced Usage

The project ships an eval suite that runs against live SEC data, rather than relying on ad-hoc manual testing to judge whether it works:

```bash
python3 evals/run_eval.py
```

```
  company resolution
    accuracy_on_answerable       100.0%    (35/35)
    refusal_rate_on_ambiguous    100.0%    (5/5)

  section retrieval
    grounded                     100.0%
    recall_at_1                   38.5%
    recall_at_3                  100.0%
```

The author chose to report `recall_at_1` at only 38.5% honestly rather than hide it — sections like "Risk Factors" and "Business" genuinely overlap in vocabulary, so ranking accuracy alone is a hard number to push high. What actually matters is that `grounded` stays at 100%: the section that should answer a question does contain the answer, even if the ranking still has room to improve.

## Comparison With Existing Approaches

| | edgar-mcp | Calling the official EDGAR API directly | Generic web scraping of filing HTML |
|---|---|---|---|
| Returns a single section instead of the whole document | ✅ | ❌ (returns the full JSON/document) | ❌ (you split sections yourself) |
| No API key | ✅ (only a User-Agent header) | ✅ | ✅ |
| Merges XBRL financial concepts across tag renames | ✅ (14 concepts auto-mapped to multiple tags) | ❌ (you need to know every tag name) | ❌ |
| Ships with an eval suite verifying accuracy | ✅ | — | — |
| Section extraction accuracy | Heuristic based on text length, not 100% | Not applicable (no section splitting) | Depends on site structure; breaks whenever the layout changes |

## Caveats

- **A brand-new solo project.** One star, created less than a day ago, with no track record in production yet. Run the built-in evals and protocol tests yourself before relying on it for anything real.
- **Section extraction is heuristic.** The README itself admits it can fail on unusual formatting or older scanned filings. `list_filing_sections` lets you check a section exists and its size looks reasonable before calling `read_filing_section`.
- **US-GAAP only, and thin before 2001.** `get_financial_facts` often can't find data for foreign private issuers filing under IFRS (the tool says so explicitly instead of returning an empty list); full-text search only covers filings from 2001 onward.

## Today's Takeaway

Most "MCP wrapper for API X" projects carry the API over unchanged — the tool count matches the endpoint count, and every judgment call gets pushed back onto the model. edgar-mcp does the opposite: it bakes domain knowledge ("which endpoint answers this, how much to read, which field name applies") into the server itself, and keeps only six tools. That's the real lesson — a good MCP server's value usually isn't in how many APIs it wraps, but in how many rounds of trial-and-error it saves the model from having to work out on its own.

## References

- [titusblair/edgar-mcp GitHub repo](https://github.com/titusblair/edgar-mcp): full README — design rationale, the six tools, eval results, known limitations; the primary source for this article's technical details.
- GitHub API repo metadata (`titusblair/edgar-mcp`): stars (1), language (Python), license (MIT), creation date (2026-09-15), via the GitHub REST API.
- [SEC EDGAR API documentation](https://www.sec.gov/edgar/sec-api-documentation): SEC EDGAR is the U.S. Securities and Exchange Commission's public filing system; edgar-mcp talks directly to its public API (including Full-Text Search and the XBRL Frames API), requiring only a User-Agent with real contact details.

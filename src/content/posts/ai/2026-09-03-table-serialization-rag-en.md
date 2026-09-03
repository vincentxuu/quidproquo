---
title: "Table Serialization: How Format Choice Shapes RAG Retrieval for Tabular Data"
date: 2026-09-03
type: deep-dive
category: ai
tags: [table-serialization, rag, structured-data, table-retrieval, embedding, chunking]
lang: en
tldr: "Markdown-KV format achieves 60.7% LLM comprehension accuracy vs 44.3% for CSV — a 16-point gap from format alone. But retrieval and comprehension have different optimal formats: metadata prepend + row-wise key-value is the current best combination for table RAG."
description: "Comparing Markdown Table, CSV, JSON, Key-Value, and natural language serialization formats for their impact on RAG retrieval and LLM comprehension, with benchmark data and practical recommendations."
draft: false
series:
  name: "RAG 技法大全"
  order: 52
---

> 🌏 [中文版](/posts/ai/2026-09-03-table-serialization-rag)

Tables are structured data, but embedding models consume text. Serialize the same table as Markdown, CSV, JSON, or key-value pairs, and you get four entirely different vectors — and benchmark data now shows which formats help RAG find the right rows.

## The Problem: Wrong Format, Wrong Embeddings

When a RAG pipeline processes tables, the serialization format affects at least three things:

1. **Embedding quality**: The format determines what the embedding model "sees." CSV's `100,200,300` and key-value's `price: 100, quantity: 200, total: 300` produce vastly different vectors — the latter carries semantic meaning, the former is just numbers.
2. **Token consumption**: The same table in HTML uses 3× more tokens than CSV. With fixed chunk sizes, heavier formats mean fewer rows per chunk.
3. **LLM comprehension**: Even after retrieval finds the right chunk, the format affects whether the LLM correctly maps headers to values.

## Five Major Formats

### Markdown Table

```
| Product | Price | Stock |
|---------|-------|-------|
| A       | 100   | 50    |
| B       | 200   | 30    |
```

The most common format, preserving visual structure. High token efficiency (25,140 tokens for the full test set per Improving Agents' benchmark), 51.9% LLM accuracy. The downside: with many rows, models misalign values with headers — the header appears only once, and distant rows require the model to "count columns."

### CSV / TSV

```
Product,Price,Stock
A,100,50
B,200,30
```

Most token-efficient, mature tooling ecosystem. Same weakness as Markdown Table: header appears only once. Per Improving Agents' tests, CSV accuracy is 44.3% — the lowest among all formats. Simon Willison's Hacker News comment captures the root cause: "The problem with CSV and regular markdown tables is that it is too easy for the model to mistakenly associate a value in a row with the wrong header."

### JSON / Key-Value

```json
{"Product": "A", "Price": 100, "Stock": 50}
{"Product": "B", "Price": 200, "Stock": 30}
```

Every row carries its complete keys, eliminating header misalignment. The cost: token consumption — JSON format used 66,396 tokens in testing, 2.6× Markdown Table. JSON accuracy: 52.3%.

### Markdown Key-Value (Markdown-KV)

```
## Record 1
Product: A
Price: 100
Stock: 50

## Record 2
Product: B
Price: 200
Stock: 30
```

Each row is independent, keys repeat per row, `##` headings separate records. Per Improving Agents' benchmark on GPT-4.1-nano, **Markdown-KV achieved 60.7% accuracy — the highest among all formats**, with a 95% confidence interval of 57.6%–63.7%. Token usage: 52,104 — about 78% of JSON. Simon Willison called this intuitive: "Explicit key/value formats like this or YAML or JSON objects make [misalignment] a lot less likely."

### Natural Language

```
Product A is priced at $100 with 50 units in stock.
Product B is priced at $200 with 30 units in stock.
```

Theoretically the best for embedding quality (embedding models are designed for natural language), but LLM accuracy is only 49.6% — lower than Markdown Table. Natural language introduces ambiguity: "50 units in stock" could mean "at least 50" or "exactly 50." Token usage: 43,411, middle of the pack.

## Benchmark Data

### LLM Comprehension Accuracy (Improving Agents, GPT-4.1-nano)

| Format | Accuracy | 95% CI | Tokens |
|--------|----------|--------|--------|
| **Markdown-KV** | **60.7%** | 57.6%–63.7% | 52,104 |
| XML | 56.0% | 52.9%–59.0% | 76,114 |
| INI | 55.7% | 52.6%–58.8% | 48,100 |
| YAML | 54.7% | 51.6%–57.8% | 55,395 |
| HTML | 53.6% | 50.5%–56.7% | 75,204 |
| JSON | 52.3% | 49.2%–55.4% | 66,396 |
| Markdown Table | 51.9% | 48.8%–55.0% | 25,140 |
| Natural Language | 49.6% | 46.5%–52.7% | 43,411 |
| CSV | 44.3% | — | — |

The pattern is clear: **formats where keys repeat per row (Markdown-KV, XML, INI) consistently outperform formats where the header appears only once (CSV, Markdown Table)**.

Note: this benchmark measures LLM comprehension accuracy, not embedding retrieval quality. The optimal format for each may differ.

### Retrieval Quality (Table Serialization Kitchen + TARGET Benchmark)

Gomm & Hulsebos (2025) presented "Metadata Matters in Dense Table Retrieval" at the ELLIS workshop, systematically testing serialization parameters on the TARGET benchmark. Key findings:

- **Metadata (table title, source) matters more than serialization format itself** — formats with metadata consistently outperform those without
- Row-wise JSON and Markdown show similar retrieval performance, but both improve significantly with metadata prepend
- Row count impact: partial sampling (5-10 rows) sometimes outperforms full tables — because chunks are more focused

### TabRAG (NeurIPS 2025 AI4Tab)

Per Si et al.'s TabRAG (arXiv:2511.06582), a RAG pipeline designed for table-heavy documents uses "structured language representations" instead of plain text serialization: preserving cell coordinates, merged cell information, and hierarchical relationships. It shows significant improvements on TAT-DQA (financial documents) and MP-DocVQA (multi-domain) over traditional serialization pipelines.

## Serialization vs Chunking vs Query

Table processing in RAG involves three independent decision points:

```
          Serialization       Chunking             Query
  Table ──────────────→ Text ──────────→ Chunks ──────────→ Results
       Format choice        STC / header     embed + retrieve
       (this article)       propagation       or Text2SQL
                            (chunking article)
```

- **Serialization** decides the format (this article): Markdown, JSON, key-value, natural language
- **Chunking** decides how to split (see [Chunking Strategies](/en/posts/ai/2026-03-12-chunking-strategies-en)): Table-Aware Chunking (STC) uses rows as the atomic unit; Header Propagation prepends headers to every chunk
- **Query** decides the path (see [Text-to-SQL Router](/en/posts/ai/2026-03-12-text-to-sql-router-en)): when tables are structured enough with a schema, Text2SQL is far more precise than serialization + RAG. RAG suits tables embedded in unstructured documents without a DB connection

The three are independent but their effects compound. Changing serialization format alone yields a 16-point improvement (CSV → Markdown-KV); adding metadata prepend and header propagation amplifies the gains.

## Cross-Reference with arXiv:2508.00217 Survey

arXiv:2508.00217 (Tabular Data Understanding with LLMs, 2025) is the most comprehensive table serialization survey to date, covering serialization, visual representation, and fine-tuning approaches. Notable observations:

- **Format sensitivity**: LLMs are more sensitive to serialization format than expected. The same table in a different format can flip the same model's answer from correct to incorrect
- **Merged cells**: LaTeX's `\multicolumn` preserves hierarchical structure, but other formats lose these relationships during serialization
- **Cross-format conversion**: A future research direction is serialization-to-serialization (e.g., JSON → Markdown), training model robustness to format variation

## Practical Recommendations

Based on the benchmark data and research above:

**Small tables (< 20 rows, fits in one chunk)**:
- Keep the entire table intact, no splitting. Use Markdown Table format — best token efficiency, complete structure
- Add metadata prepend (filename + section header)

**Large tables (> 20 rows, must chunk)**:
- Use row-wise key-value format (repeat keys per row)
- Pair with Header Propagation (prepend header at the start of each chunk)
- Add metadata prepend (filename + section header + table title)

**Structured tables with schema, needing precise numerical queries**:
- Use Text2SQL, not serialization + RAG

**When using strong models (GPT-4o / Claude class)**:
- Per the Hacker News discussion, stronger models are less format-sensitive — "Use the best model you can reasonably afford, then format will matter less"
- But on cheaper models or embedding models, format choice remains critical

## Overall

Table serialization is an underappreciated decision point in RAG pipelines. Most systems default to Markdown Table or CSV — which happen to be the two formats with the lowest LLM comprehension accuracy. Markdown-KV (complete keys per row + `##` separators) leads by 16 percentage points, at the cost of roughly doubling token usage.

But format isn't the only variable. Gomm & Hulsebos's research shows that metadata (table title, source information) impacts retrieval quality even more than format itself. The optimal strategy stacks all three: choose the right format + prepend metadata + pair with Table-Aware Chunking.

## References

- [arXiv:2511.06582 — TabRAG: Tabular Document Retrieval via Structured Language Representations (NeurIPS 2025 AI4Tab)](https://arxiv.org/abs/2511.06582)
- [arXiv:2507.12425 — Advancing RAG for Structured Enterprise and Internal Data (2025)](https://arxiv.org/abs/2507.12425)
- [arXiv:2508.00217 — Tabular Data Understanding with LLMs: A Survey (2025)](https://arxiv.org/abs/2508.00217)
- [Gomm & Hulsebos — Metadata Matters in Dense Table Retrieval (ELLIS 2025)](https://ir.cwi.nl/pub/36085/36085.pdf)
- [Table Serialization Kitchen — Open-source tool](https://daniel-gomm.github.io/blog/2025/Table-Serialization-Kitchen)
- [Improving Agents — Which Table Format Do LLMs Understand Best?](https://www.improvingagents.com/blog/toon-benchmarks)
- [KX — Mastering RAG: Precision Techniques for Table-Heavy Documents](https://kx.com/blog/mastering-rag-precision-techniques-for-table-heavy-documents)
- [Anyscale — Integrating RAG with Structured Data](https://docs.anyscale.com/rag/structured-data)
- [Chunking Strategies](/en/posts/ai/2026-03-12-chunking-strategies-en) — Table chunking (STC, Header Propagation)
- [Text-to-SQL Router](/en/posts/ai/2026-03-12-text-to-sql-router-en) — Precise queries skip RAG
- [ColPali: Document Retrieval Without OCR](/en/posts/ai/2026-09-03-colpali-visual-document-retrieval-en) — Visual alternative

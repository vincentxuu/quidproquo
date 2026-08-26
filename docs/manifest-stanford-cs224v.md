# Stanford CS224V Manifest

**Course**: CS224V — Conversational Virtual Assistants with Deep Learning  
**Instructor**: Monica Lam (Stanford)  
**Offering**: Fall 2025 (Autumn 2025-26)  
**Series slug**: `stanford-cs224v`  
**Series name**: "Stanford CS224V 導讀"

---

## Canonical Offering Determination

| Offering | Status | Public Materials |
|----------|--------|------------------|
| **Fall 2025 (CS224V)** | ✅ **Canonical** | Complete: 14 lecture slides, 2 HWs, readings, project specs, project gallery |
| Spring 2026 (renamed "Agentic AI") | ❌ Not found | No public site at `cs324v.stanford.edu`, `web.stanford.edu/class/cs324v/`, or similar |

**Conclusion**: Fall 2025 is the **only** publicly accessible offering with complete materials. The "renamed in 2026" reference appears to be a future plan or internal designation; no Spring 2026 public site exists as of research date (2026-08-26).

**Year-mixing constraint**: **Cannot mix 2025 and 2026 materials** — 2026 offering has no public materials. All content must derive from Fall 2025 only.

---

## Lecture Inventory (14 Lectures)

| # | Date | Topic | Slides URL | Fidelity |
|---|------|-------|------------|----------|
| 1 | 9/22 | Introduction | `lectures/l-introduction.pdf` | L2 |
| 2 | 9/24 | Knowledge Curation (STORM/Co-STORM) | `lectures/2-knowledge-curation.pdf` | L2 |
| 3 | 9/29 | Building a Task-Oriented Agent (Genie Worksheet) | `lectures/3-task-oriented-agent.pdf` | L2 |
| 4 | 10/1 | Research Project Ideas (themes overview) | *No slides* (discussion session) | L0 |
| 5 | 10/6 | Evaluation of Task-Oriented Agents | `lectures/l-Worksheet2.pdf` | L2 |
| 6 | 10/8 | Student Project Ideas (pitches) | *No slides* (student presentations) | L0 |
| 7 | 10/13 | Grounding Conversational Agents on Free Text (WikiChat/RAG) | `lectures/l-freetext.pdf` | L2 |
| 8 | 10/15 | Project Proposals (presentations) | *No slides* | L0 |
| 9 | 10/20 | Project Proposals (cont.) | *No slides* | L0 |
| 10 | 10/22 | Agents for Structured & Hybrid Data (Semantic Parsing, DB) | `lectures/l-db-hybrid-intro.pdf` | L2 |
| 11 | 10/27 | Structured/Unstructured Query Language (SUQL) | `lectures/l-suql.pdf` | L2 |
| 12 | 10/29 | QA on Sets of Long Documents (SLIDERS) | `lectures/l-longdoc-new.pdf` | L2 |
| 13 | 11/3 | Document Set Analysis: Qualitative Coding | `lectures/l-data-coding.pdf` | L2 |
| 14 | 11/5 | Agentic AI for Knowledge Base Queries (SPARQL, Wikidata) | `lectures/l-agentic.pdf` | L2 |
| 15 | 11/10 | Satisfying NL Constraints Using SMT (Clinical Trial Matching) | `lectures/l-semantics.pdf` | L2 |
| 16 | 11/12 | NLP Building Blocks (Vision-Language for Historical Docs) | `lectures/l-churro.pdf` | L2 |
| 17 | 11/17 | Multimodal Applications (ReactGenie, GenieWizard) | `lectures/l-multimodal.pdf` | L2 |
| 18 | 11/19 | Training LLMs | `lectures/l-training.pdf` | L2 |

**Note**: Schedule shows 18 sessions but 4 are non-lecture (project pitches/proposals, Thanksgiving break). **14 substantive lectures** with slides.

---

## Supplementary Materials

| Material | URL | Fidelity |
|----------|-----|----------|
| Readings (PDF) | `CS224V_Readings.pdf` | L2 |
| Homework 1 (Genie Worksheet) | `assignments/CS_224V_HW1.pdf` | L2 |
| Homework 2 (Evaluation) | `assignments/CS_224V_HW2.pdf` | L2 |
| Project Specs | `projects.html` | L2 |
| Project Gallery (2025) | `https://cs224v-2025-projects.genie.stanford.edu` | L1 |
| Video Recordings | Canvas (Stanford login required) | L0 (not public) |

---

## Fidelity Legend

| Level | Definition |
|-------|------------|
| **L3** | Video + slides + transcript + assignments + solutions |
| **L2** | Slides + assignments + readings (no video) |
| **L1** | Partial materials (e.g., project gallery only) |
| **L0** | No public materials (session existed but nothing published) |

**Overall course fidelity: L2** — All 14 core lectures have slides; 2 HWs + readings + project specs available; videos restricted to Canvas.

---

## Key Topics Covered (for content planning)

1. **Computational Thinking for LLMs** — Course framing: turning hallucinating LLMs into dependable assistants
2. **Knowledge Curation** — STORM/Co-STORM for automated research & writing
3. **Task-Oriented Agents** — Genie Worksheet: high-level spec language, formal dialogue state, semantic parsing
4. **Evaluation** — Comparing agent architectures, task-oriented agent evaluation
5. **RAG & Grounding on Free Text** — WikiChat: retrieval, summarization, verification, evaluation
6. **Structured Data Agents** — Semantic parsing, SQL generation, few-shot on small schemas
7. **Hybrid Query Language (SUQL)** — NL + SQL unified query language
8. **Long Document QA** — SLIDERS: schematization, semantic chunking, reconciliation
9. **Qualitative Coding at Scale** — Automating social-science coding methods
10. **Agentic KB Queries** — SPARQL generation, action set design
11. **SMT for NL Constraints** — Satisfiability Modulo Theories, clinical trial matching case study
12. **Multimodal Agents** — ReactGenie, GenieWizard: voice + graphical composition
13. **LLM Training** — Instruction following, data curation
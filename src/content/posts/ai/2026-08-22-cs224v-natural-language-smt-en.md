---
title: "Stanford CS224V Lecture 11: Translate Trial Criteria into SMT Instead of Asking an LLM to Decide"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, formal-methods, smt, semantic-parsing]
lang: en
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 12
tldr: "The lecture parses patient records and trial criteria into SMT, retrieves candidates through a weaker propositional projection, and runs a solver on the reduced set. Reasoning is inspectable, but NL-to-SMT remains the main error boundary."
description: "CS224V Natural Language Constraints with SMT: clinical-trial matching, SMT representation, propositional projection, candidate retrieval, solver matching, and limits."
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224v-natural-language-smt)

This guide reconstructs the lecture from the [official Fall 2025 deck](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf); system descriptions and reported results below are attributed to that historical course material unless a paper is linked at the claim.

Lecture 11 is a formal-methods research case study, not medical advice. It asks how patient records and natural-language eligibility criteria can be matched at scale. Rather than asking an LLM for the eligibility decision, the pipeline translates language into a representation a solver can check.

## Agenda: from matching systems to an SMT pipeline

The deck motivates clinical-trial matching and reviews retrieval-plus-LLM work, then introduces SMT, datasets, and representations. It proceeds through NL-to-SMT, SMT-to-propositional-logic projection, large-scale retrieval, candidate-level SMT matching, errors, and limitations. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

## Trial criteria are logical constraints

“At least two years of allergic-rhinitis history” combines a Boolean fact and numerical comparison. Exclusions add negation, disjunction, time, and medical concept hierarchies. SMT can express Booleans, reals, and relations together. Patient records become assertions, and the solver checks whether patient and trial constraints are jointly satisfiable. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

The intermediate variables, assertions, and solver output are inspectable. But the solver has no medical semantics. Every useful fact must be formalized correctly, including terminology canonicalization through systems such as SNOMED CT.

## Three matching problems

Pairwise eligibility, finding trials for one patient, and cohort discovery across many records have different retrieval and error costs. Pairwise datasets may skip retrieval; patient-to-trial needs ranking and recall; cohort discovery adds privacy and population-scale filtering. The SMT-PL pipeline separates scalable candidate retrieval from formal matching. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

## What SMT adds over propositional logic

Propositional facts express diagnoses but not “at least one year,” an age interval, or a measurement threshold. SMT combines Booleans, numbers, and relations. Inclusion and exclusion criteria require conjunction, disjunction, negation, duration, and implications between specific and general concepts. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

A missed negation produces a perfectly reasoned answer over the wrong formula. Parsing fidelity and solver correctness are distinct outcomes.

## Shared clinical vocabulary

Patient and trial language can name the same concept differently. Canonicalization through a terminology aligns aliases and hierarchies. A specific chronic-asthma assertion may entail asthma; a generic asthma mention must not be promoted to chronic asthma. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

Entity misses, wrong concepts, and granularity mismatches need separate diagnosis. String normalization alone does not supply clinical semantics.

## Unknown is not false

Absence from a record usually means unknown, not negative. Representation must distinguish true, false, and unmentioned. Subjective or soft criteria may not be safely formalizable and should route to review. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

SAT means the supplied formulas are jointly satisfiable, not that real-world eligibility has been clinically established. UNSAT can also result from parsing error.

## The NL-to-SMT contract

Each variable needs type, canonical concept, source span, and polarity; every constraint should align to trial text. Syntax and types are machine-checkable, while semantic validity requires reviewed tests for negation, units, dates, logical scope, and inclusion/exclusion boundaries. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

Parsing once enables representation reuse, but parser and ontology versions determine when documents require recomputation.

## SMT-to-PL projection

Projection seeks the tightest constraints expressible in propositional logic. Too strong loses eligible candidates; too weak leaves too many expensive SMT checks. Measure candidate recall, reduction, and the share of PL-satisfiable pairs rejected by full SMT. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

## Scalable execution

Preprocess patient and trial documents into PL-indexable facts and SMT formulas. Retrieve candidates through the database, then run Z3 on the smaller set. Solver models or unsat cores can support explanations only when mapped back to source language. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

Cache keys need representation versions, and record or criterion updates invalidate matching. Freshness is part of correctness.

## Layered evaluation

Test solver formulas, reviewed NL-to-SMT alignment, projection recall/reduction, and end-to-end labels separately. Clinical labels themselves can be uncertain because records and criteria are ambiguous. False positives and false negatives have different workflow costs determined by clinical experts, not this course artifact. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

## A safe non-medical prototype

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Use event registration, prerequisites, or device compatibility. Define typed concepts and gold SMT, preserve formula-to-source alignment, and test negation, unknown values, units, and conflicts. Add PL projection and measure candidate recall before complete solver checks. Generate explanations only from aligned source spans.

## Why project to propositional logic

Full SMT checks across every patient-trial pair scale quadratically. The lecture projects SMT into weaker propositional constraints that can be indexed in a database, retrieves a high-recall candidate set, then runs the full solver only on candidates. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

This separates retrieval and reasoning. Missing a candidate points to projection or recall; a candidate-level error points to parsing, variables, or constraints. Formal methods do not remove errors, but they expose their location.

## The largest risk precedes the solver

NL-to-SMT can drop negation, confuse hard and soft constraints, or force clinical judgment into a Boolean. A solver guarantees reasoning over its formula, not fidelity of that formula to the source. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

> **Author extension:** A real system should retain source alignment, parser confidence, and expert review; SAT is not clinical approval.

## A safe exercise

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

**Author-created example:** Start outside medicine: formalize “attendees must be at least 18; students enter free; non-student tickets cost under 500.” Link every assertion to its sentence, then test missing, conflicting, and unknown inputs. Verify that unknown is not silently treated as false.

## Material gaps

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

The public deck provides no validated clinical deployment protocol, complete parser code, or recording. Its scale and result summaries are research context, not evidence for a clinical-performance claim here.

## References

- [Lecture 11: Satisfying Natural Language Constraints with SMT](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf)
- [ClinicalTrials.gov](https://clinicaltrials.gov/)
- [Z3 theorem prover](https://github.com/Z3Prover/z3)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
- [Lecture 1: formal-reasoning course map](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf)

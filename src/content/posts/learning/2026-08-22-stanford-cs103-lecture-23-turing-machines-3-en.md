---
title: "Stanford CS103 Lecture 22: Turing Machines, Part III"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 24
tldr: "This lecture connects a quick quantifier audit for recognizers and deciders to why every decision problem can be represented as a language, following the official examples and proof obligations."
description: "A deck-aligned CS103 guide to a quick quantifier audit for recognizers and deciders, why every decision problem can be represented as a language, and the limits of the public lecture materials."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-23-turing-machines-3)

This is article 24 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 22, Spring 2026 (2026-05-20)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/22/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/22/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Turing Machines, Part III**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## A quick quantifier audit for recognizers and deciders

The deck begins with claims that are easy to misread. If M recognizes L and M rejects w, then \(w\notin L\): every member must be accepted. The converse is false. If \(w\notin L\), M may reject or loop. If M loops on some \(w\in L\), this proves only that this particular M does not recognize L. It does not prove that L is unrecognizable; another recognizer may exist.

A decider has the stronger contract: it accepts members, rejects nonmembers, and halts on every input. Thus, if M loops on even one input, M is not a decider for L. Again, the failure of one machine does not prove that L is undecidable. Negating an existential definition requires ruling out every candidate machine.

This warm-up calibrates the language used later. Accept, reject, and loop are outcomes of a particular run. Recognizable and decidable are properties of a language defined by the existence of a suitable machine. Those levels cannot be exchanged.

## Why every decision problem can be represented as a language

DFAs, NFAs, and Turing machines receive strings and answer yes or no, so they solve decision problems. Functions that appear to use different input types—`isAnBn(string)`, `isPalindrome(string)`, `isBipartite(Graph)`, and `containsCat(Picture)`—can all become membership questions. Encode the object as a string; the set of encodings on which the answer is yes is a language.

The deck's humbling observation is that all data in a computer ultimately consists of bits. Different bit strings can represent different pictures. Not every bit string is a valid picture, but a parser can first test whether an encoding is well formed. A richer data type therefore does not require a richer input model for Turing machines.

## The abstraction contract for object encodings

For a finite discrete object Obj, \(\langle Obj\rangle\) denotes a string encoding of that object, much like a file on disk. The course does not commit to a particular bit layout. It assumes only that encoding and decoding are effective and unambiguous. Changing the finite alphabet also does not alter computability, because symbols can be encoded again.

This notation lets us form languages such as

\[
\{\langle n\rangle\mid n\in\mathbb N\text{ is even}\},
\qquad
\{\langle G\rangle\mid G\text{ is bipartite}\}.
\]

Angle brackets do not mean an ordered pair or an inner product here; they mean “the encoding of this object.” A machine should also have a defined policy for malformed strings, normally rejection, even though the low-level encoding details are irrelevant to the high-level proof.

## Packing several objects into one string

For \(Obj_1,\ldots,Obj_n\), the notation \(\langle Obj_1,\ldots,Obj_n\rangle\) denotes one string that can be decoded uniquely into its components, like a tuple or an uncompressed archive. Delimiters, length prefixes, and escaping are all possible implementations; unique decoding is what matters.

The regex-matching problem can therefore be written as

\[
\{\langle R,w\rangle\mid R\text{ is a regex and }R\text{ matches }w\},
\]

and graph reachability as \(\{\langle G,s,t\rangle\mid s\leadsto t\}\). A language is not merely a collection of string puzzles. It can be the yes-instances of any finite decision problem.

## Emergent properties: universality and self-reference

The deck calls two capabilities emergent properties of computational devices. Universality means that one fixed device can perform arbitrary computations. Self-reference means that a program can obtain and compute with a representation of its own source. Neither property is present in any isolated Move or Write instruction; they emerge from encoding plus simulation.

These capabilities underpin modern computing, but they will also become its Achilles' heel. Once programs are data and a program can be applied to its own description, the course can build diagonal and self-defeating constructions in the next lectures.

## From a dedicated TM to a programmable simulator

Earlier Turing machines were dedicated: one recognizes \(a^nb^n\), while another performs the hailstone computation. A physical computer instead loads many programs onto the same hardware. A simulator bridges the two views:

```text
simulateTM(M, w)
```

It reads an encoding of M and the input w, then reproduces M step by step. If M accepts, the simulator returns true; if M rejects, it returns false; if M loops, the simulator also loops. The third case cannot be changed to “report looping,” because ordinary step-by-step simulation never reaches a moment at which it has witnessed an infinite future.

## The Universal Turing Machine theorem

Turing's 1936 theorem gives a fixed universal Turing machine, written UTM, such that for every TM M and string w, UTM simulates M(w) on input \(\langle M,w\rangle\) and preserves its observable behavior:

\[
\begin{aligned}
M\text{ accepts }w &\Rightarrow UTM\text{ accepts }\langle M,w\rangle,\\
M\text{ rejects }w &\Rightarrow UTM\text{ rejects }\langle M,w\rangle,\\
M\text{ loops on }w &\Rightarrow UTM\text{ loops on }\langle M,w\rangle.
\end{aligned}
\]

UTM is one fixed machine; the encoded program and input vary. This is the stored-program intuition behind laptops, phones, and routers: hardware need not be rebuilt for each application, because it can load and interpret code.

## How UTM maintains a step-by-step simulation

The conceptual construction divides its tape into regions. One stores the simulated M's source code, and another stores M's simulated tape. Markers record the simulated head position and the simulated program counter.

During each cycle, UTM consults the code to locate the current instruction, inspects the simulated tape cell, computes the effect of Write, Move, Goto, or If, and updates the tape, head marker, and counter. If M executes Return True or Return False, UTM accepts or rejects accordingly. If M always has another step, UTM continues forever.

The proof invariant is precise: after UTM completes t simulation cycles, its encoded configuration equals M's configuration after t steps. UTM may scan a great deal of tape to simulate one step and can be very inefficient, but its computability behavior is the same. Under the Church–Turing thesis it can, in the relevant capability sense, perform any feasible computation, even though it is fundamentally an interpreter.

## ATM turns machine behavior into a language

UTM is itself a recognizer. It recognizes

\[
A_{\mathrm{TM}}=\{\langle M,w\rangle\mid M\text{ is a TM and }M\text{ accepts }w\}.
\]

If M accepts, UTM accepts. If M rejects, UTM rejects. If M loops, UTM loops. Therefore \(A_{\mathrm{TM}}\in RE\). Nothing in this argument proves that \(A_{\mathrm{TM}}\in R\), or that it is not in R; undecidability is the next stage of the course.

Three statements should become interchangeable: M accepts w; UTM accepts \(\langle M,w\rangle\); and \(\langle M,w\rangle\in A_{\mathrm{TM}}\). For example,

\[
\langle UTM,\langle N,x\rangle\rangle\in A_{\mathrm{TM}}
\]

means that UTM accepts \(\langle N,x\rangle\), which expands once more to “N accepts x.” Each layer of a nested encoding must be decoded through the definition.

## Interpreters and virtual machines in practice

Replacing the simulated TM with an ordinary program yields `simulateProgram(code,input)`. A Python interpreter executes Python code, a browser interpreter executes JavaScript, and a virtual machine simulates an operating-system or hardware environment. These are engineering versions of the same stored-program and simulation pattern, not accidental analogies to UTM.

Universality does not say that every practical interpreter supports every language or has unlimited memory. The theoretical claim is that some simulator can be built in the idealized model. Real systems remain bounded by resources, security policies, and instruction sets.

## Quines: printing one's source without reading a file

A quine is a program that prints its own source code when run, without opening the external file that contains that source. Reading a file would depend on an environmental copy that could be changed; it is not intrinsic self-reference. A quine typically combines a template stored as data with code that quotes that data, so the output reconstructs the entire program.

The deck does not ask students to memorize a language-specific quine. The point is existence. Program descriptions can themselves be encoded as data, and universal computation can transform encoded programs, so sufficiently powerful systems can contain self-referential software.

## Arbitrary computation on one's own source

The deck states a theorem-level claim: a TM can be constructed to perform any prescribed computation on its own source code. In subsequent reasoning, one may imagine a function gaining access to `me`, its own source encoding.

One example, `narcissist(input)`, returns whether the input equals its own source; its language is the singleton \(\{\langle narcissist\rangle\}\). Another, `acceptLongerStrings(input)`, compares the input's length with the length of its own source. This is not a magical runtime API that reads a file. The compilation or self-reference construction builds the necessary representation into the program's behavior.

The quantifier is existential: for a desired transformation, an appropriate program can be constructed. It does not follow that every existing binary automatically knows its file location, build metadata, or byte-for-byte source.

## Common semantic errors

First, \(\langle M,w\rangle\) is an input encoding, not the result of running M. Second, a simulator cannot return the value “loop” when M loops; a faithful UTM loops too. Third, recognizability of \(A_{\mathrm{TM}}\) does not imply decidability, because a recognizer supplies no answer on looping instances.

Fourth, one machine looping on a member proves that machine is not a recognizer, not that the language is unrecognizable. Fifth, the syntax of an encoding is not the source of computational power; computable translations preserve decidability. Sixth, a purported quine that merely reads and prints its source file evades the self-contained construction.

## Executable self-test

First decide four statements: must a recognizer's rejected input be a nonmember; must every nonmember be rejected; and what does looping on a member prove about M and about L? Then express graph bipartiteness, vertex cover, and regex matching as encoding languages, explicitly listing every tuple component.

Next consider three machines: one accepts immediately, one rejects immediately, and one loops forever. For each, record UTM's outcome on \(\langle M,w\rangle\) and whether that encoding belongs to \(A_{\mathrm{TM}}\). Finally, expand the two layers of \(\langle UTM,\langle N,x\rangle\rangle\in A_{\mathrm{TM}}\), and explain in one sentence how a quine construction differs from opening and printing a file.

## Material gaps and reading boundary

The complete deck is sufficient to recover the planned sequence, definitions, and major examples, so this lecture passes the fidelity gate. Slides are not a recording: they omit spoken transitions, student questions, and improvisation. This guide attributes only deck-supported material to the course and does not present its connective prose as an instructor quotation.

## Update log

- 2026-08-22: Rechecked a quick quantifier audit for recognizers and deciders against the official deck, removed dead handout links, and revised metadata and wording after clean review.

## References

- [Stanford CS103 Spring 2026 Lecture 22: Turing Machines, Part III](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/22/)
- [Official Lecture 22 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/22/Lecture%20Slides.pdf)
- [Alan Turing, On Computable Numbers (1936)](https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)

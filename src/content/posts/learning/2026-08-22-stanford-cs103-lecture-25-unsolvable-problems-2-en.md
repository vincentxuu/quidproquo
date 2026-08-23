---
title: "Stanford CS103 Lecture 24: Unsolvable Problems, Part II"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 26
tldr: "This lecture connects defining and locating halt to why halt is recognizable, following the official examples and proof obligations."
description: "A deck-aligned CS103 guide to defining and locating halt, why halt is recognizable, and the limits of the public lecture materials."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-25-unsolvable-problems-2)

This is article 26 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 24, Spring 2026 (2026-05-25)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/24/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/24/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Unsolvable Problems, Part II**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## Defining and locating HALT

The halting problem asks whether a TM M eventually halts on input w. Here halting includes accepting and rejecting but excludes an infinite loop. As a language,

\[
HALT=\{\langle M,w\rangle\mid M\text{ is a TM that halts on }w\}.
\]

HALT and \(A\_{TM}\) both lie in RE but outside R. HALT includes both terminating outcomes, while ATM includes only acceptance. Together they witness that R is a proper subset of RE.

## Why HALT is recognizable

A recognizer `checkHalt(M,w)` simply runs M(w). If M accepts or rejects, that call returns; regardless of the Boolean result, checkHalt accepts because it observed termination. If M loops, the call never returns and the recognizer loops. Members are accepted and nonmembers are not, proving \(HALT\in RE\).

By comparison, `checkATM` rejects when M returns false and accepts only true. Both simulations get stuck when M loops. That code-level difference exactly matches the membership definitions of the two languages.

## Why HALT is undecidable

If HALT were decidable, a total function `willHalt(M,w)` would exist. Construct a self-referential trickster: obtain its own source `me`; if willHalt(me,input) predicts halting, loop forever; otherwise return true. The first branch falsifies a “halts” prediction and the second falsifies a “does not halt” prediction. Thus no such decider exists and \(HALT\notin R\).

The deck skips the formal proof for time, but its template is the ATM proof: assume a decider, construct behavior opposite its output, apply it to the constructed program itself, and derive “the prediction is correct iff it is wrong.” Difficulty is not the proof; contradiction rules out every algorithm.

## The execution semantics of RE minus R

If \(L\in RE\setminus R\), some M recognizes L, but no correct recognizer can halt on all inputs, or it would be a decider. At least one nonmember must make each recognizer loop: members cannot loop under the recognizer contract, and if all nonmembers were rejected, the machine would be total.

This does not say that every recognizer loops on the same nonmember or that every nonmember causes a loop. The quantifier says no single correct machine halts everywhere. HALT and ATM are concrete inhabitants of this region.

## Verification: answers may be hard to find but evidence easy to check

Given five thousand lines of TM code and input `abbababababbbb`, directly deciding whether it halts is hard. If someone adds the hint “it halts on exactly step 20,” a checker can simulate exactly 20 steps. It accepts the certificate if it observes acceptance or rejection on step 20 and rejects otherwise. Bounded simulation always terminates.

Acceptance on step 20 places the pair in HALT; rejection on step 20 does too, since halting includes both. If the machine is still running, only certificate 20 has failed. The machine may stop at step 21 or much later. That asymmetry is the essence of verification.

## Formal definition of verifier and certificate

A verifier for L is a TM V that halts on all inputs and satisfies, for every w,

\[
w\in L\quad\leftrightarrow\quad \exists c\in\Sigma^\*.\ V\text{ accepts }\langle w,c\rangle.
\]

An accepted c is a certificate. Soundness says any accepted pair guarantees membership. Completeness says every member has at least one helpful certificate. The certificate is existentially quantified, not universal; a member can have many unhelpful certificates that V rejects.

V itself must halt on every pair. Rejection of one certificate is inconclusive: perhaps w is a member but c is wrong, or perhaps w is a nonmember and no certificate works. This differs from a decider's rejection, which proves nonmembership.

## Why the language of V is usually not L

The verifier's raw language is

\[
\mathcal L(V)=\{\langle w,c\rangle\mid V\text{ accepts }\langle w,c\rangle\},
\]

whereas L contains w values. Their element types differ, so equations or subset claims between them are normally ill-typed. L is obtained by existentially projecting \(\mathcal L(V)\) over the certificate coordinate.

Certificate design is specific to the language: it might be a step count, an assignment to equation variables, a set of graph vertices, or a completed Sudoku grid. The definition promises neither uniqueness nor shortness nor ease of discovery—only existence for members and terminating verification.

## Reading the hailstone verifier step by step

Let L contain encodings of naturals whose hailstone sequence terminates. `checkHailstone(n,c)` performs at most c updates, halving an even value and replacing an odd one with \(3n+1\), returning true upon reaching 1. Its finite loop guarantees termination for every n,c.

If n reaches 1 after t steps, every sufficiently large c is helpful, so there are generally infinitely many certificates. Short values are rejected without refuting membership. If the sequence never reaches 1, no c can be accepted. This is exactly the existential verifier condition.

## A verifier for ATM

For \(A\_{TM}\), use the certificate “the number of steps within which M accepts w.” `checkWillAccept(M,w,c)` sets up a simulation, runs c steps, and checks whether the simulated state is accepting. The bounded loop makes it a total checker.

If M accepts w, it does so after a finite number t, and c=t (or a sufficiently large bound under the chosen simulation convention) works. Conversely, verifier acceptance means an accepting state was observed, so \(\langle M,w\rangle\in A\_{TM}\). A rejecting or looping M has no certificate that can fabricate an accepting configuration.

The HALT verifier differs only in the final condition: either an accepting or rejecting state certifies HALT, while only acceptance certifies ATM. Both turn an unbounded search into a finite horizon supplied by c.

## From verifier to recognizer: enumerate certificates

Given a verifier V for L, construct `isInL(w)` by enumerating all strings c in increasing length and running V(w,c) on each. Accept as soon as one check accepts. A finite alphabet has finitely many strings of each length, and every call to V halts, so the search cannot get stuck on a bad certificate.

If w is a member, some finite c exists and length-order enumeration eventually reaches it. If w is a nonmember, all certificates are rejected and the outer search runs forever without accepting. This is a recognizer, proving that a verifier implies \(L\in RE\). The enumeration must be exhaustive; an arbitrary sequence that permanently skips a certificate would not work.

## From recognizer to verifier: use a step bound

Conversely, start with a recognizer M for L. Define `checkIsInL(w,c)` to simulate M(w) for at most c steps and return whether it has entered an accepting state. Even if M itself loops, each bounded simulation halts. The second input c supplies the verifier's certificate slot.

If the verifier accepts, it observed M accepting, hence w belongs to L. If w belongs to L, M must accept after some finite t; choosing c=t gives a certificate. This proves that \(L\in RE\) implies a verifier exists. Rejecting and looping runs never create a false accepting observation.

## The equivalence and the proof viewpoint

Combining both directions, a language has a verifier iff it belongs to RE. The verifier-to-recognizer direction tries every certificate; the recognizer-to-verifier direction enforces a step count. Like DFA, NFA, and regex characterizations of Regular, two different mechanisms characterize the same class here.

A verifier explicitly checks a proof of membership. A recognizer can be viewed as searching for one: success certifies membership, while failure may search forever. A non-RE language is more extreme—there is no general verification system, so even knowing that w is a member need not give a finite, mechanically checkable way to convince someone.

## Executable self-test

Compare HALT and ATM in a three-row table for M accepting, rejecting, and looping. Trace the three step-20 cases and explain why “not halted after 20 steps” is not proof of nonmembership. Then annotate the verifier definition with \(\forall w\), \(\exists c\), and “V always halts.”

Finally reconstruct both conversions. For V→M, explain fairness of enumeration and why one bad certificate cannot block the search. For M→V, explain how c forces termination and why every member has some c. If you wrote \(\mathcal L(V)=L\), list the element types on both sides and repair the statement.

## Material limits

The public deck explicitly supports the sections on defining and locating halt and why halt is recognizable. It does not preserve spoken transitions or class discussion, so those details are left unattributed rather than reconstructed.

## Update log

- 2026-08-22: Rechecked defining and locating halt against the official deck, removed dead handout links, and revised metadata and wording after clean review.

## References

- [Stanford CS103 Spring 2026 Lecture 24: Unsolvable Problems, Part II](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/24/)
- [Official Lecture 24 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/24/Lecture%20Slides.pdf)
- [Alan Turing, On Computable Numbers (1936)](https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf)
- [MIT OpenCourseWare: Recognizability and Undecidability](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/resources/mit18_404f20_lec6/)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)

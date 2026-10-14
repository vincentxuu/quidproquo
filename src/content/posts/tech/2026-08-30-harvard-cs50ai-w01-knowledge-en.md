---
title: "Knowledge — Propositional Logic, Model Checking, Inference Rules & Knowledge Representation | Harvard CS50 AI Week 1"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, logic, knowledge, model-checking, resolution, python, cs50]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 2
tldr: "Week 1 is about getting a program to derive new facts from known ones: propositional symbols and five connectives turn knowledge into sentences; model checking enumerates all 2^n truth assignments to decide whether the knowledge base entails a query; inference rules and resolution work on the sentences directly, converting to CNF and deriving the empty clause by contradiction; first-order logic cuts the number of symbols with constants, predicates and quantifiers. With time links for every section, plus the approach, common mistakes and self-checks for the Knights and Minesweeper projects (reference implementations folded away)."
description: "Guide to Harvard CS50 AI Week 1 Knowledge, written section by section from the captions of the 2020 lecture recording: the five connectives of propositional logic and their truth tables, models, knowledge bases and entailment, model checking and logic.py, knowledge engineering for Clue and the house puzzle, inference rules, resolution and CNF conversion, proof by contradiction, and predicates and quantifiers in first-order logic, each with a clickable time link and a self-check, plus specs, approach, pseudocode, common mistakes, self-checks and check50 commands for the Knights and Minesweeper projects, with the full reference implementation folded at the end of each project. Project specs current as of 2026."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge)

**Video status: Videos included.** The lecture runs 1:47:44. The "Lecture walkthrough" below is written section by section from the recording's English captions, and each section opens with a time link that moves the player on this page to that point. The lecture does not cover this week's projects; those sections follow the course website and the officially distributed code, and the full reference implementations are hidden by default, folded at the end of each project. [Jump to the player](#lecture-video--timestamps) | [Source details](#course-video-sources)

> ⚠️ **Version note**: This week's lecture videos were **recorded in Spring 2020**; project specs, distribution code, and check50 slugs follow the 2026 course website (i.e., `ai50/projects/2024/x/...`).

## TL;DR

Week 1 asks one question: a program holds a few sentences it knows to be true, so how does it decide whether another sentence must be true as well? The answer comes in three layers. First, write the knowledge as sentences of propositional logic. Second, use model checking to list every combination of true and false and check each one. Third, when there are too many combinations, use inference rules and resolution to derive new sentences from the existing ones directly. The lecture closes with first-order logic, which shows why propositional logic needs so many symbols. The two projects are solving logic puzzles with model checking (Knights) and designing your own knowledge representation to play Minesweeper (Minesweeper).

The article has two halves. The first, "Lecture walkthrough", follows the recording; the second covers the two projects, which the lecture does not mention.

## Lecture Video & Timestamps

The recording runs 1 hour 47 minutes, and the ten sections of "Lecture walkthrough" below cover all of it in order. Every time link, at the top of a section or inside the text, moves the player on this page to that point, so when a section does not make sense you can go straight back and listen.

```youtube
url: https://www.youtube.com/watch?v=HWQLez87vqM
title: Knowledge - Lecture 1 - CS50's Introduction to Artificial Intelligence with Python 2020
```

YouTube: [Week 1 Knowledge (2020 recording)](https://www.youtube.com/watch?v=HWQLez87vqM)

> Timing note: the times below were checked against the timecoded English captions (2026-10-13) and mark where the lecturer starts each topic; they are not official chapters. This table describes only the 2020 recording; the current course version may differ in content and order, and the video itself does not introduce this week's projects.

| Time (click to play from there) | Content |
|---|---|
| [0:00–3:45](https://www.youtube.com/watch?v=HWQLez87vqM&t=0s) | Knowledge-based agents, and three sentences that lead to "it rained today" |
| [3:45–14:30](https://www.youtube.com/watch?v=HWQLez87vqM&t=225s) | Propositional logic: sentences, propositional symbols, five connectives and their truth tables |
| [14:30–22:31](https://www.youtube.com/watch?v=HWQLez87vqM&t=870s) | Models, knowledge bases, entailment and inference |
| [22:31–39:45](https://www.youtube.com/watch?v=HWQLez87vqM&t=1351s) | Model checking: the eight-model example, `logic.py` and `harry.py` |
| [39:45–54:03](https://www.youtube.com/watch?v=HWQLez87vqM&t=2385s) | Knowledge engineering: writing Clue in propositional logic |
| [54:03–1:04:28](https://www.youtube.com/watch?v=HWQLez87vqM&t=3243s) | The house puzzle, Mastermind, and the efficiency problem of model checking |
| [1:04:28–1:17:43](https://www.youtube.com/watch?v=HWQLez87vqM&t=3868s) | Inference rules, and theorem proving as a search problem |
| [1:17:43–1:30:30](https://www.youtube.com/watch?v=HWQLez87vqM&t=4663s) | The resolution rule, clauses, CNF conversion, factoring and the empty clause |
| [1:30:30–1:37:38](https://www.youtube.com/watch?v=HWQLez87vqM&t=5430s) | Proof by contradiction with resolution |
| [1:37:38–1:47:44](https://www.youtube.com/watch?v=HWQLez87vqM&t=5858s) | First-order logic: constants, predicates, universal and existential quantification, and the wrap-up |

> Official notes: [Week 1 Notes](https://cs50.harvard.edu/ai/2020/notes/1/)

## Lecture walkthrough

What follows is written section by section from the recording's English captions. Captions alone do not show the slides, so the truth tables and the table of models are laid out by this article from what the lecturer says aloud, and formulas are written with the standard symbols (¬, ∧, ∨, →, ↔, ⊨). The self-check at the end of each section is my own question, not lecture content. Where a question reuses a lecture example it says so; where it is marked "my own", the example is mine as well.

### Deriving new facts from known ones

[Recording 0:00–3:45](https://www.youtube.com/watch?v=HWQLez87vqM&t=0s)

The lecturer, Brian Yu, starts from last week: search was about an agent taking actions in an environment. This week looks at how people reach conclusions from facts they already know, and how to hand that job to a program. An agent that represents knowledge internally and reasons and acts on it is what he calls a **knowledge-based agent**.

He uses a Harry Potter example to show what reasoning means ([1:48](https://www.youtube.com/watch?v=HWQLez87vqM&t=108s)). Three sentences are known:

1. If it didn't rain, Harry visited Hagrid today.
2. Harry visited Hagrid or Dumbledore today, but not both.
3. Harry visited Dumbledore today.

Sentences 2 and 3 tell us Harry did not visit Hagrid: he could only visit one, and he visited Dumbledore. Now look at sentence 1: had it not rained, he would have visited Hagrid, but he did not, so it rained today.

None of the three sentences says "it rained"; that conclusion was derived. The lecturer says this kind of reasoning is the subject of the week, and the question is how to get a program to do it. People can think in natural language, but a program needs something more formal, which the next section starts to define.

**Check yourself. Write your answer down before opening the fold.** Drop "but not both" from sentence 2, leaving only "Harry visited Hagrid or Dumbledore today". Can you still conclude that it rained? (Adapted from the lecture example; the change is my own.)

<details>
<summary>Answer</summary>

No. The original reasoning depends on the step "he visited Dumbledore, so he did not visit Hagrid", and that step needs "not both". Without it, the situation "it did not rain and Harry visited both of them" makes all three sentences true, so "it rained" is no longer forced. If you can find one situation where every known sentence holds and the conclusion does not, the conclusion has not been derived. Sections three and four turn this test into a formal definition.

</details>

### Propositional logic: symbols and five connectives

[Recording 3:45–14:30](https://www.youtube.com/watch?v=HWQLez87vqM&t=225s)

The lecturer first defines a **sentence**: an assertion about the world in a knowledge representation language. The language used for most of the week is **propositional logic**.

Its basic unit is the **propositional symbol**, usually a letter such as P, Q or R, each standing for some fact about the world. P might stand for "it is raining" and Q for "Harry visited Hagrid today". To build more complex sentences out of symbols you need **logical connectives**. The lecturer introduces five and explains each with a truth table.

| Connective | Symbol | Read as | True when |
|---|---|---|---|
| Not | ¬P | not P | P is false |
| And | P ∧ Q | P and Q | P and Q are both true |
| Or | P ∨ Q | P or Q | at least one of P, Q is true |
| Implication | P → Q | if P then Q | always, except when P is true and Q is false |
| Biconditional | P ↔ Q | P if and only if Q | P and Q have the same truth value |

Not takes a single sentence and inverts it. The other four take two sentences; two symbols with two possible states each give 2 squared, or four, rows:

| P | Q | P ∧ Q | P ∨ Q | P → Q | P ↔ Q |
|---|---|---|---|---|---|
| false | false | false | false | true | true |
| false | true | false | true | true | false |
| true | false | false | true | false | false |
| true | true | true | true | true | true |

The lecturer draws attention to three points.

**Or means "one or the other or both".** In everyday speech "or" sometimes means "exactly one of the two"; that is a different symbol, exclusive or, which this lecture does not use. Here P ∨ Q is false only when both sides are false.

**An implication makes no claim when its premise is false ([12:21](https://www.youtube.com/watch?v=HWQLez87vqM&t=741s)).** His example is "if it is raining, then I will be indoors". If it rains and I am indoors, the sentence holds; if it rains and I am not indoors, it is false. When it is not raining, the sentence says nothing about where I am, so it counts as true whether I am indoors or outdoors. The only way P → Q is false is a true premise P with a false conclusion Q.

**A biconditional is a condition that goes both ways ([13:13](https://www.youtube.com/watch?v=HWQLez87vqM&t=793s)).** "I will be indoors if and only if it is raining" means: if it rains I am indoors, and if I am indoors it is raining. It is true only when P and Q are both true or both false.

**Check yourself. Write your answer down before opening the fold.** Use the lecture's sentence: P is "it is raining", Q is "I am indoors". Today it is not raining and I am outdoors. Are P → Q and P ↔ Q true or false? What if it is not raining and I am indoors?

<details>
<summary>Answer</summary>

Not raining, outdoors: P is false and Q is false. P → Q is true, because an implication makes no claim when its premise is false. P ↔ Q is also true, because both sides have the same truth value.

Not raining, indoors: P is false and Q is true. P → Q is still true, for the same reason. P ↔ Q is false, because it also requires "indoors means it is raining", and here I am indoors without rain. The two connectives differ exactly in the second row of the truth table.

</details>

### Models, knowledge bases and entailment

[Recording 14:30–22:31](https://www.youtube.com/watch?v=HWQLez87vqM&t=870s)

With a language for writing sentences, a few more terms are needed before we can talk about reasoning.

A **model** assigns a truth value to every propositional symbol; the lecturer says you can think of it as a "possible world". If P is "it is raining" and Q is "it is a Tuesday", then "P true, Q false" is one model: the world where it is raining and it is not a Tuesday. With n symbols there are 2 to the n models.

A **knowledge base** (KB) is a set of sentences the AI knows to be true. We tell the AI what we know about a problem, it stores that in its knowledge base, and it uses that information to draw further conclusions.

**Entailment** ([17:04](https://www.youtube.com/watch?v=HWQLez87vqM&t=1024s)) is written α ⊨ β and read "α entails β". The definition: in every model in which α is true, β is also true. The lecturer's example: α is "it is a Tuesday in January" and β is "it is January". Whenever it is a Tuesday in January it is certainly January, so α ⊨ β.

Note how this differs from the implication of the previous section (this paragraph is my own summary; the lecturer does not put the two side by side): P → Q is a sentence, true in some models and false in others; α ⊨ β is a relation between two sentences, and you have to look at every model to decide it.

**Inference** is the process of deriving new sentences from old ones. Getting "Harry did not visit Hagrid" and "it rained today" from the three sentences in section one was inference.

The lecturer works one more example ([19:21](https://www.youtube.com/watch?v=HWQLez87vqM&t=1161s)). Three symbols: P is "it is a Tuesday", Q is "it is raining", R is "Harry will go for a run". The knowledge base has three sentences:

- (P ∧ ¬Q) → R: if it is a Tuesday and it is not raining, Harry will go for a run
- P: it is a Tuesday
- ¬Q: it is not raining

P is true and ¬Q is true, so P ∧ ¬Q is true. When the left side of an implication is true the right side must be true, so R is true: Harry will go for a run.

Every algorithm this week answers the same question. Given a query α, **does KB ⊨ α?** That is, using only the sentences in the knowledge base, can we be sure α is true?

**Check yourself. Write your answer down before opening the fold.** Turn the lecture's example around: does "it is January" entail "it is a Tuesday in January"? Answer from the definition.

<details>
<summary>Answer</summary>

It does not. The definition requires that in every model where "it is January" is true, "it is a Tuesday in January" is true too. But there is a model that is a Wednesday in January: the first sentence is true and the second is false. One such model is enough to break entailment. Entailment has a direction; α ⊨ β does not give you β ⊨ α.

</details>

### Model checking: listing every possible world

[Recording 22:31–39:45](https://www.youtube.com/watch?v=HWQLez87vqM&t=1351s)

The most direct algorithm for "does KB ⊨ α?" is **model checking**, which follows the definition of entailment:

1. Enumerate all possible models.
2. If in every model where the KB is true α is also true, then the KB entails α.
3. Otherwise it does not.

The lecturer runs it on the running example from the previous section, with R as the query. Three symbols give 2 to the third power, or 8, models ([24:59](https://www.youtube.com/watch?v=HWQLez87vqM&t=1499s)). He rules models out with the three sentences in turn: the KB says P is true, so the first four rows, where P is false, do not work; the KB says ¬Q, so none of the rows with Q true work; of the two remaining rows with P true and Q false, the one where R is false violates (P ∧ ¬Q) → R.

| P | Q | R | KB |
|---|---|---|---|
| false | false | false | false |
| false | false | true | false |
| false | true | false | false |
| false | true | true | false |
| true | false | false | false |
| true | false | true | **true** |
| true | true | false | false |
| true | true | true | false |

The knowledge base is true in exactly one model, and R is true in that model, so KB ⊨ R. The lecturer adds that in other problems several models may make the knowledge base true; by the definition of the algorithm, each of them then has to be checked. The KB column is filled in by this article from the three reasons he gives, and I recomputed it once with the `logic.py` below.

Then comes the code ([27:17](https://www.youtube.com/watch?v=HWQLez87vqM&t=1637s)). The lecturer has written a `logic.py` in advance, with one class for each kind of symbol or connective: `Symbol`, `Not`, `And`, `Or`, `Implication`, `Biconditional`. In `harry.py` he uses it to write the three sentences from section one as a knowledge base (the comments are mine):

```python
from logic import *

rain = Symbol("rain")              # it is raining
hagrid = Symbol("hagrid")          # Harry visited Hagrid
dumbledore = Symbol("dumbledore")  # Harry visited Dumbledore

knowledge = And(
    Implication(Not(rain), hagrid),   # if it didn't rain, he visited Hagrid
    Or(hagrid, dumbledore),           # he visited Hagrid or Dumbledore
    Not(And(hagrid, dumbledore)),     # but not both
    dumbledore                        # he visited Dumbledore
)

print(model_check(knowledge, rain))
```

"Knowing several things" is wrapping them in one `And`. "Or, but not both" is split into two sentences: `Or(hagrid, dumbledore)` plus `Not(And(hagrid, dumbledore))`. Every sentence has a `formula()` method that prints the logical formula, which is handy for checking that you wrote what you meant. The program prints `True`: it is raining in every world where the knowledge base is true.

`model_check` itself looks like this ([34:36](https://www.youtube.com/watch?v=HWQLez87vqM&t=2076s)); what follows is the source from the official `logic.py`:

```python
def model_check(knowledge, query):
    """Checks if knowledge base entails query."""

    def check_all(knowledge, query, symbols, model):
        """Checks if knowledge base entails query, given a particular model."""

        # If model has an assignment for each symbol
        if not symbols:

            # If knowledge base is true in model, then query must also be true
            if knowledge.evaluate(model):
                return query.evaluate(model)
            return True
        else:

            # Choose one of the remaining unused symbols
            remaining = symbols.copy()
            p = remaining.pop()

            # Create a model where the symbol is true
            model_true = model.copy()
            model_true[p] = True

            # Create a model where the symbol is false
            model_false = model.copy()
            model_false[p] = False

            # Ensure entailment holds in both models
            return (check_all(knowledge, query, remaining, model_true) and
                    check_all(knowledge, query, remaining, model_false))

    # Get all symbols in both knowledge and query
    symbols = set.union(knowledge.symbols(), query.symbols())

    # Check that knowledge entails query
    return check_all(knowledge, query, symbols, dict())
```

The lecturer's explanation maps onto three places:

- It first collects every symbol that appears in the knowledge base and the query.
- `check_all` takes one symbol that has not been assigned yet, makes two copies of the model, one with the symbol true and one with it false, recurses into both, and requires both to return `True`. That visits every combination of true and false.
- Once every symbol is assigned, if the knowledge base is true in this model it returns the truth value of the query in this model; if the knowledge base is false it returns `True` straight away. As the lecturer puts it, we do not care about worlds where the knowledge base does not hold, just as the table above only looks at the row where the KB is true.

The `logic.py` shipped with the Knights project differs from this one only in the exception class on one error-message line; `model_check` is identical, and it is the one Project 1A below uses.

**Check yourself. Write your answer down before opening the fold.** In the `harry.py` above, change the query on the last line from `rain` to `hagrid`. What does it print? What about `Not(hagrid)`? (The queries are my own; the results were actually run.)

<details>
<summary>Answer</summary>

`model_check(knowledge, hagrid)` prints `False`, and `model_check(knowledge, Not(hagrid))` prints `True`.

The knowledge base is true in only one world: it rained, Harry did not visit Hagrid, and he visited Dumbledore. In that world `hagrid` is false, so the knowledge base does not entail `hagrid`; `Not(hagrid)` is true, so it is entailed.

The thing to watch is that `False` from `model_check` only means "this sentence cannot be shown to be true"; it does not mean "this sentence is false". To find out whether a symbol is definitely false you have to query its `Not` separately. The Clue program in the next section uses exactly these two queries to tell "definitely yes", "definitely no" and "don't know" apart.

</details>

### Knowledge engineering: writing Clue in propositional logic

[Recording 39:45–54:03](https://www.youtube.com/watch?v=HWQLez87vqM&t=2385s)

Model checking is general-purpose. The real work is the step before it: deciding which propositional symbols to use and which sentences express what you know. The lecturer calls this **knowledge engineering** and demonstrates it with the board game Clue ([40:46](https://www.youtube.com/watch?v=HWQLez87vqM&t=2446s)).

The simplified Clue has three people (Colonel Mustard, Professor Plum, Miss Scarlet), three rooms (ballroom, kitchen, library) and three weapons (knife, revolver, wrench). At the start one person card, one room card and one weapon card go into an envelope; that is the answer, and players reason about what is in it from the other cards they get to see.

**Symbols.** One symbol per card, nine in all. A symbol is true when that card is in the envelope; `mustard` being true means Colonel Mustard is the murderer.

**The rules as sentences.** The envelope must contain one person, one room and one weapon:

- mustard ∨ plum ∨ scarlet
- ballroom ∨ kitchen ∨ library
- knife ∨ revolver ∨ wrench

**Information gained during play as sentences.** A card in my hand is not in the envelope, so holding Professor Plum adds ¬plum. Someone guesses "Colonel Mustard in the library with the revolver", and a card is then revealed to them that I do not get to see: all I know is that at least one of those three is not in the envelope, written ¬mustard ∨ ¬library ∨ ¬revolver.

The program `clue.py` ([45:31](https://www.youtube.com/watch?v=HWQLez87vqM&t=2731s)) defines the nine symbols and a `check_knowledge` function. For every symbol it asks two questions: if `model_check(knowledge, symbol)` is true it prints YES; otherwise it asks `model_check(knowledge, Not(symbol))`, and if that cannot be shown either it prints MAYBE. Symbols known to be false are not printed.

The lecturer adds information one step at a time and reruns the program after each:

| Sentence added to the knowledge base | Meaning | Result of `check_knowledge` |
|---|---|---|
| The three rule sentences | The envelope holds one person, one room, one weapon | All nine symbols are MAYBE |
| ¬mustard, ¬kitchen, ¬revolver | I hold these three cards | Those three disappear; the weapons are down to knife and wrench, both MAYBE |
| ¬scarlet ∨ ¬library ∨ ¬wrench | Someone made this guess and a card was revealed that I did not see | No new conclusions |
| ¬plum | Someone shows me the Professor Plum card | scarlet becomes YES |
| ¬ballroom | Someone shows me the ballroom card | library becomes YES, and so does knife |

In the last step ([52:29](https://www.youtube.com/watch?v=HWQLez87vqM&t=3149s)) the library is easy to see: two of the three rooms have been ruled out. The knife is less obvious, and the lecturer says he would not have realised it immediately either. The reason is the sentence in the third row, ¬scarlet ∨ ¬library ∨ ¬wrench: now that it is definitely Scarlet and definitely the library, the only way left for that sentence to hold is ¬wrench, so the weapon is neither the wrench nor the revolver, which leaves the knife. A sentence that looked useless when it was added turned out to be decisive. The lecturer sees this as the advantage of handing the job to an algorithm: it works through every possibility.

**Check yourself. Write your answer down before opening the fold.** Keep the knowledge base from the first four rows of the table. Suppose the card I am shown in the last step is the library instead of the ballroom, so the sentence added is ¬library. What does `check_knowledge` print? (The variant is my own; the result was actually run with the official `logic.py`.)

<details>
<summary>Answer</summary>

scarlet is YES, ballroom is YES, and knife and wrench are both still MAYBE.

The kitchen and the library are ruled out, leaving only the ballroom. But this time the weapon cannot be pinned down: the sentence ¬scarlet ∨ ¬library ∨ ¬wrench is already satisfied by ¬library, so it no longer constrains the wrench at all, and both knife and wrench remain possible. The lecture's version can derive the knife because Scarlet and the library are both known to be true, which leaves ¬wrench as the only way to satisfy that sentence.

</details>

### Logic puzzles, Mastermind and the limit of model checking

[Recording 54:03–1:04:28](https://www.youtube.com/watch?v=HWQLez87vqM&t=3243s)

The same approach solves ordinary logic puzzles. The lecturer's puzzle: Gilderoy, Minerva, Pomona and Horace each belong to a different one of the four houses Gryffindor, Hufflepuff, Ravenclaw and Slytherin. We are told:

- Gilderoy belongs to Gryffindor or Ravenclaw
- Pomona does not belong to Slytherin
- Minerva belongs to Gryffindor

**It takes 16 symbols**: one for every combination of person and house, such as `GilderoyGryffindor` and `GilderoyHufflepuff`, each either true or false.

**The premise of the puzzle has to be written as sentences too**, and there are far more of those than clues. Each person belongs to only one house, which becomes sentences like `PomonaSlytherin → ¬PomonaHufflepuff`, one for each person and each pair of different houses. Each house has only one person, which becomes sentences like `MinervaRavenclaw → ¬GilderoyRavenclaw`, one for each house and each pair of different people.

The program `puzzle.py` ([56:57](https://www.youtube.com/watch?v=HWQLez87vqM&t=3417s)) generates these sentences with loops: first an `Or` for each person saying they belong to one of the four houses, then two nested loops adding an `Implication` for each person and each pair of different houses `h1`, `h2`, and then the same again with the roles of people and houses swapped. Finally it adds the three clues, runs `model_check` on each of the 16 symbols and prints the ones known to be true: Gilderoy in Ravenclaw, Pomona in Hufflepuff, Minerva in Gryffindor, Horace in Slytherin. The lecturer himself says this was quite tedious to write.

This `puzzle.py` is the lecture's demo program; it is a different file from the `puzzle.py` of the same name in the Knights project.

Next is a simplified Mastermind ([1:01:46](https://www.youtube.com/watch?v=HWQLez87vqM&t=3706s)). Four colours, red, blue, green and yellow, are in some order; you guess an order and are told how many positions you got right.

- Guess "red, blue, green, yellow": two positions are correct.
- Swap the first two and guess "blue, red, green, yellow": no positions are correct.

A person can reason like this: the second guess was all wrong and the first had two right, and the only difference between them is that red and blue were swapped, so red and blue were the two that were right in the first guess, and green and yellow are in the wrong positions. The lecturer does not go through the code; he only shows the output of `mastermind.py`: red in position 0, blue in position 1, yellow in position 2, green in position 3.

He then points out that this program took quite a long time to run ([1:03:28](https://www.youtube.com/watch?v=HWQLez87vqM&t=3808s)). Model checking has to enumerate every truth value of every symbol, so n symbols means 2 to the n worlds. These examples have relatively few symbols, so it works; the more symbols there are, the less workable it becomes. The next section starts looking for methods that do not enumerate every world.

**Check yourself. Write your answer down before opening the fold.** Solve the house puzzle the way a person would, without the program. Then work out: with 16 symbols, how many models does model checking have to check? (The reasoning steps and the number are my own.)

<details>
<summary>Answer</summary>

Minerva is in Gryffindor and each house has one person, so Gilderoy is not in Gryffindor; he can only be in Gryffindor or Ravenclaw, so he is in Ravenclaw. That leaves Hufflepuff and Slytherin for Pomona and Horace; Pomona is not in Slytherin, so she is in Hufflepuff and Horace is in Slytherin. This matches what the program prints.

16 symbols give 2 to the 16, or 65,536, models. Mastermind's four colours times four positions is also 16 symbols, so the same 65,536. A person needed four steps, while model checking has to look at more than sixty thousand worlds, and that number doubles with every extra symbol.

</details>

### Inference rules: rewriting sentences instead of listing worlds

[Recording 1:04:28–1:17:43](https://www.youtube.com/watch?v=HWQLez87vqM&t=3868s)

An **inference rule** is a fixed way of rewriting: given sentences of a certain form, you may write down another sentence. The lecturer draws a horizontal line, with the premises above it and the conclusion below. He stresses that this is a completely different approach from model checking: here we do not look at any particular world, only at which sentences we have and which sentences follow.

He introduces the rules one at a time with plain-English examples (starting at [1:05:13](https://www.youtube.com/watch?v=HWQLez87vqM&t=3913s)):

| Rule | Premises | Conclusion | The lecture's example |
|---|---|---|---|
| Modus ponens | α → β, α | β | If it is raining, Harry is inside; it is raining. So Harry is inside |
| And elimination | α ∧ β | α (or β) | Harry is friends with Ron and Hermione. So Harry is friends with Hermione |
| Double negation elimination | ¬(¬α) | α | It is not true that Harry did not pass the test. So Harry passed the test |
| Implication elimination | α → β | ¬α ∨ β | If it is raining, Harry is inside. So it is not raining, or Harry is inside |
| Biconditional elimination | α ↔ β | (α → β) ∧ (β → α) | It is raining if and only if Harry is inside. So if it rains Harry is inside, and if Harry is inside it is raining |
| De Morgan's law | ¬(α ∧ β) | ¬α ∨ ¬β | It is not true that both Harry and Ron passed. So Harry did not pass, or Ron did not pass |
| De Morgan's law | ¬(α ∨ β) | ¬α ∧ ¬β | It is not true that Harry or Ron passed. So Harry did not pass, and Ron did not pass |
| Distributive law | α ∧ (β ∨ γ) | (α ∧ β) ∨ (α ∧ γ) | The lecturer compares it to distributing multiplication over addition |
| Distributive law | α ∨ (β ∧ γ) | (α ∨ β) ∧ (α ∨ γ) | Same, in the other direction |

A few of these deserve a second look:

- **Implication elimination** turns "if … then …" into "or". The lecturer's explanation is that there are only two possibilities for α: it is false; or it is true, in which case β must be true. So at least one of ¬α and β holds.
- **De Morgan's law**: his way of remembering it is to move the negation inwards, onto each sentence inside the parentheses, and flip the and into an or, or the or into an and ([1:12:24](https://www.youtube.com/watch?v=HWQLez87vqM&t=4344s)).
- **The distributive law** lets you move an or into an expression ([1:13:45](https://www.youtube.com/watch?v=HWQLez87vqM&t=4425s)); the lecturer says the next part will need it.

Each rule looks obvious on its own. The lecturer's point is that a program does not know them unless it is told explicitly which rules it may use, and that the hard part is finding the right combination of rules to apply.

That is exactly last week's problem ([1:15:10](https://www.youtube.com/watch?v=HWQLez87vqM&t=4510s)). The lecturer writes **theorem proving as a search problem**:

| Part of a search problem | What it is in theorem proving |
|---|---|
| Initial state | The starting knowledge base |
| Actions | All the inference rules that can be applied |
| Transition model | The new knowledge base after applying a rule: the old sentences plus the one just inferred |
| Goal test | Whether the sentence to be proved is in the knowledge base |
| Path cost | The number of steps in the proof |

So the algorithms that solve a maze can also produce proofs. This is the second method, after model checking.

**Check yourself. Write your answer down before opening the fold.** The knowledge base has two sentences: "Harry and Ron both passed the test" and "if Harry passed the test, he will celebrate". Use the rules in the table to prove "Harry will celebrate", naming the rule used at each step. Seen as a search problem, what is the path cost? (My own example.)

<details>
<summary>Answer</summary>

Let P be "Harry passed the test", Q be "Ron passed the test" and C be "Harry will celebrate". The knowledge base is P ∧ Q and P → C.

1. And elimination on P ∧ Q gives P.
2. Modus ponens on P → C and P gives C.

C is now in the knowledge base, so the goal test passes. Two rules were applied, so the path cost is 2. No model was listed at any point; with three symbols, model checking would look at 8.

</details>

### Resolution, clauses and CNF

[Recording 1:17:43–1:30:30](https://www.youtube.com/watch?v=HWQLez87vqM&t=4663s)

The third method is built on one more inference rule, called **resolution**. The lecturer calls it quite powerful: it lets us prove anything that can be proven about a knowledge base.

Start with the simplest form. We know "Ron is in the Great Hall or Hermione is in the library", and we also know "Ron is not in the Great Hall"; the conclusion is that Hermione is in the library. "Ron is in the Great Hall" and "Ron is not in the Great Hall" are opposites of each other, which the lecturer calls **complementary literals**. The rule is **unit resolution** ([1:18:49](https://www.youtube.com/watch?v=HWQLez87vqM&t=4729s)):

- Premises: P ∨ Q, ¬P
- Conclusion: Q

Q need not be a single symbol; it can be a whole chain: from P ∨ Q₁ ∨ Q₂ ∨ … ∨ Qₙ and ¬P you get Q₁ ∨ Q₂ ∨ … ∨ Qₙ. P need not come first either, since order inside an or does not matter.

One more generalisation ([1:20:18](https://www.youtube.com/watch?v=HWQLez87vqM&t=4818s)). We know "Ron is in the Great Hall or Hermione is in the library" and "Ron is not in the Great Hall or Harry is sleeping". There are only two possibilities for Ron: he is in the Great Hall, in which case the second sentence can only hold if Harry is sleeping; or he is not, in which case the first sentence can only hold if Hermione is in the library. So "Hermione is in the library or Harry is sleeping". In general:

- Premises: P ∨ Q, ¬P ∨ R
- Conclusion: Q ∨ R

Again, Q and R can each be a chain, and the conclusion is the two chains joined.

The inputs to resolution have a fixed shape, and the lecturer defines some terms here ([1:22:23](https://www.youtube.com/watch?v=HWQLez87vqM&t=4943s)):

- **Literal**: a propositional symbol or the negation of one. P and ¬P are both literals.
- A **disjunction** is things connected with or; a **conjunction** is things connected with and.
- **Clause**: a disjunction of literals, such as P ∨ Q ∨ R.
- **Conjunctive normal form (CNF)**: a conjunction of clauses, such as (A ∨ B ∨ C) ∧ (D ∨ ¬E) ∧ (F ∨ G). Each parenthesis is a clause, the clauses are joined by and, and inside a clause everything is joined by or.

Any sentence of propositional logic can be converted to CNF. The steps are ([1:24:10](https://www.youtube.com/watch?v=HWQLez87vqM&t=5050s)):

1. **Eliminate biconditionals**: turn α ↔ β into (α → β) ∧ (β → α).
2. **Eliminate implications**: turn α → β into ¬α ∨ β.
3. **Move negations inwards** with De Morgan's laws, until every ¬ sits directly next to a propositional symbol.
4. **Use the distributive law to move the ors inwards**, so the ands end up on the outside.

Every step is one of the inference rules from the previous section. The lecturer converts (P ∨ Q) → R as a demonstration ([1:26:03](https://www.youtube.com/watch?v=HWQLez87vqM&t=5163s)):

| Step | Sentence | Rule used |
|---|---|---|
| Original | (P ∨ Q) → R | |
| Eliminate the implication | ¬(P ∨ Q) ∨ R | implication elimination |
| Move the negation inwards | (¬P ∧ ¬Q) ∨ R | De Morgan's law |
| Move the or inwards | (¬P ∨ R) ∧ (¬Q ∨ R) | distributive law |

The last line is two clauses joined by and, which is CNF.

The reason for converting to CNF ([1:27:54](https://www.youtube.com/watch?v=HWQLez87vqM&t=5274s)) is that clauses are exactly what resolution takes as input. Whenever two clauses contain a pair of complementary literals, they can be resolved into a new clause. The lecturer adds two details:

- **Factoring**: resolving P ∨ Q ∨ S with ¬P ∨ R ∨ S gives Q ∨ S ∨ R ∨ S. The duplicate S adds nothing, so one is dropped, leaving Q ∨ R ∨ S.
- **The empty clause** ([1:29:28](https://www.youtube.com/watch?v=HWQLez87vqM&t=5368s)): resolving P with ¬P leaves nothing, because neither side contains anything besides that pair of literals. The result is the empty clause, which is always false, since P and ¬P cannot both hold. The algorithm in the next section depends on it.

**Check yourself. Write your answer down before opening the fold.** Convert P → (Q ∧ R) to CNF. Once converted, if you also know P, what does resolution give you? (My own example.)

<details>
<summary>Answer</summary>

There is no biconditional, so start at step 2. Eliminate the implication: ¬P ∨ (Q ∧ R). There is no negation to move inwards. Use the distributive law to move the or inwards: (¬P ∨ Q) ∧ (¬P ∨ R). That is CNF, with two clauses.

Adding P: P and ¬P ∨ Q contain the complementary pair P, ¬P and resolve to Q; P and ¬P ∨ R resolve to R in the same way. This agrees with what you would expect from the original sentence: P holds, so both Q and R hold.

</details>

### Proof by contradiction with resolution

[Recording 1:30:30–1:37:38](https://www.youtube.com/watch?v=HWQLez87vqM&t=5430s)

To decide whether KB ⊨ α, the lecturer uses **proof by contradiction**: assume the thing you want to prove is false, and if that leads to a contradiction, it must be true. Here that means assuming ¬α and seeing whether the KB together with ¬α is contradictory. The algorithm:

1. Convert KB ∧ ¬α to CNF.
2. Keep checking whether any two clauses can be resolved; if so, produce the new clause, add it and keep going.
3. If the empty clause is ever produced, that is a contradiction, so KB ⊨ α.
4. If no new clauses can be produced and the empty clause never appeared, there is no entailment. The lecturer says this can be proved but does not prove it in class.

His example ([1:34:15](https://www.youtube.com/watch?v=HWQLez87vqM&t=5655s)): the knowledge base is (A ∨ B) ∧ (¬B ∨ C) ∧ ¬C. Does it entail A?

Assume ¬A and add it. This is already in CNF, with four clauses: A ∨ B, ¬B ∨ C, ¬C, ¬A.

| Step | The two clauses resolved | Complementary literals | New clause |
|---|---|---|---|
| 1 | ¬B ∨ C and ¬C | C, ¬C | ¬B |
| 2 | A ∨ B and ¬B | B, ¬B | A |
| 3 | A and ¬A | A, ¬A | the empty clause |

The empty clause appears, which means "the knowledge base is true and A is false" is impossible, so the knowledge base entails A. The lecturer notes that in a program you could simply loop over all pairs of clauses and check each pair for complementary literals.

Compared with model checking, no worlds were enumerated here at all. The procedure just keeps deriving new clauses from the ones it has and sees whether it runs into a contradiction.

**Check yourself. Write your answer down before opening the fold.** Use this section's algorithm to prove the conclusion of section one again: "it rained today". The knowledge base is ¬rain → hagrid, hagrid ∨ dumbledore, ¬(hagrid ∧ dumbledore), dumbledore. (The knowledge base is the lecture's `harry.py`; proving it by resolution is my own exercise.)

<details>
<summary>Answer</summary>

Convert to CNF first. Eliminating the implication in ¬rain → hagrid gives ¬(¬rain) ∨ hagrid, and removing the double negation gives rain ∨ hagrid. De Morgan's law turns ¬(hagrid ∧ dumbledore) into ¬hagrid ∨ ¬dumbledore. The other two sentences are already clauses. Add the assumption for the contradiction, ¬rain, and there are five clauses:

rain ∨ hagrid, hagrid ∨ dumbledore, ¬hagrid ∨ ¬dumbledore, dumbledore, ¬rain.

1. ¬hagrid ∨ ¬dumbledore and dumbledore give ¬hagrid.
2. rain ∨ hagrid and ¬hagrid give rain.
3. rain and ¬rain give the empty clause.

A contradiction appears, so the knowledge base entails rain. The three steps follow the same order as the human reasoning in section one: first that Harry did not visit Hagrid, then that it rained. The clause hagrid ∨ dumbledore was never used.

</details>

### First-order logic: fewer symbols with predicates and quantifiers

[Recording 1:37:38–1:47:44](https://www.youtube.com/watch?v=HWQLez87vqM&t=5858s)

The lecturer ends by looking back at the limits of propositional logic. To express some fairly simple ideas, the house puzzle used a whole row of symbols such as `MinervaGryffindor`, `MinervaHufflepuff`, `MinervaRavenclaw` and `MinervaSlytherin`. All of them are about Minerva, yet propositional logic has no way to express that relationship; each symbol is just an independent true or false.

**First-order logic** splits symbols into two kinds ([1:39:23](https://www.youtube.com/watch?v=HWQLez87vqM&t=5963s)):

- **Constant symbols** stand for objects: Minerva, Pomona, Horace, Gilderoy, and Gryffindor, Hufflepuff, Ravenclaw, Slytherin.
- **Predicate symbols** are like functions that return true or false, saying whether some property or relation holds of constants: Person, House, BelongsTo.

A sentence is a predicate applied to constants:

| First-order sentence | Meaning |
|---|---|
| Person(Minerva) | Minerva is a person |
| House(Gryffindor) | Gryffindor is a house |
| ¬House(Minerva) | Minerva is not a house |
| BelongsTo(Minerva, Gryffindor) | Minerva belongs to Gryffindor |

The five connectives of propositional logic all still work here. A predicate can take one argument, or two like BelongsTo, to express a relation between two objects. The lecturer does the count: propositional logic needed 16 symbols, while here four people plus four houses need only 8 constant symbols, and predicates build every sentence from those.

First-order logic also adds **quantifiers** ([1:42:56](https://www.youtube.com/watch?v=HWQLez87vqM&t=6176s)), of which there are two.

**Universal quantification**, written ∀, says something holds for all values of a variable:

- ∀x. BelongsTo(x, Gryffindor) → ¬BelongsTo(x, Hufflepuff)
- Read: for all objects x, if x belongs to Gryffindor then x does not belong to Hufflepuff. In other words, anyone in Gryffindor is not in Hufflepuff.

**Existential quantification** ([1:44:23](https://www.youtube.com/watch?v=HWQLez87vqM&t=6263s)), written ∃, says at least one value makes it hold:

- ∃x. House(x) ∧ BelongsTo(Minerva, x)
- Read: there exists some object x such that x is a house and Minerva belongs to x. In other words, Minerva belongs to a house.

The two can be combined:

- ∀x. Person(x) → (∃y. House(y) ∧ BelongsTo(x, y))
- Read: for all x, if x is a person, then there exists some y such that y is a house and x belongs to y. In other words, every person belongs to a house.

In the house puzzle "every person belongs to a house" took one four-symbol `Or` per person, and here one sentence says it all; this comparison is my own.

The lecturer mentions that second-order and higher-order logics exist, without going into them. His closing point: whichever logic is used, the goal is for an AI to represent what it knows and draw conclusions from it. Everything this week dealt with knowledge that is definitely true or definitely false; next week takes on uncertainty.

**Check yourself. Write your answer down before opening the fold.** Write "someone belongs to Slytherin" in first-order logic. Should the body use ∧ or →, and why? (My own example.)

<details>
<summary>Answer</summary>

∃x. Person(x) ∧ BelongsTo(x, Slytherin).

It has to be ∧, the same shape as the lecture's ∃x. House(x) ∧ BelongsTo(Minerva, x). Written as ∃x. Person(x) → BelongsTo(x, Slytherin), the sentence would hold as soon as there is any object that is not a person: take x to be Gryffindor, Person(Gryffindor) is false, an implication with a false premise is true as section two explained, and so the whole sentence is true even if nobody at all is in Slytherin.

Universal quantification is the other way round: the lecture's ∀ examples all pair it with →, meaning "the requirement applies only to the x that satisfy the premise". This contrast is my own summary; the lecturer does not state it.

</details>

## Project 1A: Knights — Logic Puzzle Solver

The course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) does not allow looking at someone else's solution before you submit, so by default the two projects below show only the task, the distribution code, the approach, pseudocode, where things go wrong and how to check your work; the full reference implementation is folded away at the end of each project.

### Task

In `puzzle.py`, write a knowledge base for each of four Knights and Knaves puzzles (`knowledge0` to `knowledge3`) so that `main` can use model checking to work out whether each character is a knight or a knave. The rules: each character is either a knight or a knave; every sentence spoken by a knight is true, and every sentence spoken by a knave is false.

The four puzzles (wording from the official spec):

- Puzzle 0: A says "I am both a knight and a knave."
- Puzzle 1: A says "We are both knaves." B says nothing.
- Puzzle 2: A says "We are the same kind." B says "We are of different kinds."
- Puzzle 3: A says either "I am a knight." or "I am a knave.", but you don't know which; B says "A said 'I am a knave.'" and then says "C is a knave."; C says "A is a knight."

The spec adds two requirements: do not modify `logic.py`; and the knowledge base should be a direct translation of the information in the puzzle, not the result of your own reasoning. The spec's counterexample is setting `knowledge0` to `AKnave`, which prints the right answer but goes against the point of the project.

### What the distribution code provides

Below is the complete official `puzzle.py`. The six propositional symbols and `main` are already written; all you fill in is the four `And(...)` expressions marked `# TODO`.

```python
from logic import *

AKnight = Symbol("A is a Knight")
AKnave = Symbol("A is a Knave")

BKnight = Symbol("B is a Knight")
BKnave = Symbol("B is a Knave")

CKnight = Symbol("C is a Knight")
CKnave = Symbol("C is a Knave")

# Puzzle 0
# A says "I am both a knight and a knave."
knowledge0 = And(
    # TODO
)

# Puzzle 1
# A says "We are both knaves."
# B says nothing.
knowledge1 = And(
    # TODO
)

# Puzzle 2
# A says "We are the same kind."
# B says "We are of different kinds."
knowledge2 = And(
    # TODO
)

# Puzzle 3
# A says either "I am a knight." or "I am a knave.", but you don't know which.
# B says "A said 'I am a knave'."
# B says "C is a knave."
# C says "A is a knight."
knowledge3 = And(
    # TODO
)


def main():
    symbols = [AKnight, AKnave, BKnight, BKnave, CKnight, CKnave]
    puzzles = [
        ("Puzzle 0", knowledge0),
        ("Puzzle 1", knowledge1),
        ("Puzzle 2", knowledge2),
        ("Puzzle 3", knowledge3)
    ]
    for puzzle, knowledge in puzzles:
        print(puzzle)
        if len(knowledge.conjuncts) == 0:
            print("    Not yet implemented.")
        else:
            for symbol in symbols:
                if model_check(knowledge, symbol):
                    print(f"    {symbol}")


if __name__ == "__main__":
    main()
```

For every puzzle and every symbol, `main` calls `model_check(knowledge, symbol)` and prints the symbol when the result is true. `logic.py` is almost identical to the lecture's file (see "[Model checking: listing every possible world](#model-checking-listing-every-possible-world)" above), and `And`, `Or`, `Not`, `Implication` and `Biconditional` can all be nested inside one another.

### Approach

The spec's hints split what you need to write into two kinds of information: the structure of the puzzle itself, and what the characters actually said.

**Structure.** Each character who appears needs two sentences: they are a knight or a knave; they are not both. This is the move the lecture made for "Harry visited Hagrid or Dumbledore, but not both", split into an "or" plus a "not both" (`harry.py`, from [27:17](https://www.youtube.com/watch?v=HWQLez87vqM&t=1637s)).

**Statements.** Character X says some sentence S. First translate S itself into a sentence of propositional logic, then ask: under what conditions is S true, and under what conditions is it false? S is true when X is a knight and false when X is a knave, so write two sentences: (X is a knight) → S, and (X is a knave) → ¬S. This uses the implication from [section two](#propositional-logic-symbols-and-five-connectives): when the premise does not hold, the sentence makes no claim.

Translating S is the part of this project that actually takes thought:

- "We are both knaves" is an and of two symbols.
- "We are the same kind" can hold in two ways: both knights, or both knaves. "We are of different kinds" works the same way.
- In Puzzle 3, B says that "A said something". Here S is not "A is a knave" but the fact that "A said 'I am a knave'". Treat "A said T" as a sentence, write it with the same recipe as above (if A is a knight then T, if A is a knave then not T), and put the whole thing inside B's two sentences.
- In Puzzle 3, A said one of two sentences: write "A said the first" and "A said the second" each as a sentence and join them with an or.

The overall procedure is the one from the lecture's "[knowledge engineering](#knowledge-engineering-writing-clue-in-propositional-logic)" section: choose symbols, write the rules as sentences, write the information you are given as sentences, and leave the rest to model checking ([40:46](https://www.youtube.com/watch?v=HWQLez87vqM&t=2446s)).

### Pseudocode

```text
for each puzzle:
    knowledge base ← an empty And

    for each character X who appears:
        add: X is a knight, or X is a knave
        add: X is not both a knight and a knave

    for each statement (speaker X, content S):
        translate S into a sentence of propositional logic
            if S is "Y said T":
                first write the sentence "Y said T":
                    (Y is a knight → T) and (Y is a knave → not T)
                then use that as S
        add: X is a knight → S
        add: X is a knave → not S

    when all you know is that X said one of S1, S2:
        add: (X said S1) or (X said S2)
```

### Where it goes wrong

The first three items are what was observed when a wrong version was put into the official `puzzle.py` and actually run (2026-10-13); the last two are requirements of the spec.

- **Nothing is printed under Puzzle 3.** The knowledge base is too weak to determine anyone's identity. The reference implementation this article used to carry did exactly that: it wrote A's uncertain statement as sentences that are always true, such as "if A is a knight then A is a knight", which adds no information, and it wrote only the A-is-a-knight half of B's report. Another common version treats B's statement as "A is a knave", with the same result: Puzzle 3 prints nothing. When a puzzle has no output, check first whether one of your sentences is in fact always true.
- **Only the knight half is written.** Each statement adds "X is a knight → S" and leaves out "X is a knave → not S". When run, Puzzle 1 and Puzzle 2 print only A's identity and B is missing; Puzzle 3 prints only B. Missing characters usually mean the knave half is missing.
- **The same character is printed as both Knight and Knave.** The knowledge base contradicts itself. When the knowledge base is false in every model, `model_check` returns `True` for every query (see how `check_all` handles a false knowledge base in the walkthrough), so all six symbols are printed, including C, who is not even in the puzzle. Deliberately adding a contradictory pair of sentences to Puzzle 1 produced exactly those six lines.
- **The output is right, but the knowledge base is the conclusion of your own reasoning.** The spec says this does not count. To check, go back over every sentence and see whether it maps to one statement or one rule of the puzzle.
- **Knights must be 100% correct to pass**; the 70% threshold of other projects does not apply here (official spec).

### How to check your own work

**Work the answer out by hand first, then compare with the program.** Each puzzle has one to three characters, so there are at most 8 combinations of identities, and you can list them all: for each combination, check whether "everything a knight says is true and everything a knave says is false" holds, and the one combination left standing is the answer. Puzzle 3 needs one more layer: which sentence A said is unknown, so split each identity combination into two cases, "A said the first sentence" and "A said the second", 16 in all; an identity combination stays if in at least one of its cases everyone's statements work out. In all four puzzles exactly one identity combination survives (the independent reviewer confirmed this with a separately written enumeration program).

The spec's Background works through Puzzle 0: if A were a knight the sentence would have to be true, but nobody can be both a knight and a knave, so A is a knave. Your program should print only `A is a Knave` under Puzzle 0.

**Look at the shape of the output.** In correct output every character who appears is printed on exactly one line: one line for Puzzle 0, two each for Puzzle 1 and Puzzle 2, three for Puzzle 3. For missing lines, extra lines or a blank, look up the cause in the previous section.

**Print the formula to check your translation.** Every knowledge base has `formula()`; print it and compare it with the puzzle sentence by sentence, making sure each one matches the original wording.

**Official checks:**

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/1/knights.zip
unzip knights.zip && cd knights

python puzzle.py

check50 ai50/projects/2024/x/knights
# Note: Knights requires 100% to pass (not 70%)

style50 puzzle.py
```

### Full reference implementation

<details>
<summary>Full reference implementation (open only after you have written and submitted your own)</summary>

> ⚠️ If you are taking this course, or plan to apply for a CS50 certificate: the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) says you may not look at someone else's solution before submitting your own work. Finish and submit first, then use this section to compare. This implementation was only run in the environment described on this site and has not been through check50.

The symbol definitions and the comments above each puzzle come from the official `puzzle.py`; the contents of each `And(...)` are the reference implementation.

```python
# puzzle.py excerpt
from logic import *

AKnight = Symbol("A is a Knight")
AKnave = Symbol("A is a Knave")

BKnight = Symbol("B is a Knight")
BKnave = Symbol("B is a Knave")

CKnight = Symbol("C is a Knight")
CKnave = Symbol("C is a Knave")

# Puzzle 0
# A says "I am both a knight and a knave."
knowledge0 = And(
    Or(AKnight, AKnave),
    Not(And(AKnight, AKnave)),
    Implication(AKnight, And(AKnight, AKnave)),
    Implication(AKnave, Not(And(AKnight, AKnave)))
)

# Puzzle 1
# A says "We are both knaves."
# B says nothing.
knowledge1 = And(
    Or(AKnight, AKnave), Not(And(AKnight, AKnave)),
    Or(BKnight, BKnave), Not(And(BKnight, BKnave)),
    Implication(AKnight, And(AKnave, BKnave)),
    Implication(AKnave, Not(And(AKnave, BKnave)))
)

# Puzzle 2
# A says "We are the same kind."
# B says "We are of different kinds."
knowledge2 = And(
    Or(AKnight, AKnave), Not(And(AKnight, AKnave)),
    Or(BKnight, BKnave), Not(And(BKnight, BKnave)),
    Implication(AKnight, Or(And(AKnight, BKnight), And(AKnave, BKnave))),
    Implication(AKnave, Not(Or(And(AKnight, BKnight), And(AKnave, BKnave)))),
    Implication(BKnight, Or(And(AKnight, BKnave), And(AKnave, BKnight))),
    Implication(BKnave, Not(Or(And(AKnight, BKnave), And(AKnave, BKnight))))
)

# Puzzle 3
# A says either "I am a knight." or "I am a knave.", but you don't know which.
# B says "A said 'I am a knave'."
# B says "C is a knave."
# C says "A is a knight."

# What "A said 'I am a knight.'" and "A said 'I am a knave.'" each imply
a_said_knight = And(Implication(AKnight, AKnight), Implication(AKnave, Not(AKnight)))
a_said_knave = And(Implication(AKnight, AKnave), Implication(AKnave, Not(AKnave)))

knowledge3 = And(
    Or(AKnight, AKnave), Not(And(AKnight, AKnave)),
    Or(BKnight, BKnave), Not(And(BKnight, BKnave)),
    Or(CKnight, CKnave), Not(And(CKnight, CKnave)),
    # A said one of the two sentences
    Or(a_said_knight, a_said_knave),
    # B's first statement: "A said 'I am a knave'."
    Implication(BKnight, a_said_knave),
    Implication(BKnave, Not(a_said_knave)),
    # B's second statement: "C is a knave."
    Implication(BKnight, CKnave),
    Implication(BKnave, Not(CKnave)),
    # C's statement: "A is a knight."
    Implication(CKnight, AKnight),
    Implication(CKnave, Not(AKnight))
)
```

> **The key to Puzzle 3**: B is reporting what A said, so first write "A said 'I am a knave.'" as a sentence of its own, `a_said_knave`, and then apply B's identity to it. That sentence cannot hold whatever A is: a Knight would not call himself a Knave, and a Knave saying it would be telling the truth. So B is lying and B is a Knave; B's second statement is false too, so C is a Knight; C is telling the truth, so A is a Knight.

Put into the official `puzzle.py` and actually run, the knowledge bases above print:

```text
Puzzle 0
    A is a Knave
Puzzle 1
    A is a Knave
    B is a Knight
Puzzle 2
    A is a Knave
    B is a Knight
Puzzle 3
    A is a Knight
    B is a Knave
    C is a Knight
```

</details>

---

## Project 1B: Minesweeper — Minesweeper AI

### Task

Complete four methods of the `Sentence` class in `minesweeper.py` (`known_mines`, `known_safes`, `mark_mine`, `mark_safe`) and three methods of the `MinesweeperAI` class (`add_knowledge`, `make_safe_move`, `make_random_move`) to build an AI that plays Minesweeper by logical inference. What the spec requires of the three AI methods:

- `add_knowledge(cell, count)`: given that `cell` is a safe cell with `count` neighbouring mines, update `self.moves_made`, `self.safes`, `self.mines` and `self.knowledge`, drawing every conclusion that can be drawn.
- `make_safe_move()`: return a cell that is known to be safe and has not been played yet; return `None` if there is none. It must not modify any of the AI's state.
- `make_random_move()`: choose at random among the cells that have not been played and are not known to be mines; return `None` if there are none.

You may add new methods to the classes, but you must not change the definitions or arguments of the existing ones.

### What the distribution code provides

The `Minesweeper` class (the game itself) is fully written; a cell is a pair `(i, j)`, where `i` is the row and `j` is the column. Construction, comparison and string representation of `Sentence` are provided as well, and four methods are left blank:

```python
class Sentence():
    """
    Logical statement about a Minesweeper game
    A sentence consists of a set of board cells,
    and a count of the number of those cells which are mines.
    """

    def __init__(self, cells, count):
        self.cells = set(cells)
        self.count = count

    def __eq__(self, other):
        return self.cells == other.cells and self.count == other.count

    def __str__(self):
        return f"{self.cells} = {self.count}"

    def known_mines(self):
        """
        Returns the set of all cells in self.cells known to be mines.
        """
        raise NotImplementedError

    def known_safes(self):
        """
        Returns the set of all cells in self.cells known to be safe.
        """
        raise NotImplementedError

    def mark_mine(self, cell):
        """
        Updates internal knowledge representation given the fact that
        a cell is known to be a mine.
        """
        raise NotImplementedError

    def mark_safe(self, cell):
        """
        Updates internal knowledge representation given the fact that
        a cell is known to be safe.
        """
        raise NotImplementedError
```

`__init__`, `mark_mine` and `mark_safe` of `MinesweeperAI` are already written, and the other three methods are left blank. The docstring of `add_knowledge` lists the five things it has to do:

```python
class MinesweeperAI():
    """
    Minesweeper game player
    """

    def __init__(self, height=8, width=8):

        # Set initial height and width
        self.height = height
        self.width = width

        # Keep track of which cells have been clicked on
        self.moves_made = set()

        # Keep track of cells known to be safe or mines
        self.mines = set()
        self.safes = set()

        # List of sentences about the game known to be true
        self.knowledge = []

    def mark_mine(self, cell):
        """
        Marks a cell as a mine, and updates all knowledge
        to mark that cell as a mine as well.
        """
        self.mines.add(cell)
        for sentence in self.knowledge:
            sentence.mark_mine(cell)

    def mark_safe(self, cell):
        """
        Marks a cell as safe, and updates all knowledge
        to mark that cell as safe as well.
        """
        self.safes.add(cell)
        for sentence in self.knowledge:
            sentence.mark_safe(cell)

    def add_knowledge(self, cell, count):
        """
        Called when the Minesweeper board tells us, for a given
        safe cell, how many neighboring cells have mines in them.

        This function should:
            1) mark the cell as a move that has been made
            2) mark the cell as safe
            3) add a new sentence to the AI's knowledge base
               based on the value of `cell` and `count`
            4) mark any additional cells as safe or as mines
               if it can be concluded based on the AI's knowledge base
            5) add any new sentences to the AI's knowledge base
               if they can be inferred from existing knowledge
        """
        raise NotImplementedError

    def make_safe_move(self):
        """
        Returns a safe cell to choose on the Minesweeper board.
        The move must be known to be safe, and not already a move
        that has been made.

        This function may use the knowledge in self.mines, self.safes
        and self.moves_made, but should not modify any of those values.
        """
        raise NotImplementedError

    def make_random_move(self):
        """
        Returns a move to make on the Minesweeper board.
        Should choose randomly among cells that:
            1) have not already been chosen, and
            2) are not known to be mines
        """
        raise NotImplementedError
```

Note that the AI's `mark_mine` and `mark_safe` pass the same fact on to every sentence in the knowledge base, so the methods of the same name on `Sentence` are responsible for updating the sentence itself.

### Approach

**Why not the lecture's propositional logic.** The spec's Background does the arithmetic: with one propositional symbol per cell, an 8×8 board has 64 symbols and 2 to the 64 models. That is exactly the limit of model checking the lecture described ([1:03:28](https://www.youtube.com/watch?v=HWQLez87vqM&t=3808s), see "[Logic puzzles, Mastermind and the limit of model checking](#logic-puzzles-mastermind-and-the-limit-of-model-checking)"). So this project switches to a different knowledge representation: a sentence is "a set of cells plus how many of them are mines", written `{A, B, C} = 2`. A knowledge base is still "a set of sentences known to be true" and inference is still "deriving new sentences from old ones" ([18:58](https://www.youtube.com/watch?v=HWQLez87vqM&t=1138s), see "[Models, knowledge bases and entailment](#models-knowledge-bases-and-entailment)"); only the shape of the sentences and the inference rules have changed.

**What a single sentence tells you directly** (spec Background):

- The count is 0: all of these cells are safe.
- The number of cells equals the count: all of these cells are mines.

**How a sentence is updated once a cell's identity is known.** A sentence should only talk about cells that are still undetermined. When a cell is known to be safe, remove it from the sentence and leave the count alone. When a cell is known to be a mine, remove it too, but lower the count by one, because it was part of that number. The spec's example: `{A, B, C} = 2` becomes `{A, B} = 1` once C is known to be a mine.

**What two sentences tell you together: subset inference.** If the cells of sentence one are a subset of the cells of sentence two, then the number of mines among "the extra cells of sentence two" is the difference of the two counts. The spec's example: `{A, B, C} = 1` and `{A, B, C, D, E} = 2` give `{D, E} = 1`.

**The five steps of `add_knowledge`** (official docstring): record the move; mark the cell as safe; build a new sentence from the neighbours that are still undetermined; mark every cell that can be marked; infer every new sentence that can be inferred. The last two have to be repeated: marking a cell shortens some sentences, and a shortened sentence may in turn mark new cells or become a subset of another sentence. The spec stresses that any change to the knowledge may make inferences possible that were not possible before.

This loop of "keep applying the rules until nothing new comes out" has the same structure as the lecture's resolution procedure, which keeps producing new clauses until there are none left ("[Proof by contradiction with resolution](#proof-by-contradiction-with-resolution)", [1:30:30](https://www.youtube.com/watch?v=HWQLez87vqM&t=5430s)); this comparison is my own.

### Pseudocode

```text
sentence (a set of cells, the number of mines among them)

    which cells are definitely mines:
        the number of cells equals the count → all of them
        otherwise → none

    which cells are definitely safe:
        the count is 0 → all of them
        otherwise → none

    on learning that a cell is a mine:
        the cell is in the sentence → remove it, lower the count by 1

    on learning that a cell is safe:
        the cell is in the sentence → remove it, leave the count alone


add_knowledge (the cell just revealed, the number it shows)

    record the cell as a move made and mark it as safe
    build a new sentence from the neighbours that are still undetermined and add it to the knowledge base
        (work out for yourself what to do with neighbours whose identity is already known; see the first item of the next section)

    repeat until a whole round produces no new conclusion:
        mark every cell that can be determined to be a mine or safe
        wherever two sentences are in a subset relation, infer a new sentence with the spec's subset rule


make_safe_move: return a cell known to be safe and not yet played; return "nothing" if there is none
make_random_move: choose at random among cells not yet played and not known to be mines; return "nothing" if there are none
```

### Where it goes wrong

All the numbers below come from runs on 2026-10-13: the reference implementation was broken in one place, spliced into the official `minesweeper.py` and, without opening the pygame window, run through 300 simulated games of 8×8 with 8 mines using the official `Minesweeper` class (random seed fixed at 50), checking after every move whether the cells the AI had labelled were right.

- **When building the new sentence, known mines are left out but not subtracted from the count.** The sentence then says "these cells hold 2 mines" when one of the two is the cell just excluded, so safe cells get labelled as mines, or the other way round. In the run, 208 of the 300 games had a wrongly labelled cell. This mistake does not crash the program; a wrongly labelled cell is later played as a safe move, or avoided for ever as a mine, so it takes the checks in the next section to catch it. That second half is my own inference: the simulation stops the moment a cell is mislabelled and did not measure what follows.
- **Deciding whether "this sentence is already known" does not go through `Sentence.__eq__`.** The official file provides `__eq__`, which compares the cells and the count. If you rewrite `Sentence` and leave it out, or decide by whether two objects are the same object, sentences with the same contents are treated as new and added to the knowledge base again and again, and the "until no new conclusion" loop never ends. The reference implementation this article used to carry lacked `__eq__`; with it removed, the very first game never finished and was killed after 30 seconds. When the program runs for a long time without responding, look here first.
- **Modifying a set while iterating over it.** If `known_mines` returns the sentence's own set of cells and the caller marks mines while iterating over it, marking removes cells from that same set. In the run, 216 of the 300 games raised `RuntimeError: Set changed size during iteration`. The spec's hints mention this too. Returning a copy, or collecting the results before marking, both avoid it.
- **`mark_safe` lowers the count as well.** The cell removed was safe, so the number of mines among the rest is unchanged. With the decrement, 223 of the 300 games had a wrongly labelled cell.
- **The subset condition is written as "subset or equal".** When two sentences have the same cells, subtracting them gives an empty sentence with no cells. It is added to the knowledge base as a new conclusion and inferred all over again in the next round, so the "until no new conclusion" loop never ends. With the condition changed from proper subset to subset-or-equal, the run had not finished after 30 seconds; excluding "comparing a sentence with itself" first makes no difference, because marking can leave two sentences exactly alike.
- **Subset inference is left out.** The program still plays and labels nothing wrongly, but it is forced to guess more often: 168 wins in 300 games, against 200 for the full version. If your win rate is low and nothing is mislabelled, check this step first.
- **`make_safe_move` changes state.** The spec requires that it not modify `self.moves_made`, `self.mines`, `self.safes` or `self.knowledge`; moves are recorded in `add_knowledge`.

### How to check your own work

**Work the spec's three small examples by hand first**, then verify them with your `Sentence`:

| Situation | Expected |
|---|---|
| `{A, B, C} = 2`, then C is known to be safe | `{A, B} = 2`, so A and B are both definitely mines |
| `{A, B, C} = 2`, then C is known to be a mine | `{A, B} = 1`, and no cell can be determined yet |
| `{A, B, C} = 1` and `{A, B, C, D, E} = 2` | `{D, E} = 1` is inferred |

Two more edge cases: all three cells of `{D, E, G} = 0` are safe; all three cells of `{E, F, H} = 3` are mines. All five are examples from the spec's Background.

**Write your own simulation without the window.** The official `Minesweeper` class has `is_mine(cell)` and `nearby_mines(cell)`, which you can use directly as the referee: start a game, keep asking the AI for a safe move and fall back to a random move when there is none; stop when it hits a mine, otherwise hand that cell's number to `add_knowledge`. After every move check three things:

1. `is_mine` is true for every cell in `ai.mines`.
2. No cell in `ai.safes` is a mine.
3. A safe move never hits a mine; every lost game is lost on a random move.

None of these should ever be violated in any game. A violation means the inference is wrong, and it has nothing to do with luck.

**Use the win rate as supporting evidence.** With no safe move available the AI has to guess, so it will not win every game; the spec's hints say the same. This site's reference implementation won 200 of 300 games on an 8×8 board with 8 mines (seed 50); the independent reviewer reran it with other random seeds and got 198 wins in 300 games and 670 in 1000. The win rate is about two thirds. If your number is clearly lower and none of the three conditions above is violated, some inference is probably missing.

**Watch it in the graphical interface.** With `python runner.py` you can play yourself or press AI Move to let the AI play; according to the spec, `runner.py` prints whether the AI is making a move it believes to be safe or a random one.

**Official checks:**

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/1/minesweeper.zip
unzip minesweeper.zip && cd minesweeper
pip3 install -r requirements.txt  # pygame

# Play vs AI or watch AI auto-play
python runner.py

check50 ai50/projects/2024/x/minesweeper

style50 minesweeper.py
```

### Full reference implementation

<details>
<summary>Full reference implementation (open only after you have written and submitted your own)</summary>

> ⚠️ If you are taking this course, or plan to apply for a CS50 certificate: the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) says you may not look at someone else's solution before submitting your own work. Finish and submit first, then use this section to compare. This implementation was only run in the environment described on this site and has not been through check50.

The `Sentence` class:

```python
# minesweeper.py excerpt
class Sentence():
    """
    Logical statement about a Minesweeper game
    A sentence consists of a set of board cells,
    and a count of the number of those cells which are mines.
    """

    # __init__, __eq__ and __str__ are provided by the official file
    def __init__(self, cells, count):
        self.cells = set(cells)
        self.count = count

    def __eq__(self, other):
        return self.cells == other.cells and self.count == other.count

    def __str__(self):
        return f"{self.cells} = {self.count}"

    # The four methods below are the reference implementation
    def known_mines(self):
        """As many cells as mines: all of them are mines"""
        if self.cells and len(self.cells) == self.count:
            return set(self.cells)
        return set()

    def known_safes(self):
        """Zero mines: all of them are safe"""
        if self.count == 0:
            return set(self.cells)
        return set()

    def mark_mine(self, cell):
        if cell in self.cells:
            self.cells.remove(cell)
            self.count -= 1

    def mark_safe(self, cell):
        if cell in self.cells:
            self.cells.remove(cell)
            # count stays: a safe cell was removed, the mines among the rest are unchanged
```

`known_mines` and `known_safes` return copies (`set(self.cells)`) rather than `self.cells` itself, so even a caller that iterates over the result directly while calling `mark_mine` and `mark_safe` does not modify the set it is iterating over.

The three methods to implement in `MinesweeperAI`:

```python
# minesweeper.py excerpt: the three methods to implement in MinesweeperAI
# (__init__, mark_mine and mark_safe are provided by the official file and not repeated here)

    def add_knowledge(self, cell, count):
        # 1, 2: record the move and mark the cell as safe
        self.moves_made.add(cell)
        self.mark_safe(cell)

        # 3: build a new sentence from the neighbours whose state is still undetermined
        cells = set()
        for i in range(cell[0] - 1, cell[0] + 2):
            for j in range(cell[1] - 1, cell[1] + 2):
                if (i, j) == cell:
                    continue
                if not (0 <= i < self.height and 0 <= j < self.width):
                    continue
                if (i, j) in self.mines:
                    count -= 1          # known mine: leave it out, but subtract it from the count
                elif (i, j) not in self.safes:
                    cells.add((i, j))
        new_sentence = Sentence(cells, count)
        if cells and new_sentence not in self.knowledge:
            self.knowledge.append(new_sentence)

        # 4, 5: keep inferring until nothing new comes out
        changed = True
        while changed:
            changed = False

            # 4: find cells that existing sentences show to be mines or safe
            mines, safes = set(), set()
            for sentence in self.knowledge:
                mines |= sentence.known_mines()
                safes |= sentence.known_safes()
            for mine in mines - self.mines:
                self.mark_mine(mine)
                changed = True
            for safe in safes - self.safes:
                self.mark_safe(safe)
                changed = True

            # drop sentences that have no cells left
            self.knowledge = [s for s in self.knowledge if s.cells]

            # 5: subset inference. If s1 is a proper subset of s2, the cells in s2 − s1 hold count2 − count1 mines
            inferred = []
            for s1 in self.knowledge:
                for s2 in self.knowledge:
                    if s1.cells < s2.cells:
                        candidate = Sentence(s2.cells - s1.cells, s2.count - s1.count)
                        if candidate not in self.knowledge and candidate not in inferred:
                            inferred.append(candidate)
            if inferred:
                self.knowledge.extend(inferred)
                changed = True

    def make_safe_move(self):
        for cell in self.safes:
            if cell not in self.moves_made:
                return cell
        return None

    def make_random_move(self):
        choices = [
            (i, j)
            for i in range(self.height)
            for j in range(self.width)
            if (i, j) not in self.moves_made and (i, j) not in self.mines
        ]
        return random.choice(choices) if choices else None
```

This reference implementation was placed in the class skeleton of the official `minesweeper.py` and, without opening the pygame window, run through 300 simulated games of 8×8 with 8 mines using the official `Minesweeper` class: not one cell the AI labelled as a mine or as safe was wrong, and `make_safe_move` never stepped on a mine; it won 200 of the 300 games (about two thirds; the count shifts a little with the random seed), and every loss came from a random move made when no safe move was available. The graphical `runner.py` and `check50` were not run this time.

</details>

---

## Learning Checklist

- [ ] Can write the truth tables of the five connectives and explain why an implication with a false premise counts as true
- [ ] Can state the definitions of model, knowledge base and entailment, and do model checking by hand on a three-symbol knowledge base
- [ ] Can write the rules of a small game or puzzle as sentences of propositional logic (choose symbols, write constraints, add clues)
- [ ] Can state the premises and conclusion of each of the lecture's seven kinds of inference rule and use them in a two- or three-step proof
- [ ] Can convert a sentence to CNF and derive the empty clause by resolution in a proof by contradiction
- [ ] Can write a sentence such as "every person belongs to a house" in first-order logic with predicates and quantifiers
- [ ] Knights: the output of `python puzzle.py` has exactly one line for each character who appears, and it matches what you get by enumerating the identity combinations by hand
- [ ] Minesweeper: your `Sentence` gives the expected result on the spec's three small examples; over many simulated games, not one cell the AI labels as a mine or as safe is wrong
- [ ] Both projects pass `check50` clean

## Course video sources

The official CS50 YouTube playlist (CS50’s Introduction to Artificial Intelligence with Python, 8 videos) was checked live on 2026-10-10; the Week 1 lecture recording is listed there.

Original video: [Knowledge - Lecture 1 - CS50's Introduction to Artificial Intelligence with Python 2020](https://www.youtube.com/watch?v=HWQLez87vqM)

Course and recording entries:

- [CS50 AI Week 1 — official video, slides and notes](https://cs50.harvard.edu/ai/weeks/1/)
- [CS50's Introduction to AI with Python — official YouTube playlist (8 videos)](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-13): the timecoded English captions were fetched with yt-dlp and read in full (1:47:44) before "Lecture walkthrough" was rewritten. Section start times and the sentences and results in the examples (Harry's three sentences, the eight models of the running example, the YES/MAYBE output at each step of Clue, the answers to the house puzzle and Mastermind, every step of the CNF conversion and the resolution example) come from the captions; the slides were not viewed, and the truth tables and the table of models are laid out from what is said aloud. The captions spell the name Gildaroy, hear conjunctive normal form as "injunctive" or "conjunction" normal form, and hear R₂ as F2; this article follows the lecture source code (`puzzle.py` in `src1.zip`) and the context and writes Gilderoy, conjunctive normal form and R₂. In the spoken Clue demo the lecturer adds `knowledge.add(Not(...))` one sentence at a time, while the published `clue.py` combines the three cards in hand into a single `And`; the result is the same and this article follows the spoken version. `harry.py`, `puzzle.py` and `mastermind.py` were actually run from the official source and their output matches the captions; the result of each Clue step was recomputed with `logic.py`. The transcript never mentions this week's projects (Knights, Minesweeper); project descriptions come from the course site and the officially distributed code.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official CS50 YouTube playlist was checked live and lists this week’s lecture recording, so the status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. The original timecodes could not be verified and were replaced with approximate times estimated from the transcript; split Clue and Mastermind; dropped the unverified "2nd video" playlist claim and linked this week's video directly.
- 2026-10-13: Moved the player from the source section to "Lecture Video & Timestamps" and added the running time to the opening.
- 2026-10-13: Rewrote the "Core Concepts Cheat Sheet" from the timecoded captions as a ten-section "Lecture walkthrough", each section with a time link and one self-check question; the timeline now gives actual start times instead of approximate minutes. The hand-written simplified `logic.py` classes in the old cheat sheet (whose `Symbol.evaluate` used `model[self]`, unlike the official file, which looks symbols up by name) were replaced by the official `model_check` source; the "three-step CNF conversion" gained the lecture's fourth step (the distributive law).
- 2026-10-13: Rewrote the Puzzle 3 reference implementation under Project 1A. Run inside the official `puzzle.py`, the earlier version could not determine any character's identity for Puzzle 3; the new one writes "A said 'I am a knave.'" as a sentence of its own, and an actual run gives A is a Knight, B is a Knave, C is a Knight. The comments above each puzzle were restored to the wording of the official file.
- 2026-10-13: The `Sentence` class under Project 1B now matches the official class definition (`__eq__` and `__str__` restored), and `add_knowledge` was rewritten. The earlier version did not subtract known mines from the count when building a new sentence, and its `Sentence` lacked `__eq__`, so the loop in the article never terminated when actually run. The new version was verified over 300 simulated games with the official `Minesweeper` class. The TL;DR used to describe Minesweeper as probabilistic inference; it now says logical inference.
- 2026-10-13: Corrections after independent review. The Knights `logic.py` actually differs from the lecture's by one exception class, so the two "same file" statements were reworded; two in-text time links now point at the sentence the lecturer actually says (12:21, 1:12:24); two half-sentences the lecturer did not say were reworded as this article's own or removed; the reason given for `known_mines` returning a copy was corrected, and the simulated win count now notes that it varies with the random seed; "OCW site" in the version note became "course website".
- 2026-10-13: Both project sections now put the task, the distribution code, the approach, pseudocode, where things go wrong and how to check your work first; the full reference implementation is folded at the end of each project with a warning that links to the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/). The reference code itself is unchanged. The two project items in the learning checklist became conditions you can verify yourself.
- 2026-10-13: Corrections after the re-review of the project sections. The `add_knowledge` pseudocode for Minesweeper was made coarser, dropping the details that mirrored the implementation line by line; one more common mistake was added (a "subset or equal" condition makes the loop never end, confirmed by a run); the hand check for Knights now explains the extra layer Puzzle 3 needs; two statements were made more precise. The tldr and description now match what the project sections contain.

## References

- [Week 1 Knowledge lecture page](https://cs50.harvard.edu/ai/weeks/1/) — video, slides, transcript, quiz
- [Knowledge - Lecture 1 (YouTube)](https://www.youtube.com/watch?v=HWQLez87vqM) — the basis of "Lecture walkthrough"; content, examples and time links come from its English captions
- [Week 1 Notes (2020 edition)](https://cs50.harvard.edu/ai/2020/notes/1/) — the official notes, useful for the truth tables and rules on the slides
- [Lecture source code src1.zip](https://cdn.cs50.net/ai/2020/spring/lectures/1/src1.zip) — `logic.py`, `harry.py`, `clue.py`, `puzzle.py`, `mastermind.py`
- [Knights project spec](https://cs50.harvard.edu/ai/projects/1/knights/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/knights` (requires 100%)
- [Minesweeper project spec](https://cs50.harvard.edu/ai/projects/1/minesweeper/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/minesweeper`
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- On this site: [Harvard CS50 AI Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — series entry & version notes
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 tier definition

---
title: "Handling Terms, Symbols, and Formulas in a Teaching Article: Evidence on Jargon, Where Definitions Go, English Terms, and Notation"
date: 2026-10-14
category: learning
type: deep-dive
tags: [learning-science, self-learning, course-guide, blog]
lang: en
description: "What the research says about terms, symbols, and formulas in teaching articles: how jargon affects general readers, mouseover definitions, the form and language of glosses in foreign-language reading, a reading tool that brings definitions to the reader, what non-native English speakers find hard when learning to program, programming keywords and identifier names, the dispute over equation density and citations, and how authors augment formulas. Ends with a point-by-point check of this site's own practices."
tldr: "Jargon makes general readers rate a text as harder to read, and definitions that appear only on mouseover did not bring that rating back up. In studies of foreign-language reading tested right after reading, readers with glosses learned about 45% of the unknown words, versus about 27% without. Papers with more equations get cited less, and people have computed this correlation for both biology and physics, but the two sides never agreed on whether it holds up, and no study has measured whether readers understand less."
series:
  name: "Writing Articles That Teach"
  order: 4
draft: false
---

> 🌏 [中文版](/posts/learning/2026-10-14-notation-jargon-terminology)

This article asks: among the terms, symbols, formulas, and untranslated English words in a teaching article, which choices make readers stall, what can the author do about it, and how much evidence stands behind each option.

The trigger was this site's course guides. Over the past few months, some of the places where readers got stuck had nothing to do with how hard the content was. The notation itself was the problem. Three examples:

- The Stanford CS229 series used a lot of LaTeX. I wrote it assuming the site would render math, but at the time the site had no math rendering at all, so readers saw raw LaTeX source. When opt-in rendering was added on 2026-10-12, [the commit](https://github.com/vincentxuu/quidproquo/commit/a606a354) noted that 74 existing posts with formulas still had it switched off. (By 2026-10-14, 114 files on the site had the option set, counting English versions and posts written since.)
- The Chinese version of [Harvard CS50 AI Week 3](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en) translated "constraint" as 限制式 in the linear programming section and as 約束 in the constraint satisfaction section, following each field's usual Chinese term. A reviewer pointed out that readers would not necessarily know the two were the same English word, so a sentence was added to say so.
- The site has an inline glossary: a known term gets an underline the first time it appears, and hovering over it or clicking it opens an explanation box. Its form matches the first experiment below, but the content of the explanation comes from a different source; more on that in the comparison section.

This is part 4 of "Writing Articles That Teach." [Part 1](/posts/learning/2026-10-13-teaching-text-evidence-en) covers examples, explanations, and openings. [Part 9](/posts/learning/2026-10-13-teaching-text-questions-feedback-en) covers questions and wording inside an article and briefly describes the jargon experiment; this article adds its conditions and the follow-up study. [Part 2](/posts/learning/2026-10-13-diagrams-in-teaching-articles-en) covers diagrams. A full discussion of non-native readers, translation, and bilingual posts is left for a later part; here I only cover the terminology and notation side.

**First, the slant of this evidence, because it sets how far the article can go.** I read 12 sources closely, plus one essay that has no data. They measure very different things: how smooth readers say a text felt, how many unknown words foreign-language learners remember, how long researchers take to find a piece of information in a paper, how much of a novice's program is correct, how fast professional developers find a bug, and how many times a paper is cited. **None of them compares two ways of writing notation or terms with reader comprehension as the outcome.** I ran only a few keyword searches for Chinese and Japanese studies and found none. So everything here about Chinese readers, or about pairing a Chinese term with its English original, is my own inference.

## The short version

| Question | Evidence | Strength |
|---|---|---|
| Does jargon make a text feel harder to read? | [One experiment](https://doi.org/10.1177/0963662519865687): members of the public who read short technology texts with jargon rated their reading fluency lower. [Another experiment](https://doi.org/10.1371/journal.pone.0239524) found no such effect on a COVID-19 topic in late March 2020 | Moderate; measured feelings and attitudes, not comprehension |
| Do mouseover definitions fix it? | Same experiment: fluency did not differ with or without mouseover definitions; it did not record how many people actually looked | Weak |
| Where should a definition or gloss go? | A [meta-analysis](https://doi.org/10.1017/S0272263119000688) of foreign-language reading: glosses led to more unknown words learned. Compared with no gloss, margin, hyperlinked, and multiple-choice glosses were all significantly better; glosses placed right after the word had the lowest point estimate; end-of-text glossaries had too few studies to estimate | Gloss vs. none: moderate to strong; between forms: weak. Measured word learning, not comprehension |
| Bringing the definition to the reader | A [27-person usability study](https://doi.org/10.1145/3411764.3445648): finding information in a paper was about 45 seconds faster and accuracy did not change; when the tool's list of definitions was incomplete, readers were misled | Weak to moderate |
| Where non-native English speakers get stuck with English materials | [840 survey responses](https://doi.org/10.1145/3173574.3173970): reading instructional material was the most often mentioned difficulty; people wanted simpler English and inline dictionaries; a small group preferred the English original over translations | Self-report; the sample's English was above average |
| Do people learn faster with an interface in their own language? | [Observational data from Scratch](https://doi.org/10.1145/3051457.3051464): users of the native-language interface started lower and then grew slightly faster; the gap was very small | Weak; correlational |
| What words and symbols programming keywords should use | [A set of experiments](https://doi.org/10.1145/2534973): a language with the same structure but keywords replaced by random characters produced lower novice accuracy; Java and Perl could not be told apart from it | Low to moderate; 6 to 13 people per group |
| Full words or abbreviations for variable names | [An experiment with 72 professional developers](https://doi.org/10.1109/SANER.2017.7884623): full words led to faster bug finding; no difference was detected between machine-made abbreviations and single letters | Moderate; participants were not learners |
| Do more formulas make a text harder to understand? | People have computed a negative correlation between in-text equation density and [citations](https://doi.org/10.1073/pnas.1205259109) for both biology and physics papers; the two sides never agreed on whether it holds up; **nobody measured comprehension** | The correlation itself: moderate; extending it to readers: no evidence |
| How authors make formulas easier to read | [47 hand-picked documents and interviews with 12 authors](https://doi.org/10.1145/3491102.3501932): color and labels were most common, and the work was laborious; no reader data | Describes practice only |

## Jargon: readers find it harder, and mouseover definitions showed no improvement

### The first experiment

Olivia Bullock and colleagues' [2019 experiment](https://doi.org/10.1177/0963662519865687) recruited 650 members of the US public (640 in the analysis) to read three descriptions of new technologies: self-driving cars, surgical robots, and 3D bioprinting. Each description was three sentences long, and the jargon version put 10 technical terms into each one. The plain version replaced the terms with simpler descriptions, with the same word count. Separately, participants were randomly assigned to get definitions or not. Those who got them were told they could move the cursor over underlined terms, and the definition that popped up was word for word the same as the plain version's description.

Two results:

- Readers of the jargon version rated their processing fluency lower (7-point items along the lines of "was it easy to read, did the words feel familiar"). The authors then used statistical models to link this to resistance to persuasion, perceived risk, and support for the technology.
- Fluency did not differ with or without the mouseover definitions, and the interaction with jargon was not significant either.

Three conditions limit how far this goes. First, 10 terms in three sentences is a very high density, not the same situation as an article with a few unexplained words here and there. Second, the experiment did not record how many people actually moved the cursor over a term to read the definition. The authors wrote in their limitations that the mouseover made "searching for definitions if desired" an extra action. So "the definitions didn't help" could mean people read them and still found the text hard, or that most people never looked; the paper cannot tell the two apart. Third, what was measured was whether reading felt smooth; the authors say directly that they did not measure comprehension.

One result is missing from the abstract: in the model predicting "support for the technology," the definition condition was itself a significant predictor (the paper does not say which way it was coded), and the authors do not explain it. So the accurate statement is not that definitions "had no effect at all," only that they did not bring self-rated fluency back up.

The authors aimed their recommendation at messages that "introduce scientific advancements to non-scientific audiences," and the recommendation was to eliminate jargon where possible. The paper does not discuss teaching.

### The second experiment: when readers have a reason to keep reading

Hillary Shulman and Bullock's [2020 experiment](https://doi.org/10.1371/journal.pone.0239524) ran in late March 2020, when most US states were just starting lockdowns. 393 MTurk participants read a public-information text a few hundred words long on one of three topics: COVID-19, flood risk, or federal emergency-response policy, each in a jargon and a plain version. The jargon versions were again dense with terms.

On the policy and flood topics, the jargon versions both had lower fluency, consistent with the first experiment. On COVID-19, no difference was detected between jargon and plain versions. The authors' reading: when a topic is urgent, readers are motivated to process the information, so the negative effect of jargon weakens.

That reading needs to be taken apart:

- **Motivation was not measured.** The experiment manipulated the topic, and the authors used urgency as a proxy for motivation. They raise another explanation themselves: after heavy media coverage, the COVID-19 terms may simply have been more familiar. The experiment cannot separate motivation from familiarity.
- **What holds up statistically is that COVID-19 and policy differed.** When the difference in the jargon effect was tested directly between topics, the confidence intervals for flood vs. COVID-19 touched or crossed zero for fluency and for all four outcomes. The abstract nonetheless groups flood with policy.
- **One row of results points the other way, and the text never discusses it.** Controlling for fluency, jargon versions were rated as more credible, with higher perceived risk, and met with less resistance. In the raw group means, too, the jargon groups rated credibility higher. "Jargon makes readers push back" describes only the path that runs through fluency.
- Because pay was raised partway through, participants came in two batches, and the batch that answered about a week later had fluency 0.67 points lower overall, roughly the size of the jargon effect on the policy topic. The authors say the causes cannot be separated.

What the two experiments support together: for general readers with no particular reason to read, dense jargon makes a text feel harder. When readers have a reason to engage with the topic, or the terms are already familiar, the effect may disappear. Neither experiment measured how much readers understood.

## Where definitions go

### Glosses in foreign-language reading

The closest quantitative evidence on where to put a definition comes from foreign-language teaching. Akifumi Yanagisawa and colleagues' [2020 meta-analysis](https://doi.org/10.1017/S0272263119000688) pooled 42 studies with 3,802 learners. In these studies, foreign-language learners read a text without knowing they would be tested on vocabulary; afterward, they were tested on what share of the previously unknown words they had learned.

- Tested right after reading, the glossed groups had learned 45.3% of unknown words and the unglossed groups 26.6%; about two weeks later, 33.4% vs. 19.8%.
- By form: multiple-choice glosses, where the reader picks the meaning from a few candidates, did best; hyperlinked glosses (which appear on either a click or mouseover) and margin glosses came next. In-text glosses, placed right after the word inside the sentence, had the lowest point estimate and were not significantly better than no gloss.
- End-of-text glossaries were not significant either, but the immediate test had only 2 studies and a confidence interval from −28 to +63 percentage points: the estimate is imprecise, not a measured small effect. The abstract calls glossaries and in-text glosses "the least effective"; reading the table, I find the glossary's point estimate almost the same as margin glosses.
- In pairwise comparisons, in-text glosses lost significantly only to multiple-choice and interlinear glosses, and only on the immediate test; on the delayed test, no pair of forms differed detectably.

The authors' explanation for why in-text glosses did worse is speculation: with the gloss right next to the word, the reader gets the answer without processing the word, so it does not stick. This points to the distance between that research and a teaching article. Its goal is **remembering a foreign word**; a teaching article's goal is usually **understanding the passage in front of you**. If the authors' speculation is right, handing readers the meaning without making them think is bad for remembering the word and might be exactly what helps them understand the passage right now. I found no study comparing gloss placement with comprehension as the outcome, so I do not turn this into a recommendation.

### Bringing the definition to the reader

Andrew Head and colleagues' [ScholarPhi (2021)](https://doi.org/10.1145/3411764.3445648) is a tool for reading papers. Click a term or symbol, and the most recent definition of it in that paper appears directly below the word. It also has lists of definitions, dimming of irrelevant sentences, equation diagrams, and a glossary at the front.

Before building it, the team watched 9 readers work through papers or textbooks they had brought. Eight of the 9 were confused by some term, and 4 got stuck on math symbols. Readers mostly guessed from context first; if that failed, they put it off and hoped it would be explained later, and by then they might lose the whole passage. One described looking up a definition as an undesirable "context switch" that pulled them out of the state of understanding the passage.

The formal usability study recruited 27 people who had read machine learning papers (18 were PhD students). Each answered one "find this information in the paper" question with each of three interfaces, 4 minutes per question:

- The full tool was 45.4 seconds faster per question than a plain PDF reader, and people rated it easier.
- **The number of correct answers was exactly the same**: 16 correct out of 27 attempts for both interfaces.
- On the question "what does T mean in this paper," people using the full tool almost always answered wrong. The tool's definition list did not show every usage of T, and readers assumed the list was complete. The authors write that a tool like this can mislead when it implies incorrect information.
- The definitions in the study were curated by hand. Automatic extraction of definitions on the same paper had a precision of only 24% and a recall of 6%.

During 15 to 20 minutes of free reading, the click-to-show definition tooltips were the most used feature (a median of 10 times for symbol tooltips), and the glossary at the front was the least used (only 6 of 27 people looked at it for 10 seconds or more). These are usage logs, with no comparison condition.

The scope of this study matters: the participants were researchers, the terms were symbols and words defined only within that one paper, the questions were about finding information rather than understanding, and only one paper was used. It supports "when readers already want to look something up, bringing the definition to them saves the time spent searching," not "people understand better this way."

## English terms and non-native English readers

### What readers say

Philip Guo's [2018 survey](https://doi.org/10.1145/3173574.3173970) ran on the programming-education site Python Tutor and received 840 responses, 656 of them from non-native English speakers. This group's English was decent: among the non-native speakers, 83% rated their reading as proficient or fully fluent, and of all 840 respondents, 96% already read programming materials in English. The author notes that people with low English literacy, or who use only native-language materials, are not visible in this sample.

Of the 384 non-native speakers who answered question 6, the most commonly mentioned difficulty was reading instructional materials (35%). Their examples relate directly to terminology. A French speaker said a single technical word can blur the meaning of an entire sentence. A Romanian speaker said native-language books also translate the terms, which made them harder to follow.

Of the 464 who answered question 7, the changes they wanted were simpler English with fewer colloquialisms and cultural references (36%), more diagrams (23%), more examples (21%), and inline dictionaries for looking up a word without leaving the text (21%). Another 7% of responses said they would rather read the English original than a translation, because the syntax is in English anyway and translated versions have muddled terms and go out of date.

These are respondents' statements, not measured effects. "21% want inline dictionaries" cannot be read as "inline dictionaries help." The author also points out that some difficulties affect native English-speaking beginners too, such as telling apart object, class, and instance, or reading while in its everyday English sense, so not all of it can be blamed on language.

### Translating the interface

Sayamindu Dasgupta and Benjamin Mako Hill's [2017 study](https://doi.org/10.1145/3051457.3051464) used Scratch platform data on 15,015 users in five countries (Portugal, Italy, Brazil, Germany, and Norway). Within each country, it compared users of the native-language interface (where even the keywords on the blocks were translated) with users of the English interface: for each additional project shared, how fast did the number of block types they had used grow?

The result cuts both ways. Users of the native-language interface used fewer block types in their first project, then grew slightly faster. From its coefficients I calculate that they would catch up after about 8 shared projects, while the median user shared 3. The authors' model estimate of the actual gap: an active user who shared 16 projects would have 37.9 block types versus 37.1, less than one block. The authors say the effect is small and correlational, not causal, and that "how many block types were used" cannot tell whether a block was used correctly or understood.

The data compare a fully translated interface with a fully English one. There is no condition like "keep the term in English, explain it in the native language," and no East Asian languages.

### The language of the gloss

Back to Yanagisawa's meta-analysis: glosses that translated the foreign word into the reader's native language led to slightly more words learned than glosses that explained it in the foreign language, but the difference was significant only on the test about two weeks later (5.2 percentage points), not on the immediate test (p = .075). Glosses giving both languages had only 3 studies and did not differ detectably from either. Glosses in the foreign language were themselves clearly better than no gloss.

This runs in the opposite direction from this site's situation. There, the reader reads a foreign-language text and the gloss is in the native language. Here, the reader reads a Chinese text with English terms mixed in. So the study cannot answer "should a Chinese term be followed by the English original?"

**The gap in this section**: I could not find any study of whether pairing a Chinese term with its English original helps Chinese readers.

## Notation in code: keywords, symbols, and names

Chris Olah and Shan Carter's "[Research Debt](https://doi.org/10.23915/distill.00005)" says that "Abstractions and notation are the user interface of research, shaping how we think and communicate," and that we often get stuck with the first formalisms to develop even when they're bad; its examples are the sign convention for electric charge and π. It is an essay with no data. On whether notation choices affect learners, the empirical work I found is concentrated in programming languages, and its scope is narrow.

### Keywords and symbols

Andreas Stefik and Susanna Siebert's [2013 study](https://doi.org/10.1145/2534973) has two parts.

In the surveys, computer science students rated candidate words for how "intuitive" they were. Students who reported never having programmed rated repeat, again, and loop as the most intuitive words for a loop, and for, while, and foreach, the most common in real languages, as the least intuitive. The authors say the surveys are only clues, not proof. Students with programming experience rated differently, and their ratings of C++ syntax rose with self-reported years of C++. From this the authors caution that experienced people should check their assumptions before calling a design intuitive.

In the experiments, students who had never programmed were given sample code without being taught what each line did, and had two hours to write six short programs from specifications; each program was scored component by component. One of the languages was a placebo: it kept the structure of Quorum, a language the authors designed, but replaced its keywords and most symbols with characters picked at random from the ASCII table.

- Between the two languages with the same structure and different keywords and symbols, Quorum had higher accuracy in both experiments. This is the cleanest comparison in the paper, and it supports "the words and symbols chosen for keywords affect novices."
- No difference was detected between Java or Perl and the placebo language, while Ruby, Python, and Quorum were significantly higher. That does not mean "C-style syntax is no better than random": each group had only 11 to 13 people, Java and Perl still averaged higher than the placebo, and when Ruby, Python, and Quorum were compared directly with Java and Perl, only Ruby vs. Java was significant.
- On the equality test, only 1 of the 48 students using Java, Perl, Python, or Ruby wrote `==` correctly; Quorum's `=` was written correctly far more often. This is a description of a single task, with no statistical test.
- A detail pointing the other way: Quorum's then, added to read like English, and Ruby's in both had very low novice accuracy. The authors' conclusion is that adding English words does not necessarily help novices.

The authors designed Quorum. Quorum's advantage over Perl in study 3 did not reappear in study 4, which the authors themselves call a partial non-replication.

### Identifier names

Johannes Hofmeister and colleagues' [2017 experiment](https://doi.org/10.1109/SANER.2017.7884623) recruited 72 professional C# developers in Germany, with an average of 14 years of programming. Each read 15-line functions to find semantic defects, and the variables in the same code came in three styles: full English words, machine-made three-consonant abbreviations (request became rqs), and single letters.

- With full words, participants found 19% more defects per minute (compared with the other two combined). This is a speed measure; converting from its table, I get median times about 14% to 16% shorter.
- No difference was detected between abbreviations and single letters. So the data support "full word or not," not the title's "shorter takes longer."
- For syntax errors (a missing bracket or semicolon), no difference was detected among the three styles.
- In the abbreviation and single-letter versions, a comment at the top of the code already listed what each name meant, and readers spent more time going back to read it.

The authors' own caveats: the abbreviations were machine-made, and common abbreviations (like i in a loop) may carry no cost; the participants were professionals, and novices need separate testing; very long names might hurt comprehension instead, which has not been tested.

## Formulas: how many, and in the main text or an appendix

### Equation density and citations

Tim Fawcett and Andrew Higginson's [2012 study](https://doi.org/10.1073/pnas.1205259109) took all 649 papers published in 1998 in three ecology and evolution journals, counted equations set on their own line per page, and compared that with later citation counts. Controlling for page count and journal, each additional equation per page in the main text went with 28% fewer citations; no association was detected for equations in appendices.

The data have several limits, some of which the authors stated in their later replies:

- It is a correlation, not causation. In-line expressions were not counted.
- The missing citations came from non-theoretical papers. No main effect was detected for citations from theoretical papers; in long papers, equation-heavy ones were actually cited more by theoretical papers (significant when main text and appendix were combined, only close to significant once they were separated).
- A letter in the same journal reanalyzed the same data and found that in one of the three journals, papers with higher equation density were cited more. The original authors acknowledged this in their reply.
- The authors' first recommendation was to add explanatory text between equations; moving them to an appendix was second best. In their reply they narrowed the claim: the problem is not equations but equations without enough text explaining their assumptions and implications. "We do not recommend the indiscriminate removal of equations from scientific papers."

The physicists Jonathan Kollmer and colleagues ([2015](https://doi.org/10.1088/1367-2630/17/1/013036)) made the same grouped charts for the first 1,000 papers in each of two volumes of Physical Review Letters. Average citations likewise fell as equation density rose, but they judged the decline to lie within very long error bars and therefore unreliable. They ran no statistical test, and their error bars were standard deviations. In a 2016 [comment](https://doi.org/10.1088/1367-2630/18/11/118003), the original authors ran a regression on the same physics data and found 6% fewer citations per additional equation per page, much weaker than in biology but significant. The physicists' [reply](https://doi.org/10.1088/1367-2630/18/11/118004) turned the step of excluding papers cited more than 100 times back on the biology data, and the biology coefficient was no longer significant (the point estimate was still negative).

The dispute is about method: grouped charts or regression, whether a handful of highly cited papers should count, and whether a correlation supports "use fewer equations and you'll be cited more." Both sides agree that citation data are noisy and that equation density explains only a small part. **Neither side measured whether readers understood anything**; citation counts are a long way from "readers understood less."

### How authors make formulas easier to read

Head and colleagues' [2022 study](https://doi.org/10.1145/3491102.3501932) catalogued 281 augmented formulas in 47 documents and then interviewed 12 of the authors. The documents started from a list devoted to "interesting notation design," and the interviewees were picked from those for especially elaborate augmentations, so the percentages below describe only this hand-picked set of examples.

- The most common augmentation was color: 70% of documents used color at least once to link part of a formula to the text, a figure, or another formula. Next came text labels, which were usually a single phrase.
- Nearly half of the augmentations applied to a whole expression; single identifiers made up only about three in ten. Most formulas augmented only some of their symbols.
- The authors said the work was laborious. One reported spending an average of an hour per formula, and eight exported LaTeX as images and augmented them in slide or drawing software. Some worried that too much color stops working, or that with many labels readers don't know where to start.

In their limitations, the researchers write that interviews capture only authors' beliefs and cannot say how formulas should be augmented; finding out whether augmentations help readers requires empirical studies.

**The gap in this section**: I found no study, with reader comprehension as the outcome, of whether the way math notation is written affects understanding. The literature review in Head and colleagues' 2022 paper summarizes a study reporting that readers did worse on a comprehension test after reading a math text with symbols than after reading a prose-only version. I have not read that study and do not rely on it.

## Where the sources differ

The following pairs look like conflicts, but mostly they measure different things. I list them side by side without picking a winner.

**Do definitions help?** In Bullock and colleagues' experiment, mouseover definitions did not bring self-rated fluency back up. In Yanagisawa and colleagues' meta-analysis, glosses (including hyperlinked glosses that appear only on a click or mouseover) helped foreign-language learners remember more unknown words. ScholarPhi made researchers faster at finding information, with no change in accuracy. The readers (general public, language learners, researchers) and the outcomes (feelings, word learning, lookup speed) all differ.

**Does jargon always cost something?** In Bullock's experiment and on Shulman's policy topic, jargon made the text feel harder; on Shulman's COVID-19 topic, it did not. In the same Shulman data, controlling for fluency, jargon versions were rated as more credible.

**Should a gloss sit close to the word or further away?** In Yanagisawa's meta-analysis, in-text glosses placed right after the word had the lowest point estimate, which the authors speculate is because readers don't have to process the word. ScholarPhi puts the definition directly below the word so readers' eyes need not leave the text, and in its pilot studies some readers preferred tooltips over a sidebar because they didn't lose their place. The first measured word learning; the second never compared placements.

**Are plain words better?** In Stefik's surveys, novices rated repeat as more intuitive than for, and in the experiments, Quorum's repeat was also used correctly more often than Ruby's for. In the same paper, then and in, added to read like English, had very low novice accuracy.

**Is translating into the native language better?** In the Scratch data, native-interface users grew slightly faster afterward (from a lower start, with a very small gap). In Guo's survey, a small group preferred English over translations, complaining that the terms had been translated away. The first is observational data on fully translated interfaces with a median user age of 15; the second is what self-taught learners with good English reported.

**Equation density and citations.** Fawcett and Higginson found a negative correlation by regression and reproduced it, more weakly, on the physics data. Kollmer and colleagues held that the data are too noisy to support a conclusion, and by excluding highly cited papers made the biology coefficient non-significant. A letter at the time also found the opposite direction in one of the three journals.

## Checking this site's practices

Below, based on the writing spec, site code, and article conventions in the working directory as of 2026-10-14, I match each practice related to terms and notation against the sources in this article. The middle column is what the research I read says; "this site's choice" means no research addresses the question.

| What this site does now | What the sources here say | Verdict |
|---|---|---|
| The writing guide's word-replacement table for Taiwan usage. This is a rule for the Chinese versions only: Chinese written in Taiwan and in mainland China often use different words for the same thing, and the table lists the Taiwan form to use (e.g., "stack" is always 堆疊, following the cross-strait comparison in Taiwan's official terminology database) | None of these studies compares regional variants within one language | This site's choice |
| The writing guide warns against rigid literal translation of terms in Chinese (e.g., rendering "framing" as 框架, literally "frame," often doesn't make sense) | Guo's respondents complained that terms were translated away and preferred the original; the writing guide is about how to translate into natural Chinese. These are different issues | This site's choice |
| The writing guide's "fluency > term density" | That rule comes from research on what generative search engines cite, i.e., being cited by AI, not reader comprehension. Bullock's "processing fluency" is a different, self-rated concept that points the same way | Different grounds; they can't support each other |
| Inline glossary: a known term is underlined the first time it appears, and hovering or clicking opens an explanation box. When the code finds a model API key, the explanation is generated by a language model from the surrounding context; otherwise it uses the definition written in the term list. The production Worker has a Groq key set and the model provider set to groq (checked by setting names during review on 2026-10-14); whether the key is valid or has quota was not verified. Each time a reader opens a box, the code adds a count to a lookup-stats table in the database (term, article, level). Within one page view, each term and level is counted once; switching between beginner and advanced or reloading the page adds another count; a mouse passing over a term also triggers it, so the count does not mean the definition was actually read. I have not looked at these statistics | Bullock: this kind of tooltip did not bring fluency back up, and nobody recorded how many people looked. ScholarPhi: tooltips were the most used feature, lookups were faster, accuracy did not change, the definitions in the study were curated by hand, and incomplete information from the tool misled readers | A supplement, with only adjacent evidence; when a model generates the explanation, the risk ScholarPhi describes of misleading readers applies directly. Not a substitute for a plain explanation in the body |
| The frontmatter glossary field: "only add words whose lack of explanation would affect understanding" | No research addresses "which words should get a definition" | This site's choice |
| A convention in this site's articles (not written into the spec): in the Chinese versions, a term's first appearance is written as "Chinese term (English original, abbreviation)," e.g., 約束滿足問題（constraint satisfaction problem，CSP） | In the gloss meta-analysis, glosses right after the word were weakest for word learning, but the goal is different; Guo's respondents wanted inline dictionaries and did not want terms translated away; no study has tested pairing Chinese with English | This site's choice |
| The two Chinese translations of "constraint" in CS50 AI Week 3, plus a sentence saying they are the same word | Not tested directly. In ScholarPhi's pilot studies, when one symbol had several meanings, readers wanted to know which one applied in the passage at hand | This site's choice, with an adjacent observation |
| Posts with formulas must set `math: true`, or the source is shown | No research needed: without rendering there is no notation to read | A precondition at the display layer |
| The spec does not require explaining symbols below a formula | Fawcett and Higginson's first recommendation was explanatory text between equations; the authors in Head 2022 often used labels and color to link formulas to text; neither has reader data | No reader evidence; see the suggestions below |

## What you can do

These are my judgments from the results above. Each one gives its basis and what it cannot reach.

1. **The first time a key term appears, explain it in a plain sentence in the body; treat glossaries and tooltips as a supplement.** Basis: in Bullock's experiment the plain version read more smoothly, and mouseover definitions did not bring the jargon version back up; ScholarPhi's readers did use tooltips, but were misled when the tool's information was incomplete. What it can't reach: no study has tested "keep the term and add a plain sentence next to it," which part 9 already lists as an inference.
2. **Use one word for one concept throughout. If you must use two (for example, when two fields translate "constraint" differently), explain the relationship the first time the second word appears. The same goes for a symbol that means different things in different sections.** The only basis is ScholarPhi's observation: when the symbol T had several meanings, readers wanted to know which one applied, and when the tool left one out, readers answered wrong. This is adjacent evidence, not a controlled experiment.
3. **Use full English words for variables in code examples; conventions every reader knows (i in a loop) can stay.** Basis: in Hofmeister's study full words led to faster bug finding, and the authors themselves say common abbreviations may cost nothing. What it can't reach: the participants were professional developers, not people reading a teaching article.
4. **Below every formula set on its own line, add a sentence or two on what each symbol is and what the formula says.** Basis: Fawcett and Higginson themselves said in their reply that the problem is equations lacking explanatory text; the authors in Head 2022 used labels to do the same. Neither has reader data, so this one is entirely my judgment.
5. **When you think "this notation is intuitive," have someone outside the field read it.** Basis: in Stefik's surveys, experienced students' ratings of familiar syntax rose with their years of experience, and novices rated differently; Guo's respondents also suggested testing materials with non-native readers.

I did not include "term density should not exceed X": I found no study that sets a threshold.

## Three things you can do tonight

Pick a teaching article you've written; about an hour:

1. Search the text for one thing that goes by two names (inconsistent translations, mixed Chinese and English, an abbreviation alternating with the full name) and make it consistent. If you can't, add a sentence where the second name first appears: "X here is the same thing as Y earlier."
2. Find every formula set on its own line and make sure there is a sentence below it saying what each symbol stands for. Add one where it's missing.
3. Rename the variables you abbreviated on the fly in code examples (`res`, `tmp`, `cnt`) to full English words, then run the code again to confirm the result hasn't changed.

## Limits of this evidence

- **None of these studies compares two ways of writing notation or terms with reader comprehension as the outcome.** The closest are foreign-language glosses (word learning), the jargon experiments (self-rated fluency), and ScholarPhi (lookup time and accuracy).
- **The participants are not this site's readers.** The jargon experiments used members of the US public reading short popular-science texts; the gloss meta-analysis covers foreign-language learners, over 90% of them studying a language in a country where it isn't spoken; ScholarPhi had researchers reading one machine learning paper; the naming experiment had German developers with an average of 14 years' experience; the syntax experiments had US college students who had never programmed; in the Scratch data, users' self-reported median age was 15.
- **All the materials were short.** Three sentences per passage in the jargon experiment; about 280 words for the public-information texts; 15 lines of code in the naming experiment; a few minutes per task in the syntax experiments.
- **The formula studies measure citations**, and the dispute never settled.
- **Observational and self-report data**: Fawcett, Kollmer, and Scratch are correlational. Guo is an open-ended survey whose denominator is the people who answered that question; not mentioning a difficulty doesn't mean not having it.
- **Small samples**: ScholarPhi had 27 people, one question per interface each; the syntax experiments had 6 to 13 per group, and the token-level percentages were not tested.
- **Conflicts of interest**: Stefik designed Quorum, one of the languages tested; Guo created the site where the survey ran.
- **Chinese and Japanese literature is not covered at all**, and this round found no full text to read closely from math education research on understanding symbols.
- **My inferences appear in six places**: extending the jargon experiments to teaching articles; that gloss placement might work in opposite directions for comprehension and for word learning; the five items under "What you can do"; the three things to do tonight; the verdict on this site's glossary; and the verdict on pairing Chinese with English. Each is flagged in the text.
- **Secondhand**: I have not read the study summarized in Head 2022's literature review, the one where a math text with symbols led to worse comprehension.
- **Read but not cited**: the page source of "Research Debt" contains a sentence saying the cost falls mainly on newcomers, but that passage is commented out and does not appear on the published page, so I cite only the displayed text.
- **Versions**: for Yanagisawa I read the accepted manuscript, for Head 2021 the third arXiv version, for Hofmeister the author's manuscript, and for Guo the final version on the author's homepage. Except for Guo, I did not check these against the published versions. Hofmeister also has an expanded 2019 journal version that I could not read.

## Appendix: study designs and numbers

The body keeps one or two numbers per item; the rest are here.

**Bullock, Colón Amill, Shulman, and Dixon (2019)**, Public Understanding of Science 28. A 2 (jargon / plain) × 2 (mouseover definitions / none) between-subjects design. Qualtrics online US sample; 650 recruited, with group sizes and degrees of freedom corresponding to 640 (jargon 328, plain 312; definitions 323, none 317); the paper does not account for the missing 10. Three passages of three sentences each, 10 terms per passage in the jargon version, the same word count across versions, at least 4 seconds on screen per passage. Processing fluency: jargon 4.57 (SD 1.11), plain 5.27 (SD 0.90), F(1, 636) = 76.03, η² = .11; main effect of definitions F = 0.37, p = .543; interaction F = 0.17, p = .678. Serial mediation models: jargon affected perceived risk and support indirectly through fluency and motivated resistance to persuasion; in the model predicting support, the definition condition had B = .22, p < .05. Limitations the authors list: an online, non-representative sample; messages without images or context; three messages per person; no direct measure of comprehension; mouseover definitions introducing the behavior of searching for definitions; mediation tested on cross-sectional data.

**Shulman and Bullock (2020)**, PLOS ONE 15(10). A 2 (jargon) × 3 (topic) between-subjects design, 393 MTurk participants, 2020-03-24 to 04-04. Three pages: a 78-word introduction, a 105-word topic passage (20 terms in the jargon version; the paper doesn't say whether the 20 count only this page), and 98 words of recommendations, with the same recommendations page for all three topics. Raw fluency means: COVID plain 5.22, jargon 5.32; flood 4.95, 4.48; policy 5.28, 4.53. Conditional effect of jargon on fluency: COVID B = 0.11 (95% CI −0.31 to 0.54); flood −0.47 (−0.90 to −0.04); policy −0.74 (−1.17 to −0.30). Jargon × flood (relative to COVID) −0.59 (−1.19 to 0.02); jargon × policy −0.85 (−1.46 to −0.24). Direct effects of jargon controlling for fluency: resistance −0.29, credibility +0.35, risk +0.33, severity 0.01 (not significant). For COVID vs. flood, the indices of moderated mediation for all four outcomes touched or crossed zero. Pay batch on fluency: −0.67. Limitations the authors list: one message set per topic; COVID terms possibly more familiar; an MTurk sample; a pay-batch confound that cannot be separated.

**Yanagisawa, Webb, and Uchihara (2020)**, Studies in Second Language Acquisition 42(2); I read the accepted manuscript and the online appendices on the publisher's site. A three-level meta-regression of 42 studies, 3,802 participants, and 359 posttest scores, limited to incidental learning (participants did not know they would be tested on vocabulary). The effect measure is the share of previously unknown words that were learned. Glossed vs. unglossed: immediate 45.3% (k = 39) vs. 26.6% (k = 27); delayed (an average of 15.9 days later) 33.4% vs. 19.8%. Each form minus no gloss (percentage points, immediate / delayed): multiple-choice 25.2 / 15.6; hyperlinked 18.4 / 15.2; margin 17.8 / 12.8; end-of-text glossary 17.4 (k = 2, CI −27.7 to 62.5, not significant) / 10.4 (not significant); interlinear 16.0 (k = 1) / no data; in-text 11.0 (k = 4, not significant) / 6.5 (not significant). Pairwise comparisons on the immediate test: multiple-choice above in-text (14.2), interlinear, and margin; interlinear above in-text; no pair significant on the delayed test. Language: native 20.3 / 16.1, foreign 16.3 / 10.9, native plus foreign 23.7 / 16.0 (k = 3); native vs. foreign immediate p = .075, delayed difference 5.2 (p = .048). Text comprehension and the gloss effect acted independently. The manuscript's text and tables disagree in several places; this article follows the tables.

**Head, Lo, Kang, Fok, Skjonsberg, Weld, and Hearst (2021)**, CHI '21; I read the third arXiv version. A formative study with 9 people; four pilot studies with 24 researchers in total, yielding seven design motivations; a formal study with 27 people (18 PhD students, 5 master's students, 3 undergraduates, 1 researcher), within-subjects across three interfaces, three lookup questions, 4 minutes each. Full tool vs. plain reader: time −45.4 seconds (p = .0001), rated ease +1.70, confidence +0.78, area of the paper viewed −25 percentage points; difference in accuracy 0 (p = 1.000). Full tool vs. dimming-only version: time −27.6 seconds (p = .015); dimming-only vs. plain reader was not significant on time. Correct answers: full tool 16, dimming-only 20, plain reader 16 (of 27 each). Free reading: 24 of 27 opened a symbol tooltip (median 10 times), 26 opened a term tooltip (median 5 times), 21 opened an equation diagram, and 6 looked at the front glossary for 10 seconds or more. Automatic extraction on the study paper: abbreviation expansion precision 55%, recall 43%; term and symbol definitions precision 24%, recall 6%. Limitations the authors list: one paper and three questions, short free-reading time, remote sessions, hand-extracted definitions.

**Head, Xie, and Hearst (2022)**, CHI '22. Content analysis: 47 documents (15 web articles, 10 research talks, 6 textbook chapters, and others), 281 formulas set on their own line, and 1,182 augmentations (excluding spacing); an average of 4.2 per formula, median 3. What was augmented: identifiers 31.4%, other expressions 49.9%, whole formulas 9.1%. Of formulas with at least one augmented identifier, 68.1% also had an identifier that was not augmented. Font color appeared in 41.6% of formulas and 70.2% of documents; labels in 48.9% of documents, and 75.9% of text labels were a single phrase. Interviews with 12 authors (only 2 were educators): 8 used drawing software to augment; one spent an average of an hour per formula, another 20 minutes adjusting labels in LaTeX; a formula with 8 identifiers and 4 colors took 414 characters of LaTeX. The researchers' limitations: the sample was hand-picked, frequencies may not be representative, and the interviews cannot say how formulas should be augmented.

**Fawcett and Higginson (2012)**, PNAS 109(29); I read the full text on PMC plus four letters and the authors' reply from the same period. All 649 papers from 1998 in Evolution, Proceedings B, and The American Naturalist; only equations set on their own line were counted; mean density 0.43 per page; 247 papers had any equations. Negative binomial regression controlling for page count and journal. Main text and appendix combined: all citations 22% fewer per additional equation per page, non-theoretical citations 27% fewer, no association detected for theoretical citations (rate ratio 0.97, p = .735). Separated: main-text density, all citations 28% fewer (rate ratio 0.72, 95% CI 0.57–0.92), non-theoretical 35% fewer; appendix density rate ratio 0.99 (0.65–1.52), no association detected. Keeping only the 247 papers with equations gave similar results. Gibbons's letter added a journal interaction and found a main-text density rate ratio of 2.1 for The American Naturalist; the authors' reply acknowledged that the effect differed between journals and wrote, "We do not recommend the indiscriminate removal of equations from scientific papers." Another letter (Kane) proposed expandable boxes inside the main text, without data.

**Kollmer, Pöschel, and Gallas (2015)**, New Journal of Physics 17. The first 1,000 papers in each of Physical Review Letters volume 94 (2005) and volume 104 (2010), counting equations set on their own line, with citation counts including self-citations. The paper has no statistical tests, only bar charts of group means and standard deviations. With the original paper's four groups, average citations likewise fell with density, which the authors judged to lie within the error bars. Their critique of the biology data: the grouping changes the shape of the chart; looking at all citations without controlling for page count shows no monotonic decline; and the two most cited papers both had high equation density.

**Higginson and Fawcett (2016) comment; Kollmer and colleagues (2016) reply**, New Journal of Physics 18. The comment's analysis details are on Zenodo: physics data, n = 1,906, negative binomial regression (density, volume, and their interaction), rate ratio 0.94 per additional equation per page (95% CI 0.90–0.98, p = .002), i.e., 6% fewer citations; 8% fewer after excluding the 97 papers cited more than 100 times; 5% fewer after further excluding papers with no equations. The comment also extrapolates from the model that halving density would have brought 476 more citations. The reply applied the exclusion of highly cited papers to the biology data: density coefficient −0.101 (p = .171); I convert this to a rate ratio of about 0.90, still negative. The reply also argues the two volumes shouldn't be pooled, offers an alternative explanation based on the size of subfields, and says it never denied that a correlation exists.

**Stefik and Siebert (2013)**, ACM Transactions on Computing Education 13(4). Two surveys of 166 people each (computer science students, split by programming experience). Study 3: 18 people, 6 each on Quorum, Perl, and the placebo language Randomo, mean accuracy .628, .432, .341; Quorum vs. Randomo p = .004, vs. Perl p = .047; Perl vs. Randomo p = .458. Study 4: 72 people, six languages, 11 to 13 per group: Ruby .558, Python .528, Quorum .508, Perl .429, Java .396, Randomo .344. Significantly above Randomo: Ruby (p = .003), Python (p = .011), Quorum (p = .033); not significant: Java (p = .922) and Perl (p = .573). Among the real languages, only Ruby vs. Java was significant (p = .044). Quorum's repeat was used correctly 58% of the time, Ruby's for 18%. Ratings of C++ examples rose with self-reported years of C++, regression R² about .09. Quorum vs. Perl from study 3 did not reappear in study 4 (p = .655).

**Hofmeister, Siegmund, and Holt (2017)**, SANER 2017; I read the author's manuscript. 221 started, 72 were included (German professional C# developers, mean age 35.3, 14.0 years of programming experience). Three naming styles within subjects, six 15-line functions, with only 7 lines visible at a time. Semantic defects found per minute: full words 0.78, abbreviations 0.65, single letters 0.66; words vs. non-words t(71) = 2.73, p = .004, d_z = 0.32; abbreviations vs. letters t(71) = 0.07, not significant. Syntax task F(2, 142) = 0.8, not significant. Naming style affected time spent reading the comment at the top (semantic task η² = .07). The paper does not say whether its p-value is one- or two-tailed; from the t value I estimate a two-tailed p of about .008, which is my own calculation.

**Guo (2018)**, CHI 2018. An open-ended survey on Python Tutor, December 2016 to August 2017, 840 responses (184 native English speakers, 656 non-native) from 86 countries. Non-native speakers' self-rated English reading: beginner 3%, intermediate 14%, proficient 44%, fully fluent 39%. Difficulties (non-native self-report, N = 384 / native speakers observing others, N = 178): reading instructional materials 35% / 29%, technical communication 24% / 49%, reading code 16% / 38%, writing code 11% / 28%, learning English and programming at once 17% / 8%. Changes wanted (N = 464): simplified English 36%, diagrams and multimedia 23%, examples 21%, inline dictionaries 21%, prefer the English original 7%. Two people coded the responses together; no agreement statistic.

**Dasgupta and Hill (2017)**, Learning @ Scale 2017. 15,015 Scratch users in Portugal, Italy, Brazil, Germany, and Norway, with 79,934 projects that had language data; mixed-effects Poisson regression. With controls: main effect of the localized interface −0.056, interaction with (logged) project count +0.027. A user at the 95th percentile (16 projects): 37.1 block types with the English interface, 37.9 with the localized one; with the starting gap artificially set to zero, 37.1 vs. 40.1. Users shared a median of 3 projects and a mean of 6. Limitations the authors list: correlation, not causation; community content mostly in English; native language inferred from country; the outcome cannot measure understanding.

**Olah and Carter (2017)**, Distill. An essay, with no data. The page lists four forms of research debt: poor exposition, undigested ideas, bad abstractions and notation, and noise.

## References

Every entry was read from start to finish, with an extraction record kept; anything I could not read is noted in parentheses.

- [Bullock, Colón Amill, Shulman & Dixon (2019), Jargon as a barrier to effective science communication: Evidence from metacognition](https://doi.org/10.1177/0963662519865687) ([full text on the website of Ohio State's School of Communication](https://comm.osu.edu/sites/comm.osu.edu/files/PUS%202019-%20Bullock%20et%20al..pdf); online supplementary material not read).
- [Shulman & Bullock (2020), Don't dumb it down: The effects of jargon in COVID-19 crisis communication](https://doi.org/10.1371/journal.pone.0239524) (published version and three supporting files; the data on OSF not read).
- [Yanagisawa, Webb & Uchihara (2020), How do different forms of glossing contribute to L2 vocabulary learning from reading? A meta-regression analysis](https://doi.org/10.1017/S0272263119000688) ([accepted manuscript on a co-author's site](https://takumiuchihara.weebly.com/uploads/1/2/3/7/123756989/yanagisawa-webb-uchihara-2019-glossing_meta-analysis.pdf) and the online appendices on the publisher's site; published version not read; the formula images and funnel plots in the appendices not seen).
- [Head et al. (2021), Augmenting Scientific Papers with Just-in-Time, Position-Sensitive Definitions of Terms and Symbols](https://doi.org/10.1145/3411764.3445648) ([third arXiv preprint version](https://arxiv.org/abs/2009.14237)).
- [Head, Xie & Hearst (2022), Math Augmentation: How Authors Enhance the Readability of Formulas using Novel Visual Design Practices](https://doi.org/10.1145/3491102.3501932) (published version; coding manual and supplementary material not read).
- [Fawcett & Higginson (2012), Heavy use of equations impedes communication among biologists](https://doi.org/10.1073/pnas.1205259109) ([full text on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3406806/); the per-paper data in Dataset S1 not read).
- Letters and reply from the same period: [Gibbons (2012)](https://doi.org/10.1073/pnas.1212498109), [Fernandes (2012)](https://doi.org/10.1073/pnas.1211892109), [Kane (2012)](https://doi.org/10.1073/pnas.1212310109), [Fawcett & Higginson (2012), Reply](https://doi.org/10.1073/pnas.1213721109).
- [Kollmer, Pöschel & Gallas (2015), Are physicists afraid of mathematics?](https://doi.org/10.1088/1367-2630/17/1/013036) (published version).
- [Higginson & Fawcett (2016), Comment on 'Are physicists afraid of mathematics?'](https://doi.org/10.1088/1367-2630/18/11/118003) (analysis details in a [Zenodo document](https://doi.org/10.5281/zenodo.58792)).
- [Kollmer, Pöschel & Gallas (2016), Reply to Comment on 'Are physicists afraid of mathematics?'](https://doi.org/10.1088/1367-2630/18/11/118004).
- [Stefik & Siebert (2013), An Empirical Investigation into Programming Language Syntax](https://doi.org/10.1145/2534973) (published version; the authors' replication packet not obtained).
- [Hofmeister, Siegmund & Holt (2017), Shorter Identifier Names Take Longer to Comprehend](https://doi.org/10.1109/SANER.2017.7884623) ([author's manuscript on the research group's publications page](https://www.se.cs.uni-saarland.de/publications/docs/HoSeHo17.pdf); the IEEE published version and the 2019 journal version not read; figures read only through their captions).
- [Guo (2018), Non-Native English Speakers Learning Computer Programming: Barriers, Desires, and Design Opportunities](https://doi.org/10.1145/3173574.3173970) ([final version on the author's homepage](https://pg.ucsd.edu/publications/non-native-english-speakers-learning-programming_CHI-2018.pdf)).
- [Dasgupta & Hill (2017), Learning to Code in Localized Programming Languages](https://doi.org/10.1145/3051457.3051464) (published version).
- [Olah & Carter (2017), Research Debt](https://doi.org/10.23915/distill.00005) ([Distill page](https://distill.pub/2017/research-debt/); revision history not read).
- On this site: [Writing the Examples and Openings of a Teaching Article](/posts/learning/2026-10-13-teaching-text-evidence-en), [Writing Questions and Wording in a Teaching Article](/posts/learning/2026-10-13-teaching-text-questions-feedback-en), [When a Teaching Article Should Use a Diagram](/posts/learning/2026-10-13-diagrams-in-teaching-articles-en), [Harvard CS50 AI Week 3](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en).

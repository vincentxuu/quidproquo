---
title: "CS2881R Final Projects and Retrospective: 19 Student Papers, the Rubric, and Lessons from Year One"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, research-project, retrospective]
lang: en
series:
  name: "Reading Harvard CS2881R"
  order: 15
tldr: "The Fall 2025 final project in Harvard CS 2881R came in two flavors: extend an existing paper, or start longer-term research with a theory of change. Teams submitted a 5–10 page NeurIPS-style paper plus a poster, graded 65 for the writeup, 15 for code, and 20 for the poster. The projects page lists 19 papers, and about half cluster around persona vectors and chain-of-thought monitoring. The head TA and the Harvard Q-report point to the same problem: the final project started too late, the rubrics came out too late, and feedback was the lowest-rated item in the course."
description: "The final part of the Harvard CS 2881R AI Safety (Fall 2025) series. It breaks down the final project outline and rubric, groups the 19 student papers by theme and maps them back to lectures, lists the seven talks in the 75-minute oral presentation video, and uses head TA Roy Rinberg's retrospective, Boaz Barak's mid-semester notes, and the Harvard Q-report to show what worked in this first offering and what needs to change."
glossary:
  - term: "Theory of change"
    definition: "An account of the path by which a piece of research, if it succeeds, would make AI safer."
    context: "The CS 2881R final project outline and rubric both require a theory of change; the rubric gives it 10 points."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs2881r-final-projects-retrospective)

**Video status: Videos included.** [Source details](#course-video-sources)

**This post is based on the Fall 2025 term of Harvard CS 2881R.** It is part 15, the last part, of the [Reading Harvard CS2881R](/posts/ai/2026-09-30-cs2881r-course-overview-en) series. The previous part, [L12 AI 2035](/posts/ai/2026-09-30-cs2881r-lecture-12-ai-2035-en), covered the final lecture. This one answers two questions. What research did students produce over the semester? And where did the "reproduce, then extend" course design work, and where does it need fixing?

The first half is for readers who want to run a final project themselves: the spec, the rubric, the topic list, and how the 19 results are spread. The second half is for anyone planning a similar course, or deciding whether this one is worth following: how the TAs and students judged it afterward.

## Course video sources

The official Fall 2025 YouTube playlist (AI Safety, 17 videos) was checked live on 2026-10-10 and lists the final-project oral presentations recording (about 75 minutes). The section on the oral presentations in this article is based on that video.

```youtube
url: https://www.youtube.com/watch?v=Xr9FNl0S66Q
title: AI Safety (CS 2881) Oral presentations of student projects
```

Original videos: [AI Safety (CS 2881) Oral presentations of student projects](https://www.youtube.com/watch?v=Xr9FNl0S66Q)

Course and recording entries:

- [harvard-cs2881r — official course materials and recording index](https://boazbk.github.io/mltheoryseminar/fall2025/)
- [CS2881R Fall 2025 official YouTube playlist (AI Safety, 17 videos)](https://www.youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W)

Checked: 2026-10-10.

## Official materials and access

| Material | Contents | Status |
|---|---|---|
| [Student Projects page](https://boazbk.github.io/mltheoryseminar/student_projects) | 19 final paper PDFs, 17 poster PDFs, abstracts | Public |
| [Oral presentation video](https://youtu.be/Xr9FNl0S66Q) | "AI Safety (CS 2881) Oral presentations of student projects", 1:15:40, uploaded 2026-01-07 | Public |
| [Final Project Outline](https://docs.google.com/document/d/1cB_zHcHQuCua-UlwcbDwNaxN2YQEtp5vKHKmBS9_63I) | Team size, two project types, deliverables, timeline, topic list with mentors | Public (Google Docs) |
| [Final Project Grading Rubric](https://docs.google.com/document/d/1JA-p0g91_LIB-uTfbZ5PtOfk7KFkIoOC-odrwf-HAiM) | 100-point rubric | Public (Google Docs) |
| [Reflections on TA-ing Harvard's first AI safety course](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic) | Head TA Roy Rinberg's retrospective, 2026-01-15 | Public |
| [Learnings from AI safety course so far](https://www.lesswrong.com/posts/2pZWhCndKtLAiWXYv) | Boaz Barak's mid-semester notes, 2025-09-27 | Public |
| [Harvard Q-report](https://boazbk.github.io/mltheoryseminar/assets/q_report.pdf) | Official anonymous course evaluation, 8 pages | Public |

Everything this post uses is public. Two things are missing: each team's grades and TA feedback, and the teams not shown on the projects page. The head TA's retrospective says there were "about ~23 final projects", but the page lists 19 papers, and the gap is not explained.

The series-wide access grade (A3, with a gap list) is in the [series overview](/posts/ai/2026-09-30-cs2881r-course-overview-en).

## The final project spec

### Two flavors

The [Final Project Outline](https://docs.google.com/document/d/1cB_zHcHQuCua-UlwcbDwNaxN2YQEtp5vKHKmBS9_63I) sets teams at 2–4 students (solo or 5-person teams need prior approval) and offers two options:

- **Extension of existing work**: the same pattern as the [midterm mini-project](/posts/ai/2026-09-30-cs2881r-midterm-reproduction-project-en), reproducing and extending a paper's results, but with much more weight on the extension. Teams may build on their mini-project, and reproduction should be a small part of the final project.
- **Longer-term research**: requires a meaningful literature review, a proposal for future work, preliminary experiments, and a theory of change explaining how the project could produce safer AI.

The outline also says policy projects are welcome, but because the course heads are technical, they are approved case by case, and every project needs a technical component.

The head TA's retrospective gives an example of each. For the extension type, a [CoT faithfulness study](https://boazbk.github.io/mltheoryseminar/student_projects/final_papers_and_posters/papers/Report_-_Nicolas_Weninger.pdf). For the research type, two teams working on model fingerprinting ([1](https://boazbk.github.io/mltheoryseminar/student_projects/final_papers_and_posters/papers/CS2881_Final_Project_-_Annesya_Banerjee.pdf), [2](https://boazbk.github.io/mltheoryseminar/student_projects/final_papers_and_posters/papers/Dynamic_Model_Fingerprinting_-_Valerio_Pepe.pdf)) and one open-ended investigation of [AI-induced psychosis](https://boazbk.github.io/mltheoryseminar/student_projects/final_papers_and_posters/papers/final_project_cs2881r_-_Bright_Liu.pdf).

### What to submit, and when

- A 5–10 page paper, with an optional appendix of up to 10 pages. The outline doesn't prescribe contents, but it expects experimental results and orients around a NeurIPS-style ML paper.
- A poster, shown at the final presentation session.
- Timeline: sign up before November 13. Meet a TF by November 19, bringing a 2–4 paragraph summary, then post the summary to the sign-up sheet and Slack. Paper due December 3. Final presentations December 11, 3:45–6:30 PM.

The head TA's retrospective says students came "to class on December 10th with a printed out poster", one day off from the outline. The outline's December 11 is a Thursday, which matches the class slot on the course site (Thursdays 3:45–6:30). The retrospective also records the real pace: final projects started in early November with a deadline in early December.

On money, the retrospective says Boaz reimbursed about $50 per group for mini-projects and $500 per final project, and most students used much less. (The midterm spec slides say $200 of compute per project, so the two documents disagree.)

### The topic list

The second half of the outline is a list of project ideas the head TA gathered, most with a named mentor and time commitment. A footnote says: "we are explicitly biased, and you should feel very encouraged to pick projects outside of this list."

| Topic | Mentor (as listed) |
|---|---|
| Verifying that two ML computation graphs come from the same model (e.g., a model versus its speculative-decoding version) | Roy Rinberg |
| Black-box model fingerprinting and forensics | Roy Rinberg |
| Miscellaneous alignment (training models to output their mechanism, fine-tuning misuse of protein language models, emergent risks of prompt optimization) | Core Park |
| AI scams: improving [ScamBench](https://scambench.com/), a background-detection prototype, red-team/blue-team experiments | Fred Heiding |
| Unlearning evaluation benchmarks | Roy Rinberg |
| Countering online misinformation with LLMs and prediction-market math | Jonathan Schaffer |
| Extending Tim Hua's AI psychosis investigation | Tim Hua |
| GPU location verification (with Lucid Computing) | Lucid Computing |
| Value-system evaluation; reward model overoptimization | Hanlin Zhang |
| Assessing whether a jailbreak fine-tune removed safeguards intentionally | Roy Rinberg |

Reading lists on prompt injection and jailbreaks, and on watermarking and backdoors, follow the table. The head TA later estimated that about 5 projects came from this list.

## The rubric: writing is two-thirds of the grade

The [rubric](https://docs.google.com/document/d/1JA-p0g91_LIB-uTfbZ5PtOfk7KFkIoOC-odrwf-HAiM) totals 100:

| Section | Item | Points |
|---|---|---|
| Writeup (65) | Literature review | 10 |
| | Theory of change and motivation | 10 |
| | Methods and contributions | 15 |
| | Evaluation experiments | 15 |
| | Communication and clarity | 10 |
| | Reflection on robustness and limitations | 5 |
| Code & Reproducibility (15) | README and documentation | 5 |
| | Code quality and organization | 5 |
| | Reproducibility of results | 5 |
| Poster (20) | Clarity of the big picture | 5 |
| | Visual organization and readability | 5 |
| | Communication of key results | 5 |
| | Oral explanation and Q&A | 5 |

A few things worth noticing:

- **The top anchor for "Methods and contributions" accepts "one deep, well-executed contribution."** You don't need to do many things.
- **The top anchor for "Evaluation experiments" asks for "awareness of pitfalls,"** which echoes the final robustness item.
- **The poster's "key results" item says outright that it grades how clearly the takeaways come across, "not whether the results are good."**
- The three anchors for "Code quality" read 3 / 7 / 5. A 7 exceeds the item's 5-point cap, so this looks like a typo in the document. This post reports it as written and doesn't guess at the intent.

The literature review and theory of change together are worth 20 points, which matches what the outline asks of research-type projects.

## What students built: the 19 papers by theme

The [projects page](https://boazbk.github.io/mltheoryseminar/student_projects) lists 19 papers, all with PDFs and 17 with posters. The table below groups them by abstract. The grouping is this post's own, not an official course category, and each row points back to the relevant part of this series.

| Theme | Papers | Back in this series |
|---|---|---|
| Fine-tuning shifts model personality: personas and internal representations (5) | Mechanisms of Subliminal Learning; Predicting Finetuning Personality Shifts with Linear Directions; Are Personas All You Need?; Cross-Format Elicitation of Underlying Emotions; Feeling the Strength but Not the Source (partial introspection) | [HW0 emergent misalignment](/posts/ai/2026-09-30-cs2881r-hw0-emergent-misalignment-en), [L10 interpretability](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability-en) |
| Chain of thought and reasoning monitoring (4) | Obfuscation in LLMs; House, G.P.T. (diagnosing pathological CoT); Compute as a Safety Control; Evaluating CoT Faithfulness | [L8 scheming](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception-en), [L10](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability-en) |
| Attacks and data poisoning (2) | Improving GCG (Soft-GCG and activation objectives); Phase Transitions in Backdoor Learning | [L3 adversarial robustness](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness-en) |
| Model provenance and fingerprinting (2) | LLM Fingerprints From Normal Interaction; Who Said That? (GEPA and LLM-as-judge) | The head TA's topic list |
| Risks in real-world use (3) | Sure, I Can Draft a Complaint! (hallucination in pro se litigation); AI-induced Psychosis; Moral Choice and Collective Reasoning | [L11 emotional reliance](/posts/ai/2026-09-30-cs2881r-lecture-11-emotional-reliance-en) |
| Detection methods and alternative training (3) | When the Manifold Bends (geometric predictors of hallucination); Evaluating Orthogonal Projections (misinformation detection); Evolutionary Alignment (Evolution Strategies instead of RL) | [L2 LLM training](/posts/ai/2026-09-30-cs2881r-lecture-02-llm-training-en) |

The first two groups account for 9 papers, close to half. The head TA noticed the same pull: students preferred "flashy" topics covered in class, and he named [persona vectors](https://www.anthropic.com/research/persona-vectors) specifically.

A few papers show the "reproduce, then extend" skeleton clearly:

- **Feeling the Strength but Not the Source** reproduces Anthropic's emergent introspection result on Llama-3.1-8B-Instruct (20% accuracy, per the abstract) and finds it fragile across prompts. The extension: models can classify the strength of an injected concept vector.
- **Improving GCG** starts from GCG, one of the four candidate papers for the midterm mini-project. The team proposes Soft-GCG, which the abstract says runs 43x faster at the same attack success rate. On the Gemma 3 family, smaller models (1B–4B) stay vulnerable while 12B and up resist.
- **AI-induced Psychosis** comes from the Tim Hua entry on the topic list. The team reproduces Hua's evaluation on four frontier models, measures semantic drift over long conversations, and tests three interventions.
- **Evaluating CoT Faithfulness** is the head TA's example of an extension project. It asks when CoT remains a reliable signal once hints are embedded in the prompt.

For methods, numbers, and limitations, read the PDFs. This post only relays the abstracts on the projects page and doesn't vouch for the results.

## The oral presentation video: 7 teams, about 10 minutes each

At the start of the [oral presentation video](https://youtu.be/Xr9FNl0S66Q), the host sets 10 minutes per team: about 9 to present and 1 to switch. Going by the video's captions, seven teams presented over 75 minutes (start time is when each team begins speaking):

| Start | Project |
|---|---|
| [0:27](https://youtu.be/Xr9FNl0S66Q?t=27) | AI-induced Psychosis |
| [10:11](https://youtu.be/Xr9FNl0S66Q?t=611) | Who Said That? (dynamic model fingerprinting) |
| [20:33](https://youtu.be/Xr9FNl0S66Q?t=1233) | Improving GCG |
| [32:27](https://youtu.be/Xr9FNl0S66Q?t=1947) | Sure, I Can Draft a Complaint! (legal hallucination) |
| [42:24](https://youtu.be/Xr9FNl0S66Q?t=2544) | Phase Transitions in Backdoor Learning |
| [51:53](https://youtu.be/Xr9FNl0S66Q?t=3113) | Mechanisms of Subliminal Learning |
| [1:03:43](https://youtu.be/Xr9FNl0S66Q?t=3823) | Evolutionary Alignment |

The video has no chapters and no timestamps in its description; the table gives the time each team's first words appear in the auto-generated captions (checked 2026-10-01), and each time links straight to that team. The Q&A is worth watching as much as the talks. The backdoor team was asked whether its phase transition could be an artifact of QLoRA's 4-bit quantization. The Evolutionary Alignment team was asked whether ES might just be a form of regularization on GRPO. These are exactly the questions the rubric's robustness item wants students to raise themselves.

The other 12 teams appear only as papers and posters.

## Retrospective: the TA's view

The [head TA's retrospective](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic) is the fullest behind-the-scenes account of the course. It starts with scale. 274 people filled out the interest form. About 70 students enrolled, roughly half experienced undergraduates and the rest graduate students (about 20% of them PhDs). There was 1 professor and 4 TAs. The class met once a week for 3 hours, and most lectures relied on guest speakers.

### What the author says worked

- **Reproducing a headline figure is easy to grade.** In his words, grading needs something "hard to do and easy to verify." Recreating a paper's main figure is easy to check and still forces real engagement. Requiring a "meaningful spin-off" pushes students beyond running Claude Code on an existing codebase.
- **Mandatory TA meetings.** Students had to come prepared and do a lot of thinking on their own, and a TA who knows the problem space can quickly see where each team stands. The cost: the head TA had to hold each meeting to 30 minutes.
- **The midterm as a trial run for teams.** The mini-project let students find collaborators without locking them in.
- **Making student work visible.** Papers and posters went online, and students were encouraged to write up weekly experiments on LessWrong (11 posts, per the retrospective). That helps students build a record for work in AI safety.
- **A role for academia.** Many AI safety papers, he writes, have the flavor of "we tried a thing and it worked." Academia can pick those up and test how robust they are, when they break, and what the papers don't state.

### What the author would change

1. Start the final projects earlier.
2. Share rubrics earlier. In this first offering, rubrics often weren't ready when assignments went out.
3. Enforce the readings a bit more (not much).
4. Give the weekly student experiment presentations more structure and some credit. They took real work, counted for no grade, and couldn't substitute for other assignments.
5. Keep the topic list. Only about 5 teams used it directly, but he says he'd spend the same effort rebuilding it next time.

He is candid about two preconditions. The loose structure relied on students who wanted to learn and cared less about grades, and he thinks an undergraduate version would not have gone as well. And the course worked largely because the staff put in a lot of time.

## Retrospective: the students' view

### Boaz's mid-semester notes

[Boaz's late-September notes](https://www.lesswrong.com/posts/2pZWhCndKtLAiWXYv) name the weekly student experiments as the biggest surprise. He had worried the short timeline would leave groups with nothing to show, and found that even failed attempts were worth presenting. He also lists three open questions: the balance between technical and philosophical material; the fact that a breadth course (his phrase is "tasting menu") can't go deep on any topic; and the conflict of interest from his concurrent role on OpenAI's alignment team. Because weekly homework is hard in a course like this, he writes, there would be just a mini-project and a final project.

### The Harvard Q-report numbers

The [Q-report](https://boazbk.github.io/mltheoryseminar/assets/q_report.pdf) is Harvard's official evaluation, with a course audience of 65. Key numbers, on a 5-point scale:

| Question | Course mean | Department mean |
|---|---|---|
| Course overall (35 responses) | 4.43 | 3.99 |
| Course materials | 4.41 | 4.13 |
| Assignments | 4.19 | 3.79 |
| Feedback on work | 3.59 | 3.68 |

Feedback is the only item below the department mean and the lowest-rated item in the course; 9 students rated it Fair or worse. Other numbers: about 5.5 hours of coursework per week outside class (the report excludes answers of 31 hours or more), 53% rated the difficulty "Moderate", and 63% would "Recommend with Enthusiasm."

### Where student criticism concentrated

The Q-report comments and the Google Form summary (21 responses) attached to the head TA's retrospective point to the same issues:

- **Organization and timing**: the projects weren't on the syllabus at the start of term, and project details and grading criteria came late. Communication was split across Slack, Perusall, Google Forms, and a personal website, with nothing on Canvas.
- **Technical depth**: requests for more technical lectures, more interpretability, and optional problem sets.
- **Critical discussion**: one student felt the course treated industry AI safety work as settled, and wanted more whole-class debate and more time to question guest speakers. Some felt that recording nearly every session discouraged controversial discussion.
- **Reading load**: one suggestion was to excerpt papers, since 150+ pages of reading led people to start skimming early.

Praise concentrated on the guest speakers, the choice of readings, and replacing traditional assignments with small experiments.

## How to use this post

If you've followed the series this far, the next step is running a final project yourself:

1. **Pick a flavor.** If you have midterm reproduction code, go for an extension and keep reproduction small. If you want a longer-term topic, write the theory of change first.
2. **Start from the topic list or one of the 19 papers.** Read the limitations section of a student paper on your topic. It usually names the next extension.
3. **Work backward from the rubric.** The writeup is 65 points, so outline the literature review, evaluation design, and limitations before running experiments.
4. **Find a stand-in for the TA meeting.** The mandatory meeting before November 19 really forced students to write a 2–4 paragraph summary for someone else to read. Ask a peer or mentor to play that role.
5. **Watch the Q&A in the oral presentation video.** Treat every question that stumped a team as a checklist item for your own limitations section.

## Further reading

- Research-project methodology → [CS224U Final Project Workflow: Lit Review and Experiment Protocol](/posts/ai/2026-09-29-cs224u-lit-review-experiment-protocol-en)
- Interpretability tools (probing, attribution) → [CS224U analysis methods](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution-en)
- Evaluation risks of LLM-as-judge → [CS329Z Week 8: judges and safety](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety-en)
- How open each school's courses are → [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)

## Series navigation

- Previous: [L12 AI 2035](/posts/ai/2026-09-30-cs2881r-lecture-12-ai-2035-en)
- Series overview: [Reading Harvard CS2881R](/posts/ai/2026-09-30-cs2881r-course-overview-en)
- This is the last part of the series.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official playlist lists the final-project oral presentations recording, so it is now embedded and the status is Videos included.

## References

- [CS 2881R Student Final Projects – Fall 2025](https://boazbk.github.io/mltheoryseminar/student_projects)
- [AI Safety (CS 2881) Oral presentations of student projects (YouTube)](https://youtu.be/Xr9FNl0S66Q)
- [cs2881 Final Project Outline (Google Docs)](https://docs.google.com/document/d/1cB_zHcHQuCua-UlwcbDwNaxN2YQEtp5vKHKmBS9_63I)
- [Final Project Grading Rubric (Google Docs)](https://docs.google.com/document/d/1JA-p0g91_LIB-uTfbZ5PtOfk7KFkIoOC-odrwf-HAiM)
- [Roy Rinberg: Reflections on TA-ing Harvard's first AI safety course (LessWrong)](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic)
- [Boaz Barak: Learnings from AI safety course so far (LessWrong)](https://www.lesswrong.com/posts/2pZWhCndKtLAiWXYv)
- [2025 Fall Harvard FAS Course Evaluation: COMPSCI 2881R (Q-report PDF)](https://boazbk.github.io/mltheoryseminar/assets/q_report.pdf)
- [CS 2881R Fall 2025 course site](https://boazbk.github.io/mltheoryseminar/fall2025/)
- [CS 2881R YouTube playlist](https://youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W)
- [LessWrong wikitag: CS 2881r](https://www.lesswrong.com/w/cs-2881r)
